import type { DiagnosticResult } from "@/lib/schemas/diagnostic-result";

/**
 * Fixture de resultado usado pelo adapter demo e pelos testes.
 * Linguagem segue as regras éticas: fala do que a fotografia comunica.
 */
export const DEMO_RESULT: DiagnosticResult = {
  version: "1.0.0",
  imageValidation: {
    valid: true,
    faceCountCategory: "single",
    imageQuality: "medium",
  },
  visualObservations: {
    expression: [
      "Sorriso contido, com leve tensão na região da boca",
      "Expressão que comunica cordialidade com reserva",
    ],
    gaze: [
      "Olhar direcionado à câmera, com intensidade moderada",
      "A direção frontal do olhar favorece a percepção de presença",
    ],
    posture: [
      "Ombros levemente assimétricos em relação ao enquadramento",
      "Postura visível comunica estabilidade sem rigidez",
    ],
    framing: [
      "Enquadramento em meio busto, distância convencional de retrato",
      "Espaço superior reduzido comprime levemente a composição",
    ],
    clothing: [
      "Vestuário em tom neutro, alinhado a contexto profissional tradicional",
      "Ausência de elementos que sinalizem diferenciação de marca pessoal",
    ],
    background: [
      "Fundo neutro e limpo, sem elementos de contexto",
      "A neutralidade do fundo favorece o rosto, mas não comunica cenário de atuação",
    ],
    lighting: [
      "Luz frontal difusa, sem direção marcada",
      "Ausência de contraste reduz profundidade e sensação editorial",
    ],
    technicalQuality: [
      "Resolução adequada para uso digital",
      "Nitidez levemente reduzida na região dos olhos",
    ],
  },
  scores: {
    expression: 62,
    authority: 55,
    connection: 70,
    visualCoherence: 58,
    archetypalAlignment: 48,
    perceivedValue: 52,
  },
  perceivedArchetypes: [
    {
      archetype: "cara-comum",
      confidence: 0.72,
      evidence: [
        "Vestuário neutro sem marcadores de diferenciação",
        "Iluminação uniforme e enquadramento convencional",
      ],
    },
    {
      archetype: "cuidador",
      confidence: 0.55,
      evidence: [
        "Sorriso cordial e postura receptiva",
        "Distância de enquadramento que favorece proximidade",
      ],
    },
  ],
  desiredArchetypes: ["sabio", "governante"],
  alignment: {
    strengths: [
      "A frontalidade do olhar sustenta presença — base útil para autoridade",
      "A cordialidade da expressão preserva acessibilidade",
    ],
    conflicts: [
      "A imagem comunica proximidade convencional, enquanto a intenção declarada aponta para profundidade e liderança",
      "A luz sem direção reduz a sensação de sofisticação associada aos arquétipos desejados",
    ],
    summary:
      "Visualmente, existe maior aproximação com códigos de proximidade do que com os códigos de profundidade e liderança declarados como intenção. A distância não é de essência, mas de linguagem visual.",
  },
  freeResult: {
    mainStrength:
      "A fotografia comunica presença e cordialidade: o olhar frontal e a expressão receptiva criam uma base real de conexão — um ativo que muitas imagens profissionais não têm.",
    mainGap:
      "A maior distância está entre a intenção de ser percebido como referência e os códigos visuais atuais, que comunicam um posicionamento mais convencional. O enquadramento, a luz sem direção e o vestuário neutro aproximam a imagem do comum — não do nível declarado.",
    initialRecommendation:
      "Comece pela luz: uma iluminação com direção definida adiciona profundidade e intenção à imagem, aproximando-a dos códigos visuais de autoridade sem perder a naturalidade.",
    conclusion:
      "Sua fotografia já comunica algo. A questão é saber se ela comunica exatamente o que sua carreira precisa neste momento.",
  },
  fullResult: {
    introduction:
      "Esta leitura parte de um princípio: antes de você falar, sua imagem já começou a posicionar você. O que segue não é um julgamento — é a decodificação dos sinais que esta fotografia emite para quem a vê pela primeira vez.",
    expressionAnalysis:
      "A expressão registrada comunica cordialidade com reserva. O sorriso contido sugere disposição ao contato, enquanto a leve tensão na região da boca pode ser percebida como contenção. Em contextos de decisão, essa combinação transmite educação e distância simultâneas — um sinal misto que dilui a mensagem.",
    authorityAnalysis:
      "Os códigos de autoridade presentes são parciais. O olhar frontal sustenta presença, mas a luz difusa e o enquadramento convencional não constroem a densidade visual que normalmente acompanha percepção de liderança. A fotografia comunica competência, não comando.",
    connectionAnalysis:
      "Este é o pilar mais forte da imagem. A distância de enquadramento, a expressão receptiva e a frontalidade criam acessibilidade genuína. O desafio não é criar conexão — é elevá-la de simpatia para confiança estratégica.",
    coherenceAnalysis:
      "Entre a intenção declarada e a imagem apresentada existe uma diferença de registro: a intenção fala em profundidade e referência; a fotografia fala em proximidade e convenção. Roupa, fundo e luz estão coerentes entre si, mas coerentes com um posicionamento que não é o desejado.",
    archetypeAnalysis:
      "Visualmente, a imagem aproxima-se do Cara Comum (proximidade, pertencimento) com traços de Cuidador (acolhimento). Os arquétipos desejados — Sábio e Governante — pedem códigos distintos: mais contraste, mais intenção na composição, elementos que sinalizem domínio de contexto. Não se trata de trocar a essência, e sim de vestir visualmente a profundidade que já existe.",
    perceivedValueAnalysis:
      "A fotografia aparenta estar abaixo do nível declarado de atuação. Sinais técnicos — luz sem direção, nitidez reduzida, ausência de direção de arte — comunicam registro casual, o que pode gerar leitura de valor inferior à entrega real.",
    practicalRecommendations: [
      "Adote iluminação com direção definida (lateral suave) para criar profundidade e presença editorial.",
      "Reposicione o enquadramento com mais espaço de respiro superior e intenção compositiva.",
      "Escolha vestuário com um elemento de diferenciação — textura, corte ou tom — que sinalize sofisticação sem rigidez.",
      "Utilize um cenário que comunique contexto de atuação (biblioteca, escritório com identidade, ambiente arquitetural).",
      "Direcione a expressão para intensidade serena: olhar firme, sorriso mínimo — o registro do Sábio.",
    ],
    strategicSummary:
      "A fotografia atual constrói conexão, mas não constrói o nível. A distância entre a imagem e a intenção é de linguagem visual — luz, composição, contexto e direção de expressão. São variáveis controláveis, e é exatamente isso que uma imagem estratégica resolve.",
  },
  confidence: 0.78,
  limitations: [
    "A leitura considera apenas os elementos visíveis nesta fotografia específica",
    "Qualidade média da imagem limita a análise fina de microexpressão",
  ],
};
