const fs = require('fs');
const path = require('path');
const CSVProcessor = require('./csvProcessor');

class FinancialController {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.extractDir = path.join(this.dataDir, 'extratos');
    this.processedDir = path.join(this.dataDir, 'processed');

    // Criar diretórios se não existirem
    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
    }
  }

  /**
   * Carrega e processa todos os extratos disponíveis
   */
  loadAllExtratos() {
    try {
      const extratos = [];
      const bancos = ['inter', 'itau'];

      for (const banco of bancos) {
        const bancoDir = path.join(this.extractDir, banco);
        if (!fs.existsSync(bancoDir)) continue;

        const files = fs.readdirSync(bancoDir).filter(f => f.endsWith('.csv'));

        for (const file of files) {
          const filePath = path.join(bancoDir, file);
          try {
            const extrato = CSVProcessor.processExtrato(filePath, banco);
            extratos.push(extrato);

            // Salvar dados processados
            this.saveProcessedData(banco, file, extrato);
          } catch (error) {
            console.error(`Erro ao processar ${file}:`, error.message);
          }
        }
      }

      return extratos;
    } catch (error) {
      throw new Error(`Erro ao carregar extratos: ${error.message}`);
    }
  }

  /**
   * Salva dados processados em JSON
   */
  saveProcessedData(banco, originalFile, data) {
    const fileName = originalFile.replace('.csv', '.json');
    const bancoDir = path.join(this.processedDir, banco);

    if (!fs.existsSync(bancoDir)) {
      fs.mkdirSync(bancoDir, { recursive: true });
    }

    const filePath = path.join(bancoDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Retorna dashboard com métricas consolidadas
   */
  getDashboard() {
    try {
      const extratos = this.loadAllExtratos();

      if (extratos.length === 0) {
        return this.getDashboardVazio();
      }

      // Consolidar dados
      const consolidado = CSVProcessor.consolidarExtratos(extratos);

      return {
        status: 'sucesso',
        periodo: this.getPeriodo(consolidado.transacoes),
        metricas: consolidado.metricas,
        bancos: consolidado.extratos,
        transacoes: consolidado.transacoes,
        graficoReceitas: this.gerarGraficoReceitas(consolidado.transacoes),
        graficoDespesas: this.gerarGraficoDespesas(consolidado.transacoes),
        analiseCategoria: this.analisarCategorias(consolidado.transacoes),
        saude: this.calcularSaude(consolidado.metricas)
      };
    } catch (error) {
      return {
        status: 'erro',
        mensagem: error.message
      };
    }
  }

  /**
   * Retorna transações com filtros
   */
  getTransacoes(filtros = {}) {
    try {
      const extratos = this.loadAllExtratos();
      let transacoes = [];

      extratos.forEach(e => {
        transacoes.push(...e.transacoes);
      });

      // Aplicar filtros
      if (filtros.tipo) {
        transacoes = transacoes.filter(t => t.tipo === filtros.tipo);
      }

      if (filtros.categoria) {
        transacoes = transacoes.filter(t => t.categoria === filtros.categoria);
      }

      if (filtros.banco) {
        transacoes = transacoes.filter(t => t.banco === filtros.banco);
      }

      if (filtros.dataInicio && filtros.dataFim) {
        transacoes = transacoes.filter(t => {
          const d = new Date(t.data);
          return d >= new Date(filtros.dataInicio) && d <= new Date(filtros.dataFim);
        });
      }

      // Ordenar por data
      transacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

      return {
        status: 'sucesso',
        total: transacoes.length,
        transacoes
      };
    } catch (error) {
      return {
        status: 'erro',
        mensagem: error.message
      };
    }
  }

  /**
   * Gera gráfico de receitas por período
   */
  gerarGraficoReceitas(transacoes) {
    const receitas = transacoes.filter(t => t.tipo === 'receita');
    const porMes = {};

    receitas.forEach(r => {
      const mes = r.data.substring(0, 7); // YYYY-MM
      porMes[mes] = (porMes[mes] || 0) + r.valor;
    });

    return Object.entries(porMes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, valor]) => ({
        mes,
        valor: parseFloat(valor.toFixed(2))
      }));
  }

  /**
   * Gera gráfico de despesas por período
   */
  graficoDespesas(transacoes) {
    const despesas = transacoes.filter(t => t.tipo === 'despesa');
    const porMes = {};

    despesas.forEach(d => {
      const mes = d.data.substring(0, 7); // YYYY-MM
      porMes[mes] = (porMes[mes] || 0) + d.valor;
    });

    return Object.entries(porMes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, valor]) => ({
        mes,
        valor: parseFloat(valor.toFixed(2))
      }));
  }

  /**
   * Typo fix - corrige chamada do método
   */
  gerarGraficoDespesas(transacoes) {
    return this.graficoDespesas(transacoes);
  }

  /**
   * Analisa transações por categoria
   */
  analisarCategorias(transacoes) {
    const porCategoria = {};

    transacoes.forEach(t => {
      if (!porCategoria[t.categoria]) {
        porCategoria[t.categoria] = {
          receitas: 0,
          despesas: 0,
          total: 0
        };
      }

      if (t.tipo === 'receita') {
        porCategoria[t.categoria].receitas += t.valor;
      } else {
        porCategoria[t.categoria].despesas += t.valor;
      }
      porCategoria[t.categoria].total += t.valor;
    });

    return Object.entries(porCategoria)
      .map(([cat, dados]) => ({
        categoria: cat,
        receitas: parseFloat(dados.receitas.toFixed(2)),
        despesas: parseFloat(dados.despesas.toFixed(2)),
        saldo: parseFloat((dados.receitas - dados.despesas).toFixed(2))
      }))
      .sort((a, b) => Math.abs(b.saldo) - Math.abs(a.saldo));
  }

  /**
   * Calcula saúde financeira
   */
  calcularSaude(metricas) {
    const score = {
      margemLucro: metricas.saldoLiquido > 0 ? 100 : 0,
      fluxoCaixa: metricas.saldoLiquido > 0 ? 'positivo' : 'negativo',
      status: metricas.margemLucro > 0 ? '🟢 Saudável' : '🔴 Crítico',
      dicas: this.gerarDicas(metricas)
    };
    return score;
  }

  /**
   * Gera dicas baseadas em métricas
   */
  gerarDicas(metricas) {
    const dicas = [];

    if (metricas.saldoLiquido < 0) {
      dicas.push('⚠️ Fluxo de caixa negativo - despesas > receitas');
    }

    if (metricas.margemLucro < 10) {
      dicas.push('💡 Margem de lucro baixa - revisar estratégia de preços');
    }

    if (metricas.totalDespesa > metricas.totalReceita * 0.8) {
      dicas.push('🔍 Despesas muito altas - analisar oportunidades de redução');
    }

    if (dicas.length === 0) {
      dicas.push('✅ Saúde financeira dentro do esperado');
    }

    return dicas;
  }

  /**
   * Retorna período do extrato
   */
  getPeriodo(transacoes) {
    if (transacoes.length === 0) return null;

    const datas = transacoes.map(t => new Date(t.data)).sort((a, b) => a - b);
    return {
      inicio: datas[0].toISOString().split('T')[0],
      fim: datas[datas.length - 1].toISOString().split('T')[0],
      dias: Math.ceil((datas[datas.length - 1] - datas[0]) / (1000 * 60 * 60 * 24))
    };
  }

  /**
   * Dashboard vazio (sem dados)
   */
  getDashboardVazio() {
    return {
      status: 'vazio',
      mensagem: 'Nenhum extrato carregado. Coloque arquivos CSV em /data/extratos/',
      metricas: {
        totalReceita: 0,
        totalDespesa: 0,
        saldoLiquido: 0,
        margemLucro: 0
      }
    };
  }

  /**
   * Retorna análise estratégica (COO insights)
   */
  getAnaliseEstrategica() {
    try {
      const dashboard = this.getDashboard();

      if (dashboard.status !== 'sucesso') {
        return dashboard;
      }

      const analise = {
        status: 'sucesso',
        distribuicaoDespesas: this.getDistribuicaoDespesas(dashboard.analiseCategoria),
        distribuicaoReceitas: this.getDistribuicaoReceitas(dashboard.analiseCategoria),
        tendencias: this.calcularTendencias(dashboard.transacoes),
        oportunidades: this.identificarOportunidades(dashboard),
        recomendacoes: this.gerarRecomendacoes(dashboard),
        kpis: this.calcularKPIsAvancados(dashboard)
      };

      return analise;
    } catch (error) {
      return {
        status: 'erro',
        mensagem: error.message
      };
    }
  }

  getDistribuicaoDespesas(analiseCategoria) {
    return analiseCategoria
      .filter(c => c.despesas > 0)
      .sort((a, b) => b.despesas - a.despesas)
      .slice(0, 8)
      .map(c => ({
        categoria: c.categoria,
        valor: c.despesas,
        percentual: 0 // será calculado no frontend
      }));
  }

  getDistribuicaoReceitas(analiseCategoria) {
    return analiseCategoria
      .filter(c => c.receitas > 0)
      .sort((a, b) => b.receitas - a.receitas)
      .slice(0, 8)
      .map(c => ({
        categoria: c.categoria,
        valor: c.receitas,
        percentual: 0 // será calculado no frontend
      }));
  }

  calcularTendencias(transacoes) {
    const porMes = {};
    transacoes.forEach(t => {
      const mes = t.data.substring(0, 7);
      if (!porMes[mes]) {
        porMes[mes] = { receitas: 0, despesas: 0 };
      }
      if (t.tipo === 'receita') {
        porMes[mes].receitas += t.valor;
      } else {
        porMes[mes].despesas += t.valor;
      }
    });

    return Object.entries(porMes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, dados]) => ({
        mes,
        receitas: parseFloat(dados.receitas.toFixed(2)),
        despesas: parseFloat(dados.despesas.toFixed(2)),
        saldo: parseFloat((dados.receitas - dados.despesas).toFixed(2))
      }));
  }

  identificarOportunidades(dashboard) {
    const oportunidades = [];
    const m = dashboard.metricas;
    const analise = dashboard.analiseCategoria;

    // Oportunidade 1: Redução de despesas
    const despesasAltas = analise.filter(c => c.despesas > 0).slice(0, 3);
    if (despesasAltas.length > 0) {
      const topDespesa = despesasAltas[0];
      oportunidades.push({
        tipo: 'redução',
        titulo: 'Reduzir despesas principais',
        descricao: `A categoria "${topDespesa.categoria}" representa a maior despesa (R$ ${this.fmt(topDespesa.despesas)}). Potencial de redução: 10-20%.`,
        impacto: topDespesa.despesas * 0.15,
        prioridade: 'alta'
      });
    }

    // Oportunidade 2: Aumentar receitas
    const receitasAltas = analise.filter(c => c.receitas > 0).slice(0, 3);
    if (receitasAltas.length > 0) {
      oportunidades.push({
        tipo: 'crescimento',
        titulo: 'Expandir receitas principais',
        descricao: `Focar em aumentar receitas nas categorias mais rentáveis. Potencial: +20% no próximo período.`,
        impacto: m.totalReceita * 0.20,
        prioridade: 'alta'
      });
    }

    // Oportunidade 3: Eficiência operacional
    if (m.margemLucro < 25) {
      oportunidades.push({
        tipo: 'eficiência',
        titulo: 'Melhorar eficiência operacional',
        descricao: `Margem atual: ${m.margemLucro.toFixed(1)}%. Meta: 30%. Otimize processos para aumentar.`,
        impacto: m.saldoLiquido * 0.15,
        prioridade: 'média'
      });
    }

    return oportunidades;
  }

  gerarRecomendacoes(dashboard) {
    const m = dashboard.metricas;
    const recomendacoes = [];

    // Recomendação 1: Saúde financeira
    if (m.saldoLiquido > 0 && m.margemLucro > 20) {
      recomendacoes.push({
        icone: '✅',
        titulo: 'Saúde Financeira Ótima',
        descricao: 'Continue mantendo o padrão atual de receitas vs despesas.',
        acao: 'Monitorar mensalmente'
      });
    } else if (m.saldoLiquido > 0 && m.margemLucro < 20) {
      recomendacoes.push({
        icone: '⚠️',
        titulo: 'Margem Baixa',
        descricao: 'Embora lucrativo, revise estratégia de preços e custos operacionais.',
        acao: 'Revisar pricing em 30 dias'
      });
    } else {
      recomendacoes.push({
        icone: '🔴',
        titulo: 'Fluxo Crítico',
        descricao: 'Despesas excedem receitas. Ação imediata necessária.',
        acao: 'Cortar despesas de 15-20% este mês'
      });
    }

    // Recomendação 2: Diversificação
    const catUnicas = new Set(dashboard.analiseCategoria.map(c => c.categoria)).size;
    if (catUnicas < 5) {
      recomendacoes.push({
        icone: '📊',
        titulo: 'Diversificar Fontes',
        descricao: 'Poucas categorias de receita. Diversifique para reduzir risco.',
        acao: 'Explorar novos mercados'
      });
    }

    return recomendacoes;
  }

  calcularKPIsAvancados(dashboard) {
    const m = dashboard.metricas;
    const txns = dashboard.transacoes;

    return {
      margemLucro: parseFloat(m.margemLucro.toFixed(2)),
      roa: parseFloat((m.saldoLiquido / Math.max(m.totalDespesa, 1) * 100).toFixed(2)), // Return on Assets
      custoMedio: parseFloat((m.totalDespesa / Math.max(txns.filter(t => t.tipo === 'despesa').length, 1)).toFixed(2)),
      receitaMedia: parseFloat((m.totalReceita / Math.max(txns.filter(t => t.tipo === 'receita').length, 1)).toFixed(2)),
      velocidadeFaturamento: parseFloat((m.totalReceita / Math.max(dashboard.periodo.dias, 1)).toFixed(2)),
      indiceEficiencia: parseFloat((m.totalReceita / Math.max(m.totalDespesa, 1)).toFixed(2))
    };
  }

  /**
   * Análise de fluxo de caixa por dia
   */
  getFluxoDiario() {
    try {
      const extratos = this.loadAllExtratos();
      if (extratos.length === 0) return { status: 'vazio' };

      const consolidado = CSVProcessor.consolidarExtratos(extratos);
      const fluxoPorDia = {};

      consolidado.transacoes.forEach(t => {
        const dia = t.data;
        if (!fluxoPorDia[dia]) {
          fluxoPorDia[dia] = {
            data: dia,
            entradas: 0,
            saidas: 0,
            saldo: 0,
            transacoes: []
          };
        }

        if (t.tipo === 'receita') {
          fluxoPorDia[dia].entradas += t.valor;
        } else {
          fluxoPorDia[dia].saidas += t.valor;
        }

        fluxoPorDia[dia].saldo = fluxoPorDia[dia].entradas - fluxoPorDia[dia].saidas;
        fluxoPorDia[dia].transacoes.push({
          tipo: t.tipo,
          descricao: t.descricao,
          valor: t.valor,
          categoria: t.categoria
        });
      });

      return {
        status: 'sucesso',
        fluxoDiario: Object.values(fluxoPorDia).sort((a, b) => new Date(a.data) - new Date(b.data))
      };
    } catch (error) {
      return { status: 'erro', mensagem: error.message };
    }
  }

  /**
   * Análise de fluxo de caixa por mês
   */
  getFluxoMensal() {
    try {
      const extratos = this.loadAllExtratos();
      if (extratos.length === 0) return { status: 'vazio' };

      const consolidado = CSVProcessor.consolidarExtratos(extratos);
      const fluxoPorMes = {};

      consolidado.transacoes.forEach(t => {
        const mes = t.data.substring(0, 7); // YYYY-MM
        if (!fluxoPorMes[mes]) {
          fluxoPorMes[mes] = {
            mes,
            entradas: 0,
            saidas: 0,
            saldo: 0,
            dias: new Set(),
            transacoes: {
              receitas: [],
              despesas: []
            }
          };
        }

        fluxoPorMes[mes].dias.add(t.data);

        if (t.tipo === 'receita') {
          fluxoPorMes[mes].entradas += t.valor;
          fluxoPorMes[mes].transacoes.receitas.push({
            data: t.data,
            descricao: t.descricao,
            valor: t.valor,
            categoria: t.categoria
          });
        } else {
          fluxoPorMes[mes].saidas += t.valor;
          fluxoPorMes[mes].transacoes.despesas.push({
            data: t.data,
            descricao: t.descricao,
            valor: t.valor,
            categoria: t.categoria
          });
        }

        fluxoPorMes[mes].saldo = fluxoPorMes[mes].entradas - fluxoPorMes[mes].saidas;
      });

      const fluxoFormatado = Object.values(fluxoPorMes).map(m => ({
        mes: m.mes,
        entradas: parseFloat(m.entradas.toFixed(2)),
        saidas: parseFloat(m.saidas.toFixed(2)),
        saldo: parseFloat(m.saldo.toFixed(2)),
        diasComMovimentacao: m.dias.size,
        totalTransacoes: m.transacoes.receitas.length + m.transacoes.despesas.length,
        receitas: m.transacoes.receitas.slice(0, 20),
        despesas: m.transacoes.despesas.slice(0, 20)
      })).sort((a, b) => a.mes.localeCompare(b.mes));

      return {
        status: 'sucesso',
        fluxoMensal: fluxoFormatado
      };
    } catch (error) {
      return { status: 'erro', mensagem: error.message };
    }
  }

  fmt(v) {
    return Math.abs(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /**
   * Retorna relatório de análise
   */
  getRelatorio() {
    try {
      const dashboard = this.getDashboard();

      if (dashboard.status !== 'sucesso') {
        return dashboard;
      }

      return {
        status: 'sucesso',
        periodo: dashboard.periodo,
        resumo: {
          totalReceita: dashboard.metricas.totalReceita,
          totalDespesa: dashboard.metricas.totalDespesa,
          saldoLiquido: dashboard.metricas.saldoLiquido,
          margemLucro: dashboard.metricas.margemLucro + '%'
        },
        analiseDetalha: {
          despesasPorCategoria: this.ordenarPorValor(
            dashboard.analiseCategoria.filter(c => c.despesas > 0),
            'despesas'
          ),
          receitasPorCategoria: this.ordenarPorValor(
            dashboard.analiseCategoria.filter(c => c.receitas > 0),
            'receitas'
          )
        },
        saude: dashboard.saude,
        gerado: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'erro',
        mensagem: error.message
      };
    }
  }

  /**
   * Ordena por valor
   */
  ordenarPorValor(arr, campo) {
    return arr.sort((a, b) => b[campo] - a[campo]);
  }
}

module.exports = FinancialController;
