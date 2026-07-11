// API para atualizar/editar artigos do blog
// Modifica entrada do objeto posts e atualiza o card HTML

const fs = require('fs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';
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

function formatDate(dateStr) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const [y, m, day] = dateStr.split('-');
  return day + ' ' + months[parseInt(m) - 1] + ' ' + y;
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

function buildArticleContent(content) {
  const lines = content.split('\n');
  let html = '';

  lines.forEach(line => {
    const escapedLine = escapeHtml(line);
    if (line.startsWith('##')) {
      html += '<h2>' + escapeHtml(line.slice(2).trim()) + '</h2>\n';
    } else if (line.startsWith('""') && line.endsWith('""')) {
      html += '<blockquote>' + escapeHtml(line.slice(2, -2).trim()) + '</blockquote>\n';
    } else if (line.trim()) {
      html += '<p>' + escapedLine + '</p>\n';
    }
  });

  return html;
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
    const { slug, title, excerpt, tag, date, readTime, content } = req.body;

    if (!slug) {
      return res.status(400).json({ error: 'Slug não fornecido' });
    }

    // Validações
    const validatedTitle = validateInput(title, 'Título', 200);
    const validatedExcerpt = validateInput(excerpt, 'Resumo', 300);
    const validatedTag = validateInput(tag, 'Tag', 50);
    const validatedReadTime = validateInput(readTime, 'Tempo de leitura', 50);
    const validatedContent = validateInput(content, 'Conteúdo', 50000);

    // Data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Data inválida (use YYYY-MM-DD)');
    }

    const formattedDate = formatDate(date);

    // Processar conteúdo
    const bodyHtml = buildArticleContent(validatedContent);

    // Atualizar index.html
    if (fs.existsSync(HTML_PATH)) {
      let html = fs.readFileSync(HTML_PATH, 'utf8');

      // Atualizar entrada no objeto posts
      // Padrão: "  slug:{tag:'...',date:'...',title:'...',body:'...',excerpt:'...',...},"
      const entryRegex = new RegExp(`  ${slug}:\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\}`, 'g');
      const newEntry = `  ${slug}:{title:${JSON.stringify(validatedTitle)},excerpt:${JSON.stringify(validatedExcerpt)},tag:${JSON.stringify(validatedTag)},date:${JSON.stringify(formattedDate)},readTime:${JSON.stringify(validatedReadTime)},body:${JSON.stringify(bodyHtml)}}`;

      html = html.replace(entryRegex, newEntry);

      fs.writeFileSync(HTML_PATH, html, 'utf8');
    }

    res.status(200).json({
      success: true,
      message: 'Artigo atualizado com sucesso!',
      article: {
        slug: slug,
        title: validatedTitle,
        date: formattedDate
      }
    });

  } catch (error) {
    console.error('Erro em update-article:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar artigo' });
  }
};
