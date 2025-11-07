/* --- 9. Liquid Cursor Effect (Metaball) Styles --- */

#liquid-cursor-container {
    /* CRITICAL FIX: Increased blur dramatically for a better fusion effect */
    filter: blur(35px); 
    /* Changed blend mode to difference for a more striking fusion effect against black */
    mix-blend-mode: difference; 
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Allows clicks to pass through */
    z-index: 9999;
}

.dot {
    position: absolute;
    /* Increased size slightly to make the merged area larger */
    width: 50px; 
    height: 50px;
    border-radius: 50%;
    transform: translate(-50%, -50%); /* Centers the dot on the cursor */
    transition: width 0.1s, height 0.1s; /* Smooth animation */
    will-change: transform; 
}

/* Use your new Neo-Mint and Electric Teal colors */
.primary-dot {
    background-color: var(--primary-color); 
    opacity: 0.9; 
}

.accent-dot {
    background-color: var(--accent-color);
    opacity: 0.8;
    /* Increased size of the accent dot as well */
    width: 35px; 
    height: 35px;
}
