# 🎯 SQUADS para Propostas Comerciais - Roncolato Studio

**Integração das xquads especializadas ao processo de criação de propostas comerciais.**

Estrutura: Orquestrador + Especialistas por fase do projeto.

---

## 📋 Visão Geral das Squads Utilizadas

| Squad | Função na Proposta | Agentes Principais |
|-------|-------------------|------------------|
| **Copy Squad** | Redação de textos, headlines, CTAs | Copy Chief, Eugene Schwartz, Gary Halbert |
| **Design Squad** | Identidade visual, diagramação, componentes | Design Chief, Brad Frost, Dan Mall |
| **Brand Squad** | Alinhamento com identidade Roncolato | Brand Chief, David Aaker, Marty Neumeier |
| **Hormozi Squad** | Precificação, estratégia, business model | Hormozi Chief, Pricing Specialist |
| **Advisory Board** | Aprovação final, decisões críticas | Ray Dalio, Charlie Munger, Naval Ravikant |

---

## 🔄 Fluxo Integrado: Squads + Propostas

### **FASE 1: Briefing & Strategy (Semana 1)**

#### 📝 Copy Squad + Hormozi Squad
**Objetivo:** Entender cliente e estruturar oferta

```
@copy-chief → diagnose
  └─ Qual é o problema central do cliente?
  └─ Qual é a transformação esperada?
  └─ Qual é o CTA ideal?

@hormozi-chief → business-strategy
  └─ Unit economics da solução
  └─ Pricing baseada em valor (não custo)
  └─ Modelo de negócio ideal
```

**Deliverable:** 
- Document: Problem Statement + Solution Value Prop
- Pricing Framework (CAC, LTV, margins)
- Headlines candidatas (3 opções)

**Checklist:**
- [ ] Cliente confirmou problema compreendido?
- [ ] Valor proposto quantificado?
- [ ] Preço com justificativa de valor?

---

### **FASE 2: Design & Branding (Semana 1-2)**

#### 🎨 Design Squad + Brand Squad
**Objetivo:** Criar identidade visual da proposta

```
@design-chief → create-design-system
  └─ Layout da proposta
  └─ Componentes visuais
  └─ Paleta de cores (Roncolato)
  └─ Tipografia e spacing

@brand-chief → audit-brand-alignment
  └─ Logo placement
  └─ Tom de voz (regras de conteúdo)
  └─ Consistência com identidade
  └─ Diferenciação visual
```

**Tarefas Específicas:**
- Design da capa (hero)
- Grid de portfólio
- Tabela de preços (visual)
- Componentes de CTA
- Footer com contato

**Deliverable:**
- Design System da Proposta (cores, componentes, tipografia)
- Mockups das principais seções
- Asset library (iconografia, ilustrações)

**Checklist:**
- [ ] Cores seguem paleta Roncolato?
- [ ] Tipografia legível em mobile?
- [ ] Logo bem posicionado?
- [ ] Componentes reutilizáveis?

---

### **FASE 3: Redação & Copy (Semana 2)**

#### ✍️ Copy Squad (Especialistas por seção)
**Objetivo:** Redação persuasiva e profissional

```
@copy-chief → full-copy-project
  └─ Route para especialistas conforme seção

CAPA:
  @eugene-schwartz (Headlines)
  └─ Headline + subtítulo magnético

BRIEFING/SOBRE:
  @david-ogilvy (Brand/Premium Copy)
  └─ Apresentação Roncolato com autoridade

SOLUÇÃO:
  @russell-brunson (Funnel Copy)
  └─ Descrever benefícios em sequência lógica

INVESTIMENTO & CTA:
  @gary-halbert (Sales Letter / Offer)
  └─ Frame de preço como investimento
  └─ CTA irresistível

PRÓXIMOS PASSOS:
  @dan-koe (Personal Brand / Engagement)
  └─ Tone próximo, convidativo, ação clara
```

**Tasks Executáveis:**
```
*write-headline            # Para seção CAPA
*write-sales-letter        # Para INVESTIMENTO
*write-offer              # Para descrição de serviços
*write-email-sequence     # Para próximos passos CTA
*analyze-copy             # Para revisar tom geral
```

**Deliverable:**
- Todas as seções com textos profissionais
- 3 variações de CTA
- Checklist de tom (conforme regras-conteudo.md)

**Checklist (via Regras Roncolato):**
- [ ] Tom direto, concreto, sem floreio?
- [ ] Dados específicos quando aplicável?
- [ ] Sem construções proibidas (não é X, é Y)?
- [ ] Parágrafos como reportagem?
- [ ] CTA conecta com conteúdo entregue?

---

### **FASE 4: Integração & Revisão (Semana 2-3)**

#### 🔀 Design Squad + Copy Squad
**Objetivo:** Combinar design + copy em harmonia

