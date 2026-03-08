import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { styleToCss, toPx } from "@/types/style";
import { SectionSettings } from "@/types/branding";
import { Project } from "@/types/project";
import MasterpieceCard from "./MasterpieceCard";

/**
 * ShowcaseSection: 하이라이트 프로젝트 전시
 */
export default function ShowcaseSection({
  featuredProjects,
  totalProjects,
  sectionSettings,
}: {
  readonly featuredProjects: Project[];
  readonly totalProjects: number;
  readonly sectionSettings: SectionSettings;
}) {
  if (sectionSettings?.isVisible === false) return null;

  return (
    <section
      id="showcase"
      className="relative z-10 transition-all duration-500"
      style={{
        paddingTop:
          sectionSettings?.paddingTop !== undefined
            ? toPx(sectionSettings.paddingTop)
            : "var(--section-gap, 100px)",
        paddingBottom:
          sectionSettings?.paddingBottom !== undefined
            ? toPx(sectionSettings.paddingBottom)
            : "var(--section-gap, 100px)",
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
          "w-full max-w-7xl mx-auto px-6 mb-14 flex flex-col md:flex-row gap-6",
          sectionSettings?.alignment === "left" &&
            "md:items-end justify-between",
          sectionSettings?.alignment === "center" &&
            "items-center text-center justify-center",
          sectionSettings?.alignment === "right" &&
            "items-end text-right justify-end md:flex-row-reverse",
        )}
      >
        <div className="space-y-3">
          <span
            className="font-black tracking-[0.5em] text-white/30 uppercase block"
            style={{
              fontSize: `clamp(10px, 2vw, 20px)`,
              ...styleToCss(sectionSettings?.subtitleStyle),
            }}
          >
            {sectionSettings?.subtitle || "Selected Works"}
          </span>
          <h3
            className="font-black uppercase tracking-tighter text-white"
            style={{
              fontSize: `clamp(24px, 5vw, 52px)`,
              ...styleToCss(sectionSettings?.titleStyle),
            }}
          >
            {sectionSettings?.title || "Showcase"}
          </h3>
        </div>
        {(sectionSettings?.description ||
          sectionSettings?.alignment !== "center") && (
          <div className="max-w-xs">
            <p
              className="text-white/40 font-medium leading-relaxed"
              style={{
                fontSize: `clamp(12px, 2.5vw, 13px)`,
                ...styleToCss(sectionSettings?.descriptionStyle),
              }}
            >
              {sectionSettings?.description ||
                "세계관을 관통하는 마스터피스. 기술적 정점과 디자인 미학이 응축됩니다."}
            </p>
          </div>
        )}
      </div>

      <div
        className={cn(
          "w-full max-w-7xl mx-auto px-6",
          sectionSettings?.gridColumns === 2
            ? "grid grid-cols-1 md:grid-cols-2 gap-8"
            : sectionSettings?.gridColumns === 3
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-16", // 기본 1열은 기존 간격 유지
        )}
      >
        {featuredProjects.map((project: Project, index: number) => (
          <MasterpieceCard
            key={project.id}
            project={project}
            index={index}
            categoryStyle={sectionSettings?.cardCategoryStyle}
            titleStyle={sectionSettings?.cardTitleStyle}
            descriptionStyle={sectionSettings?.cardDescriptionStyle}
            // 고도화된 요소 제어 설정 전달
            globalAspectRatio={sectionSettings?.cardAspectRatio}
            showCategory={sectionSettings?.showCardCategory}
            showTitle={sectionSettings?.showCardTitle}
            showDescription={sectionSettings?.showCardDescription}
            showLink={sectionSettings?.showCardLink}
          />
        ))}
      </div>

      <div className="mt-20 md:mt-32 flex justify-center">
        <Link
          href="/work"
          className="group relative px-8 md:px-12 py-5 md:py-6 overflow-hidden border border-white/10 glass-effect"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] group-hover:text-black transition-colors duration-500">
            View All Archive ({totalProjects.toString().padStart(2, "0")})
          </span>
        </Link>
      </div>
    </section>
  );
}
