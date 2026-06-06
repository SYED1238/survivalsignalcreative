/**
 * Scroll Narrative Controller
 * This is the director. It watches where the visitor is
 * and triggers moments at the right time.
 */

export class ScrollController {
  constructor() {
    this.observers = new Map();
    this.scrollCallbacks = [];
    this._onScroll = this._onScroll.bind(this);
    this._ticking = false;
    this._scrollY = 0;

    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  /**
   * Watch an element — call back when it enters/exits viewport.
   */
  observe(element, options = {}) {
    const threshold = options.threshold || 0.2;
    const once = options.once !== false;
    const onEnter = options.onEnter;
    const onExit = options.onExit;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (onEnter) onEnter(entry);
          if (once) observer.disconnect();
        } else {
          if (onExit) onExit(entry);
        }
      }
    }, {
      threshold,
      rootMargin: options.rootMargin || '0px',
    });

    observer.observe(element);
    this.observers.set(element, observer);
    return observer;
  }

  /**
   * Register a scroll progress callback for an element.
   * Progress is 0 at top of element, 1 at bottom.
   */
  onProgress(element, callback) {
    this.scrollCallbacks.push({ element, callback });
  }

  /**
   * Get scroll progress through an element (0 to 1).
   */
  getProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;

    if (elementTop > windowHeight) return 0;
    if (elementTop + elementHeight < 0) return 1;

    const scrolled = windowHeight - elementTop;
    return Math.max(0, Math.min(1, scrolled / (windowHeight + elementHeight)));
  }

  /**
   * Get the global scroll percentage (0 to 1).
   */
  getGlobalProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? window.scrollY / docHeight : 0;
  }

  _onScroll() {
    this._scrollY = window.scrollY;
    if (!this._ticking) {
      requestAnimationFrame(() => {
        for (const { element, callback } of this.scrollCallbacks) {
          const progress = this.getProgress(element);
          callback(progress, this._scrollY);
        }
        this._ticking = false;
      });
      this._ticking = true;
    }
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
  }
}
