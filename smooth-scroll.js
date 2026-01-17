/**
 * Smooth Scroll Navigation Handler
 * Handles smooth scrolling to anchor links with proper offset for navbar
 * Compatible with Bootstrap and jQuery
 */

(function() {
    'use strict';

    // Calculate navbar height dynamically
    function getNavbarHeight() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            return navbar.offsetHeight;
        }
        return 0;
    }

    // Smooth scroll to element with offset
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) {
            console.warn(`Element with id "${targetId}" not found`);
            return false;
        }

        const navbarHeight = getNavbarHeight();
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, targetPosition - navbarHeight - 20); // 20px extra padding

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        return true;
    }

    // Check if we're on the index page
    function isIndexPage() {
        const pathname = window.location.pathname;
        const hostname = window.location.hostname;
        
        // Check various index page scenarios
        return pathname.endsWith('index.html') || 
               pathname.endsWith('/') || 
               pathname === '' ||
               pathname === '/' ||
               (hostname === '' && pathname === 'index.html') ||
               pathname.includes('index.html');
    }

    // Handle anchor link clicks using event delegation
    function handleDocumentClick(e) {
        // Find the closest anchor link
        let anchor = e.target;
        while (anchor && anchor.tagName !== 'A') {
            anchor = anchor.parentElement;
        }
        
        // Check if it's an anchor link with hash
        if (!anchor || !anchor.getAttribute('href')) {
            return;
        }
        
        const href = anchor.getAttribute('href');
        
        // Check if it's an anchor link (starts with #) and not just #
        if (href && href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1); // Remove the # symbol
            
            // Only handle if we're on the index page
            if (isIndexPage()) {
                // Check if target exists
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Update URL hash
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    } else {
                        window.location.hash = href;
                    }
                    
                    // Small delay to ensure preventDefault worked
                    setTimeout(function() {
                        smoothScrollTo(targetId);
                    }, 10);
                }
            }
        }
    }

    // Handle hash in URL on page load
    function handleHashOnLoad() {
        if (window.location.hash && window.location.hash.length > 1) {
            const targetId = window.location.hash.substring(1);
            // Delay to ensure DOM is fully loaded and rendered
            setTimeout(function() {
                smoothScrollTo(targetId);
            }, 300);
        }
    }

    // Initialize function
    function initSmoothScroll() {
        // Use event delegation on document to catch all clicks
        // This works even if elements are added dynamically
        document.addEventListener('click', handleDocumentClick, true); // Use capture phase
        
        // Handle hash on page load
        handleHashOnLoad();
    }

    // Initialize - wait for DOM and jQuery if available
    function startInit() {
        // If jQuery is available, wait for it
        if (typeof jQuery !== 'undefined') {
            jQuery(document).ready(function() {
                initSmoothScroll();
            });
        } else {
            // Otherwise use vanilla JS
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initSmoothScroll);
            } else {
                // DOM already loaded
                initSmoothScroll();
            }
        }
    }

    // Start initialization
    startInit();

    // Also handle window load for any late-loading content
    window.addEventListener('load', function() {
        if (window.location.hash && window.location.hash.length > 1) {
            const targetId = window.location.hash.substring(1);
            setTimeout(function() {
                smoothScrollTo(targetId);
            }, 100);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        if (window.location.hash && window.location.hash.length > 1) {
            const targetId = window.location.hash.substring(1);
            setTimeout(function() {
                smoothScrollTo(targetId);
            }, 50);
        }
    });

})();
