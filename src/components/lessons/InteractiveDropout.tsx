"use client";

import { useState, useEffect } from "react";
import { NeuralNet } from "@/components/viz/NeuralNet";
import { Slider } from "@/components/ui/Slider";
import { PlayControl } from "@/components/ui/PlayControl";
import { Toggle } from "@/components/ui/Toggle";

export function InteractiveDropout() {
  const [dropoutRate, setDropoutRate] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useBatchNorm, setUseBatchNorm] = useState(false);
  
  const layers = [4, 6, 6, 2];
  
  // Create dropout mask
  const [dropoutMask, setDropoutMask] = useState<boolean[][]>(
    layers.map(() => [])
  );

  // Randomize dropout mask on interval when playing
  useEffect(() => {
    if (!isPlaying) {
      // Clear mask when stopped
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDropoutMask(layers.map(layerSize => new Array(layerSize).fill(false)));
      return;
    }

    const interval = setInterval(() => {
      setDropoutMask(layers.map((layerSize, layerIdx) => {
        // Only drop out hidden layers (idx > 0 and idx < layers.length - 1)
        if (layerIdx === 0 || layerIdx === layers.length - 1) {
          return new Array(layerSize).fill(false);
        }
        
        return Array.from({ length: layerSize }, () => Math.random() < dropoutRate);
      }));
    }, 500); // 500ms per "batch"

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, dropoutRate]);

  // Calculate active parameters
  let totalParams = 0;
  let activeParams = 0;
  
  for (let i = 0; i < layers.length - 1; i++) {
    const layer1Size = layers[i];
    const layer2Size = layers[i + 1];
    
    // total weights + biases
    totalParams += (layer1Size * layer2Size) + layer2Size;
    
    // Calculate active parameters based on the current mask
    let activeL1 = layer1Size;
    let activeL2 = layer2Size;
    
    if (dropoutMask[i] && dropoutMask[i].length > 0) {
      activeL1 = dropoutMask[i].filter(dropped => !dropped).length;
    }
    if (dropoutMask[i + 1] && dropoutMask[i + 1].length > 0) {
      activeL2 = dropoutMask[i + 1].filter(dropped => !dropped).length;
    }
    
    activeParams += (activeL1 * activeL2) + activeL2;
  }

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Interactive Dropout</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-6">
            <h3 className="text-sm font-medium text-cyan-400">Regularization Techniques</h3>
            
            <Slider 
              label="Dropout Rate (Hidden Layers)" 
              min={0} max={0.9} step={0.1} 
              value={dropoutRate} onChange={setDropoutRate} 
            />
            
            <div className="flex items-center justify-between">
              <Toggle 
                label="Batch Normalization" 
                checked={useBatchNorm} 
                onChange={setUseBatchNorm} 
              />
              <PlayControl 
                isPlaying={isPlaying} 
                onPlayPause={() => setIsPlaying(!isPlaying)} 
                onReset={() => { setIsPlaying(false); setDropoutMask(layers.map(s => new Array(s).fill(false))); }}
              />
            </div>
          </div>

          <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-5 font-mono text-sm">
            <h3 className="text-xs uppercase text-white/40 font-semibold mb-3 tracking-wider">Current Batch Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-white/40 mb-1">Total Parameters</span>
                <span className="text-xl text-cyan-400 font-bold">{totalParams}</span>
              </div>
              <div className="flex flex-col border-l border-white/[0.08]">
                <span className="text-white/40 mb-1">Active Parameters</span>
                <span className="text-xl text-amber-400 font-bold">{isPlaying ? activeParams : totalParams}</span>
              </div>
            </div>
            
            {useBatchNorm && (
              <div className="mt-4 pt-4 border-t border-white/[0.08] text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Activations are being zero-centered and scaled!
              </div>
            )}
          </div>
          
          <p className="text-xs text-white/40 leading-relaxed">
            <strong>Hint:</strong> Press play to simulate batches of data passing through the network. Notice how high dropout rates force the network to become sparse, preventing complex co-adaptations between neurons.
          </p>

        </div>

        <div className="flex flex-col gap-4 bg-[#111128] rounded-xl border border-white/[0.08] overflow-hidden relative">
          <NeuralNet 
            layers={layers} 
            mode={isPlaying ? "forward" : "static"} 
            dropoutMask={dropoutMask}
            className="border-none shadow-none" 
          />
        </div>
      </div>
    </div>
  );
}
