/* Shore Club Sessions: a fan-made tribute to the Shore Club dance hall in Hubbards, Nova Scotia (dancing since 1946).
   Cinematic flat-polygon scenes drawn entirely in code: outside the hall, the deck over Hubbards Cove, the dance hall,
   an outdoor shore stage, and Hubbards Beach by day or night. Five house acts, 240 regulars, and a black-marker drawing mode
   where only the lights keep their colour. Not affiliated with the Shore Club. */
(function () {
'use strict';
const root = document.getElementById('shr-root'); if (!root || root.dataset.ready) return; root.dataset.ready = '1';
const SRC = (document.currentScript && document.currentScript.src) || '';
const GM_SRC = SRC.replace(/shore\/shore\.js.*$/, 'rko/gm.js');
if (/gm\.js/.test(GM_SRC) && !window.LTFGM) { const gs = document.createElement('script'); gs.src = GM_SRC; document.head.appendChild(gs); }
if (/gm\.js/.test(GM_SRC) && !window.LTFSP) { const ss = document.createElement('script'); ss.src = GM_SRC.replace('gm.js', 'ltf-spotify.js'); document.head.appendChild(ss); }
if (!document.getElementById('shr-fonts')) { const l = document.createElement('link'); l.id = 'shr-fonts'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Monoton&family=Pacifico&display=swap'; document.head.appendChild(l); }
const PLAYLISTS = (window.PQ_PLAYLISTS && window.PQ_PLAYLISTS.length) ? window.PQ_PLAYLISTS : [['Singing', '0Bxvmnd4tPBXrr8Adj47CL']];
const TOUCH = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || 'ontouchstart' in window;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rnd = Math.random, pick = (a) => a[Math.floor(rnd() * a.length)];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function RNG(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------------- acts ---------------- */
const ACTS = [
  { k: 'country', name: 'The String Light Wranglers', genre: 'Country', emo: '\u{1F920}', cols: ['#ffb347', '#ff5e3a', '#ffe08a'], band: ['banjo', 'mic-guitar', 'drums', 'fiddle', 'bass'], crowd: { line: 6, couple: 3, clap: 2, stand: 1 }, tag: 'boots on the hardwood, lights strung like a hay barn' },
  { k: 'rock', name: 'Neon Riptide', genre: 'Rock', emo: '\u{1F3B8}', cols: ['#ff2d55', '#ffffff', '#7a5cff'], band: ['guitar', 'mic', 'drums', 'bass'], crowd: { rock: 6, cheer: 3, stand: 1 }, tag: 'loud as a nor\u2019easter, bright as a channel marker' },
  { k: 'east', name: 'The Lantern Bay Kitchen Party', genre: 'East Coast', emo: '\u{1F3BB}', cols: ['#ffd27a', '#3ddc84', '#ff9a3c'], band: ['fiddle', 'accordion', 'drums', 'guitar', 'keys'], crowd: { step: 5, couple: 4, clap: 3, stand: 1 }, tag: 'fiddles, step dancing and lanterns swinging' },
  { k: 'dj', name: 'DJ Lighthouse Pulse', genre: 'DJ', emo: '\u{1F3A7}', cols: ['#00e5ff', '#ff2bd6', '#b6ff3b'], band: ['dj'], crowd: { rave: 7, sway: 2, cheer: 2 }, tag: 'a lighthouse beam that drops on the beat' },
  { k: 'funk', name: 'The Neon Anchors Soul Revue', genre: 'Funk & Soul', emo: '\u{1F3B7}', cols: ['#b44bff', '#ff8a00', '#ff3d7f'], band: ['sax', 'keys', 'mic', 'drums', 'bass', 'trumpet'], crowd: { funk: 6, couple: 3, sway: 2 }, tag: 'horns, a mirror ball and a dance floor full of anchors' }
];
const SCENES = {
  outside: { t: 'Outside the Hall', s: 'Shore Club Road, Hubbards \u00b7 dancing since 1946' },
  deck: { t: 'The Deck', s: 'looking out over Hubbards Cove' },
  inside: { t: 'The Dance Hall', s: 'hardwood floor, lobster traps and a flock of gulls' },
  shore: { t: 'Outdoor Shore', s: 'an open-air stage on the cove' },
  beachDay: { t: 'Hubbards Beach', s: 'afternoon set \u00b7 the waves roll in' },
  beachNight: { t: 'Hubbards Beach', s: 'string lights, candles and a beach party' }
};

/* ---------------- page + UI ---------------- */
const css = `
#shr{-webkit-text-size-adjust:100%;text-size-adjust:100%;--sb:#0c1630;--sp:#121f42;--sg:#ffcf6e;--sn:#ff4f8b;--si:#eef3ff;font-family:Georgia,'Times New Roman',serif;color:var(--si);max-width:1060px;margin:0 auto}
#shr *{box-sizing:border-box}
#shr .shr-qp{display:flex;gap:8px;align-items:center;background:var(--sb);border:1px solid #ffffff22;border-radius:14px;padding:9px 10px;margin:0 0 10px}
#shr .shr-qp .lbl{font-size:14px;color:var(--sg);white-space:nowrap}
#shr select,#shr input[type=text]{font:15px Georgia,serif;color:var(--si);background:#08102a;border:1px solid #ffffff3a;border-radius:999px;padding:8px 12px;min-width:0}
#shr .shr-qp select{flex:1}
#shr button{font:600 14px Georgia,serif;border:0;border-radius:999px;padding:9px 16px;cursor:pointer;background:#ff4f8b;color:#fff;white-space:nowrap}
#shr button.alt{background:#1d2c5c;color:var(--si);border:1px solid #ffffff2a}
#shr button[aria-pressed=true]{background:var(--sg);color:#1b130d;border-color:var(--sg)}
#shr .shr-stage{position:relative;background:#000;border-radius:14px 14px 0 0;overflow:hidden;line-height:0}
#shr canvas{display:block;width:100%;height:auto;cursor:pointer}
#shr .shr-fs{position:absolute;right:10px;top:10px;line-height:1;font-size:13px;padding:7px 11px;background:#000a;color:#fff;border:1px solid #ffffff44}
#shr .shr-hud{display:flex;gap:10px;align-items:center;justify-content:space-between;background:var(--sb);padding:9px 14px;font-size:14px;border-radius:0 0 14px 14px}
#shr .shr-now{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--sg)}
#shr .shr-act{opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:45%}
#shr .shr-box{background:var(--sp);border:1px solid #ffffff18;border-radius:14px;padding:12px;margin-top:10px}
#shr .shr-h{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--sg);margin:2px 2px 8px}
#shr .shr-tabs,#shr .shr-scn,#shr .shr-acts{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
#shr .shr-scn button.special{background:linear-gradient(90deg,#ff4f8b,#ffb347);color:#1b0f12;border:0;box-shadow:0 0 14px #ff4f8b88}
#shr .shr-scn button.beach{background:linear-gradient(90deg,#3cc8e0,#ffe08a);color:#0f1a22;border:0;box-shadow:0 0 14px #3cc8e088}
#shr .shr-scn button.special[aria-pressed=true],#shr .shr-scn button.beach[aria-pressed=true]{outline:3px solid #fff;outline-offset:1px}
#shr .shr-acts button small{font-weight:400;opacity:.8;margin-left:4px}
#shr .shr-pane{display:none}#shr .shr-pane.on{display:block}
#shr .shr-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0}
#shr .shr-row > select,#shr .shr-row > input[type=text]{flex:1 1 200px}
#shr .shr-note{font-size:13px;line-height:1.5;opacity:.85;margin:8px 2px 0}
#shr .shr-note a{color:var(--sg)}
#shr .shr-embed{margin-top:8px;border-radius:12px;overflow:hidden;line-height:0}
#shr audio{width:100%;margin-top:6px}
#shr .shr-songs{font-size:13px;line-height:1.6;margin-top:8px;opacity:.9}
#shr label.chk{font-size:14px;display:inline-flex;gap:6px;align-items:center;cursor:pointer}
#shr.shr-full{position:fixed;top:0;left:0;width:100vw;height:100vh;height:100dvh;touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none;z-index:2147483000;max-width:none;margin:0;background:#000;display:flex;flex-direction:column}
#shr.shr-full .shr-qp,#shr.shr-full .shr-box{display:none}
#shr.shr-full .shr-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:0}
#shr.shr-full canvas{max-width:100vw;max-height:100dvh}
#shr.shr-full .shr-hud{position:absolute;left:0;right:0;bottom:0;border-radius:0;background:#000000a0;padding:6px 12px;font-size:12px;z-index:2}
#shr .shr-ov{display:none;position:absolute;left:10px;top:10px;right:120px;gap:6px;align-items:center;flex-wrap:wrap;line-height:1;z-index:2}
#shr.shr-full .shr-ov{display:flex}
#shr .shr-ov select,#shr .shr-ov button{font:600 13px Georgia,serif;padding:7px 10px;background:#000a;color:#fff;border:1px solid #ffffff44;border-radius:999px;max-width:46vw}
@media (max-height:500px){#shr.shr-full .shr-hud{padding:4px 10px;font-size:11px}#shr .shr-ov select,#shr .shr-ov button,#shr.shr-full .shr-fs{font-size:11px;padding:6px 8px}}
html.shr-noscroll,html.shr-noscroll body{overflow:hidden!important}
#shr.shr-full .ltf-cast-btn{display:none!important}
@media (max-width:600px){#shr .shr-qp .lbl{display:none}#shr .shr-qp{gap:6px;padding:7px}#shr button{padding:9px 12px}#shr .shr-hud{font-size:13px}#shr .shr-act{display:none}}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
const QP = [['spotify', '\u{1F3B2} Random Like The Fish playlist (Spotify)'], ['c64', '\u{1F579} C64 remixes'], ['relaxing', '\u{1F30A} Relaxing \u00b7 Kevin MacLeod'], ['encapsulating', '\u{1F52E} Encapsulating \u00b7 Kevin MacLeod'], ['insanity', '\u26a1 Insanity \u00b7 Kevin MacLeod'], ['mobygratis-glow', '\u{1F3A7} MOBYGRATIS: Glow'], ['mobygratis-drive', '\u{1F3A7} MOBYGRATIS: Drive']];
const SCN_BTNS = [['outside', '\u{1F3DB} Outside the hall'], ['deck', '\u2693 The deck'], ['inside', '\u{1F483} Inside'], ['shore', '\u2728 Outdoor Shore', 'special'], ['beach', '\u{1F3D6} Take me to the beach', 'beach']];
const SCN_OPTS = [['outside', '\u{1F3DB} Outside'], ['deck', '\u2693 Deck'], ['inside', '\u{1F483} Inside'], ['shore', '\u2728 Outdoor Shore'], ['beachDay', '\u2600 Beach day'], ['beachNight', '\u{1F319} Beach night']];
root.innerHTML = `
<div id="shr" data-ltf-exp>
  <div class="shr-qp"><span class="lbl">Quick play</span><select id="shr-qsel" aria-label="Choose what to play">${QP.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select><button id="shr-qgo">\u25b6 Play</button><button id="shr-qstop" class="alt" hidden>\u23f8</button></div>
  <div class="shr-stage"><canvas id="shr-cv" width="960" height="540" aria-label="The Shore Club dance hall in Hubbards, Nova Scotia, drawn in code, with a band and a crowd dancing to your music"></canvas>
    <div class="shr-ov"><select id="shr-fscn" aria-label="Scene">${SCN_OPTS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select><select id="shr-fact" aria-label="Act">${ACTS.map((a, i) => `<option value="${i}">${a.emo} ${esc(a.name)}</option>`).join('')}</select><button id="shr-fmark" aria-label="Marker drawing">\u{1F58A}</button><button id="shr-fplay" aria-label="Play or pause">\u25b6</button></div>
    <button class="shr-fs" id="shr-fs">\u26f6 Full screen</button></div>
  <div class="shr-hud"><span class="shr-now" id="shr-now">Pick some music and the band takes the stage\u2026</span><span class="shr-act" id="shr-actname"></span></div>
  <div class="shr-box">
    <div class="shr-h">Where are you listening?</div>
    <div class="shr-scn">${SCN_BTNS.map(([v, t, c]) => `<button data-scn="${v}" class="${c || 'alt'}" aria-pressed="false">${t}</button>`).join('')}<button id="shr-dn" class="alt" hidden>\u{1F319} Make it night</button></div>
    <div class="shr-h">Tonight\u2019s act</div>
    <div class="shr-acts">${ACTS.map((a, i) => `<button data-act="${i}" class="alt" aria-pressed="false">${a.emo} ${esc(a.name)}<small>${esc(a.genre)}</small></button>`).join('')}</div>
    <div class="shr-row"><button id="shr-mark" class="alt" aria-pressed="false">\u{1F58A} Marker drawing</button><label class="chk"><input type="checkbox" id="shr-rot"> New act every song</label></div>
    <p class="shr-note" id="shr-blurb"></p>
  </div>
  <div class="shr-box">
    <div class="shr-tabs" role="tablist">
      <button data-tab="sp" aria-pressed="true" class="alt">Spotify player</button><button data-tab="gm" aria-pressed="false" class="alt">\u{1F3AE} Game music</button><button data-tab="acct" aria-pressed="false" class="alt">\u{1F3A7} My Spotify app</button><button data-tab="mic" aria-pressed="false" class="alt">\u{1F3A4} Dance to the room</button><button data-tab="am" aria-pressed="false" class="alt">\u{1F34E} Apple Music</button><button data-tab="type" aria-pressed="false" class="alt">Type my songs</button>
    </div>
    <div class="shr-pane on" data-pane="sp">
      <div class="shr-row"><select id="shr-pl" aria-label="Pick a Like The Fish playlist"><option value="">Pick a Like The Fish playlist\u2026</option>${PLAYLISTS.map(([n, id]) => `<option value="${id}">${String(n).replace(/[<>&"]/g, '')}</option>`).join('')}</select><button id="shr-rand" class="alt">\u{1F3B2} Random</button></div>
      <div class="shr-row"><input type="text" id="shr-url" placeholder="\u2026or paste any Spotify link"><button id="shr-load" class="alt">Load player</button></div>
      <div class="shr-embed" id="shr-embed"></div>
      <p class="shr-note">Press play in the Spotify player and the band starts. Only hearing 30-second clips? <a href="https://accounts.spotify.com/login" target="_blank" rel="noopener">Log in to Spotify</a> in this browser for full songs.</p>
    </div>
    <div class="shr-pane" data-pane="gm">
      <div class="shr-row"><select id="shr-gmcoll" aria-label="Game music collection"></select><select id="shr-gmsub" aria-label="C64 remixes"></select></div>
      <audio id="shr-gmau" controls preload="none"></audio>
      <div class="shr-row"><button id="shr-gmnext" class="alt">\u23ed Next song</button></div>
      <p class="shr-note" id="shr-gmcredit"></p>
      <p class="shr-note">C64 remixes stream from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>. Relaxing, Encapsulating and Insanity are music by Kevin MacLeod (<a href="https://incompetech.com/" target="_blank" rel="noopener">incompetech.com</a>), licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">Creative Commons: By Attribution 4.0</a>. MOBYGRATIS moods are free music from <a href="https://mobygratis.com/" target="_blank" rel="noopener">mobygratis.com</a>. Thank you, MOBYGRATIS!</p>
    </div>
    <div class="shr-pane" data-pane="acct">
      <div class="shr-row" id="shr-acct-btn"></div>
      <p class="shr-note" id="shr-acct-status">Connect once and every Like the Fish experience can follow your Spotify.</p>
      <p class="shr-note">Play anything in the Spotify app (phone, computer, speaker) and the hall follows along, song by song.</p>
    </div>
    <div class="shr-pane" data-pane="mic">
      <div class="shr-row"><button id="shr-mic">\u{1F3A4} Start listening</button></div>
      <p class="shr-note">Play music out loud anywhere (a speaker, the radio, a real band in the room). The crowd dances to what the microphone hears.</p>
    </div>
    <div class="shr-pane" data-pane="am">
      <div class="shr-row"><input type="text" id="shr-amurl" placeholder="Paste an Apple Music playlist, album or song link"><button id="shr-amload" class="alt">Load player</button></div>
      <div class="shr-embed" id="shr-amembed"></div>
      <div class="shr-row"><button id="shr-amnext" class="alt">\u23ed Next song</button><button id="shr-ampause" class="alt">\u23f8 Pause</button></div>
      <p class="shr-note">Apple doesn\u2019t tell web pages when songs change, so tap \u23ed when a new one starts (a new song is also counted every 3\u00bd minutes).</p>
    </div>
    <div class="shr-pane" data-pane="type">
      <div class="shr-row"><input type="text" id="shr-typed" placeholder="What's playing? (song \u2013 artist)"><button id="shr-tstart">\u25b6 Start song</button><button id="shr-tend" class="alt">\u25a0 Song over</button></div>
      <p class="shr-note">For records, the radio, the car stereo\u2026</p>
    </div>
    <div class="shr-songs" id="shr-songs"></div>
    <p class="shr-note">A fan-made tribute to the <a href="https://www.shoreclub.ca/" target="_blank" rel="noopener">Shore Club</a> in Hubbards, Nova Scotia (\u201cNova Scotia\u2019s last great dance hall\u201d) and <a href="https://www.hubbardsbeach.com/" target="_blank" rel="noopener">Hubbards Beach</a>. Not affiliated with either. Every scene, light and dancer is drawn by code; the acts and the 240 regulars are made up. Tap a dancer to meet them.</p>
  </div>
</div>`;
const $ = (s) => root.querySelector(s);
const cv = $('#shr-cv'), g = cv.getContext('2d');
const W = 960, H = 540;

/* ---------------- state ---------------- */
const S = { playing: false, bpm: 112, beat: 0, beatN: -1, energy: 0, t: 0, songs: [], cur: -1, scene: 'inside', act: 0, mark: false, title: 0, flash: 0 };
try { const sv = JSON.parse(localStorage.getItem('shr.state') || '{}'); if (SCENES[sv.scene]) S.scene = sv.scene; if (ACTS[sv.act]) S.act = sv.act; S.mark = !!sv.mark; } catch (e) {}
function save() { try { localStorage.setItem('shr.state', JSON.stringify({ scene: S.scene, act: S.act, mark: S.mark })); } catch (e) {} }

/* ---------------- colour helpers ---------------- */
const HX = {};
function hx(c) { if (HX[c]) return HX[c]; let r = 0, gg = 0, b = 0; if (c[0] === '#') { const n = c.length === 4 ? c.slice(1).split('').map((x) => x + x).join('') : c.slice(1, 7); r = parseInt(n.slice(0, 2), 16); gg = parseInt(n.slice(2, 4), 16); b = parseInt(n.slice(4, 6), 16); } else { const m = c.match(/[\d.]+/g); r = +m[0]; gg = +m[1]; b = +m[2]; } return (HX[c] = [r, gg, b]); }
function mix(a, b, k) { const A = hx(a), B = hx(b); return '#' + [0, 1, 2].map((i) => Math.round(A[i] + (B[i] - A[i]) * k).toString(16).padStart(2, '0')).join(''); }
function rgba(c, a) { const A = hx(c); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; }
const PAPER = '#f7f3e8', INK = '#16130f';
let MARK = false, BOIL = 0;

/* ---------------- drawing primitives: flat polygons, or black marker on paper ---------------- */
function jit(x, y) { const h = Math.sin(x * 12.9898 + y * 78.233 + BOIL * 37.719) * 43758.5453; return (h - Math.floor(h) - 0.5) * 1.7; }
function path(pts, close) { g.beginPath(); for (let i = 0; i < pts.length; i += 2) { let x = pts[i], y = pts[i + 1]; if (MARK) { const jx = jit(x, y), jy = jit(y, x); x += jx; y += jy; } if (i) g.lineTo(x, y); else g.moveTo(x, y); } if (close) g.closePath(); }
function hatchClip(step, ang) { g.save(); g.clip(); g.strokeStyle = INK; g.lineWidth = 1; g.globalAlpha = 0.42; g.beginPath(); const a = ang == null ? 0.8 : ang, c = Math.cos(a), s = Math.sin(a); for (let d = -W; d < W * 2; d += step) { g.moveTo(d, 0); g.lineTo(d + c / s * H * 0 + H / Math.tan(a), H); } g.stroke(); g.restore(); g.globalAlpha = 1; }
function poly(pts, col, o) {
  o = o || {};
  path(pts, true);
  if (MARK) {
    if (o.skip) return;
    g.fillStyle = o.ink ? INK : PAPER; g.fill();
    if (o.h) { path(pts, true); hatchClip(o.h, o.ha); path(pts, true); }
    if (!o.noline) { g.strokeStyle = INK; g.lineWidth = o.lw || 2; g.lineJoin = 'round'; g.stroke(); }
  } else { g.fillStyle = col; g.fill(); }
}
function rect(x, y, w, h, col, o) { poly([x, y, x + w, y, x + w, y + h, x, y + h], col, o); }
function ell(x, y, rx, ry, col, o, rot) {
  o = o || {}; g.beginPath(); const jx = MARK ? jit(x, y) * 0.6 : 0, jy = MARK ? jit(y, x) * 0.6 : 0;
  g.ellipse(x + jx, y + jy, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, Math.PI * 2);
  if (MARK) { if (o.skip) return; g.fillStyle = o.ink ? INK : PAPER; g.fill(); if (o.h) { hatchClip(o.h); g.beginPath(); g.ellipse(x + jx, y + jy, rx, ry, rot || 0, 0, Math.PI * 2); } if (!o.noline) { g.strokeStyle = INK; g.lineWidth = o.lw || 1.8; g.stroke(); } }
  else { g.fillStyle = col; g.fill(); }
}
function ln(x1, y1, x2, y2, col, w, o) {
  o = o || {}; g.beginPath(); if (MARK) { x1 += jit(x1, y1); y1 += jit(y1, x1); x2 += jit(x2, y2); y2 += jit(y2, x2); }
  g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineCap = 'round';
  if (MARK) { if (o.skip) return; g.strokeStyle = INK; g.lineWidth = o.mw || Math.min(w, 2.6); } else { g.strokeStyle = col; g.lineWidth = w; }
  g.stroke();
}
function limb(x1, y1, x2, y2, w, col, o) {
  o = o || {}; g.lineCap = 'round';
  if (MARK) { const a = jit(x1, y1) * 0.5, b = jit(x2, y2) * 0.5; g.beginPath(); g.moveTo(x1 + a, y1 - a); g.lineTo(x2 + b, y2 - b); if (o.ink) { g.strokeStyle = INK; g.lineWidth = w; g.stroke(); return; } g.strokeStyle = INK; g.lineWidth = w + 2.6; g.stroke(); g.strokeStyle = PAPER; g.lineWidth = Math.max(0.5, w - 0.4); g.stroke(); return; }
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokeStyle = col; g.lineWidth = w; g.stroke();
}
/* lights keep their colour in both modes */
const GS = {};
function gsprite(col) { if (GS[col]) return GS[col]; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, rgba(col, 1)); gr.addColorStop(0.22, rgba(col, 0.45)); gr.addColorStop(0.6, rgba(col, 0.1)); gr.addColorStop(1, rgba(col, 0)); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return (GS[col] = c); }
function glow(x, y, r, col, a) { if (a <= 0.01 || r < 0.5) return; g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.globalAlpha = Math.min(1, a * (MARK ? 0.75 : 1)); g.drawImage(gsprite(col), x - r, y - r, 2 * r, 2 * r); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
function bulb(x, y, r, col, a) {
  glow(x, y, r * 7, col, 0.55 * a);
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
  if (MARK) { g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 1; g.stroke(); }
  else { g.fillStyle = mix(col, '#ffffff', 0.25 + 0.5 * clamp(a, 0, 1)); g.fill(); }
}
function beam(x, y, ang, len, wid, col, a) {
  if (a <= 0.01) return; const ex = x + Math.sin(ang) * len, ey = y + Math.cos(ang) * len, nx = Math.cos(ang) * wid, ny = -Math.sin(ang) * wid;
  const gr = g.createLinearGradient(x, y, ex, ey); gr.addColorStop(0, rgba(col, (MARK ? 0.4 : 0.5) * a)); gr.addColorStop(1, rgba(col, 0));
  g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.fillStyle = gr; g.beginPath(); g.moveTo(x - nx * 0.08, y - ny * 0.08); g.lineTo(x + nx * 0.08, y + ny * 0.08); g.lineTo(ex + nx, ey + ny); g.lineTo(ex - nx, ey - ny); g.closePath(); g.fill(); g.globalCompositeOperation = 'source-over';
}
function neonPass(stroke, col, a, w) {
  g.lineCap = g.lineJoin = 'round';
  if (!MARK) { g.globalCompositeOperation = 'lighter'; g.strokeStyle = col; g.globalAlpha = 0.16 * a; g.lineWidth = w * 5; stroke(); g.globalAlpha = 0.35 * a; g.lineWidth = w * 2.4; stroke(); g.globalAlpha = Math.min(1, 0.5 + 0.5 * a); g.lineWidth = w; stroke(); g.strokeStyle = '#ffffff'; g.globalAlpha = 0.8 * Math.min(1, a); g.lineWidth = w * 0.38; stroke(); }
  else { g.globalCompositeOperation = 'multiply'; g.strokeStyle = col; g.globalAlpha = 0.25 * a; g.lineWidth = w * 5; stroke(); g.globalAlpha = 0.45 * a; g.lineWidth = w * 2.4; stroke(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.lineWidth = w * 1.5; stroke(); }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function neonText(txt, x, y, size, col, a, font, align, maxW) {
  g.font = `${size}px ${font || "'Pacifico','Brush Script MT','Segoe Script',cursive"}`; g.textAlign = align || 'center'; g.textBaseline = 'middle';
  if (maxW) { const m = g.measureText(txt).width; if (m > maxW) { size *= maxW / m; g.font = `${size}px ${font || "'Pacifico','Brush Script MT',cursive"}`; } }
  neonPass(() => g.strokeText(txt, x, y), col, a, Math.max(1.2, size * 0.06));
}
function neonPath(pts, col, a, w, close) { neonPass(() => { g.beginPath(); for (let i = 0; i < pts.length; i += 2) i ? g.lineTo(pts[i], pts[i + 1]) : g.moveTo(pts[i], pts[i + 1]); if (close) g.closePath(); g.stroke(); }, col, a, w); }
function txt(s, x, y, size, col, o) { o = o || {}; g.font = `${o.bold ? '700 ' : ''}${size}px ${o.font || 'Georgia,serif'}`; g.textAlign = o.align || 'center'; g.textBaseline = 'middle'; g.fillStyle = MARK ? (o.light ? col : INK) : col; g.fillText(s, x, y); }
function skyGrad(stops, h) { if (MARK) return; const gr = g.createLinearGradient(0, 0, 0, h); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, h); }
function ground(y0, y1, c0, c1) { if (MARK) { ln(0, y0, W, y0, INK, 2); return; } const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }

/* paper for marker mode */
const paper = document.createElement('canvas'); paper.width = W; paper.height = H;
(function () { const x = paper.getContext('2d'); x.fillStyle = PAPER; x.fillRect(0, 0, W, H); const r = RNG(7); for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(90,70,40,${0.03 + r() * 0.05})`; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1); } for (let i = 0; i < 90; i++) { x.strokeStyle = 'rgba(120,100,70,.06)'; x.beginPath(); const a = r() * W, b = r() * H; x.moveTo(a, b); x.quadraticCurveTo(a + 20, b + r() * 10, a + 30 + r() * 30, b + r() * 6); x.stroke(); } const v = x.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(80,60,30,.12)'); x.fillStyle = v; x.fillRect(0, 0, W, H); })();
/* gingham */
function gingham(base) { const c = document.createElement('canvas'); c.width = c.height = 12; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 12, 12); x.fillStyle = rgba(base, 0.55); x.fillRect(0, 0, 6, 12); x.fillRect(0, 0, 12, 6); x.fillStyle = rgba(base, 0.95); x.fillRect(0, 0, 6, 6); return g.createPattern(c, 'repeat'); }
const GING = { day: gingham('#c8102e'), dim: null };
(function () { const c = document.createElement('canvas'); c.width = c.height = 12; const x = c.getContext('2d'); x.fillStyle = '#5c3a30'; x.fillRect(0, 0, 12, 12); x.fillStyle = '#7a1420'; x.fillRect(0, 0, 6, 12); x.fillRect(0, 0, 12, 6); x.fillStyle = '#4a0810'; x.fillRect(0, 0, 6, 6); GING.dim = g.createPattern(c, 'repeat'); const m = document.createElement('canvas'); m.width = m.height = 12; const y = m.getContext('2d'); y.fillStyle = PAPER; y.fillRect(0, 0, 12, 12); y.fillStyle = 'rgba(22,19,15,.35)'; y.fillRect(0, 0, 6, 12); y.fillRect(0, 0, 12, 6); y.fillStyle = 'rgba(22,19,15,.85)'; y.fillRect(0, 0, 6, 6); GING.mark = g.createPattern(m, 'repeat'); })();
function gingPoly(pts, dim) { path(pts, true); g.fillStyle = MARK ? GING.mark : dim ? GING.dim : GING.day; g.fill(); if (MARK) { g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); } }

/* ---------------- 240 regulars ---------------- */
const SKIN = ['#f3d2b8', '#e8b896', '#d7a27a', '#b97d55', '#8a5a3a', '#5e3b26'];
const HAIRC = ['#1b1410', '#3b2416', '#6b4423', '#a8743a', '#d9b26a', '#b9b5ae', '#ece6dc', '#8a2b1a'];
const CLOTH = ['#c8102e', '#1d4e89', '#f2c14e', '#2a9d8f', '#e76f51', '#6a4c93', '#f4f1de', '#2b2f3a', '#3d5a80', '#ef476f', '#06d6a0', '#8d6e63', '#ffb4a2', '#264653', '#ffd166', '#118ab2'];
const HAIRS = ['short', 'bob', 'long', 'pony', 'bun', 'curly', 'bald', 'mohawk', 'buzz', 'long'];
const TOPS = ['tee', 'long', 'tank', 'plaid', 'hoodie', 'jacket', 'stripe', 'tee'];
const BOTS = ['pants', 'jeans', 'shorts', 'skirt', 'dress', 'jeans'];
const HATS = ['none', 'none', 'none', 'none', 'cap', 'cowboy', 'captain', 'toque', 'souwester', 'bandana', 'fedora'];
const ACCS = ['none', 'none', 'none', 'glasses', 'shades', 'beard'];
const FIRST = ['Doreen', 'Gerald', 'Marg', 'Wade', 'Shelley', 'Darrell', 'Krista', 'Bev', 'Murray', 'Tanya', 'Cyril', 'Joanie', 'Lloyd', 'Heather', 'Stacey', 'Ross', 'Paulette', 'Trevor', 'Bonnie', 'Clarence', 'Amira', 'Kenji', 'Priya', 'Malik', 'Sofia', 'Owen', 'Chloe', 'Mateo', 'Nadia', 'Liam', 'Aisha', 'Hugo', 'Jess', 'Rory', 'Faith', 'Duncan', 'Moira', 'Angus', 'Leah', 'Callum', 'Mi-rae', 'Tomas', 'Rita', 'Benoit', 'Gwen', 'Dev'];
const PLACES = ['Hubbards', 'Mahone Bay', 'Chester', 'Fox Point', 'Queensland', 'Black Point', 'Boutiliers Point', 'Head of St. Margarets Bay', 'Peggys Cove', 'Lunenburg', 'Tantallon', 'Bayswater', 'Aspotogan', 'Halifax', 'Dartmouth', 'Windsor', 'Bridgewater', 'East River', 'Mill Cove', 'Ingramport'];
const QUIRK = ['regular since 19', 'first dance here in 19', 'met their sweetheart here in 19', 'hasn\u2019t missed a Saturday since 19', 'still has the ticket stub from 19', 'came for the lobster supper in 19'];
const ROSTER = [];
(function () {
  const r = RNG(1946), seen = new Set();
  while (ROSTER.length < 240) {
    const p = { skin: pickR(r, SKIN), hairC: pickR(r, HAIRC), hair: pickR(r, HAIRS), top: pickR(r, TOPS), topC: pickR(r, CLOTH), bot: pickR(r, BOTS), botC: pickR(r, ['#2b3a67', '#1f2a44', '#3a3f4b', '#5a4632', '#c2b280', '#2e5e4e', '#6d1f2f', '#111318', ...CLOTH.slice(0, 6)]), hat: pickR(r, HATS), hatC: pickR(r, ['#7a4a26', '#1d1d1d', '#f4f1de', '#c8102e', '#1d4e89', '#ffcc00', '#2a9d8f']), acc: pickR(r, ACCS), shoe: pickR(r, ['#1a1410', '#3b2416', '#f4f1de', '#7a1d1d']), h: 0.9 + r() * 0.2, w: 0.85 + r() * 0.35 };
    if (p.hat === 'souwester') p.hatC = '#ffcc00';
    if (p.bot === 'jeans') p.botC = pickR(r, ['#2b4a7a', '#3a5f94', '#1f3355']);
    const key = [p.skin, p.hairC, p.hair, p.top, p.topC, p.bot, p.hat, p.acc].join('|'); if (seen.has(key)) continue; seen.add(key);
    p.name = pickR(r, FIRST) + ' from ' + pickR(r, PLACES); p.quirk = pickR(r, QUIRK) + (1946 + Math.floor(r() * 79));
    ROSTER.push(p);
  }
})();
function pickR(r, a) { return a[Math.floor(r() * a.length)]; }

/* ---------------- people ---------------- */
function shadeSet(p, amb, light) {
  const d = (c) => mix(c, amb.col, amb.k), l = (c) => mix(d(c), light, 0.38);
  return { skin: d(p.skin), skinL: l(p.skin), hair: d(p.hairC), top: d(p.topC), topL: l(p.topC), bot: d(p.botC), hat: d(p.hatC), hatL: l(p.hatC), shoe: d(p.shoe) };
}
function pose(sl) {
  const stl = sl.style, o = sl.off, on = S.playing, band = stl[0] === 'b';
  const E = on ? clamp(0.35 + S.energy * 0.8, 0, 1.3) : 0;
  const b = S.beat + (band ? 0 : o * 0.12), ph = ((b % 1) + 1) % 1, n = Math.floor(b), pu = Math.exp(-ph * 6) * E, sn = Math.sin(b * Math.PI), id = Math.sin(S.t * 1.3 + o * 9);
  const P = { dx: 0, sway: 0, bounce: 0, lean: 0, L: [-0.18, -0.08], R: [0.18, 0.08], LL: [-0.05, 0.02], RL: [0.05, -0.02], hy: 0, face: sl.face, sit: false, cross: false, E, pu, b, ph, n };
  if (stl === 'sit' || stl === 'cross') { if (stl === 'cross') P.cross = true; else P.sit = true; P.sway = id * 0.8 + sn * 1.5 * E; P.hy = pu * 1.5; if (sl.drink) P.R = [0.3, 2.3]; if (on && sl.off > 0.6) { P.L = [-0.45, 2.1 + pu * 0.4]; P.R = [0.45, -2.1 - pu * 0.4]; } return P; }
  if (!on && !band) { P.sway = id * 1.2; if (sl.drink) P.R = [0.3, 2.2]; return P; }
  switch (stl) {
    case 'stand': P.sway = id * 1.2 + sn * 1.6 * E; P.bounce = pu * 0.9; if (sl.drink) P.R = [0.3, 2.2 + pu * 0.3]; break;
    case 'sway': P.sway = sn * 4 * E; P.lean = sn * 0.06; P.L = [-0.25 - sn * 0.15, -0.35]; P.R = [0.25 - sn * 0.15, 0.35]; P.bounce = pu * 1.5; break;
    case 'clap': P.L = [-0.5 + 0.18 * pu, 2.05 + 0.45 * pu]; P.R = [0.5 - 0.18 * pu, -2.05 - 0.45 * pu]; P.bounce = pu * 1.6; P.sway = sn * 1.5; break;
    case 'line': { const m = ((n % 8) + 8) % 8, pos = m < 4 ? m + ph : 8 - (m + ph); P.dx = (pos - 2) * 6 * E; const st = Math.sin(b * Math.PI * 2); P.LL = [-0.06 + Math.max(0, st) * 0.35 * E, 0.05]; P.RL = [0.06 + Math.min(0, st) * 0.35 * E, -0.05]; if (m === 3 || m === 7) P.RL = [0.5 * (1 - ph), -0.4 * (1 - ph)]; P.L = [-0.45, 0.75]; P.R = [0.45, -0.75]; P.bounce = pu * 2; break; }
    case 'step': { const k = Math.floor(b * 2) % 2, f = Math.abs(Math.sin(b * Math.PI * 2)); P.LL = k ? [-0.5 * E * f, 0.25 * f] : [-0.05, 0]; P.RL = k ? [0.05, 0] : [0.5 * E * f, -0.25 * f]; P.L = [-0.07, -0.04]; P.R = [0.07, 0.04]; P.bounce = f * 3.5 * E; break; }
    case 'rock': if (sl.off > 0.5) { P.R = [2.75 - 0.5 * pu, 3.05 - 0.4 * pu]; P.L = [-0.3, -0.2]; } else { P.L = [-0.5, 1.3]; P.R = [0.3, -0.8 + Math.sin(b * Math.PI * 4) * 0.3]; } P.hy = 4.5 * pu; P.bounce = pu * 3; P.lean = Math.sin(b * Math.PI * 0.5) * 0.05; break;
    case 'rave': { const w = Math.sin(b * Math.PI + o * 6); P.bounce = 9 * pu; P.L = [-2.6 + 0.3 * w, -2.9 + 0.4 * sn]; P.R = [2.6 + 0.3 * w, 2.9 - 0.4 * sn]; P.sway = w * 2; break; }
    case 'funk': { const m = Math.floor(b / 2) % 2; P.sway = sn * 5 * E; P.lean = sn * 0.08 * E; if (m) { P.R = [2.45, 2.55]; P.L = [-0.6, 0.95]; } else { P.L = [-2.45, -2.55]; P.R = [0.6, -0.95]; } P.LL = [-0.1 - sn * 0.1, -0.05]; P.RL = [0.1 - sn * 0.1, 0.05]; P.bounce = pu * 2; break; }
    case 'cheer': if (((n % 8) + 8) % 8 < 3) { P.L = [-2.7, -2.9 + pu * 0.3]; P.R = [2.7, 2.9 - pu * 0.3]; P.bounce = pu * 5; } else { P.sway = sn * 3; P.bounce = pu * 1.5; P.L = [-0.4, 1.9]; P.R = [0.4, -1.9 - pu * 0.4]; } break;
    case 'couple': if (sl.side < 0) { P.R = [1.15, 1.45]; P.L = [-0.35, 0.6]; } else { P.L = [-1.15, -1.45]; P.R = [0.35, -0.6]; } P.bounce = pu * 2; P.LL = [-0.05 - Math.max(0, Math.sin(b * Math.PI * 2)) * 0.25, 0.05]; P.RL = [0.05 + Math.max(0, -Math.sin(b * Math.PI * 2)) * 0.25, -0.05]; break;
    default: bandPose(P, stl.slice(2));
  }
  return P;
}
function person(sl, x, y, s, mid, post) {
  const p = sl.p, c = sl.c, P = pose(sl); s *= p.h; const bw = p.w, f = P.face;
  x += (P.dx + P.sway) * s;
  const hipY = y - (P.cross ? 7 : P.sit ? 31 : 50) * s - P.bounce * s, hx = x, lean = P.lean;
  const shX = hx + Math.sin(lean) * 36 * s, shY = hipY - Math.cos(lean) * 36 * s;
  const legW = 6.5 * s * Math.sqrt(bw), armW = 5 * s * (0.85 + bw * 0.15), sw = 10 * bw * s, hw = 7.5 * bw * s;
  const skirt = p.bot === 'skirt' || p.bot === 'dress', bare = p.bot === 'shorts' || skirt;
  const tk = P.sit ? 0.35 : 1;
  // legs
  [[P.LL, -1], [P.RL, 1]].forEach(([a, side]) => {
    const h0 = hx + side * 4.5 * bw * s;
    let kx, ky, fx, fy;
    if (P.cross) { kx = h0 + side * 17 * s; ky = hipY + 3 * s; fx = hx - side * 5 * s; fy = hipY + 6 * s; }
    else { kx = h0 + Math.sin(a[0]) * 26 * s * tk; ky = hipY + Math.cos(a[0]) * 26 * s * tk; fx = kx + Math.sin(a[1]) * 24 * s; fy = ky + Math.cos(a[1]) * 24 * s; }
    limb(h0, hipY, kx, ky, legW, skirt ? c.skin : c.bot); limb(kx, ky, fx, fy, legW * 0.85, bare ? c.skin : c.bot);
    ell(fx + side * 1.4 * s, fy + 0.5 * s, 4.6 * s, 2.5 * s, c.shoe, { ink: true, noline: true });
  });
  // waist / skirt
  if (skirt) { const sk = -P.sway * 0.5 * s; poly([hx - hw, hipY - 4 * s, hx + hw, hipY - 4 * s, hx + hw + 7 * s + sk, hipY + 21 * s, hx - hw - 7 * s + sk, hipY + 21 * s], p.bot === 'dress' ? c.top : c.bot, { lw: 1.6 }); }
  else poly([hx - hw, hipY - 3 * s, hx + hw, hipY - 3 * s, hx + hw + 1.5 * s, hipY + 6 * s, hx - hw - 1.5 * s, hipY + 6 * s], c.bot, { lw: 1.6 });
  // torso
  const tor = [shX - sw, shY, shX + sw, shY, hx + hw, hipY + 1 * s, hx - hw, hipY + 1 * s];
  poly(tor, c.top, { lw: 1.8 });
  if (!MARK) {
    poly([shX + sw * 0.3, shY, shX + sw, shY, hx + hw, hipY + 1 * s, hx + hw * 0.25, hipY + 1 * s], c.topL);
    if (p.top === 'stripe') { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.6 * s; for (let k = 1; k < 5; k++) { const yy = shY + (hipY - shY) * k / 5; g.beginPath(); g.moveTo(shX - sw + 1, yy); g.lineTo(shX + sw - 1, yy); g.stroke(); } }
    if (p.top === 'plaid') { g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2 * s; for (let k = 1; k < 4; k++) { const yy = shY + (hipY - shY) * k / 4; g.beginPath(); g.moveTo(shX - sw + 1, yy); g.lineTo(shX + sw - 1, yy); g.moveTo(shX - sw + k * sw / 2, shY); g.lineTo(hx - hw + k * hw / 2, hipY); g.stroke(); } }
    if ((p.top === 'jacket' || p.top === 'hoodie') && f > 0) poly([shX - 2.5 * s, shY + 1 * s, shX + 2.5 * s, shY + 1 * s, hx + 2 * s, hipY, hx - 2 * s, hipY], mix(c.top, '#ffffff', 0.35));
  } else {
    g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 3; k++) { const yy = shY + (hipY - shY) * (0.3 + k * 0.22); g.moveTo(shX - sw * 0.85 + k * 0.8 * s, yy); g.lineTo(shX - sw * 0.45 + k * 0.8 * s, yy - 4 * s); } g.stroke();
    if (p.top === 'stripe' || p.top === 'plaid') { g.beginPath(); for (let k = 1; k < 4; k++) { const yy = shY + (hipY - shY) * k / 4; g.moveTo(shX - sw + 2, yy); g.lineTo(shX + sw - 2, yy); } g.stroke(); }
  }
  // neck + head
  const hx2 = shX + Math.sin(lean * 1.3) * 12 * s, hy2 = shY - 11.5 * s + P.hy * s;
  limb(shX, shY + 1 * s, hx2, hy2 + 4 * s, 4.2 * s, c.skin);
  const J = { shX, shY, hipY, hx, sw, hw, head: [hx2, hy2], s, P, y };
  if (mid) mid(J);
  // arms
  const hands = [];
  [[P.L, -1], [P.R, 1]].forEach(([a, side]) => {
    const sx = shX + side * (sw - 2 * s), sy = shY + 2.5 * s, ex = sx + Math.sin(a[0]) * 18 * s, ey = sy + Math.cos(a[0]) * 18 * s, hX = ex + Math.sin(a[1]) * 17 * s, hY = ey + Math.cos(a[1]) * 17 * s;
    const up = p.top === 'tank' ? c.skin : c.top, lo = (p.top === 'tee' || p.top === 'tank' || p.top === 'stripe') ? c.skin : c.top;
    limb(sx, sy, ex, ey, armW, up); limb(ex, ey, hX, hY, armW * 0.88, lo); ell(hX, hY, 2.6 * s, 2.6 * s, c.skin, { noline: s < 0.75 }); hands.push([hX, hY]);
  });
  J.hands = hands;
  head(p, c, hx2, hy2, s, f, P);
  if (sl.drink && hands[1]) { rect(hands[1][0] - 2.2 * s, hands[1][1] - 6 * s, 4.4 * s, 6.5 * s, '#d9e7f2', { lw: 1.2 }); if (!MARK) rect(hands[1][0] - 2.2 * s, hands[1][1] - 3.5 * s, 4.4 * s, 3.5 * s, '#e8a33a'); }
  if (sl.glow && hands.length) { const gc = sl.glow; hands.forEach(([X, Y], i) => { const a = (i ? 1 : -1) * 0.5 + Math.sin(S.t * 3 + i) * 0.3; neonPath([X, Y, X + Math.sin(a) * 9 * s, Y - Math.cos(a) * 9 * s], gc, 0.7 + P.pu * 0.6, 2.2 * s); }); }
  if (post) post(J);
  sl.hx = hx2; sl.hy = hy2; sl.hs = s;
  return J;
}
function head(p, c, x, y, s, f, P) {
  const rx = 7.6 * s, ry = 9 * s, hc = c.hair, hairInk = { ink: true, lw: 1.4 };
  const H = p.hair;
  if (f > 0 && (H === 'long' || H === 'pony')) poly([x - rx * 1.1, y - 2 * s, x + rx * 1.1, y - 2 * s, x + rx * 1.15, y + 14 * s, x - rx * 1.15, y + 14 * s], hc, hairInk);
  if (f > 0 && H === 'curly') ell(x, y - 2 * s, rx * 1.45, ry * 1.25, hc, hairInk);
  ell(x, y, rx, ry, c.skin, { lw: 1.6 });
  if (!MARK && f > 0) ell(x + rx * 0.35, y + ry * 0.1, rx * 0.55, ry * 0.8, c.skinL);
  if (f < 0) { // back of the head
    if (H !== 'bald') ell(x, y - 0.5 * s, rx * (H === 'curly' ? 1.4 : 1.03), ry * (H === 'curly' ? 1.2 : 0.98), hc, hairInk);
    if (H === 'long') poly([x - rx, y, x + rx, y, x + rx * 1.05, y + 15 * s, x - rx * 1.05, y + 15 * s], hc, hairInk);
    if (H === 'pony') limb(x, y + 2 * s, x + Math.sin(S.t * 4) * 3 * s, y + 16 * s, 4 * s, hc, { ink: true });
    if (H === 'bun') ell(x, y - ry * 0.9, 4.5 * s, 4 * s, hc, hairInk);
  } else {
    switch (H) {
      case 'short': case 'buzz': poly([x - rx, y - 1 * s, x - rx * 0.9, y - ry * 0.8, x, y - ry * 1.12, x + rx * 0.9, y - ry * 0.8, x + rx, y - 1 * s, x + rx * 0.6, y - ry * 0.55, x - rx * 0.6, y - ry * 0.55], hc, hairInk); break;
      case 'bob': case 'long': case 'pony': poly([x - rx * 1.12, y + (H === 'bob' ? 5 : 3) * s, x - rx * 1.05, y - ry * 0.85, x, y - ry * 1.15, x + rx * 1.05, y - ry * 0.85, x + rx * 1.12, y + (H === 'bob' ? 5 : 3) * s, x + rx * 0.8, y - ry * 0.25, x - rx * 0.3, y - ry * 0.6], hc, hairInk); if (H === 'pony') limb(x + rx, y - ry * 0.4, x + rx + 5 * s + Math.sin(S.t * 5) * 2 * s, y + 6 * s, 3.6 * s, hc, { ink: true }); break;
      case 'bun': poly([x - rx, y - 1 * s, x, y - ry * 1.12, x + rx, y - 1 * s, x + rx * 0.5, y - ry * 0.6, x - rx * 0.5, y - ry * 0.6], hc, hairInk); ell(x, y - ry * 1.15, 4.5 * s, 4 * s, hc, hairInk); break;
      case 'curly': ell(x, y - ry * 0.75, rx * 1.2, ry * 0.55, hc, hairInk); break;
      case 'mohawk': poly([x - 2 * s, y - ry * 0.7, x, y - ry * 1.75, x + 2 * s, y - ry * 0.7], hc, hairInk); break;
    }
    if (p.acc === 'shades' && s > 0.45) rect(x - rx * 0.85, y - 2 * s, rx * 1.7, 3 * s, '#0c0c0c', { ink: true, noline: true });
    if (p.acc === 'glasses' && s > 0.6) { g.strokeStyle = MARK ? INK : '#1a1a1a'; g.lineWidth = 1; g.beginPath(); g.arc(x - 3 * s, y - 0.5 * s, 2.4 * s, 0, 7); g.moveTo(x + 5.4 * s, y - 0.5 * s); g.arc(x + 3 * s, y - 0.5 * s, 2.4 * s, 0, 7); g.stroke(); }
    if (p.acc === 'beard') poly([x - rx * 0.9, y + 1 * s, x + rx * 0.9, y + 1 * s, x + rx * 0.5, y + ry * 0.95, x, y + ry * 1.15, x - rx * 0.5, y + ry * 0.95], hc, hairInk);
  }
  hat(p, c, x, y, rx, ry, s);
}
function hat(p, c, x, y, rx, ry, s) {
  const hc = c.hat, top = y - ry * 0.62;
  switch (p.hat) {
    case 'cap': poly([x - rx * 1.05, top + 2 * s, x - rx * 0.8, top - 5 * s, x + rx * 0.8, top - 5 * s, x + rx * 1.05, top + 2 * s], hc); poly([x - rx * 0.2, top + 2 * s, x + rx * 1.7, top + 3 * s, x + rx * 1.05, top + 0.5 * s], mix(hc, '#000000', 0.2)); break;
    case 'cowboy': ell(x, top + 1.5 * s, rx * 2.1, 2.6 * s, mix(hc, '#000000', 0.15)); poly([x - rx * 0.85, top + 1 * s, x - rx * 0.7, top - 8 * s, x, top - 6 * s, x + rx * 0.7, top - 8 * s, x + rx * 0.85, top + 1 * s], hc); break;
    case 'captain': rect(x - rx * 1.05, top - 1 * s, rx * 2.1, 3 * s, '#111318'); poly([x - rx * 1.2, top - 1 * s, x - rx * 1.05, top - 7 * s, x + rx * 1.05, top - 7 * s, x + rx * 1.2, top - 1 * s], '#f4f1de'); if (!MARK) rect(x - 1.5 * s, top - 4 * s, 3 * s, 2 * s, '#e0b33a'); break;
    case 'toque': poly([x - rx * 1.02, top + 2 * s, x - rx * 0.9, top - 5 * s, x, top - 8 * s, x + rx * 0.9, top - 5 * s, x + rx * 1.02, top + 2 * s], hc); ell(x, top - 8.5 * s, 2.8 * s, 2.8 * s, '#f4f1de'); break;
    case 'souwester': poly([x - rx * 1.7, top + 5 * s, x - rx * 0.9, top - 5 * s, x + rx * 0.9, top - 5 * s, x + rx * 1.7, top + 5 * s], hc); break;
    case 'bandana': poly([x - rx * 1.02, top + 1 * s, x - rx * 0.7, top - 4 * s, x + rx * 0.7, top - 4 * s, x + rx * 1.02, top + 1 * s], hc); break;
    case 'fedora': ell(x, top + 1 * s, rx * 1.65, 2.2 * s, mix(hc, '#000000', 0.25)); poly([x - rx * 0.85, top + 0.5 * s, x - rx * 0.75, top - 7 * s, x + rx * 0.75, top - 7 * s, x + rx * 0.85, top + 0.5 * s], hc); break;
  }
}

/* ---------------- band ---------------- */
function bandPose(P, inst) {
  const E = P.E, b = P.b, pu = P.pu, on = S.playing, osc = on ? Math.sin(b * Math.PI * 4) : 0;
  switch (inst) {
    case 'guitar': case 'bass': case 'mic-guitar': case 'banjo': P.L = [-0.7, -1.75]; P.R = [0.35, -0.95 + osc * 0.28]; P.sway = Math.sin(b * Math.PI * 0.5) * 2 * E; P.bounce = pu * 1.4; P.hy = pu * 1.5; break;
    case 'mic': P.R = [0.2, 2.9]; P.L = [-0.5 - pu * 0.7, -1.4 - pu * 0.9]; P.sway = Math.sin(b * Math.PI) * 3 * E; P.bounce = pu * 1.6; break;
    case 'drums': { const k = Math.floor(b * 2) % 2; P.sit = true; P.L = [-0.5, (on && k ? 1.6 : 0.9)]; P.R = [0.5, (on && !k ? -1.6 : -0.9)]; P.hy = pu * 2; break; }
    case 'fiddle': P.R = [0.95, 2.05]; P.L = [-0.35, 1.25 + osc * 0.45]; P.sway = Math.sin(b * Math.PI * 0.5) * 2.5 * E; P.bounce = pu * 1.5; break;
    case 'accordion': P.L = [-0.3, 0.55]; P.R = [0.3, -0.55]; P.sway = Math.sin(b * Math.PI * 0.5) * 3 * E; P.bounce = pu; break;
    case 'keys': P.L = [-0.15, 0.3 + (on ? Math.sin(b * Math.PI * 2) * 0.15 : 0)]; P.R = [0.15, -0.3 + (on ? Math.cos(b * Math.PI * 2) * 0.15 : 0)]; P.hy = pu * 2; P.sway = Math.sin(b * Math.PI) * 1.5 * E; break;
    case 'sax': P.L = [-0.1, 0.45]; P.R = [0.15, -0.25]; P.lean = -Math.max(0, Math.sin(b * Math.PI * 0.25)) * 0.14 * E; P.bounce = pu; break;
    case 'trumpet': P.L = [-0.05, 2.55]; P.R = [0.35, 2.15]; P.lean = -pu * 0.08; P.bounce = pu * 1.2; P.hy = -pu; break;
    case 'dj': { const n = P.n, up = on && ((n % 16) + 16) % 16 >= 14; P.L = [-0.8, 2.95]; P.R = up ? [2.6, 2.9] : [0.25, 0.5 + Math.sin(b * Math.PI) * 0.2 * E]; P.hy = pu * 3; P.bounce = pu * 1.5; break; }
  }
}
function instrument(inst, J, act, phase) {
  const s = J.s, { shX, shY, hipY, hx } = J, on = S.playing, P = J.P;
  const ac = act.cols;
  if (phase === 'mid') switch (inst) {
    case 'guitar': case 'bass': case 'mic-guitar': case 'banjo': {
      const bx = hx + 3 * s, by = hipY - 8 * s, bass = inst === 'bass', ban = inst === 'banjo';
      const col = { guitar: act.k === 'rock' ? '#d62828' : '#2b2f3a', bass: '#1f2a44', 'mic-guitar': '#c58b4a', banjo: '#e9dfc8' }[inst];
      ln(bx, by, shX - (bass ? 40 : 34) * s, shY + 3 * s, '#5a3b22', 3 * s, { mw: 2 });
      rect(shX - (bass ? 44 : 38) * s, shY + 0.5 * s, 6 * s, 4 * s, '#2a1a10', { lw: 1.2 });
      if (ban) { ell(bx, by, 9.5 * s, 9.5 * s, '#8a6a40'); ell(bx, by, 7.8 * s, 7.8 * s, col); }
      else { ell(bx + 2 * s, by + 3 * s, (bass ? 12 : 11) * s, 8.5 * s, col, {}, -0.45); ell(bx - 5 * s, by - 3 * s, 8 * s, 6.5 * s, col, {}, -0.45); ell(bx - 1 * s, by, 2.8 * s, 2.8 * s, '#111', { ink: true }); }
      if (inst === 'mic-guitar') micStand(J);
      break;
    }
    case 'mic': micStand(J); break;
    case 'accordion': { const sq = on ? Math.sin(P.b * Math.PI) * 4 * s : 0, w2 = 13 * s + sq, x0 = shX, y0 = shY + 6 * s, h = 22 * s;
      rect(x0 - w2, y0, 6 * s, h, '#b0162c'); rect(x0 + w2 - 6 * s, y0, 6 * s, h, '#b0162c'); rect(x0 - w2 + 6 * s, y0 + 1 * s, 2 * (w2 - 6 * s), h - 2 * s, '#f1e8d2');
      g.strokeStyle = MARK ? INK : '#7a6b55'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 6; i++) { const xx = x0 - w2 + 6 * s + (2 * (w2 - 6 * s)) * (i + 0.5) / 6; g.moveTo(xx, y0 + 1 * s); g.lineTo(xx + (i % 2 ? -1.5 : 1.5) * s, y0 + h - 1 * s); } g.stroke();
      if (!MARK) for (let i = 0; i < 5; i++) rect(x0 - w2 + 1 * s, y0 + 2 * s + i * 4 * s, 4 * s, 2.5 * s, '#f4f1de'); break; }
    case 'keys': { const y0 = hipY - 4 * s; ln(hx - 18 * s, J.y, hx + 18 * s, y0 + 4 * s, '#222', 2 * s); ln(hx + 18 * s, J.y, hx - 18 * s, y0 + 4 * s, '#222', 2 * s); break; }
    case 'drums': drumKit(J, act); break;
    case 'dj': djBooth(J, act); break;
  }
  if (phase === 'post') switch (inst) {
    case 'fiddle': { const fx = shX + 10 * s, fy = shY + 4 * s; ell(fx, fy, 8 * s, 4.4 * s, '#8a3b14', {}, 0.55); ln(fx + 4 * s, fy + 3 * s, J.hands[1][0], J.hands[1][1], '#2a1a10', 2 * s); const h = J.hands[0]; ln(h[0] - 14 * s, h[1] - 6 * s, h[0] + 16 * s, h[1] + 7 * s, '#e8dcc0', 1.4 * s, { mw: 1.6 }); break; }
    case 'keys': { const y0 = J.hipY - 6 * s; rect(J.hx - 26 * s, y0, 52 * s, 6 * s, '#1b1b1f'); if (!MARK) { rect(J.hx - 24 * s, y0 + 1 * s, 48 * s, 2.6 * s, '#f4f1de'); g.fillStyle = '#111'; for (let i = 0; i < 12; i++) g.fillRect(J.hx - 23 * s + i * 4 * s, y0 + 1 * s, 1.6 * s, 1.6 * s); } else { g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 12; i++) { g.moveTo(J.hx - 23 * s + i * 4 * s, y0 + 1 * s); g.lineTo(J.hx - 23 * s + i * 4 * s, y0 + 4 * s); } g.stroke(); } break; }
    case 'sax': { const m = [J.head[0] + 1 * s, J.head[1] + 6 * s]; const gold = '#d9a531'; ln(m[0], m[1], m[0] + 3 * s, m[1] + 8 * s, '#222', 2 * s); g.lineCap = 'round'; path([m[0] + 3 * s, m[1] + 8 * s, J.hx + 2 * s, J.hipY - 2 * s, J.hx + 9 * s, J.hipY - 1 * s, J.hx + 12 * s, J.hipY - 10 * s], false); g.strokeStyle = MARK ? INK : gold; g.lineWidth = (MARK ? 2 : 5) * s; g.stroke(); if (MARK) { g.strokeStyle = PAPER; g.lineWidth = 2.6 * s; } ell(J.hx + 12 * s, J.hipY - 11 * s, 4 * s, 2.2 * s, gold); if (on) glow(J.hx + 12 * s, J.hipY - 12 * s, 12 * s, ac[1], 0.3 * P.pu); break; }
    case 'trumpet': { const m = [J.head[0] + 4 * s, J.head[1] + 4 * s], a = -0.15 - P.pu * 0.15, ex = m[0] + Math.cos(a) * 26 * s, ey = m[1] + Math.sin(a) * 26 * s; ln(m[0], m[1], ex, ey, '#d9a531', 3 * s); poly([ex, ey, ex + 6 * s, ey - 5 * s, ex + 6 * s, ey + 5 * s], '#e6b84a', { lw: 1.4 }); if (on) glow(ex + 6 * s, ey, 14 * s, ac[1], 0.35 * P.pu); break; }
    case 'drums': { const k = Math.floor(P.b * 2) % 2; J.hands.forEach(([X, Y], i) => { const a = (i ? 1 : -1) * (on && (i ? !k : k) ? 0.2 : 0.9); ln(X, Y, X + Math.sin(a) * 14 * s, Y - Math.cos(a) * 14 * s, '#e8dcc0', 1.6 * s, { mw: 1.6 }); }); break; }
    case 'dj': if (J.hands) { const hd = J.head; g.lineWidth = 2 * s; g.strokeStyle = MARK ? INK : '#111'; g.beginPath(); g.arc(hd[0], hd[1] - 1 * s, 8.5 * s, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); ell(hd[0] - 8 * s, hd[1] + 1 * s, 2.6 * s, 3.4 * s, '#111', { ink: true }); ell(hd[0] + 8 * s, hd[1] + 1 * s, 2.6 * s, 3.4 * s, '#111', { ink: true }); } break;
  }
}
function micStand(J) { const s = J.s, x = J.shX + 9 * s, top = J.head[1] + 5 * s; ln(x + 3 * s, J.y, x, top + 3 * s, '#2a2a2a', 1.6 * s, { mw: 1.6 }); ln(x + 3 * s - 6 * s, J.y, x + 3 * s + 6 * s, J.y, '#2a2a2a', 1.6 * s, { mw: 1.6 }); ell(x - 1.5 * s, top, 2.2 * s, 3 * s, '#3a3a3a', { ink: true }); }
function drumKit(J, act) {
  const s = J.s, x = J.hx, y = J.y, on = S.playing, P = J.P, k = Math.floor(P.b * 2) % 2, hit = on ? P.pu : 0, ac = act.cols;
  // cymbals
  [[-30, -40, -0.18], [30, -44, 0.18]].forEach(([dx, dy, r], i) => { ln(x + dx * s, y - 2 * s, x + dx * s, y + dy * s, '#555', 1.4 * s, { mw: 1.4 }); ell(x + dx * s, y + dy * s, 12 * s, 2.4 * s, '#d9b84a', { lw: 1.4 }, r + (i ? 1 : -1) * hit * 0.15); if (on && hit > 0.4 && (i === (P.n % 2))) glow(x + dx * s, y + dy * s, 22 * s, '#fff1b0', hit * 0.6); });
  ell(x - 17 * s, y - 24 * s, 8 * s, 3 * s, '#e8e2d8', { lw: 1.4 }); rect(x - 25 * s, y - 24 * s, 16 * s, 8 * s, ac[0], { lw: 1.4 });
  ell(x + 17 * s, y - 20 * s, 9 * s, 3.2 * s, '#e8e2d8', { lw: 1.4 }); rect(x + 8 * s, y - 20 * s, 18 * s, 16 * s, ac[0], { lw: 1.4 });
  ell(x, y - 15 * s, 15 * s, 15 * s, mix(ac[0], '#000000', 0.25), { lw: 2 }); ell(x, y - 15 * s, 12 * s, 12 * s, '#f1ece0', { lw: 1.4 });
  if (!MARK) { g.fillStyle = mix(ac[0], '#000000', 0.2); g.font = `700 ${7 * s}px Georgia`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('\u2693', x, y - 15 * s); }
  else { txt('\u2693', x, y - 15 * s, 9 * s, INK); }
  if (on && hit > 0.3 && k === 0) glow(x, y - 15 * s, 26 * s, ac[1], hit * 0.35);
}
function djBooth(J, act) {
  const s = J.s, x = J.hx, y = J.y, on = S.playing, ac = act.cols, top = J.hipY - 6 * s;
  poly([x - 46 * s, top, x + 46 * s, top, x + 42 * s, y, x - 42 * s, y], '#121522', { h: 6 });
  const pulse = on ? 0.6 + J.P.pu * 0.8 : 0.35;
  neonPath([x - 40 * s, top + 8 * s, x + 40 * s, top + 8 * s], ac[0], pulse, 2 * s);
  neonText('DJ LIGHTHOUSE', x, top + 20 * s, 10 * s, ac[1], pulse, "'Monoton','Impact',sans-serif", 'center', 76 * s);
  rect(x - 44 * s, top - 4 * s, 88 * s, 4 * s, '#2a2e3d');
  [-26, 26].forEach((dx, i) => { ell(x + dx * s, top - 4 * s, 12 * s, 3.2 * s, '#1b1b1b', { ink: true }); const a = S.t * (on ? 6 : 0.5) + i; ln(x + dx * s, top - 4 * s, x + dx * s + Math.cos(a) * 10 * s, top - 4 * s + Math.sin(a) * 2.6 * s, '#cfcfcf', 1.2 * s, { mw: 1 }); });
  poly([x - 7 * s, top - 4 * s, x + 7 * s, top - 4 * s, x + 6 * s, top - 15 * s, x - 6 * s, top - 15 * s], '#9aa3b5', { lw: 1.2 });
  glow(x, top - 10 * s, 18 * s, ac[0], 0.35 + (on ? J.P.pu * 0.4 : 0));
}
const BANDP = {};
function bandMember(act, inst, i) {
  const key = act.k + ':' + inst + ':' + i; if (BANDP[key]) return BANDP[key];
  const r = RNG(key.length * 977 + i * 131 + act.k.charCodeAt(0) * 17);
  const p = { ...ROSTER[Math.floor(r() * ROSTER.length)] };
  const looks = {
    country: { hat: 'cowboy', hatC: '#7a4a26', top: pickR(r, ['plaid', 'long', 'jacket']), topC: pickR(r, ['#a4161a', '#1d4e89', '#e9dfc8', '#3b2416']), bot: 'jeans', botC: '#2b4a7a' },
    rock: { hat: pickR(r, ['none', 'none', 'bandana']), top: pickR(r, ['tank', 'tee', 'jacket']), topC: pickR(r, ['#111318', '#2b2f3a', '#c8102e']), bot: 'jeans', botC: '#1a1a22', acc: pickR(r, ['shades', 'none', 'beard']), hair: pickR(r, ['long', 'mohawk', 'curly', 'short']) },
    east: { hat: pickR(r, ['none', 'captain', 'fedora', 'none']), top: pickR(r, ['plaid', 'stripe', 'long']), topC: pickR(r, ['#264653', '#2a9d8f', '#f4f1de', '#3d5a80']), bot: pickR(r, ['pants', 'jeans']) },
    dj: { hat: 'cap', hatC: '#111318', top: 'hoodie', topC: '#111318', bot: 'pants', botC: '#1a1a22', acc: 'shades' },
    funk: { hat: pickR(r, ['none', 'fedora', 'none']), top: pickR(r, ['jacket', 'long', 'tee']), topC: pickR(r, ['#6a4c93', '#ff8a00', '#f2c14e', '#ef476f', '#f4f1de']), bot: pickR(r, ['pants', 'pants', 'dress']), botC: pickR(r, ['#111318', '#f4f1de', '#6a4c93']), hair: pickR(r, ['curly', 'curly', 'short', 'bun']) }
  }[act.k];
  Object.assign(p, looks); p.h = 1; p.w = 1;
  return (BANDP[key] = { p, style: 'b:' + inst, off: 0, face: 1 });
}
function drawBand(cx, y, width, s, amb, light) {
  const act = ACTS[S.act], list = act.band, front = list.filter((x) => x !== 'drums'), hasDrums = list.includes('drums');
  if (act.k === 'dj') {
    const sl = bandMember(act, 'dj', 0); sl.c = sl.c && sl.cKey === amb.col + light ? sl.c : (sl.cKey = amb.col + light, shadeSet(sl.p, amb, light));
    person(sl, cx, y, s * 1.08, (J) => instrument('dj', J, act, 'mid'), (J) => instrument('dj', J, act, 'post'));
    return;
  }
  if (hasDrums) { const sl = bandMember(act, 'drums', 9); sl.c = sl.cKey === amb.col + light ? sl.c : (sl.cKey = amb.col + light, shadeSet(sl.p, amb, light)); person(sl, cx, y - 10 * s, s * 0.95, null, (J) => { instrument('drums', J, act, 'mid'); instrument('drums', J, act, 'post'); }); }
  front.forEach((inst, i) => {
    const n = front.length, fx = cx + (n === 1 ? 0 : (i / (n - 1) - 0.5) * width), off = hasDrums && Math.abs(fx - cx) < 30 * s ? (i < n / 2 ? -34 : 34) * s : 0;
    const sl = bandMember(act, inst, i); sl.c = sl.cKey === amb.col + light ? sl.c : (sl.cKey = amb.col + light, shadeSet(sl.p, amb, light));
    person(sl, fx + off, y, s, (J) => instrument(inst, J, act, 'mid'), (J) => instrument(inst, J, act, 'post'));
  });
}

