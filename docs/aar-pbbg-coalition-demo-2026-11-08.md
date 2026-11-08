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
- There's no colophon on this page, so I didn't add one. If Ron wants one, it should list WebGL, Ajv, and pbbg-content-schema.
- On phones the 3D tilt and the WebGL lines are off. The layers still separate, stacked flat.
- No trace beyond this session's transcript.

## 6. Next time
If Coalition moves its content onto the schema, swap the example bundle for the game's real export and change the note.
