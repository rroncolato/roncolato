# ⚡ Performance & Optimization Checklist - SPRINT 3

## 🚀 Quick Wins (Implementados)

- ✅ Lazy-loading nativo para imagens
- ✅ Sticky CTA flutuante após hero
- ✅ Badges de confiança
- ✅ Mobile-first CSS responsive
- ✅ Efeitos visuais otimizados (transições .3s)
- ✅ Script async de contador dinâmico
- ✅ IntersectionObserver para eventos scroll-based (sem thrashing)

---

## 🔍 Performance Audit Checklist

### Core Web Vitals

#### **Largest Contentful Paint (LCP) - Target: < 2.5s**
- [ ] Compactar/otimizar imagens hero (WebP + fallback JPG)
- [ ] Lazy-load images abaixo do fold
- [ ] Minificar CSS inline
- [ ] Usar CDN para assets estáticos

**Ação imediata:**
```bash
# Converter imagens para WebP (Linux/Mac)
for img in *.jpg; do cwebp "$img" -o "${img%.jpg}.webp"; done

# Windows: use online converter ou ImageMagick
```

#### **First Input Delay (FID) / Interaction to Next Paint (INP) - Target: < 100ms**
- [ ] Remover scripts bloqueadores
- [ ] Debounce scroll events
- [ ] Lazy-load scripts não-críticos
- [ ] Limpar event listeners

**Estado atual:** ✅ Bom (usamos IntersectionObserver otimizado)

#### **Cumulative Layout Shift (CLS) - Target: < 0.1**
- [ ] Definir dimensões para todas as imagens
- [ ] Reservar espaço para ads/CTAs
- [ ] Evitar inserções de conteúdo acima do fold
- [ ] Use `font-display: swap` para web fonts

**Ação imediata - Adicionar a todas as imagens:**
```html
<img src="..." width="1920" height="1080" loading="lazy" alt="...">
```

---

## 📦 Minificação & Compressão

### HTML
- [ ] Minificar HTML inline (remover espaços, comentários)
- [ ] Usar Gzip compression no servidor
- [ ] Target: -40% do size atual

### CSS
- [ ] CSS está inline (✅ Bom para LCP)
- [ ] Remover espaços desnecessários
- [ ] Usar ferramentas: cssnano, csso

### JavaScript
- [ ] Minificar scripts custom
- [ ] Usar terser ou uglify
- [ ] Carregar scripts com `defer` ou `async`

**Exemplo otimizado:**
```html
<!-- Crítico: sincronizado -->
<script>/* CONTADOR + LAZY-LOAD */</script>

<!-- Não-crítico: async -->
<script async src="analytics.js"></script>

<!-- Não-crítico: defer -->
<script defer src="interactive-features.js"></script>
```

---

## 🖼️ Image Optimization

### Formato & Tamanho

| Elemento | Formato Ideal | Size Target | Notes |
|----------|--------------|-------------|-------|
| Hero portraits | WebP + JPG | <150kb each | Use srcset para responsive |
| Galeria strip | WebP | <50kb each | Lazy-load |
| Client logos | SVG | <20kb | Escalável, pequeno |
| Backgrounds | WebP | <200kb | Use CSS gradients onde possível |

### Implementação

```html
<!-- Exemplo: Hero portrait responsivo -->
<picture>
  <source srcset="hero-lg.webp" media="(min-width: 980px)" type="image/webp">
  <source srcset="hero-lg.jpg" media="(min-width: 980px)">
  <source srcset="hero-md.webp" media="(min-width: 640px)" type="image/webp">
  <source srcset="hero-md.jpg" media="(min-width: 640px)">
  <img src="hero-sm.jpg" loading="lazy" alt="Rodrigo Roncolato" width="1000" height="1200">
</picture>
```

---

## 🔗 Network & Rendering

### HTTP/2 Push (se suportado)
- [ ] Push critical CSS inline ✅ (já feito)
- [ ] Push Google Fonts
- [ ] Não push lazy-load assets

