/**
 * Gerenciador de Notion API
 * Funções para criar, atualizar, deletar páginas
 */

class NotionManager {
  constructor() {
    this.token = process.env.NOTION_TOKEN;
    this.dbId = process.env.NOTION_AGENDA_DB_ID;
    this.baseUrl = 'https://api.notion.com/v1';
  }

  async fetchNotion(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Notion API Error: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }

  // Buscar todas as páginas do banco
  async getAllPages(pageSize = 100) {
    const allPages = [];
    let cursor = undefined;

    while (true) {
      const response = await this.fetchNotion(`/databases/${this.dbId}/query`, {
        method: 'POST',
        body: JSON.stringify({
          page_size: pageSize,
          start_cursor: cursor,
        }),
      });

      allPages.push(...response.results);

      if (!response.has_more) break;
      cursor = response.next_cursor;
    }

    return allPages;
  }

  // Criar página no Notion
  async createPage(name, properties = {}) {
    const defaultProperties = {
      'Name': { title: [{ text: { content: name } }] },
      'Status': { status: { id: 'IDjR' } },  // "A Fazer"
      'Tipo': { select: { id: '28ef5033-c267-4cc4-a831-e00ab13d03fc' } },  // "Estratégico"
      'Bloco': { select: { id: '5a3715f6-0fab-4bf4-adf3-c1a8e2fa00fc' } },  // "Reuniões"
    };

    const response = await this.fetchNotion('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: this.dbId },
        properties: { ...defaultProperties, ...properties },
      }),
    });

    return response;
  }

  // Atualizar página
  async updatePage(pageId, properties) {
    const response = await this.fetchNotion(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });

    return response;
  }

  // Deletar página (arquivo)
  async deletePage(pageId) {
    const response = await this.fetchNotion(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: true }),
    });

    return response;
  }

  // Buscar página pelo nome
  async findPageByName(name) {
    const pages = await this.getAllPages();
    return pages.find(p =>
      p.properties.Name?.title?.[0]?.text?.content === name
    );
  }

  // Extrair dados da página
  extractPageData(page) {
    return {
      id: page.id,
      name: page.properties.Name?.title?.[0]?.text?.content || 'Sem nome',
      status: page.properties.Status?.status?.name,
      tipo: page.properties.Tipo?.select?.name,
      bloco: page.properties.Bloco?.select?.name,
      googleCalendarId: page.properties['Google Calendar ID']?.rich_text?.[0]?.text?.content,
      notionUrl: page.url,
      lastEditedTime: new Date(page.last_edited_time),
    };
  }
}

module.exports = NotionManager;
