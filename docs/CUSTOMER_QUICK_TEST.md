# 🧪 Quick Test - Customer Dashboard

## ⚡ Teste Rápido em 5 Minutos

### Pré-requisitos
- Servidor rodando em `http://localhost:3011`
- Token e IDs Notion no `.env` (já preenchidos)
- Um cliente com email na base Notion

---

## 🧪 Teste 1: Verificar Ambiente

```bash
# Verificar se o token está configurado
cat .env | grep NOTION_TOKEN

# Deve retornar algo como:
# NOTION_TOKEN=ntn_105228...

# Verificar se os IDs estão corretos
cat .env | grep NOTION_
```

**✅ Esperado:** Ver 4 linhas com os IDs das databases

---

## 🧪 Teste 2: Login por Email

### Via cURL (recomendado para teste rápido)

```bash
# Substitua SEU_EMAIL por um email que existe no Notion
curl -X POST http://localhost:3011/api/customer/auth.js \
  -H "Content-Type: application/json" \
  -d '{"email":"seu.email@example.com"}'
```

**✅ Se funcionar, retorna:**
```json
{
  "success": true,
  "token": "eyJ0eXAi...",
  "clientId": "8c237fea-14d3-4104-bf88-23b4f3d04e94",
  "clientName": "Nome do Cliente",
  "clientEmail": "seu.email@example.com"
}
```

**❌ Se não funcionar:**
- "E-mail não encontrado" → Email não existe no Notion Clientes
- "Notion not configured" → Variáveis .env faltando
- Erro de rede → Servidor não está rodando

### Via Navegador (teste integrado)

1. Abra `http://localhost:3011/customer/login.html`
2. Digite o email
3. Clique em "Acessar Dashboard"
4. Se funcionar, vai redirecionar para o dashboard

---

## 🧪 Teste 3: Buscar Projetos e Tarefas

```bash
# Use o TOKEN recebido no teste anterior
TOKEN="eyJ0eXAi..."

curl http://localhost:3011/api/customer/get-projects.js \
  -H "Authorization: Bearer $TOKEN"
```

**✅ Se funcionar, retorna:**
```json
{
  "success": true,
  "clientId": "...",
  "projects": [
    {"id": "...", "name": "Projeto A", "tag": "Lançamento", "concluido": false}
  ],
  "tasks": [
    {"id": "...", "title": "Tarefa 1", "status": "todo", "prioridade": "alta"}
  ],
  "stats": {
    "percentualConclusao": 32,
    "totalTarefas": 25,
    "tarefasCompletadas": 8
  }
}
```

**❌ Se não funcionar:**
- "Unauthorized" → Token expirado ou inválido
- `projects: []` → Cliente não tem projetos
- `tasks: []` → Nenhuma tarefa relacionada

---

## 🧪 Teste 4: Marcar Tarefa Concluída

```bash
TOKEN="eyJ0eXAi..."
TASK_ID="id-da-tarefa-acima"

curl -X POST http://localhost:3011/api/customer/update-task.js \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"taskId":"'$TASK_ID'","completed":true}'
```

**✅ Se funcionar, retorna:**
```json
{
  "success": true,
  "taskId": "...",
  "status": "Concluído",
  "message": "Tarefa atualizada com sucesso"
}
```

**Verificação:** Vá ao Notion e veja se o Status da tarefa mudou para "Concluído"

**❌ Se não funcionar:**
- "Invalid request" → taskId ou completed faltando
- Notion error → Token sem permissão na database

---

## 🎯 Teste 5: Dashboard Completo

1. Abra `http://localhost:3011/customer/login.html`
2. Faça login
3. Verifique:
   - [ ] **Página carrega sem erros** (F12 → Console)
   - [ ] **KPI cards mostram números**
   - [ ] **Tarefas aparecem organizadas**
   - [ ] **Checkbox marca/desmarca**
   - [ ] **Abas por projeto funcionam**
   - [ ] **Responsive em mobile** (F12 → Device mode)

---

## 📊 Esperado vs Real

### Esperado no Dashboard:

| Componente | Esperado | Como Verificar |
|-----------|----------|---|
| **KPIs** | 3 cards com números | Devem mostrar valores > 0 |
| **Progresso** | Ex: 32% | Barra preenchida |
| **Tarefas Ativas** | Ex: 12 | Número baseado em não-concluídas |
| **Próximo Passo** | Nome da tarefa | Status != "Concluído" |
| **Abas** | 1 por projeto | Se tiver 3 projetos, 3 abas |
| **Status sections** | 4 grupos | A Fazer, Em Progresso, Revisão, Concluído |
| **Checkbox** | Funciona | Marca → Status "Concluído" |

---

## 🐛 Troubleshooting Rápido

### "E-mail não encontrado"
```bash
# Listar todos os emails no Notion (via API)
TOKEN="seu-token"
curl https://api.notion.com/v1/databases/f99b8bc792db45d282c91174454f7734/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -X POST -d '{}'
```

Procure pelo email no resultado.

### "Tarefas não aparecem"
- Verificar se as tarefas estão vinculadas ao projeto
- Verificar se o projeto está vinculado ao cliente
- Verificar Status das tarefas (devem estar um dos 5 valores)

### "Status não muda"
- Verificar se o token tem permissão write na database
- Verificar o console (F12) para erro específico
- Tentar atualizar manualmente no Notion primeiro

### "Navegador fica branco"
1. Abra F12 → Console
2. Procure por erro (vermelho)
3. Copie e compartilhe o erro

---

## ✅ Checklist de Sucesso

Se tudo isso funcionar, está 100% pronto:

- [ ] Login com email funciona
- [ ] API retorna projetos
- [ ] API retorna tarefas
- [ ] Tarefas mostram status correto
- [ ] Prioridades aparecem (1ª/2ª/3ª/4ª)
- [ ] Marcar concluída funciona
- [ ] Dashboard carrega sem erros
- [ ] KPIs mostram valores corretos
- [ ] Abas por projeto funcionam
- [ ] Responsive (mobile funciona)

---

## 🚀 Próximo Passo

Se passou nos testes:

```bash
# 1. Commit
git add -A
git commit -m "Customer dashboard com Notion integration"

# 2. Deploy
vercel --prod

# 3. Testar em produção
https://seu-dominio.com/customer/login.html
```

---

**Qualquer dúvida, compartilhe o erro do console (F12) ou o resultado do curl! 🎯**
