/**
 * Parallax System
 * Multi-layer depth from mouse movement and scroll position.
 * The world should feel like you're looking through a window.
 */

export class ParallaxSystem {
  constructor(container, options = {}) {
    this.container = container;
    this.layers = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollProgress = 0;
    this.sensitivity = options.sensitivity || 1;
    this.smoothing = options.smoothing || 0.05;
    this.running = false;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._animate = this._animate.bind(this);
  }

  addLayer(element, depth) {
    this.layers.push({ element, depth });
  }

  start() {
    if (this.running) return;
    this.running = true;
    window.addEventListener('mousemove', this._onMouseMove);
    this._animate();
  }

  stop() {
    this.running = false;
    window.removeEventListener('mousemove', this._onMouseMove);
  }

  setScrollProgress(progress) {
    this.scrollProgress = progress;
  }

  _onMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    this.targetMouseX = (e.clientX - centerX) / centerX;
    this.targetMouseY = (e.clientY - centerY) / centerY;
  }

  _animate() {
    if (!this.running) return;

    // Smooth interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * this.smoothing;
    this.mouseY += (this.targetMouseY - this.mouseY) * this.smoothing;

    for (const layer of this.layers) {
      const moveX = this.mouseX * layer.depth * 20 * this.sensitivity;
      const moveY = this.mouseY * layer.depth * 10 * this.sensitivity;
      const scrollShift = this.scrollProgress * layer.depth * 50;

      layer.element.style.transform =
        `translate(${moveX}px, ${moveY - scrollShift}px)`;
    }

    requestAnimationFrame(this._animate);
  }
}
