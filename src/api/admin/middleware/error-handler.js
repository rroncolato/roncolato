// /api/admin/middleware/error-handler.js
// Tratamento centralizado de erros

function handleError(error, res) {
  console.error('[ERROR]', error.message);

  // Erros de validação
  if (error.message.includes('inválido') ||
      error.message.includes('obrigatório') ||
      error.message.includes('não pode') ||
      error.message.includes('deve ser') ||
      error.message.includes('não encontrado')) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erros de autenticação
  if (error.message.includes('Token') ||
      error.message.includes('autorizado') ||
      error.message.includes('credentials')) {
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
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}

module.exports = { handleError };
