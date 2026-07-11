# 🔌 Guia de Adaptação - Nomes das Propriedades do Notion

## Como Descobrir os Nomes Exatos

### Passo 1: Rodar Debug API
```bash
curl http://localhost:3011/api/debug-notion.js
```

Vai retornar algo como:
```json
{
  "properties": {
    "Nome": "title",
    "Email": "email",
    "Senha": "rich_text",
    "Codigo_Acesso": "rich_text"
  }
}
```

**Use EXATAMENTE estes nomes** (case-sensitive).

---

## Exemplo Prático de Adaptação

### ❌ Se sua Database tem:
```
[Cliente Table]
├─ "Client Name" (title)
├─ "Email Address" (email)
├─ "Access Code" (rich_text)
└─ "Password Hash" (rich_text)
```

### ✅ Você muda em `api/customer/auth.js`:

```javascript
// ANTES (padrão):
const clientEmail = result.properties['Email']?.email || '';
const clientPassword = result.properties['Senha']?.rich_text?.[0]?.text?.content || '';
const clientName = result.properties['Nome']?.title?.[0]?.text?.content || 'Cliente';

// DEPOIS (seus nomes):
const clientEmail = result.properties['Email Address']?.email || '';
const clientPassword = result.properties['Password Hash']?.rich_text?.[0]?.text?.content || '';
const clientName = result.properties['Client Name']?.title?.[0]?.text?.content || 'Cliente';
```

---

## Mapeamento Completo de Propriedades

### Database CLIENTES (Clients)

| Padrão | Tipo Notion | Descrição |
|--------|------------|-----------|
| `Nome` | title | Título/nome do cliente |
| `Email` | email | E-mail do cliente |
| `Senha` | rich_text | Senha (em produção, usar hash) |
| `Codigo_Acesso` | rich_text | Código único para acesso sem senha |
| `Telefone` | phone_number | Contato (opcional) |
| `Empresa` | rich_text | Nome da empresa (opcional) |

### Database PROJETOS (Projects)

| Padrão | Tipo Notion | Descrição |
|--------|------------|-----------|
| `Nome` | title | Nome do projeto |
| `Cliente` | relation | Relacionamento com Clientes |
| `Status` | select | Em Andamento, Concluído, Pausado |
| `Descricao` | rich_text | Descrição do projeto |
| `Data_Inicio` | date | Data de início |
| `Data_Fim` | date | Data de conclusão |
| `Responsavel` | people | Quem gerencia |
| `Valor` | currency | Valor do projeto (opcional) |

### Database TAREFAS (Tasks)

| Padrão | Tipo Notion | Descrição |
|--------|------------|-----------|
| `Titulo` | title | Título da tarefa |
| `Projeto` | relation | Relacionamento com Projetos |
| `Status` | select | todo, in_progress, review, completed |
| `Prioridade` | select | alta, media, baixa |
| `Descricao` | rich_text | Descrição completa |
| `Data_Vencimento` | date | Quando deve ser entregue |
| `Responsavel` | people | Quem faz |
| `Tags` | multi_select | Categorias (opcional) |
| `Horas_Estimadas` | number | Tempo esperado (opcional) |
| `Anexos` | files | Arquivos (opcional) |

---

## Exemplos de Adaptação Específicos

### Exemplo 1: Propriedades em Português

Se sua database está em português com nomes diferentes:

```javascript
// ANTES:
const clientName = result.properties['Nome']?.title?.[0]?.text?.content;

// DEPOIS:
const clientName = result.properties['Razão Social']?.title?.[0]?.text?.content;
```

### Exemplo 2: Propriedade de Status com Nomes Diferentes

```javascript
// ANTES:
status: result.properties['Status']?.select?.name || 'todo'

// DEPOIS (se seus nomes são "A Fazer", "Em Andamento", etc):
const statusMap = {
  'A Fazer': 'todo',
  'Em Andamento': 'in_progress',
  'Em Revisão': 'review',
  'Concluído': 'completed'
};
const rawStatus = result.properties['Status']?.select?.name || 'A Fazer';
status: statusMap[rawStatus] || 'todo'
```

### Exemplo 3: Relacionamentos com IDs Diferentes

```javascript
// Se sua relação se chama "Projeto Relacionado" em vez de "Projeto":
projetoId: result.properties['Projeto Relacionado']?.relation?.[0] || null
```

---

## Verificar Tipos de Propriedades

### No Notion
1. Abra sua database
2. Clique em ⋮ (menu)
3. Select "Edit database"
4. Veja a coluna "Property type" para cada campo

### Tipos Notion e Como Acessar

```javascript
// Title
result.properties['Nome']?.title?.[0]?.text?.content

// Rich Text
result.properties['Descricao']?.rich_text?.[0]?.text?.content

// Email
result.properties['Email']?.email

// Select (único)
result.properties['Status']?.select?.name

// Multi Select (múltiplos)
result.properties['Tags']?.multi_select?.map(t => t.name)

// Relation (relacionamento)
result.properties['Projeto']?.relation?.[0]  // Primeiro ID

// People
result.properties['Responsavel']?.people?.[0]?.name

// Date
result.properties['Data_Vencimento']?.date?.start

// Phone Number
result.properties['Telefone']?.phone_number

// Currency
result.properties['Valor']?.currency

// Number
result.properties['Horas']?.number

// Checkbox
result.properties['Concluido']?.checkbox
```

