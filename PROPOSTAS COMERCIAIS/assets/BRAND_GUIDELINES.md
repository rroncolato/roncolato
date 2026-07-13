# 🎨 Brand Guidelines - Roncolato Studio

Guia visual e de identidade para criar propostas que combinam com a marca Roncolato.

---

## 🎯 Identidade Visual

### Logo Principal
- **Arquivo**: `roncolato-horizontal.png`
- **Uso**: Header, capa, assinatura
- **Variações**: Colorido, branco (para fundos escuros)
- **Espaço mínimo**: 40px de espaço livre ao redor
- **Localização**: `/public/assets/IMG/`

### Logo Alternativo (Símbolo)
- **Arquivo**: `rr-simbolo.png` ou `rr-simbolo-white.png`
- **Uso**: Footer, ícones, destaque
- **Dimensão ideal**: 50px x 50px

---

## 🎨 Paleta de Cores

### Primária
| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Preto Roncolato** | `#1a1a1a` | `26, 26, 26` | Backgrounds, textos principais, headers |
| **Branco Puro** | `#ffffff` | `255, 255, 255` | Backgrounds claros, textos invertidos |

### Secundária
| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Cinza Claro** | `#f9f9f9` | `249, 249, 249` | Fundos de seções, cards, destaques suaves |
| **Cinza Médio** | `#cccccc` | `204, 204, 204` | Bordas, separadores |
| **Cinza Escuro** | `#555555` | `85, 85, 85` | Textos secundários, subtítulos |

### Acentos (Quando necessário)
| Nome | Hex | Uso |
|------|-----|-----|
| **Gold** | `#d4af37` | Destaque premium (apenas em casos especiais) |
| **Cinza** | `#2a2a2a` | Alternativa ao preto para sutileza |

---

### Exemplo de Uso CSS

```css
/* Cores Principais */
body {
    background-color: #ffffff;
    color: #1a1a1a;
}

header {
    background-color: #1a1a1a;
    color: #ffffff;
}

/* Seções Alternadas */
.secao {
    background-color: #f9f9f9;
}

/* Separadores */
hr, .divider {
    border-color: #cccccc;
}

/* Textos Secundários */
.subtitle, .texto-secundario {
    color: #555555;
}
```

---

## 📝 Tipografia

### Fontes Recomendadas
1. **Segoe UI** (padrão do template)
2. **Inter** (alternativa moderna)
3. **Poppins** (mais descontraída)
4. **Montserrat** (mais formal)

*Fallback*: `Tahoma, Geneva, Verdana, sans-serif`

### Hierarquia de Tamanhos

| Elemento | Tamanho | Weight | Uso |
|----------|---------|--------|-----|
| **H1 (Título Principal)** | 48px | 700 (Bold) | Capa, seções principais |
| **H2 (Seção)** | 32px | 700 (Bold) | Títulos de seções |
| **H3 (Subtítulo)** | 20px | 600 (SemiBold) | Subtítulos, destaque |
| **Body (Padrão)** | 16px | 400 (Regular) | Texto corrido |
| **Small (Rodapé)** | 14px | 400 (Regular) | Footer, informações menores |

### Espaçamento de Linha
- **H1, H2**: `line-height: 1.2`
- **H3**: `line-height: 1.3`
- **Body**: `line-height: 1.6`

### Exemplo CSS

```css
/* H1 - Capa */
h1 {
    font-size: 48px;
    font-weight: 700;
    line-height: 1.2;
    color: #1a1a1a;
    margin-bottom: 20px;
}

/* H2 - Seções */
h2 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    color: #1a1a1a;
    position: relative;
    padding-bottom: 15px;
}

h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #1a1a1a;
}

/* Body */
p {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: #1a1a1a;
    margin-bottom: 15px;
}
```

---

## 🎭 Estilos Visuais

### Seções
- **Padding**: 60px 40px (desktop) | 40px 20px (mobile)
- **Margin**: Seções com espaçamento uniforme
- **Bordas inferiores**: 1px solid #eeeeee

