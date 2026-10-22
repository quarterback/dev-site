# AAR — remove Concert Scout from ronbronson.dev

- **Date:** 2026-10-22
- **Branch:** `claude/remove-concert-scout`
- **Trace:** this session's own transcript. No separate agent trace was available to reconcile against.

## 1. The ask

> kill off the concert scout on dev-site i don't need it anymore

## 2. What changed

- Deleted the Concert Scout app and its data: `concerts/` (`index.html`, `README.md`, `venues.json`, `core-artists.json`, `events.json`, `shows.ics`).
- Deleted the root calendar feed `shows.ics` and its builder `scripts/build-concert-feed.mjs`.
- Deleted `.github/workflows/concert-scout.yml`, which rebuilt the feed every six hours and committed "Update Concert Scout feed" to `main`.
- Removed the inline script in `index.html` that redirected the `concerts.*` subdomain to `/concerts/`.

## 3. Judgment calls made without asking

- **Everything went, data included.** "Kill off" read as remove the feature entirely; the venue, artist and event lists are recoverable from git history.
- **The subdomain redirect went with it.** With `/concerts/` gone it could only send visitors to a 404.

## 4. Deviations

- None from the ask.

## 5. Risks

- Anyone subscribed to `shows.ics` (calendar apps) will get a 404 instead of updates.
- Left for Ron, outside the repo: the `concerts.*` domain in Vercel/DNS, and the repo secrets only this workflow used (`TICKETMASTER_API_KEY`, `RECORD_CLUB_URL`, `RECORD_CLUB_ARTISTS`, `DISCOGS_USER`, `DISCOGS_URL`, `DISCOGS_ARTISTS`, `SPOTIFY_URL`, `SPOTIFY_ARTISTS`, `CORE_ARTISTS`, `WATCHLIST_ARTISTS`; `LASTFM_*` too, if nothing else uses them).

## 6. Change for next time

- Nothing; the feature was self-contained and nothing else referenced it.
