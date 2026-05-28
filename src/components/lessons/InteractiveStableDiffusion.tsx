"use client";

import { useState, useEffect } from "react";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveStableDiffusion() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pixelProgress, setPixelProgress] = useState(0);
  const [latentProgress, setLatentProgress] = useState(0);

  // Latent is 64x faster (8x8 smaller dimensions)
  const pixelSpeed = 0.5;
  const latentSpeed = 32;

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setLatentProgress((prev) => Math.min(100, prev + latentSpeed));
      setPixelProgress((prev) => Math.min(100, prev + pixelSpeed));
      
      // Stop when both reach 100
      if (pixelProgress >= 100 && latentProgress >= 100) {
        setIsPlaying(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, pixelProgress, latentProgress]);

  const handleReset = () => {
    setIsPlaying(false);
    setPixelProgress(0);
    setLatentProgress(0);
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Stable Diffusion</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Latent Space Acceleration
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-12 flex justify-between items-center bg-rose-100 p-4 rounded-lg border border-rose-200">
          <PlayControl 
            isPlaying={isPlaying}
            onPlayPause={() => {
              if (pixelProgress >= 100) handleReset();
              setIsPlaying(!isPlaying);
            }}
            onReset={handleReset}
          />
          
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full border border-indigo-900/50">
            Performance Benchmark
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ============== PIXEL DIFFUSION ============== */}
          <div className="flex flex-col gap-6 bg-rose-50 p-6 rounded-xl border border-rose-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-rose-600">Pixel Diffusion</h3>
              <span className="text-[10px] font-mono text-rose-700 bg-rose-950/50 px-2 py-1 rounded">Slow</span>
            </div>

            <div className="text-xs text-rose-600 leading-relaxed min-h-[40px]">
              Running 1,000 steps of a U-Net on a massive 512x512 image grid.
            </div>

            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-48 h-48 bg-rose-100 border-2 border-rose-900 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:5%_5%]" />
                <span className="text-rose-700 font-bold tracking-widest z-10 text-xl">512 × 512</span>
                <span className="text-[10px] font-mono text-rose-600/70 z-10">262,144 Pixels</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-rose-700">
                <span>Progress</span>
                <span className="font-mono text-rose-600">{pixelProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-rose-50 rounded-full overflow-hidden border border-rose-200">
                <div className="h-full bg-rose-500 transition-all duration-100 ease-linear" style={{ width: `${pixelProgress}%` }} />
              </div>
              <div className="text-center font-mono text-xs text-rose-700 mt-2">
                Estimated Time: {pixelProgress > 0 ? "2 Hours" : "--"}
              </div>
            </div>
          </div>

          {/* ============== LATENT DIFFUSION ============== */}
          <div className="flex flex-col gap-6 bg-rose-50 p-6 rounded-xl border border-rose-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-600">Latent Diffusion</h3>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/50 px-2 py-1 rounded">Fast</span>
            </div>

            <div className="text-xs text-rose-600 leading-relaxed min-h-[40px]">
              Compressing the image via VAE first, running diffusion on the tiny latent space, then decompressing.
            </div>

            <div className="flex items-center justify-between py-8 gap-2">
              
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-rose-100 border-2 border-rose-300 rounded flex flex-col items-center justify-center opacity-50">
                  <span className="text-rose-700 font-bold text-xs">512</span>
                </div>
              </div>

              <div className="flex flex-col items-center z-10">
                <div className="text-[8px] font-bold text-cyan-500 uppercase mb-1">VAE Encoder</div>
                <svg width="24" height="24" className="text-cyan-600">
                  <path d="M 0 12 L 20 12 M 15 7 L 20 12 L 15 17" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex flex-col items-center flex-1 z-20">
                <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <span className="text-emerald-600 font-bold tracking-widest text-sm">64 × 64</span>
                  <span className="text-[8px] font-mono text-emerald-600/70">4,096 Latents</span>
                </div>
              </div>

              <div className="flex flex-col items-center z-10">
                <div className="text-[8px] font-bold text-fuchsia-500 uppercase mb-1">VAE Decoder</div>
                <svg width="24" height="24" className="text-fuchsia-600">
                  <path d="M 0 12 L 20 12 M 15 7 L 20 12 L 15 17" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 bg-rose-100 border-2 border-rose-300 rounded flex flex-col items-center justify-center opacity-50">
                  <span className="text-rose-700 font-bold text-xs">512</span>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-rose-700">
                <span>Progress</span>
                <span className="font-mono text-emerald-600">{latentProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-rose-50 rounded-full overflow-hidden border border-rose-200">
                <div className="h-full bg-emerald-500 transition-all duration-100 ease-linear" style={{ width: `${latentProgress}%` }} />
              </div>
              <div className="text-center font-mono text-xs text-emerald-500 mt-2 font-bold">
                Estimated Time: {latentProgress > 0 ? "5 Seconds" : "--"}
              </div>
            </div>
          </div>

        </div>

        {/* Explanation */}
        <div className="lg:col-span-12 p-4 bg-rose-100/50 border border-rose-200 rounded-lg flex items-start gap-4">
          <div className="text-emerald-500 mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          </div>
          <div className="text-sm text-rose-600 leading-relaxed">
            A $512 \times 512$ image contains 262,144 pixels. Running a massive U-Net over that many pixels 1,000 times requires datacenter-level hardware. By using a pre-trained <strong>Variational Autoencoder (VAE)</strong>, we can compress the $512 \times 512$ image into a $64 \times 64$ latent space. We then run the entire diffusion process in this tiny latent space, and only use the VAE Decoder once at the very end to blow it back up to full resolution!
          </div>
        </div>

      </div>
    </div>
  );
}
