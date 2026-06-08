"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function InteractiveRLBasics() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lastReward, setLastReward] = useState<number | null>(null);
  
  // Grid size
  const rows = 3;
  const cols = 3;

  // Goals
  const battery = { x: 2, y: 2 };
  const fire = { x: 1, y: 1 };

  const handleMove = (dx: number, dy: number) => {
    const newX = pos.x + dx;
    const newY = pos.y + dy;

    // Check bounds
    if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
      setLastReward(-1); // Hit wall
      setScore(s => s - 1);
      return;
    }

    setPos({ x: newX, y: newY });

    // Check rewards
    if (newX === battery.x && newY === battery.y) {
      setLastReward(10);
      setScore(s => s + 10);
      // Reset after hitting goal
      setTimeout(() => setPos({ x: 0, y: 0 }), 500);
    } else if (newX === fire.x && newY === fire.y) {
      setLastReward(-10);
      setScore(s => s - 10);
      // Reset after hitting fire
      setTimeout(() => setPos({ x: 0, y: 0 }), 500);
    } else {
      setLastReward(-1); // Step penalty to encourage speed
      setScore(s => s - 1);
    }
  };

  const handleReset = () => {
    setPos({ x: 0, y: 0 });
    setScore(0);
    setLastReward(null);
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">The Reinforcement Learning Loop</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Agent-Environment Interaction
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls / Score */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-6">
            
            <div className="flex justify-between items-center bg-[#111128] p-4 rounded border border-white/[0.08]">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Score</span>
                <span className={`font-mono text-2xl font-bold ${score < 0 ? 'text-white/40' : 'text-emerald-400'}`}>
                  {score}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Last Reward</span>
                <span className="font-mono text-xl font-bold text-white/90">
                  {lastReward !== null ? (lastReward > 0 ? `+${lastReward}` : lastReward) : "-"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Action Space</span>
              <div className="grid grid-cols-3 gap-2 w-48">
                <div />
                <button 
                  onClick={() => handleMove(0, -1)}
                  className="bg-teal-700 hover:bg-teal-600 text-white/90 p-3 rounded shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </button>
                <div />
                <button 
                  onClick={() => handleMove(-1, 0)}
                  className="bg-teal-700 hover:bg-teal-600 text-white/90 p-3 rounded shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  onClick={() => handleMove(0, 1)}
                  className="bg-teal-700 hover:bg-teal-600 text-white/90 p-3 rounded shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </button>
                <button 
                  onClick={() => handleMove(1, 0)}
                  className="bg-teal-700 hover:bg-teal-600 text-white/90 p-3 rounded shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <button 
              onClick={handleReset}
              className="mt-2 text-xs text-white/40 hover:text-white/90 transition-colors underline"
            >
              Reset Environment
            </button>
            
          </div>
        </div>

        {/* Visualizer (Grid World) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[350px] relative">
          
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest absolute top-6">Environment (Grid World)</h3>
          
          <div className="relative w-64 h-64 bg-white/[0.04] border-2 border-white/[0.1] rounded-lg shadow-inner overflow-hidden grid grid-cols-3 grid-rows-3 mt-6">
            
            {/* Grid Cells */}
            {Array.from({ length: 9 }).map((_, i) => {
              const x = i % 3;
              const y = Math.floor(i / 3);
              return (
                <div key={i} className="border border-white/[0.08] flex items-center justify-center">
                  <span className="text-[10px] text-gray-700 font-mono opacity-50">[{x},{y}]</span>
                </div>
              );
            })}

            {/* Battery (+10) */}
            <div className="absolute w-[33.33%] h-[33.33%] flex items-center justify-center" style={{ left: `${battery.x * 33.33}%`, top: `${battery.y * 33.33}%` }}>
              <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">🔋</div>
            </div>

            {/* Fire (-10) */}
            <div className="absolute w-[33.33%] h-[33.33%] flex items-center justify-center" style={{ left: `${fire.x * 33.33}%`, top: `${fire.y * 33.33}%` }}>
              <div className="size-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
            </div>

            {/* Agent */}
            <motion.div 
              className="absolute w-[33.33%] h-[33.33%] flex items-center justify-center z-10"
              animate={{ left: `${pos.x * 33.33}%`, top: `${pos.y * 33.33}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-12 h-12 bg-teal-600 rounded-full border-4 border-white shadow-[0_0_15px_rgba(99,102,241,0.6)] flex items-center justify-center text-white/90 text-xl">
                🤖
              </div>
            </motion.div>

          </div>

          {/* Loop Annotations */}
          <div className="mt-8 text-xs text-white/35 max-w-sm text-center">
            You are the <strong>Agent</strong>. You take an <strong>Action</strong> (move). 
            The <strong>Environment</strong> updates your <strong>State</strong> (coordinates) and returns a <strong>Reward</strong> (-1 per step, -10 for fire, +10 for battery).
          </div>

        </div>

      </div>
    </div>
  );
}
