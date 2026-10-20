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

---

## Follow-up run (same day): founder corrections

### The ask

> Remove the working vocabulary from that page, it's a giant mess and I think was keyword stuffing in ways I do not want. Get rid of any old records. Old links should not 404 but should be redirected, I should not have to ask! A Parliament of Neighbors can live on the /think page (thinkingweapons.com). The new blurb is awful, I will replace that. This page is now just for side projects.

### What changed

- **Colophon "Working vocabulary" line removed**, along with its CSS.
- **Lede restored** to the founder's original line ("A compendium of my wide-ranging hobby projects…"). The founder will write the replacement. Title and descriptions now say "Side Projects" and reuse that original line, with no new positioning.
- **Redirects for every removed page:** permanent redirects in a new `vercel.json`, covering both `.html` and clean URLs, plus noindex meta-refresh stubs (the `about.html` pattern) for any other host:
  - `/projects/varsityapex.html` → `/`
  - `/projects/finnish-baseball-game-design.html` → `https://ronbronson.design/talks.html` (the talk is listed there)
  - `/projects/parliament-of-neighbors.html` → `https://thinkingweapons.com/#parliament-of-neighbors`
- **Old standard.site records:** `scripts/sync-standard.mjs` now deletes document records for pages that are no longer published and drops them from `standard-mapping.json`. The stubs are excluded in `standard.config.json`, so the next sync on `main` deletes four records: the three removed pages and the stale `about.html` one. The dry run confirmed those four.
- **Thinking Weapons (`quarterback/think`):** a patch is ready that adds the `#parliament-of-neighbors` anchor and points the entry's link at the documentation video instead of the deleted dev page. It was **not pushed**: adding that repo to the session was denied by a permission check.

### Correction to the first record

The first run's "Deviations: none" was wrong. Deleting pages without redirects was a miss: taking a page down means redirecting its URL, not leaving a 404. The rewritten blurb also introduced positioning the founder hadn't written.

### Founder direction: the four sites

Recorded so later runs don't re-derive it. This is framing direction, not copy:

1. **ronbronson.dev:** product, delivery and development; the tinkering and the side projects. The founder will decide the framing.
2. **ronbronson.design:** services, HCI/d and strategy; the experience.
3. **Masthead (ronbronson.com):** the professional and academic persona. Leadership credentials and teaching sit together (professor of practice).
4. **Thinking Weapons:** critical designer and theory.

The through-line to keep in view: a non-linear career, but more than a decade of significant work across sectors and domains. The sites should (1) let people who don't know find out that it happened, and (2) explain the through-line where it makes sense. There's currently a gap between what the sites say and what turns up in a search for the founder's name.
