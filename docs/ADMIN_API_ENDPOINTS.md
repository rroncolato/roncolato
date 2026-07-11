# Admin API Endpoints - Complete Reference

**Version:** 1.0.0  
**Status:** Fully implemented with JSON persistence  
**Base URL:** `http://localhost:3012/api/admin`  (development)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Portfolio Endpoints](#portfolio-endpoints)
3. [Blog/Articles Endpoints](#blogarticles-endpoints)
4. [Error Handling](#error-handling)
5. [Testing Examples](#testing-examples)

---

## Authentication

### POST /auth - Login

Authenticate and receive a JWT token valid for 24 hours.

**Endpoint:** `POST /api/admin/auth`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "senha123",
  "recaptchaToken": "optional-recaptcha-v3-token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Error Responses:**
- `400` - Missing username or password
- `401` - Invalid credentials
- `403` - reCAPTCHA validation failed

**Important:**
- Token must be included in all subsequent requests
- Token expires after 24 hours
- Pass token either in:
  - Header: `Authorization: Bearer <token>`
  - Body: `{"token": "<token>", ...}`

---

## Portfolio Endpoints

### POST /portfolio/add - Create Project

Create a new portfolio project.

**Endpoint:** `POST /api/admin/portfolio/add`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Projeto Novo",
  "year": 2025,
  "client": "Cliente ABC",
  "category": "Personal Branding",
  "deliverable": "Sessão fotográfica",
  "description": "Descrição breve do projeto (até 500 caracteres)",
  "link": "https://exemplo.com",
  "images": ["IMG/proj/img1.jpg", "IMG/proj/img2.jpg"],
  "coverImageIndex": 0,
  "tags": ["branding", "fotografia"]
}
```

**Field Requirements:**
| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| title | string | ✓ | 200 | Generated slug from this |
| year | number | ✓ | - | 2000 - current year + 1 |
| client | string | ✓ | 150 | - |
| category | string | ✓ | 100 | - |
| deliverable | string | ✓ | 150 | - |
| description | string | ✓ | 500 | - |
| link | string | ✗ | 500 | Must be valid URL if provided |
| images | array | ✓ | - | At least 1 image URL |
| coverImageIndex | number | ✗ | - | Index of cover in images array |
| tags | array | ✗ | 50 per tag | - |

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "proj_1710700000000_abc123def",
    "slug": "projeto-novo",
    "title": "Projeto Novo",
    "message": "Projeto adicionado com sucesso!"
  }
}
```

**Error Responses:**
- `400` - Validation error (missing field, too long, invalid format)
- `401` - Authentication failed

---

### GET /portfolio/list - List Projects

Retrieve all portfolio projects with filtering and pagination.

**Endpoint:** `GET /api/admin/portfolio/list`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Items per page (max 100) |
| category | string | null | Filter by category |
| search | string | null | Search in title, client, description |
| sort | string | createdAt:desc | Sort order: createdAt:asc, createdAt:desc, year:asc, year:desc |
| includeHidden | boolean | false | Include hidden projects |

**Example Request:**
```
GET /api/admin/portfolio/list?page=1&limit=10&category=Personal%20Branding&sort=year:desc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_1710700000000_abc123def",
        "slug": "projeto-novo",
        "title": "Projeto Novo",
        "year": 2025,
        "client": "Cliente ABC",
        "category": "Personal Branding",
        "deliverable": "Sessão fotográfica",
        "description": "Descrição do projeto",
        "link": "https://exemplo.com",
        "images": ["IMG/proj/img1.jpg", "IMG/proj/img2.jpg"],
        "coverImage": "IMG/proj/img1.jpg",
        "tags": ["branding", "fotografia"],
        "hidden": false,
        "status": "published",
        "createdAt": "2025-03-20T10:30:00Z",
        "updatedAt": "2025-03-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

**Error Responses:**
- `401` - Authentication failed
- `400` - Invalid pagination parameters

---

### PATCH /portfolio/update - Update Project

Update an existing portfolio project.

**Endpoint:** `PATCH /api/admin/portfolio/update`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slug": "projeto-novo",
  "title": "Projeto Atualizado",
  "description": "Nova descrição..."
}
```

**Notes:**
- Only provide fields you want to update
- slug is required
- Slug is automatically regenerated if title changes
- All validation rules from POST /add apply

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "projeto-novo",
    "title": "Projeto Atualizado",
    "message": "Projeto atualizado com sucesso!",
    "updates": {
      "title": "Projeto Atualizado",
      "description": "Nova descrição..."
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Authentication failed
- `404` - Project not found

---

### DELETE /portfolio/delete - Delete Project

Soft-delete a portfolio project (not permanently removed).

**Endpoint:** `DELETE /api/admin/portfolio/delete`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slug": "projeto-novo"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "projeto-novo",
    "message": "Projeto deletado com sucesso!"
  }
}
```

**Error Responses:**
- `401` - Authentication failed
- `404` - Project not found

---

### PATCH /portfolio/hide - Hide/Show Project

Toggle visibility of a project without deleting it.

**Endpoint:** `PATCH /api/admin/portfolio/hide`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slug": "projeto-novo",
  "hidden": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "projeto-novo",
    "hidden": true,
    "message": "Projeto ocultado com sucesso!"
  }
}
```

---

## Blog/Articles Endpoints

### POST /blog/add - Create Article

Create a new blog article.

**Endpoint:** `POST /api/admin/blog/add`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Novo Artigo sobre Branding",
  "excerpt": "Resumo breve do artigo (até 300 caracteres)",
  "body": "<p>Conteúdo do artigo em HTML</p><h2>Seção</h2>",
  "category": "Personal Branding",
  "tags": ["branding", "dicas"],
  "featured": false,
  "featuredImage": "IMG/blog/cover.jpg",
  "readTime": "5 min",
  "author": "Rodrigo Roncolato"
}
```

**Field Requirements:**
| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| title | string | ✓ | 200 | Generated slug from this |
| excerpt | string | ✓ | 300 | - |
| body | string | ✓ | 50000 | HTML allowed |
| category | string | ✓ | 100 | - |
| tags | array | ✗ | 50 per tag | - |
| featured | boolean | ✗ | - | Default: false |
| featuredImage | string | ✗ | 500 | URL to image |
| readTime | string | ✓ | 20 | e.g., "5 min" |
| author | string | ✗ | 100 | Default: "Rodrigo Roncolato" |

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "blog_1710700000000_abc123def",
    "slug": "novo-artigo-sobre-branding",
    "title": "Novo Artigo sobre Branding",
    "message": "Artigo publicado com sucesso!"
  }
}
```

---

### GET /blog/list - List Articles

Retrieve all blog articles with filtering and pagination.

**Endpoint:** `GET /api/admin/blog/list`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 100) |
| category | string | null | Filter by category |
| featured | boolean | false | Show only featured articles |
| search | string | null | Search in title, excerpt, body |
| sort | string | createdAt:desc | Sort: createdAt:asc, createdAt:desc |
| includeHidden | boolean | false | Include hidden articles |

