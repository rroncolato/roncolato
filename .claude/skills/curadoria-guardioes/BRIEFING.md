# Curadoria Guardiões — Briefing (em construção)

> Ainda **não é a skill**. Aqui fica o que o Rodrigo já decidiu. Quando as pendências fecharem, este briefing vira o `SKILL.md` + arquivos de referência.
>
> ⚠️ Este repositório é **público**. Nada do conteúdo do segredo sagrado entra aqui. Isso vai só no arquivo local `segredo-sagrado.md` (ver abaixo).

---

## 1. Contexto

- **Cliente:** Comunidade Guardiões do Amor Maior (comunidade católica que realiza acampamentos).
- **Evento:** Acampamento Espírito Empreendedor, com **5 dias** de duração. Cronograma da **X edição (18 a 22/11/2026)** recebido. O mapa completo, com os nomes das dinâmicas, está em `cronograma.local.md`, **fora do git**.
- **Ritmo (versão neutra):**
  - O Dia 1 começa à noite, com a chegada por volta das 21h.
  - O Dia 5 termina por volta das 16h, com a **foto oficial**.
  - Os momentos mais fortes se concentram **à noite, de madrugada e com pouquíssima luz**.
- **Nunca publicar:** banho, higienização e repouso, em nenhuma entrega.
- **Volume:** cerca de **4.000 fotos** por acampamento.
- **Equipe:** pode haver **mais de um fotógrafo** na cobertura.
- **Público:** só adultos, **maiores de 21 anos**.
- **Uso de imagem:** termo assinado por todos na inscrição. **Todo mundo pode aparecer** (campistas, servos, padre, palestrantes). Até hoje ninguém pediu para ficar fora das fotos.
- **Papel da skill:** fotógrafo-curador e editor. Escolher as fotos mais fortes (emoção, sorriso, abraço, grupo, mãos dadas, oração, descontração), sugerir a edição e separar cada foto pelo destino certo **sem nunca vazar o segredo sagrado**.

## 2. Para que servem as fotos

A base de tudo é **registrar o evento**. Do registro saem três entregas:

| Entrega | Quem vê | Formato | Segredo sagrado? |
|---|---|---|---|
| **Telão** (durante o acampamento) | Campistas e servos, sem família nem visitantes. **O foco é o campista.** | Uma **pasta por dia**. O Rodrigo deixa um aplicativo exibindo a pasta, sem slideshow montado. | **Sim** |
| **Carrossel no Instagram** | Público em geral | **2 a 3 carrosséis por dia**, de **15 a 20 fotos** cada (o máximo do Instagram). De 30 a 60 fotos por dia. | **Não** |
| **Venda na Fotto** | Campistas | Venda **por foto e por pacote**, e o campista pode comprar mais. O link sai no fim do último dia ou nos dias seguintes. | **Não** |

O segredo sagrado **só aparece no telão**. Fotos com segredo não sobem para a Fotto nem vão para as redes.

### Carrossel
- Cada carrossel conta **um bloco do dia** (um momento ou um período), em ordem: abre forte, varia entre plano aberto, detalhe e close, e fecha com impacto.
- A **primeira foto é a capa**: a imagem que faz a pessoa parar no feed.

## 3. Fluxo de trabalho no evento

- Fotografa **sempre em JPEG**.
- Internet ruim no local: descarrega em **HD externo ou no notebook** e trabalha **offline**.
- Trata no **Lightroom** e separa as fotos do telão em pasta.
- O link de venda da Fotto é publicado **depois**: no fim do evento ou nos dias seguintes.

**Consequência para a skill:** tem que funcionar sem internet. Com 4.000 fotos não dá para mandar tudo pelo 4G do evento, então:
- **Durante o evento:** triagem técnica por script local (sem internet) e, quando houver sinal, só as fotos candidatas ao telão do dia vão para o Claude, em miniatura.
- **Depois do evento:** a curadoria completa das 4.000, com internet boa, para carrosséis e Fotto.

## 4. Organização das pastas (proposta)

Uma pasta por edição, com três partes: o que saiu do cartão, o que saiu do Lightroom e o que vai para cada entrega.

