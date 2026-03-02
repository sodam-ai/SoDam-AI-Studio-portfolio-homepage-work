"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FontSizeControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function FontSizeControl({
  label,
  value,
  onChange,
  min = 8,
  max = 200,
}: FontSizeControlProps) {
  return (
    <div className="space-y-4 p-4 border border-white/5 rounded-lg bg-white/2">
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase tracking-widest text-white/50">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 h-8 text-right bg-black/50 border-white/10 text-xs"
            min={min}
            max={max}
          />
          <span className="text-[10px] text-white/30 uppercase">px</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={1}
        className="py-4"
      />
    </div>
  );
}
