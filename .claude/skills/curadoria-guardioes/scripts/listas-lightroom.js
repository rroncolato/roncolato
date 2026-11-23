#!/usr/bin/env node
/*
 * Junta os vereditos da curadoria e gera as listas para marcar no Lightroom.
 *
 * Entrada:
 *   <saida>/manifest.json            (gerado pelo folhas-contato.js)
 *   <saida>/vereditos/*.json         (um arquivo por lote: [{ "i": 12, "veredito": "VENDA", "motivo": "..." }, ...])
 *
 * Saída:
 *   <saida>/listas/vermelho__<pasta>__parte-01.txt   nomes para o rótulo VERMELHO (venda)
 *   <saida>/listas/amarelo__<pasta>__parte-01.txt    nomes para o rótulo AMARELO (Rodrigo revisa)
 *   <saida>/curadoria-venda.csv                       uma linha por foto
 *   <saida>/resumo.md                                 totais por dia e por momento
 *
 * Uso: node listas-lightroom.js <pasta-saida> [--por-parte=150] [--separador=virgula]
 */
const fs = require('fs');
const path = require('path');

const VEREDITOS = ['VENDA', 'REVISAR', 'FORA'];

function args() {
  const pos = [];
  const opt = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) opt[m[1]] = m[2];
    else pos.push(a);
  }
  return { pos, opt };
}

