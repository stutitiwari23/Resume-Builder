// theme.js - simple theme toggling and persistence per user
document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('theme-toggle');
    
    function applyTheme(t){
        document.documentElement.setAttribute('data-theme', t);
    }

    // Load theme preference on page load
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser && typeof getUserData === 'function'){
        const userData = getUserData(currentUser);
        if(userData && userData.theme){
            applyTheme(userData.theme);
        }
    }

    if(!btn) return;

    btn.addEventListener('click', function(){
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);

        const currentUser = localStorage.getItem('currentUser');
        if(currentUser){
            const userData = getUserData(currentUser) || {};
            userData.theme = next;
            saveUserData(currentUser, userData);
        }
    });
});
