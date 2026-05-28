"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { PlayControl } from "@/components/ui/PlayControl";
import { useOptimizerStore, SurfaceType } from "@/lib/store/optimizer";
import { TrainingChart } from "@/components/viz/TrainingChart";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { cn } from "@/lib/utils";

import { Maximize, Minimize } from "lucide-react";

// Lazy load the 3D surface to prevent large bundle on initial load
const LossSurface3D = dynamic(() => import("@/components/viz/LossSurface3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-rose-50 rounded-xl flex items-center justify-center border border-rose-200">
      <span className="text-rose-700 font-mono text-sm">Loading 3D visualization...</span>
    </div>
  )
});

export function InteractiveDescent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    lr, momentum, optimizerType, surfaceType, isPlaying, history, currentStepIndex,
    setHyperparams, setSurfaceType, play, pause, reset, scrub, tick 
  } = useOptimizerStore();

  const [useMomentum, setUseMomentum] = useState(optimizerType === "Momentum");

  // Sync local toggle state to store
  useEffect(() => {
    setHyperparams(lr, useMomentum ? momentum : 0, 0.999, useMomentum ? "Momentum" : "SGD");
  }, [lr, momentum, useMomentum, setHyperparams]);

  // Physics tick loop
  useEffect(() => {
    if (!isPlaying) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const loop = (time: number) => {
      if (time - lastTime > 50) { // ~20fps physics tick
        tick();
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, tick]);

  const current = history[currentStepIndex];
  
  // Divergence check
  const isDiverged = current && current.loss > 1000;
  const isConverged = current && current.loss < 0.01;

  // Prevent background scrolling when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  return (
    <div className={cn(
      "flex flex-col gap-6 transition-all duration-300",
      isExpanded 
        ? "fixed inset-0 z-[100] bg-rose-50 overflow-y-auto p-4 md:p-8"
        : "my-8 p-6 bg-white border border-rose-200 rounded-xl shadow-xl"
    )}>
      {/* Header and Controls */}
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Interactive Lab</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 bg-rose-200 border border-rose-300 hover:bg-rose-300 rounded-md text-rose-800 hover:text-rose-950 transition-colors flex items-center gap-2 text-xs font-semibold shadow-sm"
        >
          {isExpanded ? <><Minimize size={14} /> Exit Fullscreen</> : <><Maximize size={14} /> Fullscreen</>}
        </button>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-rose-800 flex items-center justify-between">
              Loss Surface
              <span className="text-xs text-indigo-700 font-normal">Try different terrains</span>
            </label>
            <select 
              className="bg-rose-200 border border-rose-300 text-rose-950 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
              value={surfaceType}
              onChange={(e) => setSurfaceType(e.target.value as SurfaceType)}
            >
              <option value="bowl">Convex Bowl (Easy)</option>
              <option value="saddle">Saddle Point (Medium)</option>
              <option value="ravine">Ravine (Hard)</option>
              <option value="rosenbrock">Rosenbrock Valley (Very Hard)</option>
            </select>
          </div>
          
          <Slider 
            label="Learning Rate" 
            min={0.001} max={surfaceType === "rosenbrock" ? 0.01 : 0.2} step={0.001} 
            value={lr} onChange={(v) => setHyperparams(v, momentum, 0.999, optimizerType)} 
          />
          
          <Slider 
            label="Momentum" 
            min={0} max={0.99} step={0.01} 
            value={momentum} onChange={(v) => setHyperparams(lr, v, 0.999, optimizerType)} 
          />
          
          <div className="flex items-center justify-between mt-2">
            <Toggle 
              label="Use Momentum" 
              checked={useMomentum} 
              onChange={setUseMomentum} 
            />
            <PlayControl 
              isPlaying={isPlaying} 
              onPlayPause={() => isPlaying ? pause() : play()} 
              onReset={reset}
            />
          </div>
          
          {/* Timeline Scrubber */}
          <div className="mt-4 p-4 bg-rose-100 rounded-lg border border-rose-200">
            <Slider 
              label="Timeline Scrub"
              min={0}
              max={Math.max(1, history.length - 1)}
              step={1}
              value={currentStepIndex}
              onChange={scrub}
            />
            <p className="text-xs text-rose-700 mt-3 text-center">
              Drag the scrubber to review the optimizer&apos;s past steps.
            </p>
          </div>
        </div>
        
        {/* Readout Panel */}
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 flex flex-col justify-between font-mono text-sm">
          <div>
            <h3 className="text-xs uppercase text-rose-700 font-semibold mb-3 tracking-wider">Optimizer State</h3>
            {current ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col"><span className="text-rose-700">Step</span><span className="text-rose-950 text-lg">{current.step}</span></div>
                <div className="flex flex-col"><span className="text-rose-700">Loss</span><span className={cn("text-lg", isDiverged ? "text-red-500" : "text-amber-600")}>{current.loss > 1e6 ? "NaN" : current.loss.toFixed(4)}</span></div>
                <div className="flex flex-col"><span className="text-rose-700">X</span><span className="text-rose-800">{current.x.toFixed(3)}</span></div>
                <div className="flex flex-col"><span className="text-rose-700">Y</span><span className="text-rose-800">{current.y.toFixed(3)}</span></div>
                <div className="flex flex-col"><span className="text-rose-700">∇X</span><span className="text-rose-600">{current.gx.toFixed(3)}</span></div>
                <div className="flex flex-col"><span className="text-rose-700">∇Y</span><span className="text-rose-600">{current.gy.toFixed(3)}</span></div>
              </div>
            ) : null}
          </div>
          
          <div className="mt-4 pt-4 border-t border-rose-200">
            {isDiverged ? (
              <div className="text-red-500 font-bold bg-red-500/10 p-2 rounded">Warning: Divergence! LR too high.</div>
            ) : isConverged ? (
              <div className="text-green-400 font-bold bg-green-500/10 p-2 rounded">Converged!</div>
            ) : (
              <div className="text-indigo-700">Optimizing...</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Visualizations */}
      <div className="w-full flex flex-col gap-2 mt-4">
        {/* Helper Tip */}
        <div className="text-sm text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
          <span className="text-lg">💡</span>
          <strong>Tip:</strong> Click and drag the 3D plot below to rotate your view. Use your scroll wheel to zoom in and out.
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3">
            <ErrorBoundary>
              <LossSurface3D />
            </ErrorBoundary>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col justify-start">
            <TrainingChart height={250} />
            <p className="text-xs text-rose-700 text-center mt-3 px-4">
              The chart above tracks the loss value over time. Watch it drop as the optimizer finds the minimum!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
