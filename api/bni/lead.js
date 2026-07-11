// Proxy para Notion API — browser não pode chamar Notion direto (CORS)
const NOTION_TOKEN = process.env.NOTION_BNI_TOKEN;
const NOTION_DB_ID = process.env.NOTION_BNI_DB_ID || '2ad273367bd880ef98f5dca1a8c70600';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nome, whatsapp, ramo, diagnostico, score, nivel, photoUrl } = req.body || {};
  if (!nome || !whatsapp) return res.status(400).json({ error: 'nome e whatsapp obrigatórios' });

  const properties = {
    'Nome Completo': { title: [{ text: { content: String(nome).slice(0, 200) } }] },
    'Ramo de Atuação': { rich_text: [{ text: { content: String(ramo || '').slice(0, 200) } }] },
    'Telefone': { phone_number: String(whatsapp).slice(0, 30) },
    'Funil': { select: { name: 'BNIConquista' } },
  };
  if (diagnostico) {
    properties['Diagnóstico'] = { rich_text: [{ text: { content: String(diagnostico).slice(0, 2000) } }] };
  }
  if (typeof score === 'number') properties['Score'] = { number: score };
  if (nivel) properties['Nível'] = { select: { name: String(nivel) } };
  if (photoUrl) {
    properties['Foto de Perfil'] = { files: [{ name: 'foto-perfil.jpg', external: { url: String(photoUrl) } }] };
  }

  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ parent: { database_id: NOTION_DB_ID }, properties }),
    });

    if (!notionRes.ok) {
      const err = await notionRes.text();
      console.error('Notion error:', err);
      return res.status(502).json({ error: 'Notion API error', detail: err.slice(0, 500) });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Lead save failed:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
