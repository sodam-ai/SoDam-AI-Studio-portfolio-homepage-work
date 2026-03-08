import React from "react";
import { Maximize2 } from "lucide-react";

import { Project } from "@/types/project";

interface MediaRendererProps {
  project: Project;
  youtubeId: string | null;
  primaryLink?: string;
  primaryLinkLabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrimaryLinkIcon: any;
  ytRatioStr: string;
  ytRatioFloat: number;
  nativeMediaStyle: React.CSSProperties;
  nativeMediaClasses: string;
  setSelectedMedia: (
    media: { url: string; type: "image" | "video" } | null,
  ) => void;
}

export function MediaRenderer({
  project,
  youtubeId,
  primaryLink,
  primaryLinkLabel,
  PrimaryLinkIcon,
  ytRatioStr,
  ytRatioFloat,
  nativeMediaStyle,
  nativeMediaClasses,
  setSelectedMedia,
}: MediaRendererProps) {
  // 1. YouTube 영상
  if (youtubeId) {
    return (
      <div className="w-full flex justify-center items-center">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&muted=0`}
          className="rounded-2xl shadow-2xl border border-white/5"
          style={{
            aspectRatio: ytRatioStr,
            maxWidth: `calc(70vh * ${ytRatioFloat})`,
            maxHeight: "70vh",
            width: "100%", // 모바일 대응
          }}
          allowFullScreen
          title={project.title}
        />
      </div>
    );
  }

  // 2. 직접 업로드된 비디오
  if (project.videoUrl && !youtubeId) {
    return (
      <div className="w-full flex justify-center items-center group relative cursor-pointer">
        <video
          src={project.videoUrl}
          className="rounded-2xl shadow-2xl border border-white/5 object-contain"
          style={nativeMediaStyle}
          controls
          autoPlay
          muted
          loop
          playsInline
        />
        <button
          onClick={() =>
            setSelectedMedia({ url: project.videoUrl!, type: "video" })
          }
          className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          title="Expand Video"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // 3. 다중 이미지 또는 메인 썸네일 (폴백)
  let heroImage = project.thumbnail;
  if (!heroImage && project.images && project.images.length > 0) {
    heroImage = project.images[0];
  }
  if (!heroImage && youtubeId) {
    heroImage = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  if (!heroImage) return null;

  return (
    <div
      className="w-full flex justify-center items-center group cursor-pointer relative"
      onClick={() => {
        if (primaryLink) {
          window.open(primaryLink, "_blank", "noopener,noreferrer");
        } else {
          setSelectedMedia({ url: heroImage, type: "image" });
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImage}
        alt={project.title}
        className={nativeMediaClasses}
        style={nativeMediaStyle}
      />

      {primaryLink ? (
        <div
          className="absolute inset-0 m-auto flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={nativeMediaStyle}
        >
          <div className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
            {primaryLinkLabel}
            <PrimaryLinkIcon className="w-5 h-5" />
          </div>
        </div>
      ) : (
        <div className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-xl">
          <Maximize2 className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
