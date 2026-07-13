---
name: nova-proposta
description: Cria e publica uma proposta comercial nova para um cliente, no padrão do sistema PROPOSTAS COMERCIAIS. Use quando o Rodrigo pedir "nova proposta", "proposta para o cliente X", "montar orçamento", "criar apresentação comercial".
---

# Nova proposta comercial

Cria uma proposta de cliente e publica em `rroncolato.com.br/proposta/NOME`.

## Onde as coisas moram

- **Sistema/templates:** `PROPOSTAS COMERCIAIS/` (guias, templates, checklists)
- **Propostas publicadas:** `public/proposta/NOME/index.html` (uma pasta por cliente)
- **Rota:** a rota curinga `{ "source": "/proposta/:path*" }` no `vercel.json` já serve qualquer `/proposta/NOME/` automaticamente. **Não precisa criar rota nova** para o padrão pasta.

## Padrão atual (pasta)

Propostas novas seguem o padrão de **pasta**:
```
public/proposta/NOME-CLIENTE/index.html
```
Acessível em `https://rroncolato.com.br/proposta/NOME-CLIENTE`

(Propostas antigas eram arquivo único em `public/pages/proposta/*.html` com rota explícita — não usar esse padrão para novas.)

## Passo a passo

### 1. Briefing
Coletar do Rodrigo: cliente, serviço (fotografia / branding / estratégia), escopo, entregas, prazo, valores. Se faltar, perguntar.

### 2. Redação (usar o agent)
Acionar o agent **`proposal-writer`** com o briefing. Ele conhece a estrutura de proposta do estúdio. Para o texto voltado ao cliente, respeitar o tom de voz do Rodrigo (mentor, imagem como estratégia, não vendedor agressivo) — pode passar pelo `brand-voice-reviewer`.

### 3. Montar a página
- Criar `public/proposta/NOME-CLIENTE/index.html`
- Basear no design system do estúdio (Jost, amarelo #F5C518, preto #0A0A0A)
- Reaproveitar estrutura de uma proposta existente que ficou boa (ver `public/proposta/41business/`, `kero-mais/`, `nova-alianca/`)
- Responsiva (cliente pode abrir no celular)

### 4. Conferir os guias
Antes de finalizar, checar `PROPOSTAS COMERCIAIS/CHECKLIST_PRE_DEPLOY.md` e `GUIA_PROPOSTAS.md`.

### 5. Testar local
`npm start` → http://localhost:3012/proposta/NOME-CLIENTE
(Se a rota curinga não pegar local, adicionar no `rewrites` do `server.js`.)

### 6. Deploy
Skill `/deploy` (com aprovação). Verificar:
```bash
curl -s -o /dev/null -w "%{http_code}" https://rroncolato.com.br/proposta/NOME-CLIENTE
```

### 7. Entregar o link
Passar ao Rodrigo o link limpo: `rroncolato.com.br/proposta/NOME-CLIENTE`

## Dica
Cada proposta é a cara do estúdio para aquele cliente. Capricho no design e no copy > pressa. O material de apoio em `PROPOSTAS COMERCIAIS/` existe justamente para não começar do zero.
