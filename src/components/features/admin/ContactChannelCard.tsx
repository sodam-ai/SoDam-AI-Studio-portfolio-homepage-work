import { motion } from "framer-motion";
import { Trash2, GripVertical } from "lucide-react";
import { MediaUploadInput } from "./MediaUploadInput";
import { ContactChannel } from "@/types/contact";

interface ContactChannelCardProps {
  channel: ContactChannel;
  onRemove: () => void;
  onUpdate: (field: keyof ContactChannel, value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const ContactChannelCard = ({
  channel,
  onRemove,
  onUpdate,
  onFileUpload,
  isUploading,
}: ContactChannelCardProps) => {
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
          className="drag-handle w-12 bg-white/2 flex items-center justify-center border-r border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
          aria-label="Drag to reorder channel"
        >
          <GripVertical
            className="w-4 text-white/10 group-hover:text-white/40 transition-colors"
            aria-hidden="true"
          />
        </button>

        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <button
            onClick={onRemove}
            className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 active:scale-[0.98] opacity-0 group-hover:opacity-100 rounded-md"
            title="Delete Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor={`type-${channel.id}`}
                  className="text-[8px] font-black uppercase tracking-widest text-white/20"
                >
                  Type
                </label>
                <input
                  id={`type-${channel.id}`}
                  type="text"
                  value={channel.type}
                  onChange={(e) => onUpdate("type", e.target.value)}
                  placeholder="e.g. email, kakao"
                  className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-bold outline-none focus:border-white/30 transition-colors rounded-xs"
                />
              </div>
              <div className="space-y-2">
                <MediaUploadInput
                  id={`icon-${channel.id}`}
                  label="Icon (Lucide NAME or Image URL)"
                  value={channel.icon}
                  onUrlChange={(val) => onUpdate("icon", val)}
                  onFileUpload={onFileUpload}
                  isUploading={isUploading}
                  uploadLabel="Icon File"
                  accept="image/*"
                  placeholder="e.g. Mail OR /uploads/icon.png"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor={`label-${channel.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                Label / Name
              </label>
              <input
                id={`label-${channel.id}`}
                type="text"
                value={channel.label}
                onChange={(e) => onUpdate("label", e.target.value)}
                placeholder="e.g. 이메일, 카카오톡"
                className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-tight outline-none focus:border-white/30 transition-colors rounded-xs"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`value-${channel.id}`}
                className="text-[8px] font-black uppercase tracking-widest text-white/20"
              >
                Display Value
              </label>
              <input
                id={`value-${channel.id}`}
                type="text"
                value={channel.value}
                onChange={(e) => onUpdate("value", e.target.value)}
                placeholder="e.g. hello@example.com"
                className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-bold outline-none focus:border-white/30 transition-colors rounded-xs"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label
              htmlFor={`action-${channel.id}`}
              className="text-[8px] font-black uppercase tracking-widest text-white/20"
            >
              Action (URL / mailto: / tel:)
            </label>
            <input
              id={`action-${channel.id}`}
              type="text"
              value={channel.action}
              onChange={(e) => onUpdate("action", e.target.value)}
              placeholder="e.g. mailto:hello@example.com"
              className="w-full bg-black/40 border border-white/5 px-4 py-3 text-[11px] font-medium transition-colors rounded-xs outline-none focus:border-white/30"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
