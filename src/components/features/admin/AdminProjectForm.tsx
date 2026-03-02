"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Upload,
  LayoutList,
  List,
  Grid,
  GripVertical,
  RefreshCw,
} from "lucide-react";
import AdminToast from "@/components/shared/admin/AdminToast";
import { ReactSortable } from "react-sortablejs";
import { AdminConfirmModal } from "@/components/shared/admin/AdminConfirmModal";
import { MediaUploadInput } from "./MediaUploadInput";
import { Button } from "@/components/ui/button";

interface TechWalkthrough {
  title: string;
  description: string;
  steps: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  tags: string[];
  featured?: boolean;
  fullDescription?: string;
  approach?: string;
  challenges?: string[];
  images?: string[];
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  resultFileUrl?: string;
  prompt?: string;
  techWalkthrough?: TechWalkthrough;
  aspectRatio?: string;
}

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

  // ... (Toast and Modal states stay same)
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
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/update?type=projects");
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
      title: "New Project",
      category: "AI Image",
      thumbnail: "/images/placeholder.jpg",
      description: "Project summary...",
      tags: ["AI"],
      featured: false,
      fullDescription: "",
      approach: "",
      challenges: [],
      images: [],
      aspectRatio: "auto",
      techWalkthrough: {
        title: "Technical Process",
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

  const categories = [
    "AI Image",
    "AI Video",
    "AI Code",
    "Vibe Coding",
    "AI Automation",
    "Design",
  ];

  const getButtonContent = () => {
    if (isSaving)
      return (
        <>
          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Synching
          Architecture...
        </>
      );
    if (isSaved)
      return (
        <>
          <Check className="w-4 h-4 mr-2" /> Changes Optimized
        </>
      );
    return "Commit Changes to Database";
  };

  if (isLoading)
    return (
      <div className="text-[10px] uppercase tracking-widest opacity-30">
        Loading database...
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
      <div className="flex justify-between items-center bg-black/80 backdrop-blur-xl border border-white/10 sticky top-0 z-40 -mx-8 rounded-b-2xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Work Archive
          </h2>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
            Project Management & Portfolio Curation
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

      <div className="space-y-16">
        {/* Statistics & Quick Actions Section */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/2 border border-white/5 p-8 rounded-sm">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              Project Archive Explorer
            </h3>
            <p className="text-[8px] text-white/20 uppercase tracking-widest">
              TOTAL {projects.length} WORKS REGISTERED
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex bg-black/40 border border-white/10 p-1 rounded-sm">
              <button
                onClick={() => setViewMode("detailed")}
                className={`p-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${viewMode === "detailed" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"}`}
                title="Detailed View"
              >
                <LayoutList size={14} />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`p-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${viewMode === "compact" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"}`}
                title="Compact View"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"}`}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
            </div>

            <Button
              onClick={addProject}
              variant="outline"
              className="bg-white text-black hover:bg-white/90 font-black text-[9px] tracking-widest px-6 h-10 border-none rounded-xs"
            >
              ADD NEW WORK
            </Button>
          </div>
        </section>

        {/* Projects List with Sorting */}
        <ReactSortable
          list={projects}
          setList={setProjects}
          animation={200}
          delay={100}
          delayOnTouchOnly={true}
          ghostClass="opacity-20"
          dragClass="opacity-100"
          handle=".drag-handle"
          className={`w-full ${viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}`}
        >
          {projects.map((project, index) => {
            const isExpanded = expandedId === project.id;

            if (viewMode === "grid") {
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-square bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-grab active:cursor-grabbing shadow-lg"
                >
                  <button
                    type="button"
                    className="w-full h-full text-left block transition-all duration-200 active:scale-[0.98]"
                    onClick={() => {
                      setViewMode("detailed");
                      setExpandedId(project.id);
                    }}
                  >
                    <div className="drag-handle absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none p-1 bg-black/40 backdrop-blur rounded-sm">
                      <GripVertical size={16} className="text-white/70" />
                    </div>
                    {project.thumbnail && (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                      <span className="text-[7px] font-black uppercase tracking-widest text-white/50 mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-[10px] font-black uppercase tracking-tight line-clamp-1">
                        {project.title || "Untitled"}
                      </h3>
                    </div>
                    {project.featured && (
                      <div className="absolute top-2 right-2 box-content z-20">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            }

            if (viewMode === "compact") {
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-all group shadow-md"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="drag-handle pl-2 text-white/20 group-hover:text-white/50 transition-colors cursor-grab active:cursor-grabbing">
                      <GripVertical size={14} />
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-4 flex-1 text-left transition-all duration-200 active:scale-[0.98]"
                      onClick={() => {
                        setViewMode("detailed");
                        setExpandedId(project.id);
                      }}
                    >
                      <div className="w-8 h-8 bg-white/10 overflow-hidden shrink-0">
                        {project.thumbnail && (
                          <img
                            src={project.thumbnail}
                            alt=""
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="text-[11px] font-black uppercase tracking-tight w-48 truncate">
                          {project.title || "Untitled Project"}
                        </h3>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
                          {project.category}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-6 pr-4">
                    {project.featured && (
                      <span className="text-[7px] font-black uppercase tracking-widest text-yellow-500/50">
                        Featured
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-[9px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest px-3 h-7"
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              );
            }

            // Detailed View (Accordion style)
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 overflow-hidden shadow-xl"
              >
                {/* Header for Accordion */}
                <div
                  className={`w-full flex items-center justify-between p-6 cursor-pointer transition-all duration-200 active:scale-[0.98] ${isExpanded ? "bg-white/5 border-b border-white/10" : "hover:bg-white/10"}`}
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedId(isExpanded ? null : project.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className="drag-handle p-2 text-white/20 group-hover:text-white/50 transition-colors cursor-grab active:cursor-grabbing border border-white/5">
                      <GripVertical size={16} />
                    </div>
                    <div className="w-12 h-12 bg-white/10 overflow-hidden shrink-0 border border-white/10">
                      {project.thumbnail && (
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="w-full h-full object-cover grayscale opacity-60"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-[12px] font-black uppercase tracking-tight">
                        {project.title || "Untitled Archive Item"}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                          {project.category}
                        </span>
                        {project.featured && (
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(project.id);
                      }}
                      className="text-[9px] font-black text-red-500/40 hover:text-red-500 transition-all uppercase tracking-widest px-4 h-8"
                    >
                      Archive Removal
                    </Button>
                    <div
                      className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <LayoutList size={16} className="text-white/20" />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-8 space-y-12 bg-black/40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
                          01. Portfolio Identity
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label
                              htmlFor={`title-${project.id}`}
                              className="text-[8px] font-black uppercase tracking-widest text-white/20"
                            >
                              Archive Title
                            </label>
                            <input
                              id={`title-${project.id}`}
                              type="text"
                              value={project.title}
                              onChange={(e) =>
                                handleUpdate(index, "title", e.target.value)
                              }
                              className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor={`category-${project.id}`}
                              className="text-[8px] font-black uppercase tracking-widest text-white/20"
                            >
                              Category
                            </label>
                            <select
                              id={`category-${project.id}`}
                              value={project.category}
                              onChange={(e) =>
                                handleUpdate(index, "category", e.target.value)
                              }
                              className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center pt-2">
                            <div className="flex items-center">
                              <input
                                id={`featured-${project.id}`}
                                type="checkbox"
                                checked={project.featured}
                                onChange={(e) =>
                                  handleUpdate(
                                    index,
                                    "featured",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 accent-white"
                              />
                              <label
                                htmlFor={`featured-${project.id}`}
                                className="ml-3 text-[10px] uppercase tracking-widest text-white/50 cursor-pointer"
                              >
                                Highlight on Main
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
                            02. Assets & Tags
                          </h4>
                          <div className="space-y-4">
                            <MediaUploadInput
                              id={`thumbnail-${project.id}`}
                              label="Thumbnail URL"
                              value={project.thumbnail}
                              onUrlChange={(val) =>
                                handleUpdate(index, "thumbnail", val)
                              }
                              onFileUpload={(e) =>
                                handleFileUpload(index, e, "thumbnail")
                              }
                              isUploading={isUploading === project.id}
                              uploadLabel="File"
                              accept="image/*"
                              placeholder="/images/..."
                            />
                            {project.thumbnail && (
                              <div className="mt-3 relative group">
                                <div className="aspect-video w-full bg-white/5 border border-white/10 overflow-hidden relative">
                                  <img
                                    src={project.thumbnail}
                                    alt="Preview"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "https://placehold.co/600x400/000000/FFFFFF?text=Invalid+Image+URL";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/70">
                                      Live Preview
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="space-y-2">
                              <label
                                htmlFor={`aspectRatio-${project.id}`}
                                className="text-[8px] font-black uppercase tracking-widest text-white/20"
                              >
                                Thumbnail Aspect Ratio
                              </label>
                              <select
                                id={`aspectRatio-${project.id}`}
                                value={project.aspectRatio || "auto"}
                                onChange={(e) =>
                                  handleUpdate(
                                    index,
                                    "aspectRatio",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                              >
                                <option value="auto">Auto (원본 비율)</option>
                                <option value="16/9">16:9 (가로형)</option>
                                <option value="9/16">9:16 (세로형)</option>
                                <option value="1/1">1:1 (정사각형)</option>
                                <option value="4/3">4:3 (가로형)</option>
                                <option value="3/4">3:4 (세로형)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor={`tags-${project.id}`}
                                className="text-[8px] font-black uppercase tracking-widest text-white/20"
                              >
                                Keywords (Comma Separated)
                              </label>
                              <input
                                id={`tags-${project.id}`}
                                type="text"
                                value={project.tags.join(", ")}
                                onChange={(e) =>
                                  handleUpdate(
                                    index,
                                    "tags",
                                    e.target.value
                                      .split(",")
                                      .map((s) => s.trim()),
                                  )
                                }
                                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* Closing div for the first grid column (Portfolio Identity & Assets) */}
                    {/* Section 2: Narrative Content */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
                        03. Narrative
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-2">
                          <label
                            htmlFor={`desc-${project.id}`}
                            className="text-[8px] font-black uppercase tracking-widest text-white/20"
                          >
                            Short Summary (For Card)
                          </label>
                          <textarea
                            id={`desc-${project.id}`}
                            value={project.description}
                            onChange={(e) =>
                              handleUpdate(index, "description", e.target.value)
                            }
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`fullDesc-${project.id}`}
                            className="text-[8px] font-black uppercase tracking-widest text-white/20"
                          >
                            Full Description (Detail Page Hero)
                          </label>
                          <textarea
                            id={`fullDesc-${project.id}`}
                            value={project.fullDescription}
                            onChange={(e) =>
                              handleUpdate(
                                index,
                                "fullDescription",
                                e.target.value,
                              )
                            }
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none resize-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`approach-${project.id}`}
                          className="text-[8px] font-black uppercase tracking-widest text-white/20"
                        >
                          Strategic Approach
                        </label>
                        <textarea
                          id={`approach-${project.id}`}
                          value={project.approach}
                          onChange={(e) =>
                            handleUpdate(index, "approach", e.target.value)
                          }
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none resize-none"
                        />
                      </div>
                    </div>
                    {/* Section 3: Technical Challenges & Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
                          04. Challenges (One per line)
                        </h4>
                        <label
                          htmlFor={`challenges-${project.id}`}
                          className="sr-only"
                        >
                          Challenges
                        </label>
                        <textarea
                          id={`challenges-${project.id}`}
                          value={project.challenges?.join("\n")}
                          onChange={(e) =>
                            handleListUpdate(
                              index,
                              "challenges",
                              e.target.value,
                            )
                          }
                          rows={5}
                          className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
                          placeholder="Challenge 1&#10;Challenge 2..."
                        />
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
                          05. External Connections
                        </h4>
                        <div className="space-y-4">
                          <MediaUploadInput
                            id={`liveUrl-${project.id}`}
                            label="Live URL"
                            value={project.liveUrl || ""}
                            onUrlChange={(val) =>
                              handleUpdate(index, "liveUrl", val)
                            }
                            onFileUpload={(e) =>
                              handleFileUpload(index, e, "asset", "liveUrl")
                            }
                            isUploading={
                              isUploading === "liveUrl-" + project.id
                            }
                            uploadLabel="File"
                            placeholder="https://..."
                          />
                          <MediaUploadInput
                            id={`githubUrl-${project.id}`}
                            label="GitHub Repository"
                            value={project.githubUrl || ""}
                            onUrlChange={(val) =>
                              handleUpdate(index, "githubUrl", val)
                            }
                            onFileUpload={(e) =>
                              handleFileUpload(index, e, "asset", "githubUrl")
                            }
                            isUploading={
                              isUploading === "githubUrl-" + project.id
                            }
                            uploadLabel="File"
                            placeholder="https://github.com/..."
                          />
                          <div className="space-y-2">
                            <label
                              htmlFor={`videoUrl-${project.id}`}
                              className="text-[8px] font-black uppercase tracking-widest text-white/20"
                            >
                              Video Embed URL
                            </label>
                            {project.videoUrl && (
                              <div className="aspect-video w-full bg-black border border-white/10 mb-2 overflow-hidden group relative">
                                <video
                                  src={project.videoUrl}
                                  className="w-full h-full object-cover"
                                  controls
                                  muted
                                  playsInline
                                />
                                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[8px] font-bold uppercase tracking-tighter text-white/60">
                                  Live Preview
                                </div>
                              </div>
                            )}
                            <MediaUploadInput
                              id={`videoUrl-${project.id}`}
                              value={project.videoUrl || ""}
                              onUrlChange={(val) =>
                                handleUpdate(index, "videoUrl", val)
                              }
                              onFileUpload={(e) =>
                                handleFileUpload(index, e, "video")
                              }
                              isUploading={
                                isUploading === "video-" + project.id
                              }
                              uploadLabel="File"
                              accept="video/*"
                              placeholder="https://..."
                            />
                          </div>
                          {(project.category === "Vibe Coding" ||
                            project.category === "AI Automation") && (
                            <MediaUploadInput
                              id={`resultFileUrl-${project.id}`}
                              label="Result File (Program/Doc)"
                              value={project.resultFileUrl || ""}
                              onUrlChange={(val) =>
                                handleUpdate(index, "resultFileUrl", val)
                              }
                              onFileUpload={(e) =>
                                handleFileUpload(
                                  index,
                                  e,
                                  "asset",
                                  "resultFileUrl",
                                )
                              }
                              isUploading={
                                isUploading === "resultFileUrl-" + project.id
                              }
                              uploadLabel="File"
                              placeholder="/assets/projects/..."
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Section 4: Technical Walkthrough */}
                    <div className="space-y-6 border border-white/10 p-6 bg-white/2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
                        06. Technical Walkthrough
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor={`wt-title-${project.id}`}
                              className="text-[8px] font-black uppercase tracking-widest text-white/20"
                            >
                              Section Title
                            </label>
                            <input
                              id={`wt-title-${project.id}`}
                              type="text"
                              value={project.techWalkthrough?.title}
                              onChange={(e) =>
                                handleNestedUpdate(
                                  index,
                                  "techWalkthrough",
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor={`wt-desc-${project.id}`}
                              className="text-[8px] font-black uppercase tracking-widest text-white/20"
                            >
                              Process Overview
                            </label>
                            <textarea
                              id={`wt-desc-${project.id}`}
                              value={project.techWalkthrough?.description}
                              onChange={(e) =>
                                handleNestedUpdate(
                                  index,
                                  "techWalkthrough",
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={4}
                              className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none resize-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`wt-steps-${project.id}`}
                            className="text-[8px] font-black uppercase tracking-widest text-white/20"
                          >
                            Walkthrough Steps (One per line)
                          </label>
                          <textarea
                            id={`wt-steps-${project.id}`}
                            value={project.techWalkthrough?.steps?.join("\n")}
                            onChange={(e) => {
                              const steps = e.target.value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter((s) => s !== "");
                              handleNestedUpdate(
                                index,
                                "techWalkthrough",
                                "steps",
                                steps,
                              );
                            }}
                            rows={8}
                            className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
                            placeholder="Step 1&#10;Step 2..."
                          />
                        </div>
                      </div>
                    </div>
                    {/* Section 5: AI & Media */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end mb-1">
                          <label
                            htmlFor={`images-${project.id}`}
                            className="text-[8px] font-black uppercase tracking-widest text-white/20"
                          >
                            Gallery Images (One per line)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id={`gallery-file-${project.id}`}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(index, e, "gallery")
                              }
                              disabled={isUploading === "gallery-" + project.id}
                            />
                            <label
                              htmlFor={`gallery-file-${project.id}`}
                              className={`flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-[0.98] text-[8px] uppercase font-black tracking-widest ${
                                isUploading === "gallery-" + project.id
                                  ? "opacity-50 cursor-wait"
                                  : ""
                              }`}
                            >
                              <Upload className="w-2.5 h-2.5" />
                              {isUploading === "gallery-" + project.id
                                ? "Syncing..."
                                : "Upload Gallery"}
                            </label>
                          </div>
                        </div>
                        <textarea
                          id={`images-${project.id}`}
                          value={project.images?.join("\n")}
                          onChange={(e) =>
                            handleListUpdate(index, "images", e.target.value)
                          }
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
                          placeholder="/images/extra1.jpg&#10;/images/extra2.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`prompt-${project.id}`}
                          className="text-[8px] font-black uppercase tracking-widest text-white/20"
                        >
                          Creative Prompt (AI Projects Only)
                        </label>
                        <textarea
                          id={`prompt-${project.id}`}
                          value={project.prompt}
                          onChange={(e) =>
                            handleUpdate(index, "prompt", e.target.value)
                          }
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
                        />
                      </div>
                    </div>
                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                      <a
                        href={`/work/${project.id}`}
                        target="_blank"
                        className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        Preview Detail Page ↗
                      </a>
                      <Button
                        onClick={() => setExpandedId(null)}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                      >
                        Collapse Editor
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </ReactSortable>
      </div>
    </div>
  );
}
