// Envio via backend (/api/oratoria-submit) — nenhuma credencial no frontend

// Configuração do WhatsApp
const WHATSAPP_CONFIG = {
    phoneNumber: '5562985928423',
    message: 'Olá Roncolato eu acabei de cadastrar para receber minhas fotos da *Imersão Oratória para Negócios*'
};

// Elementos do formulário
const captureForm = document.getElementById('captureForm');
const formInputs = captureForm.querySelectorAll('input[required]');

// Validação de formulário em tempo real
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });

    input.addEventListener('focus', () => {
        input.classList.remove('error');
    });
});

// Função para validar um input
function validateInput(input) {
    const value = input.value.trim();

    if (!value) {
        showInputError(input, 'Este campo é obrigatório');
        return false;
    }

    // Validações específicas
    if (input.name === 'email') {
        if (!isValidEmail(value)) {
            showInputError(input, 'E-mail inválido');
            return false;
        }
    }

    if (input.name === 'phone') {
        if (!isValidPhone(value)) {
            showInputError(input, 'Telefone inválido (use o formato: (00) 00000-0000)');
            return false;
        }
    }

    clearInputError(input);
    return true;
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar telefone
function isValidPhone(phone) {
    // Remove espaços e caracteres especiais
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
}

// Função para mostrar erro
function showInputError(input, message) {
    input.classList.add('error');

    // Remove error anterior se existir
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Cria elemento de erro
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
}

// Função para limpar erro
function clearInputError(input) {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Submissão do formulário
captureForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valida todos os inputs
    let isValid = true;
    formInputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        console.log('Formulário com erros');
        return;
    }

    // Coleta os dados do formulário
    let instagramHandle = document.getElementById('instagram').value.trim();
    let instagramUrl = '';

    // Se preencheu Instagram, converte para URL válida
    if (instagramHandle) {
        // Remove @ se o usuário digitou
        instagramHandle = instagramHandle.replace(/@/g, '').trim();
        if (instagramHandle) {
            instagramUrl = `https://www.instagram.com/${instagramHandle}`;
        }
    }

    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        profession: document.getElementById('profession').value.trim(),
        instagram: instagramUrl || ''
    };

    console.log('Dados do formulário completos:', formData);
    console.log('Instagram Handle Original:', instagramHandle);
    console.log('Instagram URL Final:', instagramUrl);

    // Envia os dados para o Notion
    try {
        // Desabilita o botão para evitar cliques múltiplos
        const submitBtn = captureForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Envia para o Notion
        const response = await sendToNotion(formData);

        if (response.ok) {
            showSuccessPopup();
            captureForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Liberar Acesso às Fotos';
        } else {
            throw new Error('Erro ao enviar para o Notion');
        }

    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        console.error('Detalhes:', error.message);
        showErrorMessage(`Erro: ${error.message || 'Erro ao processar sua solicitação. Por favor, tente novamente.'}`);
        const submitBtn = captureForm.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Liberar Acesso às Fotos';
    }
});

// Função para enviar dados ao Notion via API Backend
async function sendToNotion(formData) {
    try {
        const dataToSend = { ...formData };

        const response = await fetch('/api/oratoria-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erro da API:', error);
            throw new Error(`API Error: ${response.status} - ${error.error}`);
        }

        const data = await response.json();
        console.log('✓ Dados enviados para o Notion com sucesso!', data);
        return response;

    } catch (error) {
        console.error('Erro ao conectar com Notion:', error);
        throw error;
    }
}

// Função para mostrar popup de sucesso
function showSuccessPopup() {
    // Cria overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay show';

    // Cria modal
    const modal = document.createElement('div');
    modal.className = 'popup-modal';
    modal.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">✓</div>
            <h2>Cadastro Realizado com Sucesso!</h2>
            <p>Você será redirecionado para o WhatsApp para enviar uma mensagem de confirmação.</p>
            <button class="popup-btn" id="whatsappBtn">Abrir WhatsApp</button>
            <button class="popup-btn-secondary" id="skipBtn">Pular</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle WhatsApp button
    document.getElementById('whatsappBtn').addEventListener('click', () => {
        redirectToWhatsApp();
    });

    // Handle Skip button
    document.getElementById('skipBtn').addEventListener('click', () => {
        overlay.remove();
    });

    // Auto redirect após 2 segundos se não clicar
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            redirectToWhatsApp();
        }
    }, 2000);
}

// Função para redirecionar para WhatsApp
function redirectToWhatsApp() {
    const message = encodeURIComponent(WHATSAPP_CONFIG.message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Função para mostrar mensagem de erro
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-alert show';
    errorDiv.textContent = message;

    captureForm.parentElement.insertBefore(errorDiv, captureForm);
}

// Formatação automática de telefone
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        // Formata como (00) 00000-0000
        if (value.length >= 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length >= 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }

        e.target.value = value;
    });
}

// Estilo para mensagem de erro de input
const style = document.createElement('style');
style.textContent = `
    .form-group input.error {
        border-color: #ef4444;
        background-color: rgba(239, 68, 68, 0.05);
    }

    .error-message {
        display: block;
        font-size: 0.75rem;
        color: #fca5a5;
        margin-top: 0.25rem;
    }

    .error-message-alert {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #fca5a5;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        margin-bottom: 1rem;
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);
