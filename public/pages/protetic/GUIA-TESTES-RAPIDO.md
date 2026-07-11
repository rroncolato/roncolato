# 🧪 Guia de Testes Rápido — HOME Protetic

**Como testar a HOME em HTML agora mesmo**

---

## 1️⃣ ABRIR O ARQUIVO

### Via Explorador de Arquivos:
```
c:\Users\rodri\Downloads\SITE RONCOLATO\protetic\index-home-new.html
```

**Clique duplo** → Abre no navegador padrão

### Via VSCode:
```
1. Abrir arquivo no VSCode
2. Ctrl + Shift + P → "Go Live" (se tiver Live Server)
3. Ou: Right-click → Open with Live Server
```

---

## 2️⃣ CHECKLIST DE VISUALIZAÇÃO

### 🎨 Design & Layout
- [ ] Header aparece fixo no topo (scroll)
- [ ] Logo "Protetic" centralizado
- [ ] Navegação alinhada (Home, Quem Somos, Diferenciais, Processo, Valores, Contato)
- [ ] Colors corretos (azul escuro, azul claro, branco)
- [ ] Espaçamento proporcional entre seções

### ✨ Animações
- [ ] Scroll down → elementos aparecem com fade-up (suave)
- [ ] Cards ganham sombra + elevam no hover
- [ ] Botões mudam cor no hover
- [ ] Links indicador scroll no hero (bouncing)
- [ ] Proposição semanal + manifesto (zoom-in)

### 📱 Responsividade
- [ ] Desktop (1920px): Grid 3 colunas OK
- [ ] Tablet (1024px): Grid reduz automaticamente
- [ ] Mobile (768px):
  - [ ] Grid vira 1 coluna
  - [ ] Header navigation esconde (mobile)
  - [ ] CTAs ficam full-width
  - [ ] Texto redimensiona

### 🔗 Links Funcionais
- [ ] Clique em "Iniciar Parceria" → abre WhatsApp (link)
- [ ] Scroll smooth entre seções (smooth scroll)
- [ ] Logo no header → volta para topo

---

## 3️⃣ TESTAR CADA SEÇÃO

### HERO (Topo da página)
```
✓ Tagline: "Precisão que protege a sua reputação."
✓ Subtitle: "Estética · Função · Confiança"
✓ CTA 1: "Iniciar uma Parceria →" (azul claro)
✓ CTA 2: "Descubra Nossos Diferenciais" (outline)
✓ Scroll indicator animado no final
```

**Testar:** Hover nos botões → devem mudar cor/sombra

---

### QUEM SOMOS
```
✓ Texto descritivo (lado esquerdo)
✓ Bloco de imagem (lado direito, placeholder)
✓ 3 pilares: Precisão, Responsabilidade, Respeito
✓ Animação fade-right/left no scroll
```

**Testar:** Scroll para essa seção → cards aparecem com stagger (delays diferentes)

---

### PROPÓSITO/MISSÃO/VISÃO (PMV)
```
✓ 3 cards com cores diferentes
✓ Propósito (gradiente azul, texto branco)
✓ Missão (fundo claro, border azul)
✓ Visão (gradiente escuro, texto branco)
✓ Manifesto em caixa com quote
```

**Testar:** Manifesto faz zoom-in no scroll

---

### DIFERENCIAIS (6 Cards)
```
✓ 6 cards em grid 3x2
✓ Cada card tem:
  - Título
  - Descrição
  - Border-top ao hover
  - Elevação (translateY -8px)
✓ Grid reduz para 1 col em mobile
```

**Testar:** 
- Desktop: hover em qualquer card
- Mobile: redimensionar window para 768px, verificar grid 1 coluna

---

### TECNOLOGIA
```
✓ Imagem placeholder (lado esquerdo)
✓ Texto + lista de specs (lado direito)
✓ Layout alternado (imagem esquerda, texto direita)
✓ Checklist com ✓ verde
```

**Testar:** Ordem inverte em mobile (imagem fica em cima)

---

### FLUXO (7 Etapas)
```
✓ 7 cards numerados (01-07)
✓ Cards conectados com linhas (→)
✓ Cada card tem:
  - Número
  - Título
  - Descrição curta
✓ Em mobile: grid reduz para 2 colunas (linhas desaparecem)
```

**Testar:** 
- Scroll para essa seção → cards aparecem com stagger
- Hover em qualquer step → elevação + sombra

---

