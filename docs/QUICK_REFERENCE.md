# Quick Reference - Data Integration System

## File Locations

```
/data/articles.json              # Blog articles (8 items)
/data/projects.json              # Portfolio projects (8 items)
/public/index.html               # Main site (needs updates)
/public/js/data-loader.js        # Data loading library
/public/js/data-renderer.js      # Dynamic rendering
/admin/js/data-sync.js           # Admin CRUD operations
/admin/api/example-endpoints.js  # Backend API example
```

## HTML Changes Required

### 1. Add Scripts to index.html

Before `</body>`:
```html
<script src="/js/data-loader.js"></script>
<script src="/js/data-renderer.js"></script>
```

### 2. Update Container IDs

| Find | Replace With |
|------|--------------|
| `<div class="pgrid">` | `<div class="pgrid" id="portfolio-grid">` |
| `<div class="blog-list">` | `<div class="blog-list" id="blog-list">` |
| `<div class="blog-featured">` | `<div id="blog-featured">` |
| Categories container | `<div id="blog-categories">` |
| Recent posts container | `<div class="brecent" id="blog-recent">` |

### 3. Update Function

```javascript
// OLD
function openModal(id){
  const c=cases[id]; if(!c) return;
  // ... lots of code
}

// NEW
function openModal(id){
  renderer.populateProjectModal(id);
  document.getElementById('modal-bg').classList.add('open');
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow='hidden';
}
```

### 4. Remove Objects

Delete these entire objects from index.html:
- `const cases = { ... }`
- `const posts = { ... }`

## JavaScript API

### Load Data
```javascript
await dataManager.init();           // Load all data
await dataManager.loadProjects();  // Load projects only
await dataManager.loadArticles();  // Load articles only
```

### Get Data
```javascript
dataManager.getProject('raro')     // Single project
dataManager.getArticle('post1')    // Single article
dataManager.getProjectsByCategory('branding')
dataManager.getFeaturedArticles()
dataManager.getRecentArticles(3)
dataManager.getArticlesByTagCount()
```

### Render Content
```javascript
await renderer.renderPortfolioGrid('portfolio-grid')
await renderer.renderBlogList('blog-list')
await renderer.renderFeaturedArticle('blog-featured')
await renderer.renderBlogCategories('blog-categories')
await renderer.renderRecentArticles('blog-recent')
await renderer.renderBlogPost('post1', 'container-id')
renderer.populateProjectModal('raro')
```

### Cache Management
```javascript
dataManager.clearCache()           // Force reload
dataManager.setCache('key', data)  // Manual cache
dataManager.getCache('key')        // Get cache
dataManager.watchForChanges(callback, 30000) // Poll every 30s
```

## Admin Operations

```javascript
// Create
await adminSync.createArticle({
  id: 'post9',
  title: 'New Article',
  slug: 'new-article',
  tag: 'Personal Branding',
  date: new Date().toLocaleDateString(),
  excerpt: 'Short summary',
  readTime: '5 min',
  body: '<p>Content...</p>',
  image: '/assets/IMG/site/cover.jpg'
});

// Update
await adminSync.updateArticle('post1', {
  title: 'Updated Title',
  body: '<p>New content...</p>'
});

// Delete
await adminSync.deleteArticle('post1');

// Same for projects
await adminSync.createProject({ ... });
await adminSync.updateProject('raro', { ... });
await adminSync.deleteProject('raro');
```

## Data Schema

### Article Object
```json
{
  "id": "post1",
  "slug": "article-url",
  "tag": "Personal Branding",
  "date": "15 Jan 2025",
  "title": "Article Title",
  "excerpt": "Short summary",
  "readTime": "5 min",
  "image": "/assets/IMG/site/cover.jpg",
  "featured": false,
  "body": "<p>Full HTML content...</p>",
  "createdAt": "2025-01-15",
  "status": "published"
}
```

### Project Object
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
  "link": "https://...",
  "images": ["/assets/IMG/..."],
  "thumbnail": "/assets/IMG/...",
  "createdAt": "2023-10-04",
  "status": "published"
}
```

## Console Testing

```javascript
// Test loading
await dataManager.init()
console.log(dataManager.projects.length)  // Should show: 8
console.log(dataManager.articles.length)  // Should show: 8

