/**
 * security.test.js - Security module tests
 * Tests for rate limiting, input sanitization, and security utilities
 */

// Simple DOM mocks for testing
global.document = {
  createElement: (tag) => ({
    innerHTML: '',
    textContent: '',
    className: '',
    querySelectorAll: () => [],
    remove: () => {},
    toString: () => ''
  }),
  querySelector: () => null
};

global.window = {
  document: global.document
};

global.navigator = {
  userAgent: 'Mozilla/5.0 (Test Browser)',
  language: 'en-US'
};

global.screen = {
  width: 1920,
  height: 1080
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => store[key] = value.toString(),
    removeItem: (key) => delete store[key],
    clear: () => store = {}
  };
})();

global.localStorage = localStorageMock;

// Load the Security module
require('../security.js');

describe('Security Module', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset any time-dependent tests
    jest.clearAllMocks();
  });

  describe('Rate Limiting', () => {
    test('should allow login attempts under the limit', () => {
      const result = Security.recordFailedAttempt('test@example.com', 'Invalid password');
      
      expect(result.blocked).toBe(false);
      expect(result.attemptsRemaining).toBe(5); // Should be 5 initially, then 4 after first attempt
      expect(result.message).toContain('attempts remaining');
    });

    test('should block client after maximum failed attempts', () => {
      // Make 6 failed attempts (one more than the limit)
      for (let i = 0; i < 6; i++) {
        Security.recordFailedAttempt('test@example.com', 'Invalid password');
      }

      const result = Security.recordFailedAttempt('test@example.com', 'Invalid password');
      
      expect(result.blocked).toBe(true);
      expect(result.attemptsRemaining).toBe(0);
      expect(result.message).toContain('Too many failed attempts');
    });

    test('should check if client is blocked', () => {
      // Block the client first
      for (let i = 0; i < 6; i++) {
        Security.recordFailedAttempt('test@example.com', 'Invalid password');
      }

      const blockStatus = Security.isClientBlocked();
      
      expect(blockStatus.blocked).toBe(true);
      expect(blockStatus.remainingTime).toBeGreaterThan(0);
    });

    test('should clear failed attempts on successful login', () => {
      // Make some failed attempts
      Security.recordFailedAttempt('test@example.com', 'Invalid password');
      Security.recordFailedAttempt('test@example.com', 'Invalid password');

      // Successful login should clear attempts
      Security.recordSuccessfulLogin('test@example.com');

      // Next failed attempt should start fresh
      const result = Security.recordFailedAttempt('test@example.com', 'Invalid password');
      expect(result.attemptsRemaining).toBe(5); // Should be back to 5
    });
  });

  describe('Password Validation', () => {
    test('should validate strong passwords', () => {
      const result = Security.validatePasswordStrength('MyStr0ng!Password');
      
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
      expect(result.score).toBeGreaterThanOrEqual(6);
    });

    test('should reject weak passwords', () => {
      const result = Security.validatePasswordStrength('123');
      
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('weak');
      expect(result.feedback).toContain('Password must be at least 8 characters long');
    });

    test('should detect common patterns', () => {
      const result = Security.validatePasswordStrength('password123');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback.some(msg => msg.includes('common patterns'))).toBe(true);
    });

    test('should require character variety', () => {
      const result = Security.validatePasswordStrength('alllowercase');
      
      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Add uppercase letters');
      expect(result.feedback).toContain('Add numbers');
      expect(result.feedback.some(msg => msg.includes('special characters'))).toBe(true);
    });
  });

  describe('Input Sanitization', () => {
    test('should sanitize dangerous input', () => {
      const dangerous = '<script>alert("xss")</script>Hello';
      const sanitized = Security.sanitizeInput(dangerous);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).toBe('Hello');
    });

    test('should remove event handlers', () => {
      const dangerous = 'onclick=alert("xss") Hello';
      const sanitized = Security.sanitizeInput(dangerous);
      
      expect(sanitized).not.toContain('onclick=');
      expect(sanitized).toBe('Hello');
    });

    test('should limit input length', () => {
      const longInput = 'a'.repeat(2000);
      const sanitized = Security.sanitizeInput(longInput);
      
      expect(sanitized.length).toBeLessThanOrEqual(1000);
    });

    test('should handle non-string input', () => {
      expect(Security.sanitizeInput(null)).toBe('');
      expect(Security.sanitizeInput(undefined)).toBe('');
      expect(Security.sanitizeInput(123)).toBe('');
      expect(Security.sanitizeInput({})).toBe('');
    });
  });

  describe('Security Statistics', () => {
    test('should provide security statistics', () => {
      // Generate some security events
      Security.recordFailedAttempt('test1@example.com', 'Invalid password');
      Security.recordSuccessfulLogin('test2@example.com');

      const stats = Security.getSecurityStats();
      
      expect(stats).toHaveProperty('totalAttempts');
      expect(stats).toHaveProperty('blockedClients');
      expect(stats).toHaveProperty('failedLogins24h');
      expect(stats).toHaveProperty('successfulLogins24h');
      expect(stats).toHaveProperty('totalSecurityEvents');
    });

    test('should track failed and successful logins', () => {
      Security.recordFailedAttempt('test@example.com', 'Invalid password');
      Security.recordSuccessfulLogin('test@example.com');

      const stats = Security.getSecurityStats();
      
      expect(stats.failedLogins24h).toBeGreaterThanOrEqual(1);
      expect(stats.successfulLogins24h).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Configuration', () => {
    test('should provide configuration access', () => {
      const config = Security.getConfig();
      
      expect(config).toHaveProperty('maxAttempts');
      expect(config).toHaveProperty('lockoutDuration');
      expect(config).toHaveProperty('attemptWindow');
      expect(config.maxAttempts).toBe(5);
    });
  });

  describe('Cleanup', () => {
    test('should cleanup old security data', () => {
      // This test would need to mock time to properly test cleanup
      // For now, just ensure the cleanup function exists and runs
      expect(() => Security.cleanup()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw errors
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw errors
      expect(() => {
        Security.recordFailedAttempt('test@example.com', 'Invalid password');
      }).not.toThrow();

      // Restore original function
      localStorage.setItem = originalSetItem;
    });

    test('should handle malformed data in localStorage', () => {
      // Put invalid JSON in localStorage
      localStorage.setItem('security_login_attempts', 'invalid json');
      
      // Should not throw errors
      expect(() => {
        Security.recordFailedAttempt('test@example.com', 'Invalid password');
      }).not.toThrow();
    });
  });
});

describe('Integration with Sanitizer', () => {
  // Load Sanitizer module
  require('../sanitizer.js');

  test('should work with Sanitizer for URL validation', () => {
    const validURL = 'https://example.com';
    const invalidURL = 'javascript:alert("xss")';

    const validResult = Sanitizer.validateURL(validURL);
    const invalidResult = Sanitizer.validateURL(invalidURL);

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
  });

  test('should sanitize email addresses', () => {
    const validEmail = 'user@example.com';
    const invalidEmail = 'user@<script>alert("xss")</script>';

    const validResult = Sanitizer.validateEmail(validEmail);
    const invalidResult = Sanitizer.validateEmail(invalidEmail);

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
  });
});