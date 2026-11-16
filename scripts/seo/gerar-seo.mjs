#!/usr/bin/env node
// Gera o SEO do site: cabeçalhos (title, description, Open Graph, dados estruturados),
// páginas estáticas do blog, portfólio pronto em HTML, robots.txt, sitemap.xml e llms.txt.
//
// Uso:  npm run seo                      (usa data/blog-posts.json)
//       npm run seo -- --fonte arquivo.json
//       npm run seo -- --raiz            (grava robots/sitemap/llms na raiz do site; só no lançamento)
//
// Rode sempre que mudar um post, um projeto do portfólio ou os dados em scripts/seo/config.mjs.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, NEGOCIO, PESSOA, SERVICOS, PACOTES, PAGINAS, SLUGS_SEO, PRIVADO, ROBOS } from './config.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const FONTE = arg('--fonte') || 'data/blog-posts.json';
const SAIDA_ROBOS = args.includes('--raiz') ? 'public' : 'public/nova-home/seo';

const ler = (p) => readFileSync(join(RAIZ, p), 'utf8');
const gravar = (p, t) => { mkdirSync(dirname(join(RAIZ, p)), { recursive: true }); writeFileSync(join(RAIZ, p), t); };
const abs = (u) => (u.startsWith('http') ? u : SITE + u);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const texto = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const rascunho = (pg) => pg.caminho !== pg.final;

// Substitui o conteúdo entre <!--R:nome--> e <!--/R:nome--> (mantém os marcadores)
function regiao(html, nome, conteudo) {
  const re = new RegExp(`<!--R:${nome}-->[\\s\\S]*?<!--/R:${nome}-->`);
  if (!re.test(html)) throw new Error(`Região ${nome} não encontrada`);
  return html.replace(re, () => `<!--R:${nome}-->${conteudo}<!--/R:${nome}-->`);
}
// Remove a região inteira (com marcadores)
const tirar = (html, nome) => html.replace(new RegExp(`<!--R:${nome}-->[\\s\\S]*?<!--/R:${nome}-->`), '');
const seo = (html, bloco) => html.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, () => `<!--SEO-->\n${bloco}\n<!--/SEO-->`);

// ---------- Datas ----------
const MESES = { jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5, jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11 };
const NOMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
function data(s) {
  const m = String(s || '').trim().match(/^(\d{1,2})\s+([A-Za-zçÇ]{3})\w*\.?\s+(\d{4})$/);
  if (!m || MESES[m[2].toLowerCase()] === undefined) return null;
  return { iso: `${m[3]}-${String(MESES[m[2].toLowerCase()] + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`,
           br: `${+m[1]} de ${NOMES[MESES[m[2].toLowerCase()]]} de ${m[3]}` };
}

// ---------- Dados estruturados comuns ----------
const ID = { negocio: SITE + '/#negocio', pessoa: SITE + '/#rodrigo', site: SITE + '/#site' };
const negocio = () => ({
  '@type': ['ProfessionalService', 'LocalBusiness'], '@id': ID.negocio,
  name: NEGOCIO.nome, alternateName: NEGOCIO.alternativos, slogan: NEGOCIO.slogan,
  description: NEGOCIO.descricao, url: SITE + '/', logo: abs(NEGOCIO.logo), image: abs(PESSOA.foto),
  telephone: NEGOCIO.telefone, priceRange: NEGOCIO.faixaPreco, foundingDate: NEGOCIO.fundacao,
  address: { '@type': 'PostalAddress', addressLocality: NEGOCIO.cidade, addressRegion: NEGOCIO.estado, addressCountry: NEGOCIO.pais },
  areaServed: [{ '@type': 'City', name: 'Goiânia' }, { '@type': 'Country', name: 'Brasil' }],
  founder: { '@id': ID.pessoa }, sameAs: [NEGOCIO.instagram], knowsAbout: NEGOCIO.temas,
  contactPoint: { '@type': 'ContactPoint', telephone: NEGOCIO.telefone, contactType: 'customer service', url: NEGOCIO.whatsapp, availableLanguage: ['pt-BR'] },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Serviços', itemListElement: SERVICOS.map((s) => ({
    '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.nome, description: s.descricao, url: abs(s.url) } })) },
});
const pessoa = () => ({
  '@type': 'Person', '@id': ID.pessoa, name: PESSOA.nome, jobTitle: PESSOA.cargo, image: abs(PESSOA.foto),
  url: SITE + '/', worksFor: { '@id': ID.negocio }, sameAs: [NEGOCIO.instagram], knowsAbout: NEGOCIO.temas,
  description: `${PESSOA.cargo} com mais de 20 anos de atuação, formado em ${PESSOA.formacao}. Atendeu marcas como ${NEGOCIO.clientes.slice(0, 3).join(', ')} no Brasil, em Portugal e na Irlanda.`,
});
const site = () => ({ '@type': 'WebSite', '@id': ID.site, url: SITE + '/', name: NEGOCIO.nome, inLanguage: 'pt-BR', publisher: { '@id': ID.negocio } });
const trilha = (itens) => ({ '@type': 'BreadcrumbList', itemListElement: itens.map(([nome, url], i) => ({ '@type': 'ListItem', position: i + 1, name: nome, item: abs(url) })) });
const grafo = (nos) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': nos }).replace(/</g, '\\u003c')}</script>`;

