/**
 * Kirat Singh Portfolio Script (script.js)
 * Includes performance optimizations (throttling) and modular functions.
 */

// --- 1. Utility Function for Throttling ---
// Limits a function execution to once every 'limit' milliseconds
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
        // Check if the top is within the viewport (window.innerHeight) and the bottom is not above the top (0)
        const inView = rect.top < window.innerHeight && rect.bottom > 0; 
        
        if (inView && !bar.classList.contains('animated')) {
            const percent = bar.getAttribute('data-percent');
            // Animate the bar's width using CSS transitions (defined in style.css)
            bar.querySelector('.bar').style.width = percent + '%';
            bar.classList.add('animated');
        }
    });
}

// 3. Highlight section in view
function highlightSection() {
    let sections = document.querySelectorAll('main > section');
    let scrollPos = window.scrollY || window.pageYOffset;
    let offset = 100; // Offset from the top of the viewport for activation timing
    
    sections.forEach(section => {
        let top = section.offsetTop - offset;
        let bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < bottom) {
            // Add 'active' class to the section currently in view
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// 4. Cursor glow effect (Optimized using CSS variables)
// Requires corresponding CSS rules using --mouse-x and --mouse-y on the :root or a dedicated element.
document.body.addEventListener('mousemove', (e) => {
    // Set CSS variables for the mouse position on the root element
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// 5. Run on scroll and load (using throttling for efficiency)

// Throttle the scroll handling function to execute at most every 100ms
const scrollHandler = throttle(() => {
    animateProgressBars();
    highlightSection();
}, 100); 

window.addEventListener('scroll', scrollHandler);

window.addEventListener('DOMContentLoaded', () => {
    // Run once on initial load
    animateProgressBars();
    highlightSection();
});
