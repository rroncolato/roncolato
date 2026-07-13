# 📋 PROPOSTAS COMERCIAIS - Roncolato Studio

Bem-vindo à pasta de **Propostas Comerciais** do Roncolato Studio!

Aqui você encontrará toda a estrutura, templates e organização para criar propostas profissionais que seguem o padrão visual do estúdio.

---

## 📁 Estrutura da Pasta

```
PROPOSTAS COMERCIAIS/
│
├── 📄 README.md                          ← Você está aqui
├── 📋 GUIA_PROPOSTAS.md                  ← Guia completo (LER PRIMEIRO!)
├── ✅ CHECKLIST_PRE_DEPLOY.md            ← Validação antes de subir
│
├── 📂 templates/                         ← Modelos reutilizáveis
│   └── template-proposta.html            ← Template base HTML
│
├── 📂 projetos/                          ← Propostas em desenvolvimento
│   ├── cliente-1/
│   ├── cliente-2/
│   └── novo-cliente/
│       ├── v1/                          ← Primeira versão
│       ├── v2/                          ← Revisões
│       └── final/                       ← Versão aprovada (pronta para deploy)
│
└── 📂 assets/                            ← Logos, fonts, cores padrão
    ├── logos/
    ├── colors.md
    └── typography.md
```

---

## 🚀 Como Começar uma Nova Proposta

### **Passo 1: Preparar a Pasta**

```bash
mkdir -p "projetos/novo-cliente/v1"
```

### **Passo 2: Copiar o Template**

```bash
cp templates/template-proposta.html "projetos/novo-cliente/v1/index.html"
```

### **Passo 3: Customizar**

Abra o arquivo HTML e preencha:
- `[NOME DO CLIENTE]` → Nome real
- `[Tipo de Serviço]` → Sessão foto / Branding / etc
- Seções de conteúdo conforme briefing
- Imagens do portfólio relevantes
- Preços e condições

### **Passo 4: Organizar Assets**

```
projetos/novo-cliente/v1/
├── index.html
└── assets/
    ├── imagem1.jpg
    ├── imagem2.jpg
    └── imagem3.jpg
```

### **Passo 5: Revisar com Checklist**

Abra `CHECKLIST_PRE_DEPLOY.md` e valide 100% dos itens.

### **Passo 6: Aprovar com Cliente**

Se aprovado, mova para `final/`:

```bash
cp -r "projetos/novo-cliente/v1/" "projetos/novo-cliente/final/"
```

### **Passo 7: Deploy Online**

```bash
cp -r "projetos/novo-cliente/final/" "../../public/proposta/novo-cliente/"
git add public/proposta/novo-cliente/
git commit -m "feat: proposta comercial - novo-cliente"
git push
```

**URL da proposta:** `rroncolato.com.br/proposta/novo-cliente`

---

## 📖 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| **GUIA_PROPOSTAS.md** | Leia primeiro! Explica conceitos e padrões |
| **CHECKLIST_PRE_DEPLOY.md** | Use antes de qualquer deploy |
| **templates/template-proposta.html** | Copie e customize para cada cliente |
| **README.md** | Este arquivo (visão geral rápida) |

---

## 🎨 Padrões de Branding

### Cores Principais
- **Preto**: `#1a1a1a` (fundo, textos principais)
- **Branco**: `#ffffff` (fundo, textos luz)
- **Cinza**: `#f9f9f9` (destaque suave)

### Tipografia
- **Headings (H1, H2, H3)**: Font-weight 600-700
- **Body**: `Segoe UI`, Tahoma, Geneva, Verdana, sans-serif
- **Tamanho**: Minimo 16px no body

### Logo
- Sempre usar `roncolato-horizontal.png` quando possível
- Para fundos escuros: `roncolato-branco-horizontal.png`
- Localização: `/public/assets/IMG/`

---

## 💡 Dicas Profissionais

✅ **Faça**
- Use o checklist ANTES de qualquer deploy
- Teste a proposta em mobile (é importante!)
- Peça aprovação do cliente antes de subir online
- Mantenha histórico de versões (v1, v2, final)
- Use imagens de alta qualidade

❌ **Não Faça**
- Não suba proposta incompleta ou com erros
- Não mude o layout padrão sem motivo
- Não copie propostas de clientes passados sem revisar
- Não esqueça de otimizar imagens (peso importa)
- Não prometa prazos irrealistas

---

## 📊 Exemplo de Nomenclatura

```
✅ Bom:
    projetos/silvano-portrait/
    projetos/lara-brenner-branding/
    projetos/novo-cliente-2026/

❌ Ruim:
    projetos/cliente1/
    projetos/PROPOSTA CLIENTE XYZ/
    projetos/proposta_novo
```

**Padrão**: `nome-sobrenome` ou `nome-tipo-servico` (lowercase, hífens, sem espaços)

---

## 🔗 Links Úteis

- **Site Principal**: [rroncolato.com.br](https://rroncolato.com.br)
- **Email**: rodrigo@rroncolato.com
- **WhatsApp**: [Chat](https://wa.me/5511999999999)
- **Instagram**: [@rroncolato](https://instagram.com/rroncolato)

---

## 📝 Versionamento

### Nomenclatura de Pastas
- `v1/` → Primeira versão (rascunho)
- `v2/` → Segundo round de revisões
- `v3/` → Terceiras revisões
- `final/` → **Versão aprovada, pronta para deploy**

**NUNCA** suba uma proposta que não esteja em `final/`.

---

## 🆘 Precisa de Ajuda?

Se tiver dúvidas:

1. **Leia GUIA_PROPOSTAS.md** (respostas para 90% das dúvidas)
2. **Confira CHECKLIST_PRE_DEPLOY.md** (validação completa)
3. **Use o template** como base (já tem estrutura pronta)
4. **Contate Rodrigo** se realmente necessário: rodrigo@rroncolato.com

---

## 📅 Histórico de Atualizações

| Data | Versão | Alterações |
|------|--------|-----------|
| 24/06/2026 | 1.0 | Criação inicial da estrutura |

---

**Última atualização:** 24 de Junho de 2026

**Mantido por:** Roncolato Studio  
**Email:** rodrigo@rroncolato.com
