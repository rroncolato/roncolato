# 📊 Customer Dashboard - Guia Completo de Setup

## ✅ O que foi criado

### Frontend (3 arquivos HTML)
```
customer/
├── index.html          ← Landing page do portal
├── login.html          ← Login do cliente (2 métodos)
└── dashboard.html      ← Dashboard principal
```

### Backend (3 APIs Node.js)
```
api/customer/
├── auth.js             ← Autenticação JWT
├── get-projects.js     ← Buscar projetos + tarefas
└── update-task.js      ← Atualizar status de tarefa
```

---

## 🎯 Funcionalidades Implementadas

### 1. **Login do Cliente** (`customer/login.html`)
- ✅ 2 opções de autenticação:
  - E-mail + Senha
  - Código de Acesso único (formato: XXX-XXX-XXX)
- ✅ Validação de formulário
- ✅ Mensagens de erro/sucesso
- ✅ Design responsivo

### 2. **Dashboard Principal** (`customer/dashboard.html`)
- ✅ **KPIs (Métricas)**:
  - Progresso geral (%)
  - Tarefas ativas
  - Próximo passo
- ✅ **Tarefas organizadas por status**:
  - A Fazer (TODO)
  - Em Progresso (IN_PROGRESS)
  - Revisão (REVIEW)
  - Concluído (COMPLETED)
- ✅ **Abas por projeto** (dinâmicas)
- ✅ **Timeline/Cronograma** com marcos
- ✅ **Responsivo** (mobile, tablet, desktop)

### 3. **APIs de Autenticação** (`api/customer/auth.js`)
- ✅ Suporta 2 métodos de login
- ✅ Gera JWT Token (7 dias)
- ✅ Validação segura (delay anti-brute force)
- ✅ Integração com Notion (busca cliente)

### 4. **APIs de Dados** (`api/customer/get-projects.js`)
- ✅ Busca projetos do cliente no Notion
- ✅ Busca tarefas relacionadas
- ✅ Calcula KPIs automaticamente
- ✅ Gera timeline com marcos
- ✅ Filtra por autenticação JWT

### 5. **APIs de Atualização** (`api/customer/update-task.js`)
- ✅ Permite marcar tarefa como concluída
- ✅ Sincroniza com Notion em tempo real
- ✅ Validação de permissões

---

## 🔧 Setup - Próximos Passos

### Passo 1: Configurar Variáveis de Ambiente

Adicione ao seu `.env`:

```bash
# Notion
NOTION_TOKEN=seu_token_aqui
NOTION_CLIENTES_DATABASE_ID=id_database_clientes
NOTION_PROJETOS_DATABASE_ID=id_database_projetos
NOTION_TAREFAS_DATABASE_ID=id_database_tarefas

# JWT (já deve ter)
JWT_SECRET=sua-chave-super-secreta-aleatorio-minimo-32-caracteres-aqui

# NODE
NODE_ENV=development
```

### Passo 2: Adaptar Nomes de Propriedades no Notion

As APIs assumem certos nomes de propriedades. **Você precisa adaptar** aos nomes reais:

#### No arquivo `api/customer/auth.js`:
```javascript
// ENCONTRAR ESTAS LINHAS E ADAPTAR:

// Propriedades da Database CLIENTES:
'Email'        // → Seu campo de email
'Senha'        // → Seu campo de senha
'Codigo_Acesso' // → Seu campo de código
'Nome'         // → Seu campo de nome
```

#### No arquivo `api/customer/get-projects.js`:
```javascript
// Database PROJETOS:
'Cliente'      // → Propriedade que relaciona a cliente
'Nome'         // → Nome do projeto
'Descricao'    // → Descrição
'Status'       // → Status do projeto
'Data_Inicio'  // → Data de início
'Data_Fim'     // → Data de conclusão

// Database TAREFAS:
'Projeto'      // → Propriedade que relaciona a projeto
'Titulo'       // → Título da tarefa
'Descricao'    // → Descrição
'Status'       // → Status (todo, in_progress, review, completed)
'Prioridade'   // → Prioridade (alta, media, baixa)
'Data_Vencimento' // → Data de vencimento
'Responsavel'  // → Pessoa responsável
'Tags'         // → Tags/etiquetas
```

### Passo 3: Testar a API Notion

Acesse `/api/debug-notion.js` para ver a estrutura exata:

```bash
# No terminal
curl http://localhost:3011/api/debug-notion.js
```

Isso retornará a estrutura exata de cada database. **Use os nomes exatos que receber aqui**.

### Passo 4: Testar as APIs Localmente

```bash
# 1. Test Login (com email+senha)
curl -X POST http://localhost:3011/api/customer/auth.js \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "senha123"
  }'

# 2. Test Login (com código)
curl -X POST http://localhost:3011/api/customer/auth.js \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "123-456-789"
  }'

# 3. Test Get Projects (use o token recebido acima)
curl http://localhost:3011/api/customer/get-projects.js \
  -H "Authorization: Bearer TOKEN_AQUI"

# 4. Test Update Task
curl -X POST http://localhost:3011/api/customer/update-task.js \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{
    "taskId": "tarefa_id_aqui",
    "completed": true
  }'
```

### Passo 5: Deploy no Vercel

