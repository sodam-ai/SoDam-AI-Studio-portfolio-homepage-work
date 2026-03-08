"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectLightboxProps {
  selectedMedia: { url: string; type: "image" | "video" } | null;
  setSelectedMedia: (
    media: { url: string; type: "image" | "video" } | null,
  ) => void;
}

export function ProjectLightbox({
  selectedMedia,
  setSelectedMedia,
}: ProjectLightboxProps) {
  return (
    <AnimatePresence>
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 z-101 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-7xl max-h-[90vh] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === "image" ? (
              <Image
                src={selectedMedia.url}
                alt="Expanded view"
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
            ) : (
              <video
                src={selectedMedia.url}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
