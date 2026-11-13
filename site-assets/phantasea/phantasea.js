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
#pq .pq-tv{position:relative;background:var(--fr);padding:clamp(10px,3.4%,34px);border-radius:10px;box-shadow:inset 0 0 0 3px #4a3f9a,0 10px 30px -10px #000}
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
#pq .pq-fscorner{position:absolute;top:4px;right:4px;z-index:3;font-size:13px!important;line-height:1!important;padding:5px 7px!important;background:rgba(20,16,50,.8)!important}
#pq .pq-tv.full .pq-fscorner{display:none}
#pq .pq-logo,#pq .pq-fsinfo,#pq .pq-fsx,#pq .pq-fsbar,#pq #pq-viz{display:none}
#pq .pq-tv.full #pq-viz{display:block;position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;z-index:0;cursor:pointer}
#pq .pq-tv.full .pq-logo,#pq .pq-tv.full .pq-fsinfo,#pq .pq-tv.full canvas#pq-cv{position:relative;z-index:1}
#pq .pq-tv.full .pq-fsx{position:absolute;z-index:2}
#pq .pq-tv.full .pq-fsbar{display:flex;flex-direction:column;align-items:flex-start;gap:6px;position:absolute;top:12px;left:12px;z-index:2}
#pq .pq-tv.full .pq-fsbar button{font-size:9px;padding:6px 9px;background:rgba(20,16,50,.75)}
#pq .pq-tv.full .pq-logo,#pq .pq-tv.full .pq-fsinfo{pointer-events:none}
#pq .pq-tv.full .pq-fsinfo{text-shadow:2px 2px 0 #000}
#pq .pq-tv.full{position:fixed;inset:0;z-index:2147483000;border-radius:0;padding:0;background:#6c5eb5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4vh;box-shadow:none;padding:2.5vh 0 1vh}
#pq .pq-tv.full canvas#pq-cv{width:min(94vw,calc((100vh - 19vh) * 1.6));height:auto;box-shadow:0 0 0 6px #4a3f9a}
#pq .pq-tv.full .pq-logo{display:flex;flex-direction:column;align-items:center;gap:.8vh;line-height:1}
#pq .pq-logo b{font-size:clamp(18px,5.2vh,54px);letter-spacing:.1em;color:#fff4b0;text-shadow:0 .06em 0 #ffd040,0 .12em 0 #f89020,0 .18em 0 #d04818,0 .24em 0 #801c28,.06em .3em 0 #1c1040,-.06em .3em 0 #1c1040,.1em .34em 0 #1c1040;padding-bottom:.35em}
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
  <div class="pq-tv" id="pq-tv"><button class="pq-fscorner" id="pq-fs2" title="Full screen (F)" aria-label="Full screen">⛶</button><div class="pq-logo" aria-hidden="true"><b>PHANTASEA</b><span>SESSIONS · LIKETHEFISH.CA</span></div><div class="pq-fsinfo" id="pq-fsinfo"></div><div class="pq-fsbar"><button id="pq-vzmode" title="Change the visualizer (V)">◐ STANDARD ▸</button><button id="pq-vzmic" title="Use your microphone so the visuals follow the actual music">🎤 Sync visuals to room sound</button></div><button class="pq-fsx" id="pq-fsx" title="Exit full screen">✕</button><canvas id="pq-cv" width="320" height="200" aria-label="Phantasea game screen"></canvas></div>
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
    <button id="pq-fs">⛶ Full screen</button><button id="pq-new">New party</button><button id="pq-sim" title="Use this session's pace to play out the rest of the six songs instantly">⏩ Simulate to the end</button><button id="pq-endbtn" class="end">End session & make my print</button>
  </div>
  <div class="pq-quest" id="pq-quest"></div>
  <div class="pq-songs" id="pq-songs"></div>
  <div class="pq-sheetbar" id="pq-sheetbar"><button id="pq-print" class="go">🖨 Print / save PDF (8.5×11)</button><button id="pq-c64">C64 colours</button><button id="pq-keep">Keep adventuring</button></div>
  <div id="pq-sheet"></div>
