# Agent Action Record: Viperball and Play To Clinch pages brought up to date (24 November 2026)

**Review date:** 2026-11-24
**Reviewed by:** agent self-review
**Agent / system:** Claude Code (cloud session)
**Task or period under review:** Updating `projects/viperball.html`, `projects/play-to-clinch.html`, and the Viperball model on Projects to match quarterback/viperball at 1a8ddc8 and quarterback/tennis-team-manager at 6e04fab
**Accountable human (name or role):** Ron Bronson, site owner

## 1. Intent — what was supposed to happen
**Instruction given (actual wording):** "Update the viperball and tennis pages on my dev-site as both repos have updated visually and under the hood especially viperball the project pagee"
**Success defined in advance as:** not defined in advance. Read as: every claim on the pages matches the current code, the screenshots show the current look, and any live model ported from a changed function still matches it.
**Authority granted to the agent:**
- Edit dev-site on a branch and open a PR.
- Read both repos and run them locally for screenshots.
**Out of scope:**
- Changing either game repo.
- Merging.
- The Oregon rankings page.

## 2. Action — what actually happened
**What the agent did (step by step):**
1. **Tennis page:** asked which tennis page Ron meant. The question was denied, so I picked Play To Clinch (tennis-team-manager). It is the tennis repo that changed both visually and under the hood. The Oregon rankings repo changed only its lineup tools and a rename.
2. **Viperball, the repo:** read 130 commits since 8 November, plus the action records for retiring the React workbench, the stats site's light theme, the pixel icons, and the coordinator work (CCH-02, CCH-03, CCH-04).
3. **Viperball, screenshots:**
   - Ran the app locally (`uvicorn main:fastapi_app`).
   - Started a season through the stats site's own New season form and simulated four weeks.
   - Captured the season overview and a team page's Coaching staff and Installation sections.
4. **Viperball, facts checked against the repo:**
   - 333 team records: 205 college, 64 across five pro leagues, 64 across four WVL tiers.
   - 11,709 rostered players.
   - 16 offensive schemes and 8 defenses (`OFFENSE_STYLES`, `DEFENSE_STYLES`).
   - `game_engine.py` is 15,710 lines; Python totals about 116,000.
   - 16 stats-site themes.
   - 95 specs and action records.
   - The NiceGUI app is still mounted at `/`, but viperball.xyz sends the root to `/stats/`.
5. **Viperball page:**
   - Updated the lede, intro, and meta descriptions (280 → 333 teams; "four ways to watch it" → one site).
   - Added the midfield lines, the coordinator identities and installation (with a screenshot), and game-day form and travel.
   - Corrected the scheme count, engine size, CVL count (187 → 205), and team and player counts.
   - Merged "The interactive app" and "The stats terminal" into "The stats site". It says the workbench was retired and every control moved to plain HTML forms.
   - Added the paired seeded benchmarks to the method section.
   - Updated the line count in the stack section.
6. **Viperball elsewhere:** updated the counts on Projects, Arcade, and More. More now says "roughly 116,000 lines across more than 90 decision records".
7. **The Viperball model on Projects:** the engine's kick code changed on 23 November.
   - **What changed in the engine:**
     - field goals now use a range 15 yards past the snap kick's, out to 71 yards;
     - kicker ratings go through `_kick_skill`;
     - there's new 4th- and 5th-down kick logic.
   - **The port:** re-ported all four functions.
   - **The check:**
     - Wrote a harness that runs the engine's own `select_kick_decision` on a stub game state.
     - Compared it with the browser port on 16,800 situations: 5 kicker ratings × 4 downs × 7 distances × tied or trailing × field position 40–99.
     - 0 mismatches in the call, place-kick odds, or drop-kick odds.
   - **On the page:**
     - The slider became "Kicker rating" (60–95, default 77, from the best kickers sampled: 69–85).
     - The down picker gained 1st to 3rd and 4th.
     - The chart runs to 75 yards.
     - The note, formula, and source were rewritten.
