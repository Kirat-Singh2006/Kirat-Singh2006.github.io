/**
 * Kirat Singh Portfolio Script (script.js)
 * Cursor Glow Effect (Section 4) has been disabled to maintain solid black background.
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

// 3. Highlight section in view
function highlightSection() {
    let sections = document.querySelectorAll('main > section');
    let scrollPos = window.scrollY || window.pageYOffset;
    let offset = 100;
    
    sections.forEach(section => {
        let top = section.offsetTop - offset;
        let bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < bottom) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// 🌟 4. Cursor Glow Effect (Original Simple Framework Restored) 🌟
// THIS BLOCK HAS BEEN COMMENTED OUT TO PREVENT THE BACKGROUND COLOR OVERRIDE.
/*
document.body.addEventListener('mousemove', (e) => {
    // This line causes the pink/purple glow and overrides the CSS background.
    document.body.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, #ff85b3, #6a1b9a 80%)`;
});
*/

// 5. Run on scroll and load (using throttling for efficiency)
const scrollHandler = throttle(() => {
    animateProgressBars();
    highlightSection();
}, 100);

window.addEventListener('scroll', scrollHandler);

window.addEventListener('DOMContentLoaded', () => {
    animateProgressBars();
    highlightSection();
});
