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

| Entrega | Quem vê | Pode mostrar o segredo sagrado? |
|---|---|---|
| **Carrosséis nas redes sociais** | Público em geral | **Não** (só fotos LIVRES) |
| **Telão** (durante o acampamento) | Campistas e servos, sem família nem visitantes. **O foco é o campista.** | **Sim** |
| **Venda na Fotto** (nome confirmado) | Campistas | **Sim** |

## 3. Fluxo de trabalho do Rodrigo no evento

- Fotografa **sempre em JPEG**.
- Internet ruim no local: descarrega em **HD externo ou no notebook** e trabalha **offline**.
- Trata no **Lightroom**, seleciona fotos para o telão e sobe um link durante o evento.

**Consequência para a skill:** tem que funcionar sem internet. Com 4.000 fotos não dá para mandar tudo pelo 4G do evento, então:
- **Durante o evento:** triagem técnica por script local (sem internet) e, quando houver sinal, só as fotos candidatas ao telão do dia vão para o Claude, em miniatura.
- **Depois do evento:** a curadoria completa das 4.000, com internet boa.

## 4. Segredo sagrado

- **Do que se trata:** dinâmicas, lugares e brincadeiras. Os detalhes ficam **só no arquivo local**.
- **Níveis (só dois):**
  - **LIVRE:** pode ir para carrossel, telão e venda.
  - **SÓ CAMPISTA:** telão e venda. Nunca nas redes sociais.
- **Onde fica:** `segredo-sagrado.md` nesta pasta, **ignorado pelo git**. O modelo está em `segredo-sagrado.TEMPLATE.md`.
- **Regras de segurança:**
  - Sem o arquivo `segredo-sagrado.md`, a skill **não libera nenhuma foto para as redes sociais**.
  - Na dúvida, a foto **sobe** para Só campista e nunca desce.
  - Vestígio também conta: uma foto de outro momento que mostra marca de um item secreto (roupa, cenário, objeto) herda o nível desse item.
  - Foto de **preparação** de uma dinâmica (servos montando antes) não vai para o telão antes de a dinâmica acontecer.

## 5. Critérios de curadoria

- **Emoção não tem limite.** Choro, entrega, oração: se a foto é boa, entra.
- **Olho fechado não é defeito.** Em oração, louvor e adoração é o esperado, e muitas vezes é a melhor foto. Só conta como defeito em foto posada de grupo, quando a pessoa piscou.
- **Tremido e fora de foco:** a triagem só **sinaliza** e nunca descarta sozinha, porque o ambiente é escuro e tem movimento. A decisão é tomada no contexto.
- **Ruído não é critério.** O Rodrigo não se importa com ruído.
- **Santíssimo:** **manter** as fotos. Uso no telão está liberado. Falta confirmar carrossel e venda.
- **Telão:** priorizar os campistas. Servos aparecem, mas não são o centro.

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

---

## 8. Pendências

### Perguntas abertas
1. **Santíssimo:** no telão está liberado. E no **carrossel das redes** e na **venda**, também pode?
2. **Fotto, galeria fechada ou aberta:** quem não acampou consegue ver as fotos (por busca, link público)? Se conseguir, as fotos SÓ CAMPISTA ficam expostas.
3. **Fotto, como vende:** por foto, por pacote ou por campista? É preciso encontrar cada campista nas fotos? Como você organiza as pastas (por dia, por momento)? A marca d'água é colocada pela Fotto ou por você?
4. **Telão:** como você monta (slideshow com música, vídeo, qual programa)? Passa todo dia ou num momento específico? Quantas fotos por sessão? E o link que você sobe durante o evento é para quem?
5. **Carrossel:** quantos carrosséis por acampamento (um por dia, um no final)? Em qual perfil são postados (seu ou dos Guardiões)?
6. **Capas:** a pergunta sobre "capas" e "ambiente" segue em aberto. Se não for importante, pode ignorar.

### Materiais que o Rodrigo vai enviar
- Cronograma de uma edição (5 dias).
- O preset atual do Lightroom (arquivo `.xmp`).
- Fotos já tratadas, como referência de edição.
- Opcional: algumas fotos que ele sempre descarta, para calibrar o critério.
- O documento do segredo sagrado (no arquivo local, a partir do modelo).
