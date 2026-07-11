# SITE RONCOLATO - Estrutura Reorganizada

## 📁 Estrutura do Projeto

```
SITE RONCOLATO/
├── server.js                    # Servidor principal (porta 3012)
├── package.json                 # Dependências
├── .env                         # Configurações
│
├── public/                      # Arquivos públicos
│   ├── index.html              # Homepage
│   ├── admin/                  # Painel admin
│   │   ├── login.html          # Login
│   │   ├── dashboard.html      # Dashboard principal
│   │   └── dashboard-projetos.html
│   ├── pages/                  # Páginas do site
│   └── assets/                 # Imagens, fonts, etc
│
├── src/                        # Código-fonte
│   ├── api/admin/              # APIs do admin
│   │   └── notion-dashboard.js
│   ├── api/public/             # APIs públicas
│   └── utils/                  # Utilitários
│
├── data/                       # Dados
├── docs/                       # Documentação
├── ARCHIVE/                    # Conteúdo antigo
└── AGENDA/                     # Projeto agenda
```

## 🚀 Como Usar

### Iniciar servidor
```bash
npm start
```

### Acessar
- Site: http://localhost:3012
- Admin Login: http://localhost:3012/public/admin/login.html
- Dashboard: http://localhost:3012/public/admin/dashboard.html

### Credenciais
- Usuário: `roncolato`
- Senha: `Senha123`

## 🔌 APIs Notion

- GET `/api/admin/notion-dashboard/tarefas`
- GET `/api/admin/notion-dashboard/projetos`
- GET `/api/admin/notion-dashboard/clientes`
- GET `/api/admin/notion-dashboard/stats`
- POST `/api/admin/notion-dashboard/criar-projeto`

---
**Reorganização concluída em 26/05/2026**
