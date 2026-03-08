import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { styleToCss, toPx } from "@/types/style";
import { SectionSettings, BrandingSettings } from "@/types/branding";
import { SiteConfig } from "@/types/config";

/**
 * FooterSection: 저작권 및 내비게이션
 */
export default function FooterSection({
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

  return (
    <footer
      className={cn(
        "w-full flex flex-col gap-16 px-6 max-w-7xl mx-auto border-t border-white/5",
        sectionSettings?.alignment === "left" && "items-start",
        sectionSettings?.alignment === "center" && "items-center",
        sectionSettings?.alignment === "right" && "items-end",
      )}
      style={{
        paddingTop:
          sectionSettings?.paddingTop === undefined
            ? toPx(layout.sectionGap)
            : toPx(sectionSettings.paddingTop),
        paddingBottom:
          sectionSettings?.paddingBottom === undefined
            ? toPx("80px")
            : toPx(sectionSettings.paddingBottom),
        opacity: sectionSettings?.opacity ?? 1,
        marginTop: toPx(sectionSettings?.marginTop),
        marginBottom: toPx(sectionSettings?.marginBottom),
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-4 w-full",
          sectionSettings?.alignment === "left" && "items-start text-left",
          sectionSettings?.alignment === "center" && "items-center text-center",
          sectionSettings?.alignment === "right" && "items-end text-right",
        )}
      >
        <div
          className="text-3xl font-black tracking-tighter italic"
          style={{
            ...styleToCss(sectionSettings?.titleStyle),
          }}
        >
          {sectionSettings?.title || siteConfig?.siteName || "SoDam AI Studio."}
        </div>
        <div
          className={cn(
            "flex flex-col gap-2",
            sectionSettings?.alignment === "left" && "items-start",
            sectionSettings?.alignment === "center" && "items-center",
            sectionSettings?.alignment === "right" && "items-end",
          )}
        >
          <span
            className="text-[10px] uppercase tracking-[0.5em] text-white/20"
            style={{
              ...styleToCss(sectionSettings?.subtitleStyle),
            }}
          >
            {sectionSettings?.subtitle ||
              `© ${new Date().getFullYear()} ${siteConfig?.siteName || "SoDam AI Studio"}. All Rights Reserved`}
            <Link href="/admin" className="cursor-default hover:text-white/20">
              .
            </Link>
          </span>

          <div className="flex gap-4 items-center">
            {displayEmail && (
              <a
                href={`mailto:${displayEmail}`}
                className="text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                title="이메일 문의"
              >
                {displayEmail}
              </a>
            )}
            {siteConfig?.connectors
              ?.filter((c) => c.label.toLowerCase() !== "email")
              .map((conn) => (
                <a
                  key={conn.id}
                  href={conn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                  title={conn.label}
                >
                  {conn.label}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-black text-white/40 text-center">
        <Link href="/work" className="hover:text-white transition-all">
          프로젝트 (Work)
        </Link>
        <Link href="/about" className="hover:text-white transition-all">
          스튜디오 (About)
        </Link>
        <Link href="/contact" className="hover:text-white transition-all">
          문의하기 (Contact)
        </Link>
      </div>
    </footer>
  );
}
