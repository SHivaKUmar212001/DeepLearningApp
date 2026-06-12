"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveRNN() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const sequence = [
    { word: "The", embedding: "[0.1, -0.4]", output: "Verb: 10%" },
    { word: "cat", embedding: "[-0.5, 0.8]", output: "Verb: 80%" },
    { word: "sat", embedding: "[0.9, 0.2]", output: "Prep: 90%" },
  ];

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((s) => {
          if (s >= sequence.length) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 1500); // 1.5s per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, sequence.length]);

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] overflow-hidden">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Recurrent Neural Network (RNN)</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Unrolled across time
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Time Sequence</h3>
            
            <PlayControl 
              isPlaying={isPlaying}
              onPlayPause={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  if (step >= sequence.length) setStep(0);
                  setIsPlaying(true);
                }
              }}
              onReset={() => {
                setIsPlaying(false);
                setStep(0);
              }}
            />
            
            <div className="mt-2 bg-[#111128] p-3 rounded border border-white/[0.08] text-xs text-white/35 leading-relaxed">
              Notice how the Hidden State h(t) is passed forward in time. This is how the network remembers that the subject of the sentence was a &quot;cat&quot; when it predicts the next word after &quot;sat&quot;.
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-9 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 md:p-10 overflow-x-auto min-h-[300px]">
          
          <div className="flex items-center gap-4 md:gap-8 relative min-w-[600px]">
            
            {/* Initial Hidden State h&#8320; */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.06] border-2 border-dashed border-violet-500/30 text-white/40 font-mono text-xs shrink-0 relative">
              h&#8320;
              {step > 0 && (
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "2rem" }} transition={{ duration: 0.5 }}
                  className="absolute left-full top-1/2 -translate-y-1/2 h-0.5 bg-violet-500 z-0 origin-left" 
                />
              )}
            </div>

            {/* Time Steps */}
            {sequence.map((item, i) => {
              const isActive = step > i;
              const isCurrent = step === i + 1; // It becomes active at step = i+1
              
              return (
                <div key={i} className="flex flex-col items-center relative flex-1">
                  
                  {/* Time label */}
                  <div className={`text-[10px] font-mono font-bold mb-4 uppercase tracking-wider ${isActive ? 'text-violet-400' : 'text-white/35'}`}>
                    Time t
                  </div>

                  {/* Prediction Output */}
                  <div className={`mb-6 p-2 rounded text-xs font-mono border text-center transition-all duration-500 min-w-[80px]
                    ${isActive ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300' : 'bg-[#111128] border-white/[0.08] text-white/35 opacity-50'}`}
                  >
                    Output
                    <div className="mt-1 font-bold">{isActive ? item.output : "..."}</div>
                  </div>

                  {/* Up Arrow */}
                  <div className={`w-0.5 h-6 transition-colors duration-500 ${isActive ? 'bg-emerald-500' : 'bg-white/[0.06]'}`} />

                  {/* RNN Cell */}
                  <div className={`relative w-20 h-20 rounded-xl border-2 flex items-center justify-center text-sm font-bold shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] transition-all duration-500 z-10
                    ${isActive ? 'bg-violet-600 border-indigo-400 text-white/90' : 'bg-white/[0.04] border-white/[0.1] text-white/35'}`}
                  >
                    RNN
                    {/* Activity pulse */}
                    {isCurrent && (
                      <motion.div 
                        initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl bg-violet-500"
                      />
                    )}
                  </div>

                  {/* Horizontal flow line to next cell */}
                  {i < sequence.length - 1 && (
                    <div className="absolute top-[calc(50%+1.5rem)] left-[calc(50%+2.5rem)] w-[calc(100%-3rem)] h-0.5 bg-white/[0.06] z-0">
                      {step > i + 1 && (
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }}
                          className="h-full bg-violet-500 origin-left"
                        />
                      )}
                      {/* Arrow head */}
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] transition-colors duration-500 ${step > i + 1 ? 'border-l-indigo-500' : 'border-l-gray-800'}`} />
                      
                      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono transition-opacity duration-500 ${step > i + 1 ? 'text-violet-400 opacity-100' : 'opacity-0'}`}>
                        h<sub>{i+1}</sub>
                      </div>
                    </div>
                  )}

                  {/* Final arrow output (if last item) */}
                  {i === sequence.length - 1 && (
                    <div className="absolute top-[calc(50%+1.5rem)] left-[calc(50%+2.5rem)] w-12 h-0.5 bg-white/[0.06] z-0">
                      {step > i + 1 && (
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }}
                          className="h-full bg-violet-500 origin-left"
                        />
                      )}
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] transition-colors duration-500 ${step > i + 1 ? 'border-l-indigo-500' : 'border-l-gray-800'}`} />
                      
                      <div className={`absolute -top-6 left-4 text-[10px] font-mono transition-opacity duration-500 ${step > i + 1 ? 'text-violet-400 opacity-100' : 'opacity-0'}`}>
                        h<sub>{i+1}</sub>
                      </div>
                    </div>
                  )}

                  {/* Down Arrow */}
                  <div className={`w-0.5 h-6 transition-colors duration-500 ${isActive ? 'bg-cyan-500' : 'bg-white/[0.06]'}`} />

                  {/* Word Input */}
                  <div className={`mt-6 p-3 rounded-lg border text-center transition-all duration-500 min-w-[90px]
                    ${isActive ? 'bg-cyan-900/30 border-cyan-500/50' : 'bg-[#111128] border-white/[0.08] opacity-50'}`}
                  >
                    <div className={`font-bold text-lg ${isActive ? 'text-white/90' : 'text-white/40'}`}>{item.word}</div>
                    <div className={`text-[10px] font-mono mt-1 ${isActive ? 'text-cyan-400' : 'text-gray-700'}`}>
                      {item.embedding}
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}
