// ── SUBMIT.JS — Enviar dados para Notion ──

class Submitter {
  constructor(data) {
    this.data = data;
    // Token NUNCA no frontend — usar proxy serverless (padrão api/bni/lead.js)
    this.notionToken = 'USAR_PROXY_SERVERLESS';
    this.notionDatabaseId = '2ad273367bd880ef98f5dca1a8c70600';
  }

  async submit() {
    // Salvar localmente primeiro (fallback se Notion falhar)
    this.saveLocal();

    // Tentar enviar para Notion
    if (this.notionToken !== 'ADICIONAR_TOKEN_NOTION_AQUI') {
      try {
        await this.saveToNotion();
      } catch (error) {
        console.warn('Notion sync falhou, mas dados foram salvos localmente', error);
      }
    }

    return true;
  }

  saveLocal() {
    const timestamp = new Date().toISOString();
    const record = {
      timestamp,
      nomeCompleto: this.data.nomeCompleto,
      segmento: this.data.segmento,
      telefone: this.data.whatsapp,
      respostas: {
        fotoTempo: this.data.p1_fotoTempo,
        reconhecido: this.data.p2_reconhecido,
        experiencia: this.data.p3_experiencia,
        arquetipo: this.data.p4_arqTem,
        arquetipoNome: this.data.p4_arquetipo,
        feedback: this.data.p5_feedback
      },
      analise: {
        score: this.data.analysisScore,
        nivel: this.data.analysisNivel,
        arquetiposComunicado: this.data.archetiposComun,
        arquetiposEsperado: this.data.archetiposEsperado,
        diagnostico: this.data.diagnostico,
        recomendacao: this.data.recomendacao,
        urgencia: this.data.urgencia
      },
      evento: 'PalestraBNI',
      tag: '#PalestraBNI'
    };

    // Salvar em localStorage
    const records = JSON.parse(localStorage.getItem('quiz_records') || '[]');
    records.push(record);
    localStorage.setItem('quiz_records', JSON.stringify(records));

    // Log para console (debug)
    console.log('Record salvo localmente:', record);
  }

  async saveToNotion() {
    const payload = {
      parent: { database_id: this.notionDatabaseId },
      properties: {
        'Nome Completo': {
          title: [{ text: { content: this.data.nomeCompleto } }]
        },
        'Ramo de Atuação': {
          rich_text: [{ text: { content: this.data.segmento } }]
        },
        'Telefone': {
          phone_number: this.data.whatsapp
        },
        'Funil': {
          multi_select: [{ name: 'PalestraBNI' }]
        }
        // ADICIONAR APÓS CRIAR CAMPOS NO NOTION:
        // 'P1 - Tempo da Foto': { select: { name: this.data.p1_fotoTempo } },
        // 'P2 - Bem Reconhecido': { select: { name: this.data.p2_reconhecido } },
        // 'P3 - Imagem Comunica Exp': { select: { name: this.data.p3_experiencia } },
        // 'P4 - Conhece Arquétipo': { select: { name: this.data.p4_arqTem } },
        // 'P5 - Feedback Foto': { select: { name: this.data.p5_feedback } },
        // 'Score Visual': { number: this.data.analysisScore },
        // 'Nível Diagnóstico': { select: { name: this.data.analysisNivel } },
        // 'Arquétipo Comunicado': { rich_text: [{ text: { content: this.data.archetiposComun } }] },
        // 'Diagnóstico': { rich_text: [{ text: { content: this.data.diagnostico } }] },
        // 'Recomendação': { rich_text: [{ text: { content: this.data.recomendacao } }] },
        // 'Urgência': { select: { name: this.data.urgencia } },
        // 'Data Quiz': { date: { start: new Date().toISOString().split('T')[0] } }
      }
    };

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    return await response.json();
  }
}
