#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const catalogoPath = path.join(projectRoot, 'SOCIAL-FRAME', 'catalogo.json');

console.log('🚀 Publicando SOCIAL FRAME...\n');

try {
  // 1. Sync (lê metadados do Drive local, atualiza catalogo.json)
  console.log('1️⃣  Sincronizando metadados...');
  execSync(`node "scripts/sync-social-frame.js"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✓ Sync completo\n');

  // 2. Git: add + commit + push
  console.log('2️⃣  Enviando pro GitHub...');
  execSync('git add SOCIAL-FRAME/catalogo.json', { cwd: projectRoot });

  // Verifica se tem mudanças
  const status = execSync('git status --porcelain', { cwd: projectRoot }).toString();
  if (!status.includes('SOCIAL-FRAME/catalogo.json')) {
    console.log('✓ Nenhuma mudança no catalogo (já estava sincronizado)\n');
  } else {
    execSync('git commit -m "sync: atualizar catalogo SOCIAL FRAME"', { cwd: projectRoot });
    execSync('git push origin master:main', { cwd: projectRoot });
    console.log('✓ Push completo\n');
  }

  // 3. Vercel deploy
  console.log('3️⃣  Deploy em produção...');
  execSync('npx vercel deploy --prod --yes', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('\n✅ Publicado! SOCIAL FRAME atualizado em produção.\n');
} catch (error) {
  console.error(`\n❌ Erro: ${error.message}\n`);
  process.exit(1);
}
