# 🎨 DESIGN SYSTEM PADRONIZADO — Leia Primeiro!

> **Sua marca agora tem uma regra visual única para TODOS os projetos**

---

## ✅ O que foi entregue

Transformei seu design system de documentação visual em **sistema reutilizável, padronizado e profissional** para aplicar em:

✓ **SITE RONCOLATO** (este site)  
✓ **VIDAL** (WordPress)  
✓ **PROTETIC** (futuro)  
✓ **Qualquer novo projeto**

---

## 📂 Arquivos Criados (onde estão)

Todos em: `public/assets/`

### 1. **`css/design-system.css`** ⭐ PRINCIPAL
```
O coração do sistema. Contém:
- 10 cores (variáveis CSS)
- Tipografia (Jost única)
- Escala de espaçamento (8px base)
- Componentes padrão (botões, cards, forms)
- Motion & easing
- Utilities (grid, flex, spacing, typography)
```

**Como usar:**
```html
<link rel="stylesheet" href="/assets/css/design-system.css">
```

---

### 2. **`README-DESIGN-SYSTEM.md`** 📖 COMECE AQUI
```
Quick start completo:
- 3 passos para começar
- Resumo visual (cores, tipografia, grid)
- Exemplos de uso prontos
- FAQ
- Checklist antes de publicar
```

📌 **Leia este arquivo PRIMEIRO se você é novo no projeto**

---

### 3. **`DESIGN-SYSTEM-GUIDE.md`** 📚 DOCUMENTAÇÃO COMPLETA
```
Guia profissional para developers:
- Setup de novo projeto
- Como usar cada token
- Padrões de código
- Componentes com exemplos
- Responsividade
- Troubleshooting
```

📌 **Ideal para consultar enquanto codifica**

---

### 4. **`COMPONENTS-LIBRARY.html`** 🎬 VISUAL + COPIAR/COLAR
```
Página HTML com TODOS os componentes:
- Botões (primary, outline, dark, filter)
- Cards (simples, service, grid)
- Formulários completos
- Layout (grid, flex)
- Tipografia e spacing
```

📌 **Abra no navegador: clique, veja, copie!**

---

### 5. **`TEMPLATE-NOVO-PROJETO.html`** 🚀 COMEÇAR NOVO SITE
```
HTML vazio pronto para usar:
- Header com nav
- Seção Hero
- Seção de Serviços (3 cards)
- Seção de Portfólio
- Formulário de contato
- Footer
```

📌 **Copie este arquivo para novos projetos e customize**

---

### 6. **`design-system.html`** 📋 REFERÊNCIA VISUAL
```
(Arquivo que já existia)
Documentação interativa com:
- Navegação sidebar
- Todas as cores
- Tipografia
- Grid system
- Motion
- Ícones SVG
- Tokens CSS copiáveis
```

📌 **Abra para consultar detalhes visuais**

---

## 🎯 Fluxo de Trabalho — Como Usar

### 🆕 **Criando um NOVO projeto?**

1. Copie `TEMPLATE-NOVO-PROJETO.html` como base
2. Importe o CSS:
   ```html
   <link rel="stylesheet" href="/assets/css/design-system.css">
   ```
3. Use as classes padrão:
   ```html
   <button class="btn btn-primary">Enviar</button>
   <div class="card card-service">...</div>
   <div class="grid grid-3 gap-4">...</div>
   ```
4. Consulte `README-DESIGN-SYSTEM.md` se tiver dúvidas

### 🔧 **Atualizando um PROJETO existente?**

1. Adicione o link ao CSS (em primeiro lugar!)
2. Remova estilos conflitantes
3. Migre para classes padrão
4. Use variáveis CSS para cores

### 📖 **Precisa de referência?**

- **Rápido?** → `README-DESIGN-SYSTEM.md`
- **Exemplos?** → Abra `COMPONENTS-LIBRARY.html` no navegador
- **Detalhado?** → `DESIGN-SYSTEM-GUIDE.md`
- **Visual?** → Abra `design-system.html` no navegador

---

## 🎨 Resumo Visual

### **Cores Padrão**

```
Background:  #0A0A0A  (preto escuro)
Foreground:  #F0F0EB  (branco quebrado)
Primary:     #F5C518  (AMARELO BRAND)
Card:        #242424  (cinza escuro)
Border:      #5A5A5A  (cinza médio)
```

→ **Nunca use hardcoded!** Sempre `var(--background)`, `var(--primary)`, etc.

### **Tipografia**

```
Fonte:      Jost (100 a 900)
Display:    clamp(52px, 8.5vw, 120px)  [responsivo]
Heading:    32px
Body:       14px
Small:      11px
```

### **Grid System**

```
Base:       8px
Múltiplos:  8, 16, 24, 32, 40, 48, 64, 80, 96, 120...

Sempre use var(--sp-1) até var(--sp-16)
Nunca use 15px, 25px, 30px, 35px... (fora da grid!)
```

### **Componentes Padrão**

```css
.btn + btn-primary      → CTA principal (amarelo)
.btn + btn-outline      → Secundário (transparente)
.btn + btn-dark         → Máximo contraste
.btn + btn-filter       → Toggles

.card                   → Container padrão
.card-service           → Número + Título + Desc

.form-input             → Inputs
.form-textarea          → Textareas
.form-select            → Selects
.form-label             → Labels

.grid + grid-2/3/auto   → Grids responsivas
.flex + flex-col        → Flexbox
.gap-1/2/3/4            → Espaçamento
```

---

