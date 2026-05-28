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
    <div className={cn("flex w-fit items-center gap-2 rounded-full border border-rose-300 bg-rose-100/90 p-1.5 shadow-sm", className)}>
      <button
        type="button"
        onClick={onPlayPause}
        className="flex size-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50"
        aria-label={isPlaying ? "Pause animation" : "Play animation"}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="flex size-10 items-center justify-center rounded-full bg-white text-rose-800 transition-colors hover:bg-rose-50 hover:text-rose-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50"
          aria-label="Reset animation state"
        >
          <RotateCcw size={18} />
        </button>
      )}
    </div>
  );
}
