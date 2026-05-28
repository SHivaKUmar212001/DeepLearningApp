"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveRegularization() {
  const [capacity, setCapacity] = useState(15);
  const [lambda, setLambda] = useState(0);

  // Generate a noisy sine wave
  const dataPoints = useMemo(() => {
    const points = [];
    // Seeded random
    let seed = 42;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 20; i++) {
      const x = i / 19;
      // Underlying function: sin(x * pi * 2) + slight linear trend
      const cleanY = Math.sin(x * Math.PI * 2) * 0.4 + 0.5;
      // Add noise
      const y = cleanY + (rand() - 0.5) * 0.3;
      points.push({ x, y: Math.max(0.1, Math.min(0.9, y)) });
    }
    return points;
  }, []);

  // Train the model
  const { curve, finalLoss, weightNorm } = useMemo(() => {
    const w = new Array(capacity).fill(0);
    const lr = 0.5;
    const epochs = 1000;

    // We use Radial Basis Functions (RBF)
    // Centers are distributed evenly across [0, 1]
    const centers = Array.from({ length: capacity }, (_, i) => i / (capacity - 1 || 1));
    const width = 50; // sharp kernels to allow high capacity to overfit

    for (let step = 0; step < epochs; step++) {
      const dw = new Array(capacity).fill(0);
      
      for (let j = 0; j < dataPoints.length; j++) {
        const { x, y } = dataPoints[j];
        
        // Forward pass
        let pred = 0;
        const acts = [];
        for (let i = 0; i < capacity; i++) {
          const act = Math.exp(-width * Math.pow(x - centers[i], 2));
          acts.push(act);
          pred += w[i] * act;
        }
        
        const err = pred - y;
        
        // Backward pass
        for (let i = 0; i < capacity; i++) {
          dw[i] += err * acts[i];
        }
      }
      
      // Update with L2 Regularization (Weight Decay)
      for (let i = 0; i < capacity; i++) {
        // Lambda acts as the weight decay factor
        w[i] = w[i] - lr * (dw[i] / dataPoints.length + lambda * 0.01 * w[i]);
      }
    }

    // Generate curve points for plotting
    const plotPoints = [];
    for (let x = 0; x <= 1; x += 0.01) {
      let pred = 0;
      for (let i = 0; i < capacity; i++) {
        pred += w[i] * Math.exp(-width * Math.pow(x - centers[i], 2));
      }
      plotPoints.push({ x, y: pred });
    }

    // Calculate final metrics
    let loss = 0;
    for (let j = 0; j < dataPoints.length; j++) {
      let pred = 0;
      for (let i = 0; i < capacity; i++) {
        pred += w[i] * Math.exp(-width * Math.pow(dataPoints[j].x - centers[i], 2));
      }
      loss += Math.pow(pred - dataPoints[j].y, 2);
    }
    
    const wNorm = w.reduce((sum, val) => sum + val * val, 0);

    return { curve: plotPoints, finalLoss: loss / dataPoints.length, weightNorm: wNorm };
  }, [capacity, lambda, dataPoints]);

  return (
    <div className="my-8 p-6 bg-white border border-rose-200 rounded-xl shadow-xl flex flex-col gap-8">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Regularization</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-rose-800">Model Configuration</h3>
            
            <Slider 
              label="Model Capacity (Neurons)" 
              min={1} max={30} step={1} 
              value={capacity} onChange={setCapacity} 
            />
            
            <Slider 
              label="L2 Regularization (λ)" 
              min={0} max={1} step={0.01} 
              value={lambda} onChange={setLambda} 
            />
            
            <div className="bg-rose-50 border border-rose-200 rounded p-3 text-xs font-mono text-rose-600 mt-2">
              <div className="flex justify-between mb-1">
                <span>Mean Squared Error:</span>
                <span className="text-amber-600">{finalLoss.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Weights Size (||w||²):</span>
                <span className="text-indigo-700">{weightNorm.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-rose-700 leading-relaxed mt-2">
              <strong>Experiment:</strong> Set capacity to 30 and λ to 0. Watch the model overfit and aggressively zigzag to hit every noisy point perfectly. Then, slowly increase λ to force the model to keep its weights small, resulting in a smooth, generalized curve!
            </p>
          </div>
        </div>

        {/* Plot */}
        <div className="lg:col-span-8 bg-rose-50 rounded-xl border border-rose-200 p-4 relative overflow-hidden flex items-center justify-center min-h-[300px]">
          
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d" style={{ transform: "scaleY(-1)" }}>
            
            {/* Grid */}
            <g stroke="#1f2937" strokeWidth="0.5">
              {[0, 20, 40, 60, 80, 100].map(y => (
                <line key={`h-${y}`} x1="0" y1={y} x2="100" y2={y} />
              ))}
              {[0, 20, 40, 60, 80, 100].map(x => (
                <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="100" />
              ))}
            </g>

            {/* The learned curve */}
            <polyline
              points={curve.map(p => `${p.x * 100},${p.y * 100}`).join(" ")}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ transition: "all 0.3s ease" }}
            />

            {/* The data points */}
            {dataPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x * 100}
                cy={p.y * 100}
                r="1.5"
                fill="#fcd34d"
                stroke="#181b21"
                strokeWidth="0.5"
              />
            ))}
            
          </svg>
        </div>
      </div>
    </div>
  );
}
