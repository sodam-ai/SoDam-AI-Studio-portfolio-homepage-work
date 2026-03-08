import React from "react";
import { motion } from "framer-motion";
import { GripVertical, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project, TechWalkthrough } from "@/types/project";
import { ProjectDetailForm } from "./ProjectDetailForm";

interface AdminProjectItemProps {
  project: Project;
  index: number;
  isExpanded: boolean;
  isUploading: string | null;
  onToggleExpand: () => void;
  handleUpdate: <T extends keyof Project>(
    index: number,
    field: T,
    value: Project[T],
  ) => void;
  handleNestedUpdate: <T extends keyof TechWalkthrough>(
    index: number,
    parentField: "techWalkthrough",
    field: T,
    value: TechWalkthrough[T],
  ) => void;
  handleListUpdate: (
    index: number,
    field: "challenges" | "images",
    valueString: string,
  ) => void;
  handleFileUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "gallery" | "video" | "asset",
    field?: string,
  ) => void;
  removeProject: (id: string) => void;
}

export function AdminProjectItem({
  project,
  index,
  isExpanded,
  isUploading,
  onToggleExpand,
  handleUpdate,
  handleNestedUpdate,
  handleListUpdate,
  handleFileUpload,
  removeProject,
}: AdminProjectItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 overflow-hidden shadow-xl"
    >
      {/* Header for Accordion */}
      <div
        role="button"
        tabIndex={0}
        className={`w-full flex items-center justify-between p-6 cursor-pointer transition-all duration-200 active:scale-[0.98] ${isExpanded ? "bg-white/5 border-b border-white/10" : "hover:bg-white/10"}`}
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
      >
        <div className="flex items-center gap-6">
          <div className="drag-handle p-2 text-white/20 group-hover:text-white/50 transition-colors cursor-grab active:cursor-grabbing border border-white/5">
            <GripVertical size={16} />
          </div>
          <div className="w-12 h-12 bg-white/10 overflow-hidden shrink-0 border border-white/10">
            {project.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.thumbnail}
                alt=""
                className="w-full h-full object-cover grayscale opacity-60"
              />
            )}
          </div>
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-tight">
              {project.title || "제목 없는 아카이브 항목"}
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
            아카이브에서 제거
          </Button>
          <div
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <LayoutList size={16} className="text-white/20" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <ProjectDetailForm
          project={project}
          index={index}
          isUploading={isUploading}
          handleUpdate={handleUpdate}
          handleNestedUpdate={handleNestedUpdate}
          handleListUpdate={handleListUpdate}
          handleFileUpload={handleFileUpload}
          onToggleExpand={onToggleExpand}
        />
      )}
    </motion.div>
  );
}
