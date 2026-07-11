// Middleware de Rate Limiting em memória
// Vercel coloca cada request em um novo container, então usamos Vercel KV se disponível
// Para este caso, usamos um sistema simples baseado em IP com expiração

const requests = {};
const RATE_LIMIT = 5; // 5 requisições
const TIME_WINDOW = 60 * 1000; // Por minuto
const BLOCK_DURATION = 15 * 60 * 1000; // Bloqueia por 15 minutos

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['cf-connecting-ip'] ||
         req.headers['x-real-ip'] ||
         req.socket?.remoteAddress ||
         'unknown';
}

function isBlocked(ip) {
  if (!requests[ip]) return false;

  const now = Date.now();
  const record = requests[ip];

  // Se foi bloqueado, verificar se expirou
  if (record.blockedUntil && now < record.blockedUntil) {
    return true;
  }

  // Limpar registro antigo
  if (record.blockedUntil && now >= record.blockedUntil) {
    delete requests[ip];
    return false;
  }

  return false;
}

function checkRateLimit(ip) {
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = { count: 1, firstRequest: now, blockedUntil: null };
    return true;
  }

  const record = requests[ip];
  const timeDiff = now - record.firstRequest;

  // Se passou a janela de tempo, resetar
  if (timeDiff > TIME_WINDOW) {
    record.count = 1;
    record.firstRequest = now;
    record.blockedUntil = null;
    return true;
  }

  // Se ainda está na janela, incrementar contador
  record.count++;

  // Se ultrapassou o limite, bloquear
  if (record.count > RATE_LIMIT) {
    record.blockedUntil = now + BLOCK_DURATION;
    return false;
  }

  return true;
}

module.exports = {
  rateLimit: (req, res) => {
    const ip = getClientIp(req);

    if (isBlocked(ip)) {
      return res.status(429).json({
        error: 'Muitas requisições. Tente novamente em 15 minutos.',
        retryAfter: 900
      });
    }

    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: 'Limite de requisições excedido. Tente novamente em 15 minutos.',
        retryAfter: 900
      });
    }

    return null; // Passou na verificação
  }
};

// Limpar registros expirados a cada 30 minutos
setInterval(() => {
  const now = Date.now();
  Object.keys(requests).forEach(ip => {
    const record = requests[ip];
    if (record.blockedUntil && now > record.blockedUntil + TIME_WINDOW) {
      delete requests[ip];
    }
  });
}, 30 * 60 * 1000);
