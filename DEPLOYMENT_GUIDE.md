# Resume Builder - Deployment Guide

## 🚀 Overview

This guide provides comprehensive instructions for deploying the Resume Builder application in various environments. The application is designed as a static web application with no backend dependencies.

## 📋 Prerequisites

### System Requirements
- **Web Server**: Apache, Nginx, or any static file server
- **HTTPS**: SSL certificate (required for security features)
- **Modern Browser Support**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Optional Requirements
- **Node.js**: For development and testing (v18+)
- **Git**: For version control and deployment automation
- **Docker**: For containerized deployments

## 🌐 Deployment Options

### 1. Static Hosting Platforms (Recommended)

#### Vercel (Current Production)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Configure custom domain (optional)
vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from project root
netlify deploy

# Production deployment
netlify deploy --prod
```

**Configuration** (`netlify.toml`):
```toml
[build]
  publish = "."
  
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

#### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Select source: Deploy from a branch
# Branch: main / (root)

# Custom domain setup (optional)
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### 2. Self-Hosted Deployment

#### Apache Configuration

**Virtual Host** (`/etc/apache2/sites-available/resume-builder.conf`):
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/resume-builder
    
    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/resume-builder
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # Security Headers
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
    
    # Caching
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/ico "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
    </IfModule>
</VirtualHost>
```

**Deployment Steps**:
```bash
# 1. Clone repository
git clone https://github.com/YUVRAJ-SINGH-3178/Resume-Builder.git
cd Resume-Builder

# 2. Copy files to web directory
sudo cp -r * /var/www/resume-builder/

# 3. Set permissions
sudo chown -R www-data:www-data /var/www/resume-builder
sudo chmod -R 755 /var/www/resume-builder

# 4. Enable site
sudo a2ensite resume-builder.conf
sudo systemctl reload apache2
```

#### Nginx Configuration

**Server Block** (`/etc/nginx/sites-available/resume-builder`):
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /var/www/resume-builder;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(md|json|lock)$ {
        deny all;
    }
}
```

**Deployment Steps**:
```bash
# 1. Clone and setup
git clone https://github.com/YUVRAJ-SINGH-3178/Resume-Builder.git
sudo cp -r Resume-Builder/* /var/www/resume-builder/

# 2. Set permissions
sudo chown -R www-data:www-data /var/www/resume-builder
sudo chmod -R 755 /var/www/resume-builder

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/resume-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Docker Deployment

#### Dockerfile
```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Nginx Configuration (`docker/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Security Headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

#### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  resume-builder:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    volumes:
      - ./logs:/var/log/nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**Deployment Commands**:
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Update deployment
docker-compose pull
docker-compose up -d --force-recreate
```

## 🔧 Environment Configuration

### Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
python -m http.server 8000
# or
npx http-server -p 8000
```

### Production Environment

#### Environment Variables
```bash
# Optional environment variables for advanced deployments
export NODE_ENV=production
export RESUME_BUILDER_DOMAIN=yourdomain.com
export RESUME_BUILDER_CDN_URL=https://cdn.yourdomain.com
```

#### Build Process (if using build tools)
```bash
# Install build dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Build for production (if applicable)
npm run build
```

## 🔒 Security Configuration

### SSL/TLS Setup

#### Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache
# or for Nginx
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --apache -d yourdomain.com
# or for Nginx
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Custom SSL Certificate
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate certificate signing request
openssl req -new -key private.key -out certificate.csr

# Install certificate files
sudo cp certificate.crt /etc/ssl/certs/
sudo cp private.key /etc/ssl/private/
sudo chmod 600 /etc/ssl/private/private.key
```

### Security Headers Verification
```bash
# Test security headers
curl -I https://yourdomain.com

# Use online tools
# - https://securityheaders.com/
# - https://observatory.mozilla.org/
```

## 📊 Monitoring & Maintenance

### Log Configuration

#### Apache Logs
```apache
# Add to virtual host
ErrorLog ${APACHE_LOG_DIR}/resume-builder-error.log
CustomLog ${APACHE_LOG_DIR}/resume-builder-access.log combined
LogLevel warn
```

#### Nginx Logs
```nginx
# Add to server block
access_log /var/log/nginx/resume-builder-access.log;
error_log /var/log/nginx/resume-builder-error.log warn;
```

### Performance Monitoring
```bash
# Monitor server resources
htop
iostat -x 1
df -h

# Monitor web server
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/apache2/access.log
```

### Backup Strategy
```bash
# Backup application files
tar -czf resume-builder-backup-$(date +%Y%m%d).tar.gz /var/www/resume-builder

# Backup web server configuration
tar -czf webserver-config-backup-$(date +%Y%m%d).tar.gz /etc/nginx/sites-available /etc/apache2/sites-available

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/resume-builder"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/resume-builder-$DATE.tar.gz /var/www/resume-builder
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## 🚀 CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)
```yaml
name: Deploy Resume Builder

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
    - name: Run security audit
      run: npm audit
    - name: Run linting
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to production
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## 🔍 Troubleshooting

### Common Issues

#### 1. HTTPS Mixed Content Errors
```javascript
// Ensure all external resources use HTTPS
// Check console for mixed content warnings
// Update CDN links to use HTTPS
```

#### 2. CSP Violations
```bash
# Check browser console for CSP errors
# Update CSP headers to allow necessary resources
# Test with CSP report-only mode first
```

#### 3. LocalStorage Issues
```javascript
// Check if localStorage is available
if (typeof(Storage) !== "undefined") {
  // localStorage is supported
} else {
  // No web storage support
  alert("Please use a modern browser");
}
```

#### 4. Performance Issues
```bash
# Enable compression
# Optimize images
# Use CDN for static assets
# Enable browser caching
```

### Health Checks
```bash
# Basic connectivity
curl -I https://yourdomain.com

# SSL certificate check
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# DNS resolution
nslookup yourdomain.com

# Performance test
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
```

## 📈 Scaling Considerations

### CDN Integration
```javascript
// Configure CDN for static assets
const CDN_BASE_URL = 'https://cdn.yourdomain.com';

// Update asset URLs
const cssLink = document.createElement('link');
cssLink.href = `${CDN_BASE_URL}/css/style.css`;
```

### Load Balancing
```nginx
# Nginx load balancer configuration
upstream resume_builder {
    server 192.168.1.10:80;
    server 192.168.1.11:80;
    server 192.168.1.12:80;
}

server {
    listen 80;
    location / {
        proxy_pass http://resume_builder;
    }
}
```

---

This deployment guide provides comprehensive instructions for deploying the Resume Builder in various environments. Choose the deployment method that best fits your infrastructure and requirements.