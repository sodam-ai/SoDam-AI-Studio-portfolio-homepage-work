import { getElementStyles } from "@/utils/styleUtils";
import { ElementStyle } from "@/types/style";

interface ProjectDetailsProps {
  fullDescription: string;
  description: string;
  approach: string;
  challenges: string[];
  descriptionStyle?: ElementStyle;
  approachStyle?: ElementStyle;
}

export function ProjectDetails({
  fullDescription,
  description,
  approach,
  challenges,
  descriptionStyle,
  approachStyle,
}: ProjectDetailsProps) {
  const descStyles = getElementStyles(descriptionStyle);
  const apprStyles = getElementStyles(approachStyle);
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-(--accent-primary) flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-(--accent-primary)" />
          {"//"} THE_BLUEPRINT
        </h3>
        <p
          className="text-2xl md:text-3xl font-black tracking-tight leading-[1.2] text-white whitespace-pre-wrap"
          style={descStyles}
        >
          {fullDescription || description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
            {"//"} STRATEGY_&_EXECUTION
          </h4>
          <p
            className="text-lg text-zinc-400 font-light leading-relaxed whitespace-pre-wrap"
            style={apprStyles}
          >
            {approach}
          </p>
        </div>
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
            {"//"} PROJECT_IMPACT
          </h4>
          <div className="flex flex-col gap-4">
            {challenges?.map((challenge, i) => (
              <div key={challenge} className="flex gap-4 group">
                <span className="text-(--accent-primary) font-black text-xs shrink-0">
                  0{i + 1}
                </span>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {challenge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
