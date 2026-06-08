"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveLSTM() {
  const [scenario, setScenario] = useState<"maintain" | "forget" | "output">("maintain");

  // Define gate values based on scenario
  const getGates = () => {
    switch (scenario) {
      case "maintain":
        return { 
          forget: 1.0, 
          input: 0.1, 
          output: 0.2, 
          desc: "Reading filler words (e.g., 'on', 'the'). Keep the old memory exactly as it is. Ignore the new word.",
          cellColor: "bg-teal-600",
          math: "C_t = (C_{t-1} \\times 1.0) + (New \\times 0.1)"
        };
      case "forget":
        return { 
          forget: 0.0, 
          input: 0.9, 
          output: 0.5, 
          desc: "A new subject appears! (e.g., 'The dogs...'). Forget the old subject ('cat'), and write 'dogs' to the memory.",
          cellColor: "bg-emerald-500",
          math: "C_t = (C_{t-1} \\times 0.0) + (New \\times 0.9)"
        };
      case "output":
        return { 
          forget: 1.0, 
          input: 0.2, 
          output: 0.9, 
          desc: "Time to make a prediction! Keep the memory, but open the output valve so the Hidden State can read it.",
          cellColor: "bg-teal-600",
          math: "h_t = \\tanh(C_t) \\times 0.9"
        };
    }
  };

  const state = getGates();

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">LSTM Cell Architecture</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Long Short-Term Memory
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Select Timeline Event</h3>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setScenario("maintain")}
                className={`p-3 rounded border text-left transition-colors ${scenario === "maintain" ? 'bg-indigo-900/40 border-indigo-500/50 text-teal-400' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Maintain Memory</div>
                <div className="text-xs opacity-80">Reading filler words (&quot;on the&quot;)</div>
              </button>

              <button 
                onClick={() => setScenario("forget")}
                className={`p-3 rounded border text-left transition-colors ${scenario === "forget" ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Context Switch</div>
                <div className="text-xs opacity-80">New subject appears (&quot;...but the dogs&quot;)</div>
              </button>

              <button 
                onClick={() => setScenario("output")}
                className={`p-3 rounded border text-left transition-colors ${scenario === "output" ? 'bg-[#0a0a18]/40 border-teal-600/40/50 text-white/20' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Output Prediction</div>
                <div className="text-xs opacity-80">Needed for classification</div>
              </button>
            </div>
            
            <div className="mt-2 bg-[#111128] p-4 rounded border border-white/[0.08] text-sm text-white/60 leading-relaxed min-h-[100px]">
              {state.desc}
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 overflow-hidden min-h-[400px]">
          
          <div className="relative w-full max-w-[600px] h-[300px] bg-[#0d0d20]/50 border-2 border-white/[0.08] rounded-xl p-8">
            
            {/* CELL STATE (The Conveyor Belt) - Top Horizontal Line */}
            <div className="absolute top-[25%] left-0 right-0 h-1.5 bg-white/[0.08] z-0">
              {/* Flow animation */}
              <motion.div 
                className={`h-full ${state.cellColor} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Labels for Cell State */}
            <div className="absolute top-[25%] left-4 -translate-y-6 text-sm font-bold font-mono text-white/35">{"$C_{t-1}$"}</div>
            <div className="absolute top-[25%] right-4 -translate-y-6 text-sm font-bold font-mono text-white/90">{"$C_t$"}</div>

            {/* LOWER TRACK (Hidden State & Input) */}
            <div className="absolute bottom-[20%] left-0 right-0 h-1 bg-white/[0.06] z-0" />
            <div className="absolute bottom-[20%] left-4 -translate-y-6 text-xs font-bold font-mono text-white/40">{"$h_{t-1}$ + $x_t$"}</div>

            {/* ==================================================== */}
            {/* FORGET GATE */}
            {/* ==================================================== */}
            <div className="absolute left-[25%] bottom-[20%] w-0.5 h-[55%] bg-white/[0.06]">
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0d0d20] border-2 border-teal-600/30 flex items-center justify-center text-[10px] font-bold text-white/35 z-10">
                $\sigma$
              </div>
              <div className="absolute -top-3 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center text-[14px] font-bold text-pink-400 z-10">
                $\times$
              </div>
              
              {/* Gate Valve Indicator */}
              <div className="absolute top-[10%] left-6 text-xs font-mono font-bold whitespace-nowrap text-pink-400 bg-white/[0.04] px-2 py-1 rounded border border-white/[0.08]">
                Forget: {state.forget.toFixed(1)}
              </div>
              
              {/* Signal flow based on valve */}
              <motion.div 
                className="absolute bottom-0 w-full bg-pink-500 origin-bottom"
                animate={{ height: "100%", opacity: state.forget > 0 ? 0.6 : 0.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* ==================================================== */}
            {/* INPUT GATE */}
            {/* ==================================================== */}
            <div className="absolute left-[50%] bottom-[20%] w-0.5 h-[55%] bg-white/[0.06]">
              <div className="absolute top-[60%] -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0d0d20] border-2 border-teal-600/30 flex items-center justify-center text-[10px] font-bold text-white/35 z-10">
                $\sigma$
              </div>
              <div className="absolute top-[30%] -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0d0d20] border-2 border-teal-600/30 flex items-center justify-center text-[10px] font-bold text-white/35 z-10">
                $\tanh$
              </div>
              <div className="absolute -top-3 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-[14px] font-bold text-emerald-400 z-10">
                $+$
              </div>
              
              {/* Gate Valve Indicator */}
              <div className="absolute top-[10%] left-6 text-xs font-mono font-bold whitespace-nowrap text-emerald-400 bg-white/[0.04] px-2 py-1 rounded border border-white/[0.08]">
                Input: {state.input.toFixed(1)}
              </div>

              {/* Signal flow based on valve */}
              <motion.div 
                className="absolute bottom-0 w-full bg-emerald-500 origin-bottom"
                animate={{ height: "100%", opacity: state.input > 0.5 ? 0.8 : 0.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* ==================================================== */}
            {/* OUTPUT GATE */}
            {/* ==================================================== */}
            <div className="absolute left-[75%] bottom-[20%] w-0.5 h-[55%] bg-white/[0.06]">
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0d0d20] border-2 border-teal-600/30 flex items-center justify-center text-[10px] font-bold text-white/35 z-10">
                $\sigma$
              </div>
              <div className="absolute bottom-2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#111128]0/20 border-2 border-teal-600/40 flex items-center justify-center text-[14px] font-bold text-white/35 z-10">
                $\times$
              </div>

              {/* Tap from cell state */}
              <div className="absolute -top-[10%] -translate-x-1/2 w-8 h-8 rounded-full bg-[#0d0d20] border-2 border-teal-600/30 flex items-center justify-center text-[10px] font-bold text-white/35 z-10">
                $\tanh$
              </div>
              
              {/* Gate Valve Indicator */}
              <div className="absolute top-[40%] left-6 text-xs font-mono font-bold whitespace-nowrap text-white/35 bg-white/[0.04] px-2 py-1 rounded border border-white/[0.08]">
                Output: {state.output.toFixed(1)}
              </div>

              {/* Output arrow leaving */}
              <div className="absolute bottom-2 left-0 w-16 h-0.5 bg-[#111128]0 z-0">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-rose-500" />
                <div className="absolute -right-6 -top-2 text-xs font-bold font-mono text-white/35">$h_t$</div>
              </div>

              {/* Signal flow */}
              <motion.div 
                className="absolute top-0 w-full bg-[#111128]0 origin-top"
                animate={{ height: "100%", opacity: state.output > 0.5 ? 0.8 : 0.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
          </div>

          <div className="mt-8 font-mono text-sm text-white/60 bg-[#0d0d20] px-4 py-2 rounded-lg border border-white/[0.08]">
            {state.math.split('\\times').join(' × ').split('_t').join('ₜ').split('_{t-1}').join('ₜ₋₁')}
          </div>

        </div>

      </div>
    </div>
  );
}
