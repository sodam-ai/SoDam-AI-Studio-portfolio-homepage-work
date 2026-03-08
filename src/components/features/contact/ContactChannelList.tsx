"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
import { ContactChannel } from "@/types/contact";

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

/* lucide-react 아이콘 매핑 */
const iconMap: Record<string, React.ElementType> = {
  Mail,
  MessageCircle,
  Instagram: InstagramIcon,
  Phone,
  ExternalLink,
};

interface ContactChannelListProps {
  channels: ContactChannel[];
}

export function ContactChannelList({
  channels,
}: Readonly<ContactChannelListProps>) {
  return (
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
  );
}
