// validation.js - Form validation utilities

/**
 * Validation utility functions
 */
const Validator = {
    /**
     * Validates email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validates phone number format (supports multiple formats)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    isValidPhone(phone) {
        // Supports formats: +1-234-567-8900, (123) 456-7890, 123-456-7890, 1234567890
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Validates URL format
     * @param {string} url - URL to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    isValidURL(url) {
        if (!url) return true; // URL is optional
        try {
            // Check if it's a valid URL or a domain-like string
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return urlPattern.test(url);
        } catch (e) {
            return false;
        }
    },

    /**
     * Validates password strength
     * @param {string} password - Password to validate
     * @returns {object} - Object with isValid and strength properties
     */
    validatePassword(password) {
        const result = {
            isValid: false,
            strength: 'weak',
            message: '',
            requirements: {
                minLength: password.length >= 8,
                hasUpperCase: /[A-Z]/.test(password),
                hasLowerCase: /[a-z]/.test(password),
                hasNumber: /[0-9]/.test(password),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            }
        };

        const metRequirements = Object.values(result.requirements).filter(Boolean).length;

        if (password.length < 8) {
            result.strength = 'weak';
            result.message = 'Password must be at least 8 characters';
        } else if (metRequirements < 3) {
            result.strength = 'weak';
            result.message = 'Weak password';
        } else if (metRequirements === 3) {
            result.strength = 'medium';
            result.message = 'Medium strength password';
            result.isValid = true;
        } else {
            result.strength = 'strong';
            result.message = 'Strong password';
            result.isValid = true;
        }

        return result;
    },

    /**
     * Checks if a field is empty
     * @param {string} value - Value to check
     * @returns {boolean} - True if empty, false otherwise
     */
    isEmpty(value) {
        return !value || value.trim() === '';
    }
};

/**
 * UI Helper functions for displaying validation errors
 */
const ValidationUI = {
    /**
     * Shows an error message for a specific input field
     * @param {string} inputId - ID of the input element
     * @param {string} message - Error message to display
     */
    showError(inputId, message) {
        const input = document.getElementById(inputId);
        if (!input) return;

        // Remove any existing error
        this.clearError(inputId);

        // Add error class to input
        input.classList.add('input-error');

        // Create and insert error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = `${inputId}-error`;
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');

        // Insert after the input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    },

    /**
     * Clears error message for a specific input field
     * @param {string} inputId - ID of the input element
     */
    clearError(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.classList.remove('input-error');

        const errorDiv = document.getElementById(`${inputId}-error`);
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    /**
     * Shows a success indicator for a specific input field
     * @param {string} inputId - ID of the input element
     */
    showSuccess(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        this.clearError(inputId);
        input.classList.add('input-success');

        // Remove success class after animation
        setTimeout(() => {
            input.classList.remove('input-success');
        }, 2000);
    },

    /**
     * Shows password strength indicator
     * @param {string} inputId - ID of the password input
     * @param {object} result - Password validation result
     */
    showPasswordStrength(inputId, result) {
        const input = document.getElementById(inputId);
        if (!input) return;

        // Remove existing strength indicator
        const existingIndicator = document.getElementById(`${inputId}-strength`);
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create strength indicator
        const strengthDiv = document.createElement('div');
        strengthDiv.className = `password-strength password-strength-${result.strength}`;
        strengthDiv.id = `${inputId}-strength`;
        
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        
        const strengthText = document.createElement('span');
        strengthText.className = 'password-strength-text';
        strengthText.textContent = result.message;

        strengthDiv.appendChild(strengthBar);
        strengthDiv.appendChild(strengthText);

        // Insert after the input
        input.parentNode.insertBefore(strengthDiv, input.nextSibling);
    },

    /**
     * Shows a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of toast (success, error, info)
     */
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Validator = Validator;
    window.ValidationUI = ValidationUI;
}
