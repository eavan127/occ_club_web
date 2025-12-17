/**
 * BlurText Animation - Vanilla JavaScript Implementation
 * Inspired by React BlurText component
 * Creates a blur-to-clear text reveal animation on scroll
 */

class BlurText {
    constructor(options = {}) {
        this.delay = options.delay || 150; // ms between each element
        this.animateBy = options.animateBy || 'words'; // 'words' or 'characters'
        this.direction = options.direction || 'top'; // 'top' or 'bottom'
        this.threshold = options.threshold || 0.1;
        this.rootMargin = options.rootMargin || '0px';
        this.stepDuration = options.stepDuration || 0.35; // seconds per step
        this.onComplete = options.onAnimationComplete || null;

        this.initialized = [];
    }

    /**
     * Initialize blur text animation on elements
     * @param {string} selector - CSS selector for target elements
     */
    init(selector = '.blur-text') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => this.prepare(el));
    }

    /**
     * Prepare an element for blur text animation
     * @param {HTMLElement} element 
     */
    prepare(element) {
        if (this.initialized.includes(element)) return;
        this.initialized.push(element);

        const text = element.textContent;
        const animateBy = element.dataset.animateBy || this.animateBy;
        const direction = element.dataset.direction || this.direction;
        const delay = parseInt(element.dataset.delay) || this.delay;

        // Split text into elements
        const segments = animateBy === 'words' ? text.split(' ') : text.split('');

        // Clear original content
        element.textContent = '';
        element.style.display = 'flex';
        element.style.flexWrap = 'wrap';
        element.style.gap = animateBy === 'words' ? '0.3em' : '0';

        // Create span for each segment
        segments.forEach((segment, index) => {
            const span = document.createElement('span');
            span.textContent = segment;
            span.className = 'blur-text-segment';
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                filter: blur(10px);
                transform: translateY(${direction === 'top' ? '-30px' : '30px'});
                transition: all ${this.stepDuration}s cubic-bezier(0.4, 0, 0.2, 1);
                transition-delay: ${(index * delay) / 1000}s;
            `;
            element.appendChild(span);
        });

        // Setup intersection observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate(element);
                        observer.unobserve(element);
                    }
                });
            },
            { threshold: this.threshold, rootMargin: this.rootMargin }
        );

        observer.observe(element);
    }

    /**
     * Animate the text reveal
     * @param {HTMLElement} element 
     */
    animate(element) {
        const segments = element.querySelectorAll('.blur-text-segment');

        segments.forEach((span, index) => {
            // Small delay before starting
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.filter = 'blur(0px)';
                span.style.transform = 'translateY(0)';
            }, 50);
        });

        // Call onComplete after all animations
        if (this.onComplete) {
            const lastDelay = (segments.length * this.delay) / 1000 + this.stepDuration;
            setTimeout(() => this.onComplete(), lastDelay * 1000);
        }
    }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const blurText = new BlurText({
        delay: 100,
        animateBy: 'words',
        direction: 'top',
        stepDuration: 0.4
    });

    blurText.init('.blur-text');
});

// Export for manual use
window.BlurText = BlurText;
