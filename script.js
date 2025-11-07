/**
 * Kirat Singh Portfolio Script (script.js)
 * Includes skill bar animation, and section highlighting for scroll-reveal effect.
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
        // Check if the element is in the viewport
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView && !bar.classList.contains('animated')) {
            const percent = bar.getAttribute('data-percent');
            bar.querySelector('.bar').style.width = percent + '%';
            bar.classList.add('animated');
        }
    });
}

// 3. Highlight section in view (Applies the .active class that triggers the CSS visual change)
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


// 4. Run on scroll and load (using throttling for efficiency)
const scrollHandler = throttle(() => {
    animateProgressBars();
    highlightSection();
}, 100);

window.addEventListener('scroll', scrollHandler);

// Using 'load' ensures all elements are rendered and positioned correctly before initial checks
window.addEventListener('load', () => { 
    animateProgressBars();
    highlightSection();
});
