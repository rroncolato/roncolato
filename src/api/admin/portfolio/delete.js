// /api/admin/portfolio/delete.js
// DELETE - Deletar projeto (soft delete)

const { authMiddleware } = require('../middleware/auth');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');
const { deleteProject, getProject } = require('../utils/storage');

function setCorsHeaders(res, origin) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') {
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

    // 2. Extrair slug
    const slug = req.body.slug || req.query.slug;
    if (!slug) {
      throw new Error('Slug do projeto não fornecido');
    }

    // 3. Validar slug
    if (typeof slug !== 'string' || slug.length === 0) {
      throw new Error('Slug inválido');
    }

    // 4. Verificar se projeto existe
    const project = getProject(slug);
    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    // 5. Soft delete
    deleteProject(slug);

    // 6. Log de auditoria
    logAction('PORTFOLIO_DELETE', {
      projectSlug: slug,
      projectTitle: project.title
    }, userId);

    // 7. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        slug,
        message: 'Projeto deletado com sucesso!'
      }
    });

  } catch (error) {
    logError('PORTFOLIO_DELETE', error, userId);
    handleError(error, res);
  }
};
