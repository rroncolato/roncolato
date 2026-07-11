/**
 * Mostra os campos reais do banco
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const NotionManager = require('./lib/notion-manager');

(async () => {
  try {
    const notion = new NotionManager(process.env.NOTION_TOKEN, process.env.NOTION_AGENDA_DB_ID);

    // Buscar páginas do banco para ver um exemplo de estrutura
    const pages = await notion.getAllPages();

    if (pages.length > 0) {
      const page = pages[0];
      console.log('\n📋 CAMPOS DO BANCO TAREFAS GERAL\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      if (page.properties) {
        Object.entries(page.properties).forEach(([key, prop]) => {
          console.log(`✅ ${key}`);
          console.log(`   Tipo: ${prop.type}`);
          console.log('');
        });
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
})();
