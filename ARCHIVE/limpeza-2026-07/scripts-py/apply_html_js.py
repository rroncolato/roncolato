import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

ok = []

# ── 1. Blog list HTML: grid de cards ─────────────────────────────────────────
old_list = """        <!-- POST LIST -->
        <div class="blog-list">
          <div class="bpost rv" onclick="goPost('post7')">
            <div class="bpost-img"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Feed bonito não posiciona ninguém</div><div class="bpost-meta">07 Mar 2026 · 7 min</div></div>
          </div>

          <div class="bpost rv" onclick="goPost('post6')">
            <div class="bpost-img" id="blog-img-post6"><img src="assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Sua imagem profissional está nas mãos de quem?</div><div class="bpost-meta">07 Mar 2026 · 8 min</div></div>
          </div>

          <div class="bpost rv" onclick="goPost('post1')">
            <div class="bpost-img" id="blog-img-post1"><img src="assets/IMG/site/post1-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Por que a fotografia executiva é o investimento mais subestimado do seu negócio</div><div class="bpost-meta">05 Mar 2026 · 8 min</div></div>
          </div>
          <div class="bpost rv d1" onclick="goPost('post2')">
            <div class="bpost-img"><img src="assets/IMG/site/post2-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">5 erros que destroem sua identidade visual no LinkedIn</div><div class="bpost-meta">08 Jan 2025 · 5 min</div></div>
          </div>
          <div class="bpost rv d2" onclick="goPost('post3')">
            <div class="bpost-img"><img src="assets/IMG/site/post3-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Behind the scenes</div><div class="bpost-title">Como planejo uma sessão corporativa do zero</div><div class="bpost-meta">02 Jan 2025 · 6 min</div></div>
          </div>
          <div class="bpost rv d3" onclick="goPost('post4')">
            <div class="bpost-img"><img src="assets/IMG/site/post4-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Equipamento</div><div class="bpost-title">Luz natural vs. estúdio: quando usar cada uma</div><div class="bpost-meta">20 Dez 2024 · 4 min</div></div>
          </div>
          <div class="bpost rv d4" onclick="goPost('post5')">
            <div class="bpost-img"><img src="assets/IMG/site/post5-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>
            <div><div class="bpost-tag">Mercado</div><div class="bpost-title">O que mudou na fotografia corporativa nos últimos 5 anos</div><div class="bpost-meta">10 Dez 2024 · 7 min</div></div>
          </div>
        </div>"""

new_list = """        <!-- POST LIST -->
        <div class="blog-list">
          <div class="bpost rv" onclick="goPost('post6')">
            <div class="bpost-img"><img src="/assets/IMG/site/post6-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Sua imagem profissional está nas mãos de quem?</div><div class="bpost-meta">07 Mar 2026 · 8 min</div></div>
          </div>
          <div class="bpost rv" onclick="goPost('post1')">
            <div class="bpost-img"><img src="/assets/IMG/site/post1-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Por que a fotografia executiva é o investimento mais subestimado do seu negócio</div><div class="bpost-meta">05 Mar 2026 · 8 min</div></div>
          </div>
          <div class="bpost rv" onclick="goPost('post2')">
            <div class="bpost-img"><img src="/assets/IMG/site/post2-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">5 erros que destroem sua identidade visual no LinkedIn</div><div class="bpost-meta">08 Jan 2025 · 5 min</div></div>
          </div>
          <div class="bpost rv" onclick="goPost('post3')">
            <div class="bpost-img"><img src="/assets/IMG/site/post3-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Behind the Scenes</div><div class="bpost-title">Como planejo uma sessão corporativa do zero</div><div class="bpost-meta">02 Jan 2025 · 6 min</div></div>
          </div>
          <div class="bpost rv" onclick="goPost('post4')">
            <div class="bpost-img"><img src="/assets/IMG/site/post4-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Equipamento</div><div class="bpost-title">Luz natural vs. estúdio: quando usar cada uma</div><div class="bpost-meta">20 Dez 2024 · 4 min</div></div>
          </div>
          <div class="bpost rv" onclick="goPost('post5')">
            <div class="bpost-img"><img src="/assets/IMG/site/post5-capa.jpg" alt=""></div>
            <div class="bpost-info"><div class="bpost-tag">Mercado</div><div class="bpost-title">O que mudou na fotografia corporativa nos últimos 5 anos</div><div class="bpost-meta">10 Dez 2024 · 7 min</div></div>
          </div>
        </div>"""

if old_list in content:
    content = content.replace(old_list, new_list)
    ok.append('blog list HTML')
