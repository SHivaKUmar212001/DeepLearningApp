"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  className,
}: SliderProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex justify-between text-sm font-medium text-rose-800">
          <label htmlFor={`slider-${label.replace(/\s+/g, "-").toLowerCase()}`}>{label}</label>
          <span className="text-indigo-700 font-mono" aria-hidden="true">
            {Number.isInteger(value) && step >= 1 ? value : value.toFixed(3)}
          </span>
        </div>
      )}
      <div className="relative h-6 flex items-center group">
        {/* Custom background track */}
        <div className="absolute w-full h-1.5 bg-rose-300 rounded-full overflow-hidden pointer-events-none">
          <div
            className="h-full bg-indigo-500 transition-all duration-75 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <input
          id={label ? `slider-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            "w-full appearance-none bg-transparent cursor-pointer relative z-10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-50 rounded-full",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110",
            "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-500 [&::-moz-range-thumb]:transition-transform hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:box-border"
          )}
          aria-label={label}
        />
      </div>
    </div>
  );
}
