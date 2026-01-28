# Resume Builder - Troubleshooting Guide

## 🔍 Overview

This guide helps you diagnose and resolve common issues with the Resume Builder application. Issues are organized by category with step-by-step solutions.

## 🚨 Common Issues & Solutions

### 1. Authentication Problems

#### Issue: "Too many failed attempts" message
**Symptoms:**
- User cannot log in despite correct credentials
- Error message about being blocked
- Login form becomes unresponsive

**Diagnosis:**
```javascript
// Check if client is blocked
const blockStatus = Security.isClientBlocked();
console.log('Block status:', blockStatus);
```

**Solutions:**
1. **Wait for lockout to expire** (15 minutes by default)
2. **Clear browser data**:
   ```javascript
   // Clear security data (developer console)
   localStorage.removeItem('security_login_attempts');
   localStorage.removeItem('security_blocked_ips');
   ```
3. **Check system time**: Ensure device time is correct
4. **Try different browser/incognito mode**

#### Issue: Login form not responding
**Symptoms:**
- Clicking login button does nothing
- No error messages displayed
- Form fields don't validate

**Diagnosis:**
```javascript
// Check for JavaScript errors
console.log('Security module loaded:', typeof Security !== 'undefined');
console.log('Validation module loaded:', typeof Validator !== 'undefined');
```

**Solutions:**
1. **Check browser console** for JavaScript errors
2. **Verify script loading**:
   ```html
   <!-- Ensure scripts are loaded in correct order -->
   <script src="security.js"></script>
   <script src="validation.js"></script>
   <script src="auth.js"></script>
   ```
3. **Clear browser cache** and reload
4. **Disable browser extensions** that might interfere

#### Issue: Password validation too strict
**Symptoms:**
- Strong passwords rejected
- Unclear validation messages
- Cannot register new account

**Diagnosis:**
```javascript
// Test password validation
const result = Security.validatePasswordStrength('YourPassword123!');
console.log('Password validation:', result);
```

**Solutions:**
1. **Check password requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
2. **Avoid common patterns**:
   - No repeated characters (aaa, 111)
   - No sequential patterns (abc, 123)
   - No common words (password, admin)

### 2. Data Storage Issues

#### Issue: Resume data not saving
**Symptoms:**
- Changes disappear after page reload
- "Save failed" error messages
- Data resets to previous state

**Diagnosis:**
```javascript
// Check localStorage availability
function checkLocalStorage() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
console.log('LocalStorage available:', checkLocalStorage());

// Check storage quota
navigator.storage.estimate().then(estimate => {
  console.log('Storage quota:', estimate.quota);
  console.log('Storage usage:', estimate.usage);
});
```

**Solutions:**
1. **Clear browser storage**:
   ```javascript
   // Clear all localStorage data
   localStorage.clear();
   ```
2. **Check storage quota**: Free up browser storage space
3. **Disable private/incognito mode**: Use regular browser mode
4. **Check browser settings**: Ensure cookies/storage are enabled
5. **Try different browser**: Test in Chrome, Firefox, Safari

#### Issue: Data corruption or invalid format
**Symptoms:**
- Resume displays incorrectly
- Missing sections or fields
- JavaScript errors in console

**Diagnosis:**
```javascript
// Check stored data format
const currentUser = localStorage.getItem('currentUser');
const userData = getUserData(currentUser);
console.log('User data:', userData);
console.log('Data type:', typeof userData);
console.log('Data valid:', userData && typeof userData === 'object');
```

**Solutions:**
1. **Reset user data**:
   ```javascript
   // Clear corrupted data
   const email = localStorage.getItem('currentUser');
   localStorage.removeItem(`user_${email}`);
   location.reload();
   ```
2. **Export data before clearing**: Use browser's export feature
3. **Restore from backup**: If available
4. **Re-enter data**: Start fresh with new resume

### 3. PDF Export Problems

#### Issue: PDF export not working
**Symptoms:**
- Export button does nothing
- Error messages about PDF generation
- Blank or incomplete PDF files

**Diagnosis:**
```javascript
// Check if html2pdf is loaded
console.log('html2pdf loaded:', typeof html2pdf !== 'undefined');

// Check for console errors during export
document.getElementById('download-pdf').addEventListener('click', function() {
  console.log('PDF export initiated');
});
```

