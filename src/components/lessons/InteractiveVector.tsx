"use client";

import { useState } from "react";
import { VectorViz, Vector2D } from "@/components/viz/VectorViz";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";

export function InteractiveVector() {
  const [v1, setV1] = useState<Vector2D>({ x: 3, y: 4 });
  const [v2, setV2] = useState<Vector2D>({ x: 5, y: -2 });
  const [showAddition, setShowAddition] = useState(false);
  const [showProjection, setShowProjection] = useState(true);

  // Math
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  const cosTheta = dotProduct / (mag1 * mag2);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
  const angleDeg = (angleRad * 180) / Math.PI;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Interactive Vectors</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-cyan-400 mb-4">Vector 1 (v₁)</h3>
            <div className="flex flex-col gap-4">
              <Slider label="X Coordinate" min={-10} max={10} step={0.5} value={v1.x} onChange={(x) => setV1({ ...v1, x })} />
              <Slider label="Y Coordinate" min={-10} max={10} step={0.5} value={v1.y} onChange={(y) => setV1({ ...v1, y })} />
            </div>
          </div>

          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-amber-400 mb-4">Vector 2 (v₂)</h3>
            <div className="flex flex-col gap-4">
              <Slider label="X Coordinate" min={-10} max={10} step={0.5} value={v2.x} onChange={(x) => setV2({ ...v2, x })} />
              <Slider label="Y Coordinate" min={-10} max={10} step={0.5} value={v2.y} onChange={(y) => setV2({ ...v2, y })} />
            </div>
          </div>

          <div className="flex gap-6 p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <Toggle label="Show Addition" checked={showAddition} onChange={setShowAddition} />
            <Toggle label="Show Projection" checked={showProjection} onChange={setShowProjection} />
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <VectorViz 
            v1={v1} 
            v2={v2} 
            showAddition={showAddition} 
            showProjection={showProjection} 
          />

          {/* Readout Panel */}
          <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-4 font-mono text-sm grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-white/40 mb-1">Dot Product (v₁ • v₂)</span>
              <span className={`text-xl font-bold ${dotProduct > 0 ? "text-emerald-400" : dotProduct < 0 ? "text-red-400" : "text-white/35"}`}>
                {dotProduct.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 mb-1">Angle (θ)</span>
              <span className="text-xl text-white/90 font-bold">{angleDeg.toFixed(1)}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
