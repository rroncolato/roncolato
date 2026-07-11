# Data Integration System - Roncolato Admin to Public Site

## Overview

This system enables automatic synchronization between the admin panel and the public website. Instead of hardcoding data in HTML, all articles and portfolio projects are stored in JSON files (`data/articles.json` and `data/projects.json`), which are dynamically rendered on the public site.

**Current Status:** Articles and projects data migrated to JSON. Dynamic rendering system implemented.

---

## Architecture

### File Structure

```
SITE RONCOLATO/
├── data/
│   ├── articles.json          # Blog articles data
│   ├── projects.json          # Portfolio projects data
├── public/
│   ├── index.html             # Main site (updated to use dynamic rendering)
│   ├── js/
│   │   ├── data-loader.js     # Loads JSON data with caching
│   │   └── data-renderer.js   # Renders content dynamically
├── admin/
│   ├── js/
│   │   └── data-sync.js       # Admin CRUD operations
│   └── api/                   # Backend API endpoints (to be implemented)
```

### Data Flow

```
Admin Panel → data-sync.js → API Endpoint → JSON File Update
                                              ↓
                                        Cache Invalidation
                                              ↓
Public Site ← data-renderer.js ← data-loader.js ← JSON File
```

---

## JSON Data Schema

### articles.json

Each article object contains:

```json
{
  "id": "post1",
  "slug": "article-url-slug",
  "tag": "Personal Branding",
  "date": "15 Jan 2025",
  "title": "Article Title",
  "excerpt": "Short excerpt for listings",
  "readTime": "5 min",
  "image": "/assets/IMG/site/post1-capa.jpg",
  "featured": false,
  "body": "<p>Full HTML content...</p>",
  "createdAt": "2025-01-15",
  "status": "published"
}
```

**Fields:**
- `id`: Unique identifier (e.g., `post1`, `post2`)
- `slug`: URL-safe slug for routing
- `tag`: Category tag (e.g., "Personal Branding", "Equipamento")
- `date`: Display date (e.g., "15 Jan 2025")
- `title`: Article title
- `excerpt`: Short summary for listings
- `readTime`: Estimated reading time (e.g., "5 min")
- `image`: Cover image URL
- `featured`: Boolean for featured article on homepage
- `body`: Full HTML content
- `createdAt`: ISO 8601 date for sorting
- `status`: "published", "draft", "archived"

### projects.json

Each project object contains:

```json
{
  "id": "raro",
  "tag": "Personal Branding",
  "title": "Raro Investimentos",
  "year": "2023",
  "client": "Raro Investimentos",
  "category": "branding",
  "deliverable": "Fotos + Identidade Visual",
  "description": "HTML description...",
  "link": "https://rodrigoroncolato.com.br/2023/10/04/raroinvest/",
  "images": ["/assets/IMG/raro/portifa-raro-01-1024x576.jpg", ...],
  "thumbnail": "/assets/IMG/raro/portifa-raro-01-1024x576.jpg",
  "createdAt": "2023-10-04",
  "status": "published"
}
```

**Fields:**
- `id`: Unique identifier
- `tag`: Project category tag
- `title`: Project name
- `year`: Year completed
- `client`: Client name
- `category`: Filter category (executiva, branding, produto, evento)
- `deliverable`: What was delivered
- `description`: Full project description
- `link`: External link to project
- `images`: Array of image URLs (first is featured)
- `thumbnail`: Primary image for listings
- `createdAt`: Creation date for sorting
- `status`: "published", "draft", "archived"

---

## JavaScript Libraries

### data-loader.js

Loads and caches JSON data from the server.

**Key Methods:**

```javascript
// Initialize data manager
await dataManager.init();

// Load specific data
await dataManager.loadProjects();
await dataManager.loadArticles();

// Get data
dataManager.getProject(id);           // Get single project
dataManager.getArticle(id);           // Get single article
dataManager.getProjectsByCategory(cat); // Filter projects
dataManager.getFeaturedArticles();    // Get featured articles
dataManager.getRecentArticles(limit); // Get recent articles

// Cache management
dataManager.clearCache();              // Force reload from server

// Watch for changes
dataManager.watchForChanges((changes) => {
  console.log('Data updated:', changes);
}, 30000); // Check every 30 seconds
```

**Caching:**
- Default TTL: 1 hour
- Stored in localStorage
- Automatic cache invalidation on admin updates

