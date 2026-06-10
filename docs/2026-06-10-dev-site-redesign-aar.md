# AAR — dev-site (ronbronson.dev) redesign

- **Date:** 2026-06-10
- **Branch:** `claude/dev-site-energy-design-A4XJE` (14 commits ahead of `main`; not yet merged)
- **Scope:** This repo only — `ronbronson.dev`, the working catalog of complex systems. Sibling sites `ronbronson.design` (`quarterback/2026-site`) and `ronbronson.com` (`quarterback/bonus-time`) were discussed but not touched; they were out of this session's access.

---

## 1. The ask

The site was technically fine but **staid** — a polite, hairline-ruled three-column grid with a generative teal/amber/indigo palette. The brief, refined over the session:

- More experimental / brutalist, in the register of **1970s Bell Labs / IBM** technical computing, but run through a contemporary lens. Reference energy: cargo.site, vbuckenham.com.
- Not a portfolio — a **point of view, expressed as design artifacts**.
- Keep the existing grid structure; re-skin hard. (Chosen over a manifesto landing or a full memorandum document.)
- A specific five-colour palette, applied **WCAG-compliantly**.
- Custom fonts to be sourced later; scaffold for them now.

## 2. What shipped

In order:

1. **First pass — full memorandum register.** Document status strip, control line (`DOC. RB-2026 …`), `§`-numbered sections, `ARTIFACT NN / 11` counters, registration marks, blinking cursor, hover-invert cells.
2. **Course correction — gutted the ornament.** The literal-memo cosplay read as distracting. Stripped all of it; kept the three things that were working: the **exposed 2px grid**, the **new type**, the **new colours**. Masthead returned to just the name; footer to plain.
3. **Palette engine rebuilt** (`assets/palette.js`) around the supplied "Bombpop" five and role-mapped into two contrast-audited schemes, **Paper** (light) and **Navy** (dark), with the audit kept live (`RBPalette.audit()`).
4. **Type scaffold** (`assets/site.css`): `@font-face` slots for custom `RB Display / RB Sans / RB Mono` with strong fallbacks behind them, so supplied faces drop in with no other change.
5. **Colophon** replaced the copyright line — documents the stack and the typefaces actually in use.
6. **Rotating deck** under the masthead: a four-beat statement of the through-line, eight variants, one picked at random per load, never repeating the previous refresh (sessionStorage), with a static no-JS fallback.
7. **Switzer SemiBold** self-hosted for the deck (woff2 + woff, upright + italic); colophon updated.
8. **Cross-site link** top-right → `ronbronson.design` (content sites link to each other; the `.com` front door is the only one-way entry).
9. **Project updates:** `O27 Baseball` → `SuperInnings` (renamed, file renamed, live at superinnin.gs, full writeup rebuilt); **Play To Clinch** added (team-tennis sim, live at pctennis.xyz, full writeup). Index reordered per spec.
10. **Homepage copy:** intro paragraphs removed, contact moved up into that section, "more of my work lives at…" removed site-wide (the top link covers cross-nav).
11. **Responsive pass:** audited all pages; fixed table overflow on `glowrm`.

## 3. Decisions & rationale

- **Keep the grid, kill the cosplay.** The brutalist energy comes cheaply from heavier rules + bold type + punchy colour. The memo-document furniture (counters, control lines, status strip) added noise without adding POV. The grid itself is the structure.
- **Two themes, not a generative engine.** The old engine generated palettes from a seed hue. With a fixed brand palette, that machinery was dropped; the engine now holds two hand-mapped schemes and keeps only the contrast **audit**, which is the part worth keeping honest.
- **Colophon over copyright.** More "him," and it states the stack/fonts as fact — which also keeps us honest about what's actually rendering vs. scaffolded.
- **Deck rotation as the one moving part.** Energy without gimmickry; respects `prefers-reduced-motion` (the only animation, the masthead cursor, was later removed with the rest of the ornament).
- **Cross-link direction.** `.dev ↔ .design` link to each other; `.com` is the front door. Corrected mid-session after an initial wrong link back to the front door.

## 4. The palette, in numbers

Five pigments: Punch Red `#e63946`, Honeydew `#f1faee`, Frosted Blue `#a8dadc`, Cerulean `#457b9d`, Oxford Navy `#1d3557`.

Role assignments were chosen against measured WCAG contrast, not vibes:

