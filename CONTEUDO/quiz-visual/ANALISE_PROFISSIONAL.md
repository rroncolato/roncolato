# Sistema de Análise Profissional — Diagnóstico Visual

## Objetivo
Gerar diagnóstico realista, específico, profissional. Não genérico.

---

## Matriz de Segmentos + Expectativas Visuais

### Advogado
- **Expectativa visual:** Autoridade, solidez, confiança
- **Elementos críticos:** Postura ereta, expressão séria, fundo neutro/profissional
- **Red flags:** Foto casual, sorriso muito aberto, background bagunçado
- **Gap típico:** "Pareço jovem demais para experiência que tenho"

### Médico
- **Expectativa visual:** Competência, segurança, profissionalismo
- **Elementos críticos:** Jaleco/branco, iluminação clínica, expressão confiante
- **Red flags:** Foto envelhecida, maquiagem pesada, fundo descontraído
- **Gap típico:** "Meus pacientes não levam a sério pela aparência"

### Terapeuta
- **Expectativa visual:** Presença acolhedora + profissional, equilíbrio
- **Elementos críticos:** Roupa leve/confortável, expressão serena, olhar direto
- **Red flags:** Muito maquiada, muito formal, expressão fria
- **Gap típico:** "Pareço distante ou pouco acessível"

### Empresário/CEO
- **Expectativa visual:** Liderança, visão, poder
- **Elementos críticos:** Roupas executivas, postura de comando, olhar projetado
- **Red flags:** Foto velha, expressão cansada, foto casual demais
- **Gap típico:** "Meu time não vê como líder"

### Contador
- **Expectativa visual:** Precisão, confiabilidade, detalhe
- **Elementos críticos:** Roupas conservadoras, foco no rosto, clareza técnica
- **Red flags:** Foto borrada, cores vibrantes demais, casual
- **Gap típico:** "Clientes não confiam em mim logo de cara"

---

## Lógica de Análise

### Scoring (0-100)

**P1 - Tempo da foto**
- 5+ anos: -30 pontos (crítico, desatualizado)
- 2-5 anos: -15 pontos (precisa update)
- 2 anos: -5 pontos (razoável)
- 1 ano: +10 pontos (bom)

**P2 - Reconhecimento vs Competência**
- Não reconhecido + Gap: -25 pontos (invisível no mercado)
- Parcialmente reconhecido: -10 pontos (inconsistente)
- Bem reconhecido: +20 pontos (credibilidade sólida)

**P3 - Imagem comunica experiência**
- Não comunica: -20 pontos (gap real)
- Não sei: -10 pontos (desatento)
- Comunica bem: +15 pontos (alinhado)

**P4 - Conhece arquétipo**
- Não sabe: -5 pontos (desorientado)
- Sabe: +10 pontos (autoconhecimento)

**P5 - Recebeu feedback**
- Sim (sobre foto): +5 pontos (consciente, pronto pra mudar)
- Não: -2 pontos (invisível)

**Score final:**
- 0-30: CRÍTICO — imagem é barreira real
- 31-60: OPORTUNIDADE — gap entre potencial e percepção
- 61-80: BOM — refinamento pra otimizar
- 81-100: EXCELENTE — já está bem posicionado

---

## Prompt de Diagnóstico (GPT/Claude)

```
Você é especialista em fotografia corporativa e personal branding.
Gere diagnóstico profissional baseado nesses dados:

Nome: [nome]
Segmento: [segmento]
Tempo foto: [tempo]
Reconhecimento: [sim/não/parcial]
Imagem comunica exp: [sim/não/não sei]
Arquétipo: [resposta]
Feedback foto: [sim/não]

Regras:
1. SER ESPECÍFICO — mencione o segmento, não fale "profissional genérico"
2. IDENTIFICAR GAP — qual é a lacuna entre competência real e percepção?
3. REALISTA — não exagere nem subestime
4. ACIONÁVEL — termine com recomendação clara
5. PROFISSIONAL — tom consultivo, não venda pesada

Estrutura:
[SITUAÇÃO] → O que a pessoa já tem
[GAP] → Onde está o problema
[IMPACTO] → Por que isso importa no seu segmento
[PRÓXIMO PASSO] → O que fazer

Exemplo output:
"Você é contador com foto de 3 anos. Seus clientes reconhecem seu trabalho, mas sua imagem não comunica a solidez da sua experiência — isso custa credibilidade em primeiras reuniões. A foto antiga + expressão pouco profissional criam gap entre sua competência real e como você é percebido. Contadores precisam transmitir precisão visual. Próximo passo: sessão de reposicionamento visual pra alinhar sua imagem com seu nível."

Não usar: filler, genérico, venda agressiva.
Usar: detalhes específicos do segmento, insights observáveis, tom consultivo.
```

---

## Campos de Diagnóstico (saída JSON)

```json
{
  "score": 45,
  "nivel": "OPORTUNIDADE",
  "segmento_diagnostico": "Advogado — autoridade/solidez críticas",
  "situacao_atual": "Foto de 2 anos, parcialmente reconhecido, imagem não comunica experiência",
  "gap_identificado": "Há gap entre sua competência real e percepção dos clientes",
  "impacto": "Clientes novos decidem em 10 segundos; sua foto/presença custa oportunidades",
  "diagnostico": "[texto profissional gerado]",
  "recomendacao": "Sessão de reposicionamento visual — foto + consultoria de imagem",
  "urgencia": "alta"
}
```

---

## Integração no Code

Usar `analyze.js` com:
1. **Calcular score** conforme matriz acima
2. **Puxar template** de diagnóstico por segmento
3. **Substituir variáveis** com dados reais (tempo foto, gap, etc)
4. **Gerar texto profissional** em vez de genérico

Output final: diagnóstico específico + call-to-action claro (sessão reposicionamento).

---

## Exemplo Real

**Input:**
- Nome: João Silva
- Segmento: Advogado
- Tempo foto: 5+ anos
- Reconhecimento: Não
- Imagem comunica exp: Não
- Feedback: Sim (negativo)

**Output:**
"Como advogado, sua primeira impressão é tudo. Você não é reconhecido pelo trabalho que faz, e sua foto de 5+ anos não comunica a experiência que você realmente tem. Esse gap custa clientes — eles veem a foto velha e decidem procurar outro. Sua imagem precisa transmitir autoridade e solidez. Próximo passo: reposicionamento visual urgente. Uma sessão vai realinhar sua aparência com seu nível e mudar como você é percebido no mercado."

Score: 15 (CRÍTICO)
Recomendação: Sessão urgente

---

## Como usar esse sistema

1. Integrar matriz de scoring em `analyze.js`
2. Template de diagnóstico por segmento (ou usar API Claude pra gerar)
3. Substituir variáveis reais (nome, segmento, respostas)
4. Output profissional + score + urgência
5. CTA: agendar diagnóstico completo (link WhatsApp)
