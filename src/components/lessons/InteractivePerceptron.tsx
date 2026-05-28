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
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Perceptron</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <h3 className="text-sm font-medium text-cyan-600 mb-4">Weights & Bias</h3>
            <div className="flex flex-col gap-4">
              <Slider label="Weight 1 (w₁)" min={-3} max={3} step={0.1} value={w1} onChange={setW1} />
              <Slider label="Weight 2 (w₂)" min={-3} max={3} step={0.1} value={w2} onChange={setW2} />
              <div className="mt-2 border-t border-rose-200 pt-4">
                <Slider label="Bias (b)" min={-5} max={5} step={0.5} value={b} onChange={setB} />
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">The Math</h3>
            <div className="text-lg text-rose-950 mb-2">
              <span className="text-cyan-600">y</span> = <span className="text-emerald-600">{w1.toFixed(1)}</span>x₁ + <span className="text-emerald-600">{w2.toFixed(1)}</span>x₂ + <span className="text-purple-400">{b.toFixed(1)}</span>
            </div>
            <p className="text-rose-600 text-xs">
              If y &gt; 0, the neuron fires (Class 1).<br/>
              If y &le; 0, the neuron is silent (Class 0).
            </p>
          </div>

          <div className="text-sm text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 rounded-lg">
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
