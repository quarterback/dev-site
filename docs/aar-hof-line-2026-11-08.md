# Agent Action Record: Hall of Fame line on Projects (8 November 2026)

## 1. Instruction
Ron asked whether his new tooling could bring his post "How Do You Evaluate a (Baseball) Hall of Famer" (blog.ronbronson.com, 12 October 2026) to life. I offered three ideas. Ron: "I would want it to actually be on my development page … it can just be a model and link to the post doesn't need a own page … I wanna see it as a rendered data visualization. Webgl, html5 + dragology? What would it do? The 3rd one appealed to me most and yes to all players banned or not."

## 2. What changed
- `projects.html`: a new Under the hood piece, "Where the Baseball Hall of Fame draws its line". It links to the post and to Michael Mountain's FanGraphs article.
- The colophon adds WebGL, Baseball Reference (Data), and Mountain (Cited).
- `tools/stack-map/src/hof-line.jsx`, bundled into `assets/stack-map.js`:
  - Ten lanes, C through RP.
  - WebGL draws about 4,000 retired players by Career Index (JAWS ÷ Hall standard × 100).
  - A Dragology handle changes the Hall's size from 60% to 140%, and every lane's line blends between states while you drag.
  - Dots change color against the lines' live positions: lime for players above the line who aren't in, pink for Hall of Famers below it, and rings for Negro Leagues inductees.
  - An HTML list shows the players around the line for any position.
  - Arrow keys change the size.
- `assets/uth/hof-line.json`, `assets/under-the-hood.css` (`.hl` rules), and `tools/stack-map/hof-data/` (scripts and a README on where the data comes from).

## 3. Evidence
- **Reproduces the post:**
  - Hall standards from the players' Baseball Reference pages give Reuschel 92, Simmons 96, Nettles 98, Lofton 96, Olerud 91, Whitaker 100, and Grich 104, matching the post.
  - With Hall of Famers counted as players elected by committees other than the Negro Leagues committees, shortstop has 25. That matches the 25 Mountain cites, and the 25th-ranked retired shortstop is Nomar Garciaparra, as the post says.
- **Playwright Chromium** (SwiftShader WebGL) at 1440 and on iPhone 14 emulation:
  - The chart mounts with 10 lines.
  - Dragging the handle to 120% gives "With 30 seats at SS instead of 25, 9 who aren't in rank above the line, and 4 who are in rank below it."
  - No page or console errors and no horizontal overflow.
- prosekeep on the new copy: PASS.

## 4. Judgment calls
- **JAWS, not BOOG.** The post says "let's take BOOG out of this conversation and start with something established like JAWS," so the ranking uses JAWS. Only the marginal-player idea comes from Mountain.
- **Who counts.** Managers and executives elected as such (Torre, Comiskey, Griffith) don't count as Hall of Famers. Negro Leagues inductees are drawn but don't take a seat, because their JAWS covers only part of their careers.
- **Banned players.** Shown, as Ron asked. Rose and Jackson are tagged as banned.
- **Copy.** The head paragraphs follow the post's own sentences.
- **One bundle.** Bundled with the project map so React loads once. The bundle grew from 337 KB to 348 KB.

## 5. Deviations and risks
- **Data source.** The data comes from saved Baseball Reference pages, so it won't update by itself. Players Baseball Reference marks as not yet eligible are left out.
- **Lede mismatch.** The Under the hood lede still says the models come from "their source projects". This one comes from a blog post.
- **Phone size.** On phones the chart is 520px tall and the names over the dots are hidden. The list carries them.
- No trace beyond this session's transcript.

## 6. Next time
If Ron builds out the vote-adjusted index, it could share this chart, with the first-ballot vote as a second view.

## Addendum: title and intro
**Instruction.** Ron: "Titled the data viz as Marginal Player Line a two sentence intro from my post; use my editorial tools to enusure its not slop". He also said: "You'd have to ge tthe data yourself its easily findable". The data was already pulled from Baseball Reference, so nothing depends on him.
**Change.**
- The heading is now "Marginal Player Line".
- The intro is two sentences taken from the post: "Count the Hall of Famers at a position, rank everyone there by JAWS, and find the player who would occupy that final slot. What happens when the people that system recognizes don't resemble the people our existing measures tell us had careers of comparable quality?"
- The link to the post moved into the source line.
- The note under the chart names John Olerud in full.
- The list summary spells out numbers under 10, AP style, and no longer starts a sentence with a figure.
**Editorial tools.**
- plain-language-default flagged the first draft's opening sentence as too long. That sentence was the post's "Rather than defining the bottom of the Hall…", and its "rather than" contrast is also a humanizer tell. I cut it to the post's own clause.
- Final runs on the intro and on all other text in the piece: plain-language-default 0 problems, prosekeep PASS, unslop (deterministic) 0 AI-isms.
- unslop warned that "Marginal Player Line" is title case. I kept it, because Ron gave the title.
**Evidence.** Playwright at 1440 and on iPhone 14 emulation: "The Hall has 25 players at SS. Above the line, six aren't in. Below it, six are." At 120%: "With 30 seats at SS instead of 25: Above the line, nine aren't in. Below it, four are." No errors.
