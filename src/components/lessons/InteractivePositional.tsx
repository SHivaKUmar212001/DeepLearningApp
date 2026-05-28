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
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Positional Encoding</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Sine/Cosine Waves
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-600">Matrix Dimensions</h3>
            
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
            
            <div className="mt-4 bg-rose-50 p-3 rounded border border-rose-200 text-xs text-rose-600 leading-relaxed space-y-2">
              <p>Self-Attention processes all words at the exact same time. It has no concept of order.</p>
              <p>To fix this, we generate this wave matrix and <strong>add</strong> it directly to the word embeddings before feeding them into the network.</p>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-6 overflow-hidden">
          
          <div className="w-full flex flex-col items-center">
            <h3 className="text-[10px] font-bold text-rose-700 mb-2 uppercase tracking-widest">{"Dimension $i \\rightarrow$"}</h3>
            
            <div className="flex gap-2">
              {/* Row axis label */}
              <div className="flex flex-col items-end justify-center mr-2">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest origin-center -rotate-90 whitespace-nowrap">
                  {"Position $pos \\rightarrow$"}
                </span>
              </div>
              
              {/* The Matrix */}
              <div className="flex flex-col gap-[1px] bg-rose-200 p-[1px] border border-rose-300 max-h-[400px] overflow-y-auto w-full max-w-[500px]">
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
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/cell:opacity-100 bg-rose-100 text-rose-950 text-xs p-2 rounded border border-rose-300 pointer-events-none z-50 whitespace-nowrap hidden md:block transition-opacity">
                          <div className="font-mono font-bold mb-1 border-b border-rose-300 pb-1">
                            {`$PE_{pos=${pos}, i=${i}}$`}
                          </div>
                          <div>Value: <span className={val > 0 ? 'text-red-400' : 'text-blue-400'}>{val.toFixed(4)}</span></div>
                          <div className="text-rose-700 mt-1">
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
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono text-rose-700">
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
