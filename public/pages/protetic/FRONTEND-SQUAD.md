# 🚀 Frontend Squad — Protetic Website

**Documento Técnico | Frontend Team Specifications**

---

## 📋 Overview

Projeto de website premium para Laboratório Protetic com arquitetura modular, design system robusto e performance otimizada.

**Stack:** HTML5 | CSS3 | JavaScript (Vanilla) | AOS.js

---

## 👥 Squad Composition

### Frontend Lead / Architect
**Responsabilidades:**
- [ ] Arquitetura do projeto
- [ ] Design system implementation
- [ ] Code review e quality standards
- [ ] Performance optimization
- [ ] Documentação técnica

**Skills Required:**
- HTML5 semântico avançado
- CSS3 (Grid, Flexbox, animations, gradients)
- JavaScript ES6+
- Responsive design patterns
- Web performance optimization
- Git workflows

---

## 🛠️ Technical Stack

### Core Technologies

```
Frontend:
├─ HTML5 (Semantic markup)
├─ CSS3 (Custom properties, gradients, animations)
├─ JavaScript Vanilla (No framework)
└─ AOS.js (Scroll animations)

Tools:
├─ Git (Version control)
├─ VSCode (IDE)
├─ Chrome DevTools (Debugging)
└─ Lighthouse (Performance)
```

### Design System

**Color Palette:**
```css
Primary:      #090909 (Obsidian)
Accent:       #B8945A (Gold)
Accent Light: #CFA96E (Gold Light)
Accent Dark:  #6E5630 (Gold Dark)
Text:         #E8E4DA (Ivory)
Support:      #7A7A72 (Ash)
Background:   #181818 (Carbon)
```

**Typography:**
```css
Headings:  Cormorant Garamond (serif, 300-700)
Body:      Montserrat (sans-serif, 200-600)
```

**Spacing System (8pt grid):**
```css
xs: 0.5rem  (8px)
sm: 1rem    (16px)
md: 1.5rem  (24px)
lg: 2rem    (32px)
xl: 3rem    (48px)
2xl: 4rem   (64px)
3xl: 6rem   (96px)
```

---

## 📐 Architecture

### File Structure

```
protetic/
├─ index-home-moderno.html (V2 Premium ⭐)
├─ index-home-new.html (V1 Modern)
├─ assets/ (future)
│  ├─ images/
│  ├─ fonts/
│  └─ icons/
└─ docs/
   └─ FRONTEND-SQUAD.md (this file)
```

### Component Hierarchy

```
Header (Fixed Navigation)
  ├─ Logo
  ├─ Nav Links
  └─ CTA Button (glassmorphic)

Hero Section
  ├─ Content Container
  ├─ Eyebrow Label
  ├─ H1 Title
  ├─ Subtitle
  ├─ Description
  ├─ CTA Buttons (Primary + Secondary)
  └─ Scroll Indicator

Sections (Repeating Pattern)
  ├─ Section Header
  │  ├─ Eyebrow
  │  ├─ Title
  │  └─ Description
  ├─ Grid Layouts (1/2/3 cols)
  │  └─ Cards (with gradients, shadows, animations)
  └─ Content Areas

Cards (Modular Components)
  ├─ Glassmorphic Cards
  │  ├─ ::before (top border gradient)
  │  └─ ::after (background radial glow)
  ├─ Gradient Cards (Gold accents)
  │  └─ Pseudo-element overlays
  └─ Hybrid Cards (glass + gradient)

Footer (Fixed)
  ├─ Tagline
  ├─ Copyright
  └─ Contact Info
```

---

## 🎨 Design System Features

### Glassmorphism Effects

**Implementation:**
```css
backdrop-filter: blur(25px-30px);
background: rgba(255,255,255, 0.05-0.15);
border: 1px solid rgba(184, 148, 90, 0.12-0.3);
box-shadow: 0 8px 32px rgba(0,0,0,0.2);
```

**Applied to:**
- Header navigation
- Cards (diferenciais, pilares, steps)
- Buttons (secondary CTA)
- Glass panels

### Gradient System

**Multi-stop Gradients:**
```css
/* Hero background */
135deg, #090909 0%, #0f0f0f 25%, #1a1a1a 50%, #131313 75%, #090909 100%

/* Gold accent cards */
135deg, #D9BD7A 0%, #CFA96E 30%, #B8945A 60%, #6E5630 100%

/* Glassmorphic backgrounds */
135deg, rgba(24,24,24,0.7) 0%, rgba(15,15,15,0.5) 100%
```

### Animation System

**AOS.js Triggers:**
```
fade-up         (opacity + slideUp)
fade-right      (opacity + slideRight)
fade-left       (opacity + slideLeft)
zoom-in         (scale expansion)
```

**Delays:** 0ms, 50ms, 100ms, 150ms, 200ms, 250ms, 300ms, 350ms, 400ms

**Custom Keyframe Animations:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}
```

**Transitions:**
- Fast: 150ms ease-in-out
- Base: 300ms ease-in-out
- Slow: 500ms ease-in-out

### Hover States

**Cards:**
```css
transform: translateY(-8px to -12px);
border-color: rgba(184,148,90, 0.3);
box-shadow: 0 20px 50px rgba(184,148,90, 0.2-0.25);
```

**Buttons:**
```css
Primary:
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(184,148,90, 0.4);

Secondary:
  transform: translateY(-3px);
  border-color: rgba(184,148,90, 0.6);
