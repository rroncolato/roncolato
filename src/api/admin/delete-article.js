// API para deletar artigos do blog
// Remove entrada do objeto posts e o card HTML correspondente

const fs = require('fs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';
const HTML_PATH = 'index.html';

// Verificar JWT (copiado de add-article.js)
function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];

    // Recalcular assinatura
    const newSignature = crypto
      .createHmac('sha256', secret)
      .update(header + '.' + body)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== newSignature) return null;

    // Decodificar payload
    const jsonStr = Buffer.from(body + '==', 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr);

    // Verificar expiração
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Erro ao verificar JWT:', err);
    return null;
  }
}

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3007', 'http://127.0.0.1:3007'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método não permitido' });

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

    // Extrair slug
    const { slug } = req.body;
    if (!slug) {
      return res.status(400).json({ error: 'Slug não fornecido' });
    }

    // Deletar do index.html
    if (fs.existsSync(HTML_PATH)) {
      let html = fs.readFileSync(HTML_PATH, 'utf8');

      // 1. Remover entrada do objeto posts
      // Padrão: "  slug:{...},"
      const entryRegex = new RegExp(`  ${slug}:\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\},?\\n`, 'g');
      html = html.replace(entryRegex, '');

      // 2. Remover card HTML
      // Dois padrões possíveis: onclick="goPost('slug')" ou onclick="loadArticle('slug')"

      // Padrão 1: <div class="bpost..." onclick="goPost('slug')">...
      const cardRegex1 = new RegExp(`<div class="bpost[^"]*" onclick="goPost\\('${slug}'\\)"[^>]*>[\\s\\S]*?</div>\\s*</div>`, 'g');
      html = html.replace(cardRegex1, '');

      // Padrão 2: <article onclick="loadArticle('slug')">...
      const cardRegex2 = new RegExp(`<article onclick="loadArticle\\('${slug}'\\)"[^>]*>[\\s\\S]*?</article>`, 'g');
      html = html.replace(cardRegex2, '');

      fs.writeFileSync(HTML_PATH, html, 'utf8');
    }

    res.status(200).json({
      success: true,
      message: 'Artigo deletado com sucesso!',
      slug: slug
    });

  } catch (error) {
    console.error('Erro em delete-article:', error);
    res.status(400).json({ error: error.message || 'Erro ao deletar artigo' });
  }
};
