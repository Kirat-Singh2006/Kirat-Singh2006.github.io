/**
 * Kirat Singh Portfolio Script (script.js)
 * FINAL FIX: Includes multi-color tab navigation logic, skill bar animation, and BLOG scroll/animation logic.
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

// 🌟 3. Tab Navigation Logic - FIXED with THEME SWITCHING 🌟
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

// 🌟 4. Blog-Specific Utilities 🌟
function setupBlogUtilities() {
    // --- 4a. Smooth Scroll for Blog Page Hash Links ---
    // If we're on blog.html and the hash changes (meaning a user clicked a post link),
    // ensure a smooth scroll to the post content area.
    window.addEventListener('hashchange', () => {
        if (window.location.pathname.endsWith('blog.html')) {
            const blogContent = document.getElementById('blog-post-content');
            if (blogContent) {
                blogContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}


// 5. Run on load
window.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    setupBlogUtilities(); // Initialize blog utilities
});
