# Setup Técnico - SOCIAL FRAME

## 1. Preparação Google Drive

### Estrutura de pastas

```
FOTOS_CORPORATIVAS/
└─ SOCIAL_FRAME/
   ├─ cliente-nome-1/
   │  └─ imagens/
   │     ├─ foto-001.jpg
   │     └─ foto-002.jpg
   └─ cliente-nome-2/
      └─ imagens/
```

### Permissões

- Pasta `SOCIAL_FRAME` compartilhada com service account (Editor)
- Folder ID: `18IhoSz8GFDN6Lzy89SBiS0HKvUNdnIIX`

## 2. Google Service Account

### Arquivo de configuração

```bash
# Salvar em: /SOCIAL-FRAME/config/google-service-account.json
# Nunca commita (já no .gitignore)
```

Conteúdo: o arquivo JSON baixado do Google Cloud Console (Service Account → Chaves → Criar chave JSON). Nunca commitar — já está no .gitignore.

## 3. Integração Node.js

### Dependências

```bash
npm install googleapis dotenv
```

### Variáveis de ambiente

Arquivo `.env` (root do projeto):
```
GOOGLE_SERVICE_ACCOUNT_PATH=./SOCIAL-FRAME/config/google-service-account.json
SOCIAL_FRAME_FOLDER_ID=18IhoSz8GFDN6Lzy89SBiS0HKvUNdnIIX
```

### Módulo Google Drive

Arquivo `src/utils/google-drive.js`:

```javascript
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const credentialsPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

async function listFiles(folderId) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType)',
      pageSize: 1000
    });
    return response.data.files || [];
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    throw error;
  }
}

async function downloadFile(fileId, destinationPath) {
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    
    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(destinationPath))
        .on('end', () => resolve(destinationPath))
        .on('error', reject);
    });
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error);
    throw error;
  }
}

module.exports = {
  drive,
  listFiles,
  downloadFile
};
```

## 4. Metadados (catalogo.json)

Atualizar quando adicionar clientes/fotos:

```json
{
  "cliente-nome": {
    "folder_id": "FOLDER_ID_DO_CLIENTE",
    "nome_completo": "Nome Completo Cliente",
    "email": "cliente@email.com",
    "fotos": {
      "foto-001.jpg": {
        "stars": 5,
        "tags": ["Perfil", "Destaque"]
      }
    }
  }
}
```

## 5. Rotas API

Será implementado em `src/routes/social-frame.js`:

```
GET /api/social-frame/catalogo       - lista clientes
GET /api/social-frame/fotos/:cliente  - lista fotos + metadados
POST /api/social-frame/download/:cliente - download ZIP
```

## 6. Dashboard Cliente

Será em `/admin/social-frame.html` (ou rota dinâmica):

- Acesso com nome do cliente
- Galeria com fotos do Drive
- Filtros (stars, tags)
- Download ZIP

## Fluxo de atualização

1. **Edita fotos no Lightroom**
   - Tagueia stars (1-5)
   - Tagueia keywords (tags)

2. **Exporta JPG com metadados**
   - Include Metadata = ON

3. **Coloca em Drive**
   - `FOTOS_CORPORATIVAS/SOCIAL_FRAME/cliente-nome/imagens/`

4. **Atualiza catalogo.json**
   - Adiciona entrada com stars + tags

5. **Cliente recebe link**
   - `rroncolato.com.br/social-frame/cliente-nome`

## Troubleshooting

### Erro: "ENOENT: google-service-account.json not found"
- Verifica se arquivo tá em `/SOCIAL-FRAME/config/`
- Verifica se `.env` tem caminho correto

### Erro: "403 Forbidden"
- Verifica se service account foi compartilhado na pasta SOCIAL_FRAME (Editor)
- Verifica permissões no Google Cloud

### Erro: "Folder not found"
- Verifica Folder ID (deve ser da SOCIAL_FRAME, não de subpastas)
- Verifica se folder_id no catalogo.json tá correto

## Próximos passos

- [ ] Testar conexão Google Drive
- [ ] Implementar rotas API
- [ ] Criar dashboard cliente
- [ ] Testar download ZIP
- [ ] Deploy Vercel
