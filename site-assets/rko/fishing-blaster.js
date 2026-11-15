/* Fishing: the Boombox Kid. An original character who visits every level.
   He arrives by speedboat, skates up a ramp and jumps to the hatch, then walks the level with a boombox on his shoulder.
   It pumps to the beat, and any fish near him stops what it's doing and dances. When the level ends he jumps,
   opens a parachute and drops into his speedboat, which roars off.
   Drawn through window.cifHook, called by the Fishing game every frame (see the Fishing page). */
(function () {
  'use strict';
  if (window.cifBlaster) return;
  const WATER = 166, SPEED = 9;
  const K = { st: 'wait', x: -30, y: WATER, dir: 1, t: 0, lvl: null, boat: { x: -40, on: false, vx: 0 }, ramp: null, jump: null, beatPrev: 0, walkF: 0, bob: 0, nextTurn: 0 };
  let last = performance.now();
  function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }

  function landingSpot(s) {
    const L = s.lvl, hx = L.hatch.x + 8;
    for (let y = L.hatch.y + 10; y < WATER - 1; y++) if (s.solid(hx, y)) return { x: hx, y: y - 1 };
    const P = L.plats || []; let best = null, bd = 1e9;
    P.forEach((p) => { const mx = (p.x0 + p.x1) / 2, d = Math.abs(mx - hx); if (d < bd) { bd = d; best = { x: Math.round(mx), y: p.y - 1 }; } });
    return best || { x: 160, y: 120 };
  }
  // nearest x (either side) with nothing solid between here and the water, so the parachute drops clear
  function clearColumn(s, x, y) {
    const free = (cx) => { for (let yy = Math.round(y) - 12; yy < WATER - 1; yy++) if (s.solid(cx, yy)) return false; return true; };
    for (let d = 6; d < 320; d += 2) { if (x + d < 316 && free(Math.round(x + d))) return x + d + 3; if (x - d > 4 && free(Math.round(x - d))) return x - d - 3; }
    return x;
  }
  // find the ground under/near (x, y) within a small step
  function groundAt(s, x, y) { for (let k = -5; k <= 7; k++) { const yy = y + k; if (!s.solid(x, yy) && s.solid(x, yy + 1)) return yy; } return null; }

  function think(s, dt) {
    const L = s.lvl; K.t += dt;
    if (L !== K.lvl) { K.lvl = L; if (K.st === 'wait' || K.st === 'gone') { K.st = 'wait'; K.t = 0; } }
    const ending = L.ended || L.t >= L.dur - 14;
    switch (K.st) {
      case 'wait':
        if (L.t > 4.5 && !ending) {
          const land = landingSpot(s); K.land = land;
          const rx = Math.max(24, Math.min(270, land.x - 46));
          K.ramp = { x: rx, top: WATER - 16 };
          K.boat = { x: -36, on: true, vx: 60, stopX: rx - 18 }; K.x = K.boat.x; K.y = WATER - 3; K.dir = 1; K.st = 'boatIn'; K.t = 0;
        }
        break;
      case 'boatIn': {
        const b = K.boat; b.x = Math.min(b.stopX, b.x + b.vx * dt); K.x = b.x + 4; K.y = WATER - 3;
        if (b.x >= b.stopX) { K.st = 'skate'; K.t = 0; }
        break;
      }
      case 'skate': { // up the ramp on his skateboard
        const r = K.ramp, len = 18, p = Math.min(1, K.t / 0.7);
        K.x = r.x - 6 + p * (len + 6); K.y = WATER - 3 - p * 16;
        if (p >= 1) { K.st = 'jump'; K.t = 0; K.jump = { x0: K.x, y0: K.y, x1: K.land.x, y1: K.land.y }; }
        break;
      }
      case 'jump': {
        const j = K.jump, p = Math.min(1, K.t / 1.1), h = Math.max(24, (j.y0 - j.y1) + 22);
        K.x = j.x0 + (j.x1 - j.x0) * p; K.y = j.y0 + (j.y1 - j.y0) * p - h * 4 * p * (1 - p); K.dir = j.x1 >= j.x0 ? 1 : -1;
        if (p >= 1) { K.st = 'walk'; K.t = 0; K.boat.vx = -50; s.texts.push({ x: K.x, y: K.y - 16, s: 'BOOM BOX!', life: 0, max: 1.4 }); }
        break;
      }
      case 'walk': {
        if (K.boat.on) { K.boat.x += K.boat.vx * dt; if (K.boat.x < -50) K.boat.on = false; }
        if (ending) { K.st = 'leap'; K.t = 0; K.y0 = K.y; K.x0 = K.x; K.x1 = clearColumn(s, K.x, K.y); K.dir = K.x1 >= K.x ? 1 : -1; break; }
        const cx = Math.round(K.x), cy = Math.round(K.y);
        // ground dug out from under him: drop gently to whatever is below (never into the water)
        if (!s.solid(cx, cy + 1) && groundAt(s, cx, cy) == null) { let yy = cy + 1; while (yy < WATER - 2 && !s.solid(cx, yy + 1)) yy++; if (yy < WATER - 2) { K.y = Math.min(yy, K.y + 40 * dt); break; } }
        const nx = K.x + K.dir * SPEED * dt, ix = Math.round(nx), gy = groundAt(s, ix, cy);
        const edge = nx < 4 || nx > 316, wall = gy == null ? s.solid(ix, cy) : s.solid(ix, gy - 10);
        if (!edge && (wall || (gy != null && gy < cy - 4))) {
          // a wall or tall step ahead: climb it if there's a top within reach and room to stand up there
          let top = null; for (let yy = cy; yy > cy - 44 && yy > 2; yy--) { if (!s.solid(ix + K.dir, yy) && s.solid(ix + K.dir, yy + 1)) { let room = true; for (let h = 1; h <= 10; h++) if (s.solid(ix + K.dir, yy - h)) { room = false; break; } if (room) { top = yy; break; } } }
          if (top != null) { K.st = 'climb'; K.t = 0; K.cx = ix + K.dir; K.ty = top; break; }
        }
        // a drop ahead: climb down if there's ground below within reach (never jump or fall), otherwise turn around
        if (!edge && gy == null && !s.solid(ix, cy) && Math.random() < 0.6) {
          let low = null; for (let yy = cy + 1; yy < cy + 44 && yy < WATER - 4; yy++) if (!s.solid(ix, yy) && s.solid(ix, yy + 1)) { low = yy; break; }
          if (low != null) { K.st = 'climbDown'; K.t = 0; K.cx = ix; K.ty = low; break; }
        }
        // never walk off a ledge: no ground within a small step down means turn around
        if (edge || gy == null || wall || (K.t > K.nextTurn && Math.random() < 0.004)) { K.dir *= -1; K.nextTurn = K.t + 3; }
        else { K.x = nx; K.y = gy; }
        K.walkF += dt * 6;
        // the boombox makes nearby fish dance for a moment, then lets them carry on (no dancing again for a while)
        const now = performance.now() / 1000;
        s.fish.forEach((f) => { if (f.dead || f.st !== 'walk') return; if (Math.abs(f.x - K.x) < 26 && Math.abs(f.y - K.y) < 14 && now > (f._bbFree || 0)) { f.st = 'dance'; f.dance = Math.max(f.dance || 0, 1.0); f._bbFree = now + 9; } });
        break;
      }
      case 'climb': { // hand over hand up the wall, then step onto the top
        if (ending) { K.st = 'walk'; break; }
        K.walkF += dt * 8; K.y -= 14 * dt; K.x = K.cx - K.dir * 2;
        if (K.y <= K.ty) { K.y = K.ty; K.x = K.cx + K.dir; K.st = 'walk'; K.nextTurn = K.t + 2; }
        break;
      }
      case 'climbDown': {
        if (ending) { K.st = 'walk'; break; }
        K.walkF += dt * 8; K.x = K.cx; K.y += 14 * dt;
        if (K.y >= K.ty) { K.y = K.ty; K.st = 'walk'; K.nextTurn = K.t + 2; }
        break;
      }
      case 'leap': { // jump off, then parachute down to the boat
        const p = Math.min(1, K.t / 0.9); K.x = K.x0 + (K.x1 - K.x0) * p; K.y = K.y0 - 22 * Math.sin(p * Math.PI);
        if (p >= 1) { K.st = 'chute'; K.t = 0; K.boat = { x: K.x < 160 ? -36 : 340, on: true, vx: 70 }; }
        break;
      }
      case 'chute': {
        K.y += 16 * dt; const sway = Math.sin(K.t * 1.8) * 6 * dt; if (!s.solid(Math.round(K.x + sway), Math.round(K.y) + 1)) K.x += sway;
        const b = K.boat, target = K.x - 8; b.x += Math.max(-80, Math.min(80, (target - b.x) * 2.5)) * dt;
        if (K.y >= WATER - 4) { K.y = WATER - 3; K.st = 'away'; K.t = 0; b.vx = 120; s.texts.push({ x: K.x, y: K.y - 18, s: 'LATER!', life: 0, max: 1.2 }); }
        break;
      }
      case 'away': {
        const b = K.boat; b.x += b.vx * dt; K.x = b.x + 8; K.y = WATER - 3; K.dir = 1;
        if (b.x > 340) { K.st = 'gone'; b.on = false; }
        break;
      }
    }
    // pump to the beat: notes from the boombox
    const pulse = s.beat.pulse || 0;
    if (pulse > 0.9 && K.beatPrev <= 0.9 && (K.st === 'walk' || K.st === 'boatIn')) s.note(K.x + K.dir * 4, K.y - 14);
    K.beatPrev = pulse;
    K.bob = pulse > 0.5 ? 1 : 0;
  }

  function drawBoat(g) {
    const b = K.boat; if (!b.on) return; const x = Math.round(b.x), y = WATER - 1;
    R(g, x, y - 3, 22, 3, '#f4f4f4'); R(g, x + 2, y, 18, 1, '#f4f4f4'); R(g, x, y - 2, 22, 1, '#e8413a');
    R(g, x + 20, y - 5, 3, 3, '#f4f4f4'); R(g, x + 13, y - 6, 3, 3, '#7fd3ff'); R(g, x - 2, y - 4, 2, 4, '#2a2a2a');
    if (Math.abs(b.vx) > 1) for (let i = 0; i < 6; i++) { const wx = x - 3 - i * 3 - Math.random() * 2; R(g, wx, y - 1 - (i % 2), 2, 1, i % 2 ? '#ffffff' : '#9be7ff'); }
  }
  function drawRamp(g) {
    const r = K.ramp; if (!r || (K.st !== 'boatIn' && K.st !== 'skate' && K.st !== 'jump')) return;
    for (let i = 0; i < 18; i++) { R(g, r.x + i, WATER - 1 - Math.round(i * 16 / 18), 1, 2, i % 4 ? '#d9a35a' : '#8a5a2e'); }
    R(g, r.x + 17, WATER - 17, 1, 17, '#6a4628');
  }
  function drawKid(g) {
    if (K.st === 'wait' || K.st === 'gone') return;
    const x = Math.round(K.x), y = Math.round(K.y) - K.bob, d = K.dir;
    g.save(); g.translate(x, y); g.scale(d, 1);
    const skin = '#c98a5a', hood = '#2fbf6a', jeans = '#3a5aa8', cap = '#e8413a';
    if (K.st === 'chute') { // parachute canopy and lines
      for (let i = -8; i <= 8; i++) R(g, i, -26 + Math.round(Math.abs(i) * Math.abs(i) / 22), 1, 2, ['#ff6fa8', '#ffe27a', '#38b6ff'][(i + 9) % 3]);
      R(g, -6, -22, 1, 10, '#ddd'); R(g, 6, -22, 1, 10, '#ddd');
    }
    const step = (K.st === 'walk' || K.st === 'climb' || K.st === 'climbDown') ? Math.floor(K.walkF) % 2 : 0;
    // legs (baggy jeans) and sneakers
    R(g, -2, -3, 2, 3 - step, jeans); R(g, 1, -3, 2, 3 - (1 - step), jeans); R(g, -2, -1, 2, 1, '#ffffff'); R(g, 1, -1, 2, 1, '#ffffff');
    if (K.st === 'skate' || K.st === 'jump') { R(g, -4, 0, 9, 1, '#e8913a'); R(g, -3, 1, 1, 1, '#222'); R(g, 3, 1, 1, 1, '#222'); }
    // hoodie body, head, sunglasses, backwards cap
    R(g, -2, -8, 5, 5, hood); R(g, -2, -12, 4, 4, skin); R(g, -1, -11, 3, 1, '#111'); R(g, -3, -13, 5, 1, cap); R(g, -4, -12, 2, 1, cap);
    // boombox on the shoulder, pulsing
    const p = K.bob; R(g, 1 - p, -14 - p, 7 + p * 2, 4 + p, '#3a3a44'); R(g, 2 - p, -13 - p, 2 + p, 2 + p, '#9aa6c4'); R(g, 5, -13 - p, 2 + p, 2 + p, '#9aa6c4'); R(g, 4, -15 - p, 2, 1, '#888');
    R(g, 2, -10, 1, 3, skin); // arm up holding it
    if (p) { g.globalAlpha = 0.6; R(g, 10, -14, 1, 3, '#ffe27a'); R(g, 12, -15, 1, 5, '#ffe27a'); g.globalAlpha = 1; }
    if (K.st === 'leap' || K.st === 'chute') { R(g, -4, -11, 1, 3, skin); }
    g.restore();
  }

  window.cifHook = function (s) {
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!s || !s.lvl) return;
    try { think(s, dt); const g = s.ctx; drawRamp(g); drawBoat(g); drawKid(g); } catch (e) { /* never break the game */ }
  };
  window.cifBlaster = K;
})();
