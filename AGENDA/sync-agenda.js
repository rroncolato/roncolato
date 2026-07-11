#!/usr/bin/env node
/**
 * Script de Sincronização: Google Calendar → Notion
 * Uso: node sync-agenda.js [--periodo=30]
 *
 * Sincroniza todos os eventos do Google Calendar para o Notion
 */

require('dotenv').config();
const { google } = require('googleapis');

// Validar variáveis de ambiente
const requiredEnvVars = ['GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_PROJECT_ID', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CALENDAR_ID', 'NOTION_TOKEN', 'NOTION_AGENDA_DB_ID'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Variáveis de ambiente faltando:', missing.join(', '));
  process.exit(1);
}

// Configurar Google Calendar
function getGoogleAuth() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
  return new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: 'agenda-roncolato',
      private_key: privateKey,
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: '117573192736245228554',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    },
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
}

// Buscar eventos do Google Calendar
async function getCalendarEvents(daysAhead = 30) {
  const auth = getGoogleAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const now = new Date();
  const futuro = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  console.log(`📅 Buscando eventos de ${now.toLocaleDateString('pt-BR')} a ${futuro.toLocaleDateString('pt-BR')}...`);

  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: futuro.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100,
    });

    return response.data.items || [];
  } catch (error) {
    console.error('❌ Erro ao buscar eventos do Google Calendar:', error.message);
    throw error;
  }
}

// Buscar páginas existentes no Notion
async function getNotionPages() {
  try {
    const response = await fetch('https://api.notion.com/v1/databases/' + process.env.NOTION_AGENDA_DB_ID + '/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ page_size: 100 }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('❌ Erro ao buscar páginas do Notion:', JSON.stringify(data, null, 2));
      throw new Error(data.message || 'Erro ao buscar páginas');
    }

    return data.results || [];
  } catch (error) {
    console.error('❌ Erro ao conectar com Notion:', error.message);
    throw error;
  }
}

// Extrair nome do evento
function extractName(event) {
  // Se tiver em formato "Nome - ..." usa o que vem antes do hífen
  const summary = event.summary || 'Sem título';
  const match = summary.match(/^([^-]+)/);
  return match ? match[1].trim() : summary;
}

// Criar página no Notion
async function createNotionPage(event) {
  const name = extractName(event);

  const body = {
    parent: { database_id: process.env.NOTION_AGENDA_DB_ID },
    properties: {
      'Name': { title: [{ text: { content: name } }] },
      'Status': { status: { id: 'IDjR' } },  // "A Fazer"
      'Tipo': { select: { id: '28ef5033-c267-4cc4-a831-e00ab13d03fc' } },  // "Estratégico"
      'Bloco': { select: { id: '5a3715f6-0fab-4bf4-adf3-c1a8e2fa00fc' } },  // "Reuniões"
    },
  };

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`❌ Erro ao criar página para "${name}":`, data.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`❌ Erro ao criar página para "${name}":`, error.message);
    return null;
  }
}

// Main
async function main() {
  console.log('\n🚀 Iniciando sincronização Google Calendar → Notion\n');

  try {
    // Parse argumentos
    const daysAhead = parseInt(process.argv.find(arg => arg.startsWith('--periodo='))?.split('=')[1]) || 30;

    // Buscar eventos
    const events = await getCalendarEvents(daysAhead);
    console.log(`✅ ${events.length} evento(s) encontrado(s) no Google Calendar\n`);

    if (events.length === 0) {
      console.log('ℹ️  Nenhum evento para sincronizar.');
      process.exit(0);
    }

    // Buscar páginas existentes no Notion
    const notionPages = await getNotionPages();
    const notionNames = new Set(notionPages.map(p => p.properties.Name?.title?.[0]?.text?.content).filter(Boolean));
    console.log(`📝 ${notionPages.length} página(s) existente(s) no Notion\n`);

    // Sincronizar
    let created = 0;
    let skipped = 0;

    for (const event of events) {
      const name = extractName(event);
      const eventDate = new Date(event.start.dateTime || event.start.date).toLocaleDateString('pt-BR');
      const eventTime = event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'o dia todo';

      if (notionNames.has(name)) {
        console.log(`⏭️  [SKIP] "${name}" já existe no Notion`);
        skipped++;
      } else {
        const result = await createNotionPage(event);
        if (result) {
          console.log(`✅ [NOVO] "${name}" (${eventDate} às ${eventTime}) criado no Notion`);
          created++;
        } else {
          console.log(`❌ [ERRO] Não foi possível criar "${name}"`);
        }
      }
    }

    console.log(`\n📊 Resumo:\n  ✅ Criados: ${created}\n  ⏭️  Ignorados: ${skipped}\n`);

  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

main();
