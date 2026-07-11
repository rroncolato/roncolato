# Setup Instructions - Data Integration System

## Quick Start (15 minutes)

### Step 1: Verify Files Exist

Check that these files are in place:

```
c:\Users\rodri\Downloads\SITE RONCOLATO\
├── data/
│   ├── articles.json       ✓ Created
│   └── projects.json       ✓ Created
├── public/
│   ├── js/
│   │   ├── data-loader.js        ✓ Created
│   │   └── data-renderer.js      ✓ Created
│   └── index.html          (needs updating)
└── admin/
    └── js/
        └── data-sync.js          ✓ Created
```

### Step 2: Update public/index.html

Open `public/index.html` and:

1. **Find where scripts are loaded** (near end of file, before `</body>`):

```html
</body>
</html>
```

2. **Add these scripts BEFORE `</body>`** (in this order):

```html
<!-- Data Loading and Rendering System -->
<script src="/js/data-loader.js"></script>
<script src="/js/data-renderer.js"></script>

</body>
</html>
```

### Step 3: Update Portfolio Grid Container

Find the portfolio section with hardcoded cases:

```html
<!-- FIND THIS -->
<div class="pgrid">
  <div class="pitem" data-cat="branding" onclick="openModal('raro')">
    <!-- ... hardcoded content ... -->
  </div>
  <!-- ... more hardcoded pitem divs ... -->
</div>
```

Replace with container ID:

```html
<!-- REPLACE WITH THIS -->
<div class="pgrid" id="portfolio-grid">
  <!-- Dynamically populated by data-renderer.js -->
</div>
```

### Step 4: Update Blog Grid Container

Find the blog list section:

```html
<!-- FIND THIS -->
<div class="blog-list">
  <div class="bpost rv" onclick="goPost('post8')">
    <!-- ... hardcoded content ... -->
  </div>
  <!-- ... more hardcoded bpost divs ... -->
</div>
```

Replace with:

```html
<!-- REPLACE WITH THIS -->
<div class="blog-list" id="blog-list">
  <!-- Dynamically populated by data-renderer.js -->
</div>
```

### Step 5: Update Featured Article Container

Find the featured blog section:

```html
<!-- FIND THIS -->
<div class="blog-featured rv" onclick="goPost('post8')">
  <!-- ... hardcoded content ... -->
</div>
```

Replace with:

```html
<!-- REPLACE WITH THIS -->
<div id="blog-featured">
  <!-- Dynamically populated by data-renderer.js -->
</div>
```

### Step 6: Update Blog Categories Sidebar

Find sidebar categories:

```html
<!-- FIND THIS -->
<div class="bside-sec">
  <div class="bside-title">Categorias</div>
  <div class="btopic"><span class="btopic-name">Personal Branding</span><span class="btopic-count">8</span></div>
  <!-- ... hardcoded categories ... -->
</div>
```

Replace categories container:

```html
<!-- REPLACE WITH THIS -->
<div class="bside-sec">
  <div class="bside-title">Categorias</div>
  <div id="blog-categories">
    <!-- Dynamically populated by data-renderer.js -->
  </div>
</div>
```

### Step 7: Update Recent Articles Sidebar

Find recent posts section:

```html
<!-- FIND THIS -->
<div class="brecent">
  <div class="brecent-item" onclick="goPost('post6')">
    <!-- ... hardcoded content ... -->
  </div>
  <!-- ... more hardcoded items ... -->
</div>
```

Replace with:

```html
<!-- REPLACE WITH THIS -->
<div class="brecent" id="blog-recent">
  <!-- Dynamically populated by data-renderer.js -->
</div>
```

### Step 8: Update openModal() Function

Find the `openModal()` function in `index.html`:

```javascript
// FIND THIS
function openModal(id){
  const c=cases[id]; if(!c) return;
  document.getElementById('modal-tag').textContent=c.tag;
  // ... rest of function ...
}
```

Update to load from JSON:

```javascript
// REPLACE WITH THIS
function openModal(id){
  renderer.populateProjectModal(id);
  document.getElementById('modal-bg').classList.add('open');
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow='hidden';
}
```

### Step 9: Remove Hardcoded Data Objects

Find and remove these in `index.html`:

```javascript
// REMOVE THIS
const cases={
  raro:{tag:'Personal Branding', ...},
  cury:{tag:'Fotografia Executiva', ...},
  // ... all hardcoded cases ...
};

// REMOVE THIS
const posts={
  post2:{tag:'Personal Branding', ...},
  post3:{tag:'Behind the Scenes', ...},
  // ... all hardcoded posts ...
};
```

These are no longer needed - they're loaded from JSON files instead.

### Step 10: Test in Browser

1. Open `public/index.html` in your browser
2. Open DevTools: Press `F12`
3. Go to Console tab
4. You should see data loading with no errors

Test each section:
- Portfolio page should show all 8 projects
- Blog page should show featured article + all posts
- Click on any project - modal should open with correct data
- Click on any article - should navigate to post page

**Expected Console Output:**
```
✓ Data loaded successfully
✓ Portfolio grid rendered
✓ Blog list rendered
✓ Categories populated
```

---

## Verification Checklist

- [ ] Scripts added to `public/index.html`
- [ ] `id="portfolio-grid"` added to portfolio container
- [ ] `id="blog-list"` added to blog list container
- [ ] `id="blog-featured"` added to featured section
- [ ] `id="blog-categories"` added to categories
- [ ] `id="blog-recent"` added to recent posts
- [ ] `openModal()` function updated
- [ ] Hardcoded `cases` object removed
- [ ] Hardcoded `posts` object removed
- [ ] No console errors on page load
- [ ] Portfolio items render correctly
- [ ] Blog posts render correctly
- [ ] Click interactions work (modal, post navigation)

