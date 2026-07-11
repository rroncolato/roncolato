# Admin Frontend - Quick Reference Guide

## Login
```
URL: http://localhost:3011/admin/login.html
Username: admin
Password: senha123
```

## Main Features

### Blog Management
```
Tab: Blog
Create: + Novo Artigo (button in header)
List: Displays table of all articles
Edit: Click ✏️ Edit in table
Delete: Click 🗑️ Delete in table
Hide: Click "Ocultar" button
```

**Required Fields:**
- Title (max 200 chars)
- Excerpt (max 300 chars)
- Category (1 selection)
- Date (date picker)
- Content (required)

### Portfolio Management
```
Tab: Portfólio
Create: + Novo Projeto
List: Grid view of projects
Edit: Click ✏️ Edit
Delete: Click 🗑️ Delete
Hide: Click "Ocultar" button
```

**Required Fields:**
- Title (max 100 chars)
- Client (max 100 chars)
- Category (1 selection)
- Year (1990-2100)
- Deliverable (max 100 chars)
- Description (max 300 chars)

### Site Sections
```
Tab: Páginas
Toggle visibility of:
- Hero Section
- Portfolio
- Blog
- Presenca (Visual Presence)
- Oratoria (Speaking/Courses)
- Propostas (Proposals)
- Agenda (Scheduling)
- Contact
```

### Dashboard
```
Tab: Dashboard
Shows:
- Welcome message
- Quick action buttons
- Statistics (article/project counts)
- Recent activities
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ESC | Close open modal |
| Tab | Navigate form fields |

---

## API Endpoints

### Authentication
```
POST /api/admin/auth
```

### Blog
```
GET    /api/admin/list-articles
POST   /api/admin/add-article
PATCH  /api/admin/update-article
DELETE /api/admin/delete-article
PATCH  /api/admin/toggle-article
```

### Portfolio
```
GET    /api/admin/list-projects
POST   /api/admin/add-project
PATCH  /api/admin/update-project
DELETE /api/admin/delete-project
PATCH  /api/admin/toggle-project
```

---

## Troubleshooting

### Can't Log In
1. Check credentials (admin / senha123)
2. Verify server is running
3. Clear localStorage: `localStorage.clear()`

### Lists Won't Load
1. Check browser console for errors (F12)
2. Verify token is stored: `localStorage.getItem('adminToken')`
3. Restart server if API crashes

### Form Won't Submit
1. Check all required fields are filled
2. Check category is selected
3. Look for validation error messages in red

### Modals Won't Close
1. Press ESC key
2. Click the X button in top right
3. Click outside the modal box
4. Check browser console for JavaScript errors

### Changes Not Appearing on Website
1. Wait 1-2 seconds for API to process
2. Refresh the website page
3. Check article/project is set to visible (not hidden)
4. Verify it's published, not in draft

---

## Common Tasks

### Create New Article
1. Click **Blog** tab
2. Click **+ Novo Artigo**
3. Fill in:
   - Title
   - Category (click button)
   - Date
   - Excerpt (summary)
   - Content (full text)
4. Click **📝 Publicar Artigo**
5. See success message
6. Article appears in blog list

### Edit Article
1. Go to **Blog** tab
2. Find article in table
3. Click **✏️ Edit**
4. Change fields as needed
5. Click **💾 Atualizar Artigo**
6. Success message confirms

### Delete Article
1. Go to **Blog** tab
2. Click **🗑️ Delete** on article
3. Confirm in modal dialog
4. Click **Deletar**
5. Article removed from list

### Hide Article
1. Go to **Blog** tab
2. Click **Ocultar** button
3. Confirm in modal
4. Article no longer appears on website (but can be unhidden)

### Create Portfolio Project
1. Click **Portfólio** tab
2. Click **+ Novo Projeto**
3. Fill in:
   - Title
   - Client name
   - Category (click button)
   - Year
   - Deliverable
   - Description
4. Click **➕ Adicionar Projeto**
5. Success message
6. Project appears in list

### Manage Site Sections
1. Click **Páginas** tab
2. Toggle switches for each section
3. Green toggle = visible
4. Gray toggle = hidden
5. Changes save automatically

---

## Data Location

### Blog Articles
```
Stored in: /src/data/blog.json (or database)
Display: /blog section on website
```

### Portfolio Projects
```
Stored in: /src/data/portfolio.json (or database)
Display: /portfolio section on website
Images: /assets/IMG/portfolio/
```

---

## Browser Console Debugging

```javascript
// Check logged-in user
console.log(localStorage.getItem('adminUser'));

