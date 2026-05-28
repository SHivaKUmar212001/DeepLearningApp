"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveChainRule() {
  const [x, setX] = useState(2);

  // Math
  const u = 2 * x;
  const y = u * u;
  
  // Derivatives
  const du_dx = 2; // g'(x)
  const dy_du = 2 * u; // f'(u)
  const dy_dx = du_dx * dy_du;

  // Scale calculations for visualization
  const max_x = 5;
  const max_u = 10;
  const max_y = 100;

  const x_pct = (x / max_x) * 100;
  const u_pct = (u / max_u) * 100;
  const y_pct = (y / max_y) * 100;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">The Chain Rule Visualized</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls and Readout */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-600">Function Setup</h3>
            <p className="text-xs text-rose-600 font-mono">
              g(x) = 2x<br/>
              f(u) = u²<br/>
              y = f(g(x)) = (2x)²
            </p>
            
            <Slider 
              label="Input (x)" 
              min={0} max={5} step={0.1} 
              value={x} onChange={setX} 
            />
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">Derivatives (Speeds)</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-2 rounded bg-rose-100 border border-rose-200">
                <span className="text-cyan-600">du/dx</span>
                <span className="text-rose-600">Derivative of g</span>
                <span className="text-cyan-600 font-bold">{du_dx}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 rounded bg-rose-100 border border-rose-200">
                <span className="text-amber-600">dy/du</span>
                <span className="text-rose-600">Derivative of f</span>
                <span className="text-amber-600 font-bold">{dy_du.toFixed(1)}</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-indigo-900/30 border border-indigo-500/30 mt-2">
                <span className="text-indigo-700">dy/dx</span>
                <span className="text-rose-600 text-xs">dy/du × du/dx</span>
                <span className="text-indigo-700 font-bold text-lg">{dy_dx.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thermometers Visualization */}
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-6 flex flex-col relative justify-center">
          <div className="flex justify-between items-end h-[250px] px-8">
            
            {/* X Thermometer */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-full bg-rose-100 border border-rose-200 rounded-full relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-cyan-500 transition-all duration-75"
                  style={{ height: `${x_pct}%` }}
                />
              </div>
              <span className="font-mono text-sm text-cyan-600 font-bold">x = {x.toFixed(1)}</span>
              <span className="text-xs text-rose-700 uppercase tracking-wider">Input</span>
            </div>

            {/* Connecting Arrows 1 */}
            <div className="flex flex-col items-center justify-center flex-1 h-full pb-8">
              <span className="text-xs text-rose-700 font-mono mb-1">× {du_dx}</span>
              <div className="w-full h-px bg-dashed border-t border-rose-300 border-dashed" />
            </div>

            {/* U Thermometer */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-full bg-rose-100 border border-rose-200 rounded-full relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-amber-500 transition-all duration-75"
                  style={{ height: `${u_pct}%` }}
                />
              </div>
              <span className="font-mono text-sm text-amber-600 font-bold">u = {u.toFixed(1)}</span>
              <span className="text-xs text-rose-700 uppercase tracking-wider">g(x)</span>
            </div>

            {/* Connecting Arrows 2 */}
            <div className="flex flex-col items-center justify-center flex-1 h-full pb-8">
              <span className="text-xs text-rose-700 font-mono mb-1">× {dy_du.toFixed(1)}</span>
              <div className="w-full h-px bg-dashed border-t border-rose-300 border-dashed" />
            </div>

            {/* Y Thermometer */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-full bg-rose-100 border border-rose-200 rounded-full relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all duration-75"
                  style={{ height: `${y_pct}%` }}
                />
              </div>
              <span className="font-mono text-sm text-indigo-700 font-bold">y = {y.toFixed(1)}</span>
              <span className="text-xs text-rose-700 uppercase tracking-wider">f(u)</span>
            </div>

          </div>
          
          <div className="text-center mt-8 text-xs text-rose-700 max-w-[80%] mx-auto">
            Drag the input slider. Notice how a small step in <strong>x</strong> causes a medium step in <strong>u</strong>, which then causes a massive leap in <strong>y</strong>! The final &quot;speed&quot; of y is the multiplied effect of both functions.
          </div>
        </div>
      </div>
    </div>
  );
}
