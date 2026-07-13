import type { DiagnosticInput } from "@/lib/ai/provider";
import { ARCHETYPES } from "@/lib/archetypes";
import { PROMPT_VERSION } from "./version";

/**
 * Prompt da análise. Recebe o contexto mínimo do lead (nunca nome/contato).
 * Alterações exigem incremento de PROMPT_VERSION.
 */
export function buildDiagnosticPrompt(context: DiagnosticInput["context"]): string {
  const archetypeList = ARCHETYPES.map((a) => `- ${a.id}: ${a.name} — ${a.essence}`).join("\n");

  return `Analise a fotografia de perfil profissional anexada.

CONTEXTO DECLARADO PELA PESSOA (intenção de posicionamento):
- Segmento de atuação: ${context.segment}
- Cargo/função: ${context.role}
- Público que deseja atrair: ${context.targetAudience}
- Como deseja ser percebida: ${context.desiredPerception.join(", ")}
- Características que a imagem deveria transmitir: ${context.desiredTraits.join(", ")}
- Percepções que NÃO deseja transmitir: ${context.avoidPerceptions.join(", ")}
- Arquétipos desejados: ${context.desiredArchetypes.join(", ")}

ARQUÉTIPOS DE REFERÊNCIA (use exatamente estes ids em perceivedArchetypes.archetype):
${archetypeList}

METODOLOGIA — avalie os 6 pilares com nota 0–100 cada:
1. expression — tensão/naturalidade, intensidade, abertura, sorriso, direção do olhar, presença, expressividade.
2. authority — segurança visual, estabilidade, postura, direção do olhar, enquadramento, coerência com liderança/especialidade.
3. connection — proximidade, receptividade, humanidade, confiança, acessibilidade, equilíbrio autoridade × acolhimento.
4. visualCoherence — relação entre intenção declarada, segmento, cargo, público, roupa, cenário, enquadramento e estilo.
5. archetypalAlignment — arquétipos desejados × percebidos; sinais visuais que fortalecem e que conflitam.
6. perceivedValue — coerência aparente com nível profissional, mercado, público desejado e posicionamento premium/autoridade.

NÃO calcule nota geral — ela é calculada pelo sistema.

INSTRUÇÕES DE PREENCHIMENTO:
- version: "${PROMPT_VERSION}"
- visualObservations: 2–4 observações objetivas e citáveis por categoria.
- perceivedArchetypes: 1–3 arquétipos percebidos, cada um com confidence (0–1) e evidence com sinais visuais concretos.
- desiredArchetypes: repita exatamente os arquétipos desejados informados acima.
- alignment: forças, conflitos e um summary comparando percepção × intenção.
- freeResult: mainStrength (1 parágrafo curto), mainGap (maior distância entre intenção e imagem), initialRecommendation (UMA ação prática), conclusion (fechamento estratégico curto).
- fullResult: análises aprofundadas por dimensão; practicalRecommendations com EXATAMENTE 5 itens acionáveis; strategicSummary como síntese final que aponta direção.
- confidence: 0–1, honesto quanto às limitações da imagem.
- limitations: liste toda restrição relevante (qualidade, enquadramento, iluminação etc.).

Escreva todo o texto em português brasileiro.`;
}
