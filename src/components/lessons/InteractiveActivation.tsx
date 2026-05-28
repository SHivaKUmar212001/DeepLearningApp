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
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Activations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <h3 className="text-sm font-medium text-cyan-600 mb-4">Activation Function</h3>
            <div className="flex flex-col gap-2">
              {functions.map(f => (
                <button
                  key={f.value}
                  onClick={() => setType(f.value)}
                  className={`px-4 py-2 text-left rounded-lg transition-colors border ${type === f.value ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-rose-200 border-rose-300 text-rose-600 hover:bg-rose-300 hover:text-rose-950"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">Formula</h3>
            <div className="text-lg text-rose-950 mb-2">
              {currentFunc.formula}
            </div>
            {type === "relu" && <p className="text-rose-600 text-xs mt-2">Kills negative numbers. The most common activation function today.</p>}
            {type === "sigmoid" && <p className="text-rose-600 text-xs mt-2">Squashes everything to [0, 1]. Great for probabilities.</p>}
            {type === "tanh" && <p className="text-rose-600 text-xs mt-2">Squashes everything to [-1, 1]. Zero-centered.</p>}
            {type === "linear" && <p className="text-rose-600 text-xs mt-2">Does absolutely nothing. A network with only linear activations is just a big linear regression model!</p>}
          </div>

          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
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
