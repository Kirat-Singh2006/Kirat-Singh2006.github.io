/**
 * script.js
 * Kirat Singh's Portfolio Interaction Logic (Tabs, Themes, Progress Bars, Random Hover)
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainNavLinks = document.querySelectorAll('.tab-navigation .tab-link');
    const sections = document.querySelectorAll('main section');
    const htmlElement = document.documentElement;

    // --- Utility Functions ---

    /**
     * Generates a visually distinct random hex color code.
     */
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        // Generate a slightly darker/more saturated color to look good on the dark background
        for (let i = 0; i < 6; i++) {
            // Ensure first two digits are high for a bright color
            if (i < 2) {
                color += letters[Math.floor(Math.random() * 6) + 10]; // 10-15 (A-F)
            } else {
                color += letters[Math.floor(Math.random() * 16)];
            }
        }
        return color;
    }

    /**
     * Animates the progress bars by setting their width based on data-percent.
     */
    const animateProgressBars = () => {
        document.querySelectorAll('.progress-bar').forEach(barContainer => {
            // The HTML should use data-percent, not data-level (checking your HTML)
            const percent = barContainer.getAttribute('data-percent'); 
            const bar = barContainer.querySelector('.bar');
            
            // Reset and force reflow to ensure animation runs every time
            bar.style.width = '0%';
            void bar.offsetWidth; 
            
            // Set the final width to trigger CSS transition
            bar.style.width = `${percent}%`;
        });
    };

    /**
     * Updates the theme class on the HTML element based on the section ID.
     * @param {string} sectionId - The ID of the active section (e.g., '#about').
     */
    const updateTheme = (sectionId) => {
        // Map section ID to theme class name (e.g., #about -> theme-about)
        const themeClass = `theme-${sectionId.substring(1)}`;
        
        // Clear all previous theme classes
        htmlElement.classList.forEach(cls => {
            if (cls.startsWith('theme-')) {
                htmlElement.classList.remove(cls);
            }
        });

        if (sectionId === '#about' || sectionId === '#blog-posts' || sectionId === '#skills') {
            htmlElement.classList.add(themeClass);
        }
    };

    /**
     * Handles the display of the correct section and updates navigation state.
     * @param {string} sectionId - The ID of the section to show.
     */
    const showSection = (sectionId) => {
        // 1. Hide all sections and remove active link class
        sections.forEach(section => section.classList.remove('active'));
        mainNavLinks.forEach(link => link.classList.remove('active'));

        // 2. Show the target section
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo(0, 0); 

            // 3. Update active navigation link
            const activeLink = document.querySelector(`.tab-link[href="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // 4. Update theme
            updateTheme(sectionId);

            // 5. Animate progress bars if the skills section is shown
            if (sectionId === '#skills') {
                animateProgressBars();
            }
        }
    };

    // --- Event Listeners & Initialization ---

    // Tab Click Handler (Only for internal links)
    mainNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                // Update URL hash without navigating away
                history.pushState(null, '', href);
                showSection(href);
            }
        });
        
        // Random Color on Hover Logic (Integrated from your old blog.js)
        // Ensure this only applies to the internal tab links for visual consistency
        if (link.getAttribute('href').startsWith('#')) {
             link.addEventListener('mouseenter', () => {
                const randomColor = getRandomColor();
                link.style.setProperty('color', randomColor, 'important'); 
                link.style.setProperty('border-bottom-color', randomColor, 'important');
            });

            link.addEventListener('mouseleave', () => {
                // Clear the inline styles, letting the CSS rules (theme-specific) take over
                link.style.removeProperty('color');
                link.style.removeProperty('border-bottom-color');
            });
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#about';
        showSection(hash);
    });

    // Initialize the page view based on the current URL hash or default to #about
    const initialHash = window.location.hash || '#about';
    showSection(initialHash);
});
