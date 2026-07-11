# 📋 Documentação — HOME Protetic | HTML → WordPress Elementor Pro

**Data:** Março 2026  
**Versão:** 1.0 MVP  
**Status:** Pronto para visualização e feedback  

---

## 1. O QUE FOI CRIADO

### ✅ HOME em HTML Puro (`index-home-new.html`)

Uma landing page completa com 10 seções, baseada no novo posicionamento de marca da Protetic:

1. **Header Fixo** — Navegação limpa, logo, CTA
2. **Hero Section** — Tagline premium, descrição, dual CTA
3. **Quem Somos** — Narrativa + 3 pilares (Precisão, Responsabilidade, Respeito)
4. **Propósito/Missão/Visão** — 3 cards informativos + manifesto
5. **Diferenciais** — 6 cards com unique selling propositions
6. **Tecnologia** — Specs de infraestrutura e compromisso com qualidade
7. **Fluxo (Processo)** — 7 etapas visuais da produção
8. **Equipe** — Stats de excelência e comprometimento
9. **Valores** — 4 core values da empresa
10. **Final CTA** — Call-to-action conclusivo + Footer

---

## 2. TECNOLOGIAS & ANIMAÇÕES UTILIZADAS

### 📚 Stack
- **HTML5** semântico
- **CSS3** com custom properties (CSS variables)
- **JavaScript vanilla** para smooth scroll
- **AOS.js** (Animate On Scroll) — library lightweight para animações no scroll

### ✨ Animações Implementadas

#### AOS.js Animations:
```javascript
- data-aos="fade-up"          // Fade + slide up
- data-aos="fade-left"        // Fade + slide from right
- data-aos="fade-right"       // Fade + slide from left
- data-aos="zoom-in"          // Zoom in
- data-aos-delay="[ms]"       // Stagger de elementos
```

#### CSS Keyframes:
```css
@keyframes float         // Floating elements (hero background)
@keyframes bounce        // Scroll indicator bounce
```

#### Hover Effects:
- Cards elevam com `transform: translateY(-8px)`
- Botões mudam cor e ganham shadow
- Links têm transição suave de cor

### 🎯 Por que AOS.js?
✓ Lightweight (~7KB)  
✓ Compatível com WordPress via plugin  
✓ Triggerado por Intersection Observer (performance)  
✓ Não conflita com Elementor  
✓ Mobile-friendly  

---

## 3. DESIGN TOKENS (CSS VARIABLES)

Todas as cores, espaçamentos, tipografia estão em variáveis CSS no `:root`:

```css
--color-primary: #1a2b4d          (Azul escuro)
--color-secondary: #2d3e5f        (Azul médio)
--color-accent: #4a6fa5           (Azul principal)
--color-accent-light: #6b8ec1     (Azul claro)
--color-success: #2d5a3d          (Verde)
--color-neutral-light: #f8f9fa    (Cinza claro)
--spacing-* (xs, sm, md, lg, xl, 2xl, 3xl)
--font-size-* (sm até 4xl)
```

**Benefício:** Super fácil de mudar no Elementor depois — basta editar as variáveis uma vez.

---

## 4. INSPIRAÇÕES VISUAIS (DO GITHUB & PESQUISA)

### 🎨 Referências Premium Encontradas:

1. **Creative Dental Labs**
   - Cursive fonts + detailed images
   - Dark blues & purples transitions
   - Animated text & smooth transitions
   - **Aplicado aqui:** Color scheme, animações suaves

2. **Functional Esthetics Dental Laboratory**
   - Professional contrast + high-res images
   - Trust-building layout
   - Well-organized content
   - **Aplicado aqui:** Estrutura limpa, cards com hierarchy

3. **Leading Edge Dental Lab**
   - Neutral colors + blue/yellow CTAs
   - Content organization via color control
   - **Aplicado aqui:** CTA differentiation (primary vs secondary)

