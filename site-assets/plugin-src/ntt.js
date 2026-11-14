(function () {
	'use strict';
	var root = document.getElementById('ltf-ntt');
	if (!root || !window.LTF_NTT) return;
	var CFG = window.LTF_NTT;
	var RKO = 'https://remix.kwed.org';
	var GM_JS = CFG.gmJs || 'https://cdn.jsdelivr.net/gh/nathancliffordsalmon-sketch/crossfader@325099fe5343e1bebb9ff25231f1b19fa4706dad/site-assets/rko/gm.js';
	var CLIP = { easy: 12, normal: 6, pro: 3 };
	var ROUND_TIME = 15;
	var state = { game: null, i: 0, score: 0, streak: 0, best: 0, correct: 0, audio: null, timer: null, started: 0, answered: false, clip: 6, mode: 'quick', src: 'spotify' };
	var rkoList = null;

	/* ---------- keep it PG: names on the high score table ---------- */
	var BAD_ANY = ['fuck', 'fuk', 'fck', 'shit', 'cunt', 'bitch', 'biatch', 'nigg', 'nigr', 'niga', 'fagg', 'faggot', 'slut', 'whore', 'porn', 'penis', 'vagina', 'pussy', 'boob', 'blowjob', 'handjob', 'dildo', 'jizz', 'cumshot', 'rapist', 'nazi', 'hitler', 'kkk', 'retard', 'bastard', 'asshole', 'arsehole', 'wank', 'twat', 'bollock', 'testicle', 'horny', 'milf', 'onlyfans', 'motherf', 'spic', 'chink', 'kike', 'tranny', 'molest', 'pedo', 'paedo', 'incest', 'killyourself', 'kys'];
	var BAD_WORD = ['ass', 'arse', 'dick', 'dik', 'cock', 'cum', 'tit', 'tits', 'sex', 'sexy', 'anal', 'anus', 'rape', 'raped', 'piss', 'fag', 'fags', 'homo', 'dyke', 'hoe', 'hoes', 'balls', 'wtf', 'stfu', 'gtfo'];
	function norm(s) {
		return String(s).toLowerCase().replace(/[0]/g, 'o').replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/[4@]/g, 'a').replace(/[5$]/g, 's').replace(/7/g, 't').replace(/8/g, 'b').replace(/9/g, 'g');
	}
	function cleanName(name) {
		var n = String(name || '').replace(/[^\p{L}\p{N} ._'-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
		if (n.length < 2) return { ok: false, msg: 'Type a name with at least 2 letters.' };
		var flat = norm(n).replace(/[^a-z]/g, ''), squash = flat.replace(/(.)\1+/g, '$1');
		var words = norm(n).split(/[^a-z]+/).filter(Boolean);
		var bad = BAD_ANY.some(function (b) { return flat.indexOf(b) >= 0 || squash.indexOf(b) >= 0; }) ||
			words.some(function (w) { var sq = w.replace(/(.)\1+/g, '$1'); return BAD_WORD.indexOf(w) >= 0 || BAD_WORD.indexOf(sq) >= 0 || BAD_WORD.indexOf(w.replace(/s$/, '')) >= 0; });
		if (bad) return { ok: false, msg: 'Let’s keep it PG. Pick another name!' };
		return { ok: true, name: n };
	}

	function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
	function shell() { root.innerHTML = ''; var s = el('div', 'ltf-shell'); root.appendChild(s); return s; }
	function qs(name) { var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; }
	function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('ltf.ntt.' + k)); localStorage.setItem('ltf.ntt.' + k, JSON.stringify(v)); } catch (e) { return null; } }
	function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
	function board() { return state.src + '-' + state.mode; }
	var BOARD_NAMES = { 'spotify-quick': 'Playlists · Quick clips', 'spotify-listen': 'Playlists · Listen first', 'c64-quick': 'C64 remixes · Quick clips', 'c64-listen': 'C64 remixes · Listen first', 'kevin-quick': 'Kevin MacLeod moods · Quick clips', 'kevin-listen': 'Kevin MacLeod moods · Listen first' };
	function srcOf(v) { return v.indexOf('c64:') === 0 ? 'c64' : v.indexOf('gm:') === 0 ? 'kevin' : 'spotify'; }

	(function css() {
		var s = document.createElement('style');
		s.textContent = [
			'.ltf-ntt-next{min-height:0;text-align:center;margin:10px 0 0}',
			'.ltf-ntt-next .ltf-btn{width:100%;font-size:13px;padding:14px}',
			'.ltf-ntt-reveal{margin-top:10px;font-size:20px;text-align:center}',
			'.ltf-ntt-reveal .ltf-btn{font-size:10px;margin:8px 4px 0}',
			'.ltf-ntt-full{position:relative;max-width:560px;margin:10px auto 0;border-radius:12px;overflow:hidden}',
			'.ltf-ntt-full iframe{display:block;width:100%;height:80px;border:0}',
			'.ltf-ntt-mask{position:absolute;left:0;top:0;bottom:0;right:70px;background:#1b1e27;display:flex;align-items:center;padding:0 12px;color:var(--ltf-a);font-size:17px;line-height:1.05;overflow:hidden;border-right:2px dashed #4a4f5c}',
			'.ltf-ntt-fullnote{font-size:16px;opacity:.75;margin-top:4px}',
			'.ltf-ntt-full.open .ltf-ntt-mask{display:none}',
			'.ltf-ntt-hs{margin:14px 0;background:#0d0f14;border:2px solid #4a4f5c;border-radius:8px;padding:10px 14px}',
			'.ltf-ntt-hs h4{margin:0 0 6px;font-family:"Press Start 2P",monospace;font-size:11px;color:var(--ltf-a)}',
			'.ltf-ntt-hs ol{margin:0;padding-left:28px}',
			'.ltf-ntt-hs li{padding:1px 0}',
			'.ltf-ntt-hs li.me{color:var(--ltf-g)}',
			'.ltf-ntt-hs li span{float:right;color:var(--ltf-a)}',
			'.ltf-ntt-name{font-family:"VT323",monospace;font-size:22px;background:#0d0f14;color:var(--ltf-g);border:2px solid #4a4f5c;border-radius:6px;padding:6px 10px;max-width:100%}',
			'.ltf-ntt-err{color:#ff7a7a}'
		].join('\n');
		document.head.appendChild(s);
	})();

	function status(cb) {
		fetch(CFG.rest + 'status').then(function (r) { return r.json(); }).then(cb).catch(function () { cb(null); });
	}
	function loadGM() {
		if (rkoList) return rkoList;
		rkoList = new Promise(function (res, rej) {
			var go = function () { window.LTFGM.load().then(res, rej); };
			if (window.LTFGM) return go();
			var sc = document.createElement('script'); sc.src = GM_JS; sc.onload = go; sc.onerror = rej; document.head.appendChild(sc);
		});
		return rkoList;
	}

	function stopAudio() {
		if (state.audio) { try { state.audio.pause(); } catch (e) {} }
		var eq = root.querySelector('.ltf-ntt-eq'); if (eq) eq.classList.remove('on');
	}

	function scoresBox(boardKey, mine, host) {
		var box = el('div', 'ltf-ntt-hs', '<h4>&#127942; HIGH SCORES: ' + esc(BOARD_NAMES[boardKey] || boardKey) + '</h4><div>loading&hellip;</div>');
		host.appendChild(box);
		fetch(CFG.rest + 'scores?board=' + encodeURIComponent(boardKey)).then(function (r) { return r.json(); }).then(function (j) {
			var list = (j && j.top) || [];
			box.lastChild.innerHTML = list.length ? '<ol>' + list.map(function (x) {
				var me = mine && x.n === mine.n && x.s === mine.s && x.t === mine.t;
				return '<li' + (me ? ' class="me"' : '') + '>' + esc(x.n) + ' <span>' + x.s + '</span></li>';
			}).join('') + '</ol>' : 'No scores yet. Be the first!';
		}).catch(function () { box.lastChild.textContent = 'High scores are napping. Try again later.'; });
		return box;
	}

	function menu(msg) {
		stopAudio(); clearInterval(state.timer);
		var s = shell();
		s.appendChild(el('h2', 'ltf-h', '&#127925; NAME THAT TUNE'));
		s.appendChild(el('p', 'ltf-sub', 'Ten songs. Four choices each. Guess fast for bonus points, or take your time and listen first.'));
		var lcd = el('div', 'ltf-lcd', '<span>JUKEBOX STATUS</span><span id="ltf-ntt-left">checking&hellip;</span>');
		s.appendChild(lcd);
		if (msg) s.appendChild(el('p', 'ltf-sub', '<br>' + msg));

		var row = el('div', 'ltf-row');
		var sel = el('select', 'ltf-select');
		sel.innerHTML = '<option value="">&#127922; Surprise me (any playlist)</option>' + CFG.playlists.map(function (p) {
			return '<option value="' + esc(p.id) + '">' + esc(p.title) + '</option>';
		}).join('') + '<optgroup label="&#127918; Game music"><option value="c64:*">&#128377; C64 remixes: name the game! (RKO Outstanding)</option><option value="c64:all">&#128377; C64 remixes: name the game! (every remix)</option>' +
			'<option value="gm:relaxing">&#127754; Relaxing: name the Kevin MacLeod tune</option><option value="gm:encapsulating">&#128302; Encapsulating: name the Kevin MacLeod tune</option><option value="gm:insanity">&#9889; Insanity: name the Kevin MacLeod tune</option></optgroup>';
		var pre = qs('playlist'); if (pre) sel.value = pre;
		var mode = el('select', 'ltf-select');
		mode.innerHTML = '<option value="quick">&#9201; Quick clips (timed, speed bonus)</option><option value="listen">&#127911; Listen first (no timer, hear the whole song)</option>';
		mode.value = store('mode') || 'quick';
		var diff = el('select', 'ltf-select');
		diff.innerHTML = '<option value="normal">Normal: 6 second clips</option><option value="easy">Easy: 12 second clips</option><option value="pro">Pro: 3 second clips</option>';
		row.appendChild(sel); row.appendChild(mode); row.appendChild(diff);
		s.appendChild(row);
		var syncDiff = function () { diff.style.display = mode.value === 'listen' ? 'none' : ''; };
		mode.onchange = function () { store('mode', mode.value); syncDiff(); }; syncDiff();
		var go = el('button', 'ltf-btn ltf-go', '&#9654; INSERT COIN');
		go.type = 'button';
		s.appendChild(go);
		s.appendChild(el('p', 'ltf-small', '<br>The jukebox allows ' + CFG.limit + ' playlist games a day across the whole site, so play nice. Playlist clips are Spotify previews. Game music doesn’t count toward the limit: C64 remixes stream from <a href="https://remix.kwed.org/" target="_blank" rel="noopener">Remix.Kwed.Org</a>, and the moods are music by Kevin MacLeod (<a href="https://incompetech.com/" target="_blank" rel="noopener">incompetech.com</a>), licensed under Creative Commons: By Attribution 4.0.'));
		var hsHost = el('div'); s.appendChild(hsHost);
		var showBoard = function () { hsHost.innerHTML = ''; scoresBox(srcOf(sel.value) + '-' + mode.value, null, hsHost); };
		sel.addEventListener('change', showBoard); mode.addEventListener('change', showBoard); showBoard();

		status(function (st) {
			var left = document.getElementById('ltf-ntt-left');
			if (!st) { left.textContent = 'ONLINE'; return; }
			left.textContent = st.remaining + ' / ' + st.limit + ' PLAYLIST GAMES LEFT TODAY';
			if (st.remaining <= 0) { go.dataset.rest = '1'; }
		});

		go.onclick = function () {
			state.clip = CLIP[diff.value] || 6;
			state.mode = mode.value;
			state.src = srcOf(sel.value);
			// unlock audio on this user gesture
			state.audio = new Audio();
			state.audio.preload = 'auto';
			try { state.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA='; var pp = state.audio.play(); if (pp && pp.catch) pp.catch(function () {}); } catch (e) {}
			if (state.src === 'c64') { go.disabled = true; go.innerHTML = 'LOADING&hellip;'; c64Game(sel.value.slice(4)); return; }
			if (state.src === 'kevin') { go.disabled = true; go.innerHTML = 'LOADING&hellip;'; kevinGame(sel.value.slice(3)); return; }
			if (go.dataset.rest) { menu('&#128564; The playlist jukebox needs a rest. ' + CFG.limit + ' games have been played today. Try the game music, or come back tomorrow!'); return; }
			go.disabled = true; go.innerHTML = 'LOADING&hellip;';
			fetch(CFG.rest + 'start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playlist: sel.value }) })
				.then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
				.then(function (res) {
					if (res.status === 429) { menu('&#128564; The playlist jukebox needs a rest. ' + CFG.limit + ' games have been played today. Try the game music, or come back tomorrow!'); return; }
					if (!res.ok || !res.j.rounds) { menu('&#9888; ' + esc((res.j && res.j.message) || 'Something went wrong. Try another playlist.')); return; }
					begin(res.j);
				})
				.catch(function () { menu('&#9888; Could not reach the jukebox. Check your connection and try again.'); });
		};
	}

	function begin(game) {
		state.game = game; state.i = 0; state.score = 0; state.streak = 0; state.best = 0; state.correct = 0;
		round();
	}

	/* C64 rounds are built in the browser from the RKO list: hear a remix, name the game */
	function c64Game(which) {
		loadGM().then(function () {
			var G = window.LTFGM, pool = G.items('c64', which), games = G.subOptions('c64').slice(2).map(function (o) { return o[0]; }), used = {}, rounds = [];
			shuffle(pool).forEach(function (x) {
				if (rounds.length >= 10 || used[x.game]) return; used[x.game] = 1;
				var others = shuffle(games.filter(function (g) { return g !== x.game; })).slice(0, 3);
				var opts = shuffle(others.concat([x.game]));
				rounds.push({ preview: x.url, options: opts.map(function (g) { return { t: g, a: 'Commodore 64' }; }), answer: opts.indexOf(x.game), item: x, offset: 20 + Math.floor(Math.random() * 50) });
			});
			begin({ c64: true, playlist: { title: 'C64 Remixes', id: '', url: RKO, logo: '' }, rounds: rounds, remaining: null });
		}).catch(function () { menu('&#9888; Could not load the game music. Try again in a moment.'); });
	}
	/* Kevin MacLeod moods: hear a track, pick its title from four from the same mood */
	function kevinGame(key) {
		loadGM().then(function () {
			var G = window.LTFGM, pool = shuffle(G.items(key)), rounds = [];
			pool.slice(0, 10).forEach(function (x) {
				var others = shuffle(pool.filter(function (y) { return y !== x; })).slice(0, 3);
				var opts = shuffle(others.concat([x]));
				rounds.push({ preview: x.url, options: opts.map(function (y) { return { t: y.title, a: y.feel || 'Kevin MacLeod' }; }), answer: opts.indexOf(x), item: x, offset: 20 + Math.floor(Math.random() * 40) });
			});
			var label = (G.collections.filter(function (c) { return c.key === key; })[0] || {}).short || 'Game music';
			begin({ kevin: true, playlist: { title: label + ' · Kevin MacLeod', id: '', url: 'https://incompetech.com/', logo: '' }, rounds: rounds, remaining: null });
		}).catch(function () { menu('&#9888; Could not load the game music. Try again in a moment.'); });
	}

	function playClip(full) {
		var r = state.game.rounds[state.i];
		var a = state.audio || new Audio();
		state.audio = a;
		stopAudio();
		a.src = r.preview;
		var eq = root.querySelector('.ltf-ntt-eq');
		var start = r.offset;
		var limit = full || state.mode === 'listen' ? 0 : state.clip;
		var onMeta = function () {
			a.removeEventListener('loadedmetadata', onMeta);
			if (limit) { try { a.currentTime = Math.min(start, Math.max(0, (a.duration || 30) - limit - 1)); } catch (e) {} }
			else if (r.item && !full) { try { a.currentTime = Math.min(start, Math.max(0, (a.duration || 60) - 40)); } catch (e) {} }
			a.play().then(function () { if (eq) eq.classList.add('on'); }).catch(function () {});
			if (!limit) { a.onended = function () { if (eq) eq.classList.remove('on'); }; return; }
			var stopAt = a.currentTime + limit;
			var tick = function () {
				if (a.paused) return;
				if (a.currentTime >= stopAt) { a.pause(); if (eq) eq.classList.remove('on'); return; }
				requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		};
		a.addEventListener('loadedmetadata', onMeta);
		a.load();
	}

	function round() {
		clearInterval(state.timer);
		var g = state.game, r = g.rounds[state.i];
		if (r.offset == null) r.offset = Math.floor(Math.random() * 12);
		state.answered = false;
		var listen = state.mode === 'listen';
		var s = shell();
		var head = el('div', 'ltf-lcd', '<span>ROUND ' + (state.i + 1) + '/' + g.rounds.length + '</span><span>' + esc(g.playlist.title) + '</span><span>SCORE ' + state.score + (state.streak > 1 ? ' &#128293;x' + state.streak : '') + '</span>');
		s.appendChild(head);
		// the NEXT button lands here, at the top, so it never drops below the fold
		var nextSlot = el('div', 'ltf-ntt-next'); s.appendChild(nextSlot);
		var stage = el('div', 'ltf-ntt-stage');
		var eq = el('div', 'ltf-ntt-eq'); for (var k = 0; k < 16; k++) eq.appendChild(el('i'));
		stage.appendChild(eq);
		var replay = el('button', 'ltf-btn', listen ? '&#9654; PLAY / RESTART' : '&#8635; REPLAY CLIP'); replay.type = 'button'; replay.onclick = function () { playClip(false); };
		stage.appendChild(replay);
		if (listen) {
			var pause = el('button', 'ltf-btn', '&#10074;&#10074; PAUSE'); pause.type = 'button'; pause.style.marginLeft = '8px';
			pause.onclick = function () { var a = state.audio; if (!a) return; if (a.paused) { a.play().catch(function () {}); eq.classList.add('on'); pause.innerHTML = '&#10074;&#10074; PAUSE'; } else { a.pause(); eq.classList.remove('on'); pause.innerHTML = '&#9654; RESUME'; } };
			stage.appendChild(pause);
			if (r.track) {
				var full = el('div', 'ltf-ntt-full');
				full.innerHTML = '<iframe loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="https://open.spotify.com/embed/track/' + encodeURIComponent(r.track) + '?utm_source=generator&theme=0"></iframe><div class="ltf-ntt-mask">&#127925; Mystery song: tap &#9654; on the right to hear it all</div>';
				stage.appendChild(full);
				stage.appendChild(el('div', 'ltf-ntt-fullnote', 'Logged in to Spotify in this browser? You hear the whole song. Otherwise it plays a preview.'));
				full.addEventListener('pointerdown', function () { stopAudio(); });
			} else if (r.item) {
				stage.appendChild(el('p', 'ltf-small', 'The whole track plays. Take your time.'));
			}
		}
		s.appendChild(stage);
		var bar = el('div', 'ltf-timer'); var fill = el('i'); bar.appendChild(fill); s.appendChild(bar);
		if (listen) bar.style.visibility = 'hidden';
		var opts = el('div', 'ltf-opts');
		r.options.forEach(function (o, idx) {
			var b = el('button', 'ltf-opt', esc(o.t) + '<small>' + esc(o.a) + '</small>');
			b.type = 'button';
			b.onclick = function () { answer(idx, opts, fill, nextSlot); };
			opts.appendChild(b);
		});
		s.appendChild(opts);
		var msg = el('div', 'ltf-sub'); msg.id = 'ltf-ntt-msg'; s.appendChild(msg);
		playClip(false);
		state.started = Date.now();
		if (!listen) {
			state.timer = setInterval(function () {
				var left = ROUND_TIME - (Date.now() - state.started) / 1000;
				fill.style.width = Math.max(0, left / ROUND_TIME * 100) + '%';
				if (left <= 0) { answer(-1, opts, fill, nextSlot); }
			}, 100);
		}
	}

	function emailLink(r, o) {
		var url = 'https://open.spotify.com/track/' + r.track;
		var subj = 'Song from Name That Tune: ' + o.t + ' – ' + o.a;
		var body = 'A song I heard playing Name That Tune on likethefish.ca:\n\n' + o.t + ' – ' + o.a + '\n' + url + '\n\nFor my own listening. Find more playlists at https://likethefish.ca/';
		return 'mailto:?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
	}

	function answer(idx, opts, fill, nextSlot) {
		if (state.answered) return;
		state.answered = true;
		clearInterval(state.timer);
		var r = state.game.rounds[state.i], listen = state.mode === 'listen';
		var btns = opts.querySelectorAll('.ltf-opt');
		for (var k = 0; k < btns.length; k++) { btns[k].disabled = true; }
		btns[r.answer].classList.add('right');
		var msg = document.getElementById('ltf-ntt-msg');
		var o = r.options[r.answer];
		if (idx === r.answer) {
			var secs = (Date.now() - state.started) / 1000;
			var bonus = listen ? 0 : Math.max(0, Math.round(50 * (1 - secs / ROUND_TIME)));
			state.streak++; state.best = Math.max(state.best, state.streak); state.correct++;
			var pts = 100 + bonus + (state.streak > 1 ? 10 * (state.streak - 1) : 0);
			state.score += pts;
			msg.innerHTML = '&#9989; Nailed it! +' + pts + (bonus ? ' (speed bonus ' + bonus + ')' : '');
		} else {
			if (idx >= 0) btns[idx].classList.add('wrong');
			state.streak = 0;
			msg.innerHTML = (idx < 0 ? '&#8987; Time\'s up! ' : '&#10060; Nope! ') + 'It was <b>' + esc(o.t) + '</b>' + (r.item ? '' : ' by ' + esc(o.a)) + '.';
		}
		var full = root.querySelector('.ltf-ntt-full'); if (full) full.classList.add('open');
		var rev = el('div', 'ltf-ntt-reveal');
		if (r.item) {
			var x = r.item;
			rev.innerHTML = (x.src === 'c64'
				? '&#128377; <b>' + esc(x.title) + '</b><br>remix by <b>' + esc(x.by) + '</b> &middot; original ' + esc(x.game) + ' music by <b>' + esc(x.orig) + '</b>' + (x.rating ? ' &middot; rated ' + esc(x.rating) + ' on RKO' : '') + '<br><a class="ltf-btn" target="_blank" rel="noopener" href="' + x.page + '">RKO PAGE &#8599;</a>'
				: '&#127918; <b>' + esc(x.title) + '</b> by <b>Kevin MacLeod</b><br><small>incompetech.com &middot; licensed under Creative Commons: By Attribution 4.0</small><br><a class="ltf-btn" target="_blank" rel="noopener" href="https://incompetech.com/">INCOMPETECH &#8599;</a>') +
				(state.mode === 'quick' ? '<button type="button" class="ltf-btn ltf-ntt-hearall">&#9654; HEAR THE WHOLE TRACK</button>' : '');
		} else if (r.track) {
			rev.innerHTML = '<a class="ltf-btn ltf-go" href="' + esc(emailLink(r, o)) + '">&#9993; EMAIL YOURSELF A SPOTIFY LINK TO THIS SONG FOR YOUR OWN USE!</a>' +
				'<a class="ltf-btn" target="_blank" rel="noopener" href="https://open.spotify.com/track/' + esc(r.track) + '">OPEN IN SPOTIFY &#8599;</a>';
		}
		msg.appendChild(rev);
		var ha = rev.querySelector('.ltf-ntt-hearall'); if (ha) ha.onclick = function () { playClip(true); };
		var next = el('button', 'ltf-btn ltf-go', state.i + 1 < state.game.rounds.length ? 'NEXT SONG &#9654;' : 'FINAL SCORE &#9654;');
		next.type = 'button';
		next.onclick = function () { stopAudio(); state.i++; if (state.i < state.game.rounds.length) { round(); } else { done(); } };
		nextSlot.appendChild(next);
		var rect = nextSlot.getBoundingClientRect();
		if (rect.top < 0 || rect.bottom > window.innerHeight) { nextSlot.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
	}

	function done() {
		stopAudio();
		var g = state.game, n = g.rounds.length;
		var pct = state.correct / n;
		var title = pct === 1 ? 'CERTIFIED LIKE THE FISH DJ' : pct >= 0.8 ? 'GOLDEN EARS' : pct >= 0.5 ? 'SOLID SHUFFLER' : pct >= 0.3 ? 'CAR RADIO REGULAR' : 'TONE DEAF TUNA';
		var s = shell();
		s.appendChild(el('h2', 'ltf-h', 'GAME OVER'));
		s.appendChild(el('div', 'ltf-big', state.score + ' PTS'));
		s.appendChild(el('p', '', state.correct + ' of ' + n + ' correct &middot; best streak ' + state.best + ' &middot; rank: <b style="color:#ffb238">' + title + '</b>'));

		// high score entry
		var key = board();
		var hs = el('div', 'ltf-ntt-hs');
		var hsList = el('div');
		if (state.score > 0) {
			hs.innerHTML = '<h4>&#127942; ENTER YOUR NAME FOR THE HIGH SCORE TABLE</h4>';
			var form = el('div', 'ltf-row');
			var inp = el('input', 'ltf-ntt-name'); inp.type = 'text'; inp.maxLength = 16; inp.placeholder = 'Your name'; inp.value = store('name') || '';
			var save = el('button', 'ltf-btn ltf-go', 'SAVE MY SCORE'); save.type = 'button';
			var err = el('div', 'ltf-ntt-err');
			form.appendChild(inp); form.appendChild(save); hs.appendChild(form); hs.appendChild(err);
			var submit = function () {
				var c = cleanName(inp.value); if (!c.ok) { err.textContent = c.msg; return; }
				save.disabled = true; save.textContent = 'SAVING…'; err.textContent = '';
				fetch(CFG.rest + 'scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: c.name, score: state.score, board: key, correct: state.correct, rounds: n }) })
					.then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
					.then(function (res) {
						if (!res.ok) { save.disabled = false; save.textContent = 'SAVE MY SCORE'; err.textContent = (res.j && res.j.message) || 'Could not save. Try again.'; return; }
						store('name', c.name); form.remove();
						hs.querySelector('h4').innerHTML = '&#127942; SAVED! ' + (res.j.rank ? 'YOU PLACED #' + res.j.rank : 'THANKS FOR PLAYING');
						hsList.innerHTML = ''; scoresBox(key, res.j.entry, hsList);
					})
					.catch(function () { save.disabled = false; save.textContent = 'SAVE MY SCORE'; err.textContent = 'Could not reach the high score table.'; });
			};
			save.onclick = submit; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
			s.appendChild(hs);
		}
		s.appendChild(hsList); scoresBox(key, null, hsList);

		if (g.c64) {
			var credits = {}; g.rounds.forEach(function (r) { credits[r.item.by] = 1; });
			s.appendChild(el('div', 'ltf-card', '<div><h4>Thank you, Remix.Kwed.Org!</h4><p>Remixes by ' + esc(Object.keys(credits).join(', ')) + '. Every track streams from RKO, the home of C64 remakes. Love one? Visit its page and vote.</p><a class="ltf-btn" target="_blank" rel="noopener" href="https://remix.kwed.org/">REMIX.KWED.ORG &#8599;</a></div>'));
		} else if (g.kevin) {
			s.appendChild(el('div', 'ltf-card', '<div><h4>Thank you, Kevin MacLeod!</h4><p>Music by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0. Tracks: ' + esc(g.rounds.map(function (r) { return r.item.title; }).join(', ')) + '.</p><a class="ltf-btn" target="_blank" rel="noopener" href="https://incompetech.com/">INCOMPETECH.COM &#8599;</a></div>'));
		} else {
			var card = el('div', 'ltf-card', (g.playlist.logo ? '<img src="' + esc(g.playlist.logo) + '" alt="">' : '') +
				'<div><h4>' + esc(g.playlist.title) + '</h4><p>Liked these songs? The whole playlist is waiting.</p>' +
				'<a class="ltf-btn" href="' + esc(g.playlist.url) + '">ABOUT THIS PLAYLIST</a> ' +
				'<a class="ltf-btn" target="_blank" rel="noopener" href="https://open.spotify.com/playlist/' + esc(g.playlist.id) + '">SPOTIFY &#8599;</a></div>');
			s.appendChild(card);
		}
		var again = el('button', 'ltf-btn ltf-go', '&#8635; PLAY AGAIN'); again.type = 'button';
		again.onclick = function () { menu(); };
		s.appendChild(again);
		if (g.remaining != null) s.appendChild(el('p', 'ltf-small', '<br>' + g.remaining + ' playlist games left on the jukebox today.'));
	}

	// tapping play inside the Spotify player moves focus into its frame: pause our preview so they don't overlap
	window.addEventListener('blur', function () { setTimeout(function () { var a = document.activeElement; if (a && a.tagName === 'IFRAME' && root.contains(a)) stopAudio(); }, 0); });
	menu();
})();
