"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Vector2D {
  x: number;
  y: number;
}

interface VectorVizProps {
  v1: Vector2D;
  v2?: Vector2D;
  showAddition?: boolean;
  showProjection?: boolean;
  className?: string;
}

export function VectorViz({ 
  v1, 
  v2, 
  showAddition = false, 
  showProjection = false, 
  className 
}: VectorVizProps) {
  const width = 400;
  const height = 400;
  const range = 10; // Coordinate system goes from -10 to 10
  
  // Transform logical coordinates to SVG pixel coordinates
  const scale = width / (range * 2);
  const cx = width / 2;
  const cy = height / 2;
  
  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale; // Invert Y for standard math coordinates

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -range; i <= range; i++) {
      lines.push({ val: i, isAxis: i === 0 });
    }
    return lines;
  }, [range]);

  // Calculations
  const vAdd = v2 ? { x: v1.x + v2.x, y: v1.y + v2.y } : null;
  
  // Projection of v1 onto v2: proj_v2(v1) = ((v1 • v2) / ||v2||^2) * v2
  let proj = null;
  if (showProjection && v2 && (v2.x !== 0 || v2.y !== 0)) {
    const dot = v1.x * v2.x + v1.y * v2.y;
    const magSq = v2.x * v2.x + v2.y * v2.y;
    const scalar = dot / magSq;
    proj = { x: v2.x * scalar, y: v2.y * scalar };
  }

  // Arrow marker definitions
  const defs = (
    <defs>
      <marker id="arrow-v1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
      </marker>
      <marker id="arrow-v2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
      </marker>
      <marker id="arrow-add" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
      </marker>
      <marker id="arrow-proj" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
      </marker>
    </defs>
  );

  return (
    <div className={cn("w-full aspect-square bg-rose-50 rounded-xl border border-rose-200 overflow-hidden relative font-mono", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {defs}
        
        {/* Grid */}
        <g className="grid-lines">
          {gridLines.map(({ val, isAxis }) => (
            <React.Fragment key={val}>
              <line 
                x1={toSvgX(val)} y1={0} x2={toSvgX(val)} y2={height} 
                stroke={isAxis ? "#4b5563" : "#1f2937"} 
                strokeWidth={isAxis ? 2 : 1} 
              />
              <line 
                x1={0} y1={toSvgY(val)} x2={width} y2={toSvgY(val)} 
                stroke={isAxis ? "#4b5563" : "#1f2937"} 
                strokeWidth={isAxis ? 2 : 1} 
              />
            </React.Fragment>
          ))}
        </g>

        {/* Projection Line (perpendicular) */}
        {proj && (
          <motion.line
            x1={toSvgX(v1.x)}
            y1={toSvgY(v1.y)}
            x2={toSvgX(proj.x)}
            y2={toSvgY(proj.y)}
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="4,4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          />
        )}

        {/* Projection Vector */}
        {proj && (
          <motion.line
            x1={cx} y1={cy}
            animate={{ x2: toSvgX(proj.x), y2: toSvgY(proj.y) }}
            stroke="#ef4444"
            strokeWidth={4}
            markerEnd="url(#arrow-proj)"
            transition={{ type: "spring", stiffness: 100 }}
          />
        )}

        {/* Addition Parallelogram */}
        {showAddition && v2 && vAdd && (
          <g className="parallelogram opacity-40">
            <motion.line
              x1={toSvgX(v1.x)} y1={toSvgY(v1.y)}
              animate={{ x2: toSvgX(vAdd.x), y2: toSvgY(vAdd.y) }}
              stroke="#f59e0b" strokeWidth={2} strokeDasharray="4,4"
            />
            <motion.line
              x1={toSvgX(v2.x)} y1={toSvgY(v2.y)}
              animate={{ x2: toSvgX(vAdd.x), y2: toSvgY(vAdd.y) }}
              stroke="#06b6d4" strokeWidth={2} strokeDasharray="4,4"
            />
          </g>
        )}

        {/* Vector 1 (Cyan) */}
        <motion.line
          x1={cx} y1={cy}
          animate={{ x2: toSvgX(v1.x), y2: toSvgY(v1.y) }}
          stroke="#06b6d4"
          strokeWidth={3}
          markerEnd="url(#arrow-v1)"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        
        {/* Vector 2 (Amber) */}
        {v2 && (
          <motion.line
            x1={cx} y1={cy}
            animate={{ x2: toSvgX(v2.x), y2: toSvgY(v2.y) }}
            stroke="#f59e0b"
            strokeWidth={3}
            markerEnd="url(#arrow-v2)"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        )}

        {/* Resultant Vector (Addition) */}
        {showAddition && vAdd && (
          <motion.line
            x1={cx} y1={cy}
            animate={{ x2: toSvgX(vAdd.x), y2: toSvgY(vAdd.y) }}
            stroke="#10b981"
            strokeWidth={4}
            markerEnd="url(#arrow-add)"
            transition={{ type: "spring", stiffness: 150 }}
          />
        )}
      </svg>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-rose-100/80 p-3 rounded border border-rose-300 text-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
          <span className="text-rose-800">v₁ = [{v1.x.toFixed(1)}, {v1.y.toFixed(1)}]</span>
        </div>
        {v2 && (
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="text-rose-800">v₂ = [{v2.x.toFixed(1)}, {v2.y.toFixed(1)}]</span>
          </div>
        )}
        {showAddition && vAdd && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-rose-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-rose-800">v₁ + v₂ = [{vAdd.x.toFixed(1)}, {vAdd.y.toFixed(1)}]</span>
          </div>
        )}
        {showProjection && v2 && proj && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-rose-300">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="text-rose-800">proj(v₁) = [{proj.x.toFixed(1)}, {proj.y.toFixed(1)}]</span>
          </div>
        )}
      </div>
    </div>
  );
}