function cabecalho({ titulo, descricao, final, imagem, indexar, tipo = 'website', extra = '', nos }) {
  return [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}">`,
    `<meta name="robots" content="${indexar ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow'}">`,
    `<link rel="canonical" href="${abs(final)}">`,
    `<meta property="og:type" content="${tipo}">`,
    `<meta property="og:site_name" content="${esc(NEGOCIO.nome)}">`,
    `<meta property="og:locale" content="pt_BR">`,
    `<meta property="og:title" content="${esc(titulo)}">`,
    `<meta property="og:description" content="${esc(descricao)}">`,
    `<meta property="og:url" content="${abs(final)}">`,
    `<meta property="og:image" content="${abs(imagem)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(titulo)}">`,
    `<meta name="twitter:description" content="${esc(descricao)}">`,
    `<meta name="twitter:image" content="${abs(imagem)}">`,
    extra, grafo(nos),
  ].filter(Boolean).join('\n');
}

// ---------- Blog ----------
const fonteJson = JSON.parse(ler(FONTE));
const POSTS = (Array.isArray(fonteJson) ? fonteJson : fonteJson.posts || [])
  .filter((p) => p.published !== false && p.slug)
  .map((p) => ({ ...p, seo: SLUGS_SEO[p.slug] || p.slug, d: data(p.date), capa: p.img || (p.video ? `https://i.ytimg.com/vi/${p.video}/hqdefault.jpg` : '') }))
  .sort((a, b) => (b.d?.iso || '').localeCompare(a.d?.iso || ''));

const B = PAGINAS.blog;
const urlPost = (p, final) => (final ? B.final : B.caminho) + p.seo + '/';
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#i-wa"/></svg>';

const card = (p) => `<a class="post-card reveal" href="${urlPost(p)}" data-tag="${esc(p.tag)}">` +
  `<figure><img src="${esc(p.capa)}" alt="" loading="lazy" width="1200" height="800" onload="wideFix(this)"></figure>` +
  `<div class="meta"><span class="pill">${esc(p.tag)}</span></div>` +
  `<h3><span>${esc(p.title)}</span></h3><p>${esc(p.excerpt)}</p>` +
  `<div class="meta foot"><time datetime="${p.d?.iso || ''}">${esc(p.d?.br || p.date)}</time></div></a>`;

const slugMap = () => {
  const m = {};
  POSTS.forEach((p) => { m[p.slug] = urlPost(p); m[p.seo] = urlPost(p); });
  return `<script type="application/json" id="slugMap">${JSON.stringify(m)}</script>`;
};

function slugify(t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48); }

function corpoComIds(html) {
  const h2 = [];
  const out = String(html || '').replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => {
    const id = `s${h2.length + 1}-${slugify(texto(t))}`; h2.push({ id, t: texto(t) });
    return `<h2 id="${id}">${t}</h2>`;
  });
  return { out, h2 };
}

