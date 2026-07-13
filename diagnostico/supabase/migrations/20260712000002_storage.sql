-- ============================================================
-- Storage: bucket PRIVADO para fotos de assessment.
-- Acesso somente via service role + URLs assinadas de curta duração.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('assessment-photos', 'assessment-photos', false)
on conflict (id) do nothing;

-- Nenhuma policy pública. Sem policy = sem acesso anônimo/autenticado
-- direto; apenas service role (server) opera no bucket.
