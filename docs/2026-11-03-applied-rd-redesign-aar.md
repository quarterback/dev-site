# Agent Action Record: .dev as the technical and applied R&D site

**Review date:** 3 November 2026
**Agent / system:** Claude Code (cloud session), on `claude/magical-faraday-uqz6vn` (PR #94)
**Accountable human:** Ron Bronson (owner)
**Trace:** reconciled against the session transcript only; no machine trace was available.

## 1. Intent

Ron's brief of 3 November: "Redesign ronbronson.dev as my technical and applied R&D site." The central story: "I work on messy 0-to-1 problems that cross software, operations, data, policy, and organizational boundaries. I turn those problems into schemas, decision models, simulations, tools, and working software." Organize it around mission engineering, forward deployed design and agent experience. Make projects the main proof, each with Problem, System, Mechanics, Stack, My role and Result. List a real tech stack. Group the writing by theme. Reduce the academic material, and point to ronbronson.com for teaching.

His follow-up: "I still want tabletop and simulations to be on there, don't get rid of that. I want You Go First and all the past projects to have pages. I just don't want them showcased on the front page. If you search they should still come up, just not highlighted." He also gave the VarsityApex write-up link, https://blog.ronbronson.dev/3msnpahn5r22k.

## 2. Action

- **Home page order:** hero (the central story and Ron's "I enter ambiguous problem spaces…" line), then How I work in three columns, The work, Tabletop exercises and policy simulations, Tech stack, Shipping with teams, and Writing.
- **The work** has four groups: Systems, Tools, Engines & simulations, and Research & experiments.
  - Featured projects carry the six-part summary: VarsityApex, Oregon HS Tennis Power Rankings, ClosedTab, prosekeep, PBBG Content Schema, Coalition, Cap Buffet and Occupant Indices.
  - Other projects get one line each, followed by a link to `more.html`.
- **VarsityApex** comes first. It links to the write-up, the live demo and the Vloora case study, and shows a new screenshot of varsityapex.com/tour.
- **Tabletop exercises and policy simulations** is kept on the home page, word for word.
- **New pages:** `projects/closedtab.html` and `projects/prosekeep.html`. The six-part summary was added to the existing featured project pages.
- **Restored** from git history: You Go First, PDX Spend, VarsityApex (the old page), A Parliament of Neighbors, and What Finnish Baseball Taught Me About Game Design.
  - Their redirects were removed from `vercel.json`.
  - Their exclusions were removed from `standard.config.json`, so they publish and come up in search.
  - They're listed on `more.html` with Nolla and Toccer, not on the front page.
- **Nav:** About is replaced by Work and Writing. The footer points to ronbronson.com for teaching and research.
- **Metadata:** the home title and description now follow the R&D story. New and restored pages were added to the metadata pass.
- **CSS:** new rules at the end of `assets/slabs.css`.

## 3. Judgment

- **Six-part summaries:** I wrote these from each project's README, page or case study. Ron should check the Result lines.
- **Mission engineering:** still has no essay link. A STAND-IN comment marks the spot.
- **Restored pages keep their original stylesheets** (`site.css`, `home.css`) and old navs, as they were when removed. I didn't restyle them.
- **`about.html` still exists** but is out of the nav.

## 4. Deviation

- I had removed You Go First in an earlier pass. This run restores it, along with the other removed project pages.
- Tabletop wasn't in the first draft of the redesign. Ron asked to keep it, so it's back.

## 5. Consequence

- **Rendering:** checked at 1440px and 390px in headless Chromium on the home page, ClosedTab, VarsityApex, You Go First and More. No horizontal scroll, no script errors, no failed requests, and all six case screenshots load.
- **Restored pages:** they are reachable again at their old URLs, which previously redirected.

## 6. Change

- Ron supplies the mission engineering essay link.
- Ron reviews the Result lines.
- Ron decides whether `about.html` stays and whether the restored pages get the Slabs styling.

## Addendum: You Go First as a featured engine

**Intent.** Ron: "the algo for you go first is the thing worth sharing it's just as good as the capbuffet and occupant stuff its in the heypbj repo."

**Action.**
- You Go First is now a featured project in Engines & simulations, alongside Coalition and Cap Buffet. It carries the six-part summary on the home page and on `projects/ygf.html`.
- The summary was written from the heypbj repo: the README, `src/lib/matchingAlgorithm.ts` (the 0.7/0.3 score), the research memo and the simulator.
- It links to heypbj.xyz and the live simulator. The repo itself is private, so it isn't linked.

**Judgment.** No simulation figures are quoted. The memo reports a Gini of 0.71 for Gale-Shapley against 0.42 for SPA. But the distributions it lists compute to 0.51 and 0.30, and the live simulator at /stable-matching-comparison currently reports SPA 0.30 against Gale-Shapley 0.08, with a Week 12 match quality of 0.0. The existing YGF page body still says "Gini ~0.42", and Ron needs to decide on it.

**Also fixed.** The metadata script was adding a duplicate `robots` line to `404.html` on every run. It now strips the old line first.

## Addendum: no dividers, shorter text

**Intent.** Ron: "I made a rule earlier that I want no dividers. I hate those lines, it's ugly and hard to read. Sentences or brevity on my sites, and also use prosekeep and humanizer on the text if you generated it."

**Deviation.** `slabs.css` already had a "No hard dividers" rule, and the first pass of this redesign broke it. The new sections had rules between columns, cases, summary rows, one-line projects and the delivery list.

**Action.**
- Removed every border from the new sections. They're now separated by space alone.
- Cut the six-part summaries for all nine featured projects down to one or two short sentences each. They're in `devbuild/brief.py` in the session scratchpad.
- Shortened the Shipping with teams lines.
- Ran the generated home page text through the humanizer patterns and through `prosekeep check` (0.3.0). It returned 0 mechanical findings.
- Left Ron's own words as they were: the hero, the brief's sentences, the FDD paragraph and the tabletop section.

## Addendum: back to the earlier layout

**Intent.** Ron: "When I said technical chops, tech stacks and proof of work, I didn't mean a portfolio. The agent's instructions about my role and all that were wrong; I'm not an IC. The old modality was the right lens. I just wanted the shape of what was on the site updated to match."

**Deviation.** The redesign turned the home page into a portfolio. It had six-part case blocks with screenshots and a "My role" row on nine projects. Ron didn't ask for that layout.

**Action.**
- The home page is rebuilt from the earlier Slabs layout (`ce5ffb4`), keeping its order: hero, point of view, On npm, Tech stack, Things I made as screenshot rows. Each row has a one-line stack in place of a role.
- Content updated to the brief:
  - the new hero;
  - mission engineering added to the point of view, which is now two by two with tabletop exercises, agent experience and forward deployed design;
  - the fuller stack list;
  - Things I made in the brief's groups: Systems (VarsityApex, Oregon), Engines and simulations (Coalition, Cap Buffet, You Go First, Play To Clinch), and Research and experiments (Occupant).
- Shipping with teams and Writing now replace the participatory and workshop section.
- The six-part blocks are gone from every project page, so those pages are back to their earlier text. ClosedTab and prosekeep have short prose pages.
- Removed the unused CSS.
- `prosekeep check` returned 0 findings on the generated text.

## Addendum: the short summaries go back on the project pages

**Intent.** Ron: "I do want the project pages that aren't visible to stay, and all that was what I asked for. I just didn't want it to be a portfolio with too much text."

**Action.**
- The short summary is back on the nine featured project pages: Problem, System, Mechanics, Stack and Result, one or two sentences each, placed under the lede. The "My role" row is gone.
- The summary has no dividers.
- The ClosedTab and prosekeep pages use the summary in place of the prose.
- The restored pages are unchanged and still listed on More: You Go First, PDX Spend, VarsityApex, Parliament of Neighbors and the Finnish baseball talk.
- The home page stays in the earlier layout.

## Addendum: projects before the stack, and how I build

**Intent.** Ron: "Projects ahead of the stack. I don't want people to think I know all those things like a poser. I just think being able to show 0 to 1 agentic skill at managing multi-agent teams, and saying so in contemporary language that FAANG, SV and HN people would recognize."

**Action.**
- The home page order is now hero, point of view, Things I made, On npm, How I build, Shipping with teams, Writing.
- The Tech stack list is replaced by How I build. It explains how Ron works (orchestrating multi-agent teams from 0 to 1; he owns the spec, the architecture and the evals; agents write most of the code; every run ends with a ClosedTab record) and names the projects built that way.
- The stack is reduced to one small "Shipped on" line, so it reads as what the projects run on.
- "Directed agent builds" moved out of Shipping with teams and into How I build.
- `prosekeep check` returned 0 findings.

**Judgment.** "Evals" covers the checks the projects actually run: Coalition's seeded-run harness and replay tests, the PBBG content checker, and prosekeep in CI. Ron should confirm the term fits how he'd describe them.
