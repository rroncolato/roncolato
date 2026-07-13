# Analytics / Funil

## Eventos registrados (analytics_events)
`landing_view` · `diagnostic_started` · `lead_submitted` · `questionnaire_started` · `questionnaire_completed` · `photo_selected` · `photo_uploaded` · `analysis_started` · `analysis_completed` · `analysis_failed` · `free_result_viewed` · `checkout_started` · `payment_pending` · `payment_approved` · `payment_failed` · `full_report_viewed` · `booking_clicked` · `whatsapp_clicked` · `deletion_requested`

Payload mínimo: ids internos + dados estritamente necessários. Nunca: foto, e-mail em claro no payload, token.

## UTM
Capturados na landing e persistidos no lead: utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page, referral_code.

## Lead scoring (src/lib/leadscore.ts)
Sinais pontuados (pesos em SIGNAL_POINTS) → score → temperatura:
- < 20 frio · 20–44 morno · 45–69 qualificado · ≥ 70 oportunidade
Nunca exibido ao usuário. Ajuste de fórmula: editar SIGNAL_POINTS/classifyLead.

## Painel
Funil visual em /admin (visão geral): contagem por evento, conversão gratuito→pago, cliques de agendamento.
