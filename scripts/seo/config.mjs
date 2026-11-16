// Dados do negócio usados em TODAS as páginas (Google, Bing, ChatGPT, Claude, Perplexity…)
// Mantenha estas informações iguais às do Perfil da Empresa no Google e do Instagram.
// Só entram fatos confirmados: o que não sabemos (endereço completo, horário) fica de fora.

export const SITE = 'https://rroncolato.com.br';

export const NEGOCIO = {
  nome: 'Estúdio Roncolato',
  alternativos: ['Roncolato Studio', 'Rodrigo Roncolato Fotografia'],
  slogan: 'Imagem que gera resultado.',
  descricao:
    'Estúdio de fotografia corporativa, personal branding e branding fotográfico em Goiânia (GO), ' +
    'comandado por Rodrigo Roncolato, designer estratégico e fotógrafo com mais de 20 anos de atuação. ' +
    'Ensaios para empresários, mentores, profissionais e empresas que querem autoridade visual.',
  telefone: '+55 62 98592-8423',
  whatsapp: 'https://wa.me/5562985928423',
  cidade: 'Goiânia',
  estado: 'GO',
  pais: 'BR',
  fundacao: '2010',
  faixaPreco: 'R$ 1.500 – R$ 4.200',
  instagram: 'https://instagram.com/rroncolato',
  logo: '/assets/IMG/roncolato-horizontal.png',
  clientes: ['Coca-Cola', 'Toyota', 'Augusto Cury', 'Bruno Gimenez', 'Raro Investimentos', 'Bonifácil Advocacia'],
  paises: ['Brasil', 'Portugal', 'Irlanda'],
  temas: ['Fotografia corporativa', 'Fotografia executiva', 'Personal branding', 'Branding fotográfico',
          'Identidade visual', 'Retrato profissional', 'Marca pessoal', 'Fotografia para LinkedIn'],
};

export const PESSOA = {
  nome: 'Rodrigo Roncolato',
  cargo: 'Designer estratégico e fotógrafo corporativo',
  foto: '/assets/IMG/home/sobre-rodrigo.webp',
  formacao: 'Publicidade e Propaganda',
};

export const SERVICOS = [
  { nome: 'Ensaio de marca pessoal', url: '/ensaio',
    descricao: 'Ensaio fotográfico para empresários, mentores, profissionais e marcas pessoais. Pacotes a partir de R$ 1.500.' },
  { nome: 'Fotografia corporativa', url: '/',
    descricao: 'Retratos executivos, fotos de equipe, eventos corporativos e banco de imagens para empresas.' },
  { nome: 'Branding fotográfico', url: '/portfolio/',
    descricao: 'Desenvolvimento visual completo da marca, com fotografia estratégica alinhada à identidade.' },
];

// Mesmos valores da página /ensaio
export const PACOTES = [
  { nome: 'Essencial', preco: 1500, itens: ['1 hora de ensaio', '1 muda de roupa', '30 a 50 fotos editadas'] },
  { nome: 'Presença', preco: 2400, itens: ['2 horas de ensaio', '2 a 3 mudas de roupa', '80 a 100 fotos editadas', 'Guia de uso estratégico', '1 rodada de revisão'] },
  { nome: 'Autoridade', preco: 4200, itens: ['4 horas de ensaio', '3 a 4 mudas de roupa', '150+ fotos editadas', 'Guia de uso completo', 'Revisões ilimitadas', 'Fotos para LinkedIn'] },
  { nome: 'Corporativo', preco: null, itens: ['Ensaio de colaboradores', 'Múltiplas mudas', 'Fotos ilimitadas', 'Lote de fotos de perfil', 'Consultoria de marca', 'Projeto personalizado'] },
];

// Páginas: "caminho" = onde o arquivo é servido hoje; "final" = endereço definitivo após o lançamento.
// Enquanto caminho ≠ final, a página leva "noindex" (rascunho não aparece no Google).
export const PAGINAS = {
  home: {
    arquivo: 'public/nova-home/index.html', caminho: '/nova-home/', final: '/',
    titulo: 'Rodrigo Roncolato | Fotógrafo Corporativo em Goiânia',
    descricao: 'Fotografia corporativa, personal branding e branding fotográfico em Goiânia. Mais de 20 anos criando imagens com estratégia para líderes, empresas e marcas pessoais.',
    imagem: '/assets/IMG/og/og-home.jpg',
  },
  portfolio: {
    arquivo: 'public/nova-home/portfolio/index.html', caminho: '/nova-home/portfolio/', final: '/portfolio/',
    titulo: 'Portfólio de Fotografia Corporativa | Rodrigo Roncolato',
    descricao: 'Ensaios executivos, personal branding, fotografia institucional e identidade visual para empresas e marcas pessoais em Goiânia e no Brasil.',
    imagem: '/assets/IMG/og/og-portfolio.jpg',
  },
  blog: {
    modelo: 'scripts/seo/modelos/blog.html', pasta: 'public/nova-home/blog', caminho: '/nova-home/blog/', final: '/blog/',
    titulo: 'Blog sobre Imagem, Fotografia e Marca Pessoal | Roncolato',
    descricao: 'Artigos de Rodrigo Roncolato sobre fotografia corporativa, autoridade visual, personal branding e construção de marca.',
    imagem: '/assets/IMG/og/og-blog.jpg',
  },
  ensaio: {
    arquivo: 'public/ensaio/index.html', caminho: '/ensaio', final: '/ensaio',
    titulo: 'Ensaio Fotográfico Profissional em Goiânia | Estúdio Roncolato',
    descricao: 'Ensaio fotográfico para empresários, mentores e marcas pessoais em Goiânia. Pacotes a partir de R$ 1.500, com 1 a 4 horas de sessão e de 30 a 150+ fotos editadas.',
    imagem: '/assets/IMG/og/og-ensaio.jpg',
  },
};

// Endereços legíveis para os posts antigos (post1, post2…). O endereço antigo continua
// funcionando: /blog#post7 leva para o endereço novo.
export const SLUGS_SEO = {
  post1: 'fotografia-executiva-investimento-subestimado',
  post2: 'erros-identidade-visual-linkedin',
  post3: 'como-planejo-sessao-corporativa',
  post4: 'luz-natural-ou-estudio',
  post5: 'o-que-mudou-na-fotografia-corporativa',
  post6: 'imagem-profissional-nas-maos-de-quem',
  post7: 'feed-bonito-nao-posiciona',
  post8: 'manifesto-novo-posicionamento',
};

// Áreas que não devem aparecer em buscas (propostas, dashboards, catálogos de clientes, admin)
export const PRIVADO = [
  '/admin/', '/api/', '/login', '/dashboard', '/dashboard-projetos.html', '/dash/',
  '/proposta/', '/pages/proposta/', '/social-frame/', '/socialframe',
  '/presenca/versions/', '/pages/presenca/versions/', '/nova-home/',
];

// Robôs de busca e de IA que liberamos explicitamente
export const ROBOS = [
  'Googlebot', 'Google-Extended', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User',
  'Applebot', 'Applebot-Extended', 'DuckDuckBot',
];
