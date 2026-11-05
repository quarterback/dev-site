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
