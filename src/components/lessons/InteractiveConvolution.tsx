"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveConvolution() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 5x5 Input Image
  const input = [
    [1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0]
  ];

  // 3x3 Kernel (e.g., edge detector or simple pattern)
  const kernel = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1]
  ];

  const inputSize = 5;
  const kernelSize = 3;
  const outputSize = inputSize - kernelSize + 1; // 3x3

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= outputSize * outputSize - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1200); // 1.2s per step to let user read the math
    return () => clearInterval(interval);
  }, [isPlaying, outputSize]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  // Current sliding window position
  const winX = step % outputSize;
  const winY = Math.floor(step / outputSize);

  // Calculate current output value
  let sum = 0;
  const mults: number[] = [];
  for (let ky = 0; ky < kernelSize; ky++) {
    for (let kx = 0; kx < kernelSize; kx++) {
      const v = input[winY + ky][winX + kx] * kernel[ky][kx];
      sum += v;
      mults.push(v);
    }
  }

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">The Convolution Operation</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Step {step + 1} / 9
        </div>
      </div>

      <div className="flex justify-center mb-2">
        <PlayControl isPlaying={isPlaying} onPlayPause={() => isPlaying ? pause() : play()} onReset={reset} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
        
        {/* Input Matrix */}
        <div className="flex flex-col items-center">
          <h3 className="text-white/35 font-semibold mb-4">Input Image (5x5)</h3>
          <div className="relative bg-[#111128] p-2 rounded-lg border border-white/[0.08]">
            <div className="grid grid-cols-5 gap-1">
              {input.map((row, y) => row.map((val, x) => {
                const inWindow = x >= winX && x < winX + kernelSize && y >= winY && y < winY + kernelSize;
                return (
                  <div 
                    key={`${y}-${x}`} 
                    className={`w-10 h-10 flex items-center justify-center font-mono rounded border transition-colors duration-300 ${inWindow ? 'bg-indigo-900/40 border-indigo-500/50 text-violet-400' : 'bg-white/[0.06] border-white/[0.1] text-white/40'}`}
                  >
                    {val}
                  </div>
                );
              }))}
            </div>

            {/* Sliding Window Highlight Box */}
            <motion.div
              className="absolute border-2 border-indigo-500 rounded pointer-events-none shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              initial={false}
              animate={{
                left: 8 + winX * 44, // 8px padding + x * (40px + 4px gap)
                top: 8 + winY * 44,
                width: 3 * 44 - 4,
                height: 3 * 44 - 4
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Kernel & Math */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <h3 className="text-amber-400 font-semibold mb-4">Kernel (3x3)</h3>
            <div className="grid grid-cols-3 gap-1 bg-[#111128] p-2 rounded-lg border border-white/[0.08] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              {kernel.map((row, y) => row.map((val, x) => (
                <div key={`${y}-${x}`} className="w-10 h-10 flex items-center justify-center bg-amber-900/20 text-amber-400 font-mono rounded border border-amber-500/30">
                  {val}
                </div>
              )))}
            </div>
          </div>

          <div className="flex items-center text-white/40 font-mono text-xs gap-2">
            <span>Dot Product Calculation</span>
          </div>
          
          <div className="bg-white/[0.04] px-4 py-3 rounded border border-white/[0.08] font-mono text-center w-full max-w-[200px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-cyan-400 font-bold text-lg"
              >
                Sum = {sum}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Output Feature Map */}
        <div className="flex flex-col items-center">
          <h3 className="text-cyan-400 font-semibold mb-4">Output Feature Map (3x3)</h3>
          <div className="bg-[#111128] p-2 rounded-lg border border-white/[0.08]">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const ox = i % 3;
                const oy = Math.floor(i / 3);
                
                // Calculate value if it has been "computed" (i <= step)
                let val = 0;
                const isComputed = i <= step;
                const isCurrent = i === step;
                
                if (isComputed) {
                  for (let ky = 0; ky < kernelSize; ky++) {
                    for (let kx = 0; kx < kernelSize; kx++) {
                      val += input[oy + ky][ox + kx] * kernel[ky][kx];
                    }
                  }
                }

                return (
                  <div 
                    key={i} 
                    className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded border transition-all duration-300 ${isCurrent ? 'bg-cyan-500 text-black border-cyan-400 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-10' : isComputed ? 'bg-cyan-900/30 border-cyan-500/30 text-cyan-300' : 'bg-white/[0.06] border-white/[0.1] text-transparent'}`}
                  >
                    {isComputed ? val : ''}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-white/40 text-center mt-6 max-w-[80%]">
            The kernel slides over every possible 3x3 patch of the input, computing the dot product to produce a single pixel in the output feature map.
          </p>
        </div>

      </div>
    </div>
  );
}
