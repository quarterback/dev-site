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

The included GitHub Actions workflow (`.github/workflows/concert-scout.yml`) runs every six hours and can also be started manually. It uses these secrets and commits updated feed files when scores or events change.

Run the feed builder locally to regenerate both `concerts/shows.ics` and the root `shows.ics` copy from `concerts/events.json`, Last.fm top/recent artists, `concerts/core-artists.json`, and record.club/Discogs/Spotify/watchlist artist signals:

```bash
node scripts/build-concert-feed.mjs
```

With `LASTFM_API_KEY` set, the script uses the real Last.fm account (`statechampion` by default) as the starting point. The static page can preview/sort locally, but it cannot rewrite the subscribed calendar feed from your browser; update GitHub Secrets or `concerts/core-artists.json`, then run the workflow/feed builder. Until record.club, Discogs, and Spotify scrapers are added, paste collection artists into `RECORD_CLUB_ARTISTS`, `DISCOGS_ARTISTS`, `SPOTIFY_ARTISTS`, `CORE_ARTISTS`, or `WATCHLIST_ARTISTS`.
