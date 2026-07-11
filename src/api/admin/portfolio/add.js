// /api/admin/portfolio/add.js
// POST - Criar novo projeto no portfólio

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  validateNumber,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');
const { createProject } = require('../utils/storage');

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

    // 6. Salvar em JSON
    const savedProject = createProject(newProject);

    // 7. Log de auditoria
    logAction('PORTFOLIO_ADD', {
      projectId: savedProject.id,
      title: validatedTitle,
      client: validatedClient,
      slug
    }, userId);

    // 8. Retornar sucesso
    res.status(201).json({
      success: true,
      data: {
        id: savedProject.id,
        slug: savedProject.slug,
        title: savedProject.title,
        message: 'Projeto adicionado com sucesso!'
      }
    });

  } catch (error) {
    logError('PORTFOLIO_ADD', error, userId);
    handleError(error, res);
  }
};
