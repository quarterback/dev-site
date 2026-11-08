# Agent Action Record: .dev front page copy, humanizer pass (7 November 2026)

## 1. Instruction
Ron, after the bio rewrite: "Run the same suite against the page copy and open a new pr." The suite is the one run on the bio: the humanizer skill's AI-writing patterns, plain-language-default 0.1.0 (plainlanguage.gov rules), `unslop --deterministic --dry-run`, and prosekeep 0.3.0.

## 2. What changed (index.html only)
- Meta, Open Graph and Twitter descriptions: now the bio's first sentence in third person, replacing an -ing rider ("drawing on a practice in…").
- PBBG Content Schema card: subjectless opener fixed; the long "gives each layer… and the checker lets…" sentence split.
- closedtab card: dropped the "decisions, deviations, and consequences" triad and the "preserving context" -ing rider.
- Prosekeep card: dropped the "-ing" rider; the content-design claim now says what it means.
- plain-language-default card: "clear, direct, accessible" triad cut.
- Worked example: MIT/EPL semicolon sentence split; "established particular structural properties" made plain; the closing summary paragraph's three triads cut to one plain list of what each record holds.
- No headings, links, dates, names or facts changed.

## 3. Evidence
plain-language-default: 8 flags before (some were heading joins in the extract), 0 after. unslop: 0 AI-isms before and after; its straight-quote and title-case warnings ignored (house style uses curly quotes; the title-case hit is a blog post title). prosekeep: PASS. Chromium at 1440 and 390: no page errors.

## 4. Judgment calls
unslop still reports four "flat" paragraphs (three or more sentences of similar length). It's a heuristic; the paragraphs vary from 4 to 20 words a sentence, and forcing more variation would mean padding. Left as is. Lists of real items (tool types, package contents, server tools) were kept.

## 5. Deviations and risks
Branched from `claude/friendly-allen-7u5gyo` (PR #107, unmerged), so this PR targets that branch to show only these edits. If #107 merges first, retarget to main. No trace beyond this session's transcript.

## 6. Next time
Run the suite on whole pages, not one block at a time; triads come back when single paragraphs are fixed in isolation.

## Addendum: Red Pen Editor
**Instruction.** Ron: "I made a new npm package https://github.com/quarterback/red-pen-editor".
**Change.** Added a Red Pen Editor card at the top of Systems (Ron: "It's new so it should be listed first"). The install line is `npx -y github:quarterback/red-pen-editor` because the npm registry returns 404 for `red-pen-editor` (the README says it hasn't been published); I ran that command and it works. Switch the line to `npm i red-pen-editor` once it's on npm.
**Dogfood.** Ran the package on the page copy: `inspect` found no repeated sentences or paragraphs. Using the skill's method, cut one sentence that only announced the next two ("The records also keep the limits of that result."); `applyEdits` accepted it with no protected literal lost. The package's tests pass (`npm test`).
**Checks.** plain-language-default 0 problems, unslop 0 AI-isms on the new card; prosekeep PASS; Chromium 1440/390 no errors.

**Follow-up.** Ron: npm publish is coming, so show the npm install. The card now reads `npm i red-pen-editor`; it will 404 until the package is published.

**Follow-up, 8 November.** Ron sent the npm page. Card title now links to npmjs.com/package/red-pen-editor (PR #110). npm `latest` is `0.0.0-stage`, a placeholder (README and package.json only) awaiting staged release; `npm i` installs the stub until 0.2.0 is released. Flagged to Ron.
