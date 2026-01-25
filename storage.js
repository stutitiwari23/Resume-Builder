// storage.js - simple localStorage helpers for users and resume data
(function(){
    function _key(email){
        return 'user_' + String(email).toLowerCase();
    }

    window.getUserData = function(email){
        if(!email) return null;
        const raw = localStorage.getItem(_key(email));
        return raw ? JSON.parse(raw) : null;
    };

    window.saveUserData = function(email, data){
        if(!email || !data) return;
        localStorage.setItem(_key(email), JSON.stringify(data));
    };

    window.loadUserData = function(){
        const currentUser = localStorage.getItem('currentUser');
        if(!currentUser) return;
        const userData = getUserData(currentUser);
        if(!userData) return;

        // apply theme if stored
        if(userData.theme) document.documentElement.setAttribute('data-theme', userData.theme);

        // populate resume form fields if available
        if(userData.resume){
            const r = userData.resume;
            const assign = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ''; };
            assign('name', r.name);
            assign('email', r.email);
            assign('phone', r.phone);
            assign('location', r.location);
            assign('linkedin', r.linkedin);
            assign('summary', r.summary);
            assign('degree', r.degree);
            assign('institution', r.institution);
            assign('year', r.year);
            assign('cgpa', r.cgpa);
            assign('exp-title', r.expTitle);
            assign('exp-org', r.expOrg);
            assign('exp-duration', r.expDuration);
            assign('exp-desc', r.expDesc);
            assign('achievements', r.achievements);
        }
    };
})();
