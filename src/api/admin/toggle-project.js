// API para ocultar/publicar projetos do portfólio
// Adiciona atributo 'visible' ao projeto

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
    const { key, visible } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Key/slug não fornecido' });
    }

    if (typeof visible !== 'boolean') {
      return res.status(400).json({ error: 'Parâmetro visible deve ser boolean' });
    }

    // Atualizar index.html
    if (fs.existsSync(HTML_PATH)) {
      let html = fs.readFileSync(HTML_PATH, 'utf8');

      // Padrão: "  key:{...},visible:true" ou sem visible
      const regex = new RegExp(`(  ${key}:\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\})(?:,visible:[a-z]+)?`, 'g');
      const replacement = `$1${visible ? ',visible:true' : ''}`;

      html = html.replace(regex, replacement);

      fs.writeFileSync(HTML_PATH, html, 'utf8');
    }

    res.status(200).json({
      success: true,
      message: `Projeto ${visible ? 'publicado' : 'ocultado'} com sucesso!`,
      key: key,
      visible: visible
    });

  } catch (error) {
    console.error('Erro em toggle-project:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar visibilidade do projeto' });
  }
};