### EQUIPE
```
✓ 4 stats em grid
✓ Valores: 100%, 0, ∞, 1ª
✓ Labels descritivos
✓ Background claro, texto azul
```

**Testar:** Redimensione para mobile → grid 1 coluna

---

### VALORES (4 Cards)
```
✓ 4 cards com border-left azul claro
✓ Cada card:
  - Título
  - Descrição
  - Border-left 4px
  - Sombra suave
✓ Em tablet: 2x2 grid
✓ Em mobile: 1 coluna
```

**Testar:** Hover em card → deve elevar

---

### FINAL CTA + FOOTER
```
✓ Seção final (dark gradient)
✓ Grande headline
✓ 2 botões (Primary + Secondary)
✓ Footer com tagline + copyright
```

**Testar:** Clique em "Iniciar uma Parceria" → abre WhatsApp

---

## 4️⃣ TESTAR RESPONSIVIDADE

### Via DevTools (F12):
```
1. Abrir DevTools (F12)
2. Clique device toolbar (Ctrl+Shift+M)
3. Escolha preset:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)
4. Scroll e verifique layout
```

### Checklist Mobile:
- [ ] Texto legível (font-size ok)
- [ ] Botões clicáveis (padding ok)
- [ ] Grids 3col viraram 1col
- [ ] Imagens redimensionam
- [ ] Header navigation responsivo
- [ ] Sem horizontal scroll

---

## 5️⃣ INSPECIONAR CSS & VARIÁVEIS

### Abrir DevTools → Elements Tab:

**Copiar uma cor:**
```
1. F12 → Elements
2. Clique em um elemento azul
3. Styles panel → vê "color: var(--color-primary)"
4. Clique na variável → mostra valor (#1a2b4d)
```

**Encontrar todas as variáveis:**
```
1. Ctrl+F nos Styles panel
2. Procure por "color-"
3. Vê todas as custom properties em uso
```

---

## 6️⃣ PERFORMANCE CHECK

### Google Lighthouse (DevTools):
```
1. F12 → Lighthouse tab
2. Clique "Analyze page load"
3. Vê scores de:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
```

**Esperado:**
- Performance: 80+
- Accessibility: 95+
- SEO: 90+

---

## 7️⃣ TESTAR VELOCIDADE DAS ANIMAÇÕES

### Mudar velocidade (Dev Mode):

**Abrir DevTools → Console:**
```javascript
// AOS está lento? Torna mais rápido:
AOS.refresh()

// Ver configuração atual:
console.log(AOS.options)
```

---

## 8️⃣ FEEDBACK CHECKLIST

Depois que testar, anote:

### ✅ Gostei:
- [ ] Cores
- [ ] Animações
- [ ] Layout
- [ ] Conteúdo
- [ ] Responsividade
- [ ] Velocidade

### ❌ Não Gostei:
- [ ] Cores muito escuras/claras?
- [ ] Animações rápidas/lentas?
- [ ] Spacing muito grande/pequeno?
- [ ] Fonte legível?
- [ ] Algo falta?

### 💬 Sugestões:
- [ ] Mudar cores?
- [ ] Adicionar seção?
- [ ] Remover conteúdo?
- [ ] Outro layout?

---

## 9️⃣ ATALHOS ÚTEIS

| Ação | Tecla |
|------|-------|
| Abrir DevTools | F12 |
| Device Mode (Mobile) | Ctrl + Shift + M |
| Inspeccionar elemento | Ctrl + Shift + C |
| Performance (Console) | Ctrl + Shift + J |
| Lighthouse | F12 → Lighthouse |

---

## 🔟 PRINTSCREEN / SHARE

### Capturar página inteira:
```
1. F12 → DevTools
2. Ctrl + Shift + P
3. Procure: "Screenshot"
4. "Capture full page screenshot"
```

---

## 📝 TEMPLATE DE FEEDBACK

```markdown
## Feedback — HOME Protetic

**Data:** [data]
**Testador:** [nome]

### Design & Cores
- [ ] OK / [ ] Mudar
- Observação: _______________

### Animações
- [ ] OK / [ ] Mudar
- Observação: _______________

### Conteúdo
- [ ] OK / [ ] Mudar
- Observação: _______________

### Responsividade
- [ ] OK / [ ] Mudar
- Observação: _______________

### Geral
**Nota 1-10:** ___
**Pronto para WordPress?** [ ] Sim [ ] Não
```

---

**Quando terminar de testar, envie o feedback!**

🚀 Próximo passo: Ajustes + Port para WordPress Elementor