**Solutions:**
1. **Check internet connection**: html2pdf loads from CDN
2. **Verify script loading**:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
   ```
3. **Disable ad blockers**: May block CDN resources
4. **Try different browser**: Some browsers have PDF restrictions
5. **Check Content Security Policy**: Ensure CDN is allowed

#### Issue: PDF formatting issues
**Symptoms:**
- Text cut off or overlapping
- Images not displaying
- Incorrect fonts or styling

**Solutions:**
1. **Check CSS print styles**: Ensure print-friendly CSS
2. **Reduce content length**: Long descriptions may overflow
3. **Use web-safe fonts**: Avoid custom fonts in PDF
4. **Test in different browsers**: PDF rendering varies

### 4. UI/UX Issues

#### Issue: Theme not switching
**Symptoms:**
- Dark/light mode toggle not working
- Theme resets after page reload
- Inconsistent styling

**Diagnosis:**
```javascript
// Check theme system
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
console.log('Theme in storage:', localStorage.getItem('theme'));
```

**Solutions:**
1. **Clear theme data**:
   ```javascript
   localStorage.removeItem('theme');
   location.reload();
   ```
2. **Check CSS variables**: Ensure theme CSS is loaded
3. **Verify JavaScript**: Check for theme.js errors
4. **Reset to default**: Use system preference

#### Issue: Responsive design problems
**Symptoms:**
- Layout broken on mobile
- Text too small or large
- Elements overlapping

**Solutions:**
1. **Check viewport meta tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. **Clear browser cache**: Force reload CSS
3. **Test in device mode**: Use browser dev tools
4. **Check CSS media queries**: Ensure responsive CSS loads

#### Issue: Form validation not working
**Symptoms:**
- Invalid data accepted
- No error messages shown
- Form submits with empty fields

**Diagnosis:**
```javascript
// Test validation functions
console.log('Email valid:', Validator.isValidEmail('test@example.com'));
console.log('Phone valid:', Validator.isValidPhone('+1-555-123-4567'));
console.log('URL valid:', Validator.isValidURL('https://example.com'));
```

**Solutions:**
1. **Check validation.js loading**: Ensure script is included
2. **Verify form IDs**: Ensure form elements have correct IDs
3. **Check event listeners**: Ensure validation events are attached
4. **Clear browser cache**: Reload JavaScript files

### 5. Performance Issues

#### Issue: Slow loading or freezing
**Symptoms:**
- Page takes long to load
- Browser becomes unresponsive
- High CPU usage

**Diagnosis:**
```javascript
// Check performance
console.time('Page Load');
window.addEventListener('load', () => {
  console.timeEnd('Page Load');
});

// Monitor memory usage
console.log('Memory usage:', performance.memory);
```

**Solutions:**
1. **Clear browser cache**: Remove old cached files
2. **Disable browser extensions**: Test in incognito mode
3. **Check internet connection**: Slow CDN loading
4. **Reduce data size**: Clear old localStorage data
5. **Update browser**: Use latest version

#### Issue: Memory leaks
**Symptoms:**
- Browser becomes slower over time
- High memory usage
- Tab crashes

**Solutions:**
1. **Reload page periodically**: Clear memory
2. **Close unused tabs**: Free up resources
3. **Check for infinite loops**: Review custom code
4. **Update browser**: Use latest version

### 6. Security Issues

#### Issue: XSS warnings or blocked content
**Symptoms:**
- Content Security Policy violations
- Scripts blocked by browser
- Security warnings in console

**Diagnosis:**
```javascript
// Check CSP violations in console
// Look for messages like "Refused to execute inline script"
```

**Solutions:**
1. **Check CSP headers**: Ensure proper configuration
2. **Use HTTPS**: Avoid mixed content warnings
3. **Validate all inputs**: Use Sanitizer module
4. **Update external resources**: Use latest CDN versions

#### Issue: Rate limiting too aggressive
**Symptoms:**
- Legitimate users getting blocked
- Cannot test login functionality
- Development workflow interrupted

**Solutions:**
1. **Adjust rate limiting**:
   ```javascript
   // Temporarily increase limits (development only)
   const config = Security.getConfig();
   console.log('Current limits:', config);
   ```
2. **Clear security data**:
   ```javascript
   localStorage.removeItem('security_login_attempts');
   localStorage.removeItem('security_blocked_ips');
   ```
3. **Use different browsers**: For testing
4. **Wait for timeout**: Default is 15 minutes

## 🛠️ Debugging Tools

### Browser Developer Tools

#### Console Commands
```javascript
// Check application state
console.log('Current user:', localStorage.getItem('currentUser'));
console.log('All localStorage:', localStorage);

