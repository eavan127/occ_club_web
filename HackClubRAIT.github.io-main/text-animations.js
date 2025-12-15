/**
 * Text Animations - Modern Hero Effects
 * Provides typewriter effect and scroll-triggered animations
 */

(function () {
    'use strict';

    // ========================================
    // TYPEWRITER WORD ROTATION
    // ========================================
    class TypewriterRotate {
        constructor(container, words, options = {}) {
            this.container = typeof container === 'string' 
                ? document.querySelector(container) 
                : container;
            
            if (!this.container) {
                console.warn('TypewriterRotate: Container not found');
                return;
            }

            this.words = words;
            this.config = {
                typeSpeed: options.typeSpeed || 80,
                deleteSpeed: options.deleteSpeed || 50,
                holdTime: options.holdTime || 2000,
                pauseBeforeDelete: options.pauseBeforeDelete || 1000,
                loop: options.loop !== false
            };

            this.currentWordIndex = 0;
            this.currentText = '';
            this.isDeleting = false;
            this.isPaused = false;

            this.init();
        }

        init() {
            // Create the cursor element
            this.container.innerHTML = `
                <span class="typewriter-text"></span>
                <span class="typewriter-cursor">|</span>
            `;
            
            this.textElement = this.container.querySelector('.typewriter-text');
            this.cursorElement = this.container.querySelector('.typewriter-cursor');

            // Add cursor blink animation
            this.addCursorStyles();
            
            // Start typing
            this.type();
        }

        addCursorStyles() {
            if (!document.getElementById('typewriter-styles')) {
                const style = document.createElement('style');
                style.id = 'typewriter-styles';
                style.textContent = `
                    .typewriter-cursor {
                        display: inline-block;
                        margin-left: 2px;
                        animation: blink 0.7s infinite;
                        color: var(--primary, #A8F0FF);
                    }
                    
                    @keyframes blink {
                        0%, 50% { opacity: 1; }
                        51%, 100% { opacity: 0; }
                    }
                    
                    .typewriter-text {
                        background: var(--accent-gradient, linear-gradient(135deg, #A8F0FF 0%, #FF9FFC 100%));
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        type() {
            const currentWord = this.words[this.currentWordIndex];
            
            if (this.isDeleting) {
                // Remove characters
                this.currentText = currentWord.substring(0, this.currentText.length - 1);
            } else {
                // Add characters
                this.currentText = currentWord.substring(0, this.currentText.length + 1);
            }

            this.textElement.textContent = this.currentText;

            let typeSpeed = this.isDeleting ? this.config.deleteSpeed : this.config.typeSpeed;

            // Word is complete
            if (!this.isDeleting && this.currentText === currentWord) {
                // Pause before starting to delete
                typeSpeed = this.config.holdTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentText === '') {
                // Move to next word
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                typeSpeed = 500; // Brief pause before typing next word
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    class ScrollReveal {
        constructor(options = {}) {
            this.config = {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px'
            };

            this.init();
        }

        init() {
            // Add animation styles
            this.addStyles();

            // Setup intersection observer
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        // Optional: unobserve after reveal
                        // this.observer.unobserve(entry.target);
                    }
                });
            }, this.config);

            // Observe elements with reveal classes
            this.observeElements();
        }

        addStyles() {
            if (!document.getElementById('scroll-reveal-styles')) {
                const style = document.createElement('style');
                style.id = 'scroll-reveal-styles';
                style.textContent = `
                    .reveal-fade-up {
                        opacity: 0;
                        transform: translateY(40px);
                        transition: opacity 0.8s ease, transform 0.8s ease;
                    }
                    
                    .reveal-fade-up.revealed {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .reveal-fade-left {
                        opacity: 0;
                        transform: translateX(-40px);
                        transition: opacity 0.8s ease, transform 0.8s ease;
                    }
                    
                    .reveal-fade-left.revealed {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    .reveal-fade-right {
                        opacity: 0;
                        transform: translateX(40px);
                        transition: opacity 0.8s ease, transform 0.8s ease;
                    }
                    
                    .reveal-fade-right.revealed {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    .reveal-scale {
                        opacity: 0;
                        transform: scale(0.9);
                        transition: opacity 0.8s ease, transform 0.8s ease;
                    }
                    
                    .reveal-scale.revealed {
                        opacity: 1;
                        transform: scale(1);
                    }
                    
                    /* Staggered animations for children */
                    .reveal-stagger > * {
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 0.5s ease, transform 0.5s ease;
                    }
                    
                    .reveal-stagger.revealed > *:nth-child(1) { transition-delay: 0.1s; }
                    .reveal-stagger.revealed > *:nth-child(2) { transition-delay: 0.2s; }
                    .reveal-stagger.revealed > *:nth-child(3) { transition-delay: 0.3s; }
                    .reveal-stagger.revealed > *:nth-child(4) { transition-delay: 0.4s; }
                    .reveal-stagger.revealed > *:nth-child(5) { transition-delay: 0.5s; }
                    
                    .reveal-stagger.revealed > * {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `;
                document.head.appendChild(style);
            }
        }

        observeElements() {
            const selectors = [
                '.reveal-fade-up',
                '.reveal-fade-left',
                '.reveal-fade-right',
                '.reveal-scale',
                '.reveal-stagger'
            ];

            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    this.observer.observe(el);
                });
            });
        }
    }

    // ========================================
    // PARALLAX EFFECT
    // ========================================
    class ParallaxScroll {
        constructor() {
            this.elements = document.querySelectorAll('[data-parallax]');
            if (this.elements.length === 0) return;

            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.update(), { passive: true });
            this.update();
        }

        update() {
            const scrollY = window.scrollY;

            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const offset = (scrollY - elementTop) * speed;
                
                el.style.transform = `translateY(${offset}px)`;
            });
        }
    }

    // ========================================
    // INITIALIZE ON DOM READY
    // ========================================
    function initAnimations() {
        // Initialize typewriter if container exists
        const typewriterContainer = document.querySelector('.hero-typewriter');
        if (typewriterContainer) {
            new TypewriterRotate(typewriterContainer, [
                'Innovation',
                'Collaboration',
                'Open Source',
                'Technology',
                'Community'
            ], {
                typeSpeed: 100,
                deleteSpeed: 60,
                holdTime: 2000
            });
        }

        // Initialize scroll reveal
        new ScrollReveal();

        // Initialize parallax
        new ParallaxScroll();

        console.log('Text animations initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }

    // Expose classes globally
    window.TypewriterRotate = TypewriterRotate;
    window.ScrollReveal = ScrollReveal;
    window.ParallaxScroll = ParallaxScroll;

})();
