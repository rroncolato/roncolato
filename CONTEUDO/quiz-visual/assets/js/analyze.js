// ── ANALYZE.JS — Análise Arquetípica + PNL (Jung + Corporativo) ──

class Analyzer {
  constructor(data) {
    this.data = data;
    this.archetypeMap = this.buildArchetypeMap();
    this.segmentArchetypes = this.buildSegmentArchetypes();
  }

  buildArchetypeMap() {
    return {
      'Advogado': { principal: 'Herói', secundario: 'Sábio', evitar: ['Fora da Lei', 'Jester'] },
      'Medico': { principal: 'Sábio', secundario: 'Protetor', evitar: ['Criador', 'Jester'] },
      'Terapeuta': { principal: 'Protetor', secundario: 'Amante', evitar: ['Herói autoritário', 'Fora da Lei'] },
      'Empresario': { principal: 'Herói', secundario: 'Criador', evitar: ['Inocente', 'Homem Comum'] },
      'Contador': { principal: 'Sábio', secundario: 'Homem Comum', evitar: ['Jester', 'Criador ousado'] },
      'Outro': { principal: 'Herói', secundario: 'Sábio', evitar: [] }
    };
  }

  buildSegmentArchetypes() {
    return {
      'Advogado': {
        principal: 'Herói',
        descricao: 'Corajoso, líder, autoridade, decisivo',
        pnl_esperado: { olhar: 'Direto/confiante', postura: 'Ereta', expressao: 'Séria/assertiva' }
      },
      'Medico': {
        principal: 'Sábio',
        descricao: 'Inteligente, reflexivo, competência, segurança',
        pnl_esperado: { olhar: 'Profundo/focado', postura: 'Contemplativa', expressao: 'Confiante/analítica' }
      },
      'Terapeuta': {
        principal: 'Protetor',
        descricao: 'Empático, cuidador, humanidade, confiabilidade',
        pnl_esperado: { olhar: 'Caloroso', postura: 'Relaxada/aberta', expressao: 'Genuína/acolhedora' }
      },
      'Empresario': {
        principal: 'Herói',
        descricao: 'Visionário, liderança, poder, comando',
        pnl_esperado: { olhar: 'Adiante/futuro', postura: 'Centrada', expressao: 'Inspiradora' }
      },
      'Contador': {
        principal: 'Sábio',
        descricao: 'Preciso, confiável, detalhe, técnico',
        pnl_esperado: { olhar: 'Focado', postura: 'Estruturada', expressao: 'Profissional' }
      },
      'Outro': {
        principal: 'Herói',
        descricao: 'Padrão corporativo',
        pnl_esperado: { olhar: 'Direto', postura: 'Profissional', expressao: 'Confiante' }
      }
    };
  }

  calculateScore() {
    let score = 50; // baseline

    // P1: Foto recente comunica presença atual (-30 a +10)
    const p1_scores = { '5+': -30, '2-5': -15, '2': -5, '1': 10 };
    score += p1_scores[this.data.p1_fotoTempo] || 0;

    // P2: Reconhecimento = foto comunica autoridade/credibilidade (-25 a +20)
    const p2_scores = { 'Nao': -25, 'Parcial': -10, 'Sim': 20 };
    score += p2_scores[this.data.p2_reconhecido] || 0;

    // P3: Imagem comunica experiência = PNL alinhado (-20 a +15)
    const p3_scores = { 'Nao': -20, 'Nao-Sei': -10, 'Sim': 15 };
    score += p3_scores[this.data.p3_experiencia] || 0;

    // P4: Autoconhecimento estratégico (-5 a +10)
    const p4_scores = { 'Nao': -5, 'Sim': 10 };
    score += p4_scores[this.data.p4_arqTem] || 0;

    // P5: Feedback recebido = consciência do gap (+5 a -2)
    const p5_scores = { 'Sim': 5, 'Nao': -2 };
    score += p5_scores[this.data.p5_feedback] || 0;

    return Math.max(0, Math.min(100, score));
  }

