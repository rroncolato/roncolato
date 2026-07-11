# 🗺️ Mapa Visual das Seções — Protetic HOME

**Referência rápida para port ao WordPress Elementor**

---

## 📍 ESTRUTURA GERAL

```
┌─────────────────────────────────────────┐
│           HEADER FIXO                   │
│  Logo + Nav + CTA                       │
├─────────────────────────────────────────┤
│           HERO                          │
│  Tagline + CTA Dual + Scroll Indicator  │
├─────────────────────────────────────────┤
│        QUEM SOMOS                       │
│  [Texto] + [Imagem] + 3 Pilares         │
├─────────────────────────────────────────┤
│       PROPÓSITO/MISSÃO/VISÃO            │
│  3 Cards (PMV) + Manifesto              │
├─────────────────────────────────────────┤
│        DIFERENCIAIS                     │
│  6 Cards Grid (3x2)                     │
├─────────────────────────────────────────┤
│        TECNOLOGIA                       │
│  [Imagem] + [Texto + Specs]             │
├─────────────────────────────────────────┤
│         FLUXO                           │
│  7 Steps Connected (01-07)              │
├─────────────────────────────────────────┤
│         EQUIPE                          │
│  Intro + 4 Stats                        │
├─────────────────────────────────────────┤
│         VALORES                         │
│  4 Cards (2x2)                          │
├─────────────────────────────────────────┤
│        FINAL CTA                        │
│  Headline + CTA Dual                    │
├─────────────────────────────────────────┤
│         FOOTER                          │
│  Tagline + Copyright                    │
└─────────────────────────────────────────┘
```

---

## 1️⃣ HEADER

### Estrutura HTML:
```html
<header>
  <div class="header-container">
    <a href="#" class="logo">Prot<span>etic</span></a>
    <nav>
      <a href="#quem-somos">Quem Somos</a>
      <a href="#diferencial">Diferenciais</a>
      <a href="#fluxo">Processo</a>
      <a href="#valores">Valores</a>
      <a href="#contato" class="cta-button">Contato</a>
    </nav>
  </div>
</header>
```

### CSS Classes:
- `.header-container` — Flexbox container
- `.logo` — Texto + span para destaque cor
- `nav` — Flex horizontal, gap 2rem
- `.cta-button` — Button style

### Elementor Mapping:
```
Section: Header
├── Container
│   ├── Logo (Text Widget)
│   └── Navigation (Text Widget + Links)
│       └── CTA Button (Button Widget)
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Cor de fundo | rgba(#1a2b4d, 0.95) | Elementor > Background |
| Font logo | 1.25rem bold | Elementor > Typography |
| Gap nav | 2rem | Elementor > Spacing |

---

## 2️⃣ HERO

### Estrutura HTML:
```html
<section class="hero">
  <div class="hero-content">
    <div class="hero-eyebrow">Laboratório de Excelência Odontológica</div>
    <h1>Precisão que protege a sua reputação.</h1>
    <div class="hero-subtitle">Estética · Função · Confiança</div>
    <p class="hero-description">...</p>
    <div class="hero-ctas">
      <a href="#contato" class="cta-primary">Iniciar uma Parceria →</a>
      <a href="#diferenciais" class="cta-secondary">Descubra Nossos Diferenciais</a>
    </div>
  </div>
  <div class="scroll-indicator">...</div>
