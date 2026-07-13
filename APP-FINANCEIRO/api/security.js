/**
 * Primitivas de segurança — só usa crypto nativo do Node (sem libs externas).
 * scrypt (hash de senha), AES-256-GCM (cripto em repouso), tokens aleatórios,
 * comparação timing-safe e HMAC.
 */
const crypto = require('crypto');

// ── Hash de senha (scrypt) ──
// Formato armazenado: scrypt$N$r$p$saltB64$hashB64
const SCRYPT = { N: 1 << 15, r: 8, p: 1, keylen: 64 };

function hashSenha(senha) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(senha, salt, SCRYPT.keylen, {
    N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem: 256 * 1024 * 1024
  });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function verificarSenha(senha, armazenado) {
  try {
    const [alg, N, r, p, saltB64, hashB64] = String(armazenado).split('$');
    if (alg !== 'scrypt') return false;
    const salt = Buffer.from(saltB64, 'base64');
    const esperado = Buffer.from(hashB64, 'base64');
    const calc = crypto.scryptSync(senha, salt, esperado.length, {
      N: Number(N), r: Number(r), p: Number(p), maxmem: 256 * 1024 * 1024
    });
    // timing-safe: só compara se mesmo tamanho
    return calc.length === esperado.length && crypto.timingSafeEqual(calc, esperado);
  } catch {
    return false;
  }
}

// ── Tokens aleatórios (sessão, CSRF) ──
function tokenAleatorio(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

// ── Comparação timing-safe de strings ──
function comparaSeguro(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// ── HMAC (assinatura de dados, ex: audit) ──
function hmac(dados, chave) {
  return crypto.createHmac('sha256', chave).update(dados).digest('base64url');
}

// ── Criptografia em repouso (AES-256-GCM) ──
// Chave derivada da senha via scrypt. Formato: base64(salt|iv|tag|ciphertext)
function derivarChave(senha, salt) {
  return crypto.scryptSync(senha, salt, 32, { N: 1 << 15, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
}

function cifrar(texto, chave) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', chave, iv);
  const ct = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

function decifrar(blob, chave) {
  const buf = Buffer.from(blob, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', chave, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

module.exports = {
  hashSenha, verificarSenha,
  tokenAleatorio, comparaSeguro, hmac,
  derivarChave, cifrar, decifrar
};
