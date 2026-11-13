/* Phantasea Sessions — a music-driven C64-style fantasy battler for likethefish.ca.
   The party walks and fights while your music plays; ending the session prints a chronicle. */
(function () {
'use strict';
const root = document.getElementById('pq-root'); if (!root) return;
const PLAYLISTS = (window.PQ_PLAYLISTS && window.PQ_PLAYLISTS.length) ? window.PQ_PLAYLISTS : [['Singing', '0Bxvmnd4tPBXrr8Adj47CL']];

/* ---------- C64 palette (Pepto) ---------- */
const C = ['#000000', '#ffffff', '#68372b', '#70a4b2', '#6f3d86', '#588d43', '#352879', '#b8c76f', '#6f4f25', '#433900', '#9a6759', '#444444', '#6c6c6c', '#9ad284', '#6c5eb5', '#959595'];
const CN = ['black', 'white', 'red', 'cyan', 'purple', 'green', 'blue', 'yellow', 'orange', 'brown', 'pink', 'dark grey', 'grey', 'light green', 'light blue', 'silver'];
const W = 320, H = 200;

/* ---------- styles + markup ---------- */
const FONT = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
if (!document.querySelector('link[data-pq-font]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT; l.setAttribute('data-pq-font', '1'); document.head.appendChild(l); }
const css = `
#pq{--bg:#352879;--fr:#6c5eb5;--ink:#6c5eb5;font-family:'Press Start 2P',monospace;color:#c8c0ff;background:#1d1640;border-radius:14px;padding:14px max(14px,env(safe-area-inset-left));max-width:1000px;margin:0 auto;box-sizing:border-box}
#pq *{box-sizing:border-box}
#pq .pq-title{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin:2px 4px 12px}
#pq .pq-title b{font-size:clamp(14px,3vw,22px);color:#fff;letter-spacing:1px}#pq .pq-title span{font-size:10px;color:#9a8fe0}
#pq .pq-tv{background:var(--fr);padding:clamp(10px,3.4%,34px);border-radius:10px;box-shadow:inset 0 0 0 3px #4a3f9a,0 10px 30px -10px #000}
#pq canvas#pq-cv{display:block;width:100%;aspect-ratio:320/200;image-rendering:pixelated;image-rendering:crisp-edges;background:#352879;cursor:pointer}
#pq .pq-hud{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center;margin:10px 2px 0;font-size:10px;color:#b8b0f0}
#pq .pq-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
#pq button,#pq select,#pq input{font-family:inherit;font-size:10px;line-height:1.4;color:#fff;background:#352879;border:2px solid #6c5eb5;border-radius:6px;padding:8px 10px;cursor:pointer;text-transform:none;letter-spacing:0}
#pq input{cursor:text;min-width:0;flex:1 1 180px}
#pq select{max-width:100%;flex:1 1 220px}
#pq button:hover,#pq select:hover{background:#4a3f9a}
#pq button.go{background:#588d43;border-color:#9ad284}#pq button.go:hover{background:#6aa452}
#pq button.end{background:#68372b;border-color:#9a6759}
#pq button[aria-pressed="true"]{background:#6c5eb5;border-color:#fff}
#pq .pq-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
#pq .pq-panel{display:none;margin-top:10px;padding:10px;border:2px dashed #4a3f9a;border-radius:8px}#pq .pq-panel.on{display:block}
#pq .pq-embed{margin-top:8px;border-radius:12px;overflow:hidden;min-height:80px}
#pq .pq-note{font-size:9px;line-height:1.8;color:#9a8fe0;margin:8px 2px 0}
#pq .pq-songs{font-size:9px;line-height:1.9;color:#c8c0ff;margin:12px 2px 0;max-height:160px;overflow:auto}
#pq .pq-quest{font-size:9px;line-height:1.9;color:#ffe060;margin:12px 2px 0;padding:8px 10px;border:2px solid #433900;border-radius:8px;background:#2a2060}
#pq .pq-quest i{font-style:normal;color:#9a8fe0}
#pq-sheet .q{border:3px double currentColor;padding:6px 8px;margin:10px 0 0;text-align:center}
#pq .pq-logo,#pq .pq-fsinfo,#pq .pq-fsx{display:none}
#pq .pq-tv.full{position:fixed;inset:0;z-index:2147483000;border-radius:0;padding:0;background:#6c5eb5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4vh;box-shadow:none;padding:2.5vh 0 1vh}
#pq .pq-tv.full canvas#pq-cv{width:min(94vw,calc((100vh - 19vh) * 1.6));height:auto;box-shadow:0 0 0 6px #4a3f9a}
#pq .pq-tv.full .pq-logo{display:flex;flex-direction:column;align-items:center;gap:.8vh;line-height:1}
#pq .pq-logo b{font-size:clamp(18px,5.2vh,54px);color:#fff;letter-spacing:.12em;text-shadow:.12em .12em 0 #352879,-.04em -.04em 0 #9a6759;background:linear-gradient(#ffe060 0 40%,#fff 40% 55%,#9ad284 55%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(4px 4px 0 #352879)}
#pq .pq-logo span{font-size:clamp(7px,1.4vh,13px);color:#d8d0ff;letter-spacing:.3em}
#pq .pq-tv.full .pq-fsinfo{display:block;font-size:clamp(7px,1.4vh,12px);color:#ffe060;text-align:center;line-height:1.8}
#pq .pq-tv.full .pq-fsx{display:block;position:absolute;top:12px;right:12px;font-size:14px;padding:6px 10px}
#pq-sheet{display:none}
@media print{
  body *{visibility:hidden!important}
  #pq-sheet,#pq-sheet *{visibility:visible!important}
  #pq-sheet{display:block!important;position:absolute;left:0;top:0;width:100%}
  @page{size:letter;margin:0.35in}
}
#pq-sheet.show{display:block}
#pq-sheet{font-family:'Press Start 2P',monospace;color:#2a2060;background:#fff;max-width:8.5in;margin:18px auto 0;padding:0.35in;border-radius:6px;font-size:8px;line-height:1.7}
#pq-sheet.c64{background:#352879;color:#c8c0ff;border:12px solid #6c5eb5}
#pq-sheet h1{font-size:15px;margin:0 0 4px;letter-spacing:1px}#pq-sheet h2{font-size:10px;margin:14px 0 6px;padding-bottom:4px;border-bottom:3px solid currentColor}
#pq-sheet .sub{font-size:8px;opacity:.75}
#pq-sheet table{width:100%;border-collapse:collapse;font-size:8px}#pq-sheet td,#pq-sheet th{padding:4px 5px;text-align:left;vertical-align:middle;border-bottom:1px dotted currentColor}
#pq-sheet img{image-rendering:pixelated;image-rendering:crisp-edges;display:block}
#pq-sheet .best{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
#pq-sheet .card{border:2px solid currentColor;padding:6px;break-inside:avoid;text-align:center;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px}
#pq-sheet .card img{margin:2px auto;height:48px;width:auto}
#pq-sheet .card b{font-size:7px;line-height:1.5}#pq-sheet .card small{font-size:6px;line-height:1.5;opacity:.8}
#pq-sheet ol{margin:0;padding-left:22px}#pq-sheet li{margin:0 0 3px}
#pq-sheet .lv{display:inline-flex;gap:1px;align-items:flex-end;height:22px;vertical-align:middle}#pq-sheet .lv i{display:block;width:4px;background:currentColor}
#pq-sheet .foot{margin-top:12px;text-align:center;font-size:7px;opacity:.7}
#pq .pq-sheetbar{display:none;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px}#pq .pq-sheetbar.on{display:flex}
@media (max-width:600px){#pq-sheet .best{grid-template-columns:repeat(2,1fr)}}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
root.innerHTML = `
<div id="pq">
  <div class="pq-title"><b>PHANTASEA SESSIONS</b><span>roll a party · press play · battle to the music</span></div>
  <div class="pq-tv" id="pq-tv"><div class="pq-logo" aria-hidden="true"><b>PHANTASEA</b><span>SESSIONS · LIKETHEFISH.CA</span></div><div class="pq-fsinfo" id="pq-fsinfo"></div><button class="pq-fsx" id="pq-fsx" title="Exit full screen">✕</button><canvas id="pq-cv" width="320" height="200" aria-label="Phantasea game screen"></canvas></div>
  <div class="pq-hud"><span id="pq-status">READY.</span><span id="pq-songnow">♪ —</span></div>
  <div class="pq-tabs" role="tablist">
    <button data-tab="sp" aria-pressed="true">Spotify player here</button>
    <button data-tab="mic" aria-pressed="false">🎤 Mic mode</button>
    <button data-tab="type" aria-pressed="false">Type my songs</button>
  </div>
  <div class="pq-panel on" data-panel="sp">
    <div class="pq-row"><select id="pq-pl" aria-label="Pick a Like The Fish playlist"><option value="">Pick a Like The Fish playlist…</option></select><button id="pq-rand">🎲 Random</button></div>
    <div class="pq-row"><input id="pq-url" placeholder="…or paste any Spotify link" aria-label="Spotify link"><button id="pq-load">Load player</button></div>
    <div class="pq-embed" id="pq-embed"></div>
    <p class="pq-note">Press play in the Spotify player. The party only adventures while the music plays; each new song brings new monsters.</p>
  </div>
  <div class="pq-panel" data-panel="mic">
    <div class="pq-row"><button id="pq-mic" class="go">🎤 Start listening</button></div>
    <p class="pq-note">Play music out loud (Spotify app, a speaker, a record player). The louder it gets, the fiercer the battle. A few seconds of quiet starts a new song.</p>
  </div>
  <div class="pq-panel" data-panel="type">
    <div class="pq-row"><input id="pq-typed" placeholder="What's playing? (song – artist)" aria-label="Song name"><button id="pq-tstart" class="go">▶ Start song</button><button id="pq-tend">■ Song over</button></div>
    <p class="pq-note">For music from anywhere: records, radio, the car.</p>
  </div>
  <div class="pq-row">
    <span style="font-size:9px;color:#9a8fe0">Battle pace</span>
    <button data-pace="0.6" aria-pressed="false">Chill</button><button data-pace="1" aria-pressed="true">Normal</button><button data-pace="1.8" aria-pressed="false">Frantic</button>
    <span style="flex:1"></span>
    <button id="pq-fs">⛶ Full screen</button><button id="pq-new">New party</button><button id="pq-endbtn" class="end">End session & make my print</button>
  </div>
  <div class="pq-quest" id="pq-quest"></div>
  <div class="pq-songs" id="pq-songs"></div>
  <div class="pq-sheetbar" id="pq-sheetbar"><button id="pq-print" class="go">🖨 Print / save PDF (8.5×11)</button><button id="pq-c64">C64 colours</button><button id="pq-keep">Keep adventuring</button></div>
  <div id="pq-sheet"></div>
</div>`;
const $ = (s) => root.querySelector(s);
const cv = $('#pq-cv'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;

/* ---------- utilities ---------- */
let seed = (Date.now() ^ 0x9e3779b9) >>> 0;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (a) => a[Math.floor(rnd() * a.length)];
const d = (n, s) => { let t = 0; for (let i = 0; i < n; i++) t += ri(1, s); return t; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const upper = (s) => String(s).toUpperCase();
function txt(s, x, y, col = 1, align = 'left', size = 8) {
  g.font = `${size}px "Press Start 2P", monospace`; g.textBaseline = 'top'; g.textAlign = align;
  g.fillStyle = typeof col === 'number' ? C[col] : col; g.fillText(s, Math.round(x), Math.round(y));
}
function box(x, y, w, h, bg = 6, fr = 14) { g.fillStyle = C[fr]; g.fillRect(x, y, w, h); g.fillStyle = C[bg]; g.fillRect(x + 2, y + 2, w - 4, h - 4); }
function wrap(s, max) { const out = []; let line = ''; for (const w of String(s).split(' ')) { if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; } else line += ' ' + w; } if (line.trim()) out.push(line.trim()); return out; }

/* ---------- sprite generators ---------- */
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// Monster: mirrored random bitmap shaped by a body plan, outlined, with eyes. Returns {img, w, h}
const PLANS = ['blob', 'biped', 'winged', 'serpent', 'spider', 'tall'];
function genMonsterSprite(rng, plan, c1, c2, c3) {
  const hw = { blob: 6, biped: 6, winged: 8, serpent: 9, spider: 8, tall: 5 }[plan], h = { blob: 11, biped: 14, winged: 12, serpent: 9, spider: 10, tall: 16 }[plan];
  const w = hw * 2; const grid = Array.from({ length: h }, () => Array(w).fill(0));
  for (let y = 0; y < h; y++) for (let x = 0; x < hw; x++) {
    const nx = (hw - x) / hw, ny = y / (h - 1); let p = 0;
    if (plan === 'blob') p = 1 - Math.hypot(nx * 1.0, (ny - 0.55) * 1.6) * 0.95;
    if (plan === 'biped') p = ny < 0.3 ? 1 - Math.hypot(nx, (ny - 0.15) * 3) : ny < 0.72 ? 0.95 - nx * 0.9 : (x === hw - 3 || x === hw - 4 || (ny > .9 && x === hw - 5)) ? 0.95 : 0.05;
    if (plan === 'winged') p = ny < 0.55 ? (0.35 + nx * 0.3 + (ny < 0.35 ? (1 - nx) * 0.55 : 0)) : 0.95 - nx * 1.4 - (ny - 0.55);
    if (plan === 'serpent') p = Math.abs(ny - 0.5 - 0.25 * Math.sin(x * 0.9)) < 0.28 ? 0.9 : 0.05;
    if (plan === 'spider') p = ny > 0.25 && ny < 0.65 && nx < 0.55 ? 0.95 : (((x + y) % 3 === 0) && ny > 0.35) ? 0.7 : 0.08;
    if (plan === 'tall') p = ny < 0.22 ? 1 - Math.hypot(nx, (ny - 0.1) * 4) : 0.9 - nx * (ny > 0.75 ? 0.4 : 0.9);
    p += (rng() - 0.5) * 0.55;
    if (p > 0.5) { const v = rng() < 0.22 ? 2 : rng() < 0.12 ? 3 : 1; grid[y][x] = v; grid[y][w - 1 - x] = v; }
  }
  // remove lonely pixels
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (grid[y][x]) { let n = 0; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { if (grid[y + b] && grid[y + b][x + a]) n++; }); if (!n) grid[y][x] = 0; }
  // eyes
  const eyes = plan === 'spider' ? 4 : ri(1, 3), ey = Math.max(1, Math.floor(h * (plan === 'serpent' ? 0.35 : 0.22)));
  const spots = eyes === 1 ? [hw - 1] : eyes === 2 ? [hw - 3, hw + 2] : eyes === 3 ? [hw - 3, hw - 1, hw + 1] : [hw - 4, hw - 2, hw + 1, hw + 3];
  const c = makeCanvas(w + 2, h + 2), x = c.getContext('2d');
  // outline pass
  x.fillStyle = '#000';
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (grid[yy][xx]) x.fillRect(xx, yy, 3, 3);
  const cols = [null, c1, c2, c3];
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (grid[yy][xx]) { x.fillStyle = C[cols[grid[yy][xx]]]; x.fillRect(xx + 1, yy + 1, 1, 1); }
  spots.forEach((sx) => { const yy = ey + (eyes === 3 && sx === hw - 1 ? -1 : 0); x.fillStyle = '#fff'; x.fillRect(sx + 1, yy + 1, 1, 1); x.fillStyle = C[eyes > 3 ? 2 : 0]; x.fillRect(sx + 1, yy + 2, 1, 1); });
  return { img: c, w: w + 2, h: h + 2, eyes };
}
// Hero: little humanoid with class kit
const HAIR = [9, 8, 7, 0, 15, 2], SKIN = ['#f2c8a0', '#d8a070', '#a86e48', '#6f4f25', '#9ad284', '#9a6759'];
function genHeroSprite(hero) {
  const c = makeCanvas(14, 18), x = c.getContext('2d'), k = hero.kit;
  const px = (a, b, w, h, col) => { x.fillStyle = typeof col === 'number' ? C[col] : col; x.fillRect(a, b, w, h); };
  // outline silhouette
  px(4, 0, 6, 1, 0); px(3, 1, 8, 6, 0); px(2, 6, 10, 7, 0); px(3, 13, 3, 5, 0); px(8, 13, 3, 5, 0);
  px(4, 1, 6, 5, hero.skin); // head
  px(4, 1, 6, 2, hero.hair); if (k.hood) { px(3, 1, 8, 2, k.c1); px(3, 3, 1, 3, k.c1); px(10, 3, 1, 3, k.c1); }
  if (k.helm) { px(4, 0, 6, 2, 15); px(6, 2, 2, 1, 15); }
  px(5, 3, 1, 1, 0); px(8, 3, 1, 1, 0);
  px(3, 7, 8, 6, k.c1); px(3, 7, 8, 1, k.c2); px(6, 8, 2, 4, k.c2); // body
  if (k.robe) px(3, 12, 8, 4, k.c1);
  px(4, 13, 2, 4, k.legs); px(8, 13, 2, 4, k.legs); px(4, 17, 2, 1, 0); px(8, 17, 2, 1, 0);
  // weapon / offhand
  if (k.wpn === 'sword') { px(12, 3, 1, 9, 15); px(11, 10, 3, 1, 8); }
  if (k.wpn === 'axe') { px(12, 3, 1, 10, 8); px(11, 3, 3, 3, 15); }
  if (k.wpn === 'staff') { px(12, 1, 1, 15, 8); px(11, 0, 3, 2, k.c2 === 1 ? 7 : k.c2); }
  if (k.wpn === 'bow') { px(12, 4, 1, 9, 8); px(13, 5, 1, 7, 15); }
  if (k.wpn === 'dagger') { px(12, 8, 1, 4, 15); }
  if (k.wpn === 'lute') { px(11, 9, 3, 3, 8); px(12, 5, 1, 4, 9); }
  if (k.wpn === 'fist') { px(11, 8, 2, 2, hero.skin); }
  if (k.shield) { px(0, 7, 3, 5, k.c2); px(1, 8, 1, 3, 7); }
  return c;
}

/* ---------- name + character tables ---------- */
const CLASSES = {
  Fighter: { hd: 10, atk: 'melee', kit: { wpn: 'sword', shield: true, helm: true, c1: 12, c2: 2, legs: 9 } },
  Barbarian: { hd: 12, atk: 'melee', kit: { wpn: 'axe', c1: 8, c2: 9, legs: 9 } },
  Paladin: { hd: 10, atk: 'melee', heal: 1, kit: { wpn: 'sword', shield: true, helm: true, c1: 15, c2: 7, legs: 12 } },
  Ranger: { hd: 10, atk: 'ranged', kit: { wpn: 'bow', hood: true, c1: 5, c2: 13, legs: 9 } },
  Rogue: { hd: 8, atk: 'melee', crit: 1, kit: { wpn: 'dagger', hood: true, c1: 11, c2: 12, legs: 0 } },
  Monk: { hd: 8, atk: 'melee', twice: 1, kit: { wpn: 'fist', c1: 8, c2: 7, legs: 8 } },
  Cleric: { hd: 8, atk: 'melee', heal: 2, kit: { wpn: 'staff', shield: true, c1: 1, c2: 7, legs: 12, robe: true } },
  Druid: { hd: 8, atk: 'spell', heal: 1, spell: 'Thornwhip', kit: { wpn: 'staff', hood: true, c1: 5, c2: 9, legs: 9, robe: true } },
  Wizard: { hd: 6, atk: 'spell', aoe: 1, spell: 'Fireball', kit: { wpn: 'staff', hood: true, c1: 6, c2: 14, legs: 6, robe: true } },
  Sorcerer: { hd: 6, atk: 'spell', spell: 'Chaos Bolt', kit: { wpn: 'staff', c1: 2, c2: 10, legs: 2, robe: true } },
  Warlock: { hd: 8, atk: 'spell', spell: 'Eldritch Blast', kit: { wpn: 'staff', hood: true, c1: 4, c2: 0, legs: 0, robe: true } },
  Bard: { hd: 8, atk: 'spell', inspire: 1, spell: 'Vicious Mockery', kit: { wpn: 'lute', c1: 10, c2: 7, legs: 4 } },
};
const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Tiefling', 'Dragonborn'];
const SYL1 = ['Ar', 'Bel', 'Cor', 'Dra', 'El', 'Fen', 'Gar', 'Hal', 'Ith', 'Jor', 'Kel', 'Lor', 'Mor', 'Nym', 'Or', 'Pell', 'Quin', 'Ror', 'Syl', 'Thra', 'Ul', 'Vor', 'Wyn', 'Zan'];
const SYL2 = ['ak', 'and', 'ara', 'en', 'eth', 'ia', 'in', 'is', 'ok', 'or', 'os', 'ric', 'wyn', 'ys', 'um', 'ette', 'grim', 'dor', 'lin', 'mar'];
const EPI = ['the Bold', 'Quickstep', 'of the Fen', 'Ironbelly', 'the Grey', 'Songsworn', 'Kettleborn', 'the Unlucky', 'Two-Coins', 'Mossbeard', 'Brightwater', 'the Loud'];
const heroName = () => pick(SYL1) + pick(SYL2);
const ADJ = ['Gloomy', 'Shrieking', 'Vile', 'Glittering', 'Moss-backed', 'Ninefold', 'Pale', 'Ember', 'Brine', 'Howling', 'Crystal', 'Gibbering', 'Rotting', 'Velvet', 'Thorned', 'Drowned', 'Clockwork', 'Bog', 'Star-eyed', 'Copper', 'Hollow', 'Grinning', 'Static', 'Jelly', 'Ashen', 'Feral', 'Lunar', 'Cackling', 'Barnacled', 'Vinyl'];
const BASE = { blob: ['Ooze', 'Slime', 'Jelly', 'Puffball', 'Blight', 'Gloop'], biped: ['Gnoll', 'Ghoul', 'Kobold', 'Troll', 'Goblin', 'Bugbear', 'Hobgob'], winged: ['Harpy', 'Imp', 'Moth', 'Bat', 'Wyvernling', 'Gargoyle'], serpent: ['Wyrm', 'Eel', 'Basilisk', 'Naga', 'Worm', 'Serpent'], spider: ['Spider', 'Crab', 'Beetle', 'Scuttler', 'Tick', 'Crawler'], tall: ['Wraith', 'Shade', 'Golem', 'Treant', 'Lurker', 'Stalker'] };
const TITLE = ['', '', '', ' Lord', ' Spawn', ' Queen', ' of the Fen', ' Elder', ' Brute', ' Chanter'];
const SIZES = [['Tiny', 1.5, 0.4], ['Small', 2, 0.7], ['Medium', 2.5, 1], ['Large', 3, 1.6], ['Huge', 3.5, 2.5], ['Gargantuan', 4, 3.6]];

/* ---------- state ---------- */
const S = {
  phase: 'roll', party: [], gold: 0, foes: [], bestiary: [], songs: [], curSong: -1, playing: false, pace: 1, energy: 0.5,
  walkT: 0, nextEnc: 8, log: [], turnQ: [], turnT: 0, anim: null, banner: null, floaters: [], deaths: 0, battles: 0, wins: 0, started: Date.now(), fieldX: 0, rolling: null, chronicle: [],
};
function newHero() {
  const cls = pick(Object.keys(CLASSES)), race = pick(RACES), info = CLASSES[cls];
  const roll = () => { const r = [d(1, 6), d(1, 6), d(1, 6), d(1, 6)].sort((a, b) => a - b); return r[1] + r[2] + r[3]; };
  const stats = { STR: roll(), DEX: roll(), CON: roll(), INT: roll(), WIS: roll(), CHA: roll() };
  const mod = (v) => Math.floor((v - 10) / 2);
  const hp = info.hd + Math.max(1, mod(stats.CON) + 2) + 6;
  const h = { name: heroName(), epi: pick(EPI), cls, race, info, stats, lvl: 1, xp: 0, hp, max: hp, kills: 0, dmg: 0, hair: C[pick(HAIR)], skin: pick(SKIN), lvlBySong: [], alive: true };
  h.kit = Object.assign({}, info.kit); h.sprite = genHeroSprite(h);
  h.atkBonus = Math.max(mod(stats.STR), mod(stats.DEX), info.atk === 'spell' ? Math.max(mod(stats.INT), mod(stats.WIS), mod(stats.CHA)) : -9);
  return h;
}
function rollParty() { S.party = [newHero(), newHero(), newHero(), newHero()]; S.rolling = { t: 0, faces: Array.from({ length: 24 }, () => ri(1, 6)) }; }
function partyLevel() { const a = S.party.filter((h) => h.alive); return a.length ? a.reduce((s, h) => s + h.lvl, 0) / a.length : 1; }

function newMonsterType() {
  const plan = pick(PLANS), size = SIZES[clamp(Math.floor(rnd() * rnd() * 6.2), 0, 5)];
  const c1 = pick([2, 3, 4, 5, 7, 8, 10, 13, 14, 15, 12]); let c2 = pick([1, 3, 7, 10, 13, 14, 15, 2, 4]); if (c2 === c1) c2 = 1; const c3 = pick([7, 1, 2, 13]);
  const local = (() => { let s2 = (seed ^ 0xabcdef) >>> 0; return () => { s2 = (s2 * 1103515245 + 12345) >>> 0; return s2 / 4294967296; }; })();
  const sp = genMonsterSprite(local, plan, c1, c2, c3);
  const base = pick(BASE[plan]); const name = pick(ADJ) + ' ' + base + pick(TITLE);
  const lvl = Math.max(1, Math.round(partyLevel() + ri(-1, 1) + size[2] * 0.6));
  const hp = Math.round((6 + lvl * 5) * size[2]);
  const t = { id: S.bestiary.length + 1, name, base, plan, size: size[0], scale: size[1], mult: size[2], lvl, hp, dmg: Math.max(2, Math.round((2 + lvl * 1.4) * Math.sqrt(size[2]))), xp: Math.round((10 + lvl * 8) * size[2]), c1, c2, sprite: sp, eyes: sp.eyes, slain: 0, slainBy: {}, song: S.curSong, desc: '' };
  t.desc = `${t.size} ${CN[c1]} ${base.toLowerCase()} with ${sp.eyes} eye${sp.eyes > 1 ? 's' : ''} and ${CN[c2]} markings`;
  S.bestiary.push(t);
  return t;
}
function encounter() {
  const t = newMonsterType(); let t2 = null;
  const n = t.mult >= 2.5 ? 1 : clamp(Math.round((2 + rnd() * 3) / t.mult), 1, 6);
  S.foes = [];
  for (let i = 0; i < n; i++) S.foes.push({ type: t, hp: t.hp, max: t.hp, alive: true, x: 0, y: 0, flash: 0 });
  if (n <= 2 && rnd() < 0.45 && t.mult < 2) { t2 = newMonsterType(); const m = clamp(Math.round(2.5 / t2.mult), 1, 3); for (let i = 0; i < m; i++) S.foes.push({ type: t2, hp: t2.hp, max: t2.hp, alive: true, x: 0, y: 0, flash: 0 }); }
  layoutFoes();
  S.phase = 'battle'; S.battles++; S.turnQ = []; S.turnT = 900; S.log = [];
  const names = [t, t2].filter(Boolean).map((x) => `${S.foes.filter((f) => f.type === x).length} ${upper(x.name)}`).join(' & ');
  say(`ENCOUNTER! ${names}`);
  if (S.curSong >= 0) S.songs[S.curSong].foes.push(...[t, t2].filter(Boolean).map((x) => x.name));
}
function layoutFoes() {
  // monsters on the right in up to 3 columns, sized by their scale
  const list = S.foes; const cols = list.length > 3 ? 2 : 1; let i = 0;
  list.forEach((f) => { const sc = f.type.scale, w = f.type.sprite.w * sc, h = f.type.sprite.h * sc; const col = cols === 2 ? i % 2 : 0, row = cols === 2 ? Math.floor(i / 2) : i; f.w = w; f.h = h; f.x = 312 - (col + 1) * 70 + (70 - w) / 2; f.y = 0; f.row = row; i++; });
  const rows = Math.max(...list.map((f) => f.row)) + 1;
  for (let r = 0; r < rows; r++) { const inRow = list.filter((f) => f.row === r); const hh = Math.max(...inRow.map((f) => f.h)); inRow.forEach((f) => { f.rowH = hh; }); }
  let y = 26; for (let r = 0; r < rows; r++) { const inRow = list.filter((f) => f.row === r); const hh = inRow[0].rowH; inRow.forEach((f) => { f.y = y + (hh - f.h); }); y += hh + 6; }
  const over = y - 128; if (over > 0) list.forEach((f) => { f.y -= over * (f.row / Math.max(1, rows - 1)); });
}

/* ---------- log ---------- */
function say(s) { S.log.push(upper(s)); if (S.log.length > 3) S.log.shift(); }
function chronicle(s) { S.chronicle.push({ song: S.curSong, text: s }); }

/* ---------- battle ---------- */
function heroPos(i) { return { x: 34 + (i % 2) * 22, y: 36 + i * 24 }; }
function buildQueue() {
  const actors = [];
  S.party.forEach((h, i) => { if (h.alive) actors.push({ side: 'p', who: h, i, init: d(1, 20) + Math.floor((h.stats.DEX - 10) / 2) }); });
  S.foes.forEach((f, i) => { if (f.alive) actors.push({ side: 'm', who: f, i, init: d(1, 20) }); });
  S.turnQ = actors.sort((a, b) => b.init - a.init);
}
function battleStep() {
  if (!S.party.some((h) => h.alive)) return partyWiped();
  if (!S.foes.some((f) => f.alive)) return victory();
  if (!S.turnQ.length) buildQueue();
  const a = S.turnQ.shift(); if (!a || !a.who.alive) return;
  if (a.side === 'p') heroAct(a.who, a.i); else foeAct(a.who, a.i);
}
function heroAct(h, i) {
  const info = h.info, foes = S.foes.filter((f) => f.alive);
  const hurt = S.party.filter((p) => p.alive && p.hp < p.max * 0.45).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
  if (info.heal && hurt && rnd() < 0.55 + info.heal * 0.1) {
    const amt = d(info.heal + 1, 6) + h.lvl; hurt.hp = Math.min(hurt.max, hurt.hp + amt);
    S.anim = { kind: 'cast', actor: h, ai: i, t: 0, dur: 700, col: 13 }; say(`${h.name} heals ${hurt.name} +${amt}`); floater(heroPos(S.party.indexOf(hurt)), '+' + amt, 13); return;
  }
  if (info.inspire && rnd() < 0.25) { S.party.forEach((p) => { p.inspired = 2; }); S.anim = { kind: 'cast', actor: h, ai: i, t: 0, dur: 700, col: 7 }; say(`${h.name} plays a rousing tune!`); return; }
  const tgt = pick(foes);
  const crit = rnd() < (info.crit ? 0.22 : 0.07) + S.energy * 0.05;
  const hit = rnd() < 0.72 + h.atkBonus * 0.04 + (h.inspired ? 0.1 : 0);
  if (h.inspired) h.inspired--;
  if (info.aoe && rnd() < 0.4) {
    let tot = 0; foes.forEach((f) => { const dm = d(Math.min(6, 1 + Math.ceil(h.lvl / 2)), 6); hurtFoe(f, dm, h); tot += dm; });
    S.anim = { kind: 'cast', actor: h, ai: i, t: 0, dur: 900, col: 8, aoe: true }; say(`${h.name} casts ${info.spell}! ${tot} dmg`); return;
  }
  let dm = 0; if (hit || crit) { dm = d(1, info.hd - 2) + Math.max(0, h.atkBonus) + Math.floor(h.lvl / 2); if (crit) dm *= 2; if (info.twice) dm += d(1, 4); }
  S.anim = { kind: info.atk === 'melee' ? 'bounce' : 'shoot', actor: h, ai: i, tgt, t: 0, dur: info.atk === 'melee' ? 620 : 560, dmg: dm, crit, col: info.atk === 'spell' ? 14 : 15 };
  const verb = info.atk === 'spell' ? `casts ${info.spell} at` : info.atk === 'ranged' ? 'shoots' : pick(['hits', 'slashes', 'strikes', 'smacks', 'bonks']);
  say(dm ? `${h.name} ${verb} ${tgt.type.base} for ${dm}${crit ? '!!' : ''}` : `${h.name} misses!`);
}
function foeAct(f) {
  const alive = S.party.filter((h) => h.alive); const tgt = pick(alive);
  const hit = rnd() < 0.62; const dm = hit ? Math.max(1, ri(Math.ceil(f.type.dmg / 2), f.type.dmg)) : 0;
  S.anim = { kind: 'bounce', actor: f, foe: true, tgt, t: 0, dur: 600, dmg: dm, col: 2 };
  say(dm ? `${f.type.base} ${pick(['bites', 'claws', 'slams', 'lashes', 'zaps', 'gnaws'])} ${tgt.name} for ${dm}` : `${f.type.base} misses ${tgt.name}`);
}
function hurtFoe(f, dm, h) { f.hp -= dm; f.flash = 300; floater({ x: f.x + f.w / 2, y: f.y }, String(dm), 7); h.dmg += dm; if (f.hp <= 0 && f.alive) { f.alive = false; h.kills++; f.type.slain++; f.type.slainBy[h.name] = (f.type.slainBy[h.name] || 0) + 1; } }
function resolveAnim(a) {
  if (a.foe) { if (a.dmg) { a.tgt.hp -= a.dmg; a.tgt.flash = 300; floater(heroPos(S.party.indexOf(a.tgt)), String(a.dmg), 2); if (a.tgt.hp <= 0) { a.tgt.alive = false; a.tgt.hp = 0; say(`${a.tgt.name} falls!`); chronicle(`${a.tgt.name} fell to the ${a.actor.type.name}.`); } } return; }
  if (a.tgt && a.dmg) hurtFoe(a.tgt, a.dmg, a.actor);
}
function victory() {
  const types = [...new Set(S.foes.map((f) => f.type))]; const xp = types.reduce((s, t) => s + t.xp * S.foes.filter((f) => f.type === t).length, 0);
  const gold = ri(5, 25) * Math.max(1, Math.round(xp / 30)); S.gold += gold; S.wins++;
  const alive = S.party.filter((h) => h.alive);
  alive.forEach((h) => { h.xp += Math.round(xp / alive.length); const need = h.lvl * 100; if (h.xp >= need) { h.xp -= need; h.lvl++; const up = Math.max(2, Math.ceil(h.info.hd / 2) + Math.floor((h.stats.CON - 10) / 2)); h.max += up; h.hp = h.max; say(`${h.name} reaches level ${h.lvl}!`); chronicle(`${h.name} the ${h.cls} reached level ${h.lvl}.`); } });
  S.party.forEach((h) => { if (!h.alive && rnd() < 0.5) { h.alive = true; h.hp = Math.ceil(h.max / 3); } else if (h.alive) h.hp = Math.min(h.max, h.hp + Math.ceil(h.max * 0.15)); });
  say(`Victory! ${xp} XP, ${gold} gold`);
  chronicle(`Defeated ${types.map((t) => t.name).join(' and ')} (+${xp} XP, ${gold} gold).`);
  S.phase = 'loot'; S.lootT = 1800;
}
function partyWiped() {
  S.deaths++; const lost = Math.floor(S.gold / 2); S.gold -= lost;
  say('The party has fallen...'); chronicle(`The party fell to ${S.foes[0].type.name}. The Temple of the Fish revived them${lost ? ` for ${lost} gold` : ''}.`);
  S.phase = 'temple'; S.lootT = 3200;
}
function floater(p, s, col) { S.floaters.push({ x: p.x, y: p.y, s, col, t: 0 }); }

/* ---------- music hooks ---------- */
function songStart(title) {
  acct(); S.songs.push({ title: title || `Track ${S.songs.length + 1}`, foes: [], at: Date.now(), secs: 0, uri: null });
  S.curSong = S.songs.length - 1; S.playing = true;
  S.party.forEach((h) => { h.lvlBySong[S.curSong] = h.lvl; });
  S.banner = { text: '♪ ' + (title || `TRACK ${S.songs.length}`), t: 0 };
  if (S.phase === 'walk' && S.nextEnc - S.walkT > 3) S.nextEnc = S.walkT + 3;
  renderSongs(); setStatus();
}
function setTitle(i, title) { if (S.songs[i]) { S.songs[i].title = title; if (i === S.curSong && S.banner) S.banner.text = '♪ ' + title; renderSongs(); setStatus(); } }
function setPlaying(p) { acct(); S.playing = p; setStatus(); }
/* ---------- the 2048 quest: 2048 seconds of listening in six songs or fewer ---------- */
const GOAL = 2048, NEAR = 100, EXACT = 2, MAXSONGS = 6;
let lastAcct = Date.now();
function acct() { const now = Date.now(); if (S.playing && !S.ended && S.curSong >= 0 && S.songs[S.curSong]) S.songs[S.curSong].secs += (now - lastAcct) / 1000; lastAcct = now; }
function totalSecs() { return S.songs.reduce((t, s) => t + s.secs, 0); }
function fmt(t) { t = Math.round(t); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
function songsLeftText() { const n = S.songs.length, l = MAXSONGS - n; return !n ? `${MAXSONGS} SONGS TO SURVIVE` : l <= 0 ? 'FINAL SONG!' : `${l} SONG${l === 1 ? '' : 'S'} LEFT`; }
function questResult() { const t = totalSecs(), n = S.songs.length; if (!n) return 'none'; if (n > MAXSONGS) return 'over'; const off = Math.abs(t - GOAL); return off <= EXACT ? 'perfect' : off <= NEAR ? 'won' : t < GOAL - NEAR ? 'short' : 'long'; }
let questTick = 0;
function renderQuest() {
  const t = totalSecs(), n = S.songs.length, left = GOAL - t;
  const lt = songsLeftText();
  const html = `THE QUEST: SURVIVE ${MAXSONGS} SONGS. LISTEN WELL, OR PERISH.<br>${lt} · TIME HEARD ${fmt(t)}${S.ended ? ' · QUEST OVER' : ''}<br><i>HINT: THE LIMITS OF REGULAR NOTES IN SIX SONGS.</i>`;
  $('#pq-quest').innerHTML = html; $('#pq-fsinfo').innerHTML = `${lt} · TIME HEARD ${fmt(t)}<br><span style="color:#c8c0ff">HINT: THE LIMITS OF REGULAR NOTES IN SIX SONGS.</span>`;
}
function renderSongs() { $('#pq-songs').innerHTML = S.songs.length ? 'SONGS THIS QUEST (' + S.songs.length + '):<br>' + S.songs.map((s, i) => `${i + 1}. ${esc(s.title)}`).join('<br>') : ''; }
function setStatus() {
  const cur = S.songs[S.curSong];
  $('#pq-songnow').textContent = cur ? '♪ ' + cur.title : '♪ —';
  $('#pq-status').textContent = S.phase === 'roll' ? 'ROLL YOUR PARTY.' : !S.playing ? 'PAUSED — PRESS PLAY' : `LV ${partyLevel().toFixed(1)} · ${S.gold} GOLD · ${S.wins} WINS`;
}

/* ---------- drawing ---------- */
function drawRoll(now) {
  g.fillStyle = C[6]; g.fillRect(0, 0, W, H);
  txt('**** PHANTASEA SESSIONS ****', W / 2, 6, 14, 'center');
  txt('ROLL THE DICE FOR YOUR PARTY', W / 2, 18, 1, 'center');
  const r = S.rolling; if (r) r.t += 16;
  S.party.forEach((h, i) => {
    const y = 32 + i * 34; box(6, y, 308, 32, 6, 14);
    g.drawImage(h.sprite, 12, y + 4, 14 * 1.4, 18 * 1.4);
    const show = !r || r.t > 300 + i * 260;
    if (show) {
      txt(upper(h.name), 40, y + 5, 1); txt(upper(`${h.race} ${h.cls}`), 40, y + 16, 3);
      const sx = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']; sx.forEach((k, j) => { txt(k, 168 + (j % 3) * 50, y + 5 + Math.floor(j / 3) * 11, 15); txt(String(h.stats[k]).padStart(2, ' '), 196 + (j % 3) * 50, y + 5 + Math.floor(j / 3) * 11, h.stats[k] >= 15 ? 13 : h.stats[k] <= 7 ? 10 : 1); });
      txt('HP ' + h.max, 40, y + 25, 7, 'left', 6);
    } else {
      for (let k = 0; k < 4; k++) { const v = ri(1, 6); drawDie(170 + k * 30, y + 6, v); }
    }
  });
  if (Math.floor(now / 500) % 2) txt('CLICK = REROLL   ENTER = BEGIN', W / 2, 172, 7, 'center');
  txt('PRESS PLAY ON YOUR MUSIC TO BEGIN', W / 2, 186, 15, 'center', 6);
}
function drawDie(x, y, v) { g.fillStyle = C[1]; g.fillRect(x, y, 18, 18); g.fillStyle = C[0]; g.fillRect(x, y + 17, 18, 1); g.fillRect(x + 17, y, 1, 18); const P = { 1: [[9, 9]], 2: [[5, 5], [13, 13]], 3: [[5, 5], [9, 9], [13, 13]], 4: [[5, 5], [13, 5], [5, 13], [13, 13]], 5: [[5, 5], [13, 5], [9, 9], [5, 13], [13, 13]], 6: [[5, 4], [13, 4], [5, 9], [13, 9], [5, 14], [13, 14]] }[v]; g.fillStyle = C[2]; P.forEach(([a, b]) => g.fillRect(x + a - 1, y + b - 1, 3, 3)); }

// 16-bit style field with parallax
function drawField(now, dt) {
  const fx = S.fieldX;
  const sky = ['#3b5fc4', '#5a7fd8', '#7aa0e6', '#a0c2f0', '#c8e0f8'];
  sky.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, i * 14, W, 15); });
  for (let i = 1; i < sky.length; i++) { g.fillStyle = sky[i - 1]; for (let x = (i % 2); x < W; x += 2) g.fillRect(x, i * 14, 1, 1); }
  // clouds
  for (let i = 0; i < 4; i++) { const x = ((i * 97 - fx * 0.08) % 380 + 380) % 380 - 40; g.fillStyle = '#fff'; g.fillRect(x, 10 + i * 9, 30, 5); g.fillRect(x + 6, 6 + i * 9, 18, 5); g.fillStyle = '#d8e8ff'; g.fillRect(x + 2, 15 + i * 9, 26, 2); }
  // mountains
  g.fillStyle = '#6a68b0'; for (let x = 0; x < W; x += 2) { const X = x + fx * 0.2; const h = 22 + 14 * Math.sin(X * 0.03) + 8 * Math.sin(X * 0.071); g.fillRect(x, 72 - h, 2, h + 10); }
  g.fillStyle = '#e8e8ff'; for (let x = 0; x < W; x += 2) { const X = x + fx * 0.2; const h = 22 + 14 * Math.sin(X * 0.03) + 8 * Math.sin(X * 0.071); if (h > 34) g.fillRect(x, 72 - h, 2, 3); }
  // hills + trees
  g.fillStyle = '#3f8a3f'; for (let x = 0; x < W; x += 2) { const X = x + fx * 0.45; const h = 10 + 6 * Math.sin(X * 0.05); g.fillRect(x, 92 - h, 2, h + 8); }
  for (let i = 0; i < 9; i++) { const x = ((i * 53 - fx * 0.45) % 420 + 420) % 420 - 40; g.fillStyle = '#5a3a1a'; g.fillRect(x + 6, 78, 3, 10); g.fillStyle = '#2a6a2a'; g.fillRect(x, 66, 15, 14); g.fillRect(x + 3, 60, 9, 6); g.fillStyle = '#4aa04a'; g.fillRect(x + 2, 66, 5, 4); }
  // grass field with checker texture + path
  g.fillStyle = '#58a848'; g.fillRect(0, 92, W, 108);
  for (let y = 92; y < H; y += 4) for (let x = (((y >> 2) % 2) * 4 - Math.floor(fx) % 8 + 8) % 8 - 8; x < W; x += 8) { g.fillStyle = '#4c9a3e'; g.fillRect(x, y, 4, 4); }
  g.fillStyle = '#c8a868'; g.fillRect(0, 128, W, 22); g.fillStyle = '#b09050'; for (let x = (-Math.floor(fx) % 12 + 12) % 12 - 12; x < W; x += 12) g.fillRect(x, 136, 6, 2);
  // flowers & rocks
  for (let i = 0; i < 18; i++) { const x = ((i * 41 - fx) % 360 + 360) % 360 - 20, y = 156 + (i * 17) % 40; g.fillStyle = i % 3 ? '#ffe060' : '#ff70a0'; g.fillRect(x, y, 2, 2); }
  // party marching
  S.party.forEach((h, i) => { if (!h.alive) return; const bob = Math.abs(Math.sin(now / 160 + i)) * 2; g.drawImage(h.sprite, 120 - i * 20, 112 - bob, 14, 18); });
}
function drawBattle(now, dt) {
  g.fillStyle = C[0]; g.fillRect(0, 0, W, H);
  g.fillStyle = C[6]; g.fillRect(0, 0, W, 140);
  // ground strip
  g.fillStyle = C[11]; g.fillRect(0, 128, W, 12);
  // party
  const a = S.anim;
  S.party.forEach((h, i) => {
    const p = heroPos(i); let ox = 0, oy = 0;
    if (a && a.actor === h) { const k = a.t / a.dur; if (a.kind === 'bounce') { const tx = a.tgt ? a.tgt.x - p.x - 10 : 60; ox = tx * Math.sin(Math.PI * k); oy = -Math.abs(Math.sin(Math.PI * k * 2)) * 10; } else oy = -Math.abs(Math.sin(Math.PI * k * 3)) * 4; }
    if (h.flash > 0) { h.flash -= dt; if (Math.floor(h.flash / 60) % 2) return; }
    if (!h.alive) { g.save(); g.globalAlpha = 0.35; g.drawImage(h.sprite, p.x, p.y + 6, 14, 18); g.restore(); return; }
    g.drawImage(h.sprite, p.x + ox, p.y + oy, 14, 18);
  });
  // foes
  S.foes.forEach((f) => {
    if (!f.alive) return; let ox = 0, oy = 0;
    if (a && a.actor === f) { const k = a.t / a.dur; const tp = heroPos(S.party.indexOf(a.tgt)); ox = (tp.x + 20 - f.x) * Math.sin(Math.PI * k) * 0.8; oy = -Math.abs(Math.sin(Math.PI * k * 2)) * 8; }
    if (f.flash > 0) { f.flash -= dt; if (Math.floor(f.flash / 60) % 2) return; }
    g.drawImage(f.type.sprite.img, f.x + ox, f.y + oy, f.w, f.h);
  });
  // spell / arrow effects
  if (a && (a.kind === 'shoot' || a.kind === 'cast')) {
    const k = a.t / a.dur, p = heroPos(a.ai);
    if (a.kind === 'shoot' && a.tgt) { const x = p.x + 16 + (a.tgt.x - p.x - 16) * k, y = p.y + 8 + (a.tgt.y + a.tgt.h / 2 - p.y - 8) * k; g.fillStyle = C[a.col]; g.fillRect(x - 3, y, 6, 2); if (a.col === 14) { g.fillStyle = C[1]; g.fillRect(x - 1, y - 1, 3, 4); } }
    if (a.kind === 'cast') { g.strokeStyle = C[a.col]; g.lineWidth = 2; g.beginPath(); g.arc(p.x + 7, p.y + 9, 6 + k * 14, 0, Math.PI * 2); g.stroke(); if (a.aoe) S.foes.forEach((f) => { if (f.alive || f.flash > 0) { g.fillStyle = Math.floor(a.t / 60) % 2 ? C[8] : C[7]; g.fillRect(f.x, f.y + f.h - 4, f.w, 4); } }); }
  }
  // HP bars for party
  S.party.forEach((h, i) => { const p = heroPos(i); g.fillStyle = C[11]; g.fillRect(p.x - 2, p.y + 20, 18, 2); g.fillStyle = h.hp / h.max > 0.5 ? C[13] : h.hp / h.max > 0.25 ? C[7] : C[10]; g.fillRect(p.x - 2, p.y + 20, Math.max(0, 18 * h.hp / h.max), 2); });
  drawFloaters(dt);
  // bottom panel: Phantasie-style roster + log
  box(0, 140, 160, 60, 6, 14); box(160, 140, 160, 60, 6, 14);
  S.party.forEach((h, i) => { const y = 145 + i * 13; txt(upper(h.name).slice(0, 8), 6, y, h.alive ? 1 : 11); txt(`${h.cls.slice(0, 3).toUpperCase()}${h.lvl}`, 76, y, 3); txt(String(Math.max(0, h.hp)).padStart(3, ' '), 122, y, h.hp / h.max > 0.3 ? 13 : 10); });
  S.log.slice(-3).forEach((l, i) => wrap(l, 18).slice(0, 2).forEach((ln, j) => txt(ln, 166, 145 + i * 18 + j * 9, i === S.log.slice(-3).length - 1 ? 1 : 15, 'left', 6)));
  // foe names
  const types = [...new Set(S.foes.filter((f) => f.alive).map((f) => f.type))];
  types.slice(0, 2).forEach((t, i) => txt(`${S.foes.filter((f) => f.alive && f.type === t).length} ${upper(t.name)}`.slice(0, 38), 4, 4 + i * 9, i ? 7 : 1, 'left', 6));
}
function drawFloaters(dt) {
  S.floaters = S.floaters.filter((f) => (f.t += dt) < 900);
  S.floaters.forEach((f) => txt(f.s, f.x, f.y - f.t / 30, f.col, 'center'));
}
function drawLoot(now) {
  drawBattle(now, 0);
  g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, 0, W, 140);
  if (S.phase === 'temple') { txt('THE PARTY HAS FALLEN', W / 2, 50, 10, 'center'); txt('THE TEMPLE OF THE FISH', W / 2, 70, 3, 'center'); txt('REVIVES YOUR HEROES...', W / 2, 82, 3, 'center'); }
  else { txt('VICTORY!', W / 2, 48, 7, 'center', 16); txt(S.log[S.log.length - 1] || '', W / 2, 80, 1, 'center', 6); }
}
function drawBanner(dt) {
  const b = S.banner; if (!b) return; b.t += dt; if (b.t > 4200) { S.banner = null; return; }
  const k = Math.min(1, b.t / 300, (4200 - b.t) / 300); const y = -16 + 24 * k;
  box(10, y, 300, 16, 0, 7); txt(upper(b.text).slice(0, 36), W / 2, y + 4, 7, 'center', 6);
}
function drawPaused() { g.fillStyle = 'rgba(53,40,121,0.75)'; g.fillRect(0, 80, W, 30); txt('PRESS PLAY TO CONTINUE', W / 2, 91, 1, 'center'); }

/* ---------- main loop ---------- */
let last = performance.now();
function frame(now) {
  const rawDt = Math.min(60, now - last); last = now;
  const speed = S.pace * (0.6 + S.energy * 0.9);
  const dt = S.playing ? rawDt * speed : 0;
  acct(); if (++questTick % 15 === 0) renderQuest();
  if (S.phase === 'fireworks') { drawFireworks(rawDt); requestAnimationFrame(frame); return; }
  if (S.phase === 'graveyard') { drawGraveyard(rawDt); requestAnimationFrame(frame); return; }
  if (S.phase === 'roll') drawRoll(now);
  else if (S.phase === 'walk') {
    S.walkT += dt / 1000; S.fieldX += dt * 0.04;
    drawField(now, dt);
    if (S.walkT >= S.nextEnc && S.playing) encounter();
  } else if (S.phase === 'battle') {
    if (S.anim) { S.anim.t += dt; if (S.anim.t >= S.anim.dur) { const a = S.anim; S.anim = null; resolveAnim(a); S.turnT = 260; } }
    else if (S.playing) { S.turnT -= dt; if (S.turnT <= 0) battleStep(); }
    drawBattle(now, dt);
  } else if (S.phase === 'loot' || S.phase === 'temple') {
    S.lootT -= dt; drawLoot(now);
    if (S.lootT <= 0) { if (S.phase === 'temple') S.party.forEach((h) => { h.alive = true; h.hp = h.max; }); S.phase = 'walk'; S.walkT = 0; S.nextEnc = (6 + rnd() * 8) / Math.max(0.5, S.pace); S.foes = []; setStatus(); }
  }
  if (S.phase !== 'roll') { drawBanner(rawDt); if (!S.playing) drawPaused(); }
  requestAnimationFrame(frame);
}

/* ---------- controls ---------- */
function begin() { if (S.phase !== 'roll') return; S.phase = 'walk'; S.walkT = 0; S.nextEnc = 5; chronicle(`The party gathered: ${S.party.map((h) => `${h.name} ${h.epi} (${h.race} ${h.cls})`).join(', ')}.`); setStatus(); }
/* ---------- the graveyard (and a sad song: Chopin's Funeral March, public domain, played on a SID-style synth) ---------- */
const GY = { t: 0, rain: [] };
function startGraveyard() {
  S.phase = 'graveyard'; GY.t = 0; GY.rain = Array.from({ length: 90 }, () => [ri(0, W), ri(0, H), 2 + rnd() * 2]);
  dirge.start();
}
const dirge = (() => {
  let ac = null, timer = null, next = 0, step = 0;
  // [midi, beats] — melody; bass alternates Bb and Gb chords
  const M = [[58, 1], [58, .75], [58, .25], [58, 2], [61, .75], [60, .25], [60, .75], [58, .25], [58, .75], [57, .25], [58, 1],
             [58, 1], [58, .75], [58, .25], [58, 2], [61, .75], [60, .25], [60, .75], [58, .25], [58, .75], [57, .25], [58, 1],
             [65, 1.5], [63, .5], [62, 1.5], [60, .5], [62, 1], [63, .5], [65, .5], [60, 2], [58, 1], [57, 1], [58, 2]];
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const BEAT = 1.15;
  function note(type, f, t0, dur, vol) {
    const o = ac.createOscillator(), gn = ac.createGain(); o.type = type; o.frequency.value = f;
    gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(vol, t0 + 0.02); gn.gain.exponentialRampToValueAtTime(vol * 0.5, t0 + dur * 0.6); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.98);
    o.connect(gn); gn.connect(ac.master); o.start(t0); o.stop(t0 + dur);
  }
  function sched() {
    while (next < ac.currentTime + 0.6) {
      const [m, b] = M[step % M.length], d = b * BEAT;
      note('square', hz(m), next, d * 0.95, 0.06); note('triangle', hz(m + 12), next, d * 0.9, 0.03);
      const beatIdx = Math.round(M.slice(0, step % M.length).reduce((s, x) => s + x[1], 0));
      if (Math.abs(M.slice(0, step % M.length).reduce((s, x) => s + x[1], 0) - beatIdx) < 0.01) { const root = beatIdx % 2 ? 42 : 46; note('triangle', hz(root), next, BEAT * 0.95, 0.16); note('sawtooth', hz(root + 7), next, BEAT * 0.9, 0.025); }
      next += d; step++;
    }
  }
  return {
    start() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (!ac.master) { ac.master = ac.createGain(); ac.master.gain.value = 0.9; ac.master.connect(ac.destination); } ac.resume(); step = 0; next = ac.currentTime + 0.3; clearInterval(timer); timer = setInterval(sched, 150); } catch (e) {} },
    stop() { clearInterval(timer); timer = null; if (ac && ac.master) { const m = ac.master; m.gain.setTargetAtTime(0, ac.currentTime, 0.3); setTimeout(() => { try { m.disconnect(); } catch (e) {} }, 1500); ac.master = null; } },
    blocked() { return ac && ac.state !== 'running'; }, resume() { ac && ac.resume(); },
  };
})();
function drawGraveyard(dt) {
  GY.t += dt;
  g.fillStyle = C[0]; g.fillRect(0, 0, W, H); g.fillStyle = C[6]; g.fillRect(0, 40, W, 100); g.fillStyle = '#241a5c'; g.fillRect(0, 20, W, 30);
  // moon behind clouds, lightning now and then
  const flash = (GY.t % 9000) > 8700 && Math.floor(GY.t / 60) % 2;
  if (flash) { g.fillStyle = C[15]; g.fillRect(0, 0, W, 140); }
  g.fillStyle = C[15]; g.fillRect(44, 22, 18, 18); g.fillStyle = C[12]; g.fillRect(30 + (GY.t / 120) % 80, 30, 40, 6); g.fillRect(120 + (GY.t / 90) % 120, 18, 50, 5);
  // dead tree + fence
  g.fillStyle = C[0]; g.fillRect(270, 70, 5, 70); g.fillRect(262, 82, 10, 3); g.fillRect(275, 92, 14, 3); g.fillRect(258, 76, 3, 8); g.fillRect(287, 86, 3, 8);
  for (let x = 0; x < W; x += 10) { g.fillStyle = C[11]; g.fillRect(x, 112, 2, 26); g.fillRect(x - 1, 110, 4, 2); } g.fillStyle = C[11]; g.fillRect(0, 118, W, 2); g.fillRect(0, 130, W, 2);
  // ground
  g.fillStyle = C[9]; g.fillRect(0, 138, W, 62); g.fillStyle = C[11]; for (let x = 0; x < W; x += 8) g.fillRect(x + ((x / 8) % 3), 142 + ((x / 8) % 4) * 3, 3, 1);
  // tombstones with names
  S.party.forEach((h, i) => {
    const x = 26 + i * 72, y = 112; const sink = Math.min(1, GY.t / 2500);
    g.fillStyle = C[0]; g.fillRect(x - 1, y - 1, 52, 44); g.fillStyle = C[12]; g.fillRect(x, y + 6, 50, 36); g.fillRect(x + 6, y, 38, 8); g.fillStyle = C[15]; g.fillRect(x + 2, y + 8, 2, 30); g.fillRect(x + 8, y + 2, 34, 2);
    txt('R.I.P.', x + 25, y + 8, 0, 'center', 6); txt(upper(h.name).slice(0, 8), x + 25, y + 18, 6, 'center', 6); txt(`${h.cls.slice(0, 3).toUpperCase()} LV${h.lvl}`, x + 25, y + 28, 11, 'center', 6);
    g.fillStyle = C[9]; g.fillRect(x - 4, y + 42, 58, 6); g.fillStyle = C[8]; g.fillRect(x + 4, y + 44, 42, 2);
    // the hero's ghost drifts up
    if (GY.t > 1500) { const gt = (GY.t - 1500 - i * 400) / 1000; if (gt > 0) { g.save(); g.globalAlpha = Math.max(0, 0.55 - gt * 0.06); g.drawImage(h.sprite, x + 18 + Math.sin(gt * 2 + i) * 4, y - 20 - gt * 9, 14, 18); g.restore(); } }
    void sink;
  });
  // rain
  g.fillStyle = C[14]; GY.rain.forEach((r) => { r[1] += r[2] * dt / 16; r[0] -= 0.6 * dt / 16; if (r[1] > H) { r[1] = -4; r[0] = ri(0, W + 40); } g.fillRect(Math.round(r[0]), Math.round(r[1]), 1, 4); });
  box(40, 4, 240, 30, 0, 2);
  txt('THE PARTY HAS PERISHED', W / 2, 9, 10, 'center');
  txt(S.result === 'short' ? 'THE MUSIC ENDED TOO SOON' : S.result === 'long' ? 'THEY LINGERED TOO LONG' : 'THE SONGS RAN OUT', W / 2, 22, 15, 'center', 6);
  if (dirge.blocked() && Math.floor(GY.t / 600) % 2) txt('CLICK FOR THE FUNERAL MARCH', W / 2, 190, 7, 'center', 6);
  else if (GY.t > 8000) txt('CLICK TO RISE AGAIN', W / 2, 190, 15, 'center', 6);
}
cv.addEventListener('click', () => {
  if (S.phase === 'graveyard') { if (dirge.blocked()) { dirge.resume(); return; } if (GY.t > 8000) { dirge.stop(); S.party.forEach((h) => { h.alive = true; h.hp = h.max; }); S.phase = 'walk'; } return; } if (S.phase === 'roll') { rollParty(); } else if (S.phase === 'fireworks' && FW.t > 6000) { S.phase = 'walk'; S.ended = false; } });
document.addEventListener('keydown', (e) => { if (S.phase === 'roll' && e.key === 'Enter' && !/input|select|textarea/i.test(e.target.tagName)) { e.preventDefault(); begin(); } });
root.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
  root.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  root.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('on', p.dataset.panel === b.dataset.tab));
  MODE = b.dataset.tab;
}));
root.querySelectorAll('[data-pace]').forEach((b) => b.addEventListener('click', () => { S.pace = +b.dataset.pace; root.querySelectorAll('[data-pace]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
$('#pq-new').addEventListener('click', () => { if (S.songs.length && !confirmNew()) return; resetAll(); });
function confirmNew() { return window.confirm ? window.confirm('Start over with a new party? This quest will end.') : true; }
function resetAll() { dirge.stop(); Object.assign(S, { phase: 'roll', gold: 0, foes: [], bestiary: [], songs: [], curSong: -1, log: [], chronicle: [], deaths: 0, battles: 0, wins: 0, started: Date.now(), anim: null, banner: null, ended: false }); FW.parts = []; rollParty(); renderSongs(); setStatus(); $('#pq-sheet').classList.remove('show'); $('#pq-sheetbar').classList.remove('on'); }
let MODE = 'sp';
// any music starting begins the quest if the party is still being rolled
function musicStarted(title) {
  if (S.ended) return;
  if (S.songs.length >= MAXSONGS) { endSession(true); return; } // a seventh song means the six are done
  if (S.phase === 'roll') begin(); songStart(title);
  const l = MAXSONGS - S.songs.length; setTimeout(() => { if (!S.ended && S.songs.length === MAXSONGS - l) S.banner = { text: l ? `${l} SONG${l === 1 ? '' : 'S'} LEFT` : 'FINAL SONG! LISTEN WELL...', t: 0 }; }, 4300);
}

/* Spotify embed (same approach as Rubber Tree Sessions) */
const sel = $('#pq-pl'); PLAYLISTS.forEach(([n, id]) => { const o = document.createElement('option'); o.value = id; o.textContent = n; sel.appendChild(o); });
let api = null, apiWaiting = null, apiLoading = false, ctrl = null; const SP = { uri: null, dur: 0, pos: 0, hasUri: false, playing: false };
function toUri(t) { t = (t || '').trim(); if (/^spotify:/.test(t)) return t; const m = t.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/); return m ? `spotify:${m[1]}:${m[2]}` : null; }
function loadEmbed(uri) {
  const make = () => {
    const host = $('#pq-embed'); host.innerHTML = ''; const el = document.createElement('div'); host.appendChild(el);
    api.createController(el, { uri, width: '100%', height: uri.includes(':track:') ? 152 : 352 }, (c) => {
      ctrl = c;
      c.addListener('playback_started', (e) => { const u = e && e.data && e.data.playingURI; if (u) { SP.hasUri = true; if (u !== SP.uri) { SP.uri = u; const i = S.songs.length; musicStarted(null); S.songs[i].uri = u; fetchTitle(i, u); } } setPlaying(true); });
      c.addListener('playback_update', (e) => {
        const t = (e && e.data) || {}; const on = !t.isPaused && !t.isBuffering;
        if (!SP.hasUri && on) { const changed = (t.duration && Math.abs(t.duration - SP.dur) > 1500) || (SP.pos > 4000 && t.position < 1500); if (S.curSong < 0 || changed) musicStarted(null); }
        if (t.duration) SP.dur = t.duration; if (t.position != null) SP.pos = t.position;
        if (on && S.curSong < 0 && SP.uri) { const i = S.songs.length; musicStarted(null); S.songs[i].uri = SP.uri; fetchTitle(i, SP.uri); }
        if (S.songs.length >= MAXSONGS && !S.ended && t.duration > 20000 && t.position >= t.duration - 1200) endSession(true);
        setPlaying(on);
      });
    });
  };
  if (api) make(); else { apiWaiting = make; if (!apiLoading) { apiLoading = true; window.onSpotifyIframeApiReady = (a) => { api = a; apiWaiting && apiWaiting(); }; const s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true; document.head.appendChild(s); } }
}
function fetchTitle(i, uri) { const m = uri.match(/spotify:track:(\w+)/); if (!m) return; fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent('https://open.spotify.com/track/' + m[1])).then((r) => r.json()).then((j) => { if (j && j.title) setTitle(i, j.title); }).catch(() => {}); }
sel.addEventListener('change', () => { if (sel.value) loadEmbed('spotify:playlist:' + sel.value); });
$('#pq-rand').addEventListener('click', () => { const p = pick(PLAYLISTS); sel.value = p[1]; loadEmbed('spotify:playlist:' + p[1]); });
$('#pq-load').addEventListener('click', () => { const u = toUri($('#pq-url').value); if (u) loadEmbed(u); else alertNote('That doesn’t look like a Spotify link. Try Share → Copy link in Spotify.'); });
function alertNote(s) { $('#pq-status').textContent = upper(s).slice(0, 80); }

/* Mic mode: loudness drives battle fury, silence splits songs */
let mic = null;
$('#pq-mic').addEventListener('click', async () => {
  if (mic) { mic.stream.getTracks().forEach((t) => t.stop()); mic.ctx.close(); mic = null; $('#pq-mic').textContent = '🎤 Start listening'; setPlaying(false); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); const src = ctx.createMediaStreamSource(stream); const an = ctx.createAnalyser(); an.fftSize = 1024; src.connect(an);
    mic = { stream, ctx, an, buf: new Float32Array(an.fftSize), quiet: 0, avg: 0.02, heard: false }; $('#pq-mic').textContent = '■ Stop listening';
    const tick = () => { if (!mic) return; mic.an.getFloatTimeDomainData(mic.buf); let s = 0; for (const v of mic.buf) s += v * v; const rms = Math.sqrt(s / mic.buf.length); mic.avg = mic.avg * 0.995 + rms * 0.005;
      const loud = rms > Math.max(0.012, mic.avg * 0.35);
      S.energy = clamp(rms / Math.max(0.02, mic.avg * 2), 0, 1);
      if (loud) { if (!mic.heard || mic.quiet > 2600) { musicStarted(null); } mic.heard = true; mic.quiet = 0; setPlaying(true); }
      else { mic.quiet += 50; if (mic.quiet > 1200) setPlaying(false); }
      setTimeout(tick, 50); };
    tick();
  } catch (e) { alertNote('The microphone is blocked. Allow it in your browser and try again.'); }
});
/* Type my songs */
$('#pq-tstart').addEventListener('click', () => { musicStarted($('#pq-typed').value.trim() || null); setPlaying(true); $('#pq-typed').value = ''; });
$('#pq-tend').addEventListener('click', () => { setPlaying(false); if (S.songs.length >= MAXSONGS) endSession(true); });

/* ---------- end-of-session print sheet ---------- */
function spriteURL(c, scale) { const o = makeCanvas(c.width * scale, c.height * scale), x = o.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(c, 0, 0, o.width, o.height); return o.toDataURL('image/png'); }
function makeSheet() {
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
  const bars = (h) => { const lv = S.songs.map((_, i) => h.lvlBySong[i] || h.lvl); lv.push(h.lvl); const mx = Math.max(...lv); return `<span class="lv" title="Level by song">${lv.map((v) => `<i style="height:${Math.max(3, 22 * v / mx)}px"></i>`).join('')}</span>`; };
  const party = S.party.map((h) => `<tr><td><img src="${spriteURL(h.sprite, 3)}" width="42" height="54" alt=""></td><td><b>${esc(upper(h.name))}</b><br><span class="sub">${esc(h.epi)}</span></td><td>${esc(h.race)}<br>${esc(h.cls)}</td><td>LV ${h.lvl}<br>${bars(h)}</td><td>HP ${h.max}<br>KILLS ${h.kills}</td><td>STR ${h.stats.STR} DEX ${h.stats.DEX} CON ${h.stats.CON}<br>INT ${h.stats.INT} WIS ${h.stats.WIS} CHA ${h.stats.CHA}</td></tr>`).join('');
  const songs = S.songs.map((s, i) => { const lines = S.chronicle.filter((c) => c.song === i).map((c) => c.text).slice(0, 3); return `<li><b>${esc(s.title)}</b> <span class="sub">(${fmt(s.secs)})</span>${s.foes.length ? `<br><span class="sub">Faced: ${esc([...new Set(s.foes)].join(', '))}</span>` : ''}${lines.length ? `<br><span class="sub">${esc(lines.join(' '))}</span>` : ''}</li>`; }).join('');
  const best = S.bestiary.map((t) => { const by = Object.entries(t.slainBy).sort((a, b) => b[1] - a[1])[0]; const sc = Math.max(2, Math.round(48 / t.sprite.h)); return `<div class="card"><img src="${spriteURL(t.sprite.img, sc)}" alt=""><b>${esc(upper(t.name))}</b><small>${esc(t.desc)}<br>LV ${t.lvl} · ${t.slain ? `SLAIN ×${t.slain}${by ? ' BY ' + esc(upper(by[0])) : ''}` : 'ESCAPED'}</small></div>`; }).join('');
  $('#pq-sheet').innerHTML = `
    <h1>PHANTASEA SESSIONS</h1><div class="sub">THE CHRONICLE OF ${esc(upper(S.party.map((h) => h.name).join(', ')))} · ${esc(upper(date))} · ${mins} MIN · ${S.songs.length} SONGS</div>
    <h2>THE PARTY</h2><table>${party}</table>
    <div class="sub" style="margin-top:6px">${S.battles} BATTLES · ${S.wins} VICTORIES · ${S.deaths} TRIPS TO THE TEMPLE · ${S.gold} GOLD · ${S.bestiary.reduce((s, t) => s + t.slain, 0)} MONSTERS SLAIN</div>
    ${questBlock()}
    <h2>THE SONGS OF THIS QUEST</h2><ol>${songs || '<li>No songs yet</li>'}</ol>
    <h2>BESTIARY (${S.bestiary.length} CREATURES)</h2><div class="best">${best || '<div>No monsters met.</div>'}</div>
    <div class="foot">LIKETHEFISH.CA · PHANTASEA SESSIONS · ROLL AGAIN SOMETIME</div>`;
  $('#pq-sheet').classList.add('show'); $('#pq-sheetbar').classList.add('on');
  $('#pq-sheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function endSession(auto) {
  if (S.ended) return;
  setPlaying(false); S.ended = true; if (ctrl && ctrl.pause) try { ctrl.pause(); } catch (e) {}
  if (mic) $('#pq-mic').click();
  const r = questResult(); S.result = r;
  if (r === 'perfect') { startFireworks(true); chronicle('A PERFECT 2048. The castle lit up in fireworks.'); }
  else if (r === 'won') { startFireworks(false); chronicle('The party survived the six songs and reached the castle.'); }
  else if (r !== 'none') { S.party.forEach((h) => { h.alive = false; h.hp = 0; }); startGraveyard(); chronicle('The music ran out and the party perished.'); }
  makeSheet(); renderQuest();
  if (!document.fullscreenElement && !$('#pq-tv').classList.contains('full')) cv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
$('#pq-endbtn').addEventListener('click', () => endSession(false));
function questBlock() {
  const r = questResult(), t = totalSecs(), n = S.songs.length;
  const msg = { perfect: '★ A PERFECT 2048! THE CASTLE LIT UP IN FIREWORKS ★', won: 'THE PARTY SURVIVED AND REACHED THE CASTLE', short: `✝ THE PARTY PERISHED — ${fmt(GOAL - t)} TOO SHORT`, long: `✝ THE PARTY PERISHED — ${fmt(t - GOAL)} TOO LONG`, over: '✝ THE PARTY PERISHED — TOO MANY SONGS', none: 'THE QUEST WAS NOT ATTEMPTED' }[r];
  return `<div class="q"><b>${msg}</b><br><span class="sub">${t.toFixed(1)} SECONDS HEARD IN ${n} SONG${n === 1 ? '' : 'S'}${r === 'none' ? '' : ` · THE SECRET: 2048 SECONDS (THE 2,048 POSSIBLE SETS OF THE 12 NOTES), ±100 TO SURVIVE, ±2 FOR FIREWORKS`}</span></div>`;
}
/* ---------- the fireworks castle movie ---------- */
const FW = { parts: [], t: 0, next: 0, stars: [] };
function startFireworks(perfect) {
  S.phase = 'fireworks'; FW.perfect = perfect; FW.t = 0; FW.parts = []; FW.next = perfect ? 0 : 1500;
  FW.stars = Array.from({ length: 70 }, () => [ri(0, W), ri(0, 120), ri(0, 3)]);
  // one song at random to celebrate: one they heard if Spotify knows it, otherwise a random Like The Fish playlist
  FW.title = 'THE PARTY SURVIVED SIX SONGS';
  if (!perfect) return;
  const heard = S.songs.filter((s) => s.uri && s.uri.includes(':track:'));
  const uri = heard.length ? pick(heard).uri : 'spotify:playlist:' + pick(PLAYLISTS)[1];
  const song = heard.find((s) => s.uri === uri);
  FW.title = song ? song.title : 'A RANDOM LIKE THE FISH PLAYLIST';
  try {
    if (ctrl && ctrl.loadUri) { ctrl.loadUri(uri); setTimeout(() => { try { ctrl.play(); } catch (e) {} }, 900); }
    else { root.querySelector('[data-tab="sp"]').click(); loadEmbed(uri); }
  } catch (e) {}
}
function burst(x, y) {
  const col = pick([1, 2, 3, 4, 5, 7, 10, 13, 14]), col2 = pick([1, 7, 15]), n = ri(36, 64), sp = 0.6 + rnd() * 0.9, ring = rnd() < 0.3;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd() * 0.2, v = ring ? sp : sp * (0.3 + rnd() * 0.7); FW.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1600 + rnd() * 900, t: 0, col: rnd() < 0.2 ? col2 : col, spark: true }); }
}
function drawCastle() {
  const base = 168, k = C[0], wall = C[11], lit = C[7];
  g.fillStyle = C[9]; g.fillRect(0, base, W, H - base); g.fillStyle = C[8]; for (let x = 0; x < W; x += 6) g.fillRect(x, base + ((x / 6) % 2) * 2, 3, 1);
  const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const crenel = (x, y, w) => { for (let i = 0; i < w; i += 6) rect(x + i, y - 4, 4, 4, wall); };
  rect(90, 110, 140, 58, wall); crenel(90, 110, 140);
  [[70, 78, 30], [220, 78, 30], [140, 54, 40]].forEach(([x, y, w]) => { rect(x, y, w, base - y, C[12]); crenel(x, y, w); rect(x + w / 2 - 1, y - 22, 2, 18, k); const wv = Math.sin(FW.t / 180) > 0 ? 1 : 0; rect(x + w / 2 + 1, y - 22, 9 + wv, 5, C[2]); });
  // roof cones
  g.fillStyle = C[6]; [[70, 78, 30], [220, 78, 30]].forEach(([x, y, w]) => { g.beginPath(); g.moveTo(x - 2, y - 4); g.lineTo(x + w / 2, y - 26); g.lineTo(x + w + 2, y - 4); g.fill(); });
  // gate + windows that twinkle
  rect(148, 132, 24, 36, k); rect(150, 134, 20, 2, C[8]);
  [[80, 96], [80, 124], [230, 96], [230, 124], [152, 70], [164, 70], [152, 96], [164, 96], [104, 128], [210, 128], [122, 128], [192, 128]].forEach(([x, y], i) => rect(x, y, 6, 8, Math.sin(FW.t / 300 + i * 1.7) > -0.6 ? lit : C[8]));
}
function drawFireworks(dt) {
  FW.t += dt;
  g.fillStyle = C[6]; g.fillRect(0, 0, W, H); g.fillStyle = '#241a5c'; g.fillRect(0, 0, W, 70); g.fillStyle = C[0]; g.fillRect(0, 0, W, 30);
  FW.stars.forEach(([x, y, p]) => { g.fillStyle = Math.sin(FW.t / 400 + x) > 0.3 ? C[1] : C[15]; if (p) g.fillRect(x, y, 1, 1); });
  // moon
  g.fillStyle = C[15]; g.fillRect(268, 18, 16, 16); g.fillStyle = C[1]; g.fillRect(270, 18, 12, 16); g.fillRect(268, 20, 16, 12); g.fillStyle = C[6]; g.fillRect(276, 16, 12, 12);
  FW.next -= dt;
  if (FW.next <= 0) { FW.next = FW.perfect ? 280 + rnd() * 650 : 2600 + rnd() * 2500; FW.parts.push({ x: ri(40, 280), y: 168, vx: (rnd() - 0.5) * 0.3, vy: -(2.4 + rnd() * 1.0), t: 0, life: 900 + rnd() * 500, col: 7, rocket: true }); }
  const keep = [];
  for (const p of FW.parts) {
    p.t += dt; const f = dt / 16;
    if (p.rocket) { p.x += p.vx * f; p.y += p.vy * f; p.vy += 0.03 * f; if (p.t > p.life || p.vy > -0.4) { burst(p.x, p.y); continue; } g.fillStyle = C[7]; g.fillRect(p.x, p.y, 2, 3); g.fillStyle = C[8]; g.fillRect(p.x, p.y + 3, 1, 3); keep.push(p); continue; }
    p.x += p.vx * f; p.y += p.vy * f; p.vy += 0.012 * f; p.vx *= 0.995; p.vy *= 0.995;
    if (p.t > p.life) continue; const fade = p.t / p.life;
    if (fade < 0.85 || Math.floor(p.t / 80) % 2) { g.fillStyle = C[fade > 0.6 ? 11 : p.col]; g.fillRect(Math.round(p.x), Math.round(p.y), fade < 0.3 ? 2 : 1, fade < 0.3 ? 2 : 1); }
    keep.push(p);
  }
  FW.parts = keep;
  drawCastle();
  // the party cheering at the gate
  S.party.forEach((h, i) => { const jump = Math.abs(Math.sin(FW.t / 220 + i * 1.3)) * 6; g.drawImage(h.sprite, 104 + i * 32 + (i > 1 ? 16 : 0), 150 - jump, 14, 18); });
  box(20, 4, 280, 30, 0, 7);
  txt(FW.perfect ? '★ A PERFECT 2048! ★' : 'QUEST COMPLETE!', W / 2, 9, Math.floor(FW.t / 250) % 2 ? 7 : 1, 'center');
  txt(upper(FW.title).slice(0, 40), W / 2, 22, 3, 'center', 6);
  if (FW.t > 6000) txt('CLICK TO RETURN', W / 2, 190, 15, 'center', 6);
}
$('#pq-print').addEventListener('click', () => window.print());
$('#pq-c64').addEventListener('click', (e) => { const on = $('#pq-sheet').classList.toggle('c64'); e.currentTarget.setAttribute('aria-pressed', String(on)); });
$('#pq-keep').textContent = 'Back to the game';
$('#pq-keep').addEventListener('click', () => { if (S.phase === 'graveyard') { dirge.stop(); S.party.forEach((h) => { h.alive = true; h.hp = h.max; }); } if (S.phase === 'fireworks' || S.phase === 'graveyard') S.phase = 'walk'; $('#pq-sheet').classList.remove('show'); $('#pq-sheetbar').classList.remove('on'); cv.scrollIntoView({ behavior: 'smooth' }); });

/* ---------- full screen ---------- */
const tv = $('#pq-tv');
function isFull() { return tv.classList.contains('full'); }
function setFull(on) {
  if (on === isFull()) return;
  tv.classList.toggle('full', on); renderQuest();
  if (on) { if (tv.requestFullscreen) tv.requestFullscreen().catch(() => {}); else if (tv.webkitRequestFullscreen) tv.webkitRequestFullscreen(); }
  else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}
$('#pq-fs').addEventListener('click', () => setFull(true));
$('#pq-fsx').addEventListener('click', () => setFull(false));
cv.addEventListener('dblclick', () => setFull(!isFull()));
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && isFull()) { tv.classList.remove('full'); } });
document.addEventListener('keydown', (e) => { if (/input|select|textarea/i.test(e.target.tagName)) return; if (e.key === 'f' || e.key === 'F') setFull(!isFull()); if (e.key === 'Escape' && isFull()) setFull(false); });

/* ---------- go ---------- */
rollParty(); setStatus(); renderQuest();
if (document.fonts) document.fonts.load('8px "Press Start 2P"').catch(() => {});
requestAnimationFrame(frame);
window.__pq = { S, endSession, setFull, dirge, startFireworks, questResult, totalSecs, renderQuest, musicStarted, setPlaying, makeSheet, encounter, begin };
})();
