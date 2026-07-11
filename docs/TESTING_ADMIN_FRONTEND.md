# Admin Frontend - Testing Guide

## Setup & Access

### 1. Start the Development Server
```bash
npm start
# or
yarn start
```

Server should run on `http://localhost:3011`

### 2. Access Admin Panel
```
http://localhost:3011/admin/dashboard.html
```

### 3. Default Credentials
Username: `admin`
Password: `senha123`

Note: These are in `src/api/admin/auth.js` - change before production!

---

## Test Scenarios

### Test 1: Authentication

#### Login Flow
1. Navigate to `/admin/login.html`
2. Enter username: `admin`
3. Enter password: `senha123`
4. Click "Entrar"
5. **Expected**: Redirected to dashboard.html, user name shown in header

#### Authentication Persistence
1. After login, open browser DevTools > Application > LocalStorage
2. **Expected**: 
   - `adminToken` key with JWT token
   - `adminUser` key with username
3. Refresh the page
4. **Expected**: Stays on dashboard (not redirected to login)

#### Token Expiration
1. Open console and run:
```javascript
localStorage.removeItem('adminToken');
```
2. Refresh page
3. **Expected**: Redirected to login page

---

### Test 2: Blog Article CRUD

#### Create Article
1. Click "Blog" in sidebar
2. Click "+ Novo Artigo" button
3. Fill form:
   - Title: "Test Article Title"
   - Category: Click one of the category buttons
   - Date: Pick today or recent date
   - Excerpt: "This is a test article excerpt for testing purposes"
   - Content: Enter multiline content with sections
   - Read Time: "5 min" (default)
4. Click "📝 Publicar Artigo"
5. **Expected**:
   - Green success toast appears
   - Modal closes
   - New article appears in list below
   - Table shows: Title, Category, Date, Actions

#### Read/List Articles
1. Click "Blog" tab
2. Wait for table to load
3. **Expected**:
   - All articles display in table
   - Columns: Artigo, Categoria, Data, Leitura
   - Action buttons visible: ✏️ Edit, Hide, 🗑️ Delete

#### Edit Article
1. In article list, click ✏️ Edit on any article
2. Modal opens with article data pre-filled
3. Change title: Add " - EDITED" to the end
4. Click "💾 Atualizar Artigo"
5. **Expected**:
   - Green success toast appears
   - Modal closes
   - List refreshes
   - Title updated in table

#### Delete Article
1. In article list, click 🗑️ Delete on any article
2. Confirmation modal appears
3. Click "Deletar" button
4. **Expected**:
   - Warning modal appears asking for confirmation
   - After confirmation, article removed from list
   - Success toast shows
   - Table refreshes without deleted item

---

### Test 3: Portfolio Project CRUD

#### Create Project
1. Click "Portfólio" in sidebar
2. Click "+ Novo Projeto" button
3. Fill form:
   - Título: "Test Project Name"
   - Cliente: "Test Client Company"
   - Categoria: Click one button
   - Ano: 2024
   - Entregável: "Photography + Branding"
   - Descrição: "This is a detailed project description for testing"
   - Link: "https://example.com" (optional)
   - Imagens: "image1.jpg, image2.jpg" (comma-separated paths)
4. Click "➕ Adicionar Projeto"
5. **Expected**:
   - Green success toast
   - Modal closes
   - New project appears in list
   - Form resets for next project

#### Read/List Projects
1. Click "Portfólio" tab
2. Wait for projects to load
3. **Expected**:
   - All projects display in table format
   - Columns: Projeto, Cliente, Ano, Categoria
   - Projects show in rows with action buttons

#### Edit Project
1. Click ✏️ Edit on any project
2. Modal opens with all fields pre-filled
3. Change client name: Add " - Updated"
4. Click "💾 Atualizar Projeto"
5. **Expected**:
   - Success toast
   - Modal closes
   - List refreshes
   - Client name updated

#### Delete Project
1. Click 🗑️ Delete on any project
2. Confirmation modal appears
3. Click "Deletar"
4. **Expected**:
   - Project removed
   - Success message
   - List refreshes

#### Visibility Toggle
1. In project list, click "Ocultar" (Hide)
2. Confirmation modal: "Tem certeza que deseja ocultar este projeto?"
3. Click "Confirmar"
4. **Expected**:
   - Project hidden from front-end display
   - Can be toggled back visible
   - Success notification

---

### Test 4: Form Validation

#### Portfolio Validation
1. Open "+ Novo Projeto" modal
2. Try submitting empty form
3. **Expected**:
   - Fields highlighted in red
   - Error messages appear below fields
   - Red background on invalid fields
4. Fill only "Título" field, try submit
5. **Expected**:
   - Other required fields show errors
6. Fill all except category, try submit
7. **Expected**:
   - Toast error: "Selecione uma categoria"

#### Blog Validation
1. Open "+ Novo Artigo" modal
2. Leave all fields empty, try submit
3. **Expected**:
   - Validation errors on required fields
   - Fields highlighted in red
4. Check field length limits:
   - Title max 200 chars - test exceeding
   - Excerpt max 300 chars - test exceeding
5. **Expected**: Error messages for max length violations

---

### Test 5: Dashboard Metrics

#### Load Dashboard
1. Click "Dashboard" in sidebar
2. Wait for metrics to load
3. **Expected**:
   - "Estatísticas" section shows:
     - Total Projetos count
     - Total Artigos count
     - Sistema OK checkmark
   - Quick action buttons visible

#### Verify Metrics Update
1. Create a new article
2. Return to Dashboard
3. **Expected**: Article count increments
4. Create a new project
5. **Expected**: Project count increments

