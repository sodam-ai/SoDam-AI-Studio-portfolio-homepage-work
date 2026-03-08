"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Share2,
  FolderTree,
  Plus,
  Trash2,
  GripVertical,
  RefreshCw,
  Search,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";
import { ReactSortable } from "react-sortablejs";
import AdminToast from "@/components/shared/admin/AdminToast";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/shared/admin/AdminSection";
import { MediaUploadInput } from "@/components/features/admin/MediaUploadInput";
import { SiteConfig } from "@/types/config";
import { ConnectorCard } from "./ConnectorCard";

interface AdminConfigFormProps {
  section?: "global" | "metadata" | "connectors" | "taxonomy" | "all";
  showTabs?: boolean;
}

export function AdminConfigForm({
  section = "all",
  showTabs = true,
}: Readonly<AdminConfigFormProps>) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [activeTab, setActiveTab] = useState<string>(
    section === "all" ? "global" : section,
  );

  useEffect(() => {
    if (section && section !== "all" && activeTab !== section) {
      setActiveTab(section);
    }
  }, [section, activeTab]);

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
  };

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/update?type=site-config&t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );
      const result = await res.json();
      if (result.success) {
        setConfig(result.data);
      }
    } catch (error) {
      console.error("Fetch site config error:", error);
      showToast("환경 설정을 불러오는데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (section && section !== "all") {
      setActiveTab(section);
    }
  }, [section]);

  const saveAll = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "site-config", data: config }),
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus("success");
        showToast("설정이 성공적으로 저장되었습니다.");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        showToast("저장 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Save config error:", error);
      showToast("서버 통신 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setConfig({ ...config, logoUrl: result.url });
        showToast("이미지가 업로드되었습니다.");
      } else {
        showToast("업로드 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("이미지 업로드 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-8 opacity-50">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          환경 설정 로딩 중...
        </span>
      </div>
    );
  }

  if (!config)
    return (
      <div className="p-8 text-center text-muted-foreground">
        설정 데이터를 찾을 수 없습니다.
      </div>
    );

  const tabItems = [
    {
      id: "global",
      label: "기본 브랜딩",
      description: "사이트명, 로고, 직함 등 기본 정체성 설정",
      icon: <Globe className="w-5 h-5" />,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "metadata",
      label: "검색 및 SEO",
      description: "검색 엔진 노출 및 SNS 공유 최적화 설정",
      icon: <Search className="w-5 h-5" />,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "connectors",
      label: "소셜 연동",
      description: "외부 계정 및 소셜 미디어 연결 관리",
      icon: <Share2 className="w-5 h-5" />,
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      id: "taxonomy",
      label: "분류 체계",
      description: "프로젝트 카테고리 및 필터링 시스템 관리",
      icon: <FolderTree className="w-5 h-5" />,
      color: "from-emerald-500/20 to-teal-500/20",
    },
  ];

  const getButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> 저장 중...
        </>
      );
    }
    if (saveStatus === "success") return "저장 완료";
    if (saveStatus === "error") return "저장 실패";
    return "모두 저장";
  };

  const getButtonStyles = () => {
    if (saveStatus === "success") return "bg-green-500 text-white";
    if (saveStatus === "error") return "bg-red-500 text-white";
    return "bg-white text-black hover:bg-white/90";
  };

  return (
    <div className="w-full space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* 상단 통합 제어 바 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-neutral-900/80 backdrop-blur-2xl p-6 border border-white/10 sticky -top-8 z-50 rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-black tracking-tighter text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-400" />
            시스템 통합 제어 센터
          </h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
            사이트의 글로벌 환경 설정을 실시간으로 관리합니다
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5 mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-white/40 uppercase">
              시스템 온라인
            </span>
          </div>
          <Button
            onClick={saveAll}
            disabled={isSaving}
            className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-[0.98] ${getButtonStyles()}`}
          >
            {getButtonContent()}
          </Button>
        </div>
      </div>

      {/* 대시보드 스타일 네비게이션 카드 그리드 */}
      {activeTab === "all" || showTabs ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative overflow-hidden group p-6 rounded-2xl border transition-all duration-500 text-left ${
                activeTab === tab.id
                  ? "bg-white border-white shadow-[0_20px_40px_rgba(255,255,255,0.1)] scale-[1.02]"
                  : "bg-neutral-900/40 border-white/5 hover:border-white/20 hover:bg-neutral-800/60"
              }`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${tab.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />

              <div className="relative z-10 flex flex-col gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "bg-white/5 text-white/40 group-hover:scale-110 group-hover:text-white"
                  }`}
                >
                  {tab.icon}
                </div>
                <div>
                  <h4
                    className={`text-xs font-black uppercase tracking-widest mb-1 ${activeTab === tab.id ? "text-black" : "text-white"}`}
                  >
                    {tab.label}
                  </h4>
                  <p
                    className={`text-[10px] leading-relaxed line-clamp-2 ${activeTab === tab.id ? "text-black/60" : "text-white/40 group-hover:text-white/60"}`}
                  >
                    {tab.description}
                  </p>
                </div>
              </div>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute bottom-0 left-0 h-1 bg-black w-full"
                />
              )}
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative min-h-[60vh] rounded-3xl overflow-hidden bg-neutral-950/20 backdrop-blur-sm border border-white/5 p-1">
        {/* 콘텐츠 전환 애니메이션 및 배경 고정 (블랙 플리커 방지) */}
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        <div className="relative z-10 p-4 md:p-8">
          {activeTab === "global" && (
            <div className="space-y-6">
              <AdminCard
                title="사이트 고유 식별 정보"
                description="내비게이션 바와 브랜딩 요소에 표시될 기본 정보입니다"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="site-name"
                      className="text-[9px] font-black uppercase tracking-widest text-white/30"
                    >
                      포트폴리오 타이틀 (사이트명)
                    </label>
                    <input
                      id="site-name"
                      value={config.siteName || ""}
                      onChange={(e) =>
                        setConfig({ ...config, siteName: e.target.value })
                      }
                      placeholder="예: HONG GIL DONG"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:border-white/40 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="site-role"
                      className="text-[9px] font-black uppercase tracking-widest text-white/30"
                    >
                      전문 분야 / 포지션 (직함)
                    </label>
                    <input
                      id="site-role"
                      value={config.role || ""}
                      onChange={(e) =>
                        setConfig({ ...config, role: e.target.value })
                      }
                      placeholder="예: CREATIVE DIRECTOR"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:border-white/40 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="site-logo"
                      className="text-[9px] font-black uppercase tracking-widest text-white/30"
                    >
                      퍼스널 브랜드 로고
                    </label>
                    <MediaUploadInput
                      id="site-logo"
                      value={config.logoUrl || ""}
                      onUrlChange={(url) =>
                        setConfig({ ...config, logoUrl: url })
                      }
                      onFileUpload={handleFileUpload}
                      isUploading={isSaving}
                    />
                  </div>
                </div>
              </AdminCard>
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="space-y-6">
              <AdminCard
                title="검색 최적화 및 공유 데이터 (SEO)"
                description="Google 검색 결과와 SNS 공유 시 노출될 정보를 설정합니다"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="meta-title"
                      className="text-[9px] font-black uppercase tracking-widest text-white/30"
                    >
                      홈페이지 브라우저 타이틀
                    </label>
                    <input
                      id="meta-title"
                      value={config.metaTitle || ""}
                      onChange={(e) =>
                        setConfig({ ...config, metaTitle: e.target.value })
                      }
                      placeholder="검색 엔진에 노출될 제목"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:border-white/40 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="meta-description"
                      className="text-[9px] font-black uppercase tracking-widest text-white/30"
                    >
                      홈페이지 요약 설명 (Description)
                    </label>
                    <textarea
                      id="meta-description"
                      value={config.metaDescription || ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          metaDescription: e.target.value,
                        })
                      }
                      placeholder="검색 결과에 표시될 사이트에 대한 한두 문장 설명"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg focus:border-white/40 focus:outline-none transition-all min-h-25"
                    />
                  </div>
                </div>
              </AdminCard>
            </div>
          )}

          {activeTab === "connectors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest">
                  소셜 데이터 연동 관리
                </h3>
                <Button
                  onClick={() => {}}
                  variant="outline"
                  size="sm"
                  className="text-[9px]"
                >
                  <Plus className="w-3 h-3 mr-2" /> 신규 채널 추가
                </Button>
              </div>
              <ReactSortable
                list={config.connectors || []}
                setList={(newState) =>
                  setConfig({ ...config, connectors: newState })
                }
                className="space-y-4"
                handle=".drag-handle"
              >
                {(config.connectors || []).map((connector, index) => (
                  <ConnectorCard
                    key={connector.id || index}
                    connector={connector}
                    index={index}
                    onUpdate={(idx, field, val) => {
                      const updated = [...(config.connectors || [])];
                      updated[idx] = { ...updated[idx], [field]: val };
                      setConfig({ ...config, connectors: updated });
                    }}
                    onRemove={(idx) => {
                      const updated = (config.connectors || []).filter(
                        (_, i) => i !== idx,
                      );
                      setConfig({ ...config, connectors: updated });
                    }}
                  />
                ))}
              </ReactSortable>
            </div>
          )}

          {activeTab === "taxonomy" && (
            <div className="space-y-6">
              <AdminCard
                title="프로젝트 분류 체계 관리"
                description="작업물 리스트 필터링에 사용되는 카테고리 항목들입니다"
              >
                <ReactSortable
                  list={(config.categories || []).map((cat, i) => ({
                    id: `cat-${i}`,
                    name: cat,
                  }))}
                  setList={(newState) =>
                    setConfig({
                      ...config,
                      categories: newState.map((item) => item.name),
                    })
                  }
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  handle=".drag-handle"
                >
                  {(config.categories || []).map((category, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group"
                    >
                      <GripVertical className="drag-handle w-3 h-3 text-white/10 group-hover:text-white/30 cursor-grab" />
                      <input
                        value={category}
                        onChange={(e) => {
                          const newCats = [...(config.categories || [])];
                          newCats[index] = e.target.value;
                          setConfig({ ...config, categories: newCats });
                        }}
                        className="flex-1 bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const newCats = (config.categories || []).filter(
                            (_, i) => i !== index,
                          );
                          setConfig({ ...config, categories: newCats });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </ReactSortable>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      const newCats = [
                        ...(config.categories || []),
                        "새 카테고리",
                      ];
                      setConfig({ ...config, categories: newCats });
                    }}
                    variant="outline"
                    className="w-full text-[9px] border-dashed border-white/10 hover:border-white/30"
                  >
                    <Plus className="w-3 h-3 mr-2" /> 카테고리 추가
                  </Button>
                </div>
              </AdminCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