</section>
```

### CSS Classes:
- `.hero` — Full-height section, gradient bg, flexbox center
- `.hero-content` — Max-width 900px, relative z-2
- `.hero-eyebrow` — Small caps, accent color
- `h1` — 3.5rem, 700 weight
- `.cta-primary` / `.cta-secondary` — Button styles

### Animations:
```
hero-content: data-aos="fade-up" (delay 100ms)
scroll-indicator: @keyframes bounce (infinite)
```

### Elementor Mapping:
```
Section: Hero
├── Background: Gradient (linear 135deg)
├── Container (Centered)
│   ├── Eyebrow (Text Widget) — AOS: fade-up
│   ├── H1 (Heading Widget) — AOS: fade-up
│   ├── Subtitle (Text Widget) — AOS: fade-up
│   ├── Description (Text Widget) — AOS: fade-up
│   └── CTA Container (Flex)
│       ├── Button Primary — Hover effect
│       └── Button Secondary — Hover effect
└── Scroll Indicator (Custom HTML)
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Min height | 100vh | Elementor > Height |
| Gradient angle | 135deg | Elementor > Background |
| H1 size | 3.5rem | Elementor > Typography |
| CTA Primary color | #6b8ec1 | Elementor > Color |
| CTA Secondary border | 2px solid | Elementor > Border |

---

## 3️⃣ QUEM SOMOS

### Estrutura HTML:
```html
<section class="quem-somos">
  <div class="container">
    <div class="section-header">...</div>
    
    <div class="quem-somos-content">
      <div class="quem-somos-text">
        <h3>Nascemos da inconformidade...</h3>
        <p>...</p>
      </div>
      <div class="quem-somos-image">🏢 [Foto]</div>
    </div>
    
    <div class="pilares">
      <div class="pilar">
        <h4>Precisão</h4>
        <p>...</p>
      </div>
      <!-- x2 mais -->
    </div>
  </div>
</section>
```

### CSS Classes:
- `.quem-somos` — Background light gray
- `.quem-somos-content` — Grid 1fr 1fr, gap 3rem
- `.quem-somos-image` — Gradient bg, 400px height, border-radius
- `.pilares` — Grid 3 columns
- `.pilar` — Card style (white, shadow, hover lift)

### Animations:
```
Text: data-aos="fade-right"
Image: data-aos="fade-left"
Pilares: data-aos="fade-up" (stagger 100/200/300ms)
```

### Elementor Mapping:
```
Section: Quem Somos
├── Background: Light gray
├── Section Header
│   ├── Eyebrow (Text)
│   ├── Title (Heading)
│   └── Description (Text)
│
├── Content Grid (2 columns)
│   ├── Text Column
│   │   ├── Title (Heading)
│   │   └── Paragraphs (Text)
│   └── Image Column
│       └── Image Widget
│
└── Pilares Grid (3 columns)
    ├── Pilar Card (repeater)
    │   ├── Icon (optional)
    │   ├── Title (Heading)
    │   └── Description (Text)
    ├── Pilar Card
    └── Pilar Card
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Grid cols | 1fr 1fr | Elementor > Columns |
| Image height | 400px | Elementor > Height |
| Pilar bg | white | Elementor > Background |
| Shadow | var(--shadow-md) | Elementor > Shadow |

---

## 4️⃣ PROPÓSITO/MISSÃO/VISÃO

### Estrutura HTML:
```html
<section class="pmv-section">
  <div class="container">
    <div class="section-header">...</div>
    
    <div class="pmv-grid">
      <div class="pmv-card proposito">
        <h3>Propósito</h3>
        <p>...</p>
      </div>
      <div class="pmv-card missao">...</div>
      <div class="pmv-card visao">...</div>
    </div>
    
    <div class="manifesto">
      <blockquote>...</blockquote>
      <div class="manifesto-author">— Manifesto</div>
    </div>
  </div>
