# ✅ Dashboard Customer - Adaptado ao Seu Notion

## 🎯 Status: PRONTO PARA TESTAR

Todas as APIs foram adaptadas aos nomes exatos das suas databases Notion.

---

## 📝 Mudanças Realizadas

### 1. **Autenticação Simplificada**
- ❌ Removido: Login com Email + Senha (não existia no Notion)
- ❌ Removido: Login com Código de Acesso (não existia no Notion)
- ✅ Implementado: Login com Email apenas (identifica cliente único)
- ✅ O email é a chave de identificação do cliente

**Arquivo modificado:** `customer/login.html` + `api/customer/auth.js`

### 2. **Mapping das Propriedades - CLIENTES**

| Seu Notion | Usado na API |
|-----------|---|
| `Name` (title) | Nome do cliente |
| `Email` (url) | Identificador para login |
| `Empresa` (rich_text) | Informação adicional |
| `Serviços` (multi_select) | Serviços contratados |
| `Segmento` (multi_select) | Tipo de negócio |
| `Projetos` (relation) | Link com projects |
| `Tarefas` (relation) | Link com tasks |

**Arquivo modificado:** `api/customer/auth.js`

### 3. **Mapping das Propriedades - PROJETOS**

| Seu Notion | Usado na API |
|-----------|---|
| `Name` (title) | Nome do projeto |
| `Cliente` (relation) | Relacionamento com cliente |
| `tag` (select) | Categoria do projeto |
| `Concluído` (checkbox) | Status de conclusão |
| `Tarefa` (relation) | Tarefas do projeto |

**Arquivo modificado:** `api/customer/get-projects.js`

### 4. **Mapping das Propriedades - TAREFAS**

| Seu Notion | Convertido Para | No Dashboard |
|-----------|---|---|
| `Status` = "Entrada ✉" | → `todo` | A Fazer |
| `Status` = "A Fazer" | → `todo` | A Fazer |
| `Status` = "📝Fazendo" | → `in_progress` | Em Progresso |
| `Status` = "⏱️Aguardando" | → `review` | Revisão |
| `Status` = "Concluído" | → `completed` | Concluído |
| `Prioridade` = "1ª" | → `alta` | 🔴 Alta |
| `Prioridade` = "2ª" | → `media` | 🟡 Média |
| `Prioridade` = "3ª" | → `baixa` | 🟢 Baixa |
| `Prioridade` = "4ª" | → `baixa` | 🟢 Baixa |

**Arquivo modificado:** `api/customer/get-projects.js`

### 5. **Update Task (Marcar Concluída)**

Quando o cliente marca uma tarefa como concluída:
- ✅ Checkbox marcado → Status muda para `"Concluído"` no Notion
- ☐ Checkbox desmarcado → Status volta para `"A Fazer"` no Notion

**Arquivo modificado:** `api/customer/update-task.js`

---

## 🔧 Variáveis de Ambiente (`.env`)

Já preenchidas com seus dados:

```bash
# Notion
NOTION_TOKEN=<seu-token-notion>
NOTION_CLIENTES_DATABASE_ID=f99b8bc792db45d282c91174454f7734
NOTION_PROJETOS_DATABASE_ID=1c5a19a461f54c61933cca8d0420690a
NOTION_TAREFAS_DATABASE_ID=8c237fea14d34104bf8823b4f3d04e94

# Outros (já existentes)
JWT_SECRET=...
ADMIN_USER=admin
ADMIN_PASS=senha123
NODE_ENV=development
```

---

## 🧪 Como Testar

### 1. **Teste o Login (via curl)**

```bash
# Teste com um email que existe na sua base de clientes
curl -X POST http://localhost:3011/api/customer/auth.js \
  -H "Content-Type: application/json" \
  -d '{"email":"seu.email@example.com"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "token": "eyJ...",
  "clientId": "notion-page-id",
  "clientName": "Nome do Cliente",
  "clientEmail": "seu.email@example.com"
}
```

### 2. **Teste o Dashboard (via URL)**

```
http://localhost:3011/customer/login.html
```

- Digite um email que existe na sua base de clientes
- Clique em "Acessar Dashboard"
- Deve ser redirecionado para `/customer/dashboard.html`

### 3. **Teste a API de Projetos (via curl)**

