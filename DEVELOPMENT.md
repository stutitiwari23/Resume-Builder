# Development Guide

---

**📌 Quick Navigation:**
- 🚀 **Getting Started?** → You are here!
- 👥 **How to Contribute?** → [CONTRIBUTION.md](CONTRIBUTION.md)  
- 🐛 **Debugging Issues?** → [Debugging Guide](docs/CONTRIBUTOR_DEBUGGING_PLAYBOOK.md)
- ❓ **Project Overview?** → [README.md](README.md)

---

Welcome to the Resume Builder development setup guide! This document provides everything you need to contribute and develop the project locally.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Development Workflow](#development-workflow)
5. [Project Structure](#project-structure)
6. [Available Scripts](#available-scripts)
7. [Debugging](#debugging)
8. [Testing](#testing)
9. [Code Quality](#code-quality)
10. [Browser DevTools](#browser-devtools)
11. [Common Issues](#common-issues)
12. [Best Practices](#best-practices)

---

## Prerequisites

Before you start, ensure you have:

### Required
- **Node.js** >= 14.0.0 - [Download](https://nodejs.org/)
- **npm** >= 6.0.0 - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Modern Browser** - Chrome, Firefox, Safari, or Edge (latest)

### Optional but Recommended
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **GitHub CLI** - [Download](https://cli.github.com/)
- **Docker** - For containerized development

### Verify Installation

```bash
node --version    # Should be >= 14.0.0
npm --version     # Should be >= 6.0.0
git --version     # Any recent version
```

---

## Installation

### 1. Clone the Repository

```bash
# Using HTTPS (recommended)
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder

# OR using SSH (if you have SSH key set up)
git clone git@github.com:yourusername/resume-builder.git
cd resume-builder
```

### 2. Install Dependencies

```bash
npm install
```

This installs all development dependencies specified in `package.json`.

### 3. Verify Installation

```bash
npm list          # View installed packages
npm audit         # Check for security vulnerabilities
```

---

## Running the Application

### Option 1: Direct File Opening (No Server)

```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

**Limitation**: Some features might not work (CORS, etc.)

### Option 2: Python HTTP Server

```bash
# Python 3.6+
python -m http.server 8000

# Python 2.7
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 3: npm Development Server (Recommended)

```bash
npm run dev
```

This starts `http-server` on port 8000 and auto-opens in your browser.

**Benefits:**
- ✅ Proper CORS handling
- ✅ Support for modern JS features
- ✅ Auto-refresh capable (with extensions)
- ✅ Development-friendly

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/add-pdf-export` - New features
- `fix/header-alignment-issue` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/simplify-storage` - Code improvements
- `test/add-validation-tests` - Tests

### 2. Make Changes

```bash
# Edit your files in VS Code or editor of choice
code .

# Or just use your preferred editor
```

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run unit tests
npm test

# Run tests in watch mode (rerun on file change)
npm run test:watch
```

### 4. Commit Your Work

```bash
# Stage changes
git add .

# Commit with clear message (follow commit conventions)
git commit -m "feat: Add PDF export functionality"

# Or interactive commit
git commit -i
```

**Commit message format:**
```
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore
scope: Optional - affected component (auth, storage, ui)
subject: Clear, present tense, imperative mood
```

Examples:
- `feat(resume): Add live preview auto-scroll`
- `fix(storage): Prevent data corruption on logout`
- `docs(readme): Update installation instructions`
- `test(validation): Add email format tests`

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create PR on GitHub
# Go to github.com/yourusername/resume-builder
# Click "Compare & pull request"
```

---

## Project Structure

```
resume-builder/
├── index.html                 # Landing page
├── resume-builder.html        # Main application
├── login.html                 # Auth pages
├── register.html
├── sign-in.html
├── sign-up.html
│
├── css/
│   ├── style.css             # Main styles
│   ├── responsive.css        # Mobile responsive
│   ├── resume-style.css      # Resume preview styles
│   ├── bootstrap.min.css     # Bootstrap framework
│   └── *.css                 # Other utilities
│
├── images/                    # Image assets
│   └── fevicon.png
│
├── js (new module structure)
│   ├── modules/
│   │   ├── storage.js        # LocalStorage management
│   │   ├── validation.js     # Input validation
│   │   ├── sanitizer.js      # XSS protection
│   │   └── theme.js          # Theme management
│   ├── resume.js             # Main app logic
│   └── auth.js               # Authentication
│
├── tests/                     # Unit tests
│   └── *.test.js
│
├── docs/
│   ├── DEVELOPMENT.md        # This file
│   ├── CONTRIBUTOR_DEBUG...  # Debugging guide
│   └── API.md                # API documentation (future)
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/            # GitHub Actions CI/CD
│   └── pull_request_template.md
│
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── jest.config.js            # Jest test configuration
├── package.json              # Dependencies & scripts
├── CHANGELOG.md              # Version history
├── CODE_OF_CONDUCT.md        # Community standards
├── SECURITY.md               # Security policy
├── CONTRIBUTION.md           # Contribution guidelines
├── LICENSE                   # MIT License
└── README.md                 # Project overview
```

---

## Available Scripts

```bash
# Running application
npm run dev           # Start dev server on http://localhost:8000

# Code quality
npm run lint          # Check code style with ESLint
npm run lint:fix      # Auto-fix ESLint issues

# Testing
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode (re-run on file change)
npm run test:coverage # Generate coverage report

# Production (if implemented)
# npm run build       # Bundle and minify for production
# npm run serve       # Serve production build
```

---

## Debugging

### Browser DevTools

#### Chrome/Edge/Firefox/Safari

1. **Open DevTools**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (macOS)

2. **Console Tab**
   - View logs, errors, warnings
   - Execute JS commands
   - Monitor network requests

3. **Elements/Inspector Tab**
   - Inspect HTML structure
   - Modify CSS live
   - Check computed styles

4. **Network Tab**
   - Monitor HTTP requests
   - Check response times
   - View network errors

5. **Sources Tab**
   - Set breakpoints
   - Step through code
   - Watch variables

6. **Application Tab**
   - View localStorage
   - Check cookies
   - Clear cache

### Using Console for Debugging

```javascript
// View stored data
console.log(localStorage.getItem('currentUser'));

// Monitor form input changes
document.getElementById('resume-form').addEventListener('input', (e) => {
  console.log('Input changed:', e.target.id, e.target.value);
});

// Check module functionality
console.log(Storage.getAll());
console.log(Validator.isValidEmail('test@example.com'));
```

### VS Code Debugging

1. **Install Debugger for Chrome** extension
2. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:8000",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

3. Press `F5` to start debugging

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

Create test files in `tests/` directory with `.test.js` extension:

```javascript
// tests/validation.test.js
const Validator = require('../validation');

describe('Validator', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email', () => {
      expect(Validator.isValidEmail('test@example.com')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(Validator.isValidEmail('invalid-email')).toBe(false);
    });
  });
});
```

### Test Structure

```
tests/
├── validation.test.js      # Tests for validation module
├── storage.test.js         # Tests for storage module
├── sanitizer.test.js       # Tests for sanitizer module
└── setup.js                # Jest setup/configuration
```

---

## Code Quality

### ESLint Configuration

ESLint enforces consistent code style. Configuration is in `.eslintrc.json`.

### Common Rules

```javascript
// ❌ Don't use var
var name = 'John';

// ✅ Use const/let instead
const name = 'John';
let count = 0;

// ❌ Don't leave console statements
console.log('debug');

// ✅ Remove or keep for warn/error
console.warn('Warning message');
console.error('Error message');

// ❌ Don't use == (equality)
if (x == 5) { }

// ✅ Use === (strict equality)
if (x === 5) { }

// ❌ Unused variables
const unused = 5;

// ✅ Remove or prefix with _
const _unused = 5;
```

### Running Linter

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Check specific file
npx eslint resume.js
```

### Pre-commit Hooks (Optional)

Install husky to run linting before commit:

```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

---

## Browser DevTools

### Performance Profiling

1. Open DevTools → Performance tab
2. Click "Record" (Ctrl+Shift+E)
3. Interact with the app
4. Click "Stop"
5. Analyze the timeline

### Memory Leaks

1. Open DevTools → Memory tab
2. Take heap snapshot
3. Interact with app
4. Take another snapshot
5. Compare to find leaks

### Network Analysis

1. Open DevTools → Network tab
2. Reload page
3. Check request waterfall
4. Optimize slow requests

---

## Common Issues

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 8000 already in use

**Solution:**
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8000
kill -9 <PID>

# Or use different port
npx http-server . -p 8001
```

### Issue: localStorage data lost

**Solution:**
- Check if cookies/site data cleared
- Verify browser privacy mode isn't enabled
- Check if localStorage quota exceeded
- Use browser DevTools → Application → LocalStorage

### Issue: Changes not reflecting

**Solution:**
```bash
# Hard refresh (bypass cache)
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)

# Or clear cache manually
DevTools → Application → Clear site data
```

### Issue: ESLint not detecting errors

**Solution:**
```bash
# Reinstall ESLint
npm install eslint --save-dev

# Verify .eslintrc.json is valid
npx eslint --init

# Check specific file
npx eslint --debug resume.js
```

---

## Best Practices

### Code Style

- ✅ Use 2-space indentation
- ✅ Use meaningful variable names
- ✅ Keep functions small and focused
- ✅ Add JSDoc comments for public functions
- ✅ Use const by default, let if needed, never var

### Commits

- ✅ Commit often with meaningful messages
- ✅ Use conventional commit format
- ✅ Keep commits atomic (one feature per commit)
- ✅ Write descriptive commit bodies

### Testing

- ✅ Write tests for new features
- ✅ Test edge cases and error scenarios
- ✅ Aim for >80% coverage
- ✅ Run tests before pushing

### Documentation

- ✅ Add JSDoc to functions
- ✅ Update README for major changes
- ✅ Add comments for complex logic
- ✅ Update CHANGELOG.md

### Security

- ✅ Always sanitize user input
- ✅ Never use innerHTML with user data
- ✅ Validate data before processing
- ✅ Check for XSS vulnerabilities
- ✅ Run npm audit regularly

### Performance

- ✅ Minimize DOM operations
- ✅ Use event delegation for dynamic elements
- ✅ Cache DOM selectors
- ✅ Avoid unnecessary re-renders
- ✅ Profile regularly with DevTools

---

## Getting Help

- **Issues**: Check [GitHub Issues](https://github.com/yourusername/resume-builder/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/yourusername/resume-builder/discussions)
- **Debugging**: See [CONTRIBUTOR_DEBUGGING_PLAYBOOK.md](docs/CONTRIBUTOR_DEBUGGING_PLAYBOOK.md)
- **Security**: See [SECURITY.md](SECURITY.md)

---

## Next Steps

1. ✅ Set up your development environment
2. 📖 Read [CONTRIBUTION.md](CONTRIBUTION.md)
3. 🐛 Check [open issues](https://github.com/yourusername/resume-builder/issues)
4. 🚀 Start contributing!

**Happy coding!** 🎉
