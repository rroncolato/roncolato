const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

const HTML_PATH = 'c:/Users/rodri/Downloads/SITE RONCOLATO/index.html';
const IMG_BASE  = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG';

const CATS = ['Personal Branding', 'Fotografia Executiva', 'Eventos', 'Branding'];

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
  console.log('  ADICIONAR NOVO PROJETO AO PORTFÓLIO');
  console.log('========================================\n');

  const title      = validateInput(await ask('Nome do cliente/projeto: '), 'Título', 100);
  const key        = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const year       = await ask('Ano (ex: 2025): ');

  if (!/^\d{4}$/.test(year)) {
    throw new Error('Ano deve ser um número válido (ex: 2025)');
  }

  const client     = validateInput(await ask('Cliente (pode repetir o nome): '), 'Cliente', 100);

  console.log('\nCategorias disponíveis:');
  CATS.forEach((c, i) => console.log('  ' + (i+1) + '. ' + c));
  const catIdx     = parseInt(await ask('Escolha a categoria (número): ')) - 1;
  const cat        = CATS[catIdx] || CATS[0];

  const deliverable = validateInput(await ask('Entregável (ex: Sessão fotográfica): '), 'Entregável', 100);
  const desc        = validateInput(await ask('Descrição curta do projeto: '), 'Descrição', 300);
  const link        = await ask('Link externo (pode deixar vazio): ');

  if (link && !/^https?:\/\/.+/.test(link.trim())) {
    throw new Error('Link deve começar com http:// ou https://');
  }

  const folderName  = await ask('\nNome da pasta em IMG/ (ex: nome-cliente): ');

  if (!/^[a-zA-Z0-9\-_]+$/.test(folderName)) {
    throw new Error('Nome da pasta contém caracteres inválidos');
  }

  const imgFolder   = path.join(IMG_BASE, folderName);

  if (!fs.existsSync(imgFolder)) {
    console.log('\n⚠  Pasta IMG/' + folderName + ' não encontrada.');
    console.log('   Crie a pasta e coloque as fotos antes de continuar.');
    rl.close();
    return;
  }

  const files = fs.readdirSync(imgFolder).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort();

  if (!files.length) {
    console.log('\n⚠  Nenhuma imagem encontrada em IMG/' + folderName);
    rl.close();
    return;
  }

  console.log('\n✓ ' + files.length + ' imagens encontradas em IMG/' + folderName);

  console.log('\nQual imagem usar como CAPA do card?');
  files.forEach((f, i) => console.log('  ' + (i+1) + '. ' + f));
  const coverIdx  = parseInt(await ask('Escolha (número, Enter = primeira): ') || '1') - 1;
  const coverFile = files[Math.max(0, coverIdx)];

  rl.close();

  // Build imgs array
  const imgs = files.map(f => '/assets/IMG/' + folderName + '/' + f);
  const cover = '/assets/IMG/' + folderName + '/' + coverFile;

  // Map cat to data-cat
  const dataCatMap = {
    'Personal Branding': 'branding',
    'Fotografia Executiva': 'executiva',
    'Eventos': 'eventos',
    'Branding': 'branding',
  };
  const dataCat = dataCatMap[cat] || 'branding';

  // ── Update HTML ──
  let html = fs.readFileSync(HTML_PATH, 'utf8');

  // 1. Add case entry with JSON.stringify for safe interpolation
  const newCase = `  ${key}:{tag:${JSON.stringify(cat)},title:${JSON.stringify(title)},year:${JSON.stringify(year)},client:${JSON.stringify(client)},cat:${JSON.stringify(cat)},deliverable:${JSON.stringify(deliverable)},desc:${JSON.stringify(desc)},link:${JSON.stringify(link || '#')},imgs:${JSON.stringify(imgs)}},\n`;

  const casesEnd = html.indexOf('\nfunction openModal');
  html = html.slice(0, casesEnd) + '\n' + newCase + html.slice(casesEnd);

  // 2. Add pitem card (with proper escaping)
  const newCard = `
      <div class="pitem rv" data-cat="${dataCat}" onclick="openModal('${key}')">
        <div class="pph" style="padding:0;overflow:hidden;">
          <img src="${cover}" alt="${escapeHtml(title)}" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div class="pov">
          <div>
            <div class="ptitle">${escapeHtml(title)}</div>
            <div class="pcat">${escapeHtml(cat)}</div>
          </div>
        </div>
      </div>`;

  // Insert before last pitem closing or before pgrid close
  const pgridEnd = html.lastIndexOf('</div>', html.indexOf('<!-- FIM PORTFOLIO', html.indexOf('pgrid')));
  const insertPoint = html.lastIndexOf('</div>', html.indexOf('<!-- FIM') > -1 ? html.indexOf('<!-- FIM') : html.indexOf('</div>', html.lastIndexOf('onclick="openModal(')));

  // Find the last pitem and insert after it
  const lastPitem = html.lastIndexOf('</div>\n      </div>');
  if (lastPitem > -1) {
    html = html.slice(0, lastPitem + 19) + newCard + html.slice(lastPitem + 19);
  } else {
    console.log('⚠  Não foi possível inserir o card automaticamente. Adicione manualmente.');
  }

  fs.writeFileSync(HTML_PATH, html, 'utf8');

  console.log('\n========================================');
  console.log('  PROJETO ADICIONADO COM SUCESSO!');
  console.log('========================================');
  console.log('  Chave:   ' + key);
  console.log('  Capa:    ' + coverFile);
  console.log('  Imagens: ' + files.length);
  console.log('\n  Abra o browser para ver o resultado.');
}

main().catch(e => { console.error('❌ ERRO:', e.message); rl.close(); });
