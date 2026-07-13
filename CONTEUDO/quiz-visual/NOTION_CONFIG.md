# Configuração Notion — Funil PalestraBNI

**Status:** Token + Database validado. Estrutura incompleta.

---

## Campos Atuais (existentes)
✅ Nome Completo (title)
✅ Ramo de Atuação (rich_text)
✅ Telefone (phone_number)
✅ E-mail (email)
✅ Funil (select)
✅ Instagram (url)

---

## Campos Necessários (A ADICIONAR)

Para capturar dados completos do quiz, adicione esses campos ao banco:

### P1: Tempo da Foto
- **Nome:** P1 - Tempo da Foto
- **Tipo:** Select
- **Opções:** 1 ano, 2 anos, 2-5 anos, 5+ anos

### P2: Reconhecimento
- **Nome:** P2 - Bem Reconhecido
- **Tipo:** Select
- **Opções:** Sim, Não, Parcial

### P3: Imagem Comunica Experiência
- **Nome:** P3 - Imagem Comunica Exp
- **Tipo:** Select
- **Opções:** Sim, Não, Não Sei

### P4: Arquétipo
- **Nome:** P4 - Conhece Arquétipo
- **Tipo:** Select
- **Opções:** Sim, Não

### P4b: Qual Arquétipo (opcional)
- **Nome:** P4b - Qual Arquétipo
- **Tipo:** Rich Text

### P5: Feedback Foto
- **Nome:** P5 - Feedback Foto
- **Tipo:** Select
- **Opções:** Sim, Não

### Score
- **Nome:** Score Visual
- **Tipo:** Number

### Nível
- **Nome:** Nível Diagnóstico
- **Tipo:** Select
- **Opções:** CRÍTICO, CONFUSO, BOM, EXCELENTE

### Arquétipo Comunicado
- **Nome:** Arquétipo Comunicado
- **Tipo:** Rich Text

### Diagnóstico
- **Nome:** Diagnóstico
- **Tipo:** Rich Text

### Recomendação
- **Nome:** Recomendação
- **Tipo:** Rich Text

### Urgência
- **Nome:** Urgência
- **Tipo:** Select
- **Opções:** Alta, Média, Baixa

### Data do Quiz
- **Nome:** Data Quiz
- **Tipo:** Date

### Foto (base64)
- **Nome:** Foto Base64
- **Tipo:** Rich Text (ou arquivo se Notion suportar)

---

## Como Adicionar Campos (Notion UI)

1. Abrir banco "Funil PalestraBNI"
2. Clicar no `+` ao lado do último campo
3. Preencher:
   - Name: [Nome do campo]
   - Property type: [Tipo]
   - Adicionar opções (se Select)
4. Save

---

## Próximos Passos

1. ✅ Token configurado em submit.js
2. ✅ Database ID validado
3. ⏳ Adicionar campos ao banco (manual ou API)
4. ⏳ Testar envio de dados quiz → Notion
5. ⏳ Validar mapeamento de campos em submit.js

---

## Após Adicionar Campos

Update `submit.js` método `saveToNotion()` com mapping correto:

```javascript
properties: {
  'Nome Completo': { title: [{ text: { content: this.data.nomeCompleto } }] },
  'Ramo de Atuação': { rich_text: [{ text: { content: this.data.segmento } }] },
  'Telefone': { phone_number: this.data.whatsapp },
  'P1 - Tempo da Foto': { select: { name: this.data.p1_fotoTempo } },
  'P2 - Bem Reconhecido': { select: { name: this.data.p2_reconhecido } },
  'P3 - Imagem Comunica Exp': { select: { name: this.data.p3_experiencia } },
  'P4 - Conhece Arquétipo': { select: { name: this.data.p4_arqTem } },
  'P5 - Feedback Foto': { select: { name: this.data.p5_feedback } },
  'Score Visual': { number: this.data.analysisScore },
  'Nível Diagnóstico': { select: { name: this.data.analysisNivel } },
  'Arquétipo Comunicado': { rich_text: [{ text: { content: this.data.archetiposComun } }] },
  'Diagnóstico': { rich_text: [{ text: { content: this.data.diagnostico } }] },
  'Recomendação': { rich_text: [{ text: { content: this.data.recomendacao } }] },
  'Urgência': { select: { name: this.data.urgencia } },
  'Data Quiz': { date: { start: new Date().toISOString().split('T')[0] } },
  'Funil': { multi_select: [{ name: 'PalestraBNI' }] }
}
```

---

## Status

- Database: `2ad273367bd880ef98f5dca1a8c70600`
- Token: ✅ Validado
- Campos: ⏳ Aguardando adição manual
