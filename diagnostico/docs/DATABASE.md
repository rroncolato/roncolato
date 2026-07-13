# Banco de dados

Supabase Postgres. Migrations em `supabase/migrations/` (aplicar em ordem pelo SQL Editor ou CLI `supabase db push`).

## Tabelas

| Tabela | Papel |
|---|---|
| `leads` | dados do lead + UTM + consentimentos + score/temperatura + anonymized_at |
| `assessments` | diagnóstico: token público, status, respostas JSONB, resultados, metadados de IA |
| `assessment_images` | caminho privado, dimensões, hash, consentimentos, retention_until, deleted_at |
| `payments` | provedor, external_id (único), valor, status, approved_at |
| `analytics_events` | eventos do funil (payload mínimo) |
| `audit_logs` | ações administrativas sensíveis |
| `app_settings` | preço, booking_url, whatsapp, retenção, checkout_enabled (key/value JSONB) |

## Status de assessment
`draft → answering → photo_pending → processing → free_ready → paid` (+ `failed`, `deleted`).

## Segurança
- RLS ativo em tudo; sem policy de escrita para clientes — só service role (server).
- Policies `authenticated` somente leitura (painel admin via Supabase Auth).
- Bucket `assessment-photos` privado, sem policy pública; acesso por URL assinada curta.

## Retenção
`assessment_images.retention_until` = created_at + IMAGE_RETENTION_DAYS. Limpeza: job/admin exclui do storage e marca `deleted_at`.

## DEMO_MODE
Sem Supabase configurado, a aplicação usa store local em memória/arquivo (implementação em src/lib/db/demo-store.ts — Fase 2). Interface idêntica à do Supabase para troca transparente.
