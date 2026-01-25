# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup and structure
- MIT License file
- .gitignore for common exclusions
- package.json with development scripts
- ESLint configuration for code quality
- Unit tests for validation module
- GitHub issue and PR templates
- GitHub Actions CI/CD workflow
- Security policy (SECURITY.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- Developer documentation (DEVELOPMENT.md)
- Accessibility improvements (ARIA labels)
- Input sanitization to prevent XSS attacks
- JSDoc comments for all functions

### Changed
- Enhanced README with comprehensive documentation
- Refactored global variables into modular scope

### Fixed
- XSS vulnerability in resume preview rendering
- Input validation and sanitization

### Security
- Added input sanitization for user-generated content
- Implemented CSP headers documentation

## [1.0.0] - 2026-01-15

### Added
- Live resume preview functionality
- Local storage persistence
- Multiple theme support (light/dark mode)
- Print-friendly resume layout
- Frontend authentication simulation
- Modular JavaScript architecture
- Responsive design
- Form validation
- Professional resume sections (Personal, Education, Experience, Skills, etc.)

---

## Release Notes Format

Unreleased changes are tracked above. Once released:

```
## [1.0.0] - YYYY-MM-DD
### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Features to be removed

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security-related changes
```