```

---

## 📱 Responsive Breakpoints

| Device | Width | Columns | Changes |
|--------|-------|---------|---------|
| Mobile | < 768px | 1 | Stacked, reduced padding |
| Tablet | 768-1024px | 2 | Grid adjustments |
| Desktop | > 1024px | 3+ | Full layouts |

**Key Breakpoint Changes:**
- Grids collapse to single column
- Font sizes reduce proportionally
- Padding reduces to var(--spacing-2xl)
- Navigation hides on mobile
- Hero height becomes auto
- Step connectors hide on mobile

---

## ⚡ Performance Targets

| Metric | Target | Priority |
|--------|--------|----------|
| Lighthouse | 90+ | ⭐⭐⭐ |
| LCP | < 2.5s | ⭐⭐⭐ |
| FID | < 100ms | ⭐⭐ |
| CLS | < 0.1 | ⭐⭐ |
| Mobile Score | 95+ | ⭐⭐⭐ |

**Optimization Strategies:**
- Minimal CSS (inline in HTML)
- Deferred AOS.js loading
- No unused fonts or scripts
- Optimized image sizing
- CSS Grid for layout (better than floats)
- Hardware-accelerated animations (transform, opacity)

---

## 🔧 Frontend Skills Required

### Must-Have

- [x] HTML5 semantic markup
- [x] CSS3 (Grid, Flexbox, custom properties)
- [x] Responsive design (mobile-first)
- [x] CSS animations & transitions
- [x] CSS gradients (linear, radial, multi-stop)
- [x] JavaScript DOM manipulation
- [x] Git version control
- [x] Browser DevTools debugging
- [x] Performance optimization basics

### Nice-to-Have

- [ ] SCSS/SASS (CSS preprocessing)
- [ ] JavaScript frameworks (React, Vue)
- [ ] Build tools (Webpack, Vite)
- [ ] Design tools (Figma, Adobe XD)
- [ ] Web performance testing tools
- [ ] Accessibility (WCAG) standards
- [ ] SEO optimization
- [ ] CMS integration (WordPress)

---

## 📋 Development Checklist

### HTML

- [x] Semantic HTML5 structure
- [x] Meta tags (viewport, charset, description)
- [x] Google Fonts links
- [x] AOS library inclusion
- [x] Proper heading hierarchy (H1-H6)
- [x] Image alt texts
- [x] Form accessibility

### CSS

- [x] CSS custom properties (:root)
- [x] Mobile-first responsive design
- [x] Consistent spacing (8pt grid)
- [x] Color system documented
- [x] Typography scale defined
- [x] Animation performance (GPU-accelerated)
- [x] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [x] Print media styles (optional)

### JavaScript

- [x] Vanilla JS (no jQuery)
- [x] ES6+ syntax
- [x] Event delegation
- [x] AOS initialization
- [x] Smooth scroll behavior
- [x] No console errors
- [x] Minimal DOM manipulation

### Testing

- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Mobile (iPhone, Android)
- [ ] Tablet (iPad)
- [ ] Lighthouse audit
- [ ] Performance profiling
- [ ] Accessibility audit

---

## 🚀 Phase 2: WordPress Migration

**Frontend Squad Responsibilities:**
1. HTML structure → WordPress templates (PHP)
2. CSS → WordPress theme (style.css + custom CSS)
3. JavaScript → WordPress enqueue (wp_enqueue_script)
4. Images → WordPress media library
5. Elementor Pro integration (if needed)

**Tools & Frameworks:**
- HelloTheme base
- Elementor Pro (page builder)
- Custom plugin development (if needed)
- Child theme for customization

---

## 📚 Resources & References

### Documentation
- MDN Web Docs (HTML/CSS/JS)
- CSS-Tricks (Advanced CSS)
- AOS.js docs (Scroll animations)
- Google Fonts (Typography)

### Tools
- Chrome DevTools (Debugging)
- Lighthouse (Performance)
- CSS Gradient Generator
- Can I Use (Browser support)

### Best Practices
- Mobile-first development
- Progressive enhancement
- Semantic HTML
- Clean, maintainable CSS
- Accessible code (WCAG 2.1 AA)

---

## 👨‍💻 Code Style Guide

### HTML

```html
<!-- Use semantic elements -->
<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>

<!-- Proper indentation (2 spaces) -->
<div>
  <p>Content</p>
</div>

<!-- Descriptive IDs and classes -->
id="hero-section"
class="card card--premium card--hover"
```

### CSS

```css
/* Use CSS custom properties */
:root {
  --primary-color: #090909;
}

/* Organize with comments */
/* ========== HEADER ========== */

/* Avoid !important; use specificity */
.card:hover { }

/* Use shorthand when appropriate */
margin: 1rem 2rem;
```

### JavaScript

```javascript
// Use const/let, not var
const myElement = document.querySelector('.selector');

// Use arrow functions
array.map(item => item.value);

// Comment complex logic
// Animate card on scroll
```

---

## 🔐 Security Considerations

- [x] No inline scripts (use external files)
- [x] No sensitive data in HTML
- [x] HTTPS required (production)
- [x] Content Security Policy headers
- [x] Regular dependency updates
- [x] No SQL injection (not applicable to static HTML)

---

## 📞 Support & Communication

**Issues/Bugs:** Report with browser, device, and reproduction steps
**Questions:** Review documentation first, then ask
**Suggestions:** Open discussion with team lead
**Code Review:** All changes reviewed before merge

---

**Status:** ✅ Ready for Frontend Implementation
**Last Updated:** 2026-03-30
**Maintainer:** Frontend Lead
