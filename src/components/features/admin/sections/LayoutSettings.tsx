"use client";

import React from "react";
import { Layout } from "lucide-react";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { AdminSliderControl } from "@/components/shared/admin/AdminControls";
import { BrandingSettings } from "@/types/branding";

interface LayoutSettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

export const LayoutSettings = ({
  settings,
  updateNestedSetting,
}: LayoutSettingsProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="공간의 리듬"
        description="전체적인 레이아웃의 구도와 구조적인 여백을 정밀하게 제어합니다."
        icon={<Layout className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard
            title="섹션 레이아웃"
            description="컨텐츠 블록 간의 수직 거리를 조절합니다."
          >
            <AdminSliderControl
              label="섹션 간 간격 (Gap)"
              description="섹션 사이의 여백을 픽셀 단위로 설정합니다."
              value={settings.appearance.layout.sectionGap}
              min={0}
              max={200}
              unit="px"
              onChange={(val) =>
                updateNestedSetting("appearance.layout.sectionGap", val)
              }
            />
          </AdminCard>

          <AdminCard
            title="텍스트 가독성 (줄 간격)"
            description="본문 텍스트의 상하 간격을 미세하게 조정합니다."
          >
            <AdminSliderControl
              label="수직 리듬 (Line Height)"
              description="줄 사이의 간격을 설정합니다."
              value={Number.parseFloat(
                settings.appearance.layout.lineHeight.toString(),
              )}
              min={1}
              max={2}
              step={0.1}
              unit="lh"
              onChange={(val) =>
                updateNestedSetting("appearance.layout.lineHeight", val)
              }
            />
          </AdminCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <AdminCard
            title="요소 곡률 (Radius)"
            description="인터페이스 요소들의 모서리 둥글기를 조절합니다."
          >
            <AdminSliderControl
              label="카드 모서리 반경 (Card Radius)"
              description="카드 소자의 코너 반경을 픽셀 단위로 설정합니다."
              value={settings.appearance.layout.cardRadius ?? 0}
              min={0}
              max={40}
              unit="px"
              onChange={(val) =>
                updateNestedSetting("appearance.layout.cardRadius", val)
              }
            />
          </AdminCard>

          <AdminCard
            title="콘텐츠 폭 제어"
            description="사이트 전체적인 콘텐츠의 가로 범위를 설정합니다."
          >
            <div className="grid grid-cols-1 gap-4">
              <AdminSliderControl
                label="컨테이너 너비 (Max Width)"
                description="전체 레이아웃의 최대 가로 너비를 설정합니다."
                value={settings.appearance.layout.containerMaxWidth ?? 1440}
                min={1000}
                max={2000}
                unit="px"
                onChange={(val) =>
                  updateNestedSetting(
                    "appearance.layout.containerMaxWidth",
                    val,
                  )
                }
              />
            </div>
          </AdminCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <AdminCard
            title="텍스트 밀도 (자간)"
            description="글자 사이의 수평 간격을 조정합니다."
          >
            <AdminSliderControl
              label="문자 밀도 (Letter Spacing)"
              description="자간을 EM 단위로 조절합니다."
              value={Number.parseFloat(
                settings.appearance.layout.letterSpacing
                  .toString()
                  .replace("em", ""),
              )}
              min={-0.1}
              max={0.5}
              step={0.01}
              unit="em"
              onChange={(val) =>
                updateNestedSetting(
                  "appearance.layout.letterSpacing",
                  `${val}em`,
                )
              }
            />
          </AdminCard>

          <AdminCard
            title="캔버스 정렬"
            description="전체 사이트의 기본 텍스트 정렬 방식을 결정합니다."
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest text-white/50">
                  기본 정렬 방식
                </span>
              </div>
              <div className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-lg">
                {[
                  { id: "left", label: "좌측" },
                  { id: "center", label: "중앙" },
                  { id: "right", label: "우측" },
                ].map((align) => (
                  <button
                    key={align.id}
                    type="button"
                    onClick={() =>
                      updateNestedSetting(
                        "appearance.layout.textAlign",
                        align.id,
                      )
                    }
                    className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 rounded-md ${
                      settings.appearance.layout.textAlign === align.id
                        ? "bg-white text-black shadow-lg"
                        : "text-white/40 hover:bg-white/5"
                    }`}
                  >
                    {align.label}
                  </button>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
};
