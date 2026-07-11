import { verifyToken } from './auth.js';

/**
 * Update Task Status
 * Permite cliente marcar tarefas como concluídas
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

    if (req.method !== 'POST') {
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

        const { taskId, completed } = req.body;

        if (!taskId || typeof completed !== 'boolean') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'taskId and completed (boolean) are required'
            });
        }

        const notionToken = process.env.NOTION_TOKEN;

        if (!notionToken) {
            return res.status(500).json({
                error: 'Notion not configured'
            });
        }

        // Atualizar página no Notion
        // Status options do Notion: "Entrada ✉", "A Fazer", "📝Fazendo", "⏱️Aguardando", "Concluído"
        const newStatus = completed ? 'Concluído' : 'A Fazer';

        const updateResponse = await fetch(`https://api.notion.com/v1/pages/${taskId.replace(/-/g, '')}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    'Status': {
                        status: {
                            name: newStatus
                        }
                    }
                }
            })
        });

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            console.error('Notion update failed:', error);
            return res.status(updateResponse.status).json({
                error: 'Failed to update task',
                details: error
            });
        }

        const updatedTask = await updateResponse.json();

        return res.status(200).json({
            success: true,
            taskId,
            status: completed ? 'Concluído' : 'A Fazer',
            message: 'Tarefa atualizada com sucesso',
            updatedAt: updatedTask.last_edited_time
        });

    } catch (error) {
        console.error('Update Task Error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
}
