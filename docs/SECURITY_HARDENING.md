# Security Hardening Guide - Roncolato Admin System

**Version:** 1.0  
**Date:** 2026-05-16  
**Classification:** Internal Use Only  

---

## EXECUTIVE SUMMARY

This document outlines critical security measures required before production deployment. All items marked **CRITICAL** must be completed before going live.

---

## CRITICAL SECURITY REQUIREMENTS

### 1. JWT Secret Key (CRITICAL)

**Current Status:** Using default placeholder key

**Required Action:**
```bash
# Generate cryptographically secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

**Implementation:**
1. Copy the generated hex string
2. Set in `.env.production`:
   ```
   JWT_SECRET=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
   ```
3. Set in Vercel Environment Variables:
   - Dashboard → Settings → Environment Variables
   - Add: `JWT_SECRET` = [generated value]
   - Mark as: Encrypted

**Verification:**
- [ ] JWT_SECRET is 32+ bytes (64+ hex characters)
- [ ] JWT_SECRET never appears in code
- [ ] JWT_SECRET never committed to git
- [ ] JWT_SECRET differs from development key

---

### 2. Admin Credentials (CRITICAL)

**Current Status:** Default credentials (admin / senha123)

**Required Action:**

1. **Choose Unique Username:**
   ```
   DO NOT USE:
   - admin
   - administrator
   - user
   - test
   - root
   
   USE EXAMPLES:
   - sr_2024_admin
   - roncolato_portal_admin
   - platform_admin_01
   ```

2. **Generate Strong Password:**
   ```
   Requirements:
   - Minimum 20 characters
   - Uppercase letters (A-Z)
   - Lowercase letters (a-z)
   - Numbers (0-9)
   - Special characters (!@#$%^&*)
   - No dictionary words
   - No personal information
   
   Example: Tr0pic@1Sun$et2024!SecureAdm1nP0rt@l
   ```

3. **Store Securely:**
   ```
   Option 1: Password Manager (Recommended)
   - 1Password
   - LastPass
   - Bitwarden
   - KeePass
   
   Option 2: Secure Vault
   - Encrypted document
   - Shared via secure channel
   - Not in email/chat
   ```

4. **Set in Vercel:**
   ```
   Environment Variables:
   - ADMIN_USER = [your-username]
   - ADMIN_PASS = [your-password]
   ```

**Verification:**
- [ ] ADMIN_USER changed from "admin"
- [ ] ADMIN_PASS changed from "senha123"
- [ ] Password is 20+ characters
- [ ] Password includes uppercase, lowercase, numbers, symbols
- [ ] Credentials stored securely (not in code/git)
- [ ] Credentials documented for team only

---

### 3. reCAPTCHA Production Keys (CRITICAL)

**Current Status:** Using test keys (non-functional in production)

**Required Action:**

1. **Access Google reCAPTCHA Console:**
   ```
   URL: https://www.google.com/recaptcha/admin
   Sign in with project Google account
   ```

2. **Create New Site:**
   - Label: "Roncolato Admin"
   - reCAPTCHA type: **v3**
   - Domains:
     - rroncolato.com.br
     - www.rroncolato.com.br

3. **Copy Keys:**
   ```
   Site Key: (for frontend - public)
   Secret Key: (for backend - secret)
   ```

4. **Update Frontend:**
   - File: `/src/admin/login.html`
   - Line 138:
     ```javascript
     const RECAPTCHA_SITE_KEY = 'YOUR_PRODUCTION_SITE_KEY';
     ```

5. **Update Backend:**
   - Set in `.env.production`:
     ```
     RECAPTCHA_SECRET=YOUR_PRODUCTION_SECRET_KEY
     ```
   - Set in Vercel Environment Variables

**Verification:**
- [ ] reCAPTCHA keys are production keys
- [ ] Site key only (not secret) in frontend code
- [ ] Secret key only in backend/env
- [ ] Domain verified in Google Console
- [ ] reCAPTCHA v3 configured (not v2)
- [ ] Score threshold tested (0.3-0.5)

---

## HIGH-PRIORITY SECURITY ITEMS

### 4. CORS Configuration Review

**Current Configuration (server.js line 117):**
```javascript
const allowedOrigins = [
  'https://rroncolato.com.br',
  'http://localhost:3012',
  'http://127.0.0.1:3012'
];
```

**Security Review:**
- [ ] Remove localhost origins for production
- [ ] Only include production domain
- [ ] Verify wildcard (*) NOT used
- [ ] Check origin validation on every request

**Production Configuration Should Be:**
```javascript
const allowedOrigins = ['https://rroncolato.com.br'];
```

**Testing:**
```bash
# Test allowed origin
curl -i -H "Origin: https://rroncolato.com.br" \
  https://rroncolato.com.br/api/admin/list-articles.js

# Should include:
# Access-Control-Allow-Origin: https://rroncolato.com.br

# Test disallowed origin
curl -i -H "Origin: https://attacker.com" \
  https://rroncolato.com.br/api/admin/list-articles.js

# Should NOT include CORS header
```

---

### 5. Input Validation & XSS Prevention

**Current Status:** Partial implementation

**Required Actions:**

1. **Verify HTML Escaping:**
   - Check all user input is escaped
   - Article titles, content, descriptions
   - Project names, descriptions

2. **Test XSS Vectors:**
   ```
   Try to save article with title:
   <script>alert('XSS')</script>
   
   Result should be:
   &lt;script&gt;alert('XSS')&lt;/script&gt;
   ```

3. **Content Security Policy (Recommended):**
   Add to response headers:
   ```javascript
   res.setHeader(
     'Content-Security-Policy',
     "default-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/"
   );
   ```

**Acceptance Criteria:**
- [ ] No <script> tags execute from user input
- [ ] HTML entities encoded properly
- [ ] Event handlers removed
- [ ] Safe rendering functions used (textContent not innerHTML)

---

### 6. HTTPS & TLS Configuration

**Production Requirements:**
- [ ] HTTPS enforced (redirect HTTP to HTTPS)
- [ ] SSL certificate valid and current
- [ ] TLS 1.2 or higher
- [ ] No self-signed certificates
- [ ] HSTS header configured

**Vercel Configuration:**
```
Automatically provides:
- [ ] SSL certificate (Let's Encrypt)
- [ ] HTTPS redirect
- [ ] TLS 1.3 support
- [ ] HSTS headers

Verify in browser:
- [ ] No "Not Secure" warning
- [ ] Certificate shows rroncolato.com.br
- [ ] Certificate valid for > 1 month
```

---

### 7. Environment Variable Security

**Verification Checklist:**
- [ ] No secrets in code files
- [ ] No secrets in .gitignore exceptions
- [ ] `.env` not committed to git
- [ ] `.env.production` not committed to git
- [ ] Secrets only in Vercel environment variables
- [ ] Sensitive variables marked as "Encrypted"
- [ ] Different secrets for different environments

**Git Security Check:**
```bash
# Search for exposed secrets
git log -p | grep -i "password\|secret\|api_key"

# Search codebase
grep -r "JWT_SECRET=" --include="*.js"
grep -r "senha123" --include="*.js"
grep -r "ADMIN_PASS=" --include="*.js"

# All should return no results (except .env.example)
```

---

### 8. JWT Token Security

**Token Configuration:**
- [ ] Algorithm: HS256 (HMAC-SHA256)
- [ ] Secret: 32+ bytes cryptographically random
- [ ] Expiration: 24 hours
- [ ] Payload contains only non-sensitive data
- [ ] Signature verified on every request

**Code Review (server.js):**
```javascript
// Line 25-49: signJWT function
// Verifies: HMAC-SHA256 signature creation

// Line 51-81: verifyJWT function
// Checks: Signature validity and expiration

// Line 141-145: Token expiration
exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
```

**Token Testing:**
```bash
# 1. Get valid token
# Login and copy JWT from localStorage

# 2. Modify token
# Change any character in token

# 3. Try to use modified token
# Verify request rejected (401)

# 4. Wait 24+ hours (simulate)
# Manually update exp in token
# Verify request rejected (401)
```

---

### 9. Error Handling & Information Disclosure

**Security Review:**
- [ ] Generic error messages shown to users
- [ ] Detailed errors only in server logs
- [ ] No stack traces exposed in responses
- [ ] No database errors shown to users
- [ ] No file paths shown to users

**Review Error Messages:**

Current (Safe):
```javascript
res.status(401).json({ error: 'Usuário ou senha incorretos' });
```

Don't Do This (Unsafe):
```javascript
res.status(401).json({ error: 'User not found in database' });
// Reveals username enumeration
```

---

### 10. Rate Limiting (Recommended)

**Implementation (Production):**
```javascript
// Limit login attempts
// 5 attempts per 15 minutes per IP

// Implement using:
// - express-rate-limit (if Express)
// - Custom middleware
// - Vercel Edge Functions
```

**Recommendation:**
```javascript
// Add to auth endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Muitas tentativas de login, tente novamente mais tarde'
});
```

---

## SECURITY CHECKLIST FOR DEPLOYMENT

### Pre-Production Tasks

```
CRITICAL (Must complete):
[ ] JWT_SECRET generated and set
[ ] ADMIN_USER changed from "admin"
[ ] ADMIN_PASS changed from "senha123"
[ ] reCAPTCHA production keys configured
[ ] CORS localhost origins removed
[ ] Git contains no secrets
[ ] HTTPS enforced
[ ] All sensitive data in env variables

