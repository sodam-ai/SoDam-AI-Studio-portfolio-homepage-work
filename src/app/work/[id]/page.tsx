"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Binary,
  Github as GithubIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import projectsData from "@/content/projects.json";

// YouTube ID 추출 유틸리티
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  return match ? match[1] : null;
};

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projects = projectsData as any[];
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-blue-500/20 animate-pulse" />
          <h1 className="text-4xl font-black text-white relative">
            PROJECT_NOT_FOUND
          </h1>
        </div>
        <Link
          href="/archive"
          className="text-(--accent-primary) hover:underline uppercase tracking-widest text-xs font-bold"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  // Find next project for navigation
  const currentIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const youtubeId = project.videoUrl
    ? getYoutubeId(project.videoUrl)
    : getYoutubeId(project.liveUrl);

  // 컨텐츠 슬롯 렌더링 로직 분리
  const renderContentSlot = () => {
    if (youtubeId) {
      return (
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&muted=0`}
            className="w-full h-full"
            allowFullScreen
            title={project.title}
          />
        </div>
      );
    }

    if (project.videoUrl && !youtubeId) {
      // 직접 비디오 파일 URL 처리 (mp4, webm 등)
      return (
        <div className="aspect-video w-full bg-black">
          <video
            src={project.videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      );
    }

    if (project.images && project.images.length > 0) {
      return (
        <div className="aspect-video w-full bg-zinc-800">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="aspect-video w-full bg-zinc-800 relative group overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white/20 font-black uppercase tracking-[0.5em] text-4xl rotate-12">
            MASTERY_WORK
          </span>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Immersive Background (Atmosphere Only) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        {project.videoUrl && !youtubeId ? (
          <video
            src={project.videoUrl}
            className="w-full h-full object-cover blur-[100px]"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={project.thumbnail}
            alt=""
            className="w-full h-full object-cover blur-[100px]"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top Navigation - Refined Floating Style */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 pointer-events-none">
        <div className="container mx-auto flex justify-between items-center pointer-events-auto">
          <Link
            href="/work"
            className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-sm font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" />
            <span className="hidden sm:inline">Back to Archive</span>
            <span className="sm:hidden">Work</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 text-[10px] font-black tracking-[0.3em] uppercase text-white/40">
              {project.category}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 rounded-full bg-(--accent-primary)/10 backdrop-blur-xl border border-(--accent-primary)/20 flex items-center justify-center text-(--accent-primary) hover:bg-(--accent-primary)/20 transition-all"
            >
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </nav>

      <section className="relative pt-48 pb-20 px-8 z-10">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-(--accent-primary)" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-(--accent-primary) font-black">
                  PROJECT_ARCHIVE_{id.slice(-4).toUpperCase()}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white gradient-text pb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-3 pt-6">
                {project.tags?.map((tag: string) => {
                  const isAccent =
                    tag.toLowerCase() === "next.js" ||
                    tag.toLowerCase() === "react" ||
                    tag.toLowerCase() === "ai";
                  return (
                    <span
                      key={tag}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500
                        ${
                          isAccent
                            ? "border-(--accent-primary)/30 bg-(--accent-primary)/10 text-(--accent-primary) shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                            : "border-white/5 bg-white/2 text-white/40 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area - THE "SLOT" */}
            <div className="relative rounded-4xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
              {renderContentSlot()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-12">
              <div className="lg:col-span-8 space-y-20">
                {/* Description Space */}
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-(--accent-primary) flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-(--accent-primary)" />
                      {"//"} THE_BLUEPRINT
                    </h3>
                    <p className="text-2xl md:text-3xl font-black tracking-tight leading-[1.2] text-white">
                      {project.fullDescription || project.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                        {"//"} STRATEGY_&_EXECUTION
                      </h4>
                      <p className="text-lg text-zinc-400 font-light leading-relaxed">
                        {project.approach}
                      </p>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                        {"//"} PROJECT_IMPACT
                      </h4>
                      <div className="flex flex-col gap-4">
                        {project.challenges?.map(
                          (challenge: string, i: number) => (
                            <div key={challenge} className="flex gap-4 group">
                              <span className="text-(--accent-primary) font-black text-xs shrink-0">
                                0{i + 1}
                              </span>
                              <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                {challenge}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Images Grid */}
                {project.images && project.images.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-20">
                    {project.images.slice(1).map((img: string) => (
                      <div
                        key={img}
                        className="rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 aspect-square group"
                      >
                        <img
                          src={img}
                          alt={`${project.title} detail`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Action Area */}
              <div className="lg:col-span-4">
                <div className="sticky top-40 space-y-8">
                  <div className="p-8 rounded-4xl border border-white/5 bg-white/[0.03] backdrop-blur-2xl space-y-10">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        CONNECT_&_DEPLOY
                      </h4>
                      <div className="space-y-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all group"
                          >
                            Launch_Live_App
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
                          >
                            Source_Repository
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">
                          NEXT_PHASE
                        </p>
                        <Link
                          href={`/work/${nextProject.id}`}
                          className="text-xl font-black tracking-tighter hover:text-(--accent-primary) transition-colors"
                        >
                          {nextProject.title}
                        </Link>
                      </div>
                      <Link
                        href={`/work/${nextProject.id}`}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-(--accent-primary) transition-all group"
                      >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Summary Visual Callout */}
                  <div className="rounded-4xl overflow-hidden bg-linear-to-br from-(--accent-primary)/20 to-transparent p-1">
                    <div className="rounded-[1.9rem] bg-black p-8 space-y-4">
                      <Binary className="w-8 h-8 text-(--accent-primary) opacity-40" />
                      <p className="text-sm text-zinc-500 font-light leading-relaxed italic">
                        "{project.title}은 단순한 결과물을 넘어 설계 과정에서의
                        철학을 담고 있습니다. 상세 레이아웃을 통해 그 깊이를
                        확인하세요."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
