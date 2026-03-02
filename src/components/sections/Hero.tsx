/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";

// Removed static site-config import to ensure runtime consistency when modified via admin
// site-config.json can be passed as props from the parent server component (page.tsx)

export interface SiteConfig {
  slogan: string;
  role: string;
  bio: string;
  landingHero?: {
    title: string;
    subtitle: string;
  };
}

interface HeroProps {
  readonly slogan?: string;
  readonly role?: string;
  readonly bio?: string;
  readonly landingHero?: Readonly<SiteConfig["landingHero"]>;
  readonly fontSizes?: any;
  readonly mobileFontSizes?: any;
  readonly layout?: any;
}

export function Hero({
  slogan = "",
  role = "Designer & Developer",
  bio = "",
  landingHero,
  fontSizes,
  mobileFontSizes,
  layout,
}: HeroProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const lineAlignmentClass =
    layout?.textAlign === "left"
      ? "mr-auto"
      : layout?.textAlign === "right"
        ? "ml-auto"
        : "mx-auto";

  // Use landingHero.title if available, else fallback to slogan
  const displayTitle = landingHero?.title || slogan || "Visual Alchemist";
  const words = displayTitle.split(" ");

  /* ─── SSR placeholder ─── */
  if (!mounted)
    return (
      <section className="flex flex-col items-center justify-start text-center w-full px-6 pt-32 pb-16 overflow-hidden relative bg-black">
        <div
          className="font-black uppercase tracking-tighter leading-[0.85] text-white opacity-0"
          style={{
            fontSize: `clamp(${mobileFontSizes?.heroTitle || 40}px, 8vw, ${fontSizes?.heroTitle || 110}px)`,
          }}
        >
          {words[0]}
        </div>
      </section>
    );

  return (
    <section className="flex flex-col items-center justify-start text-center w-full px-6 pt-32 pb-20 overflow-hidden relative">
      {/* Premium Interactive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)",
              "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.03) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mixed-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="space-y-8 relative z-10"
      >
        {/* Role Badge + Subtitle */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/60">
                {role}
              </span>
            </div>
            {landingHero?.subtitle && (
              <span
                className="uppercase tracking-[0.2em] font-light text-white/40 mt-2 whitespace-pre-line"
                style={{
                  fontSize: `clamp(var(--m-font-heroSubtitle, 10px), 4vw, var(--font-heroSubtitle, 20px))`,
                }}
              >
                {landingHero.subtitle}
              </span>
            )}
          </motion.div>
        </div>

        {/* Main Title Text (Landing Hero Title or Slogan) */}
        <div
          className="font-black uppercase tracking-tighter flex flex-col items-center select-none w-full mx-auto"
          style={{
            fontSize: `clamp(var(--m-font-heroTitle, 40px), 8vw, var(--font-heroTitle, 110px))`,
            lineHeight: "var(--line-height, 0.85)",
            letterSpacing: "var(--letter-spacing, -0.02em)",
            textAlign: "var(--text-align, center)" as any,
            maxWidth: "var(--content-max-width, 1200px)",
          }}
        >
          {words.map((word, idx) => (
            <div
              key={`${word}-${idx}`}
              className="overflow-visible py-3 -my-1 w-full"
              style={{ textAlign: "inherit" }}
            >
              <motion.span
                initial={{ y: "110%", rotateX: 45 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.6 + idx * 0.2,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className={`inline-block text-premium ${
                  idx % 2 === 1
                    ? "text-transparent stroke-white/20 stroke-1"
                    : "text-white"
                }`}
                style={
                  idx % 2 === 1
                    ? { WebkitTextStroke: "1px rgba(255,255,255,0.2)" }
                    : {}
                }
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.8 }}
          className="mx-auto space-y-6 w-full"
          style={{
            textAlign: "var(--text-align, center)" as any,
            maxWidth: "var(--content-max-width, 800px)",
          }}
        >
          <p
            className="text-base md:text-lg text-white/50 font-medium text-premium text-pretty"
            style={{
              lineHeight: "var(--line-height, 1.6)",
              letterSpacing: "var(--letter-spacing, -0.01em)",
            }}
          >
            {bio}
          </p>
          <div
            className={`h-px w-20 bg-linear-to-r from-transparent via-white/20 to-transparent ${lineAlignmentClass}`}
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8"
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center animate-bounce">
          <svg
            className="w-4 h-4 text-white/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
