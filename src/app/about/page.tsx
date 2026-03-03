"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
}

interface SkillGroup {
  category: string;
  items: string[];
}

interface AboutData {
  introduction: string;
  story: string;
  experience: ExperienceItem[];
  skills: SkillGroup[];
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch(
          `/api/admin/update?type=about&t=${Date.now()}`,
          { cache: "no-store" },
        );
        const result = await res.json();
        if (result.success) {
          setAboutData(result.data);
        }
      } catch (error) {
        console.error("Failed to load about data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (isLoading || !aboutData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.5em] opacity-30 animate-pulse">
          Loading Visionary...
        </span>
      </div>
    );
  }

  const { introduction, story, experience, skills } = aboutData;

  return (
    <main className="min-h-screen bg-background text-foreground pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 mb-24"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-bold">
            About
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            The
            <br />
            Creator
          </h1>
        </motion.div>

        {/* 소개 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 pb-24 border-b border-white/10"
        >
          <p className="text-3xl md:text-5xl font-black leading-[1.2] tracking-tight uppercase max-w-5xl">
            {introduction}
          </p>
          <p className="text-lg text-white/50 font-light leading-relaxed max-w-3xl mt-12">
            {story}
          </p>
        </motion.section>

        {/* 경력 타임라인 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 pb-24 border-b border-white/10"
        >
          <div className="space-y-4 mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold">
              Experience
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Career Timeline
            </h2>
          </div>

          <div className="space-y-0">
            {experience.map((exp) => (
              <motion.div
                key={`${exp.period}-${exp.company}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-white/10 group hover:bg-white/2 transition-colors px-4 -mx-4"
              >
                <div className="md:col-span-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    {exp.period}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-lg font-black uppercase tracking-tight">
                    {exp.role}
                  </h3>
                  <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                    {exp.company}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <p className="text-sm text-white/50 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 스킬 그리드 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4 mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold">
              Expertise
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Skills & Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {skills.map((group) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 pb-4 border-b border-white/10">
                  {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-default flex items-center gap-3"
                    >
                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
