"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveAdversarial() {
  const [noise, setNoise] = useState(0);

  // Fake neural network predictions based on noise level
  const probPanda = Math.max(0.1, 99.7 - (noise * 150));
  const probGibbon = Math.min(99.3, 0.1 + (noise * 150));
  const probOstrich = 0.2;

  // Normalize to 100%
  const total = probPanda + probGibbon + probOstrich;
  const pPanda = (probPanda / total) * 100;
  const pGibbon = (probGibbon / total) * 100;
  const pOstrich = (probOstrich / total) * 100;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Adversarial Attack Simulator</h2>
        <div className={`text-sm font-bold px-3 py-1 rounded-full border ${pPanda > 50 ? 'bg-emerald-100 text-emerald-600 border-emerald-500/50' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
          {pPanda > 50 ? "Network Confident" : "Network Fooled!"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls and Predictions */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-600">Attack Hyperparameters</h3>
            
            <div className="flex flex-col gap-2">
              <Slider 
                label="Adversarial Noise Multiplier (ε)"
                value={noise} 
                min={0} max={1} step={0.01}
                onChange={(val) => setNoise(val)} 
              />
              <p className="text-xs text-rose-700 mt-2">
                Slowly inject mathematically calculated noise into the image. Notice how the human eye can barely see the difference, but the neural network completely breaks down!
              </p>
            </div>
          </div>

          <div className="bg-rose-50 p-5 rounded-lg border border-rose-200 flex flex-col gap-4">
            <h3 className="text-xs font-mono text-rose-700 uppercase tracking-wider font-bold">Network Classification Output</h3>
            
            <div className="flex flex-col gap-3">
              {/* Panda Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className={pPanda > 50 ? "text-emerald-600 font-bold" : "text-rose-600"}>Giant Panda</span>
                  <span className="text-rose-800 font-mono">{pPanda.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-rose-200 h-2 rounded overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${pPanda}%` }} />
                </div>
              </div>

              {/* Gibbon Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className={pGibbon > 50 ? "text-red-400 font-bold" : "text-rose-600"}>Gibbon</span>
                  <span className="text-rose-800 font-mono">{pGibbon.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-rose-200 h-2 rounded overflow-hidden">
                  <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${pGibbon}%` }} />
                </div>
              </div>

              {/* Ostrich Bar */}
              <div className="flex flex-col gap-1 opacity-50">
                <div className="flex justify-between text-sm">
                  <span className="text-rose-600">Ostrich</span>
                  <span className="text-rose-800 font-mono">{pOstrich.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-rose-200 h-1 rounded overflow-hidden">
                  <div className="bg-gray-500 h-full transition-all duration-300" style={{ width: `${pOstrich}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-6 min-h-[300px] relative overflow-hidden">
          
          <div className="relative w-64 h-64 rounded-xl border-4 border-rose-300 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center bg-white text-[120px]">
            {/* The "Image" */}
            🐼

            {/* Adversarial Noise Overlay */}
            {/* We use a CSS trick to generate static noise, and bind its opacity to the slider */}
            <div 
              className="absolute inset-0 opacity-0 mix-blend-difference pointer-events-none"
              style={{ 
                opacity: noise * 0.3, // Even at max slider (1.0), opacity is only 30% to simulate imperceptible noise
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }} 
            />

            {/* Specific Adversarial Perturbation Pattern (Simulated) */}
            <div 
              className="absolute inset-0 mix-blend-overlay pointer-events-none"
              style={{
                opacity: noise * 0.4,
                background: 'linear-gradient(45deg, rgba(255,0,0,0.2) 25%, transparent 25%, transparent 75%, rgba(0,255,0,0.2) 75%, rgba(0,255,0,0.2)), linear-gradient(45deg, rgba(255,0,0,0.2) 25%, transparent 25%, transparent 75%, rgba(0,0,255,0.2) 75%, rgba(0,0,255,0.2))',
                backgroundSize: '10px 10px'
              }}
            />
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <div className="font-mono text-sm font-bold text-rose-800">Image Tensor $x$ <span className="text-red-400">+ $\epsilon \cdot sign(\nabla_x J(\theta, x, y))$</span></div>
            <p className="text-[10px] text-rose-700 mt-1 max-w-[80%] uppercase tracking-widest">Fast Gradient Sign Method (FGSM)</p>
          </div>

        </div>

      </div>
    </div>
  );
}
