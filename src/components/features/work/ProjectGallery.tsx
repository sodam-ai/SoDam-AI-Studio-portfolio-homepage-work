"use client";

import React from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

interface ProjectGalleryProps {
  title: string;
  images: string[];
  setSelectedMedia: (
    media: { url: string; type: "image" | "video" } | null,
  ) => void;
}

export function ProjectGallery({
  title,
  images,
  setSelectedMedia,
}: ProjectGalleryProps) {
  if (!images || images.length <= 1) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-20">
      {images.slice(1).map((img) => (
        <div
          key={img}
          className="rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 aspect-square group cursor-pointer relative"
          onClick={() => setSelectedMedia({ url: img, type: "image" })}
        >
          <Image
            src={img}
            alt={`${title} detail`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Maximize2 className="w-8 h-8 text-white/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
