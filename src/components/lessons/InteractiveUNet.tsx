"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type HoverState = "none" | "down" | "bottle" | "up" | "skip";

export function InteractiveUNet() {
  const [hoverState, setHoverState] = useState<HoverState>("none");

  return (
    <div className="not-prose my-8 flex flex-col gap-6 p-6 bg-[#0d0d20] border border-white/[0.08] rounded-xl shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)]">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-xl font-bold text-white/90 tracking-tight">The U-Net Architecture</h2>
        <div className="text-xs font-mono text-white/40 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
          Spatial Denoising
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls / Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-4 bg-white/[0.04] rounded-lg border border-white/[0.08] min-h-[250px]">
            {hoverState === "none" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-cyan-400">Hover over the diagram</h3>
                <p className="text-sm text-white/35 leading-relaxed">
                  The U-Net is the neural network engine that powers Diffusion Models. It takes a noisy image, compresses it to understand the global context, and then expands it to predict the noise at every individual pixel.
                  <br/><br/>
                  Hover over the different sections of the U-Net to learn how it works!
                </p>
              </div>
            )}
            
            {hoverState === "down" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-violet-400">Downsampling (Encoder)</h3>
                <p className="text-sm text-white/35 leading-relaxed">
                  The network uses Convolutional layers to progressively halve the spatial dimensions of the image while doubling the number of feature channels.
                  <br/><br/>
                  This allows the network to &quot;zoom out&quot; and understand the <strong>global context</strong> of the image (e.g., &quot;This noise pattern looks like the general shape of a cat&quot;).
                </p>
              </div>
            )}

            {hoverState === "bottle" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-fuchsia-600">The Bottleneck</h3>
                <p className="text-sm text-white/35 leading-relaxed">
                  At the very bottom of the U, the image has been compressed into a highly abstract, dense representation.
                  <br/><br/>
                  Here, the network has maximum global context, but has lost all fine-grained pixel details. It knows <em>what</em> is in the image, but not exactly <em>where</em> the edges are.
                </p>
              </div>
            )}

            {hoverState === "up" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-white/35">Upsampling (Decoder)</h3>
                <p className="text-sm text-white/35 leading-relaxed">
                  The network uses Transposed Convolutions to progressively double the spatial dimensions back up to the original image size.
                  <br/><br/>
                  This allows the network to take its abstract understanding and translate it back into high-resolution pixel predictions.
                </p>
              </div>
            )}

            {hoverState === "skip" && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-emerald-400">Skip Connections</h3>
                <p className="text-sm text-white/35 leading-relaxed">
                  <strong>This is the magic of the U-Net.</strong>
                  <br/><br/>
                  Because the Bottleneck loses all fine pixel details, the Upsampling path can&apos;t draw sharp edges. Skip connections take the high-resolution feature maps from the Downsampling path and directly concatenate them onto the Upsampling path!
                  <br/><br/>
                  This gives the network BOTH global context AND perfectly sharp local details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#111128] rounded-xl border border-white/[0.08] p-8 min-h-[400px]">
          
          <div className="relative w-full max-w-lg h-80 flex justify-between items-start">
            
            {/* Input (Noisy) */}
            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-8 flex flex-col items-center">
              <span className="text-[10px] font-mono text-white/40 mb-1">Input $x_t$</span>
              <div className="w-12 h-12 bg-black border border-white/[0.1] rounded shadow-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 mix-blend-screen opacity-50" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
              </div>
            </div>

            {/* Output (Noise Prediction) */}
            <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-8 flex flex-col items-center">
              <span className="text-[10px] font-mono text-white/40 mb-1 font-bold text-center">Noise Prediction<br/>$\epsilon_\theta$</span>
              <div className="w-12 h-12 bg-black border border-white/[0.05] rounded shadow-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 mix-blend-normal opacity-80" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
              </div>
            </div>

            {/* Left side (Downsampling) */}
            <div 
              className="flex flex-col items-center h-full justify-between z-10 cursor-pointer"
              onMouseEnter={() => setHoverState("down")}
              onMouseLeave={() => setHoverState("none")}
            >
              {[64, 48, 32].map((size, i) => (
                <motion.div 
                  key={`down-${i}`}
                  className={`border-2 rounded bg-indigo-950/40 flex items-center justify-center transition-colors ${hoverState === "down" ? 'border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'border-indigo-900/50'}`}
                  style={{ width: size, height: size }}
                  animate={{ scale: hoverState === "down" ? 1.05 : 1 }}
                />
              ))}
              <div className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${hoverState === "down" ? 'text-violet-400' : 'text-white/35'}`}>
                Downsample
              </div>
            </div>

            {/* Middle (Bottleneck) */}
            <div 
              className="flex flex-col items-center justify-end h-[85%] z-10 cursor-pointer"
              onMouseEnter={() => setHoverState("bottle")}
              onMouseLeave={() => setHoverState("none")}
            >
              <motion.div 
                className={`border-2 rounded bg-fuchsia-950/40 flex items-center justify-center transition-colors ${hoverState === "bottle" ? 'border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.5)]' : 'border-fuchsia-900/50'}`}
                style={{ width: 16, height: 16 }}
                animate={{ scale: hoverState === "bottle" ? 1.2 : 1 }}
              />
              <div className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${hoverState === "bottle" ? 'text-fuchsia-600' : 'text-white/35'}`}>
                Bottleneck
              </div>
            </div>

            {/* Right side (Upsampling) */}
            <div 
              className="flex flex-col items-center h-full justify-between z-10 cursor-pointer"
              onMouseEnter={() => setHoverState("up")}
              onMouseLeave={() => setHoverState("none")}
            >
              {[64, 48, 32].reverse().map((size, i) => (
                <motion.div 
                  key={`up-${i}`}
                  className={`border-2 rounded bg-[#06060e]/40 flex items-center justify-center transition-colors ${hoverState === "up" ? 'border-violet-500/30 shadow-[0_0_15px_rgba(251,113,133,0.5)]' : 'border-white/[0.08]'}`}
                  style={{ width: size, height: size }}
                  animate={{ scale: hoverState === "up" ? 1.05 : 1 }}
                />
              ))}
              <div className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${hoverState === "up" ? 'text-white/35' : 'text-white/35'}`}>
                Upsample
              </div>
            </div>

            {/* Skip Connections (SVG Lines) — interactive, sit between columns */}
            <svg
              className="absolute inset-0 w-full h-[75%] z-[5] cursor-pointer"
              style={{ overflow: 'visible' }}
              onMouseEnter={() => setHoverState("skip")}
              onMouseLeave={() => setHoverState("none")}
            >
              {/* Invisible thick hit areas for each skip line */}
              <line x1="18%" y1="12%" x2="82%" y2="12%" stroke="transparent" strokeWidth="20" />
              <line x1="18%" y1="50%" x2="82%" y2="50%" stroke="transparent" strokeWidth="20" />
              <line x1="18%" y1="88%" x2="82%" y2="88%" stroke="transparent" strokeWidth="20" />
              {/* Visible dashed lines */}
              <motion.line
                x1="12%" y1="12%" x2="88%" y2="12%"
                stroke={hoverState === "skip" ? "#34d399" : "#1f2937"}
                strokeWidth="2" strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.line
                x1="12%" y1="50%" x2="88%" y2="50%"
                stroke={hoverState === "skip" ? "#34d399" : "#1f2937"}
                strokeWidth="2" strokeDasharray="4 4"
              />
              <motion.line
                x1="12%" y1="88%" x2="88%" y2="88%"
                stroke={hoverState === "skip" ? "#34d399" : "#1f2937"}
                strokeWidth="2" strokeDasharray="4 4"
              />
            </svg>

          </div>
          
        </div>

      </div>
    </div>
  );
}
