# Regras — Segurança e Privacidade (LGPD)

## Segredos
- Env validado em `src/lib/config.ts`. `process.env` não é lido fora dali.
- `.env*` no .gitignore. `.env.example` sem valores reais.
- Nenhum segredo em NEXT_PUBLIC_, log, erro, painel admin ou commit.

## Foto (dado pessoal)
- Bucket privado + RLS. URL assinada de curta duração, gerada on-demand.
- EXIF removido antes de armazenar. Sem foto/base64/URL em logs.
- Retenção: IMAGE_RETENTION_DAYS (default 180), data prevista gravada no registro.
- Consentimento explícito para análise/armazenamento; autorizações separadas para marketing e portfólio (default: não).
- Admin pode: excluir foto, excluir diagnóstico, anonimizar lead (atender titular LGPD).

## Aplicação
- Headers de segurança + CSP no `next.config.ts`.
- Cookies: httpOnly, secure, sameSite.
- Rate limiting em rotas públicas de escrita.
- Rotas /admin protegidas por Supabase Auth; middleware verifica sessão.
- Webhook: validar assinatura/secret, verificar pagamento direto no provedor, idempotência por external_id.
- Sanitizar toda entrada renderizada. Sem dangerouslySetInnerHTML com dado do usuário.
- audit_logs para ações administrativas sensíveis.

## Páginas obrigatórias
/privacidade, /termos, /solicitar-exclusao — linkadas no consentimento.
