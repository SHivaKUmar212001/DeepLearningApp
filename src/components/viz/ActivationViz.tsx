"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ActivationType = "relu" | "sigmoid" | "tanh" | "linear";

interface ActivationVizProps {
  type: ActivationType;
  zValue: number;
  className?: string;
}

export function ActivationViz({ type, zValue, className }: ActivationVizProps) {
  const width = 400;
  const height = 400;
  const xRange = 5; // z from -5 to 5
  const yRange = 2; // a from -2 to 2 (fits tanh, sigmoid is 0 to 1, relu gets clamped visually)
  
  const scaleX = width / (xRange * 2);
  const scaleY = height / (yRange * 2);
  const cx = width / 2;
  const cy = height / 2;
  
  const toSvgX = (x: number) => cx + x * scaleX;
  const toSvgY = (y: number) => cy - y * scaleY;

  // Activation functions
  const f = React.useCallback((z: number) => {
    switch (type) {
      case "relu": return Math.max(0, z);
      case "sigmoid": return 1 / (1 + Math.exp(-z));
      case "tanh": return Math.tanh(z);
      case "linear": return z;
      default: return z;
    }
  }, [type]);

  const aValue = f(zValue);

  // Generate curve path
  const curvePath = useMemo(() => {
    const points = [];
    for (let x = -xRange; x <= xRange; x += 0.1) {
      points.push(`${toSvgX(x)},${toSvgY(f(x))}`);
    }
    return `M ${points.join(" L ")}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, xRange, scaleX, scaleY, cx, cy, f, toSvgX, toSvgY]);

  // Grid lines
  const xGrid = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const yGrid = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];

  return (
    <div className={cn("w-full aspect-square bg-[#111128] rounded-xl border border-white/[0.08] overflow-hidden relative font-mono", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        
        {/* Grid */}
        <g className="grid-lines">
          {xGrid.map((x) => (
            <line key={`x-${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={height} stroke={x === 0 ? "#4b5563" : "#1f2937"} strokeWidth={x === 0 ? 2 : 1} />
          ))}
          {yGrid.map((y) => (
            <line key={`y-${y}`} x1={0} y1={toSvgY(y)} x2={width} y2={toSvgY(y)} stroke={y === 0 ? "#4b5563" : "#1f2937"} strokeWidth={y === 0 ? 2 : 1} />
          ))}
        </g>

        {/* Function Curve */}
        <path d={curvePath} fill="none" stroke="#06b6d4" strokeWidth={4} className="transition-all duration-300" />

        {/* Z Value Line (Vertical) */}
        <motion.line
          x1={toSvgX(zValue)} y1={height}
          animate={{ x1: toSvgX(zValue), x2: toSvgX(zValue), y2: toSvgY(aValue) }}
          stroke="#f59e0b" strokeWidth={2} strokeDasharray="4,4"
        />

        {/* A Value Line (Horizontal) */}
        <motion.line
          x1={toSvgX(zValue)} y1={toSvgY(aValue)}
          animate={{ y1: toSvgY(aValue), x2: 0, y2: toSvgY(aValue) }}
          stroke="#10b981" strokeWidth={2} strokeDasharray="4,4"
        />

        {/* Current Point */}
        <motion.circle
          cx={toSvgX(zValue)}
          animate={{ cx: toSvgX(zValue), cy: toSvgY(aValue) }}
          r={6}
          fill="#06b6d4"
          stroke="#ffffff"
          strokeWidth={2}
        />
      </svg>
      
      {/* Readout */}
      <div className="absolute top-4 right-4 bg-teal-600/10 p-3 rounded border border-white/[0.1] font-mono shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] backdrop-blur-md text-sm">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-white/40">Input (z)</span>
            <span className="text-amber-400 font-bold">{zValue.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40">Output (a)</span>
            <span className="text-emerald-400 font-bold">{aValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
