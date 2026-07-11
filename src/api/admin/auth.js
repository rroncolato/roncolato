// API de Autenticação
// Cria JWT para sessões

const crypto = require('crypto');

// Chave secreta para assinar JWTs (deve estar em variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';

// Credenciais do admin (armazenar em variáveis de ambiente em produção)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'senha123';

// reCAPTCHA (verificar no backend)
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

// Função simples para assinar JWT (sem dependências externas)
function signJWT(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const token = header + '.' + body;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(token)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return token + '.' + signature;
}

// Verificar reCAPTCHA v3 (opcional, mas recomendado)
async function verifyRecaptcha(token) {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`
    });

    const data = await response.json();
    return data.success && data.score > 0.3;
  } catch (err) {
    console.error('Erro ao verificar reCAPTCHA:', err);
    return false;
  }
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

  const { username, password, recaptchaToken } = req.body;

  // Validação básica
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  // Validar reCAPTCHA (pode ser desativado em desenvolvimento)
  if (recaptchaToken && process.env.NODE_ENV === 'production') {
    const captchaOk = await verifyRecaptcha(recaptchaToken);
    if (!captchaOk) {
      return res.status(403).json({ error: 'Validação CAPTCHA falhou' });
    }
  }

  // Verificar credenciais (NUNCA usar === simples, usar timing-safe comparison)
  const userMatch = crypto.timingSafeEqual(
    Buffer.from(username),
    Buffer.from(ADMIN_USER)
  );

  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password),
    Buffer.from(ADMIN_PASS)
  );

  if (!userMatch || !passMatch) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }

  // Gerar JWT
  const token = signJWT(
    {
      username: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 horas
    },
    JWT_SECRET
  );

  res.status(200).json({
    success: true,
    token: token,
    username: username
  });
};
