# Concert Scout deployment notes

This repo can keep deploying from the main/root directory. Point the concerts subdomain at the same deploy; the root `index.html` redirects `concerts.*` traffic to `/concerts/`.

```text
https://concerts.your-domain.dev/        -> redirects to /concerts/
https://concerts.your-domain.dev/shows.ics -> root calendar feed copy
```

## Calendar feed

Subscribe calendar apps to the stable feed URL:

```text
https://concerts.your-domain.dev/shows.ics
```

Fantastical also accepts the same URL as a `webcal://` subscription:

```text
webcal://concerts.your-domain.dev/shows.ics
```

Google Calendar: **Settings → Add calendar → From URL**, then paste the HTTPS feed URL.

## How the feed is built

`scripts/build-concert-feed.mjs` does the real work, in three stages:

1. **Scrape** upcoming shows from the venues listed in `concerts/venues.json`.
2. **Match** every scraped show against the artists you track (Last.fm history,
   `concerts/core-artists.json`, and the collection/watchlist env vars below).
3. **Rank** the matches, merge in the hand-picked shows from
   `concerts/events.json`, and write `concerts/shows.ics` + the root `shows.ics`.

Only scraped shows that match an artist you track land in the calendar, so the
feed stays personal. Hand-picked `events.json` entries always appear.

### Venue scraping (`concerts/venues.json`)

No API key is required — scraping reads each venue's public event data. Each
entry has a `type` that maps to an adapter in the script:

```json
[
  { "type": "wlcr", "name": "Mississippi Studios / Polaris Hall", "url": "https://www.mississippistudios.com", "city": "Portland" },
  { "type": "wlcr", "name": "Revolution Hall / Show Bar", "url": "https://www.revolutionhall.com", "city": "Portland" }
]
```

- `wlcr` — the WordPress booking plugin (`/wp-json/wlcr/v1/events/raw`) used by
  the Mississippi Studios / Revolution Hall venue family. One source covers all
  of that family's rooms.

To add a venue on the same platform, append another `wlcr` entry. Venues on
other platforms (e.g. Showbox runs on AXS, Neumos on a different system) need a
new adapter added to the `ADAPTERS` map in the script — one function per
platform, returning the same event shape.

A failed or unreachable venue is logged and skipped; it never breaks the feed.

## Last.fm API key

Do not commit the Last.fm API key or collection exports. Store them as GitHub Actions or deploy-provider secrets/env vars:

```text
LASTFM_API_KEY=...
LASTFM_USER=statechampion
RECORD_CLUB_URL=https://record.club/ron
DISCOGS_USER=quarterback
DISCOGS_URL=https://www.discogs.com/user/quarterback/collection?header=1
SPOTIFY_URL=https://open.spotify.com/user/ronbronson
CORE_ARTISTS=optional extra artist one,optional extra artist two
RECORD_CLUB_ARTISTS=artist one,artist two
DISCOGS_ARTISTS=artist three,artist four
SPOTIFY_ARTISTS=artist five,artist six
WATCHLIST_ARTISTS=must see artist
```

The artist signals above are optional and only affect *which* scraped shows
match you and how they rank — the venue scraping itself needs no keys. The
Last.fm key is the highest-value one to set, since it auto-matches shows against
what you actually listen to.

The included GitHub Actions workflow (`.github/workflows/concert-scout.yml`) runs every six hours and can also be started manually. It scrapes the venues, rebuilds the feed, and commits updated feed files when the show list changes.

Run the feed builder locally to regenerate both `concerts/shows.ics` and the root `shows.ics` copy:

```bash
node scripts/build-concert-feed.mjs
```

It prints how many shows each venue returned and how many matched your artists.
With `LASTFM_API_KEY` set, the script also pulls your real Last.fm history
(`statechampion` by default) as match signals. The static `index.html` page can
preview/sort demo data locally, but it cannot rewrite the subscribed calendar
feed from your browser; edit `concerts/venues.json` / `concerts/core-artists.json`
or update GitHub Secrets, then run the workflow/feed builder. Until record.club,
Discogs, and Spotify scrapers are added, paste collection artists into
`RECORD_CLUB_ARTISTS`, `DISCOGS_ARTISTS`, `SPOTIFY_ARTISTS`, `CORE_ARTISTS`, or
`WATCHLIST_ARTISTS`.
