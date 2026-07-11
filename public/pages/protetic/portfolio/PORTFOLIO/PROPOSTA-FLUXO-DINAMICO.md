# 🚀 PROPOSTA: SEÇÃO "NOSSO FLUXO" — LAYOUT MAIS DINÂMICO

**Data:** 2026-04-07  
**Status:** Proposta para aprovação  
**Seção:** #processo ("Nosso Fluxo - Do recebimento à entrega perfeita")

---

## 📊 ANÁLISE DO LAYOUT ATUAL

### Estrutura Existente
```
Título: "Nosso fluxo"
Subtítulo: "Do recebimento à entrega perfeita"

7 Steps em GRID 7 COLUNAS:
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ 01  │ 02  │ 03  │ 04  │ 05  │ 06  │ 07  │
│Rec. │Plan │Prod │Acab │Insp │Ent. │Pós  │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
  Conector linear horizontal (1px gold)
```

### Problemas Identificados
- ⚠️ **Muito linear** — Fluxo horizontal cansativo
- ⚠️ **Pouco destaque** — Cada step com mesmo visual
- ⚠️ **Estático** — Sem interatividade
- ⚠️ **Mobile quebrado** — Vira 4 colunas em tablet, 2 em mobile (muito apertado)
- ⚠️ **Sem hierarquia visual** — Todos os passos parecem iguais em importância

---

## 💡 PROPOSTAS DE MELHORIA (3 OPÇÕES)

### OPÇÃO 1: Timeline Vertical Animada ⭐ (RECOMENDADO)
```
           NOSSO FLUXO

01         Recebimento & Conferência
           Descrição com mais destaque...
           
           ╱───╲
          │  →  │
           ╲───╱

02         Planejamento Digital  
           Descrição com mais destaque...

           ╱───╲
          │  →  │
           ╲───╱

03         Produção de Precisão
           ...

[Timeline vertical com bolas animadas que "caem" ao scroll]
```

**Benefícios:**
- ✅ Mais dinâmico e moderno
- ✅ Leitura top-to-bottom natural
- ✅ Responsivo em mobile
- ✅ Espaço para mais descrição
- ✅ Efeito visual interessante (bolas animadas)

**CSS Necessário:**
- Timeline vertical com ::before connecting line
- Circles com hover effects
- Staggered animations ao scroll (AOS)
- Descriptions que expandem/collapse ou revelam-se

---

### OPÇÃO 2: 3-Column Staggered Grid + Connecting Lines
```
01                    02                    03
Recebimento           Planejamento          Produção
Descrição             Descrição             Descrição

      ╱───→───┐       ┌───→───╲
      │        ↓       ↓        │
      
04                    05                    06
Acabamento            Inspeção              Entrega
Descrição             Descrição             Descrição

      ┌───→───┐       ┌───→───┐
      ↓                       ↓
      
07
Pós-Entrega
```

**Benefícios:**
- ✅ Mais dinâmico que linear
- ✅ Usa space de forma inteligente
- ✅ Conectores visuais interessantes
- ✅ Bom em tablet/desktop

---

### OPÇÃO 3: Circular/Radial Flow
```
              01
          RECEBIMENTO
        ╱─────────────╲
    07            02
 PÓS-ENT.    PLANEJAM.
    │  ╲    ╱  │
    │   ╲  ╱   │
    │    ╱╲    │
    │  ╱    ╲  │
   06╱        ╲03
  ENTREGA   PRODUÇÃO
     │ ╲    ╱  │
     │  ╲  ╱   │
     │   ╱╲    │
     │  ╱  ╲   │
    05       04
  INSPEÇÃO ACABAM.
```

**Benefícios:**
- ✅ Muito visual/premium
- ✅ Demonstra ciclo contínuo
- ⚠️ Complexo em mobile

---

## 🎯 RECOMENDAÇÃO: OPÇÃO 1 (Timeline Vertical Animada)

**Motivos:**
1. **Mais dinâmico** — Animations ao scroll deixam vivo
2. **Melhor UX** — Leitura natural top-to-bottom
3. **Responsivo** — Funciona perfeitamente mobile
4. **Premium** — Efeito visual sofisticado
5. **Texto** — Espaço para descrições mais ricas

---

## 🎨 VISUAL ESPERADO (Opção 1)