function gerarBlog() {
  const modelo = ler(B.modelo).replace('<!-- Modelo do blog. As páginas em public/nova-home/blog/ são geradas a partir dele: npm run seo -->',
    '<!-- Gerado por scripts/seo/gerar-seo.mjs a partir de scripts/seo/modelos/blog.html. Não edite aqui. -->');
  const indexar = !rascunho(B);
  const base = (h) => regiao(h.split('__BLOG_URL__').join(B.caminho), 'slugMap', slugMap());

  // Limpa artigos gerados antes (mantém posts-exemplo.json e o index)
  const pasta = join(RAIZ, B.pasta);
  if (existsSync(pasta)) readdirSync(pasta, { withFileTypes: true }).filter((e) => e.isDirectory()).forEach((e) => rmSync(join(pasta, e.name), { recursive: true }));

  // Lista
  const dest = POSTS.find((p) => p.featured) || POSTS[0];
  let lista = tirar(base(modelo), 'article');
  lista = regiao(lista, 'count', `Blog · ${POSTS.length} artigos`);
  lista = regiao(lista, 'featured', dest ? `<a class="featured" id="featured" href="${urlPost(dest)}" data-tag="${esc(dest.tag)}">` +
    `<figure><img src="${esc(dest.capa)}" alt="" width="1600" height="1000" onload="wideFix(this)"></figure>` +
    `<div><div class="lbl">Mais recente</div><div class="meta"><span class="pill">${esc(dest.tag)}</span><time datetime="${dest.d?.iso || ''}">${esc(dest.d?.br || dest.date)}</time></div>` +
    `<h2>${esc(dest.title)}</h2><p>${esc(dest.excerpt)}</p><span class="more">Ler artigo ${ARROW}</span></div></a>` : '');
  lista = regiao(lista, 'grid', POSTS.filter((p) => p !== dest).map(card).join(''));
  lista = seo(lista, cabecalho({
    titulo: B.titulo, descricao: B.descricao, final: B.final, imagem: B.imagem, indexar,
    nos: [negocio(), pessoa(), site(), trilha([['Início', '/'], ['Blog', B.final]]), {
      '@type': 'Blog', '@id': abs(B.final) + '#blog', url: abs(B.final), name: 'Blog do Estúdio Roncolato', description: B.descricao,
      inLanguage: 'pt-BR', publisher: { '@id': ID.negocio }, author: { '@id': ID.pessoa },
      blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(urlPost(p, true)), datePublished: p.d?.iso, image: abs(p.capa) })),
    }],
  }));
  gravar(join(B.pasta, 'index.html'), lista);

  // Artigos
  POSTS.forEach((p) => {
    const { out, h2 } = corpoComIds(p.body);
    const finalUrl = urlPost(p, true);
    const compartilhar = abs(indexar ? finalUrl : urlPost(p));
    const rel = POSTS.filter((x) => x !== p && x.tag === p.tag).concat(POSTS.filter((x) => x !== p && x.tag !== p.tag)).slice(0, 3);
    let h = tirar(base(modelo), 'list');
    h = h.replace('<body data-page="list">', '<body data-page="post">');
    h = regiao(h, 'aMeta', `<span class="pill">${esc(p.tag)}</span><time datetime="${p.d?.iso || ''}">${esc(p.d?.br || p.date)}</time>`);
    h = regiao(h, 'aTitle', esc(p.title));
    h = regiao(h, 'aLead', esc(p.excerpt));
    h = regiao(h, 'aCover', p.video
      ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(p.video)}" title="${esc(p.title)}" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
      : (p.capa ? `<figure><img src="${esc(p.capa)}" alt="${esc(p.title)}" width="1600" height="900" fetchpriority="high"></figure>` : ''));
    h = regiao(h, 'toc', h2.length >= 3 ? `<nav class="toc" id="toc" aria-label="Neste artigo"><b>Neste artigo</b><ol id="tocList">${h2.map((x) => `<li><a href="#${x.id}">${esc(x.t)}</a></li>`).join('')}</ol></nav>` : '');
    h = regiao(h, 'aBody', out);
    h = regiao(h, 'share', `<div class="share"><span>Compartilhe</span>` +
      `<a href="https://wa.me/?text=${encodeURIComponent(p.title + ' ' + compartilhar)}" target="_blank" rel="noopener">${WA_ICON}WhatsApp</a>` +
      `<a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(compartilhar)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/></svg>LinkedIn</a>` +
      `<button type="button" id="shCopy" data-url="${esc(compartilhar)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5"/></svg><span id="copyTxt">Copiar link</span></button></div>`);
    h = regiao(h, 'ctaWa', `<a class="btn btn-ghostk" href="https://wa.me/5562985928423?text=${encodeURIComponent(`Olá Rodrigo! Li o artigo "${p.title}" e quero conversar sobre a minha imagem.`)}" target="_blank" rel="noopener">${WA_ICON}Falar no WhatsApp</a>`);
    h = regiao(h, 'related', rel.map(card).join(''));
    h = seo(h, cabecalho({
      titulo: p.title.length > 52 ? p.title : `${p.title} | Blog Roncolato`, descricao: p.excerpt, final: finalUrl, imagem: p.capa, indexar, tipo: 'article',
      extra: [p.d && `<meta property="article:published_time" content="${p.d.iso}">`, `<meta property="article:section" content="${esc(p.tag)}">`, `<meta property="article:author" content="${esc(PESSOA.nome)}">`].filter(Boolean).join('\n'),
      nos: [negocio(), pessoa(), site(), trilha([['Início', '/'], ['Blog', B.final], [p.title, finalUrl]]), {
        '@type': 'BlogPosting', '@id': abs(finalUrl) + '#artigo', mainEntityOfPage: abs(finalUrl), headline: p.title, description: p.excerpt,
        image: abs(p.capa), datePublished: p.d?.iso, dateModified: p.d?.iso, inLanguage: 'pt-BR', articleSection: p.tag,
        wordCount: texto(p.body).split(' ').length, author: { '@id': ID.pessoa }, publisher: { '@id': ID.negocio }, isPartOf: { '@id': abs(B.final) + '#blog' },
      }],
    }));
    gravar(join(B.pasta, p.seo, 'index.html'), h);
  });
  return POSTS.length;
}

