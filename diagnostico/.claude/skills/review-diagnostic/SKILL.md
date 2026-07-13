---
name: review-diagnostic
description: Revisa prompts, fixtures e saídas do diagnóstico de IA — inferências proibidas, coerência das notas, linguagem respeitosa, limitações. Use após alterar prompts ou schema.
---

# Revisão do diagnóstico

## Checklist

### Fundamentação
- [ ] Toda conclusão apoiada em sinal visual observável (evidence[])
- [ ] Arquétipos tratados como percepção visual, não psicologia
- [ ] Limitações declaradas quando evidência insuficiente
- [ ] Nível de confiança presente

### Inferências proibidas (reprovar se presente)
- [ ] Raça, etnia, religião, saúde, deficiência
- [ ] Orientação sexual, condição psicológica, opinião política
- [ ] Situação financeira, identidade, atratividade, idade exata
- [ ] Qualquer "Você é..." — só "A fotografia comunica..."

### Notas
- [ ] Pilares 0–100, coerentes com as observações textuais
- [ ] Nota geral vem de scoring.ts, nunca do modelo
- [ ] practicalRecommendations com exatamente 5 itens
- [ ] Comparação desejado × percebido presente e fundamentada

### Linguagem
- [ ] Respeitosa em toda faixa de nota (inclusive 0–39)
- [ ] Sem promessas de resultado, sem tom de coach
- [ ] Frases-modelo: "A fotografia comunica…", "O enquadramento favorece…", "Visualmente, existe maior aproximação com…"

## Saída
Violações com localização e correção. Se limpo, aprovado.
