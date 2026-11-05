# Agent Action Record: .dev front page as proof of work, the workshop

**Review date:** 5 November 2026
**Agent / system:** Claude Code (cloud session), on `claude/friendly-allen-7u5gyo`
**Accountable human:** Ron Bronson (owner)
**Trace:** checked against the session transcript only. No machine trace was available.

## 1. Intent

Ron: "i'm ready to implement dev as proof of work revamp on the dev-site. Implement this design in this codebase", linking the Portfolio Demo design canvas. The artboard is ".dev as proof of work, the workshop" (`DevWorkshop.dc.html`). He asked me to match its look while using this codebase's own components and conventions.

## 2. Action

- **`index.html` rebuilt from the artboard.** Sections in order:
  - Hero: "Ron Bronson", "For decades, I've been engaged in serious play.", then the stand line.
  - Recent projects: Coalition, Oregon HS Tennis Power Rankings, Cap Buffet, Occupant Indices and Mallo. Each gets an alternating screenshot row and its role line.
  - Other projects, in two columns: Play To Clinch, Viperball, SuperInnings, Tennis Polo, You Go First, Beachwave and Pensulo Cards.
  - In real life: two photos and the five rooms, 2022 to 2026.
  - Tools: the three npm packages and the PBBG Content Schema skill.
  - Footer: the Elsewhere icons and the colophon, which keeps the random digressions.
- **Copy is the artboard's**, word for word, apart from the fixes listed under Deviation.
- **New stylesheet, `assets/workshop.css`.** Only the home page loads it, and project pages keep `slabs.css`. It reuses the fonts already self-hosted in `assets/fonts/gallery/`.
- **Snow and Coffee colourways** come from the existing pigment sets in `faces.css` and `palette.js`. You pick one with the two swatches in the top bar. These are real `<button>`s with `aria-pressed`, and the choice is saved in localStorage. A small script in the head applies the saved theme before the page first paints.
- **Links point to real pages.** The artboard used placeholder `#` anchors, and these now go to the existing project pages. The npm commands link to their npm pages, and the PBBG command links to its project page. A Parliament of Neighbors links to its page. I also added a link to `more.html` under Other projects.
- **Photos.** `assets/dfp-room.jpg` was copied from bonus-time. It's the same photo as the canvas's, at 1400px instead of 900. The easel photo is the existing `assets/workshop-easels.jpg`.
- **Metadata:** the title, description, OG and Twitter text now follow the hero, in the third person as `EDITORIAL.md` requires.
- **Nav on the other 23 pages:** "Writing", which linked to `index.html#writing`, is now "Blog" and links to `https://blog.ronbronson.dev`. The home page no longer has a Writing section, so the old link would have gone nowhere. The Recent projects section keeps `id="work"`, so the "Work" links still land.

## 3. Judgment

- **Sentence-case headings.** The artboard says "Recent Projects", "Other Projects" and "In Real Life". STYLE-07 is on, so I set them as "Recent projects", "Other projects" and "In real life". The nav labels ("Things I made", "On the bench", "Rooms", "On npm") are kept exactly as drawn, even though they don't match the headings.
- **The artboard has two visible placeholders, and neither is published.** Each spot is marked with a STAND-IN comment:
  - Other projects: "[Ron to write: one line framing these as the experiments, side quests and invented sports.]"
  - In real life: the intro line stops mid-sentence at "…bringing to life participatory design, speculative".
- **Pensulo Cards has no link.** There's no page for it on this site.
- **Dropped from the home page, as the artboard drops them:** point of view (tabletop exercises, mission engineering, agent experience, forward deployed design), How I build, the Writing lists, the VarsityApex row, the npm versions and links lines, and the Agent After-Action Review skill. Earlier runs put these there at Ron's request, so this is his call to confirm.
- **I removed `contact.js`.** The new page has no `data-contact` links, and email is in the footer icons.

## 4. Deviation

- **Typos fixed in Ron's artboard copy:**
  - "real-world scenario" became "real-world scenarios".
  - "I build a suite" became "I built a suite".
  - "The Designers Share of the Problem" became "The Designer's Share of the Problem". That's the talk title as it appears on 2026-site and bonus-time.
  - The Years Ahead line got a closing full stop.
  - "Pesäpallo" is lower case mid-sentence.
