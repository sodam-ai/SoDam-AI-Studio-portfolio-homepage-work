import { motion } from "framer-motion";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { getElementStyles } from "@/utils/styleUtils";
import { ElementStyle } from "@/types/style";

interface ContactHeaderProps {
  title?: string;
  description?: string;
  alignment?: "left" | "center" | "right";
  titleStyle?: ElementStyle;
  descriptionStyle?: ElementStyle;
  showLabel?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  animations?: {
    enabled: boolean;
    preset: "apple" | "trendy" | "minimal";
    speed: "slow" | "normal" | "fast";
  };
  contentOffset?: number;
}

export function ContactHeader({
  title = "Let's\nTalk",
  description = "I'm always open to discussing new projects, creative ideas or original visions.",
  alignment = "left",
  titleStyle,
  descriptionStyle,
  showLabel = true,
  showTitle = true,
  showDescription = true,
  contentOffset = 0,
  animations,
}: Readonly<ContactHeaderProps>) {
  const { getFadeInVariants } = useAnimationEngine(animations);
  const getAlignmentClass = () => {
    if (alignment === "center") return "text-center mx-auto items-center";
    if (alignment === "right") return "text-right items-end ml-auto";
    return "text-left items-start";
  };

  const formattedTitle = title.split("\n").map((line, i) => (
    <span key={`${line}-${i}`} className="block">
      {line}
    </span>
  ));

  const headerStyles = getElementStyles(titleStyle);
  const descStyles = getElementStyles(descriptionStyle);

  if (!showLabel && !showTitle && !showDescription) return null;

  return (
    <motion.div
      variants={getFadeInVariants("up")}
      initial="initial"
      animate="animate"
      className={`space-y-6 mb-24 flex flex-col transition-all duration-500 ${getAlignmentClass()}`}
      style={{
        marginTop: contentOffset ? `${contentOffset}px` : undefined,
      }}
    >
      {showLabel !== false && (
        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-bold block">
          Contact
        </span>
      )}
      {showTitle !== false && (
        <h1
          className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none whitespace-pre-wrap"
          style={headerStyles}
        >
          {formattedTitle}
        </h1>
      )}
      {showDescription !== false && (
        <p
          className="text-white/50 text-lg font-light leading-relaxed max-w-2xl whitespace-pre-wrap"
          style={descStyles}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
