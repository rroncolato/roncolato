import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. CSS: portfolio grid maior e mais impactante ────────────────────────────
old_pgrid_css = '''.pgrid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  grid-auto-rows:240px;
  gap:2px;margin-bottom:64px;
  background-color:#1a1a1a;
}
@media(max-width:900px){
  .pgrid{grid-template-columns:1fr 1fr;grid-auto-rows:220px}
  .pitem{grid-column:unset!important;grid-row:unset!important}
}
@media(max-width:480px){
  .pgrid{grid-template-columns:1fr;grid-auto-rows:260px}
}
.pitem{background-color:#161616;position:relative;overflow:hidden;cursor:pointer}
.pitem:nth-child(1){grid-column:1/8;grid-row:1/3}
.pitem:nth-child(2){grid-column:8/13;grid-row:1/2}
.pitem:nth-child(3){grid-column:8/11;grid-row:2/3}
.pitem:nth-child(4){grid-column:11/13;grid-row:2/3}
.pitem:nth-child(5){grid-column:1/5;grid-row:3/5}
.pitem:nth-child(6){grid-column:5/9;grid-row:3/4}
.pitem:nth-child(7){grid-column:9/13;grid-row:3/5}
.pitem:nth-child(8){grid-column:5/9;grid-row:4/5}

.pph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px}
.pph svg{opacity:.05}
.pph span{font-size:9px;letter-spacing:.18em;color:rgba(240,240,235,.15);text-transform:uppercase}
.pitem:nth-child(1) .pph{background-color:#181818}
.pitem:nth-child(2) .pph{background-color:#141414}
.pitem:nth-child(3) .pph{background-color:#1c1c1c}
.pitem:nth-child(4) .pph{background-color:#131313}
.pitem:nth-child(5) .pph{background-color:#1a1a1a}
.pitem:nth-child(6) .pph{background-color:#151515}
.pitem:nth-child(7) .pph{background-color:#121212}
.pitem:nth-child(8) .pph{background-color:#191919}

.pov{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.85) 0%,transparent 60%);
  opacity:0;transition:opacity .35s var(--ease);
  display:flex;align-items:flex-end;padding:24px;
}
.pitem:hover .pov{opacity:1}
.ptitle{font-size:13px;font-weight:700;text-transform:uppercase;color:#F0F0EB;letter-spacing:.06em}
.pcat{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-top:4px}'''

new_pgrid_css = '''.pgrid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  grid-auto-rows:280px;
  gap:3px;margin-bottom:64px;
  background-color:#0A0A0A;
}
@media(max-width:900px){
  .pgrid{grid-template-columns:1fr 1fr;grid-auto-rows:260px}
  .pitem{grid-column:unset!important;grid-row:unset!important}
}
@media(max-width:480px){
  .pgrid{grid-template-columns:1fr;grid-auto-rows:300px}
}
.pitem{
  background-color:#111;position:relative;overflow:hidden;cursor:pointer;
  transition:transform .4s var(--ease);
}
.pitem:hover{transform:scale(1.01);z-index:2}
.pitem:nth-child(1){grid-column:1/8;grid-row:1/3}
.pitem:nth-child(2){grid-column:8/13;grid-row:1/2}
.pitem:nth-child(3){grid-column:8/11;grid-row:2/3}
.pitem:nth-child(4){grid-column:11/13;grid-row:2/3}
.pitem:nth-child(5){grid-column:1/5;grid-row:3/5}
.pitem:nth-child(6){grid-column:5/9;grid-row:3/4}
.pitem:nth-child(7){grid-column:9/13;grid-row:3/5}
.pitem:nth-child(8){grid-column:5/9;grid-row:4/5}

.pph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px}
.pph img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s var(--ease)}
.pitem:hover .pph img{transform:scale(1.06)}
.pph svg{opacity:.05}
.pph span{font-size:9px;letter-spacing:.18em;color:rgba(240,240,235,.15);text-transform:uppercase}

.pov{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.2) 50%,transparent 100%);
  opacity:0;transition:opacity .4s var(--ease);
  display:flex;align-items:flex-end;padding:28px;
}
.pitem:hover .pov{opacity:1}
.pov-inner{display:flex;align-items:flex-end;justify-content:space-between;width:100%}
.ptitle{font-size:15px;font-weight:800;text-transform:uppercase;color:#F0F0EB;letter-spacing:.04em;line-height:1.2}
.pcat{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5C518;margin-top:6px}
.pov-icon{width:40px;height:40px;border:1px solid rgba(245,197,24,.6);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .3s}
.pitem:hover .pov-icon{background:#F5C518}
.pov-icon svg{color:#F5C518;transition:color .3s}
.pitem:hover .pov-icon svg{color:#0A0A0A}'''

