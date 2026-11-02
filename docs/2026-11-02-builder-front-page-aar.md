# Agent Action Record: the offer goes back to its page, the tooling shelf returns

**Review date:** 2 November 2026
**Agent / system:** Claude Code (cloud session), on `claude/magical-faraday-uqz6vn`, brought up to date with main after PR #88 merged (merge, no history rewrite)
**Accountable human:** Ron Bronson (owner)

## 1. Intent

From the 1 November handoff: ronbronson.dev keeps the wargaming and scenario offer on its own page (`work-with-me.html`), and the home page goes back to being the builder site. The home page order is hero, Things I made, the tooling shelf, an offer teaser, participatory and speculative design, teaching and talks, then the footer.

## 2. Action

- `index.html`:
  - Removed the "Put your plans into play" band (with its four steps and workshop photo) and the closing "Practice the future before it arrives." ask. Both duplicated `work-with-me.html`.
  - Restored the On npm block exactly as it was before PR #88 (closedtab, prosekeep, plain-language-default), below Things I made.
  - Added one line under the npm block for the after action review skill. The link and description are the existing ones from the commented-out Other projects block.
  - Added an offer teaser after the tooling shelf. It's a single "Work with me" link to `work-with-me.html`, with a STAND-IN comment because the heading and sentence are Ron's to write.
  - STAND-IN comments flag the `<title>` and descriptions, which still describe the studio; the strings are unchanged. Another flags the hero's second paragraph, which is the offer's pitch, as Ron's decision.
- `assets/slabs.css`: removed the `.play`, `.steps`, `.play__*` and `.ask` rules. Besides being unused, `.play` collided with the video play button (`.vid .play`) and gave it the band's padding; that's fixed. Added small rules for `.npm__also` and `.teaser`.
- Unchanged: Things I made, the participatory timeline, teaching and talks, the project pages, `more.html`, `about.html`, `talks.html`, `work-with-me.html`, and the Colophon, with digressions footer.

## 3. Judgment

- **The four steps were not moved to `work-with-me.html`.** That page already covers the same method in prose, and the handoff makes moving them conditional. They're in PR #88's history if Ron wants them.
- **`assets/workshop-easels.jpg` is now unused but kept,** in case it goes on `work-with-me.html`.
- **The On npm block came back as it was,** including its outlined box, because the handoff asked for it unchanged. The box is close to the card treatment Ron dislikes, and he may want it flattened.
- No new copy was written.

## 4. Consequence

Rendered at 1440px and 390px in headless Chromium: no horizontal scroll and no script errors. Talks checked at 1440px.

## Follow-up: the shelf holds all five tools

> it's missing the pbbg skill that i also made recently and i have no idea why that aar skill is hanging off as a 4th thing in a poorly designed way

- The after action review skill was a loose line under the shelf. It's now an entry like the others: *Agent After-Action Review*, labelled Claude Skill, with links to GitHub (`quarterback/AAR`) and the write-up. The description is the existing one.
- Added the PBBG skill. It ships inside `pbbg-content-schema` 0.6.0 with an MCP server, installed with `npx -y github:quarterback/pbbg-content-schema install-skill`. The description is the package README's opening sentence; links go to the project page and GitHub.
- The shelf note opened "Three tools I publish and use daily." That stopped being true, so the opening sentence came out, the rest stays, and a STAND-IN comment asks Ron to reword it. The heading "On npm" is unchanged, though two entries aren't on npm.
- Removed the `.npm__also` style, which is no longer used.