else:
    ok.append('blog list HTML - JA APLICADO OU NAO ENCONTRADO')

# ── 2. Featured placeholder ───────────────────────────────────────────────────
old_feat = """<div class="blog-featured rv" onclick="goPost('post7')">
          <div class="bf-img" style="background:none;">
            <img src="assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">
            <div class="bf-tag">Destaque</div>
          </div>
          <div class="bf-body">
            <div class="bf-meta">07 Mar 2026 · 7 min de leitura</div>
            <div class="bf-title">Feed bonito não posiciona ninguém</div>
            <div class="bf-exc">Feed bonito chama atenção, mas atenção sem clareza não vira cliente. Entenda como alinhar visual e posicionamento.</div>
            <span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span>
          </div>
        </div>"""
new_feat = '<div class="blog-featured rv" id="blog-featured"></div>'

if old_feat in content:
    content = content.replace(old_feat, new_feat)
    ok.append('featured placeholder')
else:
    ok.append('featured placeholder - JA APLICADO')

# ── 3. Categorias com filtro ──────────────────────────────────────────────────
old_cats = """          <div class="bside-title">Categorias</div>
          <div class="btopic"><span class="btopic-name">Personal Branding</span><span class="btopic-count">8</span></div>
          <div class="btopic"><span class="btopic-name">Fotografia Executiva</span><span class="btopic-count">5</span></div>
          <div class="btopic"><span class="btopic-name">Behind the Scenes</span><span class="btopic-count">4</span></div>
          <div class="btopic"><span class="btopic-name">Equipamento</span><span class="btopic-count">3</span></div>
          <div class="btopic"><span class="btopic-name">Mercado</span><span class="btopic-count">3</span></div>"""
new_cats = """          <div class="bside-title">Categorias</div>
          <div class="btopic on" onclick="filterBlog('all',this)"><span class="btopic-name">Todos os posts</span><span class="btopic-count">6</span></div>
          <div class="btopic" onclick="filterBlog('Personal Branding',this)"><span class="btopic-name">Personal Branding</span><span class="btopic-count">3</span></div>
          <div class="btopic" onclick="filterBlog('Behind the Scenes',this)"><span class="btopic-name">Behind the Scenes</span><span class="btopic-count">1</span></div>
          <div class="btopic" onclick="filterBlog('Equipamento',this)"><span class="btopic-name">Equipamento</span><span class="btopic-count">1</span></div>
          <div class="btopic" onclick="filterBlog('Mercado',this)"><span class="btopic-name">Mercado</span><span class="btopic-count">1</span></div>"""

if old_cats in content:
    content = content.replace(old_cats, new_cats)
    ok.append('categorias filtro')
else:
    ok.append('categorias filtro - JA APLICADO')

# ── 4. Posts recentes com thumb real ─────────────────────────────────────────
SVG = '<svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg>'
thumbs = [
    ("goPost('post6')", 'post6-capa.jpg'),
    ("goPost('post1')", 'post1-capa.jpg'),
    ("goPost('post2')", 'post2-capa.jpg'),
    ("goPost('post3')", 'post3-capa.jpg'),
]
for onclick, img in thumbs:
    old = f'<div class="brecent-img">{SVG}</div>'
    new = f'<div class="brecent-img"><img src="/assets/IMG/site/{img}" alt=""></div>'
    # Substituir só dentro do item correto
    marker = f'onclick="{onclick}"'
    idx = content.find(marker)
    if idx > 0:
        chunk = content[idx:idx+300]
        if SVG in chunk:
            content = content[:idx] + chunk.replace(old, new, 1) + content[idx+300:]
ok.append('recent posts thumbs')

# ── 5. Rodapé do post com "Leia também" ──────────────────────────────────────
old_footer = """        <button class="back-btn" onclick="go('blog')">
          <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
          Ver mais artigos
        </button>
      </div>
    </div>
  </div>
  <footer>"""
new_footer = """        <button class="back-btn" onclick="go('blog')">
          <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
          Ver mais artigos
        </button>
      </div>
      <div style="margin-top:80px;padding-top:64px;border-top:1px solid #1a1a1a">
        <div style="font-size:9px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#F5C518;margin-bottom:32px;display:flex;align-items:center;gap:12px"><span style="width:20px;height:1px;background:#F5C518;display:inline-block"></span>Leia também</div>
        <div id="related-posts" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px"></div>
      </div>
    </div>
  </div>
  <footer>"""

if old_footer in content:
    content = content.replace(old_footer, new_footer)
    ok.append('rodape post')
else:
    ok.append('rodape post - JA APLICADO')