HIGH PRIORITY (Strongly recommended):
[ ] XSS prevention verified
[ ] Input validation tested
[ ] Error messages reviewed
[ ] CORS headers verified
[ ] JWT token tested and verified
[ ] Rate limiting considered
[ ] Security headers added (CSP, etc.)
[ ] Dependencies scanned for vulnerabilities

RECOMMENDED (Nice to have):
[ ] Automated security scanning
[ ] Penetration testing
[ ] Audit logging implemented
[ ] Monitoring/alerting set up
[ ] Security documentation updated
[ ] Team security training completed
[ ] Incident response plan created
```

---

## VULNERABILITY SCANNING

### Check Dependencies for Known Vulnerabilities

```bash
# Scan for vulnerabilities
npm audit

# Example output:
# 3 vulnerabilities found
# Run: npm audit fix
```

**Action:**
```bash
# Fix vulnerabilities
npm audit fix

# If fix unavailable, evaluate risk:
# - Review CVE details
# - Assess impact
# - Plan upgrade path
```

**Security Monitoring:**
```
Consider services:
- npm audit (built-in)
- Snyk (snyk.io)
- GitHub Dependabot
- WhiteSource
```

---

## COMPLIANCE CHECKLIST

### OWASP Top 10 (2021)

```
A01: Broken Access Control
[ ] Authentication verified
[ ] Authorization working
[ ] JWT tokens validated
[ ] Permissions enforced