```bash
TOKEN="token-recebido-acima"

curl http://localhost:3011/api/customer/get-projects.js \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta esperada:**
```json
{
  "success": true,
  "clientId": "...",
  "clientName": "email@example.com",
  "projects": [
    {
      "id": "project-id",
      "name": "Projeto A",
      "tag": "Lançamento",
      "concluido": false
    }
  ],
  "tasks": [
    {
      "id": "task-id",
      "title": "Tarefa 1",
      "status": "todo",
      "statusOriginal": "A Fazer",
      "prioridade": "alta",
      "prioridadeOriginal": "1ª",
      "dueDate": "2026-03-25",
      "tipo": "Estratégico"
    }
  ],
  "stats": {
    "totalProjetos": 5,
    "projetosAtivos": 3,
    "totalTarefas": 25,
    "tarefasCompletadas": 8,
    "percentualConclusao": 32
  }
}
```

### 4. **Teste Update Task (via curl)**

```bash
TOKEN="token-acima"
TASK_ID="id-da-tarefa"

curl -X POST http://localhost:3011/api/customer/update-task.js \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"taskId":"'$TASK_ID'","completed":true}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "taskId": "task-id",
  "status": "Concluído",
  "message": "Tarefa atualizada com sucesso",
  "updatedAt": "2026-03-23T..."
}
```

---

## 📊 O Que o Cliente Vai Ver

### Dashboard Exibe:

**KPIs (Cards no topo)**
- 📈 **Progresso Geral**: % de tarefas concluídas
- ✓ **Tarefas Ativas**: Quantas tarefas não-concluídas
- 🎯 **Próximo Passo**: Qual é a próxima tarefa importante

**Tarefas Organizadas por Status**
- 🔵 **A Fazer**: Status = "Entrada ✉" ou "A Fazer"
- 🟠 **Em Progresso**: Status = "📝Fazendo"
- 🟡 **Revisão**: Status = "⏱️Aguardando"
- ✅ **Concluído**: Status = "Concluído"

**Cada tarefa mostra**
- Título
- Prioridade (1ª/2ª/3ª/4ª do Notion → Alta/Média/Baixa)
- Data de execução
- Checkbox para marcar concluída

**Abas por Projeto**
- Se o cliente tem múltiplos projetos, pode separar por aba
- Cada aba filtra tarefas do projeto respectivo

**Timeline**
- Mostra os marcos do projeto
- Próximas tarefas com vencimento

---

## ⚠️ Limitações Atuais

### O que funciona:
✅ Login por email
✅ Ver projetos do cliente
✅ Ver tarefas por status
✅ Marcar tarefa como concluída
✅ Abas por projeto
✅ KPIs e timeline

### O que NÃO funciona:
❌ Editar detalhes da tarefa (apenas marcar concluída)
❌ Adicionar comentários
❌ Upload de arquivos
❌ Alterar prioridade/tipo
❌ Filtros avançados

---

## 🚀 Deploy para Produção

Quando pronto, faça:

```bash
# 1. Atualizar variáveis no Vercel
vercel env add NOTION_TOKEN
vercel env add NOTION_CLIENTES_DATABASE_ID
vercel env add NOTION_PROJETOS_DATABASE_ID
vercel env add NOTION_TAREFAS_DATABASE_ID

# 2. Fazer push
git add -A
git commit -m "Add customer dashboard with Notion integration"

# 3. Deploy
vercel --prod
```

**URLs em produção:**
- Landing: `https://seudominio.com/customer/index.html`
- Login: `https://seudominio.com/customer/login.html`
- Dashboard: `https://seudominio.com/customer/dashboard.html`

---

## 🔒 Segurança

✅ JWT com 7 dias de expiração
✅ Token verification em todas as APIs
✅ Delay anti-brute force (500ms)
✅ CORS configurado
✅ Validação de inputs
✅ Notion token seguro no .env (git ignored)

---

## 📞 Suporte

Se algo não funcionar:

1. **Verifique o `.env`**
   ```bash
   echo $NOTION_TOKEN  # Deve mostrar seu token
   ```

2. **Teste a API Notion manualmente**
   ```bash
   TOKEN="seu-token"
   curl https://api.notion.com/v1/databases/f99b8bc792db45d282c91174454f7734 \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Verifique o console do navegador**
   - F12 → Console
   - Veja se tem erro de autenticação ou request

4. **Verifique os logs do servidor**
   ```bash
   npm run dev  # Mostra erros em tempo real
   ```

---

## 📋 Checklist Final

- [ ] `.env` tem os 4 IDs corretos
- [ ] Login funciona com um email real
- [ ] Dashboard carrega projetos e tarefas
- [ ] Tarefas aparecem nos 4 status corretos
- [ ] Checkbox funciona (marcar/desmarcar concluída)
- [ ] Abas por projeto funcionam
- [ ] Timeline aparece
- [ ] KPIs mostram números corretos
- [ ] Responsivo em mobile
- [ ] Deploy em staging testado

---

**Status:** ✅ Pronto para testar
**Data:** 2026-03-23
**Próximo Passo:** Testar com dados reais do seu Notion

