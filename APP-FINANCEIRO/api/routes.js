const express = require('express');
const router = express.Router();
const db = require('./storage');

// ═══════════════ HELPERS ═══════════════

function saldoConta(contaId) {
  const conta = db.contas.get(contaId);
  if (!conta) return 0;
  let saldo = conta.saldoInicial || 0;
  db.transacoes.all().forEach(t => {
    if (t.efetivada === false) return;
    if (t.tipo === 'receita' && t.contaId === conta.id) saldo += t.valor;
    if (t.tipo === 'despesa' && t.contaId === conta.id) saldo -= t.valor;
    if (t.tipo === 'transferencia') {
      if (t.contaId === conta.id) saldo -= t.valor;
      if (t.contaDestinoId === conta.id) saldo += t.valor;
    }
  });
  return Math.round(saldo * 100) / 100;
}

function mesDe(data) {
  return (data || '').substring(0, 7); // YYYY-MM
}

// IDs das contas de um grupo (PJ | PF). Sem grupo na query = todas.
function contasDoGrupo(grupo) {
  const contas = grupo ? db.contas.find(c => (c.grupo || 'PF') === grupo) : db.contas.all();
  return new Set(contas.map(c => c.id));
}

// Transação pertence ao grupo se origem OU destino está nas contas do grupo
function txnNoGrupo(t, ids) {
  return ids.has(t.contaId) || (t.tipo === 'transferencia' && ids.has(t.contaDestinoId));
}

function gastoCategoriaMes(categoriaId, mes) {
  return db.transacoes.all()
    .filter(t => t.tipo === 'despesa' && t.categoriaId === categoriaId && mesDe(t.data) === mes)
    .reduce((s, t) => s + t.valor, 0);
}

// Fatura do cartão: transações do cartão entre fechamentos
function faturaCartao(cartao, mesRef) {
  // mesRef = YYYY-MM da fatura (vencimento)
  const [ano, mes] = mesRef.split('-').map(Number);
  const fechamento = cartao.diaFechamento || 1;

  // Período: fechamento do mês anterior até fechamento do mês da fatura
  const fim = new Date(ano, mes - 1, fechamento);
  const inicio = new Date(ano, mes - 2, fechamento);

  const txns = db.transacoes.all().filter(t => {
    if (t.cartaoId !== cartao.id) return false;
    const d = new Date(t.data + 'T12:00:00');
    return d >= inicio && d < fim;
  });

  const total = txns.reduce((s, t) => s + (t.tipo === 'despesa' ? t.valor : -t.valor), 0);
  return { mesRef, inicio: inicio.toISOString().split('T')[0], fim: fim.toISOString().split('T')[0], total: Math.round(total * 100) / 100, transacoes: txns };
}

// ═══════════════ CONTAS ═══════════════

router.get('/contas', (req, res) => {
  let contas = db.contas.all();
  if (req.query.grupo) contas = contas.filter(c => (c.grupo || 'PF') === req.query.grupo);
  res.json(contas.map(c => ({ ...c, saldoAtual: saldoConta(c.id) })));
});

router.post('/contas', (req, res) => {
  const { nome, tipo, cor, icone, saldoInicial, grupo, percentCDI, meta } = req.body;
  if (!nome) return res.status(400).json({ erro: 'nome obrigatório' });
  const conta = db.contas.insert({
    nome,
    tipo: tipo || 'corrente', // corrente | poupanca | carteira | investimento | caixinha
    grupo: grupo === 'PJ' ? 'PJ' : 'PF',
    cor: cor || '#1d1d1f',
    icone: icone || 'account_balance',
    saldoInicial: Number(saldoInicial) || 0,
    percentCDI: Number(percentCDI) || null, // caixinha: % do CDI (ex: 100)
    meta: Number(meta) || null,             // caixinha: objetivo em R$
    arquivada: false
  });
  res.status(201).json(conta);
});

router.put('/contas/:id', (req, res) => {
  const conta = db.contas.update(req.params.id, req.body);
  if (!conta) return res.status(404).json({ erro: 'conta não encontrada' });
  res.json(conta);
});