A02: Cryptographic Failures
[ ] Secrets encrypted
[ ] HTTPS enforced
[ ] Sensitive data in transit protected
[ ] Sensitive data at rest protected

A03: Injection
[ ] Input validation implemented
[ ] Parameterized queries (if DB)
[ ] XSS prevention
[ ] Command injection prevention

A04: Insecure Design
[ ] Threat modeling done
[ ] Secure design patterns used
[ ] Least privilege principle
[ ] Security by default

A05: Security Misconfiguration
[ ] Default credentials changed
[ ] Debugging disabled
[ ] Security headers set
[ ] Error messages generic

A06: Vulnerable Components
[ ] Dependencies scanned
[ ] Vulnerable packages patched
[ ] Version pinning considered
[ ] Update procedure in place

A07: Authentication Failures
[ ] Strong password policy
[ ] Secure password storage (if applicable)
[ ] Session timeout implemented
[ ] Multi-factor auth (future consideration)

A08: Software & Data Integrity
[ ] Secure deployment pipeline
[ ] Code review process
[ ] Dependency verification
[ ] Integrity checks

A09: Logging & Monitoring
[ ] Logging implemented
[ ] Monitoring set up
[ ] Alerts configured
[ ] Audit trail maintained

A10: SSRF
[ ] URL validation
[ ] Redirect validation (if applicable)
```

---

## INCIDENT RESPONSE PLAN

### If Credentials Compromised

**Immediate Actions (< 1 hour):**
1. [ ] Change ADMIN_PASS immediately
2. [ ] Review access logs for suspicious activity
3. [ ] Check for unauthorized articles/projects
4. [ ] Rotate JWT_SECRET
5. [ ] Force all users to re-login

**Short-term (24 hours):**
1. [ ] Change all credentials
2. [ ] Review recent changes/deletions
3. [ ] Restore from backup if needed
4. [ ] Update security group
5. [ ] Enhanced monitoring

**Long-term (1 week):**
1. [ ] Incident review
2. [ ] Update security procedures
3. [ ] Team training
4. [ ] Implement additional controls

---

## SECURITY MONITORING

### Recommended Tools

**Error Tracking:**
- [ ] Sentry (sentry.io)
- [ ] Rollbar (rollbar.com)
- [ ] Bugsnag (bugsnag.com)

**Security Monitoring:**
- [ ] Vercel Analytics
- [ ] Google Security Console
- [ ] CloudFlare WAF (if using CDN)

**Dependency Monitoring:**
- [ ] Dependabot (GitHub)
- [ ] Snyk
- [ ] WhiteSource

### Log Review Process

**Weekly:**
- [ ] Check for failed login attempts
- [ ] Review 401/403 errors
- [ ] Check for unusual API patterns

**Monthly:**
- [ ] Security logs review
- [ ] Access pattern analysis
- [ ] Dependency updates check

---

## SECURE DEFAULTS

### Production Environment Variables

Recommended template:
```
# Security
JWT_SECRET=[cryptographically-random-32-bytes]
ADMIN_USER=[unique-username]
ADMIN_PASS=[strong-20-char-password]
RECAPTCHA_SECRET=[google-recaptcha-secret]

