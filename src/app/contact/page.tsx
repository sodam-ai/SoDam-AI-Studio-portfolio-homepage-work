"use client";

import { useState, useEffect } from "react";
import { ContactChannel } from "@/types/contact";
import { BrandingSettings } from "@/types/branding";
import { ContactHeader } from "@/components/features/contact/ContactHeader";
import { ContactChannelList } from "@/components/features/contact/ContactChannelList";
import { ContactLocation } from "@/components/features/contact/ContactLocation";

export default function ContactPage() {
  const [data, setData] = useState<{
    title: string;
    description: string;
    channels: ContactChannel[];
    location?: {
      showLocation: boolean;
      addressText: string;
      mapEmbedUrl: string;
    };
  } | null>(null);

  const [settings, setSettings] = useState<BrandingSettings | null>(null);

  useEffect(() => {
    // Load contact content
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

    // Load branding settings for page control
    fetch(`/api/admin/update?type=settings&t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setSettings(result.data);
        }
      })
      .catch((err) => console.error("Failed to load branding settings:", err));
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

  const { title, description, channels, location } = data;

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{
        paddingTop: settings?.appearance.layout.containerPadding ?? 160,
        paddingBottom: settings?.appearance.layout.containerPadding ?? 128,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <ContactHeader
          title={settings?.pages?.talk?.title || title}
          description={settings?.pages?.talk?.description || description}
          alignment={
            (settings?.pages?.talk?.alignment as "left" | "center" | "right") ||
            "center"
          }
          titleStyle={settings?.pages?.talk?.titleStyle}
          descriptionStyle={settings?.pages?.talk?.descriptionStyle}
          showLabel={settings?.pages?.talk?.showLabel}
          showTitle={settings?.pages?.talk?.showTitle}
          showDescription={settings?.pages?.talk?.showDescription}
          contentOffset={settings?.pages?.talk?.contentOffset}
          animations={settings?.appearance?.animations}
        />

        <ContactChannelList channels={channels} />

        {location && (
          <ContactLocation
            showLocation={location.showLocation}
            addressText={location.addressText}
            mapEmbedUrl={location.mapEmbedUrl}
          />
        )}
      </div>
    </main>
  );
}
