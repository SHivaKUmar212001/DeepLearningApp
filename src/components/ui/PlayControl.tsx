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
    <div className={cn("flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5", className)}>
      <button
        type="button"
        onClick={onPlayPause}
        className="flex size-10 items-center justify-center rounded-full bg-violet-500 text-white transition-[background-color,transform] duration-150 ease-out hover:bg-violet-600 active:scale-[0.93] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d20]"
        aria-label={isPlaying ? "Pause animation" : "Play animation"}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="flex size-10 items-center justify-center rounded-full bg-white/[0.04] text-white/60 transition-[background-color,color,transform] duration-150 ease-out hover:bg-white/[0.08] hover:text-white/90 active:scale-[0.93] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d20]"
          aria-label="Reset animation state"
        >
          <RotateCcw size={18} />
        </button>
      )}
    </div>
  );
}
