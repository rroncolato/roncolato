const { google } = require('googleapis');

// Configurações de agendamento
const CONFIG = {
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'rodrigo@rroncolato.com',
  horarioInicio: 9, // 9h
  horarioFim: 18, // 18h (até 17h, mas deixamos 18 como limite superior)
  duracao: 60, // 1 hora em minutos
  diasTrabaho: [1, 2, 3, 4, 5], // seg-sex (0=dom, 6=sab)
  horariosDisponiveis: [
    { inicio: 9, fim: 12 },   // 9h-11h (slots: 09:00, 10:00, 11:00)
    { inicio: 15, fim: 18 }   // 15h-17h (slots: 15:00, 16:00, 17:00)
  ]
};

// Inicializar autenticação
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

// Buscar eventos ocupados em TODOS os calendários
async function getEventosOcupados(data) {
  try {
    const auth = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Parse data em formato YYYY-MM-DD
    const [year, month, day] = data.split('-').map(Number);

    // Criar range de 24h em São Paulo: começa no início do dia e termina no fim
    // São Paulo é UTC-3, então: 2026-03-18 00:00:00 em SP = 2026-03-18 03:00:00 UTC
    const dataInicio = new Date(Date.UTC(year, month - 1, day, 3, 0, 0, 0));
    const dataFim = new Date(Date.UTC(year, month - 1, day + 1, 2, 59, 59, 999));

    // Obter todos os calendários configurados
    const calendariosList = (process.env.GOOGLE_CALENDARIOS || CONFIG.calendarId).split(',');
    const todosEventos = [];

    // Buscar eventos de cada calendário
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
        console.warn(`Aviso: Erro ao buscar eventos de ${calId.trim()}: ${err.message}`);
        // Continua com próximo calendário se um falhar
      }
    }

    return todosEventos;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error.message);
    return [];
  }
}

// Gerar horários disponíveis
function gerarHorariosDisponiveis(data, eventosOcupados) {
  const horarios = [];

  // Parse data em São Paulo (UTC-3)
  const [year, month, day] = data.split('-').map(Number);
  const dataInicio = new Date(year, month - 1, day, 0, 0, 0, 0);
  const diaSemana = dataInicio.getDay();

  // Verificar se é fim de semana
  if (!CONFIG.diasTrabaho.includes(diaSemana)) {
    return [];
  }

  // Nas sextas (5), apenas horários da manhã
  let periodosDisponiveis = CONFIG.horariosDisponiveis;
  if (diaSemana === 5) { // 5 = sexta-feira
    periodosDisponiveis = [{ inicio: 9, fim: 12 }]; // Apenas manhã
  }

  // Iterar através dos períodos disponíveis
  for (const periodo of periodosDisponiveis) {
    for (let hora = periodo.inicio; hora < periodo.fim; hora++) {
      const horaFormatada = `${String(hora).padStart(2, '0')}:00`;

      // Criar slot na timezone local (São Paulo)
      const dataHora = new Date(year, month - 1, day, hora, 0, 0, 0);
      const dataHoraFim = new Date(dataHora);
      dataHoraFim.setMinutes(dataHoraFim.getMinutes() + CONFIG.duracao);

      const temConflito = eventosOcupados.some(evento => {
        const eventoInicio = new Date(evento.start.dateTime || evento.start.date);
        const eventoFim = new Date(evento.end.dateTime || evento.end.date);

        return dataHora < eventoFim && dataHoraFim > eventoInicio;
      });

      if (!temConflito) {
        horarios.push({
          hora: horaFormatada,
          disponivel: true
        });
      }
    }
  }

  return horarios;
}

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = ['https://agenda.rroncolato.com.br', 'http://localhost:3002', 'http://127.0.0.1:3002', 'http://localhost:3001', 'http://127.0.0.1:3001'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { data } = req.query;

  // Validar data
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res.status(400).json({ error: 'Data inválida. Use formato YYYY-MM-DD' });
  }

  try {
    const eventos = await getEventosOcupados(data);
    const horarios = gerarHorariosDisponiveis(data, eventos);

    return res.status(200).json({
      data,
      horarios,
      total: horarios.length,
      config: {
        horarioInicio: CONFIG.horarioInicio,
        horarioFim: CONFIG.horarioFim,
        duracao: CONFIG.duracao
      }
    });
  } catch (error) {
    console.error('Erro na API:', error.message);
    return res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
  }
};
