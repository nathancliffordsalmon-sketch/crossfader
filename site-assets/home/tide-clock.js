/* Like the Fish: live tide clocks for Hubbards Beach and the Bay of Fundy (Burntcoat Head).
   Data: Fisheries and Oceans Canada, Canadian Hydrographic Service, IWLS API (predicted high/low tides).
   Mount: <div class="ltf-tides"></div> then load this script. */
(function () {
  'use strict';
  const API = 'https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/';
  const ST = [
    { id: '5cebf1e03d0f4a073c4bbe93', name: 'Hubbards Beach', sub: 'St. Margarets Bay', col: '#38b6ff', note: 'A gentle South Shore tide: about a metre between high and low.' },
    { id: '5cebf1df3d0f4a073c4bbc58', name: 'Bay of Fundy', sub: 'Burntcoat Head', col: '#ff7a1a', note: 'Home of the highest tides in the world: over 10 metres twice a day.' }
  ];
  const css = `
.ltf-tides{font-family:system-ui,sans-serif;margin:16px 0;color:#1b1b2a}
.ltf-tides .tc-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin:0 0 8px}
.ltf-tides .tc-h b{font:13px/1.2 "Press Start 2P",monospace;color:#1d6fb8}
.ltf-tides .tc-h small{font-size:11px;opacity:.7}
.ltf-tides .tc-g{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ltf-tides .tc{background:linear-gradient(180deg,#0b1d3a,#0d2f55);color:#eaf6ff;border:3px solid #1b1b2a;border-radius:14px;box-shadow:0 4px 0 #1b1b2a;padding:10px 10px 8px;text-align:center;position:relative;overflow:hidden}
.ltf-tides .tc canvas{width:100%;max-width:170px;height:auto;aspect-ratio:1;display:block;margin:0 auto}
.ltf-tides .tc .n{font:700 15px/1.15 Georgia,serif;margin:0}
.ltf-tides .tc .s{font-size:11px;opacity:.8;margin:0 0 4px}
.ltf-tides .tc .now{font-size:13px;margin:4px 0 2px}
.ltf-tides .tc .now b{color:#ffe14a}
.ltf-tides .tc .nx{font-size:11.5px;line-height:1.45;opacity:.95}
.ltf-tides .tc .nt{font-size:10.5px;opacity:.7;margin-top:4px;line-height:1.3}
.ltf-tides .tc-src{font-size:10.5px;opacity:.65;margin-top:6px}
@media (max-width:520px){.ltf-tides .tc-g{grid-template-columns:1fr 1fr;gap:8px}.ltf-tides .tc{padding:8px 6px}.ltf-tides .tc .n{font-size:13px}}
`;
  function boot(root) {
    if (root.dataset.ready) return; root.dataset.ready = '1';
    if (!document.getElementById('ltf-tides-css')) { const s = document.createElement('style'); s.id = 'ltf-tides-css'; s.textContent = css; document.head.appendChild(s); }
    root.innerHTML = '<div class="tc-h"><b>\u{1F30A} Live tide clocks</b><small>right now, real tides</small></div><div class="tc-g"></div><div class="tc-src">Tide predictions: Fisheries and Oceans Canada (Canadian Hydrographic Service). Not for navigation.</div>';
    const grid = root.querySelector('.tc-g');
    const cards = ST.map((st) => {
      const el = document.createElement('div'); el.className = 'tc';
      el.innerHTML = `<p class="n">${st.name}</p><p class="s">${st.sub}</p><canvas width="340" height="340" aria-label="Tide clock for ${st.name}"></canvas><div class="now">Loading the tide…</div><div class="nx"></div><div class="nt">${st.note}</div>`;
      grid.appendChild(el);
      return { st, el, cv: el.querySelector('canvas'), ev: [], err: false };
    });
    const fmt = (d) => d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Halifax' }).replace('a.m.', 'am').replace('p.m.', 'pm');
    const day = (d) => { const t = new Date(), opt = { timeZone: 'America/Halifax' }; const a = d.toLocaleDateString('en-CA', opt), b = t.toLocaleDateString('en-CA', opt); return a === b ? '' : ' ' + d.toLocaleDateString('en-CA', { weekday: 'short', timeZone: 'America/Halifax' }); };
    async function load(c) {
      const from = new Date(Date.now() - 16 * 3600e3).toISOString().slice(0, 19) + 'Z', to = new Date(Date.now() + 40 * 3600e3).toISOString().slice(0, 19) + 'Z';
      try {
        const r = await fetch(`${API}${c.st.id}/data?time-series-code=wlp-hilo&from=${from}&to=${to}`); if (!r.ok) throw new Error(r.status);
        const j = await r.json(); c.ev = j.map((e) => ({ t: new Date(e.eventDate).getTime(), v: +e.value })).sort((a, b) => a.t - b.t);
        c.ev.forEach((e, i) => { const o = c.ev[i - 1] || c.ev[i + 1]; e.high = o ? e.v > o.v : true; });
        c.err = !c.ev.length;
      } catch (e) { c.err = true; }
    }
    function state(c, now) {
      const ev = c.ev; let i = ev.findIndex((e) => e.t > now); if (i <= 0) return null;
      const a = ev[i - 1], b = ev[i], k = (now - a.t) / (b.t - a.t);
      const h = a.v + (b.v - a.v) * (1 - Math.cos(Math.PI * k)) / 2;
      const nextHigh = ev.slice(i).find((e) => e.high), nextLow = ev.slice(i).find((e) => !e.high);
      const lo = Math.min(...ev.map((e) => e.v)), hi = Math.max(...ev.map((e) => e.v));
      return { a, b, k, h, rising: !a.high, nextHigh, nextLow, lo, hi };
    }
    function draw(c, now) {
      const x = c.cv.getContext('2d'), W = c.cv.width, R = W / 2 - 14, cx = W / 2, cy = W / 2, st = state(c, now);
      x.clearRect(0, 0, W, W);
      // face
      const gr = x.createRadialGradient(cx, cy - 30, 10, cx, cy, R + 10); gr.addColorStop(0, '#16406e'); gr.addColorStop(1, '#081a33');
      x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, R + 8, 0, 7); x.fill();
      x.lineWidth = 8; x.strokeStyle = '#d9b84a'; x.beginPath(); x.arc(cx, cy, R + 8, 0, 7); x.stroke();
      // water fill showing the current level
      if (st) {
        const f = (st.h - st.lo) / Math.max(0.01, st.hi - st.lo), lvl = cy + R - f * 2 * R, t = now / 1000;
        x.save(); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.clip();
        x.fillStyle = c.st.col + '55'; x.beginPath(); x.moveTo(cx - R, cy + R);
        for (let px = -R; px <= R; px += 6) x.lineTo(cx + px, lvl + Math.sin(px / 18 + t * 1.6) * 4);
        x.lineTo(cx + R, cy + R); x.closePath(); x.fill();
        x.fillStyle = c.st.col + '33'; x.beginPath(); x.moveTo(cx - R, cy + R);
        for (let px = -R; px <= R; px += 6) x.lineTo(cx + px, lvl + 6 + Math.sin(px / 14 - t * 1.2) * 4);
        x.lineTo(cx + R, cy + R); x.closePath(); x.fill(); x.restore();
      }
      // ticks: 6 hours each side, high at top, low at bottom (classic tide clock)
      x.strokeStyle = '#eaf6ff'; x.fillStyle = '#eaf6ff';
      for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; x.lineWidth = i % 3 ? 2 : 4; x.beginPath(); x.moveTo(cx + Math.cos(a) * (R - 4), cy + Math.sin(a) * (R - 4)); x.lineTo(cx + Math.cos(a) * (R - 18), cy + Math.sin(a) * (R - 18)); x.stroke(); }
      x.font = '700 22px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('HIGH', cx, cy - R + 40); x.fillText('LOW', cx, cy + R - 40);
      x.font = '600 15px Georgia, serif'; x.globalAlpha = 0.85;
      x.fillText('falling', cx + R - 46, cy); x.fillText('rising', cx - R + 46, cy); x.globalAlpha = 1;
      // hand: high at top, sweeps clockwise to low at the bottom, then back up the left
      if (st) {
        const turn = st.rising ? 0.5 + st.k * 0.5 : st.k * 0.5, a = -Math.PI / 2 + turn * Math.PI * 2;
        x.strokeStyle = c.st.col; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - Math.cos(a) * 16, cy - Math.sin(a) * 16); x.lineTo(cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26)); x.stroke();
        x.fillStyle = c.st.col; x.beginPath(); x.arc(cx + Math.cos(a) * (R - 26), cy + Math.sin(a) * (R - 26), 7, 0, 7); x.fill();
      }
      x.fillStyle = '#d9b84a'; x.beginPath(); x.arc(cx, cy, 9, 0, 7); x.fill();
    }
    function text(c, now) {
      const st = state(c, now), nowEl = c.el.querySelector('.now'), nx = c.el.querySelector('.nx');
      if (c.err || !st) { nowEl.textContent = c.err ? 'Tide data is taking a nap. Try again later.' : 'Loading the tide…'; nx.textContent = ''; return; }
      nowEl.innerHTML = `${st.rising ? '⬆ Rising' : '⬇ Falling'} · <b>${st.h.toFixed(1)} m</b>`;
      const parts = [];
      if (st.nextHigh) parts.push(`High ${fmt(new Date(st.nextHigh.t))}${day(new Date(st.nextHigh.t))} (${st.nextHigh.v.toFixed(1)} m)`);
      if (st.nextLow) parts.push(`Low ${fmt(new Date(st.nextLow.t))}${day(new Date(st.nextLow.t))} (${st.nextLow.v.toFixed(1)} m)`);
      if (st.nextHigh && st.nextLow && st.nextLow.t < st.nextHigh.t) parts.reverse();
      nx.innerHTML = parts.join('<br>');
    }
    async function refresh() { await Promise.all(cards.map(load)); cards.forEach((c) => text(c, Date.now())); }
    refresh(); setInterval(refresh, 30 * 60e3); setInterval(() => cards.forEach((c) => text(c, Date.now())), 60e3);
    (function loop() { const now = Date.now(); cards.forEach((c) => draw(c, now)); requestAnimationFrame(loop); })();
  }
  function init() { document.querySelectorAll('.ltf-tides').forEach(boot); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
