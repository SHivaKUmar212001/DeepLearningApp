"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveLoss() {
  const [trueLabel, setTrueLabel] = useState(1); // 0 or 1
  const [prediction, setPrediction] = useState(0.8);

  const safePrediction = Math.max(0.001, Math.min(0.999, prediction));

  const mse = Math.pow(trueLabel - prediction, 2);
  const ce = -(trueLabel * Math.log(safePrediction) + (1 - trueLabel) * Math.log(1 - safePrediction));

  // Plot data
  const width = 400;
  const height = 250;
  
  const generateCurve = (lossFunc: (p: number) => number, maxLoss: number) => {
    const points = [];
    for (let p = 0.001; p <= 0.999; p += 0.01) {
      const x = p * width;
      const y = height - (Math.min(maxLoss, lossFunc(p)) / maxLoss) * height;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  const mseMax = 1.0;
  const ceMax = 5.0; // clamp for viz

  const mseCurve = generateCurve(p => Math.pow(trueLabel - p, 2), mseMax);
  const ceCurve = generateCurve(p => -(trueLabel * Math.log(p) + (1 - trueLabel) * Math.log(1 - p)), ceMax);

  const currentX = prediction * width;
  const currentMseY = height - (Math.min(mseMax, mse) / mseMax) * height;
  const currentCeY = height - (Math.min(ceMax, ce) / ceMax) * height;

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Loss Functions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-emerald-400 mb-4">Ground Truth (y)</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setTrueLabel(0)}
                className={`flex-1 py-2 rounded font-bold transition-colors ${trueLabel === 0 ? "bg-emerald-500 text-white/90" : "bg-white/[0.06] text-white/35 border border-white/[0.1]"}`}
              >
                y = 0 (False)
              </button>
              <button 
                onClick={() => setTrueLabel(1)}
                className={`flex-1 py-2 rounded font-bold transition-colors ${trueLabel === 1 ? "bg-emerald-500 text-white/90" : "bg-white/[0.06] text-white/35 border border-white/[0.1]"}`}
              >
                y = 1 (True)
              </button>
            </div>
          </div>

          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-cyan-400 mb-4">Prediction (ŷ)</h3>
            <Slider label="Predicted Probability" min={0} max={1} step={0.01} value={prediction} onChange={setPrediction} />
          </div>

          <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-5 font-mono text-sm grid grid-cols-2 gap-4">
            <div className="flex flex-col border-r border-white/[0.08] pr-4">
              <span className="text-white/40 mb-1 text-xs">MSE Loss</span>
              <span className="text-2xl font-bold text-amber-400">{mse.toFixed(4)}</span>
              <span className="text-xs text-white/35 mt-2">Maxes out at 1.0</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 mb-1 text-xs">Cross-Entropy Loss</span>
              <span className="text-2xl font-bold text-white/40">{ce.toFixed(4)}</span>
              <span className="text-xs text-white/35 mt-2">Explodes to infinity!</span>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full aspect-video bg-[#111128] rounded-xl border border-white/[0.08] overflow-hidden relative p-4">
            <svg viewBox={`-55 -15 ${width + 75} ${height + 60}`} className="w-full h-full">
              {/* Axes */}
              <line x1={0} y1={height} x2={width} y2={height} stroke="#4b5563" strokeWidth={2} />
              <line x1={0} y1={0} x2={0} y2={height} stroke="#4b5563" strokeWidth={2} />
              
              {/* X-axis labels */}
              <text x={0} y={height + 20} fill="#6b7280" fontSize="12" textAnchor="middle">0.0</text>
              <text x={width/2} y={height + 20} fill="#6b7280" fontSize="12" textAnchor="middle">0.5</text>
              <text x={width} y={height + 20} fill="#6b7280" fontSize="12" textAnchor="middle">1.0</text>
              <text x={width/2} y={height + 35} fill="#9ca3af" fontSize="12" textAnchor="middle">Prediction (ŷ)</text>

              {/* Y-axis labels */}
              <text x={-10} y={height} fill="#6b7280" fontSize="12" textAnchor="end" alignmentBaseline="middle">0</text>
              <text x={-10} y={0} fill="#6b7280" fontSize="12" textAnchor="end" alignmentBaseline="middle">Max</text>
              <text x={-30} y={height/2} fill="#9ca3af" fontSize="12" textAnchor="middle" transform={`rotate(-90, -30, ${height/2})`}>Loss Penalty</text>

              {/* MSE Curve */}
              <path d={mseCurve} fill="none" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5,5" />
              
              {/* Cross-Entropy Curve */}
              <path d={ceCurve} fill="none" stroke="#f43f5e" strokeWidth={3} />

              {/* Current Points */}
              <line x1={currentX} y1={height} x2={currentX} y2={Math.min(currentCeY, currentMseY)} stroke="#06b6d4" strokeWidth={2} strokeDasharray="4,4" />
              
              <circle cx={currentX} cy={currentMseY} r={6} fill="#f59e0b" />
              <circle cx={currentX} cy={currentCeY} r={6} fill="#f43f5e" />
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-[#0d0d20]/80 p-2 rounded border border-white/[0.1] text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 border-b-2 border-violet-500/40"></div>
                <span className="text-white/60">Cross-Entropy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 border-b-2 border-amber-500 border-dashed"></div>
                <span className="text-white/60">MSE</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-violet-400 bg-violet-500/10 border border-violet-500/20 px-4 py-3 rounded-lg">
            <strong>Observation:</strong> Move the prediction to the totally wrong answer (e.g., predict 0.0 when truth is 1.0). Notice how MSE barely penalizes the model (loss = 1), but Cross-Entropy fiercely penalizes it (loss rockets to infinity). This makes the model learn much faster when it is confidently wrong!
          </div>
        </div>
      </div>
    </div>
  );
}
