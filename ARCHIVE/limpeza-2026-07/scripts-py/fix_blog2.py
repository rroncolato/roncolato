import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ── Rodapé do post: adicionar secção related posts ────────────────────────────
old_footer = '''      <div style="margin-top:48px;padding-top:40px;border-top:1px solid #1a1a1a;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
        <div>
          <p style="font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#404040;margin-bottom:8px">Pronto para transformar sua imagem?</p>
          <a href="#" class="by" onclick="go('contato');return false">Fale com Rodrigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></a>
        </div>
        <button class="back-btn" onclick="go('blog')">
          <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
          Ver mais artigos
        </button>
      </div>
    </div>
  </div>'''

new_footer = '''      <div style="margin-top:48px;padding-top:40px;border-top:1px solid #1a1a1a;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
        <div>
          <p style="font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#404040;margin-bottom:8px">Pronto para transformar sua imagem?</p>
          <a href="#" class="by" onclick="go('contato');return false">Fale com Rodrigo <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></a>
        </div>
        <button class="back-btn" onclick="go('blog')">
          <svg class="arr" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
          Ver mais artigos
        </button>
      </div>
      <!-- LEIA TAMBÉM -->
      <div style="margin-top:80px;padding-top:64px;border-top:1px solid #1a1a1a">
        <div style="font-size:9px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#F5C518;margin-bottom:32px;display:flex;align-items:center;gap:12px">
          <span style="width:20px;height:1px;background:#F5C518;display:inline-block"></span>Leia também
        </div>
        <div id="related-posts" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px"></div>
      </div>
    </div>
  </div>'''

if old_footer in content:
    content = content.replace(old_footer, new_footer)
    print('footer: OK')
else:
    print('footer: NOT FOUND - trying partial match')
    # Try to find the closing section
    idx = content.find("Ver mais artigos\n        </button>\n      </div>\n    </div>\n  </div>")
    print('partial idx:', idx)

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('done')
