import { verifyToken } from './auth.js';

/**
 * Get Projects & Tasks for Customer
 * Retorna todos os projetos e tarefas relacionados ao cliente autenticado
 */

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verificar Token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const payload = verifyToken(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const clientId = payload.clientId;
        const notionToken = process.env.NOTION_TOKEN;
        const projetosDatabaseId = process.env.NOTION_PROJETOS_DATABASE_ID;
        const tarefasDatabaseId = process.env.NOTION_TAREFAS_DATABASE_ID;

        if (!notionToken || !projetosDatabaseId || !tarefasDatabaseId) {
            return res.status(500).json({
                error: 'Notion not configured',
                message: 'Database IDs not set'
            });
        }

        // 1. Buscar projetos do cliente
        const projetos = await getClientProjects(notionToken, projetosDatabaseId, clientId);
        const projectIds = projetos.map(p => p.id);

        // 2. Buscar tarefas (por cliente OU por projeto do cliente)
        const tarefas = await getClientTasks(notionToken, tarefasDatabaseId, clientId, projectIds);

        console.log(`\n📋 [GET-PROJECTS] Resultado Final:`);
        console.log(`  Cliente: ${payload.email}`);
        console.log(`  Cliente ID: ${clientId}`);
        console.log(`  Projetos encontrados: ${projetos.length}`);
        console.log(`  Tarefas encontradas: ${tarefas.length}`);
        console.log('');

        // 3. Buscar cronograma/timeline
        const timeline = await getTimeline(tarefas, projetos);

        // 4. Calcular KPIs
        const kpis = calculateKPIs(tarefas, projetos);

        return res.status(200).json({
            success: true,
            clientId,
            clientName: payload.email,
            projects: projetos,
            tasks: tarefas,
            timeline,
            stats: kpis
        });

    } catch (error) {
        console.error('Get Projects Error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
}

/**
 * Busca projetos relacionados ao cliente
 */
async function getClientProjects(notionToken, databaseId, clientId) {
    try {
        // Buscar todos os projetos que relacionam ao cliente
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Cliente',
                    relation: {
                        contains: clientId
                    }
                }
            })
        });

        if (!response.ok) {
            console.error('Notion query failed:', await response.json());
            return [];
        }

        const data = await response.json();

        return data.results.map(result => ({
            id: result.id,
            name: result.properties['Name']?.title?.[0]?.text?.content || 'Sem Nome',
            tag: result.properties['tag']?.select?.name || '',
            concluido: result.properties['Concluído']?.checkbox || false,
            created: result.created_time,
            updated: result.last_edited_time
        }));

    } catch (error) {
        console.error('getClientProjects Error:', error);
        return [];
    }
}

/**
 * Busca tarefas do cliente (por cliente OU por projeto)
 */
