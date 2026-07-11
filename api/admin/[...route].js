import crypto from 'crypto';

// For local development, use filesystem. For Vercel, use environment variable storage.
const IS_VERCEL = !!process.env.VERCEL;
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'senha123';

// In-memory cache for Vercel (can be moved to external DB for persistence)
let articlesCache = null;
let projectsCache = null;

async function getArticles() {
  if (IS_VERCEL) {
    if (!articlesCache) {
      try {
        articlesCache = JSON.parse(process.env.ARTICLES_DATA || '[]');
      } catch {
        articlesCache = [];
      }
    }
    return articlesCache;
  } else {
    // Local filesystem fallback for development
    const fs = await import('fs').then(m => m.default);
    const path = await import('path').then(m => m.default);
    const articlesFile = path.join(process.cwd(), 'data', 'articles.json');
    try {
      if (fs.existsSync(articlesFile)) {
        const data = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));
        return Array.isArray(data) ? data : (data.articles || []);
      }
    } catch {
      return [];
    }
    return [];
  }
}

async function saveArticles(articles) {
  if (IS_VERCEL) {
    articlesCache = articles;
    // Note: To persist, you'll need to implement saving to a database or Vercel Blob storage
    // For now, data is stored in memory during the serverless function lifetime
  } else {
    const fs = await import('fs').then(m => m.default);
    const path = await import('path').then(m => m.default);
    const dataDir = path.join(process.cwd(), 'data');
    const fs_module = fs;
    if (!fs_module.existsSync(dataDir)) fs_module.mkdirSync(dataDir, { recursive: true });
    const articlesFile = path.join(dataDir, 'articles.json');
    fs_module.writeFileSync(articlesFile, JSON.stringify(articles, null, 2));
  }
}

async function getProjects() {
  if (IS_VERCEL) {
    if (!projectsCache) {
      try {
        projectsCache = JSON.parse(process.env.PROJECTS_DATA || '[]');
      } catch {
        projectsCache = [];
      }
    }
    return projectsCache;
  } else {
    const fs = await import('fs').then(m => m.default);
    const path = await import('path').then(m => m.default);
    const projectsFile = path.join(process.cwd(), 'data', 'projects.json');
    try {
      if (fs.existsSync(projectsFile)) {
        const data = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
        return Array.isArray(data) ? data : (data.projects || []);
      }
    } catch {
      return [];
    }
    return [];
  }
}

async function saveProjects(projects) {
  if (IS_VERCEL) {
    projectsCache = projects;
    // Note: To persist, you'll need to implement saving to a database or Vercel Blob storage
  } else {
    const fs = await import('fs').then(m => m.default);
    const path = await import('path').then(m => m.default);
    const dataDir = path.join(process.cwd(), 'data');
    const fs_module = fs;
    if (!fs_module.existsSync(dataDir)) fs_module.mkdirSync(dataDir, { recursive: true });
    const projectsFile = path.join(dataDir, 'projects.json');
    fs_module.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
  }
}

// ==========================================
// JWT UTILITIES
// ==========================================

function signJWT(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
  }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const token = header + '.' + body;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(token)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return token + '.' + signature;
}

// ==========================================
// HANDLERS
// ==========================================

async function handleAuth(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { username, password } = body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signJWT({ username });
    return res.status(200).json({
      success: true,
      token,
      username
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function handleListArticles(req, res) {
  try {
    const articles = await getArticles();
    return res.status(200).json({ articles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleListProjects(req, res) {
  try {
    const projects = await getProjects();
    return res.status(200).json({ projects });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleAddArticle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { title, excerpt, content, tag, date, readTime, image } = body;

    if (!title || !excerpt || !content || !tag) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    let articles = await getArticles();

    const newArticle = {
      id: Date.now().toString(),
      slug,
      title,
      excerpt,
      content,
      tag,
      date,
      readTime: readTime || '5 min',
      image: image || null,
      createdAt: new Date().toISOString()
    };

    articles.push(newArticle);
    await saveArticles(articles);

    return res.status(201).json({ success: true, article: newArticle });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleUpdateArticle(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { slug, title, excerpt, content, tag, date, readTime, image } = body;

    if (!slug) {
      return res.status(400).json({ error: 'Slug required' });
    }

    let articles = await getArticles();
    const index = articles.findIndex(a => a.slug === slug);
    if (index === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }

    articles[index] = {
      ...articles[index],
      ...(title && { title }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(tag && { tag }),
      ...(date && { date }),
      ...(readTime && { readTime }),
      ...(image !== undefined && { image }),
      updatedAt: new Date().toISOString()
    };

    await saveArticles(articles);
    return res.status(200).json({ success: true, article: articles[index] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleAddProject(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { title, client, category, year, deliverable, description, link, images } = body;

    if (!title || !client || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    let projects = await getProjects();

    const newProject = {
      id: Date.now().toString(),
      slug,
      title,
      client,
      category,
      year,
      deliverable,
      description,
      link: link || null,
      images: images ? (typeof images === 'string' ? images.split(',').map(i => i.trim()) : images) : [],
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    await saveProjects(projects);

    return res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleUpdateProject(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { slug, title, client, category, year, deliverable, description, link, images } = body;

    if (!slug) {
      return res.status(400).json({ error: 'Slug required' });
    }

    let projects = await getProjects();
    const index = projects.findIndex(p => p.slug === slug);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projects[index] = {
      ...projects[index],
      ...(title && { title }),
      ...(client && { client }),
      ...(category && { category }),
      ...(year && { year }),
      ...(deliverable && { deliverable }),
      ...(description && { description }),
      ...(link !== undefined && { link }),
      ...(images && { images: typeof images === 'string' ? images.split(',').map(i => i.trim()) : images }),
      updatedAt: new Date().toISOString()
    };

    await saveProjects(projects);
    return res.status(200).json({ success: true, project: projects[index] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==========================================
// MAIN HANDLER
// ==========================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const route = req.query.route ? req.query.route.join('/') : '';

  // Parse JSON body
  let body = {};
  if (req.method !== 'GET' && req.body) {
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      body = req.body;
    }
  }

  switch (route) {
    case 'auth':
      return handleAuth({ ...req, body }, res);
    case 'list-articles.js':
    case 'list-articles':
      return handleListArticles(req, res);
    case 'list-projects.js':
    case 'list-projects':
      return handleListProjects(req, res);
    case 'add-article':
      return handleAddArticle({ ...req, body }, res);
    case 'update-article':
      return handleUpdateArticle({ ...req, body }, res);
    case 'add-project':
      return handleAddProject({ ...req, body }, res);
    case 'update-project':
      return handleUpdateProject({ ...req, body }, res);
    default:
      return res.status(404).json({ error: 'Endpoint not found' });
  }
}
