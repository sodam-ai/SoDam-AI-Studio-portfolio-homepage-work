import { motion } from "framer-motion";
import { getElementStyles } from "@/utils/styleUtils";
import { ElementStyle } from "@/types/style";

interface AboutIntroProps {
  introduction: string;
  story: string;
  alignment?: "left" | "center" | "right";
  layoutType?: "split" | "full" | "minimal";
  introductionStyle?: ElementStyle;
  storyStyle?: ElementStyle;
  showDescription?: boolean;
  contentOffset?: number;
}

export function AboutIntro({
  introduction,
  story,
  alignment = "left",
  layoutType = "full",
  introductionStyle,
  storyStyle,
  showDescription = true,
  contentOffset = 0,
}: Readonly<AboutIntroProps>) {
  const getAlignmentClass = () => {
    if (alignment === "center") return "text-center mx-auto items-center";
    if (alignment === "right") return "text-right items-end ml-auto";
    return "text-left items-start";
  };

  const alignmentClass = getAlignmentClass();
  const introStyles = getElementStyles(introductionStyle);
  const storyStyles = getElementStyles(storyStyle);

  if (layoutType === "split") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-32 pb-24 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 transition-all duration-500"
        style={{
          marginTop: contentOffset ? `${contentOffset}px` : undefined,
        }}
      >
        {showDescription !== false && (
          <div className={`flex flex-col ${alignmentClass}`}>
            <p
              className="text-3xl md:text-5xl font-black leading-[1.2] tracking-tight uppercase whitespace-pre-wrap"
              style={introStyles}
            >
              {introduction}
            </p>
          </div>
        )}
        <div className="flex flex-col justify-center">
          <p
            className="text-lg text-white/50 font-light leading-relaxed whitespace-pre-wrap"
            style={storyStyles}
          >
            {story}
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-32 pb-24 border-b border-white/10 flex flex-col transition-all duration-500 ${alignmentClass}`}
      style={{
        marginTop: contentOffset ? `${contentOffset}px` : undefined,
      }}
    >
      {showDescription !== false && (
        <p
          className="text-3xl md:text-5xl font-black leading-[1.2] tracking-tight uppercase max-w-5xl whitespace-pre-wrap"
          style={introStyles}
        >
          {introduction}
        </p>
      )}
      <p
        className="text-lg text-white/50 font-light leading-relaxed max-w-3xl mt-12 whitespace-pre-wrap"
        style={storyStyles}
      >
        {story}
      </p>
    </motion.section>
  );
}
