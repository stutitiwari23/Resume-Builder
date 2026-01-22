// Authentication UI management for index.html
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI on page load
    updateAuthUI();
    
    // Intercept resume builder links to check authentication
    document.querySelectorAll('a[href*="resume-builder.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                window.location.href = './login.html';
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
            localStorage.removeItem('currentUser');
            updateAuthUI();
            if (typeof ValidationUI !== 'undefined' && ValidationUI.showToast) {
                ValidationUI.showToast('Logged out successfully', 'info');
            }
        });
    }
    
    
    function updateAuthUI() {
        const currentUser = localStorage.getItem('currentUser');
        const authControls = document.getElementById('auth-controls');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (currentUser && typeof getUserData !== 'undefined' && getUserData(currentUser)) {
            if (authControls) {
                authControls.classList.add('hidden');
            }
            if (profileDropdown) {
                profileDropdown.classList.remove('hidden');
                
                const userData = getUserData(currentUser);
                const displayName = userData?.profile?.fullname || userData?.profile?.email || currentUser;
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
    setTimeout(updateAuthUI, 1);
}