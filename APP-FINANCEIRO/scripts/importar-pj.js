/**
 * Importa extratos PJ do financeiro-dashboard para o APP-FINANCEIRO.
 * Inter: jan-mar + abr-jun | Itaú: jun
 */
const fs = require('fs');
const path = require('path');
const db = require('../api/storage');
const importer = require('../api/importer');

const EXTRATOS_DIR = path.join(__dirname, '..', '..', 'financeiro-dashboard', 'data', 'extratos');

const FONTES = [
  { banco: 'Banco Inter PJ', arquivos: ['inter/extrato-inter-janeiro-marco-2026.csv', 'inter/extrato-inter-abril-junho-2026.csv'] },
  { banco: 'Banco Itaú PJ', arquivos: ['itau/extrato-itau-junho-2026.csv'] }
];

const categorias = db.categorias.all();
let totalImportadas = 0;
let totalPuladas = 0;

for (const fonte of FONTES) {
  const conta = db.contas.all().find(c => c.nome === fonte.banco);
  if (!conta) {
    console.error(`❌ Conta "${fonte.banco}" não encontrada. Rode o seed primeiro.`);
    continue;
  }

  for (const arq of fonte.arquivos) {
    const caminho = path.join(EXTRATOS_DIR, arq);
    if (!fs.existsSync(caminho)) {
      console.error(`⚠️  Arquivo não encontrado: ${caminho}`);
      continue;
    }

    const conteudo = fs.readFileSync(caminho, 'utf8');
    const parsed = importer.parse(conteudo, 'csv');
    let importadas = 0;

    for (const t of parsed) {
      // Dedup: mesma conta + data + valor + descrição
      const dup = db.transacoes.all().some(e =>
        e.contaId === conta.id && e.data === t.data &&
        Math.abs(e.valor - t.valor) < 0.005 &&
        (e.descricao || '').toLowerCase() === (t.descricao || '').toLowerCase()
      );
      if (dup) { totalPuladas++; continue; }

      db.transacoes.insert({
        descricao: t.descricao,
        valor: t.valor,
        data: t.data,
        tipo: t.tipo,
        contaId: conta.id,
        contaDestinoId: null,
        categoriaId: importer.categorizar(t, categorias),
        cartaoId: null,
        efetivada: true,
        observacao: 'importado extrato PJ',
        importada: true
      });
      importadas++;
    }

    totalImportadas += importadas;
    console.log(`✅ ${arq} → ${conta.nome}: ${importadas} transações`);
  }
}

console.log(`\n📊 Total: ${totalImportadas} importadas, ${totalPuladas} duplicadas puladas`);
