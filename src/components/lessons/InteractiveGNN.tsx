"use client";

import { useState } from "react";
import { PlayControl } from "@/components/ui/PlayControl";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveGNN() {
  const [step, setStep] = useState(0); // 0: Init, 1: Message passing, 2: Aggregated
  const [isPlaying, setIsPlaying] = useState(false);

  // Nodes: A, B, C, D
  // Values: A=1, B=2, C=3, D=4
  
  const handlePlay = () => {
    setIsPlaying(true);
    setStep(1); // Start passing
    
    setTimeout(() => {
      setStep(2); // Aggregated
      setTimeout(() => {
        setIsPlaying(false);
      }, 1000);
    }, 1500); // Wait for animation
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  // Node positions relative to SVG
  const pos = {
    A: { x: 50, y: 50 },
    B: { x: 200, y: 150 },
    C: { x: 50, y: 250 },
    D: { x: 350, y: 250 }
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Graph Neural Networks</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Message Passing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-12 flex justify-between items-center bg-rose-100 p-4 rounded-lg border border-rose-200">
          <PlayControl 
            isPlaying={isPlaying}
            onPlayPause={() => {
              if (step === 2) handleReset();
              else handlePlay();
            }}
            onReset={handleReset}
          />
          
          <div className="flex gap-4 items-center">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">Phase</span>
            <div className={`px-3 py-1 rounded text-xs font-bold ${step === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-200 text-rose-700'}`}>1. Init</div>
            <div className={`px-3 py-1 rounded text-xs font-bold ${step === 1 ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-rose-200 text-rose-700'}`}>2. Pass</div>
            <div className={`px-3 py-1 rounded text-xs font-bold ${step === 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-200 text-rose-700'}`}>3. Aggregate</div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-12 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-8 min-h-[400px]">
          
          <div className="relative w-[400px] h-[300px]">
            
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
              <line x1={pos.A.x} y1={pos.A.y} x2={pos.B.x} y2={pos.B.y} stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              <line x1={pos.C.x} y1={pos.C.y} x2={pos.B.x} y2={pos.B.y} stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              <line x1={pos.B.x} y1={pos.B.y} x2={pos.D.x} y2={pos.D.y} stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              <line x1={pos.C.x} y1={pos.C.y} x2={pos.D.x} y2={pos.D.y} stroke="#374151" strokeWidth="4" strokeLinecap="round" />
            </svg>

            {/* Messages (Animation) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
              <AnimatePresence>
                {step === 1 && (
                  <>
                    {/* A to B */}
                    <motion.circle r="6" fill="#818cf8" initial={{ cx: pos.A.x, cy: pos.A.y }} animate={{ cx: pos.B.x, cy: pos.B.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    <motion.circle r="6" fill="#818cf8" initial={{ cx: pos.B.x, cy: pos.B.y }} animate={{ cx: pos.A.x, cy: pos.A.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    
                    {/* C to B */}
                    <motion.circle r="6" fill="#34d399" initial={{ cx: pos.C.x, cy: pos.C.y }} animate={{ cx: pos.B.x, cy: pos.B.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    <motion.circle r="6" fill="#818cf8" initial={{ cx: pos.B.x, cy: pos.B.y }} animate={{ cx: pos.C.x, cy: pos.C.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    
                    {/* B to D */}
                    <motion.circle r="6" fill="#818cf8" initial={{ cx: pos.B.x, cy: pos.B.y }} animate={{ cx: pos.D.x, cy: pos.D.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    <motion.circle r="6" fill="#f43f5e" initial={{ cx: pos.D.x, cy: pos.D.y }} animate={{ cx: pos.B.x, cy: pos.B.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    
                    {/* C to D */}
                    <motion.circle r="6" fill="#34d399" initial={{ cx: pos.C.x, cy: pos.C.y }} animate={{ cx: pos.D.x, cy: pos.D.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                    <motion.circle r="6" fill="#f43f5e" initial={{ cx: pos.D.x, cy: pos.D.y }} animate={{ cx: pos.C.x, cy: pos.C.y }} transition={{ duration: 1.5, ease: "easeInOut" }} exit={{ opacity: 0 }} />
                  </>
                )}
              </AnimatePresence>
            </svg>

            {/* Nodes */}
            <div className="absolute inset-0 w-full h-full">
              {/* Node A */}
              <div 
                className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 z-20 shadow-lg ${step === 2 ? 'bg-indigo-900 border-indigo-400' : 'bg-rose-100 border-rose-400'}`}
                style={{ left: pos.A.x, top: pos.A.y }}
              >
                <span className="text-rose-950 font-bold">{step === 2 ? '1+2=3' : '1'}</span>
                <span className="absolute -top-6 text-[10px] text-rose-700 font-mono">Node A</span>
              </div>

              {/* Node B */}
              <div 
                className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 z-20 shadow-lg ${step === 2 ? 'bg-fuchsia-900 border-fuchsia-400' : 'bg-rose-100 border-rose-400'}`}
                style={{ left: pos.B.x, top: pos.B.y }}
              >
                <span className="text-rose-950 font-bold">{step === 2 ? '2+1+3+4=10' : '2'}</span>
                <span className="absolute -top-6 text-[10px] text-rose-700 font-mono">Node B</span>
              </div>

              {/* Node C */}
              <div 
                className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 z-20 shadow-lg ${step === 2 ? 'bg-emerald-900 border-emerald-400' : 'bg-rose-100 border-rose-400'}`}
                style={{ left: pos.C.x, top: pos.C.y }}
              >
                <span className="text-rose-950 font-bold">{step === 2 ? '3+2+4=9' : '3'}</span>
                <span className="absolute -bottom-6 text-[10px] text-rose-700 font-mono">Node C</span>
              </div>

              {/* Node D */}
              <div 
                className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 z-20 shadow-lg ${step === 2 ? 'bg-rose-900 border-rose-400' : 'bg-rose-100 border-rose-400'}`}
                style={{ left: pos.D.x, top: pos.D.y }}
              >
                <span className="text-rose-950 font-bold">{step === 2 ? '4+2+3=9' : '4'}</span>
                <span className="absolute -bottom-6 text-[10px] text-rose-700 font-mono">Node D</span>
              </div>
            </div>

          </div>

          <div className="mt-8 p-4 bg-rose-100/50 border border-rose-200 rounded-lg text-sm text-rose-600 leading-relaxed text-center max-w-2xl">
            {step === 0 && "Nodes only know their own local values (e.g. A=1, B=2)."}
            {step === 1 && "During Message Passing, every node sends its value along its edges to all connected neighbors."}
            {step === 2 && "During Aggregation, each node sums the incoming messages with its own value. Node B now understands the global structure of its neighbors!"}
          </div>
          
        </div>

      </div>
    </div>
  );
}
