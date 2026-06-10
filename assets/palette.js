/* ──────────────────────────────────────────────────────────
   Palette engine — "Bombpop", WCAG-mapped.

   Five fixed pigments (a supplied, considered set) wired into the
   site's role tokens. No hand-waving: every role assignment below
   was chosen against measured contrast, and the audit still runs —
   open the console and call RBPalette.audit() to read the ratios
   the schemes actually land on.

     Punch Red    #e63946   signal — fills, borders, large display
     Honeydew     #f1faee   paper ground / light ink
     Frosted Blue #a8dadc   surface — spec panels, media grounds
     Cerulean     #457b9d   mid surface / decorative rule
     Oxford Navy  #1d3557   ink ground / dark ink

   Role rules (enforced by the values, verified by audit):
     · body ink ↔ ground is AAA (11.56) in both schemes.
     · Cerulean / Punch Red clear AA-large only on Honeydew, and FAIL
       as text on Navy — so they are used for fills, borders, and
       large display, never as small body text on the dark ground.
     · Essential structure (the grid frame) is drawn in --ink (the
       AAA pair), so it always clears the 3:1 non-text minimum;
       --rule is decorative hairline only.
   ────────────────────────────────────────────────────────── */
(function () {
  /* ── contrast math (audit only) ───────────────────── */
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
  function contrast(a, b) {
    const la = luminance(hexToRgb(a)), lb = luminance(hexToRgb(b));
    const hi = Math.max(la, lb), lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
  }
  const grade = (n) => (n >= 7 ? 'AAA' : n >= 4.5 ? 'AA' : n >= 3 ? 'AA-large' : 'FAIL');

  /* ── the five pigments ────────────────────────────── */
  const PIG = {
    red:   '#e63946',
    honey: '#f1faee',
    frost: '#a8dadc',
    ceru:  '#457b9d',
    navy:  '#1d3557',
  };

  /* ── role-mapped schemes ──────────────────────────── */
  function build(label, m) {
    return {
      label,
      bg:     m.bg,
      deeper: m.deeper, /* media + spec-panel ground */
      ink:    m.ink,
      soft:   m.soft,   /* large/secondary only */
      rule:   m.rule,   /* decorative hairline */
      accent: m.accent,
      _audit: {
        'body ink / bg':  +contrast(m.ink, m.bg).toFixed(2),
        'soft / bg':      +contrast(m.soft, m.bg).toFixed(2),
        'accent / bg':    +contrast(m.accent, m.bg).toFixed(2),
        'ink on deeper':  +contrast(m.ink, m.deeper).toFixed(2),
      },
    };
  }

  const PALETTES = {
    paper: build('Paper', {
      bg:     PIG.honey,
      deeper: PIG.frost,
      ink:    PIG.navy,
      // Cerulean lands at 4.30 on Honeydew — just under AA for body text.
      // No pigment fills the "soft text on light" slot accessibly, so this
      // is Cerulean nudged 6% toward Navy: same hue, now AA (4.54).
      soft:   '#437799',
      rule:   PIG.ceru,
      accent: PIG.red,
    }),
    navy: build('Navy', {
      bg:     PIG.navy,
      deeper: PIG.ceru,
      ink:    PIG.honey,
      soft:   PIG.frost,
      rule:   PIG.ceru,
      accent: PIG.red,
    }),
  };

  const DEFAULT = 'paper';

  /* ── application ──────────────────────────────────── */
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

    const tag = document.createElement('span');
    tag.className = 'palette-dock__tag';
    tag.textContent = 'THEME';
    dock.appendChild(tag);

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
    pigments: PIG,
    current: () => document.documentElement.dataset.palette || DEFAULT,
    audit() {
      const rows = {};
      for (const [k, p] of Object.entries(PALETTES)) rows[k] = p._audit;
      if (console.table) console.table(rows);
      return rows;
    },
  };
})();
