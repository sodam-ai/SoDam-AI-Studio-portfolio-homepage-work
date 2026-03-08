"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Layout, AlertTriangle, Layers } from "lucide-react";

import { AdminButton } from "@/components/shared/admin/AdminButton";
import { BrandingSettings } from "@/types/branding";

import { CoreSettings } from "./sections/CoreSettings";
import { TypographySettings } from "./sections/TypographySettings";
import { LayoutSettings } from "./sections/LayoutSettings";
import { LandingSectionsSettings } from "./sections/LandingSectionsSettings";
import { PageMasterSettings } from "./sections/PageMasterSettings";
import { AnimationSettings } from "./sections/AnimationSettings";
import { SecuritySettings } from "./sections/SecuritySettings";

interface AdminSettingsFormProps {
  onSave?: () => void;
  mode?: "home" | "global" | "all";
  activeTab?:
    | "core"
    | "typography"
    | "layout"
    | "pageMaster"
    | "sections"
    | "animations"
    | "security";
  showTabs?: boolean;
}

export function AdminSettingsForm({
  onSave,
  mode = "all",
  activeTab: initialTab,
  showTabs = true,
}: Readonly<AdminSettingsFormProps>) {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "core"
    | "typography"
    | "layout"
    | "pageMaster"
    | "sections"
    | "animations"
    | "security"
  >(initialTab || (mode === "home" ? "pageMaster" : "core"));

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, activeTab]);

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    verifyPassword: "",
  });
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({ isVisible: false, message: "", type: "success" });

  // Fetch and initialize settings with robust defaults
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/update?type=settings&t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Deep merge with defaults to prevent runtime crashes
          const rawData = result.data;

          // Ensure core structure exists with 100% fidelity to BrandingSettings type
          const safeData = {
            ...rawData,
            appearance: {
              accentColor: "#ffffff",
              backgroundColor: "#000000",
              surfaceColor: "#050505",
              textColor: "#ffffff",
              buttonStyle: "sharp" as const,
              cursorStyle: "minimal" as const,
              ...rawData.appearance,
              fonts: {
                header: "Inter",
                body: "Inter",
                accent: "Inter",
                ...rawData.appearance?.fonts,
              },
              fontSizes: {
                h1: 80,
                h2: 40,
                body: 16,
                small: 12,
                ...rawData.appearance?.fontSizes,
              },
              mobileFontSizes: {
                h1: 40,
                h2: 30,
                body: 14,
                small: 10,
                ...rawData.appearance?.mobileFontSizes,
              },
              layout: {
                sectionGap: 160,
                containerPadding: 24,
                lineHeight: 1.5,
                letterSpacing: 0,
                ...rawData.appearance?.layout,
              },
              animations: {
                enableHoverEffects: true,
                enablePageTransitions: true,
                enableScrollAnimations: true,
                intensity: "medium" as const,
                ...rawData.appearance?.animations,
              },
            },
            landing: {
              hero: {
                title: "AI IS THE NEW CREATIVE SYNTAX",
                subtitle: "Crafting digital experiences with AI",
                alignment: "center" as const,
                wordStyles: [],
                minHeight: "100vh",
                ...rawData.landing?.hero,
              },
              sections: {
                showcase: {
                  isVisible: true,
                  title: "SHOWCASE",
                  subtitle: "SELECTED PROJECTS",
                  ...rawData.landing?.sections?.showcase,
                },
                philosophy: {
                  isVisible: true,
                  title: "PHILOSOPHY",
                  content: "",
                  ...rawData.landing?.sections?.philosophy,
                },
                contact: {
                  isVisible: true,
                  title: "CONTACT",
                  ...rawData.landing?.sections?.contact,
                },
                footer: {
                  isVisible: true,
                  copyright: `© ${new Date().getFullYear()} PORTFOLIO`,
                  ...rawData.landing?.sections?.footer,
                },
                ...rawData.landing?.sections,
              },
              ...rawData.landing,
            },
            pages: {
              work: {
                title: "WORK",
                description: "Selected Projects",
                alignment: "center" as const,
                cardSize: "medium" as const,
                cardGap: 30,
                gridColumns: 3,
                showCategories: true,
                categories: [
                  "AI Image",
                  "AI Video",
                  "AI Code",
                  "Vibe Coding",
                  "AI Automation",
                  "Design",
                ],
                ...rawData.pages?.work,
              },
              about: {
                title: "ABOUT",
                description: "My Story",
                story: "",
                alignment: "center" as const,
                layoutType: "minimal" as const,
                imagePosition: "top" as const,
                ...rawData.pages?.about,
              },
              talk: {
                title: "TALK",
                description: "Let's Connect",
                alignment: "center" as const,
                email: "",
                socials: {
                  instagram: "",
                  linkedin: "",
                  github: "",
                },
                ...rawData.pages?.talk,
              },
              ...rawData.pages,
            },
          };

          setSettings(safeData as BrandingSettings);
        } else {
          setToast({
            isVisible: true,
            message:
              "FAILED TO LOAD SETTINGS: " + (result.error || "Unknown Error"),
            type: "error",
          });
        }
      } else {
        const text = await response.text();
        console.error("API Error Response:", text.substring(0, 100));
        setToast({
          isVisible: true,
          message: "FAILED TO LOAD SETTINGS (INVALID FORMAT)",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
      setToast({
        isVisible: true,
        message: "SYSTEM ERROR DURING INITIALIZATION",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

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

  // Safe nested state update logic
  const updateNestedSetting = (path: string, value: unknown) => {
    // Intelligent Guardrails
    if (path === "appearance.layout.lineHeight") {
      const numValue = Number.parseFloat(String(value));
      if (numValue > 5) {
        setToast({
          isVisible: true,
          message:
            "⚠️ HIGH LINE-HEIGHT DETECTED. SYSTEM STABILITY MAY BE AFFECTED.",
          type: "error",
        });
      }
    }

    setSettings((prev: BrandingSettings | null) => {
      if (!prev) return prev;

      const newSettings = structuredClone(prev); // Deep clone using modern API
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (
          !(key in current) ||
          current[key] === null ||
          typeof current[key] !== "object"
        ) {
          current[key] = {};
        }
        current = current[key];
      }

      current[keys.at(-1)!] = value;
      return newSettings;
    });
  };

  const renderTabContent = () => {
    if (!settings) return null;

    switch (activeTab) {
      case "core":
        return (
          <CoreSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        );
      case "typography":
        return (
          <TypographySettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        );
      case "layout":
        return (
          <LayoutSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        );
      case "pageMaster":
        return (
          <PageMasterSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        );
      case "sections":
        return (
          <LandingSectionsSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        );
      case "animations":
        return (
          <AnimationSettings
            settings={settings}
            updateNestedSetting={updateNestedSetting}
          />
        );
      case "security":
        return (
          <SecuritySettings
            securityData={securityData}
            setSecurityData={setSecurityData}
            handleSecurityUpdate={handleSecurityUpdate}
            isUpdatingSecurity={isUpdatingSecurity}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border border-white/5 border-t-white animate-spin" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border border-white/5 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-black">
            DATABASE SYNCING
          </p>
          <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 italic">
            디자인 시스템 무결성 확인 중...
          </p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  const allTabs = [
    {
      id: "core",
      icon: Palette,
      label: "[브랜드 정체성] BRAND IDENTITY",
      group: "global",
    },
    {
      id: "typography",
      icon: Layers,
      label: "[타이포그래피] TYPOGRAPHY",
      group: "global",
    },
    {
      id: "layout",
      icon: Layout,
      label: "[공간 엔진] SPATIAL ENGINE",
      group: "global",
    },
    {
      id: "pageMaster",
      icon: Layers,
      label: "[페이지 마스터] PAGE MASTER",
      group: "home",
    },
    {
      id: "sections",
      icon: Layers,
      label: "[랜딩 섹션] LANDING SECTIONS",
      group: "home",
    },
    {
      id: "animations",
      icon: Layers,
      label: "[애니메이션] ANIMATIONS",
      group: "global",
    },
    {
      id: "security",
      icon: AlertTriangle,
      label: "[시스템 보안] SYSTEM SECURITY",
      group: "global",
    },
  ] as const;

  const tabs = allTabs.filter((t) => mode === "all" || t.group === mode);

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
      <AnimatePresence>
        {toast.isVisible && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 p-4 glass-effect border pointer-events-auto ${
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
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              시스템 비주얼 마스터
            </h1>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">
            핵심 심미성 및 브랜드 정체성 총괄 제어
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <AdminButton
            variant="outline"
            onClick={fetchSettings}
            className="flex-1 md:flex-none"
          >
            설정 초기화
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={saveSettings}
            isLoading={isSaving}
            className="min-w-45 shadow-2xl shadow-white/10"
          >
            {isSaving ? "동기화 중..." : "시스템 변경사항 적용"}
          </AdminButton>
        </div>
      </div>

      {/* Tabs */}
      {showTabs && (
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
      )}

      {/* Content Area */}
      <div className="min-h-150 relative bg-black/40 rounded-xl overflow-hidden shadow-inner border border-white/5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Save (Optional/Mobile) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <AdminButton
            variant="secondary"
            size="lg"
            onClick={saveSettings}
            isLoading={isSaving}
            className="rounded-full px-12 border-2 border-white/20 backdrop-blur-xl shadow-2xl"
          >
            즉시 적용 (Quick Deploy)
          </AdminButton>
        </div>
      </motion.div>
    </div>
  );
}
