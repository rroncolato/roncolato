#!/usr/bin/env node

const FinancialController = require('./controllers/financialController');

console.log('\n📊 TESTANDO BACKEND FINANCEIRO\n');
console.log('=' .repeat(60));

try {
  const controller = new FinancialController();

  // Teste 1: Carregar dashboard
  console.log('\n✅ TESTE 1: Carregando Dashboard...\n');
  const dashboard = controller.getDashboard();

  console.log('Status:', dashboard.status);
  console.log('Período:', JSON.stringify(dashboard.periodo, null, 2));
  console.log('\n📈 MÉTRICAS CONSOLIDADAS:');
  console.log('├── Total Receita:', 'R$', dashboard.metricas.totalReceita);
  console.log('├── Total Despesa:', 'R$', dashboard.metricas.totalDespesa);
  console.log('├── Saldo Líquido:', 'R$', dashboard.metricas.saldoLiquido);
  console.log('└── Margem de Lucro:', dashboard.metricas.margemLucro + '%');

  console.log('\n📱 BANCOS CARREGADOS:', dashboard.bancos);
  console.log('📊 Total de Transações:', dashboard.metricas.totalTransacoes);

  // Teste 2: Análise por categoria
  console.log('\n✅ TESTE 2: Análise por Categoria...\n');
  console.log('TOP 5 CATEGORIAS:');
  dashboard.analiseCategoria.slice(0, 5).forEach((cat, i) => {
    console.log(`${i + 1}. ${cat.categoria}`);
    console.log(`   ├─ Receitas: R$ ${cat.receitas}`);
    console.log(`   ├─ Despesas: R$ ${cat.despesas}`);
    console.log(`   └─ Saldo: R$ ${cat.saldo}\n`);
  });

  // Teste 3: Gráficos
  console.log('✅ TESTE 3: Gráficos...\n');
  console.log('RECEITAS POR MÊS:');
  dashboard.graficoReceitas.forEach(item => {
    console.log(`├── ${item.mes}: R$ ${item.valor}`);
  });

  console.log('\nDESPESAS POR MÊS:');
  dashboard.graficoDespesas.forEach(item => {
    console.log(`├── ${item.mes}: R$ ${item.valor}`);
  });

  // Teste 4: Saúde financeira
  console.log('\n✅ TESTE 4: Saúde Financeira...\n');
  console.log('Status:', dashboard.saude.status);
  console.log('Fluxo de Caixa:', dashboard.saude.fluxoCaixa);
  console.log('\nDICAS:');
  dashboard.saude.dicas.forEach(dica => {
    console.log('├──', dica);
  });

  // Teste 5: Relatório
  console.log('\n✅ TESTE 5: Relatório Completo...\n');
  const relatorio = controller.getRelatorio();
  console.log('Relatório gerado:', relatorio.status);
  console.log(JSON.stringify(relatorio, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✅ TODOS OS TESTES PASSARAM COM SUCESSO!\n');

} catch (error) {
  console.error('\n❌ ERRO:', error.message);
  console.error(error.stack);
  process.exit(1);
}