```bash
# Atualizar variáveis de ambiente no Vercel
vercel env add NOTION_TOKEN
vercel env add NOTION_CLIENTES_DATABASE_ID
vercel env add NOTION_PROJETOS_DATABASE_ID
vercel env add NOTION_TAREFAS_DATABASE_ID

# Deploy
vercel --prod
```

---

## 🔐 Segurança Implementada

- ✅ JWT Tokens (7 dias de expiração)
- ✅ Validação de requests
- ✅ CORS configurado
- ✅ Delay anti-brute force (500ms)
- ✅ Token verification em todas as APIs protegidas
- ✅ Sanitização de inputs

---

## 📱 URLs de Acesso

### Desenvolvimento (localhost:3011)
- Landing page: `http://localhost:3011/customer/index.html`
- Login: `http://localhost:3011/customer/login.html`
- Dashboard: `http://localhost:3011/customer/dashboard.html`

### Produção
- Landing page: `https://seudominio.com/customer/index.html`
- Login: `https://seudominio.com/customer/login.html`
- Dashboard: `https://seudominio.com/customer/dashboard.html`

---

## 🎨 Customização do Design

### Cores
Edit em `dashboard.html` e `login.html`:
```css
:root {
    --primary: #2563eb;      /* Azul */
    --success: #10b981;      /* Verde */
    --warning: #f59e0b;      /* Amarelo */
    --danger: #ef4444;       /* Vermelho */
}
```

### Logo
No header:
```html
<div class="logo">📊 Dashboard</div>  <!-- Trocar emoji ou texto -->
```

---

## 🧪 Estrutura de Resposta da API

### GET `/api/customer/get-projects.js`
```json
{
  "success": true,
  "clientId": "notion-page-id",
  "clientName": "client@example.com",
  "projects": [
    {
      "id": "project-id",
      "name": "Projeto A",
      "status": "Em Andamento",
      "dataInicio": "2026-01-15",
      "dataFim": "2026-04-30"
    }
  ],
  "tasks": [
    {
      "id": "task-id",
      "title": "Tarefa 1",
      "status": "todo",
      "prioridade": "alta",
      "dueDate": "2026-03-25",
      "projetoId": "project-id"
    }
  ],
  "timeline": [
    {
      "date": "2026-01-15",
      "title": "Início do projeto",
      "status": "completed",
      "type": "project_start"
    }
  ],
  "stats": {
    "totalProjetos": 1,
    "totalTarefas": 12,
    "tarefasCompletadas": 3,
    "percentualConclusao": 25,
    "proximaTarefa": {
      "title": "Próxima Tarefa",
      "date": "2026-03-25"
    }
  }
}
```

---

## 🐛 Troubleshooting

### "Notion not configured"
- Verifique `.env` tem as variáveis `NOTION_TOKEN` e `NOTION_*_DATABASE_ID`
- Recarregue o servidor (`npm run dev`)

### "Invalid credentials"
- Verifique se email/senha existem na database Clientes
- Verifique os nomes das propriedades (case-sensitive no Notion)
- Tente usar um código de acesso em vez de email+senha

### "Unauthorized" (401)
- Token JWT expirou (7 dias) → Faça login novamente
- Token inválido → Verifique `JWT_SECRET` no `.env`

### Tarefas não aparecem
- Verifique se as relações (relationships) estão corretas no Notion
- Teste `/api/debug-notion.js` para ver a estrutura

### Database não conecta
- Verifique se o token Notion tem permissão na database
- Teste a API Notion diretamente:
```bash
curl https://api.notion.com/v1/databases/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 📋 Checklist Final

- [ ] `.env` atualizado com IDs das databases Notion
- [ ] Propriedades adaptadas nos arquivos `.js`
- [ ] Testado login com email+senha
- [ ] Testado login com código
- [ ] Dashboard carrega projetos
- [ ] Tarefas aparecem organizadas
- [ ] Checkbox de tarefas funciona
- [ ] Timeline carrega marcos
- [ ] Responsivo em mobile
- [ ] Deploy em produção

---

## 📚 Próximas Melhorias (Opcional)

1. **Notificações**
   - Enviar email quando nova tarefa for atribuída
   - Push notifications de prazos próximos

2. **Comentários**
   - Clientes poderem comentar em tarefas
   - Sistema de mensagens

3. **Relatórios**
   - Exportar progresso em PDF
   - Histórico de atividades

4. **Melhor Autenticação**
   - 2FA (two-factor authentication)
   - Recover password por email
   - OAuth com Google/GitHub

5. **Performance**
   - Cache das tarefas
   - Sincronização em tempo real (WebSocket)
   - Lazy loading de tarefas antigas

---

## 🚀 Ambiente de Produção

### Variáveis de Ambiente Necessárias
```bash
# Notion
NOTION_TOKEN=

# Database IDs
NOTION_CLIENTES_DATABASE_ID=
NOTION_PROJETOS_DATABASE_ID=
NOTION_TAREFAS_DATABASE_ID=

# Auth
JWT_SECRET=

# Node
NODE_ENV=production
```

### Teste de Produção
```bash
# Deploy
vercel --prod

# Acessar
https://seudominio.com/customer/login.html

# Testar API
curl https://seudominio.com/api/customer/auth.js \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```

---

**Versão:** 1.0.0
**Data:** 2026-03-23
**Status:** ✅ Pronto para configuração
