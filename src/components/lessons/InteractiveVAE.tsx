"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function InteractiveVAE() {
  // Latent point (x, y) from 0 to 100
  const [point, setPoint] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Distribution centers
  const dist3 = { x: 30, y: 70 };
  const dist8 = { x: 70, y: 30 };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    
    setPoint({ x, y });
  };

  // Calculate interpolation between 3 and 8 based on distances to centers
  const distTo3 = Math.sqrt(Math.pow(point.x - dist3.x, 2) + Math.pow(point.y - dist3.y, 2));
  const distTo8 = Math.sqrt(Math.pow(point.x - dist8.x, 2) + Math.pow(point.y - dist8.y, 2));
  
  // Weights (closer = higher weight)
  const maxDist = 100;
  let weight3 = Math.max(0, 1 - (distTo3 / maxDist) * 1.5);
  let weight8 = Math.max(0, 1 - (distTo8 / maxDist) * 1.5);
  
  // Normalize
  const total = weight3 + weight8 || 1;
  weight3 /= total;
  weight8 /= total;

  // Determine what to render based on weights
  let renderText = "0";
  let opacity = 1;
  let blur = "blur-none";
  let color = "text-rose-950";

  if (weight3 > 0.8) {
    renderText = "3";
    color = "text-indigo-700";
  } else if (weight8 > 0.8) {
    renderText = "8";
    color = "text-rose-600";
  } else {
    // Interpolation zone
    renderText = weight3 > weight8 ? "3" : "8";
    color = "text-fuchsia-600";
    blur = "blur-[2px]";
    opacity = 0.6 + (Math.max(weight3, weight8) * 0.4);
  }

  // Add event listeners for dragging outside container
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">Variational Autoencoders</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Continuous Latent Space
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls / Instructions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-600">Interactive Sampling</h3>
            
            <div className="text-sm text-rose-600 leading-relaxed">
              Drag the <span className="font-bold text-emerald-600">Sample Dot</span> around the continuous 2D Latent Space.
              <br/><br/>
              Notice how the space is no longer jagged. The distribution for &quot;3&quot; smoothly interpolates into the distribution for &quot;8&quot;. 
              <br/><br/>
              By clicking anywhere in this smooth space, the Decoder can generate entirely new images that never existed in the training dataset!
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col md:flex-row items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-8 min-h-[350px] gap-12">
          
          {/* Latent Space 2D Grid */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">2D Latent Space</h3>
            
            <div 
              ref={containerRef}
              className="w-48 h-48 bg-rose-100 border-2 border-rose-300 rounded-lg relative cursor-crosshair overflow-hidden shadow-inner"
              onMouseDown={(e) => { setIsDragging(true); handleDrag(e); }}
              onTouchStart={(e) => { setIsDragging(true); handleDrag(e); }}
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10%_10%]" />
              
              {/* Distribution 3 (Indigo) */}
              <div className="absolute w-24 h-24 bg-indigo-500/30 rounded-full blur-xl pointer-events-none" style={{ left: `${dist3.x}%`, top: `${dist3.y}%`, transform: 'translate(-50%, -50%)' }} />
              <div className="absolute w-12 h-12 bg-indigo-500/50 rounded-full blur-md pointer-events-none" style={{ left: `${dist3.x}%`, top: `${dist3.y}%`, transform: 'translate(-50%, -50%)' }} />
              <div className="absolute text-indigo-600 font-bold text-xs pointer-events-none" style={{ left: `${dist3.x}%`, top: `${dist3.y}%`, transform: 'translate(-50%, -50%)' }}>&mu;=3</div>
              
              {/* Distribution 8 (Rose) */}
              <div className="absolute w-24 h-24 bg-rose-500/30 rounded-full blur-xl pointer-events-none" style={{ left: `${dist8.x}%`, top: `${dist8.y}%`, transform: 'translate(-50%, -50%)' }} />
              <div className="absolute w-12 h-12 bg-rose-500/50 rounded-full blur-md pointer-events-none" style={{ left: `${dist8.x}%`, top: `${dist8.y}%`, transform: 'translate(-50%, -50%)' }} />
              <div className="absolute text-rose-300 font-bold text-xs pointer-events-none" style={{ left: `${dist8.x}%`, top: `${dist8.y}%`, transform: 'translate(-50%, -50%)' }}>&mu;=8</div>

              {/* Draggable Point */}
              <motion.div 
                className="absolute w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)] border-2 border-white cursor-grab active:cursor-grabbing z-10"
                style={{ x: '-50%', y: '-50%' }}
                animate={{ left: `${point.x}%`, top: `${point.y}%` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>
            
            <div className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 border border-emerald-900/50">
              z = [{point.x.toFixed(1)}, {point.y.toFixed(1)}]
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center">
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Decoder</div>
            <svg width="40" height="20" className="text-rose-600">
              <path d="M 0 10 L 35 10 M 25 2 L 35 10 L 25 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div className="md:hidden flex flex-row items-center gap-2">
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Decoder</div>
            <svg width="20" height="20" className="text-rose-600 rotate-90">
              <path d="M 0 10 L 15 10 M 7 2 L 15 10 L 7 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Generated Output */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">Generated Image</h3>
            
            <div className="w-32 h-32 bg-rose-100 border-2 border-emerald-700/50 rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              {/* Overlay Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10%_10%] pointer-events-none" />
              
              <div 
                className={`text-8xl font-bold transition-all duration-100 ${color} ${blur}`}
                style={{ opacity }}
              >
                {renderText}
              </div>
            </div>
            
            <div className="text-[10px] font-mono text-rose-700 mt-2">
              Weights: 3:{(weight3*100).toFixed(0)}% 8:{(weight8*100).toFixed(0)}%
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
