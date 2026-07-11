const fs = require('fs');

const HTML_PATH = 'c:/Users/rodri/Downloads/SITE RONCOLATO/index.html';

const tag      = 'Personal Branding';
const date     = '07 Mar 2026';
const title    = 'Feed bonito não posiciona ninguém';
const readTime = '7 min';
const excerpt  = 'Feed bonito chama atenção, mas atenção sem clareza não vira cliente. Entenda como alinhar visual e posicionamento.';

const body = `<p>Se o seu Instagram está "lindo", mas as pessoas ainda perguntam o que você faz, o problema quase nunca é falta de design.</p>
<p>O que está faltando é <strong>posicionamento</strong>.</p>
<p>Um feed bem feito ajuda a chamar atenção, mas <strong>atenção sem clareza não vira confiança</strong>. E, sem confiança, não vira cliente.</p>
<p>Neste artigo, você vai entender por que <strong>estética sem intenção vira só decoração</strong> e como alinhar visual e mensagem para atrair o cliente certo.</p>
<h2>O que significa posicionamento no Instagram</h2>
<p>Posicionamento é a forma como a sua marca é percebida. Na prática, é a resposta imediata que alguém consegue dar ao bater o olho no seu perfil:</p>
<ul><li>Para quem é o seu trabalho</li><li>Qual problema você resolve</li><li>Qual resultado você entrega</li><li>Por que faz sentido escolher você</li></ul>
<p>Quando isso não fica claro, a pessoa até pensa "que perfil bonito", mas sai sem entender se você resolve o que ela precisa.</p>
<h2>Por que um feed bonito não vende sozinho</h2>
<p>É comum ver profissionais que investem pesado em identidade visual, fotografia e templates, mas continuam com:</p>
<ul><li>Poucos leads qualificados</li><li>Comentários genéricos do tipo "lindo!"</li><li>Dúvidas repetidas no direct</li><li>Clientes que chegam pedindo desconto, porque não enxergam valor</li></ul>
<p>Isso acontece porque <strong>beleza não comunica intenção</strong>. Ela segura a atenção por alguns segundos. Já o posicionamento faz a pessoa pensar: <em>"é exatamente isso que eu estava procurando."</em></p>
<h2>Estética sem intenção é decoração</h2>
<p>Um feed impecável pode falhar se não "diz" algo antes de você explicar. Um teste simples:</p>
<ul><li>Se a pessoa precisa ler muito para entender a imagem ou o post, a mensagem está fraca.</li><li>Se você precisa "traduzir" seu conteúdo no direct, faltou clareza.</li></ul>
<p>A comunicação visual precisa trabalhar por você, não contra você.</p>
<h2>O que a sua imagem precisa comunicar antes de você falar</h2>
<p>O objetivo do visual não é ser bonito. É ser <strong>reconhecível</strong> e <strong>inequívoco</strong>. A sua comunicação visual deve deixar claro, de forma consistente:</p>
<ol><li>Quem você atende</li><li>Qual transformação ou resultado você entrega</li><li>Qual método, diferencial ou abordagem sustenta a entrega</li></ol>
<p>Quando isso aparece com frequência no perfil, o cliente certo entende rápido e chega mais preparado.</p>
<h2>Como alinhar feed e posicionamento: 5 ajustes práticos</h2>
<h3>1) Defina a promessa central em uma frase</h3>
<p>Crie uma frase que una público + problema + resultado. Use essa promessa como filtro do seu conteúdo. Se o post não reforça a promessa, ele provavelmente está só "enchendo o feed".</p>
<h3>2) Escolha pilares e repita sem medo</h3>
<p>Repetição cria reconhecimento. Selecione de 3 a 5 pilares e mantenha consistência: conceitos e educação, provas e estudos de caso, bastidores e processo, opinião e posicionamento, oferta e conversão.</p>
<h3>3) Faça o teste dos 3 segundos no seu perfil</h3>
<p>Abra seu perfil como se fosse uma pessoa que não te conhece. Em 3 segundos, dá para entender o que você faz, para quem e por que confiar? Se a resposta for "mais ou menos", ajuste bio, destaques e posts fixados.</p>
<h3>4) Use design para facilitar leitura, não para enfeitar</h3>
<p>Design bom é aquele que ajuda a entender rápido, prioriza hierarquia de informação e mantém consistência sem poluir. Se o layout compete com a mensagem, a mensagem perde.</p>
<h3>5) Mostre provas e contexto, não só resultado</h3>
<p>Clareza cresce quando você mostra bastidores do processo, critérios de decisão, estudos de caso com contexto e antes/depois explicado. Isso transforma estética em confiança.</p>
<h2>Exemplos do dia a dia: quando o simples vende mais</h2>
<p>Duas cenas comuns: um feed impecável, com cara de marca grande, mas ninguém sabe exatamente o que a pessoa vende. Um perfil simples, mas objetivo, que fecha contrato antes mesmo da reunião.</p>
<p>A diferença quase sempre está em <strong>intenção e clareza</strong>.</p>
<h2>Conclusão</h2>
<p>Posicionamento visual não é sobre ficar bonito. É sobre ser reconhecido pela pessoa certa, sem confusão e sem precisar se explicar.</p>
<blockquote>Seu feed está bonito, mas está posicionando? Hoje, o seu maior desafio é imagem ou clareza?</blockquote>
<p>Se você quer um perfil que pare de ser só "bonito" e comece a atrair o cliente certo, organize sua promessa, seus pilares e sua vitrine com foco em clareza.</p>`;

