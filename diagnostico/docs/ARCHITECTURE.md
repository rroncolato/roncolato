# Arquitetura

## Stack
Next.js 16 (App Router) · TypeScript strict · React 19 · Tailwind 4 · Zod · React Hook Form · Supabase (Postgres/Storage/Auth) · Sharp · Anthropic SDK · Mercado Pago · Vitest · Playwright.

## Camadas
```
src/app/                páginas + route handlers (api/)
src/components/         ui/ · diagnostic/ · admin/
src/lib/config.ts       env validado (Zod) — único leitor de process.env
src/lib/schemas/        Zod compartilhado front/back (lead, questionário, resultado IA)
src/lib/ai/             provider.ts (interface) · demo.ts · anthropic.ts · prompts/ · fixtures/
src/lib/db/             Supabase server-only
src/lib/scoring.ts      nota geral (fórmula única)
src/lib/leadscore.ts    temperatura do lead
src/lib/tokens.ts       tokens públicos seguros
supabase/migrations/    SQL versionado
```

## Decisões principais
Ver DECISIONS.md. Resumo:
- App independente do site estático pai (deploy = projeto Vercel próprio + rewrite /diagnostico no domínio).
- DEMO_MODE: fixture de IA + pagamento simulado + sem dependência externa → jornada 100% local.
- IA atrás de interface (`VisionDiagnosticProvider`) — troca de fornecedor sem tocar no resto.
- Nota geral calculada no backend (scoring.ts), nunca pela IA.
- Liberação do relatório pago exclusivamente via webhook verificado no provedor, idempotente.
- Lead acessa resultado por token url-safe de 32 bytes — sem conta/senha.

## Fluxo do diagnóstico
1. Lead + respostas persistidos (status: answering)
2. Upload → validação magic bytes → sharp (EXIF/orientação/resize) → hash → bucket privado (photo_pending → processing)
3. Provider.analyze() → Zod valida → retry 1x se inválido → scoring.ts calcula nota (free_ready)
4. Checkout → webhook → verificação no provedor → paid → full_result liberado
