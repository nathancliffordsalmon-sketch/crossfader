
(() => {
'use strict';
const cv = document.getElementById('cv'), g = cv.getContext('2d');
const W = 320, H = 200;
g.imageSmoothingEnabled = false;

/* ---------- C64-ish palette ---------- */
const P = { black:'#000000', white:'#ffffff', red:'#813338', cyan:'#75cec8', purple:'#8e3c97', green:'#56ac4d', blue:'#2e2c9b', yellow:'#edf171',
  orange:'#8e5029', brown:'#553800', lred:'#c46c71', dgrey:'#4a4a4a', grey:'#7b7b7b', lgreen:'#a9ff9f', lblue:'#706deb', lgrey:'#b2b2b2',
  pink:'#c46c71', skin:'#c46c71', skin2:'#8e5029', gold:'#edf171', sky:'#75cec8' };
const PAL = ['#000000','#ffffff','#813338','#75cec8','#8e3c97','#56ac4d','#2e2c9b','#edf171','#8e5029','#553800','#c46c71','#4a4a4a','#7b7b7b','#a9ff9f','#706deb','#b2b2b2'].map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
const LUT = new Uint8Array(32768);
for (let i = 0; i < 32768; i++) { const r = ((i >> 10) & 31) * 8 + 4, gg = ((i >> 5) & 31) * 8 + 4, b = (i & 31) * 8 + 4; let best = 0, bd = 1e9; PAL.forEach((c, k) => { const d = (c[0] - r) ** 2 * 0.3 + (c[1] - gg) ** 2 * 0.59 + (c[2] - b) ** 2 * 0.11; if (d < bd) { bd = d; best = k; } }); LUT[i] = best; }
// C64 multicolour look: every pair of pixels becomes one wide pixel in one of the 16 colours
function quantize() { const im = g.getImageData(0, 0, W, H), d = im.data; for (let i = 0; i < d.length; i += 8) { const r = (d[i] + d[i + 4]) >> 1, gg = (d[i + 1] + d[i + 5]) >> 1, b = (d[i + 2] + d[i + 6]) >> 1; const c = PAL[LUT[((r >> 3) << 10) | ((gg >> 3) << 5) | (b >> 3)]]; d[i] = d[i + 4] = c[0]; d[i + 1] = d[i + 5] = c[1]; d[i + 2] = d[i + 6] = c[2]; d[i + 3] = d[i + 7] = 255; } g.putImageData(im, 0, 0); }
const CLOTH = [ ['RED','#813338'], ['PINK','#c46c71'], ['PURPLE','#8e3c97'], ['BLUE','#2e2c9b'], ['SKY','#706deb'], ['CYAN','#75cec8'], ['GREEN','#56ac4d'], ['YELLOW','#edf171'], ['BLACK','#000000'], ['WHITE','#ffffff'] ];
const PATS = ['PLAIN','STRIPES','DOTS','CHECKS','FLOWERS','STARS'];
const HAIRCOL = [ ['BROWN','#553800'], ['BLONDE','#edf171'], ['BLACK','#000000'], ['AUBURN','#8e5029'], ['PINK','#c46c71'] ];

/* ---------- text ---------- */
let fontOK = false;
document.fonts && document.fonts.load('8px "Press Start 2P"').then(() => { fontOK = true; }).catch(() => {});
let DEFER = false; const TQ = [];
function txt(s, x, y, col, size, align) { s = String(s).toUpperCase(); if (DEFER) { TQ.push([s, x, y, col, size, align, g.getTransform()]); return; } g.font = (size || 8) + 'px "Press Start 2P", monospace'; g.fillStyle = col || P.white; g.textAlign = align || 'left'; g.textBaseline = 'top'; g.fillText(s, x, y); }
function txtS(s, x, y, col, size, align, sh) { txt(s, x + 1, y + 1, sh || P.black, size, align); txt(s, x, y, col, size, align); }
function wrap(s, n) { const out = []; let line = ''; for (const w of String(s).split(' ')) { if ((line + ' ' + w).trim().length > n) { out.push(line.trim()); line = w; } else line += ' ' + w; } if (line.trim()) out.push(line.trim()); return out; }
function box(x, y, w, h, fill, edge) { g.fillStyle = edge || P.white; g.fillRect(x, y, w, h); g.fillStyle = fill || P.blue; g.fillRect(x + 2, y + 2, w - 4, h - 4); }

/* ---------- sound (SID-ish beeps) ---------- */
let ac = null, soundOn = true, voiceOn = true;
function audio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
function beep(f, d, type, vol, when) { if (!soundOn) return; const a = audio(); if (!a) return; const t = a.currentTime + (when || 0); const o = a.createOscillator(), v = a.createGain(); o.type = type || 'square'; o.frequency.setValueAtTime(f, t); v.gain.setValueAtTime(vol || 0.06, t); v.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(v); v.connect(a.destination); o.start(t); o.stop(t + d + 0.02); }
function tune(notes, step, type) { notes.forEach((n, i) => { if (n) beep(n, step * 0.9, type || 'square', 0.05, i * step); }); }
const N = { C4:262, D4:294, E4:330, F4:349, G4:392, A4:440, B4:494, C5:523, D5:587, E5:659, F5:698, G5:784, A5:880 };
function ringPhone() { for (let i = 0; i < 6; i++) { beep(i % 2 ? 1300 : 1500, 0.05, 'square', 0.04, i * 0.06); } }
function doorbell() { beep(N.E5, 0.5, 'triangle', 0.09, 0); beep(N.C5, 0.7, 'triangle', 0.09, 0.45); }
function engine() { for (let i = 0; i < 10; i++) beep(70 + (i % 3) * 8, 0.08, 'sawtooth', 0.03, i * 0.07); }
function click() { beep(1200, 0.03, 'square', 0.03); }
/* the theme: an original, slow, sparkly chiptune (Am F C G | Am F G E), triangle bass arpeggios and an echoing square lead */
let musicOn = true;
const LEAD = [[69,2],[72,1],[76,1],[81,4], [79,1],[77,1],[76,2],[72,4], [76,2],[79,2],[84,2],[83,1],[81,1], [79,4],[74,1],[79,1],[83,2],
              [81,2],[76,1],[81,1],[84,2],[83,2], [81,1],[79,1],[77,2],[81,4], [83,2],[86,2],[83,1],[79,1],[74,2], [76,4],[80,2],[83,2]];
const CHORDS = [[45,52,57,60], [41,48,53,57], [48,55,60,64], [43,50,55,59], [45,52,57,60], [41,48,53,57], [43,50,55,59], [40,47,52,56]];
const ARP = [0, 1, 2, 3, 2, 1, 0, 1];
const LEAD_AT = {}; (() => { let st = 0; LEAD.forEach(([n, d]) => { LEAD_AT[st] = [n, d]; st += d; }); })();
const STEP = 60 / 108 / 2; // one eighth note at 108 bpm
const mus = { t: 0, step: 0, running: false };
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
function note(f, t, dur, type, vol, vib) {
  const a = ac, o = a.createOscillator(), v = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = 5.5; lg.gain.value = f * 0.012; l.connect(lg); lg.connect(o.frequency); l.start(t + 0.12); l.stop(t + dur + 0.05); }
  v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(vol, t + 0.02); v.gain.setValueAtTime(vol, t + Math.max(0.03, dur - 0.08)); v.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);
  o.connect(v); v.connect(a.destination); o.start(t); o.stop(t + dur + 0.15);
}
function musicWanted() { return musicOn && soundOn && S.scene !== 'date' && S.scene !== 'event'; }
setInterval(() => {
  if (!ac || ac.state !== 'running') return;
  if (!musicWanted()) { mus.running = false; return; }
  if (!mus.running) { mus.running = true; mus.t = ac.currentTime + 0.1; mus.step = 0; }
  const duck = window.speechSynthesis && speechSynthesis.speaking ? 0.35 : 1;
  while (mus.t < ac.currentTime + 0.35) {
    const st = mus.step % 64, bar = Math.floor(st / 8), ch = CHORDS[bar];
    note(hz(ch[ARP[st % 8]]), mus.t, STEP * 0.6, 'triangle', 0.045 * duck);
    if (st % 2 === 1) note(2600, mus.t, 0.02, 'square', 0.004 * duck); // a light tick on the off-beats
    const ln = LEAD_AT[st];
    if (ln) { const d = ln[1] * STEP; note(hz(ln[0]), mus.t, d * 0.85, 'square', 0.017 * duck, true); note(hz(ln[0]), mus.t + STEP * 3, d * 0.7, 'square', 0.005 * duck, false); }
    if (st % 8 === 0) note(hz(ch[0] + 24), mus.t, STEP * 6, 'triangle', 0.012 * duck); // soft chord bell
    mus.t += STEP; mus.step++;
  }
}, 60);
function sayVoice(s, low) { if (!voiceOn || !window.speechSynthesis) return; try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(s); u.rate = 0.95; u.pitch = low ? 0.6 : 1.3; window.speechSynthesis.speak(u); } catch (e) {} }

