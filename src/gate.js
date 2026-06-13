/* ============================================================
   Login gate — a soft, cute lock screen.
   The password is NOT stored in plaintext; we compare a SHA-256
   hash of "email:password". Once in, it's remembered locally.
   ============================================================ */

// sha256("iamdisha25@gmail.com:Ilovedvthemost")
const STORED_HASH = 'acc706cad8a53ecb16f12576b8d53c4edd3ee2777b0e9ea0f68635ffbf55e81a';
const AUTH_KEY = 'hbd_disha_auth_v1';

export function isAuthed() {
  try { return localStorage.getItem(AUTH_KEY) === '1'; } catch (_) { return false; }
}

export function mountGate(appEl, onSuccess) {
  const section = document.createElement('section');
  section.className = 'stage scene gate-scene';
  section.innerHTML = `
    <div class="gate-card">
      <div class="gate-lock">💝</div>
      <p class="eyebrow">a little world, just for you</p>
      <h1 class="display display-lg" style="margin:.2rem 0">Hi Disha 💕</h1>
      <p class="lede" style="font-size:1rem">This one’s private — log in to open your surprise.</p>
      <form class="gate-form" id="gateForm" novalidate>
        <label class="gate-field">
          <span>email</span>
          <input id="gateEmail" type="email" inputmode="email" placeholder="you@example.com"
                 autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required>
        </label>
        <label class="gate-field">
          <span>password</span>
          <input id="gatePass" type="password" placeholder="••••••••••"
                 autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" required>
        </label>
        <button class="btn" type="submit" id="gateBtn">Open my surprise 💖</button>
        <p class="gate-error" id="gateError" role="alert"></p>
      </form>
      <p class="gate-hint">psst… you already know it 😉</p>
    </div>
  `;
  appEl.appendChild(section);

  const form = section.querySelector('#gateForm');
  const emailEl = section.querySelector('#gateEmail');
  const passEl = section.querySelector('#gatePass');
  const card = section.querySelector('.gate-card');
  const errEl = section.querySelector('#gateError');
  const btn = section.querySelector('#gateBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.textContent = '';
    btn.disabled = true;
    const email = emailEl.value.trim().toLowerCase();
    const pass = passEl.value.trim();

    let ok = false;
    try {
      ok = (await sha256(`${email}:${pass}`)) === STORED_HASH;
    } catch (_) { ok = false; }

    if (ok) {
      try { localStorage.setItem(AUTH_KEY, '1'); } catch (_) {}
      section.classList.add('scene-out');
      setTimeout(() => { section.remove(); onSuccess(); }, 420);
    } else {
      btn.disabled = false;
      errEl.textContent = 'Hmm, that’s not quite right 💔 try again';
      card.classList.remove('shake');
      void card.offsetWidth;        // restart the animation
      card.classList.add('shake');
      passEl.select();
    }
  });

  setTimeout(() => emailEl.focus(), 100);
}

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
