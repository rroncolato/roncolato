# ⚡ Squads - Referência Rápida

**Guia rápido de quais squads usar em cada fase da proposta.**

---

## 🎯 Em Uma Linha Por Squad

| Squad | O Que Faz | Quando Usar |
|-------|----------|-----------|
| **Copy Squad** | Escreve textos, headlines, CTAs profissionais | Toda proposta (Fase 3) |
| **Design Squad** | Cria layout, componentes visuais, design system | Toda proposta (Fase 2) |
| **Brand Squad** | Valida identidade visual, tom de voz Roncolato | Toda proposta (Fase 2) |
| **Hormozi Squad** | Define precificação, unit economics, strategy | Toda proposta (Fase 1) |
| **Advisory Board** | Aprovação estratégica, decisões críticas | Propostas de alto valor (>R$50k) |

---

## 🚀 Como Ativar (Exemplos Rápidos)

### FASE 1: Briefing & Pricing
```
@copy-chief diagnose
→ O que precisa o cliente? Qual o problema?

@hormozi-chief business-strategy
→ Como precificar? Qual o valor?
```

### FASE 2: Design & Visual Identity
```
@design-chief create-design-system
→ Layout, componentes, cores

@brand-chief audit-brand-alignment
→ Identidade Roncolato OK? Tom de voz OK?
```

### FASE 3: Copy & Headlines
```
@copy-chief full-copy-project
→ Escreve tudo (será roteado para especialistas)

OU específico:
@copy-chief write-headline        (Capa)
@copy-chief write-sales-letter    (Investimento)
@copy-chief write-offer          (Serviços)
@copy-chief write-email-sequence (CTA)
```

### FASE 4: Integração & Review
```
@design-chief generate-handoff
→ Junta copy + design

@copy-chief critique-copy
→ Revisa tom e clareza
```

### FASE 5: QA Final
```
@design-chief review
@copy-chief review
@brand-chief review
→ Todos checam output (checklist: CHECKLIST_PRE_DEPLOY.md)
```

### FASE 6 (Opcional): Aprovação Estratégica
```
@advisory-board get-founder-counsel
→ Só se cliente é alto valor ou decisão crítica
```

---

## 📊 Copy Squad — Especialistas por Seção

**Se precisar de um específico (não chamar full-copy-project):**

| Seção da Proposta | Especialista | Comando |
|------------------|-------------|---------|
| **CAPA / Headline** | Eugene Schwartz | `@eugene-schwartz write-headline` |
| **Sobre Roncolato** | David Ogilvy | `@david-ogilvy write-offer` |
| **Briefing** | Russell Brunson | `@russell-brunson write-sales-letter` |
| **Solução** | Russell Brunson | `@russell-brunson write-offer` |
| **Investimento (Frame)** | Gary Halbert | `@gary-halbert write-sales-letter` |
| **CTA / Próximos Passos** | Dan Koe | `@dan-koe write-email-sequence` |
| **Revisar Tudo** | Copy Chief | `@copy-chief critique-copy` |

---

## 🎨 Design Squad — Especialistas por Componente

| Componente | Especialista | Foco |
|-----------|-------------|------|
| **Arquitetura Geral** | Design Chief | Orquestração |
| **Design System** | Design Chief | Cores, fonts, spacing |
| **Layout & Wireframe** | Dan Mall | Estrutura |
| **Componentes Reutilizáveis** | Brad Frost (Atomic Design) | Modularização |
| **Visual Hierarchy** | Dave Malouf | Priorização visual |
| **Implementação** | UI Engineer | HTML/CSS |

---

## 🎯 Brand Squad — Validação Roncolato

**Checklist da Brand Squad:**
- [ ] Logo bem posicionado?
- [ ] Cores da paleta Roncolato?
- [ ] Tipografia consistente?
- [ ] Tom de voz direto (sem floreio)?
- [ ] Sem termos proibidos (regras-conteudo.md)?
- [ ] Imagem de autoridade mantida?

---

## 💰 Hormozi Squad — Pricing & Business

**Entradas que precisa:**
- Custo da solução (seu tempo, recursos)
- Valor que entrega ao cliente
- Market comparison
- Termo (única vez vs. recorrente)

**Saídas que vai ter:**
- Preço recomendado (baseado em valor)
- Opções de pacotes (bronze/silver/gold)
- Unit economics (CAC, LTV se aplicável)
- Justificativa do preço

---

## 📋 Checklist Rápido de Squads

Antes de chamar cada squad:

**Chamar Copy Chief?**
- [ ] Tenho briefing do cliente?
- [ ] Tenho design/layout pronto?
- [ ] Tenho referências de tom de voz?

**Chamar Design Chief?**
- [ ] Tenho marca/identidade Roncolato clara?
- [ ] Tenho conteúdo principal pronto?
- [ ] Tenho imagens de qualidade?

**Chamar Brand Chief?**
- [ ] Design está pronto?
- [ ] Copy está pronta?
- [ ] Preciso validar identidade Roncolato?

**Chamar Hormozi Chief?**
- [ ] Tenho escopo/serviços definidos?
- [ ] Tenho ideia do custo?
- [ ] Preciso validar precificação?

**Chamar Advisory Board?**
- [ ] Cliente é estratégico/alto valor?
- [ ] Preciso de validação de strategy?
- [ ] É decisão crítica (pivô, posicionamento)?

---

## ⚡ Modo Turbo (Proposta Rápida)

**Se tiver pressa, faça em 1 dia:**

```
8h00 → @copy-chief diagnose (30min)
8h30 → @design-chief create-design-system (2h)
10h30 → @copy-chief full-copy-project (4h)
14h30 → @design-chief generate-handoff (1h)
15h30 → Revisão manual (1.5h)
17h → Enviada ao cliente! ✅
```

---

## 🔗 Localização dos Squads

```
c:\Users\rodri\Downloads\xquads-squads\
├── copy-squad/
├── design-squad/
├── brand-squad/
├── hormozi-squad/
└── advisory-board/
```

---

## 📚 Documentação Completa

Para detalhes de cada squad, leia:
- **Copy Squad detalhes**: `SQUADS_PARA_PROPOSTAS.md` → Seção Copy Squad
- **Design Squad detalhes**: `SQUADS_PARA_PROPOSTAS.md` → Seção Design Squad
- **Fluxo completo**: `SQUADS_PARA_PROPOSTAS.md` (todo o arquivo)

---

## 🎯 Task + Especialista = Resultado

Exemplo real:

```
@copy-chief full-copy-project
├─ Detecta seção CAPA
│  └─ Route para @eugene-schwartz (Headlines)
│     └─ Task: write-headline
│     └─ Output: 3 headlines + subtítulos
│
├─ Detecta seção SOBRE
│  └─ Route para @david-ogilvy (Brand)
│     └─ Task: write-offer
│     └─ Output: Apresentação profissional
│
├─ Detecta seção INVESTIMENTO
│  └─ Route para @gary-halbert (Sales)
│     └─ Task: write-sales-letter
│     └─ Output: Frame de investimento + CTA
│
└─ Copy Chief revisa tudo
   └─ Task: critique-copy
   └─ Output: Feedback + melhorias
```

---

**Versão 1.0** | Junho 2026 | Roncolato Studio

Próximas: Automação de routing automático + templates de squads-log.md
