# 🚀 Regras de Deployment — SITE RONCOLATO

## ⚡ Regra Ouro
**TODAS as páginas e subpáginas do SITE RONCOLATO devem ser deployadas via Vercel (rroncolatos-projects/roncolato)**

---

## 🔗 Configuração Vercel

**Projeto Vercel:** https://vercel.com/rroncolatos-projects/roncolato  
**Domínio:** rroncolato.com.br  
**Repositório GitHub:** github.com/rroncolatos/roncolato  
**Branch:** master (produção)

---

## 📋 Fluxo de Deployment

### 1. **Desenvolvimento Local**
```bash
# Fazer alterações nos arquivos
# Testar localmente em http://localhost:3011

# Quando pronto para publicar:
git add .
git commit -m "feat/fix: descrição clara"
```

### 2. **Push para GitHub**
```bash
# Configurar remote (uma única vez)
git remote add origin https://github.com/rroncolatos/roncolato.git

# Fazer push
git push origin master
```

### 3. **Deploy Automático**
- ✅ Vercel detecta automaticamente o push no GitHub
- ✅ Build automático acontece
- ✅ Site publicado em rroncolato.com.br em ~2-5 minutos

---

## 📁 Estrutura de URLs

| Pasta Local | URL Online |
|-------------|-----------|
| `/public/pages/proposta/proposta_bem_fast_apresentacao.html` | `rroncolato.com.br/proposta/bemfast` |
| `/public/pages/presenca/index.html` | `rroncolato.com.br/presenca` |
| `/public/pages/protetic/index.html` | `rroncolato.com.br/protetic` |
| `/public/pages/oratoria/index.html` | `rroncolato.com.br/oratoria` |
| `/index.html` | `rroncolato.com.br` |

> **Baseado em `vercel.json` rewrites**

---

## ✅ Propostas Publicadas

### BEM FAST - Consolidar Marca
- 📄 **Arquivo:** `/public/pages/proposta/proposta_bem_fast_apresentacao.html`
- 🌐 **URL:** `rroncolato.com.br/proposta/bemfast`
- 📅 **Data:** 2026-04-09
- 🎨 **Design System:** Tokens CSS + Componentes Reutilizáveis
- 📱 **Responsividade:** Mobile-first (480px, 768px)
- 🔍 **Status:** ✅ Publicado online

---

## 🔐 Notas Importantes

1. **Nunca modificar diretamente em Vercel** — Apenas via GitHub
2. **Sempre commitar com mensagens claras** — Facilita rastreabilidade
3. **Testar localmente antes de fazer push** — Evita erros em produção
4. **Manter vercel.json atualizado** — Para novos rewrites/páginas

---

## 🚨 Troubleshooting

### Proposta não aparece online?
```
1. Verificar se o arquivo está em /public/pages/proposta/
2. Verificar se o rewrite foi adicionado ao vercel.json
3. Fazer push e esperar 2-5 minutos pelo deploy automático
4. Limpar cache do navegador (Ctrl+Shift+Del)
```

### Push não funciona?
```
1. Verificar GitHub token/credenciais: git config --list
2. Usar SSH em vez de HTTPS se necessário
3. Verificar se você tem permissão no repositório
```

---

## 📝 Última Atualização
- **Data:** 2026-04-09
- **Por:** Claude Code + Rodrigo Roncolato
- **Proposta:** BEM FAST - Consolidar Marca como Líder em Beleza & Estética
