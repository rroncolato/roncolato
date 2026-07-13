# 🎨 Design System — Regra & Padrão para Todos os Projetos

**Versão:** 1.0  
**Criado:** Junho 2026  
**Status:** ✅ Pronto para uso em todos os projetos

---

## 📂 O que você encontra aqui

Este é o **padrão visual único** de Rodrigo Roncolato. Garante consistência, profissionalismo e harmonia em todas as suas propriedades (SITE RONCOLATO, VIDAL, PROTETIC, etc.).

### Arquivos do Design System

| Arquivo | Função | Para quem |
|---------|--------|-----------|
| **`css/design-system.css`** | Variáveis CSS + componentes base | Developers |
| **`DESIGN-SYSTEM-GUIDE.md`** | Guia completo de implementação | Developers + Designers |
| **`COMPONENTS-LIBRARY.html`** | Exemplos visuais prontos para copiar | Developers |
| **`design-system.html`** | Documentação visual interativa | Designers + Revisor |
| **`README-DESIGN-SYSTEM.md`** | Este arquivo — índice e quick start | Todos |

---

## 🚀 Quick Start — 3 passos

### 1️⃣ Importar o CSS

```html
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- Design System (PRIMEIRO!) -->
<link rel="stylesheet" href="/assets/css/design-system.css">
```

### 2️⃣ Usar componentes

```html
<!-- Botão -->
<button class="btn btn-primary">Agendar Sessão</button>

<!-- Card -->
<div class="card card-service">
    <div class="card-number">01</div>
    <div class="card-name">Personal Branding</div>
    <div class="card-desc">Descrição do serviço</div>
</div>

<!-- Grid -->
<div class="grid grid-3 gap-4">...</div>

<!-- Formulário -->
<input type="text" class="form-input" placeholder="Nome">
<textarea class="form-textarea"></textarea>
<button class="btn btn-primary">Enviar</button>
```

### 3️⃣ Usar variáveis CSS

```css
/* Cores */
background: var(--background);
color: var(--foreground);
border: 1px solid var(--border);

/* Espaçamento */
padding: var(--sp-4);     /* 32px */
margin: var(--sp-2);      /* 16px */
gap: var(--sp-3);         /* 24px */

/* Tipografia */
font-size: var(--text-lg);
font-family: var(--font-sans);

/* Motion */
transition: all 0.3s var(--ease2);
```

---

## 🎯 Regras de Ouro

✅ **SEMPRE:**
- Use **variáveis CSS** para cores (nunca `#0A0A0A` hardcoded)
- Use **múltiplos de 8px** para espaçamento (8, 16, 24, 32, 40...)
- Use **Jost** como única fonte (importar Google Fonts)
- Use **componentes padronizados** (`.btn`, `.card`, `.form-*`)
- Importe `design-system.css` **em primeiro lugar**

❌ **NUNCA:**
- Hardcode cores (`#0A0A0A`, `#F5C518`, etc.)
- Use espaçamento fora da grid (15px, 25px, 30px, 35px...)
- Misture fontes diferentes
- Crie componentes novos sem revisar se já existe
- Ignore os breakpoints padrão (480px, 768px, 1200px)

---

## 📚 Documentação Completa

### Para developers iniciantes
👉 Comece por **`DESIGN-SYSTEM-GUIDE.md`**
- Setup de novo projeto
- Como usar cores, tipografia, espaçamento
- Exemplos práticos
- Checklist final

### Para developers avançados
👉 Use **`COMPONENTS-LIBRARY.html`**
- Copie componentes prontos
- Veja estados (hover, active, disabled)
- Entenda a estrutura HTML/CSS

### Para visualizar tudo
👉 Abra **`design-system.html`** no navegador
- Navegação interativa
- Documentação visual completa
- Tokens CSS copiáveis
- Guia de cores, tipografia, ícones

### Para revisar/auditar
👉 Leia **`DESIGN-SYSTEM-GUIDE.md`** + **`design-system.html`**
- Checklist de conformidade
- Padrões esperados
- Variações permitidas

---

## 🎨 Resumo Visual

### Paleta de Cores

| Variável | Cor | Uso |
|----------|-----|-----|
| `--background` | #0A0A0A | Fundo principal |
| `--foreground` | #F0F0EB | Texto principal |
| `--primary` | #F5C518 | Amarelo brand — CTAs |
| `--card` | #242424 | Cards elevados |
| `--border` | #5A5A5A | Bordas, inputs |
| `--muted-foreground` | #7A7A7A | Texto secundário |

### Tipografia

- **Fonte única:** Jost (100–900)
- **Display:** clamp(52px, 8.5vw, 120px) — responsivo
- **Heading:** 32px
- **Body:** 14px
- **Small:** 11px

### Grid System

```
8px base × infinitas combinações

✓ 8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 120px...
✗ Qualquer outro valor
```

### Componentes Principais

- **Botões:** primary, outline, dark, filter
- **Cards:** simples, service (com número), grid
- **Formulários:** input, textarea, select com labels
- **Layout:** grid (auto, 2, 3), flex com gap
- **Tipografia:** h1–h6 com pesos padronizados

---

## 🔄 Fluxo de Trabalho

### Ao criar um novo projeto