// ---------- Home, portfólio e ensaio ----------
function gerarHome() {
  const pg = PAGINAS.home;
  gravar(pg.arquivo, seo(ler(pg.arquivo), cabecalho({ ...base(pg), nos: [negocio(), pessoa(), site(), trilha([['Início', '/']])] })));
}
const base = (pg) => ({ titulo: pg.titulo, descricao: pg.descricao, final: pg.final, imagem: pg.imagem, indexar: !rascunho(pg) });

function lerCases() {
  const h = ler(PAGINAS.portfolio.arquivo);
  const a = h.indexOf('var CASES = ') + 'var CASES = '.length;
  return JSON.parse(h.slice(a, h.indexOf('];', a) + 1));
}
function gerarPortfolio() {
  const pg = PAGINAS.portfolio, cases = lerCases();
  let h = ler(pg.arquivo);
  h = regiao(h, 'cases', cases.map((c) => `<a class="card reveal in" href="#${c.id}" data-cat="${esc(c.cat)}"><figure>` +
    `<img src="${esc(c.cover[0])}" alt="${esc(c.title)} — ${esc(c.cat)}, ${c.year}" width="${c.cover[1]}" height="${c.cover[2]}" loading="lazy" style="object-position:${c.pos}">` +
    `<span class="card-count">${c.imgs.length} imagens</span></figure><div class="card-meta"><div><h2>${esc(c.title)}</h2><p>${esc(c.cat)} · ${c.year}</p></div><span class="go" aria-hidden="true">${ARROW}</span></div></a>`).join(''));
  h = seo(h, cabecalho({ ...base(pg), nos: [negocio(), pessoa(), site(), trilha([['Início', '/'], ['Portfólio', pg.final]]), {
    '@type': 'CollectionPage', '@id': abs(pg.final) + '#pagina', url: abs(pg.final), name: pg.titulo, description: pg.descricao, inLanguage: 'pt-BR',
    about: { '@id': ID.negocio },
    mainEntity: { '@type': 'ItemList', numberOfItems: cases.length, itemListElement: cases.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: c.title, genre: c.cat, dateCreated: String(c.year),
        description: texto(c.desc), image: abs(c.cover[0]), url: abs(pg.final) + '#' + c.id, creator: { '@id': ID.pessoa } } })) },
  }] }));
  gravar(pg.arquivo, h);
  return cases.length;
}

function lerFaq(h) {
  return [...h.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map((m) => ({ q: texto(m[1]), r: texto(m[2]) }));
}
function gerarEnsaio() {
  const pg = PAGINAS.ensaio;
  const h = ler(pg.arquivo), faq = lerFaq(h);
  gravar(pg.arquivo, seo(h, cabecalho({ ...base(pg), nos: [negocio(), pessoa(), site(), trilha([['Início', '/'], ['Ensaio fotográfico', pg.final]]), {
    '@type': 'Service', '@id': abs(pg.final) + '#servico', name: 'Ensaio fotográfico profissional', serviceType: 'Fotografia de marca pessoal e corporativa',
    description: pg.descricao, url: abs(pg.final), provider: { '@id': ID.negocio }, areaServed: { '@type': 'City', name: 'Goiânia' },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Pacotes de ensaio', itemListElement: PACOTES.map((p) => ({
      '@type': 'Offer', name: `Ensaio ${p.nome}`, description: p.itens.join(', '), url: abs(pg.final) + '#pacotes',
      ...(p.preco ? { price: p.preco.toFixed(2), priceCurrency: 'BRL', availability: 'https://schema.org/InStock' } : {}) })) },
  }, { '@type': 'FAQPage', '@id': abs(pg.final) + '#perguntas', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.r } })) }] })));
  return faq.length;
}

