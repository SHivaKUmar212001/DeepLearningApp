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
            "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-rose-50",
            checked ? "bg-indigo-500" : "bg-rose-300"
          )}
        />
        <span
          className={cn(
            "absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-rose-800">{label}</span>}
    </label>
  );
}
