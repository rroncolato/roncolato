import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print('Aplicando mudanças...')

# ── 1. globals.css ────────────────────────────────────────────────────────────
content = content.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">',
    '<link rel="stylesheet" href="/assets/css/globals.css">'
)
print('1. globals.css OK')

# ── 2. Hero centralizado ──────────────────────────────────────────────────────
content = content.replace(
    '.hero-overlay-text{\n  position:absolute;\n  bottom:clamp(32px,5vw,72px);\n  left:50%;\n  transform:translateX(-50%);\n  width:100%;\n  max-width:1216px;\n  padding:0 clamp(24px,4vw,48px);\n  z-index:3;\n  background-color:transparent!important;\n  display:flex;flex-direction:column;align-items:flex-end;gap:20px;\n}',
    '.hero-overlay-text{\n  position:absolute;\n  top:50%;\n  left:50%;\n  transform:translate(-50%,-50%);\n  width:100%;\n  max-width:1216px;\n  padding:0 clamp(24px,4vw,48px);\n  z-index:3;\n  background-color:transparent!important;\n  display:flex;flex-direction:column;align-items:flex-end;gap:20px;\n}'
)
print('2. Hero centralizado OK')

# ── 3. Nav maior ──────────────────────────────────────────────────────────────
content = content.replace('padding:0 40px;height:56px;', 'padding:0 52px;height:76px;')
content = content.replace(
    '.nlogo{\n  font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;\n  color:#F0F0EB;text-decoration:none;\n}',
    '.nlogo{\n  font-size:14px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;\n  color:#F0F0EB;text-decoration:none;\n}'
)
content = content.replace('.nmid{display:flex;align-items:center;gap:8px;list-style:none}', '.nmid{display:flex;align-items:center;gap:14px;list-style:none}')
content = content.replace('.nmid li{display:flex;align-items:center;gap:8px}', '.nmid li{display:flex;align-items:center;gap:14px}')
content = content.replace(
    'font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;\n  color:#7a7a7a;text-decoration:none;transition:color .2s;white-space:nowrap;\n}',
    'font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;\n  color:#7a7a7a;text-decoration:none;transition:color .2s;white-space:nowrap;\n  padding:8px 6px;\n}'
)
content = content.replace(
    'font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;\n  color:#0A0A0A;background-color:#F5C518;padding:9px 18px;text-decoration:none;transition:opacity .2s;\n}',
    'font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;\n  color:#0A0A0A;background-color:#F5C518;padding:13px 26px;text-decoration:none;transition:opacity .2s;\n}'
)
content = content.replace('.burger{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:4px}', '.burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}')
content = content.replace('.burger span{width:20px;height:1px;background:#F0F0EB;display:block;transition:transform .3s,opacity .3s}', '.burger span{width:24px;height:1.5px;background:#F0F0EB;display:block;transition:transform .3s,opacity .3s}')
content = content.replace('#nav{padding:0 20px}', '#nav{padding:0 24px;height:68px}')
content = content.replace('display:none;position:fixed;inset:56px 0 0;', 'display:none;position:fixed;inset:76px 0 0;')
content = content.replace('.page{display:none;padding-top:56px;', '.page{display:none;padding-top:76px;')
# botao .by
content = content.replace(
    'font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;\n  color:#0A0A0A;background-color:#F5C518;padding:13px 24px;text-decoration:none;\n  border:none;cursor:pointer;font-family:\'Jost\',sans-serif;\n  transition:transform .2s var(--ease),box-shadow .2s;\n}',
    'font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;\n  color:#0A0A0A;background-color:#F5C518;padding:14px 26px;text-decoration:none;\n  border:none;cursor:pointer;font-family:\'Jost\',sans-serif;\n  transition:transform .2s var(--ease),box-shadow .2s;\n}'
)
print('3. Nav OK')

