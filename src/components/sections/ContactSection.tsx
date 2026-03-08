import React from "react";
import { cn } from "@/lib/utils";
import { styleToCss, toPx } from "@/types/style";
import { SectionSettings, BrandingSettings } from "@/types/branding";
import { SiteConfig } from "@/types/config";

/**
 * ContactSection: 문의 및 액션 유도
 */
export default function ContactSection({
  sectionSettings,
  layout,
  settings,
  siteConfig,
}: {
  readonly sectionSettings: SectionSettings;
  readonly layout: BrandingSettings["appearance"]["layout"];
  readonly settings?: BrandingSettings;
  readonly siteConfig?: SiteConfig;
}) {
  if (sectionSettings?.isVisible === false) return null;

  // Find email from connectors if available
  const emailConnector = siteConfig?.connectors?.find(
    (c) => c.label.toLowerCase() === "email" || c.id === "email",
  );
  const displayEmail = emailConnector?.url || settings?.pages?.talk?.email;

  // Other social connectors
  const socialConnectors = (siteConfig?.connectors || []).filter(
    (c) => c.label.toLowerCase() !== "email",
  );

  return (
    <section
      className="bg-white text-black transition-all duration-500"
      style={{
        paddingTop:
          sectionSettings?.paddingTop === undefined
            ? toPx(layout.sectionGap)
            : toPx(sectionSettings.paddingTop),
        paddingBottom:
          sectionSettings?.paddingBottom === undefined
            ? toPx(layout.sectionGap)
            : toPx(sectionSettings.paddingBottom),
        opacity: sectionSettings?.opacity ?? 1,
        marginTop: toPx(
          (sectionSettings?.marginTop ?? 0) +
            (sectionSettings?.contentOffset ?? 0),
        ),
        marginBottom: toPx(sectionSettings?.marginBottom),
      }}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto px-6 space-y-12",
          sectionSettings?.alignment === "left" && "text-left",
          sectionSettings?.alignment === "center" && "text-center",
          sectionSettings?.alignment === "right" && "text-right",
        )}
      >
        <h2
          className="font-black uppercase tracking-tighter leading-none italic whitespace-pre-line"
          style={{
            fontSize: `clamp(40px, 8vw, 120px)`,
            ...styleToCss(sectionSettings?.titleStyle),
          }}
        >
          {sectionSettings?.title || "당신의 상상을\n현실로 만듭니다."}
        </h2>
        <div
          className={cn(
            "flex flex-col md:flex-row items-center gap-8",
            sectionSettings?.alignment === "left" && "justify-start",
            sectionSettings?.alignment === "center" && "justify-center",
            sectionSettings?.alignment === "right" && "justify-end",
          )}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center flex-wrap">
            {displayEmail && (
              <a
                href={`mailto:${displayEmail}`}
                className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
              >
                {displayEmail}
              </a>
            )}

            {socialConnectors.map((conn) => (
              <React.Fragment key={conn.id}>
                <div className="w-1.5 h-1.5 bg-black rounded-full hidden md:block opacity-20" />
                <a
                  href={conn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
                >
                  {conn.label}
                </a>
              </React.Fragment>
            ))}

            <div className="w-1.5 h-1.5 bg-black rounded-full hidden md:block opacity-20" />
            <span className="text-sm font-black uppercase tracking-widest opacity-40">
              {siteConfig?.location || "Based in Global / Digital"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
