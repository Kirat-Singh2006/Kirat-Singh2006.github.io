/**
 * Kirat Singh Portfolio Script (script.js)
 * RESTORED: Handles tab navigation, color theme switching, and skill bar animation.
 */

// --- 1. Utility Function for Throttling ---
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
    // Reset the animation state before re-animating
    document.querySelectorAll('.progress-bar.animated').forEach(bar => {
        bar.querySelector('.bar').style.width = '0%';
        bar.classList.remove('animated');
    });

    // Animate only the visible bars
    document.querySelectorAll('#skills .progress-bar').forEach(bar => {
        const percent = bar.getAttribute('data-percent');
        setTimeout(() => {
            bar.querySelector('.bar').style.width = percent + '%';
            bar.classList.add('animated');
        }, 50);
    });
}

// 🌟 3. Tab Navigation Logic - RESTORED 🌟
function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.tab-navigation .tab-link');
    const sections = document.querySelectorAll('main section');
    const mainContent = document.querySelector('main');
    const htmlEl = document.documentElement; // Get the <html> element

    tabLinks.forEach(link => {
        if (!link.classList.contains('external-link')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href'); // e.g., "#about"
                const themeName = 'theme-' + targetId.replace('#', ''); // e.g., "theme-about"
                
                // 1. SET THE THEME
                htmlEl.className = themeName;
                
                // 2. Hide all sections and remove 'active' from all links
                sections.forEach(s => s.classList.remove('active'));
                tabLinks.forEach(l => l.classList.remove('active'));

                // 3. Show the target section and set link as 'active'
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                this.classList.add('active');
                
                // 4. Special handling for the Skills tab
                if (targetId === '#skills') {
                    animateProgressBars();
                }

                // 5. Scroll to the top of the main content area
                mainContent.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // Initial load: Determine which section and theme should be visible
    const initialHash = window.location.hash || '#about';
    const initialLink = document.querySelector(`.tab-link[href="${initialHash}"]`);
    const initialSection = document.querySelector(initialHash);

    // Set initial theme
    htmlEl.className = 'theme-' + initialHash.replace('#', '');

    if (initialSection) {
        initialSection.classList.add('active');
    }
    if (initialLink) {
        initialLink.classList.add('active');
    }
    
    // Initial skill animation if the page loads directly on the Skills tab
    if (initialHash === '#skills') {
        animateProgressBars();
    }
}

// 4. Run on load
window.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
});
