"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveSelfAttention() {
  const [context, setContext] = useState<"river" | "money">("river");

  const data = {
    river: {
      sentence: ["The", "river", "bank", "is", "muddy"],
      queryIndex: 2, // "bank"
      keyScores: [0.05, 0.8, 0.05, 0.05, 0.05], // "bank" attends heavily to "river"
      meaning: "A slope of land adjoining a body of water.",
      color: "bg-cyan-500",
      textColor: "text-cyan-400"
    },
    money: {
      sentence: ["The", "money", "bank", "is", "closed"],
      queryIndex: 2, // "bank"
      keyScores: [0.05, 0.8, 0.05, 0.05, 0.05], // "bank" attends heavily to "money"
      meaning: "A financial institution that accepts deposits.",
      color: "bg-emerald-500",
      textColor: "text-emerald-400"
    }
  };

  const activeData = data[context];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Self-Attention (QKV)</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Query, Key, Value
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Context Switcher</h3>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setContext("river")}
                className={`p-3 rounded border text-left transition-colors ${context === "river" ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Context A</div>
                <div className="text-xs opacity-80">&quot;The river bank is muddy&quot;</div>
              </button>

              <button 
                onClick={() => setContext("money")}
                className={`p-3 rounded border text-left transition-colors ${context === "money" ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="font-bold text-sm mb-1">Context B</div>
                <div className="text-xs opacity-80">&quot;The money bank is closed&quot;</div>
              </button>
            </div>
            
            <div className="mt-2 bg-[#111128] p-3 rounded border border-white/[0.08] text-xs text-white/35 leading-relaxed">
              The word <strong>&quot;bank&quot;</strong> is identical in both sentences. However, by querying the other words in the sequence, it dynamically updates its own meaning!
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8">
          
          <div className="w-full max-w-lg relative flex flex-col items-center gap-12">
            
            {/* The Sequence */}
            <div className="w-full">
              <h3 className="text-[10px] font-bold text-white/40 mb-6 uppercase tracking-widest text-center">Input Sequence (Keys & Values)</h3>
              <div className="flex justify-between w-full relative">
                {activeData.sentence.map((word, i) => {
                  const score = activeData.keyScores[i];
                  const isQuery = i === activeData.queryIndex;
                  const isKey = score > 0.5;

                  return (
                    <div key={i} className="flex flex-col items-center relative z-10 w-16">
                      
                      {/* Connection Line */}
                      {isKey && (
                        <motion.svg className="absolute top-[2rem] left-1/2 w-20 h-16 pointer-events-none z-0 overflow-visible" style={{ translateX: "0%" }}>
                          <motion.path
                            d={`M 0 0 C 40 40, 80 40, 80 80`}
                            fill="none"
                            stroke={context === "river" ? "#06b6d4" : "#10b981"}
                            strokeWidth="3"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </motion.svg>
                      )}

                      {/* Word Box */}
                      <div className={`p-2 rounded font-bold text-center w-full transition-all duration-300 text-sm ${isQuery ? 'bg-indigo-900/80 text-teal-400 border-2 border-indigo-500 z-20' : isKey ? `${activeData.color}/20 ${activeData.textColor} border-2 border-[currentColor] z-10` : 'bg-white/[0.04] text-white/35 border border-white/[0.08] z-10'}`}>
                        {word}
                      </div>

                      {/* Tags */}
                      <div className="mt-2 text-[10px] font-mono font-bold">
                        {isQuery ? (
                          <span className="text-teal-400 bg-indigo-950 px-1 rounded">QUERY</span>
                        ) : isKey ? (
                          <span className={`${activeData.textColor} opacity-80`}>KEY match!</span>
                        ) : null}
                      </div>
                      
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contextualized Output */}
            <div className="w-full mt-4 flex flex-col items-center">
              <h3 className="text-[10px] font-bold text-teal-400 mb-4 uppercase tracking-widest text-center">Contextualized Embedding Output</h3>
              
              <motion.div 
                key={context} // force re-animate on context change
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm p-4 rounded-xl border-2 border-indigo-500/50 bg-indigo-50 flex flex-col gap-2 items-center text-center shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              >
                <div className="text-white/90 font-bold text-lg flex items-center gap-2">
                  <span>&quot;bank&quot;</span>
                  <span className="text-white/40 font-normal text-sm">implies</span>
                </div>
                <div className={`font-medium ${activeData.textColor}`}>
                  {activeData.meaning}
                </div>
              </motion.div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