content = content.replace(old_pgrid_css, new_pgrid_css)
print('pgrid CSS:', 'OK' if old_pgrid_css not in content else 'FAIL')

# ── 2. CSS: lightbox centralizado (substitui modal lateral) ───────────────────
old_modal_css = '''.modal-bg{
  position:fixed;inset:0;z-index:600;
  background:rgba(0,0,0,.85);backdrop-filter:blur(12px);
  opacity:0;pointer-events:none;transition:opacity .4s var(--ease);
}
.modal-bg.open{opacity:1;pointer-events:all}

.modal{
  position:fixed;top:0;right:0;bottom:0;z-index:700;
  width:min(680px,100vw);
  background-color:#111;border-left:1px solid #1a1a1a;
  overflow-y:auto;
  transform:translateX(100%);transition:transform .5s var(--ease2);
  display:flex;flex-direction:column;
}
.modal.open{transform:translateX(0)}

.modal-hdr{
  position:sticky;top:0;z-index:10;
  background-color:#111;border-bottom:1px solid #1a1a1a;
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 32px;
}
@media(max-width:480px){.modal-hdr{padding:14px 20px}}
.modal-close{
  width:36px;height:36px;background:none;border:1px solid #2a2a2a;
  color:#F0F0EB;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:border-color .2s,color .2s;font-family:'Jost',sans-serif;line-height:1;
}
.modal-close:hover{border-color:#F5C518;color:#F5C518}
.modal-tag{font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#F5C518}

.modal-body{padding:32px;flex:1}
@media(max-width:480px){.modal-body{padding:20px}}

.modal-img{
  background-color:#161616;aspect-ratio:16/9;
  display:flex;align-items:center;justify-content:center;margin-bottom:28px;position:relative;overflow:hidden;
}
.modal-img svg{opacity:.06}

.modal-title{font-size:clamp(22px,4vw,36px);font-weight:900;letter-spacing:-.03em;color:#F0F0EB;margin-bottom:8px;line-height:1.1}
.modal-year{font-size:10px;font-weight:600;letter-spacing:.18em;color:#404040;margin-bottom:24px}
.modal-desc{font-size:14px;color:#7a7a7a;line-height:1.85;margin-bottom:28px}
.modal-desc strong{color:#F0F0EB;font-weight:600}

.modal-meta{display:grid;grid-template-columns:1fr 1fr;gap:1px;background-color:#1a1a1a;margin-bottom:28px}
.modal-meta-item{background-color:#111;padding:16px}
.modal-meta-lbl{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#404040;margin-bottom:4px}
.modal-meta-val{font-size:13px;font-weight:600;color:#F0F0EB}

.modal-extra-imgs{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:28px}
.modal-extra-img{background-color:#161616;padding-top:56.25%;position:relative;overflow:hidden}
.modal-extra-img svg{opacity:.05}

.modal-footer{padding:24px 32px;border-top:1px solid #1a1a1a;display:flex;gap:12px;flex-wrap:wrap}
@media(max-width:480px){.modal-footer{padding:20px}}'''

