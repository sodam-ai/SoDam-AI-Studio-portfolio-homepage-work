import { motion } from "framer-motion";
import { Trash2, GripVertical } from "lucide-react";
import { SiteConfig } from "@/types/config";

interface ConnectorCardProps {
  connector: SiteConfig["connectors"][0];
  index: number;
  onUpdate: (index: number, field: "label" | "url", value: string) => void;
  onRemove: (index: number) => void;
}

export const ConnectorCard = ({
  connector,
  index,
  onUpdate,
  onRemove,
}: Readonly<ConnectorCardProps>) => {
  const labelId = `connector-label-${connector.id || index}`;
  const urlId = `connector-url-${connector.id || index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      className="p-6 bg-white/2 border border-white/5 group relative flex gap-4 items-start hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className="drag-handle pt-4 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors shrink-0">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 space-y-6">
        <button
          onClick={() => onRemove(index)}
          className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-all duration-200 active:scale-[0.98] opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
        >
          <Trash2 size={12} />
          Remove
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label
              htmlFor={labelId}
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              Label (e.g. GitHub, Email)
            </label>
            <input
              id={labelId}
              type="text"
              value={connector.label}
              onChange={(e) => onUpdate(index, "label", e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 text-xs outline-none focus:border-white/40 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={urlId}
              className="text-[8px] font-black uppercase tracking-widest text-white/30"
            >
              URL or Link
            </label>
            <input
              id={urlId}
              type="text"
              value={connector.url}
              onChange={(e) => onUpdate(index, "url", e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 text-xs outline-none focus:border-white/40 transition-colors font-mono tracking-tight"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
