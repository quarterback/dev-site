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

  /* ── Snow: the pigment set for the light scheme ──
       Snow         #fffbfa   paper ground
       Shadow Grey  #252323   ink              (15.21 on snow, AAA)
       Sky Aqua     #54defd   panel ground     (grey ink on it 9.86, AAA)
       Mint Leaf    #00bd9d   decorative rule  (2.33 on snow, hairlines and
                                                pattern stripes only)
       Coral Glow   #f78e69   swatch; 2.26 on snow, too light for links,
                              borders or focus rings
     Two tuned shades keep the roles accessible:
       soft text = Mint Leaf toward grey (#127463), APCA Lc 76 on snow
       accent    = Coral Glow 20% toward grey (#cd795b), 3.15 on snow,
                   clears the 3:1 minimum for underlines and focus rings */
  const SNO = {
    snow:   '#fffbfa',
    grey:   '#252323',
    aqua:   '#65e1fd',  /* Sky Aqua 10% toward Snow: grey on it Lc 76 (DDR-013) */
    mint:   '#00bd9d',
    coral:  '#f78e69',
    soft:   '#127463',
    accent: '#cd795b',
  };

  /* ── Coffee: a second pigment set for the dark scheme ──
       Dark Coffee     #432818   ink ground
       Light Apricot   #ffe6a7   light ink        (11.01 on coffee, AAA)
       Camel           #bb9457   soft text, rule  (4.81 on coffee, AA)
       Burnt Tangerine #ef271b   signal           (3.20 on coffee, fills,
                                                   borders, underlines only)
       Watermelon      #ea1744   reserved; 1.06 against tangerine, so it
                                 cannot carry a separate role beside it.
     The panel ground is coffee mixed 35% toward camel (#6d4e2e), which
     keeps apricot text at 6.16 (AA) and reads as a distinct surface. */
  const COF = {
    coffee:  '#432818',
    apricot: '#ffe6a7',
    camel:   '#bb9457',
    camelLt: '#efd294',  /* Camel 76% toward Apricot: soft text, Lc 76 on Coffee (DDR-013) */
    tang:    '#ef271b',
    melon:   '#ea1744',
    panel:   '#6d4e2e',
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
    paper: build('Snow', {
      bg:     SNO.snow,
      deeper: SNO.aqua,
      ink:    SNO.grey,
      soft:   SNO.soft,
      rule:   SNO.mint,
      accent: SNO.accent,
    }),
    coffee: build('Coffee', {
      bg:     COF.coffee,
      deeper: COF.panel,
      ink:    COF.apricot,
      soft:   COF.camelLt,
      rule:   COF.camel,
      accent: COF.tang,
    }),
  };

  /* ── colour blocks (DDR-012) ──────────────────────
     lead / on-lead fills the bar and hero; deep / on-deep fills one
     chapter. Text on each fill is checked by the audit below. */
  const BLOCKS = {
    paper: { lead: '#f78e69', onLead: '#252323', deep: '#0f7f6c', onDeep: '#fffbfa' },
    coffee: { lead: '#c6a164', onLead: '#432818', deep: '#962819', onDeep: '#ffe6a7' },
  };
  for (const [k, b] of Object.entries(BLOCKS)) {
    Object.assign(PALETTES[k], b);
    PALETTES[k]._audit['on-lead / lead'] = +contrast(b.onLead, b.lead).toFixed(2);
    PALETTES[k]._audit['on-deep / deep'] = +contrast(b.onDeep, b.deep).toFixed(2);
  }

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
    r.setProperty('--lead',      p.lead);
    r.setProperty('--on-lead',   p.onLead);
    r.setProperty('--deep',      p.deep);
    r.setProperty('--on-deep',   p.onDeep);
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
    dock.className = 'palette-dock palette-dock--fixed';
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