  getNivel(score) {
    if (score <= 25) return 'CRÍTICO';
    if (score <= 50) return 'CONFUSO';
    if (score <= 75) return 'BOM';
    return 'EXCELENTE';
  }

  inferArchetypoFromResponses() {
    let archetypo = 'Desalinhado';

    if (this.data.p2_reconhecido === 'Sim' && this.data.p3_experiencia === 'Sim') {
      archetypo = 'Alinhado';
    } else if (this.data.p2_reconhecido === 'Nao' && this.data.p3_experiencia === 'Nao') {
      archetypo = 'Apagado (Homem Comum fraco)';
    } else if (this.data.p2_reconhecido === 'Parcial') {
      archetypo = 'Confuso (mix de archetipos)';
    }

    if (this.data.p1_fotoTempo === '5+') {
      archetypo += ' + Presença Antiga';
    }

    return archetypo;
  }

  generateArchetypeDiagnosis() {
    const segmentSpec = this.segmentArchetypes[this.data.segmento];
    const archetypoEsperado = segmentSpec.principal;
    const archetypoInferido = this.inferArchetypoFromResponses();
    const score = this.calculateScore();
    const nivel = this.getNivel(score);

    let diagnostico = '';
    let recomendacao = '';

    if (nivel === 'CRÍTICO') {
      diagnostico = `Seu posicionamento visual é uma BARREIRA. Como ${this.data.segmento.toLowerCase()}, você precisa comunicar ${archetypoEsperado.toLowerCase()} — ${segmentSpec.descricao.toLowerCase()}. Sua foto atual comunica ${archetypoInferido.toLowerCase()}, o oposto do que o mercado espera. Isso custa credibilidade imediatamente. Clientes veem sua imagem e decidem procurar outro. Seu maior desafio é realinhar PNL (olhar, postura, expressão, vestuário, iluminação) com seu arquétipo esperado.`;
      recomendacao = 'Reposição visual URGENTE — sessão de fotografia corporativa estratégica + consultoria de imagem';
    } else if (nivel === 'CONFUSO') {
      diagnostico = `Seu posicionamento visual é CONFUSO. Sua foto comunica ${archetypoInferido}, quando deveria comunicar ${archetypoEsperado}. Há desconexão entre sua competência real e como você é percebido. No seu segmento (${this.data.segmento}), isso significa: leva mais tempo pra ganhar confiança, você negocia de posição fraca, deixa oportunidades na mesa. Isso é fixável em uma sessão bem estruturada.`;
      recomendacao = 'Sessão de reposicionamento visual — alinhar PNL com arquétipo esperado';
    } else if (nivel === 'BOM') {
      diagnostico = `Seu posicionamento visual é BOM. Você comunica ${archetypoEsperado} com razoável alinhamento. Clientes veem competência e confiança. Há espaço para REFINAMENTO — potencializar presença visual já funcional.`;
      recomendacao = 'Consultoria de refinamento — otimizar PNL (iluminação, vestuário, composição)';
    } else {
      diagnostico = `Seu posicionamento visual é EXCELENTE. Você comunica ${archetypoEsperado} com clareza. Sua foto é seu melhor argumento de venda — clientes confiam em você imediatamente. Manter essa trajetória: atualizar foto a cada 1-2 anos, manter coerência visual em redes sociais.`;
      recomendacao = 'Manutenção estratégica — atualizar foto periodicamente, manter coerência de marca';
    }

    return {
      score,
      nivel,
      archetipos: {
        comunicado: archetypoInferido,
        esperado: archetypoEsperado,
        descricao: segmentSpec.descricao
      },
      pnl: segmentSpec.pnl_esperado,
      diagnostico,
      recomendacao,
      urgencia: nivel === 'CRÍTICO' ? 'Alta' : nivel === 'CONFUSO' ? 'Média' : 'Baixa'
    };
  }

  analyze() {
    return this.generateArchetypeDiagnosis();
  }
}

