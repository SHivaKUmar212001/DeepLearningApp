"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Matrix2D {
  a: number; // m00
  b: number; // m01
  c: number; // m10
  d: number; // m11
}

interface TransformVizProps {
  matrix: Matrix2D;
  className?: string;
}

export function TransformViz({ matrix, className }: TransformVizProps) {
  const width = 400;
  const height = 400;
  const range = 10;
  
  const scale = width / (range * 2);
  const cx = width / 2;
  const cy = height / 2;
  
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -range; i <= range; i++) {
      lines.push(i);
    }
    return lines;
  }, [range]);

  // Framer Motion custom SVG path animation is tricky for raw matrix values on a <g>, 
  // but we can animate the SVG transform directly if we use `animate={{ ... }}`.
  // Wait, framer motion doesn't natively interpolate `transform="matrix(...)"` string well,
  // but it does interpolate x, y, scale, skew, rotate.
  // Instead of full string interpolation, we can animate the endpoints of the lines!

  return (
    <div className={cn("w-full aspect-square bg-[#111128] rounded-xl border border-white/[0.08] overflow-hidden relative font-mono", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <marker id="arrow-i" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>
          <marker id="arrow-j" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Static Background Grid */}
        <g className="grid-bg opacity-30">
          {gridLines.map((val) => (
            <React.Fragment key={`bg-${val}`}>
              <line x1={cx + val * scale} y1={0} x2={cx + val * scale} y2={height} stroke={val === 0 ? "#6b7280" : "#374151"} strokeWidth={val === 0 ? 2 : 1} />
              <line x1={0} y1={cy - val * scale} x2={width} y2={cy - val * scale} stroke={val === 0 ? "#6b7280" : "#374151"} strokeWidth={val === 0 ? 2 : 1} />
            </React.Fragment>
          ))}
        </g>

        {/* Transformed Grid */}
        {/* We center the origin at cx, cy, and apply the matrix. Note: SVG Y is down, Math Y is up. */}
        {/* transform = "translate(cx, cy) scale(scale, -scale) matrix(a, c, b, d, 0, 0)" */}
        <motion.g 
          animate={{ 
            // In SVG: a, b, c, d, e, f maps to: matrix(a, b, c, d, tx, ty)
            // Our math matrix is [a b; c d]. 
            // Basis i = [a, c], Basis j = [b, d]
            // We need to apply this matrix to the math coordinate system.
          }}
          style={{
             transformOrigin: `${cx}px ${cy}px`,
             // Framer motion uses standard CSS transforms, which combine smoothly.
             // We'll write the raw SVG transform string and let React re-render.
             // Since state updates are continuous on a slider, React re-renders are fast enough!
             transform: `translate(${cx}px, ${cy}px) scale(${scale}, ${-scale}) matrix(${matrix.a}, ${matrix.c}, ${matrix.b}, ${matrix.d}, 0, 0)`
          }}
          className="transition-transform duration-75"
        >
          {/* Grid Lines */}
          {gridLines.map((val) => (
            <React.Fragment key={`fg-${val}`}>
              {/* Vertical lines (x = val, y ranges from -10 to 10) */}
              <line 
                x1={val} y1={-range} x2={val} y2={range} 
                stroke={val === 0 ? "#6b7280" : "#4b5563"} 
                strokeWidth={val === 0 ? 0.05 : 0.02} 
              />
              {/* Horizontal lines (y = val, x ranges from -10 to 10) */}
              <line 
                x1={-range} y1={val} x2={range} y2={val} 
                stroke={val === 0 ? "#6b7280" : "#4b5563"} 
                strokeWidth={val === 0 ? 0.05 : 0.02} 
              />
            </React.Fragment>
          ))}
          
        </motion.g>

        {/* Transformed Basis Vectors (Drawn on top, manually applying matrix so they don't get scaled stroke widths) */}
        {/* i-hat: [a, c] */}
        <motion.line
          x1={cx} y1={cy}
          animate={{ x2: cx + matrix.a * scale, y2: cy - matrix.c * scale }}
          stroke="#06b6d4" strokeWidth={4} markerEnd="url(#arrow-i)"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {/* j-hat: [b, d] */}
        <motion.line
          x1={cx} y1={cy}
          animate={{ x2: cx + matrix.b * scale, y2: cy - matrix.d * scale }}
          stroke="#f59e0b" strokeWidth={4} markerEnd="url(#arrow-j)"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </svg>
      
      {/* Readout */}
      <div className="absolute top-4 left-4 bg-[#0d0d20]/80 p-3 rounded border border-white/[0.1] text-sm backdrop-blur-sm shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
        <div className="flex flex-col gap-2 font-mono text-center text-lg bg-black px-4 py-2 rounded-lg border border-white/[0.08] text-white/15">
          <div className="flex gap-4"><span>{matrix.a.toFixed(2)}</span><span>{matrix.b.toFixed(2)}</span></div>
          <div className="flex gap-4"><span>{matrix.c.toFixed(2)}</span><span>{matrix.d.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
