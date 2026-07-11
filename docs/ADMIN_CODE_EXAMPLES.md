# 💻 ADMIN - CODE EXAMPLES

**Exemplos de Uso dos Componentes**

---

## 1. Toast - Notificações

### Sucesso
```javascript
Toast.show('Projeto adicionado com sucesso!', 'success', 3000);
```

### Erro
```javascript
Toast.show('Erro ao deletar: acesso negado', 'error', 5000);
```

### Aviso
```javascript
Toast.show('Atenção: esta ação não pode ser desfeita', 'warning', 4000);
```

### Informação
```javascript
Toast.show('Backup realizado automaticamente', 'info', 3000);
```

### Remover Manualmente
```javascript
const notification = Toast.show('Carregando...', 'info', 0); // duration: 0
// ... depois de um evento
notification.remove();
```

---

## 2. Modal - Diálogos

### Confirmação Simples
```javascript
const modal = new Modal(
  'Deletar Projeto',
  'Tem certeza que deseja deletar "Cliente ABC"? Esta ação é irreversível.',
  [
    { text: 'Cancelar', action: () => console.log('Cancelado') },
    { text: 'Deletar', action: () => deleteProject() }
  ]
);
modal.show();
```

### Apenas Informação
```javascript
const modal = new Modal(
  'Sucesso!',
  'Projeto publicado com sucesso em rroncolato.com.br/portfolio',
  [
    { text: 'OK', action: () => location.reload() }
  ]
);
modal.show();
```

### Fechar Modal Programaticamente
```javascript
const modal = new Modal('Título', 'Conteúdo', []);
modal.show();
// ... depois de um evento
modal.close();
```

### Com Conteúdo HTML
```javascript
const modal = new Modal(
  'Editar Projeto',
  `
    <p><strong>Projeto:</strong> Cliente ABC</p>
    <p><strong>Ano:</strong> 2025</p>
    <p><strong>Categoria:</strong> Personal Branding</p>
    <hr>
    <p style="color: #909090; font-size: 13px;">
      Edição completa será implementada em breve
    </p>
  `,
  [{ text: 'Fechar', action: () => {} }]
);
modal.show();
```

---

## 3. FormValidator - Validação

### Validação Básica
```javascript
const form = document.getElementById('myForm');
const rules = {
  username: [FormValidator.rules.required],
  email: [FormValidator.rules.required, FormValidator.rules.email],
  password: [
    FormValidator.rules.required,
    FormValidator.rules.minLength(8)
  ]
};

const isValid = FormValidator.validate(form, rules);

if (!isValid) {
  FormValidator.showErrors(form);
  return;
}

// Submeter formulário
submitForm();
```

### Validação com Arquivo
```javascript
const rules = {
  title: [FormValidator.rules.required, FormValidator.rules.maxLength(100)],
  images: [
    FormValidator.rules.required,
    FormValidator.rules.fileType('image/jpeg,image/png,image/webp'),
    FormValidator.rules.fileSize(5) // 5 MB
  ]
};

if (!FormValidator.validate(form, rules)) {
  FormValidator.showErrors(form);
  return;
}
```

### Obter Erros Programaticamente
```javascript
const errors = FormValidator.getErrors();

Object.keys(errors).forEach(fieldName => {
  console.log(`${fieldName}: ${errors[fieldName]}`);
});

// Output:
// email: Email inválido
// password: Mínimo de 8 caracteres
```

### Validação Customizada
```javascript
// Criar regra customizada
const customRules = {
  customField: [
    (value) => {
      if (value.length < 5) return 'Mínimo 5 caracteres';
      if (!value.includes('ABC')) return 'Deve conter "ABC"';
      return null; // Válido
    }
  ]
};

FormValidator.validate(form, customRules);
```

---

## 4. Table - Tabelas Dinâmicas

### Tabela Simples
```javascript
const columns = [
  { key: 'title', label: 'Projeto' },
  { key: 'client', label: 'Cliente' },
  { key: 'year', label: 'Ano' }
];

const data = [
  { title: 'Sessão ABC', client: 'Empresa XYZ', year: 2025 },
  { title: 'Evento 123', client: 'Empresa 456', year: 2024 }
];

const table = new Table('tableContainer', columns, data);
table.render();
```

