import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# 1. globals.css
old = '<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">'
new = '<link rel="stylesheet" href="/assets/css/globals.css">'
assert old in content, 'FAIL: google fonts link'
content = content.replace(old, new)
changes.append('globals.css')

# 2. Nav altura 56->76, padding 40->52
old = 'padding:0 40px;height:56px;'
new = 'padding:0 52px;height:76px;'
assert old in content, 'FAIL: nav height'
content = content.replace(old, new)
changes.append('nav height')

# 3. Logo 11->14px
old = '  font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;\n  color:#F0F0EB;text-decoration:none;\n}'
new = '  font-size:14px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;\n  color:#F0F0EB;text-decoration:none;\n}'
if old in content:
    content = content.replace(old, new)
    changes.append('logo size')

# 4. Links nav gap e font
content = content.replace('.nmid{display:flex;align-items:center;gap:8px;list-style:none}', '.nmid{display:flex;align-items:center;gap:14px;list-style:none}')
content = content.replace('.nmid li{display:flex;align-items:center;gap:8px}', '.nmid li{display:flex;align-items:center;gap:14px}')
content = content.replace('font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;\n  color:#7a7a7a;text-decoration:none;transition:color .2s;white-space:nowrap;\n}',
                          'font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;\n  color:#7a7a7a;text-decoration:none;transition:color .2s;white-space:nowrap;\n  padding:8px 6px;\n}')
changes.append('nav links')

# 5. CTA nav padding
content = content.replace('color:#0A0A0A;background-color:#F5C518;padding:9px 18px;text-decoration:none;transition:opacity .2s;',
                          'color:#0A0A0A;background-color:#F5C518;padding:13px 26px;text-decoration:none;transition:opacity .2s;')
changes.append('nav cta')

# 6. Burger maior
content = content.replace('.burger{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:4px}',
                          '.burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}')
content = content.replace('.burger span{width:20px;height:1px;background:#F0F0EB;display:block;transition:transform .3s,opacity .3s}',
                          '.burger span{width:24px;height:1.5px;background:#F0F0EB;display:block;transition:transform .3s,opacity .3s}')
changes.append('burger')

# 7. Mobile nav e mmenu
content = content.replace('#nav{padding:0 20px}', '#nav{padding:0 24px;height:68px}')
content = content.replace('display:none;position:fixed;inset:56px 0 0;', 'display:none;position:fixed;inset:76px 0 0;')
changes.append('mobile nav')

# 8. Page padding-top
content = content.replace('.page{display:none;padding-top:56px;', '.page{display:none;padding-top:76px;')
changes.append('page padding')

# 9. Botao .by maior
content = content.replace('color:#0A0A0A;background-color:#F5C518;padding:13px 24px;text-decoration:none;\n  border:none;cursor:pointer;',
                          'color:#0A0A0A;background-color:#F5C518;padding:14px 26px;text-decoration:none;\n  border:none;cursor:pointer;')
changes.append('btn .by')

# 10. Hero centralizado
content = content.replace(
    '  bottom:clamp(32px,5vw,72px);\n  left:50%;\n  transform:translateX(-50%);',
    '  top:50%;\n  left:50%;\n  transform:translate(-50%,-50%);'
)
changes.append('hero center')

# 11. Blog: lista -> grid 2 colunas (CSS apenas)
old_blog = '.blog-list{display:flex;flex-direction:column;gap:1px;background-color:#1a1a1a}\n.bpost{\n  background-color:#111;padding:24px;display:grid;grid-template-columns:120px 1fr;gap:20px;align-items:start;\n  cursor:pointer;transition:background .2s;border:1px solid transparent;\n}\n.bpost:hover{background-color:#161616;border-color:#F5C518}\n.bpost-img{background-color:#1a1a1a;overflow:hidden;flex-shrink:0}\n.bpost-img svg{opacity:.05}\n.bpost-tag{font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:6px}\n.bpost-title{font-size:15px;font-weight:700;color:#F0F0EB;letter-spacing:-.01em;line-height:1.3;margin-bottom:6px}\n.bpost-meta{font-size:10px;color:#404040;letter-spacing:.08em}'
new_blog = '.blog-list{display:grid;grid-template-columns:1fr 1fr;gap:2px}\n@media(max-width:640px){.blog-list{grid-template-columns:1fr}}\n.bpost{\n  background-color:#111;display:flex;flex-direction:column;\n  cursor:pointer;transition:background .2s,border-color .2s;border:1px solid transparent;overflow:hidden;\n}\n.bpost:hover{background-color:#161616;border-color:#F5C518}\n.bpost-img{overflow:hidden;flex-shrink:0;aspect-ratio:16/9;background-color:#1a1a1a;position:relative}\n.bpost-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}\n.bpost:hover .bpost-img img{transform:scale(1.04)}\n.bpost-img svg{opacity:.05;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}\n.bpost-info{padding:20px 24px 24px;flex:1}\n.bpost-tag{font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-bottom:8px}\n.bpost-title{font-size:16px;font-weight:700;color:#F0F0EB;letter-spacing:-.01em;line-height:1.3;margin-bottom:8px}\n.bpost-meta{font-size:10px;color:#404040;letter-spacing:.08em}'
if old_blog in content:
    content = content.replace(old_blog, new_blog)
    changes.append('blog grid CSS')

# 12. Posts recentes thumb CSS
content = content.replace(
    '.brecent-img{width:56px;height:56px;background-color:#1a1a1a;flex-shrink:0;display:flex;align-items:center;justify-content:center}',
    '.brecent-img{width:64px;height:64px;background-color:#1a1a1a;flex-shrink:0;overflow:hidden}'
)
content = content.replace(
    '.brecent-img svg{opacity:.05}',
    '.brecent-img img{width:100%;height:100%;object-fit:cover;display:block}\n.brecent-img svg{opacity:.05}'
)
changes.append('recent thumb CSS')

# 13. Categoria ativa
content = content.replace('.btopic:hover{color:#F5C518}',
                          '.btopic:hover{color:#F5C518}\n.btopic.on{background-color:#1a1a1a;border-left:2px solid #F5C518;padding-left:8px}')
changes.append('category active CSS')

# 14. Post individual imagem
content = content.replace(
    '.bpost-full-img{background-color:#111;overflow:hidden;margin-bottom:48px;display:flex;align-items:center;justify-content:center}',
    '.bpost-full-img{position:relative;background-color:#111;overflow:hidden;margin-bottom:48px;width:100%;aspect-ratio:16/9}'
)
content = content.replace(
    '.bpost-full-img svg{opacity:.05}',
    '.bpost-full-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}\n.bpost-full-img svg{opacity:.05;display:block;margin:80px auto}'
)
changes.append('post img CSS')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Aplicado com sucesso:')
for c in changes:
    print(f'  ✓ {c}')
print(f'\nTotal: {len(changes)} mudancas')
