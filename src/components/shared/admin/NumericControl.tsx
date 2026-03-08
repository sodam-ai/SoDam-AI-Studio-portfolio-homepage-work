"use client";

import React from "react";

interface NumericControlProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export const NumericControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "PX",
}: NumericControlProps) => (
  <div className="space-y-4 py-5 border-b border-white/5 last:border-0 hover:bg-white/2 -mx-4 px-4 transition-colors">
    <div className="flex justify-between items-end">
      <div className="space-y-1">
        <label
          htmlFor={`numeric-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
          className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`numeric-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
            type="number"
            value={value}
            step={step}
            onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
            className="bg-white/5 border border-white/10 text-xs font-mono text-white px-2 py-1 focus:border-white/40 transition-colors outline-none w-20"
          />
          <span className="text-[10px] font-mono text-white/40 uppercase">
            {suffix}
          </span>
        </div>
      </div>
      <div className="text-[10px] font-mono text-white/20 select-none">
        {min} - {max} RANGE
      </div>
    </div>
    <div className="flex gap-4 items-center pl-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-white/80 transition-all"
      />
    </div>
  </div>
);
