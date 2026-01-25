// resume.js - Handles resume form inputs, live preview, and data binding

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('resume-form');
    const skillsList = document.getElementById('skills-list');
    const addSkillBtn = document.getElementById('add-skill');
    const skillInput = document.getElementById('skill-input');
    let skills = [];
    const downloadBtn = document.getElementById('download-resume');
    const ctaCreateBtn = document.getElementById('cta-create');
    const ctaDemoBtn = document.getElementById('cta-demo');
    
    // New elements for updated header
    const authControls = document.getElementById('auth-controls');
    const profileDropdown = document.getElementById('profile-dropdown');
    const showAuthBtn = document.getElementById('show-auth');
    const logoutDropdown = document.getElementById('logout-dropdown');
    const dropdownUserName = document.getElementById('dropdown-user-name');

    // Initialize
    loadUserDataInternal();
    updateAuthUI();

    // Two-way data binding for inputs
    if (form) {
        form.addEventListener('input', function() {
            updatePreview();
            saveResumeData();
        });
    }

    // Handle skills
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const skill = skillInput.value.trim();
            if (skill && !skills.includes(skill)) {
                skills.push(skill);
                renderSkills();
                skillInput.value = '';
                updatePreview();
                saveResumeData();
            }
        });
    }

    if (skillsList) {
        skillsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('skill-tag')) {
                const skill = e.target.textContent;
                skills = skills.filter(s => s !== skill);
                renderSkills();
                updatePreview();
                saveResumeData();
            }
        });
    }
    
    // Toggle dropdown menu
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = document.getElementById('dropdown-menu');
            dropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdown-menu');
        const profileBtn = document.querySelector('.profile-btn');
        
        if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Conditionally show download button based on login status
    function updateDownloadButtonVisibility() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            downloadBtn.classList.remove('hidden');
        } else {
            downloadBtn.classList.add('hidden');
        }
    }
    
    // Update auth UI based on login status
    function updateAuthUI() {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            // User is logged in
            authControls.classList.add('hidden');
            profileDropdown.classList.remove('hidden');
            
            // Set user name in dropdown
            const userData = getUserData(currentUser);
            const displayName = userData?.profile?.fullname || userData?.profile?.email || currentUser;
            dropdownUserName.textContent = displayName;
        } else {
            // User is not logged in
            authControls.classList.remove('hidden');
            profileDropdown.classList.add('hidden');
        }
        
        updateDownloadButtonVisibility();
    }
    
    // Sign In button click handler
    if (showAuthBtn) {
        showAuthBtn.addEventListener('click', function() {
            document.getElementById('auth-section').classList.remove('hidden');
        });
    }
    
    // Logout from dropdown
    if (logoutDropdown) {
        logoutDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            updateAuthUI();
        });
    }
    
    // Check login status when page loads
    updateAuthUI();
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(){
            window.print();
        });
    }

    // Hero section button event handlers
    if (ctaCreateBtn) {
        ctaCreateBtn.addEventListener('click', function() {
            document.getElementById('landing-section').classList.add('hidden');
            document.getElementById('resume-section').classList.remove('hidden');
        });
    }
    
    if (ctaDemoBtn) {
        ctaDemoBtn.addEventListener('click', function() {
            // Show sample data in the form
            document.getElementById('name').value = 'John Doe';
            document.getElementById('email').value = 'john.doe@example.com';
            document.getElementById('phone').value = '+1 (555) 123-4567';
            document.getElementById('location').value = 'New York, NY';
            document.getElementById('linkedin').value = 'linkedin.com/in/johndoe';
            document.getElementById('summary').value = 'Experienced professional with expertise in software development and project management.';
            document.getElementById('degree').value = 'Bachelor of Science in Computer Science';
            document.getElementById('institution').value = 'University of Technology';
            document.getElementById('year').value = '2020';
            document.getElementById('cgpa').value = '3.8';
            
            // Add sample skills
            skills = ['JavaScript', 'React', 'Node.js', 'Project Management'];
            renderSkills();
            
            // Add sample experience
            document.getElementById('exp-title').value = 'Software Engineer';
            document.getElementById('exp-org').value = 'Tech Solutions Inc.';
            document.getElementById('exp-duration').value = 'Jan 2021 - Present';
            document.getElementById('exp-desc').value = 'Developed and maintained web applications using modern technologies.';
            
            document.getElementById('achievements').value = 'Certified AWS Developer, Led team of 5 developers on major project';
            
            // Update preview and show resume section
            updatePreview();
            document.getElementById('landing-section').classList.add('hidden');
            document.getElementById('resume-section').classList.remove('hidden');
        });
    }

    function renderSkills() {
        if (!skillsList) return;
        skillsList.innerHTML = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    }

    function updatePreview() {
        const byId = id => document.getElementById(id);
        const setText = (id, text, fallback='') => { const el = byId(id); if(el) el.textContent = text || fallback; };

        setText('preview-name', byId('name') ? byId('name').value : '', 'Your Name');
        setText('preview-email', byId('email') ? byId('email').value : '');
        setText('preview-phone', byId('phone') ? byId('phone').value : '');
        setText('preview-location', byId('location') ? byId('location').value : '');
        setText('preview-linkedin', byId('linkedin') ? byId('linkedin').value : '');
        setText('preview-summary', byId('summary') ? byId('summary').value : '');

        const degree = byId('degree') ? byId('degree').value : '';
        const inst = byId('institution') ? byId('institution').value : '';
        const year = byId('year') ? byId('year').value : '';
        const cgpa = byId('cgpa') ? byId('cgpa').value : '';
        setText('preview-education', `${degree}${degree || inst ? ' from ' : ''}${inst}${year ? ', ' + year : ''}${cgpa ? ' (CGPA: ' + cgpa + ')' : ''}`);

        const previewSkills = byId('preview-skills');
        if (previewSkills) previewSkills.innerHTML = skills.map(skill => `<span>${skill}</span>`).join('');

        const previewExp = document.getElementById('preview-experience');
        if (previewExp) {
            const title = byId('exp-title') ? byId('exp-title').value : '';
            const org = byId('exp-org') ? byId('exp-org').value : '';
            const dur = byId('exp-duration') ? byId('exp-duration').value : '';
            const desc = byId('exp-desc') ? byId('exp-desc').value : '';
            previewExp.innerHTML = `<strong>${title}</strong>${org ? ' at ' + org : ''}${dur ? '<br>' + dur : ''}${desc ? '<br>' + desc : ''}`;
        }

        setText('preview-achievements', byId('achievements') ? byId('achievements').value : '');
    }

    function saveResumeData() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return;
        const userData = getUserData(currentUser) || {};
        userData.resume = {
            name: document.getElementById('name') ? document.getElementById('name').value : '',
            email: document.getElementById('email') ? document.getElementById('email').value : '',
            phone: document.getElementById('phone') ? document.getElementById('phone').value : '',
            location: document.getElementById('location') ? document.getElementById('location').value : '',
            linkedin: document.getElementById('linkedin') ? document.getElementById('linkedin').value : '',
            summary: document.getElementById('summary') ? document.getElementById('summary').value : '',
            degree: document.getElementById('degree') ? document.getElementById('degree').value : '',
            institution: document.getElementById('institution') ? document.getElementById('institution').value : '',
            year: document.getElementById('year') ? document.getElementById('year').value : '',
            cgpa: document.getElementById('cgpa') ? document.getElementById('cgpa').value : '',
            skills: skills,
            expTitle: document.getElementById('exp-title') ? document.getElementById('exp-title').value : '',
            expOrg: document.getElementById('exp-org') ? document.getElementById('exp-org').value : '',
            expDuration: document.getElementById('exp-duration') ? document.getElementById('exp-duration').value : '',
            expDesc: document.getElementById('exp-desc') ? document.getElementById('exp-desc').value : '',
            achievements: document.getElementById('achievements') ? document.getElementById('achievements').value : ''
        };
        saveUserData(currentUser, userData);
    }

    function loadUserDataInternal(){
        // storage.loadUserData will populate basic fields, then we sync skills and preview
        loadUserData();
        const currentUser = localStorage.getItem('currentUser');
        if(!currentUser) return;
        const userData = getUserData(currentUser) || {};
        if(userData.resume && userData.resume.skills){
            skills = userData.resume.skills.slice();
        }
        renderSkills();
        updatePreview();
        updateAuthUI(); // Update UI after loading user data
    }
});