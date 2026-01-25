/**
 * sanitizer.js - Security utility for sanitizing user input
 * Prevents XSS attacks by escaping HTML special characters
 */

/**
 * Sanitizer module for protecting against XSS vulnerabilities
 * @module sanitizer
 */
const Sanitizer = (() => {
  /**
   * HTML special characters map for escaping
   * @type {Object}
   */
  const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  };

  /**
   * Escapes HTML special characters to prevent XSS attacks
   * @param {string} text - The text to escape
   * @returns {string} The escaped text safe for HTML rendering
   * @example
   * const safe = Sanitizer.escapeHTML('<script>alert("xss")</script>');
   * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
   */
  const escapeHTML = (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    return text.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char]);
  };

  /**
   * Safely creates text node from user input and appends to element
   * @param {HTMLElement} element - The target element
   * @param {string} text - The text content to safely insert
   * @returns {void}
   * @example
   * Sanitizer.setTextContent(document.getElementById('name'), userInput);
   */
  const setTextContent = (element, text) => {
    if (!element) {
      return;
    }
    element.textContent = text;
  };

  /**
   * Safely sets text content for multiple elements
   * @param {Object} elementsMap - Object with selectors as keys and text as values
   * @returns {void}
   * @example
   * Sanitizer.setMultipleTextContent({
   *   '.name-display': 'John Doe',
   *   '.email-display': 'john@example.com'
   * });
   */
  const setMultipleTextContent = (elementsMap) => {
    Object.entries(elementsMap).forEach(([selector, text]) => {
      const element = document.querySelector(selector);
      if (element) {
        setTextContent(element, text);
      }
    });
  };

  /**
   * Creates a DOM element with sanitized text content
   * @param {string} tag - HTML tag name
   * @param {string} text - Text content
   * @param {string} className - Optional CSS class
   * @returns {HTMLElement} The created element
   * @example
   * const div = Sanitizer.createSafeElement('div', 'Hello World', 'greeting');
   */
  const createSafeElement = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    element.textContent = text;
    return element;
  };

  /**
   * Validates and sanitizes URLs to prevent javascript: and data: schemes
   * @param {string} url - The URL to validate
   * @returns {string} Empty string if invalid, otherwise the URL
   * @example
   * const safeUrl = Sanitizer.sanitizeURL('javascript:alert("xss")');
   * // Returns: ''
   */
  const sanitizeURL = (url) => {
    if (typeof url !== 'string') {
      return '';
    }

    const trimmedUrl = url.trim().toLowerCase();

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
    if (dangerousProtocols.some((protocol) => trimmedUrl.startsWith(protocol))) {
      return '';
    }

    return url;
  };

  /**
   * Validates email format
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid email format
   * @example
   * if (Sanitizer.isValidEmail('test@example.com')) { ... }
   */
  const isValidEmail = (email) => {
    if (typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates phone number format (international)
   * @param {string} phone - The phone number to validate
   * @returns {boolean} True if valid phone format
   * @example
   * if (Sanitizer.isValidPhone('+1-555-123-4567')) { ... }
   */
  const isValidPhone = (phone) => {
    if (typeof phone !== 'string') {
      return false;
    }
    const phoneRegex = /^[\d\s\-+().\]]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  };

  /**
   * Removes all HTML tags from text
   * @param {string} text - The text to clean
   * @returns {string} Text with HTML tags removed
   * @example
   * const clean = Sanitizer.stripHTML('<p>Hello <b>World</b></p>');
   * // Returns: 'Hello World'
   */
  const stripHTML = (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    const temp = document.createElement('div');
    temp.innerHTML = text;
    return temp.textContent || temp.innerText;
  };

  /**
   * Limits text length and prevents abuse
   * @param {string} text - The text to limit
   * @param {number} maxLength - Maximum allowed length
   * @returns {string} Limited text
   * @example
   * const limited = Sanitizer.limitLength('Very long text...', 10);
   * // Returns: 'Very long ...'
   */
  const limitLength = (text, maxLength = 500) => {
    if (typeof text !== 'string') {
      return '';
    }
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trim() + '...';
    }
    return text;
  };

  // Public API
  return {
    escapeHTML,
    setTextContent,
    setMultipleTextContent,
    createSafeElement,
    sanitizeURL,
    isValidEmail,
    isValidPhone,
    stripHTML,
    limitLength
  };
})();

// Export for modules if using ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sanitizer;
}
