"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveDerivative() {
  const [xVal, setXVal] = useState(2);
  const [funcType, setFuncType] = useState<"quadratic" | "cubic" | "sin">("quadratic");

  // Define functions and their derivatives
  const functions = {
    quadratic: {
      f: (x: number) => 0.5 * x * x - 2,
      df: (x: number) => x,
      label: "f(x) = 0.5x² - 2"
    },
    cubic: {
      f: (x: number) => 0.1 * x * x * x - x,
      df: (x: number) => 0.3 * x * x - 1,
      label: "f(x) = 0.1x³ - x"
    },
    sin: {
      f: (x: number) => 3 * Math.sin(x),
      df: (x: number) => 3 * Math.cos(x),
      label: "f(x) = 3sin(x)"
    }
  };

  const currentFunc = functions[funcType];
  const yVal = currentFunc.f(xVal);
  const slope = currentFunc.df(xVal);

  // SVG Coordinates setup
  const width = 400;
  const height = 400;
  const domain = [-5, 5];
  const range = [-5, 5];
  
  const scaleX = width / (domain[1] - domain[0]);
  const scaleY = height / (range[1] - range[0]);
  const originX = width / 2;
  const originY = height / 2;

  const toSvgX = (x: number) => originX + x * scaleX;
  const toSvgY = (y: number) => originY - y * scaleY;

  // Generate curve path
  const curvePoints = [];
  for (let x = domain[0]; x <= domain[1]; x += 0.1) {
    curvePoints.push(`${toSvgX(x)},${toSvgY(currentFunc.f(x))}`);
  }
  const curvePath = `M ${curvePoints.join(" L ")}`;

  // Generate tangent line points
  // y - yVal = slope * (x - xVal)  =>  y = slope * (x - xVal) + yVal
  const tangentX1 = domain[0];
  const tangentY1 = slope * (tangentX1 - xVal) + yVal;
  
  const tangentX2 = domain[1];
  const tangentY2 = slope * (tangentX2 - xVal) + yVal;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Derivative</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-600">Function Controls</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-rose-700">Function Type</label>
              <select 
                className="bg-rose-200 border border-rose-300 text-rose-950 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                value={funcType}
                onChange={(e) => setFuncType(e.target.value as "quadratic" | "cubic" | "sin")}
              >
                <option value="quadratic">Quadratic</option>
                <option value="cubic">Cubic</option>
                <option value="sin">Sine Wave</option>
              </select>
            </div>

            <Slider 
              label="Position (x)" 
              min={domain[0]} max={domain[1]} step={0.1} 
              value={xVal} onChange={setXVal} 
            />
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm flex flex-col gap-4">
            <div className="text-center text-rose-600 font-bold mb-2">
              {currentFunc.label}
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-rose-700 mb-1">Position f(x)</span>
                <span className="text-xl text-cyan-600 font-bold">{yVal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col border-l border-rose-200">
                <span className="text-rose-700 mb-1">Slope f&apos;(x)</span>
                <span className="text-xl text-amber-600 font-bold">{slope.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-rose-700 leading-relaxed">
            <strong>Observation:</strong> Notice how the slope (derivative) is exactly zero at the bottom of the &quot;valley&quot; or top of the &quot;hill&quot;. This is how optimization algorithms find the minimum loss!
          </p>
        </div>

        {/* Plot */}
        <div className="lg:col-span-7 bg-rose-50 rounded-xl border border-rose-200 p-2 relative overflow-hidden flex items-center justify-center aspect-square font-mono">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            
            {/* Grid */}
            <g stroke="#1f2937" strokeWidth="1">
              {Array.from({ length: 11 }).map((_, i) => {
                const pos = i * (width / 10);
                return (
                  <React.Fragment key={i}>
                    <line x1={pos} y1={0} x2={pos} y2={height} stroke={pos === originX ? "#4b5563" : "#1f2937"} strokeWidth={pos === originX ? 2 : 1} />
                    <line x1={0} y1={pos} x2={width} y2={pos} stroke={pos === originY ? "#4b5563" : "#1f2937"} strokeWidth={pos === originY ? 2 : 1} />
                  </React.Fragment>
                );
              })}
            </g>

            {/* Function Curve */}
            <path d={curvePath} fill="none" stroke="#06b6d4" strokeWidth={3} />

            {/* Tangent Line */}
            <line 
              x1={toSvgX(tangentX1)} y1={toSvgY(tangentY1)} 
              x2={toSvgX(tangentX2)} y2={toSvgY(tangentY2)} 
              stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,6"
            />

            {/* Current Point */}
            <circle cx={toSvgX(xVal)} cy={toSvgY(yVal)} r={6} fill="#fcd34d" stroke="#181b21" strokeWidth={2} />
          </svg>
        </div>
      </div>
    </div>
  );
}
