export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const notionToken = process.env.NOTION_TOKEN;
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;

    if (!notionToken || !notionDatabaseId) {
        return res.status(500).json({
            error: 'Environment variables not configured',
            hasToken: !!notionToken,
            hasDbId: !!notionDatabaseId
        });
    }

    try {
        // Fetch database properties
        const dbResponse = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId.replace(/-/g, '')}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        if (!dbResponse.ok) {
            const error = await dbResponse.json();
            console.error('Database fetch failed:', error);
            return res.status(dbResponse.status).json({
                error: 'Failed to fetch database',
                details: error
            });
        }

        const dbData = await dbResponse.json();

        // Extract and format properties with detailed info
        const properties = {};
        const propertyDetails = {};
        Object.entries(dbData.properties).forEach(([name, config]) => {
            properties[name] = config.type;
            propertyDetails[name] = {
                type: config.type,
                id: config.id,
                config: config
            };
        });

        console.log('Database Properties:', JSON.stringify(propertyDetails, null, 2));

        return res.status(200).json({
            success: true,
            databaseId: notionDatabaseId.replace(/-/g, ''),
            databaseTitle: dbData.title,
            properties: properties,
            propertyDetails: propertyDetails,
            message: 'Database schema retrieved successfully. Check properties object for property names and types.'
        });

    } catch (error) {
        console.error('Debug Error:', error);
        return res.status(500).json({
            error: `Server error: ${error.message}`,
            stack: error.stack
        });
    }
}
