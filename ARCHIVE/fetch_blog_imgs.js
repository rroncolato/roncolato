const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DEST = 'c:/Users/rodri/Downloads/SITE RONCOLATO/IMG/site';

// Unsplash free images - IDs curados para cada tema
const candidates = [
  // post1 - fotografia executiva como investimento
  { post: 'post1', file: 'post1-capa.jpg', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80&auto=format&fit=crop' },
  // post2 - identidade visual / LinkedIn
  { post: 'post2', file: 'post2-capa.jpg', url: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&q=80&auto=format&fit=crop' },
  // post4 - luz natural vs estúdio
  { post: 'post4', file: 'post4-capa.jpg', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop' },
  // post5 - mudanças na fotografia corporativa
  { post: 'post5', file: 'post5-capa.jpg', url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=1200&q=80&auto=format&fit=crop' },
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const get = (u) => {
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location);
        if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    };
    get(url);
  });
}

async function run() {
  const results = [];
  for (const c of candidates) {
    const destPath = path.join(DEST, c.file);
    process.stdout.write('Baixando ' + c.post + '...');
    try {
      const buf = await downloadBuffer(c.url);
      // Optimize with sharp: 1200x675 (16:9), quality 75
      const info = await sharp(buf)
        .resize(1200, 675, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 75, progressive: true })
        .toFile(destPath);
      console.log(' ✓ ' + (info.size/1024).toFixed(0) + 'KB - ' + c.file);
      results.push({ post: c.post, img: 'IMG/site/' + c.file });
    } catch(e) {
      console.log(' ✗ ' + e.message);
    }
  }

  // Update HTML
  const htmlPath = 'c:/Users/rodri/Downloads/SITE RONCOLATO/rodrigo-roncolato-v3_8.html';
  let html = fs.readFileSync(htmlPath, 'utf8');

  for (const r of results) {
    const postStart = html.indexOf(r.post + ':{');
    // Find body closing backtick }
    const bodyEnd = html.indexOf('`}', postStart);
    const after = html.slice(bodyEnd + 2, bodyEnd + 30);

    if (after.startsWith(',img:')) {
      // Already has img - replace it
      const imgEnd = html.indexOf("'", bodyEnd + 8) + 1;
      html = html.slice(0, bodyEnd + 2) + `,img:'${r.img}'` + html.slice(imgEnd);
    } else {
      // Insert img after body
      html = html.slice(0, bodyEnd + 2) + `,img:'${r.img}'` + html.slice(bodyEnd + 2);
    }
    console.log('✓ img adicionado ao ' + r.post);
  }

  // Also update blog-list thumbnails for each post
  for (const r of results) {
    const thumbId = `blog-img-${r.post}`;
    const oldThumb = new RegExp(`id="${thumbId}"><svg[^<]*<[^<]*<[^<]*<[^<]*</svg></div>`, 'g');
    html = html.replace(
      `id="${thumbId}"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>`,
      `id="${thumbId}" style="overflow:hidden;"><img src="${r.img}" style="width:100%;height:100%;object-fit:cover;display:block;"></div>`
    );
  }

  fs.writeFileSync(htmlPath, html, 'utf8');

  // Verify syntax
  const script = html.slice(html.indexOf('<script>')+8, html.indexOf('</script>',html.indexOf('<script>')));
  try { new Function(script); console.log('\n✓ JavaScript OK'); }
  catch(e) { console.log('\n✗ Erro JS:', e.message); }

  console.log('\nConcluído! ' + results.length + ' imagens adicionadas.');
}

run();
