# Agent Action Record: Coalition example on the PBBG Content Schema page (8 November 2026)

## 1. Instruction
Ron, on showing his tools through his own game: "your idea of showing the coalition game content is an accurate way to use the tooling" and "it replaces credidax which i do not think is a good model to sow on a front page." He then relayed another agent's spec: put the demo on the PBBG Content Schema page in place of the static terminal image, use the real schema and validator code, and label it as a Coalition-based example bundle, since Coalition hasn't moved to the schema. Features: select an element to see its source record, change dialogue without changing mechanics, change a declared cost and see the text update, break a reference and see the real diagnostic, and switch between the candidate and investigator views. Also: "use plainlanguage.gov and prosekeep and humanizer over any text yo uwrote".

## 2. What changed
- `projects/pbbg-content-schema.html`: the `check.webp` figure is replaced by `#pbbg-demo`. The old image stays inside `<noscript>`. A note under the demo says it is an example bundle written from Coalition's first level, that the game still keeps its text in its own files, and that the screen and the problems come from the schema's `renderText` and `validateBundle` running in the browser.
- `tools/pbbg-demo/`: the source.
  - `coalition-example.json` is a valid schema 0.5.0 bundle. Its text is taken from Coalition's first level (quarterback/escape-game `content/coalition/ui.json` and level text): the residence in Portô Venla, three ways out (decoy convoy, service door, party car), Gianlūka's line, and an investigator desk.
  - `vendor/` holds pbbg-content-schema's `src/index.js` at commit `0f999d6`, its two schemas and its base policy, with the EPL-2.0 license. The only change: JSON imports replace the `fs` reads, so it runs in a browser.
  - `src/demo.js` and `build.mjs` (esbuild).
- `assets/pbbg-demo.js` (built; 167 KB, 50 KB gzipped, mostly Ajv) and `assets/pbbg-demo.css`.
- What the demo does:
  - Candidate and investigator views from the same bundle.
  - "Separate the layers" splits the screen into story, interface, game rules, and writing rules planes in CSS 3D. WebGL draws dashed lines from bound text to the rule it reads from.
  - Click or press Enter on any text to see its content record and the record it reads from.
  - A slider changes the decoy action's declared hours; the "3 hr" chip re-renders.
  - A text field edits Gianlūka's line; the page confirms the actions JSON didn't change.
  - Five break buttons patch a copy and re-run `validateBundle`.

## 3. Evidence
- Node, against the vendored code: the example bundle returns no diagnostics.
- Playwright Chromium at 1440×1000 and on iPhone 14 emulation: no page or console errors and no horizontal overflow.
  - Chip reads "3 hr", then "5 hr" after the slider.
  - Blocked text reads "You need Two more cars like yours first."
  - The investigator brief reads "…comes from Pedra Branca."
  - The breaks return the real diagnostics: BINDING (two findings), TEXT-01, VISIBILITY, REFERENCE, and TEXT-03.
  - Reset returns no problems.
- prosekeep 0.3.0 on the new copy: PASS. I did the humanizer and AP passes myself: serial comma, and removed a "not this page" contrast tail.

## 4. Judgment calls
- Coalition's own `tools/pbbg-bundle.js` binds arguments as facts. I bound the hours to action costs instead, because the point of the demo is that changing a rule changes the sentence. This is why the note calls it an example bundle and not the game's export.
- I picked the actions' `dc` values and the investigator's report text to fit the scene. They are not from the game's tuning.
- Vendored the validator instead of loading it from npm at runtime, so the page needs no build step or third-party host.
- I kept the page's existing sections as they are, including "What it doesn't do", which already says no game has moved onto the schema.

## 5. Deviations and risks
- The vendored validator is pinned to `0f999d6`. If the schema changes, re-copy `src/index.js` and the schemas into `vendor/` and rebuild.
- On phones the 3D tilt and the WebGL lines are off. The layers still separate, stacked flat.
- No trace beyond this session's transcript.

## 6. Next time
If Coalition moves its content onto the schema, swap the example bundle for the game's real export and change the note.

## Addendum: colophon
**Instruction.** Ron: "Every page has a colophon wtf"
**What went wrong.** I searched this page for "colophon", found nothing, and wrote that it had none instead of following the rule in EDITORIAL.md ("Every page's colophon is a real colophon"). That was wrong.
**Change.** I added the standard footer colophon in the same format as about.html: Type (PP Neue Montreal, Hanken Grotesk, IBM Plex Mono), Built with (HTML, CSS, JavaScript, WebGL, pbbg-content-schema, Ajv), Example (text from Coalition's first level), Hosting, and then the rotating digression with the shared script.
**Open.** None of the 22 pages in `projects/` had a colophon on main. Only this one has one now.

## Addendum: Coalition has adopted the checker
**Instruction.** Ron: "The existing .dev project page also needs its outdated claim that Coalition has not adopted the package corrected."
**Evidence (quarterback/escape-game at 59ae318, 8 November 2026).**
- `tools/build.py` runs `tools/pbbg-bundle.js`, writes `content/pbbg/coalition.bundle.json`, and runs `tools/pbbg-check.js` with the owner's checker. If the check fails, the build stops (commit fba5411).
- `.github/workflows/content.yml` clones pbbg-content-schema and fails if the committed bundle doesn't match the sources.
- The bundle is schema 0.5.0 with 2 roles, 19 entities, 69 facts, 1,995 content entries, and 0 actions, scenes, or events. Conditions in `src/sim.js` use the schema's fact shape.
- `node tools/pbbg-check.js` gives "Content checks passed."
- The schema README (2511b22) already says: "Every build of Coalition checks the game's copy with this CLI."
**Change.** In `projects/pbbg-content-schema.html`:
- The glance Result adds that every build of Coalition checks the game's copy with it.
- "What it doesn't do" no longer says no game has moved onto it. It now says Coalition writes its text in its own files, every build turns them into a bundle and checks it, a failure stops the build, the rules aren't in the bundle yet, and no second game uses it.
- The demo note links the game's real bundle and says why the example ties costs to text by hand.
- "At that point its inline content hadn't moved" is left as it is, because it describes October.
**Checked.** pbbg-content-schema's `src/`, `schemas/`, and `policies/` are unchanged between 0f999d6 (vendored here) and 2511b22. prosekeep on the new copy: PASS.
**Not changed.** `projects/coalition.html` links the schema but doesn't say whether the game uses it.
