/* Like the Fish: one Spotify connection for the whole site.
   Connect once on any page; every page that loads this file can follow what's playing in your Spotify app.
   Spotify only allows sign-ins to return to the Rubber Tree page, so the flow goes:
   this page -> Spotify -> Rubber Tree (finishes the sign-in) -> straight back to this page.
   The login is stored in this browser only (localStorage on likethefish.ca, same keys Rubber Tree uses). */
(function () {
  'use strict';
  if (window.LTFSP) return;
  var CID_DEFAULT = 'f371dea691a34f28b53f71ff15b17fad';
  var REDIRECT = location.origin + '/rubber-tree-sessions/';
  var SCOPE = 'user-read-currently-playing user-read-playback-state';
  var K = { tok: 'rtg-sp-tok', cid: 'rtg-cid', pkce: 'rtg-pkce', ret: 'ltf-sp-return' };
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function cid() { return window.SPOTIFY_CLIENT_ID || get(K.cid) || CID_DEFAULT; }
  function tokRec() { try { return JSON.parse(get(K.tok) || '{}') || {}; } catch (e) { return {}; } }
  function connected() { var t = tokRec(); return !!(t.tok || t.refresh); }
  function rnd(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', s = ''; for (var i = 0; i < n; i++) s += c[a[i] % 62]; return s; }
  async function connect() {
    var v = rnd(64), st = rnd(16);
    set(K.cid, cid()); set(K.pkce, JSON.stringify({ v: v, st: st }));
    set(K.ret, JSON.stringify({ url: location.origin + location.pathname + location.hash, at: Date.now() }));
    var dig = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v));
    var ch = btoa(String.fromCharCode.apply(null, new Uint8Array(dig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    var q = new URLSearchParams({ response_type: 'code', client_id: cid(), scope: SCOPE, code_challenge_method: 'S256', code_challenge: ch, redirect_uri: REDIRECT, state: st });
    location.href = 'https://accounts.spotify.com/authorize?' + q;
  }
  function disconnect() { del(K.tok); fire(); }
  async function token() {
    var t = tokRec();
    if (t.tok && Date.now() < (t.exp || 0) - 30000) return t.tok;
    if (!t.refresh) return null;
    try {
      var r = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: t.refresh, client_id: cid() }) });
      var j = await r.json(); if (!r.ok) throw new Error(j.error || r.status);
      t.tok = j.access_token; if (j.refresh_token) t.refresh = j.refresh_token; t.exp = Date.now() + 1000 * j.expires_in;
      set(K.tok, JSON.stringify({ tok: t.tok, refresh: t.refresh, exp: t.exp })); return t.tok;
    } catch (e) { if (/invalid_grant/.test(String(e.message))) { del(K.tok); fire(); } return null; }
  }
  /* what's playing in the visitor's Spotify app right now */
  async function now() {
    var tk = await token(); if (!tk) return { state: 'off' };
    try {
      var r = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: 'Bearer ' + tk } });
      if (r.status === 204) return { state: 'idle' };
      if (r.status === 401) { var t = tokRec(); t.exp = 0; set(K.tok, JSON.stringify(t)); return { state: 'retry' }; }
      if (r.status === 403) return { state: 'denied' };
      if (!r.ok) return { state: 'error', code: r.status };
      var j = await r.json(), it = j.item; if (!it) return { state: 'idle' };
      var title = it.name + (it.artists && it.artists.length ? ' — ' + it.artists.map(function (a) { return a.name; }).join(', ') : '');
      return { state: 'ok', id: it.id, title: title, playing: !!j.is_playing, progress: j.progress_ms, duration: it.duration_ms };
    } catch (e) { return { state: 'error' }; }
  }
  /* follow({ onSong(title, info), onPlaying(bool), onStatus(text) }) -> stop() */
  function follow(cb) {
    var last = null, alive = true, timer = null;
    async function tick() {
      if (!alive) return; var n = await now(); if (!alive) return;
      if (n.state === 'off') cb.onStatus && cb.onStatus('Not connected yet.');
      else if (n.state === 'idle') { cb.onStatus && cb.onStatus('Connected ✓ · nothing playing on Spotify right now'); cb.onPlaying && cb.onPlaying(false); }
      else if (n.state === 'denied') cb.onStatus && cb.onStatus('Spotify says this account isn’t on the guest list yet (ask the site owner to add you).');
      else if (n.state === 'ok') {
        if (n.id !== last) { last = n.id; cb.onSong && cb.onSong(n.title, n); }
        cb.onPlaying && cb.onPlaying(n.playing);
        cb.onStatus && cb.onStatus('Connected ✓ · ' + (n.playing ? '♫ ' : 'paused · ') + n.title);
      } else if (n.state === 'error') cb.onStatus && cb.onStatus('Connection hiccup, retrying…');
      timer = setTimeout(tick, n.state === 'retry' ? 500 : 4000);
    }
    tick();
    return function stop() { alive = false; clearTimeout(timer); };
  }
  /* a ready-made Connect / Disconnect button with a status line */
  var listeners = [];
  function fire() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }
  function button(host, opts) {
    opts = opts || {};
    var wrap = document.createElement('span'); wrap.className = 'ltfsp';
    var b = document.createElement('button'); b.type = 'button'; if (opts.className) b.className = opts.className;
    var out = document.createElement('button'); out.type = 'button'; out.textContent = 'Disconnect'; if (opts.ghostClass) out.className = opts.ghostClass; out.style.marginLeft = '6px';
    function draw() { var c = connected(); b.textContent = c ? '✓ Spotify connected' : '🎧 Connect my Spotify'; b.disabled = c; out.hidden = !c; }
    b.addEventListener('click', function () { if (!connected()) connect(); });
    out.addEventListener('click', disconnect);
    wrap.appendChild(b); wrap.appendChild(out); host.appendChild(wrap); listeners.push(draw); draw();
    return wrap;
  }
  window.addEventListener('storage', function (e) { if (e.key === K.tok) fire(); });

  /* on Rubber Tree: after Spotify sends the visitor back here, wait for Rubber Tree to finish the sign-in,
     then return them to the page they started from */
  (function bounce() {
    var r; try { r = JSON.parse(get(K.ret) || 'null'); } catch (e) { r = null; }
    if (!r || location.pathname.replace(/\/+$/, '') !== '/rubber-tree-sessions') return;
    if (Date.now() - r.at > 15 * 60 * 1000) { del(K.ret); return; }
    var q = new URLSearchParams(location.search), hadCode = q.has('code') || q.has('error');
    if (!hadCode && get(K.pkce)) return; // not a return trip from Spotify
    var before = tokRec().exp || 0, t0 = Date.now();
    var note = document.createElement('div');
    note.textContent = 'Connecting your Spotify… taking you back in a moment.';
    note.style.cssText = 'position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:2147483647;background:#111;color:#fff;font:600 15px system-ui,sans-serif;padding:12px 18px;border-radius:999px;box-shadow:0 6px 24px #0008';
    (document.body || document.documentElement).appendChild(note);
    (function wait() {
      var done = (tokRec().exp || 0) > before || !get(K.pkce);
      if (done || Date.now() - t0 > 12000 || q.has('error')) { del(K.ret); if (r.url && r.url.indexOf(location.origin) === 0) location.replace(r.url); return; }
      setTimeout(wait, 250);
    })();
  })();

  window.LTFSP = { connect: connect, disconnect: disconnect, connected: connected, token: token, now: now, follow: follow, button: button, onChange: function (f) { listeners.push(f); } };
})();