# ── 4. Blog CSS grid ──────────────────────────────────────────────────────────
old_blog_css = '''.blog-list{display:flex;flex-direction:column;gap:1px;background-color:#1a1a1a}
.bpost{
  background-color:#111;padding:24px;display:grid;grid-template-columns:120px 1fr;gap:20px;align-items:start;
  cursor:pointer;transition:background .2s;border:1px solid transparent;
}
.bpost:hover{background-color:#161616;border-color:#F5C518}
.bpost-img{background-color:#1a1a1a;overflow:hidden;flex-shrink:0}
.bpost-img svg{opacity:.05}
.bpost-tag{font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:6px}
.bpost-title{font-size:15px;font-weight:700;color:#F0F0EB;letter-spacing:-.01em;line-height:1.3;margin-bottom:6px}
.bpost-meta{font-size:10px;color:#404040;letter-spacing:.08em}'''
new_blog_css = '''.blog-list{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:2px}
@media(max-width:640px){.blog-list{grid-template-columns:1fr}}
.bpost{
  background-color:#111;display:flex;flex-direction:column;
  cursor:pointer;transition:background .2s,border-color .2s;border:1px solid transparent;overflow:hidden;
}
.bpost:hover{background-color:#161616;border-color:#F5C518}
.bpost-img{overflow:hidden;flex-shrink:0;aspect-ratio:16/9;background-color:#1a1a1a;position:relative}
.bpost-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}
.bpost:hover .bpost-img img{transform:scale(1.04)}
.bpost-img svg{opacity:.05;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.bpost-info{padding:20px 24px 24px;flex:1}
.bpost-tag{font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:8px}
.bpost-title{font-size:16px;font-weight:700;color:#F0F0EB;letter-spacing:-.01em;line-height:1.3;margin-bottom:8px}
.bpost-meta{font-size:10px;color:#404040;letter-spacing:.08em}'''
content = content.replace(old_blog_css, new_blog_css)
print('4. Blog CSS OK')

# ── 5. Blog post individual: imagem com posicionamento absoluto ───────────────
content = content.replace(
    '.bpost-full-img{background-color:#111;overflow:hidden;margin-bottom:48px;display:flex;align-items:center;justify-content:center}',
    '.bpost-full-img{position:relative;background-color:#111;overflow:hidden;margin-bottom:48px;width:100%;aspect-ratio:16/9}'
)
content = content.replace(
    '.bpost-full-img svg{opacity:.05}',
    '.bpost-full-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}\n.bpost-full-img svg{opacity:.05;display:block;margin:80px auto}'
)
print('5. Post img OK')

# ── 6. Posts recentes com thumb ───────────────────────────────────────────────
content = content.replace(
    '.brecent-img{width:56px;height:56px;background-color:#1a1a1a;flex-shrink:0;display:flex;align-items:center;justify-content:center}',
    '.brecent-img{width:64px;height:64px;background-color:#1a1a1a;flex-shrink:0;overflow:hidden}'
)
content = content.replace(
    '.brecent-img svg{opacity:.05}',
    '.brecent-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}\n.brecent-item:hover .brecent-img img{transform:scale(1.08)}\n.brecent-img svg{opacity:.05}'
)
print('6. Recent posts CSS OK')

# ── 7. Categoria ativa CSS ────────────────────────────────────────────────────
content = content.replace(
    '.btopic:hover{color:#F5C518}',
    '.btopic:hover{color:#F5C518}\n.btopic.on{background-color:#1a1a1a;border-left:2px solid #F5C518;padding-left:8px}'
)
print('7. Category CSS OK')

