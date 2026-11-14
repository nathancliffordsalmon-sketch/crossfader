/* Like the Fish: "\ud83d\udcfa Share to TV" for every music experience.
   Loaded on every page (by fishamp-btn.js in the header). It adds a button next to each experience's
   Full screen button and opens a short how-to for casting / screen mirroring on the visitor's device.
   Experiences can also call window.LTFCast.open() from their own button.
   Also adds the meta tags that let iPhone "Add to Home Screen" open the site without the browser bar. */
(function () {
  if (window.LTFCast) return;
  var css = [
    '.ltf-cast-ov{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:rgba(4,6,16,.78);padding:16px;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}',
    '.ltf-cast-box{position:relative;max-width:440px;width:100%;max-height:90vh;overflow:auto;background:#10142a;color:#e8f0ff;border:2px solid #00eaff;border-radius:14px;box-shadow:0 0 30px rgba(0,234,255,.4),6px 6px 0 #2b1055;padding:18px 18px 14px}',
    '.ltf-cast-box h3{margin:0 0 8px;font:900 18px/1.2 system-ui,sans-serif;letter-spacing:.04em;color:#5ff6ff}',
    '.ltf-cast-box ol{margin:6px 0 10px;padding-left:22px}.ltf-cast-box li{margin:4px 0}',
    '.ltf-cast-box b{color:#fff}.ltf-cast-box .k{display:inline-block;padding:0 6px;border:1px solid #5ff6ff88;border-radius:5px;font-family:ui-monospace,monospace;font-size:13px}',
    '.ltf-cast-box details{margin:4px 0;border-top:1px solid #ffffff22;padding-top:6px}.ltf-cast-box summary{cursor:pointer;color:#9bd8ff}',
    '.ltf-cast-box .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}',
    '.ltf-cast-box button{cursor:pointer;border:0;border-radius:999px;padding:10px 16px;font:700 14px system-ui,sans-serif;background:#00eaff;color:#041020}',
    '.ltf-cast-box button.alt{background:#2a2f55;color:#fff}',
    '.ltf-cast-x{position:absolute;top:8px;right:10px;background:none!important;color:#9bd8ff!important;font-size:20px!important;padding:2px 6px!important}',
    '.ltf-cast-note{font-size:12px;opacity:.75;margin-top:8px}',
    '.ltf-cast-btn.ltf-cast-float{position:absolute;right:10px;bottom:10px;z-index:5;cursor:pointer;border:2px solid #00eaff;border-radius:999px;padding:8px 12px;background:#05070c;color:#e9fdff;font:700 13px system-ui,sans-serif;box-shadow:0 0 12px rgba(0,234,255,.5)}'
  ].join('\n');
  function addCss() { if (document.getElementById('ltf-cast-css')) return; var s = document.createElement('style'); s.id = 'ltf-cast-css'; s.textContent = css; document.head.appendChild(s); }
  var ua = navigator.userAgent || '', iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua), mac = !iOS && /Mac/.test(ua), win = /Windows/.test(ua), cros = /CrOS/.test(ua), chromium = /Chrome|CriOS|Edg/.test(ua) && !/OPR/.test(ua);
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  var STEPS = {
    ios: ['Open <b>Control Center</b> (swipe down from the top-right corner).', 'Tap <b>Screen Mirroring</b> and pick your Apple TV or AirPlay TV.', 'Come back here and tap <b>\u26f6 Full screen</b>. Turn the phone sideways for a wide picture.'],
    android: ['Swipe down twice from the top to open <b>Quick Settings</b>.', 'Tap <b>Cast</b>, <b>Screen Cast</b>, <b>Smart View</b> (Samsung) or <b>Screen Mirroring</b>, and pick your TV.', 'Come back here and tap <b>\u26f6 Full screen</b>. Turn the phone sideways for a wide picture.'],
    chrome: ['Click Chrome\'s <b>\u22ee</b> menu \u2192 <b>Cast, save and share</b> \u2192 <b>Cast\u2026</b>', 'Pick your TV or Chromecast. Under <b>Sources</b>, choose <b>Cast tab</b> so the music goes too.', 'Press <b>\u26f6 Full screen</b> here.'],
    win: ['Press <span class="k">Win</span> + <span class="k">K</span> and pick your TV or wireless display.', 'Or in Chrome / Edge: <b>\u22ee</b> menu \u2192 <b>Cast</b> \u2192 pick your TV.', 'Press <b>\u26f6 Full screen</b> here.'],
    mac: ['Open <b>Control Center</b> (top-right of the menu bar) \u2192 <b>Screen Mirroring</b> and pick your Apple TV or AirPlay TV.', 'Or in Chrome: <b>\u22ee</b> menu \u2192 <b>Cast\u2026</b> \u2192 pick your Chromecast, Source: <b>Cast tab</b>.', 'Press <b>\u26f6 Full screen</b> here.'],
    cros: ['Click the clock (bottom-right) \u2192 <b>Cast screen</b>, or Chrome\'s <b>\u22ee</b> menu \u2192 <b>Cast\u2026</b>', 'Pick your TV or Chromecast.', 'Press <b>\u26f6 Full screen</b> here.']
  };
  function list(a) { return '<ol>' + a.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>'; }
  function open() {
    addCss();
    var key = iOS ? 'ios' : android ? 'android' : cros ? 'cros' : win ? 'win' : mac ? 'mac' : 'chrome';
    var label = { ios: 'iPhone / iPad', android: 'Android', chrome: 'Chrome', win: 'Windows', mac: 'Mac', cros: 'Chromebook' };
    var others = Object.keys(STEPS).filter(function (k) { return k !== key; }).map(function (k) { return '<details><summary>' + label[k] + '</summary>' + list(STEPS[k]) + '</details>'; }).join('');
    var tip = iOS && !standalone ? '<div class="ltf-cast-note"><b>No browser bar on iPhone:</b> tap Safari\'s Share button \u2192 <b>Add to Home Screen</b>, then open likethefish.ca from the new icon.</div>' : '';
    var ov = document.createElement('div'); ov.className = 'ltf-cast-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Share to a TV');
    ov.innerHTML = '<div class="ltf-cast-box"><button class="ltf-cast-x" aria-label="Close">\u2715</button><h3>\ud83d\udcfa SHARE TO YOUR TV</h3>' +
      '<div>On this ' + label[key] + ':</div>' + list(STEPS[key]) + others + tip +
      '<div class="row"><button class="go">Got it</button><button class="alt cp">Copy link to this page</button></div>' +
      '<div class="ltf-cast-note">The picture and the music both go to the TV. Keep this tab open while you watch.</div></div>';
    (document.fullscreenElement || document.webkitFullscreenElement || document.body).appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.addEventListener('click', function (e) { e.stopPropagation(); if (e.target === ov || e.target.closest('.ltf-cast-x') || e.target.closest('.go')) close(); });
    ov.querySelector('.cp').addEventListener('click', function (e) { var b = e.currentTarget; try { navigator.clipboard.writeText(location.href).then(function () { b.textContent = 'Link copied!'; }, function () { b.textContent = location.href; }); } catch (x) { b.textContent = location.href; } });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  }
  window.LTFCast = { open: open };

  /* iPhone home-screen app mode (no browser bar) */
  try {
    [['apple-mobile-web-app-capable', 'yes'], ['mobile-web-app-capable', 'yes'], ['apple-mobile-web-app-status-bar-style', 'black-translucent'], ['apple-mobile-web-app-title', 'Like the Fish']].forEach(function (m) {
      if (!document.querySelector('meta[name="' + m[0] + '"]')) { var t = document.createElement('meta'); t.name = m[0]; t.content = m[1]; document.head.appendChild(t); }
    });
  } catch (e) {}

  /* attach a button next to each experience's Full screen button */
  var ROOTS = '#retroamp,#pq,#cif,#rtg,#isl,#ltf-ntt,#ltf-tank,#ltf-bingo-caller,[data-ltf-exp]';
  function isFsBtn(b) { var t = (b.textContent || '') + ' ' + (b.title || '') + ' ' + (b.getAttribute('aria-label') || ''); return /full ?screen/i.test(t) && b.offsetParent !== null && getComputedStyle(b).position !== 'absolute'; }
  function attach() {
    addCss();
    document.querySelectorAll(ROOTS).forEach(function (root) {
      if (root.querySelector('.ltf-cast-btn') || root.hasAttribute('data-cast-own')) return;
      var fs = [].filter.call(root.querySelectorAll('button'), isFsBtn)[0];
      var b = document.createElement('button'); b.type = 'button'; b.textContent = '\ud83d\udcfa Share to TV'; b.title = 'Show this on your TV (cast or screen mirroring)';
      b.addEventListener('click', function (e) { e.stopPropagation(); open(); });
      if (fs) { b.className = (fs.className || '') + ' ltf-cast-btn'; b.removeAttribute('id'); fs.parentNode.insertBefore(b, fs.nextSibling); }
      else { if (getComputedStyle(root).position === 'static') root.style.position = 'relative'; b.className = 'ltf-cast-btn ltf-cast-float'; root.appendChild(b); }
    });
  }
  function attachWp() { // Final Songasy: its Full Screen button is a WordPress button outside the game frame
    if (!document.getElementById('fsg-frame') || document.querySelector('.ltf-cast-wp')) return;
    var fs = [].filter.call(document.querySelectorAll('.wp-block-button .wp-element-button'), function (b) { return /full ?screen/i.test(b.textContent); })[0]; if (!fs) return;
    var wrap = fs.closest('.wp-block-button'), d = document.createElement('div'); d.className = (wrap.className || 'wp-block-button') + ' ltf-cast-wp';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'wp-block-button__link wp-element-button ltf-cast-btn'; b.textContent = '\ud83d\udcfa Share to TV'; b.addEventListener('click', open);
    d.appendChild(b); wrap.parentNode.insertBefore(d, wrap.nextSibling);
  }
  var n = 0; function tick() { attach(); attachWp(); if (++n < 20) setTimeout(tick, 600); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick); else tick();
})();
