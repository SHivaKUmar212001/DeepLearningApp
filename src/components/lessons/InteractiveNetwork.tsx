"use client";

import { useState } from "react";
import { NeuralNet } from "@/components/viz/NeuralNet";
import { Slider } from "@/components/ui/Slider";
import { Plus, Minus } from "lucide-react";

export function InteractiveNetwork() {
  const [hiddenLayers, setHiddenLayers] = useState<number[]>([4, 3]);
  const inputSize = 2;
  const outputSize = 1;

  const maxLayers = 4;
  const maxNeurons = 8;

  const addLayer = () => {
    if (hiddenLayers.length < maxLayers) {
      setHiddenLayers([...hiddenLayers, 4]);
    }
  };

  const removeLayer = () => {
    if (hiddenLayers.length > 0) {
      setHiddenLayers(hiddenLayers.slice(0, -1));
    }
  };

  const updateLayer = (index: number, neurons: number) => {
    const newLayers = [...hiddenLayers];
    newLayers[index] = neurons;
    setHiddenLayers(newLayers);
  };

  const layers = [inputSize, ...hiddenLayers, outputSize];

  // Calculate parameters
  let totalWeights = 0;
  let totalBiases = 0;
  for (let i = 0; i < layers.length - 1; i++) {
    totalWeights += layers[i] * layers[i + 1];
    totalBiases += layers[i + 1];
  }
  const totalParams = totalWeights + totalBiases;

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Architecture Sandbox</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-cyan-600">Hidden Layers</h3>
              <div className="flex gap-2">
                <button 
                  onClick={removeLayer} 
                  disabled={hiddenLayers.length === 0}
                  className="p-1 bg-rose-200 hover:bg-rose-300 disabled:opacity-50 disabled:hover:bg-rose-200 rounded border border-rose-300 transition-colors"
                >
                  <Minus size={16} className="text-rose-600" />
                </button>
                <button 
                  onClick={addLayer} 
                  disabled={hiddenLayers.length >= maxLayers}
                  className="p-1 bg-rose-200 hover:bg-rose-300 disabled:opacity-50 disabled:hover:bg-rose-200 rounded border border-rose-300 transition-colors"
                >
                  <Plus size={16} className="text-rose-600" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {hiddenLayers.length === 0 ? (
                <div className="text-sm text-rose-700 italic text-center py-4">No hidden layers. This is just a Linear Regression model!</div>
              ) : (
                hiddenLayers.map((neurons, i) => (
                  <Slider 
                    key={i} 
                    label={`Layer ${i + 1} Neurons`} 
                    min={1} max={maxNeurons} step={1} 
                    value={neurons} 
                    onChange={(n) => updateLayer(i, n)} 
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">Parameter Count</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-rose-700 mb-1">Weights</span>
                <span className="text-xl text-cyan-600 font-bold">{totalWeights}</span>
              </div>
              <div className="flex flex-col border-l border-rose-200">
                <span className="text-rose-700 mb-1">Biases</span>
                <span className="text-xl text-amber-600 font-bold">{totalBiases}</span>
              </div>
              <div className="flex flex-col border-l border-rose-200">
                <span className="text-rose-700 mb-1">Total</span>
                <span className="text-xl text-emerald-600 font-bold">{totalParams}</span>
              </div>
            </div>
            <p className="text-rose-600 text-xs mt-4 text-center">
              State-of-the-art LLMs like GPT-4 have over 1,000,000,000,000 parameters!
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-4 bg-rose-50 rounded-xl border border-rose-200 overflow-hidden relative">
          <NeuralNet layers={layers} className="border-none shadow-none" />
        </div>
      </div>
    </div>
  );
}
