# ✅ Checklist de Implementação - Área Admin

## 🎯 Fase 1: Setup Local (Desenvolvimento)

- [ ] **Arquivos criados**
  - [ ] `/admin/index.html` - Página central admin
  - [ ] `/admin/login.html` - Login com CAPTCHA
  - [ ] `/admin/dashboard.html` - Painel de publicação
  - [ ] `/api/admin/auth.js` - API de autenticação
  - [ ] `/api/admin/add-project.js` - API de projetos
  - [ ] `/api/admin/add-article.js` - API de artigos

- [ ] **Documentação criada**
  - [ ] `README_ADMIN.md` - Documentação completa
  - [ ] `QUICK_START_ADMIN.md` - Guia rápido
  - [ ] `ARCHITECTURE_ADMIN.md` - Arquitetura técnica
  - [ ] `.env.example` - Variáveis de ambiente
  - [ ] `.gitignore` - Atualizado com `.env`

- [ ] **Variáveis de ambiente**
  - [ ] Criar arquivo `.env` na raiz
  - [ ] Adicionar `JWT_SECRET` (min 32 caracteres)
  - [ ] Adicionar `ADMIN_USER` e `ADMIN_PASS`
  - [ ] Adicionar `RECAPTCHA_SECRET`
  - [ ] **NUNCA commitar `.env` no Git**

---

## 🧪 Fase 2: Testes em Desenvolvimento

### Login
- [ ] Acessar `http://localhost:8080/admin/login.html`
- [ ] Botão reCAPTCHA aparece?
- [ ] Credenciais incorretas → Erro?
- [ ] Credenciais corretas → Redireciona para dashboard?
- [ ] Token armazenado em localStorage?

### Dashboard
- [ ] Página carrega após login?
- [ ] Abas "Portfólio" e "Blog" funcionam?
- [ ] Formulários validam campos obrigatórios?
- [ ] Botão logout funciona?

### Publicar Projeto
- [ ] [ ] Preencher todos os campos
  - [ ] Nome do cliente
  - [ ] Ano
  - [ ] Cliente
  - [ ] Categoria (pode selecionar)
  - [ ] Entregável
  - [ ] Descrição
  - [ ] Link (opcional)

- [ ] [ ] Imagens
  - [ ] Drag & drop funciona?
  - [ ] Botão de seleção funciona?
  - [ ] Capa aparece no dropdown?

- [ ] [ ] Envio
  - [ ] Clique em "Adicionar Projeto"
  - [ ] Mensagem de sucesso aparece?
  - [ ] Projeto aparece no portfólio?

### Publicar Artigo
- [ ] [ ] Preencher todos os campos
  - [ ] Título
  - [ ] Resumo
  - [ ] Categoria
  - [ ] Data (seletor funciona?)
  - [ ] Tempo de leitura
  - [ ] Conteúdo com formatação:
    - [ ] `##Título` vira `<h2>`?
    - [ ] `""citação""` vira `<blockquote>`?
    - [ ] Parágrafos normais viram `<p>`?

- [ ] [ ] Envio
  - [ ] Clique em "Publicar Artigo"
  - [ ] Mensagem de sucesso?
  - [ ] Artigo aparece no blog?

---

## 📤 Fase 3: Deploy no Vercel

### Credenciais Seguras
- [ ] Mudar `ADMIN_USER` de "admin"
- [ ] Mudar `ADMIN_PASS` de "senha123"
- [ ] Gerar novo `JWT_SECRET` (mín 32 chars)
- [ ] Criar reCAPTCHA v3 próprio (não usar teste)

### reCAPTCHA v3
- [ ] [ ] Criar site em https://www.google.com/recaptcha/admin/create
  - [ ] Nome: "Site Roncolato"
  - [ ] Tipo: reCAPTCHA v3
  - [ ] Domínios: Seu domínio (ex: rroncolato.com.br)

- [ ] [ ] Adicionar chaves
  - [ ] Site Key em `/admin/login.html` (variável RECAPTCHA_SITE_KEY)
  - [ ] Secret Key no Vercel como `RECAPTCHA_SECRET`

### Variáveis no Vercel
- [ ] Via Dashboard:
  - [ ] Settings > Environment Variables
  - [ ] Adicionar `JWT_SECRET`
  - [ ] Adicionar `ADMIN_USER`
  - [ ] Adicionar `ADMIN_PASS`
  - [ ] Adicionar `RECAPTCHA_SECRET`
  - [ ] Adicionar `NODE_ENV=production`

