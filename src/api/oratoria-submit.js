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
        const { fullName, email, phone, profession, instagram } = req.body;

        console.log('Dados recebidos:', { fullName, email, phone, profession, instagram });

        // Validação
        if (!fullName || !email || !phone || !profession) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        const notionToken = process.env.NOTION_TOKEN;
        const notionDatabaseId = process.env.NOTION_DATABASE_ID;

        if (!notionToken || !notionDatabaseId) {
            console.error('Variáveis de ambiente não configuradas:', {
                hasToken: !!notionToken,
                hasDbId: !!notionDatabaseId
            });
            return res.status(500).json({ error: 'Configuração incompleta no servidor' });
        }

        const cleanDatabaseId = notionDatabaseId.replace(/-/g, '').trim();

        // First, try to fetch database properties to detect actual property names
        let dbProperties = null;
        try {
            const dbResponse = await fetch(`https://api.notion.com/v1/databases/${cleanDatabaseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${notionToken}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                }
            });

            if (dbResponse.ok) {
                const dbData = await dbResponse.json();
                dbProperties = Object.keys(dbData.properties);
                console.log('Database properties found:', dbProperties);
            }
        } catch (dbError) {
            console.warn('Could not fetch database properties:', dbError.message);
        }

        // Property name mapping with fallbacks
        const propertyMapping = {
            name: ['Nome Completo', 'Name', 'name'],
            email: ['E-mail', 'Email', 'email'],
            phone: ['Telefone', 'Phone', 'phone'],
            profession: ['Ramo de Atuação', 'Profession', 'profession', 'Ramo'],
            instagram: ['Instagram', 'instagram']
        };

        // Find actual property names from database
        const actualProperties = {};
        Object.entries(propertyMapping).forEach(([field, alternatives]) => {
            const found = alternatives.find(alt => dbProperties?.includes(alt));
            actualProperties[field] = found || alternatives[0];
        });

        console.log('Using property names:', actualProperties);

        // Prepare properties with detected names
        const properties = {
            [actualProperties.name]: {
                title: [{ text: { content: fullName } }]
            },
            [actualProperties.email]: {
                email: email
            },
            [actualProperties.phone]: {
                phone_number: phone
            },
            [actualProperties.profession]: {
                rich_text: [{ text: { content: profession } }]
            }
        };

        // Add Instagram if provided
        if (instagram && instagram.trim()) {
            properties[actualProperties.instagram] = {
                url: instagram
            };
            console.log('Instagram adicionado:', instagram);
        } else {
            console.log('Instagram vazio ou não preenchido');
        }

        // Send to Notion
        const notionResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parent: {
                    database_id: cleanDatabaseId
                },
                properties: properties
            })
        });

        if (!notionResponse.ok) {
            const error = await notionResponse.json();
            console.error('Notion API Error:', JSON.stringify(error, null, 2));
            console.error('Status Code:', notionResponse.status);
            console.error('Request Payload:', JSON.stringify({
                parent: {
                    database_id: cleanDatabaseId
                },
                properties: properties
            }, null, 2));
            return res.status(notionResponse.status).json({
                error: 'Erro ao salvar no Notion',
                details: error.message,
                code: error.code
            });
        }

        const data = await notionResponse.json();
        return res.status(200).json({ success: true, id: data.id });

    } catch (error) {
        console.error('Backend Error:', error);
        return res.status(500).json({ error: `Erro no servidor: ${error.message}` });
    }
}