# ── 8. HTML: blog posts com img fields e bpost-info ──────────────────────────
# Adicionar imgs nos posts JS
repls_js = [
    ("post1:{tag:'Personal Branding',date:'15 Jan 2025',title", "post1:{tag:'Personal Branding',date:'15 Jan 2025',img:'/assets/IMG/site/post1-capa.jpg',title"),
    ("post2:{tag:'Personal Branding',date:'08 Jan 2025',title", "post2:{tag:'Personal Branding',date:'08 Jan 2025',img:'/assets/IMG/site/post2-capa.jpg',title"),
    ("post4:{tag:'Equipamento',date:'20 Dez 2024',title", "post4:{tag:'Equipamento',date:'20 Dez 2024',img:'/assets/IMG/site/post4-capa.jpg',title"),
    ("post5:{tag:'Mercado',date:'10 Dez 2024',title", "post5:{tag:'Mercado',date:'10 Dez 2024',img:'/assets/IMG/site/post5-capa.jpg',title"),
    ("post6:{tag:'Personal Branding',date:'07 Mar 2026',title", "post6:{tag:'Personal Branding',date:'07 Mar 2026',img:'/assets/IMG/site/post6-capa.jpg',title"),
    ("post3:{tag:'Behind the Scenes',date:'02 Jan 2025',title", "post3:{tag:'Behind the Scenes',date:'02 Jan 2025',img:'/assets/IMG/site/post3-capa.jpg',title"),
    ("post7:{tag:'Personal Branding'", "post7:{tag:'Personal Branding',img:'/assets/IMG/site/post7-capa.jpg'"),
]
for old, new in repls_js:
    if old in content:
        content = content.replace(old, new)
print('8. Post img fields OK')

# Fix imgSrc no goPost
content = content.replace(
    "const imgSrc=p.img.startsWith('IMG/')||p.img.startsWith('http')?p.img:'data:image/jpeg;base64,'+p.img;",
    "const imgSrc=p.img;"
)
content = content.replace(
    "heroImg.innerHTML='<img src=\"'+imgSrc+'\" alt=\"'+p.title+'\" style=\"width:100%;aspect-ratio:16/9;object-fit:cover;display:block;\">';",
    "heroImg.innerHTML='<img src=\"'+p.img+'\" alt=\"'+p.title+'\">';"
)
content = content.replace("heroImg.style.background='none';", '')
print('9. goPost img OK')

# ── 9. Blog list HTML: grid com bpost-info ────────────────────────────────────
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
content = content.replace(old_list, new_list)
print('10. Blog list HTML OK')

# ── 10. Featured dinâmico + categorias ───────────────────────────────────────
# Featured placeholder
content = content.replace(
    '<div class="blog-featured rv" onclick="goPost(\'post7\')">\n          <div class="bf-img" style="background:none;">\n            <img src="assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">\n            <div class="bf-tag">Destaque</div>\n          </div>\n          <div class="bf-body">\n            <div class="bf-meta">07 Mar 2026 · 7 min de leitura</div>\n            <div class="bf-title">Feed bonito não posiciona ninguém</div>\n            <div class="bf-exc">Feed bonito chama atenção, mas atenção sem clareza não vira cliente. Entenda como alinhar visual e posicionamento.</div>\n            <span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span>\n          </div>\n        </div>',
    '<div class="blog-featured rv" id="blog-featured"></div>'
)

# Categorias com filtro
content = content.replace(
    '<div class="bside-title">Categorias</div>\n          <div class="btopic"><span class="btopic-name">Personal Branding</span><span class="btopic-count">8</span></div>\n          <div class="btopic"><span class="btopic-name">Fotografia Executiva</span><span class="btopic-count">5</span></div>\n          <div class="btopic"><span class="btopic-name">Behind the Scenes</span><span class="btopic-count">4</span></div>\n          <div class="btopic"><span class="btopic-name">Equipamento</span><span class="btopic-count">3</span></div>\n          <div class="btopic"><span class="btopic-name">Mercado</span><span class="btopic-count">3</span></div>',
    '<div class="bside-title">Categorias</div>\n          <div class="btopic" onclick="filterBlog(\'all\',this)"><span class="btopic-name">Todos os posts</span><span class="btopic-count">6</span></div>\n          <div class="btopic" onclick="filterBlog(\'Personal Branding\',this)"><span class="btopic-name">Personal Branding</span><span class="btopic-count">3</span></div>\n          <div class="btopic" onclick="filterBlog(\'Behind the Scenes\',this)"><span class="btopic-name">Behind the Scenes</span><span class="btopic-count">1</span></div>\n          <div class="btopic" onclick="filterBlog(\'Equipamento\',this)"><span class="btopic-name">Equipamento</span><span class="btopic-count">1</span></div>\n          <div class="btopic" onclick="filterBlog(\'Mercado\',this)"><span class="btopic-name">Mercado</span><span class="btopic-count">1</span></div>'
)

