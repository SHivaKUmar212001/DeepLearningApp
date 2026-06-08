"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveVanishingTime() {
  const [weight, setWeight] = useState(0.5);

  const sentence = "I grew up in France and lived there for fifteen years so I speak fluent ______".split(" ");
  const targetIndex = sentence.length - 1;
  const sourceIndex = 4; // "France"

  // Calculate the backpropagated gradient signal from the end
  const getGradient = (step: number) => {
    const distance = targetIndex - step;
    if (distance < 0) return 0;
    
    // Gradient is roughly proportional to w^distance
    // We scale it so w=1 is 100%
    const signal = Math.pow(weight, distance);
    return Math.min(100, signal * 100);
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Vanishing Gradients in Time</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Recurrent Weight (W<sub>hh</sub>)</h3>
            
            <div className="flex flex-col gap-2">
              <Slider 
                label="Weight Value"
                value={weight} 
                min={0.1} max={1.5} step={0.1}
                onChange={(val) => setWeight(val)} 
              />
              <p className="text-xs text-white/40 mt-2">
                During Backpropagation Through Time (BPTT), the gradient is multiplied by the recurrent weight W<sub>hh</sub> at every single time step.
              </p>
            </div>

            <div className="mt-2 bg-[#111128] p-3 rounded border border-white/[0.08] text-xs text-white/35 leading-relaxed">
              If W<sub>hh</sub> &lt; 1, the gradient decays exponentially. <br/><br/>
              If W<sub>hh</sub> &gt; 1, the gradient explodes to infinity!
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 overflow-hidden">
          
          <div className="w-full max-w-2xl">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider font-bold mb-6 text-center">
              Gradient Signal Reaching Step t
            </h3>

            <div className="flex items-end justify-between h-48 border-b border-white/[0.1] relative w-full px-2">
              
              {/* Target connection arc */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path 
                  d={`M ${(sourceIndex / (sentence.length - 1)) * 100}% 100 Q 50% -20, 100% 100`} 
                  fill="none" 
                  stroke="rgba(99, 102, 241, 0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="4,4"
                />
              </svg>

              {/* Exploding warning */}
              {weight > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-red-500 font-bold font-mono text-sm uppercase animate-pulse bg-red-950/50 px-4 py-1 rounded-full border border-red-500/50">
                  Gradient Exploding! (Overflow)
                </div>
              )}

              {sentence.map((word, i) => {
                const grad = getGradient(i);
                const isSource = i === sourceIndex;
                const isTarget = i === targetIndex;
                
                let barColor = "bg-violet-500";
                if (weight > 1) barColor = "bg-red-500";
                else if (grad < 1) barColor = "bg-white/[0.08]";

                return (
                  <div key={i} className="flex flex-col items-center relative w-full group">
                    {/* Gradient Bar */}
                    <div 
                      className={`w-full max-w-[12px] rounded-t transition-all duration-300 ${barColor}`}
                      style={{ 
                        height: weight > 1 ? (grad > 100 ? '100%' : `${grad}%`) : `${grad}%`,
                        opacity: weight > 1 ? 1 : Math.max(0.2, grad / 100)
                      }}
                    />
                    
                    {/* Value Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/[0.04] border border-white/[0.1] text-xs font-mono px-2 py-1 rounded text-white/90 z-10 pointer-events-none">
                      {weight > 1 && grad > 100 ? "∞" : `${grad.toFixed(1)}%`}
                    </div>

                    {/* Word Label */}
                    <div className="absolute top-full mt-2 w-full flex justify-center">
                      <span className={`text-[10px] font-mono whitespace-nowrap origin-top-left -rotate-45 translate-y-2
                        ${isSource ? 'text-violet-400 font-bold' : isTarget ? 'text-emerald-400 font-bold' : 'text-white/40'}`}
                      >
                        {word}
                      </span>
                    </div>

                    {/* Annotations */}
                    {isSource && (
                      <div className="absolute top-full mt-12 text-[10px] font-bold text-violet-400 whitespace-nowrap hidden md:block">
                        Long-Term<br/>Dependency
                      </div>
                    )}
                    {isTarget && (
                      <div className="absolute top-full mt-12 text-[10px] font-bold text-emerald-400 whitespace-nowrap hidden md:block text-right">
                        Prediction<br/>Made Here
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-20 text-center space-y-2">
              <p className="text-sm font-medium text-white/60">
                Signal at &quot;France&quot;: <span className={`font-mono font-bold ${getGradient(sourceIndex) < 1 ? 'text-red-400' : 'text-violet-400'}`}>
                  {weight > 1 ? "∞" : `${getGradient(sourceIndex).toFixed(4)}%`}
                </span>
              </p>
              <p className="text-xs text-white/40">
                {getGradient(sourceIndex) < 1 ? 
                  "The network has completely forgotten 'France' by the time it reaches the end." : 
                  weight > 1 ? "The math overflows and breaks the network." : "The signal survives!"}
              </p>
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}
