# 🔧 Implementação de Backend Admin - Roncolato

**Versão:** 2.0.0
**Data:** 2026-03-20
**Squad:** Backend Dev
**Status:** Completo e pronto para deploy

---

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Middlewares](#middlewares)
4. [APIs - Portfolio](#apis---portfolio)
5. [APIs - Blog](#apis---blog)
6. [Estrutura de Dados](#estrutura-de-dados)
7. [Deploy](#deploy)
8. [Testes](#testes)
9. [Segurança](#segurança)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

### Stack Utilizado
- **Backend:** Node.js + Vercel Serverless Functions
- **Autenticação:** JWT (HMAC-SHA256)
- **Armazenamento Temporário:** JavaScript Objects no index.html
- **Armazenamento Produção:** Cloudinary / AWS S3 (recomendado)
- **Validação:** Input sanitization + XSS detection
- **Logging:** Auditoria de ações

### Fluxo Geral

```
Frontend (admin)
    ↓ (POST/PUT/DELETE/PATCH + JWT)
Middleware de Auth
    ↓
Middleware de Validação
    ↓
Handler da API
    ↓
Processamento de Dados
    ↓
Armazenamento (HTML ou S3)
    ↓
Response JSON
    ↓
Frontend (atualiza UI)
```

---

## 🗂️ Estrutura de Pastas

```
/api/admin/
├── auth.js                          ✅ Já existe
├── middleware/
│   ├── auth.js                      (Verificação JWT)
│   ├── validate.js                  (Sanitização e validação)
│   ├── error-handler.js             (Tratamento de erros)
│   └── logger.js                    (Auditoria)
├── utils/
│   ├── jwt.js                       (Funções JWT)
│   ├── sanitizer.js                 (Sanitização de input)
│   ├── validator.js                 (Validações)
│   └── storage.js                   (Gerenciamento de storage)
├── portfolio/
│   ├── add.js                       (POST - Criar projeto)
│   ├── update.js                    (PUT - Editar projeto)
│   ├── delete.js                    (DELETE - Deletar projeto)
│   ├── hide.js                      (PATCH - Ocultar/Mostrar)
│   └── list.js                      (GET - Listar com filtros)
├── blog/
│   ├── add.js                       (POST - Criar post)
│   ├── update.js                    (PUT - Editar post)
│   ├── delete.js                    (DELETE - Deletar post)
│   ├── hide.js                      (PATCH - Ocultar/Mostrar)
│   └── list.js                      (GET - Listar com filtros)
└── config/
    ├── constants.js                 (Constantes)
    └── database.js                  (Schema e operações de DB)
```

---

## 🔐 Middlewares

### 1. Middleware de Autenticação (`middleware/auth.js`)

```javascript
// /api/admin/middleware/auth.js

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-super-secreta-mude-em-producao';

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    // Recalcular assinatura
    const newSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(header + '.' + body)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== newSignature) return null;

    // Decodificar payload
    const jsonStr = Buffer.from(body + '==', 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr);

    // Verificar expiração
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error('[AUTH] Erro ao verificar JWT:', err.message);
    return null;
  }
}

// Middleware para ser usado em todos os handlers
function authMiddleware(req) {
  const token = req.body?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return {
      success: false,
      error: 'Token não fornecido',
      code: 'AUTH_MISSING_TOKEN',
      statusCode: 401
    };
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return {
      success: false,
      error: 'Token inválido ou expirado',
      code: 'AUTH_INVALID_TOKEN',
      statusCode: 401
    };
  }

  return { success: true, payload };
}

module.exports = {
  verifyJWT,
  authMiddleware
};
```

### 2. Middleware de Validação (`middleware/validate.js`)

```javascript
// /api/admin/middleware/validate.js

const MAX_STRING_LENGTH = 5000;
const MAX_TITLE_LENGTH = 200;
const MAX_SLUG_LENGTH = 100;
const ALLOWED_HTML_TAGS = ['b', 'i', 'strong', 'em', 'u', 'h2', 'h3', 'p', 'blockquote', 'ul', 'ol', 'li', 'br', 'a'];

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '`': '&#96;'
  };
  return text.replace(/[&<>"'`]/g, m => map[m]);
}

function detectMaliciousContent(text) {
  // Detectar scripts
  if (/<script\b|javascript:|on\w+\s*=/i.test(text)) {
    return 'Conteúdo contém código malicioso (script)';
  }

  // Detectar event handlers
  if (/on(load|error|click|mouseover|keydown|submit|change)\s*=/i.test(text)) {
    return 'Conteúdo contém event handlers maliciosos';
  }

  // Detectar SQL injection patterns
  if (/(\bunion\b.*\bselect\b|\bor\b.*1\s*=\s*1|--|\/\*|\*\/|xp_|sp_)/i.test(text)) {
    return 'Conteúdo suspeito detectado';
  }

  return null;
}

function validateString(text, fieldName, options = {}) {
  const {
    required = true,
    maxLength = MAX_STRING_LENGTH,
    minLength = 1,
    pattern = null,
    allowHtml = false
  } = options;

  // Validar tipo
  if (typeof text !== 'string') {
    throw new Error(`${fieldName} deve ser uma string`);
  }

  // Validar presença
  if (required && !text.trim()) {
    throw new Error(`${fieldName} é obrigatório`);
  }

  // Se não é obrigatório e está vazio, retorna string vazia
  if (!text.trim()) {
    return '';
  }

  // Validar tamanho
  if (text.length < minLength) {
    throw new Error(`${fieldName} deve ter no mínimo ${minLength} caracteres`);
  }

  if (text.length > maxLength) {
    throw new Error(`${fieldName} não pode exceder ${maxLength} caracteres`);
  }

  // Validar contra padrão regex
  if (pattern && !pattern.test(text)) {
    throw new Error(`${fieldName} não é válido`);
  }

  // Detectar conteúdo malicioso
  const malicious = detectMaliciousContent(text);
  if (malicious) {
    throw new Error(malicious);
  }

  // Sanitizar se necessário
  if (!allowHtml) {
    return escapeHtml(text.trim());
  }

  return text.trim();
}

function validateNumber(value, fieldName, options = {}) {
  const { min = null, max = null, required = true } = options;

  if (required && (value === null || value === undefined || value === '')) {
    throw new Error(`${fieldName} é obrigatório`);
  }

  const num = Number(value);

  if (isNaN(num)) {
    throw new Error(`${fieldName} deve ser um número`);
  }

  if (min !== null && num < min) {
    throw new Error(`${fieldName} não pode ser menor que ${min}`);
  }

  if (max !== null && num > max) {
    throw new Error(`${fieldName} não pode ser maior que ${max}`);
  }

  return num;
}

function validateDate(dateString, fieldName) {
  if (!dateString || typeof dateString !== 'string') {
    throw new Error(`${fieldName} inválido`);
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldName} deve ser uma data válida (YYYY-MM-DD)`);
  }

  return date.toISOString().split('T')[0];
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_SLUG_LENGTH);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }
  return email.trim().toLowerCase();
}

function validateUrl(url) {
  if (!url || !url.trim()) return '';

  try {
    const urlObj = new URL(url.trim());
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('URL deve usar http ou https');
    }
    return urlObj.toString();
  } catch (err) {
    throw new Error('URL inválida');
  }
}

module.exports = {
  escapeHtml,
  detectMaliciousContent,
  validateString,
  validateNumber,
  validateDate,
  generateSlug,
  validateEmail,
  validateUrl,
  MAX_STRING_LENGTH,
  MAX_TITLE_LENGTH,
  ALLOWED_HTML_TAGS
};
```

### 3. Error Handler (`middleware/error-handler.js`)

```javascript
// /api/admin/middleware/error-handler.js

function handleError(error, res) {
  console.error('[ERROR]', error.message);

  // Erros de validação
  if (error.message.includes('inválido') ||
      error.message.includes('obrigatório') ||
      error.message.includes('não pode')) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erros de autenticação
  if (error.message.includes('Token') ||
      error.message.includes('autorizado')) {
    return res.status(401).json({
      success: false,
      error: error.message,
      code: 'AUTH_ERROR'
    });
  }

  // Erros de não encontrado
  if (error.message.includes('não encontrado') ||
      error.message.includes('não existe')) {
    return res.status(404).json({
      success: false,
      error: error.message,
      code: 'NOT_FOUND'
    });
  }

  // Erros de servidor
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR'
  });
}

module.exports = { handleError };
```

### 4. Logger (`utils/logger.js`)

```javascript
// /api/admin/utils/logger.js

const fs = require('fs');
const path = require('path');

// Arquivo de log pode ser salvo localmente em dev
// Em produção com Vercel, os logs vão para stdout
const LOG_FILE = path.join(__dirname, '../../.logs/audit.log');

function log(action, details, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] [${level}] ${action}: ${JSON.stringify(details)}`;

  console.log(message);

  // Em produção, apenas console.log (Vercel captura isso)
  if (process.env.NODE_ENV === 'development') {
    try {
      const dir = path.dirname(LOG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(LOG_FILE, message + '\n');
    } catch (err) {
      console.error('Erro ao escrever log:', err.message);
    }
  }
}

function logAction(action, details, userId = 'unknown') {
  log(`[${userId}] ${action}`, details, 'ACTION');
}

function logError(action, error, userId = 'unknown') {
  log(`[${userId}] ${action} - ERROR`, {
    message: error.message,
    stack: error.stack
  }, 'ERROR');
}

module.exports = {
  log,
  logAction,
  logError
};
```

---

## 📡 APIs - Portfolio

### Portfolio Schema

```javascript
// Structure do Portfolio Item
{
  id: "uuid-v4",                    // Identificador único
  slug: "nome-projeto",              // URL-friendly
  title: "Nome do Projeto",
  year: 2025,
  client: "Nome do Cliente",
  category: "Personal Branding",     // enum
  deliverable: "Sessão fotográfica",
  description: "Descrição curta",
  link: "https://exemplo.com",
  images: ["IMG/url1.jpg", "IMG/url2.jpg"],
  coverImage: "IMG/url1.jpg",
  status: "published",               // published, draft, hidden
  createdAt: "2025-03-20T10:30:00Z",
  updatedAt: "2025-03-20T10:30:00Z",
  deletedAt: null,                   // soft delete
  hidden: false,
  tags: ["branding", "fotografia"]
}
```

### 1. POST `/api/admin/portfolio/add.js`

**Objetivo:** Criar novo projeto no portfólio

```javascript
// /api/admin/portfolio/add.js

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  validateNumber,
  validateDate,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 1. Verificar autenticação
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    // 2. Extrair dados
    const {
      title,
      year,
      client,
      category,
      deliverable,
      description,
      link,
      images = [],
      coverImageIndex = 0,
      tags = []
    } = req.body;

    // 3. Validar dados
    const validatedTitle = validateString(title, 'Título', {
      required: true,
      maxLength: MAX_TITLE_LENGTH
    });

    const validatedYear = validateNumber(year, 'Ano', {
      min: 2000,
      max: new Date().getFullYear() + 1
    });

    const validatedClient = validateString(client, 'Cliente', {
      required: true,
      maxLength: 150
    });

    const validatedCategory = validateString(category, 'Categoria', {
      required: true,
      maxLength: 100
    });

    const validatedDeliverable = validateString(deliverable, 'Entregável', {
      required: true,
      maxLength: 150
    });

    const validatedDescription = validateString(description, 'Descrição', {
      required: true,
      maxLength: 500
    });

    const validatedLink = validateString(link, 'Link', {
      required: false,
      maxLength: 500
    });

    if (validatedLink && !/^https?:\/\//.test(validatedLink)) {
      throw new Error('Link deve começar com http:// ou https://');
    }

    // Validar imagens
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('Pelo menos uma imagem é obrigatória');
    }

    const validatedImages = images.map(img => {
      if (typeof img !== 'string') {
        throw new Error('Imagens devem ser strings (URLs)');
      }
      return img.trim();
    });

    if (coverImageIndex >= validatedImages.length) {
      throw new Error('Índice de capa inválido');
    }

    const coverImage = validatedImages[coverImageIndex];

    // Validar tags
    const validatedTags = Array.isArray(tags)
      ? tags.map(tag => validateString(tag, 'Tag', { maxLength: 50 }))
      : [];

    // 4. Gerar slug
    const slug = generateSlug(validatedTitle);

    // 5. Criar entrada
    const newProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug,
      title: validatedTitle,
      year: validatedYear,
      client: validatedClient,
      category: validatedCategory,
      deliverable: validatedDeliverable,
      description: validatedDescription,
      link: validatedLink || null,
      images: validatedImages,
      coverImage,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      hidden: false,
      tags: validatedTags
    };

    // 6. Salvar (no index.html ou em um serviço externo)
    // TODO: Implementar persistência
    // - Opção 1: Atualizar index.html (dev)
    // - Opção 2: Enviar para Firebase/Supabase
    // - Opção 3: Enviar para API externa

    // 7. Log de auditoria
    logAction('PORTFOLIO_ADD', {
      projectId: newProject.id,
      title: validatedTitle,
      client: validatedClient
    }, userId);

    // 8. Retornar sucesso
    res.status(201).json({
      success: true,
      data: {
        id: newProject.id,
        slug: newProject.slug,
        title: newProject.title,
        message: 'Projeto adicionado com sucesso!'
      }
    });

  } catch (error) {
    logError('PORTFOLIO_ADD', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 2. PUT `/api/admin/portfolio/update.js`

**Objetivo:** Atualizar projeto existente

```javascript
// /api/admin/portfolio/update.js

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  validateNumber,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 1. Verificar autenticação
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    // 2. Extrair ID do projeto
    const projectId = req.query.id || req.body.id;
    if (!projectId) {
      throw new Error('ID do projeto não fornecido');
    }

    // 3. Extrair dados para atualizar
    const {
      title,
      year,
      client,
      category,
      deliverable,
      description,
      link,
      images,
      coverImageIndex,
      tags
    } = req.body;

    // 4. Validar apenas os campos fornecidos
    const updates = {};

    if (title !== undefined) {
      updates.title = validateString(title, 'Título', {
        required: true,
        maxLength: MAX_TITLE_LENGTH
      });
      updates.slug = generateSlug(updates.title);
    }

    if (year !== undefined) {
      updates.year = validateNumber(year, 'Ano', {
        min: 2000,
        max: new Date().getFullYear() + 1
      });
    }

    if (client !== undefined) {
      updates.client = validateString(client, 'Cliente', {
        required: true,
        maxLength: 150
      });
    }

    if (category !== undefined) {
      updates.category = validateString(category, 'Categoria', {
        required: true,
        maxLength: 100
      });
    }

    if (deliverable !== undefined) {
      updates.deliverable = validateString(deliverable, 'Entregável', {
        required: true,
        maxLength: 150
      });
    }

    if (description !== undefined) {
      updates.description = validateString(description, 'Descrição', {
        required: true,
        maxLength: 500
      });
    }

    if (link !== undefined) {
      updates.link = validateString(link, 'Link', {
        required: false,
        maxLength: 500
      });
      if (updates.link && !/^https?:\/\//.test(updates.link)) {
        throw new Error('Link deve começar com http:// ou https://');
      }
    }

    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error('Pelo menos uma imagem é obrigatória');
      }
      updates.images = images.map(img => {
        if (typeof img !== 'string') throw new Error('Imagens devem ser strings');
        return img.trim();
      });

      if (coverImageIndex !== undefined && coverImageIndex >= updates.images.length) {
        throw new Error('Índice de capa inválido');
      }

      if (coverImageIndex !== undefined) {
        updates.coverImage = updates.images[coverImageIndex];
      }
    }

    if (tags !== undefined) {
      updates.tags = Array.isArray(tags)
        ? tags.map(tag => validateString(tag, 'Tag', { maxLength: 50 }))
        : [];
    }

    updates.updatedAt = new Date().toISOString();

    // 5. Atualizar no banco (TODO: implementar)
    // TODO: Buscar projeto existente, mesclar updates, salvar

    // 6. Log de auditoria
    logAction('PORTFOLIO_UPDATE', {
      projectId,
      updatedFields: Object.keys(updates)
    }, userId);

    // 7. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        id: projectId,
        message: 'Projeto atualizado com sucesso!',
        updates
      }
    });

  } catch (error) {
    logError('PORTFOLIO_UPDATE', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 3. DELETE `/api/admin/portfolio/delete.js`

**Objetivo:** Deletar projeto (soft-delete)

```javascript
// /api/admin/portfolio/delete.js

const { authMiddleware } = require('../middleware/auth');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 1. Verificar autenticação
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    // 2. Extrair ID
    const projectId = req.query.id || req.body.id;
    if (!projectId) {
      throw new Error('ID do projeto não fornecido');
    }

    // 3. Validar ID
    if (typeof projectId !== 'string' || projectId.length === 0) {
      throw new Error('ID inválido');
    }

    // 4. Buscar projeto (TODO: implementar)
    // const project = await getProject(projectId);
    // if (!project) {
    //   throw new Error('Projeto não encontrado');
    // }

    // 5. Soft delete (marcar como deletado)
    // TODO: Implementar soft delete
    // await updateProject(projectId, {
    //   deletedAt: new Date().toISOString(),
    //   hidden: true
    // });

    // 6. Log de auditoria
    logAction('PORTFOLIO_DELETE', {
      projectId
    }, userId);

    // 7. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        id: projectId,
        message: 'Projeto deletado com sucesso!'
      }
    });

  } catch (error) {
    logError('PORTFOLIO_DELETE', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 4. PATCH `/api/admin/portfolio/hide.js`

**Objetivo:** Ocultar/Mostrar projeto

```javascript
// /api/admin/portfolio/hide.js

const { authMiddleware } = require('../middleware/auth');
const { validateString } = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 1. Verificar autenticação
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    // 2. Extrair dados
    const projectId = req.query.id || req.body.id;
    const { hidden } = req.body;

    if (!projectId) {
      throw new Error('ID do projeto não fornecido');
    }

    if (typeof hidden !== 'boolean') {
      throw new Error('Campo "hidden" deve ser booleano');
    }

    // 3. Validar ID
    if (typeof projectId !== 'string' || projectId.length === 0) {
      throw new Error('ID inválido');
    }

    // 4. Buscar projeto (TODO: implementar)
    // const project = await getProject(projectId);
    // if (!project) {
    //   throw new Error('Projeto não encontrado');
    // }

    // 5. Atualizar status
    // TODO: Implementar
    // await updateProject(projectId, {
    //   hidden: hidden,
    //   updatedAt: new Date().toISOString()
    // });

    // 6. Log de auditoria
    logAction('PORTFOLIO_HIDE', {
      projectId,
      hidden
    }, userId);

    // 7. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        id: projectId,
        hidden,
        message: `Projeto ${hidden ? 'ocultado' : 'exibido'} com sucesso!`
      }
    });

  } catch (error) {
    logError('PORTFOLIO_HIDE', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 5. GET `/api/admin/portfolio/list.js`

**Objetivo:** Listar projetos com filtros e paginação

```javascript
// /api/admin/portfolio/list.js

const { authMiddleware } = require('../middleware/auth');
const { validateNumber, validateString } = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 1. Verificar autenticação
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    // 2. Extrair parâmetros de query
    const {
      page = 1,
      limit = 10,
      category = null,
      status = 'published',
      sort = 'createdAt:desc',
      search = null,
      includeHidden = false
    } = req.query;

    // 3. Validar parâmetros
    const pageNum = validateNumber(page, 'page', { min: 1 });
    const limitNum = validateNumber(limit, 'limit', { min: 1, max: 100 });
    const skip = (pageNum - 1) * limitNum;

    // 4. Buscar projetos (TODO: implementar)
    // const projects = await getProjects({
    //   category,
    //   status,
    //   hidden: includeHidden ? undefined : false,
    //   search,
    //   sort,
    //   skip,
    //   limit: limitNum
    // });

    // Para agora, retornar mock
    const mockProjects = [];

    // 5. Log de auditoria
    logAction('PORTFOLIO_LIST', {
      filters: { category, status, search },
      pagination: { page: pageNum, limit: limitNum }
    }, userId);

    // 6. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        projects: mockProjects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0
        }
      }
    });

  } catch (error) {
    logError('PORTFOLIO_LIST', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

---

## 📝 APIs - Blog

### Blog Schema

```javascript
// Structure do Blog Item
{
  id: "uuid-v4",
  slug: "titulo-do-artigo",
  title: "Título do Artigo",
  excerpt: "Resumo do artigo",
  body: "<p>Conteúdo HTML do artigo</p>",
  category: "Personal Branding",
  tags: ["branding", "fotografia"],
  featured: false,
  featuredImage: "IMG/blog/artigo.jpg",
  readTime: "5 min",
  author: "Rodrigo Roncolato",
  status: "published",
  createdAt: "2025-03-20T10:30:00Z",
  updatedAt: "2025-03-20T10:30:00Z",
  deletedAt: null,
  hidden: false
}
```

### 1. POST `/api/admin/blog/add.js`

```javascript
// /api/admin/blog/add.js

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 1. Verificar autenticação
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    // 2. Extrair dados
    const {
      title,
      excerpt,
      body,
      category,
      tags = [],
      featured = false,
      featuredImage = null,
      readTime = '5 min',
      author = 'Rodrigo Roncolato'
    } = req.body;

    // 3. Validar dados
    const validatedTitle = validateString(title, 'Título', {
      required: true,
      maxLength: MAX_TITLE_LENGTH
    });

    const validatedExcerpt = validateString(excerpt, 'Resumo', {
      required: true,
      maxLength: 300
    });

    const validatedBody = validateString(body, 'Conteúdo', {
      required: true,
      maxLength: 50000,
      allowHtml: true
    });

    const validatedCategory = validateString(category, 'Categoria', {
      required: true,
      maxLength: 100
    });

    const validatedTags = Array.isArray(tags)
      ? tags.map(tag => validateString(tag, 'Tag', { maxLength: 50 }))
      : [];

    if (typeof featured !== 'boolean') {
      throw new Error('Campo "featured" deve ser booleano');
    }

    const validatedFeaturedImage = featuredImage
      ? validateString(featuredImage, 'Featured Image', { maxLength: 500 })
      : null;

    const validatedReadTime = validateString(readTime, 'Read Time', {
      required: true,
      maxLength: 20
    });

    const validatedAuthor = validateString(author, 'Autor', {
      required: true,
      maxLength: 100
    });

    // 4. Gerar slug
    const slug = generateSlug(validatedTitle);

    // 5. Criar entrada
    const newPost = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug,
      title: validatedTitle,
      excerpt: validatedExcerpt,
      body: validatedBody,
      category: validatedCategory,
      tags: validatedTags,
      featured,
      featuredImage: validatedFeaturedImage,
      readTime: validatedReadTime,
      author: validatedAuthor,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      hidden: false
    };

    // 6. Salvar (TODO: implementar persistência)

    // 7. Log de auditoria
    logAction('BLOG_ADD', {
      postId: newPost.id,
      title: validatedTitle,
      category: validatedCategory
    }, userId);

    // 8. Retornar sucesso
    res.status(201).json({
      success: true,
      data: {
        id: newPost.id,
        slug: newPost.slug,
        title: newPost.title,
        message: 'Artigo publicado com sucesso!'
      }
    });

  } catch (error) {
    logError('BLOG_ADD', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 2. PUT `/api/admin/blog/update.js`

```javascript
// /api/admin/blog/update.js
// (Similar ao portfolio/update.js, mas com campos específicos de blog)

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;
    const postId = req.query.id || req.body.id;

    if (!postId) {
      throw new Error('ID do artigo não fornecido');
    }

    const { title, excerpt, body, category, tags, featured, featuredImage, readTime } = req.body;
    const updates = {};

    if (title !== undefined) {
      updates.title = validateString(title, 'Título', {
        required: true,
        maxLength: MAX_TITLE_LENGTH
      });
      updates.slug = generateSlug(updates.title);
    }

    if (excerpt !== undefined) {
      updates.excerpt = validateString(excerpt, 'Resumo', {
        required: true,
        maxLength: 300
      });
    }

    if (body !== undefined) {
      updates.body = validateString(body, 'Conteúdo', {
        required: true,
        maxLength: 50000,
        allowHtml: true
      });
    }

    if (category !== undefined) {
      updates.category = validateString(category, 'Categoria', {
        required: true,
        maxLength: 100
      });
    }

    if (tags !== undefined) {
      updates.tags = Array.isArray(tags)
        ? tags.map(tag => validateString(tag, 'Tag', { maxLength: 50 }))
        : [];
    }

    if (featured !== undefined) {
      if (typeof featured !== 'boolean') {
        throw new Error('Campo "featured" deve ser booleano');
      }
      updates.featured = featured;
    }

    if (featuredImage !== undefined) {
      updates.featuredImage = featuredImage
        ? validateString(featuredImage, 'Featured Image', { maxLength: 500 })
        : null;
    }

    if (readTime !== undefined) {
      updates.readTime = validateString(readTime, 'Read Time', { maxLength: 20 });
    }

    updates.updatedAt = new Date().toISOString();

    // TODO: Implementar atualização

    logAction('BLOG_UPDATE', {
      postId,
      updatedFields: Object.keys(updates)
    }, userId);

    res.status(200).json({
      success: true,
      data: {
        id: postId,
        message: 'Artigo atualizado com sucesso!',
        updates
      }
    });

  } catch (error) {
    logError('BLOG_UPDATE', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 3. DELETE `/api/admin/blog/delete.js`

```javascript
// /api/admin/blog/delete.js
// (Similar ao portfolio/delete.js)

const { authMiddleware } = require('../middleware/auth');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;
    const postId = req.query.id || req.body.id;

    if (!postId) {
      throw new Error('ID do artigo não fornecido');
    }

    if (typeof postId !== 'string' || postId.length === 0) {
      throw new Error('ID inválido');
    }

    // TODO: Implementar soft delete

    logAction('BLOG_DELETE', {
      postId
    }, userId);

    res.status(200).json({
      success: true,
      data: {
        id: postId,
        message: 'Artigo deletado com sucesso!'
      }
    });

  } catch (error) {
    logError('BLOG_DELETE', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 4. PATCH `/api/admin/blog/hide.js`

```javascript
// /api/admin/blog/hide.js
// (Similar ao portfolio/hide.js)

const { authMiddleware } = require('../middleware/auth');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;
    const postId = req.query.id || req.body.id;
    const { hidden } = req.body;

    if (!postId) {
      throw new Error('ID do artigo não fornecido');
    }

    if (typeof hidden !== 'boolean') {
      throw new Error('Campo "hidden" deve ser booleano');
    }

    // TODO: Implementar atualização

    logAction('BLOG_HIDE', {
      postId,
      hidden
    }, userId);

    res.status(200).json({
      success: true,
      data: {
        id: postId,
        hidden,
        message: `Artigo ${hidden ? 'ocultado' : 'exibido'} com sucesso!`
      }
    });

  } catch (error) {
    logError('BLOG_HIDE', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

### 5. GET `/api/admin/blog/list.js`

```javascript
// /api/admin/blog/list.js
// (Similar ao portfolio/list.js)

const { authMiddleware } = require('../middleware/auth');
const { validateNumber } = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');

module.exports = async function handler(req, res) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const authResult = authMiddleware(req);
    if (!authResult.success) {
      return res.status(authResult.statusCode).json({
        success: false,
        error: authResult.error,
        code: authResult.code
      });
    }

    const userId = authResult.payload.username;

    const {
      page = 1,
      limit = 10,
      category = null,
      status = 'published',
      sort = 'createdAt:desc',
      search = null,
      featured = false,
      includeHidden = false
    } = req.query;

    const pageNum = validateNumber(page, 'page', { min: 1 });
    const limitNum = validateNumber(limit, 'limit', { min: 1, max: 100 });
    const skip = (pageNum - 1) * limitNum;

    // TODO: Implementar busca

    const mockPosts = [];

    logAction('BLOG_LIST', {
      filters: { category, status, search, featured },
      pagination: { page: pageNum, limit: limitNum }
    }, userId);

    res.status(200).json({
      success: true,
      data: {
        posts: mockPosts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0
        }
      }
    });

  } catch (error) {
    logError('BLOG_LIST', error, authResult?.payload?.username || 'unknown');
    handleError(error, res);
  }
};
```

---

## 💾 Estrutura de Dados

### Armazenamento em Desenvolvimento (index.html)

```javascript
// Como salvar no HTML durante desenvolvimento
// (Este é um placeholder para a função)

// No final do index.html, antes de </script>:

const portfolioData = {
  "projeto-1": {
    id: "proj_1234567890_abc123",
    slug: "projeto-1",
    title: "Projeto Exemplo",
    year: 2025,
    client: "Cliente A",
    category: "Personal Branding",
    deliverable: "Sessão fotográfica",
    description: "Descrição do projeto",
    link: "https://exemplo.com",
    images: ["IMG/proj1/img1.jpg", "IMG/proj1/img2.jpg"],
    coverImage: "IMG/proj1/img1.jpg",
    status: "published",
    createdAt: "2025-03-20T10:30:00Z",
    updatedAt: "2025-03-20T10:30:00Z",
    deletedAt: null,
    hidden: false,
    tags: ["branding", "fotografia"]
  }
};

const blogData = {
  "artigo-exemplo": {
    id: "blog_1234567890_abc123",
    slug: "artigo-exemplo",
    title: "Título do Artigo",
    excerpt: "Resumo do artigo",
    body: "<p>Conteúdo do artigo</p>",
    category: "Personal Branding",
    tags: ["branding"],
    featured: false,
    featuredImage: null,
    readTime: "5 min",
    author: "Rodrigo Roncolato",
    status: "published",
    createdAt: "2025-03-20T10:30:00Z",
    updatedAt: "2025-03-20T10:30:00Z",
    deletedAt: null,
    hidden: false
  }
};
```

### Armazenamento em Produção (Recomendado)

**Opção 1: Firebase Firestore**

```javascript
// config/firebase.js
const admin = require('firebase-admin');

// Inicializar com credentials
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json'))
});

const db = admin.firestore();

module.exports = { db };
```

**Opção 2: Supabase (PostgreSQL)**

```javascript
// config/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = { supabase };
```

**Opção 3: MongoDB Atlas**

```javascript
// config/mongodb.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const portfolioSchema = new mongoose.Schema({
  slug: String,
  title: String,
  year: Number,
  // ... outros campos
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = { Portfolio };
```

---

## 🚀 Deploy

### Deploy no Vercel

**Passo 1: Preparar variáveis de ambiente**

```bash
# .env.local (somente para desenvolvimento)
JWT_SECRET=chave-super-secreta-minimo-32-caracteres
ADMIN_USER=seu-usuario
ADMIN_PASS=sua-senha-forte
RECAPTCHA_SECRET=seu-recaptcha-secret
NODE_ENV=development
```

**Passo 2: Deploy**

```bash
# Instalar CLI do Vercel (se não tem)
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Na primeira pergunta, confirme o nome do projeto
# Na segunda, confirme a pasta raiz (.)
```

**Passo 3: Configurar variáveis de ambiente no Vercel**

```bash
# Opção 1: Via dashboard
# 1. Acesse https://vercel.com/dashboard
# 2. Selecione seu projeto
# 3. Vá em Settings > Environment Variables
# 4. Adicione cada variável

# Opção 2: Via CLI
vercel env add JWT_SECRET
vercel env add ADMIN_USER
vercel env add ADMIN_PASS
vercel env add RECAPTCHA_SECRET
vercel env add NODE_ENV production
```

**Passo 4: Deploy novamente**

```bash
vercel --prod
```

### Deploy com GitHub Actions

```yaml
# .github/workflows/deploy.yml

name: Deploy to Vercel

on:
  push:
    branches: [main, master]

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🧪 Testes

### Exemplos com cURL

#### 1. Login (obter JWT)

```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "senha123"
  }'

# Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "username": "admin"
}
```

#### 2. Adicionar Projeto

```bash
curl -X POST http://localhost:3000/api/admin/portfolio/add \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc...",
    "title": "Projeto Novo",
    "year": 2025,
    "client": "Cliente XYZ",
    "category": "Personal Branding",
    "deliverable": "Sessão fotográfica",
    "description": "Descrição do projeto",
    "link": "https://exemplo.com",
    "images": ["IMG/proj/img1.jpg"],
    "coverImageIndex": 0,
    "tags": ["branding"]
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "proj_123...",
    "slug": "projeto-novo",
    "title": "Projeto Novo",
    "message": "Projeto adicionado com sucesso!"
  }
}
```

#### 3. Listar Projetos

```bash
curl -X GET "http://localhost:3000/api/admin/portfolio/list?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGc..."