router.delete('/contas/:id', (req, res) => {
  const id = Number(req.params.id);
  db.transacoes.removeWhere(t => t.contaId === id || t.contaDestinoId === id);
  const ok = db.contas.remove(id);
  if (!ok) return res.status(404).json({ erro: 'conta não encontrada' });
  res.json({ ok: true });
});

// ═══════════════ CATEGORIAS ═══════════════

router.get('/categorias', (req, res) => {
  res.json(db.categorias.all());
});

router.post('/categorias', (req, res) => {
  const { nome, tipo, cor, icone } = req.body;
  if (!nome || !tipo) return res.status(400).json({ erro: 'nome e tipo obrigatórios' });
  res.status(201).json(db.categorias.insert({ nome, tipo, cor: cor || '#86868b', icone: icone || 'label' }));
});

router.put('/categorias/:id', (req, res) => {
  const cat = db.categorias.update(req.params.id, req.body);
  if (!cat) return res.status(404).json({ erro: 'categoria não encontrada' });
  res.json(cat);
});

router.delete('/categorias/:id', (req, res) => {
  const ok = db.categorias.remove(req.params.id);
  if (!ok) return res.status(404).json({ erro: 'categoria não encontrada' });
  res.json({ ok: true });
});

// ═══════════════ TRANSAÇÕES ═══════════════

router.get('/transacoes', (req, res) => {
  let txns = db.transacoes.all();
  const { mes, tipo, contaId, categoriaId, cartaoId, busca, grupo } = req.query;

  if (grupo) {
    const ids = contasDoGrupo(grupo);
    txns = txns.filter(t => txnNoGrupo(t, ids));
  }
  if (mes) txns = txns.filter(t => mesDe(t.data) === mes);
  if (tipo) txns = txns.filter(t => t.tipo === tipo);
  if (contaId) txns = txns.filter(t => t.contaId === Number(contaId));
  if (categoriaId) txns = txns.filter(t => t.categoriaId === Number(categoriaId));
  if (cartaoId) txns = txns.filter(t => t.cartaoId === Number(cartaoId));
  if (busca) txns = txns.filter(t => (t.descricao || '').toLowerCase().includes(busca.toLowerCase()));

  txns = [...txns].sort((a, b) => (b.data || '').localeCompare(a.data || ''));
  res.json(txns);
});

router.post('/transacoes', (req, res) => {
  const { descricao, valor, data, tipo, contaId, contaDestinoId, categoriaId, cartaoId, efetivada, observacao, recorrencia, parcelas } = req.body;
  if (!valor || !data || !tipo) return res.status(400).json({ erro: 'valor, data e tipo obrigatórios' });

  const base = {
    descricao: descricao || '',
    valor: Math.abs(Number(valor)),
    data,
    tipo, // receita | despesa | transferencia
    contaId: contaId ? Number(contaId) : null,
    contaDestinoId: contaDestinoId ? Number(contaDestinoId) : null,
    categoriaId: categoriaId ? Number(categoriaId) : null,
    cartaoId: cartaoId ? Number(cartaoId) : null,
    efetivada: efetivada !== false,
    observacao: observacao || ''
  };

  // Parcelamento: cria N transações mensais
  const nParcelas = Number(parcelas) || 1;
  if (nParcelas > 1) {
    const criadas = [];
    const valorParcela = Math.round((base.valor / nParcelas) * 100) / 100;
    const [ano, mes, dia] = data.split('-').map(Number);
    for (let i = 0; i < nParcelas; i++) {
      const d = new Date(ano, mes - 1 + i, dia);
      const dataParcela = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      criadas.push(db.transacoes.insert({
        ...base,
        valor: valorParcela,
        data: dataParcela,
        descricao: `${base.descricao} (${i + 1}/${nParcelas})`,
        parcela: `${i + 1}/${nParcelas}`
      }));
    }
    return res.status(201).json(criadas);
  }

  // Recorrência fixa: cria N meses (padrão 12)
  if (recorrencia === 'mensal') {
    const nReps = Math.min(60, Math.max(2, Number(req.body.repeticoes) || 12));
    const criadas = [];
    const [ano, mes, dia] = data.split('-').map(Number);
    for (let i = 0; i < nReps; i++) {
      const d = new Date(ano, mes - 1 + i, dia);
      const dataRec = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      criadas.push(db.transacoes.insert({ ...base, data: dataRec, efetivada: i === 0 ? base.efetivada : false, recorrente: true }));
    }
    return res.status(201).json(criadas);
  }

  res.status(201).json(db.transacoes.insert(base));
});

