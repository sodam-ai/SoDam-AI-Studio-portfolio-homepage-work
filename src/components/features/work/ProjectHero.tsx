import { getElementStyles } from "@/utils/styleUtils";
import { ElementStyle } from "@/types/style";
import { motion } from "framer-motion";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";

interface ProjectHeroProps {
  id: string;
  title: string;
  tags: string[];
  titleStyle?: ElementStyle;
  animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
}

export function ProjectHero({
  id,
  title,
  tags,
  titleStyle,
  animations,
}: ProjectHeroProps) {
  const { transition, getFadeInVariants } = useAnimationEngine(animations);
  const titleStyles = getElementStyles(titleStyle);

  return (
    <motion.div
      variants={getFadeInVariants("up")}
      initial="initial"
      animate="animate"
      transition={transition}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="h-px w-12 bg-(--accent-primary)" />
        <span className="text-[10px] tracking-[0.4em] uppercase text-(--accent-primary) font-black">
          PROJECT_ARCHIVE_{id.slice(-4).toUpperCase()}
        </span>
      </div>
      <h1
        className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white gradient-text pb-4 whitespace-pre-wrap"
        style={titleStyles}
      >
        {title}
      </h1>
      <div className="flex flex-wrap gap-3 pt-6">
        {tags?.map((tag: string) => {
          const isAccent =
            tag.toLowerCase() === "next.js" ||
            tag.toLowerCase() === "react" ||
            tag.toLowerCase() === "ai";
          return (
            <span
              key={tag}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500
                ${
                  isAccent
                    ? "border-(--accent-primary)/30 bg-(--accent-primary)/10 text-(--accent-primary) shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                    : "border-white/5 bg-white/2 text-white/40 hover:border-white/20 hover:text-white"
                }`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
