import React from "react";
import { Project, TechWalkthrough } from "@/types/project";
import { AdminMediaUploader } from "./AdminMediaUploader";
import { Button } from "@/components/ui/button";
import { StyleController } from "@/components/shared/admin/StyleController";

interface ProjectDetailFormProps {
  readonly project: Project;
  readonly index: number;
  readonly isUploading: string | null;
  readonly handleUpdate: <T extends keyof Project>(
    index: number,
    field: T,
    value: Project[T],
  ) => void;
  readonly handleNestedUpdate: <T extends keyof TechWalkthrough>(
    index: number,
    parentField: "techWalkthrough",
    field: T,
    value: TechWalkthrough[T],
  ) => void;
  readonly handleListUpdate: (
    index: number,
    field: "challenges" | "images",
    valueString: string,
  ) => void;
  readonly handleFileUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "gallery" | "video" | "asset",
    field?: string,
  ) => void;
  readonly onToggleExpand: () => void;
}

export function ProjectDetailForm({
  project,
  index,
  isUploading,
  handleUpdate,
  handleNestedUpdate,
  handleListUpdate,
  handleFileUpload,
  onToggleExpand,
}: ProjectDetailFormProps) {
  return (
    <div className="p-8 space-y-12 bg-black/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
            01. 포트폴리오 정체성 (Portfolio Identity)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor={`title-${project.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  프로젝트 제목
                </label>
                <input
                  id={`title-${project.id}`}
                  type="text"
                  value={project.title}
                  onChange={(e) => handleUpdate(index, "title", e.target.value)}
                  className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                />
              </div>
              <StyleController
                label="제목"
                style={project.titleStyle}
                onChange={(style) => handleUpdate(index, "titleStyle", style)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`category-${project.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                카테고리 구분
              </label>
              <input
                id={`category-${project.id}`}
                type="text"
                value={project.category}
                onChange={(e) =>
                  handleUpdate(index, "category", e.target.value)
                }
                className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                placeholder="카테고리를 입력하거나 새로 생성하세요"
              />
            </div>
            <div className="space-y-6 col-span-2">
              <div className="space-y-2">
                <label
                  htmlFor={`desc-${project.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  간략한 요약 설명
                </label>
                <textarea
                  id={`desc-${project.id}`}
                  value={project.description}
                  onChange={(e) =>
                    handleUpdate(index, "description", e.target.value)
                  }
                  rows={2}
                  className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none resize-none"
                />
              </div>
              <StyleController
                label="요약"
                style={project.descriptionStyle}
                onChange={(style) =>
                  handleUpdate(index, "descriptionStyle", style)
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id={`featured-${project.id}`}
              checked={project.featured}
              onChange={(e) =>
                handleUpdate(index, "featured", e.target.checked)
              }
              className="w-4 h-4 bg-black/60 border-white/10 checked:bg-white checked:border-white"
            />
            <label
              htmlFor={`featured-${project.id}`}
              className="text-[10px] font-black uppercase tracking-widest text-white/40"
            >
              대표 프로젝트로 설정 (Featured Project)
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
              카드 가로세로 비율 (Card Aspect Ratio)
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: "16:9", val: "16/9" },
                { label: "4:3", val: "4/3" },
                { label: "3:4", val: "3/4" },
                { label: "1:1", val: "1/1" },
                { label: "9:16", val: "9/16" },
              ].map((ratio) => (
                <button
                  key={ratio.val}
                  onClick={() => handleUpdate(index, "aspectRatio", ratio.val)}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                    (project.aspectRatio || "16/9") === ratio.val
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2 block">
              미디어 첨부 데이터
            </span>
            <div className="grid grid-cols-2 gap-4">
              <AdminMediaUploader
                type="thumbnail"
                id={`thumbnail-${project.id}`}
                label="기본 대표 썸네일"
                value={project.thumbnail}
                onUrlChange={(val: string) =>
                  handleUpdate(index, "thumbnail", val)
                }
                onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(index, e, "thumbnail")
                }
                isUploading={isUploading === "thumbnail-" + project.id}
                aspectRatio={project.aspectRatio}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 border border-white/10 p-6 bg-white/2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
          02. 프로젝트 상세 문서화 (Detailed Documentation)
        </h4>
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor={`full-desc-${project.id}`}
              className="text-[8px] font-black uppercase tracking-widest text-white/20"
            >
              종합 개요 및 세부 설명
            </label>
            <textarea
              id={`full-desc-${project.id}`}
              value={project.fullDescription}
              onChange={(e) =>
                handleUpdate(index, "fullDescription", e.target.value)
              }
              rows={6}
              className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none"
            />
          </div>
          <StyleController
            label="상세 개요"
            style={project.fullDescriptionStyle}
            onChange={(style) =>
              handleUpdate(index, "fullDescriptionStyle", style)
            }
          />
        </div>
      </div>

      <div className="space-y-6 border border-white/10 p-6 bg-white/2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
          03. 전략적 아키텍처 및 방법론 (Strategic Architecture)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor={`approach-${project.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                추진 방법 및 접근 방식
              </label>
              <textarea
                id={`approach-${project.id}`}
                value={project.approach}
                onChange={(e) =>
                  handleUpdate(index, "approach", e.target.value)
                }
                rows={4}
                className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none"
              />
            </div>
            <StyleController
              label="접근 방식"
              style={project.approachStyle}
              onChange={(style) => handleUpdate(index, "approachStyle", style)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`challenges-${project.id}`}
              className="text-[8px] font-black uppercase tracking-widest text-white/20"
            >
              극복한 기술적 과제 (한 줄에 하나씩 입력)
            </label>
            <textarea
              id={`challenges-${project.id}`}
              value={project.challenges?.join("\n")}
              onChange={(e) =>
                handleListUpdate(index, "challenges", e.target.value)
              }
              rows={4}
              className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none"
              placeholder="과제 1&#10;과제 2..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-8">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
            04. 외부 참조 링크 (External References)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor={`github-${project.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                GitHub 저장소
              </label>
              <input
                id={`github-${project.id}`}
                type="text"
                value={project.githubUrl || ""}
                onChange={(e) =>
                  handleUpdate(index, "githubUrl", e.target.value)
                }
                className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`live-${project.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                라이브 환경 링크 (Target)
              </label>
              <input
                id={`live-${project.id}`}
                type="text"
                value={project.liveUrl || ""}
                onChange={(e) => handleUpdate(index, "liveUrl", e.target.value)}
                className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 col-span-1 md:col-span-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
            05. 기술 스택 분류 (Technical Stack)
          </h4>
          <div className="space-y-2">
            <label
              htmlFor={`tags-${project.id}`}
              className="text-[8px] font-black uppercase tracking-widest text-white/20"
            >
              기술 태그 (쉼표로 구분)
            </label>
            <input
              id={`tags-${project.id}`}
              type="text"
              value={project.tags.join(", ")}
              onChange={(e) => {
                const newTags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t !== "");
                handleUpdate(index, "tags", newTags);
              }}
              className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none font-mono tracking-tight"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8 col-span-1 md:col-span-2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
          06. 미디어 URL 및 결과물 (Media & Results)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminMediaUploader
            type="video"
            id={`videoUrl-${project.id}`}
            label="비디오 임베드 (URL)"
            value={project.videoUrl || ""}
            onUrlChange={(val: string) => handleUpdate(index, "videoUrl", val)}
            onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileUpload(index, e, "video")
            }
            isUploading={isUploading === "video-" + project.id}
            aspectRatio={project.aspectRatio}
            placeholder="https://..."
          />
          {(project.category === "Vibe Coding" ||
            project.category === "AI Automation") && (
            <AdminMediaUploader
              type="asset"
              id={`resultFileUrl-${project.id}`}
              label="결과물 파일 (프로그램/문서)"
              value={project.resultFileUrl || ""}
              onUrlChange={(val: string) =>
                handleUpdate(index, "resultFileUrl", val)
              }
              onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileUpload(index, e, "asset", "resultFileUrl")
              }
              isUploading={isUploading === "resultFileUrl-" + project.id}
              placeholder="/assets/projects/..."
            />
          )}
        </div>
      </div>

      <div className="space-y-6 border border-white/10 p-6 bg-white/2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">
          07. 기술 프로세스 (Technical Walkthrough)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor={`wt-title-${project.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  기능/단계별 제목
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
              <StyleController
                label="프로세스 제목"
                style={project.techWalkthrough?.titleStyle}
                onChange={(style) =>
                  handleNestedUpdate(
                    index,
                    "techWalkthrough",
                    "titleStyle",
                    style,
                  )
                }
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor={`wt-desc-${project.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  프로세스 개요 설명
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
              <StyleController
                label="프로세스 설명"
                style={project.techWalkthrough?.descriptionStyle}
                onChange={(style) =>
                  handleNestedUpdate(
                    index,
                    "techWalkthrough",
                    "descriptionStyle",
                    style,
                  )
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`wt-steps-${project.id}`}
              className="text-[8px] font-black uppercase tracking-widest text-white/20"
            >
              단계별 상세 프로세스 (한 줄에 하나씩)
            </label>
            <textarea
              id={`wt-steps-${project.id}`}
              value={project.techWalkthrough?.steps?.join("\n")}
              onChange={(e) => {
                const steps = e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter((s) => s !== "");
                handleNestedUpdate(index, "techWalkthrough", "steps", steps);
              }}
              rows={8}
              className="w-full bg-black/60 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
              placeholder="단계 1&#10;단계 2..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AdminMediaUploader
          type="gallery"
          id={`images-${project.id}`}
          label="상세 갤러리 이미지 (한 줄에 하나씩)"
          value={project.images}
          onUrlChange={(val: string) => handleListUpdate(index, "images", val)}
          onFileUpload={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileUpload(index, e, "gallery")
          }
          isUploading={isUploading === "gallery-" + project.id}
        />
        <div className="space-y-2">
          <label
            htmlFor={`prompt-${project.id}`}
            className="text-[8px] font-black uppercase tracking-widest text-white/20"
          >
            생성 크리에이티브 프롬프트 (AI 프로젝트 전용)
          </label>
          <textarea
            id={`prompt-${project.id}`}
            value={project.prompt}
            onChange={(e) => handleUpdate(index, "prompt", e.target.value)}
            rows={4}
            className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <a
          href={`/work/${project.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2"
        >
          상세 페이지 미리보기 (Preview) ↗
        </a>
        <Button
          onClick={onToggleExpand}
          variant="ghost"
          size="sm"
          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
        >
          편집기 닫기 (Collapse)
        </Button>
      </div>
    </div>
  );
}
