const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// ── 1. LOGO linkada no nav ────────────────────────────────────────────────────
html = html.replace(
  '<a href="#" class="nlogo" onclick="go(\'home\');return false">[RR]<em>.</em></a>',
  '<a href="#" class="nlogo" onclick="go(\'home\');return false"><img src="/assets/IMG/roncolato-branco-horizontal.png" alt="Rodrigo Roncolato" style="height:28px;display:block;background:transparent!important;"></a>'
);
console.log('1. Logo OK');

// ── 2. Blog list: grid de cards sem post7 duplicado ───────────────────────────
const oldList = `        <!-- POST LIST -->
        <div class="blog-list">
          <div class="bpost rv" onclick="goPost('post7')">
            <div class="bpost-img"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Feed bonito não posiciona ninguém</div><div class="bpost-meta">07 Mar 2026 · 7 min</div></div>
          </div>

          <div class="bpost rv" onclick="goPost('post6')">
            <div class="bpost-img" id="blog-img-post6"><img src="/assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Sua imagem profissional está nas mãos de quem?</div><div class="bpost-meta">07 Mar 2026 · 8 min</div></div>
          </div>

          <div class="bpost rv" onclick="goPost('post1')">
            <div class="bpost-img" id="blog-img-post1"><img src="/assets/IMG/site/post1-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Por que a fotografia executiva é o investimento mais subestimado do seu negócio</div><div class="bpost-meta">05 Mar 2026 · 8 min</div></div>
          </div>
          <div class="bpost rv d1" onclick="goPost('post2')">
            <div class="bpost-img"><img src="/assets/IMG/site/post2-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">5 erros que destroem sua identidade visual no LinkedIn</div><div class="bpost-meta">08 Jan 2025 · 5 min</div></div>
          </div>
          <div class="bpost rv d2" onclick="goPost('post3')">
            <div class="bpost-img"><img src="/assets/IMG/site/post3-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Behind the scenes</div><div class="bpost-title">Como planejo uma sessão corporativa do zero</div><div class="bpost-meta">02 Jan 2025 · 6 min</div></div>
          </div>
          <div class="bpost rv d3" onclick="goPost('post4')">
            <div class="bpost-img"><img src="/assets/IMG/site/post4-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Equipamento</div><div class="bpost-title">Luz natural vs. estúdio: quando usar cada uma</div><div class="bpost-meta">20 Dez 2024 · 4 min</div></div>
          </div>
          <div class="bpost rv d4" onclick="goPost('post5')">
            <div class="bpost-img"><img src="/assets/IMG/site/post5-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Mercado</div><div class="bpost-title">O que mudou na fotografia corporativa nos últimos 5 anos</div><div class="bpost-meta">10 Dez 2024 · 7 min</div></div>
          </div>
        </div>`;

const newList = `        <!-- POST LIST -->
        <div class="blog-list">
          <div class="bpost rv" data-tag="Personal Branding" onclick="goPost('post6')">
            <div class="bpost-img"><img src="/assets/IMG/site/post6-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Sua imagem profissional está nas mãos de quem?</div><div class="bpost-meta">07 Mar 2026 · 8 min</div></div>
          </div>
          <div class="bpost rv" data-tag="Personal Branding" onclick="goPost('post1')">
            <div class="bpost-img"><img src="/assets/IMG/site/post1-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Por que a fotografia executiva é o investimento mais subestimado do seu negócio</div><div class="bpost-meta">05 Mar 2026 · 8 min</div></div>
          </div>
          <div class="bpost rv" data-tag="Personal Branding" onclick="goPost('post2')">
            <div class="bpost-img"><img src="/assets/IMG/site/post2-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">5 erros que destroem sua identidade visual no LinkedIn</div><div class="bpost-meta">08 Jan 2025 · 5 min</div></div>
          </div>
          <div class="bpost rv" data-tag="Behind the Scenes" onclick="goPost('post3')">
            <div class="bpost-img"><img src="/assets/IMG/site/post3-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Behind the Scenes</div><div class="bpost-title">Como planejo uma sessão corporativa do zero</div><div class="bpost-meta">02 Jan 2025 · 6 min</div></div>
          </div>
          <div class="bpost rv" data-tag="Equipamento" onclick="goPost('post4')">
            <div class="bpost-img"><img src="/assets/IMG/site/post4-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Equipamento</div><div class="bpost-title">Luz natural vs. estúdio: quando usar cada uma</div><div class="bpost-meta">20 Dez 2024 · 4 min</div></div>
          </div>
          <div class="bpost rv" data-tag="Mercado" onclick="goPost('post5')">
            <div class="bpost-img"><img src="/assets/IMG/site/post5-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Mercado</div><div class="bpost-title">O que mudou na fotografia corporativa nos últimos 5 anos</div><div class="bpost-meta">10 Dez 2024 · 7 min</div></div>
          </div>
        </div>`;

