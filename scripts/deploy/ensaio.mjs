#!/usr/bin/env node
// Deploy da página /ensaio, feito do computador do Rodrigo.
//
// Recomendado — publica SÓ a página de ensaio (pergunta antes):
//      node scripts/deploy/ensaio.mjs publicar
//   Copia a versão que está no ar e troca apenas a página de ensaio e 2 imagens novas.
//   Nada mais do site muda, mesmo que o seu computador tenha outras alterações não publicadas.
//   Depois atualiza a página no seu computador, para o próximo deploy não trazer a antiga de volta.
//
// Passo a passo manual (publica o site inteiro a partir do seu computador):
//   1) node scripts/deploy/ensaio.mjs preparar    traz a página nova e o que ela usa
//   2) npm start  →  abrir http://localhost:3012/ensaio e conferir
//   3) git add -A public/ensaio public/assets ARCHIVE/ensaio && git commit -m "feat(ensaio): nova página"
//   4) npm run deploy                              (só com aprovação)
//   5) node scripts/deploy/ensaio.mjs verificar   confere o site no ar
//
// O "preparar" não apaga nada: a página atual é copiada para ARCHIVE/ensaio/ antes da troca,
// e imagens que já existem no seu computador não são substituídas.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
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

function preparar({ resumo = true, buscar = true } = {}) {
  process.chdir(raiz());
  console.log(`\nBranch atual: ${sh('git rev-parse --abbrev-ref HEAD')}`);
  if (sh('git status --porcelain -- public/ensaio/index.html')) {
    console.log('  (a página atual tem mudanças que não estão no git; elas ficam guardadas na cópia do ARCHIVE)');
  }

  if (buscar) {
    console.log(`\nBuscando a página nova no GitHub (${BRANCH})…`);
    let tentativa = 0;
    for (;;) {
      try { sh(`git fetch origin ${BRANCH}`); break; }
      catch (e) { if (++tentativa >= 4) { console.error('Não consegui baixar do GitHub: ' + e.message); process.exit(1); } }
    }
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

// ── publicar: copia o site que está no ar e troca SÓ a página de ensaio ──────────────
// Não usa os arquivos do seu computador para o resto do site: o que estiver no ar continua
// exatamente igual (admin, contratos, propostas, Social Frame…), mesmo que o seu computador
// tenha outras alterações ainda não publicadas. Usa o login da Vercel que você já tem no
// terminal (comando `vercel api`).
const EQUIPE = 'rroncolatos-projects';
const PROJETO = 'prj_wLHLq6Fj27mKHuafTRSWpF0sF7Be';
const DOMINIO = 'rroncolato.com.br';
const NOVOS = ['public/ensaio/index.html', 'public/assets/IMG/og/og-ensaio.jpg', 'public/assets/IMG/home/sobre-rodrigo.webp'];
// Partes que só existem no site completo: se faltarem na cópia, algo está errado e nada é publicado.
const ESSENCIAIS = ['vercel.json', 'public/index.html', 'public/ensaio/index.html',
                    'api/auth/login.js', 'api/contratos.py', 'public/admin/contratos.html'];

function vercelApi(rota, { metodo = 'GET', corpo = null } = {}) {
  let arq = '';
  if (corpo) {
    arq = join(tmpdir(), `ensaio-deploy-${process.pid}.json`);
    writeFileSync(arq, JSON.stringify(corpo));
  }
  const cmd = `vercel api "${rota}" --scope ${EQUIPE} --raw` + (corpo ? ` -X ${metodo} --input "${arq}"` : '');
  let saida = '';
  try {
    saida = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
  } catch (e) {
    saida = String(e.stdout || '') + String(e.stderr || '');
  } finally {
    if (arq) try { unlinkSync(arq); } catch {}
  }
  const ini = saida.search(/[[{]/);
  try { return JSON.parse(saida.slice(ini)); }
  catch { throw new Error(`resposta inesperada da Vercel em ${rota}:\n${saida.slice(0, 800)}`); }
}

// Transforma a árvore de arquivos da Vercel numa lista "caminho → sha".
// A árvore vem como pastas aninhadas; a parte "src" é o que foi enviado no deploy.
function listaDaArvore(arvore) {
  const lista = [];
  const visitar = (nos, pasta) => {
    for (const n of nos || []) {
      const caminho = n.path || (pasta ? `${pasta}/${n.name}` : n.name);
      if (n.type === 'directory' || Array.isArray(n.children)) visitar(n.children, caminho);
      else if (n.uid) lista.push({ caminho, sha: n.uid, tipo: n.type || 'file' });
    }
  };
  visitar(Array.isArray(arvore) ? arvore : arvore.files || arvore.children || [], '');
  return lista.filter((f) => f.caminho.startsWith('src/'))
              .map((f) => ({ ...f, caminho: f.caminho.slice(4) }));
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function publicar() {
  process.chdir(raiz());

  let ajuda = '';
  try { ajuda = execSync('vercel api --help', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { ajuda = String(e.stdout || '') + String(e.stderr || ''); }
  if (!/HTTP requests/i.test(ajuda)) {
    console.log('\nSeu Vercel CLI é antigo (falta o comando "vercel api"). Atualize e rode de novo:\n  npm i -g vercel@latest');
    process.exit(1);
  }

  console.log(`\nBuscando a página nova no GitHub (${BRANCH})…`);
  for (let t = 1; ; t++) {
    try { sh(`git fetch origin ${BRANCH}`); break; }
    catch (e) { if (t >= 4) { console.error('Não consegui baixar do GitHub: ' + e.message); process.exit(1); } }
  }
  const novos = NOVOS.map((c) => ({
    file: c,
    data: execSync(`git show "origin/${BRANCH}:${c}"`, { maxBuffer: 64 * 1024 * 1024 }).toString('base64'),
    encoding: 'base64',
  }));
  ok('Página nova e imagens baixadas');

  console.log('\nCopiando a versão que está no ar…');
  let noAr, arquivos;
  try {
    noAr = vercelApi(`/v13/deployments/${DOMINIO}`);
    if (!noAr.id) throw new Error(JSON.stringify(noAr).slice(0, 400));
    arquivos = listaDaArvore(vercelApi(`/v6/deployments/${noAr.id}/files`));
  } catch (e) { console.error('Não consegui ler o site no ar: ' + e.message); process.exit(1); }

  const faltando = ESSENCIAIS.filter((c) => !arquivos.some((f) => f.caminho === c));
  if (arquivos.length < 300 || faltando.length) {
    console.log(`  ✗ A cópia veio incompleta (${arquivos.length} arquivos${faltando.length ? '; faltando: ' + faltando.join(', ') : ''}).`);
    console.log('Nada foi publicado. Me mande esta mensagem.');
    process.exit(1);
  }
  const outros = arquivos.filter((f) => !NOVOS.includes(f.caminho));
  ok(`${outros.length} arquivos do site no ar (versão ${noAr.id}) ficam iguais`);
  ok(`Só muda: ${NOVOS.join(', ')}`);

  const resp = await perguntar(`\nPublicar a página nova em ${DOMINIO}/ensaio agora? (s/n) `);
  if (!/^s/i.test(resp.trim())) { console.log('Cancelado. Nada foi publicado.'); return; }

  const corpo = {
    name: 'roncolato',
    project: noAr.projectId || PROJETO,
    target: 'production',
    meta: { origem: 'kit-ensaio', baseadoEm: noAr.id },
    files: [...outros.map((f) => ({ file: f.caminho, sha: f.sha })), ...novos],
  };
  let novo;
  try {
    novo = vercelApi('/v13/deployments?skipAutoDetectionConfirmation=1', { metodo: 'POST', corpo });
    if (!novo.id) throw new Error(JSON.stringify(novo.error || novo).slice(0, 600));
  } catch (e) { console.error('\nA Vercel recusou o deploy. O site no ar não mudou.\n' + e.message); process.exit(1); }

  process.stdout.write(`\nPublicando (${novo.id})`);
  let estado = novo.readyState;
  for (let i = 0; i < 120 && !['READY', 'ERROR', 'CANCELED'].includes(estado); i++) {
    await esperar(5000); process.stdout.write('.');
    try { estado = vercelApi(`/v13/deployments/${novo.id}`).readyState; } catch {}
  }
  console.log(` ${estado}`);
  if (estado !== 'READY') {
    console.log(`\nO deploy não terminou (${estado}). O site no ar continua como estava.`);
    console.log(`Detalhes: https://vercel.com/${EQUIPE}/roncolato/${novo.id.replace(/^dpl_/, '')}`);
    process.exit(1);
  }
  for (let i = 0; i < 12; i++) {                       // espera o domínio apontar para a versão nova
    try { if (vercelApi(`/v13/deployments/${DOMINIO}`).id === novo.id) break; } catch {}
    await esperar(5000);
  }

  const certo = await verificar({ sair: false });

  console.log('\nAtualizando o seu computador (para o próximo deploy não trazer a página antiga de volta)…');
  try {
    preparar({ resumo: false, buscar: false });
    const caminhos = ['public/ensaio', ...NOVOS.slice(1), 'scripts/deploy', 'ARCHIVE/ensaio'].map((c) => `"${c}"`).join(' ');
    sh(`git add -A -- ${caminhos}`);
    try { sh(`git commit -m "feat(ensaio): nova página de ensaio" -- ${caminhos}`); ok('Salvo no git'); }
    catch { ok('Nada novo para salvar no git'); }
  } catch (e) {
    console.log('  ✗ Não consegui atualizar os arquivos do seu computador: ' + e.message);
    console.log('    Rode depois: node scripts/deploy/ensaio.mjs preparar');
  }

  if (!certo) {
    console.log(`\nPara voltar a versão anterior: vercel rollback ${noAr.id} --scope ${EQUIPE}`);
    console.log('(ou no painel da Vercel: Deployments → versão anterior → Promote)');
    process.exit(1);
  }
}

async function perguntar(pergunta) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const r = await rl.question(pergunta);
  rl.close();
  return r;
}

async function verificar({ sair = true } = {}) {
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
  if (sair) process.exit(erros ? 1 : 0);
  return !erros;
}

const acao = process.argv[2];
if (acao === 'publicar') publicar();
else if (acao === 'preparar') preparar();
else if (acao === 'verificar') verificar();
else console.log('Uso: node scripts/deploy/ensaio.mjs publicar | preparar | verificar');
