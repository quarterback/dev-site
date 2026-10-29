# Previous versions of ronbronson.dev

Front page screenshots of each real redesign in this repo, sampled about every three to six months. Restyles of the same layout are left out, including the shared block system that ran on all three sites for six days in October 2026. Each design was rendered from the last commit before the next redesign replaced it, at desktop (1440 px) and phone (390 px) width.

| Design | Live | Commit | Desktop | Phone |
|---|---|---|---|---|
| project grid | 2026-06-08 to 2026-10-22 | `9a0e3c0` | [desktop](2026-06-08-project-grid-desktop.jpg) | [phone](2026-06-08-project-grid-phone.jpg) |

Pages that loaded web fonts from Google Fonts or Fontshare were rendered without those fonts, so their type falls back to system faces. Live data (last.fm, reading shelves, video thumbnails) did not load in the render.

To see any version in a browser, check out its commit and open `index.html`. Versions built with Astro need `npm install` and `npx astro build` first; the built site is in `dist/`.
