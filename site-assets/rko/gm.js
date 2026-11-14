/* Like the Fish "Game music" collections, shared by RetroAmp, Rubber Tree, Phantasea, Final Songasy and Name That Tune.
   - C64 remixes: fan remixes streamed from Remix.Kwed.Org (RKO), credited to remixer and composer.
   - Kevin MacLeod (incompetech.com), CC BY 4.0: three 81-song moods picked for a Chime / Lumines / Superbrothers feel.
   Nothing is rehosted: every track streams from its own site. */
(function () {
  if (window.LTFGM) return;
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/gm\.js.*$/, '');
  var RKO = 'https://remix.kwed.org', INC = 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/';
  var COLLECTIONS = [
    { key: 'c64', label: '\u{1F579} C64 remixes (Remix.Kwed.Org)', short: 'C64 remixes' },
    { key: 'relaxing', label: '\u{1F30A} Relaxing (Kevin MacLeod)', short: 'Relaxing' },
    { key: 'encapsulating', label: '\u{1F52E} Encapsulating (Kevin MacLeod)', short: 'Encapsulating' },
    { key: 'insanity', label: '\u26A1 Insanity (Kevin MacLeod)', short: 'Insanity' },
    { key: 'mobygratis-glow', label: '\u{1F3A7} MOBYGRATIS: Glow', short: 'MOBYGRATIS: Glow' },
    { key: 'mobygratis-drive', label: '\u{1F3A7} MOBYGRATIS: Drive', short: 'MOBYGRATIS: Drive' }
  ];
  var KEV = 'Kevin MacLeod', LIC = 'CC BY 4.0';
  var data = null, loading = null;
  function pad(n) { return String(n).padStart(8, '0'); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h % 100000000; }
  function rkoItem(x) {
    return {
      uid: 'rko' + pad(x.id), src: 'c64', title: x.t, by: x.a, orig: x.c, game: x.g, url: RKO + x.dl, page: RKO + '/remix/' + x.id,
      len: x.len, rating: x.r, date: x.date, sid: x.sid, pick: !!x.pick, raw: x,
      sub: x.g, artist: x.a + ' · ' + x.g,
      credit: 'remix by ' + x.a + ' · original ' + x.g + ' music by ' + x.c + (x.r ? ' · rated ' + x.r + ' on RKO' : ''),
      thanks: 'Thank you ' + x.c + ' for the ' + x.g + ' music, and ' + x.a + ' for this remix, “' + x.t + '.” remix.kwed.org/remix/' + x.id + (x.r ? ' · rated ' + x.r : '') + (x.date ? ' · ' + x.date : ''),
      ticker: x.t + ' ★ remixed by ' + x.a + ' ★ original ' + x.g + ' music by ' + x.c + (x.r ? ' ★ rated ' + x.r + ' on RKO' : '') + ' ★ remix.kwed.org/remix/' + x.id + ' ★ thank you ' + x.a + ' & ' + x.c + '!'
    };
  }
  function incItem(key, x) {
    return {
      uid: 'inc' + pad(hash(x.f)), src: key, title: x.t, by: KEV, orig: KEV, game: '', url: INC + encodeURIComponent(x.f),
      page: 'https://incompetech.com/music/royalty-free/music.html', len: x.len, rating: '', feel: x.feel, inst: x.inst, desc: x.desc, bpm: x.bpm, pick: true, raw: x,
      sub: x.feel, artist: KEV,
      credit: 'by Kevin MacLeod (incompetech.com) · licensed under Creative Commons: By Attribution 4.0' + (x.feel ? ' · ' + x.feel : ''),
      thanks: 'Thank you Kevin MacLeod for “' + x.t + '”' + (x.inst ? ' (' + x.inst + ')' : '') + '. incompetech.com · CC BY 4.0' + (x.feel ? ' · ' + x.feel : ''),
      ticker: '“' + x.t + '” by Kevin MacLeod ★ incompetech.com ★ licensed under Creative Commons: By Attribution 4.0 ★ ' + (x.feel ? x.feel + ' ★ ' : '') + 'thank you, Kevin!'
    };
  }
  function mgItem(key, x) {
    var mood = (x.moods || []).join(', ');
    return {
      uid: 'mgr' + pad(hash(x.id)), src: key, title: x.t, by: 'mobygratis', orig: 'mobygratis', game: '', url: x.u,
      page: 'https://mobygratis.com/', len: x.len, rating: '', feel: mood, inst: '', desc: (x.genres || []).join(', '), bpm: x.bpm, pick: true, raw: x, mg: true,
      sub: mood, artist: 'mobygratis',
      credit: 'music from mobygratis (mobygratis.com)' + (mood ? ' \u00b7 ' + mood : ''),
      thanks: 'Thank you, MOBYGRATIS! \u201c' + x.t + '\u201d' + (mood ? ' \u00b7 ' + mood : '') + ' \u00b7 mobygratis.com',
      ticker: '\u201c' + x.t + '\u201d \u2605 music from mobygratis.com \u2605 ' + (mood ? mood + ' \u2605 ' : '') + 'THANK YOU, MOBYGRATIS!'
    };
  }
  function load() {
    if (data) return Promise.resolve(data);
    if (loading) return loading;
    loading = Promise.all([
      fetch(BASE + 'remixes.json').then(function (r) { return r.json(); }),
      fetch(BASE + 'incompetech.json').then(function (r) { return r.json(); }),
      fetch(BASE + 'mobygratis.json').then(function (r) { return r.ok ? r.json() : { lists: {} }; }).catch(function () { return { lists: {} }; })
    ]).then(function (res) {
      var rk = res[0], inc = res[1], mg = res[2];
      data = { games: rk.games, all: {}, byUid: {} };
      data.all.c64 = rk.remixes.map(rkoItem);
      ['relaxing', 'encapsulating', 'insanity'].forEach(function (k) { data.all[k] = (inc.lists[k] || []).map(function (x) { return incItem(k, x); }); });
      ['glow', 'drive'].forEach(function (k) { data.all['mobygratis-' + k] = ((mg.lists || {})[k] || []).filter(function (x) { return x.u; }).map(function (x) { return mgItem('mobygratis-' + k, x); }); });
      COLLECTIONS = COLLECTIONS.filter(function (c) { return !/^mobygratis/.test(c.key) || data.all[c.key].length; }); LTFGM.collections = COLLECTIONS;
      Object.keys(data.all).forEach(function (k) { data.all[k].forEach(function (it) { data.byUid[it.uid] = it; }); });
      return data;
    });
    return loading;
  }
  // which: for c64, '*' (RKO Outstanding starter mix), 'all', or a game name
  function items(key, which) {
    if (!data) return [];
    var l = data.all[key] || [];
    if (key === 'c64') l = l.filter(function (x) { return !which || which === '*' ? x.pick : which === 'all' ? true : x.game === which; });
    return l.slice();
  }
  function subOptions(key) {
    if (!data || key !== 'c64') return [];
    var all = data.all.c64, o = [['*', '★ RKO Outstanding starter mix (' + all.filter(function (x) { return x.pick; }).length + ')'], ['all', 'Every remix (' + all.length + ')']];
    data.games.forEach(function (g) { o.push([g, g + ' (' + all.filter(function (x) { return x.game === g; }).length + ')']); });
    return o;
  }
  function intro(key, list) {
    if (key === 'c64') {
      var seen = {}, rm = [], cp = [];
      list.forEach(function (x) { if (!seen['a' + x.by]) { seen['a' + x.by] = 1; rm.push(x.by); } if (!seen['c' + x.orig] && !/^unknown$/i.test(x.orig)) { seen['c' + x.orig] = 1; cp.push(x.orig); } });
      return '★ THANK YOU, REMIX.KWED.ORG (RKO) ★ Home of C64 remakes since 2001 ★ Remixed by: ' + rm.join(' · ') + ' ★ Original SID music by: ' + cp.join(' · ') + ' ★';
    }
    var c = COLLECTIONS.filter(function (c) { return c.key === key; })[0];
    if (/^mobygratis/.test(key)) return '\u2605 THANK YOU, MOBYGRATIS! \u2605 ' + (c ? c.short.toUpperCase() : 'MOBYGRATIS') + ': ' + list.length + ' tracks from mobygratis.com \u2605 free music for creators \u2605';
    return '★ ' + (c ? c.short.toUpperCase() : 'GAME MUSIC') + ': 81 tracks by KEVIN MACLEOD ★ incompetech.com ★ Licensed under Creative Commons: By Attribution 4.0 ★ Thank you, Kevin, for 20+ years of free music ★';
  }
  /* MOBYGRATIS: a quick ASCII title card before each track, and a play count kept by likethefish.ca
     (the site emails its admin as the free-licence limit of 10,000 streams gets close). */
  var CARDS = [" __  __  ___  ______   _____ ___    _ _____ ___ ___\n|  \\/  |/ _ \\| __ ) \\ / / __| _ \\  /_\\_   _|_ _/ __|\n| |\\/| | (_) | _ \\\\ V / (_ |   / / _ \\| |  | |\\__ \\\n|_|  |_|\\___/|___/ |_| \\___|_|_\\/_/ \\_\\_| |___|___/\n\n        * * *  T H A N K   Y O U  * * *", "+--------------------------------------+\n|  .-----------------------------.     |\n|  |  ( o )   MOBYGRATIS   ( o ) |     |\n|  |   \\_/   ==========    \\_/   |     |\n|  '-----------------------------'     |\n|        side A  >>  THANK YOU!        |\n+--------------------------------------+", "##   ##  ####  #####  ##  ##\n###  ### ##  ## ##  ## ##  ##\n## ### # ##  ## #####   ####\n##  #  # ##  ## ##  ##   ##\n##     #  ####  #####    ##\n      G  R  A  T  I  S\n   ~ thank you for the music ~", "   |    |  |      |     |   |  |\n   |  | |  |  |   |  |  |   |  |\n | |  | || |  | | || |  | | || |\n | || | || || | | || || | | || |\n=================================\n   M O B Y G R A T I S   E Q\n         THANK YOU !", "  .    *        .        *   .\n     *     M O B Y G R A T I S\n  .        ~~~~~~~~~~~~~~~~~     .\n       *    free music for      *\n   .          every creator  .\n  *     .   THANK YOU!    .    *", " **** COMMODORE 64 BASIC V2 ****\n 64K RAM SYSTEM  38911 BASIC BYTES FREE\n\nREADY.\nLOAD \"MOBYGRATIS\",8,1\nSEARCHING FOR MOBYGRATIS\nLOADING\nREADY.\nPRINT \"THANK YOU, MOBYGRATIS!\""];
  var cardN = Math.floor(Math.random() * CARDS.length);
  function splash() {
    try {
      var o = document.createElement('div');
      o.setAttribute('role', 'status'); o.setAttribute('aria-label', 'Thank you, MOBYGRATIS');
      o.style.cssText = 'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(8,6,20,.5),rgba(8,6,20,.12) 70%);pointer-events:none;opacity:0;transition:opacity .35s';
      var pre = document.createElement('pre');
      pre.textContent = CARDS[cardN++ % CARDS.length];
      pre.style.cssText = 'margin:0;padding:18px 20px;max-width:94vw;overflow:hidden;font:bold clamp(8px,2vw,17px)/1.25 ui-monospace,Menlo,Consolas,monospace;color:#7dffb0;text-shadow:0 0 8px rgba(125,255,176,.55);background:rgba(11,15,10,.72);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);pointer-events:auto;cursor:pointer;border:2px solid #2f6;border-radius:10px;white-space:pre';
      o.appendChild(pre); (document.fullscreenElement || document.webkitFullscreenElement || document.body).appendChild(o);
      requestAnimationFrame(function () { o.style.opacity = '1'; });
      var gone = function () { o.style.opacity = '0'; setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 400); };
      pre.addEventListener('click', gone); setTimeout(gone, 2600);
    } catch (e) {}
  }
  var lastPlayed = '';
  function played(item) {
    if (!item || !item.mg || lastPlayed === item.uid) return;
    lastPlayed = item.uid; splash();
    try { fetch('/wp-json/ltf/v1/mg/play', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ track: item.raw && item.raw.slug }) }).catch(function () {}); } catch (e) {}
  }
  var LTFGM = { collections: COLLECTIONS, load: load, items: items, subOptions: subOptions, intro: intro, byUid: function (u) { return data && data.byUid[u]; }, base: BASE, played: played, splash: splash };
  window.LTFGM = LTFGM;
  try { window.dispatchEvent(new Event('ltfgm-ready')); } catch (e) {}
})();
