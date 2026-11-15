/* Sound Club Notes: a small taped-on Polaroid of the show beside every concert review in a post list.
   Finds list items tagged concert-reviews (li.tag-concert-reviews from the Query Loop), looks up their
   featured photos and "Overall" scores in one request, and floats a little Polaroid next to each. */
(function () {
  'use strict';
  function run() {
    const items = [...document.querySelectorAll('li.wp-block-post.tag-concert-reviews')].filter((li) => !li.dataset.minipol);
    if (!items.length) return;
    const ids = items.map((li) => ((li.className.match(/\bpost-(\d+)\b/) || [])[1])).filter(Boolean);
    if (!ids.length) return;
    if (!document.getElementById('ltf-minipol-css')) {
      if (!document.getElementById('ltf-pol-font')) { const l = document.createElement('link'); l.id = 'ltf-pol-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'; document.head.appendChild(l); }
      const s = document.createElement('style'); s.id = 'ltf-minipol-css';
      s.textContent = 'li.ltf-has-minipol{display:flow-root}' +
        '.ltf-minipol{float:right;width:124px;margin:4px 4px 10px 16px;background:#fbfaf6;border:1.5px solid #2b1055;border-radius:3px;padding:6px 6px 7px;box-shadow:3px 3px 0 #2b1055,0 4px 12px rgba(0,0,0,.15);transform:rotate(var(--tilt,-3deg));transition:transform .2s;position:relative;text-align:center;text-decoration:none!important;color:#1b1b1b;display:block}' +
        '.ltf-minipol:hover{transform:rotate(0) scale(1.05)}' +
        '.ltf-minipol .tp{position:absolute;top:-7px;left:50%;width:44px;height:13px;margin-left:-22px;background:rgba(255,236,170,.8);transform:rotate(4deg);box-shadow:0 1px 2px rgba(0,0,0,.15)}' +
        '.ltf-minipol .ph{display:block;aspect-ratio:1/1;background:#111 50% 70%/cover no-repeat;border:1px solid #ddd}' +
        '.ltf-minipol .cp{display:block;font:12px/1.15 "Permanent Marker","Comic Sans MS",cursive;margin-top:5px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}' +
        '.ltf-minipol .st{display:block;font:700 11px/1 Georgia,serif;color:#f59e0b;margin-top:3px;letter-spacing:.5px}' +
        '@media (max-width:600px){.ltf-minipol{width:96px;margin-left:10px}.ltf-minipol .cp{font-size:10.5px}}';
      document.head.appendChild(s);
    }
    const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const strip = (h) => { const d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').trim(); };
    fetch('/wp-json/wp/v2/posts?include=' + ids.join(',') + '&per_page=' + ids.length + '&_embed=wp:featuredmedia&_fields=id,link,title,content,_links,_embedded')
      .then((r) => r.json()).then((posts) => {
        const byId = {}; (posts || []).forEach((p) => { byId[p.id] = p; });
        items.forEach((li, k) => {
          const id = (li.className.match(/\bpost-(\d+)\b/) || [])[1], p = byId[id]; li.dataset.minipol = '1'; if (!p) return;
          const m = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]; if (!m || !m.source_url) return;
          const sz = m.media_details && m.media_details.sizes, img = sz && (sz.medium || sz.medium_large || sz.thumbnail) ? (sz.medium || sz.medium_large || sz.thumbnail).source_url : m.source_url;
          const ov = (p.content && p.content.rendered || '').match(/data-overall="([\d.]+)"/), name = strip(p.title.rendered).replace(/^Concert Review:\s*/i, '');
          const a = document.createElement('a'); a.className = 'ltf-minipol'; a.href = p.link; a.style.setProperty('--tilt', (k % 2 ? 3 : -3) + 'deg');
          a.setAttribute('aria-label', 'Concert review: ' + name);
          a.innerHTML = '<span class="tp" aria-hidden="true"></span><span class="ph"></span><span class="cp">' + esc(name) + '</span>' + (ov ? '<span class="st">★ ' + esc(ov[1]) + '/5</span>' : '');
          a.querySelector('.ph').style.backgroundImage = 'url("' + img.replace(/"/g, '%22') + '")';
          li.classList.add('ltf-has-minipol'); li.insertBefore(a, li.firstChild);
        });
      }).catch(() => {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  setTimeout(run, 1500);
})();
