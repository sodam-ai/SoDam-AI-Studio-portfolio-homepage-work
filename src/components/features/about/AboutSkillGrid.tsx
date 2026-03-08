"use client";

import { motion } from "framer-motion";
import { SkillGroup } from "@/types/about";

interface AboutSkillGridProps {
  skills: SkillGroup[];
}

export function AboutSkillGrid({ skills }: Readonly<AboutSkillGridProps>) {
  return (
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
  );
}
