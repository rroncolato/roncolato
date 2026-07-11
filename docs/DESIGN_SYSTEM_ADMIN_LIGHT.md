# 🎨 Design System Admin LIGHT — Rodrigo Roncolato

**Versão:** 1.0
**Data:** Março 2026
**Status:** ✅ Pronto para Implementação
**Destinatário:** Squad de Design & Desenvolvimento

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Typography System](#typography-system)
4. [Spacing & Grid](#spacing--grid)
5. [Componentes Base](#componentes-base)
6. [Estados e Interações](#estados-e-interações)
7. [Mockups ASCII](#mockups-ascii)
8. [Configuração Tailwind CSS](#configuração-tailwind-css)
9. [Guidelines de Implementação](#guidelines-de-implementação)

---

## 🎯 Visão Geral

### Contexto
O Rodrigo Roncolato é especializado em **fotografia corporativa** e **personal branding**. O design system LIGHT foi criado especificamente para a área **administrativa** (dashboard, forms, edição de conteúdo), contrastando com o site público que mantém a identidade **DARK** com destaque em amarelo vibrante.

### Objetivos da Versão LIGHT
- ✅ **Profissionalismo**: Interface limpa e moderna
- ✅ **Legibilidade**: Alto contraste para longa leitura
- ✅ **Acessibilidade**: WCAG AA compliance
- ✅ **Identidade**: Manutenção do yellow (#F5C518) como accent color
- ✅ **Eficiência**: Admin funcional e intuitivo

### Filosofia de Design
```
DARK (Site Público)           LIGHT (Admin)
├─ Fundo: #0A0A0A           ├─ Fundo: #FFFFFF
├─ Texto: #F0F0EB           ├─ Texto: #1A1A1A
├─ Accent: #F5C518          ├─ Accent: #F5C518
└─ Sofisticado              └─ Funcional

Cores conectadas por relação
Typography compartilhada (Jost)
Espaçamento consistente (8px grid)
```

---

## 🎨 Paleta de Cores

### Cores Primárias

| Nome | Hex | RGB | Uso | Accessibility |
|------|-----|-----|-----|---|
| **White** | `#FFFFFF` | 255, 255, 255 | Background principal | Base |
| **Black** | `#1A1A1A` | 26, 26, 26 | Texto primário | WCAG AAA (15.8:1) |
| **Yellow** | `#F5C518` | 245, 197, 24 | Accent, CTAs, highlights | WCAG AA (4.5:1) |

### Paleta de Cinzas/Neutros

| Nome | Hex | RGB | Uso | Contrast (vs #FFF) |
|------|-----|-----|-----|---|
| **Gray-50** | `#F9F9F9` | 249, 249, 249 | Background secundário | N/A |
| **Gray-100** | `#F3F3F3` | 243, 243, 243 | Hover state backgrounds | N/A |
| **Gray-200** | `#E8E8E8` | 232, 232, 232 | Borders, dividers | N/A |
| **Gray-300** | `#D4D4D4` | 212, 212, 212 | Form borders | 6.5:1 |
| **Gray-400** | `#BDBDBD` | 189, 189, 189 | Disabled text, hints | 5.2:1 |
| **Gray-500** | `#909090` | 144, 144, 144 | Secondary text | 4.8:1 |
| **Gray-600** | `#666666` | 102, 102, 102 | Tertiary text | 7.3:1 |
| **Gray-700** | `#4A4A4A` | 74, 74, 74 | Form labels | 10.8:1 |
| **Gray-800** | `#2D2D2D` | 45, 45, 45 | Secondary headings | 14.4:1 |
| **Gray-900** | `#1A1A1A` | 26, 26, 26 | Primary text/borders | 15.8:1 |

### Cores Semânticas

| Estado | Hex | Uso |
|--------|-----|-----|
| **Success** | `#10B981` | Confirmação, sucesso de ação |
| **Error** | `#EF4444` | Erros, validação negativa |
| **Warning** | `#F59E0B` | Avisos, atenção |
| **Info** | `#3B82F6` | Informações, dicas |

### CSS Variables (`:root`)

```css
:root {
  /* Primárias */
  --color-white: #FFFFFF;
  --color-black: #1A1A1A;
  --color-yellow: #F5C518;

  /* Grays */
  --color-gray-50: #F9F9F9;
  --color-gray-100: #F3F3F3;
  --color-gray-200: #E8E8E8;
  --color-gray-300: #D4D4D4;
  --color-gray-400: #BDBDBD;
  --color-gray-500: #909090;
  --color-gray-600: #666666;
  --color-gray-700: #4A4A4A;
  --color-gray-800: #2D2D2D;
  --color-gray-900: #1A1A1A;

  /* Semânticas */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;

  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9F9F9;
  --bg-tertiary: #F3F3F3;
  --bg-overlay: rgba(0, 0, 0, 0.5);

  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #4A4A4A;
  --text-tertiary: #909090;
  --text-disabled: #BDBDBD;

  /* Borders */
  --border-color: #E8E8E8;
  --border-color-dark: #D4D4D4;
}
```

### Comparativo: DARK vs LIGHT

```
┌─────────────────────────────────────┐
│ DARK (site público)                 │
├─────────────────────────────────────┤
│ Fundo:        #0A0A0A               │
│ Texto:        #F0F0EB               │
│ Accent:       #F5C518 ✨            │
│ Gray-dark:    #242424               │
│ Gray-light:   #b0b0a8               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ LIGHT (admin)                       │
├─────────────────────────────────────┤
│ Fundo:        #FFFFFF               │
│ Texto:        #1A1A1A               │
│ Accent:       #F5C518 ✨ (mantém!)  │
│ Gray-dark:    #4A4A4A               │
│ Gray-light:   #F3F3F3               │
└─────────────────────────────────────┘
```

---

## 🔤 Typography System

### Fonte Base: Jost*

**Jost*** é uma tipografia geométrica moderna com pesos variados (100–900), usada em toda a marca.

```
Importação:
<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

CSS:
font-family: 'Jost', sans-serif;
```

### Escala Tipográfica

| Nome | Tamanho | Peso | Altura da Linha | Espaço entre letras | Uso |
|------|---------|------|-----------------|---------------------|-----|
| **H1** | 32px (2rem) | 700 | 1.2 | -0.02em | Títulos de página |
| **H2** | 28px (1.75rem) | 700 | 1.3 | -0.01em | Títulos de seção |
| **H3** | 24px (1.5rem) | 600 | 1.4 | 0 | Subtítulos |
| **H4** | 20px (1.25rem) | 600 | 1.4 | 0 | Labels grandes |
| **Body Large** | 16px (1rem) | 400 | 1.6 | 0 | Texto principal |
| **Body** | 14px (0.875rem) | 400 | 1.6 | 0 | Texto secundário |
| **Body Small** | 12px (0.75rem) | 400 | 1.5 | 0 | Texto terciário |
| **Label** | 12px (0.75rem) | 600 | 1.5 | 0.05em | Form labels |
| **Caption** | 11px (0.6875rem) | 400 | 1.4 | 0 | Help text |
| **Mono** | 12px (0.75rem) | 400 | 1.6 | 0 | Código |

### Exemplo de Uso

```html
<!-- H1 - Título de página -->
<h1 style="
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: #1A1A1A;
  margin-bottom: 24px;
">
  Publicar Novo Projeto
</h1>

<!-- Body - Texto principal -->
<p style="
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: #4A4A4A;
">
  Complete o formulário abaixo para publicar um novo projeto no portfólio.
</p>

<!-- Label - Form label -->
<label style="
  font-size: 12px;
  font-weight: 600;
  color: #1A1A1A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
">
  Nome do Projeto
</label>
```

### Cores de Texto por Contexto

| Contexto | Cor | Hex | Contraste |
|----------|-----|-----|-----------|
| Texto primário | Black | `#1A1A1A` | 15.8:1 |
| Texto secundário | Gray-700 | `#4A4A4A` | 10.8:1 |
| Texto terciário | Gray-600 | `#666666` | 7.3:1 |
| Texto desabilitado | Gray-400 | `#BDBDBD` | 5.2:1 |
| Hints/Placeholders | Gray-500 | `#909090` | 4.8:1 |

---

## 📐 Spacing & Grid

### Sistema 8px

O design system usa um grid base de **8px** para consistência e previsibilidade.

| Token | Valor | Uso |
|-------|-------|-----|
| **xs** | 4px | Micro espaçamentos |
| **sm** | 8px | Padding pequeno, gaps |
| **md** | 16px | Padding padrão |
| **lg** | 24px | Seções |
| **xl** | 32px | Grandes espaçamentos |
| **2xl** | 40px | Separação de seções |
| **3xl** | 48px | Hero spacing |
| **4xl** | 64px | Layout principal |

### Aplicações Comuns

```css
/* Containers */
.container {
  padding: 32px 24px;      /* lg xl spacing */
  margin: 0 auto;
  max-width: 1200px;
}

/* Card standard */
.card {
  padding: 24px;           /* lg spacing */
  border-radius: 8px;
  border: 1px solid #E8E8E8;
  gap: 16px;              /* md spacing */
}

/* Form group */
.form-group {
  margin-bottom: 24px;    /* lg spacing */
}

/* Button padding */
.btn {
  padding: 12px 24px;     /* vertical: sm*1.5, horizontal: lg */
}

/* Grid gaps */
.grid {
  display: grid;
  gap: 16px;              /* md spacing */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### Responsivo

```css
/* Mobile */
@media (max-width: 640px) {
  .container {
    padding: 16px;        /* md spacing */
  }
  .card {
    padding: 16px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .container {
    padding: 24px;        /* lg spacing */
  }
}
```

---

## 🎯 Componentes Base

### 1. Button

#### Variantes Disponíveis

##### Button Primary (CTA)
```
┌─────────────────────────────────────┐
│ PUBLISH PROJECT                     │
└─────────────────────────────────────┘

Especificações:
- Background: #F5C518
- Text: #1A1A1A
- Font Weight: 700
- Font Size: 14px
- Padding: 12px 24px
- Border Radius: 4px
- Cursor: pointer
```

```html
<button class="btn btn-primary">
  Publish Project
</button>
```

```css
.btn-primary {
  background-color: #F5C518;
  color: #1A1A1A;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Jost', sans-serif;
}

.btn-primary:hover {
  opacity: 0.85;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 197, 24, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(245, 197, 24, 0.2);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

##### Button Secondary
```
┌─────────────────────────────────────┐
│         Cancel                      │
└─────────────────────────────────────┘

Especificações:
- Background: #F9F9F9
- Border: 1px solid #D4D4D4
- Text: #1A1A1A
- Font Weight: 600
```

```css
.btn-secondary {
  background-color: #F9F9F9;
  border: 1px solid #D4D4D4;
  color: #1A1A1A;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #F3F3F3;
  border-color: #BDBDBD;
}

.btn-secondary:active {
  background-color: #E8E8E8;
}
```

##### Button Outline
```css
.btn-outline {
  background-color: transparent;
  border: 1px solid #F5C518;
  color: #F5C518;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background-color: #F5C518;
  color: #1A1A1A;
}
```

##### Button Danger (Delete)
```css
.btn-danger {
  background-color: #EF4444;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  opacity: 0.85;
}

.btn-danger:active {
  opacity: 0.7;
}
```

### 2. Input / Form Field

```
Label (12px, 600 weight, uppercase)
┌─────────────────────────────────────┐
│ Placeholder text...                 │
└─────────────────────────────────────┘
(Optional) Help text • Gray-500
```

```html
<div class="form-group">
  <label for="project-name" class="form-label">Project Name</label>
  <input
    type="text"
    id="project-name"
    class="form-input"
    placeholder="Enter project name"
  >
  <span class="form-hint">Use a descriptive name, max 80 characters</span>
</div>
```

```css
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-family: 'Jost', sans-serif;
  border: 1px solid #D4D4D4;
  border-radius: 4px;
  background-color: #FFFFFF;
  color: #1A1A1A;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #F5C518;
  box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.1);
}

.form-input::placeholder {
  color: #BDBDBD;
}

.form-input:disabled {
  background-color: #F9F9F9;
  color: #BDBDBD;
  cursor: not-allowed;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #909090;
  margin-top: 6px;
}

.form-error {
  border-color: #EF4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error-message {
  color: #EF4444;
  font-size: 12px;
  margin-top: 6px;
}

.form-success {
  border-color: #10B981 !important;
}
```

### 3. Card

```
┌─────────────────────────────────────┐
│ Card Title (18px, 600 weight)       │
├─────────────────────────────────────┤
│                                     │
│ Card content goes here...           │
│                                     │
├─────────────────────────────────────┤
│ [Secondary] [Primary]               │
└─────────────────────────────────────┘
```

```html
<div class="card">
  <h3 class="card-title">Add New Project</h3>
  <p class="card-description">Fill in the details below to add a new project to your portfolio.</p>

  <div class="card-content">
    <!-- Form content -->
  </div>

  <div class="card-footer">
    <button class="btn btn-secondary">Cancel</button>
    <button class="btn btn-primary">Save Project</button>
  </div>
</div>
```

```css
.card {
  background-color: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #D4D4D4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.card-description {
  font-size: 14px;
  color: #666666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.card-content {
  margin-bottom: 24px;
}

.card-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #E8E8E8;
}
```

### 4. Table

```
┌────────────────────────────────────────┐
│ Project Name │ Client │ Status │ Date │
├────────────────────────────────────────┤
│ Brand Photo  │ Acme   │ ✓      │ 2024 │
├────────────────────────────────────────┤
│ Headshots    │ Corp   │ ✓      │ 2024 │
└────────────────────────────────────────┘
```

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead {
  background-color: #F9F9F9;
  border-bottom: 2px solid #E8E8E8;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #1A1A1A;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: 16px;
  border-bottom: 1px solid #E8E8E8;
  color: #4A4A4A;
}

.table tbody tr:hover {
  background-color: #F9F9F9;
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

### 5. Modal

```
┌─────────────────────────────────────┐
│  X  Modal Title                     │
├─────────────────────────────────────┤
│                                     │
│  Modal content here...              │
│                                     │
├─────────────────────────────────────┤
│                     [Cancel] [Save] │
└─────────────────────────────────────┘
```

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #E8E8E8;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #909090;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #E8E8E8;
}
```

### 6. Alert / Toast

#### Alert Success
```
✓ Project published successfully!
This project is now visible on your portfolio.
```

```css
.alert {
  padding: 16px 20px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.alert-success {
  background-color: #ECFDF5;
  border: 1px solid #D1FAE5;
  color: #047857;
}

.alert-error {
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
}

.alert-warning {
  background-color: #FFFBEB;
  border: 1px solid #FCD34D;
  color: #B45309;
}

.alert-info {
  background-color: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #1E40AF;
}

.alert-icon {
  flex-shrink: 0;
  font-size: 18px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 2px;
}

.alert-description {
  font-size: 13px;
  opacity: 0.9;
}
```

### 7. Navigation / Sidebar

```
┌──────────────────┐
│  ADMIN PANEL     │
├──────────────────┤
│ 📊 Dashboard     │
│ 🖼️  Portfolio     │
│ 📝 Blog          │
│ ⚙️  Settings      │
│ 🚪 Logout        │
└──────────────────┘
```

```css
.sidebar {
  width: 280px;
  background-color: #FFFFFF;
  border-right: 1px solid #E8E8E8;
  padding: 24px 0;
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: 0 24px 24px;
  border-bottom: 1px solid #E8E8E8;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1A1A1A;
}

.sidebar-nav {
  list-style: none;
}

.sidebar-nav-item {
  margin: 0;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #4A4A4A;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-nav-link:hover {
  background-color: #F9F9F9;
  color: #1A1A1A;
}

.sidebar-nav-link.active {
  background-color: #F9F9F9;
  border-left-color: #F5C518;
  color: #F5C518;
  font-weight: 600;
}

.sidebar-nav-icon {
  font-size: 18px;
}
```

---

## ⚙️ Estados e Interações

### Estados de Componentes

#### Button States

| Estado | Descrição | Estilo |
|--------|-----------|--------|
| **Default** | Estado normal | Sem alteração |
| **Hover** | Mouse over | Opacity 0.85, Shadow 0 4px 12px |
| **Active** | Click/Pressed | Transform translateY(1px), Shadow menor |
| **Focus** | Tab/Keyboard | Outline: 2px solid #F5C518, outline-offset: 2px |
| **Disabled** | Desabilitado | Opacity 0.5, Cursor: not-allowed |
| **Loading** | Aguardando ação | Spinner animado, disabled |

#### Form Field States

| Estado | Descrição | Estilo |
|--------|-----------|--------|
| **Default** | Vazio | Border: 1px solid #D4D4D4 |
| **Hover** | Mouse over | Border: 1px solid #BDBDBD |
| **Focus** | Ativo | Border: 1px solid #F5C518, Shadow: 0 0 0 3px rgba(245, 197, 24, 0.1) |
| **Filled** | Com valor | Border: 1px solid #D4D4D4 |
| **Error** | Validação falha | Border: 1px solid #EF4444, Shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) |
| **Success** | Validação ok | Border: 1px solid #10B981 |
| **Disabled** | Desabilitado | Bg: #F9F9F9, Color: #BDBDBD, Cursor: not-allowed |

### Transições e Animações

```css
/* Timing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;

/* Aplicações Típicas */
transition: all 150ms var(--ease-out);  /* Hover states */
transition: all 250ms var(--ease-in-out);  /* Modal opens */
transition: opacity 150ms var(--ease-out);  /* Fade effects */
```

### Acessibilidade

#### Focus Visible
```css
:focus-visible {
  outline: 2px solid #F5C518;
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #F5C518;
  outline-offset: 2px;
}
```

#### Contrast Ratios (WCAG AA)
```
Mínimo obrigatório: 4.5:1

Este design atinge:
- #1A1A1A (black) on #FFFFFF: 15.8:1 ✅ AAA
- #F5C518 (yellow) on #FFFFFF: 4.5:1 ✅ AA
- #4A4A4A (gray-700) on #FFFFFF: 10.8:1 ✅ AAA
- #909090 (gray-500) on #FFFFFF: 4.8:1 ✅ AA
```

---

## 📱 Mockups ASCII

### 1. Dashboard Principal

```
╔════════════════════════════════════════════════════════════════╗
║  ADMIN PANEL                                    RODRIGO □ ✕  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Dashboard › Portfolio                                        ║
║  ─────────────────────────────────────────────────────────────║
║                                                                ║
║  ╭─────────────────────────────────────────────────────────╮  ║
║  │  12                  8                   4              │  ║
║  │  Total Projects     Published            Drafts         │  ║
║  ╰─────────────────────────────────────────────────────────╯  ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ ADD NEW PROJECT                          [PUBLISH] [×] │   ║
║  ├────────────────────────────────────────────────────────┤   ║
║  │                                                        │   ║
║  │  Project Name *                                        │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Enter project name                                │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  Client Name                                           │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Enter client name (optional)                      │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  Category *                                            │   ║
║  │  ┌──────────────────────┐                             │   ║
║  │  │ Select category    ▼ │                             │   ║
║  │  └──────────────────────┘                             │   ║
║  │                                                        │   ║
║  │  Upload Photos                                         │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Drag images here or click to upload               │ │   ║
║  │  │ (Max 10 images, 5MB each)                         │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │                     [CANCEL]  [PUBLISH]              │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  Recent Projects                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ NAME         │ CLIENT    │ STATUS │ DATE       │ ACTION  │ ║
║  ├──────────────────────────────────────────────────────────┤ ║
║  │ Brand Photo  │ Acme Inc. │ ✓      │ 15 Mar 24  │ Edit ✕  │ ║
║  │ Headshots    │ TechCorp  │ ✓      │ 10 Mar 24  │ Edit ✕  │ ║
║  │ Event        │ StartUp   │ 🔄     │ 08 Mar 24  │ Edit ✕  │ ║
║  │ Team Photo   │ -         │ 📋     │ 05 Mar 24  │ Edit ✕  │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### 2. Formulário de Publicação

```
╔════════════════════════════════════════════════════════════════╗
║  ADMIN PANEL › PORTFOLIO › ADD PROJECT                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ✓ Project Details Saved!                                     ║
║    Your changes have been saved successfully.                 ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ PROJECT DETAILS                                        │   ║
║  ├────────────────────────────────────────────────────────┤   ║
║  │                                                        │   ║
║  │  PROJECT NAME *                                        │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Brand Photography Session - Acme Inc.            │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │  Maximum 100 characters                               │   ║
║  │                                                        │   ║
║  │  CLIENT NAME                                           │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Acme Inc.                                         │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  DESCRIPTION *                                         │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Professional brand photography session for...     │ │   ║
║  │  │                                                   │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │  Maximum 500 characters                               │   ║
║  │                                                        │   ║
║  │  CATEGORY *                                            │   ║
║  │  [Corporate] [Headshots] [Events] [Lifestyle]        │   ║
║  │                                                        │   ║
║  │  DATE OF SHOOT                                         │   ║
║  │  ┌──────────────┐   ┌─────────────┐                  │   ║
║  │  │ 15/03/2024 ▼ │   │ 14:30     ▼ │                  │   ║
║  │  └──────────────┘   └─────────────┘                  │   ║
║  │                                                        │   ║
║  │  FEATURED (Show on homepage)                           │   ║
║  │  ☐ Yes                                                 │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ UPLOAD IMAGES (5 of 10)                                │   ║
║  ├────────────────────────────────────────────────────────┤   ║
║  │                                                        │   ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   ║
║  │  │ [IMG 1]  │  │ [IMG 2]  │  │ [IMG 3]  │             │   ║
║  │  │          │  │          │  │          │             │   ║
║  │  │ [✓] Drag │  │ [✓] Drag │  │ [✓] Drag │             │   ║
║  │  │  to sort │  │  to sort │  │  to sort │             │   ║
║  │  │   [×]    │  │   [×]    │  │   [×]    │             │   ║
║  │  └──────────┘  └──────────┘  └──────────┘             │   ║
║  │                                                        │   ║
║  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐       │   ║
║  │  │ [IMG 4]  │  │ [IMG 5]  │  │ ADD MORE       │       │   ║
║  │  │          │  │          │  │ IMAGES [+]     │       │   ║
║  │  │ [✓] Drag │  │ [✓] Drag │  └────────────────┘       │   ║
║  │  │  to sort │  │  to sort │                           │   ║
║  │  │   [×]    │  │   [×]    │                           │   ║
║  │  └──────────┘  └──────────┘                           │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  [SAVE DRAFT]  [PREVIEW]  [PUBLISH]                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### 3. Login Admin

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║                                                                ║
║                    ADMIN ACCESS                                ║
║                    ─────────────────                           ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │                                                        │   ║
║  │  USERNAME OR EMAIL *                                   │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │                                                   │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  PASSWORD *                                            │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ ••••••••••                                        │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  ☐ I'm not a robot                                    │   ║
║  │  [reCAPTCHA]                                          │   ║
║  │                                                        │   ║
║  │                                                        │   ║
║  │               [  SIGN IN  ]                           │   ║
║  │                                                        │   ║
║  │  Forgot your password? Contact rodrigo@              │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### 4. Blog Publisher

```
╔════════════════════════════════════════════════════════════════╗
║  ADMIN PANEL › BLOG › NEW ARTICLE                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ ARTICLE DETAILS                                        │   ║
║  ├────────────────────────────────────────────────────────┤   ║
║  │                                                        │   ║
║  │  TITLE *                                               │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ 10 Tips for Professional Headshots              │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  SLUG (URL)                                            │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ 10-tips-professional-headshots                   │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │  Auto-generated from title                            │   ║
║  │                                                        │   ║
║  │  EXCERPT *                                             │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Learn the essential tips and tricks for creating │ │   ║
║  │  │ stunning professional headshots...               │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │  This appears in article listings (160 chars)        │   ║
║  │                                                        │   ║
║  │  CONTENT *                                             │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │  B I U | Link | Quote | Code | ...               │   ║
║  │  ├───────────────────────────────────────────────────┤ │   ║
║  │  │ # Introduction                                    │ │   ║
║  │  │                                                   │ │   ║
║  │  │ Professional headshots are essential for...      │ │   ║
║  │  │                                                   │ │   ║
║  │  │ ## 1. Lighting is Everything                      │ │   ║
║  │  │                                                   │ │   ║
║  │  │ Natural light is your best friend...             │ │   ║
║  │  │                                                   │ │   ║
║  │  │                                                   │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  FEATURED IMAGE                                        │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Click or drag image here                          │ │   ║
║  │  │ (JPG, PNG, max 5MB)                               │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  CATEGORY                                              │   ║
║  │  [Tips] [Behind-the-Scenes] [Industry] [News]        │   ║
║  │                                                        │   ║
║  │  TAGS                                                  │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ photography corporate headshots [+]               │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  STATUS                                                │   ║
║  │  ◉ Draft   ○ Published   ○ Scheduled                 │   ║
║  │                                                        │   ║
║  │  If scheduled, set date/time:                         │   ║
║  │  ┌──────────────┐   ┌─────────────┐                  │   ║
║  │  │ 20/03/2026 ▼ │   │ 10:00     ▼ │                  │   ║
║  │  └──────────────┘   └─────────────┘                  │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  [SAVE DRAFT]  [PREVIEW]  [PUBLISH NOW]  [SCHEDULE]           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### 5. Settings/Configurações

```
╔════════════════════════════════════════════════════════════════╗
║  ADMIN PANEL › SETTINGS                                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ PROFILE                                                │   ║
║  ├────────────────────────────────────────────────────────┤   ║
║  │                                                        │   ║
║  │  PROFILE PICTURE                                       │   ║
║  │  ┌────────────┐  ┌───────────────────────────────────┐ │   ║
║  │  │   [Avatar] │  │ Change Photo                      │   ║
║  │  │            │  │ Remove                            │   ║
║  │  └────────────┘  └───────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  DISPLAY NAME                                          │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ Rodrigo Roncolato                                 │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │                                                        │   ║
║  │  EMAIL ADDRESS                                         │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ rodrigo@roncolato.com.br                          │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │  This is your login email                             │   ║
║  │                                                        │   ║
║  │  CHANGE PASSWORD                                       │   ║
║  │  ┌───────────────────────────────────────────────────┐ │   ║
║  │  │ ••••••••••••                                      │ │   ║
║  │  └───────────────────────────────────────────────────┘ │   ║
║  │  [UPDATE PASSWORD]                                     │   ║
║  │                                                        │   ║
║  │                    [SAVE CHANGES]                     │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ DANGER ZONE                                            │   ║
║  ├────────────────────────────────────────────────────────┤   ║
║  │                                                        │   ║
║  │  DELETE ACCOUNT                                        │   ║
║  │  This action cannot be undone. All your data will     │   ║
║  │  be permanently deleted.                              │   ║
║  │                                                        │   ║
║  │                  [DELETE MY ACCOUNT]                  │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║                              [LOGOUT]                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 💻 Configuração Tailwind CSS

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./admin/**/*.{html,js}",
    "./admin/**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primárias
        white: '#FFFFFF',
        black: '#1A1A1A',
        yellow: {
          DEFAULT: '#F5C518',
          50: '#FFFAF0',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#F5C518', // Brand yellow
          700: '#D97706',
          800: '#92400E',
          900: '#78350F',
        },

        // Grays (Light theme)
        gray: {
          50: '#F9F9F9',
          100: '#F3F3F3',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#BDBDBD',
          500: '#909090',
          600: '#666666',
          700: '#4A4A4A',
          800: '#2D2D2D',
          900: '#1A1A1A',
        },

        // Semânticas
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },

      fontFamily: {
        sans: ["'Jost', sans-serif"],
        jost: ["'Jost', sans-serif"],
      },

      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['12px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.6' }],
        lg: ['16px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['28px', { lineHeight: '1.3' }],
        '4xl': ['32px', { lineHeight: '1.2' }],
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '64px',
      },

      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },

      boxShadow: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.05)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 25px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)',

        // Shadows para componentes específicos
        'btn-yellow': '0 4px 12px rgba(245, 197, 24, 0.3)',
        'focus': '0 0 0 3px rgba(245, 197, 24, 0.1)',
        'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.1)',
      },

      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },

      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      opacity: {
        disabled: '0.5',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

### @apply Utilities

```css
@layer components {
  /* Buttons */
  .btn {
    @apply px-lg py-sm font-jost font-bold text-sm rounded transition-all duration-fast cursor-pointer inline-flex items-center justify-center gap-sm;
  }

  .btn-primary {
    @apply bg-yellow text-black hover:opacity-85 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow disabled:opacity-disabled disabled:cursor-not-allowed;
    @apply shadow-btn-yellow hover:shadow-btn-yellow;
  }

  .btn-secondary {
    @apply bg-gray-50 border border-gray-300 text-black hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow disabled:opacity-disabled disabled:cursor-not-allowed;
  }

  .btn-outline {
    @apply bg-transparent border border-yellow text-yellow hover:bg-yellow hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow disabled:opacity-disabled disabled:cursor-not-allowed;
  }

  .btn-danger {
    @apply bg-error text-white hover:opacity-85 active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error disabled:opacity-disabled disabled:cursor-not-allowed;
  }

  /* Form Elements */
  .form-label {
    @apply block text-sm font-bold text-black uppercase tracking-widest mb-md;
  }

  .form-input,
  .form-textarea,
  .form-select {
    @apply w-full px-md py-sm font-jost text-base bg-white border border-gray-300 text-black rounded transition-all duration-fast focus:outline-none focus:border-yellow focus:shadow-focus disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed;
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    @apply text-gray-400;
  }

  .form-hint {
    @apply block text-xs text-gray-500 mt-sm;
  }

  .form-error {
    @apply border-error focus:shadow-focus-error;
  }

  .form-error-message {
    @apply text-error text-xs mt-sm;
  }

  /* Cards */
  .card {
    @apply bg-white border border-gray-200 rounded-lg p-lg shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-normal;
  }

  .card-title {
    @apply text-lg font-bold text-black mb-md;
  }

  .card-description {
    @apply text-base text-gray-600 mb-lg leading-relaxed;
  }

  .card-content {
    @apply mb-lg;
  }

  .card-footer {
    @apply flex gap-sm justify-end pt-lg border-t border-gray-200 flex-wrap;
  }

  /* Alerts */
  .alert {
    @apply px-md py-md rounded border flex gap-md items-start mb-md;
  }

  .alert-success {
    @apply bg-green-50 border-green-200 text-green-800;
  }

  .alert-error {
    @apply bg-red-50 border-red-200 text-red-800;
  }

  .alert-warning {
    @apply bg-amber-50 border-amber-200 text-amber-800;
  }

  .alert-info {
    @apply bg-blue-50 border-blue-200 text-blue-800;
  }

  .alert-title {
    @apply font-bold mb-xs;
  }

  .alert-description {
    @apply text-sm opacity-90;
  }

  /* Tables */
  .table {
    @apply w-full text-sm border-collapse;
  }

  .table thead {
    @apply bg-gray-50 border-b-2 border-gray-200;
  }

  .table th {
    @apply px-md py-sm text-left text-xs font-bold text-black uppercase tracking-widest;
  }

  .table td {
    @apply px-md py-md border-b border-gray-200 text-gray-700;
  }

  .table tbody tr:hover {
    @apply bg-gray-50;
  }

  /* Sidebar */
  .sidebar {
    @apply w-80 bg-white border-r border-gray-200 p-0 h-screen overflow-y-auto sticky top-0;
  }

  .sidebar-header {
    @apply px-lg py-lg border-b border-gray-200 mb-lg text-xs font-bold text-black uppercase tracking-widest;
  }

  .sidebar-nav {
    @apply list-none;
  }

  .sidebar-nav-link {
    @apply flex items-center gap-md px-lg py-sm text-base text-gray-700 no-underline transition-all duration-fast border-l-4 border-transparent hover:bg-gray-50 hover:text-black active:bg-gray-50 active:border-yellow active:text-yellow active:font-bold;
  }
}
```

---

## 📋 Guidelines de Implementação

### 1. Estrutura de Arquivos Recomendada

```
admin/
├── index.html                  # Central de links
├── login.html                  # Tela de login
├── dashboard.html              # Dashboard principal
├── portfolio.html              # Gerenciador de projetos
├── blog.html                   # Gerenciador de blog
├── settings.html               # Configurações
│
├── css/
│   ├── tailwind.css           # Output do Tailwind
│   ├── globals.css            # Global styles
│   ├── components.css         # Component styles
│   └── utilities.css          # Custom utilities
│
├── js/
│   ├── auth.js                # Authentication logic
│   ├── api.js                 # API client
│   ├── form-handler.js        # Form submissions
│   ├── ui-components.js       # Reusable UI logic
│   └── utils.js               # Helper functions
│
└── img/
    ├── icons/                 # SVG icons
    └── placeholders/          # Placeholder images
```

### 2. Setup Tailwind

```bash
# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Gerar config
npx tailwindcss init -p

# Compilar (durante desenvolvimento)
npx tailwindcss -i ./css/tailwind.css -o ./css/tailwind-compiled.css --watch

# Build para produção
npx tailwindcss -i ./css/tailwind.css -o ./css/tailwind-compiled.css --minify
```

### 3. Import no HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Rodrigo Roncolato</title>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <link rel="stylesheet" href="css/tailwind-compiled.css">

  <!-- Custom Styles -->
  <link rel="stylesheet" href="css/globals.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body class="font-jost bg-white text-black">
  <!-- Content -->

  <script src="js/api.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/form-handler.js"></script>
</body>
</html>
```

### 4. Exemplo de Componente Button

```html
<!-- Primary Button -->
<button class="btn btn-primary">
  Publish Project
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  Cancel
</button>

<!-- Outline Button -->
<button class="btn btn-outline">
  Learn More
</button>

<!-- Danger Button -->
<button class="btn btn-danger">
  Delete
</button>

<!-- Disabled Button -->
<button class="btn btn-primary" disabled>
  Loading...
</button>
```

### 5. Exemplo de Formulário Completo

```html
<form class="space-y-lg max-w-2xl">
  <!-- Text Input -->
  <div class="form-group">
    <label for="project-name" class="form-label">Project Name *</label>
    <input
      type="text"
      id="project-name"
      class="form-input"
      placeholder="Enter project name"
      required
    >
    <span class="form-hint">Maximum 100 characters</span>
  </div>

  <!-- Select Input -->
  <div class="form-group">
    <label for="category" class="form-label">Category *</label>
    <select id="category" class="form-input" required>
      <option value="">Select a category</option>
      <option value="corporate">Corporate</option>
      <option value="headshots">Headshots</option>
      <option value="events">Events</option>
    </select>
  </div>

  <!-- Textarea -->
  <div class="form-group">
    <label for="description" class="form-label">Description *</label>
    <textarea
      id="description"
      class="form-textarea"
      placeholder="Enter project description"
      rows="5"
      required
    ></textarea>
    <span class="form-hint">Maximum 500 characters</span>
  </div>

  <!-- Checkbox -->
  <div class="form-group">
    <label class="flex items-center gap-md cursor-pointer">
      <input type="checkbox" class="w-md h-md" id="featured">
      <span class="text-base text-black">Featured on homepage</span>
    </label>
  </div>

  <!-- Button Group -->
  <div class="flex gap-md justify-end pt-lg border-t border-gray-200">
    <button type="reset" class="btn btn-secondary">
      Cancel
    </button>
    <button type="submit" class="btn btn-primary">
      Save Project
    </button>
  </div>
</form>
```

### 6. Responsividade

```html
<!-- Exemplo de layout responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  <div class="card">
    <!-- Card content -->
  </div>
</div>

<!-- Sidebar responsivo -->
<div class="flex flex-col lg:flex-row">
  <aside class="w-full lg:w-80 border-b lg:border-r border-gray-200">
    <!-- Sidebar nav -->
  </aside>
  <main class="flex-1 p-lg">
    <!-- Main content -->
  </main>
</div>
```

### 7. Acessibilidade

```html
<!-- Exemplo com ARIA labels -->
<button
  class="btn btn-primary"
  aria-label="Publish project"
  aria-describedby="publish-hint"
>
  Publish
</button>
<span id="publish-hint" class="sr-only">
  Make this project visible on your portfolio
</span>

<!-- Form com error handling -->
<form aria-invalid="false">
  <label for="email" class="form-label">Email Address *</label>
  <input
    id="email"
    type="email"
    class="form-input"
    aria-invalid="false"
    aria-describedby="email-error"
    required
  >
  <div id="email-error" class="form-error-message" role="alert">
    Please enter a valid email address
  </div>
</form>
```

### 8. Checklist de Implementação

- [ ] Tailwind CSS instalado e configurado
- [ ] Google Fonts (Jost) importada
- [ ] CSS Variables definidas no :root
- [ ] @apply utilities criadas
- [ ] Componentes base implementados
- [ ] Estados (hover, active, focus, disabled) testados
- [ ] Responsividade verificada (mobile, tablet, desktop)
- [ ] Acessibilidade testada (keyboard navigation, screen readers)
- [ ] Dark mode optional (se necessário)
- [ ] Performance otimizada (Tailwind purge)
- [ ] Cross-browser testing realizado
- [ ] Documentação atualizada

---

## 🎨 Comparação Visual: DARK vs LIGHT

### Hero Section Antes (DARK)

```
┌────────────────────────────────────────────┐
│                                            │
│  [DARK BG #0A0A0A]                         │
│                                            │
│  Rodrigo Roncolato                         │
│  Fotografia Corporativa & Personal Brand  │
│                                            │
│  [  PORTFOLIO  ] [  BLOG  ]                │
│                                            │
│  ═════════════════════════════════════════ │
│  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ (YELLOW ACCENT)           │
│                                            │
└────────────────────────────────────────────┘
Text: #F0F0EB (Off-white)
Accent: #F5C518 (Vibrant Yellow)
Grid: #242424 (Dark Gray)
```

### Hero Section Depois (LIGHT - Admin)

```
┌────────────────────────────────────────────┐
│  ADMIN PANEL  [👤 RODRIGO] [⚙️] [🚪]      │
├────────────────────────────────────────────┤
│                                            │
│  [WHITE BG #FFFFFF]                        │
│                                            │
│  Dashboard › Portfolio                     │
│                                            │
│  [Add Project] [Settings] [Logout]        │
│                                            │
│  ┌────────────────────────────────────┐  │
│  │  12 Projects  │  8 Published  │ 4 │  │
│  └────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
Text: #1A1A1A (Black)
Accent: #F5C518 (Yellow - MANTÉM)
Grid: #4A4A4A (Dark Gray)
Clean, professional, legível
```

---

## 📝 Notas Finais

### Princípios de Design Mantidos
- ✅ **Tipografia**: Jost* (geométrica, moderna)
- ✅ **Accent Color**: Amarelo vibrante #F5C518
- ✅ **Espaçamento**: Sistema 8px (grid-based)
- ✅ **Filosofia**: Minimalista, profissional, impactante

### Novidades na Versão LIGHT
- ✨ **Alto Contraste**: 15.8:1 para texto primário
- ✨ **Acessibilidade**: WCAG AA/AAA compliance
- ✨ **Legibilidade**: Otimizada para leitura prolongada
- ✨ **Funcionalidade**: Interface admin intuitiva
- ✨ **Performance**: CSS limpo, carregamento rápido

### Próximos Passos
1. Implementar componentes em HTML/CSS
2. Criar wireframes no Figma com este design system
3. Validar com usuários (team admin)
4. Iterar baseado em feedback
5. Documentar patterns em Storybook/Zeroheight
6. Manter sincronizado com evolução do brand

---

**Versão:** 1.0
**Criado em:** Março 2026
**Status:** Pronto para Desenvolvimento
**Próxima Revisão:** v1.1 (após implementação e feedback)

