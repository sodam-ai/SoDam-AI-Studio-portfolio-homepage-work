import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Layout,
  Type,
  Palette,
  Settings2,
  Image as ImageIcon,
  Monitor,
  Phone,
  Tablet,
  MousePointer2,
  Sparkles,
  Command,
  Plus,
  Trash2,
  Eye,
  ChevronRight,
  Shield,
  History,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AdminToast from "@/components/shared/admin/AdminToast";

interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
  buttonStyle: "sharp" | "rounded" | "glass";
  cursorStyle: "minimal" | "dynamic" | "classic";
}

interface AdminSettingsFormProps {
  onSave?: () => void;
}

export function AdminSettingsForm({ onSave }: AdminSettingsFormProps) {
  const [settings, setSettings] = useState<BrandingSettings>({
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#3b82f6",
    backgroundColor: "#000000",
    surfaceColor: "#0a0a0a",
    textColor: "#ffffff",
    fontFamily: "Inter, sans-serif",
    headingFont: "Inter, sans-serif",
    borderRadius: "0px",
    buttonStyle: "sharp",
    cursorStyle: "dynamic",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("core");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (key: keyof BrandingSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (data.success) {
        setIsSaved(true);
        if (onSave) onSave();
        setToast({
          isVisible: true,
          message: "Settings saved successfully",
          type: "success",
        });
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      setToast({
        isVisible: true,
        message: "Failed to save settings",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "core", label: "Core", icon: Settings2 },
    { id: "visual", label: "Visual", icon: Palette },
    { id: "typography", label: "Type", icon: Type },
    { id: "advanced", label: "System", icon: Layout },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <AdminToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <div className="sticky top-0 z-100 flex items-center justify-between bg-black/50 p-8 border-b border-white/10 backdrop-blur-xl -mx-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Branding & System
          </h2>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
            Identity Management & CSS Architecture
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={fetchSettings}
            variant="outline"
            size="sm"
            className="border-white/5 hover:bg-white/5 text-[10px] uppercase font-black tracking-widest px-6 h-10 rounded-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Reset Changes
          </Button>
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className={`font-black text-[10px] tracking-widest px-8 h-10 transition-all rounded-xs ${
              isSaved
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {isSaving
              ? "SYNCING..."
              : isSaved
                ? "SYNCHRONIZED"
                : "DEPLOY SETTINGS"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 transition-all group border ${
                activeTab === tab.id
                  ? "bg-white/5 border-white/10 text-white translate-x-1"
                  : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <tab.icon
                  className={`w-4 h-4 transition-colors ${activeTab === tab.id ? "text-white" : "text-white/20 group-hover:text-white/40"}`}
                />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {tab.label}
                </span>
              </div>
              {activeTab === tab.id && (
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-16"
            >
              {activeTab === "core" && (
                <section className="space-y-12">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      Identity Foundation
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                      System-wide core colors and foundational identity tokens
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">
                        <span>Primary Color</span>
                        <span className="font-mono">
                          {settings.primaryColor}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleUpdate("primaryColor", e.target.value)
                          }
                          className="w-12 h-12 bg-transparent border border-white/10 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleUpdate("primaryColor", e.target.value)
                          }
                          className="flex-1 bg-black/40 border border-white/10 px-4 py-2 text-xs font-mono outline-none focus:border-white transition-colors"
                        />
                      </div>
                    </div>
                    {/* Add other core settings similarly */}
                  </div>
                </section>
              )}

              {/* Add other tab contents similarly */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
