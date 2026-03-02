/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface MasterpieceCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    description: string;
    aspettoRatio?: string;
  };
  index: number;
  fontSizes?: any;
  mobileFontSizes?: any;
}

export default function MasterpieceCard({
  project,
  index,
  fontSizes = {},
  mobileFontSizes = {},
}: Readonly<MasterpieceCardProps>) {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const h = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // YouTube 썸네일 추출 유틸리티
  const getThumbnailUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return url;
  };

  const thumbnailUrl = getThumbnailUrl(project.thumbnail);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl"
    >
      <Link href={`/work/${project.id}`}>
        <div className="aspect-video overflow-hidden relative">
          {thumbnailUrl ? (
            <motion.img
              style={{ top: h }}
              src={thumbnailUrl}
              alt={project.title}
              className="w-full h-[120%] absolute object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                No_Archive
              </span>
            </div>
          )}

          {/* Overlay gradient - 가독성을 위해 강화 */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

          {/* Content Info */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500 group-hover:-translate-y-2.5">
            <div className="mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20"
                style={{
                  fontSize: `clamp(${mobileFontSizes.cardCategory || 12}px, 1.5vw, ${fontSizes.cardCategory || 12}px)`,
                }}
              >
                {project.category}
              </span>
            </div>

            <h3
              className="font-black text-white mb-3 leading-tight tracking-tighter uppercase italic"
              style={{
                fontSize: `clamp(${mobileFontSizes.cardTitle || 18}px, 4vw, ${fontSizes.cardTitle || 24}px)`,
              }}
            >
              {project.title}
            </h3>

            <div className="overflow-hidden">
              <p
                className="text-white/50 leading-relaxed max-w-[90%] line-clamp-2 font-medium transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                style={{
                  fontSize: `clamp(${mobileFontSizes.bodyText || 13}px, 2vw, ${fontSizes.bodyText || 16}px)`,
                }}
              >
                {project.description}
              </p>
            </div>

            {/* Case Study Button */}
            <div className="mt-6 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
              <span className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-blue-500 pb-1">
                <span>View Case Study</span>
                <span className="text-blue-500">→</span>
              </span>
            </div>
          </div>

          {/* Scanning lines effect on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
        </div>
      </Link>
    </motion.div>
  );
}
