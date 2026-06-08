"use client";

import { useEffect, useRef } from "react";

export function HolographicGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const animate = () => {
      time += 0.005;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const gridSize = 60;
      const perspective = 600;
      const tilt = 0.65;
      const scrollOffset = time * 30;

      // Horizontal lines (perspective grid floor)
      for (let z = 0; z < 20; z++) {
        const zPos = ((z * gridSize + scrollOffset) % (20 * gridSize));
        const scale = perspective / (perspective + zPos * tilt);
        const y = h * 0.65 + zPos * scale * 0.3;
        if (y > h) continue;

        const alpha = Math.max(0, 0.15 - zPos * 0.0008) * (0.7 + Math.sin(time * 2 + z * 0.5) * 0.3);
        ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
        ctx.lineWidth = scale * 0.8;
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - (w * 0.6) * scale, y);
        ctx.lineTo(w * 0.5 + (w * 0.6) * scale, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let i = -8; i <= 8; i++) {
        const alpha = 0.06 * (1 - Math.abs(i) / 10);
        const wave = Math.sin(time * 1.5 + i * 0.3) * 2;
        ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.5 + i * 40, h * 0.65);
        ctx.lineTo(w * 0.5 + i * 120 + wave, h);
        ctx.stroke();
      }

      // Horizon glow
      const horizonGrad = ctx.createLinearGradient(0, h * 0.6, 0, h * 0.72);
      horizonGrad.addColorStop(0, "rgba(13, 148, 136, 0)");
      horizonGrad.addColorStop(0.5, `rgba(13, 148, 136, ${0.06 + Math.sin(time * 3) * 0.03})`);
      horizonGrad.addColorStop(1, "rgba(13, 148, 136, 0)");
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, h * 0.6, w, h * 0.12);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
