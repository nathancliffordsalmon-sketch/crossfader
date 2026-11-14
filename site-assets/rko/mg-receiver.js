/* Private helper page on likethefish.ca: receives mobygratis MP3s (downloaded by the site owner in another tab)
   and saves them to the WordPress media library. Only accepts messages from https://mobygratis.com. */
(function () {
  var nonce = null, log = document.createElement('pre');
  log.style.cssText = 'font:12px monospace;background:#111;color:#7f7;padding:10px;max-height:60vh;overflow:auto';
  document.body.insertBefore(log, document.body.firstChild);
  function say(t) { log.textContent = t + '\n' + log.textContent.slice(0, 8000); document.title = t.slice(0, 60); }
  function getNonce() { return nonce ? Promise.resolve(nonce) : fetch('/wp-admin/admin-ajax.php?action=rest-nonce', { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (n) { nonce = n; return n; }); }
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://mobygratis.com') return;
    var m = e.data || {};
    if (m.type === 'ping') { e.source.postMessage({ type: 'pong' }, e.origin); return; }
    if (m.type !== 'upload' || !(m.blob instanceof Blob)) return;
    var name = String(m.name || 'track.mp3').replace(/[^a-z0-9._-]/gi, '-');
    getNonce().then(function (n) {
      return fetch('/wp-json/wp/v2/media', { method: 'POST', credentials: 'same-origin', headers: { 'X-WP-Nonce': n, 'Content-Disposition': 'attachment; filename="' + name + '"', 'Content-Type': 'audio/mpeg' }, body: m.blob });
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error((res.j && res.j.message) || 'upload failed');
        say('saved ' + name + ' -> ' + res.j.source_url);
        e.source.postMessage({ type: 'done', key: m.key, id: res.j.id, url: res.j.source_url }, e.origin);
      })
      .catch(function (err) { say('ERROR ' + name + ': ' + err.message); e.source.postMessage({ type: 'error', key: m.key, msg: err.message }, e.origin); });
  });
  say('ready for mobygratis uploads');
})();
