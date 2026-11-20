# After action record: Ron's Arcade

**Date:** November 20, 2026
**Accountable human:** Ron Bronson

## 1. Intent

Ron asked whether Paco's Island had an entry on ronbronson.dev. It had none, and World Six and the arcade weren't on the site either. He wanted a place to share the games as ideas he brought to life, set apart from the site's editorial argument. After a first pass as a portfolio-style Games page, he asked for Ron's Arcade instead: its own look, not a portfolio page, with each game explained, gameplay videos or screens that show what each game was trying to do, and World Six shown in play rather than at its title page. Pages that already exist stay as they are; only the new games needed new lines. He also asked that no commit carry AI attribution lines.

## 2. Action

- **`arcade.html`, Ron's Arcade:** a dark arcade floor (`assets/arcade.css`, loaded after `slabs.css`, which keeps the site's header, footer and fonts). Each game is a cabinet: a colored marquee with its name, a screen, a control panel with Play and How I built it, and a few lines on the idea. Two rows: "Play in your browser" (Paco's Island, World Six, Coalition, Play To Clinch, SuperInnings) and "Sports I made up" (Tennis Polo, Viperball), then a line linking the Finnish baseball game design talk.
- **Gameplay videos (MP4 and WebM, portrait, on upright cabinets):**
  - Paco's Island (`assets/pacos-island/run.*`, 41 seconds): the title screen, three answers typed into Paco's mode with the points and the boat moving, then Vacation mode, ordering a horchata and fish tacos from Maria's menu as she walks them over. Recorded from the game's own code at 430 x 932 and played at 1.4 times speed.
  - World Six (`assets/world-six/run.*`, 33 seconds): a practice round on the live site, so the daily game wasn't touched, with all six guesses within about 63 miles, ending on the score of 108,782 and the round list. Played at double speed; the poster is the finished run.
  - Coalition uses its existing run-through video.
  - The other cabinets show their existing screenshots.
- **Videos** play muted and looping only while on screen. With reduced motion they stay on their poster, with controls.
- **New lines** for Paco's Island and World Six, in Ron's voice, on what each was going for; the other cabinets reuse their existing project wording.
- **Navigation:** Arcade is in the main navigation on the home page, the Projects page and the arcade page. The first pass's `games.html` and its two screenshots are gone.
- The first pass's commit was rewritten without its AI attribution lines, and no commit here carries them.

## 3. Checks

- Rendered at 1440 and 390 pixels wide: no failed requests, no page errors, no sideways scroll on a phone; the three videos played on load.
- Contrast: body text 16.4 to 1, muted text 9.4, Play buttons 12.9, How I built it 13.9; marquees from 5.8 to 12.6 to 1 (Play To Clinch's green darkened from 4.3).
- The five videos total about 3 MB, with Coalition's existing 2.9 MB MP4 the largest.

## 4. Gaps

- Paco's Island and World Six have no project pages, so their cabinets have no How I built it button.
- pctennis.xyz and superinnin.gs didn't answer through this session's network; their links are the ones their project pages already use.
- Talks, about and the project pages don't link to the arcade yet.
