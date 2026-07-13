-- ============================================================
-- Diagnóstico de Expressão — schema inicial
-- Todas as tabelas com RLS ativo. Acesso de aplicação via
-- service role (server-only). Nenhum acesso anônimo direto.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── leads ──────────────────────────────────────────────────
create table leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  whatsapp      text not null,
  company       text,
  role          text,
  segment       text,
  instagram     text,
  linkedin      text,
  city          text,
  contact_origin text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  landing_page  text,
  referral_code text,
  consent_contact boolean not null default false,
  consent_marketing boolean not null default false,
  score         integer not null default 0,
  temperature   text not null default 'frio'
                check (temperature in ('frio','morno','qualificado','oportunidade')),
  anonymized_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index leads_email_idx on leads (email);
create index leads_created_idx on leads (created_at desc);

-- ── assessments ────────────────────────────────────────────
create table assessments (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references leads(id) on delete cascade,
  public_token    text not null unique,
  status          text not null default 'draft'
                  check (status in ('draft','answering','photo_pending','processing',
                                    'free_ready','paid','failed','deleted')),
  answers         jsonb not null default '{}'::jsonb,
  desired_archetypes text[] not null default '{}',
  overall_score   integer check (overall_score between 0 and 100),
  free_result     jsonb,
  full_result     jsonb,
  perceived_archetypes jsonb,
  confidence      numeric(4,3),
  limitations     text[],
  ai_provider     text,
  ai_model        text,
  prompt_version  text,
  processed_at    timestamptz,
  released_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index assessments_lead_idx on assessments (lead_id);
create index assessments_token_idx on assessments (public_token);
create index assessments_status_idx on assessments (status);

-- ── assessment_images ──────────────────────────────────────
create table assessment_images (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  storage_path  text not null,
  mime_type     text not null,
  width         integer not null,
  height        integer not null,
  size_bytes    integer not null,
  hash_sha256   text not null,
  consent_analysis  boolean not null default false,
  consent_portfolio boolean not null default false,
  retention_until   timestamptz not null,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index assessment_images_assessment_idx on assessment_images (assessment_id);
create index assessment_images_hash_idx on assessment_images (hash_sha256);
create index assessment_images_retention_idx on assessment_images (retention_until)
  where deleted_at is null;

-- ── payments ───────────────────────────────────────────────
create table payments (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  provider      text not null default 'mercadopago',
  external_id   text,
  amount_cents  integer not null,
  currency      text not null default 'BRL',
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected','refunded','cancelled')),
  approved_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index payments_external_idx on payments (provider, external_id)
  where external_id is not null;
create index payments_assessment_idx on payments (assessment_id);

-- ── analytics_events ───────────────────────────────────────
create table analytics_events (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments(id) on delete set null,
  lead_id       uuid references leads(id) on delete set null,
  event_name    text not null,
  payload       jsonb not null default '{}'::jsonb,
  session_id    text,
  source        text,
  created_at    timestamptz not null default now()
);

create index analytics_events_name_idx on analytics_events (event_name, created_at desc);
create index analytics_events_assessment_idx on analytics_events (assessment_id);

-- ── audit_logs ─────────────────────────────────────────────
create table audit_logs (
  id            uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action        text not null,
  entity_type   text not null,
  entity_id     uuid,
  detail        jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);

-- ── app_settings (preço, URLs, textos configuráveis) ──────
create table app_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

insert into app_settings (key, value) values
  ('full_report_price_cents', '9700'),
  ('booking_url', '""'),
  ('whatsapp_number', '""'),
  ('image_retention_days', '180'),
  ('checkout_enabled', 'true'),
  ('demo_mode', 'true');

-- ── updated_at automático ──────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger leads_updated before update on leads
  for each row execute function set_updated_at();
create trigger assessments_updated before update on assessments
  for each row execute function set_updated_at();
create trigger payments_updated before update on payments
  for each row execute function set_updated_at();

-- ── RLS: negar tudo por padrão (service role ignora RLS) ──
alter table leads enable row level security;
alter table assessments enable row level security;
alter table assessment_images enable row level security;
alter table payments enable row level security;
alter table analytics_events enable row level security;
alter table audit_logs enable row level security;
alter table app_settings enable row level security;

-- Admin autenticado (Supabase Auth) pode ler para o painel
create policy admin_read_leads on leads
  for select to authenticated using (true);
create policy admin_read_assessments on assessments
  for select to authenticated using (true);
create policy admin_read_images on assessment_images
  for select to authenticated using (true);
create policy admin_read_payments on payments
  for select to authenticated using (true);
create policy admin_read_events on analytics_events
  for select to authenticated using (true);
create policy admin_read_audit on audit_logs
  for select to authenticated using (true);
create policy admin_read_settings on app_settings
  for select to authenticated using (true);
