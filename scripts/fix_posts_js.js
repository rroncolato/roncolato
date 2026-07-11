const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const scriptStart = html.lastIndexOf('<script>')+8;
const scriptEnd = html.lastIndexOf('</script>');
let script = html.slice(scriptStart, scriptEnd);
const lines = script.split('\r\n');

// Problema identificado:
// - linha 113 (idx 112): fecha o body do post6 com backtick e }
// - linha 114 (idx 113): }; fecha o objeto posts PREMATURAMENTE
// - linha 116 (idx 115): post7:{ fica FORA do objeto posts
// - linha 153 (idx 152): fecha o body do post7 com backtick e }
// - linha 154 (idx 153): linha vazia
// - linha 155 (idx 154): function goPost começa

// Fix:
// 1. Remover o }; prematuro (linha 114, idx 113)
// 2. Adicionar , após o fechamento do post6 (já que post7 vai dentro do objeto)
// 3. Adicionar }; após o fechamento do post7 (antes do function goPost)

console.log('Linha 112:', JSON.stringify(lines[112]));
console.log('Linha 113:', JSON.stringify(lines[113]));
console.log('Linha 114:', JSON.stringify(lines[114]));
console.log('Linha 115:', JSON.stringify(lines[115]));
console.log('---');
console.log('Linha 151:', JSON.stringify(lines[151]));
console.log('Linha 152:', JSON.stringify(lines[152]));
console.log('Linha 153:', JSON.stringify(lines[153]));
console.log('Linha 154:', JSON.stringify(lines[154]));

// Remover a linha 114 (idx 113) que é o }; prematuro
if(lines[113] === '};') {
  lines.splice(113, 1); // remove }; prematuro
  console.log('\nRemovido }; prematuro da linha 114');
} else {
  console.log('\nERRO: linha 114 nao é }; mas:', JSON.stringify(lines[113]));
  process.exit(1);
}

// Agora localizar onde post7 fecha (linha 152 original = linha 151 após splice)
// Procurar a linha após o body do post7 que fecha com backtick
// Após o splice, "function goPost" está em idx 153
const goPostIdx = lines.findIndex(l => l.trim().startsWith('function goPost'));
console.log('function goPost em linha (0-idx):', goPostIdx);

// Inserir }; antes do function goPost (e linha vazia antes disso)
lines.splice(goPostIdx, 0, '};');
lines.splice(goPostIdx, 0, '');
console.log('Inserido }; antes de function goPost');

// Reconstruir e salvar
const newScript = lines.join('\r\n');
const newHtml = html.slice(0, scriptStart) + newScript + html.slice(scriptEnd);
fs.writeFileSync('public/index.html', newHtml);

// Verificar
try {
  new Function(newScript);
  console.log('\nJS: OK - sem erros de sintaxe!');
} catch(e) {
  console.log('\nJS ainda com erro:', e.message);
  const errLines = newScript.split('\n');
  const m = e.message.match(/line (\d+)/);
  if(m){
    const ln = parseInt(m[1]);
    console.log('Linha', ln-1, ':', errLines[ln-2]);
    console.log('Linha', ln, ':', errLines[ln-1]);
  }
}
