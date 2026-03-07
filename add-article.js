const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

const HTML_PATH = 'c:/Users/rodri/Downloads/SITE RONCOLATO/rodrigo-roncolato-v3_8.html';
const IMG_BASE  = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG';

const TAGS = ['Personal Branding', 'Fotografia Executiva', 'Bastidores', 'Equipamento', 'Mercado'];
const DELAY_CLASSES = ['', 'd1', 'd2', 'd3', 'd4'];

function formatDate(d) {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [y, m, day] = d.split('-');
  return day + ' ' + months[parseInt(m)-1] + ' ' + y;
}

async function main() {
  console.log('\n========================================');
  console.log('     ADICIONAR NOVO ARTIGO AO BLOG');
  console.log('========================================\n');

  const title    = await ask('Título do artigo: ');
  const excerpt  = await ask('Resumo (1-2 linhas para o card): ');

  console.log('\nCategorias:');
  TAGS.forEach((t, i) => console.log('  ' + (i+1) + '. ' + t));
  const tagIdx = parseInt(await ask('Categoria (número): ')) - 1;
  const tag    = TAGS[tagIdx] || TAGS[0];

  const dateRaw  = await ask('Data (YYYY-MM-DD, ex: 2025-03-07): ');
  const date     = formatDate(dateRaw);
  const readTime = await ask('Tempo de leitura (ex: 5 min): ');

  console.log('\n--- CONTEÚDO DO ARTIGO ---');
  console.log('Digite parágrafos, um por linha. Deixe linha vazia para terminar.');
  console.log('Use ##Título para subtítulos, ""citação"" para blockquote.\n');

  const lines = [];
  while (true) {
    const line = await ask('> ');
    if (line === '') break;
    lines.push(line);
  }

  // Build body HTML
  const bodyHtml = lines.map(line => {
    if (line.startsWith('##')) return '<h2>' + line.slice(2).trim() + '</h2>';
    if (line.startsWith('""') && line.endsWith('""')) return '<blockquote>' + line.slice(2, -2).trim() + '</blockquote>';
    return '<p>' + line + '</p>';
  }).join('\n');

  // Optional image
  const imgInput = await ask('\nImagem do artigo (caminho em IMG/, ex: raro/portifa-raro-01-1024x576.jpg) — Enter para pular: ');
  const imgPath  = imgInput.trim() ? 'IMG/' + imgInput.trim() : '';

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

  // ── 1. Add to posts object ──
  const imgField = imgPath ? `,img:'${imgPath}'` : '';
  const newPost  = `  ${postId}:{tag:'${tag}',date:'${date}',title:'${title}',body:\`${bodyHtml}\`${imgField}},\n`;

  html = html.slice(0, end) + '\n' + newPost + html.slice(end);

  // ── 2. Add card to blog-list ──
  // Find end of blog-list (last </div> before </div> closing blog-list)
  const blogListStart = html.indexOf('<div class="blog-list">');
  const blogListEnd   = html.indexOf('</div>\n\n      <!-- SIDEBAR', blogListStart);

  const delayClass = DELAY_CLASSES[(nextNum - 2) % DELAY_CLASSES.length];
  const delayStr   = delayClass ? ' ' + delayClass : '';

  const imgThumb = imgPath
    ? `<div class="bpost-img" id="blog-img-${postId}"><img src="${imgPath}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>`
    : `<div class="bpost-img" id="blog-img-${postId}"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>`;

  const newCard = `          <div class="bpost rv${delayStr}" onclick="goPost('${postId}')">
            ${imgThumb}
            <div><div class="bpost-tag">${tag}</div><div class="bpost-title">${title}</div><div class="bpost-meta">${date} · ${readTime}</div></div>
          </div>\n`;

  html = html.slice(0, blogListEnd) + newCard + html.slice(blogListEnd);

  // ── 3. Update featured post (promote newest to featured) ──
  // Update the featured onclick to point to post1 (keep as is - just update blog list)

  // ── 4. Update sidebar "Posts recentes" (keep top 3) ──
  const brecentStart = html.indexOf('<div class="brecent">');
  const brecentEnd   = html.indexOf('</div>\n        </div>', brecentStart) + 6;
  const brecentBlock = html.slice(brecentStart, brecentEnd);

  const newRecentItem = `<div class="brecent-item" onclick="goPost('${postId}')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">${title.slice(0,50)}${title.length>50?'...':''}</div><div class="brecent-date">${date}</div></div></div>\n            `;

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

main().catch(e => { console.error(e); rl.close(); });
