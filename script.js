// Animate skill progress bars
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

// Highlight section in view
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

// Cursor glow effect
document.body.addEventListener('mousemove', (e) => {
  document.body.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, #ff85b3, #6a1b9a 80%)`;
});

// Run on scroll and load
window.addEventListener('scroll', () => {
  animateProgressBars();
  highlightSection();
});
window.addEventListener('DOMContentLoaded', () => {
  animateProgressBars();
  highlightSection();
});
