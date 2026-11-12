/* Playlist Crossfader — renderer
 * Two YouTube players ("decks") are stacked full screen. While one plays, the other is
 * cued with the next song. Near the end of the live song the idle deck starts, and the
 * audio (equal-power curve) and video (opacity) are blended over the crossfade length.
 */
'use strict';

// `api` is provided globally by preload.js (contextBridge).
let EDITION = { public: false };   // filled in at boot from app/edition.json
let PUBLIC = false;
const $ = (s) => document.querySelector(s);

const DEFAULTS = {
  playMode: 'one', pl1: '', pl2: '', mode: 'alternate', shuffle: false,
  silence: true,
  fade: 8, trimStart: 0, trimEnd: 0, maxLen: 0,
  sponsorblock: true,
  cats: { music_offtopic: true, intro: true, outro: true, sponsor: true, selfpromo: true, interaction: true, filler: false },
  displayId: null, volume: 85,
  fx: { bass: 0, vocal: 0, reverb: 0 },
  fontStyle: 'neon', viz: 'song', captions: false, intro: true, barAlways: false,
  ccFont: 'default', ccSize: 1, ccLook: 'box',
  facts: true, factKinds: { song: true, artist: true, news: true, music: true }, factGap: 45
};
const FX_PRESETS = {
  off: { bass: 0, vocal: 0, reverb: 0 }, bass: { bass: 8, vocal: 0, reverb: 0 }, vocal: { bass: 0, vocal: 6, reverb: 0 },
  party: { bass: 6, vocal: 3, reverb: 15 }, hall: { bass: 0, vocal: 2, reverb: 45 }
};
let S = structuredClone(DEFAULTS);

/* ================= YouTube API ready ================= */
let ytReady;
const ytReadyPromise = new Promise((r) => (ytReady = r));
window.onYouTubeIframeAPIReady = () => ytReady();

/* ================= helpers ================= */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shuffleArr(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function withTimeout(p, ms, fallback) { return Promise.race([p, sleep(ms).then(() => fallback)]); }
function fmt(sec) { sec = Math.max(0, Math.round(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; }

function parseListId(s) {
  s = (s || '').trim();
  if (!s) return null;
  const m = s.match(/[?&]list=([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{12,}$/.test(s)) return s;
  return undefined; // present but unreadable
}

function setStatus(msg, isErr) {
  const el = $('#status'); el.textContent = msg || ''; el.classList.toggle('err', !!isErr);
}

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), 1600);
}

const YT_ERRORS = {
  2: 'bad video ID', 5: 'HTML5 player error', 100: 'video removed or private',
  101: 'owner blocks embedding', 150: 'owner blocks embedding',
  152: 'embedding refused (player configuration)', 153: 'embedding refused (missing referrer)'
};
function stageStatus(msg) {
  const l = $('#loading');
  if (msg == null) { l.classList.add('done'); return; }
  l.classList.remove('done'); $('#loadingText').textContent = msg;
}
function log(...a) { console.log('[crossfader]', ...a); }

/* ================= settings UI ================= */
function readForm() {
  S.playMode = (document.querySelector('input[name=playMode]:checked') || {}).value || 'one';
  S.silence = $('#silence').checked;
  S.pl1 = $('#pl1').value.trim();
  S.pl2 = $('#pl2').value.trim();
  S.mode = $('#mode').value;
  S.shuffle = $('#shuffle').checked;
  S.fade = +$('#fade').value;
  S.trimStart = clamp(+$('#trimStart').value || 0, 0, 120);
  S.trimEnd = clamp(+$('#trimEnd').value || 0, 0, 120);
  S.maxLen = clamp(+$('#maxLen').value || 0, 0, 30);
  S.sponsorblock = $('#sb').checked;
  S.facts = $('#facts').checked;
  S.intro = $('#introOn').checked;
  S.barAlways = $('#barAlways').checked;
  S.ccFont = $('#ccFont').value; S.ccSize = +$('#ccSize').value; S.ccLook = $('#ccLook').value;
  S.fontStyle = $('#fontStyle').value; S.viz = $('#viz').value; S.captions = $('#captions').checked;
  document.querySelectorAll('#factCats input').forEach((c) => (S.factKinds[c.dataset.fact] = c.checked));
  S.factGap = +$('#factGap').value || 45;
  document.querySelectorAll('#cats input').forEach((c) => (S.cats[c.dataset.cat] = c.checked));
  S.displayId = +$('#display').value || null;
  S.volume = +$('#volume').value;
}
function fillForm() {
  document.querySelectorAll('input[name=playMode]').forEach((r) => (r.checked = r.value === S.playMode));
  $('#silence').checked = S.silence;
  $('#pl1').value = S.pl1; $('#pl2').value = S.pl2;
  $('#mode').value = S.mode; $('#shuffle').checked = S.shuffle;
  $('#fade').value = S.fade; $('#trimStart').value = S.trimStart; $('#trimEnd').value = S.trimEnd; $('#maxLen').value = S.maxLen;
  $('#sb').checked = S.sponsorblock;
  $('#facts').checked = S.facts;
  $('#introOn').checked = S.intro !== false;
  $('#barAlways').checked = !!S.barAlways;
  $('#ccFont').value = S.ccFont; $('#ccSize').value = String(S.ccSize); $('#ccLook').value = S.ccLook;
  updateCCStyle();
  $('#fontStyle').value = S.fontStyle; $('#viz').value = S.viz; $('#captions').checked = S.captions;
  applyFont();
  document.querySelectorAll('#factCats input').forEach((c) => (c.checked = !!S.factKinds[c.dataset.fact]));
  $('#factGap').value = String(S.factGap);
  syncFx();
  document.querySelectorAll('#cats input').forEach((c) => (c.checked = !!S.cats[c.dataset.cat]));
  $('#volume').value = S.volume;
  syncLabels();
}
function syncLabels() {
  $('#fadeVal').textContent = `${$('#fade').value} s`;
  $('#volVal').textContent = `${$('#volume').value}%`;
  $('#cats').classList.toggle('off', !$('#sb').checked);
  $('#factCats').classList.toggle('off', !$('#facts').checked);
  const two = (document.querySelector('input[name=playMode]:checked') || {}).value === 'two';
  $('#twoOnly').hidden = !two;
  $('#pl1Label').firstChild.textContent = two ? 'Playlist 1 ' : 'Playlist ';
}

/* ================= account ================= */
function showAuth(st) {
  const on = !!(st && st.signedIn);
  $('#acctState').textContent = on ? 'Signed in to YouTube' : 'Not signed in';
  $('#acctState').classList.toggle('on', on);
  $('#acctHint').textContent = on
    ? 'Premium accounts play without ads. Your unlisted playlists will work too.'
    : 'Sign in to use YouTube Premium (no ads) and your unlisted playlists.';
  $('#signInBtn').hidden = on;
  $('#signOutBtn').hidden = !on;
}
async function signIn() {
  $('#signInBtn').disabled = true;
  try { const st = await api.signIn(); if (st) showAuth(st); } finally { $('#signInBtn').disabled = false; }
  // Players created before sign-in keep the old cookies; rebuild them on next start.
  resetPlayers();
}
async function signOut() {
  $('#signOutBtn').disabled = true;
  try { showAuth(await api.signOut()); } finally { $('#signOutBtn').disabled = false; }
  resetPlayers();
}
function resetPlayers() {
  decks.forEach((d, i) => {
    try { d.player && d.player.destroy(); } catch {}
    d.player = null; d.plan = null; d.preparing = null;
    const deckEl = document.getElementById(i ? 'deckB' : 'deckA');
    deckEl.innerHTML = `<div id="${i ? 'playerB' : 'playerA'}"></div>`;
  });
}

/* ================= silence detection (system audio level) ================= */
const Meter = { ok: false, ctx: null, an: null, buf: null, stream: null, level: 0, lastSound: 0, silentMs: 0, timer: null };
async function startMeter() {
  if (Meter.ok || !(S.silence || (PUBLIC && S.viz !== 'off')) || !(await api.loopbackSupported())) return;
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: { width: 1, height: 1, frameRate: 1 }, audio: true });
    if (!stream.getAudioTracks().length) { stream.getTracks().forEach((t) => t.stop()); return; }
    const ctx = new AudioContext();
    const an = ctx.createAnalyser(); an.fftSize = 2048;
    const src = ctx.createMediaStreamSource(stream);
    src.connect(an); // analysed only, never played back
    // Public edition: the side visualizers listen to the PC's sound output (like Winamp did),
    // instead of tapping YouTube's player.
    const vizAn = ctx.createAnalyser(); vizAn.fftSize = 4096; vizAn.smoothingTimeConstant = 0.5; src.connect(vizAn);
    Object.assign(Meter, { ok: true, ctx, an, vizAn, buf: new Float32Array(an.fftSize), stream, lastSound: Date.now() });
  } catch (e) { console.warn('Silence detection unavailable:', e); }
}
function stopMeter() {
  clearInterval(Meter.timer); Meter.timer = null;
  if (Meter.stream) Meter.stream.getTracks().forEach((t) => t.stop());
  if (Meter.ctx) Meter.ctx.close().catch(() => {});
  Object.assign(Meter, { ok: false, ctx: null, an: null, stream: null, level: 0, silentMs: 0 });
}
function readLevel() {
  Meter.an.getFloatTimeDomainData(Meter.buf);
  let sum = 0; for (const v of Meter.buf) sum += v * v;
  const rms = Math.sqrt(sum / Meter.buf.length);
  Meter.level = Meter.level * 0.5 + rms * 0.5;
  if (Meter.level > 0.004) Meter.lastSound = Date.now();
  return Meter.level;
}
// Runs every 100 ms. Only the live song is audible except during a crossfade.
function meterTick() {
  if (!Meter.ok || !S.silence || !running || paused || S.volume < 5) { Meter.silentMs = 0; return; }
  if (decks[live].inAd || (fading && fadeState.inc && fadeState.inc.inAd)) { Meter.silentMs = 0; return; }
  const lvl = readLevel();
  // No sound at all for 25 s means the PC is muted or capture failed: don't act on it.
  if (Date.now() - Meter.lastSound > 25000) { Meter.silentMs = 0; return; }

  if (fading) {
    // During a blend the outgoing song is fading away; if the mix goes dead past the
    // halfway point, the incoming song is starting with silence — jump it forward.
    const inc = fadeState.inc;
    if (!inc || fadeState.t < 0.4) { Meter.silentMs = 0; return; }
    Meter.silentMs = lvl < 0.0015 ? Meter.silentMs + 100 : 0;
    if (Meter.silentMs >= 900 && inc.player.getCurrentTime() - inc.plan.start < 25 && (inc.leadSkips = (inc.leadSkips || 0) + 1) <= 8) {
      inc.player.seekTo(inc.player.getCurrentTime() + 3, true); Meter.silentMs = 0;
    }
    return;
  }

  const d = decks[live];
  if (!d.plan || d.plan.end == null) return;
  const ct = d.player.getCurrentTime();
  const since = ct - d.plan.start;
  if (since > 4) d.peak = Math.max(d.peak || 0, lvl);
  const quiet = lvl < Math.max((d.peak || 0) * 0.02, 0.0015);
  Meter.silentMs = quiet ? Meter.silentMs + 100 : 0;

  // Silent start: skip ahead in 3 s steps until the music arrives.
  if (since < 25 && Meter.silentMs >= 1200 && (d.leadSkips = (d.leadSkips || 0) + 1) <= 8) {
    d.player.seekTo(ct + 3, true); Meter.silentMs = 0; toast('Skipping silence'); return;
  }
  // Song has ended early (silence before the video ends): move on right away.
  const frac = since / Math.max(1, d.plan.end - d.plan.start);
  if (frac > 0.6 && (d.peak || 0) > 0.01 && Meter.silentMs >= 2000) {
    Meter.silentMs = 0; crossfade(Math.min(S.fade, 3));
  }
}
let displays = [];
async function refreshDisplays() {
  displays = await api.displays();
  const sel = $('#display');
  const keep = S.displayId;
  sel.innerHTML = '';
  for (const d of displays) {
    const o = document.createElement('option'); o.value = d.id; o.textContent = d.label; sel.appendChild(o);
  }
  const chosen = displays.find((d) => d.id === keep) || displays.find((d) => !d.primary) || displays[0];
  if (chosen) sel.value = chosen.id;
}

