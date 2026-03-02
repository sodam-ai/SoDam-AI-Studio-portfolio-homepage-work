"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminControlGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminControlGroup({
  title,
  description,
  children,
  className,
}: AdminControlGroupProps) {
  return (
    <div
      className={cn(
        "space-y-8 p-8 bg-white/2 border border-white/5 rounded-xl shadow-2xl shadow-black/20",
        className,
      )}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[10px] text-white/30 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
