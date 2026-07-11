import crypto from 'crypto';

/**
 * Customer Authentication API
 * Login simples por Email (identifica cliente único no Notion)
 * O email é o identificador único do cliente
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
        const { email } = req.body;
        const notionToken = process.env.NOTION_TOKEN;
        const clientesDatabaseId = process.env.NOTION_CLIENTES_DATABASE_ID;

        if (!notionToken || !clientesDatabaseId) {
            return res.status(500).json({
                error: 'Notion not configured',
                message: 'NOTION_TOKEN or NOTION_CLIENTES_DATABASE_ID not set'
            });
        }

        // Validação básica
        if (!email) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Email is required'
            });
        }

        // Buscar cliente no Notion por email
        const cliente = await findClientByEmail(notionToken, clientesDatabaseId, email);

        if (!cliente) {
            // Delay para prevenir brute force
            await new Promise(resolve => setTimeout(resolve, 500));
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'E-mail não encontrado na base de clientes'
            });
        }

        // Gerar JWT Token
        const token = generateToken(cliente.id, cliente.email);

        return res.status(200).json({
            success: true,
            token,
            clientId: cliente.id,
            clientName: cliente.name,
            clientEmail: cliente.email
        });

    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
}

/**
 * Busca cliente por e-mail (Email é URL no Notion)
 */
async function findClientByEmail(notionToken, databaseId, email) {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Email',
                    url: {
                        contains: email
                    }
                }
            })
        });

        if (!response.ok) {
            console.error('Notion query failed:', await response.json());
            return null;
        }

        const data = await response.json();
        if (data.results.length === 0) return null;

        const result = data.results[0];
        const clientEmail = result.properties['Email']?.url || '';
        const clientName = result.properties['Name']?.title?.[0]?.text?.content || 'Cliente';

        return {
            id: result.id,
            name: clientName,
            email: clientEmail
        };

    } catch (error) {
        console.error('findClientByEmail Error:', error);
        return null;
    }
}

/**
 * Gera JWT Token com 7 dias de expiração
 */
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
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 dias
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

/**
 * Valida JWT Token
 */
export function verifyToken(token, secret) {
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
        console.error('Token verification error:', error);
        return null;
    }
}
