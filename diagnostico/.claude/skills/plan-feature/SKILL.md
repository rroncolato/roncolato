---
name: plan-feature
description: Planeja uma funcionalidade do Diagnóstico de Expressão — escopo, arquivos, banco, segurança, testes e critérios de aceite. Use antes de implementar qualquer feature nova.
---

# Planejar funcionalidade

Recebe a descrição de uma funcionalidade e produz um plano curto e executável.

## Processo

1. Ler CLAUDE.md e as rules relevantes em .claude/rules/
2. Verificar se a funcionalidade está no escopo da v1.0 (se não estiver, apontar e parar)
3. Mapear arquivos existentes afetados (Grep/Glob)
4. Produzir plano com exatamente estas seções:

### Escopo
O que entra e o que explicitamente NÃO entra.

### Arquivos
Lista de arquivos a criar/alterar com uma linha de propósito cada.

### Banco
Migrations necessárias (ou "nenhuma"). Impacto em RLS.

### Segurança
Riscos e mitigação: input, auth, rate limit, dados pessoais, logs.

### Testes
Unit, integração e E2E necessários.

### Critérios de aceite
Lista verificável, curta.

## Regras
- Preferir sempre a solução mais simples que atende
- Nenhuma biblioteca nova sem justificativa forte
- Se decisão ambígua, escolher a mais fácil de substituir e registrar em docs/DECISIONS.md
