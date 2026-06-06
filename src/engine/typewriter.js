/**
 * Typewriter Engine
 * Makes text appear like it's being decoded from a signal.
 * Variable timing — faster when routine, slower when emotional.
 */

export class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.speed = options.speed || 40;
    this.variation = options.variation || 15;
    this.pauseOnPunctuation = options.pauseOnPunctuation !== false;
    this.cursor = options.cursor !== false;
    this.onComplete = options.onComplete || null;
    this._cancelled = false;
  }

  async type(text) {
    this._cancelled = false;
    this.element.style.opacity = '1';

    if (this.cursor) {
      this._cursorEl = document.createElement('span');
      this._cursorEl.className = 'prologue__cursor';
      this.element.appendChild(this._cursorEl);
    }

    for (let i = 0; i < text.length; i++) {
      if (this._cancelled) break;

      const char = text[i];

      if (this._cursorEl) {
        this.element.insertBefore(
          document.createTextNode(char),
          this._cursorEl
        );
      } else {
        this.element.textContent += char;
      }

      let delay = this.speed + (Math.random() - 0.5) * this.variation;

      if (this.pauseOnPunctuation) {
        if (char === '.' || char === '—') delay += 300;
        else if (char === ',') delay += 150;
        else if (char === '\n') delay += 200;
      }

      await this._wait(delay);
    }

    if (this.onComplete) this.onComplete();
    return this;
  }

  removeCursor() {
    if (this._cursorEl && this._cursorEl.parentNode) {
      this._cursorEl.remove();
    }
  }

  cancel() {
    this._cancelled = true;
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Type a sequence of lines into a container.
 * Each line gets its own element.
 */
export async function typeSequence(container, lines, options = {}) {
  const speed = options.speed || 30;
  const lineDelay = options.lineDelay || 400;
  const lineClass = options.lineClass || 'prologue__line';

  for (const line of lines) {
    const el = document.createElement('div');
    el.className = `${lineClass} ${line.class || ''}`;
    container.appendChild(el);

    const tw = new Typewriter(el, {
      speed: line.speed || speed,
      cursor: false,
      variation: 10,
    });

    await tw.type(line.text);
    await new Promise(r => setTimeout(r, line.delay || lineDelay));
  }
}
