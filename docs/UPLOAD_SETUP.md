# File Upload Configuration for Vercel

## Problem
The current file upload implementation in `novo-artigo.html` and `novo-projeto.html` saves files to the local filesystem, which won't work on Vercel because:
- Serverless function filesystems are ephemeral (deleted after function execution)
- Files uploaded in one invocation won't be available in the next invocation

## Solutions

### Option 1: Vercel Blob Storage (Recommended)
Store images in Vercel's serverless blob storage.

#### Setup:
1. Install package:
```bash
npm install @vercel/blob
```

2. Create `/api/admin/upload.js`:
```javascript
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, type, filename } = req.body;
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const blob = await put(`admin/${type}/${filename}`, buffer, {
      access: 'public',
    });

    return res.status(201).json({ 
      success: true, 
      path: blob.url,
      filename: blob.pathname 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

3. Update HTML form endpoints from `/api/admin/upload` to `/api/admin/upload.js`

### Option 2: External Service (Cloudinary, AWS S3, etc.)
Use a third-party image hosting service.

Example with Cloudinary:
```javascript
// In your upload handler
const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
  method: 'POST',
  body: formData,
});
```

### Option 3: Base64 Data URIs (Limited)
Store images as base64 strings in the database (not recommended for large files).

- Pros: Simple, no external dependencies
- Cons: Increases database size, slower performance

### Option 4: Database with Attachment Field
Use a database like PostgreSQL with `bytea` or MongoDB with GridFS for storing binary image data.

## Current Local Setup

The local `/api/admin/upload` endpoint saves files to:
- Blog: `/public/assets/IMG/blog/`
- Portfolio: `/public/assets/IMG/portfolio/`

This works fine for local development but requires migration for Vercel.

## Migration Steps

1. Choose your upload solution (recommend Vercel Blob)
2. Implement the upload endpoint
3. Update the form submission code in `novo-artigo.html` and `novo-projeto.html`
4. Test the upload functionality
5. Deploy to Vercel

## Example Frontend Change

Before (current):
```javascript
const response = await fetch('/api/admin/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ file: base64Data, type: 'blog' })
});
```

After (with dynamic filename):
```javascript
const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
const response = await fetch('/api/admin/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    file: base64Data, 
    type: 'blog',
    filename: filename 
  })
});
```

## Recommended Path Forward

1. Start with Vercel Blob (built into Vercel, easiest integration)
2. Set up Vercel Blob as environment variable in Vercel dashboard
3. Create `/api/admin/upload.js` endpoint
4. Update frontend forms to use new endpoint
5. Test locally with `npm run admin`
6. Deploy with `npm run deploy`