/* ---------------- crowd ---------------- */
let CROWD = [], CROWD_KEY = '';
function pickStyle(r, weights) { const e = Object.entries(weights), tot = e.reduce((a, [, w]) => a + w, 0); let x = r() * tot; for (const [k, w] of e) { if ((x -= w) <= 0) return k; } return e[0][0]; }
function addSlot(list, r, x, y, s, style, face, extra) {
  const p = ROSTER[Math.floor(r() * ROSTER.length)], act = ACTS[S.act];
  const sl = Object.assign({ p, x, y, s, style, face, off: r(), drink: style === 'stand' && r() < 0.45 }, extra || {});
  if (style === 'rave' && r() < 0.6) sl.glow = pickR(r, act.cols);
  list.push(sl); return sl;
}
function buildCrowd() {
  const key = S.scene + '|' + S.act; if (key === CROWD_KEY) return; CROWD_KEY = key;
  const r = RNG(key.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0), act = ACTS[S.act], L = [];
  const W8 = act.crowd;
  const dance = (n, x0, x1, y0, y1, s0, s1, faceBack, spread) => {
    for (let i = 0; i < n; i++) {
      const y = y0 + (y1 - y0) * Math.pow(r(), 0.8), k = (y - y0) / (y1 - y0), sp = (spread || 0) * k, x = x0 - sp + r() * (x1 - x0 + sp * 2), s = s0 + (s1 - s0) * k;
      let st = pickStyle(r, W8); const face = r() < faceBack ? -1 : 1;
      if (st === 'couple') { const c = addSlot(L, r, x - 13 * s, y, s, 'couple', 1, { side: -1, pair: i, cx: x }); addSlot(L, r, x + 13 * s, y, s, 'couple', 1, { side: 1, pair: i, cx: x, off: c.off }); continue; }
      addSlot(L, r, x, y, s, st, face);
    }
  };
  const idle = (n, x0, x1, y0, y1, s0, s1, face, style) => { for (let i = 0; i < n; i++) { const y = y0 + (y1 - y0) * r(), k = (y - y0) / Math.max(1, y1 - y0); addSlot(L, r, x0 + r() * (x1 - x0), y, s0 + (s1 - s0) * k, style || (r() < 0.6 ? 'stand' : 'sway'), face == null ? (r() < 0.5 ? 1 : -1) : face); } };
  switch (S.scene) {
    case 'inside': dance(38, 250, 710, 350, 530, 0.6, 1.2, 0.72, 220); [[95, 432], [70, 508], [865, 432], [890, 508]].forEach(([x, y]) => { addSlot(L, r, x - 24, y - 6, y > 470 ? 1.05 : 0.9, 'sit', 1, { table: [x, y] }); addSlot(L, r, x + 24, y - 6, y > 470 ? 1.05 : 0.9, 'sit', 1, { table: [x, y] }); }); break;
    case 'deck': idle(6, 230, 930, 424, 426, 0.8, 0.8, -1, 'stand'); [[360, 470], [600, 505], [820, 462]].forEach(([x, y]) => { addSlot(L, r, x - 28, y - 4, 0.95, 'sit', 1, { table: [x, y], drink: r() < 0.6 }); addSlot(L, r, x + 28, y - 4, 0.95, 'sit', 1, { table: [x, y], drink: r() < 0.6 }); }); dance(9, 650, 930, 470, 535, 0.95, 1.15, 0.3); L.push({ p: { ...ROSTER[7], hat: 'captain', top: 'long', topC: '#f4f1de', h: 1, w: 1 }, x: 120, y: 442, s: 0.9, style: 'stand', face: 1, off: 0.3, bartender: true }); break;
    case 'outside': idle(5, 600, 680, 432, 452, 0.56, 0.62, 1, 'stand'); idle(12, 60, 900, 455, 535, 0.62, 1.0); dance(4, 200, 760, 470, 530, 0.7, 1.0, 0.1); L.forEach((sl) => { if (sl.x > 350 && sl.x < 610) { const d = sl.x < 480 ? -1 : 1; sl.x += d * (130 - Math.abs(sl.x - 480) * 0.2); if (sl.cx != null) sl.cx += d * 130; } }); break;
    case 'shore': dance(46, 40, 560, 372, 535, 0.55, 1.15, 0.85, 60); idle(5, 30, 260, 480, 530, 1, 1.1, 1, 'sit'); break;
    case 'beachDay': dance(14, 90, 470, 445, 530, 0.8, 1.05, 0.7); idle(6, 560, 920, 440, 520, 0.85, 1.05, 1, 'cross'); idle(3, 520, 900, 395, 420, 0.65, 0.7, 1, 'stand'); break;
    case 'beachNight': dance(26, 60, 540, 440, 532, 0.78, 1.08, 0.6, 30); [[612, 470], [708, 470], [584, 506], [738, 506], [880, 490]].forEach(([x, y]) => addSlot(L, r, x, y, 0.95, 'cross', 1)); idle(3, 800, 930, 440, 470, 0.8, 0.85, 1, 'sway'); break;
  }
  CROWD = L.sort((a, b) => a.y - b.y);
}
function drawCrowd(amb, light, filter) {
  const ck = amb.col + light + S.act;
  for (const sl of CROWD) {
    if (filter && !filter(sl)) continue;
    if (sl.cKey !== ck) { sl.cKey = ck; sl.c = shadeSet(sl.p, amb, sl.style === 'couple' || sl.style === 'rave' ? ACTS[S.act].cols[(sl.off * 3) | 0] : light); }
    let x = sl.x;
    if (sl.style === 'couple' && S.playing) { const b = S.beat + sl.off * 0.1, th = Math.PI * Math.floor(b / 8) + Math.PI * smooth(clamp((b % 8) - 7, 0, 1)); x = sl.cx + Math.cos(th) * 13 * sl.s * sl.side; }
    if (sl.style === 'sit' && !sl.table) ell(x, sl.y - 2, 12 * sl.s, 4 * sl.s, '#1a1a1a', { skip: true });
    person(sl, x, sl.y, sl.s);
    if (sl.table && sl.side2 !== 1) {/* tables drawn by scene */}
  }
}
const smooth = (x) => x * x * (3 - 2 * x);

