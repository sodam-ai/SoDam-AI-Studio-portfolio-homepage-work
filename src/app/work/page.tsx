"use client";

import React, { useState, useEffect } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import WorkHeader from "@/components/features/work/WorkHeader";
import CategoryFilter from "@/components/features/work/CategoryFilter";
import WorkGrid from "@/components/features/work/WorkGrid";
import { Project } from "@/types/work";
import { BrandingSettings } from "@/types/branding";

const CATEGORY_ALL = "All";

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([CATEGORY_ALL]);
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* cache: 'no-store'를 통해 실시간 동기화 보장 */
        const [projectsRes, configRes, settingsRes] = await Promise.all([
          fetch(`/api/admin/update?type=projects&t=${Date.now()}`, {
            cache: "no-store",
          }),
          fetch(`/api/admin/update?type=site-config&t=${Date.now()}`, {
            cache: "no-store",
          }),
          fetch(`/api/admin/update?type=settings&t=${Date.now()}`, {
            cache: "no-store",
          }),
        ]);

        const projectsResult = await projectsRes.json();
        const configResult = await configRes.json();
        const settingsResult = await settingsRes.json();

        if (projectsResult.success) {
          setProjects(projectsResult.data);
        }

        if (settingsResult.success) {
          setSettings(settingsResult.data);
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
      <main
        className="min-h-screen bg-black text-white px-4 md:px-8"
        style={{
          paddingTop: settings?.appearance?.layout?.containerPadding
            ? `${settings.appearance.layout.containerPadding + 80}px`
            : "120px",
          paddingBottom: settings?.appearance?.layout?.containerPadding
            ? `${settings.appearance.layout.containerPadding}px`
            : "80px",
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20 space-y-8">
            <WorkHeader
              title={settings?.pages?.work?.title || "ARCHIVE"}
              description={
                settings?.pages?.work?.description ||
                "바이브 코딩과 AI 에이전트 협업으로 탄생시킨 디지털 아트워크 및 개발 산출물 아카이브입니다."
              }
              alignment={
                (settings?.pages?.work?.alignment as
                  | "left"
                  | "center"
                  | "right") || "left"
              }
              descriptionStyle={settings?.pages?.work?.descriptionStyle}
              showLabel={settings?.pages?.work?.showLabel}
              showTitle={settings?.pages?.work?.showTitle}
              showDescription={settings?.pages?.work?.showDescription}
              contentOffset={settings?.pages?.work?.contentOffset}
              animations={settings?.appearance?.animations}
            />
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>
          <WorkGrid
            projects={filteredProjects}
            gridColumns={settings?.pages?.work?.gridColumns}
            cardGap={settings?.pages?.work?.cardGap}
            animations={settings?.appearance?.animations}
            categoryStyle={settings?.pages?.work?.cardCategoryStyle}
            titleStyle={settings?.pages?.work?.cardTitleStyle}
            descriptionStyle={settings?.pages?.work?.cardDescriptionStyle}
          />
        </div>
      </main>
    </PageTransition>
  );
}