/* ================= playlist loading ================= */
function fetchPlaylistIds(listId) {
  return new Promise((resolve, reject) => {
    const holder = document.createElement('div');
    $('#loaders').appendChild(holder);
    let poll, done = false, player;
    const finish = (ids, err) => {
      if (done) return; done = true;
      clearInterval(poll); clearTimeout(timer);
      try { player.destroy(); } catch {}
      holder.remove();
      err ? reject(err) : resolve(ids);
    };
    const timer = setTimeout(() => finish(null, new Error("Couldn't load that playlist. If it's private, set it to Unlisted in YouTube; otherwise check the link.")), 25000);
    player = new YT.Player(holder, {
      width: 320, height: 180,
      playerVars: { origin: location.origin, autoplay: 0 },
      events: {
        onReady: () => {
          player.mute();
          player.cuePlaylist({ list: listId, listType: 'playlist' });
          poll = setInterval(() => {
            const ids = player.getPlaylist && player.getPlaylist();
            if (ids && ids.length) finish(ids.slice());
          }, 300);
        },
        onError: (e) => finish(null, new Error(`YouTube couldn't open that playlist (error ${e.data}). If it's private, set it to Unlisted in YouTube and try again.`))
      }
    });
  });
}

class Queue {
  constructor(ids, label, shuffle) { this.ids = ids; this.label = label; this.shuffle = shuffle; this.order = []; this.pos = 0; this.bad = new Set(); this.refill(); }
  refill() {
    const last = this.order[this.order.length - 1];
    this.order = this.ids.filter((id) => !this.bad.has(id));
    if (this.shuffle) { shuffleArr(this.order); if (this.order.length > 1 && this.order[0] === last) this.order.push(this.order.shift()); }
    this.pos = 0;
  }
  next() { if (this.pos >= this.order.length) this.refill(); return this.order[this.pos++] || null; }
  markBad(id) { this.bad.add(id); }
  restart() { this.refill(); } // back to the first song (a fresh shuffle if shuffling)
  get usable() { return this.ids.length - this.bad.size; }
}

let queues = [];
let turn = 0;
function pickNext() {
  const qs = queues.filter((q) => q.usable > 0);
  if (!qs.length) return null;
  let q;
  if (S.mode === 'random') {
    const total = qs.reduce((n, x) => n + x.usable, 0);
    let r = Math.random() * total;
    q = qs.find((x) => (r -= x.usable) < 0) || qs[0];
  } else {
    q = qs[turn++ % qs.length];
  }
  const id = q.next();
  return id ? { id, queue: q } : null;
}

/* ================= skip plan ================= */
async function buildPlan(pick) {
  const plan = { id: pick.id, queue: pick.queue, segs: [], start: S.trimStart, origStart: 0, dur: 0, end: null, mids: [], usedSkipData: false };
  const cats = Object.keys(S.cats).filter((k) => S.cats[k]);
  if (S.sponsorblock && cats.length) {
    const segs = await withTimeout(api.segments(pick.id, cats), 3000, []);
    plan.segs = (segs || []).map((s) => ({ s: s.start, e: s.end, cat: s.category })).sort((a, b) => a.s - b.s);
  }
  // Leading segments: start where the first one (or a chain of them) ends.
  if (plan.segs.length) {
    let start = 0, changed = false;
    for (const g of plan.segs) { if (g.s <= start + 2) { start = Math.max(start, g.e); changed = true; } else break; }
    if (changed) { plan.start = start; plan.usedSkipData = true; }
  }
  plan.origStart = plan.start;
  if (PUBLIC) plan.meta = await withTimeout(api.oembed(`https://www.youtube.com/watch?v=${pick.id}`), 3000, null);
  return plan;
}

function resolveEnd(plan, dur) {
  let end = dur;
  let fromData = false;
  for (let i = plan.segs.length - 1; i >= 0; i--) {
    const g = plan.segs[i];
    if (g.e >= end - 2 && g.s > plan.start) { end = Math.min(end, g.s); fromData = true; } else if (g.e < end - 2) break;
  }
  if (!fromData) end = dur - S.trimEnd;
  if (S.maxLen > 0) end = Math.min(end, plan.start + S.maxLen * 60);
  // Sanity: if trimming leaves almost nothing, play the whole thing.
  if (end - plan.start < 30) { plan.start = Math.min(plan.start, Math.max(0, dur - 30)); end = dur; }
  plan.end = end;
  plan.mids = plan.segs.filter((g) => g.s > plan.start + 1 && g.e < end - 1);
}

/* ================= decks ================= */
const decks = [
  { name: 'A', el: null, player: null, plan: null, preparing: null, errors: 0 },
  { name: 'B', el: null, player: null, plan: null, preparing: null, errors: 0 }
];
let live = 1;          // index of the deck currently heard
let running = false;
let paused = false;
let fading = false;
let consecutiveFailures = 0;
const fadeState = { inc: null, t: 0 };
let startMuted = false;

function makePlayer(deck, mountId) {
  return withTimeout(new Promise((resolve) => {
    deck.el = document.getElementById(mountId).parentElement;
    deck.player = new YT.Player(mountId, {
      width: '100%', height: '100%',
      // Public edition: YouTube's own controls stay visible and usable.
      playerVars: PUBLIC
        ? { controls: 1, fs: 0, rel: 0, iv_load_policy: 3, playsinline: 1, autoplay: 0, cc_load_policy: S.captions ? 1 : 0, origin: location.origin }
        : { controls: 0, disablekb: 1, fs: 0, rel: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, autoplay: 0, cc_load_policy: 0, origin: location.origin },
      events: {
        onReady: () => resolve(),
        onError: (e) => onDeckError(deck, e.data),
        onStateChange: (e) => onDeckState(deck, e.data)
      }
    });
  }), 20000, 'timeout').then((r) => { if (r === 'timeout') throw new Error("The YouTube player didn't load (20 s). Check your internet connection and try again."); });
}

