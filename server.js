#!/usr/bin/env node

/**
 * Servidor Principal - SITE RONCOLATO
 * Roda na porta 3012
 * Serve o site + Admin Dashboard
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Carregar variáveis de ambiente do .env
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (e) {
  // .env pode não existir em ambiente de produção
}

const PORT = process.env.PORT || 3012;
const ROOT = path.join(__dirname, 'public');
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-aleatorio-minimo-32-caracteres-aqui-1234567890';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'senha123';

// ==========================================
// UTILITÁRIOS
// ==========================================

function signJWT(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const body = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const token = header + '.' + body;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(token)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return token + '.' + signature;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];

    const newSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(header + '.' + body)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== newSignature) return null;

    const jsonStr = Buffer.from(body + '==', 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// Wrapper para adicionar métodos Express-like ao res
function wrapResponse(res) {
  if (!res.json) {
    res.json = function(data) {
      this.writeHead(200, { 'Content-Type': 'application/json' });
      this.end(JSON.stringify(data));
    };
  }
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  return res;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  return types[ext] || 'application/octet-stream';
}

// ==========================================
// MAIN SERVER
// ==========================================

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Remove leading slash for file lookup
  let filePath = pathname === '/' ? '/index.html' : pathname;

  // CORS
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:3012', 'http://127.0.0.1:3012'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.writeHead(200).end();
  }

  try {
    // ========== API ROUTES ==========

    // Auth
    if (pathname === '/api/admin/auth' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const { username, password } = JSON.parse(body);
          if (username === ADMIN_USER && password === ADMIN_PASS) {
            const token = signJWT({
              username,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, token, user: username }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Credenciais inválidas' }));
          }
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Erro ao processar requisição' }));
        }
      });
      return;
    }

    // List Articles
    if (pathname === '/api/admin/list-articles.js' && req.method === 'GET') {
      const token = parsedUrl.query.token || req.headers.authorization?.split(' ')[1];
      if (!token || !verifyJWT(token)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Não autorizado' }));
      }

      const indexPath = path.join(ROOT, 'index.html');
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        const postsMatch = html.match(/const posts = \{([^}]*)\}/s);
        const articles = [];

        if (postsMatch) {
          const postsStr = postsMatch[1];
          const entryRegex = /(\w+):\{([^}]*)\}/g;
          let match;
          while ((match = entryRegex.exec(postsStr)) !== null) {
            const slug = match[1];
            const dataStr = match[2];
            const article = { slug };

            const titleMatch = dataStr.match(/title:\s*'([^']*)'/);
            const excerptMatch = dataStr.match(/excerpt:\s*'([^']*)'/);
            const tagMatch = dataStr.match(/tag:\s*'([^']*)'/);
            const dateMatch = dataStr.match(/date:\s*'([^']*)'/);
            const readTimeMatch = dataStr.match(/readTime:\s*'([^']*)'/);
            const bodyMatch = dataStr.match(/body:\s*'([^']*)'/);

            if (titleMatch) article.title = titleMatch[1];
            if (excerptMatch) article.excerpt = excerptMatch[1];
            if (tagMatch) article.tag = tagMatch[1];
            if (dateMatch) article.date = dateMatch[1];
            if (readTimeMatch) article.readTime = readTimeMatch[1];
            if (bodyMatch) article.content = bodyMatch[1];

            if (article.title) articles.push(article);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ articles, total: articles.length }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ articles: [], total: 0 }));
    }

    // List Projects
    if (pathname === '/api/admin/list-projects.js' && req.method === 'GET') {
      const token = parsedUrl.query.token || req.headers.authorization?.split(' ')[1];
      if (!token || !verifyJWT(token)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Não autorizado' }));
      }

      const indexPath = path.join(ROOT, 'index.html');
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        const casesMatch = html.match(/const cases = \{([^}]*)\}/s);
        const projects = [];

        if (casesMatch) {
          const casesStr = casesMatch[1];
          const entryRegex = /(\w+):\{([^}]*(?:\[[^\]]*\][^}]*)*)\}/g;
          let match;
          while ((match = entryRegex.exec(casesStr)) !== null) {
            const key = match[1];
            const dataStr = match[2];
            const project = { key };

            const titleMatch = dataStr.match(/title:\s*'([^']*)'/);
            const clientMatch = dataStr.match(/client:\s*'([^']*)'/);
            const categoryMatch = dataStr.match(/(?:cat|tag):\s*'([^']*)'/);
            const yearMatch = dataStr.match(/year:\s*'([^']*)'/);
            const deliverableMatch = dataStr.match(/deliverable:\s*'([^']*)'/);
            const descMatch = dataStr.match(/desc:\s*'([^']*)'/);
            const linkMatch = dataStr.match(/link:\s*'([^']*)'/);
            const imgsMatch = dataStr.match(/imgs:\s*\[([^\]]*)\]/);

            if (titleMatch) project.title = titleMatch[1];
            if (clientMatch) project.client = clientMatch[1];
            if (categoryMatch) project.category = categoryMatch[1];
            if (yearMatch) project.year = yearMatch[1];
            if (deliverableMatch) project.deliverable = deliverableMatch[1];
            if (descMatch) project.description = descMatch[1];
            if (linkMatch) project.link = linkMatch[1];
            if (imgsMatch) {
              const imgStr = imgsMatch[1];
              project.images = imgStr.match(/'([^']*)'/g)?.map(s => s.replace(/'/g, '')) || [];
            }

            if (project.title) projects.push(project);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ projects, total: projects.length }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ projects: [], total: 0 }));
    }

    // Notion Dashboard - Tarefas
    if (pathname === '/api/admin/notion-dashboard/tarefas' && req.method === 'GET') {
      try {
        const wrappedRes = wrapResponse(res);
        const handler = require('./src/api/admin/notion-dashboard');
        return await handler.getTarefas(req, wrappedRes);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Erro ao buscar tarefas', details: err.message }));
      }
    }

    // Notion Dashboard - Projetos
    if (pathname === '/api/admin/notion-dashboard/projetos' && req.method === 'GET') {
      try {
        const wrappedRes = wrapResponse(res);
        const handler = require('./src/api/admin/notion-dashboard');
        return await handler.getProjetos(req, wrappedRes);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Erro ao buscar projetos', details: err.message }));
      }
    }

    // Notion Dashboard - Clientes
    if (pathname === '/api/admin/notion-dashboard/clientes' && req.method === 'GET') {
      try {
        const wrappedRes = wrapResponse(res);
        const handler = require('./src/api/admin/notion-dashboard');
        return await handler.getClientes(req, wrappedRes);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Erro ao buscar clientes', details: err.message }));
      }
    }

    // Notion Dashboard - Stats
    if (pathname === '/api/admin/notion-dashboard/stats' && req.method === 'GET') {
      try {
        const wrappedRes = wrapResponse(res);
        const handler = require('./src/api/admin/notion-dashboard');
        return await handler.getStats(req, wrappedRes);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Erro ao buscar stats', details: err.message }));
      }
    }

    // Notion Dashboard - Criar Projeto
    if (pathname === '/api/admin/notion-dashboard/criar-projeto' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          req.body = JSON.parse(body);
          const wrappedRes = wrapResponse(res);
          const handler = require('./src/api/admin/notion-dashboard');
          return await handler.criarProjeto(req, wrappedRes);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Erro ao criar projeto', details: err.message }));
        }
      });
      return;
    }

    // ========== DASHBOARD OFFLINE CHECK ==========

    if (pathname === '/dashboard-projetos.html' || pathname === '/admin/dashboard.html' || pathname === '/dash/ohoje' || pathname === '/dash/ohoje.html' || pathname === '/o-hoje' || pathname === '/dashboard/o-hoje') {
      const offlinePath = path.join(ROOT, 'pages', 'o-hoje-offline.html');
      if (fs.existsSync(offlinePath)) {
        const content = fs.readFileSync(offlinePath);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(content);
      }
    }

    // ========== STATIC FILES ==========

    const cleanFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const fullPath = path.join(ROOT, cleanFilePath);
    const normalizedPath = path.normalize(fullPath);

    // Security: prevent path traversal
    if (!normalizedPath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Acesso negado');
    }

    // Check if file exists
    if (fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isFile()) {
      const content = fs.readFileSync(normalizedPath);
      res.writeHead(200, { 'Content-Type': getContentType(normalizedPath) });
      return res.end(content);
    }

    // Try index.html for directories
    const indexPath = path.join(normalizedPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(content);
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Página não encontrada</h1>');

  } catch (err) {
    console.error('Erro:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erro interno do servidor');
  }
});

// ==========================================
// START SERVER
// ==========================================

server.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando na porta ${PORT}`);
  console.log(`📱 Site: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}/src/admin/login.html`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/src/admin/dashboard.html`);
  console.log(`\n⚙️  Credenciais: admin / senha123\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`);
  } else {
    console.error('Erro do servidor:', err);
  }
  process.exit(1);
});
