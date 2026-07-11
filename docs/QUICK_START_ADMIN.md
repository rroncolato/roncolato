# ⚡ Guia Rápido - Área Admin

## 🚀 Começar em 5 Minutos

### 1️⃣ Configure as Credenciais

Crie um arquivo `.env` na **raiz do projeto** (mesmo nível de `package.json`):

```
JWT_SECRET=minha-chave-super-secreta-aleatorio-32-chars
ADMIN_USER=admin
ADMIN_PASS=senha123
RECAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
NODE_ENV=development
```

### 2️⃣ Abra a Área Admin

No seu navegador, vá para:
```
http://localhost:8080/admin/login.html
```

### 3️⃣ Faça Login

- **Usuário:** admin
- **Senha:** senha123

### 4️⃣ Publique Conteúdo

**Portfólio:**
- Clique em "Portfólio"
- Preencha os dados
- Selecione imagens
- Clique em "Adicionar Projeto"

**Blog:**
- Clique em "Blog"
- Escreva o artigo
- Clique em "Publicar Artigo"

---

## 🔐 IMPORTANTE - Antes de Fazer Deploy

### Mude as Credenciais

```bash
# Edite .env:
ADMIN_USER=seu-usuario-seguro
ADMIN_PASS=sua-senha-muito-forte-nao-use-senha123
JWT_SECRET=minimo-32-caracteres-aleatorios-super-secretos
```

### Gere uma Chave JWT Segura

Opção 1 (PowerShell):
```powershell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
```

Opção 2 (Online): https://www.uuidgenerator.net/

### Configure reCAPTCHA Próprio

1. Vá para: https://www.google.com/recaptcha/admin/create
2. Crie novo site reCAPTCHA v3
3. Copie a **Site Key** → Atualize em `admin/login.html`
4. Copie a **Secret Key** → Adicione como `RECAPTCHA_SECRET` em `.env`

---

## 📤 Deploy no Vercel

```bash
# 1. Fazer login
vercel login

# 2. Adicionar cada variável
vercel env add JWT_SECRET
vercel env add ADMIN_USER  
vercel env add ADMIN_PASS
vercel env add RECAPTCHA_SECRET

# 3. Deploy
vercel --prod --yes
```

**Verificar variáveis no Vercel:**
```
Settings > Environment Variables
```

---

## 🎨 Inserir Imagens no Blog/Portfólio

### Opção 1: URLs Externas (Recomendado para Vercel)

```
https://exemplo.com/imagem.jpg
https://cloudinary.com/seu-arquivo
```

### Opção 2: Upload Local (Dev Only)

Coloque imagens em `/IMG/seu-projeto/` e use:

```
IMG/seu-projeto/imagem.jpg
```

### Opção 3: Cloudinary (Gratuito)

1. Crie conta: https://cloudinary.com
2. Upload de imagens grátis
3. Use URLs públicas nos formulários

---

## ⚠️ Erros Comuns

### Erro: "Token não fornecido"
→ Faça login novamente

### Erro: "reCAPTCHA falhou"  
→ Verificar Site Key e Secret Key em https://www.google.com/recaptcha/admin

### Erro: "Usuário ou senha incorretos"
→ Conferir variáveis em `.env`

### Projeto não salva
→ Verifique console (F12 > Console) para mensagens de erro

---

## 📋 Estrutura de Pastas Criada

```
seu-site/
├── admin/
│   ├── login.html          ✅ Login com CAPTCHA
│   └── dashboard.html      ✅ Painel de publicação
├── api/
│   └── admin/
│       ├── auth.js         ✅ Autenticação JWT
│       ├── add-project.js  ✅ Publicar portfólio
│       └── add-article.js  ✅ Publicar artigos
├── .env.example            📋 Modelo de variáveis
└── README_ADMIN.md         📚 Documentação completa
```

---

## 🔄 Workflow Típico

```
1. Login em /admin/login.html
   ↓
2. Preencher formulário (portfólio ou blog)
   ↓
3. Selecionar imagens/categoria
   ↓
4. Clicar em "Publicar"
   ↓
5. Sucesso! Conteúdo aparece no site
```

---

## 💡 Dicas

✅ Use senhas **fortes** (mín. 12 caracteres)
✅ Mude credenciais **regularmente**
✅ Faça **backup** dos dados importantes
✅ Use **HTTPS** em produção (Vercel automático)
✅ Monitore **logs** de login

---

## 📞 Precisa de Ajuda?

1. Veja a documentação completa: `README_ADMIN.md`
2. Verifique o console do navegador (F12)
3. Revise as variáveis de ambiente em `.env`

---

**Pronto! Sua área admin está funcionando. Boa publicação! 🚀**