let lastErrors = [];
let runId = 0;
const cancelled = (id) => { if (id !== runId) throw new Error('__cancelled__'); };
function prepare(deck, visible) {
  const gen = deck.gen = (deck.gen || 0) + 1; // a newer prepare() for this deck cancels this one
  deck.preparing = (async () => {
    for (let tries = 0; tries < 25; tries++) {
      const pick = pickNext();
      if (!pick) throw new Error(`None of the videos would play. ${lastErrors.length ? 'YouTube said: ' + [...new Set(lastErrors)].join(', ') + '.' : ''}`);
      if (visible) stageStatus(tries ? `Video unavailable (${lastErrors[lastErrors.length - 1] || 'no response'}) — trying the next one… (${tries + 1})` : 'Loading the first song…');
      const plan = await buildPlan(pick);
      if (deck.gen !== gen) return null;
      deck.plan = plan; deck.inAd = false; deck.look = null; deck.lastMove = 0; deck.lastCt = null;
      if (PUBLIC) publicLook(deck, plan);
      deck.player.setVolume(0);
      deck.player.cueVideoById({ videoId: plan.id, startSeconds: plan.start });
      // Wait for it to cue (state 5) or error out.
      const ok = await waitFor(() => deck.plan !== plan ? 'gone' : deck.player.getPlayerState() === 5 ? 'ok' : deck.cueError === plan.id ? 'bad' : null, 8000);
      if (deck.gen !== gen) return null;
      if (ok === 'ok') { updateNext(); return plan; }
      if (ok === 'gone') return deck.plan;
      if (!ok) { lastErrors.push('no response'); log('cue timeout', plan.id, 'state', deck.player.getPlayerState()); }
      plan.queue.markBad(plan.id);
      // Every video refused for the same config reason = the app's setup, not the videos.
      const cfg = lastErrors.slice(-4);
      if (cfg.length === 4 && cfg.every((e) => /configuration|referrer/.test(e)))
        throw new Error(`YouTube is refusing to play videos in this app (${cfg[0]}). Please open the log and send it to me.`);
    }
    throw new Error('Too many unplayable videos in a row');
  })();
  deck.preparing.catch(() => {});
  return deck.preparing;
}

function waitFor(fn, ms) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      let v = null; try { v = fn(); } catch {}
      if (v || Date.now() - t0 > ms) { clearInterval(iv); resolve(v); }
    }, 100);
  });
}

function onDeckError(deck, code) {
  log('player error', code, deck.plan && deck.plan.id);
  lastErrors.push(`error ${code}: ${YT_ERRORS[code] || 'unknown'}`);
  if (!deck.plan) return;
  deck.cueError = deck.plan.id;
  deck.plan.queue.markBad(deck.plan.id);
  if (running && deck === decks[live] && !fading) {
    toast('Video unavailable — skipping');
    crossfade(1);
  }
}

function onDeckState(deck, state) {
  if (!running) return;
  if (PUBLIC && deck === decks[live] && !fading) {
    // Someone used YouTube's own play/pause button: follow it.
    if (state === 2 && !paused) { paused = true; $('#controls').classList.add('paused'); }
    else if (state === 1 && paused) { paused = false; $('#controls').classList.remove('paused'); }
  }
  if (deck === decks[live] && state === 0 && !fading && !deck.inAd) crossfade(1.5); // ended unexpectedly
}

/* ================= crossfade ================= */
async function crossfade(fadeSec = S.fade) {
  if (fading || !running) return;
  fading = true;
  const out = decks[live];
  const inc = decks[1 - live];
  try {
    let plan = null;
    try { plan = await inc.preparing; } catch {}
    if (!plan || inc.plan !== plan || inc.player.getPlayerState() !== 5) plan = await prepare(inc);
    if (!plan) throw new Error('Could not load the next song');
    const playing = () => inc.player.getPlayerState() === 1 || inc.inAd; // an ad counts as playing

    inc.player.setVolume(0);
    if (startMuted) inc.player.mute();
    inc.player.playVideo();
    let started = await waitFor(playing, startMuted ? 8000 : 6000);
    if (!started && !startMuted && inc.plan === plan) {
      // Autoplay with sound can be blocked; muted autoplay is always allowed. Remember it.
      log('play blocked? state', inc.player.getPlayerState(), '- retrying muted');
      inc.player.mute(); inc.player.playVideo();
      started = await waitFor(playing, 6000);
      if (started) startMuted = true;
    }
    if (!started && PUBLIC && inc.plan === plan && inc.cueError !== plan.id) {
      // No error from YouTube, so it's most likely showing an ad first. Carry on.
      log('no playing state yet (ad?) — continuing'); started = true;
    }
    if (started && startMuted) inc.player.unMute();
    if (!started) {
      lastErrors.push('would not start playing');
      plan.queue.markBad(plan.id);
      inc.plan = null; fading = false;
      if (++consecutiveFailures > 10) return stop('Playback keeps failing — check your internet connection.');
      return crossfade(fadeSec);
    }
    consecutiveFailures = 0;
    stageStatus(null);
    sendFx();
    setTimeout(() => loadFacts(inc), 1500);
    hideFact();
    if (inc.inAd) toast('Commercial break 📺');
    inc.el.style.zIndex = 2; out.el.style.zIndex = 1;

    // Equal-power curves: total loudness stays steady through the blend.
    const outStartVol = out.plan ? out.player.getVolume() : 0;
    inc.peak = 0; inc.leadSkips = 0;
    fadeState.inc = inc; fadeState.t = 0;
    sendFx(); applyCC(inc);
    if (inc.look && inc.look.colors !== undefined) setPalette(inc.look);
    let elapsed = 0, last = performance.now();
    await new Promise((res) => {
      const iv = setInterval(() => {
        const now = performance.now();
        if (!paused) elapsed += now - last;
        last = now;
        const t = clamp(elapsed / (fadeSec * 1000), 0, 1);
        const vin = Math.round(S.volume * Math.sin(t * Math.PI / 2));
        const vout = Math.round(Math.min(outStartVol, S.volume) * Math.cos(t * Math.PI / 2));
        try { inc.player.setVolume(vin); if (out.plan) out.player.setVolume(vout); } catch {}
        inc.el.style.opacity = t;
        fadeState.t = t;
        out.el.style.opacity = 1; // keep outgoing visible underneath until the incoming is opaque
        if (t >= 1) { clearInterval(iv); res(); }
      }, 40);
    });

    try { out.player.stopVideo(); } catch {}
    out.el.style.opacity = 0;
    out.plan = null; out.cueError = null;
    fadeState.inc = null;
    live = 1 - live;
    fading = false;
    out.look = null;
    sendFx(); layoutSides();
    showHud(7000);
    prepare(out).catch((e) => stop(e.message));
  } catch (e) {
    fading = false;
    stop(e.message || String(e));
  }
}

/* ================= main loop ================= */
let loopTimer = null;
let tickCount = 0;
function tick() {
  if (!running) return;
  if (++tickCount % 8 === 0) sendFx(); // keeps newly loaded player frames in sync
  const d = decks[live];
  if (!d.plan || !d.player || typeof d.player.getCurrentTime !== 'function') return;
  if (PUBLIC) { publicAdCheck(d); if (paused && !barShown) setBar(true); }
  if (d.inAd) return; // let the ad play; the song continues afterwards
  const ct = d.player.getCurrentTime();
  const dur = d.player.getDuration();
  if (dur > 0 && dur !== d.plan.dur) { d.plan.dur = dur; d.plan.start = d.plan.origStart; resolveEnd(d.plan, dur); }
  if (d.plan.end != null) {
    $('#hudBar').style.width = `${clamp((ct - d.plan.start) / (d.plan.end - d.plan.start), 0, 1) * 100}%`;
    const rem = Math.max(0, d.plan.end - ct), el = Math.max(0, ct - d.plan.start), tot = Math.max(0, d.plan.end - d.plan.start);
    if (!$('#hud').classList.contains('hidden')) $('#hudTime').innerHTML = `<span>${fmt(el)} / ${fmt(tot)}</span><b>${fmt(rem)} left</b>`;
    if (Viz.side) $('#lcdTime').textContent = `-${fmt(rem)}`;
  }
  if (paused || fading) return;
  for (const g of d.plan.mids) {
    if (ct >= g.s && ct < g.e - 0.5) { d.player.seekTo(g.e, true); toast('Skipped non-music part'); break; }
  }
  factTick(d, ct);
  if (d.plan.end != null && ct >= d.plan.end - S.fade) crossfade();
}

