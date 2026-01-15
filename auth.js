// auth.js - Handles simulated authentication, registration, login, logout, and session persistence

document.addEventListener('DOMContentLoaded', function () {
    const authSection = document.getElementById('auth-section');
    const regcloseauthBtn = document.querySelector('.register-close-auth');
    const logincloseauthBtn = document.querySelector(".login-colse-auth")
    const resumeSection = document.getElementById('resume-section');
    const landingSection = document.getElementById('landing-section');
    const registerForm = document.getElementById('register');
    const loginForm = document.getElementById('login');
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const logoutBtn = document.getElementById('logout'); // May not exist, handled with null checks
    const topLoginBtn = document.getElementById('show-login-top');
    const topRegisterBtn = document.getElementById('show-register-top');
    const ctaBtn = document.getElementById('cta-create');
    const userNameEl = document.getElementById('user-name');
    const nameErrorsms = document.getElementById('name-error-message');
    const emailErrorSms = document.getElementById('email-error-message');
    const passwordErrorSms = document.getElementById('password-error-message');
    const downloadResumeBtn = document.getElementById('download-pdf'); // Fixed: was 'download-resume'
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    // Check for existing session on load
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        if (downloadResumeBtn) downloadResumeBtn.classList.add('hidden');
    }
    if (currentUser && getUserData(currentUser).session) {
        if (downloadResumeBtn) downloadResumeBtn.classList.remove('hidden');
        showResumeSection();
    } else {
        showLanding();
    }

    // Password show/hide toggles
    function setupPasswordToggle(btn) {
        // Use event delegation or direct handler
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            const isCurrentlyHidden = input.type === 'password';
            input.type = isCurrentlyHidden ? 'text' : 'password';

            // Update ARIA state
            this.setAttribute('aria-pressed', isCurrentlyHidden ? 'true' : 'false');
            this.setAttribute('aria-label', isCurrentlyHidden ? 'Hide password' : 'Show password');

            // Update icon - remove both classes first, then add the correct one
            const icon = this.querySelector('.password-toggle-icon');
            if (icon) {
                icon.classList.remove('fa-eye', 'fa-eye-slash');
                if (isCurrentlyHidden) {
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.add('fa-eye-slash');
                }
            }

            // Update visually hidden text for screen readers
            const srText = this.querySelector('.visually-hidden');
            if (srText) {
                srText.textContent = isCurrentlyHidden ? 'Hide password' : 'Show password';
            }
        };
    }
    
    // Initialize password toggles
    function initializePasswordToggles() {
        const passwordToggleButtons = document.querySelectorAll('.password-toggle-btn');
        passwordToggleButtons.forEach((btn) => {
            setupPasswordToggle(btn);
        });
    }
    
    // Initialize on page load
    initializePasswordToggles();
    
    // Re-initialize when forms are toggled (forms might be hidden initially)
    if (showLogin) {
        showLogin.addEventListener('click', function() {
            setTimeout(initializePasswordToggles, 50);
        });
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', function() {
            setTimeout(initializePasswordToggles, 50);
        });
    }

    // Toggle between register and login forms
    if (showLogin) {
        showLogin.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });
    }

    if (showRegister) {
        showRegister.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        });
    }

    if (topLoginBtn) {
        topLoginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showAuthSection();
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });
    }
    if (topRegisterBtn) {
        topRegisterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showAuthSection();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        });
    }
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function () {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser && getUserData(currentUser)?.session) {
                showResumeSection();

            } else {
                showAuthSection();
            }
        });
    }

    // Register user with validation
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        ValidationUI.clearError('reg-fullname');
        ValidationUI.clearError('reg-email');
        ValidationUI.clearError('reg-password');

        const fullName = document.getElementById('reg-fullname').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        console.log("password", password);

        if (!fullName.trim()) {
            if (nameErrorsms) nameErrorsms.textContent = "Name fields are required.";
            return;
        }
        else if (fullName.length < 2) {
            if (nameErrorsms) nameErrorsms.textContent = "Name must be at least 2 characters Long."
        }
        if (!nameRegex.test(fullName)) {
            if (nameErrorsms) nameErrorsms.textContent = "Please enter a valid name..";
            return;
        }
        else {
            if (nameErrorsms) nameErrorsms.textContent = "";

        }
        if (!email.trim()) {
            if (emailErrorSms) emailErrorSms.textContent = "Email is required";
            return
        }
        else if (!emailRegx.test(email)) {
            if (emailErrorSms) emailErrorSms.textContent = "Please enter a valid email";
            return
        }
        else {
            if (emailErrorSms) emailErrorSms.textContent = "";
        }

        if (!password.trim()) {
            if (passwordErrorSms) passwordErrorSms.textContent = "Password is required";
            return
        }
        else if (!passwordRegex.test(password)) {
            if (passwordErrorSms) passwordErrorSms.textContent = "Please enter minimu 6 characters, at least one letter and one number.";
            return
        }
        if (passwordErrorSms) passwordErrorSms.textContent = "";

        let isValid = true;

        // Validate full name
        if (Validator.isEmpty(fullName)) {
            ValidationUI.showError('reg-fullname', 'Full name is required');
            isValid = false;
        } else if (fullName.length < 2) {
            ValidationUI.showError('reg-fullname', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Validate email
        if (Validator.isEmpty(email)) {
            ValidationUI.showError('reg-email', 'Email is required');
            isValid = false;
        } else if (!Validator.isValidEmail(email)) {
            ValidationUI.showError('reg-email', 'Please enter a valid email address');
            isValid = false;
        } else if (getUserData(email)) {
            ValidationUI.showError('reg-email', 'This email is already registered');
            isValid = false;
        }

        // Validate password
        const passwordValidation = Validator.validatePassword(password);
        if (Validator.isEmpty(password)) {
            ValidationUI.showError('reg-password', 'Password is required');
            isValid = false;
        } else if (!passwordValidation.isValid) {
            ValidationUI.showError('reg-password', passwordValidation.message);
            isValid = false;
        }

        if (!isValid) return;

        // Create user
        const userData = {
            fullName,
            password, // In production, this should be hashed
            profile: { fullname: fullName, email: email },
            resume: {},
            theme: 'light',
            session: false
        };

        saveUserData(email, userData);
        ValidationUI.showToast('Registration successful! Please login.', 'success');

        // Clear form and switch to login
        registerForm.reset();
        setTimeout(() => {
            if (showLogin) showLogin.click();
        }, 1500);
    });
    }
    if (regcloseauthBtn) {
        regcloseauthBtn.addEventListener("click", function () {
            if (authSection) authSection.classList.add("hidden");
            if (registerForm) registerForm.reset();
        });
    }
    if (logincloseauthBtn) {
        logincloseauthBtn.addEventListener("click", function () {
            if (authSection) authSection.classList.add("hidden");
            if (loginForm) loginForm.reset();
        });
    }

    // Real-time validation for registration form
    const regEmailInput = document.getElementById('reg-email');
    const regPasswordInput = document.getElementById('reg-password');
    const regFullnameInput = document.getElementById('reg-fullname');

    if (regEmailInput) {
        regEmailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (!Validator.isEmpty(email)) {
                if (!Validator.isValidEmail(email)) {
                    ValidationUI.showError('reg-email', 'Please enter a valid email address');
                } else if (getUserData(email)) {
                    ValidationUI.showError('reg-email', 'This email is already registered');
                } else {
                    ValidationUI.clearError('reg-email');
                    ValidationUI.showSuccess('reg-email');
                }
            }
        });
    }

    if (regPasswordInput) {
        regPasswordInput.addEventListener('input', function () {
            const password = this.value;
            if (password.length > 0) {
                const result = Validator.validatePassword(password);
                ValidationUI.showPasswordStrength('reg-password', result);
                if (result.isValid) {
                    ValidationUI.clearError('reg-password');
                }
            }
        });
    }

    if (regFullnameInput) {
        regFullnameInput.addEventListener('blur', function () {
            const name = this.value.trim();
            if (!Validator.isEmpty(name) && name.length >= 2) {
                ValidationUI.clearError('reg-fullname');
                ValidationUI.showSuccess('reg-fullname');
            }
        });
    }

    // Login user with validation
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        ValidationUI.clearError('login-email');
        ValidationUI.clearError('login-password');

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        let isValid = true;

        // Validate email
        if (Validator.isEmpty(email)) {
            ValidationUI.showError('login-email', 'Email is required');
            isValid = false;
        } else if (!Validator.isValidEmail(email)) {
            ValidationUI.showError('login-email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (Validator.isEmpty(password)) {
            ValidationUI.showError('login-password', 'Password is required');
            isValid = false;
        }

        if (!isValid) return;

        // Check credentials
        const userData = getUserData(email);
        if (userData && userData.password === password) {
            userData.session = true;
            saveUserData(email, userData);
            localStorage.setItem('currentUser', email);
            ValidationUI.showToast('Login successful! Welcome back.', 'success');
            setTimeout(() => showResumeSection(), 500);
        } else {
            ValidationUI.showError('login-email', 'Invalid email or password');
            ValidationUI.showError('login-password', 'Invalid email or password');
            ValidationUI.showToast('Invalid credentials. Please try again.', 'error');
        }
    });
    }

    // Real-time validation for login form
    const loginEmailInput = document.getElementById('login-email');

    if (loginEmailInput) {
        loginEmailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (!Validator.isEmpty(email) && !Validator.isValidEmail(email)) {
                ValidationUI.showError('login-email', 'Please enter a valid email address');
            } else {
                ValidationUI.clearError('login-email');
            }
        });
    }

    // Logout - Fixed null reference bug
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const userData = getUserData(currentUser);
                if (userData) {
                    userData.session = false;
                    saveUserData(currentUser, userData);
                }
                localStorage.removeItem('currentUser');
            }
            ValidationUI.showToast('Logged out successfully', 'info');
            showLanding();
        });
    }

    function showLanding() {
        if (landingSection) landingSection.classList.remove('hidden');
        if (authSection) authSection.classList.add('hidden');
        if (resumeSection) resumeSection.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (topLoginBtn) topLoginBtn.classList.remove('hidden');
        if (topRegisterBtn) topRegisterBtn.classList.remove('hidden');
        if (userNameEl) { userNameEl.textContent = ''; userNameEl.classList.add('hidden'); }
    }

    function showAuthSection() {
        if (landingSection) landingSection.classList.remove('hidden');
        if (authSection) authSection.classList.remove('hidden');
        if (resumeSection) resumeSection.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (topLoginBtn) topLoginBtn.classList.remove('hidden');
        if (topRegisterBtn) topRegisterBtn.classList.remove('hidden');
    }

    function showResumeSection() {
        if (landingSection) landingSection.classList.add('hidden');
        if (authSection) authSection.classList.add('hidden');
        if (resumeSection) resumeSection.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (topLoginBtn) topLoginBtn.classList.add('hidden');
        if (topRegisterBtn) topRegisterBtn.classList.add('hidden');
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser && userNameEl) {
            const userData = getUserData(currentUser);
            userNameEl.textContent = userData?.fullName ? userData.fullName : currentUser;
            userNameEl.classList.remove('hidden');
        }
        loadUserData(); // Load resume and theme data
    }
});




