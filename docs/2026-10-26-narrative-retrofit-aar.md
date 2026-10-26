# Agent Action Record: narrative retrofit of ronbronson.dev

**Review date:** 2026-10-26
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session), branch `claude/dazzling-sagan-t4x1ab`
**Task or period under review:** Retrofitting the three sites onto one narrative structure
**Accountable human (name or role):** Ron Bronson (owner)

## 1. Intent — what was supposed to happen

**Instruction given (actual wording):**

> i want to use these influences to retrofit the structures of bonus-time, dev-site and 2026-site. they need to retain the different colorways of each site like I originally asked for and to use the language cleanup tools from my other repos that need to make sure that you don't revert to AI slop.
>
> the training day and other language tools i provied will help ensure this follows the messaging structures of the example sites i like while keeping it maintaining my own personality/voice and lets me build off of it after that. it'l help power a larger personal narratve architecture across my entire web presence from linkedin to websites to fuure blogs aobut work

Supplied with the instruction: four screenshot mockups (two for `.design`, one for `.dev`, one for the masthead front door) and the working editorial reference `ron_bronson_executive_narrative_site_language_2026-10-25.md`.

**Success defined in advance as:** not defined in advance. Three decisions were put to the owner before any file changed, and he answered:

1. Scope: rewrite the **live** `index.html` pages on the designated branch, not add new page-type previews.
2. `.design` shape: **merge** both mockups (service tiers with their own calls to action, plus the process section, plus evidence cards).
3. Narrative source: **per-repo and site-specific**. No synced `NARRATIVE.md`, and the three sites are allowed to say different things as long as each is true.

**Authority granted to the agent:** edit, commit and push to `claude/dazzling-sagan-t4x1ab` in each repo. No pull request was requested, so none was opened.

**Out of scope:** colour. Each site keeps its own palette engine (`palette.js`, `palette-masthead.js`) untouched, so Pumpkin Steel, Bombpop and the masthead's Coral/Fresh Sky schemes are exactly as they were. Also out of scope: `trainingday`, `vloora`, `prosekeep`, `plain-as-day`, `voluntold`, and any page other than the three homepages.

## 2. Action — what actually happened

**What the agent did (step by step):**

1. Read the existing structure of all three sites: `STANDARD-SITE.md`, the `page-types/` READMEs, `assets/core.css` (the shared layer), each site's `faces.css`, `home.css` and palette engine, and `CAREER-NARRATIVE-REGISTER.md`.
2. Established that the four mockups are external influences, not files already in the repos, and read them as structure rather than as copy.
3. Added a **narrative layer** to `assets/core.css`: `.nar-sec`, `.nar-h`, `.nar-note`, `.offers/.offer`, `.steps/.step`, `.evg/.ev`, `.specs`, `.cta`, plus `.cta-row` and the `.btn--lead` / `.btn--ghost` / `.btn--sm` weights promoted out of the masthead's `home.css`. Written only against the existing colour roles and type slots, so it inherits whatever each site's palette gives it. Appended identically to all three repos; `md5sum` confirms the three files still match byte for byte.
4. Rewrote each homepage onto that structure (see the site-specific section below).
5. Harvested every factual claim from copy already live on the sites, from `CAREER-NARRATIVE-REGISTER.md`, and from the supplied editorial reference. Nothing was invented.
6. Checked the result: HTML nesting parsed with a stack-matching parser (0 errors on all three), `prosekeep check` (0 mechanical findings), `prosekeep audit` outline and structure rules, then rendered all three pages in headless Chromium at 1280px, confirmed no horizontal overflow and no JavaScript errors, and read the screenshots.

**What it produced or changed:** `assets/core.css` (narrative layer appended), `index.html` (restructured), and this record. `dev-site` also gained a tile grid in `assets/home.css`, which the other two sites already had in theirs.

**Where actual behavior differed from the instruction:** the mockups show placeholder chips reading `Slot: …` and, on `.dev`, an `Adoption: Slot: verified usage` row. Those are mockup devices. Real placeholder text was not shipped; every slot was either filled with a supported claim or dropped.

**Stayed within granted authority?** Yes.

## 3. Judgment — human in the loop

**Decisions the agent made on its own:**

- Put the shared components in `core.css` rather than in each site's `home.css`. The page-type READMEs require `core.css` to stay byte-identical across the three repos, and the narrative structure is by definition shared, so this is where it belongs.
- Left the `Adoption` row off every `.dev` project. The editorial reference says to report metrics only when measured, and no verified usage figure exists. An empty row would be a claim the page cannot support.
- Kept the em dashes already in Ron's live copy. The humanizer skill's dash rule defers to the writer's own sample, and the sample uses them.
- Respected DDR-013 by keeping body copy off the bright `lead` fill. The `.design` hero sits on `lead` and carries only large type; the service cards and process steps sit on `bg` and `deeper`.
- Moved **Host & Events** off `.design` and onto the masthead. Editorial rule 7 in the reference assigns the person and the public record to the masthead and the service practice to `.design`; the section was duplicating the masthead's job.
- Described Vloora as working on how people keep authority over AI agents acting for them, rather than as "an AX product company building consumer AX", which `vloora/POSITIONING.md` calls a tautology. The `.dev` hero's existing Vloora line was left exactly as Ron wrote it.
- Wrote "I work with Vloora" on the masthead rather than "I founded Vloora". The live site says "a startup building infrastructure for AI"; a `page-types/` draft says he founded it. The weaker claim was chosen because the live site is the one Ron has signed off on.

