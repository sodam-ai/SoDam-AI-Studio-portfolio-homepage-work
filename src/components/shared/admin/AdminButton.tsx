"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const AdminButton = React.forwardRef<
  HTMLButtonElement,
  AdminButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-white text-black hover:bg-white/90 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] border border-white/20",
      secondary:
        "bg-white/5 text-white/90 hover:bg-white/10 hover:text-white active:scale-95 border border-white/10 shadow-lg shadow-black/40",
      outline:
        "bg-transparent border border-white/20 text-white/70 hover:border-white hover:text-white hover:bg-white/5 active:scale-95",
      ghost:
        "bg-transparent text-white/40 hover:text-white hover:bg-white/5 active:scale-95",
      danger:
        "bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white active:scale-95 shadow-lg shadow-red-500/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[10px] tracking-widest",
      md: "px-6 py-3 text-[10px] tracking-[0.2em] font-black",
      lg: "px-10 py-5 text-xs tracking-[0.3em] font-black",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{
          y: -1,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center font-black uppercase transition-all duration-200 overflow-hidden rounded-xs disabled:opacity-50 disabled:pointer-events-none select-none group",
          variants[variant as keyof typeof variants] || variants.primary,
          sizes[size as keyof typeof sizes] || sizes.md,
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-3 w-3 rounded-full border-2 border-current border-t-transparent"
            />
            <span className="animate-pulse">PROCESSING...</span>
          </div>
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        )}

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Glow Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/3 pointer-events-none" />
      </motion.button>
    );
  },
);

AdminButton.displayName = "AdminButton";
