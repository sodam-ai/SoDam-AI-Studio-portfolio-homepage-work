"use client";

import React from "react";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
}: Readonly<SectionProps>) {
  return (
    <section
      id={id}
      className={`w-full max-w-7xl px-6 mx-auto ${className || ""}`}
      style={{
        paddingTop: "var(--section-gap, 96px)",
        paddingBottom: "var(--section-gap, 96px)",
      }}
    >
      {(title || subtitle) && (
        <div className="mb-12 space-y-2">
          {subtitle && (
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-40">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-3xl font-black uppercase tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
