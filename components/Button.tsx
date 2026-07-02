"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({ variant = "primary", size = "md", fullWidth = false, children, className = "", ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary: "bg-gradient-to-r from-[#1C3668] to-[#152A52] text-white hover:brightness-110 focus:ring-[#1C3668]/40 shadow-md",
    secondary: "bg-white text-[#1C3668] border border-[#1C3668]/30 hover:bg-[#F4F6F9] focus:ring-[#1C3668]/20",
    ghost: "text-[#1C3668] hover:bg-[#F4F6F9] focus:ring-[#1C3668]/20",
    danger: "bg-gradient-to-r from-[#E31837] to-[#B8122A] text-white hover:brightness-110 focus:ring-[#E31837]/40 shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-[15px]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`} {...rest}>
      {children}
    </button>
  );
}
