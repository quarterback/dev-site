# Agent Action Record: draggable stack map on Projects (8 November 2026)

## 1. Instruction
Ron, after asking whether he could use Dragology (declarative-dragging.github.io) and cite it: "Draggable project map but redesigned using something better like ascii or html5 or webgl animation i wanna make it a lot more interesting representation of my project stack."

## 2. What changed
- `projects.html`: the static SVG map is now the no-JS fallback inside `#stack-map`. On screens wider than 860px a small loader adds `assets/stack-map.js`, which mounts the new map, hides the SVG, and shows a caption with the Dragology citation. The colophon cites the paper in full.
- The new map: a row of technique sockets in Plex Mono, a lime marker you drag along them, and the projects drawn as a dependency tree (`ronbronson.dev/projects`). Each marker position is a Dragology state; mid-drag the library blends the whole drawing, so the tree re-sorts as you drag and dotted wires run from the chosen technique to each project that uses it. Projects that don't use it dim. Drops land with an elastic bounce. Click a technique to jump; arrow keys work when the map has focus; a live region reads out the matching projects.
- Behind it, an HTML5 canvas draws an ASCII field (` .·:-=+*`) that drifts on a slow wave and brightens lime under the marker. Reduced motion: the field is drawn once and redrawn only after an interaction.
- `tools/stack-map/`: source, build script (esbuild), README. `assets/room.css`: `.sm` styles; phones hide the map as before.

## 3. Evidence
Playwright Chromium: at 1440 and 1024, the map mounts; dragging the marker from "all" to "Simulated worlds" re-sorts the stack and updates the live region ("Simulated worlds: Oregon HS Tennis Power Rankings, Play To Clinch, Viperball, SuperInnings."); ArrowRight moves to "Probability engines: Viperball, SuperInnings."; no page or console errors; no horizontal overflow at 1440, 1024 or 390. prosekeep on projects.html: PASS.

## 4. Judgment calls
- Kept the existing project-to-technique pairings exactly; no new claims. Projects not on the old map (VarsityApex, Coalition, Beachwave) are still left off it.
- Bundled React and Dragology into one committed file instead of loading from a CDN, so the site keeps working with no build step and no third-party script host. Cost: 337 KB minified, 112 KB gzipped, loaded only on wide screens.
- Chose ASCII on canvas over WebGL: it matches the room's mono type, costs no extra library, and stays readable.

## 5. Deviations and risks
- Dragology's docs are pre-release ("we have not yet prepared documentation"); a future version may change the API. The package version is pinned to 0.2.0.
- At 1024px the map is scaled to fit, so its smallest text is about 11px.
- No trace beyond this session's transcript.

## 6. Next time
If Ron wants the map on phones, it needs its own vertical layout rather than scaling.

## Addendum: Occupant Indices ticker
**Instruction.** Ron: "More than one project, like maybe pull data from my indices as a stock ticker style deal and then maybe something else. Cap Buffet not that interesting."
**Change.** `assets/ticker.js` and a `.tk` band under the Projects intro. At load it fetches `compute-cpi.json`, `aeai/latest.json` and `ldi/latest.json` from the public `quarterback/improved-succotash` repo (raw.githubusercontent.com, CORS open) and builds a tape: $CPI, the four tier prices, $START/$AGENT/$THRU, $COG-P, $AIU, $LDI. Each group carries its publish date. The tape scrolls, pauses on hover or focus, and can be dragged to scrub; a click opens the Occupant project page. Reduced motion: hand-scrolled, no auto-scroll. If the fetch fails the band stays hidden.
**Data note.** The repo's latest files are dated 16 May ($CPI), 2 Jun ($AIU) and 13 Apr ($LDI) 2026, although its workflows are scheduled daily. Ron declined access to the private Occupant-App repo, so I couldn't check whether newer data lives there. The ticker shows the dates rather than implying the values are current, and it will pick up new numbers whenever the public files update.
**Evidence.** Chromium at 1440 and 390: ticker renders, no errors, no horizontal overflow.

## Addendum: live $CPI with refreshed tiers
**Instruction.** Ron: Occupant was sold and its data site is archival; the ticker is a conversation piece. "You can update the math." Then, choosing between keeping the 2025 tier lists and refreshing them: "Refresh… adding it to the modern benchmarks would make it more relevant… number two."
**Verification of the port.** Ported the basket, persona and tier math from `src/calculate_cpi.py` and `src/model_registry.py`. Run on the archive's 16 May 2026 OpenRouter snapshot, it reproduced every published value ($CPI 62.4, $START 66.1, $AGENT 95.4, $THRU 29.1, $BULK 0.60, $FRONT 11.33, $JUDGE 10.37, $LCTX 1.39).
**Finding that drove the decision.** About half the 2025 tier models are gone from OpenRouter (the whole reasoning tier; Opus 4, 3.5/3.7 Sonnet, Gemini 2.0 Flash). Under the archive's rules the index mostly tracked which models survived.
**Change.** `assets/ticker.js` now fetches OpenRouter's public model list (CORS open, no key) on each visit and computes $CPI, $BULK, $FRONT, $JUDGE, $LCTX, $START, $AGENT, $THRU and $COG-P with the original basket and February 2025 baseline. Tier lists refreshed to current models (five per tier, mixed providers, following the archive's tier criteria): listed in the script. Values shown as "since Feb 2025". If a listed model disappears, it drops out of the average (the archive's rule); if OpenRouter is unreachable, the group falls back to the published file with its date. $AIU and $LDI stay as published, dated.
**Judgment calls (mine, per Ron's go-ahead).** Which current models count as budget, general, frontier, reasoning and long-context. Reasoning now means the "pro" reasoning variants, since nearly every current model reasons. Comparing today's models to the February 2025 baseline's models is a chained comparison of the same work, which suits a demo; it isn't the archive's methodology.
**Evidence.** Today: $CPI 55.7 (−44.3% since Feb 2025), $BULK $0.44, $FRONT $10.08, $JUDGE $3.67, $LCTX $1.69, $START 64.2, $AGENT 37.4, $THRU 38.8, $COG-P $9.64; browser and Python agree. With OpenRouter blocked, the ticker falls back to the 16 May published values. No page errors.