/* ---------- the wardrobe ---------- */
// slot: dress | top | bottom | shoes | acc ; tags = which dates it suits
const ITEMS = {
  gown:     { slot:'dress', name:'BALL GOWN',     tags:['ball'] },
  sundress: { slot:'dress', name:'SUNDRESS',      tags:['reunion','concert'] },
  tee:      { slot:'top', name:'NERDY TEE',       tags:['trivia'] },
  bandtee:  { slot:'top', name:'BAND TEE',        tags:['concert'] },
  flannel:  { slot:'top', name:'FLANNEL',         tags:['concert','trivia'] },
  sweater:  { slot:'top', name:'COZY SWEATER',    tags:['reunion'] },
  cardigan: { slot:'top', name:'CARDIGAN',        tags:['reunion','trivia'] },
  blazer:   { slot:'top', name:'BLAZER',          tags:['trivia'] },
  jeans:    { slot:'bottom', name:'JEANS',        tags:['trivia','concert','reunion'] },
  cutoffs:  { slot:'bottom', name:'CUTOFFS',      tags:['concert'] },
  khakis:   { slot:'bottom', name:'KHAKIS',       tags:['reunion','trivia'] },
  leggings: { slot:'bottom', name:'LEGGINGS',     tags:['reunion'] },
  sneakers: { slot:'shoes', name:'SNEAKERS',      tags:['trivia','reunion'] },
  boots:    { slot:'shoes', name:'COWBOY BOOTS',  tags:['concert'] },
  flats:    { slot:'shoes', name:'FLATS',         tags:['reunion','trivia'] },
  slippers: { slot:'shoes', name:'GLASS SLIPPERS',tags:['ball'] },
  heels:    { slot:'shoes', name:'HEELS',         tags:['ball','trivia'] },
  glasses:  { slot:'acc', name:'SMART GLASSES',   tags:['trivia'] },
  hat:      { slot:'acc', name:'COWBOY HAT',      tags:['concert'] },
  tiara:    { slot:'acc', name:'TIARA',           tags:['ball'] },
  dice:     { slot:'acc', name:'DICE EARRINGS',   tags:['reunion'] },
};
const HAIR = { down:{ name:'DOWN', tags:[] }, pony:{ name:'PONYTAIL', tags:['trivia'] }, braid:{ name:'BRAID', tags:['reunion'] }, curls:{ name:'BIG CURLS', tags:['concert'] }, updo:{ name:'UPDO', tags:['ball'] } };

const STORES = [
  { id:'home',    name:'HOME',          x:24,  y:46,  col:P.lred,   roof:P.red },
  { id:'boutique',name:'BOUTIQUE',      x:98,  y:46,  col:P.pink,   roof:P.purple, items:['gown','sundress'] },
  { id:'denim',   name:'DENIM BARN',    x:172, y:46,  col:P.lblue,  roof:P.blue,   items:['tee','bandtee','flannel','jeans','cutoffs'] },
  { id:'knits',   name:'COZY KNITS',    x:246, y:46,  col:P.yellow, roof:P.orange, items:['sweater','cardigan','blazer','khakis','leggings'] },
  { id:'shoes',   name:'SHOE SHOP',     x:60,  y:128, col:P.lgreen, roof:P.green,  items:['sneakers','boots','flats','slippers','heels'] },
  { id:'glitter', name:'GLITTER & GLASS',x:142,y:128, col:P.cyan,   roof:P.blue,   items:['glasses','hat','tiara','dice'] },
  { id:'salon',   name:'HAIR SALON',    x:224, y:128, col:P.pink,   roof:P.lred,   hair:true },
];
const ROAD_Y = 110;

const DATES = {
  trivia:  { name:'BAR TRIVIA NIGHT', place:'THE ANCHOR PUB',
    clues:['Bring that big brain of yours. I need a teammate who knows every capital city.', 'Wear something that says: I know which year the Berlin Wall fell.', 'We need a team name. I was thinking Quiz Khalifa.'] },
  reunion: { name:'FAMILY REUNION', place:"AUNT DEB'S BACKYARD",
    clues:["Aunt Deb is bringing her famous potato salad, and the Monopoly board is coming out.", 'Wear something comfy. You might be sitting on the floor for three rounds of Scrabble.', 'Practice your game face. Uncle Gary still says he won Trouble in 1998.'] },
  concert: { name:'TRAILER PARK CONCERT', place:'SUNNY ACRES TRAILER PARK',
    clues:["Bring a lawn chair. The band is setting up beside Darrell's double-wide.", 'Hope you like fiddles, fireflies and a stage made of pallets.', 'Wear something you can stomp around in. The dirt dance floor gets wild.'] },
  ball:    { name:'ROYAL BALL', place:'THE GRAND BALLROOM',
    clues:['Ever waltzed under a chandelier? Tonight you will.', 'Dress like royalty, and try to keep both shoes on until midnight.', 'There will be a string quartet, a staircase and a pumpkin-coloured car.'] },
};
const DATE_KEYS = Object.keys(DATES);

/* ---------- state ---------- */
const S = { scene:'title', t:0, his:'JD DALE', time:0, deadline:60, date:'trivia', clue:'', loc:'home', won:{}, misses:0, day:1,
  outfit:null, store:null, sel:'top', events:[], evCount:0, changed:false, msg:null, car:null, ev:null, result:null, typed:0, callDone:false };
function freshOutfit() { return { dress:null, top:{ id:'tee', c:'#e3c341', p:1 }, bottom:{ id:'jeans', c:'#5066d6', p:0 }, shoes:{ id:'sneakers', c:'#ffffff', p:0 }, acc:null, hair:'down', hairCol:'#6b3f1d' }; }
S.outfit = freshOutfit();
function hisName() { const v = (document.getElementById('his').value || '').trim().toUpperCase(); return v || 'JD DALE'; }
function clock(m) { const total = 13 * 60 + Math.floor(m), h = Math.floor(total / 60), mm = total % 60; return ((h - 1) % 12 + 1) + ':' + (mm < 10 ? '0' : '') + mm + ' PM'; }
const ticks = {};
function every(key, period) { const k = Math.floor(S.t / period); if (ticks[key + S.scene] === k) return false; ticks[key + S.scene] = k; return true; }
const onceSet = {};
function once(key) { if (onceSet[key]) return false; onceSet[key] = 1; return true; }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

function newDay() {
  const left = DATE_KEYS.filter((k) => !S.won[k]);
  S.date = pick(left.length ? left : DATE_KEYS);
  S.clue = pick(DATES[S.date].clues);
  S.time = 0; S.deadline = 60; S.loc = 'home'; S.events = ['twins','baby','dog','jd'].sort(() => Math.random() - 0.5); S.evCount = 0; S.changed = false;
  S.callDone = false; S.typed = 0; S.result = null; S.ev = null; S.car = null; S.msg = null;
  S.outfit.acc = null; // she starts each day in her everyday clothes
  S.outfit.dress = null; S.outfit.top = { id:'tee', c:'#e3c341', p:1 }; S.outfit.bottom = { id:'jeans', c:'#5066d6', p:0 }; S.outfit.shoes = { id:'sneakers', c:'#ffffff', p:0 }; S.outfit.hair = 'down';
  go('home');
}
function go(scene) { S.scene = scene; S.t = 0; S.typed = 0; for (const k in ticks) delete ticks[k]; for (const k in onceSet) delete onceSet[k]; }

