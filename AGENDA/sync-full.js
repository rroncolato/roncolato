#!/usr/bin/env node
/**
 * 🚀 Sincronização Bidirecional Completa: Google Calendar ↔ Notion
 *
 * Baseado nas melhores práticas dos repositórios:
 * - nathan-dykstra/gcal-notion-integration
 * - akarri2001/Notion-and-Google-Calendar-2-Way-Sync
 *
 * Funcionalidades:
 * ✅ Sincroniza eventos existentes
 * ✅ Detecta mudanças em tempo real
 * ✅ Atualiza bidirecional (Notion → Calendar, Calendar → Notion)
 * ✅ Links de referência entre plataformas
 * ✅ Deleta automaticamente quando marcado "Done"
 * ✅ Suporta múltiplos calendários
 */

require('dotenv').config();
const { google } = require('googleapis');
const SyncManager = require('./lib/sync-manager');
const NotionManager = require('./lib/notion-manager');
const GoogleManager = require('./lib/google-manager');

const SYNC_STATE_FILE = '/tmp/gcal-notion-sync-state.json';
const LOG_FILE = '/tmp/gcal-notion-sync.log';

// Logger
function log(level, message, data = '') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message} ${data ? JSON.stringify(data) : ''}`;
  console.log(logMessage);
}

// Validar ambiente
function validateEnvironment() {
  const required = [
    'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
    'GOOGLE_PROJECT_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_CALENDAR_ID',
    'NOTION_TOKEN',
    'NOTION_AGENDA_DB_ID'
  ];

  const missing = required.filter(v => !process.env[v]);
  if (missing.length > 0) {
    log('ERROR', 'Variáveis de ambiente faltando:', missing);
    process.exit(1);
  }

  log('INFO', '✅ Variáveis de ambiente validadas');
}

// Main
async function main() {
  log('INFO', '🚀 Iniciando sincronização bidirecional Google Calendar ↔ Notion');
  console.log('');

  validateEnvironment();

  try {
    const notionManager = new NotionManager();
    const googleManager = new GoogleManager();
    const syncManager = new SyncManager(notionManager, googleManager);

    // Fase 1: Sincronizar deletions
    log('INFO', '📋 Fase 1: Sincronizando deletions...');
    await syncManager.syncDeletions();

    // Fase 2: Importar eventos do Notion para Google Calendar
    log('INFO', '📋 Fase 2: Importando eventos do Notion → Google Calendar...');
    const notionToCalStats = await syncManager.syncNotionToGoogleCalendar();

    // Fase 3: Importar eventos do Google Calendar para Notion
    log('INFO', '📋 Fase 3: Importando eventos do Google Calendar → Notion...');
    const calToNotionStats = await syncManager.syncGoogleCalendarToNotion();

    // Fase 4: Atualizar mudanças do Notion no Google Calendar
    log('INFO', '📋 Fase 4: Atualizando mudanças do Notion → Google Calendar...');
    await syncManager.syncNotionChanges();

    // Fase 5: Atualizar mudanças do Google Calendar no Notion
    log('INFO', '📋 Fase 5: Atualizando mudanças do Google Calendar → Notion...');
    await syncManager.syncGoogleCalendarChanges();

    // Resumo
    console.log('');
    log('INFO', '✅ Sincronização completa!');
    console.log(`
📊 Resumo Final:
  • Notion → Google Calendar: ${notionToCalStats.created} criados, ${notionToCalStats.updated} atualizados
  • Google Calendar → Notion: ${calToNotionStats.created} criados, ${calToNotionStats.updated} atualizados
    `);

  } catch (error) {
    log('ERROR', 'Erro na sincronização:', error.message);
    process.exit(1);
  }
}

main();