/* ---------------- scene pieces ---------------- */
const STARS = []; (function () { const r = RNG(99); for (let i = 0; i < 140; i++) STARS.push([r() * W, r() * 260, r() * 1.4 + 0.3, r() * 6]); })();
function stars(maxY, a) { for (const [x, y, z, ph] of STARS) { if (y > maxY) continue; const tw = 0.5 + 0.5 * Math.sin(S.t * 1.5 + ph * 3); if (MARK) { if (z > 1.2) { g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2.5, y); g.lineTo(x + 2.5, y); g.moveTo(x, y - 2.5); g.lineTo(x, y + 2.5); g.stroke(); } } else { g.fillStyle = `rgba(255,255,240,${(0.35 + 0.65 * tw) * a})`; g.fillRect(x, y, z, z); } } }
function moon(x, y, r) { glow(x, y, r * 5, '#fff3c4', 0.5); if (MARK) { ell(x, y, r, r, PAPER, { lw: 2 }); g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.2, r * 0.2, 0, 7); g.moveTo(x + r * 0.55, y + r * 0.3); g.arc(x + r * 0.4, y + r * 0.3, r * 0.15, 0, 7); g.stroke(); } else { ell(x, y, r, r, '#fff6dc'); ell(x - r * 0.3, y - r * 0.2, r * 0.2, r * 0.2, '#efe3bf'); ell(x + r * 0.4, y + r * 0.3, r * 0.15, r * 0.15, '#efe3bf'); } }
const SPRUCE = {};
function spruceLine(key, y, h, col, x0, x1, o) {
  if (!SPRUCE[key]) { const r = RNG(key.length * 131 + y), pts = [x0, y + 40]; let x = x0; while (x < x1) { const hh = h * (0.5 + r() * 0.6), w = 8 + r() * 12; pts.push(x, y - hh * 0.25, x + w * 0.5, y - hh, x + w, y - hh * 0.2); x += w * (0.6 + r() * 0.4); } pts.push(x1, y + 40); SPRUCE[key] = pts; }
  poly(SPRUCE[key], col, o || { h: 7 });
}
function water(y0, y1, c0, c1, refl) {
  if (!MARK) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
  else { g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); for (let i = 0; i < 16; i++) { const k = i / 16, yy = y0 + Math.pow(k, 1.5) * (y1 - y0), sh = (S.t * 8 * (0.3 + k)) % 60; for (let x = -60 + sh + (i % 2) * 30; x < W; x += 60 + k * 50) { g.moveTo(x, yy); g.quadraticCurveTo(x + 8 + k * 8, yy - 2 - k * 2, x + 16 + k * 16, yy); } } g.stroke(); }
  if (!MARK) { g.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 26; i++) { const k = i / 26, yy = y0 + Math.pow(k, 1.6) * (y1 - y0), off = (S.t * 10 * (0.4 + k) + i * 47) % (W + 100) - 50; g.fillRect(off, yy, 20 + k * 60, 1 + k * 1.5); } }
  (refl || []).forEach(([x, col, a, wd]) => { for (let i = 0; i < 18; i++) { const k = i / 18, yy = y0 + 3 + Math.pow(k, 1.3) * (y1 - y0 - 6), wob = Math.sin(S.t * 2 + i * 1.7) * (3 + k * 10), w = (wd || 10) * (0.5 + k * 1.4) * (0.6 + 0.4 * Math.sin(S.t * 3 + i)); g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.fillStyle = rgba(col, (MARK ? 0.55 : 0.45) * a * (1 - k * 0.4)); g.fillRect(x + wob - w / 2, yy, w, 1.5 + k * 2); } g.globalCompositeOperation = 'source-over'; });
}
function catenary(x1, y1, x2, y2, sag, k) { const x = x1 + (x2 - x1) * k, y = y1 + (y2 - y1) * k + sag * 4 * k * (1 - k); return [x, y]; }
function stringLights(x1, y1, x2, y2, sag, n, cols, base, seed) {
  g.strokeStyle = MARK ? INK : 'rgba(20,16,12,.85)'; g.lineWidth = MARK ? 1.4 : 1.2; g.beginPath(); for (let i = 0; i <= 20; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / 20); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  const on = S.playing, chase = S.beat * 2;
  for (let i = 1; i < n; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / n); const col = cols[(i + (seed || 0)) % cols.length]; const tw = on ? 0.65 + 0.35 * Math.cos((i - chase) * 0.9) + 0.25 * S.energy : 0.75 + 0.1 * Math.sin(S.t * 2 + i); ln(x, y - 3, x, y, '#222', 1.2, { mw: 1 }); bulb(x, y + 2, base || 2.6, col, tw); }
}
const WARM = ['#ffcf7a', '#ffd98f', '#ffc061'], PARTY = ['#ff4f8b', '#ffd23f', '#3ddcff', '#7cff6b', '#c77dff', '#ff8a3d'];
function flagLine(x1, y1, x2, y2, sag, n, seed) {
  ln(x1, y1, x2, y2 + 0.001, '#222', 1.2, { skip: true });
  g.strokeStyle = MARK ? INK : 'rgba(30,30,30,.8)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i <= 16; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / 16); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  const F = [['#c8102e', '#f4f1de', 'h'], ['#1d4e89', '#f4f1de', 'v'], ['#f2c14e', '#1d4e89', 'x'], ['#f4f1de', '#c8102e', 'b'], ['#f2c14e', '#c8102e', 'd'], ['#1d4e89', '#f2c14e', 'p'], ['#111318', '#f2c14e', 'h'], ['#c8102e', '#f2c14e', 'v']];
  for (let i = 1; i < n; i++) {
    const [x, y] = catenary(x1, y1, x2, y2, sag, i / n), [a, b, k] = F[(i + seed) % F.length], fl = Math.sin(S.t * 3 + i) * 1.5, w = 11, h = 14;
    if (k === 'p') { poly([x - w / 2, y, x + w / 2, y, x + fl, y + h + 4], a, { lw: 1.2 }); continue; }
    poly([x - w / 2, y, x + w / 2, y, x + w / 2 + fl, y + h, x - w / 2 + fl, y + h], a, { lw: 1.2 });
    const half = MARK ? { ink: true, noline: true } : null;
    if (k === 'h') poly([x - w / 2 + fl * 0.5, y + h / 2, x + w / 2 + fl * 0.5, y + h / 2, x + w / 2 + fl, y + h, x - w / 2 + fl, y + h], b, half);
    if (k === 'v') poly([x, y, x + w / 2, y, x + w / 2 + fl, y + h, x + fl, y + h], b, half);
    if (k === 'x') { rect(x - 1.2 + fl * 0.5, y, 2.4, h, b, half); rect(x - w / 2 + fl * 0.5, y + h / 2 - 1.2, w, 2.4, b, half); }
    if (k === 'b') rect(x - 2.5 + fl * 0.5, y + 3, 5, 5, b, half);
    if (k === 'd') poly([x - w / 2, y, x + w / 2 + fl, y + h, x - w / 2 + fl, y + h], b, half);
  }
}
function cloud(x, y, sc) {
  const parts = [[0, 0, 34, 16], [26, -9, 26, 18], [52, 0, 30, 15], [-26, 4, 22, 11], [18, 5, 40, 12]];
  if (MARK) { g.strokeStyle = INK; g.lineWidth = 4; parts.forEach(([a, b, c, d]) => { g.beginPath(); g.ellipse(x + a * sc, y + b * sc, c * sc, d * sc, 0, 0, 7); g.stroke(); }); g.fillStyle = PAPER; parts.forEach(([a, b, c, d]) => { g.beginPath(); g.ellipse(x + a * sc, y + b * sc, c * sc, d * sc, 0, 0, 7); g.fill(); }); return; }
  g.fillStyle = '#ffffff'; parts.forEach(([a, b, c, d]) => { g.beginPath(); g.ellipse(x + a * sc, y + b * sc, c * sc, d * sc, 0, 0, 7); g.fill(); });
  g.fillStyle = 'rgba(160,190,220,.35)'; g.beginPath(); g.ellipse(x + 18 * sc, y + 9 * sc, 44 * sc, 6 * sc, 0, 0, 7); g.fill();
}
function gull(x, y, s, flap, col) { const f = Math.sin(flap) * 5 * s; g.lineCap = 'round'; path([x - 11 * s, y - f, x - 5 * s, y - 2 * s - f * 0.3, x, y, x + 5 * s, y - 2 * s - f * 0.3, x + 11 * s, y - f], false); g.strokeStyle = MARK ? INK : col; g.lineWidth = 2 * s; g.stroke(); }
function hangingGull(x, y, s, a) {
  ln(x, 0, x, y - 4 * s, '#888', 0.8, { mw: 0.8 });
  const k = Math.cos(a), w = 22 * s * Math.max(0.25, Math.abs(k));
  poly([x - w, y - 3 * s, x - w * 0.4, y - 5 * s, x, y, x + w * 0.4, y - 5 * s, x + w, y - 3 * s, x + w * 0.3, y + 1 * s, x, y + 4 * s, x - w * 0.3, y + 1 * s], '#e9edf2', { lw: 1.4 });
  ell(x + 6 * s * k, y + 1 * s, 4 * s, 3 * s, '#f4f6f8', { lw: 1.2 }); poly([x + 9.5 * s * k, y + 1 * s, x + 14 * s * k, y + 2 * s, x + 9.5 * s * k, y + 2.6 * s], '#f2b134', { lw: 1 });
  if (!MARK) poly([x - w, y - 3 * s, x - w * 0.75, y - 3.8 * s, x - w * 0.7, y - 1 * s], '#2b2f3a');
}
function lobster(x, y, s, col) {
  col = col || '#d62828'; const dk = mix(col, '#000', 0.25);
  for (let i = 0; i < 5; i++) ell(x, y + (10 + i * 6) * s, (8 - i) * s, 3.6 * s, i % 2 ? dk : col, { lw: 1.2 });
  poly([x, y + 38 * s, x - 9 * s, y + 46 * s, x + 9 * s, y + 46 * s], col, { lw: 1.2 });
  ell(x, y, 8 * s, 11 * s, col, { lw: 1.4 });
  [-1, 1].forEach((d) => { ln(x + d * 6 * s, y - 6 * s, x + d * 14 * s, y - 16 * s, col, 3 * s, { mw: 2 }); ell(x + d * 18 * s, y - 24 * s, 7 * s, 10 * s, col, { lw: 1.4 }, d * 0.4); poly([x + d * 16 * s, y - 32 * s, x + d * 22 * s, y - 38 * s, x + d * 20 * s, y - 30 * s], dk, { lw: 1 }); ln(x + d * 3 * s, y - 10 * s, x + d * 26 * s, y - 50 * s, col, 1.2 * s, { mw: 1.2 }); for (let k = 0; k < 3; k++) ln(x + d * 7 * s, y + (k * 4) * s, x + d * 14 * s, y + (k * 4 + 5) * s, dk, 1.4 * s, { mw: 1.2 }); });
}
function porthole(x, y, r, col, on, pu, seed) {
  ell(x, y, r + 3.5, r + 3.5, '#d9a531', { lw: 2 }); if (!MARK) ell(x - 1, y - 1, r + 3.5, r + 3.5, '#f0c860');
  ell(x, y, r, r, on ? mix('#ffb35a', col, 0.45) : '#c9803a', { lw: 1.6 });
  if (MARK) glow(x, y, r * 1.6, col, 0.7 + pu * 0.4);
  const bob = on ? Math.abs(Math.sin(S.beat * Math.PI + seed)) * 3 : 0;
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); ell(x - 3, y - 2 - bob, 2.6, 3.2, '#1a0d06', { ink: true, noline: true }); poly([x - 7, y + r, x - 6.5, y + 3 - bob, x + 0.5, y + 3 - bob, x + 1, y + r], '#1a0d06', { ink: true, noline: true }); if (on) ln(x, y + 4 - bob, x + 6, y - 6 - bob * 1.5, '#1a0d06', 2, { mw: 2 }); g.restore();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ell(x + Math.cos(a) * (r + 1.8), y + Math.sin(a) * (r + 1.8), 0.9, 0.9, '#7a5a1a', { ink: true, noline: true }); }
  glow(x, y, r * 3, col, (on ? 0.35 + pu * 0.4 : 0.25));
}
function car(x, y, s, col, type) {
  const c2 = mix(col, '#000', 0.35);
  if (type === 'truck') { poly([x, y - 16 * s, x + 30 * s, y - 16 * s, x + 36 * s, y - 32 * s, x + 58 * s, y - 32 * s, x + 64 * s, y - 18 * s, x + 90 * s, y - 16 * s, x + 90 * s, y - 4 * s, x, y - 4 * s], col, { h: 9 }); poly([x + 39 * s, y - 29 * s, x + 56 * s, y - 29 * s, x + 60 * s, y - 19 * s, x + 37 * s, y - 19 * s], '#1c2333'); }
  else { poly([x, y - 14 * s, x + 14 * s, y - 18 * s, x + 26 * s, y - 32 * s, x + 60 * s, y - 32 * s, x + 74 * s, y - 18 * s, x + 92 * s, y - 14 * s, x + 92 * s, y - 4 * s, x, y - 4 * s], col, { h: 9 }); poly([x + 29 * s, y - 29 * s, x + 57 * s, y - 29 * s, x + 67 * s, y - 18 * s, x + 21 * s, y - 18 * s], '#1c2333'); }
  if (!MARK) rect(x, y - 12 * s, 92 * s, 2 * s, mix(col, '#fff', 0.3));
  [18, 72].forEach((dx) => { ell(x + dx * s, y - 4 * s, 8 * s, 8 * s, '#0b0b0b', { ink: true }); ell(x + dx * s, y - 4 * s, 3.5 * s, 3.5 * s, '#9aa', {}); });
  void c2;
}
function lightPole(x, y0, y1, col) { ln(x, y0, x, y1, '#2a2622', 4, { mw: 2.6 }); ln(x, y1, x + 22, y1 + 4, '#2a2622', 3, { mw: 2 }); poly([x + 16, y1 + 2, x + 30, y1 + 4, x + 28, y1 + 9, x + 18, y1 + 8], '#333'); glow(x + 23, y1 + 10, 90, col, 0.5); glow(x + 23, y1 + 8, 14, '#fff2c0', 0.9); }
function titleCard() {
  const k = S.t - S.title; if (k > 4.5) return; const a = k < 0.5 ? k / 0.5 : k > 3.5 ? (4.5 - k) : 1, sc = SCENES[S.scene];
  g.globalAlpha = a * 0.85; if (!MARK) { g.fillStyle = '#000'; g.fillRect(0, H - 92, W, 56); } else { g.fillStyle = PAPER; g.fillRect(0, H - 92, W, 56); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(-2, H - 92, W + 4, 56); }
  g.globalAlpha = a; g.font = "600 26px Georgia,serif"; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = MARK ? INK : '#ffe9b0'; const T = sc.t.toUpperCase().split('').join('\u2009'); g.fillText(T, W / 2, H - 72); g.font = 'italic 15px Georgia,serif'; g.fillStyle = MARK ? INK : '#c9d6ff'; g.fillText(sc.s, W / 2, H - 48); g.globalAlpha = 1;
}

