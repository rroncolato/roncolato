// /api/admin/portfolio/list.js
// GET - Listar projetos com filtros e paginação

const { authMiddleware } = require('../middleware/auth');
const { validateNumber } = require('../middleware/validate');
const { handleError } = require('../middleware/error-handler');
const { logAction, logError } = require('../utils/logger');
const { listProjects } = require('../utils/storage');

function setCorsHeaders(res, origin) {
  const allowedOrigins = [
    'https://rroncolato.com.br',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
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

    // 4. Buscar projetos do storage
    const result = listProjects({
      page: pageNum,
      limit: limitNum,
      category: category || undefined,
      search: search || undefined,
      sort: sort || 'createdAt:desc',
      includeHidden: includeHidden === 'true' || includeHidden === true
    });

    // 5. Log de auditoria
    logAction('PORTFOLIO_LIST', {
      filters: { category, status, search },
      pagination: { page: pageNum, limit: limitNum },
      resultsCount: result.projects.length
    }, userId);

    // 6. Retornar sucesso
    res.status(200).json({
      success: true,
      data: {
        projects: result.projects,
        pagination: result.pagination
      }
    });

  } catch (error) {
    logError('PORTFOLIO_LIST', error, userId);
    handleError(error, res);
  }
};
