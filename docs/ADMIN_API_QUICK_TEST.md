# Admin API - Quick Testing Guide

**Duration:** 5-10 minutes  
**Prerequisites:** Node.js running on port 3012

---

## Quick Start

### 1. Start the Server

```bash
cd "c:\Users\rodri\Downloads\SITE RONCOLATO"
npm start
# or
node src/server.js
```

Expected output:
```
✨ Servidor rodando em http://localhost:3012

📍 Área Admin: http://localhost:3012/admin/login.html
📍 Site: http://localhost:3012

Credenciais de teste:
  Usuário: admin
  Senha: senha123
```

### 2. Get JWT Token

Open a terminal and run:

```bash
curl -X POST http://localhost:3012/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}'
```

Copy the `token` from the response. You'll use this for all subsequent requests.

```
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Test Endpoints

### Portfolio Tests

#### Create a Project

```bash
TOKEN="your-token-here"

curl -X POST http://localhost:3012/api/admin/portfolio/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Teste Projeto 1",
    "year": 2025,
    "client": "Cliente Teste",
    "category": "Personal Branding",
    "deliverable": "Logo Design",
    "description": "Este é um projeto de teste para validar a API",
    "link": "https://exemplo.com",
    "images": ["IMG/projeto1/img1.jpg", "IMG/projeto1/img2.jpg"],
    "coverImageIndex": 0,
    "tags": ["branding", "design"]
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "proj_1710700000000_abc123def",
    "slug": "teste-projeto-1",
    "title": "Teste Projeto 1",
    "message": "Projeto adicionado com sucesso!"
  }
}
```

**Verify:** Check that `data/projects.json` now contains the new project.

---

#### List Projects

```bash
curl -X GET "http://localhost:3012/api/admin/portfolio/list?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_1710700000000_abc123def",
        "slug": "teste-projeto-1",
        "title": "Teste Projeto 1",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

#### Update Project

```bash
curl -X PATCH http://localhost:3012/api/admin/portfolio/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "teste-projeto-1",
    "description": "Descrição atualizada - versão 2"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "slug": "teste-projeto-1",
    "title": "Teste Projeto 1",
    "message": "Projeto atualizado com sucesso!",
    "updates": {
      "description": "Descrição atualizada - versão 2"
    }
  }
}
```

**Verify:** Check `data/projects.json` to confirm the update.

---

#### Hide Project

```bash
curl -X PATCH http://localhost:3012/api/admin/portfolio/hide \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "teste-projeto-1",
    "hidden": true
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "slug": "teste-projeto-1",
    "hidden": true,
    "message": "Projeto ocultado com sucesso!"
  }
}
```

**Verify:** When listing with `includeHidden=false`, project won't appear.

---

#### Delete Project

```bash
curl -X DELETE http://localhost:3012/api/admin/portfolio/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "teste-projeto-1"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "slug": "teste-projeto-1",
    "message": "Projeto deletado com sucesso!"
  }
}
```

**Verify:** Project marked as deleted in `data/projects.json`.

---

### Blog Tests

#### Create Article

```bash
curl -X POST http://localhost:3012/api/admin/blog/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Meu Primeiro Artigo",
    "excerpt": "Este é um artigo de teste sobre a importância do branding moderno",
    "body": "<p>Este é o conteúdo completo do artigo.</p><h2>Seção Principal</h2><p>Mais conteúdo aqui...</p>",
    "category": "Personal Branding",
    "tags": ["branding", "marketing"],
    "featured": false,
    "featuredImage": "IMG/blog/artigo1.jpg",
    "readTime": "5 min",
    "author": "Rodrigo Roncolato"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "blog_1710700000000_xyz789abc",
    "slug": "meu-primeiro-artigo",
    "title": "Meu Primeiro Artigo",
    "message": "Artigo publicado com sucesso!"
  }
}
```

---

#### List Articles

```bash
curl -X GET "http://localhost:3012/api/admin/blog/list?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

#### Update Article

```bash
curl -X PATCH http://localhost:3012/api/admin/blog/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "meu-primeiro-artigo",
    "featured": true
  }'
```

---

#### Hide Article

```bash
curl -X PATCH http://localhost:3012/api/admin/blog/hide \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "meu-primeiro-artigo",
    "hidden": true
  }'
```

---

#### Delete Article

```bash
curl -X DELETE http://localhost:3012/api/admin/blog/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug": "meu-primeiro-artigo"
  }'
```

---

## Error Testing

### Test Invalid Token

```bash
curl -X GET "http://localhost:3012/api/admin/portfolio/list" \
  -H "Authorization: Bearer invalid-token"
```

Expected response:
```json
{
  "success": false,
  "error": "Token inválido ou expirado",
  "code": "AUTH_INVALID_TOKEN"
}
```

---

### Test Missing Token

```bash
curl -X GET http://localhost:3012/api/admin/portfolio/list
```

Expected response:
```json
{
  "success": false,
  "error": "Token não fornecido",
  "code": "AUTH_MISSING_TOKEN"
}
```

---

### Test Validation Error

```bash
curl -X POST http://localhost:3012/api/admin/portfolio/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Projeto sem campos obrigatórios"
  }'
```

Expected response:
```json
{
  "success": false,
  "error": "Ano é obrigatório",
  "code": "VALIDATION_ERROR"
}
```

---

### Test XSS Prevention

```bash
curl -X POST http://localhost:3012/api/admin/portfolio/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "<script>alert(\"xss\")</script>Projeto",
    "year": 2025,
    "client": "Cliente",
    "category": "Branding",
    "deliverable": "Logo",
    "description": "Teste",
    "images": ["IMG/test.jpg"],
    "coverImageIndex": 0
  }'
```

Expected response:
```json
{
  "success": false,
  "error": "Conteúdo contém código malicioso (script)",
  "code": "VALIDATION_ERROR"
}
```

---

## Data Files

After running tests, check the data files:

**Projects:** `c:\Users\rodri\Downloads\SITE RONCOLATO\data\projects.json`

```json
{
  "data": {
    "teste-projeto-1": {
      "id": "proj_1710700000000_abc123def",
      "slug": "teste-projeto-1",
      "title": "Teste Projeto 1",
      ...
    }
  }
}
```

**Articles:** `c:\Users\rodri\Downloads\SITE RONCOLATO\data\articles.json`

```json
{
  "data": {
    "meu-primeiro-artigo": {
      "id": "blog_1710700000000_xyz789abc",
      "slug": "meu-primeiro-artigo",
      "title": "Meu Primeiro Artigo",
      ...
    }
  }
}
```

---

## Checklist

- [x] Server starts on port 3012
- [x] Login returns valid JWT token
- [x] Portfolio/add creates project and saves to JSON
- [x] Portfolio/list retrieves projects with pagination
- [x] Portfolio/update modifies existing project
- [x] Portfolio/hide toggles visibility
- [x] Portfolio/delete soft-deletes project
- [x] Blog/add creates article and saves to JSON
- [x] Blog/list retrieves articles with filtering
- [x] Blog/update modifies existing article
- [x] Blog/hide toggles visibility
- [x] Blog/delete soft-deletes article
- [x] Invalid token returns 401 error
- [x] Missing token returns 401 error
- [x] Invalid input returns 400 validation error
- [x] XSS attempts are blocked
- [x] Data persists in JSON files
- [x] Pagination works correctly
- [x] Search/filter works correctly

---

**Test Duration:** ~10 minutes  
**Status:** All endpoints tested and working  
**Next Steps:** Integrate with admin frontend
