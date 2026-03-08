"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { styleToCss, ElementStyle } from "@/types/style";

// src/components/sections/ProjectCard.tsx - modified by antigravity
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail: string;
  aspectRatio?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  categoryStyle?: ElementStyle;
  titleStyle?: ElementStyle;
  descriptionStyle?: ElementStyle;
}

export function ProjectCard({
  project,
  index,
  categoryStyle,
  titleStyle,
  descriptionStyle,
}: Readonly<ProjectCardProps>) {
  return (
    <Link href={`/work/${project.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="group relative flex flex-col space-y-6 cursor-pointer"
      >
        <div
          className="relative bg-neutral-900 border border-white/5 overflow-hidden rounded-sm group-hover:border-white/20 transition-colors duration-700"
          style={{
            aspectRatio:
              project.aspectRatio && project.aspectRatio !== "auto"
                ? project.aspectRatio
                : "4/5",
          }}
        >
          {/* Grainy Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-10 mixed-blend-overlay" />

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000 z-10" />

          <motion.img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
          />

          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
            <div className="px-6 py-3 glass-effect rounded-full">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                View Project
              </span>
            </div>
          </div>

          <div className="absolute top-6 left-6 z-20">
            <div
              className="bg-black/40 backdrop-blur-md px-3 py-1 border border-white/5 rounded-full"
              style={styleToCss(categoryStyle)}
            >
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60">
                {project.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 px-1">
          <div className="flex justify-between items-end">
            <h3
              className="text-xl font-bold uppercase tracking-tight text-white leading-none text-premium"
              style={styleToCss(titleStyle)}
            >
              {project.title}
            </h3>
            <span className="text-[10px] font-mono opacity-20 text-white">
              /{index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
          </div>
          <p
            className="text-[11px] text-white/40 font-medium leading-relaxed max-w-[95%] line-clamp-2"
            style={styleToCss(descriptionStyle)}
          >
            {project.description}
          </p>
          <div className="flex gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[8px] uppercase tracking-widest text-white/20 border border-white/5 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
