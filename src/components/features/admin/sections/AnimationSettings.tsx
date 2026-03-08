"use client";

import React from "react";
import { Zap } from "lucide-react";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { AdminToggleControl } from "@/components/shared/admin/AdminControls";
import { BrandingSettings } from "@/types/branding";

interface AnimationSettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

export const AnimationSettings = ({
  settings,
  updateNestedSetting,
}: AnimationSettingsProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="모션 그래픽 엔진"
        description="사이트 전체의 움직임과 활력을 결정하는 애니메이션 시스템을 설정합니다"
        icon={<Zap className="w-4 h-4 text-yellow-400" />}
      >
        <div className="space-y-6">
          <AdminCard
            title="애니메이션 마스터 스위치"
            description="전체 사이트의 움직임 효과를 일괄적으로 제어합니다."
          >
            <AdminToggleControl
              id="global-animation-toggle"
              label="전체 애니메이션 활성화"
              description="포트폴리오의 모든 인터랙티브 모션 효과를 켜거나 끕니다"
              checked={!!settings.appearance.animations.enabled}
              onCheckedChange={(val: boolean) =>
                updateNestedSetting("appearance.animations.enabled", val)
              }
            />
          </AdminCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminCard
              title="모션 감도 프리셋"
              description="전체적인 애니메이션의 스타일과 느낌을 선택합니다."
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-white/50">
                    프리셋 선택
                  </span>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-lg">
                  {[
                    { id: "apple", label: "애플 (부드러움)" },
                    { id: "trendy", label: "트렌디 (빠름)" },
                    { id: "minimal", label: "미니멀 (기본)" },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        updateNestedSetting(
                          "appearance.animations.preset",
                          preset.id,
                        )
                      }
                      className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 rounded-md ${
                        settings.appearance.animations.preset === preset.id
                          ? "bg-white text-black shadow-lg"
                          : "text-white/40 hover:bg-white/5"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </AdminCard>

            <AdminCard
              title="애니메이션 강도 (Intensity)"
              description="움직임의 크기와 변화 폭을 설정합니다."
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-white/50">
                    강도 수준
                  </span>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-lg">
                  {[
                    { id: "minimal", label: "미니멀" },
                    { id: "medium", label: "중간" },
                    { id: "intense", label: "강렬함" },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() =>
                        updateNestedSetting(
                          "appearance.animations.intensity",
                          level.id,
                        )
                      }
                      className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 rounded-md ${
                        settings.appearance.animations.intensity === level.id
                          ? "bg-white text-black shadow-lg"
                          : "text-white/40 hover:bg-white/5"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </AdminSection>
    </div>
  );
};
