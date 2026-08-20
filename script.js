/**
 * Kirat Singh — script.js
 * One deliberate interaction: click the terminal caption to step the ASCII
 * donut through a few frames, a nod to the actual C donut project.
 * No ambient/auto-playing animation.
 */

const DONUT_FRAMES = [
`     ,ad8888ba,
    d8"'    \`"8b
   d8'        \`8b
   88          88
   88          88
   Y8,        ,8P
    Y8a.    .a8P
     \`"Y8888Y"'`,
`      _.-""-._
    .'        '.
   /   .------.  \\
  |   /        \\  |
  |   \\        /  |
   \\   '------'  /
    '.        .'
      '-.__.-'`,
`   ▄▄▄▄▄▄▄▄▄▄
  ██        ██
 ██    ██    ██
 ██   ████   ██
 ██   ████   ██
 ██    ██    ██
  ██        ██
   ▀▀▀▀▀▀▀▀▀▀`,
`    .:oo88888oo:.
  .8888888888888.
 :8888888888888888:
 88888:      :88888
 88888:      :88888
 :8888888888888888:
  '8888888888888.
    ':oo88888oo:'`
];

document.addEventListener('DOMContentLoaded', () => {
    const donutBtn = document.getElementById('donut-btn');
    const donutFrame = document.getElementById('donut-frame');

    if (donutBtn && donutFrame) {
        let frameIndex = 0;
        donutBtn.addEventListener('click', () => {
            frameIndex = (frameIndex + 1) % DONUT_FRAMES.length;
            donutFrame.textContent = DONUT_FRAMES[frameIndex];
        });
    }

    // Gentle scroll-reveal for sections below the hero — a single quiet
    // motion detail, not an effect. Pure progressive enhancement: the
    // "reveal" class (and its starting opacity: 0) is only ever added by
    // this script, so no-JS and reduced-motion visitors just see the page,
    // fully visible, immediately.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealTargets = document.querySelectorAll('main > section:not(.hero)');
        revealTargets.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => observer.observe(el));
    }
});
