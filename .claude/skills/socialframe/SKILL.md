---
name: socialframe
description: Atualiza e publica o SOCIAL FRAME (catálogo de fotos dos clientes). Sincroniza metadados do Lightroom, mostra o que mudou e publica em rroncolato.com.br/socialframe. Use quando o Rodrigo pedir "atualizar socialframe", "publicar as fotos", "sync das fotos", "subir catálogo", ou depois que ele exportou fotos novas do Lightroom.
---

# SOCIAL FRAME — Atualizar e publicar

Fluxo de publicação do catálogo de fotos. O Rodrigo exporta fotos do Lightroom para `G:\Meu Drive\FOTOS\_CORPORATIVAS\_SOCIALFRAME_\NOME-CLIENTE\` e esta skill faz o resto.

## Passos

1. **Sincronizar metadados** (lê stars/tags do XMP dos JPGs locais e atualiza o catálogo):
   ```bash
   node scripts/sync-social-frame.js
   ```
   Mostrar o resumo pro Rodrigo: quais clientes, quantas fotos, clientes novos.

2. **Verificar mudanças no catálogo:**
   ```bash
   git diff --stat SOCIAL-FRAME/catalogo.json
   ```
   - Se não mudou nada E não há mudança de código pendente → avisar que produção já está atualizada (fotos novas em pasta de cliente existente aparecem sozinhas, sem deploy) e **parar aqui**.
   - Se mudou → resumir o que mudou (cliente novo? stars/tags novas?).

3. **Commit + push:**
   ```bash
   git add SOCIAL-FRAME/catalogo.json
   git commit -m "sync: atualizar catalogo SOCIAL FRAME"
   git push origin master:main
   ```

4. **Deploy** (a invocação desta skill já é o pedido de publicação do Rodrigo — não precisa perguntar de novo):
   ```bash
   npx vercel deploy --prod --yes
   ```

5. **Validar produção:**
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://rroncolato.com.br/socialframe
   ```
   E conferir um cliente afetado: `curl -s https://rroncolato.com.br/api/social-frame/fotos/CLIENTE` deve retornar `success: true` com o total esperado.

## Atalho equivalente

Tudo isso em um comando: `npm run publicar` (roda `scripts/publicar-social-frame.js`). Usar os passos separados quando quiser mostrar o diff antes de publicar; usar o atalho quando o Rodrigo só quer publicar rápido.

## Regras do sistema (não quebrar)

- Cliente novo = subpasta nova no Drive; o sync cria a entrada no catálogo sozinho.
- Subpastas dentro do cliente = coleções (ensaios); raiz é ignorada quando há subpastas.
- Fotos novas em cliente existente aparecem online SEM deploy (API lista o Drive ao vivo). Deploy só é necessário para: cliente novo, stars/tags, mudança de código.
- Aliases de login (ex: "paula" → paula-e-marciella) são editados manualmente no `SOCIAL-FRAME/catalogo.json`, campo `aliases`.
- GitHub NÃO dispara deploy automático — deploy é sempre via CLI.
