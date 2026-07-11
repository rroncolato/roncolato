const fs = require('fs');
let html = fs.readFileSync('c:/Users/rodri/Downloads/SITE RONCOLATO/index.html', 'utf8');

// 1. Add img field inside post7 object
html = html.replace(
  "title:'Feed bonito não posiciona ninguém',body:",
  "title:'Feed bonito não posiciona ninguém',img:'/assets/IMG/site/post7-capa.jpg',body:"
);
console.log('post7 img field:', html.includes("post7-capa.jpg',body:") ? 'ok' : 'NOT FOUND');

// 2. Update blog-list card thumb for post7 (SVG → img)
const oldThumb = "onclick=\"goPost('post7')\">\n            <div class=\"bpost-img\"><svg width=\"28\" height=\"28\" viewBox=\"0 0 48 48\" fill=\"none\"><rect x=\"4\" y=\"10\" width=\"40\" height=\"30\" rx=\"2\" stroke=\"white\" stroke-width=\"1.5\"/><circle cx=\"24\" cy=\"25\" r=\"7\" stroke=\"white\" stroke-width=\"1.5\"/></svg></div>";
const newThumb = "onclick=\"goPost('post7')\">\n            <div class=\"bpost-img\"><img src=\"/assets/IMG/site/post7-capa.jpg\" style=\"width:100%;aspect-ratio:16/9;object-fit:cover;display:block;\"></div>";
if (html.includes(oldThumb)) {
  html = html.replace(oldThumb, newThumb);
  console.log('post7 thumb: ok');
} else {
  console.log('post7 thumb: NOT FOUND');
}

// 3. Update featured image to post7
const oldFeatured = 'src="/assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;"';
const newFeatured = 'src="/assets/IMG/site/post7-capa.jpg" style="width:100%;aspect-ratio:16/7;object-fit:cover;display:block;"';
if (html.includes(oldFeatured)) {
  html = html.replace(oldFeatured, newFeatured);
  console.log('featured img: ok');
} else {
  console.log('featured img: NOT FOUND, searching...');
  const idx = html.indexOf('bf-img');
  console.log('bf-img area:', html.slice(idx, idx+200));
}

fs.writeFileSync('c:/Users/rodri/Downloads/SITE RONCOLATO/index.html', html, 'utf8');

const script = html.slice(html.indexOf('<script>')+8, html.indexOf('</script>',html.indexOf('<script>')));
try { new Function(script); console.log('JS: OK'); } catch(e) { console.log('JS ERROR:', e.message); }
