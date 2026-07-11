const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const credentialsPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;

if (!credentialsPath || !fs.existsSync(credentialsPath)) {
  console.warn('⚠️ Google Service Account file not found at:', credentialsPath);
}

const credentials = fs.existsSync(credentialsPath)
  ? JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
  : null;

const auth = credentials
  ? new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    })
  : null;

const drive = auth ? google.drive({ version: 'v3', auth }) : null;

async function listFiles(folderId) {
  if (!drive) throw new Error('Google Drive not configured');

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false and mimeType='image/jpeg'`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType, createdTime, modifiedTime, imageMediaMetadata(width, height, rotation))',
      pageSize: 1000,
      orderBy: 'name'
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Erro ao listar arquivos:', error.message);
    throw error;
  }
}

async function getThumbnailLink(fileId, size = 800) {
  if (!drive) throw new Error('Google Drive not configured');

  const response = await drive.files.get({
    fileId,
    fields: 'thumbnailLink'
  });

  const link = response.data.thumbnailLink;
  if (!link) return null;

  // thumbnailLink vem com =s220 no final; troca pelo tamanho desejado
  return link.replace(/=s\d+$/, `=s${size}`);
}

async function getFileStream(fileId) {
  if (!drive) throw new Error('Google Drive not configured');

  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter arquivo:', error.message);
    throw error;
  }
}

async function downloadFile(fileId, destinationPath) {
  if (!drive) throw new Error('Google Drive not configured');

  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destinationPath);
      response.data
        .pipe(file)
        .on('finish', () => resolve(destinationPath))
        .on('error', (err) => {
          file.destroy();
          fs.unlink(destinationPath, () => {}); // apaga se houver erro
          reject(err);
        });
    });
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error.message);
    throw error;
  }
}

module.exports = {
  drive,
  listFiles,
  getFileStream,
  getThumbnailLink,
  downloadFile,
  isConfigured: () => drive !== null
};