router.put('/transacoes/:id', (req, res) => {
  const t = db.transacoes.update(req.params.id, req.body);
  if (!t) return res.status(404).json({ erro: 'transação não encontrada' });
  res.json(t);
});

router.delete('/transacoes/:id', (req, res) => {
  const ok = db.transacoes.remove(req.params.id);
  if (!ok) return res.status(404).json({ erro: 'transação não encontrada' });
  res.json({ ok: true });
});

// ═══════════════ CARTÕES ═══════════════

router.get('/cartoes', (req, res) => {
  const mesAtual = new Date().toISOString().substring(0, 7);
  let cartoes = db.cartoes.all();
  if (req.query.grupo) cartoes = cartoes.filter(c => (c.grupo || 'PF') === req.query.grupo);
  cartoes = cartoes.map(c => {
    const fatura = faturaCartao(c, req.query.mes || mesAtual);
    return { ...c, faturaAtual: fatura.total, limiteDisponivel: Math.round(((c.limite || 0) - fatura.total) * 100) / 100 };
  });
  res.json(cartoes);
});

router.get('/cartoes/:id/fatura', (req, res) => {
  const cartao = db.cartoes.get(req.params.id);
  if (!cartao) return res.status(404).json({ erro: 'cartão não encontrado' });
  const mes = req.query.mes || new Date().toISOString().substring(0, 7);
  res.json(faturaCartao(cartao, mes));
});

router.post('/cartoes', (req, res) => {
  const { nome, bandeira, limite, diaFechamento, diaVencimento, cor, grupo } = req.body;
  if (!nome) return res.status(400).json({ erro: 'nome obrigatório' });
  res.status(201).json(db.cartoes.insert({
    nome,
    bandeira: bandeira || 'outro',
    grupo: grupo === 'PJ' ? 'PJ' : 'PF',
    limite: Number(limite) || 0,
    diaFechamento: Number(diaFechamento) || 1,
    diaVencimento: Number(diaVencimento) || 10,
    cor: cor || '#5856d6'
  }));
});

router.put('/cartoes/:id', (req, res) => {
  const c = db.cartoes.update(req.params.id, req.body);
  if (!c) return res.status(404).json({ erro: 'cartão não encontrado' });
  res.json(c);
});

router.delete('/cartoes/:id', (req, res) => {
  const id = Number(req.params.id);
  db.transacoes.removeWhere(t => t.cartaoId === id);
  const ok = db.cartoes.remove(id);
  if (!ok) return res.status(404).json({ erro: 'cartão não encontrado' });
  res.json({ ok: true });
});

// ═══════════════ ORÇAMENTOS ═══════════════

router.get('/orcamentos', (req, res) => {
  const mes = req.query.mes || new Date().toISOString().substring(0, 7);
  const orcs = db.orcamentos.find(o => o.mes === mes).map(o => {
    const gasto = gastoCategoriaMes(o.categoriaId, mes);
    return { ...o, gasto: Math.round(gasto * 100) / 100, percentual: o.valor > 0 ? Math.round((gasto / o.valor) * 100) : 0 };
  });
  res.json(orcs);
});

router.post('/orcamentos', (req, res) => {
  const { categoriaId, valor, mes } = req.body;
  if (!categoriaId || !valor || !mes) return res.status(400).json({ erro: 'categoriaId, valor e mes obrigatórios' });
  // Um orçamento por categoria/mês
  const existente = db.orcamentos.find(o => o.categoriaId === Number(categoriaId) && o.mes === mes)[0];
  if (existente) {
    return res.json(db.orcamentos.update(existente.id, { valor: Number(valor) }));
  }
  res.status(201).json(db.orcamentos.insert({ categoriaId: Number(categoriaId), valor: Number(valor), mes }));
});

