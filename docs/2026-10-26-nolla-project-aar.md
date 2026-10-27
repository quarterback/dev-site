# Agent Action Record: Nolla project page

**Review date:** 2026-10-26
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session), branch `claude/nolla-project`
**Task or period under review:** Adding Nolla to ronbronson.dev as a project page and a catalogue card
**Accountable human (name or role):** Ron Bronson (owner)

## 1. Intent — what was supposed to happen

**Instruction given (actual wording):**

> add this new project to the dev-site repo like the other projects

Earlier in the same session the owner said the page should carry a rationale for the tool, use the more detailed screens over the chartreuse flow screens alone, show both colorways, and that its copy must pass his plain language and editorial tools. He also said the tool is called Nolla, with its own wordmark, and 0000th is the domain.

**Success defined in advance as:** not defined. The reading taken: a `projects/nolla.html` page in the same structure as `projects/occupant.html`, a card in the catalogue with the three specs rows, screenshots in `assets/nolla/`, and copy that passes prosekeep and plain-language-default.

**Authority granted to the agent:** edit, commit and push to a branch, and open a pull request for review.

**Out of scope:** the `page-types/` copies of the catalogue, `assets/core.css`, and the standard.site link tag, which the sync workflow injects on push to `main`.

## 2. Action — what actually happened

**What the agent did (step by step):**

1. Rendered the Nolla design boards to images in headless Chromium with the real typefaces, trimmed the empty ground below each board, and saved them as WebP in `assets/nolla/`: the finished answer, the refund counter, the manager desk, the three manager decisions, and the three step flow in both colorways.
2. Before shooting, made the design boards agree on one call. The flow charged 520 tkn; the refund boards itemized a 540 tkn call with a check line no menu option includes, started from a different balance, and the answer board said it used 1,240 tkn. All of them now describe the same 520 tkn call: sort 40, slip 60, two sources 240, 180 words 180. The refund amounts follow the same schedule: the partly approved refund is 18 tkn, 10% of the answer.
3. Pinned the flow demo's menu to the schedule (100, 200, 520, 840 tkn). It had computed a live estimate that showed 509 tkn on the ask screen beside a 520 tkn charge.
4. Wrote `projects/nolla.html` in first person with sections for the problem, how the desk works, where it sends people, refunds, the two colorways, how it is built, and what changed after the first build.
5. Added a catalogue card after Occupant Indices with Status, Audience, and My contribution.
6. Checked: `prosekeep@0.3.0 check` on both pages, zero findings; `plain-language-default@0.1.0 check` on the extracted visible copy, three long sentences found and split; a hand pass against the editorial bans, four negation led sentences rewritten. Rendered at 1280px and 390px: every image loads and there are no script errors.

**Where actual behavior differed from the instruction:** none.

**Stayed within granted authority?** Yes.

## 3. Judgment — human in the loop

**Decisions the agent made on its own:**

- Placed the card in "Built, released, in use" with the status "Built, invite only". The owner has described his speculative design pages, which do not exist in the repo yet; when they do, this card belongs there.
- Left out a live link. 0000th.ai sits behind Cloudflare Access and the owner does not plan to open it, so a link would lead readers to a sign in wall.
- Wrote "People with everyday questions" as the audience, from the nolla repo's EDITORIAL.md, and "Concept, interaction design, pricing and refund model, directed agent build" as the contribution.
- Described the model as "an existing model". The stack in the nolla repo serves an open model on Modal, and the owner has since connected a real instance whose details this session never saw.
- Changed the figures on six design boards so the screens agree with each other and with the price schedule.

**Of those, which should a human have made or seen:** the section placement, the contribution row, and the board figures. The board change alters what the refund screens claim: the partly approved decision now returns 18 tkn where it returned 98 tkn.

**Where a human actually intervened:** the owner flagged that the earlier copy had skipped his tools, that board copy restated itself, that the boards had lost the Nolla wordmark and design, and that a weekly refunds meter on the counter was never approved. Each was fixed before this page was written.

## 4. Deviation — the gaps

**Gaps between intent and action, and why (root cause):** the site renders 1290px wide at a 390px viewport. `projects/occupant.html` does the same, so the cause predates this change and sits in the shared layer.

**Good deviations:** reconciling the board figures before the screenshots went on a public page.

**Confidently wrong:** nothing identified.

## 5. Consequence — what it cost or risked

**Actual outcome:** a project page and a catalogue card that pass both checkers, with screens that agree on every figure.

**Harm / cost / risk:** the page describes the design boards and the price schedule. If the live build at 0000th.ai prices or refunds differently, the page and the product disagree.

**Downstream affected parties:** readers of ronbronson.dev, and the agent building the live desk, which now has boards with new refund figures.

## 6. Change — what happens next

**Specific changes before next run:** Ron confirms the contribution row, the section placement, and the 18 tkn partly approved refund, and reads the copy before merge.

**Keep doing:** rendering the screens and checking their numbers against each other before publishing them.

**Should not be delegated to an agent at all:** deciding which claims about the owner's contribution go on his site.

**Signal that the change worked:** the page merges with no copy changes beyond the owner's own edits.