</div>`;
const $ = (s) => root.querySelector(s);
const cv = $('#pq-cv'); let g = cv.getContext('2d'); g.imageSmoothingEnabled = false;

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
function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function tint(h, f) { const c = hex2rgb(h); return '#' + c.map((v) => { const n = f >= 0 ? v + (255 - v) * f : v * (1 + f); return Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0'); }).join(''); }
function mix(a, b, k) { const x = hex2rgb(a), y = hex2rgb(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
function vgrad(y0, y1, stops) { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
// 16-bit RPG window: dark outline, bevelled light frame, gradient fill
function box(x, y, w, h, bg = 6, fr = 14) {
  const base = C[bg] === '#000000' ? '#18184a' : C[bg];
  g.fillStyle = '#000'; g.fillRect(x, y + 1, w, h - 2); g.fillRect(x + 1, y, w - 2, h);
  g.fillStyle = tint(C[fr], 0.45); g.fillRect(x + 1, y + 1, w - 2, h - 2);
  g.fillStyle = tint(C[fr], -0.35); g.fillRect(x + 2, y + 2, w - 3, h - 3);
  g.fillStyle = vgrad(y + 3, y + h - 3, [tint(base, 0.18), base, tint(base, -0.55)]); g.fillRect(x + 3, y + 3, w - 6, h - 6);
  g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(x + 3, y + 3, w - 6, 1);
}
// shading pass: highlight edges facing the top-left light, shadow edges facing away, soft vertical falloff
function shadeSprite(c) {
  const x = c.getContext('2d'), W2 = c.width, H2 = c.height, im = x.getImageData(0, 0, W2, H2), d = im.data, src = new Uint8ClampedArray(d);
  const solid = (a, b) => a >= 0 && b >= 0 && a < W2 && b < H2 && src[(b * W2 + a) * 4 + 3] > 0 && !(src[(b * W2 + a) * 4] < 8 && src[(b * W2 + a) * 4 + 1] < 8 && src[(b * W2 + a) * 4 + 2] < 8);
  for (let b = 0; b < H2; b++) for (let a = 0; a < W2; a++) {
    if (!solid(a, b)) continue; const i = (b * W2 + a) * 4;
    let f = 0.12 - 0.34 * (b / H2);
    if (!solid(a - 1, b) || !solid(a, b - 1)) f += 0.32;
    if (!solid(a + 1, b) || !solid(a, b + 1)) f -= 0.30;
    if (!solid(a - 1, b - 1) && solid(a + 1, b + 1)) f += 0.1;
    for (let k = 0; k < 3; k++) { const v = src[i + k]; d[i + k] = f >= 0 ? v + (255 - v) * f : v * (1 + f); }
  }
  x.putImageData(im, 0, 0); return c;
}
function shadow(x, y, w) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(x, y, w / 2, Math.max(2, w / 7), 0, 0, Math.PI * 2); g.fill(); }
function txtO(s, x, y, col, align = 'left', size = 8) { [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]].forEach(([a, b]) => txt(s, x + a, y + b, '#000', align, size)); txt(s, x, y, col, align, size); }
function wrap(s, max) { const out = []; let line = ''; for (const w of String(s).split(' ')) { if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; } else line += ' ' + w; } if (line.trim()) out.push(line.trim()); return out; }

/* ---------- sprite generators ---------- */
/* ---------- sprite engine: shaded parts with coloured outlines (Chrono Trigger-ish) ---------- */
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function hsl(h, s, l) { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return '#' + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join(''); }
function hueName(h, l) { h = ((h % 360) + 360) % 360; const n = h < 15 ? 'red' : h < 40 ? 'orange' : h < 65 ? 'golden' : h < 90 ? 'lime' : h < 150 ? 'green' : h < 185 ? 'teal' : h < 210 ? 'sky-blue' : h < 250 ? 'blue' : h < 285 ? 'violet' : h < 320 ? 'magenta' : h < 345 ? 'pink' : 'red'; return (l < 38 ? 'dark ' : l > 66 ? 'pale ' : '') + n; }
const LIGHT = (() => { const v = [-0.55, -0.7, 0.55], m = Math.hypot(...v); return v.map((x) => x / m); })();
// parts: {t:'e',x,y,rx,ry,c} {t:'r',x,y,w,h,c} {t:'p',pts,c} {t:'l',x0,y0,x1,y1,wd,c}; optional flat:true, glow:true, noOutline
function renderParts(w, h, parts) {
  const W2 = w + 2, H2 = h + 2, id = new Int16Array(W2 * H2).fill(-1), lum = new Float32Array(W2 * H2);
  const ramp = parts.map((p) => [tint(p.c, -0.55), tint(p.c, -0.3), p.c, tint(p.c, 0.28), tint(p.c, 0.6)].map(hex2rgb));
  parts.forEach((p, pi) => {
    let x0, y0, x1, y1;
    if (p.t === 'e') { x0 = p.x - p.rx; x1 = p.x + p.rx; y0 = p.y - p.ry; y1 = p.y + p.ry; }
    else if (p.t === 'r') { x0 = p.x; x1 = p.x + p.w; y0 = p.y; y1 = p.y + p.h; }
    else if (p.t === 'p') { x0 = Math.min(...p.pts.map((q) => q[0])); x1 = Math.max(...p.pts.map((q) => q[0])); y0 = Math.min(...p.pts.map((q) => q[1])); y1 = Math.max(...p.pts.map((q) => q[1])); }
    else { const r = p.wd / 2; x0 = Math.min(p.x0, p.x1) - r; x1 = Math.max(p.x0, p.x1) + r; y0 = Math.min(p.y0, p.y1) - r; y1 = Math.max(p.y0, p.y1) + r; }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hx = Math.max(0.5, (x1 - x0) / 2), hy = Math.max(0.5, (y1 - y0) / 2);
    for (let y = Math.max(0, Math.floor(y0)); y < Math.min(h, Math.ceil(y1) + 1); y++) for (let x = Math.max(0, Math.floor(x0)); x < Math.min(w, Math.ceil(x1) + 1); x++) {
      const px = x + 0.5, py = y + 0.5; let nx, ny, inside = false;
      if (p.t === 'e') { nx = (px - p.x) / Math.max(0.5, p.rx); ny = (py - p.y) / Math.max(0.5, p.ry); inside = nx * nx + ny * ny <= 1; }
      else if (p.t === 'r') { inside = px >= x0 && px <= x1 && py >= y0 && py <= y1; nx = ((px - x0) / (x1 - x0) * 2 - 1) * 0.85; ny = ((py - y0) / (y1 - y0) * 2 - 1) * 0.45; }
      else if (p.t === 'p') { let c = false; const q = p.pts; for (let i = 0, j = q.length - 1; i < q.length; j = i++) if ((q[i][1] > py) !== (q[j][1] > py) && px < (q[j][0] - q[i][0]) * (py - q[i][1]) / (q[j][1] - q[i][1]) + q[i][0]) c = !c; inside = c; nx = (px - cx) / hx * 0.8; ny = (py - cy) / hy * 0.8; }
      else { const dx = p.x1 - p.x0, dy = p.y1 - p.y0, L2 = dx * dx + dy * dy || 1, t = clamp(((px - p.x0) * dx + (py - p.y0) * dy) / L2, 0, 1), qx = p.x0 + dx * t, qy = p.y0 + dy * t, r = Math.max(0.5, p.wd / 2); nx = (px - qx) / r; ny = (py - qy) / r; inside = nx * nx + ny * ny <= 1.0; }
      if (!inside) continue;
      const d2 = Math.min(1, nx * nx + ny * ny), nz = Math.sqrt(1 - d2);
      const i = (y + 1) * W2 + x + 1; id[i] = pi; lum[i] = p.flat ? 0.62 : clamp(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2], 0, 1);
    }
  });
  const c = makeCanvas(W2, H2), x = c.getContext('2d'), im = x.createImageData(W2, H2), d = im.data;
  for (let i = 0; i < W2 * H2; i++) {
    const pi = id[i]; let rgb;
    if (pi >= 0) {
      const v = lum[i], r = ramp[pi]; let k = v < 0.16 ? 0 : v < 0.42 ? 1 : v < 0.72 ? 2 : v < 0.9 ? 3 : 4; if (parts[pi].glow) k = Math.max(2, k);
      // sel-out: darken where a part in front borders this one
      const xx = i % W2; const nb = [i - 1, i + 1, i - W2, i + W2]; if (nb.some((j) => j >= 0 && j < id.length && id[j] > pi && (Math.abs((j % W2) - xx) <= 1) && !parts[id[j]].soft)) k = Math.max(0, k - 2);
      rgb = r[k];
    } else {
      const xx = i % W2; let o = -1; for (const j of [i - 1, i + 1, i - W2, i + W2]) if (j >= 0 && j < id.length && id[j] >= 0 && Math.abs((j % W2) - xx) <= 1 && !parts[id[j]].noOutline) { o = id[j]; break; }
      if (o < 0) continue; rgb = hex2rgb(tint(parts[o].c, -0.78));
    }
    d[i * 4] = rgb[0]; d[i * 4 + 1] = rgb[1]; d[i * 4 + 2] = rgb[2]; d[i * 4 + 3] = 255;
  }
  x.putImageData(im, 0, 0); return c;
}
const E = (x, y, rx, ry, c, o) => Object.assign({ t: 'e', x, y, rx, ry, c }, o);
const Rr = (x, y, w, h, c, o) => Object.assign({ t: 'r', x, y, w, h, c }, o);
const Pp = (pts, c, o) => Object.assign({ t: 'p', pts, c }, o);
const Ln = (x0, y0, x1, y1, wd, c, o) => Object.assign({ t: 'l', x0, y0, x1, y1, wd, c }, o);
function eyesParts(list, eyes, white = '#f8f8f0', pupil = '#181020') { eyes.forEach(([x, y, r]) => { list.push(E(x, y, r, r * 1.1, white, { soft: true })); list.push(E(x - r * 0.3, y + r * 0.1, Math.max(0.6, r * 0.5), Math.max(0.7, r * 0.65), pupil, { flat: true, soft: true })); }); }
function mouthParts(list, x, y, w, teeth) { list.push(E(x, y, w, Math.max(1, w * 0.45), '#30101c', { flat: true })); if (teeth) for (let i = -1; i <= 1; i += 2) list.push(Pp([[x + i * w * 0.55 - 1, y - w * 0.35], [x + i * w * 0.55 + 1, y - w * 0.35], [x + i * w * 0.55, y + w * 0.4]], '#fffff0', { flat: true, soft: true })); }

/* ---------- monsters: 11 body plans, many variations ---------- */
const PLANS = ['blob', 'biped', 'beast', 'winged', 'serpent', 'spider', 'wraith', 'eye', 'plant', 'mushroom', 'golem'];
function monsterParts(r, plan, P) {
  const B = P.body, Bl = P.belly, A = P.accent, L = [], j = (a) => (r() - 0.5) * a, yes = (p) => r() < p;
  if (plan === 'blob') {
    const rx = 14 + j(4), ry = 11 + j(3);
    if (yes(0.5)) L.push(Ln(20, 18, 24 + j(6), 6, 2, A), E(24, 6, 2.5, 2.5, A, { glow: true }));
    L.push(E(20, 38 - ry, rx, ry, B)); [-1, 1].forEach((s) => L.push(E(20 + s * rx * 0.7, 36, 4, 3, B)));
    L.push(E(20, 36 - ry * 0.55, rx * 0.55, ry * 0.45, Bl, { soft: true }));
    for (let i = 0; i < 3; i++) if (yes(0.5)) L.push(E(20 + j(rx), 38 - ry + j(ry), 1.6, 1.6, Bl, { soft: true }));
    eyesParts(L, yes(0.25) ? [[20, 38 - ry * 1.25, 4]] : [[15, 38 - ry * 1.3, 3.2], [25, 38 - ry * 1.3, 3.2]]); mouthParts(L, 20, 38 - ry * 0.75, 4, yes(0.6));
  } else if (plan === 'biped') {
    const hy = 12 + j(3), fat = 9 + j(4);
    if (yes(0.4)) L.push(Pp([[28, 18], [37, 34 + j(4)], [28, 30]], A)); // tail/club
    L.push(Ln(16, 28, 14, 37, 4.5, tint(B, -0.15)), Ln(24, 28, 26, 37, 4.5, tint(B, -0.15)), E(13, 38, 3.5, 1.8, A), E(27, 38, 3.5, 1.8, A));
    L.push(Ln(13, 19, 8 + j(4), 29, 4, tint(B, -0.1)));
    L.push(E(20, 24, fat, 9, B), E(20, 27, fat * 0.55, 5, Bl, { soft: true }));
    L.push(Ln(27, 19, 33 + j(3), 28, 4, B), Pp([[31, 28], [35, 27], [35, 32]], A));
    if (yes(0.6)) L.push(Pp([[14, hy - 3], [11, hy - 12 + j(4)], [17, hy - 5]], A), Pp([[24, hy - 3], [27, hy - 12 + j(4)], [22, hy - 5]], A));
    L.push(E(19, hy, 7.5, 7, B), E(16, hy + 3, 3.5, 2.5, Bl, { soft: true }));
    eyesParts(L, [[15, hy - 1, 2], [21, hy - 1, 2]]); mouthParts(L, 16, hy + 4, 3, true);
  } else if (plan === 'beast') {
    L.push(Ln(32, 22, 39, 12 + j(6), 3, B), E(38, 12, 2.5, 2.5, A));
    [[30, 1], [26, 0]].forEach(([x]) => L.push(Ln(x, 28, x + 1, 38, 3.5, tint(B, -0.25))));
    L.push(E(23, 24, 12, 7.5, B), E(22, 28, 9, 3, Bl, { soft: true }));
    for (let i = 0; i < 4; i++) if (yes(0.7)) L.push(Pp([[16 + i * 5, 18], [18 + i * 5, 11 + j(3)], [20 + i * 5, 18]], A));
    [[16, 1], [12, 0]].forEach(([x]) => L.push(Ln(x, 28, x - 1, 38, 3.5, B)));
    L.push(E(9, 18, 7, 6.5, B), Pp([[9, 13], [12, 4 + j(3)], [13, 14]], tint(B, -0.2)), E(4, 21, 4.5, 3.2, Bl));
    eyesParts(L, [[7, 16, 1.8]], '#fff060'); mouthParts(L, 3, 23, 2.5, true);
  } else if (plan === 'winged') {
    const wc = yes(0.5) ? A : tint(B, -0.25), span = 18 + j(4);
    [-1, 1].forEach((s) => L.push(Pp([[20 + s * 4, 18], [20 + s * span, 4 + j(4)], [20 + s * (span - 2), 13], [20 + s * span, 21], [20 + s * 5, 26]], wc)));
    L.push(Ln(17, 28, 16, 36, 2.5, A), Ln(23, 28, 24, 36, 2.5, A));
    L.push(E(20, 23, 7, 8, B), E(20, 25, 4, 5, Bl, { soft: true }), E(20, 12, 6.5, 6, B));
    if (yes(0.5)) L.push(Pp([[15, 9], [13, 2], [18, 7]], A), Pp([[25, 9], [27, 2], [22, 7]], A));
    eyesParts(L, [[17, 11, 2], [23, 11, 2]], '#ffd040'); mouthParts(L, 20, 15.5, 2, yes(0.7));
  } else if (plan === 'serpent') {
    const pts = []; for (let i = 0; i <= 9; i++) { const t = i / 9; pts.push([34 - t * 22 + Math.sin(t * 5) * 6, 37 - t * 26]); }
    pts.forEach(([x, y], i) => L.push(E(x, y, 3 + i * 0.45, 2.6 + i * 0.4, i % 2 ? B : tint(B, -0.08))));
    pts.slice(2).forEach(([x, y], i) => L.push(E(x - 1.5, y + 1.5, 1.6 + i * 0.25, 1.2 + i * 0.2, Bl, { soft: true })));
    const [hx, hy] = pts[9]; if (yes(0.6)) L.push(Pp([[hx + 3, hy - 4], [hx + 11, hy - 10], [hx + 9, hy + 2]], A));
    L.push(E(hx - 2, hy, 7.5, 5.5, B), E(hx - 7, hy + 2, 3.5, 2.5, Bl));
    eyesParts(L, [[hx - 3, hy - 2, 1.8]], '#ffe040'); mouthParts(L, hx - 8, hy + 3, 2.2, true);
  } else if (plan === 'spider') {
    const legC = tint(A, -0.2);
    for (let i = 0; i < 4; i++) { L.push(Ln(15, 25, 8 - i * 2 + j(2), 14 + i * 3, 2, legC), Ln(8 - i * 2, 14 + i * 3, 4 - i * 1.5, 37, 2, legC)); L.push(Ln(17, 26, 22 + i * 3, 17 + i * 2, 2, legC), Ln(22 + i * 3, 17 + i * 2, 25 + i * 4, 37, 2, legC)); }
    L.push(E(27, 24, 11, 9, B)); for (let i = 0; i < 3; i++) L.push(E(25 + i * 3, 19 + i * 3, 2.2, 1.6, Bl, { soft: true }));
    L.push(E(13, 27, 6.5, 5.5, tint(B, -0.15)));
    eyesParts(L, [[9, 25, 1.2], [12, 24, 1.4], [10, 28, 1], [13, 28, 1]], '#ff3040'); mouthParts(L, 8, 30, 1.6, true);
  } else if (plan === 'wraith') {
    const tat = [[20, 3], [30, 13], [33, 28]]; for (let i = 0; i <= 5; i++) tat.push([33 - i * 5.2, i % 2 ? 33 + j(3) : 39]); tat.push([7, 28], [10, 13]);
    L.push(Pp(tat, B)); L.push(Ln(10, 18, 4, 27 + j(4), 4, tint(B, -0.1)), Ln(30, 18, 36, 27 + j(4), 4, tint(B, -0.1)));
    L.push(E(4, 28, 2, 2, '#d8d0c0'), E(36, 28, 2, 2, '#d8d0c0'));
    L.push(E(20, 14, 6.5, 6, '#100818', { flat: true }));
    L.push(E(17.5, 14, 1.6, 1.3, Bl, { glow: true, flat: true }), E(22.5, 14, 1.6, 1.3, Bl, { glow: true, flat: true }));
    if (yes(0.5)) L.push(Rr(18, 22, 4, 10, A, { soft: true }));
  } else if (plan === 'eye') {
    for (let i = 0; i < 5; i++) { const x = 11 + i * 4.5; L.push(Ln(x, 28, x + j(8), 39, 2.5, A)); }
    if (yes(0.6)) for (let i = 0; i < 3; i++) { const x = 12 + i * 8; L.push(Ln(x, 10, x + j(6), 2, 1.6, A), E(x, 2, 2.2, 2.2, Bl, { glow: true })); }
    L.push(E(20, 19, 13, 12.5, B)); L.push(E(16, 19, 8, 7.5, '#f8f8f0', { soft: true }), E(15, 19, 5, 5, Bl), E(14, 19, 2.2, 3.4, '#100818', { flat: true }), E(12.5, 16.5, 1.2, 1.2, '#ffffff', { flat: true }));
    if (yes(0.5)) mouthParts(L, 20, 28, 4, true);
  } else if (plan === 'plant') {
    const leaf = hsl(110 + j(40), 55, 38);
    L.push(Ln(20, 39, 20, 22, 4, leaf)); L.push(Pp([[20, 34], [8, 28], [12, 36]], leaf), Pp([[20, 31], [32, 25], [29, 34]], leaf));
    const n = 5 + Math.floor(r() * 3); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; L.push(E(20 + Math.cos(a) * 8.5, 14 + Math.sin(a) * 8.5, 5, 5, B)); }
    L.push(E(20, 14, 7, 7, Bl)); mouthParts(L, 20, 16, 4.5, true); eyesParts(L, [[17, 11, 1.6], [23, 11, 1.6]]);
  } else if (plan === 'mushroom') {
    L.push(E(15, 38, 3.5, 1.8, tint(Bl, -0.3)), E(25, 38, 3.5, 1.8, tint(Bl, -0.3)));
    L.push(E(20, 30, 7, 8, Bl)); L.push(Ln(13, 28, 9, 33, 2.5, Bl), Ln(27, 28, 31, 33, 2.5, Bl));
    const capR = 15 + j(4); L.push(Pp(Array.from({ length: 13 }, (_, i) => { const a = Math.PI + i / 12 * Math.PI; return [20 + Math.cos(a) * capR, 22 + Math.sin(a) * (11 + j(1))]; }), B)); L.push(E(20, 22, capR, 2.5, tint(B, -0.3), { soft: true }));
    for (let i = 0; i < 5; i++) L.push(E(20 + j(capR * 1.3), 14 + j(8), 1.8 + r() * 1.5, 1.6 + r(), A === Bl ? '#fff' : '#f8f0e0', { soft: true }));
    eyesParts(L, [[17, 29, 1.7], [23, 29, 1.7]]); mouthParts(L, 20, 34, 2, false);
  } else { // golem
    const crys = A; L.push(Rr(12, 30, 6, 9, tint(B, -0.15)), Rr(22, 30, 6, 9, tint(B, -0.15)));
    L.push(Rr(3, 14, 7, 18, tint(B, -0.1)), Rr(10, 13, 20, 18, B), Rr(30, 14, 7, 18, B));
    L.push(Rr(14, 18, 12, 8, Bl, { soft: true })); for (let i = 0; i < 3; i++) if (yes(0.7)) L.push(Pp([[8 + i * 12, 14], [10 + i * 12, 5 + j(4)], [13 + i * 12, 14]], crys, { glow: true }));
    L.push(Rr(14, 4, 12, 10, B)); L.push(Rr(16, 8, 8, 2, '#100818', { flat: true }), Rr(17, 8, 2, 2, Bl, { glow: true, flat: true }), Rr(21, 8, 2, 2, Bl, { glow: true, flat: true }));
  }
  return L;
}
function genMonsterSprite(r, plan, P, px) {
  const s = px / 40, L = monsterParts(r, plan, P).map((p) => {
    const q = Object.assign({}, p);
    if (q.t === 'e') { q.x *= s; q.y *= s; q.rx = Math.max(0.6, q.rx * s); q.ry = Math.max(0.6, q.ry * s); }
    else if (q.t === 'r') { q.x *= s; q.y *= s; q.w = Math.max(1, q.w * s); q.h = Math.max(1, q.h * s); }
    else if (q.t === 'p') q.pts = q.pts.map(([a, b]) => [a * s, b * s]);
    else { q.x0 *= s; q.y0 *= s; q.x1 *= s; q.y1 *= s; q.wd = Math.max(1.1, q.wd * s); }
    return q;
  });
  const img = renderParts(px, px, L); const eyes = L.filter((p) => p.c === '#f8f8f0' && p.t === 'e').length || (plan === 'wraith' || plan === 'golem' ? 2 : 1);
  return { img, w: img.width, h: img.height, eyes };
}

/* ---------- heroes: chibi 3/4 view, facing the monsters ---------- */
const HAIRC = ['#e8402c', '#f4c840', '#3c8cf0', '#8a48d0', '#5a3418', '#1c1820', '#ececf4', '#30b070', '#f06cb0', '#e88028'];
const SKINC = { Human: ['#f6d0a8', '#e0a878', '#b07850', '#7a4c30'], Elf: ['#f8dcc0', '#e8c0a0', '#c8a0d8'], Dwarf: ['#f0c098', '#d09870'], Halfling: ['#f6d0a8', '#d8a070'], Gnome: ['#f8d0b0', '#e8b890'], 'Half-Orc': ['#88b860', '#709850', '#98a868'], Tiefling: ['#d05858', '#a050a0', '#e07868'], Dragonborn: ['#c84838', '#3c8c58', '#c8a030', '#4878c0'] };
function genHeroSprite(h) {
  const k = h.kit, L = [], skin = h.skin, hair = h.hair, c1 = k.c1, c2 = k.c2, legs = k.legs, small = h.race === 'Halfling' || h.race === 'Gnome' || h.race === 'Dwarf';
  const oy = small ? 2 : 0, hy = 9 + oy; // head centre
  if (k.cape) L.push(Pp([[6, 14 + oy], [12, 14 + oy], [14, 29], [3, 29]], c2));
  if (h.style === 'long') L.push(E(8, hy + 4, 5, 8, hair));
  if (h.style === 'pony') L.push(E(4, hy + 1, 3, 4, hair), Ln(3, hy + 3, 2, hy + 9, 2.5, hair));
  if (k.robe) L.push(Pp([[6, 16 + oy], [15, 16 + oy], [17, 29], [4, 29]], c1));
  L.push(Ln(8.5, 22, 8, 27.5, 3.4, legs), Ln(12.5, 22, 13, 27.5, 3.4, legs), E(8, 28.5, 2.4, 1.5, '#5a3018'), E(13.5, 28.5, 2.6, 1.5, '#5a3018'));
  L.push(Ln(7, 17 + oy, 5, 22, 2.8, tint(c1, -0.15)), E(5, 22.5, 1.5, 1.5, skin));
  if (k.shield) L.push(E(4.5, 19.5 + oy, 3.5, 4.5, c2), E(4.5, 19.5 + oy, 1.4, 2, '#f4d860', { soft: true }));
  L.push(Rr(6.5, 14.5 + oy, 9, 8.5 - oy, c1), Rr(10, 15 + oy, 2.2, 7.5 - oy, c2, { soft: true }), Rr(6.5, 21, 9, 1.4, '#6a4020', { flat: true, soft: true }));
  if (h.race === 'Dwarf') L.push(Pp([[8, hy + 2], [16, hy + 2], [13, hy + 10], [10, hy + 9]], hair));
  // weapon behind front hand
  if (k.wpn === 'sword') L.push(Ln(15, 19, 19.5, 6, 1.8, '#d8e0f0'), Ln(13.5, 18, 17.5, 20, 1.6, '#c89030'));
  if (k.wpn === 'axe') L.push(Ln(15, 22, 18, 6, 1.5, '#8a5a30'), Pp([[17, 5], [21.5, 7], [21, 12], [17.5, 10]], '#d0d8e8'));
  if (k.wpn === 'staff') L.push(Ln(16, 26, 17, 3, 1.5, '#8a5a30'), E(17, 3, 2, 2, c2 === '#ffffff' ? '#ffd040' : tint(c2, 0.3), { glow: true }));
  if (k.wpn === 'bow') L.push(Ln(17, 8, 19, 15, 1.2, '#a06a30'), Ln(19, 15, 17, 23, 1.2, '#a06a30'), Ln(17, 8, 17, 23, 0.8, '#f0f0f0', { flat: true }));
  if (k.wpn === 'dagger') L.push(Ln(15.5, 20, 18.5, 15.5, 1.4, '#e0e8f8'));
  if (k.wpn === 'lute') L.push(E(14, 20, 3, 2.6, '#c07838'), Ln(15, 19, 19, 13, 1.1, '#6a3c18'));
  L.push(Ln(14, 17 + oy, 15.5, 20.5, 2.8, c1), E(15.5, 20.5, 1.5, 1.5, k.wpn === 'fist' ? c2 : skin));
  // head
  if (h.race === 'Elf') L.push(Pp([[14, hy - 1], [19, hy - 4], [15, hy + 1]], skin));
  L.push(E(11, hy, 6, 5.8, skin));
  if (h.race === 'Dragonborn') L.push(E(16, hy + 1.5, 3, 2.2, skin));
  if (h.race === 'Half-Orc') L.push(Pp([[13, hy + 3], [13.8, hy + 1], [14.4, hy + 3]], '#fffff0', { flat: true, soft: true }));
  if (h.race === 'Gnome') L.push(E(16.5, hy + 1, 1.6, 1.4, tint(skin, -0.1)));
  // hair / headgear
  if (k.helm) { L.push(Pp([[5, hy - 1], [6, hy - 6], [11, hy - 8], [16, hy - 6], [17, hy - 1], [15, hy - 1], [14, hy - 3], [7, hy - 3], [7, hy + 2]], '#c8d0e0')); L.push(Ln(11, hy - 9, 11, hy - 13, 2, h.plume)); }
  else if (k.hat === 'wizard') L.push(Pp([[3, hy - 2], [19, hy - 2], [13, hy - 5], [10, hy - 16], [7, hy - 5]], c1), Rr(3.5, hy - 3, 15, 1.6, c2, { soft: true }));
  else if (k.hood) L.push(Pp([[4, hy + 6], [5, hy - 4], [11, hy - 7], [17, hy - 4], [17, hy - 1], [14, hy - 3], [8, hy - 2], [7, hy + 6]], c1));
  else if (h.style === 'spiky') L.push(Pp([[5, hy + 1], [3, hy - 6], [7, hy - 5], [7, hy - 11], [10, hy - 7], [12, hy - 12], [13, hy - 6], [17, hy - 8], [16, hy - 3], [17, hy - 1], [13, hy - 3], [8, hy - 2], [7, hy + 3]], hair));
  else if (h.style === 'mohawk') L.push(Pp([[8, hy - 4], [9, hy - 10], [12, hy - 9], [14, hy - 4]], hair));
  else L.push(Pp([[5, hy + 3], [5, hy - 3], [9, hy - 6.5], [14, hy - 6], [17, hy - 2], [15, hy - 3], [12, hy - 2], [8, hy - 1], [7, hy + 4]], hair));
  if (h.race === 'Tiefling') L.push(Pp([[8, hy - 4], [6, hy - 10], [10, hy - 5]], '#3c2c3c'), Pp([[13, hy - 4], [15, hy - 10], [15, hy - 4]], '#3c2c3c'));
  L.push(Rr(12.5, hy, 1.2, 2, '#181020', { flat: true, soft: true }), Rr(15, hy, 1.2, 2, '#181020', { flat: true, soft: true }));
  return renderParts(20, 30, L);
}

/* ---------- scenery sprites (trees, grass, flowers) built with the same shaded-part renderer ---------- */
const SC = {};
function sr(seedv) { let s = seedv >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function makeTree(kind, hgt, opt = {}) {
  const r = sr(opt.seed || ri(1, 1e9)), j = (a) => (r() - 0.5) * a, w = Math.round(hgt * (kind === 'pine' || kind === 'snowpine' ? 0.62 : kind === 'cactus' ? 0.6 : 0.95)), L = [];
  const bark = opt.bark || '#6a4424', leaf = opt.leaf || '#3c9a40', leaf2 = opt.leaf2 || tint(leaf, 0.18), cx = w / 2;
  if (kind === 'round' || kind === 'bush') {
    const trunkTop = kind === 'bush' ? hgt * 0.7 : hgt * 0.45;
    if (kind === 'round') L.push(Ln(cx, hgt - 1, cx + j(2), trunkTop, Math.max(2, hgt * 0.12), bark), Ln(cx, hgt * 0.62, cx - w * 0.2, hgt * 0.45, Math.max(1.2, hgt * 0.06), bark), Ln(cx, hgt * 0.58, cx + w * 0.22, hgt * 0.42, Math.max(1.2, hgt * 0.06), bark));
    const cy = kind === 'bush' ? hgt * 0.62 : hgt * 0.36, R = kind === 'bush' ? hgt * 0.36 : hgt * 0.27, n = 7;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + j(0.4); L.push(E(cx + Math.cos(a) * R * 0.75, cy + Math.sin(a) * R * 0.55, R * (0.55 + r() * 0.15), R * (0.5 + r() * 0.15), i % 2 ? leaf : tint(leaf, -0.08))); }
    L.push(E(cx - R * 0.15, cy - R * 0.2, R * 0.65, R * 0.55, leaf2));
    if (opt.fruit) for (let i = 0; i < 4; i++) L.push(E(cx + j(R * 1.4), cy + j(R), Math.max(0.8, hgt * 0.035), Math.max(0.8, hgt * 0.035), opt.fruit, { soft: true }));
  } else if (kind === 'pine' || kind === 'snowpine') {
    L.push(Ln(cx, hgt - 1, cx, hgt * 0.75, Math.max(2, hgt * 0.1), bark));
    for (let i = 0; i < 4; i++) { const y0 = hgt * (0.82 - i * 0.2), y1 = y0 - hgt * 0.3, hw = w * (0.5 - i * 0.1); L.push(Pp([[cx - hw, y0], [cx, y1], [cx + hw, y0], [cx + hw * 0.5, y0 - 1.5], [cx, y0], [cx - hw * 0.5, y0 - 1.5]], i % 2 ? leaf : tint(leaf, -0.07))); if (kind === 'snowpine') L.push(Pp([[cx - hw * 0.45, y1 + (y0 - y1) * 0.45], [cx, y1 + 0.5], [cx + hw * 0.45, y1 + (y0 - y1) * 0.45]], '#f4f8ff', { soft: true })); }
  } else if (kind === 'dead') {
    const c = opt.bark || '#2c2030'; L.push(Ln(cx, hgt - 1, cx + j(3), hgt * 0.3, Math.max(2, hgt * 0.1), c));
    for (let i = 0; i < 4; i++) { const y = hgt * (0.35 + i * 0.12), s = i % 2 ? 1 : -1, ex = cx + s * w * (0.35 + r() * 0.15), ey = y - hgt * 0.15; L.push(Ln(cx, y, ex, ey, Math.max(1, hgt * 0.05), c), Ln(ex, ey, ex + s * 3, ey - 4, 1, c)); }
  } else if (kind === 'cactus') {
    const g2 = opt.leaf || '#4a9a48'; L.push(Ln(cx, hgt - 1, cx, hgt * 0.15, w * 0.32, g2)); L.push(Ln(cx - w * 0.1, hgt * 0.55, cx - w * 0.38, hgt * 0.5, w * 0.2, g2), Ln(cx - w * 0.38, hgt * 0.5, cx - w * 0.38, hgt * 0.3, w * 0.2, g2)); L.push(Ln(cx + w * 0.1, hgt * 0.45, cx + w * 0.38, hgt * 0.42, w * 0.2, g2), Ln(cx + w * 0.38, hgt * 0.42, cx + w * 0.38, hgt * 0.25, w * 0.2, g2)); if (r() < 0.5) L.push(E(cx, hgt * 0.15, 2, 2, '#f070a0', { soft: true }));
  } else if (kind === 'rock') { L.push(E(cx, hgt * 0.6, w * 0.48, hgt * 0.4, opt.leaf || '#8c8ca0'), E(cx - w * 0.15, hgt * 0.5, w * 0.2, hgt * 0.15, tint(opt.leaf || '#8c8ca0', 0.2), { soft: true })); }
  return renderParts(w, hgt, L);
}
function makeTuft(col, seedv, flower) {
  const r = sr(seedv), L = [], w = 9, h = 7;
  for (let i = 0; i < 4; i++) { const x = 1.5 + i * 2 + (r() - 0.5); L.push(Pp([[x - 1, h], [x + (r() - 0.5) * 3, 1 + r() * 2], [x + 1, h]], i % 2 ? col : tint(col, 0.15), { noOutline: true })); }
  if (flower) L.push(E(4.5 + (r() - 0.5) * 3, 2, 1.3, 1.3, flower, { noOutline: true }));
  return renderParts(w, h, L);
}
function makeFlower(col) { return renderParts(7, 8, [Ln(3.5, 7.5, 3.5, 4, 1, '#3c8a30', { noOutline: true }), E(2, 3, 1.3, 1.3, col), E(5, 3, 1.3, 1.3, col), E(3.5, 1.6, 1.3, 1.3, col), E(3.5, 4.2, 1.3, 1.3, col), E(3.5, 3, 1, 1, '#ffe060', { soft: true })]); }
function makeCloud(w) { const L = []; for (let i = 0; i < 5; i++) L.push(E(w * (0.18 + i * 0.16), w * 0.22 - (i % 2) * w * 0.07 - (i === 2 ? w * 0.06 : 0), w * 0.15, w * 0.12, '#ffffff', { noOutline: true })); L.push(E(w * 0.5, w * 0.27, w * 0.42, w * 0.07, '#e4ecff', { noOutline: true })); return renderParts(Math.round(w), Math.round(w * 0.38), L); }
function sceneryKit() {
  if (SC.ready) return SC;
  SC.clouds = [makeCloud(44), makeCloud(34), makeCloud(56)];
  SC.farTrees = [0, 1, 2].map((i) => makeTree('round', 16, { leaf: '#2e7a46', seed: 11 + i }));
  SC.bigTrees = [makeTree('round', 52, { leaf: '#3a9a3c', seed: 3 }), makeTree('round', 44, { leaf: '#4aa040', seed: 4, fruit: '#e84848' }), makeTree('pine', 50, { leaf: '#2a7448', seed: 5 }), makeTree('round', 58, { leaf: '#358a3a', seed: 9 })];
  SC.bushes = [makeTree('bush', 16, { leaf: '#3c9a3a', seed: 21, fruit: '#f05070' }), makeTree('bush', 13, { leaf: '#48a844', seed: 22 }), makeTree('bush', 18, { leaf: '#2e8a3c', seed: 23, fruit: '#f8e060' })];
  SC.tufts = Array.from({ length: 8 }, (_, i) => makeTuft(i % 2 ? '#3c9a34' : '#48ac3c', 40 + i, i % 4 === 3 ? pick(['#ffe060', '#ff80b0', '#ffffff', '#a080ff']) : null));
  SC.flowers = ['#ff5a7a', '#ffd040', '#ffffff', '#9a78ff', '#ff9040'].map(makeFlower);
  SC.rocks = [makeTree('rock', 8, { seed: 31 }), makeTree('rock', 11, { seed: 32, leaf: '#9a9488' })];
  SC.ground = makeGroundTile(); SC.ready = true; return SC;
}
// a 320×108 strip of meadow + dirt path, tiled as the party walks
function makeGroundTile() {
  const c = makeCanvas(320, 108), o = c.getContext('2d'), r = sr(77), prev = g; g = o;
  o.fillStyle = vgrad(0, 108, ['#5cb848', '#4ea43e', '#3e8a34']); o.fillRect(0, 0, 320, 108);
  for (let i = 0; i < 900; i++) { const x = Math.floor(r() * 320), y = Math.floor(r() * 108); o.fillStyle = r() < 0.5 ? 'rgba(30,90,30,.35)' : 'rgba(160,230,110,.28)'; o.fillRect(x, y, r() < 0.3 ? 2 : 1, 1); }
  for (let i = 0; i < 14; i++) { o.fillStyle = 'rgba(40,110,40,.25)'; o.beginPath(); o.ellipse(r() * 320, r() * 108, 10 + r() * 16, 3 + r() * 4, 0, 0, 7); o.fill(); }
  // dirt path with soft edges, ruts and pebbles
  const py = 36, ph = 22; o.fillStyle = '#7a5a34'; o.fillRect(0, py - 1, 320, ph + 2); o.fillStyle = vgrad(py, py + ph, ['#d8b878', '#c8a464', '#b08a50']); o.fillRect(0, py, 320, ph);
  for (let x = 0; x < 320; x += 2) { const e1 = Math.round(Math.sin(x * 0.11) * 1.5 + Math.sin(x * 0.37)), e2 = Math.round(Math.sin(x * 0.07 + 2) * 1.5); o.fillStyle = '#4ea43e'; o.fillRect(x, py - 2, 2, 2 + e1); o.fillRect(x, py + ph - e2, 2, 3 + e2); o.fillStyle = '#3c8a30'; o.fillRect(x, py + e1 - 1, 2, 1); }
  for (let i = 0; i < 70; i++) { const x = r() * 320, y = py + 3 + r() * (ph - 6); o.fillStyle = r() < 0.5 ? '#a08048' : '#e8d098'; o.fillRect(Math.floor(x), Math.floor(y), r() < 0.3 ? 2 : 1, 1); }
  for (let i = 0; i < 10; i++) { const x = r() * 316, y = py + 4 + r() * (ph - 8); o.fillStyle = '#6a5a48'; o.fillRect(Math.floor(x), Math.floor(y) + 1, 3, 1); o.fillStyle = '#b8b0a0'; o.fillRect(Math.floor(x), Math.floor(y), 3, 1); o.fillStyle = '#e8e0d0'; o.fillRect(Math.floor(x), Math.floor(y), 1, 1); }
  o.fillStyle = 'rgba(120,90,50,.35)'; o.fillRect(0, py + 7, 320, 1); o.fillRect(0, py + 15, 320, 1);
  g = prev;
  // tufts and flowers (wrap safely inside 320)
  const t = SC.tufts || [], f = SC.flowers || [];
  for (let i = 0; i < 46; i++) { const y = r() < 0.5 ? 2 + r() * 28 : 62 + r() * 42, x = r() * 310; o.drawImage(t[i % t.length], Math.floor(x), Math.floor(y)); }
  for (let i = 0; i < 18; i++) { const y = r() < 0.5 ? 4 + r() * 24 : 64 + r() * 38, x = r() * 310; o.drawImage(f[i % f.length], Math.floor(x), Math.floor(y)); }
  for (let i = 0; i < 4; i++) o.drawImage(SC.rocks[i % 2], Math.floor(r() * 300), Math.floor(64 + r() * 36));
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
const CLASS_COL = {
  Fighter: [['#5878c8', '#e8c040', '#3c4058'], ['#b83c3c', '#e8d8a0', '#40302c']], Barbarian: [['#a86c3c', '#5c3c20', '#5c3c20'], ['#7c4c2c', '#d8c8a8', '#3c2c20']],
  Paladin: [['#e8e8f8', '#e8c040', '#8890a8'], ['#d8e0f0', '#4878d8', '#7880a0']], Ranger: [['#3c8c48', '#a8d878', '#5c4028'], ['#5c7c38', '#c8a060', '#4c3c28']],
  Rogue: [['#4c4458', '#a8384c', '#2c2834'], ['#383c48', '#6c88a8', '#20242c']], Monk: [['#e88c30', '#f8e070', '#c86c20'], ['#c84838', '#f0d090', '#8c3428']],
  Cleric: [['#f4f4f8', '#e8c040', '#b8b8c8'], ['#f0e8d8', '#5c9ce8', '#b0a890']], Druid: [['#4c8c3c', '#c8a050', '#5c4028'], ['#6c8c4c', '#e8d080', '#4c3c28']],
  Wizard: [['#3c48b8', '#f0d040', '#2c3088'], ['#7838a8', '#78d8f0', '#40205c']], Sorcerer: [['#c82c48', '#f8a040', '#7c1c30'], ['#2c8c8c', '#f8e070', '#1c4c4c']],
  Warlock: [['#38204c', '#a058e8', '#1c1028'], ['#2c2c3c', '#58e8a0', '#14141c']], Bard: [['#e85c9c', '#f8e070', '#5c3c7c'], ['#40a8d8', '#f8c040', '#384878']],
};
const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Tiefling', 'Dragonborn'];
const SYL1 = ['Ar', 'Bel', 'Cor', 'Dra', 'El', 'Fen', 'Gar', 'Hal', 'Ith', 'Jor', 'Kel', 'Lor', 'Mor', 'Nym', 'Or', 'Pell', 'Quin', 'Ror', 'Syl', 'Thra', 'Ul', 'Vor', 'Wyn', 'Zan'];
const SYL2 = ['ak', 'and', 'ara', 'en', 'eth', 'ia', 'in', 'is', 'ok', 'or', 'os', 'ric', 'wyn', 'ys', 'um', 'ette', 'grim', 'dor', 'lin', 'mar'];
const EPI = ['the Bold', 'Quickstep', 'of the Fen', 'Ironbelly', 'the Grey', 'Songsworn', 'Kettleborn', 'the Unlucky', 'Two-Coins', 'Mossbeard', 'Brightwater', 'the Loud'];
const heroName = () => pick(SYL1) + pick(SYL2);
const ADJ = ['Gloomy', 'Shrieking', 'Vile', 'Glittering', 'Moss-backed', 'Ninefold', 'Pale', 'Ember', 'Brine', 'Howling', 'Crystal', 'Gibbering', 'Rotting', 'Velvet', 'Thorned', 'Drowned', 'Clockwork', 'Bog', 'Star-eyed', 'Copper', 'Hollow', 'Grinning', 'Static', 'Jelly', 'Ashen', 'Feral', 'Lunar', 'Cackling', 'Barnacled', 'Vinyl'];
const BASE = { blob: ['Ooze', 'Slime', 'Jelly', 'Puffball', 'Blight', 'Gloop'], beast: ['Wolf', 'Boar', 'Hound', 'Lion', 'Bear', 'Drake'], eye: ['Beholder', 'Gazer', 'Eye', 'Orb', 'Watcher'], plant: ['Mandrake', 'Flytrap', 'Bloom', 'Thornling', 'Vinekin'], mushroom: ['Shroom', 'Sporeling', 'Toadstool', 'Myconid', 'Puffcap'], golem: ['Golem', 'Sentinel', 'Colossus', 'Construct', 'Idol'], wraith: ['Wraith', 'Shade', 'Specter', 'Phantom', 'Banshee'], biped: ['Gnoll', 'Ghoul', 'Kobold', 'Troll', 'Goblin', 'Bugbear', 'Hobgob'], winged: ['Harpy', 'Imp', 'Moth', 'Bat', 'Wyvernling', 'Gargoyle'], serpent: ['Wyrm', 'Eel', 'Basilisk', 'Naga', 'Worm', 'Serpent'], spider: ['Spider', 'Crab', 'Beetle', 'Scuttler', 'Tick', 'Crawler'], tall: ['Wraith', 'Shade', 'Golem', 'Treant', 'Lurker', 'Stalker'] };
const TITLE = ['', '', '', ' Lord', ' Spawn', ' Queen', ' of the Fen', ' Elder', ' Brute', ' Chanter'];
const SIZES = [['Tiny', 20, 0.4], ['Small', 26, 0.7], ['Medium', 32, 1], ['Large', 40, 1.6], ['Huge', 50, 2.5], ['Gargantuan', 62, 3.6]];

/* ---------- state ---------- */
const S = {
  phase: 'intro', introT: 0, party: [], gold: 0, foes: [], bestiary: [], songs: [], curSong: -1, playing: false, pace: 1, energy: 0.5,
  walkT: 0, nextEnc: 8, log: [], turnQ: [], turnT: 0, anim: null, banner: null, floaters: [], deaths: 0, battles: 0, wins: 0, started: Date.now(), fieldX: 0, rolling: null, chronicle: [],
};
function newHero() {
  const cls = pick(Object.keys(CLASSES)), race = pick(RACES), info = CLASSES[cls];
  const roll = () => { const r = [d(1, 6), d(1, 6), d(1, 6), d(1, 6)].sort((a, b) => a - b); return r[1] + r[2] + r[3]; };
  const stats = { STR: roll(), DEX: roll(), CON: roll(), INT: roll(), WIS: roll(), CHA: roll() };
  const mod = (v) => Math.floor((v - 10) / 2);
  const hp = info.hd + Math.max(1, mod(stats.CON) + 2) + 6;
  const h = { name: heroName(), epi: pick(EPI), cls, race, info, stats, lvl: 1, xp: 0, hp, max: hp, kills: 0, dmg: 0, hair: pick(HAIRC), skin: pick(SKINC[race]), style: pick(['spiky', 'long', 'pony', 'bob', 'mohawk', 'spiky']), plume: pick(HAIRC), lvlBySong: [], alive: true };
  const [c1, c2, legs] = pick(CLASS_COL[cls]);
  h.kit = Object.assign({}, info.kit, { c1, c2, legs, cape: (cls === 'Paladin' || cls === 'Warlock' || (cls === 'Fighter' && rnd() < 0.5)), hat: (cls === 'Wizard' || (cls === 'Sorcerer' && rnd() < 0.5)) ? 'wizard' : null });
  if (h.kit.hat) h.kit.hood = false; if (cls === 'Fighter' && rnd() < 0.4) h.kit.helm = false;
  h.sprite = genHeroSprite(h);
  h.atkBonus = Math.max(mod(stats.STR), mod(stats.DEX), info.atk === 'spell' ? Math.max(mod(stats.INT), mod(stats.WIS), mod(stats.CHA)) : -9);
  return h;
}
function rollParty() { S.party = [newHero(), newHero(), newHero(), newHero()]; S.rolling = { t: 0, faces: Array.from({ length: 24 }, () => ri(1, 6)) }; }
function partyLevel() { const a = S.party.filter((h) => h.alive); return a.length ? a.reduce((s, h) => s + h.lvl, 0) / a.length : 1; }

function newMonsterType() {
  const plan = pick(PLANS), size = SIZES[clamp(Math.floor(rnd() * rnd() * 6.2), 0, 5)];
  const hue = rnd() * 360, sat = 45 + rnd() * 35, lit = 40 + rnd() * 22, bh = hue + (rnd() < 0.5 ? 0 : 35 + rnd() * 50);
  const P = { body: hsl(hue, sat, lit), belly: hsl(bh, sat * 0.8, Math.min(85, lit + 22 + rnd() * 10)), accent: rnd() < 0.35 ? pick(['#e8dcc0', '#f0c840', '#c8d0e0']) : hsl(hue + 150 + rnd() * 60, 60, 55) };
  const local = sr(seed ^ 0xabcdef);
  const sp = genMonsterSprite(local, plan, P, size[1]); const c1 = hueName(hue, lit), c2 = hueName(bh, lit + 25);
  const base = pick(BASE[plan]); const name = pick(ADJ) + ' ' + base + pick(TITLE);
  const lvl = Math.max(1, Math.round(partyLevel() + ri(-1, 1) + size[2] * 0.6));
  const hp = Math.round((6 + lvl * 5) * size[2]);
  const t = { id: S.bestiary.length + 1, name, base, plan, size: size[0], scale: size[1], mult: size[2], lvl, hp, dmg: Math.max(2, Math.round((2 + lvl * 1.4) * Math.sqrt(size[2]))), xp: Math.round((10 + lvl * 8) * size[2]), c1, c2, sprite: sp, eyes: sp.eyes, slain: 0, slainBy: {}, song: S.curSong, desc: '' };
  t.desc = `${t.size} ${c1} ${base.toLowerCase()} with ${sp.eyes} eye${sp.eyes > 1 ? 's' : ''} and ${c2} markings`;
  S.bestiary.push(t);
  return t;
}
function encounter() {
  const t = newMonsterType(); let t2 = null;
  const n = t.mult >= 2.5 ? 1 : clamp(Math.round((2 + rnd() * 3) / t.mult), 1, 6);
  S.foes = [];
  for (let i = 0; i < n; i++) S.foes.push({ type: t, hp: t.hp, max: t.hp, alive: true, x: 0, y: 0, flash: 0 });
  if (n <= 2 && rnd() < 0.45 && t.mult < 2) { t2 = newMonsterType(); const m = clamp(Math.round(2.5 / t2.mult), 1, 3); for (let i = 0; i < m; i++) S.foes.push({ type: t2, hp: t2.hp, max: t2.hp, alive: true, x: 0, y: 0, flash: 0 }); }
  layoutFoes(); S.bg = makeBattleBg(pick(BIOMES));
  S.phase = 'battle'; S.battles++; S.turnQ = []; S.turnT = 900; S.log = [];
  if (!S.bigBattle || S.foes.length > S.bigBattle.n) S.bigBattle = { n: S.foes.length, name: t.name, song: S.curSong };
  const names = [t, t2].filter(Boolean).map((x) => `${S.foes.filter((f) => f.type === x).length} ${upper(x.name)}`).join(' & ');
  say(`ENCOUNTER! ${names}`);
  if (S.curSong >= 0) S.songs[S.curSong].foes.push(...[t, t2].filter(Boolean).map((x) => x.name));
}
function layoutFoes() {
  // monsters on the right in up to 3 columns, sized by their scale
  const list = S.foes; const cols = list.length > 3 ? 2 : 1; let i = 0;
  list.forEach((f) => { const w = f.type.sprite.w, h = f.type.sprite.h; const col = cols === 2 ? i % 2 : 0, row = cols === 2 ? Math.floor(i / 2) : i; f.w = w; f.h = h; f.x = 312 - (col + 1) * 70 + (70 - w) / 2; f.y = 0; f.row = row; i++; });
  const rows = Math.max(...list.map((f) => f.row)) + 1;
  for (let r = 0; r < rows; r++) { const inRow = list.filter((f) => f.row === r); const hh = Math.max(...inRow.map((f) => f.h)); inRow.forEach((f) => { f.rowH = hh; }); }
  let y = 26; for (let r = 0; r < rows; r++) { const inRow = list.filter((f) => f.row === r); const hh = inRow[0].rowH; inRow.forEach((f) => { f.y = y + (hh - f.h); }); y += hh + 6; }
  const over = y - 128; if (over > 0) list.forEach((f) => { f.y -= over * (f.row / Math.max(1, rows - 1)); });
}

/* ---------- log ---------- */
function say(s) { S.log.push(upper(s)); if (S.log.length > 3) S.log.shift(); }
function chronicle(s) { S.chronicle.push({ song: S.curSong, text: s }); }

/* ---------- battle ---------- */
const HW = 22, HH = 32;
function heroPos(i) { return { x: 26 + (i % 2) * 28, y: 16 + i * 28 }; }
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
function hurtFoe(f, dm, h) { if (!h.best || dm > h.best.dm) h.best = { dm, foe: f.type.name, song: S.curSong }; f.hp -= dm; f.flash = 300; floater({ x: f.x + f.w / 2, y: f.y }, String(dm), 7); h.dmg += dm; if (f.hp <= 0 && f.alive) { f.alive = false; h.kills++; f.type.slain++; f.type.slainBy[h.name] = (f.type.slainBy[h.name] || 0) + 1; } }
function resolveAnim(a) {
  if (a.foe) { if (a.dmg) { a.tgt.hp -= a.dmg; a.tgt.flash = 300; floater(heroPos(S.party.indexOf(a.tgt)), String(a.dmg), 2); if (a.tgt.hp > 0 && a.tgt.hp <= Math.max(2, a.tgt.max * 0.15)) { a.tgt.close = (a.tgt.close || 0) + 1; a.tgt.closeFoe = a.actor.type.name; } if (a.tgt.hp <= 0) { a.tgt.alive = false; a.tgt.hp = 0; a.tgt.downs = (a.tgt.downs || 0) + 1; a.tgt.downBy = a.actor.type.name; say(`${a.tgt.name} falls!`); chronicle(`${a.tgt.name} fell to the ${a.actor.type.name}.`); } } return; }
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
  S.curSong = S.songs.length - 1; S.playing = true; if (typeof VZ !== 'undefined') VZ.bpm = 86 + rnd() * 60;
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
const PER = 200; // one hero perishes for every 200 seconds the session lands away from 2048
const MOTTO = 'SEX CARMINA TIBI TANTUM DANTUR';
function questResult() { const t = totalSecs(), n = S.songs.length; if (!n) return 'none'; const off = Math.abs(t - GOAL); S.off = off; S.dir = t < GOAL ? 'short' : 'long'; S.fallenN = Math.min(S.party.length, Math.floor(off / PER)); return off <= EXACT ? 'perfect' : S.fallenN === 0 ? 'won' : S.fallenN >= S.party.length ? 'lost' : 'partial'; }
let questTick = 0;
function renderQuest() {
  const t = totalSecs(), n = S.songs.length, left = GOAL - t;
  const lt = songsLeftText();
  const html = `${MOTTO} — SIX SONGS IS ALL YOU GET. LISTEN WELL, OR PERISH.<br>${lt} · TIME HEARD ${fmt(t)}${S.ended ? ' · QUEST OVER' : ''}<br><i>HINT: THE LIMITS OF REGULAR NOTES IN SIX SONGS.</i>`;
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
    g.drawImage(h.sprite, 11, y);
    const show = !r || r.t > 300 + i * 260;
    if (show) {
      txt(upper(h.name), 40, y + 5, 1); txt(upper(`${h.race} ${h.cls}`), 40, y + 16, 3, 'left', 6);
      const sx = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']; sx.forEach((k, j) => { txt(k, 168 + (j % 3) * 50, y + 5 + Math.floor(j / 3) * 11, 15); txt(String(h.stats[k]).padStart(2, ' '), 196 + (j % 3) * 50, y + 5 + Math.floor(j / 3) * 11, h.stats[k] >= 15 ? 13 : h.stats[k] <= 7 ? 10 : 1); });
      txt('HP ' + h.max, 40, y + 25, 7, 'left', 6);
    } else {
      for (let k = 0; k < 4; k++) { const v = ri(1, 6); drawDie(170 + k * 30, y + 6, v); }
    }
  });
  if (Math.floor(now / 500) % 2) txt('CLICK = REROLL   ENTER = BEGIN', W / 2, 172, 7, 'center');
  txt('PRESS PLAY ON YOUR MUSIC TO BEGIN', W / 2, 186, 15, 'center', 6);
}
function drawIntro(dt) {
  S.introT += dt; const t = S.introT, k = Math.min(1, t / 900);
  g.fillStyle = vgrad(0, H, ['#0c0820', '#241850', '#5c2c70', '#c0503c']); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { const x = (i * 97) % W, y = (i * 53) % 120; g.fillStyle = (Math.sin(t / 300 + i) > 0.4) ? '#fff' : '#8878c8'; g.fillRect(x, y, 1, 1); }
  // mountains + castle silhouette
  g.fillStyle = '#1c1238'; for (let x = 0; x < W; x++) { const h = 30 + 14 * Math.sin(x * 0.03) + 7 * Math.sin(x * 0.09); g.fillRect(x, 170 - h, 1, h + 30); }
  g.fillStyle = '#100a24'; g.fillRect(132, 128, 56, 42); g.fillRect(124, 112, 14, 58); g.fillRect(182, 112, 14, 58); g.fillRect(152, 100, 16, 30);
  for (let i = 0; i < 6; i++) { g.fillStyle = Math.sin(t / 400 + i) > -0.4 ? '#ffd040' : '#6a4010'; g.fillRect(128 + (i % 3) * 30, 120 + Math.floor(i / 3) * 18, 3, 4); }
  // logo drops in
  const ly = -30 + 64 * (1 - Math.pow(1 - k, 3));
  ['#1c1040', '#801c28', '#d04818', '#f89020', '#ffd040'].forEach((c, i, a) => txt('PHANTASEA', W / 2 + (i === 0 ? 2 : 0), ly + (a.length - 1 - i) * 1.5 + (i === 0 ? 2 : 0), c, 'center', 24));
  txt('PHANTASEA', W / 2, ly - 1, '#fff4b0', 'center', 24);
  txt('SESSIONS', W / 2, ly + 30, '#d8d0ff', 'center', 8);
  if (t > 1300) { const a = Math.min(1, (t - 1300) / 900); g.save(); g.globalAlpha = a; box(26, 82, 268, 34, 6, 7); txtO(MOTTO, W / 2, 90, '#ffe878', 'center', 7); txt('SIX SONGS IS ALL YOU GET', W / 2, 104, '#c8c0ff', 'center', 6); g.restore(); }
  if (t > 3000 && Math.floor(t / 500) % 2) txtO('CLICK TO ROLL YOUR PARTY', W / 2, 184, '#fff', 'center', 6);
}
function drawDie(x, y, v) { g.fillStyle = C[1]; g.fillRect(x, y, 18, 18); g.fillStyle = C[0]; g.fillRect(x, y + 17, 18, 1); g.fillRect(x + 17, y, 1, 18); const P = { 1: [[9, 9]], 2: [[5, 5], [13, 13]], 3: [[5, 5], [9, 9], [13, 13]], 4: [[5, 5], [13, 5], [5, 13], [13, 13]], 5: [[5, 5], [13, 5], [9, 9], [5, 13], [13, 13]], 6: [[5, 4], [13, 4], [5, 9], [13, 9], [5, 14], [13, 14]] }[v]; g.fillStyle = C[2]; P.forEach(([a, b]) => g.fillRect(x + a - 1, y + b - 1, 3, 3)); }

// 16-bit style field with parallax
function drawField(now, dt) {
  const fx = S.fieldX;
  const K = sceneryKit(), wrapx = (x, span) => ((x % span) + span) % span;
  g.fillStyle = vgrad(0, 80, ['#2a54c8', '#5a88e0', '#9cc4f4', '#d4ecff']); g.fillRect(0, 0, W, 82);
  K.clouds.forEach((c, i) => { const x = wrapx(i * 130 - fx * (0.05 + i * 0.02), W + 80) - 60; g.drawImage(c, Math.round(x), 6 + i * 11); });
  // shaded mountains with snow caps
  for (let x = 0; x < W; x++) { const X = x + fx * 0.15, h = 24 + 14 * Math.sin(X * 0.028) + 8 * Math.sin(X * 0.071) + 3 * Math.sin(X * 0.19), slope = Math.cos(X * 0.028) * 0.4 + Math.cos(X * 0.071) * 0.57;
    g.fillStyle = slope > 0 ? '#8a8ad0' : '#6a68b0'; g.fillRect(x, 76 - h, 1, h + 8); g.fillStyle = slope > 0 ? '#ffffff' : '#c8d0f0'; if (h > 32) g.fillRect(x, 76 - h, 1, Math.min(6, h - 32 + 2)); }
  g.fillStyle = vgrad(52, 80, ['rgba(200,225,255,0)', 'rgba(200,225,255,.45)']); g.fillRect(0, 52, W, 28);
  // far rolling hills with a tree line
  for (let x = 0; x < W; x++) { const X = x + fx * 0.32, h = 10 + 5 * Math.sin(X * 0.045) + 2 * Math.sin(X * 0.13); g.fillStyle = Math.cos(X * 0.045) > 0 ? '#4a9a52' : '#3c8648'; g.fillRect(x, 88 - h, 1, h + 6); }
  for (let i = 0; i < 26; i++) { const x = wrapx(i * 17 - fx * 0.32, W + 40) - 20; g.drawImage(K.farTrees[i % 3], Math.round(x), 66 + (i * 7) % 6); }
  // near trees and bushes standing on the meadow edge
  for (let i = 0; i < 6; i++) { const t = K.bigTrees[i % K.bigTrees.length], x = wrapx(i * 83 - fx * 0.62, W + 160) - 80; g.drawImage(t, Math.round(x), 98 - t.height + 6); }
  for (let i = 0; i < 9; i++) { const b = K.bushes[i % 3], x = wrapx(i * 47 + 20 - fx * 0.8, W + 60) - 30; g.drawImage(b, Math.round(x), 100 - b.height + 4); }
  // the meadow strip scrolls with the party
  const gx = -Math.round(wrapx(fx, 320)); g.drawImage(K.ground, gx, 92); g.drawImage(K.ground, gx + 320, 92);
  // foreground grass passes quicker for depth
  for (let i = 0; i < 16; i++) { const t = K.tufts[i % K.tufts.length], x = wrapx(i * 29 - fx * 1.35, W + 40) - 20; g.drawImage(t, Math.round(x), 188 + (i % 3) * 3, 14, 11); }
  // party marching
  S.party.forEach((h, i) => { if (!h.alive) return; const bob = Math.abs(Math.sin(now / 160 + i)) * 2; shadow(120 - i * 26 + HW / 2, 146, HW); g.drawImage(h.sprite, 120 - i * 26, 114 - bob, HW, HH); });
}
const BIOMES = ['meadow', 'forest', 'cave', 'desert', 'snow', 'swamp', 'dusk'];
function makeBattleBg(kind) {
  const cnv = makeCanvas(W, 140), o = cnv.getContext('2d'); const prev = g; g = o;
  const P = {
    meadow: { sky: ['#2c5cd8', '#5c90f0', '#b8e0ff'], far: '#7088d0', mid: '#3a8a48', near: '#2a6a30', g1: '#5cb040', g2: '#48983a', hz: 70 },
    forest: { sky: ['#183c78', '#3c78b8', '#88c8e0'], far: '#305878', mid: '#1c5030', near: '#103820', g1: '#3c7a30', g2: '#306828', hz: 74, trees: 1 },
    cave: { sky: ['#140c1c', '#2c1c30', '#4a3040'], far: '#3a2838', mid: '#2a1c28', near: '#1c1018', g1: '#5a4448', g2: '#4a383c', hz: 66, cave: 1 },
    desert: { sky: ['#e85c28', '#f8a040', '#ffe0a0'], far: '#c87058', mid: '#d89850', near: '#b87838', g1: '#e8c070', g2: '#d8a858', hz: 76, sun: 1 },
    snow: { sky: ['#5878a8', '#90b0d0', '#e0ecf8'], far: '#a8c0e0', mid: '#e8f0f8', near: '#c8d8e8', g1: '#f0f4ff', g2: '#d8e4f4', hz: 72, pines: 1 },
    swamp: { sky: ['#1c1440', '#40306c', '#7860a0'], far: '#3c3460', mid: '#2c3c34', near: '#1c2c24', g1: '#3c5440', g2: '#2c4434', hz: 72, moon: 1, dead: 1 },
    dusk: { sky: ['#301860', '#a03c78', '#f89058'], far: '#683c78', mid: '#402858', near: '#281840', g1: '#506038', g2: '#405030', hz: 74, sun: 1 },
  }[kind];
  o.fillStyle = vgrad(0, P.hz, P.sky); o.fillRect(0, 0, W, P.hz + 2);
  if (P.sun) { const gr = o.createRadialGradient(250, P.hz - 18, 2, 250, P.hz - 18, 46); gr.addColorStop(0, '#fff8d0'); gr.addColorStop(0.25, 'rgba(255,230,140,.9)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); o.fillStyle = gr; o.fillRect(190, P.hz - 70, 120, 80); }
  if (P.moon) { o.fillStyle = '#f0f0ff'; o.beginPath(); o.arc(258, 24, 11, 0, 7); o.fill(); o.fillStyle = P.sky[0]; o.beginPath(); o.arc(264, 20, 10, 0, 7); o.fill(); for (let i = 0; i < 40; i++) { o.fillStyle = i % 5 ? '#c8c0ff' : '#fff'; o.fillRect(ri(0, W), ri(0, P.hz - 20), 1, 1); } }
  if (!P.cave && !P.moon) { const K0 = sceneryKit(); for (let i = 0; i < 4; i++) { o.save(); o.globalAlpha = kind === 'dusk' || kind === 'desert' ? 0.75 : 1; o.drawImage(K0.clouds[i % 3], ri(-20, W - 20), ri(4, P.hz - 34)); o.restore(); } }
  // far range
  const ph = rnd() * 9;
  for (let x = 0; x < W; x++) { const h = 18 + 12 * Math.sin(x * 0.035 + ph) + 6 * Math.sin(x * 0.11 + ph * 2); o.fillStyle = P.far; o.fillRect(x, P.hz - h, 1, h); if (kind === 'snow' && h > 24) { o.fillStyle = '#fff'; o.fillRect(x, P.hz - h, 1, 3); } }
  o.fillStyle = vgrad(P.hz - 30, P.hz, ['rgba(255,255,255,0)', 'rgba(255,255,255,.18)']); o.fillRect(0, P.hz - 30, W, 30);
  // mid hills
  for (let x = 0; x < W; x++) { const h = 8 + 5 * Math.sin(x * 0.06 + ph * 3); o.fillStyle = P.mid; o.fillRect(x, P.hz - h + 4, 1, h); }
  const K = sceneryKit(); SC.bt = SC.bt || {};
  const kit = SC.bt[kind] = SC.bt[kind] || ({
    meadow: [makeTree('round', 26, { leaf: '#3c8c48', seed: 101 }), makeTree('round', 34, { leaf: '#46a046', seed: 102, fruit: '#f05050' }), makeTree('bush', 14, { leaf: '#3c9a3c', seed: 103 })],
    forest: [makeTree('pine', 40, { leaf: '#1e5c3c', seed: 111 }), makeTree('round', 44, { leaf: '#2a6a34', seed: 112 }), makeTree('pine', 30, { leaf: '#24683e', seed: 113 }), makeTree('round', 36, { leaf: '#307a3a', seed: 114 })],
    snow: [makeTree('snowpine', 38, { leaf: '#2a5a48', seed: 121 }), makeTree('snowpine', 28, { leaf: '#2e6650', seed: 122 })],
    swamp: [makeTree('dead', 40, { bark: '#1c1428', seed: 131 }), makeTree('dead', 30, { bark: '#241c30', seed: 132 })],
    desert: [makeTree('cactus', 30, { seed: 141 }), makeTree('cactus', 22, { seed: 142, leaf: '#5aa850' }), makeTree('rock', 12, { seed: 143, leaf: '#b88858' })],
    dusk: [makeTree('round', 30, { leaf: '#3c3c58', seed: 151, bark: '#2c2030' }), makeTree('pine', 34, { leaf: '#2c2c48', seed: 152, bark: '#2c2030' })],
    cave: [makeTree('rock', 16, { seed: 161, leaf: '#6c5868' }), makeTree('rock', 10, { seed: 162, leaf: '#7c6878' })],
  }[kind]);
  if (!P.cave) { const n = kind === 'forest' ? 18 : kind === 'meadow' ? 5 : kind === 'desert' ? 4 : 7; for (let i = 0; i < n; i++) { const t = kit[i % kit.length], x = kind === 'forest' ? i * 19 + ri(-6, 6) - 10 : ri(-10, W - 10); o.drawImage(t, x, P.hz + 6 - t.height + ri(-1, 2)); } }

  if (P.cave) { for (let x = 0; x < W; x += ri(8, 16)) { const l = ri(8, 30); o.fillStyle = '#1c1018'; o.beginPath(); o.moveTo(x - 6, 0); o.lineTo(x, l); o.lineTo(x + 6, 0); o.fill(); } for (let i = 0; i < 6; i++) { const x = ri(10, 310), y = ri(P.hz + 6, 130); const gr = o.createRadialGradient(x, y, 1, x, y, 14); gr.addColorStop(0, 'rgba(120,255,230,.55)'); gr.addColorStop(1, 'rgba(120,255,230,0)'); o.fillStyle = gr; o.fillRect(x - 14, y - 14, 28, 28); o.fillStyle = '#b8fff0'; o.fillRect(x - 1, y - 4, 3, 6); } }
  // floor with perspective bands
  for (let y = P.hz + 4, k = 0; y < 140; k++) { const hgt = 2 + k * 1.3; o.fillStyle = k % 2 ? P.g1 : P.g2; o.fillRect(0, y, W, hgt + 1); y += hgt; }
  o.fillStyle = vgrad(P.hz + 4, 140, ['rgba(0,0,0,0)', 'rgba(0,0,0,.28)']); o.fillRect(0, P.hz + 4, W, 140 - P.hz - 4);
  if (kind === 'swamp') for (let i = 0; i < 18; i++) { o.fillStyle = 'rgba(200,190,255,.25)'; o.fillRect(ri(0, W), ri(P.hz + 10, 136), ri(6, 18), 1); }
  for (let i = 0; i < 26; i++) { const x = ri(0, W), y = ri(P.hz + 12, 136); o.fillStyle = tint(P.g1, -0.3); o.fillRect(x, y, 2, 1); o.fillStyle = tint(P.g1, 0.3); o.fillRect(x, y - 1, 1, 1); }
  for (let i = 0; i < 500; i++) { const x = ri(0, W - 1), y = ri(P.hz + 6, 139); o.fillStyle = rnd() < 0.5 ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.1)'; o.fillRect(x, y, 1, 1); }
  if (kind === 'meadow' || kind === 'forest' || kind === 'dusk' || kind === 'swamp') { for (let i = 0; i < 22; i++) { const y = ri(P.hz + 8, 132), sc = 0.7 + (y - P.hz) / 70; o.save(); if (kind !== 'meadow') o.filter = kind === 'dusk' ? 'brightness(.7) hue-rotate(-20deg)' : kind === 'swamp' ? 'brightness(.6) saturate(.6)' : 'brightness(.8)'; o.drawImage(K.tufts[i % K.tufts.length], ri(0, W), y, 9 * sc, 7 * sc); o.restore(); } }
  if (kind === 'meadow') for (let i = 0; i < 10; i++) o.drawImage(K.flowers[i % K.flowers.length], ri(0, W), ri(P.hz + 10, 132));
  if (kind !== 'cave' && kind !== 'snow') for (let i = 0; i < 3; i++) o.drawImage(K.rocks[i % 2], ri(0, W), ri(P.hz + 14, 130));
  if (kind === 'snow') for (let i = 0; i < 12; i++) { o.fillStyle = '#ffffff'; o.beginPath(); o.ellipse(ri(0, W), ri(P.hz + 10, 136), ri(4, 12), 1.5, 0, 0, 7); o.fill(); }
  g = prev; return cnv;
}
function drawBattle(now, dt) {
  g.fillStyle = C[0]; g.fillRect(0, 0, W, H);
  if (S.bg) g.drawImage(S.bg, 0, 0); else { g.fillStyle = C[6]; g.fillRect(0, 0, W, 140); }
  // shadows
  S.party.forEach((h, i) => { if (h.alive) { const p = heroPos(i); shadow(p.x + HW / 2, p.y + HH - 1, HW); } });
  S.foes.forEach((f) => { if (f.alive) shadow(f.x + f.w / 2, f.y + f.h - 1, f.w * 0.9); });
  // party
  const a = S.anim;
  S.party.forEach((h, i) => {
    const p = heroPos(i); let ox = 0, oy = 0;
    if (a && a.actor === h) { const k = a.t / a.dur; if (a.kind === 'bounce') { const tx = a.tgt ? a.tgt.x - p.x - 10 : 60; ox = tx * Math.sin(Math.PI * k); oy = -Math.abs(Math.sin(Math.PI * k * 2)) * 10; } else oy = -Math.abs(Math.sin(Math.PI * k * 3)) * 4; }
    if (h.flash > 0) { h.flash -= dt; if (Math.floor(h.flash / 60) % 2) return; }
    if (!h.alive) { g.save(); g.globalAlpha = 0.35; g.translate(p.x + HW / 2, p.y + HH - 4); g.rotate(-Math.PI / 2); g.drawImage(h.sprite, -HH / 2, -HW / 2, HH, HW); g.restore(); return; }
    g.drawImage(h.sprite, p.x + ox, p.y + oy, HW, HH);
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
    if (a.kind === 'shoot' && a.tgt) { const x = p.x + HW + (a.tgt.x - p.x - HW) * k, y = p.y + 12 + (a.tgt.y + a.tgt.h / 2 - p.y - 12) * k; g.fillStyle = C[a.col]; g.fillRect(x - 3, y, 6, 2); if (a.col === 14) { g.fillStyle = C[1]; g.fillRect(x - 1, y - 1, 3, 4); } }
    if (a.kind === 'cast') { const cx = p.x + HW / 2, cy = p.y + HH / 2, rr = 6 + k * 18; const gr = g.createRadialGradient(cx, cy, 1, cx, cy, rr); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, tint(C[a.col], 0.3) + '88'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill(); g.strokeStyle = tint(C[a.col], 0.5); g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr * 0.8, 0, Math.PI * 2); g.stroke(); if (a.aoe) S.foes.forEach((f) => { if (f.alive || f.flash > 0) { g.fillStyle = Math.floor(a.t / 60) % 2 ? C[8] : C[7]; g.fillRect(f.x, f.y + f.h - 4, f.w, 4); } }); }
  }
  // HP bars for party
  S.party.forEach((h, i) => { if (!h.alive) return; const p = heroPos(i); g.fillStyle = '#000'; g.fillRect(p.x - 1, p.y + HH + 1, HW + 2, 4); const col = h.hp / h.max > 0.5 ? '#40e070' : h.hp / h.max > 0.25 ? '#f0d040' : '#f04848'; g.fillStyle = vgrad(p.y + HH + 2, p.y + HH + 4, [tint(col, 0.4), col, tint(col, -0.4)]); g.fillRect(p.x, p.y + HH + 2, Math.max(0, HW * h.hp / h.max), 2); });
  drawFloaters(dt);
  // bottom panel: Phantasie-style roster + log
  box(0, 140, 160, 60, 6, 15); box(160, 140, 160, 60, 6, 15);
  S.party.forEach((h, i) => { const y = 145 + i * 13; txt(upper(h.name).slice(0, 8), 6, y, h.alive ? 1 : 11); txt(`${h.cls.slice(0, 3).toUpperCase()}${h.lvl}`, 76, y, 3); txt(String(Math.max(0, h.hp)).padStart(3, ' '), 122, y, h.hp / h.max > 0.3 ? 13 : 10); });
  S.log.slice(-3).forEach((l, i) => wrap(l, 18).slice(0, 2).forEach((ln, j) => txt(ln, 166, 145 + i * 18 + j * 9, i === S.log.slice(-3).length - 1 ? 1 : 15, 'left', 6)));
  // foe names
  const types = [...new Set(S.foes.filter((f) => f.alive).map((f) => f.type))];
  types.slice(0, 2).forEach((t, i) => txtO(`${S.foes.filter((f) => f.alive && f.type === t).length} ${upper(t.name)}`.slice(0, 38), 5, 5 + i * 10, i ? '#ffe878' : '#fff', 'left', 6));
}
function drawFloaters(dt) {
  S.floaters = S.floaters.filter((f) => (f.t += dt) < 900);
  S.floaters.forEach((f) => txtO(f.s, f.x, f.y - f.t / 30 - Math.max(0, 8 - f.t / 25), f.col === 2 ? '#ff6060' : f.col === 13 ? '#80ff90' : '#fff8a0', 'center'));
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
  acct(); if (++questTick % 15 === 0) renderQuest(); if (typeof drawViz === 'function') try { drawViz(rawDt); } catch (e) {}
  if (S.phase === 'fireworks') { drawFireworks(rawDt); requestAnimationFrame(frame); return; }
  if (S.phase === 'graveyard') { drawGraveyard(rawDt); requestAnimationFrame(frame); return; }
  if (S.phase === 'intro') { drawIntro(rawDt); if (S.introT > 6500) S.phase = 'roll'; requestAnimationFrame(frame); return; }
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
function begin() { if (S.phase === 'intro') S.phase = 'roll'; if (S.phase !== 'roll') return; S.phase = 'walk'; S.walkT = 0; S.nextEnc = 5; chronicle(`The party gathered: ${S.party.map((h) => `${h.name} ${h.epi} (${h.race} ${h.cls})`).join(', ')}.`); setStatus(); }
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
    if (GY.t > 1500) { const gt = (GY.t - 1500 - i * 400) / 1000; if (gt > 0) { g.save(); g.globalAlpha = Math.max(0, 0.55 - gt * 0.06); g.drawImage(h.sprite, x + 18 + Math.sin(gt * 2 + i) * 4, y - 24 - gt * 9, HW, HH); g.restore(); } }
    void sink;
  });
  // rain
  g.fillStyle = C[14]; GY.rain.forEach((r) => { r[1] += r[2] * dt / 16; r[0] -= 0.6 * dt / 16; if (r[1] > H) { r[1] = -4; r[0] = ri(0, W + 40); } g.fillRect(Math.round(r[0]), Math.round(r[1]), 1, 4); });
  box(40, 4, 240, 30, 0, 2);
  txt('THE PARTY HAS PERISHED', W / 2, 9, 10, 'center');
  txt(S.dir === 'short' ? 'THE MUSIC ENDED TOO SOON' : 'THEY LINGERED TOO LONG', W / 2, 22, 15, 'center', 6);
  if (dirge.blocked() && Math.floor(GY.t / 600) % 2) txt('CLICK FOR THE FUNERAL MARCH', W / 2, 190, 7, 'center', 6);
  else if (GY.t > 8000) txt('CLICK TO RISE AGAIN', W / 2, 190, 15, 'center', 6);
}
cv.addEventListener('click', () => {
  if (S.phase === 'intro') { S.phase = 'roll'; return; }
  if (S.phase === 'graveyard') { if (dirge.blocked()) { dirge.resume(); return; } if (GY.t > 8000) { dirge.stop(); S.party.forEach((h) => { h.alive = true; h.hp = h.max; }); S.phase = 'walk'; } return; } if (S.phase === 'roll') { rollParty(); } else if (S.phase === 'fireworks' && FW.t > 6000) { S.party.forEach((h) => { h.alive = true; h.fell = false; h.hp = h.max; }); S.phase = 'walk'; } });
document.addEventListener('keydown', (e) => { if (S.phase === 'roll' && e.key === 'Enter' && !/input|select|textarea/i.test(e.target.tagName)) { e.preventDefault(); begin(); } });
root.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
  root.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  root.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('on', p.dataset.panel === b.dataset.tab));
  MODE = b.dataset.tab;
}));
root.querySelectorAll('[data-pace]').forEach((b) => b.addEventListener('click', () => { S.pace = +b.dataset.pace; root.querySelectorAll('[data-pace]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
$('#pq-new').addEventListener('click', () => { if (S.songs.length && !confirmNew()) return; resetAll(); });
function confirmNew() { return window.confirm ? window.confirm('Start over with a new party? This quest will end.') : true; }
function resetAll() { dirge.stop(); Object.assign(S, { phase: 'intro', introT: 0, gold: 0, foes: [], bestiary: [], songs: [], curSong: -1, log: [], chronicle: [], deaths: 0, battles: 0, wins: 0, started: Date.now(), anim: null, banner: null, ended: false, simFrom: null, bigBattle: null, result: null }); FW.parts = []; rollParty(); renderSongs(); setStatus(); $('#pq-sheet').classList.remove('show'); $('#pq-sheetbar').classList.remove('on'); }
let MODE = 'sp';
// any music starting begins the quest if the party is still being rolled
function musicStarted(title) {
  if (S.ended) return;
  if (S.songs.length >= MAXSONGS) { endSession(true); return; } // a seventh song means the six are done
  if (S.phase === 'roll' || S.phase === 'intro') begin(); songStart(title);
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
function makeStory() {
  const P = S.party, names = (a) => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  const out = [], first = S.songs[0], slain = S.bestiary.reduce((t, b) => t + b.slain, 0);
  out.push(`${names(P.map((h) => `${h.name} the ${h.race} ${h.cls}`))} set out${first ? ` to the sound of "${first.title}"` : ''}.`);
  out.push(`Across ${S.songs.length} song${S.songs.length === 1 ? '' : 's'} they fought ${S.battles} battle${S.battles === 1 ? '' : 's'} and slew ${slain} monsters.`);
  const big = P.filter((h) => h.best).sort((a, b) => b.best.dm - a.best.dm)[0]; if (big) out.push(`The mightiest blow belonged to ${big.name}, who struck the ${big.best.foe} for ${big.best.dm}${S.songs[big.best.song] ? ` during "${S.songs[big.best.song].title}"` : ''}.`);
  if (S.bigBattle && S.bigBattle.n >= 4) out.push(`Their biggest fight was against ${S.bigBattle.n} foes led by the ${S.bigBattle.name}.`);
  const tough = S.bestiary.slice().sort((a, b) => b.lvl * b.mult - a.lvl * a.mult)[0]; if (tough && tough.mult >= 1.6) out.push(`The most fearsome creature met was the ${tough.size.toLowerCase()} ${tough.name}${tough.slain ? `, brought down by ${Object.keys(tough.slainBy)[0]}` : ', which escaped'}.`);
  const killer = P.slice().sort((a, b) => b.kills - a.kills)[0]; if (killer && killer.kills) out.push(`${killer.name} slew the most (${killer.kills}) and reached level ${killer.lvl}.`);
  const close = P.filter((h) => h.close).sort((a, b) => b.close - a.close)[0]; if (close) out.push(`${close.name} survived ${close.close > 1 ? close.close + ' near-deaths' : 'a near-death'}${close.closeFoe ? `, once at the claws of the ${close.closeFoe}` : ''}.`);
  const downs = P.filter((h) => h.downs).sort((a, b) => b.downs - a.downs)[0]; if (downs) out.push(`${downs.name} was struck down ${downs.downs > 1 ? downs.downs + ' times' : 'once'}${downs.downBy ? ` (last by the ${downs.downBy})` : ''} but rose again.`);
  if (S.deaths) out.push(`When hope ran out, the Temple of the Fish raised the whole party ${S.deaths > 1 ? S.deaths + ' times' : 'once'}.`);
  const fell = P.filter((h) => h.fell).map((h) => h.name), lived = P.filter((h) => !h.fell).map((h) => h.name);
  if (S.result === 'perfect') out.push(`The music ended at exactly the right moment. All four reached the castle and the sky burst into fireworks.`);
  else if (S.result === 'won') out.push(`All four reached the castle as the last song faded.`);
  else if (S.result === 'partial') out.push(`At the end, ${names(fell)} perished on the road. ${names(lived)} reached the castle and carved their names at the gate.`);
  else if (S.result === 'lost') out.push(`When the sixth song ended the music was ${S.dir === 'short' ? 'too short' : 'too long'}, and the whole party perished. Their stones stand in the rain.`);
  else out.push('Their journey continues.');
  return out.join(' ');
}
function makeSheet() {
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
  const bars = (h) => { const lv = S.songs.map((_, i) => h.lvlBySong[i] || h.lvl); lv.push(h.lvl); const mx = Math.max(...lv); return `<span class="lv" title="Level by song">${lv.map((v) => `<i style="height:${Math.max(3, 22 * v / mx)}px"></i>`).join('')}</span>`; };
  const party = S.party.map((h) => `<tr><td><img src="${spriteURL(h.sprite, 3)}" width="42" height="54" alt=""></td><td><b>${h.fell ? '✝ ' : ''}${esc(upper(h.name))}</b><br><span class="sub">${h.fell ? 'PERISHED AT THE END' : esc(h.epi)}</span></td><td>${esc(h.race)}<br>${esc(h.cls)}</td><td>LV ${h.lvl}<br>${bars(h)}</td><td>HP ${h.max}<br>KILLS ${h.kills}</td><td>STR ${h.stats.STR} DEX ${h.stats.DEX} CON ${h.stats.CON}<br>INT ${h.stats.INT} WIS ${h.stats.WIS} CHA ${h.stats.CHA}</td></tr>`).join('');
  const songs = S.songs.map((s, i) => { const lines = S.chronicle.filter((c) => c.song === i).map((c) => c.text).slice(0, 3); return `<li><b>${esc(s.title)}</b> <span class="sub">(${fmt(s.secs)})</span>${s.foes.length ? `<br><span class="sub">Faced: ${esc([...new Set(s.foes)].join(', '))}</span>` : ''}${lines.length ? `<br><span class="sub">${esc(lines.join(' '))}</span>` : ''}</li>`; }).join('');
  const best = S.bestiary.map((t) => { const by = Object.entries(t.slainBy).sort((a, b) => b[1] - a[1])[0]; const sc = Math.max(2, Math.round(48 / t.sprite.h)); return `<div class="card"><img src="${spriteURL(t.sprite.img, sc)}" alt=""><b>${esc(upper(t.name))}</b><small>${esc(t.desc)}<br>LV ${t.lvl} · ${t.slain ? `SLAIN ×${t.slain}${by ? ' BY ' + esc(upper(by[0])) : ''}` : 'ESCAPED'}</small></div>`; }).join('');
  $('#pq-sheet').innerHTML = `
    <h1>PHANTASEA SESSIONS</h1><div class="sub">${MOTTO} · SIX SONGS IS ALL YOU GET</div><div class="sub">THE CHRONICLE OF ${esc(upper(S.party.map((h) => h.name).join(', ')))} · ${esc(upper(date))} · ${mins} MIN · ${S.songs.length} SONGS</div>
    <h2>THE PARTY</h2><table>${party}</table>
    <h2>THE TALE${S.simFrom != null ? ' (SIMULATED FROM SONG ' + (S.simFrom + 1) + ')' : ''}</h2><p style="font-size:8px;line-height:1.9;margin:0">${esc(makeStory())}</p>
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
  S.party.forEach((h) => { h.alive = true; h.fell = false; });
  if (r !== 'none' && r !== 'perfect') { const order = S.party.slice().sort(() => rnd() - 0.5); order.slice(0, S.fallenN).forEach((h) => { h.alive = false; h.hp = 0; h.fell = true; }); }
  const fallen = S.party.filter((h) => h.fell).map((h) => h.name);
  if (r === 'perfect') { startFireworks(true); chronicle('A perfect ending. The castle lit up in fireworks.'); }
  else if (r === 'won') { startFireworks(false); chronicle('The whole party survived the six songs and reached the castle.'); }
  else if (r === 'partial') { startFireworks(false); chronicle(`${fallen.join(', ')} perished on the road; the rest reached the castle.`); }
  else if (r === 'lost') { startGraveyard(); chronicle('The music ran out and the whole party perished.'); }
  makeSheet(); renderQuest();
  if (!document.fullscreenElement && !$('#pq-tv').classList.contains('full')) cv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
