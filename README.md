# 📝 Resume Builder – Local Web Application

A clean, modern, and fully frontend **Resume Builder web application** that enables users to create professional, ATS-friendly resumes with a **live preview** and **local data persistence** — built using **only HTML, CSS, and Vanilla JavaScript**.

This project is designed to demonstrate:
- Strong frontend fundamentals  
- Clean UI/UX thinking  
- Modular and production-ready architecture  
- Framework-free development  

## ✨ Features


- 📄 Structured resume input form  
- 🔄 Live resume preview  
- 💾 Auto-save per user (local storage)  
- 🎨 Theme support (light/dark mode ready)  
- 🖨️ Print-friendly resume layout  
- 🧩 Modular JavaScript architecture  

### Resume Sections
---
- Personal Information  
- Professional Summary  
- Education  
- Skills  
- Experience / Projects  
- Achievements / Certifications  

Each section updates the resume in real time and persists data locally.


## 🧱 Project Architecture

The application follows a **modular, separation-of-concerns architecture** where each JavaScript file handles a specific responsibility:

```

User Input (Form)
│
▼
resume.js ───────────► Live Preview Renderer
│
▼
storage.js ──────────► Local Storage Persistence
│
▼
auth.js ─────────────► Frontend User Handling
│
▼
theme.js ────────────► Theme & UI Preferences

```

### Architectural Flow
---

1. The user enters data into the form (`index.html`).
2. `resume.js` listens to input events and updates the resume preview in real time.
3. `storage.js` stores and retrieves data using `localStorage`, enabling auto-save per user.
4. `auth.js` manages basic frontend-only user identity.
5. `theme.js` handles UI preferences such as theme selection.
6. `style.css` controls layout, responsiveness, and print styling.

This structure ensures:
- Clear separation of logic  
- Easy maintainability  
- Scalability for future features  
- Clean debugging and testing  



## 📂 Project Structure

```

├── index.html
├── style.css
├── auth.js
├── resume.js
├── storage.js
├── theme.js
└── README.md

```
## 🛠️ Tech Stack


- **HTML5** – Semantic structure  
- **CSS3** – Responsive layout, theming, and print styles  
- **Vanilla JavaScript** – DOM manipulation, state management, and storage  


## ⚠️ Limitations


- Authentication is frontend-only  
- Data is stored per browser/device  
- No cloud sync or multi-device support  

These constraints are intentional to keep the project framework-free and focused on frontend architecture.



## 👩‍💻 Author


**Stuti Tiwari**  
Bachelor of Computer Applications (BCA), 2025  
Frontend Development | UI/UX | Web Applications  


## 📜 License


This project is open-source and free to use for learning and portfolio purposes.

