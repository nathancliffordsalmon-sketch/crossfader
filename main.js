// Playlist Crossfader — Electron main process
const { app, BrowserWindow, ipcMain, screen, net, session, powerSaveBlocker, shell, desktopCapturer, webFrameMain } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Let videos start with sound without a click, and keep playing when the window isn't focused.
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
// Edition: "full" (personal) or "public" (follows YouTube's developer policies — no changes to the
// player, no audio processing of YouTube content, no page scraping, no in-app Google sign-in).
let EDITION = { edition: 'full' };
try { EDITION = { ...EDITION, ...JSON.parse(fs.readFileSync(path.join(__dirname, 'app', 'edition.json'), 'utf8')) }; } catch {}
const PUBLIC = EDITION.edition === 'public';
// The personal edition keeps its original settings folder so saved settings and the sign-in carry over.
app.setPath('userData', path.join(app.getPath('appData'), PUBLIC ? "Like The Fish's Crossfader" : 'Playlist Crossfader'));
const APP_TITLE = EDITION.productName || "Like The Fish's Crossfader";

const APP_DIR = path.join(__dirname, 'app');
const PREFERRED_PORT = 47811; // fixed so the page origin stays stable between runs
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon'
};

let win = null;
let blockerId = null;

// YouTube embeds refuse to play from file:// pages (no referrer), so serve the UI over localhost.
function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.normalize(path.join(APP_DIR, urlPath));
    if (!filePath.startsWith(APP_DIR)) { res.writeHead(403); return res.end(); }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.once('error', () => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
    server.listen(PREFERRED_PORT, '127.0.0.1', () => resolve(server.address().port));
  });
}

// ---------- inside each YouTube player frame ----------
// 1) Hide YouTube's own player icons (centre play/pause, title bar, logo, end cards) —
//    the app has its own controls. Ad elements are left alone.
// 2) Tell the app when an ad is showing, so it lets the ad play instead of treating the
//    video as stuck.
const YT_FRAME_CSS = `
.ytp-large-play-button, .ytp-bezel, .ytp-bezel-text-wrapper, .ytp-pause-overlay, .ytp-pause-overlay-container,
.ytp-chrome-top, .ytp-chrome-bottom, .ytp-gradient-top, .ytp-gradient-bottom, .ytp-watermark,
.ytp-youtube-button, .ytp-impression-link, .ytp-ce-element, .ytp-cards-teaser, .ytp-cards-button,
.ytp-paid-content-overlay, .ytp-spinner, .ytp-contextmenu, .ytp-tooltip, .iv-branding, .branding-img,
.ytp-show-cards-title, .ytp-title, .ytp-overflow-button, .ytp-unmute,
[class*="large-play"]:not([class*="ad-"]), [class*="play-pause"]:not([class*="ad-"]),
[class*="bezel"]:not([class*="ad-"]) { display: none !important; }
.html5-video-player { cursor: none !important; }`;

