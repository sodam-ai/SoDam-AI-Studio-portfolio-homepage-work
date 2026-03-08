"use client";

import React from "react";

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const FontSelector = ({ label, value, onChange }: FontSelectorProps) => {
  const fonts = [
    "Inter",
    "Outfit",
    "Space Grotesk",
    "Bebas Neue",
    "Roboto Mono",
    "Playfair Display",
    "Syne",
  ];
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {fonts.map((font) => (
          <button
            key={font}
            onClick={() => onChange(font)}
            className={`px-3 py-2 text-[10px] text-left border rounded-xs transition-all duration-200 active:scale-[0.98] ${
              value === font
                ? "bg-white text-black border-white font-bold"
                : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
            }`}
            style={{ fontFamily: font }}
          >
            {font}
          </button>
        ))}
      </div>
    </div>
  );
};