/* ================= HUD ================= */
let hudTimer;
function showHud(ms = 6000) {
  const d = decks[live];
  if (!d.plan) return;
  const data = (d.player.getVideoData && d.player.getVideoData()) || {};
  if (d.inAd) {
    $('#hudSrc').textContent = 'Commercial break';
    $('#hudTime').textContent = '';
    $('#hudTitle').textContent = data.title ? `Up after this: ${data.title}` : 'Your song starts after this';
    $('#hudArtist').textContent = data.author || '';
    $('#hudNext').innerHTML = '';
    const hud = $('#hud'); hud.classList.remove('hidden');
    clearTimeout(hudTimer); hudTimer = setTimeout(() => hud.classList.add('hidden'), ms);
    return;
  }
  const tr = d.plan.tracks && d.plan.tracks[d.plan.trackIdx];
  const info = tr ? d.plan.trackInfo || { artist: tr.artist, song: tr.song } : d.plan.info;
  const variant = !tr && info && info.variant ? ` · ${info.variant.kind}` : '';
  $('#hudSrc').textContent = tr ? `In the mix · track ${d.plan.trackIdx + 1} of ${d.plan.tracks.length}`
    : (queues.length > 1 ? d.plan.queue.label : 'Now playing') + variant + (d.plan.usedSkipData ? ' · intro skipped' : '');
  $('#hudTitle').textContent = tr ? (tr.song || tr.text) : (data.title || '');
  const yr = info && info.year;
  const mqArtist = (info && info.artist) || '', mqSong = (info && info.song) || data.title || '';
  const mq = `${mqArtist ? mqArtist + ' - ' : ''}${mqSong}${d.plan.end ? ` (${fmt(d.plan.end - d.plan.start)})` : ''}  ***  `;
  if ($('#lcdMarquee').textContent !== mq) { $('#lcdMarquee').textContent = mq; $('#stage').style.setProperty('--mq', `${Math.max(8, mq.length * 0.32)}s`); }
  $('#lcdLabel').textContent = yr ? `REMAINING · ${yr}` : 'REMAINING';
  $('#hudArtist').textContent = [(info && info.artist) || (tr ? '' : data.author) || '', yr ? `released ${yr}` : ''].filter(Boolean).join(' · ');
  updateNext();
  const hud = $('#hud'); hud.classList.remove('hidden');
  clearTimeout(hudTimer); hudTimer = setTimeout(() => hud.classList.add('hidden'), ms);
}
function updateNext() {
  const n = decks[1 - live];
  const data = n.plan && n.player.getVideoData ? n.player.getVideoData() : null;
  $('#hudNext').innerHTML = '';
  if (data && data.title) {
    const b = document.createElement('b'); b.textContent = data.title;
    $('#hudNext').append('Up next: ', b);
  }
}

/* ================= start / stop ================= */
async function start() {
  readForm();
  api.saveSettings(S);
  const meterReady = startMeter(); // must begin inside the click, before any waiting
  const id1 = parseListId(S.pl1), id2 = S.playMode === 'two' ? parseListId(S.pl2) : null;
  if (id1 === undefined || id2 === undefined) return setStatus("One of the links doesn't look like a playlist — it needs a list=… part.", true);
  if (!id1 && !id2) return setStatus('Paste at least one YouTube playlist link.', true);

  $('#startBtn').disabled = true;
  const my = ++runId;
  try {
    setStatus('Connecting to YouTube…');
    await withTimeout(ytReadyPromise, 15000);
    if (!window.YT || !YT.Player) throw new Error("Couldn't reach YouTube. Check your internet connection.");

    if (id1) savePlaylist(S.pl1, { touch: true });
    if (id2) savePlaylist(S.pl2, { touch: true });
    queues = [];
    let lists = [[id1, 'Playlist 1'], [id2, 'Playlist 2']].filter(([id]) => id);
    if (lists.length === 2 && id1 === id2) lists = [lists[0]]; // same list twice = one-playlist mode
    if (lists.length === 1) lists[0][1] = 'Playlist';
    for (const [id, label] of lists) {
      setStatus(`Loading ${label.toLowerCase()}…`);
      const ids = await fetchPlaylistIds(id);
      queues.push(new Queue(ids, label, S.shuffle));
    }
    turn = Math.floor(Math.random() * queues.length) * (S.shuffle ? 1 : 0);
    setStatus(`Loaded ${queues.map((q) => `${q.ids.length} videos`).join(' + ')}. Starting…`);

    $('#setup').hidden = true;
    $('#stage').hidden = false;
    lastErrors = [];
    $('#controls').classList.add('hidden'); $('#controls').classList.remove('paused');
    toggleFxPanel(false); hideFact(); updateCCBtn();
    barShown = false; setBar(true);
    decks.forEach((d) => (d.look = null)); setPalette(null); Viz.disp.fill(0); Viz.peak.fill(0); layoutSides();
    stageStatus('Opening the players…');
    await api.enterShow(S.displayId);
    cancelled(my);
    log('start', JSON.stringify({ lists: lists.map((l) => l[0]), counts: queues.map((q) => q.ids.length), silence: S.silence }));

    if (!decks[0].player) await Promise.all([makePlayer(decks[0], 'playerA'), makePlayer(decks[1], 'playerB')]);
    cancelled(my);
    decks.forEach((d) => { d.plan = null; d.cueError = null; d.el.style.opacity = 0; });
    live = 1; running = true; paused = false; fading = false; consecutiveFailures = 0;

    decks.forEach((d) => (d.preparing = null));
    sendFx();
    await prepare(decks[0], true);
    cancelled(my);
    stageStatus('Starting playback…');
    clearInterval(loopTimer); loopTimer = setInterval(tick, 250);
    await withTimeout(meterReady, 4000);
    cancelled(my);
    log('silence detection', Meter.ok ? 'on' : 'off');
    clearInterval(Meter.timer); if (Meter.ok) Meter.timer = setInterval(meterTick, 100);
    pokeBar();
    await crossfade(Math.min(3, S.fade)); // fade in the first song
    setStatus('');
  } catch (e) {
    if (e.message !== '__cancelled__') stop(e.message || String(e));
  } finally {
    $('#startBtn').disabled = false;
  }
}

function stop(msg) {
  runId++;
  clearTimeout(barTimer); setBar(true);
  running = false; fading = false; paused = false;
  clearInterval(loopTimer);
  stopMeter();
  decks.forEach((d) => { try { d.player && d.player.stopVideo(); } catch {} d.plan = null; if (d.el) d.el.style.opacity = 0; });
  $('#stage').hidden = true;
  $('#setup').hidden = false;
  api.exitShow();
  setStatus(msg || '', !!msg);
  $('#logBtn').hidden = !msg;
  if (msg) log('stopped:', msg);
}

function togglePause() {
  paused = !paused;
  decks.forEach((d) => {
    if (!d.plan) return;
    const st = d.player.getPlayerState();
    if (paused && (st === 1 || st === 3)) d.player.pauseVideo();
    if (!paused && (d === decks[live] || fading) && st === 2) d.player.playVideo();
  });
  $('#controls').classList.toggle('paused', paused);
  toast(paused ? 'Paused' : 'Playing');
}

function setVolume(v) {
  S.volume = clamp(v, 0, 100);
  if (!fading && decks[live].plan) decks[live].player.setVolume(S.volume);
  toast(`Volume ${S.volume}%`);
  api.saveSettings(S);
}

async function nextMonitor() {
  displays = await api.displays();
  if (displays.length < 2) return toast('Only one monitor connected');
  const i = displays.findIndex((d) => d.id === S.displayId);
  S.displayId = displays[(i + 1) % displays.length].id;
  await api.enterShow(S.displayId);
  api.saveSettings(S);
}

/* ================= sound effects ================= */
let fxSaveTimer;
function syncFx() {
  document.querySelectorAll('[data-fx]').forEach((el) => (el.value = S.fx[el.dataset.fx]));
  document.querySelectorAll('[data-fxval]').forEach((el) => {
    const k = el.dataset.fxval, v = S.fx[k];
    el.textContent = !v ? 'off' : k === 'reverb' ? `${v}%` : `+${v} dB`;
  });
  document.querySelectorAll('[data-preset]').forEach((b) => {
    const p = FX_PRESETS[b.dataset.preset];
    b.classList.toggle('on', Object.keys(p).every((k) => p[k] === S.fx[k]));
  });
}
// One message keeps each player frame in sync: effects, whether it feeds the visualizer, captions.
function vizDeck() { return fading && fadeState.inc ? fadeState.inc : decks[live]; }
function sendFx() {
  if (PUBLIC) return;   // the public edition never messages YouTube's player frame
  const vd = vizDeck();
  const css = S.ccLook === 'karaoke' ? null : ccFrameCss;   // karaoke follows the visualizer colours, rebuilt below
  decks.forEach((d) => {
    try {
      const msg = { __crossfaderFx: { ...S.fx }, __crossfaderViz: running && S.viz !== 'off' && d === vd, __crossfaderCC: !!S.captions };
      const want = css === null ? ccKaraokeCss() : css;
      if (d.ccSent !== want || tickCount % 64 === 0) { msg.__crossfaderCCStyle = want; d.ccSent = want; }
      d.player.getIframe().contentWindow.postMessage(msg, '*');
    } catch {}
  });
}

