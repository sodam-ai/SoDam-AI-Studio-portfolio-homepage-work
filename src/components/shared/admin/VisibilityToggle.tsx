"use client";

import React from "react";
import { AdminCard } from "./AdminSection";

interface VisibilityToggleProps {
  label: string;
  description: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  id: string;
}

export const VisibilityToggle = ({
  label,
  description,
  value,
  onChange,
  id,
}: VisibilityToggleProps) => {
  const isEnabled = value !== false;
  return (
    <AdminCard>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label
            id={`label-${id}`}
            htmlFor={id}
            className="text-[10px] font-black uppercase tracking-widest text-white/40 block cursor-pointer"
          >
            {label}
          </label>
          <p className="text-[9px] text-white/20 uppercase tracking-wider">
            {description}
          </p>
        </div>
        <button
          id={id}
          type="button"
          onClick={() => onChange(!isEnabled)}
          className={`w-12 h-6 rounded-full transition-all duration-300 p-1 flex items-center ${
            isEnabled ? "bg-white" : "bg-white/10"
          }`}
          aria-labelledby={`label-${id}`}
        >
          <div
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              isEnabled ? "translate-x-6 bg-black" : "translate-x-0 bg-white/20"
            }`}
          />
        </button>
      </div>
    </AdminCard>
  );
};
