document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const container = document.querySelector('.framework-timeline');

    // Function to checking which item is closest to center
    const checkScroll = () => {
        const viewportCenter = window.innerHeight / 2;
        let closestItem = null;
        let minDistance = Infinity;

        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            // Calculate distance from item center to viewport center
            const itemCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(viewportCenter - itemCenter);

            // Add slight bias/offset if needed, but simple center distance usually works best
            // for "1 then 2 then 3" flow.

            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });

        // Update active classes
        timelineItems.forEach(item => {
            if (item === closestItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // Initial check
    checkScroll();

    // Listen to scroll
    window.addEventListener('scroll', checkScroll, { passive: true });
    // Also listen to resize
    window.addEventListener('resize', checkScroll, { passive: true });
});
