"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

/* Instagram 아이콘 (lucide-react의 Instagram은 deprecated) */
function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface ContactChannel {
  type: string;
  label: string;
  value: string;
  icon: string;
  action: string;
}

/* lucide-react 아이콘 매핑 */
const iconMap: Record<string, React.ElementType> = {
  Mail,
  MessageCircle,
  Instagram: InstagramIcon,
  Phone,
  ExternalLink,
};

export default function ContactPage() {
  const [data, setData] = useState<{
    headline: string;
    description: string;
    channels: ContactChannel[];
    location?: {
      showLocation: boolean;
      addressText: string;
      mapEmbedUrl: string;
    };
  } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/update?type=contact&t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch((err) => console.error("Failed to load contact data:", err));
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-40 pb-32 flex items-center justify-center">
        <div className="animate-pulse text-white/40 tracking-widest uppercase font-black text-xs text-center space-y-4">
          <div className="w-8 h-8 mx-auto rounded-full border-t-2 border-white/20 animate-spin" />
          <p>Loading Channels...</p>
        </div>
      </main>
    );
  }

  const { headline, description, channels } = data;

  return (
    <main className="min-h-screen bg-background text-foreground pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 mb-24"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-bold">
            Contact
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            {headline}
          </h1>
          <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl whitespace-pre-wrap">
            {description}
          </p>
        </motion.div>

        {/* 채널 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel, idx) => {
            const isCustomIcon =
              channel.icon &&
              (channel.icon.startsWith("http") || channel.icon.startsWith("/"));
            const IconComponent = isCustomIcon
              ? null
              : iconMap[channel.icon] || ExternalLink;

            return (
              <motion.a
                key={channel.type}
                href={channel.action}
                target={
                  channel.type === "email" ||
                  channel.type === "phone" ||
                  channel.action.startsWith("mailto:") ||
                  channel.action.startsWith("tel:")
                    ? "_self"
                    : "_blank"
                }
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 p-6 sm:p-8 border border-white/10 hover:border-white/30 hover:bg-white/3 transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all overflow-hidden bg-white/5">
                  {isCustomIcon ? (
                    <Image
                      src={channel.icon}
                      alt={channel.label}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    IconComponent && <IconComponent className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">
                    {channel.label}
                  </h3>
                  <p className="text-sm text-white/40 font-medium whitespace-pre-wrap">
                    {channel.value}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </motion.a>
            );
          })}
        </div>

        {/* Location Section */}
        {data.location?.showLocation &&
          (data.location.addressText || data.location.mapEmbedUrl) && (
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
                {data.location.addressText && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                      Address
                    </p>
                    <p className="text-sm md:text-base text-white/80 font-medium whitespace-pre-wrap leading-relaxed">
                      {data.location.addressText}
                    </p>
                  </div>
                )}

                {data.location.mapEmbedUrl && (
                  <div className="w-full h-75 md:h-112.5 border border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 bg-white/5">
                    <iframe
                      title="Google Maps Location"
                      src={data.location.mapEmbedUrl}
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
          )}
      </div>
    </main>
  );
}
