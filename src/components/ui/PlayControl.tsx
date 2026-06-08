"use client";

import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayControlProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset?: () => void;
  className?: string;
}

export function PlayControl({ isPlaying, onPlayPause, onReset, className }: PlayControlProps) {
  return (
    <div className={cn("flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-teal-600/10 p-1.5 shadow-[0_0_10px_-5px_rgba(139,92,246,0.1)]", className)}>
      <button
        type="button"
        onClick={onPlayPause}
        className="flex size-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-[0_0_20px_-8px_rgba(139,92,246,0.2)] transition-colors hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]"
        aria-label={isPlaying ? "Pause animation" : "Play animation"}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="flex size-10 items-center justify-center rounded-full bg-[#0d0d20] text-white/60 transition-colors hover:bg-[#111128] hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]"
          aria-label="Reset animation state"
        >
          <RotateCcw size={18} />
        </button>
      )}
    </div>
  );
}
