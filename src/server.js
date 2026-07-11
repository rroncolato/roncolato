#!/usr/bin/env node

/**
 * Servidor dev para a Área Admin
 * Roda na porta 8080 com suporte a APIs
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Carregamento de variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-aleatorio-minimo-32-caracteres-aqui-1234567890';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'senha123';

const ROOT = path.resolve(__dirname, '..');  // Volta para raiz do projeto
const PORT = process.env.PORT || 3012;  // Use 3012 se 3011 estiver em uso

// Carregamento de variáveis de ambiente do .env
try {
  const envContent = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (e) {
  // .env pode não existir
}

// Import API handlers da agenda
let agendarHandler, horariosDisponiveisHandler;
try {
  agendarHandler = require('../AGENDA/api/agendar');
  horariosDisponiveisHandler = require('../AGENDA/api/horarios-disponiveis');
} catch (e) {
  console.warn('⚠️  Handlers de agenda não carregados:', e.message);
}

// ==========================================
// JWT UTILITIES
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

// ==========================================
// HANDLERS
// ==========================================

function handleAuth(body) {
  try {
    const { username, password, recaptchaToken } = JSON.parse(body);

    if (!username || !password) {
      return { status: 400, error: 'Usuário e senha são obrigatórios' };
    }

    // Verificação básica (em produção usar timing-safe comparison)
    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return { status: 401, error: 'Usuário ou senha incorretos' };
    }

    // Gerar JWT
    const token = signJWT({
      username: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
    });

    return {
      status: 200,
      data: {
        success: true,
        token: token,
        username: username
      }
    };
  } catch (err) {
    return { status: 400, error: 'Erro ao processar requisição' };
  }
}

function handleAddProject(body) {
  try {
    const data = JSON.parse(body);
    const { token, title, year, client, category, deliverable, description } = data;

    if (!token) {
      return { status: 401, error: 'Token não fornecido' };
    }

    if (!title || !year || !client || !category) {
      return { status: 400, error: 'Campos obrigatórios não preenchidos' };
    }

    const key = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    return {
      status: 200,
      data: {
        success: true,
        message: 'Projeto adicionado com sucesso!',
        project: {
          key: key,
          title: title,
          year: year,
          client: client,
          category: category
        }
      }
    };
  } catch (err) {
    return { status: 400, error: 'Erro ao processar requisição' };
  }
}

function handleAddArticle(body) {
  try {
    const data = JSON.parse(body);
    const { token, title, excerpt, tag, date, readTime, content } = data;

    if (!token) {
      return { status: 401, error: 'Token não fornecido' };
    }

    if (!title || !excerpt || !tag || !date || !content) {
      return { status: 400, error: 'Campos obrigatórios não preenchidos' };
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    return {
      status: 200,
      data: {
        success: true,
        message: 'Artigo publicado com sucesso!',
        article: {
          slug: slug,
          title: title,
          date: date,
          tag: tag
        }
      }
    };
  } catch (err) {
    return { status: 400, error: 'Erro ao processar requisição' };
  }
}

// ==========================================
// RESPONSE WRAPPER
// ==========================================

function wrapRes(res) {
  if (!res.status) {
    res.status = function(code) {
      res.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
  }
  return res;
}

// ==========================================
// MIME TYPES
// ==========================================

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  return mimes[ext] || 'application/octet-stream';
}

// ==========================================
// SERVER
// ==========================================

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Debug log para TODAS as requisições
  fs.appendFileSync(path.join(ROOT, 'all-requests.log'), `[${new Date().toISOString()}] ${req.method} ${pathname}\n`);

  // Debug log para rotas de API
  if (pathname.startsWith('/api/')) {
    console.log(`[API] ${req.method} ${pathname}`);
    fs.appendFileSync(path.join(ROOT, 'api-debug.log'), `[${new Date().toISOString()}] ${req.method} ${pathname}\n`);
  }

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // ==========================================
  // API ROUTES
  // ==========================================

  // ADMIN AUTH
  if (pathname === '/api/admin/auth' && req.method === 'POST') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      const authHandler = require('./api/admin/auth');
      return await authHandler(req, res);
    });
    return;
  }

  // PORTFOLIO ROUTES
  if (pathname === '/api/admin/portfolio/add' && req.method === 'POST') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      const handler = require('./api/admin/portfolio/add');
      return await handler(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/portfolio/list' && req.method === 'GET') {
    res = wrapRes(res);
    req.query = parsedUrl.query;
    const handler = require('./api/admin/portfolio/list');
    return await handler(req, res);
  }

  if (pathname === '/api/admin/portfolio/update' && req.method === 'PATCH') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;
      const handler = require('./api/admin/portfolio/update');
      return await handler(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/portfolio/delete' && req.method === 'DELETE') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;
      const handler = require('./api/admin/portfolio/delete');
      return await handler(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/portfolio/hide' && req.method === 'PATCH') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;
      const handler = require('./api/admin/portfolio/hide');
      return await handler(req, res);
    });
    return;
  }

  // BLOG ROUTES
  if (pathname === '/api/admin/blog/add' && req.method === 'POST') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      const handler = require('./api/admin/blog/add');
      return await handler(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/blog/list' && req.method === 'GET') {
    res = wrapRes(res);
    req.query = parsedUrl.query;
    const handler = require('./api/admin/blog/list');
    return await handler(req, res);
  }

  if (pathname === '/api/admin/blog/update' && req.method === 'PATCH') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;
      const handler = require('./api/admin/blog/update');
      return await handler(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/blog/delete' && req.method === 'DELETE') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;
      const handler = require('./api/admin/blog/delete');
      return await handler(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/blog/hide' && req.method === 'PATCH') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;
      const handler = require('./api/admin/blog/hide');
      return await handler(req, res);
    });
    return;
  }

  // AGENDA Routes
  if (pathname === '/api/horarios-disponiveis' && req.method === 'GET' && horariosDisponiveisHandler) {
    req.query = parsedUrl.query;
    res = wrapRes(res);
    return await horariosDisponiveisHandler(req, res);
  }

  if (pathname === '/api/agendar' && req.method === 'POST' && agendarHandler) {
    res = wrapRes(res);
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

  // NOTION DASHBOARD ROUTES
  if (pathname === '/api/admin/notion-dashboard/projetos' && req.method === 'GET') {
    res = wrapRes(res);
    req.query = parsedUrl.query;
    const handler = require('./api/admin/notion-dashboard');
    return await handler.getProjetos(req, res);
  }

  if (pathname === '/api/admin/notion-dashboard/tarefas' && req.method === 'GET') {
    res = wrapRes(res);
    req.query = parsedUrl.query;
    const handler = require('./api/admin/notion-dashboard');
    return await handler.getTarefas(req, res);
  }

  if (pathname === '/api/admin/notion-dashboard/clientes' && req.method === 'GET') {
    res = wrapRes(res);
    req.query = parsedUrl.query;
    const handler = require('./api/admin/notion-dashboard');
    return await handler.getClientes(req, res);
  }

  if (pathname === '/api/admin/notion-dashboard/stats' && req.method === 'GET') {
    res = wrapRes(res);
    req.query = parsedUrl.query;
    const handler = require('./api/admin/notion-dashboard');
    return await handler.getStats(req, res);
  }

  if (pathname === '/api/admin/notion-dashboard/criar-projeto' && req.method === 'POST') {
    res = wrapRes(res);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
      const handler = require('./api/admin/notion-dashboard');
      return await handler.criarProjeto(req, res);
    });
    return;
  }

  if (pathname === '/api/admin/auth.js' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const result = handleAuth(body);
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.error ? { error: result.error } : result.data));
    });
    return;
  }

  if (pathname === '/api/admin/add-project.js' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const result = handleAddProject(body);
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.error ? { error: result.error } : result.data));
    });
    return;
  }

  if (pathname === '/api/admin/add-article.js' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const result = handleAddArticle(body);
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.error ? { error: result.error } : result.data));
    });
    return;
  }

  // ==========================================
  // LIST & DELETE (Gerenciar)
  // ==========================================

  if (pathname === '/api/admin/list-articles.js' && req.method === 'GET') {
    try {
      const token = url.parse(req.url, true).query.token;
      if (!token) {
        return res.writeHead(401).end(JSON.stringify({ error: 'Token não fornecido' }));
      }

      const html = fs.readFileSync('index.html', 'utf8');
      const articles = [];

      // Extrair artigos do objeto posts
      const postsMatch = html.match(/const posts=\{([\s\S]*?)\};\s*\nfunction/);
      if (postsMatch) {
        const postsStr = postsMatch[1];
        // Extrair cada entrada: slug:{tag:'...',date:'...',title:'...',...}
        // O formato usa aspas simples e não tem espaços depois de {
        const regex = /(\w+):\{[^}]*tag:'([^']+)'[^}]*date:'([^']+)'[^}]*title:'([^']+)'/g;
        let match;
        while ((match = regex.exec(postsStr)) !== null) {
          articles.push({
            slug: match[1],
            tag: match[2],
            date: match[3],
            title: match[4]
          });
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ articles: articles }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/admin/delete-article.js' && req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { slug } = data;

        if (!slug) {
          return res.writeHead(400).end(JSON.stringify({ error: 'Slug não fornecido' }));
        }

        let html = fs.readFileSync('index.html', 'utf8');

        // Remover entrada do objeto posts
        const entryRegex = new RegExp(`  ${slug}:\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\},?\\n`, 'g');
        html = html.replace(entryRegex, '');

        // Remover card HTML (padrões: goPost ou loadArticle)
        const cardRegex1 = new RegExp(`<div class="bpost[^"]*" onclick="goPost\\('${slug}'\\)"[^>]*>[\\s\\S]*?</div>\\s*</div>`, 'g');
        html = html.replace(cardRegex1, '');

        const cardRegex2 = new RegExp(`<article onclick="loadArticle\\('${slug}'\\)"[^>]*>[\\s\\S]*?</article>`, 'g');
        html = html.replace(cardRegex2, '');

        fs.writeFileSync('index.html', html, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Artigo deletado' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // UPDATE ARTICLE
  if (pathname === '/api/admin/update-article.js' && req.method === 'PATCH') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const updateHandler = require('./api/admin/update-article.js');
        const mockRes = {
          status: (code) => {
            return {
              json: (result) => {
                res.writeHead(code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              },
              end: () => res.end()
            };
          },
          setHeader: () => {},
          end: (content) => res.end(content)
        };
        updateHandler(
          { body: data, headers: req.headers, method: 'PATCH' },
          mockRes
        );
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // TOGGLE ARTICLE VISIBILITY
  if (pathname === '/api/admin/toggle-article.js' && req.method === 'PATCH') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const toggleHandler = require('./api/admin/toggle-article.js');
        const mockRes = {
          status: (code) => {
            return {
              json: (result) => {
                res.writeHead(code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              },
              end: () => res.end()
            };
          },
          setHeader: () => {},
          end: (content) => res.end(content)
        };
        toggleHandler(
          { body: data, headers: req.headers, method: 'PATCH' },
          mockRes
        );
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/admin/list-projects.js' && req.method === 'GET') {
    try {
      const token = url.parse(req.url, true).query.token;
      if (!token) {
        return res.writeHead(401).end(JSON.stringify({ error: 'Token não fornecido' }));
      }

      const html = fs.readFileSync('index.html', 'utf8');
      const projects = [];

      // Extrair projetos do objeto cases
      const casesMatch = html.match(/const cases=\{([\s\S]*?)\};\s*\nfunction openModal/);
      if (casesMatch) {
        const casesStr = casesMatch[1];
        // Extrair cada entrada: key:{tag:'...',title:'...',year:'...',... cat:'...'}
        const regex = /(\w+):\{[^}]*tag:'([^']+)'[^}]*title:'([^']+)'[^}]*year:'(\d+)'[^}]*cat:'([^']+)'/g;
        let match;
        while ((match = regex.exec(casesStr)) !== null) {
          projects.push({
            key: match[1],
            tag: match[2],
            title: match[3],
            year: match[4],
            category: match[5]
          });
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ projects: projects }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/admin/delete-project.js' && req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { key } = data;

        if (!key) {
          return res.writeHead(400).end(JSON.stringify({ error: 'Key não fornecido' }));
        }

        let html = fs.readFileSync('index.html', 'utf8');

        // Remover entrada do objeto cases
        const entryRegex = new RegExp(`  ${key}:\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\},?\\n`, 'g');
        html = html.replace(entryRegex, '');

        // Remover card HTML
        const cardRegex = new RegExp(`<div class="pitem"[^>]*onclick="openModal\\('${key}'\\)"[^>]*>[\\s\\S]*?</div>\\s*</div>`, 'g');
        html = html.replace(cardRegex, '');

        fs.writeFileSync('index.html', html, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Projeto deletado' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // SECTIONS CONFIG
  if (pathname === '/api/admin/sections.js' && (req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH')) {
    if (req.method === 'GET') {
      try {
        const sectionsHandler = require('./api/admin/sections.js');
        const mockRes = {
          status: (code) => ({
            json: (result) => {
              res.writeHead(code, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
            },
            end: () => res.end()
          }),
          setHeader: () => {},
          end: (content) => res.end(content)
        };
        sectionsHandler({ method: 'GET', headers: req.headers }, mockRes);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    } else {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const sectionsHandler = require('./api/admin/sections.js');
          const mockRes = {
            status: (code) => ({
              json: (result) => {
                res.writeHead(code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              },
              end: () => res.end()
            }),
            setHeader: () => {},
            end: (content) => res.end(content)
          };
          sectionsHandler({ body: data, headers: req.headers, method: req.method }, mockRes);
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
    return;
  }

  // UPDATE PROJECT
  if (pathname === '/api/admin/update-project.js' && req.method === 'PATCH') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const updateHandler = require('./api/admin/update-project.js');
        const mockRes = {
          status: (code) => {
            return {
              json: (result) => {
                res.writeHead(code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              },
              end: () => res.end()
            };
          },
          setHeader: () => {},
          end: (content) => res.end(content)
        };
        updateHandler(
          { body: data, headers: req.headers, method: 'PATCH' },
          mockRes
        );
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // TOGGLE PROJECT VISIBILITY
  if (pathname === '/api/admin/toggle-project.js' && req.method === 'PATCH') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const toggleHandler = require('./api/admin/toggle-project.js');
        const mockRes = {
          status: (code) => {
            return {
              json: (result) => {
                res.writeHead(code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              },
              end: () => res.end()
            };
          },
          setHeader: () => {},
          end: (content) => res.end(content)
        };
        toggleHandler(
          { body: data, headers: req.headers, method: 'PATCH' },
          mockRes
        );
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // STUDIO TASKS & PROJECTS API
  // ==========================================
  const TASKS_FILE = path.join(ROOT, 'data', 'studio-tasks.json');

  function readTasksData() {
    try {
      return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    } catch(e) {
      return { projects: [], tasks: [] };
    }
  }
  function writeTasksData(data) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  // GET /api/studio/tasks
  if (pathname === '/api/studio/tasks' && req.method === 'GET') {
    const data = readTasksData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // POST /api/studio/tasks
  if (pathname === '/api/studio/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const task = JSON.parse(body);
        const data = readTasksData();
        task.id = 'task-' + Date.now();
        task.createdAt = new Date().toISOString().split('T')[0];
        data.tasks.push(task);
        writeTasksData(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(task));
      } catch(e) {
        res.writeHead(400).end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // PATCH /api/studio/tasks/:id
  if (pathname.startsWith('/api/studio/tasks/') && req.method === 'PATCH') {
    const id = pathname.split('/').pop();
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readTasksData();
        const idx = data.tasks.findIndex(t => t.id === id);
        if (idx === -1) { res.writeHead(404).end(JSON.stringify({ error: 'Not found' })); return; }
        data.tasks[idx] = { ...data.tasks[idx], ...updates };
        writeTasksData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.tasks[idx]));
      } catch(e) {
        res.writeHead(400).end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // DELETE /api/studio/tasks/:id
  if (pathname.startsWith('/api/studio/tasks/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop();
    const data = readTasksData();
    data.tasks = data.tasks.filter(t => t.id !== id);
    writeTasksData(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // GET /api/studio/projects
  if (pathname === '/api/studio/projects' && req.method === 'GET') {
    const data = readTasksData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ projects: data.projects }));
    return;
  }

  // POST /api/studio/projects
  if (pathname === '/api/studio/projects' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const project = JSON.parse(body);
        const data = readTasksData();
        project.id = 'proj-' + Date.now();
        project.createdAt = new Date().toISOString().split('T')[0];
        data.projects.push(project);
        writeTasksData(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(project));
      } catch(e) {
        res.writeHead(400).end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // PATCH /api/studio/projects/:id
  if (pathname.startsWith('/api/studio/projects/') && req.method === 'PATCH') {
    const id = pathname.split('/').pop();
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readTasksData();
        const idx = data.projects.findIndex(p => p.id === id);
        if (idx === -1) { res.writeHead(404).end(JSON.stringify({ error: 'Not found' })); return; }
        data.projects[idx] = { ...data.projects[idx], ...updates };
        writeTasksData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.projects[idx]));
      } catch(e) {
        res.writeHead(400).end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // DELETE /api/studio/projects/:id
  if (pathname.startsWith('/api/studio/projects/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop();
    const data = readTasksData();
    data.projects = data.projects.filter(p => p.id !== id);
    data.tasks = data.tasks.filter(t => t.projectId !== id);
    writeTasksData(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // ==========================================
  // ADMIN FILES (antes de static files)
  // ==========================================

  if (pathname.startsWith('/admin')) {
    const adminDir = path.join(ROOT, 'src', 'admin');
    let adminFile = pathname.replace(/^\/admin/, '').replace(/^\//, '');
    if (adminFile === '') {
      adminFile = 'index.html';
    }
    const adminPath = path.join(adminDir, adminFile);
    const normalizedAdmin = path.normalize(adminPath);

    // Segurança: prevenir path traversal
    if (!normalizedAdmin.startsWith(path.normalize(adminDir))) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    try {
      if (fs.existsSync(adminPath)) {
        const content = fs.readFileSync(adminPath);
        const mimeType = getMimeType(adminPath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
        return;
      }
    } catch (err) {
      // Continuar para 404
    }
  }

  // ==========================================
  // STATIC FILES
  // ==========================================

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const publicDir = path.join(ROOT, 'public');
  const filePath = path.join(publicDir, pathname);
  const normalizedPath = path.normalize(filePath);

  // Segurança: prevenir path traversal
  if (!normalizedPath.startsWith(path.normalize(publicDir))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  try {
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const indexFile = path.join(filePath, 'index.html');
      if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
        return;
      }
    }

    if (stats.isFile()) {
      const content = fs.readFileSync(filePath);
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);
      return;
    }
  } catch (err) {
    // Servir página 404 customizada
    try {
      const notFoundPath = path.join(publicDir, '404.html');
      const content = fs.readFileSync(notFoundPath, 'utf8');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } catch (e) {
      // Fallback se 404.html não existir
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`\n✨ Servidor rodando em http://localhost:${PORT}\n`);
  console.log('📍 Área Admin: http://localhost:8080/admin/login.html');
  console.log('📍 Site: http://localhost:8080\n');
  console.log('Credenciais de teste:');
  console.log(`  Usuário: ${ADMIN_USER}`);
  console.log(`  Senha: ${ADMIN_PASS}\n`);
  console.log('Pressione Ctrl+C para parar o servidor.\n');
});