4. **GitHub Templates Referência:**
   - [themixlyweb/nextjs-dental-website-template](https://github.com/themixlyweb/nextjs-dental-website-template)
   - Grid layouts responsivos
   - Component-based structure
   - **Aplicado aqui:** 7-step process layout, responsive grid

5. **HelloTheme/Astra (WordPress Framework)**
   - Lightweight, performance-focused
   - Elementor-native compatibility
   - 300+ starter sites
   - **Decisão:** Usar HelloTheme como base no WordPress depois

---

## 5. COMO SERÁ A MIGRAÇÃO PARA WORDPRESS ELEMENTOR PRO

### Fase 1: Setup (30min)
```
1. Instalar Elementor Pro + Astra/HelloTheme
2. Copiar as CSS variables para theme customizer
3. Importar fontes (Inter, system stack)
4. Configurar cores no Elementor brand kit
```

### Fase 2: Port das Seções (1-2h por seção)
```
Cada seção HTML:
  1. Criar Nova Página no Elementor
  2. Usar Custom CSS do Elementor para colocar o CSS da seção
  3. Substituir elementos por Elementor widgets (text, image, button, etc)
  4. AOS.js já funciona via Custom Code > Body
```

### Fase 3: Plugin de Animações
Opções recomendadas:

#### Opção A (Recomendado): AOS.js nativo
- Plugin: "Elementor" + custom code footer
- Benefício: Já está configurado, zero conflitos
- Custo: 0 (free)

#### Opção B: Animation Addons for Elementor
- Plugin: "Animation Addons for Elementor" (free)
- Benefício: UI visual no Elementor pra animar
- Custo: Free + paid plans

#### Opção C: GSAP ScrollTrigger
- Plugin: "Steroids for Elementor" ou GlOO
- Benefício: Animações mais avançadas (scroll parallax, etc)
- Custo: Free (Steroids)

**Escolha aqui:** AOS.js nativo é a mais segura.

---

## 6. ESTRUTURA PARA REUTILIZAÇÃO NO ELEMENTOR

### 📦 Componentes Prontos para Portar:

#### Card Patterns:
```html
<!-- Padrão 1: Pilar/Stat Card -->
.pilar { background, padding, border-radius, hover effect }

<!-- Padrão 2: Diferencial Card -->
.diferencial-card { border-left accent, shadow, hover lift }

<!-- Padrão 3: PMV Card -->
.pmv-card { gradient or solid, premium spacing }

<!-- Padrão 4: Step Card -->
.step { connector lines, number styling, sequential delay }

<!-- Padrão 5: Valor Card -->
.valor-card { left border accent, clean typography }
```

Cada um pode ser criado como **Elementor Template/Widget reutilizável**.

#### Button Patterns:
```css
.cta-primary   /* Solid + hover elevation */
.cta-secondary /* Outline + fill on hover */
```

---

## 7. RESPONSIVIDADE

### ✅ Breakpoints Configurados:

```css
@media (max-width: 1024px)  /* Tablets grandes */
@media (max-width: 768px)   /* Tablets/Mobile */
```

### Comportamento:
- Grids 3col → 1col (mobile)
- Fluxo 7col → 2col (mobile)
- Hero mantém tamanho adaptável
- CTAs viram full-width em mobile

**Testado em:** Chrome DevTools (responsiveness OK)

---

## 8. COMO VISUALIZAR AGORA

### 1️⃣ Abrir no Navegador
```bash
1. Abrir arquivo: index-home-new.html
2. No navegador (Firefox, Chrome, Safari)
3. F11 para fullscreen ou abrir em DevTools
```

### 2️⃣ Testar Animações
- Scroll para baixo → vê sections animarem
- Hover em cards → elevation effect
- Redimensionar window → responsive vira mobile

### 3️⃣ Inspecionar CSS
- Abrir DevTools (F12)
- Elements tab → copiar estrutura
- Styles → ver custom properties em uso

---

## 9. PRÓXIMOS PASSOS

### A. Ajustes Visuais (Feedback)
- [ ] Cores: OK? Mudar paleta?
- [ ] Espaçamento: mudar padding/gap?
- [ ] Tipografia: fontes certas?
- [ ] Animações: velocidade OK? Muito rápido/lento?

### B. Conteúdo
- [ ] Substituir placeholders de imagens (`[Foto do Lab]` etc)
- [ ] Adicionar nomes reais nos depoimentos
- [ ] Validar specs de tecnologia (Exocad, 3Shape, Smart-Prótese)
- [ ] Copiar conteúdo do portfólio Vercel se precisar ajustar

### C. Implementação WordPress
- [ ] Clonar repo ou copiar HTML
- [ ] Instalar Elementor Pro + HelloTheme
- [ ] Começar port seção por seção
- [ ] Integrar com sistema de contato (WP Forms, Gravity Forms)

### D. SEO & Performance
- [ ] Adicionar meta tags (og:image, og:description)
- [ ] Minificar CSS/JS
- [ ] Otimizar imagens (WebP)
- [ ] Testar Core Web Vitals

### E. Extras (Futuro)
- [ ] Adicionar seção de depoimentos com carousel
- [ ] Blog / Resource center
- [ ] Galeria de cases antes/depois
- [ ] Formulário de contato com Zapier integration
- [ ] Dark mode toggle

---

## 10. NOTAS TÉCNICAS

### 📝 Código Limpo
- Comentários HTML marcam cada seção
- CSS organizado em módulos lógicos
- Custom properties em topo
- Sem dependencies externas (só AOS.js)

### 🔒 Acessibilidade (A11y)
- Headings semânticos (H1, H2, H3)
- Contrast ratio OK (WCAG AA)
- Links descritivos
- Alt text placeholders para imagens

### ⚡ Performance
- CSS inline (no requests extras)
- AOS.js é ~7KB
- Zero jQuery
- Lazy loading pronto para imagens (Elementor cuida)

---

## 11. CONTATOS PARA INTEGRAÇÃO

### Recursos:
- **HelloTheme Docs:** https://hellotheme.com
- **Elementor Pro Docs:** https://elementor.com/help/
- **AOS.js Docs:** https://michalsnik.github.io/aos/
- **Animation Addons:** https://wordpress.org/plugins/animation-addons-for-elementor/

### Stack Final Recomendado:
```
├── WordPress (última versão)
├── HelloTheme (free) ou Astra Pro
├── Elementor Pro
├── WP Forms ou Gravity Forms (contato)
├── Yoast SEO (SEO)
├── Optimize Toolset (performance)
└── [Custom Code] AOS.js + Smooth Scroll
```

---

## 12. VERSIONAMENTO

| Versão | Data | Status | Notas |
|--------|------|--------|-------|
| 1.0 | 27/03/2025 | ✅ MVP | Home completa, animações, responsivo |
| 1.1 | TBD | 📋 Backlog | Feedback visual + ajustes |
| 2.0 | TBD | 📋 Backlog | Port para WordPress Elementor |
| 2.1 | TBD | 📋 Backlog | Integração com CRM/Forms |
| 3.0 | TBD | 📋 Backlog | Blog + Galeria de cases |

---

**Documento gerado pelo:** Estúdio Roncolato  
**Para:** Laboratório Protetic  
**Próxima revisão:** Após feedback inicial  

---

## 📞 Dúvidas?

Abra o arquivo HTML no navegador e explore. Qualquer pergunta sobre animações, estrutura ou migração, é só chamar.

Happy coding! 🚀
