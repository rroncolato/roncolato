# Pagamentos

## Provedor
Mercado Pago Checkout Pro. Sandbox para testes. Preço central: `app_settings.full_report_price_cents` (fallback env FULL_REPORT_PRICE_CENTS=9700).

## Fluxo (produção)
1. `checkout_started` → servidor cria preferência (external_reference = assessment_id)
2. Usuário paga no Checkout Pro; redirect para /diagnostico/pagamento/{sucesso|pendente|falha} (páginas informativas — NÃO liberam nada)
3. Webhook recebido → validar secret → **consultar pagamento na API do MP** (nunca confiar no payload)
4. Idempotência: `payments.external_id` único; evento repetido = no-op
5. Aprovado → payments.status=approved + approved_at → assessment.status=paid + released_at
6. Registrar valor, moeda, data, id externo. Payload completo NÃO é armazenado.

## Modo simulado (DEMO_MODE=true)
- Checkout cria payment pending local
- Aprovação: botão no painel admin ou rota restrita `/api/dev/approve-payment` (bloqueada fora de demo)
- Mesma máquina de estados da produção

## Credenciais necessárias (produção)
MERCADO_PAGO_ACCESS_TOKEN · MERCADO_PAGO_PUBLIC_KEY · MERCADO_PAGO_WEBHOOK_SECRET
Webhook URL: `{APP_URL}/api/webhooks/mercadopago`
