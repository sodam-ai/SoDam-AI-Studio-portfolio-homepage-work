"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Github as GithubIcon } from "lucide-react";
import Image from "next/image";
import projectsData from "@/content/projects.json";
import { MediaRenderer } from "@/components/features/work/MediaRenderer";
import { ProjectHeader } from "@/components/features/work/ProjectHeader";
import { ProjectHero } from "@/components/features/work/ProjectHero";
import { ProjectDetails } from "@/components/features/work/ProjectDetails";
import { ProjectGallery } from "@/components/features/work/ProjectGallery";
import { ProjectSidebar } from "@/components/features/work/ProjectSidebar";
import { ProjectLightbox } from "@/components/features/work/ProjectLightbox";

// YouTube ID 추출 유틸리티
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
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
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `/api/admin/update?type=settings&t=${Date.now()}`,
          {
            cache: "no-store",
          },
        );
        const result = await res.json();
        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // 컴포넌트 렌더링 전에 body scroll lock 처리
  React.useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedMedia]);

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

  const youtubeId =
    getYoutubeId(project.videoUrl) || getYoutubeId(project.liveUrl);

  const primaryLink = project.liveUrl || project.githubUrl;
  const primaryLinkLabel = project.liveUrl
    ? "Launch Live App"
    : "View Source (GitHub)";
  const PrimaryLinkIcon = project.liveUrl ? ExternalLink : GithubIcon;

  // 유튜브 쇼츠 여부 자동 감지
  const videoSource = project.videoUrl || project.liveUrl || "";
  const isYoutubeShorts = videoSource.includes("/shorts/");

  const getRatioFloat = (ratioStr: string) => {
    const parts = ratioStr.split("/");
    return parts.length === 2 ? Number(parts[0]) / Number(parts[1]) : 16 / 9;
  };

  const hasExplicitRatio =
    project.aspectRatio && project.aspectRatio !== "auto";
  const explicitRatioStr = hasExplicitRatio
    ? (project.aspectRatio as string)
    : "16/9";

  const ytRatioStr = hasExplicitRatio
    ? explicitRatioStr
    : isYoutubeShorts
      ? "9/16"
      : "16/9";
  const ytRatioFloat = getRatioFloat(ytRatioStr);

  // 네이티브 미디어용 폭 맞춤 클래스 및 스타일
  const nativeMediaClasses =
    "max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain transition-transform duration-500 group-hover:scale-[1.02] bg-zinc-900";

  const nativeMediaStyle = hasExplicitRatio
    ? {
        aspectRatio: explicitRatioStr,
        width: "100%",
        maxWidth: `calc(65vh * ${getRatioFloat(explicitRatioStr)})`,
        maxHeight: "65vh",
      }
    : {
        width: "auto",
        height: "auto",
        maxHeight: "65vh",
      };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Immersive Background */}
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
          <Image
            src={
              project.thumbnail ||
              (project.images && project.images.length > 0
                ? project.images[0]
                : youtubeId
                  ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                  : "/images/placeholder.jpg")
            }
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-[100px]"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <ProjectHeader category={project.category} />

      <section className="relative pt-48 pb-20 px-8 z-10">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto space-y-12">
            <ProjectHero
              id={id}
              title={project.title}
              tags={project.tags}
              titleStyle={project.titleStyle}
              animations={settings?.appearance?.animations}
            />

            {/* Main Content Area */}
            <div className="relative w-full flex justify-center items-center">
              <MediaRenderer
                project={project}
                youtubeId={youtubeId}
                primaryLink={primaryLink}
                primaryLinkLabel={primaryLinkLabel}
                PrimaryLinkIcon={PrimaryLinkIcon}
                ytRatioStr={ytRatioStr}
                ytRatioFloat={ytRatioFloat}
                nativeMediaStyle={nativeMediaStyle}
                nativeMediaClasses={nativeMediaClasses}
                setSelectedMedia={setSelectedMedia}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-12">
              <div className="lg:col-span-8 space-y-20">
                <ProjectDetails
                  fullDescription={project.fullDescription}
                  description={project.description}
                  approach={project.approach}
                  challenges={project.challenges}
                  descriptionStyle={project.descriptionStyle}
                  approachStyle={project.approachStyle}
                />
                <ProjectGallery
                  title={project.title}
                  images={project.images}
                  setSelectedMedia={setSelectedMedia}
                />
              </div>

              <div className="lg:col-span-4">
                <ProjectSidebar project={project} nextProject={nextProject} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectLightbox
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
      />
    </main>
  );
}
