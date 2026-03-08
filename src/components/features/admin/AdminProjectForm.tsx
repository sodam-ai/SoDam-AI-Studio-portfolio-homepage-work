"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";
import AdminToast from "@/components/shared/admin/AdminToast";
import { AdminConfirmModal } from "@/components/shared/admin/AdminConfirmModal";
import { Button } from "@/components/ui/button";

import { Project, TechWalkthrough } from "@/types/project";
import { AdminProjectList } from "./AdminProjectList";

export default function AdminProjectForm() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"detailed" | "compact" | "grid">(
    "detailed",
  );
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([
    "AI Image",
    "AI Video",
    "AI Code",
    "Vibe Coding",
    "AI Automation",
    "Design",
  ]);

  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
  }>({
    isOpen: false,
    projectId: null,
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 3000);
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/update?type=projects&t=${Date.now()}`,
        { cache: "no-store" },
      );
      const result = await res.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `/api/admin/update?type=site-config&t=${Date.now()}`,
        { cache: "no-store" },
      );
      const result = await res.json();
      if (result.success && result.data.categories) {
        setDynamicCategories(result.data.categories);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const handleUpdate = <T extends keyof Project>(
    index: number,
    field: T,
    value: Project[T],
  ) => {
    setProjects((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // 썸네일과 첫 번째 갤러리 이미지 동기화
      if (field === "thumbnail") {
        const currentImages = [...(updated[index].images || [])];
        currentImages[0] = value as string;
        updated[index].images = currentImages;
      }
      return updated;
    });
    if (isSaved) setIsSaved(false);
  };

  const handleNestedUpdate = <T extends keyof TechWalkthrough>(
    index: number,
    parentField: "techWalkthrough",
    field: T,
    value: TechWalkthrough[T],
  ) => {
    setProjects((prev) => {
      const updated = [...prev];
      const parent = updated[index][parentField] || {
        title: "",
        description: "",
        steps: [],
      };
      updated[index] = {
        ...updated[index],
        [parentField]: { ...parent, [field]: value },
      };
      return updated;
    });
    if (isSaved) setIsSaved(false);
  };

  const handleListUpdate = (
    index: number,
    field: "challenges" | "images",
    valueString: string,
  ) => {
    const list = valueString
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    handleUpdate(index, field, list);
  };

  const addProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: "새 프로젝트",
      category: dynamicCategories[0] || "AI Image",
      thumbnail: "",
      description: "프로젝트 요약...",
      tags: ["AI"],
      featured: false,
      fullDescription: "",
      approach: "",
      challenges: [],
      images: [],
      aspectRatio: "auto",
      techWalkthrough: {
        title: "기술 프로세스",
        description: "",
        steps: [],
      },
    };
    setProjects([newProject, ...projects]);
    setExpandedId(newProject.id);
    if (isSaved) setIsSaved(false);
  };

  const removeProject = (id: string) => {
    setConfirmModal({ isOpen: true, projectId: id });
  };

  const handleFileUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "gallery" | "video" | "asset" = "thumbnail",
    field?: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const projectId = projects[index].id;
    const uploadId = field ? `${field}-${projectId}` : `${type}-${projectId}`;
    setIsUploading(type === "thumbnail" ? projectId : uploadId);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        if (type === "thumbnail") {
          handleUpdate(index, "thumbnail", result.data.url as string);
          showToast("썸네일 이미지가 성공적으로 업로드되었습니다.");
        } else if (type === "gallery") {
          const currentImages = projects[index].images || [];
          handleUpdate(index, "images", [
            ...currentImages,
            result.data.url as string,
          ]);
          showToast("갤러리 이미지가 추가되었습니다.");
        } else if (type === "video") {
          handleUpdate(index, "videoUrl", result.data.url as string);
          showToast("동영상이 성공적으로 업로드되었습니다.");
        } else if (type === "asset" && field === "resultFileUrl") {
          handleUpdate(index, "resultFileUrl", result.data.url as string);
          showToast("결과물 파일이 성공적으로 업로드되었습니다.");
        } else if (type === "asset" && field) {
          handleUpdate(index, field as keyof Project, result.data.url);
          showToast("파일이 해당 필드에 성공적으로 업로드되었습니다.");
        } else if (type === "asset") {
          showToast(
            "파일이 성공적으로 업로드되었습니다. 링크: " + result.data.url,
          );
        }
      } else {
        showToast("업로드 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("업로드 중 에러가 발생했습니다.", "error");
    } finally {
      setIsUploading(null);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmModal.projectId) {
      const id = confirmModal.projectId;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("프로젝트가 제거되었습니다.");
      if (isSaved) setIsSaved(false);
      setConfirmModal({ isOpen: false, projectId: null });
    }
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "projects", data: projects }),
      });
      const result = await res.json();
      if (result.success) {
        setIsSaved(true);
        showToast("모든 상세 정보가 안전하게 저장되었습니다.");
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        showToast("저장 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast("에러가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getButtonContent = () => {
    if (isSaving)
      return (
        <>
          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> 시스템 아키텍처
          동기화 중...
        </>
      );
    if (isSaved)
      return (
        <>
          <Check className="w-4 h-4 mr-2" /> 변경사항 최적화 완료
        </>
      );
    return "변경사항 데이터베이스에 반영";
  };

  if (isLoading)
    return (
      <div className="text-[10px] uppercase tracking-widest opacity-30">
        데이터베이스 로딩 중...
      </div>
    );

  return (
    <div className="w-full space-y-12 pb-20 scroll-mt-24">
      <AdminToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, projectId: null })}
        onConfirm={handleConfirmDelete}
        title="프로젝트 삭제 확인"
        message="이 프로젝트와 관련된 모든 상세 데이터가 삭제됩니다. 정말 삭제하시겠습니까?"
      />

      {/* Modern Sticky Header */}
      <div className="flex justify-between items-center bg-black/80 backdrop-blur-xl border border-white/10 sticky -top-8 md:-top-12 z-40 -mx-8 rounded-b-2xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            작업물 아카이브
          </h2>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
            프로젝트 관리 및 포트폴리오 큐레이션
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={saveAll}
            disabled={isSaving}
            variant={isSaved ? "outline" : "default"}
            className={`text-[10px] font-black uppercase tracking-widest px-8 h-12 transition-all flex items-center gap-2
              ${
                isSaved
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              }`}
          >
            {getButtonContent()}
          </Button>
        </div>
      </div>

      <AdminProjectList
        projects={projects}
        setProjects={setProjects}
        viewMode={viewMode}
        setViewMode={setViewMode}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        addProject={addProject}
        removeProject={removeProject}
        isUploading={isUploading}
        handleUpdate={handleUpdate}
        handleNestedUpdate={handleNestedUpdate}
        handleListUpdate={handleListUpdate}
        handleFileUpload={handleFileUpload}
      />
    </div>
  );
}
