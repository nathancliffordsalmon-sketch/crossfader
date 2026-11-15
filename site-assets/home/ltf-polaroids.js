/* Concert-review Polaroids that rotate in among the cut-paper "saying" fish on the home page.
   Reads posts tagged "concert-reviews" (they live in Sound Club Notes): featured photo, excerpt = the line
   under the Polaroid, post date = show date, and an "Overall" score from the review's scorecard. */
(function () {
  'use strict';
  var grid = document.querySelector('.ltf-sayings'); if (!grid || grid.dataset.pol) return; grid.dataset.pol = '1';
  if (!document.getElementById('ltf-pol-font')) { var l = document.createElement('link'); l.id = 'ltf-pol-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'; document.head.appendChild(l); }
  var css = '.ltf-pol{position:relative;background:#fbfaf6;border-radius:3px!important;padding:10px 10px 12px!important;box-shadow:3px 4px 0 #2b1055,0 6px 18px rgba(0,0,0,.18)!important;border:1.5px solid #2b1055;transform:rotate(var(--tilt,-2deg));transition:transform .25s;color:#1b1b1b;text-align:center;display:flex;flex-direction:column}' +
    '.ltf-pol:hover{transform:rotate(0deg) scale(1.03)}' +
    '.ltf-pol .ph{display:block;aspect-ratio:1/1;background:#111 center/cover no-repeat;border:1px solid #ddd;position:relative;overflow:hidden}' +
    '.ltf-pol .ph:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,transparent 70%,rgba(255,210,150,.12));pointer-events:none}' +
    '.ltf-pol .tape{position:absolute;top:-9px;left:50%;width:62px;height:18px;margin-left:-31px;background:rgba(255,236,170,.75);transform:rotate(3deg);box-shadow:0 1px 2px rgba(0,0,0,.15)}' +
    '.ltf-pol .cap{font:16px/1.25 "Permanent Marker","Comic Sans MS",cursive;margin:9px 2px 3px;color:#1b1b1b}' +
    '.ltf-pol .meta{font:600 .74rem/1.3 Georgia,serif;color:#555;display:flex;justify-content:space-between;gap:6px;margin-top:auto;padding-top:4px}' +
    '.ltf-pol .meta a{color:#7c3aed;text-decoration:none}.ltf-pol .meta a:hover{text-decoration:underline}' +
    '.ltf-pol .st{color:#f59e0b;letter-spacing:1px}' +
    '.ltf-swapin{animation:ltfPolIn .55s ease both}@keyframes ltfPolIn{from{opacity:0;transform:rotate(8deg) scale(.85)}to{opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.ltf-swapin{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function strip(h) { var d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').trim(); }
  function stars(n) { var s = ''; for (var i = 1; i <= 5; i++) s += n >= i ? '★' : n >= i - 0.5 ? '⯨' : '☆'; return s; }
  function card(p, k) {
    var m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
    var full = m ? m.source_url : p.link, sz = m && m.media_details && m.media_details.sizes, thumb = sz && (sz.medium_large || sz.large || sz.medium) ? (sz.medium_large || sz.large || sz.medium).source_url : full;
    var ov = (p.content && p.content.rendered || '').match(/data-overall="([\d.]+)"/), overall = ov ? parseFloat(ov[1]) : null;
    var d = new Date(p.date), date = d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
    var el = document.createElement('div'); el.className = 'ltf-saying ltf-pol'; el.style.setProperty('--tilt', (k % 2 ? 2.5 : -2.5) + 'deg');
    el.innerHTML = '<span class="tape" aria-hidden="true"></span><a class="ph" href="' + esc(full) + '" target="_blank" rel="noopener" style="background-image:url(\'' + esc(thumb) + '\')" aria-label="Full photo: ' + esc(strip(p.title.rendered)) + '"></a>' +
      '<div class="cap">' + esc(strip(p.excerpt.rendered)) + '</div>' +
      '<div class="meta"><span>' + esc(date) + (overall ? ' <span class="st" title="Overall ' + overall + '/5">' + stars(overall) + '</span>' : '') + '</span><a href="' + esc(p.link) + '">Review →</a></div>';
    return el;
  }
  fetch('/wp-json/wp/v2/tags?slug=concert-reviews&_fields=id').then(function (r) { return r.json(); }).then(function (t) {
    if (!t || !t[0]) return null;
    return fetch('/wp-json/wp/v2/posts?tags=' + t[0].id + '&per_page=20&orderby=date&order=desc&_embed=wp:featuredmedia&_fields=id,date,link,title,excerpt,content,_links,_embedded').then(function (r) { return r.json(); });
  }).then(function (posts) {
    if (!posts || !posts.length) return;
    var pols = posts.map(card), pi = 0, slots = [].slice.call(grid.children);
    if (!slots.length) return;
    var showing = {}; // slot index -> original saying node, while a Polaroid is in it
    function swap() {
      var keys = Object.keys(showing);
      if (keys.length && (keys.length >= Math.max(1, Math.min(2, pols.length)) || Math.random() < 0.5)) {
        var k = keys[Math.floor(Math.random() * keys.length)], cur = grid.children[k], orig = showing[k]; delete showing[k];
        cur.replaceWith(orig); orig.classList.remove('ltf-swapin'); void orig.offsetWidth; orig.classList.add('ltf-swapin'); return;
      }
      var free = slots.map(function (_, i) { return i; }).filter(function (i) { return !(i in showing); }); if (!free.length) return;
      var s = free[Math.floor(Math.random() * free.length)], node = grid.children[s], pol = pols[pi++ % pols.length];
      if (pol.isConnected) return; showing[s] = node; node.replaceWith(pol); pol.classList.remove('ltf-swapin'); void pol.offsetWidth; pol.classList.add('ltf-swapin');
    }
    setTimeout(swap, 2500); setInterval(function () { if (!document.hidden) swap(); }, 7000);
  }).catch(function () {});
})();
