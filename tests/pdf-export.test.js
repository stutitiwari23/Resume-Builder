/**
 * Tests for PDF Export Module (pdf-export.js)
 * Covers template definitions, data collection, HTML generation, and modal behaviour.
 */

// ─── Setup DOM & mocks ──────────────────────────────────────────────
beforeEach(() => {
  // Reset module cache so each test gets a fresh PDFExport
  jest.resetModules();

  // Minimal DOM expected by the module
  document.body.innerHTML = `
    <form id="resume-form">
      <input id="name" value="Jane Doe" />
      <input id="email" value="jane@example.com" />
      <input id="phone" value="+1 555-1234" />
      <input id="location" value="New York, NY" />
      <input id="linkedin" value="linkedin.com/in/janedoe" />
      <textarea id="summary">Experienced engineer.</textarea>
      <input id="degree" value="B.S. Computer Science" />
      <input id="institution" value="MIT" />
      <input id="year" value="2022" />
      <input id="cgpa" value="3.9" />
      <input id="exp-title" value="Software Engineer" />
      <input id="exp-org" value="Acme Corp" />
      <input id="exp-duration" value="2022 – Present" />
      <textarea id="exp-desc">Built web apps.</textarea>
      <textarea id="achievements">AWS Certified</textarea>
      <div id="skills-list">
        <span class="skill-tag">JavaScript</span>
        <span class="skill-tag">React</span>
      </div>
    </form>
  `;

  // Provide a no-op ValidationUI globally
  global.ValidationUI = {
    showToast: jest.fn(),
    showError: jest.fn(),
    clearError: jest.fn(),
  };
});

afterEach(() => {
  document.body.innerHTML = '';
  delete global.ValidationUI;
});

// Helper – load module fresh
function loadPDFExport() {
  return require('../pdf-export.js');
}

// ─── Template definitions ───────────────────────────────────────────
describe('PDFExport.getTemplates()', () => {
  test('returns all four templates', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();

    expect(Object.keys(templates)).toEqual(
      expect.arrayContaining(['modern', 'minimal', 'professional', 'creative'])
    );
    expect(Object.keys(templates)).toHaveLength(4);
  });

  test('each template has required properties', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();

    const requiredKeys = [
      'id', 'name', 'description', 'icon',
      'fontFamily', 'headerAlign', 'accentColor',
      'borderStyle', 'sectionStyle',
    ];

    Object.values(templates).forEach((t) => {
      requiredKeys.forEach((key) => {
        expect(t).toHaveProperty(key);
        expect(t[key]).toBeTruthy();
      });
    });
  });
});

// ─── Template selection ─────────────────────────────────────────────
describe('PDFExport template selection', () => {
  test('default selected template is modern', () => {
    const PDFExport = loadPDFExport();
    expect(PDFExport.getSelectedTemplate()).toBe('modern');
  });

  test('setTemplate changes the selected template', () => {
    const PDFExport = loadPDFExport();
    PDFExport.setTemplate('creative');
    expect(PDFExport.getSelectedTemplate()).toBe('creative');
  });

  test('setTemplate ignores invalid template ids', () => {
    const PDFExport = loadPDFExport();
    PDFExport.setTemplate('nonexistent');
    expect(PDFExport.getSelectedTemplate()).toBe('modern');
  });
});

// ─── Data collection ────────────────────────────────────────────────
describe('PDFExport.collectResumeData()', () => {
  test('collects all form field values', () => {
    const PDFExport = loadPDFExport();
    const data = PDFExport.collectResumeData();

    expect(data.name).toBe('Jane Doe');
    expect(data.email).toBe('jane@example.com');
    expect(data.phone).toBe('+1 555-1234');
    expect(data.location).toBe('New York, NY');
    expect(data.linkedin).toBe('linkedin.com/in/janedoe');
    expect(data.summary).toBe('Experienced engineer.');
    expect(data.degree).toBe('B.S. Computer Science');
    expect(data.institution).toBe('MIT');
    expect(data.year).toBe('2022');
    expect(data.cgpa).toBe('3.9');
    expect(data.expTitle).toBe('Software Engineer');
    expect(data.expOrg).toBe('Acme Corp');
    expect(data.expDuration).toBe('2022 – Present');
    expect(data.expDesc).toBe('Built web apps.');
    expect(data.achievements).toBe('AWS Certified');
  });

  test('collects skills from skill tags', () => {
    const PDFExport = loadPDFExport();
    const data = PDFExport.collectResumeData();

    expect(data.skills).toEqual(['JavaScript', 'React']);
  });

  test('returns empty strings for missing fields', () => {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';

    const PDFExport = loadPDFExport();
    const data = PDFExport.collectResumeData();

    expect(data.name).toBe('');
    expect(data.email).toBe('');
  });

  test('returns empty skills array when no skills', () => {
    document.getElementById('skills-list').innerHTML = '';

    const PDFExport = loadPDFExport();
    const data = PDFExport.collectResumeData();

    expect(data.skills).toEqual([]);
  });
});

