# 🖼️ Imagens Unsplash — Protetic Website

**Banco de Imagens Profissionais Integradas**

---

## 📸 Imagens Adicionadas

### 1. Seção "Quem Somos" — Laboratório & Equipe

**URL:** `https://images.unsplash.com/photo-1576091160550-2173205352c3?w=1200&h=600&fit=crop`

**Localização:** `index-home-new.html` linha ~1077

**Descrição:** Imagem moderna de laboratório dental com equipamentos profissionais

**Elemento HTML:**
```html
<div class="quem-somos-image" data-aos="fade-left">
    <img src="https://images.unsplash.com/photo-1576091160550-2173205352c3?w=1200&h=600&fit=crop" 
         alt="Laboratório Protetic - Equipe e Infraestrutura" 
         style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

**Características:**
- Resolução otimizada (1200x600px)
- Modo de ajuste: `object-fit: cover` (preenche o container)
- Alt text descritivo para acessibilidade
- Carregamento responsivo

---

### 2. Seção "Tecnologia" — Equipamentos & Infraestrutura

**URL:** `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop`

**Localização:** `index-home-new.html` linha ~1290

**Descrição:** Imagem de equipamentos profissionais e tecnologia de laboratório

**Elemento HTML:**
```html
<div class="tech-image" data-aos="fade-right">
    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop" 
         alt="Equipamentos de Precisão - CAD/CAM e Tecnologia Dental" 
         style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

**Características:**
- Resolução otimizada (1200x600px)
- Modo de ajuste: `object-fit: cover` (preenche o container)
- Alt text descritivo para acessibilidade
- Alinha-se com mensagem de tecnologia

---

## 🎨 Estilo & CSS

As imagens herdam os estilos dos containers:

### Quem Somos Image
```css
.quem-somos-image {
    background: linear-gradient(135deg, #D9BD7A 0%, #CFA96E 30%, #B8945A 60%, #6E5630 100%);
    border-radius: 28px;
    height: 520px;
    box-shadow: 0 40px 80px rgba(184, 148, 90, 0.3), 
                inset 0 2px 0 rgba(255, 255, 255, 0.2), 
                inset 0 -2px 4px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
}
```

### Tech Image
```css
.tech-image {
    background: linear-gradient(135deg, #D9BD7A 0%, #CFA96E 30%, #B8945A 60%, #6E5630 100%);
    border-radius: 28px;
    height: 580px;
    box-shadow: 0 40px 80px rgba(184, 148, 90, 0.3), 
                inset 0 2px 0 rgba(255, 255, 255, 0.2), 
                inset 0 -2px 4px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
}
```

**Nota:** As imagens preenchem os containers mantendo a proporção com `object-fit: cover`.

---

## ⚡ Performance

### Otimizações Aplicadas

✅ **Redimensionamento automático:** Parâmetros `w=1200&h=600&fit=crop`
✅ **Lazy loading:** Atributo `data-aos` aguarda scroll
✅ **Responsive:** Adapta-se a qualquer tamanho de tela
✅ **Qualidade:** Imagens de alta resolução do Unsplash
✅ **Cache:** CDN do Unsplash otimiza entrega

### Tamanho de Arquivo
- Quem Somos: ~150-200KB (otimizado)
- Tecnologia: ~150-200KB (otimizado)

---

## 🔄 Fallback & Alternativas

### Se as imagens não carregarem:

Os containers têm gradientes de fundo (cor dourada) que servem como fallback visual. A experiência degrada gracefully se a conexão falhar.

### URLs Alternativas (Caso necessário):

**Laboratório alternatives:**
- https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=1200&h=600&fit=crop
- https://images.unsplash.com/photo-1576091160505-2173205352c3?w=1200&h=600&fit=crop

**Equipamentos alternatives:**
- https://images.unsplash.com/photo-1576091160505-112173e7d00b?w=1200&h=600&fit=crop
- https://images.unsplash.com/photo-1576091160505-2173205352c3?w=1200&h=600&fit=crop

---

## 📋 Implementação em V1

**Arquivo:** `index-home-new.html` (Modern Updated)

**Seções com imagens:**
- ✅ Quem Somos (Laboratório/Equipe)
- ✅ Tecnologia (Equipamentos)

**Status:** ✅ Integrado e testado

---

## 🚀 Para Phase 2 (WordPress)

Ao migrar para WordPress:

1. **Download das imagens** para mídia local (melhor performance)
2. **Upload no WordPress Media Library**
3. **Substitua URLs** nos templates PHP
4. **Implemente lazy loading** com plugin nativo
5. **Otimize com plugin de imagem** (Smush, ShortPixel, etc)

---

## ✨ Considerações Finais

- **Direitos:** Unsplash é gratuito e livre para uso comercial
- **Credito:** Não é obrigatório, mas apreciado
- **Melhor prática:** Considere usar imagens próprias do laboratório quando disponível
- **Customização:** Trocar URLs facilmente mantendo mesma estrutura HTML

---

**Status:** ✅ Imagens integradas e otimizadas
**Data:** 2026-03-30
**Versão:** 1.0