### Cards e Boxes
- **Background**: #f9f9f9
- **Padding**: 20px-25px
- **Border-radius**: 8px
- **Border-left**: 4px solid #1a1a1a (destaque)

### Botões
- **Padding**: 15px 40px
- **Background**: #1a1a1a
- **Color**: #ffffff
- **Border-radius**: 5px
- **Font-weight**: 600
- **Hover**: background #333333

### Separadores
- **Cor**: #cccccc
- **Altura**: 1px
- **Estilo**: solid

---

## 📐 Layout e Espaçamento

### Estrutura Geral
```
┌─────────────────────────────────────┐
│          HEADER / CAPA              │  60-80px padding
├─────────────────────────────────────┤
│                                     │
│   SEÇÃO 1 (Conteúdo)                │  60px padding (topo/baixo)
│   - Título                          │  40px padding (laterais)
│   - Parágrafo                       │
│   - Elementos                       │
│                                     │
├─────────────────────────────────────┤
│   SEÇÃO 2 (Conteúdo)                │
│                                     │
└─────────────────────────────────────┘
```

### Tamanhos Responsivos

| Breakpoint | Largura | Padding |
|-----------|---------|---------|
| **Desktop** | 1920px+ | 40px laterais |
| **Tablet** | 768-1919px | 30px laterais |
| **Mobile** | <768px | 20px laterais |

---

## 🖼️ Imagens

### Padrões
- **Resolução mínima**: 1200px (uma dimensão)
- **Formato**: JPG (fotos), PNG (gráficos), WebP (otimização)
- **Peso máximo**: 100KB por imagem
- **Aspect ratio**: Varia conforme contexto

### Portfolio Grid
- **Desktop**: 3 colunas | 280px min width
- **Tablet**: 2 colunas | 200px min width
- **Mobile**: 1 coluna | full width

### Hover Effect
```css
.portfolio-item img {
    transition: transform 0.3s ease;
}

.portfolio-item:hover img {
    transform: scale(1.05);
}
```

---

## ✨ Elementos Especiais

### Linhas Decorativas
```css
.secao h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #1a1a1a;
}
```

### Setas e Ícones
```html
→ Para listas (Entity: &rarr;)
✓ Para checks (Entity: &#10003;)
● Para bullets
```

### Números Decorativos
```css
.etapa-numero {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: #1a1a1a;
    color: #ffffff;
    border-radius: 50%;
    font-weight: bold;
    font-size: 24px;
}
```

---

## 🌐 Versão para Web vs Print

### Web (HTML/CSS)
- Use RGB para cores
- Fontes sem-serifa (melhor na tela)
- Tamanho mínimo 16px
- Links em azul ou com underline

### Print (PDF)
- Use CMYK se possível
- Fontes serifadas podem ser usadas
- Tamanho pode ser menor (10-12pt)
- Sem links interativos

---

## 🔍 Verificação Final

Antes de finalizar uma proposta, confira:

- [ ] Logo Roncolato presente?
- [ ] Cores consistentes com a paleta?
- [ ] Tipografia legível (min 16px)?
- [ ] Espaçamento adequado (não apertado)?
- [ ] Alinhamento perfeito?
- [ ] Imagens de qualidade profissional?
- [ ] Responsivo em mobile?
- [ ] Sem elementos fora de padrão?

---

## 📋 Exemplo de Importação CSS

```html
<style>
    :root {
        --color-primary: #1a1a1a;
        --color-secondary: #ffffff;
        --color-light: #f9f9f9;
        --color-text: #555555;
        --color-border: #cccccc;
        
        --font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        --font-weight-normal: 400;
        --font-weight-semi: 600;
        --font-weight-bold: 700;
    }

    body {
        font-family: var(--font-primary);
        color: var(--color-primary);
        background: var(--color-secondary);
    }

    h2 {
        color: var(--color-primary);
        font-weight: var(--font-weight-bold);
    }
</style>
```

---

**Versão 1.0** | Junho 2026 | Roncolato Studio
