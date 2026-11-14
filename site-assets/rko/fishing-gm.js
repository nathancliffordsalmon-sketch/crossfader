/* Fishing: adds a Game music row (C64 remixes, Kevin MacLeod moods, MOBYGRATIS) under the Spotify controls. */
(function () {
'use strict';
const root = document.getElementById('cif'); if (!root || root.dataset.gm) return; root.dataset.gm = '1';
const SRC = (document.currentScript && document.currentScript.src) || '';
if (!window.LTFGM) { const s = document.createElement('script'); s.src = SRC.replace(/fishing-gm\.js.*$/, 'gm.js'); document.head.appendChild(s); }
const st = document.createElement('style');
st.textContent = `#cif .cif-gm{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:0 14px 12px;background:#10142a}
#cif .cif-gm b{font:10px/1 "Press Start 2P",monospace;color:#3ef06a;white-space:nowrap}
#cif .cif-gm select{flex:1 1 180px;min-width:0;font:14px system-ui,sans-serif;padding:9px;border-radius:8px;background:#0b0b18;color:#e8f0ff;border:1px solid #2a3a6a}
#cif .cif-gm button{font:11px/1 "Press Start 2P",monospace;border:0;border-radius:8px;padding:10px 12px;cursor:pointer;background:#24305e;color:#e8f0ff;box-shadow:0 3px 0 #000}
#cif .cif-gm .go{background:#3ef06a;color:#062010}
#cif .cif-gmcred{padding:0 14px 12px;background:#10142a;font-size:12px;line-height:1.5;color:#9bb0d8}
#cif .cif-gmcred a{color:#38b6ff}
#cif.cif-full .cif-gm,#cif.cif-full .cif-gmcred,#cif.cif-full .cif-top,#cif.cif-full .cif-ctl{display:none}
#cif.cif-full{background:#000}
#cif.cif-full .cif-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
#cif.cif-full canvas.cif-screen{max-width:100vw;max-height:100dvh;aspect-ratio:auto}
#cif .cif-ov{display:none;position:absolute;left:8px;top:8px;gap:6px;z-index:2;line-height:1}
#cif.cif-full .cif-ov{display:flex}
#cif .cif-ov button{font:10px/1 "Press Start 2P",monospace;background:rgba(10,20,40,.8);color:#9be7ff;border:1px solid #38b6ff;border-radius:6px;padding:7px 9px;cursor:pointer}
#cif .cif-ov .on{background:#3ef06a;color:#062010;border-color:#3ef06a}
@media (max-width:600px){#cif .cif-gm b{display:none}}`;
document.head.appendChild(st);
const row = document.createElement('div'); row.className = 'cif-gm';
row.innerHTML = '<b>GAME MUSIC</b><select class="cif-gmcoll" aria-label="Game music collection"><option value="">Loading…</option></select><select class="cif-gmsub" aria-label="C64 remixes" style="display:none"></select><button type="button" class="go cif-gmgo">▶ Play</button><button type="button" class="cif-gmnext">⏭</button>';
const cred = document.createElement('div'); cred.className = 'cif-gmcred';
cred.innerHTML = '<span class="cif-gmnow"></span><audio class="cif-gmau" preload="none" style="display:none"></audio><br>C64 remixes from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a> · Relaxing, Encapsulating &amp; Insanity: music by Kevin MacLeod (<a href="https://incompetech.com/" target="_blank" rel="noopener">incompetech.com</a>), <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> · MOBYGRATIS: free music from <a href="https://mobygratis.com/" target="_blank" rel="noopener">mobygratis.com</a>. Thank you, MOBYGRATIS!';
const ctl = root.querySelector('.cif-ctl'); ctl.after(row); row.after(cred);
/* full screen: the level fills the screen (landscape phones included), with a few controls floating on top */
const stage = root.querySelector('.cif-stage'), cvs = root.querySelector('canvas.cif-screen');
const ov = document.createElement('div'); ov.className = 'cif-ov';
ov.innerHTML = '<button type="button" class="ov-sp">\u25B6 SPOTIFY</button><button type="button" class="ov-gm">\u{1F3AE} GAME MUSIC</button><button type="button" class="ov-next" aria-label="Next game song">\u23ED</button>';
if (stage) stage.appendChild(ov);
function fit() {
  if (!cvs) return; const full = root.classList.contains('cif-full');
  if (!full) { cvs.style.width = ''; cvs.style.height = ''; return; }
  const vw = (window.visualViewport && window.visualViewport.width) || window.innerWidth, vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  const k = Math.min(vw / cvs.width, vh / cvs.height); cvs.style.width = Math.floor(cvs.width * k) + 'px'; cvs.style.height = Math.floor(cvs.height * k) + 'px';
}
new MutationObserver(() => setTimeout(fit, 30)).observe(root, { attributes: true, attributeFilter: ['class'] });
window.addEventListener('resize', () => setTimeout(fit, 50)); window.addEventListener('orientationchange', () => setTimeout(fit, 300));
if (window.visualViewport) window.visualViewport.addEventListener('resize', () => setTimeout(fit, 50));
const $ = (s) => root.querySelector(s);
const coll = $('.cif-gmcoll'), sub = $('.cif-gmsub'), au = $('.cif-gmau'), go = $('.cif-gmgo'), now = $('.cif-gmnow'), msg = $('.cif-msg');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const G = { list: [], order: [], pos: 0, started: null };
const setP = (p) => { if (window.cifSetPlaying) window.cifSetPlaying(p); };
ov.querySelector('.ov-sp').addEventListener('click', () => { const b = root.querySelector('.cif-play'); if (b) b.click(); });
ov.querySelector('.ov-gm').addEventListener('click', () => go.click());
ov.querySelector('.ov-next').addEventListener('click', () => $('.cif-gmnext').click());
const syncOv = () => { const on = !au.paused; const b = ov.querySelector('.ov-gm'); b.textContent = on ? '\u23F8 GAME MUSIC' : '\u{1F3AE} GAME MUSIC'; b.classList.toggle('on', on); };
function fillSub() { sub.innerHTML = ''; const o = window.LTFGM.subOptions(coll.value); o.forEach(([v, t]) => { const op = document.createElement('option'); op.value = v; op.textContent = t; sub.appendChild(op); }); sub.style.display = o.length ? '' : 'none'; }
function fill() { G.list = window.LTFGM.items(coll.value, sub.value); G.order = G.list.map((_, i) => i).sort(() => Math.random() - 0.5); G.pos = 0; }
const cur = () => G.list[G.order[G.pos]];
function load(play) { const x = cur(); if (!x) return; au.src = x.url; G.started = null; now.innerHTML = '♫ <b>' + esc(x.title) + '</b> · ' + esc(x.credit) + '<br>'; if (play) { const p = au.play(); if (p && p.catch) p.catch(() => {}); } }
au.addEventListener('play', () => { const x = cur(); if (x && G.started !== x.uid) { G.started = x.uid; if (window.LTFGM.played) window.LTFGM.played(x); if (msg) msg.textContent = x.mg ? 'THANK YOU, MOBYGRATIS! ♫ ' + x.title : '♫ ' + x.title + ' · ' + x.credit; } go.textContent = '⏸ Pause'; setP(true); syncOv(); });
au.addEventListener('pause', () => { go.textContent = '▶ Play'; if (!au.ended) setP(false); syncOv(); });
au.addEventListener('ended', () => { G.pos = (G.pos + 1) % G.order.length; load(true); });
let errs = 0; au.addEventListener('error', () => { if (au.getAttribute('src') && ++errs < 5) setTimeout(() => { G.pos = (G.pos + 1) % G.order.length; load(true); }, 1200); });
au.addEventListener('playing', () => { errs = 0; });
go.addEventListener('click', () => { if (!G.list.length) return; if (!au.paused) { au.pause(); return; } if (!au.getAttribute('src')) load(true); else au.play().catch(() => {}); });
$('.cif-gmnext').addEventListener('click', () => { if (!G.list.length) return; G.pos = (G.pos + 1) % G.order.length; load(true); });
coll.addEventListener('change', () => { try { localStorage.setItem('cif.gm', coll.value); } catch (e) {} fillSub(); fill(); load(!au.paused); });
sub.addEventListener('change', () => { fill(); load(!au.paused); });
// Spotify controls take over: stop game music when they're used
['.cif-play', '.cif-rand'].forEach((s) => { const b = root.querySelector(s); if (b) b.addEventListener('click', () => { if (!au.paused) au.pause(); }, true); });
const pl = root.querySelector('.cif-pl'); if (pl) pl.addEventListener('change', () => { if (!au.paused) au.pause(); });
(function init(n) {
  if (!window.LTFGM) { if (n < 100) setTimeout(() => init(n + 1), 100); return; }
  window.LTFGM.load().then(() => {
    coll.innerHTML = ''; window.LTFGM.collections.forEach((c) => { const op = document.createElement('option'); op.value = c.key; op.textContent = c.label; coll.appendChild(op); });
    try { const k = localStorage.getItem('cif.gm'); if (k && window.LTFGM.collections.some((c) => c.key === k)) coll.value = k; } catch (e) {}
    fillSub(); fill();
  }).catch(() => { coll.innerHTML = '<option>Game music is unavailable right now</option>'; });
})(0);
})();
