// /api/admin/utils/logger.js
// Sistema de logging e auditoria

const fs = require('fs');
const path = require('path');

// Arquivo de log pode ser salvo localmente em dev
// Em produção com Vercel, os logs vão para stdout
const LOG_FILE = path.join(__dirname, '../../.logs/audit.log');

function log(action, details, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] [${level}] ${action}: ${JSON.stringify(details)}`;

  console.log(message);

  // Em produção, apenas console.log (Vercel captura isso)
  if (process.env.NODE_ENV === 'development') {
    try {
      const dir = path.dirname(LOG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(LOG_FILE, message + '\n');
    } catch (err) {
      console.error('Erro ao escrever log:', err.message);
    }
  }
}

function logAction(action, details, userId = 'unknown') {
  log(`[${userId}] ${action}`, details, 'ACTION');
}

function logError(action, error, userId = 'unknown') {
  log(`[${userId}] ${action} - ERROR`, {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }, 'ERROR');
}

function logAuthAttempt(username, success, reason = null) {
  log(`AUTH_ATTEMPT - ${success ? 'SUCCESS' : 'FAILURE'}`, {
    username,
    reason: reason || 'N/A'
  }, success ? 'INFO' : 'WARN');
}

module.exports = {
  log,
  logAction,
  logError,
  logAuthAttempt
};
