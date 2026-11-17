/* Island Sessions: a castaway, his hut, three cats, and whatever music you bring.
   An original pixel-art adventure-game island for likethefish.ca. Day turns to night every 15 minutes.
   Rafts wash ashore: magic EQ pots that shoot fibre-optic fireworks, drummers keeping their own beat, and dancers. */
(function () {
'use strict';
const root = document.getElementById('isl-root'); if (!root || root.dataset.ready) return; root.dataset.ready = '1';
const SRC = (document.currentScript && document.currentScript.src) || '';
const GM_SRC = SRC.replace(/island\/island\.js.*$/, 'rko/gm.js');
if (/gm\.js/.test(GM_SRC) && !window.LTFGM) { const gs = document.createElement('script'); gs.src = GM_SRC; document.head.appendChild(gs); }
if (/gm\.js/.test(GM_SRC) && !window.LTFSP) { const ss = document.createElement('script'); ss.src = GM_SRC.replace('gm.js', 'ltf-spotify.js'); document.head.appendChild(ss); }
const PLAYLISTS = (window.PQ_PLAYLISTS && window.PQ_PLAYLISTS.length) ? window.PQ_PLAYLISTS : [['Singing', '0Bxvmnd4tPBXrr8Adj47CL']];
const HERO = 'Clifford';

/* ---------------- page + UI ---------------- */
const css = `
#isl{-webkit-text-size-adjust:100%;text-size-adjust:100%;--isl-bg:#10162e;--isl-panel:#18203f;--isl-gold:#ffd27a;--isl-ink:#eef1ff;font-family:Georgia,'Times New Roman',serif;color:var(--isl-ink);max-width:980px;margin:0 auto}
#isl *{box-sizing:border-box}
#isl .isl-qp{display:flex;gap:8px;align-items:center;background:var(--isl-bg);border:1px solid #ffffff22;border-radius:14px;padding:9px 10px;margin:0 0 10px}
#isl .isl-qp .lbl{font-size:14px;color:var(--isl-gold);white-space:nowrap}
#isl select,#isl input[type=text]{font:15px Georgia,serif;color:var(--isl-ink);background:#0b1024;border:1px solid #ffffff3a;border-radius:999px;padding:8px 12px;min-width:0}
#isl .isl-qp select{flex:1}
#isl button{font:600 14px Georgia,serif;border:0;border-radius:999px;padding:9px 16px;cursor:pointer;background:#ff9a3c;color:#1b130d;white-space:nowrap}
#isl button.alt{background:#24305e;color:var(--isl-ink);border:1px solid #ffffff2a}
#isl button[aria-pressed=true]{background:var(--isl-gold);color:#1b130d}
#isl .isl-stage{position:relative;background:#000;border-radius:14px 14px 0 0;overflow:hidden;line-height:0}
#isl canvas{display:block;width:100%;height:auto;image-rendering:pixelated;image-rendering:crisp-edges;cursor:pointer}
#isl .isl-fs{position:absolute;right:10px;top:10px;line-height:1;font-size:13px;padding:7px 11px;background:#000a;color:#fff;border:1px solid #ffffff44}
#isl .isl-hud{display:flex;gap:10px;align-items:center;justify-content:space-between;background:var(--isl-bg);padding:9px 14px;font-size:14px;border-radius:0 0 14px 14px}
#isl .isl-now{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--isl-gold)}
#isl .isl-clock{opacity:.8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#isl .isl-enc{flex:0 0 auto;font:600 12px Georgia,serif;padding:6px 11px;border-radius:999px;background:#000a;color:#fff;border:1px solid #ffffff44;cursor:pointer;white-space:nowrap}
#isl .isl-enc:hover{background:#ffffff22}
#isl .isl-cap{display:none}
#isl.isl-full .isl-cap{display:block;position:absolute;left:50%;top:12px;transform:translateX(-50%);max-width:78vw;background:#000000b8;color:#fff;font:600 15px/1.3 Georgia,serif;padding:7px 16px;border-radius:999px;z-index:3;opacity:0;transition:opacity .4s;pointer-events:none;text-align:center}
#isl.isl-full .isl-cap.on{opacity:1}
@media (max-width:700px){#isl.isl-full .isl-enc span{display:none}#isl.isl-full .isl-cap{font-size:12px;top:8px}}
#isl .isl-box{background:var(--isl-panel);border:1px solid #ffffff18;border-radius:14px;padding:12px;margin-top:10px}
#isl .isl-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
#isl .isl-pane{display:none}#isl .isl-pane.on{display:block}
#isl .isl-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0}
#isl .isl-row > select,#isl .isl-row > input[type=text]{flex:1 1 200px}
#isl .isl-note{font-size:13px;line-height:1.5;opacity:.85;margin:8px 2px 0}
#isl .isl-note a{color:var(--isl-gold)}
#isl .isl-embed{margin-top:8px;border-radius:12px;overflow:hidden;line-height:0}
#isl audio{width:100%;margin-top:6px}
#isl .isl-songs{font-size:13px;line-height:1.6;margin-top:8px;opacity:.9}
#isl.isl-full{position:fixed;top:0;left:0;width:100vw;height:100vh;height:100dvh;touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none;z-index:2147483000;max-width:none;margin:0;background:#000;display:flex;flex-direction:column}
#isl.isl-full .isl-qp,#isl.isl-full .isl-box{display:none}
#isl.isl-full .isl-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:0}
#isl.isl-full canvas{max-width:100vw;max-height:100dvh}
#isl.isl-full .isl-hud{position:absolute;left:0;right:0;bottom:0;border-radius:0;background:#000000a0;padding:6px 12px;font-size:12px;z-index:2}
#isl .isl-ov{display:none;position:absolute;left:10px;top:10px;gap:6px;align-items:center;line-height:1;z-index:2}
#isl.isl-full .isl-ov{display:flex}
#isl.isl-full .isl-hud .isl-ov{position:static;flex:0 0 auto;flex-wrap:nowrap}
#isl.isl-full .isl-hud .isl-now{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#isl.isl-full .isl-hud .isl-clock{display:none}
#isl.isl-full .isl-hud .isl-ov select{max-width:30vw}
#isl .isl-ov select,#isl .isl-ov button{font:600 13px Georgia,serif;padding:7px 10px;background:#000a;color:#fff;border:1px solid #ffffff44;border-radius:999px}
@media (max-height:500px){#isl.isl-full .isl-hud{padding:4px 10px;font-size:11px}#isl .isl-ov select,#isl .isl-ov button,#isl.isl-full .isl-fs{font-size:11px;padding:6px 8px}}
html.isl-noscroll,html.isl-noscroll body{overflow:hidden!important}
#isl.isl-full .ltf-cast-btn{display:none!important}
#isl.isl-full .isl-hud,#isl.isl-full .isl-fs{transition:opacity .6s,transform .6s}
#isl.isl-full.isl-idle .isl-hud{opacity:0;transform:translateY(100%);pointer-events:none}#isl.isl-full.isl-idle .isl-fs{opacity:0;pointer-events:none}#isl.isl-full.isl-idle{cursor:none}
@media (max-width:600px){#isl .isl-qp .lbl{display:none}#isl .isl-qp{gap:6px;padding:7px}#isl button{padding:9px 12px}#isl .isl-hud{font-size:13px}}
#isl-print{display:none}
@media print{body *{visibility:hidden!important}#isl-print,#isl-print *{visibility:visible!important}#isl-print{display:block!important;position:absolute;left:0;top:0;width:100%;color:#000;font-family:Georgia,serif}}
#isl-print img{width:100%;image-rendering:pixelated}#isl-print h2{margin:10px 0 4px}#isl-print ol{columns:2;font-size:12px}#isl-print .foot{font-size:10px;margin-top:10px}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
const QP = [['spotify', '\u{1F3B2} Random Like The Fish playlist (Spotify)'], ['c64', '\u{1F579} C64 remixes'], ['relaxing', '\u{1F30A} Relaxing · Kevin MacLeod'], ['encapsulating', '\u{1F52E} Encapsulating · Kevin MacLeod'], ['insanity', '⚡ Insanity · Kevin MacLeod'], ['mobygratis-glow', '\u{1F3A7} MOBYGRATIS: Glow'], ['mobygratis-drive', '\u{1F3A7} MOBYGRATIS: Drive']];
root.innerHTML = `
<div id="isl">
  <div class="isl-qp"><span class="lbl">Quick play</span><select id="isl-qsel" aria-label="Choose what to play">${QP.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select><button id="isl-qgo">▶ Play</button><button id="isl-qstop" class="alt" hidden>⏸</button></div>
  <div class="isl-stage"><div class="isl-cap" id="isl-cap"></div><canvas id="isl-cv" width="384" height="216" aria-label="A castaway's island: ${HERO} walks the beach by his hut while the music plays"></canvas><div class="isl-ov"><select id="isl-fpack" aria-label="Furniture"><option value="original">\u{1F334} Original</option><option value="future">\u{1F680} Future</option><option value="fancy">\u{1F3A9} Fancy</option><option value="tiki">\u{1F5FF} Tiki</option><option value="seventies">\u{1F33C} 70s</option><option value="eighties">\u{1F4FC} 80s</option></select><button id="isl-fskip" aria-label="Skip to night or day">\u{1F319}</button><button id="isl-fplay" aria-label="Play or pause">\u25B6</button></div><button class="isl-fs" id="isl-fs">⤢ Full screen</button></div>
  <div class="isl-hud"><span class="isl-now" id="isl-now">Play some music and see what washes ashore…</span><span class="isl-clock" id="isl-clock"></span><button id="isl-enc" class="isl-enc" title="Something unexpected happens on the island">\u{1F3B2}<span> Random encounter</span></button></div>
  <div class="isl-box">
    <div class="isl-tabs" role="tablist">
      <button data-tab="sp" aria-pressed="true" class="alt">Spotify player</button><button data-tab="gm" aria-pressed="false" class="alt">\u{1F3AE} Game music</button><button data-tab="acct" aria-pressed="false" class="alt">\u{1F3A7} My Spotify app</button><button data-tab="mic" aria-pressed="false" class="alt">\u{1F3A4} Mic</button><button data-tab="am" aria-pressed="false" class="alt">\u{1F34E} Apple Music</button><button data-tab="type" aria-pressed="false" class="alt">Type my songs</button>
    </div>
    <div class="isl-pane on" data-pane="sp">
      <div class="isl-row"><select id="isl-pl" aria-label="Pick a Like The Fish playlist"><option value="">Pick a Like The Fish playlist…</option>${PLAYLISTS.map(([n, id]) => `<option value="${id}">${n.replace(/[<>&"]/g, '')}</option>`).join('')}</select><button id="isl-rand" class="alt">\u{1F3B2} Random</button></div>
      <div class="isl-row"><input type="text" id="isl-url" placeholder="…or paste any Spotify link"><button id="isl-load" class="alt">Load player</button></div>
      <div class="isl-embed" id="isl-embed"></div>
      <p class="isl-note">Press play in the Spotify player. Each new song sends a fresh raft toward the island.</p>
      <p class="isl-note">Only hearing 30-second clips? <a href="https://accounts.spotify.com/login" target="_blank" rel="noopener">Log in to Spotify</a> in this browser for full songs, then come back and press play.</p>
    </div>
    <div class="isl-pane" data-pane="gm">
      <div class="isl-row"><select id="isl-gmcoll" aria-label="Game music collection"></select><select id="isl-gmsub" aria-label="C64 remixes"></select></div>
      <audio id="isl-gmau" controls preload="none"></audio>
      <div class="isl-row"><button id="isl-gmnext" class="alt">⏭ Next song</button></div>
      <p class="isl-note" id="isl-gmcredit"></p>
      <p class="isl-note">C64 remixes stream from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>. Relaxing, Encapsulating and Insanity are music by Kevin MacLeod (<a href="https://incompetech.com/" target="_blank" rel="noopener">incompetech.com</a>), licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">Creative Commons: By Attribution 4.0</a>. MOBYGRATIS moods are free music from <a href="https://mobygratis.com/" target="_blank" rel="noopener">mobygratis.com</a>. Thank you, MOBYGRATIS!</p>
    </div>
    <div class="isl-pane" data-pane="acct">
      <div class="isl-row" id="isl-acct-btn"></div>
      <p class="isl-note" id="isl-acct-status">Connect once and every Like the Fish game can follow your Spotify.</p>
      <p class="isl-note">Play anything in the Spotify app (phone, computer, speaker) and the island follows along, song by song.</p>
    </div>
    <div class="isl-pane" data-pane="mic">
      <div class="isl-row"><button id="isl-mic">\u{1F3A4} Start listening</button></div>
      <p class="isl-note">Play music out loud from anywhere (a speaker, the radio, a record). The island hears the beat and the cats feel it.</p>
    </div>
    <div class="isl-pane" data-pane="am">
      <div class="isl-row"><input type="text" id="isl-amurl" placeholder="Paste an Apple Music playlist, album or song link"><button id="isl-amload" class="alt">Load player</button></div>
      <div class="isl-embed" id="isl-amembed"></div>
      <div class="isl-row"><button id="isl-amnext" class="alt">⏭ Next song</button><button id="isl-ampause" class="alt">⏸ Pause</button></div>
      <p class="isl-note">Apple doesn’t tell web pages when songs change, so tap ⏭ when a new one starts (a new song is also counted every 3½ minutes).</p>
    </div>
    <div class="isl-pane" data-pane="type">
      <div class="isl-row"><input type="text" id="isl-typed" placeholder="What's playing? (song – artist)"><button id="isl-tstart">▶ Start song</button><button id="isl-tend" class="alt">■ Song over</button></div>
      <p class="isl-note">For records, the radio, the car stereo…</p>
    </div>
    <div class="isl-row" style="margin-top:12px">
      <label class="isl-note" style="margin:0">Furniture</label><select id="isl-pack" style="flex:0 1 auto"><option value="original">\u{1F334} Original</option><option value="future">\u{1F680} Future</option><option value="fancy">\u{1F3A9} Fancy</option><option value="tiki">\u{1F5FF} Tiki</option><option value="seventies">\u{1F33C} 70s</option><option value="eighties">\u{1F4FC} 80s</option></select>
      <button id="isl-skip" class="alt">\u{1F319} Skip to night</button><button id="isl-print-btn" class="alt">\u{1F4DC} Message in a bottle</button>
    </div>
    <div class="isl-songs" id="isl-songs"></div>
  </div>
</div>
<div id="isl-print"></div>`;
const $ = (s) => root.querySelector(s);
const cv = $('#isl-cv'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const W = 384, H = 216, HORIZON = 118, SHORE = 150, FLOOR = 186;

/* ---------------- helpers ---------------- */
let seed = (Date.now() ^ 0x5bd1e995) >>> 0;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (a) => a[Math.floor(rnd() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
function hex(c) { if (c[0] !== '#') return c.match(/\d+/g).slice(0, 3).map(Number); return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function mix(a, b, t) { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',') + ')'; }
function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function P(x, y, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); }

/* ---------------- state ---------------- */
const S = {
  t: 0, playing: false, energy: 0, bpm: 112, beat: 0, beatN: 0, songs: [], cur: -1, pack: 'original',
  clock: 9 * 60, // minutes into a 30-minute cycle: 0-15 day, 15-30 night (start late afternoon)
  rafts: [], sparks: [], floaters: [], fibers: [], lastRaft: -20, mode: 'sp'
};
S.clock = 11.5; // minutes: day, a few minutes before sunset
try { const p = localStorage.getItem('isl.pack'); if (p) S.pack = p; } catch (e) {}
function setPack(v) { S.pack = PACKS[v] ? v : 'original'; $('#isl-pack').value = S.pack; $('#isl-fpack').value = S.pack; try { localStorage.setItem('isl.pack', S.pack); } catch (e) {} }
['#isl-pack', '#isl-fpack'].forEach((id) => $(id).addEventListener('change', function () { setPack(this.value); }));

/* day/night: 15 min day, 15 min night, soft 1.5 min dusk/dawn */
function dayness() {
  const m = ((S.clock % 30) + 30) % 30;
  if (m < 13.5) return m < 1.5 ? m / 1.5 : 1; // dawn ramps up in the first 1.5 min
  if (m < 15) return 1 - (m - 13.5) / 1.5;
  return 0;
}
function phaseName() { const m = ((S.clock % 30) + 30) % 30; return m < 1.5 ? 'dawn' : m < 13.5 ? 'day' : m < 15 ? 'dusk' : m < 28.5 ? 'night' : 'before dawn'; }
function skipPhase() { const m = ((S.clock % 30) + 30) % 30; S.clock += m < 15 ? (13.6 - m) : (30 - m); }
$('#isl-skip').addEventListener('click', skipPhase); $('#isl-fskip').addEventListener('click', skipPhase);

/* ---------------- beat ---------------- */
let micA = null, onBeatFns = [];
function beatTick(dt) {
  if (!S.playing) { S.energy *= 0.96; return; }
  const spb = 60 / S.bpm; S.beat += dt / spb;
  if (Math.floor(S.beat) !== S.beatN) { S.beatN = Math.floor(S.beat); onBeatFns.forEach((f) => f(S.beatN)); }
  const ph = S.beat % 1;
  let e = 0.45 + 0.4 * Math.exp(-ph * 5) + 0.15 * Math.sin(S.t * 0.7);
  if (micA) { micA.an.getFloatTimeDomainData(micA.buf); let s = 0; for (const v of micA.buf) s += v * v; const rms = Math.sqrt(s / micA.buf.length); micA.avg = micA.avg * 0.995 + rms * 0.005; e = clamp(rms / Math.max(0.02, micA.avg * 2), 0, 1.2); }
  S.energy = S.energy * 0.8 + e * 0.2;
}
function bands(n) { const out = []; const ph = S.beat % 1; for (let i = 0; i < n; i++) { const f = i / n; out.push(clamp(S.energy * (0.55 + 0.45 * Math.sin(S.t * (2 + i * 0.7) + i)) * (f < 0.25 ? 1 + Math.exp(-ph * 6) * 0.6 : 1) * (1 - f * 0.35), 0, 1.4)); } return out; }

/* ---------------- music sources ---------------- */
function setPlaying(p) { S.playing = p; syncQuick(); }
function songStart(title, meta) {
  S.songs.push({ title: title || `Song ${S.songs.length + 1}`, at: Date.now() });
  S.cur = S.songs.length - 1;
  S.bpm = meta && meta.bpm > 50 ? Math.min(180, meta.bpm) : 88 + Math.floor(rnd() * 56);
  $('#isl-now').textContent = '♫ ' + (title || `Song ${S.songs.length}`) + (meta && meta.credit ? ' · ' + meta.credit : '');
  renderSongs();
  // every new song pushes a raft toward shore
  spawnRaft(S.songs.length === 1 ? 'pot' : null);
  setPlaying(true);
}
function songEnd() { setPlaying(false); }
function renderSongs() { $('#isl-songs').innerHTML = S.songs.length ? '<b>Washed ashore this session:</b> ' + S.songs.map((s, i) => `${i + 1}. ${esc(s.title)}`).join(' · ') : ''; }
let MODE = 'sp';
root.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
  root.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  root.querySelectorAll('[data-pane]').forEach((p) => p.classList.toggle('on', p.dataset.pane === b.dataset.tab));
  if (b.dataset.tab !== 'gm' && !gmau.paused) gmau.pause();
  MODE = b.dataset.tab; if (typeof acctSync === 'function') acctSync();
}));
function tab(name) { const b = root.querySelector(`[data-tab="${name}"]`); if (b && MODE !== name) b.click(); }

/* Spotify embed */
let api = null, apiWaiting = null, apiLoading = false, ctrl = null; const SP = { uri: null, dur: 0, pos: 0, hasUri: false, pendingPlay: false, at: 0, untitled: false };
function toUri(t) { t = (t || '').trim(); if (/^spotify:/.test(t)) return t; const m = t.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/); return m ? `spotify:${m[1]}:${m[2]}` : null; }
function fetchTitle(uri, cb) { const m = uri && uri.match(/spotify:track:(\w+)/); if (!m) return cb(null); fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent('https://open.spotify.com/track/' + m[1])).then((r) => r.json()).then((j) => cb(j && j.title)).catch(() => cb(null)); }
function songTitle(t) { if (!t || S.cur < 0) return; S.songs[S.cur].title = t; $('#isl-now').textContent = '♫ ' + t; if (typeof renderSongs === 'function') renderSongs(); }
function spTrack(u) {
  if (u === SP.uri) return; SP.uri = u; SP.hasUri = true; if (MODE !== 'sp') tab('sp');
  const recent = Date.now() - SP.at < 3000 && SP.untitled; SP.at = Date.now(); SP.untitled = false;
  if (!recent) songStart(null);
  $('#isl-now').textContent = '♫ Loading the song title…';
  fetchTitle(u, (t) => { if (SP.uri === u) songTitle(t || 'A song from Spotify'); });
}
function spUnknown() {
  SP.at = Date.now(); SP.untitled = true; songStart(null);
  const pl = PLAYLISTS.find((x) => x[1] === sel.value), from = pl ? 'a song from ' + pl[0] : 'a song from Spotify';
  songTitle(from.charAt(0).toUpperCase() + from.slice(1));
  if (window.LTFSP && window.LTFSP.connected()) window.LTFSP.now().then((n) => { if (n && n.state === 'ok' && SP.untitled) songTitle(n.title); }).catch(() => {});
}
function loadEmbed(uri, autoplay) {
  SP.uri = null; SP.dur = 0; SP.pos = 0; SP.at = 0; SP.untitled = false;
  SP.pendingPlay = !!autoplay;
  const make = () => {
    const host = $('#isl-embed'); host.innerHTML = ''; const el = document.createElement('div'); host.appendChild(el);
    api.createController(el, { uri, width: '100%', height: uri.includes(':track:') ? 152 : 352 }, (c) => {
      ctrl = c;
      c.addListener('ready', () => { if (SP.pendingPlay) { SP.pendingPlay = false; try { c.play(); } catch (e) {} } });
      c.addListener('playback_started', (e) => { const u = e && e.data && e.data.playingURI; if (u) spTrack(u); setPlaying(true); });
      c.addListener('playback_update', (e) => {
        const t = (e && e.data) || {}; const on = !t.isPaused && !t.isBuffering;
        if (t.playingURI) spTrack(t.playingURI);
        else if (on) { const changed = (t.duration && SP.dur && Math.abs(t.duration - SP.dur) > 1500) || (SP.pos > 4000 && t.position < 1500); if ((S.cur < 0 || changed) && Date.now() - SP.at > 3000) spUnknown(); }
        if (t.duration) SP.dur = t.duration; if (t.position != null) SP.pos = t.position;
        if (MODE === 'sp' || on) setPlaying(on);
      });
    });
  };
  if (api) make(); else { apiWaiting = make; if (!apiLoading) { apiLoading = true; const prev = window.onSpotifyIframeApiReady; window.onSpotifyIframeApiReady = (a) => { api = a; if (prev) try { prev(a); } catch (e) {} apiWaiting && apiWaiting(); }; const s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true; document.head.appendChild(s); } }
}
const sel = $('#isl-pl');
sel.addEventListener('change', () => { if (sel.value) loadEmbed('spotify:playlist:' + sel.value); });
$('#isl-rand').addEventListener('click', () => { const p = pick(PLAYLISTS); sel.value = p[1]; loadEmbed('spotify:playlist:' + p[1], true); });
$('#isl-load').addEventListener('click', () => { const u = toUri($('#isl-url').value); if (u) loadEmbed(u, true); else $('#isl-now').textContent = 'That doesn’t look like a Spotify link. Try Share → Copy link.'; });

/* Game music (C64 remixes, Kevin MacLeod moods, MOBYGRATIS) */
const gmau = $('#isl-gmau'); const GM = { ready: false, coll: 'c64', list: [], order: [], pos: 0, startedUid: null, pending: null };
function gmSub() { const s = $('#isl-gmsub'); s.innerHTML = ''; const o = window.LTFGM.subOptions(GM.coll); o.forEach(([v, t]) => { const op = document.createElement('option'); op.value = v; op.textContent = t; s.appendChild(op); }); s.style.display = o.length ? '' : 'none'; }
function gmFill(autoplay) { GM.list = window.LTFGM.items(GM.coll, $('#isl-gmsub').value); GM.order = GM.list.map((_, i) => i).sort(() => Math.random() - 0.5); GM.pos = 0; gmLoad(autoplay); }
function gmCur() { return GM.list[GM.order[GM.pos]]; }
function gmLoad(autoplay) {
  const x = gmCur(); if (!x) return; gmau.src = x.url; GM.startedUid = null;
  $('#isl-gmcredit').innerHTML = `<b>${esc(x.title)}</b> · ${esc(x.credit)}${x.len ? ' · ' + esc(x.len) : ''}`;
  if (autoplay) { const p = gmau.play(); if (p && p.catch) p.catch(() => {}); }
}
gmau.addEventListener('play', () => { const x = gmCur(); if (!x) return; if (MODE !== 'gm') tab('gm'); if (GM.startedUid !== x.uid) { GM.startedUid = x.uid; if (window.LTFGM.played) window.LTFGM.played(x); songStart(x.title + (x.src === 'c64' ? ' — ' + x.by : x.mg ? ' — mobygratis' : ' — Kevin MacLeod'), { bpm: parseFloat(x.bpm), credit: x.src === 'c64' ? 'remix by ' + x.by : x.mg ? 'THANK YOU, MOBYGRATIS!' : 'Kevin MacLeod, CC BY 4.0' }); } setPlaying(true); });
gmau.addEventListener('pause', () => { if (!gmau.ended) setPlaying(false); });
gmau.addEventListener('ended', () => { GM.pos = (GM.pos + 1) % GM.order.length; gmLoad(true); });
let gmErr = 0; gmau.addEventListener('error', () => { if (!gmau.getAttribute('src')) return; if (++gmErr < 5) setTimeout(() => { GM.pos = (GM.pos + 1) % GM.order.length; gmLoad(true); }, 1200); });
gmau.addEventListener('playing', () => { gmErr = 0; });
$('#isl-gmnext').addEventListener('click', () => { GM.pos = (GM.pos + 1) % GM.order.length; gmLoad(true); });
$('#isl-gmcoll').addEventListener('change', function () { GM.coll = this.value; gmSub(); gmFill(false); });
$('#isl-gmsub').addEventListener('change', () => gmFill(false));
(function gmInit(n) {
  if (!window.LTFGM) { if (n < 100) setTimeout(() => gmInit(n + 1), 100); return; }
  window.LTFGM.load().then(() => {
    window.LTFGM.collections.forEach((c) => { const op = document.createElement('option'); op.value = c.key; op.textContent = c.label; $('#isl-gmcoll').appendChild(op); });
    GM.ready = true; gmSub(); gmFill(false);
    [...$('#isl-qsel').options].forEach((o) => { if (/^mobygratis/.test(o.value) && !window.LTFGM.collections.some((c) => c.key === o.value)) { o.disabled = true; o.textContent += ' (coming soon)'; } });
    if (GM.pending) { const k = GM.pending; GM.pending = null; gmPlay(k); }
  }).catch(() => {});
})(0);
function gmPlay(key) { tab('gm'); if (!GM.ready) { GM.pending = key; return; } if (key && key !== GM.coll) { GM.coll = key; $('#isl-gmcoll').value = key; gmSub(); } gmFill(true); }

/* My Spotify app (one connection for the whole site, via rko/ltf-spotify.js) */
let acctStop = null;
function acctSync() {
  if (MODE === 'acct' && !acctStop && window.LTFSP) acctStop = window.LTFSP.follow({ onSong: (t) => songStart(t), onPlaying: (p) => { if (MODE === 'acct') setPlaying(p); }, onStatus: (t) => { $('#isl-acct-status').textContent = t; } });
  if (MODE !== 'acct' && acctStop) { acctStop(); acctStop = null; }
}
(function acctInit(n) { if (!window.LTFSP) { if (n < 100) setTimeout(() => acctInit(n + 1), 100); return; } window.LTFSP.button($('#isl-acct-btn'), { ghostClass: 'alt' }); acctSync(); })(0);

/* Mic */
$('#isl-mic').addEventListener('click', async function () {
  if (micA) { micA.stream.getTracks().forEach((t) => t.stop()); micA.ctx.close(); micA = null; this.textContent = '\u{1F3A4} Start listening'; setPlaying(false); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); const an = ctx.createAnalyser(); an.fftSize = 1024; ctx.createMediaStreamSource(stream).connect(an);
    micA = { stream, ctx, an, buf: new Float32Array(1024), avg: 0.02, quiet: 0 }; this.textContent = '■ Stop listening';
    songStart('Music in the room');
    const watch = () => { if (!micA) return; micA.an.getFloatTimeDomainData(micA.buf); let s = 0; for (const v of micA.buf) s += v * v; const rms = Math.sqrt(s / 1024); if (rms < 0.01) { micA.quiet += 200; if (micA.quiet > 2500 && S.playing) setPlaying(false); } else { if (micA.quiet > 2500) songStart('Music in the room'); micA.quiet = 0; if (!S.playing) setPlaying(true); } setTimeout(watch, 200); }; watch();
  } catch (e) { $('#isl-now').textContent = 'The microphone is blocked. Allow it in your browser and try again.'; }
});

/* Apple Music */
const AM = { t: 0, on: false, timer: null };
$('#isl-amload').addEventListener('click', () => { const v = $('#isl-amurl').value.trim(), m = v.match(/^https?:\/\/(?:embed\.)?music\.apple\.com\/(.+)$/i); if (!m) { $('#isl-now').textContent = 'That doesn’t look like an Apple Music link.'; return; } const u = 'https://embed.music.apple.com/' + m[1]; $('#isl-amembed').innerHTML = `<iframe id="isl-amframe" src="${esc(u)}" height="${/[?&]i=|\/song\//.test(u) ? 175 : 450}" style="width:100%;border:0;border-radius:10px" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" title="Apple Music player"></iframe>`; });
function amSet(on) { AM.on = on; $('#isl-ampause').textContent = on ? '⏸ Pause' : '▶ Resume'; setPlaying(on); clearInterval(AM.timer); if (on) AM.timer = setInterval(() => { if (MODE === 'am' && AM.on && ++AM.t >= 210) { AM.t = 0; songStart(null); } }, 1000); }
$('#isl-amnext').addEventListener('click', () => { AM.t = 0; songStart(null); amSet(true); });
$('#isl-ampause').addEventListener('click', () => { if (AM.on) amSet(false); else { if (S.cur < 0) songStart(null); amSet(true); } });
window.addEventListener('blur', () => setTimeout(() => { const a = document.activeElement; if (MODE === 'am' && a && a.id === 'isl-amframe' && !AM.on) { if (S.cur < 0) songStart(null); amSet(true); } }, 0));

/* Type my songs */
$('#isl-tstart').addEventListener('click', () => { songStart($('#isl-typed').value.trim() || null); $('#isl-typed').value = ''; });
$('#isl-typed').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#isl-tstart').click(); });
$('#isl-tend').addEventListener('click', songEnd);

/* Quick play */
try { const q = localStorage.getItem('isl.qp'); if (q) $('#isl-qsel').value = q; } catch (e) {}
$('#isl-qgo').addEventListener('click', () => {
  const v = $('#isl-qsel').value; try { localStorage.setItem('isl.qp', v); } catch (e) {}
  if (v === 'spotify') { if (!gmau.paused) gmau.pause(); tab('sp'); const p = pick(PLAYLISTS); sel.value = p[1]; loadEmbed('spotify:playlist:' + p[1], true); }
  else gmPlay(v);
});
$('#isl-qstop').addEventListener('click', () => { if (MODE === 'gm') gmau.pause(); else if (MODE === 'sp' && ctrl) { try { ctrl.togglePlay(); } catch (e) {} } else setPlaying(false); });
function syncQuick() { $('#isl-qstop').hidden = !S.playing; $('#isl-fplay').textContent = S.playing ? '\u23F8' : '\u25B6'; }
$('#isl-fplay').addEventListener('click', () => { if (S.playing) $('#isl-qstop').click(); else if (MODE === 'gm' && gmau.getAttribute('src')) gmau.play().catch(() => {}); else $('#isl-qgo').click(); });

/* Full screen */
function fitFull() {
  const box = $('#isl');
  if (!box.classList.contains('isl-full')) { cv.style.width = ''; cv.style.height = ''; ['top', 'left', 'width', 'height'].forEach((k) => { box.style[k] = ''; }); return; }
  // iPhone Safari has no real full screen for pages: size the layer to exactly what's visible (its toolbars come and go)
  const v = window.visualViewport, vw = v ? v.width : window.innerWidth, vh = v ? v.height : window.innerHeight;
  box.style.top = (v ? v.offsetTop : 0) + 'px'; box.style.left = (v ? v.offsetLeft : 0) + 'px'; box.style.width = vw + 'px'; box.style.height = vh + 'px';
  const k = Math.min(vw / W, vh / H); cv.style.width = Math.floor(W * k) + 'px'; cv.style.height = Math.floor(H * k) + 'px';
}
const refit = () => { [30, 250, 700].forEach((t) => setTimeout(fitFull, t)); };
window.addEventListener('resize', refit); window.addEventListener('orientationchange', refit);
if (window.visualViewport) { window.visualViewport.addEventListener('resize', refit); window.visualViewport.addEventListener('scroll', () => setTimeout(fitFull, 30)); }
// while full screen, swipes must not scroll the page underneath (that's what makes Safari's bars jump in and out)
$('#isl').addEventListener('touchmove', (e) => { if ($('#isl').classList.contains('isl-full') && !/select|input/i.test(e.target.tagName)) e.preventDefault(); }, { passive: false });
function setFull(on) { setTimeout(islWake, 0); const ov = $('.isl-ov'); if (ov) (on ? $('.isl-hud') : $('.isl-stage')).appendChild(ov); $('#isl').classList.toggle('isl-full', on); document.documentElement.classList.toggle('isl-noscroll', on); $('#isl-fs').textContent = on ? '✕ Exit' : '⤢ Full screen'; refit(); }
$('#isl-enc').addEventListener('click', (e) => { e.stopPropagation(); encStart(); islWake(); });
$('#isl-fs').addEventListener('click', () => { const on = !$('#isl').classList.contains('isl-full'); setFull(on); const el = $('#isl'); try { if (on && el.requestFullscreen) el.requestFullscreen().catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {} });
/* full screen, held sideways: hide the control bar after 4 seconds; any tap, move or key brings it back */
let islIdleT = 0;
function islWake() { const el = $('#isl'); el.classList.remove('isl-idle'); clearTimeout(islIdleT); if (el.classList.contains('isl-full') && innerWidth > innerHeight) islIdleT = setTimeout(() => { const ov = el.querySelector('.isl-hud'); const ae = document.activeElement; if (ov && ov.contains(ae) && ae.tagName === 'SELECT' && !islSelHeld) { islSelHeld = true; return islWake(); } if (ae && ov && ov.contains(ae)) ae.blur(); islSelHeld = false; el.classList.add('isl-idle'); }, 4000); }
let islSelHeld = false;
document.addEventListener('change', (e) => { const t = e.target; if (t && t.tagName === 'SELECT' && t.closest('#isl .isl-hud')) setTimeout(() => t.blur(), 50); }, true);
['pointerdown', 'pointermove', 'touchstart', 'keydown'].forEach((ev) => document.addEventListener(ev, () => { if ($('#isl').classList.contains('isl-full')) islWake(); }, { passive: true }));
window.addEventListener('resize', islWake); window.addEventListener('orientationchange', islWake);
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && $('#isl').classList.contains('isl-full')) setFull(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setFull(false); });

/* ---------------- furniture packs ---------------- */
const PACKS = {
  original: { roofStyle: 'thatch', wall: '#b07a43', wallD: '#7d532b', roof: '#d9b05a', roofD: '#9c7a33', door: '#4a2f17', trim: '#5e3d1c', chair: '#8a5a2b', table: '#9b6b38', top: '#c48a4a', bulbs: ['#ffd27a', '#ff9a3c', '#ffefb0'], spk: '#3a2a1c', spkCone: '#8c7a62', glow: '#ffc56b', chim: '#8a7a6a', board: ['#e8913a', '#ffffff'] },
  tiki: { roofStyle: 'thatch', wall: '#9a6a36', wallD: '#6a4420', roof: '#b8903a', roofD: '#7a5a1e', door: '#2a160a', trim: '#3a2410', chair: '#a07038', table: '#8a5a2b', top: '#c48a4a', bulbs: ['#ff5a2a', '#ffd24a', '#2fe07a', '#ff6fa8'], spk: '#6a4020', spkCone: '#3a2410', glow: '#ffae4a', chim: '#7a6a5a', board: ['#2f9a4a', '#ffd24a'] },
  future: { roofStyle: 'dome', wall: '#c9d3e6', wallD: '#8b97b3', roof: '#e9eef8', roofD: '#9aa6c4', door: '#20263f', trim: '#5ef0ff', chair: '#d8e2f5', table: '#9fb0d6', top: '#5ef0ff', bulbs: ['#5ef0ff', '#ff4fd8', '#9dff6b'], spk: '#1a1f36', spkCone: '#5ef0ff', glow: '#7af4ff', chim: '#9aa6c4', chimTop: '#5ef0ff', board: ['#5ef0ff', '#ff4fd8'] },
  fancy: { roofStyle: 'gable', wall: '#efe2c4', wallD: '#c9b590', roof: '#7a2232', roofD: '#4e1420', door: '#3a1d12', trim: '#d4af37', chair: '#7a2232', table: '#3a2414', top: '#f7f3ea', bulbs: ['#ffe9a8', '#ffd27a', '#fff6dc'], spk: '#3a2414', spkCone: '#d4af37', glow: '#ffe2a0', chim: '#a05040', board: ['#d4af37', '#7a2232'] },
  seventies: { roofStyle: 'gable', wall: '#f3e2b8', wallD: '#c8b080', roof: '#6b3e1e', roofD: '#40220e', door: '#e8913a', trim: '#6b3e1e', chair: '#e8913a', table: '#a0522d', top: '#a0522d', bulbs: ['#ff8a3c', '#f2c230', '#9acd32', '#ff6a3c'], spk: '#a0703a', spkCone: '#e8913a', glow: '#ffb060', chim: '#8a5a3a', board: ['#e8913a', '#6b3e1e'] },
  eighties: { roofStyle: 'flat', wall: '#f4f0ff', wallD: '#c0bad8', roof: '#4a2a7a', roofD: '#2a1450', door: '#1a1a2a', trim: '#ff4fd8', chair: '#ff4fd8', table: '#222222', top: '#222222', bulbs: ['#ff4fd8', '#5ef0ff', '#ffe14a', '#9a8cff'], spk: '#15151c', spkCone: '#5ef0ff', glow: '#ff9af0', chim: '#5a5a6a', chimTop: '#ff4fd8', board: ['#ff4fd8', '#5ef0ff'] }
};

setPack(S.pack);

/* ---------------- characters ---------------- */
const OUTFITS = [
  { name: 'his castaway stripes', hat: 'straw', hc: '#e8c96a', hd: '#b8963a', sa: '#f4efe6', sb: '#d23a3a', pat: 'stripe', pants: '#3a5aa8' },
  { name: 'a Hawaiian shirt', hat: 'bucket', hc: '#f2e0b0', hd: '#c8b080', sa: '#2fa7a0', sb: '#ff6fa8', pat: 'flowers', pants: '#e8d8b0' },
  { name: 'his pirate captain coat', hat: 'tricorn', hc: '#1a1a1a', hd: '#d4af37', sa: '#a01a2a', sb: '#d4af37', pat: 'buttons', pants: '#1a1a2a', feet: '#2a1a10' },
  { name: 'a tuxedo', hat: 'top', hc: '#1a1a1a', hd: '#a01a2a', sa: '#1a1a1a', sb: '#ffffff', pat: 'tux', pants: '#1a1a1a', feet: '#111111' },
  { name: 'a space suit', hat: 'helmet', hc: '#e8eef8', hd: '#5ef0ff', sa: '#e8eef8', sb: '#ff8a3c', pat: 'belt', pants: '#d0d8e8', feet: '#9aa6c4' },
  { name: 'lumberjack plaid', hat: 'beanie', hc: '#2f7a3a', hd: '#1f5a2a', sa: '#c02020', sb: '#2a1a1a', pat: 'plaid', pants: '#3a4a6a', feet: '#5a3a1c' },
  { name: 'his disco suit', hat: 'afro', hc: '#3a2210', hd: '#2a160a', sa: '#ffffff', sb: '#ffd24a', pat: 'collar', pants: '#ffffff', feet: '#ffd24a' },
  { name: 'board shorts', hat: 'bandana', hc: '#ff8a3c', hd: '#c05a1a', sa: 'skin', sb: '#ffd24a', pat: 'bare', pants: '#5ee0ff' },
  { name: 'wizard robes', hat: 'wizard', hc: '#5a2a9a', hd: '#ffd24a', sa: '#5a2a9a', sb: '#ffd24a', pat: 'stars', pants: '#5a2a9a', feet: '#5a2a9a' },
  { name: 'a sailor suit', hat: 'sailor', hc: '#ffffff', hd: '#2747b8', sa: '#ffffff', sb: '#2747b8', pat: 'stripe', pants: '#2747b8', feet: '#111111' }
];
const BOWLS = [206, 220, 234], FEED_X = 192;
const hero = { outfit: 0, x: 140, y: 186, dir: 1, state: 'idle', st: 0, target: 140, frame: 0, eat: 0, timer: 2, raft: null };
const CATS = [
  { x: 230, y: 0, dir: -1, col: '#e8913a', dark: '#b3621f', name: 'Marmalade', state: 'walk', t: 0, tx: 200, inside: false, peek: 0 },
  { x: 120, y: 0, dir: 1, col: '#2b2b33', dark: '#121218', name: 'Pepper', state: 'sit', t: 0, tx: 120, inside: false, peek: 0 },
  { x: 300, y: 0, dir: 1, col: '#e9e6df', dark: '#a9a49a', name: 'Biscuit', state: 'walk', t: 0, tx: 260, inside: false, peek: 0 }
];
const HUT = { x: 286, door: 300, win: 324, y: 168 };
const CHAIR = 244, TABLE = 262, FIRE = 168, SPK = [222, 360];
const DRUMMERS = [
  { kind: 'conga', name: 'Conga Carmen', every: 1, offset: 0, skin: '#8a5a3c', shirt: '#e8413a' },
  { kind: 'steel', name: 'Steel-pan Sol', every: 0.5, offset: 0, skin: '#6b4430', shirt: '#2fa7a0' },
  { kind: 'taiko', name: 'Taiko Toru', every: 2, offset: 0, skin: '#e0b48a', shirt: '#2c2c3c' },
  { kind: 'snare', name: 'Snare Sergeant', every: 0.25, offset: 0, skin: '#f0c9a0', shirt: '#2747b8' },
  { kind: 'bongo', name: 'Bongo Bea', every: 0.5, offset: 0.25, skin: '#c48a5a', shirt: '#f2c230' },
  { kind: 'robot', name: 'Drum-o-Tron 3000', every: 1 / 3, offset: 0, skin: '#9aa6c4', shirt: '#5ef0ff' }
];
const DANCES = ['sway', 'jump', 'spin', 'robot', 'twist', 'wave'];
const DCOL = ['#ff6fa8', '#7affb2', '#ffd24a', '#9a8cff', '#ff8a3c', '#5ee0ff', '#ffffff'];

function spawnRaft(type) {
  if (S.rafts.filter((r) => r.state !== 'gone').length >= 5) return;
  type = type || pick(['pot', 'pot', 'drum', 'drum', 'dance']);
  const used = S.rafts.filter((r) => r.state !== 'gone').map((r) => r.land);
  let land = 0; for (let k = 0; k < 20; k++) { land = ri(66, 176); if (used.every((u) => Math.abs(u - land) > 26)) break; }
  const r = { type, x: rnd() < 0.5 ? -30 : W + 30, land, y: HORIZON + 6, state: 'drift', t: 0, life: 150 + rnd() * 90, lit: 0, hue: rnd() * 360 };
  r.x = rnd() < 0.7 ? -30 : W + 30; r.tgtY = shoreY(land) + 1;
  if (type === 'drum') { const free = DRUMMERS.filter((d) => !S.rafts.some((o) => o.state !== 'gone' && o.drummer === d)); r.drummer = pick(free.length ? free : DRUMMERS); r.hits = []; }
  if (type === 'visit') { const vv = pick(VISITORS); r.v = { kind: vv.kind, name: vv.name, st: 'aboard', t: 0, ox: 0, oy: 0 }; r.life = 1e9; r.land = ri(70, 160); r.tgtY = shoreY(r.land) + 1; r.x = rnd() < 0.6 ? -30 : W + 30; }
  if (type === 'dance') r.dancers = Array.from({ length: ri(2, 3) }, () => ({ style: pick(DANCES), col: pick(DCOL), skin: pick(['#f0c9a0', '#c48a5a', '#8a5a3c', '#e0b48a', '#6b4430']), ph: rnd() * 6 }));
  S.rafts.push(r); S.lastRaft = S.t;
}

/* ---------------- drawing: sky, sea, island ---------------- */
const STARS = Array.from({ length: 90 }, () => ({ x: rnd() * W, y: rnd() * (HORIZON - 8), p: rnd() * 6, s: rnd() < 0.15 ? 2 : 1 }));
const CLOUDS = Array.from({ length: 5 }, () => ({ x: rnd() * W, y: 14 + rnd() * 50, w: 30 + rnd() * 40, v: 2 + rnd() * 3 }));
function drawSky(d) {
  const m = ((S.clock % 30) + 30) % 30, dusky = m > 12.5 && m < 16.5 ? 1 - Math.abs(m - 14.5) / 2 : m > 28 || m < 2 ? 1 - Math.min(Math.abs(m - 0.5), Math.abs(m - 30.5)) / 2 : 0;
  const top = mix(mix('#0a0f2e', '#3f8fe0', d), '#6b2e7a', clamp(dusky, 0, 1) * 0.7);
  const bot = mix(mix('#1b2a5c', '#bfe6ff', d), '#ff9a4a', clamp(dusky, 0, 1) * 0.85);
  for (let y = 0; y < HORIZON; y += 2) { R(0, y, W, 2, mix(rgb2hex(top), rgb2hex(bot), y / HORIZON)); }
  // stars
  const nightA = 1 - d;
  const kick = S.playing ? Math.exp(-(S.beat % 1) * 6) : 0;
  if (nightA > 0.05) STARS.forEach((s, i) => { const a = nightA * (0.5 + 0.5 * Math.sin(S.t * 2 + s.p)); g.globalAlpha = a; R(s.x, s.y, s.s, s.s, '#fff8e0'); if (S.swirl > 0.05 && i % 6 === 0) { g.globalAlpha = a * S.swirl * (0.25 + kick * 0.35); const rr = 2 + Math.round(kick * 2); R(s.x - rr, s.y, 1, 1, '#f6d65a'); R(s.x + rr, s.y, 1, 1, '#f6d65a'); R(s.x, s.y - rr, 1, 1, '#f6d65a'); R(s.x, s.y + rr, 1, 1, '#f6d65a'); } }); g.globalAlpha = 1;
  // sun / moon on an arc
  const sunT = m / 15, moonT = (m - 15) / 15;
  let SX = null, SY = null, MX = null, MY = null;
  if (m < 15.5) { const sx = lerp(-20, W + 20, sunT), sy = HORIZON - Math.sin(Math.PI * clamp(sunT, 0, 1)) * 90 + 6; SX = sx; SY = sy;
    g.globalAlpha = 0.18 + kick * 0.18; circle(sx, sy, 17 + Math.round(kick * 3 + S.energy * 2), '#ffd27a');
    if (S.playing) { for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2 + S.t * 0.15; g.globalAlpha = 0.25 * S.energy; for (let r = 19; r < 24 + kick * 5; r++) P(sx + Math.cos(an) * r, sy + Math.sin(an) * r, '#fff0b0'); } }
    g.globalAlpha = 1; circle(sx, sy, 11 + Math.round(kick * 1.5), mix('#ff7a2a', '#fff3b0', d)); }
  if (m > 14.5) { const mx = lerp(-20, W + 20, clamp(moonT, 0, 1)), my = HORIZON - Math.sin(Math.PI * clamp(moonT, 0, 1)) * 84 + 6; MX = mx; MY = my;
    drawMoonFish(mx, my, d);
    g.globalAlpha = 0.08 + kick * 0.14; circle(mx, my, 13 + Math.round(kick * 3), '#f3f0dc'); g.globalAlpha = 1;
    crescent(mx, my, 8 + Math.round(kick), '#f3f0dc'); }
  drawSwirls(MX, MY, SX, SY, d);
  // clouds
  CLOUDS.forEach((c) => { c.x += c.v * 0.016; if (c.x > W + 60) c.x = -60; g.globalAlpha = 0.25 + d * 0.5; const col = mix('#3a4a7a', '#ffffff', d); R(c.x, c.y, c.w, 4, col); R(c.x + 6, c.y - 3, c.w * 0.6, 3, col); R(c.x + 10, c.y + 4, c.w * 0.7, 2, col); g.globalAlpha = 1; });
  // distant island silhouette
  const far = mix('#121a3a', '#5a86a8', d);
  R(250, HORIZON - 6, 70, 6, far); R(262, HORIZON - 10, 40, 4, far); R(276, HORIZON - 13, 14, 3, far);
}
function crescent(x, y, r, c) { g.fillStyle = c; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (dx * dx + dy * dy > r * r) continue; const ex = dx - 3, ey = dy + 2; if (ex * ex + ey * ey <= (r - 1) * (r - 1)) continue; g.fillRect(Math.round(x + dx), Math.round(y + dy), 1, 1); } }
function rgb2hex(c) { if (c[0] === '#') return c; const m = c.match(/\d+/g).map(Number); return '#' + m.map((v) => v.toString(16).padStart(2, '0')).join(''); }
function circle(x, y, r, c) { g.fillStyle = c; for (let dy = -r; dy <= r; dy++) { const w = Math.floor(Math.sqrt(r * r - dy * dy)); g.fillRect(Math.round(x - w), Math.round(y + dy), w * 2 + 1, 1); } }
/* the shore: straight in front of the hut, a shallow cove bites into the beach on the far side */
const COVE = 180, COVE_DEPTH = 30;
function coveF(x) { if (x >= COVE) return 0; const t = (COVE - x) / COVE; return t * t * (3 - 2 * t); }
function shoreY(x) { return SHORE + Math.round(Math.sin(x * 0.045 + 1) * 3 + Math.sin(x * 0.12) * 1.5 + COVE_DEPTH * coveF(x)); }
function washY(x) { return shoreY(x) + Math.sin(S.t * 0.9 + x * 0.01) * (1 + 3 * coveF(x)); }
function drawSea(d) {
  for (let y = HORIZON; y < SHORE + COVE_DEPTH + 10; y++) { const f = Math.min(1, (y - HORIZON) / (SHORE - HORIZON)), sh = clamp((y - SHORE) / COVE_DEPTH, 0, 1); R(0, y, W, 1, mix(rgb2hex(mix(mix('#0b1a3e', '#1f6fb0', d), mix('#14306a', '#38b6c9', d), f)), mix('#1f4a7a', '#6fe0d6', d), sh * 0.7)); }
  drawShip(d);
  // glints / moon path
  for (let i = 0; i < 70; i++) { const x = (i * 53 + Math.floor(S.t * (6 + (i % 5)))) % W, y = HORIZON + 2 + ((i * 7) % (SHORE - HORIZON)); g.globalAlpha = 0.35 + 0.3 * Math.sin(S.t * 3 + i); R(x, y, 3 + (i % 3), 1, d > 0.5 ? '#d9f6ff' : '#9fb4ff'); }
  g.globalAlpha = 1;
}
function drawBeach(d) {
  const sand = mix('#5a4a6a', '#f1d79a', d), sandD = mix('#423650', '#d8b874', d), foam = mix('#9fb4d8', '#ffffff', d);
  const wet = mix('#3e3450', '#cfae6c', d);
  for (let x = 0; x < W; x++) {
    const sy = shoreY(x), wy = Math.round(washY(x)), cf = coveF(x);
    R(x, sy, 1, H - sy, sand);
    if (cf > 0.05) { R(x, sy, 1, 4 + Math.round(cf * 3), wet); if (wy > sy) { g.globalAlpha = 0.75; R(x, sy, 1, wy - sy, mix('#2a5a8a', '#7fe6dc', d)); g.globalAlpha = 1; } }
    P(x, Math.max(sy, wy) - 1 + Math.sin(S.t * 1.3 + x * 0.05), foam);
    if (cf > 0.2 && (x + Math.floor(S.t * 4)) % 9 === 0) P(x, Math.max(sy, wy) - 3, foam);
    if ((x * 13) % 17 === 0) P(x, sy + 8 + (x % 23), sandD);
  }
  for (let i = 0; i < 40; i++) { const x = (i * 97) % W, y = 170 + (i * 37) % 44; if (y > shoreY(x) + 6) P(x, y, sandD); }
  // shells and a starfish on the cove beach
  P(70, 196, '#ffd0c0'); P(71, 196, '#ffd0c0'); P(118, 204, '#f6e6d0'); R(40, 207, 3, 1, '#ff8a5a'); R(41, 206, 1, 3, '#ff8a5a');
}
function palm(x, base, h, d, lean) {
  const trunk = mix('#3a2a20', '#8a6038', d), leaf = mix('#173a2a', '#2f9a4a', d), leafD = mix('#0f2a1e', '#1f7034', d);
  for (let i = 0; i < h; i++) { const xx = x + Math.round(Math.sin(i / h * 1.6) * lean); R(xx, base - i, 4, 1, i % 4 === 0 ? mix('#2a1e16', '#6a4628', d) : trunk); }
  const tx = x + Math.round(Math.sin(1.6) * lean) + 2, ty = base - h;
  const sway = Math.sin(S.t * 0.8 + x) * 1.5;
  [[-1, 0.2], [1, 0.25], [-1, -0.5], [1, -0.45], [0.2, -1]].forEach(([dx, dy], k) => {
    for (let j = 0; j < 22; j++) { const px = tx + dx * j + (dy > 0 ? 0 : sway * j / 22), py = ty + dy * j + (j * j) / 40 * (dy > -0.8 ? 1 : 0.2); R(px, py, 2, 2, k % 2 ? leaf : leafD); if (j % 3 === 0) R(px, py + 2, 1, 2, leafD); }
  });
  R(tx - 2, ty - 1, 3, 3, mix('#3a2a20', '#6a4a20', d)); R(tx + 1, ty, 3, 3, mix('#3a2a20', '#7a5a2a', d));
}
function drawHut(d) {
  const p = PACKS[S.pack], k = S.pack, x = HUT.x, y = HUT.y;
  const wall = mix(p.wallD, p.wall, d * 0.8 + 0.2), roof = mix(p.roofD, p.roof, d * 0.8 + 0.2), dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65);
  // chimney (behind the roof) - the smoke comes out of here
  R(x + 47, y - 64, 8, 30, dim(p.chim || '#6a6470')); R(x + 46, y - 66, 10, 3, dim(p.chimTop || '#4a4450'));
  R(x - 2, y, 70, 4, mix('#2a1d14', p.trim, 0.4));
  R(x, y - 34, 66, 34, wall);
  if (k === 'original') for (let i = 0; i < 66; i += 5) R(x + i, y - 34, 1, 34, mix(p.wallD, '#5e3d1c', 0.5));
  if (k === 'tiki') { for (let i = 0; i < 34; i += 4) R(x, y - 34 + i, 66, 1, mix(p.wallD, '#3a2410', 0.5)); R(x - 2, y - 36, 4, 36, dim('#c8a060')); R(x + 64, y - 36, 4, 36, dim('#c8a060'));
    // carved tiki mask on the wall
    R(x + 3, y - 30, 9, 18, dim('#5a3418')); R(x + 4, y - 27, 3, 2, dim('#ffd24a')); R(x + 8, y - 27, 3, 2, dim('#ffd24a')); R(x + 5, y - 22, 5, 1, dim('#2a160a')); R(x + 4, y - 19, 7, 3, dim('#e8413a')); R(x + 5, y - 18, 5, 1, dim('#ffffff')); }
  if (k === 'future') { R(x, y - 34, 66, 2, p.trim); R(x, y - 3, 66, 1, p.trim); }
  if (k === 'fancy') { R(x - 2, y - 34, 4, 34, '#f7f3ea'); R(x + 64, y - 34, 4, 34, '#f7f3ea'); }
  if (k === 'seventies') { [['#e8913a', 10], ['#f2c230', 14], ['#a0522d', 18], ['#6b8e23', 22]].forEach(([c, o]) => R(x, y - 34 + o, 66, 3, dim(c))); }
  if (k === 'eighties') { const cs = ['#ff4fd8', '#5ef0ff', '#ffe14a', '#9a8cff'];
    for (let i = 0; i < 9; i++) { const px = x + 3 + (i * 23) % 60, py = y - 31 + (i * 11) % 26; if (px > HUT.door - 4 && px < HUT.door + 14) continue; if (px > HUT.win - 4 && px < HUT.win + 20 && py < y - 12) continue; const c = dim(cs[i % 4]);
      if (i % 3 === 0) { for (let t = 0; t < 4; t++) R(px + t, py + 3 - t, 1, t + 1, c); } else if (i % 3 === 1) { for (let t = 0; t < 7; t++) P(px + t, py + (t % 2), c); } else R(px, py, 2, 2, c); } }
  // roof
  const style = p.roofStyle;
  if (style === 'dome') { for (let i = 0; i < 18; i++) { const w = 74 - Math.round((i * i) / 6); R(x + 33 - w / 2, y - 35 - i, w, 1, i % 6 === 0 ? p.trim : roof); } }
  else if (style === 'flat') { R(x - 6, y - 42, 78, 8, roof); R(x - 6, y - 42, 78, 1, p.trim); R(x - 6, y - 35, 78, 1, mix(p.roofD, p.trim, 0.5)); if (S.playing) { g.globalAlpha = 0.5 + 0.5 * Math.exp(-(S.beat % 1) * 5); R(x - 6, y - 43, 78, 1, p.trim); g.globalAlpha = 1; } }
  else { for (let i = 0; i < 20; i++) R(x - 6 + i * 1.2, y - 36 - i, 78 - i * 2.4, 1, i % 3 === 0 ? mix(p.roofD, roof, 0.4) : roof); }
  if (style === 'thatch') { const n = k === 'tiki' ? 13 : 9; for (let i = 0; i < n; i++) R(x - 6 + i * (78 / n), y - 36, 2, k === 'tiki' ? 6 : 4, p.roofD); }
  // window + door glow at night
  const night = 1 - d, glow = night > 0.3 ? p.glow : mix('#1b2433', '#2b3a55', d);
  const winX = HUT.win, winY = y - 26, doorX = HUT.door;
  if (k === 'seventies') { circle(winX + 9, winY + 6, 8, p.trim); circle(winX + 9, winY + 6, 6, glow); R(winX + 8, winY, 2, 12, p.trim); }
  else { R(winX - 1, winY - 1, 20, 14, p.trim); R(winX, winY, 18, 12, glow); R(winX + 8, winY, 2, 12, p.trim); R(winX, winY + 5, 18, 1, p.trim); }
  R(doorX - 1, y - 24, 14, 24, p.trim); R(doorX, y - 23, 12, 23, night > 0.3 ? mix(p.door, glow, 0.55) : p.door);
  if (night > 0.3) { for (let j = 0; j < 14; j++) { g.globalAlpha = 0.11 * night * (1 - j / 14); R(doorX - j, y + 4 + j, 12 + j * 2, 1, p.glow); R(winX - 2 - j, y + 4 + j, 22 + j * 2, 1, p.glow); } g.globalAlpha = 1; }
  ENC.hutGuitars.forEach((gt, i) => drawGuitar([292, 347, 318][i], y - 9, gt, -Math.PI / 2, dim));
  CATS.forEach((c) => { if (!c.inside || c.peek <= 0) return; const atWin = c.peekAt === 'win'; const cx = atWin ? winX + 2 + (c.peekX || 0) : doorX + 2, cy = atWin ? winY + 6 : y - 8; catSprite(cx, cy, 1, c, true, night > 0.3); });
}
function drawFurniture(d) {
  const p = PACKS[S.pack], k = S.pack, dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65), night = 1 - d;
  const cx = CHAIR, by = 180, tx = TABLE;
  // chair
  if (k === 'original' || k === 'tiki') { const c = dim(p.chair); R(cx, by - 14, 2, 14, c); R(cx + 8, by - 6, 2, 6, c); R(cx, by - 7, 10, 2, c); R(cx, by - 14, 2, 8, dim(k === 'tiki' ? '#c8a060' : '#6a4220')); if (k === 'tiki') { R(cx + 2, by - 13, 1, 6, dim('#c8a060')); R(cx - 1, by - 15, 4, 1, dim('#2f9a4a')); } }
  else if (k === 'future') { R(cx - 1, by - 9, 12, 3, dim(p.chair)); R(cx - 1, by - 16, 3, 9, dim(p.chair)); g.globalAlpha = 0.5 + 0.3 * Math.sin(S.t * 3); R(cx + 1, by - 3, 8, 1, p.trim); g.globalAlpha = 1; }
  else if (k === 'seventies') { circle(cx + 5, by - 11, 7, dim('#e8913a')); circle(cx + 6, by - 10, 5, dim('#5a2a10')); R(cx + 3, by - 7, 6, 2, dim('#f2c230')); R(cx + 4, by - 4, 2, 4, dim('#c0c0c0')); R(cx + 1, by - 1, 8, 1, dim('#c0c0c0')); }
  else if (k === 'eighties') { R(cx, by - 8, 11, 3, dim('#5ef0ff')); for (let t = 0; t < 8; t++) R(cx, by - 16 + t, Math.max(1, 8 - t), 1, dim('#ff4fd8')); R(cx + 1, by - 5, 1, 5, dim('#222')); R(cx + 9, by - 5, 1, 5, dim('#222')); P(cx + 4, by - 7, dim('#ffe14a')); P(cx + 7, by - 7, dim('#222')); }
  else { R(cx - 1, by - 16, 12, 9, dim(p.chair)); R(cx - 2, by - 8, 14, 4, dim(p.chair)); R(cx - 2, by - 4, 2, 4, dim('#d4af37')); R(cx + 10, by - 4, 2, 4, dim('#d4af37')); }
  // table
  if (k === 'original') { R(tx, by - 9, 14, 9, dim('#7a5028')); R(tx, by - 9, 14, 1, dim('#a8783e')); R(tx + 3, by - 12, 3, 3, dim('#d9d2c0')); R(tx + 9, by - 13, 2, 4, dim('#5aa0d0')); }
  else if (k === 'tiki') { R(tx + 1, by - 10, 12, 10, dim('#8a5a2b')); R(tx + 1, by - 8, 12, 1, dim('#3a2410')); R(tx + 1, by - 3, 12, 1, dim('#3a2410')); circle(tx + 5, by - 12, 2, dim('#6a4628')); R(tx + 6, by - 17, 1, 4, dim('#ffffff')); R(tx + 4, by - 18, 5, 1, dim('#ff6fa8')); R(tx + 9, by - 13, 3, 3, dim('#ffd24a')); }
  else if (k === 'future') { R(tx, by - 10, 14, 2, dim(p.top)); R(tx + 6, by - 8, 2, 8, dim(p.table)); R(tx + 3, by - 12, 2, 2, '#ff4fd8'); }
  else if (k === 'seventies') { R(tx, by - 9, 14, 2, dim('#a0522d')); R(tx + 2, by - 7, 2, 7, dim('#6b3e1e')); R(tx + 10, by - 7, 2, 7, dim('#6b3e1e'));
    // lava lamp with drifting blobs
    R(tx + 5, by - 22, 5, 13, dim('#3a1050')); R(tx + 4, by - 10, 7, 1, dim('#c0c0c0')); R(tx + 5, by - 23, 5, 1, dim('#c0c0c0'));
    for (let b = 0; b < 3; b++) { const yy = by - 11 - ((S.t * (2 + b) + b * 4) % 11); R(tx + 6 + (b % 2), yy, 2 + (b === 1 ? 1 : 0), 2, (night > 0.3 || S.playing) ? '#ff6a3c' : dim('#c04a2a')); } }
  else if (k === 'eighties') { R(tx, by - 9, 14, 2, dim('#222')); R(tx + 1, by - 7, 1, 7, dim('#ff4fd8')); R(tx + 12, by - 7, 1, 7, dim('#5ef0ff'));
    // boombox
    R(tx, by - 16, 14, 7, dim('#2a2a33')); R(tx + 5, by - 18, 4, 2, dim('#888')); const kick = S.playing ? Math.exp(-(S.beat % 1) * 6) : 0; circle(tx + 3, by - 12, 2 + Math.round(kick), dim('#5ef0ff')); circle(tx + 11, by - 12, 2 + Math.round(kick), dim('#ff4fd8')); R(tx + 6, by - 14, 2, 2, dim('#ffe14a')); }
  else { R(tx - 1, by - 10, 16, 2, dim(p.top)); R(tx - 1, by - 8, 16, 5, dim('#efe8da')); R(tx + 6, by - 3, 2, 3, dim(p.table)); R(tx + 6, by - 16, 1, 6, dim('#d4af37')); if (night > 0.3) P(tx + 6, by - 17 - (S.t * 8 % 2 | 0), '#ffd27a'); }
  // stereo speakers (pulse with the beat)
  const kick = S.playing ? Math.exp(-(S.beat % 1) * 6) : 0;
  SPK.forEach((sx, i) => {
    const sy = i ? 182 : 180, h = k === 'future' ? 24 : k === 'tiki' ? 22 : k === 'eighties' ? 20 : 16, w = k === 'fancy' || k === 'seventies' ? 12 : 10;
    R(sx, sy - h, w, h, dim(p.spk));
    if (k === 'tiki') { R(sx + 1, sy - h + 2, 3, 2, dim('#ffd24a')); R(sx + w - 4, sy - h + 2, 3, 2, dim('#ffd24a')); R(sx + 2, sy - h + 6, w - 4, 2, dim('#e8413a')); R(sx - 1, sy - h, w + 2, 2, dim('#2f9a4a')); }
    if (k === 'seventies') { R(sx, sy - h, w, 2, dim('#a0522d')); R(sx + 1, sy - h + 3, w - 2, h - 5, dim('#7a4a2a')); }
    const rr = 3 + Math.round(kick * 1.5), cy = sy - h * (k === 'tiki' ? 0.3 : 0.35);
    circle(sx + w / 2, cy, rr, dim(p.spkCone)); circle(sx + w / 2, cy, 1, dim('#000'));
    if (k !== 'tiki') circle(sx + w / 2, sy - h * 0.78, 2, dim(p.spkCone));
    if (k === 'eighties') { g.globalAlpha = 0.4 + kick * 0.6; R(sx - 1, sy - h - 1, w + 2, 1, '#ff4fd8'); R(sx - 1, sy, w + 2, 1, '#5ef0ff'); g.globalAlpha = 1; }
    if (k === 'future' && S.playing) { g.globalAlpha = 0.4 + kick * 0.5; R(sx - 1, sy - h - 1, w + 2, 1, p.trim); g.globalAlpha = 1; }
    if (S.playing && kick > 0.4) { g.globalAlpha = kick * 0.5; for (let j = 1; j < 4; j++) R(sx + (i ? -4 - j * 3 : w + 2 + j * 3), sy - h * 0.4 - j, 1, j * 2, '#ffffff'); g.globalAlpha = 1; }
  });
  if (k === 'fancy') { const sx = SPK[0]; R(sx + 4, 162, 2, 3, '#d4af37'); for (let i = 0; i < 6; i++) R(sx + 6 + i, 158 - i, 2, 2 + i, '#d4af37'); }
  if (k === 'tiki') { // tiki torches by the hut
    [279, 354].forEach((tx2, i) => { R(tx2, 156, 2, 26, dim('#8a5a2b')); R(tx2 - 1, 154, 4, 3, dim('#3a2410'));
      const fl = night > 0.25 || S.playing; if (fl) { for (let f = 0; f < 7; f++) P(tx2 + rnd() * 3 - 0.5, 153 - rnd() * 6, pick(['#ff9a3c', '#ffd27a', '#ff5a2a'])); if (night > 0.3) { g.globalAlpha = 0.12 * night; circle(tx2 + 1, 151, 9, '#ff9a3c'); g.globalAlpha = 1; } if (rnd() < 0.08) puff(tx2 + 1, 148, 0.5); } }); }
}
function drawLights(d) {
  const p = PACKS[S.pack], night = 1 - d, x0 = 206, y0 = 92, x1 = HUT.x + 4, y1 = HUT.y - 38;
  const n = 14;
  for (let i = 0; i <= 60; i++) { const t = i / 60, x = lerp(x0, x1, t), y = lerp(y0, y1, t) + Math.sin(Math.PI * t) * 14; P(x, y, mix('#1a1a1a', '#3a2a1a', d)); }
  for (let i = 1; i < n; i++) {
    const t = i / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t) + Math.sin(Math.PI * t) * 14 + 2;
    const on = night > 0.2 || S.playing; const beatOn = S.playing && ((S.beatN + i) % 4 === 0);
    const c = p.bulbs[i % p.bulbs.length];
    R(x, y, 2, 2, on ? c : mix('#555', c, 0.3));
    if (on && night > 0.2) { g.globalAlpha = (beatOn ? 0.55 : 0.28) * night; R(x - 2, y - 2, 6, 6, c); g.globalAlpha = 1; }
  }
}
function drawFire(d) {
  const night = 1 - d; const x = FIRE, y = 182;
  // log seat + fire pit stones
  R(x - 30, y - 1, 16, 4, mix('#2a1d14', '#6a4628', d)); R(x - 30, y - 1, 16, 1, mix('#3a2a1c', '#8a6038', d));
  for (let i = 0; i < 6; i++) R(x - 8 + i * 3, y + 1, 3, 2, mix('#333344', '#8a8a96', d));
  R(x - 5, y - 1, 10, 2, mix('#2a1d14', '#5a3a1c', d));
  drawCampChair(d);
  const cooking = S.campfire > S.t; if (night < 0.25 && !cooking) return;
  const k = S.playing ? 1 + Math.exp(-(S.beat % 1) * 5) * 0.4 : 1;
  for (let i = 0; i < 26; i++) { const fx = x - 4 + rnd() * 8, fy = y - 1 - rnd() * 12 * k; P(fx, fy, pick(['#ff9a3c', '#ffd27a', '#ff5a2a', '#fff3b0'])); }
  g.globalAlpha = 0.16 * night; circle(x, y - 5, 26, '#ff9a3c'); g.globalAlpha = 1;
  if (rnd() < 0.3) S.sparks.push({ x: x + rnd() * 6 - 3, y: y - 10, vx: rnd() * 6 - 3, vy: -14 - rnd() * 10, l: 1.2, c: '#ffb04a' });
  // cooking skewer: his catch when he's cooking, otherwise a sausage
  R(x - 9, y - 8, 18, 1, '#5a3a1c');
  if (hero.state === 'cook') { const done = clamp(hero.st / 6, 0, 1), fc = mix('#9fb4c8', '#b0702a', done); R(x - 5, y - 11, 9, 3, fc); R(x + 4, y - 12, 2, 5, fc); P(x - 4, y - 10, '#111'); if (rnd() < 0.4) puff(x, y - 13, 0.4); }
  else R(x - 2, y - 10, 4, 3, '#a0522d');
}

