/**
 * PDF Export Module
 * Handles resume export as PDF with customizable templates.
 * Provides a modal UI for template selection and preview before downloading.
 */

const PDFExport = (function () {
  'use strict';

  // ── Template Definitions ──────────────────────────────────────────────
  const TEMPLATES = {
    modern: {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design with accent colors and a bold header.',
      icon: '🎨',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      headerAlign: 'left',
      accentColor: '#007bff',
      borderStyle: 'left',
      sectionStyle: 'underline',
    },
    minimal: {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant layout with plenty of white space.',
      icon: '✨',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      headerAlign: 'left',
      accentColor: '#333333',
      borderStyle: 'none',
      sectionStyle: 'clean',
    },
    professional: {
      id: 'professional',
      name: 'Professional',
      description: 'Traditional and formal design ideal for corporate applications.',
      icon: '💼',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      headerAlign: 'center',
      accentColor: '#1a1a1a',
      borderStyle: 'full',
      sectionStyle: 'uppercase',
    },
    creative: {
      id: 'creative',
      name: 'Creative',
      description: 'Eye-catching design with colors and dynamic layout.',
      icon: '🚀',
      fontFamily: "'Poppins', 'Montserrat', sans-serif",
      headerAlign: 'left',
      accentColor: '#6c5ce7',
      borderStyle: 'top',
      sectionStyle: 'colored',
    },
  };

  let selectedTemplate = 'modern';
  let modalElement = null;

  // ── Modal Creation ────────────────────────────────────────────────────

  /**
   * Creates and injects the template-selection modal into the DOM.
   */
  function createModal() {
    if (document.getElementById('pdf-export-modal')) {
      modalElement = document.getElementById('pdf-export-modal');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'pdf-export-modal';
    modal.className = 'pdf-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Export Resume as PDF');

    modal.innerHTML = `
      <div class="pdf-modal-content">
        <div class="pdf-modal-header">
          <h2>Export Resume as PDF</h2>
          <button class="pdf-modal-close" aria-label="Close modal">&times;</button>
        </div>

        <div class="pdf-modal-body">
          <p class="pdf-modal-subtitle">Choose a template for your resume</p>

          <div class="pdf-template-grid" role="radiogroup" aria-label="Resume templates">
            ${Object.values(TEMPLATES)
              .map(
                (t) => `
              <button
                class="pdf-template-card${t.id === selectedTemplate ? ' selected' : ''}"
                data-template="${t.id}"
                role="radio"
                aria-checked="${t.id === selectedTemplate}"
                aria-label="${t.name} template"
              >
                <div class="pdf-template-preview template-thumb-${t.id}">
                  <div class="thumb-header" style="text-align:${t.headerAlign}">
                    <div class="thumb-name"></div>
                    <div class="thumb-contact"></div>
                  </div>
                  <div class="thumb-section">
                    <div class="thumb-heading"></div>
                    <div class="thumb-line"></div>
                    <div class="thumb-line short"></div>
                  </div>
                  <div class="thumb-section">
                    <div class="thumb-heading"></div>
                    <div class="thumb-line"></div>
                    <div class="thumb-line short"></div>
                    <div class="thumb-line"></div>
                  </div>
                </div>
                <div class="pdf-template-info">
                  <span class="pdf-template-icon">${t.icon}</span>
                  <strong>${t.name}</strong>
                  <span class="pdf-template-desc">${t.description}</span>
                </div>
                <div class="pdf-template-check" aria-hidden="true">✓</div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="pdf-modal-footer">
          <button class="pdf-btn-cancel" id="pdf-cancel-btn">Cancel</button>
          <button class="pdf-btn-export" id="pdf-export-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PDF
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modalElement = modal;
    bindModalEvents();
  }

  // ── Modal Events ──────────────────────────────────────────────────────

  function bindModalEvents() {
    // Close button
    const closeBtn = modalElement.querySelector('.pdf-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Cancel button
    const cancelBtn = document.getElementById('pdf-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeModal);
    }

    // Export button
    const exportBtn = document.getElementById('pdf-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', handleExport);
    }

    // Template cards
    const cards = modalElement.querySelectorAll('.pdf-template-card');
    cards.forEach((card) => {
      card.addEventListener('click', function () {
        selectTemplate(this.dataset.template);
      });
    });

    // Backdrop click
    modalElement.addEventListener('click', function (e) {
      if (e.target === modalElement) {
        closeModal();
      }
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalElement && modalElement.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /**
   * Selects a template and updates the UI.
   * @param {string} templateId
   */
  function selectTemplate(templateId) {
    if (!TEMPLATES[templateId]) return;
    selectedTemplate = templateId;

    const cards = modalElement.querySelectorAll('.pdf-template-card');
    cards.forEach((card) => {
      const isSelected = card.dataset.template === templateId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected.toString());
    });
  }

  // ── Open / Close ──────────────────────────────────────────────────────

  function openModal() {
    createModal();
    modalElement.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus the export button for accessibility
    setTimeout(() => {
      const exportBtn = document.getElementById('pdf-export-btn');
      if (exportBtn) exportBtn.focus();
    }, 200);
  }

  function closeModal() {
    if (modalElement) {
      modalElement.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── PDF Generation ────────────────────────────────────────────────────

  /**
   * Collects resume data from the form fields.
   * @returns {Object}
   */
  function collectResumeData() {
    const byId = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    // Collect skills
    const skillElements = document.querySelectorAll('#skills-list .skill-tag');
    const skills = Array.from(skillElements).map((el) => el.textContent.trim());

    return {
      name: byId('name'),
      email: byId('email'),
      phone: byId('phone'),
      location: byId('location'),
      linkedin: byId('linkedin'),
      summary: byId('summary'),
      degree: byId('degree'),
      institution: byId('institution'),
      year: byId('year'),
      cgpa: byId('cgpa'),
      skills: skills,
      expTitle: byId('exp-title'),
      expOrg: byId('exp-org'),
      expDuration: byId('exp-duration'),
      expDesc: byId('exp-desc'),
      achievements: byId('achievements'),
    };
  }

  /**
   * Builds an HTML string for the chosen template.
   * @param {Object} data
   * @param {Object} template
   * @returns {string}
   */
  function buildTemplateHTML(data, template) {
    const t = template;
    const skillsHTML = data.skills.length
      ? data.skills
          .map(
            (s) =>
              `<span style="display:inline-block;background:${t.accentColor}15;color:${t.accentColor};padding:3px 10px;border-radius:12px;font-size:11px;margin:2px 4px 2px 0;font-weight:500;">${s}</span>`
          )
          .join('')
      : '';

    const educationText = [
      data.degree,
      data.institution ? `from ${data.institution}` : '',
      data.year ? `(${data.year})` : '',
      data.cgpa ? `— CGPA: ${data.cgpa}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const experienceHTML = data.expTitle
      ? `<p style="margin:4px 0 2px 0;"><strong style="color:${t.accentColor};">${data.expTitle}</strong>${data.expOrg ? ` at ${data.expOrg}` : ''}</p>
         ${data.expDuration ? `<p style="margin:0 0 2px 0;font-size:12px;color:#888;">${data.expDuration}</p>` : ''}
         ${data.expDesc ? `<p style="margin:0;font-size:13px;line-height:1.5;">${data.expDesc}</p>` : ''}`
      : '<p style="color:#999;font-style:italic;">No experience listed</p>';

    // Section heading helper
    const sectionHeading = (title) => {
      if (t.sectionStyle === 'uppercase') {
        return `<h2 style="font-family:${t.fontFamily};font-size:13px;text-transform:uppercase;letter-spacing:2px;color:${t.accentColor};margin:18px 0 6px 0;padding-bottom:4px;border-bottom:1px solid ${t.accentColor};">${title}</h2>`;
      }
      if (t.sectionStyle === 'colored') {
        return `<h2 style="font-family:${t.fontFamily};font-size:14px;color:#fff;background:${t.accentColor};display:inline-block;padding:3px 14px;border-radius:4px;margin:18px 0 8px 0;">${title}</h2>`;
      }
      if (t.sectionStyle === 'clean') {
        return `<h2 style="font-family:${t.fontFamily};font-size:14px;color:${t.accentColor};margin:18px 0 6px 0;font-weight:400;">${title}</h2>`;
      }
      // default: underline
      return `<h2 style="font-family:${t.fontFamily};font-size:14px;color:${t.accentColor};margin:18px 0 6px 0;padding-bottom:4px;border-bottom:2px solid ${t.accentColor};">${title}</h2>`;
    };

    // Header
    let headerHTML = '';
    if (t.id === 'creative') {
      headerHTML = `
        <div style="background:linear-gradient(135deg,${t.accentColor},${t.accentColor}cc);padding:24px 28px;color:#fff;border-radius:6px 6px 0 0;">
          <h1 style="font-family:${t.fontFamily};font-size:26px;margin:0 0 6px 0;color:#fff;font-weight:700;">${data.name || 'Your Name'}</h1>
          <p style="font-size:12px;margin:0;opacity:0.9;color:#fff;">${[data.email, data.phone, data.location].filter(Boolean).join(' &nbsp;•&nbsp; ')}</p>
          ${data.linkedin ? `<p style="font-size:12px;margin:4px 0 0;opacity:0.85;color:#fff;">${data.linkedin}</p>` : ''}
        </div>`;
    } else if (t.id === 'professional') {
      headerHTML = `
        <div style="text-align:center;padding-bottom:14px;border-bottom:2px solid ${t.accentColor};margin-bottom:14px;">
          <h1 style="font-family:${t.fontFamily};font-size:26px;margin:0 0 6px 0;color:${t.accentColor};font-weight:700;">${data.name || 'Your Name'}</h1>
          <p style="font-size:12px;color:#666;font-style:italic;">${[data.email, data.phone, data.location].filter(Boolean).join(' | ')}</p>
          ${data.linkedin ? `<p style="font-size:12px;color:#666;margin-top:2px;">${data.linkedin}</p>` : ''}
        </div>`;
    } else if (t.id === 'minimal') {
      headerHTML = `
        <div style="margin-bottom:14px;">
          <h1 style="font-family:${t.fontFamily};font-size:28px;margin:0 0 4px 0;color:${t.accentColor};font-weight:300;">${data.name || 'Your Name'}</h1>
          <p style="font-size:11px;color:#888;margin:0;">${[data.email, data.phone, data.location].filter(Boolean).join(' · ')}</p>
          ${data.linkedin ? `<p style="font-size:11px;color:#888;margin:2px 0 0;">${data.linkedin}</p>` : ''}
        </div>`;
    } else {
      // modern
      headerHTML = `
        <div style="padding-bottom:14px;border-bottom:2px solid ${t.accentColor};margin-bottom:14px;">
          <h1 style="font-family:${t.fontFamily};font-size:26px;margin:0 0 6px 0;color:${t.accentColor};font-weight:700;">${data.name || 'Your Name'}</h1>
          <p style="font-size:12px;color:#666;margin:0;">${[data.email, data.phone, data.location].filter(Boolean).join(' &nbsp;|&nbsp; ')}</p>
          ${data.linkedin ? `<p style="font-size:12px;color:#666;margin:2px 0 0;">${data.linkedin}</p>` : ''}
        </div>`;
    }

    // Border
    let borderCSS = '';
    if (t.borderStyle === 'left') borderCSS = `border-left:4px solid ${t.accentColor};`;
    else if (t.borderStyle === 'full') borderCSS = `border:1px solid #ccc;`;
    else if (t.borderStyle === 'top') borderCSS = `border-top:4px solid ${t.accentColor};`;

    const bodyPadding = t.id === 'creative' ? '0' : '28px';
    const innerPadding = t.id === 'creative' ? '20px 28px 28px' : '0';

    return `
      <div style="font-family:${t.fontFamily};max-width:700px;margin:0 auto;background:#fff;color:#333;padding:${bodyPadding};${borderCSS};font-size:13px;line-height:1.6;">
        ${headerHTML}
        <div style="padding:${innerPadding};">
          ${data.summary ? `${sectionHeading('Professional Summary')}<p style="margin:0;font-size:13px;line-height:1.6;">${data.summary}</p>` : ''}
          ${educationText ? `${sectionHeading('Education')}<p style="margin:0;font-size:13px;">${educationText}</p>` : ''}
          ${data.skills.length ? `${sectionHeading('Skills')}<div style="margin-top:4px;">${skillsHTML}</div>` : ''}
          ${sectionHeading('Experience / Projects')}${experienceHTML}
          ${data.achievements ? `${sectionHeading('Achievements / Certifications')}<p style="margin:0;font-size:13px;line-height:1.6;">${data.achievements}</p>` : ''}
        </div>
      </div>`;
  }

  /**
   * Handles the Export button click.
   */
  function handleExport() {
    const data = collectResumeData();

    if (!data.name) {
      if (typeof ValidationUI !== 'undefined' && ValidationUI.showToast) {
        ValidationUI.showToast('Please enter your name before exporting.', 'error');
      }
      closeModal();
      const nameField = document.getElementById('name');
      if (nameField) nameField.focus();
      return;
    }

    const template = TEMPLATES[selectedTemplate];
    if (!template) return;

    // Show loading state
    const exportBtn = document.getElementById('pdf-export-btn');
    if (exportBtn) {
      exportBtn.disabled = true;
      exportBtn.innerHTML = `
        <svg class="pdf-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>
        Generating…`;
    }

    const htmlContent = buildTemplateHTML(data, template);

    // Create a temporary container
    const container = document.createElement('div');
    container.id = 'pdf-export-container';
    container.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const userName = data.name.replace(/\s+/g, '_');
    const filename = `${userName}_Resume_${template.name}.pdf`;

    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true,
      },
    };

    // Check for html2pdf availability
    if (typeof html2pdf === 'undefined') {
      if (typeof ValidationUI !== 'undefined' && ValidationUI.showToast) {
        ValidationUI.showToast('PDF library not loaded. Please refresh and try again.', 'error');
      }
      cleanup(container, exportBtn);
      return;
    }

    html2pdf()
      .set(opt)
      .from(container)
      .save()
      .then(() => {
        if (typeof ValidationUI !== 'undefined' && ValidationUI.showToast) {
          ValidationUI.showToast('Resume exported successfully!', 'success');
        }
        cleanup(container, exportBtn);
        closeModal();
      })
      .catch((error) => {
        console.error('PDF generation error:', error);
        if (typeof ValidationUI !== 'undefined' && ValidationUI.showToast) {
          ValidationUI.showToast('Error generating PDF. Please try again.', 'error');
        }
        cleanup(container, exportBtn);
      });
  }

  /**
   * Clean up temporary elements and restore button state.
   */
  function cleanup(container, exportBtn) {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export PDF`;
    }
  }

  // ── Public API ────────────────────────────────────────────────────────

  return {
    /** Opens the template-selection modal. */
    open: openModal,
    /** Closes the modal. */
    close: closeModal,
    /** Returns the list of available templates. */
    getTemplates: function () {
      return Object.assign({}, TEMPLATES);
    },
    /** Returns the currently selected template id. */
    getSelectedTemplate: function () {
      return selectedTemplate;
    },
    /** Selects a template by id. */
    setTemplate: function (id) {
      if (TEMPLATES[id]) selectedTemplate = id;
    },
    /** Collects resume data from the form. */
    collectResumeData: collectResumeData,
    /** Builds HTML for a template. */
    buildTemplateHTML: buildTemplateHTML,
    /** Direct export (no modal). */
    exportDirectly: handleExport,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.PDFExport = PDFExport;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFExport;
}
