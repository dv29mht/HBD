/* Thin wrapper around canvas-confetti (loaded from CDN in index.html).
   Falls back to a no-op if the library failed to load.               */

// every shade of pink, as requested
const PINKS = ['#ff9ec8', '#ff7ab0', '#ff5fa2', '#e23d86', '#ffc2dd', '#ff85bb', '#d6296f', '#ffd6e8'];

function fire(opts = {}) {
  if (typeof window.confetti !== 'function') return;
  window.confetti({ colors: PINKS, disableForReducedMotion: true, ...opts });
}

/** Celebratory burst from both lower corners + a center pop. */
export function celebrate() {
  if (typeof window.confetti !== 'function') return;
  const end = Date.now() + 900;
  fire({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  (function frame() {
    fire({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    fire({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** Gentle rose-petal style drift (used on softer moments). */
export function shower(particleCount = 40) {
  fire({ particleCount, spread: 100, startVelocity: 28, gravity: 0.7, scalar: 1.1, origin: { y: 0 }, angle: 270 });
}

/** Sustained fireworks for the finale. Returns a stop() function. */
export function fireworks(durationMs = 6000) {
  if (typeof window.confetti !== 'function') return () => {};
  const end = Date.now() + durationMs;
  let raf;
  (function frame() {
    const x = Math.random();
    fire({ particleCount: 30, spread: 360, startVelocity: 28, ticks: 90, gravity: 0.9, scalar: 1.1,
           origin: { x, y: Math.random() * 0.5 } });
    if (Date.now() < end) raf = requestAnimationFrame(frame);
  })();
  return () => cancelAnimationFrame(raf);
}

export { fire };
