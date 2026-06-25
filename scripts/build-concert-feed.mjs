import { readFile, writeFile } from 'node:fs/promises';

const EVENTS_PATH = new URL('../concerts/events.json', import.meta.url);
const CORE_ARTISTS_PATH = new URL('../concerts/core-artists.json', import.meta.url);
const VENUES_PATH = new URL('../concerts/venues.json', import.meta.url);
const CONCERTS_FEED_PATH = new URL('../concerts/shows.ics', import.meta.url);
const ROOT_FEED_PATH = new URL('../shows.ics', import.meta.url);

const env = process.env;
const lastfmUser = env.LASTFM_USER || 'statechampion';
const lastfmKey = env.LASTFM_API_KEY || '';
const recordClubUrl = env.RECORD_CLUB_URL || 'https://record.club/ron';
const discogsUser = env.DISCOGS_USER || 'quarterback';
const discogsUrl = env.DISCOGS_URL || 'https://www.discogs.com/user/quarterback/collection?header=1';
const spotifyUrl = env.SPOTIFY_URL || 'https://open.spotify.com/user/ronbronson';

const USER_AGENT = 'Mozilla/5.0 (compatible; ConcertScout/1.0; +https://concerts.your-domain.dev)';

function splitArtists(value = '') {
  return value
    .split(/\n|,|;/)
    .map((artist) => artist.trim())
    .filter(Boolean);
}

function normalize(value) {
  return value.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function uniqueArtists(artists) {
  const seen = new Set();
  const result = [];
  for (const artist of artists) {
    const key = normalize(artist);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(artist.trim());
  }
  return result;
}

// True when two normalized artist names refer to the same act. Exact match, or
// one fully contains the other with the shared token at least 5 chars long (so
// "low" / "war" style short names don't produce noise when filtering shows).
function namesMatch(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) && b.length >= 5) return true;
  if (b.includes(a) && a.length >= 5) return true;
  return false;
}

