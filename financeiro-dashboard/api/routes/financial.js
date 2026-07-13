const express = require('express');
const router = express.Router();
const FinancialController = require('../controllers/financialController');

const controller = new FinancialController();

// GET - Dashboard principal (métricas)
router.get('/dashboard', (req, res) => {
  try {
    const dashboard = controller.getDashboard();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Transações (com filtros)
router.get('/transacoes', (req, res) => {
  try {
    const { tipo, categoria, banco, dataInicio, dataFim } = req.query;
    const filtros = {};

    if (tipo) filtros.tipo = tipo;
    if (categoria) filtros.categoria = categoria;
    if (banco) filtros.banco = banco;
    if (dataInicio) filtros.dataInicio = dataInicio;
    if (dataFim) filtros.dataFim = dataFim;

    const resultado = controller.getTransacoes(filtros);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fluxo de caixa diário
router.get('/fluxo-diario', (req, res) => {
  try {
    const fluxo = controller.getFluxoDiario();
    res.json(fluxo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fluxo de caixa mensal
router.get('/fluxo-mensal', (req, res) => {
  try {
    const fluxo = controller.getFluxoMensal();
    res.json(fluxo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Análise estratégica (COO insights)
router.get('/analise-estrategica', (req, res) => {
  try {
    const analise = controller.getAnaliseEstrategica();
    res.json(analise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Relatório de análise
router.get('/relatorio', (req, res) => {
  try {
    const relatorio = controller.getRelatorio();
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