/* hero sprite: an original castaway (straw hat, beard, striped shirt, rolled trousers) */
function heroSprite(x, y, f, d) {
  const dim = (c) => mix('#20203a', c, 0.4 + d * 0.6);
  const o = OUTFITS[hero.outfit || 0];
  const skin = dim('#e6b68a'), hat = dim(o.hc), hatD = dim(o.hd), beard = dim('#8a5a2b'), shirtA = o.sa === 'skin' ? skin : dim(o.sa), shirtB = dim(o.sb), pants = dim(o.pants), feet = dim(o.feet || '#e6b68a');
  const sleeve = o.pat === 'bare' ? skin : shirtA;
  const flip = hero.dir < 0;
  g.save(); g.translate(Math.round(x), Math.round(y)); if (flip) g.scale(-1, 1);
  const st = hero.state, ph = S.playing ? (S.beat % 1) : (S.t * 1.5 % 1), bob = st === 'dance' ? -Math.round(Math.abs(Math.sin(ph * Math.PI)) * 2) : st === 'strut' ? -Math.round(Math.abs(Math.sin(hero.frame * Math.PI / 2)) * 2) : 0;
  const sit = st === 'sit' || st === 'eat' || st === 'pipe' || st === 'drink' || st === 'cook' || st === 'eatFish' || st === 'roast' || st === 'eatMallow';
  const legY = sit ? -6 : 0;
  // legs
  if (sit) { R(-4, -9, 10, 3, pants); R(3, -8, 4, 7, pants); R(3, -1, 5, 1, feet); }
  else {
    const step = (st === 'walk' || st === 'strut' || st === 'toSeat' || st === 'toHut' || st === 'toFeed' || st === 'toWater' || st === 'wadeIn' || st === 'wadeOut' || CAMPWALK[st] || (st === 'enc' && hero.ep && hero.ep.walk)) ? hero.frame % 4 : 0, kick = st === 'strut' ? 2 : 1;
    const lA = [0, kick, 0, -kick][step], lB = [0, -kick, 0, kick][step];
    let dl = 0, dr = 0; if (st === 'dance') { const mv = hero.move % 4; dl = mv === 1 ? -2 : mv === 3 ? 2 : 0; dr = -dl; }
    R(-3 + lA + dl, -9 + bob, 3, 9 - bob, pants); R(1 + lB + dr, -9 + bob, 3, 9 - bob, pants);
    R(-3 + lA + dl, -2, 3, 2, feet); R(1 + lB + dr, -2, 3, 2, feet);
  }
  const by = (sit ? 1 : 0) + bob;
  // body / striped shirt
  for (let i = 0; i < 9; i++) R(-4, -18 + by + i, 9, 1, o.pat === 'stripe' && i % 2 ? shirtB : shirtA);
  const B = (px, py) => R(px, -18 + by + py, 1, 1, shirtB);
  if (o.pat === 'flowers') [[-3, 1], [1, 2], [3, 5], [-2, 6], [0, 4], [2, 0], [-3, 4]].forEach(([a, b]) => B(a, b));
  if (o.pat === 'buttons') [1, 3, 5, 7].forEach((b) => B(0, b));
  if (o.pat === 'tux') { R(-1, -18 + by, 3, 9, shirtB); R(-1, -18 + by, 3, 1, dim('#c01a2a')); P(-2, -18 + by, dim('#c01a2a')); P(2, -18 + by, dim('#c01a2a')); }
  if (o.pat === 'belt') { R(-4, -12 + by, 9, 1, shirtB); R(-2, -16 + by, 3, 2, dim('#5ef0ff')); }
  if (o.pat === 'plaid') { for (let i = -4; i < 5; i += 3) R(i, -18 + by, 1, 9, shirtB); R(-4, -14 + by, 9, 1, shirtB); }
  if (o.pat === 'collar') { R(-4, -18 + by, 3, 2, shirtB); R(2, -18 + by, 3, 2, shirtB); R(-1, -17 + by, 3, 3, skin); }
  if (o.pat === 'bare') { R(-3, -17 + by, 7, 1, shirtB); P(0, -16 + by, dim('#5ee0ff')); }
  if (o.pat === 'stars') [[-2, 2], [2, 4], [-1, 6], [3, 1]].forEach(([a, b]) => B(a, b));
  // arms
  const arm = (side, pose) => { const ax = side < 0 ? -6 : 5, shirtA = sleeve; if (pose === 'up') { R(ax, -24 + by, 2, 7, shirtA); R(ax, -26 + by, 2, 2, skin); } else if (pose === 'out') { R(ax + side * 1, -17 + by, side * 5, 2, shirtA); R(ax + side * 6, -17 + by, 2, 2, skin); } else if (pose === 'eat') { R(ax, -17 + by, 2, 4, shirtA); R(ax - side * 2, -21 + by, 2, 4, skin); } else { R(ax, -17 + by, 2, 7, shirtA); R(ax, -10 + by, 2, 2, skin); } };
  let pl = 'down', pr = 'down';
  if (st === 'dance') { const mv = hero.move; pl = ['up', 'out', 'down', 'up', 'out'][mv % 5]; pr = ['down', 'out', 'up', 'up', 'down'][mv % 5]; }
  if (st === 'strut') { pl = hero.frame % 2 ? 'out' : 'down'; pr = hero.frame % 2 ? 'down' : 'out'; }
  if (st === 'eat') { pr = hero.eat > 0.5 ? 'eat' : 'down'; }
  if (st === 'cheer') { pl = 'up'; pr = 'up'; }
  if (st === 'drink') pr = hero.eat > 0.5 ? 'eat' : 'down';
  if (st === 'pipe') pr = 'eat';
  if (st === 'fish' || st === 'catch') { pr = 'out'; pl = 'out'; }
  if (st === 'cook' || st === 'roast' || st === 'give') pr = 'out';
  if (st === 'eatFish' || st === 'eatMallow') pr = hero.eat > 0.5 ? 'eat' : 'down';
  if (st === 'carryChair') { pr = 'out'; pl = 'out'; }
  if (st === 'feed' || st === 'clean') { pr = 'out'; pl = Math.floor(S.t * 3) % 2 ? 'out' : 'down'; }
  if (st === 'surf') { pl = 'out'; pr = S.playing && (S.beatN % 2) ? 'up' : 'out'; }
  if (st === 'paddle' || st === 'paddleBack') { pl = hero.frame % 2 ? 'up' : 'out'; pr = hero.frame % 2 ? 'out' : 'up'; }
  if (st === 'wade') { pl = 'out'; pr = hero.kick > 0 ? 'up' : 'down'; }
  if (st === 'enc' && hero.ep) { pl = hero.ep.pl || 'down'; pr = hero.ep.pr || 'down'; }
  arm(-1, pl); arm(1, pr);
  if (st === 'eat' && hero.eat > 0.5) { R(-1, -24 + by, 2, 3, hero.eatItem ? dim('#5aa0d0') : dim('#a0522d')); }
  if (st === 'drink') { const beer = hero.drinkItem === 'beer', up = hero.eat > 0.5, cx = up ? -1 : 6, cy = up ? -24 + by : -12 + by;
    R(cx, cy, 3, 3, beer ? dim('#e8a02a') : dim('#f4efe6')); R(cx, cy, 3, 1, beer ? dim('#ffffff') : dim('#a0522d')); P(cx + 3, cy + 1, beer ? dim('#e8a02a') : dim('#f4efe6'));
    if (!beer && !up) { g.globalAlpha = 0.5; P(cx + 1, cy - 2 - Math.floor(S.t * 3) % 2, '#ffffff'); P(cx, cy - 4 + Math.floor(S.t * 3) % 2, '#ffffff'); g.globalAlpha = 1; } }
  campItems(st, by, x, y, flip, dim);
  if (st === 'enc') encItems(by, dim);
  if (st === 'feed' || st === 'clean') { R(10, -16 + by, 4, 2, dim(st === 'feed' ? '#c8a060' : '#5aa0d0')); if (st === 'feed' && Math.floor(S.t * 6) % 2) P(12, -13 + by, dim('#8a5a2b')); }
  // head, beard, hat
  R(-3, -25 + by, 7, 7, skin); R(-3, -21 + by, 7, 3, beard); R(-2, -19 + by, 5, 2, beard); P(2, -23 + by, dim('#1a1a2a')); P(-1, -23 + by, dim('#1a1a2a'));
  if (st === 'pipe') { R(3, -21 + by, 3, 1, dim('#5a3418')); R(5, -24 + by, 2, 3, dim('#5a3418')); P(5, -25 + by, Math.floor(S.t * 2) % 2 ? '#ff7a2a' : '#ffb04a'); }
  const hy = by;
  switch (o.hat) {
    case 'straw': R(-6, -27 + hy, 13, 2, hat); R(-3, -30 + hy, 7, 3, hat); R(-3, -28 + hy, 7, 1, hatD); break;
    case 'bucket': R(-5, -27 + hy, 11, 2, hat); R(-3, -30 + hy, 7, 3, hat); R(-5, -26 + hy, 11, 1, hatD); break;
    case 'tricorn': R(-7, -27 + hy, 15, 2, hat); R(-4, -31 + hy, 9, 4, hat); R(-7, -27 + hy, 15, 1, hatD); P(0, -29 + hy, dim('#ffffff')); break;
    case 'top': R(-5, -26 + hy, 11, 1, hat); R(-3, -33 + hy, 7, 7, hat); R(-3, -28 + hy, 7, 1, hatD); break;
    case 'helmet': R(-5, -29 + hy, 11, 2, hat); R(-5, -27 + hy, 2, 9, hat); R(4, -27 + hy, 2, 9, hat); g.globalAlpha = 0.35; R(-3, -27 + hy, 7, 6, hatD); g.globalAlpha = 1; P(-4, -30 + hy, '#ff3a3a'); break;
    case 'beanie': R(-4, -29 + hy, 9, 4, hat); R(-4, -26 + hy, 9, 1, hatD); P(0, -30 + hy, hatD); break;
    case 'afro': R(-5, -32 + hy, 11, 7, hat); R(-5, -25 + hy, 2, 4, hat); R(4, -25 + hy, 2, 4, hat); break;
    case 'bandana': R(-3, -26 + hy, 7, 2, hat); P(-4, -25 + hy, hat); P(-5, -24 + hy, hatD); P(-5, -23 + hy, hat); break;
    case 'wizard': R(-6, -27 + hy, 13, 2, hat); for (let i = 0; i < 9; i++) R(-3 + Math.floor(i / 3), -28 - i + hy, 7 - Math.floor(i / 3) * 2, 1, hat); P(0, -31 + hy, hatD); P(1, -35 + hy, hatD); break;
    case 'sailor': R(-4, -28 + hy, 9, 3, hat); R(-4, -26 + hy, 9, 1, hatD); break;
  }
  g.restore();
}
function catSprite(x, y, dir, c, sil, lit) {
  const col = sil ? (lit ? '#2a1a10' : '#111') : c.col, dark = sil ? col : c.dark;
  g.save(); g.translate(Math.round(x), Math.round(y)); if (dir < 0) g.scale(-1, 1);
  if (c.state === 'eatBowl' && !sil) { const b = Math.floor(S.t * 4) % 2; R(0, -4, 8, 3, col); R(7, -4 + b, 3, 3, col); P(7, -5 + b, col); P(9, -5 + b, col); R(-3, -6, 3, 1, dark); P(-3, -7, dark); R(1, -1, 1, 1, dark); R(6, -1, 1, 1, dark); g.restore(); return; }
  if (c.state === 'sit' || sil) { R(0, -5, 5, 5, col); R(1, -8, 4, 3, col); P(1, -9, col); P(4, -9, col); R(-2, -2, 3, 1, dark); if (!sil) { P(2, -7, '#2a2'); P(4, -7, '#2a2'); } }
  else { const f = Math.floor(S.t * 6) % 2; R(0, -4, 8, 3, col); R(7, -6, 3, 3, col); P(7, -7, col); P(9, -7, col); R(-3, -6 + f, 3, 1, dark); P(-3, -7 + f, dark); R(1, -1, 1, 1 + f, dark); R(6, -1, 1, 2 - f, dark); if (!sil) P(9, -5, '#222'); }
  g.restore();
}

