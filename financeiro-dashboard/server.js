const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'frontend')));

// Rotas da API Financeira
const financialRoutes = require('./api/routes/financial');
app.use('/api/financeiro', financialRoutes);

// Rotas do Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard-visual.html'));
});

// Análise Financeira BI
app.get('/analise-financeira', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'analise-financeira.html'));
});

// Fluxo de Caixa (Diário e Mensal)
app.get('/fluxo-caixa', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'fluxo-caixa.html'));
});

// Dashboard Alternativo
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

// Dashboard Integrado (Light mode com design system)
app.get('/financeiro', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard-integrated.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  💰 Financeiro Dashboard Server                ║
║  ✅ Servidor iniciado com sucesso              ║
║  📍 http://localhost:${PORT}                     ║
║  🔗 API: http://localhost:${PORT}/api/financeiro║
║  ❤️  Saúde: http://localhost:${PORT}/health     ║
╚════════════════════════════════════════════════╝
  `);
});
