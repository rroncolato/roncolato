---
name: release-check
description: Checklist completo de release do Diagnóstico de Expressão — lint, typecheck, testes, build, E2E, variáveis, segurança. Use antes de qualquer deploy ou ao fechar fase.
---

# Release check

Executar em ordem; parar no primeiro erro crítico:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e   # se ambiente permitir
```

## Verificações adicionais

1. `.env.example` completo — comparar com chaves usadas em src/lib/config.ts
2. `git status` — nenhum .env ou segredo staged
3. `git grep -iE "sk-ant|APP_USR-|service_role.*eyJ"` — vazio
4. DEMO_MODE documentado; selo demo não aparece em produção
5. Invocar skill review-security (achados críticos = bloqueio)
6. docs/ atualizadas para a mudança
7. Rotas principais respondem (/, /diagnostico, /privacidade, /termos, /admin)

## Saída
Checklist com ✓/✗ por item, output de comandos que falharam, veredito: LIBERADO ou BLOQUEADO (com motivos).
