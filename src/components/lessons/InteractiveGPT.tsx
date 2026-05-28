"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveGPT() {
  const [tokens, setTokens] = useState(["The", "quick", "brown"]);
  const [isGenerating, setIsGenerating] = useState(false);

  const sequence = [
    { word: "fox", probs: [{w: "fox", p: 85}, {w: "dog", p: 10}, {w: "bear", p: 5}] },
    { word: "jumps", probs: [{w: "jumps", p: 70}, {w: "runs", p: 20}, {w: "sleeps", p: 10}] },
    { word: "over", probs: [{w: "over", p: 90}, {w: "around", p: 5}, {w: "through", p: 5}] },
    { word: "the", probs: [{w: "the", p: 95}, {w: "a", p: 4}, {w: "my", p: 1}] },
    { word: "lazy", probs: [{w: "lazy", p: 60}, {w: "fence", p: 30}, {w: "tall", p: 10}] },
    { word: "dog", probs: [{w: "dog", p: 99}, {w: "cat", p: 0.9}, {w: "log", p: 0.1}] },
    { word: "<END>", probs: [{w: "<END>", p: 98}, {w: ".", p: 1.5}, {w: "and", p: 0.5}] },
  ];

  const currentStep = tokens.length - 3;
  const isFinished = currentStep >= sequence.length;
  
  const currentProbs = isFinished ? null : sequence[currentStep].probs;

  const handleGenerate = () => {
    if (isFinished || isGenerating) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      setTokens([...tokens, sequence[currentStep].word]);
      setIsGenerating(false);
    }, 800);
  };

  const handleReset = () => {
    setTokens(["The", "quick", "brown"]);
    setIsGenerating(false);
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Auto-Regressive Generation</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Decoder-Only Architecture
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls & Context */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-600 flex justify-between">
              <span>Context Window (Input)</span>
              <span className="text-rose-700 font-mono text-xs">{tokens.length} tokens</span>
            </h3>
            
            <div className="flex flex-wrap gap-2 min-h-[100px] content-start bg-rose-50 p-4 rounded border border-rose-200">
              <AnimatePresence>
                {tokens.map((token, i) => {
                  const isPrompt = i < 3;
                  return (
                    <motion.div
                      key={`${i}-${token}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-3 py-1.5 rounded font-mono text-sm font-bold shadow-md
                        ${isPrompt ? 'bg-indigo-100 text-indigo-600 border border-indigo-500/50' : 'bg-emerald-100 text-emerald-300 border border-emerald-500/50'}`}
                    >
                      {token}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-4 mt-2">
              <button 
                onClick={handleGenerate}
                disabled={isFinished || isGenerating}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-rose-200 disabled:text-rose-600 text-rose-950 font-bold rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
              >
                {isGenerating ? "Predicting..." : isFinished ? "Generation Complete" : "Generate Next Token"}
              </button>
              
              <button 
                onClick={handleReset}
                className="px-6 py-3 bg-rose-200 hover:bg-rose-300 text-rose-800 font-bold rounded-lg transition-colors border border-rose-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Visualizer (Probabilities) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-6">
          
          <div className="w-full">
            <h3 className="text-[10px] font-bold text-rose-700 mb-6 uppercase tracking-widest text-center">Output Probabilities (Softmax)</h3>

            <div className="flex flex-col gap-4 min-h-[200px] justify-center">
              {isFinished ? (
                <div className="text-center font-bold text-rose-700 uppercase tracking-widest">
                  End of Sequence Reached
                </div>
              ) : currentProbs ? (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    {currentProbs.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 w-full group">
                        <div className="w-20 text-right font-mono font-bold text-sm text-rose-800 group-hover:text-rose-950 transition-colors">
                          {item.w}
                        </div>
                        <div className="flex-1 h-6 bg-rose-100 rounded-full overflow-hidden border border-rose-200">
                          <motion.div 
                            className={`h-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.p}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          />
                        </div>
                        <div className="w-12 text-right font-mono text-xs text-rose-700">
                          {item.p.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </div>

            <div className="mt-8 pt-6 border-t border-rose-200 text-xs text-rose-600 text-center leading-relaxed">
              The model takes the entire context window, calculates probabilities for the next word, and samples the highest one. It then <strong>appends</strong> that word to the context window and loops!
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}
