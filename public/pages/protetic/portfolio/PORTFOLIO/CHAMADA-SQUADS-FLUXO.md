# 📢 CHAMADA DE SQUADS — SEÇÃO "NOSSO FLUXO"

**Projeto:** Redesign da seção "Nosso Fluxo" — Layout mais dinâmico e interessante  
**Data:** 2026-04-07  
**Duração Estimada:** 8-10 horas (1 dia full)  
**Prioridade:** ⭐⭐⭐ Alta  
**Cliente:** Protetic Laboratory

---

## 🎯 OBJETIVO

Transformar a seção "Nosso Fluxo" de um **timeline linear horizontal** para uma **timeline vertical dinâmica** com:
- ✅ Animações ao scroll
- ✅ Design mais premium
- ✅ Melhor responsividade mobile
- ✅ Interatividade (hovers, efeitos visuais)

---

## 👥 SQUADS CHAMADOS

### 1️⃣ DESIGN SQUAD 🎨

**Lead:** [Designer Principal]  
**Duração:** 2-3 horas  
**Deadline:** Hoje até 14h

#### Responsabilidades:
```
☐ Criar mockup Figma da timeline vertical
☐ Definir:
  - Tamanho das circles (timeline points)
  - Cores (gold gradient? dual-color?)
  - Altura entre circles (spacing)
  - Connecting line style
  - Hover effects (scale? glow? color shift?)
  
☐ Design mobile version (zig-zag layout)

☐ Especificar animações:
  - Fade-in timing
  - Scale effects
  - Rotation effects (optional)
  - Stagger delays (100ms-200ms entre steps)

☐ Exportar:
  - 2-3 design variations
  - Component breakdown
  - Color specs (#hex ou RGB)
  - Animation specs (duration, easing)
  - Ícones SVG (se aprovar usar ícones)
```

#### Deliverables:
1. Figma file com 3 variations
2. Design system specs (CSS)
3. Mobile/tablet/desktop breakdowns
4. Animation reference (video or Lottie)

#### Reference Design:
- **Inspiration:** Figma timeline components, Material Design spinners, Dribbble timeline designs
- **Style:** Premium, smooth, gold accents
- **Vibe:** Luxury + technical + smooth

---

### 2️⃣ FRONTEND SQUAD 💻

**Lead:** [Frontend Principal]  
**Duração:** 4-5 horas  
**Deadline:** Hoje até 16h

#### Responsabilidades:

**Phase 1: HTML Refactoring (0.5h)**
```
☐ Converter .proc-tl de grid 7-col para flex-column
☐ Manter estrutura das 7 steps (01-07)
☐ Organizar HTML semanticamente:
  <div class="proc-timeline">
    <div class="proc-step">
      <div class="step-marker">01</div>
      <div class="step-content">
        <h3>Título</h3>
        <p>Descrição</p>
      </div>
    </div>
    ...
  </div>
```

**Phase 2: CSS Styling (2.5h)**
```
☐ .proc-timeline
  - flex-direction: column
  - align-items: center (ou flex-start mobile)
  - gap: 32px (ou responsive)

☐ .proc-step
  - display: flex (column on desktop, row on mobile)
  - position: relative
  - max-width: 600px (optional constraint)

☐ .step-marker (circles)
  - width/height: 80px (desktop), 64px (tablet), 48px (mobile)
  - border: 2px gold
  - border-radius: 50%
  - display: flex + justify-content: center + align-items: center
  - font-size: 24px, font-weight: 300
  - background: var(--obsidian)
  - color: var(--gold)
  - transition: all 0.3s
  - Hover: background: var(--gold), color: var(--obsidian), transform: scale(1.15)

☐ .step-content
  - Padding: 0 40px desktop, 0 24px mobile
  - Text alignment: left
  - Descriptions com mais destaque

☐ Connecting Lines (.proc-timeline::before)
  - position: absolute
  - left: 39px (center of 80px circle)
  - top: 80px (after first circle)
  - bottom: 80px (before last circle)
  - width: 2px
  - background: linear-gradient(180deg, var(--gold-d) 0%, transparent)
  - Animation: scaleY(0) → scaleY(1) ao scroll

☐ Mobile Zig-zag layout:
  - alternating flex-direction: row vs row-reverse
  - Circles ficam alternadas esquerda/direita
  - Lines adaptam dinamicamente
```

**Phase 3: Animations (1.5h)**
```
☐ AOS Integration:
  - Cada .proc-step tem data-aos="fade-up"
  - data-aos-duration="600"
  - data-aos-delay (100ms cada step)

☐ Scroll Trigger Animations:
  - Circles scaley-in on scroll
  - Lines draw-up on scroll
  - Titles fadeIn staggered

☐ Hover Effects:
  - Circle: scale(1.15) + boxShadow
  - Content: slight fade or color shift
  - Duration: 0.3s cubic-bezier(.22,1,.36,1)

☐ Optional: SVG animated connector lines
  - Stroke animation effect
  - Draw effect (stroke-dashoffset)
```

**Phase 4: Responsividade (1h)**
```
☐ Desktop (1200px+)
  - Standard vertical layout
  - Circles 80px
  - Spacing 32px

☐ Tablet (768-1200px)
  - Circles 64px
  - Spacing 24px
  - Maybe: 2-column grid?

☐ Mobile (<768px)
  - Circles 48px
  - Zig-zag alternating left/right
  - Spacing 20px
  - Font sizes reduce 10%
```