# ── 6. JS: goPost fix + filterBlog + initFeatured (inserir antes de // Mobile menu) ──
marker = '// Mobile menu'
extra_js = r"""// filterBlog: filtra posts por categoria
function filterBlog(cat,el){
  document.querySelectorAll('.btopic').forEach(b=>b.classList.remove('on'));
  if(el)el.classList.add('on');
  document.querySelectorAll('.blog-list .bpost').forEach(function(post){
    var tag=post.querySelector('.bpost-tag');
    post.style.display=(cat==='all'||(tag&&tag.textContent.trim()===cat))?'':'none';
  });
  var feat=document.querySelector('.blog-featured');
  if(feat)feat.style.display=(cat==='all')?'':'none';
}

// initFeatured: preenche o card destaque com o post mais recente
function initFeatured(){
  var keys=Object.keys(posts);
  var lastKey=keys[keys.length-1];
  var p=posts[lastKey];
  if(!p)return;
  var el=document.getElementById('blog-featured');
  if(!el)return;
  var img=p.img
    ? '<img src="'+p.img+'" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">'
    : '<div style="aspect-ratio:16/7;background:#161616"></div>';
  el.innerHTML='<div class="bf-img" style="background:none;position:relative;">'+img+'<div class="bf-tag">Destaque</div></div>'
    +'<div class="bf-body"><div class="bf-meta">'+p.date+'</div>'
    +'<div class="bf-title">'+p.title+'</div>'
    +'<div class="bf-exc" style="font-size:14px;color:#7a7a7a;line-height:1.75;margin-top:8px">Clique para ler o artigo completo.</div>'
    +'<span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span></div>';
  el.onclick=function(){goPost(lastKey);};
}
if(typeof posts!=='undefined')initFeatured();

"""

if 'filterBlog' not in content:
    content = content.replace(marker, extra_js + marker)
    ok.append('JS filterBlog + initFeatured')
else:
    ok.append('JS - JA EXISTIA')

# ── 7. goPost: corrigir imgSrc e adicionar related posts ─────────────────────
old_gopost_img = """  if(p.img){
    const imgSrc=p.img.startsWith('IMG/')||p.img.startsWith('http')?p.img:'data:image/jpeg;base64,'+p.img;
    heroImg.innerHTML='<img src="'+imgSrc+'" alt="'+p.title+'" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">';
    heroImg.style.background='none';
  } else {"""
new_gopost_img = """  if(p.img){
    var imgSrc=p.img.startsWith('/')||p.img.startsWith('http')?p.img:'/assets/IMG/site/'+p.img.split('/').pop();
    heroImg.innerHTML='<img src="'+imgSrc+'" alt="'+p.title+'">';
  } else {"""

if old_gopost_img in content:
    content = content.replace(old_gopost_img, new_gopost_img)
    ok.append('goPost imgSrc fix')

# Adicionar related posts no goPost, antes do go('post')
old_goto = "  go('post');\n}"
new_goto = """  // Related posts
  var relEl=document.getElementById('related-posts');
  if(relEl){
    var related=Object.entries(posts).filter(function(e){return e[0]!==id;}).slice(0,3);
    relEl.innerHTML=related.map(function(e){
      var k=e[0],r=e[1];
      var ri=r.img?(r.img.startsWith('/')||r.img.startsWith('http')?r.img:'/assets/IMG/site/'+r.img.split('/').pop()):'';
      var imgHtml=ri?'<div style="aspect-ratio:16/9;overflow:hidden;position:relative"><img src="'+ri+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"></div>':'<div style="aspect-ratio:16/9;background:#1a1a1a"></div>';
      return '<div onclick="goPost(\''+k+'\')" style="background:#111;cursor:pointer;border:1px solid transparent;transition:border-color .3s;overflow:hidden" onmouseenter="this.style.borderColor=\'#F5C518\'" onmouseleave="this.style.borderColor=\'transparent\'">'+imgHtml+'<div style="padding:16px 20px"><div style="font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:6px">'+r.tag+'</div><div style="font-size:14px;font-weight:700;color:#F0F0EB;line-height:1.35">'+r.title+'</div><div style="font-size:10px;color:#7a7a7a;margin-top:8px">'+r.date+'</div></div></div>';
    }).join('');
  }
  go('post');
  window.scrollTo(0,0);
}"""

if "  go('post');\n}" in content and 'related-posts' not in content:
    content = content.replace(old_goto, new_goto, 1)
    ok.append('goPost related posts')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Resultado:')
for o in ok:
    print(f'  {"OK" if "NAO" not in o and "JA" not in o else "--"} {o}')
