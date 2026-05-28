"use client";

import { useState } from "react";
import { ActivationViz, ActivationType } from "@/components/viz/ActivationViz";
import { Slider } from "@/components/ui/Slider";

export function InteractiveActivation() {
  const [type, setType] = useState<ActivationType>("relu");
  const [z, setZ] = useState(0);

  const functions: { value: ActivationType, label: string, formula: string }[] = [
    { value: "linear", label: "Linear (No Activation)", formula: "a = z" },
    { value: "relu", label: "ReLU", formula: "a = max(0, z)" },
    { value: "sigmoid", label: "Sigmoid", formula: "a = 1 / (1 + e^-z)" },
    { value: "tanh", label: "Tanh", formula: "a = tanh(z)" },
  ];

  const currentFunc = functions.find(f => f.value === type)!;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Interactive Activations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <h3 className="text-sm font-medium text-cyan-400 mb-4">Activation Function</h3>
            <div className="flex flex-col gap-2">
              {functions.map(f => (
                <button
                  key={f.value}
                  onClick={() => setType(f.value)}
                  className={`px-4 py-2 text-left rounded-lg transition-colors border ${type === f.value ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-white/[0.06] border-white/[0.1] text-white/35 hover:bg-white/[0.08] hover:text-white/90"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-white/40 font-semibold mb-3 tracking-wider">Formula</h3>
            <div className="text-lg text-white/90 mb-2">
              {currentFunc.formula}
            </div>
            {type === "relu" && <p className="text-white/35 text-xs mt-2">Kills negative numbers. The most common activation function today.</p>}
            {type === "sigmoid" && <p className="text-white/35 text-xs mt-2">Squashes everything to [0, 1]. Great for probabilities.</p>}
            {type === "tanh" && <p className="text-white/35 text-xs mt-2">Squashes everything to [-1, 1]. Zero-centered.</p>}
            {type === "linear" && <p className="text-white/35 text-xs mt-2">Does absolutely nothing. A network with only linear activations is just a big linear regression model!</p>}
          </div>

          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <Slider label="Pre-activation Input (z)" min={-5} max={5} step={0.1} value={z} onChange={setZ} />
          </div>

        </div>

        <div className="flex flex-col gap-4">
          <ActivationViz type={type} zValue={z} />
        </div>
      </div>
    </div>
  );
}
