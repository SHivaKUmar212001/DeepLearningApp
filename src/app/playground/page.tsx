"use client";

import { useState } from "react";
import { NeuralNet } from "@/components/viz/NeuralNet";
import { MatrixViz } from "@/components/viz/MatrixViz";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { PlayControl } from "@/components/ui/PlayControl";
import { Activity, Grid3x3 } from "lucide-react";

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
      <header className="mb-14 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/60">
            Interactive lab
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Play<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">ground</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/40">
          Experiment with neural network components. Adjust parameters and watch the visualization update in real time.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Network Sandbox ── */}
        <section className="relative rounded-2xl glass overflow-hidden">
          {/* Top accent */}
          <div className="h-px bg-gradient-to-r from-violet-500/40 via-transparent to-transparent" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={16} className="text-violet-400 opacity-70" />
              <h2 className="text-lg font-bold text-white/90">
                Neural Network
              </h2>
            </div>

            <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
              <NeuralNet
                layers={layers}
                activations={activations}
                mode={isPlaying ? "forward" : "static"}
                className="w-full"
              />
            </div>

            <div className="mt-6 space-y-5 border-t border-white/[0.06] pt-6">
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
          </div>
        </section>

        {/* ── Matrix Sandbox ── */}
        <section className="relative flex flex-col rounded-2xl glass overflow-hidden">
          <div className="h-px bg-gradient-to-r from-cyan-500/40 via-transparent to-transparent" />

          <div className="flex-1 p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Grid3x3 size={16} className="text-cyan-400 opacity-70" />
              <h2 className="text-lg font-bold text-white/90">
                Weight Matrix
              </h2>
            </div>

            <div className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.04] bg-white/[0.02] p-6">
              <MatrixViz data={matrixData} label="Weight Matrix W1" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
