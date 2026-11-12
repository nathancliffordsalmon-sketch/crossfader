// Song facts — runs in the main process.
// Sources (free, no key): MusicBrainz for the original release year and the artist's proper
// name, Wikipedia for artist / song summaries and for news and music events from that year.
'use strict';

/* ---------------- title parsing ---------------- */
const NOISE = /(radio edit|original mix|album version|single version|extended mix|remaster|official|video|audio|lyric|lyrics|visuali[sz]er|\bhd\b|\bhq\b|\b4k\b|remaster|\blive\b|explicit|\bclean\b|version|\bmv\b|m\/v|full song|with lyrics|letra|subtitulad|color coded|performance|from the|soundtrack|ost\b)/i;

function stripNoise(s) {
  return s
    .replace(/[\(\[\{【][^\)\]\}】]*[\)\]\}】]/g, (m) => (NOISE.test(m) || /feat|ft\.|prod/i.test(m) ? ' ' : m))
    .replace(/\s+\|\s+.*$/, '')                        // "Song | Channel extras"
    .replace(/\b(official\s+)?(music\s+)?(video|audio|lyric video|visuali[sz]er)\s*$/i, '')
    .replace(/\s+(feat\.?|ft\.?|featuring)\s+.*$/i, '')  // drop featured artists from the song
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanChannel(c) {
  c = (c || '').replace(/\s*-\s*Topic$/i, '').replace(/\s*(official|music|records|tv)\s*$/i, '').trim();
  if (/VEVO$/i.test(c)) c = c.replace(/VEVO$/i, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  return c;
}

// Remix / cover / edit / live markers, e.g. "(Kygo Remix)", "[Cover]", " - Purple Disco Machine Remix".
const VARIANT = /\b(re-?mix|mix|edit|re-?edit|rework|bootleg|refix|flip|vip|cover|live|acoustic|unplugged|version|mashup|extended|club mix|dub)\b/i;
function detectVariant(raw) {
  const tag = (txt) => {
    const t = txt.trim();
    if (!VARIANT.test(t) || /official|lyric|video|audio|visuali[sz]er|radio edit|original mix|album version|single version/i.test(t)) return null;
    const kind = /cover/i.test(t) ? 'cover' : /live|unplugged/i.test(t) ? 'live' : /acoustic/i.test(t) ? 'acoustic version'
      : /mashup/i.test(t) ? 'mashup' : /edit|rework|bootleg|refix|flip/i.test(t) ? 're-edit' : 'remix';
    const by = t.replace(/\b(re-?mix|mix|edit|re-?edit|rework|bootleg|refix|flip|vip|cover|version|extended|club|dub|by|live( at| from| in)?.*|acoustic|unplugged)\b/ig, '')
      .replace(/[^\p{L}\p{N}&.'’ -]/gu, '').replace(/\s{2,}/g, ' ').trim();
    return { kind, by: kind === 'live' ? '' : by, where: kind === 'live' ? (t.match(/live (?:at|from|in) (.+)/i) || [])[1] || '' : '' };
  };
  for (const m of raw.matchAll(/[\(\[\{]([^\)\]\}]+)[\)\]\}]/g)) { const v = tag(m[1]); if (v) return v; }
  const parts = raw.split(/\s+[-–—|]\s+/);
  if (parts.length >= 3) { const v = tag(parts[parts.length - 1]); if (v) return v; }
  const coverBy = raw.match(/\bcover(?:ed)? by ([^()\[\]|]+)/i);
  if (coverBy) return { kind: 'cover', by: coverBy[1].trim(), where: '' };
  return null;
}

function parseVideoTitle(title, channel) {
  let raw = (title || '').trim();
  const variant = detectVariant(raw);
  if (variant) {
    // remove the variant tag so the original song name is left
    raw = raw.replace(/[\(\[\{]([^\)\]\}]+)[\)\]\}]/g, (m, inner) => (VARIANT.test(inner) && !/official|lyric|video|audio/i.test(inner) ? ' ' : m));
    const parts = raw.split(/\s+[-–—|]\s+/);
    if (parts.length >= 3 && VARIANT.test(parts[parts.length - 1])) raw = parts.slice(0, -1).join(' - ');
    raw = raw.replace(/\bcover(?:ed)? by [^()\[\]|]+/i, '').trim();
  }
  const r = parseVideoTitleBasic(raw, channel);
  if (variant) r.variant = variant;
  return r;
}