// ---------- robots.txt, sitemap.xml, llms.txt ----------
function gerarRobos() {
  const robots = ['# Robôs de busca e de inteligência artificial são bem-vindos nas páginas públicas.',
    '# Áreas privadas (propostas, dashboards, catálogos de clientes, admin) ficam de fora.',
    ...['*', ...ROBOS].map((r) => `User-agent: ${r}`), 'Allow: /', ...PRIVADO.map((p) => `Disallow: ${p}`), '',
    `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n');
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = [[PAGINAS.home.final, hoje, '1.0'], [PAGINAS.ensaio.final, hoje, '0.9'], [PAGINAS.portfolio.final, hoje, '0.8'], [B.final, POSTS[0]?.d?.iso || hoje, '0.7'],
    ...POSTS.map((p) => [urlPost(p, true), p.d?.iso || hoje, '0.6'])];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(([u, d, pr]) => `  <url><loc>${abs(u)}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join('\n') + '\n</urlset>\n';
  const cases = lerCases();
  const llms = [`# ${NEGOCIO.nome} — ${PESSOA.nome}`, '', `> ${NEGOCIO.descricao}`, '',
    '## Informações principais', '',
    `- Profissional: ${PESSOA.nome}, ${PESSOA.cargo.toLowerCase()}, formado em ${PESSOA.formacao}, com mais de 20 anos de atuação.`,
    `- Local: ${NEGOCIO.cidade}, Goiás, Brasil. Já atendeu projetos no Brasil, em Portugal e na Irlanda.`,
    `- Estúdio próprio desde ${NEGOCIO.fundacao}.`,
    `- Clientes: ${NEGOCIO.clientes.join(', ')}.`,
    `- Contato: WhatsApp ${NEGOCIO.telefone} (${NEGOCIO.whatsapp}) e Instagram @rroncolato (${NEGOCIO.instagram}).`,
    `- Pagamento: PIX à vista ou até 3x no cartão.`, '',
    '## Pacotes de ensaio fotográfico', '',
    ...PACOTES.map((p) => `- ${p.nome} — ${p.preco ? 'R$ ' + p.preco.toLocaleString('pt-BR') : 'sob consulta'}: ${p.itens.join(', ')}.`), '',
    '## Páginas', '',
    `- [Início](${abs(PAGINAS.home.final)}): ${PAGINAS.home.descricao}`,
    `- [Ensaio fotográfico em Goiânia](${abs(PAGINAS.ensaio.final)}): ${PAGINAS.ensaio.descricao}`,
    `- [Portfólio](${abs(PAGINAS.portfolio.final)}): ${PAGINAS.portfolio.descricao}`,
    `- [Blog](${abs(B.final)}): ${B.descricao}`, '',
    '## Portfólio', '',
    ...cases.map((c) => `- ${c.title} (${c.cat}, ${c.year}): ${texto(c.desc)}`), '',
    '## Artigos', '',
    ...POSTS.map((p) => `- [${p.title}](${abs(urlPost(p, true))}): ${p.excerpt}`), ''].join('\n');
  const full = [llms, '---', '', '# Artigos completos', '',
    ...POSTS.map((p) => `## ${p.title}\n\n${abs(urlPost(p, true))} · ${p.d?.br || p.date} · ${p.tag}\n\n${texto(p.body.replace(/<\/(p|h2|li|blockquote)>/g, '\n\n').replace(/<li>/g, '- '))
      .replace(/ - /g, '\n- ')}\n`)].join('\n');
  gravar(join(SAIDA_ROBOS, 'robots.txt'), robots);
  gravar(join(SAIDA_ROBOS, 'sitemap.xml'), sitemap);
  gravar(join(SAIDA_ROBOS, 'llms.txt'), llms);
  gravar(join(SAIDA_ROBOS, 'llms-full.txt'), full);
  return urls.length;
}

const n = gerarBlog();
gerarHome();
const nc = gerarPortfolio();
const nf = gerarEnsaio();
const nu = gerarRobos();
console.log(`SEO gerado: ${n} artigos, ${nc} projetos no portfólio, ${nf} perguntas frequentes, ${nu} endereços no sitemap.`);
console.log(`robots.txt, sitemap.xml e llms.txt em ${SAIDA_ROBOS}/` + (SAIDA_ROBOS === 'public' ? '' : '  (rascunho; use --raiz no lançamento)'));
