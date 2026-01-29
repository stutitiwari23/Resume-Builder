/**
 * security.js - Security utilities and rate limiting for authentication
 * Provides protection against brute force attacks and security monitoring
 * @module security
 */

const Security = (() => {
  // Rate limiting configuration
  const RATE_LIMIT_CONFIG = {
    maxAttempts: 5,           // Maximum failed attempts
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
    attemptWindow: 5 * 60 * 1000,    // 5 minutes window for attempts
    cleanupInterval: 60 * 60 * 1000  // 1 hour cleanup interval
  };

  // Storage keys
  const STORAGE_KEYS = {
    loginAttempts: 'security_login_attempts',
    blockedIPs: 'security_blocked_ips',
    securityLog: 'security_log'
  };

  /**
   * Gets current timestamp
   * @private
   * @returns {number} Current timestamp in milliseconds
   */
  const getCurrentTime = () => Date.now();

  /**
   * Gets client identifier (simplified for frontend-only app)
   * @private
   * @returns {string} Client identifier based on browser fingerprint
   */
  const getClientId = () => {
    // Simple browser fingerprint for demo purposes
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = canvas.toDataURL() + 
                       navigator.userAgent + 
                       navigator.language + 
                       screen.width + 'x' + screen.height;
    
    // Create simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 'client_' + Math.abs(hash).toString(36);
  };

  /**
   * Logs security events
   * @private
   * @param {string} event - Event type
   * @param {string} details - Event details
   * @param {string} severity - Event severity (info, warning, error)
   */
  const logSecurityEvent = (event, details, severity = 'info') => {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.securityLog) || '[]');
      const logEntry = {
        timestamp: getCurrentTime(),
        event,
        details,
        severity,
        clientId: getClientId(),
        userAgent: navigator.userAgent.substring(0, 100) // Truncate for storage
      };

      logs.push(logEntry);
      
      // Keep only last 100 entries to prevent storage bloat
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem(STORAGE_KEYS.securityLog, JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  };

  /**
   * Cleans up old rate limiting data
   * @private
   */
  const cleanupOldData = () => {
    try {
      const now = getCurrentTime();
      const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.loginAttempts) || '{}');
      const blocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.blockedIPs) || '{}');

      // Clean up old attempts
      Object.keys(attempts).forEach(clientId => {
        attempts[clientId] = attempts[clientId].filter(
          attempt => now - attempt.timestamp < RATE_LIMIT_CONFIG.attemptWindow
        );
        if (attempts[clientId].length === 0) {
          delete attempts[clientId];
        }
      });

      // Clean up expired blocks
      Object.keys(blocked).forEach(clientId => {
        if (now - blocked[clientId].blockedAt > RATE_LIMIT_CONFIG.lockoutDuration) {
          delete blocked[clientId];
          logSecurityEvent('UNBLOCK', `Client ${clientId} unblocked after lockout period`, 'info');
        }
      });

      localStorage.setItem(STORAGE_KEYS.loginAttempts, JSON.stringify(attempts));
      localStorage.setItem(STORAGE_KEYS.blockedIPs, JSON.stringify(blocked));
    } catch (error) {
      console.warn('Failed to cleanup security data:', error);
    }
  };

  /**
   * Checks if client is currently blocked
   * @param {string} clientId - Client identifier
   * @returns {boolean} True if client is blocked
   */
  const isClientBlocked = (clientId = null) => {
    try {
      const client = clientId || getClientId();
      const blocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.blockedIPs) || '{}');
      const now = getCurrentTime();

      if (blocked[client]) {
        const timeSinceBlock = now - blocked[client].blockedAt;
        if (timeSinceBlock < RATE_LIMIT_CONFIG.lockoutDuration) {
          return {
            blocked: true,
            remainingTime: RATE_LIMIT_CONFIG.lockoutDuration - timeSinceBlock,
            reason: blocked[client].reason
          };
        } else {
          // Block expired, remove it
          delete blocked[client];
          localStorage.setItem(STORAGE_KEYS.blockedIPs, JSON.stringify(blocked));
        }
      }

      return { blocked: false };
    } catch (error) {
      console.warn('Failed to check client block status:', error);
      return { blocked: false };
    }
  };

  /**
   * Records a failed login attempt
   * @param {string} email - Email address used in attempt
   * @param {string} reason - Reason for failure
   * @returns {Object} Rate limit status
   */
  const recordFailedAttempt = (email, reason = 'Invalid credentials') => {
    try {
      const clientId = getClientId();
      const now = getCurrentTime();
      const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.loginAttempts) || '{}');

      if (!attempts[clientId]) {
        attempts[clientId] = [];
      }

      // Filter recent attempts within the window first
      const recentAttempts = attempts[clientId].filter(
        attempt => now - attempt.timestamp < RATE_LIMIT_CONFIG.attemptWindow
      );

      // Check if client should be blocked BEFORE adding new attempt
      if (recentAttempts.length >= RATE_LIMIT_CONFIG.maxAttempts) {
        const blocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.blockedIPs) || '{}');
        blocked[clientId] = {
          blockedAt: now,
          reason: `Too many failed attempts (${recentAttempts.length})`,
          attempts: recentAttempts.length
        };
        localStorage.setItem(STORAGE_KEYS.blockedIPs, JSON.stringify(blocked));

        logSecurityEvent('CLIENT_BLOCKED', `Client ${clientId} blocked after ${recentAttempts.length} failed attempts`, 'error');

        return {
          blocked: true,
          attemptsRemaining: 0,
          lockoutDuration: RATE_LIMIT_CONFIG.lockoutDuration,
          message: `Too many failed attempts. Please try again in ${Math.ceil(RATE_LIMIT_CONFIG.lockoutDuration / 60000)} minutes.`
        };
      }

      // Add new attempt
      recentAttempts.push({
        timestamp: now,
        email: email ? email.substring(0, 50) : 'unknown', // Truncate email for privacy
        reason
      });

      attempts[clientId] = recentAttempts;
      localStorage.setItem(STORAGE_KEYS.loginAttempts, JSON.stringify(attempts));

      logSecurityEvent('FAILED_LOGIN', `Failed login attempt for ${email} - ${reason}`, 'warning');

      return {
        blocked: false,
        attemptsRemaining: RATE_LIMIT_CONFIG.maxAttempts - recentAttempts.length,
        message: `${RATE_LIMIT_CONFIG.maxAttempts - recentAttempts.length} attempts remaining`
      };

    } catch (error) {
      console.warn('Failed to record login attempt:', error);
      return { blocked: false, attemptsRemaining: RATE_LIMIT_CONFIG.maxAttempts };
    }
  };

  /**
   * Records a successful login
   * @param {string} email - Email address
   */
  const recordSuccessfulLogin = (email) => {
    try {
      const clientId = getClientId();
      const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.loginAttempts) || '{}');
      
      // Clear failed attempts for this client
      if (attempts[clientId]) {
        delete attempts[clientId];
        localStorage.setItem(STORAGE_KEYS.loginAttempts, JSON.stringify(attempts));
      }

      logSecurityEvent('SUCCESSFUL_LOGIN', `Successful login for ${email}`, 'info');
    } catch (error) {
      console.warn('Failed to record successful login:', error);
    }
  };

  /**
   * Validates password strength with detailed feedback
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with strength score and feedback
   */
  const validatePasswordStrength = (password) => {
    if (!password) {
      return {
        isValid: false,
        score: 0,
        strength: 'none',
        feedback: ['Password is required']
      };
    }

    const feedback = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Character variety checks
    if (!/[a-z]/.test(password)) {
      feedback.push('Add lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Add uppercase letters');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Add numbers');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Add special characters (!@#$%^&*)');
    } else {
      score += 2;
    }

    // Common patterns check
    const commonPatterns = [
      /(.)\1{2,}/, // Repeated characters
      /123|abc|qwe/i, // Sequential patterns
      /password|admin|user|login/i // Common words
    ];

    commonPatterns.forEach(pattern => {
      if (pattern.test(password)) {
        feedback.push('Avoid common patterns and repeated characters');
        score -= 1;
      }
    });

    // Determine strength
    let strength = 'weak';
    if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'medium';

    return {
      isValid: score >= 4 && feedback.length === 0,
      score: Math.max(0, score),
      strength,
      feedback: feedback.length > 0 ? feedback : ['Password strength: ' + strength]
    };
  };

  /**
   * Sanitizes input to prevent XSS attacks
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  };

  /**
   * Gets security statistics for monitoring
   * @returns {Object} Security statistics
   */
  const getSecurityStats = () => {
    try {
      const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.loginAttempts) || '{}');
      const blocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.blockedIPs) || '{}');
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.securityLog) || '[]');

      const now = getCurrentTime();
      const last24Hours = now - (24 * 60 * 60 * 1000);

      const recentLogs = logs.filter(log => log.timestamp > last24Hours);
      const failedLogins = recentLogs.filter(log => log.event === 'FAILED_LOGIN').length;
      const successfulLogins = recentLogs.filter(log => log.event === 'SUCCESSFUL_LOGIN').length;
      const blockedClients = Object.keys(blocked).length;

      return {
        totalAttempts: Object.keys(attempts).reduce((sum, client) => sum + attempts[client].length, 0),
        blockedClients,
        failedLogins24h: failedLogins,
        successfulLogins24h: successfulLogins,
        totalSecurityEvents: logs.length,
        lastCleanup: now
      };
    } catch (error) {
      console.warn('Failed to get security stats:', error);
      return {};
    }
  };

  // Initialize cleanup interval
  setInterval(cleanupOldData, RATE_LIMIT_CONFIG.cleanupInterval);

  // Public API
  return {
    isClientBlocked,
    recordFailedAttempt,
    recordSuccessfulLogin,
    validatePasswordStrength,
    sanitizeInput,
    getSecurityStats,
    
    // Configuration getters
    getConfig: () => ({ ...RATE_LIMIT_CONFIG }),
    
    // Manual cleanup trigger
    cleanup: cleanupOldData
  };
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Security = Security;
}