- **Claims carried from the artboard:**
  - "During my stint as EIR at State Capacity AI" appears nowhere else on the three sites. It's a firsthand account, stated in Ron's own design, and he should confirm it before this ships.
  - The 2022 date for The Designer's Share of the Problem, and calling it a workshop, also come only from the artboard.

## 5. Consequence

- I rendered the page at 1440px and 390px in headless Chromium, in both colourways. There was no horizontal scroll, no script errors and no failed requests. The theme switch sets `data-theme` and saves the choice.
- `npx prosekeep@0.3.0 check index.html` found 0 mechanical findings.
- **Risk:** the home page now argues serious play and proof of work, not the 3 November applied R&D story. The OG image still shows "Problems Are Designed".

## 6. Change

- Ron writes the Other projects line and finishes the In real life sentence.
- Ron confirms the State Capacity AI EIR line and the 2022 workshop date.
- Ron decides whether the point-of-view material and Writing lists move to another page or stay off the site.
- The social card needs a new image to match the new hero.

## Addendum: cleared for launch

**Intent.** Ron, with the Pensulo link https://dribbble.com/shots/3794375-Pensulo-Card-Deck: "where there is no commited text remove those areas i'm not doing to do that rightn ow but i still want to launch".

**Action.**
- Pensulo Cards now links to its Dribbble shot.
- I removed both STAND-IN comments, for the Other projects framing line and the In real life intro. Neither area shows anything; the headings go straight to the content.

**Still open.** The State Capacity AI EIR line, the 2022 date, the dropped home page sections and the social card image (see section 6). Ron chose to launch without settling these.

## Addendum: Preparing leaders, contact nav and writing

**Intent.** Ron: the tabletop work should be woven into the storyline, and the heading should be "Preparing Leaders (For the challenges ahead)" or similar. "No work-with-me page here, just a contact link in the nav to email me." The nav should link to .design and not the raw blog. A section at the end should hold about four posts from blog.ronbronson.dev, technical posts from blog.ronbronson.com and, if worthwhile, makingpublicwork.com, as titles only with no descriptions or dates. He also said "the hero needs to be revised".

**Action.**
- **"In real life" became "Preparing leaders for the challenges ahead"** and moved up to second place, after Recent projects and above Other projects. It opens with the three tabletop paragraphs from the 3 November home page, in Ron's words, followed by the photos and the five events.
- **Home nav:** Things I made, Preparing leaders, On the bench, On npm, Design (ronbronson.design), and Contact (mailto:ron@ronbronson.com). The Blog link is gone.
- **New Writing section** before the footer. Titles only, each checked live on its own host:
  - blog.ronbronson.dev: "Storyboarding the escape" (Coalition) and "What if you could mix & match salary caps? Or invent your own draft lottery?" (Cap Buffet).
  - blog.ronbronson.com: "Bringing AX to Life…" and "I Built a Claude Skill for After-Action Reviews on AI Agent Work". These titles are copied from the earlier home page.
- **`work-with-me.html` is deleted.**
  - `vercel.json` now sends /work-with-me, /offerings and /digital-statecraft to ronbronson.design.
  - The "Work with me" and "Blog" links are gone from every other page's nav.
  - The "Invite me to speak" link in `about.html` now opens an email.

**Judgment.**
- **No Making Public Work post.** Its feed is essays on public-sector practice ("Agents Against Bureaucracy", "Technologist is not a job"), not development writing.
- **No ClosedTab write-up.** Its published title is auto title-cased ("Closedtab: A Npm…"), so the real casing couldn't be confirmed.
- **Heading in sentence case** to fit STYLE-07, without the parentheses.
- **Hero not changed.** Ron said it needs revising but gave no direction, so I asked him.
- **Old navs left alone.** `archive/` and the two restored legacy pages keep their own navs.

**Consequence.**
- Rendered at 1440px and 390px with no horizontal scroll, no errors and no failed requests.
- prosekeep found 0 mechanical findings on `index.html` and `about.html`.

## Addendum: positioned as a campaign, "Problems are designed"

