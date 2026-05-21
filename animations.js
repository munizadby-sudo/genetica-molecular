/* animations.js — all canvas/animation logic */

// ─── 1. HERO DNA PARTICLE FIELD ───────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('dna-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], t = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hue: [207, 160, 355, 45][Math.floor(Math.random() * 4)]
      });
    }
  }

  function drawHelixStrands() {
    const cols = Math.ceil(W / 140);
    for (let col = 0; col < cols; col++) {
      const cx = col * 140 + 70;
      ctx.save();
      for (let y = -20; y < H + 20; y += 6) {
        const phase = (y / H) * Math.PI * 4 + t * 0.4;
        const x1 = cx + Math.sin(phase) * 30;
        const x2 = cx + Math.sin(phase + Math.PI) * 30;
        const alpha = 0.4 + 0.3 * Math.abs(Math.sin(phase));

        // Strand 1
        ctx.beginPath();
        ctx.arc(x1, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(207, 80%, 65%, ${alpha})`;
        ctx.fill();

        // Strand 2
        ctx.beginPath();
        ctx.arc(x2, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(160, 70%, 60%, ${alpha})`;
        ctx.fill();

        // Cross bridges (every ~20px)
        if (y % 24 < 6) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `hsla(45, 80%, 65%, ${alpha * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, 0.5)`;
      ctx.fill();
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawHelixStrands();
    drawParticles();
    t += 0.015;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();

// ─── 2. DOUBLE HELIX SECTION ANIMATION ───────────────────────────────────────
(function () {
  const canvas = document.getElementById('helix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;
  const COLORS = { A: '#fc8181', T: '#63b3ed', G: '#68d391', C: '#f6e05e' };
  const PAIRS = [['A','T'],['G','C'],['T','A'],['C','G'],['A','T'],['G','C'],['T','A'],['C','G']];

  function drawHelix() {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const amp = 70;
    const step = H / 18;

    // Draw backbone lines first
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const y = (i / 200) * H;
      const phase = (y / H) * Math.PI * 4 + t;
      const x = cx + Math.sin(phase) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(99,179,237,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const y = (i / 200) * H;
      const phase = (y / H) * Math.PI * 4 + t + Math.PI;
      const x = cx + Math.sin(phase) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(104,211,145,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw rungs + bases
    PAIRS.forEach((pair, i) => {
      const y = (i / (PAIRS.length - 1)) * (H - 60) + 30;
      const phase = (y / H) * Math.PI * 4 + t;
      const x1 = cx + Math.sin(phase) * amp;
      const x2 = cx + Math.sin(phase + Math.PI) * amp;

      const zFactor = (Math.sin(phase) + 1) / 2;
      const alpha = 0.4 + 0.6 * zFactor;

      // Rung bridge
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = `rgba(200,200,200,${alpha * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Base 1
      const r = 9 + zFactor * 4;
      ctx.beginPath();
      ctx.arc(x1, y, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[pair[0]] + Math.floor(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.font = `bold ${Math.floor(9 + zFactor * 3)}px DM Mono, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pair[0], x1, y);

      // Base 2
      ctx.beginPath();
      ctx.arc(x2, y, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[pair[1]] + Math.floor(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText(pair[1], x2, y);
    });
  }

  function loop() {
    drawHelix();
    t += 0.018;
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── 3. GEL ELECTROPHORESIS ANIMATION ────────────────────────────────────────
(function () {
  const canvas = document.getElementById('gel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const lanes = [
    { label: 'Mãe', bands: [0.18, 0.42, 0.60, 0.75], color: '#fc8181' },
    { label: 'Filho', bands: [0.18, 0.35, 0.55, 0.70], color: '#f6e05e' },
    { label: 'Pai', bands: [0.28, 0.35, 0.48, 0.70], color: '#63b3ed' },
    { label: 'Ladder', bands: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90], color: 'rgba(200,200,200,0.5)' }
  ];

  let progress = 0; // 0 → 1

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = 'rgba(99,179,237,0.7)';
    ctx.font = '11px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('— ELETROFORESE EM GEL —', W / 2, 16);

    // Labels
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'center';
    lanes.forEach((lane, i) => {
      const lx = (i + 0.5) * (W / lanes.length);
      ctx.fillStyle = lane.color;
      ctx.fillText(lane.label, lx, 34);
    });

    // Gel area
    const gelTop = 44;
    const gelH = H - 60;

    ctx.fillStyle = 'rgba(30,40,70,0.5)';
    ctx.fillRect(10, gelTop, W - 20, gelH);

    // Lane separators
    ctx.strokeStyle = 'rgba(99,179,237,0.08)';
    ctx.lineWidth = 1;
    lanes.forEach((_, i) => {
      const lx = i * (W / lanes.length);
      ctx.beginPath();
      ctx.moveTo(lx + 10, gelTop);
      ctx.lineTo(lx + 10, gelTop + gelH);
      ctx.stroke();
    });

    // Bands
    lanes.forEach((lane, li) => {
      const lx = (li + 0.5) * (W / lanes.length);
      const laneW = (W / lanes.length) - 10;

      lane.bands.forEach(pos => {
        const targetY = gelTop + pos * gelH;
        const bandY = gelTop + (progress * pos) * gelH;

        if (bandY > gelTop + gelH) return;

        const bandH = 4;
        const grd = ctx.createLinearGradient(lx - laneW / 2, 0, lx + laneW / 2, 0);
        grd.addColorStop(0, 'transparent');
        grd.addColorStop(0.2, lane.color);
        grd.addColorStop(0.8, lane.color);
        grd.addColorStop(1, 'transparent');

        ctx.fillStyle = grd;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(lx - laneW / 2, bandY, laneW, bandH);

        // Glow
        ctx.shadowColor = lane.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(lx - laneW / 2, bandY, laneW, bandH);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
    });

    // Electric field arrow indicator
    ctx.fillStyle = 'rgba(99,179,237,0.5)';
    ctx.font = '9px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('(−)', 12, gelTop + 12);
    ctx.textAlign = 'right';
    ctx.fillText('(+)', W - 12, gelTop + gelH - 6);
  }

  function loop() {
    if (progress < 1) progress += 0.002;
    draw();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── 4. PCR AMPLIFICATION CURVE ──────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('pcr-curve');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let animProgress = 0;

  function sigmoid(x) {
    return 1 / (1 + Math.exp(-10 * (x - 0.55)));
  }

  function drawCurve(progress) {
    ctx.clearRect(0, 0, W, H);

    const pad = { left: 60, right: 20, top: 20, bottom: 40 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top - pad.bottom;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(99,179,237,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (i / 5) * gH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }

    // Threshold line
    const thresholdY = pad.top + 0.3 * gH;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(246, 224, 94, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, thresholdY);
    ctx.lineTo(W - pad.right, thresholdY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(246, 224, 94, 0.8)';
    ctx.font = '9px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Threshold (Ct)', pad.left + 4, thresholdY - 4);

    // Axes
    ctx.strokeStyle = 'rgba(99,179,237,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + gH);
    ctx.lineTo(W - pad.right, pad.top + gH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(136,153,170,0.8)';
    ctx.font = '9px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Ciclos de PCR', pad.left + gW / 2, H - 4);
    ctx.save();
    ctx.translate(14, pad.top + gH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Fluorescência', 0, 0);
    ctx.restore();

    // Cycle numbers on x axis
    [10, 20, 30, 40].forEach(n => {
      const x = pad.left + (n / 40) * gW;
      ctx.fillStyle = 'rgba(136,153,170,0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(n, x, pad.top + gH + 14);
    });

    // Curves (positive + negative)
    const curves = [
      { color: '#63b3ed', label: 'Positivo', offset: 0 },
      { color: '#68d391', label: 'Positivo (replicate)', offset: 0.02 },
      { color: '#fc8181', label: 'Negativo (controle)', flatAt: 0.08 }
    ];

    curves.forEach(c => {
      ctx.beginPath();
      let started = false;
      for (let xi = 0; xi <= gW * progress; xi++) {
        const t = xi / gW;
        let fl;
        if (c.flatAt !== undefined) {
          fl = c.flatAt + (Math.random() * 0.015 - 0.007);
        } else {
          fl = 0.02 + sigmoid(t + (c.offset || 0)) * 0.92 + Math.random() * 0.006;
        }
        fl = Math.max(0, Math.min(1, fl));
        const x = pad.left + xi;
        const y = pad.top + gH - fl * gH;
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Legend
      const li = curves.indexOf(c);
      const lx = pad.left + gW - 130;
      const ly = pad.top + 16 + li * 18;
      ctx.fillStyle = c.color;
      ctx.fillRect(lx, ly - 5, 16, 3);
      ctx.font = '9px DM Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(c.label, lx + 22, ly);
    });
  }

  // Animate on scroll into view
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animProgress = 0;
      const run = () => {
        if (animProgress < 1) {
          animProgress += 0.005;
          drawCurve(animProgress);
          requestAnimationFrame(run);
        }
      };
      run();
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);
  drawCurve(0);
})();

// ─── 5. SCROLL REVEAL ────────────────────────────────────────────────────────
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  const targets = document.querySelectorAll(
    '.strip-card, .diag-card, .glossary-item, .pcr-step, .tl-item, .flow-step'
  );
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });
})();
