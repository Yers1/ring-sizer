'use strict';
/* ═══════════════════════════════════════════════════════════
   Ring Sizer · script.js
═══════════════════════════════════════════════════════════ */

/* ── Constants ──────────────────────────────────────────── */
const CARD_HEIGHT_MM  = 54.0;         // credit card height in mm (ISO 7810)
const DEFAULT_PX_MM   = 96 / 25.4;   // ~3.779 — standard CSS px/mm at 96 dpi
const BAND_MM         = 3.0;          // visual ring band width in mm
const MIN_MM          = 14.0;
const MAX_MM          = 23.0;
const LS_KEY          = 'ringSizer_v1_pxPerMm';

/* ── US Ring Size Lookup (inner diameter mm → US label) ── */
const US_TABLE = [
  [14.05,'2'],   [14.45,'2½'], [14.86,'3'],   [15.27,'3½'],
  [15.67,'4'],   [16.08,'4½'], [16.51,'5'],   [16.92,'5½'],
  [17.35,'6'],   [17.75,'6½'], [18.19,'7'],   [18.61,'7½'],
  [19.02,'8'],   [19.43,'8½'], [19.84,'9'],   [20.27,'9½'],
  [20.68,'10'],  [21.08,'10½'],[21.49,'11'],  [21.89,'11½'],
  [22.33,'12'],  [22.73,'12½'],[23.0, '13'],
];

/* ── State ──────────────────────────────────────────────── */
let pxPerMm       = DEFAULT_PX_MM;
let currentDiamMm = 17.0;
let calibH        = 0;
let isDragging    = false;
let dragStartY    = 0;
let dragStartH    = 0;

/* ── DOM helpers ────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const ringElement   = $('ringElement');
const diamIndicator = $('diamIndicator');
const diamMmLabel   = $('diamMmLabel');
const stageLabel    = $('stageLabel');
const sizeRU        = $('sizeRU');
const sizeEU        = $('sizeEU');
const sizeUS        = $('sizeUS');
const ringSlider    = $('ringSlider');
const tableBody     = $('tableBody');

const calibBar      = $('calibBar');
const modalOverlay  = $('modalOverlay');
const calibRect     = $('calibRect');
const calibHandle   = $('calibHandle');
const calibFeedback = $('calibFeedback');
const saveCalibBtn  = $('saveCalibBtn');
const cancelCalibBtn= $('cancelCalibBtn');
const closeModalBtn = $('closeModalBtn');

const touchZone     = $('touchZone');
const touchPrompt   = $('touchPrompt');
const fingerResult  = $('fingerResult');
const fingerDiamLbl = $('fingerDiamLabel');
const fRU = $('fRU'), fEU = $('fEU'), fUS = $('fUS');
const noTouchNotice = $('noTouchNotice');
const checkRingBtn  = $('checkRingBtn');

/* ═══════════════════════════════════════════════════════════
   SIZE CONVERSIONS
═══════════════════════════════════════════════════════════ */
function toRU(d) { return Math.round(d); }
function toEU(d) { return Math.round(d * Math.PI); }
function toUS(d) {
  let best = US_TABLE[0], minΔ = Infinity;
  for (const row of US_TABLE) {
    const Δ = Math.abs(d - row[0]);
    if (Δ < minΔ) { minΔ = Δ; best = row; }
  }
  return best[1];
}

/* ═══════════════════════════════════════════════════════════
   RING RENDERING
═══════════════════════════════════════════════════════════ */
function renderRing(diamMm) {
  currentDiamMm = diamMm;

  const innerPx = diamMm * pxPerMm;
  const bandPx  = Math.max(5, BAND_MM * pxPerMm);

  ringElement.style.width  = innerPx + 'px';
  ringElement.style.height = innerPx + 'px';
  ringElement.style.boxShadow = [
    `0 0 0 ${bandPx.toFixed(1)}px #c9a84c`,
    `0 0 0 ${(bandPx + 1.5).toFixed(1)}px #7a6228`,
    `0 0 ${Math.round(bandPx * 4)}px rgba(201,168,76,0.22)`,
  ].join(', ');

  diamIndicator.style.width = innerPx + 'px';

  diamMmLabel.textContent = `${diamMm.toFixed(1)} mm — inner diameter`;
  stageLabel.textContent  = `⌀ ${diamMm.toFixed(1)} mm`;

  sizeRU.textContent = toRU(diamMm);
  sizeEU.textContent = toEU(diamMm);
  sizeUS.textContent = toUS(diamMm);

  const pct = ((diamMm - MIN_MM) / (MAX_MM - MIN_MM) * 100).toFixed(2);
  ringSlider.style.setProperty('--pct', pct + '%');

  highlightRow(diamMm);
}

