/* Shore Club Sessions: a fan-made tribute to the Shore Club dance hall in Hubbards, Nova Scotia (dancing since 1946).
   Cinematic flat-polygon scenes drawn entirely in code: outside the hall, the deck over Hubbards Cove, the dance hall,
   an outdoor shore stage, and Hubbards Beach by day or night. Five house acts, 240 regulars, and a black-marker drawing mode
   where only the lights keep their colour. Not affiliated with the Shore Club. */
(function () {
'use strict';
const root = document.getElementById('shr-root'); if (!root || root.dataset.ready) return; root.dataset.ready = '1';
const SRC = (document.currentScript && document.currentScript.src) || '';
const GM_SRC = SRC.replace(/shore\/shore\.js.*$/, 'rko/gm.js');
if (SRC && !window.SHR_CHAT) { const cs = document.createElement('script'); cs.src = SRC.replace(/shore\.js.*$/, 'chatter.js'); document.head.appendChild(cs); }
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
  { k: 'funk', name: 'The Neon Anchors Soul Revue', genre: 'Funk & Soul', emo: '\u{1F3B7}', cols: ['#b44bff', '#ff8a00', '#ff3d7f'], band: ['sax', 'keys', 'mic', 'drums', 'bass', 'trumpet'], crowd: { funk: 6, couple: 3, sway: 2 }, tag: 'horns, a mirror ball and a dance floor full of anchors' },
  { k: 'haze', name: 'Willy Mays Haze', genre: 'East Coast Rock', emo: '\u{1F30A}', cols: ['#ff9a3c', '#7ad0ff', '#ffe08a'], band: ['keytar', 'mic', 'drums', 'guitar', 'bass'], crowd: { rock: 3, cheer: 3, sway: 2, couple: 2, stand: 1 }, tag: 'hazy East Coast rock: a keytar, a moustache and a cowboy on lead guitar' }
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
#shr.shr-full .shr-hud .shr-ov{position:static;flex:0 0 auto;flex-wrap:nowrap;right:auto;left:auto;top:auto}
#shr.shr-full .shr-hud .shr-ov select{max-width:24vw}
#shr.shr-full .shr-hud .shr-act{display:none}
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
const QUIRK = ['regular since ', 'first dance here in ', 'met their sweetheart here in ', 'hasn\u2019t missed a Saturday since ', 'still has the ticket stub from ', 'came for the lobster supper in '];
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
const EXTRA = ['twist', 'disco', 'robot', 'wave', 'swim', 'shimmy', 'sprinkler', 'raise', 'jump', 'hips'];
function moveX(P, m, k) {
  const { b, ph, n, pu, sn, E, o } = k, s2 = Math.sin(b * Math.PI * 2), c2 = Math.cos(b * Math.PI * 2);
  switch (m) {
    case 'twist': P.sway = s2 * 4 * E; P.LL = [-0.25 + s2 * 0.25, 0.25 + s2 * 0.2]; P.RL = [0.25 + s2 * 0.25, -0.25 + s2 * 0.2]; P.L = [-0.9 - s2 * 0.3, 0.6]; P.R = [0.9 - s2 * 0.3, -0.6]; P.bounce = 2 + pu; break;
    case 'disco': { const up = (n % 2) === 0; P.R = up ? [2.6, 2.9] : [0.9, 0.6]; P.L = [-0.3, 0.4]; P.lean = up ? -0.08 : 0.08; P.sway = up ? 2 : -2; P.bounce = pu * 2; break; }
    case 'robot': { const st = Math.floor(b * 2) % 4; P.L = [[-1.57, 0][st % 2], [-1.57, 3.1][st >> 1]]; P.R = [[1.57, 0][(st + 1) % 2], [1.57, -3.1][(st + 1) >> 1 & 1]]; P.bounce = 0; P.sway = (st - 1.5) * 1.2; break; }
    case 'wave': { const w = Math.sin(b * Math.PI * 2 + o * 6); P.L = [-1.5 + w * 0.3, -1.5 + w * 0.6]; P.R = [1.5 + w * 0.3, 1.5 + w * 0.6]; P.sway = w * 2; P.bounce = pu; break; }
    case 'swim': { const a = b * Math.PI; P.L = [-1.6 - Math.max(0, Math.sin(a)) * 1.2, -2.2]; P.R = [1.6 + Math.max(0, -Math.sin(a)) * 1.2, 2.2]; P.lean = Math.sin(a) * 0.08; P.bounce = pu * 1.5; break; }
    case 'shimmy': P.sway = Math.sin(b * Math.PI * 8) * 1.4; P.L = [-0.6, -0.3]; P.R = [0.6, 0.3]; P.lean = Math.sin(b * Math.PI * 8) * 0.04; P.bounce = 1 + pu; break;
    case 'sprinkler': { const t = (b % 2) / 2; P.R = [1.57, 1.57 + (Math.floor(t * 6) % 6) * 0.1]; P.L = [-0.9, -2.6]; P.lean = 0.05 - t * 0.1; P.bounce = pu; break; }
    case 'raise': P.L = [-2.9 + sn * 0.2, -3.0]; P.R = [2.9 + sn * 0.2, 3.0]; P.sway = sn * 3 * E; P.bounce = pu * 2; break;
    case 'jump': P.bounce = 10 * pu * E; P.L = [-2.6, -2.8]; P.R = [2.6, 2.8]; P.LL = [-0.2 * pu, 0.3 * pu]; P.RL = [0.2 * pu, -0.3 * pu]; break;
    case 'hips': P.sway = s2 * 3; P.lean = -s2 * 0.07; P.L = [-0.35, 1.2]; P.R = [0.35, -1.2]; P.LL = [-0.08 + Math.max(0, s2) * 0.2, 0]; P.RL = [0.08 - Math.max(0, -s2) * 0.2, 0]; P.bounce = pu; break;
  }
  void c2; void ph;
}
function pose(sl) {
  const stl = sl.style, o = sl.off, on = S.playing, band = stl[0] === 'b';
  const E = on ? clamp(0.35 + S.energy * 0.8, 0, 1.3) : 0;
  const b = S.beat + (band ? 0 : o * 0.12), ph = ((b % 1) + 1) % 1, n = Math.floor(b), pu = Math.exp(-ph * 6) * E, sn = Math.sin(b * Math.PI), id = Math.sin(S.t * 1.3 + o * 9);
  const P = { dx: 0, sway: 0, bounce: 0, lean: 0, L: [-0.18, -0.08], R: [0.18, 0.08], LL: [-0.05, 0.02], RL: [0.05, -0.02], hy: 0, face: sl.face, sit: false, cross: false, E, pu, b, ph, n };
  if (stl === 'sit' || stl === 'cross') { if (stl === 'cross') P.cross = true; else P.sit = true; P.sway = id * 0.8 + sn * 1.5 * E; P.hy = pu * 1.5; if (sl.drink) P.R = [0.3, 2.3]; if (on && sl.off > 0.6) { P.L = [-0.45, 2.1 + pu * 0.4]; P.R = [0.45, -2.1 - pu * 0.4]; } return P; }
  if (stl === 'walk') { const w = S.t * 7 + o * 9, s2 = Math.sin(w); P.LL = [s2 * 0.42, Math.max(0, -s2) * 0.55]; P.RL = [-s2 * 0.42, Math.max(0, s2) * 0.55]; P.L = [-0.12 - s2 * 0.3, 0.25]; P.R = [0.12 + s2 * 0.3, -0.25]; P.bounce = Math.abs(Math.cos(w)) * 1.3; return P; }
  if (!on && !band) { P.sway = id * 1.2; if (sl.drink) P.R = [0.3, 2.2]; return P; }
  if (!band && !sl.drink && !sl.inst && !sl.still && stl !== 'couple' && stl !== 'line') { const seg = Math.floor(b / 16), hs = Math.abs(Math.sin(seg * 12.9898 + o * 78.233) * 43758.5453) % 1; if (hs < 0.45) { moveX(P, EXTRA[Math.floor(hs / 0.45 * EXTRA.length)], { b, ph, n, pu, sn, E, o }); return P; } }
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
    if (p.top === 'hawaii') hawaiiPrint(tor, shX, shY, hx, hipY, s, p.topC);
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
    const up = p.top === 'tank' ? c.skin : c.top, lo = (p.top === 'tee' || p.top === 'tank' || p.top === 'stripe' || p.top === 'hawaii') ? c.skin : c.top;
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
    if (p.acc === 'moustache' || p.acc === 'stache+beard') poly([x - rx * 0.62, y + ry * 0.42, x, y + ry * 0.22, x + rx * 0.62, y + ry * 0.42, x + rx * 0.7, y + ry * 0.62, x, y + ry * 0.44, x - rx * 0.7, y + ry * 0.62], hc, hairInk);
    if (p.acc === 'stubble' && !MARK) { g.globalAlpha = 0.45; poly([x - rx * 0.85, y + 1 * s, x + rx * 0.85, y + 1 * s, x + rx * 0.45, y + ry * 0.9, x, y + ry * 1.05, x - rx * 0.45, y + ry * 0.9], hc); g.globalAlpha = 1; }
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
const HAWAII = [['#ff4fa3', '#ffe14a', '#2ad1a3'], ['#ffd23f', '#ff3d7f', '#1fb5ff'], ['#1fb5ff', '#ffffff', '#ff8a00'], ['#ff7a1a', '#ffe9b0', '#2a9d4a'], ['#7a3cff', '#ffd23f', '#3ddc84']];
function hawaiiPrint(tor, shX, shY, hx, hipY, s, base) {
  const set = HAWAII.find((h) => h[0] === base) || HAWAII[0];
  g.save(); path(tor, true); g.clip();
  const pts = [[-6, 4], [5, 9], [-2, 16], [7, 22], [-7, 26], [2, 31], [-4, 36], [8, 34]];
  pts.forEach(([dx, dy], i) => {
    const x = hx + dx * s + (shX - hx) * (1 - dy / 40), y = shY + dy * s;
    if (i % 2) { ell(x + 2 * s, y + 1 * s, 3.2 * s, 1.4 * s, MARK ? PAPER : '#1e8a4a', { noline: true }, 0.6); }
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + i; ell(x + Math.cos(a) * 1.6 * s, y + Math.sin(a) * 1.6 * s, 1.5 * s, 1.5 * s, MARK ? INK : set[1 + (i % 2)], { noline: true }); }
    ell(x, y, 0.9 * s, 0.9 * s, MARK ? PAPER : '#fff6c0', { noline: true });
  });
  g.restore();
  ln(shX - 2.5 * s, shY + 1 * s, shX, shY + 6 * s, MARK ? INK : 'rgba(0,0,0,.35)', 1.2 * s); ln(shX + 2.5 * s, shY + 1 * s, shX, shY + 6 * s, MARK ? INK : 'rgba(0,0,0,.35)', 1.2 * s);
}
function keytarOn(P) { return Math.floor(P.b / 16) % 2 === 1; }
function bandPose(P, inst) {
  const E = P.E, b = P.b, pu = P.pu, on = S.playing, osc = on ? Math.sin(b * Math.PI * 4) : 0;
  switch (inst) {
    case 'guitar': case 'bass': case 'mic-guitar': case 'banjo': P.L = [-0.7, -1.75]; P.R = [0.35, -0.95 + osc * 0.28]; P.sway = Math.sin(b * Math.PI * 0.5) * 2 * E; P.bounce = pu * 1.4; P.hy = pu * 1.5; break;
    case 'mic': P.R = [0.2, 2.9]; P.L = [-0.5 - pu * 0.7, -1.4 - pu * 0.9]; P.sway = Math.sin(b * Math.PI) * 3 * E; P.bounce = pu * 1.6; break;
    case 'drums': { const k = Math.floor(b * 2) % 2; P.sit = true; P.L = [-0.5, (on && k ? 1.6 : 0.9)]; P.R = [0.5, (on && !k ? -1.6 : -0.9)]; P.hy = pu * 2; break; }
    case 'fiddle': P.R = [0.95, 2.05]; P.L = [-0.35, 1.25 + osc * 0.45]; P.sway = Math.sin(b * Math.PI * 0.5) * 2.5 * E; P.bounce = pu * 1.5; break;
    case 'accordion': P.L = [-0.3, 0.55]; P.R = [0.3, -0.55]; P.sway = Math.sin(b * Math.PI * 0.5) * 3 * E; P.bounce = pu; break;
    case 'keytar': {
      // the life of the party: big leans, jumps, head-banging, a fist in the air, struts across the stage
      const ph = ((b % 1) + 1) % 1, bar = Math.floor(b / 4), m4 = ((Math.floor(b) % 4) + 4) % 4, k = Math.max(E, on ? 0.6 : 0.25), sw = Math.sin(b * Math.PI);
      if (keytarOn(P)) {
        const lift = on && (bar % 2 === 1) && m4 >= 2 ? Math.sin(Math.min(1, (m4 - 2 + ph) / 2) * Math.PI) : 0;
        P.kt = lift; P.L = [-0.75 - lift * 0.9, -1.95 - lift * 0.9]; P.R = [0.25 - lift * 0.5, -0.75 + osc * 0.35 - lift * 0.6];
        P.lean = (on ? Math.sin(b * Math.PI * 0.5) * 0.16 - lift * 0.12 : Math.sin(S.t) * 0.04) * (0.6 + k * 0.6);
        P.bounce = on ? (m4 === 0 ? 11 : 4) * pu * k + 2 : 1; P.hy = on ? 5 * pu * k : 0;
        P.dx = on ? Math.sin(b * Math.PI * 0.125) * 14 : 0; P.sway = sw * 4 * k;
        const kick = on && m4 === 3 ? Math.sin(ph * Math.PI) : 0; P.LL = [-0.12 - kick * 0.7, 0.2 + kick * 0.6]; P.RL = [0.12 + Math.max(0, -sw) * 0.25 * k, -0.12];
      } else {
        const fist = on && (bar % 2 === 0) && m4 >= 2;
        P.L = fist ? [-2.8 + pu * 0.35, -3.0 + pu * 0.3] : [-0.2, 0.4 + (on ? Math.sin(b * Math.PI * 4) * 0.25 : 0)];
        P.R = [0.2, -0.4 + (on ? Math.cos(b * Math.PI * 4) * 0.25 : 0)];
        P.lean = on ? 0.12 + Math.max(0, Math.sin(b * Math.PI)) * 0.12 * k : 0.03; P.hy = on ? 6 * pu * k : 0;
        P.bounce = on ? 5 * pu * k + 1 : 0.5; P.sway = sw * 3.5 * k; P.dx = on ? Math.sin(b * Math.PI * 0.5) * 3 : 0;
        P.LL = [-0.08 - (on ? Math.max(0, sw) * 0.2 : 0), 0.05]; P.RL = [0.08 + (on ? Math.max(0, -sw) * 0.2 : 0), -0.05];
      }
      break;
    }
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
    case 'keytar': { const y0 = hipY - 4 * s; ln(hx - 18 * s, J.y, hx + 18 * s, y0 + 4 * s, '#222', 2 * s); ln(hx + 18 * s, J.y, hx - 18 * s, y0 + 4 * s, '#222', 2 * s); if (keytarOn(P)) { rect(hx - 26 * s, y0 - 2 * s, 52 * s, 6 * s, '#1b1b1f'); if (!MARK) rect(hx - 24 * s, y0 - 1 * s, 48 * s, 2.6 * s, '#f4f1de'); } break; }
    case 'keys': { const y0 = hipY - 4 * s; ln(hx - 18 * s, J.y, hx + 18 * s, y0 + 4 * s, '#222', 2 * s); ln(hx + 18 * s, J.y, hx - 18 * s, y0 + 4 * s, '#222', 2 * s); break; }
    case 'drums': drumKit(J, act); break;
    case 'dj': djBooth(J, act); break;
  }
  if (phase === 'post') switch (inst) {
    case 'fiddle': { const fx = shX + 10 * s, fy = shY + 4 * s; ell(fx, fy, 8 * s, 4.4 * s, '#8a3b14', {}, 0.55); ln(fx + 4 * s, fy + 3 * s, J.hands[1][0], J.hands[1][1], '#2a1a10', 2 * s); const h = J.hands[0]; ln(h[0] - 14 * s, h[1] - 6 * s, h[0] + 16 * s, h[1] + 7 * s, '#e8dcc0', 1.4 * s, { mw: 1.6 }); break; }
    case 'keytar': if (!keytarOn(P)) instrument('keys', J, act, 'post'); else {
      const lift = P.kt || 0, a = -0.5 - lift * 0.55, cx = J.hx + 2 * s, cy = J.hipY - 12 * s - lift * 14 * s, L = 34 * s, ca = Math.cos(a), sa = Math.sin(a), pt = (u, v) => [cx + ca * u - sa * v, cy + sa * u + ca * v];
      const body = [...pt(-L * 0.35, -6 * s), ...pt(L * 0.55, -7 * s), ...pt(L * 0.62, 6 * s), ...pt(-L * 0.35, 6 * s)];
      poly(body, act.cols[0], { lw: 1.4 });
      if (!MARK) { const k1 = pt(-L * 0.3, 0), k2 = pt(L * 0.5, 0); ln(k1[0], k1[1], k2[0], k2[1], '#f4f1de', 5 * s, { mw: 2 }); g.strokeStyle = '#111'; g.lineWidth = 0.8; g.beginPath(); for (let i = 0; i < 10; i++) { const q = pt(-L * 0.28 + i * L * 0.078, -2 * s), q2 = pt(-L * 0.28 + i * L * 0.078, 1 * s); g.moveTo(q[0], q[1]); g.lineTo(q2[0], q2[1]); } g.stroke(); }
      const n1 = pt(-L * 0.35, 0), n2 = pt(-L * 0.95, -2 * s); ln(n1[0], n1[1], n2[0], n2[1], '#1b1b1f', 4 * s, { mw: 2 });
      if (on) { glow(cx, cy, (16 + lift * 14) * s, act.cols[1], 0.3 + P.pu * 0.5 + lift * 0.3); if (lift > 0.5) for (let i = 0; i < 5; i++) { const t2 = S.t * 4 + i * 1.3; glow(cx + Math.cos(t2) * 26 * s, cy - 10 * s + Math.sin(t2) * 14 * s, 4 * s, act.cols[i % 3], 0.8); } }
    } break;
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
  if (act.k === 'haze') Object.assign(p, ({
    mic: { hair: 'long', hairC: '#b8975e', hat: 'none', top: 'jacket', topC: '#efe8d8', bot: 'jeans', botC: '#3a5f94', acc: 'stubble', h: 1.04 },
    keytar: { hair: 'curly', hairC: '#3a2a1a', hat: 'none', top: 'hawaii', topC: '#ff4fa3', bot: 'jeans', botC: '#1f2a44', acc: 'shades' },
    bass: { hair: 'short', hairC: '#5a3a22', hat: 'none', top: 'long', topC: '#2a3a4a', bot: 'jeans', botC: '#1a1a22', acc: 'moustache' },
    guitar: { hair: 'long', hairC: '#6a4a2a', hat: 'cowboy', hatC: '#2a1e16', top: 'long', topC: '#e9dfc8', bot: 'jeans', botC: '#2b4a7a', acc: 'none', w: 0.78, h: 1.06 },
    drums: { hat: 'cap', hatC: '#1d4e89', top: 'tank', topC: '#111318', bot: 'jeans' }
  })[inst] || {});
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
    const sl = bandMember(act, inst, i); if (sl.p.top === 'hawaii') { const want = HAWAII[Math.max(0, S.songs.length) % HAWAII.length][0]; if (sl.p.topC !== want) { sl.p.topC = want; sl.cKey = ''; } }
    sl.c = sl.cKey === amb.col + light ? sl.c : (sl.cKey = amb.col + light, shadeSet(sl.p, amb, light));
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
    case 'inside': dance(40, 250, 710, 350, 530, 0.6, 1.2, 0.72, 220); L.push({ p: Object.assign({}, ROSTER[23], { name: 'Big Gus, door staff', quirk: 'nobody gets on stage on his watch', skin: '#b97d55', hair: 'bald', hairC: '#1b1410', top: 'tee', topC: '#111318', bot: 'pants', botC: '#111318', hat: 'none', acc: 'shades', shoe: '#1a1410', h: 1.3, w: 2.1 }), x: 300, y: 384, s: 1.02, style: 'stand', face: 1, off: 0.4, drink: false, still: true }); [[70, 470], [890, 470]].forEach(([x, y]) => { addSlot(L, r, x - 28, y - 6, 1, 'sit', 1, { table: [x, y] }); addSlot(L, r, x + 28, y - 6, 1, 'sit', 1, { table: [x, y] }); }); break;
    case 'deck': idle(8, 200, 620, 418, 466, 0.74, 0.86); dance(7, 40, 620, 470, 535, 0.9, 1.12, 0.35); L.push({ p: Object.assign({}, ROSTER[11], { hair: 'short', hairC: '#ece6dc', top: 'plaid', topC: '#3d5a80', bot: 'shorts', botC: '#1f2a44', hat: 'none', acc: 'glasses', h: 1, w: 1.05 }), x: 760, y: 432, s: 0.86, style: 'b:accordion', inst: 'accordion', face: 1, off: 0.2 }); idle(3, 700, 900, 440, 470, 0.86, 0.92, -1, 'clap'); L.push({ p: Object.assign({}, ROSTER[37], { name: 'Red on the deck door', quirk: 'tallest bouncer in Hubbards', skin: '#f3d2b8', hair: 'short', hairC: '#c4501c', top: 'tee', topC: '#111318', bot: 'jeans', botC: '#1f3355', hat: 'none', acc: 'beard', shoe: '#1a1410', h: 1.32, w: 1.25 }), x: 572, y: 452, s: 1.0, style: 'stand', face: -1, off: 0.7, drink: false, still: true }); break;
    case 'outside': idle(11, 40, 930, 470, 535, 0.78, 1.0); dance(4, 160, 800, 480, 532, 0.85, 1.0, 0.15); L.forEach((sl) => { if (sl.x > 290 && sl.x < 480) { const d = sl.x < 381 ? -1 : 1; sl.x += d * 120; if (sl.cx != null) sl.cx += d * 120; } }); break;
    case 'shore': dance(64, 10, 620, 372, 538, 0.5, 1.2, 0.9, 40); break;
    case 'beachDay': dance(14, 90, 470, 445, 530, 0.8, 1.05, 0.7); idle(4, 600, 920, 480, 520, 0.9, 1.05, 1, 'cross'); idle(3, 520, 900, 395, 420, 0.65, 0.7, 1, 'stand'); break;
    case 'beachNight': dance(26, 60, 540, 440, 532, 0.78, 1.08, 0.6, 30); [[612, 470], [708, 470], [584, 506], [738, 506], [880, 490]].forEach(([x, y]) => addSlot(L, r, x, y, 0.95, 'cross', 1)); idle(3, 800, 930, 440, 470, 0.8, 0.85, 1, 'sway'); break;
  }
  CROWD = L.sort((a, b) => a.y - b.y);
}
const WANDER = { stand: 1, sway: 1, clap: 1, cheer: 1, rock: 0.6, funk: 0.6, rave: 0.5, step: 0.5 };
let LAST_AMB = null, LAST_LIGHT = '#ffd9a0';
function drawCrowd(amb, light, filter) {
  LAST_AMB = amb; LAST_LIGHT = light;
  const ck = amb.col + light + S.act;
  for (const sl of CROWD) {
    if (filter && !filter(sl)) continue;
    if (sl.cKey !== ck) { sl.cKey = ck; sl.c = shadeSet(sl.p, amb, sl.style === 'couple' || sl.style === 'rave' ? ACTS[S.act].cols[(sl.off * 3) | 0] : light); }
    let x = sl.x;
    if (sl.style === 'couple' && S.playing) { const b = S.beat + sl.off * 0.1, th = Math.PI * Math.floor(b / 8) + Math.PI * smooth(clamp((b % 8) - 7, 0, 1)); x = sl.cx + Math.cos(th) * 13 * sl.s * sl.side; }
    if (WANDER[sl.style] && !sl.table && !sl.inst) x += Math.sin(S.t * (0.07 + sl.off * 0.06) + sl.off * 40) * 26 * sl.s * WANDER[sl.style];
    if (sl.style === 'sit' && !sl.table) ell(x, sl.y - 2, 12 * sl.s, 4 * sl.s, '#1a1a1a', { skip: true });
    if (sl.inst) person(sl, x, sl.y, sl.s, (J) => instrument(sl.inst, J, ACTS[S.act], 'mid'), (J) => instrument(sl.inst, J, ACTS[S.act], 'post')); else person(sl, x, sl.y, sl.s);
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
function stageLights(x0, x1, ytop, yfloor, intensity, noFix) {
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
    if (!noFix) rect(x - 5, ytop - 6, 10, 8, '#1a1a1a', { lw: 1.2 }); glow(x, ytop + 2, 14, col, I + 0.2);
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
/* ---------------- building pieces, drawn from photos of the real hall ---------------- */
const SC = { wall: '#dfe6ee', wallN: '#8f9bb3', blue: '#2b5a88', blueD: '#1d3d62', red: '#b3262e', roof: '#383c44', roofN: '#22252c' };
function clapboard(x0, y0, x1, y1, col, step) {
  rect(x0, y0, x1 - x0, y1 - y0, col, { lw: 1.8 });
  g.strokeStyle = MARK ? 'rgba(22,19,15,.5)' : 'rgba(0,0,0,.17)'; g.lineWidth = MARK ? 0.8 : 1.1;
  g.beginPath(); for (let y = y0 + step; y < y1 - 1; y += step) { g.moveTo(x0 + 1, y); g.lineTo(x1 - 1, y); } g.stroke();
  if (!MARK) { g.strokeStyle = 'rgba(255,255,255,.08)'; g.beginPath(); for (let y = y0 + step + 1.5; y < y1 - 1; y += step) { g.moveTo(x0 + 1, y); g.lineTo(x1 - 1, y); } g.stroke(); }
}
function windowGrid(x, y, w, h, cols, rows, o) {
  o = o || {}; rect(x - 4, y - 4, w + 8, h + 8, o.trim || SC.blue, { lw: 1.6 }); rect(x - 1, y - 1, w + 2, h + 2, '#f2f4f6', { lw: 1 });
  const pw = w / cols, ph = h / rows, f = 2;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const px = x + c * pw + f, py = y + r * ph + f, ww = pw - 2 * f, hh = ph - 2 * f, gc = o.glowCol ? o.glowCol(c, r) : o.glow;
    if (MARK) { rect(px, py, ww, hh, PAPER, { lw: 0.9 }); if (gc) glow(px + ww / 2, py + hh / 2, ww * 0.8, gc, (o.lit || 0.6) * 0.45); }
    else { g.fillStyle = gc || '#2a3b55'; g.globalAlpha = gc ? (o.lit || 0.8) : 1; g.fillRect(px, py, ww, hh); g.globalAlpha = 1; }
    if (o.curtain) { // blue gingham cafe curtains on the lower half
      const cy = py + hh * 0.45; if (MARK) { g.strokeStyle = INK; g.lineWidth = 0.8; g.beginPath(); for (let k = 2; k < ww; k += 4) { g.moveTo(px + k, cy); g.lineTo(px + k, py + hh); } g.stroke(); }
      else { g.fillStyle = o.curtain; g.globalAlpha = 0.85; g.fillRect(px, cy, ww, py + hh - cy); g.globalAlpha = 1; g.fillStyle = 'rgba(255,255,255,.35)'; for (let k = 0; k < ww; k += 4) g.fillRect(px + k, cy, 2, py + hh - cy); }
    }
    if (o.people && r === rows - 1) { g.save(); g.beginPath(); g.rect(px, py, ww, hh); g.clip(); const n = 1 + ((c * 7 + r) % 2), on = S.playing; for (let k = 0; k < n; k++) { const dx = px + ww * (0.3 + k * 0.4) + Math.sin(S.t * 1.5 + c + k) * 2, bob = on ? Math.abs(Math.sin(S.beat * Math.PI + c * 0.7 + k)) * 3 : 0; ell(dx, py + hh * 0.45 - bob, 2.6, 3.2, '#140c08', { ink: true, noline: true }); poly([dx - 5, py + hh, dx - 4, py + hh * 0.62 - bob, dx + 4, py + hh * 0.62 - bob, dx + 5, py + hh], '#140c08', { ink: true, noline: true }); if (on && (c + k) % 3 === 0) ln(dx + 3, py + hh * 0.66 - bob, dx + 7, py + hh * 0.3 - bob * 1.6, '#140c08', 1.8, { mw: 1.6 }); } g.restore(); }
  }
  for (let c = 1; c < cols; c++) ln(x + c * pw, y, x + c * pw, y + h, '#f2f4f6', 2.4, { mw: 1.2 });
  for (let r = 1; r < rows; r++) ln(x, y + r * ph, x + w, y + r * ph, '#f2f4f6', 2.4, { mw: 1.2 });
  if (gcAny(o) && !MARK) glow(x + w / 2, y + h / 2, Math.max(w, h) * 0.6, o.glow || '#ffcf7a', (o.lit || 0.6) * 0.25);
}
function gcAny(o) { return !!(o.glow || o.glowCol); }
function metalRoof(ax, ay, bx, by, cx, cy, dx, dy, col, seams) {
  poly([ax, ay, bx, by, cx, cy, dx, dy], col, { h: 7, ha: 1.3 });
  g.strokeStyle = MARK ? 'rgba(22,19,15,.6)' : 'rgba(255,255,255,.09)'; g.lineWidth = 1; g.beginPath();
  for (let i = 1; i < seams; i++) { const k = i / seams; g.moveTo(ax + (bx - ax) * k, ay + (by - ay) * k); g.lineTo(dx + (cx - dx) * k, dy + (cy - dy) * k); } g.stroke();
  ln(ax, ay, bx, by, SC.blueD, 2.5, { mw: 2 });
}
function cupola(x, y, s, night) {
  rect(x - 13 * s, y - 20 * s, 26 * s, 20 * s, night ? '#a9b4c6' : '#eef2f5', { lw: 1.4 });
  g.strokeStyle = MARK ? INK : '#5a6474'; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 4; k++) { g.moveTo(x - 7 * s, y - 16 * s + k * 3.5 * s); g.lineTo(x + 7 * s, y - 16 * s + k * 3.5 * s); } g.stroke();
  poly([x - 17 * s, y - 20 * s, x + 17 * s, y - 20 * s, x, y - 34 * s], SC.blueD, { lw: 1.4 });
  ln(x, y - 34 * s, x, y - 56 * s, '#2a2a2a', 1.4 * s, { mw: 1.4 });
  const a = Math.sin(S.t * 0.4) * 0.5; ln(x - 10 * s * Math.cos(a), y - 45 * s, x + 10 * s * Math.cos(a), y - 45 * s, '#2a2a2a', 1.2 * s, { mw: 1.2 });
  // the lobster weathervane
  g.save(); g.translate(x, y - 52 * s); g.scale(Math.cos(S.t * 0.25) * 0.5 + 0.5 > 0.2 ? 1 : -1, 1); poly([-10 * s, 0, -4 * s, -3 * s, 6 * s, -2 * s, 11 * s, -5 * s, 9 * s, 0, 11 * s, 3 * s, 6 * s, 1 * s, -4 * s, 2 * s], '#1c1c1c', { ink: true, noline: true }); g.restore();
  ell(x, y - 40 * s, 2 * s, 2 * s, '#d9502b', { lw: 1 });
}
function shipLantern(x, y, s, col, a) {
  ln(x, y - 14 * s, x + 8 * s, y - 14 * s, '#3a2a1a', 1.6 * s, { mw: 1.4 });
  rect(x - 6 * s, y - 12 * s, 12 * s, 3 * s, '#4a3424', { lw: 1 });
  rect(x - 5 * s, y - 9 * s, 10 * s, 13 * s, '#3a2a1a', { lw: 1.2 });
  rect(x - 3.4 * s, y - 7 * s, 6.8 * s, 9 * s, col, { lw: 0.8 });
  glow(x, y - 2.5 * s, 34 * s, col, a); bulb(x, y - 2.5 * s, 2 * s, col, a);
}
function hexLantern(x, y, s, a) {
  ln(x, 0, x, y - 14 * s, '#222', 1, { mw: 1 });
  poly([x - 8 * s, y - 14 * s, x + 8 * s, y - 14 * s, x + 5 * s, y - 18 * s, x - 5 * s, y - 18 * s], '#1c1712');
  rect(x - 8 * s, y - 14 * s, 16 * s, 22 * s, '#ff9a3c', { lw: 1.2 });
  if (!MARK) { g.fillStyle = 'rgba(255,220,150,.6)'; g.fillRect(x - 3 * s, y - 12 * s, 6 * s, 18 * s); }
  ln(x - 3 * s, y - 14 * s, x - 3 * s, y + 8 * s, '#1c1712', 1, { mw: 1 }); ln(x + 3 * s, y - 14 * s, x + 3 * s, y + 8 * s, '#1c1712', 1, { mw: 1 });
  rect(x - 9 * s, y + 8 * s, 18 * s, 4 * s, '#1c1712');
  glow(x, y - 3 * s, 60 * s, '#ff9a3c', a);
}
const ICS = { // International Code of Signals flags, as painted on the hall
  W: [['b', '#1d4e89'], ['r', 0.18, 0.18, 0.64, 0.64, '#f4f1de'], ['r', 0.36, 0.36, 0.28, 0.28, '#c8102e']],
  E: [['b', '#1d4e89'], ['r', 0, 0.5, 1, 0.5, '#c8102e']],
  L: [['b', '#f2c14e'], ['r', 0.5, 0, 0.5, 0.5, '#111318'], ['r', 0, 0.5, 0.5, 0.5, '#111318']],
  C: [['b', '#1d4e89'], ['r', 0, 0.2, 1, 0.2, '#f4f1de'], ['r', 0, 0.4, 1, 0.2, '#c8102e'], ['r', 0, 0.6, 1, 0.2, '#f4f1de']],
  O: [['b', '#f2c14e'], ['t', 0, 0, 1, 0, 1, 1, '#c8102e']],
  M: [['b', '#1d4e89'], ['x', '#f4f1de']],
  S: [['b', '#f4f1de'], ['r', 0.3, 0.3, 0.4, 0.4, '#1d4e89']],
  H: [['b', '#f4f1de'], ['r', 0.5, 0, 0.5, 1, '#c8102e']],
  R: [['b', '#c8102e'], ['r', 0.42, 0, 0.16, 1, '#f2c14e'], ['r', 0, 0.42, 1, 0.16, '#f2c14e']],
  U: [['b', '#c8102e'], ['r', 0.5, 0, 0.5, 0.5, '#f4f1de'], ['r', 0, 0.5, 0.5, 0.5, '#f4f1de']],
  B: [['p', '#c8102e']]
};
const DARKC = { '#1d4e89': 1, '#111318': 1, '#c8102e': 2 };
function flagICS(x, y, w, h, ch, fl) {
  const spec = ICS[ch] || ICS.W; fl = fl || 0;
  const P = (u, v) => [x + u * w + v * fl * 0.3, y + v * h + Math.sin(u * 3 + S.t * 3) * fl * u];
  const mo = (c) => (MARK ? (DARKC[c] === 1 ? { ink: true, lw: 1 } : DARKC[c] === 2 ? { h: 2.5, lw: 1 } : { lw: 1 }) : null);
  spec.forEach((p) => {
    if (p[0] === 'b') { const pts = [...P(0, 0), ...P(1, 0), ...P(1, 1), ...P(0, 1)]; poly(pts, p[1], mo(p[1]) || { lw: 1.2 }); }
    if (p[0] === 'p') { const pts = [...P(0, 0), ...P(1, 0), ...P(0.7, 0.5), ...P(1, 1), ...P(0, 1)]; poly(pts, p[1], mo(p[1]) || { lw: 1.2 }); }
    if (p[0] === 'r') { const [, u, v, uw, vh, c] = p; poly([...P(u, v), ...P(u + uw, v), ...P(u + uw, v + vh), ...P(u, v + vh)], c, mo(c)); }
    if (p[0] === 't') { const [, a, b, c2, d, e, f, c] = p; poly([...P(a, b), ...P(c2, d), ...P(e, f)], c, mo(c)); }
    if (p[0] === 'x') { const c = p[1], k = 0.12; poly([...P(0, 0), ...P(k, 0), ...P(1, 1 - k), ...P(1, 1), ...P(1 - k, 1), ...P(0, k)], c, mo(c)); poly([...P(1, 0), ...P(1, k), ...P(k, 1), ...P(0, 1), ...P(0, 1 - k), ...P(1 - k, 0)], c, mo(c)); }
  });
  if (!MARK) { const pts = [...P(0, 0), ...P(1, 0), ...P(1, 1), ...P(0, 1)]; path(pts, true); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1; g.stroke(); }
}
function flagLine(x1, y1, x2, y2, sag, n, seed, word) {
  word = word || 'SHORECLUB';
  g.strokeStyle = MARK ? INK : 'rgba(30,30,30,.8)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i <= 16; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / 16); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  for (let i = 1; i < n; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / n); flagICS(x - 5.5, y, 11, 13, word[(i - 1 + (seed || 0)) % word.length], Math.sin(S.t * 3 + i) * 1.5); }
}
function signBoard(x, y, w, h, kind) {
  rect(x - 4, y - 4, w + 8, h + 8, SC.blue, { lw: 1.6 }); rect(x - 2, y - 2, w + 4, h + 4, SC.red, { lw: 1 }); rect(x, y, w, h, '#f6f4ee', { lw: 1 });
  const ink = MARK ? INK : SC.red;
  if (kind === 'coming') { txt('COMING', x + w / 2, y + 7, 8, ink, { bold: true, font: "'Arial Narrow',Impact,sans-serif" }); txt('ATTRACTIONS', x + w / 2, y + 15, 7, ink, { bold: true, font: "'Arial Narrow',Impact,sans-serif" }); const act = ACTS[S.act]; [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([c, r], i) => rect(x + 4 + c * (w / 2 - 2), y + 22 + r * ((h - 26) / 2), w / 2 - 6, (h - 26) / 2 - 3, i === 0 ? act.cols[0] : ['#2a3b55', '#6a4c93', '#3a3f4b', '#1d4e89'][i], { lw: 0.8 })); txt(act.emo, x + 4 + (w / 2 - 6) / 2, y + 22 + ((h - 26) / 2 - 3) / 2, 10, '#000'); }
  else { txt('LOBSTER', x + w / 2, y + 8, 8, ink, { bold: true, font: "'Arial Narrow',Impact,sans-serif" }); txt('SUPPERS', x + w / 2, y + 16, 8, ink, { bold: true, font: "'Arial Narrow',Impact,sans-serif" }); txt('4:00 - 7:00', x + w / 2, y + 26, 5.5, MARK ? INK : SC.blueD); ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach((d, i) => txt(d, x + w / 2, y + 33 + i * 6.5, 5, MARK ? INK : SC.blueD)); lobster(x + 9, y + h - 9, 0.16, '#c8102e'); lobster(x + w - 9, y + h - 9, 0.16, '#c8102e'); }
}
function canopy(cx, base, rx, act, on, pu) {
  const amp = 30, N = 36, curve = (b) => { const pts = []; for (let i = 0; i <= N; i++) { const t = i / N * Math.PI; pts.push(cx - rx * Math.cos(t), b - amp * Math.sin(t)); } return pts; };
  const yAt = (b, x) => { const c = clamp((cx - x) / rx, -1, 1); return b - amp * Math.sqrt(1 - c * c); };
  // underside, seen from below, with two pot lights
  const und = curve(base + 26); poly(und, '#d9dee4', { lw: 1.6 }); if (!MARK) { g.fillStyle = 'rgba(30,40,60,.25)'; path(und, true); g.fill(); }
  glow(cx - 34, base + 12, 30, '#fff7b0', 0.75); glow(cx + 34, base + 12, 30, '#fff7b0', 0.75); ell(cx, base + 18, 3, 2, '#7a1d1d', { lw: 0.8 });
  // fascia: blue rims, white band, red and green neon
  const top = curve(base), bot = curve(base + 26), band = []; for (let i = 0; i < top.length; i += 2) band.push(top[i], top[i + 1]); for (let i = bot.length - 2; i >= 0; i -= 2) band.push(bot[i], bot[i + 1]);
  poly(band, SC.blue, { lw: 1.8 });
  const wb = [], c1 = curve(base + 11), c2 = curve(base + 15); for (let i = 0; i < c1.length; i += 2) wb.push(c1[i], c1[i + 1]); for (let i = c2.length - 2; i >= 0; i -= 2) wb.push(c2[i], c2[i + 1]);
  poly(wb, MARK ? '#ffe14a' : '#fff06a', { lw: 1 }); if (!MARK) { neonPath(curve(base + 13), '#ffe14a', 0.9, 2.2); }
  const fl = on ? 0.8 + pu * 0.4 : 0.75 + 0.06 * Math.sin(S.t * 9);
  neonPath(curve(base + 7), '#ff3b3b', fl, 2.6); neonPath(curve(base + 19.5), '#3dff7a', Math.min(1, fl * 1.25), 4.2); neonPath(curve(base + 23), '#7dffa8', fl * 0.8, 2);
  if (!MARK) { glow(cx, base + 24, rx * 1.05, '#3dff7a', 0.22 + (on ? pu * 0.15 : 0)); glow(cx, base + 13, rx * 0.8, '#ffe14a', 0.16); }
  // SHORE CLUB: red block letters standing on the canopy along its curve, on a thin rail
  const L = 'SHORE CLUB'.split(''), x0 = cx - rx * 0.86, x1 = cx + rx * 0.86;
  g.strokeStyle = MARK ? INK : '#5a1a1a'; g.lineWidth = 1.2; g.beginPath(); for (let i = 0; i <= 20; i++) { const x = x0 + (x1 - x0) * i / 20, y = yAt(base, x) - 38; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  L.forEach((ch, i) => {
    if (ch === ' ') return; const x = x0 + (x1 - x0) * (i + 0.5) / L.length, y = yAt(base, x) - 3, ang = Math.atan2(yAt(base, x + 2) - yAt(base, x - 2), 4) * 0.8;
    ln(x, y, x, y - 38, '#5a1a1a', 1, { mw: 1 });
    g.save(); g.translate(x, y); g.rotate(ang); g.font = "700 34px 'Arial Narrow','Oswald','Roboto Condensed',Impact,sans-serif"; g.textAlign = 'center'; g.textBaseline = 'bottom';
    if (MARK) { g.fillStyle = '#c8102e'; g.fillText(ch, 0, 0); g.strokeStyle = INK; g.lineWidth = 1.2; g.strokeText(ch, 0, 0); }
    else { g.fillStyle = '#4a0c10'; g.fillText(ch, 2, 1.5); g.fillStyle = '#b3262e'; g.fillText(ch, 0, 0); if (fl) { g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,60,60,' + (0.35 * fl) + ')'; g.lineWidth = 4; g.strokeText(ch, 0, 0); g.globalCompositeOperation = 'source-over'; } }
    g.restore(); glow(x, y - 16, 22, '#ff3b3b', 0.18 * fl);
  });
}
function suv(x, y, s, col) {
  poly([x, y - 10 * s, x + 6 * s, y - 24 * s, x + 26 * s, y - 27 * s, x + 36 * s, y - 42 * s, x + 86 * s, y - 43 * s, x + 100 * s, y - 28 * s, x + 112 * s, y - 24 * s, x + 114 * s, y - 8 * s, x, y - 6 * s], col, { h: 8 });
  poly([x + 39 * s, y - 39 * s, x + 84 * s, y - 40 * s, x + 95 * s, y - 28 * s, x + 31 * s, y - 27 * s], '#151a24');
  if (!MARK) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 4 * s, y - 22 * s, 106 * s, 2 * s); }
  [24, 92].forEach((dx) => { ell(x + dx * s, y - 6 * s, 11 * s, 11 * s, '#0b0b0b', { ink: true }); ell(x + dx * s, y - 6 * s, 5 * s, 5 * s, '#8a9098'); });
}
function rails(x0, y0, x1, y1, n) { // white handrail, blue posts
  for (let i = 0; i <= n; i++) { const k = i / n, x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k; rect(x - 2.5, y, 5, 26, SC.blue, { lw: 1 }); }
  ln(x0, y0, x1, y1, '#f4f6f8', 5, { mw: 2.4 }); ln(x0, y0 + 13, x1, y1 + 13, '#f4f6f8', 3.5, { mw: 1.8 });
}
function lattice(x0, y0, x1, y1) { rect(x0, y0, x1 - x0, y1 - y0, SC.blueD, { lw: 1.4 }); g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); g.strokeStyle = MARK ? INK : 'rgba(255,255,255,.22)'; g.lineWidth = 1; g.beginPath(); for (let x = x0 - (y1 - y0); x < x1; x += 7) { g.moveTo(x, y1); g.lineTo(x + (y1 - y0), y0); g.moveTo(x, y0); g.lineTo(x + (y1 - y0), y1); } g.stroke(); g.restore(); }
function edison(x1, y1, x2, y2, sag, n, a) {
  g.strokeStyle = MARK ? INK : 'rgba(18,14,10,.9)'; g.lineWidth = 1.1; g.beginPath(); for (let i = 0; i <= 20; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / 20); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  for (let i = 1; i < n; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / n), d = 5 + (i % 2) * 2, tw = (a || 0.85) * (S.playing ? 0.8 + 0.2 * Math.cos(i - S.beat * 2) : 0.9); ln(x, y, x, y + d, '#222', 1, { mw: 0.8 }); ell(x, y + d + 3, 1.8, 3, '#ffd28a', { lw: 0.6 }); glow(x, y + d + 3, 16, '#ffc46b', tw * 0.6); }
}
function sunsetClouds(yMax, key, dark) {
  const r = RNG(key.length * 77 + yMax);
  for (let i = 0; i < 16; i++) {
    const y = 30 + Math.pow(r(), 0.8) * (yMax - 80), x = r() * W - 60 + Math.sin(S.t * 0.02 + i) * 8, w = 120 + r() * 260, h = 10 + r() * 18, k = y / yMax;
    const base = dark ? mix('#2a2f4f', '#5a5470', k) : mix('#8a90a8', '#b9a8b8', k), lit = mix('#ff8a7a', '#ffc27a', k);
    if (MARK) { if (i % 2) { g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + w * 0.3, y - h, x + w * 0.7, y + h * 0.4, x + w, y - 2); g.stroke(); } continue; }
    g.globalAlpha = 0.8; g.fillStyle = base; g.beginPath(); g.ellipse(x + w / 2, y, w / 2, h, -0.05, 0, 7); g.fill();
    g.fillStyle = lit; g.globalAlpha = 0.55 * k + 0.1; g.beginPath(); g.ellipse(x + w / 2 + 10, y + h * 0.45, w / 2.4, h * 0.45, -0.05, 0, 7); g.fill(); g.globalAlpha = 1;
  }
}
function cirrus(yMax, a) { if (MARK) { g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 9; i++) { const y = 20 + i * yMax / 10; g.moveTo(40 + i * 30, y); g.quadraticCurveTo(400, y - 30, 900 - i * 20, y + 10); } g.stroke(); return; } g.strokeStyle = `rgba(255,255,255,${0.18 * a})`; g.lineCap = 'round'; for (let i = 0; i < 26; i++) { const y = 10 + (i * 37 % yMax), x = (i * 131 + S.t * 3) % (W + 400) - 200; g.lineWidth = 2 + (i % 4) * 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 160, y - 14, x + 360, y + 6); g.stroke(); } }
function boulder(x, y, r, seed, night, white) {
  const rr = RNG(seed), pts = []; for (let i = 0; i < 12; i++) { const a = Math.PI + i / 11 * Math.PI, k = 0.82 + rr() * 0.25; pts.push(x + Math.cos(a) * r * 1.15 * k, y + Math.sin(a) * r * 0.85 * k); } pts.push(x + r * 1.1, y + 2, x - r * 1.1, y + 2);
  poly(pts, white ? (night ? '#8a8e98' : '#e6e3dc') : night ? '#4a4f5a' : '#a9a9a4', { lw: 1.6 });
  if (!MARK) { g.save(); path(pts, true); g.clip(); g.fillStyle = night ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(x - r * 0.3, y - r * 0.5, r * 0.6, r * 0.35, -0.3, 0, 7); g.fill(); for (let i = 0; i < r * 2; i++) { g.fillStyle = rr() < 0.5 ? 'rgba(40,40,40,.35)' : 'rgba(255,255,255,.35)'; g.fillRect(x - r + rr() * r * 2, y - r * 0.9 + rr() * r * 0.9, 1.4, 1.4); } g.restore(); }
  else { g.fillStyle = INK; for (let i = 0; i < r; i++) g.fillRect(x - r * 0.8 + rr() * r * 1.6, y - r * 0.7 + rr() * r * 0.7, 1, 1); }
}
function seaweed(x, y, w, seed) { const r = RNG(seed); g.strokeStyle = MARK ? INK : '#3a2a14'; g.lineWidth = 1.6; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i < w / 4; i++) { const xx = x + i * 4 + r() * 3, yy = y + Math.sin(i * 0.7 + seed) * 3 + r() * 3; g.moveTo(xx, yy); g.quadraticCurveTo(xx + 3, yy - 3 + r() * 6, xx + 6 + r() * 4, yy + r() * 3 - 1); } g.stroke(); }
function grassTufts(x0, x1, y0, y1, seed, col) { const r = RNG(seed); g.strokeStyle = MARK ? INK : col; g.lineWidth = 1.1; g.beginPath(); for (let i = 0; i < (x1 - x0) / 2.5; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), l = 10 + r() * 18, sw = Math.sin(S.t * 1.3 + x * 0.05) * 3; g.moveTo(x, y); g.quadraticCurveTo(x + 1, y - l * 0.6, x + sw + 2, y - l); } g.stroke(); }
function ketch(x, y, s) {
  poly([x - 30 * s, y, x + 32 * s, y, x + 26 * s, y + 7 * s, x - 24 * s, y + 7 * s], '#f4f4f0', { lw: 1.4 });
  ln(x + 4 * s, y, x + 4 * s, y - 62 * s, '#6a4a2a', 1.6 * s, { mw: 1.4 }); ln(x - 16 * s, y, x - 16 * s, y - 36 * s, '#6a4a2a', 1.4 * s, { mw: 1.2 });
  poly([x + 5 * s, y - 60 * s, x + 5 * s, y - 3 * s, x + 26 * s, y - 3 * s], '#fbfbf6', { lw: 1.2 }); poly([x + 3 * s, y - 56 * s, x - 12 * s, y - 4 * s, x + 2 * s, y - 4 * s], '#f0efe8', { lw: 1.2 }); poly([x - 15 * s, y - 34 * s, x - 15 * s, y - 3 * s, x - 2 * s, y - 3 * s], '#f0efe8', { lw: 1.2 });
}
function swimDock(x, y, s) { poly([x - 34 * s, y, x + 34 * s, y, x + 30 * s, y + 6 * s, x - 30 * s, y + 6 * s], '#b9b2a2', { lw: 1.2 }); rect(x - 32 * s, y + 4 * s, 64 * s, 3 * s, '#6a5a4a'); [-16, 8].forEach((dx) => { ln(x + dx * s, y, x + dx * s, y - 9 * s, '#d0d4d8', 1.4, { mw: 1.2 }); ln(x + (dx + 6) * s, y, x + (dx + 6) * s, y - 9 * s, '#d0d4d8', 1.4, { mw: 1.2 }); ln(x + dx * s, y - 9 * s, x + (dx + 6) * s, y - 9 * s, '#d0d4d8', 1.4, { mw: 1.2 }); }); }
function canadaFlag(x, y, s) { ln(x, y, x, y - 70 * s, '#cfd3d8', 1.6, { mw: 1.4 }); const fl = Math.sin(S.t * 2) * 2; poly([x, y - 70 * s, x + 24 * s, y - 70 * s + fl, x + 24 * s, y - 58 * s + fl, x, y - 58 * s], '#f4f4f4', { lw: 1 }); rect(x, y - 70 * s, 6 * s, 12 * s, '#d52b1e', MARK ? { h: 2 } : null); poly([x + 18 * s, y - 70 * s + fl, x + 24 * s, y - 70 * s + fl, x + 24 * s, y - 58 * s + fl, x + 18 * s, y - 58 * s + fl], '#d52b1e', MARK ? { h: 2 } : null); ell(x + 12 * s, y - 64 * s + fl / 2, 2.4 * s, 2.4 * s, '#d52b1e', MARK ? { h: 2 } : null); }
function nsFlag(x, y, s) { ln(x, y, x, y - 70 * s, '#cfd3d8', 1.6, { mw: 1.4 }); const fl = Math.sin(S.t * 2 + 1) * 2; poly([x, y - 70 * s, x + 24 * s, y - 70 * s + fl, x + 24 * s, y - 56 * s + fl, x, y - 56 * s], '#f4f4f4', { lw: 1 }); ln(x + 1, y - 69 * s, x + 23 * s, y - 57 * s + fl, '#2a5fae', 2.6 * s, { mw: 2 }); ln(x + 23 * s, y - 69 * s + fl, x + 1, y - 57 * s, '#2a5fae', 2.6 * s, { mw: 2 }); }
function cottage(x, y, s, col, lit) { rect(x - 18 * s, y - 16 * s, 36 * s, 16 * s, col, { lw: 1.2 }); poly([x - 22 * s, y - 16 * s, x + 22 * s, y - 16 * s, x + 12 * s, y - 28 * s, x - 12 * s, y - 28 * s], '#2a2f38', { lw: 1.2 }); [-9, 6].forEach((dx) => { rect(x + dx * s, y - 12 * s, 6 * s, 6 * s, lit ? '#ffcf7a' : '#3a4a5a', { lw: 0.8 }); if (lit) glow(x + (dx + 3) * s, y - 9 * s, 12 * s, '#ffcf7a', 0.6); }); }
function glowBall(i, xMin, xMax, yTop, yBot, on) {
  const cols = ['#5cf0ff', '#ff4fd8', '#7dff6b', '#ffcf3d', '#ff5a5a', '#9a7dff'], c = cols[i % cols.length], sp = 0.9 + (i % 3) * 0.2;
  const ph = (S.beat * (on ? 0.5 : 0.1) * sp + i * 0.37) % 1, x = xMin + ((i * 0.29 + S.t * 0.012 * (i % 2 ? 1 : -1)) % 1 + 1) % 1 * (xMax - xMin), y = yBot - Math.sin(ph * Math.PI) * (yBot - yTop);
  glow(x, y, 26, c, 0.7); ell(x, y, 7, 9, c, { lw: 1.2 }, Math.sin(S.t + i) * 0.5); if (!MARK) ell(x - 2, y - 3, 2, 3, '#ffffff');
}
function truss(x0, x1, y, h) { rect(x0, y, x1 - x0, 2, '#e8ebef', { lw: 0.8 }); rect(x0, y + h - 2, x1 - x0, 2, '#e8ebef', { lw: 0.8 }); g.strokeStyle = MARK ? INK : '#d6dade'; g.lineWidth = 1; g.beginPath(); for (let x = x0, k = 0; x < x1; x += h, k++) { g.moveTo(x, k % 2 ? y : y + h); g.lineTo(x + h, k % 2 ? y + h : y); } g.stroke(); }
function blinder(x, y, s, a) { rect(x - 9 * s, y, 18 * s, 18 * s, '#141414', { ink: true, noline: true }); [[-4, 5], [4, 5], [-4, 13], [4, 13]].forEach(([dx, dy]) => { bulb(x + dx * s, y + dy * s, 2.2 * s, '#ffd060', a); }); }
function parCan(x, y, s, col, a) { ell(x, y, 9 * s, 9 * s, '#121212', { ink: true, noline: true }); if (!MARK) { g.fillStyle = mix(col, '#000000', 0.5); g.beginPath(); g.arc(x, y, 7 * s, 0, 7); g.fill(); } g.fillStyle = MARK ? col : mix(col, '#ffffff', 0.3 * a); for (let r = 0; r < 3; r++) for (let k = 0; k < (r ? r * 6 : 1); k++) { const an = k / (r ? r * 6 : 1) * Math.PI * 2; g.globalAlpha = 0.4 + 0.6 * a; g.beginPath(); g.arc(x + Math.cos(an) * r * 2.3 * s, y + Math.sin(an) * r * 2.3 * s, 0.9 * s, 0, 7); g.fill(); } g.globalAlpha = 1; glow(x, y, 20 * s, col, a * 0.6); }
function lineArray(x, y, n, s) { for (let i = 0; i < n; i++) { const dx = Math.max(0, i - n * 0.6) * 1.2 * s; poly([x + dx, y + i * 11 * s, x + dx + 28 * s, y + i * 11 * s, x + dx + 26 * s, y + (i + 1) * 11 * s - 1, x + dx + 2 * s, y + (i + 1) * 11 * s - 1], '#101114', { lw: 1 }); if (!MARK) { g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + dx + 4 * s, y + i * 11 * s + 4 * s, 20 * s, 1.5); } } }
function pallettChair(x, y, s) { rect(x - 16 * s, y - 12 * s, 32 * s, 12 * s, '#a89c8a', { lw: 1.2 }); rect(x - 16 * s, y - 28 * s, 32 * s, 6 * s, '#b4a894', { lw: 1.2 }); rect(x - 16 * s, y - 28 * s, 4 * s, 28 * s, '#9a8e7c', { lw: 1 }); rect(x + 12 * s, y - 28 * s, 4 * s, 28 * s, '#9a8e7c', { lw: 1 }); }
function umbrella(x, y, s, cols) { ln(x, y + 30 * s, x + 4 * s, y - 40 * s, '#e8e8e8', 2, { mw: 1.6 }); const n = cols.length; for (let i = 0; i < n; i++) { const a0 = Math.PI + i / n * Math.PI, a1 = Math.PI + (i + 1) / n * Math.PI; poly([x + 4 * s, y - 50 * s, x + 4 * s + Math.cos(a0) * 50 * s, y - 34 * s + Math.sin(a0) * -2, x + 4 * s + Math.cos(a1) * 50 * s, y - 34 * s + Math.sin(a1) * -2], cols[i], { lw: 1 }); } }
function lounger(x, y, s) { const cols = ['#1d4e89', '#e9eef5', '#c8102e', '#3a8ad8', '#1d4e89', '#e9eef5', '#3a8ad8']; cols.forEach((c, i) => poly([x + i * 6 * s, y - 34 * s + i * 4 * s, x + (i + 1) * 6 * s, y - 34 * s + (i + 1) * 4 * s, x + (i + 1) * 6 * s + 14 * s, y - 4 * s, x + i * 6 * s + 14 * s, y - 4 * s], c, { lw: 0.8 })); ln(x + 10 * s, y, x + 58 * s, y, '#333', 2, { mw: 1.4 }); }
function towel(x, y, s, cols) { cols.forEach((c, i) => poly([x + i * 6 * s, y, x + (i + 1) * 6 * s, y, x + (i + 1) * 6 * s + 20 * s, y + 22 * s, x + i * 6 * s + 20 * s, y + 22 * s], c, { lw: 0.6 })); }
function duckling(x, y, s, ph) { const b = Math.abs(Math.sin(ph)) * 1.5 * s; ell(x, y - 5 * s - b, 6 * s, 4.5 * s, '#3a3428', { lw: 1 }); ell(x + 4 * s, y - 10 * s - b, 3.2 * s, 3 * s, '#4a4230', { lw: 1 }); poly([x + 7 * s, y - 10 * s - b, x + 10 * s, y - 9.5 * s - b, x + 7 * s, y - 9 * s - b], '#2a2418'); ln(x - 1 * s, y - 1 * s, x - 1 * s + Math.sin(ph) * 2 * s, y + 1.5 * s, '#b07a2a', 1.2, { mw: 1 }); ln(x + 2 * s, y - 1 * s, x + 2 * s - Math.sin(ph) * 2 * s, y + 1.5 * s, '#b07a2a', 1.2, { mw: 1 }); }
function firePit(x, y, s, pu) {
  // paver ring and steel bowl, from the campfire photo
  for (let i = 0; i < 12; i++) { const a0 = Math.PI * 0.05 + i / 12 * Math.PI * 0.9, a1 = a0 + Math.PI * 0.9 / 12 - 0.02; poly([x + Math.cos(a0) * 46 * s, y + Math.sin(a0) * 16 * s, x + Math.cos(a1) * 46 * s, y + Math.sin(a1) * 16 * s, x + Math.cos(a1) * 34 * s, y + Math.sin(a1) * 11 * s, x + Math.cos(a0) * 34 * s, y + Math.sin(a0) * 11 * s], '#7a5a40', { lw: 1 }); }
  ell(x, y, 34 * s, 11 * s, '#1a1a1a', { lw: 1.4 }); ell(x, y - 1, 30 * s, 9 * s, '#3a2410', { lw: 1 });
  ln(x - 18 * s, y - 2 * s, x + 14 * s, y - 8 * s, '#4a3020', 6 * s, { mw: 3 }); ln(x - 10 * s, y - 9 * s, x + 20 * s, y, '#3a2416', 6 * s, { mw: 3 });
  glow(x, y - 20 * s, 150 * s, '#ff8a3d', 0.55 + pu * 0.2);
  for (let i = 0; i < 7; i++) { const h = (34 + 20 * Math.sin(S.t * 7 + i * 1.7) + pu * 10) * s, w = (13 - i) * s; const pts = [x - w - 8 * s + i * 3 * s, y - 4 * s, x + Math.sin(S.t * 5 + i) * 7 * s + (i - 3) * 3 * s, y - h, x + w + 8 * s - i * 3 * s, y - 4 * s]; path(pts, true); g.globalCompositeOperation = MARK ? 'multiply' : 'lighter'; g.fillStyle = ['#ff5a1f', '#ff8a3d', '#ffb347', '#ffd27a', '#fff1b0', '#ff7a2a', '#ffe08a'][i]; g.globalAlpha = 0.75; g.fill(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
  for (let i = 0; i < 14; i++) { const k = ((S.t * 0.6 + i / 14) % 1); bulb(x + Math.sin(i * 7 + S.t * 2) * 22 * k * s, y - 40 * s - k * 120 * s, 1.1, '#ffd27a', 1 - k); }
}
function moonCrescent(x, y, r) { glow(x + r * 0.5, y, r * 4, '#fff3c4', 0.45); const pts = []; for (let i = 0; i <= 16; i++) { const t = -Math.PI / 2 + i / 16 * Math.PI; pts.push(x + r * Math.cos(t), y + r * Math.sin(t)); } for (let i = 16; i >= 0; i--) { const t = -Math.PI / 2 + i / 16 * Math.PI; pts.push(x + r * 0.35 * Math.cos(t), y + r * Math.sin(t)); } poly(pts, '#fff6dc', { lw: 1.4 }); }

/* ---------------- scenes ---------------- */
function sceneOutside() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#151a3a', k: 0.42 };
  skyGrad(['#121738', '#262a55', '#4c4472', '#a8607a', '#f0a060'], 330); stars(110, 0.5);
  sunsetClouds(320, 'outside', true);
  spruceLine('o-trees3', 300, 90, '#0a101c', 0, W);
  ground(440, H, '#2a2c32', '#17181c');
  if (!MARK) { g.fillStyle = '#1e2b1c'; g.fillRect(0, 448, W, 14); const r = RNG(3); g.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 260; i++) g.fillRect(r() * W, 462 + r() * 78, 2, 1); }
  const wall = MARK ? PAPER : '#aab6c8', wallLit = '#b9c4d4';
  // left wing
  clapboard(0, 176, 262, 452, wall, 9); rect(256, 176, 6, 276, SC.blue); rect(-6, 168, 274, 10, SC.blueD, { lw: 1.4 });
  // nautical signal flags across the top, then two sets of windows
  'WELCOME'.split('').forEach((ch, i) => flagICS(14 + i * 34, 184, 30, 30, ch, 0));
  windowGrid(30, 228, 96, 44, 3, 1, { glow: '#ffd9a0', lit: 0.65, curtain: '#3a6aa8' }); windowGrid(140, 228, 96, 44, 3, 1, { glow: '#ffd9a0', lit: 0.65, curtain: '#3a6aa8' });
  windowGrid(36, 338, 128, 62, 4, 2, { glow: '#ffcf8a', lit: 0.75, curtain: '#3a6aa8' }); lattice(0, 446, 262, 458);
  // long hall: metal roof, cupola, ribbon windows
  metalRoof(498, 304, 914, 316, 862, 236, 544, 222, SC.roofN, 30); cupola(640, 228, 1.1, true);
  clapboard(498, 304, 906, 452, wall, 9); rect(498, 300, 408, 6, SC.blue);
  const wc = (c) => mix('#ffcf8a', act.cols[c % act.cols.length], on ? 0.35 + 0.25 * Math.sin(S.beat * Math.PI + c) : 0.15);
  windowGrid(520, 332, 368, 76, 14, 2, { glowCol: wc, lit: 0.8 + pu * 0.2, people: true }); lattice(498, 446, 906, 458);
  // the deck and pergola at the end, with Edison string lights
  rect(906, 380, 60, 70, '#6a6a68', { lw: 1.4 }); for (let x = 910; x < 966; x += 12) rect(x, 446, 4, 30, '#4a4a48');
  for (let i = 0; i < 4; i++) rect(902 + i * 22, 330, 4, 50, '#7a7a76', { lw: 1 }); rect(890, 326, 80, 5, '#8a8a86', { lw: 1 });
  edison(898, 332, 960, 330, 6, 6); edison(860, 300, 960, 318, 14, 8);
  // entrance block under the canopy and SHORE CLUB letters
  clapboard(262, 226, 500, 452, wall, 9); rect(494, 226, 6, 226, SC.blue); rect(262, 220, 244, 8, SC.blueD, { lw: 1.4 });
  if (!MARK) { glow(381, 300, 170, '#3dff7a', 0.3 + pu * 0.1); glow(381, 270, 90, '#b8ff9a', 0.18); }
  // door with porthole windows, red frame; lanterns; boards; 250
  rect(346, 306, 70, 128, SC.red, { lw: 1.6 }); rect(350, 310, 31, 124, '#2f5f92', { lw: 1.4 }); rect(383, 310, 31, 124, '#2f5f92', { lw: 1.4 });
  [[365.5, 0], [398.5, 1]].forEach(([x, d]) => { ell(x, 348, 9.5, 9.5, SC.red, { lw: 1.4 }); ell(x, 348, 7.2, 7.2, on ? mix('#ffb35a', act.cols[d], 0.4) : '#c9803a', { lw: 1 }); glow(x, 348, 22, act.cols[d], on ? 0.35 + pu * 0.4 : 0.2); });
  shipLantern(326, 314, 1.1, '#ff3030', 0.85); shipLantern(438, 314, 1.1, '#2cff6a', 0.85);
  signBoard(280, 338, 48, 76, 'coming'); signBoard(434, 338, 48, 70, 'lobster');
  rect(438, 416, 40, 16, SC.blueD, { lw: 1 }); txt('250', 458, 424.5, 12, MARK ? INK : '#f4f6f8', { bold: true, font: 'Arial,sans-serif' });
  canopy(381, 252, 122, act, on, pu);
  // red-and-white stairs with the painted lobster, white rails on blue posts
  for (let i = 0; i < 5; i++) { const x0 = 334 - i * 8, x1 = 428 + i * 8, y0 = 434 + i * 10; poly([x0, y0, x1, y0, x1, y0 + 10, x0, y0 + 10], i % 2 ? '#a3262c' : '#f1eeea', { lw: 1.3 }); if (!MARK) { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x0, y0 + 8.5, x1 - x0, 1.5); } }
  poly([362, 434, 400, 434, 418, 484, 344, 484], '#b3262e', MARK ? { h: 4, ha: 1.2 } : { lw: 1 });
  lobster(381, 447, 0.62, '#e8463a');
  rails(334, 410, 290, 470, 3); rails(428, 410, 472, 470, 3);
  // cars along the hall and a streetlight
  suv(512, 500, 1.4, '#1d2230'); suv(676, 502, 1.4, '#6a7078'); suv(830, 560, 1.9, '#14171e');
  lightPole(930, 540, 250, '#fff0c8');
  buildCrowd(); drawCrowd(amb, '#ffd9a0');
  vignette();
}
function deckLot() {
  // the right half beyond the rail: the Shore Club parking lot
  poly([236, 270, 520, 266, 520, 404, 226, 404], '#3a3c44', { h: 7 });
  if (!MARK) { const gr = g.createLinearGradient(0, 266, 0, 404); gr.addColorStop(0, 'rgba(120,110,140,.25)'); gr.addColorStop(1, 'rgba(0,0,0,.25)'); g.fillStyle = gr; g.fillRect(226, 266, 294, 138); }
  poly([222, 270, 244, 270, 236, 404, 214, 404], '#2f4a34', { h: 3 }); grassTufts(214, 246, 280, 400, 31, '#4f7a46');
  g.strokeStyle = MARK ? INK : 'rgba(240,240,230,.55)'; g.lineWidth = 1; g.beginPath();
  for (let i = 0; i < 6; i++) { const x = 262 + i * 48; g.moveTo(x, 288); g.lineTo(x - 2, 300); g.moveTo(x - 6 + i * 2, 318); g.lineTo(x - 10 + i * 2, 340); } g.stroke();
  [[258, 300, 0.42, '#c8102e'], [306, 300, 0.42, '#e9eef5', 'truck'], [404, 300, 0.42, '#3a5f94']].forEach(([x, y, s, c, t]) => car(x, y, s, c, t));
  [[244, 342, 0.55, '#6a7078'], [340, 342, 0.55, '#1d2230'], [430, 344, 0.52, '#7a2a2a']].forEach(([x, y, s, c]) => car(x, y, s, c));
  lightPole(498, 404, 268, '#ffe8b0');
}
function deckStairs() {
  // stairs down from the deck into the lot, white rails, blue posts
  for (let i = 0; i < 7; i++) { const y = 400 - i * 6.5, x0 = 302 + i * 3, x1 = 374 - i * 1.5; rect(x0, y - 4, x1 - x0, 3.5, i % 2 ? '#a8a294' : '#b8b2a4', { lw: 0.8 }); rect(x0, y - 0.5, x1 - x0, 2, '#5a564e', { noline: true }); }
  ln(300, 352, 324, 352 - 40, '#f4f6f8', 3, { mw: 1.8 }); ln(376, 352, 366, 352 - 40, '#f4f6f8', 3, { mw: 1.8 });
  rect(298, 352, 5, 52, SC.blue, { lw: 1 }); rect(373, 352, 5, 52, SC.blue, { lw: 1 });
}
function redCouch(x, y, s) {
  const red = '#b3262e', redL = '#d8414a', redD = '#7a1820';
  rect(x - 46 * s, y - 34 * s, 92 * s, 22 * s, red, { lw: 1.4 });
  if (!MARK) rect(x - 44 * s, y - 32 * s, 88 * s, 5 * s, redL);
  rect(x - 44 * s, y - 14 * s, 88 * s, 10 * s, redL, { lw: 1.2 }); ln(x, y - 14 * s, x, y - 4 * s, redD, 1);
  rect(x - 54 * s, y - 24 * s, 12 * s, 22 * s, red, { lw: 1.4 }); rect(x + 42 * s, y - 24 * s, 12 * s, 22 * s, red, { lw: 1.4 });
  rect(x - 50 * s, y - 4 * s, 100 * s, 5 * s, redD, { lw: 1 });
  [-46, 44].forEach((dx) => rect(x + dx * s, y + 1 * s, 3 * s, 4 * s, '#2a1a12'));
  ell(x - 26 * s, y - 22 * s, 8 * s, 6 * s, '#f2c14e', { lw: 1 }); ell(x + 28 * s, y - 22 * s, 8 * s, 6 * s, '#f4f1de', { lw: 1 });
}
function outdoorBar(x0, x1, y) {
  // a little outdoor bar against the hall: counter, taps, stools and a lantern
  rect(x0, y - 4, x1 - x0, 6, '#6a4a2e', { lw: 1.2 }); rect(x0 + 4, y + 2, x1 - x0 - 8, 30, '#8a6a46', { lw: 1.2 });
  g.strokeStyle = MARK ? INK : 'rgba(40,24,10,.5)'; g.lineWidth = 1; g.beginPath(); for (let x = x0 + 14; x < x1 - 6; x += 12) { g.moveTo(x, y + 4); g.lineTo(x, y + 30); } g.stroke();
  for (let i = 0; i < 3; i++) { const tx = x0 + 30 + i * 12; ln(tx, y - 4, tx, y - 16, '#c0c4c8', 2, { mw: 1.4 }); ell(tx, y - 17, 2.5, 2.5, ['#c8102e', '#f2c14e', '#1d4e89'][i]); }
  [0, 1, 2, 3].forEach((i) => { const sx = x0 + 22 + i * ((x1 - x0 - 44) / 3); ell(sx, y + 34, 9, 3, '#3a2a1a', { lw: 1 }); ln(sx, y + 36, sx, y + 50, '#2a2a2a', 2, { mw: 1.4 }); });
  txt('BAR', (x0 + x1) / 2, y - 26, 12, MARK ? INK : '#ffe9b0', { bold: true }); glow((x0 + x1) / 2, y - 30, 30, '#ffb35a', 0.35);
  shipLantern(x1 - 14, y - 22, 0.7, '#ffb35a', 0.8);
}
function portholeDoor(x, y, s, on, pu) {
  // the side door: blue door with a round porthole window
  rect(x - 22 * s, y - 92 * s, 44 * s, 92 * s, '#f4f6f8', { lw: 1.4 });
  rect(x - 18 * s, y - 88 * s, 36 * s, 88 * s, SC.blue, { lw: 1.4 });
  porthole(x, y - 60 * s, 10 * s, '#d9dde2', true, pu, 9);
  ell(x + 12 * s, y - 42 * s, 2.2 * s, 2.2 * s, '#e8c060', { lw: 0.8 });
  rect(x - 26 * s, y - 2 * s, 52 * s, 4 * s, '#6a6a6a', { lw: 1 });
  bulb(x, y - 100 * s, 2.2, '#fff2c0', 0.9); glow(x, y - 98 * s, 26, '#ffd890', on ? 0.4 + pu * 0.2 : 0.3);
}
function sceneDeck() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#1a2040', k: 0.35 };
  skyGrad(['#22284e', '#4a4f7a', '#8a86a8', '#c9a4a8'], 300); sunsetClouds(250, 'deck', false);
  // the cove beyond the left rail: far shore, water, boats, the Nova Scotia flag
  poly([0, 262, 120, 250, 260, 256, 400, 248, 520, 258, 520, 300, 0, 300], '#1a2a2a', { h: 6 });
  spruceLine('d-far', 258, 22, '#132022', 0, 520, { h: 6 });
  for (let i = 0; i < 5; i++) { const x = 40 + i * 98; glow(x, 262, 6, '#ffd890', 0.7); }
  water(286, 360, '#3a4a6e', '#2a3858', [[200, '#ffcf7a', 0.3, 8]]);
  [[70, 314, 0.45], [150, 304, 0.4], [205, 322, 0.5]].forEach(([x, y, s], i) => { const b = Math.sin(S.t * 0.8 + i) * 1.5; poly([x - 24 * s, y + b, x + 26 * s, y + b, x + 20 * s, y + 7 * s + b, x - 18 * s, y + 7 * s + b], '#e4e6ea', { lw: 1 }); ln(x, y + b, x, y - 52 * s + b, '#ddd', 1.2, { mw: 1 }); bulb(x, y - 54 * s + b, 1.2, '#ffffff', 0.8); });
  nsFlag(40, 360, 1.1);
  deckLot();
  // the hall: big gable with louvre vent, the angled bay, cupola, stone chimney
  const wall = MARK ? PAPER : '#b7c3d6';
  clapboard(560, 250, 960, 420, wall, 8); poly([548, 254, 760, 96, 972, 254, 960, 254, 760, 110, 560, 254], SC.blue, { lw: 1.4 }); poly([560, 254, 760, 110, 960, 254], wall, { lw: 1 });
  g.save(); path([560, 254, 760, 110, 960, 254], true); g.clip(); clapboard(560, 100, 960, 254, wall, 8); g.restore();
  rect(742, 140, 36, 72, SC.blue, { lw: 1.2 }); rect(746, 144, 28, 64, '#2a2e36'); g.strokeStyle = MARK ? INK : '#9aa'; g.lineWidth = 1.4; g.beginPath(); for (let y = 148; y < 206; y += 5) { g.moveTo(748, y); g.lineTo(772, y + 2); } g.stroke();
  cupola(880, 150, 1, true);
  rect(930, 120, 26, 140, '#7a7066', { lw: 1.4 }); if (!MARK) { const r = RNG(6); for (let i = 0; i < 40; i++) { g.fillStyle = ['#8a8070', '#6a6056', '#9a9284'][i % 3]; g.beginPath(); g.ellipse(932 + r() * 22, 124 + r() * 134, 4, 3, 0, 0, 7); g.fill(); } } else { g.strokeStyle = INK; g.lineWidth = 0.8; for (let i = 0; i < 16; i++) { g.beginPath(); g.ellipse(936 + (i % 3) * 8, 128 + i * 8, 4, 3, 0, 0, 7); g.stroke(); } } rect(927, 116, 32, 6, '#5a524a', { lw: 1 });
  windowGrid(640, 318, 220, 60, 4, 2, { glow: '#ff9a7a', lit: 0.7 + pu * 0.25, people: true });
  // the angled bay with louvres
  poly([470, 278, 510, 270, 510, 420, 470, 412], mix(wall, '#000000', MARK ? 0 : 0.15), { lw: 1.4 }); clapboard(510, 270, 620, 420, wall, 8); poly([620, 270, 650, 278, 650, 412, 620, 420], mix(wall, '#000000', MARK ? 0 : 0.12), { lw: 1.4 });
  rect(466, 262, 188, 9, SC.blue, { lw: 1.2 });
  [[530, 290], [585, 290]].forEach(([x, y]) => { rect(x, y, 30, 22, SC.blue); rect(x + 3, y + 3, 24, 16, '#e4e8ee'); g.strokeStyle = MARK ? INK : '#8a96a6'; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 5; k++) { g.moveTo(x + 4, y + 5 + k * 3); g.lineTo(x + 26, y + 5 + k * 3); } g.stroke(); });
  outdoorBar(668, 860, 398); portholeDoor(902, 418, 1, on, pu);
  neonText('Tonight', 565, 340, 16, '#ff3d7f', on ? 0.7 + pu * 0.4 : 0.55); neonText(act.name, 565, 364, 11, act.cols[0], on ? 0.75 + pu * 0.3 : 0.5, "'Pacifico',cursive", 'center', 100);
  // rail along the left (horizontal slats), then the weathered deck
  for (const [a, b] of [[0, 300], [376, 470]]) { for (let y = 360; y < 400; y += 9) rect(a, y, b - a, 5, '#8c887e', { lw: 0.8 }); rect(a, 350, b - a, 6, '#9a968c', { lw: 1 }); } for (const x of [0, 90, 180, 292, 376, 462]) rect(x, 352, 8, 52, '#7a766c', { lw: 1 }); deckStairs();
  poly([0, 404, 470, 404, 470, 412, 960, 420, 960, 540, 0, 540], '#8a8578');
  if (!MARK) { const gr = g.createLinearGradient(0, 404, 0, 540); gr.addColorStop(0, 'rgba(20,24,48,.35)'); gr.addColorStop(1, 'rgba(255,200,140,.05)'); g.fillStyle = gr; g.fillRect(0, 404, W, 136); }
  g.strokeStyle = MARK ? INK : 'rgba(40,36,30,.45)'; g.lineWidth = 1; g.beginPath(); for (let i = -22; i <= 22; i++) { g.moveTo(520 + i * 30, 406); g.lineTo(520 + i * 110, H); } g.stroke();
  if (!MARK) { g.strokeStyle = 'rgba(255,255,255,.06)'; g.beginPath(); for (let i = 0; i < 30; i++) { const y = 420 + i * 4.2, x = (i * 97) % W; g.moveTo(x, y); g.lineTo(x + 80, y + 1); } g.stroke(); }
  redCouch(236, 440, 0.9); redCouch(698, 432, 0.9);
  // criss-crossed Edison string lights
  edison(-20, 30, 600, 262, 50, 22); edison(-20, 110, 520, 270, 40, 18); edison(-20, 190, 470, 276, 30, 14); edison(120, -10, 760, 140, 60, 20); edison(300, -10, 900, 230, 50, 20); edison(-20, 70, 960, 70, 80, 30);
  // chalkboard with tonight's act
  poly([130, 470, 150, 410, 170, 470], '#5a4a3a', { lw: 1.2 }); rect(124, 404, 52, 44, '#1d2a24', { lw: 1.4 }); txt('TONIGHT', 150, 414, 7, MARK ? INK : '#e8e8e0', { bold: true }); txt(act.emo, 150, 432, 14, '#000');
  buildCrowd(); drawCrowd(amb, '#ffd9a0');
  vignette();
}
function insideWall() {
  // the back wall either side of the stage: blue boards
  g.strokeStyle = MARK ? INK : 'rgba(255,255,255,.06)'; g.lineWidth = 1; g.beginPath(); for (let y = 132; y < 340; y += 9) { g.moveTo(150, y); g.lineTo(300, y); g.moveTo(660, y); g.lineTo(810, y); } g.stroke();
}
function sideWindows() {
  // windows in the right wall looking out at the parking lot, with a slice of the bay
  const top = (x) => 120 + (x - 810) * 130 / 150, bot = (x) => 340 + (x - 810) * 200 / 150;
  [[822, 868, 1], [888, 944, 0]].forEach(([a, b, bay]) => {
    const yA0 = top(a) + (bot(a) - top(a)) * 0.2, yA1 = top(a) + (bot(a) - top(a)) * 0.56, yB0 = top(b) + (bot(b) - top(b)) * 0.2, yB1 = top(b) + (bot(b) - top(b)) * 0.56;
    const q = [a, yA0, b, yB0, b, yB1, a, yA1];
    poly([a - 5, yA0 - 5, b + 5, yB0 - 6, b + 5, yB1 + 7, a - 5, yA1 + 5], '#f4f6f8', { lw: 1.2 });
    g.save(); path(q, true); g.clip();
    if (!MARK) { const gr = g.createLinearGradient(0, yA0, 0, yB1); gr.addColorStop(0, '#1a2050'); gr.addColorStop(0.45, '#4a4a7a'); gr.addColorStop(0.5, '#2a3a5a'); gr.addColorStop(1, '#2a2c34'); g.fillStyle = gr; g.fillRect(a - 5, Math.min(yA0, yB0) - 5, b - a + 10, Math.max(yA1, yB1) - Math.min(yA0, yB0) + 10); }
    else { g.fillStyle = PAPER; g.fillRect(a - 5, yA0 - 10, b - a + 10, yB1 - yA0 + 20); }
    const mid = (k) => [a + (b - a) * k, yA0 + (yB0 - yA0) * k + ((yA1 + (yB1 - yA1) * k) - (yA0 + (yB0 - yA0) * k)) * 0.42];
    if (bay) { const [x0, y0] = mid(0); g.fillStyle = MARK ? PAPER : '#2a4a72'; g.fillRect(a - 5, y0 - 10, (b - a) * 0.75, 10); if (!MARK) { g.fillStyle = 'rgba(255,220,160,.35)'; for (let i = 0; i < 4; i++) g.fillRect(a + 4 + i * 8 + Math.sin(S.t + i) * 2, y0 - 6 + (i % 2) * 3, 5, 1); } void x0; }
    const [lx, ly] = mid(0.5); g.fillStyle = MARK ? INK : '#3a3c44'; g.fillRect(a - 5, ly, b - a + 10, 80);
    for (let i = 0; i < 2; i++) { const cx = a + 6 + i * (b - a) * 0.5, cy = ly + 14 + i * 6; poly([cx, cy, cx + 6, cy - 6, cx + 16, cy - 6, cx + 21, cy, cx + 21, cy + 5, cx, cy + 5], ['#c8102e', '#6a7078', '#1d2230'][(i + bay) % 3], { lw: 0.8 }); bulb(cx + 20, cy + 2, 0.8, '#fff2c0', 0.6); }
    glow(lx + 8, ly - 4, 26, '#ffe8b0', 0.5); ln(lx + 8, ly - 10, lx + 8, ly + 20, '#2a2622', 1.6, { mw: 1 });
    g.restore();
    ln(a + (b - a) / 2, yA0 + (yB0 - yA0) / 2, a + (b - a) / 2, yA1 + (yB1 - yA1) / 2, '#f4f6f8', 3, { mw: 1.4 });
    ln(a, (yA0 + yA1) / 2, b, (yB0 + yB1) / 2, '#f4f6f8', 3, { mw: 1.4 });
    if (!MARK) { g.fillStyle = 'rgba(255,255,255,.07)'; path(q, true); g.fill(); }
  });
}
function leftWallOpenings(on, pu) {
  // perspective on the left wall: top edge (0,250)->(150,120), floor edge (0,540)->(150,340)
  const top = (x) => 250 - x * 130 / 150, bot = (x) => 540 - x * 200 / 150, at = (x, f) => top(x) + (bot(x) - top(x)) * f;
  const warm = '#ffcf8a', room = (q) => { if (MARK) { path(q, true); g.fillStyle = PAPER; g.fill(); return; } path(q, true); const gr = g.createLinearGradient(0, 150, 0, 520); gr.addColorStop(0, '#7a4a2a'); gr.addColorStop(1, '#3a2418'); g.fillStyle = gr; g.fill(); };
  // inside window into the lounge
  const wa = 16, wb = 72, w = [wa, at(wa, 0.2), wb, at(wb, 0.2), wb, at(wb, 0.56), wa, at(wa, 0.56)];
  poly([wa - 5, at(wa, 0.2) - 6, wb + 4, at(wb, 0.2) - 5, wb + 4, at(wb, 0.56) + 5, wa - 5, at(wa, 0.56) + 6], '#6a4a2e', { lw: 1.4 });
  room(w);
  g.save(); path(w, true); g.clip();
  if (!MARK) { glow(44, at(44, 0.32), 50, warm, 0.6); for (let i = 0; i < 3; i++) bulb(26 + i * 18, at(26 + i * 18, 0.25), 1.8, '#fff2c0', 0.9); }
  for (let i = 0; i < 3; i++) { const x = 28 + i * 16, y = at(x, 0.5), b = Math.sin(S.t * 1.3 + i) * 1.2; ell(x, y - 18 + b, 4, 5, '#2a1a12', { noline: true }); rect(x - 5, y - 13 + b, 10, 16, '#2a1a12', { noline: true }); }
  path([wa, at(wa, 0.47), wb, at(wb, 0.47), wb, at(wb, 0.47) + 6, wa, at(wa, 0.47) + 6], true); g.fillStyle = MARK ? INK : '#5a3a22'; g.fill();
  g.restore();
  ln((wa + wb) / 2, at((wa + wb) / 2, 0.2), (wa + wb) / 2, at((wa + wb) / 2, 0.56), '#6a4a2e', 2.4, { mw: 1.2 });
  if (!MARK) { path(w, true); g.fillStyle = 'rgba(255,255,255,.06)'; g.fill(); }
  // the door beside it, open into the lounge
  const da = 96, db = 134, d = [da, at(da, 0.42), db, at(db, 0.42), db, bot(db), da, bot(da)];
  poly([da - 5, at(da, 0.42) - 7, db + 5, at(db, 0.42) - 6, db + 5, bot(db), da - 5, bot(da)], '#6a4a2e', { lw: 1.4 });
  room(d);
  if (!MARK) { g.save(); path(d, true); g.clip(); glow(115, at(115, 0.62), 44, warm, 0.55 + (on ? pu * 0.1 : 0)); const x = 116, y = at(116, 0.9), b = Math.sin(S.t * 1.1) * 1.2; ell(x, y - 30 + b, 5, 6, '#2a1a12', { noline: true }); rect(x - 7, y - 24 + b, 14, 26, '#2a1a12', { noline: true }); g.restore(); }
  poly([da, at(da, 0.42), da - 10, at(da, 0.42) + 4, da - 10, bot(da) + 8, da, bot(da)], SC.blue, { lw: 1.2 });
  ell(da - 5, at(da, 0.62), 2.6, 5, '#d9dde2', { lw: 0.8 });
  rect(da - 2, at(da, 0.42) - 18, db - da + 6, 9, '#2a180c', { lw: 1 }); txt('LOUNGE', (da + db) / 2 + 2, at((da + db) / 2, 0.42) - 13, 7, MARK ? INK : '#ffe9b0', { bold: true });
}
function sceneInside() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#151a2c', k: 0.3 }, light = act.cols[0];
  const wash = mix('#3a6ad8', act.cols[0], 0.35);
  // ceiling: rafters seen from the floor
  poly([0, 0, W, 0, W, 250, 810, 120, 150, 120, 0, 250], '#10131c');
  for (let i = 0; i <= 9; i++) { const k = i / 9, rx = 480, ry = -40 + k * 110, lx = 0 + k * 150, ly = 250 - k * 130, Rx = W - k * 150; ln(rx, ry, lx, ly, '#2a2620', 6 - k * 3, { mw: 2 }); ln(rx, ry, Rx, ly, '#2a2620', 6 - k * 3, { mw: 2 }); }
  for (let j = 1; j < 6; j++) { const f = j / 6; ln(480 + (0 - 480) * f, -40 + (250 + 40) * f, 480 + (150 - 480) * f, 70 + (120 - 70) * f, '#221e1a', 3, { mw: 1.4 }); ln(480 + (W - 480) * f, -40 + 290 * f, 480 + (810 - 480) * f, 70 + 50 * f, '#221e1a', 3, { mw: 1.4 }); }
  // fishing net draped over everything, with floats
  g.save(); path([0, 0, W, 0, W, 250, 810, 120, 150, 120, 0, 250], true); g.clip();
  g.strokeStyle = MARK ? 'rgba(22,19,15,.45)' : 'rgba(150,170,200,.18)'; g.lineWidth = 0.8; g.beginPath();
  for (let i = -30; i < 60; i++) { const x = i * 22; for (let s2 = 0; s2 <= 1; s2++) { g.moveTo(x, 0); for (let y = 0; y <= 260; y += 20) g.lineTo(x + (s2 ? y : -y) * 0.9 + Math.sin(y * 0.05 + i) * 4, y + Math.sin(x * 0.02 + y * 0.03) * 8); } } g.stroke();
  const fr = RNG(12); for (let i = 0; i < 40; i++) { const x = fr() * W, y = 20 + fr() * 200; ell(x, y + Math.sin(S.t + i) * 1.5, 4, 2.6, ['#c9a86a', '#e8e0cc', '#d9502b'][i % 3], { lw: 0.8 }); }
  g.restore();
  // walls
  poly([0, 250, 150, 120, 150, 340, 0, 540], '#2a2018', { h: 9, ha: 1.1 }); poly([W, 250, 810, 120, 810, 340, W, 540], '#2a2018', { h: 9, ha: 2 }); sideWindows();
  // left wall: an inside window and a door through to the lounge, EXIT sign
  leftWallOpenings(on, pu);
  rect(124, 166, 18, 9, '#3a0808', { lw: 1 }); neonText('EXIT', 133, 170.5, 6, '#ff3b3b', 0.9, 'Arial,sans-serif');
  // back wall / stage: blue walls, red posts, rustic SHORE CLUB letters
  rect(150, 120, 660, 222, '#1c2238', { h: 10 }); insideWall(); rect(318, 132, 324, 168, MARK ? PAPER : mix('#3d5fae', wash, 0.5), { lw: 1.6 }); if (!MARK) glow(480, 220, 220, wash, 0.25 + pu * 0.1);
  rect(304, 124, 16, 182, '#a3262c', { lw: 1.4 }); rect(640, 124, 16, 182, '#a3262c', { lw: 1.4 }); rect(296, 120, 368, 12, '#5a4030', { lw: 1.4 });
  rect(340, 192, 280, 50, '#9a8466', { lw: 1.4 }); if (!MARK) { g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 200; y < 242; y += 8) g.fillRect(340, y, 280, 1.2); } else { g.strokeStyle = INK; g.lineWidth = 0.7; g.beginPath(); for (let y = 200; y < 242; y += 8) { g.moveTo(342, y); g.lineTo(618, y); } g.stroke(); }
  g.font = "700 34px 'Arial Narrow','Oswald',Impact,sans-serif"; g.textAlign = 'center'; g.textBaseline = 'middle'; 'SHORE CLUB'.split('').forEach((ch, i) => { const x = 361 + i * 26.5; if (MARK) { g.fillStyle = '#c8102e'; g.fillText(ch, x, 218); g.strokeStyle = INK; g.lineWidth = 1; g.strokeText(ch, x, 218); } else { g.fillStyle = '#5a1012'; g.fillText(ch, x + 1.5, 219.5); g.fillStyle = '#c2342e'; g.fillText(ch, x, 218); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x - 10, 214 + (i % 3), 20, 1); } });
  // light pipe with LED pars and moving heads
  ln(326, 148, 634, 148, '#2a2a2a', 3, { mw: 2 });
  for (let i = 0; i < 5; i++) { const x = 350 + i * 65, col = act.cols[i % act.cols.length]; parCan(x, 162, 1, i % 2 ? '#ffb347' : col, on ? 0.5 + pu * 0.5 : 0.35); }
  const nf = on ? 0.75 + pu * 0.4 : 0.5;
  if (act.k === 'dj') lighthouseBeam(480, 180, 700);
  // stage floor
  poly([318, 300, 642, 300, 664, 322, 296, 322], MARK ? PAPER : '#7a2a26', { lw: 1.8 }); poly([296, 322, 664, 322, 664, 342, 296, 342], '#2a180c', { h: 5 });
  rect(330, 288, 26, 14, '#151515', { lw: 1 }); rect(604, 288, 26, 14, '#151515', { lw: 1 });
  [[262, 150], [670, 150]].forEach(([x, y]) => { ln(x + 6, 120, x + 6, y, '#2a2a2a', 1.4, { mw: 1 }); ln(x + 22, 120, x + 22, y, '#2a2a2a', 1.4, { mw: 1 }); lineArray(x, y, 6, 1); });
  drawBand(480, 304, 300, 0.62, amb, light);
  stageLights(340, 620, 168, 330, 1, true);
  neonText(act.name, 480, 276, 14, act.cols[1], nf * 0.8, "'Pacifico',cursive", 'center', 260);
  // hardwood dance floor
  poly([150, 342, 810, 342, 960, 540, 0, 540], '#5a3a24');
  if (!MARK) { const gr = g.createLinearGradient(0, 342, 0, 540); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(255,190,120,.05)'); g.fillStyle = gr; path([150, 342, 810, 342, 960, 540, 0, 540], true); g.fill(); g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1; g.beginPath(); for (let i = -20; i <= 20; i++) { g.moveTo(480 + i * 16.5, 342); g.lineTo(480 + i * 24, 540); } g.stroke(); act.cols.forEach((c, i) => glow(320 + i * 160, 420 + (i % 2) * 40, 120, c, 0.1 + pu * 0.12)); glow(480, 400, 260, wash, 0.12); }
  else { g.strokeStyle = INK; g.lineWidth = 0.9; g.beginPath(); for (let i = -20; i <= 20; i += 2) { g.moveTo(480 + i * 16.5, 342); g.lineTo(480 + i * 24, 540); } g.stroke(); }
  buildCrowd();
  drawCrowd(amb, light, (sl) => !sl.table);
  [[70, 470], [890, 470]].forEach(([x, y]) => { drawCrowd(amb, light, (sl) => sl.table && sl.table[0] === x); gingPoly([x - 60, y - 30, x + 60, y - 30, x + 66, y - 6, x - 66, y - 6], true); rect(x - 66, y - 6, 132, 18, '#2a180c', { lw: 1.4 }); });
  // white C9 bulbs in swags, amber hex lanterns, the mirror ball, a few hanging gulls
  edisonC9(0, 150, 480, 128, 30, 18); edisonC9(480, 128, W, 150, 30, 18); edisonC9(0, 60, 960, 70, 70, 34); edisonC9(60, 230, 900, 236, 40, 30);
  [[200, 170, 0.9], [118, 230, 1.1], [760, 170, 0.9], [850, 230, 1.1], [330, 140, 0.7], [640, 140, 0.7]].forEach(([x, y, s]) => hexLantern(x, y, s, 0.85));
  mirrorBall(480, 64, 15);
  [[300, 90], [420, 60], [560, 80], [680, 100], [240, 120]].forEach(([x, y], i) => hangingGull(x, y + Math.sin(S.t * 0.7 + i) * 3, 0.7, S.t * 0.3 + i * 1.3));
  vignette();
}
function edisonC9(x1, y1, x2, y2, sag, n) { g.strokeStyle = MARK ? INK : 'rgba(10,10,10,.8)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i <= 20; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / 20); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); for (let i = 1; i < n; i++) { const [x, y] = catenary(x1, y1, x2, y2, sag, i / n); ell(x, y + 3, 1.8, 3, '#fffbe8', { lw: 0.6 }); glow(x, y + 3, 12, '#fff4d0', S.playing ? 0.55 + 0.25 * Math.cos(i * 0.8 - S.beat * 2) : 0.6); } }
function pine(x, y, h, seed, cols) {
  const r = RNG(seed), n = 8 + Math.floor(r() * 4), sw = Math.sin(S.t * 0.6 + seed) * 1.6;
  ln(x, y, x, y - h * 0.3, '#3a2a1c', Math.max(2, h * 0.035), { mw: 1.6 });
  for (let i = 0; i < n; i++) {
    const t = i / n, ty = y - h * 0.14 - t * h * 0.8, w = (1 - t) * h * 0.27 + 3, xo = x + sw * t, j = () => (r() - 0.5) * w * 0.18;
    const pts = [xo - w + j(), ty + w * 0.42, xo - w * 0.7 + j(), ty + w * 0.26, xo - w * 0.45, ty + w * 0.34, xo - w * 0.2, ty + w * 0.12, xo, ty - h * 0.07, xo + w * 0.2, ty + w * 0.12, xo + w * 0.45, ty + w * 0.34, xo + w * 0.7 + j(), ty + w * 0.26, xo + w + j(), ty + w * 0.42, xo, ty + w * 0.3];
    poly(pts, cols[0], { h: 4 });
    if (!MARK) poly([xo + w * 0.1, ty + w * 0.06, xo + w * 0.45, ty + w * 0.32, xo + w * 0.75, ty + w * 0.24, xo + w * 0.95, ty + w * 0.38, xo + w * 0.2, ty + w * 0.26], cols[1]);
  }
  poly([x + sw - 2, y - h * 0.9, x + sw, y - h * 1.02, x + sw + 2, y - h * 0.9], cols[0]);
}
function pineRow() {
  const back = ['#1a2a24', '#22362c'], front = ['#0f1a14', '#1a2c20'];
  [[8, 330, 120, 3], [52, 326, 150, 4], [96, 332, 110, 5], [140, 330, 130, 6], [176, 336, 90, 7]].forEach(([x, y, h, sd]) => pine(x, y, h, sd, back));
  [[-6, 350, 200, 11], [38, 352, 175, 12], [86, 350, 215, 13], [132, 354, 160, 14]].forEach(([x, y, h, sd]) => pine(x, y, h, sd, front));
}
function lobsterBoat(x, y, s) {
  const b = Math.sin(S.t * 0.9 + x) * 1.2 * s; y += b;
  poly([x - 34 * s, y - 8 * s, x + 30 * s, y - 10 * s, x + 38 * s, y - 16 * s, x + 32 * s, y, x - 30 * s, y], '#f4f4f0', { lw: 1 });
  rect(x - 32 * s, y - 3 * s, 64 * s, 3 * s, '#c8102e'); rect(x - 4 * s, y - 22 * s, 20 * s, 13 * s, '#e8e8e4', { lw: 1 }); rect(x - 1 * s, y - 19 * s, 6 * s, 5 * s, '#3a4a5a'); rect(x + 7 * s, y - 19 * s, 6 * s, 5 * s, '#3a4a5a');
  ln(x + 6 * s, y - 22 * s, x + 6 * s, y - 34 * s, '#ccc', 1, { mw: 0.8 }); bulb(x + 6 * s, y - 35 * s, 1, '#ffffff', 0.7);
  if (!MARK) { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x - 34 * s, y + 1, 70 * s, 1.5); }
}
function dinghy(x, y, s) { const b = Math.sin(S.t * 1.3 + 2) * s; poly([x - 14 * s, y - 5 * s + b, x + 14 * s, y - 5 * s + b, x + 10 * s, y + b, x - 10 * s, y + b], '#2a6ac8', { lw: 1 }); rect(x - 10 * s, y - 6 * s + b, 20 * s, 1.5 * s, '#e8e4da'); }
/* ---------- the swim raft: regulars change, swim out, dance on the raft, swim back ---------- */
const RAFT = { x: 500, y: 314, s: 1.35 };
const SWIMMERS = [0, 1, 2].map((i) => ({ i, k: 37 + i * 61, off: i / 3 }));
function swimmerSlot(w, amb, light, style) {
  if (!w.sl) { const base = ROSTER[w.k % ROSTER.length]; w.sl = { p: Object.assign({}, base, { top: 'tank', topC: ['#ff3b6b', '#1d6fe0', '#ffd166'][w.i], bot: 'shorts', botC: ['#1d4e89', '#ff8a3d', '#2a9d8f'][w.i], hat: 'none', acc: 'none' }), off: 0.2 + w.i * 0.3, face: 1, style: 'stand' }; w.dry = { p: base, off: w.sl.off, face: 1, style: 'stand' }; }
  const sl = style === 'dry' ? w.dry : w.sl; sl.style = style === 'dry' ? 'stand' : style; const ck = amb.col + light; if (sl.cKey !== ck) { sl.cKey = ck; sl.c = shadeSet(sl.p, amb, light); } return sl;
}
function swimHead(x, y, s, sk, stroke) {
  const a = Math.sin(stroke);
  ell(x, y, 4.5 * s, 5 * s, sk, { lw: 0.8 });
  ln(x - 3 * s, y + 2 * s, x - 8 * s - a * 4 * s, y - 2 * s - Math.max(0, a) * 6 * s, sk, 2.2 * s, { mw: 1 });
  ln(x + 3 * s, y + 2 * s, x + 8 * s + a * 4 * s, y - 2 * s - Math.max(0, -a) * 6 * s, sk, 2.2 * s, { mw: 1 });
  if (!MARK) { g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y + 4 * s, 10 * s, 2.2 * s, 0, 0, 7); g.stroke(); }
}
function raftCrew(layer, amb, light) {
  const P = 48, shoreY = 376;
  SWIMMERS.forEach((w) => {
    if (!w.sl) swimmerSlot(w, amb, light, 'stand');
    const t = ((S.t / P) + w.off) % 1, bx = 452 + w.i * 34, by = 398 + (w.i % 2) * 6, rx = RAFT.x - 22 + w.i * 22, ry = RAFT.y - 2;
    const lerp = (a, b, k) => a + (b - a) * k;
    if (t < 0.1) { if (layer !== 'beach') return; const changed = t > 0.05, sl = swimmerSlot(w, amb, light, changed ? 'stand' : 'dry'); person(sl, bx, by, 0.5); if (!changed) { const sp = t * 120; ell(bx + Math.sin(sp) * 7, by - 18, 9, 3, ['#ffd166', '#e9eef5', '#ff8a3d'][w.i], { lw: 0.8 }); } }
    else if (t < 0.15) { if (layer !== 'beach') return; const k = (t - 0.1) / 0.05; person(swimmerSlot(w, amb, light, 'stand'), lerp(bx, bx + 10, k), lerp(by, shoreY, k), 0.5); }
    else if (t < 0.33) { if (layer !== 'water') return; const k = (t - 0.15) / 0.18; swimHead(lerp(bx + 10, rx, k), lerp(shoreY - 4, ry + 8, k) + Math.sin(S.t * 3 + w.i) * 0.8, lerp(0.75, 0.55, k), w.sl.p.skin, S.t * 5 + w.i); }
    else if (t < 0.62) { if (layer !== 'raft') return; const sl = swimmerSlot(w, amb, light, S.playing ? 'rave' : 'sway'); person(sl, rx, ry, 0.36); }
    else if (t < 0.67) { if (layer !== 'water') return; const k = (t - 0.62) / 0.05, x = lerp(rx, rx - 18, k), y = ry - Math.sin(k * Math.PI) * 16 + k * 10; if (k < 0.8) ell(x, y - 6, 2.5, 6, w.sl.p.skin, { lw: 0.6 }); else { g.strokeStyle = MARK ? INK : 'rgba(255,255,255,.9)'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(x, ry + 8, 8 + (k - 0.8) * 30, 2.5, 0, 0, 7); g.stroke(); } }
    else if (t < 0.85) { if (layer !== 'water') return; const k = (t - 0.67) / 0.18; swimHead(lerp(rx - 18, bx + 10, k), lerp(ry + 8, shoreY - 4, k) + Math.sin(S.t * 3 + w.i) * 0.8, lerp(0.55, 0.75, k), w.sl.p.skin, S.t * 5 + w.i); }
    else { if (layer !== 'beach') return; const k = Math.min(1, (t - 0.85) / 0.05); person(swimmerSlot(w, amb, light, 'stand'), lerp(bx + 10, bx, k), lerp(shoreY, by, k), 0.5); }
  });
}
function swimRaft(night, on, pu) {
  const { x, y, s } = RAFT, b = Math.sin(S.t * 1.1) * 1.2;
  poly([x - 40 * s, y + b, x + 40 * s, y + b, x + 36 * s, y + 6 * s + b, x - 36 * s, y + 6 * s + b], night ? '#6a6458' : '#c9bea6', { lw: 1.2 });
  rect(x - 38 * s, y + 5 * s + b, 76 * s, 3 * s, '#5a4a3a');
  [-30, 30].forEach((dx) => { ell(x + dx * s, y + 9 * s + b, 6 * s, 3 * s, '#e8e4da', { lw: 0.8 }); });
  ln(x + 30 * s, y + b, x + 30 * s, y - 14 * s + b, '#d0d4d8', 1.4, { mw: 1 }); ln(x + 36 * s, y + b, x + 36 * s, y - 14 * s + b, '#d0d4d8', 1.4, { mw: 1 }); ln(x + 30 * s, y - 14 * s + b, x + 33 * s, y - 18 * s + b, '#d0d4d8', 1.4, { mw: 1 });
  if (night) { bulb(x - 34 * s, y - 6 + b, 1.6, '#ffd27a', 0.9); glow(x - 34 * s, y - 6 + b, 18, '#ffb35a', on ? 0.4 + pu * 0.3 : 0.35); }
  if (!MARK) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y + 8 * s + b, 46 * s, 3 * s, 0, 0, 7); g.stroke(); }
}
function sceneShore() {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0, amb = { col: '#241a44', k: 0.4 }, light = '#b07dff';
  skyGrad(['#22336a', '#4f6aa8', '#9aaed0', '#f0c48a', '#f59a4a'], 330); stars(80, 0.4); cirrus(200, 0.8); sunsetClouds(250, 'shore', false);
  // trees, campers with string lights, a white tent, hills across the cove
  // the bay between the pines and the stage: far shore, water, moored boats
  poly([150, 300, 260, 292, 380, 296, 470, 290, 560, 296, 560, 304, 150, 304], '#3a4a5a', { h: 5 });
  spruceLine('s-far', 300, 16, '#24343a', 150, 560, { h: 5 });
  for (let i = 0; i < 4; i++) glow(200 + i * 100, 300, 5, '#ffd890', 0.6);
  g.save(); g.beginPath(); g.rect(140, 302, 440, 40); g.clip(); water(302, 342, '#7a7ab0', '#3a4a7a', [[420, '#f5b06a', 0.55, 26]]); g.restore();
  ketch(250 + Math.sin(S.t * 0.05) * 30, 322, 0.55); lobsterBoat(430, 334, 0.7); dinghy(340, 338, 0.6);
  pineRow();
  [[40, 372], [150, 378]].forEach(([x, y], i) => { rect(x, y - 30, 96, 30, '#d8dce2', { lw: 1.2 }); rect(x + 10, y - 24, 30, 10, '#2a3a4a'); rect(x + 50, y - 24, 30, 10, on ? '#ffcf7a' : '#2a3a4a'); ell(x + 24, y, 6, 6, '#111', { ink: true }); edison(x - 4, y - 32, x + 100, y - 30, 6, 9); });
  poly([300, 390, 340, 350, 380, 390], '#f2f2f2', { lw: 1.4 }); poly([340, 350, 420, 352, 440, 392, 380, 390], '#e4e4e4', { lw: 1.4 });
  ground(340, H, '#1e2a20', '#0d140f');
  // the big black stage with a curved roof, white truss, blinders, line arrays and side scrims
  poly([520, 182, 560, 150, 620, 130, 700, 112, 800, 100, 900, 96, 970, 98, 970, 200, 520, 200], '#0c0c10', { lw: 1.6 });
  for (let i = 0; i < 7; i++) { const x = 540 + i * 64; ln(x, 200, x + 30, 120 - i * 3, '#1d1d24', 1.2, { mw: 1 }); }
  poly([520, 200, 970, 200, 970, 380, 520, 380], '#0e0b18');
  if (!MARK) { const gr = g.createLinearGradient(0, 210, 0, 380); gr.addColorStop(0, mix('#6a2bd8', act.cols[0], 0.3)); gr.addColorStop(1, '#2a1060'); g.fillStyle = gr; g.globalAlpha = 0.65 + pu * 0.2; g.fillRect(590, 214, 320, 166); g.globalAlpha = 1; }
  glow(750, 300, 220, mix('#9a4bff', act.cols[0], 0.3), 0.35 + pu * 0.25);
  poly([520, 210, 588, 214, 588, 384, 470, 400], '#0b0b0e', { h: 6 }); poly([912, 214, 970, 210, 970, 400, 912, 384], '#0b0b0e', { h: 6 });
  truss(560, 950, 200, 12);
  for (let i = 0; i < 6; i++) blinder(610 + i * 60, 214, 0.95, on ? 0.45 + pu * 0.6 : 0.3);
  lineArray(552, 214, 10, 1); lineArray(916, 214, 10, 1);
  // stage deck, band, purple wash
  rect(580, 378, 340, 16, '#141414', { lw: 1.4 }); for (let i = 0; i < 6; i++) bulb(600 + i * 60, 386, 2.2, '#c06bff', on ? 0.6 + pu * 0.4 : 0.4);
  drawBand(750, 380, 230, 0.58, amb, act.cols[0]);
  stageLights(600, 900, 228, 400, 0.9, true);
  if (act.k === 'dj') lighthouseBeam(750, 240, 600);
  // the field: crowd, glowing beach balls bounced over heads
  buildCrowd(); drawCrowd(amb, light);
  for (let i = 0; i < 7; i++) glowBall(i, 60, 640, 230, 360, on);
  vignette();
}
function bayWater(y0, y1, night) {
  if (!MARK) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, night ? '#1a2244' : '#5f8fc4'); gr.addColorStop(0.6, night ? '#20305a' : '#86b2d2'); gr.addColorStop(1, night ? '#2a3a62' : '#a9cbd8'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
  g.strokeStyle = MARK ? INK : (night ? 'rgba(200,210,255,.12)' : 'rgba(255,255,255,.22)'); g.lineWidth = 1; g.beginPath();
  for (let i = 0; i < 22; i++) { const k = i / 22, y = y0 + 4 + Math.pow(k, 1.4) * (y1 - y0 - 8), off = (S.t * (4 + k * 10) + i * 53) % 90; for (let x = -90 + off; x < W; x += 70 + k * 60) { g.moveTo(x, y); g.lineTo(x + 18 + k * 30, y); } } g.stroke();
  if (!night && !MARK) { for (let i = 0; i < 40; i++) { const x = 380 + Math.sin(i * 12.3) * 260, y = y0 + 20 + (i * 17) % (y1 - y0 - 20); g.fillStyle = `rgba(255,255,255,${0.4 + 0.4 * Math.sin(S.t * 6 + i)})`; g.fillRect(x, y, 2, 1); } }
}
function lapping(yShore, night) {
  const T = 6;
  for (let k = 0; k < 3; k++) { const ph = ((S.t / T) + k / 3) % 1, y = yShore - 26 + ph * 26, a = Math.sin(ph * Math.PI); g.beginPath(); for (let x = -10; x <= W + 10; x += 20) { const yy = y + Math.sin(x * 0.015 + k * 2) * 2 + (x / W) * -10; x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.strokeStyle = MARK ? INK : `rgba(255,255,255,${(night ? 0.35 : 0.7) * a})`; g.lineWidth = MARK ? 1 : 1 + ph * 2; g.stroke(); }
  const ph = (S.t / T) % 1, reach = Math.sin(clamp(ph * 1.3, 0, 1) * Math.PI);
  const pts = [-10, yShore - 10]; for (let x = -10; x <= W + 10; x += 24) pts.push(x, yShore + reach * 16 + Math.sin(x * 0.03 + S.t) * 3 * reach - (x / W) * 10); pts.push(W + 10, yShore - 20);
  if (MARK) { path(pts.slice(2, -2), false); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke(); }
  else { path(pts, true); g.fillStyle = night ? 'rgba(160,180,220,.22)' : 'rgba(225,245,250,.55)'; g.fill(); path(pts.slice(2, -2), false); g.strokeStyle = night ? 'rgba(220,230,255,.55)' : 'rgba(255,255,255,.95)'; g.lineWidth = 2; g.stroke(); }
}
function sceneBeach(night) {
  const act = ACTS[S.act], on = S.playing, pu = on ? Math.exp(-((S.beat % 1) * 5)) : 0;
  const amb = night ? { col: '#0b1028', k: 0.48 } : { col: '#ffffff', k: 0 }, light = night ? '#ffb070' : '#fff4d6';
  if (night) { skyGrad(['#070b22', '#1a2050', '#4a4a7a', '#b07a86', '#e8a070'], 262); stars(150, 1); moonCrescent(700, 120, 13); bulb(560, 70, 1.6, '#fffbe8', 1); glow(560, 70, 14, '#fffbe8', 0.6); }
  else { skyGrad(['#3f6fc8', '#6d98dc', '#a9c4ea', '#cfe0f2'], 262); cirrus(200, 1); if (!MARK) glow(120, 60, 160, '#fffbe0', 0.6); [[600, 120, 0.7], [820, 90, 0.9], [150, 170, 0.6], [400, 60, 0.5]].forEach(([x, y, s], i) => cloud((x + S.t * (3 + i)) % (W + 300) - 120, y, s)); }
  // far shore across the bay, the headland with spruce and cottages, the flagpole
  poly([0, 258, 140, 252, 320, 255, 520, 252, 700, 256, 960, 250, 960, 262, 0, 262], night ? '#141a30' : '#5a7088', { lw: 1 });
  poly([620, 262, 700, 236, 820, 222, 960, 214, 960, 300, 620, 300], night ? '#0a0f1a' : '#2c4a32', { h: 7 });
  spruceLine(night ? 'b-head-n2' : 'b-head2', 232, 44, night ? '#060a14' : '#1f3a26', 640, W, { h: 6 });
  cottage(760, 262, 1, night ? '#3a4050' : '#e8e4da', night); cottage(860, 252, 0.9, night ? '#3a4050' : '#d8dee6', night); canadaFlag(810, 250, 1);
  spruceLine(night ? 'b-left-n' : 'b-left', 248, 30, night ? '#060a14' : '#24402a', 0, 90, { h: 6 });
  bayWater(262, 372, night);
  swimRaft(night, on, pu); raftCrew('water', amb, light); raftCrew('raft', amb, light); bulb(120, 320, 2.4, '#ff7a2a', night ? 0.3 : 0.9); bulb(470, 312, 2.2, '#ff7a2a', night ? 0.3 : 0.9);
  if (!night) ketch(((S.t * 4) % (W + 200)) - 100, 286, 0.8); else { [[380, 300], [520, 292]].forEach(([x, y], i) => { bulb(x, y - 30, 1.2, '#ffffff', 0.8); bulb(x - 10, y, 1.2, i ? '#3dff6b' : '#ff3b3b', 0.7); }); }
  if (night) water(262, 372, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', [[700, '#fff3c4', 0.45, 10]]);
  // sand, wrack lines, the wash
  if (!MARK) { const gr = g.createLinearGradient(0, 360, 0, H); gr.addColorStop(0, night ? '#3a3448' : '#cfc2a6'); gr.addColorStop(0.08, night ? '#4a4458' : '#e8dfcb'); gr.addColorStop(1, night ? '#2a2638' : '#ddd0b4'); g.fillStyle = gr; path([0, 372, W, 362, W, H, 0, H], true); g.fill(); }
  else { ln(0, 372, W, 362, INK, 1.6); g.fillStyle = INK; const r = RNG(4); for (let i = 0; i < 180; i++) g.fillRect(r() * W, 380 + r() * 160, 1.2, 1.2); }
  lapping(372, night);
  raftCrew('beach', amb, light);
  seaweed(470, 391, 260, 2); seaweed(720, 470, 60, 5);
  [[488, 402, 20, 21], [522, 410, 13, 22], [462, 414, 12, 23], [548, 400, 9, 24], [500, 422, 8, 25], [440, 422, 7, 26]].forEach(([x, y, r, sd]) => boulder(x, y, r, sd, night, true));
  // dune grass and granite boulders at the back right and the front left
  poly([600, 372, 640, 344, 760, 334, 960, 326, 960, 372], night ? '#3a3448' : '#e2d6bc', { lw: 1.4 });
  grassTufts(640, 960, 334, 360, 7, night ? '#1e2a24' : '#7a8a4a');
  [[700, 352, 16, 1], [742, 356, 22, 2], [790, 350, 14, 3], [835, 356, 20, 4], [880, 352, 15, 5], [925, 357, 21, 6]].forEach(([x, y, r, s]) => boulder(x, y, r, s, night));
  // beach stage
  const sx = 255; ln(sx - 135, 404, sx - 135, 292, '#7a5a3a', 5, { mw: 2.4 }); ln(sx + 135, 404, sx + 135, 292, '#7a5a3a', 5, { mw: 2.4 });
  if (night) edison(sx - 135, 298, sx + 135, 298, 18, 18, 0.9);
  for (let i = 0; i < 9; i++) poly([sx - 145 + i * 32.2, 296, sx - 145 + (i + 1) * 32.2, 296, sx - 145 + (i + 1) * 32.2, 284, sx - 145 + i * 32.2, 284], i % 2 ? '#f4f1de' : '#2a6ac8', { lw: 1.2 });
  for (let i = 0; i < 9; i++) poly([sx - 145 + i * 32.2, 296, sx - 145 + (i + 1) * 32.2, 296, sx - 145 + (i + 0.5) * 32.2, 306], i % 2 ? '#f4f1de' : '#2a6ac8', { lw: 1.2 });
  poly([sx - 150, 400, sx + 150, 400, sx + 158, 414, sx - 158, 414], '#8a6a46', { lw: 1.6 }); rect(sx - 158, 414, 316, 12, '#5a4028', { h: 5 });
  neonText(act.name, sx, 316, 14, act.cols[0], night ? (on ? 0.8 + pu * 0.3 : 0.55) : 0.5, "'Pacifico',cursive", 'center', 250);
  drawBand(sx, 402, 200, 0.68, amb, night ? act.cols[0] : light);
  if (night) stageLights(sx - 120, sx + 120, 300, 420, 0.9);
  if (act.k === 'dj' && night) lighthouseBeam(sx, 340, 500);
  if (night) {
    edison(0, 250, 520, 240, 50, 26); edison(520, 240, W, 262, 40, 20); ln(520, 470, 520, 240, '#4a3a2a', 4, { mw: 2.4 }); ln(940, 470, 940, 262, '#4a3a2a', 4, { mw: 2.4 });
    const fx = 660, fy = 486; buildCrowd(); drawCrowd(amb, light, (sl) => sl.y < fy);
    firePit(fx, fy, 1, pu);
    const r3 = RNG(8); for (let i = 0; i < 16; i++) { const x = 40 + i * 58 + r3() * 20, y = 520 + r3() * 14; if (Math.abs(x - fx) < 60 && y < 515) continue; rect(x - 5, y - 12, 10, 12, MARK ? PAPER : 'rgba(200,220,255,.25)', { lw: 1.2 }); const fl = 0.75 + 0.25 * Math.sin(S.t * 11 + i * 3); glow(x, y - 9, 26, '#ffb35a', fl * 0.7); bulb(x, y - 9, 1.6, '#ffd27a', fl); }
    [[560, 300], [640, 296], [720, 300], [800, 306], [880, 314]].forEach(([x, y], i) => { const cy2 = y + Math.sin(S.t + i) * 2; ln(x, y - 14, x, cy2 - 8, '#222', 1, { mw: 1 }); ell(x, cy2, 8, 10, PARTY[i], { lw: 1.4 }); glow(x, cy2, 30, PARTY[i], on ? 0.5 + pu * 0.4 : 0.45); });
    for (let i = 0; i < 4; i++) glowBall(i + 2, 60, 520, 330, 420, on);
  } else {
    umbrella(600, 430, 1, ['#1d6fe0', '#ffffff', '#1d6fe0', '#ffffff', '#1d6fe0', '#ffffff']); umbrella(700, 446, 1.1, ['#ff3b6b', '#ffb347', '#ffe14a', '#4ad66a', '#3a8ae0', '#8a5ae0']); umbrella(860, 430, 1, ['#1d6fe0', '#ff8a3d', '#ffe14a', '#1d6fe0', '#ff8a3d', '#ffe14a']);
    lounger(760, 500, 1); towel(560, 488, 1, ['#1d4e89', '#e9eef5', '#3a8ad8', '#d9a07a', '#1d4e89']); towel(860, 470, 1, ['#ff8a3d', '#e9eef5', '#ff3b6b', '#e9eef5']);
    for (let i = 0; i < 7; i++) { const x = ((S.t * 9 + i * 13) % (W + 200)) - 100, y = 452 + (i === 0 ? -2 : 0); duckling(x, y, i === 0 ? 1.6 : 1, S.t * 9 + i); }
    [[430, 300], [580, 334], [700, 290]].forEach(([x, y], i) => { const bob = Math.sin(S.t * 1.5 + i) * 2; ell(x, y + bob, 5, 5.5, SKIN[i + 1]); if (!MARK) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y + 5 + bob, 9, 2, 0, 0, 7); g.stroke(); } });
    for (let i = 0; i < 4; i++) { const x = (i * 210 + S.t * (18 + i * 4)) % (W + 80) - 40, y = 110 + Math.sin(S.t * 0.5 + i * 2) * 30 + i * 12; gull(x, y, 0.8 + (i % 2) * 0.3, S.t * 7 + i, '#f4f4f4'); }
  }
  boulder(40, 540, 60, 11, night); boulder(130, 548, 42, 12, night); boulder(-10, 500, 40, 13, night);
  if (!night) { buildCrowd(); drawCrowd(amb, light); } else drawCrowd(amb, light, (sl) => sl.y >= 486);
  vignette();
}