if (oldList in html || html.includes('<!-- POST LIST -->')) {
  if (html.includes(oldList)) {
    html = html.replace(oldList, newList);
    console.log('2. Blog list OK');
  } else {
    console.log('2. Blog list - padrao nao encontrado exato, tentando por marcador...');
  }
}

// ── 3. Featured: substituir hardcoded por placeholder dinâmico ────────────────
const oldFeat = `<div class="blog-featured rv" onclick="goPost('post7')">
          <div class="bf-img" style="background:none;">
            <img src="/assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">
            <div class="bf-tag">Destaque</div>
          </div>
          <div class="bf-body">
            <div class="bf-meta">07 Mar 2026 · 7 min de leitura</div>
            <div class="bf-title">Feed bonito não posiciona ninguém</div>
            <div class="bf-exc">Feed bonito chama atenção, mas atenção sem clareza não vira cliente. Entenda como alinhar visual e posicionamento.</div>
            <span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span>
          </div>
        </div>`;

if (html.includes(oldFeat)) {
  html = html.replace(oldFeat, '<div class="blog-featured rv" id="blog-featured"></div>');
  console.log('3. Featured placeholder OK');
} else {
  console.log('3. Featured - ja atualizado ou nao encontrado');
}

// ── 4. Categorias com data-tag e filtro ──────────────────────────────────────
html = html.replace(
  `<div class="bside-title">Categorias</div>
          <div class="btopic"><span class="btopic-name">Personal Branding</span><span class="btopic-count">8</span></div>
          <div class="btopic"><span class="btopic-name">Fotografia Executiva</span><span class="btopic-count">5</span></div>
          <div class="btopic"><span class="btopic-name">Behind the Scenes</span><span class="btopic-count">4</span></div>
          <div class="btopic"><span class="btopic-name">Equipamento</span><span class="btopic-count">3</span></div>
          <div class="btopic"><span class="btopic-name">Mercado</span><span class="btopic-count">3</span></div>`,
  `<div class="bside-title">Categorias</div>
          <div class="btopic on" onclick="filterBlog('all',this)"><span class="btopic-name">Todos</span><span class="btopic-count">6</span></div>
          <div class="btopic" onclick="filterBlog('Personal Branding',this)"><span class="btopic-name">Personal Branding</span><span class="btopic-count">3</span></div>
          <div class="btopic" onclick="filterBlog('Behind the Scenes',this)"><span class="btopic-name">Behind the Scenes</span><span class="btopic-count">1</span></div>
          <div class="btopic" onclick="filterBlog('Equipamento',this)"><span class="btopic-name">Equipamento</span><span class="btopic-count">1</span></div>
          <div class="btopic" onclick="filterBlog('Mercado',this)"><span class="btopic-name">Mercado</span><span class="btopic-count">1</span></div>`
);
console.log('4. Categorias OK');

