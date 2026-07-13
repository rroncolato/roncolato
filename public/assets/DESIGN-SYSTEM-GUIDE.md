# Design System — Guia de Implementação

**Versão:** 1.0  
**Última atualização:** Junho 2026  
**Autor:** Rodrigo Roncolato

---

## 📋 Visão Geral

Este é o **padrão visual único** para todos os projetos de Rodrigo Roncolato (SITE RONCOLATO, VIDAL, PROTETIC, etc.). Garante consistência, profissionalismo e harmonia visual em toda a marca.

### Pilares do Design System

1. **Paleta de cores** — Dark (#0A0A0A) + Amarelo (#F5C518)
2. **Tipografia** — Apenas Jost (100–900)
3. **8px Grid System** — Todos os tamanhos são múltiplos de 8
4. **Componentes reutilizáveis** — Botões, cards, formulários padronizados
5. **Motion & easing** — Transições suaves e previsíveis

---

## 🚀 Começar Novo Projeto

### 1. Copiar estrutura de pastas

```
seu-projeto/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── design-system.css  ← IMPORTAR DAQUI
│   │   │   └── globals.css
│   │   └── IMG/
│   └── index.html
└── src/
```

### 2. Importar o CSS no HTML

**Sempre como PRIMEIRA stylesheet:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Google Fonts - JOST -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Design System (PRIMEIRO) -->
    <link rel="stylesheet" href="/assets/css/design-system.css">
    
    <!-- Seu CSS custom (DEPOIS) -->
    <link rel="stylesheet" href="/assets/css/custom.css">
</head>
<body>
    ...
</body>
</html>
```

---

## 🎨 Usando Cores

Nunca use valores hardcoded! Use sempre as variáveis CSS:

```css
/* ✓ CORRETO */
.header {
    background: var(--background);
    color: var(--foreground);
    border: 1px solid var(--border);
}

/* ✗ ERRADO */
.header {
    background: #0A0A0A;
    color: #F0F0EB;
    border: 1px solid #5A5A5A;
}
```

### Tokens de cor disponíveis

| Variável | Uso | Exemplo |
|----------|-----|---------|
| `--background` | Fundo principal | Fundo de página, overlays |
| `--foreground` | Texto principal | Headings, body text |
| `--primary` | Amarelo brand | CTAs, highlights, accent |
| `--primary-foreground` | Texto sobre amarelo | Botões primários |
| `--card` | Superfícies elevadas | Cards, containers |
| `--muted` | Hover/depth | Estados hover, backgrounds secundários |
| `--border` | Bordas/separadores | Linhas, inputs |
| `--muted-foreground` | Texto secundário | Descrições, meta info |
| `--destructive` | Erros/alertas | Mensagens de erro |

### Escala de Cinzas (alternativa)

Se precisar de cinzas específicas:

```css
--gray-1: #111111  /* Mais escuro */
--gray-2: #1a1a1a
--gray-3: #242424
--gray-4: #404040
--gray-5: #7a7a7a
--gray-6: #b0b0a8  /* Mais claro */
```

---

## 📏 8px Grid System

**REGRA DE OURO:** Todos os tamanhos devem ser múltiplos de 8px.

```css
/* ✓ CORRETO */
padding: 16px 24px;        /* 2× e 3× de 8px */
margin-bottom: 32px;       /* 4× de 8px */
gap: 8px;                  /* 1× de 8px */
width: 200px;              /* 25× de 8px */

/* ✗ ERRADO */
padding: 15px 25px;        /* Não é múltiplo de 8 */
margin-bottom: 30px;       /* Não é múltiplo de 8 */
gap: 10px;                 /* Não é múltiplo de 8 */
```

### Escala de espaçamento

Use as variáveis pré-definidas:

```css
--sp-1: 8px
--sp-2: 16px
--sp-3: 24px
--sp-4: 32px
--sp-5: 40px
--sp-6: 48px
--sp-8: 64px
--sp-10: 80px
--sp-12: 96px
--sp-15: 120px
--sp-16: 128px
```

**Exemplo:**

```css
.card {
    padding: var(--sp-4);    /* 32px */
    margin-bottom: var(--sp-5); /* 40px */
    gap: var(--sp-2);        /* 16px */
}
```

---

## 🔤 Tipografia

**Única fonte:** Jost (sem alternativas!)

### Tamanhos padrão

| Variável | Tamanho | Uso |
|----------|---------|-----|
| `--text-xs` | 9px | Labels, badges |
| `--text-sm` | 11px | Meta info, small UI |
| `--text-base` | 14px | Body text padrão |
| `--text-lg` | 17px | Card titles |
| `--text-xl` | 22px | Subtítulos |
| `--text-2xl` | 32px | Headings (h2) |
| `--text-3xl` | clamp(40px, 6vw, 96px) | Headings (h1) |
| `--text-hero` | clamp(52px, 8.5vw, 120px) | Hero headlines |

**Exemplo:**

```html
<h1 style="font-size: var(--text-hero);">Fotografia Corporativa</h1>
<h2 style="font-size: var(--text-2xl);">Serviços</h2>
<p style="font-size: var(--text-base);">Texto principal do site</p>
<small style="font-size: var(--text-sm);">Meta informação</small>
```

### Weights disponíveis em Jost

```css
font-weight: 100;  /* Thin */
font-weight: 300;  /* Light (padrão para body) */
font-weight: 600;  /* Semibold */
font-weight: 700;  /* Bold (padrão para headings) */
font-weight: 900;  /* Black (display, hero) */
```

---

## 🔘 Componentes Padrão

### Botões

Sempre use as classes `.btn` + variante:

```html
<!-- Primary (CTA principal) -->
<button class="btn btn-primary">Agendar Sessão</button>

<!-- Outline (secundário) -->
<button class="btn btn-outline">Saiba Mais</button>

<!-- Dark (contraste máximo) -->
<button class="btn btn-dark">Ver Portfolio</button>

<!-- Filter (toggles) -->
<button class="btn btn-filter active">Todos</button>
<button class="btn btn-filter">Portfólio</button>
```

**CSS customizável:**

```css
.btn {
    padding: 10px 24px;           /* Padrão */
    font-size: var(--text-sm);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}
```

### Cards

```html
<div class="card">
    <h3 class="card-name">Personal Branding</h3>
    <p class="card-desc">Fotografia corporativa que vende sua marca pessoal</p>
</div>

<!-- Service card com número -->
<div class="card card-service">
    <div class="card-number">01</div>
    <div class="card-name">Personal Branding</div>
    <div class="card-desc">Descrição do serviço</div>
</div>
```

### Formulários

```html
<div class="form-group">
    <label class="form-label">Nome Completo</label>
    <input type="text" class="form-input" placeholder="Seu nome aqui">
</div>

<div class="form-group">
    <label class="form-label">Mensagem</label>
    <textarea class="form-textarea" placeholder="Sua mensagem..."></textarea>
</div>

<div class="form-group">
    <label class="form-label">Tipo de Sessão</label>
    <select class="form-select">
        <option>Personal Branding</option>
        <option>Corporativa</option>
    </select>
</div>
```

---

## 🎬 Motion & Animação

### Easing functions padrão

```css
/* Smooth, suave (scroll reveals, fade-ins) */
transition: all 0.3s var(--ease);

/* Sharp, snappy (hovers, cursor growth) */
transition: all 0.3s var(--ease2);
```

### Durations padrão

```css
--duration-fast: 0.2s      /* Mudanças rápidas (focus, hover) */
--duration-normal: 0.3s    /* Transições padrão (fade, slide) */
--duration-slow: 0.5s      /* Animações importantes (reveal, expand) */
```

**Exemplo:**

```css
.card {
    transition: all var(--duration-normal) var(--ease2);
}

.card:hover {
    background: var(--muted);
    border-color: var(--primary);
}
```

---

## 🔌 Utility Classes

O design system já inclui classes úteis:

### Layout

```html
<!-- Flexbox -->
<div class="flex gap-2">...</div>
<div class="flex flex-col gap-4">...</div>
<div class="flex flex-center">...</div>

<!-- Grid -->
<div class="grid grid-auto gap-4">...</div>
<div class="grid grid-2 gap-4">...</div>
<div class="grid grid-3 gap-4">...</div>
```

### Espaçamento

```html
<!-- Padding -->
<div class="p-1">8px padding</div>
<div class="p-4">32px padding</div>

<!-- Margin -->
<div class="m-2">16px margin</div>
<div class="mb-3">24px margin-bottom</div>
<div class="mt-4">32px margin-top</div>

<!-- Gap -->
<div class="flex gap-2">16px gap</div>
```

### Tipografia

```html
<p class="text-sm text-muted">Texto pequeno e cinzento</p>
<h3 class="text-xl text-primary">Título médio em amarelo</h3>
<span class="text-xs font-900">Labels em peso 900</span>
```

### Cores de texto

```html
<p class="text-primary">Amarelo brand</p>
<p class="text-muted">Texto secundário</p>
<p class="text-center">Centralizado</p>
```

---

## ✅ Checklist para novo projeto

- [ ] Importar `design-system.css` primeiro
- [ ] Importar Google Fonts (Jost)
- [ ] Usar variáveis CSS para cores (nunca hardcoded)
- [ ] Espaçamento sempre em múltiplos de 8px
- [ ] Botões com classes `.btn` + variante
- [ ] Tipografia com `--text-*` variables
- [ ] Motion com `--ease` e `--duration-*`
- [ ] Testar responsividade (480px, 768px, 1200px)
- [ ] Revisar contraste de cores (WCAG AA)

---

## 📱 Breakpoints padrão

```css
/* Desktop */
@media (min-width: 1200px) { }

/* Tablet */
@media (max-width: 1200px) { }

/* Tablet pequeno */
@media (max-width: 768px) { }

/* Mobile */
@media (max-width: 480px) { }
```

**Exemplo:**

```css
.grid-3 {
    grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
    .grid-3 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .grid-3 {
        grid-template-columns: 1fr;
    }
}
```

---

## 🎯 Exemplo Completo — Nova Página

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Projeto</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Design System -->
    <link rel="stylesheet" href="/assets/css/design-system.css">
</head>
<body>
    <!-- Header -->
    <header style="background: var(--background); padding: var(--sp-6);">
        <div class="wrap">
            <h1 class="text-hero">Bem-vindo</h1>
        </div>
    </header>

    <!-- Hero Section -->
    <section style="padding: var(--section-padding);">
        <div class="wrap">
            <h2>Nossos Serviços</h2>
            <div class="grid grid-3 gap-4">
                <div class="card card-service">
                    <div class="card-number">01</div>
                    <div class="card-name">Branding</div>
                    <div class="card-desc">Identidade visual completa</div>
                </div>
                <div class="card card-service">
                    <div class="card-number">02</div>
                    <div class="card-name">Fotografia</div>
                    <div class="card-desc">Sessões corporativas</div>
                </div>
                <div class="card card-service">
                    <div class="card-number">03</div>
                    <div class="card-name">Estratégia</div>
                    <div class="card-desc">Consultoria visual</div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section style="padding: var(--section-padding); background: var(--card); text-align: center;">
        <div class="wrap">
            <h2>Pronto para começar?</h2>
            <p class="text-lg mb-4">Agende sua sessão hoje</p>
            <button class="btn btn-primary">Agendar Sessão</button>
        </div>
    </section>
</body>
</html>
```

---

## 📚 Arquivos do Design System

```
public/assets/
├── css/
│   ├── design-system.css      ← Tokens + componentes base
│   └── globals.css            ← Overrides específicos do projeto
├── IMG/                        ← Imagens
├── design-system.html         ← Documentação visual (página)
└── DESIGN-SYSTEM-GUIDE.md     ← Este arquivo
```

---

## 🔄 Atualizações do Design System

Se você mudar um token ou adicionar um componente:

1. **Atualize `design-system.css`**
2. **Atualize este guia (DESIGN-SYSTEM-GUIDE.md)**
3. **Atualize `design-system.html`** (documentação visual)
4. **Commit em todos os projetos** que usam o design system

---

## 💡 Dúvidas Frequentes

**P: E se eu precisar de uma cor diferente?**  
R: Sempre prefira usar uma variável existente. Se realmente precisar, crie uma variável custom em seu `globals.css`, mas documente por que.

**P: Posso usar `padding: 15px`?**  
R: Não. Sempre use múltiplos de 8. Use `padding: 16px` ou `padding: var(--sp-2)`.

**P: E se a fonte Jost não carregar?**  
R: O fallback é `system-ui, -apple-system, sans-serif`. Mas Jost é obrigatória — sempre implemente o Google Fonts.

**P: Como adiciono um novo componente ao design system?**  
R: Teste-o em seu projeto primeiro, depois considere adicionar ao design system oficial se puder ser reutilizado em outros projetos.

---

**Versão:** 1.0  
**Data:** Junho 2026  
**Criado por:** Rodrigo Roncolato