### Tabela com Ações
```javascript
const columns = [
  { key: 'title', label: 'Projeto' },
  { key: 'category', label: 'Categoria' },
  { key: 'visible', label: 'Status' }
];

const actions = [
  {
    name: 'edit',
    label: 'Editar',
    color: '#F5C518',
    callback: (row) => {
      console.log('Editar:', row);
      showEditModal(row);
    }
  },
  {
    name: 'hide',
    label: 'Ocultar',
    color: '#F3F3F3',
    callback: (row) => {
      console.log('Alternar visibilidade:', row);
      toggleVisibility(row);
    }
  },
  {
    name: 'delete',
    label: 'Deletar',
    color: '#FEE2E2',
    callback: (row) => {
      console.log('Deletar:', row);
      showDeleteConfirm(row);
    }
  }
];

const table = new Table(
  'portfolioTable',
  columns,
  data,
  actions
);
table.render();
```

### Renderizar Custom para Coluna
```javascript
const columns = [
  {
    key: 'title',
    label: 'Projeto'
  },
  {
    key: 'visible',
    label: 'Status',
    render: (value) => {
      return value
        ? '<span style="color: #10B981;">✓ Publicado</span>'
        : '<span style="color: #909090;">○ Oculto</span>';
    }
  },
  {
    key: 'createdAt',
    label: 'Data',
    render: (value) => {
      return new Date(value).toLocaleDateString('pt-BR');
    }
  }
];

const table = new Table('container', columns, data);
table.render();
```

### Atualizar Dados
```javascript
const table = new Table('container', columns, initialData);
table.render();

// Depois, atualizar dados
fetch('/api/admin/projects')
  .then(r => r.json())
  .then(data => {
    table.update(data.projects);
  });
```

---

## 5. Card - Containers

### Card Simples
```javascript
const card = Card.create({
  title: 'Novo Projeto',
  content: 'Cliente ABC - Sessão fotográfica completa'
});

container.appendChild(card);
```

### Card com Ações
```javascript
const card = Card.create({
  title: 'Projeto ABC',
  content: 'Sessão fotográfica de 2 horas em estúdio',
  actions: [
    {
      name: 'view',
      label: 'Visualizar',
      color: '#F5C518',
      fn: () => openProject('abc')
    },
    {
      name: 'edit',
      label: 'Editar',
      color: '#F3F3F3',
      fn: () => editProject('abc')
    },
    {
      name: 'delete',
      label: 'Deletar',
      color: '#FEE2E2',
      fn: () => deleteProject('abc')
    }
  ]
});

container.appendChild(card);
```

### Card Clicável
```javascript
const card = Card.create({
  title: 'Evento 2025',
  content: 'Cobertura fotográfica de evento corporativo',
  onClick: () => {
    openProjectDetails('event-2025');
  }
});

container.appendChild(card);
```

### Cards em Grid
```javascript
const projects = [
  { id: '1', name: 'Projeto A', desc: 'Descrição A' },
  { id: '2', name: 'Projeto B', desc: 'Descrição B' },
  { id: '3', name: 'Projeto C', desc: 'Descrição C' }
];

const cardsContainer = document.getElementById('cardsGrid');
cardsContainer.style.display = 'grid';
cardsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
cardsContainer.style.gap = '16px';

projects.forEach(project => {
  const card = Card.create({
    title: project.name,
    content: project.desc,
    actions: [
      { name: 'edit', label: 'Editar', fn: () => editProject(project.id) },
      { name: 'delete', label: 'Deletar', fn: () => deleteProject(project.id) }
    ]
  });
  cardsContainer.appendChild(card);
});
```

---

## 6. ImagePreview - Preview de Imagens

### Preview ao Selecionar
```javascript
const fileInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('preview');

fileInput.addEventListener('change', (e) => {
  ImagePreview.show(e.target.files, 'preview');
});
```

