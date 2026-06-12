"use client";

import { motion } from "framer-motion";

export function InteractiveCNN() {
  const architecture = [
    { name: "Input Image", type: "data", shape: "32×32×3", desc: "RGB Pixels", w: 32, h: 32, d: 3, color: "bg-blue-500" },
    { name: "Conv2D + ReLU", type: "op", desc: "Extracts local features (edges)", color: "text-violet-400" },
    { name: "Conv Block 1", type: "data", shape: "32×32×16", desc: "Feature Maps", w: 32, h: 32, d: 16, color: "bg-violet-500" },
    { name: "MaxPool (2×2)", type: "op", desc: "Downsamples spatially", color: "text-amber-400" },
    { name: "Pool 1", type: "data", shape: "16×16×16", desc: "Compressed Features", w: 16, h: 16, d: 16, color: "bg-violet-600" },
    { name: "Conv2D + ReLU", type: "op", desc: "Extracts complex shapes", color: "text-purple-400" },
    { name: "Conv Block 2", type: "data", shape: "16×16×32", desc: "Deep Feature Maps", w: 16, h: 16, d: 32, color: "bg-purple-500" },
    { name: "MaxPool (2×2)", type: "op", desc: "Downsamples spatially", color: "text-amber-400" },
    { name: "Pool 2", type: "data", shape: "8×8×32", desc: "Highly Compressed", w: 8, h: 8, d: 32, color: "bg-purple-600" },
    { name: "Flatten", type: "op", desc: "Unrolls into 1D vector", color: "text-white/35" },
    { name: "1D Vector", type: "data", shape: "2048", desc: "Raw Features", w: 4, h: 4, d: 100, color: "bg-gray-500", is1D: true },
    { name: "Dense (128)", type: "op", desc: "Learns combinations", color: "text-emerald-400" },
    { name: "Hidden Layer", type: "data", shape: "128", desc: "Activations", w: 4, h: 4, d: 64, color: "bg-emerald-500", is1D: true },
    { name: "Dense (10)", type: "op", desc: "Computes logits", color: "text-emerald-400" },
    { name: "Output Probabilities", type: "data", shape: "10", desc: "Class Predictions", w: 4, h: 4, d: 10, color: "bg-[#111128]0", is1D: true }
  ];

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] overflow-hidden">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">CNN Architecture Pipeline (VGG-style)</h2>
      </div>

      <div className="bg-[#111128] rounded-xl border border-white/[0.08] p-6 overflow-x-auto custom-scrollbar">
        <div className="flex items-center min-w-max pb-4 gap-2">
          {architecture.map((layer, i) => {
            if (layer.type === "op") {
              return (
                <div key={i} className="flex flex-col items-center justify-center w-32 px-2 shrink-0">
                  <div className={`font-mono text-sm font-bold ${layer.color} mb-1 text-center`}>{layer.name}</div>
                  <div className="text-[10px] text-white/40 text-center uppercase tracking-wider mb-2 h-6">{layer.desc}</div>
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent relative">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-[#0d0d20] w-4"
                      animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                    />
                  </div>
                </div>
              );
            }

            // Data block (Tensor)
            // Visually scale width/height/depth for effect
            const pxW = layer.is1D ? 8 : Math.max(20, (layer.w || 0) * 1.5);
            const pxH = layer.is1D ? Math.max(40, (layer.d || 0) * 1.5) : Math.max(20, (layer.h || 0) * 1.5);
            const pxDepth = layer.is1D ? 0 : Math.max(5, (layer.d || 0) * 1.5);

            return (
              <div key={i} className="flex flex-col items-center justify-end h-[300px] shrink-0 mx-2">
                
                {/* 3D Representation */}
                <div className="relative flex items-center justify-center mb-12 perspective-1000 h-[150px]">
                  {!layer.is1D ? (
                    <motion.div 
                      className={`relative shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/20 ${layer.color}`}
                      style={{ width: pxW, height: pxH, transformStyle: "preserve-3d", transform: "rotateX(60deg) rotateZ(45deg)" }}
                      whileHover={{ scale: 1.1, rotateZ: 0, rotateX: 0 }}
                    >
                      {/* Depth slices visual trick */}
                      {Array.from({ length: Math.min(5, Math.ceil(pxDepth / 5)) }).map((_, j) => (
                        <div 
                          key={j} 
                          className={`absolute inset-0 border border-white/10 ${layer.color}`}
                          style={{ transform: `translateZ(${-j * 3}px)`, opacity: 1 - j * 0.1 }}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={`relative shadow-lg border border-white/20 ${layer.color}`}
                      style={{ width: pxW, height: pxH, borderRadius: 2 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {/* Lines inside 1D vector */}
                      {Array.from({ length: Math.min(10, Math.ceil(pxH / 6)) }).map((_, j) => (
                        <div key={j} className="h-px bg-[#0d0d20]/20 w-full mt-[5px]" />
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Labels */}
                <div className="bg-white/[0.04] border border-white/[0.08] rounded p-2 text-center w-full min-w-[100px] shadow-lg">
                  <div className="font-bold text-white/90 text-xs mb-1">{layer.name}</div>
                  <div className="font-mono text-cyan-400 text-[10px] bg-[#111128] py-0.5 rounded border border-cyan-900/30">
                    {layer.shape}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <p className="text-xs text-white/40 leading-relaxed text-center px-4">
        Notice the architectural funnel: The spatial dimensions (width and height) constantly shrink due to Max Pooling, while the depth (number of feature channels) constantly expands due to Convolutions. Finally, the 3D volume is flattened into a 1D vector and fed into standard Dense layers to make the final prediction.
      </p>
    </div>
  );
}
