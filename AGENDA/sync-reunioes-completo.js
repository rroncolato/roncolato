/**
 * Script de Sincronização Completa
 * Sincroniza todos os eventos do Google Calendar para Notion
 * Database: Tarefas GERAL
 * Tag: Reuniões
 */

require('dotenv').config();
const NotionManager = require('./lib/notion-manager');
const GoogleManager = require('./lib/google-manager');

async function main() {
  try {
    console.log('\n🚀 Iniciando sincronização de Reuniões...\n');

    const notion = new NotionManager(process.env.NOTION_TOKEN, process.env.NOTION_AGENDA_DB_ID);
    const google = new GoogleManager();

    // Buscar todos os eventos do Google Calendar
    console.log('📥 Buscando eventos do Google Calendar...');
    const events = await google.getAllEvents(9999); // Sem limite de dias
    console.log(`📊 Total de eventos encontrados: ${events.length}\n`);

    if (events.length === 0) {
      console.log('✅ Nenhum evento novo para sincronizar');
      return;
    }

    // Buscar páginas existentes no Notion
    const existingPages = await notion.getAllPages();
    const existingNames = new Set(existingPages.map(p => {
      const data = notion.extractPageData(p);
      return data.name;
    }));

    let created = 0;
    let skipped = 0;

    // Sincronizar cada evento
    for (const event of events) {
      const data = google.extractEventData(event);

      // Verificar se já existe
      if (existingNames.has(data.name)) {
        skipped++;
        process.stdout.write('.');
        continue;
      }

      try {
        // Extrair data e hora do evento
        let dateStr = '';
        let timeStr = '';

        if (event.start.dateTime) {
          const startDate = new Date(event.start.dateTime);
          dateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
          timeStr = startDate.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
          });
        } else if (event.start.date) {
          dateStr = event.start.date; // YYYY-MM-DD
          timeStr = '(O dia inteiro)';
        }

        // Criar página no Notion com todos os campos
        const page = await notion.createPage(data.name, {
          // Status: IDjR (A Fazer)
          'Status': {
            status: {
              name: 'A Fazer',
              color: 'red'
            }
          },
          // Tipo: 28ef5033 (Estratégico)
          'Tipo': {
            multi_select: [
              {
                name: 'Estratégico'
              }
            ]
          },
          // Bloco: 5a3715f6 (Reuniões)
          'Bloco': {
            multi_select: [
              {
                name: 'Reuniões'
              }
            ]
          },
          // Data
          'Data': {
            date: {
              start: dateStr,
              time_zone: 'America/Sao_Paulo'
            }
          },
          // Descrição
          'Descrição': {
            rich_text: [
              {
                text: {
                  content: `${data.name}\n📅 ${dateStr}\n🕐 ${timeStr}\n🔗 Google Calendar ID: ${data.id}`
                }
              }
            ]
          },
          // Google Calendar ID
          'Google Calendar ID': {
            rich_text: [
              {
                text: {
                  content: data.id
                }
              }
            ]
          }
        });

        console.log(`✅ "${data.name}"`);
        created++;

        // Rate limiting - Notion recomenda ~3 requisições/segundo
        await new Promise(resolve => setTimeout(resolve, 400));

      } catch (error) {
        console.error(`❌ Erro ao sincronizar "${data.name}":`, error.message);
      }
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SINCRONIZAÇÃO CONCLUÍDA!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Resumo:`);
    console.log(`  ✅ Criados: ${created}`);
    console.log(`  ⏭️  Já existiam: ${skipped}`);
    console.log(`  📍 Tag: Reuniões`);
    console.log(`  📊 Database: Tarefas GERAL\n`);

  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
    process.exit(1);
  }
}

main();
