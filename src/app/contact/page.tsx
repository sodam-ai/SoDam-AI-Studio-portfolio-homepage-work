"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, ExternalLink } from "lucide-react";
import contactData from "@/content/contact.json";

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
  const { headline, description, channels } = contactData as {
    headline: string;
    description: string;
    channels: ContactChannel[];
  };

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
          <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl">
            {description}
          </p>
        </motion.div>

        {/* 채널 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel, idx) => {
            const IconComponent = iconMap[channel.icon] ?? ExternalLink;

            return (
              <motion.a
                key={channel.type}
                href={channel.action}
                target={
                  channel.type === "email" || channel.type === "phone"
                    ? "_self"
                    : "_blank"
                }
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex items-center gap-8 p-8 border border-white/10 hover:border-white/30 hover:bg-white/3 transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">
                    {channel.label}
                  </h3>
                  <p className="text-sm text-white/40 font-medium">
                    {channel.value}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
