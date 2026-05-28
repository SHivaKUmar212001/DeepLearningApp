"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveTokenization() {
  const [text, setText] = useState("the quick brown fox jumped over the lazy dogs");

  // Simulated subword tokenizer (BPE-like)
  const tokenize = (input: string) => {
    // Basic normalization
    const clean = input.toLowerCase().replace(/[^\w\s]/gi, ' ');
    const words = clean.split(/\s+/).filter(w => w.length > 0);
    
    const tokens: { text: string, id: number }[] = [];
    
    const suffixes = ["ing", "ed", "ly", "es", "s"];
    
    words.forEach(word => {
      let matchedSuffix = "";
      for (const suffix of suffixes) {
        if (word.endsWith(suffix) && word.length > suffix.length + 1) {
          matchedSuffix = suffix;
          break;
        }
      }

      if (matchedSuffix) {
        const root = word.slice(0, -matchedSuffix.length);
        tokens.push({ text: root, id: hashString(root) });
        tokens.push({ text: `##${matchedSuffix}`, id: hashString(`##${matchedSuffix}`) });
      } else {
        tokens.push({ text: word, id: hashString(word) });
      }
    });

    return tokens;
  };

  // Deterministic fake ID generator
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 9000) + 1000; // Fake IDs between 1000 and 10000
  };

  const tokens = tokenize(text);
  
  // Colors for visual distinction
  const colors = [
    "bg-violet-500", "bg-emerald-500", "bg-[#111128]0", 
    "bg-amber-500", "bg-cyan-500", "bg-purple-500"
  ];

  return (
    <div className="my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">Subword Tokenization</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Vocab Size: ~30,000
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input */}
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] flex flex-col gap-4">
            <h3 className="text-sm font-medium text-cyan-400">Raw Text Input</h3>
            
            <textarea 
              className="w-full h-32 bg-[#111128] border border-white/[0.1] text-white/90 p-3 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a sentence here..."
            />
            
            <p className="text-xs text-white/40 leading-relaxed">
              Neural networks cannot read letters or words. They only understand numbers. 
              Notice how words like &quot;jumped&quot; are split into a root (&quot;jump&quot;) and a suffix (&quot;##ed&quot;).
            </p>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col items-center justify-start bg-[#111128] rounded-xl border border-white/[0.08] p-6 min-h-[300px]">
          
          <div className="w-full">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider font-bold mb-4">Token Sequence (1D Tensor)</h3>
            
            <div className="flex flex-wrap gap-2 content-start">
              <AnimatePresence>
                {tokens.length === 0 && (
                  <div className="text-white/35 italic text-sm">Awaiting input...</div>
                )}
                
                {tokens.map((token, i) => {
                  const colorClass = colors[i % colors.length];
                  const isSubword = token.text.startsWith("##");
                  
                  return (
                    <motion.div
                      key={`${i}-${token.text}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex flex-col rounded overflow-hidden border border-white/[0.1] shadow-[0_0_20px_-8px_rgba(139,92,246,0.2)] ${isSubword ? 'ml-[-4px] rounded-l-none' : ''}`}
                    >
                      <div className={`px-3 py-1.5 text-white/90 font-medium text-sm text-center ${colorClass}`}>
                        {token.text}
                      </div>
                      <div className="bg-white/[0.04] px-2 py-1 text-xs font-mono text-white/35 text-center border-t border-white/[0.1]">
                        {token.id}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {tokens.length > 0 && (
              <div className="mt-8 pt-4 border-t border-white/[0.08]">
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider font-bold mb-2">Final Output Array</h3>
                <div className="font-mono text-emerald-400 text-sm break-all bg-emerald-900/20 p-3 rounded border border-emerald-500/20">
                  [{tokens.map(t => t.id).join(", ")}]
                </div>
              </div>
            )}
            
          </div>

        </div>

      </div>
    </div>
  );
}
