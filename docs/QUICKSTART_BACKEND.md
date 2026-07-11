# Quickstart - Backend Admin Roncolato

**Tempo de setup:** 10 minutos

---

## 1. Estrutura de Pastas (Verifique se existe)

```bash
/api/admin/
├── auth.js                          ✅ Já existe
├── middleware/
│   ├── auth.js                      ✅ Criado
│   ├── validate.js                  ✅ Criado
│   ├── error-handler.js             ✅ Criado
│   └── logger.js                    (em utils/)
├── utils/
│   └── logger.js                    ✅ Criado
├── portfolio/
│   ├── add.js                       ✅ Criado
│   ├── list.js                      ✅ Criado
│   ├── hide.js                      ✅ Criado
│   ├── update.js                    (TODO)
│   └── delete.js                    (TODO)
└── blog/
    ├── add.js                       ✅ Criado
    ├── list.js                      ✅ Criado
    ├── hide.js                      ✅ Criado
    ├── update.js                    (TODO)
    └── delete.js                    (TODO)
```

---

## 2. Configurar Variáveis de Ambiente

Edite `.env.local`:

```bash
JWT_SECRET=chave-super-secreta-aleatorio-minimo-32-caracteres-MUDE-ISSO
ADMIN_USER=seu-usuario-seguro
ADMIN_PASS=SenhaForte!@#$%^&*123
RECAPTCHA_SECRET=seu-recaptcha-secret-aqui
NODE_ENV=development
```

**IMPORTANTE:** Nunca commite `.env` com valores reais!

---

## 3. Testar Localmente

### Opção 1: Com Vercel CLI

```bash
# Instalar (se não tem)
npm install -g vercel

# Fazer login
vercel login

# Servir localmente
vercel dev
```

Acesse: `http://localhost:3000/api/admin/auth`

### Opção 2: Com Node.js direto

```bash
# Criar servidor de teste simples
node -e "
const http = require('http');
const handler = require('./api/admin/auth.js');

http.createServer((req, res) => {
  req.body = {};
  handler(req, res);
}).listen(3000, () => {
  console.log('Servidor em http://localhost:3000');
});
"
```

---

## 4. Primeiro Teste - Login

```bash
# Obter token JWT
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seu-usuario-seguro",
    "password": "SenhaForte!@#$%^&*123"
  }'

# Salvar o token retornado
TOKEN="eyJhbGc..." # Cole o token aqui
```

---

## 5. Testar APIs

### Adicionar Projeto

```bash
curl -X POST http://localhost:3000/api/admin/portfolio/add \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'$TOKEN'",
    "title": "Projeto Teste",
    "year": 2025,
    "client": "Cliente ABC",
    "category": "Personal Branding",
    "deliverable": "Sessão fotográfica",
    "description": "Descrição do projeto de teste",
    "link": "https://exemplo.com",
    "images": ["IMG/projeto/img1.jpg"],
    "coverImageIndex": 0,
    "tags": ["branding"]
  }'
```

### Listar Projetos

```bash
curl -X GET "http://localhost:3000/api/admin/portfolio/list?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Adicionar Artigo

```bash
curl -X POST http://localhost:3000/api/admin/blog/add \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'$TOKEN'",
    "title": "Artigo de Teste",
    "excerpt": "Resumo do artigo",
    "body": "<p>Conteúdo do artigo de teste</p>",
    "category": "Personal Branding",
    "tags": ["branding", "dicas"],
    "featured": false,
    "readTime": "5 min"
  }'
```

---

## 6. Estrutura de Resposta

Todas as respostas seguem este padrão:

### Sucesso (2xx)

```json
{
  "success": true,
  "data": {
    "id": "proj_123...",
    "slug": "projeto-teste",
    "title": "Projeto Teste",
    "message": "Projeto adicionado com sucesso!"
  }
}
```

### Erro (4xx/5xx)

```json
{
  "success": false,
  "error": "Mensagem de erro descritiva",
  "code": "ERROR_CODE"
}
```

**Códigos de erro comuns:**

- `AUTH_MISSING_TOKEN` - Token não foi enviado
- `AUTH_INVALID_TOKEN` - Token expirou ou é inválido
- `VALIDATION_ERROR` - Dados inválidos
- `NOT_FOUND` - Recurso não encontrado
- `METHOD_NOT_ALLOWED` - Método HTTP não permitido
- `INTERNAL_ERROR` - Erro do servidor

---

## 7. Headers Importantes

### Em todas as requisições:

```bash
Content-Type: application/json
Authorization: Bearer <seu_token_jwt>
```

### CORS automático em:

- `https://rroncolato.com.br`
- `http://localhost:8080`
- `http://127.0.0.1:8080`

---

## 8. Implementar Persistência (TODO)

Os endpoints estão prontos, mas falta salvar os dados. Escolha uma opção:

### Opção 1: Firebase Firestore

```javascript
// No arquivo da API, após validar dados:
const admin = require('firebase-admin');
admin.firestore().collection('portfolio').doc(newProject.id).set(newProject);
```

### Opção 2: Supabase

```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
await supabase.from('portfolio').insert([newProject]);
```

### Opção 3: MongoDB

```javascript
const Portfolio = require('../models/Portfolio');
const savedProject = await Portfolio.create(newProject);
```

---

## 9. Deploy no Vercel

```bash
# 1. Login
vercel login

# 2. Deploy
vercel

# 3. Adicionar variáveis de ambiente
# No dashboard: Settings > Environment Variables
# Ou via CLI:
vercel env add JWT_SECRET
vercel env add ADMIN_USER
vercel env add ADMIN_PASS

# 4. Deploy para produção
vercel --prod
```

---

## 10. Checklist de Segurança

Antes de produção, verifique:

- [ ] JWT_SECRET é uma string aleatória de 32+ caracteres
- [ ] ADMIN_USER e ADMIN_PASS são seguros
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] HTTPS habilitado (automático no Vercel)
- [ ] CORS está restrito aos domínios corretos
- [ ] Logs de auditoria estão funcionando
- [ ] Soft delete implementado (não deletar dados)
- [ ] Persistência de dados escolhida e implementada

---

## 11. Próximos Passos

1. **Implementar UPDATE endpoints**
   - `/api/admin/portfolio/update.js`
   - `/api/admin/blog/update.js`

2. **Implementar DELETE endpoints** (soft-delete)
   - `/api/admin/portfolio/delete.js`
   - `/api/admin/blog/delete.js`

3. **Integrar persistência de dados**
   - Escolher Firebase/Supabase/MongoDB
   - Criar models/schemas
   - Implementar CRUD

4. **Upload de imagens**
   - Integrar Cloudinary ou AWS S3
   - Validar tipos de arquivo
   - Otimizar dimensões

5. **Autenticação 2FA**
   - SMS ou TOTP
   - Backup codes

6. **Dashboard de admin**
   - Interface web para gerenciar conteúdo
   - Preview ao vivo
   - Versionamento de artigos

---

## Documentação Completa

Veja `ADMIN_BACKEND_IMPLEMENTATION.md` para:

- Arquitetura detalhada
- Código completo de todos os endpoints
- Schema de dados
- Exemplos de testes
- Troubleshooting
- Referências e segurança

---

**Status:** Backend básico implementado e pronto para testes
**Próximo:** Implementar persistência de dados
**Tempo estimado:** 2-4 horas para integração completa
