/**
 * ============================================================================
 * COMPONENTS.JS - Biblioteca de Componentes Reutilizáveis
 * ============================================================================
 * Componentes vanilla JS para Admin Roncolato
 * Stack: Vanilla JavaScript (sem dependencies)
 * Design System: Light Mode com Yellow #F5C518
 *
 * Componentes disponíveis:
 * - Modal
 * - Toast
 * - FormValidator
 * - Table
 * - Card
 * - Tabs
 * - ImagePreview
 * - DragDropZone
 * ============================================================================
 */

// ============================================================================
// TOAST COMPONENT
// ============================================================================
/**
 * Sistema de notificações toast (pop-up temporário)
 * Uso: Toast.show('Mensagem', 'success', 3000)
 */
const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    const colors = {
      success: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
      error: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
      warning: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
      info: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' }
    };

    const color = colors[type] || colors.info;
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.style.cssText = `
      background: ${color.bg};
      color: ${color.text};
      border-left: 4px solid ${color.border};
      padding: 14px 16px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
      pointer-events: auto;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 300px;
      max-width: 500px;
    `;

    toast.innerHTML = `
      <span style="font-size: 18px; flex-shrink: 0;">${icons[type]}</span>
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    const removeToast = () => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    };

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    return { remove: removeToast };
  }
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================
/**
 * Modal com overlay
 * Uso:
 * const modal = new Modal('Título', 'Conteúdo HTML', [{text: 'OK', action: fn}])
 * modal.show()
 */
class Modal {
  constructor(title, content, buttons = []) {
    this.title = title;
    this.content = content;
    this.buttons = buttons;
    this.element = null;
    this.overlay = null;
  }

  show() {
    // Criar overlay
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
    `;

    // Criar modal
    this.element = document.createElement('div');
    this.element.style.cssText = `
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      max-width: 500px;
      width: 90%;
      padding: 24px;
      animation: slideUp 0.3s ease-out;
    `;

    // Header
    let html = `<h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1A1A1A;">${this.title}</h2>`;

    // Content
    html += `<div style="margin-bottom: 20px; color: #4A4A4A; line-height: 1.6;">${this.content}</div>`;

    // Buttons
    if (this.buttons.length === 0) {
      this.buttons = [{ text: 'Fechar', action: () => this.close() }];
    }

    html += `<div style="display: flex; gap: 10px; justify-content: flex-end;">`;
    this.buttons.forEach((btn, idx) => {
      const isMain = idx === this.buttons.length - 1;
      const bg = isMain ? '#F5C518' : '#F3F3F3';
      const color = isMain ? '#1A1A1A' : '#1A1A1A';
      html += `
        <button data-btn-index="${idx}" style="
          background: ${bg};
          color: ${color};
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        ">${btn.text}</button>
      `;
    });
    html += '</div>';

    this.element.innerHTML = html;

    // Event listeners
    this.element.querySelectorAll('[data-btn-index]').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.buttons[idx].action?.();
        this.close();
      });
      btn.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      });
      btn.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      });
    });

    this.overlay.appendChild(this.element);
    document.body.appendChild(this.overlay);

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // ESC key
    this.escListener = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this.escListener);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.style.animation = 'fadeOut 0.2s ease-out';
    this.element.style.animation = 'slideDown 0.3s ease-out';
    setTimeout(() => {
      this.overlay?.remove();
      document.removeEventListener('keydown', this.escListener);
    }, 300);
  }
}

// ============================================================================
// FORM VALIDATOR
// ============================================================================
/**
 * Validador de formulários
 * Uso: FormValidator.validate(formElement, rules)
 */
