# 🔐 Área Admin - Documentação Completa

## 📋 Sumário
- [Acesso](#acesso)
- [Configuração](#configuração)
- [Publicar Portfólio](#publicar-portfólio)
- [Publicar Artigos](#publicar-artigos)
- [Segurança](#segurança)
- [Troubleshooting](#troubleshooting)

---

## 🔑 Acesso

### URL da Área Admin
```
http://localhost:8080/admin/login.html  (desenvolvimento)
https://seu-site.com/admin/login.html   (produção)
```

### Credenciais Padrão
- **Usuário:** `admin`
- **Senha:** `senha123`

⚠️ **MUDE AS CREDENCIAIS EM PRODUÇÃO!**

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente Local

Crie um arquivo `.env` na raiz do projeto:

```bash
JWT_SECRET=sua-chave-secreta-muito-segura-min-32-chars
ADMIN_USER=seu-usuario-admin
ADMIN_PASS=sua-senha-super-forte123!
RECAPTCHA_SECRET=sua-chave-recaptcha-aqui
NODE_ENV=development
```

### 2. Gerar Chave JWT Segura

```powershell
# No PowerShell (Windows):
[System.Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
```

Ou use um gerador online: https://www.random.org/cgi-bin/randbytes?nbytes=32&format=h

### 3. Configurar reCAPTCHA v3

1. Acesse: https://www.google.com/recaptcha/admin/create
2. Crie novo site:
   - **Nome:** "Site Roncolato"
   - **Tipo:** reCAPTCHA v3
   - **Domínios:** `rroncolato.com.br, localhost:8080, 127.0.0.1:8080`
3. Copie as chaves:
   - **Site Key** → Adicione em `admin/login.html` (já está como exemplo)
   - **Secret Key** → Adicione em `.env` como `RECAPTCHA_SECRET`

### 4. Deploy no Vercel

```bash
# 1. Fazer login no Vercel via CLI
vercel login

# 2. Adicionar variáveis de ambiente
vercel env add JWT_SECRET
vercel env add ADMIN_USER
vercel env add ADMIN_PASS
vercel env add RECAPTCHA_SECRET

# 3. Deploy
vercel --prod --yes
```

Ou adicione via dashboard: Settings > Environment Variables

---

## 📸 Publicar Portfólio

### Passo a Passo

1. **Faça login** na área admin: `/admin/login.html`
2. **Clique na aba "Portfólio"**
3. **Preencha os dados:**
   - Nome do cliente/projeto
   - Ano do projeto
   - Cliente
   - Categoria (Personal Branding, Fotografia Executiva, etc)
   - Entregável (ex: "Sessão fotográfica")
   - Descrição breve
   - Link externo (opcional)

4. **Selecione as imagens:**
   - Clique em "Clique para selecionar imagens" ou arraste
   - Escolha qual será a capa do card

5. **Clique em "Adicionar Projeto"**

### Resultado
- Projeto aparecerá no portfólio da home
- Card mostrará a imagem de capa com o título
- Modal exibirá galeria de imagens ao clicar

---

## 📝 Publicar Artigos

### Passo a Passo

1. **Faça login** na área admin
2. **Clique na aba "Blog"**
3. **Preencha os dados:**
   - **Título:** Título do artigo
   - **Resumo:** 1-2 frases para o card
   - **Categoria:** Personal Branding, Fotografia Executiva, etc
   - **Data:** Data de publicação (YYYY-MM-DD)
   - **Tempo de leitura:** ex "5 min", "10 min"

4. **Escreva o conteúdo:**

   **Formatação:**
   ```
   ##Titulo da Seção
   
   Parágrafo normal com seu conteúdo aqui.
   
   ""Esta é uma citação importante""
   
   Outro parágrafo...
   ```

   **Resultado no site:**
   - `##Titulo` → `<h2>Titulo</h2>`
   - Texto normal → `<p>texto</p>`
   - `""citação""` → `<blockquote>citação</blockquote>`

5. **Clique em "Publicar Artigo"**

### Exemplo de Conteúdo

```
##Fotografia em Eventos Corporativos

A fotografia corporativa é essencial para documentar momentos importantes da empresa.

""Cada clique conta uma história da sua marca""

Ao fotografar eventos, é importante considerar:
- Iluminação natural e artificial
- Ângulos dinâmicos
- Foco nos detalhes

Profissionais que dominam essa arte conquistam clientes satisfeitos.
```

---

## 🔒 Segurança

### Proteções Implementadas

✅ **JWT Tokens** - Sessões criptografadas com expiração de 24h
✅ **reCAPTCHA v3** - Proteção contra bots automatizados
✅ **Validação XSS** - Sanitização de inputs
✅ **SQL Injection Prevention** - Sem banco de dados vulnerável
✅ **Rate Limiting** - Proteção contra brute force (via Vercel)
✅ **CORS Restrito** - Apenas origens autorizadas podem acessar APIs
✅ **Timing-Safe Comparison** - Impede ataques de timing

### Boas Práticas

1. **Mude as credenciais padrão** em produção
2. **Use uma senha forte** (mín. 12 caracteres, números, símbolos)
3. **Mude a chave JWT** regularmente
4. **Ative HTTPS** em produção (Vercel faz isso automaticamente)
5. **Monitore logs** de login falhados
6. **Faça backup** antes de grandes atualizações

### Redefiniçao de Senha

Para mudar credenciais em produção:

```bash
# Via Vercel CLI:
vercel env rm ADMIN_PASS
vercel env add ADMIN_PASS
# Digite a nova senha

# Deploy
vercel --prod --yes
```

---

## 🛠️ Troubleshooting

### Problema: Erro "Token inválido"
- **Solução:** Faça logout e login novamente
- **Causa:** Token expirou (24h)

### Problema: reCAPTCHA falha
- **Solução:** Verifique se Site Key e Secret Key estão corretas
- **Verificar:** Vá para https://www.google.com/recaptcha/admin

### Problema: Projeto/Artigo não aparece
- **Solução:** Recarregue a página com Ctrl+F5
- **Verificar:** Console do navegador (F12 > Console) para erros
- **Logs do Vercel:** `vercel logs --tail`

### Problema: Erro 401 ao salvar
- **Solução:** Token expirou, faça login novamente
- **Verificar:** localStorage no DevTools (F12 > Application)

### Problema: Imagens aparecem como placeholder
- **Solução:** Configure upload em serviço externo (Cloudinary/S3)
- **Temporário:** Use URLs públicas diretas

---

## 📚 Estrutura de Arquivos

```
/admin/
  ├── login.html          # Página de login
  ├── dashboard.html      # Painel principal

/api/admin/
  ├── auth.js            # API de autenticação (JWT)
  ├── add-project.js     # API para adicionar projetos
  ├── add-article.js     # API para publicar artigos

.env.example             # Modelo de variáveis
README_ADMIN.md          # Este arquivo
```

---

## 🔗 Referências Úteis

- [reCAPTCHA Console](https://www.google.com/recaptcha/admin)
- [JWT.io](https://jwt.io)
- [Vercel Docs](https://vercel.com/docs)
- [Node.js Crypto](https://nodejs.org/api/crypto.html)

---

## 📞 Suporte

Para problemas:

1. **Verifique o console** (F12 no navegador)
2. **Ative modo debug** em `.env`: `DEBUG=true`
3. **Consulte logs do Vercel**: `vercel logs --tail`
4. **Revise as variáveis de ambiente** em `.env`

---

## ✅ Checklist de Deployment

- [ ] Mudou `ADMIN_USER` e `ADMIN_PASS`
- [ ] Configurou `JWT_SECRET` seguro
- [ ] Criou reCAPTCHA v3
- [ ] Adicionou variáveis no Vercel
- [ ] Testou login em produção
- [ ] Testou publicar projeto
- [ ] Testou publicar artigo
- [ ] Ativou HTTPS
- [ ] Fez backup dos dados

---

**Versão:** 1.0.0  
**Última atualização:** 2026-03-17
