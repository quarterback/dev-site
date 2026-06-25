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

Do not commit the Last.fm API key. Store it in your deploy provider as:

```text
LASTFM_API_KEY=...
LASTFM_USER=statechampion
RECORD_CLUB_URL=https://record.club/ron
```

A scheduled scraper can use those environment variables to regenerate both `concerts/shows.ics` and the root `shows.ics` copy from venue events plus listening and collection signals.