/* rafts and what's on them */
function drawRaft(r, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65);
  const bob = Math.sin(S.t * 2 + r.land) * (r.state === 'landed' ? 0.3 : 1.2);
  const x = r.x, y = r.y + bob;
  R(x - 12, y, 24, 3, dim('#8a6038')); for (let i = -12; i < 12; i += 4) R(x + i, y, 1, 3, dim('#5a3a1c'));
  if (r.type === 'pot') {
    R(x - 5, y - 7, 10, 7, dim('#3a3a4a')); R(x - 6, y - 8, 12, 2, dim('#5a5a6a')); R(x - 4, y - 6, 8, 1, dim('#2a2a3a'));
    if (r.lit > 0) { g.globalAlpha = 0.5 * Math.min(1, r.lit); R(x - 4, y - 9, 8, 2, `hsl(${(r.hue + S.t * 60) % 360},100%,65%)`); g.globalAlpha = 1; }
  } else if (r.type === 'drum') {
    const dm = r.drummer; drummer(x, y, dm, r, d);
  } else if (r.type === 'dance') {
    r.dancers.forEach((dc, i) => dancer(x - 8 + i * 8, y, dc, d));
  } else if (r.type === 'visit') {
    if (r.state === 'leaving' && r.rowing) { const o = Math.round(Math.sin(S.t * 6) * 3); R(x - 14, y + 1 + o, 1, 4, dim('#8a6038')); R(x + 13, y + 1 - o, 1, 4, dim('#8a6038')); }
    visitorSprite(x + r.v.ox, y + r.v.oy, r.v, d);
  }
  // wake while drifting
  if (r.state === 'drift') { g.globalAlpha = 0.5; R(x - 16 + (r.x < r.land ? -6 : 18), y + 2, 6, 1, '#d9f6ff'); g.globalAlpha = 1; }
}
function hitNow(r) { if (!S.playing) return 0; const dm = r.drummer, pos = (S.beat - dm.offset) / dm.every; const ph = pos - Math.floor(pos); return Math.exp(-ph * 8); }
function drummer(x, y, dm, r, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65); const h = hitNow(r), up = h > 0.5;
  // drum
  if (dm.kind === 'conga') { R(x + 3, y - 10, 5, 10, dim('#a0522d')); R(x + 3, y - 11, 5, 1, dim('#f0e0c0')); }
  if (dm.kind === 'steel') { R(x + 1, y - 8, 9, 3, dim('#c0c8d0')); R(x + 2, y - 5, 1, 5, dim('#888')); R(x + 8, y - 5, 1, 5, dim('#888')); }
  if (dm.kind === 'taiko') { circle(x + 6, y - 7, 5, dim('#7a2a1a')); circle(x + 6, y - 7, 3, dim('#e8d8b0')); }
  if (dm.kind === 'snare') { R(x + 2, y - 7, 8, 4, dim('#e8e8f0')); R(x + 2, y - 7, 8, 1, dim('#c02020')); R(x + 2, y - 4, 8, 1, dim('#c02020')); }
  if (dm.kind === 'bongo') { R(x + 2, y - 6, 4, 6, dim('#c48a4a')); R(x + 6, y - 5, 4, 5, dim('#a0703a')); }
  if (dm.kind === 'robot') { R(x + 1, y - 9, 10, 9, dim('#2a3050')); for (let i = 0; i < 4; i++) R(x + 2 + i * 2, y - 7, 1, 1, h > 0.3 && i === (S.beatN % 4) ? '#5ef0ff' : dim('#445')); }
  // player
  const skin = dim(dm.skin), shirt = dim(dm.shirt);
  R(x - 5, y - 7, 2, 7, dim('#2a2a3a')); R(x - 2, y - 7, 2, 7, dim('#2a2a3a'));
  R(x - 6, y - 15, 7, 8, shirt); R(x - 5, y - 21, 5, 6, skin);
  if (dm.kind === 'robot') { R(x - 6, y - 22, 7, 7, dim('#9aa6c4')); P(x - 4, y - 19, '#5ef0ff'); P(x - 2, y - 19, '#5ef0ff'); }
  if (dm.kind === 'snare') R(x - 6, y - 24, 7, 3, dim('#2747b8'));
  if (dm.kind === 'taiko') R(x - 6, y - 22, 7, 1, dim('#ffffff'));
  R(x + 1, up ? y - 16 : y - 12, 4, 2, skin);
  if (h > 0.6) { g.globalAlpha = h; R(x + 4, y - 14, 1, 1, '#fff'); R(x + 8, y - 15, 1, 1, '#fff'); R(x + 11, y - 12, 1, 1, '#fff'); g.globalAlpha = 1; if (!r.hitLast || S.t - r.hitLast > 0.12) { r.hitLast = S.t; S.sparks.push({ x: x + 6, y: y - 12, vx: rnd() * 8 - 4, vy: -12, l: 0.5, c: '#ffffff', note: true }); } }
}
function dancer(x, y, dc, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65); const ph = (S.playing ? S.beat : S.t * 0.8) + dc.ph;
  const skin = dim(dc.skin), col = dim(dc.col);
  let dx = 0, dy = 0, armUp = false, flip = 1;
  if (dc.style === 'sway') dx = Math.round(Math.sin(ph * Math.PI) * 1.5);
  if (dc.style === 'jump') dy = -Math.round(Math.abs(Math.sin(ph * Math.PI)) * 4);
  if (dc.style === 'spin') flip = Math.floor(ph * 2) % 2 ? -1 : 1;
  if (dc.style === 'robot') armUp = Math.floor(ph) % 2 === 0;
  if (dc.style === 'twist') dx = Math.floor(ph * 2) % 2 ? 1 : -1;
  if (dc.style === 'wave') armUp = (ph % 1) < 0.5;
  g.save(); g.translate(x + dx, y + dy); g.scale(flip, 1);
  R(-2, -6, 2, 6, dim('#2a2a3a')); R(1, -6, 2, 6, dim('#2a2a3a'));
  R(-3, -13, 7, 7, col); R(-2, -18, 5, 5, skin); R(-3, -19, 7, 2, dim('#2a1a10'));
  if (armUp) { R(-5, -18, 2, 6, skin); R(4, -18, 2, 6, skin); } else { R(-5, -12, 2, 5, skin); R(4, -12, 2, 5, skin); }
  g.restore();
}

/* fibre-optic EQ fireworks from the magic pots */
function potFire(r) {
  if (r.type !== 'pot') return;
  if (r.lit <= 0) return;
  const b = bands(10), x = r.x, base = r.y - 9;
  for (let i = 0; i < 10; i++) {
    const hgt = (14 + b[i] * 70) * Math.min(1, r.lit), ang = (i - 4.5) * 0.11 + Math.sin(S.t * 1.7 + i) * 0.05;
    const hue = (r.hue + i * 26 + S.t * 40) % 360;
    for (let k = 0; k < hgt; k++) { const curl = Math.sin(S.t * 2.2 + k * 0.07 + i) * (k / 18), px = x + Math.sin(ang) * k + curl, py = base - Math.cos(ang) * k; g.globalAlpha = 0.2 + 0.8 * (k / hgt); P(px, py, `hsl(${hue},100%,${50 + 30 * (k / hgt)}%)`); if (k < 8) P(px + 1, py, `hsl(${hue},100%,45%)`); }
    g.globalAlpha = 0.25; for (let k = 0; k < hgt; k += 3) P(x + Math.sin(ang) * k + 1, base - Math.cos(ang) * k, '#ffffff');
    g.globalAlpha = 1;
    const tipx = x + Math.sin(ang) * hgt, tipy = base - Math.cos(ang) * hgt;
    R(tipx - 1, tipy - 1, 2, 2, `hsl(${hue},100%,85%)`);
    if (S.playing && rnd() < 0.06 + b[i] * 0.08) S.sparks.push({ x: tipx, y: tipy, vx: (rnd() - 0.5) * 30, vy: -10 - rnd() * 25, l: 1.4, c: `hsl(${hue},100%,70%)`, float: rnd() < 0.18 });
  }
}
function drawSparks(dt, d) {
  S.sparks = S.sparks.filter((s) => {
    s.l -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += (s.note ? -2 : 18) * dt;
    if (s.float && s.l < 0.4) { if (S.floaters.length < 160) S.floaters.push({ x: s.x, y: s.y, c: s.c, p: rnd() * 6, vx: (rnd() - 0.5) * 2, vy: -1 - rnd() * 2, born: S.t }); return false; }
    if (s.l <= 0) return false;
    g.globalAlpha = Math.min(1, s.l * 1.5); if (s.note) { R(s.x, s.y, 1, 3, s.c); R(s.x + 1, s.y, 2, 1, s.c); } else R(s.x, s.y, 1, 1, s.c); g.globalAlpha = 1;
    return true;
  });
}
function drawFloaters(dt, d) {
  const night = 1 - d;
  S.floaters = S.floaters.filter((f) => {
    f.x += f.vx * dt; f.y += f.vy * dt; if (f.y < 8) f.vy = Math.abs(f.vy) * 0.2;
    const age = S.t - f.born; if (age > 240) return false;
    g.globalAlpha = (0.25 + 0.75 * night) * (0.5 + 0.5 * Math.sin(S.t * 2 + f.p)) * Math.min(1, (240 - age) / 30);
    R(f.x, f.y, 1, 1, f.c); if (night > 0.5) { g.globalAlpha *= 0.4; R(f.x - 1, f.y - 1, 3, 3, f.c); }
    g.globalAlpha = 1; return true;
  });
}

/* ---------------- smoke & haze ---------------- */
S.smoke = [];
function puff(x, y, k) { if (S.smoke.length < 140) S.smoke.push({ x, y, vx: 1 + rnd() * 2, vy: -(3 + rnd() * 3), r: 1.5 + rnd(), life: 0, max: (7 + rnd() * 5) * (k || 1), p: rnd() * 6 }); }
function litPots() { return S.rafts.filter((r) => r.type === 'pot' && r.lit > 0.2); }
function smokeThink(dt, d) {
  const night = 1 - d;
  if (rnd() < dt * (0.9 + night * 1.3)) puff(HUT.x + 51, HUT.y - 67);
  if (night > 0.3 && rnd() < dt * 2.2) puff(FIRE + rnd() * 4 - 2, 172, 0.9);
  const pots = litPots();
  S.smoke = S.smoke.filter((s) => {
    s.life += dt; if (s.life > s.max) return false;
    s.x += (s.vx + Math.sin(S.t * 0.6 + s.p) * 1.5) * dt; s.y += s.vy * dt; s.vy *= 0.995; s.r += dt * 0.9;
    const a = 0.32 * Math.sin(Math.PI * s.life / s.max);
    g.globalAlpha = a; circle(s.x, s.y, Math.round(s.r), mix('#3a3a4e', '#d8d8de', d * 0.8 + 0.1));
    // the haze catches the fireworks' colours
    let best = null, bd = 1e9; pots.forEach((r) => { const dd = Math.abs(r.x - s.x) + Math.abs((r.y - 40) - s.y) * 0.6; if (dd < bd) { bd = dd; best = r; } });
    if (best && bd < 110) { g.globalAlpha = a * (1 - bd / 110) * (0.6 + 0.4 * night) * (0.6 + S.energy * 0.5); circle(s.x, s.y, Math.round(s.r), `hsl(${(best.hue + S.t * 40) % 360},100%,62%)`); }
    g.globalAlpha = 1; return true;
  });
  // a low smoky haze over the beach that glows with the fireworks at night
  if (pots.length && night > 0.2) {
    const hue = (pots[0].hue + S.t * 30) % 360;
    for (let yy = 50; yy < HORIZON + 30; yy += 3) { g.globalAlpha = night * 0.05 * Math.sin(Math.PI * (yy - 50) / (HORIZON - 20)) * (0.5 + S.energy * 0.6); R(0, yy, W, 3, `hsl(${(hue + yy) % 360},80%,60%)`); }
    pots.forEach((r) => { g.globalAlpha = 0.05 * night * (0.6 + S.energy); circle(r.x, r.y - 45, 26, `hsl(${(r.hue + S.t * 40) % 360},100%,60%)`); });
    g.globalAlpha = 1;
  }
}

