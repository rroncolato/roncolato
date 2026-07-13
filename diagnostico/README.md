# Diagnóstico de Expressão — Estúdio Roncolato

Envie sua foto de perfil e descubra o que ela comunica sobre sua expressão, autoridade e posicionamento.

PWA freemium: diagnóstico gratuito por IA + relatório completo pago + agendamento da Sessão Estratégica de Imagem.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # DEMO_MODE=true já vem ativo
npm run dev                   # http://localhost:3000
```

Com `DEMO_MODE=true` a jornada completa funciona sem nenhuma credencial externa (IA usa fixture, pagamento é simulado).

## Comandos

| Comando | Função |
|---|---|
| `npm run dev` | desenvolvimento |
| `npm run build` | build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | testes unitários (Vitest) |
| `npm run test:e2e` | E2E (Playwright) |

## Documentação

- [docs/PRODUCT.md](docs/PRODUCT.md) — produto e modelo de negócio
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura
- [docs/DATABASE.md](docs/DATABASE.md) — banco e migrations
- [docs/DIAGNOSTIC-METHODOLOGY.md](docs/DIAGNOSTIC-METHODOLOGY.md) — metodologia e ética
- [docs/AI-PROMPTS.md](docs/AI-PROMPTS.md) — prompts e versionamento
- [docs/PRIVACY.md](docs/PRIVACY.md) — LGPD
- [docs/PAYMENTS.md](docs/PAYMENTS.md) — Mercado Pago + modo simulado
- [docs/ANALYTICS.md](docs/ANALYTICS.md) — eventos e lead scoring
- [docs/ADMIN.md](docs/ADMIN.md) — painel administrativo
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — publicação e credenciais pendentes
- [docs/DECISIONS.md](docs/DECISIONS.md) — decisões arquiteturais
