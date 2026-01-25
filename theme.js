// theme.js - simple theme toggling and persistence per user
document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;

    function applyTheme(t){
        document.documentElement.setAttribute('data-theme', t);
    }

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

    // on load, if user has theme saved it will already be applied by storage.loadUserData
});
