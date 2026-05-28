"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveBackprop() {
  const [x, setX] = useState(-2);
  const [y, setY] = useState(5);
  const [z, setZ] = useState(-4);

  // Forward Pass
  const q = x + y;
  const f = q * z;

  // Backward Pass (Gradients)
  
  // f = q * z
  // df/dq = z
  // df/dz = q
  const df_dq = z;
  const df_dz = q;

  // q = x + y
  // dq/dx = 1, dq/dy = 1
  // Chain rule: df/dx = (df/dq) * (dq/dx)
  const df_dx = df_dq * 1;
  const df_dy = df_dq * 1;

  // Layout constants
  const startX = 50;
  const qX = 250;
  const fX = 450;
  
  const xY = 80;
  const yY = 220;
  const zY = 320;
  
  const qY = 150;
  const fY = 235;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Computation Graph</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <h3 className="text-sm font-medium text-cyan-600 mb-4">Inputs</h3>
            <div className="flex flex-col gap-4">
              <Slider label="Input x" min={-5} max={5} step={0.1} value={x} onChange={setX} />
              <Slider label="Input y" min={-5} max={5} step={0.1} value={y} onChange={setY} />
              <Slider label="Input z" min={-5} max={5} step={0.1} value={z} onChange={setZ} />
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">The Chain Rule</h3>
            <div className="flex flex-col gap-2 text-rose-600">
              <div>f(x, y, z) = (x + y) * z</div>
              <div>q = x + y</div>
              <div className="w-full h-px bg-rose-200 my-2"></div>
              <div className="text-rose-600">∂f/∂z = q = {df_dz.toFixed(2)}</div>
              <div className="text-rose-600">∂f/∂q = z = {df_dq.toFixed(2)}</div>
              <div className="text-rose-600">∂f/∂x = (∂f/∂q) * (∂q/∂x) = {df_dq.toFixed(2)} * 1 = {df_dx.toFixed(2)}</div>
              <div className="text-rose-600">∂f/∂y = (∂f/∂q) * (∂q/∂y) = {df_dq.toFixed(2)} * 1 = {df_dy.toFixed(2)}</div>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full aspect-video bg-rose-50 rounded-xl border border-rose-200 overflow-hidden relative font-mono select-none">
            
            {/* SVG Graph */}
            <svg viewBox="0 0 600 400" className="w-full h-full">
              
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
                </marker>
              </defs>

              {/* Edges */}
              <line x1={startX+40} y1={xY} x2={qX-40} y2={qY} stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1={startX+40} y1={yY} x2={qX-40} y2={qY} stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
              
              <line x1={qX+40} y1={qY} x2={fX-40} y2={fY} stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1={startX+40} y1={zY} x2={fX-40} y2={fY} stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />

              <line x1={fX+40} y1={fY} x2={550} y2={fY} stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />

              {/* Nodes */}
              {/* x */}
              <circle cx={startX} cy={xY} r="20" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x={startX} y={xY+5} fill="#06b6d4" fontSize="16" textAnchor="middle">x</text>
              {/* y */}
              <circle cx={startX} cy={yY} r="20" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x={startX} y={yY+5} fill="#06b6d4" fontSize="16" textAnchor="middle">y</text>
              {/* z */}
              <circle cx={startX} cy={zY} r="20" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x={startX} y={zY+5} fill="#06b6d4" fontSize="16" textAnchor="middle">z</text>

              {/* q (x+y) node */}
              <circle cx={qX} cy={qY} r="25" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x={qX} y={qY+6} fill="#3b82f6" fontSize="20" textAnchor="middle">+</text>
              
              {/* f (q*z) node */}
              <circle cx={fX} cy={fY} r="25" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x={fX} y={fY+8} fill="#3b82f6" fontSize="24" textAnchor="middle">*</text>

              {/* Forward Pass Values (Green, Top) */}
              <text x={startX} y={xY-30} fill="#10b981" fontSize="14" textAnchor="middle">{x.toFixed(2)}</text>
              <text x={startX} y={yY-30} fill="#10b981" fontSize="14" textAnchor="middle">{y.toFixed(2)}</text>
              <text x={startX} y={zY-30} fill="#10b981" fontSize="14" textAnchor="middle">{z.toFixed(2)}</text>
              
              <text x={qX} y={qY-35} fill="#10b981" fontSize="14" textAnchor="middle">{q.toFixed(2)}</text>
              <text x={fX} y={fY-35} fill="#10b981" fontSize="14" textAnchor="middle">{f.toFixed(2)}</text>

              {/* Backward Pass Gradients (Red, Bottom) */}
              <text x={startX} y={xY+40} fill="#f43f5e" fontSize="14" textAnchor="middle">{df_dx.toFixed(2)}</text>
              <text x={startX} y={yY+40} fill="#f43f5e" fontSize="14" textAnchor="middle">{df_dy.toFixed(2)}</text>
              <text x={startX} y={zY+40} fill="#f43f5e" fontSize="14" textAnchor="middle">{df_dz.toFixed(2)}</text>

              <text x={qX} y={qY+45} fill="#f43f5e" fontSize="14" textAnchor="middle">{df_dq.toFixed(2)}</text>
              <text x={fX} y={fY+45} fill="#f43f5e" fontSize="14" textAnchor="middle">1.00</text>

            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-rose-100/80 p-2 rounded border border-rose-300 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-600 font-bold">1.23</span>
                <span className="text-rose-800">Forward Pass (Value)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-700 font-bold">1.23</span>
                <span className="text-rose-800">Backward Pass (Gradient)</span>
              </div>
            </div>

          </div>
          
          <div className="text-sm text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 rounded-lg">
            <strong>Observation:</strong> Notice the `+` node. It takes the gradient it receives from the right (-4.00) and simply distributes it equally to both `x` and `y` on the left. A plus node is a &quot;gradient distributor&quot;.
          </div>
        </div>
      </div>
    </div>
  );
}
