"use client";

import { useEffect, useRef } from "react";

// Fig. 1: a grid of dots. Each dot leans toward the cursor; a click sends a ripple through the grid.
export default function DotField() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = box.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, mx = -999, my = -999;
    let pts: { x: number; y: number; ox: number; oy: number }[] = [];
    let pulses: { x: number; y: number; t: number }[] = [];
    const css = () => getComputedStyle(document.documentElement);

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = field.clientWidth; H = field.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      const gap = 22;
      for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) pts.push({ x, y, ox: x, oy: y });
    }

    function draw() {
      const s = css();
      const base = s.getPropertyValue("--dot").trim() || "#c9c9d1";
      const accent = s.getPropertyValue("--accent").trim() || "#3451d1";
      ctx.clearRect(0, 0, W, H);
      const now = performance.now();
      pulses = pulses.filter((p) => now - p.t < 900);
      for (const p of pts) {
        const dx = mx - p.ox, dy = my - p.oy, d = Math.hypot(dx, dy);
        const pull = d < 120 ? 1 - d / 120 : 0;
        let hot = pull;
        for (const q of pulses) {
          const age = (now - q.t) / 900;
          const r = age * 280, dd = Math.hypot(p.ox - q.x, p.oy - q.y);
          hot = Math.max(hot, Math.max(0, 1 - Math.abs(dd - r) / 26) * (1 - age));
        }
        p.x += (p.ox + dx * pull * 0.28 - p.x) * 0.2;
        p.y += (p.oy + dy * pull * 0.28 - p.y) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3 + hot * 2.2, 0, Math.PI * 2);
        ctx.globalAlpha = hot > 0.05 ? 0.35 + hot * 0.65 : 1;
        ctx.fillStyle = hot > 0.05 ? accent : base;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    const pos = (e: PointerEvent) => { const r = field.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const onMove = (e: PointerEvent) => { [mx, my] = pos(e); if (reduce) draw(); };
    const onLeave = () => { mx = my = -999; if (reduce) draw(); };
    const onDown = (e: PointerEvent) => { const [x, y] = pos(e); pulses.push({ x, y, t: performance.now() }); };
    const onResize = () => { size(); if (reduce) draw(); };
    // Redraw when the theme changes so dot colours follow it.
    const mo = new MutationObserver(() => reduce && draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerleave", onLeave);
    field.addEventListener("pointerdown", onDown);
    addEventListener("resize", onResize);
    size();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
      field.removeEventListener("pointerdown", onDown);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={box} className="field" role="img" aria-label="Grid of dots that lean toward your cursor">
      <canvas ref={canvas} />
    </div>
  );
}
