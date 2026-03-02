/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";

interface VibeShowcaseProps {
  settings?: any;
}

export default function VibeShowcase({
  settings,
}: Readonly<VibeShowcaseProps>) {
  const philosophy = settings?.landing?.philosophy || {};
  const philosophyTitle = philosophy.title || "AI IS THE NEW CREATIVE SYNTAX";
  const words = philosophyTitle.split(" ");
  const lastWord = words.pop() || "";
  const firstWords = words.join(" ");
  return (
    <section
      className="relative flex items-center justify-center bg-black overflow-hidden pointer-events-none"
      style={{
        paddingTop: "var(--section-gap, 64px)",
        paddingBottom: "var(--section-gap, 64px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="mx-auto px-6 text-center space-y-10 w-full"
        style={{
          maxWidth: "var(--content-max-width, 800px)",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/2">
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30">
            The Philosophy
          </span>
        </div>
        <h2
          className="font-black uppercase tracking-tighter text-white whitespace-pre-line"
          style={{
            fontSize: `clamp(var(--m-font-philosophyTitle, 40px), 8vw, var(--font-philosophyTitle, 90px))`,
            lineHeight: "var(--line-height, 0.9)",
          }}
        >
          {firstWords}
          <span
            className="text-transparent stroke-white/20 stroke-1 ml-2 block sm:inline"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
          >
            {lastWord}
          </span>
        </h2>
        <p
          className="text-white/40 font-light leading-relaxed mx-auto whitespace-pre-line text-balance"
          style={{
            fontSize: `clamp(var(--m-font-philosophyDesc, 16px), 2.5vw, var(--font-philosophyDesc, 22px))`,
            textAlign: "var(--text-align, center)" as any,
            lineHeight: "var(--line-height, 1.6)",
          }}
        >
          {philosophy.description ||
            "단순한 도구를 넘어, AI와 함께 이미지, 영상, 코드를 조각하고 다듬습니다.\n바이브 코딩은 상상을 현실로 전환하는 가장 빠른 인터페이스입니다."}
        </p>
      </motion.div>
    </section>
  );
}
