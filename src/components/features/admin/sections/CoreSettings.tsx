"use client";

import React from "react";
import { Palette, Layout } from "lucide-react";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { AdminInput } from "../../../shared/admin/AdminInput";
import { BrandingSettings } from "@/types/branding";

interface CoreSettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

export const CoreSettings = ({
  settings,
  updateNestedSetting,
}: CoreSettingsProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="브랜드 아이덴티티"
        description="사이트의 핵심 색상 팔레트와 기본적인 시각적 미학을 설정합니다"
        icon={<Palette className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4 border-b border-white/5 pb-2">
                핵심 컬러 시스템 (Chromatic Core)
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <AdminInput
                  id="accentColor"
                  label="메인 포인트 색상 (Accent)"
                  type="color"
                  value={settings.appearance.accentColor}
                  onChange={(e) =>
                    updateNestedSetting(
                      "appearance.accentColor",
                      e.target.value,
                    )
                  }
                  className="h-12"
                />
                <AdminInput
                  id="backgroundColor"
                  label="전체 배경 색상 (Background)"
                  type="color"
                  value={settings.appearance.backgroundColor}
                  onChange={(e) =>
                    updateNestedSetting(
                      "appearance.backgroundColor",
                      e.target.value,
                    )
                  }
                  className="h-12"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4 border-b border-white/5 pb-2">
                표면 및 타이포그래피 (Surface & Type)
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <AdminInput
                  id="surfaceColor"
                  label="카드/박스 배경색 (Surface)"
                  type="color"
                  value={settings.appearance.surfaceColor}
                  onChange={(e) =>
                    updateNestedSetting(
                      "appearance.surfaceColor",
                      e.target.value,
                    )
                  }
                  className="h-12"
                />
                <AdminInput
                  id="textColor"
                  label="기본 텍스트 색상 (Text)"
                  type="color"
                  value={settings.appearance.textColor}
                  onChange={(e) =>
                    updateNestedSetting("appearance.textColor", e.target.value)
                  }
                  className="h-12"
                />
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminSection>

      <AdminSection
        title="인터랙티브 & 모션 제어"
        description="시스템의 반응 성능과 애니메이션의 깊이를 설정합니다."
        icon={<Layout className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard
            title="기하학적 미학 (Geometry)"
            description="버튼 시스템의 물리적 형태를 결정합니다."
          >
            <div
              id="buttonStyle"
              className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-sm"
            >
              {(
                [
                  { id: "sharp", label: "직각형 (Sharp)" },
                  { id: "rounded", label: "라운드 (Rounded)" },
                  { id: "glass", label: "글래스 (Glass)" },
                ] as const
              ).map((style) => (
                <button
                  key={style.id}
                  onClick={() =>
                    updateNestedSetting("appearance.buttonStyle", style.id)
                  }
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter transition-all ${
                    settings.appearance.buttonStyle === style.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:bg-white/5"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </AdminCard>

          <AdminCard
            title="상호작용 피드백 (Interaction)"
            description="마우스 커서의 반응 스타일을 설정합니다."
          >
            <div
              id="cursorStyle"
              className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-sm"
            >
              {(
                [
                  { id: "minimal", label: "미니멀 (Minimal)" },
                  { id: "dynamic", label: "다이나믹 (Dynamic)" },
                  { id: "classic", label: "클래식 (Classic)" },
                ] as const
              ).map((style) => (
                <button
                  key={style.id}
                  onClick={() =>
                    updateNestedSetting("appearance.cursorStyle", style.id)
                  }
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter transition-all ${
                    settings.appearance.cursorStyle === style.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:bg-white/5"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-6">
          <AdminCard
            title="모션 강도 제어 (Motion Core)"
            description="전체 사이트의 애니메이션 생동감을 미세하게 조절합니다."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white/5 p-1 border border-white/5 rounded-sm">
              {(
                [
                  { id: "minimal", label: "조용한 (Minimal)" },
                  { id: "medium", label: "표준 (Medium)" },
                  { id: "intense", label: "강렬한 (Intense)" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() =>
                    updateNestedSetting(
                      "appearance.animations.intensity",
                      mode.id,
                    )
                  }
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter transition-all ${
                    settings.appearance.animations.intensity === mode.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/40 hover:bg-white/5"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
};