/* ═══════════════════════════════════════════════════════════
   REFERENCE TABLE
═══════════════════════════════════════════════════════════ */
function buildTable() {
  tableBody.innerHTML = '';
  for (let d = MIN_MM; d <= MAX_MM + 0.01; d += 0.5) {
    const mm = parseFloat(d.toFixed(1));
    const tr = document.createElement('tr');
    tr.dataset.mm = mm;
    tr.innerHTML = `
      <td>${mm.toFixed(1)} mm</td>
      <td>${toRU(mm)}</td>
      <td>${toEU(mm)}</td>
      <td>${toUS(mm)}</td>
    `;
    tr.addEventListener('click', () => {
      ringSlider.value = Math.round(mm * 10);
      renderRing(mm);
      switchTab('ring');
      document.querySelector('.ring-stage')
        .scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    tableBody.appendChild(tr);
  }
}

function highlightRow(diamMm) {
  const rounded = (Math.round(diamMm * 2) / 2).toFixed(1);
  let activeRow = null;
  tableBody.querySelectorAll('tr').forEach(tr => {
    const on = tr.dataset.mm === rounded;
    tr.classList.toggle('active', on);
    if (on) activeRow = tr;
  });
  if (activeRow) {
    activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

/* ═══════════════════════════════════════════════════════════
   CALIBRATION
═══════════════════════════════════════════════════════════ */
function loadCalibration() {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    const val = parseFloat(saved);
    if (val > 0.5 && val < 40) {
      pxPerMm = val;
      setCalibBarState(true);
    }
  }
}

function setCalibBarState(isCalibrated) {
  calibBar.innerHTML = isCalibrated
    ? `<span class="calib-bar-text">✓ Screen calibrated (${pxPerMm.toFixed(2)} px/mm)</span>
       <button class="btn-link" id="openCalibBtn">Recalibrate</button>`
    : `<span class="calib-bar-text">📐 Calibrate your screen with a credit card for best accuracy</span>
       <button class="btn-link" id="openCalibBtn">Calibrate</button>`;
}

function openModal() {
  calibH = CARD_HEIGHT_MM * pxPerMm;
  calibRect.style.height = calibH + 'px';
  updateCalibFeedback(calibH);
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateCalibFeedback(hPx) {
  const mm   = (hPx / pxPerMm).toFixed(1);
  const diff = (parseFloat(mm) - CARD_HEIGHT_MM).toFixed(1);
  const sign = parseFloat(diff) > 0 ? '+' : '';
  const ok   = diff === '0.0' ? ' ✓' : ` (${sign}${diff} mm from target)`;
  calibFeedback.textContent = `Rectangle height: ${mm} mm${ok}`;
}

/* ── Drag handle ── */
calibHandle.addEventListener('pointerdown', e => {
  isDragging   = true;
  dragStartY   = e.clientY;
  dragStartH   = calibRect.offsetHeight;
  calibHandle.setPointerCapture(e.pointerId);
  e.preventDefault();
});

document.addEventListener('pointermove', e => {
  if (!isDragging) return;
  const dy = e.clientY - dragStartY;
  calibH = Math.max(60, dragStartH + dy);
  calibRect.style.height = calibH + 'px';
  updateCalibFeedback(calibH);
});

document.addEventListener('pointerup', () => { isDragging = false; });

saveCalibBtn.addEventListener('click', () => {
  pxPerMm = calibH / CARD_HEIGHT_MM;
  localStorage.setItem(LS_KEY, String(pxPerMm));
  setCalibBarState(true);
  renderRing(currentDiamMm);
  closeModal();
});

cancelCalibBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click',  closeModal);
modalOverlay.addEventListener('click',   e => { if (e.target === modalOverlay) closeModal(); });

calibBar.addEventListener('click', e => {
  if (e.target.id === 'openCalibBtn') openModal();
});

/* ═══════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════ */
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => {
    const on = t.dataset.tab === name;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', String(on));
  });
  const id = 'panel' + name[0].toUpperCase() + name.slice(1);
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.toggle('active', p.id === id);
  });
}
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => switchTab(t.dataset.tab));
});

