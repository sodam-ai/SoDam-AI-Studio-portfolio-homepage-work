"use client";

import { motion } from "framer-motion";
import { Zap, Moon, Sun, Palette } from "lucide-react";
import { useVibe, VibeType } from "./VibeContext";
import React from "react";

const VIBES: {
  id: VibeType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "standard",
    label: "STD",
    icon: <Palette className="w-3 h-3" />,
  },
  {
    id: "cyberpunk",
    label: "CYBER",
    icon: <Zap className="w-3 h-3" />,
  },
  {
    id: "dreamy",
    label: "DREAM",
    icon: <Moon className="w-3 h-3" />,
  },
  {
    id: "mono",
    label: "MONO",
    icon: <Sun className="w-3 h-3" />,
  },
];

export function VibeController() {
  const { vibe, setVibe } = useVibe();

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 dark:bg-black/40 border border-white/5 rounded-full">
      {VIBES.map((v) => (
        <button
          key={v.id}
          onClick={() => setVibe(v.id)}
          className={`
            relative flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black tracking-widest transition-all duration-500
            ${vibe === v.id ? "text-black" : "text-white/30 hover:text-white/60"}
          `}
        >
          {vibe === v.id && (
            <motion.div
              layoutId="vibe-active-bg"
              className="absolute inset-0 bg-white rounded-full z-0 shadow-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
