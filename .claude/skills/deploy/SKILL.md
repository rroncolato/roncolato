---
name: deploy
description: Publica o site rroncolato.com.br na Vercel com trava de aprovação e verificação automática das rotas. Use quando o Rodrigo pedir "deploy", "publicar", "subir pro ar", "colocar no site".
---

# Deploy do site rroncolato.com.br

Publica o site principal na Vercel (produção) de forma segura.

## ⚠️ REGRA ABSOLUTA — pedir aprovação primeiro

**NUNCA rode o deploy sem o Rodrigo aprovar explicitamente nesta conversa.** Ele já reclamou de deploy feito sem permissão. Mesmo que ele tenha pedido "deploy" no passado, cada deploy é uma nova aprovação.

Antes de publicar, SEMPRE:
1. Resuma em 1-2 linhas o que mudou desde o último deploy (quais arquivos/páginas).
2. Pergunte: **"Posso publicar agora?"** e espere um "sim" claro.
3. Só depois execute.

## Passo a passo

### 1. Mostrar o que vai ao ar
```bash
git status --short
```
Resuma para o Rodrigo em linguagem simples o que mudou.

### 2. Pedir aprovação (obrigatório — ver regra acima)

### 3. Publicar (só após "sim")
```bash
npm run deploy
```
(isso roda `vercel --prod --yes`)

### 4. Verificar que subiu certo
Depois do deploy, testar as rotas afetadas. Exemplos:
```bash
curl -s -o /dev/null -w "%{http_code}" https://rroncolato.com.br/
curl -s -o /dev/null -w "%{http_code}" https://rroncolato.com.br/ROTA_QUE_MUDOU
```
`200` = no ar. `404`/`500` = problema, avisar o Rodrigo.

### 5. Confirmar
Diga qual URL testar e confirme o código de status.

## Rotas importantes para checar quando relevante
- `/` — homepage
- `/bniconquista` — quiz da palestra BNI
- `/whats` — redirect WhatsApp (307 é o correto, não 200)
- `/blog/SLUG` — posts do blog

## Observações
- O `server.js` (local) não usa o `vercel.json`. Rotas novas precisam estar nos dois se for testar local.
- Deploy demora ~1-2 min. Rode com timeout maior se precisar.
