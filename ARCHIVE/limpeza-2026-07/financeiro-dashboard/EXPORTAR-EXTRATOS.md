# 📥 Como Exportar Extratos - Banco Inter & Itaú

## 🏦 Banco Inter

### Passo a Passo:

1. **Acesse seu Inter**
   - App Inter ou [inter.co](https://inter.co)
   - Entre na conta PJ

2. **Vá para Extratos**
   - Menu → Conta → Extrato
   - Ou: Documentos → Extrato Bancário

3. **Selecione o Período**
   - Data Inicial: **01/04/2026**
   - Data Final: **30/06/2026**
   - Clique em "Buscar"

4. **Faça o Download**
   - Clique em "Baixar" ou "Exportar"
   - Formato: **CSV** (se houver opção)
   - Salve como: `extrato-inter-abril-junho-2026.csv`

5. **Organize**
   ```
   financeiro-dashboard/data/extratos/inter/
   └── extrato-inter-abril-junho-2026.csv
   ```

### ⚠️ Se o Inter só permitir mês por mês:

Exporte cada mês separadamente:
- `extrato-inter-abril-2026.csv`
- `extrato-inter-maio-2026.csv`
- `extrato-inter-junho-2026.csv`

---

## 🏦 Banco Itaú

### Passo a Passo:

1. **Acesse seu Itaú**
   - App Itaú Empresas ou [itau.com.br](https://www.itau.com.br)
   - Vá para sua conta PJ

2. **Vá para Extratos**
   - Menu → Extratos
   - Ou: Contas → Extrato da Conta

3. **Selecione o Período**
   - Data Inicial: **01/06/2026**
   - Data Final: **30/06/2026**
   - Clique em "Consultar" ou "Buscar"

4. **Faça o Download**
   - Botão "Exportar" ou "Baixar"
   - Formato: **CSV** ou **Excel**
   - Se for Excel, salve como CSV depois
   - Salve como: `extrato-itau-junho-2026.csv`

5. **Organize**
   ```
   financeiro-dashboard/data/extratos/itau/
   └── extrato-itau-junho-2026.csv
   ```

---

## 📋 Verificar Arquivo Antes de Fazer Upload

Abra o CSV em um editor de texto (Notepad++, VS Code) ou Excel e verifique:

### ✅ Coluna 1: DATA
- Formato: `DD/MM/YYYY` ou `YYYY-MM-DD`
- Exemplo: `01/06/2026` ou `2026-06-01`

### ✅ Coluna 2: DESCRIÇÃO
- Descrição da transação
- Exemplo: `Depósito TED` ou `Pagto Fornecedor X`

### ✅ Coluna 3: TIPO
- `receita` ou `despesa` (ou `crédito`/`débito`)
- Ou valor positivo/negativo na coluna de valor

### ✅ Coluna 4+: VALOR
- Números com ponto (.) ou vírgula (,) como separador decimal
- Positivo para receita, negativo para despesa
- Exemplo: `5000.00` ou `5000,00`

### ✅ Exemplo de Arquivo Correto:

```csv
data,descricao,tipo,valor
01/06/2026,Depósito Cliente ABC,receita,15000.00
02/06/2026,Pagamento Fornecedor,despesa,-3500.00
03/06/2026,TED Recebida,receita,8000.00
05/06/2026,Aluguel Sala,despesa,-2500.00
```

---

## 🔧 Se o Banco Exportar Diferente

### Cenário 1: Arquivo vem com "Débito" e "Crédito" em colunas separadas

Seu arquivo pode vir assim:
```csv
data,descricao,credito,debito
01/06/2026,Depósito,15000.00,
02/06/2026,Pagamento,,3500.00
```

**Solução:** Antes de enviar, converta para:
```csv
data,descricao,tipo,valor
01/06/2026,Depósito,receita,15000.00
02/06/2026,Pagamento,despesa,-3500.00
```

### Cenário 2: Arquivo vem com "Saldo" anterior/posterior

Não é problema! O sistema vai ignorar. Mantém essas colunas:
```csv
data,descricao,valor,saldo_anterior,saldo_posterior
01/06/2026,Depósito,15000.00,0.00,15000.00
```

### Cenário 3: Arquivo vem em formato OFX ou PDF

Você pode:
- ✅ Copiar dados e colar em Excel → Salvar como CSV
- ✅ Usar ferramentas online para converter OFX → CSV
- ✅ Enviá-lo para mim que eu converto

---

## 📍 Aonde Colocar os Arquivos

Após exportar, salve em:

```
C:\Users\rodri\Downloads\SITE RONCOLATO\financeiro-dashboard\data\extratos\
├── inter/
│   ├── extrato-inter-abril-2026.csv
│   ├── extrato-inter-maio-2026.csv
│   └── extrato-inter-junho-2026.csv
└── itau/
    └── extrato-itau-junho-2026.csv
```

---

## ✅ Checklist Antes de Enviar

- [ ] Arquivo em CSV (ou Excel convertido para CSV)
- [ ] Data em formato uniforme (DD/MM/YYYY ou YYYY-MM-DD)
- [ ] Valores com separador decimal correto
- [ ] Tipo de transação identificado (receita/despesa)
- [ ] Arquivo nomeado corretamente
- [ ] Arquivo na pasta certa (`inter/` ou `itau/`)

---

## 🚀 Próximo Passo

Depois que colocar os arquivos nas pastas:

1. Avise-me que os extratos estão prontos
2. Vou conectar o backend para processar
3. Dashboard vai popular automaticamente
4. Vamos convocar @coo-orchestrator para análise

---

**Dúvidas?** Envie uma screenshot do extrato que ajudo a converter!

*Última atualização: 2026-06-23*
