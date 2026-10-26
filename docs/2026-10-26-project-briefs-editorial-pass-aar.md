# Agent Action Record: editorial pass over the project briefs

**Review date:** 2026-10-26
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session), branch `claude/upbeat-pascal-9x359m`
**Task or period under review:** Running the editorial suite over the whole of ronbronson.dev and fixing the project briefs
**Accountable human (name or role):** Ron Bronson (owner)

## 1. Intent — what was supposed to happen

**Instruction given (actual wording):**

> run my editorial suite against the whole dev-site because the project briefs are all slopified

**Success defined in advance as:** not defined. The reading taken: run every tool in the suite over the whole repo, then rewrite the briefs so they read like the owner wrote them, without changing what they claim.

**Authority granted to the agent:** edit, commit and push to the designated branch. No pull request was requested, so none was opened.

**Out of scope:** `projects/toccer.html`, which is the owner's own essay republished and is the voice sample the rest of the site is measured against. Also the three redirect stubs in `projects/` (`finnish-baseball-game-design`, `parliament-of-neighbors`, `varsityapex`), which carry no copy.

## 2. Action — what actually happened

**What was run, and what it found:**

| Tool | Scope | Result |
| --- | --- | --- |
| `prosekeep check --profile vloora` | whole repo, 39 files | 0 mechanical findings, before and after |
| `prosekeep audit --profile vloora` | projects, index, about | exact duplicates only, all shared chrome (topbar, footer) |
| `plain-language-default check` | rendered copy of every project page, extracted from headless Chromium with headings terminated | 1 to 3 findings per page, all long sentences or the extraction's own paragraph artifact; none that a reader would hit as a defect |
| humanizer skill | read by hand against every brief | findings below |
| `prosekeep compare` | pre-edit against post-edit rendered copy, every project page | no numeric or citation drift on any page |

**What the humanizer pass found:** the mechanical checks pass because the slop is structural. The repeated tells across the briefs were:

- Aphorisms used as paragraph closers: "The cost is the signal", "The edge cases are the whole job", "The signal is the product", "Accountability without lock-in", "The constraint is the feature", "The separation is the design".
- "Not X but Y" contrasts: "economic, not cosmetic", "cousins, not twins", "a product spec, not flavor", "generated, not hand-authored", "isn't treated as too noisy, it's treated as unusually rich".
- Staged openers: "Because here's the thing:", "Think of Glowrm as Stripe for reputation", "The boring choices are deliberate".
- Stock lines pasted across pages: "Under the hood it's a Python engine. The UI reveals a vast world." and "a window into an engine that exists independent of it" each appeared on both SuperInnings and Play To Clinch.
- Inflation: "by orders of magnitude", "fully documented decision trail", "the full statistical apparatus", "a strange kind of full circle".
- One "load-bearing structure" on Cap Buffet, which the owner has asked never to see.

**What the agent changed:** prose in twelve briefs (Beachwave, Cap Buffet, Glowrm, Leafroll, Mallo, Occupant, Oregon tennis, PDX Spend, Play To Clinch, SuperInnings, Viperball, You Go First). Every edit was an exact sentence replacement checked to match once, so markup, links, code, numbers and stack lists are untouched. The two meta descriptions that repeated a rewritten lede were updated to match, and Viperball's was switched to third person per the house convention.

**Where actual behavior differed from the instruction:** none. The owner asked for the suite to run over the whole site; it did. The fixes were confined to the briefs, which is what he said was wrong.

**Stayed within granted authority?** Yes.

## 3. Judgment — human in the loop

**Decisions the agent made on its own:**

- Kept em dashes where they joined two clauses the owner's own writing would join that way, and removed them where they stood in for a sentence break. The owner's dash rate is the sample, so the pages still use them.
- Kept the owner's own claims untouched even where they are strong: "the first analytics platform of its kind in the state", "Earth's first-ever team tennis computer game", "Teams across Oregon used it". Those are his to make.
- Cut sentences rather than rephrasing them when the sentence only restated the paragraph before it.
- Did not touch Toccer, the About page, or the front-page cards. The cards were already written plainly.

**Of those, which should a human have made or seen:** two number conflicts between the front-page cards and the briefs were left as found, because only the owner can settle them:

- Viperball: the card says "roughly 110,000 lines across about 60 decision records", the brief says "roughly 120,000 lines" and "30+ design specifications and after-action reports".
- SuperInnings: the card says "more than 140 engineering decision records", the brief says "roughly 85 after-action reports".

**Where a human actually intervened:** nowhere during the run.

## 4. Deviation — the gaps

**Gaps between intent and action, and why:** the suite's mechanical layer cannot see this kind of slop. All 39 files passed `prosekeep check` before a word was changed. The findings came from reading, which is slow and not repeatable by CI.

**Good deviations:** none needed.

**Confidently wrong:** nothing identified.

## 5. Consequence — what it cost or risked

**Actual outcome:** twelve briefs read shorter and plainer, every page still passes the mechanical checks, and `prosekeep compare` reports no number or citation moved.

**Harm / cost / risk:** voice. These rewrites were made by an agent against the owner's sample, which is the same process that produced the slop in the first place. The result is less generic, not guaranteed to be his.

**Downstream affected parties:** readers of the briefs, who were the point.

## 6. Change — what happens next

**Specific changes before next run:**

- Ron reads the diff on the four heaviest rewrites (You Go First, Viperball, Oregon tennis, Glowrm) and puts back anything that was his.
- Settle the two number conflicts above and make the card and the brief agree.
- Consider adding the humanizer's phrase list (the closers and contrasts above) to `.editorial.json` as a project rule, so the next agent trips on "the X is the Y" before it ships.

**Keep doing:** extracting rendered copy before running `plain-language-default`; running `prosekeep compare` after any prose edit to prove the numbers held.

**Should not be delegated to an agent at all:** deciding which of the owner's own strong claims stay.

**Signal that the change worked:** someone who knows Ron's writing reads a brief and does not stop on a sentence.