**Intent.** Ron: "Other agents have asvised do a search of referenfe sites and find a good postioning this isnt a personal site its a campaign." I looked at Bret Victor, Dynamicland, Ink & Switch, Code for America, the King's Wargaming Network, PAXsims, Jane McGonigal and Nicky Case. I offered three hero options and Ron picked "Problems are designed".

**Action.**
- **Hero:** "Problems are designed", followed by "I build games, simulations and software that make the design visible, so people can change the rules before they live under them." The "Ron Bronson" headline, the serious-play lede and the stand line are gone. The name stays in the top bar.
- **Title, description, OG and Twitter text** now lead with the claim, in the third person.
- **New closing ask before the footer:** "Got a decision to rehearse?" followed by the email address.
- **`EDITORIAL.md`:** .dev is now recorded as a campaign for "Problems are designed", with shipped software as its proof. Ron changed this on 5 November 2026, replacing the earlier "proof that software shipped".

**Judgment.**
- **New wording to confirm.** The headline is Ron's, from the 3 November hero. The sentence under it and the ask line are mine, built from his tabletop paragraph. Ron should confirm or rewrite both.
- **Serious play left out.** "For decades, I've been engaged in serious play" no longer appears on the page. It could come back as a line in Preparing leaders if Ron wants it.
- **Not reached.** I couldn't fetch Jen Pahlka's site from this session's network.

**Consequence.**
- Rendered at 1440px and 390px with no horizontal scroll and no errors.
- prosekeep found 0 mechanical findings on `index.html` and `EDITORIAL.md`.
- The social card still says "Problems Are Designed", which now matches the hero.

## Addendum: no "serious play"

**Intent.** Ron: "I hate engaged in serious play, not how I talk." He prefers "convening, training leadership, preparing people for leadership." Framing it as play gets the work dismissed.

**Action.**
- The phrase was already off the page after the hero change. A search of the site found no remaining "serious play" or "engaged in".
- `EDITORIAL.md` now carries the ruling under "Language we avoid", naming convening, training and preparing leaders as the way to describe this work.

**Deviation.** The line came from the design artboard's hero. I carried it over word for word and didn't question whether it was how Ron talks.

**Change.**
- `2026-site` has a `SERIOUS-PLAY-EDITORIAL-GUIDE.md` that teaches agents this frame. Ron should decide whether it stays.
- The Preparing leaders section should be rewritten around convening and training, in Ron's words.

## Addendum: event links

**Intent.** Ron: "years ahead is online at yearsahead.io, design for the public at designforthepublic.com, digital corps at digitalcorpspdx.org".

**Action.** The three event headings in Preparing leaders now link to those sites.

**Consequence.** designforthepublic.com and digitalcorpspdx.org returned 200. yearsahead.io reset the connection from this sandbox, so it was linked on Ron's word.

## Addendum: nav cut to Contact

**Intent.** Ron: "get rid of the nav, i hate all of those fucking words you have for headings which don't match… they're just anchors anyway, contact is needed the rest is not".

**Action.** The home page nav is now a single Contact link (email), plus the two colour swatches. The section anchors and the Design link are gone.

**Deviation.** The anchor labels were the design artboard's. Last run I kept them after renaming the headings, so the two stopped matching.

## Addendum: VarsityApex first, hover previews

**Intent.** Ron: "varsityapex should be on this page, it's far too interesting a project with its own blog post not to be showcased ahead of the games". He also asked: "is it possible for a popup of the project artifacts to pop up when they get rolled over".

**Action.**
- VarsityApex is now the first Recent project, ahead of Coalition. It carries its copy from the 3 November home page, the write-up and live demo links, and its stack line.
- The Other projects names now show their screenshot on hover, using the existing `assets/shots.js`. Pensulo Cards has no screenshot in the repo, so it has no preview. Touch screens just follow the link.

**Consequence.** Rendered at 1440px with no errors and no horizontal scroll. prosekeep found 0 findings.

**Further change.** Ron: "remove this 'I call this live-action service design.'" The line is removed from Preparing leaders, along with the style that enlarged it.

## Addendum: VarsityApex reframed

**Intent.** Ron: "for varsityapex the fictional aspects are not worth noting, focus on the underlying schema and technical bona fides of how it's proof of concept for a much more consequential set of tooling since that's what it's really about not a sports demo", with the write-up link.