**Example Request:**
```
GET /api/admin/blog/list?page=1&limit=10&featured=true&sort=createdAt:desc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "blog_1710700000000_abc123def",
        "slug": "novo-artigo-sobre-branding",
        "title": "Novo Artigo sobre Branding",
        "excerpt": "Resumo do artigo...",
        "body": "<p>Conteúdo completo...</p>",
        "category": "Personal Branding",
        "tags": ["branding", "dicas"],
        "featured": false,
        "featuredImage": "IMG/blog/cover.jpg",
        "readTime": "5 min",
        "author": "Rodrigo Roncolato",
        "hidden": false,
        "status": "published",
        "createdAt": "2025-03-20T10:30:00Z",
        "updatedAt": "2025-03-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### PATCH /blog/update - Update Article

Update an existing blog article.

**Endpoint:** `PATCH /api/admin/blog/update`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slug": "novo-artigo-sobre-branding",
  "title": "Artigo Atualizado",
  "excerpt": "Novo resumo..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "novo-artigo-sobre-branding",
    "title": "Artigo Atualizado",
    "message": "Artigo atualizado com sucesso!",
    "updates": {
      "title": "Artigo Atualizado",
      "excerpt": "Novo resumo..."
    }
  }
}
```

---

### DELETE /blog/delete - Delete Article