async function fetchLastfmMethod(method, params = {}) {
  if (!lastfmKey || !lastfmUser) return null;
  const url = new URL('https://ws.audioscrobbler.com/2.0/');
  url.search = new URLSearchParams({
    method,
    user: lastfmUser,
    api_key: lastfmKey,
    format: 'json',
    ...params,
  }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Last.fm ${method} request failed: ${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchLastfmArtists() {
  const [overall, year, recentTracks] = await Promise.all([
    fetchLastfmMethod('user.gettopartists', { period: 'overall', limit: '150' }),
    fetchLastfmMethod('user.gettopartists', { period: '12month', limit: '150' }),
    fetchLastfmMethod('user.getrecenttracks', { limit: '200' }),
  ]);

  return uniqueArtists([
    ...((year?.topartists?.artist || []).map((artist) => artist.name)),
    ...((overall?.topartists?.artist || []).map((artist) => artist.name)),
    ...((recentTracks?.recenttracks?.track || []).map((track) => track.artist?.['#text'])),
  ].filter(Boolean));
}

// --- Venue scrapers -------------------------------------------------------
//
// Each adapter knows how to pull one ticketing platform's public event data and
// return Concert Scout's internal event shape. Add a venue by appending to
// concerts/venues.json with a `type` that matches a key in ADAPTERS.

function splitLineup(value = '') {
  return value
    .split(/\s*(?:,|;|\/|\+|&|\bwith\b|\bw\/\b|\bfeat\.?\b|\bft\.?\b)\s*/i)
    .map((name) => name.trim())
    .filter((name) => name.length > 1);
}

// WLCR is the WordPress booking plugin used by the Mississippi Studios /
// Revolution Hall venue family. `/wp-json/wlcr/v1/events/raw` returns every
// upcoming show across that source's rooms as structured JSON.
async function scrapeWlcr(source) {
  const endpoint = `${source.url.replace(/\/$/, '')}/wp-json/wlcr/v1/events/raw`;
  const response = await fetch(endpoint, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const raw = await response.json();
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const date = (item?.start?.local || '').slice(0, 10);
      const rawName = item?.name?.text?.trim();
      if (!date || !rawName) return null;

      // Promoters prefix the act with status flags ("SOLD OUT: Pavement").
      // Lift those into tags so the artist name stays matchable and clean.
      const statusMatch = rawName.match(/^(SOLD OUT|CANCELL?ED|POSTPONED|RESCHEDULED|MOVED)\b[\s:–-]*/i);
      const artist = rawName.replace(/^(SOLD OUT|CANCELL?ED|POSTPONED|RESCHEDULED|MOVED)\b[\s:–-]*/i, '').trim() || rawName;

      const venue = item?.venue?.name || source.name;
      const support = item?.summary ? splitLineup(item.summary) : [];
      const tags = [];
      if (statusMatch) tags.push(statusMatch[1].toLowerCase());
      if (item?.venue?.age_restriction) tags.push(item.venue.age_restriction);
      if (item?.ticket_availability?.is_sold_out && !statusMatch) tags.push('sold out');

      return {
        artist,
        lineup: [artist, ...support],
        city: source.city,
        venue,
        date,
        url: item?.url || `${source.url.replace(/\/$/, '')}/events`,
        tags,
        why: `Listed at ${venue}${support.length ? ` with ${support.join(', ')}` : ''}.`,
        base: 50,
        origin: 'venue',
        sourceName: source.name,
      };
    })
    .filter(Boolean);
}

// Ticketmaster Discovery API. Covers the larger rooms and any metro the WLCR
// venues miss (most of Seattle, plus Portland venues outside that family).
// Needs a free Discovery API key in TICKETMASTER_API_KEY; without it the source
// is skipped, not fatal. A source supplies { city, stateCode }.
async function scrapeTicketmaster(source) {
  const apikey = env.TICKETMASTER_API_KEY || '';
  if (!apikey) throw new Error('no TICKETMASTER_API_KEY set — skipping');

  const horizonDays = Number(env.TICKETMASTER_HORIZON_DAYS || '180');
  const now = new Date();
  const startDateTime = `${now.toISOString().slice(0, 19)}Z`;
  const endDateTime = `${new Date(now.getTime() + horizonDays * 86400000).toISOString().slice(0, 19)}Z`;

  const events = [];
  const maxPages = 5;
  for (let page = 0; page < maxPages; page += 1) {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.search = new URLSearchParams({
      apikey,
      classificationName: 'music',
      city: source.city,
      stateCode: source.stateCode,
      size: '100',
      page: String(page),
      sort: 'date,asc',
      startDateTime,
      endDateTime,
    }).toString();

    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (response.status === 429) break; // rate limited — keep what we have
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();

    for (const item of data?._embedded?.events || []) {
      const date = item?.dates?.start?.localDate;
      if (!date) continue; // skip date-TBA shows
      const venue = item?._embedded?.venues?.[0];
      const lineup = (item?._embedded?.attractions || []).map((a) => a.name).filter(Boolean);
      const artist = lineup[0] || item.name;
      if (!artist) continue;

      const genre = item?.classifications?.[0]?.genre?.name;
      const tags = ['Ticketmaster'];
      if (genre && genre !== 'Undefined') tags.push(genre);
      if (item?.dates?.status?.code === 'cancelled') tags.push('cancelled');

      events.push({
        artist,
        lineup: lineup.length ? lineup : [artist],
        city: venue?.city?.name || source.city,
        venue: venue?.name || 'TBA',
        date,
        url: item.url || '',
        tags,
        why: `Listed on Ticketmaster at ${venue?.name || source.city}.`,
        base: 50,
        origin: 'venue',
        sourceName: source.name,
      });
    }

    if (page + 1 >= (data?.page?.totalPages ?? 1)) break;
  }
  return events;
}

const ADAPTERS = {
  wlcr: scrapeWlcr,
  ticketmaster: scrapeTicketmaster,
};

// Run every configured venue adapter, isolating failures so one dead venue
// never sinks the whole feed.
async function fetchVenueEvents() {
  let sources = [];
  try {
    sources = JSON.parse(await readFile(VENUES_PATH, 'utf8'));
  } catch {
    return { events: [], sourceCount: 0, ok: 0 };
  }

  const results = await Promise.all(
    sources.map(async (source) => {
      const adapter = ADAPTERS[source.type];
      if (!adapter) {
        console.warn(`No adapter for venue type "${source.type}" (${source.name}).`);
        return null;
      }
      try {
        const events = await adapter(source);
        console.log(`  ${source.name}: ${events.length} shows`);
        return events;
      } catch (error) {
        console.warn(`  ${source.name}: failed (${error.message})`);
        return null;
      }
    }),
  );

  const ok = results.filter((r) => r !== null);
  return {
    events: ok.flat(),
    sourceCount: sources.length,
    ok: ok.length,
  };
}

function scoreEvent(event, signals) {
  const names = [event.artist, ...(event.lineup || [])].map(normalize).filter(Boolean);
  const matched = [];
  let score = event.base || 50;

  for (const signal of signals) {
    const candidate = normalize(signal.artist);
    if (!candidate) continue;
    if (names.some((name) => namesMatch(name, candidate))) {
      score += signal.weight;
      matched.push(signal.source);
    }
  }

  if (event.city === 'Portland') score += 4;
  if ((event.tags || []).some((tag) => /small room|likely sellout/i.test(tag))) score += 6;

  return {
    ...event,
    score: Math.min(100, score),
    matchedSignals: [...new Set(matched)],
  };
}

function escapeIcs(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function toIcsDate(date) {
  return date.replaceAll('-', '');
}

function buildCalendar(events, signalCount) {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Concert Scout//Portland Seattle Show Feed//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Concert Scout — Portland + Seattle',
    `X-WR-CALDESC:${escapeIcs(`Ranked show radar for Last.fm ${lastfmUser}, record.club ${recordClubUrl}, Discogs ${discogsUser} (${discogsUrl}), Spotify ${spotifyUrl}, and ${signalCount} artist signals.`)}`,
    'X-WR-TIMEZONE:America/Los_Angeles',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
  ];

  for (const event of events) {
    const signalText = event.matchedSignals.length ? ` Matched: ${event.matchedSignals.join(', ')}.` : '';
    lines.push(
      'BEGIN:VEVENT',
      `UID:concert-scout-${normalize(event.artist).replaceAll(' ', '-')}-${toIcsDate(event.date)}@concerts.your-domain.dev`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${toIcsDate(event.date)}`,
      `SUMMARY:${escapeIcs(`${event.artist} at ${event.venue}`)}`,
      `LOCATION:${escapeIcs(`${event.venue}, ${event.city}`)}`,
      `URL:${escapeIcs(event.url)}`,
      `DESCRIPTION:${escapeIcs(`Concert Scout match ${event.score}. ${event.why}${signalText}`)}`,
      `CATEGORIES:${escapeIcs(['Concert Scout', event.city, ...(event.tags || []), ...event.matchedSignals].join(','))}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

// Collapse duplicate shows (same act, date, and venue), keeping the
// higher-scored copy and preferring hand-curated events over scraped ones.
function dedupeEvents(events) {
  const byKey = new Map();
  for (const event of events) {
    const key = `${normalize(event.artist)}|${event.date}|${normalize(event.venue)}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, event);
      continue;
    }
    const existingManual = existing.origin === 'manual';
    const eventManual = event.origin === 'manual';
    if (eventManual && !existingManual) byKey.set(key, event);
    else if (eventManual === existingManual && event.score > existing.score) byKey.set(key, event);
  }
  return [...byKey.values()];
}

const today = new Date().toISOString().slice(0, 10);

const manualEvents = JSON.parse(await readFile(EVENTS_PATH, 'utf8')).map((event) => ({
  ...event,
  origin: 'manual',
}));
const coreArtists = JSON.parse(await readFile(CORE_ARTISTS_PATH, 'utf8'));
console.log('Scraping venues:');
const [lastfmArtists, venueResult] = await Promise.all([
  fetchLastfmArtists(),
  fetchVenueEvents(),
]);
const venueEvents = venueResult.events;
const collectionArtists = uniqueArtists([
  ...splitArtists(env.CORE_ARTISTS),
  ...splitArtists(env.RECORD_CLUB_ARTISTS),
  ...splitArtists(env.DISCOGS_ARTISTS),
  ...splitArtists(env.SPOTIFY_ARTISTS),
  ...splitArtists(env.WATCHLIST_ARTISTS),
]);
const signals = [
  ...lastfmArtists.map((artist) => ({ artist, source: 'Last.fm', weight: 20 })),
  ...coreArtists.map((artist) => ({ artist, source: 'core artist list', weight: 14 })),
  ...collectionArtists.map((artist) => ({ artist, source: 'record.club/Discogs/Spotify/watchlist', weight: 16 })),
];

const scoredEvents = dedupeEvents([...manualEvents, ...venueEvents])
  .filter((event) => event.date >= today)
  .map((event) => scoreEvent(event, signals))
  // Hand-picked events always ride along; scraped shows only make the cut when
  // they match an artist you actually track.
  .filter((event) => event.origin === 'manual' || event.matchedSignals.length > 0)
  .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));

const calendar = buildCalendar(scoredEvents, uniqueArtists(signals.map((signal) => signal.artist)).length);

await writeFile(CONCERTS_FEED_PATH, calendar);
await writeFile(ROOT_FEED_PATH, calendar);

const venueMatches = scoredEvents.filter((event) => event.origin === 'venue').length;
console.log(`Built ${scoredEvents.length} calendar events for ${lastfmUser}.`);
console.log(`Last.fm artists loaded: ${lastfmArtists.length}. Core artists loaded: ${coreArtists.length}. Extra collection/watchlist artists loaded: ${collectionArtists.length}.`);
console.log(`Venues: ${venueResult.ok}/${venueResult.sourceCount} sources scraped ${venueEvents.length} upcoming shows, ${venueMatches} matched your artists.`);
