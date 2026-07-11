# 🚀 Como Publicar a Proposta BEM FAST Online

## Status Atual
✅ **Commit local feito:** "feat: adicionar proposta estratégica BEM FAST"  
❌ **Push para GitHub:** Aguardando autenticação

---

## 📋 Próximos Passos

### Opção 1: Push via SSH (Recomendado)

```bash
cd "C:\Users\rodri\Downloads\SITE RONCOLATO"

# Trocar remote para SSH (se ainda não está)
git remote set-url origin git@github.com:rroncolatos/roncolato.git

# Fazer push
git push origin master
```

### Opção 2: Push via HTTPS com Token

```bash
cd "C:\Users\rodri\Downloads\SITE RONCOLATO"

# Trocar remote para HTTPS
git remote set-url origin https://github.com/rroncolatos/roncolato.git

# Fazer push (vai pedir credenciais GitHub)
git push origin master
```

---

## ✅ Quando terminar:

1. Vercel detectará o push automaticamente
2. Build acontecerá (2-5 minutos)
3. Proposta estará online em: **rroncolato.com.br/proposta/bemfast**

---

## 🔗 Links Importantes

- **Vercel Dashboard:** https://vercel.com/rroncolatos-projects/roncolato
- **GitHub Repo:** https://github.com/rroncolatos/roncolato
- **Proposta Online:** https://rroncolato.com.br/proposta/bemfast (após push)

---

## 📝 Arquivo da Proposta

📄 `/public/pages/proposta/proposta_bem_fast_apresentacao.html`

Características:
- ✅ Design System com tokens CSS
- ✅ Responsividade mobile-first
- ✅ Foco em consolidação de marca BEM FAST
- ✅ Logo Roncolato integrada
- ✅ Performance otimizada

---

## 🛠️ Se houver problemas:

1. **Erro de autenticação?** → Configurar SSH key ou GitHub token
2. **Repositório não encontrado?** → Verificar se o repositório é público/privado
3. **Branch não existe?** → Usar `git push -u origin master` (cria branch se necessário)

---

## ✨ Regra Gravada

**A partir de agora, TODAS as páginas do SITE RONCOLATO usam este Vercel:**
- Domínio: **rroncolato.com.br**
- Projeto Vercel: **rroncolatos-projects/roncolato**
- Repositório: **github.com/rroncolatos/roncolato**
- Deploy: **Automático via GitHub push**

Documentação completa em: `DEPLOYMENT_RULES.md`
