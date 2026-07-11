# 🧪 A/B Testing Variations - SPRINT 2

## Headlines (Hero Section)

### Variação A (Atual - Benefício)
**"Presença que Vende"**
- Copy: "Sua imagem começa a trabalhar por você, antes de você abrir a boca"
- Foco: Autoridade + vendas
- Target: Empreendedores escaláveis

### Variação B (Urgência + Transformação)
**"Transforme sua Autoridade em Vendas"**
- Copy: "40-60% de aumento em receita após realinhar imagem e posicionamento"
- Foco: Números tangíveis + transformação
- Target: Consultores, coaches

### Variação C (Problema/Dor)
**"Cansado de ser Invisível?"**
- Copy: "Especialistas com menos experiência vendem mais que você. Descubra por quê"
- Foco: Identificação com problema
- Target: Profissionais em transição

### Variação D (Urgência Máxima)
**"Última Chance: Posicionamento Premium"**
- Copy: "Apenas 4 vagas este mês. Empreendedores que transformam imagem em autoridade"
- Foco: Escassez + exclusividade
- Target: High-ticket buyers

---

## CTAs Primários

### Variação A (Atuação)
**"Quero transformar minha imagem"**
- Copy da seção: "20 minutos de conversa sem compromisso"
- Objetivo: Lead qualificado
- Taxa esperada: +15-20%

### Variação B (Benefício Direto)
**"Garantir minha vaga agora"**
- Copy da seção: "Apenas 4 vagas disponíveis este mês"
- Objetivo: Urgência + ação
- Taxa esperada: +20-25%

### Variação C (Curiosidade)
**"Descobrir meu posicionamento ideal"**
- Copy da seção: "Receba análise pessoal em 20 minutos"
- Objetivo: Baixa fricção + qualificação
- Taxa esperada: +18-22%

### Variação D (Confiança)
**"Agendar análise de imagem (grátis)"**
- Copy da seção: "Consulta com especialista certificado"
- Objetivo: Remover objeção de preço
- Taxa esperada: +12-18%

---

## Como Testar

### Implementação
1. Use cada variação por 2-3 semanas
2. Compare taxa de cliques nos CTAs
3. Compare taxa de conversão (leads gerados)
4. Rastreie com Google Analytics ou Hotjar

### Métricas de Sucesso
- **Click-through rate (CTR):** Meta +25% vs baseline
- **Conversion rate:** Meta +20% vs baseline
- **Cost per lead (CPL):** Reduzir em 15%
- **Time on page:** +30s = melhor engajamento

### Exemplo: Código Google Analytics
```javascript
// Rastrear variação A (ctrl)
window.gtag = window.gtag || function(){};
gtag('event', 'ab_test_variant', {
  'variant_name': 'headline_a',
  'test_name': 'hero_headline'
});

// Rastrear CTA clicks
document.querySelectorAll('.btn-main').forEach(btn => {
  btn.addEventListener('click', () => {
    gtag('event', 'cta_click', {
      'cta_text': btn.textContent,
      'variant': 'headline_a'
    });
  });
});
```

---

## Recomendações Prioridade

### 🥇 Comece com:
**Variação B (Headlines) + Variação B (CTAs)**
- Headlines: "Transforme sua Autoridade em Vendas"
- CTA: "Garantir minha vaga agora"
- Razão: Combina urgência + benefício direto

### 🥈 Se Variação B falhar:
**Variação C (Headlines) + Variação C (CTAs)**
- Headlines: "Cansado de ser Invisível?"
- CTA: "Descobrir meu posicionamento ideal"
- Razão: Problema-primeiro, menos agressivo

### 🥉 Para Retargeting/Campanhas Pagas:
**Variação A (Headlines) + Variação D (CTAs)**
- Headlines: "Presença que Vende" (reconhecimento de marca)
- CTA: "Agendar análise de imagem (grátis)"
- Razão: Mais suave para públicos frios

---

## Próximo Passo
Após encontrar a melhor combinação:
1. Teste página de checkout/formulário
2. Teste cores e tamanho de CTAs
3. Teste posição de CTAs (acima/embaixo do fold)
4. Teste ofertas (desconto, bônus, garantia)