new_modal_css = '''.modal-bg{
  position:fixed;inset:0;z-index:600;
  background:rgba(0,0,0,.92);backdrop-filter:blur(16px);
  opacity:0;pointer-events:none;transition:opacity .35s var(--ease);
  display:flex;align-items:center;justify-content:center;padding:24px;
}
.modal-bg.open{opacity:1;pointer-events:all}

.modal{
  position:relative;z-index:700;
  width:min(860px,100%);max-height:90vh;
  background-color:#111;border:1px solid #1a1a1a;
  overflow-y:auto;overflow-x:hidden;
  display:flex;flex-direction:column;
  transform:scale(.94) translateY(16px);
  transition:transform .4s var(--ease2),opacity .4s var(--ease);
  opacity:0;
  scrollbar-width:thin;scrollbar-color:#2a2a2a #111;
}
.modal-bg.open .modal{transform:scale(1) translateY(0);opacity:1}

.modal-hdr{
  position:sticky;top:0;z-index:10;
  background-color:#111;border-bottom:1px solid #1a1a1a;
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 32px;
}
@media(max-width:480px){.modal-hdr{padding:14px 20px}}
.modal-close{
  width:40px;height:40px;background:none;border:1px solid #2a2a2a;
  color:#F0F0EB;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:border-color .2s,color .2s,background .2s;font-family:'Jost',sans-serif;line-height:1;
  flex-shrink:0;
}
.modal-close:hover{border-color:#F5C518;color:#0A0A0A;background:#F5C518}
.modal-tag{font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#F5C518}

.modal-body{padding:40px;flex:1}
@media(max-width:600px){.modal-body{padding:24px}}

.modal-img{
  width:100%;aspect-ratio:16/9;
  position:relative;overflow:hidden;
  margin-bottom:36px;background-color:#161616;
}
.modal-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.modal-img svg{opacity:.06}

.modal-title{font-size:clamp(24px,4vw,42px);font-weight:900;letter-spacing:-.03em;color:#F0F0EB;margin-bottom:8px;line-height:1.05}
.modal-year{font-size:10px;font-weight:600;letter-spacing:.18em;color:#404040;margin-bottom:24px;text-transform:uppercase}
.modal-desc{font-size:15px;color:#7a7a7a;line-height:1.9;margin-bottom:32px}
.modal-desc strong{color:#F0F0EB;font-weight:600}

.modal-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background-color:#1a1a1a;margin-bottom:32px}
@media(max-width:600px){.modal-meta{grid-template-columns:1fr 1fr}}
.modal-meta-item{background-color:#111;padding:16px 20px}
.modal-meta-lbl{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#404040;margin-bottom:6px}
.modal-meta-val{font-size:13px;font-weight:700;color:#F0F0EB}

.modal-extra-imgs{display:flex;flex-direction:column;gap:3px;margin-bottom:32px}
.modal-extra-img{width:100%;aspect-ratio:16/9;position:relative;overflow:hidden;background-color:#161616}
.modal-extra-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.modal-extra-img svg{opacity:.05}

.modal-footer{padding:24px 40px;border-top:1px solid #1a1a1a;display:flex;gap:12px;flex-wrap:wrap}
@media(max-width:480px){.modal-footer{padding:20px}}'''

content = content.replace(old_modal_css, new_modal_css)
print('modal CSS:', 'OK' if old_modal_css not in content else 'FAIL')

# ── 3. Atualizar HTML do modal: modal-bg envolve o modal ────────────────────
old_modal_html = '<div class="modal-bg" id="modal-bg" onclick="closeModal()"></div>\n<div class="modal" id="modal">'
new_modal_html = '<div class="modal-bg" id="modal-bg" onclick="closeModal()">\n<div class="modal" id="modal" onclick="event.stopPropagation()">'
content = content.replace(old_modal_html, new_modal_html)
print('modal HTML:', 'OK' if old_modal_html not in content else 'FAIL')

# Fechar o modal-bg antes do footer do modal
content = content.replace(
    '  <div class="modal-footer">',
    '  <div class="modal-footer" onclick="event.stopPropagation()">',
    1
)

# ── 4. Atualizar JS: openModal/closeModal ────────────────────────────────────
old_open = "document.getElementById('modal-bg').classList.add('open');\n  document.getElementById('modal').classList.add('open');"
new_open = "document.getElementById('modal-bg').classList.add('open');"
if old_open in content:
    content = content.replace(old_open, new_open)
    print('openModal JS: OK')

old_close = "document.getElementById('modal-bg').classList.remove('open');\n  document.getElementById('modal').classList.remove('open');"
new_close = "document.getElementById('modal-bg').classList.remove('open');"
if old_close in content:
    content = content.replace(old_close, new_close)
    print('closeModal JS: OK')

# ── 5. Atualizar pov HTML para incluir ícone ────────────────────────────────
content = content.replace(
    '<div class="pov"><div><div class="ptitle">',
    '<div class="pov"><div class="pov-inner"><div><div class="ptitle">'
)
content = content.replace(
    '</div></div></div></div>',
    '</div></div><div class="pov-icon"><svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg></div></div></div></div>',
    1
)

with open(r'c:\Users\rodri\Downloads\SITE RONCOLATO\public\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('all done')
