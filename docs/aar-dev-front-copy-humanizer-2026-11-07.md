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
