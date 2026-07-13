# Decisões arquiteturais

## 2026-07-12 — Fundação

### D1. App separado do site pai
O repositório pai é site estático (Vercel). `diagnostico/` é app Next.js autônomo com package.json próprio. Publicação: projeto Vercel separado + rewrite `rroncolato.com.br/diagnostico`. Motivo: site estático e app Next não coexistem no mesmo projeto Vercel sem fricção; separação permite deploy independente.

### D2. DEMO_MODE como cidadão de primeira classe
`DEMO_MODE=true` → config não exige credenciais externas; IA = fixture validada por schema; pagamento = simulado. Motivo: desenvolvimento e demonstração sem custo nem bloqueio por credencial.

### D3. Fallback de fontes
Nord (licenciada) ausente → Jost (usada no site principal, características próximas) via next/font com variável `--font-nord` reservada para a troca. Libre Franklin para corpo. Motivo: sem download irregular; troca em um arquivo.

### D4. Nota geral no backend
`scoring.ts` é a única fonte da fórmula (pesos 20/20/15/15/20/10). IA entrega apenas pilares 0–100. Motivo: consistência, auditabilidade, imunidade a alucinação de nota.

### D5. Supabase + RLS negar-tudo
Todas as tabelas com RLS; aplicação usa service role no servidor; policies `authenticated` só leitura para painel admin. Bucket privado sem policy pública. Motivo: superfície mínima.

### D6. Zod 3 como contrato universal
Mesmo schema valida form (React Hook Form resolver), API e resposta da IA.

### D7. Tokens público de assessment
`randomBytes(32).toString("base64url")` (43 chars). Sem UUID, sem sequência, sem dado embutido.
