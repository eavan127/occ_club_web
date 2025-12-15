
document.addEventListener('DOMContentLoaded', () => {
    // Create overlay if it doesn't exist
    if (!document.querySelector('.page-transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay active'; // Start active (covering)
        document.body.appendChild(overlay);

        // Reveal content after a short delay
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.classList.add('exit');
        }, 100);
    } else {
        // If it exists (hardcoded), reveal
        const overlay = document.querySelector('.page-transition-overlay');
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.classList.add('exit');
        }, 100);
    }

    // Intercept links
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Ignore hash links, external links, or special protocols
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || link.target === '_blank') return;

            e.preventDefault();

            const overlay = document.querySelector('.page-transition-overlay');
            overlay.classList.remove('exit');
            overlay.classList.add('active'); // Cover screen

            setTimeout(() => {
                window.location.href = href;
            }, 600); // Wait for animation
        });
    });
});
