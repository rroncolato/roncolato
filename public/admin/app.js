/**
 * ============================================================================
 * APP.JS - Lógica Principal do Admin
 * ============================================================================
 * Gerenciamento de estado, CRUD e integração com APIs
 * Stack: Vanilla JavaScript
 * Design System: Light Mode com Yellow #F5C518
 * ============================================================================
 */

// ============================================================================
// APP STATE & CONFIG
// ============================================================================

const AdminApp = {
  // Estado da aplicação
  state: {
    user: null,
    token: null,
    isLoading: false,
    currentTab: 'dashboard',
    portfolio: [],
    blog: [],
    formData: {}
  },

  // Configuração
  config: {
    apiBase: '/api/admin',
    maxImageSize: 5, // MB
    acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    portfolioCategories: [
      'Personal Branding',
      'Fotografia Executiva',
      'Eventos',
      'Branding'
    ],
    blogCategories: [
      'Personal Branding',
      'Fotografia Executiva',
      'Bastidores',
      'Equipamento',
      'Mercado'
    ]
  },

  // ========================================================================
  // INICIALIZAÇÃO
  // ========================================================================

  async init() {
    console.log('Inicializando Admin App...');

    // Verificar autenticação
    if (!this.checkAuth()) {
      window.location.href = 'http://localhost:3011/admin/login.html';
      return;
    }

    // Carregar usuário
    this.state.user = localStorage.getItem('adminUser');
    this.state.token = localStorage.getItem('adminToken');

    // Setup DOM
    this.setupDOM();

    // Carregar dados iniciais
    await this.loadInitialData();

    console.log('Admin App inicializado com sucesso');
  },

  checkAuth() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  },

  setupDOM() {
    // Header
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
      userDisplay.textContent = this.state.user;
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }

    // Tabs
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Forms
    document.getElementById('portfolioForm')?.addEventListener('submit', (e) =>
      this.handlePortfolioSubmit(e)
    );
    document.getElementById('blogForm')?.addEventListener('submit', (e) =>
      this.handleBlogSubmit(e)
    );

    // File inputs
    this.setupFileInputs();

    // Category buttons
    this.renderCategoryButtons();
  },

  // ========================================================================
  // AUTENTICAÇÃO
  // ========================================================================

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'http://localhost:3011/admin/login.html';
  },

  // ========================================================================
  // ABAS
  // ========================================================================

  switchTab(tabName) {
    this.state.currentTab = tabName;

    // Update buttons
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('[id^="tab-"]').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });

    // Load data for specific tabs
    if (tabName === 'manage-blog') {
      this.loadBlogList();
    } else if (tabName === 'manage-portfolio') {
      this.loadPortfolioList();
    }
  },

  // ========================================================================
  // CATEGORIAS
  // ========================================================================

  renderCategoryButtons() {
    // Portfolio
    const portfolioContainer = document.getElementById('portfolioCategories');
    if (portfolioContainer) {
      portfolioContainer.innerHTML = '';
      this.config.portfolioCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'category-option';
        btn.dataset.category = cat;
        btn.textContent = cat;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          document
            .querySelectorAll('#portfolioCategories .category-option')
            .forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.state.formData.portfolioCategory = cat;
        });
        portfolioContainer.appendChild(btn);
      });
    }

    // Blog
    const blogContainer = document.getElementById('blogCategories');
    if (blogContainer) {
      blogContainer.innerHTML = '';
      this.config.blogCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'category-option';
        btn.dataset.category = cat;
        btn.textContent = cat;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          document
            .querySelectorAll('#blogCategories .category-option')
            .forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.state.formData.blogCategory = cat;
        });
        blogContainer.appendChild(btn);
      });
    }
  },

  // ========================================================================
  // FILE INPUTS
  // ========================================================================

  setupFileInputs() {
    try {
      // Portfolio images
      const portfolioInput = document.getElementById('pImages');
      const portfolioList = document.getElementById('portfolioImageList');
      const portfolioCover = document.getElementById('pCover');

      if (portfolioInput && typeof DragDropZone !== 'undefined') {
        new DragDropZone('pImages', (files) => {
          this.updateImagePreview(files, portfolioList, portfolioCover);
        });

        portfolioInput.addEventListener('change', () => {
          this.updateImagePreview(
            portfolioInput.files,
            portfolioList,
            portfolioCover
          );
        });
      }

      // Blog image
      const blogInput = document.getElementById('bImage');
      if (blogInput && typeof DragDropZone !== 'undefined') {
        new DragDropZone('bImage', (files) => {
          if (files.length > 0) {
            Toast.show('Imagem selecionada: ' + files[0].name, 'success');
          }
        });
      }
    } catch (err) {
      console.error('Erro ao configurar file inputs:', err);
    }
  },

  updateImagePreview(files, listContainer, coverSelect) {
    listContainer.innerHTML = '';
    coverSelect.innerHTML = '';

    if (files.length === 0) return;

    let html = `<strong>${files.length} imagem(ns) selecionada(s):</strong><br>`;
    Array.from(files).forEach((file, idx) => {
      html += `${file.name}<br>`;
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = file.name;
      if (idx === 0) option.selected = true;
      coverSelect.appendChild(option);
    });

    listContainer.innerHTML = html;
  },

  // ========================================================================
  // VALIDAÇÃO
  // ========================================================================

  validatePortfolio(form) {
    const rules = {
      pTitle: [FormValidator.rules.required, FormValidator.rules.maxLength(100)],
      pYear: [FormValidator.rules.required],
      pClient: [FormValidator.rules.required, FormValidator.rules.maxLength(100)],
      pDeliverable: [
        FormValidator.rules.required,
        FormValidator.rules.maxLength(100)
      ],
      pDesc: [FormValidator.rules.required, FormValidator.rules.maxLength(300)],
      pImages: [FormValidator.rules.required]
    };

    if (!FormValidator.validate(form, rules)) {
      FormValidator.showErrors(form);
      return false;
    }

    if (!this.state.formData.portfolioCategory) {
      Toast.show('Selecione uma categoria', 'error');
      return false;
    }

    return true;
  },

  validateBlog(form) {
    const rules = {
      bTitle: [FormValidator.rules.required, FormValidator.rules.maxLength(200)],
      bExcerpt: [
        FormValidator.rules.required,
        FormValidator.rules.maxLength(300)
      ],
      bDate: [FormValidator.rules.required],
      bContent: [FormValidator.rules.required]
    };

    if (!FormValidator.validate(form, rules)) {
      FormValidator.showErrors(form);
      return false;
    }

    if (!this.state.formData.blogCategory) {
      Toast.show('Selecione uma categoria', 'error');
      return false;
    }

    return true;
  },

  // ========================================================================
  // PORTFOLIO - CRUD
  // ========================================================================

  async handlePortfolioSubmit(e) {
    e.preventDefault();

    const form = e.target;
    if (!this.validatePortfolio(form)) return;

    const submitBtn = document.getElementById('portfolioSubmit');
    const isEditing = this.state.formData.editingProjectKey;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="loading"></span> ${isEditing ? 'Atualizando...' : 'Adicionando...'}`;

    try {
      if (isEditing) {
        const payload = {
          key: isEditing,
          title: document.getElementById('pTitle').value.trim(),
          client: document.getElementById('pClient').value.trim(),
          category: this.state.formData.portfolioCategory,
          year: document.getElementById('pYear').value,
          deliverable: document.getElementById('pDeliverable').value.trim(),
          description: document.getElementById('pDescription').value.trim(),
          link: document.getElementById('pLink').value.trim(),
          images: document.getElementById('pImages').value.trim().split(',').map(s => s.trim()),
          token: this.state.token
        };

        const response = await fetch(`${this.config.apiBase}/update-project`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao atualizar projeto');

        Toast.show('Projeto atualizado com sucesso!', 'success');
      } else {
        const formData = new FormData(form);
        formData.append('category', this.state.formData.portfolioCategory);
        formData.append('token', this.state.token);

        const response = await fetch(`${this.config.apiBase}/add-project`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.state.token}`
          },
          body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao adicionar projeto');

        Toast.show('Projeto adicionado com sucesso!', 'success');
      }

      form.reset();
      this.state.formData.portfolioCategory = null;
      this.state.formData.editingProjectKey = null;
      document.querySelectorAll('#portfolioCategories .category-option').forEach(b => b.classList.remove('selected'));

      setTimeout(() => {
        this.loadPortfolioList();
        document.getElementById('closePortfolioForm').click();
      }, 500);
    } catch (error) {
      Toast.show(error.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = isEditing ? '💾 Atualizar Projeto' : '➕ Adicionar Projeto';
    }
  },

  async loadPortfolioList() {
    const container = document.getElementById('portfolioItemList');
    if (!container) return;

    container.innerHTML = '<span class="empty-msg">Carregando...</span>';

    try {
      const response = await fetch(`${this.config.apiBase}/list-projects?token=${this.state.token}`, {
        headers: {
          'Authorization': `Bearer ${this.state.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar projetos');
      }

      this.state.portfolio = data.projects || [];

      if (this.state.portfolio.length === 0) {
        container.innerHTML =
          '<span class="empty-msg">Nenhum projeto publicado</span>';
        return;
      }

      // Renderizar tabela
      const columns = [
        { key: 'title', label: 'Projeto' },
        { key: 'client', label: 'Cliente' },
        { key: 'year', label: 'Ano' },
        { key: 'category', label: 'Categoria' }
      ];

      const actions = [
        {
          name: 'edit',
          label: 'Editar',
          color: '#F5C518',
          callback: (project) => this.editPortfolio(project)
        },
        {
          name: 'hide',
          label: 'Ocultar',
          color: '#F3F3F3',
          callback: (project) => this.togglePortfolioVisibility(project)
        },
        {
          name: 'delete',
          label: 'Deletar',
          color: '#FEE2E2',
          callback: (project) => this.deletePortfolio(project)
        }
      ];

      const table = new Table('portfolioItemList', columns, this.state.portfolio, actions);
      table.render();
    } catch (error) {
      Toast.show(error.message, 'error');
      container.innerHTML = '<span class="empty-msg">Erro ao carregar</span>';
    }
  },

  editPortfolio(project) {
    this.state.formData.editingProjectKey = project.key;

    document.getElementById('pTitle').value = project.title;
    document.getElementById('pClient').value = project.client;
    document.getElementById('pYear').value = project.year;
    document.getElementById('pDeliverable').value = project.deliverable || '';
    document.getElementById('pDescription').value = project.description || project.desc || '';
    document.getElementById('pLink').value = project.link || '';
    document.getElementById('pImages').value = (project.images || []).join(', ');

    document.querySelectorAll('#portfolioCategories .category-option').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.textContent === project.category || btn.textContent === project.cat) {
        btn.classList.add('selected');
        btn.style.background = 'var(--color-yellow)';
        btn.style.color = 'var(--color-black)';
        btn.style.fontWeight = '600';
        this.state.formData.portfolioCategory = btn.textContent;
      }
    });

    const form = document.getElementById('portfolioForm');
    const submitBtn = document.getElementById('portfolioSubmit');
    submitBtn.innerHTML = '💾 Atualizar Projeto';

    document.getElementById('portfolioFormModal').style.display = 'flex';
  },

  async togglePortfolioVisibility(project) {
    const modal = new Modal(
      'Ocultar Projeto',
      `Tem certeza que deseja ${project.visible ? 'ocultar' : 'publicar'} este projeto?`,
      [
        {
          text: 'Cancelar',
          action: () => {}
        },
        {
          text: 'Confirmar',
          action: async () => {
            await this.updateProjectVisibility(project.key, !project.visible);
          }
        }
      ]
    );
    modal.show();
  },

  async updateProjectVisibility(projectKey, visible) {
    try {
      const response = await fetch(`${this.config.apiBase}/toggle-project`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`
        },
        body: JSON.stringify({ key: projectKey, visible })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar');
      }

      Toast.show('Projeto atualizado com sucesso!', 'success');
      this.loadPortfolioList();
    } catch (error) {
      Toast.show(error.message, 'error');
    }
  },

  async deletePortfolio(project) {
    const modal = new Modal(
      'Deletar Projeto',
      `Tem certeza que deseja deletar permanentemente o projeto "<strong>${project.title}</strong>"?`,
      [
        {
          text: 'Cancelar',
          action: () => {}
        },
        {
          text: 'Deletar',
          action: async () => {
            await this.performDeleteProject(project.key);
          }
        }
      ]
    );
    modal.show();
  },

  async performDeleteProject(projectKey) {
    try {
      const response = await fetch(`${this.config.apiBase}/delete-project`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`
        },
        body: JSON.stringify({ key: projectKey })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar');
      }

      Toast.show('Projeto deletado com sucesso!', 'success');
      this.loadPortfolioList();
    } catch (error) {
      Toast.show(error.message, 'error');
    }
  },

  // ========================================================================
  // BLOG - CRUD
  // ========================================================================

  async handleBlogSubmit(e) {
    e.preventDefault();

    const form = e.target;
    if (!this.validateBlog(form)) return;

    const submitBtn = document.getElementById('blogSubmit');
    const isEditing = this.state.formData.editingArticleSlug;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="loading"></span> ${isEditing ? 'Atualizando...' : 'Publicando...'}`;

    try {
      const payload = {
        title: document.getElementById('bTitle').value.trim(),
        excerpt: document.getElementById('bExcerpt').value.trim(),
        tag: this.state.formData.blogCategory,
        date: document.getElementById('bDate').value,
        readTime: document.getElementById('bReadTime').value.trim(),
        content: document.getElementById('bContent').value.trim(),
        image: document.getElementById('bImage').value.trim() || null,
        token: this.state.token
      };

      if (isEditing) {
        payload.slug = isEditing;
        const response = await fetch(`${this.config.apiBase}/update-article`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao atualizar artigo');

        Toast.show('Artigo atualizado com sucesso!', 'success');
      } else {
        const response = await fetch(`${this.config.apiBase}/add-article`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao publicar artigo');

        Toast.show('Artigo publicado com sucesso!', 'success');
      }

      form.reset();
      this.state.formData.blogCategory = null;
      this.state.formData.editingArticleSlug = null;
      document.querySelectorAll('#blogCategories .category-option').forEach(b => b.classList.remove('selected'));

      setTimeout(() => {
        this.loadBlogList();
        document.getElementById('closeBlogForm').click();
      }, 500);
    } catch (error) {
      Toast.show(error.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = isEditing ? '💾 Atualizar Artigo' : '📝 Publicar Artigo';
    }
  },

  async loadBlogList() {
    const container = document.getElementById('blogItemList');
    if (!container) return;

    container.innerHTML = '<span class="empty-msg">Carregando...</span>';

    try {
      const response = await fetch(`${this.config.apiBase}/list-articles?token=${this.state.token}`, {
        headers: {
          'Authorization': `Bearer ${this.state.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar artigos');
      }

      this.state.blog = data.articles || [];

      if (this.state.blog.length === 0) {
        container.innerHTML = '<span class="empty-msg">Nenhum artigo publicado</span>';
        return;
      }

      // Renderizar tabela
      const columns = [
        { key: 'title', label: 'Artigo' },
        { key: 'tag', label: 'Categoria' },
        { key: 'date', label: 'Data' },
        { key: 'readTime', label: 'Leitura' }
      ];

      const actions = [
        {
          name: 'edit',
          label: 'Editar',
          color: '#F5C518',
          callback: (article) => this.editBlog(article)
        },
        {
          name: 'hide',
          label: 'Ocultar',
          color: '#F3F3F3',
          callback: (article) => this.toggleBlogVisibility(article)
        },
        {
          name: 'delete',
          label: 'Deletar',
          color: '#FEE2E2',
          callback: (article) => this.deleteBlog(article)
        }
      ];

      const table = new Table('blogItemList', columns, this.state.blog, actions);
      table.render();
    } catch (error) {
      Toast.show(error.message, 'error');
      container.innerHTML = '<span class="empty-msg">Erro ao carregar</span>';
    }
  },

  editBlog(article) {
    this.state.formData.editingArticleSlug = article.slug;

    document.getElementById('bTitle').value = article.title;
    document.getElementById('bExcerpt').value = article.excerpt || '';
    document.getElementById('bDate').value = article.date;
    document.getElementById('bReadTime').value = article.readTime || '5 min';
    document.getElementById('bContent').value = article.content || '';

    document.querySelectorAll('#blogCategories .category-option').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.textContent === article.tag) {
        btn.classList.add('selected');
        btn.style.background = 'var(--color-yellow)';
        btn.style.color = 'var(--color-black)';
        btn.style.fontWeight = '600';
        this.state.formData.blogCategory = btn.textContent;
      }
    });

    const submitBtn = document.getElementById('blogSubmit');
    submitBtn.innerHTML = '💾 Atualizar Artigo';

    document.getElementById('blogFormModal').style.display = 'flex';
  },

  async toggleBlogVisibility(article) {
    const modal = new Modal(
      'Ocultar Artigo',
      `Tem certeza que deseja ${article.visible ? 'ocultar' : 'publicar'} este artigo?`,
      [
        {
          text: 'Cancelar',
          action: () => {}
        },
        {
          text: 'Confirmar',
          action: async () => {
            await this.updateArticleVisibility(article.slug, !article.visible);
          }
        }
      ]
    );
    modal.show();
  },

  async updateArticleVisibility(slug, visible) {
    try {
      const response = await fetch(`${this.config.apiBase}/toggle-article`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`
        },
        body: JSON.stringify({ slug, visible })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar');
      }

      Toast.show('Artigo atualizado com sucesso!', 'success');
      this.loadBlogList();
    } catch (error) {
      Toast.show(error.message, 'error');
    }
  },

  async deleteBlog(article) {
    const modal = new Modal(
      'Deletar Artigo',
      `Tem certeza que deseja deletar permanentemente o artigo "<strong>${article.title}</strong>"?`,
      [
        {
          text: 'Cancelar',
          action: () => {}
        },
        {
          text: 'Deletar',
          action: async () => {
            await this.performDeleteArticle(article.slug);
          }
        }
      ]
    );
    modal.show();
  },

  async performDeleteArticle(slug) {
    try {
      const response = await fetch(`${this.config.apiBase}/delete-article`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`
        },
        body: JSON.stringify({ slug })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar');
      }

      Toast.show('Artigo deletado com sucesso!', 'success');
      this.loadBlogList();
    } catch (error) {
      Toast.show(error.message, 'error');
    }
  },

  // ========================================================================
  // DADOS INICIAIS
  // ========================================================================

  async loadInitialData() {
    await this.loadBlogList();
    await this.loadPortfolioList();
  },

  // ========================================================================
  // MODAL HANDLING - Forms
  // ========================================================================

  setupModalHandling() {
    // Portfolio Form Modal
    const portfolioModal = document.getElementById('portfolioFormModal');
    const portfolioForm = document.getElementById('portfolioForm');
    const newProjectBtn = document.getElementById('newProjectBtn');
    const closePortfolioForm = document.getElementById('closePortfolioForm');
    const cancelPortfolioBtn = document.getElementById('cancelPortfolioBtn');

    if (newProjectBtn) {
      newProjectBtn.addEventListener('click', () => {
        window.location.href = '/admin/novo-projeto.html';
      });
    }

    if (closePortfolioForm) {
      closePortfolioForm.addEventListener('click', () => {
        this.closePortfolioFormModal();
      });
    }

    if (cancelPortfolioBtn) {
      cancelPortfolioBtn.addEventListener('click', () => {
        this.closePortfolioFormModal();
      });
    }

    if (portfolioModal) {
      portfolioModal.addEventListener('click', (e) => {
        if (e.target === portfolioModal) {
          this.closePortfolioFormModal();
        }
      });
    }

    // Blog Form Modal
    const blogModal = document.getElementById('blogFormModal');
    const blogForm = document.getElementById('blogForm');
    const newBlogBtn = document.getElementById('newBlogBtn');
    const closeBlogForm = document.getElementById('closeBlogForm');
    const cancelBlogBtn = document.getElementById('cancelBlogBtn');

    if (newBlogBtn) {
      newBlogBtn.addEventListener('click', () => {
        window.location.href = '/admin/novo-artigo.html';
      });
    }

    if (closeBlogForm) {
      closeBlogForm.addEventListener('click', () => {
        this.closeBlogFormModal();
      });
    }

    if (cancelBlogBtn) {
      cancelBlogBtn.addEventListener('click', () => {
        this.closeBlogFormModal();
      });
    }

    if (blogModal) {
      blogModal.addEventListener('click', (e) => {
        if (e.target === blogModal) {
          this.closeBlogFormModal();
        }
      });
    }
  },

  openPortfolioFormModal() {
    const modal = document.getElementById('portfolioFormModal');
    const form = document.getElementById('portfolioForm');

    if (modal) {
      modal.style.display = 'flex';
      form.reset();
      document.querySelectorAll('#portfolioCategories .category-option').forEach(b => b.classList.remove('selected'));
      document.getElementById('pYear').valueAsNumber = new Date().getFullYear();
      this.state.formData.editingProjectKey = null;
      this.state.formData.portfolioCategory = null;
      document.getElementById('portfolioSubmit').innerHTML = '➕ Adicionar Projeto';
    }
  },

  closePortfolioFormModal() {
    const modal = document.getElementById('portfolioFormModal');
    const form = document.getElementById('portfolioForm');

    if (modal) {
      modal.style.display = 'none';
      form.reset();
      document.querySelectorAll('#portfolioCategories .category-option').forEach(b => b.classList.remove('selected'));
      this.state.formData.editingProjectKey = null;
      this.state.formData.portfolioCategory = null;
    }
  },

  openBlogFormModal() {
    const modal = document.getElementById('blogFormModal');
    const form = document.getElementById('blogForm');

    if (modal) {
      modal.style.display = 'flex';
      form.reset();
      document.querySelectorAll('#blogCategories .category-option').forEach(b => b.classList.remove('selected'));
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('bDate').value = today;
      document.getElementById('bReadTime').value = '5 min';
      this.state.formData.editingArticleSlug = null;
      this.state.formData.blogCategory = null;
      document.getElementById('blogSubmit').innerHTML = '📝 Publicar Artigo';
    }
  },

  closeBlogFormModal() {
    const modal = document.getElementById('blogFormModal');
    const form = document.getElementById('blogForm');

    if (modal) {
      modal.style.display = 'none';
      form.reset();
      document.querySelectorAll('#blogCategories .category-option').forEach(b => b.classList.remove('selected'));
      this.state.formData.editingArticleSlug = null;
      this.state.formData.blogCategory = null;
    }
  }
};

// ============================================================================
// INICIALIZAR
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.setupModalHandling();
  AdminApp.init();
});