let html = fs.readFileSync(HTML_PATH, 'utf8');

// Find next post ID
const postsStart = html.indexOf('const posts={');
const postsEnd   = html.indexOf('\nfunction goPost', postsStart);
const postsStr   = html.slice(postsStart, postsEnd);
const keys       = [...postsStr.matchAll(/(post\d+):\{/g)].map(m => parseInt(m[1].replace('post','')));
const nextNum    = Math.max(...keys) + 1;
const postId     = 'post' + nextNum;
console.log('Novo ID:', postId);

// 1. Insert into posts object
const newPost = '  ' + postId + ':{tag:\'' + tag + '\',date:\'' + date + '\',title:\'' + title + '\',body:`' + body + '`},\n';
html = html.slice(0, postsEnd) + '\n' + newPost + html.slice(postsEnd);

// 2. Update featured block to new post (no image yet, keep post6 image temporarily)
html = html.replace(/onclick="goPost\('post\d+'\)"(\s*>[\s\S]*?<div class="bf-title">)[^<]+(<\/div>)/,
  'onclick="goPost(\'' + postId + '\')"$1' + title + '$2');
html = html.replace(/<div class="bf-exc">[^<]+<\/div>/, '<div class="bf-exc">' + excerpt + '</div>');
html = html.replace(/<div class="bf-meta">[^<]+<\/div>/, '<div class="bf-meta">' + date + ' · ' + readTime + ' de leitura</div>');

// 3. Move post6 to top of blog-list (as first card)
const blogListOpen = '<div class="blog-list">';
const blogListIdx  = html.indexOf(blogListOpen) + blogListOpen.length;
const post6Card = '\n          <div class="bpost rv" onclick="goPost(\'post6\')">\n            <div class="bpost-img" id="blog-img-post6"><img src="/assets/IMG/site/post6-capa.jpg" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"></div>\n            <div><div class="bpost-tag">Personal Branding</div><div class="bpost-title">Sua imagem profissional está nas mãos de quem?</div><div class="bpost-meta">07 Mar 2026 · 8 min</div></div>\n          </div>\n';
html = html.slice(0, blogListIdx) + post6Card + html.slice(blogListIdx);

// 4. Add new post card at TOP of blog-list (above post6)
const blogListIdx2 = html.indexOf(blogListOpen) + blogListOpen.length;
const DELAYS = ['','d1','d2','d3','d4'];
const delay  = DELAYS[(nextNum - 2) % DELAYS.length];
const delayStr = delay ? ' ' + delay : '';
const newCard = '\n          <div class="bpost rv' + delayStr + '" onclick="goPost(\'' + postId + '\')">\n            <div class="bpost-img"><svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/><circle cx="24" cy="25" r="7" stroke="white" stroke-width="1.5"/></svg></div>\n            <div><div class="bpost-tag">' + tag + '</div><div class="bpost-title">' + title + '</div><div class="bpost-meta">' + date + ' · ' + readTime + '</div></div>\n          </div>\n';
html = html.slice(0, blogListIdx2) + newCard + html.slice(blogListIdx2);

// 5. Update sidebar recent posts
const brecentStart = html.indexOf('<div class="brecent">');
const brecentEnd   = html.indexOf('</div>\n        </div>', brecentStart) + 6;
const brecentBlock = html.slice(brecentStart, brecentEnd);
const newRecent = '<div class="brecent-item" onclick="goPost(\'' + postId + '\')"><div class="brecent-img"><svg width="24" height="24" viewBox="0 0 48 48" fill="none"><rect x="4" y="10" width="40" height="30" rx="2" stroke="white" stroke-width="1.5"/></svg></div><div><div class="brecent-title">' + title.slice(0,50) + '...</div><div class="brecent-date">' + date + '</div></div></div>\n            ';
const newBrecent = brecentBlock.replace('<div class="brecent">\n            ', '<div class="brecent">\n            ' + newRecent);
html = html.slice(0, brecentStart) + newBrecent + html.slice(brecentEnd);

fs.writeFileSync(HTML_PATH, html, 'utf8');

const script = html.slice(html.indexOf('<script>')+8, html.indexOf('</script>',html.indexOf('<script>')));
try { new Function(script); console.log('JS: OK'); } catch(e) { console.log('JS ERROR:', e.message); }
console.log('\nPost ' + postId + ' adicionado com sucesso!');