```
Espirito Empreendedor 2026-11/      ← uma pasta por edição
├── 1 ORIGINAIS/                    ← sai do cartão e ninguém mexe
│   ├── Dia 1/
│   │   ├── Rodrigo/
│   │   └── Fotografo 2/
│   ├── Dia 2/
│   └── ... até Dia 5
├── 2 EDITADAS/                     ← um export só do Lightroom, por dia
│   ├── Dia 1/
│   └── ...
└── 3 ENTREGAS/                     ← a skill monta, sempre com cópias
    ├── Telao/
    │   ├── Dia 1/
    │   └── ...
    ├── Carrossel/
    │   ├── Dia 1/
    │   │   ├── Carrossel 1/
    │   │   ├── Carrossel 2/
    │   │   └── Carrossel 3/
    │   └── ...
    └── Fotto/
        ├── Dia 1/
        │   ├── 1 Manha/
        │   ├── 2 Tarde/
        │   └── 3 Noite/
        └── ...
```

**Por que o dia vem antes do fotógrafo:** tudo no acampamento acontece por dia (cronograma, telão, carrossel). À noite você abre "Dia 2" e tem o dia inteiro num lugar só, de todos os fotógrafos. A pasta do fotógrafo fica dentro do dia só para guardar o crédito e evitar arquivos com o mesmo nome (duas câmeras geram `IMG_0001.JPG`).

**Regras da estrutura:**
- **Período só na Fotto.** Na venda, manhã, tarde e noite ajudam o campista a se achar. O período sai do horário da foto, então ninguém precisa separar na mão. Os números (`1 Manha`, `2 Tarde`, `3 Noite`) garantem a ordem certa, porque em ordem alfabética "Noite" viria antes de "Tarde".
- **Nomes neutros.** Nenhuma pasta usa o nome de uma dinâmica, porque o nome da pasta também pode entregar o segredo.
- **Nome dos arquivos nas entregas:** `D2_14h32_Rodrigo_0153.jpg` (dia, hora, fotógrafo, número). Em ordem alfabética a pasta fica em ordem cronológica, inclusive no aplicativo do telão, mesmo misturando fotógrafos.
- **Relógio das câmeras:** antes do Dia 1, todos os fotógrafos acertam o relógio da câmera pelo celular. Como garantia, cada um fotografa a tela do mesmo celular mostrando a hora, e a skill corrige a diferença.

## 5. Segredo sagrado

- **Do que se trata:** dinâmicas, lugares e brincadeiras. Os detalhes ficam **só no arquivo local**.
- **Níveis (só dois):**
  - **LIVRE:** pode ir para o telão, o carrossel e a venda.
  - **SÓ TELÃO:** aparece apenas no telão. Nunca nas redes, nunca na Fotto.
- **Onde fica:** `segredo-sagrado.md` nesta pasta, **ignorado pelo git**. O modelo está em `segredo-sagrado.TEMPLATE.md`.
- **Regras de segurança:**
  - Sem o arquivo `segredo-sagrado.md`, a skill **não libera nenhuma foto para as redes nem para a Fotto**.
  - Na dúvida, a foto vai para **Só telão**, nunca o contrário.
  - Vestígio também conta: uma foto de outro momento que mostra marca de um item secreto (roupa, cenário, objeto) herda o nível desse item.
  - Foto de **preparação** de uma dinâmica (servos montando antes) não vai para o telão antes de a dinâmica acontecer.

## 6. Critérios de curadoria

- **Emoção não tem limite.** Choro, entrega, oração: se a foto é boa, entra.
- **Olho fechado não é defeito.** Em oração, louvor e adoração é o esperado, e muitas vezes é a melhor foto. Só conta como defeito em foto posada de grupo, quando a pessoa piscou.
- **Tremido e fora de foco:** a triagem só **sinaliza** e nunca descarta sozinha, porque o ambiente é escuro e tem movimento. A decisão é tomada no contexto.
- **Ruído não é critério.** O Rodrigo não se importa com ruído.
- **Telão:** priorizar os campistas. Servos aparecem, mas não são o centro.
- **Santíssimo (ostensório):** as fotos são mantidas e o uso no telão está liberado. A pedido da Igreja, a comunidade **evita muito** levar imagem do ostensório para fora da capela. Por isso:
  - Foto com o ostensório **nunca é aprovada automaticamente** para o carrossel ou para a Fotto. A skill marca a foto como "Santíssimo — decisão do Rodrigo".
  - Para mostrar a adoração fora do telão, a preferência é por fotos das **pessoas em adoração** sem o ostensório em destaque no quadro.

## 7. Edição

