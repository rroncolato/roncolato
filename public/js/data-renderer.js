/**
 * Data Renderer - Dynamically renders content from JSON data
 * Replaces hardcoded HTML with data-driven rendering
 */

class DataRenderer {
  constructor(dataManager) {
    this.dm = dataManager;
  }

  /**
   * Render portfolio/projects grid
   */
  async renderPortfolioGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await this.dm.loadProjects();
    const projects = this.dm.projects;

    let html = '';
    projects.forEach(project => {
      html += `
        <div class="pitem" data-cat="${project.category}" onclick="openModal('${project.id}')">
          <div class="pph" style="padding:0;overflow:hidden;">
            <img src="${project.thumbnail}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;display:block;">
          </div>
          <div class="pov">
            <div>
              <div class="ptitle">${project.title}</div>
              <div class="pcat">${project.tag}</div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render blog post list
   */
  async renderBlogList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await this.dm.loadArticles();
    const articles = this.dm.articles
      .filter(a => !a.featured)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let html = '';
    articles.forEach((article, index) => {
      const delayClass = index <= 2 ? '' : `d${index - 2}`;
      html += `
        <div class="bpost rv ${delayClass}" onclick="goPost('${article.id}')">
          <div class="bpost-img">
            <img src="${article.image}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">
          </div>
          <div>
            <div class="bpost-tag">${article.tag}</div>
            <div class="bpost-title">${article.title}</div>
            <div class="bpost-meta">${article.date} · ${article.readTime}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render featured blog post
   */
  async renderFeaturedArticle(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await this.dm.loadArticles();
    const featured = this.dm.articles.find(a => a.featured) || this.dm.articles[0];

    if (featured) {
      const readTimeParts = featured.readTime.split(' ');
      const minutes = readTimeParts[0];

      const html = `
        <div class="blog-featured rv" onclick="goPost('${featured.id}')">
          <div class="bf-img" style="background:none;">
            <img src="${featured.image}" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">
            <div class="bf-tag">Destaque</div>
          </div>
          <div class="bf-body">
            <div class="bf-meta">${featured.date} · ${minutes} min de leitura</div>
            <div class="bf-title">${featured.title}</div>
            <div class="bf-exc">${featured.excerpt}</div>
            <span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }
  }

  /**
   * Render blog sidebar categories
   */
  async renderBlogCategories(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await this.dm.loadArticles();
    const tagCounts = this.dm.getArticlesByTagCount();

    let html = '';
    Object.entries(tagCounts).forEach(([tag, count]) => {
      html += `
        <div class="btopic">
          <span class="btopic-name">${tag}</span>
          <span class="btopic-count">${count}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render recent articles in sidebar
   */
  async renderRecentArticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await this.dm.loadArticles();
    const recent = this.dm.getRecentArticles(4);

    let html = '';
    recent.forEach(article => {
      html += `
        <div class="brecent-item" onclick="goPost('${article.id}')">
          <div class="brecent-img">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/>
            </svg>
          </div>
          <div>
            <div class="brecent-title">${article.title}</div>
            <div class="brecent-date">${article.date}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render individual blog post page
   */
  async renderBlogPost(postId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await this.dm.loadArticles();
    const article = this.dm.getArticle(postId);

    if (!article) {
      container.innerHTML = '<p>Artigo não encontrado.</p>';
      return;
    }

    const html = `
      <article class="bpost-container">
        <div class="bpost-hdr">
          <div class="bpost-hdr-meta">
            <span class="bpost-hdr-tag">${article.tag}</span>
            <span class="bpost-hdr-date">${article.date}</span>
            <span class="bpost-hdr-time">${article.readTime}</span>
          </div>
          <h1 class="bpost-hdr-title">${article.title}</h1>
          <p class="bpost-hdr-exc">${article.excerpt}</p>
        </div>
        <div class="bpost-img">
          <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="bpost-body">
          ${article.body}
        </div>
      </article>
    `;

    container.innerHTML = html;
  }

  /**
   * Update modal data for projects (for compatibility)
   */
  populateProjectModal(projectId) {
    const project = this.dm.getProject(projectId);
    if (!project) return;

    // Update modal fields
    document.getElementById('modal-tag').textContent = project.tag;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-year').textContent = project.year;
    document.getElementById('modal-client').textContent = project.client;
    document.getElementById('modal-cat').textContent = project.tag;
    document.getElementById('modal-year2').textContent = project.year;
    document.getElementById('modal-deliverable').textContent = project.deliverable;
    document.getElementById('modal-desc').innerHTML = project.description;

    // Render main image
    const modalImg = document.getElementById('modal-img');
    if (project.images && project.images.length > 0) {
      modalImg.innerHTML = '';
      const img = document.createElement('img');
      img.src = project.images[0];
      img.alt = project.title;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      modalImg.appendChild(img);
      modalImg.style.background = 'none';
    }

    // Render extra images
    const modalExtra = document.getElementById('modal-extra-imgs');
    if (project.images && project.images.length > 1) {
      modalExtra.innerHTML = '';
      project.images.slice(1).forEach(url => {
        const div = document.createElement('div');
        div.className = 'modal-extra-img';
        const img = document.createElement('img');
        img.src = url;
        img.alt = project.title;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        div.appendChild(img);
        modalExtra.appendChild(div);
      });
    }
  }
}

// Initialize renderer when data manager is ready
const renderer = new DataRenderer(dataManager);

// Wait for DOM and data manager
const initRenderer = async () => {
  await dataManager.init();

  // Auto-render known containers if they exist
  if (document.getElementById('portfolio-grid')) {
    await renderer.renderPortfolioGrid('portfolio-grid');
  }
  if (document.getElementById('blog-list')) {
    await renderer.renderBlogList('blog-list');
  }
  if (document.getElementById('blog-featured')) {
    await renderer.renderFeaturedArticle('blog-featured');
  }
  if (document.getElementById('blog-categories')) {
    await renderer.renderBlogCategories('blog-categories');
  }
  if (document.getElementById('blog-recent')) {
    await renderer.renderRecentArticles('blog-recent');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRenderer);
} else {
  initRenderer();
}
