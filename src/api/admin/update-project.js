// API para atualizar projetos do portfólio
// Modifica entrada do objeto cases e atualiza o card HTML

const fs = require('fs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producacao';
const HTML_PATH = 'index.html';

// Verificar JWT
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
    console.error('Erro ao verificar JWT:', err);
    return null;
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '`': '&#96;'
  };
  return text.replace(/[&<>"'`]/g, m => map[m]);
}

function validateInput(text, fieldName, maxLen = 500) {
  if (!text || typeof text !== 'string') {
    throw new Error(`${fieldName} inválido`);
  }
  if (text.length > maxLen) {
    throw new Error(`${fieldName} excede limite de ${maxLen} caracteres`);
  }
  if (/<script|javascript:|on\w+\s*=/i.test(text)) {
    throw new Error(`${fieldName} contém código malicioso`);
  }
  return text.trim();
}

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3011', 'http://127.0.0.1:3011'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Método não permitido' });

  try {
    // Verificar autenticação
    const token = req.body?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const payload = verifyJWT(token, JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Extrair dados
    const { key, title, year, client, category, deliverable, description, link, images } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Key/slug não fornecido' });
    }

    // Validações
    const validatedTitle = validateInput(title, 'Título', 100);
    const validatedClient = validateInput(client, 'Cliente', 100);
    const validatedCategory = validateInput(category, 'Categoria', 50);
    const validatedDeliverable = validateInput(deliverable, 'Entregável', 100);
    const validatedDesc = validateInput(description, 'Descrição', 500);

    if (!/^\d{4}$/.test(year)) {
      throw new Error('Ano deve ser válido (YYYY)');
    }

    if (link && link.trim() && !/^https?:\/\/.+/.test(link.trim())) {
      throw new Error('Link deve começar com http:// ou https://');
    }

    // Processar imagens
    const imgs = Array.isArray(images) ? images : ['/assets/IMG/placeholder.jpg'];

    // Atualizar index.html
    if (fs.existsSync(HTML_PATH)) {
      let html = fs.readFileSync(HTML_PATH, 'utf8');

      // Atualizar entrada no objeto cases
      const entryRegex = new RegExp(`  ${key}:\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\}`, 'g');
      const newEntry = `  ${key}:{tag:${JSON.stringify(validatedCategory)},title:${JSON.stringify(validatedTitle)},year:${JSON.stringify(year)},client:${JSON.stringify(validatedClient)},cat:${JSON.stringify(validatedCategory)},deliverable:${JSON.stringify(validatedDeliverable)},desc:${JSON.stringify(validatedDesc)},link:${JSON.stringify(link || '#')},imgs:${JSON.stringify(imgs)}}`;

      html = html.replace(entryRegex, newEntry);

      fs.writeFileSync(HTML_PATH, html, 'utf8');
    }

    res.status(200).json({
      success: true,
      message: 'Projeto atualizado com sucesso!',
      project: {
        key: key,
        title: validatedTitle,
        year: year
      }
    });

  } catch (error) {
    console.error('Erro em update-project:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar projeto' });
  }
};