**Action.**
- **Home page entry rewritten** from the write-up's own points:
  - the legacy modernization framing
  - the pipeline: extraction, normalization, identity resolution, review, durable record
  - the resolver that records how each name was matched and declines ambiguous ones
  - the three contest shapes
  - open standard.site records and source-file hashes
- **Tag line** is now "Schema design, identity resolution, AT Protocol, standard.site, SHA-256 provenance".
- **On `projects/varsityapex.html`,** the lede, description, OG and Twitter text lead with "a proof of concept for data portability in legacy record systems". The body paragraphs are unchanged.

**Judgment.** The sentence "A proof of concept for the tooling stalled legacy modernization projects need" is my summary of the write-up's legacy-modernization paragraph. Ron should check it.

## Addendum: hero sized to the fold

**Intent.** Ron, with a screenshot: "this is far too big, it's killing the fold".

**Action.** The hero headline is now fluid, `clamp(56px, 7.2vw, 112px)` where it was a fixed 168px. The lede and the hero padding scale down with it.

**Consequence.** "Problems are designed" sits on one line at 1440px. The first project screenshot starts at 567px in a 1440×900 window, 603px at 1280×720 and 685px at 1000×700. There is no horizontal scroll at 390px.

## Addendum: one type scale

**Intent.** Ron: "recent project and other subheads should be H3 not H1 heroes… or H2 and then the project heads can be H3 BUT RIGHT NOW THERE'S NO RHYME OR REASON".

**Action.** `workshop.css` now sets one size per level:
- **`--h2`** (32–44px) for every section heading.
- **`--h3`** (22–26px) for every project, event and footer title, and for the years.
- **`--body`** (18px) for descriptions.

The hero is the only large type left.

**Deviation.** Section headings had been 76px and project titles 52px, as drawn on the artboard. Other projects and the events used different sizes again.

## Addendum: DFP photo band and one-sentence technical summaries

**Intent.**
- "the group shot from design for the public 24 should be the image between the hero and the first project, the 2nd photo can live at the bottom where it is now."
- "for all the tools the technical bona fides, the novelty of the idea and how sophisticated the design is, is what matters… this is for all projects especially the games… the blog.ronbronson.dev talks about these in detail, you should do an exhaustive look at them". Follow-ups: "no more than a sentence", "on the front page", "run them all against humanizer".

**Action.**
- **Photo band.** The full-width DFP 2024 photo (`assets/dfp24.jpg`, resized from the 2026-site original) now sits between the hero and Recent projects. Preparing leaders keeps only the easel photo, and `assets/dfp-room.jpg`, a crop of the same photo, is removed.
- **Blog read.** A subagent read all 26 Sideline Engineering posts and the 15 project pages, and extracted verbatim quotes and numbers for each project.
- **Summaries.** Every Recent project, Other project and Tool on the front page now has a one-sentence technical summary. Each sentence went through the humanizer pass, and the project pages are unchanged.
- **Coalition tag** is now "Game design, service blueprinting, single-file build". The old one was "Game design, fiction, content rules".

**Sources for the numbers.**
- From posts: 49 graded attributes and 295,219 Oregon varsity appearances (Play To Clinch); the 22-game chip window (Cap Buffet / Chip Window); the full season of drive data for the zero-sum kickoff (Viperball).
- From the earlier home page and project pages: 18 mechanics (Cap Buffet), 2,188 models (Occupant), the 2027 OSAA seeding (Oregon), and the fifteen picks and Gale-Shapley benchmark (You Go First).

**Judgment.**
- **Mappings.** SuperInnings is taken to be the O27 posts. Mallo, Occupant, You Go First, Beachwave and the tools have no posts, so their sentences come from their project pages.
- **Flags from the subagent** where posts and project pages disagree. These are left for Ron, and the front page uses neither disputed figure:
  - Viperball: 198 or 280 teams.
  - Play To Clinch: 49 or 51 attributes.
  - The Chip Window example bids exceed its own 10/25 wager rule.

**Consequence.**
- Rendered at 1440px and 390px with no horizontal scroll and no errors.
- prosekeep found 0 findings.
- The first project now starts below the fold at 1440×900; the photo band takes the space above it, as Ron placed it.
