// /api/admin/portfolio/update.js
// PATCH - Atualizar projeto existente

const { authMiddleware } = require('../middleware/auth');
const {
  validateString,
  validateNumber,
  generateSlug,
  MAX_TITLE_LENGTH
} = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');
const { updateProject, getProject } = require('../utils/storage');

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

    // 2. Extrair slug do projeto
    const slug = req.body.slug || req.query.slug;
    if (!slug) {
      throw new Error('Slug do projeto não fornecido');
    }

    // 3. Verificar se projeto existe
    const existing = getProject(slug);
    if (!existing) {
      throw new Error('Projeto não encontrado');
    }

    // 4. Extrair dados para atualizar
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

    // 5. Validar apenas os campos fornecidos
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

    // 6. Atualizar no storage
    const updatedProject = updateProject(slug, updates);

    // 7. Log de auditoria
    logAction('PORTFOLIO_UPDATE', {
      projectSlug: slug,
      updatedFields: Object.keys(updates)
    }, userId);

    // 8. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        slug: updatedProject.slug,
        title: updatedProject.title,
        message: 'Projeto atualizado com sucesso!',
        updates
      }
    });

  } catch (error) {
    logError('PORTFOLIO_UPDATE', error, userId);
    handleError(error, res);
  }
};
