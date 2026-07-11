const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../../.env'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (e) {
  console.warn('⚠️ .env não encontrado');
}

// Autenticação Google
function getAuthClient() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: privateKey,
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: '117573192736245228554',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return auth;
}

// Buscar eventos de uma data específica
async function getCalendarEvents(date) {
  try {
    const auth = getAuthClient();
    const client = await auth.getClient();
    client.subject = process.env.GOOGLE_CALENDAR_ID;
    const calendar = google.calendar({ version: 'v3', auth });

    const [year, month, day] = date.split('-').map(Number);
    const dataInicio = new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
    const dataFim = new Date(Date.UTC(year, month - 1, day + 1, 2, 59, 59));

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: dataInicio.toISOString(),
      timeMax: dataFim.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error.message);
    return [];
  }
}

// Verificar se evento já existe
async function eventExists(googleEventId) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_TAREFAS_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          property: 'googleEventId',
          rich_text: { equals: googleEventId }
        }
      })
    });

    const data = await response.json();
    return data.results && data.results.length > 0;
  } catch (error) {
    return false;
  }
}

// Criar tarefa no Notion
async function createNotionTask(event) {
  try {
    const nome = event.summary.replace('Reunião: ', '');
    const descricao = event.description || '';
    const dataEvento = new Date(event.start.dateTime);
    const dataFormatada = dataEvento.toISOString().split('T')[0]; // YYYY-MM-DD

    // Verificar se já existe
    if (await eventExists(event.id)) {
      console.log('⏭️  Já existe:', nome);
      return true;
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_TAREFAS_DATABASE_ID },
        properties: {
          'Name': { title: [{ text: { content: `Reunião: ${nome}` } }] },
          'Status': { status: { id: 'IDjR' } },
          'Tipo': { select: { id: '28ef5033-c267-4cc4-a831-e00ab13d03fc' } },
          'Bloco': { select: { id: '5a3715f6-0fab-4bf4-adf3-c1a8e2fa00fc' } },
          'Data Execução': { date: { start: dataFormatada } },
          'googleEventId': { rich_text: [{ text: { content: event.id } }] },
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('❌ Erro ao criar no Notion:', result);
      return false;
    }
    console.log('✅ Criado no Notion:', nome, `(${dataFormatada})`);
    return true;
  } catch (error) {
    console.error('Erro:', error.message);
    return false;
  }
}

// Sincronizar
async function sync(date) {
  console.log(`\n🔄 Sincronizando agenda de ${date}...`);

  const events = await getCalendarEvents(date);

  if (events.length === 0) {
    console.log('ℹ️ Nenhum evento encontrado');
    return;
  }

  console.log(`📅 ${events.length} evento(s) encontrado(s)\n`);

  for (const event of events) {
    await createNotionTask(event);
  }

  console.log('\n✅ Sincronização concluída!');
}

// Executar
const date = process.argv[2] || '2026-03-30';
sync(date);
