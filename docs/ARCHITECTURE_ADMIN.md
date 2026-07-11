# 🏗️ Arquitetura e Fluxo da Área Admin

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Frontend)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /admin/login.html                    /admin/dashboard.html     │
│  ┌──────────────────┐                 ┌────────────────────┐   │
│  │ • Formulário     │  ──(submet)──>  │ • Portfólio Form   │   │
│  │ • Validação      │                 │ • Blog Form        │   │
│  │ • reCAPTCHA v3   │  <──(token)──   │ • Upload Files     │   │
│  │ • localStorage   │                 │ • localStorage     │   │
│  └──────────────────┘                 └────────────────────┘   │
│         ↑                                      ↑                 │
│         │ POST /api/admin/auth.js             │                 │
│         │ + credenciais + reCAPTCHA           │ POST APIs       │
│         │                                      │                 │
└─────────┼──────────────────────────────────────┼─────────────────┘
          │                                      │
          │                                      │
┌─────────▼──────────────────────────────────────▼─────────────────┐
│                   VERCEL SERVERLESS (Backend)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /api/admin/auth.js                   /api/admin/add-project.js │
│  ┌──────────────────┐                 ┌────────────────────┐   │
│  │ 1. Validar input │                 │ 1. Verify JWT      │   │
│  │ 2. Verify CAPTCHA│                 │ 2. Validate data   │   │
│  │ 3. Check creds   │                 │ 3. Process images  │   │
│  │ 4. Sign JWT      │  ──(JSON)──>    │ 4. Update HTML     │   │
│  │ 5. Return token  │                 │ 5. Return success  │   │
│  └──────────────────┘                 └────────────────────┘   │
│                                                                  │
│  /api/admin/add-article.js                                      │
│  ┌──────────────────┐                                           │
│  │ 1. Verify JWT    │                                           │
│  │ 2. Validate text │                                           │
│  │ 3. Parse format  │                                           │
│  │ 4. Update HTML   │                                           │
│  │ 5. Return JSON   │                                           │
│  └──────────────────┘                                           │
│                                                                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ Atualiza
                               ↓
                        ┌─────────────┐
                        │ index.html  │
                        │ (seu site)  │
                        └─────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
USUÁRIO                           LOGIN PAGE                   BACKEND
  │                                  │                             │
  ├─ Entra credenciais ────────────> │                             │
  │                                  │ 1. Valida input             │
  │                                  ├─────────────────────────> │
  │                                  │ 2. Verifica reCAPTCHA  │
  │                                  │ (via Google)          │
  │                                  │                       │
  │                                  │ 3. Compara user/pass  │
  │                                  │ (timing-safe)         │
  │                                  │                       │
  │                                  │ 4. Gera JWT Token     │
  │                                  │ (exp: 24h)            │
  │                                  │                       │
  │ <──────────── JWT Token ──────── │                       │
  │                                  │ <─────────────────── │
  │                                  │                       │
  ├─ localStorage.setItem(token)     │
  │
  ├─ Redireciona para dashboard
  │
  ├─ Preenche formulário
  │
  ├─ Envia dados + JWT ──────────────> Verifica JWT
  │                                    ├─ Valida assinatura
  │                                    ├─ Verifica expiração
  │                                    ├─ Autoriza requisição
  │
  │ <───── Sucesso + Atualiza site ── Processa e salva
```

---

## 📝 Fluxo de Publicação de Projeto

```
DASHBOARD ADMIN
    ↓
┌─ Preenche form
│  • Nome do cliente
│  • Ano
│  • Categoria
│  • Descrição
│  ↓
├─ Seleciona imagens
│  • Multiple file input
│  • Drag & drop support
│  ↓
├─ Escolhe capa do card
│  ↓
├─ Clica em "Adicionar Projeto"
│  ↓
│  Validação Frontend:
│  ├─ Todos campos preenchidos?
│  ├─ Token válido?
│  ├─ Imagens selecionadas?
│  ↓ SIM
└─ POST /api/admin/add-project.js
   │
   Backend:
   ├─ Verifica autenticação JWT
   ├─ Valida todos os inputs
   │  ├─ Tipo de dados
   │  ├─ Tamanho de strings
   │  ├─ Detecção de XSS
   ├─ Processa imagens
   │  └─ (Upload para Cloudinary/S3 em produção)
   ├─ Gera slug: "nome-cliente"
   ├─ Cria entrada JavaScript:
   │         "nome-cliente": {
   │           tag: "Personal Branding",
   │           title: "Nome do Cliente",
   │           ...
   │         }
   ├─ Adiciona card HTML no DOM
   ├─ Salva index.html atualizado
   │
   └─ Retorna { success: true }
      ↓
Frontend recebe sucesso
├─ Mostra mensagem "✓ Adicionado!"
├─ Recarrega página
└─ Projeto aparece no portfólio
```

---

## 🎯 Fluxo de Publicação de Artigo

```
DASHBOARD ADMIN
    ↓
