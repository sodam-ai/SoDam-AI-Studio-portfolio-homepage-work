/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/work";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { ElementStyle, styleToCss, toPx } from "@/types/style";

const MotionImage = motion.create(Image);

interface MasterpieceCardProps {
  project: Project;
  index: number;
  fontSizes?: any;
  mobileFontSizes?: any;
  animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
  categoryStyle?: ElementStyle;
  titleStyle?: ElementStyle;
  descriptionStyle?: ElementStyle;
}

export default function MasterpieceCard({
  project,
  index,
  fontSizes = {},
  mobileFontSizes = {},
  animations,
  categoryStyle,
  titleStyle,
  descriptionStyle,
  // 추가된 제어 props
  globalAspectRatio,
  showCategory = true,
  showTitle = true,
  showDescription = true,
  showLink = true,
}: Readonly<
  MasterpieceCardProps & {
    globalAspectRatio?: string;
    showCategory?: boolean;
    showTitle?: boolean;
    showDescription?: boolean;
    showLink?: boolean;
  }
>) {
  const { getFadeInVariants } = useAnimationEngine(animations);
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const h = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // YouTube ID 추출 유틸리티
  const getYoutubeId = (url: string | undefined) => {
    if (!url) return null;
    const match =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/.exec(
        url,
      );
    return match ? match[1] : null;
  };

  // YouTube 썸네일 추출 유틸리티 및 Fallback
  const getThumbnailUrl = () => {
    if (project.thumbnail) {
      const vidId = getYoutubeId(project.thumbnail);
      if (vidId) {
        return `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`;
      }
      return project.thumbnail;
    }
    if (project.images && project.images.length > 0) {
      return project.images[0];
    }
    const videoYtId = getYoutubeId(project.videoUrl);
    if (videoYtId) {
      return `https://img.youtube.com/vi/${videoYtId}/maxresdefault.jpg`;
    }
    const liveYtId = getYoutubeId(project.liveUrl);
    if (liveYtId) {
      return `https://img.youtube.com/vi/${liveYtId}/maxresdefault.jpg`;
    }
    return "";
  };

  const thumbnailUrl = getThumbnailUrl();

  // 비율 결정: 전역 설정 우선 -> 개별 설정 -> 기본값
  const currentAspectRatio = globalAspectRatio || project.aspectRatio || "16/9";
  const aspectStyle =
    currentAspectRatio !== "auto"
      ? { aspectRatio: currentAspectRatio }
      : { aspectRatio: "16/9" };

  return (
    <motion.div
      ref={containerRef}
      variants={getFadeInVariants("up", index * 0.1)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-10%" }}
      className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl"
    >
      <Link href={`/work/${project.id}`}>
        <div className="w-full overflow-hidden relative" style={aspectStyle}>
          {thumbnailUrl ? (
            <MotionImage
              style={{ top: h }}
              src={thumbnailUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-[120%] absolute object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                No_Archive
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

          {/* Content Info Container */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            {showCategory && (
              <div className="mb-4">
                <span
                  className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl font-black uppercase tracking-[0.2em] text-blue-400 border border-blue-500/20"
                  style={{
                    ...styleToCss(categoryStyle),
                    fontSize: categoryStyle?.fontSize
                      ? toPx(categoryStyle.fontSize)
                      : `clamp(${mobileFontSizes.cardCategory || 12}px, 1.5vw, ${fontSizes.cardCategory || 12}px)`,
                  }}
                >
                  {project.category}
                </span>
              </div>
            )}

            {showTitle && (
              <h3
                className="font-black text-white mb-3 leading-tight tracking-tighter uppercase italic"
                style={{
                  ...styleToCss(titleStyle),
                  fontSize: titleStyle?.fontSize
                    ? toPx(titleStyle.fontSize)
                    : `clamp(${mobileFontSizes.cardTitle || 18}px, 4vw, ${fontSizes.cardTitle || 24}px)`,
                }}
              >
                {project.title}
              </h3>
            )}

            {showDescription && (
              <div className="overflow-hidden">
                <p
                  className="text-white/50 leading-relaxed max-w-[90%] line-clamp-2 font-medium transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  style={{
                    ...styleToCss(descriptionStyle),
                    fontSize: descriptionStyle?.fontSize
                      ? toPx(descriptionStyle.fontSize)
                      : `clamp(${mobileFontSizes.bodyText || 13}px, 2vw, ${fontSizes.bodyText || 16}px)`,
                  }}
                >
                  {project.description}
                </p>
              </div>
            )}

            {/* Case Study Button */}
            {showLink && (
              <div className="mt-6 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                <span className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-blue-500 pb-1">
                  <span>View Case Study</span>
                  <span className="text-blue-500">→</span>
                </span>
              </div>
            )}
          </div>

          {/* Scanning lines effect on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
        </div>
      </Link>
    </motion.div>
  );
}