# Posts recentes com thumb
content = content.replace(
    '<div class="brecent-item" onclick="goPost(\'post6\')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">Sua imagem profissional está nas mãos de quem?</div><div class="brecent-date">07 Mar 2026</div></div></div>',
    '<div class="brecent-item" onclick="goPost(\'post6\')"><div class="brecent-img"><img src="/assets/IMG/site/post6-capa.jpg" alt=""></div><div><div class="brecent-title">Sua imagem profissional está nas mãos de quem?</div><div class="brecent-date">07 Mar 2026</div></div></div>'
)
content = content.replace(
    '<div class="brecent-item" onclick="goPost(\'post1\')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">Por que a fotografia executiva é o investimento mais subestimado</div><div class="brecent-date">15 Jan 2025</div></div></div>',
    '<div class="brecent-item" onclick="goPost(\'post1\')"><div class="brecent-img"><img src="/assets/IMG/site/post1-capa.jpg" alt=""></div><div><div class="brecent-title">Por que a fotografia executiva é o investimento mais subestimado</div><div class="brecent-date">15 Jan 2025</div></div></div>'
)
content = content.replace(
    '<div class="brecent-item" onclick="goPost(\'post2\')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">5 erros que destroem sua identidade visual no LinkedIn</div><div class="brecent-date">08 Jan 2025</div></div></div>',
    '<div class="brecent-item" onclick="goPost(\'post2\')"><div class="brecent-img"><img src="/assets/IMG/site/post2-capa.jpg" alt=""></div><div><div class="brecent-title">5 erros que destroem sua identidade visual no LinkedIn</div><div class="brecent-date">08 Jan 2025</div></div></div>'
)
content = content.replace(
    '<div class="brecent-item" onclick="goPost(\'post3\')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">Como planejo uma sessão corporativa do zero</div><div class="brecent-date">02 Jan 2025</div></div></div>',
    '<div class="brecent-item" onclick="goPost(\'post3\')"><div class="brecent-img"><img src="/assets/IMG/site/post3-capa.jpg" alt=""></div><div><div class="brecent-title">Como planejo uma sessão corporativa do zero</div><div class="brecent-date">02 Jan 2025</div></div></div>'
)
print('11. Sidebar OK')