Soft-delete a blog article.

**Endpoint:** `DELETE /api/admin/blog/delete`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slug": "novo-artigo-sobre-branding"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "novo-artigo-sobre-branding",
    "message": "Artigo deletado com sucesso!"
  }
}
```

---

### PATCH /blog/hide - Hide/Show Article

Toggle visibility of an article.

**Endpoint:** `PATCH /api/admin/blog/hide`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slug": "novo-artigo-sobre-branding",
  "hidden": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "novo-artigo-sobre-branding",
    "hidden": true,
    "message": "Artigo ocultado com sucesso!"
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message in Portuguese",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| AUTH_MISSING_TOKEN | 401 | Token not provided |
| AUTH_INVALID_TOKEN | 401 | Token invalid or expired |
| VALIDATION_ERROR | 400 | Invalid input data |
| NOT_FOUND | 404 | Resource not found |
| METHOD_NOT_ALLOWED | 405 | HTTP method not allowed |
| INTERNAL_ERROR | 500 | Server error |

### XSS Prevention

All inputs are automatically sanitized to prevent XSS attacks:
- Script tags and event handlers are detected and rejected
- HTML is escaped unless explicitly allowed (in blog body)
- Maximum string lengths enforced
- Malicious patterns detected and blocked

---

## Testing Examples

### Using cURL

**1. Login**
```bash
curl -X POST http://localhost:3012/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}'
```

**2. Create Portfolio Project**
```bash
curl -X POST http://localhost:3012/api/admin/portfolio/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title":"Meu Projeto",
    "year":2025,
    "client":"Cliente",
    "category":"Branding",
    "deliverable":"Entrega",
    "description":"Descrição",
    "images":["IMG/teste.jpg"],
    "coverImageIndex":0
  }'
```

**3. List Projects**
```bash
curl -X GET "http://localhost:3012/api/admin/portfolio/list?page=1&limit=10" \
  -H "Authorization: Bearer <TOKEN>"
```

**4. Update Project**
```bash
curl -X PATCH http://localhost:3012/api/admin/portfolio/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "slug":"meu-projeto",
    "description":"Descrição atualizada"
  }'
```

**5. Delete Project**
```bash
curl -X DELETE http://localhost:3012/api/admin/portfolio/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"slug":"meu-projeto"}'
```

### Using JavaScript/Fetch

```javascript
const token = 'seu-token-jwt';
const baseUrl = 'http://localhost:3012/api/admin';

// Create Project
const createProject = async () => {
  const response = await fetch(`${baseUrl}/portfolio/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Novo Projeto',
      year: 2025,
      client: 'Cliente',
      category: 'Branding',
      deliverable: 'Entrega',
      description: 'Descrição',
      images: ['IMG/teste.jpg'],
      coverImageIndex: 0
    })
  });
  return await response.json();
};

// List Projects
const listProjects = async (page = 1, limit = 10) => {
  const response = await fetch(
    `${baseUrl}/portfolio/list?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return await response.json();
};
```

### Using Postman

1. Import the collection from `docs/ADMIN_API_ENDPOINTS_POSTMAN.json`
2. Set environment variable `token` after login
3. Use the pre-built requests for each endpoint

---

## Data Persistence

**Storage Method:** JSON files in `/data` directory
- `data/projects.json` - Portfolio projects
- `data/articles.json` - Blog articles

**Each file structure:**
```json
{
  "data": {
    "project-slug": { ... },
    "another-slug": { ... }
  }
}
```

---

## Security Notes

- All credentials are sent over HTTPS in production
- JWT tokens expire after 24 hours
- Tokens use HMAC-SHA256 signature
- All inputs are validated and sanitized
- Rate limiting provided by Vercel (10 req/sec per IP)
- Soft delete prevents accidental permanent data loss
- Audit logging for all admin actions

---

**Last Updated:** March 20, 2026  
**Maintainer:** Squad Backend API  
**Status:** Production Ready