### data-renderer.js

Dynamically renders content from JSON data.

**Key Methods:**

```javascript
// Render portfolio grid
await renderer.renderPortfolioGrid('portfolio-grid');

// Render blog listings
await renderer.renderBlogList('blog-list');
await renderer.renderFeaturedArticle('blog-featured');
await renderer.renderBlogCategories('blog-categories');
await renderer.renderRecentArticles('blog-recent');

// Render individual post
await renderer.renderBlogPost(postId, 'post-container');

// Modal integration
renderer.populateProjectModal(projectId);
```

### data-sync.js (Admin)

Manages CRUD operations from admin panel.

**Key Methods:**

```javascript
// Projects
await adminSync.createProject(projectData);
await adminSync.updateProject(projectId, projectData);
await adminSync.deleteProject(projectId);

// Articles
await adminSync.createArticle(articleData);
await adminSync.updateArticle(articleId, articleData);
await adminSync.deleteArticle(articleId);

// Validation
adminSync.validateProject(data);
adminSync.validateArticle(data);

// Utilities
adminSync.generateSlug(title);
await adminSync.batchImportProjects(projects);
await adminSync.batchImportArticles(articles);
```

---

## Integration Steps

### Step 1: Include Scripts in HTML

In `public/index.html`, add these scripts before closing `</body>`:

```html
<!-- Data Loading and Rendering -->
<script src="/js/data-loader.js"></script>
<script src="/js/data-renderer.js"></script>

<!-- Your existing scripts -->
<script src="/js/main.js"></script>
```

### Step 2: Update HTML for Dynamic Content

Replace hardcoded sections with containers for dynamic rendering:

**Portfolio Grid:**
```html
<!-- Before: Hardcoded <div class="pitem">... -->

<!-- After: Add container ID -->
<div class="pgrid" id="portfolio-grid">
  <!-- Dynamically populated -->
</div>
```

**Blog Featured Article:**
```html
<div id="blog-featured">
  <!-- Dynamically populated -->
</div>
```

**Blog Post List:**
```html
<div class="blog-list" id="blog-list">
  <!-- Dynamically populated -->
</div>
```

**Blog Categories Sidebar:**
```html
<div class="bside-sec">
  <div class="bside-title">Categorias</div>
  <div id="blog-categories">
    <!-- Dynamically populated -->
  </div>
</div>
```

**Recent Posts Sidebar:**
```html
<div class="brecent" id="blog-recent">
  <!-- Dynamically populated -->
</div>
```

### Step 3: Update Modal Data (Compatibility)

Keep existing modal code. Update `openModal()` function:

```javascript
function openModal(id) {
  // Load data from JSON instead of hardcoded object
  renderer.populateProjectModal(id);
  
  // Existing modal show code
  document.getElementById('modal-bg').classList.add('open');
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
```

---

## Admin Integration

### Setup Backend API

Create API endpoints in your admin backend (`admin/api/`):

**POST /admin/api/articles**
- Create new article
- Input: Article object
- Output: Created article with ID

**PUT /admin/api/articles/:id**
- Update article
- Input: Updated article data
- Output: Updated article object

**DELETE /admin/api/articles/:id**
- Delete article
- Output: Success status

**POST /admin/api/projects**
- Create new project
- Input: Project object
- Output: Created project with ID

**PUT /admin/api/projects/:id**
- Update project
- Input: Updated project data
- Output: Updated project object

**DELETE /admin/api/projects/:id**
- Delete project
- Output: Success status

**POST /admin/api/invalidate-cache**
- Clear public site cache
- Input: Event type and data
- Output: Cache cleared status

### Admin Form Example

```html
<form id="article-form">
  <input type="text" name="title" placeholder="Article Title" required>
  <input type="text" name="slug" placeholder="URL Slug" required>
  <input type="date" name="date" required>
  <select name="tag">
    <option value="Personal Branding">Personal Branding</option>
    <option value="Equipamento">Equipamento</option>
  </select>
  <textarea name="excerpt" placeholder="Short excerpt"></textarea>
  <textarea name="body" placeholder="Full content" required></textarea>
  <input type="text" name="readTime" placeholder="5 min" required>
  <input type="file" name="image" accept="image/*">
  <button type="submit">Publish Article</button>
</form>

<script>
document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const articleData = Object.fromEntries(formData);
  
  try {
    await adminSync.createArticle(articleData);
    alert('Article published successfully!');
    e.target.reset();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
</script>
```

