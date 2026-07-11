import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. Novo goPost com related posts ─────────────────────────────────────────
old_fn = content[content.find('function goPost(id){'):content.find('// Mobile menu')]

new_fn = r"""function goPost(id){
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
  // Related posts: 3 mais recentes excluindo atual
  const related=Object.entries(posts).filter(([k])=>k!==id).slice(0,3);
  const relEl=document.getElementById('related-posts');
  if(relEl){
    relEl.innerHTML=related.map(([k,r])=>{
      const img=r.img
        ? '<div style="aspect-ratio:16/9;overflow:hidden;position:relative"><img src="'+r.img+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"></div>'
        : '<div style="aspect-ratio:16/9;background:#1a1a1a"></div>';
      return '<div onclick="goPost(\''+k+'\')" style="background:#111;cursor:pointer;border:1px solid transparent;transition:border-color .3s;overflow:hidden" onmouseenter="this.style.borderColor=\'#F5C518\'" onmouseleave="this.style.borderColor=\'transparent\'">'
        +img
        +'<div style="padding:16px 20px">'
        +'<div style="font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:6px">'+r.tag+'</div>'
        +'<div style="font-size:14px;font-weight:700;color:#F0F0EB;line-height:1.35;letter-spacing:-.01em">'+r.title+'</div>'
        +'<div style="font-size:10px;color:#7a7a7a;margin-top:8px">'+r.date+'</div>'
        +'</div></div>';
    }).join('');
  }
  go('post');
  window.scrollTo(0,0);
}

function filterBlog(cat, el){
  document.querySelectorAll('.btopic').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.blog-list .bpost').forEach(post=>{
    const tag=post.querySelector('.bpost-tag');
    post.style.display=(cat==='all'||(tag&&tag.textContent.trim()===cat))?'':'none';
  });
  const feat=document.querySelector('.blog-featured');
  if(feat) feat.style.display=(cat==='all')?'':'none';
}

"""

content = content.replace(old_fn, new_fn)
print('goPost replaced:', 'function goPost' in new_fn)

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('done')
