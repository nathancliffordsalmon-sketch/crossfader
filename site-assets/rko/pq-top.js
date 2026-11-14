/* Phantasea Sessions: tidy top. No rainbow page title, the game first, and one slim Quick Play bar
   (random Like The Fish Spotify playlist, C64 remixes, Kevin MacLeod moods, MOBYGRATIS). */
(function () {
  var css = document.createElement('style');
  css.textContent = [
    'body.page-id-1385 h1.wp-block-post-title{display:none!important}',
    '.ltf-pt.rtg-qp{display:flex!important;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;background:#1a1440!important;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px 12px!important;margin:0 0 12px!important;box-shadow:none!important}',
    '.ltf-pt.rtg-qp > :not(.rtg-qp-row):not(.msg){display:none!important}',
    '.rtg-qp-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;width:100%}',
    '.rtg-qp-row .lbl{font:10px/1 "Press Start 2P",monospace;color:#e8e4ff;opacity:.8;letter-spacing:.02em}',
    '.rtg-qp-row select{flex:1 1 220px;max-width:420px;font:10px/1.4 "Press Start 2P",monospace;color:#e8e4ff;background:#0f0b2a;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:9px 14px;appearance:auto}',
    '.rtg-qp-row button{font:11px/1 "Press Start 2P",monospace;border:0;border-radius:999px;padding:10px 18px;cursor:pointer;background:#ffd84a;color:#1a1140}',
    '.rtg-qp-row button.stop{background:#2a2160;color:#e8e4ff;border:1px solid rgba(255,255,255,.25)}',
    '.ltf-pt.rtg-qp .msg{flex-basis:100%;text-align:center;font-size:13px;color:#e8e4ff;opacity:.85}',
    '@media (max-width:600px){.rtg-qp-row{flex-wrap:nowrap;gap:6px}.rtg-qp-row .lbl{display:none}.rtg-qp-row select{flex:1 1 0;min-width:0;font-size:9px;padding:9px 10px}.rtg-qp-row button{padding:10px 14px;white-space:nowrap}.ltf-pt.rtg-qp{padding:8px!important}}'
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
    var bar = document.querySelector('.ltf-pt'), rtg = document.getElementById('pq-root');
    if (!bar || !rtg) { if (n < 120) setTimeout(function () { tidy(n + 1); }, 150); return; }
    if (bar.classList.contains('rtg-qp')) return;
    // the tree goes first, right under the quick play bar; the intro paragraph follows the tree
    var host = bar.parentNode, intro = bar.nextElementSibling;
    while (rtg.parentNode !== host && rtg.parentNode) rtg = rtg.parentNode;
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
    try { var last = localStorage.getItem('pq.qp'); if (last && sel.querySelector('option[value="' + last + '"]:not([disabled])')) sel.value = last; } catch (e) {}
    var msg = bar.querySelector('.msg'); bar.insertBefore(row, msg || null);

    var mode = null;
    function gmAudio() { return document.getElementById('pq-gmau'); }
    function sync() {
      var a = gmAudio(), playing = mode === 'gm' ? (a && !a.paused) : (mode === 'sp' ? /Pause/.test(spMain ? spMain.textContent : '') : false);
      stop.hidden = !playing;
    }
    setInterval(sync, 700);
    go.addEventListener('click', function () {
      var v = sel.value; try { localStorage.setItem('pq.qp', v); } catch (e) {}
      if (v === 'spotify') {
        var a = gmAudio(); if (a && !a.paused) a.pause();
        mode = 'sp';
        if (spAgain && !spAgain.hidden) spAgain.click(); else if (spMain) spMain.click();
      } else if (window.pqGM) {
        mode = 'gm'; window.pqGM.play(v);
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
