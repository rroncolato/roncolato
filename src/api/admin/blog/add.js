// /api/admin/blog/add.js
// POST - Criar novo artigo no blog

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');
const { createArticle } = require('../utils/storage');

function setCorsHeaders(res, origin) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
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

    // 6. Salvar em JSON
    const savedPost = createArticle(newPost);

    // 7. Log de auditoria
    logAction('BLOG_ADD', {
      postId: savedPost.id,
      title: validatedTitle,
      category: validatedCategory,
      slug
    }, userId);

    // 8. Retornar sucesso
    res.status(201).json({
      success: true,
      data: {
        id: savedPost.id,
        slug: savedPost.slug,
        title: savedPost.title,
        message: 'Artigo publicado com sucesso!'
      }
    });

  } catch (error) {
    logError('BLOG_ADD', error, userId);
    handleError(error, res);
  }
};
