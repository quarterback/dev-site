/* ──────────────────────────────────────────────────────────
   Algorithmic palette engine.

   No hand-picked hexes. Each scheme is generated from a single
   seed hue: the ground is the richest, most saturated color at
   that hue that still clears WCAG AAA (7:1) against the body
   ink; the soft ink and accent are then fitted to AA (4.5:1)
   against that ground. Grounds are deliberately chromatic —
   never white, never beige. Run RBPalette.audit() in the
   console to read every contrast ratio the engine settled on.
   ────────────────────────────────────────────────────────── */
(function () {
  /* ── color math ─────────────────────────────────── */
  const clamp01 = (n) => Math.min(1, Math.max(0, n));

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60)       [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else              [r, g, b] = [c, 0, x];
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  }

  const toHex = (rgb) =>
    '#' + rgb.map((v) => Math.round(clamp01(v / 255) * 255).toString(16).padStart(2, '0')).join('');

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }

  const lin = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  function luminance(rgb) {
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  }

  function contrast(rgbA, rgbB) {
    const a = luminance(rgbA), b = luminance(rgbB);
    const hi = Math.max(a, b), lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }

  function mix(rgbA, rgbB, t) {
    return rgbA.map((v, i) => v + (rgbB[i] - v) * t);
  }

  const INK_DARK = hexToRgb('#0E0D0B');
  const INK_LIGHT = hexToRgb('#F3EFE6');

  /* ── generation ─────────────────────────────────────
     seed = { hue, sat, accentRotate, mode }
       mode 'light' → bright chromatic ground + dark ink
       mode 'dark'  → deep chromatic ground + light ink
     ─────────────────────────────────────────────────── */
  function buildGround(hue, sat, mode) {
    const ink = mode === 'dark' ? INK_LIGHT : INK_DARK;
    // Light mode: walk L up from mid until the ground clears 7:1 with
    // dark ink — the FIRST pass is the deepest/richest qualifying ground.
    // Dark mode: walk L down for the richest dark ground vs light ink.
    const steps = [];
    for (let i = 0; i <= 60; i++) steps.push(0.40 + i * 0.009);
    const order = mode === 'dark' ? steps.slice().reverse() : steps;
    let ground = hslToRgb(hue, sat, mode === 'dark' ? 0.18 : 0.86);
    for (const L of order) {
      const cand = hslToRgb(hue, sat, mode === 'dark' ? Math.min(L, 0.34) : L);
      if (contrast(cand, ink) >= 7) { ground = cand; break; }
    }
    return { ground, ink };
  }

  function fitSoft(ink, ground) {
    // Most muted ink that still clears AA (4.5:1) for secondary text.
    let best = ink;
    for (let t = 0; t <= 0.7; t += 0.02) {
      const cand = mix(ink, ground, t);
      if (contrast(cand, ground) >= 4.5) best = cand; else break;
    }
    return best;
  }

  function fitAccent(hue, ground) {
    // Complementary hue at full chroma. Among the lightnesses that clear
    // AA (4.5:1) against the ground, take the one sitting right on the
    // boundary — the most vivid accent the ground will tolerate.
    let best = null, bestC = Infinity;
    for (let L = 0.16; L <= 0.84; L += 0.01) {
      const cand = hslToRgb(hue, 0.92, L);
      const c = contrast(cand, ground);
      if (c >= 4.5 && c < bestC) { best = cand; bestC = c; }
    }
    return best || hslToRgb(hue, 0.92, 0.5);
  }

  function generate(seed) {
    const { ground, ink } = buildGround(seed.hue, seed.sat, seed.mode);
    const soft = fitSoft(ink, ground);
    const accent = fitAccent(seed.hue + seed.accentRotate, ground);
    const rule = mix(ink, ground, 0.74);
    const deeper = mix(ground, ink, seed.mode === 'dark' ? 0.14 : 0.12);
    return {
      label: seed.label,
      bg: toHex(ground),
      deeper: toHex(deeper),
      ink: toHex(ink),
      soft: toHex(soft),
      rule: toHex(rule),
      accent: toHex(accent),
      _audit: {
        'body ink / bg': +contrast(ink, ground).toFixed(2),
        'soft ink / bg': +contrast(soft, ground).toFixed(2),
        'accent / bg': +contrast(accent, ground).toFixed(2),
        'accent / ink': +contrast(accent, ink).toFixed(2),
      },
    };
  }

  /* ── seeds: three considered chromatic grounds ────── */
  const SEEDS = {
    lab:    { label: 'Lab',    hue: 168, sat: 0.62, accentRotate: 192, mode: 'light' }, /* teal ground · warm-red accent */
    sodium: { label: 'Sodium', hue: 44,  sat: 0.92, accentRotate: 188, mode: 'light' }, /* amber ground · indigo accent */
    ultra:  { label: 'Ultra',  hue: 244, sat: 0.58, accentRotate: -56, mode: 'dark'  }, /* indigo ground · cyan accent */
  };

  const PALETTES = {};
  for (const [k, seed] of Object.entries(SEEDS)) PALETTES[k] = generate(seed);

  const DEFAULT = 'lab';

  /* ── application ─────────────────────────────────── */
  function setVars(p) {
    const r = document.documentElement.style;
    r.setProperty('--bg',        p.bg);
    r.setProperty('--bg-deeper', p.deeper);
    r.setProperty('--ink',       p.ink);
    r.setProperty('--ink-soft',  p.soft);
    r.setProperty('--rule',      p.rule);
    r.setProperty('--accent',    p.accent);
  }

  function recolorPatterns(p) {
    document.querySelectorAll('pattern#m3a > rect, pattern#ph-a > rect')
      .forEach((el) => el.setAttribute('fill', p.deeper));
    document.querySelectorAll('pattern#m3a > line, pattern#ph-a > line')
      .forEach((el) => el.setAttribute('stroke', p.rule));
  }

  function syncSwatchState(key) {
    document.querySelectorAll('.palette-swatch').forEach((el) => {
      el.setAttribute('aria-pressed', el.dataset.palette === key ? 'true' : 'false');
    });
  }

  function apply(key, persist) {
    const resolved = key in PALETTES ? key : DEFAULT;
    const p = PALETTES[resolved];
    setVars(p);
    if (document.readyState !== 'loading') recolorPatterns(p);
    document.documentElement.dataset.palette = resolved;
    syncSwatchState(resolved);
    if (persist) {
      try { localStorage.setItem('rb-palette', resolved); } catch (_) {}
    }
  }

  let saved;
  try { saved = localStorage.getItem('rb-palette'); } catch (_) {}
  apply(saved || DEFAULT, false);

  function injectUI() {
    if (document.querySelector('.palette-dock')) return;
    const dock = document.createElement('div');
    dock.className = 'palette-dock';
    dock.setAttribute('role', 'group');
    dock.setAttribute('aria-label', 'Theme');
    for (const [key, p] of Object.entries(PALETTES)) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'palette-swatch';
      btn.dataset.palette = key;
      btn.setAttribute('aria-label', p.label + ' theme');
      btn.title = p.label;
      btn.style.setProperty('--sw-bg', p.bg);
      btn.style.setProperty('--sw-accent', p.accent);
      btn.addEventListener('click', () => apply(key, true));
      dock.appendChild(btn);
    }
    document.body.appendChild(dock);
    syncSwatchState(document.documentElement.dataset.palette || DEFAULT);
  }

  function onReady() {
    recolorPatterns(PALETTES[document.documentElement.dataset.palette] || PALETTES[DEFAULT]);
    injectUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  window.RBPalette = {
    apply: (k) => apply(k, true),
    palettes: PALETTES,
    current: () => document.documentElement.dataset.palette || DEFAULT,
    audit() {
      const rows = {};
      for (const [k, p] of Object.entries(PALETTES)) rows[k] = p._audit;
      if (console.table) console.table(rows);
      return rows;
    },
  };
})();
