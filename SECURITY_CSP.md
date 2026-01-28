# Content Security Policy (CSP) Configuration Guide

## Overview

Content Security Policy (CSP) is a security standard that helps prevent Cross-Site Scripting (XSS) attacks, data injection attacks, and other code injection attacks. This guide provides CSP configuration for the Resume Builder application.

## 🔒 Recommended CSP Headers

### For Production Deployment

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

### For Development (More Permissive)

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: http:;
  connect-src 'self' ws: wss:;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

## 🛠️ Implementation Methods

### 1. HTTP Headers (Recommended)

#### Apache (.htaccess)
```apache
<IfModule mod_headers.c>
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
</IfModule>
```

#### Nginx
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;" always;
```

#### Node.js/Express
```javascript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
  );
  next();
});
```

### 2. HTML Meta Tag (Fallback)

Add to the `<head>` section of your HTML files:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';">
```

## 📋 CSP Directive Explanations

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Default policy for all resource types |
| `script-src` | `'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net` | Allow scripts from same origin, inline scripts, and trusted CDNs |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net` | Allow styles from same origin, inline styles, and Google Fonts |
| `font-src` | `'self' https://fonts.gstatic.com` | Allow fonts from same origin and Google Fonts |
| `img-src` | `'self' data: https:` | Allow images from same origin, data URLs, and HTTPS sources |
| `connect-src` | `'self'` | Allow AJAX/fetch requests only to same origin |
| `frame-src` | `'none'` | Block all iframe embedding |
| `object-src` | `'none'` | Block plugins like Flash |
| `base-uri` | `'self'` | Restrict base tag URLs |
| `form-action` | `'self'` | Restrict form submission targets |
| `upgrade-insecure-requests` | - | Automatically upgrade HTTP to HTTPS |

## 🚨 Security Considerations

### Why 'unsafe-inline' is Used

The Resume Builder currently uses inline scripts and styles, which require `'unsafe-inline'`. This reduces security but is necessary for current functionality.

**Future Improvements:**
- Move all inline scripts to external files
- Use nonces or hashes for specific inline scripts
- Implement CSP Level 3 features

### Trusted External Sources

The CSP allows these external sources:
- **cdnjs.cloudflare.com**: For html2pdf.js library
- **cdn.jsdelivr.net**: For Bootstrap and other libraries
- **fonts.googleapis.com**: For Google Fonts CSS
- **fonts.gstatic.com**: For Google Fonts files

## 🧪 Testing Your CSP

### 1. Browser Developer Tools
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for CSP violation errors
4. Adjust policy as needed

### 2. CSP Report-Only Mode

For testing, use `Content-Security-Policy-Report-Only` header:

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
```

### 3. Online CSP Validators

- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Validator](https://cspvalidator.org/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

## 🔧 Troubleshooting Common Issues

### Issue: Scripts Not Loading
**Error:** `Refused to execute inline script because it violates CSP`
**Solution:** Add `'unsafe-inline'` to `script-src` or move scripts to external files

### Issue: Styles Not Applied
**Error:** `Refused to apply inline style because it violates CSP`
**Solution:** Add `'unsafe-inline'` to `style-src` or use external stylesheets

### Issue: Images Not Loading
**Error:** `Refused to load image because it violates CSP`
**Solution:** Add appropriate domains to `img-src` or use `https:` for all HTTPS images

### Issue: Fonts Not Loading
**Error:** `Refused to load font because it violates CSP`
**Solution:** Add font domains to `font-src` (e.g., `https://fonts.gstatic.com`)

## 📈 CSP Monitoring

### Setting Up CSP Reporting

```http
Content-Security-Policy: default-src 'self'; report-uri /csp-report-endpoint;
```

### Example Report Endpoint (Node.js)

```javascript
app.post('/csp-report-endpoint', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).end();
});
```

## 🎯 Best Practices

1. **Start with Report-Only**: Test CSP without blocking content
2. **Use Specific Sources**: Avoid wildcards like `*` or `https:`
3. **Regular Updates**: Review and update CSP as dependencies change
4. **Monitor Violations**: Set up reporting to catch issues
5. **Gradual Tightening**: Start permissive, then gradually restrict
6. **Test Thoroughly**: Test all functionality after CSP changes

## 🔄 Migration Path

### Phase 1: Current State (Permissive)
- Allow `'unsafe-inline'` for scripts and styles
- Allow necessary external domains

### Phase 2: Inline Script Removal
- Move inline scripts to external files
- Remove `'unsafe-inline'` from `script-src`
- Use nonces or hashes for remaining inline scripts

### Phase 3: Style Optimization
- Move inline styles to external files
- Remove `'unsafe-inline'` from `style-src`
- Use CSS custom properties for dynamic styling

### Phase 4: Strict CSP
- Remove all `'unsafe-*'` directives
- Use nonces/hashes for any remaining inline content
- Implement CSP Level 3 features

## 📚 Additional Resources

- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google CSP Guide](https://developers.google.com/web/fundamentals/security/csp)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [CSP Level 3 Specification](https://www.w3.org/TR/CSP3/)

---

**Note**: This CSP configuration is tailored for the Resume Builder application. Adjust the policy based on your specific deployment environment and security requirements.