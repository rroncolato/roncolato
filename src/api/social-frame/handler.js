const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { listFiles, getFotosCliente, getFileStream, getThumbnailLink } = require('../../utils/google-drive');
const https = require('https');
const { getCatalogo, getClienteData } = require('./catalogo');
const { sincronizarNoLogin, iniciarAutoSync } = require('../../utils/social-frame-sync');

// Sync automático a cada 10 min (começa na primeira request do Social Frame)
iniciarAutoSync();

const TEMP_DIR = path.join(__dirname, '../../../.temp');

// Cria pasta temp se não existir
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Escolhe a foto de capa do cliente.
 * Prioridade: retrato > mais stars > tag Perfil > ordem alfabética.
 */
function escolherCapa(fotos, metadados) {
  const ranqueadas = fotos.map((f) => {
    const meta = metadados[f.name] || { stars: 0, tags: [] };
    const img = f.imageMediaMetadata || {};
    let { width = 0, height = 0, rotation = 0 } = img;
    if (rotation % 2 === 1) [width, height] = [height, width];

    return {
      id: f.id,
      name: f.name,
      retrato: height > width ? 1 : 0,
      stars: meta.stars || 0,
      perfil: (meta.tags || []).includes('Perfil') ? 1 : 0
    };
  });

  ranqueadas.sort((a, b) =>
    b.retrato - a.retrato ||
    b.stars - a.stars ||
    b.perfil - a.perfil ||
    a.name.localeCompare(b.name)
  );

  return ranqueadas[0].id;
}

async function handleSocialFrameRequest(req, res, pathname, method) {
  try {
    // POST /api/social-frame/admin  (login admin — retorna todos os clientes)
    if (pathname === '/api/social-frame/admin' && method === 'POST') {
      const senha = (req.body && req.body.password) || '';
      const senhaAdmin = process.env.SOCIAL_FRAME_ADMIN_PASS || process.env.ADMIN_PASS;

      if (!senhaAdmin || senha !== senhaAdmin) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Senha incorreta' }));
        return;
      }

      // Re-sincroniza em background a cada login admin (throttle 60s)
      sincronizarNoLogin();

      const catalogo = getCatalogo();
      const clientes = await Promise.all(
        Object.keys(catalogo).map(async (key) => {
          let capa = null;
          let totalFotos = 0;
          try {
            const { fotos } = await getFotosCliente(catalogo[key].folder_id);
            totalFotos = fotos.length;
            if (fotos.length > 0) capa = escolherCapa(fotos, catalogo[key].fotos || {});
          } catch (e) {
            console.warn(`Erro ao buscar capa de ${key}:`, e.message);
          }
          return {
            id: key,
            nome: catalogo[key].nome_completo || key,
            totalFotos,
            capa
          };
        })
      );

      res.json({ success: true, admin: true, clientes });
      return;
    }

    // GET /api/social-frame/fotos/:cliente
    const fotoMatch = pathname.match(/^\/api\/social-frame\/fotos\/(.+)$/);
    if (fotoMatch && method === 'GET') {
      const cliente = decodeURIComponent(fotoMatch[1]);
      const clienteData = getClienteData(cliente);

      if (!clienteData) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Cliente não encontrado' }));
        return;
      }

      // Lista fotos do Drive (subpastas viram coleções; raiz é ignorada se houver)
      const { colecoes, fotos: fotosGoogle } = await getFotosCliente(clienteData.folder_id);

      // Mescla com metadados
      const fotos = fotosGoogle.map((foto) => {
        const metadata = clienteData.fotos[foto.name] || { stars: 0, tags: [] };
        return {
          id: foto.id,
          nome: foto.name,
          colecao: foto.colecao || null,
          ...metadata,
          createdTime: foto.createdTime,
          modifiedTime: foto.modifiedTime
        };
      });

      res.json({
        success: true,
        cliente,
        nome_completo: clienteData.nome_completo,
        aliases: clienteData.aliases || [],
        colecoes,
        fotos,
        total: fotos.length
      });
      return;
    }

    // GET /api/social-frame/image/:fileId  (proxy de thumbnail — pasta é privada)
    const imageMatch = pathname.match(/^\/api\/social-frame\/image\/([a-zA-Z0-9_-]+)$/);
    if (imageMatch && method === 'GET') {
      const fileId = imageMatch[1];
      const size = parseInt(req.query.size, 10) || 800;

      const thumbLink = await getThumbnailLink(fileId, Math.min(size, 2000));

      if (!thumbLink) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Thumbnail não disponível' }));
        return;
      }

      // Proxy do thumbnail (link do Google expira, então streamamos na hora)
      https.get(thumbLink, (thumbRes) => {
        if (thumbRes.statusCode !== 200) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Erro ao buscar imagem' }));
          return;
        }
        res.writeHead(200, {
          'Content-Type': thumbRes.headers['content-type'] || 'image/jpeg',
          'Cache-Control': 'public, max-age=3600'
        });
        thumbRes.pipe(res);
      }).on('error', (err) => {
        console.error('Erro no proxy de imagem:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Erro ao buscar imagem' }));
      });
      return;
    }

    // GET /api/social-frame/file/:fileId  (download de foto única, original)
    const fileMatch = pathname.match(/^\/api\/social-frame\/file\/([a-zA-Z0-9_-]+)$/);
    if (fileMatch && method === 'GET') {
      const nome = String(req.query.name || 'foto.jpg').replace(/[^\w.\- ]/g, '');
      const stream = await getFileStream(fileMatch[1]);

      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${nome}"`
      });
      stream.pipe(res);
      return;
    }

    // POST /api/social-frame/download/:cliente
    const downloadMatch = pathname.match(/^\/api\/social-frame\/download\/(.+)$/);
    if (downloadMatch && method === 'POST') {
      const cliente = decodeURIComponent(downloadMatch[1]);
      const clienteData = getClienteData(cliente);

      if (!clienteData) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Cliente não encontrado' }));
        return;
      }

      // Lista fotos do Drive (inclui subpastas/coleções)
      const { fotos: fotosGoogle } = await getFotosCliente(clienteData.folder_id);

      if (fotosGoogle.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Nenhuma foto encontrada' }));
        return;
      }

      // Cria ZIP
      const zipPath = path.join(TEMP_DIR, `${cliente}-${Date.now()}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);

      // Adiciona fotos ao ZIP
      for (const foto of fotosGoogle) {
        try {
          const fileStream = await getFileStream(foto.id);
          archive.append(fileStream, { name: foto.name });
        } catch (error) {
          console.warn(`Erro ao adicionar ${foto.name} ao ZIP:`, error.message);
        }
      }

      await archive.finalize();

      // Aguarda conclusão
      await new Promise((resolve, reject) => {
        output.on('finish', resolve);
        output.on('error', reject);
      });

      // Envia arquivo
      res.setHeader('Content-Disposition', `attachment; filename="${cliente}-fotos.zip"`);
      res.setHeader('Content-Type', 'application/zip');

      const fileStream = fs.createReadStream(zipPath);
      fileStream.pipe(res);

      fileStream.on('end', () => {
        fs.unlink(zipPath, (err) => {
          if (err) console.warn('Erro ao apagar arquivo temp:', err);
        });
      });

      return;
    }

    // Rota não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Rota não encontrada' }));
  } catch (error) {
    console.error('Erro em Social Frame handler:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
}

module.exports = handleSocialFrameRequest;