/* ---------- stage lights per act ---------- */
function stageLights(x0, x1, ytop, yfloor, intensity) {
  const act = ACTS[S.act], c = act.cols, on = S.playing, E = on ? 0.55 + S.energy * 0.6 : 0.18, b = S.beat, pu = on ? Math.exp(-((b % 1) * 6)) : 0, n = 6, sp = (x1 - x0) / (n - 1), len = (yfloor - ytop) * 1.25;
  const I = (intensity || 1) * E;
  for (let i = 0; i < n; i++) {
    const x = x0 + sp * i, col = c[i % c.length];
    let ang = 0;
    if (act.k === 'country' || act.k === 'east') ang = Math.sin(S.t * 0.6 + i) * 0.25;
    if (act.k === 'rock') ang = (i % 2 ? 1 : -1) * (0.2 + 0.25 * Math.sin(b * Math.PI * 0.5));
    if (act.k === 'dj') ang = Math.sin(S.t * 1.6 + i * 1.3) * 0.6;
    if (act.k === 'funk') ang = Math.sin(S.t * 0.9 + i * 2) * 0.45;
    beam(x, ytop, ang, len, len * 0.18, col, I * (0.55 + pu * 0.5));
    rect(x - 5, ytop - 6, 10, 8, '#1a1a1a', { lw: 1.2 }); glow(x, ytop + 2, 14, col, I + 0.2);
  }
  if (act.k === 'rock' && on && Math.floor(b) % 4 === 0 && (b % 1) < 0.12) S.flash = 0.6;
  if (act.k === 'dj' && on) { for (let i = 0; i < 10; i++) { const a = Math.sin(S.t * 0.8 + i) * 0.9 + (i - 5) * 0.12; g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.strokeStyle = rgba(c[i % 3], 0.5 * E); g.lineWidth = 1.3; g.beginPath(); g.moveTo((x0 + x1) / 2, ytop + 20); g.lineTo((x0 + x1) / 2 + Math.sin(a) * 900, ytop + 20 + Math.cos(a) * 600); g.stroke(); g.globalCompositeOperation = 'source-over'; } }
}
function lighthouseBeam(x, y, len) { const a = S.t * (S.playing ? 1.2 + S.energy : 0.4); const ang = Math.PI / 2 + Math.sin(a) * 1.3; beam(x, y, ang, len, 70, '#fff6c8', 0.45 + (S.playing ? S.energy * 0.4 : 0)); beam(x, y, -ang, len * 0.6, 50, '#fff6c8', 0.2); glow(x, y, 26, '#fff6c8', 0.9); }
function mirrorBall(x, y, r) {
  ln(x, 0, x, y - r, '#555', 1, { mw: 1 }); ell(x, y, r, r, '#b9c2cf', { lw: 1.6 });
  if (!MARK) { g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) g.fillRect(x + i * r * 0.34 - 1.5, y + j * r * 0.34 - 1.5, 3, 3); } else { g.strokeStyle = INK; g.lineWidth = 0.8; g.beginPath(); for (let k = -2; k <= 2; k++) { g.moveTo(x - r, y + k * r * 0.33); g.lineTo(x + r, y + k * r * 0.33); g.moveTo(x + k * r * 0.33, y - r); g.lineTo(x + k * r * 0.33, y + r); } g.stroke(); }
  const c = ACTS[S.act].cols, on = S.playing; if (!on) return; const r2 = RNG(5); for (let i = 0; i < 60; i++) { const a = r2() * 6.28 + S.t * 0.25, d = 120 + r2() * 600, sx = x + Math.cos(a) * d, sy = y + Math.abs(Math.sin(a)) * d * 0.6 + r2() * 80; if (sy > H) continue; glow(sx, sy, 6 + r2() * 5, c[i % 3], 0.5 + S.energy * 0.4); }
}

