const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

const HTML_PATH = 'c:/Users/rodri/Downloads/SITE RONCOLATO/index.html';
const IMG_BASE  = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG';

const TAGS = ['Personal Branding', 'Fotografia Executiva', 'Bastidores', 'Equipamento', 'Mercado'];
const DELAY_CLASSES = ['', 'd1', 'd2', 'd3', 'd4'];

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '`': '&#96;'
  };
  return text.replace(/[&<>"'`]/g, m => map[m]);
}

function formatDate(d) {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [y, m, day] = d.split('-');
  return day + ' ' + months[parseInt(m)-1] + ' ' + y;
}

function validateInput(text, fieldName, maxLen = 500) {
  if (!text || typeof text !== 'string') {
    throw new Error(`${fieldName} inválido`);
  }
  if (text.length > maxLen) {
    throw new Error(`${fieldName} excede limite de ${maxLen} caracteres`);
  }
  if (/<script|javascript:|on\w+\s*=/i.test(text)) {
    throw new Error(`${fieldName} contém código malicioso`);
  }
  return text;
}

async function main() {
  console.log('\n========================================');
  console.log('     ADICIONAR NOVO ARTIGO AO BLOG');
  console.log('========================================\n');

  const title    = validateInput(await ask('Título do artigo: '), 'Título', 200);
  const excerpt  = validateInput(await ask('Resumo (1-2 linhas para o card): '), 'Resumo', 300);

  console.log('\nCategorias:');
  TAGS.forEach((t, i) => console.log('  ' + (i+1) + '. ' + t));
  const tagIdx = parseInt(await ask('Categoria (número): ')) - 1;
  const tag    = TAGS[tagIdx] || TAGS[0];

  const dateRaw  = await ask('Data (YYYY-MM-DD, ex: 2025-03-07): ');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) throw new Error('Data inválida');
  const date     = formatDate(dateRaw);
  const readTime = validateInput(await ask('Tempo de leitura (ex: 5 min): '), 'Tempo de leitura', 50);

  console.log('\n--- CONTEÚDO DO ARTIGO ---');
  console.log('Digite parágrafos, um por linha. Deixe linha vazia para terminar.');
  console.log('Use ##Título para subtítulos, ""citação"" para blockquote.\n');

  const lines = [];
  while (true) {
    const line = await ask('> ');
    if (line === '') break;
    validateInput(line, 'Linha de conteúdo', 1000);
    lines.push(line);
  }

  // Build body HTML with proper escaping
  const bodyHtml = lines.map(line => {
    const escaped = escapeHtml(line);
    if (line.startsWith('##')) return '<h2>' + escapeHtml(line.slice(2).trim()) + '</h2>';
    if (line.startsWith('""') && line.endsWith('""')) return '<blockquote>' + escapeHtml(line.slice(2, -2).trim()) + '</blockquote>';
    return '<p>' + escaped + '</p>';
  }).join('\n');

  // Optional image
  const imgInput = await ask('\nImagem do artigo (caminho em IMG/, ex: raro/portifa-raro-01-1024x576.jpg) — Enter para pular: ');
  const imgPath  = imgInput.trim() ? validateInput('/assets/IMG/' + imgInput.trim(), 'Caminho da imagem', 200) : '';

  if (imgPath && /\.\.\/|\/\/|javascript|<|>/.test(imgPath)) {
    throw new Error('Caminho de imagem inválido');
  }

  rl.close();

  // ── Load HTML ──
  let html = fs.readFileSync(HTML_PATH, 'utf8');

  // Find next post ID
  const start = html.indexOf('const posts={');
  const end   = html.indexOf('\nfunction goPost', start);
  const postsStr = html.slice(start, end);
  const existingKeys = [...postsStr.matchAll(/(post\d+):\{/g)].map(m => parseInt(m[1].replace('post','')));
  const nextNum = Math.max(...existingKeys) + 1;
  const postId  = 'post' + nextNum;

  console.log('\n✓ Novo ID: ' + postId);

  // ── 1. Add to posts object (use JSON.stringify for safe string interpolation) ──
  const imgField = imgPath ? `,img:${JSON.stringify(imgPath)}` : '';
  const newPost  = `  ${postId}:{tag:${JSON.stringify(tag)},date:${JSON.stringify(date)},title:${JSON.stringify(title)},body:${JSON.stringify(bodyHtml)}${imgField}},\n`;

  html = html.slice(0, end) + '\n' + newPost + html.slice(end);

  // ── 2. Add card to blog-list ──
  const blogListStart = html.indexOf('<div class="blog-list">');
  const blogListEnd   = html.indexOf('</div>\n\n      <!-- SIDEBAR', blogListStart);

  const delayClass = DELAY_CLASSES[(nextNum - 2) % DELAY_CLASSES.length];
  const delayStr   = delayClass ? ' ' + delayClass : '';

  const imgThumb = imgPath
    ? `<div class="bpost-img" id="blog-img-${postId}"><img src="${imgPath}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>`
    : `<div class="bpost-img" id="blog-img-${postId}"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>`;

  const newCard = `          <div class="bpost rv${delayStr}" onclick="goPost('${postId}')">
            ${imgThumb}
            <div><div class="bpost-tag">${escapeHtml(tag)}</div><div class="bpost-title">${escapeHtml(title)}</div><div class="bpost-meta">${date} · ${escapeHtml(readTime)}</div></div>
          </div>\n`;

  html = html.slice(0, blogListEnd) + newCard + html.slice(blogListEnd);

  // ── 3. Update sidebar "Posts recentes" ──
  const brecentStart = html.indexOf('<div class="brecent">');
  const brecentEnd   = html.indexOf('</div>\n        </div>', brecentStart) + 6;
  const brecentBlock = html.slice(brecentStart, brecentEnd);

  const truncatedTitle = title.length > 50 ? escapeHtml(title.slice(0, 50)) + '...' : escapeHtml(title);
  const newRecentItem = `<div class="brecent-item" onclick="goPost('${postId}')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">${truncatedTitle}</div><div class="brecent-date">${date}</div></div></div>\n            `;

  const newBrecent = brecentBlock.replace('<div class="brecent">\n            ', '<div class="brecent">\n            ' + newRecentItem);
  html = html.slice(0, brecentStart) + newBrecent + html.slice(brecentEnd);

  fs.writeFileSync(HTML_PATH, html, 'utf8');

  console.log('\n========================================');
  console.log('  ARTIGO ADICIONADO COM SUCESSO!');
  console.log('========================================');
  console.log('  ID:       ' + postId);
  console.log('  Título:   ' + title);
  console.log('  Data:     ' + date);
  console.log('  Categoria:' + tag);
  console.log('\n  Abra o browser para ver o resultado.');
}

main().catch(e => { console.error('❌ ERRO:', e.message); rl.close(); });