/* ---------------- ships on the horizon: a fleet of classic sailing-ship types ---------------- */
// L = half hull length, hh = hull height, masts = [x, height, sails, rig], st/bw = stern & bow castle heights, guns = gun decks
const SHIPS = [
  { name: 'sloop', L: 10, hh: 3, masts: [[1, 18, 2, 'aft']], jib: 1, st: 1, bw: 0, guns: 0, hull: '#6a4020', w: 0.9 },
  { name: 'pinnace', L: 12, hh: 3, masts: [[-4, 14, 2, 'sq'], [4, 18, 2, 'sq']], jib: 1, st: 2, bw: 0, guns: 0, hull: '#5a3a1c', w: 0.9 },
  { name: 'brigantine', L: 13, hh: 4, masts: [[-4, 20, 2, 'aft'], [5, 22, 3, 'sq']], jib: 1, st: 2, bw: 1, guns: 1, hull: '#4a2a14', w: 1 },
  { name: 'barque', L: 15, hh: 4, masts: [[-8, 16, 1, 'aft'], [0, 22, 3, 'sq'], [8, 20, 3, 'sq']], jib: 1, st: 3, bw: 1, guns: 0, hull: '#6a4a2a', w: 0.8 },
  { name: 'fluyt', L: 16, hh: 5, masts: [[-9, 14, 2, 'aft'], [0, 22, 3, 'sq'], [9, 19, 3, 'sq']], jib: 0, st: 5, bw: 1, guns: 0, hull: '#7a4a24', round: 1, w: 0.8 },
  { name: 'merchantman', L: 17, hh: 5, masts: [[-9, 16, 2, 'sq'], [0, 24, 3, 'sq'], [9, 20, 3, 'sq']], jib: 1, st: 4, bw: 2, guns: 1, hull: '#5a3418', w: 0.9 },
  { name: 'frigate', L: 19, hh: 5, masts: [[-10, 20, 3, 'sq'], [0, 27, 3, 'sq'], [10, 23, 3, 'sq']], jib: 1, st: 3, bw: 1, guns: 1, stripe: '#d4af37', hull: '#2a1a10', w: 1 },
  { name: 'galleon', L: 19, hh: 6, masts: [[-11, 16, 2, 'aft'], [-1, 26, 3, 'sq'], [9, 22, 3, 'sq']], jib: 1, st: 8, bw: 4, guns: 1, stripe: '#a01a2a', hull: '#4a2410', w: 0.9 },
  { name: 'war galleon', L: 21, hh: 7, masts: [[-12, 18, 2, 'aft'], [-2, 28, 3, 'sq'], [9, 24, 3, 'sq']], jib: 1, st: 9, bw: 4, guns: 2, stripe: '#d4af37', hull: '#3a1a0a', w: 0.6 },
  { name: 'ship of the line', L: 23, hh: 8, masts: [[-12, 24, 3, 'sq'], [0, 30, 3, 'sq'], [12, 26, 3, 'sq']], jib: 1, st: 5, bw: 2, guns: 3, stripe: '#e8d8a0', hull: '#2a1a10', w: 0.5 }
];
const NATIONS = [
  { name: 'pirate', w: 1.3, flag: (x, y, dim) => { R(x, y, 7, 5, dim('#111')); P(x + 3, y + 1, dim('#fff')); R(x + 2, y + 3, 3, 1, dim('#fff')); } },
  { name: 'English', w: 1, flag: (x, y, dim) => { R(x, y, 7, 5, dim('#ffffff')); R(x + 3, y, 1, 5, dim('#c8102e')); R(x, y + 2, 7, 1, dim('#c8102e')); } },
  { name: 'Spanish', w: 1, flag: (x, y, dim) => { R(x, y, 7, 5, dim('#c60b1e')); R(x, y + 1, 7, 3, dim('#ffc400')); } },
  { name: 'French', w: 1, flag: (x, y, dim) => { R(x, y, 7, 5, dim('#f4f0e6')); P(x + 3, y + 2, dim('#d4af37')); } },
  { name: 'Dutch', w: 1, flag: (x, y, dim) => { R(x, y, 7, 2, dim('#ff7a1a')); R(x, y + 2, 7, 1, dim('#ffffff')); R(x, y + 3, 7, 2, dim('#1e4b9a')); } }
];
function wpick(a) { let t = a.reduce((s, x) => s + (x.w || 1), 0) * rnd(); for (const x of a) { t -= (x.w || 1); if (t <= 0) return x; } return a[0]; }
S.ships = []; S.nextShip = 40 + rnd() * 50;
function shipThink(dt) {
  if (S.t > S.nextShip && S.ships.length < 2) {
    const dir = rnd() < 0.5 ? 1 : -1, t = wpick(SHIPS), nat = wpick(NATIONS), far = rnd() < 0.4;
    S.ships.push({ x: dir > 0 ? -50 : W + 50, dir, v: (far ? 3 : 5) + rnd() * 3, t, nat, far });
    toast((nat.name === 'pirate' ? 'A pirate ' : (/^[aeiou]/i.test(nat.name) ? 'An ' : 'A ') + nat.name + ' ') + t.name + ' is sailing by');
    S.nextShip = S.t + 110 + rnd() * 150;
  }
  S.ships.forEach((sh) => { sh.x += sh.dir * sh.v * dt; });
  S.ships = S.ships.filter((sh) => sh.x > -70 && sh.x < W + 70);
}
function drawShip(d) {
  const night = 1 - d;
  S.ships.slice().sort((a, b) => (b.far ? 1 : 0) - (a.far ? 1 : 0)).forEach((sh) => {
    const t = sh.t, dim = (c) => mix('#0e1428', c, (sh.far ? 0.2 : 0.3) + d * (sh.far ? 0.55 : 0.7)), bob = Math.round(Math.sin(S.t * 1.4 + sh.x * 0.05) * 0.8);
    const base = HORIZON + (sh.far ? 1 : 3) + bob, L = t.L, hh = t.hh;
    g.save(); g.translate(Math.round(sh.x), base); g.scale(sh.dir, 1); // +x is the bow, so the ship always points where it's sailing
    if (sh.far) g.scale(0.7, 0.7);
    const hull = dim(t.hull), hullL = dim('#8a5a2e'), sail = dim(sh.nat.name === 'pirate' && rnd() < 0 ? '#3a3a3a' : '#efe6d0'), sailS = dim('#cfc4a8'), mast = dim('#2a1a0a');
    // hull: tapered keel, raised stern castle (aft = -x) and forecastle (bow = +x)
    for (let y = 0; y < hh; y++) { const inset = Math.round((hh - y) * 0.6); R(-L + inset * (t.round ? 0.5 : 1), -y - 1, 2 * L - inset * 2 + 2, 1, hull); }
    R(-L, -hh - 1, 2 * L + 2, 1, hullL);
    if (t.st) { R(-L, -hh - 1 - t.st, Math.max(5, Math.round(L * 0.45)), t.st, hull); R(-L, -hh - 1 - t.st, Math.max(5, Math.round(L * 0.45)), 1, hullL); if (t.st > 3) for (let k = 0; k < 3; k++) P(-L + 1 + k * 2, -hh - t.st + 1, dim('#ffd27a')); }
    if (t.bw) { R(L - 6, -hh - 1 - t.bw, 7, t.bw, hull); R(L - 6, -hh - 1 - t.bw, 7, 1, hullL); }
    if (t.stripe) R(-L + 1, -hh + 1, 2 * L, 1, dim(t.stripe));
    for (let gd = 0; gd < t.guns; gd++) for (let x = -L + 4; x < L - 2; x += 3) P(x, -hh + 2 + gd * 2 - (t.stripe ? 0 : 1), dim('#111'));
    // bowsprit and jib
    R(L + 1, -hh - 2, 1, 1, mast); R(L + 2, -hh - 3, 2, 1, mast); R(L + 4, -hh - 4, 3, 1, mast);
    const fore = t.masts[t.masts.length - 1];
    if (t.jib) for (let k = 0; k < fore[1] - 6; k++) { const yy = -hh - 4 - k, xx = fore[0] + 1 + Math.round(k * 0.0), w = Math.round((L + 6 - fore[0]) * (1 - k / (fore[1] - 4))); if (w > 0) R(fore[0] + 2, yy, w, 1, k % 4 === 0 ? sailS : sail); }
    // masts and sails
    t.masts.forEach(([mx, h, n, rig], mi) => {
      R(mx, -hh - 1 - h, 1, h, mast);
      const sw = Math.round(Math.sin(S.t * 1.1 + mx) * 0.6);
      if (rig === 'sq') { const step = Math.floor((h - 3) / n); for (let k = 0; k < n; k++) { const w = Math.max(4, Math.round(L * 0.55) - k * 2) + sw, sh2 = Math.max(3, step - 1), top = -hh - 1 - h + 2 + k * step; R(mx - Math.floor(w / 2), top + (n - 1 - k) * 0, w, sh2, sail); R(mx - Math.floor(w / 2), top, w, 1, mast); } }
      else { for (let k = 0; k < h - 3; k++) { const w = Math.round(2 + k * 0.45); R(mx - w, -hh - 1 - h + 2 + k, w, 1, k % 5 === 0 ? sailS : sail); } R(mx - Math.round(2 + (h - 3) * 0.45), -hh - 3, Math.round(2 + (h - 3) * 0.45) + 1, 1, mast); }
    });
    // flag on the tallest mast, streaming aft
    const tall = t.masts.reduce((a, b) => (b[1] > a[1] ? b : a));
    sh.nat.flag(tall[0] - 7, -hh - 1 - tall[1] - 1 + (Math.floor(S.t * 3) % 2 ? 0 : 0), dim);
    { const nD = Math.max(2, Math.floor(L / 5)), ph = S.playing ? S.beat : S.t * 1.2; for (let k = 0; k < nD; k++) { const dx = -L + 5 + Math.round(k * (2 * L - 10) / Math.max(1, nD - 1)), up = (Math.floor(ph * (S.playing ? 2 : 1) + k) % 2), col = dim(['#ff6fa8', '#ffd24a', '#7affb2', '#5ee0ff', '#ffffff'][k % 5]); R(dx, -hh - 3 - up, 1, 2, col); P(dx, -hh - 4 - up, dim('#f0c9a0')); P(dx + (up ? 1 : -1), -hh - 4 - up, col); } }
    if (night > 0.3) { R(-L - 1, -hh - t.st - 3, 2, 2, '#ffd27a'); g.globalAlpha = 0.25 * night; circle(-L, -hh - t.st - 2, 4, '#ffd27a'); g.globalAlpha = 1; }
    g.restore();
    g.globalAlpha = 0.4; R(sh.x - L, base + 1, 2 * L, 1, mix('#20305a', '#d9f6ff', d)); g.globalAlpha = 1;
  });
}

/* ---------------- visitors: pirates, a three-headed monkey, a robot ---------------- */
const VISITORS = [
  { kind: 'pegleg', name: 'Peg-Leg Percy' }, { kind: 'hook', name: 'Hook-Hand Horace' }, { kind: 'captain', name: 'Captain Bellows' },
  { kind: 'parrot', name: 'One-Eyed Olive and her parrot' }, { kind: 'cutlass', name: 'Cutlass Kit' },
  { kind: 'monkey3', name: 'a three-headed monkey' }, { kind: 'robot', name: 'a dancing robot' }
];
S.nextVisit = 30 + rnd() * 30;
function toast(t) { S.toast = { t, until: S.t + 7 }; }
function visitorsThink(dt) {
  if (S.t > S.nextVisit && !S.rafts.some((r) => r.type === 'visit')) { spawnRaft('visit'); S.nextVisit = S.t + 70 + rnd() * 90; }
  S.rafts.forEach((r) => {
    if (r.type !== 'visit' || r.state !== 'landed') return; const v = r.v; v.t += dt;
    const goal = v.st === 'off' ? [8, 15] : v.st === 'back' ? [0, 0] : null;
    if (v.st === 'aboard' && v.t > 1) { v.st = 'off'; toast('⚓ ' + v.name.charAt(0).toUpperCase() + v.name.slice(1) + ' came ashore!'); }
    if (goal) { const dx = goal[0] - v.ox, dy = goal[1] - v.oy, dd = Math.hypot(dx, dy); if (dd < 0.6) { v.ox = goal[0]; v.oy = goal[1]; if (v.st === 'off') { v.st = 'dance'; v.t = 0; v.dur = 16 + rnd() * 12; } else { r.state = 'leaving'; r.rowing = v.kind !== 'robot' && v.kind !== 'monkey3' ? 1 : 0; } } else { const k = Math.min(1, 9 * dt / dd); v.ox += dx * k; v.oy += dy * k; v.walk = (v.walk || 0) + dt * 6; } }
    if (v.st === 'dance' && v.t > v.dur) v.st = 'back';
  });
}
function visitorSprite(x, y, v, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65), dancing = v.st === 'dance';
  const ph = S.playing ? S.beat : S.t * 1.6, up = dancing && Math.floor(ph) % 2 === 0, bob = dancing ? -Math.round(Math.abs(Math.sin(ph * Math.PI)) * 2) : 0;
  const step = !dancing && v.st !== 'aboard' ? Math.floor(v.walk || 0) % 2 : 0, flip = dancing ? (Math.floor(ph / 2) % 2 ? -1 : 1) : 1;
  g.save(); g.translate(Math.round(x), Math.round(y) + bob); g.scale(flip, 1);
  const k = v.kind;
  if (k === 'monkey3') {
    const fur = dim('#7a4a24'), face = dim('#d8a878');
    R(-4, -11, 9, 8, fur); R(-3, -3, 3, 3, fur); R(2, -3, 3, 3, fur); R(5, -8, 3, 1, fur); R(7, -10, 1, 3, fur);
    [-6, -1, 4].forEach((hx, i) => { const hb = dancing ? Math.round(Math.sin(ph * Math.PI + i * 2) * 1.5) : 0; R(hx, -16 + hb, 5, 5, fur); R(hx + 1, -14 + hb, 3, 3, face); P(hx + 1, -14 + hb, dim('#111')); P(hx + 3, -14 + hb, dim('#111')); P(hx - 1, -15 + hb, fur); });
    if (up) { R(-6, -17, 2, 6, fur); R(5, -17, 2, 6, fur); } else { R(-6, -10, 2, 6, fur); R(5, -10, 2, 6, fur); }
    g.restore(); return;
  }
  if (k === 'robot') {
    const m = dim('#aab4c8'), md = dim('#6a7488');
    R(-3, -4, 2, 4, md); R(2, -4, 2, 4, md); R(-4, -12, 9, 8, m); R(-2, -10, 5, 3, dim('#2a3050')); P(-1 + Math.floor(S.t * 4) % 3, -9, '#ff4fd8');
    R(-3, -18, 7, 6, m); R(-2, -16, 5, 2, '#5ef0ff'); R(0, -21, 1, 3, md); P(0, -22, Math.floor(S.t * 3) % 2 ? '#ff3a3a' : dim('#5a1a1a'));
    const a = dancing ? Math.floor(ph * 2) % 4 : 0; R(-6, a === 1 ? -17 : -12, 2, 5, md); R(5, a === 3 ? -17 : -12, 2, 5, md);
    g.restore(); return;
  }
  // pirates
  const skin = dim(k === 'hook' ? '#c48a5a' : k === 'parrot' ? '#8a5a3c' : '#e6b68a');
  const shirt = dim({ pegleg: '#d23a3a', hook: '#2747b8', captain: '#a01a2a', parrot: '#f2c230', cutlass: '#2f7a3a' }[k]);
  const pants = dim(k === 'captain' ? '#1a1a2a' : '#3a3050');
  R(-3, -7 + step, 3, 7 - step, pants); if (k === 'pegleg') { R(2, -7, 2, 3, pants); R(2, -4, 1, 4, dim('#8a5a2b')); } else R(1, -7 + (1 - step), 3, 7 - (1 - step), pants);
  R(-4, -15, 9, 8, shirt);
  if (k === 'pegleg') for (let i = 0; i < 8; i += 2) R(-4, -15 + i, 9, 1, dim('#f4efe6'));
  if (k === 'captain') { P(0, -13, dim('#d4af37')); P(0, -11, dim('#d4af37')); P(0, -9, dim('#d4af37')); }
  if (k === 'cutlass') { R(-1, -15, 3, 8, dim('#f4efe6')); }
  R(-3, -21, 7, 6, skin);
  if (k === 'hook' || k === 'captain') R(-3, -17, 7, 2, dim(k === 'captain' ? '#e8e8e8' : '#2a1a10'));
  if (k === 'captain' || k === 'parrot') R(1, -20, 3, 1, dim('#111'));
  P(-1, -19, dim('#111')); if (k !== 'captain' && k !== 'parrot') P(2, -19, dim('#111'));
  if (k === 'pegleg') { R(-4, -23, 9, 3, dim('#d23a3a')); P(5, -22, dim('#d23a3a')); P(6, -21, dim('#d23a3a')); }
  if (k === 'hook') R(-3, -23, 7, 2, dim('#1a1a1a'));
  if (k === 'captain') { R(-7, -24, 15, 2, dim('#111')); R(-4, -27, 9, 3, dim('#111')); P(0, -26, dim('#fff')); }
  if (k === 'parrot') { R(-3, -23, 7, 2, dim('#5a2a7a')); const fl = Math.floor(S.t * 6) % 2; R(4, -19, 3, 4, dim('#2fbf4a')); P(7, -18, dim('#ffb000')); P(5, -20, dim('#e8413a')); if (fl) R(3, -18, 1, 2, dim('#1f8a34')); }
  if (k === 'cutlass') { R(-3, -22, 7, 1, skin); P(-4, -18, dim('#ffd24a')); }
  // arms
  const armL = up ? [-6, -21, 2, 6] : [-6, -14, 2, 6], armR = (up || (k === 'cutlass' && dancing)) ? [5, -21, 2, 6] : [5, -14, 2, 6];
  R(...armL, shirt); R(...armR, shirt);
  if (k === 'hook') { const hy = armR[1] === -21 ? -23 : -8; R(6, hy, 1, 2, dim('#c0c8d0')); P(5, hy + (hy < -10 ? -1 : 2), dim('#c0c8d0')); }
  else P(armR[0] + 1, armR[1] === -21 ? -22 : -8, skin);
  P(armL[0] + 1, armL[1] === -21 ? -22 : -8, skin);
  if (k === 'cutlass') { const cy = armR[1] === -21 ? -22 : -9; for (let i = 0; i < 6; i++) P(6 + (cy < -10 ? 0 : i), cy - (cy < -10 ? i : 0), dim('#d0d8e0')); }
  g.restore();
}

/* ---------------- a fish peeks out from behind the moon ---------------- */
S.nextFish = 40 + rnd() * 60; S.fish = null;
function drawMoonFish(mx, my, d) {
  if (!S.fish && S.t > S.nextFish && d < 0.2) S.fish = { t: 0 };
  if (!S.fish) return; const f = S.fish; f.t += 1 / 60;
  const out = f.t < 1.5 ? f.t / 1.5 : f.t < 6 ? 1 : 1 - (f.t - 6) / 1.5;
  if (out <= 0 && f.t > 6) { S.fish = null; S.nextFish = S.t + 90 + rnd() * 120; return; }
  const fx = mx - 3 - 10 * out, fy = my - 3 - 4 * out;
  circle(fx, fy, 5, '#ff8a2a'); R(fx - 1, fy - 5, 2, 10, '#1a1a1a'); R(fx + 2, fy - 4, 1, 8, '#ffffff'); R(fx + 6, fy - 2, 3, 5, '#ff8a2a');
  R(fx - 4, fy - 2, 3, 3, '#ffffff'); P(fx - 3, fy - 1, '#111');
  const wave = Math.floor(f.t * 5) % 2; R(fx - 7, fy + (wave ? -5 : -2), 2, 4, '#ffb060'); P(fx - 8, fy + (wave ? -6 : -3), '#ffb060');
}

/* ---------------- the sky dances: sun & moon pulse, starry-night swirls ---------------- */
S.swirl = 0; S.swirlOn = false; S.nextSwirl = 25 + rnd() * 30; S.swirlSpots = [];
function swirlThink(dt) {
  if (S.playing && S.t > S.nextSwirl) { S.swirlOn = !S.swirlOn; S.nextSwirl = S.t + (S.swirlOn ? 18 + rnd() * 14 : 35 + rnd() * 50); if (S.swirlOn) S.swirlSpots = Array.from({ length: ri(2, 3) }, () => ({ x: 30 + rnd() * 320, y: 18 + rnd() * 55, s: rnd() < 0.5 ? 1 : -1, r: 10 + rnd() * 8 })); }
  if (!S.playing) S.swirlOn = false;
  S.swirl = clamp(S.swirl + (S.swirlOn ? dt / 4 : -dt / 4), 0, 1);
}
function drawSwirls(mx, my, sx, sy, d) {
  const a = S.swirl; if (a <= 0.01) return; const night = 1 - d, kick = S.playing ? Math.exp(-(S.beat % 1) * 6) : 0;
  const cols = night > 0.4 ? ['#f6d65a', '#7fb2ff', '#cfe2ff', '#3a6ad8'] : ['#ffe9a0', '#ffffff', '#ffd27a', '#9fd6ff'];
  // long flowing brush strokes across the sky
  for (let band = 0; band < 4; band++) { const y0 = 16 + band * 22; for (let x = 0; x < W; x += 2) { if (((x >> 2) + band) % 3 === 0) continue; const yy = y0 + Math.sin(x * 0.028 + S.t * 0.45 + band) * 7; g.globalAlpha = a * 0.16 * (0.6 + 0.4 * Math.sin(x * 0.05 + S.t)); P(x, yy, cols[band % 4]); } }
  // curls around the moon (or sun) and a few spots in the sky
  const spots = S.swirlSpots.slice(); if (mx != null) spots.push({ x: mx, y: my, s: 1, r: 16 }); if (sx != null && d > 0.5) spots.push({ x: sx, y: sy, s: -1, r: 20 });
  spots.forEach((c, ci) => { for (let k = 0; k < 46; k++) { const ang = c.s * (k * 0.27 + S.t * 0.5) + ci, rad = 3 + (k / 46) * (c.r + kick * 3); g.globalAlpha = a * 0.55 * (1 - k / 52); P(c.x + Math.cos(ang) * rad, c.y + Math.sin(ang) * rad * 0.75, cols[(k >> 2) % 4]); } });
  g.globalAlpha = 1;
}

