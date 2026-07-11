import { verifyToken } from './auth.js';

/**
 * Debug endpoint para verificar dados de um cliente específico
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const notionToken = process.env.NOTION_TOKEN;
        const clientesDatabaseId = process.env.NOTION_CLIENTES_DATABASE_ID;
        const projetosDatabaseId = process.env.NOTION_PROJETOS_DATABASE_ID;
        const tarefasDatabaseId = process.env.NOTION_TAREFAS_DATABASE_ID;

        // 1. Buscar todos os clientes
        console.log('🔍 Buscando todos os clientes...');
        const clientesResponse = await fetch(`https://api.notion.com/v1/databases/${clientesDatabaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const clientesData = await clientesResponse.json();
        const clientes = clientesData.results.map(c => ({
            id: c.id,
            name: c.properties['Name']?.title?.[0]?.text?.content || 'Sem Nome',
            email: c.properties['Email']?.email || ''
        }));

        console.log(`✓ ${clientes.length} clientes encontrados`);

        // 2. Procurar por Emerson
        const emersonCliente = clientes.find(c => c.name.toLowerCase().includes('emerson'));

        if (!emersonCliente) {
            return res.status(200).json({
                message: 'Cliente Emerson não encontrado',
                allClientes: clientes,
                searchedName: 'emerson'
            });
        }

        // 3. Buscar projetos do Emerson
        console.log(`🔍 Buscando projetos de ${emersonCliente.name}...`);
        const projetosResponse = await fetch(`https://api.notion.com/v1/databases/${projetosDatabaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Cliente',
                    relation: { contains: emersonCliente.id }
                }
            })
        });

        const projetosData = await projetosResponse.json();
        const projetos = projetosData.results.map(p => ({
            id: p.id,
            name: p.properties['Name']?.title?.[0]?.text?.content || 'Sem Nome'
        }));

        console.log(`✓ ${projetos.length} projetos encontrados para ${emersonCliente.name}`);

        // 4. Buscar tarefas do Emerson
        console.log(`🔍 Buscando tarefas de ${emersonCliente.name}...`);

        const filters = [
            {
                property: 'Cliente',
                relation: { contains: emersonCliente.id }
            }
        ];

        projetos.forEach(p => {
            filters.push({
                property: 'Projeto',
                relation: { contains: p.id }
            });
        });

        const tarefasResponse = await fetch(`https://api.notion.com/v1/databases/${tarefasDatabaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: filters.length > 0 ? { or: filters } : {}
            })
        });

        const tarefasData = await tarefasResponse.json();
        const tarefas = tarefasData.results.map(t => ({
            id: t.id,
            title: t.properties['Name']?.title?.[0]?.text?.content || 'Sem Título',
            status: t.properties['Status']?.status?.name || 'Desconhecido',
            projetoId: t.properties['Projeto']?.relation?.[0] || null
        }));

        console.log(`✓ ${tarefas.length} tarefas encontradas para ${emersonCliente.name}`);

        return res.status(200).json({
            cliente: emersonCliente,
            projetos: {
                total: projetos.length,
                items: projetos
            },
            tarefas: {
                total: tarefas.length,
                items: tarefas.slice(0, 10), // Primeiras 10
                byStatus: {
                    todo: tarefas.filter(t => ['Entrada ✉', 'A Fazer'].includes(t.status)).length,
                    in_progress: tarefas.filter(t => t.status === '📝Fazendo').length,
                    review: tarefas.filter(t => t.status === '⏱️Aguardando').length,
                    completed: tarefas.filter(t => t.status === 'Concluído').length
                }
            }
        });

    } catch (error) {
        console.error('Debug Error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
}
