import { readFile, writeFile } from 'node:fs/promises';

const EVENTS_PATH = new URL('../concerts/events.json', import.meta.url);
const VENUES_PATH = new URL('../concerts/venues.json', import.meta.url);
const CONCERTS_FEED_PATH = new URL('../concerts/shows.ics', import.meta.url);
const ROOT_FEED_PATH = new URL('../shows.ics', import.meta.url);

const env = process.env;
const USER_AGENT = 'Mozilla/5.0 (compatible; ConcertScout/1.0; +https://concerts.your-domain.dev)';

function normalize(value) {
  return String(value).toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

// --- Venue scrapers -------------------------------------------------------
//
// Each adapter pulls one ticketing platform's public event data and returns the
// internal event shape { artist, venue, city, date, url, tags, support }.
// Add a venue by appending to concerts/venues.json with a `type` that matches a
// key in ADAPTERS. An optional `venues` array on a source narrows a metro-wide
// feed (like Ticketmaster) to just the rooms you care about.

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
      // Lift those into tags so the artist name stays clean.
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
        support,
        venue,
        city: source.city,
        date,
        url: item?.url || `${source.url.replace(/\/$/, '')}/events`,
        tags,
        origin: 'venue',
      };
    })
    .filter(Boolean);
}

// Ticketmaster Discovery API. Pulls a metro's music events; pair it with a
// `venues` allowlist on the source to keep only the small rooms you want.
// Needs a free Discovery API key in TICKETMASTER_API_KEY; without it the source
// is skipped, not fatal.
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

      const tags = [];
      if (item?.dates?.status?.code === 'cancelled') tags.push('cancelled');

      events.push({
        artist,
        support: lineup.slice(1),
        venue: venue?.name || 'TBA',
        city: venue?.city?.name || source.city,
        date,
        url: item.url || '',
        tags,
        origin: 'venue',
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

// Narrow a source's events to a `venues` allowlist (substring match on venue
// name). No allowlist means keep everything the adapter returned.
function applyVenueAllowlist(events, source) {
  if (!Array.isArray(source.venues) || source.venues.length === 0) return events;
  const wanted = source.venues.map(normalize);
  return events.filter((event) => {
    const v = normalize(event.venue);
    return wanted.some((w) => v.includes(w) || w.includes(v));
  });
}

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
        const events = applyVenueAllowlist(await adapter(source), source);
        console.log(`  ${source.name}: ${events.length} shows`);
        return events;
      } catch (error) {
        console.warn(`  ${source.name}: failed (${error.message})`);
        return null;
      }
    }),
  );

  const ok = results.filter((r) => r !== null);
  return { events: ok.flat(), sourceCount: sources.length, ok: ok.length };
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

function buildCalendar(events) {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Concert Scout//Portland Seattle Show Feed//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Concert Scout — Portland + Seattle',
    'X-WR-CALDESC:Every upcoming show at the tracked Portland and Seattle venues, by date.',
    'X-WR-TIMEZONE:America/Los_Angeles',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
  ];

  for (const event of events) {
    const support = event.support?.length ? `With ${event.support.join(', ')}. ` : '';
    const status = event.tags?.length ? `${event.tags.join(', ')}. ` : '';
    const tickets = event.url ? `Tickets: ${event.url}` : '';
    const description = `${support}${status}${tickets}`.trim();
    lines.push(
      'BEGIN:VEVENT',
      `UID:concert-scout-${normalize(event.artist).replaceAll(' ', '-')}-${toIcsDate(event.date)}-${normalize(event.venue).replaceAll(' ', '-')}@concerts.your-domain.dev`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${toIcsDate(event.date)}`,
      `SUMMARY:${escapeIcs(`${event.artist} at ${event.venue}`)}`,
      `LOCATION:${escapeIcs(`${event.venue}, ${event.city}`)}`,
      `URL:${escapeIcs(event.url)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      `CATEGORIES:${escapeIcs(['Concert Scout', event.city, event.venue, ...(event.tags || [])].join(','))}`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

// Collapse duplicate shows (same act, date, and venue), preferring hand-curated
// entries and otherwise whichever copy has a ticket link.
function dedupeEvents(events) {
  const byKey = new Map();
  for (const event of events) {
    const key = `${normalize(event.artist)}|${event.date}|${normalize(event.venue)}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, event);
      continue;
    }
    if (event.origin === 'manual' && existing.origin !== 'manual') byKey.set(key, event);
    else if (existing.origin === event.origin && !existing.url && event.url) byKey.set(key, event);
  }
  return [...byKey.values()];
}

const today = new Date().toISOString().slice(0, 10);

const manualEvents = JSON.parse(await readFile(EVENTS_PATH, 'utf8')).map((event) => ({
  artist: event.artist,
  support: event.lineup?.slice(1) || [],
  venue: event.venue,
  city: event.city,
  date: event.date,
  url: event.url || '',
  tags: event.tags || [],
  origin: 'manual',
}));

console.log('Scraping venues:');
const venueResult = await fetchVenueEvents();

const events = dedupeEvents([...manualEvents, ...venueResult.events])
  .filter((event) => event.date && event.date >= today)
  .sort((a, b) => a.date.localeCompare(b.date) || a.artist.localeCompare(b.artist));

const calendar = buildCalendar(events);
await writeFile(CONCERTS_FEED_PATH, calendar);
await writeFile(ROOT_FEED_PATH, calendar);

console.log(`Venues: ${venueResult.ok}/${venueResult.sourceCount} sources scraped ${venueResult.events.length} shows.`);
console.log(`Built ${events.length} upcoming shows in the calendar feed.`);