---

## Testing Individual Sections

### Test Portfolio Grid

```javascript
// In browser console
await renderer.renderPortfolioGrid('portfolio-grid');
console.log('Rendered', dataManager.projects.length, 'projects');
```

Expected output: Shows all 8 projects (Raro, Augusto Cury, Attila, etc.)

### Test Blog List

```javascript
// In browser console
await renderer.renderBlogList('blog-list');
console.log('Rendered', dataManager.articles.length, 'articles');
```

Expected output: Shows all 8 articles with correct dates

### Test Featured Article

```javascript
// In browser console
await renderer.renderFeaturedArticle('blog-featured');
const featured = dataManager.getFeaturedArticles();
console.log('Featured article:', featured[0].title);
```

Expected output: "Sua Marca é um Camaleão?" is featured

### Test Categories

```javascript
// In browser console
await renderer.renderBlogCategories('blog-categories');
console.log('Tags:', dataManager.getArticlesByTagCount());
```

Expected output: Shows all unique tags with counts

---

## Troubleshooting

### Problem: Data Not Loading

**Check 1: Are files accessible?**
```javascript
// Test in console
fetch('/data/articles.json')
  .then(r => r.json())
  .then(data => console.log('Success:', data.articles.length))
  .catch(e => console.error('Failed:', e.message));
```

**Fix:** Ensure `/data/articles.json` exists at the correct path

**Check 2: CORS Issues (if using different domains)**
```javascript
// Add CORS headers to your server for /data/ endpoint
// This should be automatic for same-origin requests
```

### Problem: Nothing Shows on Page

**Check 1: Scripts loaded?**
```javascript
// In console
console.log(typeof dataManager); // Should show "object"
console.log(typeof renderer);    // Should show "object"
```

**Fix:** Verify scripts are added to HTML and paths are correct

**Check 2: Container IDs correct?**
```javascript
// Check if containers exist
console.log(document.getElementById('portfolio-grid'));      // Should not be null
console.log(document.getElementById('blog-list'));          // Should not be null
console.log(document.getElementById('blog-featured'));      // Should not be null
```

**Fix:** Verify container IDs exactly match in HTML

### Problem: Modal Opens But Wrong Data

**Check:**
```javascript
// Test modal data load
renderer.populateProjectModal('raro');
console.log(document.getElementById('modal-title').textContent);
```

**Fix:** Verify project ID exists in `data/projects.json`

### Problem: Articles Show Wrong Dates

**Fix:** Check `createdAt` field format in JSON - should be ISO 8601: `"2025-01-15"`

---

## Data File Formats

### Verify articles.json Structure

```javascript
// In console
fetch('/data/articles.json')
  .then(r => r.json())
  .then(data => {
    console.log('Total articles:', data.articles.length);
    console.log('First article:', data.articles[0]);
  });
```

Should output valid article object with all required fields.

### Verify projects.json Structure

```javascript
// In console
fetch('/data/projects.json')
  .then(r => r.json())
  .then(data => {
    console.log('Total projects:', data.projects.length);
    console.log('First project:', data.projects[0]);
  });
```

Should output valid project object with all required fields.

---

## Common Mistakes to Avoid

1. **Adding scripts in wrong order**
   - ❌ Wrong: `data-renderer.js` before `data-loader.js`
   - ✓ Correct: Load `data-loader.js` first, then `data-renderer.js`

2. **Forgetting to remove hardcoded data**
   - ❌ Wrong: Keep both hardcoded `cases` and use JSON
   - ✓ Correct: Remove hardcoded objects entirely

3. **Wrong container IDs**
   - ❌ Wrong: Using `blog-posts` instead of `blog-list`
   - ✓ Correct: Use exact IDs: `portfolio-grid`, `blog-list`, etc.

4. **Not updating openModal() function**
   - ❌ Wrong: Keep old function looking for hardcoded `cases[id]`
   - ✓ Correct: Call `renderer.populateProjectModal(id)` instead

5. **File path issues**
   - ❌ Wrong: `/assets/data/articles.json`
   - ✓ Correct: `/data/articles.json`

---

## Next Steps

After setup is complete:

1. **Test all functionality** - See "Testing Individual Sections" above
2. **Verify no console errors** - `F12` → Console
3. **Test on mobile** - Responsive design should work
4. **Set up admin panel** - See `DATA_INTEGRATION_GUIDE.md` for admin setup
5. **Create backend API** - Implement CRUD endpoints
6. **Enable real-time sync** - Use WebSocket or polling

---

## Support & Questions

### Check the Documentation

- Main guide: `DATA_INTEGRATION_GUIDE.md`
- Architecture overview: See "System Design" section
- JavaScript API: See "Libraries" section

### Debug Steps

1. Open DevTools: `F12`
2. Go to Console tab
3. Check for red error messages
4. Test each function (see "Testing" section)
5. Check Network tab to see if JSON files load

### Common Error Messages

**"Cannot read property 'projects' of undefined"**
- Fix: Check that `dataManager.init()` completed
- Check: Verify JSON file paths are correct

**"renderer is not defined"**
- Fix: Ensure `data-renderer.js` is loaded after `data-loader.js`
- Check: No errors loading script files (Network tab)

**"Container not found"**
- Fix: Check container ID matches exactly
- Fix: Ensure container exists in HTML before scripts run

---

## Timeline

- **Setup:** 15 minutes
- **Testing:** 10 minutes
- **Admin Integration:** 1-2 hours (backend dependent)
- **Full Deployment:** Same day

---

**Setup Completed By:** SQUAD 3 - Data Integration Engineer
**Date:** 2026-05-16
**Status:** Ready for integration testing
