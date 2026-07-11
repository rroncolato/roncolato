const { google } = require('googleapis');

// Configurações de agendamento
const CONFIG = {
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'rodrigo@rroncolato.com',
  duracao: 60,
  diasTrabaho: [1, 2, 3, 4, 5],
  horariosDisponiveis: [
    { inicio: 9, fim: 12 },
    { inicio: 15, fim: 18 }
  ]
};

function getAuthClient() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!privateKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY não configurada');
  }
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

async function getEventosOcupados(data) {
  try {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const [year, month, day] = data.split('-').map(Number);
    const dataInicio = new Date(Date.UTC(year, month - 1, day, 3, 0, 0, 0));
    const dataFim = new Date(Date.UTC(year, month - 1, day + 1, 2, 59, 59, 999));

    const calendariosList = (process.env.GOOGLE_CALENDARIOS || CONFIG.calendarId).split(',');
    const todosEventos = [];

    for (const calId of calendariosList) {
      try {
        const response = await calendar.events.list({
          calendarId: calId.trim(),
          timeMin: dataInicio.toISOString(),
          timeMax: dataFim.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          timeZone: 'America/Sao_Paulo'
        });
        todosEventos.push(...(response.data.items || []));
      } catch (err) {
        console.warn(`Aviso: Erro ao buscar eventos de ${calId.trim()}`);
      }
    }
    return todosEventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error.message);
    return [];
  }
}

function gerarSlots(data, eventosOcupados) {
  const slots = [];
  const [year, month, day] = data.split('-').map(Number);
  const dataInicio = new Date(year, month - 1, day, 0, 0, 0, 0);
  const diaSemana = dataInicio.getDay();

  if (!CONFIG.diasTrabaho.includes(diaSemana)) {
    return [];
  }

  let periodosDisponiveis = CONFIG.horariosDisponiveis;
  if (diaSemana === 5) { // sexta-feira
    periodosDisponiveis = [{ inicio: 9, fim: 12 }];
  }

  for (const periodo of periodosDisponiveis) {
    for (let hora = periodo.inicio; hora < periodo.fim; hora++) {
      const horaFormatada = `${String(hora).padStart(2, '0')}:00`;
      const dataHora = new Date(year, month - 1, day, hora, 0, 0, 0);
      const dataHoraFim = new Date(dataHora);
      dataHoraFim.setMinutes(dataHoraFim.getMinutes() + CONFIG.duracao);

      const temConflito = eventosOcupados.some(evento => {
        const eventoInicio = new Date(evento.start.dateTime || evento.start.date);
        const eventoFim = new Date(evento.end.dateTime || evento.end.date);
        return dataHora < eventoFim && dataHoraFim > eventoInicio;
      });

      slots.push({
        time: horaFormatada,
        busy: temConflito
      });
    }
  }
  return slots;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Data inválida (use YYYY-MM-DD)' });
  }

  try {
    const eventos = await getEventosOcupados(date);
    const slots = gerarSlots(date, eventos);

    return res.status(200).json({
      date,
      slots,
      eventCount: eventos.length,
    });
  } catch (e) {
    console.error('Erro na API de disponibilidade:', e.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