#### Deliverables:
1. Updated HTML structure
2. New CSS (proc-timeline styles)
3. AOS animations implemented
4. Responsive breakpoints tested
5. Performance optimized (GPU acceleration)

#### Tools:
- CSS custom properties (use existing variables)
- AOS.js (already in project)
- Vanilla JS (if needed for interactivity)
- No new dependencies

---

### 3️⃣ QA/TESTING SQUAD ✅

**Lead:** [QA Lead]  
**Duração:** 2-3 horas  
**Deadline:** Após Frontend (end of day)

#### Responsabilidades:

**Browser Testing:**
```
☐ Chrome (Latest)
☐ Firefox (Latest)  
☐ Safari (Latest)
☐ Edge (Latest)

Checklist por browser:
- Layout renders correctly
- Circles display properly
- Animations smooth (no jank)
- Hover states work
- Lines align perfectly
- Text readable
```

**Device Testing:**
```
☐ iPhone 12 (375px)
☐ iPhone 14 Pro (430px)
☐ iPad (768px)
☐ iPad Pro (1024px)
☐ Desktop (1920px)
☐ Large screens (2560px)

Checklist por device:
- Zig-zag layout correct on mobile
- Circles size appropriate
- Spacing consistent
- Touch targets > 44px
- Scroll animations smooth
```

**Performance Audit:**
```
☐ Lighthouse score (target: 90+)
☐ Core Web Vitals check
☐ Animation frame rate (60fps)
☐ Memory usage (animations efficient)
☐ CSS not bloated
☐ No console errors
```

**Accessibility Check:**
```
☐ Semantic HTML
☐ ARIA labels on circles (if needed)
☐ Color contrast ratios (WCAG AA)
☐ Keyboard navigation works
☐ Screen reader friendly
☐ Focus indicators visible
```

**Bug Report Template:**
```
BROWSER/DEVICE: [Chrome on iPhone 12]
ISSUE: [Description]
EXPECTED: [What should happen]
ACTUAL: [What's happening]
SEVERITY: [Critical/High/Medium/Low]
SCREENSHOT/VIDEO: [Attach]
```

#### Deliverables:
1. Testing report (pass/fail matrix)
2. Bug list (with priorities)
3. Performance metrics
4. Recommendations for optimization

---

## 📅 TIMELINE

| Hora | Squad | Task |
|------|-------|------|
| 08:00-10:00 | Design | Create mockups + specs |
| 10:00-10:30 | Product Review | Approve design |
| 10:30-15:00 | Frontend | Implement changes |
| 15:00-15:30 | QA | Spot check |
| 15:30-17:00 | QA | Full testing |
| 17:00-17:30 | All | Final review + merge |

---

## 🎯 SUCCESS CRITERIA

✅ **Frontend:**
- [ ] Layout passes all responsive breakpoints
- [ ] Animations smooth on all browsers
- [ ] Performance: Lighthouse 90+
- [ ] Zero console errors
- [ ] WCAG AA compliant

✅ **Design:**
- [ ] Visual consistent with brand
- [ ] Premium feel achieved
- [ ] Mobile version elegant
- [ ] Animation specs clear

✅ **QA:**
- [ ] No critical bugs
- [ ] Works on all major browsers/devices
- [ ] Performance metrics met
- [ ] Accessibility verified

---

## 🚀 GO-LIVE CHECKLIST

- [ ] All PRs approved + merged
- [ ] Code reviewed by lead
- [ ] Final browser testing complete
- [ ] Design sign-off received
- [ ] Git commit created
- [ ] Deploy to production
- [ ] Monitor for issues

---

## 📝 NOTES

### Current HTML Structure (to refactor)
```html
<section id="processo">
  <div class="proc-hdr rv">
    <div class="stag stag-center">Nosso fluxo</div>
    <h2 class="H">Do recebimento à entrega perfeita.</h2>
  </div>
  <div class="proc-tl rv d1">
    <!-- 7 steps as grid-template-columns: repeat(7,1fr) -->
  </div>
  <p class="proc-close">Quando o processo é sério...</p>
</section>
```

### Key Files to Modify
- `/PORTFOLIO/index.html` (HTML + inline CSS)
- Search for: `#processo`, `.proc-tl`, `.proc-hdr`

### Design System Available
- Colors: var(--gold), var(--gold-l), var(--gold-d), var(--obsidian), var(--ivory)
- Fonts: Cormorant Garamond (headings), Montserrat (body)
- Spacing: 8-point grid (8px, 16px, 24px, 32px, 48px, etc.)

---

## 💬 QUESTIONS?

- **Design:** Qual das 3 opções preferem?
- **Frontend:** Precisa de novos componentes ou apenas refactor?
- **QA:** Qual é o threshold mínimo de performance?

---

**Status:** 🟢 PRONTO PARA COMEÇAR  
**Aprovado por:** [Product Manager]  
**Next Step:** Confirmar squads e iniciar Fase 1

---

*Documento criado: 2026-04-07*  
*Atualizado por: Claude Code*
