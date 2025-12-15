// Preloader Script - Minimalist Loading Animation
const bodyTag = document.body;
const loaderContainer = document.getElementById("loader_fixed_container");
const percentageEl = document.getElementById('loader-percentage');
const progressBar = document.getElementById('loaderProgressBar');
const container = document.querySelector('.loader_container');

// Configuration
const startPercentage = 0;
const targetPercentage = 100;
const duration = 3000; // 3 seconds total
const startDelay = 300; // Small delay before starting

// Easing function for smooth acceleration/deceleration
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

// Simulate loading animation
const simulateLoading = () => {
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
        const elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);

        // Apply easing
        const easedProgress = easeOutQuart(progress);

        // Calculate current percentage with a pause effect near 97%
        let currentPercentage;
        if (easedProgress < 0.85) {
            // Fast progress to 97%
            currentPercentage = Math.floor(startPercentage + (97 - startPercentage) * (easedProgress / 0.85));
        } else {
            // Slow progress from 97% to 100%
            const remainingProgress = (easedProgress - 0.85) / 0.15;
            currentPercentage = Math.floor(97 + 3 * remainingProgress);
        }

        // Update DOM
        if (percentageEl) {
            percentageEl.textContent = Math.min(currentPercentage, targetPercentage);
        }
        if (progressBar) {
            progressBar.style.width = `${Math.min(currentPercentage, targetPercentage)}%`;
        }

        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            // Ensure we end at exactly 100%
            if (percentageEl) percentageEl.textContent = targetPercentage;
            if (progressBar) progressBar.style.width = '100%';
            if (container) container.classList.add('complete');

            // Hide loader after completion
            setTimeout(hideLoader, 500);
        }
    };

    requestAnimationFrame(updateProgress);
};

// Hide the loader
const hideLoader = () => {
    if (loaderContainer) {
        // Trigger Zoom-In Transition EARLIER (as loader starts fading)
        const mainContent = document.getElementById('main-content-wrapper');
        if (mainContent) {
            mainContent.classList.add('loaded-content');
        }

        loaderContainer.classList.add('fade-out');

        // Remove scroll lock
        if (bodyTag.classList.contains('no_scroll_bar_visible')) {
            bodyTag.classList.remove('no_scroll_bar_visible');
            bodyTag.classList.add('scroll_bar_visible');
        }

        // Remove loader from DOM after transition
        setTimeout(() => {
            loaderContainer.style.display = 'none';
        }, 500);

        console.log('✓ Loader hidden, page ready');
    }
};

// Start animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Starting loading animation');
    setTimeout(simulateLoading, startDelay);
});

// Fallback: Hide loader if page takes too long
window.addEventListener('load', () => {
    // If loader is still visible after page load + 5 seconds, force hide
    setTimeout(() => {
        if (loaderContainer && !loaderContainer.classList.contains('fade-out')) {
            console.log('⚠ Forcing loader hide');
            hideLoader();
        }
    }, 5000);
});