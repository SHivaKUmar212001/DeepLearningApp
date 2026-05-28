"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveLearningRates() {
  const [baseLr, setBaseLr] = useState(0.1);
  const [schedule, setSchedule] = useState("constant");

  const { lrData, lossData } = useMemo(() => {
    const totalEpochs = 100;
    let loss = 10;
    const lrHistory = [];
    const lossHistory = [];

    // Seeded random for deterministic noise
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let e = 0; e <= totalEpochs; e++) {
      let lr = baseLr;
      
      if (schedule === "constant") {
        lr = baseLr;
      } else if (schedule === "step") {
        lr = baseLr * Math.pow(0.5, Math.floor(e / 20));
      } else if (schedule === "exponential") {
        lr = baseLr * Math.exp(-0.05 * e);
      } else if (schedule === "cosine") {
        lr = baseLr * 0.5 * (1 + Math.cos((e / totalEpochs) * Math.PI));
      }
      
      lrHistory.push({ x: e, y: lr });
      lossHistory.push({ x: e, y: loss });
      
      // Simulation of loss:
      const noise = (Math.sin(e * 1.5) * 0.1 + (pseudoRandom(e) - 0.5) * 0.2);
      
      if (lr > 0.15) {
        // Diverge
        loss = loss + (lr * 1.5) + noise;
      } else {
        // Converge but with a plateau
        if (loss > 2) {
          // Free fall phase
          loss = loss - lr * 5 + noise * lr;
        } else {
          // Plateau phase: only small LR can penetrate
          if (lr < 0.03) {
            loss = loss - lr * 10 + noise * 0.1;
          } else {
            // Bouncing around the plateau
            loss = loss + noise * lr * 10;
          }
        }
      }
      loss = Math.max(0.1, Math.min(20, loss));
    }

    return { lrData: lrHistory, lossData: lossHistory };
  }, [baseLr, schedule]);

  // Chart rendering helpers
  const renderLine = (data: {x: number, y: number}[], color: string, maxY: number) => {
    const width = 300;
    const height = 150;
    
    const points = data.map(d => {
      const px = (d.x / 100) * width;
      const py = height - (d.y / maxY) * height;
      return `${px},${py}`;
    }).join(" ");

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid */}
        <line x1="0" y1={height} x2={width} y2={height} stroke="#374151" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2={height} stroke="#374151" strokeWidth="1" />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="my-8 p-6 bg-white border border-rose-200 rounded-xl shadow-xl flex flex-col gap-8">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Learning Rate Schedules</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <h3 className="text-sm font-medium text-rose-800 mb-4">Training Configuration</h3>
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-rose-700">Schedule Type</label>
                <select 
                  className="bg-rose-200 border border-rose-300 text-rose-950 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <option value="constant">Constant LR</option>
                  <option value="step">Step Decay (Halve every 20 epochs)</option>
                  <option value="exponential">Exponential Decay</option>
                  <option value="cosine">Cosine Annealing</option>
                </select>
              </div>

              <Slider 
                label="Base Learning Rate" 
                min={0.01} max={0.2} step={0.01} 
                value={baseLr} onChange={setBaseLr} 
              />
              
              <p className="text-xs text-rose-600 leading-relaxed">
                If the learning rate is too high (&gt;0.15), the model will diverge. If it is constant, it might get stuck bouncing around a plateau. Watch how schedules help the model settle into the minimum!
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-6">
          
          {/* LR Chart */}
          <div className="bg-rose-50 rounded-xl border border-rose-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Learning Rate vs Epoch</span>
              <span className="text-xs text-rose-700 font-mono">Max: 0.20</span>
            </div>
            <div className="h-32 w-full pt-2 pr-2">
              {renderLine(lrData, "#22d3ee", 0.2)}
            </div>
          </div>

          {/* Loss Chart */}
          <div className="bg-rose-50 rounded-xl border border-rose-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Loss vs Epoch</span>
              <span className="text-xs text-rose-700 font-mono">Max: 20.0</span>
            </div>
            <div className="h-32 w-full pt-2 pr-2">
              {renderLine(lossData, "#f59e0b", 20)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
