/**
 * Sincronização automática do SOCIAL FRAME.
 * Pastas novas do Drive viram clientes; stars/tags do Lightroom (XMP)
 * são lidos dos JPGs da pasta local sincronizada e salvos no catalogo.json.
 */
const fs = require('fs');
const path = require('path');
const { drive } = require('./google-drive');

const ROOT_FOLDER_ID = process.env.SOCIAL_FRAME_FOLDER_ID;
const LOCAL_PATH = process.env.SOCIAL_FRAME_LOCAL_PATH;
const CATALOGO_PATH = path.join(__dirname, '../..', 'SOCIAL-FRAME', 'catalogo.json');

const XMP_SCAN_BYTES = 256 * 1024;
const INTERVALO_AUTO_SYNC = 10 * 60 * 1000; // 10 minutos
const THROTTLE_LOGIN = 60 * 1000; // no login, só re-sincroniza se o último foi há +60s

const TAGS_OFICIAIS = ['Perfil', 'Feed', 'Stories', 'Destaque', 'Banner', 'Hero', 'Thumbnail'];

let ultimaSync = 0;
let syncEmAndamento = false;
let timerAutoSync = null;

function slugify(nome) {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleCase(nome) {
  return nome
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizarTag(tag) {
  const oficial = TAGS_OFICIAIS.find((t) => t.toLowerCase() === tag.toLowerCase().trim());
  return oficial || tag.trim();
}

function lerMetadadosXMP(filePath) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(XMP_SCAN_BYTES);
    const bytesRead = fs.readSync(fd, buffer, 0, XMP_SCAN_BYTES, 0);
    const texto = buffer.slice(0, bytesRead).toString('latin1');

    let stars = 0;
    const ratingAttr = texto.match(/xmp:Rating="(\d)"/);
    const ratingTag = texto.match(/<xmp:Rating>(\d)<\/xmp:Rating>/);
    if (ratingAttr) stars = parseInt(ratingAttr[1], 10);
    else if (ratingTag) stars = parseInt(ratingTag[1], 10);

    let tags = [];
    const subjectBlock = texto.match(/<dc:subject>[\s\S]*?<\/dc:subject>/);
    if (subjectBlock) {
      const itens = subjectBlock[0].match(/<rdf:li[^>]*>([^<]+)<\/rdf:li>/g) || [];
      tags = itens
        .map((li) => {
          const m = li.match(/<rdf:li[^>]*>([^<]+)<\/rdf:li>/);
          return m ? normalizarTag(Buffer.from(m[1], 'latin1').toString('utf8')) : null;
        })
        .filter(Boolean);
    }

    if (stars === 0 && tags.length === 0) return null;
    return { stars, tags };
  } catch (e) {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function sincronizarMetadadosLocais(catalogo, chave, nomePastaDrive) {
  if (!LOCAL_PATH || !fs.existsSync(LOCAL_PATH)) return { lidas: 0, comMetadados: 0 };

  const pastaLocal = path.join(LOCAL_PATH, nomePastaDrive);
  if (!fs.existsSync(pastaLocal)) return { lidas: 0, comMetadados: 0 };

  const jpgs = fs.readdirSync(pastaLocal).filter((f) => /\.jpe?g$/i.test(f));
  let comMetadados = 0;

  for (const jpg of jpgs) {
    const meta = lerMetadadosXMP(path.join(pastaLocal, jpg));
    if (meta) {
      catalogo[chave].fotos[jpg] = { stars: meta.stars, tags: meta.tags };
      comMetadados++;
    }
  }

  return { lidas: jpgs.length, comMetadados };
}

/**
 * Executa a sincronização completa. Retorna resumo.
 */
async function sincronizar({ log = false } = {}) {
  if (syncEmAndamento) return { skipped: true, motivo: 'sync já em andamento' };
  syncEmAndamento = true;

  try {
    const catalogo = fs.existsSync(CATALOGO_PATH)
      ? JSON.parse(fs.readFileSync(CATALOGO_PATH, 'utf8'))
      : {};

    const response = await drive.files.list({
      q: `'${ROOT_FOLDER_ID}' in parents and trashed=false and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
      pageSize: 200
    });

    const pastas = response.data.files || [];
    let novos = 0;
    const detalhes = [];

    for (const pasta of pastas) {
      const slug = slugify(pasta.name);
      const existente = Object.entries(catalogo).find(
        ([, dados]) => dados.folder_id === pasta.id
      );
      const chave = existente ? existente[0] : slug;

      if (!existente) {
        catalogo[chave] = {
          folder_id: pasta.id,
          nome_completo: titleCase(pasta.name),
          fotos: {}
        };
        novos++;
      }

      const { lidas, comMetadados } = sincronizarMetadadosLocais(catalogo, chave, pasta.name);
      detalhes.push({ cliente: chave, novo: !existente, fotosLocais: lidas, comMetadados });

      if (log) {
        console.log(`  ${existente ? '✓' : '+'} ${chave} — ${lidas} fotos locais, ${comMetadados} com metadados`);
      }
    }

    fs.writeFileSync(CATALOGO_PATH, JSON.stringify(catalogo, null, 2), 'utf8');
    ultimaSync = Date.now();

    if (log) console.log(`✅ Sync concluído${novos ? ` — ${novos} cliente(s) novo(s)` : ''}`);
    return { ok: true, pastas: pastas.length, novos, detalhes };
  } catch (err) {
    console.error('[SocialFrame Sync] Erro:', err.message);
    return { ok: false, erro: err.message };
  } finally {
    syncEmAndamento = false;
  }
}

/**
 * Sync disparado por login admin — ignora se o último foi há menos de 60s.
 * Roda em background, não bloqueia a resposta.
 */
function sincronizarNoLogin() {
  if (Date.now() - ultimaSync < THROTTLE_LOGIN) return;
  sincronizar().then((r) => {
    if (r.ok) console.log(`[SocialFrame Sync] Sync pós-login: ${r.pastas} pastas${r.novos ? `, ${r.novos} novas` : ''}`);
  });
}

/**
 * Agenda sync automático a cada 10 minutos (idempotente).
 */
function iniciarAutoSync() {
  if (timerAutoSync) return;
  timerAutoSync = setInterval(() => {
    sincronizar().then((r) => {
      if (r.ok && r.novos > 0) console.log(`[SocialFrame Sync] Auto: ${r.novos} cliente(s) novo(s)`);
    });
  }, INTERVALO_AUTO_SYNC);
  timerAutoSync.unref(); // não impede o processo de encerrar

  // Primeira rodada logo ao iniciar
  sincronizar().then((r) => {
    if (r.ok) console.log(`[SocialFrame Sync] Inicial: ${r.pastas} pastas sincronizadas`);
  });
}

module.exports = { sincronizar, sincronizarNoLogin, iniciarAutoSync };
