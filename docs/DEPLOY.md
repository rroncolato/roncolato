# Roteiro de deploy do site novo

O site no ar é publicado do computador do Rodrigo, a partir da branch `feat/admin-seguro`, que tem coisas que só existem lá (login do admin, contratos). Por isso o deploy é feito de lá, trazendo do GitHub só o que mudou em cada fase. **Nunca publique a branch `claude/brave-volta-e8k19w` inteira**: ela não tem essas partes e o admin quebraria.

Recomendado antes de tudo: `git push -u origin feat/admin-seguro`, para ter cópia no GitHub.

## Fase 1 — Página /ensaio (pronta)

No computador, dentro da pasta do site:

```bash
git fetch origin claude/brave-volta-e8k19w
git checkout origin/claude/brave-volta-e8k19w -- scripts/deploy/ensaio.mjs
node scripts/deploy/ensaio.mjs publicar
```

O `publicar` publica **só a página de ensaio**:
1. copia da Vercel a versão que está no ar (admin, contratos, propostas, Social Frame, tudo);
2. troca apenas `public/ensaio/index.html` e acrescenta 2 imagens novas (`og-ensaio.jpg` e `sobre-rodrigo.webp`);
3. mostra quantos arquivos ficam iguais e pergunta "Publicar? (s/n)";
4. publica, espera ficar no ar e confere o site (tudo tem que aparecer com ✓);
5. atualiza a página no seu computador e salva no git, para o próximo deploy (Social Frame, por exemplo) não trazer a página antiga de volta.

Outras alterações que você tenha no computador e ainda não publicou **não vão junto**. Se a cópia do site no ar vier incompleta, ele para antes de publicar.

Precisa do Vercel CLI atualizado (comando `vercel api`). Se ele avisar que está antigo: `npm i -g vercel@latest`.

### Passo a passo manual (publica o site inteiro a partir do seu computador)

```bash
node scripts/deploy/ensaio.mjs preparar
```

O `preparar`:
- guarda a página atual em `ARCHIVE/ensaio/index-antes-DATA.html`;
- traz a página nova e as imagens que faltarem (`og-ensaio.jpg` e `sobre-rodrigo.webp`);
- não substitui imagens que você já tem e não mexe em mais nada.

Depois:

```bash
npm start                      # abrir http://localhost:3012/ensaio e conferir
git add -A public/ensaio public/assets scripts/deploy ARCHIVE/ensaio
git commit -m "feat(ensaio): nova página de ensaio"
npm run deploy                 # só com aprovação
node scripts/deploy/ensaio.mjs verificar
```

O `verificar` confere se a página nova está no ar (título, preço, perguntas, dados para buscas e imagens) e se o resto do site continua funcionando (home, blog, Social Frame, login).

**Para voltar atrás:** no painel da Vercel, em Deployments, escolha o deploy anterior e clique em **Promote** (volta na hora). Outra opção é copiar o arquivo guardado no `ARCHIVE/ensaio/` de volta para `public/ensaio/index.html` e publicar de novo.

## Fase 2 — Home, portfólio e blog novos (lançamento)

Pendências antes:
- aprovar a nova home, o portfólio e o blog;
- autorização dos clientes cujas fotos aparecem (Heloísa, Iza, Juvenildo e os demais);
- fotos em alta da faixa de ensaios, se quiser.

Os passos técnicos (mover `nova-home` para a raiz, ajustar o `vercel.json`, gerar o SEO com `--raiz`) estão em `docs/SEO.md`, na seção "No lançamento". Essa fase ganha um kit próprio, como o do ensaio, quando for aprovada.
