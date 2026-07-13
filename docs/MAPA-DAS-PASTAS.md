# 🏠 SITE RONCOLATO — Mapa das Pastas

Guia simples do que é cada pasta na raiz do repositório. Atualizado em 2026-07-13.

> **Resumo rápido:** as pastas 🟢 **são** o site. As 🔵 são **negócios paralelos** que só moram aqui. As 🟡 são **bastidor/trabalho**. As ⚙️ **funcionam sozinhas** (não mexer).

---

## 🟢 Núcleo do site (o que vira o rroncolato.com.br)

| Pasta | O que é | Pra que serve |
|---|---|---|
| **public** | Coração do site | Tudo que as pessoas veem: homepage, blog, admin, páginas (bniconquista), propostas, imagens |
| **api** | Funções de servidor | Cada arquivo é uma "porta dos fundos": recebe leads, salva no Notion, entrega dados do blog |
| **src** | Código-fonte do servidor local | O motor que roda o site na sua máquina (porta 3012) + painel admin |
| **data** | Dados em arquivo | Conteúdo do blog e portfólio guardados em texto (JSON) |

## 🔵 Projetos independentes (rodam separados, não são o site)

| Pasta | O que é | Pra que serve |
|---|---|---|
| **diagnostico** | App próprio (Next.js) | Diagnóstico de Expressão pago — IA analisa foto + Mercado Pago + Supabase. Tem manual e equipe de agents próprios |
| **APP-FINANCEIRO** | App financeiro em uso | Suas finanças (contas, cartões, transações). *Previsto sair daqui — ver tarefa no Notion de 17/07* |
| **SOCIAL-FRAME** | Catálogo de fotos | Entrega de fotos pros clientes via Google Drive |
| **AGENDA** | Sincronizador | Conecta Google Calendar ↔ Notion |
| **PROPOSTAS COMERCIAIS** | Sistema de propostas | Templates e guias pra montar orçamento de cliente |

## 🟡 Trabalho e material de apoio

| Pasta | O que é | Pra que serve |
|---|---|---|
| **CONTEUDO** | Rascunhos e criação | Posts, carrosséis, apresentações, quizzes em desenvolvimento |
| **protetic** | Site de cliente | Trabalho entregue (tem git próprio) |
| **docs** | Documentação | Manuais técnicos + pastas `financeiro/` e `notas/` (organizadas em jul/2026) |
| **scripts** | Ferramentas | Utilitários de linha de comando (adicionar post, etc.) |

## ⚙️ Sistema (não mexer, funcionam sozinhas)

| Pasta | O que é |
|---|---|
| **ARCHIVE** | Arquivo morto — tudo que aposentamos fica aqui, recuperável (nada é apagado de verdade) |
| **node_modules** | Peças que os programas precisam pra rodar (baixadas automaticamente) |
| **caveman** | Plugin do Claude (modo de fala compacto) |

---

## Arquivos importantes na raiz

| Arquivo | O que é |
|---|---|
| **CLAUDE.md** | Manual do repositório — regras de ouro + comandos (lido automaticamente pelo Claude) |
| **server.js** | Servidor local (porta 3012) |
| **vercel.json** | Rotas e redirects da versão publicada |
| **package.json** | Lista de comandos (`npm start`, `npm run deploy`) e dependências |
| **robots.txt / sitemap.xml** | Ajudam o Google a indexar o site |

## Comandos do dia a dia

```bash
npm start          # sobe o site local em http://localhost:3012
npm run deploy     # publica na Vercel — SEMPRE pedir aprovação antes
```

Comandos prontos do Claude (digite numa conversa): `/deploy`, `/novo-post`, `/lead-page`, `/nova-proposta`.
