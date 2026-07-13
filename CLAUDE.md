# SITE RONCOLATO — Manual do Repositório

Este é o repositório central do negócio de Rodrigo Roncolato (fotografia de marca pessoal, estúdio Roncolato). Contém o site principal, ferramentas de captação de leads, sistema de propostas, dashboards financeiros e projetos de clientes.

**Site em produção:** https://rroncolato.com.br (hospedado na Vercel — projeto `rroncolatos-projects/roncolato`)

---

## ⚠️ Regras que NÃO podem ser quebradas

1. **NUNCA fazer deploy sem aprovação explícita do Rodrigo.** Sempre perguntar antes de rodar `vercel --prod`. Ele já reclamou disso — respeitar sempre.
2. **NUNCA apagar arquivos direto.** Mover para `ARCHIVE/` em vez de deletar. Aqui está o negócio inteiro dele.
3. **NUNCA commitar credenciais.** Tokens do Google e configs sensíveis ficam em `.env`, `AGENDA/*.json`, `SOCIAL-FRAME/config/*.json` — todos já no `.gitignore`.
4. **Ponto de restauração:** existe a tag git `restauracao-antes-organizacao`. Para voltar tudo ao estado seguro: `git reset --hard restauracao-antes-organizacao`.

---

## Comandos

```bash
npm start          # sobe o servidor local na porta 3012 (node server.js)
npm run dev        # live-server (preview estático rápido)
npm run deploy     # deploy Vercel produção — SÓ COM APROVAÇÃO
```

**Servidor local:** http://localhost:3012
- Homepage: http://localhost:3012
- Admin: http://localhost:3012/src/admin/login.html (credenciais: admin / senha123)

**Importante sobre rotas locais:** o `server.js` NÃO lê o `vercel.json`. Rotas amigáveis (ex: `/bniconquista`) precisam ser espelhadas no objeto `rewrites` dentro do `server.js` (~linha 155) para funcionarem no localhost. Em produção, quem manda é o `vercel.json`.

---

## Mapa das pastas

### Núcleo do site (o que vai pro ar)
- **`public/`** — tudo que é servido publicamente
  - `index.html` — a SPA principal (homepage, blog, portfólio — tudo em um arquivo só)
  - `admin/` — painel administrativo
  - `pages/` — páginas avulsas (ex: `pages/bniconquista/` = quiz de captura da palestra BNI)
  - `proposta/` — propostas publicadas de clientes
  - `assets/` — imagens, CSS, fontes
- **`api/`** — funções serverless da Vercel (cada arquivo = uma rota)
  - `bni/lead.js` — recebe leads do quiz bniconquista e salva no Notion
  - `blog/posts.js`, `portfolio/cases.js` — dados do site
  - `admin/[...route].js` — backend do admin
- **`server.js`** — servidor Node para desenvolvimento local (porta 3012)
- **`vercel.json`** — rotas e redirects de produção
- **`data/`** — conteúdo do blog e portfólio em JSON

### Projetos independentes (rodam separados)
- **`diagnostico/`** — PWA Next.js: Diagnóstico de Expressão pago (IA de visão + Mercado Pago + Supabase). Tem CLAUDE.md e squad de agents próprios.
- **`SOCIAL-FRAME/`** — catálogo de fotos para clientes via Google Drive
- **`APP-FINANCEIRO/`** e **`financeiro-dashboard/`** — finanças do estúdio
- **`AGENDA/`** — sincronização Google Calendar ↔ Notion
- **`PROPOSTAS COMERCIAIS/`** — sistema/templates de propostas (o gerado vai para `public/proposta/`)

### Trabalho e material
- **`CONTEUDO/`** — posts, carrosséis, apresentações, quizzes em desenvolvimento
- **`protetic/`** — site de cliente (entregue; tem git próprio)
- **`docs/`** — documentação técnica do admin e do site
- **`scripts/`** — utilitários (adicionar post, deploy social-frame, etc.)
- **`ARCHIVE/`** — arquivos antigos aposentados (não apagados)

---

## Fluxos comuns (padrões já estabelecidos)

### Deploy
`npm run deploy` roda `vercel --prod --yes`. **Sempre pedir aprovação antes.** Depois do deploy, verificar a rota afetada com `curl -s -o /dev/null -w "%{http_code}" https://rroncolato.com.br/ROTA`.

### Nova rota amigável (ex: `/algumacoisa`)
1. Adicionar em `vercel.json` (produção)
2. Espelhar no `rewrites` do `server.js` se precisar testar local
3. Deploy (com aprovação)

### Página de captura de lead (padrão bniconquista)
Arquivo único auto-contido em `public/pages/NOME/index.html` → captura → envia para função serverless em `api/NOME/lead.js` → salva no Notion (proxy serverless, porque o navegador não pode chamar o Notion direto por CORS) → redireciona para WhatsApp. Foto opcional via Cloudinary (cloud `snsctkvw`, preset `fotoperfil`).

### Post no blog
O conteúdo do post vive em 3 lugares que precisam ficar sincronizados: `data/blog-posts.json`, a constante `_POSTS_DATA` dentro de `public/index.html`, e o fallback em `api/blog/posts.js`.

---

## Tom de voz e marca

O tom de voz do Rodrigo está documentado na memória do Claude (`tone_of_voice_complete`). Para qualquer texto voltado ao público (legendas, propostas, diagnósticos, copy), usar os agents `brand-voice-reviewer` e `caption-writer`, ou consultar a memória. Posicionamento: imagem como estratégia, não vaidade. Tom de mentor — servidor, não vendedor agressivo.
