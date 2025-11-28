// script.js

// Global variable to hold the currently active section ID for theme management
let currentActiveSectionId = 'about';

// --- 1. Utility Functions ---

/**
 * Ensures exponential backoff for API calls.
 * @param {Function} fetcher - The async function that performs the API call.
 * @param {number} maxRetries - The maximum number of retries.
 * @param {number} delay - The initial delay in milliseconds.
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(fetcher, maxRetries = 5, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetcher();
            if (response.ok) {
                return response;
            } else if (response.status === 429) {
                // Rate limit error
                console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
            } else {
                // Other HTTP error (e.g., 404, 500)
                console.error(`HTTP error ${response.status}: ${response.statusText}. Retrying...`);
            }
        } catch (error) {
            // Network or parsing error
            console.error(`Fetch error: ${error.message}. Retrying...`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
    }
    throw new Error(`API call failed after ${maxRetries} retries.`);
}


// --- 2. Tab Switching Logic ---

/**
 * Hides all content sections and deactivates all tab links.
 */
function deactivateAll() {
    console.log("Deactivating all sections and links.");
    
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
    });

    // Deactivate all links
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
        // Clean up any dynamically applied inline styles or background changes if needed, 
        // though CSS classes should handle styling primarily.
    });
}

/**
 * Activates the clicked tab and shows the corresponding content section.
 * @param {Event} event - The click event.
 */
function handleTabClick(event) {
    // Prevent default navigation for internal hash links
    if (event.target.tagName === 'A' && event.target.getAttribute('href').startsWith('#')) {
        event.preventDefault();
    }

    const clickedLink = event.target.closest('.tab-link');
    if (!clickedLink) return;

    // Get the target section ID from the data attribute, or fall back to href hash
    let targetId = clickedLink.dataset.target || clickedLink.getAttribute('href').replace('#', '');
    
    // Handle external links (GitHub, LinkedIn, Resume)
    if (!targetId || !document.getElementById(targetId)) {
        // If it doesn't map to a section ID, it's an external link. Let it proceed,
        // but ensure the currently active content is still visible (usually #about).
        console.log(`External link clicked or content not found for ID: ${targetId}`);
        return; 
    }

    console.log(`Tab clicked. Target ID: ${targetId}`);
    
    // 1. Deactivate current active elements
    deactivateAll();

    // 2. Activate new tab link and section
    clickedLink.classList.add('active');
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        console.log(`Activating section #${targetId}`);
        targetSection.classList.add('active');
        
        // 3. Update Theme
        updateTheme(targetId);
        
        // 4. Update the global active section ID for persistence/reloads
        currentActiveSectionId = targetId;
        localStorage.setItem('activeSection', targetId);

    } else {
        console.error(`Target section with ID '${targetId}' not found.`);
    }
}

/**
 * Updates the HTML body class to change the overall theme color.
 * @param {string} sectionId - The ID of the currently active section.
 */
function updateTheme(sectionId) {
    // Map section IDs to theme class names (e.g., #about -> theme-about)
    const themeClass = `theme-${sectionId}`;
    
    // Clear all existing theme classes (should only be one)
    document.documentElement.classList.remove('theme-about', 'theme-blog-posts', 'theme-skills');
    
    // Apply the new theme class
    document.documentElement.classList.add(themeClass);
    console.log(`Theme updated to: ${themeClass}`);
}

/**
 * Initializes the progress bars when the skills section becomes active.
 */
function initializeProgressBars() {
    const bars = document.querySelectorAll('.progress-bar .bar');
    bars.forEach(bar => {
        // Use data-progress attribute to get the width percentage
        const progress = bar.getAttribute('data-progress');
        if (progress) {
            // Apply the width to start the CSS transition effect
            bar.style.width = progress; 
        }
    });
}


// --- 3. Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing portfolio script.");
    
    // Attach the single click handler to the navigation container
    const nav = document.querySelector('.tab-navigation');
    if (nav) {
        nav.addEventListener('click', handleTabClick);
    } else {
        console.error("Navigation bar not found. Tab switching won't work.");
    }
    
    // --- Initial Load State ---
    
    // 1. Get the last active section from storage, default to 'about'
    const lastActiveId = localStorage.getItem('activeSection') || 'about';
    currentActiveSectionId = lastActiveId;
    
    // 2. Ensure all are deactivated initially
    deactivateAll(); 

    // 3. Activate the last or default section
    const initialSection = document.getElementById(lastActiveId);
    const initialLink = document.querySelector(`[data-target="${lastActiveId}"], [href="#${lastActiveId}"]`);

    if (initialSection) {
        initialSection.classList.add('active');
        updateTheme(lastActiveId);
        console.log(`Restored active section: #${lastActiveId}`);
    } else {
        // Fallback if stored ID is invalid
        document.getElementById('about').classList.add('active');
        updateTheme('about');
        currentActiveSectionId = 'about';
        console.log("Fallback to 'about' section.");
    }

    if (initialLink) {
        initialLink.classList.add('active');
    }
    
    // 4. Initialize progress bars if the skills section is the default/active one on load
    if (lastActiveId === 'skills') {
        initializeProgressBars();
    }
});


// Add observer to initialize progress bars only when Skills section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.target.id === 'skills' && entry.isIntersecting) {
            initializeProgressBars();
        }
    });
}, { threshold: 0.1 }); // 10% visibility is enough to trigger

// Observe the skills section
document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});
