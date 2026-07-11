const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

require('dotenv').config();

// Import API handlers
const disponibilidadeHandler = require('./api/disponibilidade');
const agendarHandler = require('./api/agendar');
const horariosDisponiveisHandler = require('./api/horarios-disponiveis');

const PORT = process.env.PORT || 3002;

// Helper para adicionar métodos Express-like ao res
function wrapRes(res) {
  res.status = function(code) {
    res.statusCode = code;
    return this;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  try {
    res = wrapRes(res);
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

    // API routes
    if (pathname === '/api/disponibilidade') {
      req.query = parsedUrl.query;
      return await disponibilidadeHandler(req, res);
    }

    if (pathname === '/api/horarios-disponiveis') {
      req.query = parsedUrl.query;
      return await horariosDisponiveisHandler(req, res);
    }

    if (pathname === '/api/agendar') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          req.body = {};
        }
        return await agendarHandler(req, res);
      });
      return;
    }

    // Static files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
      }[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  } catch (err) {
    console.error('Erro no servidor:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
