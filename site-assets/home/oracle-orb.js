/* Like the Fish: the Fish Oracle banner's crystal ball, redrawn as an old-timey 16-colour pixel scene:
   a fortune teller behind a glowing crystal ball, her covered wagon behind her, a campfire and a night sky.
   Finds .ltf-oracle-banner .ltf-orb (the banner is built by another script) and swaps the emoji for a canvas. */
(function () {
  'use strict';
  const PW = 76, PH = 56, SCALE = 2;
  const C = { k: '#000000', b: '#0000AA', g: '#00AA00', c: '#00AAAA', r: '#AA0000', m: '#AA00AA', n: '#AA5500', l: '#AAAAAA', d: '#555555', B: '#5555FF', G: '#55FF55', C: '#55FFFF', R: '#FF5555', M: '#FF55FF', y: '#FFFF55', w: '#FFFFFF' };
  const css = `.ltf-oracle-banner .ltf-orb{font-size:0!important;line-height:0;flex:0 0 auto}
.ltf-oracle-banner .ltf-orb canvas{width:${PW * SCALE}px;max-width:44vw;height:auto;image-rendering:pixelated;image-rendering:crisp-edges;border:3px solid #1b0f2e;border-radius:6px;box-shadow:0 0 0 2px #AA5500,0 4px 10px rgba(0,0,0,.5);display:block}
@media (max-width:420px){.ltf-oracle-banner .ltf-orb canvas{width:${Math.round(PW * 1.6)}px}}`;
  function scene(x, t) {
    const px = (X, Y, c) => { x.fillStyle = C[c] || c; x.fillRect(X, Y, 1, 1); };
    const rect = (X, Y, w, h, c) => { x.fillStyle = C[c] || c; x.fillRect(X, Y, w, h); };
    // night sky: dither blue to black, stars, a crescent moon
    rect(0, 0, PW, PH, 'k');
    for (let Y = 0; Y < 30; Y++) for (let X = 0; X < PW; X++) if ((X + Y) % 2 === 0 && Y > 14 + ((X * 7) % 5)) px(X, Y, 'b');
    [[4, 3], [13, 8], [22, 2], [31, 6], [44, 3], [52, 9], [60, 4], [70, 7], [38, 11], [8, 13]].forEach(([X, Y], i) => px(X, Y, (Math.floor(t * 2 + i) % 5) ? 'w' : 'l'));
    rect(64, 2, 5, 5, 'y'); rect(66, 1, 3, 1, 'y'); rect(66, 7, 3, 1, 'y'); rect(66, 2, 3, 4, 'k'); rect(69, 3, 1, 3, 'y');
    // distant hills and pines
    for (let X = 0; X < PW; X++) { const h = 30 - Math.round(Math.sin(X / 9) * 2 + Math.sin(X / 4) * 1); rect(X, h, 1, PH - h, 'k'); }
    [[2, 30], [9, 29], [15, 31]].forEach(([X, Y]) => { for (let i = 0; i < 7; i++) rect(X - Math.floor(i / 2), Y - 7 + i, 1 + Math.floor(i / 2) * 2, 1, 'g'); rect(X, Y, 1, 2, 'n'); });
    // ground
    rect(0, 40, PW, 16, 'g'); for (let X = 0; X < PW; X += 2) px(X + ((X / 2) % 2), 41, 'G');
    // the covered wagon behind her, right side
    const wx = 42, wy = 20;
    rect(wx + 2, wy + 12, 28, 8, 'n'); rect(wx + 2, wy + 12, 28, 1, 'y'); for (let X = wx + 4; X < wx + 30; X += 4) rect(X, wy + 13, 1, 7, 'k');
    for (let i = 0; i < 12; i++) { const w = 28 - Math.max(0, 5 - i) * 2 + (i < 3 ? -4 + i * 2 : 0); rect(wx + 16 - Math.floor(w / 2), wy + i, w, 1, i % 4 === 1 ? 'R' : 'w'); }
    for (let X = wx + 5; X < wx + 28; X += 5) rect(X, wy + 1, 1, 11, 'l');
    rect(wx + 13, wy + 6, 6, 6, 'k'); rect(wx + 14, wy + 7, 4, 4, Math.sin(t * 6) > -0.6 ? 'y' : 'n');
    [[wx + 7, wy + 22], [wx + 25, wy + 22]].forEach(([X, Y]) => { for (let a = 0; a < 16; a++) { const an = a / 16 * Math.PI * 2; px(Math.round(X + Math.cos(an) * 4), Math.round(Y + Math.sin(an) * 4), 'n'); } for (let a = 0; a < 4; a++) { const an = a / 4 * Math.PI + t * 0.2; for (let r = 1; r < 4; r++) px(Math.round(X + Math.cos(an) * r), Math.round(Y + Math.sin(an) * r), 'd'); px(Math.round(X - Math.cos(an) * 2), Math.round(Y - Math.sin(an) * 2), 'd'); } px(X, Y, 'y'); });
    rect(wx + 30, wy + 17, 8, 1, 'n');
    // lantern hanging off the wagon
    px(wx + 1, wy + 8, 'd'); rect(wx, wy + 9, 3, 3, Math.sin(t * 9) > 0 ? 'y' : 'n'); px(wx + 1, wy + 12, 'd');
    // little campfire
    const fx = 6, fy = 44; rect(fx - 3, fy + 2, 7, 1, 'n'); for (let i = 0; i < 6; i++) { const f = Math.sin(t * 12 + i * 1.7); px(fx - 2 + i % 5, fy + 1 - (i % 3) - (f > 0 ? 1 : 0), f > 0.3 ? 'y' : 'R'); } px(fx, fy - 2 - (Math.sin(t * 10) > 0 ? 1 : 0), 'y');
    // the fortune teller: hooded shawl, gold hoops, hands spread over the ball
    const tx = 26, ty = 14;
    rect(tx - 7, ty + 6, 15, 18, 'm'); rect(tx - 8, ty + 10, 17, 14, 'm'); for (let Y = ty + 7; Y < ty + 24; Y += 3) rect(tx - 6 + (Y % 2), Y, 13, 1, 'M');
    rect(tx - 4, ty - 1, 9, 9, 'm'); rect(tx - 5, ty + 1, 11, 7, 'm'); rect(tx - 3, ty, 7, 1, 'M');
    rect(tx - 3, ty + 2, 7, 6, 'n'); rect(tx - 2, ty + 2, 5, 1, 'r');
    const blink = (t % 4) < 0.15; px(tx - 2, ty + 4, blink ? 'n' : 'w'); px(tx + 2, ty + 4, blink ? 'n' : 'w'); if (!blink) { px(tx - 1, ty + 4, 'k'); px(tx + 1, ty + 4, 'k'); }
    rect(tx - 1, ty + 6, 3, 1, 'r'); px(tx - 4, ty + 6, 'y'); px(tx - 4, ty + 7, 'y'); px(tx + 4, ty + 6, 'y'); px(tx + 4, ty + 7, 'y');
    const wave = Math.round(Math.sin(t * 2.5));
    rect(tx - 9, ty + 18 + wave, 4, 2, 'n'); rect(tx + 6, ty + 18 - wave, 4, 2, 'n'); px(tx - 9, ty + 17 + wave, 'n'); px(tx + 9, ty + 17 - wave, 'n');
    // table with red cloth and gold fringe
    rect(tx - 14, ty + 24, 30, 2, 'r'); rect(tx - 15, ty + 26, 32, 9, 'r'); for (let X = tx - 15; X < tx + 17; X += 2) px(X, ty + 35, 'y'); rect(tx - 15, ty + 26, 32, 1, 'R');
    // the crystal ball: swirling, glowing
    const bx = tx + 1, by = ty + 19, R = 6;
    for (let Y = -R; Y <= R; Y++) for (let X = -R; X <= R; X++) {
      const d = Math.hypot(X, Y); if (d > R + 0.3) continue;
      const sw = Math.sin(Math.atan2(Y, X) * 2 + d * 0.9 - t * 3);
      let col = d > R - 0.8 ? 'B' : sw > 0.55 ? 'C' : sw > 0 ? 'c' : sw > -0.6 ? 'b' : 'M';
      if (X === -2 && Y === -3) col = 'w'; if (X === -3 && Y === -2) col = 'w';
      px(bx + X, by + Y, col);
    }
    rect(bx - 3, by + R, 7, 2, 'y'); rect(bx - 4, by + R + 2, 9, 1, 'n');
    const glowA = 0.18 + 0.12 * Math.sin(t * 3); x.fillStyle = `rgba(85,255,255,${glowA})`; x.fillRect(bx - R - 2, by - R - 2, R * 2 + 5, R * 2 + 5);
    for (let i = 0; i < 4; i++) { const an = t * 1.8 + i * Math.PI / 2; px(Math.round(bx + Math.cos(an) * (R + 3)), Math.round(by + Math.sin(an) * (R + 2)), i % 2 ? 'M' : 'y'); }
    // a little fish swimming in the fog of the ball (it is the Fish Oracle after all)
    const fxp = Math.round(bx + Math.sin(t * 1.2) * 2); px(fxp, by, 'y'); px(fxp + 1, by, 'y'); px(fxp - 1, by - 1, 'y'); px(fxp - 1, by + 1, 'y');
  }
  function mount(orb) {
    if (orb.dataset.pix) return; orb.dataset.pix = '1';
    const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH; cv.setAttribute('aria-label', 'A fortune teller in a purple shawl gazes into a glowing crystal ball in front of her covered wagon under the night sky');
    orb.innerHTML = ''; orb.appendChild(cv);
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    let last = 0; (function loop(ms) { if (ms - last > 90) { last = ms; scene(x, ms / 1000); } requestAnimationFrame(loop); })(0);
  }
  function init() {
    if (!document.getElementById('ltf-orb-css')) { const s = document.createElement('style'); s.id = 'ltf-orb-css'; s.textContent = css; document.head.appendChild(s); }
    const go = () => document.querySelectorAll('.ltf-oracle-banner .ltf-orb').forEach(mount);
    go(); let n = 0; const iv = setInterval(() => { go(); if (++n > 40) clearInterval(iv); }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
