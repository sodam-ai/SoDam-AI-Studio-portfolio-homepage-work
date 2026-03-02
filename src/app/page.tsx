import React from "react";
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import VibeShowcase from "@/components/sections/VibeShowcase";
import MasterpieceCard from "@/components/sections/MasterpieceCard";
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

  return (
    <main
      className="relative min-w-360 bg-black text-white selection:bg-white selection:text-black overflow-x-hidden"
      style={
        { "--section-gap": `${layout.sectionGap}px` } as React.CSSProperties
      }
    >
      {/* 1. Hero Section: The Portal */}
      <div className="max-w-7xl mx-auto">
        <Hero
          slogan={siteConfig.slogan}
          role={siteConfig.role}
          bio={siteConfig.bio}
          landingHero={landing.hero}
          fontSizes={fontSizes}
          mobileFontSizes={mobileFontSizes}
          layout={layout}
        />
      </div>

      {/* 2. Showcase Section */}
      <section
        id="showcase"
        className="relative z-10"
        style={{
          paddingTop: `var(--section-gap, 100px)`,
          paddingBottom: `var(--section-gap, 100px)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-6 mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span
              className="font-black tracking-[0.5em] text-white/30 uppercase block clamp-text"
              style={{
                fontSize: `clamp(10px, 2vw, var(--font-cardCategory, 20px))`,
              }}
            >
              Selected Works
            </span>
            <h3
              className="font-black uppercase tracking-tighter text-white"
              style={{
                fontSize: `clamp(24px, 5vw, var(--font-sectionTitle, 52px))`,
              }}
            >
              Showcase
            </h3>
          </div>
          <div className="max-w-xs">
            <p
              className="text-white/40 font-medium leading-relaxed"
              style={{
                fontSize: `clamp(12px, 2.5vw, var(--font-bodyText, 13px))`,
              }}
            >
              세계관을 관통하는 마스터피스. 기술적 정점과 디자인 미학이
              응축됩니다.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-16 px-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {featuredProjects.map((project: any, index: number) => (
            <MasterpieceCard
              key={project.id}
              project={project}
              index={index}
              fontSizes={fontSizes}
              mobileFontSizes={mobileFontSizes}
            />
          ))}
        </div>

        {/* Explore All Link */}
        <div className="mt-20 md:mt-32 flex justify-center">
          <Link
            href="/work"
            className="group relative px-8 md:px-12 py-5 md:py-6 overflow-hidden border border-white/10 glass-effect"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
            <span className="relative z-10 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] group-hover:text-black transition-colors duration-500">
              View All Archive ({totalProjects.toString().padStart(2, "0")})
            </span>
          </Link>
        </div>
      </section>

      {/* 3. Philosophy Section: Vibe Coding */}
      <div className="w-full relative z-0">
        <VibeShowcase settings={settings} />
      </div>

      {/* 5. Contact / Footer Preview */}
      <section
        className="bg-white text-black"
        style={{ padding: `${layout.sectionGap}px 0` }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2
            className="font-black uppercase tracking-tighter leading-none italic"
            style={{ fontSize: `clamp(40px, 8vw, ${fontSizes.heroTitle}px)` }}
          >
            Ready to Build
            <br />
            The Future?
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <a
              href="mailto:contact@antigravity.dev"
              className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 hover:opacity-50 transition-opacity"
            >
              contact@antigravity.dev
            </a>
            <div className="w-1 h-1 bg-black rounded-full hidden md:block" />
            <span className="text-sm font-black uppercase tracking-widest">
              Based in Global / Digital
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full pb-20 flex flex-col items-center gap-16 px-6 max-w-7xl mx-auto border-t border-white/5"
        style={{ paddingTop: `${layout.sectionGap}px` }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-black tracking-tighter italic">
            SoDam AI Studio.
          </div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/20">
            © 2026 SoDam AI Studio. All Rights Reserved
            <Link href="/admin" className="cursor-default hover:text-white/20">
              .
            </Link>
          </span>
        </div>
        <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-black text-white/40 text-center">
          <Link href="/work" className="hover:text-white transition-all">
            Work
          </Link>
          <Link href="/about" className="hover:text-white transition-all">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition-all">
            Contact
          </Link>
        </div>
      </footer>
    </main>
  );
}
