// API para adicionar projeto ao portfólio
// Recebe dados + imagens, salva e atualiza index.html

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';
const HTML_PATH = 'index.html';
const IMG_BASE = 'IMG';

// Verificar JWT
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
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

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

    // Extrair dados do formulário
    const { title, year, client, category, deliverable, description, link, coverIndex } = req.body;

    // Validações
    const validatedTitle = validateInput(title, 'Título', 100);
    const validatedClient = validateInput(client, 'Cliente', 100);
    const validatedCategory = validateInput(category, 'Categoria', 50);
    const validatedDeliverable = validateInput(deliverable, 'Entregável', 100);
    const validatedDesc = validateInput(description, 'Descrição', 300);

    if (!/^\d{4}$/.test(year)) {
      throw new Error('Ano deve ser válido');
    }

    if (link && link.trim() && !/^https?:\/\/.+/.test(link.trim())) {
      throw new Error('Link deve começar com http:// ou https://');
    }

    // Gerar slug
    const key = validatedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // EM PRODUÇÃO: Você precisará lidar com upload de imagens
    // Opções:
    // 1. Usar Cloudinary API
    // 2. Usar AWS S3
    // 3. Usar Firebase Storage
    // 4. Usar um serviço de blob storage

    // Por enquanto, vamos simular com paths locais
    // Em um ambiente Vercel não-persistente, você deve usar um serviço externo

    const imgs = Array.isArray(req.body.images) 
      ? req.body.images.map(img => '/assets/IMG/temp/' + img)
      : ['/assets/IMG/placeholder.jpg'];

    const cover = imgs[coverIndex || 0] || imgs[0];

    // Map categoria
    const dataCatMap = {
      'Personal Branding': 'branding',
      'Fotografia Executiva': 'executiva',
      'Eventos': 'eventos',
      'Branding': 'branding',
    };
    const dataCat = dataCatMap[validatedCategory] || 'branding';

    // Criar entrada de case
    const newCase = `  ${key}:{tag:${JSON.stringify(validatedCategory)},title:${JSON.stringify(validatedTitle)},year:${JSON.stringify(year)},client:${JSON.stringify(validatedClient)},cat:${JSON.stringify(validatedCategory)},deliverable:${JSON.stringify(validatedDeliverable)},desc:${JSON.stringify(validatedDesc)},link:${JSON.stringify(link || '#')},imgs:${JSON.stringify(imgs)}},\n`;

    // Criar card HTML
    const newCard = `      <div class="pitem rv" data-cat="${dataCat}" onclick="openModal('${key}')">
        <div class="pph" style="padding:0;overflow:hidden;">
          <img src="${cover}" alt="${escapeHtml(validatedTitle)}" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div class="pov">
          <div>
            <div class="ptitle">${escapeHtml(validatedTitle)}</div>
            <div class="pcat">${escapeHtml(validatedCategory)}</div>
          </div>
        </div>
      </div>`;

    // Atualizar HTML (em dev)
    if (fs.existsSync(HTML_PATH)) {
      let html = fs.readFileSync(HTML_PATH, 'utf8');

      // 1. Adicionar case
      const casesEnd = html.indexOf('\nfunction openModal');
      if (casesEnd > -1) {
        html = html.slice(0, casesEnd) + '\n' + newCase + html.slice(casesEnd);
      }

      // 2. Adicionar card
      const lastPitem = html.lastIndexOf('</div>\n      </div>');
      if (lastPitem > -1) {
        html = html.slice(0, lastPitem + 19) + newCard + html.slice(lastPitem + 19);
      }

      fs.writeFileSync(HTML_PATH, html, 'utf8');
    }

    res.status(200).json({
      success: true,
      message: 'Projeto adicionado com sucesso!',
      project: {
        key: key,
        title: validatedTitle,
        images: imgs.length
      }
    });

  } catch (error) {
    console.error('Erro em add-project:', error);
    res.status(400).json({ error: error.message || 'Erro ao adicionar projeto' });
  }
};
