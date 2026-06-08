"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveLoRA() {
  const [rank, setRank] = useState(4);
  
  const dimModel = 100;
  const fullParams = dimModel * dimModel; // 10,000
  const loraParams = (dimModel * rank) + (rank * dimModel); // 100*r + r*100
  
  const savings = ((fullParams - loraParams) / fullParams) * 100;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Low-Rank Adaptation (LoRA)</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Parameter-Efficient Fine-Tuning
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">LoRA Rank ($r$)</h3>
            
            <div className="flex flex-col gap-2">
              <Slider 
                label={`Rank: ${rank}`}
                value={rank} 
                min={1} max={20} step={1}
                onChange={(val) => setRank(val)} 
              />
              <p className="text-xs text-white/40 mt-2">
                The Rank (r) determines the thickness of the adapter matrices A and B. A lower rank means fewer trainable parameters, but less capacity to learn new information.
              </p>
            </div>

            <div className="mt-4 bg-[#111128] p-4 rounded border border-white/[0.08]">
              <div className="text-xs text-white/35 uppercase tracking-widest font-bold mb-2">Parameter Count</div>
              
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/35 font-bold">Full Fine-Tuning</span>
                    <span className="font-mono text-white/60">{fullParams.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#111128] rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#111128]0" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-bold">LoRA Adapters</span>
                    <span className="font-mono text-white/90">{loraParams.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#111128] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(loraParams / fullParams) * 100}%` }} />
                  </div>
                </div>
                
                <div className="mt-2 text-center text-sm font-bold text-emerald-400 bg-emerald-50 p-2 rounded border border-emerald-900/50">
                  {savings.toFixed(1)}% Reduction!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 min-h-[400px]">
          
          <div className="w-full max-w-2xl">
            <h3 className="text-[10px] font-bold text-white/40 mb-8 uppercase tracking-widest text-center">Matrix Math: W<sub>final</sub> = W<sub>0</sub> + (A x B)</h3>
            
            <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
              
              {/* Frozen W0 Matrix */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 bg-white/[0.04] border-2 border-white/[0.1] rounded flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 to-transparent" />
                  <span className="font-mono font-bold text-white/40 text-xl z-10">W<sub>0</sub></span>
                  
                  {/* Lock icon */}
                  <div className="absolute top-2 right-2 text-white/35">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-white/35 font-bold bg-[#111128] px-2 py-1 rounded">100 × 100 (Frozen)</div>
              </div>

              <div className="text-2xl font-bold text-white/35">+</div>

              {/* LoRA Matrices (A and B) */}
              <div className="flex items-center gap-2 p-4 border border-emerald-900/50 bg-emerald-950/10 rounded-xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111128] px-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Trainable Adapters</div>
                
                {/* Matrix A */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="h-32 bg-emerald-900/40 border-2 border-emerald-500/50 rounded flex items-center justify-center transition-all duration-300"
                    style={{ width: `${Math.max(16, rank * 4)}px` }}
                  >
                    <span className="font-mono font-bold text-emerald-400 text-sm">A</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">100 × {rank}</div>
                </div>

                <div className="text-lg font-bold text-emerald-400">×</div>

                {/* Matrix B */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-32 bg-emerald-900/40 border-2 border-emerald-500/50 rounded flex items-center justify-center transition-all duration-300"
                    style={{ height: `${Math.max(16, rank * 4)}px` }}
                  >
                    <span className="font-mono font-bold text-emerald-400 text-sm">B</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400">{rank} × 100</div>
                </div>
                
              </div>

            </div>

            <div className="mt-12 p-4 bg-[#0d0d20]/50 border border-white/[0.08] rounded-lg text-sm text-white/35 text-center">
              Instead of updating all 10,000 parameters in W<sub>0</sub>, we freeze it completely. We then create two tiny matrices A and B, and only train them! When we multiply A &times; B, it produces a new 100×100 matrix of &quot;updates&quot; that we simply add to W<sub>0</sub>.
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}