# Environment
NODE_ENV=production

# Optional Additions (Future)
# DATABASE_URL=[encrypted-connection-string]
# LOG_LEVEL=error
# SENTRY_DSN=[error-tracking-url]
# RATE_LIMIT_WINDOW=900
# RATE_LIMIT_MAX_REQUESTS=5
```

---

## TEAM SECURITY PRACTICES

### Password Sharing Best Practices

**DO:**
- [ ] Share via password manager (1Password, LastPass)
- [ ] Share via encrypted channel
- [ ] Limit access to need-to-know basis
- [ ] Rotate passwords when team changes
- [ ] Use separate admin accounts per person (if possible)

**DON'T:**
- [ ] Share via email
- [ ] Share via Slack/Teams
- [ ] Store in shared documents
- [ ] Use same password for multiple systems
- [ ] Include in code or comments

---

## FUTURE SECURITY ENHANCEMENTS

### Recommended Additions (Post-Launch)

**Short-term (3 months):**
- [ ] Implement audit logging
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring/alerting
- [ ] Multi-factor authentication (MFA)
- [ ] Rate limiting on endpoints

**Medium-term (6 months):**
- [ ] Database for persistent storage
- [ ] User management system
- [ ] Activity logging
- [ ] Advanced threat detection

**Long-term (12 months):**
- [ ] API security framework
- [ ] OAuth 2.0 integration
- [ ] Single sign-on (SSO)
- [ ] Advanced access control (RBAC)

---

## SECURITY CONTACT & ESCALATION

**Security Issues Found:**
1. Document issue with details
2. Email security contact (encrypted if possible)
3. Do not disclose publicly
4. Wait for response before patching publicly

**Contact:** [security@rroncolato.com.br]

---

## SIGN-OFF

This security hardening guide must be reviewed and approved before production deployment.

**Reviewed By:** _________________ Date: _________

**Approved By:** _________________ Date: _________

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-16  
**Classification:** Internal Use Only  
**Review Schedule:** Before every deployment, quarterly otherwise  

---