/* ================= public edition helpers ================= */
const BAR_PX = 150;
// Size each player to its video's shape (from YouTube's oEmbed), above the control bar, and put the
// visualizers in the space beside it — never on top of the player.
function deckRect(d, W, H) {
  const m = d.plan && d.plan.meta, a = m && m.width && m.height ? m.width / m.height : 16 / 9;
  const w = Math.min(W, H * a), h = w / a;
  return { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w: Math.round(w), h: Math.round(h) };
}
// The control bar under the video hides itself after a few idle seconds (unless "always show" is on),
// and the video grows to fill the screen. Mouse movement anywhere on the window or a key brings it back.
let barShown = true, barTimer = null, overBar = false;
function setBar(show) {
  if (show === barShown) return;
  barShown = show;
  $('#stage').classList.toggle('barhidden', !show);
  layoutPublic();
}
function pokeBar() {
  if (!PUBLIC || !running) return;
  setBar(true);
  clearTimeout(barTimer);
  barTimer = setTimeout(() => { if (running && !paused && !S.barAlways && !overBar) setBar(false); }, 3500);
}
function layoutPublic() {
  const st = $('#stage'), W = st.clientWidth, H = st.clientHeight - (barShown ? BAR_PX : 0) - (tickerOn ? TICK_PX : 0);
  decks.forEach((d) => {
    if (!d.el) return;
    const r = deckRect(d, W, H);
    d.el.style.setProperty('--dl', `${r.x}px`); d.el.style.setProperty('--dt', `${r.y}px`);
    d.el.style.setProperty('--dw', `${r.w}px`); d.el.style.setProperty('--dh', `${r.h}px`);
  });
  const used = [decks[live], fading && fadeState.inc].filter((d) => d && d.plan);
  let side = used.length ? Infinity : 0;
  for (const d of used) side = Math.min(side, deckRect(d, W, H).x);
  side = Math.max(0, Math.floor(side) - 2);
  if (S.viz === 'off' || side < 70) side = 0;
  Viz.side = side;
  st.style.setProperty('--side', `${side}px`);
  st.classList.toggle('noside', side === 0);
  document.querySelectorAll('.vizpanel').forEach((p) => p.classList.toggle('narrow', side < 170));
  st.classList.toggle('sidefacts', !barShown && side >= 170);
}
function publicLook(deck, plan) {
  deck.look = { w: (plan.meta && plan.meta.width) || 16, h: (plan.meta && plan.meta.height) || 9, border: 0, colors: null };
  layoutPublic();
  api.thumb(plan.id).then((url) => {
    if (!url || deck.plan !== plan) return;
    const img = new Image();
    img.onload = () => {
      deck.look.colors = colorsFromImage(img);
      if (deck === vizDeck()) setPalette(deck.look);
    };
    img.src = url;
  }).catch(() => {});
}
// Main colours of a picture: weight pixels by saturation × brightness and group by hue.
function colorsFromImage(img) {
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 36;
  const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, 64, 36);
  const d = g.getImageData(0, 0, 64, 36).data;
  const buckets = Array.from({ length: 12 }, () => ({ w: 0, r: 0, g: 0, b: 0 }));
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    if (mx < 40) continue;
    const sat = (mx - mn) / mx; if (sat < 0.25) continue;
    let h = mx === r ? (gg - b) / (mx - mn) : mx === gg ? 2 + (b - r) / (mx - mn) : 4 + (r - gg) / (mx - mn);
    h = ((h * 60) + 360) % 360;
    const w = sat * sat * (mx / 255), k = buckets[Math.floor(h / 30) % 12];
    k.w += w; k.r += r * w; k.g += gg * w; k.b += b * w;
  }
  const ranked = buckets.map((k, i) => ({ ...k, i })).filter((k) => k.w > 0.4).sort((a, z) => z.w - a.w);
  if (!ranked.length) return null;
  const c = (k) => [Math.round(k.r / k.w), Math.round(k.g / k.w), Math.round(k.b / k.w)];
  const first = ranked[0];
  const second = ranked.find((k) => Math.min(Math.abs(k.i - first.i), 12 - Math.abs(k.i - first.i)) >= 2) || null;
  return [c(first), second ? c(second) : null];
}
let specBuf = null;
function loopbackSpectrum() {
  const an = Meter.vizAn;
  if (!specBuf || specBuf.length !== an.frequencyBinCount) specBuf = new Uint8Array(an.frequencyBinCount);
  an.getByteFrequencyData(specBuf);
  const bin = Meter.ctx.sampleRate / an.fftSize, out = [], N = 20, lo = 40, hi = 16000;
  for (let i = 0; i < N; i++) {
    const f0 = lo * Math.pow(hi / lo, i / N), f1 = lo * Math.pow(hi / lo, (i + 1) / N);
    let m = 0; for (let k = Math.floor(f0 / bin); k <= Math.ceil(f1 / bin) && k < specBuf.length; k++) m = Math.max(m, specBuf[k]);
    out.push(m);
  }
  return out;
}
// No access inside the player in the public edition, so spot ads from the outside: the player says
// "playing" but the song's clock isn't moving.
function publicAdCheck(d) {
  const st = d.player.getPlayerState(), ct = d.player.getCurrentTime(), now = Date.now();
  if (st !== 1 || paused) { d.lastMove = now; return; }
  if (d.lastCt === null || Math.abs(ct - d.lastCt) > 0.05) {
    d.lastCt = ct; d.lastMove = now;
    if (d.inAd) { d.inAd = false; log('ad ended (public)'); if (d.plan && ct < d.plan.start - 1) d.player.seekTo(d.plan.start, true); showHud(7000); }
  } else if (!d.inAd && now - d.lastMove > 1600) {
    d.inAd = true; log('ad started (public)'); showHud(60000);
  }
}

/* ================= my playlists ================= */
function canonicalList(id) { return `https://www.youtube.com/playlist?list=${id}`; }
function savePlaylist(url, { touch = false } = {}) {
  const id = parseListId(url);
  if (!id) return null;
  S.myPlaylists = S.myPlaylists || [];
  let e = S.myPlaylists.find((x) => x.id === id);
  if (!e) {
    e = { id, url: canonicalList(id), name: `Playlist ${S.myPlaylists.length + 1}`, auto: true, added: Date.now(), lastUsed: 0 };
    S.myPlaylists.push(e);
    if (S.myPlaylists.length > 60) S.myPlaylists.sort((a, b) => (b.lastUsed || b.added) - (a.lastUsed || a.added)).length = 60;
    api.oembed(e.url).then((info) => {
      if (info && info.title && e.auto) { e.name = info.title; e.author = info.author || ''; api.saveSettings(S); renderMyLists(); }
    }).catch(() => {});
  }
  if (touch) e.lastUsed = Date.now();
  api.saveSettings(S); renderMyLists();
  return e;
}
function renderMyLists() {
  const ul = $('#myLists'), list = (S.myPlaylists || []).slice().sort((a, b) => (b.lastUsed || b.added) - (a.lastUsed || a.added));
  ul.innerHTML = '';
  $('#myListsEmpty').hidden = list.length > 0;
  $('#myListsCount').textContent = list.length ? `${list.length} saved` : '';
  const two = (document.querySelector('input[name=playMode]:checked') || {}).value === 'two';
  for (const e of list) {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.className = 'pl-name'; name.textContent = e.name; name.title = e.url;
    const sub = document.createElement('span'); sub.className = 'pl-sub'; sub.textContent = e.author || '';
    const btn = (label, cls, title, fn) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; if (cls) b.className = cls; b.title = title; b.addEventListener('click', fn); return b; };
    li.append(name, sub,
      btn('▶ Play', 'play', 'Play this playlist now', () => { $('#pl1').value = e.url; setMode('one'); start(); }),
      btn(two ? 'Use as 1' : 'Use', '', 'Put this link in the playlist box', () => { $('#pl1').value = e.url; }),
      ...(two ? [btn('Use as 2', '', 'Put this link in the playlist 2 box', () => { $('#pl2').value = e.url; })] : []),
      btn('✎', 'icon', 'Rename', () => renamePlaylist(e, name)),
      btn('✕', 'icon', 'Remove from My playlists', () => { S.myPlaylists = S.myPlaylists.filter((x) => x !== e); api.saveSettings(S); renderMyLists(); setStatus(`Removed “${e.name}” from My playlists.`); }));
    ul.appendChild(li);
  }
}
function renamePlaylist(e, el) {
  el.contentEditable = 'true'; el.focus();
  const sel = getSelection(); sel.selectAllChildren(el);
  const done = (save) => {
    el.contentEditable = 'false';
    const v = el.textContent.trim();
    if (save && v) { e.name = v.slice(0, 80); e.auto = false; api.saveSettings(S); }
    renderMyLists();
  };
  el.onkeydown = (k) => { if (k.key === 'Enter') { k.preventDefault(); done(true); } if (k.key === 'Escape') done(false); };
  el.onblur = () => done(true);
}
function setMode(m) {
  document.querySelectorAll('input[name=playMode]').forEach((r) => (r.checked = r.value === m));
  syncLabels(); renderMyLists();
}

