# Publicação

## Alvo
- App: projeto Vercel próprio (separado do site estático `rroncolato`)
- Banco/Storage/Auth: Supabase
- Rota pública: `rroncolato.com.br/diagnostico`

## Passos (quando decidir publicar)
1. Criar projeto Supabase → aplicar migrations (`supabase/migrations/` em ordem) → criar usuário admin no Auth
2. Criar projeto Vercel apontando para a pasta `diagnostico/`
3. Configurar env vars de produção (ver .env.example; DEMO_MODE=false)
4. Mercado Pago: credenciais de produção + webhook `{APP_URL}/api/webhooks/mercadopago`
5. No projeto Vercel do site principal, adicionar rewrite:
   ```json
   { "source": "/diagnostico/:path*", "destination": "https://<app-diagnostico>.vercel.app/diagnostico/:path*" }
   ```
   (App usa `basePath`/rotas compatíveis — validar na Fase 8.)
6. Rodar /release-check antes do primeiro deploy

## Credenciais pendentes (checklist)
- [ ] SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY
- [ ] AI_API_KEY (Anthropic)
- [ ] MERCADO_PAGO_ACCESS_TOKEN / PUBLIC_KEY / WEBHOOK_SECRET
- [ ] NEXT_PUBLIC_BOOKING_URL (agendamento)
- [ ] APP_SECRET de produção (novo, nunca reutilizar o local)
- [ ] Fonte Nord licenciada (opcional — fallback Jost ativo)
