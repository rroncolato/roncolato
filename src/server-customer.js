#!/usr/bin/env node

/**
 * Servidor para Customer Dashboard
 * Executa as APIs serverless localmente
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Carregar .env manualmente
const dotenvContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
dotenvContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !process.env[key]) {
        process.env[key] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

const PORT = process.env.PORT || 3012;
const ROOT = path.resolve(__dirname);

// ==========================================
// JWT UTILITIES (igual ao auth.js)
// ==========================================

function verifyToken(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [encodedHeader, encodedPayload, signature] = parts;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

        if (signature !== expectedSignature) return null;

        const payload = JSON.parse(
            Buffer.from(encodedPayload + '==', 'base64').toString()
        );

        if (payload.exp < Math.floor(Date.now() / 1000)) return null;

        return payload;
    } catch (error) {
        return null;
    }
}

function generateToken(clientId, email) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET not configured properly');
    }

    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const payload = {
        clientId,
        email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// ==========================================
// API HANDLERS
// ==========================================

async function handleCustomerAuth(body) {
    try {
        const { email } = JSON.parse(body);
        const notionToken = process.env.NOTION_TOKEN;
        const clientesDatabaseId = process.env.NOTION_CLIENTES_DATABASE_ID;

        if (!notionToken || !clientesDatabaseId) {
            return { status: 500, data: { error: 'Notion not configured' } };
        }

        if (!email) {
            return { status: 400, data: { error: 'Invalid request', message: 'Email is required' } };
        }

        // Buscar cliente no Notion
        const response = await fetch(`https://api.notion.com/v1/databases/${clientesDatabaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Email',
                    url: { contains: email }
                }
            })
        });

        if (!response.ok) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                status: 401,
                data: { error: 'Invalid credentials', message: 'E-mail não encontrado na base de clientes' }
            };
        }

        const data = await response.json();
        if (data.results.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                status: 401,
                data: { error: 'Invalid credentials', message: 'E-mail não encontrado na base de clientes' }
            };
        }

        const result = data.results[0];
        const clientEmail = result.properties['Email']?.url || '';
        const clientName = result.properties['Name']?.title?.[0]?.text?.content || 'Cliente';
        const clientId = result.id;

        // Gerar token
        const token = generateToken(clientId, clientEmail);

        return {
            status: 200,
            data: {
                success: true,
                token,
                clientId,
                clientName,
                clientEmail
            }
        };

    } catch (error) {
        console.error('Auth Error:', error);
        return { status: 500, data: { error: 'Server error', message: error.message } };
    }
}

async function handleGetProjects(req) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return { status: 401, data: { error: 'Unauthorized' } };
        }

        const payload = verifyToken(token, process.env.JWT_SECRET);
        if (!payload) {
            return { status: 401, data: { error: 'Invalid or expired token' } };
        }

        const clientId = payload.clientId;
        console.log('📌 [GET-PROJECTS] Cliente ID:', clientId);
        console.log('📌 [GET-PROJECTS] Cliente Email:', payload.email);
        const notionToken = process.env.NOTION_TOKEN;
        const projetosDatabaseId = process.env.NOTION_PROJETOS_DATABASE_ID;
        const tarefasDatabaseId = process.env.NOTION_TAREFAS_DATABASE_ID;

        if (!notionToken || !projetosDatabaseId || !tarefasDatabaseId) {
            return { status: 500, data: { error: 'Notion not configured' } };
        }

        // Buscar projetos
        const projectsRes = await fetch(`https://api.notion.com/v1/databases/${projetosDatabaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: { property: 'Cliente', relation: { contains: clientId } }
            })
        });

        const projectsData = await projectsRes.json();
        console.log('📌 [GET-PROJECTS] Projetos retornados:', projectsData.results?.length || 0);

        const projects = projectsData.results.map(result => ({
            id: result.id,
            name: result.properties['Name']?.title?.[0]?.text?.content || 'Sem Nome',
            tag: result.properties['tag']?.select?.name || '',
            concluido: result.properties['Concluído']?.checkbox || false
        }));

        projects.forEach((p, i) => {
            console.log(`  [${i}] ${p.name} (ID: ${p.id})`);
        });

        // Buscar tarefas direto pelo cliente (ao invés de filtrar por projeto)
        console.log('📌 [GET-PROJECTS] Buscando tarefas para cliente:', clientId);
        let tasks = [];

        const tasksRes = await fetch(`https://api.notion.com/v1/databases/${tarefasDatabaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Cliente',
                    relation: { contains: clientId }
                }
            })
        });

        const tasksData = await tasksRes.json();
        console.log('📌 [GET-PROJECTS] Tarefas retornadas:', tasksData.results?.length || 0);

        if (tasksData.results && tasksData.results.length > 0) {

            const statusMap = {
                'Entrada ✉': 'todo',
                'A Fazer': 'todo',
                '📝Fazendo': 'in_progress',
                '⏱️Aguardando': 'review',
                'Concluído': 'completed'
            };

            const prioridadeMap = {
                '1ª': 'alta',
                '2ª': 'media',
                '3ª': 'baixa',
                '4ª': 'baixa'
            };

            tasks = tasksData.results.map(result => ({
                id: result.id,
                title: result.properties['Name']?.title?.[0]?.text?.content || 'Sem Título',
                status: statusMap[result.properties['Status']?.status?.name] || 'todo',
                statusOriginal: result.properties['Status']?.status?.name || 'A Fazer',
                prioridade: prioridadeMap[result.properties['Prioridade']?.select?.name] || 'baixa',
                prioridadeOriginal: result.properties['Prioridade']?.select?.name || '3ª',
                projetoId: result.properties['Projeto']?.relation?.[0] || null,
                dueDate: result.properties['Data Execução']?.date?.start || null,
                tipo: result.properties['Tipo']?.select?.name || ''
            }));
        }

        return {
            status: 200,
            data: {
                success: true,
                clientId,
                clientName: payload.email,
                projects,
                tasks
            }
        };

    } catch (error) {
        console.error('Get Projects Error:', error);
        return { status: 500, data: { error: 'Server error', message: error.message } };
    }
}

async function handleUpdateTask(body, req) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return { status: 401, data: { error: 'Unauthorized' } };
        }

        const payload = verifyToken(token, process.env.JWT_SECRET);
        if (!payload) {
            return { status: 401, data: { error: 'Invalid or expired token' } };
        }

        const { taskId, completed } = JSON.parse(body);

        if (!taskId || typeof completed !== 'boolean') {
            return {
                status: 400,
                data: { error: 'Invalid request', message: 'taskId and completed are required' }
            };
        }

        const notionToken = process.env.NOTION_TOKEN;
        if (!notionToken) {
            return { status: 500, data: { error: 'Notion not configured' } };
        }

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
                        status: { name: newStatus }
                    }
                }
            })
        });

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            return {
                status: updateResponse.status,
                data: { error: 'Failed to update task', details: error }
            };
        }

        const updatedTask = await updateResponse.json();

        return {
            status: 200,
            data: {
                success: true,
                taskId,
                status: newStatus,
                message: 'Tarefa atualizada com sucesso',
                updatedAt: updatedTask.last_edited_time
            }
        };

    } catch (error) {
        console.error('Update Task Error:', error);
        return { status: 500, data: { error: 'Server error', message: error.message } };
    }
}

/**
 * Debug: Verificar dados do cliente Emerson
 */
