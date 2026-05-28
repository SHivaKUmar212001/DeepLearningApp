"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/Slider";
import { PlayControl } from "@/components/ui/PlayControl";

// Extremely simple minimal MLP for browser-side training
class SimpleMLP {
  layers: { w: number[][], b: number[] }[] = [];

  constructor(layerSizes: number[]) {
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const inSize = layerSizes[i];
      const outSize = layerSizes[i + 1];
      // He initialization
      const w = Array.from({ length: inSize }, () =>
        Array.from({ length: outSize }, () => (Math.random() * 2 - 1) * Math.sqrt(2 / inSize))
      );
      const b = new Array(outSize).fill(0);
      this.layers.push({ w, b });
    }
  }

  forward(x: number[]): { a: number[][], z: number[][] } {
    const a = [x];
    const z = [];
    let currA = x;
    
    for (let i = 0; i < this.layers.length; i++) {
      const { w, b } = this.layers[i];
      const nextZ = new Array(b.length).fill(0);
      const nextA = new Array(b.length).fill(0);
      
      for (let j = 0; j < b.length; j++) {
        let sum = b[j];
        for (let k = 0; k < currA.length; k++) {
          sum += currA[k] * w[k][j];
        }
        nextZ[j] = sum;
        // ReLU for hidden, Sigmoid for output layer
        if (i === this.layers.length - 1) {
          nextA[j] = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, sum)))); // safe sigmoid
        } else {
          nextA[j] = Math.max(0, sum);
        }
      }
      z.push(nextZ);
      a.push(nextA);
      currA = nextA;
    }
    return { a, z };
  }

  trainStep(x: number[], y: number, lr: number, lambda: number) {
    const { a, z } = this.forward(x);
    // Binary Cross Entropy derivative
    const outA = a[a.length - 1][0];
    let delta = [outA - y];

    for (let i = this.layers.length - 1; i >= 0; i--) {
      const { w, b } = this.layers[i];
      const inputA = a[i];
      const nextDelta = new Array(inputA.length).fill(0);

      for (let j = 0; j < b.length; j++) {
        const d = delta[j];
        b[j] -= lr * d;
        for (let k = 0; k < inputA.length; k++) {
          nextDelta[k] += w[k][j] * d;
          const gradW = inputA[k] * d + lambda * w[k][j];
          w[k][j] -= lr * gradW;
        }
      }

      if (i > 0) {
        for (let k = 0; k < inputA.length; k++) {
          nextDelta[k] *= z[i - 1][k] > 0 ? 1 : 0; // ReLU derivative
        }
      }
      delta = nextDelta;
    }
    
    // Return individual loss
    return -(y * Math.log(outA + 1e-8) + (1 - y) * Math.log(1 - outA + 1e-8));
  }
}

