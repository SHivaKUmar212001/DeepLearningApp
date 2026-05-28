"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveSegmentation() {
  const [masks, setMasks] = useState({
    sky: true,
    tree: true,
    road: true,
    car: true
  });

  const toggleMask = (key: keyof typeof masks) => {
    setMasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Semantic Segmentation</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400 mb-2">Class Masks</h3>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => toggleMask('sky')}
                className={`flex items-center justify-between px-4 py-3 rounded border transition-colors ${masks.sky ? 'bg-blue-900/40 border-blue-500/50 text-blue-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-blue-500 opacity-60" />
                  <span className="font-medium text-sm">Sky (Class 0)</span>
                </div>
                <div className={`w-4 h-4 rounded-sm border ${masks.sky ? 'bg-blue-500 border-blue-400' : 'border-violet-500/30'}`} />
              </button>

              <button 
                onClick={() => toggleMask('tree')}
                className={`flex items-center justify-between px-4 py-3 rounded border transition-colors ${masks.tree ? 'bg-green-900/40 border-green-500/50 text-green-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500 opacity-60" />
                  <span className="font-medium text-sm">Tree (Class 1)</span>
                </div>
                <div className={`w-4 h-4 rounded-sm border ${masks.tree ? 'bg-green-500 border-green-400' : 'border-violet-500/30'}`} />
              </button>

              <button 
                onClick={() => toggleMask('road')}
                className={`flex items-center justify-between px-4 py-3 rounded border transition-colors ${masks.road ? 'bg-[#111128]/60 border-gray-500/50 text-white/60' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-gray-500 opacity-60" />
                  <span className="font-medium text-sm">Road (Class 2)</span>
                </div>
                <div className={`w-4 h-4 rounded-sm border ${masks.road ? 'bg-gray-500 border-gray-400' : 'border-violet-500/30'}`} />
              </button>

              <button 
                onClick={() => toggleMask('car')}
                className={`flex items-center justify-between px-4 py-3 rounded border transition-colors ${masks.car ? 'bg-red-900/40 border-red-500/50 text-red-300' : 'bg-[#111128] border-white/[0.08] text-white/40 hover:border-white/[0.1]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500 opacity-60" />
                  <span className="font-medium text-sm">Car (Class 3)</span>
                </div>
                <div className={`w-4 h-4 rounded-sm border ${masks.car ? 'bg-red-500 border-red-400' : 'border-violet-500/30'}`} />
              </button>
            </div>
            
            <p className="text-xs text-white/40 mt-2 leading-relaxed">
              In segmentation, the output is not a single vector, but a full-resolution 2D matrix where every pixel holds an integer ID corresponding to a class.
            </p>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-6 overflow-hidden">
          
          <div className="relative w-full max-w-[400px] aspect-video bg-sky-200 rounded-lg overflow-hidden shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)] border border-white/[0.1]">
            
            {/* Raw Image Layers (The "Real World") */}
            {/* Sky is bg-sky-200 */}
            
            {/* Sun */}
            <div className="absolute top-4 right-8 w-12 h-12 bg-yellow-300 rounded-full blur-[2px]" />
            
            {/* Tree Trunk */}
            <div className="absolute bottom-[40%] left-[20%] w-6 h-24 bg-amber-800" />
            
            {/* Tree Leaves */}
            <div className="absolute bottom-[55%] left-[10%] w-24 h-24 bg-emerald-700 rounded-full" />
            <div className="absolute bottom-[50%] left-[18%] w-20 h-20 bg-emerald-600 rounded-full" />
            
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-stone-700 transform perspective-1000 rotateX-45 scale-110" />
            {/* Road Lines */}
            <div className="absolute bottom-[20%] left-[10%] w-12 h-1 bg-yellow-400" />
            <div className="absolute bottom-[20%] left-[40%] w-12 h-1 bg-yellow-400" />
            <div className="absolute bottom-[20%] left-[70%] w-12 h-1 bg-yellow-400" />

            {/* Car */}
            <div className="absolute bottom-[15%] left-[45%] w-24 h-10 bg-violet-600 rounded-t-xl" />
            <div className="absolute bottom-[22%] left-[50%] w-14 h-8 bg-sky-100 rounded-t-lg" />
            <div className="absolute bottom-[12%] left-[48%] w-4 h-4 bg-white/[0.04] rounded-full" />
            <div className="absolute bottom-[12%] left-[62%] w-4 h-4 bg-white/[0.04] rounded-full" />


            {/* SEMANTIC MASKS OVERLAY */}
            
            {/* Sky Mask */}
            <AnimatePresence>
              {masks.sky && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-blue-500 mix-blend-multiply opacity-60 z-10"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 60%)' }}
                />
              )}
            </AnimatePresence>

            {/* Tree Mask */}
            <AnimatePresence>
              {masks.tree && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  <div className="absolute bottom-[40%] left-[20%] w-6 h-24 bg-green-500 opacity-80 mix-blend-multiply" />
                  <div className="absolute bottom-[55%] left-[10%] w-24 h-24 bg-green-500 opacity-80 mix-blend-multiply rounded-full" />
                  <div className="absolute bottom-[50%] left-[18%] w-20 h-20 bg-green-500 opacity-80 mix-blend-multiply rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Road Mask */}
            <AnimatePresence>
              {masks.road && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 h-[40%] bg-gray-500 opacity-80 mix-blend-multiply z-10"
                />
              )}
            </AnimatePresence>

            {/* Car Mask */}
            <AnimatePresence>
              {masks.car && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 pointer-events-none"
                >
                  <div className="absolute bottom-[15%] left-[45%] w-24 h-10 bg-red-500 opacity-80 mix-blend-multiply rounded-t-xl" />
                  <div className="absolute bottom-[22%] left-[50%] w-14 h-8 bg-red-500 opacity-80 mix-blend-multiply rounded-t-lg" />
                  <div className="absolute bottom-[12%] left-[48%] w-4 h-4 bg-red-500 opacity-80 mix-blend-multiply rounded-full" />
                  <div className="absolute bottom-[12%] left-[62%] w-4 h-4 bg-red-500 opacity-80 mix-blend-multiply rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
          
        </div>

      </div>
    </div>
  );
}
