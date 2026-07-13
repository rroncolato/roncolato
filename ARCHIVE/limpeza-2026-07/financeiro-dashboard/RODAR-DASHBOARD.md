# 🚀 Como Rodar o Financeiro Dashboard

## ✅ Pré-requisitos

- Node.js 14+ instalado
- Extratos CSV em `/data/extratos/` (Inter e/ou Itaú)

## 🎯 Passo 1: Instalar Dependências

```bash
cd financeiro-dashboard
npm install
```

## 🎯 Passo 2: Rodar o Servidor

```bash
npm start
```

Ou:

```bash
node server.js
```

## 🎯 Passo 3: Acessar o Dashboard

Abra seu navegador e acesse:

```
http://localhost:3000
```

## 📊 APIs Disponíveis

### Dashboard Completo
```
GET http://localhost:3000/api/financeiro/dashboard
```
Retorna: Métricas, gráficos, análise por categoria, saúde financeira

### Transações (com filtros)
```
GET http://localhost:3000/api/financeiro/transacoes?tipo=receita&categoria=vendas&banco=inter
```

Parâmetros opcionais:
- `tipo`: receita | despesa
- `categoria`: vendas, despesa-operacional, impostos, etc
- `banco`: inter | itau
- `dataInicio`: YYYY-MM-DD
- `dataFim`: YYYY-MM-DD

### Relatório de Análise
```
GET http://localhost:3000/api/financeiro/relatorio
```
Retorna: Resumo executivo, análise detalhada, saúde financeira

### Health Check
```
GET http://localhost:3000/health
```

## 🧪 Testar Backend (sem servidor)

```bash
npm test
```

Isto executa o script de teste e mostra todas as métricas sem precisar abrir um servidor.

## 📁 Estrutura de Arquivos

```
financeiro-dashboard/
├── server.js                          # Servidor Express
├── package.json                       # Dependências
├── frontend/
│   └── dashboard.html                # Interface web
├── api/
│   ├── routes/
│   │   └── financial.js              # Rotas da API
│   ├── controllers/
│   │   ├── csvProcessor.js           # Processa CSV
│   │   └── financialController.js    # Lógica de negócio
│   └── test-backend.js               # Testes
└── data/
    ├── extratos/
    │   ├── inter/                    # Extratos do Banco Inter
    │   └── itau/                     # Extratos do Banco Itaú
    └── processed/                    # Dados processados (gerado)
```

## 💡 Exemplo de Uso

### 1. Adicione seus extratos:
```
/financeiro-dashboard/data/extratos/inter/extrato-inter-abril-junho-2026.csv
/financeiro-dashboard/data/extratos/itau/extrato-itau-junho-2026.csv
```

### 2. Inicie o servidor:
```bash
npm start
```

### 3. Abra no navegador:
```
http://localhost:3000
```

### 4. Visualize os dados:
- Dashboard com métricas consolidadas
- Gráficos de receita e despesa por mês
- Análise por categoria
- Transações recentes
- Saúde financeira

## 🔍 Troubleshooting

### Porta já em uso
Se a porta 3000 está em uso, defina outra:
```bash
PORT=3001 npm start
```

### Nenhum dado aparece
Certifique-se de que:
1. Os arquivos CSV estão em `/data/extratos/`
2. Os nomes seguem o padrão: `extrato-[banco]-[periodo].csv`
3. O formato CSV está correto

### Erro ao instalar dependências
```bash
npm install --legacy-peer-deps
```

## 📝 Formato do CSV

Deve ter estas colunas:
```
data,descricao,tipo,categoria,valor,saldo
```

Exemplo:
```csv
2026-06-01,PIX Recebido,receita,vendas,1500.00,1500.00
2026-06-02,Pagamento Fornecedor,despesa,operacional,-500.00,1000.00
```

## ✨ Funcionalidades

✅ Carregar múltiplos extratos  
✅ Categorizar transações automaticamente  
✅ Calcular métricas financeiras  
✅ Gráficos de receita/despesa por mês  
✅ Análise por categoria  
✅ Alertas de saúde financeira  
✅ Filtros avançados por tipo, categoria, banco, período  
✅ Relatório executivo  

## 🎓 Próximos Passos

1. **Dashboard funcionando?** ✅
2. **Chamar @coo-orchestrator** para diagnóstico inicial
3. **Implementar recomendações** do COO
4. **Integrar com Hormozi Squad** para estratégia de preços
5. **Acompanhamento contínuo** com @avinash-kaushik

---

**Última atualização**: 2026-06-23  
**Status**: ✅ Pronto para usar