export function InteractivePlayground() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lr, setLr] = useState(0.05);
  const [lambda, setLambda] = useState(0.001);
  const [hiddenSize, setHiddenSize] = useState(6);
  
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [gridPredictions, setGridPredictions] = useState<number[]>(new Array(400).fill(0.5));
  
  // The neural network instance
  const mlpRef = useRef<SimpleMLP | null>(null);
  
  // Generate concentric circles dataset
  const [dataset] = useState(() => 
    Array.from({ length: 150 }, () => {
      const isInner = Math.random() > 0.5;
      const radius = isInner ? Math.random() * 0.4 : 0.6 + Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        label: isInner ? 1 : 0
      };
    })
  );

  const updateGrid = () => {
    if (!mlpRef.current) return;
    const res = 20;
    const newGrid = new Array(res * res);
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        // Map to [-1, 1]
        const px = (j / (res - 1)) * 2 - 1;
        const py = (i / (res - 1)) * 2 - 1;
        newGrid[i * res + j] = mlpRef.current.forward([px, py]).a.slice(-1)[0][0];
      }
    }
    setGridPredictions(newGrid);
  };

  // Initialize network
  const initNetwork = () => {
    mlpRef.current = new SimpleMLP([2, hiddenSize, hiddenSize, 1]);
    setEpoch(0);
    setLoss(1.0);
    updateGrid();
  };

  useEffect(() => {
    mlpRef.current = new SimpleMLP([2, hiddenSize, hiddenSize, 1]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEpoch(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoss(1.0);
    if (mlpRef.current) {
      const res = 20;
      const newGrid = new Array(res * res);
      for (let i = 0; i < res; i++) {
        for (let j = 0; j < res; j++) {
          const px = (j / (res - 1)) * 2 - 1;
          const py = (i / (res - 1)) * 2 - 1;
          newGrid[i * res + j] = mlpRef.current.forward([px, py]).a.slice(-1)[0][0];
        }
      }
      setGridPredictions(newGrid);
    }
  }, [hiddenSize]);

  // Training loop
  useEffect(() => {
    if (!isPlaying || !mlpRef.current) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (time - lastTime > 50) {
        let totalLoss = 0;
        // Run 5 epochs per tick to speed up visualization
        for (let e = 0; e < 5; e++) {
          let epochLoss = 0;
          for (let i = 0; i < dataset.length; i++) {
            // Pick a random point (Stochastic GD)
            const pt = dataset[Math.floor(Math.random() * dataset.length)];
            epochLoss += mlpRef.current!.trainStep([pt.x, pt.y], pt.label, lr, lambda);
          }
          totalLoss += epochLoss / dataset.length;
        }
        
        setEpoch(ep => ep + 5);
        setLoss(totalLoss / 5);
        updateGrid();
        
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, lr, lambda, dataset]);

  const res = 20;

  return (
    <div className="my-8 p-6 bg-white border border-rose-200 rounded-xl shadow-xl flex flex-col gap-8">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Mini-Playground: Train an MLP</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-600">Network & Hyperparameters</h3>
            
            <Slider 
              label="Hidden Neurons (Per Layer)" 
              min={2} max={12} step={1} 
              value={hiddenSize} onChange={setHiddenSize} 
            />
            
            <Slider 
              label="Learning Rate" 
              min={0.01} max={0.2} step={0.01} 
              value={lr} onChange={setLr} 
            />

            <Slider 
              label="L2 Regularization" 
              min={0} max={0.02} step={0.001} 
              value={lambda} onChange={setLambda} 
            />
            
            <div className="flex items-center justify-end mt-2">
              <PlayControl 
                isPlaying={isPlaying} 
                onPlayPause={() => setIsPlaying(!isPlaying)} 
                onReset={() => { setIsPlaying(false); initNetwork(); }}
              />
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">Training Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-rose-700 mb-1">Epoch</span>
                <span className="text-xl text-cyan-600 font-bold">{epoch}</span>
              </div>
              <div className="flex flex-col border-l border-rose-200">
                <span className="text-rose-700 mb-1">Loss</span>
                <span className="text-xl text-amber-600 font-bold">{loss.toFixed(4)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-rose-700 leading-relaxed">
            <strong>The Task:</strong> Separate the inner blue points from the outer orange points. A simple line cannot do this! Press play and watch the network warp its decision boundary to solve the problem.
          </p>
        </div>

        {/* 2D Plot */}
        <div className="lg:col-span-7 bg-rose-50 rounded-xl border border-rose-200 p-2 relative overflow-hidden flex items-center justify-center aspect-square">
          <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" style={{ transform: "scaleY(-1)" }}>
            {/* Background Grid for Decision Boundary */}
            <g>
              {Array.from({ length: res }).map((_, i) =>
                Array.from({ length: res }).map((_, j) => {
                  const pred = gridPredictions[i * res + j];
                  // Map prediction 0->Orange, 1->Blue
                  // Blend color based on prediction
                  const r = Math.round(pred * 59 + (1 - pred) * 245);
                  const g = Math.round(pred * 130 + (1 - pred) * 158);
                  const b = Math.round(pred * 246 + (1 - pred) * 11);
                  const opacity = 0.3 + Math.abs(pred - 0.5) * 0.4;
                  
                  return (
                    <rect
                      key={`${i}-${j}`}
                      x={(j / res) * 100}
                      y={(i / res) * 100}
                      width={100 / res + 0.5}
                      height={100 / res + 0.5}
                      fill={`rgba(${r}, ${g}, ${b}, ${opacity})`}
                    />
                  );
                })
              )}
            </g>

            {/* Data Points */}
            {dataset.map((p, idx) => (
              <circle
                key={idx}
                cx={(p.x + 1) / 2 * 100}
                cy={(p.y + 1) / 2 * 100}
                r="1.8"
                fill={p.label === 1 ? "#3b82f6" : "#f59e0b"} // Blue for inner, Orange for outer
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
