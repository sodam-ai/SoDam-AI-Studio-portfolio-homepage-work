import React from "react";
import { Upload } from "lucide-react";
import { MediaUploadInput } from "./MediaUploadInput";

interface AdminMediaUploaderProps {
  id: string;
  type: "thumbnail" | "video" | "gallery" | "asset" | "live" | "github";
  label: string;
  value?: string | string[];
  isUploading: boolean;
  onUrlChange?: (val: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Specific to thumbnail/video
  aspectRatio?: string;
  onAspectRatioChange?: (val: string) => void;

  // Specific to generic/assets
  placeholder?: string;
  accept?: string;
  uploadLabel?: string;
}

export function AdminMediaUploader({
  id,
  type,
  label,
  value,
  isUploading,
  onUrlChange,
  onFileUpload,
  aspectRatio = "16/9",
  onAspectRatioChange,
  placeholder,
  accept,
  uploadLabel = "File",
}: AdminMediaUploaderProps) {
  // Helpers
  const renderThumbnailPreview = (url: string) => (
    <div className="mt-3 relative group">
      <div
        className="w-full bg-white/5 border border-white/10 overflow-hidden relative"
        style={{
          aspectRatio:
            aspectRatio && aspectRatio !== "auto" ? aspectRatio : "16/9",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Preview"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400/000000/FFFFFF?text=Invalid+Image+URL";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10">
          <span className="text-[8px] font-black uppercase tracking-widest text-white/70">
            Live Preview
          </span>
        </div>
      </div>
    </div>
  );

  const renderVideoPreview = (url: string) => (
    <div
      className="w-full bg-black border border-white/10 mb-2 overflow-hidden group relative"
      style={{
        aspectRatio:
          aspectRatio && aspectRatio !== "auto" ? aspectRatio : "16/9",
      }}
    >
      <video
        src={url}
        className="w-full h-full object-cover"
        controls
        muted
        playsInline
      />
      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[8px] font-bold uppercase tracking-tighter text-white/60">
        Live Preview
      </div>
    </div>
  );

  const renderAspectRatioSelect = () => (
    <div className="space-y-2 mt-3">
      <label
        htmlFor={`${id}-aspectRatio`}
        className="text-[8px] font-black uppercase tracking-widest text-white/20"
      >
        {type === "thumbnail" ? "Thumbnail Aspect Ratio" : "Video Aspect Ratio"}
      </label>
      <select
        id={`${id}-aspectRatio`}
        value={aspectRatio || "auto"}
        onChange={(e) => onAspectRatioChange?.(e.target.value)}
        className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-white outline-none"
      >
        <option value="auto">Auto (원본 비율)</option>
        <option value="16/9">16:9 (가로형)</option>
        <option value="9/16">9:16 (세로형)</option>
        <option value="1/1">1:1 (정사각형)</option>
        <option value="4/3">4:3 (가로형)</option>
        <option value="3/4">3:4 (세로형)</option>
      </select>
    </div>
  );

  if (type === "thumbnail") {
    const urlValue = typeof value === "string" ? value : "";
    return (
      <div className="space-y-4">
        <MediaUploadInput
          id={id}
          label={label}
          value={urlValue}
          onUrlChange={(val) => onUrlChange?.(val)}
          onFileUpload={onFileUpload}
          isUploading={isUploading}
          uploadLabel={uploadLabel}
          accept={accept || "image/*"}
          placeholder={placeholder || "/images/..."}
        />
        {urlValue && renderThumbnailPreview(urlValue)}
        {renderAspectRatioSelect()}
      </div>
    );
  }

  if (type === "video") {
    const urlValue = typeof value === "string" ? value : "";
    return (
      <div className="space-y-2">
        <label
          htmlFor={`videoUrl-${id}`}
          className="text-[8px] font-black uppercase tracking-widest text-white/20"
        >
          {label}
        </label>
        {urlValue && renderVideoPreview(urlValue)}
        <MediaUploadInput
          id={`videoUrl-${id}`}
          value={urlValue}
          onUrlChange={(val) => onUrlChange?.(val)}
          onFileUpload={onFileUpload}
          isUploading={isUploading}
          uploadLabel={uploadLabel}
          accept={accept || "video/*"}
          placeholder={placeholder || "https://..."}
        />
      </div>
    );
  }

  if (type === "gallery") {
    const arrayValue = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-end mb-1">
          <label
            htmlFor={id}
            className="text-[8px] font-black uppercase tracking-widest text-white/20"
          >
            {label}
          </label>
          <div className="relative">
            <input
              type="file"
              id={`file-${id}`}
              className="hidden"
              accept={accept || "image/*"}
              onChange={onFileUpload}
              disabled={isUploading}
              multiple // Usually gallery supports multiple
            />
            <label
              htmlFor={`file-${id}`}
              className={`flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-[0.98] text-[8px] uppercase font-black tracking-widest ${
                isUploading ? "opacity-50 cursor-wait" : ""
              }`}
            >
              <Upload className="w-2.5 h-2.5" />
              {isUploading ? "Syncing..." : uploadLabel || "Upload Gallery"}
            </label>
          </div>
        </div>
        <textarea
          id={id}
          value={arrayValue.join("\n")}
          onChange={(e) => onUrlChange?.(e.target.value)}
          rows={4}
          className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:border-white outline-none font-mono"
          placeholder={placeholder || "/images/extra1.jpg\\n/images/extra2.jpg"}
        />
      </div>
    );
  }

  // default for asset | live | github
  const urlValue = typeof value === "string" ? value : "";
  return (
    <MediaUploadInput
      id={id}
      label={label}
      value={urlValue}
      onUrlChange={(val) => onUrlChange?.(val)}
      onFileUpload={onFileUpload}
      isUploading={isUploading}
      uploadLabel={uploadLabel}
      accept={accept}
      placeholder={placeholder}
    />
  );
}
