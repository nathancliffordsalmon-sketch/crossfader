/* Concert-review Polaroids: the home page's bottom row shows only these snapshots, rotating through every show.
   Reads posts tagged "concert-reviews" (they live in Sound Club Notes): featured photo, excerpt = the line
   under the Polaroid, post date = show date, and an "Overall" score from the review's scorecard. */
(function () {
  'use strict';
  var grid = document.querySelector('.ltf-sayings'); if (!grid || grid.dataset.pol) return; grid.dataset.pol = '1';
  grid.classList.add('ltf-pol-only'); var hide = document.createElement('style'); hide.textContent = '.ltf-sayings.ltf-pol-only > .ltf-saying{visibility:hidden}'; document.head.appendChild(hide);
  if (!document.getElementById('ltf-pol-font')) { var l = document.createElement('link'); l.id = 'ltf-pol-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'; document.head.appendChild(l); }
  var css = '.ltf-pol{position:relative;opacity:1!important;filter:none!important;background:#fbfaf6;border-radius:3px!important;padding:10px 10px 12px!important;box-shadow:3px 4px 0 #2b1055,0 6px 18px rgba(0,0,0,.18)!important;border:1.5px solid #2b1055;transform:rotate(var(--tilt,-2deg));transition:transform .25s;color:#1b1b1b;text-align:center;display:flex;flex-direction:column}' +
    '.ltf-pol:hover{transform:rotate(0deg) scale(1.03)}' +
    '.ltf-pol .ph{display:block;aspect-ratio:1/1;background:#111 50% 72%/cover no-repeat;border:1px solid #ddd;position:relative;overflow:hidden}' +
    '.ltf-pol .ph:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,transparent 70%,rgba(255,210,150,.12));pointer-events:none}' +
    '.ltf-pol .tape{position:absolute;top:-9px;left:50%;width:62px;height:18px;margin-left:-31px;background:rgba(255,236,170,.75);transform:rotate(3deg);box-shadow:0 1px 2px rgba(0,0,0,.15)}' +
    '.ltf-pol .tk{position:absolute;left:7%;bottom:8px;max-width:80%;z-index:1;pointer-events:none;background:#fff4c8;color:#2b1055;border:1.5px dashed #c2410c;outline:2px solid #fff4c8;border-radius:3px;padding:3px 9px 2px;font:13px/1.15 "Permanent Marker","Comic Sans MS",cursive;text-transform:uppercase;letter-spacing:.5px;text-align:left;transform:rotate(-3deg);box-shadow:2px 3px 0 rgba(43,16,85,.55)}' +
    '.ltf-pol .tk small{display:block;font:700 7.5px/1 Georgia,serif;letter-spacing:2px;color:#c2410c;margin-bottom:2px}' +
    '.ltf-pol .tk.up{top:10px;bottom:auto;left:auto;right:7%;transform:rotate(3deg)}' +
    '@media (max-width:600px){.ltf-pol .tk{font-size:11px;padding:2px 7px 1px}}' +
    '.ltf-pol .cap{font:16px/1.25 "Permanent Marker","Comic Sans MS",cursive;margin:9px 2px 3px;color:#1b1b1b}' +
    '.ltf-pol .meta{font:600 .74rem/1.3 Georgia,serif;color:#555;display:flex;justify-content:space-between;gap:6px;margin-top:auto;padding-top:4px}' +
    '.ltf-pol .meta a{color:#7c3aed;text-decoration:none}.ltf-pol .meta a:hover{text-decoration:underline}' +
    '.ltf-pol .st{color:#f59e0b;letter-spacing:1px}' +
    '.ltf-swapin{animation:ltfPolIn .55s ease both}@keyframes ltfPolIn{from{opacity:0;transform:rotate(8deg) scale(.85)}to{opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.ltf-swapin{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function strip(h) { var d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').trim(); }
  function card(p, k) {
    var m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
    var full = m ? m.source_url : p.link, sz = m && m.media_details && m.media_details.sizes, thumb = sz && (sz.medium_large || sz.large || sz.medium) ? (sz.medium_large || sz.large || sz.medium).source_url : full;
    var ov = (p.content && p.content.rendered || '').match(/data-overall="([\d.]+)"/), overall = ov ? parseFloat(ov[1]) : null;
    var show = strip(p.title.rendered).replace(/^Concert Review:\s*/i, '');
    var d = new Date(p.date), date = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
    var el = document.createElement('div'); el.className = 'ltf-pol'; el.style.setProperty('--tilt', (k % 2 ? 2.5 : -2.5) + 'deg');
    el.innerHTML = '<span class="tape" aria-hidden="true"></span><a class="ph" href="' + esc(full) + '" target="_blank" rel="noopener" style="background-image:url(\'' + esc(thumb) + '\')" aria-label="Full photo: ' + esc(strip(p.title.rendered)) + '"><span class="tk' + (Math.random() < 0.5 ? ' up' : '') + '"><small>ADMIT ONE</small>' + esc(show) + '</span></a>' +
      '<div class="cap">' + esc(strip(p.excerpt.rendered)) + '</div>' +
      '<div class="meta"><span>' + esc(date) + (overall ? ' <span class="st" title="Overall ' + overall + ' out of 5">\u2605 ' + overall + '/5</span>' : '') + '</span><a href="' + esc(p.link) + '">Review \u2192</a></div>';
    return el;
  }
  fetch('/wp-json/wp/v2/tags?slug=concert-reviews&_fields=id').then(function (r) { return r.json(); }).then(function (t) {
    if (!t || !t[0]) return null;
    return fetch('/wp-json/wp/v2/posts?tags=' + t[0].id + '&per_page=20&orderby=date&order=desc&_embed=wp:featuredmedia&_fields=id,date,link,title,excerpt,content,_links,_embedded').then(function (r) { return r.json(); });
  }).then(function (posts) {
    if (!posts || !posts.length) { grid.classList.remove('ltf-pol-only'); return; }
    // snapshots only: every slot shows a concert Polaroid, rotating through all the shows
    var pols = posts.map(card), slots = [].slice.call(grid.children), n = Math.min(slots.length || 4, pols.length), pi = 0;
    grid.innerHTML = '';
    for (var i = 0; i < n; i++) { var p0 = pols[pi++]; grid.appendChild(p0); }
    grid.classList.remove('ltf-pol-only');
    if (pols.length <= n) return;
    function swap() {
      var k = Math.floor(Math.random() * n), cur = grid.children[k], nx = null;
      for (var t = 0; t < pols.length; t++) { var c = pols[pi++ % pols.length]; if (!c.isConnected) { nx = c; break; } }
      if (!nx || !cur) return; nx.style.setProperty('--tilt', (k % 2 ? 2.5 : -2.5) + 'deg');
      var tk = nx.querySelector('.tk'); if (tk) tk.classList.toggle('up', Math.random() < 0.5);
      cur.replaceWith(nx); nx.classList.remove('ltf-swapin'); void nx.offsetWidth; nx.classList.add('ltf-swapin');
    }
    setInterval(function () { if (!document.hidden) swap(); }, 7000);
  }).catch(function () {});
})();
