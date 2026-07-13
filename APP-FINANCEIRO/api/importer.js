/**
 * Parser de extratos: CSV (padrão app, Inter, genérico) e OFX.
 * Retorna transações normalizadas: { data: YYYY-MM-DD, descricao, valor: number (positivo), tipo: receita|despesa }
 */

// ── Helpers ──

function parseValorBR(s) {
  // "1.234,56" ou "-1.234,56" → -1234.56
  if (typeof s === 'number') return s;
  s = String(s).trim().replace(/[R$\s]/g, '');
  if (/,\d{1,2}$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.');
  }
  const v = parseFloat(s);
  return isNaN(v) ? null : v;
}

function parseDataFlex(s) {
  s = String(s).trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10);
  // DD/MM/YYYY
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  // YYYYMMDD (OFX)
  const o = s.match(/^(\d{4})(\d{2})(\d{2})/);
  if (o) return `${o[1]}-${o[2]}-${o[3]}`;
  return null;
}

// ── CSV ──

function parseCSV(conteudo) {
  const linhas = conteudo.split(/\r?\n/).filter(l => l.trim());
  if (!linhas.length) return [];

  // Detectar delimitador na linha de cabeçalho
  const headerIdx = linhas.findIndex(l => /data/i.test(l) && (/valor/i.test(l) || /histor/i.test(l)));
  const inicio = headerIdx >= 0 ? headerIdx : 0;
  const header = linhas[inicio];
  const delim = (header.match(/;/g) || []).length >= (header.match(/,/g) || []).length ? ';' : ',';
  const cols = header.split(delim).map(c => c.trim().toLowerCase());

  // Mapear índices das colunas
  const idxData = cols.findIndex(c => /^data/.test(c));
  const idxValor = cols.findIndex(c => /valor/.test(c));
  const idxDesc = cols.findIndex(c => /descri/.test(c));
  const idxHist = cols.findIndex(c => /histor/.test(c));
  const idxTipo = cols.findIndex(c => /^tipo/.test(c));

  if (idxData === -1 || idxValor === -1) return [];

  const txns = [];
  for (let i = inicio + 1; i < linhas.length; i++) {
    const partes = linhas[i].split(delim);
    if (partes.length < 2) continue;

    const data = parseDataFlex(partes[idxData]);
    const valor = parseValorBR(partes[idxValor]);
    if (!data || valor === null || valor === 0) continue;

    let descricao = '';
    if (idxDesc >= 0 && partes[idxDesc]) descricao = partes[idxDesc].trim();
    if (idxHist >= 0 && partes[idxHist] && !descricao) descricao = partes[idxHist].trim();
    if (idxHist >= 0 && idxDesc >= 0 && partes[idxHist] && partes[idxDesc]) {
      descricao = `${partes[idxDesc].trim()}`;
    }
    descricao = descricao.replace(/\s+/g, ' ');

    // Tipo: coluna explícita ou sinal do valor
    let tipo;
    if (idxTipo >= 0 && partes[idxTipo]) {
      const t = partes[idxTipo].trim().toLowerCase();
      if (t === 'receita' || t === 'despesa') tipo = t;
      else if (t === 'saldo') continue; // linha de saldo, ignorar
    }
    if (!tipo) tipo = valor >= 0 ? 'receita' : 'despesa';

    txns.push({ data, descricao, valor: Math.abs(valor), tipo });
  }
  return txns;
}

// ── OFX ──

function parseOFX(conteudo) {
  const txns = [];
  const blocos = conteudo.split(/<STMTTRN>/i).slice(1);

  for (const bloco of blocos) {
    const corpo = bloco.split(/<\/STMTTRN>/i)[0];
    const tag = nome => {
      const m = corpo.match(new RegExp(`<${nome}>([^<\r\n]+)`, 'i'));
      return m ? m[1].trim() : null;
    };

    const data = parseDataFlex(tag('DTPOSTED') || '');
    const valor = parseValorBR(tag('TRNAMT') || '');
    const descricao = (tag('MEMO') || tag('NAME') || '').replace(/\s+/g, ' ');

    if (!data || valor === null || valor === 0) continue;
    txns.push({ data, descricao, valor: Math.abs(valor), tipo: valor >= 0 ? 'receita' : 'despesa' });
  }
  return txns;
}

// ── Auto-categorização por palavras-chave ──

const REGRAS = [
  { re: /combust|posto|gasolina|ipiranga|shell|petrobras/i, cat: 'Combustível' },
  { re: /restaurante|lanche|padaria|padeiro|pizza|burger|ifood|churrascaria|aliment|mercado|supermerc|acougue|emporio|bebidas/i, cat: 'Alimentação' },
  { re: /uber|99|taxi|estacionamento|pedagio|onibus|metro/i, cat: 'Transporte' },
  { re: /google|workspace|canva|hotmart|kiwify|adobe|notion|spotify|netflix|assinatura|starlink|linq|telecom|nic\.?br|dominio|hospedagem/i, cat: 'Assinaturas' },
  { re: /aluguel|condominio|coworking|office|energia|luz|agua|iptu/i, cat: 'Moradia' },
  { re: /farmacia|droga|hospital|medico|dentista|clinica|academia/i, cat: 'Saúde' },
  { re: /curso|faculdade|escola|livro|treinamento/i, cat: 'Educação' },
  { re: /imposto|tributo|receita federal|darf|das |simples nacional|inss/i, cat: 'Impostos' },
  { re: /fatura|cartao|banco csf/i, cat: 'Cartão de Crédito' },
  { re: /doacao|doacoes|associacao|guardioes|igreja|dizimo/i, cat: 'Doações' },
  { re: /cdb|aplicacao|resgate|tesouro|invest|raro assessor/i, cat: 'Investimentos' },
  { re: /roncolato|fernanda|saque/i, cat: 'Saques Pessoais' },
  { re: /cinema|show|ingresso|jogo|bar |strikerbar/i, cat: 'Lazer' }
];

const REGRAS_RECEITA = [
  { re: /semintervalo|venda|cliente|pix recebido|boleto recebido/i, cat: 'Vendas' },
  { re: /rend|cdb|resgate|aplic/i, cat: 'Rendimentos' },
  { re: /salario|folha/i, cat: 'Salário' },
  { re: /reembolso|estorno/i, cat: 'Reembolsos' }
];

function categorizar(txn, categorias) {
  const regras = txn.tipo === 'receita' ? REGRAS_RECEITA : REGRAS;
  for (const r of regras) {
    if (r.re.test(txn.descricao)) {
      const cat = categorias.find(c => c.nome === r.cat && c.tipo === txn.tipo);
      if (cat) return cat.id;
    }
  }
  const outros = categorias.find(c => c.nome === 'Outros' && c.tipo === txn.tipo);
  return outros ? outros.id : null;
}

function parse(conteudo, formato) {
  if (formato === 'ofx' || /<OFX>/i.test(conteudo)) return parseOFX(conteudo);
  return parseCSV(conteudo);
}

module.exports = { parse, categorizar };
