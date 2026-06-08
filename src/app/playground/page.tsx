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
      <header className="mb-12 max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl" style={{ textWrap: "balance" }}>Playground</h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">Experiment with neural network components. Adjust parameters and watch the visualization update.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg surface-card p-6">
          <h2 className="mb-5 text-sm font-semibold text-zinc-300">Neural Network</h2>
          <div className="rounded-md bg-[#111113] border border-white/[0.05] p-4">
            <NeuralNet layers={layers} activations={activations} mode={isPlaying ? "forward" : "static"} className="w-full" />
          </div>
          <div className="mt-5 space-y-4 border-t border-white/[0.05] pt-5">
            <Slider label="Hidden layer size" min={2} max={8} step={1} value={layers[1]} onChange={(v) => setLayers([layers[0], v, layers[2]])} />
            <div className="flex flex-wrap items-center gap-4">
              <Toggle label="Show activations" checked={showActivations} onChange={setShowActivations} />
              <PlayControl isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} />
            </div>
          </div>
        </section>

        <section className="flex flex-col rounded-lg surface-card p-6">
          <h2 className="mb-5 text-sm font-semibold text-zinc-300">Weight Matrix</h2>
          <div className="flex flex-1 items-center justify-center rounded-md bg-[#111113] border border-white/[0.05] p-6">
            <MatrixViz data={matrixData} label="Weight Matrix W1" />
          </div>
        </section>
      </div>
    </div>
  );
}
