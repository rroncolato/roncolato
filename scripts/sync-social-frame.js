/**
 * Sincronização manual do SOCIAL FRAME (mesma lógica do auto-sync do servidor).
 * O servidor já sincroniza sozinho a cada 10 min e a cada login admin —
 * use este script só quando quiser forçar na hora.
 *
 * Uso: node scripts/sync-social-frame.js
 */
require('dotenv').config();

const { sincronizar } = require('../src/utils/social-frame-sync');

sincronizar({ log: true }).then((r) => {
  if (!r.ok && !r.skipped) process.exit(1);
});
