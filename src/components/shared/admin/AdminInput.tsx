"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="text-[10px] font-bold uppercase tracking-widest text-white/40 block"
          >
            {label}
          </label>
        )}
        <div className="relative group/input">
          <input
            ref={ref}
            className={cn(
              "w-full bg-white/2 border border-white/5 px-4 py-4 text-xs text-white font-medium",
              "focus:outline-none focus:border-white/20 focus:bg-white/5",
              "transition-all duration-300 placeholder:text-white/10",
              error && "border-red-500/30 focus:border-red-500/50",
              className,
            )}
            {...props}
          />
          <div className="absolute bottom-0 left-0 h-px w-0 bg-white/20 transition-all duration-500 group-focus-within/input:w-full" />
        </div>
        {error && (
          <p className="text-[9px] text-red-500/80 font-medium tracking-tight italic">
            * {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[9px] text-white/20 font-medium tracking-tight italic">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

AdminInput.displayName = "AdminInput";
