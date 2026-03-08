/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { styleToCss, toPx } from "@/types/style";
import { cn } from "@/lib/utils";

interface VibeShowcaseProps {
  settings?: any;
}

export default function VibeShowcase({
  settings,
}: Readonly<VibeShowcaseProps>) {
  const animations = settings?.appearance?.animations;
  const animationEngine = useAnimationEngine(animations);
  const getFadeInVariants = animationEngine.getFadeInVariants;
  const philosophy = settings?.landing?.sections?.philosophy || {};

  if (philosophy.isVisible === false) return null;

  const philosophyTitle = philosophy.title || "Philosophy";
  const words = philosophyTitle.split(" ");
  const lastWord = words.pop() || "";
  const firstWords = words.join(" ");

  const sectionStyle: React.CSSProperties = {
    paddingTop:
      philosophy.paddingTop !== undefined
        ? toPx(philosophy.paddingTop)
        : "var(--section-gap, 100px)",
    paddingBottom:
      philosophy.paddingBottom !== undefined
        ? toPx(philosophy.paddingBottom)
        : "var(--section-gap, 100px)",
    opacity: philosophy.opacity ?? 1,
    marginTop: toPx(
      (philosophy.marginTop ?? 0) + (philosophy.contentOffset ?? 0),
    ),
    marginBottom: toPx(philosophy.marginBottom),
    transition: "all 0.5s ease-out",
  };
  return (
    <section
      className="relative flex items-center justify-center bg-black overflow-hidden"
      style={sectionStyle}
    >
      <motion.div
        variants={getFadeInVariants("up")}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-10%" }}
        className="mx-auto px-6 text-center space-y-10 w-full"
        style={{
          maxWidth: "var(--content-max-width, 800px)",
        }}
      >
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5",
            philosophy.alignment === "left" && "mr-auto",
            philosophy.alignment === "right" && "ml-auto",
          )}
          style={styleToCss(philosophy.subtitleStyle)}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30">
            {philosophy.subtitle || "The Philosophy"}
          </span>
        </div>
        <h2
          className={cn(
            "font-black uppercase tracking-tighter text-white whitespace-pre-line",
            philosophy.alignment === "left" && "text-left",
            philosophy.alignment === "right" && "text-right",
          )}
          style={{
            fontSize: `clamp(32px, 8vw, 90px)`,
            lineHeight: "0.9",
            ...styleToCss(philosophy.titleStyle),
          }}
        >
          {firstWords}
          <span
            className="text-transparent stroke-white/20 stroke-1 ml-2 block sm:inline"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              ...styleToCss(philosophy.titleStyle),
              fontSize: "inherit",
              lineHeight: "inherit",
            }}
          >
            {lastWord}
          </span>
        </h2>
        <p
          className={cn(
            "text-white/40 font-light leading-relaxed whitespace-pre-line text-balance mx-auto",
            philosophy.alignment === "left" && "text-left ml-0",
            philosophy.alignment === "right" && "text-right mr-0",
            philosophy.alignment === "center" && "text-center",
          )}
          style={{
            fontSize: `clamp(14px, 2.5vw, 22px)`,
            lineHeight: "1.6",
            maxWidth: "600px",
            ...styleToCss(philosophy.descriptionStyle),
          }}
        >
          {philosophy.description ||
            "단순한 도구를 넘어, AI와 함께 이미지, 영상, 코드를 조각하고 다듬습니다.\n바이브 코딩은 상상을 현실로 전환하는 가장 빠른 인터페이스입니다."}
        </p>
      </motion.div>
    </section>
  );
}