router.delete('/orcamentos/:id', (req, res) => {
  const ok = db.orcamentos.remove(req.params.id);
  if (!ok) return res.status(404).json({ erro: 'orçamento não encontrado' });
  res.json({ ok: true });
});

// ═══════════════ OBJETIVOS ═══════════════

router.get('/objetivos', (req, res) => {
  const objs = db.objetivos.all().map(o => ({
    ...o,
    percentual: o.valorMeta > 0 ? Math.min(100, Math.round((o.valorAtual / o.valorMeta) * 100)) : 0
  }));
  res.json(objs);
});

router.post('/objetivos', (req, res) => {
  const { nome, valorMeta, valorAtual, prazo, cor, icone } = req.body;
  if (!nome || !valorMeta) return res.status(400).json({ erro: 'nome e valorMeta obrigatórios' });
  res.status(201).json(db.objetivos.insert({
    nome,
    valorMeta: Number(valorMeta),
    valorAtual: Number(valorAtual) || 0,
    prazo: prazo || null,
    cor: cor || '#34c759',
    icone: icone || 'savings'
  }));
});

router.put('/objetivos/:id', (req, res) => {
  const o = db.objetivos.update(req.params.id, req.body);
  if (!o) return res.status(404).json({ erro: 'objetivo não encontrado' });
  res.json(o);
});

router.post('/objetivos/:id/depositar', (req, res) => {
  const obj = db.objetivos.get(req.params.id);
  if (!obj) return res.status(404).json({ erro: 'objetivo não encontrado' });
  const valor = Number(req.body.valor) || 0;
  res.json(db.objetivos.update(obj.id, { valorAtual: Math.round((obj.valorAtual + valor) * 100) / 100 }));
});

router.delete('/objetivos/:id', (req, res) => {
  const ok = db.objetivos.remove(req.params.id);
  if (!ok) return res.status(404).json({ erro: 'objetivo não encontrado' });
  res.json({ ok: true });
});

// ═══════════════ IMPORTAÇÃO (CSV/OFX) ═══════════════

const importer = require('./importer');

// Preview: parseia arquivo, categoriza, marca duplicadas — NÃO grava
router.post('/importar/preview', (req, res) => {
  const { conteudo, formato } = req.body;
  if (!conteudo) return res.status(400).json({ erro: 'conteudo obrigatório' });

  const parsed = importer.parse(conteudo, formato);
  const categorias = db.categorias.all();
  const existentes = db.transacoes.all();

  const preview = parsed.map(t => {
    const duplicada = existentes.some(e =>
      e.data === t.data && Math.abs(e.valor - t.valor) < 0.005 &&
      (e.descricao || '').toLowerCase() === (t.descricao || '').toLowerCase()
    );
    return { ...t, categoriaId: importer.categorizar(t, categorias), duplicada };
  });

  res.json({ total: preview.length, duplicadas: preview.filter(p => p.duplicada).length, transacoes: preview });
});

// Confirmar: grava transações selecionadas na conta escolhida
router.post('/importar/confirmar', (req, res) => {
  const { contaId, transacoes } = req.body;
  if (!contaId || !Array.isArray(transacoes)) return res.status(400).json({ erro: 'contaId e transacoes obrigatórios' });

  const criadas = transacoes.map(t => db.transacoes.insert({
    descricao: t.descricao || '',
    valor: Math.abs(Number(t.valor)),
    data: t.data,
    tipo: t.tipo,
    contaId: Number(contaId),
    contaDestinoId: null,
    categoriaId: t.categoriaId ? Number(t.categoriaId) : null,
    cartaoId: null,
    efetivada: true,
    observacao: 'importado',
    importada: true
  }));

  res.status(201).json({ importadas: criadas.length });
});

// ═══════════════ DASHBOARD ═══════════════

