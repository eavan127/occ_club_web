class ClickSpark {
    constructor(options = {}) {
        this.sparkColor = options.sparkColor || '#fff';
        this.sparkSize = options.sparkSize || 10;
        this.sparkRadius = options.sparkRadius || 15;
        this.sparkCount = options.sparkCount || 8;
        this.duration = options.duration || 400;
        this.easing = options.easing || 'ease-out';
        this.extraScale = options.extraScale || 1.0;
        this.activeSparks = [];
        this.startTime = null;
        this.animationId = null;

        this.root = options.root || document.body;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.init();
    }

    init() {
        // Style the canvas to be an overlay
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none'; // Passthrough clicks
        this.canvas.style.zIndex = '9999'; // On top of everything
        this.canvas.style.userSelect = 'none';

        // Ensure root is relative if static (so absolute canvas works)
        const rootStyle = window.getComputedStyle(this.root);
        if (rootStyle.position === 'static') {
            this.root.style.position = 'relative';
        }

        this.root.appendChild(this.canvas);

        // Resize Observer
        this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        this.resizeObserver.observe(this.root);
        this.resizeCanvas(); // Initial size

        // Click Listener
        this.root.addEventListener('click', (e) => this.handleClick(e));

        // Start Loop
        this.animate();
    }

    resizeCanvas() {
        const { width, height } = this.root.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
    }

    easeFunc(t) {
        switch (this.easing) {
            case 'linear': return t;
            case 'ease-in': return t * t;
            case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            default: return t * (2 - t); // ease-out
        }
    }

    handleClick(e) {
        const rect = this.root.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = performance.now();

        const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
            x,
            y,
            angle: (2 * Math.PI * i) / this.sparkCount,
            startTime: now
        }));

        this.activeSparks.push(...newSparks);
    }

    animate(timestamp) {
        if (!timestamp) {
            this.animationId = requestAnimationFrame((t) => this.animate(t));
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.activeSparks = this.activeSparks.filter(spark => {
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= this.duration) return false;

            const progress = elapsed / this.duration;
            const eased = this.easeFunc(progress);

            const distance = eased * this.sparkRadius * this.extraScale;
            const lineLength = this.sparkSize * (1 - eased);

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

            this.ctx.strokeStyle = this.sparkColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            return true;
        });

        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.root.removeEventListener('click', (e) => this.handleClick(e));
        if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    }
}