```
@design-chief → generate-handoff
  └─ Implementar copy no layout
  └─ Revisar proporções e fluxo
  └─ Otimizar leitura

@copy-chief → critique-copy
  └─ Revisar consistência
  └─ Validar tom
  └─ Melhorias de clareza
```

**Deliverable:**
- Proposta em HTML/Figma com copy integrado
- Versão de impressão (PDF)
- Responsividade validada (mobile, tablet, desktop)

---

### **FASE 5: Qualidade & Checklist (Semana 3)**

#### ✅ Design Squad + Copy Squad + Brand Squad
**Objetivo:** QA final antes de apresentar ao cliente

```
@design-chief → review (output-quality)
  └─ Alinhamento?
  └─ Legibilidade?
  └─ Espaçamento?
  └─ Imagens otimizadas?

@copy-chief → review (output-quality)
  └─ Erros ortográficos?
  └─ Consistência de tom?
  └─ CTAs funcionam?

@brand-chief → audit
  └─ Identidade visual mantida?
  └─ Tom de voz consistente?
  └─ Logo bem aplicado?
```

**Checklist (Master):** Ver `CHECKLIST_PRE_DEPLOY.md`

**Deliverable:**
- Proposta 100% pronta
- Arquivo em `/projetos/cliente/final/`
- Documentação de aprovações

---

### **FASE 6: Aprovação & Deploy (Semana 3-4)**

#### 🎯 Advisory Board (se necessário)
**Quando ativar:**
- Cliente com orçamento alto (>R$50k)
- Decisão crítica sobre pricing
- Validação de estratégia

```
@ray-dalio (Systems)
  └─ Estratégia do projeto faz sentido?
  └─ Preço reflete valor do sistema?

@charlie-munger (Mental Models)
  └─ Oferta é defensável?
  └─ Modelo de negócio é sustentável?

@naval-ravikant (First Principles)
  └─ Solução resolve problema raiz?
```

**Deliverable:**
- Validação estratégica
- Recomendações finais
- Autorização para deploy

---

## 🗂️ Estrutura de Integração com PROPOSTAS COMERCIAIS

```
PROPOSTAS COMERCIAIS/
│
├── SQUADS_PARA_PROPOSTAS.md        ← Este arquivo
│
├── squads-workflow/                ← Documentos de execução
│   ├── 01-briefing-workflow.md
│   ├── 02-design-workflow.md
│   ├── 03-copy-workflow.md
│   ├── 04-integracao-workflow.md
│   └── 05-checklist-final.md
│
├── projetos/novo-cliente/
│   ├── squads-log.md               ← Registra qual squad foi usado
│   │   # Exemplo:
│   │   # - Fase 1: Copy Chief + Hormozi Chief (diagnose)
│   │   # - Fase 2: Design Chief + Brad Frost (design-system)
│   │   # - Fase 3: Copy Squad (full-copy-project)
│   │
│   ├── v1/
│   │   ├── index.html
│   │   └── assets/
│   │
│   └── final/
│       ├── index.html
│       └── assets/
│
└── squads-reference/               ← Guia rápido dos squads
    ├── copy-squad-routing.md
    ├── design-squad-tasks.md
    └── brand-squad-focus.md
```

---

## 🚀 Quick Start: Ativar Squads para Uma Proposta

### Passo 1: Preparar Brief
```markdown
**Cliente:** Nome
**Serviço:** Tipo (Sessão, Branding, etc)
**Orçamento estimado:** R$ XXX
**Problema do cliente:** ...
**Solução proposta:** ...
**Diferencial Roncolato:** ...
```

### Passo 2: Chamar Squads conforme Fase

**FASE 1 — Briefing:**
```
Ativar: @copy-chief @hormozi-chief
Task: *diagnose
Input: Cliente brief acima
```

**FASE 2 — Design:**
```
Ativar: @design-chief @brand-chief
Task: *create-design-system
Input: Output da Fase 1 + Branding Roncolato
```

**FASE 3 — Copy:**
```
Ativar: @copy-chief
Task: *full-copy-project
Input: Design da Fase 2 + Copy brief
Route: Especialistas por seção
```

**FASE 4 — Integração:**
```
Ativar: @design-chief @copy-chief
Task: *generate-handoff + *critique-copy
Output: Proposta integrada
```

**FASE 5 — QA:**
```
Ativar: Todos os chiefs
Task: *review (output-quality)
Output: Checklist final
```

---

## 📊 Routing Matrix para Propostas

### Copy Squad — Por Seção da Proposta

