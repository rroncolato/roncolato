# Quiz Visual — Diagnóstico de Imagem Corporativa

**Propósito:** Captura leads qualificados pós-palestra via quiz interativo + análise de foto + formulário.

---

## 📋 Estratégia de Perguntas

Fluxo em 3 etapas:

### **Etapa 1: Contexto** (Qual é seu desafio?)
Identifica dor + segmento. Perguntas qualificam o lead.

### **Etapa 2: Diagnóstico** (Como está sua imagem?)
Upload foto + análise baseada em expertise + respostas da etapa 1.

### **Etapa 3: Captura** (Quer o relatório completo?)
Desbloqueia resultado com nome + whatsapp.

---

## 🎯 Perguntas Finais (7 perguntas estratégicas)

### **P1 — Segmento** ⭐ (Define arquétipo esperado)
**Qual melhor descreve seu profissão?**
- [ ] Advogado / Assessor legal
- [ ] Médico / Profissional de saúde
- [ ] Terapeuta / Coach / Consultor
- [ ] Empresário / CEO / Empreendedor
- [ ] Contador / Profissional financeiro
- [ ] Outro

*Lógica:* Cada segmento tem expectativa visual diferente.

---

### **P2 — Nível desejado** 🎯 (Define gap)
**Como você gostaria de ser visto pelos seus clientes?**
- [ ] Executivo sênior / Líder
- [ ] Especialista confiável
- [ ] Parceiro approachable
- [ ] Inovador / Disruptor

*Lógica:* Compara desejo vs. realidade (P5).

---

### **P3 — Frequência foto** ⏰ (Senso urgência)
**Quando foi tirada sua foto de perfil atual?**
- [ ] Menos de 6 meses
- [ ] 6 meses a 1 ano
- [ ] 1 a 2 anos
- [ ] Mais de 2 anos
- [ ] Não tenho foto profissional

*Lógica:* Foto velha = lead mais quente (desatualização = dor).

---

### **P4 — Feedback recebido** 💬 (Consciência da dor)
**Você já recebeu feedback sobre sua imagem?**
- [ ] Sim, negativo (foto me não transmite credibilidade)
- [ ] Sim, positivo (foto transmite confiança)
- [ ] Misto (alguns elogiam, outros não se conectam)
- [ ] Nunca recebi feedback
- [ ] Prefiro não dizer

*Lógica:* Feedback negativo = lead MUITO qualificado.

---

### **P5 — Gap percepção vs realidade** 🎭 (Define oportunidade)
**Sua imagem comunica a competência que você realmente tem?**
- [ ] Sim, comunica bem
- [ ] Parcialmente (alguns veem, outros não)
- [ ] Não, transmite menos do que delivero
- [ ] Nem sei / Nunca pensei nisso

*Lógica:* "Parcialmente" ou "Não" = pain point claro.

---

### **P6 — Objetivo palestra** 🚀 (CTA relevante)
**O que você gostaria de melhorar em sua imagem corporativa?**
- [ ] Parecer mais confiável / Autoridade
- [ ] Rejuvenescer imagem
- [ ] Alinhar visual com novo posicionamento
- [ ] Foto profissional melhorada (qualidade técnica)
- [ ] Tudo acima

*Lógica:* Objetivo específico facilita próximo passo.

---

### **P7 — Disposição ação** 🔥 (Gatilho venda)
**Você estaria aberto a fazer uma sessão de reposicionamento visual?**
- [ ] Sim, em breve (próximos 30 dias)
- [ ] Sim, mas não agora
- [ ] Talvez, dependendo do diagnóstico
- [ ] Não, só curiosidade

*Lógica:* Define urgência pra follow-up.

---

## 📸 Upload + Análise

**O que receber:**
- Arquivo: `jpg/png` (min 800px, max 10MB)
- Instant: Análise template baseado em P1-P7
- Resultado: 6-8 linhas personalizadas

**Análise verifica:**
- Fundo apropriado pro segmento
- Foco / clareza técnica
- Expressão comunica objetivo (P2)
- Profissionalismo vs. approachability
- Recomendação específica (baseado em P6)

---

## 💾 Dados Capturados

```json
{
  "timestamp": "2026-06-30T14:30:00",
  "evento": "BNI Conquista",
  "respostas": {
    "p1_segmento": "Advogado",
    "p2_nivel": "Executivo",
    "p3_frequencia": "Mais de 2 anos",
    "p4_feedback": "Sim, negativo",
    "p5_gap": "Não, transmite menos",
    "p6_objetivo": "Parecer mais confiável",
    "p7_disposicao": "Sim, em breve"
  },
  "foto": "uploads/2026-06-30_14-30_12345.jpg",
  "analise": "...",
  "lead": {
    "nome": "João Silva",
    "whatsapp": "62 99999-9999"
  },
  "score_qualificacao": 95
}
```

**Score:** Calculado por respostas:
- P3 "Mais de 2 anos" = +30 pontos
- P4 "Sim, negativo" = +35 pontos
- P5 "Não, transmite menos" = +20 pontos
- P7 "Sim, em breve" = +15 pontos

---

## 🎨 Design

**Brand:** Seu design system
- Primary: #F5C518 (amarelo)
- Background: #0A0A0A (preto)
- Text: #F0F0EB (branco)
- Font: JOST (300-900)

**Layout:** 1 pergunta por slide + barra de progresso (7/7)

---

## 📁 Estrutura arquivos

```
quiz-visual/
├── README.md               ← Este arquivo
├── index.html             ← Página principal
├── assets/
│   ├── css/
│   │   └── style.css      ← Design system + componentes
│   ├── js/
│   │   ├── quiz.js        ← Lógica quiz
│   │   ├── analyze.js     ← Análise foto
│   │   └── submit.js      ← Captura contato
│   └── img/
│       └── logo.png       ← Seu logo (opcional)
├── data/
│   ├── respostas.json     ← Template respostas
│   └── analises.json      ← Template análises por segmento
├── uploads/               ← Fotos carregadas (local)
└── .env.example           ← Config (API keys, etc)
```

---

## 🚀 Próximas etapas

1. **HTML/CSS** — Quiz visual (7 slides + barra progresso)
2. **JavaScript** — Lógica navegação + validation
3. **Upload** — Drag-drop foto com preview
4. **Análise** — Template rules (P1-P7 → recomendação)
5. **Captura** — Form nome/whatsapp + scoring
6. **Backend** — Webhook → Google Sheets OU email

---

**Pronto pra código?**
