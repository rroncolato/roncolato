#!/usr/bin/env node
// Deploy da página /ensaio, feito do computador do Rodrigo (onde está a versão completa do site).
//
// Tudo de uma vez (pergunta antes de publicar):
//      node scripts/deploy/ensaio.mjs publicar
//
// Ou passo a passo, para conferir no localhost antes:
//   1) node scripts/deploy/ensaio.mjs preparar    traz só a página nova e o que ela usa
//   2) npm start  →  abrir http://localhost:3012/ensaio e conferir
//   3) git add -A public/ensaio public/assets ARCHIVE/ensaio && git commit -m "feat(ensaio): nova página"
//   4) npm run deploy                              (só com aprovação)
//   5) node scripts/deploy/ensaio.mjs verificar   confere o site no ar
//
// O "preparar" não apaga nada: a página atual é copiada para ARCHIVE/ensaio/ antes da troca,
// e imagens que já existem no seu computador não são substituídas.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';

const BRANCH = 'claude/brave-volta-e8k19w';
const SITE = 'https://rroncolato.com.br';
const RETRATOS = ['01', '05', '07', '09', '11', '12', '13', '15', '16', '17', '18', '20', '21', '22', '24'];
const ARQUIVOS = [
  { caminho: 'public/ensaio/index.html', sempre: true },            // a página nova
  { caminho: 'public/assets/IMG/og/og-ensaio.jpg' },                // imagem de compartilhamento
  { caminho: 'public/assets/IMG/home/sobre-rodrigo.webp' },         // sua foto (dados para buscas)
  { caminho: 'public/assets/IMG/roncolato-horizontal.png' },        // logo (dados para buscas)
  { caminho: 'public/assets/IMG/site/rr-simbolo.png' },             // ícone da aba
  { caminho: 'public/ensaio/roncolato-branco-horizontal.png' },
  ...RETRATOS.map((n) => ({ caminho: `public/ensaio/retratos_${n}_1x.webp` })),
];

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ok = (t) => console.log('  ✓ ' + t);
const falha = (t) => console.log('  ✗ ' + t);

function raiz() {
  try { return sh('git rev-parse --show-toplevel'); }
  catch { console.error('Rode este comando dentro da pasta do site (repositório git).'); process.exit(1); }
}

function preparar({ resumo = true } = {}) {
  process.chdir(raiz());
  console.log(`\nBranch atual: ${sh('git rev-parse --abbrev-ref HEAD')}`);
  if (sh('git status --porcelain -- public/ensaio/index.html')) {
    console.log('  (a página atual tem mudanças que não estão no git; elas ficam guardadas na cópia do ARCHIVE)');
  }

  console.log(`\nBuscando a página nova no GitHub (${BRANCH})…`);
  let tentativa = 0;
  for (;;) {
    try { sh(`git fetch origin ${BRANCH}`); break; }
    catch (e) { if (++tentativa >= 4) { console.error('Não consegui baixar do GitHub: ' + e.message); process.exit(1); } }
  }

  const pagina = 'public/ensaio/index.html';
  if (existsSync(pagina)) {
    const d = new Date(), p2 = (n) => String(n).padStart(2, '0');
    const nome = `index-antes-${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.html`;
    mkdirSync('ARCHIVE/ensaio', { recursive: true });
    copyFileSync(pagina, join('ARCHIVE', 'ensaio', nome));
    ok(`Página atual guardada em ARCHIVE/ensaio/${nome}`);
  }

  const trazer = ARQUIVOS.filter((a) => a.sempre || !existsSync(a.caminho)).map((a) => a.caminho);
  sh(`git checkout origin/${BRANCH} -- ${trazer.map((c) => `"${c}"`).join(' ')}`);
  trazer.forEach((c) => ok(`${c}`));
  const mantidos = ARQUIVOS.length - trazer.length;
  if (mantidos) ok(`${mantidos} imagens que você já tinha foram mantidas`);

  if (resumo) console.log(`\nPronto. Próximos passos:
  1. npm start  e abra http://localhost:3012/ensaio para conferir
  2. git add -A public/ensaio public/assets ARCHIVE/ensaio
     git commit -m "feat(ensaio): nova página de ensaio"
  3. npm run deploy   (só com a sua aprovação)
  4. node scripts/deploy/ensaio.mjs verificar
`);
}

