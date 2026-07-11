// /api/admin/middleware/auth.js
// Verificação de JWT para todas as requisições

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    // Recalcular assinatura
    const newSignature = crypto
      .createHmac('sha256', JWT_SECRET)
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
    console.error('[AUTH] Erro ao verificar JWT:', err.message);
    return null;
  }
}

// Middleware para ser usado em todos os handlers
function authMiddleware(req) {
  const token = req.body?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return {
      success: false,
      error: 'Token não fornecido',
      code: 'AUTH_MISSING_TOKEN',
      statusCode: 401
    };
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return {
      success: false,
      error: 'Token inválido ou expirado',
      code: 'AUTH_INVALID_TOKEN',
      statusCode: 401
    };
  }

  return { success: true, payload };
}

module.exports = {
  verifyJWT,
  authMiddleware
};
