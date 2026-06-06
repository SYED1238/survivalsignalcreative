/**
 * Rain System
 * Canvas-based rain with directional streaks, variable speed, and depth layers.
 * This isn't decorative — it's weather.
 */

export class RainSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.drops = [];
    this.running = false;
    this.intensity = 0.6;
    this.wind = 2;
    this.maxDrops = 300;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._initDrops();
  }

  _initDrops() {
    this.drops = [];
    const count = Math.floor(this.maxDrops * this.intensity);
    for (let i = 0; i < count; i++) {
      this.drops.push(this._createDrop());
    }
  }

  _createDrop() {
    const depth = Math.random();
    return {
      x: Math.random() * this.canvas.width * 1.2 - this.canvas.width * 0.1,
      y: Math.random() * this.canvas.height * -1,
      length: 15 + depth * 25,
      speed: 8 + depth * 14,
      width: 0.5 + depth * 1,
      opacity: 0.05 + depth * 0.15,
      depth,
    };
  }

  setIntensity(val) {
    this.intensity = Math.max(0, Math.min(1, val));
    const targetCount = Math.floor(this.maxDrops * this.intensity);
    while (this.drops.length < targetCount) {
      this.drops.push(this._createDrop());
    }
    while (this.drops.length > targetCount) {
      this.drops.pop();
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._animate();
  }

  stop() {
    this.running = false;
  }

  _animate() {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const drop of this.drops) {
      this.ctx.beginPath();
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(
        drop.x + this.wind * drop.depth,
        drop.y + drop.length
      );
      this.ctx.strokeStyle = `rgba(180, 200, 210, ${drop.opacity})`;
      this.ctx.lineWidth = drop.width;
      this.ctx.stroke();

      drop.y += drop.speed;
      drop.x += this.wind * drop.depth * 0.3;

      if (drop.y > this.canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width * 1.2 - this.canvas.width * 0.1;
      }
    }

    requestAnimationFrame(() => this._animate());
  }
}
