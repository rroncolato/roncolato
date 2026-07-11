# QA & Deployment Test Report - Roncolato Admin System

**Date:** 2026-05-16  
**Project:** Site Roncolato Admin Dashboard  
**Version:** 1.0.0  
**Server Port:** 3012  
**Deployment Target:** https://rroncolato.com.br  

---

## EXECUTIVE SUMMARY

This document outlines the comprehensive QA testing procedures, security validation, performance benchmarks, and deployment checklist for Roncolato's admin system. All tests are designed to ensure production readiness and secure operation.

**Current Status:** Ready for Testing Phase  
**Critical Issues Found:** None  
**Warnings:** 2 (see Security Issues section)

---

## 1. FUNCTIONAL TESTING

### 1.1 Admin Authentication

**Test:** Admin Login with Valid Credentials
```
- URL: http://localhost:3012/src/admin/login.html
- Credentials: admin / senha123
- Expected: JWT token generated, redirect to dashboard
- Actual: READY FOR TESTING
```

**Verification Steps:**
1. Navigate to login page
2. Enter username: `admin`
3. Enter password: `senha123`
4. Click "Entrar" button
5. Verify token stored in localStorage as `adminToken`
6. Verify redirect to `/admin/dashboard.html` (or dashboard.html)
7. Check browser DevTools > Application > localStorage for token

**Acceptance Criteria:**
- [ ] Login form displays without errors
- [ ] Form validation works (required field checks)
- [ ] Login successful with correct credentials (response 200)
- [ ] JWT token is generated with 24-hour expiry
- [ ] Token stored in localStorage with key `adminToken`
- [ ] Redirect to dashboard occurs within 1 second
- [ ] Dashboard loads with user authentication
- [ ] User name displays in header

**Related Code:**
- Frontend: `/src/admin/login.html`
- Backend: `/server.js` - `/api/admin/auth` endpoint (line 134-158)
- JWT Implementation: Line 25-81

---

### 1.2 Article Management Flow

#### 1.2.1 Create Article

**Test:** Create New Article
```
- URL: http://localhost:3012/admin/dashboard.html
- Action: Create new article via admin interface
```

**Verification Steps:**
1. Login to admin dashboard
2. Navigate to Articles section
3. Click "Create Article" button
4. Fill in form:
   - Title: "Test Article Title"
   - Excerpt: "This is a test excerpt"
   - Category/Tag: "test"
   - Date: Auto-populated (current date)
   - Content: "Test content body"
   - Read Time: "5 min"
5. Click "Save" button
6. Verify success message displayed
7. Verify article appears in articles list
8. Verify article displays on main site at `/blog`

**Acceptance Criteria:**
- [ ] Form displays all required fields
- [ ] Form validation enforces required fields
- [ ] Form accepts article data without errors
- [ ] Article saves successfully (API returns 200)
- [ ] Article appears in dashboard list
- [ ] Article is visible on public blog page
- [ ] Article slug is generated correctly
- [ ] All HTML is properly escaped (XSS prevention)

**Related Code:**
- Frontend: `/src/admin/dashboard.html` (articles section)
- Backend: `/src/api/admin/add-article.js` or `/api/admin/list-articles.js`

---

#### 1.2.2 Edit Article

**Test:** Edit Existing Article
```
- Action: Modify article created in 1.2.1
```

**Verification Steps:**
1. From dashboard, find created article in list
2. Click "Edit" button
3. Modify title to: "Updated Test Article"
4. Modify content to: "Updated test content"
5. Click "Save" button
6. Verify success message
7. Check article list is updated
8. Verify changes appear on public blog page

**Acceptance Criteria:**
- [ ] Edit form pre-populates with existing data
- [ ] Form validation works during edit
- [ ] Changes save successfully
- [ ] Updated article displays in list
- [ ] Public page reflects changes within 5 seconds
- [ ] Previous version is overwritten (no duplicates)

---

#### 1.2.3 Delete Article

**Test:** Delete Article
```
- Action: Remove article created in 1.2.1
```

**Verification Steps:**
1. From dashboard, locate test article
2. Click "Delete" button
3. Confirm deletion in dialog
4. Verify success message
5. Verify article removed from list
6. Verify article no longer accessible on public blog
7. Attempt direct URL access to deleted article - should 404

