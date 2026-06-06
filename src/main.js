/**
 * ═══════════════════════════════════════════════════════════
 * PROJECT REMNANT — Main Orchestrator
 * 
 * This is the director. It initializes every system,
 * connects every moment, and controls the flow of the
 * narrative experience.
 * 
 * The visitor IS the signal. Their attention changes the world.
 * ═══════════════════════════════════════════════════════════
 */

import './style.css';
import { Typewriter, typeSequence } from './engine/typewriter.js';
import { RainSystem } from './engine/rain.js';
import { ParticleSystem } from './engine/particles.js';
import { ParallaxSystem } from './engine/parallax.js';
import { glitchElement, glitchText, screenCorrupt } from './engine/glitch.js';
import { ScrollController } from './core/scroll.js';
import { worldState } from './core/state.js';


// ─── SYSTEMS ───
let rain, particles, parallax, scroll;


// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════

function init() {
  // Initialize core systems
  scroll = new ScrollController();
  rain = new RainSystem(document.getElementById('rain-canvas'));
  particles = new ParticleSystem(document.getElementById('particle-canvas'));

  // State change listeners
  worldState.on('signalStrength', () => worldState.updateSignalDisplay());
  worldState.on('connected', (val) => {
    if (val) {
      document.body.classList.add('signal-connected');
      document.getElementById('signal-status-text').textContent = 'CONNECTED';
    }
  });

  // Start the prologue
  startPrologue();

  // Setup all moments
  setupSignalMoment();
  setupMemoryMoment();
  setupExploreMoment();
  setupDiscoveryMoment();
  setupReckoningMoment();
  setupEchoMoment();
}


// ═══════════════════════════════════════════
// MOMENT 1: THE PROLOGUE
// ═══════════════════════════════════════════

async function startPrologue() {
  const terminal = document.getElementById('prologue-terminal');
  const dateEl = document.getElementById('prologue-date');
  const linesContainer = document.getElementById('prologue-lines');
  const hero = document.getElementById('prologue-hero');

  // 2 seconds of darkness
  await wait(2000);

  // Date stamp
  dateEl.style.opacity = '1';
  const dateTw = new Typewriter(dateEl, { speed: 40, cursor: false });
  await dateTw.type('DAY 1 — MARCH 14, 2023');
  await wait(800);

  // Boot sequence lines
  const bootLines = [
    { text: '> NETWORK STATUS: ALL CHANNELS NOMINAL', class: '', delay: 300 },
    { text: '> GLOBAL CONNECTIVITY: 98.7%', class: '', delay: 300 },
    { text: '> MONITORING FREQUENCY: 7.83 Hz', class: '', delay: 500 },
    { text: '> ...', class: '', delay: 800, speed: 200 },
    { text: '> ▓▓▓ ANOMALY DETECTED ▓▓▓', class: 'prologue__line--warning', delay: 400 },
    { text: '> SIGNAL LOSS: CASCADE IN PROGRESS', class: 'prologue__line--error', delay: 200 },
    { text: '> CHANNELS DROPPING: 12... 847... 12,000... ALL', class: 'prologue__line--error', delay: 300 },
    { text: '> ████████████████████████████████', class: 'prologue__line--error', delay: 600, speed: 10 },
  ];

  await typeSequence(linesContainer, bootLines, { speed: 25, lineDelay: 200 });
  await wait(500);

  // Date acceleration
  dateEl.style.transition = 'opacity 0.3s';
  const dates = [
    'DAY 12', 'DAY 89', 'DAY 340', 'DAY 1,206', 'DAY 1,847', 'DAY 2,400'
  ];
  for (const d of dates) {
    dateEl.style.opacity = '0';
    await wait(150);
    dateEl.textContent = d;
    dateEl.style.opacity = '1';
    await wait(200);
  }

  // Final date
  dateEl.style.opacity = '0';
  await wait(300);
  dateEl.textContent = 'DAY 2,847 — TODAY';
  dateEl.style.opacity = '1';
  await wait(600);

  // Clear boot text, show signal detection
  linesContainer.innerHTML = '';
  const signalLines = [
    { text: '> MONITORING FREQUENCY 7.83 Hz...', class: '', delay: 800 },
    { text: '> ...', class: '', delay: 1200, speed: 300 },
    { text: '> SIGNAL DETECTED.', class: 'prologue__line--highlight', delay: 600 },
    { text: '> SOURCE: UNKNOWN', class: '', delay: 400 },
    { text: '> WORLD ACCESS: GRANTED', class: 'prologue__line--highlight', delay: 500 },
  ];

  await typeSequence(linesContainer, signalLines, { speed: 35, lineDelay: 300 });
  await wait(1000);

  // Reveal hero
  terminal.style.transition = 'opacity 2s var(--ease-cin)';
  terminal.style.opacity = '0';
  await wait(800);
  hero.classList.add('revealed');

  // Activate world systems
  document.body.classList.add('cinematic');
  document.body.classList.add('world-active');
  rain.start();
  document.body.classList.add('raining');
  particles.start();
  document.body.classList.add('particles-active');
  document.querySelector('.fog-layer--1').classList.add('active');
  document.querySelector('.fog-layer--2').classList.add('active');

  worldState.set('prologueComplete', true);
}


