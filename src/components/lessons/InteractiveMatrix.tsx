"use client";

import { useState } from "react";
import { TransformViz, Matrix2D } from "@/components/viz/TransformViz";
import { Slider } from "@/components/ui/Slider";

export function InteractiveMatrix() {
  const [matrix, setMatrix] = useState<Matrix2D>({ a: 1, b: 0, c: 0, d: 1 });

  const presets = [
    { name: "Identity", m: { a: 1, b: 0, c: 0, d: 1 } },
    { name: "Scale (x2)", m: { a: 2, b: 0, c: 0, d: 2 } },
    { name: "Shear X", m: { a: 1, b: 1, c: 0, d: 1 } },
    { name: "Rotation 90°", m: { a: 0, b: -1, c: 1, d: 0 } },
    { name: "Reflection X", m: { a: 1, b: 0, c: 0, d: -1 } },
    { name: "Collapse (Det = 0)", m: { a: 1, b: 1, c: 1, d: 1 } },
  ];

  // Determinant: ad - bc
  const det = matrix.a * matrix.d - matrix.b * matrix.c;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Transformations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <h3 className="text-sm font-medium text-cyan-600 mb-4">Basis Vector î (Column 1)</h3>
            <div className="flex flex-col gap-4">
              <Slider label="X (a)" min={-3} max={3} step={0.1} value={matrix.a} onChange={(a) => setMatrix({ ...matrix, a })} />
              <Slider label="Y (c)" min={-3} max={3} step={0.1} value={matrix.c} onChange={(c) => setMatrix({ ...matrix, c })} />
            </div>
          </div>

          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <h3 className="text-sm font-medium text-amber-600 mb-4">Basis Vector ĵ (Column 2)</h3>
            <div className="flex flex-col gap-4">
              <Slider label="X (b)" min={-3} max={3} step={0.1} value={matrix.b} onChange={(b) => setMatrix({ ...matrix, b })} />
              <Slider label="Y (d)" min={-3} max={3} step={0.1} value={matrix.d} onChange={(d) => setMatrix({ ...matrix, d })} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-rose-800">Presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => setMatrix(p.m)}
                  className="px-3 py-1.5 bg-rose-200 border border-rose-300 hover:bg-rose-300 hover:text-rose-950 text-rose-800 text-xs rounded transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <TransformViz matrix={matrix} />

          {/* Readout Panel */}
          <div className="bg-rose-50 rounded-xl border border-rose-200 p-4 font-mono text-sm">
            <div className="flex flex-col">
              <span className="text-rose-700 mb-1">Determinant (ad - bc)</span>
              <span className={`text-xl font-bold ${Math.abs(det) < 0.01 ? "text-red-400" : det < 0 ? "text-amber-600" : "text-emerald-600"}`}>
                {det.toFixed(2)}
              </span>
              {Math.abs(det) < 0.01 && (
                <span className="text-xs text-red-500 mt-1">Warning: Space has collapsed into a lower dimension!</span>
              )}
              {det < 0 && (
                <span className="text-xs text-amber-500 mt-1">Space has been flipped (orientation reversed).</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