// Check auth token
console.log(localStorage.getItem('adminToken'));

// View all state
console.log(AdminApp.state);

// Manually load blog
AdminApp.loadBlogList();

// Manually load portfolio
AdminApp.loadPortfolioList();

// Test toast notification
Toast.show('Test message', 'success');

// Clear all storage (logout)
localStorage.clear();
```

---

## Tips & Tricks

### Faster Workflow
1. Keep admin panel and website open in split tabs
2. Create content, refresh website to verify
3. Use keyboard navigation in modals
4. Double-check category selection (it's required)

### Avoid Common Mistakes
1. Don't forget to select a category
2. Don't exceed character limits (validated)
3. Don't close tab before seeing success message
4. Don't forget to check "visible" toggle for published items

### Efficiency Tips
1. Use copy/paste for long descriptions
2. Open multiple article edits in tabs
3. Create several items in one session
4. Clear filters/searches between tasks

---

## When Something Goes Wrong

### Step 1: Refresh Page
```
Press F5 or Ctrl+R
```

### Step 2: Check Console
```
Press F12 to open DevTools
Click "Console" tab
Look for red error messages
```

### Step 3: Clear Cache
```
Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
Clear all browsing data
Refresh
```

### Step 4: Logout & Login Again
```
Click "Sair" (Logout) button
Go to /admin/login.html
Login again with fresh session
```

### Step 5: Check Server
```
Terminal: npm start
Should see "Server running on port 3011"
If error, check logs
```

---

## File Locations

| Purpose | Location |
|---------|----------|
| Admin App Logic | `/src/admin/app.js` |
| Admin UI | `/src/admin/dashboard.html` |
| UI Components | `/src/admin/components.js` |
| Admin Styling | `/src/admin/styles-admin.css` |
| API Endpoints | `/src/api/admin/` |
| Blog Data | `/src/data/blog.json` |
| Portfolio Data | `/src/data/portfolio.json` |
| Portfolio Images | `/assets/IMG/portfolio/` |
| Blog Images | `/assets/IMG/blog/` |

---

## Environment Variables

Set these in `.env` or as system variables:

```
JWT_SECRET=your-secret-key
ADMIN_USER=admin
ADMIN_PASS=your-password
NODE_ENV=development (or production)
RECAPTCHA_SECRET=your-recaptcha-secret
```

---

## Performance Tips

### For Large Lists
1. Use filters (when implemented)
2. Delete old articles periodically
3. Archive old projects
4. Optimize images before uploading

### For Faster Loading
1. Use CDN for images
2. Minimize CSS/JavaScript
3. Enable caching
4. Use compression

---

## Security Reminders

1. Don't share login credentials
2. Logout before leaving computer
3. Use strong password (change default)
4. Enable 2FA if available
5. Check for suspicious activity
6. Report security issues immediately

---

## Contact & Support

For issues or questions:
1. Check this quick reference guide
2. Check TESTING_ADMIN_FRONTEND.md for detailed steps
3. Check ADMIN_FRONTEND_STATUS.md for technical details
4. Contact: Frontend Developer (SQUAD 2)

---

**Last Updated**: 2026-05-16  
**Version**: 1.0.0  
**Status**: Production Ready
