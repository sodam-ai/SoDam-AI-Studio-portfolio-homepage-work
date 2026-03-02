"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function AdminSection({
  title,
  description,
  children,
  className,
  icon,
}: Readonly<AdminSectionProps>) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-start justify-between border-b border-white/5 pb-6">
        <div className="flex gap-4">
          {icon && (
            <div className="p-3 bg-white/5 rounded-sm border border-white/10 text-white/60">
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
              {title}
            </h2>
            {description && (
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
    </section>
  );
}

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className }: Readonly<AdminCardProps>) {
  return (
    <div
      className={cn(
        "bg-white/2 border border-white/5 p-6 rounded-sm hover:border-white/10 transition-all duration-300 group",
        className,
      )}
    >
      {children}
    </div>
  );
}
