"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveActorCritic() {
  const [probs, setProbs] = useState({ knight: 33.3, pawn: 33.3, queen: 33.3 });
  const [criticScore, setCriticScore] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAction = (action: "knight" | "pawn" | "queen") => {
    if (isUpdating) return;
    setIsUpdating(true);
    setActiveAction(action);

    // Simulated Critic Evaluation (Advantage)
    let advantage = 0;
    if (action === "knight") advantage = 2.5; // Good move
    else if (action === "pawn") advantage = 0.5; // Okay move
    else advantage = -3.0; // Blunder

    setTimeout(() => {
      setCriticScore(advantage);

      // Actor Update based on Critic
      setTimeout(() => {
        setProbs((prev) => {
          const newProbs = { ...prev };
          const change = advantage * 5; // Scaling factor
          
          newProbs[action] = Math.max(5, Math.min(90, newProbs[action] + change));
          
          const remainingProb = 100 - newProbs[action];
          const otherKeys = (Object.keys(prev) as Array<"knight" | "pawn" | "queen">).filter(k => k !== action);
          const otherTotal = prev[otherKeys[0]] + prev[otherKeys[1]];
          
          newProbs[otherKeys[0]] = (prev[otherKeys[0]] / otherTotal) * remainingProb;
          newProbs[otherKeys[1]] = (prev[otherKeys[1]] / otherTotal) * remainingProb;

          return newProbs;
        });

        setTimeout(() => {
          setCriticScore(null);
          setActiveAction(null);
          setIsUpdating(false);
        }, 1500);

      }, 1000);
    }, 500);
  };

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Actor-Critic Architecture</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Hybrid RL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            
            <div className="text-sm font-medium text-cyan-400">Actor: Choose a Move</div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleAction("knight")}
                disabled={isUpdating}
                className="py-2 bg-indigo-100 hover:bg-violet-600 disabled:opacity-50 border border-indigo-500/50 text-violet-400 hover:text-white/90 font-bold rounded transition-colors"
              >
                Move Knight ♞
              </button>
              <button 
                onClick={() => handleAction("pawn")}
                disabled={isUpdating}
                className="py-2 bg-indigo-100 hover:bg-violet-600 disabled:opacity-50 border border-indigo-500/50 text-violet-400 hover:text-white/90 font-bold rounded transition-colors"
              >
                Move Pawn ♟
              </button>
              <button 
                onClick={() => handleAction("queen")}
                disabled={isUpdating}
                className="py-2 bg-indigo-100 hover:bg-violet-600 disabled:opacity-50 border border-indigo-500/50 text-violet-400 hover:text-white/90 font-bold rounded transition-colors"
              >
                Move Queen ♛
              </button>
            </div>
            
            <div className="text-xs text-white/40 mt-2 leading-relaxed">
              When the Actor makes a move, it doesn&apos;t have to wait until the end of the game for a reward. The Critic instantly evaluates the board and provides an &quot;Advantage&quot; score to update the Actor immediately.
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[350px]">
          
          <div className="relative w-full max-w-lg flex flex-col gap-12">
            
            {/* Top Row: State & Critic */}
            <div className="flex justify-between items-center w-full">
              
              <div className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">State</span>
                <div className="w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjIyIi8+PHJlY3QgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzQ0NCIvPjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiM0NDQiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzIyMiIvPjwvc3ZnPg==')] border-2 border-white/[0.1] rounded shadow-lg flex items-center justify-center text-3xl">
                  {activeAction === "knight" && "♞"}
                  {activeAction === "pawn" && "♟"}
                  {activeAction === "queen" && "♛"}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Critic Network (Value)</div>
                <div className="w-32 h-20 bg-[#111128] border-2 border-violet-500/40 rounded-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                  <span className="text-white/35 font-bold tracking-widest">Evaluate</span>
                  <AnimatePresence>
                    {criticScore !== null && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-sm font-mono font-bold ${criticScore > 0 ? 'text-emerald-400' : 'text-white/40'}`}
                      >
                        Advantage: {criticScore > 0 ? '+' : ''}{criticScore}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Bottom Row: Actor */}
            <div className="flex flex-col items-center w-full pt-8 border-t border-white/[0.08] relative">
              
              {/* Feedback Arrow from Critic to Actor */}
              {criticScore !== null && (
                <motion.svg 
                  className="absolute right-1/4 top-0 -translate-y-full w-8 h-24 text-white/40 z-10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <path d="M 16 0 L 16 80 L 12 70 M 16 80 L 20 70" fill="none" stroke="currentColor" strokeWidth="2" />
                </motion.svg>
              )}

              <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Actor Network (Policy)</div>
              
              <div className="w-full flex justify-around">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-4 bg-white/[0.04] rounded-full flex items-end overflow-hidden border border-white/[0.08]">
                    <motion.div className="w-full bg-violet-500" animate={{ height: `${probs.knight}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Knight</span>
                  <span className="text-xs font-bold text-violet-400">{probs.knight.toFixed(1)}%</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-4 bg-white/[0.04] rounded-full flex items-end overflow-hidden border border-white/[0.08]">
                    <motion.div className="w-full bg-violet-500" animate={{ height: `${probs.pawn}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Pawn</span>
                  <span className="text-xs font-bold text-violet-400">{probs.pawn.toFixed(1)}%</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-4 bg-white/[0.04] rounded-full flex items-end overflow-hidden border border-white/[0.08]">
                    <motion.div className="w-full bg-violet-500" animate={{ height: `${probs.queen}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Queen</span>
                  <span className="text-xs font-bold text-violet-400">{probs.queen.toFixed(1)}%</span>
                </div>
              </div>

            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}
