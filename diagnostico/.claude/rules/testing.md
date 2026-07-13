# Regras — Testes

## Unit/integração (Vitest)
Cobertura mínima obrigatória:
- scoring.ts: fórmula da nota geral, clamps 0–100, pesos
- Schema Zod da IA: resposta válida, inválida, retry
- Validações: e-mail, telefone BR, campos obrigatórios do questionário
- Upload: tipo inválido, arquivo grande, imagem pequena, magic bytes
- Fluxos de erro da IA: timeout, JSON inválido, sem rosto, múltiplas pessoas
- Pagamento: pendente, aprovado, webhook repetido (idempotência), acesso sem pagamento
- Tokens: acesso inválido
- Lead scoring: frio/morno/qualificado/oportunidade
- Retenção de imagem

## E2E (Playwright)
1. Jornada gratuita completa (landing → resultado)
2. Desbloqueio do relatório via pagamento simulado
3. Upload de imagem inválida (mensagem correta)
4. Retorno ao relatório por link seguro
5. Admin localiza lead e consulta diagnóstico

## Convenções
- Unit em `src/**/*.test.ts`; E2E em `e2e/`
- Fixtures da IA em `src/lib/ai/fixtures/`
- E2E roda contra DEMO_MODE=true, sem serviço externo
- Nunca credencial real em teste
