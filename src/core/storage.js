/**
 * storage.js - LocalStorage management module
 * Handles persistent storage of user data and resume information
 * @module storage
 */

(function() {
  /**
     * Generates storage key from email
     * @private
     * @param {string} email - User's email address
     * @returns {string} Storage key formatted as 'user_[email]'
     */
  function _key(email) {
    return 'user_' + String(email).toLowerCase();
  }

  /**
     * Retrieves user data from localStorage
     * @function getUserData
     * @global
     * @param {string} email - User's email address
     * @returns {Object|null} User data object or null if not found
     * @example
     * const userData = getUserData('user@example.com');
     * console.log(userData.resume);
     */
  window.getUserData = function(email) {
    if (!email) {
      return null;
    }
    const raw = localStorage.getItem(_key(email));
    return raw ? JSON.parse(raw) : null;
  };

  /**
     * Saves user data to localStorage
     * @function saveUserData
     * @global
     * @param {string} email - User's email address
     * @param {Object} data - User data object to save
     * @returns {void}
     * @example
     * saveUserData('user@example.com', {
     *   resume: { name: 'John Doe', email: 'john@example.com' },
     *   theme: 'dark'
     * });
     */
  window.saveUserData = function(email, data) {
    if (!email || !data) {
      return;
    }
    localStorage.setItem(_key(email), JSON.stringify(data));
  };

  /**
     * Loads user data from localStorage and populates form fields
     * Automatically restores user's theme preference and resume data
     * @function loadUserData
     * @global
     * @returns {void}
     * @example
     * // Call on page load to restore user data
     * loadUserData();
     */
  window.loadUserData = function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      return;
    }
    const userData = getUserData(currentUser);
    if (!userData) {
      return;
    }

    // apply theme if stored
    if (userData.theme) {
      document.documentElement.setAttribute('data-theme', userData.theme);
    }

    // populate resume form fields if available
    if (userData.resume) {
      const r = userData.resume;
      /**
             * Helper function to safely assign values to form fields
             * @private
             * @param {string} id - Element ID
             * @param {*} val - Value to assign
             */
      const assign = (id, val) => {
        const el = document.getElementById(id); if (el) {
          el.value = val || '';
        }
      };
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
