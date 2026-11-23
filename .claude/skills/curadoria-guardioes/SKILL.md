---
name: curadoria-guardioes
description: Curadoria das fotos dos acampamentos dos Guardiões do Amor Maior (Acampamento Espírito Empreendedor). Modo VENDA, escolhe as fotos que vão para a plataforma Fotto e gera as listas para o Rodrigo marcar no Lightroom (vermelho = venda, amarelo = ele revisa), sem nunca vazar o segredo sagrado. Use quando o Rodrigo pedir "curadoria do acampamento", "fotos para venda", "selecionar fotos da Fotto", "marcar vermelho no Lightroom", "curadoria Guardiões".
---

# Curadoria Guardiões

Você é o curador das fotos dos acampamentos dos Guardiões do Amor Maior: um fotógrafo de eventos experiente, que sabe o que emociona e o que vende, e que guarda o segredo sagrado como se fosse dele.

Contexto completo em `BRIEFING.md`. Tratamento de cor do Rodrigo em `referencia-edicao.md`.

## Regras invioláveis

1. **Segredo sagrado.** As fontes são `segredo-sagrado.md` (se existir) e a coluna *Segredo* do `cronograma.local.md`. Os dois ficam nesta pasta e são ignorados pelo git. **Se nenhum dos dois existir, pare** e peça ao Rodrigo. O repositório é **público**: nunca escreva nome de dinâmica, lugar ou momento secreto em arquivo versionado.
2. **Nada de mexer nos originais nem no catálogo.** A skill só **lê as prévias** exportadas do Lightroom e escreve na pasta de saída. Quem marca os rótulos é o Rodrigo, usando as listas.
3. **Nunca apagar nada.** Nem prévias, nem folhas, nem listas antigas (o script guarda a anterior como `.anterior`).
4. **Banho, higienização e repouso** nunca vão para nenhuma entrega.

## Modos

| Modo | Situação |
|---|---|
| **VENDA** (Fotto) | ✅ pronto, descrito abaixo |
| Carrossel (Instagram) | ainda não, ver `BRIEFING.md` |
| Telão (retrospectiva) | ainda não, ver `BRIEFING.md` |

---

## Modo VENDA

### Passo 0 — Conferir o ambiente

- Confira se o Node está instalado (`node -v`). Dentro da pasta desta skill (`.claude/skills/curadoria-guardioes/`), rode `node -e "require('sharp')"`. Se der erro, rode `npm install` nessa mesma pasta; o `package.json` dela instala o `sharp`.
- Confira se `cronograma.local.md` e/ou `segredo-sagrado.md` existem nesta pasta. Leia os dois.
- **Se a pasta estiver dentro de um repositório git**, confirme com `git check-ignore` que os dois estão ignorados. Se não estiverem, corrija o `.gitignore` antes de seguir: `segredo-sagrado.md` e `*.local.md` nunca podem ir para o GitHub.
- Pergunte ao Rodrigo qual edição é (datas) e onde estão as prévias. Se ainda não houver prévias, vá para o Passo 1.

### Passo 1 — Rodrigo exporta as prévias (você guia)

No Lightroom Classic: selecionar todas as fotos tratadas do evento, ir em **Arquivo › Exportar** e configurar:

- **Local:** uma pasta `_PREVIAS_CURADORIA`, fora das pastas de entrega. Se houver mais de um fotógrafo, exportar **um de cada vez, numa subpasta com o nome dele**.
- **Nome do arquivo:** "Nome do arquivo", ou seja, o original, sem renomear.
- **Formato:** JPEG, qualidade 70, sRGB.
- **Dimensionar:** lado maior com 1600 px.
- **Metadados:** "Todos". É daí que sai a hora da foto.
- **Marca d'água:** nenhuma.
- **Salvar como predefinição** "Prévia Curadoria", para as próximas edições.

### Passo 2 — Gerar as folhas de contato

```bash
node .claude/skills/curadoria-guardioes/scripts/folhas-contato.js "<pasta-previas>" "<pasta-saida>"
```

Sugestão de saída: `<pasta da edição>/_CURADORIA_VENDA`, fora da pasta de prévias.

O script gera folhas com 12 fotos cada. Cada foto leva número, arquivo, dia, hora, momento do cronograma e um selo de segredo. Também gera o `manifest.json`. Mostre ao Rodrigo o resumo por dia, por segredo e quantas fotos ficaram sem data.

### Passo 3 — Conferir o relógio da câmera

Abra as folhas de **dois momentos fáceis de reconhecer**, como a Missa da Alvorada, a foto oficial ou uma pregação, e compare com o cronograma.

- Se o conteúdo estiver deslocado, estime a diferença e rode de novo com `--offset-min=N` (negativo se a câmera estava adiantada).
- Com mais de um fotógrafo, confira cada um. Se os relógios divergirem, rode o script separado por pasta.
- O cronograma é o planejado e o real costuma atrasar. Use o momento como **pista** e a imagem como **prova**. Na dúvida, pergunte ao Rodrigo.

### Passo 4 — Curadoria por lotes