/* ---------- patterns ---------- */
const patCache = {};
function fillFor(color, pat) {
  if (!pat) return color;
  const key = color + pat; if (patCache[key]) return patCache[key];
  const c = document.createElement('canvas'); c.width = 8; c.height = 8; const x = c.getContext('2d');
  x.fillStyle = color; x.fillRect(0, 0, 8, 8);
  const light = ['#ffffff', '#edf171', '#a9ff9f', '#75cec8', '#b2b2b2'].includes(color);
  x.fillStyle = light ? '#2e2c9b' : '#ffffff';
  if (pat === 1) { x.fillRect(0, 0, 8, 2); }
  if (pat === 2) { x.fillRect(0, 0, 2, 2); x.fillRect(4, 4, 2, 2); }
  if (pat === 3) { x.fillRect(0, 0, 4, 4); x.fillRect(4, 4, 4, 4); }
  if (pat === 4) { x.fillRect(2, 0, 2, 2); x.fillRect(0, 2, 6, 2); x.fillRect(2, 4, 2, 2); x.fillStyle = '#edf171'; x.fillRect(2, 2, 2, 2); }
  if (pat === 5) { x.fillRect(2, 0, 2, 6); x.fillRect(0, 2, 6, 2); }
  return (patCache[key] = g.createPattern(c, 'repeat'));
}
function poly(pts, fill) { g.fillStyle = fill; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); }
function ell(x, y, rx, ry, fill) { g.fillStyle = fill; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); }
function rect(x, y, w, h, fill) { g.fillStyle = fill; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

/* shadow and highlight shade for each fabric colour (all from the C64 palette) */
const SHADE = { '#813338':['#553800','#c46c71'], '#c46c71':['#813338','#ffffff'], '#8e3c97':['#2e2c9b','#c46c71'], '#2e2c9b':['#000000','#706deb'], '#706deb':['#2e2c9b','#75cec8'],
  '#75cec8':['#706deb','#ffffff'], '#56ac4d':['#553800','#a9ff9f'], '#edf171':['#8e5029','#ffffff'], '#000000':['#000000','#4a4a4a'], '#ffffff':['#b2b2b2','#ffffff'] };
const shade = (c) => SHADE[c] || ['#4a4a4a', '#ffffff'];
/* ---------- Jessica ---------- */
// cx = centre, y0 = top of head; about 150 px tall at s = 1
function drawJess(cx, y0, o, opts) {
  opts = opts || {};
  const s = opts.s || 1;
  g.save(); g.translate(cx, y0); g.scale(s, s);
  const sk = P.skin, hc = o.hairCol, dr = o.dress && ITEMS[o.dress.id], top = o.top && ITEMS[o.top.id];
  const F = (it) => fillFor(it.c, it.p);
  const bounce = opts.bounce || 0;
  g.translate(0, -bounce);
  // hair behind
  if (o.hair === 'down') rect(-12, 4, 24, 34, hc);
  if (o.hair === 'curls') { for (let i = 0; i < 7; i++) ell(-13 + (i % 2) * 26, 10 + i * 5, 6, 6, hc); ell(0, 8, 15, 14, hc); }
  if (o.hair === 'braid') { for (let i = 0; i < 7; i++) ell(10 + (i % 2), 22 + i * 6, 3.5, 3.5, hc); }
  if (o.hair === 'pony') { poly([[8, 4], [18, 10], [16, 34], [11, 30]], hc); }
  // legs
  rect(-8, 64, 7, 76, sk); rect(1, 64, 7, 76, sk);
  // arms
  const longSleeve = top && ['flannel','sweater','cardigan','blazer'].includes(o.top.id) && !dr;
  rect(-19, 30, 6, 46, sk); rect(13, 30, 6, 46, sk);
  ell(-16, 78, 3.5, 3.5, sk); ell(16, 78, 3.5, 3.5, sk);
  // neck + head
  rect(-3, 20, 6, 10, sk);
  ell(0, 12, 10, 12, sk);
  // face
  rect(-5, 11, 2, 3, '#2a1a3a'); rect(3, 11, 2, 3, '#2a1a3a');
  rect(-5, 10, 2, 1, '#000'); rect(3, 10, 2, 1, '#000');
  rect(-3, 18, 6, 1, '#c0392b'); rect(-2, 19, 4, 1, '#c0392b');
  rect(-8, 15, 3, 2, 'rgba(232,120,140,.55)'); rect(5, 15, 3, 2, 'rgba(232,120,140,.55)');
  // hair front
  if (o.hair === 'updo') { ell(0, -4, 9, 7, hc); ell(0, 3, 11, 6, hc); }
  else { poly([[-11, 10], [-10, 0], [0, -2], [10, 0], [11, 10], [6, 4], [-4, 5]], hc); }
  if (o.hair === 'pony') { rect(8, 4, 3, 3, '#e88fc0'); }
  // bottoms
  if (!dr && o.bottom) {
    const b = o.bottom, f = F(b);
    if (b.id === 'cutoffs') { rect(-9, 60, 18, 22, f); for (let i = -9; i < 9; i += 2) rect(i, 82, 1, 2, '#ffffff'); }
    else if (b.id === 'leggings') { rect(-9, 60, 9, 78, f); rect(0, 60, 9, 78, f); }
    else { rect(-10, 60, 10, 80, f); rect(0, 60, 10, 80, f); rect(-1, 62, 2, 76, shade(b.c)[0]); rect(6, 62, 3, 76, shade(b.c)[0]); rect(-9, 62, 2, 76, shade(b.c)[1]); if (b.id === 'jeans') { rect(-10, 60, 20, 3, 'rgba(0,0,0,.25)'); } }
  }
  // shoes
  if (o.shoes) {
    const sh = o.shoes, f = F(sh);
    if (sh.id === 'boots') { rect(-10, 118, 10, 24, f); rect(0, 118, 10, 24, f); rect(-10, 140, 11, 4, '#3a2410'); rect(0, 140, 11, 4, '#3a2410'); rect(-7, 124, 4, 1, '#f2d14b'); rect(3, 124, 4, 1, '#f2d14b'); }
    else if (sh.id === 'sneakers') { rect(-11, 136, 11, 6, f); rect(0, 136, 11, 6, f); rect(-11, 141, 11, 2, '#ffffff'); rect(0, 141, 11, 2, '#ffffff'); }
    else if (sh.id === 'slippers') { const sp = 'rgba(190,235,255,.85)'; rect(-10, 137, 10, 5, sp); rect(0, 137, 10, 5, sp); if (Math.floor(S.t / 300) % 2) { rect(-6, 135, 1, 1, '#fff'); rect(5, 136, 1, 1, '#fff'); } }
    else if (sh.id === 'heels') { rect(-10, 137, 10, 4, f); rect(0, 137, 10, 4, f); rect(-10, 141, 2, 3, f); rect(8, 141, 2, 3, f); }
    else { rect(-10, 138, 10, 4, f); rect(0, 138, 10, 4, f); }
  }
  // dress or top
  if (dr) {
    const f = F(o.dress), [dk, lt] = shade(o.dress.c);
    if (o.dress.id === 'gown') {
      // skirt: wide bell with folds, a lit left side and a ruffled hem
      poly([[-9, 58], [9, 58], [40, 140], [-40, 140]], f);
      for (const k of [-2.6, -1.2, 1.2, 2.6]) { const x0 = k * 3, x1 = k * 12; poly([[x0, 80], [x0 + 1, 80], [x1 + 2, 138], [x1 - 1, 138]], dk); }
      poly([[-8, 62], [-7, 62], [-31, 136], [-34, 136]], lt);
      for (let i = -40; i < 40; i += 8) ell(i + 4, 141, 5, 3, f), ell(i + 4, 142, 3, 1.5, dk);
      // fitted bodice with a sweetheart neckline and a sash
      poly([[-13, 30], [-6, 27], [0, 31], [6, 27], [13, 30], [9, 60], [-9, 60]], f);
      poly([[-11, 32], [-8, 31], [-6, 58], [-9, 58]], lt);
      rect(-9, 56, 18, 4, dk); rect(-2, 55, 4, 6, lt);
      // sparkles that twinkle
      for (let i = 0; i < 9; i++) { const sx = -30 + ((i * 23) % 60), sy = 76 + ((i * 37) % 60); if ((Math.floor(S.t / 220) + i) % 4 === 0) { rect(sx, sy, 2, 2, '#ffffff'); rect(sx - 2, sy, 1, 2, '#ffffff'); rect(sx + 3, sy, 1, 2, '#ffffff'); } }
    } else {
      // sundress: straps, gathered waist, swingy skirt with folds
      poly([[-12, 31], [12, 31], [9, 58], [-9, 58]], f);
      rect(-10, 26, 2, 6, f); rect(8, 26, 2, 6, f);
      poly([[-9, 58], [9, 58], [24, 100], [-24, 100]], f);
      for (const k of [-1.5, 1.5]) poly([[k * 3, 70], [k * 3 + 1, 70], [k * 10 + 2, 99], [k * 10 - 1, 99]], dk);
      poly([[-8, 60], [-5, 60], [-18, 99], [-22, 99]], lt);
      rect(-9, 56, 18, 3, dk); for (let i = -24; i < 24; i += 6) rect(i, 99, 4, 2, lt);
    }
  } else if (o.top) {
    const t = o.top, f = F(t), [tdk, tlt] = shade(t.c);
    poly([[-14, 28], [14, 28], [11, 62], [-11, 62]], f);
    poly([[8, 29], [14, 29], [11, 61], [7, 61]], tdk); rect(-12, 30, 3, 28, tlt);
    if (longSleeve) { rect(-20, 29, 7, 46, f); rect(13, 29, 7, 46, f); }
    else { rect(-20, 29, 7, 12, f); rect(13, 29, 7, 12, f); }
    if (t.id === 'bandtee') { poly([[1, 36], [-4, 46], [0, 46], [-2, 54], [5, 42], [1, 42]], '#f2d14b'); }
    if (t.id === 'tee') { rect(-6, 38, 12, 9, 'rgba(0,0,0,.25)'); txt('?', -3, 38, '#ffffff', 8); }
    if (t.id === 'flannel') { for (let i = 30; i < 62; i += 6) rect(-13, i, 26, 1, 'rgba(0,0,0,.3)'); for (let i = -12; i < 12; i += 6) rect(i, 29, 1, 32, 'rgba(0,0,0,.3)'); }
    if (t.id === 'sweater') { rect(-14, 58, 28, 4, 'rgba(0,0,0,.2)'); rect(-20, 70, 7, 5, 'rgba(0,0,0,.2)'); rect(13, 70, 7, 5, 'rgba(0,0,0,.2)'); rect(-5, 28, 10, 3, 'rgba(0,0,0,.2)'); }
    if (t.id === 'cardigan') { rect(-4, 29, 8, 33, '#ffffff'); rect(-1, 36, 2, 2, '#888'); rect(-1, 46, 2, 2, '#888'); }
    if (t.id === 'blazer') { poly([[-4, 28], [4, 28], [0, 46]], '#ffffff'); poly([[-6, 28], [-1, 44], [-8, 36]], 'rgba(0,0,0,.3)'); poly([[6, 28], [1, 44], [8, 36]], 'rgba(0,0,0,.3)'); }
  }
  // accessories
  if (o.acc) {
    const a = o.acc;
    if (a.id === 'glasses') { g.strokeStyle = '#111'; g.lineWidth = 1; g.strokeRect(-7.5, 9.5, 5, 5); g.strokeRect(2.5, 9.5, 5, 5); rect(-2, 11, 4, 1, '#111'); }
    if (a.id === 'hat') { const f = F(a); ell(0, -1, 18, 4, f); rect(-9, -10, 18, 9, f); rect(-9, -3, 18, 2, '#3a2410'); }
    if (a.id === 'tiara') { const gold = '#f2d14b'; rect(-8, -2, 16, 2, gold); poly([[-6, -2], [-4, -7], [-2, -2]], gold); poly([[-2, -2], [0, -9], [2, -2]], gold); poly([[2, -2], [4, -7], [6, -2]], gold); rect(-1, -6, 2, 2, '#e88fc0'); }
    if (a.id === 'dice') { rect(-12, 16, 4, 4, '#ffffff'); rect(8, 16, 4, 4, '#ffffff'); rect(-11, 17, 1, 1, '#000'); rect(-9, 19, 1, 1, '#000'); rect(10, 18, 1, 1, '#000'); }
  }
  g.restore();
}

/* ---------- him ---------- */
function drawHim(cx, y0, s, bounce) {
  g.save(); g.translate(cx, y0 - (bounce || 0)); g.scale(s || 1, s || 1);
  rect(-8, 64, 7, 76, '#2c3e70'); rect(1, 64, 7, 76, '#2c3e70');
  rect(-9, 138, 9, 5, '#2a1a10'); rect(0, 138, 9, 5, '#2a1a10');
  poly([[-15, 28], [15, 28], [12, 64], [-12, 64]], '#3a6fb0');
  rect(-21, 29, 7, 44, '#3a6fb0'); rect(14, 29, 7, 44, '#3a6fb0');
  ell(-18, 76, 3.5, 3.5, P.skin2); ell(18, 76, 3.5, 3.5, P.skin2);
  rect(-3, 20, 6, 10, P.skin2); ell(0, 12, 10, 12, P.skin2);
  poly([[-11, 8], [-9, -1], [0, -3], [9, -1], [11, 8], [7, 3], [-5, 4]], '#3a2410');
  rect(-5, 11, 2, 3, '#1a1a1a'); rect(3, 11, 2, 3, '#1a1a1a'); rect(-3, 18, 6, 1, '#7a2a20');
  poly([[-3, 28], [3, 28], [0, 40]], '#ffffff');
  g.restore();
}

/* ---------- scenery helpers ---------- */
function stars(n, seed) { let a = seed || 7; for (let i = 0; i < n; i++) { a = (a * 9301 + 49297) % 233280; const x = a % W; a = (a * 9301 + 49297) % 233280; const y = a % 90; rect(x, y, 1, 1, (Math.floor(S.t / 400) + i) % 5 ? '#ffffff' : '#bfce72'); } }
function hud() {
  rect(0, 0, W, 12, '#000');
  txt('JESSICA', 4, 2, P.pink, 8);
  txt(clock(S.time), W - 4, 2, S.deadline - S.time <= 10 ? (Math.floor(S.t / 300) % 2 ? P.yellow : P.red) : P.yellow, 8, 'right');
  txt('DATE ' + clock(S.deadline).replace(' PM', ''), 150, 2, P.cyan, 8, 'center');
}
function clueBar() {
  rect(0, 186, W, 14, '#000');
  const c = '"' + S.clue + '"';
  const off = (S.t / 40) % (c.length * 8 + W);
  g.save(); g.beginPath(); g.rect(0, 186, W, 14); g.clip();
  txt('CLUE: ' + c, W - off, 189, P.lgreen, 8);
  g.restore();
}

/* ---------- clickable regions ---------- */
let hits = [], focus = 0;
function button(label, x, y, w, h, fn, opts) {
  opts = opts || {};
  const idx = hits.length, isF = idx === focus, hover = mouse && mouse.x >= x && mouse.x < x + w && mouse.y >= y && mouse.y < y + h;
  box(x, y, w, h, opts.fill || (hover || isF ? P.purple : P.blue), opts.edge || (hover || isF ? P.yellow : P.white));
  txt(label, x + w / 2, y + Math.round(h / 2) - 4, opts.col || P.white, opts.size || 8, 'center');
  hits.push({ x, y, w, h, fn });
}
function hot(x, y, w, h, fn) { hits.push({ x, y, w, h, fn, invisible: true }); }
let mouse = null;
function toLocal(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
cv.addEventListener('mousemove', (e) => { mouse = toLocal(e); kbUsed = false; });
cv.addEventListener('mouseleave', () => { mouse = null; });
cv.addEventListener('pointerdown', (e) => { audio(); const p = toLocal(e); mouse = p; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h) { click(); h.fn(); return; } } if (onAny) onAny(); });
let onAny = null, kbUsed = false;
document.addEventListener('keydown', (e) => {
  kbUsed = true;
  if (e.key === 'Escape') { e.preventDefault(); restart(); return; }
  if (S.scene === 'drive' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); S.drv.dir = e.key === 'ArrowLeft' ? -1 : 1; S.drv.stopped = false; return; }
  if (e.target && e.target.tagName === 'INPUT') return;
    if (['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)) { e.preventDefault(); if (!hits.length) return; const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1; focus = (focus + d + hits.length) % hits.length; click(); }
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); audio(); const h = hits[focus]; if (h) { click(); h.fn(); } else if (onAny) onAny(); }
});
function restart() { if (window.speechSynthesis) speechSynthesis.cancel(); S.won = {}; S.day = 1; S.misses = 0; S.outfit = freshOutfit(); S.loc = 'home'; S.drv = null; focus = 0; go('title'); }
document.getElementById('rst').addEventListener('click', restart);
document.getElementById('mus').addEventListener('click', (e) => { audio(); musicOn = !musicOn; e.target.textContent = 'MUSIC: ' + (musicOn ? 'ON' : 'OFF'); });
document.getElementById('snd').addEventListener('click', (e) => { soundOn = !soundOn; e.target.textContent = 'SOUND: ' + (soundOn ? 'ON' : 'OFF'); });
document.getElementById('spk').addEventListener('click', (e) => { voiceOn = !voiceOn; e.target.textContent = 'VOICE: ' + (voiceOn ? 'ON' : 'OFF'); if (!voiceOn && window.speechSynthesis) speechSynthesis.cancel(); });