</section>
```

### CSS Classes:
- `.pmv-grid` — Grid 3 columns, gap 2rem
- `.pmv-card` — Padding xl, border-radius lg
- `.pmv-card.proposito` — Gradient blue (white text)
- `.pmv-card.missao` — Light bg, border top accent
- `.pmv-card.visao` — Gradient dark (white text)
- `.manifesto` — Gradient container, centered, quote styling

### Animations:
```
Card proposito: data-aos="fade-up" (delay 100ms)
Card missao: data-aos="fade-up" (delay 200ms)
Card visao: data-aos="fade-up" (delay 300ms)
Manifesto: data-aos="zoom-in" (delay 400ms)
```

### Elementor Mapping:
```
Section: PMV
├── Section Header
│
├── PMV Grid (3 columns)
│   ├── Card Proposito (gradient blue)
│   │   ├── Title (Heading)
│   │   └── Content (Text)
│   ├── Card Missao (light with border)
│   │   ├── Title (Heading)
│   │   └── Content (Text)
│   └── Card Visao (gradient dark)
│       ├── Title (Heading)
│       └── Content (Text)
│
└── Manifesto (Gradient section)
    ├── Quote (Text) — Italic
    └── Author (Text) — Small
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Proposito bg | Linear gradient | Elementor > Background |
| Missao border | 2px solid | Elementor > Border |
| Visao bg | Linear gradient | Elementor > Background |
| Manifesto italic | font-style | Elementor > Typography |

---

## 5️⃣ DIFERENCIAIS

### Estrutura HTML:
```html
<section class="diferenciais">
  <div class="container">
    <div class="section-header">...</div>
    <p class="statement">A diferença não está nas máquinas...</p>
    
    <div class="diferenciais-grid">
      <div class="diferencial-card">
        <h3>Fluxo digital completo</h3>
        <p>...</p>
      </div>
      <!-- x5 mais -->
    </div>
  </div>
</section>
```

### CSS Classes:
- `.diferenciais-grid` — Grid 3 columns, gap 2rem
- `.diferencial-card` — White bg, padding xl, shadow md
- Hover: `translateY(-8px)`, border-top accent 4px

### Animations:
```
Cada card: data-aos="fade-up" (stagger 100/150/200/250/300/350ms)
```

### Elementor Mapping:
```
Section: Diferenciais
├── Background: Light gray
├── Section Header
│
├── Statement (Text Widget)
│
└── Cards Grid (3 columns)
    ├── Card 1 (repeater or separate)
    │   ├── Title (Heading)
    │   └── Description (Text)
    ├── Card 2
    ├── Card 3
    ├── Card 4
    ├── Card 5
    └── Card 6
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Grid cols | 3 | Elementor > Columns |
| Card bg | white | Elementor > Background |
| Card shadow | var(--shadow-md) | Elementor > Shadow |
| Hover border | 4px accent | Elementor > Border (on hover) |

---

## 6️⃣ TECNOLOGIA

### Estrutura HTML:
```html
<section class="tecnologia">
  <div class="container">
    <div class="section-header">...</div>
    
    <div class="tech-content">
      <div class="tech-image">🔧 [Imagem]</div>
      <div class="tech-text">
        <h3>Tecnologia não é vitrine...</h3>
        <p>...</p>
        <ul class="tech-specs">
          <li>Sistemas CAD/CAM...</li>
          <!-- x4 mais -->
        </ul>
      </div>
    </div>
  </div>
</section>
```

### CSS Classes:
- `.tech-content` — Grid 1fr 1fr, gap 3rem, order manipulation
- `.tech-image` — Gradient bg, 400px height, border-radius
- `.tech-text` — order: 1 (desktop), order: 2 (mobile)
- `.tech-specs` — List sem bullets, li padding + ::before ✓

### Animations:
```
Image: data-aos="fade-right"
Text: data-aos="fade-left"
```

### Elementor Mapping:
```
Section: Tecnologia
├── Section Header
│
└── Tech Grid (2 columns)
    ├── Image Column (left)
    │   └── Image Widget
    │
    └── Text Column (right)
        ├── Title (Heading)
        ├── Paragraph (Text)
        └── List (Unordered)
            └── Items (Text)
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Grid cols | 1fr 1fr | Elementor > Columns |
| Image height | 400px | Elementor > Height |
| List bullets | none (::before ✓) | Elementor > List style |

---

## 7️⃣ FLUXO