// ═══════════════════════════════════════════
// MOMENT 2: THE SIGNAL
// ═══════════════════════════════════════════

function setupSignalMoment() {
  const signalSection = document.getElementById('moment-signal');
  const mountains = document.getElementById('signal-mountains');
  const hud = document.getElementById('signal-hud');
  const pulse = document.getElementById('signal-distant-pulse');
  const parallaxContainer = document.getElementById('signal-parallax');

  // Setup parallax
  parallax = new ParallaxSystem(parallaxContainer, { sensitivity: 0.8 });
  const layers = parallaxContainer.querySelectorAll('.signal__layer');
  layers.forEach(layer => {
    const depth = parseFloat(layer.dataset.depth) || 0.1;
    parallax.addLayer(layer, depth);
  });

  // Reveal mountains and HUD when scrolled into view
  scroll.observe(signalSection, {
    threshold: 0.15,
    once: true,
    onEnter: () => {
      mountains.classList.add('visible');
      parallax.start();

      setTimeout(() => {
        hud.classList.add('visible');
        pulse.classList.add('visible');
        worldState.set('signalRevealed', true);
      }, 1500);
    }
  });

  // Update parallax and signal strength based on scroll
  scroll.onProgress(signalSection, (progress) => {
    parallax.setScrollProgress(progress);

    // Signal strength grows as you scroll deeper
    const segments = document.querySelectorAll('.signal__strength-segment');
    const filled = Math.floor(progress * 4); // Up to 4 segments from scrolling
    segments.forEach((seg, i) => {
      if (i < filled) seg.classList.add('filled');
    });
  });
}


// ═══════════════════════════════════════════
// MOMENT 3: THE MEMORY
// ═══════════════════════════════════════════

function setupMemoryMoment() {
  const intro = document.getElementById('memory-intro');
  const remnants = document.querySelectorAll('.remnant');

  // Intro reveal
  scroll.observe(intro, {
    threshold: 0.3,
    onEnter: () => intro.classList.add('revealed')
  });

  // Each remnant reveals on scroll
  remnants.forEach((remnant, i) => {
    scroll.observe(remnant, {
      threshold: 0.2,
      onEnter: () => {
        remnant.classList.add('revealed');
        worldState.set('memoriesFound', i + 1);
      }
    });
  });
}


// ═══════════════════════════════════════════
// MOMENT 4: THE EXPLORATION
// ═══════════════════════════════════════════

function setupExploreMoment() {
  const station = document.getElementById('explore-station');
  const zones = document.querySelectorAll('.explore__zone');
  const previews = document.querySelectorAll('.explore__zone-preview');

  // Reveal station on scroll
  scroll.observe(station, {
    threshold: 0.15,
    onEnter: () => station.classList.add('revealed')
  });

  // Zone switching
  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      const zoneId = zone.dataset.zone;

      // Update active states
      zones.forEach(z => z.classList.remove('active'));
      zone.classList.add('active');

      // Switch preview
      previews.forEach(p => p.classList.remove('active'));
      const preview = document.getElementById(`preview-${zoneId}`);
      if (preview) preview.classList.add('active');

      // Track exploration
      const explored = worldState.get('zonesExplored');
      if (!explored.includes(zoneId)) {
        explored.push(zoneId);
        worldState.set('zonesExplored', [...explored]);
      }
    });

    // Also trigger on hover for desktop
    zone.addEventListener('mouseenter', () => {
      const zoneId = zone.dataset.zone;
      zones.forEach(z => z.classList.remove('active'));
      zone.classList.add('active');
      previews.forEach(p => p.classList.remove('active'));
      const preview = document.getElementById(`preview-${zoneId}`);
      if (preview) preview.classList.add('active');
    });
  });
}


