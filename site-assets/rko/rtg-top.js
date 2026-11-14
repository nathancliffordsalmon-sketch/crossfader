/* Rubber Tree Sessions: tidy top. No rainbow page title, the tree first, and one slim Quick Play bar
   (random Like The Fish Spotify playlist, C64 remixes, Kevin MacLeod moods, MOBYGRATIS). */
(function () {
  var css = document.createElement('style');
  css.textContent = [
    'body.page-id-1377 h1.wp-block-post-title{display:none!important}',
    '.ltf-pt.rtg-qp{display:flex!important;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;background:#2a1d14!important;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px 12px!important;margin:0 0 12px!important;box-shadow:none!important}',
    '.ltf-pt.rtg-qp > :not(.rtg-qp-row):not(.msg){display:none!important}',
    '.rtg-qp-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;width:100%}',
    '.rtg-qp-row .lbl{font:600 14px/1 Fraunces,Georgia,serif;color:#f3e8d2;opacity:.8;letter-spacing:.02em}',
    '.rtg-qp-row select{flex:1 1 220px;max-width:420px;font:15px/1.2 Fraunces,Georgia,serif;color:#f3e8d2;background:#1b130d;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:9px 14px;appearance:auto}',
    '.rtg-qp-row button{font:600 15px/1 Fraunces,Georgia,serif;border:0;border-radius:999px;padding:10px 18px;cursor:pointer;background:#ff8a2a;color:#1b130d}',
    '.rtg-qp-row button.stop{background:#3a2a1c;color:#f3e8d2;border:1px solid rgba(255,255,255,.25)}',
    '.ltf-pt.rtg-qp .msg{flex-basis:100%;text-align:center;font-size:13px;color:#f3e8d2;opacity:.85}'
  ].join('\n');
  document.head.appendChild(css);

  var OPTS = [
    ['spotify', '\u{1F3B2} Random Like The Fish playlist (Spotify)'],
    ['c64', '\u{1F579} C64 remixes'],
    ['relaxing', '\u{1F30A} Relaxing · Kevin MacLeod'],
    ['encapsulating', '\u{1F52E} Encapsulating · Kevin MacLeod'],
    ['insanity', '⚡ Insanity · Kevin MacLeod'],
    ['mobygratis-glow', '\u{1F3A7} MOBYGRATIS: Glow'],
    ['mobygratis-drive', '\u{1F3A7} MOBYGRATIS: Drive']
  ];

  function tidy(n) {
    var bar = document.querySelector('.ltf-pt'), rtg = document.getElementById('rtg');
    if (!bar || !rtg) { if (n < 120) setTimeout(function () { tidy(n + 1); }, 150); return; }
    if (bar.classList.contains('rtg-qp')) return;
    // the tree goes first, right under the quick play bar; the intro paragraph follows the tree
    var host = rtg.parentNode, intro = bar.nextElementSibling;
    host.insertBefore(bar, host.firstChild);
    bar.parentNode.insertBefore(rtg, bar.nextSibling);
    if (intro && intro.tagName === 'P' && intro !== rtg) rtg.parentNode.insertBefore(intro, rtg.nextSibling);

    var spMain = bar.querySelector(':scope > button:not(.alt)'), spAgain = bar.querySelector(':scope > button.alt');
    var old = bar.querySelector('.ltf-gmq'); if (old) old.remove();
    bar.classList.add('rtg-qp');
    var row = document.createElement('div'); row.className = 'rtg-qp-row';
    row.innerHTML = '<span class="lbl">Quick play</span><select aria-label="Choose what to play"></select><button type="button" class="go">▶ Play</button><button type="button" class="stop" hidden>⏸ Pause</button>';
    var sel = row.querySelector('select'), go = row.querySelector('.go'), stop = row.querySelector('.stop');
    var have = function (k) { return !/^mobygratis/.test(k) || (window.LTFGM && window.LTFGM.collections.some(function (c) { return c.key === k; })); };
    OPTS.forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1] + (have(o[0]) ? '' : ' (coming soon)'); op.disabled = !have(o[0]); sel.appendChild(op); });
    try { var last = localStorage.getItem('rtg.qp'); if (last && sel.querySelector('option[value="' + last + '"]:not([disabled])')) sel.value = last; } catch (e) {}
    var msg = bar.querySelector('.msg'); bar.insertBefore(row, msg || null);

    var mode = null;
    function gmAudio() { return document.getElementById('rko-audio'); }
    function sync() {
      var a = gmAudio(), playing = mode === 'gm' ? (a && !a.paused) : (mode === 'sp' ? /Pause/.test(spMain ? spMain.textContent : '') : false);
      stop.hidden = !playing;
    }
    setInterval(sync, 700);
    go.addEventListener('click', function () {
      var v = sel.value; try { localStorage.setItem('rtg.qp', v); } catch (e) {}
      if (v === 'spotify') {
        var a = gmAudio(); if (a && !a.paused) a.pause();
        mode = 'sp';
        if (spAgain && !spAgain.hidden) spAgain.click(); else if (spMain) spMain.click();
      } else if (window.rtgGM) {
        mode = 'gm'; window.rtgGM.play(v);
      }
      setTimeout(sync, 300);
      rtg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    stop.addEventListener('click', function () {
      if (mode === 'gm') { var a = gmAudio(); if (a) a.pause(); }
      else if (mode === 'sp' && spMain) spMain.click();
      setTimeout(sync, 300);
    });
    window.addEventListener('ltfgm-ready', function () { [].forEach.call(sel.options, function (op) { if (have(op.value)) { op.disabled = false; op.textContent = op.textContent.replace(' (coming soon)', ''); } }); });
  }
  tidy(0);
})();