1. ✅ Copiar estrutura de pastas
2. ✅ Importar `design-system.css`
3. ✅ Lê o guia (`DESIGN-SYSTEM-GUIDE.md`)
4. ✅ Usar `COMPONENTS-LIBRARY.html` como referência
5. ✅ Estilizar com variáveis (nunca hardcode)

### Ao revisar código

1. ✅ Cores usam `var(--*)`?
2. ✅ Espaçamento é múltiplo de 8?
3. ✅ Fonte é Jost?
4. ✅ Componentes seguem padrão?
5. ✅ Breakpoints respeitam 480/768/1200?

### Ao atualizar o design system

1. ✅ Edite `css/design-system.css`
2. ✅ Atualize `DESIGN-SYSTEM-GUIDE.md`
3. ✅ Atualize `design-system.html` (documentação visual)
4. ✅ Commit e push em TODOS os projetos que o usam

---

## 💡 Exemplos de Uso

### Header simples

```html
<header style="background: var(--background); padding: var(--sp-6);">
    <div class="wrap">
        <h1 style="font-size: var(--text-hero);">Rodrigo Roncolato</h1>
        <p class="text-lg text-muted">Fotografia Corporativa</p>
    </div>
</header>
```

### Seção com cards

```html
<section style="padding: var(--section-padding);">
    <div class="wrap">
        <h2>Serviços</h2>
        <div class="grid grid-3 gap-4">
            <div class="card card-service">
                <div class="card-number">01</div>
                <div class="card-name">Personal Branding</div>
            </div>
            <div class="card card-service">
                <div class="card-number">02</div>
                <div class="card-name">Corporativa</div>
            </div>
            <div class="card card-service">
                <div class="card-number">03</div>
                <div class="card-name">Estratégia</div>
            </div>
        </div>
    </div>
</section>
```

### Formulário de contato

```html
<form style="max-width: 500px;">
    <div class="form-group">
        <label class="form-label">Nome</label>
        <input type="text" class="form-input" required>
    </div>
    <div class="form-group">
        <label class="form-label">E-mail</label>
        <input type="email" class="form-input" required>
    </div>
    <div class="form-group">
        <label class="form-label">Mensagem</label>
        <textarea class="form-textarea" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Enviar</button>
</form>
```

---

## ❓ FAQ

**P: Posso usar cores que não estão no design system?**  
R: Não. Se precisar de uma cor nova, discuta com o time e adicione como variável.

**P: E se o Jost não carregar?**  
R: Sempre carrega (Google Fonts é confiável). Mas tem fallback: `system-ui, -apple-system, sans-serif`.

**P: Posso usar margin: 15px?**  
R: Não. Use `var(--sp-2)` (16px) ou `margin: 16px`. Sempre múltiplos de 8.

**P: Como adiciono um novo componente?**  
R: Teste em um projeto primeiro. Se for reutilizável, adicione ao design-system.css e documente aqui.

**P: Preciso customizar um botão. Como?**  
R: Estenda a classe com CSS custom: `.btn.custom { ... }`. Nunca modifique `.btn` diretamente.

---

## 🔗 Estrutura de Pastas (Recomendada)

```
seu-projeto/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── design-system.css  ← IMPORTAR DAQUI
│   │   │   ├── globals.css        ← Seu CSS customizado
│   │   │   └── components.css     ← Componentes custom
│   │   ├── IMG/
│   │   │   └── ... imagens
│   │   └── design-system.html     ← Ref visual
│   ├── index.html
│   ├── about.html
│   └── contact.html
├── src/
│   └── ... código
└── README.md
```

---

## ✅ Checklist — Antes de publicar

- [ ] `design-system.css` importado (primeiro!)
- [ ] Google Fonts (Jost) importado
- [ ] Todas as cores usam `var(--*)`
- [ ] Espaçamento em múltiplos de 8px
- [ ] Componentes seguem padrão (.btn, .card, .form-*)
- [ ] Teste responsivo (480px, 768px, 1200px)
- [ ] Teste contraste de cores (WCAG AA mínimo)
- [ ] Sem console errors
- [ ] Performance OK (Lighthouse)

---

## 📞 Suporte

**Dúvidas sobre o design system?**
1. Leia `DESIGN-SYSTEM-GUIDE.md`
2. Abra `COMPONENTS-LIBRARY.html` para exemplos
3. Revise `design-system.html` para documentação visual

**Encontrou um bug ou inconsistência?**
- Reporte e atualize os 3 arquivos (CSS, Guia, HTML)

---

## 📈 Roadmap

- [ ] Dark mode automático (futura adição)
- [ ] Biblioteca de ícones SVG (em progresso)
- [ ] Componentes avançados (modal, tooltip, dropdown)
- [ ] Variáveis de espaçamento com CSS Grid
- [ ] Figura Figma do design system (opcional)

---

**Última atualização:** Junho 2026  
**Mantido por:** Rodrigo Roncolato  
**Status:** ✅ Ativo e em uso

---

### 🚀 Comece agora

→ Leia **`DESIGN-SYSTEM-GUIDE.md`** para setup completo  
→ Abra **`COMPONENTS-LIBRARY.html`** para copiar componentes  
→ Visite **`design-system.html`** para documentação visual  

**Dúvidas?** Revise os 3 arquivos acima. A resposta está lá!
