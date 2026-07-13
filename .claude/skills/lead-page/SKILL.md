---
name: lead-page
description: Cria uma página de captura de leads (quiz/formulário) no padrão bniconquista — captura, salva no Notion e redireciona pro WhatsApp. Use quando o Rodrigo pedir "página de captura", "quiz de captura", "landing de lead", "página pra pegar contatos".
---

# Página de captura de lead (padrão bniconquista)

Cria uma página auto-contida que captura dados, salva no Notion e manda pro WhatsApp. O modelo de referência é `/bniconquista` (palestra BNI).

## Arquitetura (o padrão que funciona)

```
Navegador                    Vercel (serverless)        Notion
─────────                    ───────────────────        ──────
public/pages/NOME/index.html → api/NOME/lead.js       → banco de captura
   (quiz + captura)              (proxy p/ Notion)         (leads)
        │
        └→ redireciona pro WhatsApp (wa.me) com mensagem pronta
```

**Por que o proxy serverless?** O navegador NÃO pode chamar o Notion direto (bloqueio CORS). Por isso os dados passam por uma função em `api/NOME/lead.js` que fala com o Notion do lado do servidor.

## Arquivos a criar

### 1. A página: `public/pages/NOME/index.html`
- Arquivo único, auto-contido (HTML + CSS + JS inline). Nada de arquivo .js externo (Vercel serve estático).
- Design system: fonte Jost, cores `--P:#F5C518` (amarelo), `--DB:#0A0A0A` (preto), `--LB:#F0F0EB`.
- Mobile-first (a maioria acessa por QR code no celular): `100svh`, safe-area, alvos de toque ≥ 48px, inputs com `font-size:16px` (evita zoom no iOS).
- `<meta name="robots" content="noindex">` se for página de evento (não indexar).
- Logos no topo se aplicável (ex: cliente + Roncolato).

### 2. O proxy: `api/NOME/lead.js`
Copiar a estrutura de `api/bni/lead.js`. Ele:
- Recebe POST com os dados
- Valida campos obrigatórios
- Monta as `properties` conforme o banco Notion
- Chama a API do Notion com o token
- Retorna `{ ok: true }` ou erro

### 3. A rota: `vercel.json`
Adicionar antes da linha `{ "source": "/", ... }`:
```json
{ "source": "/NOME", "destination": "/pages/NOME/index.html" },
```
E espelhar no `server.js` (objeto `rewrites`, ~linha 155) se for testar local.

## Notion — IMPORTANTE

Antes de codar, **conferir o schema real do banco** (os nomes das propriedades têm que bater EXATAMENTE):
```bash
node -e "fetch('https://api.notion.com/v1/databases/DB_ID',{headers:{'Authorization':'Bearer TOKEN','Notion-Version':'2022-06-28'}}).then(r=>r.json()).then(d=>{for(const[k,v]of Object.entries(d.properties))console.log('-',k,'('+v.type+')')})"
```
- Banco de captura atual: `2ad273367bd880ef98f5dca1a8c70600` (DB-Captura de Dados)
- Propriedades existentes: Nome Completo (title), Ramo de Atuação (rich_text), Telefone (phone_number), E-mail (email), Instagram (url), Funil (**select**, não multi_select), Diagnóstico (rich_text), Score (number), Nível (select), Foto de Perfil (files)
- Se precisar de campo novo, criar via API (PATCH no database) antes de usar.

## Foto opcional (Cloudinary)
Se a página aceita foto: upload direto pro Cloudinary do navegador, pega a URL, manda a URL pro proxy que salva no campo `files` do Notion.
- Cloud name: `snsctkvw`
- Upload preset (unsigned): `fotoperfil`
- Endpoint: `https://api.cloudinary.com/v1_1/snsctkvw/image/upload`

## WhatsApp
Redirect final com mensagem pré-preenchida:
```js
const NUM = '62985928423'; // número do Rodrigo (formato: 55 + DDD + numero pra wa.me)
const msg = encodeURIComponent(`Olá Rodrigo, ...mensagem com os dados...`);
window.open(`https://wa.me/55${NUM}?text=${msg}`, '_blank');
```

## Checklist final
- [ ] Página criada e auto-contida
- [ ] Proxy `api/NOME/lead.js` com propriedades batendo o schema do Notion
- [ ] Rota no `vercel.json`
- [ ] Testado o fluxo completo (pode usar Playwright headless pra simular)
- [ ] Lead de teste apareceu no Notion → depois apagar
- [ ] Deploy com aprovação (skill `/deploy`)

## Referência viva
`public/pages/bniconquista/index.html` + `api/bni/lead.js` — copiar e adaptar.