### Resource Hints
```html
<head>
  <!-- Pré-conectar a CDNs -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  
  <!-- Pré-fetch assets secundários -->
  <link rel="prefetch" href="/assets/carousel-1.jpg">
  
  <!-- DNS prefetch para embeds -->
  <link rel="dns-prefetch" href="https://www.youtube.com">
</head>
```

### Critical CSS Path
```css
/* APENAS elementos acima do fold */
html, body, nav, .hero { /* CSS inline */ }

/* Resto do CSS: externo ou defer */
@import url("styles.css");
```

---

## 📊 Monitoring & Tracking

### Ferramentas Recomendadas

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev
   - Run monthly

2. **WebPageTest**
   - https://www.webpagetest.org
   - Teste real devices

3. **GTmetrix**
   - https://gtmetrix.com
   - Monitor trends

4. **Google Analytics 4 + Web Vitals**
   ```javascript
   // GA4 Web Vitals Integration
   import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getLCP(console.log);
   ```

### Objetivo de Performance

| Métrica | Atual | Meta | Timeline |
|---------|-------|------|----------|
| LCP | ? | <2.5s | 2 semanas |
| FID | ? | <100ms | 1 semana |
| CLS | ? | <0.1 | 1 semana |
| Time to Interactive | ? | <4s | 3 semanas |
| Speed Index | ? | <3.5s | 3 semanas |

---

## 🔐 Security Checklist

- [ ] HTTPS ✅ (recomendado)
- [ ] CSP headers (Content Security Policy)
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin

**Adicionar ao servidor (.htaccess ou nginx.conf):**
```apache
# .htaccess (Apache)
Header set Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://www.google-analytics.com;"
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
```

---

## 📱 Mobile Optimization (Já Implementado ✅)

- ✅ Viewport meta tag
- ✅ Mobile-friendly CSS
- ✅ Touch-friendly CTAs (48px min)
- ✅ Responsive images
- ✅ Fast tap response (<100ms)

---

## 🚀 Deployment Checklist

### Antes de Deploy

- [ ] Testar em 3+ devices (iPhone, Android, Desktop)
- [ ] Testar em 2+ navegadores (Chrome, Safari, Firefox, Edge)
- [ ] Validar HTML: https://validator.w3.org
- [ ] Validar CSS: https://jigsaw.w3.org/css-validator/
- [ ] Testar acessibilidade: https://wave.webaim.org
- [ ] Lighthouse score >90
- [ ] Sem console errors
- [ ] Testar em 4G lento (DevTools throttling)

### Deploy Steps

1. **Backup atual**
   ```bash
   cp lp-presenca-v3-fotos.html lp-presenca-v3-fotos.backup.html
   ```

2. **Minificar & Otimizar**
   ```bash
   # Remover espaços extras (bash)
   sed 's/^[[:space:]]*//; s/[[:space:]]*$//' lp-presenca-v3-fotos.html > lp-presenca-v3-fotos.min.html
   ```

3. **Upload & Test em Produção**
   ```bash
   # SCP para servidor
   scp lp-presenca-v3-fotos.html user@server:/var/www/presencavende/
   
   # Test: curl https://presencavende.com -I
   ```

4. **Monitorar primeiras 24h**
   - Google Analytics
   - Error tracking
   - Conversion rates

---

## 📈 Next Steps (Pós-Sprint 3)

### Priority 1 (Esta semana)
- [ ] Implementar Web Vitals tracking
- [ ] Otimizar imagens para WebP
- [ ] Adicionar font-display: swap
- [ ] Testar mobile em 3+ dispositivos

### Priority 2 (Próx. 2 semanas)
- [ ] A/B testing de headlines
- [ ] Heat map (Hotjar) analysis
- [ ] Form optimization (se houver)
- [ ] Email automation setup

### Priority 3 (Mensal)
- [ ] Performance audit
- [ ] SEO audit (Semrush/Ahrefs)
- [ ] Competitor analysis
- [ ] Iterate on conversions

---

## 💡 Dúvidas & Suporte

Documentação referenciada:
- https://web.dev/performance/
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://www.cloudflare.com/learning/performance/

