/**
 * Script de Sincronização - Reuniões desta semana e próxima
 * Busca apenas eventos de hoje até 14 dias no Google Calendar
 * e sincroniza no Notion (Tarefas GERAL)
 */

require('dotenv').config();
const GoogleManager = require('./lib/google-manager');
const NotionManager = require('./lib/notion-manager');

async function getGoogleCalendarEvents() {
  try {
    const google = new GoogleManager();

    // Datas: hoje até 14 dias
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    console.log(`📅 Buscando eventos de ${now.toLocaleDateString('pt-BR')} a ${twoWeeksLater.toLocaleDateString('pt-BR')}\n`);

    // Buscar todos os eventos e filtrar por data
    const allEvents = await google.getAllEvents(365);

    const filteredEvents = allEvents.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date);
      return eventDate >= now && eventDate <= twoWeeksLater;
    });

    return filteredEvents;

  } catch (error) {
    console.error('❌ Erro ao buscar Google Calendar:', error.message);
    throw error;
  }
}

function extractEventData(event) {
  return {
    id: event.id,
    name: event.summary || '(sem título)',
    description: event.description || '',
    start: event.start,
    end: event.end,
  };
}

async function main() {
  try {
    console.log('🚀 Sincronizando Reuniões: Esta Semana + Próxima Semana\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Buscar eventos do Google Calendar
    console.log('📥 Buscando eventos do seu calendário principal...');
    const events = await getGoogleCalendarEvents();
    console.log(`📊 Total de eventos encontrados: ${events.length}\n`);

    if (events.length === 0) {
      console.log('✅ Nenhum evento para sincronizar neste período');
      return;
    }

    // Inicializar Notion
    const notion = new NotionManager(process.env.NOTION_TOKEN, process.env.NOTION_AGENDA_DB_ID);

    // Buscar páginas existentes
    const existingPages = await notion.getAllPages();
    const existingGoogleIds = new Set(
      existingPages
        .map(p => p.properties.googleEventId?.rich_text?.[0]?.text?.content)
        .filter(Boolean)
    );

    let created = 0;
    let skipped = 0;

    console.log('📤 Sincronizando para Notion...\n');

    // Sincronizar cada evento
    for (const event of events) {
      const data = extractEventData(event);

      // Verificar se já existe pelo Google Event ID
      if (existingGoogleIds.has(data.id)) {
        skipped++;
        process.stdout.write('.');
        continue;
      }

      try {
        // Extrair data e hora
        let dateValue = {};
        let timeStr = '';

        if (event.start.dateTime) {
          const startDate = new Date(event.start.dateTime);
          const dateStr = startDate.toISOString().split('T')[0];
          const timeFormatted = startDate.toISOString();

          timeStr = startDate.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
          });

          // Para campos com timezone, precisamos de data + hora
          dateValue = {
            start: timeFormatted
          };
        } else if (event.start.date) {
          const dateStr = event.start.date;
          timeStr = '(O dia inteiro)';

          // Para all-day events, sem timezone
          dateValue = {
            start: dateStr
          };
        }

        // Criar página no Notion com campos corretos
        const pageData = {
          'Status': {
            status: {
              name: 'A Fazer'
            }
          },
          'Tipo': {
            select: { name: 'Estratégico' }
          },
          'Bloco': {
            select: { name: 'Reuniões' }
          },
          'googleEventId': {
            rich_text: [{ text: { content: data.id } }]
          }
        };

        // Adicionar data apenas se tiver valor
        if (dateValue.start) {
          if (event.start.dateTime) {
            pageData['Data Execução'] = {
              date: dateValue
            };
          } else {
            pageData['Data Execução'] = {
              date: dateValue
            };
          }
        }

        await notion.createPage(data.name, pageData);

        console.log(`✅ "${data.name}"`);
        created++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 400));

      } catch (error) {
        console.error(`❌ Erro ao sincronizar "${data.name}":`, error.message);
      }
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SINCRONIZAÇÃO CONCLUÍDA!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Resumo:\n`);
    console.log(`  📅 Período: Esta semana + Próxima semana`);
    console.log(`  📊 Total encontrado: ${events.length}`);
    console.log(`  ✅ Criados: ${created}`);
    console.log(`  ⏭️  Já existiam: ${skipped}`);
    console.log(`  📍 Database: Tarefas GERAL`);
    console.log(`  🏷️  Tag: Reuniões\n`);

  } catch (error) {
    console.error('❌ Erro na sincronização:', error.message);
    process.exit(1);
  }
}

main();