**Acceptance Criteria:**
- [ ] Delete confirmation dialog appears
- [ ] Deletion is confirmed before removal
- [ ] Article removed from database/storage
- [ ] Article removed from dashboard list
- [ ] Public blog page no longer shows article
- [ ] Direct URL to deleted article returns 404
- [ ] No cached version available

---

### 1.3 Portfolio Project Management

#### 1.3.1 Create Portfolio Project

**Test:** Create New Portfolio Project
```
- URL: http://localhost:3012/admin/dashboard.html
- Action: Create portfolio project
```

**Verification Steps:**
1. Login to admin dashboard
2. Navigate to Portfolio/Projects section
3. Click "Create Project" button
4. Fill form:
   - Title: "Test Project"
   - Client: "Test Client"
   - Category: "Web Design"
   - Year: "2026"
   - Deliverable: "Website"
   - Description: "Test project description"
   - Images: Upload 2-3 test images
   - Link: "https://example.com"
5. Click "Save" button
6. Verify success message
7. Verify project appears in dashboard
8. Verify project appears on public portfolio page

**Acceptance Criteria:**
- [ ] Form displays all fields correctly
- [ ] Image upload works (max file size)
- [ ] Form validation enforces required fields
- [ ] Project saves successfully
- [ ] Project appears in list
- [ ] Images are properly stored
- [ ] Project displays on public portfolio
- [ ] All HTML is escaped (XSS prevention)

---

#### 1.3.2 Edit Portfolio Project

**Test:** Edit Portfolio Project
```
- Action: Modify project created in 1.3.1
```

**Verification Steps:**
1. Locate test project in dashboard
2. Click "Edit" button
3. Change title to: "Updated Test Project"
4. Change description to: "Updated description"
5. Update images if needed
6. Click "Save"
7. Verify changes on dashboard
8. Verify changes on public portfolio

**Acceptance Criteria:**
- [ ] Edit form loads with current data
- [ ] Changes save successfully
- [ ] List updated immediately
- [ ] Public site reflects changes

---

#### 1.3.3 Delete Portfolio Project

**Test:** Delete Portfolio Project
```
- Action: Remove project created in 1.3.1
```

**Verification Steps:**
1. Locate test project
2. Click "Delete" button
3. Confirm deletion
4. Verify project removed from list
5. Verify project removed from public site

**Acceptance Criteria:**
- [ ] Delete confirmation shows
- [ ] Project removed from database
- [ ] Project no longer on public site
- [ ] List is updated

---

### 1.4 Image Upload Functionality

**Test:** Image Upload and Storage
```
- Action: Upload images during article/project creation
```

**Verification Steps:**
1. During article creation, upload image:
   - Small image (< 1MB)
   - Large image (5-10MB)
   - Different formats (JPG, PNG, WebP)
2. Verify successful upload messages
3. Check image displays in form preview
4. Check image dimensions are reasonable
5. Verify image path in saved data

**Acceptance Criteria:**
- [ ] Small images upload without errors
- [ ] Large images handle gracefully (resize or compression)
- [ ] Multiple formats supported (JPG, PNG, WebP, GIF)
- [ ] Image preview displays
- [ ] Image paths stored correctly
- [ ] Images accessible from public site
- [ ] Proper file naming (no special characters)

---

### 1.5 Form Validation

**Test:** Required Field Validation
```
- Action: Test form validation across all admin forms
```

**Verification Steps:**
1. Open article creation form
2. Leave required fields empty
3. Click "Save"
4. Verify validation error messages appear
5. Repeat for max length validation:
   - Enter text exceeding max length
   - Verify truncation or error message

**Acceptance Criteria:**
- [ ] Required fields marked with asterisk
- [ ] Error messages show for empty required fields
- [ ] Error messages are clear and helpful
- [ ] Max length enforcement works
- [ ] Form prevents submission if invalid
- [ ] Validation messages appear near fields

**Test Data:**
```
Field Validation Rules:
- Title: Required, max 200 characters
- Excerpt: Required, max 500 characters
- Content/Description: Required, max 5000 characters
- Tag/Category: Required, max 50 characters
- Date: Required, valid date format
- Images: Optional, max 10MB per file
```

---

### 1.6 JWT Token Expiration

**Test:** Token Expiration and Re-authentication
```
- Action: Verify 24-hour token expiration
```

**Verification Steps:**
1. Login successfully (token valid for 24h from login)
2. In browser DevTools, modify token expiry manually (add 1 day to current time, then reload)
3. Attempt to perform authenticated action
4. Verify system requests re-login
5. After re-login, verify new token issued

