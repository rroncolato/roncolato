# Regras — Backend

## Acesso a dados
- Todo acesso a Supabase via `src/lib/db/` com service role — **server-only** (`import "server-only"`).
- RLS ativo em todas as tabelas; cliente anônimo nunca acessa tabelas diretamente.
- Migrations SQL versionadas em `supabase/migrations/` com prefixo data-número. Nunca editar migration aplicada; criar nova.

## Route handlers / Server Actions
- Input sempre validado com Zod antes de qualquer uso.
- Respostas de erro sem stack trace nem detalhe interno.
- Rate limiting nas rotas públicas de escrita (lead, upload, análise, checkout).
- Idempotência: webhook e análise protegidos contra chamada duplicada (hash da imagem, external_id do pagamento).

## Tokens
- Token público de assessment: `crypto.randomBytes` (mínimo 32 bytes url-safe). Nunca sequencial.
- URL assinada de storage com expiração curta (minutos).

## Upload
- Validar assinatura real do arquivo (magic bytes), não a extensão.
- Sharp: remover EXIF, corrigir orientação, redimensionar, gerar versão otimizada.
- Hash SHA-256 para deduplicação. Bucket privado sempre.
- Limites via config: MAX_IMAGE_SIZE_MB, mínimo 400×400.

## Pagamento
- Preferência criada no servidor com external_reference = assessment id.
- Liberação só por webhook: verificar pagamento direto no provedor (nunca confiar no payload), idempotente, registrar valor/data/id externo.
- Modo simulado quando DEMO_MODE=true.

## Logs
- Nunca logar: foto, base64, URL assinada, token de acesso, segredo, dado pessoal completo.
- Logar: ids internos, eventos, erros sem payload sensível.
