/**
 * Data Loader - Loads JSON data and syncs with admin system
 * Handles articles and projects rendering from JSON files
 */

class DataManager {
  constructor() {
    this.projects = [];
    this.articles = [];
    this.projectsUrl = '/data/projects.json';
    this.articlesUrl = '/data/articles.json';
    this.cacheKey = 'roncolato_data_cache';
    this.cacheTTL = 60 * 60 * 1000; // 1 hour cache
  }

  /**
   * Initialize data manager - load all data
   */
  async init() {
    try {
      await this.loadProjects();
      await this.loadArticles();
      return true;
    } catch (error) {
      console.error('Failed to initialize data manager:', error);
      return false;
    }
  }

  /**
   * Load projects from JSON with cache
   */
  async loadProjects() {
    try {
      const cached = this.getCache('projects');
      if (cached) {
        this.projects = cached;
        return;
      }

      const response = await fetch(this.projectsUrl);
      if (!response.ok) throw new Error('Failed to load projects');

      const data = await response.json();
      this.projects = data.projects || [];
      this.setCache('projects', this.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
    }
  }

  /**
   * Load articles from JSON with cache
   */
  async loadArticles() {
    try {
      const cached = this.getCache('articles');
      if (cached) {
        this.articles = cached;
        return;
      }

      const response = await fetch(this.articlesUrl);
      if (!response.ok) throw new Error('Failed to load articles');

      const data = await response.json();
      this.articles = data.articles || [];
      this.setCache('articles', this.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
      this.articles = [];
    }
  }

  /**
   * Get project by ID
   */
  getProject(id) {
    return this.projects.find(p => p.id === id);
  }

  /**
   * Get article by ID
   */
  getArticle(id) {
    return this.articles.find(a => a.id === id);
  }

  /**
   * Get all projects by category
   */
  getProjectsByCategory(category) {
    if (category === 'all') return this.projects;
    return this.projects.filter(p => p.category === category);
  }

  /**
   * Get articles by tag
   */
  getArticlesByTag(tag) {
    if (!tag) return this.articles;
    return this.articles.filter(a => a.tag === tag);
  }

  /**
   * Get featured articles
   */
  getFeaturedArticles() {
    return this.articles.filter(a => a.featured);
  }

  /**
   * Get recent articles (sorted by date)
   */
  getRecentArticles(limit = 3) {
    return this.articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  /**
   * Get articles grouped by tag
   */
  getArticlesByTagCount() {
    const tags = {};
    this.articles.forEach(article => {
      tags[article.tag] = (tags[article.tag] || 0) + 1;
    });
    return tags;
  }

  /**
   * Cache management
   */
  setCache(key, value) {
    const cacheData = {
      data: value,
      timestamp: Date.now()
    };
    localStorage.setItem(`${this.cacheKey}_${key}`, JSON.stringify(cacheData));
  }

  getCache(key) {
    const cached = localStorage.getItem(`${this.cacheKey}_${key}`);
    if (!cached) return null;

    try {
      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > this.cacheTTL;

      if (isExpired) {
        localStorage.removeItem(`${this.cacheKey}_${key}`);
        return null;
      }

      return cacheData.data;
    } catch {
      return null;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    localStorage.removeItem(`${this.cacheKey}_projects`);
    localStorage.removeItem(`${this.cacheKey}_articles`);
  }

  /**
   * Watch for changes - poll for updates
   * Useful for admin changes to be reflected on public site
   */
  watchForChanges(onUpdate, interval = 30000) {
    setInterval(async () => {
      this.clearCache();
      const projectsResp = await fetch(this.projectsUrl);
      const articlesResp = await fetch(this.articlesUrl);

      if (projectsResp.ok && articlesResp.ok) {
        const projectsData = await projectsResp.json();
        const articlesData = await articlesResp.json();

        const projectsChanged = JSON.stringify(projectsData.projects) !== JSON.stringify(this.projects);
        const articlesChanged = JSON.stringify(articlesData.articles) !== JSON.stringify(this.articles);

        if (projectsChanged || articlesChanged) {
          await this.init();
          onUpdate({ projects: projectsChanged, articles: articlesChanged });
        }
      }
    }, interval);
  }
}

// Initialize global data manager
const dataManager = new DataManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    dataManager.init();
  });
} else {
  dataManager.init();
}