$('#pq-endbtn').addEventListener('click', () => endSession(false));
function simulateToEnd() {
  if (S.ended) return; if (!S.songs.length) { alertNote('Play at least one song first, then simulate.'); return; }
  acct(); setPlaying(false); if (ctrl && ctrl.pause) try { ctrl.pause(); } catch (e) {}
  const cur = S.songs[S.curSong];
  // the pace so far (time heard ÷ songs so far) carries on for every song that's left
  const L = totalSecs() / S.songs.length;
  const heard = Math.max(60, totalSecs()), perSec = Math.max(S.battles, 1) / heard;
  S.simFrom = S.songs.length - 1;
  const fightOne = () => {
    encounter(); let guard = 0;
    while (S.phase === 'battle' && guard++ < 800) { battleStep(); if (S.anim) { const a = S.anim; S.anim = null; resolveAnim(a); } }
    if (S.phase === 'temple') S.party.forEach((h) => { h.alive = true; h.hp = h.max; });
    S.phase = 'walk'; S.foes = [];
  };
  // finish the current song's share of fights, then the rest
  const curFights = Math.max(0, Math.round(perSec * cur.secs) - cur.foes.length); for (let k = 0; k < curFights; k++) fightOne();
  while (S.songs.length < MAXSONGS) {
    const len = L;
    S.songs.push({ title: `Simulated song ${S.songs.length + 1}`, foes: [], at: Date.now(), secs: len, uri: null, sim: true }); S.curSong = S.songs.length - 1;
    S.party.forEach((h) => { h.lvlBySong[S.curSong] = h.lvl; });
    const n = Math.max(1, Math.round(perSec * len)); for (let k = 0; k < n; k++) fightOne();
  }
  S.floaters = []; S.log = []; S.banner = null; renderSongs();
  endSession(false);
}
$('#pq-sim').addEventListener('click', simulateToEnd);
function questBlock() {
  const r = questResult(), t = totalSecs(), n = S.songs.length;
  const fallen = S.party.filter((h) => h.fell).map((h) => upper(h.name)), by = S.dir === 'short' ? 'THE MUSIC RAN SHORT' : 'THE MUSIC RAN LONG';
  const msg = { perfect: '★ A PERFECT ENDING! THE CASTLE LIT UP IN FIREWORKS ★', won: `THE WHOLE PARTY REACHED THE CASTLE (${by})`, partial: `${S.party.length - fallen.length} OF ${S.party.length} REACHED THE CASTLE · ✝ ${fallen.join(', ')} (${by})`, lost: `✝ THE WHOLE PARTY PERISHED (${by})`, none: 'THE QUEST WAS NOT ATTEMPTED' }[r];
  return `<div class="q"><b>${msg}</b><br><span class="sub">TIME HEARD ${fmt(t)} IN ${n} SONG${n === 1 ? '' : 'S'}${r === 'none' ? '' : ' · HINT: THE LIMITS OF REGULAR NOTES IN SIX SONGS.'}</span></div>`;
}
/* ---------- the fireworks castle movie ---------- */
const FW = { parts: [], t: 0, next: 0, stars: [] };
function startFireworks(perfect) {
  S.phase = 'fireworks'; FW.perfect = perfect; FW.t = 0; FW.parts = []; FW.next = perfect ? 0 : 1500;
  FW.stars = Array.from({ length: 70 }, () => [ri(0, W), ri(0, 120), ri(0, 3)]);
  // one song at random to celebrate: one they heard if Spotify knows it, otherwise a random Like The Fish playlist
  FW.title = S.result === 'partial' ? 'THE FALLEN ARE REMEMBERED' : 'THE WHOLE PARTY SURVIVED SIX SONGS';
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
  const rect = (x, y, w, h, c) => { g.fillStyle = h > 8 ? vgrad(y, y + h, [tint(c, 0.22), c, tint(c, -0.4)]) : c; g.fillRect(x, y, w, h); };
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
  let gi = 0;
  S.party.forEach((h, i) => {
    if (h.fell) { const x = 8 + gi * 36; gi++; g.fillStyle = '#000'; g.fillRect(x - 1, 145, 20, 24); g.fillStyle = C[12]; g.fillRect(x, 150, 18, 18); g.fillRect(x + 3, 146, 12, 5); g.fillStyle = C[15]; g.fillRect(x + 1, 151, 1, 15); txt('RIP', x + 9, 153, 0, 'center', 6); txtO(upper(h.name).slice(0, 5), x + 9, 173, '#d8d0ff', 'center', 6); return; }
    const jump = Math.abs(Math.sin(FW.t / 220 + i * 1.3)) * 6; shadow(112 + i * 32 + (i > 1 ? 16 : 0), 168, HW); g.drawImage(h.sprite, 102 + i * 32 + (i > 1 ? 16 : 0), 142 - jump, HW, HH);
  });
  box(20, 4, 280, 30, 0, 7);
  txt(FW.perfect ? '★ A PERFECT ENDING! ★' : S.result === 'partial' ? `${S.party.filter((h) => !h.fell).length} OF ${S.party.length} REACHED THE CASTLE` : 'QUEST COMPLETE!', W / 2, 9, Math.floor(FW.t / 250) % 2 ? 7 : 1, 'center');
  txt(upper(FW.title).slice(0, 40), W / 2, 22, 3, 'center', 6);
  if (FW.t > 6000) txt('CLICK TO RETURN', W / 2, 190, 15, 'center', 6);
}
$('#pq-print').addEventListener('click', () => window.print());
$('#pq-c64').addEventListener('click', (e) => { const on = $('#pq-sheet').classList.toggle('c64'); e.currentTarget.setAttribute('aria-pressed', String(on)); });
$('#pq-keep').textContent = 'Back to the game';
$('#pq-keep').addEventListener('click', () => { if (S.phase === 'graveyard') { dirge.stop(); S.party.forEach((h) => { h.alive = true; h.hp = h.max; }); } if (S.phase === 'fireworks' || S.phase === 'graveyard') { S.party.forEach((h) => { h.alive = true; h.fell = false; h.hp = h.max; }); S.phase = 'walk'; } $('#pq-sheet').classList.remove('show'); $('#pq-sheetbar').classList.remove('on'); cv.scrollIntoView({ behavior: 'smooth' }); });

