/* "Salmon" startup intro — an homage to late-80s/early-90s PC game publisher intros:
 * VGA-style 320×200 picture with ordered dithering, static, a pixel dissolve, a leaping salmon,
 * a twinkling star that sweeps across the name, and a synthesized chime. Original artwork.
 */
'use strict';
(function () {
  const W = 320, H = 200;
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  // Quantize to a small palette with a 4×4 Bayer matrix, for that VGA/EGA look.
  function dither(ctx, levels = 5) {
    const img = ctx.getImageData(0, 0, W, H), d = img.data, step = 255 / (levels - 1);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, t = (BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.5) * step;
      for (let c = 0; c < 3; c++) d[i + c] = Math.max(0, Math.min(255, Math.round((d[i + c] + t) / step) * step));
    }
    ctx.putImageData(img, 0, 0);
  }

  function drawSalmon(g, x, y, ang, s) {
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(-s, s);   // drawn facing left, mirrored to face right
    // tail
    g.fillStyle = '#c4466a';
    g.beginPath(); g.moveTo(22, 0); g.lineTo(36, -11); g.quadraticCurveTo(31, 0, 36, 11); g.closePath(); g.fill();
    // body
    const grd = g.createLinearGradient(0, -10, 0, 10);
    grd.addColorStop(0, '#b84a72'); grd.addColorStop(0.45, '#ff8a70'); grd.addColorStop(1, '#ffe0c8');
    g.fillStyle = grd;
    g.beginPath(); g.moveTo(-26, 0);
    g.bezierCurveTo(-18, -12, 8, -12, 24, -2); g.lineTo(24, 2); g.bezierCurveTo(8, 12, -18, 11, -26, 0); g.fill();
    // fins + spots + gill + eye
    g.fillStyle = '#c4466a';
    g.beginPath(); g.moveTo(-2, -9); g.lineTo(6, -15); g.lineTo(10, -8); g.fill();
    g.beginPath(); g.moveTo(-4, 7); g.lineTo(2, 12); g.lineTo(5, 7); g.fill();
    g.fillStyle = '#5a1f3a';
    [[4, -5], [10, -4], [15, -3], [0, -4]].forEach(([a, b]) => g.fillRect(a, b, 1.6, 1.6));
    g.strokeStyle = '#7a2e4c'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-14, -6); g.quadraticCurveTo(-11, 0, -14, 6); g.stroke();
    g.fillStyle = '#111'; g.beginPath(); g.arc(-19, -2, 1.8, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.fillRect(-19.5, -3.2, 0.9, 0.9);
    g.restore();
  }

  function drawScene(g) {
    // night sky
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#000010'); sky.addColorStop(0.55, '#141050'); sky.addColorStop(1, '#000000');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // mountains (two ranges)
    const ridge = (pts, top, bottom) => {
      const gr = g.createLinearGradient(0, 40, 0, 128); gr.addColorStop(0, top); gr.addColorStop(1, bottom);
      g.fillStyle = gr; g.beginPath(); g.moveTo(40, 128); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(280, 128); g.closePath(); g.fill();
    };
    ridge([[70, 98], [104, 66], [126, 86], [160, 44], [196, 82], [222, 64], [252, 96]], '#6a6ad8', '#1a1a60');
    ridge([[60, 112], [96, 90], [134, 108], [176, 78], [214, 104], [246, 92], [268, 116]], '#3a7ab0', '#0c2c48');
    // snow caps
    g.fillStyle = '#e8ecff';
    [[160, 44, 12], [104, 66, 8], [222, 64, 8]].forEach(([x, y, w]) => {
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - w, y + w * 1.15); g.lineTo(x - w * 0.3, y + w * 0.8); g.lineTo(x + w * 0.2, y + w * 1.1); g.lineTo(x + w, y + w * 1.1); g.closePath(); g.fill();
    });
    // river
    const riv = g.createLinearGradient(0, 120, 0, 136); riv.addColorStop(0, '#2aa8e8'); riv.addColorStop(1, '#0a3070');
    g.fillStyle = riv; g.fillRect(40, 124, 240, 10);
    g.fillStyle = '#bfe8ff';
    for (let x = 44; x < 276; x += 14) g.fillRect(x + ((x / 14) % 2) * 5, 126, 6, 1);
    // frame lines (like the old publisher plaques)
    g.fillStyle = '#c9a04a'; g.fillRect(40, 136, 240, 1); g.fillRect(40, 189, 240, 1);
  }

  function drawText(g) {
    const word = 'SALMON';
    g.font = 'bold 36px Georgia, "Times New Roman", serif';
    g.textBaseline = 'alphabetic';
    const spacing = 6;
    let total = 0; for (const ch of word) total += g.measureText(ch).width + spacing; total -= spacing;
    let x = (W - total) / 2; const y = 167;
    const grd = g.createLinearGradient(0, 140, 0, 169);
    grd.addColorStop(0, '#fffbe8'); grd.addColorStop(0.5, '#ffd36a'); grd.addColorStop(1, '#d0782a');
    for (const ch of word) {
      g.fillStyle = '#5a1020'; g.fillText(ch, x + 1.5, y + 1.5);
      g.fillStyle = grd; g.fillText(ch, x, y);
      x += g.measureText(ch).width + spacing;
    }
    g.font = 'italic 9px Georgia, serif'; g.fillStyle = '#c9b8ff'; g.textAlign = 'center';
    g.fillText('p r e s e n t s', W / 2, 183);
    g.textAlign = 'left';
    return { x0: (W - total) / 2, x1: (W + total) / 2 };
  }

  function star(g, x, y, r, a = 1) {
    g.save(); g.globalAlpha = a; g.fillStyle = '#ffffff';
    g.fillRect(x - r, y, r * 2 + 1, 1); g.fillRect(x, y - r, 1, r * 2 + 1);
    const d = Math.max(1, Math.floor(r / 2.5));
    g.globalAlpha = a * 0.7; g.fillRect(x - d, y - d, 1, 1); g.fillRect(x + d, y - d, 1, 1); g.fillRect(x - d, y + d, 1, 1); g.fillRect(x + d, y + d, 1, 1);
    g.globalAlpha = a; g.fillRect(x - 1, y - 1, 3, 3);
    g.restore();
  }

  /* ---------------- sound ---------------- */
  function makeSound() {
    let ac;
    try { ac = new AudioContext(); } catch { return { stop() {} }; }
    const out = ac.createGain(); out.gain.value = 0.55; out.connect(ac.destination);
    const t0 = ac.currentTime + 0.05;
    const noise = (dur) => { const b = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = ac.createBufferSource(); s.buffer = b; return s; };
    // static burst
    { const s = noise(0.8), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 0.6;
      g.gain.setValueAtTime(0.35, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.75); s.connect(f).connect(g).connect(out); s.start(t0); }
    // whoosh as the salmon leaps
    { const s = noise(1.3), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.Q.value = 2.2;
      f.frequency.setValueAtTime(300, t0 + 1.3); f.frequency.exponentialRampToValueAtTime(2600, t0 + 2.2);
      g.gain.setValueAtTime(0.0001, t0 + 1.3); g.gain.exponentialRampToValueAtTime(0.4, t0 + 1.75); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);
      s.connect(f).connect(g).connect(out); s.start(t0 + 1.3); }
    // sparkle pings while the star sweeps
    const penta = [1568, 1760, 2093, 2349, 2637, 3136, 3520];
    for (let i = 0; i < 16; i++) {
      const t = t0 + 2.3 + i * 0.075 + Math.random() * 0.02, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = penta[(i * 3 + (i % 2)) % penta.length];
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(out); o.start(t); o.stop(t + 0.4);
    }
    // closing chord
    [262, 330, 392, 523, 784].forEach((f, i) => {
      const t = t0 + 3.5 + i * 0.06, o = ac.createOscillator(), g = ac.createGain();
      o.type = i < 3 ? 'triangle' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      o.connect(g).connect(out); o.start(t); o.stop(t + 2.1);
    });
    return { stop() { try { out.gain.setTargetAtTime(0, ac.currentTime, 0.08); setTimeout(() => ac.close(), 400); } catch {} } };
  }

  /* ---------------- player ---------------- */
  window.playIntro = function playIntro(root) {
    return new Promise((resolve) => {
      const cv = root.querySelector('canvas'); cv.width = W; cv.height = H;
      const g = cv.getContext('2d');
      const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
      const sceneC = mk(), sg = sceneC.getContext('2d'); drawScene(sg); dither(sg, 5);
      const textC = mk(), tg = textC.getContext('2d'); const span = drawText(tg); dither(tg, 6);
      const sceneD = sg.getImageData(0, 0, W, H).data;
      const rank = new Float32Array(W * H); for (let i = 0; i < rank.length; i++) rank[i] = Math.random();
      const frame = g.createImageData(W, H), fd = frame.data;
      const sound = makeSound();
      const twinkles = Array.from({ length: 14 }, () => ({ x: span.x0 + Math.random() * (span.x1 - span.x0), y: 142 + Math.random() * 24, p: Math.random() * 6, s: 2 + Math.random() * 3 }));
      const salmonEnd = { x: 214, y: 54 };
      let start = performance.now(), done = false;
      const finish = () => {
        if (done) return; done = true; sound.stop();
        root.classList.add('out'); setTimeout(() => { root.hidden = true; resolve(); }, 450);
        removeEventListener('keydown', finish); root.removeEventListener('click', finish);
      };
      addEventListener('keydown', finish); root.addEventListener('click', finish);
      root.hidden = false; root.classList.remove('out');

      function tick(now) {
        if (done) return;
        const t = (now - start) / 1000;
        // 1) scene: dissolve in 0.3–1.6 s, dissolve out 4.9–5.6 s
        const inT = Math.min(1, Math.max(0, (t - 0.3) / 1.3)), outT = Math.min(1, Math.max(0, (t - 4.9) / 0.7));
        const staticA = Math.max(0, 1 - t / 0.75);
        for (let i = 0, p = 0; i < rank.length; i++, p += 4) {
          const on = rank[i] < inT && rank[i] >= outT;
          if (on) { fd[p] = sceneD[p]; fd[p + 1] = sceneD[p + 1]; fd[p + 2] = sceneD[p + 2]; }
          else if (Math.random() < staticA * 0.55) { const v = Math.random() * 200 * staticA; fd[p] = fd[p + 1] = fd[p + 2] = v; }
          else { fd[p] = fd[p + 1] = fd[p + 2] = 0; }
          fd[p + 3] = 255;
        }
        g.putImageData(frame, 0, 0);
        if (outT >= 1) { if (t > 5.7) finish(); else requestAnimationFrame(tick); return; }
        const fadeOut = 1 - outT;

        // 2) salmon leap 1.3–2.3 s along an arc, then hold
        const k = Math.min(1, Math.max(0, (t - 1.3) / 1.0));
        if (t > 1.3) {
          const e = 1 - Math.pow(1 - k, 2);
          const sx = 70 + (salmonEnd.x - 70) * e, sy = 132 - Math.sin(e * Math.PI * 0.62) * 100 + (salmonEnd.y - 132 + 100 * Math.sin(Math.PI * 0.62)) * e;
          const ang = k < 1 ? -0.9 + e * 0.75 : -0.15 + Math.sin(t * 2.2) * 0.04;
          g.globalAlpha = fadeOut; drawSalmon(g, sx, sy, ang, 1.15); g.globalAlpha = 1;
          if (k < 1) for (let j = 0; j < 4; j++) star(g, Math.round(sx - 30 - Math.random() * 12), Math.round(sy + 6 + Math.random() * 10), 1 + Math.random() * 2, 0.8);
          if (k < 0.25) { g.fillStyle = 'rgba(190,232,255,.9)'; for (let j = 0; j < 10; j++) g.fillRect(64 + Math.random() * 16, 120 - Math.random() * 14 * (1 - k * 4), 1, 1); }
        }

        // 3) the name, revealed by a sweeping star 2.3–3.5 s
        const sweep = Math.min(1, Math.max(0, (t - 2.3) / 1.2));
        if (sweep > 0) {
          const sxp = span.x0 - 6 + (span.x1 - span.x0 + 12) * sweep;
          g.save(); g.globalAlpha = fadeOut; g.beginPath(); g.rect(0, 136, sweep >= 1 ? W : sxp, 64); g.clip(); g.drawImage(textC, 0, 0); g.restore();
          if (sweep < 1) { star(g, Math.round(sxp), 154, 9, 1); star(g, Math.round(sxp - 10), 150 + Math.round(Math.random() * 16), 3, 0.7); }
        }
        // 4) twinkles on the finished logo
        if (t > 3.4) {
          for (const tw of twinkles) {
            const a = Math.max(0, Math.sin(t * 5 + tw.p * 3)) ** 6 * fadeOut;
            if (a > 0.05) star(g, Math.round(tw.x), Math.round(tw.y), tw.s, a);
          }
          const sa = Math.max(0, Math.sin(t * 3.1)) ** 8 * fadeOut;
          if (sa > 0.05) star(g, salmonEnd.x + 22, salmonEnd.y - 6, 4, sa);
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  };
})();
