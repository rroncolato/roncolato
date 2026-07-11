const fs = require('fs');
const path = require('path');

// Carregar .env
const envContent = fs.readFileSync(path.join(__dirname, '../../.env'), 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !process.env[key.trim()]) {
    process.env[key.trim()] = value.trim();
  }
});

async function test() {
  console.log('🔍 Testando conexão com Notion...\n');
  
  console.log('Token:', process.env.NOTION_TOKEN ? '✅ Configurado' : '❌ Não configurado');
  console.log('DB ID:', process.env.NOTION_TAREFAS_DATABASE_ID);
  
  // Testar conexão
  try {
    const response = await fetch('https://api.notion.com/v1/databases/' + process.env.NOTION_TAREFAS_DATABASE_ID, {
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('\n❌ Erro ao acessar banco de dados:');
      console.log(JSON.stringify(data, null, 2));
      return;
    }
    
    console.log('\n✅ Conexão OK!');
    console.log('Nome do banco:', data.title?.[0]?.plain_text);
    
    // Listar campos
    console.log('\n📋 Campos disponíveis:');
    Object.entries(data.properties).forEach(([name, prop]) => {
      console.log(`  - ${name}: ${prop.type}`);
      if (prop.type === 'status' || prop.type === 'select') {
        console.log(`    Opções:`, prop[prop.type].options.map(o => `${o.name} (${o.id})`).join(', '));
      }
    });
    
  } catch (error) {
    console.log('\n❌ Erro:', error.message);
  }
}

test();