/* ---------- scenes ---------- */
const TITLE_COLS = ['#e88fc0', '#b86962', '#bfce72', '#94e089', '#67b6bd', '#7869c4', '#8b3f96'];
function drawTitle() {
  rect(0, 0, W, H, P.blue); stars(40, 3);
  // rainbow bars
  for (let i = 0; i < 7; i++) rect(0, 118 + i * 3, W, 2, TITLE_COLS[(i + Math.floor(S.t / 120)) % 7]);
  // JESSICA in big chunky letters, each letter bobbing
  const word = 'JESSICA';
  for (let i = 0; i < word.length; i++) {
    const x = 26 + i * 40, y = 34 + Math.round(Math.sin(S.t / 260 + i * 0.7) * 4);
    txt(word[i], x + 3, y + 3, '#000', 32);
    txt(word[i], x, y, TITLE_COLS[(i + Math.floor(S.t / 500)) % 7], 32);
  }
  txtS('HAPPY BIRTHDAY LITTLE SIS', W / 2, 84, '#ffffff', 8, 'center');
  // little hearts
  for (let i = 0; i < 3; i++) { const hx = 92 + i * 68, hy = 98 + Math.round(Math.sin(S.t / 300 + i) * 2); rect(hx, hy, 3, 2, P.pink); rect(hx + 4, hy, 3, 2, P.pink); rect(hx, hy + 2, 7, 2, P.pink); rect(hx + 1, hy + 4, 5, 1, P.pink); rect(hx + 2, hy + 5, 3, 1, P.pink); }
  drawJess(36, 132, S.outfit, { s: 0.38 });
  drawHim(284, 132, 0.38);
  if (Math.floor(S.t / 500) % 2) txtS('CLICK OR PRESS ENTER TO PLAY', W / 2, 160, P.yellow, 8, 'center');
  txt('(C) 2026 LIKE THE FISH SOFTWARE', W / 2, 184, P.lblue, 8, 'center');
  onAny = () => { S.his = hisName(); tune([N.C5, N.E5, N.G5, N.C5 * 2], 0.1); newDay(); };
}

function drawRoom() {
  // living room
  rect(0, 12, W, 140, '#d9a8c8'); for (let x = 0; x < W; x += 16) rect(x, 12, 1, 140, 'rgba(255,255,255,.25)');
  rect(0, 152, W, 48, '#8b5429'); for (let x = 0; x < W; x += 20) rect(x, 152, 1, 48, 'rgba(0,0,0,.2)');
  // window
  box(200, 30, 70, 50, P.sky, '#ffffff'); rect(234, 32, 2, 46, '#fff'); rect(202, 54, 66, 2, '#fff');
  // door
  rect(276, 66, 36, 86, '#7a3c1c'); rect(280, 70, 28, 78, '#9a5428'); ell(303, 112, 2, 2, P.gold);
  // couch
  rect(110, 112, 80, 30, '#8b3f96'); rect(104, 104, 10, 38, '#6a2c76'); rect(186, 104, 10, 38, '#6a2c76'); rect(110, 98, 80, 16, '#9a4fa6');
  // table + phone
  rect(30, 120, 44, 6, '#574200'); rect(34, 126, 4, 26, '#574200'); rect(66, 126, 4, 26, '#574200');
  const ringing = S.scene === 'home' && !S.callDone, sh = ringing && Math.floor(S.t / 80) % 2 ? 1 : 0;
  rect(40 + sh, 110, 24, 10, '#c0392b'); rect(38 + sh, 106, 28, 5, '#e05040'); rect(48 + sh, 113, 8, 4, '#fff');
  // wall clock
  ell(150, 44, 13, 13, '#ffffff'); ell(150, 44, 11, 11, '#f5eee0');
  const a = (S.time / 60) * Math.PI * 2 - Math.PI / 2; g.strokeStyle = '#000'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(150, 44); g.lineTo(150 + Math.cos(a) * 9, 44 + Math.sin(a) * 9); g.stroke(); g.beginPath(); g.moveTo(150, 44); g.lineTo(150 + 5, 44); g.stroke();
}

function drawHome() {
  drawRoom(); hud();
  drawJess(92, 18, S.outfit, { s: 0.92 });
  if (!S.callDone) {
    if (every('ring', 1400)) ringPhone();
    txtS('RING! RING!', 52, 90, Math.floor(S.t / 200) % 2 ? P.yellow : P.white, 8, 'center');
    button('ANSWER THE PHONE', 160, 162, 150, 18, () => { S.his = hisName(); go('phone'); sayVoice('Hi Jessica! It\'s ' + S.his.toLowerCase() + '. Want to go on a date?', true); });
    onAny = null; return;
  }
  clueBar();
  button('GO SHOPPING', 162, 148, 152, 16, () => { startDrive(); });
  button('WAIT FOR ' + (S.his.length > 8 ? 'HIM' : S.his), 162, 166, 152, 16, () => { S.time = S.deadline; doorbell(); go('door'); });
  onAny = null;
}