// Test modules
console.log('Security module:', Security);
console.log('Validator module:', Validator);
console.log('Sanitizer module:', Sanitizer);

// Clear all data
localStorage.clear();
sessionStorage.clear();
```

#### Network Tab
- Check for failed resource loading
- Verify CDN resources load correctly
- Monitor API calls (if any)

#### Application Tab
- Inspect localStorage data
- Check service workers (if any)
- Monitor storage usage

### Testing Commands

#### Security Testing
```javascript
// Test rate limiting
for (let i = 0; i < 6; i++) {
  Security.recordFailedAttempt('test@example.com');
}

// Test input sanitization
const dangerous = '<script>alert("xss")</script>';
console.log('Sanitized:', Security.sanitizeInput(dangerous));

// Test password validation
const passwords = ['weak', 'StrongPass123!', 'password123'];
passwords.forEach(pwd => {
  console.log(pwd, Security.validatePasswordStrength(pwd));
});
```

#### Validation Testing
```javascript
// Test email validation
const emails = ['valid@example.com', 'invalid-email', 'test@'];
emails.forEach(email => {
  console.log(email, Validator.isValidEmail(email));
});

// Test URL validation
const urls = ['https://example.com', 'javascript:alert(1)', 'ftp://test.com'];
urls.forEach(url => {
  console.log(url, Validator.isValidURL(url));
});
```

## 📊 Performance Monitoring

### Performance Metrics
```javascript
// Measure page load time
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
});

// Monitor memory usage
setInterval(() => {
  if (performance.memory) {
    console.log('Memory usage:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
}, 30000);
```

### Storage Monitoring
```javascript
// Check localStorage usage
let totalSize = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    totalSize += localStorage[key].length;
  }
}
console.log('LocalStorage usage:', Math.round(totalSize / 1024), 'KB');

// Monitor storage quota
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(estimate => {
    console.log('Storage quota:', Math.round(estimate.quota / 1048576), 'MB');
    console.log('Storage usage:', Math.round(estimate.usage / 1048576), 'MB');
    console.log('Usage percentage:', Math.round(estimate.usage / estimate.quota * 100), '%');
  });
}
```

## 🔧 Quick Fixes

### Reset Application State
```javascript
// Complete application reset
function resetApplication() {
  // Clear all localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Reload page
  location.reload();
}

// Call this function to reset everything
resetApplication();
```

### Emergency Data Recovery
```javascript
// Export all localStorage data
function exportData() {
  const data = {};
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      data[key] = localStorage[key];
    }
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume-builder-backup.json';
  a.click();
}

// Import data from backup
function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    for (let key in data) {
      localStorage.setItem(key, data[key]);
    }
    location.reload();
  } catch (error) {
    console.error('Import failed:', error);
  }
}
```

## 📞 Getting Help

### Before Reporting Issues
1. **Check browser console** for error messages
2. **Try in incognito mode** to rule out extensions
3. **Test in different browser** to isolate browser-specific issues
4. **Clear cache and cookies** to eliminate cached problems
5. **Check internet connection** for CDN resource loading

### Information to Include
When reporting issues, please include:
- **Browser and version** (Chrome 91, Firefox 89, etc.)
- **Operating system** (Windows 10, macOS 11, etc.)
- **Error messages** from browser console
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable

### Emergency Contacts
- **GitHub Issues**: [Repository Issues Page]
- **Security Issues**: Follow SECURITY.md guidelines
- **Documentation Issues**: Create documentation PR

---

This troubleshooting guide covers the most common issues users encounter with the Resume Builder. For issues not covered here, please check the browser console for specific error messages and follow the debugging steps provided.