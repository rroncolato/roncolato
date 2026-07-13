# Prompts de IA

## Estrutura
```
src/lib/ai/prompts/system.ts      persona + regras gerais do analista visual
src/lib/ai/prompts/diagnostic.ts  instrução da análise + formato JSON esperado
src/lib/ai/prompts/safety.ts      regras éticas inegociáveis (inferências proibidas)
src/lib/ai/prompts/version.ts     PROMPT_VERSION (semver)
```

## Regras
- Toda mudança de prompt → incrementar PROMPT_VERSION.
- Assessment grava: ai_provider, ai_model, prompt_version.
- Temperatura baixa (0.2) para consistência.
- Resposta = JSON validado por DiagnosticResultSchema; 1 retry em falha; depois failed.
- Modelo NUNCA recebe: nome, e-mail, telefone, empresa identificável do lead.
- Modelo NUNCA retorna nota geral — só pilares.

## Contexto enviado
segmento · cargo (genérico) · público desejado · percepção desejada · características desejadas · percepções a evitar · arquétipos desejados + imagem processada.

## Insumo histórico
`src/api/analyze-photo.js` do site pai (experimento Claude Vision anterior) serviu de referência para os eixos de observação (luz, postura, olhar, expressão, vestuário, fundo, composição).