/* ---------------- behaviour ---------------- */
function heroThink(dt, d) {
  hero.timer -= dt; hero.st += dt;
  if (!WET[hero.state] && (hero.x < 6 || hero.x > W - 6 || !(hero.x === hero.x))) { hero.x = clamp(hero.x === hero.x ? hero.x : 140, 6, W - 6); hero.y = FLOOR; hero.ox = null; hero.state = 'walk'; hero.target = 140; }
  const night = d < 0.3;
  if (hero.state === 'enc') { if (!ENC.cur) { hero.state = 'idle'; hero.timer = 0.5; hero.ep = null; } return; }
  if (waterThink(dt, d)) return;
  if (campThink(dt, d)) return;
  if (homeThink(dt, d)) return;
  // walk to a newly landed pot and light it
  const pot = S.rafts.find((r) => r.type === 'pot' && r.state === 'landed' && r.lit <= 0 && !r.claimed);
  if (pot && hero.state !== 'toRaft' && hero.state !== 'light' && !HOME[hero.state]) { pot.claimed = true; hero.raft = pot; hero.target = pot.x - 14; hero.state = 'toRaft'; }
  if (hero.state === 'toRaft' || hero.state === 'walk' || hero.state === 'strut') {
    const sp = (hero.state === 'strut' ? 16 : 22) * dt; const dx = hero.target - hero.x;
    hero.dir = dx >= 0 ? 1 : -1; hero.x += clamp(dx, -sp, sp);
    hero.frameT = (hero.frameT || 0) + dt * (hero.state === 'strut' ? (S.bpm / 60) * 2 : 6); hero.frame = Math.floor(hero.frameT);
    if (Math.abs(dx) < 1) { if (hero.state === 'toRaft') { hero.state = 'light'; hero.timer = 1.6; hero.dir = 1; } else { hero.timer = 0; hero.state = 'idle'; } }
    return;
  }
  if (hero.state === 'light') { if (hero.timer < 0.8 && hero.raft && hero.raft.lit <= 0) hero.raft.lit = 0.01; if (hero.timer <= 0) { hero.state = 'cheer'; hero.timer = 1.2; } return; }
  if (hero.state === 'dance') { hero.move = Math.floor(S.beat / 2); }
  if (hero.state === 'eat') { hero.eat = (Math.sin(hero.st * 1.4) + 1) / 2; if (hero.eat < 0.05 && rnd() < 0.02) hero.eatItem = !hero.eatItem; }
  if (hero.timer > 0) return;
  // choose what to do next
  const r0 = rnd();
  if (r0 < 0.035) { hero.state = 'toHut'; return; }
  if (r0 < 0.2 && S.t - (S.lastFish || -999) > 45) { S.lastFish = S.t; startFishing(); return; }
  if (r0 < 0.3 && S.t - (S.lastMallow || -999) > 55) { S.lastMallow = S.t; startMallows(); return; }
  if (r0 < 0.13 && S.t - (S.lastFeed || -999) > 150) { hero.state = 'toFeed'; S.lastFeed = S.t; return; }
  if (r0 < 0.21) { const n = d < 0.3; hero.next = 'pipe'; hero.state = 'toSeat'; hero.seatX = n ? FIRE - 22 : CHAIR + 5; hero.timer = 10 + rnd() * 8; hero.st = 0; toast(HERO + ' is taking a pipe break'); return; }
  if (r0 < 0.29) { const n = d < 0.3; hero.next = 'drink'; hero.state = 'toSeat'; hero.drinkItem = rnd() < 0.5 ? 'tea' : 'beer'; hero.seatX = n ? FIRE - 22 : CHAIR + 5; hero.timer = 9 + rnd() * 8; hero.st = 0; toast(HERO + (hero.drinkItem === 'tea' ? ' is having a cup of tea' : ' cracked open a cold beer')); return; }
  const r = rnd();
  if (night && !S.playing && r < 0.7) { hero.next = 'eat'; hero.state = 'toSeat'; hero.seatX = FIRE - 22; hero.timer = 8 + rnd() * 10; hero.st = 0; return; }
  if (night && S.playing && r < 0.25) { hero.next = 'eat'; hero.state = 'toSeat'; hero.seatX = FIRE - 22; hero.timer = 6 + rnd() * 6; hero.st = 0; return; }
  if (!night && !S.playing && r < 0.25) { hero.next = 'sit'; hero.state = 'toSeat'; hero.seatX = CHAIR + 5; hero.timer = 6 + rnd() * 8; return; }
  if (S.playing && S.energy > 0.55 && r < 0.55) { hero.state = 'dance'; hero.timer = 4 + rnd() * 6; return; }
  if (rnd() < (d > 0.4 ? 0.24 : 0.07)) { hero.state = 'toWater'; hero.target = 18 + rnd() * 30; return; }
  hero.target = clamp(40 + rnd() * 190, 30, 232);
  hero.state = S.playing && rnd() < 0.55 ? 'strut' : 'walk'; hero.timer = 0;
}
/* camp life: fishing, cooking the catch over the fire, and marshmallows for everybody */
const CAMP = { toFish: 1, fish: 1, catch: 1, toCook: 1, cook: 1, eatFish: 1, toHutM: 1, insideM: 1, carryChair: 1, roast: 1, toGive: 1, give: 1, toChair: 1, eatMallow: 1 };
const CAMPWALK = { toFish: 1, toCook: 1, toHutM: 1, carryChair: 1, toGive: 1, toChair: 1 };
const FISHES = ['a mackerel', 'a fat cod', 'a little haddock', 'a shiny herring', 'a rainbow trout', 'a striped bass'];
const LOGSEAT = FIRE - 22, CAMPCHAIR = FIRE + 21;
S.campfire = 0; S.campChair = false;
function startFishing() { hero.state = 'toFish'; hero.fx = 58 + rnd() * 70; toast(HERO + ' grabbed his fishing rod'); }
function startMallows() { hero.state = 'toHutM'; toast(HERO + ' is fetching the marshmallows'); }
function mallowTargets() {
  const t = [];
  CATS.forEach((c) => { if (!c.inside && !c.job) t.push({ kind: 'cat', x: () => c.x, y: () => FLOOR - 12, c }); });
  BL.birds.forEach((b) => { if (b.st === 'land' && b.y > HORIZON + 30) t.push({ kind: 'bird', x: () => b.x, y: () => b.y - 10, b }); });
  S.rafts.forEach((r) => { if (r.type === 'visit' && r.state === 'landed' && r.v && r.v.st === 'dance') t.push({ kind: r.v.kind === 'robot' ? 'robot' : r.v.kind === 'monkey3' ? 'monkey' : 'guest', x: () => r.x + r.v.ox, y: () => r.y + r.v.oy - 24 }); });
  if (BL.builder && BL.builder.st === 'build') t.push({ kind: 'kid', x: () => BL.builder.x, y: () => BL.builder.y - 20 });
  return t.sort((a, b) => a.x() - b.x()).slice(0, 6);
}
const YUM = { cat: ['purrr…', 'purrrr!', 'mrrrp, purr'], bird: ['yummm!', 'squawk! yum!', 'yummm'], guest: ['Yummm!', 'Arr, yummm!', 'Mmm, yum!'], robot: ['YUM.EXE', 'BEEP. YUMMM.'], monkey: ['yum! yum! yum!'], kid: ['Yummm!', 'Thanks! Yum!'] };
function campThink(dt, d) {
  const st = hero.state; if (!CAMP[st]) return false;
  const walk = (tx) => { hero.frameT = (hero.frameT || 0) + dt * 6; hero.frame = Math.floor(hero.frameT); return stepTo(tx, FLOOR, 22, dt); };
  if (st === 'toFish') { if (walk(hero.fx)) { hero.state = 'fish'; hero.dir = -1; hero.timer = 7 + rnd() * 6; hero.st = 0; hero.bx = clamp(hero.x - 34, 8, W - 8); hero.byy = shoreY(hero.bx) - 4; splash(hero.bx, hero.byy, 4); } return true; }
  if (st === 'fish') { hero.dir = -1; if (hero.timer <= 0) { hero.state = 'catch'; hero.timer = 1.6; hero.st = 0; hero.catchName = pick(FISHES); splash(hero.bx, hero.byy, 9); toast(HERO + ' caught ' + hero.catchName + '!'); say(hero.x, hero.y - 32, 'Got one!', 1.8); } return true; }
  if (st === 'catch') { if (hero.timer <= 0) hero.state = 'toCook'; return true; }
  if (st === 'toCook') { if (walk(LOGSEAT)) { hero.state = 'cook'; hero.dir = 1; hero.timer = 6.5; hero.st = 0; S.campfire = S.t + 16; toast(HERO + ' is cooking ' + hero.catchName + ' over the fire'); } return true; }
  if (st === 'cook') { hero.dir = 1; if (hero.timer <= 0) { hero.state = 'eatFish'; hero.timer = 5 + rnd() * 2; hero.st = 0; say(hero.x, hero.y - 32, 'Mmm, fresh!', 2); } return true; }
  if (st === 'eatFish') { hero.eat = (Math.sin(hero.st * 1.6) + 1) / 2; if (hero.timer <= 0) { hero.state = 'idle'; hero.timer = 0.6; } return true; }
  if (st === 'toHutM') { if (walk(HUT.door + 6)) { hero.state = 'insideM'; hero.timer = 0.9; } return true; }
  if (st === 'insideM') { if (hero.timer <= 0) { hero.state = 'carryChair'; toast(HERO + ' brought out the camp chair and a bag of marshmallows'); } return true; }
  if (st === 'carryChair') { if (walk(CAMPCHAIR)) { S.campChair = true; hero.state = 'roast'; hero.dir = -1; hero.timer = 6 + rnd() * 2; hero.st = 0; S.campfire = S.t + 30; } return true; }
  if (st === 'roast') { hero.dir = -1; if (hero.timer <= 0) { hero.queue = mallowTargets(); hero.state = hero.queue.length ? 'toGive' : 'eatMallow'; hero.timer = 4; hero.st = 0; if (hero.queue.length) toast(HERO + ' is sharing marshmallows'); } return true; }
  if (st === 'toGive') { const t = hero.queue[0]; if (!t) { hero.state = 'toChair'; return true; } const tx = t.x(), side = tx > hero.x ? -1 : 1; if (walk(clamp(tx + side * 10, 10, W - 10))) { hero.dir = tx >= hero.x ? 1 : -1; hero.state = 'give'; hero.timer = 1.6; if (t.c) { t.c.t = Math.max(t.c.t, 2.5); if (t.c.state === 'walk') { t.c.state = 'sit'; } t.c.dir = -hero.dir; } if (t.b) t.b.t = Math.min(t.b.t, (t.b.stay || 10) - 3); } return true; }
  if (st === 'give') { if (hero.timer <= 0) { const t = hero.queue.shift(); if (t) say(t.x(), t.y(), pick(YUM[t.kind] || YUM.guest), 2.4); hero.state = hero.queue.length ? 'toGive' : 'toChair'; } return true; }
  if (st === 'toChair') { if (walk(CAMPCHAIR)) { hero.state = 'eatMallow'; hero.dir = -1; hero.timer = 4 + rnd() * 2; hero.st = 0; S.campfire = Math.max(S.campfire, S.t + 8); } return true; }
  if (st === 'eatMallow') { hero.dir = -1; hero.eat = (Math.sin(hero.st * 1.8) + 1) / 2; if (hero.timer <= 0) { say(hero.x, hero.y - 32, 'Yummm!', 1.8); hero.state = 'idle'; hero.timer = 0.8; } return true; }
  return false;
}
function drawCampChair(d) {
  const sitting = hero.state === 'roast' || hero.state === 'eatMallow';
  if (!S.campChair && !sitting) return; const x = CAMPCHAIR, y = FLOOR, dim = (c) => mix('#1a1a2a', c, 0.4 + d * 0.6);
  R(x - 6, y - 7, 11, 2, dim('#2f7ab8')); R(x + 4, y - 16, 2, 10, dim('#2f7ab8')); R(x + 3, y - 16, 4, 1, dim('#1f5a8a'));
  for (let i = 0; i < 6; i++) { P(x - 5 + i, y - 5 + i, dim('#9aa0aa')); P(x + 3 - i, y - 5 + i, dim('#9aa0aa')); }
}
function campItems(st, by, x, y, flip, dim) {
  // local, pre-flipped coordinates: right hand 'out' sits near (12, -16)
  const toLocal = (wx, wy) => [(wx - Math.round(x)) * (flip ? -1 : 1), wy - Math.round(y)];
  if (st === 'fish' || st === 'catch') {
    const tipX = 22, tipY = -32 + by; ln2(12, -16 + by, tipX, tipY, dim('#8a5a2b'));
    const [lx, ly] = toLocal(hero.bx, hero.byy);
    if (st === 'fish') { const bob = Math.floor(S.t * 2) % 2; ln2(tipX, tipY, lx, ly + bob, 'rgba(255,255,255,.55)'); P(lx, ly - 1 + bob, '#ff3b3b'); P(lx, ly + bob, '#ffffff'); }
    else { const sw = Math.round(Math.sin(hero.st * 9) * 2); ln2(tipX, tipY, tipX + sw, tipY + 7, 'rgba(255,255,255,.55)'); R(tipX - 1 + sw, tipY + 7, 3, 6, dim('#9fb4c8')); P(tipX + sw, tipY + 13, dim('#9fb4c8')); P(tipX - 1 + sw, tipY + 14, dim('#9fb4c8')); P(tipX + 1 + sw, tipY + 14, dim('#9fb4c8')); }
  }
  if (st === 'catch' || st === 'toCook') { if (st === 'toCook') { R(-7, -14 + by, 3, 6, dim('#9fb4c8')); P(-6, -8 + by, dim('#9fb4c8')); } }
  if (st === 'eatFish' && hero.eat > 0.5) { R(-2, -23 + by, 5, 2, dim('#b0702a')); P(3, -24 + by, dim('#b0702a')); P(3, -21 + by, dim('#b0702a')); }
  if (st === 'roast' || st === 'give') {
    const toast_ = clamp(hero.st / 5, 0, 1), m = mix('#ffffff', '#c8843a', st === 'roast' ? toast_ : 0.5);
    ln2(12, -16 + by, 24, -21 + by, dim('#8a5a2b')); R(23, -23 + by, 3, 3, m);
    if (st === 'roast' && Math.floor(S.t * 4) % 3 === 0) P(24, -25 + by, '#ffb04a');
  }
  if (st === 'eatMallow' && hero.eat > 0.5) { R(-1, -23 + by, 3, 3, '#f4e8d0'); P(0, -23 + by, '#c8843a'); }
  if (st === 'carryChair') { R(8, -20 + by, 3, 12, dim('#2f7ab8')); R(6, -12 + by, 7, 2, dim('#9aa0aa')); R(-9, -15 + by, 4, 5, dim('#ffffff')); R(-9, -15 + by, 4, 1, dim('#ff6fa8')); }
}
function ln2(x0, y0, x1, y1, c) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; for (let i = 0; i <= n; i++) P(Math.round(x0 + (x1 - x0) * i / (n || 1)), Math.round(y0 + (y1 - y0) * i / (n || 1)), c); }
/* home life: outfit changes, feeding the cats, pipe and drinks */
const HOME = { toSeat: 1, toHut: 1, inside: 1, toFeed: 1, feed: 1, watchCats: 1, clean: 1, pipe: 1, drink: 1 };
S.bowls = null;
function homeThink(dt, d) {
  const st = hero.state; if (!HOME[st]) return false;
  const walk = (tx) => { hero.frameT = (hero.frameT || 0) + dt * 6; hero.frame = Math.floor(hero.frameT); return stepTo(tx, FLOOR, 22, dt); };
  if (st === 'toSeat') { const keep = hero.timer + dt; if (walk(hero.seatX)) { hero.state = hero.next; hero.dir = 1; hero.st = 0; } hero.timer = keep; return true; }
  if (st === 'toHut') { if (walk(HUT.door + 6)) { hero.state = 'inside'; hero.timer = 1.2 + rnd() * 1.2; } return true; }
  if (st === 'inside') { if (hero.timer <= 0) { let n; do { n = Math.floor(rnd() * OUTFITS.length); } while (n === hero.outfit); hero.outfit = n; hero.state = 'idle'; hero.timer = 1.5; hero.dir = -1; toast(HERO + ' changed into ' + OUTFITS[n].name); } return true; }
  if (st === 'toFeed') { if (walk(FEED_X)) { hero.state = 'feed'; hero.dir = 1; hero.timer = 2.4; } return true; }
  if (st === 'feed') { if (hero.timer <= 0) { S.bowls = { food: [1, 1, 1] }; CATS.forEach((c, i) => { c.inside = false; if (c.x > HUT.door - 10 && c.x < HUT.door + 20) c.x = HUT.door + 4; c.state = 'toBowl'; c.tx = BOWLS[i] - 9; c.bowl = i; }); hero.state = 'watchCats'; hero.timer = 16; toast(HERO + ' is feeding Marmalade, Pepper and Biscuit'); } return true; }
  if (st === 'watchCats') { hero.dir = 1; if (hero.timer <= 0 || CATS.every((c) => c.state !== 'toBowl' && c.state !== 'eatBowl')) { hero.state = 'clean'; hero.timer = 2.6; } return true; }
  if (st === 'clean') { if (hero.timer <= 0) { S.bowls = null; hero.state = 'idle'; hero.timer = 1; } return true; }
  if (st === 'pipe') { if (rnd() < dt * 0.9) puff(hero.x + 6, hero.y - 31, 0.45); if (hero.timer <= 0) { hero.state = 'idle'; hero.timer = 0.5; } return true; }
  if (st === 'drink') { hero.eat = (Math.sin(hero.st * 1.1) + 1) / 2; if (hero.timer <= 0) { hero.state = 'idle'; hero.timer = 0.5; } return true; }
  return false;
}
function drawBowls(d) {
  if (!S.bowls) return; const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65);
  BOWLS.forEach((bx, i) => { R(bx - 3, FLOOR - 2, 7, 2, dim(['#e8413a', '#2fa7a0', '#f2c230'][i])); R(bx - 2, FLOOR, 5, 1, dim('#2a2a3a')); if (S.bowls.food[i] && hero.state !== 'clean') R(bx - 2, FLOOR - 3, 5, 1, dim('#8a5a2b')); });
}
/* the cove: wade in, dip toes, and (by day, mostly) paddle out to surf */
const WET = { toWater: 1, wadeIn: 1, wade: 1, paddle: 1, surf: 1, paddleBack: 1, wadeOut: 1 };
const SURF_Y = HORIZON + 22;
function stepTo(tx, ty, sp, dt) { const dx = tx - hero.x, dy = ty - hero.y, dist = Math.hypot(dx, dy); if (dist < 0.8) { hero.x = tx; hero.y = ty; return true; } const k = Math.min(1, sp * dt / dist); hero.x += dx * k; hero.y += dy * k; if (Math.abs(dx) > 0.3) hero.dir = dx > 0 ? 1 : -1; return false; }
function splash(x, y, n) { for (let i = 0; i < n; i++) S.sparks.push({ x: x + rnd() * 6 - 3, y, vx: (rnd() - 0.5) * 22, vy: -12 - rnd() * 16, l: 0.7, c: rnd() < 0.5 ? '#d9f6ff' : '#9fe8ff' }); }
function waterThink(dt, d) {
  const st = hero.state; if (!WET[st]) return false;
  const walkAnim = (f) => { hero.frameT = (hero.frameT || 0) + dt * f; hero.frame = Math.floor(hero.frameT); };
  if (st === 'toWater') { walkAnim(6); if (stepTo(hero.target, FLOOR, 22, dt)) { hero.wx = hero.x; hero.wy = shoreY(hero.x) - 5; hero.state = 'wadeIn'; } return true; }
  if (st === 'wadeIn') { walkAnim(4); if (stepTo(hero.wx, hero.wy, 9, dt)) { hero.state = 'wade'; hero.timer = 5 + rnd() * 5; splash(hero.x, hero.y - 2, 6); } return true; }
  if (st === 'wade') {
    hero.frame = 0; if (rnd() < dt * 1.6) { hero.kick = 0.3; splash(hero.x + hero.dir * 2, hero.y - 3, 4); } hero.kick = Math.max(0, (hero.kick || 0) - dt);
    if (rnd() < dt * 0.3) hero.dir *= -1;
    if (hero.timer <= 0) { if (rnd() < (d > 0.4 ? 0.6 : 0.2)) { hero.state = 'paddle'; hero.sx = clamp(hero.x + 30 + rnd() * 60, 30, 170); } else hero.state = 'wadeOut'; }
    return true;
  }
  if (st === 'paddle') { walkAnim(3); if (stepTo(hero.sx, SURF_Y, 12, dt)) { hero.state = 'surf'; hero.timer = 9 + rnd() * 7; hero.sv = (rnd() < 0.5 ? -1 : 1) * (16 + rnd() * 10); } return true; }
  if (st === 'surf') {
    hero.x += hero.sv * dt; if (hero.x < 14 || hero.x > 176) { hero.sv *= -1; hero.x = clamp(hero.x, 14, 176); splash(hero.x, SURF_Y, 8); }
    hero.dir = hero.sv > 0 ? 1 : -1;
    const hop = S.playing ? Math.exp(-(S.beat % 1) * 6) * 2 : 0;
    hero.y = SURF_Y + Math.sin(S.t * 2.2) * 1.5 - hop;
    if (rnd() < dt * 4) S.sparks.push({ x: hero.x - hero.dir * 9, y: hero.y + 1, vx: -hero.dir * (6 + rnd() * 10), vy: -6 - rnd() * 8, l: 0.5, c: '#ffffff' });
    if (hero.timer <= 0) hero.state = 'paddleBack';
    return true;
  }
  if (st === 'paddleBack') { walkAnim(3); if (stepTo(hero.wx, hero.wy, 12, dt)) { hero.state = 'wadeOut'; splash(hero.x, hero.y - 2, 5); } return true; }
  if (st === 'wadeOut') { walkAnim(5); if (hero.ox == null) hero.ox = clamp(hero.x + 6, 20, 240); if (stepTo(hero.ox, FLOOR, 10, dt)) { hero.ox = null; hero.state = 'idle'; hero.timer = 0.5; } return true; }
  return false;
}
function drawBoard(x, y) {
  const c = (PACKS[S.pack] || PACKS.original).board;
  R(x - 10, y, 21, 2, c[0]); R(x - 11, y + 1, 1, 1, c[0]); R(x + 11, y, 1, 1, c[0]); R(x - 3, y, 6, 1, c[1]);
  if (S.pack === 'future') { g.globalAlpha = 0.35; R(x - 9, y + 2, 19, 1, c[0]); g.globalAlpha = 1; }
}
function waterOver(x, y, cover, d) {
  if (cover <= 0) return;
  const sea = mix('#2a5a8a', '#6fe0d6', d), foam = mix('#9fb4d8', '#ffffff', d);
  g.globalAlpha = 0.85; R(x - 6, y - cover, 13, cover + 1, sea); g.globalAlpha = 1;
  for (let i = -8; i <= 8; i++) if ((i + Math.floor(S.t * 6)) % 3) P(x + i, y - cover + Math.round(Math.sin(S.t * 4 + i) * 0.6), foam);
}
function drawHero(d) {
  const st = hero.state; if (st === 'inside') return; if (st === 'enc' && hero.ep && hero.ep.hidden) return;
  if (st === 'surf' || st === 'paddle' || st === 'paddleBack') {
    const paddling = st !== 'surf', by = Math.round(hero.y);
    if (!paddling) { // the curl of the wave behind him
      const fo = mix('#9fb4d8', '#ffffff', d);
      for (let i = 0; i < 18; i++) P(hero.x - hero.dir * (6 + i), by + 1 - Math.round(Math.sin(i / 18 * Math.PI) * 5), fo);
    }
    drawBoard(hero.x, by + (paddling ? -3 : 0));
    heroSprite(hero.x, by, hero.frame, d);
    if (paddling) waterOver(hero.x, by + 1, 9, d);
    return;
  }
  heroSprite(hero.x, hero.y, hero.frame, d);
  if (st === 'wadeIn' || st === 'wade' || st === 'wadeOut') waterOver(hero.x, Math.round(hero.y), clamp(Math.round((FLOOR - hero.y) * 0.45), 0, 6), d);
}
function catsThink(dt) {
  CATS.forEach((c) => {
    c.t -= dt; c.peek -= dt;
    if (c.job) return;
    if (c.inside) { if (c.peek <= 0 && rnd() < 0.004) { c.peek = 2 + rnd() * 4; c.peekAt = rnd() < 0.7 ? 'win' : 'door'; c.peekX = ri(0, 10); } if (c.t <= 0) { c.inside = false; c.x = HUT.door + 6; c.state = 'walk'; c.tx = 150 + rnd() * 120; c.t = 3; } return; }
    if (c.state === 'toBowl') { const dx = c.tx - c.x; c.dir = dx >= 0 ? 1 : -1; c.x += clamp(dx, -22 * dt, 22 * dt); if (Math.abs(dx) < 1) { c.state = 'eatBowl'; c.dir = 1; c.t = 6 + rnd() * 5; } return; }
    if (c.state === 'eatBowl') { if (c.t <= 0) { if (S.bowls) S.bowls.food[c.bowl] = 0; c.state = 'sit'; c.t = 3 + rnd() * 4; } return; }
    if (c.state === 'walk' || c.state === 'goHome') {
      const dx = c.tx - c.x; c.dir = dx >= 0 ? 1 : -1; c.x += clamp(dx, -14 * dt, 14 * dt);
      if (Math.abs(dx) < 1) { if (c.state === 'goHome') { c.inside = true; c.t = 8 + rnd() * 20; c.peek = 1 + rnd() * 2; c.peekAt = rnd() < 0.5 ? 'door' : 'win'; } else { c.state = 'sit'; c.t = 2 + rnd() * 6; } }
      return;
    }
    if (c.t <= 0) { const r = rnd(); if (r < 0.25) { c.state = 'goHome'; c.tx = HUT.door + 4; } else { c.state = 'walk'; c.tx = 40 + rnd() * 250; } }
  });
}
function raftsThink(dt) {
  if (S.playing && S.t - S.lastRaft > 32 + rnd() * 20) spawnRaft();
  if (!S.playing && S.t - S.lastRaft > 140) spawnRaft('pot');
  S.rafts.forEach((r) => {
    r.t += dt;
    if (r.state === 'drift') { const dx = r.land - r.x; r.x += clamp(dx, -10 * dt, 10 * dt); const tgtY = r.tgtY || SHORE + 6; r.y = lerp(HORIZON + 6, tgtY, clamp(1 - Math.abs(dx) / 200, 0, 1)); if (Math.abs(dx) < 1) { r.state = 'landed'; r.t = 0; r.y = tgtY; } }
    else if (r.state === 'landed') { if (r.lit > 0) r.lit = Math.min(1, r.lit + dt * 0.6); if (r.type !== 'pot' && r.lit <= 0) r.lit = 1; if (r.t > r.life) r.state = 'leaving'; }
    else if (r.state === 'leaving') { r.lit = Math.max(0, r.lit - dt * 0.3); r.y -= dt * 3; r.x += (r.x < W / 2 ? -1 : 1) * dt * (r.type === 'visit' ? 14 : 8); if (r.y < HORIZON + 4 || r.x < -40 || r.x > W + 40) r.state = 'gone'; }
  });
  S.rafts = S.rafts.filter((r) => r.state !== 'gone');
}

/* ---------------- beach life: petting cats, sandcastles, the drowned captain, birds, buried treasure ---------------- */
const BL = { petNext: 18, purrNext: 9, castleNext: 45, birdNext: 10, birds: [], marks: [], bubbles: [], castle: null, builder: null, ghost: null, pet: null };
const PIRATES = { pegleg: 1, hook: 1, captain: 1, parrot: 1, cutlass: 1 };
const BIRDS = [
  { kind: 'gull', w: 3 }, { kind: 'parrot', w: 1.5 }, { kind: 'puffin', w: 1.5 }, { kind: 'penguin', w: 1 }, { kind: 'osprey', w: 1 }, { kind: 'crane', w: 1 }
];
const BIRD_NAMES = { gull: 'a seagull', parrot: 'a parrot', puffin: 'a puffin', penguin: 'a penguin', osprey: 'an osprey', crane: 'a crane' };
function freeCat() { return CATS.filter((c) => !c.inside && (c.state === 'sit' || c.state === 'walk') && !c.job); }
function bubble(x, y, text, a) {
  g.save(); g.globalAlpha = a; g.font = 'bold 7px monospace';
  const words = String(text).split(' '), lines = []; let ln = '';
  words.forEach((wd) => { const t = ln ? ln + ' ' + wd : wd; if (ln && g.measureText(t).width > 150) { lines.push(ln); ln = wd; } else ln = t; }); if (ln) lines.push(ln);
  const w = Math.ceil(Math.max(...lines.map((l) => g.measureText(l).width))) + 6, hh = 1 + lines.length * 8;
  const bx = Math.round(clamp(x - w / 2, 1, W - w - 1)), by = Math.max(1, Math.round(y - 2 - hh));
  R(bx, by, w, hh, '#ffffff'); R(bx, by, w, 1, '#2a2a3a'); R(bx, by + hh - 1, w, 1, '#2a2a3a'); R(bx, by, 1, hh, '#2a2a3a'); R(bx + w - 1, by, 1, hh, '#2a2a3a');
  const tx = Math.round(clamp(x, bx + 2, bx + w - 3)); P(tx, by + hh, '#ffffff'); P(tx, by + hh + 1, '#2a2a3a');
  g.fillStyle = '#2a2a3a'; g.textBaseline = 'top'; lines.forEach((l, i) => g.fillText(l, bx + 3, by + 1 + i * 8)); g.restore();
}
function say(x, y, text, dur) { BL.bubbles.push({ x, y, text, t: 0, dur: dur || 2.6 }); }
/* little beach-goer who builds sandcastles */
function builderSprite(x, y, b, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65), step = b.st === 'walk' || b.st === 'leave' ? Math.floor(S.t * 6) % 2 : 0, dig = b.st === 'build' ? Math.floor(S.t * 5) % 2 : 0;
  g.save(); g.translate(Math.round(x), Math.round(y)); if (b.dir < 0) g.scale(-1, 1);
  R(-2 + step, -5, 2, 5, dim(b.legs)); R(1 - step, -5, 2, 5, dim(b.legs));
  R(-2, -11, 5, 6, dim(b.shirt)); R(-1, -15, 3, 4, dim(b.skin)); R(-2, -16, 5, 2, dim(b.hair));
  if (b.st === 'build') { R(3, -9 + dig * 2, 1, 4, dim('#c8a060')); R(3, -5 + dig * 2, 2, 1, dim('#888')); } else { R(3, -8, 1, 3, dim(b.skin)); R(3, -5, 3, 3, dim('#ff5a5a')); }
  g.restore();
}
const CASTLE_KINDS = ['classic', 'tower', 'wall', 'pyramid', 'moat', 'drip', 'twin'];
function castleSprite(c, d) {
  const sand = mix('#4a3048', '#c9873e', d), lite = mix('#5a4058', '#ecb46c', d), dark = mix('#2e2032', '#8a5224', d), x = Math.round(c.x), y = Math.round(c.y);
  if (c.st === 'pile' || c.st === 'raked') { const h = c.st === 'raked' ? 0 : Math.round(3 * c.pile); for (let i = -7; i <= 7; i++) { const hh = Math.max(0, h - Math.floor(Math.abs(i) / 2)); if (hh) R(x + i, y - hh, 1, hh, (i % 3) ? sand : dark); } if (c.st === 'raked' || c.rakeLines) for (let k = -10; k <= 10; k += 3) R(x + k, y - 1, 1, 3, dark); return; }
  const h = c.h; if (h <= 0) return;
  const k = c.kind || 'classic', HT = { classic: 13, tower: 19, wall: 11, pyramid: 12, moat: 13, drip: 17, twin: 15 }[k];
  if (k === 'moat') { R(x - 16, y - 2, 33, 4, mix('#1a2a4a', '#3fb0e0', d)); R(x - 16, y - 2, 33, 1, mix('#2a3a5a', '#9fe8ff', d)); }
  g.save(); g.beginPath(); g.rect(x - 30, y - Math.ceil(HT * h) - 1, 60, Math.ceil(HT * h) + 8); g.clip();
  const B = (a, b, w, hh, col) => R(x + a, y - b - hh, w, hh, col || sand), cren = (a, b, w) => { for (let i = 0; i < w; i += 2) R(x + a + i, y - b - 1, 1, 1, sand); }, hl = (a, b, hh) => R(x + a, y - b - hh, 1, hh, lite);
  let top = [0, HT];
  if (k === 'classic' || k === 'moat') { const o = k === 'moat' ? 1 : 0; B(-8 + o, 0, 17 - o * 2, 5); B(-8 + o, 5, 4, 4); B(5 - o, 5, 4, 4); B(-2, 5, 5, 7); cren(-8 + o, 9, 4); cren(5 - o, 9, 4); cren(-2, 12, 5); hl(-8 + o, 0, 9); hl(-2, 5, 7); B(0, 0, 1, 3, dark); top = [0, 12]; }
  else if (k === 'tower') { B(-6, 0, 13, 6); B(-5, 6, 11, 6); B(-4, 12, 9, 6); cren(-4, 18, 9); hl(-6, 0, 6); hl(-5, 6, 6); hl(-4, 12, 6); for (let i = 0; i < 5; i++) P(x - 4 + i * 2, y - 4 - i * 3, dark); P(x, y - 14, dark); P(x, y - 9, dark); B(0, 0, 2, 3, dark); top = [0, 18]; }
  else if (k === 'wall') { B(-15, 0, 31, 5); [-15, -2, 12].forEach((a) => { B(a, 5, 4, 5); cren(a, 10, 4); hl(a, 5, 5); }); cren(-11, 5, 9); cren(2, 5, 10); hl(-15, 0, 5); B(-1, 0, 2, 3, dark); top = [0, 10]; }
  else if (k === 'pyramid') { for (let i = 0; i < 6; i++) B(-11 + i * 2, i * 2, 23 - i * 4, 2, i % 2 ? lite : sand); B(0, 0, 1, 2, dark); top = [0, 12]; }
  else if (k === 'drip') { [[-8, 9], [-3, 16], [2, 12], [7, 8]].forEach(([a, hh]) => { for (let j = 0; j < hh; j++) { const w = Math.max(1, Math.round(4 * (1 - j / hh)) + (j % 3 === 1 ? 1 : 0)); R(x + a - Math.floor(w / 2), y - j - 1, w, 1, j % 3 === 2 ? lite : sand); } }); B(-9, 0, 19, 2); top = [-3, 16]; }
  else if (k === 'twin') { B(-10, 0, 6, 14); B(5, 0, 6, 14); B(-4, 7, 9, 3); B(-4, 0, 9, 4); cren(-10, 14, 6); cren(5, 14, 6); hl(-10, 0, 14); hl(5, 0, 14); B(-1, 0, 3, 3, dark); P(x - 7, y - 10, dark); P(x + 8, y - 10, dark); top = [-7, 14]; }
  [-6, 0, 6].forEach((i, n) => P(x + i, y - 1, n % 2 ? mix('#3a2a3a', '#fff1e6', d) : mix('#3a2a3a', '#ff8fa8', d)));
  g.restore();
  if (h >= 1) { const tx = x + top[0], ty = y - top[1];
    if (c.stick) { R(tx, ty - 13, 1, 13, mix('#3a2414', '#7a4a24', d)); for (let i = 0; i < 13; i += 3) P(tx, ty - 12 + i, mix('#3a3a3a', '#e8e0c8', d)); R(tx - 1, ty - 16, 3, 3, mix('#1a1a2a', c.stick, d)); P(tx - 2, ty - 15, mix('#1a1a2a', '#d0d8e0', d)); P(tx + 2, ty - 14, mix('#1a1a2a', '#d0d8e0', d)); }
    else { R(tx, ty - 5, 1, 5, mix('#3a3a4a', '#6a4a2a', d)); R(tx + 1, ty - 5, 3, 2, mix('#3a1a2a', c.flag || '#ff3b6b', d)); } }
}
/* the drowned captain: an original undead pirate who keeps the beach tidy */
function ghostSprite(G, d) {
  const x = Math.round(G.x), y = Math.round(G.y), glowA = 0.25 + 0.15 * Math.sin(S.t * 3) + (1 - d) * 0.25;
  g.save(); g.globalAlpha = glowA; circle(x, y - 10, 11, '#5effb0'); g.restore();
  g.save(); g.translate(x, y); if (G.dir < 0) g.scale(-1, 1);
  const coat = '#1f4a4a', coatD = '#133030', bone = '#cfe8c8', eye = '#7affd0', step = G.st === 'walk' || G.st === 'back' ? Math.floor(S.t * 5) % 2 : 0;
  R(-2 + step, -5, 2, 5, bone); R(1 - step, -5, 2, 5, bone);
  R(-4, -14, 9, 10, coat); for (let i = -4; i < 5; i += 2) P(i, -4, coatD); R(-4, -14, 1, 10, coatD);
  R(-1, -13, 2, 6, '#2a6a3a'); P(3, -10, '#3a8a3a'); P(-3, -8, '#3a8a3a'); P(2, -6, '#2a6a3a');
  R(-3, -20, 7, 6, bone); P(-1, -18, eye); P(2, -18, eye); R(-1, -16, 4, 1, '#3a4a3a'); R(-2, -15, 6, 2, '#8a9a8a'); P(0, -13, '#8a9a8a'); P(2, -13, '#8a9a8a');
  R(-5, -22, 11, 2, '#101418'); R(-3, -24, 7, 2, '#101418'); P(0, -23, bone);
  const rk = G.st === 'rake' ? Math.round(Math.sin(S.t * 5) * 3) : 0;
  R(5, -16, 1, 14, '#7a5a3a'); R(3 + rk, -2, 6, 1, '#9a9a9a'); for (let i = 0; i < 6; i += 2) P(3 + rk + i, -1, '#9a9a9a');
  R(4, -11, 2, 2, bone);
  g.restore();
}
function birdSprite(b, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.4 + d * 0.6), x = Math.round(b.x), y = Math.round(b.y), fl = Math.floor(S.t * (b.st === 'fly' || b.st === 'flee' || b.st === 'dive' ? 10 : 2) + b.ph) % 2, flying = b.st === 'fly' || b.st === 'flee' || b.st === 'dive' || b.st === 'up';
  g.save(); g.translate(x, y); if (b.dir < 0) g.scale(-1, 1);
  const k = b.kind;
  if (k === 'gull') { if (flying) { R(-4, -1 - fl, 3, 1, dim('#cfd4da')); R(1, -1 - fl, 3, 1, dim('#cfd4da')); R(-1, 0, 3, 1, dim('#ffffff')); P(2, 0, dim('#ffcc33')); } else { R(-2, -3, 4, 3, dim('#ffffff')); R(-2, -3, 3, 1, dim('#aeb4bc')); P(2, -4, dim('#ffffff')); P(3, -4, dim('#ffcc33')); P(-1, 0, dim('#ffcc33')); P(1, 0, dim('#ffcc33')); } }
  else if (k === 'parrot') { if (flying) { R(-4, -1 - fl, 3, 1, dim('#2a7ae0')); R(1, -1 - fl, 3, 1, dim('#ffd024')); R(-2, 0, 4, 1, dim('#e8302a')); P(2, -1, dim('#e8302a')); } else { R(-1, -5, 3, 4, dim('#e8302a')); P(1, -6, dim('#e8302a')); P(2, -6, dim('#ffffff')); P(3, -5, dim('#222')); R(-1, -3, 1, 3, dim('#2a7ae0')); P(-2, -1, dim('#ffd024')); P(-3, 0, dim('#2a7ae0')); } }
  else if (k === 'puffin') { if (flying) { R(-3, -1 - fl, 2, 1, dim('#111')); R(1, -1 - fl, 2, 1, dim('#111')); R(-1, 0, 3, 1, dim('#111')); P(2, 0, dim('#ff7a1a')); } else { R(-1, -5, 3, 5, dim('#111')); R(0, -3, 2, 3, dim('#ffffff')); P(1, -5, dim('#ffffff')); P(2, -5, dim('#ff7a1a')); P(2, -4, dim('#ff7a1a')); P(0, 0, dim('#ff7a1a')); } }
  else if (k === 'penguin') { const w = b.st === 'walk' ? fl : 0; R(-1, -7 + w, 4, 7, dim('#111')); R(0, -5 + w, 2, 5, dim('#ffffff')); P(2, -6 + w, dim('#ffcc33')); P(3, -6 + w, dim('#ff8a1a')); P(-2, -4 + w, dim('#111')); P(0, 0, dim('#ff8a1a')); P(2, 0, dim('#ff8a1a')); }
  else if (k === 'osprey') { if (flying) { R(-6, -1 - fl, 5, 1, dim('#5a3a20')); R(1, -1 - fl, 5, 1, dim('#5a3a20')); R(-1, 0, 3, 1, dim('#ffffff')); P(2, -1, dim('#ffffff')); if (b.fish) { P(0, 2, dim('#9ac8e0')); P(1, 2, dim('#9ac8e0')); } } else { R(-1, -5, 3, 5, dim('#5a3a20')); R(0, -4, 2, 3, dim('#ffffff')); } }
  else if (k === 'crane') { if (flying) { R(-6, -1 - fl, 5, 1, dim('#c8ccd2')); R(1, -1 - fl, 5, 1, dim('#c8ccd2')); R(-2, 0, 6, 1, dim('#ffffff')); R(4, -1, 2, 1, dim('#ffffff')); P(-5, 0, dim('#333')); } else { const peck = Math.floor(S.t * 0.7 + b.ph) % 4 === 0; R(-2, -9, 4, 3, dim('#e8ecf0')); R(-3, -8, 2, 2, dim('#9aa0a8')); R(1, peck ? -9 : -14, 1, peck ? 1 : 5, dim('#e8ecf0')); R(1, peck ? -8 : -15, 2, 1, dim('#e8ecf0')); P(peck ? 3 : 2, peck ? -7 : -15, dim('#c8302a')); P(peck ? 4 : 3, peck ? -7 : -15, dim('#555')); R(-1, -6, 1, 6, dim('#555')); if (b.oneLeg < 0.5) R(1, -6, 1, 6, dim('#555')); } }
  g.restore();
}
function spawnBird() {
  if (BL.birds.length >= 3) return;
  const t = wpick(BIRDS), dir = rnd() < 0.5 ? 1 : -1, b = { kind: t.kind, dir, x: dir > 0 ? -10 : W + 10, y: 18 + rnd() * 40, st: 'fly', t: 0, ph: rnd() * 6, oneLeg: rnd() };
  if (t.kind === 'penguin') { b.x = 30 + rnd() * 120; b.y = shoreY(b.x) - 2; b.st = 'emerge'; b.tx = clamp(b.x + (rnd() - 0.5) * 60, 30, 240); b.ty = FLOOR + 6 + rnd() * 10; b.dir = b.tx > b.x ? 1 : -1; }
  else if (t.kind === 'osprey') { b.tx = 60 + rnd() * 260; b.ty = HORIZON + 10 + rnd() * 14; }
  else if (t.kind === 'crane') { b.tx = 30 + rnd() * 110; b.ty = shoreY(b.tx) - 3; }
  else { b.tx = 40 + rnd() * 220; b.ty = FLOOR + 2 + rnd() * 18; }
  BL.birds.push(b); if (rnd() < 0.5) toast((BIRD_NAMES[t.kind].charAt(0).toUpperCase() + BIRD_NAMES[t.kind].slice(1)) + (t.kind === 'penguin' ? ' waddled up out of the water!' : t.kind === 'osprey' ? ' is fishing in the cove' : ' landed on the beach'));
}
function birdsThink(dt) {
  BL.birds.forEach((b) => {
    b.t += dt;
    if (b.st === 'fly') { const dx = b.tx - b.x, dy = b.ty - b.y, dd = Math.hypot(dx, dy); b.dir = dx >= 0 ? 1 : -1; const sp = (b.kind === 'osprey' ? 46 : 34) * dt; if (dd < sp + 0.5) { b.x = b.tx; b.y = b.ty; if (b.kind === 'osprey') { b.st = 'dive'; b.t = 0; splash(b.x, b.y, 6); } else { b.st = 'land'; b.t = 0; b.stay = b.kind === 'crane' ? 18 + rnd() * 14 : 14 + rnd() * 16; } } else { b.x += dx / dd * sp; b.y += dy / dd * sp + Math.sin(b.t * 3) * 0.2; } }
    else if (b.st === 'dive') { if (b.t > 0.6) { b.fish = true; b.st = 'flee'; b.t = 0; } }
    else if (b.st === 'emerge') { b.st = 'walk'; }
    else if (b.st === 'walk') { const dx = b.tx - b.x, dy = b.ty - b.y, dd = Math.hypot(dx, dy); if (dd < 1) { b.st = 'land'; b.t = 0; b.stay = 16 + rnd() * 12; } else { b.x += dx / dd * 7 * dt; b.y += dy / dd * 7 * dt; } }
    else if (b.st === 'land') { if (b.kind !== 'crane' && b.kind !== 'penguin' && rnd() < dt * 0.5) b.dir *= -1; if (b.t > b.stay) { if (b.kind === 'penguin') { b.st = 'home'; b.tx = b.x; b.ty = shoreY(b.x) - 2; } else { b.st = 'flee'; b.t = 0; } } }
    else if (b.st === 'home') { const dy = b.ty - b.y; b.y += clamp(dy, -10 * dt, 10 * dt); if (Math.abs(dy) < 1) { splash(b.x, b.y, 5); b.gone = true; } }
    else if (b.st === 'flee') { b.y -= 30 * dt; b.x += b.dir * 40 * dt; if (b.y < -10 || b.x < -20 || b.x > W + 20) b.gone = true; }
  });
  BL.birds = BL.birds.filter((b) => !b.gone);
}
function catChase(dt) {
  const target = BL.birds.find((b) => b.st === 'land' && b.kind !== 'crane' && b.y > FLOOR - 6 && !b.chased);
  if (target && rnd() < dt * 0.25) { const c = freeCat().sort((a, b) => Math.abs(a.x - target.x) - Math.abs(b.x - target.x))[0]; if (c) { c.job = 'chase'; c.prey = target; target.chased = true; c.state = 'walk'; } }
  CATS.forEach((c) => {
    if (c.job !== 'chase') return; const b = c.prey;
    if (!b || b.gone || (b.st !== 'land' && b.st !== 'walk')) { c.job = null; c.prey = null; c.state = 'sit'; c.t = 2; return; }
    c.tx = b.x; const dx = b.x - c.x; c.dir = dx >= 0 ? 1 : -1; c.x += clamp(dx, -26 * dt, 26 * dt);
    if (Math.abs(dx) < 12) { if (b.kind === 'penguin') { b.st = 'home'; b.tx = b.x; b.ty = shoreY(b.x) - 2; } else { b.st = 'flee'; b.t = 0; b.dir = c.dir; } c.job = null; c.prey = null; c.state = 'sit'; c.t = 3; if (rnd() < 0.6) toast(c.name + ' chased off ' + BIRD_NAMES[b.kind] + '!'); }
  });
}
function petThink(dt) {
  BL.petNext -= dt; BL.purrNext -= dt;
  const heroFree = hero.state !== 'inside' && hero.state !== 'enc' && !WET[hero.state];
  if (BL.petNext <= 0 && !BL.pet && heroFree && hero.x > 30 && hero.x < 270) {
    const c = freeCat().sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0];
    if (c) { c.job = 'pet'; c.state = 'walk'; BL.pet = { c, t: 0, st: 'go' }; }
    BL.petNext = 22 + rnd() * 25;
  }
  const P0 = BL.pet;
  if (P0) {
    const c = P0.c; P0.t += dt;
    if (P0.st === 'go') { const tx = hero.x + (hero.dir || 1) * 7, dx = tx - c.x; c.dir = dx >= 0 ? 1 : -1; c.x += clamp(dx, -18 * dt, 18 * dt); c.tx = c.x; if (Math.abs(dx) < 1.5 || P0.t > 9) { P0.st = 'pet'; P0.t = 0; c.state = 'sit'; c.t = 6; c.dir = hero.x > c.x ? 1 : -1; say(c.x + 2, FLOOR - 12, pick(['purr', 'purrr~', 'prrrr ♥', 'mrrp!']), 2.8); } }
    else if (P0.st === 'pet') { c.state = 'sit'; c.t = Math.max(c.t, 1); if (P0.t > 1.6 && !P0.second) { P0.second = 1; say(c.x + 2, FLOOR - 12, pick(['purr purr', '♥ purr ♥', 'prrrrr']), 2.4); } if (P0.t > 4.5) { c.job = null; BL.pet = null; } }
    if (BL.pet && (hero.state === 'inside' || WET[hero.state])) { c.job = null; BL.pet = null; }
  }
  if (BL.purrNext <= 0) { const c = CATS.filter((k) => !k.inside && k.state === 'sit' && !k.job); if (c.length) { const k = pick(c); say(k.x + 2, FLOOR - 12, pick(['purr', 'mrrp', 'meow', 'purrr~', 'mew?'])); } BL.purrNext = 10 + rnd() * 14; }
}
function castleThink(dt) {
  BL.castleNext -= dt;
  if (!BL.castle && !BL.builder && BL.castleNext <= 0) {
    const x = 70 + rnd() * 100, kid = { st: 'walk', x: -12, dir: 1, tx: x - 11, y: FLOOR + 14, skin: pick(['#f0c9a0', '#c48a5a', '#8a5a3c', '#e0b48a']), shirt: pick(['#ff6fa8', '#5ee0ff', '#ffd24a', '#7affb2', '#ff8a3c']), legs: pick(['#2747b8', '#2a2a3a', '#c01a2a']), hair: pick(['#3a2414', '#e8c060', '#111', '#8a3a1a']) };
    BL.builder = kid; BL.castle = { x, y: FLOOR + 14, h: 0, st: 'build', kind: pick(CASTLE_KINDS), flag: pick(['#ff3b6b', '#2f8ae0', '#ffd24a', '#7affb2', '#9a3ad8']) }; BL.castleNext = 70 + rnd() * 70; toast('Someone is building a sandcastle!');
  }
  const b = BL.builder, c = BL.castle;
  if (b) {
    if (b.st === 'walk') { const dx = b.tx - b.x; b.dir = dx >= 0 ? 1 : -1; b.x += clamp(dx, -16 * dt, 16 * dt); if (Math.abs(dx) < 1) { b.st = 'build'; b.t = 0; b.dir = 1; } }
    else if (b.st === 'build') { b.t += dt; c.h = Math.min(1, b.t / 9); if (rnd() < dt * 4) S.sparks.push({ x: c.x + rnd() * 10 - 5, y: c.y - 2, vx: (rnd() - 0.5) * 14, vy: -10 - rnd() * 8, l: 0.6, c: '#e8c880' }); if (b.t > 9) { b.st = 'admire'; b.t = 0; say(b.x, b.y - 16, pick(['ta-da!', 'my castle!', 'nailed it', 'fit for a king']), 2.2); } }
    else if (b.st === 'admire') { b.t += dt; if (b.t > 2.5) { b.st = 'leave'; b.dir = -1; c.st = 'standing'; c.t = 0; } }
    else if (b.st === 'leave') { b.x -= 18 * dt; if (b.x < -14) BL.builder = null; }
  }
  if (c && c.st === 'standing') {
    c.t += dt;
    if (c.t > 6 && !c.cat) { const k = freeCat()[0]; if (k) { c.cat = k; k.job = 'castle'; k.state = 'walk'; } }
    if (c.cat) { const k = c.cat, dx = c.x - k.x; k.dir = dx >= 0 ? 1 : -1; k.x += clamp(dx, -20 * dt, 20 * dt); k.tx = k.x; if (Math.abs(dx) < 3) { c.st = 'pile'; c.pile = 1; c.t = 0; for (let i = 0; i < 14; i++) S.sparks.push({ x: c.x + rnd() * 14 - 7, y: c.y - 4 - rnd() * 6, vx: (rnd() - 0.5) * 30, vy: -14 - rnd() * 10, l: 0.8, c: '#e8c880' }); say(k.x, FLOOR - 12, pick(['mrrp!', 'oops', '*thud*', 'meow!']), 2); toast(k.name + ' knocked down the sandcastle!'); k.job = null; k.state = 'sit'; k.t = 3; c.cat = null; } }
  }
  if (c && c.st === 'pile') { c.t += dt; if (c.t > 3 && !BL.ghost) { const gx = clamp(c.x, 40, 200); BL.ghost = { st: 'rise', x: gx, y: shoreY(gx) + 14, wy: shoreY(gx), dir: 1, t: 0 }; toast('☠ The Drowned Captain rises from the sea to rake the beach…'); } }
  const G = BL.ghost;
  if (G) {
    G.t += dt;
    if (G.st === 'rise') { G.y -= 7 * dt; if (G.y <= G.wy + 2) { G.st = 'walk'; } }
    else if (G.st === 'walk') { const tx = c ? c.x - 9 : G.x, ty = c ? c.y : FLOOR + 10, dx = tx - G.x, dy = ty - G.y, dd = Math.hypot(dx, dy); G.dir = dx >= 0 ? 1 : -1; if (dd < 1) { G.st = 'rake'; G.t = 0; G.dir = 1; say(G.x, G.y - 26, pick(['Arr... tidy beach.', 'Rake, rake, rake...', 'Me sandcastle...', 'Yarrr.']), 2.6); } else { G.x += dx / dd * 12 * dt; G.y += dy / dd * 12 * dt; } }
    else if (G.st === 'rake') { if (c) { c.pile = Math.max(0, 1 - G.t / 6); c.rakeLines = true; } if (G.t > 6.5) { if (c) c.st = 'raked'; G.st = 'back'; G.ty = shoreY(G.x) + 2; } }
    else if (G.st === 'back') { const dy = G.ty - G.y; G.dir = -1; G.y += clamp(dy, -12 * dt, 12 * dt); if (Math.abs(dy) < 1) { G.st = 'sink'; G.t = 0; } }
    else if (G.st === 'sink') { G.y += 7 * dt; if (G.t > 3) { BL.ghost = null; splash(G.x, shoreY(G.x), 8); if (c) { c.t = 0; c.fading = true; } } }
  }
  if (c && c.fading) { c.t += dt; if (c.t > 10) BL.castle = null; }
}
function treasureThink(dt) {
  S.rafts.forEach((r) => {
    if (r.type !== 'visit' || r.state !== 'landed' || !PIRATES[r.v.kind]) return; const v = r.v;
    if (v.st === 'dance' && !v.buried) { v.st = 'dig'; v.t = 0; v.digX = r.x + v.ox + 6; v.digY = r.y + v.oy; toast('\u{1F3F4}‍☠️ ' + v.name.charAt(0).toUpperCase() + v.name.slice(1) + ' is burying treasure!'); }
    if (v.st === 'dig') { if (rnd() < dt * 5) S.sparks.push({ x: v.digX + rnd() * 4 - 2, y: v.digY - 1, vx: (rnd() - 0.5) * 16, vy: -12 - rnd() * 8, l: 0.6, c: '#e8c880' }); if (v.t > 6) { v.buried = true; v.st = 'dance'; v.t = 0; BL.marks.push({ x: v.digX, y: v.digY, t: 0 }); say(r.x + v.ox, r.y + v.oy - 20, pick(['X marks the spot!', 'Yo ho ho!', 'Tell no one!', 'Arr, buried!']), 2.6); } }
  });
  BL.marks.forEach((m) => { m.t += dt; }); BL.marks = BL.marks.filter((m) => m.t < 90);
}
function drawBeachUnder(d) {
  BL.marks.forEach((m) => { const a = clamp((90 - m.t) / 10, 0, 1); g.save(); g.globalAlpha = a; const c = mix('#4a1a1a', '#c8302a', d); for (let i = -2; i <= 2; i++) { P(m.x + i, m.y + i, c); P(m.x + i, m.y - i, c); } g.restore(); });
  S.rafts.forEach((r) => { if (r.type === 'visit' && r.v && r.v.st === 'dig') { const v = r.v, k = clamp(v.t / 6, 0, 1), x = Math.round(v.digX), y = Math.round(v.digY); const sink = Math.round(k * 5); g.save(); g.beginPath(); g.rect(x - 6, y - 12, 12, 12); g.clip(); R(x - 3, y - 5 + sink, 7, 5, mix('#3a2410', '#8a5a2a', d)); R(x - 3, y - 3 + sink, 7, 1, mix('#4a3a10', '#ffd24a', d)); R(x - 3, y - 6 + sink, 7, 1, mix('#2a1a08', '#6a4020', d)); g.restore(); const sh = Math.round(Math.sin(S.t * 6) * 2); R(x - 6 + sh, y - 9, 1, 6, mix('#3a2a1a', '#a07a4a', d)); R(x - 7 + sh, y - 3, 3, 2, '#888'); } });
  if (BL.castle) { const c = BL.castle; g.save(); if (c.fading) g.globalAlpha = clamp(1 - c.t / 10, 0, 1); castleSprite(c, d); g.restore(); }
}
function drawBeachOver(dt, d) {
  if (BL.builder) builderSprite(BL.builder.x, BL.builder.y, BL.builder, d);
  if (BL.ghost) { const G = BL.ghost; g.save(); if (G.st === 'rise' || G.st === 'sink') { g.beginPath(); g.rect(0, 0, W, G.wy + 1); g.clip(); } ghostSprite(G, d); g.restore(); if (G.st === 'rise' || G.st === 'sink') { g.globalAlpha = 0.6; R(G.x - 7, G.wy, 14, 1, '#d9f6ff'); g.globalAlpha = 1; } }
  if (BL.pet && BL.pet.st === 'pet' && Math.abs(hero.x - BL.pet.c.x) < 14) { const c = BL.pet.c, hx = c.x + 2 + Math.round(Math.sin(S.t * 5) * 2); R(hx, FLOOR - 13, 3, 2, mix('#3a2a20', '#e6b68a', d)); if (Math.floor(S.t * 2) % 2) P(c.x + 6, FLOOR - 16 - Math.round((S.t * 6) % 4), '#ff5a8a'); }
  BL.birds.forEach((b) => birdSprite(b, d));
  BL.bubbles.forEach((b) => { b.t += dt; const a = clamp(Math.min(b.t / 0.2, (b.dur - b.t) / 0.4), 0, 1); if (a > 0) bubble(b.x, b.y, b.text, a); });
  BL.bubbles = BL.bubbles.filter((b) => b.t < b.dur);
}
function beachLifeThink(dt) {
  BL.birdNext -= dt; if (BL.birdNext <= 0) { spawnBird(); BL.birdNext = 14 + rnd() * 20; }
  birdsThink(dt); catChase(dt); petThink(dt); castleThink(dt); treasureThink(dt);
}

