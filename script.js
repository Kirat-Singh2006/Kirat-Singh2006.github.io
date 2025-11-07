/**
 * Kirat Singh Portfolio Script (script.js)
 * Includes skill bar animation (FIXED), section highlighting, and the Liquid Cursor Effect.
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

// 🌟 4. Liquid Cursor Effect Logic 🌟
const primaryDot = document.querySelector('.primary-dot');
const accentDot = document.querySelector('.accent-dot');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const damping = 0.08; // Controls the "lag" or "flow" speed

document.body.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    // Move the accent dot (the smaller, faster one) directly with the cursor
    if (accentDot) {
        accentDot.style.transform = `translate(${targetX - 5}px, ${targetY - 5}px)`;
    }
});

function updateLiquidCursor() {
    // Smoothly interpolate the primary dot's position towards the cursor
    currentX += (targetX - currentX) * damping;
    currentY += (targetY - currentY) * damping;

    // Apply the lagged position to the primary dot (the larger, trailing one)
    if (primaryDot) {
        primaryDot.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    // Loop the animation
    requestAnimationFrame(updateLiquidCursor);
}

// Start the liquid effect loop
if (primaryDot && accentDot) {
    requestAnimationFrame(updateLiquidCursor);
}


// 5. Run on scroll and load (using throttling for efficiency)
const scrollHandler = throttle(() => {
    animateProgressBars();
    highlightSection();
}, 100);

window.addEventListener('scroll', scrollHandler);

// FIX IMPLEMENTED HERE: Using 'load' ensures all elements are rendered 
// and positioned correctly before running the initial skill bar animation.
window.addEventListener('load', () => { 
    animateProgressBars();
    highlightSection();
});