function seguro(s) {
  return s === '.' ? 'raiz' : s.replace(/[\\/:*?"<>|\s]+/g, '_');
}

function main() {
  const { pos, opt } = args();
  if (!pos[0]) {
    console.error('Uso: node listas-lightroom.js <pasta-saida> [--por-parte=150]');
    process.exit(1);
  }
  const saida = path.resolve(pos[0]);
  const porParte = Number(opt['por-parte'] || 150);
  // Separador entre os nomes na lista. Padrão: espaço. "--separador=virgula" usa ", ".
  const sep = opt.separador === 'virgula' ? ', ' : opt.separador || ' ';
  const man = JSON.parse(fs.readFileSync(path.join(saida, 'manifest.json'), 'utf8'));
  const fotos = man.fotos;

  const dirV = path.join(saida, 'vereditos');
  const vered = new Map();
  const problemas = [];
  for (const arq of fs.existsSync(dirV) ? fs.readdirSync(dirV).filter((f) => f.endsWith('.json')).sort() : []) {
    let lista;
    try {
      lista = JSON.parse(fs.readFileSync(path.join(dirV, arq), 'utf8'));
    } catch (e) {
      problemas.push(`${arq}: JSON inválido (${e.message})`);
      continue;
    }
    for (const v of lista) {
      const ver = String(v.veredito || '').toUpperCase();
      if (!VEREDITOS.includes(ver)) {
        problemas.push(`${arq}: foto #${v.i} com veredito inválido "${v.veredito}"`);
        continue;
      }
      vered.set(Number(v.i), { veredito: ver, motivo: v.motivo || '' });
    }
  }

  const faltando = fotos.filter((f) => !vered.has(f.i)).map((f) => f.i);
  if (faltando.length) problemas.push(`${faltando.length} fotos sem veredito: #${faltando.slice(0, 30).join(', #')}${faltando.length > 30 ? '…' : ''}`);

  // Travas: nada de momento SEGREDO? ou de horário de banho/repouso vai direto para o vermelho.
  // Esses casos caem no amarelo e o Rodrigo decide. Para liberar um momento, ele muda o
  // cronograma.local.md (SEGREDO? -> LIVRE?) e o folhas-contato.js é rodado de novo.
  const TRAVAS = { 'SEGREDO?': 'momento SEGREDO?', NAO_PUBLICAR: 'horário de banho/repouso' };
  let travadas = 0;
  for (const f of fotos) {
    const v = vered.get(f.i);
    if (v && v.veredito === 'VENDA' && TRAVAS[f.segredo]) {
      v.veredito = 'REVISAR';
      v.motivo = `[trava: ${TRAVAS[f.segredo]}] ${v.motivo}`;
      travadas++;
    }
  }

  const dirL = path.join(saida, 'listas');
  fs.mkdirSync(dirL, { recursive: true });
  for (const f of fs.readdirSync(dirL)) if (f.endsWith('.txt')) fs.renameSync(path.join(dirL, f), path.join(dirL, f + '.anterior'));

  const grupos = {};
  for (const f of fotos) {
    const v = vered.get(f.i);
    if (!v || v.veredito === 'FORA') continue;
    const cor = v.veredito === 'VENDA' ? 'vermelho' : 'amarelo';
    const chave = `${cor}__${seguro(f.pasta)}`;
    (grupos[chave] = grupos[chave] || []).push(f.nome);
  }
  const arquivosListas = [];
  for (const [chave, nomes] of Object.entries(grupos)) {
    const unicos = [...new Set(nomes)];
    const partes = Math.ceil(unicos.length / porParte);
    for (let p = 0; p < partes; p++) {
      const nome = `${chave}__parte-${String(p + 1).padStart(2, '0')}.txt`;
      fs.writeFileSync(path.join(dirL, nome), unicos.slice(p * porParte, (p + 1) * porParte).join(sep) + '\n');
      const n = Math.min(porParte, unicos.length - p * porParte);
      arquivosListas.push(`${nome} (${n} ${n === 1 ? 'foto' : 'fotos'})`);
    }
  }

  const csv = ['i;arquivo;pasta;dataHora;dia;momento;segredo;veredito;motivo'];
  for (const f of fotos) {
    const v = vered.get(f.i) || { veredito: '', motivo: '' };
    csv.push([f.i, f.arquivo, f.pasta, f.dataHora || '', f.dia || '', f.momento, f.segredo, v.veredito, v.motivo].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(';'));
  }
  fs.writeFileSync(path.join(saida, 'curadoria-venda.csv'), '﻿' + csv.join('\n'));

  const cont = (filtro) => {
    const c = { VENDA: 0, REVISAR: 0, FORA: 0 };
    for (const f of fotos.filter(filtro)) {
      const v = vered.get(f.i);
      if (v) c[v.veredito]++;
    }
    return c;
  };
  const total = cont(() => true);
  const linhas = [
    '# Curadoria para venda (Fotto) — resumo',
    '',
    `Total: **${fotos.length}** fotos · 🔴 Venda **${total.VENDA}** · 🟡 Revisar **${total.REVISAR}** · Fora **${total.FORA}**`,
    '',
    travadas ? `${travadas} fotos escolhidas para venda foram para o amarelo pela trava de segredo ou de banho/repouso.` : '',
    '',
    '## Por dia',
    '',
    '| Dia | Venda | Revisar | Fora |',
    '|---|---|---|---|',
  ];
  const dias = [...new Set(fotos.map((f) => f.dia))].sort((a, b) => (a || 99) - (b || 99));
  for (const d of dias) {
    const c = cont((f) => f.dia === d);
    linhas.push(`| ${d ? `Dia ${d}` : 'sem dia'} | ${c.VENDA} | ${c.REVISAR} | ${c.FORA} |`);
  }
  linhas.push('', '## Por momento', '', '| Momento | Segredo | Venda | Revisar | Fora |', '|---|---|---|---|---|');
  const momentos = [];
  for (const f of fotos) {
    const k = `${f.dia}|${f.momento}`;
    if (!momentos.find((m) => m.k === k)) momentos.push({ k, dia: f.dia, momento: f.momento, segredo: f.segredo });
  }
  for (const m of momentos) {
    const c = cont((f) => `${f.dia}|${f.momento}` === m.k);
    linhas.push(`| D${m.dia || '?'} ${m.momento} | ${m.segredo} | ${c.VENDA} | ${c.REVISAR} | ${c.FORA} |`);
  }
  linhas.push('', '## Listas geradas', '', ...arquivosListas.map((a) => `- ${a}`));
  if (problemas.length) linhas.push('', '## ⚠ Problemas', '', ...problemas.map((p) => `- ${p}`));
  fs.writeFileSync(path.join(saida, 'resumo.md'), linhas.join('\n') + '\n');

  console.log(`🔴 Venda: ${total.VENDA} · 🟡 Revisar: ${total.REVISAR} · Fora: ${total.FORA}`);
  console.log('Listas:', arquivosListas.length ? '\n  ' + arquivosListas.join('\n  ') : 'nenhuma');
  if (problemas.length) {
    console.log('\n⚠ Problemas:\n  ' + problemas.join('\n  '));
    process.exitCode = 2;
  }
}

main();
