const SITE = 'https://rroncolato.com.br';

const posts = {
  'fotografia-executiva': {
    id: 'post1',
    title: 'Por que a fotografia executiva é o investimento mais subestimado do seu negócio',
    desc: 'Em um mundo onde a atenção dura menos de três segundos, sua foto de perfil pode ser a diferença entre uma oportunidade aproveitada e uma perdida.',
    img: '/assets/IMG/site/post1-capa.jpg'
  },
  'erros-identidade-visual-linkedin': {
    id: 'post2',
    title: '5 erros que destroem sua identidade visual no LinkedIn',
    desc: 'O LinkedIn se tornou a principal vitrine profissional do mundo. Mas a maioria das pessoas ainda comete erros básicos que sabotam sua credibilidade.',
    img: '/assets/IMG/site/post2-capa.jpg'
  },
  'como-planejo-sessao-corporativa': {
    id: 'post3',
    title: 'Como planejo uma sessão corporativa do zero',
    desc: 'Toda grande sessão começa muito antes da câmera. O planejamento é o que separa uma entrega mediana de um resultado que transforma.',
    img: '/assets/IMG/site/post3-capa.jpg'
  },
  'luz-natural-vs-estudio': {
    id: 'post4',
    title: 'Luz natural vs. estúdio: quando usar cada uma',
    desc: 'A resposta honesta é: depende completamente do que você quer comunicar. Entenda como escolher a iluminação certa para cada projeto.',
    img: '/assets/IMG/site/post4-capa.jpg'
  },
  'fotografia-corporativa-ultimos-5-anos': {
    id: 'post5',
    title: 'O que mudou na fotografia corporativa nos últimos 5 anos',
    desc: 'A fotografia corporativa de 2019 e a de 2024 são quase dois produtos diferentes. Veja como o mercado evoluiu.',
    img: '/assets/IMG/site/post5-capa.jpg'
  },
  'imagem-profissional-nas-maos-de-quem': {
    id: 'post6',
    title: 'Sua imagem profissional está nas mãos de quem?',
    desc: 'Em menos de 3 segundos, você já formou uma opinião sobre alguém. Saiba o que avaliar antes de contratar um fotógrafo corporativo.',
    img: '/assets/IMG/site/post6-capa.jpg'
  },
  'feed-bonito-nao-posiciona-ninguem': {
    id: 'post7',
    title: 'Feed bonito não posiciona ninguém',
    desc: 'Feed bonito chama atenção, mas atenção sem clareza não vira cliente. Entenda como alinhar visual e posicionamento.',
    img: '/assets/IMG/site/post7-capa.jpg'
  },
  'sua-marca-e-um-camaleao': {
    id: 'post8',
    title: 'Sua Marca é um Camaleão?',
    desc: 'Mudar o discurso para agradar todo mundo pode parecer inteligente. No longo prazo, destrói sua autoridade e clareza de posicionamento.',
    img: '/assets/IMG/site/img_camaleao.webp'
  }
};

export default function handler(req, res) {
  const { slug } = req.query;
  const post = posts[slug];

  if (!post) {
    res.redirect(302, SITE);
    return;
  }

  const ua = req.headers['user-agent'] || '';
  const isBot = /bot|crawler|spider|facebook|whatsapp|telegram|twitter|linkedin|slack|preview|facebot|meta-externalagent/i.test(ua);

  if (!isBot) {
    res.redirect(302, `${SITE}/?p=${post.id}`);
    return;
  }

  const imgUrl = `${SITE}/${post.img}`;
  const postUrl = `${SITE}/blog/${slug}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${post.title} — Rodrigo Roncolato</title>
<meta name="description" content="${post.desc}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Rodrigo Roncolato">
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.desc}">
<meta property="og:image" content="${imgUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${postUrl}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${post.title}">
<meta name="twitter:description" content="${post.desc}">
<meta name="twitter:image" content="${imgUrl}">
<meta http-equiv="refresh" content="0;url=${SITE}/?p=${post.id}">
</head>
<body></body>
</html>`);
}