### Estrutura HTML:
```html
<section class="fluxo">
  <div class="container">
    <div class="section-header">...</div>
    
    <div class="fluxo-steps">
      <div class="step">
        <div class="step-number">01</div>
        <div class="step-title">Recebimento & Conferência</div>
        <div class="step-description">...</div>
      </div>
      <!-- x6 mais -->
    </div>
    
    <p class="fluxo-quote">Quando o processo é sério...</p>
  </div>
</section>
```

### CSS Classes:
- `.fluxo-steps` — Grid 7 columns, gap 1rem
- `.step` — White bg, padding lg, shadow md
- `.step::after` — Linha conectora (→) entre steps
- `.step-number` — Accent color, large font
- Desktop: 7 cols, Tablet: 4 cols, Mobile: 2 cols

### Animations:
```
Cada step: data-aos="fade-up" (stagger 50/100/150/200/250/300/350ms)
```

### Elementor Mapping:
```
Section: Fluxo
├── Background: Light gray
├── Section Header
│
├── Steps Grid (7 columns → 4/2 responsive)
│   ├── Step 01 (repeater)
│   │   ├── Number (Text)
│   │   ├── Title (Heading)
│   │   └── Description (Text)
│   ├── Step 02
│   ├── ... (até 07)
│
└── Quote (Text Widget)
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Grid cols | 7 | Elementor > Columns (desktop) |
| Step bg | white | Elementor > Background |
| Connector line | #6b8ec1 | Elementor > Custom CSS |
| Number color | accent | Elementor > Color |

---

## 8️⃣ EQUIPE

### Estrutura HTML:
```html
<section class="equipe">
  <div class="container">
    <div class="section-header">...</div>
    
    <div class="equipe-intro">
      <p>Nossa equipe reúne especialistas...</p>
    </div>
    
    <div class="equipe-stats">
      <div class="stat">
        <div class="stat-value">100%</div>
        <div class="stat-label">Digital</div>
      </div>
      <!-- x3 mais -->
    </div>
  </div>
</section>
```

### CSS Classes:
- `.equipe-stats` — Grid 4 columns, gap 1rem
- `.stat` — Light bg, padding lg, border-radius, centered
- `.stat-value` — Large, accent color, 700 weight
- `.stat-label` — Small, secondary text

### Animations:
```
Cada stat: data-aos="fade-up" (stagger 100/150/200/250ms)
```

### Elementor Mapping:
```
Section: Equipe
├── Section Header
│   ├── Title (Heading)
│   └── Subtitle (Text)
│
├── Intro (Text Widget)
│
└── Stats Grid (4 columns)
    ├── Stat 1
    │   ├── Value (Heading)
    │   └── Label (Text)
    ├── Stat 2
    ├── Stat 3
    └── Stat 4
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Grid cols | 4 | Elementor > Columns |
| Stat bg | light gray | Elementor > Background |
| Value size | 3.5rem | Elementor > Typography |
| Value color | accent | Elementor > Color |

---

## 9️⃣ VALORES

### Estrutura HTML:
```html
<section class="valores">
  <div class="container">
    <div class="section-header">...</div>
    
    <div class="valores-grid">
      <div class="valor-card">
        <h3>Responsabilidade com o seu nome</h3>
        <p>...</p>
      </div>
      <!-- x3 mais -->
    </div>
  </div>
</section>
```

### CSS Classes:
- `.valores-grid` — Grid 2 columns, gap 2rem
- `.valor-card` — White bg, padding xl, border-left 4px accent, shadow
- Hover: elevação

### Animations:
```
Cada card: data-aos="fade-up" (stagger 100/150/200/250ms)
```

### Elementor Mapping:
```
Section: Valores
├── Background: Light gray
├── Section Header
│
└── Values Grid (2 columns)
    ├── Card 1 (repeater)
    │   ├── Title (Heading)
    │   └── Description (Text)
    ├── Card 2
    ├── Card 3
    └── Card 4
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Grid cols | 2 | Elementor > Columns |
| Border-left | 4px | Elementor > Border |
| Border color | accent | Elementor > Color |
| Card bg | white | Elementor > Background |

---

## 🔟 FINAL CTA

### Estrutura HTML:
```html
<section class="final-cta">
  <div class="container">
    <h2>Seu trabalho merece um laboratório...</h2>
    <p>Se você acredita que a escolha...</p>
    
    <div class="final-ctas">
      <a href="..." class="cta-primary">Iniciar uma Parceria →</a>
      <a href="#" class="cta-secondary">Conhecer Nossos Casos</a>
    </div>
  </div>