router.get('/dashboard', (req, res) => {
  const mes = req.query.mes || new Date().toISOString().substring(0, 7);
  const ids = contasDoGrupo(req.query.grupo);
  const txnsMes = db.transacoes.find(t => mesDe(t.data) === mes && txnNoGrupo(t, ids));

  const receitasMes = txnsMes.filter(t => t.tipo === 'receita' && t.efetivada !== false && ids.has(t.contaId)).reduce((s, t) => s + t.valor, 0);
  const despesasMes = txnsMes.filter(t => t.tipo === 'despesa' && t.efetivada !== false && ids.has(t.contaId)).reduce((s, t) => s + t.valor, 0);
  const pendentes = txnsMes.filter(t => t.efetivada === false);

  // Pendências: tudo não efetivado até o fim do mês visualizado (inclui meses anteriores)
  const hoje = new Date().toISOString().substring(0, 10);
  const fmtPend = t => {
    const cat = db.categorias.get(t.categoriaId);
    const conta = db.contas.get(t.contaId);
    return { ...t, categoria: cat ? cat.nome : null, categoriaCor: cat ? cat.cor : '#86868b', categoriaIcone: cat ? cat.icone : 'label', conta: conta ? conta.nome : null };
  };
  const todasPend = db.transacoes
    .find(t => t.efetivada === false && t.tipo === 'despesa' && ids.has(t.contaId) && mesDe(t.data) <= mes)
    .sort((a, b) => a.data.localeCompare(b.data));
  const atrasadas = todasPend.filter(t => t.data < hoje).map(fmtPend);
  const aVencer = todasPend.filter(t => t.data >= hoje).map(fmtPend);

  // Saldo geral = contas do dia a dia (caixinhas ficam de fora — dinheiro guardado)
  const saldoGeral = db.contas.all().filter(c => ids.has(c.id) && c.tipo !== 'caixinha').reduce((s, c) => s + saldoConta(c.id), 0);

  // Projeções: efetivadas + pendentes
  const pendReceitasMes = txnsMes.filter(t => t.tipo === 'receita' && t.efetivada === false && ids.has(t.contaId)).reduce((s, t) => s + t.valor, 0);
  const pendDespesasMes = txnsMes.filter(t => t.tipo === 'despesa' && t.efetivada === false && ids.has(t.contaId)).reduce((s, t) => s + t.valor, 0);
  // Saldo projetado considera TODAS as pendências até o fim do mês visualizado (inclui atrasadas de meses anteriores)
  const pendRecAteMes = db.transacoes.find(t => t.tipo === 'receita' && t.efetivada === false && ids.has(t.contaId) && mesDe(t.data) <= mes).reduce((s, t) => s + t.valor, 0);
  const pendDespAteMes = db.transacoes.find(t => t.tipo === 'despesa' && t.efetivada === false && ids.has(t.contaId) && mesDe(t.data) <= mes).reduce((s, t) => s + t.valor, 0);

  // Total em caixinhas do grupo
  const totalCaixinhas = db.contas.all()
    .filter(c => ids.has(c.id) && c.tipo === 'caixinha')
    .reduce((s, c) => s + saldoConta(c.id), 0);

  // Despesas por categoria no mês
  const porCategoria = {};
  txnsMes.filter(t => t.tipo === 'despesa' && t.efetivada !== false && ids.has(t.contaId)).forEach(t => {
    const cat = db.categorias.get(t.categoriaId);
    const nome = cat ? cat.nome : 'Sem categoria';
    if (!porCategoria[nome]) porCategoria[nome] = { nome, cor: cat ? cat.cor : '#86868b', icone: cat ? cat.icone : 'label', total: 0 };
    porCategoria[nome].total += t.valor;
  });

  // Fluxo últimos 6 meses
  const fluxo6m = [];
  const [anoRef, mesRef] = mes.split('-').map(Number);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anoRef, mesRef - 1 - i, 1);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const txns = db.transacoes.find(t => mesDe(t.data) === m && t.efetivada !== false && ids.has(t.contaId));
    fluxo6m.push({
      mes: m,
      receitas: Math.round(txns.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0) * 100) / 100,
      despesas: Math.round(txns.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0) * 100) / 100
    });
  }

  res.json({
    mes,
    saldoGeral: Math.round(saldoGeral * 100) / 100,
    receitasMes: Math.round(receitasMes * 100) / 100,
    despesasMes: Math.round(despesasMes * 100) / 100,
    balancoMes: Math.round((receitasMes - despesasMes) * 100) / 100,
    projecao: {
      receitas: Math.round((receitasMes + pendReceitasMes) * 100) / 100,
      despesas: Math.round((despesasMes + pendDespesasMes) * 100) / 100,
      balanco: Math.round((receitasMes + pendReceitasMes - despesasMes - pendDespesasMes) * 100) / 100,
      saldo: Math.round((saldoGeral + pendRecAteMes - pendDespAteMes) * 100) / 100
    },
    pendentes: pendentes.length,
    pendencias: {
      atrasadas,
      aVencer,
      totalAtrasado: Math.round(atrasadas.reduce((s, t) => s + t.valor, 0) * 100) / 100,
      totalAVencer: Math.round(aVencer.reduce((s, t) => s + t.valor, 0) * 100) / 100
    },
    totalCaixinhas: Math.round(totalCaixinhas * 100) / 100,
    despesasPorCategoria: Object.values(porCategoria).sort((a, b) => b.total - a.total),
    fluxo6m
  });
});

