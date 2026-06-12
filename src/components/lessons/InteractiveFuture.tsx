"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Scale, Globe, Code, Zap, Droplet, type LucideIcon } from "lucide-react";

type Topic = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  x: number;
  y: number;
};

export function InteractiveFuture() {
  const [activeTopic, setActiveTopic] = useState<string>("agi");

  const topics: Topic[] = [
    {
      id: "agi",
      title: "Artificial General Intelligence",
      icon: Brain,
      color: "from-fuchsia-600 to-purple-600",
      desc: "The holy grail of AI research: creating a system that can understand, learn, and apply knowledge across any intellectual task that a human can perform.",
      x: 50,
      y: 15
    },
    {
      id: "alignment",
      title: "AI Alignment",
      icon: Scale,
      color: "from-blue-600 to-indigo-600",
      desc: "As models approach AGI, how do we ensure their goals align with human values? Research focuses on scalable oversight and mechanistic interpretability.",
      x: 20,
      y: 40
    },
    {
      id: "world",
      title: "World Models",
      icon: Globe,
      color: "from-emerald-600 to-teal-600",
      desc: "Moving beyond predicting the next word, models like Sora learn a physics engine of the real world, allowing them to simulate and plan complex scenarios.",
      x: 80,
      y: 40
    },
    {
      id: "mamba",
      title: "State Space Models",
      icon: Code,
      color: "from-rose-600 to-orange-600",
      desc: "Transformers require massive memory to remember long contexts. SSMs like Mamba offer linear scaling, potentially replacing Attention entirely.",
      x: 35,
      y: 65
    },
    {
      id: "neuro",
      title: "Neuromorphic Chips",
      icon: Zap,
      color: "from-amber-600 to-yellow-600",
      desc: "Hardware designed to physically mimic the human brain using Spiking Neural Networks, offering 1000x improvements in power efficiency over GPUs.",
      x: 65,
      y: 65
    },
    {
      id: "liquid",
      title: "Liquid Neural Nets",
      icon: Droplet,
      color: "from-cyan-600 to-blue-600",
      desc: "Continuous-time networks that can dynamically change their underlying equations *after* training, perfect for adapting to unknown environments like drone flight.",
      x: 50,
      y: 85
    }
  ];

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">The Frontier of Deep Learning</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Active Research
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visualizer (Tech Tree) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-4 pb-14 min-h-[480px] relative">
          
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <path d="M 50% 15% Q 50% 30% 20% 40%" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="5 5" />
            <path d="M 50% 15% Q 50% 30% 80% 40%" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="5 5" />
            
            <path d="M 20% 40% Q 20% 60% 35% 65%" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="5 5" />
            <path d="M 80% 40% Q 80% 60% 65% 65%" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="5 5" />
            
            <path d="M 35% 65% Q 50% 78% 50% 85%" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="5 5" />
            <path d="M 65% 65% Q 50% 78% 50% 85%" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="5 5" />
          </svg>

          {/* Nodes */}
          {topics.map((t) => {
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex items-center justify-center transition-all duration-300 z-10 
                  ${isActive ? `bg-gradient-to-br ${t.color} border-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]` : 'bg-white/[0.04] border-white/[0.1] hover:border-gray-500'}`}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <t.icon size={24} className={isActive ? "text-white" : "text-white/50"} aria-hidden="true" />
                <span className={`absolute -bottom-8 w-32 text-center text-[10px] font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-white/90' : 'text-white/40'}`}>
                  {t.title}
                </span>
              </button>
            );
          })}

        </div>

        {/* Info Card */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div className="flex-1 bg-white/[0.04] rounded-lg border border-white/[0.08] overflow-hidden relative">
            <AnimatePresence mode="wait">
              {topics.map((t) => {
                if (t.id !== activeTopic) return null;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 p-8 flex flex-col justify-center"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <t.icon size={32} className="text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white/90 mb-4 leading-tight">{t.title}</h3>
                    <div className="h-1 w-12 bg-gradient-to-r from-gray-700 to-transparent mb-6 rounded-full" />
                    <p className="text-white/35 leading-relaxed text-sm md:text-base">
                      {t.desc}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
