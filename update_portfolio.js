const fs = require('fs');
const path = require('path');

const htmlPath = 'c:/Users/rodri/Downloads/SITE RONCOLATO/rodrigo-roncolato-v3_8.html';
const imgBase = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG';

// Map case key -> folder name
const folderMap = {
  raro:      'raro',
  cury:      'augusto-cury',
  attila:    'attila',
  silvano:   'silvano',
  lara:      'lara-brenner',
  bonifacil: 'bonifacil',
  stabilize: 'stabilize',
  tiago:     'keniskley',
};

// Cover image overrides (first file is used by default if not specified)
const coverOverride = {
  cury:      'thumb-port-augusto.png',
  stabilize: 'capa-destacada.jpg',
  lara:      'larabrenner-013-1024x576.jpg',
};

// Get sorted image files from folder
function getImgs(folder) {
  const dir = path.join(imgBase, folder);
  return fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
}

let html = fs.readFileSync(htmlPath, 'utf8');

// SVG placeholder for pph
const svgPh = '<svg width="40" height="40" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg>';

for (const [caseKey, folder] of Object.entries(folderMap)) {
  const files = getImgs(folder);
  if (!files.length) { console.log('SKIP ' + caseKey + ' - no files'); continue; }

  // Determine cover file
  const coverFile = coverOverride[caseKey] || files[0];
  const coverPath = 'IMG/' + folder + '/' + coverFile;

  // Build imgs array (all files)
  const imgsArr = files.map(f => 'IMG/' + folder + '/' + f);

  console.log(caseKey + ': cover=' + coverFile + ', imgs=' + files.length);

  // --- 1. Update case data: add/replace imgs field ---
  // Find the case entry end (before next case or end of object)
  const caseStart = html.indexOf(caseKey + ':{');
  const nextComma = html.indexOf('},', caseStart);
  const caseContent = html.slice(caseStart, nextComma + 1);

  let newCaseContent;
  if (caseContent.includes("imgs:'") || caseContent.includes('imgs:[')) {
    // Replace existing imgs
    newCaseContent = caseContent.replace(/,imgs:\[.*?\]/s, ',imgs:' + JSON.stringify(imgsArr));
  } else {
    // Add imgs before closing }
    newCaseContent = caseContent.slice(0, -1) + ',imgs:' + JSON.stringify(imgsArr) + '}';
  }

  html = html.slice(0, caseStart) + newCaseContent + html.slice(caseStart + caseContent.length);

  // --- 2. Update pitem cover photo ---
  const onclickStr = "openModal('" + caseKey + "')";
  const pitemIdx = html.indexOf(onclickStr);
  if (pitemIdx === -1) { console.log('  pitem not found for ' + caseKey); continue; }

  const pphStart = html.indexOf('<div class="pph"', pitemIdx);
  const pphEnd = html.indexOf('</div>', pphStart) + 6;
  const pphContent = html.slice(pphStart, pphEnd);

  const newPph = '<div class="pph" style="padding:0;overflow:hidden;"><img src="' + coverPath + '" alt="' + caseKey + '" style="width:100%;height:100%;object-fit:cover;display:block;"></div>';

  // Only replace if it still has SVG placeholder
  if (pphContent.includes('<svg') || (caseKey === 'raro' && pphContent.includes('<img'))) {
    html = html.slice(0, pphStart) + newPph + html.slice(pphEnd);
    console.log('  cover updated');
  } else {
    console.log('  cover already set');
  }
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('\nConcluido!');
