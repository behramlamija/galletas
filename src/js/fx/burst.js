// "Eksplozija slatkog": sprinkles, sugar pearls, mini cookies and hearts bursting
// out of a point. One shared full-screen canvas; several bursts can run at once.
import { prefersReducedMotion } from '../utils/app.js';

const COLORS = ['#C23B5A', '#93A866', '#C8A35A', '#F4B6C2', '#B57A45', '#7FB2E5', '#F6DCDD', '#E2C79F'];
const KINDS = ['sprinkle', 'sprinkle', 'sprinkle', 'pearl', 'pearl', 'cookie', 'heart'];

let canvas;
let ctx;
let particles = [];
let running = false;

function setup() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'burst-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);
    ctx = canvas.getContext('2d');
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  if (p.kind === 'sprinkle') {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-p.size * 1.6, -p.size / 2, p.size * 3.2, p.size, p.size / 2);
    else ctx.rect(-p.size * 1.6, -p.size / 2, p.size * 3.2, p.size);
    ctx.fill();
  } else if (p.kind === 'pearl') {
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath();
    ctx.arc(-p.size * 0.25, -p.size * 0.25, p.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === 'cookie') {
    const r = p.size * 1.9;
    ctx.fillStyle = '#E2C79F';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3E2519';
    for (const [cx, cy] of [[-0.4, -0.3], [0.35, 0.1], [-0.1, 0.45], [0.2, -0.45]]) {
      ctx.beginPath();
      ctx.arc(cx * r, cy * r, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    const s = p.size * 0.9;
    ctx.beginPath();
    ctx.moveTo(0, s * 1.2);
    ctx.bezierCurveTo(-s * 2.2, -s * 0.2, -s * 0.9, -s * 2, 0, -s * 0.7);
    ctx.bezierCurveTo(s * 0.9, -s * 2, s * 2.2, -s * 0.2, 0, s * 1.2);
    ctx.fill();
  }
  ctx.restore();
}

function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter((p) => p.alpha > 0.02 && p.y < innerHeight + 40);
  for (const p of particles) {
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    if (p.life > p.fadeAfter) p.alpha -= 0.025;
    draw(p);
  }
  if (particles.length) requestAnimationFrame(loop);
  else {
    running = false;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

// x, y in viewport pixels. power ≈ initial speed; spread in radians (2π = all around).
export function burst(x, y, { count = 60, power = 12, spread = Math.PI * 2, angle = -Math.PI / 2, gravity = 0.32, kinds = KINDS } = {}) {
  if (prefersReducedMotion()) return;
  setup();
  for (let i = 0; i < count; i++) {
    const a = angle + (Math.random() - 0.5) * spread;
    const speed = power * (0.35 + Math.random() * 0.75);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      size: 2.6 + Math.random() * 2.2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      kind: kinds[(Math.random() * kinds.length) | 0],
      drag: 0.965 + Math.random() * 0.02,
      gravity,
      alpha: 1,
      life: 0,
      fadeAfter: 40 + Math.random() * 40,
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}

// Bursts from the centre of an element.
export function burstFrom(el, opts) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, opts);
}
