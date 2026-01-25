# Contributor Debugging Playbook

> A developer-first guide for troubleshooting common issues in Resume-Builder :)

---

**📌 Quick Navigation:**
- 🚀 **Getting Started?** → [DEVELOPMENT.md](../DEVELOPMENT.md)
- 👥 **How to Contribute?** → [CONTRIBUTION.md](../CONTRIBUTION.md)  
- 🐛 **Debugging Issues?** → You are here!
- ❓ **Project Overview?** → [README.md](../README.md)

---

This playbook documents common development issues, debugging workflows, and troubleshooting steps to help new and existing contributors quickly identify and fix problems while working on the Resume-Builder project.

## Table of Contents

1. [Environment Setup Issues](#environment-setup-issues)
2. [Dependency & Version Conflicts](#dependency--version-conflicts)
3. [Frontend Debugging Checklist](#frontend-debugging-checklist)
4. [Common Build Issues](#common-build-issues)
5. [Resume Data & Storage Issues](#resume-data--storage-issues)
6. [Styling & UI Problems](#styling--ui-problems)
7. [Logging Locations & Tips](#logging-locations--tips)
8. [Common Mistakes by New Contributors](#common-mistakes-by-new-contributors)
9. [When to Open an Issue vs Fix Locally](#when-to-open-an-issue-vs-fix-locally)

---

## Environment Setup Issues

### Problem: `npm install` fails with permission errors

**Causes:**
- Incorrect Node.js/npm installation
- Global npm packages installed with `sudo`
- Node version mismatch

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Check Node version (should be v14+ for modern JavaScript)
node --version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port already in use (usually 8000 or 3000)

**Causes:**
- Previous development server still running
- Another application using the same port

**Solution (Linux/Mac):**
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use a different port when starting the server
```

**Solution (Windows):**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Problem: Project won't start after clone

**Causes:**
- Missing dependencies
- Old node_modules cache
- Missing configuration files

**Solution:**
- Run `npm install` from project root
- Delete `node_modules` and `package-lock.json`, then reinstall
- Check that all required files are present (index.html, auth.js, resume.js, etc.)

---

## Dependency & Version Conflicts

### Problem: Different package versions breaking functionality

**Solution:**
```bash
# Use exact versions from package-lock.json
npm ci  # instead of npm install

# Check for deprecated packages
npm audit

# Update specific package
npm update <package-name>
```

### Problem: Module not found errors

**Causes:**
- Typo in import statement
- Missing dependency
- Incorrect file path

**Solution:**
```bash
# Verify the file exists
ls -la <path-to-file>

# Check the import statement for typos
# Reinstall dependencies
npm install
```

---

## Frontend Debugging Checklist

- [ ] Check browser console (F12 → Console tab)
- [ ] Look for red errors or yellow warnings
- [ ] Check if index.html is loading correctly
- [ ] Verify all JavaScript files are being loaded in Network tab
- [ ] Check CSS - use browser Inspector (F12 → Elements)
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Try incognito/private mode to exclude extensions
- [ ] Check if issue is in specific browser only
- [ ] Check Network tab for failed requests (4xx, 5xx status)

### Common Frontend Issues

**Blank page or white screen:**
- Check browser console for JavaScript errors
- Verify index.html exists in project root
- Check if all required scripts are loading in Network tab
- Check that auth.js and resume.js are properly initialized

**Styling not applied:**
- CSS file not imported in index.html
- CSS specificity issues
- Browser caching - hard refresh (Ctrl+Shift+R)
- Check that style.css is linked in index.html
- Verify theme.js is not overriding styles

**Resume data not displaying:**
- Check browser console for errors when loading resume
- Verify localStorage is enabled in browser
- Check that resume.js is properly reading from localStorage
- Inspect the localStorage keys using DevTools → Application tab

**Button clicks not working:**
- Check console for JavaScript errors
- Verify event listeners are attached in auth.js or resume.js
- Check that HTML elements have correct IDs/classes that match the JavaScript selectors

---

## Common Build Issues

### Problem: Files not updating after changes

**Causes:**
- Development server not watching for changes
- Browser caching old files
- File not saved

**Solution:**
- Hard refresh browser (Ctrl+Shift+R)
- Stop and restart development server
- Check that file was actually saved
- Close and reopen file in editor

### Problem: HTML changes not reflected

**Causes:**
- Browser cache
- Development server needs restart

**Solution:**
```bash
# Restart dev server
Ctrl+C to stop
npm start  # or npm run dev
```

---

## Resume Data & Storage Issues

### Problem: Resume data not saving

**Causes:**
- localStorage disabled in browser
- JavaScript errors preventing save
- Incorrect property names

**Solution:**
- Check browser console for errors
- Verify localStorage is enabled (Settings → Privacy)
- Check storage.js for any errors
- Verify the data structure being saved matches expectations

### Problem: Resume data lost after refresh

**Causes:**
- Data not being saved to localStorage
- localStorage being cleared
- Private/Incognito mode disables persistent storage

**Solution:**
- Check browser console when saving
- Verify localStorage keys using DevTools → Application → Storage → Local Storage
- Use regular browsing mode instead of incognito
- Check that resume.js is calling storage functions correctly

### Problem: Imported resume data not recognized

**Causes:**
- Incorrect JSON format
- Missing required fields
- Encoding issues

**Solution:**
- Validate JSON format (use JSONLint or browser console)
- Check that all required fields are present
- Verify field names match expected structure
- Check browser console for parsing errors

---

## Styling & UI Problems

### Problem: Layout breaking on certain screen sizes

**Causes:**
- CSS media queries not working
- Hard-coded dimensions
- Flexbox/Grid conflicts

**Solution:**
- Check viewport settings in index.html
- Verify meta viewport tag is present
- Test responsive design in DevTools (F12 → Toggle device toolbar)
- Check style.css for media queries

### Problem: Theme not switching properly

**Causes:**
- theme.js not toggling CSS classes
- CSS rules for dark/light mode not defined
- localStorage not persisting theme choice

**Solution:**
- Check theme.js for proper class toggling
- Verify style.css has both light and dark mode styles
- Check localStorage for theme key
- Verify toggle button is calling theme function correctly

### Problem: Colors or fonts not displaying correctly

**Causes:**
- CSS not loaded
- CSS specificity issues
- Font file not loading

**Solution:**
- Check Network tab to see if CSS loaded
- Verify font files are accessible
- Check browser console for CSS-related errors
- Use Inspector (F12 → Elements) to check computed styles

---

## Logging Locations & Tips

### Frontend Logs

**Browser Console:**
- Press F12 → Console tab
- Errors appear in red, warnings in yellow
- Add debug logs using `console.log()`, `console.error()`, `console.warn()`

**Inspect Storage:**
- Press F12 → Application tab
- View localStorage keys and values
- Check for resume data being stored

**Network Tab:**
- Press F12 → Network tab
- Shows all file loads (HTML, CSS, JS, images)
- Check status codes and load times
- Useful for finding missing files

### Adding Debug Logs

```javascript
// In your JavaScript files
console.log('Current resume data:', resumeData);
console.error('Error occurred:', error);
console.warn('This might cause issues:', value);

// Checkpoint logging
if (DEBUG) {
  console.log('Checkpoint reached');
}
```

---

## Common Mistakes by New Contributors

1. **Not reading the README and project structure** - Start with README.md to understand project layout and setup

2. **Modifying files without understanding the flow** - Understand how auth.js, resume.js, and storage.js interact before making changes

3. **Committing node_modules** - Should be in .gitignore; never add it

4. **Not testing in multiple browsers** - Resume builder should work in Chrome, Firefox, Safari, Edge

5. **Hardcoding values** - Use configuration or constants instead; support customization

6. **Ignoring linting errors** - Code quality matters; fix before submitting PR

7. **Not testing locally before pushing** - Always test your changes in browser before committing

8. **Opening PR without being assigned to issue** - Always get assigned to issue first, avoid duplicate work

9. **Not considering localStorage limitations** - Private/incognito mode disables persistent storage

10. **Breaking existing resume data structure** - Any schema changes need migration logic

---

## When to Open an Issue vs Fix Locally

### Open an Issue When:
- Bug cannot be reproduced locally
- Requires discussion/decision from maintainers
- Affects core architecture or data structure
- Needs input from multiple team members
- Unclear if it's a bug or intended behavior
- Browser-specific issues you can't test

### Fix Locally When:
- Clear reproduction steps
- Single component/file affected (auth.js, resume.js, style.css, etc.)
- You understand the root cause
- Fix doesn't impact other features or data structure
- You're assigned to the issue
- Can write test steps to verify fix

---

## Getting Help

1. **Check this playbook first** - Many issues are documented here
2. **Search existing issues** - Your problem might already have a solution
3. **Check PR comments** - Look for discussions about your issue type
4. **Ask in discussions** - Use GitHub Discussions for questions
5. **Check browser DevTools** - Console often reveals the actual problem
6. **Open an issue** - If truly stuck, provide reproduction steps and browser used

---

## Contributing to This Playbook

Found a bug that's not documented? Found a solution to a new problem?
Please open a PR or issue to help other contributors!

**Last Updated:** January 2026