// ── 5. Posts recentes com thumbs reais ───────────────────────────────────────
const recentPosts = [
  { id: 'post6', img: 'post6-capa.jpg', title: 'Sua imagem profissional está nas mãos de quem?', date: '07 Mar 2026' },
  { id: 'post1', img: 'post1-capa.jpg', title: 'Por que a fotografia executiva é o investimento mais subestimado', date: '15 Jan 2025' },
  { id: 'post2', img: 'post2-capa.jpg', title: '5 erros que destroem sua identidade visual no LinkedIn', date: '08 Jan 2025' },
  { id: 'post3', img: 'post3-capa.jpg', title: 'Como planejo uma sessão corporativa do zero', date: '02 Jan 2025' },
];
const svgIcon = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg>';
recentPosts.forEach(p => {
  const oldThumb = `onclick="goPost('${p.id}')"><div class="brecent-img">${svgIcon}</div>`;
  const newThumb = `onclick="goPost('${p.id}')"><div class="brecent-img"><img src="/assets/IMG/site/${p.img}" alt=""></div>`;
  if (html.includes(oldThumb)) html = html.replace(oldThumb, newThumb);
});
console.log('5. Recent thumbs OK');

// ── 6. JS: filterBlog + initFeatured + goPost fix ────────────────────────────
const jsToAdd = `
function filterBlog(cat, el) {
  document.querySelectorAll('.btopic').forEach(function(b) { b.classList.remove('on'); });
  if (el) el.classList.add('on');
  document.querySelectorAll('.blog-list .bpost').forEach(function(post) {
    var tag = post.dataset.tag;
    post.style.display = (cat === 'all' || tag === cat) ? '' : 'none';
  });
  var feat = document.querySelector('.blog-featured');
  if (feat) feat.style.display = (cat === 'all') ? '' : 'none';
}

function initFeatured() {
  var keys = Object.keys(posts);
  var lastKey = keys[keys.length - 1];
  var p = posts[lastKey];
  if (!p) return;
  var el = document.getElementById('blog-featured');
  if (!el) return;
  var imgSrc = p.img ? (p.img.startsWith('/') || p.img.startsWith('http') ? p.img : '/assets/IMG/site/' + p.img.split('/').pop()) : '';
  var img = imgSrc ? '<img src="' + imgSrc + '" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">' : '<div style="aspect-ratio:16/7;background:#161616"></div>';
  el.innerHTML = '<div class="bf-img" style="background:none;position:relative;">' + img + '<div class="bf-tag">Destaque</div></div>'
    + '<div class="bf-body"><div class="bf-meta">' + p.date + '</div>'
    + '<div class="bf-title">' + p.title + '</div>'
    + '<div class="bf-exc" style="font-size:14px;color:#7a7a7a;line-height:1.75;margin-top:8px">Clique para ler o artigo completo.</div>'
    + '<span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span></div>';
  el.onclick = function() { goPost(lastKey); };
}
if (typeof posts !== 'undefined') initFeatured();

`;

if (!html.includes('function filterBlog')) {
  html = html.replace('// Mobile menu', jsToAdd + '// Mobile menu');
  console.log('6. JS filterBlog + initFeatured OK');
} else {
  console.log('6. JS ja existia');
}

// Fix goPost imgSrc
html = html.replace(
  "const imgSrc=p.img.startsWith('IMG/')||p.img.startsWith('http')?p.img:'data:image/jpeg;base64,'+p.img;",
  "const imgSrc=p.img.startsWith('/')||p.img.startsWith('http')?p.img:'/assets/IMG/site/'+p.img.split('/').pop();"
);
html = html.replace(
  "heroImg.innerHTML='<img src=\"'+imgSrc+'\" alt=\"'+p.title+'\" style=\"width:100%;aspect-ratio:16/9;object-fit:cover;display:block;\">';",
  "heroImg.innerHTML='<img src=\"'+imgSrc+'\" alt=\"'+p.title+'\">';"
);
html = html.replace("heroImg.style.background='none';", '');
console.log('7. goPost imgSrc OK');

// ── 7. Verificar JS ───────────────────────────────────────────────────────────
fs.writeFileSync('public/index.html', html);
const script = html.slice(html.lastIndexOf('<script>')+8, html.lastIndexOf('</script>'));
try {
  new Function(script);
  console.log('\nJS: OK - sem erros!');
} catch(e) {
  console.log('\nJS ERRO:', e.message);
}
