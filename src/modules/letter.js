/* ============================================================
   MODULE 4 — For You
   The finale: your hand-written letter, with a celebration.
   The text auto-shrinks to always fit one screen (no scrolling).
   ============================================================ */

import { celebrate, fireworks } from '../confetti.js';

export function mountLetter(root, ctx) {
  const name = ctx.content.config.name;
  const paras = String(ctx.content.letter || '')
    .trim().split(/\n\s*\n/)
    .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

  root.classList.add('letter-scene');
  root.innerHTML = `
    <div class="letter-paper">
      <div class="letter-seal">💌</div>
      <h2 class="letter-h display">A letter for you, ${esc(name)}</h2>
      <div class="letter-body">${paras}</div>
    </div>
    <div class="btn-row">
      <button class="btn btn-ghost" id="replay">↺ from the start</button>
    </div>
  `;

  // shrink the body font until the whole letter fits the viewport
  const fit = () => {
    const paper = root.querySelector('.letter-paper');
    const body = root.querySelector('.letter-body');
    if (!paper || !body) return;
    let size = 1.16;
    body.style.fontSize = size + 'rem';
    const budget = window.innerHeight * 0.72;
    let guard = 0;
    while (paper.getBoundingClientRect().height > budget && size > 0.7 && guard < 80) {
      size -= 0.025;
      body.style.fontSize = size + 'rem';
      guard++;
    }
  };
  requestAnimationFrame(fit);
  window.addEventListener('resize', fit);

  celebrate();
  const stop = fireworks(4500);
  root.querySelector('#replay').addEventListener('click', () => { if (stop) stop(); ctx.goTo('candles'); });

  return () => { if (stop) stop(); window.removeEventListener('resize', fit); };
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
