"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveTransferLearning() {
  const [task, setTask] = useState<"imagenet" | "custom">("imagenet");

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Transfer Learning Pipeline</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Select Target Task</h3>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setTask("imagenet")}
                className={`p-3 rounded border text-left transition-colors ${task === "imagenet" ? 'bg-indigo-900/40 border-indigo-500/50 text-violet-400' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Pre-training (Original Task)</div>
                <div className="text-xs opacity-80">Classify ImageNet (1000 categories like Dogs, Cars, Planes).</div>
              </button>

              <button 
                onClick={() => setTask("custom")}
                className={`p-3 rounded border text-left transition-colors ${task === "custom" ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Fine-tuning (New Task)</div>
                <div className="text-xs opacity-80">Classify Medical X-Rays (2 categories: Healthy vs Pneumonia).</div>
              </button>
            </div>
            
            <div className="mt-2 bg-[#111128] p-3 rounded border border-white/[0.08] text-xs text-white/35">
              {task === "imagenet" ? (
                <span>The entire massive network is training from scratch. This takes hundreds of GPUs and weeks of time.</span>
              ) : (
                <span>We <strong className="text-blue-400">freeze</strong> the feature extractor and only train the small head. This takes one GPU and a few hours!</span>
              )}
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 md:p-12 overflow-hidden min-h-[300px]">
          
          <div className="flex items-center w-full max-w-[600px] gap-2">
            
            {/* Input Data */}
            <div className="flex flex-col items-center shrink-0 w-24">
              <div className="text-xs font-bold text-white/40 mb-2">Input Image</div>
              <div className="w-16 h-16 rounded overflow-hidden border border-white/[0.1] flex items-center justify-center text-3xl bg-white/[0.06]">
                {task === "imagenet" ? "🐶" : "🩻"}
              </div>
            </div>

            {/* Frozen Base */}
            <div className="flex-1 flex flex-col items-center relative">
              <div className="text-xs font-bold text-white/40 mb-2">Convolutional Base</div>
              <div className={`w-full h-24 rounded-lg border-2 flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${task === "custom" ? "bg-blue-900/20 border-blue-500/30" : "bg-indigo-900/20 border-indigo-500/50"}`}>
                <span className={`font-mono text-sm font-bold z-10 ${task === "custom" ? "text-blue-400" : "text-violet-400"}`}>ResNet-50</span>
                
                {/* Training Animation */}
                {task === "imagenet" && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Frozen Overlay */}
                {task === "custom" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-900/10 backdrop-blur-[1px]">
                    <span className="text-4xl opacity-20">❄️</span>
                  </div>
                )}
              </div>
              <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${task === "custom" ? "bg-blue-900/50 text-blue-300" : "bg-indigo-100 text-violet-400"}`}>
                {task === "custom" ? "FROZEN WEIGHTS" : "TRAINABLE WEIGHTS"}
              </div>
            </div>

            <div className="text-white/35 px-2">→</div>

            {/* Classification Head */}
            <div className="flex flex-col items-center shrink-0 w-32 relative">
              <div className="text-xs font-bold text-white/40 mb-2">Dense Head</div>
              
              <div className={`w-full rounded-lg border-2 flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-emerald-900/20 border-emerald-500/50 ${task === "imagenet" ? "h-32" : "h-16"}`}>
                <span className="font-mono text-xs font-bold text-emerald-400 z-10 relative">
                  {task === "imagenet" ? "1000 Classes" : "2 Classes"}
                </span>

                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-300">
                TRAINABLE WEIGHTS
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
