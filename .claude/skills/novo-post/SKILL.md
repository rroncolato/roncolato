---
name: novo-post
description: Cria um post novo no blog do site, sincronizando os 3 lugares onde os posts vivem. Use quando o Rodrigo pedir "novo post", "postar no blog", "criar artigo", "publicar no blog".
---

# Novo post no blog

O conteúdo de cada post do blog vive em **3 lugares que precisam ficar idênticos**. Esquecer um deles quebra o blog. Esta skill garante os três.

## Os 3 lugares (SEMPRE os três)

1. **`data/blog-posts.json`** — a fonte oficial (array de posts)
2. **`public/index.html`** — a constante `_POSTS_DATA` (o blog na página lê daqui)
3. **`api/blog/posts.js`** — a constante `POSTS_FALLBACK` (usada em produção)

## Estrutura de um post (campos exatos)

```json
{
  "id": "post10",
  "slug": "titulo-em-minusculo-com-hifen",
  "tag": "Personal Branding",
  "date": "13 Jul 2026",
  "title": "Título do artigo",
  "excerpt": "Resumo de 1-2 frases que aparece no card.",
  "img": "/assets/IMG/site/post10-capa.jpg",
  "video": "",
  "featured": false,
  "published": true,
  "body": "<p>Corpo em HTML...</p><h2>Subtítulo</h2><p>...</p>"
}
```

- `id` — sequencial (`post10`, `post11`...). Confira o último em `data/blog-posts.json`.
- `tag` — categoria. Usar as que já existem: Personal Branding, Branding, Behind the Scenes, Equipamento, Mercado, Manifesto.
- `video` — só se for post com vídeo do YouTube (só o ID, ex: `XURRkxCToac`). Senão, `""`.
- `featured` — só UM post por vez pode ser `true` (é o destaque do topo).
- `body` — HTML. **CUIDADO com aspas:** dentro do JSON, aspas no texto precisam ser `\"escapadas\"`. Ex: `\"Just Do It\"`. Aspas cruas quebram o arquivo.

## Passo a passo

### 1. Escrever o conteúdo
Se o Rodrigo trouxe o texto (ex: de um carrossel de Instagram), converter para artigo de blog com SEO. Usar o tom de voz dele (mentor, imagem como estratégia). Pode acionar os agents `brand-voice-reviewer` ou `caption-writer`.

### 2. Pegar o próximo id
```bash
node -e "const p=require('./data/blog-posts.json'); console.log('ultimo id:', p[p.length-1].id)"
```

### 3. Imagem de capa
A capa vai em `public/assets/IMG/site/postN-capa.jpg`. Se o Rodrigo mandou uma imagem, salvar com esse nome. Referenciar como `/assets/IMG/site/postN-capa.jpg`.

### 4. Adicionar nos 3 lugares
- `data/blog-posts.json` — adicionar o objeto no array.
- `public/index.html` — adicionar o MESMO objeto na constante `_POSTS_DATA`.
- `api/blog/posts.js` — adicionar o MESMO objeto na constante `POSTS_FALLBACK`.

### 5. Validar que não quebrou
```bash
node -e "const p=require('./data/blog-posts.json'); console.log('JSON OK, posts:', p.length)"
node -e "import('./api/blog/posts.js').then(()=>console.log('api OK'))"
```

### 6. Testar local (opcional)
`npm start` → abrir http://localhost:3012 → aba Blog → conferir o card e o post aberto.

### 7. Deploy
Usar a skill `/deploy` (com aprovação). Depois verificar:
```bash
curl -s -o /dev/null -w "%{http_code}" https://rroncolato.com.br/blog/SLUG
```

## Erros comuns já vividos
- **Aspas cruas no `body`** quebram o `blog-posts.json` (aconteceu com "Just Do It"). Sempre validar com o node depois de editar.
- **Esquecer um dos 3 lugares** → o post aparece num lugar e não em outro. Os três, sempre.
- **Dois posts `featured: true`** → layout duplica. Só um destaque.
