// /api/admin/middleware/validate.js
// Validação e sanitização de inputs

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