---

## Passo a Passo para Adaptar

### 1. Identificar seus nomes
```bash
# Rode o debug
curl http://localhost:3011/api/debug-notion.js

# Copie os nomes das propriedades exatamente como aparecem
```

### 2. Editar `api/customer/auth.js`

Encontre a função `findClientByEmail`:
```javascript
async function findClientByEmail(notionToken, databaseId, email, password) {
    // ... código ...
    const clientEmail = result.properties['Email']?.email || '';
    //                                    ^^^^^^^ TROCAR POR SEU NOME
    const clientPassword = result.properties['Senha']?.rich_text?.[0]?.text?.content || '';
    //                                       ^^^^^ TROCAR POR SEU NOME
    // ... resto do código ...
}
```

### 3. Editar `api/customer/get-projects.js`

Encontre a função `getClientProjects`:
```javascript
async function getClientProjects(notionToken, databaseId, clientId) {
    // ... código ...
    body: JSON.stringify({
        filter: {
            property: 'Cliente',  // TROCAR SE NECESSÁRIO
            //        ^^^^^^^^
            relation: { contains: clientId }
        }
    })
    // ... resto do código ...
}
```

E o mapeamento de retorno:
```javascript
return data.results.map(result => ({
    id: result.id,
    name: result.properties['Nome']?.title?.[0]?.text?.content || 'Sem Nome',
    //                       ^^^^^ TROCAR
    descricao: result.properties['Descricao']?.rich_text?.[0]?.text?.content || '',
    //                          ^^^^^^^^^^ TROCAR
    // ... resto das propriedades ...
}));
```

### 4. Editar `api/customer/get-projects.js` - Tarefas

Encontre a função `getProjectTasks`:
```javascript
async function getProjectTasks(notionToken, databaseId, projectIds) {
    // ... código ...
    body: JSON.stringify({
        filter: filters.length === 1 ? filters[0] : {
            or: filters
        }
        // Verificar se 'Projeto' existe, senão trocar
    })
    // ... resto do código ...
}
```

E o mapeamento:
```javascript
return data.results.map(result => ({
    id: result.id,
    title: result.properties['Titulo']?.title?.[0]?.text?.content || 'Sem Título',
    //                       ^^^^^^^ TROCAR
    descricao: result.properties['Descricao']?.rich_text?.[0]?.text?.content || '',
    //                          ^^^^^^^^^^ TROCAR
    status: result.properties['Status']?.select?.name || 'todo',
    //                        ^^^^^^ TROCAR SE NECESSÁRIO
    prioridade: result.properties['Prioridade']?.select?.name || 'baixa',
    //                            ^^^^^^^^^^ TROCAR SE NECESSÁRIO
    // ... resto das propriedades ...
}));
```

---

## Template de Busca para Encontrar Todas as Mudanças

Use Ctrl+F (ou Cmd+F) para buscar e trocar:

```
Buscar:           result.properties['Nome']
Trocar por:       result.properties['SEU_NOME']

Buscar:           property: 'Cliente'
Trocar por:       property: 'SEU_NOME_DA_RELACAO'

Buscar:           property: 'Projeto'
Trocar por:       property: 'SEU_NOME_DA_RELACAO'

Buscar:           'Status'
Trocar por:       'SEU_NOME_DO_STATUS'
```

---

## Validação - Como Testar Após Adaptações

### 1. Teste a API de Auth
```bash
curl -X POST http://localhost:3011/api/customer/auth.js \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu_email_cliente@example.com",
    "password": "sua_senha"
  }'
```

Deve retornar um token se tiver um cliente com este e-mail.

### 2. Teste a API de Projects
```bash
# Use o token recebido acima
TOKEN="eyJ..."

curl http://localhost:3011/api/customer/get-projects.js \
  -H "Authorization: Bearer $TOKEN"
```

Deve retornar projetos e tarefas do cliente.

### 3. Verifique os Dados

Se retornar campos vazios (ex: `name: "Sem Nome"`), significa que você errou o nome da propriedade.

Volte ao debug:
```bash
curl http://localhost:3011/api/debug-notion.js | grep -i "nome"
```

E encontre o nome correto.

---

## Dúvidas Frequentes

**P: Meu Notion está em outro idioma, como descubro os nomes?**
R: Use `/api/debug-notion.js` - ele retorna os nomes exatamente como estão no Notion.

**P: Posso usar emojis ou caracteres especiais?**
R: Sim! Notion suporta. Apenas use o nome EXATO com os emojis se tiverem.

**P: E se minha propriedade tem espaço?**
R: Use com as aspas: `result.properties['Meu Campo']`

**P: Como mudo se tenho múltiplas databases de clientes?**
R: Você pode criar uma UNION dos resultados ou filtrar por um tipo específico.

---

**Última atualização:** 2026-03-23