</section>
```

### CSS Classes:
- `.final-cta` — Gradient dark bg, white text, centered
- `.final-ctas` — Flexbox, gap, flex-wrap

### Animations:
```
H2: data-aos="fade-up"
P: data-aos="fade-up" (delay 100ms)
CTA Primary: data-aos="fade-up" (delay 200ms)
CTA Secondary: data-aos="fade-up" (delay 250ms)
```

### Elementor Mapping:
```
Section: Final CTA
├── Background: Gradient dark
├── Container (centered)
│   ├── Title (Heading)
│   ├── Description (Text)
│   └── CTA Buttons (2)
│       ├── Primary Button
│       └── Secondary Button
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Section bg | Linear gradient | Elementor > Background |
| H2 size | 3.5rem | Elementor > Typography |
| CTA Primary color | accent | Elementor > Color |
| CTA alignment | center | Elementor > Alignment |

---

## 1️⃣1️⃣ FOOTER

### Estrutura HTML:
```html
<footer>
  <div class="container">
    <div class="footer-tagline">Precisão que protege...</div>
    <div class="footer-copy">© 2025 Protetic...</div>
  </div>
</footer>
```

### CSS Classes:
- `footer` — Dark bg, white text, centered
- `.footer-tagline` — Accent color, larger
- `.footer-copy` — Small, dimmed

### Elementor Mapping:
```
Footer Widget (WordPress):
├── Container
│   ├── Tagline (Text)
│   └── Copy (Text)
```

### Customização:
| Item | Atual | Elementor |
|------|-------|-----------|
| Footer bg | primary | Elementor > Background |
| Text color | white | Elementor > Color |

---

## 🎨 RESPONSIVE BREAKPOINTS

### Desktop (1920px+)
```
Header: Full
Hero: Full height
Grids: Original (3-7 cols)
Images: Full size
```

### Tablet (1024px)
```
Header: Compressed
Hero: Adjusted height
Grids: 2 cols max
Images: 80% size
```

### Mobile (768px)
```
Header: Nav hidden
Hero: Min height, larger text
Grids: 1 column
Images: Full width
CTA: Full width buttons
```

---

## 📋 PORTA-RÁPIDA PARA ELEMENTOR

### Checklist por Seção:

**HEADER:**
- [ ] Elementor > Logo + Nav
- [ ] AOS.js no footer custom code
- [ ] Fixed positioning via Elementor

**HERO:**
- [ ] Section com gradient bg
- [ ] H1 (3.5rem, 700w), Subtitle, CTA dual
- [ ] Scroll indicator (custom HTML)

**QUEM SOMOS:**
- [ ] Section header + content grid
- [ ] Image widget + text
- [ ] 3 pilar cards (repeater)

**PMV:**
- [ ] 3 cards (different colors/styles)
- [ ] Manifesto (zoom-in animation)

**DIFERENCIAIS:**
- [ ] 6 cards grid, stagger delays

**TECNOLOGIA:**
- [ ] 2-col grid alternado
- [ ] Checklist (custom list styling)

**FLUXO:**
- [ ] 7 steps grid, responsive
- [ ] Step connectors (CSS custom)

**EQUIPE:**
- [ ] Intro text + 4 stats

**VALORES:**
- [ ] 4 cards, 2-col grid

**FINAL CTA:**
- [ ] Gradient section + dual CTA

**FOOTER:**
- [ ] Copyright + tagline

---

**Próximo passo:** Feedback nesta versão HTML, depois porta seção por seção ao WordPress! 🚀
