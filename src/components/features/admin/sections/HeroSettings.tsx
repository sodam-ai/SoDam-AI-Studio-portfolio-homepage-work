"use client";

import React from "react";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { StyleController } from "../../../shared/admin/StyleController";
import { BrandingSettings } from "@/types/branding";
import { ElementStyle } from "@/types/style";

interface HeroSettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

export const HeroSettings = ({
  settings,
  updateNestedSetting,
}: HeroSettingsProps) => {
  const hero = settings.landing.hero;

  const titleWords = React.useMemo(() => {
    return hero.title.trim().split(/\s+/).filter(Boolean);
  }, [hero.title]);

  const toggleWordStyle = (index: number) => {
    const currentStyles = [...hero.wordStyles];
    const styleOrder = ["solid", "line", "accent", "glow"];

    while (currentStyles.length <= index) {
      currentStyles.push("solid");
    }

    const currentStyleIdx = styleOrder.indexOf(currentStyles[index]) || 0;
    const nextStyleIdx = (currentStyleIdx + 1) % styleOrder.length;
    currentStyles[index] = styleOrder[nextStyleIdx];

    updateNestedSetting("landing.hero.wordStyles", currentStyles);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="히어로 캔버스"
        description="랜딩 페이지 최상단의 핵심 문구와 시각적 앵커를 정밀하게 구성합니다."
        icon={<Home className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="hero-title-input"
                  className="text-[10px] font-bold uppercase tracking-widest text-white/40 block"
                >
                  메인 타이틀 내용
                </label>
                <textarea
                  id="hero-title-input"
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-medium text-white focus:border-white/20 transition-all outline-none h-28 rounded-sm"
                  value={hero.title}
                  onChange={(e) =>
                    updateNestedSetting("landing.hero.title", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hero-subtitle-input"
                  className="text-[10px] font-bold uppercase tracking-widest text-white/40 block"
                >
                  서브타이틀 내용
                </label>
                <textarea
                  id="hero-subtitle-input"
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-medium text-white/70 focus:border-white/20 transition-all outline-none h-20 rounded-sm"
                  value={hero.subtitle}
                  onChange={(e) =>
                    updateNestedSetting("landing.hero.subtitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <StyleController
                  label="타이틀 스타일"
                  style={hero.titleStyle}
                  onChange={(style: ElementStyle) =>
                    updateNestedSetting("landing.hero.titleStyle", style)
                  }
                />
                <StyleController
                  label="서브타이틀 스타일"
                  style={hero.subtitleStyle}
                  onChange={(style: ElementStyle) =>
                    updateNestedSetting("landing.hero.subtitleStyle", style)
                  }
                />
              </div>
            </div>
          </AdminCard>

          <div className="space-y-6">
            <AdminCard>
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">
                  단어별 인터랙티브 스타일
                </span>
                <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/5 rounded-sm min-h-30 content-start">
                  {titleWords.length > 0 ? (
                    titleWords.map((word, idx) => {
                      const style = hero.wordStyles[idx] || "solid";
                      const styleClasses = {
                        solid: "bg-white text-black border-white",
                        line: "bg-transparent text-white border-white/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]",
                        accent:
                          "bg-transparent text-white border-white italic font-serif",
                        glow: "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]",
                      };
                      return (
                        <button
                          key={`${idx}-${word}`}
                          onClick={() => toggleWordStyle(idx)}
                          className={cn(
                            "px-3 py-2 text-[10px] font-bold uppercase tracking-tighter transition-all duration-200 border transform hover:scale-105 active:scale-95",
                            styleClasses[style as keyof typeof styleClasses],
                          )}
                        >
                          {word}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-[10px] text-white/20 italic p-2">
                      타이틀을 입력하면 스타일을 제어할 수 있습니다.
                    </p>
                  )}
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </AdminSection>
    </div>
  );
};
