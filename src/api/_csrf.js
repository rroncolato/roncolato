// Proteção CSRF simples com tokens baseados em sessão
// Em produção, considere usar bibliotecas como 'csrf' ou 'csurf'

const crypto = require('crypto');

// Armazenar tokens CSRF em memória (com expiração)
const csrfTokens = {};
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hora

function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createCSRFToken(sessionId) {
  const token = generateCSRFToken();
  csrfTokens[token] = {
    sessionId,
    createdAt: Date.now(),
    used: false
  };

  // Limpar token após expiração
  setTimeout(() => {
    delete csrfTokens[token];
  }, TOKEN_EXPIRY);

  return token;
}

function verifyCSRFToken(token, sessionId) {
  if (!token || !csrfTokens[token]) {
    return false;
  }

  const record = csrfTokens[token];

  // Verificar se token expirou
  if (Date.now() - record.createdAt > TOKEN_EXPIRY) {
    delete csrfTokens[token];
    return false;
  }

  // Verificar se sessionId corresponde
  if (record.sessionId !== sessionId) {
    return false;
  }

  // Token é single-use (opcional)
  if (record.used) {
    return false;
  }

  // Marcar como usado
  record.used = true;

  return true;
}

function getSessionId(req) {
  // Extrair de cookie ou header
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/sessionId=([^;]+)/);
  if (match) return match[1];

  // Ou usar IP + User-Agent como fallback
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress;
  const ua = req.headers['user-agent'] || '';
  return `${ip}:${ua}`.split(':')[0]; // Usar IP como ID básico
}

module.exports = {
  generateCSRFToken,
  createCSRFToken,
  verifyCSRFToken,
  getSessionId
};