| Pair | Ratio | Grade |
| --- | --- | --- |
| Body ink ↔ ground (both schemes: navy/honey, honey/navy) | 11.56 | AAA |
| Frosted-blue spec panel + navy text | 8.08 | AAA |
| Frosted Blue soft-ink on navy (dark scheme) | 8.08 | AAA |
| Cerulean on Honeydew | 4.30 | AA-large only |
| Punch Red on Honeydew | 3.90 | AA-large only |
| Punch Red **as text** on Navy | 2.97 | FAIL |
| Cerulean **as a fine rule** on Navy | 2.69 | FAIL (non-text) |

**Rules that fell out of the numbers:**
- Body text is always the AAA pair.
- Cerulean and Punch Red are confined to **fills, borders, and large display**. On the dark ground they fail as text, so red becomes solid blocks / accents, never red type on navy.
- **Essential structure** (the grid frame) is drawn in `--ink`, so it always clears the 3:1 non-text minimum; `--rule` (Cerulean) is decorative hairline only.

## 5. Typography

Four roles, three live + one scaffolded:

- **Author** (self-hosted Fontshare/ITF) — display / masthead name.
- **Switzer SemiBold** (self-hosted, supplied by RB) — the rotating deck. Upright + italic, woff2 + woff.
- **Hanken Grotesk** (Google) — running text.
- **JetBrains Mono** (Google) — labels, metadata, the colophon.
- **Scaffold:** `RB Display / RB Sans / RB Mono` `@font-face` slots sit first in the stacks; drop the `.woff2` files into `assets/fonts/` and they take over with no markup change.

## 6. Verification

- **Contrast:** computed every role pair; numbers above. `RBPalette.audit()` reproduces them in-browser.
- **Switzer load:** confirmed `document.fonts.check('600 … "Switzer"')` → true (no fallback, no 404 — both woff2 and woff present).
- **Responsive:** all 13 pages (index + 12 project pages) checked for horizontal overflow at **320 / 375 / 768 px**. Only `glowrm` overflowed (5-column tables blowing out the content grid). Fixed by capping the body grid track (`minmax(0, 1fr)`) and letting tables scroll in place (`display:block; width:max-content; max-width:100%; overflow-x:auto`). Re-checked: all pages clear.
- Rendering spot-checked via headless screenshots at desktop and mobile for the masthead, deck rotation, both palettes, the colophon, and the rebuilt project pages.

## 7. Tradeoffs / deliberately not done

- **Stayed close to the original IA.** "Restyled index," not a re-architecture. The site is still fundamentally a grid; if "not boring" still doesn't land, the next lever is the grid itself (asymmetry, varied cell sizes) — untouched on purpose.
- **No projects-as-data refactor.** The index and detail pages remain hand-authored HTML. The single-source `projects.json` + renderer (and the no-visual list layout) was specced but not built here — it belongs in the cross-repo phase.
- **Intro voice left blank.** The "I've been building…" copy was removed; a real POV intro (drafts A/B/D) was deferred by request.

## 8. Open gaps / next steps

- [ ] **Merge this branch to `main`** so the design system is the canonical copy the sibling sites pull from.
- [ ] **`ronbronson.com` front door** (`bonus-time`): thin page, own warm palette, short intro + two doors (Work → .design, Catalog → .dev). Fixes the current outage. Build in a session scoped to that repo.
- [ ] **Port to `ronbronson.design`** (`2026-site`): same design system, cool palette, minimalist (screenshot + one-sentence blurb), top-right link → `.dev`.
- [ ] **Projects-as-data schema** + renderer + the visual-less project list.
- [ ] **Lock the intro voice** (A/B/D) before anything public ships.
- [ ] **Custom fonts:** optional — drop `RB Display/Sans/Mono` `.woff2` into `assets/fonts/`, uncomment, update colophon.
- [ ] **Confirm spellings:** `SuperInnings` (one word, current) and the Play To Clinch detail copy (written from a supplied brief; review for accuracy).

## 9. File map

- `assets/palette.js` — rewritten: fixed Bombpop schemes (Paper/Navy), role tokens, live WCAG audit, square theme dock.
- `assets/site.css` — register + type scaffold + tokens; masthead, footer, colophon, cross-site link, dock.
- `assets/fonts/switzer-semibold*.woff2|woff` — added (upright + italic).
- `index.html` — masthead + rotating deck (script), contact-in-intro, the project grid (reordered), colophon footer, cross-site link.
- `projects/super-innings.html` — renamed from `o27-baseball.html`, full SuperInnings writeup.
- `projects/play-to-clinch.html` — new (Play To Clinch).
- `projects/*.html` — palette/pattern colours brought into register; footer trimmed to contact only.