/* ---------------- scenes ---------------- */
function sceneOutside() {
  const act = ACTS[S.act], on = S.playing, E = on ? 0.5 + S.energy * 0.6 : 0.3, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0;
  skyGrad(['#050a1e', '#0e1840', '#2a2a5c', '#4a3866'], 380); stars(250, 1); moon(830, 78, 26);
  spruceLine('o-trees', 270, 70, '#081022', 0, W);
  water(330, 372, '#0d1a3a', '#152a52', [[830, '#fff3c4', 0.6, 12]]);
  ground(370, H, '#141820', '#0b0d12');
  if (!MARK) { const r = RNG(3); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 300; i++) g.fillRect(r() * W, 372 + r() * 168, 2, 1); }
  // roof + walls
  const amb = { col: '#0a1030', k: 0.45 };
  poly([60, 256, 900, 256, 850, 176, 110, 176], '#2a3140', { h: 8 });
  if (!MARK) { g.fillStyle = 'rgba(255,255,255,.04)'; for (let y = 184; y < 254; y += 8) g.fillRect(100, y, 760, 1); }
  poly([84, 254, 876, 254, 876, 408, 84, 408], '#c9cbd0');
  if (!MARK) { g.fillStyle = 'rgba(10,16,48,.42)'; g.fillRect(84, 254, 792, 154); g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 262; y < 408; y += 9) g.fillRect(84, y, 792, 1.2); }
  else { g.strokeStyle = INK; g.lineWidth = 0.8; g.beginPath(); for (let y = 266; y < 406; y += 12) { g.moveTo(90, y); g.lineTo(870, y + (y % 2)); } g.stroke(); }
  rect(84, 254, 8, 154, '#7a1d22'); rect(868, 254, 8, 154, '#7a1d22'); rect(84, 400, 792, 8, '#7a1d22');
  // windows with dancers
  const wins = []; for (let x = 112; x < 360; x += 62) wins.push(x); for (let x = 612; x < 860; x += 62) wins.push(x);
  wins.forEach((x, i) => {
    const wc = act.cols[i % act.cols.length], lit = on ? 0.55 + 0.45 * Math.sin(S.beat * Math.PI + i) * 0.5 + pu * 0.3 : 0.45;
    rect(x, 290, 40, 58, '#2a1c10', { lw: 2 });
    if (!MARK) { const gr = g.createLinearGradient(0, 290, 0, 348); gr.addColorStop(0, mix('#ffcf7a', wc, 0.35)); gr.addColorStop(1, '#ff9a4a'); g.globalAlpha = lit; g.fillStyle = gr; g.fillRect(x + 2, 292, 36, 54); g.globalAlpha = 1; }
    else glow(x + 20, 318, 30, wc, lit * 0.8);
    for (let k = 0; k < 2; k++) { const dx = x + 10 + k * 18 + Math.sin(S.t * 2 + i + k) * 3, bob = on ? Math.abs(Math.sin(S.beat * Math.PI + k + i)) * 4 : 0; ell(dx, 322 - bob, 3.4, 4, '#150d08', { ink: true, noline: true }); poly([dx - 5, 346, dx - 4, 328 - bob, dx + 4, 328 - bob, dx + 5, 346], '#150d08', { ink: true, noline: true }); if (on && (k + i) % 3 === 0) ln(dx + 3, 330 - bob, dx + 8, 318 - bob * 2, '#150d08', 2, { mw: 2 }); }
    ln(x + 20, 290, x + 20, 348, '#2a1c10', 2, { mw: 1.6 }); ln(x, 319, x + 40, 319, '#2a1c10', 2, { mw: 1.6 });
  });
  // eave string lights
  stringLights(60, 258, 480, 258, 10, 26, WARM, 2.4); stringLights(480, 258, 900, 258, 10, 26, WARM, 2.4, 1);
  // central gable entrance
  poly([372, 262, 588, 262, 588, 414, 372, 414], '#d8d9dc');
  if (!MARK) { g.fillStyle = 'rgba(10,16,48,.35)'; g.fillRect(372, 262, 216, 152); g.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 270; y < 414; y += 9) g.fillRect(372, y, 216, 1.2); }
  poly([356, 266, 480, 142, 604, 266, 588, 266, 480, 160, 372, 266], '#7a1d22');
  poly([372, 264, 480, 160, 588, 264], '#d8d9dc'); if (!MARK) { g.fillStyle = 'rgba(10,16,48,.4)'; path([372, 264, 480, 160, 588, 264], true); g.fill(); }
  // mast + flags
  ln(480, 142, 480, 92, '#e8e8e8', 3, { mw: 2 }); ell(480, 90, 3, 3, '#e8e8e8');
  flagLine(480, 96, 66, 252, 26, 18, 0); flagLine(480, 96, 894, 252, 26, 18, 3); flagLine(84, 262, 372, 266, 14, 14, 5); flagLine(588, 266, 876, 262, 14, 14, 1);
  // neon sign + marquee
  const nf = on ? 0.75 + pu * 0.35 : 0.6 + 0.05 * Math.sin(S.t * 7);
  neonText('Shore Club', 480, 214, 38, '#ff3d7f', nf);
  neonPath([420, 240, 540, 240], '#3ddcff', nf * 0.9, 2.2);
  rect(398, 270, 164, 34, '#101320', { lw: 2 }); if (!MARK) rect(401, 273, 158, 28, '#f1ead2');
  txt('TONIGHT', 480, 279, 9, MARK ? INK : '#7a1d22', { bold: true });
  g.font = '700 14px Georgia,serif'; let nm = act.name.toUpperCase(), fs = 14; while (g.measureText(nm).width > 150 && fs > 7) { fs -= 0.5; g.font = `700 ${fs}px Georgia,serif`; } txt(nm, 480, 293, fs, MARK ? INK : '#16130f', { bold: true });
  for (let i = 0; i < 14; i++) bulb(400 + i * 12, 268, 1.6, '#ffe7a0', on ? 0.55 + 0.45 * Math.cos(i - S.beat * 3) : 0.6);
  for (let i = 0; i < 14; i++) bulb(400 + i * 12, 306, 1.6, '#ffe7a0', on ? 0.55 + 0.45 * Math.cos(i + S.beat * 3) : 0.6);
  // red doors with brass portholes
  rect(436, 322, 88, 92, '#f1ece0', { lw: 2 });
  [[442, 459], [481, 518]].forEach(([x0, x1], d) => {
    rect(x0, 328, x1 - x0, 86, '#a4161a', { lw: 2 });
    if (!MARK) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x0 + (d ? 0 : x1 - x0 - 6), 328, 6, 86); }
    rect(x0 + 6, 386, x1 - x0 - 12, 20, '#8a1016', { lw: 1.2 });
    const cx = (x0 + x1) / 2, cy = 352; porthole(cx, cy, 13, act.cols[d % act.cols.length], on, pu, d);
    ell(d ? x0 + 6 : x1 - 6, 372, 2.4, 2.4, '#d9a531', { lw: 1 });
  });
  glow(480, 352, 70, act.cols[0], 0.25 + pu * 0.35);
  // wide front steps with the big lobster painted on them
  for (let i = 0; i < 7; i++) { const x0 = 428 - i * 9, x1 = 532 + i * 9, y0 = 414 + i * 10; poly([x0, y0, x1, y0, x1, y0 + 10, x0, y0 + 10], i % 2 ? '#a4a29a' : '#b4b2aa', { lw: 1.4 }); if (!MARK) { g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x0, y0 + 8.5, x1 - x0, 1.5); } }
  lobster(480, 446, 1.12, '#e0342b');
  if (!MARK) { g.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 7; i++) g.fillRect(430, 422 + i * 10, 100, 1.2); }
  ln(428, 414, 370, 484, '#e8e8e8', 3, { mw: 2 }); ln(532, 414, 590, 484, '#e8e8e8', 3, { mw: 2 });
  // cars, pole
  car(118, 462, 1.25, '#2a4a5a'); car(700, 462, 1.2, '#6a5a2a', 'truck'); car(-70, 540, 2.0, '#5a2a2a', 'truck'); car(800, 545, 1.95, '#3a3a52');
  lightPole(930, 520, 300, '#ffb35a');
  // people
  buildCrowd(); drawCrowd(amb, '#ffc27a');
  vignette();
}
function sceneDeck() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#0a1430', k: 0.42 };
  skyGrad(['#040919', '#0b1638', '#1d2958', '#3a3466'], 250); stars(230, 1); moon(690, 92, 24);
  spruceLine('d-shore', 236, 34, '#07101f', 0, W, { h: 6 });
  if (!MARK) for (let i = 0; i < 9; i++) { const x = 60 + i * 101 + (i % 3) * 17; glow(x, 232 - (i % 2) * 6, 7, '#ffd890', 0.6 + 0.2 * Math.sin(S.t + i)); }
  water(246, 372, '#0b1a3c', '#163063', [[690, '#fff3c4', 0.7, 14], [120, '#ffcf7a', 0.4, 8], [880, '#ffcf7a', 0.4, 8]]);
  // boats
  [[230, 286, 0.7], [520, 300, 0.9], [820, 278, 0.6]].forEach(([x, y, s], i) => { const bob = Math.sin(S.t * 0.8 + i) * 2; poly([x - 30 * s, y + bob, x + 34 * s, y + bob, x + 24 * s, y + 9 * s + bob, x - 22 * s, y + 9 * s + bob], '#c9cdd6', { h: 6 }); ln(x, y + bob, x, y - 60 * s + bob, '#c9cdd6', 1.6, { mw: 1.4 }); poly([x + 2, y - 56 * s + bob, x + 2, y - 4 + bob, x + 28 * s, y - 4 + bob], '#e8ebf0', { lw: 1.2 }); bulb(x, y - 62 * s + bob, 1.4, '#ffffff', 0.8); bulb(x - 24 * s, y + 2 + bob, 1.2, '#ff3b3b', 0.7); });
  const bl = Math.floor(S.t * 0.8) % 2; bulb(380, 318, 2, bl ? '#3dff6b' : '#103010', bl ? 1 : 0.1);
  // the hall wall at left
  poly([0, 60, 70, 90, 70, 440, 0, 460], '#b9bcc4'); if (!MARK) { g.fillStyle = 'rgba(10,16,48,.5)'; path([0, 60, 70, 90, 70, 440, 0, 460], true); g.fill(); }
  rect(10, 200, 50, 190, '#f1ece0', { lw: 2 }); rect(15, 206, 40, 184, '#a4161a', { lw: 2 }); porthole(35, 250, 12, act.cols[0], on, pu, 3); ell(50, 310, 2.4, 2.4, '#d9a531', { lw: 1 });
  neonText('Tonight', 120, 120, 22, '#ff3d7f', on ? 0.7 + pu * 0.4 : 0.55); neonText(act.name, 120, 150, 15, act.cols[0], on ? 0.75 + pu * 0.3 : 0.5, "'Pacifico',cursive", 'center', 190);
  // posts + string lights
  [[60, 40], [340, 54], [640, 54], [930, 40]].forEach(([x, y]) => ln(x, 420, x, y, '#3a2a1e', 6, { mw: 3 }));
  stringLights(60, 46, 340, 58, 60, 18, WARM, 2.8); stringLights(340, 58, 640, 58, 60, 18, WARM, 2.8, 2); stringLights(640, 58, 930, 46, 60, 18, WARM, 2.8, 1);
  stringLights(60, 90, 640, 96, 50, 26, PARTY, 2.2); stringLights(340, 96, 930, 90, 50, 26, PARTY, 2.2, 3);
  // railing
  rect(0, 356, W, 7, '#6a4a32', { lw: 1.6 }); rect(0, 392, W, 5, '#5a3e2a', { lw: 1.4 });
  for (let x = 6; x < W; x += 16) ln(x, 363, x, 420, '#4a3322', 3, { mw: 1.4 });
  for (let x = 60; x < W; x += 140) rect(x - 5, 352, 10, 70, '#5a3e2a', { lw: 1.6 });
  // deck floor
  poly([0, 420, W, 420, W, H, 0, H], '#3e2c20', { h: 0 });
  if (!MARK) { g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.beginPath(); for (let i = -12; i <= 12; i++) { g.moveTo(480 + i * 46, 420); g.lineTo(480 + i * 120, H); } g.stroke(); g.fillStyle = 'rgba(255,200,120,.05)'; g.fillRect(0, 420, W, 120); }
  else { g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); for (let i = -12; i <= 12; i++) { g.moveTo(480 + i * 46, 420); g.lineTo(480 + i * 120, H); } g.stroke(); }
  // bar
  buildCrowd(); drawCrowd(amb, '#ffd9a0', (sl) => sl.bartender);
  poly([0, 386, 214, 392, 214, 480, 0, 486], '#5a3a26', { h: 6 }); poly([0, 380, 222, 386, 214, 394, 0, 388], '#8a5a36', { lw: 1.6 });
  neonText('BAR', 100, 420, 22, '#3ddcff', on ? 0.75 + pu * 0.3 : 0.6, "'Monoton','Impact',sans-serif");
  for (let i = 0; i < 6; i++) { const bx = 30 + i * 30; rect(bx, 368, 6, 14, ['#2a6a3a', '#7a3a1a', '#d9d2c0'][i % 3], { lw: 1 }); }
  // tables
  drawCrowd(amb, '#ffd9a0', (sl) => !sl.bartender && sl.y < 500 && !sl.table);
  [[360, 470], [600, 505], [820, 462]].forEach(([x, y]) => { drawCrowd(amb, '#ffd9a0', (sl) => sl.table && sl.table[0] === x); ell(x, y - 30, 40, 9, '#6a4a32', { lw: 1.6 }); ln(x, y - 26, x, y + 6, '#3a2a1e', 5, { mw: 2.4 }); rect(x - 4, y - 44, 8, 10, '#e8e2d0', { lw: 1 }); glow(x, y - 42, 30, '#ffb35a', 0.6 + 0.15 * Math.sin(S.t * 9 + x)); bulb(x, y - 40, 1.6, '#ffcf7a', 0.9); });
  drawCrowd(amb, '#ffd9a0', (sl) => !sl.bartender && sl.y >= 500 && !sl.table);
  vignette();
}
function sceneInside() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#24140c', k: 0.28 }, light = act.cols[0];
  // ceiling, walls
  poly([0, 0, W, 0, 810, 60, 150, 60], '#2a1a10', { h: 7 });
  poly([0, 0, 150, 60, 150, 340, 0, 540], '#4a3020', { h: 9, ha: 1.1 }); poly([W, 0, 810, 60, 810, 340, W, 540], '#4a3020', { h: 9, ha: 2 });
  rect(150, 60, 660, 280, '#3a2418', { h: 10 });
  if (!MARK) { g.fillStyle = 'rgba(0,0,0,.18)'; for (let x = 160; x < 810; x += 22) g.fillRect(x, 60, 2, 280); }
  // beams
  for (let i = 0; i <= 8; i++) { const x = 150 + i * 82.5; ln(x, 60, (x - 480) * 2.9 + 480, 0, '#1a0f08', 5, { mw: 2 }); }
  [[8, 0.2], [26, 0.55], [46, 0.85]].forEach(([y, k]) => rect(150 * k - 0, y, W - 300 * k, 6, '#1d120a', { lw: 1.4 }));
  // side windows (night) with string lights
  [[30, 150, 110, 250], [850, 150, 930, 250]].forEach(([x0, y0, x1, y1], i) => { const pts = i ? [x0, y0 + 10, x1, y0 - 18, x1, y1 + 30, x0, y1 + 6] : [x0, y0 - 18, x1, y0 + 10, x1, y1 + 6, x0, y1 + 30]; poly(pts, '#0c1838', { lw: 2 }); if (!MARK) { glow((x0 + x1) / 2, y0 + 20, 18, '#fff3c4', 0.3); } });
  stringLights(0, 30, 150, 70, 22, 10, WARM, 2.2); stringLights(810, 70, W, 30, 22, 10, WARM, 2.2, 1);
  // traps, nets, buoys on side walls
  [[20, 300, 1], [870, 300, -1]].forEach(([x, y, d]) => { rect(x, y, 70, 36, '#6a5030', { lw: 1.6 }); g.strokeStyle = MARK ? INK : '#2a1a10'; g.lineWidth = 1.4; g.beginPath(); for (let k = 1; k < 6; k++) { g.moveTo(x + k * 12, y); g.lineTo(x + k * 12, y + 36); } g.moveTo(x, y + 18); g.lineTo(x + 70, y + 18); g.stroke(); ['#e63946', '#f4a261', '#2a9d8f', '#f1fa8c'].forEach((c, k) => { ln(x + 10 + k * 16, y - 12, x + 10 + k * 16, y - 2, '#333', 1, { mw: 1 }); ell(x + 10 + k * 16, y - 18 - (k % 2) * 4, 5, 8, c, { lw: 1.2 }); }); void d; });
  g.strokeStyle = MARK ? INK : 'rgba(210,190,150,.35)'; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 9; k++) { g.moveTo(10 + k * 14, 90 + k * 4); g.quadraticCurveTo(60, 170, 20 + k * 12, 260); g.moveTo(W - 10 - k * 14, 90 + k * 4); g.quadraticCurveTo(W - 60, 170, W - 20 - k * 12, 260); } for (let k = 0; k < 7; k++) { g.moveTo(8, 110 + k * 22); g.lineTo(130, 120 + k * 22); g.moveTo(W - 8, 110 + k * 22); g.lineTo(W - 130, 120 + k * 22); } g.stroke();
  // stage: proscenium, curtain, bunting
  rect(220, 66, 520, 236, '#140a10', { h: 5, ink: false });
  if (!MARK) { for (let x = 226; x < 736; x += 18) { const gr = g.createLinearGradient(x, 0, x + 18, 0); gr.addColorStop(0, '#2a0a18'); gr.addColorStop(0.5, '#4a1226'); gr.addColorStop(1, '#2a0a18'); g.fillStyle = gr; g.fillRect(x, 70, 18, 230); } }
  else { g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); for (let x = 232; x < 736; x += 18) { g.moveTo(x, 72); g.quadraticCurveTo(x + 4, 190, x, 298); } g.stroke(); }
  rect(206, 60, 548, 14, '#6a4a2a', { lw: 1.8 }); rect(206, 60, 14, 246, '#6a4a2a', { lw: 1.8 }); rect(740, 60, 14, 246, '#6a4a2a', { lw: 1.8 });
  flagLine(220, 76, 480, 78, 22, 14, 2); flagLine(480, 78, 740, 76, 22, 14, 5);
  const nf = on ? 0.75 + pu * 0.4 : 0.5;
  neonText(act.name, 480, 130, 30, act.cols[0], nf, "'Pacifico',cursive", 'center', 440);
  neonPath([300, 158, 660, 158], act.cols[1], nf * 0.8, 2);
  if (act.k === 'dj') lighthouseBeam(480, 180, 700);
  // stage floor
  poly([226, 300, 734, 300, 760, 322, 200, 322], '#5a3a22', { lw: 1.8 }); poly([200, 322, 760, 322, 760, 342, 200, 342], '#2a180c', { h: 5 });
  for (let i = 0; i < 12; i++) bulb(212 + i * 49, 332, 2, '#ffe7a0', on ? 0.5 + 0.5 * Math.cos(i - S.beat * 2) : 0.5);
  drawBand(480, 304, 380, 0.66, amb, light);
  stageLights(250, 710, 72, 330, 1);
  // floor
  poly([150, 342, 810, 342, 960, 540, 0, 540], '#6a4428');
  if (!MARK) { const gr = g.createLinearGradient(0, 342, 0, 540); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(255,190,120,.06)'); g.fillStyle = gr; path([150, 342, 810, 342, 960, 540, 0, 540], true); g.fill(); g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1; g.beginPath(); for (let i = -20; i <= 20; i++) { g.moveTo(480 + i * 16.5, 342); g.lineTo(480 + i * 24, 540); } g.stroke(); act.cols.forEach((c, i) => { glow(320 + i * 160, 420 + (i % 2) * 40, 120, c, 0.12 + pu * 0.12); }); }
  else { g.strokeStyle = INK; g.lineWidth = 0.9; g.beginPath(); for (let i = -20; i <= 20; i += 2) { g.moveTo(480 + i * 16.5, 342); g.lineTo(480 + i * 24, 540); } for (let y = 360; y < 540; y += 26) { g.moveTo(150 - (y - 342) * 0.76, y); g.lineTo(810 + (y - 342) * 0.76, y); } g.stroke(); }
  // hanging gulls (they fly over everybody)
  buildCrowd();
  drawCrowd(amb, light, (sl) => !sl.table);
  [[95, 432], [70, 508], [865, 432], [890, 508]].forEach(([x, y]) => { drawCrowd(amb, light, (sl) => sl.table && sl.table[0] === x && sl.table[1] === y); const w = y > 470 ? 62 : 52; gingPoly([x - w, y - 30, x + w, y - 30, x + w + 6, y - 6, x - w - 6, y - 6], true); rect(x - w - 6, y - 6, (w + 6) * 2, 18, '#2a180c', { lw: 1.4 }); rect(x - 4, y - 44, 8, 12, '#e8e2d0', { lw: 1 }); glow(x, y - 42, 30, '#ffb35a', 0.55); bulb(x, y - 41, 1.6, '#ffcf7a', 0.9); });
  [[230, 96], [330, 120], [420, 84], [540, 110], [640, 90], [740, 124], [180, 150], [800, 160], [480, 170]].forEach(([x, y], i) => hangingGull(x, y + Math.sin(S.t * 0.7 + i) * 3, 0.9 + (i % 3) * 0.12, S.t * 0.3 + i * 1.3));
  if (act.k === 'funk' || act.k === 'dj') mirrorBall(480, 40, 16);
  vignette();
}
function sceneShore() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#2e1a3a', k: 0.38 }, light = '#ff9a5c';
  skyGrad(['#1b1240', '#4a2266', '#c2426e', '#ff8a4c', '#ffc46b'], 256); stars(90, 0.6);
  if (!MARK) { glow(300, 236, 170, '#ff9a4c', 0.7); ell(300, 236, 32, 32, '#ffe08a'); } else { ell(300, 236, 32, 32, PAPER, { lw: 2 }); glow(300, 236, 80, '#ff9a4c', 0.6); for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; ln(300 + Math.cos(a) * 42, 236 + Math.sin(a) * 42, 300 + Math.cos(a) * 58, 236 + Math.sin(a) * 58, INK, 1.6); } }
  [[120, 120, 1.1], [700, 90, 1.4], [520, 160, 0.8]].forEach(([x, y, s], i) => { const xx = (x + S.t * 3 * (i + 1)) % (W + 200) - 100; if (!MARK) { g.globalAlpha = 0.55; g.fillStyle = '#ff9fb0'; g.beginPath(); g.ellipse(xx, y, 70 * s, 8 * s, 0, 0, 7); g.fill(); g.globalAlpha = 1; } else { ln(xx - 60 * s, y, xx + 60 * s, y, INK, 1.4); } });
  spruceLine('s-shore', 244, 40, '#1c1030', 0, W, { h: 7 });
  water(252, 336, '#5a2c58', '#1e1a40', [[300, '#ffc46b', 0.8, 22]]);
  ground(332, H, '#1e3024', '#0f1a14');
  if (!MARK) { const r = RNG(11); g.strokeStyle = 'rgba(120,170,110,.18)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 260; i++) { const x = r() * W, y = 336 + r() * 200; g.moveTo(x, y); g.lineTo(x + 1, y - 4 - r() * 4); } g.stroke(); }
  // Shore Club side at left
  poly([0, 150, 190, 196, 190, 360, 0, 370], '#c9cbd0', { h: 0 }); if (!MARK) { g.fillStyle = 'rgba(46,26,58,.45)'; path([0, 150, 190, 196, 190, 360, 0, 370], true); g.fill(); }
  poly([0, 132, 200, 186, 190, 198, 0, 150], '#2a3140', { h: 7 });
  for (let i = 0; i < 2; i++) { rect(30 + i * 80, 236 + i * 8, 44, 60, '#2a1c10'); if (!MARK) { g.globalAlpha = 0.6 + pu * 0.3; g.fillStyle = '#ffb35a'; g.fillRect(33 + i * 80, 239 + i * 8, 38, 54); g.globalAlpha = 1; } glow(52 + i * 80, 266, 40, act.cols[0], 0.3); }
  neonText('Shore Club', 90, 178, 22, '#ff3d7f', on ? 0.7 + pu * 0.3 : 0.55);
  // outdoor stage on the cove
  const sx0 = 560, sx1 = 910;
  ln(570, 334, 570, 150, '#7a7f8a', 5, { mw: 2.6 }); ln(900, 334, 900, 150, '#7a7f8a', 5, { mw: 2.6 });
  poly([550, 152, 920, 152, 900, 120, 570, 120], '#1d2547', { h: 0 });
  poly([550, 152, 920, 152, 735, 92], '#2a3260', { lw: 2 });
  neonText('ON THE COVE', 735, 136, 14, '#3ddcff', on ? 0.8 + pu * 0.3 : 0.6, "'Monoton','Impact',sans-serif", 'center', 300);
  rect(574, 162, 322, 170, '#120a1a', MARK ? { skip: true } : null);
  poly([548, 330, 922, 330, 930, 352, 540, 352], '#5a3a22', { lw: 1.8 }); rect(540, 352, 390, 16, '#2a180c', { h: 5 });
  neonText(act.name, 735, 186, 18, act.cols[0], on ? 0.75 + pu * 0.35 : 0.5, "'Pacifico',cursive", 'center', 300);
  drawBand(735, 332, 240, 0.6, amb, act.cols[0]);
  stageLights(590, 880, 160, 340, 1);
  if (act.k === 'dj') lighthouseBeam(735, 210, 600);
  // lights across the lawn
  stringLights(190, 200, 570, 160, 60, 26, WARM, 2.6); stringLights(0, 210, 570, 176, 90, 30, PARTY, 2.2, 2); stringLights(900, 160, W, 190, 20, 4, WARM, 2.6);
  // lawn chairs + blankets
  [[60, 505], [150, 520], [240, 510]].forEach(([x, y], i) => poly([x - 44, y - 2, x + 44, y - 6, x + 50, y + 16, x - 50, y + 20], ['#c8102e', '#1d4e89', '#f2c14e'][i], MARK ? { h: 6 } : null));
  buildCrowd(); drawCrowd(amb, light);
  vignette();
}
function waves(y0, y1, day) {
  const T = 7;
  for (let k = 0; k < 4; k++) {
    const ph = ((S.t / T) + k / 4) % 1, y = y0 + 10 + Math.pow(ph, 1.6) * (y1 - y0 - 10), a = Math.sin(ph * Math.PI);
    const amp = 1 + ph * 4;
    g.beginPath(); for (let x = -10; x <= W + 10; x += 20) { const yy = y + Math.sin(x * 0.012 + k * 2 + S.t * 0.3) * amp; x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); }
    if (MARK) { g.strokeStyle = INK; g.lineWidth = 1 + ph * 2; g.stroke(); }
    else { g.lineTo(W + 10, y + 6 + ph * 10); g.lineTo(-10, y + 6 + ph * 10); g.closePath(); g.fillStyle = day ? `rgba(120,210,220,${0.25 * a})` : `rgba(90,120,170,${0.18 * a})`; g.fill(); g.beginPath(); for (let x = -10; x <= W + 10; x += 20) { const yy = y + Math.sin(x * 0.012 + k * 2 + S.t * 0.3) * amp; x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.strokeStyle = `rgba(255,255,255,${(day ? 0.75 : 0.45) * a})`; g.lineWidth = 1 + ph * 3; g.stroke(); }
  }
  // the wash running up the sand
  const ph = (S.t / T) % 1, reach = Math.sin(clamp(ph * 1.3, 0, 1) * Math.PI);
  const pts = [-10, y1]; for (let x = -10; x <= W + 10; x += 24) pts.push(x, y1 + 6 + reach * 26 + Math.sin(x * 0.03 + S.t) * 4 * reach); pts.push(W + 10, y1);
  if (MARK) { path(pts.slice(2, -2), false); g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke(); g.fillStyle = INK; for (let i = 2; i < pts.length - 2; i += 4) g.fillRect(pts[i] + 6, pts[i + 1] - 3, 2, 2); }
  else { path(pts, true); g.fillStyle = day ? 'rgba(230,250,250,.55)' : 'rgba(170,190,220,.25)'; g.fill(); path(pts.slice(2, -2), false); g.strokeStyle = day ? 'rgba(255,255,255,.95)' : 'rgba(220,230,255,.6)'; g.lineWidth = 2.5; g.stroke(); }
}
function sceneBeach(night) {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0;
  const amb = night ? { col: '#081028', k: 0.48 } : { col: '#ffffff', k: 0 }, light = night ? '#ffb070' : '#fff4d6';
  if (night) { skyGrad(['#030714', '#0a1534', '#1a2452'], 205); stars(190, 1); moon(760, 70, 22); }
  else { skyGrad(['#3d9be0', '#7cc4ee', '#c4e8f6'], 205); if (!MARK) { glow(180, 70, 120, '#fff6c8', 0.7); ell(180, 70, 26, 26, '#fffbe6'); } else { ell(180, 70, 26, 26, PAPER, { lw: 2 }); glow(180, 70, 60, '#ffd84a', 0.6); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + S.t * 0.1; ln(180 + Math.cos(a) * 34, 70 + Math.sin(a) * 34, 180 + Math.cos(a) * 46, 70 + Math.sin(a) * 46, INK, 1.6); } } [[100, 60, 0.9], [420, 90, 0.7], [640, 50, 1.1], [860, 110, 0.6]].forEach(([x, y, s], i) => cloud((x + S.t * (4 + i)) % (W + 300) - 120, y, s)); }
  // far headland with the hall and spruce
  spruceLine(night ? 'b-head-n' : 'b-head', 196, 34, night ? '#060c1c' : '#2f5a3a', 560, W, { h: 6 });
  poly([0, 206, 0, 178, 120, 172, 220, 190, 300, 206], night ? '#0a1222' : '#3e6a46', { h: 7 });
  rect(40, 160, 90, 22, night ? '#3a3f4a' : '#d8dade', { lw: 1.4 }); poly([34, 162, 85, 144, 136, 162], night ? '#1a1f2a' : '#7a1d22', { lw: 1.4 });
  if (night) { for (let i = 0; i < 4; i++) bulb(50 + i * 22, 172, 1.4, '#ffcf7a', 0.8); neonText('Shore Club', 85, 152, 10, '#ff3d7f', 0.7); } else txt('SHORE CLUB', 85, 154, 7, '#f4f1de', { bold: true });
  water(204, 350, night ? '#06122c' : '#1f6fae', night ? '#10264a' : '#3fb4c6', night ? [[760, '#fff3c4', 0.7, 14]] : [[180, '#ffffff', 0.5, 18]]);
  if (!MARK) { const gr = g.createLinearGradient(0, 348, 0, H); gr.addColorStop(0, night ? '#2a2a3a' : '#bfa26a'); gr.addColorStop(0.12, night ? '#3a3040' : '#e2c487'); gr.addColorStop(1, night ? '#2a2230' : '#d9b26a'); g.fillStyle = gr; g.fillRect(0, 348, W, H - 348); }
  waves(206, 350, !night);
  if (MARK) { g.fillStyle = INK; const r = RNG(4); for (let i = 0; i < 160; i++) g.fillRect(r() * W, 392 + r() * 148, 1.4, 1.4); }
  poly([0, 330, 70, 300, 170, 312, 240, 340, 280, 392, 0, 392], night ? '#2a2a34' : '#d9bd80', { h: 0 });
  g.strokeStyle = MARK ? INK : (night ? '#1e2a24' : '#7a8a4a'); g.lineWidth = 1.2; g.beginPath(); const r2 = RNG(21); for (let i = 0; i < 70; i++) { const x = r2() * 250, y = 318 + r2() * 60, l = 8 + r2() * 12, sw = Math.sin(S.t * 1.5 + i) * 2; g.moveTo(x, y); g.quadraticCurveTo(x + 2, y - l * 0.6, x + 3 + sw, y - l); } g.stroke();
  // beach stage
  const sx = 255; ln(sx - 135, 404, sx - 135, 290, '#7a5a3a', 5, { mw: 2.4 }); ln(sx + 135, 404, sx + 135, 290, '#7a5a3a', 5, { mw: 2.4 });
  if (night) stringLights(sx - 135, 296, sx + 135, 296, 18, 18, PARTY, 2.4);
  for (let i = 0; i < 9; i++) poly([sx - 145 + i * 32.2, 296, sx - 145 + (i + 1) * 32.2, 296, sx - 145 + (i + 1) * 32.2, 284, sx - 145 + i * 32.2, 284], i % 2 ? '#f4f1de' : (night ? '#3a6aa0' : '#e94e4e'), { lw: 1.2 });
  for (let i = 0; i < 9; i++) poly([sx - 145 + i * 32.2, 296, sx - 145 + (i + 1) * 32.2, 296, sx - 145 + (i + 0.5) * 32.2, 306], i % 2 ? '#f4f1de' : (night ? '#3a6aa0' : '#e94e4e'), { lw: 1.2 });
  poly([sx - 150, 400, sx + 150, 400, sx + 158, 414, sx - 158, 414], '#8a6a46', { lw: 1.6 }); rect(sx - 158, 414, 316, 12, '#5a4028', { h: 5 });
  neonText(act.name, sx, 316, 14, act.cols[0], night ? (on ? 0.8 + pu * 0.3 : 0.55) : 0.5, "'Pacifico',cursive", 'center', 250);
  drawBand(sx, 402, 200, 0.68, amb, night ? act.cols[0] : light);
  if (night) stageLights(sx - 120, sx + 120, 300, 420, 0.9);
  if (act.k === 'dj' && night) lighthouseBeam(sx, 340, 500);
  if (night) {
    stringLights(0, 250, 520, 240, 50, 30, WARM, 2.6, 0); stringLights(520, 240, W, 262, 40, 24, PARTY, 2.4, 1);
    ln(520, 470, 520, 240, '#4a3a2a', 4, { mw: 2.4 }); ln(940, 470, 940, 262, '#4a3a2a', 4, { mw: 2.4 });
    // bonfire
    const fx = 660, fy = 486; buildCrowd(); drawCrowd(amb, light, (sl) => sl.y < fy);
    ln(fx - 26, fy + 6, fx + 24, fy - 4, '#3a2416', 7, { mw: 3 }); ln(fx - 22, fy - 4, fx + 26, fy + 6, '#3a2416', 7, { mw: 3 });
    glow(fx, fy - 20, 150, '#ff8a3d', 0.55 + pu * 0.2);
    for (let i = 0; i < 6; i++) { const h = 30 + 18 * Math.sin(S.t * 7 + i * 1.7) + pu * 10, w = 12 - i; const pts = [fx - w - 8 + i * 3, fy, fx + Math.sin(S.t * 5 + i) * 6 + (i - 3) * 3, fy - h, fx + w + 8 - i * 3, fy]; path(pts, true); g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.fillStyle = ['#ff5a1f', '#ff8a3d', '#ffb347', '#ffd27a', '#fff1b0', '#ff7a2a'][i]; g.globalAlpha = 0.75; g.fill(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
    for (let i = 0; i < 14; i++) { const k = ((S.t * 0.6 + i / 14) % 1); bulb(fx + Math.sin(i * 7 + S.t * 2) * 20 * k, fy - 40 - k * 120, 1.1, '#ffd27a', 1 - k); }
    // candles in jars
    const r3 = RNG(8); for (let i = 0; i < 16; i++) { const x = 40 + i * 58 + r3() * 20, y = 520 + r3() * 14; if (Math.abs(x - fx) < 50 && y < 510) continue; rect(x - 5, y - 12, 10, 12, MARK ? PAPER : 'rgba(200,220,255,.25)', { lw: 1.2 }); const fl = 0.75 + 0.25 * Math.sin(S.t * 11 + i * 3); glow(x, y - 9, 26, '#ffb35a', fl * 0.7); bulb(x, y - 9, 1.6, '#ffd27a', fl); }
    // party lanterns
    [[560, 300], [640, 296], [720, 300], [800, 306], [880, 314]].forEach(([x, y], i) => { const [cx2, cy2] = [x, y + Math.sin(S.t + i) * 2]; ln(x, y - 14, cx2, cy2 - 8, '#222', 1, { mw: 1 }); ell(cx2, cy2, 8, 10, PARTY[i], { lw: 1.4 }); glow(cx2, cy2, 30, PARTY[i], on ? 0.5 + pu * 0.4 : 0.45); });
  } else {
    // umbrellas, towels, sandcastle, swimmers and gulls
    [[640, 452, '#e94e4e'], [770, 468, '#2a9d8f'], [890, 448, '#f2c14e']].forEach(([x, y, c]) => { ln(x, y + 20, x + 6, y - 50, '#ddd', 2.4, { mw: 2 }); poly([x - 46, y - 40, x + 6, y - 62, x + 58, y - 36, x + 6, y - 46], c, { lw: 1.8 }); if (!MARK) poly([x - 20, y - 49, x + 6, y - 62, x + 14, y - 44], '#f4f1de'); poly([x - 40, y + 26, x + 30, y + 22, x + 40, y + 40, x - 30, y + 44], ['#3d5a80', '#ef476f', '#06d6a0'][(x / 10 | 0) % 3], { lw: 1.4 }); });
    poly([540, 520, 560, 492, 580, 520], '#c9a35a', { lw: 1.4 }); rect(548, 506, 24, 14, '#c9a35a', { lw: 1.4 }); ln(560, 492, 560, 480, '#333', 1, { mw: 1 }); poly([560, 480, 570, 484, 560, 488], '#e94e4e', { lw: 1 });
    [[430, 300], [520, 316], [700, 290], [810, 322]].forEach(([x, y], i) => { const bob = Math.sin(S.t * 1.5 + i) * 2; ell(x, y + bob, 5, 5.5, SKIN[i + 1]); if (!MARK) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y + 5 + bob, 9, 2, 0, 0, 7); g.stroke(); } });
    for (let i = 0; i < 5; i++) { const x = (i * 210 + S.t * (18 + i * 4)) % (W + 80) - 40, y = 120 + Math.sin(S.t * 0.5 + i * 2) * 30 + i * 12; gull(x, y, 0.8 + (i % 2) * 0.3, S.t * 7 + i, '#f4f4f4'); }
  }
  buildCrowd(); drawCrowd(amb, light, night ? (sl) => sl.y >= 486 : null);
  vignette();
}
function vignette() { if (MARK) return; const v = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }

