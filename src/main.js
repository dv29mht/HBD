/* ============================================================
   App controller — scene router, chapter nav, ambient embers.
   No framework, no build. Pure ES modules.
   ============================================================ */

import * as content from './content.js';
import { isAuthed, mountGate } from './gate.js';
import { mountCandles } from './modules/candles.js';
import { mountMemories } from './modules/memories.js';
import { mountLoves } from './modules/loves.js';
import { mountLetter } from './modules/letter.js';

const CHAPTERS = [
  { id: 'candles',  label: 'Make a Wish',  mount: mountCandles },
  { id: 'memories', label: 'Memories',     mount: mountMemories },
  { id: 'loves',    label: '10 Things',    mount: mountLoves },
  { id: 'foryou',   label: 'For You',      mount: mountLetter },
];

const stage = document.getElementById('app');
const nav = document.getElementById('chapter-nav');

let currentIndex = -1;
let unlocked = 0;            // highest chapter index the user has reached
let cleanup = null;          // teardown fn for the active scene

const ctx = {
  content,
  /** advance to the next chapter (unlocking it) */
  next() { go(currentIndex + 1); },
  /** jump to a chapter by id */
  goTo(id) { go(CHAPTERS.findIndex((c) => c.id === id)); },
};

function buildNav() {
  nav.innerHTML = '';
  CHAPTERS.forEach((c, i) => {
    const dot = document.createElement('button');
    dot.className = 'chapter-dot';
    dot.innerHTML = `<span class="num">${i + 1}</span><span class="label">${c.label}</span>`;
    dot.addEventListener('click', () => { if (i <= unlocked) go(i); });
    nav.appendChild(dot);
  });
}

function refreshNav() {
  // hide nav during the intro for a clean first impression
  nav.classList.toggle('show', currentIndex > 0);
  [...nav.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
    dot.classList.toggle('locked', i > unlocked);
  });
}

function go(index) {
  if (index < 0 || index >= CHAPTERS.length || index === currentIndex) return;

  const render = () => {
    if (typeof cleanup === 'function') { try { cleanup(); } catch (_) {} }
    stage.innerHTML = '';
    currentIndex = index;
    unlocked = Math.max(unlocked, index);

    const section = document.createElement('section');
    section.className = 'stage scene';
    stage.appendChild(section);

    cleanup = CHAPTERS[index].mount(section, ctx) || null;
    refreshNav();
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // animate the outgoing scene, then swap
  const outgoing = stage.querySelector('.scene');
  if (outgoing) {
    outgoing.classList.add('scene-out');
    setTimeout(render, 360);
  } else {
    render();
  }
}

/* ── ambient floating pink balloons ──────────────────────── */
const BALLOON_PINKS = ['#ff9ec8', '#ff7ab0', '#ff5fa2', '#e23d86', '#ffb3d4', '#ff85bb', '#d6296f', '#ffc2dd'];
function spawnBalloons() {
  const layer = document.getElementById('balloons');
  if (!layer) return;
  const COUNT = window.matchMedia('(max-width: 600px)').matches ? 9 : 16;
  for (let i = 0; i < COUNT; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    const size = 26 + Math.random() * 30;
    b.style.left = Math.random() * 96 + 'vw';
    b.style.setProperty('--size', size + 'px');
    b.style.setProperty('--c', BALLOON_PINKS[i % BALLOON_PINKS.length]);
    b.style.setProperty('--sway', (Math.random() * 60 - 30) + 'px');
    b.style.animationDuration = 16 + Math.random() * 16 + 's';
    b.style.animationDelay = -(Math.random() * 28) + 's';
    layer.appendChild(b);
  }
}

spawnBalloons();

function startApp() {
  buildNav();
  go(0);
}

// gate the whole experience behind the cute login (remembered after first time)
if (isAuthed()) {
  startApp();
} else {
  mountGate(stage, startApp);
}
