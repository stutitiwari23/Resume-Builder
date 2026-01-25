// auth.js - Handles simulated authentication, registration, login, logout, and session persistence

document.addEventListener('DOMContentLoaded', function() {
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

    // Check for existing session on load
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && getUserData(currentUser).session) {
        showResumeSection();
    } else {
        showLanding();
    }

    // Toggle between register and login forms
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });

    if (topLoginBtn) {
        topLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthSection();
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });
    }
    if (topRegisterBtn) {
        topRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthSection();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        });
    }
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function(){
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser && getUserData(currentUser)?.session) {
                showResumeSection();
            } else {
                showAuthSection();
            }
        });
    }

    // Register user
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('reg-fullname').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        if (getUserData(email)) {
            alert('User already exists!');
            return;
        }

        const userData = {
            fullName,
            password, // In a real app, hash this
            profile: {},
            resume: {},
            theme: 'light',
            session: false
        };
        saveUserData(email, userData);
        alert('Registration successful! Please login.');
        showLogin.click();
    });

    // Login user
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const userData = getUserData(email);
        if (userData && userData.password === password) {
            userData.session = true;
            saveUserData(email, userData);
            localStorage.setItem('currentUser', email);
            showResumeSection();
        } else {
            alert('Invalid credentials!');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = getUserData(currentUser);
            userData.session = false;
            saveUserData(currentUser, userData);
            localStorage.removeItem('currentUser');
        }
        showLanding();
    });

    function showLanding() {
        if (landingSection) landingSection.classList.remove('hidden');
        authSection.classList.add('hidden');
        resumeSection.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (topLoginBtn) topLoginBtn.classList.remove('hidden');
        if (topRegisterBtn) topRegisterBtn.classList.remove('hidden');
        if (userNameEl) { userNameEl.textContent = ''; userNameEl.classList.add('hidden'); }
    }

    function showAuthSection() {
        if (landingSection) landingSection.classList.remove('hidden');
        authSection.classList.remove('hidden');
        resumeSection.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (topLoginBtn) topLoginBtn.classList.remove('hidden');
        if (topRegisterBtn) topRegisterBtn.classList.remove('hidden');
    }

    function showResumeSection() {
        if (landingSection) landingSection.classList.add('hidden');
        authSection.classList.add('hidden');
        resumeSection.classList.remove('hidden');
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
