/**
 * Verifica a estrutura do banco de dados Tarefas GERAL
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

(async () => {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // Buscar database
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_AGENDA_DB_ID
    });

    console.log('\n📋 ESTRUTURA DO BANCO: Tarefas GERAL\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (database.properties) {
      Object.entries(database.properties).forEach(([key, prop]) => {
        console.log(`✅ ${key}`);
        console.log(`   Tipo: ${prop.type}`);
        if (prop[prop.type]) {
          console.log(`   Config:`, JSON.stringify(prop[prop.type]).substring(0, 100));
        }
        console.log('');
      });
    } else {
      console.log('Database:', JSON.stringify(database, null, 2));
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
})();
