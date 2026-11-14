/* Top-bar quick play for game music, next to "Play a random Like The Fish playlist". */
(function () {
  var OPTS = [['c64', '\u{1F579} C64 remixes'], ['relaxing', '\u{1F30A} Relaxing'], ['encapsulating', '\u{1F52E} Encapsulating'], ['insanity', '⚡ Insanity']];
  function target() { return window.rtgGM || window.pqGM || window.RAgm || null; }
  function add(n) {
    var bar = document.querySelector('.ltf-pt');
    if (!bar) { if (n < 100) setTimeout(function () { add(n + 1); }, 150); return; }
    if (bar.querySelector('.ltf-gmq')) return;
    var css = document.createElement('style');
    css.textContent = '.ltf-pt .ltf-gmq{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center}.ltf-pt .ltf-gmq select{font:inherit;font-size:14px;padding:8px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:#2a1d14;color:#f3e8d2;max-width:60vw}';
    document.head.appendChild(css);
    var wrap = document.createElement('span'); wrap.className = 'ltf-gmq';
    var sel = document.createElement('select'); sel.setAttribute('aria-label', 'Game music to quick play');
    OPTS.forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.appendChild(op); });
    var go = document.createElement('button'); go.type = 'button'; go.className = 'alt'; go.textContent = '\u{1F3AE} Quick play game music';
    go.addEventListener('click', function () { var t = target(); if (t) t.play(sel.value); });
    wrap.appendChild(go); wrap.appendChild(sel);
    var msg = bar.querySelector('.msg'); bar.insertBefore(wrap, msg || null);
  }
  add(0);
})();
