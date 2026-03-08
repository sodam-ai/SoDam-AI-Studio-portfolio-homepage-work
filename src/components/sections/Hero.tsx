"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { ElementStyle, styleToCss, toPx } from "@/types/style";
import { cn } from "@/lib/utils";

interface HeroProps {
  readonly slogan?: string;
  readonly landingHero?: {
    title: string;
    titleStyle?: ElementStyle;
    subtitle: string;
    subtitleStyle?: ElementStyle;
    wordStyles?: string[];
    alignment?: string;
    verticalAlignment?: string;
    titleSubtitleGap?: number;
    contentOffset?: number;
    paddingTop?: number;
    paddingBottom?: number;
    marginTop?: number;
    marginBottom?: number;
    minHeight?: string;
  };
  readonly animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
}

export function Hero({ slogan = "", landingHero, animations }: HeroProps) {
  const [mounted, setMounted] = React.useState(false);
  useAnimationEngine(animations);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayTitle = landingHero?.title || slogan || "Visual Alchemist";
  const alignment = landingHero?.alignment || "center";
  const verticalAlignment = landingHero?.verticalAlignment || "center";
  const titleSubtitleGap = landingHero?.titleSubtitleGap ?? 32;
  const contentOffset = landingHero?.contentOffset ?? 0;
  const paddingTop = landingHero?.paddingTop ?? 160;
  const paddingBottom = landingHero?.paddingBottom ?? 120;
  const marginTop = landingHero?.marginTop ?? 0;
  const marginBottom = landingHero?.marginBottom ?? 0;
  const minHeight = landingHero?.minHeight ?? "100vh";

  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
    justify: "items-stretch text-justify",
  };

  const verticalClasses = {
    top: "justify-start",
    center: "justify-center",
    bottom: "justify-end",
  };

  const currentAlignmentClass =
    alignmentClasses[alignment as keyof typeof alignmentClasses] ||
    alignmentClasses.center;

  const currentVerticalClass =
    verticalClasses[verticalAlignment as keyof typeof verticalClasses] ||
    verticalClasses.center;

  // 정교한 단어 분리 로직: 공백(줄바꿈 포함)을 보존함
  const tokens = displayTitle.split(/(\s+)/);
  let wordCounter = 0;

  return (
    <section
      className={cn(
        "relative flex flex-col items-center overflow-hidden px-6 transition-all duration-500",
        currentVerticalClass,
      )}
      style={{
        paddingTop: toPx(paddingTop),
        paddingBottom: toPx(paddingBottom),
        marginTop: toPx(marginTop + contentOffset),
        marginBottom: toPx(marginBottom),
        minHeight:
          minHeight === "100vh" ? "100vh" : toPx(minHeight as string | number),
      }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-indigo-500/10 blur-[100px] rounded-full"
          style={{ animation: "pulse 8s infinite ease-in-out" }}
        />
      </div>

      <div
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto flex flex-col transition-all duration-500",
          currentAlignmentClass,
        )}
        style={{
          marginTop: toPx(contentOffset),
        }}
      >
        <h1
          className="text-display font-bold tracking-tighter leading-[0.9]"
          style={{
            ...styleToCss(landingHero?.titleStyle),
            whiteSpace: "pre-wrap", // 줄바꿈 보존 필수
          }}
        >
          {tokens.map((token, idx) => {
            const isWhitespace = /\s/.test(token);

            if (isWhitespace) {
              return <span key={`ws-${idx}-${token.length}`}>{token}</span>;
            }

            const currentWordIdx = wordCounter;
            const wordStyle =
              landingHero?.wordStyles?.[currentWordIdx] || "solid";
            wordCounter++;

            // 스타일 클래스 매핑
            const styleClasses = {
              solid: "",
              line: "text-outline font-light",
              accent: "text-accent",
              glow: "text-glow",
            };

            return (
              <motion.span
                key={`word-${idx}-${token}`}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: currentWordIdx * 0.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className={cn(
                  "inline-block mr-[0.05em] last:mr-0 transition-all duration-300",
                  styleClasses[wordStyle as keyof typeof styleClasses] || "",
                )}
              >
                {token}
              </motion.span>
            );
          })}
        </h1>

        {landingHero?.subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-premium text-secondary max-w-2xl text-xl md:text-2xl font-light tracking-tight"
            style={{
              ...styleToCss(landingHero?.subtitleStyle),
              whiteSpace: "pre-wrap",
              marginTop: `${titleSubtitleGap}px`,
            }}
          >
            {landingHero.subtitle}
          </motion.p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
