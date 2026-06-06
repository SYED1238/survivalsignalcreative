/**
 * Particle System
 * Dust motes, floating spores, atmospheric debris.
 * Each particle has its own life — drift, sway, fade.
 */

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.maxParticles = 60;
    this.mouseX = 0;
    this.mouseY = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: 1 + Math.random() * 2.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.1 - Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.3,
      life: 0,
      maxLife: 300 + Math.random() * 500,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleAmplitude: 10 + Math.random() * 30,
    };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this._createParticle();
      p.life = Math.random() * p.maxLife;
      this.particles.push(p);
    }
    this._animate();
  }

  stop() {
    this.running = false;
  }

  _animate() {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.life++;
      const lifeRatio = p.life / p.maxLife;
      let alpha = p.opacity;

      // Fade in/out over lifetime
      if (lifeRatio < 0.1) alpha *= lifeRatio / 0.1;
      else if (lifeRatio > 0.8) alpha *= (1 - lifeRatio) / 0.2;

      // Wobble
      const wobble = Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmplitude * 0.02;

      // Mouse influence (very subtle)
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150 * 0.05;
        p.x -= dx * force * 0.01;
        p.y -= dy * force * 0.01;
      }

      p.x += p.speedX + wobble;
      p.y += p.speedY;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(200, 210, 220, ${alpha})`;
      this.ctx.fill();

      // Reset dead particles
      if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > this.canvas.width + 10) {
        this.particles[i] = this._createParticle();
        this.particles[i].y = this.canvas.height + 10;
      }
    }

    requestAnimationFrame(() => this._animate());
  }
}
