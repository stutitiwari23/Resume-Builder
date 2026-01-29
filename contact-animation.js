// Contact Section Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const contactTitle = document.querySelector('.contact_taital');
    const contactForm = document.querySelector('.mail_section.map_form_container');
    
    // Intersection Observer options
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Callback function for intersection
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element comes into view
                entry.target.classList.add('animate-in');
                // Optional: stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements
    if (contactTitle) {
        observer.observe(contactTitle);
    }
    
    if (contactForm) {
        observer.observe(contactForm);
    }
});
