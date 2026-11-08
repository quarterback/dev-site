# Agent Action Record: game-first Coalition content demo

**Date:** November 8, 2026
**Request:** Redo the PBBG Content Schema demonstration so a visitor starts with Coalition as a game and then sees how its content is structured. Open a new PR for review.

## Decisions

- Preserve the working schema validator, `renderText`, role switching, action-cost slider, dialogue editor, source-record inspection, and five broken-content examples from PR #116.
- Start with the existing Coalition game screenshot, accurately labeled as a screenshot. The inspector is a small example bundle, not a playable Coalition session.
- Open the content inspector on demand. The screenshot's **Inspect the residence scene** control opens it and selects `residence.arrive`.
- Explain the distinction between an editable narrative line, an action cost, and a blocking content error in plain language.
- Display whether the actual validator blocked the example. Coalition's build stops when its exported content fails this same checker.
- Keep the source of `assets/pbbg-demo.js` unchanged. The new presentation is an independent, plain JavaScript file loaded after that bundle; this avoids shipping a stale compiled bundle or changing the underlying validation.

## Files

- `assets/pbbg-game-first.js`: wraps existing, initialized controls in a collapsible inspector; adds the Coalition screenshot, explanation, and check-result status.
- `assets/pbbg-demo.css`: styles the game-first presentation at desktop and phone widths, including the validation verdict.
- `projects/pbbg-content-schema.html`: loads the presentation script; updates the no-JavaScript fallback and clarifies what the real Coalition content export checks.

## Boundaries and evidence

The Coalition photo comes from `assets/coalition/play.webp`, already used by the site's Coalition project. It is labeled as a screenshot rather than an interactive game.

The inspector still uses the existing `tools/pbbg-demo/coalition-example.json` and browser-bundled `validateBundle` / `renderText`. The example manually binds costs to actions. In the actual Coalition repository, `tools/pbbg-bundle.js` exports text and facts to `content/pbbg/coalition.bundle.json`, and `tools/build.py` runs the checker. The game's real action logic remains in its engine.

The new validation verdict reads the existing validator's diagnostic output and blocked-render state. It does not invent pass/fail results.

## Checks

- Verified the screenshot path exists in the repository.
- Parsed the new script with a JavaScript syntax check.
- Checked that the page loads the original bundle before the new presentation script, and that the old bundle/source are unchanged.
- Browser rendering and click-through behavior still require preview review. Do not infer those results from a syntax check.

## Editorial audit, November 8, 2026

**Scope:** The prose newly added to the Coalition game-first entry, its inspector instructions, its source-record explanations, its validator result messages, and the note below the demo. Previous copy elsewhere on the project page remains outside this editorial revision.

- **Red Pen Editor 0.2.1:** Used the published repository's `src/index.mjs` `inspect` and `applyEdits` functions. Proposed 14 exact-span changes: 13 in the game-first script, one in the project-page note. All 14 passed the safety guard; none were rejected. The check preserves the protected names, tool functions and source link.
- **plain-language-default 0.1.0:** Ran `reviewPlainLanguage` from `quarterback/plain-as-day/src/core.mjs` against the extracted visitor-facing copy. Zero selected heuristic findings in 248 words.
- **Prosekeep 0.3.0:** Ran its `lintSource` from `quarterback/prosekeep/src/check.mjs`, with the site's `.editorial.json` Vloora profile, against the extracted copy and the edited project HTML. Zero mechanical findings. Its `checkSourceFidelity` detected no URL, number or citation changes in the HTML.
- **Federal Plain Language Guidelines:** Reviewed the visitor's first question, actor/verb clarity, sentence length, use of technical terms, and whether the page identifies the real game, the example bundle and the production checks separately.
- **Limitation:** The npm registry could not be reached from the editing environment. The deterministic tool functions above were executed from their corresponding published GitHub source repositories, not from downloaded npm tarballs. The PR's GitHub editorial workflow separately runs the npm-distributed Prosekeep checker on changed HTML and Markdown.
- **Unverified:** A successful lint result cannot prove semantic accuracy, editorial voice, or browser usability. A visual and interactive browser test remains for review.

**Editorial decision:** Removed repeated explanations of what PBBG does from the introductory and inspector text. Preserved the distinctions between the live Coalition game, a hand-linked demo bundle, and the content export enforced in Coalition CI. Replaced the ambiguous "production build" wording with the specific CI responsibility.

## Correction: the homepage is the target

**User feedback:** The new Coalition demonstration on the PBBG project page did not replace the prominently featured Play To Clinch career model on the homepage. Ron supplied an iPhone screenshot and explicitly requested Coalition in that position.

**Change:** Replaced the entire home `Under the hood` Play To Clinch model in `index.html` with the live Coalition/PBBG demonstration. Removed its chart containers, formula, explanatory passage, and old home-only model script and stylesheet. Added the same real PBBG validator bundle, game-first presentation script and CSS used by the project page. Kept the section heading and added a short link to the complete technical account. Updated the homepage colophon to name WebGL, Ajv and PBBG Content Schema.

The change was based on the current `main` index so subsequent work on that file remains intact. On the homepage and the project page, the Coalition link resolves to `/projects/coalition.html`.

**Verified:** The PR diff shows the old `uth-careers`, `crChart`, `crNo1` and old explanatory paragraph removed, with `pbbg-demo` and the correct deferred script order in their place. The PBBG demo engine remains unchanged. Browser interaction still needs a rendered preview check.

