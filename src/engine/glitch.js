/**
 * Glitch Engine
 * Corruption effects for the discovery moment and transitions.
 * Not playful — unsettling.
 */

export function glitchElement(element, duration = 300) {
  element.classList.add('glitch-active');
  setTimeout(() => element.classList.remove('glitch-active'), duration);
}

export function glitchText(element, finalText, duration = 800) {
  const chars = '▓▒░█▄▀■□▪▫◊◆◇○●¤¥£€$#@!?&%*^~±×÷';
  const original = finalText;
  let iterations = 0;
  const maxIterations = Math.floor(duration / 30);

  const interval = setInterval(() => {
    element.textContent = original
      .split('')
      .map((char, i) => {
        if (i < iterations) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    iterations += 1;
    if (iterations >= original.length) {
      element.textContent = original;
      clearInterval(interval);
    }
  }, 30);
}

export function screenCorrupt(duration = 500) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 99999;
    pointer-events: none;
    mix-blend-mode: difference;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      rgba(255, 0, 0, 0.03) 1px,
      transparent 2px,
      rgba(0, 255, 255, 0.02) 3px,
      transparent 4px
    );
    animation: glitch-text 0.15s steps(2) infinite;
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), duration);
}
