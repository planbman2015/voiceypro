import { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  hue: number;
}

export default function BackgroundCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 5 large orbs
    const hues = [200, 210, 195, 215, 205];
    const orbs: Orb[] = hues.map((hue) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: 220 + Math.random() * 180,
      hue,
    }));

    // Rings (sound waves)
    const rings: Ring[] = [];
    const spawnRing = () => {
      const margin = 150;
      rings.push({
        x: margin + Math.random() * (canvas.width - margin * 2),
        y: margin + Math.random() * (canvas.height - margin * 2),
        r: 10,
        maxR: 250 + Math.random() * 200,
        alpha: 1,
        hue: 195 + Math.random() * 20,
      });
    };
    for (let i = 0; i < 5; i++) spawnRing();
    const interval = setInterval(spawnRing, 1600);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Orbs
      for (const o of orbs) {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0,   `hsla(${o.hue}, 95%, 60%, 0.18)`);
        g.addColorStop(0.5, `hsla(${o.hue}, 90%, 50%, 0.07)`);
        g.addColorStop(1,   `hsla(${o.hue}, 90%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r)             { o.x = canvas.width + o.r; }
        if (o.x > canvas.width + o.r) { o.x = -o.r; }
        if (o.y < -o.r)              { o.y = canvas.height + o.r; }
        if (o.y > canvas.height + o.r){ o.y = -o.r; }
      }

      // Rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const rng = rings[i];
        const fade = 1 - rng.r / rng.maxR;

        // 3 concentric rings per wave
        for (let k = 0; k < 3; k++) {
          const rr = rng.r - k * 28;
          if (rr <= 0) continue;
          ctx.beginPath();
          ctx.arc(rng.x, rng.y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${rng.hue}, 95%, 70%, ${fade * (0.25 - k * 0.07)})`;
          ctx.lineWidth = 2 - k * 0.5;
          ctx.stroke();
        }

        rng.r += 1.8;
        if (rng.r >= rng.maxR) rings.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
