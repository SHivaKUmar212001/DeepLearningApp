"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveGAN() {
  const [epoch, setEpoch] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalEpochs = 50;

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setEpoch((prev) => {
        if (prev >= totalEpochs) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 400); // Fast epochs

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Calculate realism (0 to 1)
  const realism = Math.min(1, Math.pow(epoch / totalEpochs, 1.5));
  
  // Discriminator accuracy (starts high, drops to 50% as generator gets better)
  const dAccuracy = 100 - (realism * 50);

  // Generate noisy image based on realism
  // Realism 0 = complete static. Realism 1 = perfect "8".
  const getNoisePattern = () => {
    // A stable but noisy background
    return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.8 - realism * 0.7}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Generative Adversarial Networks (GANs)</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Adversarial Training
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-12 flex justify-between items-center bg-white/[0.04] p-4 rounded-lg border border-white/[0.08]">
          <PlayControl 
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onReset={() => {
              setIsPlaying(false);
              setEpoch(0);
            }}
          />
          
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Epoch</span>
              <span className="font-mono font-bold text-white/90 text-lg">{epoch} / {totalEpochs}</span>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-12 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[400px]">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl">
            
            {/* ================= GENERATOR ================= */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest border border-indigo-900/50 bg-indigo-50 px-3 py-1 rounded-full">The Generator</h3>
              
              <div className="text-[10px] font-mono text-white/40 bg-white/[0.04] px-2 py-1 rounded">Random Noise (Latent Vector)</div>
              
              <svg width="20" height="30" className="text-violet-400">
                <path d="M 10 0 L 10 25 M 5 20 L 10 28 L 15 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="w-full h-32 bg-indigo-50 border-2 border-indigo-500/50 rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="text-violet-400 font-bold tracking-widest">G(z)</div>
                {/* Backprop gradient animation when playing */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"
                      initial={{ x: '100%' }}
                      animate={{ x: '-100%' }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  )}
                </AnimatePresence>
              </div>

              <svg width="20" height="30" className="text-violet-400">
                <path d="M 10 0 L 10 25 M 5 20 L 10 28 L 15 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="flex flex-col items-center">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Generated Fake</div>
                <div className="w-24 h-24 bg-black border-2 border-indigo-900 rounded flex items-center justify-center relative overflow-hidden">
                  {/* Noise overlay */}
                  <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: getNoisePattern() }} />
                  {/* Target image that fades in */}
                  <div className="text-6xl font-bold text-white/15 z-10" style={{ opacity: realism }}>
                    8
                  </div>
                </div>
              </div>
            </div>


            {/* ================= DISCRIMINATOR ================= */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <h3 className="text-xs font-bold text-white/35 uppercase tracking-widest border border-white/[0.05]/50 bg-[#111128] px-3 py-1 rounded-full">The Discriminator</h3>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Real Image</div>
                  <div className="w-16 h-16 bg-white/[0.04] border-2 border-emerald-900 rounded flex items-center justify-center text-4xl font-bold text-emerald-400">
                    8
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-white/35 mb-2">OR</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Fake Image</div>
                  <div className="w-16 h-16 bg-white/[0.04] border-2 border-indigo-900 rounded flex items-center justify-center text-xs font-bold text-violet-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-full gap-8">
                <svg width="20" height="30" className="text-emerald-400 rotate-[30deg]">
                  <path d="M 10 0 L 10 25 M 5 20 L 10 28 L 15 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="20" height="30" className="text-violet-400 -rotate-[30deg]">
                  <path d="M 10 0 L 10 25 M 5 20 L 10 28 L 15 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="w-full h-32 bg-[#111128] border-2 border-violet-500/40/50 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(244,63,94,0.1)] gap-2">
                <div className="text-white/20 font-bold tracking-widest">D(x)</div>
                <div className="text-[10px] font-mono text-white/35 bg-[#06060e]/50 px-2 py-0.5 rounded">Accuracy: {dAccuracy.toFixed(1)}%</div>
              </div>

              <svg width="20" height="30" className="text-white/35">
                <path d="M 10 0 L 10 25 M 5 20 L 10 28 L 15 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="text-[10px] font-bold text-white/90 bg-violet-600 px-4 py-2 rounded shadow-lg uppercase tracking-widest">
                Is it Real or Fake?
              </div>
            </div>

          </div>

          <div className="mt-12 w-full max-w-4xl p-4 bg-[#0d0d20]/50 border border-white/[0.08] rounded-lg flex items-start gap-4">
            <div className="text-white/40 mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div className="text-xs text-white/35 leading-relaxed">
              When the Generator creates a bad fake (Epoch 0), the Discriminator easily catches it (100% Accuracy). 
              The resulting error gradients are pushed <strong>backwards</strong> into the Generator, forcing it to adjust its weights. 
              By Epoch 50, the fakes are so perfect that the Discriminator is forced to guess randomly (50% Accuracy).
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
