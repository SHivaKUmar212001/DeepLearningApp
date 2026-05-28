"use client";

import { useState } from "react";
import { NeuralNet } from "@/components/viz/NeuralNet";
import { MatrixViz } from "@/components/viz/MatrixViz";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { PlayControl } from "@/components/ui/PlayControl";

function activationSample(layerIdx: number, nodeIdx: number, hiddenLayerSize: number) {
  const seed = Math.sin((layerIdx + 1) * 91.7 + (nodeIdx + 1) * 37.3 + hiddenLayerSize * 11.1) * 10000;
  return (seed - Math.floor(seed)) * 2 - 1;
}

export default function PlaygroundPage() {
  const [layers, setLayers] = useState([3, 4, 2]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActivations, setShowActivations] = useState(true);

  const activations = showActivations
    ? layers.map((nodeCount, layerIdx) =>
        Array.from({ length: nodeCount }, (_, nodeIdx) => activationSample(layerIdx, nodeIdx, layers[1]))
      )
    : [];

  const matrixData = [
    [0.5, -0.2, 0.8],
    [-0.9, 0.1, -0.5],
    [0.3, 0.7, 0.0],
  ];

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-[1200px] px-6 py-12 sm:py-16 lg:px-8">
      {/* Header */}
      <header className="mb-12 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-rose-400">
          Interactive lab
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-rose-950 sm:text-5xl">
          Playground
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-rose-600">
          Experiment with neural network components. Adjust parameters and watch the visualization update in real time.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Network Sandbox ── */}
        <section className="rounded-2xl border border-rose-100 bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-lg font-bold text-rose-950">
            Neural Network
          </h2>

          <NeuralNet
            layers={layers}
            activations={activations}
            mode={isPlaying ? "forward" : "static"}
            className="w-full"
          />

          <div className="mt-6 space-y-5 border-t border-rose-50 pt-6">
            <Slider
              label="Hidden layer size"
              min={2}
              max={8}
              step={1}
              value={layers[1]}
              onChange={(v) => setLayers([layers[0], v, layers[2]])}
            />
            <div className="flex flex-wrap items-center gap-4">
              <Toggle label="Show activations" checked={showActivations} onChange={setShowActivations} />
              <PlayControl isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} />
            </div>
          </div>
        </section>

        {/* ── Matrix Sandbox ── */}
        <section className="flex flex-col rounded-2xl border border-rose-100 bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-lg font-bold text-rose-950">
            Weight Matrix
          </h2>

          <div className="flex flex-1 items-center justify-center rounded-xl border border-rose-50 bg-rose-50/40 p-6">
            <MatrixViz data={matrixData} label="Weight Matrix W1" />
          </div>
        </section>
      </div>
    </div>
  );
}