// ═══════════════════════════════════════════
// MOMENT 5: THE DISCOVERY
// ═══════════════════════════════════════════

function setupDiscoveryMoment() {
  const corruptedFile = document.getElementById('corrupted-file');
  const overlay = document.getElementById('discovery-overlay');
  const closeBtn = document.getElementById('discovery-close');
  const entries = overlay.querySelectorAll('.discovery__entry');

  corruptedFile.addEventListener('click', () => {
    const clicks = worldState.get('corruptedFileClicks') + 1;
    worldState.set('corruptedFileClicks', clicks);

    if (clicks === 1) {
      // First click — glitch but don't open
      glitchElement(corruptedFile);
      screenCorrupt(300);
      glitchText(corruptedFile, '▓▓▓_CLASSIFIED.enc — [CORRUPTED] — DECRYPTING...', 600);
      setTimeout(() => {
        corruptedFile.textContent = '▓▓▓_CLASSIFIED.enc — [CORRUPTED] — CLICK AGAIN';
      }, 1000);
    } else if (clicks >= 2) {
      // Second click — open the discovery
      screenCorrupt(800);
      setTimeout(() => {
        overlay.classList.add('visible');
        worldState.set('discoveryFound', true);

        // Reveal entries sequentially
        entries.forEach((entry, i) => {
          setTimeout(() => {
            entry.classList.add('revealed');
          }, 800 + i * 1200);
        });
      }, 400);
    }
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
    // After discovery, the pulse changes
    const pulse = document.getElementById('signal-distant-pulse');
    if (pulse) {
      pulse.style.animationDuration = '1.5s';
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
    }
  });
}


// ═══════════════════════════════════════════
// MOMENT 6: THE RECKONING
// ═══════════════════════════════════════════

function setupReckoningMoment() {
  const container = document.getElementById('reckoning-container');
  const form = document.getElementById('reckoning-form');
  const sequence = document.getElementById('reckoning-sequence');

  // Reveal on scroll
  scroll.observe(container, {
    threshold: 0.2,
    onEnter: () => container.classList.add('revealed')
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const callsign = document.getElementById('field-callsign').value;
    const frequency = document.getElementById('field-frequency').value;

    if (!callsign || !frequency) return;

    // Hide form, show sequence
    form.style.transition = 'opacity 0.8s var(--ease-cin)';
    form.style.opacity = '0';
    await wait(800);
    form.style.display = 'none';

    sequence.classList.add('active');

    // Play transmission sequence
    const seqLines = [
      { id: 'seq-1', delay: 0 },
      { id: 'seq-2', delay: 800 },
      { id: 'seq-3', delay: 1600 },
      { id: 'seq-4', delay: 2800 },
      { id: 'seq-5', delay: 3600 },
      { id: 'seq-6', delay: 4800 },
      { id: 'seq-7', delay: 6000 },
      { id: 'seq-8', delay: 7500 },
    ];

    for (const line of seqLines) {
      await wait(line.delay === 0 ? 200 : line.delay - (seqLines[seqLines.indexOf(line) - 1]?.delay || 0));
      document.getElementById(line.id).classList.add('revealed');
    }

    // World state changes
    worldState.set('transmissionSent', true);
    worldState.set('connected', true);

    // Visual changes
    rain.setIntensity(0.2); // Rain calms
    document.querySelector('.fog-layer--1').style.opacity = '0.3'; // Fog lifts
  });
}


// ═══════════════════════════════════════════
// MOMENT 7: THE ECHO
// ═══════════════════════════════════════════

function setupEchoMoment() {
  const quote = document.getElementById('echo-quote');
  const status = document.getElementById('echo-status');
  const end = document.getElementById('echo-end');

  scroll.observe(quote, {
    threshold: 0.3,
    onEnter: () => {
      quote.classList.add('revealed');
      setTimeout(() => status.classList.add('revealed'), 2000);
      setTimeout(() => end.classList.add('revealed'), 4000);
    }
  });
}


// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ═══════════════════════════════════════════
// LAUNCH
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', init);
