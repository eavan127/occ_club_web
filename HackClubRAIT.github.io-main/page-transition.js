document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Gradual Blur Overlay
    // We want a full-screen blur transition. 
    // "Gradual" implies gradient, but for transition we might want full coverage or a "curtain" of blur.
    // Let's use 'top' curtain effect.
    let blurOverlay;

    if (typeof GradualBlur !== 'undefined') {
        blurOverlay = new GradualBlur({
            target: 'page',
            position: 'top',
            height: '100%', // Full screen
            strength: 2, // Strong blur
            divCount: 8,
            zIndex: 9999,
            opacity: 1 // Start visible (covering) then fade out
        });

        // Immediate Fade Out on Load (Entrance)
        setTimeout(() => {
            blurOverlay.fadeOut(600); // Fade out over 600ms
            setTimeout(() => {
                // Optional: remove or hide after fade out to save resources
                blurOverlay.container.style.pointerEvents = 'none';
            }, 600);
        }, 100);

    } else {
        console.warn('GradualBlur not loaded');
        // Fallback to simple overlay if needed, or just do nothing
    }

    // 2. Intercept Links (Exit)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || link.target === '_blank') return;

            e.preventDefault();

            if (blurOverlay) {
                blurOverlay.container.style.pointerEvents = 'all'; // Block clicks
                blurOverlay.fadeIn(400); // Fade in
                setTimeout(() => {
                    window.location.href = href;
                }, 400); // Wait for fade
            } else {
                window.location.href = href;
            }
        });
    });
});
