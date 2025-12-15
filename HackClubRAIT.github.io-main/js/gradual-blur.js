class GradualBlur {
    constructor(options = {}) {
        this.config = Object.assign({
            position: 'bottom',
            strength: 2,
            height: '6rem',
            divCount: 5,
            exponential: false,
            zIndex: 1000,
            animated: false,
            duration: '0.3s',
            easing: 'ease-out',
            opacity: 1,
            curve: 'linear',
            target: 'parent', // 'parent' or 'page'
            root: document.body
        }, options);

        this.container = null;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = `gradual-blur ${this.config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'}`;

        // Base Styles
        Object.assign(this.container.style, {
            position: this.config.target === 'page' ? 'fixed' : 'absolute',
            pointerEvents: 'none',
            zIndex: this.config.target === 'page' ? this.config.zIndex + 100 : this.config.zIndex,
            inset: '0', // Cover fully if not sized
            width: '100%',
            height: '100%',
            // If position is specific, we might size it, but for page transition we typically want full cover or large gradient
            // The React code sizes it based on height/width props.
            // Let's defer sizing to 'update()' or just handle top/bottom logic.
        });

        if (['top', 'bottom'].includes(this.config.position)) {
            this.container.style.height = this.config.height;
            this.container.style[this.config.position] = '0';
            this.container.style.top = this.config.position === 'bottom' ? 'auto' : '0';
            this.container.style.bottom = this.config.position === 'top' ? 'auto' : '0';
        }

        this.renderLayers();

        if (this.config.target === 'page') {
            document.body.appendChild(this.container);
        } else {
            this.config.root.appendChild(this.container);
            this.config.root.style.position = 'relative'; // Ensure parent is relative
        }
    }

    renderLayers() {
        this.container.innerHTML = '';
        const { divCount, strength, exponential, curve, position, opacity } = this.config;
        const increment = 100 / divCount;

        // Map curve functions roughly
        const curveFuncs = {
            'linear': p => p,
            'bezier': p => p * p * (3 - 2 * p),
            'ease-in': p => p * p,
            'ease-out': p => 1 - Math.pow(1 - p, 2),
            'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
        };
        const ease = curveFuncs[curve] || curveFuncs.linear;

        const directionMap = {
            top: 'to top',
            bottom: 'to bottom',
            left: 'to left',
            right: 'to right'
        };
        const direction = directionMap[position] || 'to bottom';

        const inner = document.createElement('div');
        inner.className = 'gradual-blur-inner';
        inner.style.position = 'relative';
        inner.style.width = '100%';
        inner.style.height = '100%';

        for (let i = 1; i <= divCount; i++) {
            let progress = i / divCount;
            progress = ease(progress);

            let blurValue;
            if (exponential) {
                blurValue = Math.pow(2, progress * 4) * 0.0625 * strength;
            } else {
                blurValue = 0.0625 * (progress * divCount + 1) * strength;
            }

            // Logic from React: calculate gradient stops to band the blur
            const p1 = (increment * i - increment).toFixed(1);
            const p2 = (increment * i).toFixed(1);
            const p3 = (increment * i + increment).toFixed(1);
            const p4 = (increment * i + increment * 2).toFixed(1);

            let gradient = `transparent ${p1}%, black ${p2}%`;
            if (parseFloat(p3) <= 100) gradient += `, black ${p3}%`;
            if (parseFloat(p4) <= 100) gradient += `, transparent ${p4}%`;

            const layer = document.createElement('div');
            Object.assign(layer.style, {
                position: 'absolute',
                inset: '0',
                maskImage: `linear-gradient(${direction}, ${gradient})`,
                webkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
                backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                webkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                opacity: opacity
            });

            inner.appendChild(layer);
        }
        this.container.appendChild(inner);
    }

    update(options) {
        Object.assign(this.config, options);
        this.renderLayers();
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    // Animation methods for transition
    fadeIn(duration) {
        this.container.style.transition = `opacity ${duration}ms ease`;
        // Force reflow
        this.container.offsetHeight;
        this.container.style.opacity = '1';
    }

    fadeOut(duration) {
        this.container.style.transition = `opacity ${duration}ms ease`;
        this.container.style.opacity = '0';
    }
}