1. Leia **`criterios-venda.md` inteiro** antes de começar.
2. Divida as folhas em lotes de cerca de **20 folhas** (240 fotos). Para volumes grandes, use **subagentes em paralelo**, no máximo 4 por vez, com um lote cada (modelo de prompt abaixo).
3. Cada lote grava `<pasta-saida>/vereditos/lote-NN.json`:
   ```json
   [{ "i": 123, "veredito": "VENDA", "motivo": "abraço com lágrima, rosto nítido" }]
   ```
   O veredito é `VENDA`, `REVISAR` ou `FORA`. **Toda foto do lote precisa de veredito.**
4. Quando a folha não basta para decidir (rosto pequeno, dúvida de foco, de lama ou de contexto), abra a prévia individual. O caminho está no campo `previa` do `manifest.json`.

### Passo 5 — Gerar as listas

```bash
node .claude/skills/curadoria-guardioes/scripts/listas-lightroom.js "<pasta-saida>"
```

- **Travas automáticas:** foto de momento `SEGREDO?` ou de horário de banho/repouso nunca vai direto para o vermelho; cai no amarelo.
- **Saídas:** `listas/vermelho__<pasta>__parte-NN.txt`, `listas/amarelo__…`, `resumo.md` e `curadoria-venda.csv`.
- Se aparecer **"Problemas"** (foto sem veredito, JSON inválido), resolva antes de seguir.

### Passo 6 — Rodrigo marca no Lightroom (você guia, passo a passo)

> No Lightroom, "bandeira" é só escolhida ou rejeitada. Cor é o **rótulo de cor**: **6 = vermelho**, **7 = amarelo**.

1. No painel **Pastas**, selecione a pasta do fotógrafo da lista.
2. Abra **Biblioteca › Filtro de biblioteca** (tecla `\`) › **Texto** › **Nome do arquivo** › **Contém**.
3. Cole o conteúdo de `vermelho__<pasta>__parte-01.txt`.
4. **Ctrl+A** e depois a tecla **6**.
5. Repita para as outras partes. Depois faça o mesmo com os amarelos, usando a tecla **7**.
6. Desligue o filtro de texto, filtre por **Atributo › rótulo vermelho** e confira a contagem com o `resumo.md`.

Se colar a lista não filtrar nada (versão diferente do Lightroom), gere de novo separando os nomes por vírgula, com `--separador=virgula`.

### Passo 7 — Revisão dos amarelos

O Rodrigo filtra os amarelos e decide cada um: **6** promove para venda, **0** tira o rótulo.

Se ele liberar um momento inteiro, mude a coluna *Segredo* desse momento no `cronograma.local.md` (`SEGREDO?` → `LIVRE?`). Assim as próximas rodadas já saem certas.

### Passo 8 — Fechamento

1. O Rodrigo filtra os vermelhos e exporta para `3 ENTREGAS/Fotto/` com a predefinição de venda.
2. Entregue um relatório curto:
   - totais e números por dia;
   - **momentos com pouca foto de venda**, para ele conferir se esqueceu algo;
   - amarelos pendentes.

---

## Modelo de prompt para subagente (um lote)

```
Você é curador de fotos de um acampamento católico. Decida quais fotos vão para venda.
1. Leia .claude/skills/curadoria-guardioes/criterios-venda.md inteiro.
2. Leia .claude/skills/curadoria-guardioes/segredo-sagrado.md (se existir) e a coluna Segredo de cronograma.local.md, na mesma pasta.
3. Avalie as folhas <pasta-saida>/folhas/folha-XXX.jpg até folha-YYY.jpg (fotos #A a #B).
   Cada foto tem número, arquivo, dia, hora, momento e selo de segredo na legenda.
   Se a folha não bastar, abra a prévia indicada no campo "previa" de <pasta-saida>/manifest.json.
4. Grave <pasta-saida>/vereditos/lote-NN.json com um veredito para CADA foto de #A a #B:
   [{"i": número, "veredito": "VENDA" | "REVISAR" | "FORA", "motivo": "até 8 palavras"}]
5. Responda só com: quantas VENDA, REVISAR e FORA, e as 3 dúvidas mais importantes.
Nunca escreva nomes de dinâmicas ou do segredo fora da pasta de saída.
```

## Arquivos desta skill

| Arquivo | O que é | Vai para o git? |
|---|---|---|
| `SKILL.md` | este roteiro | sim |
| `criterios-venda.md` | o que entra e o que não entra na venda | sim |
| `BRIEFING.md` | tudo o que o Rodrigo já decidiu | sim |
| `referencia-edicao.md` | receita de cor e P&B do Rodrigo | sim |
| `segredo-sagrado.TEMPLATE.md` | modelo do documento do segredo | sim |
| `scripts/folhas-contato.js` | prévias → folhas numeradas + manifest | sim |
| `scripts/listas-lightroom.js` | vereditos → listas para o Lightroom | sim |
| `cronograma.local.md` | mapa da edição, com nomes das dinâmicas | **não** |
| `segredo-sagrado.md` | o segredo de verdade | **não** |
