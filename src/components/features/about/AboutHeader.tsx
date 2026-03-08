import { motion } from "framer-motion";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { getElementStyles } from "@/utils/styleUtils";
import { ElementStyle } from "@/types/style";

interface AboutHeaderProps {
  title?: string;
  alignment?: "left" | "center" | "right";
  titleStyle?: ElementStyle;
  showLabel?: boolean;
  showTitle?: boolean;
  animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
  contentOffset?: number;
}

export function AboutHeader({
  title = "The\nCreator",
  alignment = "left",
  titleStyle,
  showLabel = true,
  showTitle = true,
  contentOffset = 0,
  animations,
}: Readonly<AboutHeaderProps>) {
  const { getFadeInVariants } = useAnimationEngine(animations);
  const getAlignmentClass = () => {
    if (alignment === "center")
      return "text-center mx-auto items-center flex flex-col";
    if (alignment === "right")
      return "text-right ml-auto items-end flex flex-col";
    return "text-left items-start flex flex-col";
  };

  const formattedTitle = title.split("\n").map((line, i) => (
    <span key={`${line}-${i}`} className="block">
      {line}
    </span>
  ));

  const headerStyles = getElementStyles(titleStyle);

  if (!showLabel && !showTitle) return null;

  return (
    <motion.div
      variants={getFadeInVariants("up")}
      initial="initial"
      animate="animate"
      className={`space-y-6 mb-24 transition-all duration-500 ${getAlignmentClass()}`}
      style={{
        marginTop: contentOffset ? `${contentOffset}px` : undefined,
      }}
    >
      {showLabel !== false && (
        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-bold block">
          About
        </span>
      )}
      {showTitle !== false && (
        <h1
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none whitespace-pre-wrap"
          style={headerStyles}
        >
          {formattedTitle}
        </h1>
      )}
    </motion.div>
  );
}
