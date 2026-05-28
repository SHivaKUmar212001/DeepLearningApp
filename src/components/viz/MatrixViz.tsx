"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MatrixVizProps {
  data: number[][];
  label?: string;
  className?: string;
  color?: string;
  colorScale?: (val: number) => string;
}

export function MatrixViz({ data, label, className, color, colorScale }: MatrixVizProps) {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  const defaultColorScale = (val: number) => {
    const normalized = Math.max(-1, Math.min(1, val));
    const intensity = Math.abs(normalized);
    
    if (color) {
      // Maps common color names to RGB values
      const colorMap: Record<string, string> = {
        indigo: "99, 102, 241",
        cyan: "6, 182, 212",
        amber: "245, 158, 11",
        emerald: "16, 185, 129",
        rose: "244, 63, 94",
        blue: "59, 130, 246",
      };
      const rgb = colorMap[color] || colorMap.indigo;
      return `rgba(${rgb}, ${intensity * 0.8 + 0.2})`;
    }

    // Diverging scale if no base color is provided: Amber (-) to Indigo (+)
    if (normalized < 0) {
      return `rgba(245, 158, 11, ${intensity * 0.8 + 0.2})`; // Amber
    } else {
      return `rgba(99, 102, 241, ${intensity * 0.8 + 0.2})`; // Indigo
    }
  };

  const scale = colorScale || defaultColorScale;
  const cols = data[0]?.length || 1;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label && <div className="text-sm font-medium text-rose-600 mb-1">{label}</div>}
      
      <div className="relative flex rounded-lg border border-rose-200 bg-white p-1.5 shadow-lg sm:p-3">
        {/* Left bracket */}
        <div className="mr-1 w-1.5 rounded-l border-b-2 border-l-2 border-t-2 border-rose-800/70 sm:mr-2 sm:w-2" />
        
        <motion.div 
          layout
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <AnimatePresence mode="popLayout">
            {data.map((row, i) => (
              row.map((val, j) => {
                const isHovered = hoveredCell?.[0] === i && hoveredCell?.[1] === j;
                
                return (
                  <motion.div
                    key={`${i}-${j}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isHovered ? 1.15 : 1,
                      zIndex: isHovered ? 10 : 1,
                      backgroundColor: scale(val)
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      backgroundColor: { duration: 0.4 } 
                    }}
                    onMouseEnter={() => setHoveredCell([i, j])}
                    className="relative flex size-9 cursor-default items-center justify-center rounded border border-white/20 sm:size-12"
                  >
                    <motion.span 
                      layout="position"
                      className="font-mono text-[10px] font-semibold text-rose-950 drop-shadow-sm sm:text-sm"
                    >
                      {val.toFixed(2)}
                    </motion.span>
                    
                    {/* Hover tooltip for exact value */}
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-950 shadow-sm"
                      >
                        {val}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Right bracket */}
        <div className="ml-1 w-1.5 rounded-r border-b-2 border-r-2 border-t-2 border-rose-800/70 sm:ml-2 sm:w-2" />
      </div>
    </div>
  );
}
