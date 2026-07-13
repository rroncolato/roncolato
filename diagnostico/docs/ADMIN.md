# Painel administrativo

Rota: /admin (protegida por Supabase Auth; em DEMO_MODE, login local de desenvolvimento).

## Seções
- **Visão geral**: totais (diagnósticos, concluídos, pagos), receita, conversão gratuito→pago, cliques agendamento, leads qualificados, erros de análise, funil.
- **Leads**: lista, busca, filtros (temperatura, origem, data), detalhe com respostas, nota, UTM; exportação CSV dos filtrados.
- **Diagnósticos**: resultado, foto via URL assinada temporária, reprocessar, liberar manualmente, excluir foto, excluir/anonimizar.
- **Pagamentos**: status, valor, id externo, data, diagnóstico relacionado.
- **Configurações**: preço, booking URL, WhatsApp, retenção, modo demo, textos principais, checkout on/off.

## Auditoria
Toda ação sensível → audit_logs: visualização de lead, exclusão de foto, alteração de status, exportação, reprocessamento, exclusão de diagnóstico.

## Regras
Nunca expor credencial/token no painel. Lead scoring visível para admin, nunca para o usuário final.
