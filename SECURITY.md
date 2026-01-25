# Security Policy

## Security Commitment

We take the security of the Resume Builder project seriously. This document outlines our security practices and how to report vulnerabilities responsibly.

---

## Supported Versions

| Version | Status | Security Updates |
|---------|--------|-----------------|
| 1.0.x   | Current | ✅ Actively supported |

Security updates will be released for the current major version. Users are encouraged to upgrade to the latest version.

---

## Vulnerability Reporting

### ⚠️ PLEASE DO NOT file public GitHub issues for security vulnerabilities

**If you discover a security vulnerability, please report it responsibly:**

1. **Email**: Send details to [security contact - update with your email]
   - Subject: `[SECURITY] Resume Builder Vulnerability Report`
   - Include: Description, affected components, reproduction steps, impact assessment

2. **GitHub Security Advisory**: Use GitHub's [Security Advisory feature](https://docs.github.com/en/code-security/security-advisories)
   - Go to Security tab → Advisories → Report a vulnerability

3. **Response Timeline**:
   - We aim to acknowledge vulnerability reports within 48 hours
   - We'll investigate and provide updates every 5-7 days
   - Critical vulnerabilities will be patched immediately
   - You'll be credited (if desired) when the fix is released

---

## Security Considerations

### Frontend-Only Architecture

**Strengths:**
- ✅ No server-side vulnerabilities (SQL injection, server exploits, etc.)
- ✅ No data transmission to external servers
- ✅ All processing happens locally in the browser
- ✅ Users have full control over their data

**Limitations:**
- ⚠️ Browser security vulnerabilities could affect users
- ⚠️ XSS attacks possible if user input isn't sanitized
- ⚠️ Local storage vulnerable if device is compromised

### Known Mitigations

1. **XSS Prevention**
   - All user input is sanitized before DOM insertion
   - `sanitizer.js` module handles HTML escaping
   - No `innerHTML` used with user-controlled data

2. **Input Validation**
   - Email, phone, URL formats validated
   - Maximum field lengths enforced
   - Dangerous URL schemes (javascript:, data:) blocked

3. **Data Privacy**
   - All data stored locally in browser's localStorage
   - No external API calls
   - No analytics or tracking
   - No personal data ever leaves the user's device

4. **Code Quality**
   - ESLint configuration enforces security best practices
   - Regular code reviews recommended for PRs
   - Dependencies kept minimal (no third-party libraries)

---

## Best Practices for Users

1. **Keep Your Browser Updated**
   - Ensure your browser has the latest security patches
   - Use a modern browser (Chrome, Firefox, Safari, Edge)

2. **Browser Security Settings**
   - Enable browser security features (CSP, SOP, etc.)
   - Don't disable JavaScript or browser protections
   - Be cautious with browser extensions

3. **Data Backup**
   - Regularly export your resume as PDF
   - Don't rely solely on local storage
   - Consider keeping backed-up copies

4. **Device Security**
   - Use a secure, password-protected device
   - Keep your OS and applications updated
   - Be cautious of malware and spyware

5. **Account Security**
   - Use strong, unique passwords for your GitHub account
   - Enable two-factor authentication (2FA)
   - Never share authentication credentials

---

## Security Headers & Configuration

### Recommended Server Configuration (if self-hosting)

```
# Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;

# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Enable XSS protection
X-XSS-Protection: 1; mode=block

# Prevent clickjacking
X-Frame-Options: SAMEORIGIN

# Enable HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Referrer policy
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Dependency Security

### Current Dependencies

This project has **zero production dependencies** (framework-free).

**Development dependencies:**
- `eslint` - Code quality (no execution in production)
- `jest` - Testing (no execution in production)
- `http-server` - Development only

**Why minimal dependencies?**
- Reduces attack surface
- No dependency vulnerabilities to track
- Faster, more reliable application
- Better for users' privacy

### Dependency Updates

When adding new dependencies:
1. Use `npm audit` to check for vulnerabilities
2. Keep dependencies up-to-date
3. Review dependency code when possible
4. Prefer well-maintained packages with active security updates

---

## Security Review Checklist

Before each release:

- [ ] Run `npm audit` - check for dependency vulnerabilities
- [ ] Run `npm run lint` - code quality checks
- [ ] Run `npm test` - ensure tests pass
- [ ] Review user input handling
- [ ] Check for unescaped content in DOM
- [ ] Verify no console.log of sensitive data
- [ ] Test in modern browsers
- [ ] Check browser DevTools for security warnings
- [ ] Review recent commits for security issues

---

## Vulnerability Disclosure

When a vulnerability is reported:

1. **Immediate Actions**
   - Acknowledge receipt of the report
   - Begin investigation and assessment
   - Develop a fix or mitigation strategy

2. **Development**
   - Create a fix in a private branch
   - Write tests for the vulnerability
   - Document the issue and fix

3. **Release**
   - Publish a minor version bump with the fix
   - Release security advisory
   - Credit the researcher (if they consent)

4. **Communication**
   - Update [SECURITY.md](SECURITY.md) if needed
   - Add entry to [CHANGELOG.md](CHANGELOG.md)
   - Notify users of the update

---

## Third-Party Security

### Services Used

- **GitHub** - Code hosting and CI/CD
  - Review: [GitHub Security](https://github.com/security)
  - 2FA recommended for contributors

- **npm** - Package management
  - Review: [npm Security](https://www.npmjs.com/security)
  - `npm audit` regularly run

---

## Contributing to Security

Help improve security by:

1. 🔍 **Code Review** - Review PRs for security issues
2. 📚 **Documentation** - Improve security guides
3. 🧪 **Testing** - Write security-focused tests
4. 🐛 **Reporting** - Responsibly disclose vulnerabilities
5. 💡 **Suggestions** - Propose security improvements

---

## Security Resources

- [OWASP Top 10](https://owasp.org/Top10/) - Web application security risks
- [Mozilla Web Security](https://infosec.mozilla.org/) - Security best practices
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/) - Most dangerous software weaknesses
- [Web.dev Security](https://web.dev/security/) - Web security fundamentals

---

## Support

- **Questions**: Open an issue with `[SECURITY]` tag
- **Vulnerabilities**: Email security contact (see above)
- **Discussion**: GitHub Discussions for security topics

---

**Thank you for helping keep Resume Builder secure! 🔒**

Last Updated: January 15, 2026
