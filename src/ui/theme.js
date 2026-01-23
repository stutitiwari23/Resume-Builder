// theme.js - simple theme toggling and persistence per user
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('theme-toggle');

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);

    // Update theme toggle icons
    if (btn) {
      const sunIcon = btn.querySelector('.theme-sun');
      const moonIcon = btn.querySelector('.theme-moon');

      if (t === 'dark') {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
      } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
      }
    }
  }

  // Load theme preference on page load
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser && typeof getUserData === 'function') {
    const userData = getUserData(currentUser);
    if (userData && userData.theme) {
      applyTheme(userData.theme);
    }
  } else {
    // Guest / no user logged in
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    applyTheme(savedTheme);
  }

  if (!btn) return;

  btn.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);

    const currentUser = localStorage.getItem('currentUser');
    if (
      currentUser &&
      typeof getUserData === 'function' &&
      typeof saveUserData === 'function'
    ) {
      const userData = getUserData(currentUser) || {};
      userData.theme = next;
      saveUserData(currentUser, userData);
    } else {
      // Save theme for guest users
      localStorage.setItem('theme', next);
    }
  });
});