## ✨ Exemplos Rápidos

### Botão
```html
<button class="btn btn-primary">Clique aqui</button>
```

### Card
```html
<div class="card card-service">
    <div class="card-number">01</div>
    <div class="card-name">Meu Serviço</div>
    <div class="card-desc">Descrição do serviço</div>
</div>
```

### Grid de 3 colunas
```html
<div class="grid grid-3 gap-4">
    <div class="card">...</div>
    <div class="card">...</div>
    <div class="card">...</div>
</div>
```

### Formulário
```html
<div class="form-group">
    <label class="form-label">Nome</label>
    <input type="text" class="form-input" placeholder="Seu nome">
</div>
```

### Cores
```css
/* Sempre use variáveis! */
background: var(--background);
color: var(--foreground);
border: 1px solid var(--border);

/* Nunca hardcode! */
/* NÃO FAÇA: background: #0A0A0A; */
```

---

## ⚠️ Regras de Ouro (Não Quebrar!)

### ✅ SEMPRE fazer assim:

```css
/* Cores */
background: var(--background);

/* Espaçamento */
padding: var(--sp-4);      /* 32px */
margin: var(--sp-2);       /* 16px */
gap: 8px;                  /* múltiplo de 8 */

/* Tipografia */
font-size: var(--text-lg);
font-family: var(--font-sans);
```

### ❌ NUNCA fazer assim:

```css
/* Hardcode de cores */
background: #0A0A0A;      /* NÃO! Use var(--background) */
color: #F5C518;            /* NÃO! Use var(--primary) */

/* Espaçamento fora da grid */
padding: 15px;             /* NÃO! Use 16px */
margin: 25px;              /* NÃO! Use 24px */
gap: 10px;                 /* NÃO! Use 8px ou 16px */

/* Fontes diferentes */
font-family: 'Arial';      /* NÃO! Use Jost */
```

---

## 📋 Checklist Antes de Publicar

- [ ] CSS importado (PRIMEIRO lugar!)
- [ ] Google Fonts (Jost) importado
- [ ] Todas as cores usam `var(--*)`
- [ ] Espaçamento em múltiplos de 8px
- [ ] Componentes seguem padrão
- [ ] Teste responsivo (480px, 768px, 1200px)
- [ ] Sem console errors
- [ ] Performance OK

---

## 🆘 Precisa de Ajuda?

### "Como faço X?"
→ Leia `README-DESIGN-SYSTEM.md` (seção rápida) ou `DESIGN-SYSTEM-GUIDE.md` (completo)

### "Qual componente usar?"
→ Abra `COMPONENTS-LIBRARY.html` no navegador

### "Qual a cor exata?"
→ Abra `design-system.html` no navegador

### "Começando um novo projeto?"
→ Copie `TEMPLATE-NOVO-PROJETO.html`

---

## 🚀 Próximos Passos

1. **Leia `README-DESIGN-SYSTEM.md`** (5 min)
2. **Abra `COMPONENTS-LIBRARY.html`** e explore (10 min)
3. **Comece a usar!** Todas as respostas estão nos arquivos acima

---

## 📊 Estrutura de Arquivos

```
public/assets/
├── css/
│   ├── design-system.css       ⭐ TOKENS + COMPONENTES
│   ├── globals.css              (seu CSS customizado)
│   └── components.css            (novos componentes)
├── IMG/
│   └── ... suas imagens
├── README-DESIGN-SYSTEM.md      📖 QUICK START
├── DESIGN-SYSTEM-GUIDE.md       📚 DOCUMENTAÇÃO COMPLETA
├── COMPONENTS-LIBRARY.html      🎬 EXEMPLOS VISUAIS
├── TEMPLATE-NOVO-PROJETO.html   🚀 MODELO PRONTO
├── design-system.html            📋 REFERÊNCIA VISUAL
└── LEIA-PRIMEIRO.md              👈 ESTE ARQUIVO
```

---

## ✨ Benefícios

✓ **Consistência** — Mesmas cores, tipografia, spacing em todos os projetos  
✓ **Velocidade** — Copie componentes prontos  
✓ **Manutenção** — Atualize uma vez, mude em tudo  
✓ **Profissionalismo** — Design coeso e refinado  
✓ **Reusabilidade** — Template pronto para novos sites  
✓ **Escalabilidade** — Sistema cresce com você  

---

## 📝 Notas Importantes

- **Jost é obrigatória** — Importar Google Fonts sempre
- **Design System primeiro** — Importar `design-system.css` antes de outros CSSs
- **Variáveis CSS** — Nunca hardcode cores
- **8px Grid** — Todos os tamanhos devem ser múltiplos de 8
- **Componentes padrão** — Use `.btn`, `.card`, `.form-*` já existentes

---

## 🎯 Seu Próximo Passo

### 👉 **Leia `README-DESIGN-SYSTEM.md` (5 min de leitura)**

Tudo está ali: setup, exemplos, dúvidas frequentes, checklist.

**Depois:** Explore `COMPONENTS-LIBRARY.html` (abra no navegador)

**Depois:** Use em seus projetos!

---

**Versão:** 1.0  
**Data:** Junho 2026  
**Criado por:** Rodrigo Roncolato  
**Status:** ✅ Pronto para uso imediato

---

## 💬 Resumo em uma frase

> **Seu design system agora é uma regra única de cores, tipografia e componentes que se repete em todos os projetos — copie, cole, customize, publicar!**

---

**Comece agora! 👇**

→ **Abra: `README-DESIGN-SYSTEM.md`**
