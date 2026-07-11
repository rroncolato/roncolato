// SOCIAL FRAME — API serverless (Vercel)
// Rotas: fotos/:cliente | image/:fileId | file/:fileId | admin | download/:cliente
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const FOLDER_ID = process.env.SOCIAL_FRAME_FOLDER_ID;

function getAuth() {
  // Na Vercel: credencial vem como string na env var.
  // Local: fallback pro arquivo em SOCIAL-FRAME/config/
  let credentials;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
    credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_PATH, 'utf8'));
  } else {
    throw new Error('Credencial Google não configurada');
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  });
}

let _drive = null;
function getDrive() {
  if (!_drive) _drive = google.drive({ version: 'v3', auth: getAuth() });
  return _drive;
}

function getCatalogo() {
  try {
    const p = path.join(process.cwd(), 'SOCIAL-FRAME', 'catalogo.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('Erro ao ler catalogo.json:', e.message);
    return {};
  }
}

function getClienteData(nomeCliente) {
  const catalogo = getCatalogo();
  const busca = String(nomeCliente).toLowerCase().trim();
  if (catalogo[busca]) return catalogo[busca];
  for (const dados of Object.values(catalogo)) {
    const aliases = (dados.aliases || []).map((a) => a.toLowerCase());
    if (aliases.includes(busca)) return dados;
  }
  return null;
}

async function listFiles(folderId) {
  const res = await getDrive().files.list({
    q: `'${folderId}' in parents and trashed=false and mimeType='image/jpeg'`,
    fields: 'files(id, name, createdTime, modifiedTime, imageMediaMetadata(width, height, rotation))',
    pageSize: 1000,
    orderBy: 'name'
  });
  return res.data.files || [];
}

async function getThumbnailLink(fileId, size) {
  const res = await getDrive().files.get({ fileId, fields: 'thumbnailLink' });
  const link = res.data.thumbnailLink;
  if (!link) return null;
  return link.replace(/=s\d+$/, `=s${size}`);
}

// Capa: retrato > stars > tag Perfil > nome
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
    b.retrato - a.retrato || b.stars - a.stars || b.perfil - a.perfil || a.name.localeCompare(b.name)
  );
  return ranqueadas[0].id;
}

export default async function handler(req, res) {
  // Parseia direto da URL: /api/social-frame/<acao>/<param>
  const partes = (req.url || '').split('?')[0].split('/').filter(Boolean);
  const idx = partes.indexOf('social-frame');
  const acao = partes[idx + 1];
  const param = partes[idx + 2];

  try {
    // GET /api/social-frame/fotos/:cliente
    if (acao === 'fotos' && param && req.method === 'GET') {
      const clienteData = getClienteData(decodeURIComponent(param));
      if (!clienteData) {
        return res.status(404).json({ success: false, error: 'Cliente não encontrado' });
      }

      const fotosGoogle = await listFiles(clienteData.folder_id);
      const metadados = clienteData.fotos || {};

      const fotos = fotosGoogle.map((f) => ({
        id: f.id,
        nome: f.name,
        stars: (metadados[f.name] && metadados[f.name].stars) || 0,
        tags: (metadados[f.name] && metadados[f.name].tags) || [],
        createdTime: f.createdTime,
        modifiedTime: f.modifiedTime
      }));

      return res.status(200).json({
        success: true,
        cliente: param,
        nome_completo: clienteData.nome_completo,
        total: fotos.length,
        fotos
      });
    }

    // GET /api/social-frame/image/:fileId — redireciona pro thumbnail assinado do Google
    if (acao === 'image' && param && req.method === 'GET') {
      const size = Math.min(parseInt(req.query.size, 10) || 800, 2000);
      const link = await getThumbnailLink(param, size);
      if (!link) return res.status(404).json({ success: false, error: 'Imagem não encontrada' });

      res.setHeader('Cache-Control', 'public, max-age=1800');
      return res.redirect(302, link);
    }

    // GET /api/social-frame/file/:fileId — download em resolução original (=s0)
    if (acao === 'file' && param && req.method === 'GET') {
      const res2 = await getDrive().files.get({ fileId: param, fields: 'thumbnailLink' });
      const link = res2.data.thumbnailLink;
      if (!link) return res.status(404).json({ success: false, error: 'Arquivo não encontrado' });

      return res.redirect(302, link.replace(/=s\d+$/, '=s0'));
    }

    // POST /api/social-frame/admin
    if (acao === 'admin' && req.method === 'POST') {
      const senha = (req.body && req.body.password) || '';
      const senhaAdmin = process.env.SOCIAL_FRAME_ADMIN_PASS;

      if (!senhaAdmin || senha !== senhaAdmin) {
        return res.status(401).json({ success: false, error: 'Senha incorreta' });
      }

      const catalogo = getCatalogo();
      const clientes = await Promise.all(
        Object.keys(catalogo).map(async (key) => {
          let capa = null;
          let totalFotos = 0;
          try {
            const fotos = await listFiles(catalogo[key].folder_id);
            totalFotos = fotos.length;
            if (fotos.length > 0) capa = escolherCapa(fotos, catalogo[key].fotos || {});
          } catch (e) {
            console.warn(`Erro ao buscar capa de ${key}:`, e.message);
          }
          return { id: key, nome: catalogo[key].nome_completo || key, totalFotos, capa };
        })
      );

      return res.status(200).json({ success: true, admin: true, clientes });
    }

    // POST /api/social-frame/download/:cliente
    // Serverless não aguenta ZIP grande: libera leitura por link na pasta
    // e devolve a URL do Drive (o Google gera o ZIP no "Fazer download de tudo")
    if (acao === 'download' && param && req.method === 'POST') {
      const clienteData = getClienteData(decodeURIComponent(param));
      if (!clienteData) {
        return res.status(404).json({ success: false, error: 'Cliente não encontrado' });
      }

      await getDrive().permissions.create({
        fileId: clienteData.folder_id,
        requestBody: { role: 'reader', type: 'anyone' }
      });

      return res.status(200).json({
        success: true,
        url: `https://drive.google.com/drive/folders/${clienteData.folder_id}`
      });
    }

    return res.status(404).json({ success: false, error: 'Rota não encontrada' });
  } catch (err) {
    console.error('[SocialFrame API]', err.message);
    return res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
