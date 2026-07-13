const db = require('../api/storage');

if (db.categorias.all().length > 0) {
  console.log('Seed já executado (categorias existem). Abortando.');
  process.exit(0);
}

// ═══ Categorias de DESPESA (padrão Mobills) ═══
const despesas = [
  { nome: 'Alimentação', cor: '#ff3b30', icone: 'restaurant' },
  { nome: 'Transporte', cor: '#ff9500', icone: 'directions_car' },
  { nome: 'Combustível', cor: '#ff6b35', icone: 'local_gas_station' },
  { nome: 'Moradia', cor: '#af52de', icone: 'home' },
  { nome: 'Saúde', cor: '#ff2d55', icone: 'favorite' },
  { nome: 'Educação', cor: '#5856d6', icone: 'school' },
  { nome: 'Lazer', cor: '#ffcc00', icone: 'sports_esports' },
  { nome: 'Compras', cor: '#ff6b9d', icone: 'shopping_bag' },
  { nome: 'Assinaturas', cor: '#00b0ff', icone: 'subscriptions' },
  { nome: 'Infraestrutura', cor: '#0084ff', icone: 'wifi' },
  { nome: 'Impostos', cor: '#8e8e93', icone: 'account_balance' },
  { nome: 'Cartão de Crédito', cor: '#5856d6', icone: 'credit_card' },
  { nome: 'Saques Pessoais', cor: '#ff3b30', icone: 'payments' },
  { nome: 'Despesa Operacional', cor: '#ff9500', icone: 'business_center' },
  { nome: 'Doações', cor: '#34c759', icone: 'volunteer_activism' },
  { nome: 'Investimentos', cor: '#30d158', icone: 'trending_up' },
  { nome: 'Outros', cor: '#86868b', icone: 'more_horiz' }
];

// ═══ Categorias de RECEITA ═══
const receitas = [
  { nome: 'Vendas', cor: '#34c759', icone: 'sell' },
  { nome: 'Salário', cor: '#30d158', icone: 'work' },
  { nome: 'Serviços', cor: '#00b0ff', icone: 'design_services' },
  { nome: 'Rendimentos', cor: '#5856d6', icone: 'trending_up' },
  { nome: 'Reembolsos', cor: '#ffcc00', icone: 'currency_exchange' },
  { nome: 'Outros', cor: '#86868b', icone: 'more_horiz' }
];

despesas.forEach(c => db.categorias.insert({ ...c, tipo: 'despesa' }));
receitas.forEach(c => db.categorias.insert({ ...c, tipo: 'receita' }));

// ═══ Contas iniciais ═══
db.contas.insert({ nome: 'Banco Inter PJ', tipo: 'corrente', cor: '#FF6B35', icone: 'account_balance', saldoInicial: 0, arquivada: false });
db.contas.insert({ nome: 'Banco Itaú PJ', tipo: 'corrente', cor: '#FF8C00', icone: 'account_balance', saldoInicial: 0, arquivada: false });
db.contas.insert({ nome: 'Carteira', tipo: 'carteira', cor: '#34c759', icone: 'wallet', saldoInicial: 0, arquivada: false });

console.log('✅ Seed concluído:');
console.log(`   ${db.categorias.all().length} categorias`);
console.log(`   ${db.contas.all().length} contas`);
