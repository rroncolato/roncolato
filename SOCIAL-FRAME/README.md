# SOCIAL FRAME

Catálogo de fotos corporativas para clientes. Visualização + recomendações de uso + download em lote.

## O que é

Produto de entrega para clientes fotógrafos. Cliente acessa link, digita nome, visualiza fotos editadas com recomendações de uso (Perfil, Feed, Stories, etc) e baixa todas em ZIP.

Fotos hospedadas no Google Drive (sem ocupar espaço servidor).

## Como funciona

1. **Acesso**: Cliente clica link → digita nome → autentica
2. **Visualização**: Galeria com fotos + stars + tags de uso
3. **Download**: Botão download todas as fotos em ZIP
4. **Metadados**: Você tagueia no Lightroom (stars, keywords) → JSON local mapeia recomendações

## Estrutura

```
SOCIAL-FRAME/
├─ README.md               (este arquivo)
├─ catalogo.json           (metadados das fotos por cliente)
├─ config/
│  └─ google-service-account.json  (chave Google — .gitignore)
└─ docs/
   └─ setup.md             (instruções técnicas)
```

## Setup

### 1. Configurar Google Drive

- Pasta principal: `FOTOS_CORPORATIVAS/SOCIAL_FRAME/`
- Dentro: pastas por cliente (`cliente-nome/imagens/`)
- Folder ID da SOCIAL_FRAME: `18IhoSz8GFDN6Lzy89SBiS0HKvUNdnIIX`

### 2. Google Service Account

- Chave JSON em `/SOCIAL-FRAME/config/google-service-account.json`
- Pasta compartilhada com service account (Editor)

### 3. Metadados

Arquivo `catalogo.json`:

```json
{
  "cliente-nome": {
    "folder_id": "18IhoSz8GFDN6Lzy89SBiS0HKvUNdnIIX",
    "fotos": {
      "foto-001.jpg": {
        "stars": 5,
        "tags": ["Perfil", "Feed"]
      }
    }
  }
}
```

## Tags disponíveis

- **Perfil** — foto de perfil (redes/site)
- **Feed** — postagens feed
- **Stories** — stories (Instagram/Facebook)
- **Destaque** — foto destaque
- **Banner** — topo página/site
- **Hero** — seção hero
- **Thumbnail** — thumbnail/miniatura

## API Endpoints

- `GET /api/social-frame/catalogo` — lista clientes
- `GET /api/social-frame/fotos/:cliente` — lista fotos + metadados
- `POST /api/social-frame/download/:cliente` — download ZIP

## Dashboard Cliente

Acesso: `/social-frame/:cliente`

- Galeria com fotos
- Filtro por stars/tags
- Preview + recomendações
- Botão download (ZIP)

## Fluxo de entrega

1. Você edita fotos no Lightroom (stars = recomendação)
2. Exporta JPG com metadados
3. Coloca em `FOTOS_CORPORATIVAS/SOCIAL_FRAME/cliente-nome/imagens/`
4. Atualiza `catalogo.json` (stars + tags)
5. Cliente recebe link

## Notas

- Fotos não são armazenadas localmente (puxa sempre do Drive)
- Chave Google não commita (add `.gitignore`)
- Download gera ZIP temporário, depois apaga
