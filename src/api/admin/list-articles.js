// API para listar artigos do blog
// Extrai dados do objeto posts em index.html

const fs = require('fs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';
const HTML_PATH = 'index.html';

function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];

    const newSignature = crypto
      .createHmac('sha256', secret)
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

module.exports = async function handler(req, res) {
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3012'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const token = req.query.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const payload = verifyJWT(token, JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    if (!fs.existsSync(HTML_PATH)) {
      return res.status(200).json({ articles: [], total: 0 });
    }

    const html = fs.readFileSync(HTML_PATH, 'utf8');

    // Extrair objeto posts
    const postsMatch = html.match(/const posts = \{([^}]*)\}/s);
    if (!postsMatch) {
      return res.status(200).json({ articles: [], total: 0 });
    }

    const postsStr = postsMatch[1];
    const articles = [];

    // Padrão: slug:{title:...,excerpt:...,tag:...,date:...,readTime:...,body:...}
    const entryRegex = /(\w+):\{([^}]*)\}/g;
    let match;

    while ((match = entryRegex.exec(postsStr)) !== null) {
      const slug = match[1];
      const dataStr = match[2];

      const article = { slug };

      // Extrair campos
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

    res.status(200).json({
      success: true,
      articles,
      total: articles.length
    });

  } catch (error) {
    console.error('Erro em list-articles:', error);
    res.status(400).json({ error: error.message || 'Erro ao listar artigos' });
  }
};
