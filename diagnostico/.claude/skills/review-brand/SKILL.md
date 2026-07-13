---
name: review-brand
description: Revisa telas, componentes e textos contra o design system e tom de voz do Estúdio Roncolato (Sábio/Criador/Mago). Use antes de concluir qualquer etapa visual.
---

# Revisão de marca

## Checklist

### Cores
- [ ] Nenhum hexadecimal em componente — só tokens semânticos
- [ ] Paleta correta: #1B1B1B, #F1F1F1, #F5AA22 + secundárias (#454142, #BDB3AA, #864919, #182425)
- [ ] Dourado usado como acento, não como fundo dominante

### Tipografia
- [ ] Títulos via --font-display, texto via --font-body
- [ ] Títulos grandes, peso leve, letter-spacing
- [ ] Hierarquia clara (um h1 por tela)

### Layout
- [ ] Respiro generoso (espaçamento editorial)
- [ ] Linhas finas douradas como detalhe, cards discretos
- [ ] Contraste forte, fundo escuro predominante
- [ ] Foto do usuário tratada como elemento central

### Linguagem
- [ ] Microcopy canônico respeitado (ver .claude/rules/brand.md)
- [ ] Tom Sábio/Criador/Mago: profundidade, clareza, transformação
- [ ] Sem linguagem de coach, promessa exagerada, urgência artificial
- [ ] Nenhuma frase que rotule ou humilhe o usuário

### Anti-padrões (reprovar se presente)
- [ ] Neon, glassmorphism exagerado, gradiente em excesso
- [ ] Estética fintech/gamer/template/IA genérica
- [ ] Ícones genéricos em excesso, animação chamativa

## Saída
Lista de violações com arquivo:linha e correção sugerida. Se limpo, declarar aprovado.
