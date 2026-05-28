"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveBERT() {
  const [context, setContext] = useState<"barked" | "meowed" | "drove">("barked");

  const scenarios = {
    barked: {
      left: "The",
      right: "barked loudly at the mailman.",
      mask: "dog",
      probs: [
        { w: "dog", p: 92 },
        { w: "hound", p: 5 },
        { w: "wolf", p: 2 }
      ],
      color: "bg-amber-500",
      textColor: "text-amber-600"
    },
    meowed: {
      left: "The",
      right: "meowed loudly at the mailman.",
      mask: "cat",
      probs: [
        { w: "cat", p: 88 },
        { w: "kitten", p: 9 },
        { w: "feline", p: 2 }
      ],
      color: "bg-indigo-500",
      textColor: "text-indigo-700"
    },
    drove: {
      left: "The",
      right: "drove loudly at the mailman.",
      mask: "car",
      probs: [
        { w: "car", p: 85 },
        { w: "truck", p: 10 },
        { w: "van", p: 4 }
      ],
      color: "bg-rose-500",
      textColor: "text-rose-600"
    }
  };

  const activeScenario = scenarios[context];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Bidirectional Context (BERT)</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Encoder-Only Architecture
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-600">Right-Side Context</h3>
            
            <div className="flex flex-col gap-3">
              {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map((key) => (
                <button 
                  key={key}
                  onClick={() => setContext(key)}
                  className={`p-3 rounded border text-left transition-colors flex justify-between items-center ${context === key ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-600' : 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-300'}`}
                >
                  <div className="font-mono text-sm opacity-80">&quot;... {scenarios[key].right}&quot;</div>
                  {context === key && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-2 bg-rose-50 p-3 rounded border border-rose-200 text-xs text-rose-600 leading-relaxed">
              A Decoder like GPT can only look to the left. If it sees &quot;The&quot;, it has to guess the next word with no future context.<br/><br/>
              BERT (an Encoder) looks at the entire sentence at once, using the <strong>right-side context</strong> to perfectly deduce what belongs in the middle!
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-6 min-h-[300px]">
          
          <div className="w-full flex flex-col items-center gap-10">
            
            {/* The Input Sentence */}
            <div className="w-full flex items-center justify-center gap-2 text-lg md:text-xl font-bold text-rose-800">
              <div className="bg-rose-200 px-4 py-2 rounded-lg border border-rose-300">
                {activeScenario.left}
              </div>
              
              <div className="relative group">
                <div className="bg-fuchsia-100 border-2 border-fuchsia-500 text-fuchsia-300 px-4 py-2 rounded-lg font-mono text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                  [MASK]
                </div>
                
                {/* Arrow pointing down to predictions */}
                <svg className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 text-fuchsia-500">
                  <path d="M 12 0 L 12 36 M 6 30 L 12 38 L 18 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="bg-rose-200 px-4 py-2 rounded-lg border border-rose-300 max-w-[200px] md:max-w-none text-center">
                {activeScenario.right}
              </div>
            </div>

            {/* Predictions */}
            <div className="w-full max-w-sm mt-4 bg-rose-100 border border-rose-200 rounded-xl p-4">
              <h3 className="text-[10px] font-bold text-rose-700 mb-4 uppercase tracking-widest text-center">Mask Predictions</h3>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={context}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3 w-full"
                >
                  {activeScenario.probs.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 w-full group">
                      <div className={`w-16 text-right font-mono font-bold text-sm ${i === 0 ? activeScenario.textColor : 'text-rose-600'}`}>
                        {item.w}
                      </div>
                      <div className="flex-1 h-5 bg-rose-50 rounded-full overflow-hidden border border-rose-200">
                        <motion.div 
                          className={`h-full ${i === 0 ? activeScenario.color : 'bg-rose-300'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.p}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      </div>
                      <div className="w-10 text-right font-mono text-xs text-rose-700">
                        {item.p}%
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
