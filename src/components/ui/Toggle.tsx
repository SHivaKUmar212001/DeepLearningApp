"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  const id = label ? `toggle-${label.replace(/\s+/g, "-").toLowerCase()}` : "toggle-switch";
  
  return (
    <label htmlFor={id} className={cn("flex items-center cursor-pointer gap-3", className)}>
      <div className="relative inline-flex items-center">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div 
          className={cn(
            "h-6 w-11 rounded-full transition-colors duration-200 ease-in-out",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#111113]",
            checked ? "bg-teal-600" : "bg-white/[0.08]"
          )}
        />
        <span
          className={cn(
            "absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-[#0d0d20] shadow transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-white/60">{label}</span>}
    </label>
  );
}
