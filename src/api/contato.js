const { rateLimit } = require('./_rateLimit');

module.exports = async function handler(req, res) {
  // Rate limiting
  const rateLimitError = rateLimit(req, res);
  if (rateLimitError) return;

  // Restringir CORS apenas ao domínio oficial
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { nome, empresa, email, tel, servico, mensagem } = req.body;

  // Validação robusta de entrada
  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  if (nome.length > 200) {
    return res.status(400).json({ error: 'Nome muito longo (máx 200 caracteres)' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  // Validação básica de email
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

  // Validação de telefone (apenas números e caracteres permitidos)
  const telRegex = /^[\d\s\-\(\)\+]+$/;
  if (!telRegex.test(tel)) {
    return res.status(400).json({ error: 'Telefone contém caracteres inválidos' });
  }
  if (tel.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Telefone deve ter pelo menos 10 dígitos' });
  }
  if (tel.length > 20) {
    return res.status(400).json({ error: 'Telefone muito longo' });
  }

  if (empresa && (typeof empresa !== 'string' || empresa.length > 200)) {
    return res.status(400).json({ error: 'Empresa inválida (máx 200 caracteres)' });
  }

  if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length === 0) {
    return res.status(400).json({ error: 'Mensagem é obrigatória' });
  }
  if (mensagem.length > 5000) {
    return res.status(400).json({ error: 'Mensagem muito longa (máx 5000 caracteres)' });
  }

  // Validar campo de serviço
  const servicosTerm = ['Fotografia Executiva', 'Fotografia Corporativa', 'Identidade Visual', 'Personal Branding', 'Outro'];
  if (servico && (!servicosTerm.includes(servico) || servico.length > 50)) {
    return res.status(400).json({ error: 'Serviço inválido' });
  }

  // Sanitizar entrada (remover caracteres perigosos, mas manter a mensagem legível)
  const sanitize = (str) => {
    if (!str) return '';
    return str
      .replace(/[<>]/g, '') // Remove < e >
      .trim()
      .substring(0, 5000);
  };

  const nomeSanitizado = sanitize(nome.trim());
  const emailSanitizado = email.trim().toLowerCase();
  const telSanitizado = sanitize(tel.trim());
  const empresaSanitizada = sanitize((empresa || '').trim());
  const mensagemSanitizada = sanitize(mensagem.trim());

  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DB_ID },
        properties: {
          'Name':     { title:        [{ text: { content: nomeSanitizado } }] },
          'Empresa':  { rich_text:    [{ text: { content: empresaSanitizada } }] },
          'Email':    { url: emailSanitizado },
          'Contato':  { url: telSanitizado },
          'Serviços': { multi_select: servico ? [{ name: servico }] : [] },
          'Mensagem': { rich_text:    [{ text: { content: mensagemSanitizada } }] },
          'CRM':      { select:       { name: 'LEAD' } },
        },
      }),
    });

    if (!r.ok) {
      const err = await r.json();
      console.error('Notion error:', JSON.stringify(err));
      return res.status(500).json({ error: 'Erro ao salvar contato. Tente novamente.' });
    }

    return res.status(200).json({ ok: true, message: 'Contato salvo com sucesso!' });
  } catch (e) {
    console.error('Erro na API de contato:', e.message);
    return res.status(500).json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' });
  }
};