function drawPhone() {
  // her side
  rect(0, 0, 160, 124, P.lred); for (let y = 0; y < 124; y += 8) rect(0, y, 160, 1, P.pink);
  g.save(); g.beginPath(); g.rect(0, 0, 159, 124); g.clip(); drawJess(70, 22, S.outfit, { s: 1.7 }); rect(84, 30, 9, 26, P.red); rect(80, 26, 12, 7, P.red); rect(80, 52, 12, 7, P.red); g.restore();
  // his side
  rect(161, 0, 159, 124, P.lblue); for (let y = 0; y < 124; y += 8) rect(161, y, 159, 1, P.blue);
  g.save(); g.beginPath(); g.rect(161, 0, 159, 124); g.clip(); drawHim(250, 22, 1.7); rect(227, 30, 9, 26, P.black); rect(227, 26, 12, 7, P.black); rect(227, 52, 12, 7, P.black); g.restore();
  rect(159, 0, 3, 124, P.black);
  // the curly cord between them
  for (let x = 96; x < 226; x += 6) ell(x, 70 + Math.sin(x / 4 + S.t / 200) * 3, 2, 2, P.black);
  const lines = wrap("HI JESSICA! IT'S " + S.his + ". LET'S GO OUT TODAY AT " + clock(S.deadline) + ". WHERE? IT'S A SURPRISE! HERE'S A CLUE:", 36), cl = wrap('"' + S.clue + '"', 36);
  const all = lines.concat(cl), total = all.join('').length; S.typed = Math.min(total, Math.floor(S.t / 32));
  box(0, 124, W, 76, P.black, P.white);
  let left = S.typed;
  all.forEach((ln, i) => { if (left <= 0) return; txt(ln.slice(0, left), 8, 130 + i * 10, i >= lines.length ? P.lgreen : P.white, 8); left -= ln.length; });
  if (S.typed < total && every('blip', 90)) beep(180 + Math.random() * 90, 0.03, 'square', 0.025);
  const proceed = () => { S.callDone = true; go('home'); };
  if (S.typed >= total) { const blink = Math.floor(S.t / 400) % 2; button('PROCEED >', 96, 98, 128, 20, proceed, { edge: blink ? P.yellow : P.white, fill: P.purple }); }
  onAny = () => { if (S.typed >= total) proceed(); else S.t = 99999; };
}

function storeById(id) { return STORES.find((s) => s.id === id); }
const WX = (i) => 110 + i * 190, WORLD = WX(STORES.length - 1) + 110;
function wxOf(id) { return WX(STORES.findIndex((s) => s.id === id)); }
function startDrive() { const x = wxOf(S.loc); S.drv = { x, dir: S.loc === 'salon' ? -1 : 1, stopped: false }; go('drive'); engine(); }
function drawCar(x, y, dir) {
  g.save(); g.translate(Math.round(x), Math.round(y)); if (dir < 0) g.scale(-1, 1);
  // her pink convertible, side view
  rect(-26, -8, 52, 12, P.lred); rect(-22, -12, 22, 5, P.lred); rect(10, -12, 14, 5, P.lred); rect(-26, -2, 52, 2, P.white);
  rect(2, -20, 2, 10, P.lgrey); rect(2, -20, 8, 2, P.lgrey);
  rect(-18, 2, 12, 10, P.black); rect(10, 2, 12, 10, P.black); rect(-15, 5, 6, 4, P.lgrey); rect(13, 5, 6, 4, P.lgrey);
  rect(24, -6, 3, 3, P.yellow); rect(-27, -6, 2, 3, P.red);
  // Jessica at the wheel, hair blowing
  ell(-6, -20, 5, 6, P.skin); rect(-12, -26, 12, 5, S.outfit.hairCol); rect(-18 - Math.floor(S.t / 120) % 2 * 2, -24, 8, 4, S.outfit.hairCol);
  rect(-11, -14, 10, 6, (S.outfit.top && S.outfit.top.c) || (S.outfit.dress && S.outfit.dress.c) || P.white);
  g.restore();
}
function drawStorefront(st, sx) {
  if (st.id === 'home') {
    poly([[sx - 74, 70], [sx, 30], [sx + 74, 70]], P.red);
    rect(sx - 66, 70, 132, 60, P.lred); rect(sx - 56, 82, 26, 22, P.cyan); rect(sx + 30, 82, 26, 22, P.cyan); rect(sx - 10, 96, 20, 34, P.brown); rect(sx + 5, 112, 3, 3, P.yellow);
    rect(sx - 38, 100, 4, 4, P.white); rect(sx - 64, 120, 40, 10, P.green);
  } else {
    rect(sx - 70, 40, 140, 90, st.col); rect(sx - 70, 40, 140, 6, st.roof);
    rect(sx - 62, 48, 124, 18, P.white); rect(sx - 60, 50, 120, 14, P.black);
    for (let i = 0; i < 14; i++) rect(sx - 70 + i * 10, 68, 10, 10, i % 2 ? P.white : st.roof);
    for (let i = 0; i < 14; i++) ell(sx - 65 + i * 10, 78, 5, 3, i % 2 ? P.white : st.roof);
    rect(sx - 62, 84, 44, 40, P.cyan); rect(sx + 18, 84, 44, 40, P.cyan); rect(sx - 10, 90, 20, 40, P.brown); rect(sx + 5, 110, 3, 3, P.yellow);
    // what's in the window
    if (st.id === 'boutique') { poly([[-40, 92], [-36, 92], [-28, 120], [-48, 120]].map((p) => [sx + p[0], p[1]]), P.purple); poly([[36, 92], [40, 92], [50, 120], [26, 120]].map((p) => [sx + p[0], p[1]]), P.lred); }
    if (st.id === 'denim') { rect(sx - 46, 92, 16, 14, P.red); rect(sx - 46, 106, 7, 16, P.blue); rect(sx - 37, 106, 7, 16, P.blue); rect(sx + 30, 94, 18, 20, P.blue); }
    if (st.id === 'knits') { rect(sx - 50, 94, 24, 18, P.orange); rect(sx + 28, 94, 24, 18, P.lgreen); }
    if (st.id === 'shoes') { rect(sx - 52, 112, 14, 6, P.red); rect(sx - 34, 106, 8, 12, P.brown); rect(sx + 28, 112, 14, 6, P.white); rect(sx + 44, 112, 12, 6, P.cyan); }
    if (st.id === 'glitter') { rect(sx - 50, 104, 18, 3, P.yellow); rect(sx - 46, 99, 3, 5, P.yellow); rect(sx - 41, 97, 3, 7, P.yellow); rect(sx + 28, 100, 24, 6, P.brown); rect(sx + 34, 94, 12, 6, P.brown); }
    if (st.id === 'salon') { ell(sx - 40, 102, 10, 12, P.brown); ell(sx + 40, 102, 10, 12, P.yellow); }
  }
}
function drawDrive(dt) {
  const d = S.drv;
  if (!d.stopped) { d.x += d.dir * dt * 0.085; if (d.x < 60) { d.x = 60; d.dir = 1; } if (d.x > WORLD - 60) { d.x = WORLD - 60; d.dir = -1; } }
  const cam = Math.max(0, Math.min(WORLD - W, d.x - W / 2));
  rect(0, 12, W, 120, P.cyan);
  for (let i = 0; i < 6; i++) { const cx = ((i * 140 - cam * 0.3) % (W + 120) + W + 120) % (W + 120) - 60; ell(cx, 24 + (i % 2) * 8, 18, 5, P.white); ell(cx + 14, 22 + (i % 2) * 8, 12, 5, P.white); }
  for (let x = 0; x < W; x += 2) { const hgt = 16 + 10 * Math.sin((x + cam * 0.5) / 40); rect(x, 112 - hgt, 2, hgt, P.green); }
  let near = null;
  STORES.forEach((st, i) => { const sx = WX(i) - cam; if (sx < -90 || sx > W + 90) return; drawStorefront(st, sx); if (Math.abs(WX(i) - d.x) < 40) near = st; });
  rect(0, 130, W, 10, P.lgrey); rect(0, 140, W, 2, P.grey); rect(0, 142, W, 44, P.dgrey);
  for (let x = -((cam) % 32); x < W; x += 32) rect(x, 163, 16, 2, P.yellow);
  drawCar(d.x - cam, 168, d.dir);
  hud();
  // signs are hi-res text, drawn after the colour pass
  STORES.forEach((st, i) => { const sx = WX(i) - cam; if (sx < -90 || sx > W + 90 || st.id === 'home') return; const blink = near === st && Math.floor(S.t / 250) % 2; txt(st.name, sx, 53, blink ? P.yellow : P.white, st.name.length > 12 ? 6 : 8, 'center'); });
  if (near && near.id === 'home') txtS('HOME', near ? WX(0) - cam : 0, 112, P.white, 8, 'center');
  rect(0, 186, W, 14, P.black);
  button('<', 4, 187, 30, 12, () => { d.dir = -1; d.stopped = false; });
  button('>', 286, 187, 30, 12, () => { d.dir = 1; d.stopped = false; });
  if (near) button('STOP AT ' + (near.id === 'home' ? 'HOME' : near.name), 40, 187, 240, 12, () => { d.stopped = true; S.loc = near.id; engine(); arrive(near.id); }, { size: near.name.length > 10 ? 6 : 8 });
  else txt('DRIVE PAST A SHOP AND STOP THERE', 160, 190, P.lgrey, 6, 'center');
  onAny = null;
}

function arrive(where) {
  S.loc = where;
  if (S.time >= S.deadline) {
    if (where === 'home') { doorbell(); go('door'); } else { go('missed'); S.result = { kind: 'late' }; }
    return;
  }
  // a mid-day change of plans, the way the old game did it
  if (!S.changed && S.time >= 24 && Math.random() < 0.3) {
    S.changed = true; const others = DATE_KEYS.filter((k) => k !== S.date); S.date = pick(others); S.clue = pick(DATES[S.date].clues); S.deadline += 30;
    S.after = where; ringPhone(); go('change'); sayVoice('Change of plans!', true); return;
  }
  // life gets in the way
  if (S.evCount < 2 && S.events.length && Math.random() < (where === 'home' ? 0.25 : 0.38)) {
    const ev = S.events.shift(); S.evCount++; S.after = where; startEvent(ev); return;
  }
  if (where === 'home') go('home');
  else { S.store = storeById(where); S.sel = S.store.hair ? 'hair' : ITEMS[S.store.items[0]].slot; go('store'); }
}

