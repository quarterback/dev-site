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
