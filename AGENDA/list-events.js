/**
 * Script para listar eventos sincronizados no Notion
 */

require('dotenv').config();
const NotionManager = require('./lib/notion-manager');

(async () => {
  try {
    const notion = new NotionManager(process.env.NOTION_TOKEN, process.env.NOTION_AGENDA_DB_ID);
    const pages = await notion.getAllPages();

    console.log('\n📋 EVENTOS SINCRONIZADOS NO NOTION\n');
    console.log(`Total de páginas: ${pages.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Mostrar os primeiros 15
    pages.slice(0, 15).forEach((page, idx) => {
      const data = notion.extractPageData(page);
      console.log(`${idx + 1}. ${data.name}`);
      if (data.description) {
        const desc = data.description.substring(0, 80);
        console.log(`   📝 ${desc}`);
      }
      console.log('');
    });

    if (pages.length > 15) {
      console.log(`... e mais ${pages.length - 15} eventos`);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
})();