/* ---------------- random encounters (the 🎲 button) ---------------- */
const ENC = { cur: null, last: null, shake: 0, sky: 0, skyT: 0, hutGuitars: [] };
const ENC_KINDS = ['juggle', 'guitar', 'dragon', 'pirate', 'feast', 'aliens', 'beard', 'seadog'];
const GUITAR_TYPES = ['acoustic', 'strat', 'flyingv', 'singlecut', 'explorer', 'bass', 'acoustic', 'strat'];
const GUITAR_COLS = ['#e8413a', '#2f6ae0', '#f2c230', '#111318', '#f4efe6', '#7affb2', '#ff6fa8', '#c8742a', '#9a3ad8', '#5ee0ff'];
const DAD_JOKES = [
  ['Why couldn\'t the pirate play cards?', 'Because he was standing on the deck!'],
  ['What\'s a pirate\'s favourite letter?', 'Ye\'d think R, but his first love be the C!'],
  ['How much did yer peg leg and hook cost?', 'An arm and a leg!'],
  ['Why are pirates called pirates?', 'Because they just arrrr!'],
  ['What did the ocean say to the beach?', 'Nothing. It just waved.'],
  ['Why did the scarecrow win an award?', 'He was outstanding in his field.'],
  ['What do ye call a fake noodle?', 'An impasta!'],
  ['Why don\'t skeletons fight each other?', 'They don\'t have the guts. Unlike me!'],
  ['What do ye call a fish with no eyes?', 'A fsh.'],
  ['Why won\'t the crab share his treasure?', 'Because he\'s shellfish.'],
  ['What\'s brown and sticky?', 'A stick.'],
  ['What does a pirate say on his 80th birthday?', 'Aye matey! (I\'m eighty.)'],
  ['Why did ye never go to pirate school?', 'I did. I aced arrrticulation.'],
  ['What\'s orange and sounds like a parrot?', 'A carrot.'],
  ['Why did yer bicycle fall over?', 'It was two tired.'],
  ['I\'m reading a book on anti-gravity!', 'I bet ye can\'t put it down.'],
  ['Where do pirates buy their hooks?', 'The second-hand store!'],
  ['What do ye call a pirate who skips class?', 'Captain Hooky!'],
  ['How do ye make an octopus laugh?', 'Ten-tickles!'],
  ['What did one wall say to the other?', 'I\'ll meet ye at the corner.'],
  ['Why do seagulls fly over the sea?', 'If they flew over the bay, they\'d be bagels!'],
  ['What\'s a ghost\'s favourite fruit?', 'Boo-berries!'],
  ['Why did the coffee call the police?', 'It got mugged.'],
  ['How do ye organise a space party?', 'Ye planet!'],
  ['What do ye call a sleeping bull?', 'A bulldozer.'],
  ['Why can\'t yer nose be twelve inches long?', 'Then it would be a foot!'],
  ['What does a cloud wear under his raincoat?', 'Thunderwear.'],
  ['Why did the math book look so sad?', 'It had too many problems. Like ye.'],
  ['What do ye call a cow with no legs?', 'Ground beef.'],
  ['What did the pirate say when his wooden leg froze?', 'Shiver me timbers!'],
  ['Why don\'t eggs tell jokes?', 'They\'d crack each other up.'],
  ['What do ye call a dog magician?', 'A labracadabrador.'],
  ['Why was the belt arrested?', 'It was holding up a pair of pants!'],
  ['How does the moon cut its hair?', 'Eclipse it.'],
  ['What did the fish say when it swam into a wall?', 'Dam.'],
  ['Why do cows wear bells?', 'Because their horns don\'t work.'],
  ['What\'s a pirate\'s favourite exercise?', 'The plank!'],
  ['What do ye call a boomerang that won\'t come back?', 'A stick.'],
  ['How does a penguin build its house?', 'Igloos it together.'],
  ['What kind of music do mummies like?', 'Wrap music.'],
  ['Why did the golfer bring two pairs of pants?', 'In case he got a hole in one.'],
  ['What did the zero say to the eight?', 'Nice belt!'],
  ['Why can\'t ye hear a pterodactyl in the bathroom?', 'Because the P is silent.'],
  ['What do ye call a can opener that doesn\'t work?', 'A can\'t opener.'],
  ['What did the buffalo say when his son left?', 'Bison.'],
  ['Why are elevator jokes so good?', 'They work on many levels.'],
  ['What\'s the best thing about Switzerland?', 'Not sure, but the flag is a big plus.'],
  ['Did ye hear about the claustrophobic astronaut?', 'He just needed a little space.'],
  ['Why did the tomato blush?', 'It saw the salad dressing.'],
  ['How do ye catch a squirrel?', 'Climb a tree and act like a nut. Ye\'d be good at it.'],
  ['Why do pirates make terrible singers?', 'They can\'t hit the high Cs!'],
  ['What\'s a pirate\'s favourite fish?', 'A swordfish. It gets to the point!'],
  ['What do ye call a parrot that flew away?', 'A polygon.'],
  ['Why was yer ship so cheap?', 'It was on sail!'],
  ['What lies on the sea floor and twitches?', 'A nervous wreck.'],
  ['What do ye call a deer with no eyes?', 'No idea.'],
  ['Why don\'t oysters give to charity?', 'They\'re shellfish too!'],
  ['What do ye call a belt made of watches?', 'A waist of time.'],
  ['Why did the cookie go to the doctor?', 'It felt crummy.'],
  ['What did the janitor shout jumping out of the closet?', 'Supplies!'],
  ['What\'s the loudest pet?', 'A trumpet.'],
  ['Why do bees have sticky hair?', 'They use honeycombs.'],
  ['What did the grape do when it got stepped on?', 'Let out a little wine.'],
  ['How do ye make a tissue dance?', 'Put a little boogie in it.'],
  ['What do ye call an alligator in a vest?', 'An investigator.'],
  ['Why did the invisible man turn down the job?', 'He couldn\'t see himself doing it.'],
  ['What do sea monsters eat for supper?', 'Fish and ships!'],
  ['Why did the octopus beat the shark?', 'Because it was well armed.'],
  ['What\'s a pirate\'s least favourite vegetable?', 'Leeks!'],
  ['What did the pirate say to the sea?', 'Long time, no sea!'],
  ['Why was the sand wet?', 'Because the sea weed.'],
  ['What do ye call a lazy kangaroo?', 'A pouch potato.'],
  ['Why is pirating so addictive?', 'Lose yer first hand and ye\'re hooked!'],
  ['What\'s a skeleton\'s least favourite room?', 'The living room.'],
  ['Why did the stadium get so hot?', 'All the fans left.'],
  ['What do ye get crossing a snowman and a vampire?', 'Frostbite.'],
  ['What did the left eye say to the right eye?', 'Between us, something smells.'],
  ['Why do fish live in salt water?', 'Pepper makes them sneeze.'],
  ['What do ye call a sad strawberry?', 'A blueberry.'],
  ['What kind of tree fits in yer hand?', 'A palm tree! Like that one!'],
  ['How do pirates talk to each other?', 'Aye to aye!'],
  ['Why did the whale blush?', 'It saw the ocean\'s bottom.'],
  ['What do ye call a bear with no teeth?', 'A gummy bear.'],
  ['Why did the cat sit on the computer?', 'To keep an eye on the mouse.'],
  ['What\'s a pirate\'s favourite subject?', 'Arrrt!'],
  ['Why don\'t scientists trust atoms?', 'They make up everything.'],
  ['What do ye call a pile of cats?', 'A meowntain.'],
  ['What do ye call a shrimp with a sprained ankle?', 'A limp shrimp.'],
  ['What do ye call a pirate with two eyes and two legs?', 'A rookie!'],
  ['Where does a pirate keep his biscuits?', 'In his booty!'],
  ['Why couldn\'t ye learn the alphabet, pirate?', 'I spent seven years at C!'],
  ['What has eight arms and a cutlass?', 'An octo-pirate. Ye\'re outnumbered.'],
  ['Why did the sun go to school?', 'To get brighter. Ye should try it.'],
  ['What did the drummer name his twin daughters?', 'Anna One and Anna Two!'],
  ['Why did the pianist bang his head on the keys?', 'He was playing by ear!'],
  ['How do pirates know they\'re pirates?', 'They think, therefore they arrr!'],
  ['Pirate or cranberry farmer, what\'s the difference?', 'One buries treasure, one treasures berries!'],
  ['What did the shark say after eating a clownfish?', 'This tastes a little funny.'],
  ['What\'s red and bad for yer teeth?', 'A brick.'],
  ['Why did the lobster refuse to share his pudding?', 'He was a little shellfish too.']
];
let JOKE_DECK = [];
function nextJoke() { if (!JOKE_DECK.length) { JOKE_DECK = DAD_JOKES.map((_, i) => i); for (let i = JOKE_DECK.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [JOKE_DECK[i], JOKE_DECK[j]] = [JOKE_DECK[j], JOKE_DECK[i]]; } } return DAD_JOKES[JOKE_DECK.pop()]; }

function encStart(kind) {
  if (ENC.cur) { toast('Hold on, something is already happening on the island!'); return; }
  if (!kind) kind = pick(ENC_KINDS.filter((k) => k !== ENC.last));
  ENC.last = kind;
  // pull Clifford out of whatever he was doing, onto dry sand
  if (S.campChair && !CAMP[hero.state]) S.campChair = false;
  hero.state = 'enc'; hero.y = FLOOR; hero.x = clamp(hero.x, 50, 250); hero.ox = null; hero.timer = 0; hero.ep = { pl: 'down', pr: 'down', walk: false, item: null };
  const E = { kind, st: 'in', t: 0, tt: 0 }; ENC.cur = E; ENC_INIT[kind](E);
}
function encEnd() { ENC.cur = null; hero.state = 'idle'; hero.timer = 1.2; hero.ep = null; ENC.shake = 0; }
function encGo(E, st) { E.st = st; E.tt = 0; }
function heroGo(tx, dt, sp) { const e = hero.ep; e.walk = true; hero.frameT = (hero.frameT || 0) + dt * 6; hero.frame = Math.floor(hero.frameT); const dx = tx - hero.x; if (Math.abs(dx) < 1) { hero.x = tx; e.walk = false; return true; } hero.dir = dx > 0 ? 1 : -1; hero.x += clamp(dx, -(sp || 26) * dt, (sp || 26) * dt); return false; }
function moveTo(o, tx, ty, sp, dt) { const dx = tx - o.x, dy = ty - o.y, dd = Math.hypot(dx, dy); if (dd <= sp * dt || dd < 0.5) { o.x = tx; o.y = ty; return true; } o.x += dx / dd * sp * dt; o.y += dy / dd * sp * dt; return false; }
function arc(p, a, b, hgt) { return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) - Math.sin(p * Math.PI) * hgt }; }
function heroSay(t, dur) { say(hero.x, hero.y - 32, t, dur || 2.6); }

/* ---- sprites used by the encounters ---- */
function drawGuitar(x, y, gt, ang, dim) {
  const c = dim(gt.col), dk = dim(mix(gt.col, '#000000', 0.45)), nk = dim('#7a4a24'), hd = dim('#3a2414');
  g.save(); g.translate(Math.round(x), Math.round(y)); g.rotate(ang);
  const t = gt.type, len = t === 'bass' ? 13 : 10;
  R(3, -1, len, 2, nk); for (let i = 5; i < 3 + len; i += 3) P(i, -1, dim('#e8e0c8'));
  R(3 + len, -2, 3, 4, hd); P(3 + len, -3, hd); P(3 + len + 2, 2, hd);
  if (t === 'acoustic') { R(-7, -4, 6, 8, c); R(-1, -3, 4, 6, c); R(-8, -3, 1, 6, c); R(-5, -4, 3, 8, dim(mix(gt.col, '#ffffff', 0.18))); P(-1, 0, '#111'); P(0, 0, '#111'); P(-1, -1, '#111'); P(0, -1, '#111'); R(-6, -1, 1, 2, dk); }
  else if (t === 'flyingv') { for (let i = 0; i < 8; i++) { R(-7 + i, -4 + Math.floor(i / 3), 1, 2, c); R(-7 + i, 2 - Math.floor(i / 3), 1, 2, c); } R(-2, -2, 5, 4, c); R(-1, -1, 3, 2, dk); }
  else if (t === 'explorer') { R(-7, -1, 10, 3, c); R(-4, -4, 7, 3, c); R(-7, 2, 4, 2, c); R(-2, 0, 3, 1, dk); }
  else if (t === 'singlecut') { R(-7, -3, 10, 7, c); R(-8, -2, 1, 5, c); P(3, -4, c); R(-6, -3, 9, 1, dim('#f4efe6')); R(-4, -1, 2, 3, dk); R(0, -1, 2, 3, dk); }
  else { R(-7, -3, 10, 7, c); R(-8, -2, 1, 5, c); P(3, -4, c); P(3, 4, c); R(-6, 0, 6, 2, dim('#f4efe6')); R(-3, -2, 1, 4, dk); }
  g.restore();
}
function storkSprite(x, y, dir, d, carry) {
  const dim = (c) => mix('#1a1a2a', c, 0.4 + d * 0.6), fl = Math.floor(S.t * 7) % 2;
  g.save(); g.translate(Math.round(x), Math.round(y)); if (dir < 0) g.scale(-1, 1);
  R(-5, -1, 10, 3, dim('#f4f4f4')); R(5, -3, 2, 3, dim('#f4f4f4')); R(6, -4, 3, 2, dim('#f4f4f4')); R(9, -3, 4, 1, dim('#ff8a2a')); P(7, -4, '#111');
  if (fl) { R(-4, -6, 7, 1, dim('#f4f4f4')); R(-5, -7, 3, 1, dim('#111')); } else { R(-4, 2, 7, 1, dim('#f4f4f4')); R(-5, 3, 3, 1, dim('#111')); }
  R(-8, 0, 3, 1, dim('#ff8a2a')); P(-9, 1, dim('#ff8a2a'));
  if (carry) { for (let i = 0; i < 4; i++) P(11 - i, -2 + i, dim('#d8d0c0')); R(6, 2, 6, 5, dim('#f4efe6')); R(6, 2, 6, 1, dim('#c8bfa8')); P(8, 1, dim('#c8bfa8')); P(10, 1, dim('#c8bfa8')); }
  g.restore();
}
function dragonSprite(x, y, s, dir, d, flash) {
  const dim = (c) => flash ? '#ffffff' : mix('#141428', c, 0.45 + d * 0.55), fl = Math.floor(S.t * 5) % 2;
  g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(dir * s, s);
  const body = dim('#2fbf6a'), dark = dim('#1a7a44'), belly = dim('#ffd24a'), wing = dim('#1f8a7a'), wingL = dim('#7affd2');
  // far wing
  if (fl) for (let i = 0; i < 9; i++) R(-3 + Math.floor(i / 2), -4 - i, 8 - i, 1, dark); else for (let i = 0; i < 6; i++) R(-2 + Math.floor(i / 2), 3 + i, 7 - i, 1, dark);
  // tail, body, neck, head
  R(-20, -3, 4, 2, body); R(-16, -2, 4, 2, body); R(-12, -1, 5, 3, body); P(-21, -4, dim('#ff3a3a')); P(-21, -2, dim('#ff3a3a'));
  R(-8, -3, 16, 6, body); R(-6, 1, 12, 2, belly); for (let i = -6; i < 8; i += 3) P(i, -4, dim('#ff3a3a'));
  R(6, -7, 3, 5, body); R(8, -10, 7, 5, body); R(14, -9, 4, 3, body); R(14, -7, 4, 1, dark); P(11, -9, flash ? '#ff3a3a' : '#ff3a3a'); P(12, -9, '#111'); P(9, -11, dim('#f4efe6')); P(8, -12, dim('#f4efe6')); P(17, -9, '#111');
  R(-4, 3, 2, 3, dark); R(3, 3, 2, 3, dark);
  // near wing
  if (fl) for (let i = 0; i < 11; i++) { R(-5 + Math.floor(i / 2), -4 - i, 11 - i, 1, i % 3 ? wing : wingL); } else for (let i = 0; i < 7; i++) R(-4 + Math.floor(i / 2), 2 + i, 10 - i, 1, i % 3 ? wing : wingL);
  g.restore();
}
function alienSprite(a, d) {
  if (a.alpha <= 0) return; const dim = (c) => mix('#1a1a2a', c, 0.45 + d * 0.55);
  g.save(); g.globalAlpha = a.alpha; g.translate(Math.round(a.x), Math.round(a.y)); if (a.dir < 0) g.scale(-1, 1);
  const bob = a.talk ? Math.round(Math.abs(Math.sin(S.t * 8))) : 0;
  R(-3, -8, 7, 8, dim(a.robe)); R(-4, -2, 9, 2, dim(a.robe)); P(-2, 0, dim('#5a9a4a')); P(2, 0, dim('#5a9a4a'));
  R(-5, -17 - bob, 11, 9, dim('#8ae06a')); R(-4, -18 - bob, 9, 1, dim('#8ae06a'));
  R(0, -21 - bob, 1, 3, dim('#5a9a4a')); P(0, -22 - bob, Math.floor(S.t * 3 + a.ph) % 2 ? '#ff4fd8' : '#ffd24a');
  // the clever disguise: glasses, eyebrows, big nose, moustache
  R(-4, -15 - bob, 4, 3, '#111'); R(1, -15 - bob, 4, 3, '#111'); P(-3, -14 - bob, '#ffffff'); P(2, -14 - bob, '#ffffff'); P(0, -14 - bob, '#111');
  R(-4, -16 - bob, 4, 1, '#3a2414'); R(1, -16 - bob, 4, 1, '#3a2414');
  R(0, -12 - bob, 2, 3, dim('#ff9a8a')); R(-3, -10 - bob, 7, 1, '#3a2414');
  if (a.ray) { R(5, -7, 3, 1, dim('#c0c8d0')); P(8, -7, '#ff4fd8'); } else { R(-5, -7, 1, 4, dim('#8ae06a')); R(4, -7, 1, 4, dim('#8ae06a')); }
  g.restore();
}
function ballDraw(b) { R(b.x - 1, b.y - 1, 3, 3, b.c); P(b.x - 1, b.y - 1, '#ffffff'); }
function rowboat(x, y, d) { const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65); R(x - 11, y, 22, 3, dim('#7a4a24')); R(x - 9, y + 3, 18, 1, dim('#5a3418')); R(x - 11, y, 22, 1, dim('#a0703a')); }

