/**
 * Kirat Singh Portfolio Script (script.js)
 * Includes tab navigation logic and skill bar animation.
 */

// --- 1. Utility Function for Throttling (Kept for efficiency) ---
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 2. Animate skill progress bars
function animateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView && !bar.classList.contains('animated')) {
            const percent = bar.getAttribute('data-percent');
            bar.querySelector('.bar').style.width = percent + '%';
            bar.classList.add('animated');
        }
    });
}

// 🌟 3. Tab Navigation Logic 🌟
function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('main section');
    const mainContent = document.querySelector('main');

    tabLinks.forEach(link => {
        // Stop browser from navigating/scrolling for internal links
        if (!link.classList.contains('external-link')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // 1. Get the target section ID from the href (e.g., #about)
                const targetId = this.getAttribute('href');
                
                // 2. Hide all sections and remove 'active' from all links
                sections.forEach(s => s.classList.remove('active'));
                tabLinks.forEach(l => l.classList.remove('active'));

                // 3. Show the target section and set link as 'active'
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                this.classList.add('active');
                
                // 4. Run skill bar animation if the skills section is opened
                if (targetId === '#skills') {
                    animateProgressBars();
                }
                
                // 5. Scroll to the top of the main content area
                mainContent.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // Initial load: Force the '#about' section to be visible
    const initialSectionId = window.location.hash || '#about';
    const initialLink = document.querySelector(`.tab-link[href="${initialSectionId}"]`);
    const initialSection = document.querySelector(initialSectionId);

    if (initialSection) {
        initialSection.classList.add('active');
    }
    if (initialLink) {
        initialLink.classList.add('active');
    }
}

// 4. Run on load (Scroll and section highlighting removed)
window.addEventListener('load', () => { 
    // Set up the tab functionality
    setupTabNavigation();
    
    // Animate skill bars if the initial section is 'skills'
    if (window.location.hash === '#skills' || !window.location.hash) {
         animateProgressBars();
    }
});

// REMOVED: Scroll handler is no longer needed since we are not scrolling between sections.
