/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Check, Plus, Trash2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { ReactSortable } from "react-sortablejs";
import AdminToast from "@/components/shared/admin/AdminToast";
import { Button } from "@/components/ui/button";

interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
}

interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

interface AboutData {
  introduction: string;
  story: string;
  experience: ExperienceItem[];
  skills: SkillGroup[];
}

// Sub-component for Experience Reorder Item with Drag Handle
const ExperienceCard = ({
  exp,
  onRemove,
  onUpdate,
}: {
  exp: ExperienceItem;
  onRemove: () => void;
  onUpdate: (field: keyof ExperienceItem, value: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 10px 15px -3px rgb(255 255 255 / 0.05)",
      }}
      whileTap={{ scale: 0.99, cursor: "grabbing" }}
      className="group bg-white/2 border border-white/5 hover:border-white/10 transition-all rounded-sm overflow-hidden shadow-sm hover:shadow-md"
    >
      <div className="flex">
        {/* Drag Handle */}
        <button
          type="button"
          className="drag-handle w-12 bg-white/2 flex items-center justify-center border-r border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
          aria-label="Drag to reorder experience"
        >
          <GripVertical
            className="w-4 text-white/10 group-hover:text-white/40 transition-colors"
            aria-hidden="true"
          />
        </button>

        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <button
            onClick={onRemove}
            className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 rounded-md"
            title="Delete Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="space-y-2">
            <label
              htmlFor={`period-${exp.id}`}
              className="text-[8px] font-black uppercase tracking-widest text-white/20"
            >
              Duration
            </label>
            <input
              id={`period-${exp.id}`}
              type="text"
              value={exp.period}
              onChange={(e) => onUpdate("period", e.target.value)}
              className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-bold outline-none focus:border-white/30 transition-colors rounded-xs"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor={`role-${exp.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  Position
                </label>
                <input
                  id={`role-${exp.id}`}
                  type="text"
                  value={exp.role}
                  onChange={(e) => onUpdate("role", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-white/30 transition-colors rounded-xs"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor={`company-${exp.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  Organization
                </label>
                <input
                  id={`company-${exp.id}`}
                  type="text"
                  value={exp.company}
                  onChange={(e) => onUpdate("company", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-white/30 transition-colors rounded-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`accomplishments-${exp.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                Primary Accomplishments
              </label>
              <textarea
                id={`accomplishments-${exp.id}`}
                value={exp.description}
                onChange={(e) => onUpdate("description", e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/5 px-4 py-3 text-xs leading-relaxed outline-none resize-none focus:border-white/30 transition-colors rounded-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Sub-component for Skill Reorder Item with Drag Handle
const SkillCategoryCard = ({
  group,
  onRemove,
  onCategoryUpdate,
  onItemsUpdate,
}: {
  group: SkillGroup;
  onRemove: () => void;
  onCategoryUpdate: (value: string) => void;
  onItemsUpdate: (value: string) => void;
}) => {
  const catId = `skill-cat-${group.id}`;
  const itemsId = `skill-items-${group.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="group bg-white/2 border border-white/5 hover:border-white/10 p-8 space-y-6 relative transition-all rounded-sm shadow-sm hover:shadow-md"
    >
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 rounded-md"
        title="Remove Category"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-4">
        <button
          type="button"
          className="drag-handle mt-7 w-8 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-sm transition-colors"
          aria-label="Drag to reorder skill category"
        >
          <GripVertical
            className="w-4 text-white/10 group-hover:text-white/40"
            aria-hidden="true"
          />
        </button>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor={catId}
              className="text-[9px] font-black uppercase tracking-widest text-white/20"
            >
              Focus Area
            </label>
            <input
              id={catId}
              type="text"
              value={group.category}
              onChange={(e) => onCategoryUpdate(e.target.value)}
              className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] outline-none focus:border-white/30 transition-colors rounded-xs"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={itemsId}
              className="text-[9px] font-black uppercase tracking-widest text-white/20"
            >
              Expertise (Comma Separated)
            </label>
            <textarea
              id={itemsId}
              value={group.items.join(", ")}
              onChange={(e) => onItemsUpdate(e.target.value)}
              rows={4}
              className="w-full bg-black/40 border border-white/5 px-4 py-3 text-xs leading-relaxed outline-none resize-none focus:border-white/30 transition-colors rounded-xs"
              placeholder="Skill 1, Skill 2, Skill 3..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminAboutForm() {
  const [data, setData] = useState<AboutData | null>(null);
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
    fetchAboutData();
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/update?type=about");
      const result = await res.json();
      if (result.success) {
        // Ensure all items have IDs for Reorder stability
        const sanitizedData: AboutData = {
          ...result.data,
          experience: result.data.experience.map((exp: any) => ({
            ...exp,
            id: exp.id || generateId(),
          })),
          skills: result.data.skills.map((skill: any) => ({
            ...skill,
            id: skill.id || generateId(),
          })),
        };
        setData(sanitizedData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (field: keyof AboutData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
    if (isSaved) setIsSaved(false);
  };

  const handleExperienceUpdate = (
    id: string,
    field: keyof ExperienceItem,
    value: string,
  ) => {
    if (!data) return;
    const updatedExp = data.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp,
    );
    setData({ ...data, experience: updatedExp });
    if (isSaved) setIsSaved(false);
  };

  const handleSkillCategoryUpdate = (id: string, value: string) => {
    if (!data) return;
    const updatedSkills = data.skills.map((skill) =>
      skill.id === id ? { ...skill, category: value } : skill,
    );
    setData({ ...data, skills: updatedSkills });
    if (isSaved) setIsSaved(false);
  };

  const handleSkillItemsUpdate = (id: string, value: string) => {
    if (!data) return;
    const items = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    const updatedSkills = data.skills.map((skill) =>
      skill.id === id ? { ...skill, items } : skill,
    );
    setData({ ...data, skills: updatedSkills });
    if (isSaved) setIsSaved(false);
  };

  const addExperience = () => {
    if (!data) return;
    const newExperience: ExperienceItem = {
      id: generateId(),
      period: "NEW PERIOD (202X-202X)",
      role: "DESIGNER / DEVELOPER",
      company: "STUDIO NAME",
      description: "Briefly explain your key achievements and roles...",
    };
    setData({ ...data, experience: [newExperience, ...data.experience] });
    if (isSaved) setIsSaved(false);
  };

  const removeExperience = (id: string) => {
    if (!data) return;
    const updatedExp = data.experience.filter((exp) => exp.id !== id);
    setData({ ...data, experience: updatedExp });
    if (isSaved) setIsSaved(false);
  };

  const addSkillCategory = () => {
    if (!data) return;
    const newSkill: SkillGroup = {
      id: generateId(),
      category: "NEW CATEGORY",
      items: [],
    };
    setData({ ...data, skills: [...data.skills, newSkill] });
    if (isSaved) setIsSaved(false);
  };

  const removeSkillCategory = (id: string) => {
    if (!data) return;
    const updatedSkills = data.skills.filter((skill) => skill.id !== id);
    setData({ ...data, skills: updatedSkills });
    if (isSaved) setIsSaved(false);
  };

  const setExperienceOrder = (newOrder: ExperienceItem[]) => {
    if (!data) return;
    setData({ ...data, experience: newOrder });
    if (isSaved) setIsSaved(false);
  };

  const setSkillsOrder = (newOrder: SkillGroup[]) => {
    if (!data) return;
    setData({ ...data, skills: newOrder });
    if (isSaved) setIsSaved(false);
  };

  const saveAll = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      // Remove temporary IDs before saving to clean up JSON
      const dataToSave = {
        ...data,
        experience: data.experience.map(({ id, ...rest }) => rest),
        skills: data.skills.map(({ id, ...rest }) => rest),
      };

      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "about", data: dataToSave }),
      });
      const result = await res.json();
      if (result.success) {
        setIsSaved(true);
        showToast("비오그라피 설정이 성공적으로 동기화되었습니다.");
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        showToast("저장 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast("네트워크 또는 서버 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col gap-2 opacity-30 animate-pulse">
        <div className="h-4 w-32 bg-white/20 rounded-full" />
        <div className="h-2 w-48 bg-white/10 rounded-full" />
      </div>
    );
  if (!data)
    return (
      <div className="text-white/30 text-[10px] uppercase tracking-widest font-black">
        Database Entry Not Found
      </div>
    );

  const getButtonContent = () => {
    if (isSaving) return "Syncing...";
    if (isSaved)
      return (
        <span className="flex items-center gap-2">
          <Check className="w-3" strokeWidth={3} /> Synchronized
        </span>
      );
    return "Commit Changes";
  };

  return (
    <div className="w-full space-y-16 pb-20">
      <AdminToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <div className="flex justify-between items-center bg-black/50 backdrop-blur-xl p-8 border border-white/10 sticky top-0 z-40 -mx-8 rounded-b-2xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Biography Editor
          </h2>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
            Crafting your professional narrative
          </p>
        </div>
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

      <div className="space-y-16">
        {/* 기본 소개 */}
        <section className="space-y-8 max-w-4xl">
          <div className="space-y-3">
            <label
              htmlFor="main-intro"
              className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"
            >
              <span
                className="w-1 h-1 bg-white/20 rounded-full"
                aria-hidden="true"
              />{" "}
              Headline Statement
            </label>
            <input
              id="main-intro"
              type="text"
              value={data.introduction}
              onChange={(e) => handleUpdate("introduction", e.target.value)}
              placeholder="Your strong opener here..."
              className="w-full bg-white/2 border border-white/10 px-6 py-5 text-base font-medium focus:border-white focus:bg-white/5 outline-none transition-all rounded-sm"
            />
          </div>
          <div className="space-y-3">
            <label
              htmlFor="detail-story"
              className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"
            >
              <span
                className="w-1 h-1 bg-white/20 rounded-full"
                aria-hidden="true"
              />{" "}
              Full Biography
            </label>
            <textarea
              id="detail-story"
              value={data.story}
              onChange={(e) => handleUpdate("story", e.target.value)}
              rows={8}
              placeholder="Tell your professional journey in detail..."
              className="w-full bg-white/2 border border-white/10 px-6 py-5 text-sm leading-relaxed focus:border-white focus:bg-white/5 outline-none resize-none transition-all rounded-sm"
            />
          </div>
        </section>

        {/* 경력 섹션 */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">
                Experience Timeline
              </h3>
              <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2">
                Drag handles to re-order chronology
              </p>
            </div>
            <Button
              onClick={addExperience}
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest border-white/10 px-5 h-9 hover:bg-white hover:text-black transition-all flex items-center gap-2 group rounded-full"
            >
              <Plus
                className="w-3 h-3 transition-transform group-hover:rotate-90"
                aria-hidden="true"
              />
              New Entry
            </Button>
          </div>

          <ReactSortable
            list={data.experience}
            setList={setExperienceOrder}
            animation={200}
            handle=".drag-handle"
            className="space-y-4"
          >
            {data.experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                onRemove={() => removeExperience(exp.id)}
                onUpdate={(field, value) =>
                  handleExperienceUpdate(exp.id, field, value)
                }
              />
            ))}
          </ReactSortable>
        </section>

        {/* 기술 스택 섹션 */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">
                Technical Skillsets
              </h3>
              <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2">
                Group your expertise by focus areas
              </p>
            </div>
            <Button
              onClick={addSkillCategory}
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest border-white/10 px-5 h-9 hover:bg-white hover:text-black transition-all flex items-center gap-2 group rounded-full"
            >
              <Plus className="w-3 h-3 transition-transform group-hover:rotate-90" />
              New Category
            </Button>
          </div>

          <ReactSortable
            list={data.skills}
            setList={setSkillsOrder}
            animation={200}
            handle=".drag-handle"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {data.skills.map((group) => (
              <SkillCategoryCard
                key={group.id}
                group={group}
                onRemove={() => removeSkillCategory(group.id)}
                onCategoryUpdate={(value) =>
                  handleSkillCategoryUpdate(group.id, value)
                }
                onItemsUpdate={(value) =>
                  handleSkillItemsUpdate(group.id, value)
                }
              />
            ))}
          </ReactSortable>
        </section>
      </div>
    </div>
  );
}
