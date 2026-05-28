"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveStride() {
  const [padding, setPadding] = useState<0 | 1>(0);
  const [stride, setStride] = useState<1 | 2>(1);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const inputSize = 5;
  const kernelSize = 3;
  const paddedSize = inputSize + 2 * padding;
  
  // O = floor((W - K + 2P) / S) + 1
  const outputSize = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  const totalSteps = outputSize * outputSize;

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
    }, 1000); // 1.0s per step
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps]);

  // Reset step if dimensions change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPlaying(false);
  }, [padding, stride]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  // Current sliding window position in terms of Output Grid coordinates
  const outX = step % outputSize;
  const outY = Math.floor(step / outputSize);

  // Current sliding window position in terms of Padded Input Grid coordinates
  const winX = outX * stride;
  const winY = outY * stride;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Padding & Stride</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Step {step + 1} / {totalSteps}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-600">Hyperparameters</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-sm text-rose-800 font-medium">Padding (P)</span>
                <div className="flex gap-2">
                  <button onClick={() => setPadding(0)} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${padding === 0 ? 'bg-indigo-600 text-rose-950' : 'bg-rose-200 text-rose-700 hover:text-rose-800'}`}>0 (Valid)</button>
                  <button onClick={() => setPadding(1)} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${padding === 1 ? 'bg-indigo-600 text-rose-950' : 'bg-rose-200 text-rose-700 hover:text-rose-800'}`}>1 (Same)</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-sm text-rose-800 font-medium">Stride (S)</span>
                <div className="flex gap-2">
                  <button onClick={() => setStride(1)} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${stride === 1 ? 'bg-indigo-600 text-rose-950' : 'bg-rose-200 text-rose-700 hover:text-rose-800'}`}>1</button>
                  <button onClick={() => setStride(2)} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${stride === 2 ? 'bg-indigo-600 text-rose-950' : 'bg-rose-200 text-rose-700 hover:text-rose-800'}`}>2</button>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-rose-200 font-mono text-xs flex flex-col gap-2">
              <span className="text-rose-700 uppercase tracking-wider font-bold text-[10px]">Output Formula</span>
              <div className="text-rose-800">
                O = Math.floor((W - K + 2P) / S) + 1
              </div>
              <div className="text-emerald-600 mt-1">
                O = Math.floor(({inputSize} - {kernelSize} + {2 * padding}) / {stride}) + 1 = <strong className="text-lg">{outputSize}</strong>
              </div>
            </div>
            
            <div className="flex justify-center mt-2">
              <PlayControl isPlaying={isPlaying} onPlayPause={() => isPlaying ? pause() : play()} onReset={reset} />
            </div>
          </div>
        </div>

        {/* Visualizers */}
        <div className="lg:col-span-8 flex flex-col md:flex-row items-center justify-center gap-12 bg-rose-50 rounded-xl border border-rose-200 p-6 min-h-[350px]">
          
          {/* Input Image (Padded) */}
          <div className="flex flex-col items-center">
            <h3 className="text-rose-600 font-semibold mb-4 text-sm">Input Grid ({paddedSize}x{paddedSize})</h3>
            <div className="relative p-1">
              <div 
                className="grid gap-1 transition-all duration-300" 
                style={{ gridTemplateColumns: `repeat(${paddedSize}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: paddedSize * paddedSize }).map((_, i) => {
                  const x = i % paddedSize;
                  const y = Math.floor(i / paddedSize);
                  
                  const isPadding = (padding === 1) && (x === 0 || x === paddedSize - 1 || y === 0 || y === paddedSize - 1);
                  const inWindow = x >= winX && x < winX + kernelSize && y >= winY && y < winY + kernelSize;
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-8 h-8 flex items-center justify-center font-mono text-xs rounded transition-colors duration-300 
                        ${isPadding ? 'bg-rose-100 border border-dashed border-rose-300 text-rose-600' : 'bg-rose-200 border border-solid border-rose-300 text-rose-600'}
                        ${inWindow ? 'ring-2 ring-inset ring-indigo-500/50 bg-indigo-900/30' : ''}
                      `}
                    >
                      {isPadding ? '0' : '1'}
                    </div>
                  );
                })}
              </div>

              {/* Sliding Window Highlight Box */}
              <motion.div
                className="absolute border-[3px] border-indigo-500 rounded pointer-events-none shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10"
                initial={false}
                animate={{
                  left: 4 + winX * 36, // 4px padding + x * (32px + 4px gap)
                  top: 4 + winY * 36,
                  width: 3 * 36 - 4,
                  height: 3 * 36 - 4
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center text-rose-600">
            <span className="text-xs uppercase tracking-wider mb-1">Conv</span>
            →
          </div>

          {/* Output Feature Map */}
          <div className="flex flex-col items-center">
            <h3 className="text-cyan-600 font-semibold mb-4 text-sm">Output Feature Map ({outputSize}x{outputSize})</h3>
            <div className="relative p-1">
              <div 
                className="grid gap-1 transition-all duration-300"
                style={{ gridTemplateColumns: `repeat(${outputSize}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: outputSize * outputSize }).map((_, i) => {
                  const isComputed = i <= step;
                  const isCurrent = i === step;
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-10 h-10 flex items-center justify-center rounded border transition-all duration-300
                        ${isCurrent ? 'bg-cyan-500 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)] z-10' : 
                          isComputed ? 'bg-cyan-900/30 border-cyan-500/30' : 'bg-rose-200 border-rose-300 opacity-50'}`}
                    />
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
