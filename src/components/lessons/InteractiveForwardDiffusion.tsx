"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveForwardDiffusion() {
  const [timeStep, setTimeStep] = useState(0);
  const maxSteps = 1000;

  // Calculate noise intensity based on time step (non-linear schedule is common, but we'll use a simple curve for visual effect)
  const noiseIntensity = Math.pow(timeStep / maxSteps, 1.5);
  
  // Opacity of the original image
  const signalOpacity = 1 - Math.pow(timeStep / maxSteps, 0.8);

  // Generate SVG noise filter
  const getNoiseFilter = () => {
    if (noiseIntensity === 0) return "none";
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">The Forward Process</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Adding Noise
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Time Step ($t$)</h3>
            
            <div className="flex flex-col gap-2">
              <Slider 
                label={`t = ${timeStep}`}
                value={timeStep} 
                min={0} max={maxSteps} step={10}
                onChange={(val) => setTimeStep(val)} 
              />
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                As $t$ increases from 0 to 1000, we iteratively add a tiny bit of Gaussian noise to the image. 
                This forms a <strong>Markov Chain</strong>: the image at $t=10$ only depends on the image at $t=9$.
              </p>
            </div>

            <div className="mt-4 bg-[#111128] p-4 rounded border border-white/[0.08] flex flex-col gap-3">
              <div className="text-xs font-bold text-white/35 uppercase tracking-widest">Signal-to-Noise Ratio</div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 text-right font-mono text-xs text-violet-400 font-bold">Signal</div>
                <div className="flex-1 h-2 bg-[#111128] rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500" style={{ width: `${signalOpacity * 100}%` }} />
                </div>
                <div className="w-10 text-right font-mono text-xs text-white/40">{(signalOpacity * 100).toFixed(0)}%</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 text-right font-mono text-xs text-white/35 font-bold">Noise</div>
                <div className="flex-1 h-2 bg-[#111128] rounded-full overflow-hidden">
                  <div className="h-full bg-[#111128]0" style={{ width: `${noiseIntensity * 100}%` }} />
                </div>
                <div className="w-10 text-right font-mono text-xs text-white/40">{(noiseIntensity * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[350px]">
          
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">
              Image at $x_t$
            </h3>
            
            <div className="w-48 h-48 bg-black border-2 border-white/[0.1] rounded-xl relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
              
              {/* Noise Background (always present, but opacity changes) */}
              <div 
                className="absolute inset-0 mix-blend-screen transition-opacity duration-100" 
                style={{ 
                  backgroundImage: getNoiseFilter(),
                  opacity: noiseIntensity
                }} 
              />
              
              {/* Original Image (Signal) */}
              <div 
                className="text-white/15 text-9xl font-bold z-10 transition-opacity duration-100"
                style={{ opacity: signalOpacity }}
              >
                8
              </div>

              {/* Pure noise overlay when t=1000 to completely obliterate the signal */}
              {timeStep === maxSteps && (
                 <div 
                 className="absolute inset-0 mix-blend-normal z-20" 
                 style={{ backgroundImage: getNoiseFilter() }} 
               />
              )}

            </div>

            <div className="text-[10px] font-mono text-white/40 text-center max-w-sm">
              At $t=1000$, the image $x_T$ is completely indistinguishable from pure, random Gaussian noise. The original information has been entirely destroyed.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