function parseVideoTitleBasic(title, channel) {
  const raw = (title || '').trim();
  let artist = '', song = '';
  const quoted = raw.match(/^(.+?)\s+["“](.+?)["”]/);
  const t = stripNoise(raw);
  const parts = t.split(/\s+[-–—~]\s+|\s+[-–—]\s*|\s*[-–—]\s+/);
  if (parts.length >= 2) {
    artist = parts[0]; song = parts.slice(1).join(' - ');
  } else if (quoted) {
    artist = quoted[1]; song = quoted[2];
  } else {
    song = t; artist = cleanChannel(channel);
  }
  song = stripNoise(song).replace(/^["“]|["”]$/g, '').trim();
  artist = artist.replace(/\s+(feat\.?|ft\.?|featuring)\s+.*$/i, '').replace(/^["“]|["”]$/g, '').trim();
  return { artist, song };
}

/* ---------------- text helpers ---------------- */
const norm = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();

function sentences(text) {
  if (!text) return [];
  const protectedText = text
    .replace(/\s*\([^()]*\)/g, '')                       // drop parentheticals (pronunciations, birth dates)
    .replace(/\b(Mr|Mrs|Ms|Dr|St|Jr|Sr|vs|No|Vol|feat|ft|Bros|Inc|Ltd|Co)\./g, '$1<DOT>')
    .replace(/\b([A-Z])\.(?=[A-Z]\.)/g, '$1<DOT>').replace(/\b([A-Z])\.(?=\s[A-Z][a-z])/g, '$1<DOT>');
  return protectedText.split(/(?<=[.!?])\s+(?=["“A-Z0-9])/)
    .map((s) => s.replace(/<DOT>/g, '.').replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 25 && /^[\w"“'‘]/.test(s));
}

// Pack sentences into card-sized chunks (≤ 230 chars).
function chunk(sents, max = 230, limit = 3) {
  const out = []; let cur = '';
  for (const s of sents) {
    if (s.length > 320) continue;
    if (cur && (cur + ' ' + s).length > max) { out.push(cur); cur = ''; if (out.length >= limit) break; }
    cur = cur ? `${cur} ${s}` : s;
  }
  if (cur && out.length < limit) out.push(cur);
  return out;
}

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
// Pull dated events out of a Wikipedia year article's plain text ("== Events ==" section).
function parseYearEvents(text) {
  if (!text) return [];
  const start = text.search(/^==\s*Events\s*==\s*$/m);
  if (start < 0) return [];
  const rest = text.slice(start).split('\n').slice(1);
  const out = []; let date = null;
  const dateOnly = new RegExp(`^(${MONTHS}) \\d{1,2}(\\s*[–-]\\s*(${MONTHS} )?\\d{1,2})?$`);
  const dated = new RegExp(`^((?:${MONTHS}) \\d{1,2}(?:\\s*[–-]\\s*(?:(?:${MONTHS}) )?\\d{1,2})?)\\s*[–—-]\\s*(.+)$`);
  for (let line of rest) {
    line = line.trim();
    if (/^==[^=]/.test(line)) break;                     // next top-level section (Births…)
    if (!line || /^===/.test(line)) { if (/^===/.test(line)) date = null; continue; }
    if (dateOnly.test(line)) { date = line; continue; }
    const m = line.match(dated);
    let ev = null;
    if (m) { ev = { date: m[1], text: m[2] }; date = null; }
    else if (date && /^[A-Z"“]/.test(line)) ev = { date, text: line };
    if (ev) {
      ev.text = ev.text.replace(/\s*\([^()]*\)/g, '').replace(/\s+/g, ' ').trim();
      if (ev.text.length >= 35 && ev.text.length <= 260) out.push(ev);
    }
  }
  return out;
}

// Tracklist from a mix video's description: "0:00 Artist - Song" or "1. Artist - Song (3:45)".
function parseTracklist(desc) {
  if (!desc) return [];
  const TS = '((?:\\d{1,2}:)?\\d{1,2}:\\d{2})';
  const first = new RegExp(`^\\s*(?:\\d{1,3}[.)]\\s*)?[\\[(]?${TS}[\\])]?\\s*(?:[-–—|:.]\\s*)?(.+?)\\s*$`);
  const last = new RegExp(`^\\s*(?:\\d{1,3}[.)]\\s*)?(.+?)\\s*[-–—|]?\\s*[\\[(]?${TS}[\\])]?\\s*$`);
  const secs = (ts) => ts.split(':').reduce((a, v) => a * 60 + +v, 0);
  const lines = desc.split(/\r?\n/);
  const tryFmt = (re, tsIdx, txtIdx) => {
    const out = [];
    for (const l of lines) { const m = l.match(re); if (m && /[A-Za-z]/.test(m[txtIdx])) out.push({ t: secs(m[tsIdx]), text: m[txtIdx].replace(/^[-–—|:.\s]+|[-–—|:.\s]+$/g, '') }); }
    return out;
  };
  let a = tryFmt(first, 1, 2), b = tryFmt(last, 2, 1);
  let list = a.length >= b.length ? a : b;
  // keep the longest strictly increasing run
  const keep = []; for (const e of list) if (!keep.length || e.t > keep[keep.length - 1].t) keep.push(e);
  if (keep.length < 3) return [];
  return keep.map((e) => { const p = parseVideoTitle(e.text, ''); return { t: e.t, text: e.text, artist: p.artist, song: p.song }; });
}

function pick(arr, n) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}

/* ---------------- lookups ---------------- */
const MUSICIAN = /\b(band|singer|rapper|musician|group|duo|trio|dj|songwriter|vocalist|producer|composer|guitarist|artist|record producer|boy band|girl group|entertainer|performer|pianist|drummer)\b/i;
const SONGISH = /\b(song|single)\b/i;
const YEAR_RE = /\b(19[2-9]\d|20[0-3]\d)\b/;

function createFacts({ fetchJSON, now = () => Date.now() }) {
  let mbNext = 0; // MusicBrainz allows ~1 request per second
  async function mb(url) {
    const wait = mbNext - now(); mbNext = Math.max(now(), mbNext) + 1100;
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    return fetchJSON(url);
  }
  const WP = 'https://en.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&';

  async function releaseInfo(artist, song, { exact = false } = {}) {
    if (!song) return {};
    const q = artist ? `recording:"${song}" AND artist:"${artist}"` : `recording:"${song}"`;
    try {
      const d = await mb(`https://musicbrainz.org/ws/2/recording?fmt=json&limit=50&query=${encodeURIComponent(q)}`);
      const want = norm(song);
      const recs = (d.recordings || []).filter((r) => r.score >= (artist ? 80 : 95) &&
        (norm(r.title) === want || (!exact && norm(r.title).startsWith(want + ' '))));
      if (!recs.length) return {};
      const yr = (r) => +(String(r['first-release-date'] || '').slice(0, 4)) || 9999;
      if (!artist) {
        // Title-only search (remix/cover posted under another name): the earliest release is the original.
        recs.sort((x, y) => yr(x) - yr(y));
        const r0 = recs[0], c0 = r0['artist-credit'] && r0['artist-credit'][0];
        return yr(r0) < 9999 ? { year: yr(r0), artist: c0 ? c0.name : null, title: r0.title } : {};
      }
      const years = recs.map(yr).filter((y) => y < 9999);
      const credit = recs[0]['artist-credit'] && recs[0]['artist-credit'][0];
      return { year: years.length ? Math.min(...years) : null, artist: credit ? credit.name : null, title: recs[0].title };
    } catch { return {}; }
  }

  async function wikiSearch(query, n = 6) {
    const d = await fetchJSON(`${WP}action=query&generator=search&gsrlimit=${n}&gsrsearch=${encodeURIComponent(query)}` +
      '&prop=description|extracts|info&exintro=1&explaintext=1&exlimit=20&inprop=url&redirects=1');
    return ((d.query && d.query.pages) || []).sort((a, b) => (a.index || 0) - (b.index || 0));
  }

  async function artistPage(artist) {
    if (!artist) return null;
    try {
      const pages = await wikiSearch(`${artist} musician OR band OR singer`);
      const a = norm(artist);
      return pages.find((p) => MUSICIAN.test(p.description || '') && (norm(p.title).startsWith(a) || a.startsWith(norm(p.title).replace(/ band| singer| musician| rapper/g, '')))) || null;
    } catch { return null; }
  }

  async function songPage(artist, song) {
    if (!song) return null;
    try {
      const pages = await wikiSearch(`"${song}" ${artist} song`);
      const s = norm(song), firstArtistWord = norm(artist).split(' ')[0] || '';
      return pages.find((p) => {
        const t = norm(p.title.replace(/\s*\((.*?song|single|.*?album)\)$/i, ''));
        const about = `${p.description || ''} ${p.extract || ''}`;
        return t === s && SONGISH.test(p.description || p.extract || '') && (!firstArtistWord || norm(about).includes(firstArtistWord));
      }) || null;
    } catch { return null; }
  }

  const yearCache = new Map();
  async function yearEvents(title) {
    if (yearCache.has(title)) return yearCache.get(title);
    let ev = [];
    try {
      const d = await fetchJSON(`${WP}action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(title)}`);
      const p = d.query && d.query.pages && d.query.pages[0];
      ev = parseYearEvents(p && p.extract);
    } catch {}
    yearCache.set(title, ev);
    return ev;
  }

  // Main entry: video title + channel → { artist, song, year, facts: [{kind, label, text, source}] }
  async function lookup({ title, channel }) {
    const parsed = parseVideoTitle(title, channel);
    const v = parsed.variant;
    // Covers, and remixes that don't name the remixer, are usually posted under the cover artist's /
    // remixer's own name, so look the original up by title (earliest release wins).
    const byTitle = v && (v.kind === 'cover' || ((v.kind === 'remix' || v.kind === 're-edit') && !v.by));
    let rel = byTitle ? {} : await releaseInfo(parsed.artist, parsed.song, { exact: !!v });
    if (!rel.year && !byTitle && parsed.artist) {
      // "Song - Artist" titles: try it the other way round.
      const swapped = await releaseInfo(parsed.song, parsed.artist, { exact: !!v });
      if (swapped.year) { rel = swapped; [parsed.artist, parsed.song] = [parsed.song, parsed.artist]; }
    }
    if (v && !rel.year && (v.kind === 'remix' || v.kind === 're-edit' || v.kind === 'cover')) {
      const orig = await releaseInfo('', parsed.song, { exact: true });
      if (orig.artist) {
        if (!v.by && norm(orig.artist) !== norm(parsed.artist)) v.by = parsed.artist;
        rel = orig;
      }
    }
    const artist = rel.artist || parsed.artist;
    const song = rel.title || parsed.song;
    const [ap, sp] = await Promise.all([artistPage(artist), songPage(artist, song)]);

    // The song article's short description ("1982 single by Toto") is the most reliable year.
    let year = null;
    const dy = sp && (sp.description || '').match(YEAR_RE);
    if (dy) year = +dy[1];
    else if (rel.year) year = rel.year;
    else if (sp) { const m = (sp.extract || '').match(new RegExp(`released[^.]*?${YEAR_RE.source}`, 'i')); if (m) year = +m[1]; }

    const groups = { song: [], artist: [], news: [], music: [] };
    if (sp) groups.song = chunk(sentences(sp.extract)).map((text) => ({ kind: 'song', label: `About “${song}”`, text, source: sp.fullurl }));
    if (ap) groups.artist = chunk(sentences(ap.extract)).map((text) => ({ kind: 'artist', label: `About ${ap.title.replace(/\s*\(.*\)$/, '')}`, text, source: ap.fullurl }));
    if (year) {
      const [news, music] = await Promise.all([yearEvents(String(year)), yearEvents(`${year} in music`)]);
      groups.news = pick(news, 3).map((e) => ({ kind: 'news', label: `In the news · ${year}`, text: `${e.date} – ${e.text}`, source: `https://en.wikipedia.org/wiki/${year}` }));
      groups.music = pick(music, 2).map((e) => ({ kind: 'music', label: `In music · ${year}`, text: `${e.date} – ${e.text}`, source: `https://en.wikipedia.org/wiki/${year}_in_music` }));
    }
    // Interleave: song, artist, news, music, song, artist, …
    const facts = [];
    if (v) {
      const sameAsArtist = v.by && norm(v.by) === norm(artist);
      const by = v.by && !sameAsArtist ? ` by ${v.by}` : '';
      const orig = `“${song}”, originally by ${artist}${year ? ` (${year})` : ''}`;
      const text = v.kind === 'live' ? `This is a live performance${v.where ? ` at ${v.where}` : ''} of ${orig}.`
        : v.kind === 'acoustic version' ? `This is an acoustic version of ${orig}.`
        : `This is a ${v.kind}${by} of ${orig}.`;
      facts.push({ kind: 'song', label: 'About this version', text, source: sp ? sp.fullurl : null });
    }
    for (let i = 0; i < 3; i++) for (const k of ['song', 'artist', 'news', 'music']) if (groups[k][i]) facts.push(groups[k][i]);
    return { artist, song, year, facts, variant: v || null };
  }

  return { lookup };
}

module.exports = { createFacts, parseVideoTitle, parseTracklist, parseYearEvents, sentences, chunk };