8. **Play To Clinch, the repo:** read the README, the paper's action record (`docs/AAR-jhsaa-paper.md`), and the default-look commit (aa3ff48).
9. **Play To Clinch page:**
   - Added high school to the lede and meta.
   - D1–D3 → D1–D4.
   - Replaced "send your best eight to a national bracket" with the selection committee, the 96- and 64-team fields, and the four regions.
   - Added "High school: the JHSAA" and "The paper" sections, plus a line on the new default look.
   - Added the one optional network call (the paper's writer).
   - Added a High School item to the feature list.
10. **Play To Clinch screenshots:** ran the app locally and started a league. Week 0 pages are empty, so I ran one advance in the background to capture pages with real results. See the addendum for the outcome.
11. **Editorial tools on every new sentence:**
    - red-pen-editor `brief` for each page;
    - edits through red-pen-editor `apply`: 3 for Viperball, 4 for Play To Clinch, 1 for the model note;
    - then plain-language-default, prosekeep, and unslop.
    - Two long sentences that are Ron's own were left unedited.
12. **Browser check:** Playwright on all five changed pages at 1440 and on iPhone 14 emulation. No broken images, no page errors, no horizontal overflow. The model's calls were checked in the browser too.

**What it produced or changed:**
- `projects/viperball.html`, `projects/play-to-clinch.html`, `projects.html`, `arcade.html`, `more.html`
- `assets/under-the-hood.js` (`viper()`)
- New images: `assets/viperball/stats-site-season.webp`, `assets/viperball/installation.webp`
- This record

**Where actual behavior differed from the instruction:** "Tennis" was ambiguous, and the clarifying question was declined. I chose Play To Clinch and say so here and in the PR.

**Stayed within granted authority?** Yes.

## 3. Judgment — human in the loop
**Decisions the agent made on its own:**
- **Which tennis page.**
- **Keeping NiceGUI in the stack line,** because it is still mounted. The prose says the stats site is where you run the game.
- **The model's assumptions:** first quarter, no clock pressure, no traits, no bonus possession. The source line says so.
- **The default kicker rating (77),** chosen from a sample of eight teams.
- **Where the JHSAA and paper sections sit:** after junior recruiting, before the pro circuit.
- **Every new sentence's wording.**
  - New facts came from the repos' commit messages and action records, which agents wrote. I said them plainly in Ron's first person only where the record shows an owner decision: retiring the workbench, and asking for the paper.

**Of those, which should a human have made or seen:**
- **Tennis page:** Ron may have meant the Oregon rankings, or both.
- **First-person lines:** "I wanted the running coverage a local daily gave high school sports in the '90s" is a paraphrase of the owner ask recorded in the paper's action record, not a quote from Ron.

**Where a human actually intervened:** none yet.

**Points where it should have escalated and didn't:** none beyond the declined question.

**Accountable for these actions:** Ron owns the site and the merge. The agent owns the accuracy of the claims and of the port.

## 4. Deviation — the gaps
**Gaps between intent and action, and why (root cause):**
- **My own bug:** my first check of whether the kick functions had changed used an awk range that ended on its first line, and it reported "same". I caught it because the commit log said the kick logic had changed, and redid the comparison with Python's `ast`.
- **Unchecked carry-overs:** some claims stay from the old Viperball page because the code doesn't contradict them, for example "200+ game validation batches". I didn't re-verify them.

**Good deviations:**
- **The college bracket:** the old Play To Clinch line "send your best eight to a national bracket" no longer matches the README's 96- and 64-team fields, so I replaced it rather than keep it.
- **Recruiting board:** I'd drafted that Jefferson's seniors go onto the college recruiting board. The README says that happens only when a college save opts in, so I corrected it before it reached the page.

**Confidently wrong:** nothing found so far.

## 5. Consequence — what it cost or risked
**Actual outcome:** the two pages and the model match the code at the stated commits.

**Harm / cost / risk:**
- The pages will go stale again as the repos move; both say what was true at these commits.
- The Viperball screenshot shows a locally run season, not viperball.xyz, which this container can't reach.
- General Sans can't load here, so the stats site's text renders in its fallback, Geist. The live site loads General Sans from a CDN, so its text will look a little different.

**Downstream affected parties:** readers of ronbronson.dev.

**Expected failure if this run happened 100 times:**
- Most runs would pick a tennis page without asking, and some would pick the other one.
- Without the harness, a port of changed engine code would often ship with small mismatches.

## 6. Change — what happens next
**Specific changes before next run:**
- When a project page includes a ported model, check the ported functions with the language's own parser, not a text range.
- Ask which page when two projects share a word in the request, and record the choice when nobody can answer.

**Keep doing:**
- Run the app and drive its own forms for screenshots.
- Verify ports against the engine's own function on a grid of inputs.
- Use red-pen-editor `brief`, then `apply`, then the checks, on every new sentence.

**Should not be delegated to an agent at all:** first-person statements of why Ron built something, beyond what his own records say.

**Signal that the change worked:** Ron's review finds no stale counts and no claim the code contradicts.

**Trace:** reconciled against this session's transcript, not a machine log.
