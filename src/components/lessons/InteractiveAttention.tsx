"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveAttention() {
  const [activeTarget, setActiveTarget] = useState<number>(0);

  const sourceWords = ["The", "green", "apple"];
  const targetWords = ["La", "pomme", "verte"];

  // Attention weights: targetIndex -> [weight for each sourceIndex]
  // 0: "La" attends to "The"
  // 1: "pomme" attends to "apple"
  // 2: "verte" attends to "green"
  const attentionWeights = [
    [0.9, 0.05, 0.05], // "La"
    [0.05, 0.1, 0.85], // "pomme"
    [0.05, 0.9, 0.05], // "verte"
  ];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">The Attention Mechanism</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Dynamic Context Routing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-600">Decoding Step</h3>
            
            <div className="flex flex-col gap-3">
              {targetWords.map((word, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveTarget(i)}
                  className={`p-3 rounded border text-left transition-colors flex justify-between items-center ${activeTarget === i ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-600' : 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-300'}`}
                >
                  <div className="font-bold text-lg">{"Target: " + word}</div>
                  {activeTarget === i && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-2 bg-rose-50 p-3 rounded border border-rose-200 text-xs text-rose-600 leading-relaxed">
              When translating from English to French, adjectives often come <em>after</em> the noun. <br/><br/>
              Notice how the network dynamically shifts its focus when decoding <strong>&quot;verte&quot;</strong>. It doesn&apos;t look at the word directly aligned with it (&quot;apple&quot;); it looks backwards at &quot;green&quot;!
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-8 min-h-[400px]">
          
          <div className="w-full max-w-lg relative flex flex-col items-center gap-24">
            
            {/* Source Sentence (Encoder Hidden States) */}
            <div className="w-full">
              <h3 className="text-[10px] font-bold text-emerald-500 mb-4 uppercase tracking-widest text-center">Source (English)</h3>
              <div className="flex justify-between w-full">
                {sourceWords.map((word, i) => {
                  const weight = attentionWeights[activeTarget][i];
                  return (
                    <div key={`src-${i}`} className="flex flex-col items-center relative z-10 w-20">
                      <div className={`p-2 rounded-lg font-bold text-center w-full transition-all duration-300 ${weight > 0.5 ? 'bg-emerald-900/80 text-emerald-300 border-2 border-emerald-500' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                        {word}
                      </div>
                      <div className="mt-2 text-[10px] font-mono font-bold text-rose-700">
                        {`$h_${i+1}$`}
                      </div>
                      
                      {/* Attention Score Pill */}
                      <div className={`absolute -bottom-8 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all duration-300 ${weight > 0.5 ? 'bg-indigo-500 text-rose-950' : 'bg-rose-200 text-rose-700'}`}>
                        {(weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connecting Lines (Attention Weights) */}
            <svg className="absolute top-[30%] left-0 w-full h-[40%] pointer-events-none z-0 overflow-visible">
              {sourceWords.map((_, i) => {
                const weight = attentionWeights[activeTarget][i];
                // Calculate X positions for source and target (0%, 50%, 100%)
                const startX = i === 0 ? "10%" : i === 1 ? "50%" : "90%";
                const endX = activeTarget === 0 ? "10%" : activeTarget === 1 ? "50%" : "90%";
                
                return (
                  <motion.path
                    key={`line-${i}`}
                    d={`M ${startX} 0 C ${startX} 50, ${endX} 50, ${endX} 100`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth={Math.max(1, weight * 10)}
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      strokeWidth: Math.max(1, weight * 10),
                      opacity: weight > 0.1 ? weight : 0.1,
                      pathLength: [0, 1]
                    }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}
            </svg>

            {/* Target Sentence (Decoder) */}
            <div className="w-full mt-4">
              <h3 className="text-[10px] font-bold text-rose-700 mb-4 uppercase tracking-widest text-center">Target (French)</h3>
              <div className="flex justify-between w-full">
                {targetWords.map((word, i) => (
                  <div key={`tgt-${i}`} className="flex flex-col items-center relative z-10 w-20">
                    <div className="mb-2 text-[10px] font-mono font-bold text-rose-700">
                      {`$s_${i+1}$`}
                    </div>
                    <div className={`p-2 rounded-lg font-bold text-center w-full transition-all duration-300 ${activeTarget === i ? 'bg-rose-900/80 text-rose-300 border-2 border-rose-500 scale-110 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                      {word}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
