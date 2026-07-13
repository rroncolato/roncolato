// ── QUIZ.JS — Lógica de navegação e validação ──

class Quiz {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.data = {
      nomeCompleto: '',
      segmento: '',
      p1_fotoTempo: '',
      p2_reconhecido: '',
      p3_experiencia: '',
      p4_arqTem: '',
      p4_arquetipo: '',
      p5_feedback: '',
      photo: null,
      whatsapp: ''
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateProgress();
  }

  setupEventListeners() {
    // Botões navegação
    document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
    document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());

    // Upload foto
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');

    uploadArea.addEventListener('click', () => photoInput.click());
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--primary)';
      uploadArea.style.background = 'rgba(245, 197, 24, 0.1)';
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = 'var(--border-strong)';
      uploadArea.style.background = 'var(--card-bg)';
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--border-strong)';
      uploadArea.style.background = 'var(--card-bg)';
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handlePhotoUpload(files[0]);
      }
    });

    photoInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handlePhotoUpload(e.target.files[0]);
      }
    });

    // Trocar foto
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    if (changePhotoBtn) {
      changePhotoBtn.addEventListener('click', () => {
        document.getElementById('photoInput').click();
      });
    }
  }

  handlePhotoUpload(file) {
    // Validar file
    if (!file.type.includes('image/')) {
      alert('Por favor, envie uma imagem');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande (máx 10MB)');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.data.photo = e.target.result;
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('photoPreview').style.display = 'block';
      document.getElementById('uploadArea').style.display = 'none';

      // Mostrar loading
      this.showPhotoAnalysisLoading();
    };
    reader.readAsDataURL(file);
  }

  showPhotoAnalysisLoading() {
    const previewDiv = document.getElementById('photoPreview');
    const loadingEl = document.createElement('div');
    loadingEl.id = 'photo-analysis-loading';
    loadingEl.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(10, 10, 10, 0.9);
      padding: 20px 40px;
      border-radius: 8px;
      color: #F5C518;
      font-weight: 700;
      text-align: center;
      z-index: 10;
    `;
    loadingEl.textContent = 'Analisando sua foto...';
    previewDiv.style.position = 'relative';
    previewDiv.appendChild(loadingEl);
  }

  async analyzePhotoVisualAndDiagnose() {
    try {
      const response = await fetch('/api/quiz/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: this.data.photo })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`Erro na análise: ${err.error || err.message}`);
        return;
      }

      const analysis = await response.json();
      this.data.photoAnalysis = analysis;

      // Remover loading
      const loadingEl = document.getElementById('photo-analysis-loading');
      if (loadingEl) loadingEl.remove();

      // Gerar diagnóstico (que abre modal)
      this.generateDiagnosis();
    } catch (error) {
      console.error('Erro análise foto:', error);
      alert('Erro ao analisar foto. Tente novamente.');
    }
  }

  async analyzePhotoVisual() {
    try {
      const response = await fetch('/api/quiz/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: this.data.photo })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`Erro na análise: ${err.error || err.message}`);
        return;
      }

      const analysis = await response.json();
      this.data.photoAnalysis = analysis;

      // Remover loading
      const loadingEl = document.getElementById('photo-analysis-loading');
      if (loadingEl) loadingEl.remove();

      // Mostrar resultado análise visual
      this.displayPhotoAnalysisResult(analysis);

      // Habilitar próximo botão
      document.getElementById('nextBtn').disabled = false;
      document.getElementById('nextBtn').textContent = 'Próximo →';
      document.getElementById('nextBtn').style.opacity = '1';
    } catch (error) {
      console.error('Erro análise foto:', error);
      alert('Erro ao analisar foto. Tente novamente.');
    }
  }

  displayPhotoAnalysisResult(analysis) {
    const div = document.createElement('div');
    div.style.cssText = `
      margin-top: 24px;
      padding: 16px;
      background: rgba(245, 197, 24, 0.1);
      border: 1px solid rgba(245, 197, 24, 0.3);
      border-radius: 12px;
      font-size: 14px;
      color: #F0F0EB;
      line-height: 1.6;
    `;
    div.innerHTML = `
      <h4 style="color: #F5C518; margin-bottom: 12px; font-size: 16px;">Análise Visual da Sua Foto</h4>
      <p><strong>Iluminação:</strong> ${analysis.iluminacao?.tipo} — ${analysis.iluminacao?.impacto}</p>
      <p><strong>Postura:</strong> ${analysis.postura?.descricao}</p>
      <p><strong>Olhar:</strong> ${analysis.olhar?.qualidade} (${analysis.olhar?.direcao})</p>
      <p><strong>Expressão:</strong> ${analysis.expressao?.tipo}</p>
      <p><strong>Vestuário:</strong> ${analysis.vestuario?.tipo} — ${analysis.vestuario?.cores}</p>
      <p><strong>Diagnóstico Visual:</strong></p>
      <p style="font-style: italic; margin-top: 8px;">${analysis.diagnostico_visual}</p>
    `;
    document.getElementById('photoPreview').appendChild(div);
  }

  collectData() {
    const step = this.currentStep;

    if (step === 1) {
      this.data.nomeCompleto = document.getElementById('nomeCompleto').value.trim();
      this.data.segmento = document.querySelector('input[name="segmento"]:checked')?.value;

      // Se "Outro" selecionado, puxar input customizado
      if (this.data.segmento === 'Outro') {
        const segmentoCustomizado = document.getElementById('segmento-customizado').value.trim();
        if (!segmentoCustomizado) {
          alert('Por favor, especifique seu segmento');
          return false;
        }
        this.data.segmento = segmentoCustomizado;
      }

      if (!this.data.nomeCompleto) {
        alert('Por favor, insira seu nome');
        return false;
      }
      if (!this.data.segmento) {
        alert('Por favor, selecione seu segmento');
        return false;
      }
    }

    if (step === 2) {
      this.data.p1_fotoTempo = document.querySelector('input[name="p1_fotoTempo"]:checked')?.value;
      this.data.p2_reconhecido = document.querySelector('input[name="p2_reconhecido"]:checked')?.value;
      this.data.p3_experiencia = document.querySelector('input[name="p3_experiencia"]:checked')?.value;
      this.data.p4_arqTem = document.querySelector('input[name="p4_arqTem"]:checked')?.value;
      if (this.data.p4_arqTem === 'Sim') {
        this.data.p4_arquetipo = document.getElementById('arquetipo-input').value.trim();
      }
      this.data.p5_feedback = document.querySelector('input[name="p5_feedback"]:checked')?.value;

      if (!this.data.p1_fotoTempo || !this.data.p2_reconhecido || !this.data.p3_experiencia || !this.data.p4_arqTem || !this.data.p5_feedback) {
        alert('Por favor, responda todas as perguntas');
        return false;
      }
    }

    if (step === 3) {
      if (!this.data.photo) {
        alert('Por favor, envie sua foto');
        return false;
      }
      // Step 3: Análise visual automática + diagnóstico
      this.analyzePhotoVisualAndDiagnose();
      return false; // Não avança (modal aparece automaticamente)
    }

    return true;
  }

  generateDiagnosis() {
    const analyzer = new Analyzer(this.data);
    const analysis = analyzer.analyze();
    const photoAnalysis = this.data.photoAnalysis || {};

    // Salvar análise nos dados pra enviar ao Notion
    this.data.analysisScore = analysis.score;
    this.data.analysisNivel = analysis.nivel;
    this.data.archetiposComun = analysis.archetipos.comunicado;
    this.data.archetiposEsperado = analysis.archetipos.esperado;
    this.data.diagnostico = analysis.diagnostico;
    this.data.recomendacao = analysis.recomendacao;
    this.data.urgencia = analysis.urgencia;
    this.data.pnlAnalise = JSON.stringify(analysis.pnl);
    this.data.photoAnalysisVisual = JSON.stringify(photoAnalysis);

    // Renderizar diagnóstico profissional (combinando visual + arquetípica)
    const html = `
      <div class="diagnosis-score">
        <div class="score-badge">
          <span class="score-number">${analysis.score}</span>
          <span class="score-nivel">${analysis.nivel}</span>
        </div>
        <div class="score-urgency">
          Urgência: <strong>${analysis.urgencia}</strong>
        </div>
      </div>

      <div class="diagnosis-section">
        <h4>Análise Visual</h4>
        <p><strong>Iluminação:</strong> ${photoAnalysis.iluminacao?.tipo || 'N/A'}</p>
        <p><strong>Postura:</strong> ${photoAnalysis.postura?.descricao || 'N/A'}</p>
        <p><strong>Olhar:</strong> ${photoAnalysis.olhar?.qualidade || 'N/A'}</p>
        <p><strong>Expressão:</strong> ${photoAnalysis.expressao?.tipo || 'N/A'}</p>
      </div>

      <div class="diagnosis-section">
        <h4>Seu Perfil Arquetípico</h4>
        <p><strong>Esperado:</strong> ${analysis.archetipos.esperado}</p>
        <p><strong>Comunicado:</strong> ${analysis.archetipos.comunicado}</p>
        <p>${analysis.archetipos.descricao}</p>
      </div>

      <div class="diagnosis-section">
        <h4>Diagnóstico Profissional</h4>
        <p>${analysis.diagnostico}</p>
      </div>

      <div class="diagnosis-section">
        <h4>Recomendação</h4>
        <p><strong>${analysis.recomendacao}</strong></p>
      </div>
    `;

    document.getElementById('analysisText').innerHTML = html;
    document.getElementById('diagnosisBox').style.display = 'block';

    // Scroll para análise
    setTimeout(() => {
      document.getElementById('diagnosisBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Abrir modal captura dados
    this.openCaptureModal();
  }

  openCaptureModal() {
    const modal = document.getElementById('captureModal');
    modal.style.display = 'flex';

    document.getElementById('modal-cancel').onclick = () => {
      modal.style.display = 'none';
    };

    document.getElementById('modal-submit').onclick = () => {
      this.submitFromModal();
    };
  }

  submitFromModal() {
    const nome = document.getElementById('modal-nome').value.trim();
    const whatsapp = document.getElementById('modal-whatsapp').value.trim();

    if (!nome) {
      alert('Por favor, insira seu nome');
      return;
    }
    if (!whatsapp) {
      alert('Por favor, insira seu WhatsApp');
      return;
    }

    this.data.nomeCompleto = nome;
    this.data.whatsapp = whatsapp;

    this.submitData();
  }

  submitData() {
    const submitter = new Submitter(this.data);
    submitter.submit().then(() => {
      alert('Diagnóstico salvo! Aguarde nosso contato via WhatsApp.');
      this.reset();
    });
  }

  nextStep() {
    if (!this.collectData()) return;

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateSteps();
      this.updateProgress();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateSteps();
      this.updateProgress();
    }
  }

  updateSteps() {
    document.querySelectorAll('.quiz-step').forEach(step => {
      step.classList.remove('active');
    });
    document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
  }

  updateProgress() {
    const progress = (this.currentStep / this.totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentStep').textContent = this.currentStep;

    // Botão voltar
    const prevBtn = document.getElementById('prevBtn');
    if (this.currentStep > 1) {
      prevBtn.style.display = 'block';
    } else {
      prevBtn.style.display = 'none';
    }

    // Texto botão próximo
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = this.currentStep === 3 ? 'Analisar Foto' : 'Próximo →';
  }

  reset() {
    this.currentStep = 1;
    this.data = {
      nomeCompleto: '',
      segmento: '',
      p1_fotoTempo: '',
      p2_reconhecido: '',
      p3_experiencia: '',
      p4_arqTem: '',
      p4_arquetipo: '',
      p5_feedback: '',
      photo: null,
      whatsapp: ''
    };

    // Reset form
    document.getElementById('nomeCompleto').value = '';
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('segmento-customizado').value = '';
    document.getElementById('segmento-customizado').style.display = 'none';
    document.getElementById('arquetipo-input').value = '';
    document.getElementById('arquetipo-input').style.display = 'none';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('whatsapp').value = '';
    document.getElementById('diagnosisBox').style.display = 'none';

    this.updateSteps();
    this.updateProgress();
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  new Quiz();
});
