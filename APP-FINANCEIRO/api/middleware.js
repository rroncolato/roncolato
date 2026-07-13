/**
 * Camadas de proteção HTTP — sem dependências externas.
 * Parsing de cookies, cabeçalhos de segurança, rate-limit global e audit log.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const AUDIT_FILE = path.join(DATA_DIR, '.audit.log');

// ── Parser de cookies (sem cookie-parser) ──
function cookies(req, res, next) {
  const header = req.headers.cookie;
  req.cookies = {};
  if (header) {
    for (const par of header.split(';')) {
      const i = par.indexOf('=');
      if (i > -1) {
        const k = par.slice(0, i).trim();
        const v = par.slice(i + 1).trim();
        req.cookies[k] = decodeURIComponent(v);
      }
    }
  }
  next();
}

// ── Cabeçalhos de segurança (equivalente ao helmet) ──
function headersSeguros(req, res, next) {
  // Content-Security-Policy: bloqueia scripts/estilos externos exceto os usados
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.removeHeader('X-Powered-By');
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

// ── Rate-limit global por IP (janela deslizante) ──
function rateLimit({ janelaMs = 60 * 1000, max = 300 } = {}) {
  const hits = new Map(); // ip → [timestamps]
  setInterval(() => {
    const corte = Date.now() - janelaMs;
    for (const [ip, ts] of hits) {
      const filtrado = ts.filter(t => t > corte);
      if (filtrado.length) hits.set(ip, filtrado); else hits.delete(ip);
    }
  }, janelaMs).unref();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'local';
    const agora = Date.now();
    const ts = (hits.get(ip) || []).filter(t => t > agora - janelaMs);
    ts.push(agora);
    hits.set(ip, ts);
    if (ts.length > max) {
      res.setHeader('Retry-After', Math.ceil(janelaMs / 1000));
      return res.status(429).json({ erro: 'muitas requisições', code: 'RATE' });
    }
    next();
  };
}

// ── Audit log de mutações ──
function auditLog(req, res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.on('finish', () => {
      // não registra corpo (pode conter dados sensíveis) — só metadados
      const linha = JSON.stringify({
        ts: new Date().toISOString(),
        ip: req.ip || 'local',
        metodo: req.method,
        rota: req.originalUrl.split('?')[0],
        status: res.statusCode
      }) + '\n';
      fs.appendFile(AUDIT_FILE, linha, () => {});
    });
  }
  next();
}

module.exports = { cookies, headersSeguros, rateLimit, auditLog };
