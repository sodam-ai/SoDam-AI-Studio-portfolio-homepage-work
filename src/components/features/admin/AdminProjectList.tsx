import { motion } from "framer-motion";
import { LayoutList, List, Grid, GripVertical } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { Button } from "@/components/ui/button";
import { Project, TechWalkthrough } from "@/types/project";
import { AdminProjectItem } from "./AdminProjectItem";

interface AdminProjectListProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  viewMode: "detailed" | "compact" | "grid";
  setViewMode: (mode: "detailed" | "compact" | "grid") => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  isUploading: string | null;
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
    type?: "thumbnail" | "gallery" | "video" | "asset",
    field?: string,
  ) => Promise<void>;
}

export function AdminProjectList({
  projects,
  setProjects,
  viewMode,
  setViewMode,
  expandedId,
  setExpandedId,
  addProject,
  removeProject,
  isUploading,
  handleUpdate,
  handleNestedUpdate,
  handleListUpdate,
  handleFileUpload,
}: AdminProjectListProps) {
  return (
    <div className="space-y-16">
      {/* Statistics & Quick Actions Section */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/2 border border-white/5 p-8 rounded-sm">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            프로젝트 아카이브 탐색기
          </h3>
          <p className="text-[8px] text-white/20 uppercase tracking-widest">
            총 {projects.length}개의 작업물이 등록됨
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 p-1 rounded-sm">
            <button
              onClick={() => setViewMode("detailed")}
              className={`p-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${viewMode === "detailed" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"}`}
              title="상세 보기"
            >
              <LayoutList size={14} />
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`p-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${viewMode === "compact" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"}`}
              title="간략 보기"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/60"}`}
              title="그리드 보기"
            >
              <Grid size={14} />
            </button>
          </div>

          <Button
            onClick={addProject}
            variant="outline"
            className="bg-white text-black hover:bg-white/90 font-black text-[9px] tracking-widest px-6 h-10 border-none rounded-xs"
          >
            새 작업물 추가
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
                className="group relative bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-grab active:cursor-grabbing shadow-lg"
                style={{
                  aspectRatio:
                    project.aspectRatio && project.aspectRatio !== "auto"
                      ? project.aspectRatio.replace(":", "/")
                      : "1/1",
                }}
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
                    /* eslint-disable-next-line @next/next/no-img-element */
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
                      {project.title || "제목 없음"}
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
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-[11px] font-black uppercase tracking-tight w-48 truncate">
                        {project.title || "제목 없는 프로젝트"}
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
                      대표 작품
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="text-[9px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest px-3 h-7"
                  >
                    삭제
                  </Button>
                </div>
              </motion.div>
            );
          }

          // Detailed View (Accordion style)
          return (
            <AdminProjectItem
              key={project.id}
              project={project}
              index={index}
              isExpanded={isExpanded}
              isUploading={isUploading}
              onToggleExpand={() =>
                setExpandedId(isExpanded ? null : project.id)
              }
              handleUpdate={handleUpdate}
              handleNestedUpdate={handleNestedUpdate}
              handleListUpdate={handleListUpdate}
              handleFileUpload={handleFileUpload}
              removeProject={removeProject}
            />
          );
        })}
      </ReactSortable>
    </div>
  );
}
