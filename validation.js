// validation.js

const Validator = {
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isValidPhone: (phone) => /^\+?\d{7,15}$/.test(phone),
    isValidLinkedIn: (url) => /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(url),
    isValidGitHub: (url) => /^https?:\/\/(www\.)?github\.com\/.*$/.test(url),
};

// UI for showing validation messages
const ValidationUI = {
    showError: (fieldId, message) => {
        const el = document.getElementById(fieldId);
        if (!el) return;
        let errorEl = el.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('validation-error')) {
            errorEl = document.createElement('span');
            errorEl.classList.add('validation-error');
            el.parentNode.insertBefore(errorEl, el.nextSibling);
        }
        errorEl.textContent = message;
        el.classList.add('input-error');
    },
    clearError: (fieldId) => {
        const el = document.getElementById(fieldId);
        if (!el) return;
        const errorEl = el.nextElementSibling;
        if (errorEl && errorEl.classList.contains('validation-error')) {
            errorEl.remove();
        }
        el.classList.remove('input-error');
    },
    showToast: (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
