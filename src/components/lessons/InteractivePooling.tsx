"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractivePooling() {
  const [poolType, setPoolType] = useState<"max" | "avg">("max");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 4x4 Input Feature Map
  const input = [
    [12, 20, 30,  0],
    [ 8, 12,  2,  0],
    [34, 70, 37,  4],
    [112,100,25, 12]
  ];

  const poolSize = 2;
  const stride = 2;
  const outputSize = 2; // (4 - 2) / 2 + 1 = 2
  const totalSteps = outputSize * outputSize; // 4 steps

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1500); // 1.5s per step
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps]);

  // Reset when pool type changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
     
    setIsPlaying(false);
  }, [poolType]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  // Current window pos
  const outX = step % outputSize;
  const outY = Math.floor(step / outputSize);
  const winX = outX * stride;
  const winY = outY * stride;

  // Extract current window values
  const windowValues: number[] = [];
  for (let y = 0; y < poolSize; y++) {
    for (let x = 0; x < poolSize; x++) {
      windowValues.push(input[winY + y][winX + x]);
    }
  }

  const currentResult = poolType === "max" 
    ? Math.max(...windowValues)
    : Math.floor(windowValues.reduce((a, b) => a + b, 0) / windowValues.length);

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Pooling Operations</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Step {step + 1} / {totalSteps}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-400">Pool Type</h3>
            
            <div className="flex flex-col gap-2">
              <select 
                className="bg-white/[0.06] border border-white/[0.1] text-white/90 text-sm rounded focus:ring-violet-500 focus:border-violet-500 block w-full p-2"
                value={poolType}
                onChange={(e) => setPoolType(e.target.value as "max" | "avg")}
              >
                <option value="max">Max Pooling</option>
                <option value="avg">Average Pooling</option>
              </select>
            </div>

            <div className="bg-[#111128] p-4 rounded-lg border border-white/[0.08] font-mono text-sm flex flex-col gap-3 min-h-[140px] justify-center">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2 border-b border-white/[0.08] pb-2">Calculation</div>
              
              <div className="flex justify-between items-center text-white/35">
                <span>Window:</span>
                <span>[{windowValues.join(", ")}]</span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step + poolType}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-cyan-400 font-bold">{poolType === "max" ? "Max:" : "Average:"}</span>
                  <span className="text-cyan-400 font-bold text-lg">{currentResult}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mt-2">
              <PlayControl isPlaying={isPlaying} onPlayPause={() => isPlaying ? pause() : play()} onReset={reset} />
            </div>
          </div>
        </div>

        {/* Visualizers */}
        <div className="lg:col-span-8 flex flex-col md:flex-row items-center justify-center gap-12 bg-[#111128] rounded-xl border border-white/[0.08] p-6">
          
          {/* Input Grid */}
          <div className="flex flex-col items-center">
            <h3 className="text-white/35 font-semibold mb-4 text-sm">Input Feature Map (4x4)</h3>
            <div className="relative p-2 bg-white/[0.04] border border-white/[0.08] rounded-lg">
              <div className="grid grid-cols-4 gap-1">
                {input.map((row, y) => row.map((val, x) => {
                  const inWindow = x >= winX && x < winX + poolSize && y >= winY && y < winY + poolSize;
                  const isMax = inWindow && poolType === "max" && val === currentResult;
                  
                  return (
                    <div 
                      key={`${y}-${x}`} 
                      className={`w-12 h-12 flex items-center justify-center font-mono rounded transition-colors duration-300
                        ${inWindow ? (isMax ? 'bg-cyan-500/80 text-white/90 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-indigo-100 text-indigo-200') : 'bg-white/[0.06] text-white/40 border border-white/[0.1]'}
                      `}
                    >
                      {val}
                    </div>
                  );
                }))}
              </div>

              {/* Sliding Window Highlight Box */}
              <motion.div
                className="absolute border-4 border-indigo-500 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10"
                initial={false}
                animate={{
                  left: 8 + winX * 52, // 8px padding + x * (48px + 4px gap)
                  top: 8 + winY * 52,
                  width: 2 * 52 - 4,
                  height: 2 * 52 - 4
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center text-white/35">
            <span className="text-xs uppercase tracking-wider mb-1">Pool</span>
            →
          </div>

          {/* Output Grid */}
          <div className="flex flex-col items-center">
            <h3 className="text-cyan-400 font-semibold mb-4 text-sm">Pooled Map (2x2)</h3>
            <div className="p-2 bg-white/[0.04] border border-white/[0.08] rounded-lg">
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 4 }).map((_, i) => {
                  let val = 0;
                  const isComputed = i <= step;
                  const isCurrent = i === step;
                  
                  if (isComputed) {
                    const py = Math.floor(i / 2) * stride;
                    const px = (i % 2) * stride;
                    const vals = [input[py][px], input[py][px+1], input[py+1][px], input[py+1][px+1]];
                    val = poolType === "max" ? Math.max(...vals) : Math.floor(vals.reduce((a, b) => a + b, 0) / vals.length);
                  }

                  return (
                    <div 
                      key={i} 
                      className={`w-16 h-16 flex items-center justify-center font-mono text-lg rounded transition-all duration-300
                        ${isCurrent ? 'bg-cyan-500 text-black font-bold scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)] z-10' : 
                          isComputed ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-300' : 'bg-white/[0.06] border border-white/[0.1] text-transparent'}`}
                    >
                      {isComputed ? val : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
