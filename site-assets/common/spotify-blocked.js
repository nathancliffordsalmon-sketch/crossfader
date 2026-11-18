/* Spotify-blocked fallback for likethefish.ca (site-wide).
   Probes open.spotify.com; if the network blocks it:
   - Home page: each Spotify embed becomes a concert Polaroid (random recent post tagged "concert-reviews")
     with "Spotify seems to be blocked by your network; check out this concert photo instead".
   - Every other page: each Spotify embed becomes a short note "Spotify is blocked by your network".
     Pages that build their player with the Spotify iFrame API (no iframe ever appears) get a small toast. */
(function () {
  'use strict';
  if (window.__ltfSpBlk) return; window.__ltfSpBlk = 1;
  var HOME = document.body ? document.body.classList.contains('home') : location.pathname === '/';
  if (!HOME && (location.pathname === '/' || location.pathname === '')) HOME = true;
  var SEL = 'iframe[src*="open.spotify.com"], iframe[data-src*="open.spotify.com"]';

  function probe(cb) {
    var done = false, img = new Image();
    function fin(ok) { if (done) return; done = true; cb(ok); }
    var to = setTimeout(function () { fin(false); }, 8000);
    img.onload = function () { clearTimeout(to); fin(true); };
    img.onerror = function () { clearTimeout(to); fin(false); };
    img.src = 'https://open.spotify.com/favicon.ico?ltf=' + Date.now();
  }

  function css() {
    if (document.getElementById('ltf-spblk-css')) return;
    var s = document.createElement('style'); s.id = 'ltf-spblk-css';
    s.textContent =
      '.ltf-spblk-note{box-sizing:border-box;margin:8px 0;padding:12px 16px;border:2px dashed #c2410c;border-radius:10px;background:#fff4c8;color:#2b1055;font:600 15px/1.4 system-ui,sans-serif;text-align:center}' +
      '.ltf-spblk-toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;max-width:90vw}' +
      '.ltf-spblk-home{box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:12px;padding:14px 8px}' +
      '.ltf-spblk-home .msg{font:600 15px/1.4 system-ui,sans-serif;color:#2b1055;background:#fff4c8;border:2px dashed #c2410c;border-radius:10px;padding:8px 14px;text-align:center}' +
      '.ltf-spblk-pol{display:block;width:min(300px,86%);background:#fbfaf6;border:1.5px solid #2b1055;border-radius:3px;padding:10px 10px 12px;box-shadow:3px 4px 0 #2b1055,0 6px 18px rgba(0,0,0,.18);transform:rotate(-2deg);transition:transform .25s;color:#1b1b1b;text-decoration:none;text-align:center;position:relative}' +
      '.ltf-spblk-pol:hover{transform:rotate(0) scale(1.03)}' +
      '.ltf-spblk-pol .tape{position:absolute;top:-9px;left:50%;width:62px;height:18px;margin-left:-31px;background:rgba(255,236,170,.8);transform:rotate(3deg)}' +
      '.ltf-spblk-pol .ph{display:block;aspect-ratio:1/1;background:#111 50% 50%/cover no-repeat;border:1px solid #ddd}' +
      '.ltf-spblk-pol .cap{margin-top:9px;font:17px/1.2 "Permanent Marker","Comic Sans MS",cursive;color:#2b1055}' +
      '.ltf-spblk-pol .dt{font:12px/1.2 Georgia,serif;color:#666;margin-top:3px}';
    document.head.appendChild(s);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function strip(h) { var d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').trim(); }

  var concerts = null;
  function getConcerts() {
    if (concerts) return concerts;
    concerts = fetch('/wp-json/wp/v2/tags?slug=concert-reviews&_fields=id').then(function (r) { return r.json(); }).then(function (t) {
      if (!t || !t[0]) return [];
      return fetch('/wp-json/wp/v2/posts?tags=' + t[0].id + '&per_page=20&_embed=wp:featuredmedia&_fields=id,date,link,title,_links,_embedded').then(function (r) { return r.json(); });
    }).then(function (posts) {
      return (posts || []).map(function (p) {
        var m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0];
        if (!m || !m.source_url) return null;
        var sz = (m.media_details && m.media_details.sizes) || {};
        var img = (sz.medium_large || sz.large || sz.medium || {}).source_url || m.source_url;
        return { img: img, link: p.link, title: strip(p.title && p.title.rendered).replace(/^Concert Review:\s*/i, ''), date: p.date };
      }).filter(Boolean);
    }).catch(function () { return []; });
    return concerts;
  }

  function note(text) { var n = document.createElement('div'); n.className = 'ltf-spblk-note'; n.setAttribute('role', 'status'); n.textContent = text; return n; }

  function swapHome(f) {
    var box = document.createElement('div'); box.className = 'ltf-spblk-home';
    var h = f.getAttribute('height'); if (h && +h > 200) box.style.minHeight = h + 'px';
    box.innerHTML = '<div class="msg" role="status">Spotify seems to be blocked by your network; check out this concert photo instead</div>';
    f.replaceWith(box);
    if (!document.getElementById('ltf-pol-font')) { var l = document.createElement('link'); l.id = 'ltf-pol-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'; document.head.appendChild(l); }
    getConcerts().then(function (list) {
      if (!list.length) return;
      var c = list[Math.floor(Math.random() * list.length)];
      var d = new Date(c.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
      var a = document.createElement('a'); a.className = 'ltf-spblk-pol'; a.href = c.link;
      a.innerHTML = '<span class="tape" aria-hidden="true"></span><span class="ph" style="background-image:url(\'' + esc(c.img) + '\')" role="img" aria-label="' + esc(c.title) + ' concert photo"></span><div class="cap">' + esc(c.title) + '</div><div class="dt">' + esc(d) + ' · read the review →</div>';
      box.appendChild(a);
    });
  }

  function handle(f) {
    if (f.dataset.ltfSpblk) return; f.dataset.ltfSpblk = '1';
    if (HOME) swapHome(f); else f.replaceWith(note('Spotify is blocked by your network.'));
  }

  function run() {
    probe(function (ok) {
      if (ok) return;
      css();
      document.documentElement.classList.add('ltf-spotify-blocked');
      var found = document.querySelectorAll(SEL);
      [].forEach.call(found, handle);
      new MutationObserver(function () { [].forEach.call(document.querySelectorAll(SEL), handle); })
        .observe(document.body, { childList: true, subtree: true });
      var usesApi = !!document.querySelector('script[src*="open.spotify.com/embed/iframe-api"]') || !!window.onSpotifyIframeApiReady;
      if (!found.length && usesApi) {
        var t = note('Spotify is blocked by your network.'); t.classList.add('ltf-spblk-toast');
        document.body.appendChild(t); setTimeout(function () { t.remove(); }, 9000);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