/* ================= captions ================= */
function applyCC(d) {
  if (!d || !d.player || !d.plan) return;
  try {
    if (S.captions) {
      d.player.loadModule('captions');
      setTimeout(() => {
        try {
          const tl = d.player.getOption('captions', 'tracklist') || [];
          const t = tl.find((x) => /^en/i.test(x.languageCode || '')) || tl[0];
          if (t) d.player.setOption('captions', 'track', { languageCode: t.languageCode });
        } catch {}
      }, 1500);
    } else d.player.unloadModule('captions');
  } catch {}
}
/* ---- caption style: CSS injected into the YouTube frames (font embedded as data) ---- */
const CC_FONTS = {
  vt323: ['VT323', 'vt323-latin-400-normal.woff2', 1.35], press: ['Press Start 2P', 'press-start-2p-latin-400-normal.woff2', 0.72],
  righteous: ['Righteous', 'righteous-latin-400-normal.woff2', 1], audiowide: ['Audiowide', 'audiowide-latin-400-normal.woff2', 0.92],
  shrikhand: ['Shrikhand', 'shrikhand-latin-400-normal.woff2', 0.95], fredoka: ['Fredoka', 'fredoka-latin-500-normal.woff2', 1],
  arial: ['Arial', null, 1], comic: ['"Comic Sans MS", "Comic Neue"', null, 1], courier: ['"Courier New", Courier', null, 1],
  georgia: ['Georgia', null, 1], impact: ['Impact, Haettenschweiler', null, 1]
};
const fontDataCache = {};
async function fontDataUrl(file) {
  if (!fontDataCache[file]) {
    fontDataCache[file] = fetch(`fonts/${file}`).then((r) => r.arrayBuffer()).then((buf) => {
      let bin = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
      return `data:font/woff2;base64,${btoa(bin)}`;
    });
  }
  return fontDataCache[file];
}
function ccRules(seg, win, family, scale, sizeUnit) {
  const look = S.ccLook, c1 = `rgb(${Viz.c1.map(Math.round).join(',')})`, c2 = `rgb(${Viz.c2.map(Math.round).join(',')})`;
  const outline = '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 3px 6px rgba(0,0,0,.8)';
  const looks = {
    box: 'color: #fff !important; background: rgba(8,8,12,.78) !important; text-shadow: none !important;',
    outline: `color: #fff !important; background: transparent !important; text-shadow: ${outline} !important;`,
    neon: 'color: #fff !important; background: transparent !important; text-shadow: 0 0 6px #ff4d6d, 0 0 14px #ff4d6d, 0 0 26px #7c5cff, 0 0 2px #fff !important;',
    yellow: `color: #ffe14d !important; background: transparent !important; text-shadow: ${outline} !important;`,
    karaoke: `color: #fff !important; background: linear-gradient(90deg, ${c1}, ${c2}) !important; text-shadow: 0 2px 3px rgba(0,0,0,.6) !important; border-radius: 6px; padding: 0 .3em !important;`
  };
  const fam = family ? `font-family: ${family} !important;` : '';
  return `${seg} { ${fam} font-size: calc(${sizeUnit} * ${S.ccSize} * ${scale}) !important; line-height: 1.3 !important; ${looks[look] || looks.box} }
${win} { background: transparent !important; }`;
}
let ccFrameCss = '';
let karaokeKey = '', karaokeCss = '';
function ccKaraokeCss() {
  const key = Viz.c1.map((v) => Math.round(v / 16)).join() + Viz.c2.map((v) => Math.round(v / 16)).join();
  if (key !== karaokeKey) {
    karaokeKey = key;
    const head = ccFrameCss.includes('@font-face') ? ccFrameCss.slice(0, ccFrameCss.indexOf('}') + 2) : '';
    const f = CC_FONTS[S.ccFont];
    karaokeCss = head + ccRules('.ytp-caption-window-container .ytp-caption-segment', '.ytp-caption-window-container .caption-window', head ? "'CF Caption'" : (f ? f[0] : null), f ? f[2] : 1, '3.4vh');
  }
  return karaokeCss;
}
async function updateCCStyle() {
  const f = CC_FONTS[S.ccFont];
  // preview in settings (fonts are already loaded on this page)
  let pv = $('#ccPreviewStyle');
  if (!pv) { pv = document.createElement('style'); pv.id = 'ccPreviewStyle'; document.head.appendChild(pv); }
  pv.textContent = ccRules('#ccPreview', '.cc-preview-none', f ? f[0] : 'Roboto, Arial, sans-serif', f ? f[2] : 1, '22px');
  // the YouTube frames
  if (S.ccFont === 'default' && S.ccLook === 'box' && +S.ccSize === 1) { ccFrameCss = ''; }
  else {
    let face = '', family = f ? f[0] : null;
    if (f && f[1]) { face = `@font-face { font-family: 'CF Caption'; src: url(${await fontDataUrl(f[1])}) format('woff2'); }\n`; family = "'CF Caption'"; }
    ccFrameCss = face + ccRules('.ytp-caption-window-container .ytp-caption-segment', '.ytp-caption-window-container .caption-window', family, f ? f[2] : 1, '3.4vh');
  }
  decks.forEach((d) => (d.ccSent = null));
  sendFx();
}
function updateCCBtn() { $('#controls .cc').classList.toggle('on', !!S.captions); }
function toggleCC() {
  S.captions = !S.captions;
  decks.forEach(applyCC); sendFx(); updateCCBtn();
  $('#captions').checked = S.captions;
  toast(S.captions ? 'Captions on (when the video has them)' : 'Captions off');
  api.saveSettings(S);
}

/* ================= font styles ================= */
function applyFont() {
  document.body.classList.remove('font-neon', 'font-arcade', 'font-groovy', 'font-modern');
  document.body.classList.add(`font-${S.fontStyle || 'neon'}`);
}

/* ================= side visualizers ================= */
const Viz = { bands: new Array(20).fill(0), disp: new Float32Array(20), peak: new Float32Array(20), hold: new Float32Array(20),
  c1: [0, 230, 80], c2: [255, 220, 0], t1: [0, 230, 80], t2: [255, 220, 0], side: 0, last: 0, raf: 0 };
const CLASSIC = [[0, 220, 60], [235, 220, 0], [255, 40, 30]];
function rgb2hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s2 = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s2, l];
}
function hsl2rgb([h, s2, l]) {
  const k = (n) => (n + h / 30) % 12, a = s2 * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}
// Push a video colour into a bright, saturated LED colour that reads well on black.
function vivid(c, hueShift = 0, light = 0.55) {
  const [h, s2] = rgb2hsl(c);
  return hsl2rgb([(h + hueShift + 360) % 360, Math.max(s2, 0.78), light]);
}
function setPalette(look) {
  if (S.viz === 'classic') { Viz.t1 = CLASSIC[0]; Viz.t2 = CLASSIC[1]; return; }
  const c = look && look.colors;
  if (c && c[0]) {
    Viz.t1 = vivid(c[0], 0, 0.5);
    Viz.t2 = c[1] ? vivid(c[1], 0, 0.6) : vivid(c[0], 45, 0.66);
  } else { Viz.t1 = [255, 77, 109]; Viz.t2 = [124, 92, 255]; }   // app colours until the video is sampled
}
function deckFor(src) {
  return decks.find((x) => { try { return x.player && x.player.getIframe().contentWindow === src; } catch { return false; } });
}
window.addEventListener('message', (e) => {
  const m = e.data;
  if (!m || (m.__crossfader !== 'spec' && m.__crossfader !== 'look')) return;
  const d = deckFor(e.source);
  if (!d || d !== vizDeck()) return;
  if (m.__crossfader === 'spec') { Viz.bands = m.b; return; }
  d.look = m;
  setPalette(m);
  layoutSides();
});
function layoutSides() {
  if (PUBLIC) return layoutPublic();
  const st = $('#stage'), W = st.clientWidth, H = st.clientHeight;
  const used = [decks[live], fading && fadeState.inc].filter((d) => d && d.plan && d.look && d.look.w);
  let side = used.length ? Infinity : 0;
  for (const d of used) {
    const L = d.look, cw = Math.min(W, H * L.w / L.h) * (1 - 2 * (L.border || 0));
    side = Math.min(side, (W - cw) / 2);
  }
  side = Math.max(0, Math.floor(side));
  if (S.viz === 'off' || side < 70) side = 0;
  Viz.side = side;
  st.style.setProperty('--side', `${side}px`);
  st.classList.toggle('noside', side === 0);
  document.querySelectorAll('.vizpanel').forEach((p) => p.classList.toggle('narrow', side < 170));
}
window.addEventListener('resize', layoutSides);

