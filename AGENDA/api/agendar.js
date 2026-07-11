const { rateLimit } = require('../../src/api/_rateLimit');
const { createCalendarEvent } = require('./google-calendar');
const { Client } = require('@notionhq/client');

module.exports = async function handler(req, res) {
  // Rate limiting
  const rateLimitError = rateLimit(req, res);
  if (rateLimitError) return;

  // Restringir CORS apenas ao domínio oficial
  const allowedOrigins = ['https://rroncolato.com.br', 'https://agenda.rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3001', 'http://127.0.0.1:3001'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { nome, empresa, email, tel, msg, servico, data, dataFmt, hora } = req.body;

  // Validação robusta de entrada
  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  if (nome.length > 200) {
    return res.status(400).json({ error: 'Nome muito longo' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (email.length > 254) {
    return res.status(400).json({ error: 'Email muito longo' });
  }

  if (!tel || typeof tel !== 'string' || tel.trim().length === 0) {
    return res.status(400).json({ error: 'Telefone é obrigatório' });
  }

  // Validação de telefone
  const telRegex = /^[\d\s\-\(\)\+]+$/;
  if (!telRegex.test(tel)) {
    return res.status(400).json({ error: 'Telefone inválido' });
  }
  if (tel.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Telefone deve ter pelo menos 10 dígitos' });
  }
  if (tel.length > 20) {
    return res.status(400).json({ error: 'Telefone muito longo' });
  }

  if (empresa && (typeof empresa !== 'string' || empresa.length > 200)) {
    return res.status(400).json({ error: 'Empresa inválida' });
  }

  // Validação de data
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res.status(400).json({ error: 'Data inválida' });
  }

  // Validação de hora
  if (!hora || !/^\d{2}:\d{2}$/.test(hora)) {
    return res.status(400).json({ error: 'Horário inválido' });
  }

  // Validar serviço
  const servicosValidos = ['Fotografia Executiva', 'Fotografia Corporativa', 'Não informado'];
  if (servico && !servicosValidos.includes(servico)) {
    return res.status(400).json({ error: 'Serviço inválido' });
  }

  if (msg && typeof msg !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida' });
  }
  if (msg && msg.length > 1000) {
    return res.status(400).json({ error: 'Mensagem muito longa (máx 1000 caracteres)' });
  }

  // Sanitizar entrada
  const sanitize = (str) => {
    if (!str) return '';
    return str
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000);
  };

  const nomeSanitizado = sanitize(nome.trim());
  const emailSanitizado = email.trim().toLowerCase();
  const telSanitizado = sanitize(tel.trim());
  const empresaSanitizada = sanitize((empresa || '').trim());
  const msgSanitizada = sanitize((msg || '').trim());

  try {
    // Criar evento no Google Calendar com TODOS os dados
    let calendarEventData = null;
    try {
      // Montar descrição com todas as informações do formulário
      const description = [
        `Nome: ${nomeSanitizado}`,
        `Email: ${emailSanitizado}`,
        `WhatsApp: ${telSanitizado}`,
        empresaSanitizada ? `Empresa: ${empresaSanitizada}` : null,
        servico ? `Serviço: ${servico}` : null,
        msgSanitizada ? `Mensagem: ${msgSanitizada}` : null,
      ].filter(Boolean).join('\n');

      calendarEventData = await createCalendarEvent({
        name: nomeSanitizado,
        email: emailSanitizado,
        phone: telSanitizado,
        message: description,  // Passar descrição completa
        date: data,
        time: hora,
      });
    } catch (calError) {
      console.error('Aviso: Erro ao criar evento no Google Calendar:', calError.message);
      // Continua mesmo se Google Calendar falhar
    }

    // Salvar no Notion como TAREFA usando SDK oficial
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    try {
      const notionResp = await notion.pages.create({
        parent: { database_id: process.env.NOTION_TAREFAS_DATABASE_ID || process.env.NOTION_AGENDA_DB_ID },
        properties: {
          'Name': { title: [{ text: { content: `Reunião: ${nomeSanitizado}` } }] },
          'Status': { status: { id: 'IDjR' } },  // "A Fazer"
          'Tipo': { select: { id: '28ef5033-c267-4cc4-a831-e00ab13d03fc' } },  // "Estratégico"
          'Bloco': { select: { id: '5a3715f6-0fab-4bf4-adf3-c1a8e2fa00fc' } },  // "Reuniões"
          'Data Execução': { date: { start: data } },  // Adicionar data
          'googleEventId': { rich_text: [{ text: { content: calendarEventData?.eventId || '' } }] },  // ID do evento
        },
      });
      console.log('✅ Notion page created:', notionResp.id);
    } catch (notionError) {
      console.error('❌ Notion error:', notionError.message);
      return res.status(500).json({ error: 'Erro ao criar página no Notion: ' + notionError.message });
    }

    const response = {
      ok: true,
      message: 'Agendamento realizado com sucesso!',
    };

    // Incluir link do Google Meet se foi criado
    if (calendarEventData?.meetLink) {
      response.meetLink = calendarEventData.meetLink;
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error('❌ Erro na API de agendamento:', e.message, e.stack);
    return res.status(500).json({ error: 'Erro interno do servidor: ' + e.message });
  }
};
