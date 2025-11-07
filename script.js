/**
 * Kirat Singh Portfolio Script (script.js)
 * Includes performance optimizations (throttling) and the cursor glow logic.
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

// 🌟 4. Cursor Glow Effect (Restored) 🌟
// Uses CSS variables for high performance
document.body.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

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
