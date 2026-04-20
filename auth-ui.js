// Authentication UI management for index.html
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI on page load
    updateAuthUI();
    
    // Intercept resume builder links to check authentication
    document.querySelectorAll('a[href*="resume-builder.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            let isLoggedIn = false;
            
            // Check if user is actually logged in (has session)
            if (currentUser && typeof getUserData !== 'undefined') {
                const userData = getUserData(currentUser);
                if (userData && userData.session) {
                    isLoggedIn = true;
                }
            }
            
            if (!isLoggedIn) {
                e.preventDefault();
                // Redirect to sign-in.html instead of login.html
                window.location.href = './sign-in.html';
            }
        });
    });
    
    // Toggle dropdown menu
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = document.getElementById('dropdown-menu');
            dropdown.classList.toggle('show');
        });
    }
    
    document.addEventListener('click', function (event) {
        const dropdown = document.getElementById('dropdown-menu');
        const profileBtn = document.querySelector('.profile-btn');

        if (dropdown && profileBtn) {
            if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        }
    });

    
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Clear session properly
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser && typeof getUserData !== 'undefined') {
                const userData = getUserData(currentUser);
                if (userData) {
                    userData.session = false;
                    saveUserData(currentUser, userData);
                }
            }
            
            localStorage.removeItem('currentUser');
            updateAuthUI();
            
            if (typeof ValidationUI !== 'undefined' && ValidationUI.showToast) {
                ValidationUI.showToast('Logged out successfully', 'info');
            }
            
            // Redirect to home after logout
            setTimeout(() => {
                window.location.href = './index.html';
            }, 500);
        });
    }
    
    
    function updateAuthUI() {
        const currentUser = localStorage.getItem('currentUser');
        const authControls = document.getElementById('auth-controls');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        let isLoggedIn = false;
        
        // Check if user is actually logged in (has session)
        if (currentUser && typeof getUserData !== 'undefined') {
            const userData = getUserData(currentUser);
            if (userData && userData.session) {
                isLoggedIn = true;
            }
        }
        
        if (isLoggedIn) {
            if (authControls) {
                authControls.classList.add('hidden');
            }
            if (profileDropdown) {
                profileDropdown.classList.remove('hidden');
                
                const userData = getUserData(currentUser);
                const displayName = userData?.profile?.fullname || userData?.fullName || userData?.profile?.email || currentUser;
                const userNameElement = document.getElementById('user-name');
                if (userNameElement) userNameElement.textContent = displayName;
            }
        } else {
            if (authControls) {
                authControls.classList.remove('hidden');
            }
            if (profileDropdown) {
                profileDropdown.classList.add('hidden');
            }
        }
    }
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser') {
            updateAuthUI();
        }
    });
    
    // Update auth UI based on login status
    updateAuthUI();
});

// Also call updateAuthUI when page loads in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    }, 1);
}
