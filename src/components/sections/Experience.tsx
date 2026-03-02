"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/shared/Section";

const EXPERIENCES = [
  {
    year: "2025 - Present",
    title: "AI Creative Director",
    company: "Neo-Genesis Studio",
    description:
      "AI 이미지 및 영상 생성 파이프라인 구축 및 Vibe Coding 기반 신속한 웹 솔루션 배포.",
    tags: ["Stable Diffusion", "Runway", "Next.js"],
  },
  {
    year: "2024 - 2025",
    title: "Full-Stack Developer",
    company: "Tech Innovators",
    description: "반응형 아키텍처 및 복잡한 데이터 대시보드 개발 주도.",
    tags: ["TypeScript", "React", "Node.js"],
  },
];

const SKILLS = [
  {
    category: "AI Creative",
    items: ["Stable Diffusion", "LoRA Training", "Runway Gen-3", "Midjourney"],
  },
  {
    category: "Vibe Coding",
    items: ["Next.js 15", "Tailwind v4", "Framer Motion", "Vibe Coding"],
  },
  {
    category: "Strategy",
    items: ["AI Workflow Design", "Rapid Prototyping", "Content Branding"],
  },
];

export function Experience() {
  return (
    <Section
      id="experience"
      subtitle="Background"
      title="Experience & Skills"
      className=""
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative pl-8 border-l border-black/10"
            >
              <div className="absolute -left-1.25 top-0 w-2.5 h-2.5 bg-foreground rounded-full" />
              <span className="text-sm font-mono text-foreground opacity-40 uppercase tracking-widest">
                {exp.year}
              </span>
              <h3
                className="text-2xl font-black mt-2 uppercase"
                style={{ fontFamily: "var(--vibe-font)" }}
              >
                {exp.title}
              </h3>
              <p className="text-lg font-bold text-foreground opacity-60">
                {exp.company}
              </p>
              <p className="mt-4 text-foreground opacity-40 font-light leading-relaxed max-w-md">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono border border-foreground/10 px-2 py-1 uppercase tracking-widest"
                    style={{
                      borderColor: "var(--vibe-primary)",
                      borderRadius: "var(--vibe-radius)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-12">
          {SKILLS.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-mono text-foreground opacity-40 uppercase tracking-widest mb-6">
                {skillGroup.category}
              </h4>
              <div className="flex flex-wrap gap-4">
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xl md:text-2xl font-black uppercase tracking-tighter hover:opacity-20 transition-colors cursor-default"
                    style={{ fontFamily: "var(--vibe-font)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
