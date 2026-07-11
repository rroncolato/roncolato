const { createCSRFToken, getSessionId } = require('./_csrf');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  // Restringir CORS
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const sessionId = getSessionId(req);
    const token = createCSRFToken(sessionId);

    return res.status(200).json({ csrfToken: token });
  } catch (e) {
    console.error('Erro ao gerar token CSRF:', e.message);
    return res.status(500).json({ error: 'Erro ao gerar token' });
  }
};
