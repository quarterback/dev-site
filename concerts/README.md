# Concert Scout deployment notes

This directory is intended to be published as the root of a subdomain, for example:

```text
https://concerts.your-domain.dev/
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

A scheduled scraper can use those environment variables to regenerate `shows.ics` from venue events plus listening and collection signals.
