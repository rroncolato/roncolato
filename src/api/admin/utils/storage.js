// /api/admin/utils/storage.js
// JSON-based storage for articles and projects

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../data');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Ensure JSON files exist
function ensureFiles() {
  ensureDataDir();

  const files = {
    projects: path.join(DATA_DIR, 'projects.json'),
    articles: path.join(DATA_DIR, 'articles.json')
  };

  if (!fs.existsSync(files.projects)) {
    fs.writeFileSync(files.projects, JSON.stringify({ data: {} }, null, 2));
  }

  if (!fs.existsSync(files.articles)) {
    fs.writeFileSync(files.articles, JSON.stringify({ data: {} }, null, 2));
  }

  return files;
}

// ==========================================
// PORTFOLIO OPERATIONS
// ==========================================

function getProjectsData() {
  ensureFiles();
  const filePath = path.join(DATA_DIR, 'projects.json');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return { data: {} };
  }
}

function saveProjectsData(data) {
  ensureFiles();
  const filePath = path.join(DATA_DIR, 'projects.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getProject(slug) {
  const data = getProjectsData();
  return data.data[slug] || null;
}

function createProject(projectData) {
  const data = getProjectsData();
  const slug = projectData.slug;

  if (data.data[slug]) {
    throw new Error('Projeto com este slug já existe');
  }

  data.data[slug] = {
    ...projectData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hidden: false,
    status: 'published'
  };

  saveProjectsData(data);
  return data.data[slug];
}

function updateProject(slug, updates) {
  const data = getProjectsData();
  const project = data.data[slug];

  if (!project) {
    throw new Error('Projeto não encontrado');
  }

  data.data[slug] = {
    ...project,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveProjectsData(data);
  return data.data[slug];
}

function deleteProject(slug) {
  const data = getProjectsData();
  const project = data.data[slug];

  if (!project) {
    throw new Error('Projeto não encontrado');
  }

  // Soft delete
  data.data[slug] = {
    ...project,
    deleted: true,
    deletedAt: new Date().toISOString(),
    hidden: true,
    updatedAt: new Date().toISOString()
  };

  saveProjectsData(data);
}

function listProjects(filters = {}) {
  const data = getProjectsData();
  let projects = Object.values(data.data || {});

  // Filter out soft-deleted items
  projects = projects.filter(p => !p.deleted);

  // Filter by category
  if (filters.category) {
    projects = projects.filter(p => p.category === filters.category);
  }

  // Filter by hidden status
  if (!filters.includeHidden) {
    projects = projects.filter(p => !p.hidden);
  }

  // Search
  if (filters.search) {
    const search = filters.search.toLowerCase();
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.client.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  // Sort
  if (filters.sort === 'createdAt:asc') {
    projects.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (filters.sort === 'createdAt:desc') {
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (filters.sort === 'year:asc') {
    projects.sort((a, b) => a.year - b.year);
  } else if (filters.sort === 'year:desc') {
    projects.sort((a, b) => b.year - a.year);
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;
  const total = projects.length;
  const paginatedProjects = projects.slice(skip, skip + limit);

  return {
    projects: paginatedProjects,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// ==========================================
// ARTICLES OPERATIONS
// ==========================================

function getArticlesData() {
  ensureFiles();
  const filePath = path.join(DATA_DIR, 'articles.json');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return { data: {} };
  }
}

function saveArticlesData(data) {
  ensureFiles();
  const filePath = path.join(DATA_DIR, 'articles.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getArticle(slug) {
  const data = getArticlesData();
  return data.data[slug] || null;
}

function createArticle(articleData) {
  const data = getArticlesData();
  const slug = articleData.slug;

  if (data.data[slug]) {
    throw new Error('Artigo com este slug já existe');
  }

  data.data[slug] = {
    ...articleData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hidden: false,
    status: 'published'
  };

  saveArticlesData(data);
  return data.data[slug];
}

function updateArticle(slug, updates) {
  const data = getArticlesData();
  const article = data.data[slug];

  if (!article) {
    throw new Error('Artigo não encontrado');
  }

  data.data[slug] = {
    ...article,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveArticlesData(data);
  return data.data[slug];
}

function deleteArticle(slug) {
  const data = getArticlesData();
  const article = data.data[slug];

  if (!article) {
    throw new Error('Artigo não encontrado');
  }

  // Soft delete
  data.data[slug] = {
    ...article,
    deleted: true,
    deletedAt: new Date().toISOString(),
    hidden: true,
    updatedAt: new Date().toISOString()
  };

  saveArticlesData(data);
}

function listArticles(filters = {}) {
  const data = getArticlesData();
  let articles = Object.values(data.data || {});

  // Filter out soft-deleted items
  articles = articles.filter(a => !a.deleted);

  // Filter by category
  if (filters.category) {
    articles = articles.filter(a => a.category === filters.category);
  }

  // Filter by featured
  if (filters.featured !== undefined) {
    articles = articles.filter(a => a.featured === filters.featured);
  }

  // Filter by hidden status
  if (!filters.includeHidden) {
    articles = articles.filter(a => !a.hidden);
  }

  // Search
  if (filters.search) {
    const search = filters.search.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.excerpt.toLowerCase().includes(search) ||
      (a.body && a.body.toLowerCase().includes(search))
    );
  }

  // Sort
  if (filters.sort === 'createdAt:asc') {
    articles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (filters.sort === 'createdAt:desc') {
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;
  const total = articles.length;
  const paginatedArticles = articles.slice(skip, skip + limit);

  return {
    articles: paginatedArticles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

module.exports = {
  // Projects
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listProjects,

  // Articles
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  listArticles
};