/* ---- each encounter: init, think, and drawing behind / in front of Clifford ---- */
const PALM_TOPS = [{ x: 4 + Math.round(Math.sin(1.6) * 9) + 2, y: 210 - 84 }, { x: 204 + Math.round(Math.sin(1.6) * -6) + 2, y: 178 - 84 }];
const ENC_INIT = {
  seadog(E) { E.dg = { x: 150, y: 184, sink: 90, dir: -1, wet: 1, wag: 0, shake: 0 }; E.clipY = shoreY(150) + 2; toast('Bubbles… something HUGE is coming up out of the sea!'); for (let i = 0; i < 20; i++) S.sparks.push({ x: 150 + rnd() * 40 - 20, y: shoreY(150), vx: (rnd() - 0.5) * 30, vy: -20 - rnd() * 30, l: 0.8, c: '#d9f6ff' }); },
  beard(E) { E.sx = 108; E.chute = pick([['#e8413a', '#ffffff'], ['#2f6ae0', '#ffd24a'], ['#ff6fa8', '#7affb2'], ['#9a3ad8', '#ff8a3c']]); toast(HERO + ' is growing out his beard…'); heroSay(pick(['Hmm… I could use a trim.', 'Feels a bit scruffy…', 'Watch this!']), 2.2); },
  juggle(E) { E.gull = { x: -14, y: 26, dir: 1 }; E.balls = [{ c: '#e8413a', red: 1 }, { c: '#ffd24a' }, { c: '#2f8ae0' }]; toast('A seagull is carrying something shiny…'); },
  guitar(E) { E.gt = { type: pick(GUITAR_TYPES), col: pick(GUITAR_COLS) }; E.stork = { x: W + 16, y: 30, dir: -1, carry: true }; E.dropX = clamp(hero.x + (hero.x < 160 ? 34 : -34), 60, 250); E.g = null; toast('A stork is flying in with a special delivery!'); },
  dragon(E) { E.dr = { x: W + 40, y: 46, s: 1, dir: -1, flash: 0, cx: 210 }; E.shots = ri(3, 5); E.shot = 0; E.arrows = []; E.drops = []; toast('🐉 A DRAGON is circling the island!'); },
  pirate(E) { const p = pick(VISITORS.filter((v) => PIRATES[v.kind])); E.p = { kind: p.kind, name: p.name, st: 'aboard', walk: 0, x: -20, y: 0 }; E.boat = { x: -24, land: 70 }; E.rounds = ri(5, 7); E.round = 0; toast('⚔ A pirate rowboat is heading for the beach…'); },
  feast(E) {
    E.TX = 118; E.barge = { x: -60, land: E.TX + 4 }; E.items = []; E.guests = [];
    const cols = ['#f4efe6', '#ff6fa8', '#7affb2', '#ffd24a', '#5ee0ff'];
    const spots = [['table', E.TX, 0], ['bench', E.TX - 14, 0], ['bench', E.TX + 14, 0], ['turkey', E.TX - 4, 0], ['lobster', E.TX - 20, 0], ['pie', E.TX + 12, 0], ['punch', E.TX + 22, 0], ['fish', E.TX - 12, 0], ['candle', E.TX + 4, 0], ['candle', E.TX - 26, 0], ['candle', E.TX + 28, 0]];
    spots.forEach(([k, x], i) => E.items.push({ k, x, i, st: 'barge', p: 0, cloth: pick(cols) }));
    const kinds = ['captain', 'parrot', 'robot', 'monkey3', 'pegleg', 'hook', 'cutlass'];
    for (let i = 0; i < 4; i++) E.guests.push({ v: { kind: kinds[(i * 3 + ri(0, 6)) % kinds.length], st: 'walk', walk: 0, t: 0, ox: 0, oy: 0 }, x: 0, y: 0, seat: E.TX - 24 + i * 12, st: 'wait' });
    toast('🍗 A feast barge is sailing in!');
  },
  aliens(E) { E.ufo = rnd() < 0.55; E.v = { x: E.ufo ? W + 30 : -40, y: E.ufo ? 20 : 44 }; E.hx = clamp(hero.x + (hero.x < 170 ? 40 : -40), 80, 240); E.al = [0, 1, 2].map((i) => ({ x: E.hx - 14 + i * 14, y: FLOOR + 6, alpha: 0, dir: -1, robe: ['#6a3ab8', '#2f6ae0', '#c01a6a'][i], ph: i, talk: false })); toast(E.ufo ? '🛸 A flying saucer is coming in low…' : '✈ A strange biplane is buzzing the island…'); }
};
const ENC_THINK = {
  seadog(E, dt) {
    const D = E.dg, e = hero.ep; E.tt += dt; D.wag += dt * (E.st === 'love' ? 14 : 6); D.shake = 0;
    const DX = 214;
    if (E.st === 'in') { D.sink = Math.max(0, 90 - E.tt * 30); if (rnd() < dt * 8) splash(D.x + rnd() * 60 - 30, shoreY(D.x), 3); if (D.sink <= 0) { encGo(E, 'wade'); toast('A GIANT shaggy sea-dog climbed out of the ocean!'); say(D.x - 40, 100, 'WOOF!', 1.8); } }
    if (E.st === 'wade') { const p = Math.min(1, E.tt / 3.2); D.x = lerp(150, DX, p); E.clipY = lerp(shoreY(150) + 2, H + 10, p); if (Math.floor(E.tt * 4) % 2 && rnd() < 0.3) splash(D.x - 20, D.y - 2, 2); if (p >= 1) { encGo(E, 'shake'); toast('The sea-dog is shaking himself dry… look out!'); } }
    if (E.st === 'shake') {
      D.shake = Math.sin(E.tt * 42) * 3; D.wet = Math.max(0, 1 - E.tt / 2.6);
      for (let i = 0; i < 6; i++) { const a = rnd() * Math.PI * 2, sp = 40 + rnd() * 90; S.sparks.push({ x: D.x + rnd() * 80 - 40, y: D.y - 30 - rnd() * 40, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6 - 20, l: 0.7, c: rnd() < 0.5 ? '#9fe8ff' : '#d9f6ff' }); }
      if (!E.wetSaid && E.tt > 0.5) { E.wetSaid = 1; heroSay(pick(['Hey! I just dried off!', 'Bleh! Salty!', 'Who turned on the rain?!']), 2.2);
        S.rafts.forEach((r) => { if (r.type === 'visit' && r.state === 'landed') say(r.x + r.v.ox, r.y + r.v.oy - 24, pick(['Arr, I\'m soaked!', 'Me hat! Me hat!', 'Splash!']), 2.2); });
        if (BL.builder) say(BL.builder.x, BL.builder.y - 16, pick(['Ahh! Cold!', 'My castle!', 'Wheee, a shower!']), 2.2);
        E.cats = CATS.filter((c) => !c.inside); E.cats.forEach((c) => { c.job = 'scared'; c.state = 'walk'; say(c.x + 2, FLOOR - 12, pick(['HISSSS!', 'hsssss!', 'HISS! pfft!']), 1.6); }); }
      if (E.tt > 2.8) { encGo(E, 'fluffy'); toast('All dry, and twice as fluffy!'); say(D.x - 50, 96, 'WOOF! WOOF!', 1.8); }
    }
    (E.cats || []).forEach((c) => { if (c.job !== 'scared') return; const dx = HUT.door + 4 - c.x; c.dir = dx >= 0 ? 1 : -1; c.x += clamp(dx, -46 * dt, 46 * dt); c.tx = c.x; if (Math.abs(dx) < 1.5) { c.inside = true; c.t = 10; c.peek = 0; c.job = null; c.state = 'sit'; } });
    if (E.st === 'fluffy') { if (heroGo(clamp(D.x - 78, 60, 150), dt)) { hero.dir = 1; encGo(E, 'talk'); E.line = 0; } }
    if (E.st === 'talk' || E.st === 'love') {
      hero.dir = 1; const lines = [[0, 'Whoa… ye\'re bigger than my HOUSE!'], [1, 'WOOF!'], [0, 'And such a good, friendly pup!'], ['pet'], [1, 'Arf! *pant pant*'], [0, 'Okay. Time to go, puppy.'], [0, 'This island is too small for ye.'], [1, 'awoo…']];
      if (E.tt > 2.4 && E.line < lines.length) { const [who, txt] = lines[E.line]; if (who === 'pet') { encGo(E, 'love'); e.pl = 'up'; e.pr = 'up'; } else if (who === 0) { heroSay(txt, 2.4); e.pl = 'down'; e.pr = 'out'; } else say(D.x - 52, 96, txt, 2.2); if (who !== 'pet') E.tt = 0; E.line++; }
      if (E.st === 'love') { if (rnd() < dt * 5) S.sparks.push({ x: hero.x + rnd() * 30, y: hero.y - 34, vx: (rnd() - 0.5) * 8, vy: -16, l: 1.2, c: '#ff5a8a', note: true }); if (E.tt > 2.6) { E.st = 'talk'; E.tt = 2.4; e.pl = 'down'; e.pr = 'down'; } }
      if (E.line >= lines.length && E.tt > 2.4) { encGo(E, 'leave'); toast('The giant sea-dog is heading back out to sea'); }
    }
    if (E.st === 'leave') { D.dir = 1; const p = Math.min(1, E.tt / 4); D.x = lerp(DX, 150, p); E.clipY = lerp(H + 10, shoreY(150) + 2, p); if (p >= 1) { D.sink = Math.min(95, D.sink + dt * 30); if (rnd() < dt * 8) splash(D.x + rnd() * 60 - 30, shoreY(D.x), 3); if (D.sink >= 95) { heroSay(pick(['Bye, puppy!', 'Good boy!', 'Write when ye get there!']), 2.2); encGo(E, 'done'); } } }
    if (E.st === 'done' && E.tt > 1.6) encEnd();
  },
  beard(E, dt) {
    const e = hero.ep; E.tt += dt;
    if (E.st === 'in') { e.beard = Math.min(18, E.tt * 4.5); e.pl = 'down'; e.pr = Math.floor(E.tt * 3) % 2 ? 'eat' : 'down'; if (E.tt > 4.4) { encGo(E, 'walk'); heroSay('Now THAT is a beard.', 2); } }
    if (E.st === 'walk') { e.pr = 'down'; if (heroGo(E.sx, dt)) { hero.dir = 1; encGo(E, 'throw'); E.p = 0; heroSay('Hup!', 1.2); toast(HERO + ' flung his beard up over the palm trees!'); } }
    if (E.st === 'throw') { e.pl = 'up'; e.pr = 'up'; E.p = Math.min(1, E.tt / 1.1); if (E.tt > 1.3) { encGo(E, 'pull'); heroSay('Three… two…', 2); } }
    if (E.st === 'pull') { e.pl = 'out'; e.pr = 'out'; hero.y = FLOOR + Math.min(10, E.tt * 6); e.walk = Math.floor(E.tt * 8) % 2 === 0; hero.frame = Math.floor(E.tt * 3); if (E.tt > 2.2) { encGo(E, 'launch'); E.vy = -320; heroSay('WHEEEEEE!', 1.8); toast(HERO + ' slingshotted himself straight up into the sky!'); for (let i = 0; i < 16; i++) S.sparks.push({ x: hero.x + rnd() * 8 - 4, y: hero.y, vx: (rnd() - 0.5) * 40, vy: -10 - rnd() * 20, l: 0.6, c: '#e8c880' }); ENC.palm = 4; } }
    if (E.st === 'launch') { e.walk = false; e.pl = 'up'; e.pr = 'up'; hero.y += E.vy * dt; E.vy *= (1 - dt * 0.3); ENC.palm = Math.max(0, (ENC.palm || 0) - dt * 4) * (Math.floor(E.tt * 20) % 2 ? 1 : -1); e.beard = Math.max(0, 18 - E.tt * 12); if (rnd() < dt * 20) S.sparks.push({ x: hero.x + rnd() * 4 - 2, y: hero.y + 2, vx: 0, vy: 20, l: 0.4, c: '#ffffff' }); if (hero.y < -60) { ENC.palm = 0; encGo(E, 'sky'); } }
    if (E.st === 'sky') { if (E.tt > 1.8) { encGo(E, 'chute'); hero.x = 120 + rnd() * 60; E.bx = hero.x; hero.y = -10; e.beard = 0; toast(HERO + ' is floating back down on a parachute'); } }
    if (E.st === 'chute') { e.pl = 'up'; e.pr = 'up'; hero.y += 20 * dt; hero.x = E.bx + Math.sin(E.tt * 1.1) * 12; hero.dir = Math.cos(E.tt * 1.1) >= 0 ? 1 : -1; if (E.tt > 2 && !E.s1) { E.s1 = 1; heroSay(pick(['Lovely view up here!', 'I can see my hut from here!', 'Wheee… slowly…']), 2.4); } if (hero.y >= FLOOR) { hero.y = FLOOR; encGo(E, 'land'); heroSay(pick(['Nailed it.', 'Ten out of ten.', 'Smooth landing!']), 2); } }
    if (E.st === 'land') { e.pl = 'down'; e.pr = 'down'; if (E.tt > 1.2) { encGo(E, 'pack'); toast(HERO + ' is packing up his parachute'); } }
    if (E.st === 'pack') { hero.dir = 1; e.pl = Math.floor(E.tt * 4) % 2 ? 'out' : 'down'; e.pr = Math.floor(E.tt * 4) % 2 ? 'down' : 'out'; if (E.tt > 2.6) { e.item = 'pack'; encGo(E, 'toHut'); } }
    if (E.st === 'toHut') { e.pl = 'down'; e.pr = 'out'; if (heroGo(HUT.door + 6, dt)) { e.hidden = true; encGo(E, 'inHut'); } }
    if (E.st === 'inHut') { if (E.tt > 1.3) { e.hidden = false; e.item = null; toast(HERO + ' put the parachute away in his hut'); encGo(E, 'done'); } }
    if (E.st === 'done' && E.tt > 1.2) encEnd();
  },
  juggle(E, dt) {
    const G = E.gull, e = hero.ep; E.tt += dt;
    if (E.st === 'in') { const tx = hero.x, ty = 58; G.x += 46 * dt; G.y += clamp(ty - G.y, -20 * dt, 20 * dt); if (G.x >= tx - 2) { E.balls.forEach((b, i) => { b.x = G.x + i * 2; b.y = G.y + 2; b.vy = 10 + i * 8; b.st = 'fall'; }); encGo(E, 'drop'); say(G.x, G.y - 4, 'Catch!', 1.6); } }
    if (E.st === 'drop' || E.st === 'juggle' || E.st === 'throw') { G.x += 40 * dt; G.y -= 6 * dt; }
    if (E.st === 'drop') { e.pl = 'up'; e.pr = 'up'; let caught = 0; E.balls.forEach((b) => { if (b.st === 'fall') { b.vy += 120 * dt; b.y += b.vy * dt; b.x += (hero.x - b.x) * dt * 3; if (b.y >= FLOOR - 27) { b.st = 'held'; } } if (b.st === 'held') caught++; }); if (caught === 3) { encGo(E, 'juggle'); toast(HERO + ' is juggling!'); heroSay(pick(['Ooh, juggling balls!', 'Look, Ma!', 'Ta-da!']), 2); } }
    if (E.st === 'juggle') {
      const ph = E.tt * 2.6; e.pl = Math.floor(ph * 2) % 2 ? 'out' : 'up'; e.pr = Math.floor(ph * 2) % 2 ? 'up' : 'out';
      E.balls.forEach((b, i) => { const p = (ph + i / 3) % 1, side = Math.floor(ph + i / 3) % 2 ? 1 : -1; b.x = hero.x + side * (5 - p * 10); b.y = FLOOR - 26 - Math.sin(p * Math.PI) * 16; });
      if (E.tt > 2.5 && !E.said) { E.said = 1; heroSay(pick(['Three balls, no problem!', 'Hup! Hup! Hup!', 'I used to be in a circus!']), 2.4); }
      if (E.tt > 7) { encGo(E, 'throw'); E.next = 0; heroSay('Into the sea with ye!', 2); }
    }
    if (E.st === 'throw') {
      e.pl = 'down'; e.pr = 'up';
      E.next -= dt; if (E.next <= 0) { const b = E.balls.find((q) => q.st === 'held'); if (b) { b.st = 'fly'; b.p = 0; b.a = { x: hero.x + 4, y: FLOOR - 26 }; b.b = { x: 40 + rnd() * 120, y: HORIZON + 10 + rnd() * 18 }; b.dur = 1.6; if (b.red) { const mp = arc(0.55, b.a, b.b, 46); E.catcher = { x: mp.x - 70, y: mp.y - 22, vx: 70 / (0.55 * b.dur), vy: 22 / (0.55 * b.dur), dir: 1, st: 'in' }; } } E.next = 0.75; }
      E.balls.forEach((b) => {
        if (b.st === 'fly') { b.p += dt / b.dur; const q = arc(Math.min(1, b.p), b.a, b.b, 46); b.x = q.x; b.y = q.y; if (b.red && E.catcher && E.catcher.st === 'in' && b.p >= 0.55) { b.st = 'gull'; E.catcher.st = 'away'; toast('A seagull snatched the red ball and flew off with it!'); say(E.catcher.x, E.catcher.y - 4, 'MINE!', 2); setTimeout(() => heroSay('Hey! Come back!', 2), 500); } else if (b.p >= 1) { b.st = 'sunk'; splash(b.x, b.y, 7); } }
        if (b.st === 'gull') { b.x = E.catcher.x + 1; b.y = E.catcher.y + 3; }
      });
      const C = E.catcher; if (C) { if (C.st === 'in') { C.x += C.vx * dt; C.y += C.vy * dt; } else { C.x += 50 * dt; C.y -= 22 * dt; } }
      if (E.balls.every((b) => b.st === 'sunk' || b.st === 'gull') && (!C || C.x > W + 20 || C.y < -20)) encEnd();
      if (E.tt > 14) encEnd();
    }
  },
  guitar(E, dt) {
    const K = E.stork, e = hero.ep, gt = E.gt; E.tt += dt;
    if (K) { K.x += K.dir * 44 * dt; if (E.st !== 'in') K.y -= 8 * dt; if (K.x < -30 || K.x > W + 30) E.stork = null; }
    if (E.st === 'in' && K && K.x <= E.dropX + 8) { K.carry = false; E.g = { x: K.x + 6, y: K.y + 6, vy: 0, rot: 0 }; encGo(E, 'fall'); say(K.x, K.y - 4, pick(['Special delivery!', 'Sign here!', 'One guitar, extra crispy!']), 2); }
    if (E.st === 'fall') { const G0 = E.g; G0.vy += 120 * dt; G0.y += G0.vy * dt; G0.rot += dt * 6; if (G0.y >= FLOOR + 4) { G0.y = FLOOR + 4; G0.rot = 0.15; for (let i = 0; i < 6; i++) S.sparks.push({ x: G0.x + rnd() * 10 - 5, y: G0.y, vx: (rnd() - 0.5) * 20, vy: -10 - rnd() * 10, l: 0.5, c: '#e8c880' }); encGo(E, 'fetch'); toast('A ' + { acoustic: 'acoustic guitar', strat: 'electric guitar', flyingv: 'pointy V guitar', singlecut: 'heavy electric guitar', explorer: 'jagged electric guitar', bass: 'bass guitar' }[gt.type] + ' landed on the beach!'); heroSay('A guitar?!', 1.8); } }
    if (E.st === 'fetch') { if (heroGo(E.g.x - 7, dt)) { E.g = null; e.item = 'guitar'; e.pl = 'out'; e.pr = 'out'; hero.dir = 1; encGo(E, 'play'); } }
    if (E.st === 'play') {
      e.pr = Math.floor(E.tt * 8) % 2 ? 'out' : 'down';
      if (rnd() < dt * 5) S.sparks.push({ x: hero.x + rnd() * 10 - 5, y: hero.y - 22, vx: (rnd() - 0.5) * 10, vy: -14 - rnd() * 6, l: 1.4, c: pick(['#ffd24a', '#ff6fa8', '#5ef0ff', '#ffffff']), note: true });
      if (E.tt > 0.6 && !E.s1) { E.s1 = 1; heroSay(pick(['♪ Twang! ♪', 'Hello, Island!', '♪ Wheedly-wheedly-wheee ♪']), 2); }
      if (E.tt > 5.5) { E.smash = rnd() < 0.6; encGo(E, E.smash ? 'raise' : 'toHut'); if (!E.smash) heroSay('This one\'s a keeper.', 2); }
    }
    if (E.st === 'raise') { e.item = 'guitarUp'; e.pl = 'up'; e.pr = 'up'; if (E.tt > 1.1) { encGo(E, 'smash'); e.item = 'neck'; e.pl = 'down'; e.pr = 'out'; ENC.shake = 0.6; for (let i = 0; i < 26; i++) S.sparks.push({ x: hero.x + 8 + rnd() * 6, y: FLOOR - 2, vx: (rnd() - 0.5) * 70, vy: -20 - rnd() * 40, l: 0.9, c: rnd() < 0.6 ? gt.col : '#7a4a24' }); heroSay('ROCK AND ROLL!', 2); toast(HERO + ' smashed the guitar! Only the neck survived.'); } }
    if (E.st === 'smash') {
      ENC.shake = Math.max(0, ENC.shake - dt);
      if (E.tt > 2) {
        const c = BL.castle; if (!BL.builder && (!c || c.fading || c.st === 'pile' || c.st === 'raked')) { BL.castle = null; startCastle(); }
        encGo(E, 'toKid');
      }
    }
    if (E.st === 'toKid') {
      const b = BL.builder, c = BL.castle; if (!c) { e.item = null; encEnd(); return; }
      if (b && b.st === 'walk') { e.walk = false; return; }
      if (heroGo(c.x + 14, dt)) { hero.dir = -1; c.stick = gt.col; c.stickT = S.t; e.item = null; e.pr = 'out'; if (b) say(b.x, b.y - 16, pick(['A flagpole! Thanks!', 'Whoa, cool!', 'Best castle ever!']), 2.4); else heroSay('There. A proper flagpole.', 2.2); toast(HERO + ' gave the guitar neck to the sandcastle as a flagpole'); encGo(E, 'done'); }
    }
    if (E.st === 'toHut') { if (heroGo(HUT.door + 6, dt)) { e.hidden = true; encGo(E, 'inHut'); } }
    if (E.st === 'inHut') { if (E.tt > 1.4) { e.hidden = false; e.item = null; ENC.hutGuitars.push(gt); if (ENC.hutGuitars.length > 3) ENC.hutGuitars.shift(); toast(HERO + ' hung the guitar up in his hut'); encGo(E, 'done'); } }
    if (E.st === 'done' && E.tt > 1.5) encEnd();
  },
  dragon(E, dt, d) {
    const D = E.dr, e = hero.ep; E.tt += dt; D.flash = Math.max(0, D.flash - dt);
    const circling = E.st !== 'flee' && E.st !== 'boom' && E.st !== 'night';
    if (circling) { const tx = D.cx + Math.cos(E.t * 0.55) * 110, ty = 40 + Math.sin(E.t * 1.1) * 16 + (E.dodge || 0); D.x += (tx - D.x) * Math.min(1, dt * 1.6); D.y += (ty - D.y) * Math.min(1, dt * 1.6); D.dir = -Math.sin(E.t * 0.55) >= 0 ? 1 : -1; E.dodge = (E.dodge || 0) * (1 - dt * 2);
      if (rnd() < dt * 0.5 && !E.fire) E.fire = 0.9; if (E.fire > 0) { E.fire -= dt; for (let i = 0; i < 3; i++) S.sparks.push({ x: D.x + D.dir * 18, y: D.y - 8, vx: D.dir * (50 + rnd() * 30), vy: (rnd() - 0.3) * 20, l: 0.5, c: pick(['#ffd24a', '#ff8a3c', '#ff3a2a']) }); } else E.fire = 0;
      if (rnd() < dt * 0.25) say(D.x, D.y - 12, pick(['ROAAAR!', 'RAWR!', 'GRAAAH!']), 1.4); }
    if (E.st === 'in') { if (E.tt > 1.2) { heroSay(pick(['A dragon?! I need a bow!', 'Not on my island!', 'Where did I leave that bow…']), 2.2); encGo(E, 'toTree'); } }
    if (E.st === 'toTree') { if (heroGo(214, dt, 34)) { encGo(E, 'shake'); toast(HERO + ' is shaking the palm tree…'); } }
    if (E.st === 'shake') { e.pl = 'out'; e.pr = 'out'; hero.dir = -1; ENC.palm = Math.sin(E.tt * 34) * 3; if (E.tt > 1.6 && !E.drops.length) { const tx = 204 + Math.round(Math.sin(1.6) * -6) + 2; E.drops.push({ k: 'bow', x: tx - 4, y: 98, vy: 0 }, { k: 'quiver', x: tx + 4, y: 96, vy: -10 }, { k: 'coco', x: tx, y: 100, vy: 0 }); } if (E.tt > 2.2) { ENC.palm = 0; encGo(E, 'falling'); } }
    E.drops.forEach((q) => { if (q.y < FLOOR - 1) { q.vy += 140 * dt; q.y = Math.min(FLOOR - 1, q.y + q.vy * dt); if (q.y >= FLOOR - 1 && q.k === 'coco') { q.vy = 0; say(q.x, q.y - 4, 'bonk', 1); } } });
    if (E.st === 'falling') { if (E.drops.every((q) => q.y >= FLOOR - 1)) { if (heroGo(E.drops[0].x + 2, dt)) { E.drops = E.drops.filter((q) => q.k === 'coco'); e.item = 'bow'; e.quiver = true; heroSay('A bow and arrows! Of course!', 2); encGo(E, 'aim'); toast(HERO + ' found a bow and a quiver of arrows'); } } }
    if (E.st === 'aim') { hero.dir = D.x > hero.x ? 1 : -1; e.pl = 'out'; e.pr = 'out'; if (E.tt > 0.9) { E.shot++; const last = E.shot >= E.shots, ax = hero.x + hero.dir * 8, ay = hero.y - 18, lead = { x: D.x + (last ? 0 : (rnd() < 0.5 ? -1 : 1) * (16 + rnd() * 10)), y: D.y + (last ? 0 : -10 - rnd() * 8) }, dd = Math.hypot(lead.x - ax, lead.y - ay); E.arrows.push({ x: ax, y: ay, vx: (lead.x - ax) / dd * 230, vy: (lead.y - ay) / dd * 230, hit: last, l: 2 }); if (!last) { E.dodge = (rnd() < 0.5 ? -1 : 1) * 10; } encGo(E, 'fly'); } }
    E.arrows.forEach((a) => { a.l -= dt; if (a.hit && a.l > 0) { const dx = D.x - a.x, dy = D.y - 2 - a.y, dd = Math.hypot(dx, dy); a.vx = dx / dd * 230; a.vy = dy / dd * 230; if (dd < 6 || dd < 240 * dt) { a.l = 0; D.flash = 0.6; encGo(E, 'flee'); say(D.x, D.y - 12, 'SKREEEEE!', 2); toast('Bullseye! The dragon is fleeing!'); heroSay('Got ye!', 2); } } a.x += a.vx * dt; a.y += a.vy * dt; });
    E.arrows = E.arrows.filter((a) => a.l > 0 && a.y > -20 && a.x > -20 && a.x < W + 20);
    if (E.st === 'fly' && E.tt > 1.2) { if (E.shot < E.shots) { heroSay(pick(['Missed!', 'Hold still!', 'Drat!', 'Almost!', 'The wind took it!']), 1.6); if (rnd() < 0.6) say(D.x, D.y - 12, pick(['Ha!', 'Missed me!', 'Too slow!']), 1.4); encGo(E, 'aim'); } }
    if (E.st === 'flee') { e.pl = 'up'; e.pr = 'up'; const p = clamp(E.tt / 3.2, 0, 1); D.x += (250 - D.x) * dt * 1.2; D.y += (14 - D.y) * dt * 1.2; D.s = lerp(1, 0.18, p); if (p >= 1) { encGo(E, 'boom'); const cols = ['#ff4fd8', '#5ef0ff', '#ffe14a', '#7affb2', '#ff8a3c', '#9a8cff', '#ffffff']; for (let i = 0; i < 140; i++) { const a = rnd() * Math.PI * 2, sp = 20 + rnd() * 70; S.sparks.push({ x: D.x, y: D.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 10, l: 1.2 + rnd() * 1.2, c: pick(cols) }); } ENC.flash = 0.5; toast('KABOOM! The dragon exploded into a starry, starry night…'); } }
    if (E.st === 'boom') { e.pl = 'up'; e.pr = 'up'; if (E.tt > 0.6) { ENC.sky = 1; ENC.skyT = 0; encGo(E, 'night'); heroSay(pick(['Whoa…', 'Beautiful…', 'Now THAT is a sky.']), 2.6); } }
    if (E.st === 'night') { e.pl = 'down'; e.pr = 'down'; e.item = 'bow'; if (E.tt > 3) { e.item = null; e.quiver = false; encEnd(); } }
  },
  pirate(E, dt) {
    const B = E.boat, p = E.p, e = hero.ep; E.tt += dt; p.walk += dt * 6;
    B.y = shoreY(clamp(B.x, 0, W)) + 1;
    if (E.st === 'in') { B.x += 22 * dt; p.x = B.x; p.y = B.y; if (B.x >= B.land) { B.x = B.land; encGo(E, 'ashore'); toast('⚔ ' + p.name + ' challenges ' + HERO + ' to a dad-joke sword fight!'); } }
    if (E.st === 'ashore') { p.st = 'walk'; const tx = clamp(hero.x - 16, 40, 230); if (moveTo(p, tx, FLOOR, 22, dt)) { p.st = 'fight'; encGo(E, 'duel'); E.sub = 0; say(p.x, p.y - 26, 'En garde, ye landlubber!', 2.2); } hero.dir = p.x < hero.x ? -1 : 1; }
    if (E.st === 'duel') {
      e.item = 'sword'; hero.dir = p.x < hero.x ? -1 : 1; const r = E.round;
      if (E.sub === 0 && E.tt > 2.4) { E.joke = nextJoke(); say(p.x, p.y - 26, E.joke[0], 3.4); E.sub = 1; E.tt = 0; p.lunge = 0.4; }
      if (E.sub === 1 && E.tt > 3.2) { heroSay(E.joke[1], 3.2); E.sub = 2; E.tt = 0; e.lunge = 0.4; for (let i = 0; i < 8; i++) S.sparks.push({ x: (p.x + hero.x) / 2, y: FLOOR - 17, vx: (rnd() - 0.5) * 50, vy: -20 - rnd() * 20, l: 0.4, c: rnd() < 0.5 ? '#ffffff' : '#ffd24a' }); }
      if (E.sub === 2 && E.tt > 3.2) { E.round++; E.sub = 0; E.tt = 1.4; p.x = Math.max(30, p.x - 5); if (rnd() < 0.5) say(p.x, p.y - 26, pick(['Ouch! That one hurt!', 'Groan…', 'Arrgh, me ears!', 'That be terrible!']), 1.6); if (E.round >= E.rounds) { encGo(E, 'flee'); say(p.x, p.y - 26, pick(['Arrr! Ye out-punned me!', 'No more jokes! I yield!', 'I\'ll be back… with better jokes!']), 2.6); toast(p.name + ' surrenders and runs for the boat!'); } }
      p.lunge = Math.max(0, (p.lunge || 0) - dt); e.lunge = Math.max(0, (e.lunge || 0) - dt);
    }
    if (E.st === 'flee') { p.st = 'walk'; p.walk += dt * 6; if (moveTo(p, B.x, B.y, 40, dt)) { encGo(E, 'away'); p.st = 'aboard'; heroSay(pick(['And stay out!', 'Thank ye, I\'ll be here all week!', 'Who\'s laughing now?']), 2.4); } }
    if (E.st === 'away') { e.item = null; B.x -= 30 * dt; p.x = B.x; p.y = B.y; if (B.x < -30) encEnd(); }
  },
  feast(E, dt) {
    const B = E.barge, e = hero.ep; E.tt += dt; B.y = shoreY(clamp(B.x, 0, W)) - 1;
    if (E.st === 'in') { B.x += 28 * dt; if (B.x >= B.land) { B.x = B.land; encGo(E, 'unload'); E.k = 0; toast('The crew is unloading tables and chairs for a beach feast!'); } }
    if (E.st === 'unload') { E.k -= dt; const n = E.items.find((q) => q.st === 'barge'); if (n && E.k <= 0) { n.st = 'hop'; n.p = 0; E.k = 0.35; } if (!n && E.items.every((q) => q.st === 'set')) { encGo(E, 'gather'); E.guests.forEach((gq, i) => { gq.st = 'walk'; gq.x = B.x - 10 + i * 6; gq.y = B.y - 2; gq.delay = i * 0.6; }); toast('Everybody on the island is invited to the feast!'); heroSay('A feast! Grab a seat, everyone!', 2.4); E.cats = freeCat().slice(0, 3); E.cats.forEach((c, i) => { c.job = 'feast'; c.state = 'walk'; c.fx = E.TX - 40 - i * 8; }); } }
    E.items.forEach((q) => { if (q.st === 'hop' || q.st === 'back') { q.p += dt / 0.6; if (q.p >= 1) { q.st = q.st === 'hop' ? 'set' : 'gone'; } } });
    if (E.st === 'gather' || E.st === 'eat') {
      E.guests.forEach((gq) => { gq.v.walk += dt * 6; if (gq.st === 'walk') { gq.delay -= dt; if (gq.delay > 0) return; if (moveTo(gq, gq.seat, FLOOR - 1, 22, dt)) { gq.st = 'sit'; gq.v.st = 'eat'; } } });
      (E.cats || []).forEach((c) => { const dx = c.fx - c.x; c.dir = dx >= 0 ? 1 : -1; c.x += clamp(dx, -18 * dt, 18 * dt); c.tx = c.x; if (Math.abs(dx) < 1) c.state = 'sit'; });
      if (BL.builder && BL.builder.st === 'admire') BL.builder.t = 0;
    }
    if (E.st === 'gather') { if (heroGo(E.TX + 38, dt)) { hero.dir = -1; } if (E.guests.every((gq) => gq.st === 'sit') && !e.walk && E.tt > 2) { encGo(E, 'eat'); toast('The feast has begun!'); } }
    if (E.st === 'eat') {
      hero.dir = -1; const m = Math.floor(E.tt * 2.5) % 3; e.pr = m === 0 ? 'eat' : 'down'; e.pl = 'down';
      E.chat = (E.chat || 0) - dt; if (E.chat <= 0) { E.chat = 1.1 + rnd() * 1.2; const who = rnd(); const lines = ['Pass the lobster!', 'Yummm!', 'Mmm, pie!', 'Best feast ever!', 'More gravy!', 'Arr, delicious!', '*munch munch*', 'Who made this punch?', 'Save me a drumstick!', 'Cheers, Clifford!']; if (who < 0.2 && E.cats && E.cats.length) { const c = pick(E.cats); say(c.x + 2, FLOOR - 12, pick(['purr', 'mrrp! fish!', 'purrrr']), 1.8); } else if (who < 0.35) heroSay(pick(['Eat up, everyone!', 'Who wants seconds?', 'To the island!']), 2); else { const gq = pick(E.guests); say(gq.x, gq.y - 24, pick(lines), 2); } }
      if (E.tt > 16) { encGo(E, 'pack'); toast('Time to pack up the feast…'); heroSay('Thanks for coming, everybody!', 2.2); E.guests.forEach((gq, i) => { gq.st = 'leave'; gq.v.st = 'walk'; gq.delay = i * 0.4; }); (E.cats || []).forEach((c) => { c.job = null; c.state = 'sit'; c.t = 2; }); E.k = 1; }
    }
    if (E.st === 'pack') {
      E.guests.forEach((gq) => { gq.v.walk += dt * 6; if (gq.st !== 'leave') return; gq.delay -= dt; if (gq.delay > 0) return; if (moveTo(gq, B.x, B.y - 2, 24, dt)) gq.st = 'aboard'; });
      E.k -= dt; const n = [...E.items].reverse().find((q) => q.st === 'set'); if (n && E.k <= 0) { n.st = 'back'; n.p = 0; E.k = 0.3; }
      if (!n && E.items.every((q) => q.st === 'gone') && E.guests.every((gq) => gq.st === 'aboard')) { encGo(E, 'out'); }
    }
    if (E.st === 'out') { B.x += 30 * dt; if (B.x > W + 70) encEnd(); }
  },
  aliens(E, dt) {
    const V = E.v, e = hero.ep; E.tt += dt; const hx = E.hx, hy = E.ufo ? 64 : 44;
    if (E.st === 'in') { if (E.ufo) { V.x += (hx - V.x) * dt * 1.6; V.y += (hy - V.y) * dt * 1.6; if (Math.abs(V.x - hx) < 2) { encGo(E, 'beam'); toast('The saucer is beaming something down!'); } } else { V.x += 70 * dt; if (V.x >= hx - 10 && !E.dropped) { E.dropped = 1; encGo(E, 'beam'); toast('Something is teleporting down from the biplane!'); } } }
    if (!E.ufo && E.st !== 'in' && E.st !== 'pickup' && E.st !== 'leave') { V.x += 70 * dt; if (V.x > W + 50) V.x = -50; }
    if (E.st === 'beam') { E.al.forEach((a, i) => { a.alpha = clamp((E.tt - i * 0.5) / 1.2, 0, 1); if (rnd() < dt * 12 && a.alpha < 1) S.sparks.push({ x: a.x + rnd() * 10 - 5, y: a.y - rnd() * 18, vx: 0, vy: -10, l: 0.5, c: pick(['#7affd2', '#ffffff', '#ff4fd8']) }); }); if (E.tt > 2.6) { encGo(E, 'talk'); E.line = 0; } }
    if (E.st === 'talk') {
      hero.dir = E.al[0].x > hero.x ? 1 : -1; E.al.forEach((a) => { a.dir = hero.x > a.x ? 1 : -1; });
      const script = [[0, 'Greetings, Earthling!'], [-1, 'Uh… hi?'], [1, 'We come in peace. Mostly.'], [2, 'Take us to your… hmm.'], [0, 'Hold still. Mind-bending time!'], ['ray'], [-1, 'Whoa… everything is… paisley…'], [2, 'Wait. Is this Planet Fizzbop?'], [1, 'Oops. Wrong island.'], [0, 'Sorry! Bye!']];
      if (E.tt > 2.4 && E.line < script.length) { const [who, txt] = script[E.line]; E.al.forEach((a) => { a.talk = false; a.ray = false; }); if (who === 'ray') { E.ray = 1.6; E.al[0].ray = true; } else if (who < 0) heroSay(txt, 2.4); else { const a = E.al[who]; a.talk = true; say(a.x, a.y - 22, txt, 2.4); } E.line++; E.tt = 0; }
      if (E.ray > 0) { E.ray -= dt; e.pl = 'up'; e.pr = Math.floor(S.t * 8) % 2 ? 'up' : 'out'; ENC.wobble = 1; if (E.ray <= 0) { ENC.wobble = 0; e.pl = 'down'; e.pr = 'down'; let n; do { n = Math.floor(rnd() * OUTFITS.length); } while (n === hero.outfit); hero.outfit = n; toast('The aliens mind-bent ' + HERO + ' into ' + OUTFITS[n].name + '!'); } }
      if (E.line >= script.length && E.tt > 2.4) { encGo(E, 'up'); E.al.forEach((a) => { a.talk = false; a.ray = false; }); if (!E.ufo) { V.x = -40; } }
    }
    if (E.st === 'up') { if (!E.ufo) V.x += 70 * dt; E.al.forEach((a, i) => { a.alpha = clamp(1 - (E.tt - i * 0.3) / 1, 0, 1); if (rnd() < dt * 10 && a.alpha > 0) S.sparks.push({ x: a.x + rnd() * 10 - 5, y: a.y - rnd() * 18, vx: 0, vy: -14, l: 0.5, c: '#7affd2' }); }); if (E.tt > 2.4) { encGo(E, 'leave'); heroSay(pick(['…What just happened?', 'Nobody will believe this.', 'Nice hat, though.']), 2.6); } }
    if (E.st === 'leave') { V.x += (E.ufo ? 90 : 80) * dt; V.y -= (E.ufo ? 30 : 4) * dt; if (V.x > W + 60 || V.y < -40) encEnd(); }
  }
};
function encThink(dt, d) { const E = ENC.cur; if (E) { E.t += dt; ENC_THINK[E.kind](E, dt, d); if (ENC.cur === E && E.t > 120) { (E.cats || []).forEach((c) => { if (c.job) { c.job = null; c.state = 'sit'; c.t = 2; } }); ENC.palm = 0; ENC.wobble = 0; encEnd(); } } if (ENC.sky > 0) { ENC.skyT += dt; if (ENC.skyT > 24) ENC.sky = Math.max(0, ENC.sky - dt / 3); } ENC.flash = Math.max(0, (ENC.flash || 0) - dt); }
function startCastle() { BL.castleNext = 0; castleThink(0); }

