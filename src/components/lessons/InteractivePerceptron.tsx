"use client";

import { useState } from "react";
import { PerceptronViz } from "@/components/viz/PerceptronViz";
import { Slider } from "@/components/ui/Slider";

// Generate some linearly separable points
const dataset = [
  // Class 1 (Cyan / Positive)
  { x: 1, y: 3, label: 1 },
  { x: 2, y: 2, label: 1 },
  { x: 3, y: 4, label: 1 },
  { x: 4, y: 1, label: 1 },
  { x: 3, y: 2, label: 1 },
  { x: 1.5, y: 4, label: 1 },
  
  // Class 0 (Amber / Negative)
  { x: -1, y: -2, label: 0 },
  { x: -3, y: -1, label: 0 },
  { x: -2, y: -3, label: 0 },
  { x: 0, y: -4, label: 0 },
  { x: -4, y: 1, label: 0 },
  { x: -2, y: 0.5, label: 0 },
];

export function InteractivePerceptron() {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(-1);
  const [b, setB] = useState(0);

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Interactive Perceptron</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-cyan-400 mb-4">Weights & Bias</h3>
            <div className="flex flex-col gap-4">
              <Slider label="Weight 1 (w₁)" min={-3} max={3} step={0.1} value={w1} onChange={setW1} />
              <Slider label="Weight 2 (w₂)" min={-3} max={3} step={0.1} value={w2} onChange={setW2} />
              <div className="mt-2 border-t border-white/[0.08] pt-4">
                <Slider label="Bias (b)" min={-5} max={5} step={0.5} value={b} onChange={setB} />
              </div>
            </div>
          </div>

          <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-white/40 font-semibold mb-3 tracking-wider">The Math</h3>
            <div className="text-lg text-white/90 mb-2">
              <span className="text-cyan-400">y</span> = <span className="text-emerald-400">{w1.toFixed(1)}</span>x₁ + <span className="text-emerald-400">{w2.toFixed(1)}</span>x₂ + <span className="text-purple-400">{b.toFixed(1)}</span>
            </div>
            <p className="text-white/35 text-xs">
              If y &gt; 0, the neuron fires (Class 1).<br/>
              If y &le; 0, the neuron is silent (Class 0).
            </p>
          </div>

          <div className="text-sm text-teal-400 bg-teal-600/10 border border-teal-600/20 px-4 py-3 rounded-lg">
            <strong>Goal:</strong> Adjust $w_1$, $w_2$, and $b$ until the dashed boundary perfectly separates the blue dots from the orange dots, achieving 100% accuracy.
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <PerceptronViz w1={w1} w2={w2} b={b} points={dataset} />
        </div>
      </div>
    </div>
  );
}
