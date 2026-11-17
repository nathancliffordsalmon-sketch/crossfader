/* Fishing: on-beat fireworks turn into neon pulses.
   When a fish pops right on the beat, its sparks are swapped for soft rings of hazy neon light that
   echo in a few other spots on the screen and fade out. Off-beat pops stay normal fireworks.
   Drawn through window.cifHook (called by the Fishing game every frame). It wraps whatever hook is
   already there (the Boombox Kid), so both keep working. */
(function () {
  'use strict';
  if (window.cifPulse) return; window.cifPulse = true;
  const COLS = ['#38b6ff', '#3ef06a', '#ff5ec8', '#b07cff', '#7fffe9'];
  const seen = new WeakSet();
  const pulses = [];
  const W = 320, FLOOR = 176;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.random() * (b - a);

  function onBeat(R) { return R && R.pulse > 0.62; } // within about an eighth of a second after a beat

  function spawn(x, y, now) {
    const col = pick(COLS), col2 = pick(COLS.filter((c) => c !== col));
    pulses.push({ x, y, t0: now, delay: 0, size: 1, col, col2 });
    const echoes = 2 + Math.floor(Math.random() * 2);
    for (let i = 1; i <= echoes; i++) pulses.push({ x: rnd(30, W - 30), y: rnd(26, FLOOR - 30), t0: now, delay: i * 0.16, size: rnd(0.55, 0.85), col: i % 2 ? col2 : col, col2: col });
    if (pulses.length > 40) pulses.splice(0, pulses.length - 40);
  }

  function killSparks(parts, x, y) {
    for (const p of parts) if (p && (p.k === 'spark') && Math.abs(p.x - x) < 6 && Math.abs(p.y - y) < 6 && p.life < 0.2) p.life = (p.max || 1) + 1;
  }

  function draw(g, now) {
    if (!pulses.length) return;
    g.save();
    g.beginPath(); g.rect(0, 0, W, FLOOR); g.clip();
    g.globalCompositeOperation = 'lighter';
    let haze = 0;
    for (let i = pulses.length - 1; i >= 0; i--) {
      const P = pulses[i], age = (now - P.t0) / 1000 - P.delay, dur = 1.3;
      if (age < 0) continue;
      if (age > dur) { pulses.splice(i, 1); continue; }
      const k = age / dur, fade = Math.pow(1 - k, 1.6), r = (5 + 60 * (1 - Math.pow(1 - k, 2.2))) * P.size;
      haze = Math.max(haze, fade * P.size);
      // soft glow in the middle
      const gr = g.createRadialGradient(P.x, P.y, 0, P.x, P.y, r * 0.9);
      gr.addColorStop(0, hexA(P.col, 0.35 * fade)); gr.addColorStop(1, hexA(P.col, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(P.x, P.y, r * 0.9, 0, Math.PI * 2); g.fill();
      // three rings, glowing and fading
      g.shadowColor = P.col; g.shadowBlur = 10;
      [[1, 2], [0.68, 1.5], [0.38, 1]].forEach(([m, w], j) => {
        g.strokeStyle = hexA(j === 1 ? P.col2 : P.col, fade * (0.9 - j * 0.2));
        g.lineWidth = w; g.beginPath(); g.arc(P.x, P.y, r * m, 0, Math.PI * 2); g.stroke();
      });
      g.shadowBlur = 0;
    }
    // a faint neon haze over the whole scene while pulses are alive
    if (haze > 0.02) { g.fillStyle = hexA('#38b6ff', 0.07 * haze); g.fillRect(0, 0, W, FLOOR); }
    g.restore();
  }
  function hexA(h, a) { const n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }

  function mine(s) {
    const now = performance.now();
    try {
      if (s && s.texts && s.parts) {
        for (const tx of s.texts) {
          if (!tx || seen.has(tx)) continue; seen.add(tx);
          if (tx.life > 0.05) continue; // only brand-new pops
          const x = tx.x, y = tx.y + 14;
          if (onBeat(s.beat)) { killSparks(s.parts, x, y); spawn(x, y, now); }
        }
      }
      if (s && s.ctx) draw(s.ctx, now);
    } catch (e) { /* never break the game */ }
  }

  // wrap whatever hook is there now, and again if something replaces it later
  let inner = null;
  function wrapper(s) { if (inner) { try { inner(s); } catch (e) {} } mine(s); }
  function install() { const cur = window.cifHook; if (cur !== wrapper) { inner = typeof cur === 'function' ? cur : null; window.cifHook = wrapper; } }
  install(); setInterval(install, 1000);
})();
