const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG';

const images = {
  'site': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila01.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-01.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF3937.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-003.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-11.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2009.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/matheus.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/image-10.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/depoimento.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/ronco-bio.jpg',
  ],
  'silvano': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF3937-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF4240-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF4289-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF4254-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF3926-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF3854-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF3999-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF3807-1024x683.jpg',
  ],
  'lara-brenner': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-013-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-010-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-011-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-001-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-008-576x1024.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-009-576x1024.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-014-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-015-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-002-1024x579.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-004-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-006-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/04/larabrenner-012-1024x576.jpg',
  ],
  'bonifacil': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2444-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2543-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF1782-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2622-683x1024.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2473-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2797-683x1024.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2776-683x1024.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2595-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF1922-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2292-1024x683.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF1624-1024x683.jpg',
  ],
  'keniskley': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2735-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2324-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2075-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2711-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF1892-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2417-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2831-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF2017-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/DSCF1801-1024x576.jpg',
  ],
  'augusto-cury': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/port-cury-02.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/port-cury-03.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/port-cury-04.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/port-cury-05.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/port-cury-06.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/thumb-port-augusto.png',
  ],
  'stabilize': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-5-1024x640.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-6-1-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-14-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-4-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-9-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-8-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-10-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/capa-destacada.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/02/Frame-13-1024x576.jpg',
  ],
  'ti-vasconcellos': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-13.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-6-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-12-copia-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-4-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-8-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-3-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-11-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-14-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-12-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2022/11/Prancheta-18-copia-10-1024x576.png',
  ],
  'attila': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila02-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila03-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila11-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila04-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila05-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila06-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila07-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila08-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila09-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila10-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila12-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila13-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila14-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila15-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila16-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila17-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila18-1024x576.png',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2024/02/pag-attila19-1024x576.png',
  ],
  'raro': [
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-01-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-02-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-03-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-04-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-13-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-14-1024x584.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-17-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-16-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-06-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-05-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-07-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-08-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-09-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-10-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-11-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-12-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-15-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-19-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-20-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-21-1-1024x576.jpg',
    'https://rodrigoroncolato.com.br/wp-content/uploads/2023/10/portifa-raro-22-1024x576.jpg',
  ],
};

function download(imgUrl, folder) {
  return new Promise((resolve) => {
    const filename = path.basename(imgUrl);
    const dest = path.join(folder, filename);
    if (fs.existsSync(dest)) { process.stdout.write('.'); resolve(); return; }
    const file = fs.createWriteStream(dest);
    https.get(imgUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, folder).then(resolve);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); process.stdout.write('v'); resolve(); });
    }).on('error', (e) => { try { fs.unlinkSync(dest); } catch(x){} process.stdout.write('x'); resolve(); });
  });
}

async function run() {
  let total = 0;
  for (const [project, urls] of Object.entries(images)) {
    const folder = path.join(BASE, project);
    fs.mkdirSync(folder, { recursive: true });
    console.log('\n[' + project + '] ' + urls.length + ' imagens');
    for (const u of urls) { await download(u, folder); total++; }
  }
  console.log('\n\nConcluido! Total: ' + total + ' imagens');
}

run();
