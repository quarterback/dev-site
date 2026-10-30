# Agent Action Record: Coalition and PBBG Content Schema project pages

**Review date:** 2026-10-30
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session), branch `claude/vigilant-noether-rmcm7h`
**Task or period under review:** Adding the Coalition game and the PBBG Content Schema package to ronbronson.dev as project pages and catalogue cards
**Accountable human (name or role):** Ron Bronson (owner)

## 1. Intent — what was supposed to happen

**Instruction given (actual wording):**

> I want to build a project page for dev-site for this game and the narrative arch repo tool with screenshots

With the condition that the page must not describe the real-world case the game started from. The game is to be presented as a fiction built on a concept that generalizes the idea, and the page may cover the design, the stack, and anything else worth noting.

**Success defined in advance as:** not defined. The reading taken: two pages in the structure of `projects/nolla.html` and `projects/viperball.html`, two catalogue cards, screenshots from the running game, copy that passes prosekeep and plain-language-default, and no sentence that names or implies a real escape.

**Authority granted to the agent:** edit, commit and push to the designated branch. No pull request was requested, so none was opened.

**Out of scope:** the game itself and the schema package, which have their own repos and records.

## 2. Action — what actually happened

**What the agent did:**

1. Took the screenshots from the built game in headless Chromium at 1440 and 390 wide, with no tutorial coach on screen: the play screen, the route board, the hand, the phone panel, the government side's reports and debrief, and the phone tabs. Saved as WebP in `assets/coalition/`. Rendered a terminal figure for the schema page from the package's real CLI output on a clean bundle and a deliberately broken one, saved in `assets/pbbg-content-schema/`.
2. Wrote `projects/coalition.html` in first person: the idea, how a run works, the other side, phone first, the tutorial, how it's built, what changed after the first build. The idea section says the game generalizes a coordination problem and that nothing in it describes a real person or a real escape. No real country, person, or event is named anywhere on the page.
3. Wrote `projects/pbbg-content-schema.html`: the problem, what it separates, the checker, how it's built, what it doesn't do. Every claim comes from the package's README and architecture doc, including its own stated limits.
4. Added two cards at the top of the catalogue in `index.html`.
5. Checked: `prosekeep@0.3.0 check` on both pages, zero findings. `plain-language-default@0.1.0 check` on the extracted visible copy found eight long sentences on the Coalition page and six on the schema page; all were split. Rendered both pages at 1280 and 390 wide and the catalogue at 1280: every image loads and no page scrolls sideways.

**Where actual behavior differed from the instruction:** none.

**Stayed within granted authority?** Yes.

## 3. Judgment — human in the loop

**Decisions the agent made on its own:**

- Framed the origin as a service-design observation about dependence on other people, in the owner's own words from the game's concept report, and stopped there.
- Called it a directed agent build in the stack block and the contribution row, because that is what happened: the owner set the design, the fiction, and the copy rules; agents wrote most of the code.
- Named the government character Sofīā Leōnī on the page, since the owner named her in the game that day.
- Put the schema package in the catalogue as its own card rather than only a link from the game, because it is a published package with its own repo and license.
- Gave the Coalition card no `Status` or `Audience` row, like the cards around it.

**Of those, which should a human have made or seen:** the two contribution rows, and the sentence that the game is not about a real person. Both are the owner's to confirm.

**Where a human actually intervened:** the owner set the framing condition before the work began.

## 4. Deviation — the gaps

**Gaps between intent and action, and why:** none found.

**Confidently wrong:** nothing identified.

## 5. Consequence — what it cost or risked

**Actual outcome:** two project pages, two catalogue cards, sixteen images, and a record.

**Harm / cost / risk:** the schema page describes version 0.5.0 and says no game has migrated to it yet, which is true today and will go stale the day Coalition does. The Coalition page describes the game at the design-pass commit; the game is still moving.

## 6. Change — what happens next

- Ron reads both pages for voice and confirms the contribution rows.
- When Coalition moves its content onto the schema, update the schema page's last section.
- The standard.site sync picks up both pages on the push to `main`.
