document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.framework-timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const dots = document.querySelectorAll('.timeline-dot');

    const observerOptions = {
        root: timelineContainer, // Observe relative to the horizontal container
        threshold: 0.5 // Active when at least 50% visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                timelineItems.forEach(i => i.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));

                // Add active to current
                entry.target.classList.add('active');

                // Update specific dot
                const id = entry.target.getAttribute('id');
                const activeDot = document.querySelector(`.timeline-dot[data-target="#${id}"]`);
                if (activeDot) {
                    activeDot.classList.add('active');
                }
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Click to Scroll Horizontal
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetItem = document.querySelector(targetId);
            if (targetItem) {
                // Ensure the container scrolls to the item's left position
                const offsetLeft = targetItem.offsetLeft;
                timelineContainer.scrollTo({
                    left: offsetLeft,
                    behavior: 'smooth'
                });
            }
        });
    });
});
