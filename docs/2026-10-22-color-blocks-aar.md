# Agent Action Record: Front door colour blocks on every site (DDR-012)

**Review date:** 2026-10-22
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session)
**Task or period under review:** Port the Front door's colour structure and components to all three sites, each in its own colourway
**Accountable human (name or role):** Ron Bronson
**Trace:** this session's own transcript; no separate trace was available to reconcile against.

## 1. Intent — what was supposed to happen
**Instruction given (actual wording):** "i want to implement a full dsign system not just the editorial styles onto the sites using front door style ported to the other sites using different colorways but using the various design elements in this storyboard to design various style elements that i can utilize for a repetable structure acros sites as needed"
**Choices Ron made when asked:** rebuild the Chromatic Editorial System (no new system); the masthead takes the Front door palette; change the system and open PRs on the repos.
**Success defined in advance as:** one shared set of Front door components that takes each site's colours with no per-site CSS.
**Authority granted to the agent:** edit the design system; push a branch and open a PR per repo. Nothing to main.
**Out of scope:** site copy; moving the live home pages onto the shared layer.

## 2. Action — what actually happened
**What the agent did:** added a colour block layer to `assets/core.css` (identical in 2026-site, dev-site, bonus-time): five fills (`bg`, `deeper`, `lead`, `deep`, `ink`) that bleed full width and re-point the colour roles inside them; TopBar, Button, Socials and PhotoRow styles. Added `--lead`, `--on-lead`, `--deep`, `--on-deep` to each palette engine and to each `faces.css` fallback. Gave the masthead engine the Front door palette (light) and kept Navy as its dark scheme. Recoloured the story page types with blocks. Published DDR-012 and the new component cards to the design system. Rendered every page in both schemes and at phone width.
**Where actual behavior differed from the instruction:** live pages are unchanged; the blocks ship on the page types, which is where the shared layer is used today.
**Stayed within granted authority?** Yes

## 3. Judgment — human in the loop
**Decisions the agent made on its own:** the role names `lead` and `deep`; which pigment fills each block on .design and .dev; tuning Burnt Tangerine 22% toward Coffee to pass as the Coffee deep fill; turning the .design story page's footer links into icon squares (links and labels unchanged); keeping Ron's inline 40px intro size from the board.
**Of those, which should a human have made or seen:** the .design and .dev pigment choices for `lead` and `deep`.
**Points where it should have escalated and didn't:** none known.
**Accountable for these actions:** Ron Bronson

## 4. Deviation — the gaps
**Gaps between intent and action, and why:** a first pass bled a rule past the page edge and widened the page; fixed with `overflow-x: clip` on pages that use blocks. A featured experiment row put light text on Sky Aqua inside the ink strip; fixed so soft-filled items in dark blocks keep page ink.
**Confidently wrong:** none known.

## 5. Consequence — what it cost or risked
**Actual outcome:** every block pair passes 4.5:1 in all six schemes (`RBPalette.audit()`).
**Risk:** Platinum's link colour on its own ground is still 2.45:1 (DDR-005, pending Ron's call); blocks do not use it.
**Expected failure if this run happened 100 times:** someone edits one repo's `core.css` and the three drift.

## 6. Change — what happens next
**Specific changes before next run:** move the live home pages onto `faces.css` + `core.css` with blocks; add the CI check that `core.css` matches across repos.
**Keep doing:** read the live design system and the latest main before building.
**Should not be delegated to an agent at all:** the site copy and the pigment choices once Ron sees them.

---

## Follow-up: readability (DDR-013)

**Instruction given (actual wording):** "blue on black text is surely unreadable did you WCAG any of this stuff before shipping? i shared colorways that were a lot better than any of these" · then "Just use the ones you have for right now I just wanna get this up and running I'll I'll add more later"
**Root cause:** the agent checked fill and text pairs against WCAG 2 only (4.5:1). WCAG 2 overrates dark text on mid tones: black on Steel Blue passed at 5.09 and scores APCA Lc 38. The agent also never measured the rendered pages, only the token pairs.
**What changed:** APCA floors by size on every text pair; mid-tone fills carry large type only; the top bar moved to ink; soft fills, soft text, digressions and links retuned in all six schemes. PRs were moved to draft while this was fixed.
**Check:** a headless audit measures every text node and icon on every page type in both schemes of each site; all pass.
**Change for next run:** run the rendered-page audit (WCAG 2 and APCA) before opening a PR, every time.
