---
name: brand-slides
description: Generate brand presentation slides (WebSlides format) with your design system colors
---

Gera slides HTML pra brand presentations. Usa paleta do seu design system (amarelo #F5C518 + preto + branco). Output: arquivo `.html` pronto pra abrir no navegador.

## Paleta Brand
- Primary: #F5C518 (Amarelo)
- Background: #0A0A0A (Preto)
- Text: #F0F0EB (Branco)
- Font: JOST

## Formato Slide

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300..900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Jost', sans-serif; background: #0A0A0A; color: #F0F0EB; }
    .slide { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; }
    .slide h1 { font-size: 64px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.04em; }
    .slide h2 { font-size: 32px; font-weight: 800; margin-bottom: 30px; }
    .slide p { font-size: 18px; line-height: 1.6; max-width: 800px; }
    .primary { color: #F5C518; }
    .card { background: #2686; padding: 40px; border: 1px solid #3715; margin: 20px 0; }
  </style>
</head>
<body>
  <section class="slide">
    <h1>Seu Título</h1>
    <p>Descrição aqui</p>
  </section>
</body>
</html>
```

## Comando: /brand-slides

User: "Create brand slide about our services with 3 cards"
→ Generate HTML com cards lado a lado, cores brand, pronto usar

User: "Make case study slide for [client]"
→ Hero + image grid + client testimonial

User: "Portfolio showcase slide"
→ Grid de imagens 3 colunas, hover effects, brand colors

Output: Salva em `/proposta/` com nome data-driven (ex: `brand-service-2026-06-30.html`)
