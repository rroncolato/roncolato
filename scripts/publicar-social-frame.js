#!/usr/bin/env node
// Publica o SOCIAL FRAME: sync -> (se mudou) commit+push+deploy.
// Uso: node scripts/publicar-social-frame.js [--auto]
//   --auto: modo silencioso p/ Agendador de Tarefas — sai sem deploy se nada mudou.
const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const AUTO = process.argv.includes('--auto');

console.log(`🚀 Publicando SOCIAL FRAME${AUTO ? ' [auto]' : ''} — ${new Date().toISOString()}\n`);

try {
  // 1. Sync (lê metadados do Drive local, atualiza catalogo.json)
  console.log('1️⃣  Sincronizando metadados...');
  execSync('node "scripts/sync-social-frame.js"', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✓ Sync completo\n');

  // 2. Git: só commita/publica se o catálogo mudou
  execSync('git add SOCIAL-FRAME/catalogo.json', { cwd: projectRoot });
  const status = execSync('git status --porcelain SOCIAL-FRAME/catalogo.json', { cwd: projectRoot }).toString();

  if (!status.includes('SOCIAL-FRAME/catalogo.json')) {
    console.log('✓ Nenhuma mudança no catálogo. Nada a publicar.');
    // Modo auto: encerra sem deploy (evita deploys inúteis de hora em hora).
    // Modo manual: idem — sem mudança de metadados não há o que subir.
    process.exit(0);
  }

  console.log('2️⃣  Mudança detectada — enviando pro GitHub...');
  execSync('git commit -m "sync: atualizar catalogo SOCIAL FRAME"', { cwd: projectRoot });
  execSync('git push origin master:main', { cwd: projectRoot });
  console.log('✓ Push completo\n');

  // 3. Vercel deploy
  console.log('3️⃣  Deploy em produção...');
  execSync('npx vercel deploy --prod --yes', { cwd: projectRoot, stdio: 'inherit' });
  console.log('\n✅ Publicado! SOCIAL FRAME atualizado em produção.\n');
} catch (error) {
  console.error(`\n❌ Erro: ${error.message}\n`);
  process.exit(1);
}
