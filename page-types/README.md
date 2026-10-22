# Page types — ronbronson.dev

The page types this site uses, rebuilt on the Chromatic Editorial System so the three sites share one structure. Open `index.html` here for the list.

## How a page is assembled

1. `assets/faces.css` — this site's `@font-face` rules, the type slots (`--display --deck --text --sans --mono --std --ui`) and fallback colour roles. Site-specific.
2. `assets/core.css` — the shared layer: base, every component and page-type style, written against the colour roles and type slots only. **Byte-identical in 2026-site, dev-site and bonus-time.** Change all three or none.
3. `assets/palette.js` — writes the colour roles for the chosen scheme and injects the theme dock.

Every page type here is a copy of a live page's `<body>`, content verbatim, with inline `<style>` blocks removed and paths re-pointed from `page-types/`. The live pages are untouched.

## Page types

| File | Page type | Built from |
| --- | --- | --- |
| `catalogue.html` | Catalogue | `index.html` |
| `project.html` | Project | `projects/mallo.html` |

## Left for cleanup before launch

- Move the live pages onto `faces.css` + `core.css` (replace their inline `<style>` blocks and `site.css`/`front.css`), then delete `page-types/`.
- Add a CI check that fails when `assets/core.css` differs between the three repos.
- Not done here: inline SVG icons in place of Font Awesome (DDR-007), the tuned Platinum accent (DDR-005), the shared family-bar labels. See the design system's Decisions section.
- Spacing and type sizes are the source pages' values; nothing has been tuned visually.
