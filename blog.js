// Function to generate a random hex color code
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-navigation .tab-link');
    const sections = document.querySelectorAll('main section');

    // --- Tab Switching Logic (Ensures Sections Display Correctly) ---
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHref = e.currentTarget.getAttribute('href');

            // --- DEBUGGING LOGS ADDED HERE ---
            console.log("Link Clicked:", e.currentTarget.textContent.trim());
            console.log("Target Href:", targetHref);
            // ---------------------------------

            // Only process internal links that start with '#'
            if (targetHref && targetHref.startsWith('#')) {
                e.preventDefault();
                const targetId = targetHref.substring(1);
                const targetSection = document.getElementById(targetId);

                // --- DEBUGGING LOGS ADDED HERE ---
                if (!targetSection) {
                    console.error(`Section with ID '${targetId}' not found. Please check your HTML section IDs.`);
                }
                // ---------------------------------

                // 1. Remove active class from all links and sections
                tabLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                // 2. Add active class to the clicked link
                e.currentTarget.classList.add('active');

                // 3. Show the corresponding section
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            }
            // External links (GitHub, LinkedIn, Resume) are handled by default browser behavior
        });
    });

    // --- Random Color on Hover Logic ---
    tabLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const randomColor = getRandomColor();
            
            // Apply the random color using style properties.
            // Using setProperty with 'important' ensures it overrides the CSS defaults/active state
            // during the exact moment of hover.
            link.style.setProperty('background-color', randomColor, 'important');
            link.style.setProperty('border-color', randomColor, 'important');
            link.style.setProperty('color', '#ffffff', 'important'); // Ensure white text for visibility
        });

        link.addEventListener('mouseleave', () => {
            // Clear the inline styles when the mouse leaves.
            // This allows the element to snap back to its CSS-defined state (e.g., active, resume-link, or default).
            link.style.removeProperty('background-color');
            link.style.removeProperty('border-color');
            link.style.removeProperty('color');
        });
    });
});