const FormValidator = {
  errors: {},

  rules: {
    required: (value) => value?.trim() ? null : 'Este campo é obrigatório',
    email: (value) => {
      if (!value) return null;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? null : 'Email inválido';
    },
    minLength: (min) => (value) => {
      return value?.length >= min ? null : `Mínimo de ${min} caracteres`;
    },
    maxLength: (max) => (value) => {
      return value?.length <= max ? null : `Máximo de ${max} caracteres`;
    },
    url: (value) => {
      if (!value) return null;
      try {
        new URL(value);
        return null;
      } catch {
        return 'URL inválida';
      }
    },
    fileType: (types) => (files) => {
      if (!files || files.length === 0) return null;
      const validTypes = types.split(',').map(t => t.trim());
      for (let file of files) {
        if (!validTypes.includes(file.type)) {
          return `Tipo de arquivo inválido. Aceitos: ${types}`;
        }
      }
      return null;
    },
    fileSize: (maxMB) => (files) => {
      if (!files || files.length === 0) return null;
      const maxBytes = maxMB * 1024 * 1024;
      for (let file of files) {
        if (file.size > maxBytes) {
          return `Arquivo muito grande. Máximo: ${maxMB}MB`;
        }
      }
      return null;
    }
  },

  validate(form, rules) {
    this.errors = {};

    Object.keys(rules).forEach(fieldName => {
      const field = form.elements[fieldName];
      if (!field) return;

      const fieldRules = rules[fieldName];
      const value = field.type === 'file' ? field.files : field.value;

      fieldRules.forEach(rule => {
        const error = rule(value);
        if (error) {
          this.errors[fieldName] = error;
        }
      });
    });

    return Object.keys(this.errors).length === 0;
  },

  getErrors() {
    return this.errors;
  },

  showErrors(form) {
    // Limpar erros anteriores
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    Object.keys(this.errors).forEach(fieldName => {
      const field = form.elements[fieldName];
      if (!field) return;

      // Marcar campo como erro
      field.style.borderColor = '#EF4444';
      field.style.background = '#FEE2E2';

      // Mostrar mensagem de erro
      const errorMsg = document.createElement('div');
      errorMsg.className = 'field-error';
      errorMsg.textContent = this.errors[fieldName];
      errorMsg.style.cssText = `
        color: #991B1B;
        font-size: 12px;
        margin-top: 4px;
        margin-bottom: 8px;
      `;

      field.parentNode.insertBefore(errorMsg, field.nextSibling);
    });
  }
};

// ============================================================================
// TABLE COMPONENT
// ============================================================================
/**
 * Tabela dinâmica com ações
 * Uso: new Table(containerId, columns, data, actions)
 */
class Table {
  constructor(containerId, columns, data, actions = []) {
    this.container = document.getElementById(containerId);
    this.columns = columns;
    this.data = data;
    this.actions = actions;
  }

  render() {
    if (!this.container) return;

    let html = '<div style="overflow-x: auto;">';
    html += `
      <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      ">
        <thead style="background: #F9F9F9; border-bottom: 2px solid #E8E8E8;">
          <tr>
    `;

    // Headers
    this.columns.forEach(col => {
      html += `
        <th style="
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #1A1A1A;
          font-size: 13px;
        ">${col.label}</th>
      `;
    });

    if (this.actions.length > 0) {
      html += `<th style="padding: 12px 16px; text-align: center; font-weight: 600; color: #1A1A1A;">Ações</th>`;
    }

    html += '</tr></thead><tbody>';

    // Rows
    if (this.data.length === 0) {
      html += `
        <tr>
          <td colspan="${this.columns.length + (this.actions.length > 0 ? 1 : 0)}"
              style="padding: 30px; text-align: center; color: #909090;">
            Nenhum dado disponível
          </td>
        </tr>
      `;
    } else {
      this.data.forEach((row, rowIdx) => {
        html += '<tr style="border-bottom: 1px solid #E8E8E8;">';

        this.columns.forEach(col => {
          const value = row[col.key];
          html += `
            <td style="
              padding: 12px 16px;
              color: ${col.key === 'title' ? '#1A1A1A' : '#4A4A4A'};
              font-weight: ${col.key === 'title' ? '500' : '400'};
            ">${col.render ? col.render(value, row) : value}</td>
          `;
        });

        if (this.actions.length > 0) {
          html += '<td style="padding: 12px 16px; text-align: center;">';
          this.actions.forEach(action => {
            html += `
              <button
                data-action="${action.name}"
                data-row="${rowIdx}"
                style="
                  background: ${action.color || '#F5C518'};
                  color: #1A1A1A;
                  border: none;
                  padding: 6px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  cursor: pointer;
                  margin-right: 4px;
                  transition: all 0.2s;
                "
              >${action.label}</button>
            `;
          });
          html += '</td>';
        }

        html += '</tr>';
      });
    }

    html += '</tbody></table></div>';

    this.container.innerHTML = html;

    // Event listeners para ações
    if (this.actions.length > 0) {
      this.container.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const actionName = e.target.dataset.action;
          const rowIdx = parseInt(e.target.dataset.row);
          const action = this.actions.find(a => a.name === actionName);
          action?.callback(this.data[rowIdx], rowIdx);
        });
      });
    }
  }

  update(data) {
    this.data = data;
    this.render();
  }
}

// ============================================================================
// CARD COMPONENT
// ============================================================================
/**
 * Card container
 * Uso: Card.create({title, content, actions: [{label, fn}]})
 */
