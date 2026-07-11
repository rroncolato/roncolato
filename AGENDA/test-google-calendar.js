const { google } = require('googleapis');
const fs = require('fs');

// Carregar .env
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
} catch (e) {
  console.error('❌ .env não encontrado');
  process.exit(1);
}

console.log('\n=== VALIDAÇÃO DE CREDENCIAIS ===');
console.log('GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID);
console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log('GOOGLE_PROJECT_ID:', process.env.GOOGLE_PROJECT_ID);
console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY existe?', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PROJECT_ID) {
  console.error('❌ Credenciais incompletas');
  process.exit(1);
}

async function testCalendar() {
  try {
    console.log('\n=== TESTE DE AUTENTICAÇÃO ===');
    const auth = new google.auth.GoogleAuth({
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

    console.log('✓ GoogleAuth inicializado');

    const calendar = google.calendar({ version: 'v3', auth });
    console.log('✓ Calendar API conectada');

    // Testar acesso ao calendário
    console.log('\n=== TESTE DE ACESSO AO CALENDÁRIO ===');
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    console.log('Testando calendário:', calendarId);

    const calInfo = await calendar.calendars.get({ calendarId });
    console.log('✓ Calendário encontrado:', calInfo.data.summary);

    // Testar busca de eventos para hoje
    console.log('\n=== TESTE DE BUSCA DE EVENTOS ===');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('Buscando eventos de:', today.toISOString());
    console.log('Até:', tomorrow.toISOString());

    const response = await calendar.events.list({
      calendarId,
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'America/Sao_Paulo'
    });

    console.log('✓ Eventos encontrados:', response.data.items?.length || 0);
    if (response.data.items?.length > 0) {
      response.data.items.forEach(e => {
        console.log(`  - ${e.summary}: ${e.start.dateTime || e.start.date}`);
      });
    }

    // Testar busca para terça-feira (2026-03-18)
    console.log('\n=== TESTE PARA TERÇA 2026-03-18 ===');
    const tuesday = new Date(2026, 2, 18, 0, 0, 0, 0);
    const wednesdayStart = new Date(2026, 2, 19, 0, 0, 0, 0);

    console.log('Buscando eventos de:', tuesday.toISOString());
    console.log('Até:', wednesdayStart.toISOString());

    const tuesdayEvents = await calendar.events.list({
      calendarId,
      timeMin: tuesday.toISOString(),
      timeMax: wednesdayStart.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'America/Sao_Paulo'
    });

    console.log('✓ Eventos encontrados:', tuesdayEvents.data.items?.length || 0);
    if (tuesdayEvents.data.items?.length > 0) {
      tuesdayEvents.data.items.forEach(e => {
        console.log(`  - ${e.summary}: ${e.start.dateTime || e.start.date}`);
      });
    } else {
      console.log('⚠️  Nenhum evento encontrado na terça');
    }

    console.log('\n✅ TODOS OS TESTES PASSARAM');
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    if (error.response) {
      console.error('Resposta:', error.response.data);
    }
    process.exit(1);
  }
}

testCalendar();
