/**
 * Antigravity Particle Animation - Vanilla JavaScript Version
 * Uses Three.js for 3D particle effects with mouse interaction
 */

(function () {
    'use strict';

    class Antigravity {
        constructor(container, options = {}) {
            this.container = typeof container === 'string' ? document.querySelector(container) : container;

            if (!this.container) {
                console.error('Antigravity: Container not found');
                return;
            }

            // Configuration with defaults
            this.config = {
                count: options.count || 400,
                magnetRadius: options.magnetRadius || 20,
                ringRadius: options.ringRadius || 10,
                waveSpeed: options.waveSpeed || 0.4,
                waveAmplitude: options.waveAmplitude || 1,
                particleSize: options.particleSize || 2,
                lerpSpeed: options.lerpSpeed || 0.05,
                color: options.color || '#FF9FFC',
                autoAnimate: options.autoAnimate !== false,
                particleVariance: options.particleVariance || 1,
                depthFactor: options.depthFactor || 1,
                pulseSpeed: options.pulseSpeed || 3
            };

            this.mouse = { x: 0, y: 0 };
            this.virtualMouse = { x: 0, y: 0 };
            this.lastMouseMoveTime = 0;
            this.particles = [];
            this.clock = null;
            this.isInitialized = false;

            this.init();
        }

        init() {
            // Check if THREE is available
            if (typeof THREE === 'undefined') {
                console.error('Antigravity: Three.js is not loaded');
                return;
            }

            this.clock = new THREE.Clock();

            // Setup scene
            this.scene = new THREE.Scene();

            // Get container dimensions
            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || window.innerHeight;

            // Setup camera
            const aspect = width / height;
            this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000);
            this.camera.position.z = 50;

            // Setup renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);

            // Style the canvas
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.width = '100%';
            this.renderer.domElement.style.height = '100%';
            this.renderer.domElement.style.pointerEvents = 'none';

            this.container.appendChild(this.renderer.domElement);

            // Create particles
            this.createParticles();

            // Event listeners
            this.addEventListeners();

            this.isInitialized = true;
            console.log('Antigravity: Initialized with', this.config.count, 'particles');

            // Start animation
            this.animate();
        }

        createParticles() {
            const geometry = new THREE.SphereGeometry(0.15, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: 0.9
            });

            this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.config.count);
            this.scene.add(this.instancedMesh);

            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || window.innerHeight;
            const aspect = width / height;

            const viewWidth = 60 * aspect;
            const viewHeight = 60;

            for (let i = 0; i < this.config.count; i++) {
                const x = (Math.random() - 0.5) * viewWidth;
                const y = (Math.random() - 0.5) * viewHeight;
                const z = (Math.random() - 0.5) * 30;

                this.particles.push({
                    t: Math.random() * 100,
                    speed: 0.01 + Math.random() / 200,
                    mx: x, my: y, mz: z,
                    cx: x, cy: y, cz: z,
                    randomRadiusOffset: (Math.random() - 0.5) * 2
                });
            }

            this.dummy = new THREE.Object3D();
        }

        addEventListeners() {
            // Listen on document for mouse movement (works better with overlays)
            document.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                    this.lastMouseMoveTime = Date.now();
                }
            });

            window.addEventListener('resize', () => this.onResize());
        }

        onResize() {
            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }

        animate() {
            if (!this.isInitialized) return;

            requestAnimationFrame(() => this.animate());

            const elapsed = this.clock.getElapsedTime();
            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || window.innerHeight;
            const aspect = width / height;

            const viewWidth = 30 * aspect;
            const viewHeight = 30;

            // Calculate target position
            let destX = this.mouse.x * viewWidth;
            let destY = this.mouse.y * viewHeight;

            // Auto-animate when mouse is idle
            if (this.config.autoAnimate && Date.now() - this.lastMouseMoveTime > 1500) {
                destX = Math.sin(elapsed * 0.3) * (viewWidth * 0.6);
                destY = Math.cos(elapsed * 0.4) * (viewHeight * 0.4);
            }

            // Smooth mouse movement
            this.virtualMouse.x += (destX - this.virtualMouse.x) * 0.05;
            this.virtualMouse.y += (destY - this.virtualMouse.y) * 0.05;

            const targetX = this.virtualMouse.x;
            const targetY = this.virtualMouse.y;

            // Update particles
            this.particles.forEach((particle, i) => {
                particle.t += particle.speed / 2;

                const projectionFactor = 1 - particle.cz / 50;
                const projectedTargetX = targetX * projectionFactor;
                const projectedTargetY = targetY * projectionFactor;

                const dx = particle.mx - projectedTargetX;
                const dy = particle.my - projectedTargetY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let targetPos = {
                    x: particle.mx,
                    y: particle.my,
                    z: particle.mz * this.config.depthFactor
                };

                if (dist < this.config.magnetRadius) {
                    const angle = Math.atan2(dy, dx);
                    const wave = Math.sin(particle.t * this.config.waveSpeed + angle) * (0.5 * this.config.waveAmplitude);
                    const deviation = particle.randomRadiusOffset * 0.5;
                    const currentRingRadius = this.config.ringRadius + wave + deviation;

                    targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
                    targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
                    targetPos.z = particle.mz * this.config.depthFactor + Math.sin(particle.t) * this.config.waveAmplitude;
                }

                // Lerp to target
                particle.cx += (targetPos.x - particle.cx) * this.config.lerpSpeed;
                particle.cy += (targetPos.y - particle.cy) * this.config.lerpSpeed;
                particle.cz += (targetPos.z - particle.cz) * this.config.lerpSpeed;

                // Update transform
                this.dummy.position.set(particle.cx, particle.cy, particle.cz);

                // Scale based on distance
                const currentDist = Math.sqrt(
                    Math.pow(particle.cx - projectedTargetX, 2) +
                    Math.pow(particle.cy - projectedTargetY, 2)
                );
                const distFromRing = Math.abs(currentDist - this.config.ringRadius);
                let scaleFactor = Math.max(0.1, Math.min(1, 1 - distFromRing / 15));
                const pulse = 0.8 + Math.sin(particle.t * this.config.pulseSpeed) * 0.2 * this.config.particleVariance;
                const finalScale = scaleFactor * pulse * this.config.particleSize;

                this.dummy.scale.set(finalScale, finalScale, finalScale);
                this.dummy.updateMatrix();
                this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
            });

            this.instancedMesh.instanceMatrix.needsUpdate = true;
            this.renderer.render(this.scene, this.camera);
        }

        destroy() {
            if (this.renderer) {
                this.renderer.dispose();
                if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                    this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
                }
            }
            this.isInitialized = false;
        }
    }

    // Expose globally
    window.Antigravity = Antigravity;

    // Auto-initialize when DOM is ready
    function initAntigravity() {
        const container = document.getElementById('antigravity-bg');
        if (container && typeof THREE !== 'undefined') {
            console.log('Antigravity: Starting initialization...');
            window.antigravityInstance = new Antigravity(container, {
                count: 400,
                magnetRadius: 25,
                ringRadius: 12,
                color: '#A8F0FF',
                particleSize: 1.5,
                autoAnimate: true
            });
        } else {
            if (!container) console.error('Antigravity: #antigravity-bg container not found');
            if (typeof THREE === 'undefined') console.error('Antigravity: THREE.js not loaded');
        }
    }

    // Try to initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAntigravity);
    } else {
        // DOM already loaded
        initAntigravity();
    }

    // Also try on window load as fallback
    window.addEventListener('load', function () {
        if (!window.antigravityInstance) {
            initAntigravity();
        }
    });
})();
