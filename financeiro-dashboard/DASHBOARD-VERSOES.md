# 📊 Dashboard Financeiro - 2 Versões

Você tem **2 versões** do dashboard disponíveis, cada uma com um propósito diferente.

---

## 🎨 **Versão 1: COMPLETA (Dark Mode)**

**URL**: `http://localhost:3000`  
**Arquivo**: `/frontend/dashboard.html`  
**Estilo**: Dark mode + Cores vibrantes  
**Use para**: Análise detalhada e trabalho operacional

### Características:
✅ Interface escura (melhor para horas tardias)  
✅ Cores vibrantes para destaque  
✅ Gráficos com Chart.js  
✅ Todas as métricas e análises  
✅ Upload de arquivos  
✅ Filtros avançados  

### Layout:
```
┌─────────────────────────────────────┐
│  💰 Financeiro Dashboard            │
├─────────────────────────────────────┤
│  [4 Métricas]                       │
│                                     │
│  [Gráfico Receitas] [Gráfico Despesas]
│                                     │
│  [Análise por Categoria]            │
│  [Transações Recentes]              │
└─────────────────────────────────────┘
```

---

## 🌟 **Versão 2: INTEGRADA (Light Mode)**

**URL**: `http://localhost:3000/financeiro`  
**Arquivo**: `/frontend/dashboard-integrated.html`  
**Estilo**: Light mode + Design System Roncolato  
**Use para**: Integração visual com seu site

### Características:
✅ Light mode (padrão web moderno)  
✅ Design System Roncolato aplicado  
✅ Tipografia: Jost  
✅ Paleta: Cores do Roncolato (#F5C518 primary)  
✅ Comportamento: Transições suaves  
✅ Responsivo: Mobile-first  

### Design System Integrado:
```
Colors:
├── Primary: #F5C518 (Amarelo brand)
├── Background: #FFFFFF (Light)
├── Card: #FFFFFF (White cards)
├── Foreground: #2686 (Dark text)
├── Border: #9271 (Light borders)
└── Destructive: #6496 (Vermelho)

Typography:
├── Font: Jost (sans-serif)
├── Weights: 300, 700, 900
└── Size: clamp() responsivo

Spacing:
├── Padding sections: 80px 60px
├── Card padding: 30px
└── Gap grids: 2px (flush)

Interactions:
├── Hover: translateY(-2px)
├── Transition: var(--ease2)
├── Duration: 0.3s
└── Cursor: pointer
```

### Layout:
```
┌──────────────────────────────────────────┐
│  Financeiro                              │
│  Gestão de fluxo de caixa e análise      │
│  Dashboard operacional                   │
├──────────────────────────────────────────┤
│  [4 Métricas - Cards claros]             │
│                                          │
│  [Status: Fluxo crítico / Recomendações] │
│                                          │
│  ─── Análise Temporal ───                │
│  [Gráfico Receitas] [Gráfico Despesas]   │
│                                          │
│  ─── Por Categoria ───                   │
│  [Tabela com dados detalhados]           │
│                                          │
│  ─── Transações Recentes ───             │
│  [Tabela com 20 últimas transações]      │
└──────────────────────────────────────────┘
```

---

## 🎯 Qual Usar?

### Versão Completa (`/`) se você:
- [ ] Precisa de análise profunda
- [ ] Quer trabalhar com dados
- [ ] Não se importa com dark mode
- [ ] Precisa de todos os controles

### Versão Integrada (`/financeiro`) se você:
- [x] Quer integrar no site
- [x] Quer manter coerência visual
- [x] Precisa de light mode
- [x] Quer algo elegante e limpo

---

## 📱 Responsividade

### Versão Completa:
```
Desktop (> 768px):
└── Grid: 4 colunas (métricas)
    Grid: 2 colunas (gráficos)

Mobile (< 768px):
└── Grid: 1 coluna (tudo empilhado)
    Charts: 100% width
```

### Versão Integrada:
```
Desktop (> 768px):
└── Padding: 80px 60px
    Max-width: 1400px
    Grid: 2 colunas (gráficos)

Mobile (< 768px):
└── Padding: 40px 20px
    Responsive font sizes (clamp)
    Grid: 1 coluna
```

---

## 🔌 Integração com Site

Se você quer adicionar a **Versão Integrada** diretamente no seu site `/financeiro`:

### 1. Copie o arquivo:
```bash
cp financeiro-dashboard/frontend/dashboard-integrated.html public/pages/financeiro/index.html
```

### 2. Certifique-se que a API está rodando:
```bash
cd financeiro-dashboard
npm start
```

### 3. Acesse:
```
http://seusite.com/financeiro
```

---

## 🎨 Customizações Disponíveis

### Versão Completa - Personalizar cores:
Edite `/frontend/dashboard.html` na seção `<style>`:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Versão Integrada - Personalizar via Design System:
A versão integrada **já usa** o design system. Para personalizar:

1. Edite `globals.css` (afeta todo o site)
2. Ou sobrescreva variáveis CSS no `<style>`:
```css
:root {
    --primary: #SEU_COR;
    --destructive: #SEU_COR;
}
```

---

## 📊 Dados

**Ambas as versões usam a mesma API:**
```
GET http://localhost:3000/api/financeiro/dashboard
GET http://localhost:3000/api/financeiro/transacoes
GET http://localhost:3000/api/financeiro/relatorio
```

---

## 🚀 Próximos Passos

### Se quer usar a Versão Completa:
1. Acesse: `http://localhost:3000`
2. Analise os dados
3. Use para diagnóstico operacional

### Se quer usar a Versão Integrada:
1. Acesse: `http://localhost:3000/financeiro`
2. Verifique integração com design system
3. Considere integrar no site oficial

### Se quer ambas no site:
1. Integre a versão light em `/financeiro`
2. Mantenha a completa como dashboard interno

---

## 📝 Comparativo Rápido

| Feature | Completa | Integrada |
|---------|----------|-----------|
| URL | `/` | `/financeiro` |
| Modo | Dark | Light |
| Design System | Não | Sim |
| Gráficos | ✅ | ✅ |
| Tabelas | ✅ | ✅ |
| Status Visual | Básico | Avançado |
| Integração | Dashboard | Website |
| Mobile | Bom | Excelente |
| Coerência | — | Máxima |

---

**Servidor rodando?** Teste ambas as versões agora! 🚀
