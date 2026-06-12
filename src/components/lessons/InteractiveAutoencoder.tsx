"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveAutoencoder() {
  // Latent dimensions: 2, 8, 32, 128
  const [latentDim, setLatentDim] = useState(8);

  // Helper to determine blur amount based on latent dimension
  const getBlur = () => {
    if (latentDim <= 2) return "blur-[6px] opacity-60";
    if (latentDim <= 8) return "blur-[3px] opacity-80";
    if (latentDim <= 32) return "blur-[1px] opacity-95";
    return "blur-none opacity-100";
  };

  const getLoss = () => {
    if (latentDim <= 2) return 0.45;
    if (latentDim <= 8) return 0.22;
    if (latentDim <= 32) return 0.05;
    return 0.01;
  };

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Autoencoders</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Dimensionality Reduction
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Latent Space Bottleneck</h3>
            
            <div className="flex flex-col gap-2">
              <Slider 
                label={`Latent Neurons: ${latentDim}`}
                value={latentDim} 
                min={2} max={128} step={2}
                onChange={(val) => setLatentDim(val)} 
              />
              <p className="text-xs text-white/40 mt-2">
                Adjust the size of the bottleneck. Fewer neurons force the network to learn deeper, more abstract representations, but results in a &quot;lossy&quot; reconstruction.
              </p>
            </div>

            <div className="mt-4 bg-[#111128] p-4 rounded border border-white/[0.08] flex justify-between items-center">
              <div className="text-xs font-bold text-white/35 uppercase tracking-widest">Reconstruction Loss (MSE)</div>
              <div className={`font-mono font-bold ${latentDim <= 8 ? 'text-red-400' : 'text-emerald-400'}`}>
                {getLoss().toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[400px]">
          
          <div className="w-full flex items-center justify-between gap-2 md:gap-4 relative">
            
            {/* Input Image */}
            <div className="flex flex-col items-center gap-4 z-10 w-24">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center whitespace-nowrap">Original Image</h3>
              <div className="w-20 h-20 bg-white/[0.04] border-2 border-white/[0.1] rounded-lg flex items-center justify-center text-4xl font-bold text-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700/50 to-transparent mix-blend-overlay" />
                8
              </div>
              <div className="text-[10px] font-mono text-white/40">784 pixels</div>
            </div>

            {/* Encoder */}
            <div className="flex-1 flex flex-col items-center z-0">
              <div className="w-full h-32 relative">
                <svg className="absolute inset-0 w-full h-full text-violet-300/50" preserveAspectRatio="none">
                  <polygon points="0,0 100,40 100,60 0,100" fill="currentColor" />
                </svg>
              </div>
              <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mt-2 bg-indigo-950/50 px-2 py-1 rounded">Encoder</div>
            </div>

            {/* Latent Space (Bottleneck) */}
            <div className="flex flex-col items-center gap-4 z-20 mx-2">
              <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest text-center whitespace-nowrap">Latent Space</h3>
              <div className="flex flex-col gap-1 items-center justify-center h-20 transition-all duration-300">
                {Array.from({ length: Math.min(10, latentDim) }).map((_, i) => (
                  <div key={i} className="w-8 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                ))}
                {latentDim > 10 && <div className="text-[8px] text-cyan-400 font-bold mt-1">+{latentDim - 10} more</div>}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-50 px-2 py-1 rounded border border-cyan-900/50">{latentDim} dimensions</div>
            </div>

            {/* Decoder */}
            <div className="flex-1 flex flex-col items-center z-0">
              <div className="w-full h-32 relative">
                <svg className="absolute inset-0 w-full h-full text-emerald-900/50" preserveAspectRatio="none">
                  <polygon points="0,40 100,0 100,100 0,60" fill="currentColor" />
                </svg>
              </div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-2 bg-emerald-950/50 px-2 py-1 rounded">Decoder</div>
            </div>

            {/* Output Image */}
            <div className="flex flex-col items-center gap-4 z-10 w-24">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center whitespace-nowrap">Reconstruction</h3>
              <div className="w-20 h-20 bg-white/[0.04] border-2 border-emerald-700/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-white/[0.04] z-0 ${getBlur()} transition-all duration-500`} />
                <div className={`text-4xl font-bold text-emerald-400 z-10 transition-all duration-500 ${getBlur()}`}>
                  8
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/40">784 pixels</div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