// Test get
console.log(dataManager.getProject('raro'))
console.log(dataManager.getArticle('post1'))

// Test render
await renderer.renderPortfolioGrid('portfolio-grid')
await renderer.renderBlogList('blog-list')

// Check cache
console.log(localStorage.getItem('roncolato_data_cache_projects'))
```

## Common Issues

### Data Not Showing

```javascript
// Check if data loaded
console.log(dataManager.projects)      // Should not be empty
console.log(dataManager.articles)      // Should not be empty

// Check containers exist
console.log(document.getElementById('portfolio-grid'))  // Should not be null
```

### Modal Doesn't Work

```javascript
// Check project exists
console.log(dataManager.getProject('raro'))  // Should show project

// Test manually
renderer.populateProjectModal('raro')
openModal('raro')
```

### Cache Issues

```javascript
// Clear cache
localStorage.removeItem('roncolato_data_cache_projects')
localStorage.removeItem('roncolato_data_cache_articles')
location.reload()

// Or use method
dataManager.clearCache()
location.reload()
```

## File Sizes

| File | Size | Compressed |
|------|------|-----------|
| articles.json | 45 KB | ~12 KB |
| projects.json | 65 KB | ~18 KB |
| data-loader.js | 3.5 KB | ~1.2 KB |
| data-renderer.js | 4.2 KB | ~1.5 KB |
| **Total** | **~118 KB** | **~33 KB** |

## Performance Checklist

- [ ] No console errors (F12 → Console)
- [ ] Data loads in <500ms
- [ ] Render completes in <200ms
- [ ] Cache hits use <50ms (localStorage)
- [ ] Images load optimized
- [ ] No memory leaks (DevTools)

## Browser Support

✓ Chrome/Edge 90+
✓ Firefox 88+
✓ Safari 14+
✓ Mobile browsers (iOS Safari, Chrome Mobile)

Uses:
- Fetch API
- localStorage
- ES6 async/await
- Standard DOM APIs

## Deployment Checklist

- [ ] All scripts added to HTML
- [ ] All container IDs correct
- [ ] openModal() updated
- [ ] Hardcoded objects removed
- [ ] No console errors
- [ ] Portfolio loads correctly
- [ ] Blog loads correctly
- [ ] Modal works
- [ ] Mobile responsive
- [ ] Backend API ready
- [ ] Cache invalidation working
- [ ] Admin panel functional

## Database Migration Query

```sql
-- Insert existing data
INSERT INTO articles (id, slug, title, excerpt, tag, date, readTime, image, body, featured, createdAt, status)
SELECT id, slug, title, excerpt, tag, date, readTime, image, body, featured, createdAt, status
FROM (SELECT * FROM articles_json) AS j;
```

## API Endpoints (Backend)

```
GET    /admin/api/articles           Get all articles
GET    /admin/api/articles/:id       Get single article
POST   /admin/api/articles           Create article
PUT    /admin/api/articles/:id       Update article
DELETE /admin/api/articles/:id       Delete article

GET    /admin/api/projects           Get all projects
GET    /admin/api/projects/:id       Get single project
POST   /admin/api/projects           Create project
PUT    /admin/api/projects/:id       Update project
DELETE /admin/api/projects/:id       Delete project

POST   /admin/api/invalidate-cache   Clear cache
GET    /admin/api/stats              Get statistics
```

## Categories & Tags

**Project Categories:**
- branding
- executiva
- produto
- evento

**Article Tags:**
- Personal Branding
- Fotografia Executiva
- Behind the Scenes
- Equipamento
- Mercado

## Quick Commands

```bash
# Clear all browser cache
# F12 → Application → Storage → Clear site data

# Test API locally (curl)
curl http://localhost:3000/admin/api/articles

# Watch JSON files
watch -n 1 cat data/articles.json
```

## Help Resources

1. **Full Guide:** `DATA_INTEGRATION_GUIDE.md`
2. **Setup:** `SETUP_INSTRUCTIONS.md`
3. **Summary:** `IMPLEMENTATION_SUMMARY.md`
4. **Code:** See comments in JS files

## Contact Info

Questions? Check the documentation files first. Most answers are in:
- Troubleshooting section
- JavaScript comments
- Code examples

---

**Last Updated:** 2026-05-16
**Status:** Ready to integrate
**Time to Deploy:** 4-6 hours
