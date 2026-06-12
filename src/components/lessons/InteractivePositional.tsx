"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractivePositional() {
  const [seqLength, setSeqLength] = useState(20);
  const [dModel, setDModel] = useState(32); // Must be even

  // Calculate positional encoding matrix
  const matrix = useMemo(() => {
    const mat = [];
    for (let pos = 0; pos < seqLength; pos++) {
      const row = [];
      for (let i = 0; i < dModel; i++) {
        const denominator = Math.pow(10000, (2 * Math.floor(i / 2)) / dModel);
        if (i % 2 === 0) {
          row.push(Math.sin(pos / denominator));
        } else {
          row.push(Math.cos(pos / denominator));
        }
      }
      mat.push(row);
    }
    return mat;
  }, [seqLength, dModel]);

  // Map value [-1, 1] to a color (blue for negative, red for positive, black for 0)
  const getColor = (val: number) => {
    // Normalize -1..1 to 0..1
    const n = (val + 1) / 2;
    // Cold to hot colormap (blue -> black -> red)
    if (n < 0.5) {
      const intensity = Math.floor((1 - n * 2) * 255);
      return `rgb(0, 0, ${intensity})`;
    } else {
      const intensity = Math.floor(((n - 0.5) * 2) * 255);
      return `rgb(${intensity}, 0, 0)`;
    }
  };

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Positional Encoding</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Sine/Cosine Waves
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Matrix Dimensions</h3>
            
            <div className="flex flex-col gap-6">
              <Slider 
                label="Sequence Length (Rows)"
                value={seqLength} 
                min={5} max={50} step={5}
                onChange={(val) => setSeqLength(val)} 
              />
              
              <Slider 
                label="Embedding Dim (Cols)"
                value={dModel} 
                min={16} max={64} step={8}
                onChange={(val) => setDModel(val)} 
              />
            </div>
            
            <div className="mt-4 bg-[#111128] p-3 rounded border border-white/[0.08] text-xs text-white/35 leading-relaxed space-y-2">
              <p>Self-Attention processes all words at the exact same time. It has no concept of order.</p>
              <p>To fix this, we generate this wave matrix and <strong>add</strong> it directly to the word embeddings before feeding them into the network.</p>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 overflow-hidden">
          
          <div className="w-full flex flex-col items-center">
            <h3 className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Dimension i &rarr;</h3>
            
            <div className="flex gap-2 w-full justify-center">
              {/* Row axis label */}
              <div className="flex flex-col items-end justify-center mr-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest origin-center -rotate-90 whitespace-nowrap">
                  &larr; Position
                </span>
              </div>
              
              {/* The Matrix */}
              <div className="flex flex-col gap-[1px] bg-white/[0.06] p-[1px] border border-white/[0.1] max-h-[400px] overflow-y-auto w-full max-w-[500px]">
                {matrix.map((row, pos) => (
                  <div key={pos} className="flex gap-[1px] h-3 w-full group">
                    {/* Tooltip anchor for the whole row */}
                    {row.map((val, i) => (
                      <div 
                        key={i} 
                        className="flex-1 h-full relative group/cell cursor-crosshair"
                        style={{ backgroundColor: getColor(val) }}
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/cell:opacity-100 bg-white/[0.04] text-white/90 text-xs p-2 rounded border border-white/[0.1] pointer-events-none z-50 whitespace-nowrap hidden md:block transition-opacity">
                          <div className="font-mono font-bold mb-1 border-b border-white/[0.1] pb-1">
                            PE({pos},{i})
                          </div>
                          <div>Value: <span className={val > 0 ? 'text-red-400' : 'text-blue-400'}>{val.toFixed(4)}</span></div>
                          <div className="text-white/40 mt-1">
                            {i % 2 === 0 ? "sin" : "cos"}({pos} / {Math.pow(10000, (2 * Math.floor(i / 2)) / dModel).toFixed(1)})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono text-white/40">
              <span>-1</span>
              <div className="w-32 h-2 bg-gradient-to-r from-blue-600 via-black to-red-600 rounded" />
              <span>+1</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
