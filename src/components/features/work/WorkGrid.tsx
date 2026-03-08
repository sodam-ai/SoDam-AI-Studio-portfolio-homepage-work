import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MasterpieceCard from "@/components/sections/MasterpieceCard";
import { Project } from "@/types/work";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { ElementStyle } from "@/types/style";

interface WorkGridProps {
  projects: Project[];
  gridColumns?: number;
  cardGap?: number;
  animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
  categoryStyle?: ElementStyle;
  titleStyle?: ElementStyle;
  descriptionStyle?: ElementStyle;
}

export default function WorkGrid({
  projects,
  gridColumns = 3,
  cardGap = 40,
  animations,
  categoryStyle,
  titleStyle,
  descriptionStyle,
}: Readonly<WorkGridProps>) {
  const { getFadeInVariants } = useAnimationEngine(animations);
  const normalizedGridColumns = Math.max(1, gridColumns);
  const gridStyle = {
    gap: `${cardGap}px`,
    "--work-grid-columns": normalizedGridColumns,
  } as React.CSSProperties;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:[grid-template-columns:repeat(var(--work-grid-columns),minmax(0,1fr))]"
      style={gridStyle}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.length === 0 && (
          <motion.div
            key="work-grid-empty"
            className="col-span-full rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-600"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            현재 필터와 일치하는 프로젝트가 없습니다.
          </motion.div>
        )}
        {projects.map((project, index) => (
          <motion.div
            key={`work-card-${project.id}`}
            layout
            variants={getFadeInVariants("up", index * 0.05)}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              layout: { duration: 0.4, ease: "circOut" },
            }}
          >
            <MasterpieceCard
              project={project}
              index={index}
              animations={animations}
              categoryStyle={categoryStyle}
              titleStyle={titleStyle}
              descriptionStyle={descriptionStyle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