async function handleDebugEmerson(req) {
    try {
        const notionToken = process.env.NOTION_TOKEN;
        const clientesDatabaseId = process.env.NOTION_CLIENTES_DATABASE_ID;
        const projetosDatabaseId = process.env.NOTION_PROJETOS_DATABASE_ID;
        const tarefasDatabaseId = process.env.NOTION_TAREFAS_DATABASE_ID;

        // 1. Buscar todos os clientes
        console.log('🔍 [DEBUG EMERSON] Buscando clientes...');
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
            name: c.properties['Name']?.title?.[0]?.text?.content || 'Sem Nome'
        }));

        // 2. Procurar por Emerson
        const emerson = clientes.find(c => c.name.toLowerCase().includes('emerson'));

        if (!emerson) {
            return {
                status: 200,
                data: {
                    message: 'Cliente Emerson não encontrado',
                    clienteTotal: clientes.length,
                    clientesList: clientes
                }
            };
        }

        console.log(`✓ Cliente encontrado: ${emerson.name}`);

        // 3. Buscar projetos do Emerson
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
                    relation: { contains: emerson.id }
                }
            })
        });

        const projetosData = await projetosResponse.json();
        const projetos = projetosData.results.map(p => ({
            id: p.id,
            name: p.properties['Name']?.title?.[0]?.text?.content || 'Sem Nome'
        }));

        // 4. Buscar tarefas do Emerson
        const filters = [
            { property: 'Cliente', relation: { contains: emerson.id } }
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

        console.log(`✓ ${tarefas.length} tarefas encontradas para ${emerson.name}`);

        return {
            status: 200,
            data: {
                cliente: emerson,
                projetos: {
                    total: projetos.length,
                    items: projetos
                },
                tarefas: {
                    total: tarefas.length,
                    preview: tarefas.slice(0, 5),
                    byStatus: {
                        todo: tarefas.filter(t => ['Entrada ✉', 'A Fazer'].includes(t.status)).length,
                        in_progress: tarefas.filter(t => t.status === '📝Fazendo').length,
                        review: tarefas.filter(t => t.status === '⏱️Aguardando').length,
                        completed: tarefas.filter(t => t.status === 'Concluído').length
                    }
                }
            }
        };

    } catch (error) {
        console.error('Debug Emerson Error:', error);
        return { status: 500, data: { error: 'Server error', message: error.message } };
    }
}

