// template-manager.js - 模板管理器，负责管理简历模板的渲染和切换

/**
 * 模板接口定义
 * 每个模板必须实现这些方法
 */
const TemplateInterface = {
    /**
     * 获取模板名称
     * @returns {string} 模板名称
     */
    getName: function() {
        throw new Error('getName() must be implemented');
    },

    /**
     * 获取模板描述
     * @returns {string} 模板描述
     */
    getDescription: function() {
        throw new Error('getDescription() must be implemented');
    },

    /**
     * 获取模板字段定义
     * @returns {Object} 字段定义对象
     */
    getFieldDefinitions: function() {
        throw new Error('getFieldDefinitions() must be implemented');
    },

    /**
     * 渲染模板
     * @param {Object} data - 简历数据
     * @param {HTMLElement} container - 渲染容器
     */
    render: function(data, container) {
        throw new Error('render() must be implemented');
    },

    /**
     * 获取模板CSS类名
     * @returns {string} CSS类名
     */
    getCssClass: function() {
        throw new Error('getCssClass() must be implemented');
    }
};

/**
 * 基础模板类，实现通用功能
 */
class BaseTemplate {
    constructor() {
        this.fieldDefinitions = {
            personal: {
                name: { label: '姓名', required: true, type: 'text' },
                email: { label: '邮箱', required: true, type: 'email' },
                phone: { label: '电话', required: false, type: 'tel' },
                location: { label: '所在地', required: false, type: 'text' },
                linkedin: { label: 'LinkedIn/作品集', required: false, type: 'url' }
            },
            summary: {
                summary: { label: '职业概述', required: false, type: 'textarea' }
            },
            education: {
                degree: { label: '学位', required: false, type: 'text' },
                institution: { label: '院校', required: false, type: 'text' },
                year: { label: '年份', required: false, type: 'number' },
                cgpa: { label: 'GPA', required: false, type: 'text' }
            },
            skills: {
                skills: { label: '技能', required: false, type: 'array' }
            },
            experience: {
                expTitle: { label: '职位名称', required: false, type: 'text' },
                expOrg: { label: '公司/组织', required: false, type: 'text' },
                expDuration: { label: '工作时间', required: false, type: 'text' },
                expDesc: { label: '工作描述', required: false, type: 'textarea' }
            },
            achievements: {
                achievements: { label: '成就/证书', required: false, type: 'textarea' }
            }
        };
    }

    getFieldDefinitions() {
        return this.fieldDefinitions;
    }

    /**
     * 安全转义HTML
     * @param {string} text - 需要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 格式化联系信息
     * @param {Object} data - 个人数据
     * @returns {string} HTML字符串
     */
    formatContactInfo(data) {
        const parts = [];
        if (data.email) parts.push(`<span class="contact-email">${this.escapeHtml(data.email)}</span>`);
        if (data.phone) parts.push(`<span class="contact-phone">${this.escapeHtml(data.phone)}</span>`);
        if (data.location) parts.push(`<span class="contact-location">${this.escapeHtml(data.location)}</span>`);
        if (data.linkedin) parts.push(`<span class="contact-linkedin">${this.escapeHtml(data.linkedin)}</span>`);
        
        return parts.join(' | ');
    }

    /**
     * 格式化教育信息
     * @param {Object} data - 教育数据
     * @returns {string} HTML字符串
     */
    formatEducation(data) {
        const parts = [];
        if (data.degree) parts.push(this.escapeHtml(data.degree));
        if (data.institution) parts.push(`from ${this.escapeHtml(data.institution)}`);
        if (data.year) parts.push(this.escapeHtml(data.year));
        if (data.cgpa) parts.push(`(GPA: ${this.escapeHtml(data.cgpa)})`);
        
        return parts.join(' ');
    }

    /**
     * 格式化技能列表
     * @param {Array} skills - 技能数组
     * @returns {string} HTML字符串
     */
    formatSkills(skills) {
        if (!skills || skills.length === 0) return '';
        return skills.map(skill => `<span class="skill-item">${this.escapeHtml(skill)}</span>`).join('');
    }

    /**
     * 格式化工作经验
     * @param {Object} data - 经验数据
     * @returns {string} HTML字符串
     */
    formatExperience(data) {
        const parts = [];
        if (data.expTitle) parts.push(`<strong>${this.escapeHtml(data.expTitle)}</strong>`);
        if (data.expOrg) parts.push(`at ${this.escapeHtml(data.expOrg)}`);
        if (data.expDuration) parts.push(`<br>${this.escapeHtml(data.expDuration)}`);
        if (data.expDesc) parts.push(`<br>${this.escapeHtml(data.expDesc)}`);
        
        return parts.join(' ');
    }
}

/**
 * 现代风格模板
 */
