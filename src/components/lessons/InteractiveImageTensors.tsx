"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveImageTensors() {
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number, y: number, color: [number, number, number] } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate an 8x8 "image" (a colorful pattern)
  const size = 8;
  const image: [number, number, number][][] = [];

  for (let y = 0; y < size; y++) {
    const row: [number, number, number][] = [];
    for (let x = 0; x < size; x++) {
      // Create a gradient/pattern
      const r = Math.floor((x / size) * 255);
      const g = Math.floor((y / size) * 255);
      const b = Math.floor(255 - ((x + y) / (size * 2)) * 255);
      row.push([r, g, b]);
    }
    image.push(row);
  }

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Images as Tensors</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls and Readout */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-cyan-400 mb-4">View Mode</h3>
            <div className="flex gap-4">
              <button
                className={`flex-1 py-2 rounded font-medium text-sm transition-colors ${!isExpanded ? "bg-violet-600 text-white/90" : "bg-white/[0.06] text-white/35 hover:bg-white/[0.08]"}`}
                onClick={() => setIsExpanded(false)}
              >
                2D Image View
              </button>
              <button
                className={`flex-1 py-2 rounded font-medium text-sm transition-colors ${isExpanded ? "bg-violet-600 text-white/90" : "bg-white/[0.06] text-white/35 hover:bg-white/[0.08]"}`}
                onClick={() => setIsExpanded(true)}
              >
                3D Tensor View
              </button>
            </div>
            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              An image is not just a flat grid of colors. It is a 3D Tensor of shape <strong className="text-white/60">Height × Width × Channels</strong>. 
              Usually, there are 3 channels: Red, Green, and Blue.
            </p>
          </div>

          <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-5 font-mono text-sm min-h-[140px] flex flex-col justify-center">
            {hoveredPixel ? (
              <div className="flex flex-col gap-3">
                <div className="text-white/35">
                  <span className="text-white/40">Coordinate:</span> image[{hoveredPixel.y}][{hoveredPixel.x}]
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded shadow-inner" style={{ backgroundColor: `rgb(${hoveredPixel.color[0]}, ${hoveredPixel.color[1]}, ${hoveredPixel.color[2]})` }} />
                  <div className="flex flex-col gap-1">
                    <span className="text-red-400">R: {hoveredPixel.color[0]}</span>
                    <span className="text-green-400">G: {hoveredPixel.color[1]}</span>
                    <span className="text-blue-400">B: {hoveredPixel.color[2]}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/35 text-center italic">
                Hover over a pixel to inspect its tensor values.
              </div>
            )}
          </div>
        </div>

        {/* Visualizer */}
        <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-2 relative overflow-hidden flex items-center justify-center min-h-[300px]">
          
          <div className="relative" style={{ width: 240, height: 240 }}>
            {/* Base Image (Composite) */}
            <motion.div 
              className="absolute inset-0 grid border border-white/[0.08] bg-black shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}
              animate={{
                x: isExpanded ? -80 : 0,
                y: isExpanded ? 80 : 0,
                rotateX: isExpanded ? 60 : 0,
                rotateZ: isExpanded ? 45 : 0,
                scale: isExpanded ? 0.7 : 1,
                opacity: isExpanded ? 0.3 : 1
              }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {image.map((row, y) => row.map((color, x) => (
                <div
                  key={`base-${y}-${x}`}
                  className="w-full h-full cursor-crosshair transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                  onMouseEnter={() => setHoveredPixel({ x, y, color })}
                  onMouseLeave={() => setHoveredPixel(null)}
                />
              )))}
            </motion.div>

            {/* Red Channel */}
            <motion.div 
              className="absolute inset-0 grid border border-red-900/50 pointer-events-none"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}
              initial={{ opacity: 0 }}
              animate={{
                x: isExpanded ? -20 : 0,
                y: isExpanded ? 20 : 0,
                rotateX: isExpanded ? 60 : 0,
                rotateZ: isExpanded ? 45 : 0,
                scale: isExpanded ? 0.7 : 1,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
            >
              {image.map((row, y) => row.map((color, x) => (
                <div key={`r-${y}-${x}`} className="w-full h-full border-[0.5px] border-red-900/20" style={{ backgroundColor: `rgb(${color[0]}, 0, 0)` }} />
              )))}
              <div className="absolute -top-6 left-0 text-red-500 font-mono text-xs font-bold">Red Channel (Dim 0)</div>
            </motion.div>

            {/* Green Channel */}
            <motion.div 
              className="absolute inset-0 grid border border-green-900/50 pointer-events-none"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}
              initial={{ opacity: 0 }}
              animate={{
                x: isExpanded ? 40 : 0,
                y: isExpanded ? -40 : 0,
                rotateX: isExpanded ? 60 : 0,
                rotateZ: isExpanded ? 45 : 0,
                scale: isExpanded ? 0.7 : 1,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            >
              {image.map((row, y) => row.map((color, x) => (
                <div key={`g-${y}-${x}`} className="w-full h-full border-[0.5px] border-green-900/20" style={{ backgroundColor: `rgb(0, ${color[1]}, 0)` }} />
              )))}
              <div className="absolute -top-6 left-0 text-green-500 font-mono text-xs font-bold">Green Channel (Dim 1)</div>
            </motion.div>

            {/* Blue Channel */}
            <motion.div 
              className="absolute inset-0 grid border border-blue-900/50 pointer-events-none"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}
              initial={{ opacity: 0 }}
              animate={{
                x: isExpanded ? 100 : 0,
                y: isExpanded ? -100 : 0,
                rotateX: isExpanded ? 60 : 0,
                rotateZ: isExpanded ? 45 : 0,
                scale: isExpanded ? 0.7 : 1,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
            >
              {image.map((row, y) => row.map((color, x) => (
                <div key={`b-${y}-${x}`} className="w-full h-full border-[0.5px] border-blue-900/20" style={{ backgroundColor: `rgb(0, 0, ${color[2]})` }} />
              )))}
              <div className="absolute -top-6 left-0 text-blue-500 font-mono text-xs font-bold">Blue Channel (Dim 2)</div>
            </motion.div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
