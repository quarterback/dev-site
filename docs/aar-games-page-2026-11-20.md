# After action record: a Games page

**Date:** November 20, 2026
**Accountable human:** Ron Bronson

## 1. Intent

Ron asked whether Paco's Island had an entry on ronbronson.dev and whether the site warranted a game development section. It had none, and World Six and the arcade weren't on the site either. He asked for a place to share the games as ideas he brought to life, not framed by the editorial policy's argument for the site.

## 2. Action

- **`games.html`:** a new page built from the More page's markup (same head, header, slabs, "also" list and footer). The lede: "Ideas I had and built so other people could play them."
- **Five playable games, each with a screenshot and a link to play:** Paco's Island (pacoisland.fun), World Six (worldsix.pdtmag.com), Coalition (arcade.pdtmag.com), Play To Clinch (pctennis.xyz) and SuperInnings (superinnin.gs). The three with project pages also link "How I built it."
- **Sports Ron made up, and a talk:** Tennis Polo, Viperball and "What Finnish Baseball Taught Me About Game Design," linking to their project pages. The Tennis Polo line is his own card's wording.
- **New screenshots:** `assets/pacos-island/title.webp` (the title screen, 1440 x 900) and `assets/world-six/home.webp` (the home page, cropped to 1440 x 520).
- **Navigation:** Games is in the main navigation on the home page, the Projects page and the Games page itself.

## 3. Checks

- Rendered at 1440 and 390 pixels wide: no failed requests, no page errors, no sideways scroll on a phone.
- arcade.pdtmag.com, worldsix.pdtmag.com and pacoisland.fun answered with 200. pctennis.xyz and superinnin.gs didn't answer through this session's network proxy; their links are the ones their project pages already use.

## 4. Gaps

- Paco's Island and World Six have no project pages of their own yet.
- The page isn't listed in `standard.config.json`, like the Projects and More pages.
- The other pages' navigation (talks, about, project pages) doesn't link to Games yet.
