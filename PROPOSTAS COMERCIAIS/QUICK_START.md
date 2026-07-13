# ⚡ Quick Start - Propostas Comerciais

**Versão resumida para criar uma proposta rapidinho.**

---

## 3 Passos Principais (Com Squads)

### 1️⃣ Ativar Squads para Briefing
```bash
@copy-chief diagnose
@hormozi-chief business-strategy
# Output: Problem Statement + Pricing Framework
```

### 2️⃣ Criar Design com Design Squad
```bash
@design-chief create-design-system
@brand-chief audit-brand-alignment
# Output: Design System + Componentes
```

### 3️⃣ Redação com Copy Squad
```bash
@copy-chief full-copy-project
# Output: Copy integrada por especialista
```

**OU rápido (sem squads):**

Abra o arquivo HTML e substitua:
- `[NOME DO CLIENTE]` → Nome real
- `[Tipo de Serviço]` → Sessão foto / Branding / etc
- Seções de conteúdo
- Imagens
- Preços

---

## ✅ Checklist Mini (Antes de Subir)

```
□ Sem erros ortográficos
□ Imagens carregam OK
□ Links funcionam (WhatsApp, email)
□ Responsivo em mobile
□ Preços corretos
□ Cliente aprovou
□ Em pasta final/
```

---

## 🎨 Cores Padrão

```css
Preto: #1a1a1a
Branco: #ffffff
Cinza: #f9f9f9
```

---

## 🚀 Deploy (Quando Aprovado)

```bash
# Copiar para a pasta public
cp -r PROPOSTAS\ COMERCIAIS/projetos/nome-cliente/final/ \
       public/proposta/nome-cliente/

# Fazer commit
git add public/proposta/nome-cliente/
git commit -m "feat: proposta comercial - nome-cliente"
git push

# Pronto! URL: rroncolato.com.br/proposta/nome-cliente
```

---

## 📁 Estrutura Final

```
PROPOSTAS COMERCIAIS/
├── GUIA_PROPOSTAS.md           ← Leia para tudo
├── CHECKLIST_PRE_DEPLOY.md     ← Use antes de subir
├── QUICK_START.md              ← Este arquivo
├── templates/
│   └── template-proposta.html  ← Copie este
└── projetos/
    └── novo-cliente/
        ├── v1/
        ├── v2/
        └── final/              ← Só suba isto
```

---

## 🔑 Componentes Obrigatórios

1. **Capa** - Logo + Nome cliente
2. **Índice** - Sumário de seções
3. **Sobre Roncolato** - Apresentação breve
4. **Briefing** - Problema + Objetivos
5. **Solução** - Como vamos resolver
6. **Escopo** - O que será entregue
7. **Timeline** - Fases e prazos
8. **Portfólio** - 3+ casos similares
9. **Investimento** - Preços e pagamento
10. **CTA** - Próximos passos + contato

---

## 📞 Contato Padrão (Footer)

```
Email: rodrigo@rroncolato.com
WhatsApp: https://wa.me/55[DDD][NUMERO]
Site: rroncolato.com.br
```

---

## 🚫 Nunca Faça Isto

❌ Suba proposta incompleta  
❌ Suba com erros ortográficos  
❌ Sem cliente aprovar  
❌ Sem passar pelo checklist  
❌ Com imagens muito pesadas  

---

## 💾 Naming Convention

```
✅ silvano-portrait/
✅ lara-brenner-branding/
✅ novo-cliente-2026/

❌ cliente1/
❌ PROPOSTA NOVO/
❌ proposta_xyz/
```

Padrão: `nome-sobrenome` (lowercase, hífens)

---

## 📚 Documentos Importantes

| Arquivo | Para Quê |
|---------|----------|
| **GUIA_PROPOSTAS.md** | Instruções completas |
| **CHECKLIST_PRE_DEPLOY.md** | Validar antes de subir |
| **assets/BRAND_GUIDELINES.md** | Cores, fonts, estilos |
| **templates/template-proposta.html** | Copie e customize |
| **README.md** | Visão geral da pasta |

---

## 🎯 Fluxo Resumido

```
Novo Cliente → Pasta (v1/) → Template → Conteúdo
    ↓
Revisar → Checklist → Aprovar (v1/) → Copiar (final/)
    ↓
Cliente Aprova? SIM → Deploy → URL Live
                  NÃO → Revise (v2/) → Repita
```

---

**Pronto!** Leia `GUIA_PROPOSTAS.md` para detalhes completos.

Dúvidas? Email: rodrigo@rroncolato.com
