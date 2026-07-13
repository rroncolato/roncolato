/**
 * Autenticação e sessão.
 * - Senha única (dono do app), hash scrypt em data/.auth.json
 * - Sessões em memória: token aleatório, expiração ociosa + absoluta
 * - Proteção contra força bruta: lockout progressivo por IP
 * - CSRF: double-submit token por sessão
 */
const fs = require('fs');
const path = require('path');
const sec = require('./security');

const DATA_DIR = path.join(__dirname, '..', 'data');
const AUTH_FILE = path.join(DATA_DIR, '.auth.json');

// ── Config de sessão/segurança ──
const IDLE_MS = 30 * 60 * 1000;        // 30 min sem uso → expira
const ABSOLUTE_MS = 12 * 60 * 60 * 1000; // 12 h máximo por sessão
const MAX_FALHAS = 5;                    // tentativas antes de travar
const COOKIE = 'fin_sess';

// ── Estado em memória ──
const sessoes = new Map();   // token → { criadoEm, ultimoUso, csrf }
const tentativas = new Map(); // ip → { falhas, travadoAte }

// ── Persistência do registro de senha ──
function lerAuth() {
  if (!fs.existsSync(AUTH_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8')); } catch { return null; }
}

function salvarAuth(obj) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(obj, null, 2), { mode: 0o600 });
  try { fs.chmodSync(AUTH_FILE, 0o600); } catch {}
}

function configurado() {
  const a = lerAuth();
  return !!(a && a.senha);
}

// ── Lockout por IP ──
function estaTravado(ip) {
  const t = tentativas.get(ip);
  if (!t || !t.travadoAte) return 0;
  const restante = t.travadoAte - Date.now();
  return restante > 0 ? restante : 0;
}

function registrarFalha(ip) {
  const t = tentativas.get(ip) || { falhas: 0, travadoAte: 0 };
  t.falhas += 1;
  if (t.falhas >= MAX_FALHAS) {
    // trava progressiva: 30s, 1m, 2m, 4m... teto 30 min
    const excesso = t.falhas - MAX_FALHAS;
    const espera = Math.min(30 * 60 * 1000, 30 * 1000 * Math.pow(2, excesso));
    t.travadoAte = Date.now() + espera;
  }
  tentativas.set(ip, t);
}

function limparFalhas(ip) {
  tentativas.delete(ip);
}

// ── Sessões ──
function criarSessao() {
  const token = sec.tokenAleatorio(32);
  const csrf = sec.tokenAleatorio(24);
  const agora = Date.now();
  sessoes.set(token, { criadoEm: agora, ultimoUso: agora, csrf });
  return { token, csrf };
}

function validarSessao(token) {
  const s = sessoes.get(token);
  if (!s) return null;
  const agora = Date.now();
  if (agora - s.ultimoUso > IDLE_MS || agora - s.criadoEm > ABSOLUTE_MS) {
    sessoes.delete(token);
    return null;
  }
  s.ultimoUso = agora;
  return s;
}

function destruirSessao(token) {
  sessoes.delete(token);
}

// limpeza periódica de sessões expiradas
setInterval(() => {
  const agora = Date.now();
  for (const [token, s] of sessoes) {
    if (agora - s.ultimoUso > IDLE_MS || agora - s.criadoEm > ABSOLUTE_MS) sessoes.delete(token);
  }
}, 5 * 60 * 1000).unref();

// ── Helpers de cookie ──
function cookieSessao(token, res, req) {
  const secure = req && (req.secure || req.headers['x-forwarded-proto'] === 'https');
  const partes = [
    `${COOKIE}=${token}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${Math.floor(ABSOLUTE_MS / 1000)}`
  ];
  if (secure) partes.push('Secure');
  res.setHeader('Set-Cookie', partes.join('; '));
}

function limparCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
}

// ── Middleware: exige sessão válida ──
function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE];
  const s = token && validarSessao(token);
  if (!s) {
    limparCookie(res);
    return res.status(401).json({ erro: 'não autenticado', code: 'NOAUTH' });
  }
  req.sessao = s;
  req.sessaoToken = token;
  next();
}

// ── Middleware: exige CSRF token válido em mutações ──
function requireCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const enviado = req.headers['x-csrf-token'];
  if (!req.sessao || !enviado || !sec.comparaSeguro(enviado, req.sessao.csrf)) {
    return res.status(403).json({ erro: 'csrf inválido', code: 'CSRF' });
  }
  next();
}

// ── Rotas de autenticação ──
const express = require('express');
const router = express.Router();

// Estado inicial: precisa configurar senha? já autenticado?
router.get('/status', (req, res) => {
  const token = req.cookies && req.cookies[COOKIE];
  const s = token && validarSessao(token);
  res.json({
    configurado: configurado(),
    autenticado: !!s,
    csrf: s ? s.csrf : null
  });
});

// Primeiro acesso: define a senha
router.post('/setup', (req, res) => {
  if (configurado()) return res.status(409).json({ erro: 'já configurado' });
  const { senha } = req.body || {};
  if (!senha || String(senha).length < 8) {
    return res.status(400).json({ erro: 'senha precisa de no mínimo 8 caracteres' });
  }
  salvarAuth({ senha: sec.hashSenha(String(senha)), criadoEm: new Date().toISOString() });
  const { token, csrf } = criarSessao();
  cookieSessao(token, res, req);
  res.status(201).json({ ok: true, csrf });
});

// Login
router.post('/login', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'local';
  const travado = estaTravado(ip);
  if (travado) {
    return res.status(429).json({ erro: `muitas tentativas, aguarde ${Math.ceil(travado / 1000)}s`, code: 'LOCKED' });
  }
  const auth = lerAuth();
  if (!auth) return res.status(409).json({ erro: 'não configurado', code: 'SETUP' });

  const { senha } = req.body || {};
  if (!senha || !sec.verificarSenha(String(senha), auth.senha)) {
    registrarFalha(ip);
    return res.status(401).json({ erro: 'senha incorreta' });
  }
  limparFalhas(ip);
  const { token, csrf } = criarSessao();
  cookieSessao(token, res, req);
  res.json({ ok: true, csrf });
});

// Logout
router.post('/logout', (req, res) => {
  const token = req.cookies && req.cookies[COOKIE];
  if (token) destruirSessao(token);
  limparCookie(res);
  res.json({ ok: true });
});

// Trocar senha (exige sessão + senha atual)
router.post('/trocar-senha', requireAuth, requireCsrf, (req, res) => {
  const { atual, nova } = req.body || {};
  const auth = lerAuth();
  if (!auth || !sec.verificarSenha(String(atual || ''), auth.senha)) {
    return res.status(401).json({ erro: 'senha atual incorreta' });
  }
  if (!nova || String(nova).length < 8) {
    return res.status(400).json({ erro: 'nova senha precisa de no mínimo 8 caracteres' });
  }
  salvarAuth({ ...auth, senha: sec.hashSenha(String(nova)), atualizadoEm: new Date().toISOString() });
  // encerra todas as outras sessões
  for (const t of sessoes.keys()) if (t !== req.sessaoToken) sessoes.delete(t);
  res.json({ ok: true });
});

module.exports = { router, requireAuth, requireCsrf, configurado };
