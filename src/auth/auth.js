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
       FORM TOGGLE LOGIC
    ======================== */
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

  if (topLoginBtn) {
    topLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthSection();
      toggleAuthForms('login');
    });
  }

  if (topRegisterBtn) {
    topRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthSection();
      toggleAuthForms('register');
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      if (currentUser && userData?.session) {
        showResumeSection();
      } else {
        showAuthSection();
      }
    });
  }

  /* =======================
       REGISTER
    ======================== */
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fullName = document.getElementById('reg-fullname').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;

      if (!fullName || fullName.length < 2) {
        if (nameError) {
          nameError.textContent = 'Please enter a valid name';
        }
        return;
      }
    if (topLoginBtn) {
        topLoginBtn.addEventListener('click', (e) => {
            const href = topLoginBtn.getAttribute('href') || '';
            // If link points to login.html or register.html (separate pages), allow normal navigation
            if (href.includes('login.html') || href.includes('register.html')) {
                // Allow normal navigation - don't prevent default
                return;
            }
            // Only prevent default if auth section exists (resume-builder page with modal)
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
            // If link points to login.html or register.html (separate pages), allow normal navigation
            if (href.includes('login.html') || href.includes('register.html')) {
                // Allow normal navigation - don't prevent default
                return;
            }
            // Only prevent default if auth section exists (resume-builder page with modal)
            if (authSection) {
                e.preventDefault();
                showAuthSection();
                toggleAuthForms('register');
            }
        });
    }

    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            if (currentUser && userData?.session) {
                showResumeSection();
            } else {
                showAuthSection();
            }
        });
    }

      if (!Validator.isValidEmail(email)) {
        if (emailError) {
          emailError.textContent = 'Please enter a valid email';
        }
        return;
      }

      if (!Validator.validatePassword(password).isValid) {
        if (passwordError) {
          passwordError.textContent = 'Password is too weak';
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

      const user = getUserData(email);
      if (!user || user.password !== password) {
        ValidationUI.showToast('Invalid credentials', 'error');
        return;
      }

      user.session = true;
      saveUserData(email, user);
      localStorage.setItem('currentUser', email);

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

});
