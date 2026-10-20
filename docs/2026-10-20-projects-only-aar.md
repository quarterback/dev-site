# AAR — ronbronson.dev goes projects-only

- **Date:** 2026-10-20
- **Branch:** `claude/epic-galileo-tui9v6`
- **Trace:** this session's own transcript. No separate agent trace was available to reconcile against.

## 1. The ask

> Take down VarsityApex off of ronbronson.dev and get rid of talks and stuff and we'll just keep it as a projects site online. Rewrite the blurb at the top of the page, as I'm rebuilding the throughline on all sites to make it explicit that I do Service Design and HCI/d and whatever else.

## 2. What changed

- **Removed from the index and deleted the pages:** VarsityApex (`projects/varsityapex.html`), the Netlify AX webinar cell (and `assets/netlify/`), the DrupalCon 2018 talk cell (YouTube link only, no page), the Donut.js "What Finnish Baseball Taught Me About Game Design" talk (`projects/finnish-baseball-game-design.html`), and A Parliament of Neighbors (`projects/parliament-of-neighbors.html`).
- **Concepts & Experiments list:** dropped "The Designer's Share of the Problem" (IxDA talk), "Agent Experience Needs Failure Affordances" (blog post only), and the Pixel Pioneers interview link under Consequence Design. Kept closedtab, the AAR skill, and Consequence Design with its own site link.
- **Lede rewritten** to say service design and HCI/d outright.
- **`<title>`, meta/twitter descriptions, and `standard.config.json` publication name/description** changed from "Working Catalog of Complex Systems" / "design leader who directs AI agents…" to match the new lede.

## 3. Judgment calls made without asking

- **Parliament of Neighbors counted as "talks and stuff."** It's a live participatory piece whose site is offline; only a documentation video remains. Read against "keep it as a projects site online," it went. Restore from git if that's wrong.
- **Blog-post-only and talk rows in the experiments list counted as "stuff."** Rows that point at something built (npm package, GitHub repo, standalone site) stayed.
- **Metadata updated with the lede.** The old description still pitched the AI-orchestration throughline, which would contradict the new blurb in search results and on standard.site.
- **Lede wording is a draft.** Written in the existing voice (kept "that one time I invented a sport"). The founder should confirm wording.

## 4. Deviations

- None from the ask. The colophon's "Working vocabulary" keyword line (AI agent orchestration, eval design, etc.) was left alone; it's outside the blurb and wasn't mentioned.

## 5. Risks

- **standard.site records for the three deleted pages still exist** on the PDS. `scripts/sync-standard.mjs` creates and updates records but never deletes them. Their rkeys are kept in `standard-mapping.json` so they can be deleted by hand.
- **Old URLs now 404** (`/projects/varsityapex.html` etc.). No redirects were added, consistent with "take down."

## 6. Next run

- Confirm or rewrite the lede, then carry the same throughline to `ronbronson.design` (`2026-site`) and `ronbronson.com` (`bonus-time`), whose intros still read "studies the decision layer of public life" and "systems designer, writer, and professor."
- Decide whether the colophon keyword line should follow the new throughline.
- Delete the orphaned standard.site document records, or teach the sync script to prune mapping entries whose files are gone.
