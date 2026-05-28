"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BlockId = "inputs" | "embedding" | "positional" | "multihead" | "addnorm" | "ffn" | "masked" | "cross" | "linear" | "softmax" | "outputs";

export function InteractiveTransformer() {
  const [activeBlock, setActiveBlock] = useState<BlockId | null>(null);

  const blockDescriptions: Record<BlockId, { title: string, desc: string }> = {
    inputs: { title: "Inputs (e.g. English)", desc: "The raw text being fed into the network, tokenized into integer IDs." },
    embedding: { title: "Input Embedding", desc: "Converts the sparse integer IDs into dense, high-dimensional semantic vectors." },
    positional: { title: "Positional Encoding", desc: "Adds sine/cosine waves to the embeddings so the network knows the order of the words." },
    multihead: { title: "Multi-Head Self-Attention", desc: "Allows words to look at each other and dynamically update their meaning (QKV)." },
    addnorm: { title: "Add & Norm", desc: "A residual connection that adds the original input back to the output, followed by Layer Normalization to stabilize training." },
    ffn: { title: "Feed Forward", desc: "A standard Multi-Layer Perceptron (MLP) applied to each word independently to process the attention results." },
    masked: { title: "Masked Multi-Head Attention", desc: "Self-attention for the Decoder. It is 'Masked' so it can only look at previous words, preventing it from 'cheating' by looking at future words during training." },
    cross: { title: "Cross-Attention", desc: "The Decoder looks back at the Encoder! The Query comes from the Decoder, but the Keys and Values come from the Encoder's final output." },
    linear: { title: "Linear Layer", desc: "Projects the final decoder output back into the size of the vocabulary (e.g. 50,000 logits)." },
    softmax: { title: "Softmax", desc: "Converts the raw logits into probability percentages (0% to 100%) to predict the most likely next word." },
    outputs: { title: "Output Probabilities", desc: "The final prediction (e.g., 'Je' with 98% confidence)." }
  };

  const activeInfo = activeBlock ? blockDescriptions[activeBlock] : { title: "Hover over a block", desc: "Explore the architecture of the original Transformer from 'Attention Is All You Need'." };

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-white border border-rose-200 rounded-xl shadow-xl">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-rose-950 tracking-tight">The Transformer Architecture</h2>
        <div className="text-xs font-mono text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          Attention Is All You Need (2017)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Info Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-rose-100 rounded-lg border border-rose-200 flex flex-col gap-4 sticky top-24 min-h-[200px]">
            <h3 className="text-sm font-medium text-cyan-600">Architecture Explorer</h3>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeInfo.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2"
              >
                <div className="font-bold text-lg text-rose-950">{activeInfo.title}</div>
                <div className="text-sm text-rose-600 leading-relaxed">{activeInfo.desc}</div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-rose-50 rounded-xl border border-rose-200 p-8 min-h-[600px] overflow-x-auto">
          
          <div className="flex flex-col md:flex-row gap-16 items-end min-w-[600px]">
            
            {/* ================= ENCODER ================= */}
            <div className="flex flex-col items-center w-48 relative">
              <h3 className="text-sm font-bold text-indigo-700 mb-4 tracking-widest absolute -top-10">ENCODER</h3>
              
              <div 
                className="w-full bg-rose-100/50 border-2 border-indigo-900 rounded-xl p-4 flex flex-col gap-2 pb-6 relative z-10"
              >
                <div className="absolute top-2 right-2 text-[10px] font-mono text-rose-600">Nx</div>
                
                {/* Multi-Head Attention */}
                <div 
                  className={`p-3 rounded-lg border-2 text-center text-xs font-bold cursor-pointer transition-all ${activeBlock === 'multihead' ? 'bg-indigo-600 border-indigo-400 text-rose-950 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white border-rose-300 text-rose-800 hover:border-indigo-500'}`}
                  onMouseEnter={() => setActiveBlock('multihead')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Multi-Head<br/>Attention
                </div>
                
                {/* Add & Norm */}
                <div 
                  className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all ${activeBlock === 'addnorm' ? 'bg-emerald-600 border-emerald-400 text-rose-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-emerald-500'}`}
                  onMouseEnter={() => setActiveBlock('addnorm')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Add & Norm
                </div>

                {/* Feed Forward */}
                <div 
                  className={`p-3 rounded-lg border-2 text-center text-xs font-bold cursor-pointer transition-all mt-4 ${activeBlock === 'ffn' ? 'bg-cyan-600 border-cyan-400 text-rose-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white border-rose-300 text-rose-800 hover:border-cyan-500'}`}
                  onMouseEnter={() => setActiveBlock('ffn')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Feed<br/>Forward
                </div>

                {/* Add & Norm */}
                <div 
                  className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all ${activeBlock === 'addnorm' ? 'bg-emerald-600 border-emerald-400 text-rose-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-emerald-500'}`}
                  onMouseEnter={() => setActiveBlock('addnorm')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Add & Norm
                </div>
              </div>

              {/* Input Pipeline */}
              <div className="w-0.5 h-6 bg-rose-300" />
              
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-rose-400 flex items-center justify-center text-[10px] bg-rose-200 text-rose-600">+</div>
                <div 
                  className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all w-32 ${activeBlock === 'positional' ? 'bg-amber-600 border-amber-400 text-rose-950 shadow-[0_0_15px_rgba(217,119,6,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-amber-500'}`}
                  onMouseEnter={() => setActiveBlock('positional')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Positional Encoding
                </div>
              </div>
              
              <div className="w-0.5 h-6 bg-rose-300" />
              
              <div 
                className={`p-3 rounded-lg border-2 text-center text-xs font-bold cursor-pointer transition-all w-full ${activeBlock === 'embedding' ? 'bg-rose-600 border-rose-400 text-rose-950 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-white border-rose-300 text-rose-800 hover:border-rose-500'}`}
                onMouseEnter={() => setActiveBlock('embedding')} onMouseLeave={() => setActiveBlock(null)}
              >
                Input Embedding
              </div>
              
              <div className="w-0.5 h-6 bg-rose-300" />
              
              <div 
                className={`p-2 rounded text-center text-xs font-bold cursor-pointer w-full text-rose-700 hover:text-rose-950 transition-colors ${activeBlock === 'inputs' ? 'text-rose-950' : ''}`}
                onMouseEnter={() => setActiveBlock('inputs')} onMouseLeave={() => setActiveBlock(null)}
              >
                Inputs
              </div>
            </div>

            {/* ================= DECODER ================= */}
            <div className="flex flex-col items-center w-48 relative">
              <h3 className="text-sm font-bold text-emerald-600 mb-4 tracking-widest absolute -top-40">DECODER</h3>
              
              <div 
                className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all w-full mb-4 ${activeBlock === 'softmax' ? 'bg-purple-600 border-purple-400 text-rose-950 shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-purple-500'}`}
                onMouseEnter={() => setActiveBlock('softmax')} onMouseLeave={() => setActiveBlock(null)}
              >
                Softmax
              </div>

              <div 
                className={`p-2 rounded-lg border-2 text-center text-[10px] font-bold cursor-pointer transition-all w-full mb-4 ${activeBlock === 'linear' ? 'bg-fuchsia-600 border-fuchsia-400 text-rose-950 shadow-[0_0_15px_rgba(192,38,211,0.5)]' : 'bg-white border-rose-300 text-rose-600 hover:border-fuchsia-500'}`}
                onMouseEnter={() => setActiveBlock('linear')} onMouseLeave={() => setActiveBlock(null)}
              >
                Linear
              </div>

              <div 
                className="w-full bg-rose-100/50 border-2 border-emerald-900 rounded-xl p-4 flex flex-col gap-2 pb-6 relative z-10"
              >
                <div className="absolute top-2 right-2 text-[10px] font-mono text-rose-600">Nx</div>
                
                {/* Cross Attention */}
                <div 
                  className={`p-3 rounded-lg border-2 text-center text-xs font-bold cursor-pointer transition-all relative ${activeBlock === 'cross' ? 'bg-orange-600 border-orange-400 text-rose-950 shadow-[0_0_15px_rgba(234,88,12,0.5)]' : 'bg-white border-rose-300 text-rose-800 hover:border-orange-500'}`}
                  onMouseEnter={() => setActiveBlock('cross')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Multi-Head<br/>Attention
                  {/* Connection from Encoder */}
                  <div className="absolute top-1/2 -left-20 w-20 h-0.5 bg-gray-600 -z-10">
                     <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-gray-600" />
                  </div>
                </div>

                {/* Add & Norm */}
                <div 
                  className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all ${activeBlock === 'addnorm' ? 'bg-emerald-600 border-emerald-400 text-rose-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-emerald-500'}`}
                  onMouseEnter={() => setActiveBlock('addnorm')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Add & Norm
                </div>
                
                {/* Masked Multi-Head Attention */}
                <div 
                  className={`p-3 rounded-lg border-2 text-center text-xs font-bold cursor-pointer transition-all mt-4 ${activeBlock === 'masked' ? 'bg-pink-600 border-pink-400 text-rose-950 shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'bg-white border-rose-300 text-rose-800 hover:border-pink-500'}`}
                  onMouseEnter={() => setActiveBlock('masked')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Masked<br/>Multi-Head<br/>Attention
                </div>
                
                {/* Add & Norm */}
                <div 
                  className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all ${activeBlock === 'addnorm' ? 'bg-emerald-600 border-emerald-400 text-rose-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-emerald-500'}`}
                  onMouseEnter={() => setActiveBlock('addnorm')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Add & Norm
                </div>
              </div>

              {/* Input Pipeline */}
              <div className="w-0.5 h-6 bg-rose-300" />
              
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-rose-400 flex items-center justify-center text-[10px] bg-rose-200 text-rose-600">+</div>
                <div 
                  className={`p-2 rounded border-2 text-center text-[10px] font-bold cursor-pointer transition-all w-32 ${activeBlock === 'positional' ? 'bg-amber-600 border-amber-400 text-rose-950 shadow-[0_0_15px_rgba(217,119,6,0.5)]' : 'bg-rose-200 border-rose-400 text-rose-600 hover:border-amber-500'}`}
                  onMouseEnter={() => setActiveBlock('positional')} onMouseLeave={() => setActiveBlock(null)}
                >
                  Positional Encoding
                </div>
              </div>
              
              <div className="w-0.5 h-6 bg-rose-300" />
              
              <div 
                className={`p-3 rounded-lg border-2 text-center text-xs font-bold cursor-pointer transition-all w-full ${activeBlock === 'embedding' ? 'bg-rose-600 border-rose-400 text-rose-950 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-white border-rose-300 text-rose-800 hover:border-rose-500'}`}
                onMouseEnter={() => setActiveBlock('embedding')} onMouseLeave={() => setActiveBlock(null)}
              >
                Output Embedding
              </div>
              
              <div className="w-0.5 h-6 bg-rose-300" />
              
              <div 
                className={`p-2 rounded text-center text-xs font-bold cursor-pointer w-full text-rose-700 hover:text-rose-950 transition-colors ${activeBlock === 'outputs' ? 'text-rose-950' : ''}`}
                onMouseEnter={() => setActiveBlock('outputs')} onMouseLeave={() => setActiveBlock(null)}
              >
                Outputs (Shifted right)
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
