/* Island Sessions: a castaway, his hut, three cats, and whatever music you bring.
   An original pixel-art adventure-game island for likethefish.ca. Day turns to night every 15 minutes.
   Rafts wash ashore: magic EQ pots that shoot fibre-optic fireworks, drummers keeping their own beat, and dancers. */
(function () {
'use strict';
const root = document.getElementById('isl-root'); if (!root || root.dataset.ready) return; root.dataset.ready = '1';
const SRC = (document.currentScript && document.currentScript.src) || '';
const GM_SRC = SRC.replace(/island\/island\.js.*$/, 'rko/gm.js');
if (/gm\.js/.test(GM_SRC) && !window.LTFGM) { const gs = document.createElement('script'); gs.src = GM_SRC; document.head.appendChild(gs); }
const PLAYLISTS = (window.PQ_PLAYLISTS && window.PQ_PLAYLISTS.length) ? window.PQ_PLAYLISTS : [['Singing', '0Bxvmnd4tPBXrr8Adj47CL']];
const HERO = 'Clifford';

/* ---------------- page + UI ---------------- */
const css = `
#isl{--isl-bg:#10162e;--isl-panel:#18203f;--isl-gold:#ffd27a;--isl-ink:#eef1ff;font-family:Georgia,'Times New Roman',serif;color:var(--isl-ink);max-width:980px;margin:0 auto}
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
#isl .isl-clock{opacity:.8;white-space:nowrap}
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
#isl.isl-full{position:fixed;inset:0;z-index:2147483000;max-width:none;margin:0;background:#000;display:flex;flex-direction:column}
#isl.isl-full .isl-qp,#isl.isl-full .isl-box{display:none}
#isl.isl-full .isl-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:0}
#isl.isl-full canvas{max-width:100vw;max-height:100dvh}
#isl.isl-full .isl-hud{position:absolute;left:0;right:0;bottom:0;border-radius:0;background:#000000a0;padding:6px 12px;font-size:12px;z-index:2}
#isl .isl-ov{display:none;position:absolute;left:10px;top:10px;gap:6px;align-items:center;line-height:1;z-index:2}
#isl.isl-full .isl-ov{display:flex}
#isl .isl-ov select,#isl .isl-ov button{font:600 13px Georgia,serif;padding:7px 10px;background:#000a;color:#fff;border:1px solid #ffffff44;border-radius:999px}
@media (max-height:500px){#isl.isl-full .isl-hud{padding:4px 10px;font-size:11px}#isl .isl-ov select,#isl .isl-ov button,#isl.isl-full .isl-fs{font-size:11px;padding:6px 8px}}
html.isl-noscroll,html.isl-noscroll body{overflow:hidden!important}
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
  <div class="isl-stage"><canvas id="isl-cv" width="384" height="216" aria-label="A castaway's island: ${HERO} walks the beach by his hut while the music plays"></canvas><div class="isl-ov"><select id="isl-fpack" aria-label="Furniture"><option value="original">\u{1F334} Original</option><option value="future">\u{1F680} Future</option><option value="fancy">\u{1F3A9} Fancy</option><option value="tiki">\u{1F5FF} Tiki</option><option value="seventies">\u{1F33C} 70s</option><option value="eighties">\u{1F4FC} 80s</option></select><button id="isl-fskip" aria-label="Skip to night or day">\u{1F319}</button><button id="isl-fplay" aria-label="Play or pause">\u25B6</button></div><button class="isl-fs" id="isl-fs">⤢ Full screen</button></div>
  <div class="isl-hud"><span class="isl-now" id="isl-now">Play some music and see what washes ashore…</span><span class="isl-clock" id="isl-clock"></span></div>
  <div class="isl-box">
    <div class="isl-tabs" role="tablist">
      <button data-tab="sp" aria-pressed="true" class="alt">Spotify player</button><button data-tab="gm" aria-pressed="false" class="alt">\u{1F3AE} Game music</button><button data-tab="mic" aria-pressed="false" class="alt">\u{1F3A4} Mic</button><button data-tab="am" aria-pressed="false" class="alt">\u{1F34E} Apple Music</button><button data-tab="type" aria-pressed="false" class="alt">Type my songs</button>
    </div>
    <div class="isl-pane on" data-pane="sp">
      <div class="isl-row"><select id="isl-pl" aria-label="Pick a Like The Fish playlist"><option value="">Pick a Like The Fish playlist…</option>${PLAYLISTS.map(([n, id]) => `<option value="${id}">${n.replace(/[<>&"]/g, '')}</option>`).join('')}</select><button id="isl-rand" class="alt">\u{1F3B2} Random</button></div>
      <div class="isl-row"><input type="text" id="isl-url" placeholder="…or paste any Spotify link"><button id="isl-load" class="alt">Load player</button></div>
      <div class="isl-embed" id="isl-embed"></div>
      <p class="isl-note">Press play in the Spotify player. Each new song sends a fresh raft toward the island.</p>
    </div>
    <div class="isl-pane" data-pane="gm">
      <div class="isl-row"><select id="isl-gmcoll" aria-label="Game music collection"></select><select id="isl-gmsub" aria-label="C64 remixes"></select></div>
      <audio id="isl-gmau" controls preload="none"></audio>
      <div class="isl-row"><button id="isl-gmnext" class="alt">⏭ Next song</button></div>
      <p class="isl-note" id="isl-gmcredit"></p>
      <p class="isl-note">C64 remixes stream from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>. Relaxing, Encapsulating and Insanity are music by Kevin MacLeod (<a href="https://incompetech.com/" target="_blank" rel="noopener">incompetech.com</a>), licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">Creative Commons: By Attribution 4.0</a>. MOBYGRATIS moods are free music from <a href="https://mobygratis.com/" target="_blank" rel="noopener">mobygratis.com</a>. Thank you, MOBYGRATIS!</p>
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
  MODE = b.dataset.tab;
}));
function tab(name) { const b = root.querySelector(`[data-tab="${name}"]`); if (b && MODE !== name) b.click(); }

/* Spotify embed */
let api = null, apiWaiting = null, apiLoading = false, ctrl = null; const SP = { uri: null, dur: 0, pos: 0, hasUri: false, pendingPlay: false };
function toUri(t) { t = (t || '').trim(); if (/^spotify:/.test(t)) return t; const m = t.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/); return m ? `spotify:${m[1]}:${m[2]}` : null; }
function fetchTitle(uri, cb) { const m = uri && uri.match(/spotify:track:(\w+)/); if (!m) return cb(null); fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent('https://open.spotify.com/track/' + m[1])).then((r) => r.json()).then((j) => cb(j && j.title)).catch(() => cb(null)); }
function loadEmbed(uri, autoplay) {
  SP.pendingPlay = !!autoplay;
  const make = () => {
    const host = $('#isl-embed'); host.innerHTML = ''; const el = document.createElement('div'); host.appendChild(el);
    api.createController(el, { uri, width: '100%', height: uri.includes(':track:') ? 152 : 352 }, (c) => {
      ctrl = c;
      c.addListener('ready', () => { if (SP.pendingPlay) { SP.pendingPlay = false; try { c.play(); } catch (e) {} } });
      c.addListener('playback_started', (e) => { const u = e && e.data && e.data.playingURI; if (u && u !== SP.uri) { SP.uri = u; SP.hasUri = true; if (MODE !== 'sp') tab('sp'); fetchTitle(u, (t) => songStart(t)); } setPlaying(true); });
      c.addListener('playback_update', (e) => {
        const t = (e && e.data) || {}; const on = !t.isPaused && !t.isBuffering;
        if (!SP.hasUri && on) { const changed = (t.duration && Math.abs(t.duration - SP.dur) > 1500) || (SP.pos > 4000 && t.position < 1500); if (S.cur < 0 || changed) songStart(null); }
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
function fitFull() { if (!$('#isl').classList.contains('isl-full')) { cv.style.width = ''; cv.style.height = ''; return; } const vw = (window.visualViewport && window.visualViewport.width) || window.innerWidth, vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight, k = Math.min(vw / W, vh / H); cv.style.width = Math.floor(W * k) + 'px'; cv.style.height = Math.floor(H * k) + 'px'; }
window.addEventListener('resize', () => setTimeout(fitFull, 50)); window.addEventListener('orientationchange', () => setTimeout(fitFull, 300)); if (window.visualViewport) window.visualViewport.addEventListener('resize', () => setTimeout(fitFull, 50));
function setFull(on) { $('#isl').classList.toggle('isl-full', on); document.documentElement.classList.toggle('isl-noscroll', on); $('#isl-fs').textContent = on ? '✕ Exit' : '⤢ Full screen'; setTimeout(fitFull, 30); }
$('#isl-fs').addEventListener('click', () => { const on = !$('#isl').classList.contains('isl-full'); setFull(on); const el = $('#isl'); try { if (on && el.requestFullscreen) el.requestFullscreen().catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {} });
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
  if (night < 0.25) return;
  const k = S.playing ? 1 + Math.exp(-(S.beat % 1) * 5) * 0.4 : 1;
  for (let i = 0; i < 26; i++) { const fx = x - 4 + rnd() * 8, fy = y - 1 - rnd() * 12 * k; P(fx, fy, pick(['#ff9a3c', '#ffd27a', '#ff5a2a', '#fff3b0'])); }
  g.globalAlpha = 0.16 * night; circle(x, y - 5, 26, '#ff9a3c'); g.globalAlpha = 1;
  if (rnd() < 0.3) S.sparks.push({ x: x + rnd() * 6 - 3, y: y - 10, vx: rnd() * 6 - 3, vy: -14 - rnd() * 10, l: 1.2, c: '#ffb04a' });
  // cooking skewer
  R(x - 9, y - 8, 18, 1, '#5a3a1c'); R(x - 2, y - 10, 4, 3, '#a0522d');
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
  const sit = st === 'sit' || st === 'eat' || st === 'pipe' || st === 'drink';
  const legY = sit ? -6 : 0;
  // legs
  if (sit) { R(-4, -8, 9, 3, pants); R(4, -8, 3, 7, pants); R(4, -1, 3, 1, feet); R(-2, -8, 3, 7, pants); R(-2, -1, 3, 1, feet); }
  else {
    const step = (st === 'walk' || st === 'strut' || st === 'toSeat' || st === 'toHut' || st === 'toFeed' || st === 'toWater' || st === 'wadeIn' || st === 'wadeOut') ? hero.frame % 4 : 0, kick = st === 'strut' ? 2 : 1;
    const lA = [0, kick, 0, -kick][step], lB = [0, -kick, 0, kick][step];
    let dl = 0, dr = 0; if (st === 'dance') { const mv = hero.move % 4; dl = mv === 1 ? -2 : mv === 3 ? 2 : 0; dr = -dl; }
    R(-3 + lA + dl, -9 + bob, 3, 9 - bob, pants); R(1 + lB + dr, -9 + bob, 3, 9 - bob, pants);
    R(-3 + lA + dl, -2, 3, 2, feet); R(1 + lB + dr, -2, 3, 2, feet);
  }
  const by = (sit ? -6 : 0) + bob;
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
  if (st === 'feed' || st === 'clean') { pr = 'out'; pl = Math.floor(S.t * 3) % 2 ? 'out' : 'down'; }
  if (st === 'surf') { pl = 'out'; pr = S.playing && (S.beatN % 2) ? 'up' : 'out'; }
  if (st === 'paddle' || st === 'paddleBack') { pl = hero.frame % 2 ? 'up' : 'out'; pr = hero.frame % 2 ? 'out' : 'up'; }
  if (st === 'wade') { pl = 'out'; pr = hero.kick > 0 ? 'up' : 'down'; }
  arm(-1, pl); arm(1, pr);
  if (st === 'eat' && hero.eat > 0.5) { R(-1, -24 + by, 2, 3, hero.eatItem ? dim('#5aa0d0') : dim('#a0522d')); }
  if (st === 'drink') { const beer = hero.drinkItem === 'beer', up = hero.eat > 0.5, cx = up ? -1 : 6, cy = up ? -24 + by : -12 + by;
    R(cx, cy, 3, 3, beer ? dim('#e8a02a') : dim('#f4efe6')); R(cx, cy, 3, 1, beer ? dim('#ffffff') : dim('#a0522d')); P(cx + 3, cy + 1, beer ? dim('#e8a02a') : dim('#f4efe6'));
    if (!beer && !up) { g.globalAlpha = 0.5; P(cx + 1, cy - 2 - Math.floor(S.t * 3) % 2, '#ffffff'); P(cx, cy - 4 + Math.floor(S.t * 3) % 2, '#ffffff'); g.globalAlpha = 1; } }
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

/* ---------------- a pirate ship on the horizon ---------------- */
S.ship = null; S.nextShip = 45 + rnd() * 60;
function shipThink(dt) {
  if (!S.ship && S.t > S.nextShip) { const dir = rnd() < 0.5 ? 1 : -1; S.ship = { x: dir > 0 ? -40 : W + 40, dir, v: 5 + rnd() * 3 }; }
  if (S.ship) { S.ship.x += S.ship.dir * S.ship.v * dt; if (S.ship.x < -60 || S.ship.x > W + 60) { S.ship = null; S.nextShip = S.t + 140 + rnd() * 160; } }
}
function drawShip(d) {
  const sh = S.ship; if (!sh) return; const night = 1 - d;
  const dim = (c) => mix('#0e1428', c, 0.3 + d * 0.7), bob = Math.round(Math.sin(S.t * 1.4) * 0.8);
  g.save(); g.translate(Math.round(sh.x), HORIZON + 3 + bob); g.scale(sh.dir, 1);
  const hull = dim('#4a2a14'), hullL = dim('#7a4a24'), sail = dim('#efe6d0'), mast = dim('#2a1a0a');
  R(-17, -5, 34, 5, hull); R(-15, 0, 30, 1, hull); R(-17, -5, 34, 1, hullL); R(10, -9, 8, 4, hull); R(-19, -7, 4, 2, hull); for (let i = -14; i < 14; i += 5) P(i, -3, dim('#ffd27a'));
  [[-8, 22], [2, 26], [11, 16]].forEach(([mx, h]) => { R(mx, -5 - h, 1, h, mast); const sw = Math.round(Math.sin(S.t * 1.1 + mx) * 0.6); R(mx - 5, -3 - h + 3, 11 + sw, 6, sail); R(mx - 4, -3 - h + 10, 9 + sw, 5, sail); });
  R(2, -35, 6, 4, dim('#111')); P(4, -34, dim('#fff')); P(5, -33, dim('#fff'));
  R(-21, -6, 5, 1, mast);
  if (night > 0.3) { R(15, -11, 2, 2, '#ffd27a'); g.globalAlpha = 0.25 * night; circle(16, -10, 4, '#ffd27a'); g.globalAlpha = 1; }
  g.restore();
  g.globalAlpha = 0.4; R(sh.x - 18, HORIZON + 4 + bob, 36, 1, mix('#20305a', '#d9f6ff', d)); g.globalAlpha = 1;
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
  const night = d < 0.3;
  if (waterThink(dt, d)) return;
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
  if (r0 < 0.07) { hero.state = 'toHut'; return; }
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
/* home life: outfit changes, feeding the cats, pipe and drinks */
const HOME = { toSeat: 1, toHut: 1, inside: 1, toFeed: 1, feed: 1, watchCats: 1, clean: 1, pipe: 1, drink: 1 };
S.bowls = null;
function homeThink(dt, d) {
  const st = hero.state; if (!HOME[st]) return false;
  const walk = (tx) => { hero.frameT = (hero.frameT || 0) + dt * 6; hero.frame = Math.floor(hero.frameT); return stepTo(tx, FLOOR, 22, dt); };
  if (st === 'toSeat') { const keep = hero.timer + dt; if (walk(hero.seatX)) { hero.state = hero.next; hero.dir = 1; hero.st = 0; } hero.timer = keep; return true; }
  if (st === 'toHut') { if (walk(HUT.door + 6)) { hero.state = 'inside'; hero.timer = 4 + rnd() * 4; } return true; }
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
  if (st === 'wadeOut') { walkAnim(5); if (stepTo(hero.x + 6, FLOOR, 10, dt)) { hero.state = 'idle'; hero.timer = 0.5; } return true; }
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
  const st = hero.state; if (st === 'inside') return;
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

/* ---------------- main loop ---------------- */
let last = performance.now(), clockT = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - last) / 1000); last = now; S.t += dt; S.clock += dt / 60;
  beatTick(dt);
  const d = dayness();
  drawSky(d); drawFloaters(dt, d); drawSea(d);
  S.rafts.filter((r) => r.state !== 'landed').forEach((r) => drawRaft(r, d));
  drawBeach(d);
  palm(4, 210, 84, d, 9); drawHut(d); palm(204, 178, 84, d, -6);
  drawLights(d); drawFire(d); drawFurniture(d);
  S.rafts.filter((r) => r.state === 'landed').forEach((r) => { drawRaft(r, d); });
  S.rafts.forEach((r) => potFire(r));
  smokeThink(dt, d);
  drawBowls(d); catsThink(dt); CATS.forEach((c) => { if (!c.inside) catSprite(c.x, FLOOR - 2 + (c.x % 7 > 3 ? 1 : 0), c.dir, c, false, false); });
  heroThink(dt, d); drawHero(d);
  raftsThink(dt); visitorsThink(dt); shipThink(dt); swirlThink(dt); drawSparks(dt, d);
  // night tint over the island
  if (d < 0.6) { g.globalAlpha = (0.6 - d) * 0.35; R(0, HORIZON, W, H - HORIZON, '#0a0f3a'); g.globalAlpha = 1; }
  clockT += dt; if (clockT > 1) { clockT = 0; const m = ((S.clock % 30) + 30) % 30, left = m < 15 ? 15 - m : 30 - m; $('#isl-clock').textContent = S.toast && S.t < S.toast.until ? S.toast.t : `${phaseName()} · ${m < 15 ? 'sunset' : 'sunrise'} in ${Math.max(0, Math.ceil(left))} min`; $('#isl-skip').textContent = m < 15 ? '\u{1F319} Skip to night' : '☀️ Skip to day'; }
}
requestAnimationFrame(frame);
cv.addEventListener('click', () => { if (S.rafts.length < 5) spawnRaft(); });

/* message in a bottle: printable postcard */
$('#isl-print-btn').addEventListener('click', () => {
  const big = document.createElement('canvas'); big.width = W * 4; big.height = H * 4; const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(cv, 0, 0, big.width, big.height);
  const songs = S.songs.length ? S.songs : [{ title: 'the sound of the waves' }];
  $('#isl-print').innerHTML = `<img alt="The island" src="${big.toDataURL('image/png')}"><h2>A message in a bottle from ${HERO}'s island</h2><p>Dear friend, the tide brought me ${songs.length} song${songs.length === 1 ? '' : 's'} today. The cats approved. Here is what washed ashore:</p><ol>${songs.map((s) => `<li>${esc(s.title)}</li>`).join('')}</ol><p class="foot">Island Sessions · likethefish.ca · ${new Date().toLocaleDateString()}</p>`;
  window.print();
});
window.islDebug = { S, hero, CATS, spawnRaft, songStart, setPlaying };
})();