/* ---------------- tag a dancer ---------------- */
let TAG = null;
cv.addEventListener('click', (e) => {
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
  let best = null, bd = 1e9; for (const sl of CROWD) { if (sl.hx == null) continue; const d = Math.hypot(sl.hx - x, (sl.hy + 30 * sl.hs) - y); if (d < 46 * sl.hs && d < bd) { bd = d; best = sl; } }
  TAG = best ? { sl: best, until: S.t + 4 } : null;
});
function drawTag() {
  if (!TAG || S.t > TAG.until || !CROWD.includes(TAG.sl)) return; const sl = TAG.sl, x = sl.hx, y = sl.hy - 18 * sl.hs;
  g.font = '700 14px Georgia,serif'; const a = sl.p.name, b = sl.p.quirk; g.font = '700 14px Georgia,serif'; const w1 = g.measureText(a).width; g.font = 'italic 12px Georgia,serif'; const w = Math.max(w1, g.measureText(b).width) + 20, bx = clamp(x - w / 2, 6, W - w - 6), by = clamp(y - 48, 6, H - 50);
  g.fillStyle = MARK ? PAPER : 'rgba(8,12,30,.88)'; g.fillRect(bx, by, w, 42); g.strokeStyle = MARK ? INK : '#ffcf6e'; g.lineWidth = 1.5; g.strokeRect(bx, by, w, 42);
  txt(a, bx + w / 2, by + 14, 14, MARK ? INK : '#ffe9b0', { bold: true }); txt(b, bx + w / 2, by + 30, 12, MARK ? INK : '#c9d6ff', { font: 'Georgia,serif' });
}

