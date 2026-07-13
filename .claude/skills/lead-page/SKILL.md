---
name: lead-page
description: Cria uma página de captura de leads. NÃO assume um formato fixo — começa perguntando o que o projeto precisa. O que é sempre igual é o backbone (Notion como banco + proxy serverless por causa do CORS); o resto muda. Use quando o Rodrigo pedir "página de captura", "landing de lead", "quiz de captura", "formulário", "página pra pegar contatos".
---

# Página de captura de lead

Cada captação é diferente. Esta skill NÃO sai criando no padrão bniconquista — primeiro **descobre o que este projeto precisa**, depois monta.

## O que é FIXO (não muda)

1. **Notion é o banco de dados dos leads.** Todo lead vai pra lá. É o que importa.
2. **Proxy serverless obrigatório.** O navegador não pode chamar o Notion direto (bloqueio CORS). Os dados SEMPRE passam por uma função em `api/NOME/lead.js` que fala com o Notion do lado servidor. Nunca colocar o token do Notion no HTML/JS do navegador.
3. **Página auto-contida.** HTML+CSS+JS inline em `public/pages/NOME/index.html` (Vercel serve estático, sem .js externo).
4. **Mobile-first.** Maioria acessa por celular.

## O que MUDA (perguntar antes de construir)

**Fazer estas perguntas ao Rodrigo primeiro — não presumir:**

1. **Formato:** formulário simples (poucos campos) ou quiz de várias etapas com resultado/diagnóstico?
2. **Campos capturados:** quais? (nome, WhatsApp, e-mail, ramo, Instagram...) Quais obrigatórios?
3. **Foto:** vai pedir upload de foto? (se sim → Cloudinary, ver abaixo)
4. **Resultado na tela:** mostra algum resultado/score/diagnóstico pro usuário, ou só agradece?
5. **Destino final:** redireciona pro WhatsApp? Mostra mensagem de obrigado? Outro link?
6. **Rota:** qual URL? (ex: `/nomedapagina`)
7. **Visual:** design system do estúdio (Jost/amarelo/preto) ou marca de um cliente/evento (logos, cores próprias)?
8. **Indexar no Google?** Evento/campanha geralmente `noindex`.

Só depois de ter as respostas, construir.

## Backbone técnico (a parte que se repete)

### O proxy `api/NOME/lead.js`
Copiar a estrutura de `api/bni/lead.js`:
- Recebe POST com os dados
- Valida obrigatórios
- Monta `properties` conforme o schema REAL do Notion (conferir sempre — nomes têm que bater exato)
- Chama a API do Notion server-side
- Retorna `{ ok: true }` ou erro

### Conferir schema do Notion ANTES de codar
```bash
node -e "fetch('https://api.notion.com/v1/databases/DB_ID',{headers:{'Authorization':'Bearer TOKEN','Notion-Version':'2022-06-28'}}).then(r=>r.json()).then(d=>{for(const[k,v]of Object.entries(d.properties))console.log('-',k,'('+v.type+')')})"
```
Banco de captura atual: `2ad273367bd880ef98f5dca1a8c70600` (DB-Captura de Dados). Propriedades: Nome Completo (title), Ramo de Atuação (rich_text), Telefone (phone_number), E-mail (email), Instagram (url), Funil (**select**), Diagnóstico (rich_text), Score (number), Nível (select), Foto de Perfil (files). Cada campanha pode usar um valor diferente de `Funil` para separar as origens. Se precisar campo novo, criar via PATCH no database antes.

### A rota `vercel.json`
Antes da linha `{ "source": "/", ... }`:
```json
{ "source": "/NOME", "destination": "/pages/NOME/index.html" },
```
Espelhar no `server.js` (`rewrites`, ~linha 155) se for testar local.

### Foto opcional (Cloudinary) — só se o projeto pedir
Upload direto do navegador → pega URL → manda a URL pro proxy → salva no campo `files` do Notion.
- Cloud: `snsctkvw` | Preset unsigned: `fotoperfil`
- Endpoint: `https://api.cloudinary.com/v1_1/snsctkvw/image/upload`

### WhatsApp — só se o projeto pedir
```js
const NUM = '5562985928423'; // formato: 55 + DDD + numero
const msg = encodeURIComponent(`mensagem com os dados`);
window.open(`https://wa.me/${NUM}?text=${msg}`, '_blank');
```

## Checklist final
- [ ] Perguntas respondidas ANTES de construir
- [ ] Proxy com propriedades batendo o schema do Notion
- [ ] Rota no `vercel.json`
- [ ] Fluxo testado ponta a ponta (Playwright headless serve)
- [ ] Lead de teste apareceu no Notion → apagar depois
- [ ] Deploy com aprovação (`/deploy`)

## Referência viva (um exemplo, não o molde obrigatório)
`public/pages/bniconquista/index.html` + `api/bni/lead.js` — quiz com foto e WhatsApp. Serve de base técnica; o formato final depende das respostas das perguntas acima.
