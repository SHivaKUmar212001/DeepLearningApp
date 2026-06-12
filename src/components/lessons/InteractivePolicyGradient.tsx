"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractivePolicyGradient() {
  const [probs, setProbs] = useState({ jump: 33.3, duck: 33.3, run: 33.3 });
  const [lastReward, setLastReward] = useState<{action: string, value: number} | null>(null);
  const [rewardKey, setRewardKey] = useState(0);

  const handleAction = (action: "jump" | "duck" | "run") => {
    // In this environment, Jump is correct (+10), Duck is bad (-10), Run is bad (-10)
    let reward = 0;
    if (action === "jump") reward = 10;
    else reward = -10;

    setLastReward({ action, value: reward });
    setRewardKey(k => k + 1);

    // Policy Gradient Update
    // If reward > 0, increase prob of action, decrease others.
    // If reward < 0, decrease prob of action, increase others.
    
    setProbs((prev) => {
      const newProbs = { ...prev };
      
      const multiplier = reward > 0 ? 1 : -1;
      const change = 15 * multiplier;

      newProbs[action] = Math.max(5, Math.min(90, newProbs[action] + change));
      
      // Re-normalize others
      const remainingProb = 100 - newProbs[action];
      const otherKeys = (Object.keys(prev) as Array<"jump" | "duck" | "run">).filter(k => k !== action);
      
      const otherTotal = prev[otherKeys[0]] + prev[otherKeys[1]];
      
      newProbs[otherKeys[0]] = (prev[otherKeys[0]] / otherTotal) * remainingProb;
      newProbs[otherKeys[1]] = (prev[otherKeys[1]] / otherTotal) * remainingProb;

      // Handle edge cases where otherTotal is 0
      if (isNaN(newProbs[otherKeys[0]])) {
        newProbs[otherKeys[0]] = remainingProb / 2;
        newProbs[otherKeys[1]] = remainingProb / 2;
      }

      return newProbs;
    });
  };

  const handleReset = () => {
    setProbs({ jump: 33.3, duck: 33.3, run: 33.3 });
    setLastReward(null);
  };

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Policy Gradients</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Policy-Based RL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Sample an Action</h3>
              <p className="text-xs text-white/35 mb-2">
                The network outputs a probability distribution. Click an action to sample it and see how the Environment rewards you.
              </p>
              
              <button 
                onClick={() => handleAction("jump")}
                className="py-3 bg-indigo-100 hover:bg-violet-600 border border-indigo-500/50 text-violet-400 hover:text-white/90 font-bold rounded transition-colors"
              >
                Sample: JUMP
              </button>
              <button 
                onClick={() => handleAction("duck")}
                className="py-3 bg-indigo-100 hover:bg-violet-600 border border-indigo-500/50 text-violet-400 hover:text-white/90 font-bold rounded transition-colors"
              >
                Sample: DUCK
              </button>
              <button 
                onClick={() => handleAction("run")}
                className="py-3 bg-indigo-100 hover:bg-violet-600 border border-indigo-500/50 text-violet-400 hover:text-white/90 font-bold rounded transition-colors"
              >
                Sample: RUN
              </button>
            </div>

            <button 
              onClick={handleReset}
              className="text-xs text-white/40 hover:text-white/90 transition-colors underline"
            >
              Reset Network
            </button>
            
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[350px]">
          
          <div className="flex items-center justify-between w-full max-w-lg gap-4">
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">State</span>
              <div className="w-20 h-20 bg-white/[0.04] border-2 border-white/[0.1] rounded-lg flex items-center justify-center text-3xl">
                🧱
              </div>
              <span className="text-xs text-white/35 mt-2">Wall Ahead</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Neural Network</div>
              <div className="w-24 h-16 bg-emerald-50 border-2 border-emerald-500/50 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="text-emerald-400 font-bold tracking-widest">Policy $\pi_\theta$</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-3">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest text-center">Action Probabilities</span>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-10 text-[10px] font-mono text-white/35 text-right">JUMP</span>
                  <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-violet-500" animate={{ width: `${probs.jump}%` }} />
                  </div>
                  <span className="w-10 text-[10px] font-mono text-violet-400 font-bold">{probs.jump.toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="w-10 text-[10px] font-mono text-white/35 text-right">DUCK</span>
                  <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#111128]0" animate={{ width: `${probs.duck}%` }} />
                  </div>
                  <span className="w-10 text-[10px] font-mono text-white/35 font-bold">{probs.duck.toFixed(0)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-10 text-[10px] font-mono text-white/35 text-right">RUN</span>
                  <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-fuchsia-500" animate={{ width: `${probs.run}%` }} />
                  </div>
                  <span className="w-10 text-[10px] font-mono text-fuchsia-600 font-bold">{probs.run.toFixed(0)}%</span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {lastReward && (
                <motion.div 
                  key={rewardKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`px-4 py-2 rounded-full border font-bold text-sm ${lastReward.value > 0 ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400' : 'bg-[#06060e]/50 border-violet-500/40 text-white/35'}`}
                >
                  {lastReward.action.toUpperCase()} received reward: {lastReward.value > 0 ? `+${lastReward.value}` : lastReward.value}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 text-[10px] text-white/40 max-w-sm text-center leading-relaxed">
            Unlike Q-Learning which guesses the exact &quot;Value&quot; of an action, Policy Gradients just tweak the probabilities. If an action gets a positive reward, we mathematically increase the probability of taking it again. If negative, we decrease it.
          </div>

        </div>

      </div>
    </div>
  );
}
