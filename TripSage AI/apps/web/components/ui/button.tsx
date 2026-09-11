import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-sage-700 text-white hover:bg-sage-800 focus:ring-sage-600 shadow-sm",
      secondary: "bg-stone-800 text-stone-100 hover:bg-stone-700 focus:ring-stone-500",
      outline: "border border-stone-700 text-stone-200 hover:bg-stone-800/60 focus:ring-stone-600",
      ghost: "text-stone-300 hover:bg-stone-800/50 hover:text-white",
      gold: "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold hover:from-amber-400 hover:to-amber-500 shadow-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base tracking-wide",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
