"use client";

import { useState } from "react";
import { MatrixViz } from "@/components/viz/MatrixViz";
import { Slider } from "@/components/ui/Slider";

export function InteractiveForwardPass() {
  // Input vector (2x1)
  const [x1, setX1] = useState(1.0);
  const [x2, setX2] = useState(-0.5);

  // Weights matrix (3x2) - 3 neurons, 2 inputs
  const [w11, setW11] = useState(0.5);
  const [w12, setW12] = useState(0.2);
  const [w21, setW21] = useState(-0.4);
  const [w22, setW22] = useState(0.8);
  const [w31, setW31] = useState(0.1);
  const [w32, setW32] = useState(-0.5);

  const X = [[x1], [x2]];
  const W = [
    [w11, w12],
    [w21, w22],
    [w31, w32]
  ];

  // Output vector Z = W * X (3x1)
  const z1 = w11 * x1 + w12 * x2;
  const z2 = w21 * x1 + w22 * x2;
  const z3 = w31 * x1 + w32 * x2;
  const Z = [[z1], [z2], [z3]];

  // Activation A = max(0, Z)
  const A = [
    [Math.max(0, z1)],
    [Math.max(0, z2)],
    [Math.max(0, z3)]
  ];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Interactive Forward Pass</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-cyan-400 mb-4">Input Vector (X)</h3>
            <div className="flex flex-col gap-4">
              <Slider label="x₁" min={-2} max={2} step={0.1} value={x1} onChange={setX1} />
              <Slider label="x₂" min={-2} max={2} step={0.1} value={x2} onChange={setX2} />
            </div>
          </div>

          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-violet-400 mb-4">Weights Matrix (W)</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <Slider label="w₁₁" min={-1} max={1} step={0.1} value={w11} onChange={setW11} />
              <Slider label="w₁₂" min={-1} max={1} step={0.1} value={w12} onChange={setW12} />
              <Slider label="w₂₁" min={-1} max={1} step={0.1} value={w21} onChange={setW21} />
              <Slider label="w₂₂" min={-1} max={1} step={0.1} value={w22} onChange={setW22} />
              <Slider label="w₃₁" min={-1} max={1} step={0.1} value={w31} onChange={setW31} />
              <Slider label="w₃₂" min={-1} max={1} step={0.1} value={w32} onChange={setW32} />
            </div>
          </div>

        </div>

        <div className="flex flex-col justify-center items-start md:items-center gap-4 p-4 bg-[#111128] rounded-xl border border-white/[0.08] overflow-x-auto relative w-full min-w-0">
          
          <div className="flex items-center gap-2 sm:gap-4 text-white/90 font-mono w-max md:w-full justify-start md:justify-center px-2">
            <div className="flex flex-col items-center">
              <span className="text-violet-400 mb-2 font-bold">W</span>
              <MatrixViz data={W} color="indigo" />
            </div>
            
            <div className="text-xl text-white/40 font-bold px-1 sm:px-2">×</div>
            
            <div className="flex flex-col items-center">
              <span className="text-cyan-400 mb-2 font-bold">X</span>
              <MatrixViz data={X} color="cyan" />
            </div>

            <div className="text-xl text-white/40 font-bold px-1 sm:px-2">=</div>

            <div className="flex flex-col items-center">
              <span className="text-amber-400 mb-2 font-bold">Z</span>
              <MatrixViz data={Z} color="amber" />
            </div>
          </div>

          <div className="w-full h-px bg-white/[0.06] my-2"></div>

          <div className="flex items-center gap-2 sm:gap-4 text-white/90 font-mono w-max md:w-full justify-start md:justify-center px-2">
            <div className="flex flex-col items-center">
              <span className="text-amber-400 mb-2 font-bold">Z</span>
              <MatrixViz data={Z} color="amber" />
            </div>

            <div className="text-xl text-white/40 font-bold px-1 sm:px-2 whitespace-nowrap">→ ReLU →</div>

            <div className="flex flex-col items-center">
              <span className="text-emerald-400 mb-2 font-bold">A</span>
              <MatrixViz data={A} color="emerald" />
            </div>
          </div>
          
          <div className="text-xs text-white/40 mt-4 text-center">
            Modify X or W on the left to see the linear transformation (Z) and the non-linear activation (A) update instantly.
          </div>
        </div>
      </div>
    </div>
  );
}
