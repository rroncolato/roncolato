const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

const HTML_PATH = 'c:/Users/rodri/Downloads/SITE RONCOLATO/rodrigo-roncolato-v3_8.html';
const IMG_BASE  = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG';

const CATS = ['Personal Branding', 'Fotografia Executiva', 'Eventos', 'Branding'];

async function main() {
  console.log('\n========================================');
  console.log('  ADICIONAR NOVO PROJETO AO PORTFÓLIO');
  console.log('========================================\n');

  const title      = await ask('Nome do cliente/projeto: ');
  const key        = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const year       = await ask('Ano (ex: 2025): ');
  const client     = await ask('Cliente (pode repetir o nome): ');

  console.log('\nCategorias disponíveis:');
  CATS.forEach((c, i) => console.log('  ' + (i+1) + '. ' + c));
  const catIdx     = parseInt(await ask('Escolha a categoria (número): ')) - 1;
  const cat        = CATS[catIdx] || CATS[0];

  const deliverable = await ask('Entregável (ex: Sessão fotográfica): ');
  const desc        = await ask('Descrição curta do projeto: ');
  const link        = await ask('Link externo (pode deixar vazio): ');

  const folderName  = await ask('\nNome da pasta em IMG/ (ex: nome-cliente): ');
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
  const imgs = files.map(f => 'IMG/' + folderName + '/' + f);
  const cover = 'IMG/' + folderName + '/' + coverFile;

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

  // 1. Add case entry
  const newCase = `  ${key}:{tag:'${cat}',title:'${title}',year:'${year}',client:'${client}',cat:'${cat}',deliverable:'${deliverable}',desc:'${desc}',link:'${link || '#'}',imgs:${JSON.stringify(imgs)}},\n`;

  const casesEnd = html.indexOf('\nfunction openModal');
  html = html.slice(0, casesEnd) + '\n' + newCase + html.slice(casesEnd);

  // 2. Add pitem card (before closing pgrid)
  const newCard = `
      <div class="pitem rv" data-cat="${dataCat}" onclick="openModal('${key}')">
        <div class="pph" style="padding:0;overflow:hidden;">
          <img src="${cover}" alt="${title}" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <div class="pov">
          <div>
            <div class="ptitle">${title}</div>
            <div class="pcat">${cat}</div>
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

main().catch(e => { console.error(e); rl.close(); });