- **Escopo:** preset e ajuste por foto ou por grupo de cena. **Sem marca dos Guardiões na foto**, só tratamento e edição (ver pendência sobre a faixa de logos).
- **Ponto de partida:** o Rodrigo já tem um **preset próprio no Lightroom**. A skill parte dele e propõe melhorias, em vez de criar um do zero.
- **Referência:** a receita real do tratamento (lida dos metadados de 13 fotos de um acampamento anterior) está em **`referencia-edicao.md`**.
- **Equipamento:** Fujifilm X-T2 em JPEG 16:9, lentes XF18, XF50 e XF90 f/2 (quase sempre abertas) e drone DJI.
- **JPEG** tem menos margem que RAW, então os ajustes precisam ser mais suaves e as correções de balanço de branco e de altas luzes, moderadas.
- **Luz:** o cronograma mostra que cerca de metade dos momentos mais fortes acontece com pouca luz. São necessárias três famílias de preset: **Dia**, **Noite** (tenda e palco com luz artificial) e **Baixa luz** (madrugada e luz mínima).
- **Ruído:** sem redução agressiva, porque o ruído não incomoda.

## 8. Decisões técnicas (para a construção)

- **Triagem offline** com script local que roda direto na pasta do HD, sem internet. Só sinaliza (tremida, desfocada, exposição, rajadas e duplicadas) e **não apaga nada**.
- **Estrelas, cores e keywords** gravadas como metadados XMP nos JPEGs. O Lightroom lê de volta em *Metadata > Read Metadata from Files*. **Sempre com backup antes de alterar o original** (regra do repo: nunca destruir arquivo).
- **Curadoria do Claude** feita a partir de miniaturas leves.
- **Distribuição:** o Rodrigo exporta do Lightroom uma vez por dia para `2 EDITADAS`. A skill copia cada foto para as pastas de `3 ENTREGAS`, renomeia no padrão acima e não move nem altera os originais.

---

## 9. Pendências

### Perguntas abertas
1. **Equipe:** quantos fotógrafos costumam trabalhar com você? Todos fotografam em JPEG e usam o seu preset?
2. **Estrutura de pastas:** a proposta da seção 4 serve, ou quer mudar algo?
3. **Telão:** quantas fotos, mais ou menos, vão na pasta de cada dia? Se preferir, a skill sugere um número.
4. **Fotto:** a marca d'água é colocada pela plataforma ou por você?

### Perguntas que surgiram das fotos de referência
5. **Faixa de logos:** todas as fotos de referência têm o degradê com os logos (Guardiões, Espírito Empreendedor, roncolato). Ela continua? Em quais entregas: telão, carrossel, stories? E na Fotto, sai sem?
6. **Crianças:** na referência há crianças (momento com famílias). Qual é a regra para foto com menor no carrossel e na Fotto?
7. **Stories:** as fotos verticais 9:16 com logos parecem ser para stories. Stories também é uma entrega?
8. **P&B:** na amostra, o P&B aparece nos bastidores e nos servos e a cor nos campistas. É um critério seu ou foi caso a caso?
9. **Para que foi essa pasta:** as 118 fotos foram a seleção para as redes, para o telão ou outra coisa?

### Perguntas que surgiram do cronograma
10. **Segredo:** revisar a proposta de classificação de cada momento no `cronograma.local.md` (SEGREDO? / LIVRE? / DECIDIR).
11. **Telão:** a retrospectiva do Dia 5, de madrugada, é o momento do telão? É uma sessão única ou há telão em outros dias?
12. **Atividades externas:** o maior bloco do acampamento (cerca de 12 horas no total) é coberto pelo fotógrafo? Se for segredo, essas fotos ficam só no telão.
13. **Moção do dia:** pode ser usada publicamente como tema do carrossel do dia?
14. **Artista convidado:** existe autorização para vender fotos dele na Fotto?

### Materiais que o Rodrigo vai enviar
- ~~Cronograma de uma edição (5 dias).~~ Recebido (X edição).
- O preset atual do Lightroom (arquivo `.xmp`), para confirmar a receita lida das fotos.
- **Fotos de referência à noite** (a pasta enviada só tem fotos de dia).
- Opcional: algumas fotos que ele sempre descarta, para calibrar o critério.
- ~~Fotos já tratadas, como referência de edição.~~ Recebidas: pasta "FOTOS" no Drive, analisada em `referencia-edicao.md`.
- O documento do segredo sagrado (no arquivo local, a partir do modelo).
