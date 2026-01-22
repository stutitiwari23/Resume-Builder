/**
 * Validation Tests
 * Unit tests for input validation functions
 */

// Mock Validator module - create a simple implementation for testing
const Validator = {
  isValidEmail: (email) => {
    if (typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone) => {
    if (typeof phone !== 'string') {
      return false;
    }
    const phoneRegex = /^[\d\s\-()+.]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  },

  isValidLinkedIn: (url) => {
    const regex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    return typeof url === 'string' && regex.test(url);
  },
  isValidGitHub: (url) => {
    const regex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    return typeof url === 'string' && regex.test(url);
  },

  isValidURL: (url) => {
    if (typeof url !== 'string') {
      return false;
    }
    if (!url) {
      return false;
    }
    try {
      // Block dangerous protocols
      const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
      const lowerUrl = url.toLowerCase();
      if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
        return false;
      }
      // Check if it's a valid URL (requires protocol)
      const urlPattern = /^(https?:\/\/)(\w+\.)+\w+/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  },

  isValidName: (name) => {
    if (typeof name !== 'string') {
      return false;
    }
    return name.trim().length >= 2 && name.trim().length <= 100;
  }
};

describe('Validator', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email addresses', () => {
      expect(Validator.isValidEmail('test@example.com')).toBe(true);
      expect(Validator.isValidEmail('user.name@company.co.uk')).toBe(true);
      expect(Validator.isValidEmail('john+test@example.org')).toBe(true);
    });

    test('should return false for invalid email addresses', () => {
      expect(Validator.isValidEmail('invalid-email')).toBe(false);
      expect(Validator.isValidEmail('missing@domain')).toBe(false);
      expect(Validator.isValidEmail('@example.com')).toBe(false);
      expect(Validator.isValidEmail('user@')).toBe(false);
      expect(Validator.isValidEmail('')).toBe(false);
    });

    test('should return false for non-string inputs', () => {
      expect(Validator.isValidEmail(null)).toBe(false);
      expect(Validator.isValidEmail(undefined)).toBe(false);
      expect(Validator.isValidEmail(123)).toBe(false);
      expect(Validator.isValidEmail({})).toBe(false);
    });

    test('should handle whitespace in emails', () => {
      expect(Validator.isValidEmail(' test@example.com ')).toBe(false);
      expect(Validator.isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    test('should return true for valid phone numbers', () => {
      expect(Validator.isValidPhone('123-456-7890')).toBe(true);
      expect(Validator.isValidPhone('+1 (555) 123-4567')).toBe(true);
      expect(Validator.isValidPhone('9876543210')).toBe(true);
    });

    test('should return false for invalid phone numbers', () => {
      expect(Validator.isValidPhone('123')).toBe(false);
      expect(Validator.isValidPhone('abc-def-ghij')).toBe(false);
      expect(Validator.isValidPhone('')).toBe(false);
    });

    test('should return false for non-string inputs', () => {
      expect(Validator.isValidPhone(null)).toBe(false);
      expect(Validator.isValidPhone(undefined)).toBe(false);
      expect(Validator.isValidPhone(1234567890)).toBe(false);
    });
  });

  describe('isValidLinkedIn', () => {
    test('should return true for valid LinkedIn URLs', () => {
      expect(Validator.isValidLinkedIn('https://www.linkedin.com/in/john-doe')).toBe(true);
      expect(Validator.isValidLinkedIn('https://linkedin.com/in/johndoe123/')).toBe(true);
    });

    test('should return false for non-LinkedIn or malformed URLs', () => {
      expect(Validator.isValidLinkedIn('https://github.com/johndoe')).toBe(false);
      expect(Validator.isValidLinkedIn('linkedin.com/in/johndoe')).toBe(false);
      expect(Validator.isValidLinkedIn('https://www.linkedin.com/feed/')).toBe(false);
    });
  });

  describe('isValidGitHub', () => {
    test('should return true for valid GitHub URLs', () => {
      expect(Validator.isValidGitHub('https://github.com/johndoe')).toBe(true);
      expect(Validator.isValidGitHub('https://www.github.com/john_doe/')).toBe(true);
    });

    test('should return false for non-GitHub or malformed URLs', () => {
      expect(Validator.isValidGitHub('https://linkedin.com/in/johndoe')).toBe(false);
      expect(Validator.isValidGitHub('github.com/johndoe')).toBe(false);
      expect(Validator.isValidGitHub('https://github.com/')).toBe(false);
    });
  });

  describe('isValidURL', () => {
    test('should return true for valid URLs', () => {
      expect(Validator.isValidURL('https://example.com')).toBe(true);
      expect(Validator.isValidURL('http://www.example.com')).toBe(true);
      expect(Validator.isValidURL('https://linkedin.com/in/username')).toBe(true);
    });

    test('should return false for invalid URLs', () => {
      expect(Validator.isValidURL('not a url')).toBe(false);
      expect(Validator.isValidURL('example.com')).toBe(false);
      expect(Validator.isValidURL('')).toBe(false);
    });

    test('should return false for dangerous URLs', () => {
      expect(Validator.isValidURL('javascript:alert("xss")')).toBe(false);
      expect(Validator.isValidURL('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    test('should return false for non-string inputs', () => {
      expect(Validator.isValidURL(null)).toBe(false);
      expect(Validator.isValidURL(undefined)).toBe(false);
      expect(Validator.isValidURL(123)).toBe(false);
    });
  });

  describe('isValidName', () => {
    test('should return true for valid names', () => {
      expect(Validator.isValidName('John Doe')).toBe(true);
      expect(Validator.isValidName('Mary')).toBe(true);
      expect(Validator.isValidName('Jean-Pierre')).toBe(true);
    });

    test('should return false for invalid names', () => {
      expect(Validator.isValidName('a')).toBe(false);
      expect(Validator.isValidName('')).toBe(false);
      expect(Validator.isValidName('   ')).toBe(false);
      expect(Validator.isValidName('x'.repeat(101))).toBe(false);
    });

    test('should return false for non-string inputs', () => {
      expect(Validator.isValidName(null)).toBe(false);
      expect(Validator.isValidName(undefined)).toBe(false);
      expect(Validator.isValidName(123)).toBe(false);
    });
  });
});
