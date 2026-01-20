// auth.js

// Register new user
function registerUser(fullname, email, password) {
    if (!fullname || !email || !password) return false;

    const allUsers = JSON.parse(localStorage.getItem('users')) || {};

    if (allUsers[email]) {
        return false; // User already exists
    }

    allUsers[email] = {
        profile: { fullname, email },
        resume: {}
    };

    localStorage.setItem('users', JSON.stringify(allUsers));
    localStorage.setItem('currentUser', email);
    return true;
}

// Login user
function loginUser(email, password) {
    const allUsers = JSON.parse(localStorage.getItem('users')) || {};
    if (allUsers[email]) {
        localStorage.setItem('currentUser', email);
        return true;
    }
    return false;
}

// Logout current user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('currentUser');
}

// Get current user profile info
function getCurrentUserProfile() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return null;
    const userData = getUserData(currentUser);
    return userData?.profile || null;
}

// Redirect if not logged in
function requireLogin(redirectUrl = './login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
    }
}
