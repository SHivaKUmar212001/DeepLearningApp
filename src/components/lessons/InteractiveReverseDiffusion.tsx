"use client";

import { useState, useEffect } from "react";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveReverseDiffusion() {
  const maxSteps = 1000;
  const [timeStep, setTimeStep] = useState(maxSteps);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play reverse diffusion
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimeStep((prev) => {
        if (prev <= 0) {
          setIsPlaying(false);
          return 0;
        }
        // Jump by 10 for visual speed
        return Math.max(0, prev - 10);
      });
    }, 50); // Fast steps

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Calculate noise intensity based on time step
  const noiseIntensity = Math.pow(timeStep / maxSteps, 1.5);
  
  // Opacity of the original image (signal)
  const signalOpacity = 1 - Math.pow(timeStep / maxSteps, 0.8);

  const getNoiseFilter = () => {
    if (noiseIntensity === 0) return "none";
    // Change baseFrequency slightly to simulate "different" noise at each step, but keep it stable for aesthetics
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.8 + (timeStep % 10) * 0.01}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">The Reverse Process</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Iterative Denoising
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-12 flex justify-between items-center bg-white/[0.04] p-4 rounded-lg border border-white/[0.08]">
          <PlayControl 
            isPlaying={isPlaying}
            onPlayPause={() => {
              if (timeStep === 0) setTimeStep(maxSteps);
              setIsPlaying(!isPlaying);
            }}
            onReset={() => {
              setIsPlaying(false);
              setTimeStep(maxSteps);
            }}
          />
          
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time Step (t)</span>
              <span className="font-mono font-bold text-white/90 text-lg">{timeStep}</span>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-12 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[400px]">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 max-w-4xl">
            
            {/* Input Noise Image */}
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Current Image $x_t$</h3>
              <div className="w-32 h-32 bg-black border-2 border-white/[0.1] rounded-xl relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div 
                  className="absolute inset-0 mix-blend-screen" 
                  style={{ backgroundImage: getNoiseFilter(), opacity: noiseIntensity > 0.05 ? noiseIntensity : 0 }} 
                />
                <div 
                  className="text-white/15 text-7xl font-bold z-10"
                  style={{ opacity: signalOpacity }}
                >
                  8
                </div>
                {timeStep === maxSteps && (
                  <div className="absolute inset-0 mix-blend-normal z-20" style={{ backgroundImage: getNoiseFilter() }} />
                )}
              </div>
            </div>

            {/* Neural Network */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Neural Network</div>
              <svg width="40" height="20" className="text-violet-400">
                <path d="M 0 10 L 35 10 M 25 2 L 35 10 L 25 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="w-32 h-24 bg-indigo-50 border-2 border-indigo-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.1)] relative overflow-hidden">
                <div className="text-violet-400 font-bold tracking-widest">U-Net</div>
                {isPlaying && (
                  <div className="absolute inset-0 bg-violet-500/10 animate-pulse" />
                )}
              </div>
              <svg width="40" height="20" className="text-white/35">
                <path d="M 0 10 L 35 10 M 25 2 L 35 10 L 25 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Predict Noise</div>
            </div>

            {/* Predicted Noise */}
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-xs font-bold text-white/35 uppercase tracking-widest">Predicted Noise {"$\\epsilon_\\theta$"}</h3>
              <div className="w-32 h-32 bg-black border-2 border-white/[0.05] rounded-xl relative overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 mix-blend-normal" 
                  style={{ 
                    backgroundImage: getNoiseFilter(), 
                    opacity: timeStep === 0 ? 0 : 0.8 // Only show predicted noise if we're actually denoising
                  }} 
                />
                {timeStep === 0 && (
                  <div className="text-white/35 font-mono text-xs">No noise</div>
                )}
              </div>
            </div>

          </div>

          <div className="mt-12 w-full max-w-4xl p-4 bg-[#0d0d20]/50 border border-white/[0.08] rounded-lg flex items-start gap-4">
            <div className="text-violet-400 mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            <div className="text-xs text-white/35 leading-relaxed">
              At t=1000, we feed pure random noise into the neural network. The network does <strong>not</strong> try to predict the clean image. Instead, it predicts the <em>noise</em>! We then subtract a tiny fraction of that predicted noise from the image, stepping backward in time to t=999. By repeating this loop 1,000 times, a photorealistic image slowly emerges from the static.
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
