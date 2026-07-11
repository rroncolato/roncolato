// Função auxiliar para fazer query no Notion usando a REST API
async function queryNotionDatabase(database_id) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error('NOTION_TOKEN não configurado');
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${database_id.replace(/-/g, '')}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

// Função auxiliar para criar página no Notion
async function createNotionPage(parent_database_id, properties) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error('NOTION_TOKEN não configurado');
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parent: { database_id: parent_database_id.replace(/-/g, '') },
      properties
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

// GET /api/admin/notion-dashboard/projetos
// Retorna todos os projetos do Notion com status e progresso
async function getProjetos(req, res) {
  try {
    const database_id = process.env.NOTION_PROJETOS_DATABASE_ID;

    if (!database_id) {
      return res.status(400).json({ error: 'NOTION_PROJETOS_DATABASE_ID não configurado' });
    }

    const response = await queryNotionDatabase(database_id);

    const projetos = response.results.map(page => ({
      id: page.id,
      title: page.properties?.Name?.title?.[0]?.plain_text || 'Sem título',
      status: page.properties?.Status?.status?.name || 'not_started',
      progress: page.properties?.Progress?.number || 0,
      dueDate: page.properties?.['Due date']?.date?.start || null,
      assignee: page.properties?.Assignee?.people?.[0]?.name || 'Sem responsável',
      category: page.properties?.Category?.select?.name || 'Geral',
      description: page.properties?.Description?.rich_text?.[0]?.plain_text || '',
      createdAt: page.created_time,
      updatedAt: page.last_edited_time
    }));

    res.json({
      success: true,
      count: projetos.length,
      data: projetos
    });

  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({
      error: 'Erro ao buscar projetos do Notion',
      details: error.message
    });
  }
}

// GET /api/admin/notion-dashboard/tarefas
// Retorna todas as tarefas do Notion
async function getTarefas(req, res) {
  try {
    const database_id = process.env.NOTION_TAREFAS_DATABASE_ID;

    if (!database_id) {
      return res.status(400).json({ error: 'NOTION_TAREFAS_DATABASE_ID não configurado' });
    }

    const response = await queryNotionDatabase(database_id);

    const tarefas = response.results.map(page => ({
      id: page.id,
      title: page.properties?.Name?.title?.[0]?.plain_text || 'Sem título',
      status: page.properties?.Status?.status?.name || 'not_started',
      priority: page.properties?.Priority?.select?.name || 'Normal',
      dueDate: page.properties?.['Due date']?.date?.start || null,
      assignee: page.properties?.Assignee?.people?.[0]?.name || 'Sem responsável',
      projeto: page.properties?.Projeto?.relation?.map(r => r.id) || [],
      completed: page.properties?.Completed?.checkbox || false,
      createdAt: page.created_time,
      updatedAt: page.last_edited_time
    }));

    res.json({
      success: true,
      count: tarefas.length,
      data: tarefas
    });

  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({
      error: 'Erro ao buscar tarefas do Notion',
      details: error.message
    });
  }
}

// GET /api/admin/notion-dashboard/clientes
// Retorna todos os clientes do Notion
async function getClientes(req, res) {
  try {
    const database_id = process.env.NOTION_CLIENTES_DATABASE_ID;

    if (!database_id) {
      return res.status(400).json({ error: 'NOTION_CLIENTES_DATABASE_ID não configurado' });
    }

    const response = await queryNotionDatabase(database_id);

    const clientes = response.results.map(page => ({
      id: page.id,
      name: page.properties?.Name?.title?.[0]?.plain_text || 'Sem nome',
      email: page.properties?.Email?.email || null,
      phone: page.properties?.Phone?.phone_number || null,
      status: page.properties?.Status?.status?.name || 'active',
      projects: page.properties?.Projects?.relation?.length || 0,
      createdAt: page.created_time,
      updatedAt: page.last_edited_time
    }));

    res.json({
      success: true,
      count: clientes.length,
      data: clientes
    });

  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({
      error: 'Erro ao buscar clientes do Notion',
      details: error.message
    });
  }
}

// GET /api/admin/notion-dashboard/stats
// Retorna estatísticas gerais
async function getStats(req, res) {
  try {
    const [projetos, tarefas, clientes] = await Promise.all([
      queryNotionDatabase(process.env.NOTION_PROJETOS_DATABASE_ID),
      queryNotionDatabase(process.env.NOTION_TAREFAS_DATABASE_ID),
      queryNotionDatabase(process.env.NOTION_CLIENTES_DATABASE_ID)
    ]);

    const projetosAtivos = projetos.results.filter(
      p => p.properties?.Status?.status?.name === 'in_progress'
    ).length;

    const projetosCompletos = projetos.results.filter(
      p => p.properties?.Status?.status?.name === 'done'
    ).length;

    const tarefasPendentes = tarefas.results.filter(
      t => !t.properties?.Completed?.checkbox
    ).length;

    const clientesAtivos = clientes.results.filter(
      c => c.properties?.Status?.status?.name === 'active'
    ).length;

    res.json({
      success: true,
      stats: {
        projetos: {
          total: projetos.results.length,
          ativos: projetosAtivos,
          completos: projetosCompletos,
          taxaConclusao: projetos.results.length > 0 ? Math.round((projetosCompletos / projetos.results.length) * 100) : 0
        },
        tarefas: {
          total: tarefas.results.length,
          pendentes: tarefasPendentes,
          concluidas: tarefas.results.length - tarefasPendentes
        },
        clientes: {
          total: clientes.results.length,
          ativos: clientesAtivos
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({
      error: 'Erro ao buscar estatísticas',
      details: error.message
    });
  }
}

// POST /api/admin/notion-dashboard/criar-projeto
// Cria novo projeto no Notion
async function criarProjeto(req, res) {
  try {
    const { title, description, dueDate, assignee, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const properties = {
      Name: {
        title: [{ text: { content: title } }]
      },
      Status: {
        status: { name: 'not_started' }
      },
      Progress: {
        number: 0
      }
    };

    if (description) {
      properties.Description = {
        rich_text: [{ text: { content: description } }]
      };
    }

    if (dueDate) {
      properties['Due date'] = {
        date: { start: dueDate }
      };
    }

    if (category) {
      properties.Category = {
        select: { name: category }
      };
    }

    const response = await createNotionPage(process.env.NOTION_PROJETOS_DATABASE_ID, properties);

    res.json({
      success: true,
      message: 'Projeto criado com sucesso',
      id: response.id
    });

  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({
      error: 'Erro ao criar projeto',
      details: error.message
    });
  }
}

module.exports = {
  getProjetos,
  getTarefas,
  getClientes,
  getStats,
  criarProjeto
};
