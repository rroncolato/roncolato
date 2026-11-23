#!/usr/bin/env node
/*
 * Folhas de contato numeradas para a curadoria dos acampamentos dos Guardiões.
 *
 * Lê as PRÉVIAS exportadas do Lightroom (nunca os originais), ordena por horário,
 * cruza cada foto com o cronograma local e gera:
 *   <saida>/folhas/folha-001.jpg ...  (12 fotos por folha, com número, arquivo, dia/hora,
 *                                      momento do cronograma e sinal de segredo)
 *   <saida>/manifest.json             (uma linha por foto: número, arquivo, pasta, horário,
 *                                      dia, momento, luz, segredo, folha)
 *
 * Uso:
 *   node folhas-contato.js <pasta-previas> <pasta-saida> [--offset-min=N] [--cronograma=arquivo]
 *
 *   --offset-min   corrige o relógio da câmera, em minutos (ex.: -7 se a câmera estava 7 min adiantada)
 *   --cronograma   caminho do cronograma local (padrão: ../cronograma.local.md, ao lado do SKILL.md)
 *
 * Não altera, move nem apaga nada na pasta de prévias.
 */
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('O pacote "sharp" não foi encontrado. Rode "npm install" na raiz do repositório.');
  process.exit(1);
}

const COLS = 4;
const ROWS = 3;
const POR_FOLHA = COLS * ROWS;
const TILE_W = 480;
const TILE_H = 270;
const CAP_H = 44;
const GAP = 6;
const SHEET_W = COLS * TILE_W + (COLS + 1) * GAP;
const SHEET_H = ROWS * (TILE_H + CAP_H) + (ROWS + 1) * GAP;

// Ordem de restrição: quanto maior, mais restritivo.
const PESO_SEGREDO = { 'LIVRE': 0, 'LIVRE?': 1, 'DECIDIR': 2, 'SEGREDO?': 3, 'NAO_PUBLICAR': 4 };

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

function listarJpgs(dir, base = dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listarJpgs(p, base));
    else if (/\.jpe?g$/i.test(ent.name)) out.push({ abs: p, pasta: path.relative(base, dir) || '.' });
  }
  return out;
}

// ---------- data e hora da foto ----------

