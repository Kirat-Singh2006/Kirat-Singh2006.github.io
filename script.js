/**
 * script.js
 * Kirat Singh's Portfolio Interaction Logic (Tabs, Themes, Progress Bars)
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainNavLinks = document.querySelectorAll('.tab-navigation .tab-link');
    const sections = document.querySelectorAll('main section');
    const htmlElement = document.documentElement;

    // --- 1. Utility Functions ---

    /**
     * Extracts the section ID from the hash or returns the default ('#about').
     * @returns {string} The active section ID (e.g., '#about', '#skills').
     */
    const getActiveSectionId = () => {
        return window.location.hash || '#about';
    };

    /**
     * Updates the theme class on the HTML element based on the section ID.
     * @param {string} sectionId - The ID of the active section (e.g., '#about').
     */
    const updateTheme = (sectionId) => {
        // Remove existing theme classes
        const themeClasses = ['theme-about', 'theme-blog-posts', 'theme-skills'];
        htmlElement.classList.remove(...themeClasses);

        // Map section ID to theme class
        let themeClass;
        if (sectionId === '#about') {
            themeClass = 'theme-about';
        } else if (sectionId === '#blog-posts') {
            themeClass = 'theme-blog-posts';
        } else if (sectionId === '#skills') {
            themeClass = 'theme-skills';
        }

        if (themeClass) {
            htmlElement.classList.add(themeClass);
        }
    };

    /**
     * Animates the progress bars when the skills section is active.
     */
    const animateProgressBars = () => {
        const skillsSection = document.getElementById('skills');
        if (skillsSection && skillsSection.classList.contains('active')) {
            document.querySelectorAll('.progress-bar .bar').forEach(bar => {
                const level = bar.getAttribute('data-level'); // e.g., "90%"
                bar.style.width = level;
            });
        }
    };

    /**
     * Handles the display of the correct section and updates navigation state.
     * @param {string} sectionId - The ID of the section to show.
     */
    const showSection = (sectionId) => {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo(0, 0); // Scroll to top of the content

            // Update navigation links
            mainNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === sectionId) {
                    link.classList.add('active');
                }
            });

            // Update theme (Re-enabled for color switching)
            updateTheme(sectionId);

            // Animate progress bars if the skills section is shown
            if (sectionId === '#skills') {
                animateProgressBars();
            }
        }
    };

    // --- 2. Event Listeners & Initialization ---

    // Handle navigation click (prevent default and manually show section)
    mainNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's an internal hash link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                // Update URL hash without navigating away
                history.pushState(null, '', href);
                showSection(href);
            }
            // For external links (GitHub/LinkedIn), let the default action proceed
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        showSection(getActiveSectionId());
    });

    // Initialize the page view based on the current URL hash
    showSection(getActiveSectionId());
});
