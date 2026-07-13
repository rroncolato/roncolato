# Extratos Bancários

## Estrutura

- **inter/** - Extratos do Banco Inter
  - extrato-inter-abril-2026.csv
  - extrato-inter-maio-2026.csv
  - extrato-inter-junho-2026.csv

- **itau/** - Extratos do Banco Itaú
  - extrato-itau-junho-2026.csv

## Formato Esperado (CSV)

`
data,descricao,tipo,categoria,valor,saldo
2026-06-01,Depósito Venda,receita,vendas,5000.00,5000.00
2026-06-02,Pagamento Fornecedor,despesa,despesa-operacional,-1200.00,3800.00
`

## Passos

1. Exporte cada extrato do seu banco em CSV
2. Renomeie com padrão: extrato-[banco]-[mes]-[ano].csv
3. Coloque na pasta correspondente
4. O sistema vai processar automaticamente

---

**Importante:** 
- Certifique-se de que as datas estão em formato DD/MM/YYYY ou YYYY-MM-DD
- Valores negativos para despesas, positivos para receitas (ou use coluna 'tipo')
- Exporte com separador , (vírgula)