# ── 11. JS: goPost + filterBlog + initFeatured ───────────────────────────────
old_gopost = 'function goPost(id){\n  const p=posts[id];\n  if(!p)return;\n  document.getElementById(\'post-tag\').textContent=p.tag;\n  document.getElementById(\'post-title\').textContent=p.title;\n  document.getElementById(\'post-date\').textContent=p.date;\n  document.getElementById(\'post-body\').innerHTML=p.body;\n  const heroImg=document.getElementById(\'post-hero-img\');\n  if(p.img){\n    const imgSrc=p.img.startsWith(\'IMG/\')||p.img.startsWith(\'http\')?p.img:\'data:image/jpeg;base64,\'+p.img;\n    heroImg.innerHTML=\'<img src="\'+imgSrc+\'" alt="\'+p.title+\'" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">\';'
if old_gopost in content:
    end = content.find("  go('post');\n}", content.find('function goPost')) + len("  go('post');\n}")
    old_full = content[content.find('function goPost'):end]
    new_gopost = '''function goPost(id){
  const p=posts[id];
  if(!p)return;
  document.getElementById('post-tag').textContent=p.tag;
  document.getElementById('post-title').textContent=p.title;
  document.getElementById('post-date').textContent=p.date;
  document.getElementById('post-body').innerHTML=p.body;
  const heroImg=document.getElementById('post-hero-img');
  if(p.img){
    heroImg.innerHTML='<img src="'+p.img+'" alt="'+p.title+'">';
  } else {
    heroImg.innerHTML='<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg>';
  }
  const relEl=document.getElementById('related-posts');
  if(relEl){
    const related=Object.entries(posts).filter(([k])=>k!==id).slice(0,3);
    relEl.innerHTML=related.map(([k,r])=>{
      const img=r.img?'<div style="aspect-ratio:16/9;overflow:hidden;position:relative"><img src="'+r.img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"></div>':'<div style="aspect-ratio:16/9;background:#1a1a1a"></div>';
      return '<div onclick="goPost(\''+k+'\')" style="background:#111;cursor:pointer;border:1px solid transparent;transition:border-color .3s;overflow:hidden" onmouseenter="this.style.borderColor=\'#F5C518\'" onmouseleave="this.style.borderColor=\'transparent\'">'+img+'<div style="padding:16px 20px"><div style="font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:6px">'+r.tag+'</div><div style="font-size:14px;font-weight:700;color:#F0F0EB;line-height:1.35;letter-spacing:-.01em">'+r.title+'</div><div style="font-size:10px;color:#7a7a7a;margin-top:8px">'+r.date+'</div></div></div>';
    }).join('');
  }
  go('post');
  window.scrollTo(0,0);
}

function filterBlog(cat,el){
  document.querySelectorAll('.btopic').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.blog-list .bpost').forEach(post=>{
    const tag=post.querySelector('.bpost-tag');
    post.style.display=(cat==='all'||(tag&&tag.textContent.trim()===cat))?'':'none';
  });
  const feat=document.querySelector('.blog-featured');
  if(feat)feat.style.display=(cat==='all')?'':'none';
}

function initFeatured(){
  const keys=Object.keys(posts);
  const lastKey=keys[keys.length-1];
  const p=posts[lastKey];
  if(!p)return;
  const el=document.getElementById('blog-featured');
  if(!el)return;
  const img=p.img?'<img src="'+p.img+'" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">':'<div style="aspect-ratio:16/7;background:#161616"></div>';
  el.innerHTML='<div class="bf-img" style="background:none;position:relative;">'+img+'<div class="bf-tag">Destaque</div></div><div class="bf-body"><div class="bf-meta">'+p.date+'</div><div class="bf-title">'+p.title+'</div><span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span></div>';
  el.onclick=()=>goPost(lastKey);
}
initFeatured();'''
    content = content.replace(old_full, new_gopost)
    print('12. JS goPost/filter/featured OK')

# ── 12. Rodapé do post com "Leia também" ─────────────────────────────────────
content = content.replace(
    "        <button class=\"back-btn\" onclick=\"go('blog')\">\n          <svg class=\"arr\" viewBox=\"0 0 12 12\" fill=\"none\"><path d=\"M1 6h10M6 1l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"square\"/></svg>\n          Ver mais artigos\n        </button>\n      </div>\n    </div>\n  </div>",
    "        <button class=\"back-btn\" onclick=\"go('blog')\">\n          <svg class=\"arr\" viewBox=\"0 0 12 12\" fill=\"none\"><path d=\"M1 6h10M6 1l5 5-5 5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"square\"/></svg>\n          Ver mais artigos\n        </button>\n      </div>\n      <div style=\"margin-top:80px;padding-top:64px;border-top:1px solid #1a1a1a\">\n        <div style=\"font-size:9px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#F5C518;margin-bottom:32px;display:flex;align-items:center;gap:12px\"><span style=\"width:20px;height:1px;background:#F5C518;display:inline-block\"></span>Leia também</div>\n        <div id=\"related-posts\" style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:2px\"></div>\n      </div>\n    </div>\n  </div>"
)
print('13. Rodapé post OK')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('\nTudo aplicado com sucesso!')
