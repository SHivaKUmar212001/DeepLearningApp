"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlayControl } from "@/components/ui/PlayControl";

export function InteractiveSeq2Seq() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Total steps: 3 (encoder) + 1 (context) + 4 (decoder) = 8 steps
  const totalSteps = 8;

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((s) => {
          if (s >= totalSteps) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Sequence to Sequence (Seq2Seq)</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Encoder-Decoder Architecture
        </div>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-rose-100 p-4 rounded-lg border border-rose-200">
          <PlayControl 
            isPlaying={isPlaying}
            onPlayPause={() => {
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                if (step >= totalSteps) setStep(0);
                setIsPlaying(true);
              }
            }}
            onReset={() => {
              setIsPlaying(false);
              setStep(0);
            }}
          />
          <div className="text-xs font-mono text-rose-700 mt-4 sm:mt-0">
            {step < 3 ? "ENCODING..." : step === 3 ? "CONTEXT VECTOR FORMED" : step < 8 ? "DECODING..." : "COMPLETE"}
          </div>
        </div>

        {/* Visualizer */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 bg-rose-50 rounded-xl border border-rose-200 p-6 md:p-12 min-h-[300px]">
          
          {/* ENCODER */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold text-indigo-700 mb-6 uppercase tracking-widest">Encoder RNN</h3>
            <div className="flex gap-4">
              {["I", "am", "happy"].map((word, i) => (
                <div key={i} className="flex flex-col items-center relative group">
                  <div className={`p-2 rounded font-bold transition-all duration-300 w-16 text-center ${step > i ? 'bg-indigo-100 text-indigo-600 border border-indigo-500/50' : 'bg-rose-100 text-rose-600 border border-rose-200'}`}>
                    {word}
                  </div>
                  
                  {/* Arrow up to RNN */}
                  <div className={`w-0.5 h-6 my-1 transition-all duration-300 ${step > i ? 'bg-indigo-500' : 'bg-rose-200'}`} />
                  
                  {/* RNN Node */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${step > i ? 'bg-indigo-600 text-rose-950 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-rose-100 border-2 border-rose-200 text-rose-600'}`}>
                    {`$h_{${i+1}}$`}
                  </div>

                  {/* Horizontal line */}
                  {i < 2 && (
                    <div className={`absolute top-[4.5rem] left-[50%] w-full h-0.5 z-0 transition-all duration-300 ${step > i + 1 ? 'bg-indigo-500' : 'bg-rose-200'}`} />
                  )}
                  {/* Final horizontal line to Context Vector */}
                  {i === 2 && (
                    <div className="absolute top-[4.5rem] left-[50%] w-full h-0.5 z-0">
                      <motion.div 
                        className="h-full bg-indigo-500 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step >= 3 ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CONTEXT VECTOR BOTTLENECK */}
          <div className="flex flex-col items-center my-8 lg:my-0">
            <h3 className="text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-widest hidden lg:block">Bottleneck</h3>
            <div className={`w-20 h-24 rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-500 z-20 ${step >= 3 ? 'bg-purple-900/40 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'bg-rose-100 border-2 border-dashed border-rose-300'}`}>
              <div className={`font-mono text-sm font-bold text-center z-10 ${step >= 3 ? 'text-purple-300' : 'text-rose-600'}`}>
                Context<br/>Vector
              </div>
              
              {/* Pulse animation when ready */}
              {step >= 3 && step < 8 && (
                <motion.div 
                  className="absolute inset-0 bg-purple-500/20"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            {/* Arrow out of context vector */}
            <div className="relative w-full lg:w-12 h-12 lg:h-0.5 lg:absolute lg:top-[calc(50%+1rem)] lg:left-[calc(50%+2.5rem)] z-0">
               <motion.div 
                 className="absolute inset-0 bg-emerald-500 origin-left"
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: step >= 4 ? 1 : 0 }}
                 transition={{ duration: 0.5 }}
               />
            </div>
          </div>

          {/* DECODER */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold text-emerald-600 mb-6 uppercase tracking-widest">Decoder RNN</h3>
            <div className="flex gap-4">
              {["Je", "suis", "heureux", "<END>"].map((word, i) => (
                <div key={i} className="flex flex-col items-center relative group">
                  
                  {/* RNN Node */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${step > i + 3 ? 'bg-emerald-600 text-rose-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-100 border-2 border-rose-200 text-rose-600'}`}>
                    {`$s_{${i+1}}$`}
                  </div>
                  
                  {/* Arrow down to output */}
                  <div className={`w-0.5 h-6 my-1 transition-all duration-300 ${step > i + 3 ? 'bg-emerald-500' : 'bg-rose-200'}`} />
                  
                  {/* Output Word */}
                  <div className={`p-2 rounded font-bold transition-all duration-300 w-20 text-center text-sm ${step > i + 3 ? 'bg-emerald-100 text-emerald-300 border border-emerald-500/50' : 'bg-rose-100 text-rose-600 border border-rose-200'}`}>
                    {word}
                  </div>

                  {/* Horizontal line */}
                  {i < 3 && (
                    <div className={`absolute top-6 left-[50%] w-full h-0.5 z-0 transition-all duration-300 ${step > i + 4 ? 'bg-emerald-500' : 'bg-rose-200'}`} />
                  )}

                  {/* Auto-regressive feedback loop (Arrow from output back up to next input) */}
                  {i < 3 && step > i + 3 && (
                    <svg className="absolute top-[3.5rem] left-[50%] w-full h-8 pointer-events-none z-0">
                      <path 
                        d="M 0 0 C 0 30, 100 30, 100 -20" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 2"
                        className="opacity-50"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
