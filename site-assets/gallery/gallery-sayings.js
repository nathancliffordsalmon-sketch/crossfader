/* Orange Highlights Gallery: the cut-paper "saying" fish fill the right-hand side, spread down beside the art. */
(function () {
  var SAYINGS = [
    ['Dad Rules', "Don't slam doors, don't play on stairs, and don't eat chips nearby if you aren't going to share."],
    ['Distance', 'Should be measured by how many songs; not miles.'],
    ['Good times', 'If you can have that time all the time.'],
    ["It's got a beat to it", "Something the drummer in my high school rock band used to say before we'd all laugh."],
    ['Karaoke bars are the best', 'Everyone wants to be a rockstar for five minutes; all pretension gone. Fun is the only goal, and being a rockstar.'],
    ['Overcome the messy middle', 'This quote came with the site; but take the time to enjoy the knick-knacks of life! Whatever makes you happy.'],
    ['Saltwater is good for the soul', "Lay in the sand, splash in the waves, hear the sea. It's one of the best playlists."],
    ['Why would we go?', 'What can be better than right here, in a beach chair, drinking a Guinness looking out over the sea? Feet in the sand, surrounded by Anker Soundcore 3i speakers.']
  ];
  var PALS = [
    ['#e63946', '#f4a261', '#2a9d8f', '#264653', '#e9c46a'], ['#0077b6', '#00b4d8', '#90e0ef', '#ff7f50', '#ffd60a'],
    ['#8338ec', '#ff006e', '#fb5607', '#ffbe0b', '#3a86ff'], ['#2d6a4f', '#52b788', '#d00000', '#ffba08', '#1d3557'],
    ['#ff7b00', '#ffb703', '#219ebc', '#023047', '#e76f51'], ['#7209b7', '#4cc9f0', '#f72585', '#4361ee', '#ffd166']
  ];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function tissue(g, x, y, w, h, base, acc) {
    g.save(); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h);
    for (var i = 0; i < 70; i++) { g.globalAlpha = rnd(0.08, 0.28); g.strokeStyle = Math.random() < 0.6 ? pick(acc) : '#fff'; g.lineWidth = rnd(2, 9); g.lineCap = 'round'; g.beginPath(); var sx = rnd(x, x + w), sy = rnd(y, y + h), an = rnd(-0.6, 0.6); g.moveTo(sx, sy); g.quadraticCurveTo(sx + Math.cos(an) * 30, sy + rnd(-12, 12), sx + Math.cos(an) * rnd(40, 90), sy + Math.sin(an) * rnd(10, 40)); g.stroke(); }
    for (var j = 0; j < 160; j++) { g.globalAlpha = rnd(0.1, 0.35); g.fillStyle = Math.random() < 0.5 ? '#fff' : '#000'; g.fillRect(rnd(x, x + w), rnd(y, y + h), rnd(0.8, 2.2), rnd(0.8, 2.2)); }
    g.restore(); g.globalAlpha = 1;
  }
  function paint(cv) {
    var W = 400, H = 300, dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr;
    var g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    var pal = pick(PALS).slice().sort(function () { return Math.random() - 0.5; });
    g.beginPath(); g.rect(0, 0, W, H); tissue(g, 0, 0, W, H, '#e8f6fb', ['#90e0ef', '#bde0fe', '#cdeffa']);
    var cx = W * 0.47, cy = H * 0.52, bw = rnd(120, 150), bh = rnd(62, 84), dir = Math.random() < 0.5 ? 1 : -1;
    g.save(); g.translate(cx, cy); g.scale(dir, 1); g.rotate(rnd(-0.12, 0.12)); g.translate(-cx, -cy);
    g.beginPath(); g.moveTo(cx - bw * 0.85, cy); g.lineTo(cx - bw * 1.45, cy - bh * rnd(0.75, 1)); g.quadraticCurveTo(cx - bw * 1.2, cy, cx - bw * 1.45, cy + bh * rnd(0.75, 1)); g.closePath();
    tissue(g, cx - bw * 1.5, cy - bh, bw, bh * 2, pal[1], [pal[2], pal[4]]);
    g.beginPath(); g.moveTo(cx - bw * 0.35, cy - bh * 0.78); g.quadraticCurveTo(cx - bw * 0.1, cy - bh * 1.55, cx + bw * 0.35, cy - bh * 0.8); g.closePath();
    tissue(g, cx - bw * 0.4, cy - bh * 1.6, bw * 0.8, bh, pal[2], [pal[0], pal[4]]);
    g.beginPath(); g.moveTo(cx - bw * 0.1, cy + bh * 0.8); g.quadraticCurveTo(cx + bw * 0.05, cy + bh * 1.35, cx + bw * 0.3, cy + bh * 0.78); g.closePath();
    tissue(g, cx - bw * 0.15, cy + bh * 0.7, bw * 0.5, bh * 0.7, pal[3], [pal[1]]);
    g.beginPath(); g.moveTo(cx + bw, cy); g.bezierCurveTo(cx + bw * 0.7, cy - bh * 1.15, cx - bw * 0.7, cy - bh * 1.05, cx - bw * 0.9, cy); g.bezierCurveTo(cx - bw * 0.7, cy + bh * 1.05, cx + bw * 0.7, cy + bh * 1.15, cx + bw, cy); g.closePath();
    tissue(g, cx - bw, cy - bh * 1.2, bw * 2, bh * 2.4, pal[0], [pal[1], pal[4], pal[3]]);
    var st = Math.floor(Math.random() * 3);
    for (var k = 0; k < 4; k++) {
      g.beginPath();
      if (st === 0) { var sx = cx - bw * 0.45 + k * bw * 0.28; g.moveTo(sx, cy - bh * 0.85); g.quadraticCurveTo(sx + 18, cy, sx, cy + bh * 0.85); g.lineTo(sx + 16, cy + bh * 0.8); g.quadraticCurveTo(sx + 34, cy, sx + 16, cy - bh * 0.8); }
      else if (st === 1) { g.arc(cx - bw * 0.45 + k * bw * 0.3, cy + (k % 2 ? 14 : -14), rnd(12, 20), 0, 7); }
      else { var zx = cx - bw * 0.5 + k * bw * 0.3; g.moveTo(zx, cy - bh * 0.6); g.lineTo(zx + 22, cy - bh * 0.1); g.lineTo(zx, cy + bh * 0.4); g.lineTo(zx + 14, cy + bh * 0.4); g.lineTo(zx + 34, cy - bh * 0.1); g.lineTo(zx + 14, cy - bh * 0.6); }
      g.closePath(); tissue(g, cx - bw, cy - bh, bw * 2, bh * 2, k % 2 ? pal[3] : pal[4], [pal[2], '#fff']);
    }
    g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.arc(cx + bw * 0.45, cy, bh * 0.55, Math.PI * 0.62, Math.PI * 1.38); g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(cx + bw * 0.66, cy - bh * 0.22, 15, 0, 7); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = '#111'; g.beginPath(); g.arc(cx + bw * 0.7, cy - bh * 0.22, 7, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(cx + bw * 0.72, cy - bh * 0.26, 2.2, 0, 7); g.fill();
    g.strokeStyle = '#111'; g.lineWidth = 3; g.beginPath(); g.arc(cx + bw * 0.86, cy + bh * 0.16, 9, Math.PI * 0.6, Math.PI * 1.2); g.stroke();
    g.restore();
    for (var b = 0; b < 4; b++) { g.beginPath(); g.arc(cx + dir * (bw + 20 + b * 6), cy - 30 - b * 26, 5 + b * 3, 0, 7); g.strokeStyle = 'rgba(0,119,182,.55)'; g.lineWidth = 2; g.stroke(); }
  }

  var CSS = '.ltf-gsay{margin-top:32px;padding:0 var(--wp--preset--spacing--40,16px);box-sizing:border-box}' +
    '.ltf-gsay-stick{position:sticky;top:calc(var(--wp-admin--admin-bar--height,0px) + 24px);display:flex;flex-direction:column;gap:26px}' +
    '.ltf-gsay .ltf-saying{background:#fff;border:1.6px solid #2b1055;border-radius:14px;box-shadow:4px 4px 0 #2b1055;padding:12px 12px 14px;text-align:center;transform:rotate(var(--tilt,0deg));max-width:340px;margin:0 auto;width:100%;box-sizing:border-box;transition:opacity .5s,transform .5s}' +
    '.ltf-gsay .ltf-saying.out{opacity:0;transform:rotate(var(--tilt,0deg)) translateY(10px)}' +
    '.ltf-gsay canvas.ltf-carle{display:block;width:80%;height:auto;aspect-ratio:4/3;margin:0 auto 6px}' +
    '.ltf-gsay h4{font-size:1.1rem;margin:0 0 4px;line-height:1.2}.ltf-gsay p{font-size:.88rem;line-height:1.4;margin:0}' +
    '@media (max-width:781px){.ltf-gsay{height:auto!important}.ltf-gsay-stick{position:static;display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.ltf-gsay .ltf-saying{transform:none}}' +
    '@media (max-width:480px){.ltf-gsay-stick{grid-template-columns:1fr}}';

  function make(q, i) {
    var c = document.createElement('div'); c.className = 'ltf-saying'; c.style.setProperty('--tilt', (i % 2 ? 1.5 : -1.5) + 'deg');
    var cv = document.createElement('canvas'); cv.className = 'ltf-carle'; cv.setAttribute('aria-hidden', 'true'); c.appendChild(cv);
    var h = document.createElement('h4'); c.appendChild(h); var p = document.createElement('p'); c.appendChild(p);
    fill(c, q); return c;
  }
  function fill(c, q) { c.querySelector('h4').textContent = q[0]; c.querySelector('p').textContent = q[1]; c._q = q; paint(c.querySelector('canvas')); }

  function init() {
    var main = document.querySelector('main .wp-block-columns > .wp-block-column');
    var side = main && main.nextElementSibling;
    if (!side || side.querySelector('.ltf-gsay')) return;
    var s = document.createElement('style'); s.id = 'ltf-gsay-css'; s.textContent = CSS; document.head.appendChild(s);
    var deck = SAYINGS.slice().sort(function () { return Math.random() - 0.5; });
    var box = document.createElement('div'); box.className = 'ltf-gsay';
    var stick = document.createElement('div'); stick.className = 'ltf-gsay-stick'; box.appendChild(stick);
    side.appendChild(box);
    var wide = false, di = 0;
    function build() {
      var w = innerWidth >= 782; if (w === wide && stick.children.length) return; wide = w;
      stick.innerHTML = ''; di = 0;
      var n = w ? (innerHeight >= 1050 ? 3 : 2) : deck.length;
      for (var i = 0; i < n; i++) stick.appendChild(make(deck[di++ % deck.length], i));
    }
    // the side column stretches the full length of the gallery; the fish ride down it as you scroll
    function fit() {
      build(); box.style.height = '';
      if (!wide) return;
      var room = main.getBoundingClientRect().bottom - box.getBoundingClientRect().top;
      if (room > stick.offsetHeight) box.style.height = room + 'px';
    }
    fit(); addEventListener('resize', fit); addEventListener('load', fit); setTimeout(fit, 2500);
    if (window.ResizeObserver) { var rt; new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(fit, 150); }).observe(main); }
    var k = 0;
    setInterval(function () {
      if (!wide || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var cards = stick.children, c = cards[k++ % cards.length], showing = [].map.call(cards, function (x) { return x._q; }), q;
      do { q = deck[di++ % deck.length]; } while (showing.indexOf(q) >= 0);
      c.classList.add('out'); setTimeout(function () { fill(c, q); c.classList.remove('out'); }, 520);
    }, 8000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