/* ---------- the stores ---------- */
function drawStore() {
  const st = S.store;
  rect(0, 12, W, 188, st.col); for (let y = 12; y < 200; y += 8) rect(0, y, W, 1, 'rgba(255,255,255,.18)');
  rect(0, 160, 130, 40, '#6a3c1c');
  // mirror frame
  rect(14, 18, 104, 150, '#f2d14b'); rect(18, 22, 96, 142, '#c8eef2'); rect(24, 26, 6, 60, 'rgba(255,255,255,.6)');
  drawJess(66, 26, S.outfit, { s: 0.9 });
  hud();
  txtS(st.name, 226, 16, '#ffffff', 8, 'center');
  const list = st.hair ? Object.keys(HAIR) : st.items;
  list.forEach((id, i) => {
    const name = st.hair ? HAIR[id].name : ITEMS[id].name;
    const on = st.hair ? S.outfit.hair === id : isWorn(id);
    button((on ? '* ' : '') + name, 136, 28 + i * 16, 180, 14, () => { tryOn(id); }, { size: name.length > 13 ? 6 : 8, fill: on ? P.purple : P.blue });
  });
  const y0 = 28 + list.length * 16 + 4;
  if (st.hair) {
    txt('COLOUR', 136, y0 + 2, '#000', 8);
    HAIRCOL.forEach((hc, i) => { const x = 194 + i * 24; rect(x, y0, 20, 12, '#fff'); rect(x + 2, y0 + 2, 16, 8, hc[1]); hot(x, y0, 20, 12, () => { S.outfit.hairCol = hc[1]; beep(700 + i * 80, 0.05); }); });
  } else {
    const slot = S.sel, it = S.outfit[slot];
    if (it && slot !== 'acc' || (it && ['hat','dice'].includes(it.id))) {
      CLOTH.forEach((c, i) => { const x = 136 + i * 18, y = y0; rect(x, y, 16, 12, it.c === c[1] ? P.yellow : '#fff'); rect(x + 2, y + 2, 12, 8, c[1]); hot(x, y, 16, 12, () => { it.c = c[1]; beep(600 + i * 60, 0.05); }); });
      PATS.forEach((pn, i) => { const x = 136 + i * 30, y = y0 + 16; const on = it.p === i; rect(x, y, 27, 12, on ? P.yellow : '#fff'); g.fillStyle = fillFor(it.c, i); g.fillRect(x + 2, y + 2, 23, 8); hot(x, y, 27, 12, () => { it.p = i; beep(500 + i * 70, 0.05); }); });
    }
  }
  button('BACK TO THE CAR', 160, 168, 156, 16, () => { startDrive(); }, { size: 8 });
  clueBar();
  onAny = null;
}
function isWorn(id) { const it = ITEMS[id], cur = S.outfit[it.slot]; return cur && cur.id === id; }
function tryOn(id) {
  if (S.store.hair) { S.outfit.hair = id; S.sel = 'hair'; beep(880, 0.06); return; }
  const it = ITEMS[id];
  const cur = S.outfit[it.slot];
  if (it.slot === 'acc' && cur && cur.id === id) { S.outfit.acc = null; S.sel = 'acc'; return; } // tap again to take it off
  const keep = cur ? { c: cur.c, p: cur.p } : { c: CLOTH[(Math.random() * CLOTH.length) | 0][1], p: 0 };
  if (id === 'slippers') keep.c = '#c8eef2';
  S.outfit[it.slot] = { id, c: keep.c, p: keep.p };
  if (it.slot === 'dress') { S.outfit.top = null; S.outfit.bottom = null; }
  if (it.slot === 'top' || it.slot === 'bottom') {
    if (S.outfit.dress) { S.outfit.dress = null; if (!S.outfit.top) S.outfit.top = { id:'tee', c:'#ffffff', p:0 }; if (!S.outfit.bottom) S.outfit.bottom = { id:'jeans', c:'#5066d6', p:0 }; }
  }
  S.sel = it.slot; beep(660, 0.05); beep(990, 0.05, 'square', 0.04, 0.05);
}

/* ---------- interruptions ---------- */
const EVENTS = {
  twins: { title:'THE TWINS!', text:'The twins glued their hands together with sparkly craft glue. Both of them are crying.', a:['HELP THEM (-15 MIN)', () => endEvent(15, 'One warm bath later, the twins are free and very sparkly.')], b:['CALL GRANDMA (-5 MIN)', () => { if (Math.random() < 0.55) endEvent(5, 'Grandma has it handled. She has done this before.'); else endEvent(14, 'Grandma is at bingo. You go help after all.'); }] },
  baby:  { title:'BABY LEWIS!', text:'Lewis woke up from his nap early and wants a bottle and a song.', mini:'rock' },
  dog:   { title:'THE DOG!', text:'The dog grabbed one of your shoes and ran out the door! Catch him!', mini:'dog' },
  jd:    { title:'JD!', text:'JD calls "just to check in". Then he starts a story about his truck. It is never a quick story.', a:['HEAR HIM OUT (-12 MIN)', () => endEvent(12, 'JD tells the whole truck story. Twice. It was pretty good, actually.')], b:['SEE YOU SOON, JD! (-3 MIN)', () => endEvent(3, '"Fine, fine. Go get ready," says JD. "Tell me what you think of the date later."')] },
};
function startEvent(id) { S.ev = { id, phase:'ask', n:0, dog:{ x:160, y:120, vx:2.2, vy:1.4 }, misses:0, t0:0 }; ringPhone(); go('event'); }
function endEvent(mins, note) { S.time += mins; S.ev.phase = 'done'; S.ev.note = note; S.ev.mins = mins; tune([N.G4, N.C5], 0.12); }
function drawEvent() {
  const ev = S.ev, E = EVENTS[ev.id];
  rect(0, 12, W, 188, '#40318d'); stars(20, 11); hud();
  box(12, 18, 296, 164, '#000', P.yellow);
  txtS(E.title, W / 2, 26, P.pink, 16, 'center');
  // little portraits
  if (ev.id === 'twins') { drawKid(130, 70, '#e05040'); drawKid(190, 70, '#4070d0'); if (Math.floor(S.t / 400) % 2) { rect(152, 92, 16, 3, '#f2d14b'); } }
  if (ev.id === 'baby' && ev.phase !== 'rock') drawBaby(160, 82, 0);
  if (ev.id === 'jd') { drawPhoneIcon(160, 78); txtS('BLAH BLAH BLAH...', 160, 104, P.lgrey, 8, 'center'); }
  if (ev.phase === 'ask') {
    wrap(E.text, 34).forEach((l, i) => txt(l, 20, 118 + i * 10, '#fff', 8));
    if (E.mini === 'rock') button('ROCK THE BABY', 90, 156, 140, 18, () => { ev.phase = 'rock'; ev.t0 = S.t; ev.n = 0; });
    else if (E.mini === 'dog') button('CHASE HIM!', 100, 156, 120, 18, () => { ev.phase = 'dog'; ev.t0 = S.t; });
    else { button(E.a[0], 20, 156, 136, 18, E.a[1], { size: 6 }); button(E.b[0], 164, 156, 136, 18, E.b[1], { size: 6 }); }
    onAny = null; return;
  }
  if (ev.phase === 'rock') {
    const sway = Math.sin(S.t / 180) * (ev.n > 0 ? 6 : 0);
    drawBaby(160 + sway, 84, sway);
    txt('TAP THE CRADLE TO ROCK: ' + ev.n + ' / 8', W / 2, 118, '#fff', 8, 'center');
    for (let i = 0; i < ev.n; i++) txt('ZZ', 70 + i * 24, 132, P.lblue, 8);
    hot(100, 60, 120, 60, () => { ev.n++; tune([[N.C5, N.E5, N.G5, N.E5][ev.n % 4]], 0.15, 'triangle'); if (ev.n >= 8) { const secs = (S.t - ev.t0) / 1000; endEvent(Math.min(14, 5 + Math.round(secs)), 'Lewis is fed, sung to and fast asleep. Tiptoe out.'); } });
    button('ROCK', 120, 156, 80, 18, () => { ev.n++; tune([[N.C5, N.E5, N.G5, N.E5][ev.n % 4]], 0.15, 'triangle'); if (ev.n >= 8) { const secs = (S.t - ev.t0) / 1000; endEvent(Math.min(14, 5 + Math.round(secs)), 'Lewis is fed, sung to and fast asleep. Tiptoe out.'); } });
    onAny = null; return;
  }
  if (ev.phase === 'dog') {
    const d = ev.dog; d.x += d.vx; d.y += d.vy; if (d.x < 30 || d.x > 290) d.vx *= -1; if (d.y < 60 || d.y > 150) d.vy *= -1;
    if (Math.random() < 0.02) { d.vx *= -1; }
    drawDog(d.x, d.y, d.vx);
    const left = Math.max(0, 10 - Math.floor((S.t - ev.t0) / 1000));
    txt('CLICK THE DOG! ' + left + 'S  MISSES ' + ev.misses, W / 2, 166, '#fff', 8, 'center');
    hot(d.x - 14, d.y - 12, 28, 22, () => { endEvent(4 + ev.misses * 2, 'Got him! Your shoe is a little soggy, but it still works.'); tune([N.C5, N.G5, N.C5 * 2], 0.08); });
    onAny = () => { ev.misses++; beep(140, 0.1, 'sawtooth', 0.05); };
    if (left <= 0) endEvent(12, 'He finally comes home on his own, very proud of himself.');
    return;
  }
  if (ev.phase === 'done') {
    wrap(ev.note, 34).forEach((l, i) => txt(l, 20, 118 + i * 10, P.lgreen, 8));
    txt('-' + ev.mins + ' MINUTES', W / 2, 142, P.yellow, 8, 'center');
    button('BACK TO IT', 100, 156, 120, 18, () => { S.ev = null; const where = S.after; if (S.time >= S.deadline) { arrive(where); return; } if (where === 'home') go('home'); else { S.store = storeById(where); S.sel = S.store.hair ? 'hair' : ITEMS[S.store.items[0]].slot; go('store'); } });
    onAny = null;
  }
}
function drawKid(x, y, shirt) { ell(x, y, 8, 9, P.skin); rect(x - 8, y - 9, 16, 5, '#6b3f1d'); rect(x - 3, y - 1, 2, 2, '#000'); rect(x + 2, y - 1, 2, 2, '#000'); rect(x - 9, y + 9, 18, 18, shirt); rect(x - 13, y + 10, 4, 12, P.skin); rect(x + 9, y + 10, 4, 12, P.skin); rect(x - 2, y + 4, 4, 2, '#c0392b'); }
function drawBaby(x, y, sway) { rect(x - 30, y + 6, 60, 18, '#c8a0e0'); g.strokeStyle = '#8b3f96'; g.lineWidth = 2; g.beginPath(); g.arc(x, y + 24, 30, Math.PI, 0); g.stroke(); ell(x, y, 10, 10, P.skin); rect(x - 4, y - 2, 2, 2, '#000'); rect(x + 2, y - 2, 2, 2, '#000'); ell(x, y + 5, 2, 2, '#e05040'); rect(x - 14, y + 8, 28, 10, '#ffffff'); }
function drawDog(x, y, dir) { g.save(); g.translate(Math.round(x), Math.round(y)); if (dir < 0) g.scale(-1, 1); rect(-12, -4, 22, 10, '#8b5429'); rect(8, -10, 10, 9, '#8b5429'); rect(16, -6, 4, 3, '#000'); rect(9, -12, 4, 6, '#574200'); rect(-10, 6, 3, 6, '#8b5429'); rect(5, 6, 3, 6, '#8b5429'); rect(-16, -6, 5, 3, '#8b5429'); rect(14, -3, 6, 4, '#e88fc0'); rect(12, -9, 2, 2, '#000'); g.restore(); }
function drawPhoneIcon(x, y) { rect(x - 9, y - 16, 18, 30, '#222'); rect(x - 7, y - 13, 14, 22, '#67b6bd'); rect(x - 2, y + 10, 4, 2, '#888'); }