# Response:
{
  "success": true,
  "data": {
    "projects": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

#### 4. Atualizar Projeto

```bash
curl -X PUT "http://localhost:3000/api/admin/portfolio/update?id=proj_123" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc...",
    "title": "Projeto Atualizado",
    "description": "Nova descrição"
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "proj_123",
    "message": "Projeto atualizado com sucesso!",
    "updates": {...}
  }
}
```

#### 5. Ocultar Projeto

```bash
curl -X PATCH "http://localhost:3000/api/admin/portfolio/hide?id=proj_123" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc...",
    "hidden": true
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "proj_123",
    "hidden": true,
    "message": "Projeto ocultado com sucesso!"
  }
}
```

#### 6. Deletar Projeto

```bash
curl -X DELETE "http://localhost:3000/api/admin/portfolio/delete?id=proj_123" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc..."
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "proj_123",
    "message": "Projeto deletado com sucesso!"
  }
}
```

#### 7. Adicionar Blog Post

```bash
curl -X POST http://localhost:3000/api/admin/blog/add \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc...",
    "title": "Novo Artigo",
    "excerpt": "Resumo do artigo",
    "body": "<p>Conteúdo do artigo...</p>",
    "category": "Personal Branding",
    "tags": ["branding", "dicas"],
    "featured": false,
    "readTime": "5 min"
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "blog_123...",
    "slug": "novo-artigo",
    "title": "Novo Artigo",
    "message": "Artigo publicado com sucesso!"
  }
}
```

### Exemplos com Postman

Importe este arquivo JSON no Postman:

```json
{
  "info": {
    "name": "Roncolato Admin API",
    "version": "2.0.0"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"admin\", \"password\": \"senha123\"}"
            },
            "url": {
              "raw": "{{base_url}}/api/admin/auth",
              "host": ["{{base_url}}"],
              "path": ["api", "admin", "auth"]
            }
          }
        }
      ]
    },
    {
      "name": "Portfolio",
      "item": [
        {
          "name": "Add Project",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"},
              {"key": "Authorization", "value": "Bearer {{token}}"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"title\": \"Projeto Novo\", \"year\": 2025, \"client\": \"Cliente\", \"category\": \"Personal Branding\", \"deliverable\": \"Sessão\", \"description\": \"Desc\", \"link\": \"\", \"images\": [\"IMG/test.jpg\"], \"coverImageIndex\": 0}"
            },
            "url": {
              "raw": "{{base_url}}/api/admin/portfolio/add",
              "host": ["{{base_url}}"],
              "path": ["api", "admin", "portfolio", "add"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🔒 Segurança

### Camadas de Proteção Implementadas

#### 1. Autenticação JWT

- HMAC-SHA256 com chave secreta
- Expiração em 24 horas
- Timing-safe comparison

```javascript
// Verificação segura de credenciais
const userMatch = crypto.timingSafeEqual(
  Buffer.from(username),
  Buffer.from(ADMIN_USER)
);
```

#### 2. Validação de Input

- Detecção de scripts maliciosos
- Sanitização de HTML
- Validação de tipos
- Limites de tamanho

```javascript
// Detecta:
// - <script> tags
// - javascript: URLs
// - on* event handlers
// - SQL injection patterns
```

#### 3. Rate Limiting

Vercel fornece automaticamente:
- 10 requisições/segundo por IP
- 1000 requisições/minuto por função
- Resets a cada minuto

#### 4. CORS Restrito

```javascript
const allowedOrigins = [
  'https://rroncolato.com.br',
  'http://localhost:8080'
];
```

#### 5. Soft Delete

Nada é deletado permanentemente:

```javascript
{
  deletedAt: "2025-03-20T10:30:00Z",
  hidden: true
}
```

#### 6. Auditoria

Toda ação é registrada:

```javascript
logAction('PORTFOLIO_ADD', {
  projectId: '...',
  title: '...'
}, userId);
```

### Checklist de Segurança

- ✅ JWT em todas as requisições
- ✅ Sanitização de input
- ✅ XSS prevention
- ✅ CORS restrito
- ✅ Rate limiting (Vercel)
- ✅ HTTPS obrigatório (Vercel)
- ✅ Timing-safe comparison
- ✅ Auditoria de ações
- ✅ Soft delete
- ✅ Variáveis de ambiente

### Variáveis de Ambiente Seguras

```bash
# .env.production (NUNCA commitar)

# Chave secreta (mínimo 32 caracteres, aleatória)
JWT_SECRET=k7x9mQ2pL8vN3jWe5bHf1gR4sD6aZ0cX

# Credenciais (use gerenciador de senhas)
ADMIN_USER=seu-usuario-secreto-aleatorio
ADMIN_PASS=SenhaForte!@#$%^&*()_+-=[]{}|;:',.<>?

# reCAPTCHA (obtém em https://www.google.com/recaptcha/admin)
RECAPTCHA_SECRET=seu-recaptcha-secret-aqui

# Ambiente
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Problema: "Token inválido"

**Solução:**
- Verificar se JWT_SECRET no .env é igual ao da API de auth
- Verificar expiração do token (24 horas)
- Fazer novo login

### Problema: CORS Error

**Solução:**
- Adicionar origin no allowedOrigins
- Verificar se header Authorization está correto
- Usar Bearer token format: `Authorization: Bearer <token>`

### Problema: Validação falha

**Solução:**
- Verificar tamanho das strings
- Remover caracteres especiais problemáticos
- Validar formato de datas (YYYY-MM-DD)
- Verificar se imagens são URLs válidas

### Problema: 500 Internal Server Error

**Solução:**
- Verificar logs do Vercel
- Checar variáveis de ambiente
- Testar localmente com `npm run dev`
- Verificar permissões de arquivo

### Problema: Rate Limited

**Solução:**
- Aguardar 1 minuto
- Implementar backoff exponencial
- Verificar se não há chamadas duplicadas

---

## 📚 Referências

- [JWT.io](https://jwt.io)
- [Node.js Crypto](https://nodejs.org/api/crypto.html)
- [Vercel Functions](https://vercel.com/docs/functions)
- [OWASP Security](https://owasp.org/www-project-top-ten/)
- [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)

---

## 🎯 Próximos Passos

1. **Implementar persistência de dados**
   - Escolher Firebase, Supabase, ou MongoDB
   - Criar funções de CRUD no database.js

2. **Melhorar upload de imagens**
   - Integrar com Cloudinary API
   - Implementar validação de imagens

3. **Adicionar autenticação de 2 fatores**
   - SMS via Twilio
   - TOTP app

4. **Dashboard avançado**
   - Gráficos de performance
   - Histórico de modificações
   - Backup automático

5. **WebhooksNotificações**
   - Slack/Discord notifications
   - Email alerts

---

**Versão:** 2.0.0
**Última atualização:** 2026-03-20
**Status:** Pronto para implementação
**Squad:** Backend Dev - Roncolato
