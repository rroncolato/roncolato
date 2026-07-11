const http = require('http');
const fs = require('fs');
const path = require('path');

// Criar diretório de screenshots se não existir
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

const url = 'http://127.0.0.1:8080';

// Função para fazer requisição HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Primeiro, vamos tentar fazer uma requisição simples
console.log('Testando conexão com servidor...');
makeRequest(url)
  .then(() => {
    console.log('✓ Servidor respondendo na porta 8080');
    console.log('\nPara capturar screenshots, você precisa instalar Puppeteer:');
    console.log('  npm install puppeteer');
    console.log('\nOu usar ferramentas online como:');
    console.log('  - https://responsively.app/');
    console.log('  - https://mobileresponsive.com/');
    process.exit(0);
  })
  .catch(err => {
    console.error('✗ Erro ao conectar ao servidor:', err.message);
    console.log('\nTente iniciar o servidor manualmente:');
    console.log('  python -m http.server 8080');
    process.exit(1);
  });
