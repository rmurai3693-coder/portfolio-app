/* ===================================================
   Hero Background — EC Data Flow Canvas Animation
   Particles + connecting lines evoking data networks
   =================================================== */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let particles = [];
  let animationId;

  const CONFIG = {
    particleCount: 60,
    connectionDistance: 140,
    speed: 0.35,
    particleMinSize: 1.5,
    particleMaxSize: 4,
    lineOpacity: 0.08,
    particleOpacity: 0.18,
    accentParticleRatio: 0.15,
    accentColor: { r: 10, g: 102, b: 194 },   // #0a66c2
    baseColor: { r: 17, g: 17, b: 17 },        // #111111
  };

  // Data-themed icons (simple shapes drawn on canvas)
  const ICON_TYPES = ['circle', 'square', 'diamond', 'bar'];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize);
      this.speedX = (Math.random() - 0.5) * CONFIG.speed * 2;
      this.speedY = (Math.random() - 0.5) * CONFIG.speed * 2;
      this.isAccent = Math.random() < CONFIG.accentParticleRatio;
      this.icon = ICON_TYPES[Math.floor(Math.random() * ICON_TYPES.length)];
      this.opacity = 0.08 + Math.random() * (CONFIG.particleOpacity - 0.08);
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.005 + Math.random() * 0.01;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;

      // Wrap around edges
      if (this.x < -20) this.x = w + 20;
      if (this.x > w + 20) this.x = -20;
      if (this.y < -20) this.y = h + 20;
      if (this.y > h + 20) this.y = -20;
    }

    draw() {
      const pulse = 0.7 + 0.3 * Math.sin(this.pulsePhase);
      const color = this.isAccent ? CONFIG.accentColor : CONFIG.baseColor;
      const alpha = this.opacity * pulse;
      const size = this.size * (0.8 + 0.2 * pulse);

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = alpha;

      switch (this.icon) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fill();
          break;

        case 'square':
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(-size, -size, size * 2, size * 2);
          break;

        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.2);
          ctx.lineTo(size * 1.2, 0);
          ctx.lineTo(0, size * 1.2);
          ctx.lineTo(-size * 1.2, 0);
          ctx.closePath();
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fill();
          break;

        case 'bar':
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(-size * 0.4, -size * 1.5, size * 0.8, size * 3);
          break;
      }

      ctx.restore();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const opacity = CONFIG.lineOpacity * (1 - dist / CONFIG.connectionDistance);
          const isAccentLine = particles[i].isAccent || particles[j].isAccent;
          const color = isAccentLine ? CONFIG.accentColor : CONFIG.baseColor;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Floating data labels (subtle)
  const DATA_LABELS = ['AI', 'EC', 'DX', 'UX', 'ROI', 'CRM', 'API', 'KPI'];
  let floatingLabels = [];

  class FloatingLabel {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.text = DATA_LABELS[Math.floor(Math.random() * DATA_LABELS.length)];
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.opacity = 0.03 + Math.random() * 0.04;
      this.fontSize = 10 + Math.random() * 14;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < -50) this.x = w + 50;
      if (this.x > w + 50) this.x = -50;
      if (this.y < -30) this.y = h + 30;
      if (this.y > h + 30) this.y = -30;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.font = `700 ${this.fontSize}px Manrope, sans-serif`;
      ctx.fillStyle = `rgb(${CONFIG.baseColor.r}, ${CONFIG.baseColor.g}, ${CONFIG.baseColor.b})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  function init() {
    resize();
    particles = [];
    floatingLabels = [];

    const count = Math.min(CONFIG.particleCount, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const labelCount = Math.min(8, Math.floor(count / 6));
    for (let i = 0; i < labelCount; i++) {
      floatingLabels.push(new FloatingLabel());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Draw floating labels (behind particles)
    floatingLabels.forEach((label) => {
      label.update();
      label.draw();
    });

    // Draw connections
    drawConnections();

    // Draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Reduced motion support
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    init();
    // Draw one frame only
    ctx.clearRect(0, 0, w, h);
    floatingLabels.forEach((l) => l.draw());
    drawConnections();
    particles.forEach((p) => p.draw());
    return;
  }

  // Pause when not visible
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!animationId) animate();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    { threshold: 0 }
  );

  init();
  heroObserver.observe(canvas.parentElement);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      animationId = null;
      init();
      animate();
    }, 200);
  });
})();
