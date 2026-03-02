/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Check, GripVertical, Trash2, Plus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ReactSortable } from "react-sortablejs";
import AdminToast from "@/components/shared/admin/AdminToast";
import { Button } from "@/components/ui/button";

interface SiteConfig {
  siteName: string;
  role: string;
  bio: string;
  slogan: string;
  connectors: {
    id: string;
    label: string;
    url: string;
  }[];
  vibePrompts: {
    id: string;
    input: string;
    output: string;
  }[];
  landingHero?: {
    title: string;
    subtitle: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string;
}

interface VibePromptCardProps {
  prompt: SiteConfig["vibePrompts"][0];
  index: number;
  onUpdate: (index: number, field: "input" | "output", value: string) => void;
  onRemove: (index: number) => void;
}

function VibePromptCard({
  prompt,
  index,
  onUpdate,
  onRemove,
}: Readonly<VibePromptCardProps>) {
  const inputId = `prompt-input-${prompt.id || index}`;
  const outputId = `prompt-output-${prompt.id || index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      className="p-6 bg-white/2 border border-white/5 group relative flex gap-4 items-start hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className="drag-handle pt-4 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors shrink-0">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 space-y-6">
        <button
          onClick={() => onRemove(index)}
          className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-all duration-200 active:scale-[0.98] opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
        >
          <Trash2 size={12} />
          Remove
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label
              htmlFor={inputId}
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              User Command (Input)
            </label>
            <input
              id={inputId}
              type="text"
              value={prompt.input}
              onChange={(e) => onUpdate(index, "input", e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 text-xs outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={outputId}
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              Engine Log (Output)
            </label>
            <textarea
              id={outputId}
              value={prompt.output}
              onChange={(e) => onUpdate(index, "output", e.target.value)}
              rows={2}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 text-xs outline-none resize-none focus:border-white/40 transition-colors font-mono tracking-tight"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ConnectorCardProps {
  connector: SiteConfig["connectors"][0];
  index: number;
  onUpdate: (index: number, field: "label" | "url", value: string) => void;
  onRemove: (index: number) => void;
}

function ConnectorCard({
  connector,
  index,
  onUpdate,
  onRemove,
}: Readonly<ConnectorCardProps>) {
  const labelId = `connector-label-${connector.id || index}`;
  const urlId = `connector-url-${connector.id || index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      className="p-6 bg-white/2 border border-white/5 group relative flex gap-4 items-start hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className="drag-handle pt-4 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors shrink-0">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 space-y-6">
        <button
          onClick={() => onRemove(index)}
          className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-all duration-200 active:scale-[0.98] opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
        >
          <Trash2 size={12} />
          Remove
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label
              htmlFor={labelId}
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              Label (e.g. GitHub, Email)
            </label>
            <input
              id={labelId}
              type="text"
              value={connector.label}
              onChange={(e) => onUpdate(index, "label", e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 text-xs outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={urlId}
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              URL or Link
            </label>
            <input
              id={urlId}
              type="text"
              value={connector.url}
              onChange={(e) => onUpdate(index, "url", e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 text-xs outline-none focus:border-white/40 transition-colors font-mono tracking-tight"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminConfigForm() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 3000);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/update?type=site-config");
      const result = await res.json();
      if (result.success) {
        const data = result.data;
        if (data.vibePrompts) {
          data.vibePrompts = data.vibePrompts.map((p: any) => ({
            ...p,
            id: p.id || `prompt-${Date.now()}-${Math.random()}`,
          }));
        }
        if (data.connectors) {
          data.connectors = data.connectors.map((c: any) => ({
            ...c,
            id: c.id || `conn-${Date.now()}-${Math.random()}`,
          }));
        } else if (data.socials) {
          data.connectors = [
            {
              id: `conn-${Date.now()}-1`,
              label: "GitHub",
              url: data.socials.github || "",
            },
            {
              id: `conn-${Date.now()}-2`,
              label: "Email",
              url: data.socials.email || "",
            },
          ];
        } else {
          data.connectors = [];
        }
        setConfig(data);
      }
    } catch (error) {
      console.error("Fetch site config error:", error);
      showToast("환경 설정을 불러오는데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = <T extends keyof SiteConfig>(
    field: T,
    value: SiteConfig[T],
  ) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
    if (isSaved) setIsSaved(false);
  };

  const handleConnectorUpdate = (
    index: number,
    field: "label" | "url",
    value: string,
  ) => {
    if (!config) return;
    const updated = [...config.connectors];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, connectors: updated });
    if (isSaved) setIsSaved(false);
  };

  const addConnector = () => {
    if (!config) return;
    const newConn = {
      id: `conn-${Date.now()}-${Math.random()}`,
      label: "New Link",
      url: "https://",
    };
    setConfig({
      ...config,
      connectors: [...(config.connectors || []), newConn],
    });
    if (isSaved) setIsSaved(false);
  };

  const removeConnector = (index: number) => {
    if (!config) return;
    const updated = config.connectors.filter((_, i) => i !== index);
    setConfig({ ...config, connectors: updated });
    if (isSaved) setIsSaved(false);
  };

  const handlePromptUpdate = (
    index: number,
    field: "input" | "output",
    value: string,
  ) => {
    if (!config) return;
    const updatedPrompts = [...config.vibePrompts];
    updatedPrompts[index] = { ...updatedPrompts[index], [field]: value };
    setConfig({ ...config, vibePrompts: updatedPrompts });
    if (isSaved) setIsSaved(false);
  };

  const addPrompt = () => {
    if (!config) return;
    const newPrompt = {
      id: `prompt-${Date.now()}-${Math.random()}`,
      input: "User Input...",
      output: "AI Response...",
    };
    setConfig({
      ...config,
      vibePrompts: [...config.vibePrompts, newPrompt],
    });
    if (isSaved) setIsSaved(false);
  };

  const removePrompt = (index: number) => {
    if (!config) return;
    const updatedPrompts = config.vibePrompts.filter((_, i) => i !== index);
    setConfig({ ...config, vibePrompts: updatedPrompts });
    if (isSaved) setIsSaved(false);
  };

  const saveAll = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      // Remove temporary runtime IDs if needed, although it's fine to save them
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "site-config", data: config }),
      });
      const result = await res.json();
      if (result.success) {
        setIsSaved(true);
        showToast("사이트 환경 설정이 성공적으로 업데이트되었습니다.");
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        showToast("저장 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Save config error:", error);
      showToast("서버 통신 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-[10px] uppercase tracking-widest opacity-30 flex items-center gap-4">
        <div className="w-3 h-3 border-t border-white rounded-full animate-spin" />
        Accessing configuration...
      </div>
    );
  if (!config) return <div>Config not found.</div>;

  const getButtonContent = () => {
    if (isSaving) return "Syncing...";
    if (isSaved)
      return (
        <>
          <Check className="w-3 h-3" /> Saved!
        </>
      );
    return "Update System";
  };

  return (
    <div className="w-full space-y-12">
      <AdminToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <div className="flex justify-between items-center bg-black/50 backdrop-blur-xl p-6 border border-white/10 sticky top-0 z-40">
        <h2 className="text-xl font-black uppercase tracking-tight">
          System Configuration
        </h2>
        <Button
          onClick={saveAll}
          disabled={isSaving}
          variant={isSaved ? "outline" : "default"}
          className={`text-[10px] font-black uppercase tracking-widest px-8 h-10 transition-all flex items-center gap-2
            ${
              isSaved
                ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 hover:text-green-300"
                : "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95"
            }`}
        >
          {isSaving && <RefreshCw className="w-3 h-3 animate-spin" />}
          {getButtonContent()}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 px-2 md:px-0 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label
              htmlFor="site-name"
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              Site Identity (Brand Name)
            </label>
            <input
              id="site-name"
              type="text"
              value={config.siteName}
              onChange={(e) => handleUpdate("siteName", e.target.value)}
              className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="site-role"
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              Professional Role
            </label>
            <input
              id="site-role"
              type="text"
              value={config.role}
              onChange={(e) => handleUpdate("role", e.target.value)}
              className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="site-slogan"
            className="text-[8px] font-black uppercase tracking-widest text-white/30"
          >
            Global Slogan
          </label>
          <input
            id="site-slogan"
            type="text"
            value={config.slogan}
            onChange={(e) => handleUpdate("slogan", e.target.value)}
            className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
          />
        </div>

        {/* Landing Page Hero Config */}
        <div className="pt-10 border-t border-white/5 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
            Landing Page Hero
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label
                htmlFor="landing-hero-title"
                className="text-[8px] font-black uppercase tracking-widest text-white/30"
              >
                Hero Title
              </label>
              <input
                id="landing-hero-title"
                type="text"
                value={config.landingHero?.title || ""}
                onChange={(e) => {
                  const currentHero = config.landingHero || {
                    title: "",
                    subtitle: "",
                  };
                  handleUpdate("landingHero", {
                    ...currentHero,
                    title: e.target.value,
                  });
                }}
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
                placeholder="Ex) Visual Alchemist"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="landing-hero-subtitle"
                className="text-[8px] font-black uppercase tracking-widest text-white/30"
              >
                Hero Subtitle
              </label>
              <input
                id="landing-hero-subtitle"
                type="text"
                value={config.landingHero?.subtitle || ""}
                onChange={(e) => {
                  const currentHero = config.landingHero || {
                    title: "",
                    subtitle: "",
                  };
                  handleUpdate("landingHero", {
                    ...currentHero,
                    subtitle: e.target.value,
                  });
                }}
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
                placeholder="Ex) Crafting digital emotions"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="site-bio"
            className="text-[8px] font-black uppercase tracking-widest text-white/30"
          >
            Primary Bio / Brand Ethos
          </label>
          <textarea
            id="site-bio"
            value={config.bio}
            onChange={(e) => handleUpdate("bio", e.target.value)}
            rows={4}
            className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none resize-none transition-colors"
          />
        </div>

        {/* SEO & Metadata Settings */}
        <div className="pt-10 border-t border-white/5 space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
            SEO & Social Metadata
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="meta-title"
                  className="text-[8px] font-black uppercase tracking-widest text-white/30"
                >
                  Meta Title
                </label>
                <input
                  id="meta-title"
                  type="text"
                  value={config.metaTitle || ""}
                  onChange={(e) => handleUpdate("metaTitle", e.target.value)}
                  className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
                  placeholder="Ex) SoDam | AI Creative Studio"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="meta-keywords"
                  className="text-[8px] font-black uppercase tracking-widest text-white/30"
                >
                  Keywords (콤마로 구분)
                </label>
                <input
                  id="meta-keywords"
                  type="text"
                  value={config.keywords || ""}
                  onChange={(e) => handleUpdate("keywords", e.target.value)}
                  className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
                  placeholder="Ex) AI, Design, Studio, Portfolio"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="meta-description"
                  className="text-[8px] font-black uppercase tracking-widest text-white/30"
                >
                  Meta Description
                </label>
                <textarea
                  id="meta-description"
                  value={config.metaDescription || ""}
                  onChange={(e) =>
                    handleUpdate("metaDescription", e.target.value)
                  }
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none resize-none transition-colors"
                  placeholder="짧고 명확한 사이트 설명을 입력하세요."
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="og-image"
                  className="text-[8px] font-black uppercase tracking-widest text-white/30"
                >
                  Open Graph Image URL (og:image)
                </label>
                <input
                  id="og-image"
                  type="text"
                  value={config.ogImage || ""}
                  onChange={(e) => handleUpdate("ogImage", e.target.value)}
                  className="w-full bg-black/40 border border-white/10 px-4 py-4 text-sm focus:border-white outline-none transition-colors"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* External Connectors */}
        <div className="pt-10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              External Connectors
            </h3>
            <Button
              onClick={addConnector}
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest border-white/20 px-4 h-9 hover:bg-white hover:text-black hover:border-white transition-all flex items-center gap-2"
            >
              <Plus size={12} />
              Add Connector
            </Button>
          </div>

          <ReactSortable
            list={config.connectors || []}
            setList={(newState) => handleUpdate("connectors", newState)}
            className="space-y-4"
            animation={200}
            handle=".drag-handle"
          >
            {config.connectors.map((connector, index) => (
              <ConnectorCard
                key={connector.id || `conn-${index}`}
                connector={connector}
                index={index}
                onUpdate={handleConnectorUpdate}
                onRemove={removeConnector}
              />
            ))}
          </ReactSortable>
        </div>

        {/* Vibe Prompts */}
        <div className="pt-10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              Vibe Persona Prompts
            </h3>
            <Button
              onClick={addPrompt}
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest border-white/20 px-4 h-9 hover:bg-white hover:text-black hover:border-white transition-all flex items-center gap-2"
            >
              <Plus size={12} />
              Add Prompt
            </Button>
          </div>

          <ReactSortable
            list={config.vibePrompts || []}
            setList={(newState) => handleUpdate("vibePrompts", newState)}
            className="space-y-4"
            animation={200}
            handle=".drag-handle"
          >
            {config.vibePrompts.map((prompt, index) => (
              <VibePromptCard
                key={prompt.id || `prompt-${index}`}
                prompt={prompt}
                index={index}
                onUpdate={handlePromptUpdate}
                onRemove={removePrompt}
              />
            ))}
          </ReactSortable>
        </div>
      </div>
    </div>
  );
}
