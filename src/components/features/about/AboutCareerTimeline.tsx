"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/types/about";

interface AboutCareerTimelineProps {
  experience: ExperienceItem[];
}

export function AboutCareerTimeline({
  experience,
}: Readonly<AboutCareerTimelineProps>) {
  return (
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
  );
}
