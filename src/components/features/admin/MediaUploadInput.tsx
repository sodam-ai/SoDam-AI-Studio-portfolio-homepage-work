"use client";
import React from "react";
import { Upload } from "lucide-react";

interface MediaUploadInputProps {
  readonly id: string;
  readonly label?: string;
  readonly value: string;
  readonly onUrlChange: (value: string) => void;
  readonly onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly isUploading: boolean;
  readonly uploadLabel?: string;
  readonly placeholder?: string;
  readonly accept?: string;
}

export function MediaUploadInput({
  id,
  label,
  value,
  onUrlChange,
  onFileUpload,
  isUploading,
  uploadLabel = "File",
  placeholder = "https://...",
  accept,
}: MediaUploadInputProps) {
  const [mode, setMode] = React.useState<"url" | "file">(
    value ? "url" : "file",
  );

  return (
    <div className="space-y-3 w-full group">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[8px] font-black uppercase tracking-widest text-white/20 group-focus-within:text-white/50 transition-colors">
            {label}
          </label>
        )}
        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-3 py-1 text-[7px] uppercase font-black tracking-widest rounded-md transition-all duration-200 active:scale-[0.98] ${mode === "file" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"}`}
          >
            File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-3 py-1 text-[7px] uppercase font-black tracking-widest rounded-md transition-all duration-200 active:scale-[0.98] ${mode === "url" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white"}`}
          >
            URL
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-black/60 border border-white/10 rounded-2xl focus-within:border-white/30 transition-all shadow-2xl">
        {mode === "file" ? (
          <div className="relative w-full">
            <input
              type="file"
              id={`file-${id}`}
              className="hidden"
              accept={accept}
              onChange={onFileUpload}
              disabled={isUploading}
            />
            <label
              htmlFor={`file-${id}`}
              className={`flex items-center justify-center gap-3 w-full py-3 bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-[0.98] text-[10px] uppercase font-black tracking-[0.2em] rounded-xl border border-dashed border-white/10 hover:border-white/30
                ${isUploading ? "opacity-30 cursor-wait" : ""}`}
            >
              <Upload className="w-4 h-4 text-(--accent-primary) animate-pulse" />
              {isUploading ? "Uploading Mastery..." : `Select ${uploadLabel}`}
            </label>
          </div>
        ) : (
          <div className="flex-1 flex items-center px-4 py-2">
            <span className="text-[9px] text-white/20 font-mono mr-3 shrink-0">
              SRC:
            </span>
            <input
              id={`url-${id}`}
              type="text"
              value={value}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full bg-transparent p-0 text-sm focus:outline-none placeholder:text-white/5 font-mono text-white/80"
              placeholder={placeholder}
            />
          </div>
        )}
      </div>
    </div>
  );
}
