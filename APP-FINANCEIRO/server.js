const express = require('express');
const path = require('path');

const auth = require('./api/auth');
const { cookies, headersSeguros, rateLimit, auditLog } = require('./api/middleware');

const app = express();
const PORT = process.env.PORT || 3001;
// Bind só no loopback: o app NÃO fica exposto na rede local por padrão.
const HOST = process.env.HOST || '127.0.0.1';

app.disable('x-powered-by');
app.set('trust proxy', false);

// ── Camadas globais ──
app.use(headersSeguros);
app.use(cookies);
app.use(rateLimit({ janelaMs: 60 * 1000, max: 400 })); // teto global generoso p/ 1 usuário
app.use(express.json({ limit: '512kb' }));

// Erro de JSON malformado → 400 (não vaza stack)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ erro: 'JSON inválido' });
  }
  next(err);
});

// ── Autenticação (público, com rate-limit apertado no login) ──
app.use('/api/auth', rateLimit({ janelaMs: 60 * 1000, max: 30 }), auth.router);

// ── Health check (público, sem dados) ──
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'app-financeiro', timestamp: new Date().toISOString() });
});

// ── API de dados: exige sessão + CSRF, com audit log ──
app.use('/api', auth.requireAuth, auth.requireCsrf, auditLog, require('./api/routes'));

// ── Frontend (shell público; os dados só vêm da API protegida) ──
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-store')
}));

// ── Handler de erro final (não vaza stack ao cliente) ──
app.use((err, req, res, next) => {
  console.error('[erro]', err.message);
  res.status(500).json({ erro: 'erro interno' });
});

app.listen(PORT, HOST, () => {
  const modo = auth.configurado() ? 'senha configurada' : '⚠ PRIMEIRO ACESSO: defina a senha na tela';
  console.log(`
╔══════════════════════════════════════════════╗
║  💳 APP FINANCEIRO — modo seguro             ║
║  🔒 Autenticação + sessão + CSRF + audit     ║
║  📍 http://${HOST}:${PORT}                     ║
║  🔑 ${modo}
╚══════════════════════════════════════════════╝
  `);
});
