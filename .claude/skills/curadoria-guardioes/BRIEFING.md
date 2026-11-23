# Curadoria Guardiões — Briefing (em construção)

> Ainda **não é a skill**. Aqui fica o que o Rodrigo já decidiu. Quando as pendências fecharem, este briefing vira o `SKILL.md` + arquivos de referência.
>
> ⚠️ Este repositório é **público**. Nada do conteúdo do segredo sagrado entra aqui. Isso vai só no arquivo local `segredo-sagrado.md` (ver abaixo).

---

## 1. Contexto

- **Cliente:** Comunidade Guardiões do Amor Maior (comunidade católica que realiza acampamentos).
- **Evento:** Acampamento Espírito Empreendedor, com **5 dias** de duração. O cronograma de uma edição será enviado depois.
- **Volume:** cerca de **4.000 fotos** por acampamento.
- **Público:** só adultos, **maiores de 21 anos**.
- **Uso de imagem:** termo assinado por todos na inscrição. **Todo mundo pode aparecer** (campistas, servos, padre, palestrantes). Até hoje ninguém pediu para ficar fora das fotos.
- **Papel da skill:** fotógrafo-curador e editor. Escolher as fotos mais fortes (emoção, sorriso, abraço, grupo, mãos dadas, oração, descontração), sugerir a edição e separar cada foto pelo destino certo **sem nunca vazar o segredo sagrado**.

## 2. Para que servem as fotos

A base de tudo é **registrar o evento**. Do registro saem três entregas:

| Entrega | Quem vê | Formato | Segredo sagrado? |
|---|---|---|---|
| **Telão** (durante o acampamento) | Campistas e servos, sem família nem visitantes. **O foco é o campista.** | Uma **pasta** de fotos. O Rodrigo deixa um aplicativo exibindo a pasta, sem slideshow montado. | **Sim** |
| **Carrossel nas redes sociais** | Público em geral | **2 a 3 fotos por dia** (de 10 a 15 por acampamento) | **Não** |
| **Venda na Fotto** | Campistas | Pasta para upload na plataforma | **Não** |

O segredo sagrado **só aparece no telão**. Fotos com segredo não sobem para a Fotto nem vão para as redes.

## 3. Fluxo de trabalho do Rodrigo no evento

- Fotografa **sempre em JPEG**.
- Internet ruim no local: descarrega em **HD externo ou no notebook** e trabalha **offline**.
- Trata no **Lightroom**, separa as fotos do telão em pasta e sobe um link durante o evento.

**Consequência para a skill:** tem que funcionar sem internet. Com 4.000 fotos não dá para mandar tudo pelo 4G do evento, então:
- **Durante o evento:** triagem técnica por script local (sem internet) e, quando houver sinal, só as fotos candidatas ao telão do dia vão para o Claude, em miniatura.
- **Depois do evento:** a curadoria completa das 4.000, com internet boa.

## 4. Segredo sagrado

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

## 5. Critérios de curadoria

- **Emoção não tem limite.** Choro, entrega, oração: se a foto é boa, entra.
- **Olho fechado não é defeito.** Em oração, louvor e adoração é o esperado, e muitas vezes é a melhor foto. Só conta como defeito em foto posada de grupo, quando a pessoa piscou.
- **Tremido e fora de foco:** a triagem só **sinaliza** e nunca descarta sozinha, porque o ambiente é escuro e tem movimento. A decisão é tomada no contexto.
- **Ruído não é critério.** O Rodrigo não se importa com ruído.
- **Telão:** priorizar os campistas. Servos aparecem, mas não são o centro.
- **Santíssimo (ostensório):** as fotos são mantidas e o uso no telão está liberado. A pedido da Igreja, a comunidade **evita muito** levar imagem do ostensório para fora da capela. Por isso:
  - Foto com o ostensório **nunca é aprovada automaticamente** para o carrossel ou para a Fotto. A skill marca a foto como "Santíssimo — decisão do Rodrigo".
  - Para mostrar a adoração fora do telão, a preferência é por fotos das **pessoas em adoração** sem o ostensório em destaque no quadro.

## 6. Edição

- **Escopo:** preset e ajuste por foto ou por grupo de cena. **Sem marca dos Guardiões na foto**, só tratamento e edição.
- **Ponto de partida:** o Rodrigo já tem um **preset próprio no Lightroom**. A skill parte dele e propõe melhorias, em vez de criar um do zero.
- **Referência:** fotos já tratadas pelo Rodrigo (ele envia quando estiver no computador).
- **JPEG** tem menos margem que RAW, então os ajustes precisam ser mais suaves e as correções de balanço de branco e de altas luzes, moderadas.
- **Luz:** tem momento à noite (escuro, ISO alto) e durante o dia. *Proposta:* duas variações do preset, uma para dia e outra para noite.
- **Ruído:** sem redução agressiva, porque o ruído não incomoda.

## 7. Decisões técnicas (para a construção)

- **Triagem offline** com script local que roda direto na pasta do HD, sem internet. Só sinaliza (tremida, desfocada, exposição, rajadas e duplicadas) e **não apaga nada**.
- **Estrelas, cores e keywords** gravadas como metadados XMP nos JPEGs. O Lightroom lê de volta em *Metadata > Read Metadata from Files*. **Sempre com backup antes de alterar o original** (regra do repo: nunca destruir arquivo).
- **Curadoria do Claude** feita a partir de miniaturas leves.
- **Saída em pastas:** a curadoria termina com uma pasta por entrega (telão por dia, carrossel por dia, Fotto). As fotos são **copiadas** para essas pastas, e os originais ficam onde estão.

---

## 8. Pendências

### Perguntas abertas
1. **Telão:** quantas fotos por pasta, mais ou menos? O telão passa todo dia ou só em um ou dois momentos do acampamento?
2. **Link durante o evento:** para quem é e o que vai nele? Se for aberto ao público, entra só foto LIVRE.
3. **Fotto:** a venda é por foto, por pacote ou por campista? Você organiza as pastas por dia, por momento ou de outro jeito? A marca d'água é colocada pela Fotto ou por você?

### Materiais que o Rodrigo vai enviar
- Cronograma de uma edição (5 dias).
- O preset atual do Lightroom (arquivo `.xmp`).
- Fotos já tratadas, como referência de edição.
- Opcional: algumas fotos que ele sempre descarta, para calibrar o critério.
- O documento do segredo sagrado (no arquivo local, a partir do modelo).