/* ---------- full screen ---------- */
const tv = $('#pq-tv');
/* ---------- full-screen visualizer around the game: Standard / Fire / Lightning / Weather / Sky ---------- */
const VZ = { modes: ['STANDARD', 'FIRE', 'LIGHTNING', 'WEATHER', 'SKY'], mode: 0, spec: new Float32Array(40), peak: new Float32Array(40), level: 0, bass: 0, treb: 0, beat: 0, bavg: 0.1, lastBeat: 0, bpm: 118, ph: 0, t: 0, mic: null, fbuf: null, fire: null, fw: 0, fh: 0, bolts: [], flash: 0, parts: [], skyT: 0.25, stars: null };
const vcv = document.createElement('canvas'); vcv.id = 'pq-viz'; vcv.setAttribute('aria-hidden', 'true');
const vg = vcv.getContext('2d');
function vizSource() { return (VZ.mic && VZ.mic.an) || (mic && mic.an) || null; }
function vizAudio(dt) {
  VZ.t += dt; const an = vizSource(), n = VZ.spec.length, raw = new Float32Array(n);
  if (an) {
    if (!VZ.fbuf || VZ.fbuf.length !== an.frequencyBinCount) VZ.fbuf = new Uint8Array(an.frequencyBinCount);
    an.getByteFrequencyData(VZ.fbuf); const B = VZ.fbuf.length;
    for (let i = 0; i < n; i++) { const a = Math.floor(Math.pow(i / n, 2) * B * 0.7) + 1, b = Math.max(a + 1, Math.floor(Math.pow((i + 1) / n, 2) * B * 0.7) + 1); let s = 0; for (let k = a; k < b; k++) s += VZ.fbuf[k]; raw[i] = clamp(s / (b - a) / 210 * (1 + i / n * 0.8), 0, 1); }
  } else if (S.playing) {
    VZ.ph += dt / 1000 * VZ.bpm / 60; const fr = VZ.ph % 1, kick = Math.exp(-fr * 3.5), hat = Math.exp(-((VZ.ph * 2) % 1) * 8), t = VZ.t / 1000;
    for (let i = 0; i < n; i++) { const f = i / n, wob = 0.5 + 0.5 * Math.sin(t * (0.35 + f * 0.8) + i * 0.6) * Math.sin(t * 0.22 + i * 0.25); raw[i] = clamp((0.62 - f * 0.4) * (0.45 + 0.55 * wob) + (f < 0.18 ? kick * 0.28 : 0) + (f > 0.7 ? hat * 0.1 : 0) + (S.energy - 0.5) * 0.2, 0, 1); }
  }
  let lv = 0, bs = 0, tr = 0; for (let i = 0; i < n; i++) { { const up = 1 - Math.pow(0.55, dt / 16), dn = 1 - Math.pow(0.95, dt / 16); VZ.spec[i] += (raw[i] - VZ.spec[i]) * (raw[i] > VZ.spec[i] ? up : dn); } VZ.peak[i] = Math.max(VZ.spec[i], VZ.peak[i] - dt * 0.00022); lv += VZ.spec[i]; if (i < 6) bs += VZ.spec[i]; if (i > n * 0.65) tr += VZ.spec[i]; }
  VZ.level = lv / n; VZ.smooth = VZ.smooth || new Float32Array(n); for (let i = 0; i < n; i++) VZ.smooth[i] += (VZ.spec[i] - VZ.smooth[i]) * Math.min(1, dt / 600); VZ.bass = bs / 6; VZ.treb = tr / (n * 0.35);
  VZ.bavg = VZ.bavg * 0.97 + VZ.bass * 0.03; VZ.beat = Math.max(0, VZ.beat - dt / 300);
  if (VZ.bass > VZ.bavg * 1.25 + 0.06 && VZ.t - VZ.lastBeat > 450) { VZ.lastBeat = VZ.t; VZ.beat = 1; vizOnBeat(); }
}
function vizOnBeat() { if (VZ.modes[VZ.mode] === 'LIGHTNING' && VZ.t - (VZ.lastBolt || -1e9) > 2600 && Math.random() < 0.6) { VZ.lastBolt = VZ.t; VZ.flash = 1; VZ.bolts.push(makeBolt()); } }
function vizRects() {
  const tr = tv.getBoundingClientRect(), gr = cv.getBoundingClientRect(), s = vcv.width / Math.max(1, tr.width);
  return { gx: (gr.left - tr.left) * s, gy: (gr.top - tr.top) * s, gw: gr.width * s, gh: gr.height * s, W: vcv.width, H: vcv.height };
}
function vizResize() { const w = Math.ceil(innerWidth / 4), h = Math.ceil(innerHeight / 4); if (vcv.width !== w || vcv.height !== h) { vcv.width = w; vcv.height = h; VZ.fire = null; VZ.stars = null; } }
function makeBolt() {
  const R = vizRects(), side = Math.floor(Math.random() * 4); let x, y;
  if (side === 0) { x = Math.random() * R.W; y = 0; } else if (side === 1) { x = R.W; y = Math.random() * R.H; } else if (side === 2) { x = Math.random() * R.W; y = R.H; } else { x = 0; y = Math.random() * R.H; }
  const tx = clamp(x, R.gx, R.gx + R.gw), ty = clamp(y, R.gy, R.gy + R.gh), pts = [[x, y]], segs = 14;
  for (let i = 1; i <= segs; i++) { const k = i / segs; pts.push([x + (tx - x) * k + (Math.random() - 0.5) * 18 * (1 - k * 0.6), y + (ty - y) * k + (Math.random() - 0.5) * 18 * (1 - k * 0.6)]); }
  const branch = pts.slice(3, 8).map(([a, b]) => [a + (Math.random() - 0.5) * 30, b + (Math.random() - 0.5) * 30]);
  return { pts, branch: [pts[3], ...branch], life: 380 };
}
const WA = ['#00c800', '#20d800', '#58e000', '#98e800', '#d8e800', '#f8d000', '#f8a000', '#f86000', '#f82800'];
function drawVizStandard(R, dt) {
  { const gr = vg.createRadialGradient(R.gx + R.gw / 2, R.gy + R.gh / 2, 10, R.gx + R.gw / 2, R.gy + R.gh / 2, Math.max(R.W, R.H) * 0.7); gr.addColorStop(0, `rgba(30,70,50,${0.55 + VZ.smooth[3] * 0.3})`); gr.addColorStop(1, '#04050a'); vg.fillStyle = gr; vg.fillRect(0, 0, R.W, R.H); }
  vg.fillStyle = 'rgba(60,90,120,.18)'; for (let x = 0; x < R.W; x += 6) vg.fillRect(x, 0, 1, R.H); for (let y = 0; y < R.H; y += 6) vg.fillRect(0, y, R.W, 1);
  const n = VZ.spec.length, sides = [
    { len: R.gy, along: R.W, at: (i, w) => [i * w, R.gy], dir: [0, -1] },
    { len: R.H - R.gy - R.gh, along: R.W, at: (i, w) => [i * w, R.gy + R.gh], dir: [0, 1] },
    { len: R.gx, along: R.H, at: (i, w) => [R.gx, i * w], dir: [-1, 0] },
    { len: R.W - R.gx - R.gw, along: R.H, at: (i, w) => [R.gx + R.gw, i * w], dir: [1, 0] }];
  sides.forEach((sd, si) => {
    if (sd.len < 3) return; const bars = Math.max(8, Math.floor(sd.along / 6)), w = sd.along / bars;
    for (let i = 0; i < bars; i++) {
      const b = Math.floor(Math.abs(((i + 0.5) / bars) * 2 - 1) * (n - 1)), v = VZ.spec[(si % 2 ? n - 1 - b : b)], pk = VZ.peak[(si % 2 ? n - 1 - b : b)];
      const segs = Math.floor(v * sd.len / 2.5), [x0, y0] = sd.at(i, w);
      { const gl = Math.min(sd.len, sd.len * (0.25 + v * 0.9)); vg.fillStyle = `rgba(80,230,120,${0.07 + v * 0.12})`; if (sd.dir[0] === 0) vg.fillRect(x0, sd.dir[1] < 0 ? y0 - gl : y0, w, gl); else vg.fillRect(sd.dir[0] < 0 ? x0 - gl : x0, y0, gl, w); }
      for (let k = 0; k < segs; k++) { vg.fillStyle = WA[Math.min(WA.length - 1, Math.floor(k / Math.max(1, sd.len / 2.5) * WA.length))]; const d = 1 + k * 2.5; if (sd.dir[0] === 0) vg.fillRect(x0 + 0.5, y0 + sd.dir[1] * d - (sd.dir[1] < 0 ? 2 : 0), w - 1, 2); else vg.fillRect(x0 + sd.dir[0] * d - (sd.dir[0] < 0 ? 2 : 0), y0 + 0.5, 2, w - 1); }
      const pd = 1 + Math.floor(pk * sd.len / 2.5) * 2.5; vg.fillStyle = '#d8d8f0'; if (sd.dir[0] === 0) vg.fillRect(x0 + 0.5, y0 + sd.dir[1] * pd - (sd.dir[1] < 0 ? 1 : 0), w - 1, 1); else vg.fillRect(x0 + sd.dir[0] * pd, y0 + 0.5, 1, w - 1);
    }
  });
  // oscilloscope ring hugging the game frame
  vg.strokeStyle = 'rgba(120,255,160,.85)'; vg.lineWidth = 1; vg.beginPath(); const per = 2 * (R.gw + R.gh), steps = 260;
  for (let i = 0; i <= steps; i++) { let d = i / steps * per, x, y, nx, ny; if (d < R.gw) { x = R.gx + d; y = R.gy; nx = 0; ny = -1; } else if ((d -= R.gw) < R.gh) { x = R.gx + R.gw; y = R.gy + d; nx = 1; ny = 0; } else if ((d -= R.gh) < R.gw) { x = R.gx + R.gw - d; y = R.gy + R.gh; nx = 0; ny = 1; } else { d -= R.gw; x = R.gx; y = R.gy + R.gh - d; nx = -1; ny = 0; } const a = 3 + Math.sin(i * 0.22 + VZ.t / 700) * VZ.smooth[i % VZ.smooth.length] * 7; if (i) vg.lineTo(x + nx * a, y + ny * a); else vg.moveTo(x + nx * a, y + ny * a); }
  vg.stroke();
}
const FIREPAL = (() => { const p = []; for (let i = 0; i < 37; i++) { const t = i / 36; p.push(t < 0.25 ? [Math.round(t * 4 * 160), 0, 0] : t < 0.55 ? [160 + Math.round((t - 0.25) / 0.3 * 95), Math.round((t - 0.25) / 0.3 * 120), 0] : t < 0.85 ? [255, 120 + Math.round((t - 0.55) / 0.3 * 120), Math.round((t - 0.55) / 0.3 * 40)] : [255, 240, 40 + Math.round((t - 0.85) / 0.15 * 215)]); } return p; })();
function drawVizFire(R) {
  const w = R.W, h = R.H; if (!VZ.fire || VZ.fw !== w || VZ.fh !== h) { VZ.fire = new Uint8Array(w * h); VZ.fw = w; VZ.fh = h; VZ.img = vg.createImageData(w, h); }
  VZ.fireTick = !VZ.fireTick; if (VZ.fireTick) { vg.putImageData(VZ.img, 0, 0); return; }
  const f = VZ.fire, heat = Math.round(20 + VZ.smooth.reduce((a, b) => a + b, 0) / VZ.smooth.length * 16 + VZ.beat * 3);
  for (let x = 0; x < w; x++) { const v = Math.min(36, Math.round(heat * (0.75 + 0.25 * Math.sin(x * 0.3 + VZ.t / 200)) * (0.7 + VZ.smooth[Math.floor(x / w * VZ.smooth.length)] * 0.6))); f[(h - 1) * w + x] = v; }
  const gy = Math.floor(R.gy) - 1; if (gy > 2) for (let x = Math.floor(R.gx); x < R.gx + R.gw; x++) f[gy * w + x] = Math.min(36, Math.round(heat * 0.85 * (0.5 + VZ.spec[Math.floor((x - R.gx) / R.gw * VZ.spec.length)] * 0.8)));
  for (const sx of [Math.floor(R.gx) - 1, Math.ceil(R.gx + R.gw)]) if (sx > 0 && sx < w) for (let y = Math.floor(R.gy); y < R.gy + R.gh; y++) f[y * w + sx] = Math.min(36, Math.round(heat * 0.8));
  for (const sx of [0, 1, 2, w - 3, w - 2, w - 1]) for (let y = Math.floor(h * 0.08); y < h; y++) f[y * w + sx] = Math.min(36, Math.round(heat * (0.55 + 0.25 * Math.sin(y * 0.07 + VZ.t / 900))));
  const cool = 0.2 + (1 - VZ.level) * 0.22;
  for (let y = 1; y < h; y++) for (let x = 0; x < w; x++) { const src = y * w + x, v = f[src]; if (!v) { f[src - w] = 0; continue; } const rn = Math.random(), dx = Math.round(rn * 3) - 1; const dst = src - w + dx; if (dst >= 0) f[dst] = Math.max(0, v - (rn < cool ? 1 : 0)); }
  const d = VZ.img.data, pulse = 0.8 + VZ.smooth[2] * 0.4; for (let i = 0; i < w * h; i++) { const v = f[i]; if (v < 3) { const yk = Math.floor(i / w) / h, bg = yk * yk; d[i * 4] = Math.min(255, (18 + 70 * bg) * pulse) | 0; d[i * 4 + 1] = (4 + 14 * bg * pulse) | 0; d[i * 4 + 2] = (8 + 6 * bg) | 0; } else { const c = FIREPAL[v]; d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; } d[i * 4 + 3] = 255; }
  vg.putImageData(VZ.img, 0, 0);
}
function drawVizLightning(R, dt) {
  const t = VZ.t / 1000; vg.fillStyle = vgradOn(vg, 0, R.H, ['#06061a', '#141838', '#1c1430']); vg.fillRect(0, 0, R.W, R.H);
  for (let i = 0; i < 26; i++) { const x = ((i * 53 + t * (2 + i % 3)) % (R.W + 120)) - 60, y = (i * 37) % (R.H * 0.95); vg.fillStyle = `rgba(${60 + VZ.flash * 150},${70 + VZ.flash * 150},${110 + VZ.flash * 140},.35)`; vg.beginPath(); vg.ellipse(x, y, 42 + (i % 4) * 12, 12 + (i % 3) * 4, 0, 0, 7); vg.ellipse(x + 20, y - 6, 26, 10, 0, 0, 7); vg.fill(); }
  if (VZ.flash > 0) { vg.fillStyle = `rgba(200,210,255,${VZ.flash * 0.3})`; vg.fillRect(0, 0, R.W, R.H); VZ.flash = Math.max(0, VZ.flash - dt / 650); }
  vg.fillStyle = 'rgba(150,170,230,.5)'; for (let i = 0; i < 80 + VZ.level * 120; i++) { const x = (i * 97 + t * 40 * (1 + i % 3)) % R.W, y = (i * 61 + t * 220 * (1 + (i % 4) * 0.3)) % R.H; vg.fillRect(Math.floor(x), Math.floor(y), 1, 3); }
  VZ.bolts = VZ.bolts.filter((b) => (b.life -= dt) > 0);
  VZ.bolts.forEach((b) => { const a = b.life / 380; [[4, `rgba(140,160,255,${a * 0.35})`], [2, `rgba(200,210,255,${a * 0.8})`], [1, `rgba(255,255,255,${a})`]].forEach(([wd, col]) => { vg.strokeStyle = col; vg.lineWidth = wd; vg.beginPath(); b.pts.forEach(([x, y], i) => i ? vg.lineTo(x, y) : vg.moveTo(x, y)); vg.stroke(); vg.beginPath(); b.branch.forEach(([x, y], i) => i ? vg.lineTo(x, y) : vg.moveTo(x, y)); vg.stroke(); }); });
  // soft electric glow travelling around the frame, brighter with treble
  { const per = 2 * (R.gw + R.gh), glow = 0.15 + VZ.smooth[30] * 0.5; vg.strokeStyle = `rgba(150,190,255,${glow})`; vg.lineWidth = 2; vg.strokeRect(R.gx - 1.5, R.gy - 1.5, R.gw + 3, R.gh + 3);
    for (let i = 0; i < 6; i++) { let d = ((VZ.t / 9 + i * per / 6) % per), x, y; if (d < R.gw) { x = R.gx + d; y = R.gy; } else if ((d -= R.gw) < R.gh) { x = R.gx + R.gw; y = R.gy + d; } else if ((d -= R.gh) < R.gw) { x = R.gx + R.gw - d; y = R.gy + R.gh; } else { d -= R.gw; x = R.gx; y = R.gy + R.gh - d; }
      const g2 = vg.createRadialGradient(x, y, 0, x, y, 7); g2.addColorStop(0, `rgba(220,235,255,${0.5 + glow})`); g2.addColorStop(1, 'rgba(150,190,255,0)'); vg.fillStyle = g2; vg.fillRect(x - 7, y - 7, 14, 14); } }
}
function vgradOn(ctx, y0, y1, stops) { const gr = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function drawVizWeather(R, dt) {
  const t = VZ.t / 1000; VZ.stormK = VZ.stormK == null ? 0 : VZ.stormK; const tgtS = VZ.level > 0.42 ? 1 : VZ.level < 0.3 ? 0 : VZ.stormK > 0.5 ? 1 : 0; VZ.stormK += (tgtS - VZ.stormK) * Math.min(1, dt / 2500); const storm = VZ.stormK > 0.5; VZ.wind = (VZ.wind || 0) + (((VZ.smooth[10] - 0.3) * 2.5 + Math.sin(t * 0.25) * 0.6) - (VZ.wind || 0)) * Math.min(1, dt / 1500); const wind = VZ.wind;
  { const k = VZ.stormK; vg.fillStyle = vgradOn(vg, 0, R.H, [mix('#7c8ca8', '#2c3448', k), mix('#b0bccc', '#4c5868', k), mix('#d8dee8', '#6c7480', k)]); } vg.fillRect(0, 0, R.W, R.H);
  for (let i = 0; i < 10; i++) { const x = ((i * 71 + t * (8 + wind * 6)) % (R.W + 100)) - 50, y = 4 + (i * 13) % (R.H * 0.3); vg.fillStyle = storm ? 'rgba(40,46,60,.7)' : 'rgba(255,255,255,.8)'; vg.beginPath(); vg.ellipse(x, y, 34, 9, 0, 0, 7); vg.ellipse(x + 18, y - 5, 18, 8, 0, 0, 7); vg.fill(); }
  const want = Math.floor(160 + VZ.smooth.reduce((a, b) => a + b, 0) / VZ.smooth.length * 420); while (VZ.parts.length < want) VZ.parts.push({ x: Math.random() * R.W, y: Math.random() * R.H, v: 0.5 + Math.random(), s: Math.random() });
  VZ.parts.length = Math.min(VZ.parts.length, want);
  VZ.parts.forEach((p) => {
    if (storm) { p.y += dt * 0.25 * p.v; p.x += dt * 0.05 * wind; vg.fillStyle = 'rgba(180,200,240,.75)'; vg.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 4); }
    else { p.y += dt * 0.03 * p.v; p.x += dt * 0.02 * (wind + Math.sin(t * 2 + p.s * 9)); vg.fillStyle = '#ffffff'; vg.fillRect(Math.floor(p.x), Math.floor(p.y), p.s > 0.6 ? 2 : 1, p.s > 0.6 ? 2 : 1); }
    if (p.y > R.H || (p.y > R.gy && p.y < R.gy + 3 && p.x > R.gx && p.x < R.gx + R.gw && p.s < 0.3)) { if (storm && p.y < R.H) { vg.fillStyle = 'rgba(200,220,255,.8)'; vg.fillRect(p.x - 1, R.gy - 1, 3, 1); } p.y = -4; p.x = Math.random() * (R.W + 40) - 20; }
    if (p.x > R.W + 20) p.x -= R.W + 40; if (p.x < -20) p.x += R.W + 40;
  });
  vg.fillStyle = storm ? '#3c4450' : '#f0f4fa'; for (let x = 0; x < R.W; x += 2) { const hgt = 3 + Math.sin(x * 0.1) * 1.5 + (storm ? VZ.spec[Math.floor(x / R.W * 40)] * 6 : 2); vg.fillRect(x, R.H - hgt, 2, hgt); }
}
function drawVizSky(R, dt) {
  VZ.skyT = (VZ.skyT + dt / 1000 * (0.0035 + VZ.level * 0.004)) % 1; const T = VZ.skyT, day = Math.sin(T * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
  const top = mix('#060820', '#2a6cd8', day), mid = mix('#1c1640', T > 0.5 ? '#f08c58' : '#7ab0f0', day), bot = mix('#2a1c40', T > 0.5 ? '#ffd090' : '#c8e4ff', day);
  vg.fillStyle = vgradOn(vg, 0, R.H, [top, mid, bot]); vg.fillRect(0, 0, R.W, R.H);
  if (!VZ.stars) VZ.stars = Array.from({ length: 160 }, () => [Math.random() * R.W, Math.random() * R.H * 0.8, Math.random()]);
  if (day < 0.5) VZ.stars.forEach(([x, y, s], i) => { const tw = (0.5 + VZ.smooth[i % 40] * 0.9) * (1 - day * 2); vg.fillStyle = `rgba(255,255,255,${clamp(tw * (0.3 + s), 0, 1)})`; vg.fillRect(Math.floor(x), Math.floor(y), s > 0.85 ? 2 : 1, s > 0.85 ? 2 : 1); });
  // aurora at night: the spectrum as curtains
  if (day < 0.45) for (let b = 0; b < 3; b++) { vg.beginPath(); for (let x = 0; x <= R.W; x += 3) { const i = Math.floor(x / R.W * 39), y = R.H * (0.18 + b * 0.08) + Math.sin(x * 0.03 + VZ.t / 4000 + b) * 8; vg.moveTo(x, y); vg.lineTo(x, y + 6 + VZ.smooth[i] * 34); } vg.strokeStyle = [`rgba(80,255,170,${0.35 * (1 - day * 2)})`, `rgba(120,160,255,${0.3 * (1 - day * 2)})`, `rgba(220,120,255,${0.25 * (1 - day * 2)})`][b]; vg.lineWidth = 2; vg.stroke(); }
  const ang = T * Math.PI * 2, cxs = R.W / 2 + Math.cos(ang - Math.PI / 2) * R.W * 0.48, cys = R.H * 0.9 + Math.sin(ang - Math.PI / 2) * R.H * 0.82;
  const sunR = 10 + VZ.smooth[2] * 5, gl = vg.createRadialGradient(cxs, cys, 1, cxs, cys, sunR * 3); gl.addColorStop(0, 'rgba(255,250,210,1)'); gl.addColorStop(0.3, 'rgba(255,220,120,.7)'); gl.addColorStop(1, 'rgba(255,180,80,0)'); vg.fillStyle = gl; vg.fillRect(cxs - sunR * 3, cys - sunR * 3, sunR * 6, sunR * 6);
  const mx = R.W / 2 - Math.cos(ang - Math.PI / 2) * R.W * 0.48, my = R.H * 0.9 - Math.sin(ang - Math.PI / 2) * R.H * 0.82; vg.fillStyle = '#f0f0ff'; vg.beginPath(); vg.arc(mx, my, 8, 0, 7); vg.fill(); vg.fillStyle = 'rgba(180,180,210,.6)'; vg.beginPath(); vg.arc(mx + 2, my + 2, 2, 0, 7); vg.arc(mx - 3, my - 1, 1.5, 0, 7); vg.fill();
  for (let i = 0; i < 8; i++) { const x = ((i * 89 + VZ.t / 1000 * (0.8 + VZ.level * 1.2) * (1 + (i % 3) * 0.35)) % (R.W + 120)) - 60, y = R.H * 0.08 + (i * 29) % (R.H * 0.5); vg.fillStyle = `rgba(255,255,255,${0.25 + day * 0.6})`; vg.beginPath(); vg.ellipse(x, y, 26 + (i % 3) * 8, 7, 0, 0, 7); vg.ellipse(x + 14, y - 4, 14, 7, 0, 0, 7); vg.fill(); }
  vg.fillStyle = mix('#0c0818', '#2c5c3c', day); for (let x = 0; x < R.W; x++) { const h = 8 + Math.sin(x * 0.02) * 5 + Math.sin(x * 0.07) * 3 + VZ.smooth[Math.floor(x / R.W * 40)] * 6; vg.fillRect(x, R.H - h, 1, h); }
}
function drawViz(dt) {
  vizAudio(dt); if (!isFull()) return;
  vizResize(); const R = vizRects(), m = VZ.modes[VZ.mode];
  if (m === 'STANDARD') drawVizStandard(R, dt); else if (m === 'FIRE') drawVizFire(R); else if (m === 'LIGHTNING') drawVizLightning(R, dt); else if (m === 'WEATHER') drawVizWeather(R, dt); else drawVizSky(R, dt);
}
function vizNext() { VZ.mode = (VZ.mode + 1) % VZ.modes.length; VZ.parts = []; VZ.bolts = []; $('#pq-vzmode').textContent = '◐ ' + VZ.modes[VZ.mode] + ' ▸'; }
async function vizMicToggle() {
  const b = $('#pq-vzmic');
  if (VZ.mic) { VZ.mic.stream.getTracks().forEach((t) => t.stop()); VZ.mic.ctx.close(); VZ.mic = null; b.textContent = '🎤 Sync visuals to room sound'; return; }
  try { const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); const ctx = new (window.AudioContext || window.webkitAudioContext)(), an = ctx.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0.6; ctx.createMediaStreamSource(stream).connect(an); VZ.mic = { stream, ctx, an }; b.textContent = '🎤 Hearing the room ✓'; }
  catch (e) { b.textContent = '🎤 Microphone blocked'; }
}

