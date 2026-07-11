const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Blog list com grid e data-tag
const listStart = html.indexOf('<!-- POST LIST -->');
const listEnd = html.indexOf('</div>\n        </div>\n        </div>', listStart) + '        </div>\n        </div>'.length + 8;
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
        </div>
        </div>`;

// Find exact end of blog list section
const blogListDivStart = html.indexOf('<div class="blog-list">', listStart);
// Count divs to find end
let depth = 0, i = blogListDivStart;
while (i < html.length) {
  if (html.slice(i, i+4) === '<div') depth++;
  else if (html.slice(i, i+6) === '</div>') { depth--; if (depth === 0) { i += 6; break; } }
  i++;
}
html = html.slice(0, listStart) + newList + html.slice(i);
console.log('1. Blog list OK');

// 2. Featured: substituir bloco hardcoded por placeholder
const featIdx = html.indexOf('class="blog-featured rv" onclick="goPost');
if (featIdx > 0) {
  const featDivStart = html.lastIndexOf('<div', featIdx);
  let d = 0, j = featDivStart;
  while (j < html.length) {
    if (html.slice(j, j+4) === '<div') d++;
    else if (html.slice(j, j+6) === '</div>') { d--; if (d === 0) { j += 6; break; } }
    j++;
  }
  html = html.slice(0, featDivStart) + '<div class="blog-featured rv" id="blog-featured"></div>' + html.slice(j);
  console.log('2. Featured placeholder OK');
} else {
  console.log('2. Featured - nao encontrado (pode ja estar como placeholder)');
}

// 3. Categorias com filtro
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
console.log('3. Categorias OK');

// 4. Posts recentes com thumb
const svgThumb = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg>';
[['post6','post6-capa.jpg'],['post1','post1-capa.jpg'],['post2','post2-capa.jpg'],['post3','post3-capa.jpg']].forEach(([id,img]) => {
  const marker = `onclick="goPost('${id}')"><div class="brecent-img">${svgThumb}</div>`;
  const replacement = `onclick="goPost('${id}')"><div class="brecent-img"><img src="/assets/IMG/site/${img}" alt=""></div>`;
  html = html.replace(marker, replacement);
});
console.log('4. Recent thumbs OK');

// 5. JS filterBlog + initFeatured
if (!html.includes('function filterBlog')) {
  const jsBlock = `
function filterBlog(cat, el) {
  document.querySelectorAll('.btopic').forEach(function(b) { b.classList.remove('on'); });
  if (el) el.classList.add('on');
  document.querySelectorAll('.blog-list .bpost').forEach(function(post) {
    post.style.display = (cat === 'all' || post.dataset.tag === cat) ? '' : 'none';
  });
}
function initFeatured() {
  var keys = Object.keys(posts);
  var id = keys[keys.length - 1];
  var p = posts[id];
  var el = document.getElementById('blog-featured');
  if (!p || !el) return;
  var src = p.img ? (p.img.startsWith('/') ? p.img : '/assets/IMG/site/' + p.img.split('/').pop()) : '';
  var imgHtml = src ? '<img src="' + src + '" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">' : '<div style="aspect-ratio:16/7;background:#161616"></div>';
  el.innerHTML = '<div class="bf-img" style="position:relative;background:none;">' + imgHtml + '<div class="bf-tag">Destaque</div></div><div class="bf-body"><div class="bf-meta">' + p.date + '</div><div class="bf-title">' + p.title + '</div><span class="bf-lnk" style="display:inline-flex;align-items:center;gap:8px;margin-top:20px;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#F5C518;cursor:pointer;">Ler artigo</span></div>';
  el.onclick = function() { goPost(id); };
}
if (typeof posts !== 'undefined') initFeatured();
`;
  html = html.replace('// Mobile menu', jsBlock + '\n// Mobile menu');
  console.log('5. JS OK');
}

// 6. goPost imgSrc fix
html = html.replace(
  "const imgSrc=p.img.startsWith('IMG/')||p.img.startsWith('http')?p.img:'data:image/jpeg;base64,'+p.img;",
  "const imgSrc=p.img.startsWith('/')||p.img.startsWith('http')?p.img:'/assets/IMG/site/'+p.img.split('/').pop();"
);
// Remove inline style from goPost img injection
const oldInject = `heroImg.innerHTML='<img src="'+imgSrc+'" alt="'+p.title+'" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">';`;
const newInject = `heroImg.innerHTML='<img src="'+imgSrc+'" alt="'+p.title+'">';`;
html = html.replace(oldInject, newInject);
html = html.replace("heroImg.style.background='none';", '');
console.log('6. goPost OK');

fs.writeFileSync('public/index.html', html);

// Verify JS
const script = html.slice(html.lastIndexOf('<script>')+8, html.lastIndexOf('</script>'));
try { new Function(script); console.log('\nJS: OK - sem erros!'); }
catch(e) { console.log('\nJS ERRO:', e.message); }

// Check images
const broken = [];
const imgMatches = html.matchAll(/src="([^"]+\.(jpg|png|webp))"/g);
for (const m of imgMatches) {
  const src = m[1];
  if (src.startsWith('data:') || src.startsWith('http')) continue;
  const path = 'public/' + src.replace(/^\//, '');
  if (!fs.existsSync(path)) broken.push(src);
}
console.log(broken.length ? 'Imagens quebradas: ' + broken.join(', ') : 'Todas as imagens OK!');
