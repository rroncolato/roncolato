# 📋 ADMIN FRONTEND IMPLEMENTATION

**Painel Admin - Roncolato Fotografia**
**Status:** ✅ Pronto para Implementação
**Versão:** 1.0
**Data:** Março 2026

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Componentes](#arquitetura-de-componentes)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Guia de Uso](#guia-de-uso)
5. [APIs Necessárias](#apis-necessárias)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Validações](#validações)
8. [Checklist de Integração](#checklist-de-integração)

---

## 🎯 Visão Geral

### Objetivo
Criar um painel administrativo modular e profissional para gerenciar:
- **Portfólio**: CRUD completo (Criar, Ler, Atualizar, Deletar) + Ocultar/Publicar
- **Blog**: CRUD completo + Ocultar/Publicar

### Filosofia
- ✅ **Vanilla JavaScript**: Sem dependências externas
- ✅ **Mobile-first**: Responsivo desde 320px
- ✅ **Design System Light**: Amarelo #F5C518 + White/Black
- ✅ **Componentes Reutilizáveis**: Modular e maintível
- ✅ **UX Clara**: Feedback visual para todas as ações

### Stack Técnico
- HTML5 + CSS3 (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- Fetch API (HTTP requests)
- LocalStorage (autenticação)
- Design System: Light Mode com Yellow Accent

---

## 🏗️ Arquitetura de Componentes

### 1. **Toast** - Notificações
Mensagens temporárias que aparecem no canto superior direito.

```javascript
// Uso
Toast.show('Projeto adicionado com sucesso!', 'success', 3000)
Toast.show('Erro ao deletar', 'error', 3000)
Toast.show('Aviso importante', 'warning', 5000)
Toast.show('Informação', 'info', 3000)
```

**Tipos suportados:** `success`, `error`, `warning`, `info`

---

### 2. **Modal** - Diálogos
Caixas de diálogo para confirmações e informações.

```javascript
// Uso simples
const modal = new Modal(
  'Deletar Projeto',
  'Tem certeza que deseja deletar? Esta ação é irreversível.',
  [
    { text: 'Cancelar', action: () => {} },
    { text: 'Deletar', action: () => console.log('Deletado!') }
  ]
);
modal.show();

// Close manual
modal.close();
```

**Características:**
- Suporta múltiplos botões
- Fecha com ESC ou clique no overlay
- Animações suaves

---

### 3. **FormValidator** - Validação
Sistema de validação de formulários com regras pré-definidas.

```javascript
// Definir regras
const rules = {
  email: [FormValidator.rules.required, FormValidator.rules.email],
  title: [FormValidator.rules.required, FormValidator.rules.maxLength(100)],
  images: [FormValidator.rules.required]
};

// Validar
const isValid = FormValidator.validate(form, rules);

if (!isValid) {
  FormValidator.showErrors(form);
  console.log(FormValidator.getErrors());
}
```

**Regras disponíveis:**
- `required` - Campo obrigatório
- `email` - Email válido
- `minLength(n)` - Mínimo de caracteres
- `maxLength(n)` - Máximo de caracteres
- `url` - URL válida
- `fileType(types)` - Tipos de arquivo (mime types)
- `fileSize(maxMB)` - Tamanho máximo do arquivo

---

### 4. **Table** - Tabelas Dinâmicas
Renderiza tabelas com dados e ações.

```javascript
const columns = [
  { key: 'title', label: 'Título' },
  { key: 'date', label: 'Data' }
];

const actions = [
  {
    name: 'edit',
    label: 'Editar',
    color: '#F5C518',
    callback: (row) => console.log('Editar:', row)
  },
  {
    name: 'delete',
    label: 'Deletar',
    color: '#FEE2E2',
    callback: (row) => console.log('Deletar:', row)
  }
];

const data = [
  { title: 'Projeto 1', date: '2025-01-15' },
  { title: 'Projeto 2', date: '2025-02-20' }
];

const table = new Table('container-id', columns, data, actions);
table.render();

// Atualizar dados
table.update(newData);
```

**Features:**
- Renderização dinâmica
- Suporte para custom renders por coluna
- Ações clicáveis

---

### 5. **Card** - Containers
Cards reutilizáveis para exibir informações.

```javascript
const card = Card.create({
  title: 'Título do Card',
  content: 'Conteúdo do card com suporte a HTML',
  actions: [
    { name: 'edit', label: 'Editar', color: '#F5C518', fn: () => {} },
    { name: 'delete', label: 'Deletar', color: '#FEE2E2', fn: () => {} }
  ],
  onClick: () => console.log('Clique no card')
});

container.appendChild(card);
```

---

### 6. **ImagePreview** - Preview de Imagens
Mostra preview das imagens selecionadas antes de enviar.

```javascript
const input = document.getElementById('imageInput');
input.addEventListener('change', (e) => {
  ImagePreview.show(e.target.files, 'preview-container-id');
});
```

---

### 7. **DragDropZone** - Drag & Drop
Permite arrastar e soltar arquivos em zonas específicas.

```javascript
new DragDropZone('file-input-id', (files) => {
  console.log('Arquivos soltos:', files);
  // Trigger change event automaticamente
});
```

---

### 8. **Tabs** - Navegação por Abas
Sistema de abas para organizar conteúdo.

```javascript
const tabs = new Tabs('tabs-container-id', [
  {
    label: 'Dashboard',
    content: '<p>Conteúdo da aba 1</p>'
  },
  {
    label: 'Configurações',
    content: '<p>Conteúdo da aba 2</p>'
  }
]);

tabs.render();
```

---

## 📁 Estrutura de Arquivos

```
/admin/
├── dashboard-v2.html         # HTML principal (NOVO - usar este!)
├── dashboard.html            # HTML antigo (pode deletar)
├── login.html                # Login (mantém como está)
├── styles-admin.css          # CSS do design system (NOVO)
├── components.js             # Componentes reutilizáveis (NOVO)
└── app.js                    # Lógica da aplicação (NOVO)
```

### Arquivos para usar:
- ✅ `dashboard-v2.html` - HTML atualizado com design system
- ✅ `styles-admin.css` - Estilos melhorados
- ✅ `components.js` - Biblioteca de componentes
- ✅ `app.js` - Lógica da aplicação
- ✅ `login.html` - Manter como está

---

## 🚀 Guia de Uso

### 1. Incluir Scripts no HTML

```html
<link rel="stylesheet" href="styles-admin.css">
<script src="components.js"></script>
<script src="app.js"></script>
```

### 2. Estrutura HTML

O HTML deve ter:
- Header com logout
- Abas com `data-tab` attribute
- Conteúdos com IDs no formato `tab-{nome}`
- Formulários com IDs específicos

**Exemplo:**
```html
<button class="tab-btn" data-tab="portfolio">Portfólio</button>
<div class="tab-content" id="tab-portfolio">
  <!-- Conteúdo da aba -->
</div>
```

### 3. Inicializar a Aplicação

```javascript
document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
```

---

## 🔌 APIs Necessárias

### Backend Dev Precisa Implementar:

#### 1. **Autenticação**
```
POST /api/admin/auth
Headers: Content-Type: application/json
Body: {
  username: string,
  password: string,
  recaptchaToken: string
}
Response: {
  success: boolean,
  token: string (JWT),
  username: string
}
```

---

#### 2. **Portfólio - Endpoints**

**CREATE - Adicionar Projeto**
```
POST /api/admin/projects
Headers:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
Body: FormData com:
  - title: string
  - client: string
  - year: number
  - category: string
  - deliverable: string
  - description: string
  - link: string (opcional)
  - images: FileList
  - coverIndex: number

Response: {
  success: boolean,
  project: {
    key: string (UUID),
    title: string,
    client: string,
    year: number,
    category: string,
    deliverable: string,
    description: string,
    link: string,
    images: string[] (URLs),
    cover: string (URL),
    visible: boolean,
    createdAt: ISO 8601,
    updatedAt: ISO 8601
  }
}
```

**READ - Listar Projetos**
```
GET /api/admin/projects
Headers: Authorization: Bearer {token}
Query params:
  - limit: number (default: 50)
  - offset: number (default: 0)

Response: {
  success: boolean,
  projects: [{
    key: string,
    title: string,
    client: string,
    year: number,
    category: string,
    deliverable: string,
    description: string,
    images: string[],
    cover: string,
    visible: boolean,
    createdAt: ISO 8601
  }],
  total: number
}
```

**UPDATE - Editar Projeto**
```
PATCH /api/admin/projects/{projectKey}
Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body: {
  title: string (opcional),
  category: string (opcional),
  visible: boolean (opcional),
  ... (outros campos)
}

Response: {
  success: boolean,
  project: { ... }
}
```

**DELETE - Deletar Projeto**
```
DELETE /api/admin/projects/{projectKey}
Headers: Authorization: Bearer {token}

Response: {
  success: boolean,
  message: string
}
```

---

#### 3. **Blog - Endpoints**

**CREATE - Publicar Artigo**
```
POST /api/admin/articles
Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body: {
  title: string,
  excerpt: string,
  tag: string,
  date: ISO 8601,
  readTime: string,
  content: string,
  image: string (opcional, URL ou base64)
}

Response: {
  success: boolean,
  article: {
    slug: string,
    title: string,
    excerpt: string,
    tag: string,
    date: ISO 8601,
    readTime: string,
    content: string,
    image: string (URL),
    visible: boolean,
    createdAt: ISO 8601,
    updatedAt: ISO 8601
  }
}
```

**READ - Listar Artigos**
```
GET /api/admin/articles
Headers: Authorization: Bearer {token}
Query params:
  - limit: number (default: 50)
  - offset: number (default: 0)

Response: {
  success: boolean,
  articles: [{
    slug: string,
    title: string,
    excerpt: string,
    tag: string,
    date: ISO 8601,
    readTime: string,
    image: string,
    visible: boolean,
    createdAt: ISO 8601
  }],
  total: number
}
```

**UPDATE - Editar Artigo**
```
PATCH /api/admin/articles/{slug}
Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body: {
  title: string (opcional),
  excerpt: string (opcional),
  tag: string (opcional),
  content: string (opcional),
  visible: boolean (opcional),
  ...
}

Response: {
  success: boolean,
  article: { ... }
}
```

**DELETE - Deletar Artigo**
```
DELETE /api/admin/articles/{slug}
Headers: Authorization: Bearer {token}

Response: {
  success: boolean,
  message: string
}
```

---

## 📊 Fluxo de Dados

### 1. Autenticação
```
login.html
    ↓
grecaptcha.execute()
    ↓
POST /api/admin/auth
    ↓
localStorage.setItem(token, username)
    ↓
window.location → dashboard-v2.html
```

### 2. Carregar Portfólio
```
AdminApp.init()
    ↓
AdminApp.switchTab('manage-portfolio')
    ↓
AdminApp.loadPortfolioList()
    ↓
GET /api/admin/projects (com Authorization header)
    ↓
Renderizar tabela com Table component
```

### 3. Adicionar Projeto
```
handlePortfolioSubmit()
    ↓
validatePortfolio()
    ↓
POST /api/admin/projects (multipart/form-data)
    ↓
Toast.show('Sucesso!')
    ↓
AdminApp.switchTab('manage-portfolio')
    ↓
AdminApp.loadPortfolioList()
```

### 4. Deletar Projeto
```
deletePortfolio()
    ↓
Modal confirmação
    ↓
DELETE /api/admin/projects/{key}
    ↓
Toast.show('Deletado!')
    ↓
AdminApp.loadPortfolioList()
```

---

## ✅ Validações

### Portfólio

| Campo | Validação |
|-------|-----------|
| **Title** | Obrigatório, máx 100 chars |
| **Year** | Obrigatório, 2000-2099 |
| **Client** | Obrigatório, máx 100 chars |
| **Deliverable** | Obrigatório, máx 100 chars |
| **Category** | Obrigatório, deve selecionar |
| **Description** | Obrigatório, máx 300 chars |
| **Link** | Opcional, URL válida se preenchido |
| **Images** | Obrigatório, mín 1 arquivo, máx 5MB, JPEG/PNG/WebP |
| **Cover** | Obrigatório, deve selecionar uma imagem |

### Blog

| Campo | Validação |
|-------|-----------|
| **Title** | Obrigatório, máx 200 chars |
| **Excerpt** | Obrigatório, máx 300 chars |
| **Tag** | Obrigatório, deve selecionar |
| **Date** | Obrigatório, ISO date |
| **ReadTime** | Obrigatório, máx 50 chars |
| **Content** | Obrigatório, mín 50 chars |
| **Image** | Opcional, se enviado: máx 5MB, JPEG/PNG/WebP |

### Validações no Frontend

```javascript
// Exemplo: Portfolio
const rules = {
  pTitle: [
    FormValidator.rules.required,
    FormValidator.rules.maxLength(100)
  ],
  pYear: [FormValidator.rules.required],
  pClient: [FormValidator.rules.required],
  pDeliverable: [FormValidator.rules.required],
  pDesc: [FormValidator.rules.required],
  pImages: [FormValidator.rules.required]
};

if (!FormValidator.validate(form, rules)) {
  FormValidator.showErrors(form);
  return;
}
```

---

## 🔐 Segurança

### Headers Obrigatórios
Todas as requisições autenticadas devem incluir:
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json'
}
```

### Validações Backend
- Validar JWT token em todos os endpoints
- Sanitizar inputs (XSS prevention)
- Validar tipos de arquivo no servidor
- Limitar tamanho de uploads
- Rate limiting em uploads

---

## 🎨 Customização de Styles

### CSS Variables
Modificar `:root` em `styles-admin.css`:

```css
:root {
  --color-yellow: #F5C518;      /* Accent color */
  --color-black: #1A1A1A;       /* Primary text */
  --color-white: #FFFFFF;       /* Background */
  --font-family: 'Jost', sans-serif; /* Font */
  --space-md: 16px;             /* Spacing base */
}
```

### Adicionar Estilos Customizados
```css
/* Adicionar no final de styles-admin.css */
.custom-class {
  color: var(--color-yellow);
  padding: var(--space-lg);
}
```

---

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- ✅ Grid collapses to 1 column
- ✅ Buttons stack vertically
- ✅ Tabs scrollable horizontally
- ✅ Touch-friendly button sizes (44px min)
- ✅ Reduced padding on small screens

---

## 🧪 Testing

### Testes Manuais Obrigatórios

#### Portfólio
- [ ] Adicionar projeto com todas as imagens
- [ ] Validar erro quando falta campo obrigatório
- [ ] Deletar projeto
- [ ] Ocultar/Publicar projeto
- [ ] Listar projetos com paginação (se houver)
- [ ] Upload com drag & drop
- [ ] Preview de imagens

#### Blog
- [ ] Publicar artigo
- [ ] Validar campos obrigatórios
- [ ] Deletar artigo
- [ ] Ocultar/Publicar artigo
- [ ] Listar artigos
- [ ] Upload de imagem destacada

#### Geral
- [ ] Login e logout
- [ ] Navegação entre abas
- [ ] Toasts aparecem corretamente
- [ ] Modais funcionam
- [ ] Responsivo em mobile (simular em DevTools)
- [ ] Token JWT armazenado
- [ ] Redireciona para login se não autenticado

---

## 📚 Dependências Externas

### Nenhuma!
O projeto usa **Vanilla JavaScript** - sem jQuery, React, Vue, etc.

### Fontes
- **Jost** (Google Fonts) - Importada em `dashboard-v2.html`

### Ícones
- Usando emojis do sistema operacional (⚠️ ✓ ✕ ℹ etc)

---

## 🚀 Deploy & Otimização

### Otimizações Realizadas
- ✅ Minified CSS variables
- ✅ Lazy loading em imagens
- ✅ Event delegation onde possível
- ✅ Cache-friendly assets
- ✅ Semantic HTML

### Antes de Ir para Produção
1. Minificar `components.js` e `app.js`
2. Adicionar CSP headers
3. Validar HTTPS em todas as requisições
4. Configurar rate limiting no backend
5. Testes de segurança (OWASP Top 10)

---

## 📝 Checklist de Integração

- [ ] Arquivos criados no diretório `/admin/`
- [ ] `dashboard-v2.html` renomeado para `dashboard.html` (ou atualizar referências)
- [ ] Backend dev implementou endpoints de API
- [ ] JWT authentication funcionando
- [ ] Portfólio CRUD testado
- [ ] Blog CRUD testado
- [ ] Upload de imagens funcionando
- [ ] Validações no backend
- [ ] Testes de responsividade
- [ ] Documentação atualizada
- [ ] Deploy em staging

---

## 🤝 Suporte & Manutenção

### Problemas Comuns

**Problema:** Toast não aparece
**Solução:** Verificar se `Toast.init()` foi chamado

**Problema:** Modal não fecha com ESC
**Solução:** Verificar se modal.show() foi executado

**Problema:** Tabelas vazias
**Solução:** Verificar resposta da API e token JWT

**Problema:** Formulário não submete
**Solução:** Verificar validações no FormValidator

---

## 📞 Contato & Próximos Passos

### Frontend Dev (Próximas Melhorias)
- [ ] Implementar drag & drop para reordenar projetos
- [ ] Adicionar busca/filtro em listas
- [ ] Implementar paginação
- [ ] Adicionar modo dark (opcional)
- [ ] Exportar relatórios

### Backend Dev (Necessário Implementar)
- [ ] Todos os endpoints listados em [APIs Necessárias](#apis-necessárias)
- [ ] Validação de JWT
- [ ] Sanitização de inputs
- [ ] Rate limiting
- [ ] Logging de ações administrativas

---

**Squad Frontend Dev • Rodrigo Roncolato • Março 2026**
