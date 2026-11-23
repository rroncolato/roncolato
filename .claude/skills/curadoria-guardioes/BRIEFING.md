# Curadoria Guardiões — Briefing (em construção)

> Ainda **não é a skill**. Aqui fica o que o Rodrigo já decidiu. Quando as pendências fecharem, este briefing vira o `SKILL.md` + arquivos de referência.
>
> ⚠️ Este repositório é **público**. Nada do conteúdo do segredo sagrado entra aqui. Isso vai só no arquivo local `segredo-sagrado.md` (ver abaixo).

---

## 1. Contexto

- **Cliente:** Comunidade Guardiões do Amor Maior (comunidade católica que realiza acampamentos).
- **Evento:** Acampamento Espírito Empreendedor, com **5 dias** de duração. O cronograma de uma edição será enviado depois.
- **Público:** só adultos, **maiores de 21 anos**.
- **Uso de imagem:** termo assinado por todos na inscrição.
- **Papel da skill:** fotógrafo-curador e editor. Escolher as fotos mais fortes (emoção, sorriso, abraço, grupo, mãos dadas, oração, descontração), sugerir a edição e separar cada foto pelo destino certo **sem nunca vazar o segredo sagrado**.

## 2. Destinos das fotos

| Destino | Quem vê | Pode mostrar o segredo sagrado? |
|---|---|---|
| **Telão** (durante o acampamento) | Campistas, num momento de descontração para relembrar o que estão vivendo | **Sim** |
| **Venda — Fotto** (nome a confirmar) | Campistas | **Sim** |
| **Divulgação da comunidade** | Público em geral | **Não** |

## 3. Fluxo de trabalho do Rodrigo no evento

- Fotografa **sempre em JPEG**.
- Internet ruim no local: descarrega em **HD externo ou no notebook** e trabalha **offline**.
- Trata no **Lightroom**, seleciona fotos para o telão e sobe um link durante o evento.

**Consequência para a skill:** tem que funcionar sem internet. Triagem técnica por script local, e o Claude entra quando houver sinal (miniaturas leves) ou depois do evento.

## 4. Segredo sagrado

- **Do que se trata:** dinâmicas, lugares e brincadeiras. Os detalhes ficam **só no arquivo local**.
- **Níveis:**
  - **LIVRE:** pode ir para divulgação, telão e venda.
  - **SÓ CAMPISTA:** telão e venda. Nunca em divulgação.
  - **NUNCA SAI:** falta confirmar se existe algum item neste nível.
- **Onde fica:** `segredo-sagrado.md` nesta pasta, **ignorado pelo git**. O modelo está em `segredo-sagrado.TEMPLATE.md`.
- **Regras de segurança:**
  - Sem o arquivo `segredo-sagrado.md`, a skill **não libera nenhuma foto para divulgação**.
  - Na dúvida, a foto **sobe** de nível (vai para Só campista) e nunca desce.
  - Vestígio também conta: uma foto de outro momento que mostra marca de um item secreto (roupa, cenário, objeto) herda o nível desse item.

## 5. Critérios de curadoria

- **Emoção não tem limite.** Choro, entrega, oração: se a foto é boa, entra.
- **Olho fechado não é defeito.** Em oração, louvor e adoração é o esperado, e muitas vezes é a melhor foto. *Proposta a confirmar:* só conta como defeito em foto posada de grupo, quando a pessoa piscou.
- **Tremido e fora de foco:** o Rodrigo quer rever esse critério. *Proposta:* a triagem só **sinaliza** e nunca descarta sozinha, porque o ambiente é escuro e tem movimento. A decisão é tomada no contexto.
- **Ruído não é critério.** O Rodrigo não se importa com ruído.
- **Santíssimo:** a resposta veio como "descartar a foto". Falta confirmar até onde isso vale (ver pendências).

## 6. Edição

- **Escopo:** preset da marca e ajuste por foto ou por grupo de cena.
- **JPEG** tem menos margem que RAW, então o preset precisa ser mais suave e as correções de balanço de branco e de altas luzes, moderadas.
- **Luz:** tem momento à noite (escuro, ISO alto) e durante o dia. *Proposta:* duas variações do preset, uma para dia e outra para noite.
- **Ruído:** sem redução agressiva, porque o ruído não incomoda.

## 7. Decisões técnicas (para a construção)

- **Triagem offline** com script local que roda direto na pasta do HD, sem internet.
- **Estrelas, cores e keywords** gravadas como metadados XMP nos JPEGs. O Lightroom lê de volta em *Metadata > Read Metadata from Files*. **Sempre com backup antes de alterar o original** (regra do repo: nunca destruir arquivo).
- **Curadoria do Claude** feita a partir de miniaturas leves, para funcionar até com 4G fraco.

---

## 8. Pendências (perguntas abertas)

### Segredo sagrado e telão
1. **Santíssimo:** a regra de descartar vale para toda foto em que aparece o ostensório, ou só durante a adoração? Foto das pessoas adorando, sem o ostensório no quadro, pode?
2. O telão passa **só para campistas e servos**, ou em algum momento há família ou visitante na sala (no encerramento, por exemplo)?
3. Existe algo no nível **NUNCA SAI**, ou são só dois níveis (Livre e Só campista)?
4. A galeria na **Fotto** é fechada (só quem tem o link ou a senha) ou aberta para busca? Se for aberta, quem não acampou vê o segredo.
5. Você fotografa a **preparação dos servos** antes de uma dinâmica acontecer? Essas fotos não podem ir para o telão antes do momento.

### Pessoas
6. Quem aparece nas fotos: campistas, servos, padre, palestrantes? Algum tem regra própria? Se alguém pedir para não aparecer, como isso chega até você?

### Curadoria
7. **Volume:** quantas fotos você faz nos 5 dias, e quantas vão para o telão, a divulgação e a venda?
8. A proposta de triagem técnica (só sinalizar e nunca apagar; olho fechado só conta como defeito em foto posada) está boa?
9. Envio de 10 a 20 fotos que são "a cara" de um bom acampamento, e algumas que você sempre descarta, para calibrar o critério.

### Edição
10. Referência visual do preset (trabalho anterior ou clima desejado), cores da marca Guardiões e câmera usada.

### Entregas
11. **Capas:** de quê (galeria da Fotto, Instagram, telão, álbum)? E o que é o "ambiente" que você deixa preparado?
12. **Telão e link:** como o telão é montado (slideshow com música, vídeo)? Quantas fotos, de quais dias? O link que você sobe no evento é para quem?
13. **Fotto:** confirmar o nome. A venda é por foto, por pacote ou por campista? É preciso encontrar cada campista nas fotos? Como você organiza (por dia, por momento)? A marca d'água é aplicada pela plataforma ou por você?
14. **Divulgação:** para onde vai (Instagram dos Guardiões, site, WhatsApp) e quantas fotos costumam pedir?