### Desktop (Full)
```
      NOSSO FLUXO
   Do recebimento à entrega perfeita

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   ⭕  01 — RECEBIMENTO & CONFERÊNCIA
       Cada caso registrado com rastreabilidade 
       total desde o primeiro contato
       
       ↓ (animated connector)
       
   ⭕  02 — PLANEJAMENTO DIGITAL
       Estrutura digital que respeita anatomia,
       função e a visão do dentista
       
       ↓ (animated connector)
       
   ⭕  03 — PRODUÇÃO DE PRECISÃO
       Fresagem ou impressão 3D com materiais
       selecionados e controlados
       
       [... continua ...]
       
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   "Quando o processo é sério, o resultado 
    deixa de ser uma aposta..."
```

### Tablet (Responsivo)
```
Mesma estrutura, mas com menos padding lateral
Circles ficam menores (80px → 64px)
Descrições com font-size menor
```

### Mobile (Stack)
```
Linha vertical fica em centro
Circles alternam esquerda/direita (zig-zag visual)
Descrições lado único
Muito bonito e clean
```

---

## 🛠️ SQUADS NECESSÁRIOS

### 1. **FRONTEND SQUAD** (Primário)
**Responsável:** HTML/CSS/JS para nova layout

**Tasks:**
- [ ] Refatorar .proc-tl de grid 7-col para flex-column (timeline vertical)
- [ ] Criar ::before connecting lines animadas
- [ ] Implementar hover states para circles
- [ ] Adicionar AOS animations (fade-in staggered)
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Otimizar performance (GPU acceleration)

**Skills:**
- CSS Grid/Flexbox avançado
- CSS animations & transitions
- JavaScript (optional for interactivity)
- AOS.js integration
- Mobile-first responsive design

**Estimativa:** 3-4 horas

---

### 2. **DESIGN SQUAD** (Secundário)
**Responsável:** Aprovação de visual + refinement

**Tasks:**
- [ ] Revisar mockup da nova timeline
- [ ] Definir cores das circles (gold? gradient?)
- [ ] Propor efeitos hover interessantes
- [ ] Validar spacing/proportions
- [ ] Sugerir ícones/badges para cada passo (optional)

**Deliverables:**
- Figma mockup da nova seção
- Design specs (sizes, colors, animations)
- Ícones SVG (se necessário)

**Estimativa:** 2 horas

---

### 3. **QA/TESTING SQUAD** (Suporte)
**Responsável:** Validação visual + funcionalidade

**Tasks:**
- [ ] Testar em browsers (Chrome, Firefox, Safari, Edge)
- [ ] Testar em devices (iPhone, Android, iPad, Desktop)
- [ ] Validar animations performance
- [ ] Check accessibility (WCAG)
- [ ] Lighthouse audit

**Estimativa:** 2 horas

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Design & Planejamento (2h)
- [ ] Design Squad cria mockup Figma
- [ ] Aprovação visual com stakeholder
- [ ] Frontend Squad analisa specs

### Fase 2: Frontend Implementation (4h)
- [ ] HTML refactoring (timeline structure)
- [ ] CSS styling (circles, lines, spacing)
- [ ] Animations (AOS integration)
- [ ] Responsividade (media queries)

### Fase 3: QA & Refinement (2h)
- [ ] Cross-browser testing
- [ ] Device testing
- [ ] Performance optimization
- [ ] Bug fixes

### Fase 4: Deploy (0.5h)
- [ ] Final approval
- [ ] Git commit + push
- [ ] Live on production

**Total Estimado:** ~8.5 horas (1 dia de trabalho)

---

## 🎨 CONCEITO FINAL

A nova seção "Nosso Fluxo" será:
- ✅ **Visualmente atrativa** — Timeline vertical com circles animadas
- ✅ **Interativa** — Hover states + AOS animations ao scroll
- ✅ **Responsiva** — Perfeita em mobile/tablet/desktop
- ✅ **Informativa** — Mais espaço para descrições ricas
- ✅ **Premium** — Efeito visual sofisticado que diferencia
- ✅ **Acessível** — Semântica HTML + WCAG compliance

---

## ✅ PRÓXIMAS AÇÕES

1. **Aprovar proposta** — Qual opção (1, 2 ou 3)?
2. **Chamar Design Squad** — Criar mockup
3. **Chamar Frontend Squad** — Implementar
4. **Chamar QA Squad** — Validar

---

**Proposta criada por:** Claude Code  
**Status:** Aguardando aprovação
**Contato:** Chamar squads conforme decisão
