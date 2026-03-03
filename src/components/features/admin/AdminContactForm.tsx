"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Plus, Trash2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { ReactSortable } from "react-sortablejs";
import AdminToast from "@/components/shared/admin/AdminToast";
import { Button } from "@/components/ui/button";
import { MediaUploadInput } from "./MediaUploadInput";

interface ContactChannel {
  id: string; // Temporarily added for sortable
  type: string;
  label: string;
  value: string;
  icon: string;
  action: string;
}

interface ContactData {
  headline: string;
  description: string;
  channels: ContactChannel[];
}

const ContactChannelCard = ({
  channel,
  onRemove,
  onUpdate,
  onFileUpload,
  isUploading,
}: {
  channel: ContactChannel;
  onRemove: () => void;
  onUpdate: (field: keyof ContactChannel, value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
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

export default function AdminContactForm() {
  const [data, setData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

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
  const generateId = useCallback(
    () => Math.random().toString(36).substring(2, 9),
    [],
  );

  const fetchContactData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/update?type=contact&t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );
      const result = await res.json();
      if (result.success) {
        const sanitizedData: ContactData = {
          ...result.data,
          channels: (result.data.channels || []).map(
            (ch: Partial<ContactChannel>) => ({
              ...ch,
              id: ch.id || generateId(),
            }),
          ),
        };
        setData(sanitizedData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [generateId]);

  useEffect(() => {
    fetchContactData();
  }, [fetchContactData]);

  const handleUpdate = (field: keyof ContactData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
    if (isSaved) setIsSaved(false);
  };

  const handleChannelUpdate = (
    id: string,
    field: keyof ContactChannel,
    value: string,
  ) => {
    if (!data) return;
    const updatedChannels = data.channels.map((ch) =>
      ch.id === id ? { ...ch, [field]: value } : ch,
    );
    setData({ ...data, channels: updatedChannels });
    if (isSaved) setIsSaved(false);
  };

  const handleFileUpload = async (
    channelId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(channelId);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        handleChannelUpdate(channelId, "icon", result.data.url as string);
        showToast("아이콘이 성공적으로 업로드되었습니다.");
      } else {
        showToast("업로드 실패: " + result.error, "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("업로드 중 에러가 발생했습니다.", "error");
    } finally {
      setIsUploading(null);
    }
  };

  const addChannel = () => {
    if (!data) return;
    const newChannel: ContactChannel = {
      id: generateId(),
      type: "new-channel",
      label: "NEW LABEL",
      value: "NEW VALUE",
      icon: "ExternalLink",
      action: "#",
    };
    setData({ ...data, channels: [...data.channels, newChannel] });
    if (isSaved) setIsSaved(false);
  };

  const removeChannel = (id: string) => {
    if (!data) return;
    const updatedChannels = data.channels.filter((ch) => ch.id !== id);
    setData({ ...data, channels: updatedChannels });
    if (isSaved) setIsSaved(false);
  };

  const setChannelsOrder = (newOrder: ContactChannel[]) => {
    if (!data) return;
    setData({ ...data, channels: newOrder });
    if (isSaved) setIsSaved(false);
  };

  const saveAll = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const dataToSave = {
        ...data,
        channels: data.channels.map((ch) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = ch;
          return rest;
        }), // Strip out temporary ID
      };

      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data: dataToSave }),
      });
      const result = await res.json();
      if (result.success) {
        setIsSaved(true);
        showToast("연락처/토크 설정이 성공적으로 동기화되었습니다.");
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
            Contact & Talk Hub
          </h2>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
            Synchronize communication channels & social sync
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
        {/* Main Copies */}
        <section className="space-y-8 max-w-4xl">
          <div className="space-y-3">
            <label
              htmlFor="headline"
              className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"
            >
              <span
                className="w-1 h-1 bg-white/20 rounded-full"
                aria-hidden="true"
              />{" "}
              Talk Headline
            </label>
            <input
              id="headline"
              type="text"
              value={data.headline}
              onChange={(e) => handleUpdate("headline", e.target.value)}
              placeholder="e.g. Let's Create Together"
              className="w-full bg-white/2 border border-white/10 px-6 py-5 text-base font-medium focus:border-white focus:bg-white/5 outline-none transition-all rounded-sm"
            />
          </div>
          <div className="space-y-3">
            <label
              htmlFor="description"
              className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2"
            >
              <span
                className="w-1 h-1 bg-white/20 rounded-full"
                aria-hidden="true"
              />{" "}
              Inquiry Narrative (Description)
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => handleUpdate("description", e.target.value)}
              rows={4}
              placeholder="Tell them encouraging words to contact you..."
              className="w-full bg-white/2 border border-white/10 px-6 py-5 text-sm leading-relaxed focus:border-white focus:bg-white/5 outline-none resize-none transition-all rounded-sm"
            />
          </div>
        </section>

        {/* Contact Channels Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">
                Communication Channels
              </h3>
              <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2">
                Drag handles to re-order social and sync links
              </p>
            </div>
            <Button
              onClick={addChannel}
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest border-white/10 px-5 h-9 hover:bg-white hover:text-black transition-all flex items-center gap-2 group rounded-full"
            >
              <Plus
                className="w-3 h-3 transition-transform group-hover:rotate-90"
                aria-hidden="true"
              />
              New Channel
            </Button>
          </div>

          <ReactSortable
            list={data.channels}
            setList={setChannelsOrder}
            animation={200}
            handle=".drag-handle"
            className="space-y-4"
          >
            {data.channels.map((channel) => (
              <ContactChannelCard
                key={channel.id}
                channel={channel}
                onRemove={() => removeChannel(channel.id)}
                onUpdate={(field, value) =>
                  handleChannelUpdate(channel.id, field, value)
                }
                onFileUpload={(e) => handleFileUpload(channel.id, e)}
                isUploading={isUploading === channel.id}
              />
            ))}
          </ReactSortable>
        </section>
      </div>
    </div>
  );
}