// ═══════════════ INSIGHTS / ANÁLISE ═══════════════

router.get('/insights', (req, res) => {
  const mes = req.query.mes || new Date().toISOString().substring(0, 7);
  const ids = contasDoGrupo(req.query.grupo);
  const [ano, mm] = mes.split('-').map(Number);
  const dAnt = new Date(ano, mm - 2, 1);
  const mesAnterior = `${dAnt.getFullYear()}-${String(dAnt.getMonth() + 1).padStart(2, '0')}`;

  const txnsMes = db.transacoes.find(t => mesDe(t.data) === mes && t.efetivada !== false && ids.has(t.contaId));
  const txnsAnt = db.transacoes.find(t => mesDe(t.data) === mesAnterior && t.efetivada !== false && ids.has(t.contaId));

  const receitas = txnsMes.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
  const despesas = txnsMes.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
  const despesasAnt = txnsAnt.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
  const receitasAnt = txnsAnt.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);

  const insights = [];

  if (!txnsMes.length) {
    insights.push({ nivel: 'info', icone: 'info', texto: 'Sem movimentações neste mês. Importe o extrato ou lance transações para ver a análise.' });
    return res.json({ mes, insights });
  }

  // 1. Balanço do mês
  const balanco = receitas - despesas;
  if (balanco < 0) {
    insights.push({ nivel: 'critico', icone: 'error', texto: `Mês no vermelho: despesas superam receitas em R$ ${Math.abs(balanco).toFixed(2)}. Reveja os maiores gastos abaixo.` });
  } else if (receitas > 0 && (balanco / receitas) < 0.15) {
    insights.push({ nivel: 'alerta', icone: 'warning', texto: `Margem apertada: sobrou só ${Math.round((balanco / receitas) * 100)}% da receita (R$ ${balanco.toFixed(2)}). Meta saudável: 20%+.` });
  } else {
    insights.push({ nivel: 'ok', icone: 'check_circle', texto: `Mês positivo: sobraram R$ ${balanco.toFixed(2)} (${receitas > 0 ? Math.round((balanco / receitas) * 100) : 0}% da receita).` });
  }

  // 2. Top categoria de despesa
  const porCat = {};
  txnsMes.filter(t => t.tipo === 'despesa').forEach(t => {
    const cat = db.categorias.get(t.categoriaId);
    const nome = cat ? cat.nome : 'Sem categoria';
    porCat[nome] = (porCat[nome] || 0) + t.valor;
  });
  const topCats = Object.entries(porCat).sort((a, b) => b[1] - a[1]);
  if (topCats.length && despesas > 0) {
    const [nome, valor] = topCats[0];
    const pct = Math.round((valor / despesas) * 100);
    if (pct >= 30) {
      insights.push({ nivel: 'alerta', icone: 'pie_chart', texto: `"${nome}" concentra ${pct}% das despesas (R$ ${valor.toFixed(2)}). Cortar 15% aqui libera R$ ${(valor * 0.15).toFixed(2)}/mês.` });
    } else {
      insights.push({ nivel: 'info', icone: 'pie_chart', texto: `Maior gasto: "${nome}" com R$ ${valor.toFixed(2)} (${pct}% do total).` });
    }
  }

  // 3. Comparação com mês anterior
  if (despesasAnt > 0) {
    const varDesp = ((despesas - despesasAnt) / despesasAnt) * 100;
    if (varDesp > 15) {
      insights.push({ nivel: 'alerta', icone: 'trending_up', texto: `Despesas subiram ${Math.round(varDesp)}% vs mês anterior (R$ ${despesasAnt.toFixed(2)} → R$ ${despesas.toFixed(2)}).` });
    } else if (varDesp < -10) {
      insights.push({ nivel: 'ok', icone: 'trending_down', texto: `Despesas caíram ${Math.abs(Math.round(varDesp))}% vs mês anterior. Continue assim.` });
    }
  }
  if (receitasAnt > 0) {
    const varRec = ((receitas - receitasAnt) / receitasAnt) * 100;
    if (varRec < -20) {
      insights.push({ nivel: 'alerta', icone: 'trending_down', texto: `Receitas caíram ${Math.abs(Math.round(varRec))}% vs mês anterior. Ative prospecção ou cobre pendências.` });
    }
  }

  // 4. Concentração de receita (dependência de cliente)
  const porFonte = {};
  txnsMes.filter(t => t.tipo === 'receita').forEach(t => {
    const chave = (t.descricao || 'outros').toLowerCase().substring(0, 20);
    porFonte[chave] = (porFonte[chave] || 0) + t.valor;
  });
  const fontes = Object.entries(porFonte).sort((a, b) => b[1] - a[1]);
  if (fontes.length && receitas > 0) {
    const pctTop = Math.round((fontes[0][1] / receitas) * 100);
    if (pctTop >= 50 && fontes.length > 1) {
      insights.push({ nivel: 'alerta', icone: 'person', texto: `${pctTop}% da receita vem de uma única fonte. Risco de concentração — diversifique clientes.` });
    }
  }

  // 5. Orçamentos estourados
  db.orcamentos.find(o => o.mes === mes).forEach(o => {
    const gasto = gastoCategoriaMes(o.categoriaId, mes);
    const cat = db.categorias.get(o.categoriaId);
    const pct = o.valor > 0 ? Math.round((gasto / o.valor) * 100) : 0;
    if (pct >= 100) {
      insights.push({ nivel: 'critico', icone: 'donut_small', texto: `Orçamento de "${cat ? cat.nome : '?'}" estourado: ${pct}% (R$ ${gasto.toFixed(2)} de R$ ${o.valor.toFixed(2)}).` });
    } else if (pct >= 80) {
      insights.push({ nivel: 'alerta', icone: 'donut_small', texto: `Orçamento de "${cat ? cat.nome : '?'}" em ${pct}%. Restam R$ ${(o.valor - gasto).toFixed(2)}.` });
    }
  });

  // 5.5 Contas atrasadas
  const hojeStr = new Date().toISOString().substring(0, 10);
  const atrasadas = db.transacoes.find(t => t.efetivada === false && t.tipo === 'despesa' && ids.has(t.contaId) && t.data < hojeStr);
  if (atrasadas.length) {
    const totalAtr = atrasadas.reduce((s, t) => s + t.valor, 0);
    insights.push({ nivel: 'critico', icone: 'event_busy', texto: `${atrasadas.length} conta(s) ATRASADA(S) somando R$ ${totalAtr.toFixed(2)}. Priorize o pagamento para evitar juros.` });
  }

  // 6. Pendências
  const pendentes = db.transacoes.find(t => mesDe(t.data) === mes && t.efetivada === false && ids.has(t.contaId));
  if (pendentes.length) {
    const totalPend = pendentes.reduce((s, t) => s + t.valor, 0);
    insights.push({ nivel: 'info', icone: 'schedule', texto: `${pendentes.length} lançamento(s) pendente(s) somando R$ ${totalPend.toFixed(2)}. Confirme os efetivados.` });
  }

  res.json({ mes, insights });
});

module.exports = router;
