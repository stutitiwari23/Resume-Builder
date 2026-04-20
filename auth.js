// auth.js - Handles simulated authentication, registration, login, logout, and session persistence

document.addEventListener('DOMContentLoaded', function () {

  /* =======================
       ELEMENT REFERENCES
    ======================== */
  const authSection = document.getElementById('auth-section');
  const resumeSection = document.getElementById('resume-section');
  const landingSection = document.getElementById('landing-section');

  const registerForm = document.getElementById('register');
  const loginForm = document.getElementById('login');

  const showLogin = document.getElementById('show-login');
  const showRegister = document.getElementById('show-register');

  const logoutBtn = document.getElementById('logout');
  const topLoginBtn = document.getElementById('show-login-top');
  const topRegisterBtn = document.getElementById('show-register-top');
  const ctaBtn = document.getElementById('cta-create');

  const userNameEl = document.getElementById('user-name');
  const downloadResumeBtn = document.getElementById('download-resume');

  const regCloseBtn = document.querySelector('.register-close-auth');
  const loginCloseBtn = document.querySelector('.login-colse-auth');

  const nameError = document.getElementById('name-error-message');
  const emailError = document.getElementById('email-error-message');
  const passwordError = document.getElementById('password-error-message');

  /* =======================
       SESSION CHECK (SAFE)
    ======================== */
  const currentUser = localStorage.getItem('currentUser');
  const userData = currentUser ? getUserData(currentUser) : null;

  // Resume Builder page should never be auto-hidden
  if (resumeSection) {
    resumeSection.classList.remove('hidden');
  }

  // Download button visibility (safe)
  if (downloadResumeBtn) {
    if (currentUser && userData?.session) {
      downloadResumeBtn.classList.remove('hidden');
    } else {
      downloadResumeBtn.classList.add('hidden');
    }
  }

  /* =======================
       HELPER FUNCTIONS
    ======================== */
  
  // Check if href points to a separate auth page
  function isSeparateAuthPage(href) {
    if (!href) return false;
    const authPages = ['login.html', 'register.html', 'sign-in.html', 'sign-up.html'];
    return authPages.some(page => href.includes(page));
  }

  /* =======================
       FORM TOGGLE LOGIC
    ======================== */
  
  // For links that should show modal auth forms (on resume-builder page)
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAuthForms('login');
    });
  }

  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAuthForms('register');
    });
  }

  // For top navigation login/register buttons
  // These should:
  // 1. If href points to separate page (sign-in.html, sign-up.html) -> allow normal navigation
  // 2. If authSection exists (modal on resume-builder page) -> show modal
  if (topLoginBtn) {
    topLoginBtn.addEventListener('click', (e) => {
      const href = topLoginBtn.getAttribute('href') || '';
      
      // If link points to separate auth page, allow normal navigation
      if (isSeparateAuthPage(href)) {
        return;
      }
      
      // Only prevent default and show modal if auth section exists
      if (authSection) {
        e.preventDefault();
        showAuthSection();
        toggleAuthForms('login');
      }
    });
  }

  if (topRegisterBtn) {
    topRegisterBtn.addEventListener('click', (e) => {
      const href = topRegisterBtn.getAttribute('href') || '';
      
      // If link points to separate auth page, allow normal navigation
      if (isSeparateAuthPage(href)) {
        return;
      }
      
      // Only prevent default and show modal if auth section exists
      if (authSection) {
        e.preventDefault();
        showAuthSection();
        toggleAuthForms('register');
      }
    });
  }

  // CTA Create button
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      const href = ctaBtn.getAttribute('href') || '';
      
      // Check if user is logged in
      const isLoggedIn = currentUser && userData?.session;
      
      // If logged in and href points to resume-builder, allow navigation
      if (isLoggedIn && href.includes('resume-builder')) {
        return;
      }
      
      // If not logged in and auth section exists, show auth modal
      if (!isLoggedIn && authSection) {
        e.preventDefault();
        showAuthSection();
        toggleAuthForms('login');
      }
      
      // Otherwise allow default navigation
    });
  }

  /* =======================
       REGISTER
    ======================== */
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = Security.sanitizeInput(document.getElementById('reg-fullname').value.trim());
      const email = Security.sanitizeInput(document.getElementById('reg-email').value.trim());
      const password = document.getElementById('reg-password').value;

      if (!fullName || fullName.length < 2) {
        if (nameError) {
          nameError.textContent = 'Please enter a valid name';
        }
        return;
      }

      if (!Validator.isValidEmail(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email';
        }
        return;
      }

      if (!Validator.validatePassword(password).isValid) {
        const passwordValidation = Security.validatePasswordStrength(password);
        if (passwordError) {
          passwordError.textContent = passwordValidation.feedback.join('. ');
        }
        return;
      }

      if (getUserData(email)) {
        ValidationUI.showError('reg-email', 'Email already registered');
        return;
      }

      const newUser = {
        fullName,
        password,
        profile: { fullname: fullName, email },
        resume: {},
        theme: 'light',
        session: false
      };

      saveUserData(email, newUser);
      ValidationUI.showToast('Registration successful! Please login.', 'success');
      registerForm.reset();
      toggleAuthForms('login');
    });
  }

  /* =======================
       LOGIN
    ======================== */
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Check if client is blocked due to too many failed attempts
      const blockStatus = Security.isClientBlocked();
      if (blockStatus.blocked) {
        const remainingMinutes = Math.ceil(blockStatus.remainingTime / 60000);
        ValidationUI.showToast(
          `Too many failed attempts. Please try again in ${remainingMinutes} minutes.`, 
          'error'
        );
        return;
      }

      // Sanitize inputs
      const sanitizedEmail = Security.sanitizeInput(email);
      const sanitizedPassword = Security.sanitizeInput(password);

      const user = getUserData(sanitizedEmail);
      if (!user || user.password !== sanitizedPassword) {
        // Record failed attempt
        const rateLimitStatus = Security.recordFailedAttempt(sanitizedEmail, 'Invalid credentials');
        
        if (rateLimitStatus.blocked) {
          ValidationUI.showToast(rateLimitStatus.message, 'error');
        } else {
          ValidationUI.showToast(
            `Invalid credentials. ${rateLimitStatus.attemptsRemaining} attempts remaining.`, 
            'error'
          );
        }
        return;
      }

      // Successful login
      Security.recordSuccessfulLogin(sanitizedEmail);
      user.session = true;
      saveUserData(sanitizedEmail, user);
      localStorage.setItem('currentUser', sanitizedEmail);

      ValidationUI.showToast('Login successful!', 'success');
      showResumeSection();
    });
  }

  /* =======================
       LOGOUT
    ======================== */
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = getUserData(currentUser);
        if (user) {
          user.session = false;
          saveUserData(currentUser, user);
        }
        localStorage.removeItem('currentUser');
      }
      ValidationUI.showToast('Logged out', 'info');
      showLanding();
    });
  }

  /* =======================
       CLOSE AUTH MODAL
    ======================== */
  if (regCloseBtn) {
    regCloseBtn.addEventListener('click', () => {
      authSection?.classList.add('hidden');
      registerForm?.reset();
    });
  }

  if (loginCloseBtn) {
    loginCloseBtn.addEventListener('click', () => {
      authSection?.classList.add('hidden');
      loginForm?.reset();
    });
  }

  /* =======================
       VIEW HELPERS
    ======================== */
  function toggleAuthForms(type) {
    const regForm = document.getElementById('register-form');
    const logForm = document.getElementById('login-form');

    if (!regForm || !logForm) {
      return;
    }

    if (type === 'login') {
      regForm.classList.add('hidden');
      logForm.classList.remove('hidden');
    } else {
      logForm.classList.add('hidden');
      regForm.classList.remove('hidden');
    }
  }

  function showLanding() {
    landingSection?.classList.remove('hidden');
    authSection?.classList.add('hidden');
    resumeSection?.classList.add('hidden');
  }

  function showAuthSection() {
    authSection?.classList.remove('hidden');
    landingSection?.classList.remove('hidden');
    resumeSection?.classList.add('hidden');
  }

  function showResumeSection() {
    resumeSection?.classList.remove('hidden');
    authSection?.classList.add('hidden');
    landingSection?.classList.add('hidden');

    if (userNameEl && currentUser) {
      userNameEl.textContent = userData?.fullName || currentUser;
      userNameEl.classList.remove('hidden');
    }

    loadUserData?.();
  }

  /* =======================
       AUTO-REDIRECT FOR LOGGED-IN USERS
    ======================== */
  // If on sign-in.html or sign-up.html and already logged in, redirect to resume-builder
  const currentPath = window.location.pathname;
  if (currentUser && userData?.session) {
    if (currentPath.includes('sign-in.html') || 
        currentPath.includes('sign-up.html') ||
        currentPath.includes('login.html') ||
        currentPath.includes('register.html')) {
      // Already logged in, redirect to resume builder
      window.location.href = './resume-builder.html';
    }
  }

});
