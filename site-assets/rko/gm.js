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
    { key: 'insanity', label: '⚡ Insanity (Kevin MacLeod)', short: 'Insanity' }
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
  function load() {
    if (data) return Promise.resolve(data);
    if (loading) return loading;
    loading = Promise.all([
      fetch(BASE + 'remixes.json').then(function (r) { return r.json(); }),
      fetch(BASE + 'incompetech.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      var rk = res[0], inc = res[1];
      data = { games: rk.games, all: {}, byUid: {} };
      data.all.c64 = rk.remixes.map(rkoItem);
      ['relaxing', 'encapsulating', 'insanity'].forEach(function (k) { data.all[k] = (inc.lists[k] || []).map(function (x) { return incItem(k, x); }); });
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
    return '★ ' + (c ? c.short.toUpperCase() : 'GAME MUSIC') + ': 81 tracks by KEVIN MACLEOD ★ incompetech.com ★ Licensed under Creative Commons: By Attribution 4.0 ★ Thank you, Kevin, for 20+ years of free music ★';
  }
  var LTFGM = { collections: COLLECTIONS, load: load, items: items, subOptions: subOptions, intro: intro, byUid: function (u) { return data && data.byUid[u]; }, base: BASE };
  window.LTFGM = LTFGM;
  try { window.dispatchEvent(new Event('ltfgm-ready')); } catch (e) {}
})();