### Com Validação
```javascript
document.getElementById('portfolioImages').addEventListener('change', (e) => {
  const files = e.target.files;

  // Validar tipo
  for (let file of files) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      Toast.show('Apenas JPEG, PNG ou WebP permitidos', 'error');
      return;
    }
  }

  // Validar tamanho
  for (let file of files) {
    if (file.size > 5 * 1024 * 1024) {
      Toast.show('Máximo 5MB por imagem', 'error');
      return;
    }
  }

  // Mostrar preview
  ImagePreview.show(files, 'portfolioImagePreview');
});
```

---

## 7. DragDropZone - Drag & Drop

### Básico
```javascript
new DragDropZone('fileInput', (files) => {
  console.log('Arquivos soltos:', files);
  ImagePreview.show(files, 'preview');
});
```

### Com Validação
```javascript
new DragDropZone('portfolioImages', (files) => {
  // Validar
  for (let file of files) {
    if (file.size > 5 * 1024 * 1024) {
      Toast.show('Arquivo muito grande', 'error');
      return;
    }
  }

  // Processar
  ImagePreview.show(files, 'portfolioImagePreview');
  document.getElementById('portfolioImages').files = files;
});
```

---

## 8. Tabs - Navegação

### Setup Básico
```javascript
const tabs = new Tabs('tabsContainer', [
  {
    label: 'Dashboard',
    content: '<h3>Bem-vindo ao Dashboard</h3><p>Estatísticas aqui...</p>'
  },
  {
    label: 'Configurações',
    content: '<h3>Configurações do Sistema</h3><form>...</form>'
  },
  {
    label: 'Sobre',
    content: '<h3>Sobre o Admin</h3><p>Versão 1.0...</p>'
  }
]);

tabs.render();
```

---

## 9. AdminApp - Lógica Principal

### Inicializar
```javascript
document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
```

### Mudar Aba
```javascript
// Progamático
AdminApp.switchTab('manage-portfolio');

// Via botão HTML
<button class="tab-btn" data-tab="portfolio">Portfólio</button>
```

### Logout
```javascript
document.getElementById('logoutBtn').addEventListener('click', () => {
  AdminApp.logout();
});
```

### Carregar Lista
```javascript
// Portfólio
AdminApp.loadPortfolioList();

// Blog
AdminApp.loadBlogList();
```

### Deletar Com Confirmação
```javascript
AdminApp.deletePortfolio({
  key: 'project-123',
  title: 'Projeto ABC'
});
```

---

## 10. Integrações Completas

### Flow: Adicionar Projeto
```javascript
// HTML
<form id="portfolioForm">
  <input id="pTitle" name="pTitle" required>
  <select id="pCover" name="pCover"></select>
  <button type="submit">Adicionar</button>
</form>

// JavaScript
document.getElementById('portfolioForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validar
  const rules = {
    pTitle: [FormValidator.rules.required, FormValidator.rules.maxLength(100)],
    pImages: [FormValidator.rules.required]
  };

  if (!FormValidator.validate(e.target, rules)) {
    FormValidator.showErrors(e.target);
    return;
  }

  // Construir FormData
  const formData = new FormData(e.target);
  formData.append('category', AdminApp.state.formData.portfolioCategory);
  formData.append('token', AdminApp.state.token);

  // Enviar
  try {
    const response = await fetch('/api/admin/projects', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    Toast.show('Projeto adicionado!', 'success');
    e.target.reset();

    // Atualizar lista
    setTimeout(() => AdminApp.loadPortfolioList(), 500);

  } catch (error) {
    Toast.show(error.message, 'error');
  }
});
```

### Flow: Deletar Com Modal
```javascript
function deleteProject(project) {
  const modal = new Modal(
    'Deletar Projeto',
    `Tem certeza que deseja deletar "<strong>${project.title}</strong>"?<br>
     Esta ação é permanente e não pode ser desfeita.`,
    [
      {
        text: 'Cancelar',
        action: () => console.log('Cancelado')
      },
      {
        text: 'Deletar',
        action: async () => {
          try {
            const response = await fetch(`/api/admin/projects/${project.key}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${AdminApp.state.token}`
              }
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error);
            }

            Toast.show('Projeto deletado!', 'success');
            AdminApp.loadPortfolioList();

          } catch (error) {
            Toast.show(error.message, 'error');
          }
        }
      }
    ]
  );

  modal.show();
}
```

---

**Mais exemplos em desenvolvimento... 🚀**
