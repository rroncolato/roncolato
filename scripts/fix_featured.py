import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Corrigir imagem do featured (estava usando post6-capa no post7)
content = content.replace(
    '''<div class="blog-featured rv" onclick="goPost('post7')">
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
        </div>''',
    '<div class="blog-featured rv" id="blog-featured"></div>'
)
print('featured placeholder:', 'blog-featured' in content)

# 2. Remover post7 da lista (o primeiro .bpost que chama post7)
old_post7_item = '''          <div class="bpost rv" onclick="goPost('post7')">
            <div class="bpost-img"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Feed bonito não posiciona ninguém</div><div class="bpost-meta">07 Mar 2026 · 7 min</div></div>
          </div>

          <div class="bpost rv" onclick="goPost('post6')">'''.strip()

new_post6_start = '''          <div class="bpost rv" onclick="goPost('post6')">'''

content = content.replace(
    '''          <div class="bpost rv" onclick="goPost('post7')">
            <div class="bpost-img"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>
            <div class="bpost-info"><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Feed bonito não posiciona ninguém</div><div class="bpost-meta">07 Mar 2026 · 7 min</div></div>
          </div>

          <div class="bpost rv" onclick="goPost('post6')">''',
    new_post6_start
)
print('post7 removed from list:', "goPost('post7')" not in content[content.find('blog-list'):content.find('blog-list')+3000])

# 3. Adicionar JS que monta o featured dinamicamente com o post mais recente
# Inserir antes do fechamento do </script>
old_script_end = '// Mobile menu'
new_featured_js = '''// Featured post — sempre o mais recente (última chave do objeto posts)
function initFeatured(){
  const keys=Object.keys(posts);
  const lastKey=keys[keys.length-1];
  const p=posts[lastKey];
  if(!p)return;
  const el=document.getElementById('blog-featured');
  if(!el)return;
  const img=p.img
    ? '<img src="'+p.img+'" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;">'
    : '<div style="aspect-ratio:16/7;background:#161616"></div>';
  el.innerHTML=
    '<div class="bf-img" style="background:none;position:relative;">'+img+'<div class="bf-tag">Destaque</div></div>'
    +'<div class="bf-body">'
    +'<div class="bf-meta">'+p.date+' · leitura</div>'
    +'<div class="bf-title">'+p.title+'</div>'
    +'<div class="bf-exc" style="font-size:14px;color:#7a7a7a;line-height:1.75;margin-top:8px">Clique para ler o artigo completo.</div>'
    +'<span class="bf-lnk">Ler artigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></span>'
    +'</div>';
  el.onclick=()=>goPost(lastKey);
}
initFeatured();

// Mobile menu'''

content = content.replace(old_script_end, new_featured_js)
print('initFeatured JS added:', 'initFeatured' in content)

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('done')
