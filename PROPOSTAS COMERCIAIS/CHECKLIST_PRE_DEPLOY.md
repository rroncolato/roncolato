# ✅ Checklist Pré-Deploy | Propostas Comerciais

**Antes de subir qualquer proposta online, passe por este checklist 100% completo.**

---

## 📋 Checklist Geral

### Conteúdo
- [ ] **Capa**: Logo, nome cliente, tipo de serviço, data presentes
- [ ] **Índice**: Sumário das seções (facilita navegação)
- [ ] **Sobre Roncolato**: Apresentação breve e profissional
- [ ] **Briefing/Entendimento**: Problema e objetivos do cliente claros
- [ ] **Solução Proposta**: Descrição detalhada de como resolveremos
- [ ] **Escopo/Entregáveis**: Listas claras do que será entregue
- [ ] **Timeline**: Fases e prazos bem definidos
- [ ] **Portfólio**: Mínimo 3 casos relacionados com imagens
- [ ] **Investimento**: Tabela de preços clara e sem ambiguidades
- [ ] **Próximos Passos**: CTA (Call-to-Action) bem definido
- [ ] **Footer**: Contato completo, links, assinatura

### Qualidade de Escrita
- [ ] Sem erros ortográficos ou gramaticais (RELER 2X)
- [ ] Linguagem profissional mas acessível
- [ ] Parágrafos curtos (máx 3 linhas)
- [ ] Clareza em conceitos técnicos
- [ ] Tom consistente (voz Roncolato)

### Identidade Visual
- [ ] Logo Roncolato presente e bem posicionado
- [ ] Cores consistentes com identidade (preto/branco base)
- [ ] Tipografia profissional e legível
- [ ] Espaçamento adequado (não apertado demais)
- [ ] Alinhamento e proporções corretos
- [ ] Sem caracteres quebrados ou símbolos estranhos

### Imagens e Mídia
- [ ] Todas as imagens carregando corretamente
- [ ] Imagens otimizadas (peso < 100KB cada)
- [ ] Resolução mínima 1200px (não pixelada)
- [ ] Sem watermarks ou logos de concorrentes
- [ ] Imagens de qualidade profissional
- [ ] Créditos das imagens (se necessário)

### Links e Funcionalidades
- [ ] WhatsApp funciona: `https://wa.me/55[DDD][NUMERO]`
- [ ] Email funciona: `mailto:rodrigo@rroncolato.com`
- [ ] Links internos funcionando (âncoras, navegação)
- [ ] Sem links quebrados ou "404"
- [ ] CTA claro e com link funcionando

### Responsividade
- [ ] ✅ Desktop (1920x1080): layout perfeito
- [ ] ✅ Tablet (768px): elementos bem distribuídos
- [ ] ✅ Mobile (375px): leitura fácil, sem overflow
- [ ] [ ] Testado em navegadores: Chrome, Firefox, Safari, Edge
- [ ] [ ] Sem erros no console (F12 → Console)

### Dados e Valores
- [ ] Preços conferidos e sem erros
- [ ] Datas corretas (ano, mês)
- [ ] Nome cliente escrito corretamente
- [ ] Serviços descritos com precisão
- [ ] Prazos realistas e factíveis
- [ ] Formas de pagamento claras

### Estrutura de Arquivos
- [ ] Pasta: `/projetos/nome-cliente/final/`
- [ ] Arquivo: `index.html` presente
- [ ] Pasta: `assets/` com imagens organizadas
- [ ] Pasta: `css/` (se separado do HTML)
- [ ] Sem arquivos desnecessários

---

## 🔐 Checklist de Segurança & Compliance

- [ ] Sem dados sensíveis expostos (senhas, tokens, chaves)
- [ ] Sem links para sites inseguros (HTTPS)
- [ ] Sem conteúdo de terceiros sem permissão
- [ ] Sem promessas irreais ou enganosas
- [ ] Licença de imagens verificada
- [ ] LGPD: Cliente ciente uso de dados/imagens na proposta

---

## 📱 Teste em Dispositivos

Antes do deploy, testar em:

```
[ ] iPhone 12 / 13 (Safari) - ?
[ ] Android (Chrome) - ?
[ ] iPad (Safari) - ?
[ ] Desktop Chrome (Mac/Windows) - ?
[ ] Desktop Firefox - ?
[ ] Edge - ?
```

**Observações dos testes:**

---

## ✍️ Aprovação

| Item | Sim | Não |
|------|-----|-----|
| Proposta 100% completa? | [ ] | [ ] |
| Sem erros ortográficos? | [ ] | [ ] |
| Imagens OK? | [ ] | [ ] |
| Links testados? | [ ] | [ ] |
| Responsivo em mobile? | [ ] | [ ] |
| Cliente aprovou? | [ ] | [ ] |
| **LIBERADO PARA DEPLOY?** | [ ] | [ ] |

---

## 🚀 Deployment (Executar apenas se ✅ TUDO acima)

### Antes de fazer git commit:

1. **Copiar arquivos**
   ```bash
   cp -r "PROPOSTAS COMERCIAIS/projetos/nome-cliente/final/" "public/proposta/nome-cliente/"
   ```

2. **Verificar estrutura**
   ```
   public/
   └── proposta/
       └── nome-cliente/
           ├── index.html
           └── assets/
               ├── imagem1.jpg
               ├── imagem2.jpg
               └── ...
   ```

3. **Fazer commit**
   ```bash
   git add public/proposta/nome-cliente/
   git commit -m "feat: proposta comercial - nome-cliente"
   ```

4. **Push para Vercel**
   ```bash
   git push origin main
   ```
   *(Vercel faz deploy automático)*

5. **Verificar live**
   - URL: `https://rroncolato.com.br/proposta/nome-cliente`
   - Testar em mobile
   - Conferir links

6. **Compartilhar com cliente**
   - Email: "Sua proposta está pronta!"
   - Link compartilhável
   - Prazo de resposta

---

## 📝 Notas

_Espaço para notas sobre este projeto:_

```
[Deixe suas observações aqui]
```

---

**Data deste checklist:** ___/___/______
**Responsável:** _______________________
**Status:** ☐ Iniciado | ☐ Em Progresso | ☐ Finalizado | ☐ Deployado

---

**Versão 1.0** | Junho 2026