/* ---------------- people walking in and out of the scene ---------------- */
const LANES = { inside: [528, 1.18], outside: [516, 1.0], deck: [528, 1.1], shore: [530, 1.18], beachDay: [508, 1.05], beachNight: [516, 1.0] };
const WALKERS = []; let WALK_T = 0, WALK_SCENE = '';
function newWalker(i) {
  const dir = rnd() < 0.5 ? 1 : -1, base = ROSTER[Math.floor(rnd() * ROSTER.length)];
  return { i, p: base, dir, x: dir > 0 ? -40 : W + 40, speed: 24 + rnd() * 18, stopAt: rnd() < 0.55 ? 160 + rnd() * 640 : null, stopFor: 4 + rnd() * 5, wait: 0, off: rnd(), face: dir, style: 'walk', yj: rnd() * 10 - 5, walker: true };
}
function drawWalkers() {
  const lane = LANES[S.scene]; if (!lane || !LAST_AMB) return;
  if (WALK_SCENE !== S.scene) { WALK_SCENE = S.scene; WALKERS.length = 0; for (let i = 0; i < 3; i++) { const w = newWalker(i); w.x = 120 + rnd() * 720; WALKERS.push(w); } }
  const dt = clamp(S.t - WALK_T, 0, 0.1); WALK_T = S.t;
  const ck = LAST_AMB.col + LAST_LIGHT;
  WALKERS.forEach((w, k) => {
    if (w.wait > 0) { w.wait -= dt; if (w.wait <= 0) WALKERS[k] = newWalker(w.i); return; }
    if (w.stopAt != null && Math.abs(w.x - w.stopAt) < 6) { w.style = 'stand'; w.stopFor -= dt; if (w.stopFor <= 0) { w.stopAt = null; w.style = 'walk'; } }
    else { w.style = 'walk'; w.x += w.dir * w.speed * dt; }
    if (w.x < -60 || w.x > W + 60) { w.wait = 2 + rnd() * 6; w.hx = null; return; }
    if (w.cKey !== ck) { w.cKey = ck; w.c = shadeSet(w.p, LAST_AMB, LAST_LIGHT); }
    person(w, w.x, lane[0] + w.yj, lane[1]);
  });
}
/* ---------------- regulars chatting ---------------- */
const TALK = { next: 3, cur: null, recent: [] };
const CHAT_W = { see: 30, taste: 13, club: 17, film: 10, ns: 7, hello: 9, music: 0 };
function chatLine(cat, a, b) {
  const C = window.SHR_CHAT;
  if (cat === 'hello') {
    const who = (sl) => { const m = String(sl.p.name || '').split(' from '); return { first: m[0] || 'Pat', where: (C.where && C.where[m[1]]) || m[1] || 'just up the road' }; };
    const A = who(a), say = (t, o) => t.replace('{first}', o.first).replace('{where}', o.where);
    return [say(C.hello[Math.floor(rnd() * C.hello.length)], A), b ? say(C.hello[Math.floor(rnd() * C.hello.length)], who(b)) : null];
  }
  const list = C[cat]; if (!list || !list.length) return null;
  let idx = 0; for (let tries = 0; tries < 8; tries++) { idx = Math.floor(rnd() * list.length); if (!TALK.recent.includes(cat + idx)) break; }
  TALK.recent.push(cat + idx); if (TALK.recent.length > 80) TALK.recent.shift();
  const [l, r] = list[idx];
  return [l, b ? (r || C.replies[Math.floor(rnd() * C.replies.length)]) : null];
}
function startTalk() {
  if (!window.SHR_CHAT) return;
  const pool = CROWD.filter((sl) => sl.hx != null && !sl.inst).concat(WALKERS.filter((w) => w.hx != null && w.wait <= 0));
  if (pool.length < 1) return;
  const a = pick(pool); let b = null, bd = 1e9;
  pool.forEach((o) => { if (o === a) return; const d = Math.abs(o.hx - a.hx) + Math.abs(o.hy - a.hy) * 1.5; if (d < bd && d > 50) { bd = d; b = o; } });
  if (bd > 220) b = null;
  const w = Object.assign({}, CHAT_W, { music: S.playing ? 34 : 0 }); let tot = 0; for (const k in w) tot += w[k]; let x = rnd() * tot, cat = 'see'; for (const k in w) { if ((x -= w[k]) <= 0) { cat = k; break; } }
  const lines = chatLine(cat, a, b); if (!lines) return;
  if (a.walker && a.style === 'walk' && a.stopAt == null) { a.stopAt = a.x; a.stopFor = 6.5; }
  if (b && b.walker && b.style === 'walk' && b.stopAt == null) { b.stopAt = b.x; b.stopFor = 6.5; }
  TALK.cur = { a, b, lines, t0: S.t };
}
function wrapText(t, maxW) { const words = t.split(' '), out = []; let line = ''; words.forEach((wd) => { const tryL = line ? line + ' ' + wd : wd; if (g.measureText(tryL).width > maxW && line) { out.push(line); line = wd; } else line = tryL; }); if (line) out.push(line); return out; }
function bubble(sl, text, age, dur, avoid) {
  if (!sl || sl.hx == null || !text) return null;
  const a = clamp(Math.min(age / 0.25, (dur - age) / 0.4), 0, 1);
  g.save(); g.globalAlpha = a; g.font = '600 16px Georgia, serif';
  const lines = wrapText(text, 215), lh = 19, wd = Math.max(...lines.map((l) => g.measureText(l).width)) + 20, ht = lines.length * lh + 12;
  const hx = sl.hx, hy = sl.hy - 18 * (sl.hs || 1);
  let bx = clamp(hx - wd / 2, 8, W - wd - 8), by = clamp(hy - ht - 14, 8, H - ht - 8);
  if (avoid && bx < avoid.x + avoid.w + 6 && bx + wd > avoid.x - 6 && by < avoid.y + avoid.h + 6 && by + ht > avoid.y - 6) { if (avoid.y - ht - 8 >= 8) by = avoid.y - ht - 8; else by = avoid.y + avoid.h + 8; }
  const rectOut = { x: bx, y: by, w: wd, h: ht }; if (a <= 0) { g.restore(); return rectOut; }
  g.fillStyle = MARK ? PAPER : 'rgba(255,255,255,.96)'; g.strokeStyle = MARK ? INK : '#1b1b2a'; g.lineWidth = 2;
  g.beginPath(); if (g.roundRect) g.roundRect(bx, by, wd, ht, 10); else g.rect(bx, by, wd, ht); g.fill(); g.stroke();
  const tx = clamp(hx, bx + 16, bx + wd - 16); g.beginPath(); g.moveTo(tx - 7, by + ht - 1); g.lineTo(hx, hy - 2); g.lineTo(tx + 7, by + ht - 1); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = MARK ? INK : '#1b1b2a'; g.textAlign = 'left'; g.textBaseline = 'top';
  lines.forEach((l, i) => g.fillText(l, bx + 10, by + 7 + i * lh));
  g.restore(); return rectOut;
}
function drawTalk() {
  if (S.t >= TALK.next && !TALK.cur) { startTalk(); TALK.next = S.t + 7 + rnd() * 5; }
  const c = TALK.cur; if (!c) return;
  const age = S.t - c.t0, D1 = 4.2, R0 = 3.0, D2 = 4.2;
  const ra = bubble(c.a, c.lines[0], age, D1);
  if (c.lines[1]) bubble(c.b, c.lines[1], age - R0, D2, ra);
  if (age > (c.lines[1] ? R0 + D2 : D1)) TALK.cur = null;
}
function vignette() { drawWalkers(); drawTalk(); if (MARK) return; const v = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }

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
let api = null, apiWaiting = null, apiLoading = false, ctrl = null; const SP = { uri: null, dur: 0, pos: 0, hasUri: false, pendingPlay: false, at: 0, untitled: false };
function toUri(t) { t = (t || '').trim(); if (/^spotify:/.test(t)) return t; const m = t.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/); return m ? `spotify:${m[1]}:${m[2]}` : null; }
function fetchTitle(uri, cb) { const m = uri && uri.match(/spotify:track:(\w+)/); if (!m) return cb(null); fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent('https://open.spotify.com/track/' + m[1])).then((r) => r.json()).then((j) => cb(j && j.title)).catch(() => cb(null)); }
function songTitle(t) { if (!t || S.cur < 0) return; S.songs[S.cur].title = t; $('#shr-now').textContent = '♫ ' + t; renderSongs(); }
function spTrack(u) {
  if (u === SP.uri) return; SP.uri = u; SP.hasUri = true; if (MODE !== 'sp') tab('sp');
  const recent = Date.now() - SP.at < 3000 && SP.untitled; SP.at = Date.now(); SP.untitled = false;
  if (!recent) songStart(null);
  $('#shr-now').textContent = '♫ Loading the song title…';
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
    const host = $('#shr-embed'); host.innerHTML = ''; const el = document.createElement('div'); host.appendChild(el);
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
function setFull(on) { const ov = $('.shr-ov'); if (ov) (on ? $('.shr-hud') : $('.shr-stage')).appendChild(ov); $('#shr').classList.toggle('shr-full', on); document.documentElement.classList.toggle('shr-noscroll', on); $('#shr-fs').textContent = on ? '\u2715 Exit' : '\u26f6 Full screen'; refit(); }
$('#shr-fs').addEventListener('click', () => { const on = !$('#shr').classList.contains('shr-full'); setFull(on); const el = $('#shr'); try { if (on && el.requestFullscreen) el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {} });
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && $('#shr').classList.contains('shr-full')) setFull(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setFull(false); });

syncUI(); S.title = 0;
if (document.fonts && document.fonts.load) { document.fonts.load('30px Pacifico').catch(() => {}); document.fonts.load('20px Monoton').catch(() => {}); }
requestAnimationFrame(frame);
window.SHORECLUB = { S, setScene, setAct, songStart, ROSTER };
})();