---

## Real-Time Updates

### Client-Side Polling

The `dataManager.watchForChanges()` method polls the server every 30 seconds:

```javascript
// Enable in public site
dataManager.watchForChanges((changes) => {
  if (changes.articles) {
    // Re-render blog sections
    renderer.renderBlogList('blog-list');
    renderer.renderFeaturedArticle('blog-featured');
  }
  if (changes.projects) {
    // Re-render portfolio
    renderer.renderPortfolioGrid('portfolio-grid');
  }
});
```

### Production Enhancement: WebSocket

For real-time updates, implement WebSocket:

```javascript
// In data-sync.js
const ws = new WebSocket('wss://yoursite.com/ws/data-updates');

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  
  if (type === 'article-updated') {
    renderer.renderBlogList('blog-list');
  } else if (type === 'project-updated') {
    renderer.renderPortfolioGrid('portfolio-grid');
  }
};
```

---

## Migration from Hardcoded Data

### Export Existing Data

```javascript
// Extract hardcoded data to JSON format
const existingCases = cases; // From index.html
const existingPosts = posts; // From index.html

// Convert to JSON format
const projectsData = Object.entries(existingCases).map(([id, data]) => ({
  id,
  ...data
}));

const articlesData = Object.entries(existingPosts).map(([id, data]) => ({
  id,
  ...data
}));

// Copy to JSON files
console.log(JSON.stringify({ projects: projectsData }, null, 2));
console.log(JSON.stringify({ articles: articlesData }, null, 2));
```

**Status:** Already completed. Data migrated to `/data/articles.json` and `/data/projects.json`.

---

## Testing

### Test in Browser Console

```javascript
// Test data loading
await dataManager.loadProjects();
console.log(dataManager.projects);

// Test specific get
console.log(dataManager.getProject('raro'));

// Test rendering
await renderer.renderPortfolioGrid('portfolio-grid');

// Test article retrieval
console.log(dataManager.getArticle('post1'));
```

### Test Admin Sync

```javascript
// Test validation
adminSync.validateProject({
  id: 'test',
  title: 'Test Project',
  client: 'Test Client',
  category: 'branding'
});

// Test slug generation
console.log(adminSync.generateSlug('My New Project'));
```

---

## Benefits

1. **Dynamic Content**: Add/edit articles and projects without touching HTML
2. **Scalability**: Works with any number of items
3. **Caching**: Reduces server load with intelligent cache
4. **Real-Time Updates**: Option for WebSocket integration
5. **Admin Integration**: Ready-made CRUD system for admin panel
6. **SEO Friendly**: All content indexed by search engines
7. **Mobile Responsive**: Same data structure across all breakpoints
8. **Data Consistency**: Single source of truth for all content

---

## Future Enhancements

1. **Database Integration**: Replace JSON with database for large sites
2. **Image Upload Handler**: Auto-optimize images on upload
3. **Search Index**: Full-text search for articles
4. **Analytics**: Track article views and engagement
5. **Draft/Schedule**: Queue articles for future publishing
6. **Categories Management**: Dynamic category creation
7. **Comments System**: Reader comments on articles
8. **Social Share**: Auto-generate preview images for sharing

---

## Troubleshooting

### Data Not Loading

```javascript
// Check if files exist
fetch('/data/articles.json')
  .then(r => r.json())
  .then(data => console.log('Loaded:', data))
  .catch(e => console.error('Not found:', e));
```

### Cache Issues

```javascript
// Clear all cache
localStorage.clear();

// Or specific cache
dataManager.clearCache();

// Then reload
location.reload();
```

### Rendering Not Working

```javascript
// Check if renderer initialized
console.log(renderer);

// Check if containers exist
console.log(document.getElementById('blog-list'));

// Manual render
await renderer.renderBlogList('blog-list');
```

---

## Support

For questions or issues:
1. Check console for error messages: `F12` → Console tab
2. Verify JSON file syntax: `data/articles.json` and `data/projects.json`
3. Check that scripts are loaded: `F12` → Network tab
4. Verify container IDs match in HTML and JavaScript

---

**Last Updated:** 2026-05-16
**System Status:** Ready for integration
**Next Step:** Connect HTML containers and test rendering
