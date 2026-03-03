"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import MasterpieceCard from "@/components/sections/MasterpieceCard";

const CATEGORY_ALL = "All";

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  featured: boolean;
}

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([CATEGORY_ALL]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* cache: 'no-store'를 통해 실시간 동기화 보장 */
        const [projectsRes, configRes] = await Promise.all([
          fetch(`/api/admin/update?type=projects&t=${Date.now()}`, {
            cache: "no-store",
          }),
          fetch(`/api/admin/update?type=site-config&t=${Date.now()}`, {
            cache: "no-store",
          }),
        ]);

        const projectsResult = await projectsRes.json();
        const configResult = await configRes.json();

        if (projectsResult.success) {
          setProjects(projectsResult.data);
        }

        if (
          configResult.success &&
          Array.isArray(configResult.data.categories)
        ) {
          // site-config.json의 categories는 문자열 배열일 수도 있고 객체 배열일 수도 있음
          const rawCategories = configResult.data.categories;
          const parsedCategories = rawCategories
            .map((c: string | { name?: string }) =>
              typeof c === "string" ? c.trim() : c?.name?.trim() || "",
            )
            .filter((c: string) => c.length > 0); // 빈 문자열이나 undefined 제거

          // 중복 제거 후 카테고리 상태 설정
          setCategories([
            CATEGORY_ALL,
            ...Array.from(new Set(parsedCategories as string[])),
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch data for work page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === CATEGORY_ALL) return true;

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
              {categories.map((cat) => {
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
