# Agent Action Record: ronbronson.dev onto the block layer, conflict cleared

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session), branch `claude/happy-franklin-d63jgr`, built on #61 (`claude/front-door-blocks`) with `main` merged in
**Accountable human:** Ron Bronson
**Trace:** this session's transcript; no separate trace available.

## 1. Intent
**Instruction (actual wording):** "what is the problem with dev-site why isn't that design changed? onc you're done with this, i want you to also update that design that's been approved and create a PR so it can push that new site live as well." Standing brief from masthead, same session: "all i was asking for was 1) a redesign of the colorways and 2) a reconstruction of the font/type system", plus the rulings: plain nav items, underlined, display face; no arrows at all; colophon small and monospaced; theme button pinned.

## 2. Why .dev had not changed
#61 (DDR-012 blocks, DDR-013 contrast, live pages moved onto `faces.css` + `core.css`) has been open with a merge conflict. `main` had moved five commits past it: the Concert Scout removal, which deleted a script in the same `<head>` #61 rewrote, and this session's own `core.css` sync (#63), which touched the file #61 rewrites. Live .dev still served `site.css`.

## 3. Action
- Merged `main` into #61's work. `index.html`: kept #61's stylesheets and dropped the Concert Scout script, as `main` intended. `assets/core.css`: the shared 897-line version, identical to bonus-time `main` and the .design branch; it differed from #61's only by two additive rules.
- #61 alone moved the pages onto the new type but kept the old structure; the block treatment lived only in its `page-types/catalogue-story.html`. Applied that page type's TopBar and coral lead hero to the live home page, keeping .dev's existing project grid (the brief was colourways and type, not a new structure). Hero copy unchanged.
- Same TopBar on 13 project pages, the AT Protocol page and the 404 page. The 404 and AT Protocol pages moved off `site.css`, keeping their own inline styles. Three project files that are one-line link stubs, and `about.html` (a redirect stub nothing links to), are untouched.
- Nav: Design, Studio, Blog, the same three sites as before, without arrows, in the display face at 22px, underlined.
- Every arrow glyph removed from page text (scripts untouched).
- Colophon restored to live .dev's measured values: RX100, 13px uppercase heading, 16px lines, right-aligned. #61 had it at 46px.
- Theme dock pinned (`palette-dock--fixed`).
- New `assets/home.css` for these site-specific rules.

## 4. Judgment
- **Kept the grid, did not adopt the story layout.** The page type puts one project per colour band; that is a different structure, and nobody approved it.
- **Nav labels unchanged** (Design, Studio, Blog); only the arrows went.

## 5. Consequence
Home, a sample of project pages, AT Protocol and 404: top bar present, zero arrows, no Font Awesome, dock fixed, no local 4xx. Merging this carries #61, which can then be closed. Because this branch already merged an earlier commit of this session (#63), it carries that history; nothing in it is reverted.

## 6. Change
**Before next run:** fetch, list open PRs, open the canvas, then build.
**Signal it worked:** ronbronson.dev serves the ink TopBar and coral hero, with the grid intact.
