/* ============================================================
   MODULE 3 — 10 Things I Love About You
   Ten flip cards: tap to reveal each "thing", one per screen.
   Navigate with arrows / swipe / ← → keys.  Never scrolls.
   ============================================================ */

import { shower } from '../confetti.js';

export function mountLoves(root, ctx) {
  const loves = ctx.content.loves;
  const total = loves.length;
  const revealed = new Set();
  let i = 0;

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
  };
  window.addEventListener('keydown', onKey);

  root.classList.add('loves-scene');
  root.innerHTML = `
    <p class="eyebrow">chapter three</p>
    <h2 class="loves-title display">10 Things I Love<br>About You</h2>

    <div class="loves-stage">
      <button class="mem-arrow mem-prev" id="lovePrev" aria-label="Previous">‹</button>
      <div class="love-card-wrap" id="loveWrap"></div>
      <button class="mem-arrow mem-next" id="loveNext" aria-label="Next">›</button>
    </div>

    <div class="mem-foot">
      <div class="mem-counter"><span id="loveNum">1</span><span class="mem-sep">/</span>${total}</div>
      <div class="mem-progress"><i id="loveProg"></i></div>
      <p class="mem-hint" id="loveHint">tap the card to reveal 💗</p>
    </div>
  `;

  const wrap = root.querySelector('#loveWrap');
  root.querySelector('#lovePrev').addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
  root.querySelector('#loveNext').addEventListener('click', (e) => { e.stopPropagation(); go(1); });

  // swipe
  let x0 = null;
  wrap.addEventListener('touchstart', (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });

  function render(dir) {
    const isOpen = revealed.has(i);
    wrap.innerHTML = `
      <div class="love-card ${dir < 0 ? 'in-left' : 'in-right'}">
        <div class="love-flip ${isOpen ? 'revealed' : ''}" id="loveFlip">
          <div class="love-face love-front">
            <span class="love-hash">no.</span>
            <span class="love-num-big">${i + 1}</span>
            <span class="love-prompt">tap to reveal 💗</span>
          </div>
          <div class="love-face love-back">
            <span class="love-back-num">${i + 1}</span>
            <p class="love-text">${esc(loves[i])}</p>
          </div>
        </div>
      </div>
    `;
    wrap.querySelector('#loveFlip').addEventListener('click', flip);

    root.querySelector('#loveNum').textContent = i + 1;
    root.querySelector('#loveProg').style.width = ((i + 1) / total) * 100 + '%';
    root.querySelector('#lovePrev').disabled = i === 0;
    const next = root.querySelector('#loveNext');
    next.classList.toggle('is-final', i === total - 1);
    next.innerHTML = i === total - 1 ? '♥' : '›';

    const hint = root.querySelector('#loveHint');
    if (hint && (i > 0 || isOpen)) hint.style.opacity = '0';
  }

  function flip() {
    const flipEl = wrap.querySelector('#loveFlip');
    if (!flipEl) return;
    if (!revealed.has(i)) {
      revealed.add(i);
      flipEl.classList.add('revealed');
      shower(10);
      const hint = root.querySelector('#loveHint');
      if (hint) hint.style.opacity = '0';
      if (revealed.size === total) {
        // gentle nudge once everything is revealed
        root.querySelector('#loveNext').classList.add('pulse');
      }
    } else {
      flipEl.classList.toggle('revealed'); // let them flip it back if they want
      if (!flipEl.classList.contains('revealed')) revealed.delete(i);
      else revealed.add(i);
    }
  }

  function go(dir) {
    const target = i + dir;
    if (target < 0) return;
    if (target >= total) { ctx.next(); return; }   // last "thing" → For You (the letter)
    i = target;
    render(dir);
  }

  render(1);
  return () => window.removeEventListener('keydown', onKey);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