const Card = {
  create(options) {
    const card = document.createElement('div');
    card.style.cssText = `
      background: white;
      border: 1px solid #E8E8E8;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.2s;
      cursor: ${options.onClick ? 'pointer' : 'default'};
    `;

    let html = '';
    if (options.title) {
      html += `<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1A1A1A;">${options.title}</h3>`;
    }

    if (options.content) {
      html += `<p style="margin: 0 0 12px 0; font-size: 14px; color: #4A4A4A; line-height: 1.5;">${options.content}</p>`;
    }

    if (options.actions && options.actions.length > 0) {
      html += '<div style="display: flex; gap: 8px;">';
      options.actions.forEach(action => {
        html += `
          <button
            data-action="${action.name}"
            style="
              background: ${action.color || '#F5C518'};
              color: #1A1A1A;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.2s;
            "
          >${action.label}</button>
        `;
      });
      html += '</div>';
    }

    card.innerHTML = html;

    // Event listeners
    if (options.onClick) {
      card.addEventListener('click', options.onClick);
    }

    if (options.actions) {
      card.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const actionName = e.target.dataset.action;
          const action = options.actions.find(a => a.name === actionName);
          action?.fn?.();
        });
      });
    }

    return card;
  }
};

// ============================================================================
// IMAGE PREVIEW
// ============================================================================
/**
 * Preview de imagens antes de upload
 * Uso: ImagePreview.show(files, containerId)
 */
const ImagePreview = {
  show(files, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const previewContainer = document.createElement('div');
    previewContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      margin-top: 10px;
    `;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.cssText = `
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          background: #F9F9F9;
          aspect-ratio: 1;
        `;

        imgWrapper.innerHTML = `
          <img src="${e.target.result}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          ">
          <button data-idx="${idx}" type="button" style="
            position: absolute;
            top: 4px;
            right: 4px;
            background: #EF4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">✕</button>
        `;

        previewContainer.appendChild(imgWrapper);
      };

      reader.readAsDataURL(file);
    });

    container.appendChild(previewContainer);
  }
};

// ============================================================================
// DRAG & DROP ZONE
// ============================================================================
/**
 * Zona de drag & drop para arquivos
 * Uso: new DragDropZone(fileInputId, onDrop)
 */
class DragDropZone {
  constructor(fileInputId, onDrop) {
    this.input = document.getElementById(fileInputId);
    this.onDrop = onDrop;
    this.init();
  }

  init() {
    if (!this.input) return;

    const zone = this.input.closest('.file-input-wrapper') || this.input.parentElement;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      zone.addEventListener(eventName, this.preventDefaults.bind(this), false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      zone.addEventListener(eventName, () => {
        zone.style.background = '#EEF5FF';
        zone.style.borderColor = '#F5C518';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      zone.addEventListener(eventName, () => {
        zone.style.background = '';
        zone.style.borderColor = '';
      });
    });

    zone.addEventListener('drop', this.handleDrop.bind(this), false);
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.input.files = files;
    this.onDrop?.(files);

    // Trigger change event
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

// ============================================================================
// TABS COMPONENT
// ============================================================================
/**
 * Sistema de abas
 * Uso: new Tabs(containerId, tabs)
 */
class Tabs {
  constructor(containerId, tabs) {
    this.container = document.getElementById(containerId);
    this.tabs = tabs;
    this.activeTab = 0;
  }

  render() {
    if (!this.container) return;

    let html = '<div style="border-bottom: 2px solid #E8E8E8; margin-bottom: 20px;">';
    html += '<div style="display: flex; gap: 0;">';

    this.tabs.forEach((tab, idx) => {
      const isActive = idx === this.activeTab;
      html += `
        <button
          data-tab="${idx}"
          style="
            padding: 12px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid ${isActive ? '#F5C518' : 'transparent'};
            color: ${isActive ? '#1A1A1A' : '#909090'};
            cursor: pointer;
            font-size: 14px;
            font-weight: ${isActive ? '600' : '400'};
            transition: all 0.2s;
          "
        >${tab.label}</button>
      `;
    });

    html += '</div></div>';

    // Content
    html += '<div>';
    this.tabs.forEach((tab, idx) => {
      html += `
        <div data-content="${idx}" style="display: ${idx === this.activeTab ? 'block' : 'none'};">
          ${tab.content}
        </div>
      `;
    });
    html += '</div>';

    this.container.innerHTML = html;

    // Event listeners
    this.container.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = parseInt(e.target.dataset.tab);
        this.render();
      });
    });
  }
}

// ============================================================================
// UTILITY: Adicionar estilos globais
// ============================================================================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(20px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ============================================================================
// EXPORT
// ============================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Toast,
    Modal,
    FormValidator,
    Table,
    Card,
    ImagePreview,
    DragDropZone,
    Tabs
  };
}