/* neon starry-night sky after the dragon blows up */
const NEON_SWIRLS = [[70, 42, 26, 1], [160, 26, 18, -1], [240, 50, 30, 1], [330, 30, 20, -1], [118, 84, 14, -1], [292, 90, 16, 1]];
function encSky(d) {
  const a = Math.min(1, ENC.sky) * Math.min(1, ENC.skyT / 2); if (a <= 0) return;
  g.save(); g.globalAlpha = a * 0.9; R(0, 0, W, HORIZON, '#070a2e'); g.globalAlpha = a;
  for (let b = 0; b < 4; b++) for (let x = 0; x < W; x += 2) { const y = 58 + b * 12 + Math.sin(x * 0.028 + S.t * 0.6 + b) * 7 + Math.sin(x * 0.07 - S.t * 0.4) * 2; P(x, y, `hsl(${(200 + b * 30 + x * 0.3 + S.t * 20) % 360},100%,${55 + b * 5}%)`); }
  NEON_SWIRLS.forEach(([cx, cy, r0, sg], k) => { for (let i = 0; i < 150; i++) { const u = i / 150, ang = sg * (u * Math.PI * 5 + S.t * 0.7) + k, rr = r0 * (1 - u * 0.85); const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr * 0.75; const c = `hsl(${(u * 220 + S.t * 50 + k * 60) % 360},100%,62%)`; P(x, y, c); if (i % 2) P(x + 1, y, c); } });
  STARS.forEach((s, i) => { if (i % 3) return; const tw = 0.5 + 0.5 * Math.sin(S.t * 2 + s.p), c = `hsl(${(i * 37 + S.t * 30) % 360},100%,70%)`; R(s.x - 1, s.y, 3, 1, c); R(s.x, s.y - 1, 1, 3, c); if (tw > 0.6) { g.globalAlpha = a * 0.5; for (let q = 0; q < 12; q++) { const an = q / 12 * Math.PI * 2; P(s.x + Math.cos(an) * 4, s.y + Math.sin(an) * 4, c); } g.globalAlpha = a; } });
  const mx = 352, my = 22; g.globalAlpha = a * 0.25; circle(mx, my, 14, '#ffe14a'); g.globalAlpha = a; crescent(mx, my, 9, '#ffe14a');
  g.restore();
}
/* drawn before Clifford (behind him) */
function seadogSprite(D, d, clipY) {
  const wet = D.wet, dim = (c) => mix('#1a1a2a', mix(c, '#5a6a7a', wet * 0.45), 0.4 + d * 0.6), fur = dim('#d8dce2'), furD = dim('#9aa2ae'), furL = dim('#ffffff'), weed = dim('#2f8a4a');
  const jag = (i) => ((i * 37) % 5) * (1 - wet * 0.7) | 0;
  g.save(); g.beginPath(); g.rect(0, 0, W, clipY); g.clip();
  g.translate(Math.round(D.x + D.shake), Math.round(D.y + D.sink)); if (D.dir > 0) g.scale(-1, 1);
  // tail (wagging)
  const wg = Math.round(Math.sin(D.wag) * 6); for (let i = 0; i < 18; i++) R(44 + Math.round(i * 0.4) + Math.round(wg * i / 18), -50 - i, 7, 1, i % 4 ? fur : furL);
  // back legs, body, front legs
  R(20, -20, 13, 20, furD); R(34, -18, 11, 18, furD); for (let i = 0; i < 4; i++) P(21 + i * 3, -1, dim('#5a6070'));
  for (let dy = -24; dy <= 22; dy++) { const w = Math.round(46 * Math.sqrt(1 - Math.pow(dy / 25, 2))), j = jag(dy + 30); R(-w - j, -40 + dy, (w + j) * 2, 1, dy % 5 === 0 ? furL : dy > 12 ? furD : fur); }
  for (let i = 0; i < 6; i++) { const x0 = -30 + i * 11; R(x0, -58 + (i % 2) * 3, 2, 6, weed); P(x0 + 2, -53 + (i % 2) * 3, weed); }
  R(-30, -20, 13, 20, fur); R(-14, -18, 12, 18, fur); for (let i = 0; i < 4; i++) { P(-29 + i * 3, -1, dim('#5a6070')); P(-13 + i * 3, -1, dim('#5a6070')); }
  // big shaggy head
  for (let dy = -20; dy <= 20; dy++) { const w = Math.round(20 * Math.sqrt(1 - Math.pow(dy / 21, 2))), j = jag(dy + 7); R(-46 - w - j, -66 + dy, (w + j) * 2, 1, dy % 4 === 0 ? furL : fur); }
  R(-62, -66, 18, 12, furL); R(-66, -66, 6, 5, dim('#1a1a2a')); R(-65, -67, 3, 1, dim('#5a5a6a'));
  R(-60, -56, 14, 1, dim('#3a3a4a')); if (!wet || D.shake === 0) { R(-58, -55, 5, 7, dim('#ff7a9a')); R(-57, -49, 3, 1, dim('#e8506a')); }
  R(-64, -80, 34, 9, furL); for (let i = 0; i < 34; i += 3) R(-64 + i, -72, 2, 3 + (i % 2), furL);
  P(-52, -71, dim('#1a1a2a')); P(-42, -71, dim('#1a1a2a'));
  R(-32, -80, 8, 24, furD); R(-30, -57, 5, 3, furD); R(-58, -86, 6, 7, weed);
  g.restore();
}
function encBack(d) {
  const E = ENC.cur; if (!E) return; const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65);
  if (E.kind === 'seadog') seadogSprite(E.dg, d, E.clipY);
  if (E.kind === 'guitar' && E.g) drawGuitar(E.g.x, E.g.y, E.gt, E.g.rot, dim);
  if (E.kind === 'dragon') E.drops.forEach((q) => { if (q.k === 'bow') { for (let i = 0; i < 10; i++) P(q.x + Math.round(Math.sin(i / 9 * Math.PI) * 2), q.y - 9 + i, dim('#8a5a2b')); R(q.x, q.y - 9, 1, 10, dim('#f4efe6')); } else if (q.k === 'quiver') { R(q.x, q.y - 7, 3, 7, dim('#7a4a24')); P(q.x, q.y - 9, dim('#e8413a')); P(q.x + 2, q.y - 8, dim('#ffffff')); } else { R(q.x, q.y - 3, 3, 3, dim('#6a4628')); } });
  if (E.kind === 'pirate') { rowboat(E.boat.x, E.boat.y, d); if (E.st === 'away') { const o = Math.round(Math.sin(S.t * 6) * 3); R(E.boat.x - 13, E.boat.y + 1 + o, 1, 4, dim('#8a6038')); R(E.boat.x + 12, E.boat.y + 1 - o, 1, 4, dim('#8a6038')); } if (E.p.st === 'aboard') visitorSprite(E.p.x, E.p.y, E.p, d); }
  if (E.kind === 'feast') { const B = E.barge; R(B.x - 28, B.y, 56, 4, dim('#6a4628')); R(B.x - 28, B.y - 1, 56, 1, dim('#8a6038')); R(B.x + 22, B.y - 16, 1, 15, dim('#5a3418')); R(B.x + 23, B.y - 16, 6, 4, dim('#ff3b6b')); E.items.forEach((q, i) => { if (q.st === 'barge' || q.st === 'gone') R(B.x - 24 + (i % 6) * 7, B.y - 4 - Math.floor(i / 6) * 3, 6, 3, dim(i % 2 ? '#a0703a' : '#c8a060')); }); E.guests.forEach((gq) => { if (gq.st === 'wait' || gq.st === 'aboard') visitorSprite(B.x - 12 + E.guests.indexOf(gq) * 7, B.y, { ...gq.v, st: 'aboard' }, d); }); }
  if (E.kind === 'aliens' && !E.ufo && E.st !== 'leave') { /* the biplane flies in front, see encFront */ }
}
function feastItem(q, x, y, d) {
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65), k = q.k;
  if (k === 'table') { R(x - 32, y - 7, 64, 2, dim('#f4efe6')); for (let i = -32; i < 32; i += 4) R(x + i, y - 5, 2, 3, dim(i % 8 ? '#f4efe6' : '#e8413a')); R(x - 30, y - 2, 2, 7, dim('#6a4628')); R(x + 28, y - 2, 2, 7, dim('#6a4628')); return; }
  if (k === 'bench') { R(x - 12, y + 5, 24, 2, dim('#7a4a24')); R(x - 11, y + 7, 1, 3, dim('#5a3418')); R(x + 10, y + 7, 1, 3, dim('#5a3418')); return; }
  const ty = y - 8, eaten = ENC.cur && ENC.cur.st === 'eat' ? clamp(ENC.cur.tt / 16, 0, 1) : ENC.cur && ENC.cur.st === 'pack' ? 1 : 0;
  if (k === 'turkey') { R(x - 4, ty, 9, 1, dim('#ffffff')); if (eaten < 0.7) { R(x - 3, ty - 3, 7, 3, dim('#c8742a')); R(x - 2, ty - 4, 5, 1, dim('#e0954a')); P(x + 4, ty - 4, dim('#f4efe6')); P(x - 4, ty - 3, dim('#f4efe6')); } else { R(x - 2, ty - 2, 5, 1, dim('#f4efe6')); P(x, ty - 3, dim('#f4efe6')); } }
  if (k === 'lobster') { R(x - 3, ty, 7, 1, dim('#ffffff')); if (eaten < 0.8) { R(x - 2, ty - 2, 5, 2, dim('#e8302a')); P(x - 3, ty - 3, dim('#e8302a')); P(x + 3, ty - 3, dim('#e8302a')); P(x - 3, ty - 4, dim('#e8302a')); P(x + 3, ty - 4, dim('#e8302a')); } }
  if (k === 'pie') { R(x - 3, ty - 2, 7, 2, dim('#e0a050')); if (eaten < 0.6) { P(x - 2, ty - 3, dim('#c87a30')); P(x, ty - 3, dim('#c87a30')); P(x + 2, ty - 3, dim('#c87a30')); } }
  if (k === 'punch') { R(x - 3, ty - 3, 7, 3, dim('#ff4f8a')); R(x - 3, ty - 3, 7, 1, dim('#ffb0c8')); R(x - 1, ty, 3, 1, dim('#ffffff')); }
  if (k === 'fish') { R(x - 4, ty, 9, 1, dim('#ffffff')); if (eaten < 0.5) { R(x - 3, ty - 2, 5, 2, dim('#9fb4c8')); P(x + 2, ty - 1, dim('#9fb4c8')); P(x + 3, ty - 2, dim('#9fb4c8')); P(x + 3, ty, dim('#9fb4c8')); } else { R(x - 3, ty - 1, 6, 1, dim('#f4efe6')); } }
  if (k === 'candle') { R(x, ty - 4, 1, 4, dim('#f4efe6')); P(x, ty - 5 - (Math.floor(S.t * 8) % 2), Math.floor(S.t * 6) % 2 ? '#ffd24a' : '#ff8a2a'); }
}
/* drawn after Clifford (in front of him) */
function encFront(d) {
  const E = ENC.cur; if (!E) { if (ENC.flash > 0) { g.globalAlpha = ENC.flash; R(0, 0, W, H, '#ffffff'); g.globalAlpha = 1; } return; }
  const dim = (c) => mix('#1a1a2a', c, 0.35 + d * 0.65);
  if (E.kind === 'beard') {
    const bc = dim('#8a5a2b'), chin = { x: hero.x + hero.dir * 1, y: hero.y - 17 };
    if (E.st === 'throw' || E.st === 'pull') { const p = E.st === 'throw' ? E.p : 1; PALM_TOPS.forEach((t) => { const end = { x: lerp(chin.x, t.x, p), y: lerp(chin.y, t.y, p) - Math.sin(p * Math.PI) * 18 }; ln2(chin.x, chin.y, end.x, end.y, bc); ln2(chin.x + 1, chin.y, end.x + 1, end.y, bc); if (p >= 1) { R(t.x - 1, t.y - 1, 3, 3, bc); } }); }
    if (E.st === 'chute') { const cx = Math.round(hero.x), cy = Math.round(hero.y - 50); for (let i = 0; i < 9; i++) { const w = Math.round(Math.sqrt(1 - Math.pow((8 - i) / 9, 2)) * 17); for (let xx = -w; xx <= w; xx++) P(cx + xx, cy + i, dim(Math.floor((xx + 17) / 5) % 2 ? E.chute[0] : E.chute[1])); } ln2(cx - 16, cy + 8, cx - 3, hero.y - 26, dim('#e8e0d0')); ln2(cx + 16, cy + 8, cx + 3, hero.y - 26, dim('#e8e0d0')); ln2(cx - 6, cy + 8, cx - 2, hero.y - 26, dim('#e8e0d0')); ln2(cx + 6, cy + 8, cx + 2, hero.y - 26, dim('#e8e0d0')); }
    if (E.st === 'land' || E.st === 'pack') { const k = E.st === 'land' ? 1 : clamp(1 - E.tt / 2.6, 0.15, 1), cx = Math.round(hero.x + 14), w = Math.round(16 * k); for (let xx = -w; xx <= w; xx++) { const hh = Math.max(1, Math.round((3 + Math.sin(xx * 0.7) * 1.5) * k)); R(cx + xx, FLOOR - hh, 1, hh, dim(Math.floor((xx + 16) / 4) % 2 ? E.chute[0] : E.chute[1])); } }
  }
  if (E.kind === 'juggle') { birdSprite({ kind: 'gull', x: E.gull.x, y: E.gull.y, st: 'fly', dir: 1, ph: 0 }, d); if (E.catcher) birdSprite({ kind: 'gull', x: E.catcher.x, y: E.catcher.y, st: 'fly', dir: 1, ph: 1 }, d); E.balls.forEach((b) => { if (b.st && b.st !== 'sunk') ballDraw(b); }); }
  if (E.kind === 'guitar' && E.stork) { storkSprite(E.stork.x, E.stork.y, E.stork.dir, d, E.stork.carry); if (E.stork.carry) drawGuitar(E.stork.x + 9, E.stork.y + 10, E.gt, 1.3, dim); }
  if (E.kind === 'dragon') { if (E.st !== 'night') dragonSprite(E.dr.x, E.dr.y, E.dr.s, E.dr.dir, d, E.dr.flash > 0 && Math.floor(S.t * 20) % 2); E.arrows.forEach((a) => { const n = Math.hypot(a.vx, a.vy), ux = a.vx / n, uy = a.vy / n; for (let i = 0; i < 7; i++) P(a.x - ux * i, a.y - uy * i, i < 2 ? '#d0d8e0' : '#8a5a2b'); P(a.x - ux * 7, a.y - uy * 7 - 1, '#ffffff'); P(a.x - ux * 7, a.y - uy * 7 + 1, '#e8413a'); }); }
  if (E.kind === 'pirate' && E.p.st !== 'aboard') { const p = E.p; visitorSprite(p.x, p.y, p, d); const sd = hero.x > p.x ? 1 : -1, ln = (p.lunge || 0) > 0 ? 3 : 0; for (let i = 0; i < 7; i++) P(p.x + sd * (6 + i + ln), p.y - 12 - (i > 4 ? 1 : 0), dim('#d0d8e0')); R(p.x + sd * (5 + ln), p.y - 13, 1, 3, dim('#d4af37')); }
  if (E.kind === 'feast') {
    E.guests.forEach((gq) => { if (gq.st === 'walk' || gq.st === 'sit' || gq.st === 'leave') visitorSprite(gq.x, gq.y, gq.v, d); });
    E.items.forEach((q) => { const fy = FLOOR + 2; if (q.st === 'set') feastItem(q, q.x, fy, d); else if (q.st === 'hop' || q.st === 'back') { const a = { x: E.barge.x, y: E.barge.y }, b = { x: q.x, y: fy }; const pt = q.st === 'hop' ? arc(q.p, a, b, 24) : arc(q.p, b, a, 24); feastItem(q, pt.x, pt.y, d); } });
  }
  if (E.kind === 'aliens') {
    const V = E.v;
    if (E.ufo) { R(V.x - 14, V.y, 28, 3, dim('#aab4c8')); R(V.x - 10, V.y - 2, 20, 2, dim('#cfd6e4')); R(V.x - 12, V.y + 3, 24, 1, dim('#6a7488')); g.globalAlpha = 0.7; R(V.x - 5, V.y - 6, 10, 4, '#7affd2'); g.globalAlpha = 1; for (let i = -12; i <= 12; i += 4) P(V.x + i, V.y + 1, (Math.floor(S.t * 6) + i / 4) % 3 < 1 ? '#ff4fd8' : '#ffe14a'); }
    else { R(V.x - 10, V.y, 20, 3, dim('#e8413a')); R(V.x - 6, V.y - 4, 13, 1, dim('#f2c230')); R(V.x - 6, V.y + 4, 13, 1, dim('#f2c230')); R(V.x - 5, V.y - 3, 1, 7, dim('#5a3418')); R(V.x + 5, V.y - 3, 1, 7, dim('#5a3418')); R(V.x - 12, V.y - 3, 3, 3, dim('#e8413a')); R(V.x + 10, V.y - 2 + (Math.floor(S.t * 20) % 2) * 3, 1, 3, '#cfd6e4'); R(V.x - 1, V.y - 3, 3, 3, dim('#8ae06a')); }
    if (E.st === 'beam' || E.st === 'up' || (E.ufo && E.st === 'talk')) { const bx = E.ufo ? V.x : E.hx; g.globalAlpha = E.ufo ? 0.16 : 0.12; for (let yy = (E.ufo ? V.y + 4 : 0); yy < FLOOR + 8; yy++) { const w = E.ufo ? 6 + (yy - V.y) * 0.4 : 40; R(bx - w / 2, yy, w, 1, '#7affd2'); } g.globalAlpha = 1; }
    E.al.forEach((a) => alienSprite(a, d));
    if (E.ray > 0) { const a = E.al[0], x0 = a.x + a.dir * 9, y0 = a.y - 7, x1 = hero.x, y1 = hero.y - 22; for (let i = 0; i <= 30; i++) { const u = i / 30, x = lerp(x0, x1, u), y = lerp(y0, y1, u) + Math.sin(u * 14 + S.t * 20) * 2; P(x, y, `hsl(${(u * 300 + S.t * 400) % 360},100%,65%)`); } }
  }
  if (ENC.flash > 0) { g.globalAlpha = ENC.flash; R(0, 0, W, H, '#ffffff'); g.globalAlpha = 1; }
}
/* what Clifford holds during encounters (local, pre-flipped coordinates) */
function encItems(by, dim) {
  const e = hero.ep; if (!e) return; const it = e.item, L = e.lunge > 0 ? 3 : 0;
  if (e.beard > 0) { const bl = Math.round(e.beard), sw = Math.round(Math.sin(S.t * 3) * Math.min(2, bl / 8)); for (let i = 0; i < bl; i++) { const w = Math.max(2, 5 - Math.floor(i / 6)); R(-2 + Math.floor((5 - w) / 2) + Math.round(sw * i / Math.max(1, bl)), -18 + by + i, w, 1, dim(i % 4 === 3 ? '#6a4420' : '#8a5a2b')); } }
  if (it === 'pack' && ENC.cur) { R(9, -16 + by, 6, 5, dim(ENC.cur.chute ? ENC.cur.chute[0] : '#e8413a')); R(9, -16 + by, 6, 1, dim('#ffffff')); R(11, -18 + by, 2, 2, dim('#5a3418')); }
  if (e.quiver) { R(-7, -22 + by, 3, 8, dim('#7a4a24')); P(-7, -23 + by, dim('#e8413a')); P(-5, -24 + by, dim('#ffffff')); }
  if (it === 'guitar') drawGuitar(1, -12 + by, ENC.cur.gt, -0.25, dim);
  if (it === 'guitarUp') drawGuitar(0, -30 + by, ENC.cur.gt, -0.35 + Math.sin(S.t * 10) * 0.1, dim);
  if (it === 'neck') { R(12, -24 + by, 1, 10, dim('#7a4a24')); R(11, -26 + by, 3, 3, dim('#3a2414')); }
  if (it === 'sword') { for (let i = 0; i < 9; i++) P(12 + i + L, -17 + by - (i > 6 ? 1 : 0), dim('#d0d8e0')); R(11 + L, -18 + by, 1, 3, dim('#d4af37')); }
  if (it === 'bow') { for (let i = 0; i < 11; i++) P(13 + Math.round(Math.sin(i / 10 * Math.PI) * 2), -22 + by + i, dim('#8a5a2b')); R(13, -22 + by, 1, 11, 'rgba(255,255,255,.6)'); }
}

/* ---------------- main loop ---------------- */
let last = performance.now(), clockT = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, 0.1); last = now; S.t += dt; S.clock += dt / 60;
  beatTick(dt);
  const d = dayness();
  drawSky(d); encSky(d); drawFloaters(dt, d); drawSea(d);
  S.rafts.filter((r) => r.state !== 'landed').forEach((r) => drawRaft(r, d));
  drawBeach(d);
  palm(4, 210, 84, d, 9); drawHut(d); palm(204, 178, 84, d, -6 + (ENC.palm || 0));
  drawLights(d); drawFire(d); drawFurniture(d);
  S.rafts.filter((r) => r.state === 'landed').forEach((r) => { drawRaft(r, d); });
  S.rafts.forEach((r) => potFire(r));
  smokeThink(dt, d);
  drawBowls(d); drawBeachUnder(d); catsThink(dt); CATS.forEach((c) => { if (!c.inside) catSprite(c.x, FLOOR - 2 + (c.x % 7 > 3 ? 1 : 0), c.dir, c, false, false); });
  heroThink(dt, d); encThink(dt, d); encBack(d); drawHero(d); encFront(d); beachLifeThink(dt); drawBeachOver(dt, d);
  raftsThink(dt); visitorsThink(dt); shipThink(dt); swirlThink(dt); drawSparks(dt, d);
  // night tint over the island
  if (d < 0.6) { g.globalAlpha = (0.6 - d) * 0.35; R(0, HORIZON, W, H - HORIZON, '#0a0f3a'); g.globalAlpha = 1; }
  { const on = !!(S.toast && S.t < S.toast.until), cap = $('#isl-cap'); if (cap.classList.contains('on') !== on) cap.classList.toggle('on', on); if (on && cap.textContent !== S.toast.t) cap.textContent = S.toast.t; }
  clockT += dt; if (clockT > 1) { clockT = 0; const m = ((S.clock % 30) + 30) % 30, left = m < 15 ? 15 - m : 30 - m; $('#isl-clock').textContent = S.toast && S.t < S.toast.until ? S.toast.t : `${phaseName()} · ${m < 15 ? 'sunset' : 'sunrise'} in ${Math.max(0, Math.ceil(left))} min`; $('#isl-skip').textContent = m < 15 ? '\u{1F319} Skip to night' : '☀️ Skip to day'; }
}
requestAnimationFrame(frame);
cv.addEventListener('click', (e) => {
  // tapping the hut door knocks, and something unexpected happens
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
  if (x > HUT.door - 5 && x < HUT.door + 17 && y > HUT.y - 30 && y < HUT.y + 6) { say(HUT.door + 6, HUT.y - 26, 'knock knock!', 1.4); encStart(); return; }
  if (S.rafts.length < 5) spawnRaft();
});

/* message in a bottle: printable postcard */
$('#isl-print-btn').addEventListener('click', () => {
  const big = document.createElement('canvas'); big.width = W * 4; big.height = H * 4; const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(cv, 0, 0, big.width, big.height);
  const songs = S.songs.length ? S.songs : [{ title: 'the sound of the waves' }];
  $('#isl-print').innerHTML = `<img alt="The island" src="${big.toDataURL('image/png')}"><h2>A message in a bottle from ${HERO}'s island</h2><p>Dear friend, the tide brought me ${songs.length} song${songs.length === 1 ? '' : 's'} today. The cats approved. Here is what washed ashore:</p><ol>${songs.map((s) => `<li>${esc(s.title)}</li>`).join('')}</ol><p class="foot">Island Sessions · likethefish.ca · ${new Date().toLocaleDateString()}</p>`;
  window.print();
});
window.islDebug = { S, hero, CATS, BL, ENC, encStart, spawnBird, spawnRaft, songStart, setPlaying, SHIPS, NATIONS };
})();