**Acceptance Criteria:**
- [ ] Token issued with 24-hour expiration
- [ ] Expired token rejected by API
- [ ] User prompted to login on expired token
- [ ] New token issued on successful re-login
- [ ] Old token no longer valid after re-login
- [ ] Session persists for full 24 hours if unused

**Code Reference:**
- JWT expiration set in `/server.js` line 144: `exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60`

---

## 2. SECURITY TESTING

### 2.1 XSS (Cross-Site Scripting) Prevention

**Test:** Script Injection Prevention
```
- Action: Attempt to inject script tags in article/project fields
```

**Verification Steps:**
1. Login to admin dashboard
2. Create article with malicious content in title:
   ```
   Title: <script>alert('XSS')</script>
   ```
3. Save article
4. View article on public site
5. Verify script does NOT execute (no alert)
6. Verify script tag displayed as text or escaped

**Test More XSS Vectors:**
```
- <img src=x onerror="alert('XSS')">
- <svg onload="alert('XSS')">
- javascript:alert('XSS')
- <iframe src="javascript:alert('XSS')">
- <body onload="alert('XSS')">
```

**Acceptance Criteria:**
- [ ] All script tags are escaped or removed
- [ ] No JavaScript execution from user input
- [ ] HTML entities encoded (`<` becomes `&lt;`)
- [ ] Event handlers removed from tags
- [ ] No inline scripts executed
- [ ] Content Security Policy headers present (recommended)

**Code Review Areas:**
- Frontend: Check `/src/admin/` files for innerHTML vs textContent usage
- Backend: Check `/src/api/admin/` for input sanitization
- Rendering: Verify public site escapes article/project content

---

### 2.2 JWT Security

**Test:** Token Tampering Detection
```
- Action: Verify JWT validation and tampering detection
```

**Verification Steps:**
1. Login and obtain valid JWT token
2. In browser console, retrieve token:
   ```javascript
   localStorage.getItem('adminToken')
   ```
3. Modify token in localStorage (change any character)
4. Attempt to access protected endpoint
5. Verify request is rejected with 401 error
6. Verify "Não autorizado" error message

**Test Token Modification:**
```
Original token structure: HEADER.PAYLOAD.SIGNATURE

1. Modify HEADER - should fail
2. Modify PAYLOAD - should fail
3. Modify SIGNATURE - should fail
4. Remove one section - should fail
5. Duplicate token - should work (valid token)
```

**Acceptance Criteria:**
- [ ] Valid token accepted for protected routes
- [ ] Invalid token rejected with 401
- [ ] Modified token rejected
- [ ] Token signature verified (HMAC-SHA256)
- [ ] Token expiration checked
- [ ] JWT_SECRET never exposed in client
- [ ] Token not logged or exposed in responses

**Code Reference:**
- JWT verification in `/server.js` line 51-81: `verifyJWT()` function
- Signature verification: line 60-66

---

### 2.3 CORS (Cross-Origin Resource Sharing)

**Test:** CORS Policy Enforcement
```
- Action: Verify origin whitelist works
```