ringSlider.addEventListener('input', () => {
  renderRing(parseInt(ringSlider.value) / 10);
});

/* ═══════════════════════════════════════════════════════════
   FINGER MODE
   
   Why it's inaccurate for ring sizing:
   1. touch.radiusX = contact area of fingertip pad, not true width
   2. Rings are worn at the BASE of the finger, which is wider
   3. Contact radius values vary across devices and OS versions
   4. Pressure and finger angle affect contact area
   
   A correction factor (~1.55) is applied and results are clamped
   to a plausible human range. Shown with a strong disclaimer.
═══════════════════════════════════════════════════════════ */
function initFingerMode() {
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (!hasTouch) {
    noTouchNotice.classList.remove('hidden');
    touchZone.classList.add('hidden');
    return;
  }

  touchZone.addEventListener('touchstart', onTouchFinger, { passive: false });
  touchZone.addEventListener('touchend',   () => {
    if (touchPrompt.textContent !== '❌ No data') {
      touchPrompt.textContent = 'Touch again';
    }
  });
}

function onTouchFinger(e) {
  e.preventDefault();
  const touch = e.touches[0];

  const rx = touch.radiusX || 0;
  const ry = touch.radiusY || 0;

  if (rx === 0 && ry === 0) {
    touchPrompt.innerHTML = '❌ No data';
    const msg = document.createElement('p');
    msg.style.cssText = 'text-align:center;font-size:.8rem;color:var(--warn-text);margin-top:.5rem';
    msg.textContent = 'Your device does not expose touch contact size. Please use "By Ring" mode instead.';
    touchZone.after(msg);
    return;
  }

  touchPrompt.textContent = '📏 Measuring…';

  /*
   * Use max(rx, ry) to pick the dominant axis.
   * Contact diameter → actual finger diameter correction:
   *   factor ~1.55 based on average fingerpad-to-finger ratio.
   */
  const contactDiamPx   = Math.max(rx, ry) * 2;
  const contactDiamMm   = contactDiamPx / pxPerMm;
  const estimatedDiamMm = contactDiamMm * 1.55;

  const clamped = Math.max(MIN_MM - 1, Math.min(MAX_MM + 2, estimatedDiamMm));
  showFingerResult(clamped);
}

function showFingerResult(diamMm) {
  fingerResult.classList.remove('hidden');
  fingerDiamLbl.textContent = `~ ${diamMm.toFixed(1)} mm (approximate)`;
  fRU.textContent = toRU(diamMm);
  fEU.textContent = toEU(diamMm);
  fUS.textContent = toUS(diamMm);
}

checkRingBtn.addEventListener('click', () => {
  const d = Math.max(MIN_MM, Math.min(MAX_MM,
    parseFloat(fingerDiamLbl.textContent) || currentDiamMm
  ));
  ringSlider.value = Math.round(d * 10);
  renderRing(d);
  switchTab('ring');
});

/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════════════════ */
const themeToggle = $('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
const THEME_KEY   = 'ringSizer_theme';

function applyTheme(theme, animate = false) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  themeToggle.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');

  // Update meta theme-color for mobile browser chrome
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#faf7f0' : '#0c0a08';

  if (animate) {
    themeToggle.classList.remove('spinning');
    void themeToggle.offsetWidth; // force reflow
    themeToggle.classList.add('spinning');
    setTimeout(() => themeToggle.classList.remove('spinning'), 400);
  }
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  // If no preference saved, check system preference
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
  localStorage.setItem(THEME_KEY, next);
});

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
loadTheme();
loadCalibration();
buildTable();
renderRing(currentDiamMm);
initFingerMode();
