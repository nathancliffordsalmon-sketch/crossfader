/* RetroAmp: C64 remixes from Remix.Kwed.Org (RKO).
   Every remix streams straight from remix.kwed.org; nothing is rehosted.
   RKO doesn't send CORS headers, so the browser won't let the page analyse the audio:
   the visualizers follow a beat model instead, and the EQ can't touch these streams. */
(function () {
  var root = document.getElementById('retroamp');
  if (!root || root.dataset.rko) return;
  function waitRA(n) { if (window.RA) return init(); if (n > 100) return; setTimeout(function () { waitRA(n + 1); }, 100); }
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/retroamp-rko\.js.*$/, '');
  var RKO = 'https://remix.kwed.org';
  waitRA(0);

  function init() {
    root.dataset.rko = '1';
    var RA = window.RA, $ = RA.el;
    var css = document.createElement('style');
    css.textContent = [
      '#retroamp .ra-marquee.ra-tick{position:relative;overflow:hidden;white-space:nowrap}',
      '#retroamp .ra-marquee.ra-tick span{display:inline-block;padding-left:100%;animation:raTick var(--dur,30s) linear infinite}',
      '@keyframes raTick{from{transform:translateX(0)}to{transform:translateX(-100%)}}',
      '#retroamp .ra-rko{display:none;background:var(--ra-panel);border:1px solid var(--ra-edge);border-radius:6px;padding:10px;margin:8px 0}',
      '#retroamp .ra-rko.on{display:block}',
      '#retroamp .ra-rko .ra-row{margin:0 0 8px}',
      '#retroamp .ra-rko select{max-width:100%}',
      '#retroamp .ra-rkolist{max-height:220px;overflow:auto;background:var(--ra-lcd);border:2px inset #555;border-radius:4px;font:12px "Courier New",monospace;color:var(--ra-green);padding:4px 8px}',
      '#retroamp .ra-rkolist div{cursor:pointer;padding:3px 0;border-bottom:1px solid rgba(57,255,106,.08)}',
      '#retroamp .ra-rkolist div:hover{color:#fff}',
      '#retroamp .ra-rkolist div.cur{color:var(--ra-amber)}',
      '#retroamp .ra-rkolist small{opacity:.65}',
      '#retroamp .ra-rkolist .st{color:var(--ra-amber)}',
      '#retroamp .ra-credit{font-size:12px;line-height:1.6;margin-top:8px;color:var(--ra-text)}',
      '#retroamp .ra-credit a{color:var(--ra-amber)}',
      '#retroamp .ra-credit b{color:#fff}',
      '#retroamp .ra-thanks{font-size:11px;opacity:.75;margin-top:6px}',
      '#retroamp .ra-thanks a{color:var(--ra-green)}'
    ].join('\n');
    document.head.appendChild(css);

    // source button, next to Files / Line-In
    var btn = document.createElement('button'); btn.id = 'ra-rkobtn'; btn.type = 'button'; btn.textContent = '\u{1F579} C64 Remixes';
    btn.title = 'Stream Commodore 64 remixes from Remix.Kwed.Org';
    var tabBtn = $('ra-tab'); tabBtn.parentNode.insertBefore(btn, tabBtn.nextSibling);

    var panel = document.createElement('div'); panel.className = 'ra-rko';
    panel.innerHTML =
      '<div class="ra-row"><span class="ra-label">C64 remixes</span><select id="ra-rkosel"></select>' +
      '<button type="button" id="ra-rkoshuf">Shuffle: on</button></div>' +
      '<div class="ra-rkolist" id="ra-rkolist"></div>' +
      '<div class="ra-credit" id="ra-rkocredit"></div>' +
      '<div class="ra-thanks">Every remix streams straight from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>, the home of C64 remakes since 2001. ' +
      'The files stay on their server, credited to the remixers and the original composers. Love a track? Visit its RKO page and vote for it. ' +
      'Their server doesn’t let web pages re-tune its streams, so the EQ rests and the visualizers dance to the beat.</div>';
    var eq = $('ra-eq'); eq.parentNode.insertBefore(panel, eq);

    var DATA = null, list = [], order = [], pos = -1, shuffle = true, started = false;
    var el = new Audio(); el.preload = 'auto'; el.setAttribute('playsinline', '');
    el.volume = Math.min(1, $('ra-vol').value / 100);
    var sel = panel.querySelector('#ra-rkosel'), box = panel.querySelector('#ra-rkolist'), credit = panel.querySelector('#ra-rkocredit');

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function ticker(text, secs) {
      var m = $('ra-status'); m.classList.add('ra-tick');
      m.innerHTML = '<span></span>'; var s = m.firstChild; s.textContent = text;
      m.style.setProperty('--dur', (secs || Math.max(14, text.length / 9)) + 's');
    }
    function untick() { var m = $('ra-status'); m.classList.remove('ra-tick'); }
    function names(arr) { var seen = {}, out = []; arr.forEach(function (x) { x.split(/\s*(?:,|&|\+|\/| feat\.? | and )\s*/i).forEach(function (n) { n = n.trim(); if (n && !seen[n.toLowerCase()]) { seen[n.toLowerCase()] = 1; out.push(n); } }); }); return out; }
    function introTicker() {
      var rm = names(list.map(function (x) { return x.a; })), cp = names(list.map(function (x) { return x.c; })).filter(function (n) { return !/^unknown$/i.test(n); });
      ticker('★ THANK YOU, REMIX.KWED.ORG (RKO) ★ Home of C64 remakes since 2001 ★ Remixed by: ' + rm.join(' · ') +
        ' ★ Original SID music by: ' + cp.join(' · ') + ' ★ Press play and enjoy ★');
    }
    function songTicker(x) {
      ticker('♫ NOW PLAYING: ' + x.t + ' ★ remixed by ' + x.a + ' ★ original ' + x.g + ' music by ' + x.c +
        (x.r ? ' ★ rated ' + x.r + ' on RKO' : '') + ' ★ remix.kwed.org/remix/' + x.id + ' ★ thank you ' + x.a + ' & ' + x.c + '! ★');
    }
    function showCredit(x) {
      credit.innerHTML = '<b>' + esc(x.t) + '</b> · remix by <b>' + esc(x.a) + '</b> · original ' + esc(x.g) + ' music by <b>' + esc(x.c) + '</b>' +
        (x.r ? ' · rated ' + esc(x.r) : '') + (x.len ? ' · ' + esc(x.len) : '') + (x.date ? ' · released on RKO ' + esc(x.date) : '') +
        '<br><a href="' + RKO + '/remix/' + x.id + '" target="_blank" rel="noopener">RKO page ↗</a>' +
        (x.sid ? ' · <a href="https://deepsid.chordian.net/?file=' + esc(x.sid) + '" target="_blank" rel="noopener">hear the original SID ↗</a>' : '');
    }
    function fill() {
      var g = sel.value; list = DATA.filter(function (x) { return g === '*' ? x.pick : g === 'all' ? true : x.g === g; });
      box.innerHTML = '';
      list.forEach(function (x, i) {
        var d = document.createElement('div');
        d.innerHTML = (x.r === 'Outstanding' ? '<span class="st">★</span> ' : '') + esc(x.t) + ' <small>— ' + esc(x.a) + ' · ' + esc(x.g) + '</small>';
        d.onclick = function () { start(i); };
        box.appendChild(d);
      });
      makeOrder(-1);
    }
    function makeOrder(first) {
      order = list.map(function (_, i) { return i; });
      if (shuffle) for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
      if (first >= 0) { order.splice(order.indexOf(first), 1); order.unshift(first); }
      pos = -1;
    }
    function mark() { var cur = list[order[pos]]; [].forEach.call(box.children, function (d, i) { d.classList.toggle('cur', list[i] === cur); }); }
    // beat model for the visualizers
    var BPM = 128, seed = 1, sm = new Float32Array(1024), env = 0;
    function synth(fd, td) {
      var on = !el.paused && !el.ended, t = el.currentTime || 0, beat = 60 / BPM, ph = (t % beat) / beat, half = ((t + beat / 2) % beat) / beat;
      var kick = on ? Math.exp(-ph * 7) : 0, hat = on ? Math.exp(-half * 14) * 0.6 : 0;
      env += ((on ? 1 : 0) - env) * 0.06;
      var bar = Math.floor(t / (beat * 4)), n = fd.length;
      for (var i = 0; i < n; i++) {
        var f = i / n, base = Math.pow(1 - f, 2.2) * 0.85 + 0.05;
        var wob = 0.55 + 0.45 * Math.sin(t * (1.3 + (i % 7) * 0.37) + i * 0.21 + bar * 1.7) * Math.sin(t * 0.7 + i * 0.05 + seed);
        var v = base * wob * env + (f < 0.06 ? kick * 0.9 : 0) + (f > 0.35 && f < 0.7 ? hat * 0.35 : 0) + (f > 0.08 && f < 0.3 ? kick * 0.25 : 0);
        sm[i] = sm[i] * 0.6 + Math.max(0, Math.min(1, v)) * 0.4;
        fd[i] = Math.round(sm[i] * 255);
      }
      var L = env * (0.25 + kick * 0.5 + hat * 0.15);
      for (var k = 0; k < td.length; k++) {
        var x = k / td.length, w = Math.sin(x * Math.PI * 2 * (3 + kick * 4) + t * 9) * 0.6 + Math.sin(x * Math.PI * 2 * 17 + t * 23) * 0.25 + (Math.random() - 0.5) * 0.15 * hat;
        td[k] = 128 + Math.round(w * L * 110);
      }
    }
    function start(i, keepOrder) {
      RA.ensureCtx(); if (RA.mode() !== 'rko') RA.stopOthers();
      RA.setMode('rko'); btn.classList.add('ra-on');
      if (!keepOrder) makeOrder(i);
      pos = keepOrder ? pos : 0;
      play();
    }
    function play() {
      if (!list.length) return;
      if (pos < 0) pos = 0; if (pos >= order.length) { makeOrder(-1); pos = 0; }
      var x = list[order[pos]];
      seed = (x.id % 97) / 9; BPM = 110 + (x.id * 37) % 46;
      el.src = RKO + x.dl; var p = el.play(); if (p && p.catch) p.catch(function () { RA.msg('Tap ⏯ to start the music.'); });
      RA.setPlaying(''); songTicker(x); showCredit(x); mark(); RA.msg('');
      if (!started) { started = true; introTicker(); setTimeout(function () { if (RA.mode() === 'rko') songTicker(list[order[pos]]); }, Math.min(60000, 4000 + $('ra-status').textContent.length * 110)); }
      if ('mediaSession' in navigator) { try { navigator.mediaSession.metadata = new MediaMetadata({ title: x.t, artist: x.a + ' (orig. ' + x.c + ')', album: x.g + ' · Remix.Kwed.Org' }); } catch (e) {} }
    }
    function next(d) { if (!list.length) return; pos = (pos + (d || 1) + order.length) % order.length; RA.setMode('rko'); play(); }
    el.addEventListener('ended', function () { next(1); });
    var errs = 0;
    el.addEventListener('error', function () { if (RA.mode() !== 'rko') return; errs++; RA.msg('That remix wouldn’t load from RKO, skipping…'); if (errs < 5) setTimeout(function () { next(1); }, 1200); });
    el.addEventListener('playing', function () { errs = 0; });

    RA.synth = synth;
    RA.time = function () { return el.currentTime || 0; };
    RA.vol = function (v) { el.volume = Math.max(0, Math.min(1, v)); };
    RA.onLeave = function () { el.pause(); btn.classList.remove('ra-on'); untick(); };
    RA.t = {
      'ra-play': function () { if (el.paused) { var p = el.play(); if (p && p.catch) p.catch(function () {}); } else el.pause(); },
      'ra-next': function () { next(1); },
      'ra-prev': function () { if (el.currentTime > 4) el.currentTime = 0; else next(-1); },
      'ra-stop': function () { el.pause(); el.currentTime = 0; RA.status('Stopped.'); untick(); }
    };

    btn.onclick = function () {
      panel.classList.add('on');
      if (!DATA) { RA.msg('Loading the C64 remix list…'); return; }
      if (RA.mode() === 'rko' && !el.paused) return;
      start(0);
    };

    fetch(BASE + 'remixes.json').then(function (r) { return r.json(); }).then(function (j) {
      DATA = j.remixes;
      var o = function (v, t) { var op = document.createElement('option'); op.value = v; op.textContent = t; sel.appendChild(op); };
      o('*', '★ RKO Outstanding starter mix (' + DATA.filter(function (x) { return x.pick; }).length + ')');
      o('all', 'Every remix of these games (' + DATA.length + ')');
      j.games.forEach(function (g) { o(g, g + ' (' + DATA.filter(function (x) { return x.g === g; }).length + ')'); });
      fill();
      if (RA.msg && /Loading the C64/.test($('ra-msg').textContent)) { RA.msg(''); start(0); }
    }).catch(function () { RA.msg('Couldn’t load the C64 remix list. Try again in a moment.'); });
    sel.onchange = function () { fill(); if (RA.mode() === 'rko') start(0); };
    panel.querySelector('#ra-rkoshuf').onclick = function () { shuffle = !shuffle; this.textContent = 'Shuffle: ' + (shuffle ? 'on' : 'off'); var cur = pos >= 0 ? order[pos] : -1; makeOrder(cur); if (cur >= 0) pos = 0; };
  }
})();
