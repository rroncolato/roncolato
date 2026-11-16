# SEO do site (Google, Bing, ChatGPT, Claude, Perplexity)

Tudo é gerado por `scripts/seo/gerar-seo.mjs`, com os dados do negócio em `scripts/seo/config.mjs`.

## Quando rodar

Sempre que mudar um post do blog, um projeto do portfólio, as perguntas do /ensaio ou os dados do negócio:

```bash
npm run seo                                            # lê data/blog-posts.json
npm run seo -- --fonte scripts/seo/posts-producao.json # cópia dos 10 posts que estão no ar
```

O gerador pode rodar quantas vezes quiser: o resultado é sempre o mesmo.

## O que ele faz

| Onde | O quê |
|---|---|
| Todas as páginas | `title`, `description`, endereço canônico, Open Graph e Twitter (prévia no WhatsApp/LinkedIn), dados estruturados (negócio local, Rodrigo, site, trilha de navegação) |
| `/ensaio` | Serviço com os 4 pacotes e preços + Perguntas frequentes (lidas da própria página) |
| Portfólio | Lista dos projetos pronta no HTML + dados estruturados de cada projeto |
| Blog | Uma página real por artigo (`/blog/nome-do-artigo/`), com o texto pronto no HTML, dados de artigo e "Leia também" |
| Robôs | `robots.txt` (libera buscadores e IAs, bloqueia propostas, dashboards, Social Frame e admin), `sitemap.xml`, `llms.txt` e `llms-full.txt` (resumo e artigos completos para IAs) |

Imagens de compartilhamento: `public/assets/IMG/og/` (1200×630).

## Fontes que o gerador usa

- Blog: `scripts/seo/modelos/blog.html` (modelo visual) + posts em JSON. **Edite o modelo, não as páginas geradas em `public/nova-home/blog/`.**
- Portfólio: a lista `CASES` dentro de `public/nova-home/portfolio/index.html`.
- Perguntas do ensaio: a seção `#perguntas` de `public/ensaio/index.html`.

## Rascunho × no ar

Enquanto as páginas novas estão em `/nova-home/`, elas levam `noindex` (não aparecem no Google) e os arquivos de robôs ficam em `public/nova-home/seo/` só para conferência. O /ensaio já está no endereço definitivo e leva `index`.

### No lançamento

1. Mover `public/nova-home/` para a raiz: home → `public/index.html`, portfólio → `public/portfolio/`, blog → `public/blog/` (guardar a home antiga em `ARCHIVE/`).
2. Em `config.mjs`, trocar `arquivo`/`pasta`/`caminho` de cada página para o endereço final, e trocar os links `/nova-home/...` nos HTML.
3. Em `vercel.json`, remover a regra `"/blog/:slug" → "/api/blog/[slug]"` (essa rota não existe e dá 404).
4. `npm run seo -- --raiz` (grava `robots.txt`, `sitemap.xml` e `llms.txt` na raiz do site).
5. Deploy, só com aprovação.
6. Conferir: `https://search.google.com/test/rich-results` e `https://rroncolato.com.br/robots.txt`.

## Fora do site (faz tanta diferença quanto o código)

- **Perfil da Empresa no Google** (o antigo "Google Meu Negócio"): o mesmo nome, telefone e cidade do site, a categoria principal "Fotógrafo comercial" e a secundária "Estúdio fotográfico". Também os serviços com preços, fotos dos ensaios e o link para o /ensaio. **Peça avaliações aos clientes**: é o fator que mais pesa nas buscas locais.
- **Google Search Console**: verificar o domínio e enviar `https://rroncolato.com.br/sitemap.xml`.
- **Bing Webmaster Tools**: importar do Search Console. O ChatGPT usa muito o índice do Bing.
- **Mesmas informações em todo lugar**: bio do Instagram, LinkedIn e WhatsApp Business com o mesmo nome, cidade e link do site.
- **Frequência**: um artigo novo por mês ajuda o blog a ser citado por Google e IAs.

### Descrição para o Perfil da Empresa no Google (até 750 caracteres)

> O Estúdio Roncolato é o estúdio de fotografia corporativa e marca pessoal de Rodrigo Roncolato, designer estratégico e fotógrafo com mais de 20 anos de atuação em Goiânia. Criamos imagens com estratégia para empresários, mentores, profissionais e empresas que querem ser percebidos pelo valor que entregam. Fazemos ensaios de marca pessoal, retratos executivos, fotos de equipe, eventos corporativos e branding fotográfico. Já atendemos marcas como Coca-Cola, Toyota e Augusto Cury, no Brasil, em Portugal e na Irlanda. Ensaios a partir de R$ 1.500, com pagamento via PIX ou em até 3x no cartão. Imagem não é vaidade. É estratégia.