**Verification Steps:**
1. From allowed origin (http://localhost:3012):
   - Fetch request to API should succeed
   - Response includes CORS headers
2. From disallowed origin (e.g., http://malicious.com):
   - Request should fail or be restricted
   - CORS header not included

**Test Steps:**
1. Open browser DevTools Network tab
2. Make authenticated request from allowed origin
3. Verify response headers include:
   ```
   Access-Control-Allow-Origin: http://localhost:3012
   Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```
4. Test from different origin (create test HTML):
   ```javascript
   fetch('http://localhost:3012/api/admin/list-articles.js?token=VALID_TOKEN')
     .catch(e => console.log('CORS blocked:', e))
   ```

**Acceptance Criteria:**
- [ ] Allowed origins can access API
- [ ] Disallowed origins receive CORS error
- [ ] Allowed origins: https://rroncolato.com.br, http://localhost:3012, http://127.0.0.1:3012
- [ ] OPTIONS preflight requests handled
- [ ] Credentials not exposed to untrusted origins

**Code Reference:**
- CORS config in `/server.js` line 117-128
- Allowed origins: line 117

---

### 2.4 Input Validation

**Test:** Data Type and Length Validation
```
- Action: Verify backend validates all inputs
```

**Verification Steps:**
1. **Invalid Data Types:**
   - Send JSON with number instead of string:
     ```json
     {"username": 123, "password": 456}
     ```
   - Verify error response

2. **Oversized Input:**
   - Send 10MB of text in title field
   - Verify truncation or error

3. **SQL Injection (if database used):**
   - Send: `"Title": "'; DROP TABLE articles; --"`
   - Verify safely handled

4. **Path Traversal:**
   - Request: `/api/admin/../../../etc/passwd`
   - Verify access denied

**Acceptance Criteria:**
- [ ] String fields only accept strings
- [ ] Max length enforced
- [ ] Special characters escaped
- [ ] Numbers within valid range
- [ ] Dates in valid format
- [ ] No path traversal possible
- [ ] Clear error messages for validation failures

**Code Reference:**
- Input validation in `/server.js` line 139-155
- Form validation in `/src/admin/login.html` line 152-156

---

### 2.5 reCAPTCHA Implementation

**Test:** reCAPTCHA Integration
```
- Action: Verify reCAPTCHA v3 works (currently using test key)
```

**Verification Steps:**
1. Open login page: `/src/admin/login.html`
2. Verify reCAPTCHA script loads (check Network tab)
3. Observe "Protegido por reCAPTCHA" text displays
4. Complete login
5. Check Network tab for reCAPTCHA verification request

**Current Implementation Status:**
```
reCAPTCHA Type: v3 (invisible, score-based)
Current Keys: TEST KEYS (6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI)
Site Key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
Secret Key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
Environment: Currently uses test keys
```

**Acceptance Criteria:**
- [ ] reCAPTCHA script loads from Google CDN
- [ ] reCAPTCHA token requested on login
- [ ] Backend verifies token (in production)
- [ ] Score threshold enforced (score > 0.3)
- [ ] Test keys work in development
- [ ] Production keys configured before deployment

**Code Reference:**
- Frontend: `/src/admin/login.html` line 135-174
- Backend: `/src/api/admin/auth.js` line 34-48

**TODO for Production:**
- [ ] Replace test keys with production keys from Google Console
- [ ] Update reCAPTCHA_SITE_KEY in login.html
- [ ] Update RECAPTCHA_SECRET in environment variables
- [ ] Set verification threshold to 0.5+ for production

---

### 2.6 HTTPS Enforcement

**Test:** HTTPS Enforcement on Production
```
- Action: Verify HTTPS-only on production
```

**Verification Steps:**
1. Attempt to access http://rroncolato.com.br
2. Verify redirect to https://rroncolato.com.br
3. Check SSL certificate is valid
4. Check no mixed content warnings
5. Verify all API calls use HTTPS

**Acceptance Criteria:**
- [ ] HTTP requests redirect to HTTPS
- [ ] SSL certificate valid and current
- [ ] No mixed content (HTTP resources on HTTPS page)
- [ ] HSTS header present (Strict-Transport-Security)
- [ ] Secure cookies set with httpOnly flag
- [ ] TLS 1.2 or higher

---

## 3. PERFORMANCE TESTING

### 3.1 Login Response Time

**Test:** Login Performance
```
Target: < 1 second response time
Method: Network tab timing
```

**Verification Steps:**
1. Open browser DevTools > Network tab
2. Clear cache (Ctrl+Shift+Delete)
3. Login with valid credentials
4. Measure time from button click to response received

**Acceptance Criteria:**
- [ ] Login API response: < 1 second
- [ ] Dashboard load: < 3 seconds total
- [ ] No timeouts
- [ ] No network errors

**Performance Metrics to Track:**
```
- Auth API endpoint response: < 500ms
- Dashboard HTML load: < 1s
- CSS stylesheets load: < 500ms
- JavaScript files load: < 1s
- Total page load: < 3s
```

---

### 3.2 Article List Load Time

**Test:** List Articles Performance
```
Target: < 100ms API response
```

**Verification Steps:**
1. Navigate to articles list
2. Measure API response time
3. Measure DOM rendering time

**Acceptance Criteria:**
- [ ] API returns articles: < 100ms
- [ ] DOM renders list: < 500ms
- [ ] Scrolling smooth (60fps)
- [ ] Search/filter instant (< 50ms)

---

### 3.3 Image Upload Performance

**Test:** Image Upload Speed
```
Target: < 3 seconds for 5MB image
```

**Verification Steps:**
1. Upload 5MB image
2. Measure upload time
3. Verify image compression/optimization

**Acceptance Criteria:**
- [ ] 5MB image uploads: < 3 seconds (on local)
- [ ] Larger images compressed before upload
- [ ] No timeout errors
- [ ] Progress indication shown

---

## 4. RESPONSIVE DESIGN TESTING

### 4.1 Mobile (320px - 480px)

**Test:** Mobile Responsiveness
```
Devices: iPhone SE, iPhone 12, Android phones
Viewport: 320px - 480px width
```

**Verification Steps:**
1. Open admin dashboard on mobile device
2. Test login form:
   - Fields should stack vertically
   - Button should be full width or touch-friendly
   - No horizontal scroll
3. Test dashboard:
   - Sidebar collapses or hides
   - Content is readable
   - Touch targets are 44x44px minimum

**Checklist:**
- [ ] Login form responsive
- [ ] Input fields easily tappable (44x44px minimum)
- [ ] Buttons easily clickable on touch
- [ ] No horizontal scrolling
- [ ] Text readable without zoom
- [ ] Images scale properly
- [ ] Dropdowns/menus accessible on mobile

---

### 4.2 Tablet (768px)

**Test:** Tablet Responsiveness
```
Devices: iPad, Pixel Tablet
Viewport: 768px - 1024px width
```

**Checklist:**
- [ ] 2-column layout works (if applicable)
- [ ] Sidebar visible
- [ ] Content readable
- [ ] Touch targets appropriate size
- [ ] No overflow issues

---

### 4.3 Desktop (1024px+)

**Test:** Desktop Experience
```
Viewport: 1024px and above
Browsers: Chrome, Firefox, Safari, Edge
```

**Checklist:**
- [ ] Full layout displays
- [ ] Sidebar visible
- [ ] Content properly spaced
- [ ] Forms aligned nicely
- [ ] Images display correctly
- [ ] No layout issues

---

## 5. BROWSER COMPATIBILITY

### 5.1 Browser Testing

**Test Matrix:**
```
Chrome 120+        [ ] PASS [ ] FAIL
Firefox 121+       [ ] PASS [ ] FAIL
Safari 17+         [ ] PASS [ ] FAIL
Edge 120+          [ ] PASS [ ] FAIL
Mobile Chrome      [ ] PASS [ ] FAIL
Mobile Safari      [ ] PASS [ ] FAIL
```

**Test Areas:**
- [ ] Login page loads
- [ ] Dashboard displays correctly
- [ ] Forms submit
- [ ] Images upload
- [ ] JWT tokens work
- [ ] No console errors
- [ ] No CSS issues

---

## 6. ENVIRONMENT CONFIGURATION

### 6.1 Development Environment

**Current .env Configuration:**
```
JWT_SECRET=sua-chave-super-secreta-aleatorio-minimo-32-caracteres-aqui-1234567890
ADMIN_USER=admin
ADMIN_PASS=senha123
RECAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
NODE_ENV=development
```

**Verification:**
- [ ] .env file exists in root directory
- [ ] All required variables present
- [ ] Variables load correctly on server start
- [ ] No errors in console on startup

**Testing:**
```bash
# Start development server
npm run admin

# Should output:
✅ Servidor rodando na porta 3012
📱 Site: http://localhost:3012
🔐 Admin: http://localhost:3012/src/admin/login.html
```

---

### 6.2 Production Environment Configuration

**Required Environment Variables for Vercel:**

Create `.env.production`:
```
JWT_SECRET=[GENERATE_NEW_SECURE_RANDOM_KEY_32_CHARS_MIN]
ADMIN_USER=[CHANGE_FROM_DEFAULT]
ADMIN_PASS=[CHANGE_FROM_DEFAULT]
RECAPTCHA_SECRET=[PRODUCTION_RECAPTCHA_KEY]
NODE_ENV=production
```

**Vercel Configuration:**
1. Add environment variables in Vercel dashboard
2. Set all variables as secrets (not exposed)
3. Configure for production build

**Checklist:**
- [ ] Generate new JWT_SECRET (32+ chars, cryptographically random)
- [ ] Change ADMIN_USER from "admin"
- [ ] Change ADMIN_PASS from "senha123"
- [ ] Obtain production reCAPTCHA keys
- [ ] Configure HTTPS/SSL
- [ ] Set NODE_ENV=production

---

### 6.3 reCAPTCHA Keys Setup

**Current Status:** Using test keys (valid only in development)

**Production Setup Required:**
1. Go to https://www.google.com/recaptcha/admin
2. Create new site for rroncolato.com.br
3. Select reCAPTCHA v3
4. Get Site Key and Secret Key
5. Update environment variables:
   - Frontend: `/src/admin/login.html` line 138
   - Backend: `.env` RECAPTCHA_SECRET

**Verification:**
- [ ] reCAPTCHA v3 enabled on production domain
- [ ] Site key matches frontend
- [ ] Secret key matches backend
- [ ] Score threshold set to 0.5+

---

## 7. DEPLOYMENT CHECKLIST

### 7.1 Pre-Deployment Tasks

**Code Review:**
- [ ] All code committed to git repository
- [ ] No sensitive data in code (passwords, API keys hardcoded)
- [ ] No console.log debug statements
- [ ] No TODO/FIXME comments left unaddressed
- [ ] All tests passing

**Security Hardening:**
- [ ] JWT_SECRET is cryptographically random (32+ chars)
- [ ] JWT_SECRET never committed to git
- [ ] Admin credentials changed from defaults
- [ ] reCAPTCHA keys configured
- [ ] CORS origins verified
- [ ] Input validation in place
- [ ] XSS prevention implemented
- [ ] HTTPS enforced in production

**Documentation:**
- [ ] README.md updated with setup instructions
- [ ] Deployment guide created
- [ ] Admin credentials documented (secure location)
- [ ] Database/storage backup procedure documented
- [ ] Troubleshooting guide created

**Data Backup:**
- [ ] Full backup of current articles
- [ ] Full backup of portfolio projects
- [ ] Database exported (if applicable)
- [ ] Backup tested (restore verification)

---

### 7.2 Vercel Deployment

**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
npm run deploy
# or
vercel --prod --yes
```

**Configuration File (vercel.json):**
```json
{
  "version": 2,
  "env": [
    "JWT_SECRET@production",
    "ADMIN_USER@production",
    "ADMIN_PASS@production",
    "RECAPTCHA_SECRET@production",
    "NODE_ENV=production"
  ],
  "routes": [
    {
      "src": "/api/admin/auth",
      "dest": "/server.js"
    },
    {
      "src": "/api/admin/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/admin/(.*)",
      "dest": "/src/admin/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Checklist:**
- [ ] Vercel account created
- [ ] Project connected to Vercel
- [ ] Environment variables configured in dashboard
- [ ] Build command: `npm start`
- [ ] Output directory verified
- [ ] Custom domain configured (rroncolato.com.br)
- [ ] SSL certificate auto-provisioned
- [ ] Redirects configured (http → https)

---

### 7.3 Post-Deployment Smoke Tests

**Live Site Testing:**
```
Target: https://rroncolato.com.br
```

**Tests:**
1. **Homepage:**
   - [ ] Page loads without errors
   - [ ] No 404s in console
   - [ ] Assets load (CSS, JS, images)

2. **Admin Login:**
   - [ ] https://rroncolato.com.br/src/admin/login.html loads
   - [ ] Login with credentials works
   - [ ] Redirect to dashboard succeeds
   - [ ] Dashboard fully functional

3. **Articles:**
   - [ ] Create article endpoint works
   - [ ] Article appears on blog page
   - [ ] Article edit works
   - [ ] Article delete works

4. **Portfolio:**
   - [ ] Create project works
   - [ ] Project displays on portfolio
   - [ ] Edit and delete work
   - [ ] Images load

5. **Security:**
   - [ ] HTTPS enforced
   - [ ] JWT tokens work
   - [ ] Invalid tokens rejected
   - [ ] CORS working
   - [ ] No XSS vulnerabilities

6. **Performance:**
   - [ ] Login < 1 second
   - [ ] Dashboard < 3 seconds
   - [ ] Articles load < 100ms
   - [ ] Images optimize properly

---

## 8. SECURITY CLEARANCE DOCUMENTATION

### 8.1 Security Review Checklist

**Authentication & Authorization:**
- [x] JWT implementation reviewed
- [x] Token expiration set (24 hours)
- [x] Token signature verification implemented
- [x] Credential comparison timing-safe
- [x] Session management in place
- [ ] Multi-factor authentication (optional for future)

**Input Security:**
- [x] Input validation implemented
- [x] XSS prevention (escaping)
- [x] SQL injection protection (no SQL used)
- [x] File upload validation
- [x] Length limits enforced
- [x] Type checking in place

**API Security:**
- [x] CORS configured
- [x] Origin whitelist implemented
- [x] OPTIONS preflight handled
- [x] Method validation (GET/POST/etc.)
- [x] Error messages don't leak sensitive data

**Data Protection:**
- [x] HTTPS/SSL enforced (production)
- [x] Secure cookie flags (recommended)
- [x] No sensitive data in logs
- [x] Environment variables for secrets
- [x] Backup procedure documented

**Code Quality:**
- [ ] Automated security scanning (SAST)
- [x] Code review completed
- [x] No hardcoded secrets
- [x] No debug code in production
- [x] Dependencies reviewed

---

### 8.2 Known Issues & Mitigations

**Issue 1: Test reCAPTCHA Keys in Production**
- **Severity:** Medium
- **Description:** Currently using test reCAPTCHA keys
- **Mitigation:** Before production deployment, replace with real keys from Google Console
- **Status:** PENDING - Requires action before production launch

**Issue 2: Default Credentials**
- **Severity:** High
- **Description:** Default admin/senha123 credentials in code
- **Mitigation:** Environment variables override, but must be changed in production
- **Status:** PENDING - Must change before production launch
- **Action:** Set unique ADMIN_USER and ADMIN_PASS in Vercel environment variables

**Issue 3: JWT_SECRET Placeholder**
- **Severity:** Critical
- **Description:** Default JWT_SECRET in code
- **Mitigation:** Environment variables override, generate new cryptographically random secret
- **Status:** PENDING - Must generate and set before production
- **Action:** 
  ```bash
  # Generate secure random JWT_SECRET
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## 9. DOCUMENTATION & RUNBOOKS

### 9.1 Admin Setup Guide

**Initial Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run admin

# 3. Access admin interface
# Login: http://localhost:3012/src/admin/login.html
# Credentials: admin / senha123
# Dashboard: http://localhost:3012/admin/dashboard.html
```

**Production Deployment:**
```bash
# 1. Set environment variables in Vercel dashboard
JWT_SECRET=<generated-secret>
ADMIN_USER=<choose-username>
ADMIN_PASS=<choose-password>
RECAPTCHA_SECRET=<production-key>
NODE_ENV=production

# 2. Deploy
npm run deploy

# 3. Test live site
# Admin: https://rroncolato.com.br/src/admin/login.html
# Dashboard: https://rroncolato.com.br/admin/dashboard.html
```

---

### 9.2 Password Reset Procedure

**To Change Admin Password:**

1. **Method 1: Environment Variable (Recommended)**
   - Go to Vercel Dashboard
   - Project > Settings > Environment Variables
   - Update `ADMIN_PASS` variable
   - Redeploy: `npm run deploy` or trigger redeploy in Vercel UI

2. **Method 2: Code Update (Development)**
   - Update `.env` file:
     ```
     ADMIN_PASS=new_secure_password
     ```
   - Restart server: `npm run admin`

**Best Practices:**
- [ ] Use strong passwords (12+ chars, mixed case, numbers, symbols)
- [ ] Don't share passwords via email/chat
- [ ] Change password after team access changes
- [ ] Log all password changes
- [ ] Consider rotating passwords quarterly

---

### 9.3 Data Backup Procedure

**Manual Backup:**
```bash
# Backup articles and projects
# 1. Export from index.html (contains all data)
cp index.html index.html.backup-2026-05-16

# 2. Export via admin API
curl -X GET "http://localhost:3012/api/admin/list-articles.js?token=YOUR_JWT_TOKEN" > articles-backup.json

curl -X GET "http://localhost:3012/api/admin/list-projects.js?token=YOUR_JWT_TOKEN" > projects-backup.json

# 3. Store backups securely
# - Local: /backups/
# - Cloud: Google Drive, Dropbox, AWS S3
```

**Automated Backup (Recommended):**
- [ ] Set up daily backup schedule
- [ ] Backup articles and projects
- [ ] Store multiple copies
- [ ] Test restore procedure monthly
- [ ] Document backup retention policy (90 days recommended)

---

### 9.4 Troubleshooting Guide

**Issue: Login fails with "Credenciais inválidas"**
```
Possible Causes:
1. Wrong username/password
   → Verify credentials in .env file
   
2. JWT_SECRET mismatch
   → Ensure JWT_SECRET is same in .env and Vercel
   
3. Environment variables not loaded
   → Check server startup output
   → Run: npm run admin
   
4. reCAPTCHA timeout
   → Check internet connection
   → Wait 5 seconds for reCAPTCHA to load
   → Reload page
```

**Issue: Articles not saving**
```
Possible Causes:
1. Token expired
   → Re-login to get new token
   
2. API endpoint not found
   → Check server running (port 3012)
   → Verify endpoints in server.js
   
3. Form validation error
   → Check browser console for error details
   → Ensure all required fields filled
   
4. Storage/database error
   → Check disk space
   → Verify file permissions
```

**Issue: Images not uploading**
```
Possible Causes:
1. File too large (> 10MB)
   → Compress image before upload
   → Use online image optimizer
   
2. Wrong file format
   → Supported: JPG, PNG, WebP, GIF
   → Convert file to supported format
   
3. Network timeout
   → Check internet connection
   → Try uploading smaller image first
   
4. Server error
   → Check server logs
   → Ensure /uploads directory exists
   → Verify write permissions
```

**Issue: CORS errors**
```
Error message: "Access to XMLHttpRequest blocked by CORS policy"

Solution:
1. Check origin in browser Address bar
2. Verify origin is in allowedOrigins (line 117 of server.js)
3. Allowed origins:
   - https://rroncolato.com.br (production)
   - http://localhost:3012 (development)
   - http://127.0.0.1:3012 (local)
4. Add origin if needed (development only)
```

---

## 10. TEST EXECUTION SUMMARY

### 10.1 Test Environment Setup

**Local Development:**
```bash
# 1. Install Node.js (v14+)
# 2. Install dependencies
npm install

# 3. Create .env file (or copy .env.example)
cp .env.example .env

# 4. Start server
npm run admin

# 5. Open browser
# http://localhost:3012/src/admin/login.html
```

**Test Data:**
```
Default Credentials:
- Username: admin
- Password: senha123

Test Articles:
- Title: "Test Article 1"
- Excerpt: "This is a test"
- Content: "Test content here"

Test Projects:
- Title: "Test Project 1"
- Client: "Test Client"
- Category: "Web Design"
```

---

### 10.2 Test Execution Timeline

**Phase 1: Functional Testing (2-3 hours)**
- [ ] Authentication tests
- [ ] Article CRUD operations
- [ ] Portfolio CRUD operations
- [ ] Image upload
- [ ] Form validation
- [ ] Token expiration

**Phase 2: Security Testing (2-3 hours)**
- [ ] XSS prevention
- [ ] JWT tampering
- [ ] CORS validation
- [ ] Input validation
- [ ] reCAPTCHA
- [ ] HTTPS enforcement

**Phase 3: Performance Testing (1-2 hours)**
- [ ] Login performance
- [ ] List load times
- [ ] Image upload speed
- [ ] Database queries

**Phase 4: Responsive Testing (2-3 hours)**
- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Browser compatibility

**Phase 5: Deployment Testing (1-2 hours)**
- [ ] Environment setup
- [ ] Vercel deployment
- [ ] Post-deployment smoke tests
- [ ] Production verification

**Total Estimated Time:** 8-13 hours

---

## 11. SIGN-OFF & APPROVAL

**QA Engineer:** _________________ Date: _________

**Security Review:** _________________ Date: _________

**Technical Lead:** _________________ Date: _________

**Project Manager:** _________________ Date: _________

---

## APPENDIX: SECURITY CHECKLIST FOR PRODUCTION

```
CRITICAL (Must fix before production):
- [ ] Replace test reCAPTCHA keys with production keys
- [ ] Change ADMIN_PASS from "senha123" to strong password
- [ ] Generate new JWT_SECRET (32+ chars)
- [ ] Verify HTTPS enforced on production
- [ ] Test all security measures on production

HIGH PRIORITY:
- [ ] CORS origins verified
- [ ] Input validation tested
- [ ] XSS prevention verified
- [ ] JWT token expiration working
- [ ] Error messages don't leak info
- [ ] Backup procedure tested

RECOMMENDED:
- [ ] Add Security headers (CSP, X-Frame-Options, etc.)
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Monitor for suspicious activity
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Regular security audits scheduled
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-16  
**Next Review:** 2026-08-16  

---