/* ---------------- main loop ---------------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; S.t += dt; beatTick(dt);
  MARK = S.mark; BOIL = Math.floor(S.t * 7) % 3;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  if (MARK) g.drawImage(paper, 0, 0); else { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); }
  try {
    switch (S.scene) { case 'outside': sceneOutside(); break; case 'deck': sceneDeck(); break; case 'inside': sceneInside(); break; case 'shore': sceneShore(); break; case 'beachDay': sceneBeach(false); break; case 'beachNight': sceneBeach(true); break; }
  } catch (e) { if (!frame.err) { frame.err = 1; console.error('Shore Club scene error', e); } }
  if (S.flash > 0.01) { g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.fillStyle = MARK ? `rgba(255,45,85,${S.flash * 0.25})` : `rgba(255,255,255,${S.flash * 0.35})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; S.flash *= 0.8; }
  titleCard(); drawTag();
  if (!S.playing && S.cur < 0 && S.t - S.title > 4.5) { g.font = 'italic 16px Georgia,serif'; g.textAlign = 'center'; g.fillStyle = MARK ? INK : 'rgba(255,233,176,.85)'; g.fillText('Press \u25b6 Play and the band takes the stage', W / 2, H - 22); }
  requestAnimationFrame(frame);
}

/* ---------------- beat ---------------- */
let micA = null;
function beatTick(dt) {
  if (!S.playing) { S.energy *= 0.96; return; }
  const spb = 60 / S.bpm; S.beat += dt / spb;
  if (Math.floor(S.beat) !== S.beatN) S.beatN = Math.floor(S.beat);
  const ph = S.beat % 1;
  let e = 0.45 + 0.4 * Math.exp(-ph * 5) + 0.15 * Math.sin(S.t * 0.7);
  if (micA) { micA.an.getFloatTimeDomainData(micA.buf); let s = 0; for (const v of micA.buf) s += v * v; const rms = Math.sqrt(s / micA.buf.length); micA.avg = micA.avg * 0.995 + rms * 0.005; e = clamp(rms / Math.max(0.02, micA.avg * 2), 0, 1.2); }
  S.energy = S.energy * 0.8 + e * 0.2;
}