function segColor(r) {
  if (S.viz === 'classic') {
    const [a, b, c] = CLASSIC;
    const mix = (x, y, t) => x.map((v, i) => Math.round(v + (y[i] - v) * t));
    return r < 0.6 ? mix(a, b, r / 0.6) : mix(b, c, (r - 0.6) / 0.4);
  }
  return Viz.c1.map((v, i) => Math.round(v + (Viz.c2[i] - v) * r));
}
function drawViz(cv, mirror) {
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  const N = w < 140 ? 10 : 20, per = 20 / N;
  const gap = Math.max(2, Math.round(w * 0.014)), bw = (w - gap * (N - 1)) / N;
  const segH = Math.max(3, Math.round(h / 64)), segGap = Math.max(1, Math.round(segH * 0.4)), step = segH + segGap;
  const nSeg = Math.max(4, Math.floor(h / step));
  for (let i = 0; i < N; i++) {
    const idx = mirror ? N - 1 - i : i;
    let v = 0, pk = 0;
    for (let k = 0; k < per; k++) { v = Math.max(v, Viz.disp[idx * per + k]); pk = Math.max(pk, Viz.peak[idx * per + k]); }
    const x = i * (bw + gap), lit = Math.round(v * nSeg);
    for (let sg = 0; sg < lit; sg++) {
      const c = segColor(sg / nSeg);
      g.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      g.fillRect(x, h - (sg + 1) * step + segGap, bw, segH);
    }
    const ps = Math.min(nSeg - 1, Math.round(pk * nSeg));
    if (ps > 0) { g.fillStyle = 'rgba(235,235,245,.9)'; g.fillRect(x, h - (ps + 1) * step + segGap, bw, Math.max(2, segH - 1)); }
  }
}
function vizFrame(ts) {
  Viz.raf = requestAnimationFrame(vizFrame);
  if (!running || !Viz.side) return;
  if (PUBLIC && Meter.vizAn) Viz.bands = loopbackSpectrum();
  const dt = Math.min(0.05, Viz.last ? (ts - Viz.last) / 1000 : 0.016); Viz.last = ts;
  const ease = Math.min(1, dt * 1.2);
  Viz.c1 = Viz.c1.map((v, i) => v + (Viz.t1[i] - v) * ease);
  Viz.c2 = Viz.c2.map((v, i) => v + (Viz.t2[i] - v) * ease);
  const on = paused ? 0 : 1;
  for (let i = 0; i < 20; i++) {
    const target = ((Viz.bands[i] || 0) / 255) * on;
    const shaped = Math.pow(Math.max(0, (target - 0.25) / 0.75), 1.35);   // spread the analyser's dB range
    Viz.disp[i] = shaped > Viz.disp[i] ? shaped : Math.max(shaped, Viz.disp[i] - dt * 1.8);
    if (Viz.disp[i] >= Viz.peak[i]) { Viz.peak[i] = Viz.disp[i]; Viz.hold[i] = 0.4; }
    else if ((Viz.hold[i] -= dt) <= 0) Viz.peak[i] = Math.max(0, Viz.peak[i] - dt * 0.55);
  }
  drawViz($('#vizCanvasL'), false);
  drawViz($('#vizCanvasR'), true);
  const energy = (Viz.disp[0] + Viz.disp[1] + Viz.disp[2] + Viz.disp[3]) / 4;
  const st = $('#stage');
  st.style.setProperty('--glow', `${Math.round(energy * 34)}px`);
  st.style.setProperty('--c1', Viz.c1.map(Math.round).join(','));
  st.style.setProperty('--c2', (S.viz === 'classic' ? CLASSIC[0] : Viz.c2).map(Math.round).join(','));
}
requestAnimationFrame(vizFrame);
function fxChanged() {
  syncFx(); sendFx();
  clearTimeout(fxSaveTimer); fxSaveTimer = setTimeout(() => api.saveSettings(S), 600);
}
document.addEventListener('input', (e) => {
  const k = e.target.dataset && e.target.dataset.fx;
  if (k) { S.fx[k] = +e.target.value; fxChanged(); }
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-preset]');
  if (b) { S.fx = { ...FX_PRESETS[b.dataset.preset] }; fxChanged(); }
});
function toggleFxPanel(force) {
  const p = $('#fxPanel');
  p.hidden = force === undefined ? !p.hidden : !force;
}
$('#fxPanel .x').addEventListener('click', () => toggleFxPanel(false));

/* ================= song facts ================= */
let factTimer;
const MIXY = /\b(mix|megamix|medley|mashup|non-?stop|dj set|live set|tracklist|compilation|best of|greatest hits|hits of the|playlist|full album)\b/i;
function loadFacts(d) {
  const plan = d.plan;
  if (!S.facts || !plan || plan.factsReq) return;
  const data = (d.player.getVideoData && d.player.getVideoData()) || {};
  if (!data.title) return; // not known yet; tick() retries
  plan.factsReq = api.songFacts({ videoId: plan.id, title: data.title, channel: data.author || '' })
    .then((r) => {
      plan.info = r || { facts: [] };
      plan.factQueue = (plan.info.facts || []).filter((f) => S.factKinds[f.kind]);
      // Long mixes / megamixes: read the tracklist from the video description and follow along.
      const dur = d.player.getDuration ? d.player.getDuration() : 0;
      if (MIXY.test(data.title) || dur > 600) {
        api.tracklist(plan.id).then((tracks) => {
          if (tracks && tracks.length >= 3 && d.plan === plan) { plan.tracks = tracks; plan.trackIdx = -1; log('tracklist', plan.id, tracks.length, 'tracks'); }
        }).catch(() => {});
      }
      if (d === decks[live] && plan.info.year && !$('#hud').classList.contains('hidden')) showHud(5000);
    })
    .catch(() => { plan.info = { facts: [] }; plan.factQueue = []; });
}
// Public edition: facts scroll across a ticker strip; the video moves up to make room, then back down.
const TICK_PX = 52, TICK_SPEED = 150; // px per second
let tickerOn = false, tickerTimer = null, tickerStart = null;
function showTicker(f) {
  const txt = $('#tkText'), track = $('#tkTrack');
  txt.innerHTML = ''; const b = document.createElement('b'); b.textContent = f.label; txt.append(b, f.text);
  clearTimeout(tickerTimer); clearTimeout(tickerStart);
  txt.style.transition = 'none'; txt.style.transform = `translate(${track.clientWidth || innerWidth}px, -50%)`;
  tickerOn = true; $('#stage').classList.add('ticking'); layoutPublic();
  tickerStart = setTimeout(() => {          // start scrolling once the strip has slid in
    const from = track.clientWidth, dist = from + txt.scrollWidth, dur = dist / TICK_SPEED;
    txt.style.transform = `translate(${from}px, -50%)`; void txt.offsetWidth;
    txt.style.transition = `transform ${dur}s linear`;
    txt.style.transform = `translate(${-txt.scrollWidth}px, -50%)`;
    tickerTimer = setTimeout(hideTicker, dur * 1000 + 250);
  }, 480);
}
function hideTicker() {
  clearTimeout(tickerTimer); clearTimeout(tickerStart);
  if (!tickerOn) return;
  tickerOn = false; $('#stage').classList.remove('ticking'); layoutPublic();
}
function showFact(f) {
  if (PUBLIC) return showTicker(f);
  $('#factLabel').textContent = f.label;
  $('#factText').textContent = f.text;
  $('#fact').classList.remove('hidden');
  clearTimeout(factTimer);
  factTimer = setTimeout(hideFact, clamp(8000 + f.text.length * 45, 10000, 20000));
}
function hideFact() { clearTimeout(factTimer); $('#fact').classList.add('hidden'); if (PUBLIC) hideTicker(); }
function showNextFact() {
  const plan = decks[live].plan;
  if (!S.facts) return toast('Song facts are turned off in settings');
  if (!plan || !plan.info) return toast('Still looking this song up…');
  if (!plan.factQueue || !plan.factQueue.length) return toast(plan.info.facts && plan.info.facts.length ? 'No more facts for this song' : 'No facts found for this song');
  showFact(plan.factQueue.shift());
  plan.nextFactAt = decks[live].player.getCurrentTime() + Math.max(S.factGap, 20);
}
// Called from tick() for the live song.
function factTick(d, ct) {
  const plan = d.plan;
  if (!S.facts || !plan) return;
  if (!plan.factsReq) loadFacts(d);
  if (plan.tracks) trackTick(d, ct);
  if (!plan.factQueue || !plan.factQueue.length || plan.end == null) return;
  if (plan.nextFactAt == null) plan.nextFactAt = Math.max(plan.start + 18, ct + 6);
  if (ct >= plan.nextFactAt && ct < plan.end - 22) {
    showFact(plan.factQueue.shift());
    plan.nextFactAt = ct + Math.max(S.factGap, 20);
  }
}

// Inside a mix: notice when the next track starts, announce it, and switch to that song's facts.
function trackTick(d, ct) {
  const plan = d.plan;
  let idx = -1;
  for (let i = 0; i < plan.tracks.length; i++) if (plan.tracks[i].t <= ct + 0.5) idx = i;
  if (idx === plan.trackIdx || idx < 0) return;
  plan.trackIdx = idx; plan.trackInfo = null;
  const tr = plan.tracks[idx];
  plan.factQueue = [];
  hideFact();
  if (d === decks[live]) showHud(6000);
  api.songFacts({ videoId: `${plan.id}#${idx}`, title: tr.artist ? `${tr.artist} - ${tr.song}` : tr.text, channel: '' })
    .then((r) => {
      if (plan.trackIdx !== idx || !r) return;
      plan.trackInfo = r;
      plan.factQueue = (r.facts || []).filter((f) => S.factKinds[f.kind]);
      plan.nextFactAt = d.player.getCurrentTime() + 12;
      if (d === decks[live] && !$('#hud').classList.contains('hidden')) showHud(5000);
    }).catch(() => {});
}

/* ================= restart ================= */
function restartSong() {
  if (!running || fading) return;
  const d = decks[live];
  if (!d.plan || d.inAd) return;
  d.player.seekTo(d.plan.start, true);
  d.leadSkips = 0;
  if (paused) togglePause();
  toast('Restarting song');
}
function restartPlaylist() {
  if (!running) return;
  if (fading) return toast('One moment…');
  queues.forEach((q) => q.restart());
  turn = 0;
  const inc = decks[1 - live];
  try { inc.player.stopVideo(); } catch {}
  inc.plan = null;
  prepare(inc).catch(() => {});
  if (paused) togglePause();
  toast('Back to the start of the playlist');
  crossfade(2);
}

