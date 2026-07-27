#!/usr/bin/env node
/**
 * Sincroniza o objeto `posts` do public/index.html com data/blog-posts.json.
 *
 * data/blog-posts.json e a fonte da verdade. Rodar sempre que um post for
 * adicionado ou editado, para o blog do site nao dessincronizar.
 *
 *   node scripts/sync-blog-index.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'blog-posts.json');
const HTML_PATH = path.join(ROOT, 'public', 'index.html');

const MESES = { jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5, jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11 };

function parseData(str) {
  const m = String(str || '').trim().match(/^(\d{1,2})\s+([A-Za-zç]+)\s+(\d{4})$/);
  if (!m) return 0;
  const mes = MESES[m[2].slice(0, 3).toLowerCase()];
  if (mes === undefined) return 0;
  return new Date(+m[3], mes, +m[1]).getTime();
}

const posts = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
  .filter((p) => p.published !== false)
  .sort((a, b) => parseData(b.date) - parseData(a.date));

// Confere se as capas referenciadas existem em disco
const faltando = posts.filter((p) => {
  if (!p.img || !p.img.startsWith('/')) return false;
  return !fs.existsSync(path.join(ROOT, 'public', p.img.replace(/^\//, '')));
});
if (faltando.length) {
  console.warn('AVISO — capas nao encontradas em disco:');
  faltando.forEach((p) => console.warn('  ' + p.id + ' -> ' + p.img));
}

const campos = ['tag', 'date', 'title', 'excerpt', 'img', 'video'];
const corpo = posts
  .map((p) => {
    const props = campos
      .filter((k) => p[k])
      .map((k) => k + ':' + JSON.stringify(p[k]))
      .join(',');
    // body vai em template literal: escapa crase, ${ e barra invertida
    const body = String(p.body || '')
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
    return '  ' + p.id + ':{' + props + ',body:`' + body + '`}';
  })
  .join(',\n');

const bloco = 'const posts={\n' + corpo + '\n};';

const html = fs.readFileSync(HTML_PATH, 'utf8');
const inicio = html.indexOf('const posts={');
if (inicio === -1) throw new Error('bloco "const posts={" nao encontrado em public/index.html');
const marca = html.indexOf('function goPost(', inicio);
if (marca === -1) throw new Error('"function goPost(" nao encontrado depois do bloco posts');
// recua ate o "};" que fecha o objeto
const fim = html.lastIndexOf('};', marca) + 2;

const novo = html.slice(0, inicio) + bloco + html.slice(fim);
fs.writeFileSync(HTML_PATH, novo);

console.log('OK — ' + posts.length + ' posts sincronizados em public/index.html');
posts.forEach((p) => console.log('  ' + p.id + '  ' + p.date + '  ' + p.title.slice(0, 55)));
