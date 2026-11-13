(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var INK = '#2b1055';
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.round(w * DPR); c.height = Math.round(h * DPR); c.style.width = w + 'px'; c.style.height = h + 'px'; var x = c.getContext('2d'); x.setTransform(DPR, 0, 0, DPR, 0, 0); return { c: c, x: x }; }
  function visible(el) { var r = el.getBoundingClientRect(); return r.bottom > -100 && r.top < innerHeight + 100; }

  /* ---------- painted (Eric Carle-ish) fish sprites ---------- */
  var PALS = [['#ff7a2f', '#ffd60a', '#e63946'], ['#2ec4b6', '#90e0ef', '#ff006e'], ['#4bb3ff', '#ffd60a', '#0077b6'], ['#a46be0', '#ffbe0b', '#ff5e1a'], ['#52b788', '#ffba08', '#d00000'], ['#ff5e8a', '#ffd6e0', '#7209b7']];
  function paintFish(w, h, pal) {
    var o = mk(w, h), x = o.x, bx = w * 0.44, by = h / 2, rx = w * 0.34, ry = h * 0.36;
    x.save(); x.beginPath(); x.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2); x.moveTo(bx + rx * 0.85, by); x.lineTo(w - 1, by - ry * 1.05); x.lineTo(w - 3, by); x.lineTo(w - 1, by + ry * 1.05); x.closePath(); x.clip();
    x.fillStyle = pal[0]; x.fillRect(0, 0, w, h);
    for (var i = 0; i < 40; i++) { x.strokeStyle = 'rgba(255,255,255,' + rnd(0.05, 0.22) + ')'; x.lineWidth = rnd(0.6, 1.6); x.beginPath(); var sx = rnd(0, w), sy = rnd(0, h); x.moveTo(sx, sy); x.lineTo(sx + rnd(-6, 6), sy + rnd(-3, 3)); x.stroke(); }
    for (var k = 0; k < 3; k++) { x.fillStyle = k % 2 ? pal[2] : pal[1]; x.globalAlpha = 0.85; x.beginPath(); var sx2 = bx - rx * 0.5 + k * rx * 0.42; x.moveTo(sx2, 0); x.quadraticCurveTo(sx2 + 3, h / 2, sx2, h); x.lineTo(sx2 + rx * 0.16, h); x.quadraticCurveTo(sx2 + rx * 0.16 + 3, h / 2, sx2 + rx * 0.16, 0); x.fill(); }
    x.globalAlpha = 1; x.restore();
    x.strokeStyle = INK; x.lineWidth = 1; x.beginPath(); x.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.moveTo(bx + rx * 0.9, by); x.lineTo(w - 1, by - ry * 1.05); x.lineTo(w - 3, by); x.lineTo(w - 1, by + ry * 1.05); x.closePath(); x.stroke();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(bx - rx * 0.55, by - ry * 0.2, Math.max(1.6, h * 0.13), 0, 7); x.fill(); x.stroke();
    x.fillStyle = INK; x.beginPath(); x.arc(bx - rx * 0.6, by - ry * 0.2, Math.max(0.8, h * 0.065), 0, 7); x.fill();
    x.beginPath(); x.arc(bx - rx * 0.78, by + ry * 0.35, h * 0.08, 0.2, 2.2); x.stroke();
    return o.c;
  }
  function fishSet(w, h) { return PALS.map(function (p) { return paintFish(w, h, p); }); }

  /* ---------- 1. fish queueing for the gallery door ---------- */
  function gallery() {
    var a = [].slice.call(document.querySelectorAll('.ltf-oh a')).filter(function (e) { return /whole gallery/i.test(e.textContent); })[0];
    if (!a) return; var host = a.closest('p') || a.parentElement; if (host.querySelector('.ltf-gq')) return;
    host.style.display = 'flex'; host.style.alignItems = 'center'; host.style.gap = '8px';
    var W = Math.max(90, Math.min(150, host.getBoundingClientRect().width - a.getBoundingClientRect().width - 10)), H = 44;
    var o = mk(W, H); o.c.className = 'ltf-gq'; o.c.setAttribute('aria-hidden', 'true'); host.appendChild(o.c);
    var x = o.x, fishes = fishSet(18, 11), doorX = W - 30, q = [], t0 = 0;
    for (var i = 0; i < 4; i++) q.push({ img: fishes[i % fishes.length], x: doorX - 20 - i * 20, tx: doorX - 20 - i * 20, a: 1, ph: Math.random() * 6 });
    var nextAt = 2500;
    function draw(t) {
      x.clearRect(0, 0, W, H);
      // gallery: little building with a lit door and a picture
      x.fillStyle = '#fff6e6'; x.strokeStyle = INK; x.lineWidth = 1.5; x.fillRect(doorX - 2, 6, 30, H - 8); x.strokeRect(doorX - 2, 6, 30, H - 8);
      x.fillStyle = '#ff5e1a'; x.beginPath(); x.moveTo(doorX - 5, 7); x.lineTo(doorX + 13, 0.5); x.lineTo(doorX + 31, 7); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = '#ffd36b'; x.fillRect(doorX + 5, 22, 14, H - 24); x.strokeRect(doorX + 5, 22, 14, H - 24);
      x.fillStyle = 'rgba(255,170,40,.35)'; x.beginPath(); x.moveTo(doorX + 5, H - 2); x.lineTo(doorX - 8, H); x.lineTo(doorX + 19, H); x.fill();
      x.fillStyle = '#9be36b'; x.fillRect(doorX + 6, 10, 12, 8); x.strokeStyle = '#7a4a1c'; x.lineWidth = 1.5; x.strokeRect(doorX + 6, 10, 12, 8);
      x.fillStyle = INK; x.font = '600 6px "Courier New",monospace'; x.textAlign = 'center'; x.fillText('ART', doorX + 12, 30);
      // the queue
      if (t - t0 > nextAt) { t0 = t; nextAt = rnd(1800, 3200); var f = q[0]; f.entering = true; f.tx = doorX + 10; q.forEach(function (g, k) { if (k) g.tx = doorX - 20 - (k - 1) * 20; }); q.push({ img: pick(fishes), x: -20, tx: doorX - 20 - (q.length - 1) * 20, a: 0, ph: Math.random() * 6 }); }
      q = q.filter(function (f) { return !(f.entering && f.a <= 0); });
      q.forEach(function (f) {
        f.x += (f.tx - f.x) * 0.06; if (f.entering && f.x > doorX + 2) f.a -= 0.06; else if (f.a < 1) f.a += 0.05;
        var bob = Math.sin(t / 380 + f.ph) * 1.5; x.save(); x.globalAlpha = Math.max(0, Math.min(1, f.a)); x.translate(f.x + 9, H - 14 + bob); x.scale(-1, 1); x.drawImage(f.img, -9, -5.5, 18, 11); x.restore();
        if (!f.entering && Math.sin(t / 900 + f.ph) > 0.97) { x.fillStyle = 'rgba(120,180,255,.7)'; x.beginPath(); x.arc(f.x + 16, H - 22 - (t / 30 % 8), 1.4, 0, 7); x.fill(); }
      });
    }
    return { el: o.c, draw: draw };
  }

  /* ---------- 2. fish orchestra under a blue moon beside the playlist buttons ---------- */
  function orchestra() {
    var box = document.querySelector('.ltf-feat-btns'); if (!box || box.querySelector('.ltf-orch')) return;
    box.style.position = 'relative';
    var o = mk(10, 10); o.c.className = 'ltf-orch'; o.c.setAttribute('aria-hidden', 'true'); o.c.style.cssText += ';position:absolute;pointer-events:none;top:0;right:0'; box.appendChild(o.c);
    var fishes = fishSet(26, 16), band = [{ k: 'violin', f: fishes[2] }, { k: 'trumpet', f: fishes[0] }, { k: 'drum', f: fishes[3] }, { k: 'baton', f: fishes[5] }], notes = [], W = 0, H = 0, rows = null;
    function layout() {
      var b = box.getBoundingClientRect(), btns = [].slice.call(box.children).filter(function (c) { return c.tagName === 'A' || c.tagName === 'BUTTON'; });
      var r1 = btns.filter(function (c) { return Math.abs(c.getBoundingClientRect().top - b.top) < 6; }), r2 = btns.filter(function (c) { return c.getBoundingClientRect().top - b.top > 20; });
      var e1 = Math.max.apply(null, r1.map(function (c) { return c.getBoundingClientRect().right; }).concat([b.left])) - b.left, e2 = Math.max.apply(null, r2.map(function (c) { return c.getBoundingClientRect().right; }).concat([b.left])) - b.left;
      var w = Math.round(b.width - Math.min(e1, e2) - 6), h = Math.round(Math.max(70, b.height));
      if (w !== W || h !== H) { W = w; H = h; o.c.width = W * DPR; o.c.height = H * DPR; o.c.style.width = W + 'px'; o.c.style.height = H + 'px'; o.x.setTransform(DPR, 0, 0, DPR, 0, 0); }
      rows = { top: b.width - e1 - 8, bot: b.width - e2 - 8 }; // free widths on each row (from the right edge)
    }
    layout(); addEventListener('resize', layout);
    function inst(x, k, t, cx, cy) {
      x.strokeStyle = INK; x.lineWidth = 1;
      if (k === 'violin') { x.fillStyle = '#b5651d'; x.beginPath(); x.ellipse(cx - 9, cy + 4, 4, 5.5, -0.5, 0, 7); x.fill(); x.stroke(); x.beginPath(); x.moveTo(cx - 6, cy); x.lineTo(cx - 1, cy - 6); x.stroke(); var s = Math.sin(t / 160) * 4; x.strokeStyle = '#7a4a1c'; x.beginPath(); x.moveTo(cx - 16 + s, cy - 2); x.lineTo(cx - 3 + s, cy + 9); x.stroke(); }
      if (k === 'trumpet') { x.fillStyle = '#ffcf40'; x.beginPath(); x.moveTo(cx - 13, cy + 1); x.lineTo(cx - 20, cy - 3); x.lineTo(cx - 20, cy + 6); x.closePath(); x.fill(); x.stroke(); x.fillRect(cx - 14, cy, 6, 2); }
      if (k === 'drum') { x.fillStyle = '#e63946'; x.fillRect(cx - 7, cy + 7, 14, 7); x.strokeRect(cx - 7, cy + 7, 14, 7); x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx, cy + 7, 7, 2, 0, 0, 7); x.fill(); x.stroke(); var h2 = Math.abs(Math.sin(t / 220)) * 4; x.strokeStyle = '#7a4a1c'; x.beginPath(); x.moveTo(cx - 9, cy - 2 - h2); x.lineTo(cx - 3, cy + 6); x.stroke(); }
      if (k === 'baton') { var a = Math.sin(t / 300) * 0.8; x.strokeStyle = '#fff'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx - 8, cy); x.lineTo(cx - 8 - Math.cos(a) * 10, cy - 6 - Math.sin(a) * 6); x.stroke(); }
    }
    function draw(t) {
      if (!rows) return; var x = o.x; x.clearRect(0, 0, W, H);
      // blue moon, top right
      var mx = W - 16, my = 14, g = x.createRadialGradient(mx, my, 2, mx, my, 22); g.addColorStop(0, 'rgba(120,180,255,.45)'); g.addColorStop(1, 'rgba(120,180,255,0)'); x.fillStyle = g; x.fillRect(mx - 24, my - 24, 48, 48);
      x.fillStyle = '#6fb4ff'; x.beginPath(); x.arc(mx, my, 10, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 1.4; x.stroke();
      x.fillStyle = 'rgba(30,80,170,.35)'; [[-3, -3, 2.4], [3, 2, 1.8], [-2, 5, 1.3]].forEach(function (c) { x.beginPath(); x.arc(mx + c[0], my + c[1], c[2], 0, 7); x.fill(); });
      for (var s = 0; s < 5; s++) { var tw = (Math.sin(t / 500 + s * 2) + 1) / 2; x.fillStyle = 'rgba(255,214,10,' + (0.3 + tw * 0.7) + ')'; var sx = W - 40 - s * 13 % 30, sy = 6 + (s * 7) % 16; if (W - sx < rows.top) { x.fillRect(sx, sy, 2, 2); } }
      // the band sits on the second row's free space
      var n = Math.max(1, Math.min(band.length, Math.floor(rows.bot / 34))), y0 = H - 17;
      for (var i = 0; i < n; i++) {
        var b = band[i], cx = W - 18 - i * 34 - (i ? 0 : 0), bob = Math.sin(t / 260 + i * 1.3) * 1.6, cy = y0 + bob;
        x.save(); x.translate(cx, cy); x.scale(-1, 1); x.drawImage(b.f, -13, -8, 26, 16); x.restore();
        inst(x, b.k, t + i * 90, cx, cy);
        if (Math.random() < 0.012) notes.push({ x: cx - 6, y: cy - 8, t: 0, c: pick(['#ff5e1a', '#ffd60a', '#2ec4b6', '#a46be0', '#ff006e']), s: pick(['♪', '♫', '♩']) });
      }
      notes = notes.filter(function (q) { return (q.t += 16) < 1800; });
      notes.forEach(function (q) { var k = q.t / 1800; var nx = q.x + Math.sin(k * 6) * 4, ny = q.y - k * 34; if (W - nx > rows.top + 4 && ny < 34) return; x.globalAlpha = 1 - k; x.fillStyle = q.c; x.font = '700 11px Arial,sans-serif'; x.fillText(q.s, nx, ny); x.globalAlpha = 1; });
    }
    return { el: box, draw: draw };
  }

  /* ---------- 3. the Marbles bowl: an ant kicks marbles out of the ant hill into a little bowl ---------- */
  function marbles() {
    var box = document.getElementById('ltf-marbles'); if (!box || document.querySelector('.ltf-mbowl')) return;
    var screen = box.querySelector('.lm-screen');
    var a = document.createElement('a'); a.href = '/marbles/'; a.className = 'ltf-mbowl'; a.setAttribute('aria-label', 'Open Marbles');
    a.innerHTML = '<svg viewBox="0 0 340 142" role="img" aria-label="A little bowl spelling MARBLES"><defs><linearGradient id="lmbL" x1="0" x2="1"><stop offset="0" stop-color="#ff5e1a"/><stop offset=".3" stop-color="#ffd60a"/><stop offset=".55" stop-color="#2ec4b6"/><stop offset=".8" stop-color="#4bb3ff"/><stop offset="1" stop-color="#a46be0"/></linearGradient>' +
      '<path id="lmbRail" d="M16 6 C16 80, 62 102, 170 102 C278 102, 324 80, 324 6"/><path id="lmbText" d="M26 44 C34 118, 80 138, 170 138 C260 138, 306 118, 314 44"/></defs>' +
      '<use href="#lmbRail" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/><use href="#lmbRail" fill="none" stroke="#b48ad6" stroke-width="3.5" stroke-linecap="round"/>' +
      '<text font-family="Luckiest Guy, sans-serif" font-size="28" letter-spacing="9" fill="url(#lmbL)" stroke="' + INK + '" stroke-width="1.6" paint-order="stroke"><textPath href="#lmbText" startOffset="50%" text-anchor="middle">MARBLES</textPath></text></svg>';
    box.parentNode.insertBefore(a, box.nextSibling);
    if (RM) return;
    var svg = a.querySelector('svg'), rail = a.querySelector('#lmbRail');
    var cv = document.createElement('canvas'); cv.className = 'ltf-mcv'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var cx = cv.getContext('2d'), CW = 0, CH = 0;
    function size() { CW = innerWidth; CH = innerHeight; cv.width = CW * DPR; cv.height = CH * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); }
    size(); addEventListener('resize', size);
    var COLS = ['#ff5e1a', '#ffd60a', '#2ec4b6', '#4bb3ff', '#a46be0', '#ff006e', '#52b788', '#ffffff'];
    var R = 4.6, G = 1500, S = [], L = [], total = 0, built = 0, pile = [], free = [], rolling = [], spills = 0, emptying = false, ant = { t: 0, phase: 'rest' }, lastSpawn = 0;
    function build() {
      var len = rail.getTotalLength(), m = svg.getScreenCTM(); if (!m) return; S = []; L = []; total = 0;
      for (var i = 0; i <= 120; i++) { var p = rail.getPointAtLength(len * i / 120), sx = m.a * p.x + m.c * p.y + m.e + scrollX, sy = m.b * p.x + m.d * p.y + m.f + scrollY; S.push([sx, sy]); }
      for (var j = 0; j < S.length; j++) { if (j) total += Math.hypot(S[j][0] - S[j - 1][0], S[j][1] - S[j - 1][1]); L.push(total); }
      var scale = Math.hypot(m.a, m.b); R = Math.max(3.6, 9.5 * scale); built = performance.now();
    }
    function at(s, off) { // point + inward normal on the rail at arc length s, raised by off
      s = Math.max(0, Math.min(total, s)); var i = 1; while (i < L.length - 1 && L[i] < s) i++;
      var k = (s - L[i - 1]) / Math.max(0.001, L[i] - L[i - 1]), x = S[i - 1][0] + (S[i][0] - S[i - 1][0]) * k, y = S[i - 1][1] + (S[i][1] - S[i - 1][1]) * k;
      var tx = S[i][0] - S[i - 1][0], ty = S[i][1] - S[i - 1][1], tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl; var nx = ty, ny = -tx; // inward (up at the bottom)
      return { x: x + nx * off, y: y + ny * off, tx: tx, ty: ty };
    }
    function slots() { // where settled marbles sit: rows stacked in the bottom of the bowl
      var out = [], mid = total / 2, base = R + 2.2, rowN = [7, 6, 5, 4];
      for (var r = 0; r < rowN.length; r++) for (var k = 0; k < rowN[r]; k++) {
        var off = (k - (rowN[r] - 1) / 2) * 2 * R * 1.02, p = at(mid + off, base);
        out.push({ x: p.x, y: p.y - r * R * 1.74 });
      }
      return out;
    }
    function marble(x, y, vx, vy) { return { x: x, y: y, vx: vx, vy: vy, c: pick(COLS), r: R }; }
    function spawn(now) {
      var sr = screen.getBoundingClientRect(), hx = sr.left + scrollX + sr.width * 0.165, hy = sr.top + scrollY + sr.height * 0.4;
      var tgx = S[0][0] + (S[S.length - 1][0] - S[0][0]) * rnd(0.22, 0.4), dy = Math.max(40, S[0][1] - hy), vy0 = -150;
      var tfall = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * G * dy)) / G; free.push(marble(hx, hy, (tgx - hx) / tfall, vy0)); lastSpawn = now;
    }
    function drawBall(m, sy) { var g = cx.createRadialGradient(m.x - m.r * 0.35, m.y - sy - m.r * 0.4, 0.5, m.x, m.y - sy, m.r); g.addColorStop(0, '#fff'); g.addColorStop(0.3, m.c); g.addColorStop(1, shade(m.c)); cx.fillStyle = g; cx.beginPath(); cx.arc(m.x - scrollX, m.y - sy, m.r, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(43,16,85,.6)'; cx.lineWidth = 0.8; cx.stroke(); }
    function shade(h) { var n = parseInt(h.slice(1), 16), r = (n >> 16) * 0.45, g = (n >> 8 & 255) * 0.45, b = (n & 255) * 0.45; return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')'; }
    function drawAnt(t) {
      var sr = screen.getBoundingClientRect(); if (sr.bottom < 0 || sr.top > CH) return;
      var hx = sr.left + sr.width * 0.165, hy = sr.top + sr.height * 0.4, k;
      if (ant.phase === 'up') k = Math.min(1, ant.t / 900); else if (ant.phase === 'down') k = Math.max(0, 1 - ant.t / 900); else k = 0;
      var ax = hx - 20 + 18 * k, ay = hy + 18 - 17 * k, leg = Math.sin(t / 60) * 1.2 * (ant.phase === 'rest' ? 0 : 1);
      cx.fillStyle = '#1a0f0a'; cx.strokeStyle = '#1a0f0a'; cx.lineWidth = 0.7;
      [[-3.2, 1.3], [0, 1], [2.8, 1.5]].forEach(function (s) { cx.beginPath(); cx.arc(ax + s[0], ay, s[1], 0, 7); cx.fill(); });
      for (var l = -1; l <= 1; l++) { cx.beginPath(); cx.moveTo(ax + l * 1.2, ay); cx.lineTo(ax + l * 1.6 + leg * (l % 2 ? 1 : -1), ay + 2.4); cx.stroke(); }
      cx.beginPath(); cx.moveTo(ax + 3.6, ay - 0.8); cx.lineTo(ax + 5, ay - 2.8); cx.stroke();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.033, (now - last) / 1000); last = now;
      if (!S.length || now - built > 1500) build(); if (!S.length) return;
      var seen = visible(box) || visible(a);
      // ant + spawning (only while the box is on screen)
      if (seen && !emptying) {
        ant.t += dt * 1000;
        if (ant.phase === 'rest' && now - lastSpawn > 2300) { ant.phase = 'up'; ant.t = 0; }
        else if (ant.phase === 'up' && ant.t > 900) { spawn(now); ant.phase = 'down'; ant.t = 0; }
        else if (ant.phase === 'down' && ant.t > 900) { ant.phase = 'rest'; ant.t = 0; }
      }
      var SL = slots(), full = pile.length >= SL.length, topY = pile.length ? Math.min.apply(null, pile.map(function (p) { return p.y; })) : 1e9;
      // free-falling marbles
      free.forEach(function (m) {
        m.vy += G * dt; m.x += m.vx * dt; m.y += m.vy * dt;
        if (m.out) return;
        if (m.vy > 0 && m.x > S[0][0] && m.x < S[S.length - 1][0]) {
          if (full && m.y > topY - R * 1.5 && m.y < topY + R) { m.vy = -Math.abs(m.vy) * 0.35; m.vx = (m.x < (S[0][0] + S[S.length - 1][0]) / 2 ? -1 : 1) * rnd(90, 160); m.out = true; spills++; return; }
          var best = 1e9, bi = 0; for (var i = 0; i < S.length; i += 2) { var p = at(L[i], R + 2.2), d = Math.hypot(p.x - m.x, p.y - m.y); if (d < best) { best = d; bi = i; } }
          if (best < R * 1.2) { var q = at(L[bi], R + 2.2); m.s = L[bi]; m.v = (m.vx * q.tx + m.vy * q.ty) * 0.8; m.dead = true; if (!full) rolling.push(m); }
        }
      });
      free = free.filter(function (m) { return !m.dead && m.y < scrollY + CH + 80 && m.y < document.documentElement.scrollHeight + 40; });
      // rolling back and forth in the bowl, then settling into the next free slot
      rolling.forEach(function (m) {
        var p = at(m.s, R + 2.2 + Math.floor(pile.length / 7) * R * 1.2), slope = p.ty; m.v += (G * slope - m.v * 1.6) * dt; m.s += m.v * dt;
        if (m.s < 2 || m.s > total - 2) { m.v = -m.v * 0.5; m.s = Math.max(2, Math.min(total - 2, m.s)); }
        var q = at(m.s, R + 2.2 + Math.floor(pile.length / 7) * R * 1.2); m.x = q.x; m.y = q.y; m.life = (m.life || 0) + dt;
        if ((Math.abs(m.v) < 18 && Math.abs(m.s - total / 2) < total * 0.18) || m.life > 6) { var sl = SL[pile.length]; if (sl) { m.settle = sl; pile.push(m); } m.done = true; }
      });
      rolling = rolling.filter(function (m) { return !m.done; });
      pile.forEach(function (m) { var s = m.settle; m.x += (s.x - m.x) * 0.2; m.y += (s.y - m.y) * 0.2; });
      // once full and a few have spilled, everything tumbles out over the rim and off the page
      if (full && spills >= 6 && !emptying) { emptying = true; pile.forEach(function (m, i) { m.vx = (m.x < (S[0][0] + S[S.length - 1][0]) / 2 ? -1 : 1) * rnd(70, 200); m.vy = -rnd(120, 320); m.out = true; free.push(m); }); pile = []; spills = 0; setTimeout(function () { emptying = false; }, 2500); }
      // draw
      cx.clearRect(0, 0, CW, CH); var sy = scrollY;
      drawAnt(now);
      pile.concat(rolling, free).forEach(function (m) { if (m.y - sy > -20 && m.y - sy < CH + 20) drawBall(m, sy); });
    }
    return { el: box, draw: step, always: true };
  }

  function start() {
    var parts = [gallery(), orchestra(), marbles()].filter(Boolean); if (!parts.length) return;
    if (RM) { parts.forEach(function (p) { p.draw(0); }); return; }
    (function loop(t) { parts.forEach(function (p) { if (p.always || visible(p.el)) p.draw(t); }); requestAnimationFrame(loop); })(performance.now());
  }
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();
