---
name: test-funnel
description: Executa e verifica o funil completo do Diagnóstico de Expressão em DEMO_MODE — do início ao agendamento. Use ao final de cada fase de implementação.
---

# Teste do funil

Pré-requisito: DEMO_MODE=true no .env.local, servidor rodando (npm run dev).

## Sequência verificada (Playwright ou manual via fetch)

1. **Início** — GET / responde 200, headline presente, CTA "Analisar minha expressão"
2. **Formulário** — captura de lead valida e-mail e telefone BR; persiste
3. **Questionário** — 10 perguntas navegáveis, progresso, respostas persistidas
4. **Arquétipos** — máximo 2 selecionáveis, 12 apresentados
5. **Consentimento** — obrigatório antes do upload
6. **Upload** — aceita JPG/PNG/WebP válido; rejeita tipo errado, >10MB, <400×400
7. **Processamento** — status muda para processing → done (fixture demo)
8. **Resultado gratuito** — nota geral, arquétipo percebido, força, distância, recomendação, CTA upgrade
9. **Checkout simulado** — cria pagamento pending; aprovação simulada libera
10. **Relatório completo** — acessível só após pago; token inválido → 404/403
11. **Agendamento** — CTA aponta para BOOKING_URL; evento booking_clicked registrado

## Saída
Tabela: etapa · status (✓/✗) · observação. Falhas com reprodução.
