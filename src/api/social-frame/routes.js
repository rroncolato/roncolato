const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { listFiles, getFileStream, downloadFile } = require('../../utils/google-drive');
const { getCatalogo, getClienteData } = require('./catalogo');

const router = express.Router();
const TEMP_DIR = path.join(__dirname, '../../../.temp');

// Cria pasta temp se não existir
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// GET /api/social-frame/clientes
router.get('/clientes', (req, res) => {
  try {
    const catalogo = getCatalogo();
    const clientes = Object.keys(catalogo).map((key) => ({
      id: key,
      nome: catalogo[key].nome_completo || key,
      totalFotos: Object.keys(catalogo[key].fotos || {}).length
    }));

    res.json({ success: true, clientes });
  } catch (error) {
    console.error('Erro ao listar clientes:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/social-frame/fotos/:cliente
router.get('/fotos/:cliente', async (req, res) => {
  try {
    const { cliente } = req.params;
    const clienteData = getClienteData(cliente);

    if (!clienteData) {
      return res.status(404).json({ success: false, error: 'Cliente não encontrado' });
    }

    // Lista fotos do Drive
    const fotosGoogle = await listFiles(clienteData.folder_id);

    // Mescla com metadados
    const fotos = fotosGoogle.map((foto) => {
      const metadata = clienteData.fotos[foto.name] || { stars: 0, tags: [] };
      return {
        id: foto.id,
        nome: foto.name,
        ...metadata,
        createdTime: foto.createdTime,
        modifiedTime: foto.modifiedTime
      };
    });

    res.json({
      success: true,
      cliente,
      nome_completo: clienteData.nome_completo,
      fotos,
      total: fotos.length
    });
  } catch (error) {
    console.error('Erro ao listar fotos:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/social-frame/download/:cliente
router.post('/download/:cliente', async (req, res) => {
  try {
    const { cliente } = req.params;
    const clienteData = getClienteData(cliente);

    if (!clienteData) {
      return res.status(404).json({ success: false, error: 'Cliente não encontrado' });
    }

    // Lista fotos do Drive
    const fotosGoogle = await listFiles(clienteData.folder_id);

    if (fotosGoogle.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhuma foto encontrada' });
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
    res.download(zipPath, `${cliente}-fotos.zip`, (err) => {
      if (err) console.error('Erro ao enviar arquivo:', err);
      // Apaga arquivo temporário
      fs.unlink(zipPath, (unlinkErr) => {
        if (unlinkErr) console.warn('Erro ao apagar arquivo temp:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Erro ao gerar ZIP:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