/* ================= ads (reported by the player frame, see main.js) ================= */
window.addEventListener('message', (e) => {
  if (!e.data || e.data.__crossfader !== 'ad') return;
  const d = decks.find((x) => { try { return x.player && x.player.getIframe().contentWindow === e.source; } catch { return false; } });
  if (!d || d.inAd === e.data.ad) return;
  d.inAd = e.data.ad;
  log('ad', d.inAd ? 'started' : 'ended', d.plan && d.plan.id);
  if (!running || !d.plan) return;
  if (d === decks[live] && !fading) {
    if (d.inAd) showHud(60000);
    else {
      // Make sure the song still starts where the music starts.
      setTimeout(() => { try { if (d.plan && d.player.getCurrentTime() < d.plan.start - 1) d.player.seekTo(d.plan.start, true); } catch {} }, 600);
      showHud(7000);
    }
  }
});

/* ================= on-screen controls ================= */
let controlsTimer, overControls = false;
let lastHudPoke = 0;
function showControls() {
  if (Date.now() - lastHudPoke > 700) { lastHudPoke = Date.now(); showHud(3200); }
  $('#controls').classList.remove('hidden'); $('#hud').classList.add('lift');
  clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => { if (!overControls) { $('#controls').classList.add('hidden'); $('#hud').classList.remove('lift'); } }, 2500);
}
$('#controls').addEventListener('mouseenter', () => { overControls = true; clearTimeout(controlsTimer); });
$('#controls').addEventListener('mouseleave', () => { overControls = false; showControls(); });
$('#controls').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || !running) return;
  ({ first: restartPlaylist, restart: restartSong, pause: togglePause, facts: showNextFact, fx: () => toggleFxPanel(), cc: toggleCC,
     next: () => { if (paused) togglePause(); crossfade(S.fade); toast('Crossfading…'); }, exit: () => stop() })[b.dataset.act]();
});

/* ================= input ================= */
document.addEventListener('keydown', (e) => {
  if ($('#stage').hidden) return;
  pokeBar();
  if (!running) { if (e.key === 'Escape') stop(); return; }
  if (e.key === 'Escape' && !$('#fxPanel').hidden) { toggleFxPanel(false); return; }
  if (e.target && e.target.matches && e.target.matches('input, select, button') && e.key !== 'Escape' && e.key !== ' ') return;
  const d = decks[live];
  switch (e.key) {
    case ' ': e.preventDefault(); togglePause(); break;
    case 'ArrowRight': case 'n': case 'N':
      if (paused) togglePause();
      crossfade(e.shiftKey ? 1.5 : S.fade); toast(e.shiftKey ? 'Quick cut' : 'Crossfading…'); break;
    case 'ArrowLeft':
      if (!fading && d.plan) { const t = d.player.getCurrentTime() + (e.shiftKey ? 10 : -10); d.player.seekTo(Math.max(d.plan.start, t), true); toast(e.shiftKey ? '+10 s' : '−10 s'); }
      break;
    case 'ArrowUp': e.preventDefault(); setVolume(S.volume + 5); break;
    case 'ArrowDown': e.preventDefault(); setVolume(S.volume - 5); break;
    case 'i': case 'I': showHud(8000); break;
    case 'r': case 'R': restartSong(); break;
    case 't': case 'T': showNextFact(); break;
    case 'c': case 'C': toggleCC(); break;
    case 'e': case 'E': toggleFxPanel(); break;
    case 'Home': case 'b': case 'B': restartPlaylist(); break;
    case 'd': case 'D': nextMonitor(); break;
    case 'f': case 'F': api.toggleFullscreen(); break;
    case 'Escape': stop(); break;
  }
});

let cursorTimer;
$('#shield').addEventListener('mousemove', () => {
  showControls();
  $('#shield').classList.add('cursor');
  clearTimeout(cursorTimer); cursorTimer = setTimeout(() => $('#shield').classList.remove('cursor'), 2000);
});
$('#shield').addEventListener('click', () => showHud(6000));
$('#shield').addEventListener('dblclick', () => api.toggleFullscreen());

/* ================= boot ================= */
(async function boot() {
  EDITION = await api.edition(); PUBLIC = !!EDITION.public;
  document.body.classList.add(PUBLIC ? 'public' : 'full');
  const saved = await api.loadSettings();
  S = { ...structuredClone(DEFAULTS), ...saved, cats: { ...DEFAULTS.cats, ...(saved.cats || {}) },
    fx: { ...DEFAULTS.fx, ...(saved.fx || {}) }, factKinds: { ...DEFAULTS.factKinds, ...(saved.factKinds || {}) } };
  if (PUBLIC) S.fx = { bass: 0, vocal: 0, reverb: 0 };   // no audio processing of YouTube content
  // SponsorBlock data is licensed for non-commercial use: a paid build turns it off (edition "sponsorblock": false).
  if (EDITION.sponsorblock === false) { S.sponsorblock = false; document.getElementById('sbCard').hidden = true; }
  if (S.intro !== false && window.playIntro) playIntro($('#intro')).catch(() => {});
  await refreshDisplays();
  fillForm();
  api.onDisplaysChanged(refreshDisplays);
  ['#ccFont', '#ccSize', '#ccLook'].forEach((id) => $(id).addEventListener('change', () => {
    S.ccFont = $('#ccFont').value; S.ccSize = +$('#ccSize').value; S.ccLook = $('#ccLook').value;
    updateCCStyle(); api.saveSettings(S);
  }));
  $('#barAlways').addEventListener('change', () => { S.barAlways = $('#barAlways').checked; api.saveSettings(S); });
  api.onCursorMoved(() => pokeBar());
  ['#pubBar', '#controls', '#hud'].forEach((id) => {
    $(id).addEventListener('mouseenter', () => { overBar = true; });
    $(id).addEventListener('mouseleave', () => { overBar = false; pokeBar(); });
  });
  $('#introOn').addEventListener('change', () => { S.intro = $('#introOn').checked; api.saveSettings(S); });
  $('#fontStyle').addEventListener('change', () => { S.fontStyle = $('#fontStyle').value; applyFont(); });
  ['#fade', '#volume', '#sb', '#facts'].forEach((s) => $(s).addEventListener('input', syncLabels));
  document.querySelectorAll('input[name=playMode]').forEach((r) => r.addEventListener('change', syncLabels));
  $('#signInBtn').addEventListener('click', signIn);
  $('#logBtn').addEventListener('click', () => api.openLog());
  $('#signOutBtn').addEventListener('click', signOut);
  api.authStatus().then(showAuth).catch(() => showAuth(null));
  if (!(await api.loopbackSupported())) {
    $('#silence').checked = false; $('#silence').disabled = true;
    $('#silenceHint').textContent = 'Silence detection needs Windows. SponsorBlock and the trim settings still work.';
  }
  $('#startBtn').addEventListener('click', start);
  ['#pl1', '#pl2'].forEach((s) => $(s).addEventListener('keydown', (e) => { if (e.key === 'Enter') start(); }));

  // My playlists
  renderMyLists();
  document.querySelectorAll('.save-pl').forEach((b) => b.addEventListener('click', () => {
    const v = $(`#${b.dataset.save}`).value;
    const e = savePlaylist(v);
    setStatus(e ? 'Saved to My playlists.' : "That doesn't look like a playlist link — it needs a list=… part.", !e);
  }));
  document.querySelectorAll('input[name=playMode]').forEach((r) => r.addEventListener('change', renderMyLists));

  // About, support and updates
  $('#aboutName').textContent = EDITION.productName || "Like The Fish's Crossfader";
  $('#aboutVersion').textContent = `v${EDITION.version}${PUBLIC ? '' : ' (personal edition)'}`;
  document.querySelectorAll('[data-url]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); api.openUrl(a.dataset.url); }));
  if (EDITION.supportUrl) { $('#supportBtn').hidden = false; $('#supportBtn').addEventListener('click', () => api.openUrl(EDITION.supportUrl)); }
  if (EDITION.website) { $('#siteLink').hidden = false; $('#siteLink').textContent = EDITION.website.replace(/^https?:\/\//, ''); $('#siteLink').addEventListener('click', (e) => { e.preventDefault(); api.openUrl(EDITION.website); }); }
  if (EDITION.privacyUrl) { $('#privacyLink').hidden = false; $('#privacyLink').addEventListener('click', (e) => { e.preventDefault(); api.openUrl(EDITION.privacyUrl); }); }
  api.checkUpdate().then((u) => {
    if (!u) return;
    const b = $('#updateBanner'); b.hidden = false;
    b.textContent = `Version ${u.version} is available${u.notes ? ` — ${u.notes}` : ''}. `;
    const a = document.createElement('a'); a.href = '#'; a.textContent = 'Get it'; a.addEventListener('click', (e) => { e.preventDefault(); api.openUrl(u.url || EDITION.website); });
    b.appendChild(a);
  }).catch(() => {});
})();
