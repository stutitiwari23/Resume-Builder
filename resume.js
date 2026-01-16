// resume.js - Handles resume form inputs, live preview, and data binding

document.addEventListener('DOMContentLoaded', function () {

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

    // Two-way data binding for inputs with validation
    if (form) {
        form.addEventListener('input', function (e) {
            // Real-time validation for specific fields
            const fieldId = e.target.id;

            if (fieldId === 'email') {
                const email = e.target.value.trim();
                if (email && !Validator.isValidEmail(email)) {
                    ValidationUI.showError('email', 'Please enter a valid email address');
                } else {
                    ValidationUI.clearError('email');
                }
            }

            if (fieldId === 'phone') {
                const phone = e.target.value.trim();
                if (phone && !Validator.isValidPhone(phone)) {
                    ValidationUI.showError('phone', 'Please enter a valid phone number');
                } else {
                    ValidationUI.clearError('phone');
                }
            }

            if (fieldId === 'linkedin') {
                const url = e.target.value.trim();
                if (url && !Validator.isValidURL(url)) {
                    ValidationUI.showError('linkedin', 'Please enter a valid URL');
                } else {
                    ValidationUI.clearError('linkedin');
                }
            }

            updatePreview();
            saveResumeData();
        });
    }

    // Handle skills
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function () {
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
        skillsList.addEventListener('click', function (e) {
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
        profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = document.getElementById('dropdown-menu');
            dropdown.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside - Fixed null reference bug
    document.addEventListener('click', function (event) {
        const dropdown = document.getElementById('dropdown-menu');
        const profileBtn = document.querySelector('.profile-btn');

        if (dropdown && profileBtn) {
            if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
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
        showAuthBtn.addEventListener('click', function () {
            document.getElementById('auth-section').classList.remove('hidden');
        });
    }

    // Logout from dropdown
    if (logoutDropdown) {
        logoutDropdown.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            updateAuthUI();
        });
    }

    // Check login status when page loads
    updateAuthUI();

    // PDF Export functionality
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // Validate that resume has minimum required data
            const nameValue = document.getElementById('name').value.trim();

            if (!nameValue) {
                ValidationUI.showToast('Please enter your name before downloading', 'error');
                document.getElementById('name').focus();
                return;
            }

            // Show loading toast
            ValidationUI.showToast('Generating PDF...', 'info');

            const element = document.getElementById('resume-preview');
            const userName = nameValue.replace(/\s+/g, '_');
            const filename = `${userName}_Resume.pdf`;

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait',
                    compress: true
                }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                ValidationUI.showToast('Resume downloaded successfully!', 'success');
            }).catch((error) => {
                console.error('PDF generation error:', error);
                ValidationUI.showToast('Error generating PDF. Please try again.', 'error');
            });
        });
    }

    // Hero section button event handlers
    if (ctaCreateBtn) {
        ctaCreateBtn.addEventListener('click', function () {
            // Redirect to resume builder page instead of showing locally
            window.location.href = './resume-builder.html';
        });
    }

    if (ctaDemoBtn) {
        ctaDemoBtn.addEventListener('click', function () {
            // Redirect to resume builder page with sample data in URL parameters
            const sampleData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                location: 'New York, NY',
                linkedin: 'linkedin.com/in/johndoe',
                summary: 'Experienced professional with expertise in software development and project management.',
                degree: 'Bachelor of Science in Computer Science',
                institution: 'University of Technology',
                year: '2020',
                cgpa: '3.8',
                skills: ['JavaScript', 'React', 'Node.js', 'Project Management'],
                expTitle: 'Software Engineer',
                expOrg: 'Tech Solutions Inc.',
                expDuration: 'Jan 2021 - Present',
                expDesc: 'Developed and maintained web applications using modern technologies.',
                achievements: 'Certified AWS Developer, Led team of 5 developers on major project'
            };

            // Store sample data in localStorage
            localStorage.setItem('sampleResumeData', JSON.stringify(sampleData));

            // Redirect to resume builder page
            window.location.href = './resume-builder.html';
        });
    }

    function renderSkills() {
        if (!skillsList) return;
        skillsList.innerHTML = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
        
    }

    function updatePreview() {
        const byId = id => document.getElementById(id);
        const setText = (id, text, fallback = '') => { const el = byId(id); if (el) el.textContent = text || fallback; };

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

    function loadUserDataInternal() {
        // storage.loadUserData will populate basic fields, then we sync skills and preview
        loadUserData();
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return;
        const userData = getUserData(currentUser) || {};
        if (userData.resume && userData.resume.skills) {
            skills = userData.resume.skills.slice();
        }
        renderSkills();
        updatePreview();
        updateAuthUI(); // Update UI after loading user data
    }
});

// Scroll To Top Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});