// /api/admin/blog/update.js
// PATCH - Atualizar artigo existente

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');
const { updateArticle, getArticle } = require('../utils/storage');

function setCorsHeaders(res, origin) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  let userId = 'unknown';

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

    userId = authResult.payload.username;

    // 2. Extrair slug do artigo
    const slug = req.body.slug || req.query.slug;
    if (!slug) {
      throw new Error('Slug do artigo não fornecido');
    }

    // 3. Verificar se artigo existe
    const existing = getArticle(slug);
    if (!existing) {
      throw new Error('Artigo não encontrado');
    }

    // 4. Extrair dados para atualizar
    const {
      title,
      excerpt,
      body,
      category,
      tags,
      featured,
      featuredImage,
      readTime
    } = req.body;

    // 5. Validar apenas os campos fornecidos
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

    // 6. Atualizar no storage
    const updatedArticle = updateArticle(slug, updates);

    // 7. Log de auditoria
    logAction('BLOG_UPDATE', {
      articleSlug: slug,
      updatedFields: Object.keys(updates)
    }, userId);

    // 8. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        slug: updatedArticle.slug,
        title: updatedArticle.title,
        message: 'Artigo atualizado com sucesso!',
        updates
      }
    });

  } catch (error) {
    logError('BLOG_UPDATE', error, userId);
    handleError(error, res);
  }
};