// ─── HTML template generation ───────────────────────────────────────
describe('PDFExport.buildTemplateHTML()', () => {
  const sampleData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555-1234',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/janedoe',
    summary: 'Experienced engineer.',
    degree: 'B.S. Computer Science',
    institution: 'MIT',
    year: '2022',
    cgpa: '3.9',
    skills: ['JavaScript', 'React'],
    expTitle: 'Software Engineer',
    expOrg: 'Acme Corp',
    expDuration: '2022 – Present',
    expDesc: 'Built web apps.',
    achievements: 'AWS Certified',
  };

  test('generates HTML containing the user name for each template', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();

    Object.values(templates).forEach((template) => {
      const html = PDFExport.buildTemplateHTML(sampleData, template);
      expect(html).toContain('Jane Doe');
    });
  });

  test('modern template includes left border accent', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const html = PDFExport.buildTemplateHTML(sampleData, templates.modern);

    expect(html).toContain('border-left:4px solid');
  });

  test('professional template has centered header', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const html = PDFExport.buildTemplateHTML(sampleData, templates.professional);

    expect(html).toContain('text-align:center');
    expect(html).toContain('text-transform:uppercase');
  });

  test('creative template uses gradient header', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const html = PDFExport.buildTemplateHTML(sampleData, templates.creative);

    expect(html).toContain('linear-gradient');
    expect(html).toContain('#6c5ce7');
  });

  test('minimal template has lightweight heading style', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const html = PDFExport.buildTemplateHTML(sampleData, templates.minimal);

    expect(html).toContain('font-weight:300');
    expect(html).toContain('font-weight:400');
  });

  test('includes all resume sections', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const html = PDFExport.buildTemplateHTML(sampleData, templates.modern);

    expect(html).toContain('Professional Summary');
    expect(html).toContain('Education');
    expect(html).toContain('Skills');
    expect(html).toContain('Experience / Projects');
    expect(html).toContain('Achievements / Certifications');
  });

  test('skills are rendered as styled spans', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const html = PDFExport.buildTemplateHTML(sampleData, templates.modern);

    expect(html).toContain('JavaScript');
    expect(html).toContain('React');
    expect(html).toContain('border-radius:12px');
  });

  test('handles data with no skills gracefully', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const noSkillsData = { ...sampleData, skills: [] };
    const html = PDFExport.buildTemplateHTML(noSkillsData, templates.modern);

    // Should still produce valid HTML without crashing
    expect(html).toContain('Jane Doe');
    // Skills section heading should not appear
    expect(html).not.toContain('>Skills<');
  });

  test('handles data with no experience gracefully', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const noExpData = { ...sampleData, expTitle: '', expOrg: '', expDuration: '', expDesc: '' };
    const html = PDFExport.buildTemplateHTML(noExpData, templates.modern);

    expect(html).toContain('No experience listed');
  });

  test('fallback name when name is empty', () => {
    const PDFExport = loadPDFExport();
    const templates = PDFExport.getTemplates();
    const noNameData = { ...sampleData, name: '' };
    const html = PDFExport.buildTemplateHTML(noNameData, templates.modern);

    expect(html).toContain('Your Name');
  });
});

// ─── Modal lifecycle ────────────────────────────────────────────────
describe('PDFExport modal', () => {
  test('open() creates modal element in DOM', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const modal = document.getElementById('pdf-export-modal');
    expect(modal).not.toBeNull();
    expect(modal.classList.contains('open')).toBe(true);
  });

  test('close() hides the modal', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();
    PDFExport.close();

    const modal = document.getElementById('pdf-export-modal');
    expect(modal.classList.contains('open')).toBe(false);
  });

  test('modal contains all four template cards', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const cards = document.querySelectorAll('.pdf-template-card');
    expect(cards.length).toBe(4);

    const templateIds = Array.from(cards).map((c) => c.dataset.template);
    expect(templateIds).toEqual(
      expect.arrayContaining(['modern', 'minimal', 'professional', 'creative'])
    );
  });

  test('clicking a template card selects it', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const creativeCard = document.querySelector('[data-template="creative"]');
    creativeCard.click();

    expect(PDFExport.getSelectedTemplate()).toBe('creative');
    expect(creativeCard.classList.contains('selected')).toBe(true);
    expect(creativeCard.getAttribute('aria-checked')).toBe('true');
  });

  test('only one template card is selected at a time', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const cards = document.querySelectorAll('.pdf-template-card');
    const professionalCard = document.querySelector('[data-template="professional"]');
    professionalCard.click();

    const selectedCards = document.querySelectorAll('.pdf-template-card.selected');
    expect(selectedCards.length).toBe(1);
    expect(selectedCards[0].dataset.template).toBe('professional');
  });

  test('cancel button closes the modal', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const cancelBtn = document.getElementById('pdf-cancel-btn');
    cancelBtn.click();

    const modal = document.getElementById('pdf-export-modal');
    expect(modal.classList.contains('open')).toBe(false);
  });

  test('close button closes the modal', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const closeBtn = document.querySelector('.pdf-modal-close');
    closeBtn.click();

    const modal = document.getElementById('pdf-export-modal');
    expect(modal.classList.contains('open')).toBe(false);
  });

  test('modal has proper ARIA attributes', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const modal = document.getElementById('pdf-export-modal');
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(modal.getAttribute('aria-label')).toBe('Export Resume as PDF');
  });

  test('template cards have radio role and aria-checked', () => {
    const PDFExport = loadPDFExport();
    PDFExport.open();

    const cards = document.querySelectorAll('.pdf-template-card');
    cards.forEach((card) => {
      expect(card.getAttribute('role')).toBe('radio');
      expect(['true', 'false']).toContain(card.getAttribute('aria-checked'));
    });
  });
});

// ─── Export validation ──────────────────────────────────────────────
describe('PDFExport.exportDirectly() validation', () => {
  test('shows error toast when name is empty', () => {
    document.getElementById('name').value = '';
    const PDFExport = loadPDFExport();

    PDFExport.exportDirectly();

    expect(global.ValidationUI.showToast).toHaveBeenCalledWith(
      expect.stringContaining('name'),
      'error'
    );
  });

  test('shows error when html2pdf is not available', () => {
    // html2pdf is not defined in test env
    const PDFExport = loadPDFExport();
    PDFExport.exportDirectly();

    expect(global.ValidationUI.showToast).toHaveBeenCalledWith(
      expect.stringContaining('PDF library'),
      'error'
    );
  });
});