function dataDoXmp(abs) {
  const fd = fs.openSync(abs, 'r');
  const buf = Buffer.alloc(256 * 1024);
  const n = fs.readSync(fd, buf, 0, buf.length, 0);
  fs.closeSync(fd);
  const txt = buf.subarray(0, n).toString('latin1');
  const m = txt.match(/(?:exif:DateTimeOriginal|photoshop:DateCreated|xmp:CreateDate)(?:="|>)(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
}

function dataDoExif(exif) {
  // exif = buffer do sharp, começa com "Exif\0\0" + cabeçalho TIFF
  if (!exif || exif.length < 14) return null;
  const t = exif.subarray(6);
  const le = t.toString('latin1', 0, 2) === 'II';
  const u16 = (o) => (le ? t.readUInt16LE(o) : t.readUInt16BE(o));
  const u32 = (o) => (le ? t.readUInt32LE(o) : t.readUInt32BE(o));
  const procurar = (ifd, tag) => {
    if (ifd + 2 > t.length) return null;
    const n = u16(ifd);
    for (let i = 0; i < n; i++) {
      const e = ifd + 2 + i * 12;
      if (e + 12 > t.length) return null;
      if (u16(e) === tag) return e;
    }
    return null;
  };
  try {
    const ifd0 = u32(4);
    const pExif = procurar(ifd0, 0x8769);
    if (pExif === null) return null;
    const exifIfd = u32(pExif + 8);
    const e = procurar(exifIfd, 0x9003);
    if (e === null) return null;
    const off = u32(e + 8);
    const s = t.toString('latin1', off, off + 19);
    const m = s.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  } catch {
    return null;
  }
}

// ---------- cronograma ----------

function normalizarSegredo(s) {
  s = (s || '').trim();
  if (s === '—' || s === '-') return 'NAO_PUBLICAR';
  if (PESO_SEGREDO[s] !== undefined) return s;
  return 'DECIDIR';
}

function lerCronograma(arquivo) {
  if (!arquivo || !fs.existsSync(arquivo)) return null;
  const linhas = fs.readFileSync(arquivo, 'utf8').split(/\r?\n/);
  const anoM = linhas.join('\n').match(/\/(\d{4})\b/);
  const ano = anoM ? +anoM[1] : new Date().getFullYear();
  const dias = [];
  let atual = null;
  for (const l of linhas) {
    const d = l.match(/^## Dia (\d+)\s*·\s*\S+\s+(\d{2})\/(\d{2})/);
    if (d) {
      atual = { dia: +d[1], data: new Date(ano, +d[3] - 1, +d[2]), itens: [] };
      dias.push(atual);
      continue;
    }
    const r = l.match(/^\|\s*(\d{2}):(\d{2})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/);
    if (r && atual) {
      let min = +r[1] * 60 + +r[2];
      if (min < 4 * 60) min += 24 * 60; // depois da meia-noite ainda é o mesmo dia do cronograma
      atual.itens.push({ min, hora: `${r[1]}:${r[2]}`, momento: r[3].replace(/\*\*/g, ''), luz: r[4], segredo: normalizarSegredo(r[6]) });
    }
  }
  for (const d of dias) d.itens.sort((a, b) => a.min - b.min);
  return dias.length ? dias : null;
}

function mesmoDia(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function localizar(cron, dt) {
  if (!cron || !dt) return { dia: null, momento: 'sem cronograma', luz: '', segredo: 'DECIDIR' };
  let ref = new Date(dt);
  let min = dt.getHours() * 60 + dt.getMinutes();
  if (dt.getHours() < 4) {
    // madrugada: pertence ao dia anterior do cronograma
    ref = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1);
    min += 24 * 60;
  }
  const dia = cron.find((d) => mesmoDia(d.data, ref));
  if (!dia) return { dia: null, momento: 'fora do cronograma', luz: '', segredo: 'DECIDIR' };
  const antes = dia.itens.filter((i) => i.min <= min);
  if (!antes.length) return { dia: dia.dia, momento: `antes de ${dia.itens[0].hora}`, luz: '', segredo: 'DECIDIR' };
  const ini = antes[antes.length - 1].min;
  const simultaneos = antes.filter((i) => i.min === ini);
  const segredo = simultaneos.reduce((acc, i) => (PESO_SEGREDO[i.segredo] > PESO_SEGREDO[acc] ? i.segredo : acc), 'LIVRE');
  return {
    dia: dia.dia,
    momento: simultaneos.map((i) => `${i.hora} ${i.momento}`).join(' / '),
    luz: simultaneos[0].luz,
    segredo,
  };
}

// ---------- desenho ----------

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cortar(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

const COR_SEGREDO = { 'SEGREDO?': '#c0392b', 'NAO_PUBLICAR': '#555555', 'DECIDIR': '#d68910', 'LIVRE?': '#1e8449', 'LIVRE': '#1e8449' };

function legendaSvg(f) {
  const hora = f.dataHora ? f.dataHora.slice(11, 16) : '--:--';
  const dia = f.dia ? `D${f.dia}` : 'D?';
  const l1 = `#${String(f.i).padStart(4, '0')}  ${cortar(f.arquivo, 26)}  ${dia} ${hora}`;
  const tag = f.segredo === 'NAO_PUBLICAR' ? 'NÃO PUBLICAR' : f.segredo;
  const l2 = cortar(f.momento.replace(/^\d{2}:\d{2} /, ''), 44);
  const tagW = tag.length * 8 + 12;
  return Buffer.from(
    `<svg width="${TILE_W}" height="${CAP_H}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="100%" height="100%" fill="#111"/>` +
      `<text x="6" y="17" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#fff">${esc(l1)}</text>` +
      `<rect x="4" y="23" width="${tagW}" height="18" rx="3" fill="${COR_SEGREDO[f.segredo] || '#555'}"/>` +
      `<text x="10" y="37" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#fff">${esc(tag)}</text>` +
      `<text x="${tagW + 10}" y="37" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#ddd">${esc(l2)}</text>` +
      `</svg>`
  );
}

async function montarFolha(fotos, destino) {
  const camadas = [];
  for (let k = 0; k < fotos.length; k++) {
    const f = fotos[k];
    const c = k % COLS;
    const r = Math.floor(k / COLS);
    const left = GAP + c * (TILE_W + GAP);
    const top = GAP + r * (TILE_H + CAP_H + GAP);
    let tile;
    try {
      tile = await sharp(f.abs).rotate().resize(TILE_W, TILE_H, { fit: 'contain', background: '#222' }).jpeg().toBuffer();
    } catch {
      tile = await sharp({ create: { width: TILE_W, height: TILE_H, channels: 3, background: '#600' } }).jpeg().toBuffer();
    }
    camadas.push({ input: tile, left, top });
    camadas.push({ input: legendaSvg(f), left, top: top + TILE_H });
  }
  await sharp({ create: { width: SHEET_W, height: SHEET_H, channels: 3, background: '#000' } })
    .composite(camadas)
    .jpeg({ quality: 80 })
    .toFile(destino);
}

function iso(dt) {
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}T${p(dt.getHours())}:${p(dt.getMinutes())}:${p(dt.getSeconds())}`;
}

async function main() {
  const { pos, opt } = args();
  if (pos.length < 2) {
    console.error('Uso: node folhas-contato.js <pasta-previas> <pasta-saida> [--offset-min=N] [--cronograma=arquivo]');
    process.exit(1);
  }
  const [previas, saida] = pos.map((p) => path.resolve(p));
  if (!fs.existsSync(previas)) {
    console.error(`Pasta de prévias não encontrada: ${previas}`);
    process.exit(1);
  }
  if (saida.startsWith(previas + path.sep)) {
    console.error('A pasta de saída não pode ficar dentro da pasta de prévias.');
    process.exit(1);
  }
  const offsetMin = Number(opt['offset-min'] || 0);
  const cronArq = opt.cronograma ? path.resolve(opt.cronograma) : path.join(__dirname, '..', 'cronograma.local.md');
  const cron = lerCronograma(cronArq);
  if (!cron) console.warn(`⚠ Cronograma não encontrado ou vazio (${cronArq}). Momentos e segredo ficam como DECIDIR.`);

  const arquivos = listarJpgs(previas);
  if (!arquivos.length) {
    console.error('Nenhum JPG encontrado na pasta de prévias.');
    process.exit(1);
  }

  const fotos = [];
  let semData = 0;
  for (const a of arquivos) {
    let dt = dataDoXmp(a.abs);
    if (!dt) {
      try {
        dt = dataDoExif((await sharp(a.abs).metadata()).exif);
      } catch {
        dt = null;
      }
    }
    if (!dt) semData++;
    if (dt && offsetMin) dt = new Date(dt.getTime() + offsetMin * 60000);
    fotos.push({ ...a, arquivo: path.basename(a.abs), dt });
  }
  fotos.sort((x, y) => (x.dt && y.dt ? x.dt - y.dt : x.dt ? -1 : y.dt ? 1 : 0) || x.arquivo.localeCompare(y.arquivo));

  fs.mkdirSync(path.join(saida, 'folhas'), { recursive: true });
  const manifest = fotos.map((f, idx) => {
    const loc = localizar(cron, f.dt);
    return {
      i: idx + 1,
      arquivo: f.arquivo,
      nome: f.arquivo.replace(/\.[^.]+$/, ''),
      pasta: f.pasta,
      previa: f.abs,
      dataHora: f.dt ? iso(f.dt) : null,
      dia: loc.dia,
      momento: loc.momento,
      luz: loc.luz,
      segredo: loc.segredo,
      folha: Math.floor(idx / POR_FOLHA) + 1,
    };
  });

  const totalFolhas = Math.ceil(manifest.length / POR_FOLHA);
  for (let s = 0; s < totalFolhas; s++) {
    const grupo = manifest.slice(s * POR_FOLHA, (s + 1) * POR_FOLHA).map((m) => ({ ...m, abs: m.previa }));
    const nome = `folha-${String(s + 1).padStart(3, '0')}.jpg`;
    await montarFolha(grupo, path.join(saida, 'folhas', nome));
    if ((s + 1) % 25 === 0 || s + 1 === totalFolhas) console.log(`  folhas: ${s + 1}/${totalFolhas}`);
  }

  fs.writeFileSync(path.join(saida, 'manifest.json'), JSON.stringify({ geradoEm: iso(new Date()), previas, offsetMin, porFolha: POR_FOLHA, fotos: manifest }, null, 1));

  const porDia = {};
  const porSegredo = {};
  for (const m of manifest) {
    porDia[m.dia ? `Dia ${m.dia}` : 'sem dia'] = (porDia[m.dia ? `Dia ${m.dia}` : 'sem dia'] || 0) + 1;
    porSegredo[m.segredo] = (porSegredo[m.segredo] || 0) + 1;
  }
  console.log(`\n✓ ${manifest.length} fotos em ${totalFolhas} folhas → ${path.join(saida, 'folhas')}`);
  console.log('  por dia:', porDia);
  console.log('  por segredo:', porSegredo);
  if (semData) console.log(`  ⚠ ${semData} fotos sem data/hora (exporte com metadados "Todos")`);
  if (offsetMin) console.log(`  relógio corrigido em ${offsetMin} min`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
