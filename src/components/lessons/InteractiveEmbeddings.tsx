"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveEmbeddings() {
  const [activeMath, setActiveMath] = useState<"none" | "royalty" | "fruit">("none");

  // Pre-defined vocabulary with 2D coordinates for visualization
  const vocab = [
    { word: "man", x: 20, y: 30, color: "bg-blue-400", vector: "[0.82, 0.11, -0.5]" },
    { word: "woman", x: 20, y: 70, color: "bg-rose-400", vector: "[0.81, 0.88, -0.4]" },
    { word: "king", x: 80, y: 30, color: "bg-indigo-400", vector: "[0.95, 0.15, 0.8]" },
    { word: "queen", x: 80, y: 70, color: "bg-fuchsia-400", vector: "[0.96, 0.89, 0.9]" },
    { word: "apple", x: 40, y: 15, color: "bg-red-500", vector: "[-0.6, 0.2, 0.1]" },
    { word: "orange", x: 45, y: 25, color: "bg-orange-500", vector: "[-0.5, 0.3, 0.2]" },
    { word: "car", x: 70, y: 85, color: "bg-slate-400", vector: "[-0.1, -0.9, 0.4]" },
    { word: "bus", x: 75, y: 95, color: "bg-slate-500", vector: "[-0.2, -0.8, 0.5]" },
  ];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Latent Semantic Space</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Dimensions: 2 (Simulated)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Vector Math Operations</h3>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setActiveMath("royalty")}
                className={`p-3 rounded border text-left transition-colors ${activeMath === "royalty" ? 'bg-indigo-900/40 border-indigo-500/50 text-teal-400' : 'bg-[#111128] border-white/[0.08] text-white/35 hover:border-white/[0.1]'}`}
              >
                <div className="font-mono text-sm font-bold mb-1">King - Man + Woman</div>
                <div className="text-xs opacity-80">Demonstrates the &quot;Royalty&quot; and &quot;Gender&quot; directional vectors.</div>
              </button>

              <button 
                onClick={() => setActiveMath("fruit")}
                className={`p-3 rounded border text-left transition-colors ${activeMath === "fruit" ? 'bg-orange-900/40 border-orange-500/50 text-orange-300' : 'bg-[#111128] border-white/[0.08] text-white/35 hover:border-white/[0.1]'}`}
              >
                <div className="font-mono text-sm font-bold mb-1">Clustering</div>
                <div className="text-xs opacity-80">Notice how Apple and Orange are plotted closely together.</div>
              </button>

              <button 
                onClick={() => setActiveMath("none")}
                className={`p-2 rounded border text-center transition-colors ${activeMath === "none" ? 'bg-white/[0.06] border-teal-600/30 text-white/60' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="text-xs font-bold uppercase tracking-wider">Reset</div>
              </button>
            </div>
            
            <div className="mt-2 bg-[#111128] p-3 rounded border border-white/[0.08] text-xs text-white/35 leading-relaxed">
              Hover over a point to see its underlying dense vector representation. In real models like GPT, these vectors have 4,000+ dimensions instead of just 2!
            </div>
          </div>
        </div>

        {/* Visualizer (Scatter Plot) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 min-h-[400px]">
          
          <div className="relative w-full max-w-[500px] aspect-square border-l-2 border-b-2 border-white/[0.1]">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#4b5563 1px, transparent 1px), linear-gradient(90deg, #4b5563 1px, transparent 1px)', backgroundSize: '10% 10%' }} />

            {/* Axes Labels */}
            <div className="absolute -bottom-6 right-0 text-xs text-white/40 font-mono">Dimension 1 $\rightarrow$</div>
            <div className="absolute -left-6 top-0 text-xs text-white/40 font-mono -rotate-90 origin-bottom-left">$\leftarrow$ Dimension 2</div>

            {/* Vector Math: King - Man + Woman */}
            {activeMath === "royalty" && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                {/* Man -> King (Royalty Vector) */}
                <motion.line 
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 1 }}
                  x1="20%" y1="70%" x2="80%" y2="70%" stroke="#818cf8" strokeWidth="2" strokeDasharray="5,5" 
                />
                {/* Man -> Woman (Gender Vector) */}
                <motion.line 
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 1, delay: 0.5 }}
                  x1="20%" y1="70%" x2="20%" y2="30%" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" 
                />
                {/* Result (King - Man + Woman) = Queen */}
                <motion.line 
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ duration: 1.5, delay: 1 }}
                  x1="80%" y1="70%" x2="80%" y2="30%" stroke="#e879f9" strokeWidth="3" markerEnd="url(#arrowhead)" 
                />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#e879f9" />
                  </marker>
                </defs>
              </svg>
            )}

            {/* Vector Math: Clustering */}
            {activeMath === "fruit" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute w-[20%] h-[20%] border-2 border-orange-500/50 rounded-full bg-orange-500/10"
                style={{ left: "33%", top: "72%" }} // Adjusted to visually surround apple/orange based on y inversion
              />
            )}

            {/* Points */}
            {vocab.map((item) => (
              <div 
                key={item.word}
                className="absolute group z-10"
                style={{ left: `${item.x}%`, top: `${100 - item.y}%` }} // Invert Y so 0 is bottom
              >
                <div className={`w-4 h-4 -ml-2 -mt-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer transition-transform hover:scale-150 ${item.color}`} />
                
                {/* Tooltip */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/[0.04] border border-white/[0.1] text-white/90 text-xs p-2 rounded shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] pointer-events-none whitespace-nowrap z-20">
                  <div className="font-bold mb-1 capitalize text-sm">{item.word}</div>
                  <div className="font-mono text-white/35">{item.vector}</div>
                </div>

                {/* Always visible label */}
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider ${item.color.replace('bg-', 'text-')} opacity-80 pointer-events-none`}>
                  {item.word}
                </div>
              </div>
            ))}
            
          </div>

        </div>

      </div>
    </div>
  );
}
