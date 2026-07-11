/**
 * Gerenciador de Sincronização
 * Orquestra a sincronização bidirecional entre Google Calendar e Notion
 *
 * Baseado em: nathan-dykstra/gcal-notion-integration
 */

const fs = require('fs');
const path = require('path');

const STATE_FILE = '/tmp/sync-state.json';

class SyncManager {
  constructor(notionManager, googleManager) {
    this.notion = notionManager;
    this.google = googleManager;
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (fs.existsSync(STATE_FILE)) {
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      }
    } catch (error) {
      console.log('⚠️  Não foi possível carregar estado anterior');
    }
    return { events: {}, lastSync: null };
  }

  saveState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2));
  }

  log(level, message, data = '') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message} ${data ? data : ''}`);
  }

  // Sincronizar deletions
  async syncDeletions() {
    this.log('INFO', '🗑️  Sincronizando deletions...');

    try {
      const notionPages = await this.notion.getAllPages();

      // Verificar páginas marcadas como "Done" e deletar do Google Calendar
      for (const page of notionPages) {
        const data = this.notion.extractPageData(page);
        if (data.status === 'Done' && data.googleCalendarId) {
          await this.google.deleteEvent(data.googleCalendarId);
          await this.notion.deletePage(page.id);
          this.log('INFO', `✅ Deletado: "${data.name}"`);
        }
      }
    } catch (error) {
      this.log('ERROR', 'Erro ao sincronizar deletions:', error.message);
    }
  }

  // Sincronizar Notion → Google Calendar
  async syncNotionToGoogleCalendar() {
    this.log('INFO', '📤 Sincronizando Notion → Google Calendar...');

    let created = 0, updated = 0, errors = 0;

    try {
      const pages = await this.notion.getAllPages();

      for (const page of pages) {
        try {
          const data = this.notion.extractPageData(page);

          // Pular páginas marcadas como "Done"
          if (data.status === 'Done') continue;

          // Se já tem Google Calendar ID, atualizar
          if (data.googleCalendarId) {
            try {
              await this.google.updateEvent(data.googleCalendarId, {
                name: data.name,
                description: `${data.name}\n📌 Notion: ${data.notionUrl}`,
              });
              updated++;
            } catch (error) {
              this.log('WARN', `Não foi possível atualizar evento: ${error.message}`);
            }
          } else {
            // Criar novo evento no Google Calendar
            const event = await this.google.createEvent({
              name: data.name,
              description: `${data.name}\n📌 Notion: ${data.notionUrl}`,
              notionUrl: data.notionUrl,
            });

            // Adicionar Google Calendar ID à página do Notion
            await this.notion.updatePage(page.id, {
              'Google Calendar ID': {
                rich_text: [{ text: { content: event.id } }],
              },
            });

            this.log('INFO', `✅ [NOVO] "${data.name}" criado no Google Calendar`);
            created++;
          }
        } catch (error) {
          this.log('ERROR', `Erro ao sincronizar página ${page.id}:`, error.message);
          errors++;
        }
      }

      this.log('INFO', `📊 Notion → Calendar: ${created} criados, ${updated} atualizados`);
      return { created, updated, errors };

    } catch (error) {
      this.log('ERROR', 'Erro geral na sincronização Notion → Calendar:', error.message);
      return { created, updated, errors };
    }
  }

  // Sincronizar Google Calendar → Notion
  async syncGoogleCalendarToNotion() {
    this.log('INFO', '📥 Sincronizando Google Calendar → Notion...');

    let created = 0, updated = 0, errors = 0;

    try {
      const events = await this.google.getAllEvents(60);
      const notionPages = await this.notion.getAllPages();
      const notionEventNames = new Set(notionPages.map(p => this.notion.extractPageData(p).name));

      for (const event of events) {
        try {
          const data = this.google.extractEventData(event);

          // Se já existe no Notion, pular
          if (notionEventNames.has(data.name)) {
            updated++;
            continue;
          }

          // Criar página no Notion
          const page = await this.notion.createPage(data.name, {
            'Google Calendar ID': {
              rich_text: [{ text: { content: data.id } }],
            },
          });

          this.log('INFO', `✅ [NOVO] "${data.name}" criado no Notion`);
          created++;

        } catch (error) {
          this.log('ERROR', `Erro ao sincronizar evento ${event.id}:`, error.message);
          errors++;
        }
      }

      this.log('INFO', `📊 Calendar → Notion: ${created} criados, ${updated} já existiam`);
      return { created, updated, errors };

    } catch (error) {
      this.log('ERROR', 'Erro geral na sincronização Calendar → Notion:', error.message);
      return { created, updated, errors };
    }
  }

  // Sincronizar mudanças do Notion
  async syncNotionChanges() {
    this.log('INFO', '🔄 Sincronizando mudanças do Notion...');
    // Implementar detecção de mudanças comparando timestamps
  }

  // Sincronizar mudanças do Google Calendar
  async syncGoogleCalendarChanges() {
    this.log('INFO', '🔄 Sincronizando mudanças do Google Calendar...');
    // Implementar detecção de mudanças comparando timestamps
  }
}

module.exports = SyncManager;