function drawChange() {
  drawRoom(); hud();
  box(30, 40, 260, 120, '#000', P.yellow);
  txtS('CHANGE OF PLANS!', W / 2, 50, P.pink, 8, 'center');
  const lines = [S.his + ' TEXTS:', 'NEW PLAN, NEW PLACE.', 'LET\'S MAKE IT ' + clock(S.deadline) + '.'].concat(wrap('"' + S.clue + '"', 30));
  lines.forEach((l, i) => txt(l, 42, 66 + i * 11, i >= 3 ? P.lgreen : '#fff', 8));
  button('GOT IT!', 110, 136, 100, 16, () => { const w = S.after; if (w === 'home') go('home'); else { S.store = storeById(w); S.sel = S.store.hair ? 'hair' : ITEMS[S.store.items[0]].slot; go('store'); } });
  onAny = null;
}

/* ---------- judging the outfit ---------- */
const REASONS = {
  trivia: { gown:["A ball gown to pub trivia? We're answering questions, not getting crowned!", "Babe, it's quiz night at the Anchor, not the Oscars. Lose the gown!"],
            sundress:["A sundress at the pub? It's trivia night. You'll freeze by round three."],
            boots:["Cowboy boots at trivia? Unless the category is line dancing, we're in trouble."],
            slippers:["Glass slippers at the pub? One spilled drink and that's seven years bad luck."],
            any:["{Item} at trivia night? We need to look like we know the capital of Australia.", "Quiz night needs smart and casual, babe. {Item} is not helping our team."] },
  reunion:{ gown:["A ball gown on Aunt Deb's lawn? Uncle Gary will never let you live that down."],
            cutoffs:["Cutoffs at the family reunion? Grandma is going to have questions."],
            bandtee:["A band tee for Monopoly with my grandmother? Maybe something cozier."],
            any:["It's a family reunion with board games, babe. Think cozy, not {item}.", "{Item} on Aunt Deb's lawn? We'll be on the grass playing Scrabble all afternoon."],
            shoes:["{Item} on the backyard grass? You'll sink right in during the sack race."] },
  concert:{ gown:["A ball gown at a trailer park? Darrell's dog will chase that train all night!", "Babe, we're stomping in the dirt by a double-wide, not waltzing!"],
            any:["{Item} at a trailer park concert? We'll be on lawn chairs by a bonfire!", "We're going to see a band at Sunny Acres. That {item} isn't going to cut it."],
            shoes:["{Item} on a dirt dance floor? You'll lose one in the mud before the first fiddle."] },
  ball:   { any:["It's a royal ball, babe! You can't waltz under a chandelier in {item}.", "The Grand Ballroom has a dress code, and {item} isn't on it."],
            sundress:["A sundress at a royal ball? The string quartet might stop playing."],
            shoes:["{Item} at the ball? You need something you can lose on the stairs at midnight."] },
};
const PRAISE = ["Wow, you look perfect! Let's go!", "You nailed it, Jess. Let's go!", "Look at you! The {date} won't know what hit it.", "Perfect. You figured out my clue!"];
function reasonFor(d, missId, isShoe) {
  const R = REASONS[d], name = ITEMS[missId].name.toLowerCase(), Name = name.charAt(0).toUpperCase() + name.slice(1);
  const list = R[missId] || (isShoe && R.shoes) || R.any;
  return pick(list).replace('{item}', name).replace('{Item}', Name);
}
function judge() {
  const d = S.date, o = S.outfit;
  const fits = (it) => it && ITEMS[it.id].tags.includes(d);
  const main = o.dress ? fits(o.dress) : (fits(o.top) && fits(o.bottom));
  const shoes = fits(o.shoes);
  let stars = 0; if (main) stars += 2; if (shoes) stars += 1; if (o.acc && fits(o.acc)) stars += 1; if (HAIR[o.hair].tags.includes(d)) stars += 1;
  let miss = null, missShoe = false;
  if (!main) miss = o.dress ? o.dress.id : (!fits(o.top) ? o.top.id : o.bottom.id); else if (!shoes) { miss = o.shoes.id; missShoe = true; }
  return { ok: main && shoes, stars, main, shoes, miss, missShoe };
}
function drawDoor() {
  drawRoom(); hud();
  if (S.t < 1600) { drawJess(92, 18, S.outfit, { s: 0.92 }); txtS('DING DONG!', 294, 50, P.yellow, 8, 'center'); return; }
  if (!S.result) { const j = judge(); S.result = Object.assign({ kind: j.ok ? 'date' : 'wrong' }, j); if (j.ok) { S.won[S.date] = (S.won[S.date] || 0) + 1; S.result.line = pick(PRAISE).replace('{date}', DATES[S.date].name.toLowerCase()); } else { S.misses++; S.result.line = reasonFor(S.date, j.miss, j.missShoe) + ' ' + pick(['Rain check?', 'Maybe change first?', "Let's try again tomorrow.", 'Call me tomorrow?']); } }
  drawJess(92, 18, S.outfit, { s: 0.92 }); drawHim(250, 18, 0.92);
  const D = DATES[S.date], r = S.result;
  const say = wrap(r.line, 20);
  box(112, 14, 134, 12 + say.length * 10, '#000', '#fff');
  say.forEach((l, i) => txt(l, 118, 20 + i * 10, '#fff', 6));
  if (S.t > 1700 && once('door-voice')) sayVoice(r.line, true);
  if (r.kind === 'date') button("LET'S GO!", 160, 162, 150, 18, () => { go('date'); });
  else button('SEE WHAT HAPPENED', 160, 162, 150, 18, () => { go('missed'); });
  onAny = null;
}

