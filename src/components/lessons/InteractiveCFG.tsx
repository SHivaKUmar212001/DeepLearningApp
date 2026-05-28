"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveCFG() {
  const [cfg, setCfg] = useState(7.5);
  
  // Vector visualization calculations
  const uncond = { x: 20, y: 80 }; // Unconditional vector
  const cond = { x: 60, y: 60 };   // Conditional vector
  
  // CFG math: final = uncond + cfg * (cond - uncond)
  // Scale down CFG for visual bounds
  const visualCfg = cfg * 0.15;
  const final = {
    x: uncond.x + visualCfg * (cond.x - uncond.x),
    y: uncond.y + visualCfg * (cond.y - uncond.y)
  };

  // Image effects based on CFG
  const getEffects = () => {
    if (cfg === 0) return "brightness-100 saturate-100 hue-rotate-90"; // Random realistic thing (looks different)
    if (cfg <= 3) return "brightness-90 saturate-75 opacity-90"; // Slightly unguided
    if (cfg <= 12) return "brightness-100 saturate-100"; // Perfect
    if (cfg <= 18) return "brightness-110 saturate-150 contrast-125"; // Overcooked
    return "brightness-150 saturate-200 contrast-150 blur-[1px]"; // Deep fried
  };

  const getEmoji = () => {
    if (cfg === 0) return "🌲"; // Ignores prompt "cat"
    if (cfg <= 3) return "🦁"; // Sort of a cat, but wrong
    return "🐱"; // Proper cat
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Classifier-Free Guidance</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Steering the U-Net
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            
            <div className="bg-[#111128] border border-white/[0.08] p-3 rounded flex items-center gap-3">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Prompt</span>
              <span className="font-mono text-white/90 text-sm">&quot;A cute cat&quot;</span>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <Slider 
                label={`CFG Scale: ${cfg.toFixed(1)}`}
                value={cfg} 
                min={0} max={20} step={0.5}
                onChange={(val) => setCfg(val)} 
              />
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                CFG controls how strongly the network follows the text prompt. 
                <br/><br/>
                • <strong>0</strong>: Ignores prompt (Unconditional).<br/>
                • <strong>7.5</strong>: Perfect balance.<br/>
                • <strong>20</strong>: Forces prompt compliance, causing visual artifacts.
              </p>
            </div>
            
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[350px]">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8">
            
            {/* Vector Graph */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Denoising Vectors</h3>
              
              <div className="w-48 h-48 bg-white/[0.04] border-2 border-white/[0.1] rounded-lg relative overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10%_10%]" />
                
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  
                  {/* Origin to Unconditional */}
                  <line x1="0" y1="100%" x2={`${uncond.x}%`} y2={`${uncond.y}%`} stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx={`${uncond.x}%`} cy={`${uncond.y}%`} r="4" fill="#9ca3af" />
                  <text x={`${uncond.x - 5}%`} y={`${uncond.y - 5}%`} fill="#9ca3af" fontSize="10" fontFamily="monospace">Uncond</text>

                  {/* Origin to Conditional */}
                  <line x1="0" y1="100%" x2={`${cond.x}%`} y2={`${cond.y}%`} stroke="#34d399" strokeWidth="2" />
                  <circle cx={`${cond.x}%`} cy={`${cond.y}%`} r="4" fill="#34d399" />
                  <text x={`${cond.x + 5}%`} y={`${cond.y + 5}%`} fill="#34d399" fontSize="10" fontFamily="monospace">Cond</text>

                  {/* CFG Extrapolation Line */}
                  <line x1={`${uncond.x}%`} y1={`${uncond.y}%`} x2={`${final.x}%`} y2={`${final.y}%`} stroke="#6366f1" strokeWidth="2" />
                  
                  {/* Final Vector */}
                  <line x1="0" y1="100%" x2={`${final.x}%`} y2={`${final.y}%`} stroke="#818cf8" strokeWidth="3" />
                  <circle cx={`${final.x}%`} cy={`${final.y}%`} r="6" fill="#818cf8" />
                  <text x={`${final.x + 5}%`} y={`${final.y - 5}%`} fill="#818cf8" fontSize="12" fontWeight="bold" fontFamily="monospace">Final</text>
                  
                </svg>
              </div>
            </div>

            {/* Generated Image Result */}
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Final Generation</h3>
              
              <div className={`w-32 h-32 bg-white/[0.04] border-2 ${cfg > 12 ? 'border-violet-500/40/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-white/[0.1]'} rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-300`}>
                <div 
                  className={`text-8xl transition-all duration-300 ${getEffects()}`}
                >
                  {getEmoji()}
                </div>
              </div>
              
              <div className="text-[10px] font-mono text-center mt-2 h-8">
                {cfg === 0 && <span className="text-white/40">Realistic, but ignored prompt.</span>}
                {cfg > 0 && cfg <= 3 && <span className="text-amber-500">Loosely follows prompt.</span>}
                {cfg > 3 && cfg <= 12 && <span className="text-emerald-500 font-bold">Perfect prompt adherence.</span>}
                {cfg > 12 && <span className="text-white/40 font-bold">&quot;Deep Fried&quot; visual artifacts.</span>}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
