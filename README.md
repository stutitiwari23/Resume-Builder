# 🚀 Resume Builder

A modern, responsive **Resume Builder web application** that allows users to create clean, professional, and ATS-friendly resumes directly in the browser. The app focuses on simplicity, usability, and privacy — no backend or database required.

**Live Demo:** https://resume-builder-ashy-eight.vercel.app/

![Resume Builder](https://img.shields.io/badge/HTML-CSS-JavaScript-orange?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

### 🛠️ Resume Creation
- Form-based input for personal details, education, experience, and skills
- Real-time resume preview while typing
- Clean and professional resume layout
- Browser-based data handling (no backend required)

### 🎨 UI & Experience
- Fully responsive design (desktop, tablet, mobile)
- Simple and intuitive user interface
- Print-ready resume layout
- Privacy-friendly — data stays in the browser

---

## 🧰 Tech Stack

- **HTML5** – Structure
- **CSS3** – Styling & layout
- **JavaScript (Vanilla)** – Logic & interactivity
- **Deployment** – Vercel

---

# 📝 Resume Builder – Professional Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js->=14.0.0-brightgreen)](https://nodejs.org/)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20JS-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
![Status](https://img.shields.io/badge/status-active-success)

A modern, responsive resume builder web application built with **vanilla HTML, CSS, and JavaScript**. Create professional, ATS-friendly resumes with live preview, local data persistence, and zero backend dependencies.

**Live Demo:** [Try Resume Builder](https://your-demo-url.com) | **[Documentation](#documentation)** | **[Contributing](#contributing)**

This project demonstrates:
- Strong frontend fundamentals  
- Clean UI/UX thinking  
- Modular and production-ready architecture  
- Framework-free development  

## ✨ Features

- 📄 **Structured Resume Input** - Organized form sections for all resume components
- 🔄 **Live Preview** - Real-time resume updates as you type
- 💾 **Auto-Save** - Data persists in browser local storage per user
- 🎨 **Theme Support** - Light/Dark mode ready
- 🖨️ **Print-Friendly** - Professional print layout
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🔒 **Privacy-Focused** - All data stays local in your browser
- ⚡ **Zero Dependencies** - Pure vanilla JavaScript (no frameworks)
- ♿ **Accessible** - ARIA labels and semantic HTML
- 🚀 **Performance** - Fast loading with optimized CSS/JS

### Resume Sections Included

- Personal Information (Name, Email, Phone, Social Links)
- Professional Summary
- Education
- Skills
- Work Experience / Projects
- Achievements / Certifications
- Custom sections

---

## 🚀 Quick Start

### Option 1: Direct Usage (Recommended)
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-builder.git
   cd resume-builder
   ```

2. Open in your browser:
   ```bash
   # On Windows
   start index.html
   
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   ```

### Option 2: Using a Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (requires npm install)
npm run dev

# Using http-server
npx http-server . -p 8000 -o
```

Then open `http://localhost:8000` in your browser.

---

## 📋 System Requirements

- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Node.js**: v14+ (optional, for development tools)
- **Storage**: ~1MB local storage (typical)  


---

## 🔐 Security & Privacy

✅ **No backend server** - All data remains in your browser  
✅ **No external API calls** - Completely offline-capable  
✅ **No analytics** - Your data is never tracked  
✅ **Input sanitization** - Protected against XSS attacks  
✅ **Privacy policy**: See [SECURITY.md](SECURITY.md)

---

## 🛠️ Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Run linting
npm run lint
npm run lint:fix

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check code coverage
npm run test:coverage

# Start development server
npm run dev
```

### Project Scripts

```json
{
  "lint": "ESLint code quality check",
  "lint:fix": "Auto-fix ESLint issues",
  "test": "Run Jest unit tests",
  "test:watch": "Tests in watch mode",
  "test:coverage": "Coverage report",
  "dev": "Start local HTTP server on port 8000"
}
```

For detailed development instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

---

## 📖 Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Local setup and development guide
- [CONTRIBUTING.md](CONTRIBUTION.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards
- [SECURITY.md](SECURITY.md) - Security policy and vulnerability reporting
- [CHANGELOG.md](CHANGELOG.md) - Version history and changes
- [CONTRIBUTOR_DEBUGGING_PLAYBOOK.md](docs/CONTRIBUTOR_DEBUGGING_PLAYBOOK.md) - Debugging guide

---

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser
- Git (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/stutitiwari23/Resume-Builder.git
   cd Resume-Builder
2. Run the project

 Simply open index.html in your browser

OR

npx http-server .

Then visit http://localhost:8080

---

## Project Structure

Resume-Builder/
├── css/                # Stylesheets
├── images/             # Icons and images
├── docs/               # Documentation
├── tests/              # Test files
├── index.html          # Main landing page
├── resume-builder.html # Resume builder page
├── login.html          # Login page
├── register.html       # Registration page
├── style.css           # Global styles
├── resume.js           # Resume logic
├── sanitizer.js        # Input sanitization
└── README.md

## Hinghlights ⭐

 * Instant resume preview

* Clean, ATS-friendly formatting

* No account or backend needed

* Lightweight and fast

* Beginner-friendly codebase

# 🤝 Contributing

Thanks for your interest in contributing to **Resume Builder**!  
All contributions — bug fixes, features, UI improvements, and documentation — are welcome.

## 🚀 Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Resume-Builder.git
   cd Resume-Builder
2. **Create a Branch**
   
  git checkout -b feature/your-feature-name

 * Use meaningful branch names like:

 * feature/add-pdf-export

# 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment for everyone contributing to **Resume Builder**.

## 🤝 Our Standards

Please:
- Be respectful and kind
- Give constructive feedback
- Respect different viewpoints and experiences

Unacceptable behavior includes:
- Harassment or discrimination
- Trolling or insulting comments
- Any form of abusive behavior
## 🤝 Contributing

We welcome contributions from developers of all levels! Whether it's bug fixes, new features, documentation, or translations, your help is appreciated.

### Quick Start to Contributing

1. **Fork the repository** - Click "Fork" on GitHub
2. **Create a feature branch** - `git checkout -b feature/your-feature-name`
3. **Make your changes** - Follow the [CONTRIBUTING.md](CONTRIBUTION.md) guidelines
4. **Test your changes** - Run `npm test` and `npm run lint`
5. **Commit with clear messages** - `git commit -m "Add: Feature description"`
6. **Push to your fork** - `git push origin feature/your-feature-name`
7. **Submit a Pull Request** - We'll review and merge!

For detailed contribution guidelines, see [CONTRIBUTION.md](CONTRIBUTION.md).

### Areas for Contribution

- 🐛 **Bug fixes** - Report issues or submit fixes
- ✨ **Features** - New resume sections, export formats (PDF, DOCX)
- 📚 **Documentation** - Improve guides and comments
- ♿ **Accessibility** - ARIA improvements, keyboard navigation
- 🌍 **Internationalization** - Add language support
- 🎨 **Design** - UI/UX improvements, new themes
- 🧪 **Testing** - Add unit and integration tests
- ⚡ **Performance** - Optimization suggestions

---

## 📊 Tech Stack

- **HTML5** – Semantic structure  
- **CSS3** – Responsive layout, theming, and print styles  
- **Vanilla JavaScript** – DOM manipulation, state management, and storage  
- **No External Dependencies** - Framework-free development

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

### You Can:
✅ Use commercially  
✅ Modify the code  
✅ Distribute freely  
✅ Use privately  

### You Must:
📝 Include the license  
📝 Include copyright notice  

---

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/resume-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/resume-builder/discussions)
- **Documentation**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Security**: See [SECURITY.md](SECURITY.md) for vulnerability reporting

---

## 🌟 Credits

Built by the Resume Builder community and contributors.

**Original Author**: Stuti Tiwari (BCA, 2025)

Special thanks to all [contributors](https://github.com/yourusername/resume-builder/graphs/contributors).

## 🚨 Enforcement

Project maintainers have the right to remove or edit contributions that violate this code of conduct.

---

By participating in this project, you agree to follow this Code of Conduct.

Thank you for helping keep this community respectful and welcoming ❤️
---

## 💡 Tips for Users

- **Export Resume**: Use browser print (Ctrl+P / Cmd+P) and save as PDF
- **Share Resume**: Your resume URL won't work on other devices (local storage). Export as PDF instead.
- **Data Backup**: Periodically export and save your resume
- **Privacy**: Your data never leaves your browser

---

## ⚠️ Current Limitations

- Authentication is frontend-only  
- Data is stored per browser/device  
- No cloud sync or multi-device support  

These constraints are intentional to keep the project framework-free and focused on frontend architecture. Future versions may add optional backend support.

---

**Made with ❤️ by the community. Happy resume building! 🚀**

