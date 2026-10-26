# Agent Action Record: npm tools, the right blog, and the slop

**Review date:** 2026-10-26
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session), branch `claude/dazzling-sagan-t4x1ab`
**Task or period under review:** Second pass on ronbronson.dev
**Accountable human (name or role):** Ron Bronson (owner)

## 1. Intent — what was supposed to happen

**Instruction given (actual wording):**

> i added several new pm packages npm packages since that .dev site last published prosekeep and a plain language tool that need to be added to the dev site. also the dev blog is blog.ronbronson.dev versus the other one so you must use that one instead
>
> also the site is full of AI slop and doens't use my plain language rules

**Success defined in advance as:** not defined in advance. Three jobs: publish the new packages, point the blog at the right host, and get the AI writing out of the project copy.

**Authority granted to the agent:** edit, commit and push to the branch.

**Out of scope:** the hero headline, which Ron kept through the mockups, and the colour engine.

## 2. Action — what actually happened

**What the agent did (step by step):**

1. Checked npm rather than guessing. `prosekeep` 0.3.0 and `plain-language-default` 0.1.0 are published, alongside `closedtab` 0.5.0 which the site already listed. The `trainingday` package on npm belongs to someone else and was not included.
2. Added an **On npm** section carrying all three, each with its version, npm and GitHub links, and a plain description. `closedtab` moved up out of Concepts & Experiments to sit with the other two.
3. Checked both blogs before changing any link. `blog.ronbronson.dev` is **Sideline Engineering**, a separate publication with its own posts. The four posts previously linked here live on `blog.ronbronson.com` and return 404 on `.dev`.
4. Repointed the nav and the hero button to `blog.ronbronson.dev`, and rebuilt the Writing section from Sideline Engineering's actual feed: five real posts and a link to the blog.
5. Rewrote twelve project descriptions to remove the AI patterns. Facts preserved in every case.
6. Fixed the block fills so the new sections alternate again, and checked every outbound link on the page.

**What it produced or changed:** `index.html`, `assets/core.css` (shared card modifiers), and this record.

**Where actual behavior differed from the instruction:** two links to `blog.ronbronson.com` remain, on the closedtab and Claude-skill entries, because those specific posts document those specific tools and exist only on that blog. Every reference to *the blog* now points at `.dev`. Flagged below rather than decided silently.

**Stayed within granted authority?** Yes.

## 3. Judgment — human in the loop

**What the slop actually was.** The patterns found, against the humanizer skill:

| Pattern | Example found |
| --- | --- |
| Not X but Y (§1) | "directed, not hand-coded" on Play To Clinch and SuperInnings |
| A label standing in for a sentence | "Platform reuse in practice:" on Play To Clinch |
| Forced triads (§6) | Oregon tennis, Glowrm, SuperInnings, the ATProto card |
| Dashes as the universal connector (§8) | Occupant, Viperball, SuperInnings, Beachwave, Glowrm |
| Inflation (§9) | "has long operated", "I wondered if it were possible", "the first successful attempt at creating" on Mallo |
| Grand closing clause | "for a world where identity is portable" on the ATProto card |
| A broken list | "Home to Lottery Lab, its draft-lottery sibling, and a directed agent build" — a build is not a thing a site is home to |
| Circular definition | "A better matching model... to match people" on You Go First |

**Decisions the agent made on its own:**

- Kept Tennis Polo's copy untouched. It was the one card already written like a person: "Tennis Polo is pretty straightforward... A sport I invented by accident at summer camp in 2004."
- Kept the two `.com` post links where they document a tool.
- Did not add an `Adoption` row, same as the first pass.

**Of those, which should a human have made or seen:** the `.com` links, and whether "Earth's first-ever team tennis computer game" and "the most advanced high school tennis ranking system in the country" should stay. Both are his claims and both survived the rewrite unchanged.

**Where a human actually intervened:** Ron said the site was full of AI slop. The first pass had explicitly left this copy alone on the grounds that it was his own voice. That call was wrong, and he corrected it.

**Points where it should have escalated and didn't:** none this round.

**Accountable for these actions:** Ron Bronson.

## 4. Deviation — the gaps

**Gaps between intent and action, and why (root cause):** the first pass treated "already on the live site" as "written by Ron". Most of this project copy was agent-written, so the rule protected the slop instead of the voice. The right test is whether a passage reads like the writer, not whether it shipped already.

**Good deviations:** not blanket-replacing `.com` with `.dev` in the URLs. Four of those links would have 404ed.

**Confidently wrong:** the previous record quoted Viperball's description as a voice sample to preserve. It was one of the worst offenders. Corrected in `EDITORIAL.md`.

## 5. Consequence — what it cost or risked

**Actual outcome (did the work hold up):** `prosekeep check` clean. plain-as-day on the extracted copy went from 9 findings to 1, and that one is a heading-boundary artifact. HTML parses clean, no horizontal overflow, no JavaScript errors, every link resolves except `consequencedesign.com`, which times out and predates this change.

**Harm / cost / risk — realized or narrowly avoided:** a blanket URL swap would have broken four working links. Rewriting prose always risks dropping a fact; every replacement here was checked against the original for facts, numbers, and named systems.

**Downstream affected parties:** anyone who followed a link from a project.

**Expected failure if this run happened 100 times:** a fact lost in a rewrite, or a `Status` value that stopped being true.

## 6. Change — what happens next

**Specific changes before next run:**

- Ron decides on the two remaining `.com` post links.
- `consequencedesign.com` times out. Worth checking whether it is still up.
- The versions in the **On npm** section are hand-written. They go stale on the next release.

**Keep doing:** checking npm and the live URLs before writing either into a page.

**Should not be delegated to an agent at all:** deciding which of his claims are too strong.

**Signal that the change worked:** the project copy reads like one person wrote it, and nothing on the page points at a blog that does not have the post.