// ==========================================
// MIDDLEWARE
// ==========================================

function setHeaders(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
    };
    return types[ext] || 'text/plain';
}

// ==========================================
// SERVIDOR
// ==========================================

const server = http.createServer(async (req, res) => {
    setHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${req.method} ${pathname}`);

    // ===== ROTAS DEBUG =====
    if (pathname === '/api/debug/test-notion' && req.method === 'GET') {
        const notionToken = process.env.NOTION_TOKEN;
        const clientesDatabaseId = process.env.NOTION_CLIENTES_DATABASE_ID;
        const projetosDatabaseId = process.env.NOTION_PROJETOS_DATABASE_ID;
        const tarefasDatabaseId = process.env.NOTION_TAREFAS_DATABASE_ID;

        console.log('🔍 DEBUG TEST-NOTION INICIADO');
        console.log('  Token:', notionToken ? '✓' : '✗');
        console.log('  Clientes DB:', clientesDatabaseId);
        console.log('  Projetos DB:', projetosDatabaseId);
        console.log('  Tarefas DB:', tarefasDatabaseId);

        (async () => {
            try {
                // Buscar clientes
                const clientsRes = await fetch(`https://api.notion.com/v1/databases/${clientesDatabaseId}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${notionToken}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });

                console.log('  Clientes API response:', clientsRes.status, clientsRes.ok);

                const clientsData = await clientsRes.json();

                if (!clientsRes.ok) {
                    console.error('  ❌ Erro na API:', clientsData);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 'erro',
                        message: 'Erro ao buscar clientes',
                        error: clientsData
                    }, null, 2));
                    return;
                }

                // Buscar projetos
                const projectsRes = await fetch(`https://api.notion.com/v1/databases/${projetosDatabaseId}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${notionToken}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });

                const projectsData = await projectsRes.json();

                // Buscar tarefas
                const tasksRes = await fetch(`https://api.notion.com/v1/databases/${tarefasDatabaseId}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${notionToken}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });

                const tasksData = await tasksRes.json();

                const result = {
                    status: 'ok',
                    databases: {
                        clientes: clientesDatabaseId,
                        projetos: projetosDatabaseId,
                        tarefas: tarefasDatabaseId
                    },
                    totals: {
                        clientes: clientsData.results?.length || 0,
                        projetos: projectsData.results?.length || 0,
                        tarefas: tasksData.results?.length || 0
                    },
                    clientes: (clientsData.results || []).slice(0, 5).map(r => ({
                        id: r.id,
                        name: r.properties['Name']?.title?.[0]?.text?.content,
                        email: r.properties['Email']?.url
                    })),
                    projetos: (projectsData.results || []).slice(0, 5).map(r => ({
                        id: r.id,
                        name: r.properties['Name']?.title?.[0]?.text?.content,
                        cliente: r.properties['Cliente']?.relation?.[0]
                    })),
                    tarefas: (tasksData.results || []).slice(0, 5).map(r => ({
                        id: r.id,
                        name: r.properties['Name']?.title?.[0]?.text?.content,
                        projeto: r.properties['Projeto']?.relation?.[0],
                        status: r.properties['Status']?.status?.name,
                        allProperties: Object.keys(r.properties)
                    }))
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result, null, 2));
            } catch (error) {
                const errorResult = {
                    error: error.message,
                    code: error.code,
                    stack: error.stack
                };
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(errorResult));
            }
        })();
        return;
    }

    // ===== ROTAS API =====
    if (pathname === '/api/customer/auth' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const result = await handleCustomerAuth(body);
            res.writeHead(result.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.data));
        });
        return;
    }

    if (pathname === '/api/customer/get-projects' && req.method === 'GET') {
        const result = await handleGetProjects(req);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
        return;
    }

    if (pathname === '/api/customer/update-task' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const result = await handleUpdateTask(body, req);
            res.writeHead(result.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.data));
        });
        return;
    }

    if (pathname === '/api/customer/debug-emerson' && req.method === 'GET') {
        const result = await handleDebugEmerson(req);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
        return;
    }

    // ===== ARQUIVOS ESTÁTICOS =====
    let filePath = path.join(ROOT, pathname === '/' ? '/index.html' : pathname);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Se não achar o arquivo, tenta index.html (para SPAs)
            if (err.code === 'ENOENT' && !pathname.startsWith('/api')) {
                filePath = path.join(ROOT, '/index.html');
                fs.readFile(filePath, (err2, data2) => {
                    if (err2) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - Arquivo não encontrado</h1>');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data2);
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Arquivo não encontrado</h1>');
            }
            return;
        }

        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/customer/login.html`);
    console.log(`📋 Admin: http://localhost:${PORT}/admin/login.html\n`);
});
