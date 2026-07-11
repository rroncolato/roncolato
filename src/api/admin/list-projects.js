// API para listar projetos do portfólio
// Extrai dados do objeto cases em index.html

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
      return res.status(200).json({ projects: [], total: 0 });
    }

    const html = fs.readFileSync(HTML_PATH, 'utf8');

    // Extrair objeto cases
    const casesMatch = html.match(/const cases = \{([^}]*)\}/s);
    if (!casesMatch) {
      return res.status(200).json({ projects: [], total: 0 });
    }

    const casesStr = casesMatch[1];
    const projects = [];

    // Padrão: key:{tag:...,title:...,year:...,client:...,cat:...,deliverable:...,desc:...,link:...,imgs:[...]}
    const entryRegex = /(\w+):\{([^}]*(?:\[[^\]]*\][^}]*)*)\}/g;
    let match;

    while ((match = entryRegex.exec(casesStr)) !== null) {
      const key = match[1];
      const dataStr = match[2];

      const project = { key };

      // Extrair campos
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

    res.status(200).json({
      success: true,
      projects,
      total: projects.length
    });

  } catch (error) {
    console.error('Erro em list-projects:', error);
    res.status(400).json({ error: error.message || 'Erro ao listar projetos' });
  }
};