/* ---------------- scene + act UI ---------------- */
function setScene(k) {
  if (k === 'beach') k = S.scene === 'beachDay' || S.scene === 'beachNight' ? S.scene : (rnd() < 0.5 ? 'beachDay' : 'beachNight');
  S.scene = k; S.title = S.t; TAG = null; save(); syncUI();
}
function setAct(i) { S.act = i; CROWD_KEY = ''; S.title = S.t; save(); syncUI(); }
function syncUI() {
  const beach = S.scene === 'beachDay' || S.scene === 'beachNight';
  root.querySelectorAll('[data-scn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scn === S.scene || (b.dataset.scn === 'beach' && beach))));
  const dn = $('#shr-dn'); dn.hidden = !beach; dn.textContent = S.scene === 'beachNight' ? '\u2600 Make it day' : '\u{1F319} Make it night';
  root.querySelectorAll('[data-act]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.act === S.act)));
  $('#shr-mark').setAttribute('aria-pressed', String(S.mark)); $('#shr-fmark').textContent = S.mark ? '\u{1F308}' : '\u{1F58A}';
  $('#shr-fscn').value = S.scene; $('#shr-fact').value = String(S.act);
  const a = ACTS[S.act]; $('#shr-actname').textContent = a.emo + ' ' + a.name; $('#shr-blurb').innerHTML = `<b>${esc(a.name)}</b> (${esc(a.genre)}): ${esc(a.tag)}. ${esc(SCENES[S.scene].t)}: ${esc(SCENES[S.scene].s)}.`;
}
root.querySelectorAll('[data-scn]').forEach((b) => b.addEventListener('click', () => { if (b.dataset.scn === 'beach' && (S.scene === 'beachDay' || S.scene === 'beachNight')) { setScene(rnd() < 0.5 ? 'beachDay' : 'beachNight'); return; } setScene(b.dataset.scn); }));
$('#shr-dn').addEventListener('click', () => setScene(S.scene === 'beachNight' ? 'beachDay' : 'beachNight'));
root.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => setAct(+b.dataset.act)));
$('#shr-mark').addEventListener('click', () => { S.mark = !S.mark; save(); syncUI(); });
$('#shr-fmark').addEventListener('click', () => { S.mark = !S.mark; save(); syncUI(); });
$('#shr-fscn').addEventListener('change', function () { setScene(this.value); });
$('#shr-fact').addEventListener('change', function () { setAct(+this.value); });

/* ---------------- music sources ---------------- */
function setPlaying(p) { S.playing = p; syncQuick(); }
function songStart(title, meta) {
  S.songs.push({ title: title || `Song ${S.songs.length + 1}`, at: Date.now() });
  S.cur = S.songs.length - 1;
  S.bpm = meta && meta.bpm > 50 ? Math.min(180, meta.bpm) : 96 + Math.floor(rnd() * 40);
  $('#shr-now').textContent = '\u266b ' + (title || `Song ${S.songs.length}`) + (meta && meta.credit ? ' \u00b7 ' + meta.credit : '');
  if ($('#shr-rot').checked && S.songs.length > 1) setAct((S.act + 1 + Math.floor(rnd() * (ACTS.length - 1))) % ACTS.length);
  renderSongs(); setPlaying(true);
}
function songEnd() { setPlaying(false); }
function renderSongs() { $('#shr-songs').innerHTML = S.songs.length ? '<b>Tonight\u2019s set list:</b> ' + S.songs.map((s, i) => `${i + 1}. ${esc(s.title)}`).join(' \u00b7 ') : ''; }
let MODE = 'sp';
root.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
  root.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  root.querySelectorAll('[data-pane]').forEach((p) => p.classList.toggle('on', p.dataset.pane === b.dataset.tab));
  if (b.dataset.tab !== 'gm' && !gmau.paused) gmau.pause();
  MODE = b.dataset.tab; acctSync();
}));
function tab(name) { const b = root.querySelector(`[data-tab="${name}"]`); if (b && MODE !== name) b.click(); }

/* Spotify embed */
let api = null, apiWaiting = null, apiLoading = false, ctrl = null; const SP = { uri: null, dur: 0, pos: 0, hasUri: false, pendingPlay: false };
function toUri(t) { t = (t || '').trim(); if (/^spotify:/.test(t)) return t; const m = t.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/); return m ? `spotify:${m[1]}:${m[2]}` : null; }
function fetchTitle(uri, cb) { const m = uri && uri.match(/spotify:track:(\w+)/); if (!m) return cb(null); fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent('https://open.spotify.com/track/' + m[1])).then((r) => r.json()).then((j) => cb(j && j.title)).catch(() => cb(null)); }
function loadEmbed(uri, autoplay) {
  SP.pendingPlay = !!autoplay;
  const make = () => {
    const host = $('#shr-embed'); host.innerHTML = ''; const el = document.createElement('div'); host.appendChild(el);
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
const sel = $('#shr-pl');
sel.addEventListener('change', () => { if (sel.value) loadEmbed('spotify:playlist:' + sel.value); });
$('#shr-rand').addEventListener('click', () => { const p = pick(PLAYLISTS); sel.value = p[1]; loadEmbed('spotify:playlist:' + p[1], true); });
$('#shr-load').addEventListener('click', () => { const u = toUri($('#shr-url').value); if (u) loadEmbed(u, true); else $('#shr-now').textContent = 'That doesn\u2019t look like a Spotify link. Try Share \u2192 Copy link.'; });

/* Game music (C64 remixes, Kevin MacLeod moods, MOBYGRATIS) */
const gmau = $('#shr-gmau'); const GM = { ready: false, coll: 'c64', list: [], order: [], pos: 0, startedUid: null, pending: null };
function gmSub() { const s = $('#shr-gmsub'); s.innerHTML = ''; const o = window.LTFGM.subOptions(GM.coll); o.forEach(([v, t]) => { const op = document.createElement('option'); op.value = v; op.textContent = t; s.appendChild(op); }); s.style.display = o.length ? '' : 'none'; }
function gmFill(autoplay) { GM.list = window.LTFGM.items(GM.coll, $('#shr-gmsub').value); GM.order = GM.list.map((_, i) => i).sort(() => Math.random() - 0.5); GM.pos = 0; gmLoad(autoplay); }
function gmCur() { return GM.list[GM.order[GM.pos]]; }
function gmLoad(autoplay) {
  const x = gmCur(); if (!x) return; gmau.src = x.url; GM.startedUid = null;
  $('#shr-gmcredit').innerHTML = x.src === 'c64' ? `<b>${esc(x.title)}</b> \u00b7 remix by ${esc(x.by)}${x.credit ? ' \u00b7 ' + esc(x.credit) : ''} \u00b7 <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>` : x.mg ? `<b>${esc(x.title)}</b> \u00b7 <a href="https://mobygratis.com/" target="_blank" rel="noopener">mobygratis</a> \u00b7 Thank you, MOBYGRATIS!` : `<b>${esc(x.title)}</b> \u00b7 ${esc(x.credit)}${x.len ? ' \u00b7 ' + esc(x.len) : ''}`;
  if (autoplay) { const p = gmau.play(); if (p && p.catch) p.catch(() => {}); }
}
gmau.addEventListener('play', () => { const x = gmCur(); if (!x) return; if (MODE !== 'gm') tab('gm'); if (GM.startedUid !== x.uid) { GM.startedUid = x.uid; if (window.LTFGM.played) window.LTFGM.played(x); songStart(x.title + (x.src === 'c64' ? ' \u2014 ' + x.by : x.mg ? ' \u2014 mobygratis' : ' \u2014 Kevin MacLeod'), { bpm: parseFloat(x.bpm), credit: x.src === 'c64' ? 'remix by ' + x.by : x.mg ? 'THANK YOU, MOBYGRATIS!' : 'Kevin MacLeod, CC BY 4.0' }); } setPlaying(true); });
gmau.addEventListener('pause', () => { if (!gmau.ended) setPlaying(false); });
gmau.addEventListener('ended', () => { GM.pos = (GM.pos + 1) % GM.order.length; gmLoad(true); });
let gmErr = 0; gmau.addEventListener('error', () => { if (!gmau.getAttribute('src')) return; if (++gmErr < 5) setTimeout(() => { GM.pos = (GM.pos + 1) % GM.order.length; gmLoad(true); }, 1200); });
gmau.addEventListener('playing', () => { gmErr = 0; });
$('#shr-gmnext').addEventListener('click', () => { GM.pos = (GM.pos + 1) % GM.order.length; gmLoad(true); });
$('#shr-gmcoll').addEventListener('change', function () { GM.coll = this.value; gmSub(); gmFill(false); });
$('#shr-gmsub').addEventListener('change', () => gmFill(false));
(function gmInit(n) {
  if (!window.LTFGM) { if (n < 100) setTimeout(() => gmInit(n + 1), 100); return; }
  window.LTFGM.load().then(() => {
    window.LTFGM.collections.forEach((c) => { const op = document.createElement('option'); op.value = c.key; op.textContent = c.label; $('#shr-gmcoll').appendChild(op); });
    GM.ready = true; gmSub(); gmFill(false);
    [...$('#shr-qsel').options].forEach((o) => { if (/^mobygratis/.test(o.value) && !window.LTFGM.collections.some((c) => c.key === o.value)) { o.disabled = true; o.textContent += ' (coming soon)'; } });
    if (GM.pending) { const k = GM.pending; GM.pending = null; gmPlay(k); }
  }).catch(() => {});
})(0);
function gmPlay(key) { tab('gm'); if (!GM.ready) { GM.pending = key; return; } if (key && key !== GM.coll) { GM.coll = key; $('#shr-gmcoll').value = key; gmSub(); } gmFill(true); }

/* My Spotify app */
let acctStop = null;
function acctSync() {
  if (MODE === 'acct' && !acctStop && window.LTFSP) acctStop = window.LTFSP.follow({ onSong: (t) => songStart(t), onPlaying: (p) => { if (MODE === 'acct') setPlaying(p); }, onStatus: (t) => { $('#shr-acct-status').textContent = t; } });
  if (MODE !== 'acct' && acctStop) { acctStop(); acctStop = null; }
}
(function acctInit(n) { if (!window.LTFSP) { if (n < 100) setTimeout(() => acctInit(n + 1), 100); return; } window.LTFSP.button($('#shr-acct-btn'), { ghostClass: 'alt' }); acctSync(); })(0);

/* Mic */
$('#shr-mic').addEventListener('click', async function () {
  if (micA) { micA.stream.getTracks().forEach((t) => t.stop()); micA.ctx.close(); micA = null; this.textContent = '\u{1F3A4} Start listening'; setPlaying(false); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); const an = ctx.createAnalyser(); an.fftSize = 1024; ctx.createMediaStreamSource(stream).connect(an);
    micA = { stream, ctx, an, buf: new Float32Array(1024), avg: 0.02, quiet: 0 }; this.textContent = '\u25a0 Stop listening';
    songStart('Music in the room');
    const watch = () => { if (!micA) return; micA.an.getFloatTimeDomainData(micA.buf); let s = 0; for (const v of micA.buf) s += v * v; const rms = Math.sqrt(s / 1024); if (rms < 0.01) { micA.quiet += 200; if (micA.quiet > 2500 && S.playing) setPlaying(false); } else { if (micA.quiet > 2500) songStart('Music in the room'); micA.quiet = 0; if (!S.playing) setPlaying(true); } setTimeout(watch, 200); }; watch();
  } catch (e) { $('#shr-now').textContent = 'The microphone is blocked. Allow it in your browser and try again.'; }
});

/* Apple Music */
const AM = { t: 0, on: false, timer: null };
$('#shr-amload').addEventListener('click', () => { const v = $('#shr-amurl').value.trim(), m = v.match(/^https?:\/\/(?:embed\.)?music\.apple\.com\/(.+)$/i); if (!m) { $('#shr-now').textContent = 'That doesn\u2019t look like an Apple Music link.'; return; } const u = 'https://embed.music.apple.com/' + m[1]; $('#shr-amembed').innerHTML = `<iframe id="shr-amframe" src="${esc(u)}" height="${/[?&]i=|\/song\//.test(u) ? 175 : 450}" style="width:100%;border:0;border-radius:10px" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" title="Apple Music player"></iframe>`; });
function amSet(on) { AM.on = on; $('#shr-ampause').textContent = on ? '\u23f8 Pause' : '\u25b6 Resume'; setPlaying(on); clearInterval(AM.timer); if (on) AM.timer = setInterval(() => { if (MODE === 'am' && AM.on && ++AM.t >= 210) { AM.t = 0; songStart(null); } }, 1000); }
$('#shr-amnext').addEventListener('click', () => { AM.t = 0; songStart(null); amSet(true); });
$('#shr-ampause').addEventListener('click', () => { if (AM.on) amSet(false); else { if (S.cur < 0) songStart(null); amSet(true); } });
window.addEventListener('blur', () => setTimeout(() => { const a = document.activeElement; if (MODE === 'am' && a && a.id === 'shr-amframe' && !AM.on) { if (S.cur < 0) songStart(null); amSet(true); } }, 0));

/* Type my songs */
$('#shr-tstart').addEventListener('click', () => { songStart($('#shr-typed').value.trim() || null); $('#shr-typed').value = ''; });
$('#shr-typed').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#shr-tstart').click(); });
$('#shr-tend').addEventListener('click', songEnd);

/* Quick play: game music by default on phones and tablets, Spotify on computers */
$('#shr-qsel').value = TOUCH ? 'c64' : 'spotify';
try { const q = localStorage.getItem('shr.qp'); if (q) $('#shr-qsel').value = q; } catch (e) {}
$('#shr-qgo').addEventListener('click', () => {
  const v = $('#shr-qsel').value; try { localStorage.setItem('shr.qp', v); } catch (e) {}
  if (v === 'spotify') { if (!gmau.paused) gmau.pause(); tab('sp'); const p = pick(PLAYLISTS); sel.value = p[1]; loadEmbed('spotify:playlist:' + p[1], true); }
  else gmPlay(v);
});
$('#shr-qstop').addEventListener('click', () => { if (MODE === 'gm') gmau.pause(); else if (MODE === 'sp' && ctrl) { try { ctrl.togglePlay(); } catch (e) {} } else setPlaying(false); });
function syncQuick() { $('#shr-qstop').hidden = !S.playing; $('#shr-fplay').textContent = S.playing ? '\u23f8' : '\u25b6'; }
$('#shr-fplay').addEventListener('click', () => { if (S.playing) $('#shr-qstop').click(); else if (MODE === 'gm' && gmau.getAttribute('src')) gmau.play().catch(() => {}); else $('#shr-qgo').click(); });

/* Full screen (real full screen where the browser has it; a fixed layer sized to the visible area on iPhone) */
function fitFull() {
  const box = $('#shr');
  if (!box.classList.contains('shr-full')) { cv.style.width = ''; cv.style.height = ''; ['top', 'left', 'width', 'height'].forEach((k) => { box.style[k] = ''; }); return; }
  const v = window.visualViewport, vw = v ? v.width : window.innerWidth, vh = v ? v.height : window.innerHeight;
  box.style.top = (v ? v.offsetTop : 0) + 'px'; box.style.left = (v ? v.offsetLeft : 0) + 'px'; box.style.width = vw + 'px'; box.style.height = vh + 'px';
  const k = Math.min(vw / W, vh / H); cv.style.width = Math.floor(W * k) + 'px'; cv.style.height = Math.floor(H * k) + 'px';
}
const refit = () => { [30, 250, 700].forEach((t) => setTimeout(fitFull, t)); };
window.addEventListener('resize', refit); window.addEventListener('orientationchange', refit);
if (window.visualViewport) { window.visualViewport.addEventListener('resize', refit); window.visualViewport.addEventListener('scroll', () => setTimeout(fitFull, 30)); }
$('#shr').addEventListener('touchmove', (e) => { if ($('#shr').classList.contains('shr-full') && !/select|input/i.test(e.target.tagName)) e.preventDefault(); }, { passive: false });
function setFull(on) { $('#shr').classList.toggle('shr-full', on); document.documentElement.classList.toggle('shr-noscroll', on); $('#shr-fs').textContent = on ? '\u2715 Exit' : '\u26f6 Full screen'; refit(); }
$('#shr-fs').addEventListener('click', () => { const on = !$('#shr').classList.contains('shr-full'); setFull(on); const el = $('#shr'); try { if (on && el.requestFullscreen) el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {} });
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && $('#shr').classList.contains('shr-full')) setFull(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setFull(false); });

syncUI(); S.title = 0;
if (document.fonts && document.fonts.load) { document.fonts.load('30px Pacifico').catch(() => {}); document.fonts.load('20px Monoton').catch(() => {}); }
requestAnimationFrame(frame);
window.SHORECLUB = { S, setScene, setAct, songStart, ROSTER };
})();
