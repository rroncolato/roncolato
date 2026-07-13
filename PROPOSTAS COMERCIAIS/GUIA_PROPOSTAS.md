# 📋 Guia de Propostas Comerciais - Estúdio Roncolato

## 📌 Estrutura da Pasta

```
PROPOSTAS COMERCIAIS/
├── templates/           # Templates e modelos para reutilizar
├── projetos/           # Propostas em desenvolvimento e finalizadas
│   ├── cliente-nome/   # Pasta específica de cada cliente
│   │   ├── v1/         # Versões da proposta
│   │   ├── v2/
│   │   └── final/      # Versão final aprovada
├── assets/             # Logos, cores, fontes padrão
└── GUIA_PROPOSTAS.md  # Este arquivo

```

---

## 🎨 Identidade Visual Obrigatória

### Logos (usar sempre)
- **Logo Horizontal** (padrão): `roncolato-horizontal.png`
- **Logo Vertical** (se necessário): `roncolato-vertical.png`
- **Logo Branco**: para fundos escuros (roncolato-branco-horizontal.png)
- **Símbolo RR**: para assinaturas ou destaque (rr-simbolo.png)

Localização: `/public/assets/IMG/`

### Paleta de Cores (Padrão Roncolato)
- **Cor Primária**: Preto `#000000` ou `#1A1A1A`
- **Cor Secundária**: Branco `#FFFFFF`
- **Cor de Destaque**: (definir com cliente, quando aplicável)
- **Tipografia**: Sans-serif moderna (ex: Inter, Poppins, Montserrat)

### Aplicações
- Header com logo
- Footer com contato e redes sociais
- Bordas e divisores sutis
- Tipografia consistente

---

## 📝 Componentes Obrigatórios da Proposta

### 1️⃣ Capa (Cover)
- Logo do Roncolato (topo ou centro)
- Nome do Cliente
- Serviço/Tipo de Projeto
- Data da Proposta
- Identificação do criador (Rodrigo Roncolato)

### 2️⃣ Índice (Table of Contents)
- Sumário com seções principais
- Facilita navegação e profissionalismo

### 3️⃣ Apresentação do Estúdio
- Sobre Roncolato (breve)
- Expertise e diferenciais
- Portfólio resumido (imagens dos últimos trabalhos relevantes)

### 4️⃣ Briefing & Entendimento
- Problema/Necessidade do cliente
- Objetivos do projeto
- Escopo definido

### 5️⃣ Solução Proposta
- Descrição detalhada dos serviços
- Etapas/Fases do projeto
- Entregáveis
- Timeline

### 6️⃣ Portfólio Relacionado
- Casos de sucesso similares
- Imagens de trabalhos anterior
- Depoimentos (se houver)

### 7️⃣ Investimento
- Tabela de preços
- Formas de pagamento
- Condições (prazos, reajustes)

### 8️⃣ Próximos Passos
- CTA (Call-to-Action) claro
- Contato direto
- Condições para aprovação

### 9️⃣ Footer
- Assinatura (Rodrigo Roncolato)
- Email: rodrigo@rroncolato.com
- WhatsApp/Telefone
- Site: rroncolato.com.br
- Redes sociais

---

## 📊 Formatos Aceitos

- **HTML/CSS** (recomendado - facilita upload online)
- **PDF** (para impressão)
- **Figma** (para design colaborativo)
- **Google Docs** (para revisão/feedback)

---

## 🔄 Processo de Desenvolvimento

### PASSO 1: Preparação
- [ ] Criar pasta `/projetos/nome-do-cliente/`
- [ ] Copiar template base
- [ ] Recolher informações do cliente

### PASSO 2: Desenvolvimento
- [ ] V1: Primeira versão com layout e conteúdo
- [ ] Revisar: Checklist de componentes obrigatórios
- [ ] Usar assets corretos e identidade visual
- [ ] Otimizar imagens

### PASSO 3: Revisão
- [ ] Verificar formatação e alinhamento
- [ ] Conferir ortografia e gramática
- [ ] Validar links (se HTML)
- [ ] Testar responsividade (desktop, tablet, mobile)

### PASSO 4: Aprovação Interna
- [ ] Finalizar versão (salvar em `/final/`)
- [ ] Documentar versão final

### PASSO 5: Apresentação ao Cliente
- [ ] Enviar proposta
- [ ] Aguardar feedback

### PASSO 6: Revisões
- [ ] Se necessário, criar V2, V3, etc.
- [ ] Iterar até aprovação final

---

## ✅ Checklist Antes de SUBIR ONLINE

**NUNCA suba uma proposta incompleta ou em revisão!**

- [ ] Todos os 9 componentes obrigatórios presentes?
- [ ] Logo e identidade visual corretos?
- [ ] Sem erros ortográficos ou gramaticais?
- [ ] Preços definidos e consistentes?
- [ ] Links funcionando (se HTML)?
- [ ] Imagens otimizadas e carregando corretamente?
- [ ] Responsivo em mobile, tablet, desktop?
- [ ] Contato/CTA claro?
- [ ] Footer com todas informações?
- [ ] Arquivo em `/projetos/nome-cliente/final/`?
- [ ] Cliente aprovou a versão final?

---

## 🚀 Deploy Online - rroncolato.com.br/proposta

### Estrutura URL
```
rroncolato.com.br/proposta/
├── nome-do-cliente/    # nome-completo-cliente (lowercase, sem espaços)
│   └── index.html      # Proposta (HTML)
│   └── assets/         # Imagens, CSS, JS
```

### Processo de Upload
1. ✅ Proposta 100% aprovada
2. ✅ Arquivo `index.html` pronto em `/projetos/nome-cliente/final/`
3. ✅ Assets (imagens, CSS) organizados
4. Copiar para `/public/proposta/nome-do-cliente/`
5. Fazer commit: `feat: proposta comercial - nome-cliente`
6. Push para Vercel (deploy automático)
7. Compartilhar link: `rroncolato.com.br/proposta/nome-do-cliente`

### Regra CRÍTICA
- ⛔ **Nunca suba antes de estar 100% finalizado**
- ⛔ **Sempre passar por checklist completo**
- ⛔ **Cliente deve aprovar antes do deploy**

---

## 📚 Versionamento

Dentro de `/projetos/nome-cliente/`:

```
v1/ → Primeira versão (rascunho)
v2/ → Revisões solicitadas
v3/ → Novas iterações
...
final/ → Versão aprovada pronta para deploy
```

---

## 💾 Backup e Organização

Cada proposta deve ter:
- [ ] Arquivo original (Figma, Google Docs, etc)
- [ ] Versão HTML exportada
- [ ] Versão PDF (cópia)
- [ ] Documentação (briefing, aprovações, feedback)

---

## 🎯 Exemplo de Nome de Pasta

```
PROPOSTAS COMERCIAIS/
└── projetos/
    ├── silvano-portrait/
    ├── lara-brenner-branding/
    ├── augusto-cury-event/
    └── novo-cliente/
```

---

## 📞 Contato para Suporte

Se tiver dúvidas sobre o guia ou processo:
- Email: rodrigo@rroncolato.com
- WhatsApp: (conforme contato na proposta)

---

**Versão 1.0** | Atualizado em 24 de Junho de 2026 | Roncolato Studio
