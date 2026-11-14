/* Rubber Tree Sessions: C64 remixes from Remix.Kwed.Org (RKO).
   Every remix streams straight from remix.kwed.org; nothing is rehosted.
   Each song gets a typed thank-you on the wall for its composer, remixer and RKO page. */
(function () {
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/rtg-rko\.js.*$/, '');
  var RKO = 'https://remix.kwed.org';
  function wait(n) { if (window.rtgHook && document.getElementById('rtg-rko')) return init(); if (n > 150) return; setTimeout(function () { wait(n + 1); }, 100); }
  wait(0);

  function init() {
    var host = document.getElementById('rtg-rko'); if (host.dataset.ready) return; host.dataset.ready = '1';
    var H = window.rtgHook, root = document.getElementById('rtg');
    var css = document.createElement('style');
    css.textContent = [
      '#rtg-rko audio{width:100%;margin:8px 0 4px}',
      '#rtg-rko .rko-list{max-height:190px;overflow:auto;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:4px 8px;font-size:13px;line-height:1.35;background:rgba(0,0,0,.18)}',
      '#rtg-rko .rko-list div{cursor:pointer;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06)}',
      '#rtg-rko .rko-list div:hover{color:#fff}',
      '#rtg-rko .rko-list div.cur{color:#ffd27a;font-weight:600}',
      '#rtg-rko .rko-list small{opacity:.65}',
      '#rtg-rko .rko-credit{font-size:13px;line-height:1.55;margin:6px 0}',
      '#rtg-rko .rko-credit a,#rtg-rko .rtg-hint a{color:#7fe0d4;text-decoration:underline}',
      '#rtg-rko select{max-width:100%}'
    ].join('\n');
    document.head.appendChild(css);
    host.innerHTML =
      '<div class="rtg-row"><select id="rko-sel" aria-label="Pick C64 remixes"></select><button type="button" class="btn ghost" id="rko-shuf">Shuffle: on</button></div>' +
      '<audio id="rko-audio" controls preload="none"></audio>' +
      '<div class="rtg-row"><button type="button" class="btn" id="rko-next">⏭ Next remix</button></div>' +
      '<div class="rko-credit" id="rko-credit"></div>' +
      '<div class="rko-list" id="rko-list"></div>' +
      '<p class="rtg-hint">Classic Commodore 64 game music, remixed by fans and streamed straight from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>. ' +
      'Press play and the tree grows; each song types a thank-you on the wall to its composer and remixer. Love one? Visit its RKO page and vote.</p>';

    var sel = host.querySelector('#rko-sel'), au = host.querySelector('#rko-audio'), box = host.querySelector('#rko-list'), credit = host.querySelector('#rko-credit');
    var DATA = null, list = [], order = [], pos = 0, shuffle = true, startedId = null, thankedRKO = false;
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function cur() { return list[order[pos]]; }
    function makeOrder(first) {
      order = list.map(function (_, i) { return i; });
      if (shuffle) for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
      if (first >= 0) { order.splice(order.indexOf(first), 1); order.unshift(first); }
      pos = 0;
    }
    function fill() {
      var g = sel.value; list = DATA.filter(function (x) { return g === '*' ? x.pick : g === 'all' ? true : x.g === g; });
      box.innerHTML = '';
      list.forEach(function (x, i) {
        var d = document.createElement('div');
        d.innerHTML = (x.r === 'Outstanding' ? '★ ' : '') + esc(x.t) + ' <small>— ' + esc(x.a) + ' · ' + esc(x.g) + '</small>';
        d.onclick = function () { makeOrder(i); load(true); };
        box.appendChild(d);
      });
      makeOrder(-1); load(false);
    }
    function load(autoplay) {
      var x = cur(); if (!x) return;
      au.src = RKO + x.dl; startedId = null;
      credit.innerHTML = '<b>' + esc(x.t) + '</b><br>remix by <b>' + esc(x.a) + '</b> · original ' + esc(x.g) + ' music by <b>' + esc(x.c) + '</b>' +
        (x.r ? ' · rated ' + esc(x.r) + ' on RKO' : '') + (x.len ? ' · ' + esc(x.len) : '') +
        '<br><a href="' + RKO + '/remix/' + x.id + '" target="_blank" rel="noopener">RKO page ↗</a>' +
        (x.sid ? ' · <a href="https://deepsid.chordian.net/?file=' + esc(x.sid) + '" target="_blank" rel="noopener">original SID ↗</a>' : '');
      [].forEach.call(box.children, function (d, i) { d.classList.toggle('cur', list[i] === x); });
      if (autoplay) { var p = au.play(); if (p && p.catch) p.catch(function () {}); }
    }
    function wall(text) {
      var inp = root.querySelector('.rtg-wallrow input[type=text]'), b = root.querySelector('.rtg-wallrow button');
      if (!inp || !b) return; var keep = inp.value; inp.value = text; b.click(); inp.value = keep;
    }
    function thank(x) {
      var t = 'Thank you ' + x.c + ' for the ' + x.g + ' music, and ' + x.a + ' for this remix, “' + x.t + '.”' +
        ' remix.kwed.org/remix/' + x.id + (x.r ? ' · rated ' + x.r : '') + (x.date ? ' · ' + x.date : '');
      if (!thankedRKO) { thankedRKO = true; wall('Thank you, Remix.Kwed.Org, home of C64 remakes since 2001, and every remixer keeping the SID alive.'); setTimeout(function () { wall(t); }, 9000); }
      else wall(t);
    }
    au.addEventListener('play', function () {
      if (H.src() !== 'rko') return;
      var x = cur(); if (!x) return;
      if (startedId !== x.id) { startedId = x.id; H.start(x.t + ' — ' + x.a); setTimeout(function () { thank(x); }, 1500); }
      H.play(true);
    });
    au.addEventListener('pause', function () { if (!au.ended) H.play(false); });
    au.addEventListener('ended', function () { H.play(false); pos = (pos + 1) % order.length; load(true); });
    var errs = 0;
    au.addEventListener('error', function () { if (!au.getAttribute('src')) return; errs++; credit.insertAdjacentHTML('afterbegin', '<em>That remix wouldn’t load from RKO, skipping…</em><br>'); if (errs < 5) setTimeout(function () { pos = (pos + 1) % order.length; load(true); }, 1200); });
    au.addEventListener('playing', function () { errs = 0; });
    host.querySelector('#rko-next').onclick = function () { pos = (pos + 1) % order.length; load(true); };
    host.querySelector('#rko-shuf').onclick = function () { shuffle = !shuffle; this.textContent = 'Shuffle: ' + (shuffle ? 'on' : 'off'); var c = order[pos]; makeOrder(c); };
    sel.onchange = fill;
    // leaving the tab pauses the music
    root.querySelectorAll('.rtg-tabs button').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.src !== 'rko' && !au.paused) au.pause(); }); });

    fetch(BASE + 'remixes.json').then(function (r) { return r.json(); }).then(function (j) {
      DATA = j.remixes;
      var o = function (v, t) { var op = document.createElement('option'); op.value = v; op.textContent = t; sel.appendChild(op); };
      o('*', '★ RKO Outstanding starter mix (' + DATA.filter(function (x) { return x.pick; }).length + ')');
      o('all', 'Every remix of these games (' + DATA.length + ')');
      j.games.forEach(function (g) { o(g, g + ' (' + DATA.filter(function (x) { return x.g === g; }).length + ')'); });
      fill();
    }).catch(function () { credit.textContent = 'Couldn’t load the C64 remix list. Try again in a moment.'; });
  }
})();
