# Deployment Guide - Roncolato Admin System

**Version:** 1.0  
**Date:** 2026-05-16  
**Target:** Vercel (rroncolato.com.br)  

---

## TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Security Hardening](#security-hardening)
3. [Environment Setup](#environment-setup)
4. [Vercel Configuration](#vercel-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Rollback Procedure](#rollback-procedure)
8. [Troubleshooting](#troubleshooting)

---

## PRE-DEPLOYMENT CHECKLIST

### Code Repository
- [ ] All changes committed to git
- [ ] No uncommitted files with sensitive data
- [ ] Latest code merged to main/master branch
- [ ] All tests passing (npm run test, if configured)
- [ ] Code review completed
- [ ] No debug code or console.log statements
- [ ] No TODO/FIXME comments in critical sections

### Documentation
- [ ] README.md updated with setup instructions
- [ ] API documentation complete
- [ ] Deployment procedures documented
- [ ] Troubleshooting guide created
- [ ] Database schema documented (if applicable)

### Data Integrity
- [ ] Current production data backed up
- [ ] Backup verified (restore test completed)
- [ ] Database migrations planned (if needed)
- [ ] Data validation scripts written
- [ ] Rollback plan documented

### Security Clearance
- [ ] Security audit completed
- [ ] Penetration testing done (optional)
- [ ] Vulnerability scanning passed
- [ ] OWASP Top 10 items addressed
- [ ] Code security review completed
- [ ] Dependencies updated and scanned

---

## SECURITY HARDENING

### Generate New Cryptographic Keys

**1. Generate JWT_SECRET**
```bash
# Generate 32-byte random hex string (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Record this value securely.** This will be your JWT_SECRET.

### Change Admin Credentials

**1. Choose Strong Password**
```
Requirements:
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- No dictionary words
- No personal information

Example: Tr0pic@1Sun$et2024!Secure#Admin
```

**2. Choose Unique Username**
```
Don't use: admin, administrator, user, test
Use: Something unique like: sr_admin_2024
```

### Obtain reCAPTCHA Production Keys

**1. Go to Google reCAPTCHA Console:**
- Visit: https://www.google.com/recaptcha/admin
- Sign in with Google account
- Create new site

**2. Configure Site:**
- Name: "Roncolato Admin"
- reCAPTCHA Type: v3
- Domains:
  - rroncolato.com.br
  - www.rroncolato.com.br
- Accept reCAPTCHA Terms
- Submit

**3. Copy Keys:**
- Site Key: (for frontend)
- Secret Key: (for backend)

---

## ENVIRONMENT SETUP

### 1. Create Production Environment File

Create `.env.production`:
```
JWT_SECRET=<generated-32-char-hex-string>
ADMIN_USER=<your-chosen-username>
ADMIN_PASS=<your-strong-password>
RECAPTCHA_SECRET=<google-recaptcha-secret-key>
NODE_ENV=production
```

**Do NOT commit this file to git!**

### 2. Verify .env.production is in .gitignore

```bash
# Check .gitignore
cat .gitignore

# Should contain:
# .env
# .env.local
# .env.production
# .env.*.local

# If not, add:
echo ".env.production" >> .gitignore
```

### 3. Create .env.example (for documentation)

```
JWT_SECRET=<CHANGE_ME - generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
ADMIN_USER=<CHANGE_ME>
ADMIN_PASS=<CHANGE_ME>
RECAPTCHA_SECRET=<CHANGE_ME>
NODE_ENV=production
```

---

## VERCEL CONFIGURATION

### 1. Vercel Project Setup

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Login to Vercel:**
```bash
vercel login
# Follow prompts to authenticate
```

**Link Project:**
```bash
vercel link
# Choose: Create new Vercel project
# Project name: site-roncolato
# Framework: Other
# Root directory: ./
```

### 2. Configure Environment Variables

**Method A: Via Vercel CLI**
```bash
vercel env add JWT_SECRET
# Paste: <your-generated-JWT_SECRET>
# Environment: production

vercel env add ADMIN_USER
# Paste: <your-username>
# Environment: production

vercel env add ADMIN_PASS
# Paste: <your-password>
# Environment: production

vercel env add RECAPTCHA_SECRET
# Paste: <google-secret-key>
# Environment: production

vercel env add NODE_ENV
# Paste: production
# Environment: production
```

**Method B: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select project: "site-roncolato"
3. Settings → Environment Variables
4. Add each variable:
   - `JWT_SECRET` = [hidden]
   - `ADMIN_USER` = [hidden]
   - `ADMIN_PASS` = [hidden]
   - `RECAPTCHA_SECRET` = [hidden]
   - `NODE_ENV` = production (not hidden)
5. Mark sensitive variables as "Encrypted"

### 3. Create vercel.json Configuration

Create `vercel.json` in project root:
```json
{
  "version": 2,
  "env": [
    "JWT_SECRET@production",
    "ADMIN_USER@production",
    "ADMIN_PASS@production",
    "RECAPTCHA_SECRET@production",
    "NODE_ENV@production"
  ],
  "buildCommand": "npm install",
  "framework": "nodejs",
  "nodeVersion": "18.x",
  "regions": ["sfo1"],
  "routes": [
    {
      "src": "/api/admin/auth",
      "dest": "/server.js",
      "methods": ["POST", "OPTIONS"]
    },
    {
      "src": "/api/admin/(.*)",
      "dest": "/server.js",
      "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Configure Custom Domain

**Via Vercel Dashboard:**
1. Project Settings → Domains
2. Add Domain: `rroncolato.com.br`
3. Configure DNS:
   - Type: CNAME
   - Name: (leave blank or @)
   - Value: cname.vercel-dns.com

**DNS Configuration (at domain registrar):**
1. Log in to domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS settings
3. Add/update CNAME record:
   ```
   Name: @ (or leave blank)
   Type: CNAME
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
4. Wait 24-48 hours for DNS propagation

**Verify SSL Certificate:**
- Vercel automatically provisions SSL
- Check: https://rroncolato.com.br (should work)

---

## DEPLOYMENT STEPS

### Step 1: Final Code Review

```bash
# Check for any uncommitted changes
git status

# Review recent commits
git log --oneline -5

# Verify no sensitive data in code
grep -r "senha123" src/
grep -r "JWT_SECRET" src/
grep -r "ADMIN_PASS" src/

# All should return no results (except in .env.example)
```

### Step 2: Create Deployment Commit

```bash
# Update version number in package.json (optional)
# "version": "1.0.1"

# Commit deployment-ready code
git add -A
git commit -m "chore: prepare for production deployment v1.0.1"

# Tag release
git tag -a v1.0.1 -m "Production release v1.0.1"

# Push to repository
git push origin main
git push origin v1.0.1
```

### Step 3: Verify All Environment Variables

```bash
# Check Vercel has all variables
vercel env list

# Output should show:
# JWT_SECRET = [encrypted]
# ADMIN_USER = [encrypted]
# ADMIN_PASS = [encrypted]
# RECAPTCHA_SECRET = [encrypted]
# NODE_ENV = production
```

### Step 4: Deploy to Production

**Option A: Using npm script**
```bash
npm run deploy
# or
vercel --prod --yes
```

**Option B: Using Vercel CLI**
```bash
vercel --prod
# Review deployment details
# Confirm: "Deploy to production?" → y
```

**Option C: Automatic Deployment (Recommended)**
- Connect GitHub to Vercel
- Set branch: main
- Automatic deployment on git push

### Step 5: Monitor Deployment

```bash
# Watch deployment progress
vercel deploy --prod --confirm

# Output shows:
# ✓ Deployed to https://rroncolato.com.br
```

**Track in Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select "site-roncolato" project
3. View Deployments tab
4. Monitor build and deployment status

---

## POST-DEPLOYMENT VERIFICATION

### Immediate Checks (5-10 minutes after deployment)

**1. Website Accessibility**
```
Test URLs:
- https://rroncolato.com.br/ (homepage)
- https://rroncolato.com.br/blog (articles)
- https://rroncolato.com.br/portfolio (projects)
- https://rroncolato.com.br/src/admin/login.html (admin login)
```

**2. HTTPS Verification**
```
✓ https:// loads without warnings
✓ No "Not Secure" warning
✓ SSL certificate valid
✓ No mixed content warnings
```

**3. Admin Login Test**
```bash
# Test login credentials
URL: https://rroncolato.com.br/src/admin/login.html
Username: <your-configured-username>
Password: <your-configured-password>

Expected: Login successful, redirect to dashboard
```

**4. API Endpoints Test**
```bash
# Test authentication endpoint
curl -X POST https://rroncolato.com.br/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"<username>","password":"<password>"}'

# Expected response:
# {"success":true,"token":"<JWT_TOKEN>","user":"<username>"}
```

### Functional Verification (15-30 minutes)

**1. Articles Management**
```
- [ ] List articles loads
- [ ] Create new article works
- [ ] Article appears on blog
- [ ] Edit article works
- [ ] Delete article works
```

**2. Portfolio Management**
```
- [ ] List projects loads
- [ ] Create new project works
- [ ] Project appears on portfolio
- [ ] Edit project works
- [ ] Delete project works
```

**3. Image Uploads**
```
- [ ] Upload test image succeeds
- [ ] Image displays in admin
- [ ] Image displays on public site
- [ ] Image properly optimized
```

### Security Verification (10-15 minutes)

**1. reCAPTCHA**
```
- [ ] reCAPTCHA script loads (Network tab)
- [ ] "Protegido por reCAPTCHA" displays
- [ ] reCAPTCHA token verified (production)
```

**2. CORS**
```bash
# Test CORS headers
curl -i https://rroncolato.com.br/api/admin/list-articles.js

# Should include:
# Access-Control-Allow-Origin: https://rroncolato.com.br
```

**3. JWT Security**
```bash
# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
  https://rroncolato.com.br/api/admin/list-articles.js

# Should return 401 Unauthorized
```

### Performance Verification (5-10 minutes)

**1. Page Load Times**
```
- [ ] Homepage loads: < 3 seconds
- [ ] Admin dashboard: < 3 seconds
- [ ] Articles list: < 2 seconds
- [ ] Login: < 2 seconds
```

**2. API Response Times**
```
- [ ] Auth endpoint: < 1 second
- [ ] List articles: < 500ms
- [ ] List projects: < 500ms
```

**3. Mobile Responsiveness**
```
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] All buttons clickable
- [ ] Forms usable on mobile
```

---

## ROLLBACK PROCEDURE

**If critical issues found after deployment:**

### Option 1: Revert to Previous Version

```bash
# View deployment history
vercel deployments

# Identify previous stable deployment
# Click "..." next to deployment → "Promote to Production"

# Or via CLI:
vercel rollback
# Select previous deployment
```

### Option 2: Manual Rollback

```bash
# Identify last working commit
git log --oneline

# Revert to previous commit
git revert HEAD
git push origin main

# Vercel auto-deploys the reverted code
```

### Option 3: Emergency Patch

```bash
# Fix issue in code
# Commit fix: git commit -m "fix: [issue description]"
# Push: git push origin main
# Vercel auto-deploys fix
```

### Communicate Status

1. Notify team of rollback
2. Document root cause
3. Create incident report
4. Schedule post-mortem

---

## TROUBLESHOOTING

### Issue: Environment Variables Not Loaded

**Symptoms:** Login fails with "Credenciais inválidas"

**Solution:**
```bash
# 1. Verify variables in Vercel dashboard
vercel env list

# 2. Re-deploy to ensure variables loaded
vercel --prod --force

# 3. Check server logs
vercel logs --follow

# 4. Check for typos in variable names
```

### Issue: reCAPTCHA Verification Failed

**Symptoms:** Login blocked, reCAPTCHA error

**Solution:**
```bash
# 1. Verify production reCAPTCHA keys are set
vercel env list | grep RECAPTCHA

# 2. Check domain in Google reCAPTCHA console
# Verify: rroncolato.com.br is added

# 3. Verify reCAPTCHA secret key is correct
# Compare with Google Console

# 4. Re-deploy after changes
vercel --prod
```

### Issue: CORS Errors in Browser

**Symptoms:** Browser console shows CORS error

**Solution:**
```bash
# 1. Check allowed origins in server.js
# Line 117: const allowedOrigins = [...]

# 2. Update to production domain if needed:
# 'https://rroncolato.com.br'

# 3. Re-deploy
vercel --prod
```

### Issue: Deployment Fails

**Symptoms:** Build error, deployment timeout

**Solution:**
```bash
# 1. Check build logs
vercel logs --follow

# 2. Common issues:
# - Node modules not installed: npm install
# - Port already in use: change port in server.js
# - Missing environment variables: vercel env add

# 3. Try manual build
npm install
npm run build (if script exists)

# 4. Deploy again
npm run deploy
```

### Issue: Articles/Projects Not Persisting

**Symptoms:** Data lost after refresh

**Solution:**
```
# Current implementation stores data in index.html
# This is not persistent across deployments

# For persistent storage, migrate to:
- MongoDB (cloud database)
- Firebase
- Supabase
- AWS DynamoDB

# Recommended: Use Vercel KV (Redis) for quick setup
```

---

## MAINTENANCE

### Weekly Tasks

- [ ] Check Vercel deployment status
- [ ] Monitor error rates in logs
- [ ] Verify backups created
- [ ] Test login still works

### Monthly Tasks

- [ ] Review security logs
- [ ] Update dependencies: `npm update`
- [ ] Test rollback procedure
- [ ] Create full system backup

### Quarterly Tasks

- [ ] Security audit
- [ ] Performance review
- [ ] Database optimization
- [ ] Penetration testing

### Annually

- [ ] Major version upgrades
- [ ] Infrastructure review
- [ ] Business continuity test
- [ ] Compliance audit

---

## CONTACTS & SUPPORT

**Deployment Issues:** [Support Channel]  
**Security Issues:** [Security Contact]  
**Emergency Contacts:** [List]  

---

## APPENDIX: QUICK DEPLOYMENT CHECKLIST

```
BEFORE DEPLOYMENT:
[ ] Code committed
[ ] Tests passing
[ ] Security audit done
[ ] Data backed up
[ ] Environment variables generated
[ ] Custom domain configured

DURING DEPLOYMENT:
[ ] Deploy: npm run deploy
[ ] Monitor build progress
[ ] Verify no errors
[ ] Confirm deployment successful

AFTER DEPLOYMENT:
[ ] Test https://rroncolato.com.br
[ ] Test admin login
[ ] Test article creation
[ ] Test reCAPTCHA
[ ] Check performance
[ ] Verify CORS working
[ ] Monitor logs 1 hour
[ ] Notify team of completion
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-16  
**Next Review:** 2026-08-16  
