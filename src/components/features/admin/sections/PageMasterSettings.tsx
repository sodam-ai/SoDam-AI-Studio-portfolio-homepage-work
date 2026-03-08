"use client";

import React, { useState } from "react";
import {
  Home,
  Layers,
  FileText,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { AdminSection, AdminCard } from "../../../shared/admin/AdminSection";
import { StyleController } from "../../../shared/admin/StyleController";
import {
  AdminInputControl,
  AdminTextareaControl,
  AdminSliderControl,
  AdminToggleControl,
} from "@/components/shared/admin/AdminControls";
import { BrandingSettings } from "@/types/branding";
import { ElementStyle } from "@/types/style";
import { cn } from "@/lib/utils";

interface PageMasterSettingsProps {
  settings: BrandingSettings;
  updateNestedSetting: (path: string, value: unknown) => void;
}

type SubTab = "home" | "work" | "about" | "talk" | "extras";

export const PageMasterSettings = ({
  settings,
  updateNestedSetting,
}: PageMasterSettingsProps) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("home");

  const hero = settings.landing.hero;
  const showcase = settings.landing.sections.showcase;
  const philosophy = settings.landing.sections.philosophy;
  const contact = settings.landing.sections.contact;
  const footer = settings.landing.sections.footer;

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

  const renderSectionHeader = (
    path: string,
    isVisible: boolean,
    label: string,
  ) => (
    <div className="flex items-center justify-between pb-4 border-b border-white/5">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
        {label} 활성화 상태
      </span>
      <AdminToggleControl
        id={`${path}-visibility`}
        label={isVisible ? "현재 노출 중" : "현재 숨김 처리"}
        checked={isVisible}
        onCheckedChange={(val) => updateNestedSetting(`${path}.isVisible`, val)}
        className="px-4 py-2"
      />
    </div>
  );

  const subTabs = [
    {
      id: "home",
      label: "메인 랜딩",
      icon: <Home className="w-3.5 h-3.5" />,
      desc: "히어로/쇼케이스",
    },
    {
      id: "work",
      label: "아카이브",
      icon: <FileText className="w-3.5 h-3.5" />,
      desc: "프로젝트 그리드",
    },
    {
      id: "about",
      label: "브랜드 서사",
      icon: <FileText className="w-3.5 h-3.5" />,
      desc: "스토리/미션",
    },
    {
      id: "talk",
      label: "네트워킹",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      desc: "협업/연락 채널",
    },
    {
      id: "extras",
      label: "통합 조율",
      icon: <Layers className="w-3.5 h-3.5" />,
      desc: "철학/문의/푸터",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 서브 네비게이션 */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-white/3 border border-white/5 rounded-sm">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SubTab)}
            className={cn(
              "relative flex flex-col items-center gap-1.5 py-4 px-2 transition-all duration-500 overflow-hidden group",
              activeSubTab === tab.id
                ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                : "text-white/40 hover:bg-white/5 hover:text-white/70",
            )}
          >
            <div
              className={cn(
                "transition-transform duration-500",
                activeSubTab === tab.id ? "scale-110" : "group-hover:scale-110",
              )}
            >
              {tab.icon}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {tab.label}
              </span>
              <span
                className={cn(
                  "text-[8px] font-medium tracking-tighter transition-opacity duration-500",
                  activeSubTab === tab.id ? "opacity-60" : "opacity-0",
                )}
              >
                {tab.desc}
              </span>
            </div>
            {activeSubTab === tab.id && (
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <ChevronRight className="w-2 h-2" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-150 flex flex-col transition-all duration-500 relative">
        {/* 1. 메인 랜딩 탭 (Home & Showcase) */}
        {activeSubTab === "home" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
            <AdminSection
              title="히어로 캔버스 (Hero)"
              description="랜딩 페이지 최상단의 핵심 문구와 시각적 앵커를 정밀하게 구성합니다."
              icon={<Home className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminCard title="타이틀 및 서사를 제어합니다.">
                  <div className="space-y-6">
                    <AdminTextareaControl
                      label="메인 타이틀 내용"
                      value={hero.title}
                      onChange={(val) =>
                        updateNestedSetting("landing.hero.title", val)
                      }
                      rows={3}
                    />
                    <AdminTextareaControl
                      label="서브타이틀 내용"
                      value={hero.subtitle}
                      onChange={(val) =>
                        updateNestedSetting("landing.hero.subtitle", val)
                      }
                      rows={2}
                    />
                    <div className="space-y-4 pt-4 border-t border-white/10">
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
                          updateNestedSetting(
                            "landing.hero.subtitleStyle",
                            style,
                          )
                        }
                      />
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="단어별 효과 및 위치 제어">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/5 rounded-sm min-h-32 content-start">
                      {titleWords.length > 0 ? (
                        titleWords.map((word, idx) => {
                          const style = hero.wordStyles[idx] || "solid";
                          const styleClasses = {
                            solid: "bg-white text-black border-white",
                            line: "bg-transparent text-white border-white/40",
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
                                styleClasses[
                                  style as keyof typeof styleClasses
                                ],
                              )}
                            >
                              {word}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-[10px] text-white/20 italic p-2">
                          타이틀을 입력하면 효과를 제어할 수 있습니다.
                        </p>
                      )}
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-4">
                        <AdminSliderControl
                          label="상단 여백"
                          value={hero.paddingTop || 0}
                          min={0}
                          max={300}
                          unit="px"
                          onChange={(val) =>
                            updateNestedSetting("landing.hero.paddingTop", val)
                          }
                        />
                        <AdminSliderControl
                          label="하단 여백"
                          value={hero.paddingBottom || 0}
                          min={0}
                          max={300}
                          unit="px"
                          onChange={(val) =>
                            updateNestedSetting(
                              "landing.hero.paddingBottom",
                              val,
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <AdminSliderControl
                          label="타이틀-서브 간격"
                          value={hero.titleSubtitleGap || 0}
                          min={0}
                          max={100}
                          unit="px"
                          onChange={(val) =>
                            updateNestedSetting(
                              "landing.hero.titleSubtitleGap",
                              val,
                            )
                          }
                        />
                        <AdminSliderControl
                          label="최소 높이 (min-h)"
                          value={
                            Number.parseInt(
                              String(hero.minHeight || "100"),
                              10,
                            ) || 100
                          }
                          min={50}
                          max={100}
                          unit="vh"
                          onChange={(val) =>
                            updateNestedSetting(
                              "landing.hero.minHeight",
                              `${val}vh`,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>

            <AdminSection
              title="메인 쇼케이스 (Showcase)"
              description="랜딩 페이지 프로젝트 그리드 및 카드 디자인을 정밀 제어합니다."
              icon={<Layers className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminCard title="텍스트 및 스타일 구성">
                  <div className="space-y-6">
                    {renderSectionHeader(
                      "landing.sections.showcase",
                      Boolean(showcase.isVisible),
                      "쇼케이스",
                    )}
                    <AdminInputControl
                      label="섹션 제목"
                      value={showcase.title || ""}
                      onChange={(val) =>
                        updateNestedSetting(
                          "landing.sections.showcase.title",
                          val,
                        )
                      }
                    />
                    <AdminTextareaControl
                      label="섹션 설명"
                      value={showcase.description || ""}
                      onChange={(val) =>
                        updateNestedSetting(
                          "landing.sections.showcase.description",
                          val,
                        )
                      }
                      rows={3}
                    />
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <StyleController
                        label="제목 스타일"
                        style={showcase.titleStyle}
                        onChange={(style: ElementStyle) =>
                          updateNestedSetting(
                            "landing.sections.showcase.titleStyle",
                            style,
                          )
                        }
                      />
                      <StyleController
                        label="설명 스타일"
                        style={showcase.descriptionStyle}
                        onChange={(style: ElementStyle) =>
                          updateNestedSetting(
                            "landing.sections.showcase.descriptionStyle",
                            style,
                          )
                        }
                      />
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="그리드 레이아웃 및 카드 정밀 제어">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          그리드 열 배분
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {[1, 2, 3].map((col) => (
                            <button
                              key={col}
                              onClick={() =>
                                updateNestedSetting(
                                  "landing.sections.showcase.gridColumns",
                                  col,
                                )
                              }
                              className={cn(
                                "flex-1 py-2 text-[10px] font-black transition-all",
                                (showcase.gridColumns || 1) === col
                                  ? "bg-white text-black"
                                  : "text-white/40 hover:text-white/60",
                              )}
                            >
                              {col}열
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          정렬 방향
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {["left", "center", "right"].map((align) => (
                            <button
                              key={align}
                              onClick={() =>
                                updateNestedSetting(
                                  "landing.sections.showcase.alignment",
                                  align,
                                )
                              }
                              className={cn(
                                "flex-1 py-2 text-[10px] font-black uppercase transition-all",
                                (showcase.alignment || "left") === align
                                  ? "bg-white text-black"
                                  : "text-white/40 hover:text-white/60",
                              )}
                            >
                              {align.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                        카드 화면 비율 (Aspect Ratio)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {["16/9", "4/3", "3/4", "1/1", "9/16", "auto"].map(
                          (ratio) => (
                            <button
                              key={ratio}
                              onClick={() =>
                                updateNestedSetting(
                                  "landing.sections.showcase.cardAspectRatio",
                                  ratio,
                                )
                              }
                              className={cn(
                                "py-2 text-[9px] font-bold border transition-all rounded-sm",
                                (showcase.cardAspectRatio || "16/9") === ratio
                                  ? "bg-white text-black border-white"
                                  : "border-white/10 text-white/30 hover:border-white/30",
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
                        { key: "showCardCategory", label: "카테고리 노출" },
                        { key: "showCardTitle", label: "제목 노출" },
                        { key: "showCardDescription", label: "설명 노출" },
                        { key: "showCardLink", label: "링크 노출" },
                      ].map((toggle) => (
                        <AdminToggleControl
                          key={toggle.key}
                          label={toggle.label}
                          checked={Boolean(
                            showcase[toggle.key as keyof typeof showcase] ??
                            true,
                          )}
                          onCheckedChange={(val) =>
                            updateNestedSetting(
                              `landing.sections.showcase.${toggle.key}`,
                              val,
                            )
                          }
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <AdminSliderControl
                        label="상단 여백"
                        value={showcase.paddingTop || 0}
                        min={0}
                        max={200}
                        unit="px"
                        onChange={(val) =>
                          updateNestedSetting(
                            "landing.sections.showcase.paddingTop",
                            val,
                          )
                        }
                      />
                      <AdminSliderControl
                        label="하단 여백"
                        value={showcase.paddingBottom || 0}
                        min={0}
                        max={200}
                        unit="px"
                        onChange={(val) =>
                          updateNestedSetting(
                            "landing.sections.showcase.paddingBottom",
                            val,
                          )
                        }
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        )}

        {/* 2. 아카이브 탭 (WORK) */}
        {activeSubTab === "work" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
            <AdminSection
              title="아카이브 마스터 (Work)"
              description="프로젝트 그리드의 전수 데이터와 시각적 전시 전략을 제어합니다."
              icon={<FileText className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdminCard title="헤더 서사 및 스타일">
                  <div className="space-y-6">
                    <AdminInputControl
                      label="메인 타이틀"
                      value={settings.pages.work.title || "ARCHIVE"}
                      onChange={(val) =>
                        updateNestedSetting("pages.work.title", val)
                      }
                    />
                    <AdminTextareaControl
                      label="안내 설명글 (Description)"
                      value={settings.pages.work.description || ""}
                      onChange={(val) =>
                        updateNestedSetting("pages.work.description", val)
                      }
                      rows={3}
                    />
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <StyleController
                        label="타이틀 스타일"
                        style={settings.pages.work.titleStyle}
                        onChange={(s) =>
                          updateNestedSetting("pages.work.titleStyle", s)
                        }
                      />
                      <StyleController
                        label="설명 스타일"
                        style={settings.pages.work.descriptionStyle}
                        onChange={(s) =>
                          updateNestedSetting("pages.work.descriptionStyle", s)
                        }
                      />
                    </div>
                  </div>
                </AdminCard>

                <AdminCard title="그리드 레이아웃 엔진">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <AdminSliderControl
                        label="카드 간격 (Gap)"
                        value={settings.pages.work.cardGap}
                        min={0}
                        max={100}
                        unit="px"
                        onChange={(val) =>
                          updateNestedSetting("pages.work.cardGap", val)
                        }
                      />
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          그리드 열 (Columns)
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {[1, 2, 3, 4].map((col) => (
                            <button
                              key={col}
                              onClick={() =>
                                updateNestedSetting(
                                  "pages.work.gridColumns",
                                  col,
                                )
                              }
                              className={cn(
                                "flex-1 py-2 text-[10px] font-black transition-all",
                                settings.pages.work.gridColumns === col
                                  ? "bg-white text-black"
                                  : "text-white/40 hover:text-white/60",
                              )}
                            >
                              {col}열
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          콘텐츠 정렬
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {["left", "center", "right"].map((align) => (
                            <button
                              key={align}
                              onClick={() =>
                                updateNestedSetting(
                                  "pages.work.alignment",
                                  align,
                                )
                              }
                              className={cn(
                                "flex-1 py-1 px-2 text-[9px] font-black uppercase transition-all",
                                settings.pages.work.alignment === align
                                  ? "bg-white text-black"
                                  : "text-white/40",
                              )}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          카드 디자인 테마
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {["minimal", "bold", "glass"].map((st) => (
                            <button
                              key={st}
                              onClick={() =>
                                updateNestedSetting("pages.work.cardDesign", st)
                              }
                              className={cn(
                                "flex-1 py-1 px-1 text-[9px] font-black uppercase transition-all",
                                settings.pages.work.cardDesign === st
                                  ? "bg-white text-black"
                                  : "text-white/40",
                              )}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                      <AdminToggleControl
                        label="타이틀 노출"
                        checked={!!settings.pages.work.showTitle}
                        onCheckedChange={(val) =>
                          updateNestedSetting("pages.work.showTitle", val)
                        }
                      />
                      <AdminToggleControl
                        label="설명 텍스트 노출"
                        checked={!!settings.pages.work.showDescription}
                        onCheckedChange={(val) =>
                          updateNestedSetting("pages.work.showDescription", val)
                        }
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        )}

        {/* 3. 브랜드 서사 탭 (ABOUT) */}
        {activeSubTab === "about" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
            <AdminSection
              title="브랜드 스토리 빌더 (About)"
              description="인격적 가치와 커리어 히스토리를 전달하는 레이아웃 전략을 수립합니다."
              icon={<FileText className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdminCard title="핵심 메시지 및 상세 서사">
                  <div className="space-y-6">
                    <AdminInputControl
                      label="소개 타이틀"
                      value={settings.pages.about.title || ""}
                      onChange={(val) =>
                        updateNestedSetting("pages.about.title", val)
                      }
                    />
                    <AdminTextareaControl
                      label="미션 스테이트먼트"
                      value={settings.pages.about.description || ""}
                      onChange={(val) =>
                        updateNestedSetting("pages.about.description", val)
                      }
                      rows={2}
                    />
                    <AdminTextareaControl
                      label="스토리 (Personal Story)"
                      value={settings.pages.about.story || ""}
                      onChange={(val) =>
                        updateNestedSetting("pages.about.story", val)
                      }
                      rows={5}
                    />
                  </div>
                </AdminCard>

                <AdminCard title="전시 레이아웃 및 비주얼 전략">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          레이아웃 구성
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {["split", "full", "minimal"].map((type) => (
                            <button
                              key={type}
                              onClick={() =>
                                updateNestedSetting(
                                  "pages.about.layoutType",
                                  type,
                                )
                              }
                              className={cn(
                                "flex-1 py-1 text-[9px] font-black uppercase transition-all",
                                settings.pages.about.layoutType === type
                                  ? "bg-white text-black"
                                  : "text-white/40",
                              )}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                          비주얼 배치
                        </span>
                        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10">
                          {["left", "right", "top"].map((pos) => (
                            <button
                              key={pos}
                              onClick={() =>
                                updateNestedSetting(
                                  "pages.about.imagePosition",
                                  pos,
                                )
                              }
                              className={cn(
                                "flex-1 py-1 text-[9px] font-black uppercase transition-all",
                                settings.pages.about.imagePosition === pos
                                  ? "bg-white text-black"
                                  : "text-white/40",
                              )}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <StyleController
                        label="소개 타이틀 스타일"
                        style={settings.pages.about.titleStyle}
                        onChange={(s) =>
                          updateNestedSetting("pages.about.titleStyle", s)
                        }
                      />
                      <StyleController
                        label="스토리 서사 스타일"
                        style={settings.pages.about.storyStyle}
                        onChange={(s) =>
                          updateNestedSetting("pages.about.storyStyle", s)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <AdminToggleControl
                        label="타이틀 노출"
                        checked={!!settings.pages.about.showTitle}
                        onCheckedChange={(val) =>
                          updateNestedSetting("pages.about.showTitle", val)
                        }
                      />
                      <AdminSliderControl
                        label="섹션 내부 여백"
                        value={settings.pages.about.sectionGap || 80}
                        min={0}
                        max={200}
                        unit="px"
                        onChange={(val) =>
                          updateNestedSetting("pages.about.sectionGap", val)
                        }
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        )}

        {/* 4. 네트워킹 탭 (TALK) */}
        {activeSubTab === "talk" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
            <AdminSection
              title="네트워킹 채널 (Talk)"
              description="방문자가 협업을 제안하는 창구와 소통 안내를 정밀하게 구성합니다."
              icon={<MessageSquare className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdminCard title="문의 헤더 및 안내">
                  <div className="space-y-6">
                    <AdminInputControl
                      label="문의 타이틀"
                      value={settings.pages.talk.title || "TALK"}
                      onChange={(val) =>
                        updateNestedSetting("pages.talk.title", val)
                      }
                    />
                    <AdminTextareaControl
                      label="문의 안내 설명글"
                      value={settings.pages.talk.description || ""}
                      onChange={(val) =>
                        updateNestedSetting("pages.talk.description", val)
                      }
                      rows={4}
                    />
                    <AdminInputControl
                      label="시스템 수신 이메일"
                      value={settings.pages.talk.email || ""}
                      onChange={(val) =>
                        updateNestedSetting("pages.talk.email", val)
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                </AdminCard>

                <AdminCard title="소통 채널 및 배치 제어">
                  <div className="space-y-8">
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                        콘텐츠 정렬 방식
                      </span>
                      <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/10 max-w-xs">
                        {["left", "center", "right"].map((a) => (
                          <button
                            key={a}
                            onClick={() =>
                              updateNestedSetting("pages.talk.alignment", a)
                            }
                            className={cn(
                              "flex-1 py-2 text-[10px] font-black uppercase transition-all",
                              settings.pages.talk.alignment === a
                                ? "bg-white text-black"
                                : "text-white/40",
                            )}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <StyleController
                        label="타이틀 스타일"
                        style={settings.pages.talk.titleStyle}
                        onChange={(s) =>
                          updateNestedSetting("pages.talk.titleStyle", s)
                        }
                      />
                      <StyleController
                        label="설명 스타일"
                        style={settings.pages.talk.descriptionStyle}
                        onChange={(s) =>
                          updateNestedSetting("pages.talk.descriptionStyle", s)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <AdminToggleControl
                        label="문의 가이드 노출"
                        checked={!!settings.pages.talk.showDescription}
                        onCheckedChange={(val) =>
                          updateNestedSetting("pages.talk.showDescription", val)
                        }
                      />
                      <AdminSliderControl
                        label="수직 오프셋"
                        value={settings.pages.talk.contentOffset || 0}
                        min={-100}
                        max={100}
                        unit="px"
                        onChange={(val) =>
                          updateNestedSetting("pages.talk.contentOffset", val)
                        }
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        )}

        {/* 5. 통합 조율 탭 (Philosophy / Contact / Footer) */}
        {activeSubTab === "extras" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
            <AdminSection
              title="통합 시스템 조율 (Global Extras)"
              description="철학적 앵커섹션부터 글로벌 푸터까지, 사이트 전역의 시스템 섹션을 관리합니다."
              icon={<Layers className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Philosophy */}
                <AdminCard title="철학 및 비전 (Philosophy)">
                  <div className="space-y-6">
                    {renderSectionHeader(
                      "landing.sections.philosophy",
                      Boolean(philosophy?.isVisible),
                      "철학 섹션",
                    )}
                    <AdminInputControl
                      label="메인 타이틀"
                      value={philosophy?.title || ""}
                      onChange={(val) =>
                        updateNestedSetting(
                          "landing.sections.philosophy.title",
                          val,
                        )
                      }
                    />
                    <AdminTextareaControl
                      label="심층 서사"
                      value={philosophy?.content || ""}
                      onChange={(val) =>
                        updateNestedSetting(
                          "landing.sections.philosophy.content",
                          val,
                        )
                      }
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <StyleController
                        label="제목 스타일"
                        style={philosophy?.titleStyle}
                        onChange={(s) =>
                          updateNestedSetting(
                            "landing.sections.philosophy.titleStyle",
                            s,
                          )
                        }
                      />
                      <StyleController
                        label="서사 스타일"
                        style={philosophy?.descriptionStyle}
                        onChange={(s) =>
                          updateNestedSetting(
                            "landing.sections.philosophy.descriptionStyle",
                            s,
                          )
                        }
                      />
                    </div>
                  </div>
                </AdminCard>

                {/* Contact Section */}
                <AdminCard title="랜딩 컨택트 (Common Contact)">
                  <div className="space-y-6">
                    {renderSectionHeader(
                      "landing.sections.contact",
                      Boolean(contact?.isVisible),
                      "컨택트 섹션",
                    )}
                    <AdminInputControl
                      label="문의 타이틀"
                      value={contact?.title || ""}
                      onChange={(val) =>
                        updateNestedSetting(
                          "landing.sections.contact.title",
                          val,
                        )
                      }
                    />
                    <AdminTextareaControl
                      label="간막이 설명글"
                      value={contact?.description || ""}
                      onChange={(val) =>
                        updateNestedSetting(
                          "landing.sections.contact.description",
                          val,
                        )
                      }
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <AdminSliderControl
                        label="투명도"
                        value={(contact?.opacity ?? 1) * 100}
                        min={0}
                        max={100}
                        unit="%"
                        onChange={(val) =>
                          updateNestedSetting(
                            "landing.sections.contact.opacity",
                            val / 100,
                          )
                        }
                      />
                      <AdminSliderControl
                        label="위치 보정 (Offset)"
                        value={contact?.contentOffset || 0}
                        min={-100}
                        max={100}
                        unit="px"
                        onChange={(val) =>
                          updateNestedSetting(
                            "landing.sections.contact.contentOffset",
                            val,
                          )
                        }
                      />
                    </div>
                  </div>
                </AdminCard>

                {/* Footer Section */}
                <AdminSection
                  title="시스템 푸터 (Footer)"
                  description="사이트 최하단 저작권 정보 및 여백을 제어합니다."
                  className="lg:col-span-2 pt-8"
                >
                  <AdminCard>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {renderSectionHeader(
                          "landing.sections.footer",
                          Boolean(footer?.isVisible),
                          "글로벌 푸터",
                        )}
                        <AdminInputControl
                          label="저작권 (Copyright)"
                          value={footer?.copyright || ""}
                          onChange={(val) =>
                            updateNestedSetting(
                              "landing.sections.footer.copyright",
                              val,
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <AdminSliderControl
                          label="상단 마진"
                          value={footer?.paddingTop || 0}
                          min={0}
                          max={150}
                          unit="px"
                          onChange={(val) =>
                            updateNestedSetting(
                              "landing.sections.footer.paddingTop",
                              val,
                            )
                          }
                        />
                        <AdminSliderControl
                          label="하단 마진"
                          value={footer?.paddingBottom || 0}
                          min={0}
                          max={150}
                          unit="px"
                          onChange={(val) =>
                            updateNestedSetting(
                              "landing.sections.footer.paddingBottom",
                              val,
                            )
                          }
                        />
                      </div>
                    </div>
                  </AdminCard>
                </AdminSection>
              </div>
            </AdminSection>
          </div>
        )}
      </div>
    </div>
  );
};
