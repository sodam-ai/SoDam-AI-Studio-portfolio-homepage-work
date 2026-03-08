"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectHeaderProps {
  category: string;
}

export function ProjectHeader({ category }: ProjectHeaderProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 pointer-events-none">
      <div className="container mx-auto flex justify-between items-center pointer-events-auto">
        <Link
          href="/work"
          className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-sm font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group shadow-2xl"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" />
          <span className="hidden sm:inline">Back to Archive</span>
          <span className="sm:hidden">Work</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
            {category}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-12 h-12 rounded-full bg-(--accent-primary)/10 backdrop-blur-xl border border-(--accent-primary)/20 flex items-center justify-center text-(--accent-primary) hover:bg-(--accent-primary)/20 transition-all"
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