tv.insertBefore(vcv, tv.firstChild);
$('#pq-vzmode').addEventListener('click', (e) => { e.stopPropagation(); vizNext(); });
$('#pq-vzmic').addEventListener('click', (e) => { e.stopPropagation(); vizMicToggle(); });
vcv.addEventListener('click', () => vizNext());

function isFull() { return tv.classList.contains('full'); }
function setFull(on) {
  if (on === isFull()) return;
  tv.classList.toggle('full', on); renderQuest();
  if (on) { if (tv.requestFullscreen) tv.requestFullscreen().catch(() => {}); else if (tv.webkitRequestFullscreen) tv.webkitRequestFullscreen(); }
  else if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}
$('#pq-fs').addEventListener('click', () => setFull(true)); $('#pq-fs2').addEventListener('click', (e) => { e.stopPropagation(); setFull(true); });
$('#pq-fsx').addEventListener('click', () => setFull(false));
cv.addEventListener('dblclick', () => setFull(!isFull()));
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && isFull()) { tv.classList.remove('full'); } });
document.addEventListener('keydown', (e) => { if (/input|select|textarea/i.test(e.target.tagName)) return; if (e.key === 'f' || e.key === 'F') setFull(!isFull()); if ((e.key === 'v' || e.key === 'V') && isFull()) vizNext(); if (e.key === 'Escape' && isFull()) setFull(false); });

/* ---------- go ---------- */
rollParty(); setStatus(); renderQuest();
if (document.fonts) document.fonts.load('8px "Press Start 2P"').catch(() => {});
requestAnimationFrame(frame);
window.__pq = { S, simulateToEnd, makeStory, newMonsterType, newHero, endSession, setFull, dirge, startFireworks, questResult, totalSecs, renderQuest, musicStarted, setPlaying, makeSheet, encounter, begin };
})();