┌─ Blog Form
│  • Título
│  • Resumo
│  • Categoria
│  • Data
│  • Tempo de leitura
│  • Conteúdo (com markdown)
│  ↓
│  Processamento de conteúdo:
│  ##Título     ──> <h2>Título</h2>
│  Parágrafo    ──> <p>Parágrafo</p>
│  ""Citação""  ──> <blockquote>Citação</blockquote>
│  ↓
└─ POST /api/admin/add-article.js
   │
   Backend:
   ├─ Verifica JWT
   ├─ Valida conteúdo
   ├─ Formata data: "2025-03-17" → "17 Mar 2025"
   ├─ Gera slug: "titulo-do-artigo"
   ├─ Cria entrada JavaScript:
   │     "titulo-do-artigo": {
   │       title: "Título do Artigo",
   │       excerpt: "Resumo...",
   │       tag: "Personal Branding",
   │       ...
   │     }
   ├─ Adiciona card HTML
   ├─ Salva index.html
   │
   └─ Retorna { success: true }
      ↓
Frontend:
├─ Mostra sucesso
├─ Recarrega
└─ Artigo aparece no blog
```

---

## 🔒 Camadas de Segurança

```
┌────────────────────────────────────────┐
│         Entrada do Usuário             │
├────────────────────────────────────────┤
         ↓
    [Validação Frontend]
    • Campos obrigatórios
    • Tipos de dados
    • Limites de tamanho
         ↓
    [reCAPTCHA v3]
    • Score de confiança
    • Detecção de bots
         ↓
    [Envio seguro]
    • HTTPS (Vercel)
    • CORS restrito
         ↓
┌────────────────────────────────────────┐
│           Backend (Vercel)             │
├────────────────────────────────────────┤
         ↓
    [Verificação JWT]
    • Assinatura HMAC-SHA256
    • Expiração (24h)
    • Timing-safe comparison
         ↓
    [Validação de Input]
    • Tamanho de strings
    • Detecção de XSS
    • Sanitização HTML
         ↓
    [Processamento Seguro]
    • Sem concatenação direta
    • Escaping de caracteres especiais
    • Type checking
         ↓
    [Salvo em Storage]
    • HTML atualizado localmente
    • Ou Cloudinary/S3 em produção
         ↓
┌────────────────────────────────────────┐
│         Website Público                │
│   (Sem comprometimento de segurança)   │
└────────────────────────────────────────┘
```

---

## 🗂️ Estrutura de Dados

### Token JWT
```javascript
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "username": "admin",
  "iat": 1710700000,
  "exp": 1710786400  // 24 horas depois
}
signature: HMAC-SHA256("header.payload", JWT_SECRET)
```

### Formato do Projeto no HTML
```javascript
const cases = {
  "nome-cliente": {
    tag: "Personal Branding",
    title: "Nome do Cliente",
    year: "2025",
    client: "Cliente ABC",
    cat: "Personal Branding",
    deliverable: "Sessão fotográfica",
    desc: "Breve descrição",
    link: "https://exemplo.com",
    imgs: ["IMG/pasta/img1.jpg", "IMG/pasta/img2.jpg"]
  }
}
```

### Formato do Artigo no HTML
```javascript
const articles = {
  "titulo-do-artigo": {
    title: "Título do Artigo",
    excerpt: "Resumo do artigo...",
    tag: "Personal Branding",
    date: "17 Mar 2025",
    readTime: "5 min",
    body: "<p>...</p><h2>...</h2><blockquote>...</blockquote>"
  }
}
```

---

## 🚀 Ciclo de Vida da Requisição

```
1. USER SUBMITS FORM
   ├─ Frontend valida
   └─ Envia POST + JWT

2. ROUTER (Vercel)
   └─ Roteia para /api/admin/auth.js

3. HANDLER EXECUTA
   ├─ Verifica CORS
   ├─ Valida método HTTP
   └─ Extrai dados

4. MIDDLEWARE
   ├─ Verifica autenticação JWT
   ├─ Valida inputs
   └─ Autoriza requisição

5. PROCESSAMENTO
   ├─ Processa dados
   ├─ Valida/Sanitiza
   └─ Gera saída

6. PERSISTÊNCIA
   ├─ Atualiza index.html (dev)
   └─ Ou envia para storage (prod)

7. RESPOSTA
   └─ Retorna JSON ao frontend

8. FRONTEND RECEBE
   ├─ Atualiza UI
   └─ Recarrega página
```

---

## 📱 Compatibilidade

✅ **Frontend:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

✅ **Backend:**
- Node.js 14+
- Vercel Functions
- Qualquer runtime Node.js

✅ **Segurança:**
- TLS 1.3 (HTTPS)
- reCAPTCHA v3
- JWT HS256
- Timing-safe operations

---

## 🔧 Variáveis de Ambiente

```bash
JWT_SECRET          # Chave secreta para assinar JWTs
ADMIN_USER          # Usuário do admin
ADMIN_PASS          # Senha do admin
RECAPTCHA_SECRET    # Secret Key do reCAPTCHA v3
NODE_ENV            # "production" ou "development"
```

---

## 📊 Performance

| Métrica | Target | Real |
|---------|--------|------|
| Tempo de login | <1s | ~500ms |
| Publicar projeto | <3s | ~1.5s |
| Publicar artigo | <2s | ~800ms |
| Latência JWT | <10ms | ~2ms |

---

## 🚨 Rate Limiting

- Vercel automaticamente limita:
  - 10 requisições/segundo por IP
  - 1000 requisições/minuto por função
  - Resets a cada minuto

---

**Versão:** 1.0.0  
**Última atualização:** 2026-03-17
