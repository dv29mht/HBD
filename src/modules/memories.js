/* ============================================================
   MODULE 2 — 25 Perfect Memories
   A one-card-at-a-time photo deck (swipe / arrows / keyboard).
   After the last memory it moves on to the next chapter.
   Never scrolls.
   ============================================================ */

export function mountMemories(root, ctx) {
  const mem = ctx.content.memories;
  const total = mem.length;
  const tilts = [-1.6, 1.4, -1, 1.8, -1.3];
  let i = 0;

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  };
  window.addEventListener('keydown', onKey);

  root.classList.add('memories-scene');
  root.innerHTML = `
    <p class="eyebrow">chapter two</p>
    <h2 class="mem-title display">25 Perfect Memories</h2>

    <div class="mem-stage">
      <button class="mem-arrow mem-prev" id="memPrev" aria-label="Previous memory">‹</button>
      <div class="mem-card-wrap" id="cardWrap"></div>
      <button class="mem-arrow mem-next" id="memNext" aria-label="Next memory">›</button>
    </div>

    <div class="mem-foot">
      <div class="mem-counter"><span id="memNum">1</span><span class="mem-sep">/</span>${total}</div>
      <div class="mem-progress"><i id="memProg"></i></div>
      <p class="mem-hint" id="memHint">swipe, tap the arrows, or use ← → keys</p>
    </div>
  `;

  const cardWrap = root.querySelector('#cardWrap');
  root.querySelector('#memPrev').addEventListener('click', () => go(-1));
  root.querySelector('#memNext').addEventListener('click', () => go(1));
  cardWrap.addEventListener('click', () => go(1));

  let x0 = null;
  cardWrap.addEventListener('touchstart', (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
  cardWrap.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });

  function render(dir) {
    const m = mem[i];
    cardWrap.innerHTML = `
      <figure class="mem-card ${dir < 0 ? 'in-left' : 'in-right'}" style="--tilt:${tilts[i % tilts.length]}deg">
        <div class="mem-photo" data-n="${i + 1}">
          <img alt="${esc(m.title)}" src="photos/photo${i + 1}.jpg">
        </div>
        <figcaption class="mem-cap">
          <span class="mem-cap-title">${esc(m.title)}</span>
          <span class="mem-cap-text">${esc(m.caption)}</span>
        </figcaption>
      </figure>
    `;
    const card = cardWrap.firstElementChild;
    const img = card.querySelector('img');
    img.addEventListener('error', () => { card.querySelector('.mem-photo').classList.add('missing'); img.remove(); });

    root.querySelector('#memNum').textContent = i + 1;
    root.querySelector('#memProg').style.width = ((i + 1) / total) * 100 + '%';
    root.querySelector('#memPrev').disabled = i === 0;
    const next = root.querySelector('#memNext');
    next.classList.toggle('is-final', i === total - 1);
    next.innerHTML = i === total - 1 ? '♥' : '›';

    const hint = root.querySelector('#memHint');
    if (hint && i > 0) hint.style.opacity = '0';
  }

  function go(dir) {
    const target = i + dir;
    if (target < 0) return;
    if (target >= total) { ctx.next(); return; }   // last memory → next chapter
    i = target;
    render(dir);
  }

  render(1);
  return () => window.removeEventListener('keydown', onKey);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