// Sound effects. YouTube's audio never leaves this frame, so the effect chain lives here:
// video → headroom → bass shelf → low-mid cut → vocal presence → (dry + reverb) → soft clipper → speakers.
// It is only connected once an effect is turned on, so "all off" leaves YouTube's audio untouched.
const FX_JS = String.raw`
  let ctx = null, n = null, fx = { bass: 0, vocal: 0, reverb: 0 }, vizOn = false, ccWant = null, ccCooldown = 0;
  const hooked = new WeakSet();
  const active = () => fx.bass > 0 || fx.vocal > 0 || fx.reverb > 0;
  let clipCurve = null;
  function impulse(sec, decay) {
    const len = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c), pre = Math.floor(ctx.sampleRate * 0.025);
      for (let i = pre; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - (i - pre) / (len - pre), decay);
    }
    return buf;
  }
  function build() {
    ctx = new AudioContext();
    const b = (type, f, q) => { const x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q) x.Q.value = q; return x; };
    n = { input: ctx.createGain(), bass: b('lowshelf', 110), mud: b('peaking', 320, 1.0), vocal: b('peaking', 2700, 0.8),
          air: b('highshelf', 9000), dry: ctx.createGain(), wet: ctx.createGain(), conv: ctx.createConvolver(),
          wetTone: b('lowpass', 5500), limiter: ctx.createWaveShaper(), meter: ctx.createAnalyser(), viz: ctx.createAnalyser() };
    n.conv.buffer = impulse(2.4, 2.6);
    n.meter.fftSize = 8192; n.meter.smoothingTimeConstant = 0;
    n.viz.fftSize = 4096; n.viz.smoothingTimeConstant = 0.5;
    // Soft clipper: untouched below about -3 dBFS, rounds off peaks above it. Bypassed when all effects are off.
    clipCurve = new Float32Array(2049); const knee = 0.7;
    for (let i = 0; i < clipCurve.length; i++) {
      const x = i / 1024 - 1, a = Math.abs(x);
      clipCurve[i] = a <= knee ? x : Math.sign(x) * (knee + (1 - knee) * Math.tanh((a - knee) / (1 - knee)));
    }
    n.limiter.oversample = '2x';
    n.input.connect(n.bass).connect(n.mud).connect(n.vocal).connect(n.air);
    n.air.connect(n.dry).connect(n.limiter);
    n.air.connect(n.conv).connect(n.wetTone).connect(n.wet).connect(n.limiter);
    n.limiter.connect(n.meter); n.limiter.connect(n.viz); n.limiter.connect(ctx.destination);
  }
  function hook() {
    document.querySelectorAll('video, audio').forEach((v) => {
      if (hooked.has(v)) return;
      try { ctx.createMediaElementSource(v).connect(n.input); hooked.add(v); } catch (e) {}
    });
  }
  function apply() {
    const t = ctx.currentTime, set = (p, v) => p.setTargetAtTime(v, t, 0.08);
    const boost = Math.max(fx.bass, fx.vocal);
    set(n.input.gain, Math.pow(10, -boost * 0.22 / 20));     // a little headroom; the soft clipper catches the rest
    set(n.bass.gain, fx.bass);
    set(n.vocal.gain, fx.vocal);
    set(n.mud.gain, -fx.vocal * 0.35);
    set(n.air.gain, fx.vocal * 0.25);
    const r = fx.reverb / 100;
    set(n.wet.gain, r * 0.55);
    set(n.dry.gain, 1 - r * 0.25);
    n.limiter.curve = active() ? clipCurve : null;
  }
  function ensure() { if (!ctx && (active() || vizOn)) build(); if (ctx) { hook(); apply(); } }

  // ---- spectrum for the side visualizers (20 log-spaced bands, 0-255) ----
  let specBuf = null;
  function spectrum() {
    if (!specBuf) specBuf = new Uint8Array(n.viz.frequencyBinCount);
    n.viz.getByteFrequencyData(specBuf);
    const bin = ctx.sampleRate / n.viz.fftSize, out = [], N = 20, lo = 40, hi = 16000;
    for (let i = 0; i < N; i++) {
      const f0 = lo * Math.pow(hi / lo, i / N), f1 = lo * Math.pow(hi / lo, (i + 1) / N);
      let m = 0; for (let k = Math.floor(f0 / bin); k <= Math.ceil(f1 / bin) && k < specBuf.length; k++) m = Math.max(m, specBuf[k]);
      out.push(m);
    }
    return out;
  }
  setInterval(() => { if (vizOn && ctx) try { parent.postMessage({ __crossfader: 'spec', b: spectrum() }, '*'); } catch (e) {} }, 33);

  // ---- look of the video: size, baked-in black side bars, and its main colours ----
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 36;
  const g = cv.getContext('2d', { willReadFrequently: true });
  const colHist = [];
  function look() {
    const v = document.querySelector('video');
    if (!v || !v.videoWidth || v.paused) return null;
    const res = { w: v.videoWidth, h: v.videoHeight, border: 0, colors: null, lum: 0 };
    try {
      g.drawImage(v, 0, 0, 64, 36);
      const d = g.getImageData(0, 0, 64, 36).data;
      const colMax = new Array(64).fill(0);
      for (let y = 0; y < 36; y++) for (let x = 0; x < 64; x++) {
        const i = (y * 64 + x) * 4, L = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        if (L > colMax[x]) colMax[x] = L;
      }
      colHist.push(colMax); if (colHist.length > 8) colHist.shift();
      if (colHist.length >= 3) {
        const run = colMax.map((_, x) => Math.max(...colHist.map((c) => c[x])));
        let l = 0; while (l < 24 && run[l] < 22) l++;
        let r = 0; while (r < 24 && run[63 - r] < 22) r++;
        const bw = Math.min(l, r);
        res.border = bw >= 3 && bw < 24 ? bw / 64 : 0;          // fraction of width on each side
      }
      // Vivid colours: weight each pixel by saturation × brightness, group by hue.
      const buckets = Array.from({ length: 12 }, () => ({ w: 0, r: 0, g: 0, b: 0 }));
      let lum = 0, cnt = 0;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
        lum += mx; cnt++;
        if (mx < 40) continue;
        const sat = (mx - mn) / mx, w = sat * sat * (mx / 255);
        if (sat < 0.25) continue;
        let h = mx === r ? (gg - b) / (mx - mn) : mx === gg ? 2 + (b - r) / (mx - mn) : 4 + (r - gg) / (mx - mn);
        h = ((h * 60) + 360) % 360;
        const k = buckets[Math.floor(h / 30) % 12]; k.w += w; k.r += r * w; k.g += gg * w; k.b += b * w;
      }
      res.lum = lum / cnt / 255;
      const ranked = buckets.map((k, i) => ({ ...k, i })).filter((k) => k.w > 0.4).sort((a, z) => z.w - a.w);
      if (ranked.length) {
        const c = (k) => [Math.round(k.r / k.w), Math.round(k.g / k.w), Math.round(k.b / k.w)];
        const first = ranked[0];
        const second = ranked.find((k) => Math.min(Math.abs(k.i - first.i), 12 - Math.abs(k.i - first.i)) >= 2) || null;
        res.colors = [c(first), second ? c(second) : null];
      }
    } catch (e) { res.tainted = true; }
    return res;
  }
  setInterval(() => { if (vizOn) { const r = look(); if (r) try { parent.postMessage({ __crossfader: 'look', ...r }, '*'); } catch (e) {} } }, 1000);

  // ---- closed captions: press YouTube's own (hidden) CC button when it doesn't match ----
  function syncCC() {
    if (ccWant === null || Date.now() < ccCooldown) return;
    const btn = document.querySelector('.ytp-subtitles-button');
    if (!btn || btn.style.display === 'none' || !btn.hasAttribute('aria-pressed')) return;
    const on = btn.getAttribute('aria-pressed') === 'true';
    if (on !== ccWant) { btn.click(); ccCooldown = Date.now() + 4000; }
  }

  window.__crossfaderFx = {
    set(next) { fx = next; ensure(); },
    level() { if (!n) return null; const a = new Uint8Array(n.meter.frequencyBinCount); n.meter.getByteFrequencyData(a);
      const bin = ctx.sampleRate / n.meter.fftSize, band = (lo, hi) => { let s = 0, c = 0; for (let i = 0; i < a.length; i++) { const f = i * bin; if (f >= lo && f < hi) { s += a[i]; c++; } } return c ? s / c : 0; };
      return { bass: band(40, 180), mid: band(1800, 4000) }; }
  };
  addEventListener('message', (e) => {
    if (e.source !== parent || !e.data) return;
    const m = e.data;
    if (m.__crossfaderFx) fx = m.__crossfaderFx;
    if ('__crossfaderViz' in m) vizOn = !!m.__crossfaderViz;
    if ('__crossfaderCC' in m) { ccWant = !!m.__crossfaderCC; syncCC(); }
    if (typeof m.__crossfaderCCStyle === 'string') {
      let st = document.getElementById('cf-cc');
      if (!st) { st = document.createElement('style'); st.id = 'cf-cc'; (document.head || document.documentElement).appendChild(st); }
      if (st.textContent !== m.__crossfaderCCStyle) st.textContent = m.__crossfaderCCStyle;
    }
    if (m.__crossfaderFx || '__crossfaderViz' in m) ensure();
  });
  setInterval(() => { if (ctx) { hook(); if (ctx.state === 'suspended') ctx.resume(); } }, 1000);
`;
const YT_FRAME_JS = `(() => {
  if (window.__crossfader) return; window.__crossfader = true;
  const css = document.createElement('style'); css.textContent = ${JSON.stringify(YT_FRAME_CSS)};
  (document.head || document.documentElement).appendChild(css);
  ${FX_JS}
  let last = null;
  setInterval(() => {
    const p = document.querySelector('.html5-video-player');
    const ad = !!(p && (p.classList.contains('ad-showing') || p.classList.contains('ad-interrupting')));
    if (ad !== last) { last = ad; try { parent.postMessage({ __crossfader: 'ad', ad }, '*'); } catch (e) {} }
  }, 250);
})();`;
function hookYouTubeFrames(wc) {
  const inject = (pid, rid) => {
    const f = webFrameMain.fromId(pid, rid);
    if (f && /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\//.test(f.url)) f.executeJavaScript(YT_FRAME_JS).catch(() => {});
  };
  wc.on('did-frame-finish-load', (_e, isMain, pid, rid) => { if (!isMain) inject(pid, rid); });
  wc.on('did-frame-navigate', (_e, _url, _c, _t, isMain, pid, rid) => { if (!isMain) setTimeout(() => inject(pid, rid), 300); });
}

// ---------- song facts ----------
const { createFacts, parseTracklist } = require('./facts');
const FACT_UA = () => `LikeTheFishsCrossfader/${app.getVersion()} (+https://likethefish.ca)`;
async function fetchJSON(url) {
  const r = await net.fetch(url, { headers: { 'User-Agent': FACT_UA(), 'Api-User-Agent': FACT_UA(), Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
const facts = createFacts({ fetchJSON });
const factsFile = () => path.join(app.getPath('userData'), 'facts-cache.json');
let factCache = null, factSaveTimer = null;
async function songFacts(info) {
  if (!factCache) { try { factCache = JSON.parse(fs.readFileSync(factsFile(), 'utf8')); } catch { factCache = {}; } }
  const key = info.videoId;
  const hit = factCache[key];
  if (hit && Date.now() - hit.at < 30 * 86400e3) return hit.data;
  let data;
  try { data = await facts.lookup(info); } catch (e) { log(`[facts] ${e.message}`); return null; }
  log(`[facts] ${info.title} → ${data.artist} / ${data.song} / ${data.year} / ${data.facts.length} facts`);
  factCache[key] = { at: Date.now(), data };
  clearTimeout(factSaveTimer);
  factSaveTimer = setTimeout(() => { try { fs.writeFileSync(factsFile(), JSON.stringify(factCache)); } catch {} }, 2000);
  return data;
}

// Mix tracklists: read the video's description from its YouTube page and pull out "0:00 Artist - Song" lines.
const tracklistCache = new Map();
async function videoTracklist(videoId) {
  if (!/^[\w-]{6,20}$/.test(videoId)) return [];
  if (tracklistCache.has(videoId)) return tracklistCache.get(videoId);
  let tracks = [];
  if (PUBLIC) {
    // Public edition: only through the official YouTube Data API (needs an API key in edition.json).
    if (!EDITION.youtubeApiKey) return [];
    try {
      const r = await net.fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${encodeURIComponent(EDITION.youtubeApiKey)}`);
      const d = await r.json();
      const desc = d.items && d.items[0] && d.items[0].snippet && d.items[0].snippet.description;
      tracks = parseTracklist(desc || '');
    } catch (e) { log(`[tracklist] ${videoId}: ${e.message}`); }
    tracklistCache.set(videoId, tracks);
    return tracks;
  }
  try {
    const r = await net.fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
      headers: { 'User-Agent': session.defaultSession.getUserAgent(), 'Accept-Language': 'en-US,en;q=0.9' } });
    const html = await r.text();
    const m = html.match(/"shortDescription":"((?:\\.|[^"\\])*)"/);
    tracks = m ? parseTracklist(JSON.parse(`"${m[1]}"`)) : [];
    log(`[tracklist] ${videoId}: ${tracks.length} tracks`);
  } catch (e) { log(`[tracklist] ${videoId}: ${e.message}`); }
  tracklistCache.set(videoId, tracks);
  return tracks;
}

// ---------- YouTube oEmbed (official, public): video shape + title, playlist names ----------
const oembedCache = new Map();
async function oembed(url) {
  if (!/^https:\/\/(www\.|music\.)?youtube\.com\/(watch\?v=[\w-]+|playlist\?list=[\w-]+)/.test(url)) return null;
  url = url.replace('music.youtube.com', 'www.youtube.com');
  if (oembedCache.has(url)) return oembedCache.get(url);
  let out = null;
  try {
    const r = await net.fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`);
    if (r.ok) { const d = await r.json(); out = { title: d.title, author: d.author_name, width: d.width, height: d.height, thumbnail: d.thumbnail_url }; }
  } catch {}
  oembedCache.set(url, out);
  return out;
}
// Small thumbnail as a data URL, used only to pick visualizer colours.
async function thumbnail(id) {
  if (!/^[\w-]{6,20}$/.test(id)) return null;
  try {
    const r = await net.fetch(`https://i.ytimg.com/vi/${id}/mqdefault.jpg`);
    if (!r.ok) return null;
    return `data:image/jpeg;base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}`;
  } catch { return null; }
}
// Optional "new version available" check: updateUrl points at a small JSON file on your website,
// e.g. {"version":"1.7.0","url":"https://likethefish.ca/crossfader","notes":"…"}
async function checkUpdate() {
  if (!EDITION.updateUrl) return null;
  try {
    const r = await net.fetch(EDITION.updateUrl, { cache: 'no-store' });
    const d = await r.json();
    const newer = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
    return d && d.version && newer(String(d.version), app.getVersion()) ? d : null;
  } catch { return null; }
}

// ---------- log file (Help: Open log) ----------
const logFile = () => path.join(app.getPath('userData'), 'log.txt');
function log(line) {
  try {
    const f = logFile();
    if (fs.existsSync(f) && fs.statSync(f).size > 512 * 1024) fs.renameSync(f, f + '.old');
    fs.appendFileSync(f, `${new Date().toISOString()} ${line}\n`);
  } catch {}
}

// ---------- settings ----------
const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');
function loadSettings() {
  try { return JSON.parse(fs.readFileSync(settingsFile(), 'utf8')); } catch { return {}; }
}
function saveSettings(s) {
  try { fs.mkdirSync(path.dirname(settingsFile()), { recursive: true }); fs.writeFileSync(settingsFile(), JSON.stringify(s, null, 2)); return true; }
  catch { return false; }
}

// ---------- SponsorBlock (privacy-preserving hash-prefix lookup) ----------
async function getSegments(videoId, categories) {
  const prefix = crypto.createHash('sha256').update(videoId).digest('hex').slice(0, 4);
  const url = `https://sponsor.ajay.app/api/skipSegments/${prefix}?categories=${encodeURIComponent(JSON.stringify(categories))}`;
  try {
    const res = await net.fetch(url, { headers: { 'User-Agent': 'LikeTheFishsCrossfader/1.6' } });
    if (!res.ok) return []; // 404 = no segments for any video with this prefix
    const list = await res.json();
    const hit = Array.isArray(list) ? list.find((v) => v.videoID === videoId) : null;
    if (!hit) return [];
    return hit.segments
      .filter((s) => s.actionType === 'skip' || !s.actionType)
      .map((s) => ({ start: s.segment[0], end: s.segment[1], category: s.category, videoDuration: s.videoDuration || 0 }));
  } catch { return []; }
}

// ---------- YouTube sign-in ----------
// Cookies live in the app's persistent session, so the embedded players see the account
// (Premium = no ads) and sign-in survives restarts.
const LOGIN_URL = 'https://accounts.google.com/ServiceLogin?service=youtube&passive=true&continue=' +
  encodeURIComponent('https://www.youtube.com/signin?action_handle_signin=true&app=desktop&next=%2F');
const ALT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0';

async function authStatus() {
  const cookies = await session.defaultSession.cookies.get({ domain: 'youtube.com' });
  const signedIn = cookies.some((c) => c.name === 'SAPISID' || c.name === '__Secure-3PAPISID' || c.name === 'LOGIN_INFO');
  return { signedIn };
}

let signInWin = null;
function openSignIn() {
  if (signInWin) { signInWin.focus(); return Promise.resolve(null); }
  return new Promise((resolve) => {
    signInWin = new BrowserWindow({
      width: 520, height: 760, parent: win, title: 'Sign in to YouTube', autoHideMenuBar: true,
      backgroundColor: '#ffffff', webPreferences: { contextIsolation: true, nodeIntegration: false }
    });
    const wc = signInWin.webContents;
    let triedAlt = false;
    wc.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
    const onNav = async (_e, url) => {
      // Google sometimes refuses embedded browsers; retry once identifying as Firefox.
      if (!triedAlt && /signin\/rejected|disallowed_useragent|CookieMismatch/i.test(url)) {
        triedAlt = true; wc.setUserAgent(ALT_UA); wc.loadURL(LOGIN_URL); return;
      }
      if (/^https:\/\/(www|m)\.youtube\.com\//.test(url) && (await authStatus()).signedIn) {
        setTimeout(() => signInWin && signInWin.close(), 600);
      }
    };
    wc.on('did-navigate', onNav);
    wc.on('did-redirect-navigation', onNav);
    signInWin.on('closed', async () => { signInWin = null; resolve(await authStatus()); });
    signInWin.loadURL(LOGIN_URL);
  });
}

async function signOut() {
  await session.defaultSession.clearStorageData();
  await session.defaultSession.clearCache();
  return authStatus();
}

// ---------- system-audio level (for silence detection, Windows only) ----------
const LOOPBACK_SUPPORTED = process.platform === 'win32';
function enableLoopback() {
  if (!LOOPBACK_SUPPORTED) return;
  session.defaultSession.setDisplayMediaRequestHandler((_req, callback) => {
    desktopCapturer.getSources({ types: ['screen'] })
      .then((sources) => callback({ video: sources[0], audio: 'loopback' }))
      .catch(() => callback({}));
  }, { useSystemPicker: false });
}

// ---------- window / displays ----------
function listDisplays() {
  const primaryId = screen.getPrimaryDisplay().id;
  return screen.getAllDisplays().map((d, i) => ({
    id: d.id,
    primary: d.id === primaryId,
    label: `${d.id === primaryId ? 'Main monitor' : `Monitor ${i + 1}`} — ${d.size.width}×${d.size.height}${d.label ? ` (${d.label})` : ''}`
  }));
}

function goFullscreenOn(displayId) {
  const displays = screen.getAllDisplays();
  const target = displays.find((d) => d.id === displayId) || screen.getPrimaryDisplay();
  const apply = () => {
    win.setBounds(target.bounds);
    win.setFullScreen(true);
    win.focus();
  };
  if (win.isFullScreen()) {
    win.once('leave-full-screen', () => setTimeout(apply, 150));
    win.setFullScreen(false);
  } else {
    apply();
  }
  if (blockerId === null) blockerId = powerSaveBlocker.start('prevent-display-sleep');
}

function leaveFullscreen() {
  if (win.isFullScreen()) win.setFullScreen(false);
  if (blockerId !== null) { powerSaveBlocker.stop(blockerId); blockerId = null; }
  const wa = screen.getPrimaryDisplay().workArea;
  setTimeout(() => {
    const w = Math.min(1100, wa.width), h = Math.min(820, wa.height);
    win.setBounds({ x: wa.x + Math.round((wa.width - w) / 2), y: wa.y + Math.round((wa.height - h) / 2), width: w, height: h });
  }, 200);
}

async function createWindow() {
  const port = await startServer();

  // Present a plain Chrome user agent so YouTube treats the embeds normally.
  const ua = session.defaultSession.getUserAgent().replace(/\s?Electron\/\S+/, '').replace(/\s?playlist-crossfader\/\S+/i, '');
  session.defaultSession.setUserAgent(ua);
  enableLoopback();
  log(`--- start v${app.getVersion()} ${process.platform} electron ${process.versions.electron}`);
  // YouTube refuses to play embeds (error 152/153) when no Referer is sent; make sure one is.
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://www.youtube.com/embed/*', 'https://www.youtube-nocookie.com/embed/*'] },
    (details, cb) => {
      const h = details.requestHeaders;
      if (!h.Referer && !h.referer) h.Referer = `http://localhost:${port}/`;
      cb({ requestHeaders: h });
    });

  win = new BrowserWindow({
    width: 1100, height: 820, minWidth: 760, minHeight: 600,
    backgroundColor: '#0c0c10',
    autoHideMenuBar: true,
    title: APP_TITLE,
    icon: path.join(__dirname, 'app', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  win.setMenuBarVisibility(false);

  // Clicking the YouTube logo etc. opens in the normal browser instead of a new app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(`http://localhost:${port}/index.html`);
  if (!PUBLIC) hookYouTubeFrames(win.webContents);   // the public edition never touches YouTube's player frame
  win.webContents.on('console-message', (e) => log(`[page ${e.level}] ${e.message}`));
  win.webContents.on('render-process-gone', (_e, d) => {
    log(`[crash] renderer gone: ${d.reason}`);
    if (d.reason === 'clean-exit') return;
    setTimeout(() => { try { if (win && !win.isDestroyed()) win.loadURL(`http://localhost:${port}/index.html?recover=1`); } catch (e) { log(`[crash] reload failed: ${e.message}`); } }, 1500);
  });
  win.webContents.on('unresponsive', () => log('[hang] window unresponsive'));
  win.webContents.on('responsive', () => log('[hang] window responsive again'));
  win.on('closed', () => { win = null; });
  // Tell the page when the mouse moves over the window — even over YouTube's player, whose mouse
  // events the page can't see. Used to bring back the auto-hiding control bar.
  let lastCursor = null;
  const cursorTimer = setInterval(() => {
    if (!win || win.isDestroyed()) return clearInterval(cursorTimer);
    const p = screen.getCursorScreenPoint();
    if (lastCursor && p.x === lastCursor.x && p.y === lastCursor.y) return;
    lastCursor = p;
    const b = win.getBounds();
    if (p.x >= b.x && p.x < b.x + b.width && p.y >= b.y && p.y < b.y + b.height) win.webContents.send('cursor-moved');
  }, 200);
}

ipcMain.handle('displays', () => listDisplays());
ipcMain.handle('enter-show', (_e, displayId) => { goFullscreenOn(displayId); return true; });
ipcMain.handle('exit-show', () => { leaveFullscreen(); return true; });
ipcMain.handle('toggle-fullscreen', () => { win.setFullScreen(!win.isFullScreen()); return win.isFullScreen(); });
ipcMain.handle('segments', (_e, videoId, categories) => getSegments(String(videoId), categories));
ipcMain.handle('load-settings', () => loadSettings());
ipcMain.handle('save-settings', (_e, s) => saveSettings(s));
ipcMain.handle('auth-status', () => (PUBLIC ? { signedIn: false, disabled: true } : authStatus()));
ipcMain.handle('open-log', () => shell.openPath(logFile()));
ipcMain.handle('song-facts', (_e, info) => songFacts(info));
ipcMain.handle('tracklist', (_e, id) => videoTracklist(String(id)));
const OPENABLE = /^https:\/\/((en\.)?wikipedia\.org|(www\.)?youtube\.com\/(t\/terms|static)|policies\.google\.com|(www\.)?paypal\.(me|com)|ko-fi\.com|(www\.)?likethefish\.ca|sponsor\.ajay\.app|musicbrainz\.org|github\.com|openfontlicense\.org|creativecommons\.org)(\/|$)/;
ipcMain.handle('open-url', (_e, url) => {
  const extra = [EDITION.supportUrl, EDITION.privacyUrl, EDITION.website].filter(Boolean);
  if (OPENABLE.test(url) || extra.some((u) => url === u)) shell.openExternal(url);
});
ipcMain.handle('sign-in', () => (PUBLIC ? null : openSignIn()));
ipcMain.handle('edition', () => ({ ...EDITION, youtubeApiKey: undefined, hasApiKey: !!EDITION.youtubeApiKey, public: PUBLIC, version: app.getVersion() }));
ipcMain.handle('oembed', (_e, url) => oembed(String(url)));
ipcMain.handle('thumb', (_e, id) => thumbnail(String(id)));
ipcMain.handle('check-update', () => checkUpdate());
ipcMain.handle('sign-out', () => signOut());
ipcMain.handle('loopback-supported', () => LOOPBACK_SUPPORTED);

app.whenReady().then(() => {
  createWindow();
  screen.on('display-added', () => win && win.webContents.send('displays-changed'));
  screen.on('display-removed', () => win && win.webContents.send('displays-changed'));
});
app.on('window-all-closed', () => app.quit());
