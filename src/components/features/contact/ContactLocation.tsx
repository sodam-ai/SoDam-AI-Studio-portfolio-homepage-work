"use client";

import { motion } from "framer-motion";

interface ContactLocationProps {
  showLocation: boolean;
  addressText?: string;
  mapEmbedUrl?: string;
}

export function ContactLocation({
  showLocation,
  addressText,
  mapEmbedUrl,
}: Readonly<ContactLocationProps>) {
  if (!showLocation || (!addressText && !mapEmbedUrl)) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-24 space-y-8"
    >
      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8 border-b border-white/10 pb-4">
        Location
      </h3>

      <div className="flex flex-col gap-8 p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-500 bg-white/3">
        {addressText && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              Address
            </p>
            <p className="text-sm md:text-base text-white/80 font-medium whitespace-pre-wrap leading-relaxed">
              {addressText}
            </p>
          </div>
        )}

        {mapEmbedUrl && (
          <div className="w-full h-75 md:h-112.5 border border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 bg-white/5">
            <iframe
              title="Google Maps Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}
      </div>
    </motion.section>
  );
}
