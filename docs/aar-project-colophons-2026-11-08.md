# Agent Action Record: colophons on the project pages (8 November 2026)

## 1. Instruction
Ron: "Every page has a colophon wtf". When I asked whether to add colophons to the other project pages in a separate PR, he answered: "Yes".

## 2. What changed
- 20 public pages in `projects/` plus `_template.html` now end their footer with "Colophon, with digressions": Type, Built with, Images (when the page shows screenshots), Embeds (when it embeds video), Hosting, and then the rotating digression. The digression script is copied from about.html.
- `pbbg-content-schema.html` is left out here because it got its colophon in #116.
- The four pages on the older stylesheets (finnish-baseball-game-design, parliament-of-neighbors, varsityapex, pdxspend) wrap the colophon in `.colo`. `assets/site.css` and `assets/core.css` gain three `.colo` rules so the lines sit close together instead of taking the footer grid's large gaps.

## 3. Evidence
- **Type:** the faces Chromium reported as loaded on each page after scrolling to the end. The slabs pages load PP Neue Montreal, Hanken Grotesk, and IBM Plex Mono. The four older pages load Author, RX100, and Hanken Grotesk.
- **Images:** taken from the images each page actually loads. The commented-out `<img>` tags in varsityapex and the template don't count.
- **Embeds:** YouTube, through `youtube-nocookie.com`, on the Finnish baseball and Parliament of Neighbors pages.
- **Browser check:** Playwright at 1440 on oregon-tennis, varsityapex, and pdxspend, and on iPhone 14 emulation on parliament-of-neighbors. The colophon renders, the digression rotates, and there are no page errors and no horizontal overflow.

## 4. Judgment calls
- No **Data** lines. Ron doesn't want his data sources on the site (Oregon), and I didn't want to guess sources for the other pages.
- No **Cited** lines either. None of these pages cites outside work the way the projects page cites Dragology.
- "SVG" is listed wherever the page draws inline SVG (icons or the figure placeholder). The Finnish baseball and Parliament pages have none.

## 5. Deviations and risks
- The template's colophon is generic. A new page needs its lines checked against what it loads.
- No trace beyond this session's transcript.

## 6. Next time
When a page gains a font, library, embed, or data source, update its colophon in the same change (EDITORIAL.md).
