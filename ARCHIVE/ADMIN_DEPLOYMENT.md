# Admin Area Deployment Guide

## Overview
The admin area has been configured for Vercel deployment with support for both local development and production environments.

## Key Files
- `/api/admin/[...route].js` - Dynamic API route handler for all admin endpoints
- `/src/admin/login.html` - Admin login page
- `/src/admin/dashboard.html` - Main admin dashboard
- `/src/admin/novo-artigo.html` - Create new article page
- `/src/admin/novo-projeto.html` - Create new project page
- `/src/admin/components.js` - Shared UI components (Toast, etc.)
- `/src/admin/styles-admin.css` - Admin styling
- `/src/admin/app.js` - Main admin app logic
- `vercel.json` - Vercel configuration with /admin routes

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file in the project root:
```
JWT_SECRET=your-development-secret-key
ADMIN_USER=admin
ADMIN_PASS=senha123
```

### 3. Run Local Development Server
```bash
npm run admin
```

The admin area will be available at `http://localhost:8000/admin/login.html`

### 4. Default Credentials
- Username: `admin`
- Password: `senha123`

## Vercel Deployment

### 1. Connect Repository
```bash
vercel --prod --yes
```

### 2. Set Environment Variables in Vercel Dashboard

Go to your project settings in Vercel and add these environment variables:

**Required:**
- `JWT_SECRET` - Generate a strong random string (minimum 32 characters)
  ```bash
  # Generate one locally:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `ADMIN_USER` - Your admin username (e.g., `admin`)
- `ADMIN_PASS` - Your admin password (use a strong password)

**Optional:**
- `ARTICLES_DATA` - JSON string of initial articles (for seeding the database)
- `PROJECTS_DATA` - JSON string of initial projects (for seeding the database)

### 3. Data Persistence

**⚠️ Important:** Vercel's serverless functions have ephemeral filesystems. Data stored in memory or `/tmp` will not persist between function invocations.

#### Current Implementation:
- Data is cached in memory during serverless function execution
- For permanent persistence, you must implement one of:

**Option A: External Database (Recommended)**
- PostgreSQL (e.g., Vercel Postgres, Supabase)
- MongoDB (e.g., MongoDB Atlas)
- Any REST API that your serverless functions can call

**Option B: Vercel Blob Storage** (coming soon)
Requires `@vercel/blob` package installation

**Option C: Environment Variables** (for small datasets only)
Store JSON data in Vercel environment variables (max size limits apply)

### 4. File Upload Handling

The current `/api/admin/upload` endpoint needs configuration for Vercel:

**Local Development:**
- Files are stored in `/public/assets/IMG/blog` and `/public/assets/IMG/portfolio`

**Production (Vercel):**
- Configure uploads to use Vercel Blob storage or external service
- Update the upload endpoint in your API handler
- Update the HTML forms to point to the correct endpoints

### 5. Access the Admin Area

After deployment:
1. Visit `https://your-domain.vercel.app/admin/login.html`
2. Log in with your configured `ADMIN_USER` and `ADMIN_PASS`
3. You'll be redirected to the dashboard

## Troubleshooting

### Admin Pages Not Loading
- Check that `/src/admin/` files exist in the repository
- Verify rewrites in `vercel.json` are correct

### API Endpoints Returning 404
- Ensure `/api/admin/[...route].js` exists
- Check that the route parameter is properly configured

### Data Not Persisting Between Requests
- This is expected in current implementation
- Implement external database as described in "Data Persistence" section

### Authentication Issues
- Verify environment variables are set correctly in Vercel
- Check JWT_SECRET is consistent (generate once and reuse)
- Clear browser cache and localStorage

## Next Steps

1. **Set up external database** for data persistence
2. **Configure file uploads** to use Vercel Blob storage
3. **Add image processing** with Sharp for thumbnail generation
4. **Implement article/project editing** pages (editar-artigo.html, editar-projeto.html)
5. **Add content caching** for improved performance

## Security Recommendations

- Change default credentials immediately
- Use a strong, unique password (minimum 16 characters)
- Rotate JWT_SECRET regularly
- Never commit `.env` files with real secrets to git
- Use HTTPS only (automatic with Vercel)
- Consider adding rate limiting to API endpoints
- Add CSRF protection if needed

## Support

For issues with deployment or configuration, check:
- Vercel documentation: https://vercel.com/docs
- Vercel community: https://vercel.com/support
