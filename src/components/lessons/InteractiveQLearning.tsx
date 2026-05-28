"use client";

import { useState, useEffect } from "react";
import { PlayControl } from "@/components/ui/PlayControl";
import { motion } from "framer-motion";

export function InteractiveQLearning() {
  const numStates = 5;
  const [agentState, setAgentState] = useState(0);
  
  // Q-Table: Array of 5 states, each with { L: value, R: value }
  const [qTable, setQTable] = useState(
    Array.from({ length: numStates }).map(() => ({ L: 0, R: 0 }))
  );
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [episode, setEpisode] = useState(1);
  const [lastAction, setLastAction] = useState<"L" | "R" | null>(null);

  // Hyperparameters
  const alpha = 0.5; // Learning Rate
  const gamma = 0.9; // Discount Factor

  const handleStep = () => {
    // Determine action (Epsilon-Greedy: mostly exploit, sometimes explore)
    // Since we want them to learn, we'll force some exploration if Q values are 0
    let action: "L" | "R";
    
    if (qTable[agentState].L === 0 && qTable[agentState].R === 0) {
      // Explore randomly
      action = Math.random() > 0.5 ? "L" : "R";
    } else {
      // Exploit best action
      action = qTable[agentState].R > qTable[agentState].L ? "R" : "L";
      // Add a tiny bit of random exploration (epsilon)
      if (Math.random() < 0.2) {
        action = action === "L" ? "R" : "L";
      }
    }

    setLastAction(action);

    // Execute action
    let nextState = agentState;
    if (action === "L") nextState = Math.max(0, agentState - 1);
    if (action === "R") nextState = Math.min(numStates - 1, agentState + 1);

    // Get Reward
    let reward = 0;
    let isTerminal = false;

    if (nextState === numStates - 1) {
      reward = 10; // Reached goal
      isTerminal = true;
    } else {
      reward = -1; // Step penalty
    }

    // Bellman Equation to update Q-Table
    const maxFutureQ = Math.max(qTable[nextState].L, qTable[nextState].R);
    const currentQ = qTable[agentState][action];
    const newQ = currentQ + alpha * (reward + gamma * maxFutureQ - currentQ);

    setQTable((prev) => {
      const newTable = [...prev];
      newTable[agentState] = { ...newTable[agentState], [action]: newQ };
      return newTable;
    });

    if (isTerminal) {
      // Reset for next episode
      setTimeout(() => {
        setAgentState(0);
        setEpisode((e) => e + 1);
        setLastAction(null);
      }, 500);
    } else {
      setAgentState(nextState);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      handleStep();
    }, 200);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, agentState, qTable]); // Dependencies are important for the loop

  const handleReset = () => {
    setIsPlaying(false);
    setAgentState(0);
    setEpisode(1);
    setLastAction(null);
    setQTable(Array.from({ length: numStates }).map(() => ({ L: 0, R: 0 })));
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Q-Learning</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Value-Based RL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-12 flex justify-between items-center bg-white/[0.04] p-4 rounded-lg border border-white/[0.08]">
          <PlayControl 
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onReset={handleReset}
          />
          
          <div className="flex gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Episode</span>
              <span className="font-mono font-bold text-white/90 text-lg">{episode}</span>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-12 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[400px]">
          
          <div className="w-full flex flex-col md:flex-row items-start justify-center gap-12 max-w-4xl">
            
            {/* Environment */}
            <div className="flex flex-col gap-6 flex-1">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">Environment (1D Grid)</h3>
              
              <div className="flex bg-white/[0.04] border-2 border-white/[0.1] rounded-lg overflow-hidden h-24">
                {Array.from({ length: numStates }).map((_, i) => (
                  <div key={i} className={`flex-1 border-r border-white/[0.1] last:border-r-0 flex items-center justify-center relative ${i === numStates - 1 ? 'bg-emerald-50' : ''}`}>
                    <span className="absolute top-2 text-[10px] text-white/35 font-mono">S{i}</span>
                    
                    {i === numStates - 1 && (
                      <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">🔋</span>
                    )}

                    {agentState === i && (
                      <motion.div 
                        layoutId="agent"
                        className="w-10 h-10 bg-violet-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(99,102,241,0.6)] flex items-center justify-center text-white/90 z-10"
                      >
                        🤖
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Last Action</span>
                <div className="flex gap-4">
                  <div className={`px-4 py-2 rounded font-bold ${lastAction === "L" ? 'bg-violet-600 text-white/90' : 'bg-white/[0.06] text-white/40'}`}>LEFT</div>
                  <div className={`px-4 py-2 rounded font-bold ${lastAction === "R" ? 'bg-violet-600 text-white/90' : 'bg-white/[0.06] text-white/40'}`}>RIGHT</div>
                </div>
              </div>
            </div>

            {/* Q-Table */}
            <div className="flex flex-col gap-6 flex-1">
              <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest text-center">The Q-Table</h3>
              
              <div className="bg-white/[0.04] border border-white/[0.1] rounded-lg overflow-hidden">
                <table className="w-full text-center">
                  <thead>
                    <tr className="bg-[#111128] border-b border-white/[0.1]">
                      <th className="py-2 text-[10px] uppercase text-white/40 font-mono">State</th>
                      <th className="py-2 text-[10px] uppercase text-white/40 font-mono">Q(L)</th>
                      <th className="py-2 text-[10px] uppercase text-white/40 font-mono">Q(R)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qTable.map((row, i) => (
                      <tr key={i} className={`border-b border-white/[0.08] last:border-0 ${agentState === i ? 'bg-indigo-50' : ''}`}>
                        <td className={`py-2 font-mono text-sm ${agentState === i ? 'text-violet-400 font-bold' : 'text-white/35'}`}>S{i}</td>
                        <td className={`py-2 font-mono text-sm ${row.L > 0 ? 'text-emerald-400 font-bold' : row.L < 0 ? 'text-white/35' : 'text-white/35'}`}>
                          {row.L.toFixed(2)}
                        </td>
                        <td className={`py-2 font-mono text-sm ${row.R > 0 ? 'text-emerald-400 font-bold' : row.R < 0 ? 'text-white/35' : 'text-white/35'}`}>
                          {row.R.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div className="mt-12 w-full max-w-4xl p-4 bg-[#0d0d20]/50 border border-white/[0.08] rounded-lg text-sm text-white/35 leading-relaxed text-center">
            When the Agent hits the battery, the Q-Value for S3-&gt;RIGHT becomes highly positive. 
            In the next episode, when the Agent is in S2, the Bellman Equation allows it to &quot;look ahead&quot; and see that S3 is valuable, so the Q-Value for S2-&gt;RIGHT increases. Over time, the reward propagates backwards to S0!
          </div>
          
        </div>

      </div>
    </div>
  );
}
