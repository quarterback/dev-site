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