class ModernTemplate extends BaseTemplate {
    constructor() {
        super();
        this.name = 'modern';
        this.displayName = '现代风格';
        this.description = '简洁现代的设计风格，适合技术岗位申请';
        this.cssClass = 'template-modern';
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getCssClass() {
        return this.cssClass;
    }

    render(data, container) {
        if (!container) return;

        const html = `
            <header class="preview-header">
                <h1 id="preview-name">${this.escapeHtml(data.name) || 'Your Name'}</h1>
                <div class="preview-contact">
                    ${this.formatContactInfo(data)}
                </div>
            </header>

            ${data.summary ? `
            <section class="preview-section-block" data-section="summary" draggable="true">
                <h2>Professional Summary</h2>
                <p id="preview-summary">${this.escapeHtml(data.summary)}</p>
            </section>
            ` : ''}

            ${(data.degree || data.institution) ? `
            <section class="preview-section-block" data-section="education" draggable="true">
                <h2>Education</h2>
                <p id="preview-education">${this.formatEducation(data)}</p>
            </section>
            ` : ''}

            ${(data.skills && data.skills.length > 0) ? `
            <section class="preview-section-block" data-section="skills" draggable="true">
                <h2>Skills</h2>
                <div id="preview-skills">${this.formatSkills(data.skills)}</div>
            </section>
            ` : ''}

            ${(data.expTitle || data.expOrg) ? `
            <section class="preview-section-block" data-section="experience" draggable="true">
                <h2>Experience / Projects</h2>
                <div id="preview-experience">${this.formatExperience(data)}</div>
            </section>
            ` : ''}

            ${data.achievements ? `
            <section class="preview-section-block" data-section="achievements" draggable="true">
                <h2>Achievements / Certifications</h2>
                <p id="preview-achievements">${this.escapeHtml(data.achievements)}</p>
            </section>
            ` : ''}
        `;

        container.innerHTML = html;
        container.className = this.cssClass;
    }
}

/**
 * 传统风格模板
 */
class ClassicTemplate extends BaseTemplate {
    constructor() {
        super();
        this.name = 'classic';
        this.displayName = '传统风格';
        this.description = '正式专业的设计风格，适合传统行业申请';
        this.cssClass = 'template-classic';
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getCssClass() {
        return this.cssClass;
    }

    render(data, container) {
        if (!container) return;

        const html = `
            <header class="preview-header">
                <h1 id="preview-name">${this.escapeHtml(data.name) || 'Your Name'}</h1>
                <div class="preview-contact">
                    ${this.formatContactInfo(data)}
                </div>
            </header>

            ${data.summary ? `
            <section class="preview-section-block" data-section="summary" draggable="true">
                <h2>Professional Summary</h2>
                <p id="preview-summary">${this.escapeHtml(data.summary)}</p>
            </section>
            ` : ''}

            ${(data.degree || data.institution) ? `
            <section class="preview-section-block" data-section="education" draggable="true">
                <h2>Education</h2>
                <p id="preview-education">${this.formatEducation(data)}</p>
            </section>
            ` : ''}

            ${(data.skills && data.skills.length > 0) ? `
            <section class="preview-section-block" data-section="skills" draggable="true">
                <h2>Skills</h2>
                <div id="preview-skills">${this.formatSkills(data.skills)}</div>
            </section>
            ` : ''}

            ${(data.expTitle || data.expOrg) ? `
            <section class="preview-section-block" data-section="experience" draggable="true">
                <h2>Experience / Projects</h2>
                <div id="preview-experience">${this.formatExperience(data)}</div>
            </section>
            ` : ''}

            ${data.achievements ? `
            <section class="preview-section-block" data-section="achievements" draggable="true">
                <h2>Achievements / Certifications</h2>
                <p id="preview-achievements">${this.escapeHtml(data.achievements)}</p>
            </section>
            ` : ''}
        `;

        container.innerHTML = html;
        container.className = this.cssClass;
    }
}

/**
 * 简约风格模板
 */
class MinimalTemplate extends BaseTemplate {
    constructor() {
        super();
        this.name = 'minimal';
        this.displayName = '简约风格';
        this.description = '极简设计风格，突出内容本身';
        this.cssClass = 'template-minimal';
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getCssClass() {
        return this.cssClass;
    }

    render(data, container) {
        if (!container) return;

        const html = `
            <header class="preview-header">
                <h1 id="preview-name">${this.escapeHtml(data.name) || 'Your Name'}</h1>
                <div class="preview-contact">
                    ${this.formatContactInfo(data)}
                </div>
            </header>

            ${data.summary ? `
            <section class="preview-section-block" data-section="summary" draggable="true">
                <h2>Professional Summary</h2>
                <p id="preview-summary">${this.escapeHtml(data.summary)}</p>
            </section>
            ` : ''}

            ${(data.degree || data.institution) ? `
            <section class="preview-section-block" data-section="education" draggable="true">
                <h2>Education</h2>
                <p id="preview-education">${this.formatEducation(data)}</p>
            </section>
            ` : ''}

            ${(data.skills && data.skills.length > 0) ? `
            <section class="preview-section-block" data-section="skills" draggable="true">
                <h2>Skills</h2>
                <div id="preview-skills">${this.formatSkills(data.skills)}</div>
            </section>
            ` : ''}

            ${(data.expTitle || data.expOrg) ? `
            <section class="preview-section-block" data-section="experience" draggable="true">
                <h2>Experience / Projects</h2>
                <div id="preview-experience">${this.formatExperience(data)}</div>
            </section>
            ` : ''}

            ${data.achievements ? `
            <section class="preview-section-block" data-section="achievements" draggable="true">
                <h2>Achievements / Certifications</h2>
                <p id="preview-achievements">${this.escapeHtml(data.achievements)}</p>
            </section>
            ` : ''}
        `;

        container.innerHTML = html;
        container.className = this.cssClass;
    }
}

/**
 * 模板管理器单例
 */
const TemplateManager = (function() {
    let instance = null;

    function createInstance() {
        const templates = {};
        let currentTemplateName = 'modern';

        // 注册默认模板
        function registerDefaultTemplates() {
            registerTemplate(new ModernTemplate());
            registerTemplate(new ClassicTemplate());
            registerTemplate(new MinimalTemplate());
        }

        /**
         * 注册模板
         * @param {Object} template - 模板实例
         */
        function registerTemplate(template) {
            if (template && template.getName && template.render) {
                templates[template.getName()] = template;
            }
        }

        /**
         * 获取所有已注册的模板
         * @returns {Object} 模板对象
         */
        function getAllTemplates() {
            return { ...templates };
        }

        /**
         * 获取模板列表信息（用于UI显示）
         * @returns {Array} 模板信息数组
         */
        function getTemplateList() {
            return Object.values(templates).map(template => ({
                name: template.getName(),
                displayName: template.displayName || template.getName(),
                description: template.getDescription(),
                cssClass: template.getCssClass()
            }));
        }

        /**
         * 获取指定模板
         * @param {string} name - 模板名称
         * @returns {Object|null} 模板实例
         */
        function getTemplate(name) {
            return templates[name] || null;
        }

        /**
         * 设置当前模板
         * @param {string} name - 模板名称
         */
        function setCurrentTemplate(name) {
            if (templates[name]) {
                currentTemplateName = name;
                // 保存到localStorage
                localStorage.setItem('currentTemplate', name);
            }
        }

        /**
         * 获取当前模板
         * @returns {Object} 当前模板实例
         */
        function getCurrentTemplate() {
            // 优先从localStorage读取
            const savedTemplate = localStorage.getItem('currentTemplate');
            if (savedTemplate && templates[savedTemplate]) {
                currentTemplateName = savedTemplate;
            }
            return templates[currentTemplateName];
        }

        /**
         * 使用当前模板渲染
         * @param {Object} data - 简历数据
         * @param {HTMLElement} container - 渲染容器
         */
        function renderCurrent(data, container) {
            const template = getCurrentTemplate();
            if (template && container) {
                template.render(data, container);
            }
        }

        /**
         * 切换模板并重新渲染
         * @param {string} templateName - 目标模板名称
         * @param {Object} data - 简历数据
         * @param {HTMLElement} container - 渲染容器
         */
        function switchTemplate(templateName, data, container) {
            if (templates[templateName]) {
                setCurrentTemplate(templateName);
                renderCurrent(data, container);
                return true;
            }
            return false;
        }

        /**
         * 获取字段定义（统一的字段映射，确保跨模板兼容）
         * @returns {Object} 字段定义
         */
        function getFieldDefinitions() {
            // 所有模板使用相同的字段定义，确保数据兼容性
            const baseTemplate = new BaseTemplate();
            return baseTemplate.getFieldDefinitions();
        }

        /**
         * 从表单收集数据（统一的数据收集方法）
         * @param {HTMLFormElement} form - 表单元素
         * @param {Array} skills - 技能数组
         * @returns {Object} 简历数据对象
         */
        function collectFormData(form, skills = []) {
            const getValue = (id) => {
                const el = form.querySelector(`#${id}`);
                return el ? el.value.trim() : '';
            };

            return {
                name: getValue('name'),
                email: getValue('email'),
                phone: getValue('phone'),
                location: getValue('location'),
                linkedin: getValue('linkedin'),
                summary: getValue('summary'),
                degree: getValue('degree'),
                institution: getValue('institution'),
                year: getValue('year'),
                cgpa: getValue('cgpa'),
                skills: skills.slice(),
                expTitle: getValue('exp-title'),
                expOrg: getValue('exp-org'),
                expDuration: getValue('exp-duration'),
                expDesc: getValue('exp-desc'),
                achievements: getValue('achievements')
            };
        }

        // 初始化
        registerDefaultTemplates();

        return {
            registerTemplate,
            getAllTemplates,
            getTemplateList,
            getTemplate,
            setCurrentTemplate,
            getCurrentTemplate,
            renderCurrent,
            switchTemplate,
            getFieldDefinitions,
            collectFormData
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// 导出到全局作用域
window.TemplateManager = TemplateManager;
window.ModernTemplate = ModernTemplate;
window.ClassicTemplate = ClassicTemplate;
window.MinimalTemplate = MinimalTemplate;
window.BaseTemplate = BaseTemplate;
