// API para gerenciar visibilidade das seções do site
// Salva e carrega configuração de quais seções estão visíveis/ocultas

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';
const CONFIG_PATH = 'data/sections-config.json';
const DATA_DIR = 'data';

// Verificar JWT
function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];

    const newSignature = crypto
      .createHmac('sha256', secret)
      .update(header + '.' + body)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== newSignature) return null;

    const jsonStr = Buffer.from(body + '==', 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('Erro ao verificar JWT:', err);
    return null;
  }
}

// Configuração padrão de seções
const defaultConfig = {
  hero: true,
  portfolio: true,
  blog: true,
  presenca: true,
  oratoria: true,
  propostas: true,
  agenda: true,
  contact: true,
  updatedAt: new Date().toISOString()
};

// Carregar configuração
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Erro ao carregar config:', err);
  }
  return defaultConfig;
}

// Salvar configuração
function saveConfig(config) {
  try {
    // Criar diretório se não existir
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    config.updatedAt = new Date().toISOString();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Erro ao salvar config:', err);
    return false;
  }
}

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = ['https://rroncolato.com.br', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3011', 'http://127.0.0.1:3011'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - Retornar configuração atual
    if (req.method === 'GET') {
      const config = loadConfig();
      res.status(200).json({
        success: true,
        config: config
      });
      return;
    }

    // POST/PATCH - Atualizar configuração (requer autenticação)
    if (req.method === 'POST' || req.method === 'PATCH') {
      const token = req.body?.token || req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const payload = verifyJWT(token, JWT_SECRET);
      if (!payload) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      const { sections } = req.body;
      if (!sections || typeof sections !== 'object') {
        return res.status(400).json({ error: 'Configuração de seções inválida' });
      }

      // Validar que apenas seções conhecidas são atualizadas
      const validSections = ['hero', 'portfolio', 'blog', 'presenca', 'oratoria', 'propostas', 'agenda', 'contact'];
      const newConfig = { ...defaultConfig };

      for (const section of validSections) {
        if (section in sections) {
          newConfig[section] = Boolean(sections[section]);
        }
      }

      // Salvar configuração
      if (saveConfig(newConfig)) {
        res.status(200).json({
          success: true,
          message: 'Configuração salva com sucesso!',
          config: newConfig
        });
      } else {
        res.status(500).json({ error: 'Erro ao salvar configuração' });
      }
      return;
    }

    res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro em sections:', error);
    res.status(400).json({ error: error.message || 'Erro ao processar configuração' });
  }
};
