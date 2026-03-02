import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "accent" | "danger";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-black text-white hover:bg-zinc-800",
      outline:
        "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100",
      ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
      accent: "bg-white text-black hover:bg-zinc-200",
      danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white",
    };

    const sizes = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
