# ⚡ ADMIN QUICK START

**Guia Rápido de Implementação - Admin Roncolato**

---

## 🚀 Começo Rápido (5 minutos)

### 1. Copie os 4 Arquivos Novos
```bash
admin/
├── dashboard-v2.html    ← Renomear para dashboard.html
├── styles-admin.css     ← CSS novo
├── components.js        ← Componentes reutilizáveis
└── app.js               ← Lógica da aplicação
```

### 2. Atualize o HTML Principal
Abra `dashboard.html` e procure por:
```html
<link rel="stylesheet" href="styles-admin.css">
<script src="components.js"></script>
<script src="app.js"></script>
```

### 3. Verifique Endpoints da API
Backend dev precisa implementar em `/api/admin/`:
- `POST /projects` - Criar projeto
- `GET /projects` - Listar projetos
- `PATCH /projects/{key}` - Editar projeto
- `DELETE /projects/{key}` - Deletar projeto
- `POST /articles` - Criar artigo
- `GET /articles` - Listar artigos
- `PATCH /articles/{slug}` - Editar artigo
- `DELETE /articles/{slug}` - Deletar artigo

---

## 🎯 Uso de Componentes

### Toast (Notificações)
```javascript
Toast.show('Sucesso!', 'success')
Toast.show('Erro!', 'error')
Toast.show('Aviso!', 'warning')
```

### Modal (Confirmação)
```javascript
const modal = new Modal(
  'Deletar?',
  'Tem certeza?',
  [
    { text: 'Cancelar', action: () => {} },
    { text: 'Deletar', action: () => doDelete() }
  ]
);
modal.show();
```

### FormValidator (Validar Forms)
```javascript
const isValid = FormValidator.validate(form, {
  email: [FormValidator.rules.required, FormValidator.rules.email],
  title: [FormValidator.rules.required, FormValidator.rules.maxLength(100)]
});

if (!isValid) {
  FormValidator.showErrors(form);
}
```

### Table (Tabelas)
```javascript
const table = new Table(
  'container-id',
  [
    { key: 'title', label: 'Título' },
    { key: 'date', label: 'Data' }
  ],
  data,
  [
    {
      name: 'delete',
      label: 'Deletar',
      callback: (row) => deleteItem(row)
    }
  ]
);
table.render();
```

---

## 📋 Campos do Portfólio

| Campo | Tipo | Obrigatório | Max |
|-------|------|-------------|-----|
| Title | text | ✅ | 100 |
| Year | number | ✅ | — |
| Client | text | ✅ | 100 |
| Deliverable | text | ✅ | 100 |
| Category | select | ✅ | — |
| Description | textarea | ✅ | 300 |
| Link | url | ❌ | — |
| Images | files | ✅ | 5MB ea |
| Cover | select | ✅ | — |

---

## 📝 Campos do Blog

| Campo | Tipo | Obrigatório | Max |
|-------|------|-------------|-----|
| Title | text | ✅ | 200 |
| Excerpt | textarea | ✅ | 300 |
| Tag | select | ✅ | — |
| Date | date | ✅ | — |
| ReadTime | text | ✅ | 50 |
| Content | textarea | ✅ | — |
| Image | file | ❌ | 5MB |

---

## 🔐 Autenticação

```javascript
// Salvo automaticamente após login
localStorage.getItem('adminToken')      // JWT
localStorage.getItem('adminUser')       // Nome do usuário

// Usado em todas as requisições
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🎨 Design System Colors

```css
--color-yellow: #F5C518       /* Principal */
--color-black: #1A1A1A        /* Text */
--color-white: #FFFFFF        /* Background */
--color-success: #10B981      /* Sucesso */
--color-error: #EF4444        /* Erro */
--color-warning: #F59E0B      /* Aviso */
--color-info: #3B82F6         /* Info */
```

---

## 📱 Responsivo

- ✅ Mobile (320px+)
- ✅ Tablet (640px+)
- ✅ Desktop (1024px+)

---

## ✅ Checklist Final

- [ ] Arquivos novos copiados
- [ ] HTML atualizado com links corretos
- [ ] Backend endpoints implementados
- [ ] JWT authentication funcionando
- [ ] Testes em mobile/desktop
- [ ] Documentação pronta

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| "Erro ao carregar projetos" | Verificar API endpoint e token JWT |
| Modal não fecha | Pressionar ESC ou clicar OK |
| Imagens não aparecem | Validar tipo (JPEG/PNG/WebP) e tamanho (5MB) |
| Formulário não valida | Verificar FormValidator.rules |

---

**Pronto para usar! 🎉**
