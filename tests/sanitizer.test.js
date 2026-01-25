/**
 * Sanitizer Tests
 * Unit tests for XSS prevention and sanitization functions
 */

const Sanitizer = {
  escapeHTML: (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#x2F;'
    };
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
  },

  sanitizeURL: (url) => {
    if (typeof url !== 'string') {
      return '';
    }
    const trimmedUrl = url.trim().toLowerCase();
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
    if (dangerousProtocols.some((protocol) => trimmedUrl.startsWith(protocol))) {
      return '';
    }
    return url;
  },

  stripHTML: (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    if (!text) {
      return '';
    }
    const temp = document.createElement('div');
    temp.innerHTML = text;
    return temp.textContent || temp.innerText || '';
  }
};

describe('Sanitizer', () => {
  describe('escapeHTML', () => {
    test('should escape HTML special characters', () => {
      expect(Sanitizer.escapeHTML('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    test('should escape ampersands', () => {
      expect(Sanitizer.escapeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('should escape quotes', () => {
      expect(Sanitizer.escapeHTML('"Hello" and \'World\'')).toBe('&quot;Hello&quot; and &#39;World&#39;');
    });

    test('should escape angle brackets', () => {
      expect(Sanitizer.escapeHTML('<div>test</div>')).toBe('&lt;div&gt;test&lt;&#x2F;div&gt;');
    });

    test('should return empty string for non-string inputs', () => {
      expect(Sanitizer.escapeHTML(null)).toBe('');
      expect(Sanitizer.escapeHTML(undefined)).toBe('');
      expect(Sanitizer.escapeHTML(123)).toBe('');
    });

    test('should handle multiple dangerous characters', () => {
      expect(Sanitizer.escapeHTML('<img src="x" onerror="alert(1)">'))
        .toContain('&lt;');
    });

    test('should not escape safe characters', () => {
      expect(Sanitizer.escapeHTML('Hello World 123')).toBe('Hello World 123');
    });
  });

  describe('sanitizeURL', () => {
    test('should block javascript: protocol', () => {
      expect(Sanitizer.sanitizeURL('javascript:alert("xss")')).toBe('');
      expect(Sanitizer.sanitizeURL('JavaScript:void(0)')).toBe('');
    });

    test('should block data: protocol', () => {
      expect(Sanitizer.sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    test('should block vbscript: protocol', () => {
      expect(Sanitizer.sanitizeURL('vbscript:msgbox("xss")')).toBe('');
    });

    test('should allow safe URLs', () => {
      expect(Sanitizer.sanitizeURL('https://example.com')).toBe('https://example.com');
      expect(Sanitizer.sanitizeURL('http://google.com')).toBe('http://google.com');
    });

    test('should return empty string for non-string inputs', () => {
      expect(Sanitizer.sanitizeURL(null)).toBe('');
      expect(Sanitizer.sanitizeURL(undefined)).toBe('');
      expect(Sanitizer.sanitizeURL(123)).toBe('');
    });

    test('should handle protocol case-insensitivity', () => {
      expect(Sanitizer.sanitizeURL('JAVASCRIPT:alert(1)')).toBe('');
      expect(Sanitizer.sanitizeURL('Data:alert(1)')).toBe('');
    });
  });

  describe('stripHTML', () => {
    test('should remove HTML tags', () => {
      expect(Sanitizer.stripHTML('<p>Hello World</p>')).toBe('Hello World');
    });

    test('should handle nested tags', () => {
      expect(Sanitizer.stripHTML('<div><p>Nested <b>bold</b></p></div>')).toBe('Nested bold');
    });

    test('should return empty string for empty input', () => {
      expect(Sanitizer.stripHTML('')).toBe('');
    });

    test('should return empty string for non-string inputs', () => {
      expect(Sanitizer.stripHTML(null)).toBe('');
      expect(Sanitizer.stripHTML(undefined)).toBe('');
    });
  });
});
