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
  const createSafeElement = (tag, text, className = '') => {
    const element = document.createElement(tag);
    setTextContent(element, text);
    if (className) {
      element.className = className;
    }
    return element;
  };

  /**
   * Validates and sanitizes URLs to prevent dangerous protocols
   * @param {string} url - URL to validate
   * @returns {Object} Validation result with sanitized URL
   * @example
   * const result = Sanitizer.validateURL('https://example.com');
   * // Returns: { isValid: true, sanitizedURL: 'https://example.com', error: null }
   */
  const validateURL = (url) => {
    if (!url || typeof url !== 'string') {
      return { isValid: false, sanitizedURL: '', error: 'URL is required' };
    }

    const trimmedURL = url.trim();
    
    // Block dangerous protocols
    const dangerousProtocols = [
      'javascript:', 'data:', 'vbscript:', 'file:', 'ftp:', 
      'mailto:', 'tel:', 'sms:', 'about:', 'chrome:', 'moz-extension:'
    ];
    
    const lowerURL = trimmedURL.toLowerCase();
    for (const protocol of dangerousProtocols) {
      if (lowerURL.startsWith(protocol)) {
        return { 
          isValid: false, 
          sanitizedURL: '', 
          error: `Dangerous protocol detected: ${protocol}` 
        };
      }
    }

    // Validate URL format
    try {
      const urlObj = new URL(trimmedURL);
      
      // Only allow http and https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { 
          isValid: false, 
          sanitizedURL: '', 
          error: 'Only HTTP and HTTPS protocols are allowed' 
        };
      }

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /@/, // URLs with @ symbol (potential phishing)
        /\s/, // URLs with spaces
        /[<>"]/, // URLs with HTML characters
        /\.\./  // Path traversal attempts
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(trimmedURL)) {
          return { 
            isValid: false, 
            sanitizedURL: '', 
            error: 'URL contains suspicious characters' 
          };
        }
      }

      return { 
        isValid: true, 
        sanitizedURL: urlObj.toString(), 
        error: null 
      };
    } catch (error) {
      return { 
        isValid: false, 
        sanitizedURL: '', 
        error: 'Invalid URL format' 
      };
    }
  };

  /**
   * Sanitizes HTML content by removing all tags and dangerous content
   * @param {string} html - HTML content to sanitize
   * @returns {string} Plain text content
   * @example
   * const safe = Sanitizer.stripHTML('<p>Hello <script>alert("xss")</script></p>');
   * // Returns: 'Hello '
   */
  const stripHTML = (html) => {
    if (typeof html !== 'string') {
      return '';
    }
    
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove all script tags and their content
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove all style tags and their content
    const styles = temp.querySelectorAll('style');
    styles.forEach(style => style.remove());
    
    // Return only text content
    return temp.textContent || temp.innerText || '';
  };

  /**
   * Sanitizes file names to prevent path traversal and dangerous characters
   * @param {string} filename - File name to sanitize
   * @returns {string} Sanitized file name
   * @example
   * const safe = Sanitizer.sanitizeFileName('../../../etc/passwd');
   * // Returns: 'passwd'
   */
  const sanitizeFileName = (filename) => {
    if (typeof filename !== 'string') {
      return 'untitled';
    }

    return filename
      .replace(/[<>:"/\\|?*]/g, '') // Remove dangerous characters
      .replace(/\.\./g, '') // Remove path traversal
      .replace(/^\.+/, '') // Remove leading dots
      .trim()
      .substring(0, 255) // Limit length
      || 'untitled'; // Fallback if empty
  };

  /**
   * Validates and sanitizes email addresses
   * @param {string} email - Email to validate
   * @returns {Object} Validation result
   * @example
   * const result = Sanitizer.validateEmail('user@example.com');
   * // Returns: { isValid: true, sanitizedEmail: 'user@example.com', error: null }
   */
  const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
      return { isValid: false, sanitizedEmail: '', error: 'Email is required' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    // Basic email regex (more permissive than strict RFC compliance)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return { 
        isValid: false, 
        sanitizedEmail: '', 
        error: 'Invalid email format' 
      };
    }

    // Check for dangerous patterns
    if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
      return { 
        isValid: false, 
        sanitizedEmail: '', 
        error: 'Email contains invalid patterns' 
      };
    }

    // Length validation
    if (trimmedEmail.length > 254) {
      return { 
        isValid: false, 
        sanitizedEmail: '', 
        error: 'Email is too long' 
      };
    }

    return { 
      isValid: true, 
      sanitizedEmail: trimmedEmail, 
      error: null 
    };
  };

  /**
   * Comprehensive input sanitization for form fields
   * @param {string} input - Input to sanitize
   * @param {Object} options - Sanitization options
   * @returns {string} Sanitized input
   * @example
   * const safe = Sanitizer.sanitizeFormInput('<script>alert("xss")</script>Hello', {
   *   maxLength: 100,
   *   allowHTML: false,
   *   trimWhitespace: true
   * });
   */
  const sanitizeFormInput = (input, options = {}) => {
    const defaults = {
      maxLength: 1000,
      allowHTML: false,
      trimWhitespace: true,
      removeLineBreaks: false
    };
    
    const opts = { ...defaults, ...options };
    
    if (typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Trim whitespace if requested
    if (opts.trimWhitespace) {
      sanitized = sanitized.trim();
    }

    // Remove HTML if not allowed
    if (!opts.allowHTML) {
      sanitized = opts.removeLineBreaks ? 
        stripHTML(sanitized).replace(/\n/g, ' ') : 
        stripHTML(sanitized);
    } else {
      // If HTML is allowed, still escape dangerous content
      sanitized = escapeHTML(sanitized);
    }

    // Limit length
    if (opts.maxLength > 0) {
      sanitized = sanitized.substring(0, opts.maxLength);
    }

    return sanitized;
  };

  // Public API
  return {
    escapeHTML,
    setTextContent,
    setMultipleTextContent,
    createSafeElement,
    validateURL,
    stripHTML,
    sanitizeFileName,
    validateEmail,
    sanitizeFormInput
  };
})();

// Export for modules if using ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sanitizer;
}

// Export to global for browser and test environments
if (typeof window !== 'undefined') {
  window.Sanitizer = Sanitizer;
}
if (typeof global !== 'undefined') {
  global.Sanitizer = Sanitizer;
}