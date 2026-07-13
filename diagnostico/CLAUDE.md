@AGENTS.md

# Diagnóstico de Expressão — Estúdio Roncolato

PWA que analisa foto de perfil profissional via IA e gera diagnóstico de expressão, autoridade e posicionamento. Freemium: resultado gratuito + relatório completo pago (Mercado Pago). Objetivo comercial: gerar leads qualificados para Sessão Estratégica de Imagem.

## Stack

- Next.js 16 (App Router) + TypeScript strict + React 19
- Tailwind CSS 4 (tokens em `src/app/globals.css` — nunca hexadecimal em componente)
- Zod (validação universal: forms, env, resposta da IA)
- React Hook Form
- Supabase (Postgres + Storage privado + Auth admin) — migrations em `supabase/migrations/`
- Sharp (processamento de imagem server-side)
- Anthropic SDK (visão) atrás de interface `VisionDiagnosticProvider`
- Mercado Pago Checkout Pro (webhook-only para liberação)
- Vitest (unit/integração) + Playwright (E2E)

## Comandos

```bash
npm run dev          # localhost:3000
npm run build        # build produção
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test         # vitest
npm run test:e2e     # playwright
```

## Arquitetura

```
src/app/              rotas (páginas + route handlers em api/)
src/components/       UI (ui/ básicos, diagnostic/, admin/)
src/lib/config.ts     env validado com Zod — único ponto de leitura de process.env
src/lib/ai/           provider interface, adapters (anthropic, demo), prompts/ versionados
src/lib/db/           acesso Supabase (server-only)
src/lib/scoring.ts    nota geral calculada AQUI, nunca pela IA
src/lib/leadscore.ts  temperatura do lead (frio/morno/qualificado/oportunidade)
supabase/migrations/  SQL versionado
docs/                 documentação por domínio
```

## Regras críticas

1. **DEMO_MODE=true** roda 100% local: IA usa fixture, pagamento simulado, sem chamada externa. Nunca quebrar por credencial ausente.
2. Chaves de API **só no servidor**. Nada de `NEXT_PUBLIC_` para segredos.
3. Foto = dado pessoal: bucket privado, URL assinada curta, EXIF removido, sem base64/URL em logs, retenção configurável.
4. Relatório completo liberado **exclusivamente** por confirmação de webhook validada no servidor (idempotente). Nunca por redirect do navegador.
5. Nota geral = fórmula em `scoring.ts` (Expressão 20, Autoridade 20, Conexão 15, Coerência 15, Arquétipo 20, Valor 10). IA retorna pilares 0–100; backend calcula.
6. Análise fala do que a **fotografia comunica**, nunca de quem a pessoa **é**. Sem inferência de raça, saúde, idade, atratividade, condição psicológica.
7. Preço central em config/banco. Nunca hardcoded em componente.
8. Acesso do lead por token seguro não previsível (sem senha/conta).
9. Prompt versionado; registrar provider, modelo e versão em cada assessment.
10. Uma retry automática em JSON inválido da IA; depois fallback amigável.

## Design system

Paleta: preto `#1B1B1B`, branco quente `#F1F1F1`, dourado `#F5AA22`; secundária cinza `#454142`, bege `#BDB3AA`, marrom `#864919`, petróleo `#182425` — só via tokens semânticos.
Tipografia: títulos Nord (fallback documentado), texto Libre. Direção: editorial, premium, escuro, respiro, linhas douradas finas. Evitar: neon, glassmorphism, cara de template/IA.

Detalhes por domínio: `.claude/rules/*.md`.

## Definição de pronto

Lint + typecheck + testes passam; build produção OK; jornada testável em DEMO_MODE; sem segredo no repo; docs atualizadas.

## Proibições

- Reconhecimento facial / identificação de pessoa
- Foto em bucket público ou em log
- Liberar relatório pago sem webhook confirmado
- Nota geral gerada pela IA
- Linguagem que rotula a pessoa ("você é...")
- Hexadecimal ou preço espalhado em componentes
