const fs = require('fs');
const path = require('path');

class CSVProcessor {
  /**
   * Processa arquivo CSV de extrato bancário
   * @param {string} filePath - Caminho do arquivo CSV
   * @param {string} banco - Nome do banco (inter, itau)
   * @returns {Object} Dados processados e categorizados
   */
  static processExtrato(filePath, banco) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const linhas = content.split('\n').filter(l => l.trim());

      // Pular header e linhas vazias
      const transacoes = [];
      let startIndex = 0;

      // Detectar linha de cabeçalho
      for (let i = 0; i < linhas.length; i++) {
        if (linhas[i].includes('data') || linhas[i].includes('Data')) {
          startIndex = i + 1;
          break;
        }
      }

      // Processar linhas
      for (let i = startIndex; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;

        const colunas = linha.split(',').map(c => c.trim());

        if (colunas.length < 5) continue;

        const txn = this.parseLinha(colunas, banco);
        if (txn && txn.valor !== 0) {
          transacoes.push(txn);
        }
      }

      // Calcular métricas
      const metricas = this.calcularMetricas(transacoes);

      return {
        banco,
        transacoes,
        metricas,
        total: transacoes.length,
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Erro ao processar CSV: ${error.message}`);
    }
  }

  /**
   * Parse de uma linha individual
   */
  static parseLinha(colunas, banco) {
    try {
      let data = colunas[0];
      let descricao = colunas[1];
      let tipo = colunas[2];
      let categoria = colunas[3];
      let valor = parseFloat(colunas[4].replace(',', '.'));
      let saldo = colunas[5] ? parseFloat(colunas[5].replace(',', '.')) : null;

      // Validações
      if (!data || !descricao || isNaN(valor)) {
        return null;
      }

      // Normalizar data (DD/MM/YYYY para YYYY-MM-DD)
      data = this.normalizarData(data);
      if (!data) return null;

      // Classificar se não houver tipo
      if (!tipo || tipo === '') {
        tipo = valor > 0 ? 'receita' : 'despesa';
      } else {
        tipo = tipo.toLowerCase().includes('receita') || tipo.toLowerCase().includes('credit')
          ? 'receita'
          : 'despesa';
      }

      // Categorizar se não houver categoria
      if (!categoria || categoria === '') {
        categoria = this.categorizarAutomaticamente(descricao, tipo);
      }

      return {
        data,
        descricao: descricao.substring(0, 100),
        tipo,
        categoria,
        valor: Math.abs(valor),
        saldo,
        banco
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Normaliza data para formato YYYY-MM-DD
   */
  static normalizarData(data) {
    // DD/MM/YYYY
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      if (!dia || !mes || !ano) return null;
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    // YYYY-MM-DD
    if (data.includes('-') && data.length === 10) {
      return data;
    }
    return null;
  }

  /**
   * Categoriza automaticamente baseado em palavras-chave
   */
  static categorizarAutomaticamente(descricao, tipo) {
    const desc = descricao.toLowerCase();

    // Receitas
    if (tipo === 'receita') {
      if (desc.includes('semintervalo') || desc.includes('curso') || desc.includes('treinamento')) return 'vendas';
      if (desc.includes('editora') || desc.includes('livro')) return 'vendas';
      if (desc.includes('boleto') || desc.includes('transferência')) return 'vendas';
      if (desc.includes('rend') || desc.includes('juros') || desc.includes('rendimento')) return 'investimentos';
      if (desc.includes('resgate') || desc.includes('cdb') || desc.includes('aplicação')) return 'investimentos';
      return 'vendas';
    }

    // Despesas
    if (desc.includes('imposto') || desc.includes('tributo') || desc.includes('simples nacional') || desc.includes('sispag tributos')) return 'impostos';
    if (desc.includes('folha') || desc.includes('salário') || desc.includes('pró-labore')) return 'folha-pagamento';
    if (desc.includes('google') || desc.includes('internet') || desc.includes('starlink') || desc.includes('telefone') || desc.includes('nic')) return 'infraestrutura';
    if (desc.includes('aluguel') || desc.includes('coworking') || desc.includes('meu office') || desc.includes('sindico')) return 'despesa-fixa';
    if (desc.includes('combustível') || desc.includes('gasolina') || desc.includes('auto posto') || desc.includes('estacionamento')) return 'combustivel';
    if (desc.includes('cartão') || desc.includes('elo') || desc.includes('banco csf') || desc.includes('pagamento total') || desc.includes('pagamento fatura')) return 'cartoes';
    if (desc.includes('cdb') || desc.includes('aplicação') || desc.includes('raro assessor')) return 'investimentos';
    if (desc.includes('doação') || desc.includes('guardiões') || desc.includes('associação')) return 'doacoes';
    if (desc.includes('pix') && desc.includes('rodrigo')) return 'saques-pessoais';
    if (desc.includes('saque')) return 'saques-pessoais';
    if (desc.includes('tarifa') || desc.includes('taxa') || desc.includes('manut')) return 'despesa-operacional';

    return 'despesa-operacional';
  }

  /**
   * Calcula métricas financeiras
   */
  static calcularMetricas(transacoes) {
    const receitas = transacoes.filter(t => t.tipo === 'receita');
    const despesas = transacoes.filter(t => t.tipo === 'despesa');

    const totalReceita = receitas.reduce((sum, t) => sum + t.valor, 0);
    const totalDespesa = despesas.reduce((sum, t) => sum + t.valor, 0);
    const saldoLiquido = totalReceita - totalDespesa;
    const margemLucro = totalReceita > 0 ? (saldoLiquido / totalReceita * 100) : 0;

    // Despesas por categoria
    const despesasPorCategoria = {};
    despesas.forEach(d => {
      despesasPorCategoria[d.categoria] = (despesasPorCategoria[d.categoria] || 0) + d.valor;
    });

    // Receitas por categoria
    const receitasPorCategoria = {};
    receitas.forEach(r => {
      receitasPorCategoria[r.categoria] = (receitasPorCategoria[r.categoria] || 0) + r.valor;
    });

    return {
      totalReceita: parseFloat(totalReceita.toFixed(2)),
      totalDespesa: parseFloat(totalDespesa.toFixed(2)),
      saldoLiquido: parseFloat(saldoLiquido.toFixed(2)),
      margemLucro: parseFloat(margemLucro.toFixed(2)),
      totalTransacoes: transacoes.length,
      totalReceitas: receitas.length,
      totalDespesas: despesas.length,
      despesasPorCategoria,
      receitasPorCategoria
    };
  }

  /**
   * Consolida múltiplos extratos
   */
  static consolidarExtratos(extratos) {
    const todasTransacoes = [];
    let totalReceita = 0;
    let totalDespesa = 0;

    extratos.forEach(extrato => {
      todasTransacoes.push(...extrato.transacoes);
      totalReceita += extrato.metricas.totalReceita;
      totalDespesa += extrato.metricas.totalDespesa;
    });

    // Ordenar por data
    todasTransacoes.sort((a, b) => new Date(a.data) - new Date(b.data));

    const saldoLiquido = totalReceita - totalDespesa;
    const margemLucro = totalReceita > 0 ? (saldoLiquido / totalReceita * 100) : 0;

    return {
      extratos: extratos.map(e => e.banco),
      metricas: {
        totalReceita: parseFloat(totalReceita.toFixed(2)),
        totalDespesa: parseFloat(totalDespesa.toFixed(2)),
        saldoLiquido: parseFloat(saldoLiquido.toFixed(2)),
        margemLucro: parseFloat(margemLucro.toFixed(2)),
        totalTransacoes: todasTransacoes.length
      },
      transacoes: todasTransacoes,
      consolidatedAt: new Date().toISOString()
    };
  }
}

module.exports = CSVProcessor;
