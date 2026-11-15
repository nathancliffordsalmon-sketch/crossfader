/* Like the Fish: the Fish Oracle banner's crystal ball, redrawn as an old-timey 16-colour pixel scene:
   a fortune teller behind a glowing crystal ball, her covered wagon behind her, a campfire and a night sky.
   Finds .ltf-oracle-banner .ltf-orb (the banner is built by another script) and swaps the emoji for a canvas. */
(function () {
  'use strict';
  const PW = 76, PH = 56, SCALE = 2;
  const C = { k: '#000000', b: '#0000AA', g: '#00AA00', c: '#00AAAA', r: '#AA0000', m: '#AA00AA', n: '#AA5500', l: '#AAAAAA', d: '#555555', B: '#5555FF', G: '#55FF55', C: '#55FFFF', R: '#FF5555', M: '#FF55FF', y: '#FFFF55', w: '#FFFFFF' };
  const css = `.ltf-oracle-banner{gap:10px}
.ltf-oracle-banner .ltf-orb{font-size:0!important;line-height:0;flex:0 1 auto;width:clamp(104px,40%,152px);min-width:0}
.ltf-oracle-banner .ltf-orb canvas{width:100%;height:auto;box-sizing:border-box;image-rendering:pixelated;image-rendering:crisp-edges;border:3px solid #1b0f2e;border-radius:6px;box-shadow:0 0 0 2px #AA5500,0 4px 10px rgba(0,0,0,.5);display:block}`;
  function scene(x, t) {
    const px = (X, Y, c) => { x.fillStyle = C[c] || c; x.fillRect(X, Y, 1, 1); };
    const rect = (X, Y, w, h, c) => { x.fillStyle = C[c] || c; x.fillRect(X, Y, w, h); };
    // night sky with dithered horizon glow, stars, crescent moon
    rect(0, 0, PW, PH, 'k');
    for (let Y = 0; Y < 30; Y++) for (let X = 0; X < PW; X++) if ((X + Y) % 2 === 0 && Y > 12 + ((X * 7) % 5)) px(X, Y, 'b');
    [[3, 3], [12, 7], [20, 2], [29, 5], [36, 2], [45, 8], [9, 12], [26, 10]].forEach(([X, Y], i) => px(X, Y, (Math.floor(t * 2 + i) % 5) ? 'w' : 'l'));
    rect(5, 15, 4, 4, 'y'); rect(6, 14, 2, 1, 'y'); rect(6, 19, 2, 1, 'y'); rect(7, 15, 3, 4, 'k');
    // dark meadow
    rect(0, 30, PW, 26, 'k'); for (let X = 0; X < PW; X += 2) px(X + ((X / 2) % 2), 30, 'g');
    // the wagon: a barrel-top caravan with an arched roof, painted plank sides, a lit window, back steps, big spoked wheels
    const wx = 44, wy = 6, ww = 30;
    for (let i = 0; i < 8; i++) { const inset = [7, 4, 2, 1, 1, 0, 0, 0][i]; rect(wx + inset, wy + i, ww - inset * 2, 1, i === 0 ? 'R' : 'r'); }
    for (let i = 1; i < 8; i++) px(wx + 3 + i * 3, wy + 1 + (i % 2), 'R');
    rect(wx - 1, wy + 8, ww + 2, 1, 'y');
    rect(wx, wy + 9, ww, 13, 'n'); for (let X = wx + 3; X < wx + ww; X += 3) rect(X, wy + 9, 1, 13, 'r');
    rect(wx, wy + 9, ww, 1, 'y'); rect(wx, wy + 21, ww, 1, 'y'); rect(wx, wy + 9, 1, 13, 'y'); rect(wx + ww - 1, wy + 9, 1, 13, 'y');
    rect(wx + 3, wy + 11, 7, 6, 'k'); rect(wx + 4, wy + 12, 5, 4, Math.sin(t * 5) > -0.7 ? 'y' : 'n'); px(wx + 6, wy + 12, 'n'); rect(wx + 4, wy + 14, 5, 1, 'n');
    rect(wx + 16, wy + 11, 5, 11, 'k'); rect(wx + 17, wy + 12, 3, 9, 'g'); px(wx + 19, wy + 17, 'y');
    for (let i = 0; i < 4; i++) rect(wx + 15 - i, wy + 22 + i, 7, 1, 'n');
    rect(wx + 24, wy + 12, 4, 3, 'y'); px(wx + 25, wy + 13, 'r'); px(wx + 26, wy + 13, 'r');
    rect(wx - 6, wy + 18, 7, 1, 'n');
    const wheel = (X, Y, r) => { for (let a = 0; a < 32; a++) { const an = a / 32 * Math.PI * 2; px(Math.round(X + Math.cos(an) * r), Math.round(Y + Math.sin(an) * r), 'y'); } for (let a = 0; a < 4; a++) { const an = a / 4 * Math.PI + 0.39; for (let k = -r + 1; k < r; k++) px(Math.round(X + Math.cos(an) * k), Math.round(Y + Math.sin(an) * k), 'n'); } rect(X - 1, Y - 1, 2, 2, 'y'); };
    wheel(wx + 6, wy + 24, 4); wheel(wx + 24, wy + 23, 5);
    // lantern on a hook
    px(wx - 2, wy + 9, 'd'); rect(wx - 3, wy + 10, 3, 3, Math.sin(t * 9) > 0 ? 'y' : 'n');
    // the fortune teller, small, behind the ball: hooded shawl, gold hoops, hands raised
    const tx = 24, ty = 15;
    rect(tx - 5, ty + 5, 11, 13, 'm'); for (let Y = ty + 6; Y < ty + 18; Y += 3) rect(tx - 4 + (Y % 2), Y, 9, 1, 'M');
    rect(tx - 3, ty - 1, 7, 7, 'm'); rect(tx - 2, ty - 1, 5, 1, 'M');
    rect(tx - 2, ty + 1, 5, 4, 'n'); rect(tx - 2, ty + 1, 5, 1, 'r');
    const blink = (t % 4) < 0.15; px(tx - 1, ty + 2, blink ? 'n' : 'w'); px(tx + 1, ty + 2, blink ? 'n' : 'w');
    px(tx, ty + 4, 'r'); px(tx - 3, ty + 4, 'y'); px(tx + 3, ty + 4, 'y');
    const wave = Math.round(Math.sin(t * 2.5));
    rect(tx - 9, ty + 11 + wave, 3, 2, 'n'); rect(tx - 7, ty + 9 + wave, 2, 3, 'm');
    // the table: red cloth with gold fringe across the front
    rect(0, 44, PW, 12, 'r'); rect(0, 44, PW, 1, 'R'); for (let X = 0; X < PW; X += 2) px(X, 55, 'y'); for (let X = 3; X < PW; X += 8) { px(X, 48, 'M'); px(X + 1, 49, 'M'); px(X - 1, 49, 'M'); px(X, 50, 'M'); }
    // the crystal ball, front and centre, on a brass stand
    const bx = 30, by = 33, R = 11;
    const glowA = 0.14 + 0.1 * Math.sin(t * 3); x.fillStyle = `rgba(85,255,255,${glowA})`;
    for (let Y = -R - 4; Y <= R + 4; Y++) for (let X = -R - 4; X <= R + 4; X++) { const d = Math.hypot(X, Y); if (d > R && d < R + 4 && (X + Y) % 2 === 0) x.fillRect(bx + X, by + Y, 1, 1); }
    for (let Y = -R; Y <= R; Y++) for (let X = -R; X <= R; X++) {
      const d = Math.hypot(X, Y); if (d > R + 0.3) continue;
      const sw = Math.sin(Math.atan2(Y, X) * 3 + d * 0.7 - t * 2.6), sw2 = Math.sin(X * 0.5 + t * 1.3) * Math.cos(Y * 0.5 - t);
      let col = d > R - 0.9 ? 'B' : sw > 0.6 ? 'C' : sw > 0.1 ? 'c' : sw2 > 0.4 ? 'M' : sw > -0.5 ? 'b' : 'm';
      if ((X === -5 && Y === -6) || (X === -6 && Y === -5) || (X === -4 && Y === -7)) col = 'w';
      if ((X === -6 && Y === -6) || (X === -3 && Y === -7)) col = 'C';
      px(bx + X, by + Y, col);
    }
    // a little fish swimming in the mist inside the ball
    const fxp = Math.round(bx + Math.sin(t * 1.1) * 4), fyp = by + Math.round(Math.cos(t * 0.8) * 2), fd = Math.cos(t * 1.1) > 0 ? 1 : -1;
    rect(fxp - 1, fyp, 3, 1, 'y'); px(fxp + fd * 2, fyp, 'y'); px(fxp - fd * 2, fyp - 1, 'y'); px(fxp - fd * 2, fyp + 1, 'y');
    rect(bx - 6, by + R, 13, 2, 'y'); rect(bx - 8, by + R + 2, 17, 1, 'n'); px(bx - 4, by + R, 'n'); px(bx + 4, by + R, 'n');
    // her hands hovering either side of the ball
    rect(bx - R - 3, by - 2 + wave, 3, 2, 'n'); rect(bx + R + 1, by - 2 - wave, 3, 2, 'n'); px(bx - R - 3, by - 3 + wave, 'n'); px(bx + R + 3, by - 3 - wave, 'n');
    // sparkles orbiting the ball
    for (let i = 0; i < 5; i++) { const an = t * 1.6 + i * Math.PI * 0.4; px(Math.round(bx + Math.cos(an) * (R + 5)), Math.round(by + Math.sin(an) * (R + 3)), i % 2 ? 'M' : 'y'); }
    // candle on the table
    rect(60, 39, 2, 5, 'w'); px(60 + (Math.sin(t * 11) > 0 ? 1 : 0), 37, 'y'); px(60, 38, 'R'); rect(59, 44, 4, 1, 'y');
  }
  function mount(orb) {
    if (orb.dataset.pix) return; orb.dataset.pix = '1';
    const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH; cv.setAttribute('aria-label', 'A glowing crystal ball on a red-clothed table, a fortune teller in a purple shawl behind it and her arched-roof wagon under the night sky');
    orb.innerHTML = ''; orb.appendChild(cv);
    // her words, in the voice of an old-timey fortune teller, typed out like an old game's text box
    const sm = orb.closest('.ltf-oracle-banner') && orb.closest('.ltf-oracle-banner').querySelector('small');
    if (sm && !sm.dataset.said) { sm.dataset.said = '1'; const say = 'Come closer, traveller. Fill her tank, and she shall divine thy songs.';
      sm.setAttribute('aria-label', say); sm.innerHTML = ''; const on = document.createElement('span'), off = document.createElement('span'); off.style.opacity = '0'; off.textContent = say; sm.append(on, off);
      let i = 0; const tick = () => { i++; on.textContent = say.slice(0, i); off.textContent = say.slice(i); if (i < say.length) setTimeout(tick, say[i - 1] === ',' || say[i - 1] === '.' ? 260 : 38); };
      let begun = false; const start = () => { if (begun) return; begun = true; setTimeout(tick, 500); }; setTimeout(start, 3500); if ('IntersectionObserver' in window) { const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); start(); } }); io.observe(sm); } else start(); }
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