**Of those, which should a human have made or seen:** the Vloora wording and the founding claim. Also every `Status` value on `.dev`, which was inferred from existing project prose and the ATProto page's own status tags rather than from Ron confirming each one.

**Where a human actually intervened:** before any edit, on the three scope decisions above.

**Points where it should have escalated and didn't:** the per-project `Status`, `Audience` and `My contribution` values on `.dev` were written from existing copy without asking. They read as fact on a page whose whole argument is that the work shipped.

**Accountable for these actions:** Ron Bronson.

## 4. Deviation — the gaps

**Gaps between intent and action, and why (root cause):** the owner chose per-repo narrative sources, so there is no single file the three sites read from. The shared structure is enforced by `core.css` and by convention; the shared *facts* are not enforced at all. Change the 18F headcount on one site and the other two keep the old number.

**Good deviations (correct departures from a flawed instruction):** dropping the `Slot:` placeholders and the unmeasured adoption row. Shipping them would have put visible scaffolding, or an unsupported number, on a live site.

**Confidently wrong:** nothing identified. The riskiest items are flagged above rather than claimed as settled.

## 5. Consequence — what it cost or risked

**Actual outcome (did the work hold up):** all three pages parse clean, pass `prosekeep check` with no mechanical findings, produce a sane heading outline, render without horizontal overflow and without JavaScript errors, and keep their own colours. The live behaviour that was already there (last.fm, Bookhive, the rotating digressions, the obfuscated email) is untouched.

**Harm / cost / risk — realized or narrowly avoided:** the real exposure is factual, not technical. These pages now make stronger, more specific claims about authority held and results delivered than they did before. Several come from the owner's own firsthand account rather than from a document. If any is wrong, it is wrong in public.

**Downstream affected parties:** anyone reading these as a professional record: clients, hiring managers, reporters, conference organisers.

**Expected failure if this run happened 100 times:** the structural work would hold. The failure mode is copy: an overstated authority claim, a number that drifted between sites, or a `Status` value that stopped being true after a project went quiet.

## 6. Change — what happens next

**Specific changes before next run:**

- Ron should read every claim on all three pages once, as claims rather than as copy, and correct anything overstated. The items most worth checking are listed in the site-specific section below.
- If the three sites are meant to agree on shared numbers (40+ designers, 400+ engagements, 100+ Digital Corps signups, six nonprofit sites), add a check that compares them. There is none today, by the owner's choice.
- Add the CI check the `page-types/` READMEs have been asking for: fail the build when `assets/core.css` differs between the three repos. This change made that file easier to drift.

**Keep doing:** harvesting claims from copy that is already live instead of writing fresh ones; running `prosekeep` and a render pass before calling a page done; refusing to ship a placeholder.

**Should not be delegated to an agent at all:** deciding what Ron is willing to claim about his own authority, and whether a project is still live.

**Signal that the change worked:** someone who does not know Ron can read any one of the three sites and say what he is responsible for and what changed because of it, and every claim survives being asked "says who?".

## Site-specific: ronbronson.dev (dev-site)

**Structure now on `index.html`:** the hero and the project catalogue were already close to the mockup. The retrofit gave the catalogue a frame and a reason, and added the writing that argues for it.

| Block | Fill | What it does |
| --- | --- | --- |
| TopBar | ink | unchanged |
| Hero | lead | unchanged headline and Vloora line, plus a new `.cta-row` ("See what's live", "Read the writing") |
| Built, released, in use | bg | the existing project grid, now under a heading and a standfirst. Every card carries a `.specs` list: Status, Audience, My contribution. |
| Writing | deeper | new tile grid: four posts and the blog |
| Concepts & Experiments | bg | unchanged |
| Contact + colophon | — | unchanged |

**Heading levels:** the project titles were `h2` with nothing above them. They are now `h3` under the `Built, released, in use` `h2`. The class names did not change, so no CSS moved.

**The missing Adoption row, on purpose:** the mockup shows an `Adoption: Slot: verified usage` row on every card. It is not here. The editorial reference says to report metrics only when measured, and no verified usage number exists for any of these. Add the row per project when a real figure exists. Do not add it as a placeholder.

**Claims Ron should check before this goes live.** Every `Status`, `Audience` and `My contribution` value was inferred from the project's own existing paragraph, or from the status tags on `atproto/index.html`, and not confirmed by him:

- `Status: Live` is asserted for Mallo, Play To Clinch, Oregon HS Tennis, Cap Buffet, SuperInnings, Viperball, PDX Spend, Tennis Polo and Leafroll. Anything that has gone quiet should be changed.
- `You Go First` is marked `Waitlist`, read off its waitlist hero screenshot.
- `Glowrm` is marked `Spec and reference apps`, from the `spec` status tag on the ATProto page.
- `Occupant Indices` is marked `Live, recomputed daily`, from its own paragraph.
- The `My contribution` lines name directed agent builds where the existing copy already said so. Check that the split between technical direction and agent-authored code reads the way he wants it to.
