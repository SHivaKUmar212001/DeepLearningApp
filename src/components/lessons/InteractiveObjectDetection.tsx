"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

export function InteractiveObjectDetection() {
  const [px, setPx] = useState(50);
  const [py, setPy] = useState(50);
  const [pw, setPw] = useState(80);
  const [ph, setPh] = useState(80);

  // Canvas size
  const W = 320;
  const H = 240;

  // Ground Truth Bounding Box
  const gx = 160;
  const gy = 100;
  const gw = 120;
  const gh = 70;

  // Calculate IoU (Intersection over Union)
  const ix = Math.max(px, gx);
  const iy = Math.max(py, gy);
  const ix2 = Math.min(px + pw, gx + gw);
  const iy2 = Math.min(py + ph, gy + gh);

  const iw = Math.max(0, ix2 - ix);
  const ih = Math.max(0, iy2 - iy);
  const intersection = iw * ih;

  const areaP = pw * ph;
  const areaG = gw * gh;
  const union = areaP + areaG - intersection;

  const iou = union === 0 ? 0 : intersection / union;

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Bounding Box Regression</h2>
        <div className={`text-sm font-bold px-3 py-1 rounded-full border ${iou > 0.7 ? 'bg-emerald-100 text-emerald-400 border-emerald-500/50' : 'bg-red-900/50 text-red-400 border-red-500/50'}`}>
          IoU: {(iou * 100).toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400 mb-2">Network Outputs (Regression Head)</h3>
            
            <div className="flex flex-col gap-5">
              <Slider 
                label={`X Coordinate: ${px}px`}
                value={px} 
                min={0} max={W - pw} 
                onChange={(val) => setPx(val)} 
              />
              <Slider 
                label={`Y Coordinate: ${py}px`}
                value={py} 
                min={0} max={H - ph} 
                onChange={(val) => setPy(val)} 
              />
              <Slider 
                label={`Width: ${pw}px`}
                value={pw} 
                min={20} max={W} 
                onChange={(val) => {
                  setPw(val);
                  if (px + val > W) setPx(W - val);
                }} 
              />
              <Slider 
                label={`Height: ${ph}px`}
                value={ph} 
                min={20} max={H} 
                onChange={(val) => {
                  setPh(val);
                  if (py + val > H) setPy(H - val);
                }} 
              />
            </div>

            <div className="bg-[#111128] mt-2 p-3 rounded border border-white/[0.08] font-mono text-xs text-white/35">
              <span className="text-white/40 block mb-1">Final Vector Output:</span>
              [Class: Car (98%), <span className="text-cyan-400">X:{px}</span>, <span className="text-cyan-400">Y:{py}</span>, <span className="text-amber-400">W:{pw}</span>, <span className="text-amber-400">H:{ph}</span>]
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6">
          <div 
            className="relative bg-white/[0.04] border border-white/[0.1] overflow-hidden shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]"
            style={{ width: W, height: H }}
          >
            {/* Background "Image" */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4f46e5 0%, transparent 60%)' }} />
            
            {/* Ground Truth Object */}
            <div 
              className="absolute flex items-center justify-center text-4xl"
              style={{ left: gx, top: gy, width: gw, height: gh }}
            >
              🚗
            </div>

            {/* Ground Truth Box (Dashed) */}
            <div 
              className="absolute border-2 border-dashed border-emerald-500/50 pointer-events-none transition-all duration-75"
              style={{ left: gx, top: gy, width: gw, height: gh }}
            >
              <span className="absolute -top-5 left-0 text-[10px] text-emerald-500 font-mono font-bold">Ground Truth</span>
            </div>

            {/* Prediction Box */}
            <div 
              className={`absolute border-[3px] shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-none transition-all duration-75
                ${iou > 0.7 ? 'border-emerald-400 bg-emerald-400/10' : 'border-cyan-400 bg-cyan-400/10'}`}
              style={{ left: px, top: py, width: pw, height: ph }}
            >
              <span className={`absolute -top-5 left-0 text-[10px] font-mono font-bold ${iou > 0.7 ? 'text-emerald-400' : 'text-cyan-400'}`}>Prediction</span>
            </div>
          </div>

          <p className="text-xs text-white/40 mt-6 max-w-[90%] text-center leading-relaxed">
            Adjust the sliders to match the predicted box to the ground truth box. The network uses a Loss Function to maximize the <strong>Intersection over Union (IoU)</strong> during training.
          </p>
        </div>

      </div>
    </div>
  );
}
