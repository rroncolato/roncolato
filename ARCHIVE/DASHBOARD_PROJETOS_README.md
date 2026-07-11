# Dashboard de Projetos — Roncolato

Dashboard em **dark mode** conectada ao seu **Notion** para gerenciar Projetos, Tarefas e Clientes em tempo real.

## 📍 Acessar

```
http://localhost:3012/dashboard-projetos.html
```

## 🎨 Visual

- **Dark Mode** completo (tema noturno)
- Identidade visual **Roncolato** (cores azuis)
- Responsive e otimizado
- 3 visualizações: **Painel, Board, Galeria**

## 🔌 APIs Disponíveis

Todas as rotas retornam JSON e estão sincronizadas com o Notion:

### Projetos
```bash
GET /api/admin/notion-dashboard/projetos
```
Retorna lista de todos os projetos com status, progresso, datas, responsáveis.

### Tarefas
```bash
GET /api/admin/notion-dashboard/tarefas
```
Retorna todas as tarefas com prioridade, status, datas de conclusão.

### Clientes
```bash
GET /api/admin/notion-dashboard/clientes
```
Retorna lista de clientes com contato, status, projetos relacionados.

### Estatísticas
```bash
GET /api/admin/notion-dashboard/stats
```
Retorna KPIs gerais: totais, ativos, concluídos, taxa de conclusão.

### Criar Projeto
```bash
POST /api/admin/notion-dashboard/criar-projeto
```

Corpo:
```json
{
  "title": "Nome do Projeto",
  "description": "Descrição",
  "dueDate": "2026-06-30",
  "category": "Geral"
}
```

## 🔧 Configuração

Certifique-se de que o `.env` tem:

```env
NOTION_TOKEN=seu_token_aqui
NOTION_PROJETOS_DATABASE_ID=database_id
NOTION_TAREFAS_DATABASE_ID=database_id
NOTION_CLIENTES_DATABASE_ID=database_id
```

Tokens encontrados em: [Notion Integrations](https://www.notion.so/my-integrations)

## 📊 Visualizações

### 1. **Painel Geral** (Overview)
- KPIs principais (Ativos, Pendentes, Tarefas, Taxa)
- Projetos recentes do Notion
- Tarefas pendentes
- Estatísticas rápidas

### 2. **Board Kanban**
- 4 colunas: A Fazer → Em Progresso → Aguarda Revisão → Concluído
- Arraste e solte (drag & drop)
- Código pronto para integrar com API

### 3. **Galeria**
- Visualização em cards
- Um projeto por card
- Informações condensadas e visuais

## 🛠️ Próximas Funcionalidades

- [ ] Integração completa de drag-drop com Notion
- [ ] Filtros dinâmicos por categoria
- [ ] Busca em tempo real
- [ ] Modal de detalhes de projeto
- [ ] Edição inline de status/progresso
- [ ] Notificações de atualizações
- [ ] Integração com Google Calendar
- [ ] Export para PDF

## 📝 Notas Técnicas

- **Framework**: Vanilla JS (sem dependências)
- **Estilo**: CSS Grid + Flexbox
- **Dark Mode**: Variáveis CSS customizáveis
- **API**: Node.js HTTP nativo com Notion SDK

## 🚀 Como Iniciar o Servidor

```bash
npm start
# ou
node src/server.js
```

Servidor roda em `http://localhost:3012`

## 💡 Customizações

### Mudar cores da identidade visual

No arquivo `dashboard-projetos.html`, edite as variáveis CSS em `:root`:

```css
:root {
  --primary: #1D4ED8;        /* Cor principal */
  --amber: rgba(251, 191, 36, 0.85);  /* Alertas */
  --green: rgba(34, 197, 94, 0.85);   /* Sucesso */
}
```

### Adicionar novas categorias

No arquivo `dashboard-projetos.html`, na seção de sidebar:

```html
<div class="ni" data-filter="nova-categoria" onclick="filterProjects('nova-categoria')">
  <span class="ni-dot" style="background: #sua-cor;"></span>
  Nova Categoria
</div>
```

## 📞 Suporte

Para integração com Notion ou problemas, verifique:
- `.env` com credenciais corretas
- IDs dos databases do Notion válidos
- Permissões de integração na conta Notion

---

**Versão**: 1.0  
**Data**: Maio 2026  
**Criado para**: Roncolato