/* ---------- the four dates ---------- */
function drawDate() {
  const d = S.date, t = S.t;
  if (d === 'trivia') {
    rect(0, 0, W, H, '#3a2410'); for (let x = 0; x < W; x += 24) rect(x, 0, 2, 140, '#2a1808');
    rect(0, 140, W, 60, '#5a3418');
    box(70, 8, 180, 40, '#14402a', '#c8a050'); txt('ROUND 4', 160, 13, '#fff', 8, 'center'); txt('CAPITAL OF AUSTRALIA?', 160, 30, P.yellow, 8, 'center');
    rect(80, 120, 160, 10, '#7a4a20'); rect(90, 130, 6, 30, '#7a4a20'); rect(224, 130, 6, 30, '#7a4a20');
    drawJess(130, 52, S.outfit, { s: 0.5, bounce: t > 3000 ? Math.abs(Math.sin(t / 150)) * 4 : 0 }); drawHim(190, 52, 0.5, t > 3000 ? Math.abs(Math.sin(t / 150 + 1)) * 4 : 0);
    if (t > 1500) { box(100, 84, 54, 16, '#fff', '#000'); txt('CANBERRA', 127, 89, '#000', 6, 'center'); }
    if (t > 3000) txtS('TEAM JESSICA WINS!', 160, 168, P.yellow, 8, 'center');
  } else if (d === 'reunion') {
    rect(0, 0, W, 120, '#67b6bd'); ell(270, 26, 12, 12, '#f2d14b'); rect(0, 120, W, 80, '#55a049');
    rect(40, 112, 240, 10, '#c0392b'); for (let x = 40; x < 280; x += 10) rect(x, 112, 5, 10, '#fff');
    rect(120, 104, 40, 8, '#f2d14b'); rect(170, 104, 30, 8, '#4070d0'); txt('MONOPOLY', 140, 105, '#000', 6, 'center');
    drawKid(60, 78, '#30a040'); drawKid(270, 78, '#a040a0'); drawHim(200, 40, 0.5); drawJess(110, 40, S.outfit, { s: 0.5, bounce: t > 2500 ? Math.abs(Math.sin(t / 160)) * 4 : 0 });
    if (t > 1200) { box(180, 14, 134, 18, '#fff', '#000'); txt('UNCLE GARY: NO FAIR!', 247, 20, '#000', 6, 'center'); }
    if (t > 2800) txtS('JESSICA WINS BOARDWALK!', 160, 168, P.yellow, 8, 'center');
  } else if (d === 'concert') {
    rect(0, 0, W, H, '#14103a'); stars(50, 5); rect(0, 140, W, 60, '#574200');
    for (let i = 0; i < 3; i++) { const x = 20 + i * 100; rect(x, 104, 70, 36, i === 1 ? '#bcbcbc' : '#d8d0b0'); rect(x + 8, 112, 10, 8, '#f2d14b'); rect(x + 50, 112, 10, 8, '#f2d14b'); }
    rect(100, 86, 120, 10, '#8b5429'); for (let i = 0; i < 6; i++) rect(104 + i * 20, 70 + Math.round(Math.sin(t / 200 + i) * 3), 2, 16, ['#e05040', '#f2d14b', '#55a049', '#4070d0', '#e88fc0', '#fff'][i]);
    for (let i = 0; i < 8; i++) { const fx = (i * 41 + t / 20) % W, fy = 30 + (i * 23) % 60; rect(fx, fy, 2, 2, Math.floor(t / 200 + i) % 2 ? '#f2d14b' : '#94e089'); }
    drawJess(130, 52, S.outfit, { s: 0.55, bounce: Math.abs(Math.sin(t / 140)) * 6 }); drawHim(190, 52, 0.55, Math.abs(Math.sin(t / 140 + 1.5)) * 6);
    if (every('riff', 600)) tune([N.G4, N.B4, N.D5], 0.08, 'sawtooth');
    if (t > 2500) txtS('YEE-HAW! BEST NIGHT EVER!', 160, 168, P.yellow, 8, 'center');
  } else {
    rect(0, 0, W, H, '#5a2a6a'); for (let x = 0; x < W; x += 40) rect(x + 10, 20, 20, 120, '#7a3c8c');
    rect(0, 140, W, 60, '#d8c090'); for (let x = 0; x < W; x += 20) for (let y = 140; y < 200; y += 20) rect(x + ((y / 20) % 2) * 10, y, 10, 10, '#c0a070');
    // chandelier
    rect(159, 0, 2, 16, '#f2d14b'); rect(130, 16, 60, 4, '#f2d14b'); for (let i = 0; i < 7; i++) { rect(132 + i * 9, 20, 2, 6, '#fff'); if (Math.floor(t / 250 + i) % 3 === 0) rect(131 + i * 9, 26, 4, 2, '#fff8a0'); }
    // the couple waltzes in a circle
    const a = t / 900, cx = 160 + Math.cos(a) * 40, cy = 40 + Math.sin(a) * 6;
    drawJess(cx - 12, cy, S.outfit, { s: 0.6 }); drawHim(cx + 14, cy, 0.6);
    for (let i = 0; i < 12; i++) rect((i * 29 + t / 15) % W, (i * 17 + t / 25) % 140, 1, 1, '#ffffff');
    if (every('waltz', 1200)) tune([N.C5, 0, N.E5, N.G5], 0.12, 'triangle');
    if (t > 3000) txtS('A FAIRYTALE NIGHT!', 160, 168, P.yellow, 8, 'center');
  }
  if (t > 3600) {
    const r = S.result; rect(0, 180, W, 20, '#000');
    for (let i = 0; i < 5; i++) txt('*', 108 + i * 14, 186, i < r.stars ? P.yellow : P.dgrey, 8);
    button('NEXT', 250, 182, 66, 16, () => { go('result'); });
  }
  onAny = () => { if (S.t < 3600) S.t = 3600; };
}

function drawMissed() {
  drawRoom(); hud();
  const r = S.result || { kind: 'late' }, D = DATES[S.date];
  box(40, 30, 240, 120, '#fff8d0', '#c0a050');
  txt('A NOTE ON THE DOOR:', 160, 40, '#574200', 8, 'center');
  const note = r.kind === 'late'
    ? 'Jess - I rang and rang! We were going to the ' + D.name.toLowerCase() + ' at ' + D.place.toLowerCase() + '. Call you tomorrow. xo ' + S.his
    : 'Jess - you looked great, but we were going to the ' + D.name.toLowerCase() + ' at ' + D.place.toLowerCase() + '. Try again tomorrow? xo ' + S.his.split(' ')[0];
  wrap(note.toUpperCase(), 26).forEach((l, i) => txt(l, 52, 58 + i * 11, '#40318d', 8));
  if (r.kind === 'wrong') { txt(r.main ? 'TIP: RIGHT CLOTHES, WRONG SHOES.' : 'TIP: LISTEN CLOSE TO THE CLUE.', 160, 136, P.red, 6, 'center'); }
  button('TRY ANOTHER DAY', 160, 162, 150, 18, () => { S.day++; newDay(); });
  onAny = null;
}

function drawResult() {
  rect(0, 0, W, H, P.blue); stars(40, 9);
  const done = DATE_KEYS.filter((k) => S.won[k]).length;
  if (done >= 4) {
    // she found him at all four: birthday finale
    for (let i = 0; i < 6; i++) { const fx = 40 + i * 48, fy = 40 + (i % 2) * 20, r = (S.t / 20 + i * 13) % 30; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; rect(fx + Math.cos(a) * r, fy + Math.sin(a) * r, 2, 2, TITLE_COLS[(i + k) % 7]); } }
    if (every('bday', 2400)) tune([N.C5, N.C5, N.D5, N.C5, N.F5, N.E5], 0.14, 'triangle');
    txtS('ALL FOUR DATES!', W / 2, 92, P.yellow, 16, 'center');
    txtS('HAPPY BIRTHDAY JESSICA!', W / 2, 118, P.pink, 8, 'center');
    txt('LOVE, YOUR BIG BRO', W / 2, 132, '#fff', 8, 'center');
    drawJess(40, 120, S.outfit, { s: 0.45, bounce: Math.abs(Math.sin(S.t / 150)) * 5 }); drawHim(280, 120, 0.45, Math.abs(Math.sin(S.t / 150 + 1)) * 5);
    button('PLAY AGAIN', 110, 168, 100, 18, () => { S.won = {}; S.day = 1; S.misses = 0; newDay(); });
  } else {
    txtS('DAY ' + S.day + ' DONE!', W / 2, 30, P.yellow, 16, 'center');
    txt('DATES FOUND: ' + done + ' OF 4', W / 2, 62, '#fff', 8, 'center');
    DATE_KEYS.forEach((k, i) => { const on = S.won[k]; txt((on ? '* ' : '- ') + DATES[k].name, 70, 82 + i * 14, on ? P.lgreen : P.lgrey, 8); });
    button('NEXT DAY', 110, 160, 100, 18, () => { S.day++; newDay(); });
  }
  onAny = null;
}

/* ---------- loop ---------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(60, now - last); last = now; S.t += dt;
  hits = [];
  // one in-game hour = about 2.5 real minutes while she's home, driving or shopping
  if ((S.scene === 'home' && S.callDone) || S.scene === 'drive' || S.scene === 'store') {
    S.time += dt / 2500;
    if (S.time >= S.deadline) { S.time = S.deadline; if (S.scene === 'home') { doorbell(); go('door'); } else { S.result = { kind: 'late' }; go('missed'); } }
  }
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = P.black; g.fillRect(0, 0, W, H);
  DEFER = true; TQ.length = 0;
  switch (S.scene) {
    case 'title': drawTitle(); break;
    case 'home': drawHome(); break;
    case 'phone': drawPhone(); break;
    case 'drive': drawDrive(dt); break;
    case 'store': drawStore(); break;
    case 'event': drawEvent(); break;
    case 'change': drawChange(); break;
    case 'door': drawDoor(); break;
    case 'date': drawDate(); break;
    case 'missed': drawMissed(); break;
    case 'result': drawResult(); break;
  }
  quantize(); DEFER = false;
  for (const q of TQ) { g.setTransform(q[6]); txt(q[0], q[1], q[2], q[3], q[4], q[5]); }
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (focus >= hits.length) focus = 0;
  const fh = hits[focus]; if (fh && fh.invisible && kbUsed) { g.strokeStyle = P.yellow; g.lineWidth = 1; g.strokeRect(fh.x + 0.5, fh.y + 0.5, fh.w - 1, fh.h - 1); }
  drawHand();
  requestAnimationFrame(frame);
}
// the white pointing hand from the original, moved with the mouse (or the arrow keys)
const HAND = ['...XX.....', '..XWWX....', '..XWWX....', '..XWWXXX..', '..XWWXWWXX', 'XXXWWXWWXWX', 'XWWWWWWWWWX', 'XWWWWWWWWWX', '.XWWWWWWWX.', '..XWWWWWX..', '..XXXXXXX..'];
function drawHand() {
  let x, y;
  if (mouse && !kbUsed) { x = mouse.x; y = mouse.y; } else if (hits[focus]) { const h = hits[focus]; x = h.x + h.w * 0.6; y = h.y + h.h * 0.55; } else return;
  x = Math.round(x) - 4; y = Math.round(y);
  HAND.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = row[i]; if (c === 'X') rect(x + i, y + j, 1, 1, '#000'); else if (c === 'W') rect(x + i, y + j, 1, 1, '#fff'); } });
}
requestAnimationFrame(frame);
})();
