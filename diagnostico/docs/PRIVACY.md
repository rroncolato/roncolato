# Privacidade (LGPD)

## Princípios
- Foto = dado pessoal. Coleta com consentimento explícito e finalidade declarada (gerar o diagnóstico).
- Consentimentos separados: contato (obrigatório) · marketing (opcional) · portfólio (opcional, default não).
- O envio da imagem para diagnóstico NÃO autoriza uso publicitário.

## Retenção
- IMAGE_RETENTION_DAYS (default 180). `retention_until` gravado por imagem.
- Após o prazo: exclusão do storage + `deleted_at`.

## Direitos do titular
Página /solicitar-exclusao + ações administrativas:
- excluir fotografia · excluir diagnóstico · anonimizar lead (nome/e-mail/whats → hash, `anonymized_at`).
- Toda ação registrada em audit_logs.

## Técnica
- Bucket privado; URL assinada de curta duração; EXIF removido.
- Sem foto/base64/URL assinada/token em logs.
- Sem reconhecimento facial ou identificação da pessoa.
- IA recebe apenas: imagem processada + contexto mínimo (segmento, cargo, público, intenções, arquétipos desejados). Nunca nome/e-mail/telefone.

## Páginas legais
/privacidade (política) · /termos (uso) · /solicitar-exclusao (pedido do titular) — conteúdo em Fase 2.
