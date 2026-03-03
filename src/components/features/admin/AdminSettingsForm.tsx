"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Type,
  Palette,
  Home,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { AdminInput } from "@/components/shared/admin/AdminInput";
import { AdminButton } from "@/components/shared/admin/AdminButton";
import { BrandingSettings } from "@/types/branding";
import {
  AdminSection,
  AdminCard,
} from "@/components/shared/admin/AdminSection";

interface AdminSettingsFormProps {
  onSave?: () => void;
}

const NumericControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "PX",
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) => (
  <div className="space-y-4 py-5 border-b border-white/5 last:border-0 hover:bg-white/2 -mx-4 px-4 transition-colors">
    <div className="flex justify-between items-end">
      <div className="space-y-1">
        <label
          htmlFor={`numeric-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
          className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`numeric-${label.replaceAll(/\s+/g, "-").toLowerCase()}`}
            type="number"
            value={value}
            step={step}
            onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
            className="bg-white/5 border border-white/10 text-xs font-mono text-white px-2 py-1 focus:border-white/40 transition-colors outline-none w-20"
          />
          <span className="text-[10px] font-mono text-white/40 uppercase">
            {suffix}
          </span>
        </div>
      </div>
      <div className="text-[10px] font-mono text-white/20 select-none">
        {min} - {max} RANGE
      </div>
    </div>
    <div className="flex gap-4 items-center pl-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-white/80 transition-all"
      />
    </div>
  </div>
);

const FontSelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const fonts = [
    "Inter",
    "Outfit",
    "Space Grotesk",
    "Bebas Neue",
    "Roboto Mono",
    "Playfair Display",
    "Syne",
  ];
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {fonts.map((font) => (
          <button
            key={font}
            onClick={() => onChange(font)}
            className={`px-3 py-2 text-[10px] text-left border rounded-xs transition-all duration-200 active:scale-[0.98] ${
              value === font
                ? "bg-white text-black border-white font-bold"
                : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
            }`}
            style={{ fontFamily: font }}
          >
            {font}
          </button>
        ))}
      </div>
    </div>
  );
};

export function AdminSettingsForm({
  onSave,
}: Readonly<AdminSettingsFormProps>) {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "core" | "typography" | "layout" | "landing" | "pages" | "security"
  >("core");
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({ isVisible: false, message: "", type: "success" });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    verifyPassword: "",
  });
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/update?type=settings");
      const contentType = response.headers.get("content-type");

      if (response.ok && contentType?.includes("application/json")) {
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          // Ensure fonts object exists even if missing in stored data
          if (!data.appearance.fonts) {
            data.appearance.fonts = {
              fontFamily: "Inter",
              headingFont: "Inter",
              titleFont: "Inter",
              descriptionFont: "Inter",
            };
          }
          // Initialize categories if missing
          if (!data.pages.work.categories) {
            data.pages.work.categories = [
              "AI Image",
              "AI Video",
              "AI Code",
              "Vibe Coding",
              "AI Automation",
              "Design",
            ];
          }
          setSettings(data);
        } else {
          setToast({
            isVisible: true,
            message:
              "설정 데이터를 불러오는데 실패했습니다: " +
              (result.error || "Unknown Error"),
            type: "error",
          });
        }
      } else {
        const text = await response.text();
        console.error("API Error Response:", text.substring(0, 100));
        setToast({
          isVisible: true,
          message: "설정 데이터를 불러오는데 실패했습니다 (JSON 형식이 아님)",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
      setToast({
        isVisible: true,
        message: "설정 데이터를 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "settings", data: settings }),
      });

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType?.includes("application/json")) {
        const result = await response.json();
        if (result.success) {
          setToast({
            isVisible: true,
            message: "SYSTEM DEPLOYED SUCCESSFULLY",
            type: "success",
          });
          if (onSave) onSave();
        } else {
          setToast({
            isVisible: true,
            message: "저장 실패: " + result.error,
            type: "error",
          });
        }
      } else {
        setToast({
          isVisible: true,
          message: "서버 오류: 올바르지 않은 응답 형식",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Save settings error:", error);
      setToast({
        isVisible: true,
        message: "저장 중 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecurityUpdate = async () => {
    if (securityData.newPassword !== securityData.verifyPassword) {
      setToast({
        isVisible: true,
        message: "NEW PASSWORDS DO NOT MATCH",
        type: "error",
      });
      return;
    }

    if (securityData.newPassword.length < 4) {
      setToast({
        isVisible: true,
        message: "NEW KEY MUST BE AT LEAST 4 CHARACTERS",
        type: "error",
      });
      return;
    }

    setIsUpdatingSecurity(true);
    try {
      const response = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
          mode: "change",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setToast({
          isVisible: true,
          message: "SYSTEM KEY UPDATED SUCCESSFULLY",
          type: "success",
        });
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          verifyPassword: "",
        });
      } else {
        throw new Error(result.error || "Failed to update security settings");
      }
    } catch (error) {
      console.error("Security update error:", error);
      setToast({
        isVisible: true,
        message:
          error instanceof Error ? error.message : "Failed to update security",
        type: "error",
      });
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const updateNestedSetting = (
    path: string,
    value: string | number | string[],
  ) => {
    // 지능형 가드레일: 극단적인 수치 감지 및 경고 로직
    if (path === "appearance.layout.lineHeight") {
      const numValue = Number.parseFloat(String(value));
      if (numValue > 5) {
        setToast({
          isVisible: true,
          message:
            "⚠️ HIGH LINE-HEIGHT DETECTED. ADMIN UI IS PROTECTED, BUT PUBLIC SITE MAY BE UNSTABLE.",
          type: "error",
        });
      }
    }
    if (path === "appearance.layout.sectionGap") {
      const numValue = Number.parseInt(String(value));
      if (numValue > 1000) {
        setToast({
          isVisible: true,
          message: "⚠️ EXTREME SECTION GAP. UI RENDERING MIGHT BE AFFECTED.",
          type: "error",
        });
      }
    }

    setSettings((prev: BrandingSettings | null) => {
      if (!prev) return null;
      const newSettings = { ...prev };
      const parts = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newSettings;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        current[p] = Array.isArray(current[p])
          ? [...current[p]]
          : { ...current[p] };
        current = current[p];
      }
      current[parts.at(-1)!] = value;
      return newSettings;
    });
  };

  const renderTabContent = () => {
    if (!settings) return null;

    switch (activeTab) {
      case "core":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdminSection
              title="Brand Identity"
              description="Master palette and fundamental aesthetics"
              icon={<Palette className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminCard>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4 border-b border-white/5 pb-2">
                      Chromatic Core
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <AdminInput
                        id="accentColor"
                        label="Primary Accent"
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
                        label="Environment Background"
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
                      Surface & Type
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <AdminInput
                        id="surfaceColor"
                        label="Component Surface"
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
                        label="Typography Core"
                        type="color"
                        value={settings.appearance.textColor}
                        onChange={(e) =>
                          updateNestedSetting(
                            "appearance.textColor",
                            e.target.value,
                          )
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>

            <AdminSection
              title="Interactive DNA"
              description="Configure button behavior and navigation feedback"
              icon={<Layout className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminCard>
                  <div className="space-y-4">
                    <label
                      htmlFor="buttonStyle"
                      className="text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      Button Geometry
                    </label>
                    <div
                      id="buttonStyle"
                      className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-sm"
                    >
                      {(["sharp", "rounded", "glass"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() =>
                            updateNestedSetting("appearance.buttonStyle", style)
                          }
                          className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter transition-all ${
                            settings.appearance.buttonStyle === style
                              ? "bg-white text-black shadow-lg"
                              : "text-white/40 hover:bg-white/5"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </AdminCard>

                <AdminCard>
                  <div className="space-y-4">
                    <label
                      htmlFor="cursorStyle"
                      className="text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      Interaction System
                    </label>
                    <div
                      id="cursorStyle"
                      className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-sm"
                    >
                      {(["minimal", "dynamic", "classic"] as const).map(
                        (style) => (
                          <button
                            key={style}
                            onClick={() =>
                              updateNestedSetting(
                                "appearance.cursorStyle",
                                style,
                              )
                            }
                            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter transition-all ${
                              settings.appearance.cursorStyle === style
                                ? "bg-white text-black shadow-lg"
                                : "text-white/40 hover:bg-white/5"
                            }`}
                          >
                            {style}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        );

      case "typography":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdminSection
              title="Visual Scaling"
              description="Precise typography control across all viewports"
              icon={<Type className="w-4 h-4" />}
            >
              <AdminCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                  <NumericControl
                    label="Hero Title (Desktop)"
                    value={settings.appearance.fontSizes.heroTitle}
                    min={1}
                    max={2000}
                    onChange={(val: number) =>
                      updateNestedSetting("appearance.fontSizes.heroTitle", val)
                    }
                  />
                  <NumericControl
                    label="Hero Title (Mobile)"
                    value={settings.appearance.mobileFontSizes.heroTitle}
                    min={1}
                    max={2000}
                    onChange={(val: number) =>
                      updateNestedSetting(
                        "appearance.mobileFontSizes.heroTitle",
                        val,
                      )
                    }
                  />
                  <NumericControl
                    label="Hero Subtitle"
                    value={settings.appearance.fontSizes.heroSubtitle}
                    min={1}
                    max={2000}
                    onChange={(val: number) =>
                      updateNestedSetting(
                        "appearance.fontSizes.heroSubtitle",
                        val,
                      )
                    }
                  />
                  <NumericControl
                    label="Section Titles"
                    value={settings.appearance.fontSizes.sectionTitle}
                    min={1}
                    max={2000}
                    onChange={(val: number) =>
                      updateNestedSetting(
                        "appearance.fontSizes.sectionTitle",
                        val,
                      )
                    }
                  />
                  <NumericControl
                    label="Body Text"
                    value={settings.appearance.fontSizes.bodyText}
                    min={1}
                    max={1000}
                    onChange={(val: number) =>
                      updateNestedSetting("appearance.fontSizes.bodyText", val)
                    }
                  />
                  <NumericControl
                    label="Card Category"
                    value={settings.appearance.fontSizes.cardCategory}
                    min={1}
                    max={1000}
                    onChange={(val: number) =>
                      updateNestedSetting(
                        "appearance.fontSizes.cardCategory",
                        val,
                      )
                    }
                  />
                </div>
              </AdminCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <AdminCard>
                  <FontSelector
                    label="Heading Architecture"
                    value={settings.appearance.fonts?.headingFont || "Inter"}
                    onChange={(val: string) =>
                      updateNestedSetting("appearance.fonts.headingFont", val)
                    }
                  />
                </AdminCard>
                <AdminCard>
                  <FontSelector
                    label="Narrative Font (Body)"
                    value={settings.appearance.fonts?.fontFamily || "Inter"}
                    onChange={(val: string) =>
                      updateNestedSetting("appearance.fonts.fontFamily", val)
                    }
                  />
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        );

      case "layout":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdminSection
              title="Spatial Rhythm"
              description="Composition and structural breathing room"
              icon={<Layout className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminCard>
                  <NumericControl
                    label="Atmospheric Gap (Section)"
                    value={settings.appearance.layout.sectionGap}
                    min={0}
                    max={2000}
                    step={10}
                    onChange={(val: number) =>
                      updateNestedSetting("appearance.layout.sectionGap", val)
                    }
                  />
                </AdminCard>

                <AdminCard>
                  <NumericControl
                    label="Vertical Rhythm (Line Height)"
                    value={Number.parseFloat(
                      settings.appearance.layout.lineHeight.toString(),
                    )}
                    min={0.1}
                    max={10}
                    step={0.1}
                    suffix="LH"
                    onChange={(val: number) =>
                      updateNestedSetting("appearance.layout.lineHeight", val)
                    }
                  />
                </AdminCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <AdminCard>
                  <NumericControl
                    label="Typographic Density (Letter Spacing)"
                    value={Number.parseFloat(
                      settings.appearance.layout.letterSpacing.replace(
                        "em",
                        "",
                      ),
                    )}
                    min={-0.5}
                    max={2}
                    step={0.01}
                    suffix="EM"
                    onChange={(val: number) =>
                      updateNestedSetting(
                        "appearance.layout.letterSpacing",
                        `${val}em`,
                      )
                    }
                  />
                </AdminCard>

                <AdminCard>
                  <div className="space-y-4">
                    <label
                      htmlFor="textAlign"
                      className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                    >
                      Canvas Alignment
                    </label>
                    <div
                      id="textAlign"
                      className="flex gap-1 p-1 bg-white/2 border border-white/5 rounded-sm"
                    >
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() =>
                            updateNestedSetting(
                              "appearance.layout.textAlign",
                              align,
                            )
                          }
                          className={`flex-1 py-3 text-[10px] uppercase font-black tracking-widest transition-all duration-300 ${
                            settings.appearance.layout.textAlign === align
                              ? "bg-white text-black shadow-lg"
                              : "bg-transparent text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        );

      case "landing":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdminSection
              title="Hero Canvas"
              description="Primary copy and visual anchors for the landing experience"
              icon={<Home className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminCard>
                  <AdminInput
                    id="heroTitle"
                    label="Main Title"
                    value={settings.landing.hero.title}
                    onChange={(e) =>
                      updateNestedSetting("landing.hero.title", e.target.value)
                    }
                  />
                </AdminCard>
                <AdminCard>
                  <div className="space-y-4">
                    <label
                      htmlFor="wordStyles"
                      className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                    >
                      Word Styles (CSV)
                    </label>
                    <textarea
                      id="wordStyles"
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs font-mono text-white/70 focus:border-white/40 transition-colors outline-none h-24 rounded-sm"
                      placeholder="italic, bold, underline..."
                      value={settings.landing.hero.wordStyles.join(", ")}
                      onChange={(e) =>
                        updateNestedSetting(
                          "landing.hero.wordStyles",
                          e.target.value.split(",").map((s) => s.trim()),
                        )
                      }
                    />
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          </div>
        );

      case "pages":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* WORK PAGE CONFIG */}
            <AdminSection
              title="Work Gallery"
              description="Grid orchestration and presentation logic for projects"
              icon={<FileText className="w-4 h-4" />}
            >
              <div className="space-y-6">
                <AdminCard>
                  <div className="space-y-4">
                    <label
                      htmlFor="workDescription"
                      className="text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      Hero Narrative
                    </label>
                    <textarea
                      id="workDescription"
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white/70 focus:border-white/40 transition-colors outline-none h-24 rounded-sm"
                      value={settings.pages.work.description}
                      onChange={(e) =>
                        updateNestedSetting(
                          "pages.work.description",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </AdminCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminCard>
                    <NumericControl
                      label="Card Spacing"
                      value={settings.pages.work.cardGap}
                      min={0}
                      max={2000}
                      onChange={(val: number) =>
                        updateNestedSetting("pages.work.cardGap", val)
                      }
                    />
                  </AdminCard>

                  <AdminCard>
                    <div className="space-y-4">
                      <label
                        htmlFor="gridColumns"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                      >
                        Grid Architecture
                      </label>
                      <div
                        id="gridColumns"
                        className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map((cols) => (
                          <button
                            key={cols}
                            type="button"
                            onClick={() =>
                              updateNestedSetting(
                                "pages.work.gridColumns",
                                cols,
                              )
                            }
                            className={`flex-1 py-2 text-[10px] font-black transition-all ${
                              settings.pages.work.gridColumns === cols
                                ? "bg-white text-black shadow-lg"
                                : "text-white/40 hover:bg-white/5"
                            }`}
                          >
                            {cols}
                          </button>
                        ))}
                      </div>
                    </div>
                  </AdminCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <AdminCard>
                    <div className="space-y-4">
                      <label
                        htmlFor="workAlignment"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                      >
                        Content Alignment
                      </label>
                      <div
                        id="workAlignment"
                        className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-sm"
                      >
                        {(["left", "center", "right"] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() =>
                              updateNestedSetting("pages.work.alignment", align)
                            }
                            className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 active:scale-[0.98] ${
                              settings.pages.work.alignment === align
                                ? "bg-white text-black shadow-lg"
                                : "text-white/40 hover:bg-white/5"
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </AdminCard>
                  <AdminCard>
                    <div className="space-y-4">
                      <label
                        htmlFor="cardDesign"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                      >
                        Card Aesthetic
                      </label>
                      <div
                        id="cardDesign"
                        className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-sm"
                      >
                        {(["minimal", "bold", "glass"] as const).map(
                          (style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() =>
                                updateNestedSetting(
                                  "pages.work.cardDesign",
                                  style,
                                )
                              }
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 active:scale-[0.98] ${
                                settings.pages.work.cardDesign === style
                                  ? "bg-white text-black shadow-lg"
                                  : "text-white/40 hover:bg-white/5"
                              }`}
                            >
                              {style}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </AdminCard>
                </div>
              </div>
            </AdminSection>

            {/* ABOUT PAGE CONFIG */}
            <AdminSection
              title="About Narrative"
              description="Personal story architecture and layout strategy"
              icon={<FileText className="w-4 h-4" />}
            >
              <div className="space-y-6">
                <AdminCard>
                  <div className="space-y-4">
                    <label
                      htmlFor="aboutDescription"
                      className="text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      Mission Statement
                    </label>
                    <textarea
                      id="aboutDescription"
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs text-white/70 focus:border-white/40 transition-colors outline-none h-32 rounded-sm"
                      value={settings.pages.about.description}
                      onChange={(e) =>
                        updateNestedSetting(
                          "pages.about.description",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </AdminCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminCard>
                    <div className="space-y-4">
                      <label
                        htmlFor="layoutStrategy"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                      >
                        Layout Strategy
                      </label>
                      <div
                        id="layoutStrategy"
                        className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-sm"
                      >
                        {(["split", "full", "minimal"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() =>
                              updateNestedSetting(
                                "pages.about.layoutType",
                                type,
                              )
                            }
                            className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 active:scale-[0.98] ${
                              settings.pages.about.layoutType === type
                                ? "bg-white text-black shadow-lg"
                                : "text-white/40 hover:bg-white/5"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </AdminCard>

                  <AdminCard>
                    <div className="space-y-4">
                      <label
                        htmlFor="visualFocus"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 block"
                      >
                        Visual Focus
                      </label>
                      <div
                        id="visualFocus"
                        className="flex gap-1 bg-white/5 p-1 border border-white/5 rounded-sm"
                      >
                        {(["left", "right", "top"] as const).map((pos) => (
                          <button
                            key={pos}
                            onClick={() =>
                              updateNestedSetting(
                                "pages.about.imagePosition",
                                pos,
                              )
                            }
                            className={`flex-1 py-2 text-[10px] font-black uppercase transition-all duration-200 active:scale-[0.98] ${
                              settings.pages.about.imagePosition === pos
                                ? "bg-white text-black shadow-lg"
                                : "text-white/40 hover:bg-white/5"
                            }`}
                          >
                            {pos}
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

      case "security":
        return renderSecurityTab();

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
        <p className="text-[10px] uppercase tracking-widest text-white/40 animate-pulse font-black">
          Initializing Design System...
        </p>
      </div>
    );
  }

  if (!settings) return null;

  const tabs = [
    { id: "core", icon: Palette, label: "Core" },
    { id: "typography", icon: Type, label: "Typography" },
    { id: "layout", icon: Layout, label: "Layout" },
    { id: "landing", icon: Home, label: "Landing" },
    { id: "pages", icon: FileText, label: "Pages" },
    { id: "security", icon: AlertTriangle, label: "Security" },
  ] as const;

  const renderSecurityTab = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminSection
        title="Access Control"
        description="Gatekeeper settings and password management"
        icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
      >
        <div className="max-w-md mx-auto">
          <AdminCard>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Update Admin Password
                </h3>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
                  Ensure your system is locked with a high-entropy string.
                </p>
              </div>
              <div className="space-y-4">
                <AdminInput
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={(e) =>
                    setSecurityData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <AdminInput
                  label="New System Key"
                  type="password"
                  placeholder="NEW KEY"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <AdminInput
                  label="Verify Key"
                  type="password"
                  placeholder="RE-ENTER"
                  value={securityData.verifyPassword}
                  onChange={(e) =>
                    setSecurityData((prev) => ({
                      ...prev,
                      verifyPassword: e.target.value,
                    }))
                  }
                />
                <AdminButton
                  variant="primary"
                  className="w-full py-4 text-[10px] tracking-[0.2em]"
                  onClick={handleSecurityUpdate}
                  isLoading={isUpdatingSecurity}
                >
                  RESTRICT ACCESS
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );

  // 관리자 페이지 스타일 격리: root의 CSS 변수 영향을 받지 않도록 인라인 스타일 강제
  const adminIsolationStyle: React.CSSProperties = {
    lineHeight: "1.5",
    letterSpacing: "normal",
    textAlign: "left",
    fontSize: "16px",
    textTransform: "none",
    "--line-height": "1.5",
    "--letter-spacing": "normal",
    "--section-gap": "0px",
    "--text-align": "left",
  } as React.CSSProperties;

  return (
    <div
      style={adminIsolationStyle}
      className="space-y-8 pb-20 max-w-5xl mx-auto admin-isolation"
    >
      {toast.isVisible && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-100 w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-center gap-3 p-4 glass-effect border ${
              toast.type === "success"
                ? "border-green-500/30 text-green-400"
                : "border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ ...toast, isVisible: false })}
              className="ml-auto text-white/40 hover:text-white transition-all duration-200 active:scale-[0.98]"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Branding Engine
            </h1>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">
            Core Aesthetic & Identity Orchestrator
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <AdminButton
            variant="outline"
            onClick={fetchSettings}
            className="flex-1 md:flex-none"
          >
            RESET
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={saveSettings}
            isLoading={isSaving}
            className="min-w-45 shadow-2xl shadow-white/10"
          >
            {isSaving ? "SYNCING..." : "DEPLOY SYSTEM"}
          </AdminButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-4 z-50 flex gap-1 bg-black/80 backdrop-blur-xl p-1.5 rounded-md border border-white/10 shadow-3xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 active:scale-[0.98] relative overflow-hidden ${
              activeTab === tab.id
                ? "text-black"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon
                className={`h-3.5 w-3.5 ${activeTab === tab.id ? "stroke-[3px]" : ""}`}
              />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-125 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20, filter: "blur(20px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(20px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Save (Optional/Mobile) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100"
      >
        <AdminButton
          variant="secondary"
          size="lg"
          onClick={saveSettings}
          isLoading={isSaving}
          className="rounded-full px-12 border-2 border-white/20 backdrop-blur-xl"
        >
          QUICK DEPLOY
        </AdminButton>
      </motion.div>
    </div>
  );
}
