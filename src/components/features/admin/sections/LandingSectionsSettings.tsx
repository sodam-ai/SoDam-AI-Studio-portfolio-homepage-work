"use client";

import React from "react";
import { Layers, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import {
  AdminInputControl,
  AdminToggleControl,
  AdminSliderControl,
} from "@/components/shared/admin/AdminControls";
import { StyleController } from "../../../shared/admin/StyleController";
import { BrandingSettings } from "@/types/branding";
import { ElementStyle } from "@/types/style";

interface LandingSectionsSettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

export const LandingSectionsSettings = ({
  settings,
  updateNestedSetting,
}: LandingSectionsSettingsProps) => {
  const sections = settings.landing.sections;

  const renderSectionControl = (
    id: keyof typeof sections,
    label: string,
    hasDescription = true,
  ) => {
    const section = sections[id];
    const pathPrefix = `landing.sections.${id}`;

    return (
      <AdminSection
        title={label}
        description={`'${label}' 섹션의 레이아웃, 텍스트, 스타일을 가장 직관적이고 빠르게 제어합니다.`}
        icon={<Layers className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard
            title="기본 정보 및 텍스트 스타일"
            description="섹션의 제목, 설명 및 각각의 시각적 스타일을 설정합니다."
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  섹션 활성화 상태
                </span>
                <button
                  onClick={() =>
                    updateNestedSetting(
                      `${pathPrefix}.isVisible`,
                      !section.isVisible,
                    )
                  }
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all shadow-lg",
                    section.isVisible
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-zinc-800 text-zinc-500 border border-white/5",
                  )}
                >
                  {section.isVisible ? (
                    <>
                      <Eye className="w-3.5 h-3.5" /> 현재 노출 중
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> 현재 숨김 처리
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <AdminInputControl
                  label="메인 제목 (Title)"
                  placeholder="섹션의 큰 제목을 입력하세요"
                  value={section.title}
                  onChange={(val) =>
                    updateNestedSetting(`${pathPrefix}.title`, val)
                  }
                />
                <AdminInputControl
                  label="보조 제목 (Subtitle)"
                  placeholder="제목 위에 작게 표시될 문구"
                  value={section.subtitle || ""}
                  onChange={(val) =>
                    updateNestedSetting(`${pathPrefix}.subtitle`, val)
                  }
                />

                {hasDescription && (
                  <div className="space-y-2">
                    <label
                      htmlFor={`${id}-description`}
                      className="text-[10px] font-bold uppercase tracking-widest text-white/40 block"
                    >
                      상세 설명 (Description)
                    </label>
                    <textarea
                      id={`${id}-description`}
                      placeholder="섹션에 대한 추가 설명을 입력하세요"
                      className="w-full bg-white/3 border border-white/5 p-4 text-xs font-medium text-white focus:border-white/20 transition-all outline-none h-24 rounded-sm"
                      value={section.description || ""}
                      onChange={(e) =>
                        updateNestedSetting(
                          `${pathPrefix}.description`,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <StyleController
                  label="제목(Title)"
                  style={section.titleStyle}
                  onChange={(style: ElementStyle) =>
                    updateNestedSetting(`${pathPrefix}.titleStyle`, style)
                  }
                />
                <StyleController
                  label="보조 제목(Subtitle)"
                  style={section.subtitleStyle}
                  onChange={(style: ElementStyle) =>
                    updateNestedSetting(`${pathPrefix}.subtitleStyle`, style)
                  }
                />
                {hasDescription && (
                  <StyleController
                    label="설명(Description)"
                    style={section.descriptionStyle}
                    onChange={(style: ElementStyle) =>
                      updateNestedSetting(
                        `${pathPrefix}.descriptionStyle`,
                        style,
                      )
                    }
                  />
                )}
              </div>
            </div>
          </AdminCard>

          <div className="space-y-6">
            {id === "showcase" && (
              <AdminCard
                title="카드 그리드 및 요소 노출 제어"
                description="프로젝트 카드의 정렬 방식과 호버 시 나타날 요소들을 선택합니다."
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                      그리드 배치 (Grid Columns)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() =>
                            updateNestedSetting(
                              `${pathPrefix}.gridColumns`,
                              col,
                            )
                          }
                          className={cn(
                            "py-2.5 text-[10px] font-black uppercase tracking-tighter transition-all border rounded-sm",
                            (section.gridColumns || 1) === col
                              ? "bg-white text-black border-white shadow-lg"
                              : "bg-transparent text-white/30 border-white/10 hover:border-white/30",
                          )}
                        >
                          {col}열
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                      카드 화면 비율 (Aspect Ratio)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["16/9", "4/3", "3/4", "1/1", "9/16", "auto"].map(
                        (ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() =>
                              updateNestedSetting(
                                `${pathPrefix}.cardAspectRatio`,
                                ratio,
                              )
                            }
                            className={cn(
                              "py-2 text-[9px] font-bold uppercase tracking-tighter transition-all border rounded-sm",
                              (section.cardAspectRatio || "16/9") === ratio
                                ? "bg-blue-500 text-white border-blue-500 shadow-md"
                                : "bg-transparent text-white/40 border-white/10 hover:border-white/20",
                            )}
                          >
                            {ratio}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    {[
                      { key: "showCardCategory", label: "카테고리 표시" },
                      { key: "showCardTitle", label: "제목 표시" },
                      { key: "showCardDescription", label: "설명 요약 표시" },
                      { key: "showCardLink", label: "이동 링크 표시" },
                    ].map((toggle) => (
                      <AdminToggleControl
                        key={toggle.key}
                        label={toggle.label}
                        checked={Boolean(
                          section[toggle.key as keyof typeof section] ?? true,
                        )}
                        onCheckedChange={(checked) =>
                          updateNestedSetting(
                            `${pathPrefix}.${toggle.key}`,
                            checked,
                          )
                        }
                        className="p-3 bg-white/3 border-white/5"
                      />
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            <AdminCard
              title="공간 및 정렬 제어"
              description="섹션의 정렬 방향과 상하단 여백, 투명도 등을 조절합니다."
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                    콘텐츠 정렬 방향
                  </span>
                  <div className="flex gap-2">
                    {["left", "center", "right"].map((align) => (
                      <button
                        key={align}
                        onClick={() =>
                          updateNestedSetting(`${pathPrefix}.alignment`, align)
                        }
                        className={cn(
                          "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-tighter transition-all duration-300 border",
                          section.alignment === align
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white/40 border-white/10 hover:border-white/30",
                        )}
                      >
                        {align.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AdminInputControl
                    label="상단 여백"
                    type="number"
                    value={section.paddingTop || 0}
                    onChange={(val) =>
                      updateNestedSetting(
                        `${pathPrefix}.paddingTop`,
                        Number(val),
                      )
                    }
                    unit="px"
                  />
                  <AdminInputControl
                    label="하단 여백"
                    type="number"
                    value={section.paddingBottom || 0}
                    onChange={(val) =>
                      updateNestedSetting(
                        `${pathPrefix}.paddingBottom`,
                        Number(val),
                      )
                    }
                    unit="px"
                  />
                </div>

                <AdminSliderControl
                  label="섹션 투명도"
                  value={(section.opacity ?? 1) * 100}
                  onChange={(val) =>
                    updateNestedSetting(`${pathPrefix}.opacity`, val / 100)
                  }
                  min={0}
                  max={100}
                  unit="%"
                />

                <AdminInputControl
                  label="콘텐츠 미세 조정"
                  type="number"
                  value={section.contentOffset || 0}
                  onChange={(val) =>
                    updateNestedSetting(
                      `${pathPrefix}.contentOffset`,
                      Number(val),
                    )
                  }
                  unit="px"
                />
              </div>
            </AdminCard>
          </div>
        </div>
      </AdminSection>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderSectionControl("showcase", "메인 쇼케이스 (Showcase)")}
      {renderSectionControl("philosophy", "철학 & 비전 (Philosophy)")}
      {renderSectionControl("contact", "문의 및 연락 (Contact)", false)}
      {renderSectionControl("footer", "사이트 푸터 (Footer)", false)}
    </div>
  );
};