- [ ] [ ] Ou via CLI:
  ```bash
  vercel env add JWT_SECRET
  vercel env add ADMIN_USER
  vercel env add ADMIN_PASS
  vercel env add RECAPTCHA_SECRET
  vercel env add NODE_ENV
  ```

### Deploy
- [ ] [ ] Testar localmente uma última vez
  ```bash
  npm run dev
  ```

- [ ] [ ] Fazer commit (sem .env)
  ```bash
  git add .
  git commit -m "Adiciona área admin com autenticação"
  git push
  ```

- [ ] [ ] Deploy
  ```bash
  vercel --prod --yes
  ```

---

## 🔒 Fase 4: Testes em Produção

### URL
- [ ] [ ] Acessar `https://seu-dominio.com/admin/login.html`

### Login
- [ ] [ ] HTTPS funcionando?
- [ ] [ ] reCAPTCHA v3 carregando?
- [ ] [ ] Login com credenciais funciona?
- [ ] [ ] Redirecionamento para dashboard?

### Funcionalidades
- [ ] [ ] Publicar projeto
  - [ ] Dados salvos em produção?
  - [ ] Projeto aparece no site?

- [ ] [ ] Publicar artigo
  - [ ] Artigo aparece no blog?
  - [ ] Formatação preservada?

### Monitoramento
- [ ] [ ] Verificar logs do Vercel
  ```bash
  vercel logs --follow
  ```

---

## 🛡️ Fase 5: Segurança & Hardening

- [ ] **Credenciais**
  - [ ] Mudar senha regularmente
  - [ ] Usar senha forte (12+ caracteres)
  - [ ] Não usar senhas padrão

- [ ] **Variáveis**
  - [ ] `.env` está no `.gitignore`?
  - [ ] Nunca commitar secrets
  - [ ] Rotacionar `JWT_SECRET` anualmente

- [ ] **reCAPTCHA**
  - [ ] Score > 0.3 é aceito
  - [ ] Monitorar no console do reCAPTCHA
  - [ ] Ajustar threshold se necessário

- [ ] **Rate Limiting**
  - [ ] Vercel limita automaticamente
  - [ ] Verificar se está ativado

- [ ] **HTTPS**
  - [ ] Vercel ativa por padrão
  - [ ] Certificado SSL válido

- [ ] **Backups**
  - [ ] Fazer backup do `index.html`
  - [ ] Guardar dados importantes

---

## 📚 Fase 6: Documentação & Manutenção

- [ ] [ ] Documentação completa criada
  - [ ] `README_ADMIN.md` ✓
  - [ ] `QUICK_START_ADMIN.md` ✓
  - [ ] `ARCHITECTURE_ADMIN.md` ✓

- [ ] [ ] Treinar usuários
  - [ ] Como fazer login
  - [ ] Como publicar projeto
  - [ ] Como publicar artigo
  - [ ] Como mudar senha

- [ ] [ ] Monitoramento
  - [ ] Verificar logs regularmente
  - [ ] Monitorar fails de login
  - [ ] Alertas de erro

---

## 🐛 Troubleshooting Rápido

Se não funciona, verifique:

- [ ] Arquivo `.env` existe e está preenchido?
- [ ] URLs das APIs estão corretas?
- [ ] reCAPTCHA keys estão corretas?
- [ ] JWT_SECRET é mín 32 caracteres?
- [ ] Node.js está rodando? (`npm run dev`)
- [ ] Console do navegador mostra erros? (F12)
- [ ] Logs do Vercel mostram erros? (`vercel logs`)
- [ ] CORS está permitindo?
- [ ] Cookies habilitados?

---

## 🎉 Conclusão

Quando tudo estiver funcionando:

```
✅ Login funciona com CAPTCHA
✅ Projetos podem ser publicados
✅ Artigos podem ser publicados
✅ Tudo protegido com JWT
✅ Credenciais seguras em produção
✅ Documentação completa
✅ Deployado no Vercel
```

**Parabéns! Sua área admin está pronta! 🚀**

---

## 📋 Notas Adicionais

### Para Implementações Futuras

- [ ] Gerenciar múltiplos usuários
- [ ] Upload de imagens para Cloudinary/S3
- [ ] CRUD completo (editar/deletar)
- [ ] Dashboard com estatísticas
- [ ] Agendamento de publicações
- [ ] Backup automático
- [ ] Notificações por email
- [ ] Auditoria de ações

---

**Versão:** 1.0.0  
**Data:** 2026-03-17  
**Status:** ✅ Pronto para Produção