async function publicar() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const resp = await rl.question('\nIsso publica a página nova em rroncolato.com.br/ensaio. Continuar? (s/n) ');
  rl.close();
  if (!/^s/i.test(resp.trim())) { console.log('Cancelado. Nada foi alterado.'); return; }

  preparar({ resumo: false });

  const caminhos = ['public/ensaio', 'public/assets/IMG/og/og-ensaio.jpg', 'public/assets/IMG/home/sobre-rodrigo.webp',
                    'scripts/deploy', 'ARCHIVE/ensaio'].map((c) => `"${c}"`).join(' ');
  try {
    sh(`git add -A -- ${caminhos}`);
    sh(`git commit -m "feat(ensaio): nova página de ensaio" -- ${caminhos}`);
    ok('Salvo no git');
  } catch { console.log('  (nada novo para salvar no git; seguindo)'); }

  console.log('\nPublicando na Vercel (leva 1 a 2 minutos)…\n');
  try { execSync('npm run deploy', { stdio: 'inherit' }); }
  catch {
    console.error('\nO deploy não terminou. O site no ar continua como estava. Tente de novo com: npm run deploy');
    process.exit(1);
  }
  await verificar();
}

async function verificar() {
  const checar = async (rota, testes = [], esperado = 200) => {
    try {
      const r = await fetch(SITE + rota, { redirect: 'manual', headers: { 'user-agent': 'verificacao-deploy-roncolato' } });
      const corpo = testes.length ? await r.text() : '';
      const faltando = testes.filter(([, t]) => !corpo.includes(t)).map(([nome]) => nome);
      if (r.status === esperado && !faltando.length) { ok(`${rota} (${r.status})`); return true; }
      falha(`${rota} → ${r.status}${faltando.length ? ' · faltando: ' + faltando.join(', ') : ''}`); return false;
    } catch (e) { falha(`${rota} → erro de conexão (${e.message})`); return false; }
  };
  console.log(`\nConferindo ${SITE} …\n\nPágina nova:`);
  const res = [];
  res.push(await checar('/ensaio', [
    ['título novo', 'Ensaio Fotográfico Profissional em Goiânia'],
    ['preço R$ 1.500', '<small>R$</small>1.500'],
    ['duração 1 hora', '1 hora de ensaio'],
    ['perguntas frequentes', 'id="perguntas"'],
    ['dados para buscas', 'application/ld+json'],
  ]));
  res.push(await checar('/assets/IMG/og/og-ensaio.jpg'));
  res.push(await checar('/ensaio/retratos_11_1x.webp'));
  res.push(await checar('/assets/IMG/home/sobre-rodrigo.webp'));
  console.log('\nResto do site (não pode ter quebrado):');
  res.push(await checar('/'));
  res.push(await checar('/api/blog/posts'));
  res.push(await checar('/socialframe'));
  res.push(await checar('/login'));
  const erros = res.filter((x) => !x).length;
  console.log(erros ? `\n${erros} problema(s). Se for algo grave, volte a versão anterior no painel da Vercel (Deployments → versão anterior → Promote).`
                    : '\nTudo certo: a página nova está no ar e o resto do site continua funcionando.');
  process.exit(erros ? 1 : 0);
}

const acao = process.argv[2];
if (acao === 'publicar') publicar();
else if (acao === 'preparar') preparar();
else if (acao === 'verificar') verificar();
else console.log('Uso: node scripts/deploy/ensaio.mjs publicar | preparar | verificar');
