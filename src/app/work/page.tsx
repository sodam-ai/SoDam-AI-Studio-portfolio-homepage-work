"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import MasterpieceCard from "@/components/sections/MasterpieceCard";

const CATEGORIES = ["All", "AI Image", "AI Video", "Vibe Coding"];

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  featured: boolean;
}

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        /* cache: 'no-store'를 통해 실시간 동기화 보장 */
        const res = await fetch("/api/admin/update?type=projects", {
          cache: "no-store",
        });
        const result = await res.json();
        if (result.success) {
          setProjects(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;

    // 두 값을 모두 표준화하여 비교 (공백 제거, 소문자화)
    const projectCategory = (p.category || "").toLowerCase().trim();
    const targetFilter = activeCategory.toLowerCase().trim();

    return (
      projectCategory === targetFilter ||
      projectCategory.includes(targetFilter) ||
      targetFilter.includes(projectCategory)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">
          Syncing_Archive...
        </span>
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Work Header */}
          <div className="mb-20 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">
                  Selected_Archive
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
                Work
              </h1>
              <p className="text-zinc-500 text-sm max-w-xl font-medium leading-relaxed">
                바이브 코딩과 AI 에이전트 협업으로 탄생시킨 디지털 아트워크 및
                개발 산출물 아카이브입니다.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 group ${
                      isActive ? "text-black" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {/* Active Background Animation */}
                    {isActive ? (
                      <motion.div
                        layoutId="active-category-bg"
                        className="absolute inset-0 bg-white rounded-full z-0"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/5 scale-0 rounded-full z-0 group-hover:scale-100 transition-transform duration-300" />
                    )}

                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={`work-card-${project.id}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    layout: { duration: 0.4, ease: "circOut" },
                  }}
                >
                  <MasterpieceCard project={project} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
