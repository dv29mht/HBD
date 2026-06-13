/* ============================================================
   MODULE 1 — Blow out the candles
   Make a wish, then blow out the "25" with your mic (or a tap).
   ============================================================ */

import { celebrate, shower } from '../confetti.js';

export function mountCandles(root, ctx) {
  const name = ctx.content.config.name;
  let raf = null;
  let stream = null;
  let audioCtx = null;
  let done = false;

  root.classList.add('candles-scene');
  root.innerHTML = `
    <div id="introText">
      <p class="eyebrow">it's your day, ${escapeHtml(name)}</p>
      <h1 class="display display-lg" style="margin:.4rem 0 .2rem">Make a wish…</h1>
      <p class="lede">Close your eyes, think of something wonderful — then blow out your candles.</p>
    </div>

    <div class="cake-wrap" style="--wind:0">
      <div class="cake">
        <div class="plate"></div>
        <div class="tier tier-bottom"></div>
        <div class="frosting frosting-bottom"></div>
        <div class="tier tier-top"></div>
        <div class="frosting frosting-top"></div>
        <div class="sprinkles"></div>
        <div class="num-candles" id="candleStrip"></div>
      </div>
    </div>

    <div id="blowControls" class="btn-row" style="flex-direction:column;gap:.8rem">
      <div class="btn-row">
        <button class="btn" id="micBtn">🎤 Blow with your mic</button>
        <button class="btn btn-ghost" id="tapBtn">💨 Tap to blow</button>
      </div>
      <div class="blow-meter" id="meter" hidden><div class="fill"></div></div>
      <p class="mic-status" id="micStatus"></p>
    </div>
  `;

  decorate(root);
  const candles = buildCandles(root.querySelector('#candleStrip'));
  const cakeWrap = root.querySelector('.cake-wrap');
  const meter = root.querySelector('#meter');
  const meterFill = meter.querySelector('.fill');
  const status = root.querySelector('#micStatus');
  const micBtn = root.querySelector('#micBtn');
  const tapBtn = root.querySelector('#tapBtn');

  /* ── extinguishing ─────────────────────────────────────── */
  function litCandles() { return candles.filter((c) => !c.classList.contains('out')); }

  function extinguishOne() {
    const lit = litCandles();
    if (!lit.length) return;
    lit[0].classList.add('out');
    shower(8);
    if (litCandles().length === 0) onAllOut();
  }

  function onAllOut() {
    if (done) return;
    done = true;
    cakeWrap.classList.add('all-out');
    stopMic();
    setTimeout(reveal, 750);
  }

  /* ── TAP mode ──────────────────────────────────────────── */
  tapBtn.addEventListener('click', () => {
    stopMic();
    meter.hidden = true;
    status.textContent = '';
    // a tap puffs out a couple of candles with a little lean
    cakeWrap.style.setProperty('--wind', '0.8');
    setTimeout(() => cakeWrap.style.setProperty('--wind', '0'), 260);
    extinguishOne();
    if (litCandles().length) extinguishOne();
  });

  // tapping the cake itself also puffs out a candle (always works)
  cakeWrap.addEventListener('click', () => {
    if (done) return;
    cakeWrap.style.setProperty('--wind', '0.7');
    setTimeout(() => cakeWrap.style.setProperty('--wind', '0'), 240);
    extinguishOne();
  });

  /* ── MIC mode ──────────────────────────────────────────── */
  micBtn.addEventListener('click', startMic);

  async function startMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = 'This browser won’t allow mic access — just tap to blow 💨';
      return;
    }
    status.textContent = 'asking for your microphone…';
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (err) {
      const blocked = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
      status.textContent = blocked
        ? 'Mic is blocked — tap the 🔒 in the address bar to allow it, or just tap to blow 💨'
        : 'Couldn’t reach your mic — no worries, just tap to blow 💨';
      meter.hidden = true;
      return;
    }
    micBtn.disabled = true;
    meter.hidden = false;
    status.textContent = 'Calibrating… one sec ✨';

    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
    try { if (audioCtx.state === 'suspended') await audioCtx.resume(); } catch (_) {}
    const srcNode = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    srcNode.connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);

    const readVol = () => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) { const d = (buf[i] - 128) / 128; sum += d * d; }
      return Math.sqrt(sum / buf.length);              // RMS, ~0..1
    };

    // listen to the room for ~450ms, then set the "blow" threshold above it
    let baseline = 0, lastPuff = 0, told = false;
    const calibrateUntil = performance.now() + 450;

    const loop = () => {
      const vol = readVol();
      const now = performance.now();

      if (now < calibrateUntil) {
        baseline = Math.max(baseline, vol);
        raf = requestAnimationFrame(loop);
        return;
      }
      if (!told) { told = true; status.textContent = 'Take a deep breath… and blow! 🌬️'; }

      const thresh = Math.max(0.045, baseline * 2.2);
      const norm = (vol - baseline) / (thresh - baseline + 1e-6);
      cakeWrap.style.setProperty('--wind', Math.min(1, vol * 7).toFixed(2));
      meterFill.style.width = Math.max(0, Math.min(100, norm * 70)) + '%';

      if (vol > thresh && now - lastPuff > 230) {
        lastPuff = now;
        status.textContent = 'I can hear you — keep going! 🌬️';
        extinguishOne();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  function stopMic() {
    if (raf) cancelAnimationFrame(raf), (raf = null);
    if (stream) stream.getTracks().forEach((t) => t.stop()), (stream = null);
    if (audioCtx) audioCtx.close().catch(() => {}), (audioCtx = null);
    cakeWrap.style.setProperty('--wind', '0');
  }

  /* ── reveal (fits one screen: intro + cake step aside) ──── */
  function reveal() {
    const controls = root.querySelector('#blowControls');
    const intro = root.querySelector('#introText');
    if (controls) controls.remove();
    [intro, cakeWrap].forEach((el) => {
      if (!el) return;
      el.style.transition = 'opacity .45s var(--ease), transform .45s var(--ease)';
      el.style.opacity = '0';
    });
    if (cakeWrap) cakeWrap.style.transform = 'scale(0.82)';

    setTimeout(() => {
      if (intro) intro.remove();
      if (cakeWrap) cakeWrap.remove();
      celebrate();
      const rv = document.createElement('div');
      rv.className = 'wish-reveal scene';
      rv.innerHTML = `
        <p class="eyebrow">your wish is on its way ✨</p>
        <h1 class="display display-xl">Happy 25<sup style="font-size:.5em">th</sup> Birthday,</h1>
        <h2 class="script-name" style="font-size:clamp(3.4rem,15vw,8rem);margin-top:-.2rem">${escapeHtml(name)}</h2>
        <p class="lede" style="margin-top:.6rem">I made you a little something. Come see.</p>
        <div class="btn-row" style="margin-top:1.4rem">
          <button class="btn" id="beginBtn">Begin the celebration →</button>
        </div>
      `;
      root.appendChild(rv);
      rv.querySelector('#beginBtn').addEventListener('click', () => ctx.next());
    }, 460);
  }

  // cleanup when leaving the scene
  return () => stopMic();
}

/* ── helpers ───────────────────────────────────────────────── */
function buildCandles(strip) {
  // a slender taper, the "2", the "5", and another taper
  const spec = [
    { type: 'taper' },
    { type: 'num', char: '2' },
    { type: 'num', char: '5' },
    { type: 'taper' },
  ];
  const els = [];
  spec.forEach((s) => {
    const el = document.createElement('div');
    if (s.type === 'num') {
      el.className = 'num-candle candle';
      el.innerHTML = `${s.char}<span class="flame"></span><span class="smoke"></span>`;
    } else {
      el.className = 'candle';
      el.innerHTML = `<span class="wick"></span><span class="flame"></span><span class="smoke"></span>`;
    }
    strip.appendChild(el);
    els.push(el);
  });
  return els;
}

function decorate(root) {
  const box = root.querySelector('.sprinkles');
  if (!box) return;
  const colors = ['#e6c489', '#e89bb2', '#fff2cf', '#ffd27a'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'sprinkle';
    s.style.left = 10 + Math.random() * 80 + '%';
    s.style.top = 55 + Math.random() * 35 + '%';
    s.style.background = colors[i % colors.length];
    s.style.setProperty('--r', Math.random() * 90 + 'deg');
    box.appendChild(s);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
