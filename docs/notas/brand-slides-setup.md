# Brand Presentation Setup

## Repos Clonados

```
SITE RONCOLATO/
├── WebSlides/        ← Design limpo. Perfeito pra brand identity
├── reveal.js/        ← Power + flexibilidade. Animações avançadas
└── caveman/          ← Token compression pra documentação
```

## Quick Start

### WebSlides (Design-First) 
**Para:** Brand identity, case studies, portfolio showcases

```bash
cd WebSlides
npm install
npm start
# Open: http://localhost:8080
```

Template: `index.html` — edita direto. Componentes prontos:
- `.slide` — full screen
- `.card` — conteúdo + imagem
- `.bg-image` — hero com fundo
- `.text-landing` — landing page
- Transições automáticas

**Themes:** `static/css/` — tema dark/light pronto

### reveal.js (Power-First)
**Para:** Pitch decks, tech talks, detailed presentations

```bash
cd reveal.js
npm install
npm start
# Open: http://localhost:8000
```

Demo: `demo.html` — vê tudo que é possível
- Fragments (reveal one by one)
- Code highlighting
- Speaker notes
- PDF export
- Vertical slides

## Brand Customization

### Color Palette (seu design system)
Edit `WebSlides/static/css/custom.css`:
```css
:root {
  --primary: #F5C518;      /* Amarelo brand */
  --bg: #0A0A0A;           /* Preto */
  --text: #F0F0EB;         /* Branco */
}
```

### Fonts
Usa JOST (do seu design system). Adiciona em ambos:
```html
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300..900&display=swap" rel="stylesheet">
```

## Workflow

1. **Criar slide:**
   - WebSlides → arquivo `.html`
   - reveal.js → arquivo `.md` (converte auto)

2. **Export PDF:**
   - reveal.js: Press `E` key → PDF
   - WebSlides: Print → Save as PDF

3. **Shared:** `/proposta/` folder — deploy Vercel

## Next Steps

- [ ] Customizar cores do seu design system
- [ ] Criar template brand (exemplo: case study slide)
- [ ] Setup CI pra auto-export PDFs
- [ ] Link com Notion pra gerenciar propostas

