import React from "react";
import { Hero } from "@/components/sections/Hero";
import VibeShowcase from "@/components/sections/VibeShowcase";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "projects.json",
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

async function getSiteConfig() {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "site-config.json",
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading site-config:", error);
    return {
      siteName: "Portfolio",
      role: "Designer & Developer",
      bio: "Creative Portfolio",
      slogan: "Innovation through AI",
    };
  }
}

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "settings.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading settings:", error);
    return {
      appearance: {
        fontSizes: {
          heroTitle: 120,
          sectionTitle: 60,
          bodyText: 16,
          cardCategory: 12,
        },
        layout: {
          sectionGap: 100,
          useFixedLayout: true,
        },
      },
      landing: {
        hero: {
          title: "AI IS THE NEW CREATIVE SYNTAX",
          subtitle: "Crafting digital experiences with AI",
        },
      },
    };
  }
}

export default async function HomePage() {
  const allProjects = await getProjects();
  const siteConfig = await getSiteConfig();
  const settings = await getSettings();

  const featuredProjects = allProjects.filter(
    (p: { featured?: boolean }) => p.featured,
  );
  const totalProjects = allProjects.length;

  const { appearance, landing } = settings;
  const { fontSizes, mobileFontSizes, layout } = appearance;

  // 디자인 시스템 변수 브릿지 생성
  const designVariables = {
    "--section-gap": `${layout.sectionGap}px`,
    "--font-heroTitle": `${fontSizes.heroTitle}px`,
    "--font-heroSubtitle": `${fontSizes.heroSubtitle || 20}px`,
    "--font-sectionTitle": `${fontSizes.sectionTitle}px`,
    "--font-bodyText": `${fontSizes.bodyText}px`,
    "--font-cardCategory": `${fontSizes.cardCategory}px`,
    "--m-font-heroTitle": `${mobileFontSizes?.heroTitle || 40}px`,
    "--m-font-heroSubtitle": `${mobileFontSizes?.heroSubtitle || 14}px`,
    "--line-height": layout.lineHeight || "1.2",
    "--letter-spacing": layout.letterSpacing || "-0.02em",
    "--text-align": layout.textAlign || "center",
  } as React.CSSProperties;

  return (
    <main
      className="relative min-w-360 bg-black text-white selection:bg-white selection:text-black overflow-x-hidden"
      style={designVariables}
    >
      {/* 1. Hero Section: The Portal */}
      <div className="max-w-7xl mx-auto">
        <Hero
          slogan={siteConfig.slogan}
          landingHero={landing.hero}
          animations={appearance.animations}
        />
      </div>

      {/* 2. Showcase Section */}
      <ShowcaseSection
        featuredProjects={featuredProjects}
        totalProjects={totalProjects}
        sectionSettings={landing.sections?.showcase}
      />

      {/* 3. Philosophy Section: Vibe Coding */}
      <div className="w-full relative z-0">
        <VibeShowcase settings={settings} />
      </div>

      {/* 5. Contact / Footer Preview */}
      <ContactSection
        sectionSettings={landing.sections?.contact}
        layout={layout}
        settings={settings}
        siteConfig={siteConfig}
      />

      {/* Footer */}
      <FooterSection
        sectionSettings={landing.sections?.footer}
        layout={layout}
        settings={settings}
        siteConfig={siteConfig}
      />
    </main>
  );
}