| Seção | Especialista Principal | Alternativa |
|-------|----------------------|-------------|
| **CAPA / Headline** | Eugene Schwartz | Gary Halbert |
| **SOBRE RONCOLATO** | David Ogilvy | Marty Neumeier (via Brand Squad) |
| **BRIEFING** | Russell Brunson | John Carlton |
| **SOLUÇÃO** | Russell Brunson | Frank Kern |
| **ESCOPO** | Joe Sugarman | David Deutsch |
| **INVESTIMENTO** | Gary Halbert | Dan Kennedy |
| **CTA & Próximos Passos** | Dan Koe | Andre Chaperon |
| **REVISÃO GERAL** | Copy Chief | Eugene Schwartz |

### Design Squad — Por Componente

| Componente | Especialista |
|-----------|-------------|
| **Design System** | Design Chief |
| **Layout & Wireframe** | Dan Mall |
| **Atomic Design / Components** | Brad Frost |
| **Visual Hierarchy** | Dave Malouf |
| **Implementação** | UI Engineer |

---

## 📝 Documento de Registro: squads-log.md

Para cada proposta, manter registro:

```markdown
# Squads Log — [Cliente Name]

## Briefing (Data)
- Squad: Copy + Hormozi
- Chief: Copy Chief, Hormozi Chief
- Task: @diagnose
- Output: Problem Statement + Pricing Framework
- Status: ✅ Completo

## Design (Data)
- Squad: Design + Brand
- Chief: Design Chief, Brand Chief
- Task: @create-design-system
- Output: Design System + Mockups
- Status: ✅ Completo

## Copy (Data)
- Squad: Copy Squad (routing)
- Chief: Copy Chief
- Especialistas: Eugene Schwartz, Gary Halbert, Russell Brunson, Dan Koe
- Task: @full-copy-project
- Output: Copy integrada
- Status: ✅ Completo

## QA (Data)
- Squad: Design + Copy + Brand
- Task: @review (output-quality)
- Checklist: ✅ 100% completo
- Status: ✅ Aprovado

## Observações
[Notas sobre decisões, iterações, feedback]
```

---

## ⚙️ Configuração Local dos Squads

### Pré-requisito
Ter os xquads instalados localmente:
```bash
git clone https://github.com/ohmyjahh/xquads-squads.git
```

### Estrutura em Seu Projeto
```bash
SITE RONCOLATO/
├── PROPOSTAS COMERCIAIS/
│   └── squads-reference/        ← Symlink ou cópia dos xquads
│       ├── copy-squad/
│       ├── design-squad/
│       ├── brand-squad/
│       ├── hormozi-squad/
│       └── advisory-board/
```

### Usando via Claude Code
```bash
/squads copy-chief diagnose
# Ativa a Copy Chief para diagnosticar uma proposta

/squads design-chief create-design-system
# Ativa Design Chief para criar design system

/squads hormozi-chief business-strategy
# Ativa Hormozi para definir precificação
```

---

## 🎯 SLAs de Squads por Fase

| Fase | Squad | Tempo Estimado | Deliverable |
|------|-------|----------------|-------------|
| 1. Briefing | Copy + Hormozi | 2-3 horas | Brief + Framework |
| 2. Design | Design + Brand | 4-6 horas | Design System |
| 3. Copy | Copy Squad | 4-8 horas | Copy integrada |
| 4. Integração | Design + Copy | 2-3 horas | Proposta full |
| 5. QA | Todos | 2-4 horas | Aprovação final |
| **TOTAL** | - | **14-24 horas** | **Proposta pronta** |

---

## 🔐 Boas Práticas

✅ **Faça:**
- Use routing matrix para acelerar decisions
- Registre em squads-log.md cada fase
- Ative Advisory Board para decisões críticas
- Valide output de cada squad antes de prosseguir

❌ **Não Faça:**
- Pule squads só porque o projeto é "simples"
- Use especialista errado (cheque routing matrix)
- Procure integrar sem validação
- Suba proposta sem checklist

---

## 📚 Referência Rápida

**Ativar uma Squad:**
```
@[squad-name]-chief [task]
```

**Exemplos:**
- `@copy-chief diagnose`
- `@design-chief create-design-system`
- `@brand-chief audit-brand-alignment`
- `@hormozi-chief business-strategy`
- `@advisory-board get-founder-counsel`

**Documentação Completa:**
- Squads: `/xquads-squads/[squad-name]/README.md`
- Tasks: `/xquads-squads/[squad-name]/tasks/`
- Agents: `/xquads-squads/[squad-name]/agents/`

---

## 🔗 Links Úteis

- **Squads Dashboard**: https://xquads.vercel.app/xquads
- **Repository**: https://github.com/ohmyjahh/xquads-squads
- **Synkra AIOS**: https://github.com/SynkraAI/aios-core

---

**Versão 1.0** | Junho 2026 | Roncolato Studio

Próximas atualizações:
- [ ] Integração com Claude Code direto
- [ ] Automação de workflows
- [ ] Template de squads-log.md
