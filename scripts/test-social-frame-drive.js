/**
 * Teste de conexão Google Drive - SOCIAL FRAME
 * Uso: node scripts/test-social-frame-drive.js
 */
require('dotenv').config();

const { listFiles, isConfigured, drive } = require('../src/utils/google-drive');

const ROOT_FOLDER_ID = process.env.SOCIAL_FRAME_FOLDER_ID;

async function main() {
  console.log('🔑 Service account configurado:', isConfigured());
  console.log('📁 Folder ID raiz:', ROOT_FOLDER_ID);

  // Lista subpastas (clientes)
  const response = await drive.files.list({
    q: `'${ROOT_FOLDER_ID}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'`,
    fields: 'files(id, name)',
    pageSize: 100
  });

  const pastas = response.data.files || [];
  console.log(`\n📂 Pastas de clientes encontradas (${pastas.length}):`);
  for (const pasta of pastas) {
    const fotos = await listFiles(pasta.id);
    console.log(`  - ${pasta.name} (ID: ${pasta.id}) — ${fotos.length} fotos`);
  }
}

main().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
