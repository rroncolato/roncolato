# Regras — IA / Diagnóstico

## Arquitetura
- Interface `VisionDiagnosticProvider` em `src/lib/ai/provider.ts`. Adapters: `anthropic.ts` (real), `demo.ts` (fixture). Seleção por `AI_PROVIDER` na config.
- Chamadas só no servidor. Chave nunca no navegador.
- Prompts em `src/lib/ai/prompts/` (system, diagnostic, safety, version). Mudança de prompt incrementa `PROMPT_VERSION`.
- Registrar em cada assessment: provider, modelo, versão do prompt.

## Schema
- Resposta validada com Zod (`DiagnosticResultSchema`) antes de salvar.
- Notas de pilar 0–100. `practicalRecommendations` exatamente 5 itens.
- Nota geral calculada em `scoring.ts` — nunca aceitar do modelo.
- JSON inválido: 1 retry automático; depois status failed + fallback amigável.
- Temperatura baixa (consistência). Timeout via AI_TIMEOUT_MS.

## Ética (inegociável)
- Falar do que a **fotografia comunica** ("A fotografia comunica...", "O enquadramento favorece..."), nunca rotular a pessoa ("Você é...").
- Proibido inferir: raça, etnia, religião, saúde, deficiência, orientação sexual, condição psicológica, opinião política, situação financeira, identidade, atratividade, idade exata.
- Arquétipos = linguagem de percepção visual, não diagnóstico psicológico.
- Evidência insuficiente → declarar limitação. Toda resposta tem nível de confiança.
- Sem reconhecimento facial. Sem rosto visível ou múltiplas pessoas → recusar com mensagem definida na metodologia.
- Não enviar ao modelo dados do lead além do necessário (intenção declarada, segmento, cargo, público, arquétipos desejados).

## Faixas de nota geral
0–39 desalinhada · 40–59 parcialmente coerente · 60–74 boa base · 75–89 forte e consistente · 90–100 altamente alinhada. Linguagem nunca humilhante.
