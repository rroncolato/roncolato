import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Linhas 902-947 (index 901-946) = featured + blog list
# Substituir por versão correta

new_block = """        <div class="blog-featured rv" id="blog-featured"></div>

        <!-- POST LIST -->
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
        </div>
        </div>
"""

# Substituir linhas 902 a 948 (index 901 a 947)
new_lines = lines[:901] + [new_block] + lines[948:]

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Verificar
with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    c = f.read()

print('featured placeholder:', 'id="blog-featured"' in c)
print('bpost-info HTML:', '<div class="bpost-info">' in c)
print('post7 duplicado na lista:', c.count("onclick=\"goPost('post7')\""))

# Adicionar initFeatured se nao existir
if 'initFeatured' not in c:
    c = c.replace('// Mobile menu', """// initFeatured: card destaque dinamico
function initFeatured(){
  var keys=Object.keys(posts);
  var lastKey=keys[keys.length-1];
  var p=posts[lastKey];
  if(!p)return;
  var el=document.getElementById('blog-featured');
  if(!el)return;
  var imgSrc=p.img?(p.img.startsWith('/')||p.img.startsWith('http')?p.img:'/assets/IMG/site/'+p.img.split('/').pop()):'';
  var img=imgSrc?'<img src="'+imgSrc+'" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">':'<div style="aspect-ratio:16/7;background:#161616"></div>';
  el.innerHTML='<div class="bf-img" style="background:none;position:relative;">'+img+'<div class="bf-tag">Destaque</div></div><div class="bf-body"><div class="bf-meta">'+p.date+'</div><div class="bf-title">'+p.title+'</div><div class="bf-exc" style="font-size:14px;color:#7a7a7a;line-height:1.75;margin-top:8px">Clique para ler.</div><span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span></div>';
  el.onclick=function(){goPost(lastKey);};
}
if(typeof posts!=='undefined')initFeatured();

// Mobile menu""")
    with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('initFeatured: adicionado')
else:
    print('initFeatured: ja existia')

print('DONE')
