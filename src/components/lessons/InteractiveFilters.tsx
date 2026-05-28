"use client";

import { useState, useEffect, useMemo, useRef } from "react";

type Kernel = number[][];

const KERNELS: Record<string, { label: string, kernel: Kernel, divisor?: number }> = {
  identity: {
    label: "Identity (No Effect)",
    kernel: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ]
  },
  edge_h: {
    label: "Edge Detection (Horizontal)",
    kernel: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1]
    ]
  },
  edge_v: {
    label: "Edge Detection (Vertical)",
    kernel: [
      [-1,  0,  1],
      [-2,  0,  2],
      [-1,  0,  1]
    ]
  },
  sharpen: {
    label: "Sharpen",
    kernel: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0]
    ]
  },
  blur: {
    label: "Box Blur",
    kernel: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    divisor: 9
  }
};

export function InteractiveFilters() {
  const [selectedFilter, setSelectedFilter] = useState<string>("edge_v");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const SIZE = 60; // 60x60 image resolution

  // Generate a simple synthetic image (a white circle and a square on dark bg)
  const originalImage = useMemo(() => {
    const img = new Array(SIZE).fill(0).map(() => new Array(SIZE).fill(0));
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        // Background
        let val = 40;
        
        // Square
        if (x > 10 && x < 25 && y > 10 && y < 45) val = 200;
        
        // Circle
        const dx = x - 40;
        const dy = y - 30;
        if (dx * dx + dy * dy < 15 * 15) val = 255;
        
        // No noise to keep useMemo pure
        
        img[y][x] = Math.max(0, Math.min(255, val));
      }
    }
    return img;
  }, []);

  // Apply convolution
  const filteredImage = useMemo(() => {
    const { kernel, divisor = 1 } = KERNELS[selectedFilter];
    const out = new Array(SIZE).fill(0).map(() => new Array(SIZE).fill(0));
    
    for (let y = 1; y < SIZE - 1; y++) {
      for (let x = 1; x < SIZE - 1; x++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            sum += originalImage[y + ky][x + kx] * kernel[ky + 1][kx + 1];
          }
        }
        sum = sum / divisor;
        
        // If it's an edge detector (has negative values), we might want to take absolute value or shift to 128
        // Let's take absolute value to show edges strongly
        if (selectedFilter.startsWith("edge")) {
          sum = Math.abs(sum);
        }
        
        out[y][x] = Math.max(0, Math.min(255, sum));
      }
    }
    return out;
  }, [originalImage, selectedFilter]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // We render 2 images side by side, 200x200 each
    const scale = 200 / SIZE;
    canvas.width = 420; // 200 + 20 gap + 200
    canvas.height = 200;

    // Draw original
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const val = Math.floor(originalImage[y][x]);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    // Draw gap
    ctx.fillStyle = "#181b21";
    ctx.fillRect(200, 0, 20, 200);

    // Draw filtered
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const val = Math.floor(filteredImage[y][x]);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(220 + x * scale, y * scale, scale, scale);
      }
    }
  }, [originalImage, filteredImage]);

  const activeKernel = KERNELS[selectedFilter];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Interactive Filters</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Select Filter Kernel</h3>
            
            <div className="flex flex-col gap-2">
              <select 
                className="bg-white/[0.06] border border-white/[0.1] text-white/90 text-sm rounded focus:ring-violet-500 focus:border-violet-500 block w-full p-2"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {Object.entries(KERNELS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-col items-center">
              <span className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">3x3 Matrix</span>
              <div className="grid grid-cols-3 gap-1 bg-[#111128] p-2 rounded-lg border border-white/[0.08]">
                {activeKernel.kernel.map((row, y) => (
                  row.map((val, x) => (
                    <div key={`${y}-${x}`} className="w-10 h-10 flex items-center justify-center bg-white/[0.06] text-white/90 font-mono text-sm rounded border border-white/[0.1]">
                      {val}
                    </div>
                  ))
                ))}
              </div>
              {activeKernel.divisor && (
                <div className="mt-2 text-xs text-amber-400 font-mono">
                  Multiplied by 1/{activeKernel.divisor}
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Canvas Display */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6">
          <div className="flex justify-between w-[420px] mb-2 px-2">
            <span className="text-sm font-semibold text-white/35">Original Image</span>
            <span className="text-sm font-semibold text-cyan-400">Filtered Output</span>
          </div>
          <canvas ref={canvasRef} className="rounded border border-white/[0.1] shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]" />
        </div>

      </div>
    </div>
  );
}