async function getClientTasks(notionToken, databaseId, clientId, projectIds) {
    try {
        console.log(`\n🔍 [getClientTasks] Buscando tarefas para cliente:`, clientId);
        console.log(`  Projetos do cliente:`, projectIds.length);

        // Filtro: Cliente = clientId OU (Projeto = um dos projectIds)
        const filters = [];

        // Filtro 1: tarefas com cliente direto
        filters.push({
            property: 'Cliente',
            relation: { contains: clientId }
        });

        // Filtro 2: tarefas com projeto do cliente
        if (projectIds.length > 0) {
            projectIds.forEach(projectId => {
                filters.push({
                    property: 'Projeto',
                    relation: { contains: projectId }
                });
            });
        }

        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    or: filters
                }
            })
        });

        console.log(`  Resposta API: ${response.status} ${response.ok ? '✓' : '✗'}`);

        if (!response.ok) {
            console.error('Notion query failed:', await response.json());
            return [];
        }

        const data = await response.json();

        // Map de status Notion para status do dashboard
        const statusMap = {
            'Entrada ✉': 'todo',
            'A Fazer': 'todo',
            '📝Fazendo': 'in_progress',
            '⏱️Aguardando': 'review',
            'Concluído': 'completed'
        };

        // Map de prioridades
        const prioridadeMap = {
            '1ª': 'alta',
            '2ª': 'media',
            '3ª': 'baixa',
            '4ª': 'baixa'
        };

        return data.results.map(result => ({
            id: result.id,
            title: result.properties['Name']?.title?.[0]?.text?.content || 'Sem Título',
            status: statusMap[result.properties['Status']?.status?.name] || 'todo',
            statusOriginal: result.properties['Status']?.status?.name || 'A Fazer',
            prioridade: prioridadeMap[result.properties['Prioridade']?.select?.name] || 'baixa',
            prioridadeOriginal: result.properties['Prioridade']?.select?.name || '3ª',
            projetoId: result.properties['Projeto']?.relation?.[0] || null,
            clienteId: result.properties['Cliente']?.relation?.[0] || null,
            dueDate: result.properties['Data Execução']?.date?.start || null,
            assignee: result.properties['Responsável']?.people?.[0]?.name || null,
            tipo: result.properties['Tipo']?.select?.name || '',
            bloco: result.properties['Bloco']?.select?.name || '',
            created: result.created_time,
            updated: result.last_edited_time
        }));

    } catch (error) {
        console.error('getClientTasks Error:', error);
        return [];
    }
}

/**
 * Gera timeline com marcos/etapas importantes
 */
async function getTimeline(tarefas, projetos) {
    const timeline = [];

    // Adicionar marcos dos projetos (todas as tarefas de um projeto)
    projetos.forEach(projeto => {
        timeline.push({
            date: new Date().toISOString().split('T')[0],
            title: `Projeto: ${projeto.name}`,
            description: projeto.tag ? `Categoria: ${projeto.tag}` : '',
            status: projeto.concluido ? 'completed' : 'active',
            icon: projeto.concluido ? '✅' : '🎯',
            type: 'project'
        });
    });

    // Adicionar próximas tarefas
    tarefas
        .filter(t => t.dueDate && t.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5) // Apenas os 5 próximos
        .forEach(tarefa => {
            timeline.push({
                date: tarefa.dueDate,
                title: tarefa.title,
                description: `Prioridade: ${tarefa.prioridadeOriginal} | Tipo: ${tarefa.tipo}`,
                status: tarefa.status === 'completed' ? 'completed' : 'active',
                icon: tarefa.status === 'completed' ? '✓' : '•',
                type: 'task'
            });
        });

    // Ordenar por data
    return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Calcula KPIs (estatísticas)
 */
function calculateKPIs(tarefas, projetos) {
    const totalTarefas = tarefas.length;
    const tarefasCompletadas = tarefas.filter(t => t.status === 'completed').length;
    const tarefasEmProgresso = tarefas.filter(t => t.status === 'in_progress').length;
    const tarefasEmRevisao = tarefas.filter(t => t.status === 'review').length;
    const tarefasATodo = tarefas.filter(t => t.status === 'todo').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tarefasAtrasadas = tarefas.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }).length;

    const proximaTarefa = tarefas
        .filter(t => t.dueDate && t.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

    const projetosAtivos = projetos.filter(p => !p.concluido).length;

    return {
        totalProjetos: projetos.length,
        projetosAtivos,
        projetosConcluidos: projetos.filter(p => p.concluido).length,
        totalTarefas,
        tarefasCompletadas,
        tarefasEmProgresso,
        tarefasEmRevisao,
        tarefasATodo,
        percentualConclusao: totalTarefas > 0 ? Math.round((tarefasCompletadas / totalTarefas) * 100) : 0,
        tarefasAtrasadas,
        proximaTarefa: proximaTarefa ? {
            title: proximaTarefa.title,
            date: proximaTarefa.dueDate,
            prioridade: proximaTarefa.prioridadeOriginal,
            tipo: proximaTarefa.tipo
        } : null
    };
}
