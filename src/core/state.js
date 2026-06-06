/**
 * World State Manager
 * Tracks what the visitor has seen, discovered, and changed.
 * The visitor's presence changes the world.
 */

class WorldState {
  constructor() {
    this.state = {
      signalStrength: 0,        // 0 to 100
      prologueComplete: false,
      signalRevealed: false,
      memoriesFound: 0,
      totalMemories: 4,
      zonesExplored: [],
      discoveryFound: false,
      corruptedFileClicks: 0,
      transmissionSent: false,
      connected: false,
    };

    this.listeners = new Map();
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const old = this.state[key];
    this.state[key] = value;

    if (old !== value) {
      this._notify(key, value, old);
    }
  }

  on(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }

  _notify(key, value, old) {
    const cbs = this.listeners.get(key) || [];
    for (const cb of cbs) {
      cb(value, old);
    }

    // Derived state updates
    this._updateDerivedState();
  }

  _updateDerivedState() {
    // Update signal strength based on exploration
    const baseSignal = this.state.prologueComplete ? 17 : 0;
    const scrollSignal = this.state.signalRevealed ? 20 : 0;
    const memorySignal = (this.state.memoriesFound / this.state.totalMemories) * 25;
    const exploreSignal = this.state.zonesExplored.length * 5;
    const discoverySignal = this.state.discoveryFound ? 13 : 0;
    const transmitSignal = this.state.transmissionSent ? 20 : 0;

    const total = Math.min(100,
      baseSignal + scrollSignal + memorySignal + exploreSignal + discoverySignal + transmitSignal
    );

    if (total !== this.state.signalStrength) {
      this.state.signalStrength = total;
      this._notify('signalStrength', total);
    }
  }

  /**
   * Update the signal strength HUD display.
   */
  updateSignalDisplay() {
    const strength = this.state.signalStrength;
    const segments = document.querySelectorAll('.signal__strength-segment');
    const filled = Math.floor(strength / 10);

    segments.forEach((seg, i) => {
      seg.classList.toggle('filled', i < filled);
    });

    // Update the text display
    const barEl = document.querySelector('.signal-bar');
    if (barEl) {
      const filledBlocks = '█'.repeat(filled);
      const emptyBlocks = '░'.repeat(10 - filled);
      barEl.innerHTML = `
        SIGNAL <span class="signal-bar__fill">${filledBlocks}</span><span class="signal-bar__empty">${emptyBlocks}</span> ${strength}%
      `;
    }
  }
}

export const worldState = new WorldState();
