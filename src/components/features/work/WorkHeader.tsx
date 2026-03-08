"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { getElementStyles } from "@/utils/styleUtils";
import { ElementStyle } from "@/types/style";
import { cn } from "@/lib/utils";

interface WorkHeaderProps {
  title?: string;
  description?: string;
  alignment?: "left" | "center" | "right";
  titleStyle?: ElementStyle;
  descriptionStyle?: ElementStyle;
  showLabel?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  contentOffset?: number;
  animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
}

export default function WorkHeader({
  title = "Work",
  description = "바이브 코딩과 AI 에이전트 협업으로 탄생시킨 디지털 아트워크 및 개발 산출물 아카이브입니다.",
  alignment = "left",
  titleStyle,
  descriptionStyle,
  showLabel = true,
  showTitle = true,
  showDescription = true,
  contentOffset = 0,
  animations,
}: Readonly<WorkHeaderProps>) {
  const { getFadeInVariants } = useAnimationEngine(animations);
  const getAlignmentClass = () => {
    if (alignment === "center") return "text-center items-center";
    if (alignment === "right") return "text-right items-end";
    return "text-left items-start";
  };

  const alignmentClass = getAlignmentClass();
  const headerStyles = getElementStyles(titleStyle);
  const descStyles = getElementStyles(descriptionStyle);

  const formattedTitle =
    typeof title === "string"
      ? title.split("\n").map((line, i) => (
          <span key={`${line}-${i}`} className="block">
            {line}
          </span>
        ))
      : title;

  // descriptionStyle.textAlign이 있으면 부모 alignment을 오버라이드하여
  // <p> 태그 자체의 위치(self-align)도 변경해야 시각적으로 반영됨
  const getDescAlignClass = () => {
    const align = descriptionStyle?.textAlign;
    if (!align) return "";
    if (align === "left") return "self-start text-left";
    if (align === "right") return "self-end text-right";
    if (align === "center") return "self-center text-center";
    return "";
  };

  return (
    <motion.div
      variants={getFadeInVariants("up")}
      initial="initial"
      animate="animate"
      className={cn(
        "flex flex-col w-full transition-all duration-500",
        alignmentClass,
      )}
      style={{
        marginTop: contentOffset ? `${contentOffset}px` : undefined,
        gap: titleStyle?.marginBottom ? `${titleStyle.marginBottom}px` : "1rem",
      }}
    >
      {showLabel && (
        <div className="inline-flex items-center space-x-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">
            Selected_Archive
          </span>
        </div>
      )}

      {showTitle && (
        <h1
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8]"
          style={headerStyles}
        >
          {formattedTitle}
        </h1>
      )}

      {showDescription && (
        <p
          className={`text-zinc-500 text-sm max-w-xl font-medium leading-relaxed whitespace-pre-wrap ${getDescAlignClass()}`}
          style={descStyles}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
