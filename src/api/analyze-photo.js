// ── ANALYZE-PHOTO.JS — Claude Vision análise de foto corporativa ──

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

async function analyzePhotoVisual(base64Photo) {
  const prompt = `Você é fotógrafo corporativo especializado em posicionamento de marca (João Mena como referência).
Analise esta foto profissional e extraia elementos visuais críticos para diagnóstico:

ESTRUTURA DE ANÁLISE (ser específico):

1. ILUMINAÇÃO
   - Tipo: frontal, lateral, contraluz, suave, dura
   - Qualidade: profissional, amadadora, estúdio, natural
   - Impacto: comunica autoridade, humanidade, mistério, profundidade

2. POSTURA
   - Descrição: ereta, relaxada, assimétrica, curvada, centrada
   - Impacto visual: liderança, acessibilidade, vulnerabilidade, confiança
   - Sinal PNL: confiança ou submissão

3. OLHAR
   - Direção: câmera, lado, acima, abaixo, profundo
   - Qualidade: confiante, pensativo, desconfortável, magnético
   - Impacto: se comunica decisão, reflexão, ou insegurança

4. EXPRESSÃO
   - Tipo: sorriso genuíno (Duchenne), corporativo, neutro, séria, animada
   - Autenticidade: genuine, forçada
   - Impacto: humanidade, profissionalismo, distância

5. VESTUÁRIO
   - Tipo: formal, casual-prof, criativo, conservador
   - Cores: neutras, vibrantes, quentes, frias
   - Alinhamento: executivo, criativo, técnico, humanitário
   - Impacto: autoridade, acessibilidade, profissionalismo

6. CONTEXTO/FUNDO
   - Tipo: estúdio neutro, profissional, natural, elemento pessoal
   - Organização: limpo, desordenado, intencional
   - Impacto: foco, desorganização, personalidade

7. COMPOSIÇÃO
   - Enquadramento: headshot fechado, 3/4, corporal
   - Distância: íntimo, profissional, distante
   - Intenção: venda, consultoria, humanidade

OUTPUT JSON (estruturado):
{
  "iluminacao": {
    "tipo": "[tipo]",
    "qualidade": "[qualidade]",
    "impacto": "[impacto em 1 frase]",
    "score": -10 a +10
  },
  "postura": {
    "descricao": "[descrição]",
    "confianca_visual": "baixa/média/alta",
    "score": -10 a +10
  },
  "olhar": {
    "direcao": "[direção]",
    "qualidade": "[qualidade]",
    "confianca": "baixa/média/alta",
    "score": -10 a +10
  },
  "expressao": {
    "tipo": "[tipo]",
    "autenticidade": "forçada/genuine",
    "humanidade": "baixa/média/alta",
    "score": -10 a +10
  },
  "vestuario": {
    "tipo": "[tipo]",
    "cores": "[cores]",
    "alinhamento": "[alinhamento profissional]",
    "score": -10 a +10
  },
  "contexto": {
    "tipo": "[tipo]",
    "organizacao": "[limpo/desordenado/intencional]",
    "score": -10 a +10
  },
  "composicao": {
    "enquadramento": "[tipo]",
    "distancia": "[distância]",
    "intencao": "[intençao visual]"
  },
  "resumo_visual": "[1-2 frases resumo: o que a foto comunica visualmente]",
  "score_total": [soma dos scores individuais, range -70 a +70],
  "diagnostico_visual": "[1 parágrafo: análise como fotógrafo profissional]"
}

Seja específico. Não genérico. Mencione detalhes observáveis.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Photo
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    });

    // Extrair JSON da resposta
    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Não consegui extrair análise estruturada');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Erro Claude Vision:', error);
    throw error;
  }
}

module.exports = { analyzePhotoVisual };
