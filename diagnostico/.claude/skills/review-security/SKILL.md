---
name: review-security
description: Auditoria de segurança do Diagnóstico de Expressão — segredos, upload, bucket, RLS, URLs, webhook, logs, rate limit, autorização, retenção. Use antes de commit de etapa e antes de deploy.
---

# Revisão de segurança

## Checklist

### Segredos
- [ ] `git grep` por padrões de chave (sk-, APP_USR-, service_role, eyJ) — nada commitado
- [ ] process.env lido só em src/lib/config.ts
- [ ] Nenhum segredo em NEXT_PUBLIC_

### Upload
- [ ] Magic bytes validados; extensão não confiável
- [ ] Limite de tamanho e resolução mínima aplicados no servidor
- [ ] EXIF removido; orientação corrigida; hash calculado
- [ ] Foto nunca em log/console

### Storage & banco
- [ ] Bucket privado; URL assinada com expiração curta
- [ ] RLS ativo em todas as tabelas
- [ ] Token de assessment ≥32 bytes randomBytes

### Webhook
- [ ] Secret/assinatura validado
- [ ] Pagamento verificado direto no provedor
- [ ] Idempotente (external_id único)
- [ ] Liberação nunca por redirect

### Aplicação
- [ ] Rate limit em rotas públicas de escrita
- [ ] /admin atrás de auth; audit_logs em ações sensíveis
- [ ] Headers de segurança + CSP configurados
- [ ] Erros sem stack trace ao cliente
- [ ] Retenção de imagem configurada e aplicável

## Saída
Achados por severidade (crítico/alto/médio/baixo) com arquivo:linha e correção.
