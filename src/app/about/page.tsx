"use client";

import { useState, useEffect } from "react";
import { AboutData } from "@/types/about";
import { BrandingSettings } from "@/types/branding";
import { AboutHeader } from "@/components/features/about/AboutHeader";
import { AboutIntro } from "@/components/features/about/AboutIntro";
import { AboutCareerTimeline } from "@/components/features/about/AboutCareerTimeline";
import { AboutSkillGrid } from "@/components/features/about/AboutSkillGrid";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, settingsRes] = await Promise.all([
          fetch(`/api/admin/update?type=about&t=${Date.now()}`, {
            cache: "no-store",
          }),
          fetch(`/api/admin/update?type=settings&t=${Date.now()}`, {
            cache: "no-store",
          }),
        ]);

        const aboutResult = await aboutRes.json();
        const settingsResult = await settingsRes.json();

        if (aboutResult.success) {
          setAboutData(aboutResult.data);
        }
        if (settingsResult.success) {
          setSettings(settingsResult.data);
        }
      } catch (error) {
        console.error("Failed to load about data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
    <main
      className="min-h-screen bg-background text-foreground"
      style={{
        paddingTop: settings?.appearance.layout.containerPadding ?? 160,
        paddingBottom: settings?.appearance.layout.containerPadding ?? 128,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <AboutHeader
          title={settings?.pages?.about?.title}
          alignment={
            (settings?.pages?.about?.alignment as
              | "left"
              | "center"
              | "right") || "left"
          }
          titleStyle={settings?.pages?.about?.titleStyle}
          showLabel={settings?.pages?.about?.showLabel}
          showTitle={settings?.pages?.about?.showTitle}
          contentOffset={settings?.pages?.about?.contentOffset}
          animations={settings?.appearance?.animations}
        />
        <AboutIntro
          introduction={settings?.pages?.about?.description || introduction}
          story={settings?.pages?.about?.story || story}
          alignment={
            (settings?.pages?.about?.alignment as
              | "left"
              | "center"
              | "right") || "left"
          }
          layoutType={
            (settings?.pages?.about?.layoutType as
              | "split"
              | "full"
              | "minimal") || "full"
          }
          introductionStyle={settings?.pages?.about?.introductionStyle}
          storyStyle={settings?.pages?.about?.storyStyle}
          showDescription={settings?.pages?.about?.showDescription}
          contentOffset={settings?.pages?.about?.introOffset}
        />
        <AboutCareerTimeline experience={experience} />
        <AboutSkillGrid skills={skills} />
      </div>
    </main>
  );
}
