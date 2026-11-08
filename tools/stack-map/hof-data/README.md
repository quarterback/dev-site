# Data for the Hall of Fame line

`assets/uth/hof-line.json` comes from Baseball Reference, pulled 8 November 2026:

- the JAWS leaderboard for each position (`/leaders/jaws_C.shtml` through `jaws_RP.shtml`), saved as `jaws/<POS>.html`
- the Hall of Fame list (`/awards/hof.shtml`), saved as `jaws/hof.html`, which says how each inductee got in

`parse.py` reads the leaderboards into `jaws/jaws.json`. `build_data.py` writes the chart data. A separate step turns the Hall of Fame list into `jaws/hofmap.json` (player ID to category and committee); see the action record. Run both scripts from the folder that holds `jaws/`.

The Hall standards (the average Hall of Famer's JAWS at each position) are in `build_data.py`. They come from the players' Baseball Reference pages and reproduce the post's numbers: Reuschel 92, Simmons 96, Nettles 98, Lofton 96, Olerud 91, Whitaker 100.

Rules:
- Players marked as not yet eligible (bold on Baseball Reference) are left out.
- "Hall of Famer" means elected as a player by any committee other than the Negro Leagues committees.
- Negro Leagues inductees are drawn as rings and don't take a seat, because their recorded major league stats are incomplete.
- Managers and executives who also played are drawn but don't count as Hall of Famers.
- Rose and Jackson are tagged as banned.