---

### Test 6: Pages/Sections Management

#### Load Sections
1. Click "Páginas" tab
2. Wait for toggles to load
3. **Expected**:
   - All sections listed with descriptions
   - Toggle switches available
   - Hero Section, Portfolio, Blog, etc.

#### Toggle Section Visibility
1. Click toggle for "Blog" section
2. **Expected**:
   - Toggle animates
   - Success toast shows: "Seção "Blog" ativada/desativada"
   - State persists on page reload

#### Verify Toggle State
1. Toggle a section OFF
2. Refresh page
3. **Expected**: Toggle remains OFF
4. Toggle it ON
5. **Expected**: Toggle remains ON

---

### Test 7: UI/UX Features

#### Modal Behavior
1. Open portfolio form modal
2. Try pressing ESC key
3. **Expected**: Modal closes (if ESC listener works)
4. Open modal again
5. Click outside the modal box (on overlay)
6. **Expected**: Modal closes

#### Form Reset
1. Open "+ Novo Projeto" modal
2. Fill some fields
3. Close modal (click X button)
4. Open modal again
5. **Expected**: All fields are empty, form is reset

#### Toast Notifications
1. Perform any successful action (create, update, delete)
2. **Expected**: Green toast appears bottom-right
3. Toast disappears after 3 seconds
4. Try an error (wrong password, empty field)
5. **Expected**: Red error toast appears

#### Loading States
1. Create an article or project
2. Watch button during submission
3. **Expected**: Button shows loading spinner and "Publicando..." text
4. After response, button returns to normal state

#### Category Selection
1. Open portfolio form
2. Click multiple category buttons
3. **Expected**:
   - Only one category can be selected at a time
   - Selected category has yellow background
   - Previous selection loses yellow highlight

---

### Test 8: Data Flow & Persistence

#### Create → Verify on Frontend
1. Create article: "Frontend Test Article"
2. Go to blog section on homepage (not admin)
3. **Expected**: New article appears in blog list
4. Click on article
5. **Expected**: Full article content displays

#### Edit → Verify on Frontend
1. In admin, edit article title: Add " - VERIFIED"
2. Go to homepage blog section
3. **Expected**: Title shows updated text

#### Delete → Verify on Frontend
1. Delete an article from admin
2. Go to homepage blog section
3. **Expected**: Deleted article no longer appears

#### Portfolio Visible/Hidden
1. Toggle a project to hidden
2. Go to homepage portfolio section
3. **Expected**: Project doesn't appear
4. In admin, toggle project back visible
5. **Expected**: Project reappears on homepage

---

### Test 9: Error Handling

#### Network Error
1. Stop the server
2. Try to load blog list
3. **Expected**: Error message shows "Erro ao carregar artigos"
4. Container shows "Erro ao carregar"

#### Invalid Token
1. Open DevTools console
2. Run: `localStorage.setItem('adminToken', 'invalid-token')`
3. Refresh or try to load data
4. **Expected**: 401 error, might redirect to login

#### Server Error
1. API returns 500 error
2. **Expected**: User-friendly error toast appears
3. Operation doesn't complete
4. Modal doesn't close

---

### Test 10: Responsive Design

#### Desktop (1920x1080)
1. Access admin panel on desktop
2. **Expected**:
   - Two-column layout (sidebar + content)
   - All buttons fully visible
   - Tables fully readable

#### Tablet (768x1024)
1. Resize browser to 768px width
2. **Expected**:
   - Responsive layout holds up
   - No horizontal scroll needed
   - Touch targets still usable

#### Mobile (375x812)
1. Resize to mobile width
2. **Expected**:
   - Single column layout
   - Sidebar might be hidden
   - Forms stack vertically
   - Buttons remain clickable

---

## Performance Checks

### Load Time
1. Open admin dashboard
2. **Expected**: Loads within 2 seconds
3. List articles/projects
4. **Expected**: Renders within 1 second

### Large Lists
1. If have 50+ articles, try loading
2. **Expected**: Still responsive, no freeze
3. Scrolling smooth
4. Interactions not delayed

---

## Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Known Issues During Testing

### Issue: "showToast is not a function"
**Fix**: Make sure `window.showToast` is defined in dashboard.html

### Issue: Modals don't close
**Fix**: Check that modal element IDs match in HTML and JS

### Issue: Images not uploading
**Expected**: Currently only accepts comma-separated paths, not file uploads

### Issue: Token expires during session
**Note**: Tokens expire after 24 hours, user needs to re-login

---

## Test Results Template

```
DATE: ______________
TESTER: ____________
BROWSER: ___________

PASSED:
[ ] Authentication login/logout
[ ] Blog CRUD operations
[ ] Portfolio CRUD operations
[ ] Form validation
[ ] Modals open/close
[ ] Toast notifications
[ ] Data persists on frontend
[ ] Dashboard metrics
[ ] Responsive design

FAILED:
- Issue 1: ___________
- Issue 2: ___________

NOTES:
_____________________
_____________________
```

---

## Debugging Commands

```javascript
// Check current user
console.log(localStorage.getItem('adminUser'));

// Check token
console.log(localStorage.getItem('adminToken'));

// Check admin state
console.log(AdminApp.state);

// Manually trigger blog load
AdminApp.loadBlogList();

// Manually trigger portfolio load
AdminApp.loadPortfolioList();

// Show all toasts (test)
Toast.show('Test success', 'success');
Toast.show('Test error', 'error');

// Check last API response
// Open Network tab in DevTools, look for last fetch request
```

---

**Happy Testing!**
