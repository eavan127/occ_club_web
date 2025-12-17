/**
 * Plasma Effect - Vanilla JavaScript Implementation
 * Converted from React/OGL component to pure WebGL
 */

class Plasma {
    constructor(container, options = {}) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            console.error('Plasma: Container not found');
            return;
        }

        // Options with defaults
        this.color = options.color || '#A8F0FF'; // OCC brand color
        this.speed = (options.speed || 0.6) * 0.4;
        this.direction = options.direction || 'forward';
        this.scale = options.scale || 1.1;
        this.opacity = options.opacity || 0.8;
        this.mouseInteractive = options.mouseInteractive !== false;

        this.mousePos = { x: 0, y: 0 };
        this.raf = null;
        this.startTime = performance.now();

        this.init();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return [0.66, 0.94, 1.0]; // Default cyan
        return [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        ];
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
        this.container.appendChild(this.canvas);

        // Get WebGL2 context
        this.gl = this.canvas.getContext('webgl2', {
            alpha: true,
            antialias: false,
            premultipliedAlpha: false
        });

        if (!this.gl) {
            console.error('Plasma: WebGL2 not supported');
            return;
        }

        this.setupShaders();
        this.setupGeometry();
        this.resize();

        // Event listeners
        window.addEventListener('resize', () => this.resize());

        if (this.mouseInteractive) {
            this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        }

        // Start animation
        this.animate();
    }

    setupShaders() {
        const gl = this.gl;

        // Vertex shader
        const vertexSource = `#version 300 es
            precision highp float;
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Fragment shader (simplified plasma effect)
        const fragmentSource = `#version 300 es
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;
            uniform vec3 uColor;
            uniform float uSpeed;
            uniform float uScale;
            uniform float uOpacity;
            uniform vec2 uMouse;
            uniform float uMouseInteractive;
            out vec4 fragColor;

            void main() {
                vec2 uv = gl_FragCoord.xy / iResolution.xy;
                vec2 center = vec2(0.5);
                
                // Apply mouse influence
                vec2 mouseNorm = uMouse / iResolution;
                vec2 mouseOffset = (mouseNorm - center) * 0.1 * uMouseInteractive;
                uv += mouseOffset * (1.0 - length(uv - center));
                
                // Scale from center
                uv = (uv - center) / uScale + center;
                
                float t = iTime * uSpeed;
                
                // Plasma calculation
                float v = 0.0;
                vec2 c = uv * 8.0 - vec2(4.0);
                
                v += sin((c.x + t));
                v += sin((c.y + t) / 2.0);
                v += sin((c.x + c.y + t) / 2.0);
                
                c += vec2(sin(t / 3.0), cos(t / 2.0)) * 2.0;
                v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + t);
                v = v / 2.0;
                
                // Color calculation
                vec3 col = vec3(
                    sin(v * 3.14159),
                    sin(v * 3.14159 + 2.094),
                    sin(v * 3.14159 + 4.188)
                );
                
                // Apply custom color tint
                float intensity = (col.r + col.g + col.b) / 3.0;
                col = mix(col * 0.3, uColor * intensity * 1.5, 0.7);
                
                // Fade edges
                float edgeFade = smoothstep(0.0, 0.3, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
                
                fragColor = vec4(col, intensity * uOpacity * edgeFade);
            }
        `;

        // Compile shaders
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
        }

        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(this.program));
        }

        gl.useProgram(this.program);

        // Get uniform locations
        this.uniforms = {
            iResolution: gl.getUniformLocation(this.program, 'iResolution'),
            iTime: gl.getUniformLocation(this.program, 'iTime'),
            uColor: gl.getUniformLocation(this.program, 'uColor'),
            uSpeed: gl.getUniformLocation(this.program, 'uSpeed'),
            uScale: gl.getUniformLocation(this.program, 'uScale'),
            uOpacity: gl.getUniformLocation(this.program, 'uOpacity'),
            uMouse: gl.getUniformLocation(this.program, 'uMouse'),
            uMouseInteractive: gl.getUniformLocation(this.program, 'uMouseInteractive')
        };

        // Set initial uniforms
        const rgb = this.hexToRgb(this.color);
        gl.uniform3f(this.uniforms.uColor, rgb[0], rgb[1], rgb[2]);
        gl.uniform1f(this.uniforms.uSpeed, this.speed);
        gl.uniform1f(this.uniforms.uScale, this.scale);
        gl.uniform1f(this.uniforms.uOpacity, this.opacity);
        gl.uniform1f(this.uniforms.uMouseInteractive, this.mouseInteractive ? 1.0 : 0.0);
    }

    setupGeometry() {
        const gl = this.gl;

        // Full-screen quad (two triangles)
        const vertices = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(this.program, 'position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.uniforms.iResolution, this.canvas.width, this.canvas.height);
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.mousePos.x = (e.clientX - rect.left) * dpr;
        this.mousePos.y = (rect.height - (e.clientY - rect.top)) * dpr; // Flip Y
    }

    animate() {
        const gl = this.gl;
        const elapsed = (performance.now() - this.startTime) * 0.001;

        gl.uniform1f(this.uniforms.iTime, elapsed);
        gl.uniform2f(this.uniforms.uMouse, this.mousePos.x, this.mousePos.y);

        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        this.raf = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.raf) {
            cancelAnimationFrame(this.raf);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Export for use
window.Plasma = Plasma;

// Update mouse handling to work even if container has pointer-events: none
Plasma.prototype.handleMouseMove = function (e) {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Calculate mouse position relative to canvas, but constrained to window
    this.mousePos.x = (e.clientX - rect.left) * dpr;
    this.mousePos.y = (rect.height - (e.clientY - rect.top)) * dpr; // Flip Y for WebGL
};

// Override dragging/selection issues
Plasma.prototype.init = function () {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
    this.container.appendChild(this.canvas);

    // Get WebGL2 context
    this.gl = this.canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false
    });

    if (!this.gl) {
        console.error('Plasma: WebGL2 not supported');
        return;
    }

    this.setupShaders();
    this.setupGeometry();
    this.resize();

    // Event listeners
    window.addEventListener('resize', () => this.resize());

    // Listen on window to capture cursor movement anywhere
    if (this.mouseInteractive) {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    console.log('Plasma initialized successfully');

    // Start animation
    this.animate();
};
