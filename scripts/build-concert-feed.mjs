import { readFile, writeFile } from 'node:fs/promises';

const EVENTS_PATH = new URL('../concerts/events.json', import.meta.url);
const CORE_ARTISTS_PATH = new URL('../concerts/core-artists.json', import.meta.url);
const CONCERTS_FEED_PATH = new URL('../concerts/shows.ics', import.meta.url);
const ROOT_FEED_PATH = new URL('../shows.ics', import.meta.url);

const env = process.env;
const lastfmUser = env.LASTFM_USER || 'statechampion';
const lastfmKey = env.LASTFM_API_KEY || '';
const recordClubUrl = env.RECORD_CLUB_URL || 'https://record.club/ron';
const discogsUser = env.DISCOGS_USER || 'quarterback';
const discogsUrl = env.DISCOGS_URL || 'https://www.discogs.com/user/quarterback/collection?header=1';
const spotifyUrl = env.SPOTIFY_URL || 'https://open.spotify.com/user/ronbronson';

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

function scoreEvent(event, signals) {
  const artist = normalize(event.artist);
  const matched = [];
  let score = event.base || 50;

  for (const signal of signals) {
    const candidate = normalize(signal.artist);
    if (!candidate) continue;
    if (artist === candidate || artist.includes(candidate) || candidate.includes(artist)) {
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

const events = JSON.parse(await readFile(EVENTS_PATH, 'utf8'));
const coreArtists = JSON.parse(await readFile(CORE_ARTISTS_PATH, 'utf8'));
const lastfmArtists = await fetchLastfmArtists();
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
const scoredEvents = events
  .map((event) => scoreEvent(event, signals))
  .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
const calendar = buildCalendar(scoredEvents, uniqueArtists(signals.map((signal) => signal.artist)).length);

await writeFile(CONCERTS_FEED_PATH, calendar);
await writeFile(ROOT_FEED_PATH, calendar);

console.log(`Built ${scoredEvents.length} calendar events for ${lastfmUser}.`);
console.log(`Last.fm artists loaded: ${lastfmArtists.length}. Core artists loaded: ${coreArtists.length}. Extra collection/watchlist artists loaded: ${collectionArtists.length}.`);
